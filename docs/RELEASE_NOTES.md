# Release Notes — Premium Edition 3.0

## Architecture migration

- Replaces the old self-contained runtime with a **proper React 18 + TypeScript + Vite** application.
- Zustand manages one consistent campaign state; Zod validates versioned save data; LocalStorage stores progress.
- Split game systems and content into maintainable files, with static SVG assets in `public/art/`.
- Removes the `vite-plugin-singlefile` build approach. Vercel generates an ordinary `dist/` with separated CSS, JavaScript and images.
- Adds GitHub Actions checks, `vercel.json`, modern metadata and a project guide.

## Premium presentation

- Moonlit palace title illustration, dark ink-blue and aged-paper art direction, gold seals and parchment dialogue.
- Twelve newly generated vector character portraits with six selectable costumes per player gender, plus ten character-specific NPC illustrations.
- Illustrated clickable navigation map of Hanseong (stylized, not geographically exact).
- Responsive tablet/mobile screens, improved tap targets and keyboard focus, reduced-motion support.
- Original optional Web Audio ambience (no downloaded audio or copyrighted music).
- New faction and legacy screens, extended character and story presentation.

## More consequence-driven gameplay

- Three factions: Reform Circle, Old Guard, Royal Household. Pledges affect allies and rivals; mediation and inquiries trade different resources. Council actions have a seven-day cooldown.
- Twelve independently calculated legacy milestones, four chronological chapter markers.
- Seven curated historical starts, a custom year from 1392–1909, and the alternative historical mode.
- New 1724 Yeongjo prologue and the three-path lotus-letter story with separate consequences.
- New stories: missing treasury ledger, tribunal hearing, winter relief, family pressure, medical warning, visiting envoy, three seals council, and a family charter.
- Family backgrounds grant different starting advantages. Marriage requirements, childbirth timing and adult-heir succession are retained.

## Saving and backward compatibility

- V3 save validation adds faction standings and the last council day.
- Imports earlier V1/V2 React saves and recognizes compatible V2.1 standalone backup shapes.
- The title Load screen can import a backup even before starting a campaign.
- Same-origin legacy autosave detection is implemented. The old independent-faction standing does not directly correspond to the new Royal Household faction and is initialized to a neutral baseline.

## Known limitations

- npm package installation is blocked by this preparation environment; **production Vite build and browser UI end-to-end testing remain unverified** here.
- Game calendar and reign transitions are simplified; some monarch transitions within years are approximate.
- Korean translation covers primary UI, events and decisions; certain ancillary descriptions and journal history remain English.
- Illustrated NPCs do not yet have age-evolving portrait art; careers, families and intrigue are deep enough for a playable life story but are not a large-scale emergent historical simulator.
- Save data is stored per browser origin and is not cloud-synced.
