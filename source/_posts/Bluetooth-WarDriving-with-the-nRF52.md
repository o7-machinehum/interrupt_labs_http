---
title: Bluetooth WarDriving with the nRF52
date: 2021-10-15 10:47:30
---

The nRF52 is a very popular Bluetooth chip that has taken over most of the wireless embedded space. The system-on-chip (SoC) houses an ARM Cortex M4 and 2.4Ghz radio to implement various wireless protocols. In this tutorial, I want to walk through setting up a Zephyr RTOS environment and building/flashing some code to do some wardriving.

But first, what is wardriving?
> **Wardriving** is the act of searching for Wi-Fi wireless networks, usually from a moving vehicle, using a laptop or smartphone.> — Wikipedia

We’re going to do some “Bluetooth wardriving”, and we’re not going to be driving. I’m planning on “forgetting” a battery-powered nRF52 in a public space for a few days and see what sort of Bluetooth data we can collect.

If you’re following along at home, you’re going to need the following things.

*   nRF52DK, I’m using PCA10040
*   Unix system or WSL

I’m going to be using Zephyr RTOS, so before getting started, [do all this](https://docs.zephyrproject.org/latest/getting_started/index.html) and install [nrfjprog](https://www.nordicsemi.com/Products/Development-tools/nRF-Command-Line-Tools).

### Project Requirements

Before we start, it’s a good idea to define where we want to end up. I’ll list some requirements below.

1.  The device can scan for nearby Bluetooth devices.
2.  The device can timestamp the data.
3.  The device can keep the addresses in non-volatile memory
4.  The device is battery-powered and lasts for days.

### Building / Flashing Blinky

Please keep in mind code prefixed with “$” are bash commands, while code with no prefix is output. To conserve space, I haven’t displayed all output. Start by navigating to the zephyr folder and update. I am assuming you checked out zephyrproject right in your home directory.
<pre>$ cd ~/zephyrproject/zephyr/
$ west update
$ ls boards/arm | grep nrf52dk</pre>

You should get an output of all the nrf52dk boards. Most likely, you want nrf52dk_nrf52832\. So let’s build some simple firmware for that board.
<pre>$ cd samples/basic/blinky
$ west build -b nrf52dk_nrf52832
$ west flash</pre>

You should now get a blinking light. What a pain in the ass; feel free to turn back and use Segger Studio forever.

#### Device Tree

A keen observer would note that samples/basic/blinky/ is not related to any specific hardware. Blinky knows the correct GPIO for this LED using the nrf52 device tree file.
<pre>$ cd ~/zephyrproject/zephyr/ # Move back to the project root
$ find . -name nrf52dk_nrf52832.dts
./boards/arm/nrf52dk_nrf52832/nrf52dk_nrf52832.dts</pre>

Take a look at that dts file and look for a “led0”. The device tree file provides information to a generic project about a specific board. Device tree is extremely powerful and used all around the Linux Kernel. If you want to understand the ins and outs of Device Tree, I would recommend this video, but I will talk more about it later on.
<iframe src="https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2Fm_NyYEBxfn8%3Ffeature%3Doembed&amp;display_name=YouTube&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3Dm_NyYEBxfn8&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2Fm_NyYEBxfn8%2Fhqdefault.jpg&amp;key=a19fcc184b9711e1b4764040d3dc5c07&amp;type=text%2Fhtml&amp;schema=youtube" width="854" height="480" frameborder="0" scrolling="no">[https://medium.com/media/e1669fa084eac77c221689f8994cb330/href](https://medium.com/media/e1669fa084eac77c221689f8994cb330/href)</iframe>

#### Config Files

Before we move on, it’s important to understand the config system. These are files of the form: *.conf and *_defconfig. You can edit these files manually or with menuconfig. After launching west build you should see something like this.
<pre>Loaded configuration '(path)/nrf52dk_nrf52832_defconfig'</pre>

Open this file up and take a look. This is the base config for your board. There is also an prj.conf in the blinky folder, and this gets merged with the base config and written to build/zephyr/.config . Let us take a look at menuconfig.
<pre>west build -t menuconfig</pre>![](https://cdn-images-1.medium.com/max/630/1*8KMk5DvUf57L9rcrcWoneA.png)<figcaption>menuconfig</figcaption>

Menuconfig is an interface to enable and disable settings; these settings will get saved to a config file.

### Bluetooth Central

Let’s do something with Bluetooth! We want to develop a device that scans for other Bluetooth devices. This is called a “Central” in Bluetooth speak.
<pre>$ cd ~/zephyrproject/zephyr/samples/bluetooth/central_hr
$ west build -b nrf52dk_nrf52832
$ west flash
$ screen /dev/ttyACM0 115200 # Or whatever ACM you are
# Now reset the board, you should see something like this \/</pre>

![](https://cdn-images-1.medium.com/max/544/1*-EfGxxdtvQRNbUP2-uvZ6Q.png)

These are the MAC addresses of nearby Bluetooth devices. [Here is a more extended output](https://pastebin.com/raw/YUv7CLKm). I want to log these MAC’s with their Received Signal Strength Indicator (RSSI) and a timestamp. I want to use non-volatile memory, so that brings us to the next part.

### SD Card

SD cards are a cheap and easy way to log some data from a microcontroller. They usually use SDIO but can also work over SPI. I had an Arduino SD card breakout lying around.
![](https://cdn-images-1.medium.com/max/1024/1*X6EnJeYw89jhe3HpZvdXhg.jpeg)<figcaption>Arduino SD card interface</figcaption>

Most Arduino’s are 5V logic level while SD cards are 3.3V. This board has a 3.3V regulator and a level shifter to convert the logic levels. As the nRF52 is 3.3V, I ripped all that off and made the required modifications to interface directly. Let’s go to the fatfs project folder.
<pre>cd ~/zephyrproject/zephyr/samples/subsys/fs/fat_fs</pre>

Fatfs is a project created by [Elm Chan](http://elm-chan.org/fsw/ff/00index_e.html) which allows microcontrollers to recognize filesystems, specifically FAT and FAT32 filesystems. We can use fatfs to log data to the SD card. Take a look in the boards folder. We can see some *.conf and *.overlays files.

#### Device Tree Overlays and Configs

Device Tree overlays are special files that get laid on top of base device tree files. Let’s take a look in nrf52840_blip.overlay
<pre>
 &amp;spi1 {
        status = &quot;okay&quot;;
        cs-gpios = &lt;&amp;gpio0 17 GPIO_ACTIVE_LOW&gt;;        sdhc0: sdhc@0 {
                compatible = &quot;zephyr,mmc-spi-slot&quot;;
                reg = &lt;0&gt;;
                status = &quot;okay&quot;;
                label = &quot;SDHC0&quot;;
                spi-max-frequency = &lt;24000000&gt;;
        };
};</pre>

This file is overlaying some information into spi1, it’s telling the build system that we want to use the spi1 bus for sdhc0 which is the sd card driver. We’re also specifying a chip select line. If we look inside nrf52840_blip.conf
<pre>CONFIG_DISK_DRIVER_SDMMC=y
CONFIG_SPI=y</pre>

We can see this config file is turning on spi and sdmmc. We now want to copy the nrf52840_blip files for use in our boards.
<pre>cd boards
cp nrf52840_blip.overlay nrf52dk_nrf52832.overlay
cp nrf52840_blip.conf nrf52dk_nrf52832.conf
cd ..
west build -b nrf52dk_nrf52832</pre>

Since your build board has the same name as the overlay’s, you should see something that says “Found devicetree overlay” and “Merged configuration” in your build spew. West will put the final device tree file in build/zephyr/zephyr.dts , you can open this up and see sdhc0 nesting inside spi1.
<pre>spi1: spi@40004000 {
    #address-cells = &lt; 0x1 &gt;;
    #size-cells = &lt; 0x0 &gt;;
    reg = &lt; 0x40004000 0x1000 &gt;;
    interrupts = &lt; 0x4 0x1 &gt;;
    status = &quot;okay&quot;;
    label = &quot;SPI_1&quot;;
    compatible = &quot;nordic,nrf-spi&quot;;
    sck-pin = &lt; 0x1f &gt;;
    mosi-pin = &lt; 0x1e &gt;;
    miso-pin = &lt; 0x1d &gt;;
    cs-gpios = &lt; &amp;gpio0 0x11 0x1 &gt;;
    sdhc0: sdhc@0 {
        compatible = &quot;zephyr,mmc-spi-slot&quot;;
        reg = &lt; 0x0 &gt;;
        status = &quot;okay&quot;;
        label = &quot;SDHC0&quot;;
        spi-max-frequency = &lt; 0x16e3600 &gt;;
    };
};</pre>

You can then convert those hex values after sck-pin, mosi-pin, miso-pin to get your SD card wiring, and bob’s your uncle. Flash the board with west flash and open a serial port like before, pop in an SD card and reset your board — you should see [something like this](https://pastebin.com/raw/X3APGksj).

### New Project

It’s about time we start to build our app. I want to [fork this app](https://github.com/zephyrproject-rtos/example-application) and make it our own.
<pre>$ west init -m https://github.com/zephyrproject-rtos/example-application --mr main my-workspace
$ cd my-workspace
$ west update
$ cd example-project
$ west build</pre>

I had issues building this, so I wiped out most of the code and pulled in some of the other stuff we [worked on before.](https://github.com/o7-machinehum/nRF52_War_Driving/blob/d09d4706e515ff42ddd0df914f0a82f19c70ca09/app/src/main.c) You can see I’ve stripped out most of the existing Bluetooth code, as we’re only concerned with scanning for other Bluetooth devices right now. I pulled in the SD card stuff and tested it. I encourage you to look through [the repository](https://github.com/o7-machinehum/nRF52_War_Driving). The repository is open so that anyone can expand on the project.

#### One Small Hiccup

I noticed one of the LEDs on the board was flickering. This wiring isn’t ideal as I want to dead drop the device for days and flicker a pointless LED is very power hungry. I looked into the board’s schematic, and it turned out my chip select (CS) pin for my micro SD card was sharing a pin with LED1!
![](https://cdn-images-1.medium.com/max/275/1*IKiw7lijnwmf-X5b60es_g.png)

I changed the device tree file to use another pin, moved the jumper over and starting have issues mounting the drive. Looking at the schematic above, you can see the pin is being pulled high to Vdd through R1\. When the SD card is powered on without the pullup, something goes wrong in the hardware. I added this pullup with a regular 10k, and it started working.

### The Drop

With everything in place, it’s time for the dead drop. I opted for an old pelican case buried in the dirt.
![](https://cdn-images-1.medium.com/max/963/0*Ea4dGXYpCjbX0MND)<figcaption>Just in case someone thought it was a bomb.</figcaption>

While doing my usual 2 AM workout, I tripped, launching the device into a nearby hole. As I pulled my back at the gym, I couldn’t bend over to pick it up, so the only safe thing to do was bury the device and pick it once I had healed.

### The Retrieval

Once my back healed up, I picked up the drop. I slammed together a quick [python script](https://github.com/o7-machinehum/nRF52_War_Driving/blob/main/py/main.py) to analyze the data, and it reported there were 7054 MAC addresses discovered and 799 unique MAC addresses! A keen code observer would note that I imported a little API for finding the vendors as well. I then plotted this.
![](https://cdn-images-1.medium.com/max/701/1*1Qf0RvHGn6Uh9XjPEMcRxw.png)

### Moving Forward

I want to continue my wardriving work but up the ante with location inference. In the dataset, we have the RSSI strength, which is correlated to distance from the device. RSSI gives a magnitude of a vector with the angle θ unknown.
![](https://cdn-images-1.medium.com/max/512/0*xCyz5Stb89x8vuNh)<figcaption>θ Unknown</figcaption>

With some basic knowledge of the environment, i.e. people won’t be standing on obstacles. We can reduce the number of solutions. We can reduce the solutions set again by looking at the time series and understanding people won’t be jumping from place to place. Perhaps one day, we can fully track people just with Bluetooth.
