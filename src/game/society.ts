/** Parts I–III: character identity, noble houses and separated household finance.
 * A compact, deterministic narrative simulation. No browser APIs or hidden timers.
 * This deliberately does NOT claim to model all real Joseon economic institutions.
 */
import type { GameState, HouseProfile, IdentityProfile, FinanceProfile, Holding, Enterprise } from './types'

const bounded = (value: number, max = 100) => Math.max(0, Math.min(max, Math.round(value)))
const season = (month: number) => Math.floor((month - 1) / 3)
export const houseNames = ['Household council', 'Scholarship', 'Estate stewardship', 'Marriage alliance'] as const

export function defaultIdentity(royal = false, personality = 'Composed'): IdentityProfile {
  return {
    birthStatus: royal ? 'royal' : 'noble', honour: 48, prestige: royal ? 57 : 38,
    legitimacy: royal ? 48 : 28, authority: 0, popularity: 35,
    disposition: personality, education: { classics: 12, administration: 8, martial: 8, arts: 10 },
    lastStudyDay: -10
  }
}
export function defaultHouse(name = 'A noble house'): HouseProfile {
  return { name, prestige: 42, cohesion: 50, leadership: 'elders', allies: [], rivals: [],
    heritage: [], lastCouncilDay: -10, lastMentorDay: -10 }
}
export function defaultFinances(): FinanceProfile {
  return { personalSavings: 12, familyTreasury: 36, familyDebt: 0,
    holdings: [
      { id: 'ancestral-residence', name: 'Ancestral Residence', province: 'Hanseong', kind: 'residence', ownership: 'family', condition: 75, productivity: 2 },
      { id: 'family-fields', name: 'Family Rice Fields', province: 'Gyeonggi', kind: 'agricultural', ownership: 'family', condition: 80, productivity: 3 }
    ],
    enterprises: [], ledger: [], lastMonthKey: '', lastActionDay: -10, nextId: 1 }
}
export function prepareSociety(game: GameState): GameState {
  const royal = game.standing === 'royal'
  const identity = defaultIdentity(royal, game.player.personality)
  const house = defaultHouse(game.player.family)
  let finance = defaultFinances()
  const background = game.player.background
  if (/Declining/i.test(background)) {
    finance = { ...finance, familyTreasury: 14, familyDebt: 20 }
    house.prestige = 27; house.cohesion = 38
  } else if (/Royal/i.test(background)) {
    finance = { ...finance, familyTreasury: 65 }
    house.prestige = 65
  } else if (/Merchant|wealth|landown/i.test(background)) {
    finance = { ...finance, familyTreasury: 63 }
  } else if (/Scholarly/i.test(background)) {
    identity.education.classics = 35
    house.heritage = ['Ancestral scholarship']
  } else if (/Military/i.test(background)) {
    identity.education.martial = 30
    house.heritage = ['Military service']
  }
  if (game.player.familyChallenge === 'debt') finance.familyDebt += 18
  if (game.player.familyChallenge === 'rivals') house.rivals = ['A rival branch']
  if (game.player.familyFocus === 'commerce') finance.familyTreasury += 12
  if (game.player.familyFocus === 'scholarship') identity.education.classics += 8
  return { ...game, identity, house, finance }
}
function entry(game: GameState, text: string, amount: number, category: 'income' | 'expense' | 'transfer'): FinanceProfile['ledger'][number] {
  return { day: game.dayCount, year: game.date.year, month: game.date.month, text, amount, category }
}
/** One resolution per calendar month. Earnings never automatically confer noble status or legal authority. */
export function settleFamilyFinances(game: GameState): GameState {
  const key = `${game.date.year}-${game.date.month}`
  if (!game.finance || game.finance.lastMonthKey === key) return game
  const winter = season(game.date.month) === 3 || game.date.month <= 2
  const holdingsIncome = game.finance.holdings.reduce((sum, holding) =>
    sum + (holding.kind === 'residence' ? 0 : Math.floor(holding.productivity * holding.condition / 35)), 0)
  const enterpriseIncome = game.finance.enterprises.reduce((sum, business) => {
    // Predictable risk and seasonality keep saves reproducible and tests deterministic.
    const fluctuation = ((game.date.year * 12 + game.date.month + business.id.length) % 5) - 2
    return sum + Math.max(-4, Math.floor(business.capital / 12) + fluctuation - business.risk)
  }, 0)
  const maintenance = game.finance.holdings.length + game.finance.enterprises.length + (winter ? 3 : 1)
  const net = holdingsIncome + enterpriseIncome - maintenance
  const available = game.finance.familyTreasury + net
  const debtAdded = Math.max(0, -available)
  const holdings = game.date.month % 3 === 0 ? game.finance.holdings.map(h => ({ ...h, condition: bounded(h.condition - 2) })) : game.finance.holdings
  const finance: FinanceProfile = { ...game.finance, holdings, lastMonthKey: key,
    familyTreasury: Math.max(0, Math.min(999, available)), familyDebt: Math.min(999, game.finance.familyDebt + debtAdded),
    ledger: [entry(game, `Monthly household balance${winter ? ' · winter provisions' : ''}`, net, net >= 0 ? 'income' : 'expense'), ...game.finance.ledger].slice(0, 60) }
  return { ...game, finance }
}

export type EstateAction = 'save' | 'unsave' | 'deposit' | 'withdraw' | 'repair' | 'purchase' | 'enterprise' | 'repay' | 'close'
export function financeDecision(game: GameState, action: EstateAction): { game: GameState; message: string } | null {
  if (game.activeEvent || game.ending || game.finance.lastActionDay === game.dayCount) return null
  const finance: FinanceProfile = { ...game.finance, holdings: [...game.finance.holdings], enterprises: [...game.finance.enterprises], ledger: [...game.finance.ledger] }
  const stats = { ...game.stats }
  let message = ''; let change = 0
  switch (action) {
    case 'save':
      if (stats.wealth < 8 || finance.personalSavings > 991) return null
      stats.wealth -= 8; finance.personalSavings += 8
      message = 'Placed eight personal coins into private savings.'; change = 8; break
    case 'unsave':
      if (finance.personalSavings < 8 || stats.wealth > 92) return null
      finance.personalSavings -= 8; stats.wealth += 8
      message = 'Retrieved eight coins from private savings.'; change = -8; break
    case 'deposit':
      if (stats.wealth < 10) return null
      stats.wealth -= 10; finance.familyTreasury = Math.min(999, finance.familyTreasury + 10)
      message = 'Transferred ten personal coins to the family treasury.'; change = 10; break
    case 'withdraw':
      if (finance.familyTreasury < 8 || stats.wealth > 92 || game.standing === 'commoner' || game.house.leadership !== 'player') return null
      finance.familyTreasury -= 8; stats.wealth += 8
      message = 'Received eight coins from the family treasury by authority of the house head.'; change = -8; break
    case 'repair': {
      const target = finance.holdings.find(h => h.condition < 95)
      if (!target || finance.familyTreasury < 8 || game.standing === 'commoner') return null
      finance.familyTreasury -= 8
      finance.holdings = finance.holdings.map(h => h.id === target.id ? { ...h, condition: bounded(h.condition + 18) } : h)
      message = `Restored ${target.name}, improving the condition of the family's property.`; change = -8; break
    }
    case 'purchase': {
      if (finance.familyTreasury < 28 || finance.holdings.length >= 5 || game.standing === 'commoner') return null
      finance.familyTreasury -= 28
      const holding: Holding = { id: `land-${finance.nextId++}`, name: 'Rural Agricultural Holding', province: 'Gyeonggi', kind: 'agricultural', ownership: 'family', condition: 80, productivity: 8 }
      finance.holdings.push(holding); message = 'The family acquired a productive holding under its own name.'; change = -28; break
    }
    case 'enterprise': {
      if (finance.familyTreasury < 24 || finance.enterprises.length >= 3 || game.standing === 'commoner') return null
      finance.familyTreasury -= 24
      const enterprise: Enterprise = { id: `venture-${finance.nextId++}`, name: 'Textile Partnership', sector: 'textiles', capital: 24, risk: 1, ownership: 'family' }
      finance.enterprises.push(enterprise); message = 'The household funded a textile partnership with uncertain monthly returns.'; change = -24; break
    }
    case 'repay':
      if (finance.familyDebt <= 0 || finance.familyTreasury < 10) return null
      change = -Math.min(10, finance.familyDebt, finance.familyTreasury)
      finance.familyTreasury += change; finance.familyDebt += change
      message = 'The family honoured an outstanding debt, strengthening its financial standing.'; break
    case 'close': {
      const last = finance.enterprises[finance.enterprises.length - 1]
      if (!last) return null
      finance.enterprises.pop()
      change = Math.floor(last.capital * .6)
      finance.familyTreasury = Math.min(999, finance.familyTreasury + change)
      message = 'Closed a partnership, recovering only part of the original investment.'; break
    }
    default: return null
  }
  finance.lastActionDay = game.dayCount
  finance.ledger = [entry(game, message, change, 'transfer'), ...finance.ledger].slice(0, 60)
  const next = { ...game, finance, stats }
  return { game: next, message }
}

export type HouseAction = 'council' | 'alliance' | 'reconcile' | 'claim'
export function houseDecision(game: GameState, action: HouseAction): { game: GameState; message: string } | null {
  if (game.activeEvent || game.ending || game.house.lastCouncilDay === game.dayCount) return null
  const house: HouseProfile = { ...game.house, allies: [...game.house.allies], rivals: [...game.house.rivals], heritage: [...game.house.heritage] }
  const identity: IdentityProfile = { ...game.identity, education: { ...game.identity.education } }
  const stats = { ...game.stats }
  const finance = { ...game.finance }
  let message = ''
  switch (action) {
    case 'council':
      if (stats.wealth < 3) return null
      stats.wealth -= 3; house.cohesion = bounded(house.cohesion + 6); house.prestige = bounded(house.prestige + 2)
      identity.honour = bounded(identity.honour + 2); message = 'You convened the elders and settled a long-standing household grievance.'; break
    case 'alliance':
      if (game.standing === 'commoner' || stats.influence < 28 || game.finance.familyTreasury < 8 || house.allies.includes('House Min')) return null
      finance.familyTreasury -= 8; house.allies.push('House Min'); house.prestige = bounded(house.prestige + 5); stats.influence = bounded(stats.influence + 3)
      message = 'The family gained an alliance with House Min through formal correspondence.'
      finance.ledger = [entry(game, message, -8, 'expense'), ...finance.ledger].slice(0, 60); break
    case 'reconcile':
      if (!house.rivals.length || stats.wealth < 5) return null
      stats.wealth -= 5; house.rivals.shift(); house.cohesion = bounded(house.cohesion + 4); identity.popularity = bounded(identity.popularity + 4)
      message = 'A costly reconciliation ended one enduring family grievance.'; break
    case 'claim':
      if (game.standing === 'commoner' || house.leadership === 'player' || game.player.age < 21 || house.cohesion < 55 || identity.prestige < 40) return null
      house.leadership = 'player'; identity.authority = bounded(identity.authority + 25)
      message = 'The elders recognized you as head of the household, with authority over family affairs.'; break
    default: return null
  }
  house.lastCouncilDay = game.dayCount
  return { game: { ...game, house, identity, finance, stats }, message }
}

export type StudyField = keyof IdentityProfile['education']

/** Parenting uses an actual child in the family tree; preparation changes their later starting abilities. */
export function mentorDescendant(game: GameState, memberId: string, field: StudyField): { game: GameState; message: string } | null {
  if (game.activeEvent || game.ending || game.stats.wealth < 3 || game.house.lastMentorDay === game.dayCount) return null
  if (!['classics','administration','martial','arts'].includes(field)) return null
  const child = game.family.find(m => m.id === memberId && ['Child','First child'].includes(m.relation) && m.age >= 5 && m.age < 18 && !m.note.startsWith('Deceased'))
  if (!child) return null
  const training = { focus: field, progress: bounded((child.training?.progress ?? 0) + 8) }
  const family = game.family.map(m => m.id === child.id ? { ...m, training } : m)
  return { game: { ...game, family, stats: { ...game.stats, wealth: game.stats.wealth - 3 },
    house: { ...game.house, lastMentorDay: game.dayCount, cohesion: bounded(game.house.cohesion + 1) } },
    message: `Mentored ${child.name} in ${field}; their preparation will shape their next generation.` }
}

export function studyDiscipline(game: GameState, field: StudyField): { game: GameState; message: string } | null {
  if (game.activeEvent || game.ending || game.identity.lastStudyDay === game.dayCount || game.stats.health < 4 || !['classics','administration','martial','arts'].includes(field)) return null
  const identity = { ...game.identity, education: { ...game.identity.education, [field]: bounded(game.identity.education[field] + 5) }, lastStudyDay: game.dayCount }
  const player = { ...game.player, attributes: { ...game.player.attributes } }
  const mapping = { classics: 'intelligence', administration: 'diplomacy', martial: 'courage', arts: 'charisma' } as const
  player.attributes[mapping[field]] = bounded(player.attributes[mapping[field]] + 1)
  return { game: { ...game, identity, player, stats: { ...game.stats, health: bounded(game.stats.health - 1) } }, message: `Studied ${field}, adding to your education and character history.` }
}

export function updateCivicStanding(game: GameState): GameState {
  // Authority comes from a legitimate household or formal appointment, never cash or raw influence.
  if (!game.house || !game.identity) return game
  const officeAuthority = (game.career.path === 'civil' || game.career.path === 'military') && game.standing !== 'commoner' ? game.career.rank * 17 : 0
  const headAuthority = game.house.leadership === 'player' && game.standing !== 'commoner' ? 25 : 0
  const authority = Math.max(officeAuthority, headAuthority)
  return game.identity.authority === authority ? game : { ...game, identity: { ...game.identity, authority } }
}

/** House assets and cultural archives survive even when playable identities change. */
export function inheritSociety(game: GameState): GameState {
  const heir = game.player
  return { ...game,
    identity: { ...defaultIdentity(game.standing === 'royal', heir.personality), birthStatus: game.identity.birthStatus,
      honour: bounded(game.identity.honour * .65), prestige: bounded(game.identity.prestige * .65),
      legitimacy: bounded(game.identity.legitimacy * .85), education: {
        classics: bounded(game.identity.education.classics * .5), administration: bounded(game.identity.education.administration * .5),
        martial: bounded(game.identity.education.martial * .5), arts: bounded(game.identity.education.arts * .5) } },
    house: { ...game.house, leadership: 'elders', lastCouncilDay: game.dayCount - 2, lastMentorDay: game.dayCount - 2 },
    finance: { ...game.finance, lastActionDay: game.dayCount - 2, personalSavings: Math.min(100, game.finance.personalSavings + 6) }
  }
}
