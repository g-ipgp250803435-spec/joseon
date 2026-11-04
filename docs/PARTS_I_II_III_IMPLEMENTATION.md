# Premium V6 — GSDD Parts I–III integration record

This document maps the three user-supplied GSDD v2.0 specifications to the *implemented source*. It distinguishes features built for V6 from partial and deferred features. The new PDFs expand the original Master v2.0 and Part XIII culture specification; the product retains the original 2D, browser-local architecture.

| Design area | Implemented in V6 | Limitations / deferred work |
|---|---|---|
| Part I · Personal identity | Separate birth identity, legal standing, honor, prestige, legitimacy, popularity, household authority and reputation; attributes and dispositions remain persistent | Limited customizable traits and physical/health dimensions; not all individual attributes from GSDD are simulated |
| Part I · Education | Four activities: classics, administration, martial studies and arts; training improves disciplines and traits | No dedicated school/tutor economy, examination question bank or detailed childhood calendar |
| Part I · Family and descendants | Existing romance, marriage, childbirth, ageing, adult succession; **new** age-restricted child mentorship and training transferred to the playable heir | No fully rendered genealogy, independent schedules for every relative, complex adoption or concubinage |
| Part I · Legal downfall | Existing loss-of-status and restoration; **new** separate birth/legal/legitimacy history and zeroed formal authority | No full court case simulation or complex legal codes |
| Part II · Noble houses | **New** persistent house prestige/cohesion, dynastic identity, alliances, rivalries, council and recognition of house head | One primary player-controlled house, not a fully simulated network of competing autonomous houses |
| Part II · Political power | **New** separation of formal office/household authority from personal influence, property and royal lineage; an event about unlawful use of the royal seal | No sovereign rule engine, regency administration, military coups, deep court institution network |
| Part II · Career advancement | Existing four career tracks, examination gate and appointments; **new** service duties require office rank plus relevant education; historical adult eligibility | Career titles are condensed and often fictionalized; historical job-grade and gender details require review |
| Part II · Factions and crises | Existing three factions, royal favor, trials, evidence and uncertain restoration; **new** trade/inheritance/authority episodes with consequences | Era-specific real political factions and autonomous faction planning not implemented |
| Part III · Separate wealth domains | **New** personal cash, personal savings, family treasury and family debt; family expenses never silently debit private cash | Royal/state treasury is not simulated; no royal budget gameplay |
| Part III · Estates and businesses | **New** named residence and rice-field property, estate condition, repair/purchase, textile commercial ventures, divestment, deterministic monthly yields and costs | No inventory, prices for every commodity, detailed construction chain, individual worker simulation or regional trade routes |
| Part III · Family finance and inheritance | Monthly ledger, obligations, borrowing when funds are exhausted, fund transfers by legal house authority, liabilities/holdings inherited with descendants | Inheritance disputes are stories rather than legal transfer contracts; no formal tax ledger |
| Part III · Regional and seasonal effects | Simplified winter costs and small deterministic monthly market fluctuations | No granular province-wide economic database, live weather, transport fleet or disaster propagation |

## Representative player loop

1. Create a young noble from a scholarly or declining house.
2. Study *classics* and *administration*, improve discipline-specific education, and qualify for an office.
3. Fulfill official service and earn favor **without obtaining sovereign authority**.
4. Convene the family council, improve cohesion and eventually become household head.
5. Transfer private cash to family funds, purchase agricultural land or fund a risky enterprise.
6. Meet a family inheritance dispute or moral commercial dilemma; choose between household profits, honor and influence.
7. Raise a child, mentor them in a discipline, and continue as a trained adult descendant inheriting family assets, records and debts.

## Deliberate simplifications

- Narrative-focused, turn-based actions rather than hourly real-time simulation.
- One compact `society.ts` module for the new rules instead of dozens of independent subsystem managers.
- All game rules run locally in the browser; no server required for gameplay.
- Pseudo-calendar with twelve thirty-day months, documented clearly in-game.
- Fictitious supporting NPCs and composite factions, with era-specific story context rather than a complete historical population.

## Known risks for subsequent milestones

1. Install actual npm dependencies and complete `npm run build`; then conduct full Chrome/Firefox/mobile browser smoke tests.
2. Add more distinct character portraits, expression variants, cinematic scene transitions and accessible keyboard focus.
3. Validate regnal periods, career eligibility, institutions, religious practice, family conventions and monetary terminology with Korean historical sources.
4. Extend localized Korean writing across the new journal/accounting messages, not only buttons and headings.
5. Extend narrative content, autonomous house relations, NPC personal trajectories and meaningful non-royal endings.
6. Introduce richer schema-version migration fixtures and a production browser test runner once dependencies are available.
