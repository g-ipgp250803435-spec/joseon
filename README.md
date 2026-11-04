# JOSEON: THE CROWN & THE LEGACY — Premium V6.0

**A local-first, illustrated Joseon Dynasty life simulation.** Your birth determines your beginning. Your decisions determine your legacy.

This repository is a **proper multi-file React + TypeScript + Vite project**, not an embedded HTML artifact or a server-based game. It is designed to deploy as a static website to Vercel or any compatible static host. No login, database, external AI service, or secret API keys are required to play.

## Play locally

Requirements: Node.js **22** is recommended (Node >=20), npm, and a modern browser.

```bash
npm install
npm run dev
```

Open the local URL displayed by Vite, typically `http://localhost:5173`.

```bash
npm run test     # Pure simulation, content, and repository tests
npm run build    # Full TypeScript check and production build
npm run preview  # Preview compiled dist/ site
```

The repository intentionally does **not** include `node_modules` or generated `dist/`. Vercel installs packages and compiles `dist/` during deployment. If a build fails, resolve the error before treating the deployment as verified.

## Deploy to Vercel

1. Extract this ZIP and upload **its contents** to the root of a GitHub repository (not the ZIP itself).
2. In Vercel choose **Add New Project**, import that repository and choose framework **Vite**.
3. Use `npm install`, `npm run build`, and output directory `dist` (already set in `vercel.json`).
4. Deploy and test **New Game**, narrative choices, the House Council, Estates & Investments, saving/loading, and Korean interface controls on the real website.

See [the deployment guide](docs/DEPLOY_VERCEL.md).

## Core game

- **Two campaigns:** historical Joseon (1392–1897 starts), alternative Joseon, curated historical openings, 2D illustrated scenes, fictional supporting characters.
- **Character & family:** custom noble or royal identity, five starting attributes, age progression, marriage, parenthood, mentoring children, playable adult descendants.
- **Politics:** three competing factions, royal favor, decisions and story consequences, qualified civil/military careers, official service, political downfall and uncertain restoration.
- **Culture:** etiquette, scholarship, seasonal invitations, poetry, family rites, cultural patronage and an inherited family chronicle.
- **Part I–III expansion in V6:** personal identity and social legitimacy metrics, four specialized educational disciplines, house council/leadership, alliances and disputes, private savings distinct from the family treasury, family assets and liabilities, named land holdings, commercial ventures with seasonal returns, monthly financial history, and branching inheritance/trade/official-authority events.
- **Persistence:** local autosave, three manual slots, export/import JSON, schema v6 with conversion for supported V1–V5 and standalone saves.

## Project layout

```text
src/App.tsx               UI, navigation, game screens and story presentation
src/game/store.ts         Zustand action dispatcher and campaign lifecycle
src/game/types.ts         Typed game state
src/game/rules.ts         Calendar, relationships, event effects and eligibility
src/game/society.ts       Part I–III character, family, property and finance rules
src/game/societyEvents.ts Narrative episodes for the expanded systems
src/game/life.ts          Careers, legal downfall/restoration and original estate progression
src/game/culture.ts       Calendar-driven cultural social gameplay
src/game/data.ts          Historical scenarios, locations, NPCs, core stories
src/game/storage.ts       Zod save validation and migration
public/art/               Bundled original SVG illustrations and portraits
tests/                    Node test suite for pure simulation and repository structure
vercel.json               Static deployment configuration
.github/workflows/        GitHub Actions test/build checks
```

## Scope and honesty

This is a **playable narrative simulation with expanded systems, not a finished 3D or all-provinces economy game**. The source PDFs include future-level design requirements such as 3D camera perspectives, a comprehensive historical office hierarchy, royal governance, full trade networks, and individually simulated servants. Those have *not* been implemented. The game remains 2D and local-first under the previously approved compact technical architecture.

The simplified 12×30-day calendar is **not** an exact Korean lunisolar calendar. Named characters, three court factions, and branching scenes are largely fictional. Period-specific court eligibility and social conventions require further expert historical validation before marketing the game as an authoritative historical reconstruction.

This package passed its available pure simulation and static checks in the preparation environment. **A full dependency-backed `vite build` and graphical browser smoke test were not possible in that environment because npm registry access was unavailable.** GitHub Actions and Vercel will carry out the first real production build. See [QA report](docs/QA_REPORT.md).
