/** Complete save validation and migration; never trust parsed LocalStorage JSON. */
import { z } from 'zod'
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
  personality: z.string().min(1).max(100), portrait: z.string().max(20), attributes: attributeShape
})
const relationShape = z.object({ npcId: z.string(), affection: meter, trust: meter, respect: meter, romance: meter, status: z.string().max(60) })
const familyShape = z.object({ id: z.string(), name: z.string(), relation: z.string(), age: z.number().int().min(0).max(200), gender, note: z.string() })
const effectShape = z.object({
  reputation: z.number().finite().optional(), influence: z.number().finite().optional(),
  wealth: z.number().finite().optional(), health: z.number().finite().optional(), royalFavor: z.number().finite().optional(),
  attribute: z.object({ key: z.enum(['intelligence', 'charisma', 'influence', 'diplomacy', 'courage']), amount: z.number().finite() }).optional(),
  relationship: z.object({ npcId: z.string(), affection: z.number().finite().optional(), trust: z.number().finite().optional(), respect: z.number().finite().optional(), romance: z.number().finite().optional() }).optional(),
  flag: z.string().optional(), faction: z.object({ id: z.enum(['reform','tradition','royalist']), amount: z.number().finite() }).optional(), status: z.string().optional(), addChild: z.boolean().optional()
})
const choiceShape = z.object({ text: z.string(), textKo: z.string(), consequence: z.string(), consequenceKo: z.string(), effect: effectShape })
const activeEventShape = z.object({ id: z.string(), title: z.string(), titleKo: z.string(), story: z.string(), storyKo: z.string(), location: z.string(), choices: z.array(choiceShape).min(1).max(8), source: z.enum(['story', 'random']) })
const gameShape = z.object({
  schemaVersion: z.literal(SAVE_VERSION), mode: z.enum(['historical', 'alternative']),
  scenarioId: z.string().min(1),
  campaignLabel: z.string().min(1), monarch: z.string().min(1), player: playerShape,
  date: z.object({ year: z.number().int().min(1392).max(2200), month: z.number().int().min(1).max(12), day: z.number().int().min(1).max(30) }),
  dayCount: z.number().int().min(0), stats: statShape, socialStatus: z.string(), appointment: z.string(),
  relationships: z.array(relationShape).max(100), family: z.array(familyShape).max(300),
  currentLocation: z.string(), seenEvents: z.array(z.string()).max(1000),
  activeEvent: activeEventShape.nullable(), journal: z.array(z.string()).max(1000),
  spouse: z.string().nullable(), children: z.number().int().min(0).max(250),
  ending: z.object({ title: z.string(), text: z.string(), canContinue: z.boolean().optional() }).nullable(),
  language: z.enum(['en', 'ko']), generation: z.number().int().min(1).max(50),
  pendingBirthDueDay: z.number().int().min(0).nullable(), lastEventDay: z.number().int().min(-10),
  lastInteraction: z.record(z.number().int().min(0)),
  factions: z.object({ reform: meter, tradition: meter, royalist: meter }), lastFactionDay: z.number().int().min(-10)
}).superRefine((game, context) => {
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
  if (![1, 2, SAVE_VERSION].includes(Number(record.schemaVersion))) return null
  const v1 = record.schemaVersion === 1 ? {
    ...record, schemaVersion: SAVE_VERSION, generation: 1,
    scenarioId: record.mode === 'alternative' ? 'alt' : historicalScenarios.find((s) => s.label === record.campaignLabel)?.id ?? '1776',
    pendingBirthDueDay: null, lastEventDay: Math.max(-5, typeof record.dayCount === 'number' ? record.dayCount - 5 : -5),
    lastInteraction: {}
  } : record
  const candidate = { ...v1, schemaVersion: SAVE_VERSION,
    factions: record.schemaVersion === SAVE_VERSION ? record.factions : { reform: 20, tradition: 20, royalist: 20 },
    lastFactionDay: record.schemaVersion === SAVE_VERSION ? record.lastFactionDay : -10 }
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
