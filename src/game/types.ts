export type CampaignMode = 'historical' | 'alternative'
export type SocialStanding = 'noble' | 'royal' | 'commoner'
export type CareerPath = 'civil' | 'military' | 'scholarship' | 'household'
export interface CareerTrack { path: CareerPath; rank: number; experience: number; examined: boolean; lastActionDay: number }
export interface HouseholdEstate { level: number; ventures: number; obligations: number; lastSettlement: string; lastActionDay: number }
export interface DownfallRecord { cause: string; atDay: number; originalStanding: 'noble' | 'royal'; evidence: number; petitions: number; lastActionDay: number; acknowledged: boolean; restored: boolean }
export type HouseLeadership = 'elders' | 'player'
export interface IdentityProfile {
  birthStatus: 'noble' | 'royal'; honour: number; prestige: number; legitimacy: number; authority: number; popularity: number
  disposition: string; education: { classics: number; administration: number; martial: number; arts: number }; lastStudyDay: number
}
export interface HouseProfile {
  name: string; prestige: number; cohesion: number; leadership: HouseLeadership
  allies: string[]; rivals: string[]; heritage: string[]; lastCouncilDay: number; lastMentorDay: number
}
export interface Holding {
  id: string; name: string; province: string; kind: 'residence' | 'agricultural'; ownership: 'family' | 'personal'
  condition: number; productivity: number
}
export interface Enterprise {
  id: string; name: string; sector: 'textiles' | 'grain'; ownership: 'family' | 'personal'; capital: number; risk: number
}
export interface LedgerEntry {
  day: number; year: number; month: number; text: string; amount: number; category: 'income' | 'expense' | 'transfer'
}
export interface FinanceProfile {
  personalSavings: number; familyTreasury: number; familyDebt: number
  holdings: Holding[]; enterprises: Enterprise[]; ledger: LedgerEntry[]; lastMonthKey: string; lastActionDay: number; nextId: number
}

export type FactionId = 'reform' | 'tradition' | 'royalist'
export type Gender = 'Female' | 'Male'
export type AttributeKey = 'intelligence' | 'charisma' | 'influence' | 'diplomacy' | 'courage'
export type CultureSkill = 'scholarship' | 'artistry' | 'etiquette' | 'virtue' | 'prestige'
export interface CulturalRecord { id: string; kind: 'literature' | 'rite' | 'patronage' | 'debate' | 'festival'; title: string; titleKo: string; year: number; generation: number }
export interface CulturalInvitation { id: string; title: string; titleKo: string; summary: string; summaryKo: string; location: string; host: string; kind: 'salon' | 'banquet' | 'rite' | 'relief'; createdDay: number; status: 'pending' | 'attended' | 'declined' }
export interface CulturalProject { id: string; type: string; startedDay: number; completionDay: number; completed: boolean }
export interface CulturalProfile { scholarship: number; artistry: number; etiquette: number; virtue: number; prestige: number; traditions: string[]; practices: Record<string, number>; records: CulturalRecord[]; invitations: CulturalInvitation[]; projects: CulturalProject[]; lastInvitationKey: string }

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
  familyFocus?: 'scholarship' | 'politics' | 'military' | 'commerce'
  familyChallenge?: 'none' | 'debt' | 'rivals' | 'disgrace'
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
  loyalty?: number
  rivalry?: number
}

export interface FamilyMember {
  id: string
  name: string
  relation: string
  age: number
  gender: Gender
  note: string
  training?: { focus: 'classics' | 'administration' | 'martial' | 'arts'; progress: number }
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
  honour?: number
  legitimacy?: number
  housePrestige?: number
  familyTreasury?: number
  familyDebt?: number
  revokeStanding?: string
  addChild?: boolean
  culture?: { key: CultureSkill; amount: number }
  culturalSecondary?: { key: CultureSkill; amount: number }
  culturalRecord?: { kind: CulturalRecord['kind']; title: string; titleKo: string }
  tradition?: string
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
  standing: SocialStanding
  career: CareerTrack
  household: HouseholdEstate
  identity: IdentityProfile
  house: HouseProfile
  finance: FinanceProfile
  downfall: DownfallRecord | null
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
  culture: CulturalProfile
  factions: Record<FactionId, number>
  lastFactionDay: number
}
