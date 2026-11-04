import { npcs } from './data'
import { defaultCulture } from './culture'
import { defaultCareer, defaultEstate } from './life'
import { defaultFinances, defaultHouse, defaultIdentity } from './society'
import { SAVE_VERSION } from './rules'

/** Safe structural migration of player-owned standalone v2.x backups. */
export function convertStandaloneSave(raw: Record<string, unknown>): Record<string, unknown> {
  const player = raw.player as Record<string, unknown>
  const stats = raw.stats as Record<string, unknown>
  const rels = (raw.rels as Record<string, unknown>[])
  const members = (raw.familyMembers as Record<string, unknown>[])
  const standaloneFactions = (raw.factions && typeof raw.factions === 'object' ? raw.factions : {}) as Record<string, unknown>
  const savedEnding = raw.ending && typeof raw.ending === 'object' ? raw.ending as Record<string, unknown> : null
  const scenarioId = typeof raw.scenarioId === 'string' ? raw.scenarioId : String(raw.year ?? '1776')
  const safeNumber = (n: unknown, fallback: number) => typeof n === 'number' && Number.isFinite(n) ? n : fallback
  const imported: Record<string, unknown> = {
    schemaVersion: SAVE_VERSION, mode: raw.mode, scenarioId,
    campaignLabel: raw.scenario ?? 'Imported Chronicle', monarch: raw.monarch,
    player, date: { year: raw.year, month: raw.month, day: raw.day }, dayCount: raw.dayCount,
    stats: { reputation: stats.reputation, influence: stats.influence, wealth: stats.wealth, health: stats.health, royalFavor: stats.favour },
    socialStatus: raw.status ?? 'Noble household', appointment: raw.appointment ?? 'No official appointment',
    relationships: npcs.map(npc => {
      const rel = rels.find(r => r.id === npc.id) ?? {}
      const affection = safeNumber(rel.affection, 8), trust = safeNumber(rel.trust, 10), respect = safeNumber(rel.respect, 12), romance = safeNumber(rel.romance, 0)
      return { npcId: npc.id, affection, trust, respect, romance, status: typeof rel.status === 'string' ? rel.status : 'Acquaintance' }
    }),
    family: members.map((m, i) => ({ id: `imported-${i}`, name: m.name, relation: m.relation, age: m.age, gender: m.gender, note: m.note ?? '' })),
    currentLocation: raw.location ?? 'residence', seenEvents: raw.seen ?? [], activeEvent: null,
    journal: raw.journal ?? [], spouse: raw.spouse ?? null, children: raw.children ?? 0,
    ending: savedEnding ? { title: savedEnding.title ?? 'The End of a Life', text: savedEnding.text ?? 'Your story has concluded.', canContinue: Boolean(savedEnding.canContinue) } : null,
    language: raw.lang ?? 'en', generation: raw.generation ?? 1,
    pendingBirthDueDay: raw.pendingBirthDueDay ?? null,
    lastEventDay: raw.lastEventDay ?? -5, lastInteraction: raw.lastInteraction ?? {},
    culture: defaultCulture(), standing: String(raw.status ?? '').includes('Royal') ? 'royal' : 'noble', career: defaultCareer(), household: defaultEstate(), downfall: null, factions: { reform: safeNumber(standaloneFactions.reform, 20), tradition: safeNumber(standaloneFactions.tradition, 20), royalist: 20 },
    lastFactionDay: safeNumber(raw.lastFactionAction, -10),
    identity: defaultIdentity(String(raw.status ?? '').includes('Royal'), String(player.personality ?? 'Composed')),
    house: defaultHouse(String(player.family ?? 'Noble house')), finance: defaultFinances()
  }
  return imported
}

