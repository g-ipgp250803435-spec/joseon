const test = require('node:test')
const assert = require('node:assert/strict')
const { defaultCulture, seasonIndex, historicalPeriod, inviteForSeason, eventForInvitation, declineInvitation, practiceCulture, initiateProject, matureCulturalProjects, completeInvitation, eligibleForCulturalEvent, culturalStoryEvents, projects } = require('../.test-build/culture.js')
const { applyEffect, advanceCalendarDays } = require('../.test-build/rules.js')
const { npcs } = require('../.test-build/data.js')
function makeGame() {
 return {schemaVersion:5, mode:'historical',scenarioId:'1776',campaignLabel:'Reformer',monarch:'King Jeongjo',
 player:{name:'Yi Seoyeon', gender:'Female',age:20,family:'House Seo',background:'Established aristocratic family',personality:'Composed',portrait:'花',attributes:{intelligence:50,charisma:50,influence:50,diplomacy:50,courage:50}},
 date:{year:1776,month:3,day:1},dayCount:0,stats:{reputation:42,influence:22,wealth:48,health:92,royalFavor:28},
 socialStatus:'Noble household',appointment:'No official appointment',standing:'noble',career:{path:'scholarship',rank:0,experience:0,examined:false,lastActionDay:-30},household:{level:0,ventures:0,obligations:1,lastSettlement:'',lastActionDay:-30},downfall:null,relationships:npcs.map(n=>({npcId:n.id,affection:8,trust:10,respect:12,romance:0,status:'Acquaintance'})),family:[],currentLocation:'residence',seenEvents:[],activeEvent:null,journal:[],spouse:null,children:0,ending:null,language:'en',generation:1,pendingBirthDueDay:null,lastEventDay:-5,lastInteraction:{},factions:{reform:20,tradition:20,royalist:20},lastFactionDay:-10,culture:defaultCulture()}
}
test('cultural eras and simplified seasons are deterministic',()=>{ assert.deepEqual([1,4,7,10].map(seasonIndex),[0,1,2,3]);assert.deepEqual([1392,1592,1776,1890].map(historicalPeriod),['early','middle','late','transition']) })
test('first seasonal invitation opens once and includes era-specific flavor',()=>{
 const g=makeGame(), a=inviteForSeason(g)
 assert.equal(a.culture.invitations.length,1)
 assert.equal(a.culture.invitations[0].kind,'salon')
 assert.match(a.culture.invitations[0].summary,/literary circles/i)
 assert.equal(inviteForSeason(a).culture.invitations.length,1)
 assert.equal(g.culture.invitations.length,0)
})
test('salon branches carry distinct and clamped social consequences',()=>{
 let g=inviteForSeason(makeGame())
 const event=eventForInvitation(g,g.culture.invitations[0].id)
 assert.equal(event.choices.length,3)
 assert.equal(event.choices[0].effect.culture.key,'artistry')
 const poem=applyEffect(g,event.choices[0].effect)
 assert.equal(poem.culture.artistry,26)
 assert.equal(poem.culture.records.length,1)
 assert.equal(g.culture.artistry,18)
 const debate=applyEffect(g,event.choices[1].effect)
 assert.equal(debate.culture.etiquette,31) // poor etiquette incurs penalty
 assert.equal(debate.culture.scholarship,29)
 const kindness=applyEffect(g,event.choices[2].effect)
 assert.ok(kindness.relationships.find(r=>r.npcId==='dojun').trust>10)
})
test('invitation completion and decline are exclusive and documented',()=>{
 const g=inviteForSeason(makeGame()), id=g.culture.invitations[0].id
 const completed=completeInvitation(g,`invitation-${id}`)
 assert.equal(completed.culture.invitations[0].status,'attended')
 assert.equal(eventForInvitation(completed,id),null)
 const declined=declineInvitation(g,id)
 assert.equal(declined.culture.invitations[0].status,'declined')
 assert.equal(declined.culture.etiquette,32)
 assert.equal(declineInvitation(declined,id),null)
 assert.equal(g.culture.invitations[0].status,'pending')
})
test('each cultural practice is bounded to one action per game day',()=>{
 const g=makeGame()
 for(const action of ['study','poetry','etiquette','rites']){
  const result=practiceCulture(g,action);assert.ok(result);assert.equal(practiceCulture(result,action),null)
  assert.equal(result.stats.wealth,g.stats.wealth-(action==='rites'?2:action==='poetry'?1:0))
 }
 assert.equal(practiceCulture({...g, activeEvent:{id:'block'}},'study'),null)
})
test('patronage costs resources, takes time, and creates a permanent record',()=>{
 const g=makeGame()
 const first=initiateProject(g,'library')
 assert.equal(first.stats.wealth,32)
 assert.equal(first.culture.projects[0].completionDay,90)
 assert.equal(initiateProject(first,'library'),null)
 assert.equal(matureCulturalProjects({...first,dayCount:89}).culture.records.length,0)
 const finished=matureCulturalProjects({...first,dayCount:90})
 assert.equal(finished.culture.projects[0].completed,true)
 assert.equal(finished.culture.records.length,1)
 assert.ok(finished.culture.prestige>g.culture.prestige)
 assert.equal(matureCulturalProjects(finished).culture.records.length,1)
 assert.equal(g.culture.projects.length,0)
})
test('advancing a year carries overdue invitation and matures a project',()=>{
 let g=inviteForSeason(makeGame())
 g=initiateProject(g,'atelier')
 const next=advanceCalendarDays(g,360)
 assert.equal(next.culture.projects[0].completed,true)
 assert.ok(next.culture.invitations.some(i=>i.status==='declined'))
 assert.ok(next.culture.invitations.some(i=>i.status==='pending'))
 assert.ok(next.culture.etiquette<g.culture.etiquette)
})
test('a cultural record and tradition are earned by consequence not decoration',()=>{
 const g=makeGame()
 const effect={culture:{key:'virtue',amount:90},culturalSecondary:{key:'prestige',amount:12},tradition:'House of the Seven Books',culturalRecord:{kind:'rite',title:'Ancestral scroll',titleKo:'조상 서책'}}
 const next=applyEffect(g,effect)
 assert.equal(next.culture.virtue,100)
 assert.equal(next.culture.records[0].generation,1)
 assert.equal(next.culture.traditions.length,2)
 assert.equal(g.culture.traditions.length,1)
})
test('cultural storylines unlock on practice and historical family circumstances',()=>{
 const g=makeGame();g.dayCount=101
 assert.equal(culturalStoryEvents.length,3)
 assert.equal(eligibleForCulturalEvent(g,'scholar-disputation'),false)
 g.culture.scholarship=55;assert.equal(eligibleForCulturalEvent(g,'scholar-disputation'),true)
 assert.equal(eligibleForCulturalEvent(g,'ancestors-dispute'),true)
 g.culture.projects=[{id:'library-1',type:'library',startedDay:0,completionDay:90,completed:true}]
 assert.equal(eligibleForCulturalEvent(g,'commission-reckoning'),true)
})
test('period transition ends historical play at the 1897 boundary',()=>{
 const g=makeGame();g.date={year:1897,month:12,day:30};g.mode='historical'
 const ended=advanceCalendarDays(g,1)
 assert.equal(ended.date.year,1898)
 assert.equal(ended.ending.canContinue,false)
})
