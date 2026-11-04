import type { StoryEvent } from './types'

export interface Scenario {
  id: string
  year: number
  monarch: string
  label: string
  description: string
  startMonth?: number
  startDay?: number
}

export const historicalScenarios: Scenario[] = [
  { id: '1392', year: 1392, startMonth: 10, monarch: 'King Taejo', label: 'A New Dynasty · 1392', description: 'A new dynasty rises. Old loyalties are tested as a new order takes shape.' },
  { id: '1440', year: 1440, monarch: 'King Sejong', label: 'The Golden Court · 1440', description: 'Scholarship, statecraft and courtly ambition shape an age of achievement.' },
  { id: '1494', year: 1494, monarch: 'King Seongjong', label: 'The Unquiet Court · 1494', description: 'Court factions manoeuvre for influence beneath a fragile royal order.' },
  { id: '1592', year: 1592, monarch: 'King Seonjo', label: 'The Year of Crisis · 1592', description: 'War approaches. Duty, loyalty and survival pull noble houses in different directions.' },
  { id: '1724', year: 1724, startMonth: 10, startDay: 14, monarch: 'King Yeongjo', label: 'Shadows of the Succession · 1724', description: 'A new reign, an intercepted letter, and a dangerous choice at the lotus pond.' },
  { id: '1776', year: 1776, startMonth: 8, monarch: 'King Jeongjo', label: 'The Reformer’s Throne · 1776', description: 'A new reign opens amid competing visions for the kingdom.' },
  { id: '1863', year: 1863, startMonth: 12, startDay: 29, monarch: 'King Gojong', label: 'The Waning Kingdom · 1863', description: 'The old order faces mounting pressure and uncertainty.' }
]

export const alternativeScenario: Scenario = {
  id: 'alt', year: 1800, monarch: 'King Yi Gyeong', label: 'An Unwritten Reign',
  description: 'A fictional Joseon court where the balance of power is yours to change.'
}

export interface NPC {
  id: string
  name: string
  age: number
  gender: 'Female' | 'Male'
  role: string
  family: string
  personality: string
  portrait: string
  description: string
  romanceable?: boolean
}

export const npcs: NPC[] = [
  { id: 'hwayeon', name: 'Lady Seo Hwayeon', age: 21, gender: 'Female', role: 'Noble daughter', family: 'House Seo', personality: 'Perceptive and composed', portrait: '花', description: 'A discerning young noblewoman whose quiet observations often reveal more than public speeches.', romanceable: true },
  { id: 'hwan', name: 'Crown Prince Yi Hwan', age: 24, gender: 'Male', role: 'Royal heir', family: 'House Yi', personality: 'Reserved and dutiful', portrait: '世', description: 'The heir to the throne, caught between filial duty and his own judgement.', romanceable: true },
  { id: 'seojun', name: 'Lord Han Seojun', age: 28, gender: 'Male', role: 'Political rival', family: 'House Han', personality: 'Ambitious and calculating', portrait: '韓', description: 'A polished court operator who rarely makes a move without considering its consequence.', romanceable: true },
  { id: 'seoryeong', name: 'Lady Min Seoryeong', age: 23, gender: 'Female', role: 'Court companion', family: 'House Min', personality: 'Warm and observant', portrait: '敏', description: 'Well connected within the inner court and unusually skilled at reading people.', romanceable: true },
  { id: 'gyeom', name: 'Lord Choi Gyeom', age: 46, gender: 'Male', role: 'Senior state councillor', family: 'House Choi', personality: 'Pragmatic and stern', portrait: '崔', description: 'An experienced official whose approval can open doors—or close them.', romanceable: false },
  { id: 'haein', name: 'Lady Yun Haein', age: 20, gender: 'Female', role: 'Family confidante', family: 'House Yun', personality: 'Candid and loyal', portrait: '尹', description: 'A trusted companion who values sincerity over courtly performance.', romanceable: true },
  { id: 'muyeol', name: 'General Kang Muyeol', age: 32, gender: 'Male', role: 'Royal commander', family: 'House Kang', personality: 'Disciplined and direct', portrait: '姜', description: 'A respected commander whose loyalty to the throne is matched by his concern for his soldiers.', romanceable: true },
  { id: 'dowager', name: 'Queen Dowager Jeong', age: 59, gender: 'Female', role: 'Senior royal', family: 'House Jeong', personality: 'Formidable and strategic', portrait: '貞', description: 'A senior royal whose influence extends well beyond the private chambers.', romanceable: false },
  { id: 'dojun', name: 'Scholar Baek Dojun', age: 26, gender: 'Male', role: 'Royal academy scholar', family: 'House Baek', personality: 'Idealistic and thoughtful', portrait: '白', description: 'A gifted scholar who believes the court can still be persuaded by principle.', romanceable: true },
  { id: 'yejin', name: 'Lady Jang Yejin', age: 27, gender: 'Female', role: 'Noble patron', family: 'House Jang', personality: 'Elegant and decisive', portrait: '張', description: 'A wealthy patron with extensive household connections and a keen sense of opportunity.', romanceable: true }
]

export const locations = [
  { id: 'palace', name: 'Royal Palace', nameKo: '왕궁', description: 'The centre of royal authority and courtly ambition.', art: 'palace.svg', activities: ['Seek an audience', 'Observe the court'] },
  { id: 'residence', name: 'Noble Residence', nameKo: '양반 저택', description: 'Your household, family obligations and private affairs.', art: 'residence.svg', activities: ['Attend to the household', 'Receive a visitor'] },
  { id: 'garden', name: 'Palace Garden', nameKo: '궁궐 정원', description: 'A quieter place for conversation, reflection and secret meetings.', art: 'garden.svg', activities: ['Take a quiet walk', 'Arrange a private meeting'] },
  { id: 'audience', name: 'Audience Chamber', nameKo: '편전', description: 'A formal setting where royal favour can be won or lost.', art: 'hall.svg', activities: ['Present a petition', 'Discuss court affairs'] },
  { id: 'market', name: 'Traditional Market', nameKo: '시장', description: 'A lively district of merchants, gossip and opportunity.', art: 'market.svg', activities: ['Purchase a gift', 'Listen for rumours'] },
  { id: 'banquet', name: 'Royal Banquet Hall', nameKo: '연회장', description: 'A public stage for alliances, etiquette and reputation.', art: 'banquet.svg', activities: ['Attend a gathering', 'Make an introduction'] }
]

export const storyEvents: StoryEvent[] = [
  {
    id: 'sealed-letter', title: 'A Letter Without a Seal', titleKo: '봉인 없는 서찰', location: 'Palace Garden',
    story: 'A folded letter is left beneath the pavilion rail. The handwriting is familiar, but the message is not signed. It warns that a senior courtier is quietly gathering support against your family.',
    storyKo: '정자 난간 아래 접힌 서찰이 놓여 있다. 필체는 낯익지만 서명은 없다. 서찰은 한 고위 관료가 당신의 가문에 맞서 조용히 세력을 모으고 있다고 경고한다.',
    choices: [
      { text: 'Investigate discreetly', textKo: '은밀히 조사한다', consequence: 'You gain a useful lead, but attract attention.', consequenceKo: '유용한 단서를 얻지만 주목을 받는다.', effect: { influence: 3, reputation: 1, flag: 'letter-investigated' } },
      { text: 'Destroy the letter', textKo: '서찰을 없앤다', consequence: 'You avoid immediate entanglement.', consequenceKo: '당장의 연루를 피한다.', effect: { health: 2, flag: 'letter-destroyed' } },
      { text: 'Show it to a trusted ally', textKo: '믿을 만한 동료에게 보인다', consequence: 'Trust deepens, and the news travels carefully.', consequenceKo: '신뢰가 깊어지고 소식이 조심스럽게 퍼진다.', effect: { relationship: { npcId: 'haein', trust: 6, affection: 2 }, influence: 1, flag: 'letter-shared' } }
    ]
  },
  {
    id: 'banquet-seat', title: 'The Empty Seat', titleKo: '비어 있는 자리', location: 'Royal Banquet Hall',
    story: 'At a royal banquet, a place beside the Crown Prince has been left conspicuously empty. Several families are watching to see who will claim it.',
    storyKo: '왕실 연회에서 세자 곁의 자리가 눈에 띄게 비어 있다. 여러 가문이 누가 그 자리를 차지할지 지켜보고 있다.',
    choices: [
      { text: 'Take the seat confidently', textKo: '당당히 자리에 앉는다', consequence: 'Your visibility at court increases.', consequenceKo: '조정에서 당신의 존재감이 커진다.', effect: { influence: 4, royalFavor: 2, relationship: { npcId: 'hwan', respect: 3 } } },
      { text: 'Offer it to another guest', textKo: '다른 손님에게 양보한다', consequence: 'Your restraint earns quiet approval.', consequenceKo: '절제된 태도가 조용한 호평을 얻는다.', effect: { reputation: 4, relationship: { npcId: 'hwayeon', affection: 3 } } },
      { text: 'Avoid the attention', textKo: '시선을 피한다', consequence: 'You remain outside the evening’s contest.', consequenceKo: '그날 밤의 경쟁에서 한발 물러난다.', effect: { health: 2, reputation: 1 } }
    ]
  },
  {
    id: 'family-match', title: 'A Marriage Proposal', titleKo: '혼담', location: 'Noble Residence',
    story: 'Your family receives a carefully worded marriage proposal. The match would strengthen your household, though affection is far from certain.',
    storyKo: '가문에 신중하게 작성된 혼담이 들어온다. 이 혼인은 가문의 위상을 높일 수 있지만 애정은 아직 확실하지 않다.',
    choices: [
      { text: 'Consider the alliance', textKo: '혼인을 긍정적으로 검토한다', consequence: 'Your family’s standing improves.', consequenceKo: '가문의 입지가 좋아진다.', effect: { reputation: 3, influence: 2, flag: 'marriage-alliance-open' } },
      { text: 'Ask for time', textKo: '생각할 시간을 요청한다', consequence: 'You preserve your freedom to choose.', consequenceKo: '선택할 여지를 남겨 둔다.', effect: { relationship: { npcId: 'hwayeon', respect: 2 }, flag: 'marriage-delayed' } },
      { text: 'Decline politely', textKo: '정중히 거절한다', consequence: 'Your decision is respected by some and questioned by others.', consequenceKo: '일부는 결정을 존중하지만 다른 이들은 의문을 품는다.', effect: { reputation: -1, attribute: { key: 'courage', amount: 1 } } }
    ]
  },
  {
    id: 'court-rumour', title: 'A Rumour at Court', titleKo: '궁중의 소문', location: 'Royal Palace',
    story: 'A rumour claims that a powerful minister intends to remove one of the royal advisers. The story may be true—or designed to expose those who repeat it.',
    storyKo: '유력한 대신이 왕실 고문 한 명을 물러나게 하려 한다는 소문이 돈다. 사실일 수도, 이를 퍼뜨리는 사람을 가려내려는 계략일 수도 있다.',
    choices: [
      { text: 'Verify the claim', textKo: '소문의 진위를 확인한다', consequence: 'You gain insight into the factional balance.', consequenceKo: '정파 간 세력 구도를 파악한다.', effect: { influence: 3 } },
      { text: 'Warn the adviser', textKo: '고문에게 경고한다', consequence: 'An ally remembers your intervention.', consequenceKo: '동료가 당신의 개입을 기억한다.', effect: { relationship: { npcId: 'gyeom', trust: 6 }, reputation: 1 } },
      { text: 'Repeat nothing', textKo: '아무 말도 하지 않는다', consequence: 'You keep your name out of the rumour.', consequenceKo: '소문에 이름이 오르내리지 않는다.', effect: { royalFavor: 2 } }
    ]
  },
  {
    id: 'garden-encounter', title: 'An Unexpected Encounter', titleKo: '뜻밖의 만남', location: 'Palace Garden',
    story: 'You find someone you have come to admire beneath the flowering trees. For once, the court feels distant. There is time for an honest conversation.',
    storyKo: '꽃나무 아래에서 마음에 두고 있던 이를 만난다. 잠시 궁중의 소란이 멀어지고 솔직한 대화를 나눌 시간이 생긴다.',
    choices: [
      { text: 'Speak openly', textKo: '솔직하게 마음을 전한다', consequence: 'A private connection grows stronger.', consequenceKo: '두 사람 사이의 유대가 깊어진다.', effect: { relationship: { npcId: 'hwayeon', affection: 7, romance: 6, trust: 2 } } },
      { text: 'Keep the conversation light', textKo: '가벼운 대화를 나눈다', consequence: 'The encounter is pleasant and unpressured.', consequenceKo: '부담 없는 즐거운 만남이 된다.', effect: { relationship: { npcId: 'hwayeon', affection: 4, trust: 2 } } },
      { text: 'Return to your duties', textKo: '일과로 돌아간다', consequence: 'You protect your composure.', consequenceKo: '침착함을 지킨다.', effect: { reputation: 1, influence: 1 } }
    ]
  },
  {
    id: 'petition', title: 'A Petition for Justice', titleKo: '정의를 청하는 상소', location: 'Audience Chamber',
    story: 'A junior official asks you to support a petition concerning a family punished under questionable circumstances. Supporting it may anger a powerful household.',
    storyKo: '하급 관리가 석연치 않은 이유로 처벌받은 가문에 관한 상소를 지지해 달라고 요청한다. 이를 돕는다면 유력 가문의 심기를 거스를 수 있다.',
    choices: [
      { text: 'Support the petition', textKo: '상소를 지지한다', consequence: 'Your integrity is noticed, though a rival takes offence.', consequenceKo: '강직함을 인정받지만 경쟁자가 불쾌해한다.', effect: { reputation: 5, influence: -1, relationship: { npcId: 'seojun', respect: -3 } } },
      { text: 'Seek more evidence', textKo: '증거를 더 모은다', consequence: 'You take a cautious and defensible position.', consequenceKo: '신중하고 명분 있는 태도를 취한다.', effect: { influence: 2, attribute: { key: 'intelligence', amount: 1 } } },
      { text: 'Refuse involvement', textKo: '관여하지 않는다', consequence: 'You avoid a direct confrontation.', consequenceKo: '직접적인 충돌을 피한다.', effect: { royalFavor: 1 } }
    ]
  },
  {
    id: 'gift', title: 'A Gift from an Admirer', titleKo: '누군가의 선물', location: 'Noble Residence',
    story: 'A small lacquered box arrives with no formal sender. Inside is an object chosen with unmistakable care.',
    storyKo: '보낸 이의 이름이 적히지 않은 작은 칠기가 도착한다. 안에는 세심한 마음으로 고른 물건이 들어 있다.',
    choices: [
      { text: 'Accept the gift', textKo: '선물을 받는다', consequence: 'A quiet bond is encouraged.', consequenceKo: '조용한 인연이 이어진다.', effect: { relationship: { npcId: 'seoryeong', affection: 6, romance: 3 } } },
      { text: 'Return a thoughtful reply', textKo: '정성스러운 답례를 보낸다', consequence: 'The gesture is warmly received.', consequenceKo: '그 마음이 따뜻하게 전해진다.', effect: { relationship: { npcId: 'seoryeong', affection: 8, trust: 3, romance: 4 }, wealth: -2 } },
      { text: 'Send it back unopened', textKo: '열어보지 않고 돌려보낸다', consequence: 'You make your distance clear.', consequenceKo: '거리를 두겠다는 뜻을 분명히 한다.', effect: { reputation: 1 } }
    ]
  },
  {
    id: 'war-dispatch', title: 'A Dispatch from the North', titleKo: '북방에서 온 장계', location: 'Royal Palace',
    story: 'A military dispatch reports unrest along the frontier. The court debates whether to send supplies, troops or envoys.',
    storyKo: '변경에서 소요가 일어났다는 군사 장계가 도착한다. 조정은 물자와 병력을 보낼지, 사신을 파견할지 논의한다.',
    choices: [
      { text: 'Advocate measured support', textKo: '절제된 지원을 제안한다', consequence: 'Your practical counsel earns respect.', consequenceKo: '현실적인 조언으로 존중을 얻는다.', effect: { influence: 2, relationship: { npcId: 'muyeol', respect: 5 } } },
      { text: 'Urge decisive action', textKo: '단호한 대응을 촉구한다', consequence: 'Your courage is noted, but the risk is understood.', consequenceKo: '용기를 인정받지만 위험성도 드러난다.', effect: { reputation: 2, influence: 2, health: -1 } },
      { text: 'Recommend negotiation', textKo: '협상을 권한다', consequence: 'Diplomatic voices gain ground.', consequenceKo: '외교적 해결을 주장하는 목소리가 힘을 얻는다.', effect: { royalFavor: 2, attribute: { key: 'diplomacy', amount: 1 } } }
    ]
  },
  {
    id: 'family-dispute', title: 'A Dispute Within the Household', titleKo: '가문의 갈등', location: 'Noble Residence',
    story: 'Two relatives disagree over the management of the family estate. Their quarrel is beginning to affect the household’s reputation.',
    storyKo: '두 친족이 가산 관리 문제로 다투고 있다. 갈등은 가문의 평판에도 영향을 미치기 시작했다.',
    choices: [
      { text: 'Hear both sides', textKo: '양측의 말을 모두 듣는다', consequence: 'A fair resolution restores confidence.', consequenceKo: '공정한 중재로 신뢰를 회복한다.', effect: { reputation: 3, influence: 1 } },
      { text: 'Support the senior relative', textKo: '연장자의 편을 든다', consequence: 'Tradition is upheld, but resentment remains.', consequenceKo: '전통을 따르지만 불만은 남는다.', effect: { reputation: 1, relationship: { npcId: 'gyeom', respect: 2 } } },
      { text: 'Delegate the matter', textKo: '문제를 위임한다', consequence: 'You preserve time for court affairs.', consequenceKo: '궁중 업무에 집중할 시간을 확보한다.', effect: { influence: 1 } }
    ]
  },
  {
    id: 'poetry-night', title: 'Poetry Beneath the Lanterns', titleKo: '등불 아래의 시회', location: 'Palace Garden',
    story: 'A small gathering of scholars and nobles begins composing verses beneath the lanterns. A graceful contribution could improve your standing.',
    storyKo: '등불 아래에서 문사와 귀족들이 시를 짓기 시작한다. 품격 있는 작품은 당신의 평판을 높일 수 있다.',
    choices: [
      { text: 'Offer an original verse', textKo: '직접 지은 시를 선보인다', consequence: 'Your cultural refinement is admired.', consequenceKo: '문예적 소양을 인정받는다.', effect: { reputation: 3, relationship: { npcId: 'dojun', affection: 3, respect: 4 } } },
      { text: 'Praise another poet', textKo: '다른 시인을 칭찬한다', consequence: 'You build goodwill without seeking attention.', consequenceKo: '자신을 드러내지 않고 호의를 얻는다.', effect: { relationship: { npcId: 'dojun', trust: 4, affection: 2 } } },
      { text: 'Listen quietly', textKo: '조용히 감상한다', consequence: 'You leave with a calmer mind.', consequenceKo: '한결 차분한 마음으로 자리를 떠난다.', effect: { health: 3 } }
    ]
  },
  {
    id: 'scandal', title: 'A Dangerous Allegation', titleKo: '위험한 혐의', location: 'Royal Palace',
    story: 'A rival household is accused of passing private court information to outsiders. Your name is mentioned in the same breath.',
    storyKo: '경쟁 가문이 궁중의 비밀을 외부에 전했다는 혐의를 받는다. 그 과정에서 당신의 이름도 거론된다.',
    choices: [
      { text: 'Demand a formal inquiry', textKo: '공식 조사를 요구한다', consequence: 'You defend your name through procedure.', consequenceKo: '절차를 통해 자신의 명예를 지킨다.', effect: { reputation: 3, influence: 2, flag: 'inquiry-opened' } },
      { text: 'Confront the accuser privately', textKo: '고발자를 따로 만난다', consequence: 'You may uncover a motive, but risk escalation.', consequenceKo: '배후를 알아낼 수 있지만 갈등이 커질 수 있다.', effect: { attribute: { key: 'courage', amount: 1 }, relationship: { npcId: 'seojun', respect: -2 } } },
      { text: 'Seek royal protection', textKo: '왕실의 보호를 구한다', consequence: 'The monarch’s attention may protect or constrain you.', consequenceKo: '군주의 관심이 보호가 될 수도, 제약이 될 수도 있다.', effect: { royalFavor: 4, influence: 1 } }
    ]
  },
  {
    id: 'illness', title: 'A Fever in the Household', titleKo: '가문의 열병', location: 'Noble Residence',
    story: 'A member of your household has fallen ill. The physician recommends rest and a costly course of treatment.',
    storyKo: '가족 중 한 사람이 병에 걸렸다. 의원은 충분한 휴식과 적지 않은 비용이 드는 치료를 권한다.',
    choices: [
      { text: 'Arrange the best treatment', textKo: '최선의 치료를 마련한다', consequence: 'The household is reassured by your care.', consequenceKo: '세심한 보살핌에 가족이 안심한다.', effect: { wealth: -5, reputation: 2, health: 2 } },
      { text: 'Follow a modest treatment plan', textKo: '절제된 치료를 택한다', consequence: 'You balance care with household means.', consequenceKo: '가계 형편을 고려해 치료한다.', effect: { wealth: -2, health: 1 } },
      { text: 'Ask the court physician for help', textKo: '어의에게 도움을 청한다', consequence: 'Your royal connections are put to use.', consequenceKo: '왕실 인맥을 활용한다.', effect: { royalFavor: 2, relationship: { npcId: 'dowager', trust: 2 } } }
    ]
  },
  {
    id: 'succession-whisper', title: 'Whispers of Succession', titleKo: '후계에 관한 밀담', location: 'Audience Chamber',
    story: 'A private conversation hints that influential families are already positioning themselves around the future succession. Silence may be prudent, but neutrality may not last.',
    storyKo: '유력 가문들이 차기 왕위 계승을 두고 이미 움직이고 있다는 은밀한 이야기가 들린다. 침묵이 현명할 수 있지만 중립이 오래가지는 않을 것이다.',
    choices: [
      { text: 'Remain publicly neutral', textKo: '공개적으로 중립을 지킨다', consequence: 'You preserve room to manoeuvre.', consequenceKo: '향후 움직일 여지를 남긴다.', effect: { reputation: 2, influence: 1 } },
      { text: 'Strengthen ties with the heir', textKo: '세자와의 관계를 강화한다', consequence: 'Your position near the succession becomes clearer.', consequenceKo: '왕위 계승 구도에서 입장이 분명해진다.', effect: { royalFavor: 2, relationship: { npcId: 'hwan', trust: 5, respect: 3 } } },
      { text: 'Consult the senior royals', textKo: '왕실 어른들과 상의한다', consequence: 'You seek legitimacy before taking a position.', consequenceKo: '입장을 정하기 전에 정통성을 확보하려 한다.', effect: { relationship: { npcId: 'dowager', trust: 5 }, influence: 2 } }
    ]
  },
  {
    id: 'secret-meeting', title: 'The Midnight Pavilion', titleKo: '자정의 정자', location: 'Palace Garden',
    story: 'An invitation arrives for a meeting after the palace lamps are extinguished. The sender promises information about a rival—but asks for discretion.',
    storyKo: '궁궐의 등불이 꺼진 뒤 만나자는 초대가 도착한다. 발신자는 경쟁자에 관한 정보를 약속하지만 비밀을 지켜 달라고 요구한다.',
    choices: [
      { text: 'Attend the meeting', textKo: '만남에 참석한다', consequence: 'You obtain information and a new obligation.', consequenceKo: '정보를 얻는 대신 새로운 부담을 진다.', effect: { influence: 4, flag: 'midnight-met' } },
      { text: 'Send a trusted intermediary', textKo: '믿을 만한 사람을 대신 보낸다', consequence: 'You reduce personal risk.', consequenceKo: '직접 나서는 위험을 줄인다.', effect: { reputation: 1, relationship: { npcId: 'haein', trust: 3 } } },
      { text: 'Refuse the invitation', textKo: '초대를 거절한다', consequence: 'You avoid a potentially dangerous alliance.', consequenceKo: '위험할 수 있는 동맹을 피한다.', effect: { royalFavor: 1, health: 1 } }
    ]
  },
  {
    id: 'royal-favour', title: 'The Monarch’s Favour', titleKo: '군주의 총애', location: 'Royal Palace',
    story: 'The monarch publicly praises your conduct. The recognition is brief, but everyone in the hall understands its meaning.',
    storyKo: '군주가 공개적으로 당신의 처신을 칭찬한다. 짧은 말이지만 전각에 모인 이들은 그 의미를 이해한다.',
    choices: [
      { text: 'Accept with humility', textKo: '겸손하게 받아들인다', consequence: 'Your reputation and royal favour rise.', consequenceKo: '평판과 왕실의 총애가 높아진다.', effect: { reputation: 4, royalFavor: 5 } },
      { text: 'Credit your household', textKo: '가문의 공으로 돌린다', consequence: 'Your family shares in the honour.', consequenceKo: '가문도 함께 명예를 얻는다.', effect: { reputation: 3, relationship: { npcId: 'hwayeon', affection: 2 } } },
      { text: 'Use the moment to petition', textKo: '이 기회에 청원을 올린다', consequence: 'You turn praise into political opportunity.', consequenceKo: '칭찬을 정치적 기회로 바꾼다.', effect: { influence: 4, royalFavor: -1 } }
    ]
  },
  {
    id: 'betrayal', title: 'A Friend’s Betrayal', titleKo: '벗의 배신', location: 'Noble Residence',
    story: 'A confidence you shared has reached a rival household. The source appears to be someone you once trusted.',
    storyKo: '믿고 털어놓았던 이야기가 경쟁 가문에 전해졌다. 발신자는 한때 신뢰했던 사람으로 보인다.',
    choices: [
      { text: 'Confront them directly', textKo: '직접 따져 묻는다', consequence: 'The truth emerges, but the relationship changes.', consequenceKo: '진실이 드러나지만 관계는 달라진다.', effect: { attribute: { key: 'courage', amount: 1 }, reputation: 1 } },
      { text: 'Keep the betrayal in reserve', textKo: '배신을 당장은 덮어 둔다', consequence: 'You retain a possible advantage for later.', consequenceKo: '훗날 활용할 수 있는 패를 남긴다.', effect: { influence: 3, flag: 'betrayal-known' } },
      { text: 'End the friendship', textKo: '우정을 끝낸다', consequence: 'You protect yourself at a personal cost.', consequenceKo: '개인적인 대가를 치르고 자신을 보호한다.', effect: { reputation: 1, health: -1 } }
    ]
  },
  {
    id: 'restoration', title: 'The Price of Restoration', titleKo: '복권의 대가', location: 'Royal Palace',
    story: 'After a period of disgrace, an intermediary suggests that your family may be restored to its former standing. The price is a public declaration of loyalty.',
    storyKo: '실각의 시간이 지난 뒤, 한 중개인이 가문의 옛 지위를 회복할 수 있다고 귀띔한다. 대가는 공개적인 충성 선언이다.',
    choices: [
      { text: 'Accept the terms', textKo: '조건을 받아들인다', consequence: 'Your standing begins to recover.', consequenceKo: '사회적 지위가 회복되기 시작한다.', effect: { reputation: 5, royalFavor: 4, status: 'Noble standing restored' } },
      { text: 'Negotiate better terms', textKo: '더 나은 조건을 협상한다', consequence: 'You risk delay in exchange for independence.', consequenceKo: '자주성을 위해 회복이 늦어질 위험을 감수한다.', effect: { influence: 3, attribute: { key: 'diplomacy', amount: 1 } } },
      { text: 'Refuse to bend', textKo: '굴복을 거부한다', consequence: 'You preserve your principles, but remain vulnerable.', consequenceKo: '원칙을 지키지만 여전히 취약한 상황이다.', effect: { reputation: 2, royalFavor: -2 } }
    ]
  },
  {
    id: 'heir', title: 'An Heir for the House', titleKo: '가문의 후계자', location: 'Noble Residence',
    story: 'Your household gathers to mark the arrival of a child. The event changes the rhythm of your family and gives new meaning to the future.',
    storyKo: '아이의 탄생을 축하하기 위해 가족이 모인다. 새로운 생명은 가문의 일상과 미래에 새로운 의미를 더한다.',
    choices: [
      { text: 'Hold a modest family celebration', textKo: '가족끼리 소박하게 축하한다', consequence: 'Family bonds strengthen.', consequenceKo: '가족의 유대가 깊어진다.', effect: { reputation: 2, wealth: -1, flag: 'birth-celebrated' } },
      { text: 'Host a gathering for allies', textKo: '동료들을 초대해 연회를 연다', consequence: 'The family’s joyful news reaches the court.', consequenceKo: '기쁜 소식이 조정에도 알려진다.', effect: { reputation: 3, influence: 2, wealth: -4, flag: 'birth-celebrated' } },
      { text: 'Keep the occasion private', textKo: '가족만의 일로 간직한다', consequence: 'You protect the household’s privacy.', consequenceKo: '가문의 사생활을 지킨다.', effect: { health: 2, flag: 'birth-celebrated' } }
    ]
  },
  {
    id: 'final-audience', title: 'The Final Audience', titleKo: '마지막 알현', location: 'Audience Chamber',
    story: 'Years of service and difficult choices have brought you before the throne. The monarch asks what you believe should endure after your own time has passed.',
    storyKo: '오랜 봉사와 수많은 선택 끝에 당신은 어좌 앞에 선다. 군주는 당신이 떠난 뒤 무엇이 남아야 한다고 생각하는지 묻는다.',
    choices: [
      { text: 'The honour of the family', textKo: '가문의 명예', consequence: 'Your legacy is remembered through your house.', consequenceKo: '가문을 통해 당신의 유산이 기억된다.', effect: { reputation: 5, flag: 'legacy-family' } },
      { text: 'A more just court', textKo: '더 정의로운 조정', consequence: 'Your service becomes your enduring legacy.', consequenceKo: '당신의 봉사가 오래 남는 유산이 된다.', effect: { influence: 4, reputation: 3, flag: 'legacy-court' } },
      { text: 'The people who stood beside me', textKo: '곁을 지킨 사람들', consequence: 'Your relationships define how you are remembered.', consequenceKo: '당신이 맺은 인연이 기억의 기준이 된다.', effect: { relationship: { npcId: 'hwayeon', affection: 5 }, flag: 'legacy-people' } }
    ]
  }
]


// One compact, era-specific dramatic episode for every campaign opening.
// These are fictional situations informed by historical context, not invented historical records.
storyEvents.push(
  {
    id: 'chronicle-1392', requiresScenario: '1392', title: 'The Old Oath', titleKo: '옛 맹세', location: 'Royal Palace',
    story: 'As the new dynasty takes root, a kinsman asks whether your household should publicly renounce its former Goryeo loyalties.',
    storyKo: '새 왕조가 자리를 잡아 가는 가운데, 친족이 가문이 옛 고려 왕조에 대한 충의를 공개적으로 버려야 하는지 묻는다.',
    choices: [
      { text: 'Pledge loyalty to Joseon', textKo: '조선에 충성을 맹세한다', consequence: 'The new court welcomes your household.', consequenceKo: '새 조정이 가문을 받아들인다.', effect: { royalFavor: 5, influence: 3 } },
      { text: 'Protect the older retainers', textKo: '옛 가신들을 보호한다', consequence: 'You earn private loyalty at a public cost.', consequenceKo: '공적인 대가를 치르며 사적인 충의를 얻는다.', effect: { reputation: 3, royalFavor: -2 } },
      { text: 'Keep your counsel', textKo: '입장을 밝히지 않는다', consequence: 'Your family avoids an immediate confrontation.', consequenceKo: '당장의 대립을 피한다.', effect: { health: 2, influence: -1 } }
    ]
  },
  {
    id: 'chronicle-1440', requiresScenario: '1440', title: 'A Question of Learning', titleKo: '배움의 길', location: 'Audience Chamber',
    story: 'In the reign of Sejong, a scholar suggests investing in more accessible instruction for talented youths outside the greatest houses.',
    storyKo: '세종의 치세에 한 학자가 큰 가문 밖의 재능 있는 젊은이들도 배움에 참여하도록 지원하자고 제안한다.',
    choices: [
      { text: 'Sponsor the scholars', textKo: '학자들을 후원한다', consequence: 'Your patronage earns respect.', consequenceKo: '후원으로 존경을 얻는다.', effect: { wealth: -4, reputation: 4, attribute: { key: 'intelligence', amount: 2 } } },
      { text: 'Consult conservative elders', textKo: '보수적인 원로에게 묻는다', consequence: 'You strengthen traditional ties.', consequenceKo: '전통적인 인맥을 다진다.', effect: { relationship: { npcId: 'gyeom', trust: 4 }, royalFavor: 1 } },
      { text: 'Stay outside the debate', textKo: '논쟁에 관여하지 않는다', consequence: 'You protect your household resources.', consequenceKo: '가문의 재산을 지킨다.', effect: { wealth: 2 } }
    ]
  },
  {
    id: 'chronicle-1494', requiresScenario: '1494', title: 'An Anxious Succession', titleKo: '불안한 왕위 계승', location: 'Royal Palace',
    story: 'In the final year of Seongjong’s reign, court households quietly speculate about the future balance of power and the heir’s circle.',
    storyKo: '성종의 치세 마지막 해, 궁중 가문들은 다음 왕위와 세자 주변의 권력 관계를 조용히 논한다.',
    choices: [
      { text: 'Seek the heir’s circle', textKo: '세자 측근에게 접근한다', consequence: 'Your prospects rise, but so does attention.', consequenceKo: '앞날의 기회와 시선이 함께 커진다.', effect: { influence: 4, reputation: -1 } },
      { text: 'Defend established protocols', textKo: '기존 예법을 지킨다', consequence: 'Senior courtiers approve.', consequenceKo: '원로 대신들의 인정을 받는다.', effect: { reputation: 3, relationship: { npcId: 'gyeom', respect: 3 } } },
      { text: 'Avoid factional commitments', textKo: '정파의 약속을 피한다', consequence: 'You retain your independence.', consequenceKo: '독자적인 입장을 유지한다.', effect: { health: 2 } }
    ]
  },
  {
    id: 'chronicle-1592', requiresScenario: '1592', title: 'War at the Border', titleKo: '변방의 전란', location: 'Royal Palace',
    story: 'Urgent military reports warn of an invasion. Officials dispute whether noble households should equip messengers, fund defences, or protect their own.',
    storyKo: '긴급 군사 보고가 침략을 알린다. 사대부 가문들이 전령을 지원할지, 방비에 돈을 댈지, 가족부터 지킬지를 두고 논쟁이 벌어진다.',
    choices: [
      { text: 'Fund urgent defences', textKo: '급한 방비를 지원한다', consequence: 'You sacrifice wealth to aid the kingdom.', consequenceKo: '나라를 위해 재산을 바친다.', effect: { wealth: -8, reputation: 6, royalFavor: 3 } },
      { text: 'Escort vulnerable families', textKo: '피난민 가족을 호위한다', consequence: 'People remember your courage.', consequenceKo: '사람들은 용기를 기억한다.', effect: { reputation: 4, health: -3, attribute: { key: 'courage', amount: 2 } } },
      { text: 'Secure the household first', textKo: '가문을 먼저 보호한다', consequence: 'Your relatives are safer, though some question your priorities.', consequenceKo: '친족의 안전을 지키지만 비판도 따른다.', effect: { health: 3, reputation: -2 } }
    ]
  },
  {
    id: 'chronicle-1776', requiresScenario: '1776', title: 'A New King’s Resolve', titleKo: '새 임금의 뜻', location: 'Audience Chamber',
    story: 'Jeongjo’s accession renews disputes over royal authority, scholarship and the ambitions of powerful court factions.',
    storyKo: '정조가 즉위하자 왕권과 학문, 강력한 정파의 야망을 둘러싼 논쟁이 새롭게 일어난다.',
    choices: [
      { text: 'Support reform at court', textKo: '조정 개혁을 지지한다', consequence: 'The reform faction takes note.', consequenceKo: '개혁파가 당신을 주목한다.', effect: { royalFavor: 4, influence: 3, relationship: { npcId: 'dojun', respect: 4 } } },
      { text: 'Defend noble privileges', textKo: '양반의 특권을 지킨다', consequence: 'Older houses approve, reformers are wary.', consequenceKo: '구세력은 환영하지만 개혁파는 경계한다.', effect: { reputation: 2, relationship: { npcId: 'gyeom', trust: 4 } } },
      { text: 'Broker a compromise', textKo: '타협을 중재한다', consequence: 'Your diplomacy protects relationships.', consequenceKo: '외교적 수완으로 인연을 지킨다.', effect: { attribute: { key: 'diplomacy', amount: 3 }, influence: 1 } }
    ]
  },
  {
    id: 'chronicle-1863', requiresScenario: '1863', title: 'The Regent’s Shadow', titleKo: '섭정의 그림자', location: 'Royal Palace',
    story: 'The youthful Gojong has ascended the throne. Households quietly weigh the rising influence of his father and the changing balance at court.',
    storyKo: '어린 고종이 즉위했다. 가문들은 국왕의 아버지가 행사할 영향력과 조정의 변화를 조심스레 저울질한다.',
    choices: [
      { text: 'Approach the new power centre', textKo: '새 권력 중심에 접근한다', consequence: 'You gain a foothold near authority.', consequenceKo: '권력 가까이에 발판을 마련한다.', effect: { influence: 5, royalFavor: 2 } },
      { text: 'Stand by experienced allies', textKo: '오래된 동맹을 지킨다', consequence: 'Old friendships become more important.', consequenceKo: '오랜 우의가 더욱 중요해진다.', effect: { relationship: { npcId: 'gyeom', trust: 5 }, reputation: 2 } },
      { text: 'Retreat from court affairs', textKo: '궁중 정쟁에서 물러난다', consequence: 'You preserve health and household peace.', consequenceKo: '건강과 가문의 평화를 지킨다.', effect: { health: 4, influence: -2 } }
    ]
  },
  {
    id: 'chronicle-alt', requiresScenario: 'alt', title: 'The Unwritten Crown', titleKo: '쓰이지 않은 왕관', location: 'Audience Chamber',
    story: 'In this other Joseon, a rival claimant seeks your household’s public support. The royal order may yet be rewritten.',
    storyKo: '다른 조선에서 왕위 경쟁자가 가문의 공개적인 지지를 구한다. 왕실의 질서는 아직 바뀔 수 있다.',
    choices: [
      { text: 'Back the challenger', textKo: '도전자를 지지한다', consequence: 'You gain a dangerous new patron.', consequenceKo: '위험한 새 후원자를 얻는다.', effect: { influence: 6, royalFavor: -4, flag: 'backed-challenger' } },
      { text: 'Defend the reigning house', textKo: '현 왕실을 지킨다', consequence: 'The crown values your loyalty.', consequenceKo: '왕실이 당신의 충성을 높이 산다.', effect: { royalFavor: 6, reputation: 2 } },
      { text: 'Keep rival factions talking', textKo: '정파 사이의 대화를 유지한다', consequence: 'You remain a useful intermediary.', consequenceKo: '유용한 중개자로 남는다.', effect: { attribute: { key: 'diplomacy', amount: 3 }, influence: 2 } }
    ]
  }
)


// Short follow-up scenes make earlier decisions matter beyond a stat adjustment.
storyEvents.push(
  {
    id: 'letter-reckoning', title: 'The Letter’s Author', titleKo: '서찰의 주인', location: 'Palace Garden',
    story: 'The author of the anonymous letter asks to meet. The warning was genuine, but the sender now expects your help against a common rival.',
    storyKo: '익명의 서찰을 보낸 사람이 만남을 청한다. 경고는 진심이었지만, 발신자는 이제 공동의 적을 상대할 도움을 기대한다.',
    choices: [
      { text: 'Expose the plot to the court', textKo: '음모를 조정에 폭로한다', consequence: 'Your name is cleared, but court factions take notice.', consequenceKo: '명예를 회복하지만 정파들이 주목한다.', effect: { reputation: 5, influence: -2, flag: 'letter-exposed' } },
      { text: 'Quietly aid the informant', textKo: '밀고자를 은밀히 돕는다', consequence: 'You secure a discreet alliance.', consequenceKo: '은밀한 동맹을 얻는다.', effect: { influence: 4, royalFavor: -2, relationship: { npcId: 'haein', trust: 4 }, flag: 'informant-aided' } },
      { text: 'End the matter here', textKo: '사건을 여기서 끝낸다', consequence: 'Your household avoids a costly feud.', consequenceKo: '가문이 큰 다툼을 피한다.', effect: { health: 3, reputation: 1 } }
    ]
  },
  {
    id: 'claimant-aftermath', title: 'A Claimant Returns', titleKo: '돌아온 왕위 경쟁자', location: 'Audience Chamber',
    story: 'The rival claimant you supported now demands a public pledge. Continuing the alliance may destabilize your position at the reigning court.',
    storyKo: '당신이 지지했던 왕위 경쟁자가 공개적인 맹세를 요구한다. 동맹을 이어 가면 현 조정에서의 입지가 흔들릴 수 있다.',
    choices: [
      { text: 'Stand with the claimant', textKo: '경쟁자 곁에 선다', consequence: 'The alliance becomes open and perilous.', consequenceKo: '동맹이 공개되고 위험해진다.', effect: { influence: 7, royalFavor: -8, reputation: -3, flag: 'claimant-oath' } },
      { text: 'Seek reconciliation', textKo: '화해를 중재한다', consequence: 'Your diplomatic skill eases the confrontation.', consequenceKo: '외교적 수완으로 대립이 누그러진다.', effect: { attribute: { key: 'diplomacy', amount: 3 }, reputation: 4, influence: 1 } },
      { text: 'Renounce the alliance', textKo: '동맹을 끊는다', consequence: 'The crown is reassured, but a former ally becomes bitter.', consequenceKo: '왕실은 안도하지만 옛 동맹은 적의를 품는다.', effect: { royalFavor: 5, relationship: { npcId: 'seojun', trust: -8 } } }
    ]
  }
)

export const familyNames = ['House Seo', 'House Han', 'House Min', 'House Yun', 'House Kang', 'House Baek']

// Original integration of the user-provided lotus-garden design scene.
// The characters and private conspiracy are fictional; the 1724 reign is historical.
export const premiumEvents: StoryEvent[] = [
 { id:'chronicle-1724',title:'The Crown, Newly Settled',titleKo:'새 왕의 등극',location:'Royal Palace',requiresScenario:'1724',
   story:'The new king has taken the throne, but old loyalties still haunt the corridors. At the first court reception, you are asked whether the household should seek favour or keep its distance. Across the courtyard, a messenger watches you.',
   storyKo:'새 임금이 즉위했으나 옛 충성은 궁궐 곳곳에 남았다. 첫 조회에서 가문이 왕의 총애를 구할지 거리를 둘지 묻는다. 마당 건너편에서 전령 하나가 당신을 지켜본다.',
   choices:[
    {text:'Offer public loyalty',textKo:'공개적으로 충성을 다짐한다',consequence:'The court remembers your show of loyalty.',consequenceKo:'조정은 당신의 충성을 기억한다.',effect:{royalFavor:5,reputation:2,flag:'yeongjo-loyal'}},
    {text:'Observe the factions quietly',textKo:'정파의 움직임을 지켜본다',consequence:'You gather insight without declaring a side.',consequenceKo:'편을 정하지 않은 채 정보를 얻는다.',effect:{influence:4,attribute:{key:'intelligence',amount:1},flag:'yeongjo-observer'}},
    {text:'Attend to the household first',textKo:'가문을 먼저 돌본다',consequence:'Your family appreciates your caution.',consequenceKo:'가문은 신중함에 안도한다.',effect:{wealth:3,reputation:1,flag:'yeongjo-cautious'}}
   ] },
  {id:'lotus-letter',title:'The Letter at the Lotus Pond',titleKo:'연못가의 비밀 서찰',location:'Palace Garden',requiresScenario:'1724',
    story:'At dusk, General Kang Muyeol waits beneath the pavilion. A courier has been seized with a letter bearing your family seal. Its accusation against the newly crowned king could destroy your household. Kang has risked everything to bring it to you.',
    storyKo:'해 질 무렵 강무열이 정자 아래 기다린다. 붙잡힌 전령의 서찰에는 당신 가문의 인장이 있다. 새 왕을 향한 위험한 고발이 담겼다. 강무열은 모든 것을 걸고 서찰을 가져왔다.',
    choices:[
      {text:'Burn the letter together',textKo:'함께 서찰을 태운다',consequence:'The evidence vanishes, and you share a dangerous secret.',consequenceKo:'증거는 사라지고 위험한 비밀을 나눈다.',effect:{relationship:{npcId:'muyeol',trust:12,affection:8},reputation:-2,flag:'lotus-burned'}},
      {text:'Present it to the State Tribunal',textKo:'의금부에 제출한다',consequence:'The court praises loyalty. Your family comes under inquiry.',consequenceKo:'충성은 인정받지만 가문이 조사를 받는다.',effect:{royalFavor:6,reputation:3,relationship:{npcId:'muyeol',trust:-4},flag:'lotus-tribunal'}},
      {text:'Keep the letter for leverage',textKo:'서찰을 숨겨 협상에 쓴다',consequence:'The letter becomes your weapon—and your liability.',consequenceKo:'서찰은 무기이자 약점이 된다.',effect:{influence:7,reputation:-5,relationship:{npcId:'muyeol',trust:-10},flag:'lotus-hidden'}}
    ]},
  {id:'lotus-ash',title:'Ashes on the Water',titleKo:'물 위에 흩어진 재',location:'Palace Garden',requiresScenario:'1724',
    story:'The letter is gone. But a court lady saw the lantern by the pond and has begun to ask questions. Kang offers to carry the burden of the secret alone.',
    storyKo:'서찰은 사라졌지만 궁녀 하나가 연못가의 등불을 보았다. 강무열은 홀로 비밀의 짐을 지겠다고 한다.',
    choices:[
      {text:'Stand beside Kang',textKo:'강무열 곁을 지킨다',consequence:'Your secret pact strengthens.',consequenceKo:'둘의 비밀스러운 맹약이 깊어진다.',effect:{relationship:{npcId:'muyeol',trust:8,affection:4},flag:'lotus-ash-trust'}},
      {text:'Prepare the household for scrutiny',textKo:'가문에 대비를 명한다',consequence:'Your family prepares, though rumours grow.',consequenceKo:'가문은 대비하지만 소문이 커진다.',effect:{wealth:-4,reputation:-3,influence:3,flag:'lotus-ash-prepare'}},
      {text:'Say nothing',textKo:'침묵을 택한다',consequence:'The trail cools as the court turns elsewhere.',consequenceKo:'조정의 시선은 다른 곳으로 옮겨 간다.',effect:{health:3,royalFavor:-2,flag:'lotus-ash-silence'}}
    ]},
  {id:'lotus-judgement',title:'Summoned to the Tribunal',titleKo:'의금부의 소환',location:'Royal Palace',requiresScenario:'1724',
    story:'The State Tribunal summons your household. The ministers want names, not merely declarations of loyalty. Every answer will be remembered.',
    storyKo:'의금부가 당신의 가문을 소환했다. 대신들은 충성의 맹세가 아니라 이름을 요구한다.',
    choices:[
      {text:'Testify openly',textKo:'공개적으로 증언한다',consequence:'Your courage wins attention, at a cost.',consequenceKo:'용기가 주목받지만 대가가 따른다.',effect:{royalFavor:5,reputation:3,wealth:-5,flag:'lotus-trial-testimony'}},
      {text:'Shield General Kang',textKo:'강무열을 보호한다',consequence:'Kang will remember your loyalty.',consequenceKo:'강무열이 당신의 의리를 기억한다.',effect:{royalFavor:-3,relationship:{npcId:'muyeol',trust:10,affection:5},flag:'lotus-trial-protect'}},
      {text:'Withdraw from the inquiry',textKo:'조사에서 물러난다',consequence:'The question remains unresolved.',consequenceKo:'의문은 끝내 풀리지 않는다.',effect:{influence:-4,health:4,flag:'lotus-trial-withdraw'}}
    ]},
  {id:'lotus-bargain',title:'The Price of Silence',titleKo:'침묵의 대가',location:'Royal Palace',requiresScenario:'1724',
    story:'A senior official has learned you kept the letter. He offers protection on one condition: at the next council, your voice must support his faction.',
    storyKo:'대신 하나가 당신이 서찰을 숨긴 것을 안다. 다음 회의에서 자신의 정파를 지지하는 조건으로 보호를 약속한다.',
    choices:[
      {text:'Refuse the threat',textKo:'협박을 거절한다',consequence:'You surrender easy power to keep your independence.',consequenceKo:'스스로의 뜻을 지키기 위해 권세를 포기한다.',effect:{reputation:5,influence:-3,flag:'lotus-bargain-refuse'}},
      {text:'Accept a temporary alliance',textKo:'한시적인 동맹을 맺는다',consequence:'You have protection—but owe a dangerous favour.',consequenceKo:'보호를 얻었지만 정치적 빚이 생긴다.',effect:{influence:5,reputation:-3,faction:{id:'tradition',amount:8},flag:'lotus-bargain-accept'}},
      {text:'Return the letter to Kang',textKo:'강무열에게 서찰을 돌린다',consequence:'Your friend receives the evidence and a chance to forgive.',consequenceKo:'친구가 증거를 받고 용서할 기회를 얻는다.',effect:{relationship:{npcId:'muyeol',trust:8,affection:3},royalFavor:1,flag:'lotus-bargain-return'}}
    ]}
]
export const extendedEvents: StoryEvent[] = [
  {id:'chronicle-custom', title:'A Name Beyond the Records',titleKo:'기록 밖의 이름', location:'Royal Palace',requiresScenario:'custom',
   story:'Your household arrives at the royal capital during an uncertain reign. At the first audience, the courtiers test whether your loyalty belongs to the throne, your family, or your own conscience.',
   storyKo:'불안한 왕조에 당신의 가문이 도성에 도착한다. 첫 조회에서 조정의 신하들은 왕권과 가문, 양심 중 무엇을 지킬지 시험한다.',
   choices:[
    {text:'Pledge your allegiance to the throne',textKo:'왕실에 충성을 맹세한다',consequence:'The monarch receives your pledge.',consequenceKo:'왕이 충성을 받아들인다.',effect:{royalFavor:5,reputation:2,flag:'custom-loyal'}},
    {text:'Promise to defend the household',textKo:'가문을 먼저 지키겠다고 약속한다',consequence:'Your family grows more confident.',consequenceKo:'가문이 든든함을 느낀다.',effect:{wealth:4,reputation:2,flag:'custom-house'}},
    {text:'Remain watchful and independent',textKo:'신중하게 독립을 지킨다',consequence:'You learn the currents of court.',consequenceKo:'조정의 흐름을 파악한다.',effect:{influence:4,attribute:{key:'intelligence',amount:1},flag:'custom-free'}}
   ]},
  {id:'missing-ledger',title:'The Missing Treasury Ledger',titleKo:'사라진 장부',location:'Audience Chamber',
   story:'A register has vanished from the court archives. An official asks your household to investigate before a faction assigns blame. A single ledger may bring down a minister.',
   storyKo:'조정 기록에서 장부가 사라졌다. 정파가 책임을 돌리기 전에 가문이 조사를 맡아 달라는 요청이 왔다. 장부 하나가 대신을 무너뜨릴 수 있다.',
   choices:[
     {text:'Follow the hidden accounts',textKo:'숨겨진 장부를 추적한다',consequence:'A hidden intermediary is revealed.',consequenceKo:'숨겨진 중개인의 흔적을 알아낸다.',effect:{attribute:{key:'intelligence',amount:2},influence:3,flag:'ledger-investigated',faction:{id:'reform',amount:5}}},
     {text:'Conceal the discrepancy',textKo:'차이를 감춘다',consequence:'A powerful patron owes you a favour.',consequenceKo:'유력한 후원자가 빚을 진다.',effect:{wealth:7,reputation:-5,flag:'ledger-concealed',faction:{id:'tradition',amount:6}}},
     {text:'Demand a public inquiry',textKo:'공개 조사를 청한다',consequence:'You put your reputation on the line.',consequenceKo:'명예를 걸고 절차를 요구한다.',effect:{reputation:4,royalFavor:-1,flag:'ledger-petitioned',faction:{id:'royalist',amount:3}}}
   ]},
  {id:'ledger-hearing',title:'The Minister on Trial',titleKo:'대신의 재판',location:'Audience Chamber',
   story:'The missing treasury ledger has brought a minister to trial. A trusted councillor offers evidence, while your former patron requests silence. The court waits for your testimony.',
   storyKo:'사라진 장부로 대신의 재판이 열렸다. 신뢰할 만한 관원이 증거를 건네고, 후원자는 침묵을 청한다. 조정은 당신의 증언을 기다린다.',
   choices:[
     {text:'Present the original records',textKo:'원본 기록을 제출한다',consequence:'Truth wins respect, but creates enemies.',consequenceKo:'진실은 존경을 얻고 적을 만든다.',effect:{reputation:7,royalFavor:3,flag:'trial-truth',faction:{id:'reform',amount:6}}},
     {text:'Protect the minister',textKo:'대신을 보호한다',consequence:'Power is exchanged for silence.',consequenceKo:'침묵의 대가로 권력이 오간다.',effect:{wealth:8,reputation:-7,flag:'trial-compromise',faction:{id:'tradition',amount:8}}},
     {text:'Appeal for a merciful verdict',textKo:'선처를 청한다',consequence:'The court remembers your restraint.',consequenceKo:'조정이 당신의 절제를 기억한다.',effect:{reputation:4,influence:2,flag:'trial-mercy',faction:{id:'royalist',amount:5}}}
   ]},
  {id:'winter-relief',title:'A Council Before the Snow',titleKo:'눈 내리기 전의 회의',location:'Royal Palace',
   story:'With winter approaching, the ministers debate relief for families in the capital. A single voice may decide who receives grain and who must go hungry.',
   storyKo:'겨울을 앞두고 대신들이 도성의 구휼을 논한다. 한 마디가 누가 양식을 얻고 누가 굶을지 결정할 수 있다.',
   choices:[
     {text:'Open the palace granaries',textKo:'궁중 창고를 연다',consequence:'People receive food; the royal stores are strained.',consequenceKo:'백성은 곡식을 얻지만 창고가 줄어든다.',effect:{wealth:-8,reputation:8,royalFavor:2,faction:{id:'reform',amount:6},flag:'relief-open'}},
     {text:'Preserve reserves for the court',textKo:'왕실의 곡식을 보존한다',consequence:'The old guard approves; the streets are restless.',consequenceKo:'대신은 환영하지만 민심은 불안하다.',effect:{wealth:5,reputation:-4,faction:{id:'tradition',amount:7},flag:'relief-closed'}},
     {text:'Fund relief from your estate',textKo:'가문의 재산으로 구휼한다',consequence:'Your household sets a quiet example.',consequenceKo:'가문이 조용한 모범을 보인다.',effect:{wealth:-5,reputation:6,faction:{id:'royalist',amount:3},flag:'relief-house'}},
   ]},
  {id:'letters-home',title:'Letters from the Inner Court',titleKo:'안채에서 온 편지',location:'Noble Residence',
   story:'A sibling sends word that the family is pressing for a marriage against their wishes. Your parents expect obedience; your sibling asks for a friend.',
   storyKo:'형제자매는 원하지 않는 혼인을 강요받고 있다는 편지를 보낸다. 부모는 순종을 바라고 형제자매는 벗을 찾는다.',
   choices:[
     {text:'Defend your sibling’s choice',textKo:'형제자매의 선택을 지킨다',consequence:'Your bond grows closer; elders may disapprove.',consequenceKo:'가족 사이의 유대가 깊어지지만 어른들은 불편해한다.',effect:{reputation:-2,health:4,flag:'sibling-defended'}},
     {text:'Support the family arrangement',textKo:'가문의 혼담을 지지한다',consequence:'Your elders praise you; a wound remains.',consequenceKo:'어른들은 칭찬하지만 마음의 상처가 남는다.',effect:{reputation:4,influence:2,flag:'parents-supported'}},
     {text:'Negotiate more time',textKo:'혼인을 미루도록 조정한다',consequence:'Compromise buys hope for all involved.',consequenceKo:'타협으로 모두에게 희망의 시간을 준다.',effect:{attribute:{key:'diplomacy',amount:3},reputation:2,flag:'wedding-delayed'}}
   ]},
  {id:'physicians-warning',title:'A Physician’s Quiet Warning',titleKo:'의원의 조용한 경고',location:'Noble Residence',
   story:'A physician says the demands of court are damaging your health. You can rest, seek costly treatment, or ignore the warning for political duty.',
   storyKo:'의원이 궁중 생활이 건강을 해친다고 경고한다. 휴식과 비용이 드는 치료, 정치적 의무 가운데 하나를 택해야 한다.',
   choices:[
     {text:'Pay for careful treatment',textKo:'돈을 들여 치료한다',consequence:'Recovery costs the household dearly.',consequenceKo:'치료에 가문의 재산이 쓰인다.',effect:{health:14,wealth:-7,flag:'physician-treatment'}},
     {text:'Retreat to the countryside',textKo:'시골로 물러나 쉰다',consequence:'You regain strength as your influence fades.',consequenceKo:'기력을 되찾지만 영향력이 줄어든다.',effect:{health:10,influence:-6,flag:'physician-rest'}},
     {text:'Continue serving the court',textKo:'궁중의 일을 계속한다',consequence:'Your career advances; your body weakens.',consequenceKo:'관직은 나아가지만 건강이 약해진다.',effect:{health:-7,royalFavor:6,flag:'physician-duty'}}
   ]},
  {id:'envoy-gates',title:'The Envoy at the Gate',titleKo:'도성 문 앞의 사신',location:'Traditional Market',
   story:'An envoy requests royal audience through your household. Sponsoring the meeting could open diplomatic doors—or raise questions about your loyalty.',
   storyKo:'사신이 가문을 통해 알현을 청한다. 자리를 마련하면 외교의 문이 열리지만 충성에 대한 의심이 따를 수 있다.',
   choices:[
     {text:'Arrange a formal reception',textKo:'공식 접견을 준비한다',consequence:'The court values your diplomacy.',consequenceKo:'조정은 외교 능력을 높이 평가한다.',effect:{attribute:{key:'diplomacy',amount:3},royalFavor:3,influence:2,flag:'envoy-welcomed'}},
     {text:'Demand careful scrutiny',textKo:'엄격한 조사를 요구한다',consequence:'Security and caution win praise.',consequenceKo:'신중한 경계가 칭찬받는다.',effect:{reputation:3,attribute:{key:'courage',amount:2},faction:{id:'tradition',amount:4},flag:'envoy-screened'}},
     {text:'Listen before presenting the envoy',textKo:'먼저 비밀 이야기를 듣는다',consequence:'You gain knowledge at a reputational risk.',consequenceKo:'정보를 얻지만 평판이 위험해진다.',effect:{influence:5,reputation:-2,flag:'envoy-spoken'}}
   ]},
  {id:'three-seals',title:'The Three Seals',titleKo:'세 개의 인장',location:'Royal Palace',
   story:'Representatives of the three great court circles request a private meeting. Whoever secures your voice may change the balance of power for years.',
   storyKo:'조정의 세 정파가 비밀 회동을 청한다. 당신의 목소리를 얻는 자가 여러 해 동안 권력의 균형을 바꿀 것이다.',
   choices:[
     {text:'Support the reform circle',textKo:'개혁파를 지지한다',consequence:'The reformist council rallies to your house.',consequenceKo:'개혁파가 가문에 힘을 보탠다.',effect:{influence:5,royalFavor:2,faction:{id:'reform',amount:12},flag:'three-seals-reform'}},
     {text:'Stand with the old guard',textKo:'수구파를 지지한다',consequence:'Old families extend their protection.',consequenceKo:'옛 가문들이 보호를 제안한다.',effect:{wealth:5,influence:3,faction:{id:'tradition',amount:12},flag:'three-seals-tradition'}},
     {text:'Place the royal house first',textKo:'왕실을 먼저 생각한다',consequence:'The royal household hears of your allegiance.',consequenceKo:'왕실은 당신의 충성을 기억한다.',effect:{reputation:5,royalFavor:3,faction:{id:'royalist',amount:12},flag:'three-seals-royalist'}}
   ]},
  {id:'house-charter',title:'The Charter of Your House',titleKo:'가문의 유훈',location:'Noble Residence',
   story:'After a year of ambition and compromise, your family asks what principle should guide the next generation. The words will be copied into the household chronicle.',
   storyKo:'야망과 타협의 한 해가 지나고 가족은 다음 세대를 이끌 유훈을 묻는다. 그 말이 가문의 연대기에 쓰일 것이다.',
   choices:[
     {text:'Write a charter of justice',textKo:'정의의 유훈을 남긴다',consequence:'Honour becomes your household’s ideal.',consequenceKo:'명예가 가문의 이상이 된다.',effect:{reputation:6,flag:'charter-justice'}},
     {text:'Leave a network of allies',textKo:'동맹을 물려준다',consequence:'Your influence may outlive you.',consequenceKo:'영향력이 세대를 넘어 남는다.',effect:{influence:7,flag:'charter-power'}},
     {text:'Endow the household estate',textKo:'가산을 물려준다',consequence:'Your descendants gain security.',consequenceKo:'후손의 삶이 넉넉해진다.',effect:{wealth:7,flag:'charter-wealth'}}
   ]}
]
storyEvents.push(...premiumEvents, ...extendedEvents)
