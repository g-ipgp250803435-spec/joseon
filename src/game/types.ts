export type CampaignMode = 'historical' | 'alternative'
export type FactionId = 'reform' | 'tradition' | 'royalist'
export type Gender = 'Female' | 'Male'
export type AttributeKey = 'intelligence' | 'charisma' | 'influence' | 'diplomacy' | 'courage'
export type StatKey = 'reputation' | 'influence' | 'wealth' | 'health' | 'royalFavor'

export interface CharacterAttributes {
  intelligence: number
  charisma: number
  influence: number
  diplomacy: number
  courage: number
}

export interface PlayerCharacter {
  name: string
  gender: Gender
  age: number
  family: string
  background: string
  personality: string
  attributes: CharacterAttributes
  portrait: string
}

export interface GameDate {
  year: number
  month: number
  day: number
}

export interface Relationship {
  npcId: string
  affection: number
  trust: number
  respect: number
  romance: number
  status: string
}

export interface FamilyMember {
  id: string
  name: string
  relation: string
  age: number
  gender: Gender
  note: string
}

export interface GameStats {
  reputation: number
  influence: number
  wealth: number
  health: number
  royalFavor: number
}

export interface EventEffect {
  reputation?: number
  influence?: number
  wealth?: number
  health?: number
  royalFavor?: number
  attribute?: { key: AttributeKey; amount: number }
  relationship?: { npcId: string; affection?: number; trust?: number; respect?: number; romance?: number }
  flag?: string
  status?: string
  faction?: { id: FactionId; amount: number }
  addChild?: boolean
}

export interface EventChoice {
  text: string
  textKo: string
  consequence: string
  consequenceKo: string
  effect: EventEffect
}

export interface StoryEvent {
  id: string
  title: string
  titleKo: string
  story: string
  storyKo: string
  location: string
  choices: EventChoice[]
  requiresScenario?: string
}

export interface ActiveEvent extends StoryEvent {
  source: 'story' | 'random'
}

export interface GameState {
  schemaVersion: number
  mode: CampaignMode
  scenarioId: string
  campaignLabel: string
  monarch: string
  player: PlayerCharacter
  date: GameDate
  dayCount: number
  stats: GameStats
  socialStatus: string
  appointment: string
  relationships: Relationship[]
  family: FamilyMember[]
  currentLocation: string
  seenEvents: string[]
  activeEvent: ActiveEvent | null
  journal: string[]
  spouse: string | null
  children: number
  ending: { title: string; text: string; canContinue?: boolean } | null
  language: 'en' | 'ko'
  generation: number
  pendingBirthDueDay: number | null
  lastEventDay: number
  lastInteraction: Record<string, number>
  factions: Record<FactionId, number>
  lastFactionDay: number
}
