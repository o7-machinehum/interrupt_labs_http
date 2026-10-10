---
title: "Ovrdrive"
tagline: "The self-destructing USB drive."
description: "The self-destructing USB drive project: open hardware, a secret plug-in sequence, and experimental self-destruct circuitry."
layout: "product"
url: "/ovrdrive/"
cover: "/img/products/ovrdrive.webp"
hero_mobile_position: "20% center"
image_alt: "Ovrdrive USB flash drive in its black enclosure"
shop: "https://shop.rootkitlabs.com/products/ovrdrive-usb"
specs:
  - label: Capacity
    text: 8GB USB flash drive.
  - label: Unlock sequence
    text: Insert the drive three times in quick succession to access your files.
  - label: Default behavior
    text: Appears blank when plugged in normally.
  - label: Enclosure
    text: Plain, removable enclosure with no special markings.
  - label: Open hardware
    text: '[Hardware, firmware, and mechanical files](https://github.com/o7-machinehum/ovrdrive) are available on GitHub.'
  - label: Self-destruct circuit
    text: Experimental and disabled by default. The circuitry alone does not guarantee destruction of the flash chip.
  - label: Encryption
    text: No built-in encryption. See [Phantomdrive](/phantomdrive/) for hidden, encrypted storage.
gallery:
  - image: /img/products/ovrdrive.webp
    alt: Ovrdrive USB flash drive in its plain black enclosure
    caption: Closed enclosure
  - image: /img/products/ovrdrive-open.jpg
    alt: Ovrdrive with the enclosure open to show its circuit board
    caption: Inside Ovrdrive
media:
  - publisher: "Tom's Hardware"
    title: "Ovrdrive's secret unlock sequence and self-destruct experiments"
    url: "https://www.tomshardware.com/pc-components/usb-flash-drives/new-usb-stick-has-a-destruct-feature-that-heats-it-to-over-100-degrees-celsius"
  - publisher: "Hackster.io"
    title: "Inside Ovrdrive's data-hiding and self-destruct hardware"
    url: "https://www.hackster.io/news/ovrdrive-is-a-16gb-usb-drive-that-protects-your-data-by-destroying-itself-when-inserted-wrong-7c17910466a0"
  - publisher: "CNX Software"
    title: "An open-source USB drive with a hidden security feature"
    url: "https://www.cnx-software.com/2024/02/10/ovrdrive-usb-open-source-privacy-oriented-usb-flash-drive-that-can-self-destruct/"
  - publisher: "TechSpot"
    title: "The Ovrdrive crowdfunding campaign"
    url: "https://www.techspot.com/news/101848-ovrdrive-usb-stick-unique-self-destruct-data-hiding.html"
  - publisher: "HotHardware"
    title: "Ovrdrive's three-insertion unlock and experimental self-destruct circuit"
    url: "https://hothardware.com/news/self-destructing-usb-ovrdrive-works-after-three-plug-ins"
  - publisher: "Hackaday"
    title: "Fail of the Week: the challenge of destroying a flash chip"
    url: "https://hackaday.com/2023/11/25/fail-of-the-week-this-flash-drive-will-not-self-destruct-in-five-seconds/"
  - publisher: "Hackaday"
    title: "A new unlock sequence keeps fingers dry"
    url: "https://hackaday.com/2023/06/14/updated-oshw-flash-drive-keeps-data-safe-fingers-dry/"
  - publisher: "Hackaday"
    title: "The self-destructing prototype releases the magic smoke"
    url: "https://hackaday.com/2023/03/01/self-destructing-usb-drive-releases-the-magic-smoke/"
  - publisher: "Hackaday"
    title: "The first spit-detecting hardware takes shape"
    url: "https://hackaday.com/2022/12/25/the-spit-detecting-usb-flash-drive-is-nearly-here/"
  - publisher: "Hackaday"
    title: "Designing a self-destructing flash drive"
    url: "https://hackaday.com/2022/09/26/so-how-do-you-make-a-self-destructing-flash-drive/"
  - publisher: "Hackaday"
    title: "Where it began: a flash drive unlocked with wet fingers"
    url: "https://hackaday.com/2022/07/30/usb-drive-keeps-your-secrets-as-long-as-your-fingers-are-wet/"
related_posts:
  - "/posts/I-m-Building-a-Self-Destructing-USB-Drive"
  - "/posts/I-m-Building-a-Self-Destructing-USB-Drive-Part-2"
  - "/posts/I-Built-a-Self-Destructing-USB-Drive-Part-3"
featured_video:
  title: "I made a secure USB drive for journalists and hardware hackers"
  embed: "https://www.youtube-nocookie.com/embed/L5e6_1wLscs?rel=0"
  url: "https://www.youtube.com/watch?v=L5e6_1wLscs"
videos:
  - title: "Building the self-destructing USB drive"
    embed: "https://www.youtube-nocookie.com/embed/Wrcy6ySjSu8?rel=0"
    url: "https://www.youtube.com/watch?v=Wrcy6ySjSu8"
  - title: "I heated a flash drive to 160°C and it still works — Ovrdrive update"
    embed: "https://www.youtube-nocookie.com/embed/LD9e73BYAnI?rel=0"
    url: "https://www.youtube.com/watch?v=LD9e73BYAnI"
  - title: "The self-destructing USB drive is ready"
    embed: "https://www.youtube-nocookie.com/embed/bSXyIPVIJgU?rel=0"
    url: "https://www.youtube.com/watch?v=bSXyIPVIJgU"
  - title: "Ovrdrive presentation"
    embed: "https://www.youtube-nocookie.com/embed/ejQGhWZyUeQ?rel=0"
    url: "https://www.youtube.com/watch?v=ejQGhWZyUeQ"
---

**The self-destructing USB drive project.** Ovrdrive is an open-hardware USB flash
drive with a secret handshake: plug it in normally and it appears blank. Insert
it three times in quick succession to read and write your files.

The project grew from experiments in hiding data and physically destroying flash
memory. The shipping drive uses the non-destructive mode by default; its
experimental self-destruct circuitry is disabled. That circuitry alone does not
guarantee destruction of the flash chip. The
[project documentation](https://www.crowdsupply.com/interrupt-labs/ovrdrive-usb)
explains the design and its limits.

The 8GB drive uses a USB 2.0 controller and an ATtiny24A microcontroller, with a
removable enclosure and open [hardware, firmware, and mechanical files](https://github.com/o7-machinehum/ovrdrive).
Ovrdrive does not provide built-in encryption. For our USB drive with a hidden,
encrypted partition, see [Phantomdrive](/phantomdrive/).
