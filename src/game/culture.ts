/** Culture & Society: a compact narrative simulation, not seventeen independent management games.
 * Dates use the existing fictionalized 12x30 story calendar; festivals are seasonal chapters,
 * not claims about exact lunar-calendar observance dates. All calculations are deterministic. */
import type { CulturalProfile, CulturalInvitation, CulturalProject, CultureSkill, GameState, StoryEvent } from './types'

export const cultureKeys: CultureSkill[] = ['scholarship', 'artistry', 'etiquette', 'virtue', 'prestige']
export const clampCulture = (value: number) => Math.min(100, Math.max(0, Math.round(value)))
export const seasons = [
  { name: 'Spring', ko: '봄', nameShort: 'SPRING', symbol: '春', motif: 'Poetry & renewal' },
  { name: 'Summer', ko: '여름', nameShort: 'SUMMER', symbol: '夏', motif: 'Gatherings & music' },
  { name: 'Autumn', ko: '가을', nameShort: 'AUTUMN', symbol: '秋', motif: 'Harvest & remembrance' },
  { name: 'Winter', ko: '겨울', nameShort: 'WINTER', symbol: '冬', motif: 'Compassion & reflection' }
] as const

export function seasonIndex(month: number): number { return Math.min(3, Math.floor((month - 1) / 3)) }
export function historicalPeriod(year: number): 'early' | 'middle' | 'late' | 'transition' {
  return year < 1550 ? 'early' : year < 1750 ? 'middle' : year < 1860 ? 'late' : 'transition'
}
export const periodDescriptions = {
  early: ['Foundations of the court', '조정의 기틀', 'Family rites and scholarly institutions are taking shape.'],
  middle: ['Scholarship and competing ideals', '학문과 사상의 갈림길', 'Learning, ritual and courtly competition command public attention.'],
  late: ['New ideas at the old court', '옛 조정의 새로운 사상', 'Literary circles and political schools compete for influence.'],
  transition: ['An era of profound change', '격변의 시대', 'Ritual conventions meet new knowledge and unfamiliar institutions.']
} as const

export function defaultCulture(): CulturalProfile {
  return { scholarship: 22, artistry: 18, etiquette: 34, virtue: 45, prestige: 12,
    traditions: ['Ancestral remembrance'], practices: {}, records: [], invitations: [], projects: [], lastInvitationKey: '' }
}

const socialSeasons = [
  { title: 'Spring Poetry Gathering', ko: '봄 시회', host: 'Scholar Baek Dojun', location: 'Palace Garden', kind: 'salon' as const,
    summary: 'An invitation arrives for a poetry circle. A scholarly rival will also be present.', summaryKo: '시회에 초대받았다. 그 자리에는 학문적 경쟁자도 참석한다.' },
  { title: 'Summer Court Banquet', ko: '여름 궁중 연회', host: 'Lady Jang Yejin', location: 'Royal Banquet Hall', kind: 'banquet' as const,
    summary: 'The choice of a seat, a gift, or a discreet withdrawal may change who trusts you.', summaryKo: '좌석과 선물, 물러섬의 선택이 신뢰를 바꿀 수 있다.' },
  { title: 'Autumn Household Observance', ko: '가을 가문 제례', host: 'Your family elders', location: 'Noble Residence', kind: 'rite' as const,
    summary: 'Your elders ask you to help preserve the household remembrance records.', summaryKo: '어른들이 가문의 추모 기록을 보존해 달라고 요청한다.' },
  { title: 'Winter Relief Gathering', ko: '겨울 구휼 모임', host: 'Lady Yun Haein', location: 'Traditional Market', kind: 'relief' as const,
    summary: 'Scarcity sharpens social divisions. You may offer resources, speak up, or step away.', summaryKo: '궁핍으로 갈등이 깊어진다. 자원을 보태거나 의견을 밝힐 수 있다.' }
]

/** Opens at the beginning of each fictionalized season. A pending invitation persists through time skips. */
export function inviteForSeason(game: GameState): GameState {
  const periodKey = `${game.date.year}-${seasonIndex(game.date.month)}`
  const base = game.culture ?? defaultCulture()
  // Invitations do not silently disappear during monthly skips, but after six months
  // an unaccepted one becomes a missed obligation and a new seasonal event can arrive.
  const overdue = base.invitations.filter(i => i.status === 'pending' && game.dayCount - i.createdDay >= 180)
  const culture: CulturalProfile = overdue.length ? { ...base, invitations: base.invitations.map(i =>
    i.status === 'pending' && game.dayCount - i.createdDay >= 180 ? { ...i, status: 'declined' as const } : i),
    etiquette: clampCulture(base.etiquette - 2 * overdue.length) } : base
  const ongoing = overdue.length ? { ...game, culture } : game
  if (culture.lastInvitationKey === periodKey) return ongoing
  if (culture.invitations.some(i => i.status === 'pending')) return ongoing
  const info = socialSeasons[seasonIndex(game.date.month)]
  const period = historicalPeriod(game.date.year)
  const eraDetail = game.mode === 'alternative' ? '' : {
    early: ' Early court customs and developing ritual standards shape the gathering.',
    middle: ' Scholarly schools disagree about the proper balance of learning and duty.',
    late: ' Rival literary circles watch for a useful ally.',
    transition: ' New learning meets established etiquette in an uncertain era.'
  }[period]
  const invite: CulturalInvitation = { id: `season-${periodKey}`, title: info.title, titleKo: info.ko,
    summary: info.summary + eraDetail, summaryKo: info.summaryKo, location: info.location, host: info.host,
    kind: info.kind, createdDay: game.dayCount, status: 'pending' }
  return { ...game, culture: { ...culture, lastInvitationKey: periodKey, invitations: [...culture.invitations, invite].slice(-20) } }
}

export function eventForInvitation(game: GameState, id: string): StoryEvent | null {
  const invite = game.culture?.invitations.find(i => i.id === id && i.status === 'pending')
  if (!invite) return null
  const { kind } = invite
  const noCost = (key: CultureSkill, amount: number) => ({ culture: { key, amount } })
  const options: StoryEvent['choices'] = kind === 'salon' ? [
    { text: 'Present a carefully composed poem', textKo: '정성껏 지은 시를 낭송한다', consequence: 'Your verses are remembered in the scholar’s circle.', consequenceKo: '당신의 시가 학자들에게 기억된다.', effect: { ...noCost('artistry', 8), reputation: 2, relationship: { npcId: 'dojun', respect: 5 }, culturalRecord: { kind: 'literature', title: 'Verses at the Spring Pavilion', titleKo: '봄 정자의 시' } } },
    { text: 'Question a respected elder with courtesy', textKo: '예의를 갖춰 어른에게 질문한다', consequence: 'The debate tests your learning and tact.', consequenceKo: '토론에서 학식과 예의가 시험받는다.', effect: { ...noCost('scholarship', 7), culturalSecondary: { key: 'etiquette', amount: game.culture.etiquette >= 45 ? 4 : -3 }, relationship: { npcId: 'gyeom', respect: game.culture.etiquette >= 45 ? 5 : -3 } } },
    { text: 'Listen and encourage a young scholar', textKo: '젊은 학자의 말을 듣고 격려한다', consequence: 'A friendship begins through generosity.', consequenceKo: '너그러운 마음으로 우정이 싹튼다.', effect: { ...noCost('virtue', 5), relationship: { npcId: 'dojun', affection: 5, trust: 4 } } }
  ] : kind === 'banquet' ? [
    { text: 'Observe formal seating protocol', textKo: '정해진 자리와 예법을 지킨다', consequence: 'The host recognizes your care for etiquette.', consequenceKo: '주인이 예의를 인정한다.', effect: { ...noCost('etiquette', 7), reputation: 2, relationship: { npcId: 'yejin', respect: 6 } } },
    { text: 'Offer a costly ceremonial gift', textKo: '값진 예물을 전한다', consequence: 'Admiration mingles with suspicion about your motives.', consequenceKo: '찬사와 의심이 교차한다.', effect: { wealth: -9, culture: { key: 'prestige', amount: 8 }, culturalSecondary: { key: 'virtue', amount: -2 }, relationship: { npcId: 'yejin', affection: 5 } } },
    { text: 'Speak privately for an overlooked guest', textKo: '소외된 손님을 위해 나선다', consequence: 'You make a loyal friend but irritate a court rival.', consequenceKo: '충직한 벗을 얻지만 정적을 자극한다.', effect: { ...noCost('virtue', 7), influence: -2, relationship: { npcId: 'seojun', respect: -4 } } }
  ] : kind === 'rite' ? [
    { text: 'Preserve and read the family chronicle', textKo: '가문의 기록을 보존하고 읽는다', consequence: 'An elder entrusts you with the household archive.', consequenceKo: '어른이 가문의 기록을 맡긴다.', effect: { ...noCost('virtue', 7), culturalSecondary: { key: 'scholarship', amount: 4 }, culturalRecord: { kind: 'rite', title: 'The Family Chronicle Preserved', titleKo: '가문 기록 보존' }, tradition: 'Keeper of the family chronicle' } },
    { text: 'Invite relatives long estranged', textKo: '멀어진 친척들을 초대한다', consequence: 'The house recovers a fragile connection.', consequenceKo: '가문이 오래된 인연을 회복한다.', effect: { ...noCost('etiquette', 6), reputation: 3, culturalSecondary: { key: 'virtue', amount: 3 } } },
    { text: 'Keep the ceremony private and simple', textKo: '조용하고 소박하게 예를 올린다', consequence: 'The ceremony offers clarity, though it draws little notice.', consequenceKo: '소박한 예에서 평온을 얻는다.', effect: { ...noCost('virtue', 4), health: 3 } }
  ] : [
    { text: 'Fund warm meals for struggling households', textKo: '형편이 어려운 집에 따뜻한 식사를 마련한다', consequence: 'Families remember your help when winter passes.', consequenceKo: '겨울이 지나도 사람들은 당신의 도움을 기억한다.', effect: { wealth: -12, culture: { key: 'virtue', amount: 10 }, culturalSecondary: { key: 'prestige', amount: 4 }, relationship: { npcId: 'haein', trust: 7 } } },
    { text: 'Petition officials to open the granaries', textKo: '관리에게 창고 개방을 청원한다', consequence: 'The petition attracts support and political scrutiny.', consequenceKo: '청원이 지지와 견제를 동시에 불러온다.', effect: { ...noCost('etiquette', 3), influence: 4, royalFavor: -2, culturalSecondary: { key: 'virtue', amount: 4 } } },
    { text: 'Help discreetly with the supplies at hand', textKo: '가진 물품으로 조용히 돕는다', consequence: 'Small mercies earn quiet gratitude.', consequenceKo: '작은 선의에 조용한 감사를 받는다.', effect: { wealth: -4, culture: { key: 'virtue', amount: 5 }, health: 2 } }
  ]
  return { id: `invitation-${id}`, title: invite.title, titleKo: invite.titleKo,
    story: `${invite.summary} Your host, ${invite.host}, awaits your response. Each course of action will be remembered.`,
    storyKo: `${invite.summaryKo} 초대한 이가 응답을 기다린다. 당신의 선택은 오래도록 남을 것이다.`,
    location: invite.location, choices: options }
}

export function declineInvitation(game: GameState, id: string): GameState | null {
  const invitation = game.culture.invitations.find(inv => inv.id === id && inv.status === 'pending')
  if (!invitation) return null
  return { ...game, culture: { ...game.culture,
    virtue: clampCulture(game.culture.virtue + (invitation.kind === 'rite' ? -5 : 0)),
    etiquette: clampCulture(game.culture.etiquette - 2),
    invitations: game.culture.invitations.map(inv => inv.id === id ? { ...inv, status: 'declined' as const } : inv) } }
}

export function practiceCulture(game: GameState, action: 'study' | 'poetry' | 'etiquette' | 'rites'): GameState | null {
  if (game.activeEvent || game.ending || game.culture.practices[action] === game.dayCount) return null
  const gains = {
    study: { skill: 'scholarship' as CultureSkill, amount: 4, cost: 0, health: -1 },
    poetry: { skill: 'artistry' as CultureSkill, amount: 5, cost: 1, health: 1 },
    etiquette: { skill: 'etiquette' as CultureSkill, amount: 4, cost: 0, health: 0 },
    rites: { skill: 'virtue' as CultureSkill, amount: 5, cost: 2, health: 1 }
  }
  const outcome = gains[action]
  if (game.stats.wealth < outcome.cost) return null
  return { ...game, stats: { ...game.stats, wealth: game.stats.wealth - outcome.cost, health: clampCulture(game.stats.health + outcome.health) },
    culture: { ...game.culture, [outcome.skill]: clampCulture(game.culture[outcome.skill] + outcome.amount),
      practices: { ...game.culture.practices, [action]: game.dayCount } } }
}

export const projects = [
  { id: 'library', name: 'The House Library', nameKo: '가문 서고', cost: 16, duration: 90, image: 'library', effect: 'scholarship' as CultureSkill,
    description: 'Preserve books and family manuscripts for the next generation.', descriptionKo: '다음 세대를 위해 서책과 문서를 보존합니다.' },
  { id: 'atelier', name: 'Patronage of the Arts', nameKo: '예술 후원', cost: 13, duration: 60, image: 'atelier', effect: 'artistry' as CultureSkill,
    description: 'Commission a work and offer skilled artists a livelihood.', descriptionKo: '예술가들에게 제작 기회와 후원을 제공합니다.' },
  { id: 'academy', name: 'Scholars’ Study Circle', nameKo: '학문 연구회', cost: 22, duration: 120, image: 'academy', effect: 'prestige' as CultureSkill,
    description: 'Endow a modest gathering place for scholarship and debate.', descriptionKo: '학문과 토론을 위한 모임을 지원합니다.' }
] as const

export function initiateProject(game: GameState, type: string): GameState | null {
  const definition = projects.find(p => p.id === type)
  if (!definition || game.activeEvent || game.ending || game.stats.wealth < definition.cost) return null
  if (game.culture.projects.some(p => p.type === type)) return null
  const entry: CulturalProject = { id: `${type}-${game.generation}-${game.dayCount}`, type, startedDay: game.dayCount,
    completionDay: game.dayCount + definition.duration, completed: false }
  return { ...game, stats: { ...game.stats, wealth: game.stats.wealth - definition.cost },
    culture: { ...game.culture, projects: [...game.culture.projects, entry] } }
}

/** Projects complete during daily or bulk advancement, never on a UI timer or backend. */
export function matureCulturalProjects(game: GameState): GameState {
  if (!game.culture?.projects.some(p => !p.completed && p.completionDay <= game.dayCount)) return game
  let culture = { ...game.culture, projects: [...game.culture.projects], records: [...game.culture.records] }
  for (const [index, project] of culture.projects.entries()) {
    if (project.completed || project.completionDay > game.dayCount) continue
    const definition = projects.find(p => p.id === project.type)
    if (!definition) continue
    culture.projects[index] = { ...project, completed: true }
    culture = { ...culture, [definition.effect]: clampCulture(culture[definition.effect] + 12),
      prestige: clampCulture(culture.prestige + 9),
      records: [...culture.records, { id: project.id, kind: 'patronage' as const, title: definition.name,
        titleKo: definition.nameKo, year: game.date.year, generation: game.generation }].slice(-40) }
  }
  return { ...game, culture }
}

export function completeInvitation(game: GameState, eventId: string): GameState {
  if (!eventId.startsWith('invitation-')) return game
  const id = eventId.slice('invitation-'.length)
  return { ...game, culture: { ...game.culture, invitations: game.culture.invitations.map(i =>
    i.id === id ? { ...i, status: 'attended' as const } : i) } }
}

/** Cultural story arcs that arise from player achievements, not random decorative clicks. */
export const culturalStoryEvents: StoryEvent[] = [
  { id: 'scholar-disputation', title: 'A Question Before the Scholars', titleKo: '학자들 앞의 물음', location: 'Audience Chamber',
    story: 'A distinguished scholar challenges the merit of a new reading at the academy. The court is listening. You may defend the interpretation, show humility, or confront a faction that hopes to use the dispute.',
    storyKo: '이름난 학자가 새 해석에 이의를 제기한다. 조정이 귀를 기울이는 가운데, 학설을 옹호하거나 겸손히 물러서거나 이를 정치에 이용하려는 무리에 맞설 수 있다.',
    choices: [
      { text: 'Defend your interpretation with evidence', textKo: '근거를 들어 자신의 해석을 옹호한다', consequence: 'Scholars concede your sincerity. The argument enters the court chronicle.', consequenceKo: '학자들이 진정성을 인정한다.', effect: { culture: { key: 'scholarship', amount: 9 }, culturalSecondary: { key: 'prestige', amount: 5 }, reputation: 3, culturalRecord: { kind: 'debate', title: 'The Academy Disputation', titleKo: '서원 논쟁' } } },
      { text: 'Acknowledge the elder’s insight', textKo: '선배의 통찰을 인정한다', consequence: 'You avoid humiliation and earn an older mentor.', consequenceKo: '체면을 지키며 스승을 얻는다.', effect: { culture: { key: 'etiquette', amount: 7 }, culturalSecondary: { key: 'virtue', amount: 4 }, relationship: { npcId: 'gyeom', trust: 5 } } },
      { text: 'Expose the political faction behind the debate', textKo: '논쟁 뒤의 정파를 폭로한다', consequence: 'The debate becomes a political weapon, but your name is remembered.', consequenceKo: '논쟁이 정치적 무기가 되지만 이름을 남긴다.', effect: { influence: 6, culture: { key: 'virtue', amount: -5 }, faction: { id: 'reform', amount: 4 } } }
    ] },
  { id: 'commission-reckoning', title: 'The Price of Patronage', titleKo: '후원의 대가', location: 'Noble Residence',
    story: 'One of your commissioned cultural projects has attracted admirers—and a relative who wants to claim its success. A celebration, an honest accounting, or a public gift will each leave a different mark.',
    storyKo: '후원한 문화 사업이 찬사를 받는다. 그러나 한 친척이 그 공을 차지하려 한다. 잔치와 공개 장부, 기증 중 무엇을 택할까?',
    choices: [
      { text: 'Give the artisans the credit they deserve', textKo: '장인들에게 공을 돌린다', consequence: 'The household becomes known for fairness.', consequenceKo: '가문이 공정함으로 알려진다.', effect: { culture: { key: 'virtue', amount: 9 }, culturalSecondary: { key: 'prestige', amount: 4 }, culturalRecord: { kind: 'patronage', title: 'A Patron’s Generosity', titleKo: '후원자의 너그러움' } } },
      { text: 'Hold a grand celebration in your name', textKo: '자신의 이름으로 큰 잔치를 연다', consequence: 'Visitors praise your sophistication, though some whisper of vanity.', consequenceKo: '손님들이 세련됨을 칭찬하지만 허영을 수군거린다.', effect: { wealth: -8, culture: { key: 'prestige', amount: 11 }, culturalSecondary: { key: 'virtue', amount: -4 } } },
      { text: 'Gift the finished work to the household archive', textKo: '완성된 작품을 가문의 문서고에 기증한다', consequence: 'A quiet gift becomes a multi-generational treasure.', consequenceKo: '조용한 선물이 대대로 내려가는 보물이 된다.', effect: { culture: { key: 'scholarship', amount: 5 }, culturalSecondary: { key: 'prestige', amount: 5 }, tradition: 'Patrons of the household archive' } }
    ] },
  { id: 'ancestors-dispute', title: 'The Duties We Inherit', titleKo: '이어받은 의무', location: 'Noble Residence',
    story: 'A senior relative argues that the household no longer honours its ancestors as it once did. Another insists that care for the living matters more than elaborate observance.',
    storyKo: '어른은 가문이 예전처럼 조상을 기리지 않는다고 꾸짖는다. 또 다른 이는 살아 있는 이를 돌보는 일이 더 중요하다고 말한다.',
    choices: [
      { text: 'Restore the family observance', textKo: '가문의 제례를 다시 세운다', consequence: 'Elders welcome your attention to inherited duties.', consequenceKo: '어른들이 책임감을 높이 평가한다.', effect: { wealth: -5, culture: { key: 'etiquette', amount: 6 }, culturalSecondary: { key: 'virtue', amount: 5 }, tradition: 'Seasonal household observances' } },
      { text: 'Give equal priority to living relatives', textKo: '살아 있는 친척을 돌보는 데 힘쓴다', consequence: 'Some elders disapprove, but younger relatives remember your kindness.', consequenceKo: '어른 일부가 반대하지만 젊은 친척은 고마워한다.', effect: { wealth: -6, culture: { key: 'virtue', amount: 9 }, reputation: -1 } },
      { text: 'Invite both sides to record a shared agreement', textKo: '양쪽을 모아 합의문을 쓴다', consequence: 'A compromise becomes a new household custom.', consequenceKo: '타협이 새로운 가문 전통이 된다.', effect: { culture: { key: 'etiquette', amount: 5 }, culturalSecondary: { key: 'scholarship', amount: 5 }, tradition: 'Family council of reconciliation' } }
    ] }
]

export function eligibleForCulturalEvent(game: GameState, id: string): boolean {
  const culture = game.culture ?? defaultCulture()
  if (id === 'scholar-disputation') return game.dayCount >= 60 && culture.scholarship >= 48
  if (id === 'commission-reckoning') return game.dayCount >= 45 && culture.projects.some(p => p.completed)
  if (id === 'ancestors-dispute') return game.dayCount >= 100 && culture.virtue >= 38
  return false
}
