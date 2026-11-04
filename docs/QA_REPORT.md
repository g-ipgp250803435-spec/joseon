# Premium V6.0 QA & verification report

## Verification completed in preparation environment

- 72 automated Node tests of simulation systems, event branching, progression rules and repository structure: **72 passed, 0 failed**.
- TypeScript pure game modules compiled with global `tsc` (CommonJS output used by Node tests).
- App/store/storage TypeScript/TSX syntax/transpilation check with global TypeScript: **passed**.
- Additional application-level integration type check using **temporary declaration stubs** for unavailable React/Zod/Zustand packages: passed. This is **not equivalent** to a dependency-backed `tsc -b`.
- All original Premium V5 tests remained passing after V6 additions.

## Not verified here

- A dependency-backed production build (`npm run build` / Vite): **not run successfully**, because npm packages could not be downloaded (DNS `EAI_AGAIN`).
- Browser-level React rendering, image fidelity, responsive interactions, focus handling and persistence across actual browser restarts: **not verified**.
- A production Vercel site: **not yet deployed**.
- Comprehensive historical accuracy or fully translated Korean language content: **not certified**.

## Acceptance smoke test after installing dependencies

1. `npm install && npm run test && npm run build` finishes with no errors.
2. New historical campaign shows a valid prologue; decisions and journal update; alternative campaign starts separately.
3. Character profile and **House Council & Identity** show different birth/legal/authority/honor values; council actions affect them according to rules.
4. Courses of study change only their intended discipline; office duties require a formal qualified appointment.
5. Estate page shows **personal cash**, **private savings**, **family treasury** and **family debt** distinctly. Transfer, acquire, repair, invest and close actions update holdings and ledger; monthly settlement runs once.
6. Family page allows mentoring children aged 5–17, disallows younger/older children, and passes training to an adult successor.
7. Inheritance dispute, merchant reckoning and office seal story arcs become available when eligible.
8. Save manually, reload, export JSON, import into a fresh tab, confirm all new V6 state persists. Import a genuine Premium V5 save and confirm it acquires V6 defaults without losing story history.
9. Try malformed JSON and modified numeric fields; loader must reject invalid data.
10. Test keyboard/mobile navigation and check that images load through Vercel's public asset path.
