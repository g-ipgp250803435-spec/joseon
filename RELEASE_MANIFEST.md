# Premium V6.0 release manifest

**Deliverable:** Full GitHub/Vercel source tree, version 6.0.0.

**Technology:** React 18, TypeScript, Vite, Zustand, Zod, Lucide, CSS, LocalStorage.

**Integrated:** GSDD v2.0 Parts I–III as narrative-driven systems, retaining Premium V5 historical campaigns, culture, family, politics and legacy.

**New:** `src/game/society.ts`, `src/game/societyEvents.ts`, `tests/society.test.cjs`; new character identity, house council, education, wealth, property and parenting UI. Save schema version 6 with earlier-save migration.

**Verification:** 72 pure simulation and package tests passed, plus TypeScript/TSX syntax. Browser build and Vercel production deployment remain to be verified in a connected npm environment.

**Excluded intentionally:** `node_modules`, generated build files, temporary test declarations, standalone HTML legacy games, and any paid backend integration.

See README and docs/QA_REPORT.md for exact scope and limitations.
