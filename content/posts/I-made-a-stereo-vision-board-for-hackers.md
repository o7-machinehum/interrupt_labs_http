---
title: I Built a Stereo Vision Board for Hackers
date: 2026-10-06 14:02:45
draft: true
---

*This article was written by a human, for humans.*

---

I tend to get excited about certain types of chips - and in this case it was a very interesting processor. The chip in question is an Rockchip RV1103, it's a single core ARM Cortex-A7 with 64MB of DDR3 RAM packaged in QFN-88. At the confluence of these specs lie a very interesting proposition: booting Linux on a very cheap, capible, and simple to design board.

I started taking a deeper look and quickly realised the chip has a MIPI-CSI2 bus with four lanes and two clocks. This means I can connect up two cameras creating a stereo pair.

So that's exactly what I did.

![](/img/4reel/4reel-front.jpg)

My hope is that this board can serve to act as the eyes for a robotics projects that don't have the compute other wise: an Arduino project that wants some obsticle avoidance, or navigation with slam. The user can simply power it up and start getting this data over serial.

Of course, it also stands completely on it own with networking and all the other things you would expect from Linux.

... bleh I hate this

## System Overview
![](/img/4reel/4reel-system-overview.svg)
The board also comes with some other niceities: an ethernet port, USB-C (wired into the RV1103), an accelerometer, 4 MB of flash, microSD port and a JST connector for power and UART connection.

## The PCB
I mentioned the SoC was a QFN88, this means it's simple to get a way with a cheap four layer board. The top later was the controlled impedance traces: USB, MIPI, Ethernet. While the next layer down was solid ground and the remaining two were signaling and power distrobution.

![](/img/4reel/4reel_ee-B_Cu.svg)
![](/img/4reel/4reel_ee-In2_Cu.svg)
![](/img/4reel/4reel_ee-In1_Cu.svg)
![Top Layer](/img/4reel/4reel_ee-F_Cu.svg)

## The Kernel, Bootloader and OS
I used my favorite Linux build system to generate the image: Buildroot. Sadly not everything needed for this project is available upstream, the Rockchip mipi drivers, hardware accelerators, and some other key components. This means I needed to the Rockchip BSP and vendor kernel.

For this chip, there a few different boot stages. Most ARM MPU's look *something* like this

1. **BootROM**: Gets TPL and runs it. This is in ROM, uses SRAM (smaller non-main ram)
2. **TPL**: "Tertiary Program Loader" Sets up the DRAM controller. This is binary from Rockchip.
3. **SPL**: "Secondary Program Loader" Loads uboot, bundled with the uboot project.
4. **uboot**: This is out main bootloader, it will load the kernel. Has other fancy features.
5. **kernel**: Linux.
6. **Init System**: Starts services

So the upshot of buildroot is it will do all of this for us, with some simple config we can have access to a shell in no time.

I started my interaction with the system over UART, but eventually moved to SSH. The USB-C port acts as an ethenet adapter

## The Software
- The chip has a SAD hardware accelerator
- I used this
- It worked
- embed video

## Conclusion
What's next
    - SLAM
    - VIO (whatever that is)
    -

I have some extra boards to sell, I'm letting them go at the cost I paid for them. I'm not

[Design Files](https://github.com/o7-machinehum/4reel)


