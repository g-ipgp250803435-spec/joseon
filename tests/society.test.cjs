const test = require('node:test')
const assert = require('node:assert/strict')
const { defaultIdentity, defaultHouse, defaultFinances, prepareSociety, settleFamilyFinances, financeDecision, houseDecision, studyDiscipline, updateCivicStanding, inheritSociety } = require('../.test-build/society.js')
const { societyEvents } = require('../.test-build/societyEvents.js')
const { applyEffect, advanceCalendarDays, eligibleForEvent } = require('../.test-build/rules.js')
const { defaultCareer, defaultEstate, revokeNobleStatus } = require('../.test-build/life.js')
const { defaultCulture } = require('../.test-build/culture.js')
const { npcs } = require('../.test-build/data.js')
function fresh() {
 const g = { schemaVersion:6,mode:'historical',scenarioId:'1724',campaignLabel:'A New Reign',monarch:'King Yeongjo',
  player:{name:'Yi Seol',gender:'Male',age:22,family:'House Yi',background:'Established aristocratic family',personality:'Composed',portrait:'竹',attributes:{intelligence:52,charisma:55,influence:50,diplomacy:50,courage:50}},
  date:{year:1724,month:3,day:1},dayCount:0,stats:{reputation:45,influence:35,wealth:50,health:90,royalFavor:35},
  socialStatus:'Noble household',standing:'noble',career:defaultCareer(),household:defaultEstate(),downfall:null,
  appointment:'No official appointment',relationships:npcs.map(n=>({npcId:n.id,affection:10,trust:12,respect:12,romance:0,status:'Acquaintance'})),
  family:[],currentLocation:'residence',seenEvents:[],activeEvent:null,journal:[],spouse:null,children:0,ending:null,language:'en',
  generation:1,pendingBirthDueDay:null,lastEventDay:-5,lastInteraction:{},culture:defaultCulture(),factions:{reform:20,tradition:20,royalist:20},lastFactionDay:-10 }
 return prepareSociety(g)
}
const doAction=(g,action)=>financeDecision(g,action)?.game
const newDay=(g)=>({...g,dayCount:g.dayCount+1,date:{...g.date,day:Math.min(30,g.date.day+1)}})
test('new game has independent legal identity, social prestige and formal authority',()=>{
 const g=fresh(); assert.equal(g.identity.birthStatus,'noble');assert.equal(g.standing,'noble')
 assert.equal(g.identity.authority,0);assert.equal(g.finance.familyTreasury,36)
 assert.equal(g.finance.familyDebt,0);assert.equal(g.finance.holdings.length,2)
 assert.equal(g.house.name,'House Yi');assert.equal(g.house.leadership,'elders')
})
test('separate royal birth from political power and official office',()=>{
 let g=fresh();g.standing='royal';g.player.background='Royal bloodline'
 g=prepareSociety(g);assert.equal(g.identity.birthStatus,'royal');assert.equal(g.identity.authority,0)
 g.stats.influence=100;g.stats.wealth=100
 assert.equal(updateCivicStanding(g).identity.authority,0)
})
test('family treasury receives funds only after explicit transfer',()=>{
 const g=fresh();const n=doAction(g,'deposit');assert.equal(n.stats.wealth,40)
 assert.equal(n.finance.familyTreasury,46); assert.equal(g.stats.wealth,50);assert.equal(g.finance.familyTreasury,36)
})
test('only a recognized house head can withdraw communal funds',()=>{
 const g=fresh();assert.equal(doAction(g,'withdraw'),undefined)
 g.house.leadership='player';const n=doAction(g,'withdraw');assert.equal(n.finance.familyTreasury,28);assert.equal(n.stats.wealth,58)
})
test('one financial decision per day; property acquisitions consume treasury',()=>{
 const g=fresh();const first=doAction(g,'purchase');assert.equal(first.finance.holdings.length,3)
 assert.equal(first.finance.familyTreasury,8);assert.equal(doAction(first,'purchase'),undefined)
})
test('property repair consumes resources and does not create arbitrary new funds',()=>{
 const g=fresh();g.finance.holdings[0].condition=70
 const n=doAction(g,'repair');assert.equal(n.finance.holdings[0].condition,88)
 assert.equal(n.finance.familyTreasury,28);assert.equal(g.finance.holdings[0].condition,70)
})
test('commercial investment is limited and recurring returns are deterministic',()=>{
 const g=fresh();const launched=doAction(g,'enterprise');assert.equal(launched.finance.familyTreasury,12)
 const month={...launched,date:{year:1724,month:4,day:1},dayCount:30}
 const settled=settleFamilyFinances(month); const twice=settleFamilyFinances(settled)
 assert.equal(twice.finance.familyTreasury,settled.finance.familyTreasury)
 assert.equal(twice.finance.ledger.length,settled.finance.ledger.length)
 assert.equal(g.finance.enterprises.length,0)
})
test('monthly settlements can incur debt; cannot make communal treasury negative',()=>{
 const g=fresh();g.finance.familyTreasury=0;g.finance.holdings=[]
 const month={...g,date:{year:1724,month:12,day:1},dayCount:300}
 const n=settleFamilyFinances(month)
 assert.equal(n.finance.familyTreasury,0);assert.ok(n.finance.familyDebt>0)
 assert.ok(n.finance.ledger[0].amount<0)
})
test('debt repayment reduces both debt and communal cash, never personal wealth',()=>{
 const g=fresh();g.finance.familyDebt=15
 const n=doAction(g,'repay'); assert.equal(n.finance.familyDebt,5)
 assert.equal(n.finance.familyTreasury,26); assert.equal(n.stats.wealth,50)
})
test('convening elders improves family bonds but not crown authority',()=>{
 const g=fresh();const n=houseDecision(g,'council').game
 assert.equal(n.house.cohesion,56);assert.equal(n.identity.honour,50)
 assert.equal(n.identity.authority,0);assert.equal(g.house.cohesion,50)
})
test('a formal family alliance requires funds and deducts the cost',()=>{
 const g=fresh();const n=houseDecision(g,'alliance').game
 assert.deepEqual(n.house.allies,['House Min']);assert.equal(n.finance.familyTreasury,28)
 assert.equal(houseDecision(newDay(n),'alliance'),null)
})
test('house leadership requires merit and only gives household authority',()=>{
 const g=fresh();assert.equal(houseDecision(g,'claim'),null)
 g.house.cohesion=60;g.identity.prestige=54
 const n=houseDecision(g,'claim').game;assert.equal(n.house.leadership,'player')
 assert.equal(updateCivicStanding(n).identity.authority,25)
 assert.equal(n.career.rank,0)
})
test('new educational disciplines improve only their intended skill and cost health',()=>{
 const g=fresh();const n=studyDiscipline(g,'classics').game
 assert.equal(n.identity.education.classics,g.identity.education.classics+5)
 assert.equal(n.player.attributes.intelligence,53);assert.equal(n.stats.health,89)
 assert.equal(studyDiscipline(n,'classics'),null)
})
test('adult descendants inherit house assets, debts and legacies without inheriting office',()=>{
 const g=fresh();g.finance.familyDebt=29;g.house.heritage=['Ancestral scholarship'];g.career.rank=2
 const n=inheritSociety(g)
 assert.equal(n.finance.familyDebt,29);assert.equal(n.house.heritage[0],'Ancestral scholarship')
 assert.equal(n.house.leadership,'elders');assert.ok(n.identity.education.classics<g.identity.education.classics)
})
test('formal downfall removes legal privileges but preserves noble birth history',()=>{
 const g=fresh();g.career.rank=2
 const n=revokeNobleStatus(g,'Political conviction')
 assert.equal(n.standing,'commoner');assert.equal(n.identity.birthStatus,'noble')
 assert.equal(n.identity.authority,0);assert.equal(n.career.rank,0)
 assert.equal(g.standing,'noble')
})
test('three new storylines are gated and have genuinely different consequences',()=>{
 const g=fresh();assert.equal(societyEvents.length,3)
 for (const event of societyEvents) assert.equal(event.choices.length,3)
 assert.equal(eligibleForEvent(g,'disputed-inheritance'),false)
 g.dayCount=80;assert.equal(eligibleForEvent(g,'disputed-inheritance'),true)
 g.dayCount=50;g.finance.enterprises=[{id:'x',name:'Trade',sector:'textiles',capital:24,risk:1,ownership:'family'}]
 assert.equal(eligibleForEvent(g,'merchant-reckoning'),true)
 g.dayCount=80;g.career.path='scholarship';g.career.rank=2
 assert.equal(eligibleForEvent(g,'royal-seal-of-office'),false)
 g.career.path='civil';assert.equal(eligibleForEvent(g,'royal-seal-of-office'),true)
})
test('political choices alter separated honour and house treasury without silently changing status',()=>{
 const g=fresh();const choice=societyEvents[1].choices[2];const n=applyEffect(g,choice.effect)
 assert.equal(n.identity.honour,g.identity.honour-12)
 assert.equal(n.finance.familyTreasury,g.finance.familyTreasury+15)
 assert.equal(n.stats.wealth,g.stats.wealth)
 assert.equal(n.standing,'noble')
})
test('calendar advances all monthly settlements during time skips, once per month',()=>{
 const g=fresh();const n=advanceCalendarDays(g,95)
 assert.ok(n.finance.ledger.filter(x=>x.text.includes('Monthly household')).length>=3)
 assert.equal(n.finance.lastMonthKey,`${n.date.year}-${n.date.month}`)
})
test('private savings are distinct from both personal cash and family treasury',()=>{
 const g=fresh();const saved=doAction(g,'save')
 assert.equal(saved.stats.wealth,42);assert.equal(saved.finance.personalSavings,20);assert.equal(saved.finance.familyTreasury,36)
 const reversed=doAction(newDay(saved),'unsave')
 assert.equal(reversed.stats.wealth,50);assert.equal(reversed.finance.personalSavings,12)
})
test('mentorship is age-gated, costs personal resources and persists on the child',()=>{
 const { mentorDescendant } = require('../.test-build/society.js')
 const g=fresh();g.family=[{id:'heir',name:'Yi Min',relation:'First child',age:8,gender:'Female',note:'',training:{focus:'arts',progress:10}}];g.children=1
 const out=mentorDescendant(g,'heir','martial')
 assert.equal(out.game.family[0].training.focus,'martial')
 assert.equal(out.game.family[0].training.progress,18)
 assert.equal(out.game.stats.wealth,47)
 assert.equal(mentorDescendant(out.game,'heir','martial'),null)
 assert.equal(g.family[0].training.progress,10)
})
test('mentoring is unavailable for adult heirs and non-descendants',()=>{
 const { mentorDescendant } = require('../.test-build/society.js')
 const g=fresh();g.family=[{id:'heir',name:'Yi Min',relation:'First child',age:18,gender:'Female',note:''}];g.children=1
 assert.equal(mentorDescendant(g,'heir','arts'),null)
 assert.equal(mentorDescendant(g,'missing','arts'),null)
})
test('insufficient family funds create debt when a political choice costs money',()=>{
 const g=fresh();g.finance.familyTreasury=2
 const n=applyEffect(g,{familyTreasury:-12,honour:5})
 assert.equal(n.finance.familyTreasury,0);assert.equal(n.finance.familyDebt,10);assert.equal(n.stats.wealth,50)
})
test('formal office duties require an appointment and discipline, not political wealth',()=>{
 const { careerAction } = require('../.test-build/life.js')
 const g=fresh();g.career={...g.career,path:'civil',rank:1,examined:true,experience:30}
 assert.equal(careerAction(g,'serve'),null)
 g.identity.education.administration=30
 const out=careerAction(g,'serve')
 assert.ok(out);assert.equal(out.game.career.experience,36)
 assert.ok(out.game.stats.royalFavor>g.stats.royalFavor)
 assert.equal(g.career.experience,30)
})
test('historical eligibility respects adult age and legal status',()=>{
 const { isCourtEligible } = require('../.test-build/life.js')
 const g=fresh(); assert.equal(isCourtEligible(g),true)
 g.player.age=15;assert.equal(isCourtEligible(g),false)
 g.player.age=22;g.player.gender='Female';assert.equal(isCourtEligible(g),false)
 g.mode='alternative';assert.equal(isCourtEligible(g),true)
 g.standing='commoner';assert.equal(isCourtEligible(g),false)
})
test('migrating standalone save now includes the independent identity and economic profiles',()=>{
 const { convertStandaloneSave } = require('../.test-build/migration.js')
 const g=fresh();const r={mode:'historical',year:1776,month:3,day:2,dayCount:1,scenario:'A New Reign',monarch:'King Jeongjo',player:g.player,stats:{...g.stats,favour:32},status:'Noble household',rels:[],familyMembers:[],factions:{},seen:[],journal:[],children:0}
 const output=convertStandaloneSave(r)
 assert.equal(output.schemaVersion,6);assert.equal(output.identity.birthStatus,'noble');assert.equal(output.finance.familyTreasury,36)
 assert.ok(output.house.lastMentorDay<0)
})
test('new source pages and V6 save migration are connected to UI and repository checks',()=>{
 const fs=require('node:fs');const path=require('node:path');const root=path.resolve(__dirname,'..')
 const app=fs.readFileSync(path.join(root,'src/App.tsx'),'utf8')
 const store=fs.readFileSync(path.join(root,'src/game/store.ts'),'utf8')
 const storage=fs.readFileSync(path.join(root,'src/game/storage.ts'),'utf8')
 for(const fn of ['manageFinance','leadHouse','pursueStudy','mentorChild']) { assert.ok(app.includes(fn));assert.ok(store.includes(fn)) }
 assert.ok(app.includes("tab === 'house'"));assert.ok(app.includes('finance.ledger'))
 assert.match(storage,/identity: identityShape, house: houseShape, finance: financeShape/)
 assert.match(storage,/\[1, 2, 3, 4, 5, SAVE_VERSION\]/)
 assert.ok(fs.existsSync(path.join(root,'src/game/societyEvents.ts')))
})
