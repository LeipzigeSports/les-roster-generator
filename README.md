# LES Roster Generator

A web app for building, customizing, and exporting team rosters for different games. Drag and drop heroes into player slots, manage hero pools, and export your roster as an image for sharing.

> [!NOTE]
> This repository is a fork of [@the-eventhorizon](https://github.com/the-eventhorizon)'s great work: [Overwatch Roster Generator](https://github.com/the-eventhorizon/ow-roster-generator)

## Features
- **Roster Table:** Assign heroes to players by role using drag-and-drop.
- **Hero Pool:** Select from all available Overwatch heroes, with portraits and custom fonts.
- **Settings Panel:** Customize team name, date, and other options.
- **Export:** Download your roster as a shareable image.
- **Responsive UI:** Built with Vue 3, TailwindCSS, and dom-to-image-more.

## Changes
- **Theme:** Adjusted the design to match the LES theme.
- **Legal:** Added imprint and privacy policy to meet legal requirements.
- **Hosting:** Create docker image to containerize and host the web app.
- **Features:** Minor UI adjustments and additional customization options.
- **Game selection:** Support rosters for different games.

## Demo
<img src="demo/readme_demo1.png" alt="App Screenshot" height="600">
<img src="demo/readme_demo_ow.png" alt="App Screenshot" height="600">
<img src="demo/readme_demo_lol.png" alt="App Screenshot" height="600">

## Getting Started

### Prerequisites
- Node.js v20.19.0 or >=22.12.0
- npm
- Docker

### Installation

The application is shipped as a container image. It can be pulled with the following command.

```sh
docker pull ghcr.io/leipzigesports/les-roster-generator:latest

```

Alternatively, you can build the application with npm.

```sh
npm install
```

### Development
```sh
npm run dev
```

### Build for Production
```sh
npm run build
```

### Run Unit Tests
```sh
npm run test:unit
```

### Lint
```sh
npm run lint
```

## Project Structure
- `src/components/` — Vue components (RosterTable, HeroPool, ExportCanvas, SettingsPanel)
- `src/assets/` — Fonts, hero portraits, icons
- `src/composables/` — Logic for heroes and roster management
- `src/types/` — TypeScript types

## Credits
- Hero portraits and Overwatch assets © Blizzard Entertainment (used under fair use for fan projects)
- Champion portraits and League of Legends assets © Riot Games (provided via Data Dragon under Riot Games' Legal Jibber Jabber policy)
- Fonts: EuroStyle, Geom (see `src/assets/fonts/`) are from Web Fonts(http://www.onlinewebfonts.com) and are licensed by CC BY 4.0</div>


## Contributing
Pull requests and suggestions welcome! Please open an issue for major changes.

## License
This tool is a fan-made utility and is not affiliated with or endorsed by Blizzard or Riot Games.
The code is licensed under the GNU General Public License v3.0 (GPLv3).
Blizzard- and Riot Games-owned assets are not included or covered by this license.
Hero portraits and other artwork are © Blizzard Entertainment.
League of Legends assets and character data are © Riot Games, Inc.


## Acknowledgements
- Built with [Vue 3](https://vuejs.org/), [Vite](https://vitejs.dev/), [TailwindCSS](https://tailwindcss.com/), [Pinia](https://pinia.vuejs.org/)
- Inspired by Overwatch and its community

---

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).