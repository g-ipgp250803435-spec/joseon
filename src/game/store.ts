import { create } from 'zustand'
import { applyBackground, acknowledgeDownfall, careerAction, defaultCareer, defaultEstate, householdAction, justiceAction } from './life'
import { lifeEvents } from './lifeEvents'
import { societyEvents } from './societyEvents'
import { financeDecision, houseDecision, defaultFinances, defaultHouse, defaultIdentity, inheritSociety, mentorDescendant, prepareSociety, studyDiscipline, updateCivicStanding } from './society'
import type { CareerPath } from './types'
import type { EstateAction, HouseAction, StudyField } from './society'
import { completeInvitation, culturalStoryEvents, declineInvitation, defaultCulture, eligibleForCulturalEvent, eventForInvitation, initiateProject, inviteForSeason, practiceCulture } from './culture'
import { alternativeScenario, historicalScenarios, locations, npcs, storyEvents } from './data'
import { historicalMonarch } from './history'
import { advanceCalendarDays, appendLog, applyEffect, canContinueAsDescendant, canPlanChild, canPropose, clamp, eligibleForEvent, relationStatus, SAVE_VERSION } from './rules'
import { AUTO_KEY, LEGACY_STANDALONE_AUTO_KEY, parseSave, readSave, slotKey, writeSave } from './storage'
import type { ActiveEvent, CampaignMode, FactionId, GameState, PlayerCharacter, Relationship } from './types'

function relationDefaults(): Relationship[] {
  return npcs.map((npc, index) => ({
    npcId: npc.id, affection: index === 0 ? 18 : 8,
    trust: index === 0 ? 15 : 10, respect: index === 2 ? 18 : 12,
    romance: 0, status: index === 2 ? 'Rival' : 'Acquaintance'
  }))
}

function finalise(game: GameState, message: string): GameState {
  return { ...game, journal: appendLog(game, message) }
}

/** Scripted events unlock only when story conditions are plausible. */
function maybeTriggerEvent(game: GameState): GameState {
  if (game.ending || game.activeEvent || game.dayCount - game.lastEventDay < 5) return game
  const unseen = [...storyEvents, ...lifeEvents, ...culturalStoryEvents, ...societyEvents].filter((event) => !game.seenEvents.includes(event.id) && (culturalStoryEvents.some(c => c.id === event.id) ? eligibleForCulturalEvent(game, event.id) : eligibleForEvent(game, event.id)))
  const locationName = locations.find((loc) => loc.id === game.currentLocation)?.name
  const nextEvent = unseen.find((event) => ['trial-of-the-house','a-life-in-exile'].includes(event.id)) ?? unseen.find((event) => event.requiresScenario === game.scenarioId) ?? unseen.find((event) => culturalStoryEvents.some(c => c.id === event.id) && event.location === locationName) ?? unseen.find((event) => event.location === locationName) ?? (game.dayCount - game.lastEventDay >= 25 ? unseen[0] : undefined)
  if (nextEvent) {
    const activeEvent: ActiveEvent = { ...nextEvent, source: 'story' }
    return { ...game, activeEvent, lastEventDay: game.dayCount }
  }
  // After unique story content is exhausted, repeat only low-stakes encounters, infrequently.
  if (game.dayCount - game.lastEventDay < 30) return game
  const recurring = storyEvents.filter((event) => (game.standing === 'commoner' ? ['garden-encounter'] : ['poetry-night', 'court-rumour', 'garden-encounter']).includes(event.id))
  const chosen = recurring[Math.floor(game.dayCount / 30) % recurring.length]
  return chosen ? { ...game, activeEvent: { ...chosen, source: 'random' }, lastEventDay: game.dayCount } : game
}

export interface NewGameInput {
  mode: CampaignMode
  scenarioId: string
  player: PlayerCharacter
}

interface GameStore {
  game: GameState | null
  startGame: (input: NewGameInput) => void
  setLocation: (location: string) => void
  pursueCareer: (action: 'train' | 'exam' | 'petition' | 'switch' | 'serve', path?: CareerPath) => boolean
  manageFinance: (action: EstateAction) => boolean
  leadHouse: (action: HouseAction) => boolean
  pursueStudy: (field: StudyField) => boolean
  mentorChild: (memberId: string, field: StudyField) => boolean
  manageEstate: (action: 'steward' | 'expand' | 'invest' | 'divest') => boolean
  seekJustice: (action: 'investigate' | 'allies' | 'appeal') => boolean
  continueAfterDownfall: () => void
  performActivity: (activity: string) => void
  interact: (npcId: string, action: 'talk' | 'flirt' | 'politics' | 'gift' | 'propose') => void
  chooseEvent: (choiceIndex: number) => void
  attendCulturalInvitation: (id: string) => boolean
  declineCulturalInvitation: (id: string) => boolean
  culturalPractice: (action: 'study' | 'poetry' | 'etiquette' | 'rites') => boolean
  commissionCulturalProject: (type: string) => boolean
  consultFaction: (id: FactionId, approach: 'pledge' | 'mediate' | 'inquire') => boolean
  advanceDay: () => void
  advanceMonth: () => void
  advanceYear: () => void
  conclude: () => void
  dismissEnding: () => void
  continueAsDescendant: () => void
  saveSlot: (slot: number) => boolean
  loadSlot: (slot: number) => boolean
  resumeAutosave: () => boolean
  hasAutosave: () => boolean
  importCampaign: (value: unknown) => boolean
  clearCampaign: () => void
  setLanguage: (language: 'en' | 'ko') => void
}

export const useGameStore = create<GameStore>((set, get) => ({
  game: null,
  startGame: ({ mode, scenarioId, player }) => {
    const customYear = /^custom-(\d{4})$/.exec(scenarioId)
    const chosenYear = customYear ? Number(customYear[1]) : 0
    const custom = customYear && chosenYear >= 1392 && chosenYear <= 1897
      ? { id: scenarioId, year: chosenYear, startMonth: chosenYear === 1392 ? 10 : 3, startDay: 1, monarch: historicalMonarch(chosenYear, chosenYear === 1392 ? 10 : 3), label: `An Unwritten Chapter · ${chosenYear}`, description: 'Your noble house enters a historical reign of your choosing.' } : null
    const scenario = mode === 'alternative' ? alternativeScenario : custom ?? historicalScenarios.find((s) => s.id === scenarioId) ?? historicalScenarios.find((s) => s.id === '1776')!
    const month = scenario.startMonth ?? 3
    const day = scenario.startDay ?? 1
    const game: GameState = {
      schemaVersion: SAVE_VERSION, mode, scenarioId: scenario.id, campaignLabel: scenario.label, monarch: scenario.monarch,
      player: { ...player, name: player.name.trim().slice(0, 50), family: player.family.trim().slice(0, 100), attributes: { ...player.attributes } },
      date: { year: scenario.year, month, day }, dayCount: 0,
      stats: { reputation: 42, influence: 22, wealth: 48, health: 92, royalFavor: 28 },
      socialStatus: player.background.includes('Royal') ? 'Royal bloodline' : 'Noble household',
      standing: player.background.includes('Royal') ? 'royal' : 'noble', career: defaultCareer(), household: defaultEstate(), downfall: null,
      identity: defaultIdentity(player.background.includes('Royal'), player.personality),
      house: defaultHouse(player.family), finance: defaultFinances(),
      appointment: 'No official appointment', relationships: relationDefaults(),
      family: [
        { id: 'father', name: 'Lord ' + player.family.split(' ').slice(-1)[0] + ' Seong', relation: 'Father', age: 54, gender: 'Male', note: 'Head of the household; expects discretion and duty.' },
        { id: 'mother', name: 'Lady ' + player.family.split(' ').slice(-1)[0] + ' Hye', relation: 'Mother', age: 49, gender: 'Female', note: 'Keeps the household connected to noble society.' },
        { id: 'sibling', name: player.gender === 'Female' ? 'Young Master ' + player.family.split(' ').slice(-1)[0] + ' Jun' : 'Lady ' + player.family.split(' ').slice(-1)[0] + ' Seon', relation: 'Sibling', age: Math.max(12, player.age - 3), gender: player.gender === 'Female' ? 'Male' : 'Female', note: 'A close family member with ambitions.' }
      ],
      currentLocation: 'residence', seenEvents: [], activeEvent: null,
      journal: [`${scenario.year}.${String(month).padStart(2, '0')}.${String(day).padStart(2, '0')} — ${player.name} begins a new chapter in Joseon.`],
      spouse: null, children: 0, ending: null, language: 'en',
      generation: 1, pendingBirthDueDay: null, lastEventDay: -5, lastInteraction: {},
      culture: defaultCulture(), factions: { reform: 20, tradition: 20, royalist: 20 }, lastFactionDay: -10
    }
    const prologue = storyEvents.find((event) => event.id === `chronicle-${scenario.id}`) ?? (scenario.id.startsWith('custom-') ? storyEvents.find(event => event.id === 'chronicle-custom') : undefined)
    if (prologue) { game.activeEvent = { ...prologue, source: 'story' }; game.lastEventDay = 0 }
    // Background is a structured source of starting opportunity and adversity.
    const customized = applyBackground(game)
    const ready = inviteForSeason(prepareSociety(customized))
    set({ game: ready })
    writeSave(AUTO_KEY, ready)
  },
  continueAfterDownfall: () => set(state => state.game ? { game: acknowledgeDownfall(state.game) } : state),
  pursueCareer: (action, path) => {
    const game = get().game
    if (!game) return false
    const outcome = careerAction(game, action, path)
    if (!outcome) return false
    set({ game: maybeTriggerEvent(advanceCalendarDays(finalise(updateCivicStanding(outcome.game), outcome.message), 1)) })
    return true
  },
  manageFinance: (action) => {
    const game = get().game
    const outcome = game && financeDecision(game, action)
    if (!outcome) return false
    set({ game: maybeTriggerEvent(advanceCalendarDays(finalise(outcome.game, outcome.message), 1)) })
    return true
  },
  leadHouse: (action) => {
    const game = get().game
    const outcome = game && houseDecision(game, action)
    if (!outcome) return false
    set({ game: maybeTriggerEvent(advanceCalendarDays(finalise(updateCivicStanding(outcome.game), outcome.message), 1)) })
    return true
  },
  mentorChild: (memberId, field) => {
    const game = get().game
    const outcome = game && mentorDescendant(game, memberId, field)
    if (!outcome) return false
    set({ game: maybeTriggerEvent(advanceCalendarDays(finalise(outcome.game, outcome.message), 1)) })
    return true
  },
  pursueStudy: (field) => {
    const game = get().game
    const outcome = game && studyDiscipline(game, field)
    if (!outcome) return false
    set({ game: maybeTriggerEvent(advanceCalendarDays(finalise(outcome.game, outcome.message), 1)) })
    return true
  },
  manageEstate: (action) => {
    const game = get().game
    if (!game) return false
    const outcome = householdAction(game, action)
    if (!outcome) return false
    set({ game: maybeTriggerEvent(advanceCalendarDays(finalise(outcome.game, outcome.message), 1)) })
    return true
  },
  seekJustice: (action) => {
    const game = get().game
    if (!game) return false
    const outcome = justiceAction(game, action)
    if (!outcome) return false
    set({ game: maybeTriggerEvent(advanceCalendarDays(finalise(outcome.game, outcome.message), 1)) })
    return true
  },
  setLocation: (location) => set((state) => {
    if (!state.game || state.game.ending || state.game.activeEvent || !locations.some((loc) => loc.id === location) || (state.game.standing === 'commoner' && ['palace','hall'].includes(location)) || state.game.currentLocation === location) return state
    return { game: finalise({ ...state.game, currentLocation: location }, `Travelled to ${locations.find((loc) => loc.id === location)?.name}.`) }
  }),
  performActivity: (activity) => set((state) => {
    if (!state.game || state.game.activeEvent || state.game.ending) return state
    const allowed = ['study', 'audience', 'banquet', 'household', 'training', 'garden', 'rumours', 'child']
    if (!allowed.includes(activity) || (activity === 'child' && !canPlanChild(state.game)) || (state.game.standing === 'commoner' && ['audience','banquet'].includes(activity))) return state
    let game: GameState = {
      ...state.game,
      player: { ...state.game.player, attributes: { ...state.game.player.attributes } },
      stats: { ...state.game.stats }
    }
    const msg: Record<string, string> = {
      study: 'Studied classical texts and refined personal skills.', audience: 'Attended the royal court.',
      banquet: 'Joined a formal gathering of noble families.', household: 'Oversaw household affairs.',
      training: 'Undertook military training.', garden: 'Rested in the garden.',
      rumours: 'Listened to news from the capital.', child: 'Made plans to welcome a child into the family.',
      appointment: 'Petitioned for advancement in royal service.'
    }
    if (activity === 'study') {
      game.player.attributes.intelligence = clamp(game.player.attributes.intelligence + 2)
      game.player.attributes.diplomacy = clamp(game.player.attributes.diplomacy + 1)
      game.stats.reputation = clamp(game.stats.reputation + 1)
    } else if (activity === 'audience') {
      game.stats.influence = clamp(game.stats.influence + 4)
      game.stats.royalFavor = clamp(game.stats.royalFavor + (game.player.attributes.charisma >= 55 ? 4 : 2))
      game.player.attributes.diplomacy = clamp(game.player.attributes.diplomacy + 1)
    } else if (activity === 'banquet') {
      // Attendance alone is never a guaranteed social success.
      if (game.stats.wealth < 3) return state
      game.stats.wealth = clamp(game.stats.wealth - 3)
      const poised = game.culture.etiquette >= 40
      game.stats.reputation = clamp(game.stats.reputation + (poised ? 2 : -2))
      game.stats.influence = clamp(game.stats.influence + (poised ? 1 : 0))
      game.culture = { ...game.culture, etiquette: clamp(game.culture.etiquette + 1) }
      msg.banquet = poised ? 'Observed banquet protocol and earned measured approval.' : 'A breach of banquet etiquette caused embarrassment before the court.'
    } else if (activity === 'household') {
      game.stats.wealth = clamp(game.stats.wealth + 2)
      game.stats.reputation = clamp(game.stats.reputation + 1)
      game.stats.health = clamp(game.stats.health + 1)
    } else if (activity === 'training') {
      game.player.attributes.courage = clamp(game.player.attributes.courage + 2)
      game.stats.influence = clamp(game.stats.influence + 1)
      game.stats.health = clamp(game.stats.health - 1)
    } else if (activity === 'garden') {
      game.stats.health = clamp(game.stats.health + 4)
      game.player.attributes.charisma = clamp(game.player.attributes.charisma + 1)
    } else if (activity === 'rumours') {
      game.stats.influence = clamp(game.stats.influence + 2)
      game.player.attributes.diplomacy = clamp(game.player.attributes.diplomacy + 1)
    } else if (activity === 'child') {
      game.pendingBirthDueDay = game.dayCount + 270 // Nine 30-day months, a narrative abstraction.
    }
    game = advanceCalendarDays(finalise(game, msg[activity]), 1)
    game = maybeTriggerEvent(game)
    return { game }
  }),
  interact: (npcId, action) => set((state) => {
    if (!state.game || state.game.activeEvent || state.game.ending) return state
    const npc = npcs.find((n) => n.id === npcId)
    if (!npc || state.game.lastInteraction[npcId] === state.game.dayCount) return state
    if (action === 'gift' && state.game.stats.wealth < 4) return state
    if (action === 'flirt' && (!npc.romanceable || (state.game.mode === 'historical' && npc.gender === state.game.player.gender))) return state
    if (action === 'propose' && !canPropose(state.game, npc)) return state
    let game: GameState = {
      ...state.game, stats: { ...state.game.stats },
      lastInteraction: { ...state.game.lastInteraction, [npcId]: state.game.dayCount }
    }
    const oldRelation = game.relationships.find((r) => r.npcId === npcId)
    if (!oldRelation) return state
    const relation = { ...oldRelation }
    let message = ''
    if (action === 'talk') {
      relation.affection = clamp(relation.affection + 3)
      relation.trust = clamp(relation.trust + 3)
      relation.loyalty = clamp((relation.loyalty ?? 10) + 2)
      message = `Talked with ${npc.name} and shared a moment of confidence.`
    } else if (action === 'flirt') {
      const welcomed = relation.trust >= 25
      relation.affection = clamp(relation.affection + (welcomed ? 4 : 1))
      relation.romance = clamp(relation.romance + (welcomed ? 7 : 2))
      if (!welcomed) game.stats.reputation = clamp(game.stats.reputation - 1)
      message = welcomed ? `Shared a tender moment with ${npc.name}.` : `Your attention caught ${npc.name} off guard; discretion would be wise.`
    } else if (action === 'politics') {
      relation.respect = clamp(relation.respect + 4)
      relation.trust = clamp(relation.trust + (npcId === 'seojun' ? -1 : 2))
      relation.rivalry = clamp((relation.rivalry ?? 0) + (npcId === 'seojun' ? 2 : -1))
      game.stats.influence = clamp(game.stats.influence + (npcId === 'seojun' ? 0 : 1))
      message = `Discussed factional affairs with ${npc.name}.`
    } else if (action === 'gift') {
      relation.affection = clamp(relation.affection + 6)
      relation.trust = clamp(relation.trust + 2)
      relation.loyalty = clamp((relation.loyalty ?? 10) + 2)
      game.stats.wealth = clamp(game.stats.wealth - 4)
      message = `Presented a gift to ${npc.name}.`
    } else if (action === 'propose') {
      relation.affection = clamp(relation.affection + 4)
      relation.romance = clamp(relation.romance + 2)
      game.spouse = npc.name
      if (npcId === 'hwan') game.socialStatus = 'Royal consort by marriage'
      game.stats.reputation = clamp(game.stats.reputation + 5)
      game.stats.influence = clamp(game.stats.influence + 3)
      message = `Married ${npc.name}, joining your households and their futures.`
    } else { return state }
    relation.status = relationStatus(relation, game.spouse, npc.name)
    game.relationships = game.relationships.map((r) => r.npcId === npcId ? relation : r)
    game = advanceCalendarDays(finalise(game, message), 1)
    game = maybeTriggerEvent(game)
    return { game }
  }),
  chooseEvent: (choiceIndex) => set((state) => {
    if (!state.game?.activeEvent || state.game.ending) return state
    const event = state.game.activeEvent
    const choice = event.choices[choiceIndex]
    if (!choice) return state
    let game = applyEffect({ ...state.game, activeEvent: null }, choice.effect)
    game = { ...game, relationships: game.relationships.map((r) => {
      const npc = npcs.find((n) => n.id === r.npcId)
      return npc ? { ...r, status: relationStatus(r, game.spouse, npc.name) } : r
    }) }
    if (!game.seenEvents.includes(event.id)) game = { ...game, seenEvents: [...game.seenEvents, event.id] }
    game = completeInvitation(game, event.id)
    game = finalise(game, `${event.title}: ${choice.text}. ${choice.consequence}`)
    if (event.id.startsWith('invitation-')) game = advanceCalendarDays(game, 1)
    if (game.standing !== 'commoner' && game.stats.reputation <= 8 && game.socialStatus !== 'Under social disgrace') {
      game = { ...game, socialStatus: 'Under social disgrace', seenEvents: [...new Set([...game.seenEvents, 'disgrace'])] }
    }
    if (game.standing === 'royal' && game.stats.influence >= 78 && game.stats.royalFavor >= 65 && game.identity.legitimacy >= 45 && game.player.background.includes('Royal')) {
      game = { ...game, ending: { title: 'The Crown Within Reach', text: 'Royal lineage and political influence place your family at the centre of a succession crisis.', canContinue: canContinueAsDescendant({ ...game, ending: { title: '', text: '' } }) } }
    }
    if (game.stats.health <= 0) game = advanceCalendarDays(game, 1)
    return { game }
  }),
  attendCulturalInvitation: (id) => {
    const current = get().game
    if (!current || current.activeEvent || current.ending) return false
    const event = eventForInvitation(current, id)
    if (!event) return false
    set({ game: { ...current, activeEvent: { ...event, source: 'story' } } })
    return true
  },
  declineCulturalInvitation: (id) => {
    const current = get().game
    if (!current || current.activeEvent || current.ending) return false
    const declined = declineInvitation(current, id)
    if (!declined) return false
    set({ game: maybeTriggerEvent(advanceCalendarDays(finalise(declined, 'Declined a social invitation; the household takes note.'), 1)) })
    return true
  },
  culturalPractice: (action) => {
    const current = get().game
    if (!current) return false
    const practised = practiceCulture(current, action)
    if (!practised) return false
    const names = { study: 'Read classical texts with a scholar.', poetry: 'Practised poetry and brushwork.', etiquette: 'Studied court etiquette and forms of address.', rites: 'Honoured the family ancestors in a private observance.' }
    set({ game: maybeTriggerEvent(advanceCalendarDays(finalise(practised, names[action]), 1)) })
    return true
  },
  commissionCulturalProject: (type) => {
    const current = get().game
    if (!current) return false
    const commissioned = initiateProject(current, type)
    if (!commissioned) return false
    set({ game: maybeTriggerEvent(advanceCalendarDays(finalise(commissioned, `Commissioned a cultural project: ${type}.`), 1)) })
    return true
  },
  consultFaction: (id, approach) => {
    const current = get().game
    if (!current || current.standing === 'commoner' || current.activeEvent || current.ending || !['reform','tradition','royalist'].includes(id) || !['pledge','mediate','inquire'].includes(approach) || current.dayCount - current.lastFactionDay < 7) return false
    const next: GameState = {
      ...current, factions: { ...current.factions }, lastFactionDay: current.dayCount,
      stats: { ...current.stats }, player: { ...current.player, attributes: { ...current.player.attributes } }
    }
    if (approach === 'pledge') {
      next.factions[id] = clamp(next.factions[id] + 8)
      for (const other of ['reform','tradition','royalist'] as const) if (other !== id) next.factions[other] = clamp(next.factions[other] - 3)
      next.stats.influence = clamp(next.stats.influence + 3)
      next.stats.reputation = clamp(next.stats.reputation - 1)
    } else if (approach === 'mediate') {
      for (const other of ['reform','tradition','royalist'] as const) next.factions[other] = clamp(next.factions[other] + 2)
      next.stats.reputation = clamp(next.stats.reputation + 2)
      next.stats.influence = clamp(next.stats.influence - 1)
    } else {
      next.factions[id] = clamp(next.factions[id] + 3)
      next.player.attributes.intelligence = clamp(next.player.attributes.intelligence + 1)
      next.stats.wealth = clamp(next.stats.wealth - 2)
    }
    const messages = { pledge: `Pledged support to the ${id} faction.`, mediate: `Brokered a fragile compromise at court.`, inquire: `Investigated the ${id} faction's intentions.` }
    set({ game: maybeTriggerEvent(advanceCalendarDays(finalise(next, messages[approach]), 1)) })
    return true
  },
  advanceDay: () => set((state) => {
    if (!state.game || state.game.activeEvent || state.game.ending) return state
    return { game: maybeTriggerEvent(advanceCalendarDays(finalise(state.game, 'A new day begins.'), 1)) }
  }),
  advanceMonth: () => set((state) => {
    if (!state.game || state.game.activeEvent || state.game.ending) return state
    return { game: maybeTriggerEvent(advanceCalendarDays(finalise(state.game, 'A month passes. The household and court move into a new season.'), 30)) }
  }),
  advanceYear: () => set((state) => {
    if (!state.game || state.game.activeEvent || state.game.ending) return state
    return { game: maybeTriggerEvent(advanceCalendarDays(finalise(state.game, 'A year passes. New seasons reshape the household.'), 360)) }
  }),
  conclude: () => set((state) => state.game && !state.game.ending ? { game: { ...state.game, ending: {
    title: 'A Legacy Remembered',
    text: `${state.game.player.name} chooses to bring this chapter to a close. Their choices will shape the household's memory.`,
    canContinue: state.game.family.some((m) => ['Child', 'First child'].includes(m.relation) && m.age >= 18 && !m.note.startsWith('Deceased'))
  } } } : state),
  dismissEnding: () => set({ game: null }),
  continueAsDescendant: () => set((state) => {
    if (!state.game || !canContinueAsDescendant(state.game)) return state
    const heir = state.game.family.find((m) => ['Child', 'First child'].includes(m.relation) && m.age >= 18 && !m.note.startsWith('Deceased'))
    if (!heir) return state
    const previous = state.game.player
    const parentRelation = previous.gender === 'Female' ? 'Mother' : 'Father'
    const family = state.game.family.filter((m) => m.id !== heir.id).map((member) => ({
      ...member,
      relation: ['Child', 'First child'].includes(member.relation) ? 'Sibling' : ['Father', 'Mother'].includes(member.relation) ? 'Grandparent' : member.relation
    }))
    const next: GameState = {
      ...state.game,
      generation: state.game.generation + 1,
      player: { name: heir.name, gender: heir.gender, age: heir.age, family: previous.family,
        background: previous.background, personality: 'Composed', portrait: heir.gender === 'Female' ? '花' : '竹',
        attributes: { intelligence: 50, charisma: 50, influence: 45, diplomacy: 48, courage: 48 } },
      family: [...family, { id: `parent-${state.game.generation}`, name: previous.name, relation: parentRelation, age: previous.age, gender: previous.gender, note: 'Founder of the preceding chapter of the dynasty.' }],
      relationships: relationDefaults(), seenEvents: state.game.standing === 'commoner' ? ['a-life-in-exile'] : [], lastInteraction: {}, lastEventDay: state.game.dayCount - 5,
      spouse: null, children: 0, pendingBirthDueDay: null, activeEvent: null, ending: null,
      career: defaultCareer(), downfall: state.game.standing === 'commoner' ? { ...state.game.downfall!, acknowledged: true } : state.game.downfall, standing: state.game.standing,
      socialStatus: state.game.standing === 'commoner' ? 'Commoner household' : state.game.standing === 'royal' ? 'Royal bloodline' : 'Noble household',
      lastFactionDay: state.game.dayCount - 7,
      stats: { ...state.game.stats, health: 90, royalFavor: clamp(state.game.stats.royalFavor - 10) },
      culture: { ...state.game.culture,
        scholarship: Math.max(15, Math.round(state.game.culture.scholarship * .6)),
        artistry: Math.max(12, Math.round(state.game.culture.artistry * .6)),
        etiquette: Math.max(20, Math.round(state.game.culture.etiquette * .75)),
        virtue: Math.round(state.game.culture.virtue * .8),
        prestige: state.game.culture.prestige,
        invitations: [], practices: {}, lastInvitationKey: '',
        projects: state.game.culture.projects.filter(project => project.completed),
        records: [...state.game.culture.records], traditions: [...state.game.culture.traditions] },
      journal: appendLog(state.game, `${heir.name} inherits the legacy of ${previous.name} (generation ${state.game.generation + 1}).`)
    }
    const inherited = inheritSociety(updateCivicStanding(next))
    const mentorFocus = heir.training?.focus
    const preparation = heir.training?.progress ?? 0
    if (mentorFocus && preparation > 0) {
      inherited.identity.education[mentorFocus] = clamp(inherited.identity.education[mentorFocus] + Math.floor(preparation / 2))
      const bonusKey = ({ classics: 'intelligence', administration: 'diplomacy', martial: 'courage', arts: 'charisma' } as const)[mentorFocus]
      inherited.player.attributes[bonusKey] = clamp(inherited.player.attributes[bonusKey] + Math.floor(preparation / 5))
    }
    return { game: inherited }
  }),
  saveSlot: (slot) => { const key = slotKey(slot); return !!key && !!get().game && writeSave(key, get().game!) },
  loadSlot: (slot) => { const key = slotKey(slot); const saved = key ? readSave(key) : null; if (!saved) return false; set({ game: saved }); return true },
  resumeAutosave: () => { const saved = readSave(AUTO_KEY) ?? readSave(LEGACY_STANDALONE_AUTO_KEY); if (!saved) return false; set({ game: saved }); writeSave(AUTO_KEY, saved); return true },
  hasAutosave: () => readSave(AUTO_KEY) !== null || readSave(LEGACY_STANDALONE_AUTO_KEY) !== null,
  importCampaign: (value) => { const saved = parseSave(value); if (!saved) return false; set({ game: saved }); return true },
  clearCampaign: () => set({ game: null }),
  setLanguage: (language) => set((state) => state.game ? { game: { ...state.game, language } } : state)
}))

export function autosave(game: GameState | null) {
  if (game) writeSave(AUTO_KEY, game)
}
