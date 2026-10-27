import assert from 'node:assert/strict';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {load} from './data-centers.test.mjs';
import {clearLongCampaign} from './long-campaign-route.mjs';
const out=new URL('../outputs/long-campaign/',import.meta.url);mkdirSync(out,{recursive:true});
const source=readFileSync(new URL('../initalDemoDocs/Exception_Human_Misclassification_V3.html',import.meta.url),'utf8');
export const longSource=source;
export function makeLong(id,storage){const g=load(longSource,storage);assert(g.api.start(id,true));g.check.seed(424242);return g}
if(import.meta.url===new URL(process.argv[1],'file://').href){
 const catalog=load(longSource).api.levels(),routes=[],cautious=[],chased=[];
 assert.equal(catalog.length,20);assert(catalog.every(l=>l.counterplay&&!l.rageLab&&!l.demo&&l.unreliableFlags));
 assert.equal(new Set(catalog.map(l=>l.moveSpeed)).size,20);assert.equal(new Set(catalog.map(l=>JSON.stringify(l.routeBeats))).size,20);
 assert.equal(catalog.reduce((n,l)=>n+l.routeBeats.length,0),905);
 for(const level of catalog){
  const g=makeLong(level.serverId),route=clearLongCampaign(g);routes.push(route);
  assert(Math.abs(route.seconds-level.targetSeconds)<=level.targetSeconds*.1,'Authored target duration '+level.serverId);
  assert(Math.abs(route.seconds-level.benchmarkSeconds)<.01,'Stored benchmark matches actual simulation');
  assert.equal(g.api.progress().cleared.length,0);assert.deepEqual(JSON.parse(JSON.stringify(g.api.progress().cleared)),[]);
  assert(level.acts.length>=3&&level.acts.length<=5);assert(level.voice.length>=24);
  for(const b of level.betrayals)assert(level.idleCompute.bays.some(bay=>b.x-110>=bay.start&&b.x-75<bay.end),'Repair tag has a permanent protected return bank');
  for(const bay of level.idleCompute.bays){
   assert(!level.pits.some(p=>bay.start<p.x+p.w&&bay.end>p.x),'Rest bays have permanent ground');
   assert(!(level.stations??[]).some(s=>bay.start<s.sink.x+s.sink.w&&bay.end>s.sink.x),'Hot sink is never a maintenance bay');
  }
  if(level.puzzleBoxEncounter)assert(level.returnPoints.every(x=>x<level.stations[0].x-80),'Credit rewind replays the reset puzzle');
  const slow=makeLong(level.serverId),slowRoute=clearLongCampaign(slow,{fast:false});assert(slowRoute.seconds>=route.seconds);cautious.push({id:level.serverId,seconds:slowRoute.seconds,credits:slowRoute.credits});
  const chase=makeLong(level.serverId),chaseRoute=clearLongCampaign(chase,{fast:false,chaseZones:true});
  assert.equal(chaseRoute.cleanupZones,level.idleCompute.zones.length);chased.push({id:level.serverId,seconds:chaseRoute.seconds,cleanupZones:chaseRoute.cleanupZones,credits:chaseRoute.credits});
  console.log('CLEAR',route.id,level.moveSpeed+'px/s',route.seconds.toFixed(2)+'s',level.routeBeats.length+' clusters',route.credits+' spare / '+chaseRoute.cleanupZones+' cleanup stretches');
 }
 assert(routes.slice(0,5).every(r=>r.seconds>=60&&r.seconds<=125));assert(routes.slice(14,19).every(r=>r.seconds>=170&&r.seconds<=190));assert(routes[19].seconds>=295&&routes[19].seconds<=310);
 const fixture=longSource.replace('window.__DATA_CENTER_TEST__={',`window.__DATA_CENTER_TEST__={restart:restartCampaignRun,position(x){player.x=x;player.y=FLOOR-PH;player.vy=0;player.grounded=true},balance(n){credits.balance=n},`);
 const press=(g,k)=>{g.key(k);g.key(k,false)},tick=(g,n=1)=>{for(let i=0;i<n;i++)g.check.step()};
 // One completed bridge must not award crossings of distant, inactive bridges.
 const earned=load(longSource.replace('window.__DATA_CENTER_TEST__={',`window.__DATA_CENTER_TEST__={proofs:()=>[...observerFlags],`));earned.api.start('localhost-01',true);
 const EARNT=Symbol(),advance=earned.check.step;earned.check.step=()=>{advance();if(earned.labs.state().events.some(e=>e.id.startsWith('bridge-')))throw EARNT};assert.throws(()=>clearLongCampaign(earned),e=>e===EARNT);
 const awarded=earned.api.proofs().filter(id=>earned.check.level().anomalies.some(a=>a.id===id));assert.equal(awarded.length,1,'Rewrite success belongs only to the object actually crossed');
 // A natural collision learns a drifting advisory flag, without moving the hazard.
 const recall=makeLong('localhost-01'),geometry=JSON.stringify(recall.check.level());recall.key('KeyD');let n=0;while(recall.check.peek().state==='play'){recall.check.step();assert(++n<1000)}recall.key('KeyD',false);
 assert.equal(recall.labs.recall().known.length,1);tick(recall,1200);assert.equal(recall.state().state,'dead');press(recall,'Enter');assert.equal(recall.state().state,'dead');press(recall,'Enter');assert.equal(recall.labs.recall().flags.length,1);assert(Math.abs(recall.labs.recall().flags[0].offset)>=30);assert.equal(JSON.stringify(recall.check.level()),geometry);
 // Current integrated long 18: the marked chase precedes the protected console.
 const cooling=makeLong('localhost-18'),STOP=Symbol(),step=cooling.check.step;cooling.check.step=()=>{step();if(cooling.puzzle.open())throw STOP};
 assert.throws(()=>clearLongCampaign(cooling),e=>e===STOP);cooling.check.step=step;
 assert(cooling.state().idleCompute.zones.some(z=>z.front!==null),'The marked chase activated before the box');
 const held=JSON.stringify(cooling.state().player),edges=JSON.stringify(cooling.state().idleCompute),budget=cooling.state().credits.balance;tick(cooling,7200);
 assert.equal(JSON.stringify(cooling.state().player),held);assert.equal(JSON.stringify(cooling.state().idleCompute),edges);assert.equal(cooling.state().credits.balance,budget);
 // An unfinished circuit remains a safe preview; TEST alone applies power.
 const box=cooling.puzzle.state()[0];let fault;
 for(let v=0;v<16;v++){const bits=Array.from({length:4},(_,i)=>!!(v&(1<<i)));if(cooling.puzzle.evaluate(box.board,bits).ground){fault=bits;break}}
 for(let i=0;i<4;i++)if(box.bits[i]!==fault[i])press(cooling,'Digit'+(i+1));tick(cooling,240);assert.equal(cooling.state().state,'play');press(cooling,'Enter');cooling.api.open();const frozen=JSON.stringify(cooling.state());tick(cooling,1200);assert.equal(JSON.stringify(cooling.state()),frozen);cooling.api.close();tick(cooling,180);assert.equal(cooling.state().state,'dead');assert.match(cooling.nodes.get('lossReason').textContent,/TEST CIRCUIT/);
 const rewinds=[];
 for(const id of ['localhost-18','localhost-20']){const g=load(fixture);g.api.start(id,true);const l=g.check.level();g.api.position(l.exit-200);g.api.balance(1);press(g,'Space');tick(g);assert.equal(g.state().state,'compacting');tick(g,1800);assert(g.state().player.x<l.stations[0].x-80);assert(!g.puzzle.state()[0].solved);const r=clearLongCampaign(g);assert.equal(g.state().state,'won');assert.equal(g.api.progress().cleared.length,0);g.api.restart();assert.equal(g.check.level().serverId,id);assert.equal(g.state().player.x,l.start);rewinds.push({id,seconds:r.seconds})}
 const archive=load(fixture);assert(archive.api.archive('localhost-18'));assert(archive.check.level().originalLocalhost);assert(!archive.check.level().counterplay);archive.api.restart();assert(archive.check.level().originalLocalhost);assert(archive.api.start('localhost-18',true));assert(archive.check.level().counterplay);
 writeFileSync(new URL('routes.json',out),JSON.stringify(routes,null,2)+'\n');
 writeFileSync(new URL('timing.json',out),JSON.stringify(routes.map(r=>({id:r.id,seconds:r.seconds,frames:r.frames,credits:r.credits})),null,2)+'\n');
 writeFileSync(new URL('runtime-results.json',out),JSON.stringify({playableServers:20,plannedUnchanged:180,authoredClusters:905,uniquePaces:20,cautious,chased,rewinds,recallFromActualDeath:true,protectedLongCoolingConsole:true,liveGroundFault:true,originalShortComparisonRetained:true},null,2)+'\n');
 console.log('PASS: 20 current long routes, duration targets, cautious alternatives, every cleanup stretch, repair safety, unreliable recall, protected cooling/pause/faults, puzzle rewind and original comparisons.');
}
