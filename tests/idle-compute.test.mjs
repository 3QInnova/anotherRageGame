import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {load,clear} from './data-centers.test.mjs';
const root=new URL('../',import.meta.url),source=readFileSync(new URL('initalDemoDocs/Exception_Human_Misclassification_V3.html',root),'utf8');
const fixture=source.replace('window.__DATA_CENTER_TEST__={',`window.__DATA_CENTER_TEST__={
 hud:refreshHud,position(x){player.x=x;player.y=FLOOR-PH;player.vy=0;player.grounded=true;player.coyote=.1;player.jumpBuffer=0},
 balance(n){credits.balance=n},remark:()=>nextRemark('idle-loss'),pools:()=>IDLE_COMPUTE_REMARKS,
 `);
const make=(storage=new Map())=>{const g=load(fixture,storage);assert(g.api.start('localhost-15',true));g.check.seed(42);return g};
const tick=(g,n=1)=>{for(let i=0;i<n;i++)g.check.step()};
const press=(g,k)=>{g.key(k);g.key(k,false)};
const idle=g=>g.state().idleCompute;
function walk(g,x){g.key('KeyD');for(let n=0;g.state().player.x<x&&n<10000;n++){tick(g);assert.equal(g.state().state,'play')}g.key('KeyD',false)}
const easy=make();const budget=easy.state().credits.balance;tick(easy,360);assert.equal(idle(easy).phase,'monitoring');assert(idle(easy).zones[0].debt>2.9);assert.equal(easy.state().credits.balance,budget,'Idle compute never spends action credits');
const small=make();tick(small,840);small.key('KeyD');tick(small,4);small.key('KeyD',false);assert(idle(small).zones[0].debt>6,'A tiny burst cannot reset grace');small.key('KeyD');tick(small,90);small.key('KeyD',false);assert(idle(small).zones[0].debt<6.8,'Sustained forward work reduces debt');
const jumping=make();press(jumping,'Space');tick(jumping,110);assert(idle(jumping).zones[0].debt>.9,'Jumping in place does not count as work');
const wiggle=make();for(let i=0;i<90;i++){wiggle.key('KeyD');tick(wiggle);wiggle.key('KeyD',false);wiggle.key('KeyA');tick(wiggle);wiggle.key('KeyA',false);tick(wiggle,28)}assert.equal(idle(wiggle).phase,'cleanup','Old ground cannot be farmed by wiggling');
const creep=make();let creepFrames=0;
while(creep.state().state==='play'&&creepFrames<4800){creep.key('KeyD');tick(creep);creep.key('KeyD',false);tick(creep,59);creepFrames+=60}
assert.equal(creep.state().state,'dead');assert.match(creep.nodes.get('lossReason').textContent,/IDLE COMPUTE/);assert.equal(creep.state().credits.balance,budget,'Creeping loses to cleanup, not credit exhaustion');
const frozenDeath=JSON.stringify(idle(creep));tick(creep,1200);assert.equal(JSON.stringify(idle(creep)),frozenDeath,'Loss reading freezes cleanup');press(creep,'Enter');press(creep,'Enter');assert.equal(creep.state().state,'play');assert(idle(creep).zones.every(z=>z.front===null&&z.debt===0));
const slowRoute=make();assert.throws(()=>clear(slowRoute,{walkDuty:1/8}),/IDLE COMPUTE/,'Even a cautious route that runs through jumps and entry receipts must make faster progress between them');
const warning=make();tick(warning,1920);assert.equal(idle(warning).phase,'warning');const startFront=idle(warning).zones[0].front;tick(warning,719);assert.equal(idle(warning).phase,'warning');assert.equal(idle(warning).zones[0].front,startFront);tick(warning);assert.equal(idle(warning).phase,'cleanup');
// Activate cleanup naturally, then use actual movement/jump/Rewrite controls to finish.
const chased=make();tick(chased,2640);assert.equal(idle(chased).phase,'cleanup');const chasedResult=clear(chased);assert.equal(chased.state().state,'won');assert.equal(chased.state().deaths,0);assert(idle(chased).zones.every(z=>z.phase==='cleared'));assert(chased.state().credits.balance>0);
const paused=make();tick(paused,1100);paused.api.open();const frozen=JSON.stringify(idle(paused));tick(paused,1200);assert.equal(JSON.stringify(idle(paused)),frozen);paused.api.close();tick(paused);assert.notEqual(JSON.stringify(idle(paused)),frozen);
const wait=make();tick(wait,2640);walk(wait,300);tick(wait,2);assert(idle(wait).waiting,'A genuine required forecast wait suspends cleanup');wait.api.hud();assert.equal(wait.nodes.get('idleComputeFill').style.width,'100.0%','The suspended meter retains its visible pressure');const edge=idle(wait).zones[0].front;tick(wait,40);assert.equal(idle(wait).zones[0].front,edge,'Deletion edge also waits');tick(wait,120);assert(!idle(wait).waiting);assert(idle(wait).zones[0].front>edge);
const bay=make(),layout=bay.check.level().idleCompute;bay.api.position(layout.bays[0].start+40);tick(bay);assert.equal(idle(bay).phase,'maintenance');tick(bay,7200);assert.equal(bay.state().state,'play','Maintenance permits an actual minute of rest');assert.equal(idle(bay).zones[1].debt,0);walk(bay,layout.zones[1].start+10);tick(bay,1920);assert.equal(idle(bay).zones[1].phase,'warning','Second stretch independently enforces progress');
const restored=make();tick(restored,2640);restored.api.position(5000);restored.api.balance(1);press(restored,'Space');tick(restored);assert.equal(restored.state().state,'compacting');const beforeRestore=JSON.stringify(idle(restored));tick(restored,1799);assert.equal(JSON.stringify(idle(restored)),beforeRestore);tick(restored);assert.equal(restored.state().state,'play');assert(idle(restored).zones.every(z=>z.front===null&&z.debt===0));clear(restored);
for(const h of make().check.level().blocks.filter(h=>h.commit)){
 const trap=make();trap.api.position(h.trigger-13);tick(trap,600);assert.equal(trap.state().trap[h.id].phase,'idle','Waiting outside cannot spend the trap');
 trap.key('KeyD');tick(trap,2);trap.key('KeyD',false);assert.equal(trap.state().trap[h.id].phase,'armed');const x=trap.state().trap[h.id].x;assert(trap.state().player.x>=x&&trap.state().player.x<x+h.w);assert(!idle(trap).waiting,'Entry receipts are escape decisions, not required waits');tick(trap,110);assert.equal(trap.state().state,'dead','Standing in the locked column loses');
 const escape=make();escape.api.position(h.trigger-13);walk(escape,h.x+h.w+95);tick(escape,200);assert.equal(escape.state().state,'play');assert.equal(escape.state().trap[h.id].phase,'done');
}
const storage=new Map(),voice=make(storage),pools=voice.api.pools();assert.equal(Object.values(pools).flat().length,74);assert.equal(new Set(Object.values(pools).flat()).size,74);const lines=new Set();for(let i=0;i<30;i++)lines.add(voice.api.remark());assert.equal(lines.size,30);const first=voice.api.remark();assert.notEqual(make(storage).api.remark(),first);
const original=load();assert.equal(original.state().idleCompute,null);assert(original.api.levels().every(level=>level.idleCompute),'All first Data Center servers now share idle cleanup');
mkdirSync(new URL('outputs/idle-compute/',root),{recursive:true});writeFileSync(new URL('outputs/idle-compute/chased-route.json',root),JSON.stringify({frames:chased.frame(),events:chased.route},null,2)+'\n');writeFileSync(new URL('outputs/idle-compute/runtime-results.json',root),JSON.stringify({creepDeathSeconds:creepFrames/120,cautiousRouteDeathX:slowRoute.state().player.x,cautiousRouteDeathSeconds:slowRoute.frame()/120,chasedClear:chasedResult,authoredZones:layout,remarks:74,lossRemarks:30,minuteLongMaintenanceRest:true,requiredWaitFreeze:true,creditCompactionRecovery:true,commitmentTraps:2,actionCostsUnchanged:true},null,2)+'\n');
console.log('PASS: brief stops, debt recovery, no tap/wiggle/jump bypass, continuous creeping loses, full ordinary-input escape with active cleanup, two sections and minute-long maintenance rest, pause/death/required-wait freeze, credit rewind recovery, committed receipt escape windows, 74 rotating remarks and preserved original playtest.');
