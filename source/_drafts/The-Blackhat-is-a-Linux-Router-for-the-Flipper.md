---
title: The Blackhat is a Linux Router for the Flipper
date: 2024-01-23 09:34:57
tags:
---

I've created a Linux enabled WiFi board for the Flipper Zero, it's black and in the shape of a hat, so it's aptly named the Blackhat. It's completely open source; schematics, board files and software. Lets get into it.

![](/img/blackhat.png)<figcaption>The Flipper is a small wireless security device with NFC, RFID, blutooth and IR capabilities. An additional board is required to enable WiFi.</figcaption> 

Being a hardware engineer, I asked around on the Flipper Zero subreddit what hardware companions they would like to see developed. I needed to edit my orriginal post because apparently an electronic "slot machine jammer" is highly illigal. "Give a man this tool, he'll rob a casino, give a man a casino, he'll rob the world" - Me, highly influenced by a quote in Mr. Robot.

Back to our regularly scheduled program: the highest upvoted comment in the thread was "A WiFi board that does the current Evil Portal attack, but then also sends the user to the internet (like wifi pineapple)" - emptythevoid. 

Anways, here we are, that's what I'm building.

The Evil Portal Attack opens a "Free WiFi" acess point. After the user connects, they are prompted to enter a username and password, which then are extracted by the attacker. One shortcoming on the current ESP32 Flipper board is the user isn't forwarded to the internet afterwards. This is where my device comes in, since it's a full blown Linux computer, it's capible of this, and much more. I'm going to outline some of the hardware and software specifics of my work.

It should go without saying I only support ethical hacking and education, myself nor Interrupt Labs condones any illigal activity. If you're wondering why I'm writing about exploits, consider two points.
    1. When you outlaw dangerious technologies, only outlaws will have dangerious technologies.
    2. Would you rather hear about these attacks from me? Or when you get f%$#@ing owned?

### Shameless Plug Section
If you find this work interesting, there is a field to subscribe at the bottom, if you have a project you are interested in colaborating on, please reach out! I don't bite and love talking about hardware!

## RISC-V
The Allwinnder D1 is an interesting part, it's a single RV64GCV core with a Tensilica HiFi4 DSP. Basides the low cost, I used it because it recently landed mainline in the Linux Kernel. I typically try to avoid parts that are not mainline or have no prospect of ever being mainlined.

The Allwinnder D1**s**, is similar but had 64MB ram internally so doesn't require external RAM. To make things more interesting, there is a T113-s3 which is pin/pin with the D1s but has two Cortex-A7 cores and 128MB RAM instead. This means that if you build a board for the D1s, you can choose to populate it with the T113-s3, which keeps things flexable. Soon there is also a T113-s4 coming out, which has an upgraded 256MB of RAM.

Sipeed Makes a module that required 2x M.2 slots for mounting, has 512MB of RAM, SD card slot and all PMICs. I'm going to use this module for the first spin of the board. Revisions after will go and then go to ether the D1, D1s or T113-s3 depending on initial experiance.

![](/img/sipeed.png)

## WiFi
In order to perform this attack I'll need to host and access point, and connect to the internet. With my device this can be done one of three ways.

  1. Connect to the internet with WiFi NIC, then host the AP on the other NIC.
  2. Connect to the internet with ethernet, then host the AP on the other NIC.
  3. Connect to the internet with WiFi NIC, then connect target PC to ethernet.

So I'll need two WiFi chipsets, and an ethernet port. One of the WiFi NICs is going connect to the SoC via. the SDIO bus, while the other will use USB. The user will be able to choose whatever USB to WiFi dongle they want, just long as it's compatable with Linux.

For those of you that don't know SDIO is just a bus, like USB, it's the same bus that's used to connect to an SD card.

The for the WiFi module on the SDIO bus I chose the Realtek RTL8723DS, the "S" on the end means "SDIO". And the RTL8723DU means "USB" this chip has two variants. This has a 50Ω trace from the antenna output to the antenna, which is a standard WiFi antenna connected to a SMA jack. 
![](/img/blackhat_wifi.png)<figcaption>Disregard the "XR829"</figcaption>

For someone experiances with electronics design, the module wiring is pretty straight forward. For additional details, you can take a look at the datasheet.
![](/img/blackhat_wifi_sch_wifi.png)

## Ethernet
The Allwinner D1 doesn't have an ethernet PHY, PHY's are the components required to converting from the physical layer, to something that can be read into the MAC. The PHY connecets to the MAC with a bus called the MII bus, these were seen in computers in the 90's to connect to a 100BASE-TX network card. Now of course computers have phy and mac internally, exposing just the ethernet port.

![](/img/blackhat_MII.png)<figcaption> MII connector on a Sun Ultra 1 Creator workstation. Source: Wikipedia</figcaption>

The D1 has a "RMII" bus, which is a reduced pin count of the orriginal bus. Here's the schematic.
![](/img/blackhat_ethernet.png)

The ethernet jack is on the right, this part is nice because is houses all the magnetics and leds inside the jack itself. By "magnetics", I mean the little transformers shown in the schematic symbol that keep things isolated.

As for hardware that's all she wrote, it's a very simple board with much of the complexaty taken over by the Sipeed module itself. I'll not get into the software.

## Software
There are a few different ways to go about building the OS, my personal favorite build system is "Buildroot", which is a project that pulls together all the elements you need to get Linux booting on your device. Broadly speaking the three elements are:
  1. The Kernel (Linux)
  2. A bootloader (uboot)
  3. The OS + Userspace apps

Bulidroot will do all this for you, and it's configured using xyz_defconfig files. Here's an example of the defconfig that I've been working with. Please don't use it, because it's been edited for readability. [Full file here]()
  
``` bash
BR2_riscv=y
BR2_TARGET_GENERIC_HOSTNAME="flipper-blackhat"
BR2_TARGET_GENERIC_ISSUE="Welcome to the Flipper Blackhat"
BR2_TARGET_GENERIC_ROOT_PASSWD="blackhat"

BR2_LINUX_KERNEL=y
BR2_LINUX_KERNEL_USE_CUSTOM_CONFIG=y
BR2_LINUX_KERNEL_CUSTOM_CONFIG_FILE="$(BR2_EXTERNAL_SIPEED_PATH)/configs/linux_nezha_defconfig"
BR2_LINUX_KERNEL_DTS_SUPPORT=y
BR2_LINUX_KERNEL_CUSTOM_DTS_PATH="$(BR2_EXTERNAL_SIPEED_PATH)/board/flipper-blackhat.dts"
BR2_LINUX_KERNEL_INSTALL_TARGET=y

BR2_PACKAGE_LINUX_FIRMWARE=y
BR2_PACKAGE_LINUX_FIRMWARE_RTL_87XX=y
BR2_PACKAGE_LINUX_FIRMWARE_RTL_88XX=y
BR2_PACKAGE_LINUX_FIRMWARE_RTL_RTW88=y

BR2_PACKAGE_IW=y
BR2_PACKAGE_IWD=y
BR2_PACKAGE_TINYSSH=y
BR2_PACKAGE_WPAN_TOOLS=y
BR2_PACKAGE_UTIL_LINUX_BINARIES=y
BR2_TARGET_ROOTFS_EXT2=y
BR2_TARGET_ROOTFS_EXT2_4=y

BR2_TARGET_UBOOT=y
BR2_TARGET_UBOOT_BUILD_SYSTEM_KCONFIG=y
BR2_TARGET_UBOOT_CUSTOM_TARBALL=y
BR2_TARGET_UBOOT_CUSTOM_TARBALL_LOCATION="$(call github,smaeul,u-boot,528ae9bc6c55edd3ffe642734b4132a8246ea777)/uboot-528ae9bc6c55edd3ffe642734b4132a8246ea777.tar.gz"
BR2_TARGET_UBOOT_BOARD_DEFCONFIG="lichee_rv_dock"
BR2_TARGET_UBOOT_NEEDS_DTC=y
BR2_TARGET_UBOOT_NEEDS_PYLIBFDT=y
BR2_TARGET_UBOOT_NEEDS_OPENSSL=y
BR2_TARGET_UBOOT_NEEDS_OPENSBI=y
```

As you can see, Linux is being pulled from mainline with a custom kernel defconfig file `linux_nezha_defconfig`, uboot is being pulled form Smaeul's fork (I should check if this is mainline), and I've included a bunch of realtek drivers `RTL_87XX, RTL_88XX`.  

This is the nice part of Buildroot, you can use mix mainline projects, with custom forks, with binary blobs. It's very configuraeable, and when elements become mainline you can switch out the forks easily enough.

One this is all configured, you can `make` the project and will recive a `sdcard.img` which you can plug into your board and if everything is configured properly you should get a booting Linux board!

The initial way to communicate with Linux is though serial, you'll get something akin to a ssh shell. Lucky for us the Flipper Zero's GPIO pins have UART (serial) pins, so all we have to do is enable the UART fuctionality and we should see a device as `/dev/ttyUSBx` or "COMx" on Windows. 

Bingo! We're in! From here we need some userspace apps.
    - dhcpcd, to recive IP address through DHCP
    - hostapd, to host an access point
    - dnsmasq, to host a DHCP server
    - Apache, to host a webserver for our portal
    - Dropbear, to host an ssh server
    - wpa_supplicant, various wireless tools

Not a problem

<iframe src="https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FAcYHbsRL20E%3Ffeature%3Doembed&amp;display_name=YouTube&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DAcYHbsRL20E&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FAcYHbsRL20E%2Fhqdefault.jpg&amp;key=a19fcc184b9711e1b4764040d3dc5c07&amp;type=text%2Fhtml&amp;schema=youtube" width="854" height="480" frameborder="0" scrolling="no">[https://medium.com/media/f11bda2a1350b84426ebc20608dd5a9f/href](https://medium.com/media/f11bda2a1350b84426ebc20608dd5a9f/href)</iframe>

include image of final project

