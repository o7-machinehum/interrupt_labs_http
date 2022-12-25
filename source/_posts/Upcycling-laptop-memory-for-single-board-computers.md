---
title: Upcycling laptop memory for single-board computers?
date: 2022-01-23 14:59:41
---

A few weeks ago, I headed to my local computer shop in search of affordable RAM. [Due to the chip shortage](https://machinehum.medium.com/im-not-putting-a-wifi-router-into-a-phone-charger-7b36e90ee08d), I have had to become creative lately in how I source parts for prototyping. My idea was to buy older DDR3 laptop RAM, remove the chips, and then repurpose them for my current project. I wasn’t sure if it was going to work, but I figured it was better than waiting for a twelve-month lead time.

The shop I went to was advertised from the outside as a bookstore and internet café. I wandered around the store for a bit looking at used books, slowly working up to courage to ask the cashier if they actually did sell computer parts. When I finally asked, the employee looked at me, confused for a second, and then, after mumbling something about “Mike” not being in today, brought me to a dingy back room where they kept unorganized bins of assorted cables and used parts.

After fumbling around for a while I eventually found the “RAM bin”, complete with DDR3L. “How much for four of these?” I asked the employee.

“Uh, I don’t know, $2 each?”

It took some back-and-forth, but I eventually convinced him to take $20.

This encounter got me thinking about all the bins in garages and small-town internet cafés everywhere that are chock full of RAM that’s obsolete for laptops, but perfectly useable for single-board computers (SBCs). Right now, the cheapest 256MB RAM [chips](https://www.digikey.ca/en/products/detail/etron-technology-inc/EM6HD08EWAHH-12IH/10499996) I can find are $17 each. I just found 64 chips for $20, or 31¢ each. There has to be an economic incentive here. So here’s my latest idea: removable RAM for SBCs.

The gist of it is simple; I want to create an open standard similar to the model of [SO-DIMM](https://en.wikipedia.org/wiki/SO-DIMM) used in laptops.
![](https://cdn-images-1.medium.com/max/651/1*986XpITzBuPjIRh5as0g0A.png)

Pictured above is a board with four RAM chips and a board-to-board connecter on the other side. This would be plugged into an SBC much like removable EMMC memory.
![](https://cdn-images-1.medium.com/max/1024/1*ohGgEYLMKAnwwCsp64f4DQ.png)<figcaption>Raspberry PI with removable RAM</figcaption>

With this standard, old DDR3 laptop RAM might be given new life. By upcycling the RAM from the SO-DIMM to this new format, they can be readily plugged into memory testing units (a practice that is much harder to execute with raw chip packages). This gives distributors, manufacturers and consumers confidence that the hand-me-down RAM will work on their SBC.

Another advantage of this platform pertains to inventory. Traditionally, SBCs are sold with varying amounts of RAM, allowing the end-user to choose the board that fits their requirements. Instead, manufacturers could produce a single board and customize the memory to order, thereby eliminating excess inventory of “undesirable memory options”. This flexibility also extends to the end-user, allowing them to swap out or upgrade RAM as needed for their project.

To me, one of the most interesting advantages of this configuration is that it provides raw access to the data and address lines of the processor.
> Microlesson: Whenever the CPU wants to read some data from RAM, it puts the data’s address on the address bus. The RAM then reads in this address and presents the data on the data bus. When the CPU wants to write back to RAM, it will put data and the address on the corresponding busses. This all happens extremely fast; it’s actually one of the fastest ways a processor can exchange data with an external device.

But the RAM doesn’t have to be the only thing listening on the address bus. For example, I could develop a (removable) board with both RAM and an FPGA, adopting the same standard I’m proposing above. The processor would then be able to address registers on the FPGA at RAM speeds, essentially making it a nifty coprocessor for specific tasks.

As a concrete example, say I wanted to develop a highspeed camera with a RAW [CMOS sensor](https://en.wikipedia.org/wiki/Active-pixel_sensor). I wouldn’t be able to interface the camera directly to the processor because the data rate is so high. Instead, I could connect the camera to an FPGA board like the one I proposed above. While recording, the FPGA would do the necessary processing of the RAW camera data and then dump that processed data to memory. After recording, the processor can come at its leisure and read this data. This is how most high-speed cameras actually work.

By now, I hope I have convinced you that removable RAM for SBCs is a good idea. Would it be the single most important invention in the fight against E-waste? Probably not. Would it significantly reduce cost and inventory barriers for hobbyists and professionals alike? I think so. Would it allow for more design flexibility for prototyping? Would having a high-speed interface to the processor enable more complex designs? Absolutely.

My next SBC design will feature removable RAM.

If you’re interested in discussing or contributing to this project, consider joining the [Discord](https://discord.com/invite/EtZT7mjNuM) community. Here is the [gihub for the project.](https://github.com/o7-machinehum/F-MOMM)
