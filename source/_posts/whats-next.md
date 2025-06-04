---
title: Pick Your Payload - What Open-source Security Hardware Should we Build Next?
date: 2025-06-04
---
**Everything we do is for educational and ethical purposes _only_.**

I build open source hardware that _I_ want, but I won't work on hardware nobody else wants. If people aren’t fired up, I can't get excited, so my projects only take off when there’s real interest. I’ve got three ideas, please pick your favourite. I only have so much time, and I want to gauge interest first. They're all cybersecurity/hacking devices, and must additionally meet these requirements:

- **Purposeful:** The device should solve a real problem.
- **Platform over Product:** Users should think "What can I make this do" over, "What can it do".
- **Educational:** Users learn from it.
- **Community Focused:** Users should be excited, share their experiences and be part of a community.
- **Open Source:** My work is **100%** open source. This is to reduce e-waste, empower users and provide an educational outlet.
- **Legal:** According to Canadian and Swiss law.

The ideas...

## The Blackhat - a Hacking Rig
_A handheld Linux-based computer with an emphasis on cybersecurity._

![](/img/hacking-rig.jpg)
You might already be familiar with the Flipper Blackhat — a single-board computer (SBC) add-on module I developed for the Flipper Zero. This would be a stand-alone version of the device. Let's get into the specs!


### Reasonable Keyboard
You won't have to retrain your fingers to type on this thing, no special key sequences, just a normal layout you would find on a PC. I would use a keyboard from Solder Party:

![](/img/sp-keeb.jpg)

I've touched this thing IRL, and it feels great: super clacky and tactile. @arturo182 designed it and it's gone into a few handheld cyberdecks already.

Additionally, I want the keyboard to be swappable, so the user can use a gamepad, trackpad, potentiometer, difference language keyboard, etc.

### GPIO and Ports
I would hope to include...

#### Ports
- 2x USB-A
- USB-C
- Headphone Jack
- HDMI
- Micro SD
- Ethernet if it fits
- Micro SD card

#### GPIO
- RPI form factor 2x20 headers with compatible pinout
- Flipper Zero compatible headers

### Wireless
- WiFi 2.4/5Ghz
- BT
- Lora

### The Shape
- Should be "handheld", a little larger than a GameBoy Colour.
- Powered by 2x 18650 cells.

## Cypherwatch
_Offline password keeper and cryptography engine on your wrist._

![](/img/cypherwatch.jpg)
A watch is an ideal hardware password keeper, since these devices only really work if you bring it everywhere. I'm personally not a fan of smartwatches, so I actually wear the classic Casio F91W. Cypherwatch would be very similar aesthetically, with a monochrome screen and USB-C port. The USB port can be connected to a PC for password injection and public-key-based authentication and signing.

I would also add some other goodies like...
- Keystroke injection
- EMMC that is exposed over USB-MSD for an encrypted USB drive. You can use it for datasmuggleing (I don't know what that is, but it sounds cool)
- Shell access to the MCU

It's important to note there would be zero overlap with existing smartwatch functionality.

## Root Rabbit
_USB/Ethernet Pentesting tool._

![](/img/root-rabbit.jpg)

The device features an ethernet port, a USB-A port, a side USB-C port, a DIP switch for payload selection, a battery and WiFi.

This can be used for, but not limited to:
- Virtual ethernet device
- Wireless keylogger
- Keystroke injection
- Network scanner
- Insert other hoodrat nasty exploit here

General Specs:
- **Processor:** SG2002
- **RAM:** 256MB
- **Disk:** SD Card
- **Wireless:** ESP32-C5 (5Ghz/2.4Ghz)
- **Battery:** Exists

## What now?
[Link here to vote](https://docs.google.com/forms/d/e/1FAIpQLSd-NHnerS3Yc0LiuKanCHcj7N8i9H2WL3qrmp7DtlQzH8sBpw/viewform?usp=sharing&ouid=112459697969469626051)

There is also a [discord server](https://discord.gg/EtZT7mjNuM) if you have a project suggestion, or want to engage in more discussion. Some upbeat/appreciative sentence here.
