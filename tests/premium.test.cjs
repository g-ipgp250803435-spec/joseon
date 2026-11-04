const test = require('node:test')
const assert = require('node:assert/strict')
const { factions, achieved, chapter, chapterTitles, milestones } = require('../.test-build/premium.js')
const { premiumEvents, extendedEvents, historicalScenarios, storyEvents, npcs } = require('../.test-build/data.js')
const { eligibleForEvent, applyEffect } = require('../.test-build/rules.js')
const { convertStandaloneSave } = require('../.test-build/migration.js')
function game() { return {
 schemaVersion:5,mode:'historical',scenarioId:'1724',campaignLabel:'1724',monarch:'King Yeongjo',
 player:{name:'Yi Seol',gender:'Female',age:21,family:'House Yi',background:'Established aristocratic family',personality:'Composed',portrait:'花',attributes:{intelligence:50,charisma:50,influence:50,diplomacy:50,courage:50}},
 date:{year:1724,month:10,day:14},dayCount:0,stats:{reputation:45,influence:25,wealth:50,health:90,royalFavor:35},socialStatus:'Noble household',appointment:'No official appointment',
 relationships:npcs.map(n=>({npcId:n.id,affection:8,trust:10,respect:12,romance:0,status:'Acquaintance'})),family:[{id:'s',name:'Yi Jun',relation:'Sibling',age:18,gender:'Male',note:''}],currentLocation:'residence',seenEvents:[],activeEvent:null,journal:[],spouse:null,children:0,ending:null,language:'en',generation:1,pendingBirthDueDay:null,lastEventDay:-5,lastInteraction:{},factions:{reform:20,tradition:20,royalist:20},lastFactionDay:-10
}}
test('three factions have unique identities; milestone catalog is meaningful',()=>{
 assert.deepEqual(factions.map(f=>f.id),['reform','tradition','royalist']);assert.equal(milestones.length,21)
 assert.equal(new Set(milestones.map(m=>m.id)).size,21)
 assert.equal(achieved(game()).length,1)
 assert.equal(chapter(0),1);assert.equal(chapter(1080),4);assert.equal(chapterTitles.length,4)
})
test('the 1724 letter is gated and all three paths lead to different aftermaths',()=>{
 const g=game();assert.equal(eligibleForEvent(g,'lotus-letter'),false)
 g.dayCount=6;assert.equal(eligibleForEvent(g,'lotus-letter'),true)
 const letter=premiumEvents.find(e=>e.id==='lotus-letter');assert.equal(letter.choices.length,3)
 assert.deepEqual(letter.choices.map(c=>c.effect.flag),['lotus-burned','lotus-tribunal','lotus-hidden'])
 g.dayCount=12;for(const [flag,event] of [['lotus-burned','lotus-ash'],['lotus-tribunal','lotus-judgement'],['lotus-hidden','lotus-bargain']]){
  g.seenEvents=[flag];assert.equal(eligibleForEvent(g,event),true)
 }
})
test('faction effects apply immutably and cannot exceed bounds',()=>{
 const g=game();g.factions.reform=99
 const result=applyEffect(g,{faction:{id:'reform',amount:9},reputation:200})
 assert.equal(g.factions.reform,99);assert.equal(result.factions.reform,100);assert.equal(result.stats.reputation,100)
})
test('additional political events have conditions and tracked decisions',()=>{
 const g=game();g.scenarioId='1776'
 for(const e of ['missing-ledger','ledger-hearing','winter-relief','letters-home','physicians-warning','envoy-gates','three-seals','house-charter'])
  assert.equal(eligibleForEvent(g,e),false,e)
 g.dayCount=21;g.seenEvents=['ledger-investigated'];assert.equal(eligibleForEvent(g,'ledger-hearing'),true)
 assert.equal(storyEvents.filter(e=>e.choices.length!==3).length,0)
 assert.ok(extendedEvents.length>=9)
})
test('custom historical prologue exists and correct campaign starts are available',()=>{
 const g=game();g.scenarioId='custom-1650'; assert.equal(eligibleForEvent(g,'chronicle-custom'),true)
 g.scenarioId='1776';assert.equal(eligibleForEvent(g,'chronicle-custom'),false)
 assert.equal(historicalScenarios.some(s=>s.id==='1724'),true)
 assert.equal(historicalScenarios.length,7)
})
test('standalone v2.1 campaign migration preserves character, relationships and family',()=>{
 const old={schemaVersion:3,mode:'historical',scenarioId:'1776',scenario:'A New Reign',monarch:'King Jeongjo',lang:'en',year:1777,month:2,day:6,dayCount:366,generation:1,
 player:game().player,stats:{reputation:48,influence:41,wealth:44,health:91,favour:66},status:'Noble household',appointment:'Junior Court Official',rels:npcs.map(n=>({id:n.id,affection:26,trust:28,respect:17,romance:7})),familyMembers:[{name:'Yi Jun',relation:'Sibling',age:19,gender:'Male',note:'Dear brother'}],spouse:null,children:0,location:'garden',seen:['letter-shared'],journal:['A day in the garden'],ending:null,pendingBirthDueDay:null,lastEventDay:20,lastFactionAction:1,lastInteraction:{},factions:{reform:55,tradition:13,independent:30}}
 const converted=convertStandaloneSave(old)
 assert.equal(converted.schemaVersion,6);assert.equal(converted.stats.royalFavor,66)
 assert.equal(converted.factions.reform,55);assert.equal(converted.factions.royalist,20)
 assert.equal(converted.relationships.length,npcs.length);assert.equal(converted.family[0].name,'Yi Jun')
 assert.equal(converted.currentLocation,'garden');assert.deepEqual(converted.seenEvents,['letter-shared'])
})
