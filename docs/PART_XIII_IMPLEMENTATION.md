# Part XIII compatibility — implementation choices in V4

**Source:** JOSEON GSDD v2.0 Part XIII, 32 pages. The project owner later explicitly authorized upgrading the game after an audit. This is an implemented *simplified narrative adaptation*, not a claim to meet every original full-simulation acceptance criterion.

The earlier approved V1 scope governs unnecessary complexity. The original Part XIII enumerated 17 separate cultural managers; V4 deliberately groups essential functions into a single pure simulation module, one shared save schema and the existing narrative/UI engine.

| GSDD area | V4 implementation | Status / remaining gap |
|---|---|---|
| §2 Historical culture | Four chronological tones, historical 1392–1897 starts | Partial: not a deeply researched institutional chronology |
| §3 Social ethics | Moral standing separate from political reputation; etiquette influences outcomes | Implemented core; more context-specific protocol possible |
| §4 Religion & philosophy | Family ancestral rites, spiritual and historical references in authored stories | Partial: no separate belief/institution simulation |
| §5 Aristocratic social life | Periodic invitations, guests and choices with NPC impact | Implemented narrative slice; hosting/invite customization not present |
| §6 Court etiquette | Etiquette score, scholarly debates, banquet success/failure | Implemented narrative slice; rank/form-of-address detail limited |
| §7 Scholarship | Study, poetry, conditional scholarly debate, literary archive | Implemented narrative slice |
| §8 Artistic development | Artistry practice, commissions, cultural record | Implemented narrative slice |
| §9 Music/dance | Cultural-banquet drama and ambience retained | Partial: no period-validated instrument library |
| §10 Patronage | Three resource/time-based projects with persistent legacy | Implemented narrative slice |
| §11 Ancestral rites | Player choices and inherited traditions | Implemented core |
| §12 Cultural calendar | Four fictional seasonal invitations; missed obligations | Implemented narrative slice; exact lunar dates intentionally excluded |
| §13 Cuisine | A meal choice within winter relief, generic banquet | Partial; no dining system or cuisine catalog |
| §14 Clothing | Portrait visual variants and status-sensitive presentation | Partial: no attire wardrobe or historical costume restrictions |
| §15 Communication/exchange | Period narrative references, translated dialogue | Partial; full language/cultural-exchange systems excluded |
| §16 Event consequences | Multiple choices, statistics, NPC relationships, flags, family archive | Implemented core |
| §17 Interface | Dedicated Cultural & Society screen with archive and invitations | Implemented core |
| §18 Social/scholar/patronage/ritual loops | Condensed menu → decision → consequence → chronicle | Implemented narrative equivalents |
| §19 Historical/sandbox | Four period flavors and alternative mode | Partial: deeper historical validation pending |
| §20 Seventeen modules | **Not adopted** as separate managers | Intentionally consolidated by scope governance |
| §21 Acceptance criteria | Subset met by playable narrative abstraction | Not fully met across all 20 criteria |

**Important:** Cultural events and timing use the game's pre-existing fictionalized 360-day calendar. Seasonal labels should not be read as verified dates of historical lunar observances.
