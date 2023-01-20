---
title: I'm Building a Self-Destructing USB Drive Part 3
date: 2022-12-15 00:00:00
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

The blog format isn't going away, these posts will have the nitty-gritty details while youtube will be high level flashy videos with ASMR reflow shots. That being said, lets get into the nitty gritty.

The boards were hand assembled by myself, I used a stencil + reflow hotplate for the top, and a stencil + heatgun for the bottom.

![](/img/usb-device.png)

The devices fit inside the plastic enclosure I sourced quite nicely. I havn't sorted out how I'm going to make space for the elctrodes quite yet, but I assume it's going to be a post processing machineing step drilling a few holes.

![](/img/usb-device-asm.png)

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
I started snooping around and found a [site here](https://flashboot.ru/files/file/454/). It's a Russian site that has a download link for the "SMI MP Tool". The download contains a Windows executable for working with the SM3257EN, my flash controller IC. I downloaded it, fired up the VM and got the GUI working. However the VM was a Windows 10 machine, and when lauching the program the the drive was not detected by the program at all. I messed around with this for a quite a while, until I had the idea of trying a Windows XP VM. For some reason this actually worked.
![](/img/usb_winxp.png)


![](/img/usb_winxp-3.png)


```
[machinehum SMI_MPT_v.2.5.42_7_15-05-04]$ ls -l UFD_3257ENAA/Samsung/
total 1196
-rw-r--r--. 1 machinehum machinehum 73728 Apr 14  2015 SM3257ENAAISP-27nm.BIN
-rw-r--r--. 1 machinehum machinehum 73728 Jan 30  2013 SM3257ENAAISP-bucket00.BIN
-rw-r--r--. 1 machinehum machinehum 71680 Oct 23  2012 @SM3257ENAAISP-bucket01.BIN
-rw-r--r--. 1 machinehum machinehum 71680 Sep  7  2012 SM3257ENAAISP-bucket01.BIN
-rw-r--r--. 1 machinehum machinehum 89088 May 13  2015 SM3257ENAAISP-ISPSA16nmTLC.BIN
-rw-r--r--. 1 machinehum machinehum 86016 Nov  6  2013 SM3257ENAAISP-ISPSA19nmTLC4P-2die.BIN
-rw-r--r--. 1 machinehum machinehum 89088 Apr 17  2015 SM3257ENAAISP-ISPSA19nmTLC4P.BIN
-rw-r--r--. 1 machinehum machinehum 89088 Nov 14  2013 SM3257ENAAISP-ISPSA19nmTLC-AAG.BIN
-rw-r--r--. 1 machinehum machinehum 89088 May 13  2015 SM3257ENAAISP-ISPSA19nmTLC.BIN
-rw-r--r--. 1 machinehum machinehum 89088 May 13  2015 SM3257ENAAISP-ISPSA21nmTLC.BIN
-rw-r--r--. 1 machinehum machinehum 73728 May 13  2015 SM3257ENAAISP-SA16nmC.BIN
-rw-r--r--. 1 machinehum machinehum 73728 Apr 14  2015 SM3257ENAAISP-SA19nmMLC.BIN
-rw-r--r--. 1 machinehum machinehum 73728 Apr 14  2015 SM3257ENAAISP-SA21nmMLC.BIN
-rw-r--r--. 1 machinehum machinehum 73728 Apr 14  2015 SM3257ENAAISP-SA27nmMLC.BIN
-rw-r--r--. 1 machinehum machinehum 24576 Jul 25  2013 SM3257ENAATSPTEST24nm4P-2die.bin
-rw-r--r--. 1 machinehum machinehum 24576 Jan 20  2015 SM3257ENAATSPTEST24nm4P.bin
-rw-r--r--. 1 machinehum machinehum 24576 Nov 12  2013 SM3257ENAATSPTEST24nm-AAG.bin
-rw-r--r--. 1 machinehum machinehum 24576 May  6  2015 SM3257ENAATSPTEST24nm.bin
```


https://www.usbdev.ru/files/smi/smimptool/
