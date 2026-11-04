# JOSEON: THE CROWN & THE LEGACY

### Premium Edition · Version 3.0 · React / TypeScript / Vite

*A historical life simulation of love, loyalty, court politics and the families who outlast kings.*

JOSEON is now a **multi-file, Vercel-ready React application**. It is **not** the previous single-HTML export. Game logic, narrative content, illustrations, UI, persistence and deployment settings are maintained as separate project files. No backend, login, hosted AI, paid API, or database is required.

## Play & develop

Requirements: **Node.js 20+** and npm, with network access to install open-source dependencies.

```bash
npm install
npm run dev
```

Open the local address printed by Vite (usually `http://localhost:5173`). For a production build:

```bash
npm run test
npm run build
npm run preview
```

Vite outputs the deployable production website to **`dist/`**. Vercel builds it automatically on deploy. Do not upload this project as a single HTML file, and do not set `index.html` as the Vercel output directory.

## Deploy to Vercel from GitHub

1. Create a new repository and upload **all extracted folders and files** (including `src/`, `public/`, `package.json`, `vite.config.ts`, and `vercel.json`) to its root.
2. In [Vercel](https://vercel.com/new), import that GitHub repository. Vercel should identify **Vite** as the framework.
3. Use **Build Command:** `npm run build`; **Install Command:** `npm install`; **Output Directory:** `dist`; **Root Directory:** `./`.
4. No environment variables are required. Deploy. Vercel will create a public URL.
5. If the production build fails, check the deployment log; do not treat the release as live until it finishes successfully.

See [docs/DEPLOY_VERCEL.md](docs/DEPLOY_VERCEL.md) for a more complete walkthrough.

## What the game includes

- Historical scenarios for **1392, 1440, 1494, 1592, 1724, 1776, 1863**, and **custom historical starting years** from 1392 to 1909, plus an alternative-Joseon campaign.
- Character creation with two genders, six appearance palettes each, noble-family backgrounds, personalities and starting abilities.
- A staged narrative prologue, an illustrated capital navigation map, six destinations, court activities, conversations and romance.
- Ten authored NPCs with illustrated portraits, affection, trust, respect and romance.
- Political rivalry through three factions, council negotiations, competing loyalties, and a seven-day political-action cooldown.
- A library of authored story events, including the 1724 lotus-letter branching arc and new trials, household choices, winter relief and diplomatic episodes.
- Marriage, family members, childbirth after approximately nine game months, ageing and adult-heir succession.
- Twelve legacy milestones, four story chapters, journal, multiple endings and generational continuation.
- English/Korean UI, story and choice text (some secondary descriptions and the recorded chronicle remain English).
- Five main resources: reputation, influence, wealth, health and royal favour.
- Local autosaves, three manual save slots, export/import backups, schema validation and supported migration from earlier saves.
- Optional locally synthesized atmospheric audio; **off by default**.

## Project structure

```text
.github/workflows/quality.yml   CI checks
public/art/                    Illustrated scenes, Hanseong map, portraits
public/favicon.svg             Site icon
src/App.tsx                    Game screens and interactions
src/style.css                  Base interface layout
src/premium.css                Premium art direction and responsive styling
src/game/data.ts               Campaigns, NPCs, locations, narrative stories
src/game/rules.ts              Calendar, consequences, marriage, succession
src/game/store.ts              Zustand state and game actions
src/game/storage.ts            Zod save validation and LocalStorage
src/game/migration.ts          Legacy standalone save conversion
src/game/premium.ts            Factions, milestones, story chapters
src/game/history.ts            Simplified historical reign mapping
src/game/ambience.ts           Original synthesized soundscape
src/main.tsx                   React entry point
index.html                     Vite HTML shell
vite.config.ts                 Bundling configuration
vercel.json                    Vercel deployment instructions
tests/                         Game logic regression suite
```

## Importing earlier saves

The title screen's **Load a saved campaign** page accepts JSON backups. On the *same website origin*, the new engine also checks for an autosave from the older standalone version. Standalone-version saves use a different schema; basic character, family, relationships, stats, decisions and journal entries are converted when compatible. Some faction details and an event in progress may not migrate exactly. **Always export a backup before replacing a deployed version.** See [docs/SAVE_COMPATIBILITY.md](docs/SAVE_COMPATIBILITY.md).

## Design principles

The playable release remains 2D, single-player and local-first. Political, military and household systems are purposely narrative abstractions, not complex management simulators. Custom characters and political letters are fictional; historical settings are based on a deliberately simplified 12-month × 30-day calendar and are not a scholarly calendar conversion.

## Current verification status

- **20 automated tests passed** in the preparation environment (16 simulation and narrative checks, 4 repository/deployment/asset checks).
- TypeScript/TSX sources passed syntax transpilation checks, plus a structural typecheck using temporary dependency stubs; SVGs and stylesheets are independently checked.
- **The Vite production build and rendered React application have not been verified in this environment**, because the npm registry is unreachable. You must run `npm install && npm run build` on a connected machine or verify the Vercel build log. The GitHub CI workflow also runs tests and a build after dependencies are installed.

The release provides deployable source **configured for** Vercel; it is not a claim of a verified live deployment.

## Asset notes

The moonlit palace and lotus garden vector art were adapted from the game-design file provided by the project owner. Remaining SVG portraits and the stylized city map were generated for this project. No font binaries are bundled. See [docs/ASSET_CREDITS.md](docs/ASSET_CREDITS.md) and [docs/QA_REPORT.md](docs/QA_REPORT.md).

---

*JOSEON — Your house. Your story. Your legacy.*
