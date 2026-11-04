# Save Data and Upgrade Compatibility

## Current edition

Premium Edition stores the complete game state in the browser's LocalStorage under `joseon-legacy-autosave-v1` and up to three manual save slots. Despite the historical key suffix, the validated `schemaVersion` is **3**. The Zod schema checks character attributes, relationships, date, narrative choices, faction values, family size and references to known locations.

## Earlier React versions

Legacy V1 and V2 React saves are migrated to the new data shape when imported. New faction standing starts at 20 for each court circle; the prior character choices and journal are preserved.

## Earlier standalone V2 / V2.1

A backup from the standalone JavaScript edition uses fields such as `rels`, `familyMembers`, `status`, `favour`, `seen`, and `location`. The import handler recognizes this distinct shape and converts it to the current format.

Preserved when structurally valid: character, family, date, core stats, NPC relationship numbers, spouse, child count, journal, seen narrative flags, royal appointment and generation. Some original three-party faction standings (especially `independent`) do not correspond precisely to the new `royalist` faction. The new faction begins at 20. A narrative event that was open during export is reset rather than executing untrusted embedded event data.

For imports between *different* domains, export JSON from the old game and import it on the **new title-screen Load page**. The new edition also checks for the old autosave key `joseon-crown-legacy-autosave-v1` when deployed at the same website origin.

**Always keep a backup before upgrading.** Incompatible or corrupted files are refused; save migration is intentionally conservative.
