# Persona 5 Fusion Calculator

My humble take on the Fusion Calculator for Persona 5. Build using vanilla JavaScript.

![preview](https://github.com/user-attachments/assets/fed81ada-f23a-4d56-bb10-5de6210e8fc9)

## 💥 Live Version
#### [Use the Calculator on Github Pages](https://busydayhuh.github.io/persona-5-fusion-calculator/) 

## 🪄 How To Use
> **📍 Note**
> This calculator **does not** currently support the Royal version of the game.

1. Select a Persona from the Compendium page. **Don't forget to include any DLC Personas you have!** This will affect the fusion recipes.
2. View detailed information about the selected Persona, including affinities, skills, stats, itemization, and inheritance type. Hover over the icons to see their meanings.
3. Utilize the fusion recipes to obtain the selected Persona or to fuse it with other Personas.

<details>
<summary><strong>🧐 Fusion Rules</strong></summary>

### Standard fusion
The Persona you receive is determined by the average level of the fusion materials, divided by two, and then rounded up to find the first available Persona in the list. For example, fusing a Level 10 and a Level 12 Persona will attempt to yield a Level 11 Persona of a specific Arcana. If a Level 11 Persona is not available, the calculator will continue to search for the next _higher_ level option within that Arcana.  
  
> **((DEFAULT LVL A + DEFAULT LVL B) / 2 ) + 1 or 0.5 = RESULTING PERSONA LEVEL**

### Fusing two Personas of the same Arcana
When fusing two Personas of the same Arcana, the result will always be another Persona of that same Arcana. This is the only scenario in which the resulting Persona could match one of the fused Personas, but this is not allowed. Instead, the outcome will be the next _lowest_ Persona within that Arcana. If no lower-level Personas exist in that Arcana, the fusion will not be possible.

### Fusion with Gem Persona (Treasure Demon)
> Gem Personas are marked with the `GEM` badge in the list.

Gem Personas have unique fusion rules. They only accept specific ingredients, and the resulting Persona is influenced by the level of the non-Gem Persona ingredient. For instance, fusing Messiah Picaro with Stone of Scone will yield Satan **only if** Messiah Picaro is between levels 90 and 91.

**Fusing with a Treasure Demon results in a Persona that is 1 or 2 ranks higher or lower within that Persona's Arcana.** The direction (up or down) and the number of ranks depend on the specific combination of the Gem Persona and the Arcana used.

> All recipes involving Gem Personas in this calculator utilize base levels for the second ingredient. Your results in the game may vary.

### Special Recepies
> Personas with special recipes are marked with the `SPECIAL` badge in the list.

Special fusion follows a unique formula that does not adhere to the conventional class-based fusion chart. Instead, it relies on a specific fusion list that cannot be altered. You can view this specific list on the page of the desired Persona.

</details>

## ⬇️ Installation
To clone and run this application, you'll need Git and Node.js (which comes with npm) installed on your computer. From your command line:
```
# Clone this repository
$ git clone https://github.com/busydayhuh/persona-5-fusion-calculator

# Go into the repository
$ cd persona-5-fusion-calculator

# Install dependencies
$ npm install

# Run the app
$ npm start
```

## ⭐ Credits

This project is a fan-made tribute and is not affiliated with or endorsed by Atlus or any of its subsidiaries.

This project utilizes images and characters from the game **Persona 5**, developed by **Atlus**. All rights to the characters, artwork, and other assets are owned by their respective copyright holders. This project is intended for personal use only, and no commercial use is intended.

All assets and information about Personas have been gathered from various sources, including other GitHub projects. Major shout-out to:
* [Megaten Wiki](https://megatenwiki.com/wiki/Main_Page)
* [chinhodado/persona5_calculator](https://github.com/chinhodado/persona5_calculator)
* [arantius/persona-fusion-calculator](https://github.com/arantius/persona-fusion-calculator)
* [aqiu384/megaten-fusion-tool](https://github.com/aqiu384/megaten-fusion-tool)
* [This post on Reddit](https://www.reddit.com/r/Persona5/comments/67t820/4k_pause_menu_wallpapers_assets_and_vectors/)


## 📜 License

Distributed under the MIT License. See LICENSE.txt for more information.

[![forthebadge](https://forthebadge.com/images/badges/uses-js.svg)](https://forthebadge.com) [![forthebadge](https://forthebadge.com/images/badges/contains-17-coffee-cups.svg)](https://forthebadge.com) 
