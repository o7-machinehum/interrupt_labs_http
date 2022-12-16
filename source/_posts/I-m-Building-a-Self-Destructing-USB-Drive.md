---
title: I'm Building a Self-Destructing USB Drive
date: 2022-07-29 14:02:45
next_post: https://interruptlabs.ca/2022/08/31/I-m-Building-a-Self-Destructing-USB-Drive-Part-2/
---

Because we all know the best way to keep your data safe is by blowing it up, right?
![](https://cdn-images-1.medium.com/max/1024/1*3NhahmZ5sI8ZNdo98FUSsg.png)

Well, for most of us, the real answer lies with encryption. But consider this: there are certain countries where it is dangerous to be a journalist. Now pretend you're investigating political corruption in one of these countries; in such cases, it may not be safe for you to be found with an encrypted drive.

My idea is to build a USB drive that is cosmetically and functionally identical to your run-of-the-mill USB. But there is one difference: if you plug it in normally, it doesn't produce any data.

Now, what's something a sane person would never do before plugging in an ordinary flash drive? **Lick their fingers.**

That's right; The drive will have hidden electrodes that measure the resistance of the finger plugging it in. A finger is around 1.5MΩ, but wet fingers are around 500kΩ. When the device boots, the drive will appear blank if the resistance between the electrode pair is higher than a threshold. It's not the prettiest system, but I think it strikes a nice balance of ridiculousness and functionality. The germaphobes among us can run their fingers under the tap.

#### The Design

A flash drive is a relatively simple design electrically. For the first version, I'm going to target USB2.0 speeds.
![](https://cdn-images-1.medium.com/max/822/1*5AksmpJAY73SdXFekJQ43g.png)

The typical flash drive is composed of a USB controller (blue) connected to a NAND flash chip (red). The flash chip holds all the data, while the controller contains a USB front end and logic to interface with the flash chip. To achieve my desired functionality, ill use a USB controller with a small microcontroller to read the electrodes and inhibit the flash chip if necessary.

Understanding component economics is essential when designing hardware. The flash chip is **generic** and can be used in anything: smart TVs, computer BIOS, cars, you name it. However, the USB controller is an **application-specific **component for flash drives.

Application-specific ICs come around when there's a huge market, and you need to squeeze margins. There might only be a few dozen flash drive companies worldwide, and the engineering is stale. The lion's share of the volume comes from several huge factories with razor-thin margins. There's no hot new flash drive startup that's going to disrupt the market. Digikey or Mouser isn't the place to look for sourcing application-specific components.

I scoured the internet for flash drive teardowns, searched the text on the chips, and found a [gold mine](http://www.pc-3000flash.com/solbase/index.php?lang=eng): a flash drive database that lists part numbers for several USB controller ICs. I then checked to see if I could get a datasheet and a vendor — I settled on the SM3257EN.
![](https://cdn-images-1.medium.com/max/526/1*WzMwtEIlDvDrRhlVkKydTA.png)<figcaption>SM3257EN Block diagram</figcaption>

This chip looks like it should do the trick; the datasheet is well written and has enough information. I created the part in Kicad and imported it with a NAND flash chip and USB jack.

I now have to make the device hide the data unless the user licks their fingers.

A chip enable (CE) signal from the USB controller is designed to connect straight to the flash chip. When this signal is low, the flash chip will enable. I will use an &quot;or gate&quot; with my control signal to turn force the memory off.
![](https://cdn-images-1.medium.com/max/724/1*7iut5aVjWoNkCJbMzP3jbA.png)

When my inhibit signal is high, it doesn't matter if the status of CE. The output of the gate will be high, which disables the flash memory.

As for controlling the inhibit signal itself, I'm going to use an [ATTINY24](https://www.digikey.ca/en/products/detail/microchip-technology/ATTINY24A-CCUR/2357342), and a transconductance amplifier hooked up to the electrodes. I'll get more into that next post.

#### The Mission

I'm trying to build hardware that solves problems and builds a community. If you think you might have a use for the hardware in this post or would like to help out, I would love to hear from you. I've created a [Discord](https://discord.gg/EtZT7mjNuM) server with like-minded people! Everything is on [github](https://github.com/Machine-Hum/ovrdrive)!
![](https://cdn-images-1.medium.com/max/799/1*qaew9czYRuC--KSqTZQRDg.png)

