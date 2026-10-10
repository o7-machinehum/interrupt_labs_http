---
title: "Phantomdrive"
tagline: "A normal-looking USB drive. Hidden, encrypted storage."
description: "A 100% open-source USB drive that looks normal until an unlock file reveals an AES-256 encrypted hidden section."
layout: "product"
hide_intro: true
url: "/phantomdrive/"
cover: "/img/phantomdrive/phantomdrive-hero.webp"
hero_mobile_position: "20% center"
share_cover: "/img/phantomdrive/phantomdrive-hero.webp"
shop: https://shop.rootkitlabs.com/products/phantomdrive
image_alt: Phantomdrive USB flash drive
story:
  title: It starts as a boring flash drive.
  text: >-
    Phantomdrive masquerades itself as a normal 8GB drive. The remainder of the disk stays hidden until
    the unlock sequence is activated.
  image: /img/phantomdrive/phantomdrive-hero.webp
steps:
  title: Phantomdrive Unlock Sequence
  items:
    - title: Mounts normally
      text: Phantomdrive first appears as a normal USB drive.
    - title: Waits for the trigger
      text: 'To trigger: create a text file containing `password:addyourpasswordhere`.'
    - title: Snoops the password
      text: The device reads your password and derives an AES256 key. The password is never written to
        memory.
    - title: Reveals the rest
      text: The remaining disk is remounted, and data is encrypted and decrypted in place.
specs:
  - label: Container size
    text: >-
      8GB is reserved for for your "unencrypted" section. While the remainder of the SD card is left for
      encrypted data.
  - label: Open hardware
    text: >-
      Hardware, firmware, software, and mechanical files are [open source](https://github.com/o7-machinehum/phantomdrive).
  - label: Storage
    text: An SD card is used for storage, so you determine the capacity. SD card **not** included.
  - label: Nondescript enclosure
    text: The enclosure has no special markings.
  - label: Speed
    text: We've recorded 20 MB/s reads and 9 MB/s writes. We're working to improve it.
  - label: Easy updates
    text: >-
      The CH569W firmware can be updated by pressing the reset button while inserting it into your PC.
      No special programmer required.
  - label: KDF
    text: Keys are derived using [PBKDF2-HMAC-SHA256](https://github.com/o7-machinehum/phantomdrive/pull/14).
  - label: UART
    text: UART is available through TP1, TP2, and TP3.
  - label: Designed in KiCad
    text: You do not need to pay thousands to edit the design files.
gallery:
  - image: /img/phantomdrive/phantomdrive-hero.webp
    alt: Phantomdrive prototype hero image
    caption: Prototype hero
  - image: /img/phantomdrive/pcb-front.jpg
    alt: Phantomdrive PCB front
    caption: PCB front
  - image: /img/phantomdrive/pcb-back.jpg
    alt: Phantomdrive PCB back
    caption: PCB back
  - image: /img/phantomdrive/phantomdrive-closed.webp
    alt: Closed Phantomdrive prototype
    caption: Closed prototype
faq:
  - question: Where can I buy Phantomdrive?
    answer: >-
      Phantomdrive is available from the [Rootkit Labs shop](https://shop.rootkitlabs.com/products/phantomdrive),
      where you can find current pricing and shipping details.
  - question: Is Phantomdrive production-ready?
    answer: Over 200 units are being used in the field.
  - question: Isn't this just VeraCrypt?
    answer: >-
      No. An encrypted volume exposes random-looking encrypted data. Phantomdrive presents normal unenencrypted
      data, then reveals the protected section after being unlocked. When the device is locked, there's
      no way for the OS to know there's more space or data on the drive.
  - question: Isn't entering a password into a text file insecure?
    answer: >-
      The firmware snoops for the string "password:xyz" and inhibits the write of "xyz". Otherwise, yes
      this would be very insecure.
  - question: Why use an SD card?
    answer: Because of AI driving up the cost of eMMC. In the future I will likely make an eMMC version.
  - question: What KDF do you use?
    answer: >-
      [PBKDF2-HMAC-SHA256](https://github.com/o7-machinehum/phantomdrive/pull/14) with a per-device salt.
      The firmware supports 100,000 or 600,000 iterations, with 100,000 as the default.
  - question: Can't you just crack open the device and take out the SD card?
    answer: Yes, but all the data is encrypted.
media:
  - publisher: "Hackaday"
    title: "Phantomdrive keeps your secrets out of sight"
    url: "https://hackaday.com/2026/08/06/phantomdrive-keeps-your-secrets-out-of-sight/"
  - publisher: "Hackster.io"
    title: "A stealthy USB drive that hides encrypted data in plain sight"
    url: "https://www.hackster.io/news/this-stealthy-usb-drive-hides-encrypted-data-in-plain-sight-8549af84a251"
  - publisher: "Tom's Hardware"
    title: "Hidden encrypted storage behind an ordinary 8GB USB drive"
    url: "https://www.tomshardware.com/pc-components/usb-flash-drives/open-source-stealth-usb-hides-an-encrypted-partition-behind-an-8gb-decoy-drive-phantom-drive-appears-as-a-regular-usb-stick-until-you-create-a-text-file-to-unlock-the-hidden-data"
  - publisher: "Korben"
    title: "Unlocking Phantomdrive with a text file"
    url: "https://korben.info/en/phantomdrive-usb-drive-unlocked-text-file.html"
related_posts:
  - "/posts/I'm-Building-a-Secure-USB-Drive"
featured_video:
  title: "The open-source USB drive built for privacy"
  embed: "https://www.youtube-nocookie.com/embed/-yI8j4pUuRU?rel=0"
  url: "https://www.youtube.com/watch?v=-yI8j4pUuRU"
---
