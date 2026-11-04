import type { StoryEvent } from './types'
/** Scripted, consequential paths from nobility to formal loss of privilege. */
export const lifeEvents: StoryEvent[] = [
  {
    id: 'trial-of-the-house', title: 'A Royal Decree at Dawn', titleKo: '새벽에 내린 왕명', location: 'Royal Court',
    story: 'Sealed accusations against your household reach the throne. A royal examiner offers one final hearing. Your answer may preserve your privileges—or end them. A new life would begin beneath a very different name.',
    storyKo: '가문을 향한 고발이 왕에게 전해졌다. 마지막 변론의 기회가 주어진다. 답변에 따라 신분과 특권을 잃을 수도 있다.',
    choices: [
      { text: 'Expose the forged testimony publicly', textKo: '위조된 증언을 공개한다', consequence: 'The hearing grows volatile. Your courage earns respect, but powerful enemies remain.', consequenceKo: '심문이 격렬해진다. 용기는 존경을 받지만 적들은 남아 있다.', effect: { reputation: 7, influence: -8, royalFavor: -3, flag: 'defied-court' } },
      { text: 'Accept the decree to protect your family', textKo: '가문을 지키기 위해 처분을 받아들인다', consequence: 'The seals are broken. You lose your noble or royal status. Your story continues among the common people.', consequenceKo: '봉인을 열어 신분을 박탈당한다. 이야기는 평민의 삶에서 계속된다.', effect: { revokeStanding: 'Royal conviction following a household inquiry', flag: 'house-condemned' } },
      { text: 'Seek a private compromise with the examiner', textKo: '심문관과 비밀리에 타협한다', consequence: 'The investigation is delayed; your influence and moral standing suffer.', consequenceKo: '조사는 연기되지만 명예와 권세가 흔들린다.', effect: { wealth: -14, reputation: -6, royalFavor: 3, flag: 'private-compromise' } }
    ]
  },
  {
    id: 'a-life-in-exile', title: 'The House Beyond the Gates', titleKo: '도성 밖의 작은 집', location: 'Traditional Market',
    story: 'No official bows when you pass. A merchant who once served your family offers employment, but an old ally insists that the conviction can be challenged. Your next decision will determine whether you survive quietly or pursue justice.',
    storyKo: '더는 누구도 당신에게 허리를 굽히지 않는다. 한 상인이 일자리를 제안하고 옛 지인은 복권을 권한다.',
    choices: [
      { text: 'Earn a modest living with dignity', textKo: '정직한 노동으로 생활한다', consequence: 'Your household finds stability without privilege.', consequenceKo: '특권 없이도 가족에게 안정을 가져온다.', effect: { wealth: 5, culture: { key: 'virtue', amount: 5 }, flag: 'humble-life' } },
      { text: 'Preserve evidence of the false charge', textKo: '억울한 누명을 밝힐 증거를 모은다', consequence: 'You make a promise: this family’s story is not over.', consequenceKo: '가문의 이야기는 아직 끝나지 않았음을 맹세한다.', effect: { influence: 3, culture: { key: 'scholarship', amount: 3 }, flag: 'restoration-vow' } },
      { text: 'Seek reconciliation with the accusers', textKo: '고발자들과 화해를 모색한다', consequence: 'A path to peace opens, though some consider it surrender.', consequenceKo: '평화의 길이 열리지만 어떤 이는 굴복이라 여긴다.', effect: { reputation: 4, relationship: { npcId: 'seojun', trust: 5 }, flag: 'reconciled-after-downfall' } }
    ]
  }
]
