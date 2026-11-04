import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { setAmbience } from './game/ambience'
import { Castle, Crown, HeartHandshake, House, ScrollText, Settings2, Shield, Trophy, UserRound, UsersRound, Volume2, VolumeX, Save as SaveIcon } from 'lucide-react'
import { alternativeScenario, historicalScenarios, locations, npcs } from './game/data'
import { autosave, useGameStore } from './game/store'
import { artFor } from './game/art'
import { canPlanChild, canPropose } from './game/rules'
import { readSave, slotKey } from './game/storage'
import { achieved, chapter, chapterTitles, characterArt, factions, milestones, playerArt } from './game/premium'
import type { FactionId } from './game/types'
import type { CampaignMode, Gender, PlayerCharacter } from './game/types'

const portraits = ['月', '花', '雲', '竹', '星', '蘭']

const words: Record<'en' | 'ko', Record<string, string>> = {
  en: {
    continue: 'Continue campaign', new: 'Begin a new life', saves: 'Load a saved campaign', settings: 'Settings',
    historical: 'Historical Joseon', alternative: 'Alternative Joseon', start: 'Enter Joseon', back: 'Back',
    overview: 'Overview', character: 'Character', relationships: 'Relationships', family: 'Family & dynasty', court: 'Court & activities', journal: 'Chronicle', save: 'Save / load',
    day: 'Advance day', actions: 'Today’s activities', locations: 'Places in Joseon', cast: 'People of the court',
    talk: 'Talk', flirt: 'Express affection', politics: 'Discuss court affairs', gift: 'Give a gift', propose: 'Propose marriage',
    close: 'Close', choose: 'Choose your response', reputation: 'Reputation', influence: 'Influence', wealth: 'Wealth', health: 'Health', favour: 'Royal favour',
    age: 'Age', status: 'Standing', familyName: 'Family house', personality: 'Disposition', attributes: 'Attributes',
    study: 'Study & refinement', audience: 'Seek a royal audience', banquet: 'Attend a banquet', household: 'Household affairs', training: 'Military discipline', garden: 'Quiet garden walk', rumours: 'Listen for rumours',
    saveNow: 'Save this campaign', saved: 'Campaign saved.', load: 'Load', empty: 'Empty slot', exit: 'Return to title', conclude: 'Conclude this life',
    noSpouse: 'No spouse', children: 'Children', noChildren: 'No children yet',
    intro: 'Your birth determines your beginning. Your decisions determine your legacy.',
    createTitle: 'Create your character', createDesc: 'Choose your place in Joseon. Your family name opens some doors and closes others.',
    name: 'Character name', gender: 'Gender', ageStart: 'Starting age', house: 'Family name', background: 'Family background', temperament: 'Personality', portrait: 'Portrait emblem',
    aristocrat: 'Established aristocratic family', political: 'Powerful political family', military: 'Military aristocratic family', royal: 'Royal bloodline / collateral branch',
    composed: 'Composed', ambitious: 'Ambitious', compassionate: 'Compassionate', calculating: 'Calculating', idealistic: 'Idealistic',
    selectScenario: 'Select a starting period', chooseMode: 'Choose your campaign',
    historicalNote: 'Historical monarchs and major events provide the setting. Your character and supporting cast are fictional.',
    alternativeNote: 'A fictional Joseon reign. Rulers, factions and historical outcomes may develop differently.',
    year: 'Year', month: 'Month', journalTitle: 'Your chronicle',
    gameOver: 'The chapter closes', continueDesc: 'Your choices have become part of Joseon’s story.',
    interact: 'Interactions', relationship: 'Relationship', romance: 'Romance', trust: 'Trust', affection: 'Affection', respect: 'Respect',
    noSave: 'No campaign found in this slot.', slot: 'Save slot', factions:'Factions & influence', legacy:'Legacy',
  },
  ko: {
    continue: '이어서 플레이', new: '새로운 삶 시작', saves: '저장된 캠페인 불러오기', settings: '설정',
    historical: '역사적 조선', alternative: '대체 조선', start: '조선으로 입장', back: '뒤로',
    overview: '개요', character: '인물', relationships: '인간관계', family: '가문과 후손', court: '궁중과 활동', journal: '연대기', save: '저장 / 불러오기',
    day: '하루 보내기', actions: '오늘의 활동', locations: '조선의 장소', cast: '궁중 인물',
    talk: '대화', flirt: '애정 표현', politics: '궁중 논의', gift: '선물하기', propose: '혼인 청혼',
    close: '닫기', choose: '응답 선택', reputation: '평판', influence: '영향력', wealth: '재산', health: '건강', favour: '왕의 총애',
    age: '나이', status: '신분', familyName: '가문', personality: '성격', attributes: '능력치',
    study: '학문과 교양', audience: '왕 알현', banquet: '연회 참석', household: '가문 살피기', training: '무예 수련', garden: '정원 산책', rumours: '소문 듣기',
    saveNow: '캠페인 저장', saved: '캠페인을 저장했습니다.', load: '불러오기', empty: '빈 슬롯', exit: '메인 화면으로', conclude: '삶을 마무리하기',
    noSpouse: '배우자 없음', children: '자녀', noChildren: '아직 자녀가 없습니다',
    intro: '태어남이 시작을 정하고, 선택이 유산을 결정한다.',
    createTitle: '인물 만들기', createDesc: '조선에서 당신의 위치를 선택하십시오. 가문은 기회를 열기도 하고 닫기도 합니다.',
    name: '인물 이름', gender: '성별', ageStart: '시작 나이', house: '가문 이름', background: '가문 배경', temperament: '성격', portrait: '초상 문양',
    aristocrat: '유서 깊은 양반 가문', political: '권세 있는 문신 가문', military: '무관 가문', royal: '왕족 / 종친 가문',
    composed: '침착함', ambitious: '야망', compassionate: '자비로움', calculating: '계산적', idealistic: '이상주의',
    selectScenario: '시작 시대 선택', chooseMode: '캠페인 선택',
    historicalNote: '역사적 군주와 주요 사건을 배경으로 합니다. 플레이어와 주요 조연은 가상 인물입니다.',
    alternativeNote: '가상의 조선 왕조입니다. 군주와 정파, 역사적 결과가 다르게 전개될 수 있습니다.',
    year: '연도', month: '월', journalTitle: '당신의 연대기',
    gameOver: '이야기의 한 장이 끝났습니다', continueDesc: '당신의 선택은 조선의 이야기에 남았습니다.',
    interact: '상호작용', relationship: '관계', romance: '연애', trust: '신뢰', affection: '호감', respect: '존경',
    noSave: '이 슬롯에는 저장된 캠페인이 없습니다.', slot: '저장 슬롯', factions:'정파와 정치', legacy:'유산' 
  }
}

type Tab = 'overview' | 'character' | 'relationships' | 'family' | 'factions' | 'legacy' | 'court' | 'journal' | 'save' | 'settings'

function App() {
  const game = useGameStore((s) => s.game)
  const startGame = useGameStore((s) => s.startGame)
  const resumeAutosave = useGameStore((s) => s.resumeAutosave)
  const hasAutosave = useGameStore((s) => s.hasAutosave)
  const setLanguage = useGameStore((s) => s.setLanguage)
  const [screen, setScreen] = useState<'title' | 'mode' | 'create' | 'load' | 'settings'>('title')
  const [mode, setMode] = useState<CampaignMode>('historical')
  const [scenarioId, setScenarioId] = useState('1776')
  const [customYear, setCustomYear] = useState(1650)
  const [language, setLanguageLocal] = useState<'en' | 'ko'>('en')
  const [tab, setTab] = useState<Tab>('overview')
  const [selectedNpc, setSelectedNpc] = useState<string | null>(null)
  const [notice, setNotice] = useState('')
  const [ambientOn, setAmbientOn] = useState(false)
  const toggleAmbience = async () => setAmbientOn(await setAmbience(!ambientOn))
  const [form, setForm] = useState({ name: 'Yi Seoyeon', gender: 'Female' as Gender, age: 20, family: 'House Seo', background: 'Established aristocratic family', personality: 'Composed', portrait: portraits[0] })
  const t = (key: keyof typeof words.en) => words[language][key] ?? words.en[key]
  const activeLanguage = game?.language ?? language
  const local = (en: string, ko: string) => activeLanguage === 'ko' ? ko : en
  const gt = (key: keyof typeof words.en) => words[activeLanguage][key] ?? words.en[key]
  const relationship = useGameStore((s) => s.interact)
  const chooseEvent = useGameStore((s) => s.chooseEvent)
  const performActivity = useGameStore((s) => s.performActivity)
  const consultFaction = useGameStore((s) => s.consultFaction)
  const advanceDay = useGameStore((s) => s.advanceDay)
  const advanceMonth = useGameStore((s) => s.advanceMonth)
  const advanceYear = useGameStore((s) => s.advanceYear)
  const importCampaign = useGameStore((s) => s.importCampaign)
  const setLocation = useGameStore((s) => s.setLocation)
  const saveSlot = useGameStore((s) => s.saveSlot)
  const loadSlot = useGameStore((s) => s.loadSlot)
  const conclude = useGameStore((s) => s.conclude)
  const continueAsDescendant = useGameStore((s) => s.continueAsDescendant)
  const clearCampaign = useGameStore((s) => s.clearCampaign)

  useEffect(() => { autosave(game) }, [game])
  useEffect(() => {
    if (!selectedNpc) return
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setSelectedNpc(null) }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [selectedNpc])
  useEffect(() => { if (notice) { const timer = window.setTimeout(() => setNotice(''), 2200); return () => window.clearTimeout(timer) } }, [notice])

  const scenario = game ? null : (mode === 'alternative' ? alternativeScenario : historicalScenarios.find((s) => s.id === scenarioId) ?? historicalScenarios[4])
  const currentLocation = game ? locations.find((l) => l.id === game.currentLocation) ?? locations[1] : locations[1]
  const currentNpc = game && selectedNpc ? npcs.find((n) => n.id === selectedNpc) : null
  const currentRelation = game && selectedNpc ? game.relationships.find((r) => r.npcId === selectedNpc) : null

  const start = () => {
    const player: PlayerCharacter = {
      name: form.name.trim() || 'Yi Seoyeon', gender: form.gender, age: Number(form.age), family: form.family.trim() || 'House Seo',
      background: form.background, personality: form.personality,
      attributes: {
        intelligence: form.personality === 'Idealistic' ? 62 : 50,
        charisma: form.personality === 'Composed' ? 58 : 50,
        influence: 45,
        diplomacy: form.personality === 'Calculating' ? 60 : 48,
        courage: form.personality === 'Ambitious' ? 60 : 48
      },
      portrait: form.portrait
    }
    startGame({ mode, scenarioId: mode === 'historical' && scenarioId === 'custom' ? `custom-${customYear}` : scenarioId, player })
    setScreen('title')
    setTab('overview')
    setLanguageLocal(language)
    setLanguage(language)
  }

  const importFromTitle = async (file: File | undefined) => {
    if (!file) return
    if (file.size > 2_000_000) { setNotice(local('Save file is too large.','저장 파일이 너무 큽니다.')); return }
    try {
      const data: unknown = JSON.parse(await file.text())
      if (importCampaign(data)) { setScreen('title'); setTab('overview'); setSelectedNpc(null); setNotice(local('Campaign restored from backup.', '백업 파일에서 캠페인을 불러왔습니다.')) }
      else setNotice(local('Invalid or unsupported backup.', '유효하지 않은 저장 파일입니다.'))
    } catch { setNotice(local('Could not read the file.', '파일을 읽을 수 없습니다.')) }
  }

  const loadFromTitle = (slot: number) => {
    if (loadSlot(slot)) { setTab('overview'); setScreen('title'); setSelectedNpc(null) }
    else setNotice(words[language].noSave)
  }

  if (!game) {
    return (
      <div className="title-shell">
        <div className="title-language"><button className={language === 'en' ? 'lang active' : 'lang'} onClick={() => setLanguageLocal('en')}>EN</button><button className={language === 'ko' ? 'lang active' : 'lang'} onClick={() => setLanguageLocal('ko')}>한국어</button></div>
        {screen === 'title' && <main className="title-card">
          <div className="title-art"><div className="moon"/><div className="roof roof-back"/><div className="roof roof-front"/><div className="title-art-caption">朝鮮 · THE ROYAL CHRONICLES</div></div>
          <div className="title-copy">
            <div className="eyebrow">A HISTORICAL LIFE SIMULATION</div>
            <h1>JOSEON</h1><h2>THE CROWN <span>&</span> THE LEGACY</h2><div className="title-hanja">王冠과 遺産</div>
            <p>{t('intro')}</p>
            <div className="title-actions">
              <button className="btn btn-primary btn-wide" onClick={() => { setMode('historical'); setScreen('mode') }}>{t('new')} <span>→</span></button>
              {hasAutosave() && <button className="btn btn-outline btn-wide" onClick={() => { if (resumeAutosave()) { setTab('overview'); setNotice('Campaign resumed.') } }}>{t('continue')}</button>}
              <button className="btn btn-quiet" onClick={() => setScreen('load')}>{t('saves')}</button>
              <button className="btn btn-quiet" onClick={() => setScreen('settings')}>{t('settings')}</button>
            </div>
            <div className="title-foot">SINGLE PLAYER · YOUR COURT · YOUR DYNASTY · VERSION 3.0</div>
          </div>
        </main>}
        {screen === 'settings' && <main className="setup-card">
          <button className="back-link" onClick={() => setScreen('title')}>← {t('back')}</button>
          <div className="eyebrow">PREFERENCES</div><h2>{t('settings')}</h2>
          <p className="setup-description">{language === 'ko' ? '인터페이스 언어를 선택하세요. 설정은 이 브라우저에만 적용됩니다.' : 'Choose your interface language. Your campaign stores its language preference locally.'}</p>
          <div className="save-tools"><button className="btn btn-outline" onClick={() => setLanguageLocal('en')}>English</button><button className="btn btn-outline" onClick={() => setLanguageLocal('ko')}>한국어</button></div>
          <p className="setup-description">{language === 'ko' ? '로그인이 필요하지 않으며 모든 그림이 게임에 포함됩니다.' : 'No account is required. All illustrations are bundled with the production build.'}</p><div className="settings-control"><div><b>{language === 'ko' ? '궁중의 분위기 소리' : 'Atmospheric palace ambience'}</b><small>{language === 'ko' ? '직접 켤 때만 재생됩니다.' : 'Original synthesized atmosphere. Off by default.'}</small></div><button className="btn btn-outline" aria-pressed={ambientOn} onClick={()=>{void toggleAmbience()}}>{ambientOn ? '♪ On' : '♫ Off'}</button></div>
        </main>}
        {screen === 'load' && <main className="setup-card">
          <button className="back-link" onClick={() => setScreen('title')}>← {t('back')}</button>
          <div className="eyebrow">LOCAL CAMPAIGNS</div><h2>{t('saves')}</h2>
          <p className="setup-description">{language === 'ko' ? '저장된 캠페인은 이 브라우저에 보관됩니다.' : 'Manual campaigns are stored in this browser.'}</p>
          <div className="save-grid">{[1, 2, 3].map((slot) => {
            const stored = readSave(slotKey(slot)!)
            return <div className="save-card" key={slot}><div className="save-slot-number">0{slot}</div>
              <div className="save-meta"><span>{t('slot')} {slot}</span><b>{stored?.player.name ?? t('empty')}</b>
              <small>{stored ? `${stored.date.year}.${stored.date.month}.${stored.date.day} · ${stored.campaignLabel}` : '—'}</small></div>
              <button className="btn btn-primary btn-small" disabled={!stored} onClick={() => loadFromTitle(slot)}>{t('load')}</button>
            </div>
          })}</div><div className="title-import"><span className="eyebrow">{language === 'ko' ? '백업 가져오기' : 'IMPORT A CAMPAIGN'}</span><p>{language === 'ko' ? '이전 버전의 JSON 저장 파일도 일부 지원합니다.' : 'Bring a campaign backup from this or the previous standalone edition.'}</p><input type="file" accept=".json,application/json" aria-label="Import campaign backup" onChange={e=>{void importFromTitle(e.currentTarget.files?.[0]);e.currentTarget.value=''}} /></div>
        </main>}
        {screen === 'mode' && <main className="setup-card">
          <button className="back-link" onClick={() => setScreen('title')}>← {t('back')}</button>
          <div className="eyebrow">STEP 01 / CAMPAIGN</div><h2>{t('chooseMode')}</h2>
          <div className="mode-grid">
            <button className={mode === 'historical' ? 'mode-card selected' : 'mode-card'} onClick={() => setMode('historical')}><div className="mode-icon">王</div><h3>{t('historical')}</h3><p>{t('historicalNote')}</p><span>SELECT CAMPAIGN →</span></button>
            <button className={mode === 'alternative' ? 'mode-card selected' : 'mode-card'} onClick={() => setMode('alternative')}><div className="mode-icon">夢</div><h3>{t('alternative')}</h3><p>{t('alternativeNote')}</p><span>SELECT CAMPAIGN →</span></button>
          </div>
          {mode === 'historical' && <div className="scenario-select"><label>{t('selectScenario')}</label><div className="scenario-grid">{historicalScenarios.map((s) => <button key={s.id} className={scenarioId === s.id ? 'scenario selected' : 'scenario'} onClick={() => setScenarioId(s.id)}><b>{s.year}</b><span>{s.monarch}</span><small>{s.description}</small></button>)}</div><div className="custom-year"><button className={scenarioId==='custom'?'custom-year-select selected':'custom-year-select'} onClick={()=>setScenarioId('custom')}><span className="eyebrow">{language === 'ko' ? '나만의 연대기' : 'YOUR OWN ERA'}</span><b>{language === 'ko' ? '직접 시작 연도를 정하기' : 'Choose any starting year'}</b></button><label><span>{language === 'ko' ? '시작 연도 (1392–1909)' : 'STARTING YEAR · 1392–1909'}</span><input type="number" min="1392" max="1909" value={customYear} onChange={e=>setCustomYear(Math.max(1392,Math.min(1909,Number(e.target.value)||1392)))} onFocus={()=>setScenarioId('custom')} /></label></div></div>}
          {mode === 'alternative' && <div className="alternative-note"><b>{alternativeScenario.label}</b><p>{alternativeScenario.description}</p></div>}
          <button className="btn btn-primary btn-wide setup-next" onClick={() => setScreen('create')}>{t('back') === '뒤로' ? '다음 단계 →' : 'Continue to character creation →'}</button>
        </main>}
        {screen === 'create' && <main className="setup-card create-card">
          <button className="back-link" onClick={() => setScreen('mode')}>← {t('back')}</button>
          <div className="eyebrow">STEP 02 / IDENTITY</div><h2>{t('createTitle')}</h2><p className="setup-description">{t('createDesc')}</p>
          <div className="create-layout">
            <div className="portrait-preview"><div className="portrait-frame"><img src={playerArt(form.gender, form.portrait)} alt="Illustrated character preview" /></div><small>{form.family}</small><b>{form.name || 'Your character'}</b><div className="portrait-tag">NOBLE HOUSEHOLD</div></div>
            <div className="form-grid">
              <label className="field full"><span>{t('name')}</span><input value={form.name} maxLength={24} onChange={(e) => setForm({ ...form, name: e.target.value })}/></label>
              <label className="field"><span>{t('gender')}</span><select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value as Gender })}><option>Female</option><option>Male</option></select></label>
              <label className="field"><span>{t('ageStart')}</span><input type="number" min="16" max="45" value={form.age} onChange={(e) => setForm({ ...form, age: Math.max(16, Math.min(45, Number(e.target.value))) })}/></label>
              <label className="field full"><span>{t('house')}</span><input value={form.family} maxLength={28} onChange={(e) => setForm({ ...form, family: e.target.value })}/></label>
              <label className="field full"><span>{t('background')}</span><select value={form.background} onChange={(e) => setForm({ ...form, background: e.target.value })}><option>Established aristocratic family</option><option>Powerful political family</option><option>Military aristocratic family</option><option>Royal bloodline / collateral branch</option></select></label>
              <label className="field full"><span>{t('temperament')}</span><select value={form.personality} onChange={(e) => setForm({ ...form, personality: e.target.value })}><option>Composed</option><option>Ambitious</option><option>Compassionate</option><option>Calculating</option><option>Idealistic</option></select></label>
              <div className="field full"><span>{t('portrait')}</span><div className="portrait-options">{portraits.map((p) => <button key={p} className={form.portrait === p ? 'portrait-option selected' : 'portrait-option'} onClick={() => setForm({ ...form, portrait: p })}>{p}</button>)}</div></div>
            </div>
          </div>
          <button className="btn btn-primary btn-wide setup-next" onClick={start}>{t('start')} →</button>
        </main>}
        {notice && <div className="toast" role="status">{notice}</div>}
        <div className="bottom-credit">AN INTERACTIVE JOSEON STORY · FICTIONAL PLAYER CHARACTERS</div>
      </div>
    )
  }

  const statItems = [
    { label: gt('reputation'), value: game.stats.reputation, icon: '名', tone: 'red' },
    { label: gt('influence'), value: game.stats.influence, icon: <Shield size={18} strokeWidth={1.5} />, tone: 'gold' },
    { label: gt('wealth'), value: game.stats.wealth, icon: '財', tone: 'green' },
    { label: gt('health'), value: game.stats.health, icon: '氣', tone: 'blue' },
    { label: gt('favour'), value: game.stats.royalFavor, icon: '恩', tone: 'rose' }
  ]
  const nav: { id: Tab; label: string; icon: ReactNode }[] = [
    { id: 'overview', label: gt('overview'), icon: <House size={18} strokeWidth={1.5} /> }, { id: 'character', label: gt('character'), icon: <UserRound size={18} strokeWidth={1.5} /> },
    { id: 'relationships', label: gt('relationships'), icon: <HeartHandshake size={18} strokeWidth={1.5} /> }, { id: 'family', label: gt('family'), icon: <UsersRound size={18} strokeWidth={1.5} /> },
    { id: 'court', label: gt('court'), icon: <Castle size={18} strokeWidth={1.5} /> }, { id: 'factions', label: gt('factions'), icon: <Shield size={18} strokeWidth={1.5} /> }, { id: 'legacy', label: gt('legacy'), icon: <Trophy size={18} strokeWidth={1.5} /> }, { id: 'journal', label: gt('journal'), icon: <ScrollText size={18} strokeWidth={1.5} /> }, { id: 'save', label: gt('save'), icon: <SaveIcon size={18} strokeWidth={1.5} /> }, { id: 'settings', label: gt('settings'), icon: <Settings2 size={18} strokeWidth={1.5} /> }
  ]

  const openNpc = (id: string) => setSelectedNpc(id)
  const npcRelationship = (id: string) => game.relationships.find((r) => r.npcId === id)!
  const doInteraction = (action: 'talk' | 'flirt' | 'politics' | 'gift' | 'propose') => {
    if (!selectedNpc) return
    const before = game.journal[0]
    relationship(selectedNpc, action)
    const after = useGameStore.getState().game?.journal[0]
    setNotice(after && after !== before ? after.split(' — ').slice(1).join(' — ') : local('Action unavailable.', '현재 할 수 없는 행동입니다.'))
    setSelectedNpc(null)
  }
  const doSave = (slot: number) => setNotice(saveSlot(slot) ? `Slot ${slot} saved.` : 'Unable to save in this browser.')
  const doLoad = (slot: number) => { if (!window.confirm(local('Replace the current campaign with this save?', '현재 캠페인을 저장 내용으로 바꾸시겠습니까?'))) return; if (loadSlot(slot)) { setTab('overview'); setSelectedNpc(null); setNotice(`Loaded slot ${slot}.`) } else setNotice(gt('noSave')) }
  const exportSave = () => {
    const json = JSON.stringify(game, null, 2)
    const href = URL.createObjectURL(new Blob([json], { type: 'application/json' }))
    const link = document.createElement('a')
    link.href = href
    link.download = `joseon-${game.player.name.replace(/[^a-zA-Z0-9_-]/g, '_')}-${game.date.year}.json`
    link.click()
    window.setTimeout(() => URL.revokeObjectURL(href), 1000)
    setNotice(activeLanguage === 'ko' ? '저장 파일을 내보냈습니다.' : 'Campaign export created.')
  }
  const importSaveFile = async (file: File | undefined) => {
    if (!file) return
    if (file.size > 2_000_000) { setNotice('File is too large.'); return }
    try {
      const data: unknown = JSON.parse(await file.text())
      if (!window.confirm(local('Replace the current campaign with this imported save?', '현재 캠페인을 가져온 저장 내용으로 바꾸시겠습니까?'))) return
      if (importCampaign(data)) { setTab('overview'); setSelectedNpc(null); setNotice('Campaign imported.') }
      else setNotice('Invalid or incompatible campaign file.')
    } catch { setNotice('Unable to read campaign file.') }
  }

  return (
    <div className="game-shell">
      <header className="game-topbar">
        <div className="brand-mark"><Crown size={25} strokeWidth={1.25} /></div><div className="brand-text"><b>JOSEON</b><span>THE CROWN & THE LEGACY</span></div>
        <div className="topbar-spacer"/>
        <div className="chapter-chip">{local('CHAPTER','장')} {String(chapter(game.dayCount)).padStart(2,'0')} · {activeLanguage === 'ko' ? chapterTitles[chapter(game.dayCount)-1][1] : chapterTitles[chapter(game.dayCount)-1][0]}</div><div className="campaign-chip"><span className="live-dot"/>{game.mode === 'historical' ? gt('historical') : gt('alternative')}<b>{game.date.year}</b></div>
        <button className="top-audio" aria-label={ambientOn ? "Mute ambient sound" : "Enable ambient sound"} aria-pressed={ambientOn} title={ambientOn ? "Mute atmosphere" : "Play atmosphere"} onClick={()=>{void toggleAmbience()}}>{ambientOn ? <Volume2 size={17} /> : <VolumeX size={17} />}</button><button className="top-lang" onClick={() => setLanguage(game.language === 'en' ? 'ko' : 'en')}>{game.language === 'en' ? '한국어' : 'EN'}</button>
      </header>
      <div className="game-layout">
        <aside className="sidebar">
          <div className="side-character"><div className="side-avatar"><img src={playerArt(game.player.gender, game.player.portrait)} alt="" /></div><div><b>{game.player.name}</b><span>{game.socialStatus}</span></div></div>
          <div className="side-divider"/>
          <div className="nav-caption">THE HOUSEHOLD</div>
          {nav.map((item) => <button key={item.id} className={tab === item.id ? 'nav-item active' : 'nav-item'} onClick={() => setTab(item.id)}><span className="nav-icon">{item.icon}</span>{item.label}{tab === item.id && <i/>}</button>)}
          <div className="sidebar-progress"><small>{local('A LEGACY TAKES SHAPE','쌓여 가는 유산')}</small><strong>{achieved(game).length}<span> / {milestones.length}</span></strong><div className="meter"><i style={{width:`${achieved(game).length/milestones.length*100}%`}} /></div><button onClick={() => setTab('legacy')}>{local('VIEW THE LEGACY', '유산 살펴보기')} ↗</button></div><div className="sidebar-bottom"><div className="sidebar-motto">忠 · 孝 · 名</div><small>YOUR HOUSE. YOUR STORY.</small><button className="exit-button" onClick={() => { clearCampaign(); setScreen('title') }}>← {gt('exit')}</button></div>
        </aside>
        <main className="main-content">
          <div className="page-topline"><div><span className="eyebrow">{game.campaignLabel} · {local('GENERATION','세대')} {game.generation}</span><h1>{tab === 'overview' ? gt('overview') : nav.find((n) => n.id === tab)?.label}</h1></div><div className="date-box"><span>{gt('month').toUpperCase()} {String(game.date.month).padStart(2, '0')}</span><b>{String(game.date.day).padStart(2, '0')}</b><small>{game.date.year}</small></div></div>
          {tab === 'overview' && <>
            <section className="scene-banner" style={{ backgroundImage: `linear-gradient(90deg, rgba(24,17,17,.88), rgba(24,17,17,.2)), url("${artFor(currentLocation.art)}")` }}>
              <div className="scene-text"><span className="eyebrow">{local('CURRENT LOCATION', '현재 위치')}</span><h2>{activeLanguage === 'ko' ? currentLocation.nameKo : currentLocation.name}</h2><p>{activeLanguage === 'ko' ? ({ palace: '왕권과 궁중의 야망이 모이는 곳.', residence: '가문의 의무와 사적인 삶이 이어지는 저택.', garden: '대화와 사색, 비밀스러운 만남을 위한 정원.', audience: '왕의 총애를 얻거나 잃을 수 있는 편전.', market: '소문과 기회가 모이는 활기찬 장터.', banquet: '동맹과 명예를 드러내는 왕실 연회장.' } as Record<string,string>)[currentLocation.id] : currentLocation.description}</p><span className="scene-monarch">{local('REIGN OF', '국왕')} {game.monarch.toUpperCase()}</span></div>
              <div className="scene-seal">朝鮮</div><div className="scene-kicker">{local('AN INTERACTIVE COURT CHRONICLE','궁중 연대기')}</div>
            </section>
            <section className="stat-grid">{statItems.map((item) => <div className="stat-card" key={item.label}><div className={`stat-symbol ${item.tone}`}>{item.icon}</div><div className="stat-meta"><span>{item.label}</span><b>{item.value}<small>/100</small></b><div className="meter"><i style={{ width: `${item.value}%` }}/></div></div></div>)}</section>
            <div className="content-columns">
              <div className="content-primary">
                <section className="panel-section"><div className="section-heading"><div><span className="eyebrow">{local('MAKE YOUR MARK', '나만의 발자취')}</span><h2>{gt('actions')}</h2></div><div className="time-actions"><button className="text-action" onClick={advanceDay}>{gt('day')} →</button><button className="text-action" onClick={advanceMonth}>{activeLanguage === 'ko' ? '한 달 보내기' : 'Advance month'} →</button><button className="text-action" onClick={advanceYear}>{activeLanguage === 'ko' ? '일 년 보내기' : 'Advance year'} →</button></div></div>
                  <div className="activity-grid">
                    {[
                      ['study', '文', gt('study'), 'Improve intelligence and diplomacy.'], ['audience', '朝', gt('audience'), 'Build influence and royal favour.'], ['banquet', '宴', gt('banquet'), 'Strengthen reputation and connections.'], ['household', '家', gt('household'), 'Maintain wealth and household standing.'], ['training', '武', gt('training'), 'Develop courage and discipline.'], ['garden', '花', gt('garden'), 'Restore health and composure.'], ['rumours', '聞', gt('rumours'), 'Learn what is moving through the capital.'], ['appointment', '官', 'Seek an appointment', 'Build a formal career in royal service.']
                    ].map(([id, icon, title, desc]) => <button key={id} className="activity-card" onClick={() => performActivity(id)}><span className="activity-icon">{icon}</span><b>{title}</b><small>{desc}</small><em>− 1 DAY</em></button>)}
                    {canPlanChild(game) && <button className="activity-card" onClick={() => performActivity('child')}><span className="activity-icon">子</span><b>{activeLanguage === 'ko' ? '자녀 계획' : 'Plan for a child'}</b><small>{activeLanguage === 'ko' ? '약 아홉 달 후 출산을 기다립니다.' : 'The child will arrive in about nine months.'}</small><em>− 1 DAY</em></button>}
                  </div>
                </section>
                <section className="panel-section"><div className="section-heading"><div><span className="eyebrow">{local('THE KINGDOM', '조선의 세계')}</span><h2>{gt('locations')}</h2></div><button className="text-action" onClick={() => setTab('court')}>{local('VIEW ALL', '모두 보기')} →</button></div><div className="location-grid">{locations.map((loc) => <button key={loc.id} className={game.currentLocation === loc.id ? 'location-card current' : 'location-card'} onClick={() => setLocation(loc.id)} style={{ backgroundImage: `linear-gradient(0deg, rgba(25,18,17,.94), rgba(25,18,17,.05)), url("${artFor(loc.art)}")` }}><span>{local(loc.name, loc.nameKo)}</span><small>{game.currentLocation === loc.id ? local('CURRENT LOCATION', '현재 위치') : local('TRAVEL HERE →', '이동하기 →')}</small></button>)}</div></section>
              </div>
              <aside className="content-secondary">
                <section className="side-panel"><div className="section-heading"><div><span className="eyebrow">{local('IMPORTANT FIGURES', '주요 인물')}</span><h2>{gt('cast')}</h2></div><button className="mini-arrow" onClick={() => setTab('relationships')}>→</button></div>
                  <div className="cast-list">{npcs.slice(0, 6).map((npc) => <button key={npc.id} className="cast-row" onClick={() => openNpc(npc.id)}><div className="mini-portrait"><img src={characterArt(npc.id)} alt="" loading="lazy" /></div><div className="cast-info"><b>{npc.name}</b><span>{npc.role}</span></div><div className="cast-score">{npcRelationship(npc.id).affection}</div></button>)}</div>
                </section>
                <section className="side-panel mission-panel"><span className="eyebrow">{local('YOUR STORY SO FAR','지금까지의 이야기')}</span><div className="mission-phase">{local('Chapter','제')} {chapter(game.dayCount)} · {activeLanguage === 'ko' ? chapterTitles[chapter(game.dayCount)-1][1] : chapterTitles[chapter(game.dayCount)-1][0]}</div><p>{game.journal[0]?.split(' — ').slice(1).join(' — ') || local('Your chronicle begins.', '연대기가 시작됩니다.')}</p><button className="text-action" onClick={() => setTab('journal')}>{local('OPEN THE CHRONICLE','연대기 펼치기')} →</button></section><section className="side-panel whisper-panel"><span className="eyebrow">{local('COURT WHISPERS', '궁중의 소문')}</span><div className="whisper-quote">{local('“In the palace, silence is rarely an absence of words.”', '“궁중에서 침묵은 결코 말이 없다는 뜻만은 아니다.”')}</div><small>{local('AN OLD COURT SAYING', '궁중의 옛말')}</small><button className="btn btn-outline btn-small" onClick={() => performActivity('rumours')}>{gt('rumours')}</button></section>
                <section className="side-panel status-panel"><span className="eyebrow">{local('HOUSEHOLD STATUS', '가문 현황')}</span><div className="status-line"><span>{gt('status')}</span><b>{game.socialStatus}</b></div><div className="status-line"><span>{local('Spouse', '배우자')}</span><b>{game.spouse ?? gt('noSpouse')}</b></div><div className="status-line"><span>{gt('children')}</span><b>{game.children}</b></div></section>
              </aside>
            </div>
          </>}

          {tab === 'character' && <div className="detail-layout"><section className="detail-card character-sheet"><div className="large-portrait"><img src={playerArt(game.player.gender, game.player.portrait)} alt="Character illustration" /></div><div className="eyebrow">{local('PLAYER CHARACTER', '플레이어 인물')}</div><h2>{game.player.name}</h2><p>{game.player.background}</p><div className="detail-list"><div><span>{gt('age')}</span><b>{game.player.age}</b></div><div><span>{gt('gender')}</span><b>{game.player.gender}</b></div><div><span>{gt('familyName')}</span><b>{game.player.family}</b></div><div><span>{gt('personality')}</span><b>{game.player.personality}</b></div><div><span>{gt('status')}</span><b>{game.socialStatus}</b></div><div><span>{local('Appointment', '관직')}</span><b>{game.appointment}</b></div><div><span>{local('Spouse', '배우자')}</span><b>{game.spouse ?? '—'}</b></div></div></section><section className="detail-card"><div className="eyebrow">{local('PERSONAL DEVELOPMENT', '인물 성장')}</div><h2>{gt('attributes')}</h2>{Object.entries(game.player.attributes).map(([key, value]) => <div className="attribute-row" key={key}><div><span>{key.charAt(0).toUpperCase() + key.slice(1)}</span><b>{value}</b></div><div className="meter"><i style={{ width: `${value}%` }}/></div></div>)}<div className="detail-note">{local('Abilities influence relationships, political decisions and narrative outcomes.', '능력치는 인간관계, 정치적 선택, 이야기의 결과에 영향을 줍니다.')}</div></section></div>}

          {tab === 'relationships' && <section className="wide-panel"><div className="eyebrow">{local('ALLIANCES, AFFECTION & RIVALRIES', '동맹 · 애정 · 경쟁')}</div><h2>{gt('relationships')}</h2><div className="relationship-grid">{npcs.map((npc) => { const r = npcRelationship(npc.id); return <button key={npc.id} className="relationship-card" onClick={() => openNpc(npc.id)}><div className="mini-portrait large"><img src={characterArt(npc.id)} alt="" loading="lazy" /></div><div className="relationship-main"><b>{npc.name}</b><span>{npc.role} · {npc.family}</span><small>{r.romance > 0 ? `${gt('romance')} ${r.romance}` : r.status}</small><div className="meter"><i style={{ width: `${r.affection}%` }}/></div></div><span className="relationship-arrow">→</span></button>})}</div></section>}

          {tab === 'family' && <div className="family-page"><section className="family-banner"><span className="eyebrow">{local('HOUSEHOLD RECORD', '가문 기록')}</span><h2>{game.player.family}</h2><p>{local('Family honour is built across generations. Private choices may become public inheritance.', '가문의 명예는 세대를 거쳐 이어집니다. 사적인 선택이 공적인 유산이 되기도 합니다.')}</p><div className="family-stats"><div><b>{game.family.length}</b><span>{local('HOUSEHOLD MEMBERS', '가족 구성원')}</span></div><div><b>{game.children}</b><span>{local('YOUR CHILDREN', '자녀')}</span></div><div><b>{game.stats.reputation}</b><span>{local('FAMILY REPUTATION', '가문의 평판')}</span></div></div>{game.pendingBirthDueDay !== null && <div className="family-timeline">{activeLanguage === 'ko' ? '새 가족을 기다리는 중' : 'Expecting a new family member'} · {Math.max(0, game.pendingBirthDueDay - game.dayCount)} {activeLanguage === 'ko' ? '일 남음' : 'days remaining'}</div>}</section><section className="wide-panel"><div className="section-heading"><h2>{local('Family members', '가족 구성원')}</h2><span className="muted-small">{game.family.length} recorded</span></div><div className="family-list">{game.family.map((member) => <div className="family-row" key={member.id}><div className="family-avatar">{member.gender === 'Female' ? '女' : '男'}</div><div><b>{member.name}</b><span>{member.relation} · Age {member.age}</span><small>{member.note}</small></div></div>)}</div>{game.spouse && <div className="spouse-line"><span>{local('Marriage alliance', '혼인 동맹')}</span><b>{game.spouse}</b></div>}</section></div>}

          {tab === 'court' && <div className="court-page"><section className="hanseong-section"><div className="section-heading"><div><span className="eyebrow">{local('A MAP OF YOUR WORLD','당신이 살아갈 세계')}</span><h2>{local('Hanseong, the royal capital', '왕도 한성')}</h2></div><small>{local('A stylized navigation map · select a destination', '게임용 지도 · 장소를 선택하세요')}</small></div><div className="hanseong-map"><img src="/art/hanseong-map.svg" alt={local('Stylized illustrated city map of Hanseong','그림으로 그린 한성 지도')} /><div className="map-stops">{locations.map((loc,index)=><button key={loc.id} className={game.currentLocation===loc.id?'map-stop active':'map-stop'} style={{left:`${[48,32,24,61,75,65][index]}%`,top:`${[24,64,33,51,70,40][index]}%`}} title={local(loc.name,loc.nameKo)} onClick={()=>{setLocation(loc.id);setTab('overview')}}><span>{['宮','家','園','殿','市','宴'][index]}</span><small>{local(loc.name,loc.nameKo)}</small></button>)}</div></div></section><section className="wide-panel"><div className="eyebrow">{local('TRAVEL & INFLUENCE', '이동과 영향력')}</div><h2>{gt('locations')}</h2><div className="court-locations">{locations.map((loc) => <button key={loc.id} className="court-location" onClick={() => { setLocation(loc.id); setTab('overview') }}><div className="court-loc-art" style={{ backgroundImage: `url("${artFor(loc.art)}")` }}/><div><b>{local(loc.name, loc.nameKo)}</b><span>{loc.description}</span><small>{game.currentLocation === loc.id ? local('YOU ARE HERE', '현재 위치') : local('TRAVEL →', '이동 →')}</small></div></button>)}</div></section><section className="wide-panel"><div className="eyebrow">{local('COURTLY PURSUITS', '궁중의 활동')}</div><h2>{gt('actions')}</h2><div className="activity-grid">{[['study', '文', gt('study'), 'Develop your mind.'], ['audience', '朝', gt('audience'), 'Seek favour and influence.'], ['banquet', '宴', gt('banquet'), 'Be seen among the nobility.'], ['household', '家', gt('household'), 'Maintain your household.'], ['training', '武', gt('training'), 'Strengthen discipline.'], ['garden', '花', gt('garden'), 'Restore health.'], ['rumours', '聞', gt('rumours'), 'Gather information.'], ['appointment', '官', 'Seek an appointment', 'Build a formal career in royal service.']].map(([id, icon, title, desc]) => <button key={id} className="activity-card" onClick={() => { performActivity(id); setTab('overview') }}><span className="activity-icon">{icon}</span><b>{title}</b><small>{desc}</small><em>− 1 DAY</em></button>)}</div></section></div>}

          {tab === 'factions' && <div className="court-politics-page">
            <div className="politics-intro"><span className="eyebrow">{local('THE REALM IS NEVER OF ONE MIND', '조정은 한마음이 아니다')}</span><h2>{local('The balance of power', '권력의 균형')}</h2><p>{local('A courtier’s loyalty is a promise—and a weapon. Each council visit consumes a day. Factions remember your allegiance; the others do too.', '신하의 충성은 약속이자 무기입니다. 회의에 참석하면 하루가 지나며 정파는 당신의 선택을 기억합니다.')}</p><span>{local('NEXT COUNCIL', '다음 회의')} · {Math.max(0,7-(game.dayCount-game.lastFactionDay))} {local('days', '일')}</span></div>
            <div className="faction-grid">{factions.map((faction) => <section key={faction.id} className="faction-card" style={{'--faction-colour':faction.colour} as CSSProperties}><div className="faction-top"><span className="faction-seal">{faction.seal}</span><span>{local('COURT FACTION','궁중 정파')}</span></div><h3>{activeLanguage==='ko'?faction.nameKo:faction.name}</h3><em>{activeLanguage==='ko'?faction.mottoKo:faction.motto}</em><p>{faction.description}</p><div className="faction-standing"><span>{local('Your standing','관계의 깊이')}</span><b>{game.factions[faction.id]}<small>/100</small></b></div><div className="meter"><i style={{width:`${game.factions[faction.id]}%`}} /></div><div className="faction-buttons"><button className="btn btn-primary" disabled={game.dayCount-game.lastFactionDay<7} onClick={() => { if(consultFaction(faction.id as FactionId,'pledge')) setNotice(local('Your allegiance has been noted.','당신의 지지를 기록했습니다.')) }}>{local('Pledge loyalty','충성을 맹세한다')}</button><button className="btn btn-outline" disabled={game.dayCount-game.lastFactionDay<7} onClick={() => { if(consultFaction(faction.id as FactionId,'inquire')) setNotice(local('You have learned more about this circle.','정파의 비밀을 살폈습니다.')) }}>{local('Gather intelligence','정보를 수집한다')}</button></div></section>)}</div>
            <div className="mediation-row"><div><span className="eyebrow">{local('A THIRD WAY','제삼의 길')}</span><h3>{local('Seek a delicate compromise', '신중한 타협을 찾다')}</h3><p>{local('Preserve your independence by bringing rivals to the same table. All sides gain a little trust, but compromise costs political momentum.','정파 간 타협은 고른 신뢰를 얻지만 영향력을 소모합니다.')}</p></div><button className="btn btn-outline" disabled={game.dayCount-game.lastFactionDay<7} onClick={() => { if(consultFaction('royalist','mediate')) setNotice(local('An uneasy truce takes hold.','불안한 휴전이 이루어졌습니다.')) }}>{local('Convene mediation · 1 day', '중재 회의 · 하루')}</button></div>
          </div>}

          {tab === 'legacy' && <div className="legacy-page"><section className="legacy-hero"><div className="eyebrow">{local('THE RECORD OF A LIFE','삶의 기록')}</div><div className="legacy-main"><div><h2>{game.player.family}</h2><p>{local('You are more than a name in a ledger. These moments will outlast every reign.','이름은 기록에서 끝나지 않습니다. 당신의 선택은 왕조를 넘어 남습니다.')}</p></div><div className="legacy-total"><b>{achieved(game).length}<small>/{milestones.length}</small></b><span>{local('MILESTONES','업적')}</span></div></div><div className="legacy-track"><i style={{width:`${achieved(game).length/milestones.length*100}%`}}/></div></section><div className="achievement-grid">{milestones.map(m=><div key={m.id} className={m.earned(game)?'achievement earned':'achievement locked'}><span className="achievement-mark">{m.seal}</span><div><span className="eyebrow">{m.earned(game)?local('CHRONICLED','기록됨'):local('YET TO BE WRITTEN','아직 쓰이지 않음')}</span><h3>{activeLanguage==='ko'?m.nameKo:m.name}</h3><p>{m.description}</p></div></div>)}</div></div>}

          {tab === 'settings' && <section className="wide-panel settings-page"><div className="eyebrow">{local('THE PLAYER’S CHAMBERS','플레이어 설정')}</div><h2>{gt('settings')}</h2><p>{local('Your preferences belong to this browser. No account or network connection is required for gameplay.','설정은 이 브라우저에만 적용되며 계정이 필요하지 않습니다.')}</p><div className="settings-control"><div><b>{local('Interface language','화면 언어')}</b><small>{local('Select English or Korean. Story dialogue is localized.','영어와 한국어 가운데 선택하세요.')}</small></div><div className="settings-options"><button className={game.language==='en'?'btn btn-primary':'btn btn-outline'} onClick={()=>setLanguage('en')}>English</button><button className={game.language==='ko'?'btn btn-primary':'btn btn-outline'} onClick={()=>setLanguage('ko')}>한국어</button></div></div><div className="settings-control"><div><b>{local('Ambient sound','궁중의 분위기 소리')}</b><small>{local('An original, subtle soundscape. Playback is never automatic.','직접 켤 때만 재생되는 창작 배경음입니다.')}</small></div><button className="btn btn-outline" aria-pressed={ambientOn} onClick={()=>{void toggleAmbience()}}>{ambientOn ? local('Turn sound off','소리 끄기') : local('Turn sound on','소리 켜기')}</button></div><div className="settings-control"><div><b>{local('A private, local-first experience','개인정보와 로컬 저장')}</b><small>{local('Autosaves and manual slots stay on your device. Export JSON backups in Save / Load.','자동 저장과 수동 저장은 기기에 남으며 백업 파일로 내보낼 수 있습니다.')}</small></div><button className="btn btn-outline" onClick={()=>setTab('save')}>{gt('save')} →</button></div></section>}

          {tab === 'journal' && <section className="wide-panel journal-panel"><div className="eyebrow">{local('A RECORD OF YOUR DECISIONS', '선택의 기록')}</div><h2>{gt('journalTitle')}</h2><p className="muted-small">{local('The chronicle records actions, encounters and turning points.', '연대기는 중요한 활동과 만남, 전환점을 기록합니다.')}</p><div className="journal-list">{game.journal.map((entry, index) => <div className="journal-entry" key={`${entry}-${index}`}><span>{String(game.journal.length - index).padStart(2, '0')}</span><p>{entry}</p></div>)}</div></section>}

          {tab === 'save' && <section className="wide-panel save-page"><div className="eyebrow">{local('LOCAL CAMPAIGN DATA', '로컬 캠페인 데이터')}</div><h2>{gt('save')}</h2><p className="muted-small">{local('Progress is saved automatically. Use the three slots for manual checkpoints.', '진행 상황은 자동 저장됩니다. 세 개의 슬롯을 수동 저장 지점으로 사용하세요.')}</p><div className="save-grid">{[1, 2, 3].map((slot) => { const slotData = readSave(slotKey(slot)!); return <div className="save-card" key={slot}><div className="save-slot-number">0{slot}</div><div className="save-meta"><span>{gt('slot')} {slot}</span><b>{slotData?.player?.name ?? gt('empty')}</b><small>{slotData ? `${slotData.date.year}.${slotData.date.month}.${slotData.date.day} · ${slotData.campaignLabel}` : local('No data stored', '저장 내용 없음')}</small></div><div className="save-buttons"><button className="btn btn-primary btn-small" onClick={() => doSave(slot)}>{gt('saveNow')}</button><button className="btn btn-outline btn-small" disabled={!slotData} onClick={() => doLoad(slot)}>{gt('load')}</button></div></div>})}</div><div className="save-warning">{activeLanguage === 'ko' ? '저장 데이터는 현재 브라우저에 보관됩니다. 브라우저 데이터를 삭제하면 사라질 수 있으므로 파일로 백업하세요.' : 'Saves belong to this browser. Clearing site data can delete them. Export a backup to keep a copy.'}</div><div className="save-tools"><button className="btn btn-outline btn-small" onClick={exportSave}>{activeLanguage === 'ko' ? '캠페인 내보내기' : 'Export campaign (.json)'}</button><label className="field"><span>{activeLanguage === 'ko' ? '캠페인 불러오기' : 'Import campaign (.json)'}</span><input type="file" accept=".json,application/json" onChange={(e) => { void importSaveFile(e.currentTarget.files?.[0]); e.currentTarget.value = '' }}/></label></div><button className="btn btn-danger-outline" onClick={conclude}>{gt('conclude')}</button></section>}

          <footer className="game-footer"><span>JOSEON · THE CROWN & THE LEGACY</span><span>FICTIONAL PLAYER STORY · HISTORICAL SETTING</span></footer>
        </main>
      </div>
      {notice && <div className="toast" role="status">{notice}</div>}

      {selectedNpc && currentNpc && currentRelation && <div className="modal-backdrop" onClick={() => setSelectedNpc(null)}><div className="npc-modal" role="dialog" aria-modal="true" aria-label="Character interaction" onClick={(e) => e.stopPropagation()}><button className="modal-close" aria-label={gt('close')} onClick={() => setSelectedNpc(null)}>×</button><div className="npc-modal-head"><div className="large-portrait small-large"><img src={characterArt(currentNpc.id)} alt="Character portrait" /></div><div><div className="eyebrow">{currentNpc.family}</div><h2>{currentNpc.name}</h2><span>{currentNpc.role} · {currentNpc.age}</span></div></div><p className="npc-description">{currentNpc.description}</p><div className="npc-bars">{[['Affection', currentRelation.affection], ['Trust', currentRelation.trust], ['Respect', currentRelation.respect], ['Romance', currentRelation.romance]].map(([label, value]) => <div key={label as string}><span>{label}</span><b>{value}</b><div className="meter"><i style={{ width: `${value}%` }}/></div></div>)}</div><div className="interaction-actions"><div className="eyebrow">{gt('interact')}</div><button className="btn btn-outline" onClick={() => doInteraction('talk')}>{gt('talk')}</button><button className="btn btn-outline" onClick={() => doInteraction('politics')}>{gt('politics')}</button>{currentNpc.romanceable && <button className="btn btn-outline" disabled={game.mode === 'historical' && game.player.gender === currentNpc.gender} onClick={() => doInteraction('flirt')}>{gt('flirt')}</button>}<button className="btn btn-outline" onClick={() => doInteraction('gift')} disabled={game.stats.wealth < 4}>{gt('gift')} · 4</button>{canPropose(game, currentNpc) && <button className="btn btn-primary" onClick={() => doInteraction('propose')}>{gt('propose')}</button>}</div></div></div>}

      {game.activeEvent && <div className="modal-backdrop event-backdrop"><div className="event-modal" role="dialog" aria-modal="true" aria-label="Narrative decision"><div className="event-top-art"><span>宮廷秘話</span></div><div className="event-content"><div className="eyebrow">{game.activeEvent.location.toUpperCase()} · A TURNING POINT</div><h2>{activeLanguage === 'ko' ? game.activeEvent.titleKo : game.activeEvent.title}</h2><p>{activeLanguage === 'ko' ? game.activeEvent.storyKo : game.activeEvent.story}</p><div className="event-choices"><span className="eyebrow">{gt('choose')}</span>{game.activeEvent.choices.map((choice, index) => <button key={index} className="event-choice" onClick={() => { chooseEvent(index); setNotice(activeLanguage === 'ko' ? choice.consequenceKo : choice.consequence) }}><b>{String(index + 1).padStart(2, '0')}</b><span><strong>{activeLanguage === 'ko' ? choice.textKo : choice.text}</strong><small className="choice-impact">{Object.entries(choice.effect).filter(([key])=>['influence','reputation','wealth','royalFavor','health'].includes(key)).map(([key,value])=>`${key} ${Number(value)>0?'+':''}${value}`).join(' · ') || local('Relationships & consequences','관계와 결과')}</small></span><i>→</i></button>)}</div></div></div></div>}

      {game.ending && <div className="modal-backdrop ending-backdrop"><div className="ending-card" role="dialog" aria-modal="true" aria-label="Campaign ending"><div className="ending-seal">終</div><div className="eyebrow">THE CHRONICLE OF {game.player.name.toUpperCase()}</div><h2>{game.ending.title}</h2><p>{game.ending.text}</p><div className="ending-summary"><div><b>{game.stats.reputation}</b><span>{gt('reputation')}</span></div><div><b>{game.stats.influence}</b><span>{gt('influence')}</span></div><div><b>{game.children}</b><span>{gt('children')}</span></div></div>{game.ending.canContinue && <button className="btn btn-primary btn-wide" onClick={() => { continueAsDescendant(); setTab('overview'); setSelectedNpc(null) }}>{local('Continue as descendant', '후손으로 이어가기')}</button>}<button className="btn btn-outline btn-wide" onClick={() => { useGameStore.getState().dismissEnding(); setScreen('title'); setSelectedNpc(null) }}>{local('Return to title', '첫 화면으로')}</button></div></div>}
    </div>
  )
}

export default App
