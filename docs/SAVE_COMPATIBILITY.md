# Local save compatibility — schema V5

`src/game/storage.ts` validates the **entire** save structure with Zod and rejects malformed or unsupported campaigns. Writes are refused if validation fails.

V5 introduces:

- `standing`: legally distinct `noble`, `royal` or `commoner` category.
- `career`: current path, rank, experience, examination and action cooldown.
- `household`: estate level, venture count, obligations, monthly settlement stamp, cooldown.
- `downfall`: historical cause, date, evidence, appeals, legal original standing and restoration state.
- Optional custom-house fields on `player` for focus and inherited burden.

On V1–V4 React-save import, the converter supplies neutral career and household fields and derives noble/royal standing from the old social-status label. It does not treat an ordinary disgrace or financial setback as a royal revocation. Prior standalone backups use a separate structural conversion. Compatible cultural records are retained for V4 imports.

**Important:** migration is tested at the source/test level, but a real browser import and schema validation with installed Zod still require the connected production QA pass. Older saves must be backed up before irreversible edits. Corrupt JSON should be rejected without executing any embedded content.

LocalStorage keys intentionally remain compatible with the previous edition to allow ordinary browser migration: `joseon-legacy-autosave-v1` and three `joseon-legacy-save-v1-N` slots. JSON exports contain `schemaVersion: 5`.

## Version 6 migration

V6 adds `identity`, `house`, and `finance` profiles to the serialized game state, and optional `training` on child records and `loyalty`/`rivalry` on NPC relationships. Existing v1–v5 React game saves are upgraded with conservative, documented defaults for the new fields, preserving historical decisions and the main family chronicle. Standalone v2.x imports receive the same new defaults after structural conversion.

New state is validated through the updated Zod schema when loading or writing. Export a JSON backup before upgrading a browser deployment, especially if replacing a previous site's origin. The existing autosave and three manual slot storage keys have been kept to support continuity.

Because the test environment lacked the zod npm package, end-to-end migration of a genuine browser-generated V5 JSON file should be included in the post-deployment smoke test. See `docs/QA_REPORT.md`.
