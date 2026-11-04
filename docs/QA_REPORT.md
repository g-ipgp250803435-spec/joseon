# JOSEON Premium V3.0 — Quality Assurance Report

**Scope:** Complete source repository intended for a multi-file React 18 + TypeScript + Vite 6 application deployed through Vercel. This is **not** a standalone HTML game or a precompiled production build.

## Verified in the delivery environment

| Check | Result | Method |
|---|---|---|
| Simulation, narrative and inheritance | **16 / 16 passed** | Node built-in test runner after TypeScript compilation of browser-independent game rules |
| Repository, assets, imports and Vercel configuration | **4 / 4 passed** | Additional Node built-in integration checks |
| React and TypeScript syntax | **Passed** | TypeScript transpile check |
| TypeScript structural integration | **Passed with dependency stubs** | Full-source `tsc --noEmit` against temporary React/Zod/Zustand/Lucide declarations (not a replacement for a normal strict production typecheck) |
| SVG files | **34 / 34 well-formed** | Python ElementTree parser |
| CSS stylesheets | **2 / 2 parsed** | PostCSS parser |
| Source import/asset references | **Passed** | Automated repository tests |
| ZIP integrity | **Verified after archive creation** | Python ZipFile CRC/inventory validation |

There are **42 authored story event definitions, 7 curated historical starts, 1 alternative campaign, 10 NPCs, 6 locations, 3 factions and 12 milestone definitions** in the delivered source. Custom starting years (1392–1909) use a generic historical prologue. Event count does not imply that every event is eligible in every playthrough.

## Important verification gap

The npm registry could not be reached in this environment, so the dependencies were not installed here. Consequently, **the actual `npm run build` (normal strict typecheck + Vite production bundle), visual browser rendering, real-device compatibility, save persistence across browser restarts, and live Vercel deployment have NOT been verified**. The source is configured for that workflow, and GitHub Actions runs `npm run test` and `npm run build` with normal dependencies after upload.

## Required first-deployment checks

1. On a connected machine or in the GitHub CI, run `npm install`, `npm run test`, and `npm run build` and resolve any errors before publishing.
2. Serve `dist/` with `npm run preview`; start the 1724 campaign and choose every branch of its first story event (separate campaigns).
3. Verify character creation, six destinations, all relationship actions, faction cooldowns, legacy page, chapter changes, childbirth and successor progression.
4. Save manually, reload, refresh the page, close and reopen the browser, then import an exported JSON backup. Test invalid JSON and malformed or oversized saves.
5. Verify English/Korean text, mobile layout at 375px, modal scrolling, keyboard focus and reduced-motion settings.
6. Check browser console and Vercel deployment logs. Only announce a verified production release after these checks succeed.

## Known product limitations

- The game deliberately uses a simplified 360-day story calendar, not exact lunar-calendar chronology.
- Some supporting character bios, locations and journal strings remain English even when Korean UI is selected.
- NPC behavior is authored and conditional, not a deep autonomous simulation; the three factions are a lightweight narrative mechanic.
- Historical player plots are fictional and occasionally dramatized for gameplay.
- Saves are browser-local, with three manual slots and JSON export/import, not cloud-synchronized.
- No lockfile is bundled because dependency installation was unavailable; run `npm install` on a connected system and commit the generated `package-lock.json` for pinned transitive dependencies.
