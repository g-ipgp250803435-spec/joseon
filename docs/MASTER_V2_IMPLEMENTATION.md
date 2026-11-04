# Master Game Design Specification V2 — Implementation Map

The design references supplied for the Premium V5 expansion are the **Master Game Design Specification v2.0** (32-page document, conceptual stage) and **Part XIII — Cultural, Religious, Social & Intellectual Life** (32-page design specification). The explicit request to upgrade the game authorized selective implementation. This document distinguishes implemented systems from planned features.

| Master V2 feature group | V5 coverage | Primary implementation / limitations |
|---|---|---|
| Noble and royal identity | Implemented in simplified form | Character creator, 8 aristocratic backgrounds, birth/standing distinction, default royal eligibility |
| Historical and alternative campaigns | Implemented in curated form | 7 scenarios, custom years 1392–1897, alternative campaign, period-aware reign names; fictional recurring NPC cast |
| Character stages | Implemented in simplified form | Ageing, birth, parenting, death, adult succession; no separate childhood minigame |
| Court politics | Implemented | Factions, event-driven influence, royal favor, consequences, court activities |
| Family, romance and dynasty | Implemented | Marriage rules, children, journal, family roster, adult successor, cultural inheritance |
| Education and scholarly path | Implemented in simplified form | Scholarship, art, etiquette, career practice, qualification and recognition |
| Government appointments | Expanded in V5 | Eligibility-aware careers; simplified three promotion tiers and names |
| Military careers | Expanded in V5 | Career practice, aptitude and ranks; **no battlefield engine or 3D combat** |
| Wealth and investment | Expanded in V5 | Simple monthly estate settlement and limited partnerships; no national economy |
| Estates and property | Expanded in V5 | 3 upgrade levels, monthly costs, household actions |
| Social, religious and cultural life (Part XIII) | Implemented selectively | Seasonal invitations, salons, ancestral rites, etiquette, patronage, historical-era flavor |
| Diplomacy | Narrative-only | Envoy stories and factional decisions, no missions simulator |
| Conspiracies and justice | Expanded in V5 | Royal trial, legal loss of rank, evidence-based pardon routes |
| Royal succession and kingship | Partial | Royal family backgrounds and crown-related events; no full monarch governance interface |
| Commoner downfall and restoration | **Major V5 feature** | Formal loss of status, notice modal, restricted life, estate work, evidence, allies, appeals, denied petitions, possible restoration |
| World and camera systems | Partial | Six illustrated travel destinations + Hanseong map; **no first/third-person or isometric 3D camera** |
| Audio & art | Partial | Local SVG illustrations, original optional ambient synthesis; no full instrumental soundtrack or bespoke anime animation |
| Localization | Partial | English and Korean primary UI/event choices; some secondary descriptions/journal still English |
| Persistence | Implemented with limits | Zod-validated local saves, 3 slots, JSON backups, versioned migrations; no cloud sync |

## The critical design compromise

The earlier approved playable scope selected a lightweight 2D React/Vite browser game. The new conceptual Master V2 proposes an optional path toward Three.js/React Three Fiber and complex simulation infrastructure. Version 5 **does not silently claim the 3D proposal is complete**; it retains the reliable, deployable 2D approach and brings the master document's most consequential RPG ideas into that engine.

## Formal downfall — precise rules

- A reputational setback or loss of office is **not** automatically a legal change of birth status.
- One authored royal trial can remove noble or royal standing. The game pauses with a dedicated status notice.
- Commoner continuation restricts formal careers, investment expansion, royal audiences and factions, while allowing ordinary household support and relationships.
- Evidence gathering and ally-seeking cost wealth and time. Appeals require at least 9 evidence, 20 days since downfall, and financial resources.
- Restoration depends on evidence, reputation/influence, cultural virtue and faction standing. A weak petition can fail. A successful pardon restores prior **legal standing**, not instant office or lost assets.
- A grown descendant inherits a commoner household if the parent has not been restored.

## Economic abstraction

The monthly household system settles once per in-game month using capped resources, tiered land income and modest variable partnership returns, less obligations and occasional seasonal penalties. This is intentional narrative abstraction, **not** a researched simulation of Joseon tenancy or taxation.

## Historical ethics and accuracy

The historical mode uses broad, deliberately restrictive rules for formal civil/military office and uses fictional NPC roles. These are mechanics, not a comprehensive historical account of gender, class, legal process, Buddhist policy or social mobility throughout 1392–1897. Historical text and era-specific cast should receive specialist review before commercial release.
