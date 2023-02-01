---
title: I'm Building a Self-Destructing USB Drive Part 3
date: 2023-02-01
tags:
previous_post: /2022/08/31/I-m-Building-a-Self-Destructing-USB-Drive-Part-2/
next_post:
cover: img/built_usb.jpg # This needs to be in themes/clean-blog/source/img
---

I'm building an open-source USB drive with a hidden self-destruct feature. Say goodbye to your data if you don't lick your fingers before plugging it in. Its target customers are journalists in anti-privacy countries and security researchers.

---

Well, I’m a YouTuber now. If you like this content, please subscribe and share it within your network. Its popularity is directly proportional to making this content.

{% youtuber video Wrcy6ySjSu8 %}
{% endyoutuber %}

The blog format is not going away. These posts will have more details, while youtube will be flashy high-level videos with reflow shots. It should also be noted that this blog post is around a month ahead of the video. So it has some updates for those following the project.

---

The boards were hand assembled by myself. I used a stencil + reflow hotplate for the top and a stencil + heat gun for the bottom.

![](/img/usb-device.png)

After building the device, I plugged it in, and the USB flash controller enumerated. So the USB databus and USB controller are working correctly. I then measured all three voltages rails, 1.8V, 3.3V and 5V. They all came up fine and looked stable. The dmesg logs got past the USB, usb-storage, scsi driver, but error out on the sd driver, for those interested [here](https://github.com/torvalds/linux/blob/master/drivers/scsi/sd.c#L2118) where the driver is sending the message. Interestingly, the same message is produced when you plug in an sd card reader with no SD card.

```
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

As expected from the above kernel logs, the block device isn't showing any... blocks.

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

So, there could be a few different things going on at this point.

  * The routing between the SM3257 (USB controller) and NAND flash is incorrect.
  * I'm not aware of some firmware components on the SM3257.
  * Something else I'm missing.

## From Russia With Love
I started snooping around and found a [Russian site](https://flashboot.ru/files/file/454/) with a download link for the "SMI MP Tool". The download contains a Windows executable for working with the SM3257EN, my flash controller IC. I downloaded it, fired up the VM and got the GUI working. However, the VM was a Windows 10 machine, and the drive was not detected when launching the program. I messed around with this for quite a while until I thought of trying a Windows XP VM. This actually worked for some reason.
![](/img/usb_winxp.png)

![](/img/usb_winxp-3.png)
At this point, I had some software with zero documentation beyond the discourse of Russians who were trying to fix their drives in the comment section. I became utterly defeated and started wondering if this was even possible. I contacted every single flash drive repair house I could find. People don't build flash drives. I dedicated 30 minutes a day to "flash drive fuck around time" or FD-FAT, for short. I would fire up the Windows XP VM, press random buttons in the software and try flash binaries in the folder to the drive.

One day I was in a FD-FAT session, and I got the GUI to spit out, "ISP can't be found!!" I googled this and ended up on the same [Russian Site](https://www.usbdev.ru/articles/a_smi/ispcantbefound/). The most important thing to take out of the article is this "DYNA MPTool" exists. I downloaded this, hit the "Start" button, and it provisioned the drive. I now have a 2GB flash drive I built from scratch.

![](/img/usb-device-asm.png)


## Testing
I used a few test applications. I started with badblock, which tests for spaces in memory that don't work. Badblock doesn't care about filesystems or partitions. It looks at a block device, which is why you specify /dev/sdf over a partition. It simply writes known data test patterns to the memory and reads them back.
```
[machinehum@whitebox ~]$ sudo badblocks -w -s -o error.log /dev/sdf
Testing with pattern 0xaa: done
Reading and comparing: done
Testing with pattern 0x55: done
Reading and comparing: done
Testing with pattern 0xff: done
Reading and comparing: done
Testing with pattern 0x00: done
Reading and comparing: done
```

With this working, I moved over to f3, which is partition aware. It works with files rather than raw memory blocks. These files are a pseudorandom bit sequence rather than a test pattern. It can then verify the data written and verify the speed.

```
[machinehum@whitebox ~]$ sudo f3write mnt/
F3 write 8.0
Copyright (C) 2010 Digirati Internet LTDA.
This is free software; see the source for copying conditions.

Free space: 1.91 GB
Creating file 1.h2w ... OK!
Creating file 2.h2w ... OK!
Free space: 16.00 MB
Average writing speed: 4.50 MB/s
[machinehum@whitebox ~]$ ls mnt/
1.h2w  2.h2w  lost+found
[machinehum@whitebox ~]$ sudo f3read mnt/
F3 read 8.0
Copyright (C) 2010 Digirati Internet LTDA.
This is free software; see the source for copying conditions.

                  SECTORS      ok/corrupted/changed/overwritten
Validating file 1.h2w ... 2097152/        0/      0/      0
Validating file 2.h2w ... 1882432/        0/      0/      0

  Data OK: 1.9 GB (3979584 sectors)
Data LOST: 0 MB (0 sectors)
	       Corrupted: 0.00 Byte (0 sectors)
	Slightly changed: 0.00 Byte (0 sectors)
	     Overwritten: 0.00 Byte (0 sectors)
Average reading speed: 13.12 MB/s
```
Defiantly not the fasted drive on the market, but it looks to be working! At this point, I'm thrilled. I got my drive working with the crazy unsupported software, which can hold data.

## Inhibit Circuity
I then got the device out of its case and flew some wires to the programming pads of the microcontroller. This system will have to change in the future. I probably won't go for a USB bootloader, but at least something smaller and more accessible.
![](/img/atmel-header.jpg)

Some of you may remember from the last post the flash memory's chip select line is "or'd" with a pin from the microcontroller. This can be used to inhibit the flash. I tested this out, and it worked beautifully. When you try mounting the device, the mount command hangs for 20 seconds, then dmesg spits this out.

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

This functionality is suitable for actors that might not want their drive to self-destruct but appear as a corrupted or broken drive. I'm not in the business of telling people what they can and can't do with this open source device.

## Destruction Circuitry
Finally, we're getting to the good part, what everyone has been asking for. Recall the destruction circuit from the previous post.
![](/img/distruct.png)
The operation is simple C1, C2, D1, and D2 form a voltage doubler. When `Distruct_PWM` is 0V, C1 will charge to 5V. When `Distruct_PWM` goes high, the potential across C1 will go to 10V because voltages in series add. This forces current into C2 over D2 and will eventually charge to 10V. When I want to kill the flash, I can enable Q1 via `Kill_switch` and short 10V to 3.3V.

I started with the original circuitry, which didn't produce any smoke. However, when I plugged it in, I reran our trusty f3read command.

```
[machinehum@whitebox ~]$ sudo f3read mnt/
F3 read 8.0
Copyright (C) 2010 Digirati Internet LTDA.
This is free software; see the source for copying conditions.

                  SECTORS      ok/corrupted/changed/overwritten
Validating file 1.h2w ... 2097152/        0/      0/      0
Validating file 2.h2w ... 1372480/   509952/      0/      0

  Data OK: 1.65 GB (3469632 sectors)
Data LOST: 249.00 MB (509952 sectors)
	       Corrupted: 249.00 MB (509952 sectors)
	Slightly changed: 0.00 Byte (0 sectors)
	     Overwritten: 0.00 Byte (0 sectors)
Average reading speed: 13.52 MB/s
```

Much was intact, but we did corrupt around 250MB of memory! I upgraded C2 from a 22uF to 122uF via electrolytic in parallel, I could fit 100uF on the board with two 47uF in parallel, but this is all I had lying around. I was paranoid about damaging my PC, so I powered the device with a bench supply.

Then I repeated my experiment, and things worked!

![](/img/smoke.gif)

I plugged in the drive, and nothing happened, literally nothing. No partition, no block device, no dmesg logs, nothing. It looks like the USB controller IC was fried. In the interest of completion sake, I replaced that chip, then went through the steps to provision again, and the chip couldn't recognize the NAND flash. I think it's fair to say she's dead, Jim.

It's been quite a long process, but I'm thrilled to say I've built the first spit-detecting, self-destructing flash drive. If you're interested in following this project, my socials are below. I would like to build more units and do more extensive testing on the device to get those out to the public, so stay tuned for that!
