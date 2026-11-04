const test = require('node:test')
const assert = require('node:assert/strict')
const { historicalMonarch } = require('../.test-build/history.js')
const { advanceCalendarDays, applyEffect, canContinueAsDescendant, canPlanChild, canPropose, eligibleForEvent, relationStatus } = require('../.test-build/rules.js')

function campaign() {
  return {
    schemaVersion: 3, mode: 'historical', scenarioId: '1776', campaignLabel: 'A New Reign', monarch: 'King Jeongjo',
    player: { name: 'Yi Seoyeon', gender: 'Female', age: 20, family: 'House Seo', background: 'Established aristocratic family', personality: 'Composed', portrait: '花', attributes: { intelligence: 50, charisma: 50, influence: 50, diplomacy: 50, courage: 50 } },
    date: { year: 1776, month: 12, day: 30 }, dayCount: 0,
    stats: { reputation: 42, influence: 22, wealth: 48, health: 92, royalFavor: 28 },
    socialStatus: 'Noble household', appointment: 'No official appointment',
    relationships: [ { npcId: 'hwan', affection: 65, trust: 50, respect: 20, romance: 65, status: 'Romantic interest' } ],
    family: [], currentLocation: 'residence', seenEvents: [], activeEvent: null, journal: [],
    spouse: null, children: 0, ending: null, language: 'en', generation: 1,
    pendingBirthDueDay: null, lastEventDay: -5, lastInteraction: {}, factions:{reform:20,tradition:20,royalist:20},lastFactionDay:-10
  }
}

test('one day rolls month and year and ages characters', () => {
  const game = campaign()
  game.family.push({ id: 'sister', name: 'Yi Seol', relation: 'Sibling', age: 17, gender: 'Female', note: '' })
  const next = advanceCalendarDays(game, 1)
  assert.deepEqual(next.date, { year: 1777, month: 1, day: 1 })
  assert.equal(next.player.age, 21)
  assert.equal(next.family[0].age, 18)
  assert.equal(game.player.age, 20)
})

test('birth takes nine 30-day months and occurs only once', () => {
  const game = campaign()
  game.spouse = 'Crown Prince Yi Hwan'
  game.pendingBirthDueDay = 270
  const before = advanceCalendarDays(game, 269)
  assert.equal(before.children, 0)
  assert.equal(before.pendingBirthDueDay, 270)
  const after = advanceCalendarDays(before, 1)
  assert.equal(after.children, 1)
  assert.equal(after.pendingBirthDueDay, null)
  assert.equal(after.family[0].age, 0)
  assert.equal(after.seenEvents.includes('child-arrived'), true)
  const later = advanceCalendarDays(after, 30)
  assert.equal(later.children, 1)
})

test('no child planning while unmarried or expecting', () => {
  const game = campaign()
  assert.equal(canPlanChild(game), false)
  game.spouse = 'Crown Prince Yi Hwan'
  assert.equal(canPlanChild(game), true)
  game.pendingBirthDueDay = 270
  assert.equal(canPlanChild(game), false)
})

test('marriage requires affection, trust, romance and historical eligibility', () => {
  const game = campaign()
  const npc = { id: 'hwan', name: 'Crown Prince Yi Hwan', gender: 'Male', romanceable: true }
  assert.equal(canPropose(game, npc), true)
  game.relationships[0].romance = 25
  assert.equal(canPropose(game, npc), false)
  game.relationships[0].romance = 65
  assert.equal(canPropose(game, { ...npc, gender: 'Female' }), false)
  game.mode = 'alternative'
  assert.equal(canPropose(game, { ...npc, gender: 'Female' }), true)
  game.spouse = npc.name
  assert.equal(canPropose(game, npc), false)
})

test('events respect narrative requirements and campaign selection', () => {
  const game = campaign()
  assert.equal(eligibleForEvent(game, 'restoration'), false)
  assert.equal(eligibleForEvent(game, 'heir'), false)
  assert.equal(eligibleForEvent(game, 'final-audience'), false)
  assert.equal(eligibleForEvent(game, 'chronicle-1776'), true)
  assert.equal(eligibleForEvent(game, 'chronicle-1592'), false)
  assert.equal(eligibleForEvent(game, 'letter-reckoning'), false)
  game.dayCount = 9
  game.seenEvents.push('letter-shared')
  assert.equal(eligibleForEvent(game, 'letter-reckoning'), true)
  game.socialStatus = 'Under social disgrace'
  assert.equal(eligibleForEvent(game, 'restoration'), true)
  game.spouse = 'Someone'
  assert.equal(eligibleForEvent(game, 'family-match'), false)
  game.children = 1
  game.seenEvents.push('child-arrived')
  assert.equal(eligibleForEvent(game, 'heir'), true)
})

test('effect changes do not mutate the previous snapshot and clamp metrics', () => {
  const game = campaign()
  const next = applyEffect(game, { influence: 99, wealth: -100, relationship: { npcId: 'hwan', affection: 20 }, attribute: { key: 'courage', amount: 75 } })
  assert.equal(next.stats.influence, 100)
  assert.equal(next.stats.wealth, 0)
  assert.equal(next.relationships[0].affection, 85)
  assert.equal(next.player.attributes.courage, 100)
  assert.equal(game.relationships[0].affection, 65)
  assert.equal(game.stats.wealth, 48)
})

test('a newborn cannot inherit, an adult child can', () => {
  const game = campaign()
  game.ending = { title: 'End', text: 'End' }
  game.children = 1
  game.family.push({ id: 'baby', name: 'Yi Seol', relation: 'First child', age: 0, gender: 'Female', note: '' })
  assert.equal(canContinueAsDescendant(game), false)
  game.family[0].age = 18
  assert.equal(canContinueAsDescendant(game), true)
})

test('relationship labels reflect believable progression', () => {
  const game = campaign()
  const r = game.relationships[0]
  assert.equal(relationStatus(r, null, 'Crown Prince Yi Hwan'), 'Lover')
  assert.equal(relationStatus(r, 'Crown Prince Yi Hwan', 'Crown Prince Yi Hwan'), 'Spouse')
})


test('reign context changes in historical campaigns but not in alternative ones', () => {
  assert.equal(historicalMonarch(1494, 3), 'King Seongjong')
  assert.equal(historicalMonarch(1494, 12), 'Yeonsangun')
  assert.equal(historicalMonarch(1776, 8), 'King Jeongjo')
  assert.equal(historicalMonarch(1863, 12), 'King Gojong')
  const historical = campaign()
  historical.date = { year: 1799, month: 12, day: 30 }
  assert.equal(advanceCalendarDays(historical, 1).monarch, 'King Jeongjo')
  historical.date = { year: 1800, month: 8, day: 1 }
  assert.equal(advanceCalendarDays(historical, 1).monarch, 'King Sunjo')
  historical.mode = 'alternative'
  assert.equal(advanceCalendarDays(historical, 1).monarch, 'King Jeongjo')
})

test('historical campaigns end at the Joseon era boundary', () => {
  const game = campaign()
  game.date = { year: 1909, month: 12, day: 30 }
  const next = advanceCalendarDays(game, 1)
  assert.equal(next.ending.title, 'The Last Year of Joseon')
  assert.equal(next.ending.canContinue, false)
})
