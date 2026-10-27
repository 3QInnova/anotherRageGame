import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {loadArchived as load,clear} from './archived-campaign-fixture.mjs';
const root=new URL('../',import.meta.url),html=readFileSync(new URL('initalDemoDocs/Exception_Human_Misclassification_V3.html',root),'utf8');
const fixture=html.replace('window.__DATA_CENTER_TEST__={',`window.__DATA_CENTER_TEST__={hud:refreshHud,
 position(x){player.x=x;player.y=FLOOR-PH;player.vy=0;player.grounded=true},balance(n){credits.balance=n},`);
const make=id=>{const g=load(fixture);assert(g.api.start(id,true));return g};
const tick=(g,n)=>{for(let i=0;i<n;i++)g.check.step()};
const levels=load().api.levels(),results=[],routes=[];
assert.equal(levels.length,20);assert(levels.every(l=>l.idleCompute));
for(const level of levels){
 const g=make(level.serverId),layout=g.check.level().idleCompute,budget=g.state().credits.balance;
 assert.equal(layout.zones[0].start,10);assert.equal(layout.bays.at(-1).end,level.width);
 assert.equal(layout.zones.length,layout.bays.length);
 for(let i=0;i<layout.zones.length;i++){
  const z=layout.zones[i],b=layout.bays[i];assert.equal(z.end,b.start);assert(b.end-b.start>=150);
  if(i+1<layout.zones.length)assert.equal(b.end,layout.zones[i+1].start);
  assert(!level.pits.some(h=>b.start<h.x+h.w&&b.end>h.x),'Maintenance is permanent floor');assert(!(level.stations??[]).some(s=>b.start<s.sink.x+s.sink.w&&b.end>s.sink.x),'Maintenance excludes hot heat sinks');
  assert(!level.encounters.some(h=>h.kind!=='puzzle-box'&&b.start<h.x+h.w&&b.end>h.x),'Maintenance is outside authored hazards');
 }
 tick(g,1919);assert.equal(g.state().idleCompute.phase,'monitoring');tick(g,1);assert.equal(g.state().idleCompute.phase,'warning');
 tick(g,720);assert.equal(g.state().idleCompute.phase,'cleanup');assert.equal(g.state().state,'play','Warning starts deletion instead of an instant loss');
 assert.equal(g.state().credits.balance,budget);assert.equal(g.state().compactCounts[g.state().room],0);
 g.api.open();const frozen=JSON.stringify(g.state());tick(g,1200);assert.equal(JSON.stringify(g.state()),frozen);g.api.close();
 tick(g,360);assert.equal(g.state().state,'dead');assert.match(g.nodes.get('lossReason').textContent,/cleanup edge caught/);
 for(let i=0;i<2;i++){g.key('Enter');g.key('Enter',false)}assert.equal(g.state().state,'play');assert(g.state().idleCompute.zones.every(z=>z.front===null&&z.debt===0));
 for(const bay of layout.bays){const rest=make(level.serverId);rest.api.position(bay.start+20);tick(rest,1);assert.equal(rest.state().idleCompute.phase,'maintenance');const before=JSON.stringify(rest.state().idleCompute);tick(rest,7200);assert.equal(rest.state().state,'play');assert.equal(JSON.stringify(rest.state().idleCompute),before)}
 const chased=make(level.serverId),result=clear(chased,{chaseZones:true});
 assert.equal(result.cleanupZones,layout.zones.length,'The ordinary-input route escapes every cleanup stretch');
 assert.equal(chased.state().state,'won');assert(chased.state().credits.balance>0);
 assert.equal(chased.api.progress().cleared.length,0,'Practice cannot unlock servers');
 routes.push({server:level.serverId,frames:chased.frame(),events:chased.route});results.push({...result,bays:layout.bays,remainingCredits:chased.state().credits.balance});
}
// Exercise a wait reached during a live chase in every server with required waits.
for(const level of levels.filter(l=>l.forecasts.length||l.blocks.some(h=>!h.commit))){
 const g=make(level.serverId);tick(g,2640);
 const first=level.encounters[0];
 if(first.kind==='forecast'||first.kind.includes('drop')){
  g.key('KeyD');while(g.state().player.x<first.trigger)tick(g,1);g.key('KeyD',false);tick(g,2);
  assert.equal(g.state().idleCompute.waiting,true);const front=g.state().idleCompute.zones[0].front;tick(g,20);assert.equal(g.state().idleCompute.zones[0].front,front);
 }
}
const original=load();assert.equal(original.state().idleCompute,null);original.api.legacy();assert.equal(original.state().idleCompute,null);
const out=new URL('outputs/localhost-cleanup/',root);mkdirSync(out,{recursive:true});
writeFileSync(new URL('routes.json',out),JSON.stringify(routes,null,2)+'\n');
writeFileSync(new URL('results.json',out),JSON.stringify({servers:20,cleanupStretches:results.reduce((n,r)=>n+r.cleanupZones,0),idleAllowance:16,warningSeconds:6,allWarningsStartLiveDeletion:true,pauseAndRetry:true,maintenanceMinuteSafe:true,requiredWaitFreeze:true,practiceIsolated:true,originalPlaytestPreserved:true,routes:results},null,2)+'\n');
console.log('PASS (archived short Localhost comparison): all 20 Localhost servers, every cleanup stretch escaped through ordinary controls, exact idle/warning timing, deletion contact, pause/retry, safe minute-long maintenance rests, required waits and preserved original playtest.');
