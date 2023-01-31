---
title: I'm Building a Self-Destructing USB Drive Part 3
date: Fill me in
tags:
previous_post: /2022/08/31/I-m-Building-a-Self-Destructing-USB-Drive-Part-2/
next_post:
cover: img/built_usb.jpg # This needs to be in themes/clean-blog/source/img
---

I'm building an open-source USB drive with a hidden self-destruct feature. Say goodbye to your data if you don't lick your fingers before plugging it in. Its target customers are journalists in anti-privacy countries and security researchers.

---

Well, I'm a YouTuber now. If you like this content please subscribe and share within your network, it's popularity is directly proportional to making this content.

{% youtuber video Wrcy6ySjSu8 %}
{% endyoutuber %}

The blog format isn't going away, these posts will have more details while youtube will be high level flashy videos with ASMR reflow shots. It should also be noted that this blog post is around a month ahead of the video. So it has some updates for those following the project.

The boards were hand assembled by myself, I used a stencil + reflow hotplate for the top, and a stencil + heatgun for the bottom.

![](/img/usb-device.png)

After building the boards the device, I plugged them in the usb flash controller emumerated. It looks like this part of the design is working alright.

```
# dmesg logs
[1676446.082295] usb 3-1: new high-speed USB device number 16 using ehci-pci
[1676446.240444] usb 3-1: New USB device found, idVendor=090c, idProduct=3000, bcdDevice= 1.00
[1676446.240463] usb 3-1: New USB device strings: Mfr=1, Product=2, SerialNumber=0
[1676446.240467] usb 3-1: Product: SM3255AA MEMORY BAR
[1676446.240470] usb 3-1: Manufacturer: Silicon Motion,Inc.
[1676446.240926] usb-storage 3-1:1.0: USB Mass Storage device detected
[1676446.241158] scsi host7: usb-storage 3-1:1.0
[1676447.260193] scsi 7:0:0:0: Direct-Access USB MEMORY BAR   1000 PQ: 0 ANSI: 0 CCS
[1676447.261910] sd 7:0:0:0: [sdg] Media removed, stopped polling
[1676447.262814] sd 7:0:0:0: [sdg] Attached SCSI removable disk
```

However the on snag I ran into is the bloak device isn't showing any memory. I tried using gparted to create a partition but this didn't work.

``` bash
[machinehum@whitebox photos]$ lsblk
NAME   MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
sda      8:0    0 111.8G  0 disk
├─sda1   8:1    0   200M  0 part /boot
├─sda2   8:2    0    12G  0 part [SWAP]
└─sda3   8:3    0  99.6G  0 part /
sdb      8:16   0 476.9G  0 disk /home
sdc      8:32   0   489G  0 disk
├─sdc1   8:33   0 469.2G  0 part
├─sdc2   8:34   0     1K  0 part
└─sdc5   8:37   0  19.8G  0 part
sdd      8:48   0 931.5G  0 disk
└─sdd1   8:49   0 931.5G  0 part /mov
sde      8:64   0 931.5G  0 disk
└─sde2   8:66   0 931.5G  0 part /dat
sdg      8:96   1     0B  0 disk   # <--- This drive is the one
```

So at this point, there could be a few different things going on

  * The routing between the SM3257 (usb controller) and NAND flash is incorrect.
  * There's some firmware component on the SM3257 that I'm not aware of.
  * Something else I'm missing.

## From Russia With Love
I started snooping around and found a [Russian site](https://flashboot.ru/files/file/454/) with a download link for the "SMI MP Tool". The download contains a Windows executable for working with the SM3257EN, my flash controller IC. I downloaded it, fired up the VM and got the GUI working. However the VM was a Windows 10 machine, and when lauching the program the the drive was not detected by the program. I messed around with this for a quite a while, until I had the idea of trying a Windows XP VM. For some reason this actually worked.
![](/img/usb_winxp.png)

![](/img/usb_winxp-3.png)
At this point I had some very unsupported software with zero documentation beyond the discourse of Russians in the comment section. Pretty much everyone was just trying to fix their drives. I became completely defeated and started wondering if this was even possible. I contacted every single flash drive repair house I could find. The reality is people don't really build flash drives. I dedicated 30 minuets a day to "flash drive fuck around time" or, FD-FAT, for short. I would fire up the Windows XP VM, and press random buttons in the software and try a flash binaries in the folder to the drive.

One day I was in a FD-FAT session and I got the GUI to spit out "ISP can't be found!!", I googed this and got back to the same [Russian Site](https://www.usbdev.ru/articles/a_smi/ispcantbefound/). The most important thing to take out of the article is this "DYNA MPTool" exists. I downloaded this, hit the "Start" button and it provisioned the drive. I now have a working 2GB flash drive that I built from scratch.

![](/img/usb-device-asm.png)

I then got the device out of it's case and flew some wires to the programming pads of the MCU. This system will have to change in the future. I probably wont go for a USB bootloader, but at least something smaller and more accessible.
![](/img/atmel-header.jpg)

Some of you may remember from the last post the flash memory's chip select line is "or'd" with a pin from the microcontroller. This can be used to inhibit the flash. I tested this out and it worked beautifully. When you try mounting the device with mount command hangs for 20 seconds or so, then dmesg spit this out...

```
[3064125.755814] usb 3-1: reset high-speed USB device number 84 using ehci-pci
[3064125.906688] usb 3-1: device firmware changed
[3064125.906832] sd 6:0:0:0: [sdf] tag#0 FAILED Result: hostbyte=DID_TIME_OUT driverbyte=DRIVER_OK cmd_age=31s
[3064125.906844] sd 6:0:0:0: [sdf] tag#0 CDB: Read(10) 28 00 00 3f 57 80 00 00 08 00
[3064125.906842] usb 3-1: USB disconnect, device number 84
[3064125.906851] I/O error, dev sdf, sector 4151168 op 0x0:(READ) flags 0x80700 phys_seg 1 prio class 2
[3064125.919296] device offline error, dev sdf, sector 4151168 op 0x0:(READ) flags 0x0 phys_seg 1 prio class 2
[3064125.919314] Buffer I/O error on dev sdf1, logical block 518640, async page read
[3064125.920698] /dev/sdf1: Can't open blockdev
```

