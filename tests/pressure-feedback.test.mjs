import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {load} from './data-centers.test.mjs';
const source=readFileSync(new URL('../initalDemoDocs/Exception_Human_Misclassification_V3.html',import.meta.url),'utf8').replace('window.__DATA_CENTER_TEST__={',`window.__DATA_CENTER_TEST__={
 pressure:aiPressureFeedback,paper:pressurePaperView,constants:()=>window.__PRESSURE_TEST__.constants(),presence:()=>presence,
 segments:()=>pressureFloorSegments(platformList()),pools:()=>PRESSURE_PAPER_REMARKS,remark:()=>nextRemark('pressure-recovered'),
 position(x){player.x=x;player.y=FLOOR-PH;player.vy=0;player.grounded=true},balance(n){credits.balance=n},
 `);
const step=(g,n)=>{for(let i=0;i<n;i++)g.check.step()};
const creep=(g,from,to)=>{for(let i=from;i<to;i++){g.key('KeyD',i%120<2);step(g,1)}g.key('KeyD',false)};
const lab=load(source);lab.nodes.get('campaignCommitmentTrial').onclick();
assert.equal(lab.api.pressure().stage,'calm');assert.equal(lab.api.pressure().color,'#4c9c80');assert.equal(lab.api.paper().paperStage,'quiet');
creep(lab,0,800);assert.equal(lab.api.paper().paperStage,'notice');
creep(lab,800,1700);assert.equal(lab.api.paper().paperStage,'urging');
assert.equal(lab.state().state,'play','Fourteen seconds of creeping no longer opens a cleanup countdown');
creep(lab,1700,1950);
assert.equal(lab.api.paper().paperStage,'eviction');assert.match(lab.api.paper().headline,/CLEANUP IN/);
assert.equal(lab.api.pressure().countdown,lab.api.presence().warning,'The slip displays the real cleanup warning clock');
assert.equal(lab.api.pressure().color,'#b18b42','Urgent idle pressure stays amber, not red');assert.equal(lab.api.constants().presenceWarning,6);
assert(lab.api.paper().washAlpha>0&&lab.api.paper().washAlpha<=.035,'Background tint stays subtle');
lab.api.open();const frozen=JSON.stringify(lab.api.paper());step(lab,600);assert.equal(JSON.stringify(lab.api.paper()),frozen);lab.api.close();
const beforeDraw=JSON.stringify([lab.state(),lab.api.paper()]);for(let i=0;i<5;i++)lab.check.draw();assert.equal(JSON.stringify([lab.state(),lab.api.paper()]),beforeDraw,'Rendering cannot advance pressure or physics');
lab.key('KeyD');step(lab,133);lab.key('KeyD',false);assert.equal(lab.api.paper().paperStage,'recovered');assert.equal(lab.api.paper().headline,'EVICTION POSTPONED');assert.equal(lab.api.pressure().countdown,null);
lab.key('KeyR');lab.key('KeyR',false);assert.equal(lab.api.paper().heat,0);assert.equal(lab.api.paper().recovery,0,'Retry clears cosmetic eviction history');
const idle=load(source);idle.api.start('localhost-15',true);assert.equal(idle.api.constants().idleGrace,16);assert.equal(idle.api.constants().idleWarning,6);
step(idle,960);assert.equal(idle.api.pressure().stage,'watching');step(idle,840);assert.equal(idle.state().idleCompute.phase,'monitoring');step(idle,120);
assert.equal(idle.api.pressure().consequence,'cleanup');assert.equal(idle.api.pressure().countdown,idle.state().idleCompute.zones[0].warning);assert.match(idle.api.paper().headline,/CLEANUP IN/);
idle.key('KeyD');step(idle,90);idle.key('KeyD',false);assert.equal(idle.api.paper().paperStage,'eviction','A run must not falsely cancel committed cleanup');assert.equal(idle.api.paper().recovery,0);
step(idle,630);assert.equal(idle.api.paper().headline,'CLEANUP IN PROGRESS');assert.equal(idle.api.pressure().countdown,null);
// Actual armed forecast waits hide the paper and preserve its animation clock.
idle.api.position(300);step(idle,1);assert(idle.state().idleCompute.waiting);assert.equal(idle.api.paper().paperStage,'safe');assert.equal(idle.api.paper().washAlpha,0);
const waiting=JSON.stringify(idle.api.paper());step(idle,30);assert.equal(JSON.stringify(idle.api.paper()),waiting);
idle.api.position(2900);step(idle,1);assert.equal(idle.api.paper().paperStage,'safe');assert.equal(idle.api.paper().heat,0);assert.equal(idle.api.paper().recovery,0,'A bay is protected, not a dismissed pending ticket');
// Rendering follows surviving support, excluding authored gaps and protected bays.
lab.key('KeyR');lab.key('KeyR',false);creep(lab,0,1950);lab.api.position(700);lab.check.draw();
const parts=lab.check.platformList();for(const p of lab.api.segments()){
 assert(parts.some(a=>p.x>=a.x&&p.x+p.w<=a.x+a.w));
 assert(!lab.check.level().maintenance.some(b=>p.x<b.end&&p.x+p.w>b.start));
}
idle.api.position(5000);idle.api.balance(1);idle.key('Space');idle.key('Space',false);step(idle,1);assert.equal(idle.state().state,'compacting');const compacting=JSON.stringify(idle.api.paper());step(idle,1799);assert.equal(JSON.stringify(idle.api.paper()),compacting);step(idle,1);assert.equal(idle.api.paper().heat,0);assert.equal(idle.api.paper().unfold,0,'Compaction removes old warning paper');
const voice=load(source,new Map());assert.equal(new Set(Object.values(voice.api.pools()).flat()).size,18);assert.equal(new Set(Array.from({length:6},()=>voice.api.remark())).size,6);
const legacy=load(source);assert.equal(legacy.api.pressure().enabled,false);assert.equal(legacy.api.paper().paperStage,'off','Original rooms do not gain an idle penalty');
console.log('PASS: four paper-warning stages, subtle amber tint, truthful cleanup deadlines, run recovery, pause/wait freeze, gap/bay clipping, retry/compaction reset, 18 rotating remarks and unchanged original-room pressure.');
