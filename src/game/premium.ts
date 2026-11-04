import type { FactionId, GameState } from './types'

export interface FactionDefinition {
  id: FactionId
  name: string
  nameKo: string
  motto: string
  mottoKo: string
  description: string
  colour: string
  seal: string
}
export const factions: FactionDefinition[] = [
  { id: 'reform', name: 'The Reform Circle', nameKo: '개혁파', motto: 'Change is the price of tomorrow', mottoKo: '변화가 내일의 대가다', description: 'Scholars and reformers seeking a fairer court, often at the expense of old privilege.', colour: '#8fa1a0', seal: '新' },
  { id: 'tradition', name: 'The Old Guard', nameKo: '수구파', motto: 'The order must endure', mottoKo: '질서를 지켜야 한다', description: 'Established noble houses defending precedent, hierarchy and carefully guarded privileges.', colour: '#bc8880', seal: '禮' },
  { id: 'royalist', name: 'The Royal Household', nameKo: '왕실파', motto: 'The throne holds the realm', mottoKo: '왕좌가 나라를 지킨다', description: 'Courtiers placing the stability of the monarch and royal family above factional quarrels.', colour: '#bca87d', seal: '王' }
]
export interface Milestone { id: string; name: string; nameKo: string; description: string; earned: (g: GameState) => boolean; seal: string }
export const milestones: Milestone[] = [
  { id:'begin', name:'A Name in the Chronicle',nameKo:'연대기에 남긴 이름',description:'Begin a life in Joseon.',earned:g=>g.dayCount>=0,seal:'始'},
  { id:'first', name:'The First Decision',nameKo:'첫 번째 결단',description:'Resolve a story event.',earned:g=>g.seenEvents.length>1,seal:'選'},
  { id:'trust', name:'A Trusted Confidant',nameKo:'믿음직한 벗',description:'Earn 55 trust with a court character.',earned:g=>g.relationships.some(r=>r.trust>=55),seal:'信'},
  { id:'love',name:'The Language of the Heart',nameKo:'마음의 언어',description:'Reach 60 romance with someone.',earned:g=>g.relationships.some(r=>r.romance>=60),seal:'愛'},
  { id:'marriage',name:'Two Houses Entwined',nameKo:'이어진 두 가문',description:'Enter a marriage alliance.',earned:g=>!!g.spouse,seal:'緣'},
  { id:'office',name:'A Seat at Court',nameKo:'조정에 오른 이름',description:'Receive a royal appointment.',earned:g=>g.appointment!=='No official appointment',seal:'官'},
  { id:'loyal',name:"The King’s Ear",nameKo:'임금의 귀',description:'Reach 65 royal favour.',earned:g=>g.stats.royalFavor>=65,seal:'恩'},
  { id:'faction',name:'The Weight of Allegiance',nameKo:'충성의 무게',description:'Gain 60 standing in any faction.',earned:g=>Object.values(g.factions).some(x=>x>=60),seal:'盟'},
  { id:'heir',name:'A New Branch',nameKo:'새로운 가지',description:'Welcome a child into the household.',earned:g=>g.children>0,seal:'子'},
  { id:'age',name:'Through the Seasons',nameKo:'흐르는 세월',description:'Live through three years of change.',earned:g=>g.dayCount>=1080,seal:'歲'},
  { id:'legacy',name:'An Enduring Name',nameKo:'잊히지 않는 이름',description:'Begin the second generation.',earned:g=>g.generation>=2,seal:'續'},
  { id:'crown',name:'The Crown Within Reach',nameKo:'눈앞의 왕관',description:'Reach 80 influence and 70 royal favour.',earned:g=>g.stats.influence>=80&&g.stats.royalFavor>=70,seal:'冠'}
]
export function achieved(g: GameState): Milestone[] { return milestones.filter(m => m.earned(g)) }
export const chapter = (days: number) => days < 30 ? 1 : days < 180 ? 2 : days < 540 ? 3 : 4
export const chapterTitles = [
  ['The Unwritten Page','쓰이지 않은 첫 장'],
  ['A Web of Silk and Steel','비단과 칼날의 그물'],
  ['The Weight of a Name','이름의 무게'],
  ['What Remains','남겨진 것']
]
export const characterArt = (npcId: string) => `/art/portraits/${npcId}.svg`
export const playerArt = (gender: string, emblem = '月') => {
  const options = ['月', '花', '雲', '竹', '星', '蘭']
  const index = Math.max(0, options.indexOf(emblem))
  return `/art/portraits/player-${gender.toLowerCase()}-${index}.svg`
}
