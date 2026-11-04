/** Life paths, household economy, and formal downfall/restoration. No browser APIs. */
import type { CareerPath, CareerTrack, DownfallRecord, GameState, HouseholdEstate, SocialStanding } from './types'

const meter = (v: number) => Math.max(0, Math.min(100, Math.round(v)))
export const careerDescriptions: Record<CareerPath, { en: string; ko: string; titles: readonly string[]; description: string }> = {
  civil: { en: 'Civil service', ko: '문관', titles: ['Independent candidate', 'Junior Official', 'Royal Secretary', 'State Councillor'], description: 'Read for examinations, serve the court, and rise through royal appointments.' },
  military: { en: 'Military command', ko: '무관', titles: ['Officer candidate', 'Royal Officer', 'Field Commander', 'General'], description: 'Study strategy, cultivate courage, and earn command with political risks.' },
  scholarship: { en: 'Scholarship', ko: '학문', titles: ['Independent scholar', 'Recognised essayist', 'Academy master', 'Renowned scholar'], description: 'Build intellectual influence through study, criticism and patronage.' },
  household: { en: 'House leadership', ko: '가문', titles: ['Household member', 'House steward', 'Head of house', 'Dynasty patron'], description: 'Protect and guide your family through investment and measured diplomacy.' }
}
export const defaultCareer = (): CareerTrack => ({ path: 'scholarship', rank: 0, experience: 0, examined: false, lastActionDay: -30 })
export const defaultEstate = (): HouseholdEstate => ({ level: 0, ventures: 0, obligations: 1, lastSettlement: '', lastActionDay: -30 })
export function isCourtEligible(game: GameState): boolean {
  return game.standing !== 'commoner' && game.player.age >= 18 && (game.mode === 'alternative' || game.player.gender === 'Male')
}
export function careerAction(game: GameState, action: 'train' | 'exam' | 'petition' | 'switch' | 'serve', newPath?: CareerPath): { game: GameState; message: string } | null {
  if (game.ending || game.activeEvent || game.standing === 'commoner' || game.career.lastActionDay === game.dayCount) return null
  const career = { ...game.career }; const stats = { ...game.stats }
  const player = { ...game.player, attributes: { ...game.player.attributes } }
  const culture = { ...game.culture }
  let message = ''
  if (action === 'switch') {
    if (!newPath || !careerDescriptions[newPath] || newPath === career.path || stats.wealth < 2) return null
    const previous = careerDescriptions[career.path].en
    career.path = newPath; career.rank = 0; career.experience = 0; career.examined = false
    stats.wealth = meter(stats.wealth - 2)
    message = `Left ${previous.toLowerCase()} to pursue ${careerDescriptions[newPath].en.toLowerCase()}.`
  } else if (action === 'train') {
    const skill = career.path === 'military' ? 'courage' : career.path === 'civil' ? 'diplomacy' : career.path === 'household' ? 'influence' : 'intelligence'
    if (stats.health < 4) return null
    career.experience = Math.min(200, career.experience + 7)
    player.attributes[skill] = meter(player.attributes[skill] + 2)
    if (career.path === 'scholarship') culture.scholarship = meter(culture.scholarship + 3)
    if (career.path === 'household') culture.etiquette = meter(culture.etiquette + 2)
    stats.health = meter(stats.health - 1)
    message = `Practised ${careerDescriptions[career.path].en.toLowerCase()} and gained professional experience.`
  } else if (action === 'serve') {
    if (career.rank < 1) return null
    if ((career.path === 'civil' || career.path === 'military') && !isCourtEligible(game)) return null
    const expertise = career.path === 'civil' ? game.identity.education.administration : career.path === 'military' ? game.identity.education.martial : career.path === 'scholarship' ? game.identity.education.classics : game.house.cohesion
    if (expertise < 12) return null
    career.experience = Math.min(200, career.experience + 6)
    stats.reputation = meter(stats.reputation + (career.path === 'civil' ? 3 : 2))
    if (career.path === 'military') { stats.health = meter(stats.health - 2); player.attributes.courage = meter(player.attributes.courage + 1) }
    if (career.path === 'civil') stats.royalFavor = meter(stats.royalFavor + 2)
    if (career.path === 'scholarship') culture.scholarship = meter(culture.scholarship + 3)
    message = `Fulfilled the duties of ${careerDescriptions[career.path].titles[career.rank]}; service required training and proved your judgement.`
  } else if (action === 'exam') {
    if (career.examined || career.experience < 14 || stats.wealth < 4) return null
    if ((career.path === 'civil' || career.path === 'military') && !isCourtEligible(game)) return null
    const aptitude = career.path === 'military' ? player.attributes.courage : career.path === 'civil' ? player.attributes.intelligence : career.path === 'scholarship' ? game.culture.scholarship : player.attributes.influence
    if (aptitude < 40) return null
    career.examined = true; career.experience -= 12; stats.wealth -= 4; stats.reputation = meter(stats.reputation + 4)
    message = `Completed the qualifications for ${careerDescriptions[career.path].en.toLowerCase()}.`
  } else if (action === 'petition') {
    if (career.rank >= 3 || !career.examined || career.experience < 16 + career.rank * 18) return null
    if ((career.path === 'civil' || career.path === 'military') && !isCourtEligible(game)) return null
    if ((career.path === 'civil' || career.path === 'military') && (stats.influence < 20 + career.rank * 12 || stats.royalFavor < 20 + career.rank * 12)) return null
    career.experience -= 16 + career.rank * 18; career.rank += 1
    stats.reputation = meter(stats.reputation + 4)
    stats.influence = meter(stats.influence + 2)
    message = `Advanced to ${careerDescriptions[career.path].titles[career.rank]}.`
  } else return null
  career.lastActionDay = game.dayCount
  const formal = career.rank > 0 && (career.path === 'civil' || career.path === 'military')
  return { game: { ...game, career, player, stats, culture, appointment: formal ? careerDescriptions[career.path].titles[career.rank] : (['civil','military'].includes(game.career.path) ? 'No official appointment' : game.appointment) }, message }
}

export function householdAction(game: GameState, action: 'steward' | 'expand' | 'invest' | 'divest'): { game: GameState; message: string } | null {
  if (game.ending || game.activeEvent || game.household.lastActionDay === game.dayCount) return null
  const household = { ...game.household }; const stats = { ...game.stats }
  let message = ''
  if (action === 'steward') {
    stats.wealth = meter(stats.wealth + (game.standing === 'commoner' ? 1 : 2))
    stats.health = meter(stats.health - 1)
    message = game.standing === 'commoner' ? 'Took modest paid work to sustain the household.' : 'Supervised accounts, rents and household needs.'
  } else if (action === 'expand') {
    const cost = 16 + household.level * 12
    if (game.standing === 'commoner' || household.level >= 3 || stats.wealth < cost) return null
    household.level += 1; stats.wealth -= cost
    message = `Expanded the family estate to holding level ${household.level}.`
  } else if (action === 'invest') {
    if (game.standing === 'commoner' || household.ventures >= 3 || stats.wealth < 16) return null
    household.ventures += 1; stats.wealth -= 16
    message = 'Placed household funds into a cautious commercial partnership.'
  } else if (action === 'divest') {
    if (household.ventures < 1) return null
    household.ventures -= 1; stats.wealth = meter(stats.wealth + 11)
    message = 'Ended a commercial partnership and brought its remaining capital home.'
  } else return null
  household.lastActionDay = game.dayCount
  return { game: { ...game, household, stats }, message }
}

/** Settle once per in-game month, including when the player skips an entire year. */
export function settleHousehold(game: GameState): GameState {
  const key = `${game.date.year}-${game.date.month}`
  if (game.household.lastSettlement === key) return game
  const { level, ventures, obligations } = game.household
  const seasonPenalty = [1, 2, 12].includes(game.date.month) ? 1 : 0
  const gross = game.standing === 'commoner' ? 0 : 2 + level * 2 + ventures * (game.date.month % 4 === 0 ? 0 : 1)
  const net = gross - obligations - seasonPenalty
  const updated = { ...game, household: { ...game.household, lastSettlement: key }, stats: { ...game.stats, wealth: meter(game.stats.wealth + net) } }
  if (updated.stats.wealth === 0 && net < 0) updated.stats.health = meter(updated.stats.health - 2)
  return updated
}

export function revokeNobleStatus(game: GameState, cause: string): GameState {
  if (game.standing === 'commoner') return game
  const downfall: DownfallRecord = {
    cause, atDay: game.dayCount, originalStanding: game.standing, evidence: 0, petitions: 0,
    lastActionDay: -30, acknowledged: false, restored: false
  }
  return { ...game, standing: 'commoner', socialStatus: 'Commoner by royal decree', appointment: 'No official appointment', career: { ...game.career, rank: 0, examined: false },
    downfall, identity: game.identity ? { ...game.identity, authority: 0, legitimacy: meter(game.identity.legitimacy - 16) } : game.identity, household: { ...game.household, level: 0 }, stats: { ...game.stats, reputation: meter(game.stats.reputation - 16), influence: meter(game.stats.influence - 20), royalFavor: meter(game.stats.royalFavor - 30), wealth: meter(game.stats.wealth - 15) } }
}
export function acknowledgeDownfall(game: GameState): GameState {
  if (game.standing !== 'commoner' || !game.downfall) return game
  return { ...game, downfall: { ...game.downfall, acknowledged: true } }
}
export function justiceAction(game: GameState, action: 'investigate' | 'allies' | 'appeal'): { game: GameState; message: string } | null {
  if (game.ending || game.activeEvent || game.standing !== 'commoner' || !game.downfall?.acknowledged || game.downfall.lastActionDay === game.dayCount) return null
  const downfall = { ...game.downfall }; const stats = { ...game.stats }
  let standing: SocialStanding = game.standing
  let socialStatus = game.socialStatus
  let message = ''
  if (action === 'investigate') {
    if (stats.wealth < 2) return null
    stats.wealth -= 2; downfall.evidence = Math.min(30, downfall.evidence + 3)
    message = 'Collected witness testimony and records challenging the original conviction.'
  } else if (action === 'allies') {
    if (stats.wealth < 3) return null
    stats.wealth -= 3; downfall.evidence = Math.min(30, downfall.evidence + 2)
    stats.influence = meter(stats.influence + 3)
    message = 'Asked surviving allies to defend your family and petition for mercy.'
  } else if (action === 'appeal') {
    if (downfall.evidence < 9 || stats.wealth < 5 || game.dayCount - downfall.atDay < 20) return null
    downfall.petitions += 1; stats.wealth -= 5
    const support = downfall.evidence * 3 + stats.influence + game.culture.virtue / 2 + game.factions.royalist / 3
    if (support >= 74) {
      downfall.restored = true
      standing = downfall.originalStanding
      socialStatus = standing === 'royal' ? 'Restored royal household' : 'Restored noble household'
      stats.reputation = meter(stats.reputation + 18)
      stats.royalFavor = meter(stats.royalFavor + 12)
      message = 'The royal court granted a formal pardon. Your household rights were restored.'
    } else {
      stats.reputation = meter(stats.reputation - 2)
      message = 'The petition was denied; the family must gather stronger proof and support.'
    }
  } else return null
  downfall.lastActionDay = game.dayCount
  return { game: { ...game, stats, downfall, standing, socialStatus }, message }
}

/** Backgrounds determine starting opportunity and adversity, never an automatic destiny. */
export function applyBackground(game: GameState): GameState {
  const background = game.player.background
  const stats = { ...game.stats }, culture = { ...game.culture }, household = { ...game.household }
  const player = { ...game.player, attributes: { ...game.player.attributes } }
  const factions = { ...game.factions }
  if (background.includes('political')) { stats.influence = meter(stats.influence + 12); stats.royalFavor = meter(stats.royalFavor + 4) }
  else if (background.includes('Military')) { player.attributes.courage = meter(player.attributes.courage + 12); stats.wealth = meter(stats.wealth + 6) }
  else if (background.includes('Royal')) { stats.royalFavor = meter(stats.royalFavor + 12); stats.influence = meter(stats.influence + 6) }
  else if (background.includes('Scholarly')) { culture.scholarship = meter(culture.scholarship + 12); player.attributes.intelligence = meter(player.attributes.intelligence + 8) }
  else if (background.includes('Declining')) { stats.wealth = meter(stats.wealth - 18); culture.virtue = meter(culture.virtue + 8); stats.reputation = meter(stats.reputation - 6) }
  else if (background.includes('Merchant-connected')) { stats.wealth = meter(stats.wealth + 14); household.ventures = 1 }
  else if (background.includes('Custom noble')) {
    if (player.familyFocus === 'scholarship') { culture.scholarship = meter(culture.scholarship + 10); player.attributes.intelligence = meter(player.attributes.intelligence + 6) }
    else if (player.familyFocus === 'military') player.attributes.courage = meter(player.attributes.courage + 12)
    else if (player.familyFocus === 'commerce') stats.wealth = meter(stats.wealth + 15)
    else { stats.influence = meter(stats.influence + 12); stats.royalFavor = meter(stats.royalFavor + 3) }
    if (player.familyChallenge === 'debt') stats.wealth = meter(stats.wealth - 20)
    else if (player.familyChallenge === 'rivals') { factions.royalist = meter(factions.royalist - 10); stats.influence = meter(stats.influence - 4) }
    else if (player.familyChallenge === 'disgrace') stats.reputation = meter(stats.reputation - 16)
  } else { stats.reputation = meter(stats.reputation + 7); player.attributes.intelligence = meter(player.attributes.intelligence + 6) }
  return { ...game, stats, player, culture, household, factions }
}
