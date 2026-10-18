---
title: I Built a Stereo Vision Board for Hackers
date: 2026-10-06 14:02:45
draft: true
---

*This article was written entirely by a human, for humans.*

---

I tend to get excited about certain chips - this time it was a microprocessor. The Rockchip RV1103 is a single-core ARM Cortex-A7 with 64 MB of DDR3 RAM and a four-lane MIPI CSI-2 bus shoved into a QFN-88 package. At the confluence of these specs lies a very interesting proposition: booting Linux on a very cheap, capable, and simple-to-design board.

The CSI bus has four lanes and two clocks, meaning it's possible to connect up two cameras, creating a stereo pair.

So that's exactly what I did.

{{< figure src="/img/4reel/4reel-front.jpg" caption="[Design Files](https://github.com/o7-machinehum/4reel)" >}}



This board can serve as the eyes for a robotics project with limited compute: an Arduino project that wants some obstacle avoidance or navigation with SLAM. The user can simply power it up and start getting this data over UART.

It also stands on its own with networking and all the other things you would expect from a Linux SoC. This video shows some of the depth data I was able to capture and process on the device.

{{< youtube id="l1qJyqeMBa0" class="video-container video-container--portrait" >}}

This blog post will outline the hardware, firmware, and software details.

# System Overview
![](/img/4reel/4reel-system-overview.svg)
The board also comes with an Ethernet port, USB-C, an accelerometer, 4 MB of flash, a microSD port, and a JST connector for power and UART connections.

# The PCB
The SoC is a QFN88, so a cheap four-layer board is plenty. The top layer had the controlled-impedance traces: USB, MIPI, and Ethernet. The next layer down was solid ground, and the remaining two were for signaling and power distribution.

![](/img/4reel/4reel_ee-B_Cu.svg)
![](/img/4reel/4reel_ee-In2_Cu.svg)
![](/img/4reel/4reel_ee-In1_Cu.svg)
![Top Layer](/img/4reel/4reel_ee-F_Cu.svg)
I got the board mostly right on the first shot, but there were a few issues.
- I requested the wrong SoC. Ouch, this was a fun replacement.
- The holes for the lens mounts were drilled at 1.8 mm instead of 2.2 mm; I had to drill them out.
- 1k resistors were too small to make the LEDs light up nicely.
- The 0.9 V trace was too thin, although it seemed to work fine.

# The Kernel, Bootloader and OS
I used my favorite Linux build system to generate the image: *Buildroot*. Sadly, not everything needed for this project is available upstream, including the Rockchip MIPI drivers, hardware accelerators, and some other key components. This means I needed to use the Rockchip BSP and vendor kernel.

For this chip, there are a few different boot stages. Most ARM MPUs look *something* like this:

1. **BootROM**: Gets TPL and runs it. This is in ROM and uses SRAM (smaller, non-main RAM).
2. **TPL** ("Tertiary Program Loader"): Sets up the DRAM controller. This is a binary from Rockchip.
3. **SPL** ("Secondary Program Loader"): Loads U-Boot, bundled with the U-Boot project.
4. **U-Boot**: This is our main bootloader; it will load the kernel. It has other fancy features.
5. **Kernel**: Linux.
6. **Init System**: Starts services.

So the upshot of Buildroot is that it will do all of this for us; with some [simple config](https://github.com/o7-machinehum/4reel/blob/master/os/configs/rv1103g_defconfig), we can have access to a shell in no time.

I started my interaction with the system over UART, but eventually moved to SSH. The USB-C port is configured to act as an Ethernet adapter and will DHCP me an IP so I can SSH into the device.

# The Software

![The SW architecture](/img/4reel/4reel-software-overview.svg)

I don't want to get too much into the Linux driver model, but you may notice things get more abstract at the higher end of the diagram. I2C is for configuration of the camera sensors while the data flows over MIPI CSI-2.

The **Rockchip CSI-2 / D-PHY drivers** are responsible for configuring the PHY hardware, while the data flows through the CIF capture block. The CIF capture has some nice features like hardware scaling. I'm using this to downscale the 1 MP images to 160 × 100 pixels in 8-bit grayscale per camera. I haven't gotten a reasonable frame rate with the full-size images yet.

The data eventually flows up to Video4Linux2, which exposes our data in sysfs nodes...

``` bash
# ls /dev/ | grep video
video0
video1
video10
video11
video12
video13
video14
video15
video16
video17
video18
video19
video2
video20
video21
video3
video4
video5
video6
video7
video8
video9
```

- Each camera shows 11 video nodes. This is for 2x cameras.
	- video0: Normal video capture
	- video1-3: Other stream IDs
	- video4-7: Scalers
	- video8-10: aux tools

So by now we're into userspace and can snag the data from the sysfs nodes with a userspace app and do what we wish. I didn't have the time to manually write this userspace app, so I used AI for quite a bit of this (as you can probably tell from the dashboard). It needs to be almost completely rewritten, but it's good enough for my initial proof of concept.

The userspace app takes the image data from the sysfs nodes `/dev/videoX` and feeds this into the `/dev/rve` node, which connects to the Rockchip SAD driver (sum of absolute differences). This is a hardware accelerator block that runs on the Rockchip SoC itself.

SAD explained. A greyscale image can be represented as a matrix, with each element being a number from 0 to 255. Let's say we have 2x images that are 2 × 2 px each. Let's calculate the SAD.
```

Image 1  Image 2  Absolute differences
[10  20] [10  20] [0  0]
[30  40] [30  40] [0  0]

SAD = 0 + 0 + 0 + 0 = 0

```

So with this basic math we can say "these images are the same".

Now let's say that instead of comparing these tiny images, we have two big images and break them up into 2 × 2 px images, called patches, and do this everywhere. We now have an algorithm to determine how similar *sections/patches* of the image are.

You can imagine two identical images, one with an apple on a table, and one without. We can now determine what's changed in the image, or a "per-section difference" if you will.

SAD-based stereo block matching uses the exact same principle, but compares patches after a horizontal shift. We keep one image fixed, shift the other, and try to find matching blocks; when the blocks match, this is a depth value. If they match at a very early shift, this is a far-away value, while a later shift is a closer image.

![Two stereo cameras](/img/4reel/4reel-stereo-disparity.svg)
So you can see that images farther away require less shifting to get a match, and once you get a match, the shifting required is your depth! The boxes show your patch size, and the green box is showing a SAD match. This is illustrated in this GIF below with three separate depths.

{{< figure src="/img/4reel/4reel-stereo-matching.gif" alt="A stereo image alignment animation. The right view slides over the fixed left view, pausing to highlight matching regions at three different depths in green." caption="Stereo images: [Middlebury Cones](https://vision.middlebury.edu/stereo/data/scenes2003/)." >}}

# What's Next?
I would like to sell a few of these devices and get some feedback.

If you're interested in this device, please sign up for the [email notification here](https://shop.rootkitlabs.com/products/4reel-stereo-camera). If I get more than 20 signups, I'll order another 10 boards with all the fixes and list these for sale. Please note this isn't a pre-order, but only sign up if you are serious about supporting the project :)

If I get enough interest, the next stage of the project is software cleanups, image optimisations, implementing SLAM, and implementing YOLO.

Thanks for reading!
