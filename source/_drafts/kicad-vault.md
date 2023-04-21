---
title: Kicad Vault, A Component Management System
date: 2023-04-14 12:20:50
tags:
---
__This post is not sponsored or affiliated with KiCad or Digikey__

Unless a hardware designer works for a giant company, they're probably responsible for ensuring the PCBs are built. There isn't always a person dedicated component management. Altium has a paid solution for managing this called Vault, it looks at all your schematics and check the stock of all your components. Additionally, it lets you know if any parts are at risk of going out of stock, and the cost. The system worked pretty well, but it costs a ton, so I made my own.

![](img/kicad-vault/logo.png)

This idea is simple, it's just a Python script that...
  * Finds all your KiCad projects.
  * Builds their BOMs.
  * Extends their BOMs with digikey description of components.
  * Checks their availability on Digikey.
  * Generates some HTML pages that can be used to view this info.

![](img/kicad-vault/bom.png)
![](img/kicad-vault/index.png)
[link](/kicad-vault/)
