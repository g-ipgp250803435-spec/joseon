import type { StoryEvent } from './types'
/** Original narrative encounters for Parts I–III. Eligibility lives in rules.ts. */
export const societyEvents: StoryEvent[] = [
  {
    id: 'disputed-inheritance', title: 'The Branch That Was Forgotten', titleKo: '잊힌 가문의 분파', location: 'Noble Residence',
    story: 'A distant cousin presents a brittle deed and claims a share of the ancestral estate. The elders demand that you protect the household, but your response will shape the family for decades.',
    storyKo: '먼 친척이 낡은 문서를 내밀며 선산의 권리를 주장한다. 어른들은 가문을 지키라 하지만 선택의 여파는 오래 남는다.',
    choices: [
      { text: 'Permit a fair hearing before the elders', textKo: '어른들 앞에서 공정한 심리를 연다', consequence: 'Your household sacrifices certainty for fairness, and an old resentment begins to ease.', consequenceKo: '공정함을 택하자 오랜 원한이 풀리기 시작한다.', effect: { honour: 7, housePrestige: 3, familyTreasury: -8, reputation: 3, flag: 'inheritance-mediated' } },
      { text: 'Defend the ancestral deed without compromise', textKo: '양보 없이 가문의 문서를 지킨다', consequence: 'You preserve the assets but harden the divide within the family.', consequenceKo: '재산은 지키지만 분파 간 균열은 깊어진다.', effect: { honour: -4, housePrestige: -3, influence: 3, flag: 'inheritance-defended' } },
      { text: 'Offer the cousin a place in the household', textKo: '그 친척에게 가문 안의 자리를 내준다', consequence: 'A fragile kinship is restored at tangible expense.', consequenceKo: '실제 비용을 치르고 가족의 인연을 되찾는다.', effect: { familyTreasury: -12, honour: 6, housePrestige: 5, flag: 'inheritance-reconciled' } }
    ]
  },
  {
    id: 'merchant-reckoning', title: 'The Price of Silk', titleKo: '비단의 값', location: 'Traditional Market',
    story: 'Your textile partners ask for fresh funds after a poor season. Records reveal honest losses and an opportunity to profit from hunger elsewhere.',
    storyKo: '지난 계절의 손실을 만회하려는 상인들이 자금을 요청한다. 기록 속에는 타인의 곤궁을 이용할 기회까지 적혀 있다.',
    choices: [
      { text: 'Fund the workers and accept thinner profits', textKo: '일꾼을 돕고 이익을 줄인다', consequence: 'The workers remember your generosity; the treasury does not recover so quickly.', consequenceKo: '일꾼들은 고마움을 기억하지만 금고는 쉽게 채워지지 않는다.', effect: { familyTreasury: -9, honour: 8, housePrestige: 3, flag: 'market-mercy' } },
      { text: 'Demand a strict audit of the partnership', textKo: '상단의 장부를 철저히 조사한다', consequence: 'You protect the house from opportunists while angering some merchants.', consequenceKo: '상단을 감시해 가문을 보호하지만 상인들의 불만이 커진다.', effect: { familyTreasury: 6, reputation: 2, influence: -2, flag: 'market-audit' } },
      { text: 'Take advantage of the shortage', textKo: '물자 부족을 이용해 이익을 얻는다', consequence: 'The coffers fill while whispers of profiteering spread.', consequenceKo: '금고는 차오르지만 사익을 탐했다는 소문이 번진다.', effect: { familyTreasury: 15, honour: -12, housePrestige: -5, reputation: -5, flag: 'market-profiteering' } }
    ]
  },
  {
    id: 'royal-seal-of-office', title: 'A Seal Without a Throne', titleKo: '왕좌 없는 관인의 무게', location: 'Royal Court',
    story: 'An official asks you to issue a ruling in the king’s name. The court waits. Your influence may be considerable, but formal authority remains bound to the law and your office.',
    storyKo: '한 관리가 국왕의 이름으로 재결을 내리라 요청한다. 영향력이 높아도 정식 권한은 관직과 법도에서 비롯된다.',
    choices: [
      { text: 'Refer the decision to the royal secretariat', textKo: '승정원에 재결을 맡긴다', consequence: 'The lawful procedure is respected; your measured judgement earns trust.', consequenceKo: '정당한 절차를 지키자 신임을 얻는다.', effect: { honour: 8, legitimacy: 4, royalFavor: 4, flag: 'authority-respected' } },
      { text: 'Advise the council without claiming the king’s seal', textKo: '왕의 인장을 쓰지 않고 의견을 낸다', consequence: 'You persuade others but remain within the limits of your office.', consequenceKo: '관직의 한계를 지키며 사람들을 설득한다.', effect: { influence: 5, housePrestige: 3, flag: 'authority-counsel' } },
      { text: 'Pretend that your influence grants sovereign power', textKo: '영향력을 내세워 왕권을 사칭한다', consequence: 'The abuse draws a dangerous inquiry into your ambitions.', consequenceKo: '권한 남용으로 위험한 조사가 시작된다.', effect: { honour: -10, legitimacy: -8, royalFavor: -12, reputation: -8, flag: 'usurped-authority' } }
    ]
  }
]
