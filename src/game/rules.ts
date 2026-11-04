/** Pure simulation rules: intentionally independent of React and browser APIs. */
import { historicalMonarch } from './history'
import { revokeNobleStatus, settleHousehold } from './life'
import { clampCulture, defaultCulture, inviteForSeason, matureCulturalProjects } from './culture'
import { settleFamilyFinances, updateCivicStanding } from './society'
import type { EventEffect, GameState, Relationship } from './types'

export const SAVE_VERSION = 6
export const clamp = (value: number, min = 0, max = 100) => Math.max(min, Math.min(max, value))

export function appendLog(game: GameState, message: string): string[] {
  const stamp = `${game.date.year}.${String(game.date.month).padStart(2, '0')}.${String(game.date.day).padStart(2, '0')}`
  return [`${stamp} — ${message}`, ...game.journal].slice(0, 80)
}

export function relationStatus(relation: Relationship, spouse: string | null, npcName: string): string {
  if (spouse === npcName) return 'Spouse'
  if (relation.trust <= 3 && relation.affection <= 10) return 'Enemy'
  if (relation.romance >= 60 && relation.affection >= 50) return 'Lover'
  if (relation.romance >= 20) return 'Romantic interest'
  if (relation.affection >= 70 && relation.trust >= 50) return 'Close friend'
  if (relation.affection >= 40) return 'Friend'
  if (relation.npcId === 'seojun' && relation.affection < 30) return 'Rival'
  return 'Acquaintance'
}

export function canPropose(game: GameState, npc: { id: string; name: string; gender: 'Female' | 'Male'; romanceable?: boolean }): boolean {
  if ((game.standing === 'commoner' && npc.id === 'hwan') || game.spouse || !npc.romanceable || game.player.age < 18 || game.ending) return false
  // Alternative Joseon deliberately allows more freedom than historical campaigns.
  if (game.mode === 'historical' && game.player.gender === npc.gender) return false
  const r = game.relationships.find((item) => item.npcId === npc.id)
  return !!r && r.affection >= 60 && r.trust >= 45 && r.romance >= 60 && game.stats.reputation >= 15
}

export function canPlanChild(game: GameState): boolean {
  return !!game.spouse && game.pendingBirthDueDay === null && game.player.age >= 18 && game.player.age <= 55 && !game.ending
}

export function eligibleForEvent(game: GameState, eventId: string): boolean {
  if (game.standing === 'commoner' && !['a-life-in-exile','restoration','letters-home','physicians-warning','family-match'].includes(eventId)) return false
  if (eventId === 'disputed-inheritance') return game.dayCount >= 75 && game.house.cohesion <= 55
  if (eventId === 'merchant-reckoning') return game.dayCount >= 40 && game.finance.enterprises.length > 0
  if (eventId === 'royal-seal-of-office') return game.dayCount >= 65 && ['civil','military'].includes(game.career.path) && game.career.rank >= 1 && game.standing !== 'commoner'
  if (eventId === 'trial-of-the-house') return game.standing !== 'commoner' && game.dayCount >= 25 && (game.stats.reputation <= 32 || game.seenEvents.includes('ledger-concealed') || game.seenEvents.includes('lotus-hidden'))
  if (eventId === 'a-life-in-exile') return game.standing === 'commoner' && game.dayCount >= (game.downfall?.atDay ?? 0) + 2
  if (eventId === 'lotus-letter') return game.scenarioId === '1724' && game.dayCount >= 2
  if (eventId === 'lotus-ash') return game.scenarioId === '1724' && game.seenEvents.includes('lotus-burned') && game.dayCount >= 9
  if (eventId === 'lotus-judgement') return game.scenarioId === '1724' && game.seenEvents.includes('lotus-tribunal') && game.dayCount >= 9
  if (eventId === 'lotus-bargain') return game.scenarioId === '1724' && game.seenEvents.includes('lotus-hidden') && game.dayCount >= 9
  if (eventId === 'chronicle-custom') return game.scenarioId.startsWith('custom-')
  if (eventId.startsWith('chronicle-')) return eventId === `chronicle-${game.scenarioId}`
  if (eventId === 'missing-ledger') return game.dayCount >= 12
  if (eventId === 'ledger-hearing') return game.dayCount >= 20 && ['ledger-investigated','ledger-concealed','ledger-petitioned'].some(flag => game.seenEvents.includes(flag))
  if (eventId === 'winter-relief') return game.dayCount >= 30 && [1,2,10,11,12].includes(game.date.month)
  if (eventId === 'letters-home') return game.dayCount >= 25 && game.family.some(m => m.relation === 'Sibling')
  if (eventId === 'physicians-warning') return game.dayCount >= 15 && game.stats.health <= 60
  if (eventId === 'envoy-gates') return game.dayCount >= 45
  if (eventId === 'three-seals') return game.dayCount >= 60
  if (eventId === 'house-charter') return game.dayCount >= 360
  if (eventId === 'family-match') return !game.spouse
  if (eventId === 'letter-reckoning') return game.dayCount >= 8 && (game.seenEvents.includes('letter-investigated') || game.seenEvents.includes('letter-shared'))
  if (eventId === 'claimant-aftermath') return game.mode === 'alternative' && game.dayCount >= 12 && game.seenEvents.includes('backed-challenger')
  if (eventId === 'restoration') return game.socialStatus === 'Under social disgrace'
  if (eventId === 'heir') return game.children > 0 && game.seenEvents.includes('child-arrived')
  if (eventId === 'final-audience') return game.dayCount >= 360 || (game.stats.influence >= 75 && game.stats.royalFavor >= 60)
  if (eventId === 'royal-favour') return game.stats.royalFavor >= 35
  if (eventId === 'betrayal') return game.relationships.some((r) => r.trust >= 40)
  if (eventId === 'scandal') return game.dayCount >= 15
  return true
}

export function applyEffect(game: GameState, effect: EventEffect): GameState {
  const next: GameState = {
    ...game,
    stats: {
      reputation: clamp(game.stats.reputation + (effect.reputation ?? 0)),
      influence: clamp(game.stats.influence + (effect.influence ?? 0)),
      wealth: clamp(game.stats.wealth + (effect.wealth ?? 0)),
      health: clamp(game.stats.health + (effect.health ?? 0)),
      royalFavor: clamp(game.stats.royalFavor + (effect.royalFavor ?? 0))
    },
    player: { ...game.player, attributes: { ...game.player.attributes } }
  }
  if (effect.attribute) {
    const { key, amount } = effect.attribute
    next.player.attributes[key] = clamp(next.player.attributes[key] + amount)
  }
  if (effect.relationship) {
    const effectRelation = effect.relationship
    next.relationships = game.relationships.map((r) => r.npcId === effectRelation.npcId ? {
      ...r,
      affection: clamp(r.affection + (effectRelation.affection ?? 0)),
      trust: clamp(r.trust + (effectRelation.trust ?? 0)),
      respect: clamp(r.respect + (effectRelation.respect ?? 0)),
      romance: clamp(r.romance + (effectRelation.romance ?? 0))
    } : r)
  }
  if (effect.culture || effect.culturalSecondary || effect.culturalRecord || effect.tradition) {
    const previous = next.culture ?? defaultCulture()
    let updated = { ...previous, records: [...previous.records], traditions: [...previous.traditions] }
    for (const change of [effect.culture, effect.culturalSecondary]) if (change) updated = { ...updated, [change.key]: clampCulture(updated[change.key] + change.amount) }
    if (effect.tradition && !updated.traditions.includes(effect.tradition)) updated.traditions.push(effect.tradition)
    if (effect.culturalRecord) updated.records = [...updated.records, { ...effect.culturalRecord, id: `record-${next.generation}-${next.dayCount}-${updated.records.length}`, year: next.date.year, generation: next.generation }].slice(-40)
    next.culture = updated
  }
  if (effect.honour || effect.legitimacy || effect.housePrestige || effect.familyTreasury || effect.familyDebt) {
    next.identity = { ...next.identity,
      honour: clamp(next.identity.honour + (effect.honour ?? 0)),
      legitimacy: clamp(next.identity.legitimacy + (effect.legitimacy ?? 0)) }
    next.house = { ...next.house, prestige: clamp(next.house.prestige + (effect.housePrestige ?? 0)) }
    const balance = next.finance.familyTreasury + (effect.familyTreasury ?? 0)
    next.finance = { ...next.finance,
      familyTreasury: Math.max(0, Math.min(999, balance)),
      familyDebt: Math.max(0, Math.min(999, next.finance.familyDebt + (effect.familyDebt ?? 0) + Math.max(0, -balance))) }
  }
  if (effect.faction) next.factions = { ...next.factions, [effect.faction.id]: clamp((next.factions[effect.faction.id] ?? 10) + effect.faction.amount) }
  if (effect.flag && !next.seenEvents.includes(effect.flag)) next.seenEvents = [...next.seenEvents, effect.flag]
  if (effect.status) next.socialStatus = effect.status
  return effect.revokeStanding ? revokeNobleStatus(next, effect.revokeStanding) : next
}

const girls = ['Yi Seol', 'Kim Nari', 'Park Eun', 'Han Sora']
const boys = ['Yi Jun', 'Kim Tae', 'Park Seon', 'Han Min']

/** The calendar is a deliberately simplified 12-month, 30-day story calendar. */
export function advanceCalendarDays(game: GameState, days: number): GameState {
  let next = game
  for (let index = 0; index < days && !next.ending; index += 1) {
    let { year, month, day } = next.date
    day += 1
    if (day > 30) { day = 1; month += 1 }
    if (month > 12) { month = 1; year += 1 }
    const birthday = month === 1 && day === 1
    next = {
      ...next,
      date: { year, month, day },
      dayCount: next.dayCount + 1,
      monarch: next.mode === 'historical' ? historicalMonarch(year, month) : next.monarch,
      player: birthday ? { ...next.player, age: next.player.age + 1 } : next.player,
      stats: birthday && next.player.age >= 49 ? { ...next.stats, health: clamp(next.stats.health - (next.player.age >= 69 ? 2 : 1)) } : next.stats,
      family: birthday ? next.family.map((member) => ({
        ...member,
        age: Math.min(85, member.age + 1),
        note: member.age + 1 >= 85 ? 'Deceased; remembered in the household chronicle.' : member.note
      })) : next.family
    }
    if (day === 1) next = settleFamilyFinances(settleHousehold(next))
    next = updateCivicStanding(matureCulturalProjects(inviteForSeason(next)))
    if (next.pendingBirthDueDay !== null && next.dayCount >= next.pendingBirthDueDay) {
      const childNumber = next.children + 1
      const gender = childNumber % 2 === 1 ? 'Female' : 'Male'
      const names = gender === 'Female' ? girls : boys
      next = {
        ...next,
        children: childNumber,
        pendingBirthDueDay: null,
        family: [...next.family, {
          id: `child-${next.generation}-${next.dayCount}-${childNumber}`,
          name: names[(next.dayCount + childNumber) % names.length],
          relation: childNumber === 1 ? 'First child' : 'Child',
          age: 0,
          gender,
          note: 'Born into the household; a possible future heir.', training: { focus: 'classics', progress: 0 }
        }],
        seenEvents: next.seenEvents.includes('child-arrived') ? next.seenEvents : [...next.seenEvents, 'child-arrived']
      }
      next = { ...next, journal: appendLog(next, 'A child is born into the household.') }
    }
    if (next.mode === 'historical' && year >= 1898) {
      next = { ...next, ending: { title: 'The End of Joseon', text: 'The Great Korean Empire was proclaimed in 1897. Your household chronicle now closes at this historical boundary.', canContinue: false } }
    } else if (next.stats.health <= 0 || next.player.age >= 85) {
      const adultHeirs = next.family.filter((member) => (member.relation === 'First child' || member.relation === 'Child') && member.age >= 18 && !member.note.startsWith('Deceased'))
      next = { ...next, ending: {
        title: 'The End of a Life',
        text: `${next.player.name}'s life has reached its final chapter. The household carries the memory of their choices.`,
        canContinue: adultHeirs.length > 0
      } }
    }
  }
  return next
}

export function canContinueAsDescendant(game: GameState): boolean {
  return !!game.ending && game.family.some((m) => (m.relation === 'First child' || m.relation === 'Child') && m.age >= 18 && !m.note.startsWith('Deceased'))
}
