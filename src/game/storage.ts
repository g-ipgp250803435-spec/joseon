/** Complete save validation and migration; never trust parsed LocalStorage JSON. */
import { z } from 'zod'
import { defaultCulture } from './culture'
import { defaultCareer, defaultEstate } from './life'
import { defaultFinances, defaultHouse, defaultIdentity } from './society'
import { historicalScenarios, locations, npcs } from './data'
import { convertStandaloneSave } from './migration'
import { SAVE_VERSION } from './rules'
import type { GameState } from './types'

export const AUTO_KEY = 'joseon-legacy-autosave-v1'
export const LEGACY_STANDALONE_AUTO_KEY = 'joseon-crown-legacy-autosave-v1'
export const SAVE_PREFIX = 'joseon-legacy-save-v1-'
const meter = z.number().finite().min(0).max(100)
const statShape = z.object({ reputation: meter, influence: meter, wealth: meter, health: meter, royalFavor: meter })
const attributeShape = z.object({ intelligence: meter, charisma: meter, influence: meter, diplomacy: meter, courage: meter })
const gender = z.enum(['Female', 'Male'])
const playerShape = z.object({
  name: z.string().trim().min(1).max(50), gender, age: z.number().int().min(0).max(120),
  family: z.string().min(1).max(100), background: z.string().min(1).max(100),
  personality: z.string().min(1).max(100), portrait: z.string().max(20), attributes: attributeShape,
  familyFocus: z.enum(['scholarship','politics','military','commerce']).optional(), familyChallenge: z.enum(['none','debt','rivals','disgrace']).optional()
})
const relationShape = z.object({ npcId: z.string(), affection: meter, trust: meter, respect: meter, romance: meter, status: z.string().max(60), loyalty: meter.optional(), rivalry: meter.optional() })
const familyShape = z.object({ id: z.string(), name: z.string(), relation: z.string(), age: z.number().int().min(0).max(200), gender, note: z.string(), training: z.object({ focus: z.enum(['classics','administration','martial','arts']), progress: meter }).optional() })
const culturalSkillShape = z.enum(['scholarship','artistry','etiquette','virtue','prestige'])
const cultureChangeShape = z.object({ key: culturalSkillShape, amount: z.number().finite() })
const culturalRecordShape = z.object({ id: z.string().max(120), kind: z.enum(['literature','rite','patronage','debate','festival']), title: z.string().max(150), titleKo: z.string().max(150), year: z.number().int().min(1392).max(2200), generation: z.number().int().min(1).max(50) })
const culturalInvitationShape = z.object({ id: z.string().max(120), title: z.string().max(150), titleKo: z.string().max(150), summary: z.string().max(500), summaryKo: z.string().max(500), location: z.string().max(80), host: z.string().max(100), kind: z.enum(['salon','banquet','rite','relief']), createdDay: z.number().int().min(0), status: z.enum(['pending','attended','declined']) })
const culturalProjectShape = z.object({ id: z.string().max(120), type: z.enum(['library','atelier','academy']), startedDay: z.number().int().min(0), completionDay: z.number().int().min(1), completed: z.boolean() })
const cultureShape = z.object({ scholarship: meter, artistry: meter, etiquette: meter, virtue: meter, prestige: meter, traditions: z.array(z.string().max(120)).max(30), practices: z.record(z.number().int().min(0)), records: z.array(culturalRecordShape).max(40), invitations: z.array(culturalInvitationShape).max(20), projects: z.array(culturalProjectShape).max(30), lastInvitationKey: z.string().max(40) })
const identityShape = z.object({ birthStatus: z.enum(['noble','royal']), honour: meter, prestige: meter,
  legitimacy: meter, authority: meter, popularity: meter, disposition: z.string().max(100),
  education: z.object({ classics: meter, administration: meter, martial: meter, arts: meter }),
  lastStudyDay: z.number().int().min(-30) })
const houseShape = z.object({ name: z.string().min(1).max(100), prestige: meter, cohesion: meter,
  leadership: z.enum(['elders','player']), allies: z.array(z.string().max(100)).max(20),
  rivals: z.array(z.string().max(100)).max(20), heritage: z.array(z.string().max(100)).max(40),
  lastCouncilDay: z.number().int().min(-30), lastMentorDay: z.number().int().min(-30) })
const holdingShape = z.object({ id: z.string().max(100), name: z.string().max(120), province: z.string().max(100),
  kind: z.enum(['residence','agricultural']), ownership: z.enum(['family','personal']), condition: meter, productivity: meter })
const enterpriseShape = z.object({ id: z.string().max(100), name: z.string().max(120), sector: z.enum(['textiles','grain']),
  ownership: z.enum(['family','personal']), capital: z.number().int().min(0).max(500), risk: z.number().int().min(0).max(10) })
const ledgerShape = z.object({ day: z.number().int().min(0), year: z.number().int().min(1392).max(2200),
  month: z.number().int().min(1).max(12), text: z.string().max(250), amount: z.number().finite().min(-999).max(999),
  category: z.enum(['income','expense','transfer']) })
const financeShape = z.object({ personalSavings: z.number().int().min(0).max(999), familyTreasury: z.number().int().min(0).max(999),
  familyDebt: z.number().int().min(0).max(999), holdings: z.array(holdingShape).max(5),
  enterprises: z.array(enterpriseShape).max(3), ledger: z.array(ledgerShape).max(60),
  lastMonthKey: z.string().max(20), lastActionDay: z.number().int().min(-30), nextId: z.number().int().min(1).max(100000) })

const effectShape = z.object({
  honour: z.number().finite().optional(), legitimacy: z.number().finite().optional(),
  housePrestige: z.number().finite().optional(), familyTreasury: z.number().finite().optional(), familyDebt: z.number().finite().optional(),
  reputation: z.number().finite().optional(), influence: z.number().finite().optional(),
  wealth: z.number().finite().optional(), health: z.number().finite().optional(), royalFavor: z.number().finite().optional(),
  attribute: z.object({ key: z.enum(['intelligence', 'charisma', 'influence', 'diplomacy', 'courage']), amount: z.number().finite() }).optional(),
  relationship: z.object({ npcId: z.string(), affection: z.number().finite().optional(), trust: z.number().finite().optional(), respect: z.number().finite().optional(), romance: z.number().finite().optional() }).optional(),
  culture: cultureChangeShape.optional(), culturalSecondary: cultureChangeShape.optional(), culturalRecord: z.object({ kind: z.enum(['literature','rite','patronage','debate','festival']), title: z.string().max(150), titleKo: z.string().max(150) }).optional(), tradition: z.string().max(120).optional(),
  revokeStanding: z.string().max(250).optional(), flag: z.string().optional(), faction: z.object({ id: z.enum(['reform','tradition','royalist']), amount: z.number().finite() }).optional(), status: z.string().optional(), addChild: z.boolean().optional()
})
const choiceShape = z.object({ text: z.string(), textKo: z.string(), consequence: z.string(), consequenceKo: z.string(), effect: effectShape })
const activeEventShape = z.object({ id: z.string(), title: z.string(), titleKo: z.string(), story: z.string(), storyKo: z.string(), location: z.string(), choices: z.array(choiceShape).min(1).max(8), source: z.enum(['story', 'random']) })
const gameShape = z.object({
  schemaVersion: z.literal(SAVE_VERSION), mode: z.enum(['historical', 'alternative']),
  scenarioId: z.string().min(1),
  campaignLabel: z.string().min(1), monarch: z.string().min(1), player: playerShape,
  date: z.object({ year: z.number().int().min(1392).max(2200), month: z.number().int().min(1).max(12), day: z.number().int().min(1).max(30) }),
  dayCount: z.number().int().min(0), stats: statShape, socialStatus: z.string(), appointment: z.string(),
  standing: z.enum(['noble','royal','commoner']),
  identity: identityShape, house: houseShape, finance: financeShape,
  career: z.object({ path: z.enum(['civil','military','scholarship','household']), rank: z.number().int().min(0).max(3), experience: z.number().int().min(0).max(200), examined: z.boolean(), lastActionDay: z.number().int().min(-30) }),
  household: z.object({ level: z.number().int().min(0).max(3), ventures: z.number().int().min(0).max(3), obligations: z.number().int().min(0).max(20), lastSettlement: z.string().max(20), lastActionDay: z.number().int().min(-30) }),
  downfall: z.object({ cause: z.string().max(250), atDay: z.number().int().min(0), originalStanding: z.enum(['noble','royal']), evidence: z.number().int().min(0).max(30), petitions: z.number().int().min(0), lastActionDay: z.number().int().min(-30), acknowledged: z.boolean(), restored: z.boolean() }).nullable(),
  relationships: z.array(relationShape).max(100), family: z.array(familyShape).max(300),
  currentLocation: z.string(), seenEvents: z.array(z.string()).max(1000),
  activeEvent: activeEventShape.nullable(), journal: z.array(z.string()).max(1000),
  spouse: z.string().nullable(), children: z.number().int().min(0).max(250),
  ending: z.object({ title: z.string(), text: z.string(), canContinue: z.boolean().optional() }).nullable(),
  language: z.enum(['en', 'ko']), generation: z.number().int().min(1).max(50),
  pendingBirthDueDay: z.number().int().min(0).nullable(), lastEventDay: z.number().int().min(-10),
  lastInteraction: z.record(z.number().int().min(0)), culture: cultureShape,
  factions: z.object({ reform: meter, tradition: meter, royalist: meter }), lastFactionDay: z.number().int().min(-10)
}).superRefine((game, context) => {
  if (game.standing === 'royal' && game.identity.birthStatus !== 'royal') context.addIssue({ code: z.ZodIssueCode.custom, message: 'Royal legal standing requires royal lineage' })
  if (game.standing === 'commoner' && !game.downfall) context.addIssue({ code: z.ZodIssueCode.custom, message: 'Commoner status needs a downfall record' })
  if (!locations.some((loc) => loc.id === game.currentLocation)) context.addIssue({ code: z.ZodIssueCode.custom, message: 'Unknown location' })
  if (npcs.some((npc) => !game.relationships.some((r) => r.npcId === npc.id))) context.addIssue({ code: z.ZodIssueCode.custom, message: 'Missing NPC relationship' })
  if (game.family.filter((m) => m.relation === 'First child' || m.relation === 'Child').length !== game.children) context.addIssue({ code: z.ZodIssueCode.custom, message: 'Inconsistent children' })
})

/** Loads original v1 saves and upgrades to v2 without altering user decisions. */
export function parseSave(value: unknown): GameState | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return null
  const record = value as Record<string, unknown>
  // Version 2.1 used a separate plain-JavaScript save shape. Convert exported JSON
  // without executing any embedded event content; unrecognized events are reopened by the new engine.
  if (Array.isArray(record.rels) && Array.isArray(record.familyMembers) && record.player && record.stats) {
    return parseSave(convertStandaloneSave(record))
  }
  if (![1, 2, 3, 4, 5, SAVE_VERSION].includes(Number(record.schemaVersion))) return null
  const v1 = record.schemaVersion === 1 ? {
    ...record, schemaVersion: SAVE_VERSION, generation: 1,
    scenarioId: record.mode === 'alternative' ? 'alt' : historicalScenarios.find((s) => s.label === record.campaignLabel)?.id ?? '1776',
    pendingBirthDueDay: null, lastEventDay: Math.max(-5, typeof record.dayCount === 'number' ? record.dayCount - 5 : -5),
    lastInteraction: {}
  } : record
  const candidate = { ...v1, schemaVersion: SAVE_VERSION,
    factions: Number(record.schemaVersion) >= 3 ? record.factions : { reform: 20, tradition: 20, royalist: 20 },
    lastFactionDay: Number(record.schemaVersion) >= 3 ? record.lastFactionDay : -10,
    culture: Number(record.schemaVersion) >= 4 ? record.culture : defaultCulture(),
    downfall: Number(record.schemaVersion) >= 5 ? record.downfall : null,
    standing: Number(record.schemaVersion) >= 5 ? record.standing : (typeof record.socialStatus === 'string' && record.socialStatus.includes('Royal') ? 'royal' : 'noble'),
    career: Number(record.schemaVersion) >= 5 ? record.career : defaultCareer(),
    household: Number(record.schemaVersion) >= 5 ? record.household : defaultEstate(),
    identity: Number(record.schemaVersion) >= 6 ? record.identity : defaultIdentity(Number(record.schemaVersion) >= 5 ? (record.standing === 'royal' || ((record.downfall as { originalStanding?: string } | null)?.originalStanding === 'royal')) : typeof record.socialStatus === 'string' && record.socialStatus.includes('Royal'), (record.player as Record<string, unknown>)?.personality as string ?? 'Composed'),
    house: Number(record.schemaVersion) >= 6 ? record.house : defaultHouse(((record.player as Record<string, unknown>)?.family as string) || 'Noble house'),
    finance: Number(record.schemaVersion) >= 6 ? record.finance : defaultFinances() }
  const result = gameShape.safeParse(candidate)
  return result.success ? result.data as GameState : null
}


export function readSave(key: string): GameState | null {
  try {
    const json = window.localStorage.getItem(key)
    return json ? parseSave(JSON.parse(json)) : null
  } catch { return null }
}

export function writeSave(key: string, game: GameState): boolean {
  try {
    if (!parseSave(game)) return false
    window.localStorage.setItem(key, JSON.stringify(game))
    return true
  } catch { return false }
}

export function slotKey(slot: number): string | null {
  return Number.isInteger(slot) && slot >= 1 && slot <= 3 ? `${SAVE_PREFIX}${slot}` : null
}
