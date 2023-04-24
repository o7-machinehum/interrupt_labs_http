---
title: Kicad Vault - A Component Management System
date: 2023-05-24
tags:
---
__This post is not sponsored or affiliated with KiCad or Digikey.__

Back when I worked for a hardware startup, rather than making my own, we used Altium. Altium is a PCB design suite that is loved and hated by thousands. It’s not cheap, and if you need a component management system, you could pry open your wallet and shell out more, upgrading to “Altium Vault”. Vault looks at all your schematics, checks the stock, and highlights supply risks and costs. The system works well but costs a ton, so I made my own.

![](img/kicad-vault/logo.png)

This idea is simple. It's just a Python script that...
  * Finds all your KiCad projects.
  * Builds their BOMs.
  * Extends their BOMs with digikeys description of components.
  * Checks their availability on Digikey.
  * Generates some HTML pages that can be used to view this info.

Here is an example of the first page after the content is generated. Pretty simple but does the trick.
![](img/kicad-vault/index.png)

If you click on one of the projects, you'll get it's BOM, with digikey pricing and stock. [Link to the BOM here.](/kicad-vault/)

Here's a list of features I plan to integrate into it over the next few months.
  - Part swapping: If a component is out of stock, you should be able to click a button and "substitute with a reasonable alternative from a drop-down menu". It should then update the part number in KiCad.
  - Components Library: A global library of all the parts you have used should exist. The ones that are in stock and cheaper should be highlighted.
  - Auto Population: When you're done with your schematic, the script should automatically populate components with part numbers based on the description, value and footprint entered in KiCad.
  - Ordering: Using the APIs ordering boards and components should be done with a button click.

Currently, it's not a lot, an nowhere near Altium's solution. But maybe on day it will be. [Github repository here](https://github.com/o7-machinehum/kicad-vault).
