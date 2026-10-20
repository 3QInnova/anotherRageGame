import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {load} from './data-centers.test.mjs';
const root=new URL('../',import.meta.url),html=readFileSync(new URL('initalDemoDocs/Exception_Human_Misclassification_V3.html',root),'utf8');
const source=html.replace('window.__DATA_CENTER_TEST__={',`window.__DATA_CENTER_TEST__={restart:restartCampaignRun,creditTotal,advice:()=>advisory,paper:pressurePaperView,
 position(x){player.x=x;player.y=FLOOR-PH;player.vy=0;player.grounded=true},balance(n){credits.balance=n},`);
export function make(storage=new Map()) {const g=load(source,storage);g.nodes.get('campaignGarbageCollection').onclick();return g}
export function tick(g,n=1){for(let i=0;i<n;i++)g.check.step()}
export function walk(g,x){g.key('KeyD');let frames=0;while(g.state().state==='play'&&g.state().player.x<x){tick(g);assert(++frames<6000,'Bounded crossing');assert.notEqual(g.state().state,'dead',g.nodes.get('lossReason')?.textContent)}g.key('KeyD',false)}
export function waitForCleanup(g){let frames=0;while(g.state().idleCompute.phase!=='cleanup'){tick(g);assert.equal(g.state().state,'play');assert(++frames<3000)}return frames}
export function clearDay(g,{chased=false,restFrames=240}={}){
 const level=g.check.level(),stops=[380,2840,5740],edges=[];
 for(let i=0;i<3;i++){
  const zone=level.idleCompute.zones[i],bay=level.idleCompute.bays[i];walk(g,stops[i]);
  if(chased){waitForCleanup(g);assert.equal(g.state().state,'play','Warning expiry leaves player alive');tick(g,120)}
  for(const pit of level.pits.filter(p=>p.x>=zone.start&&p.x<zone.end)){
   walk(g,pit.x-50);g.key('Space');g.key('Space',false);walk(g,pit.x+pit.w+70);
   while(!g.state().player.grounded){tick(g);assert.equal(g.state().state,'play')}
  }
  walk(g,bay.start+140);assert.equal(g.state().idleCompute.phase,'maintenance');
  const before=JSON.stringify(g.state().idleCompute);tick(g,i===0?restFrames:240);assert.equal(JSON.stringify(g.state().idleCompute),before,'Maintenance freezes the retired edge and next allowance');
  edges.push(g.state().idleCompute.zones[i].front);
 }
 walk(g,level.exit+6);assert.equal(g.state().state,'won');assert.equal(g.state().deaths,0);assert.equal(g.state().credits.balance,4);
 return {seconds:g.frame()/120,credits:4,deletedEdges:edges};
}
if(import.meta.url===new URL(process.argv[1],'file://').href){
 const storage=new Map(),g=make(storage),level=g.check.level();
 assert.equal(level.title,'GARBAGE COLLECTION DAY');assert.equal(g.state().practiceMode,true);assert.equal(g.api.mode().campaignPractice,true);
 assert.equal(g.state().credits.balance,9);assert.equal(g.api.levels().length,20);assert.equal(g.api.advice().flags.length,0);assert.equal(g.api.advice().suggestions.length,0);
 const saved=JSON.stringify(g.api.progress()),total=g.api.creditTotal();const ordinary=clearDay(g);
 assert.equal(JSON.stringify(g.api.progress()),saved);assert.equal(g.api.creditTotal(),total,'This lab never banks rewards');
 g.api.restart();assert.equal(g.check.level().serverId,'garbage-collection-day');assert.equal(g.state().player.x,380);assert.equal(g.state().practiceMode,true);
 const chased=make(),chasedResult=clearDay(chased,{chased:true,restFrames:7200});assert(chasedResult.deletedEdges.every((x,i)=>x>level.idleCompute.zones[i].start));
 const parts=chased.check.platformList();for(const [i,front] of chasedResult.deletedEdges.entries())assert(parts.every(p=>p.x+p.w<=level.idleCompute.zones[i].start||p.x>=front),'Deleted floor no longer supports the player');
 const clock=make();tick(clock,1919);assert.equal(clock.state().idleCompute.phase,'monitoring');tick(clock);assert.equal(clock.state().idleCompute.phase,'warning');tick(clock,719);assert.equal(clock.state().idleCompute.phase,'warning');tick(clock);assert.equal(clock.state().idleCompute.phase,'cleanup');assert.equal(clock.state().state,'play');
 clock.api.open();const frozen=JSON.stringify(clock.state());tick(clock,1200);assert.equal(JSON.stringify(clock.state()),frozen);clock.api.close();tick(clock,120);assert.equal(clock.state().state,'play');tick(clock,240);assert.equal(clock.state().state,'dead');assert.match(clock.nodes.get('lossReason').textContent,/cleanup edge caught/);
 const dead=JSON.stringify(clock.state().idleCompute);tick(clock,1200);assert.equal(JSON.stringify(clock.state().idleCompute),dead);for(let i=0;i<2;i++){clock.key('Enter');clock.key('Enter',false)}assert.equal(clock.state().state,'play');assert.equal(clock.check.level().serverId,'garbage-collection-day');assert(clock.state().idleCompute.zones.every(z=>z.front===null));
 const creep=make();for(let i=0;i<4000&&creep.state().state==='play';i++){creep.key('KeyD',i%120<2);tick(creep)}assert.equal(creep.state().state,'dead');assert.match(creep.nodes.get('lossReason').textContent,/cleanup edge caught/);
 const recover=make();tick(recover,600);const debt=recover.state().idleCompute.zones[0].debt;walk(recover,850);assert(recover.state().idleCompute.zones[0].debt<debt,'Useful running reduces accrued idle time');
 const rewind=make();rewind.api.position(7000);rewind.api.balance(1);rewind.key('Space');rewind.key('Space',false);tick(rewind);assert.equal(rewind.state().state,'compacting');tick(rewind,1800);assert.equal(rewind.state().state,'play');assert(level.returnPoints.includes(rewind.state().player.x));assert(rewind.state().idleCompute.zones.every(z=>z.front===null));
 for(const x of level.returnPoints)assert(!level.pits.some(p=>x+24>p.x&&x<p.x+p.w));
 assert(g.api.start('localhost-01',true));assert.equal(g.check.level().serverId,'localhost-01');g.nodes.get('campaignGarbageCollection').onclick();g.api.legacy();assert.equal(g.state().exit,1139);assert.equal(g.state().idleCompute,null);
 const out=new URL('outputs/garbage-collection-day/',root);mkdirSync(out,{recursive:true});writeFileSync(new URL('chased-route.json',out),JSON.stringify({frames:chased.frame(),events:chased.route},null,2)+'\n');
 writeFileSync(new URL('results.json',out),JSON.stringify({name:level.title,ordinary,chased:chasedResult,threeCleanupStretches:true,maintenanceMinuteSafe:true,idleSeconds:16,warningSeconds:6,practiceIsolated:true,retryAndRestart:true,creditCompactionRecovery:true,backgroundRemarks:level.voice.length},null,2)+'\n');
 console.log('PASS: Garbage Collection Day ordinary and three-chase wins, exact 16+6 timing, deletion contact, minute-long rest, pause/loss freeze, slow taps, credit rewind, retry/restart and campaign isolation.');
}
