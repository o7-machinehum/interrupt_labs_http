---
title: I'm Building a Self-Destructing USB Drive Part 3
date: 2022-12-15 00:00:00
tags:
previous_post: /2022/08/31/I-m-Building-a-Self-Destructing-USB-Drive-Part-2/
next_post:
---

I'm building an open-source USB drive with a hidden self-destruct feature. Say goodbye to your data if you don't lick your fingers before plugging it in. Its target customers are journalists in anti-privacy countries and security researchers.

---
// Embed youtube video

![](img/built_usb.jpg)


```
[1676446.082295] usb 3-1: new high-speed USB device number 16 using ehci-pci
[1676446.240444] usb 3-1: New USB device found, idVendor=090c, idProduct=3000, bcdDevice= 1.00
[1676446.240463] usb 3-1: New USB device strings: Mfr=1, Product=2, SerialNumber=0
[1676446.240467] usb 3-1: Product: SM3255AA MEMORY BAR
[1676446.240470] usb 3-1: Manufacturer: Silicon Motion,Inc.
[1676446.240926] usb-storage 3-1:1.0: USB Mass Storage device detected
[1676446.241158] scsi host7: usb-storage 3-1:1.0
[1676447.260193] scsi 7:0:0:0: Direct-Access              USB MEMORY BAR   1000 PQ: 0 ANSI: 0 CCS
[1676447.261910] sd 7:0:0:0: [sdg] Media removed, stopped polling
[1676447.262814] sd 7:0:0:0: [sdg] Attached SCSI removable disk
```

```
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
sdg      8:96   1     0B  0 disk
```
