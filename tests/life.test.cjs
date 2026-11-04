const test = require('node:test')
const assert = require('node:assert/strict')
const {careerAction,householdAction,settleHousehold,revokeNobleStatus,acknowledgeDownfall,justiceAction,defaultCareer,defaultEstate,isCourtEligible} = require('../.test-build/life.js')
const {applyEffect,eligibleForEvent,advanceCalendarDays} = require('../.test-build/rules.js')
const {defaultCulture}=require('../.test-build/culture.js')
const {lifeEvents}=require('../.test-build/lifeEvents.js')
function game(){return {
 schemaVersion:5,mode:'historical',scenarioId:'1776',campaignLabel:'Jeongjo',monarch:'King Jeongjo',
 player:{name:'Yi Seoyeon',gender:'Female',age:20,family:'House Seo',background:'Established aristocratic family',personality:'Composed',portrait:'花',attributes:{intelligence:60,charisma:50,influence:50,diplomacy:50,courage:52}},
 date:{year:1776,month:3,day:1},dayCount:0,stats:{reputation:45,influence:50,wealth:78,health:92,royalFavor:55},
 socialStatus:'Noble household',standing:'noble',career:defaultCareer(),household:defaultEstate(),downfall:null,
 appointment:'No official appointment',relationships:[],family:[],currentLocation:'residence',seenEvents:[],activeEvent:null,journal:[],spouse:null,children:0,ending:null,language:'en',generation:1,pendingBirthDueDay:null,lastEventDay:-5,lastInteraction:{},factions:{reform:20,tradition:20,royalist:25},lastFactionDay:-10,culture:defaultCulture()
}}
test('career paths have progression gates and actual qualifications',()=>{
 const g=game()
 assert.equal(careerAction(g,'petition'),null)
 const g1=careerAction(g,'train').game
 assert.equal(g1.career.experience,7)
 assert.equal(careerAction(g1,'train'),null) // once per day
 assert.equal(g.career.experience,0)
 const qualified=careerAction({...g,career:{...g.career,experience:28},culture:{...g.culture,scholarship:45}},'exam')
 assert.ok(qualified)
 assert.equal(qualified.game.career.examined,true)
 assert.equal(qualified.game.stats.wealth,74)
 assert.equal(careerAction({...qualified.game,dayCount:5,career:{...qualified.game.career,experience:30}},'petition').game.career.rank,1)
})
test('historical gender restrictions apply to formal civil and military appointments but not scholarship',()=>{
 const g=game()
 assert.equal(isCourtEligible(g),false)
 const switched=careerAction(g,'switch','military').game
 assert.equal(careerAction({...switched,dayCount:2,career:{...switched.career,experience:30}},'exam'),null)
 const alt={...switched,mode:'alternative',dayCount:2,career:{...switched.career,experience:30}}
 assert.ok(careerAction(alt,'exam'))
 const male={...switched,player:{...switched.player,gender:'Male'},dayCount:2,career:{...switched.career,experience:30}}
 assert.ok(careerAction(male,'exam'))
})
test('housing expands with finite costs, trade is not an infinite clicking exploit',()=>{
 let g=game()
 g=householdAction(g,'expand').game
 assert.equal(g.household.level,1)
 assert.equal(g.stats.wealth,62)
 assert.equal(householdAction(g,'expand'),null)
 g={...g,dayCount:2}
 g=householdAction(g,'invest').game
 assert.equal(g.stats.wealth,46)
 assert.equal(g.household.ventures,1)
 assert.equal(game().household.level,0)
})
test('monthly settling is unique and bulk time progression respects monthly boundaries',()=>{
 const g={...game(),household:{...defaultEstate(),level:2,ventures:1}}
 const first=settleHousehold(g)
 const second=settleHousehold(first)
 assert.equal(first.stats.wealth,84)
 assert.equal(second.stats.wealth,first.stats.wealth)
 const bulk=advanceCalendarDays(g,60)
 assert.equal(bulk.date.month,5)
 assert.equal(bulk.date.day,1)
 assert.ok(bulk.stats.wealth>g.stats.wealth)
 assert.equal(g.household.lastSettlement,'')
})
test('legal revocation is distinct from a reputation penalty and fully blocks office',()=>{
 const g=game(), fallen=revokeNobleStatus(g,'Conviction')
 assert.equal(g.standing,'noble')
 assert.equal(fallen.standing,'commoner')
 assert.equal(fallen.downfall.acknowledged,false)
 assert.equal(fallen.career.rank,0)
 assert.equal(fallen.appointment,'No official appointment')
 assert.equal(careerAction(fallen,'train'),null)
 assert.equal(eligibleForEvent(fallen,'final-audience'),false)
 assert.equal(eligibleForEvent(fallen,'a-life-in-exile'),false) // 2-day delay
 assert.equal(householdAction(fallen,'expand'),null)
 assert.ok(householdAction(fallen,'steward'))
})
test('a character can work while disgraced and later win conditional restoration',()=>{
 const g=revokeNobleStatus(game(),'Court decree')
 assert.equal(justiceAction(g,'investigate'),null)
 let next=acknowledgeDownfall(g)
 assert.equal(next.downfall.acknowledged,true)
 assert.equal(justiceAction(next,'appeal'),null)
 next={...next,dayCount:30,downfall:{...next.downfall,evidence:21,lastActionDay:-10},stats:{...next.stats,influence:30,wealth:50}}
 const appeal=justiceAction(next,'appeal')
 assert.ok(appeal)
 assert.equal(appeal.game.standing,'noble')
 assert.equal(appeal.game.downfall.restored,true)
 assert.equal(appeal.game.socialStatus,'Restored noble household')
})
test('insufficient proof loses a petition without granting a royal pardon',()=>{
 const g=acknowledgeDownfall(revokeNobleStatus(game(),'Injustice'))
 const weak={...g,dayCount:30,downfall:{...g.downfall,evidence:9},stats:{...g.stats,influence:1,wealth:20}}
 const petition=justiceAction(weak,'appeal')
 assert.equal(petition.game.standing,'commoner')
 assert.equal(petition.game.downfall.petitions,1)
 assert.equal(petition.game.downfall.restored,false)
})
test('fall-of-house dramatic choice creates a playable state rather than a forced ending',()=>{
 const g=game()
 const trial=lifeEvents.find(e=>e.id==='trial-of-the-house')
 assert.equal(trial.choices.length,3)
 const fallen=applyEffect(g,trial.choices[1].effect)
 assert.equal(fallen.standing,'commoner')
 assert.equal(fallen.ending,null)
 assert.equal(fallen.downfall.originalStanding,'noble')
 const spared=applyEffect(g,trial.choices[0].effect)
 assert.equal(spared.standing,'noble')
})
test('noble status persists across normal historical time advancement and boundaries',()=>{
 const g=game(), next=advanceCalendarDays(g,50)
 assert.equal(next.standing,'noble')
 assert.equal(g.date.month,3)
 assert.equal(next.date.month,4)
 assert.ok(next.household.lastSettlement)
})
test('noble backgrounds change opportunities without mutating the original',()=>{
 const {applyBackground}=require('../.test-build/life.js')
 const g=game()
 const academic=applyBackground({...g,player:{...g.player,background:'Scholarly noble house'}})
 assert.equal(academic.culture.scholarship,g.culture.scholarship+12)
 const declining=applyBackground({...g,player:{...g.player,background:'Declining aristocratic house'}})
 assert.equal(declining.stats.wealth,g.stats.wealth-18)
 assert.equal(g.stats.wealth,78)
})
test('custom noble family strengths and inherited burdens have meaningful tradeoffs',()=>{
 const {applyBackground}=require('../.test-build/life.js')
 const g=game()
 const custom=applyBackground({...g,player:{...g.player,background:'Custom noble background',familyFocus:'commerce',familyChallenge:'debt'}})
 assert.equal(custom.stats.wealth,73) // +15 commercial ties -20 inherited debt
 const rival=applyBackground({...g,player:{...g.player,background:'Custom noble background',familyFocus:'politics',familyChallenge:'rivals'}})
 assert.equal(rival.stats.influence,g.stats.influence+8)
 assert.equal(rival.factions.royalist,15)
})
test('royal family can lose and regain the same legal category without instant career restoration',()=>{
 const royal={...game(),standing:'royal',socialStatus:'Royal bloodline'}
 let fallen=acknowledgeDownfall(revokeNobleStatus(royal,'Royal inquiry'))
 assert.equal(fallen.downfall.originalStanding,'royal')
 fallen={...fallen,dayCount:40,downfall:{...fallen.downfall,evidence:24},stats:{...fallen.stats,wealth:55,influence:30}}
 const restored=justiceAction(fallen,'appeal').game
 assert.equal(restored.standing,'royal')
 assert.equal(restored.socialStatus,'Restored royal household')
 assert.equal(restored.appointment,'No official appointment')
})
test('commonly funded ventures may be divested after the fall but not expanded',()=>{
 const g=game()
 const venture=householdAction(g,'invest').game
 const fallen=acknowledgeDownfall(revokeNobleStatus(venture,'Purge'))
 assert.equal(fallen.household.ventures,1)
 assert.equal(householdAction(fallen,'invest'),null)
 assert.ok(householdAction({...fallen,dayCount:fallen.dayCount+1},'divest'))
})
