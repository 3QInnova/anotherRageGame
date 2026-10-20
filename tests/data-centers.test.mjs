import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import vm from 'node:vm';
const root=new URL('../',import.meta.url),html=readFileSync(new URL('initalDemoDocs/Exception_Human_Misclassification_V3.html',root),'utf8');
export function load(source=html,storage=new Map()){
 const nodes=new Map(),events=new Map(),ctx=new Proxy({},{get:()=>()=>{}});
 const el=id=>{if(!nodes.has(id))nodes.set(id,{hidden:true,style:{},classList:{add(){},remove(){}},getContext:()=>ctx,addEventListener(){}});return nodes.get(id)};
 const localStorage={getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v)};
 const c={window:{addEventListener(){},localStorage},document:{getElementById:el,querySelectorAll:()=>[],addEventListener:(t,f)=>events.set(t,f)},localStorage,Math,requestAnimationFrame(){}};
 const boot=`initRoom(true);window.campaignCheck={step:()=>runFrame(1/120),level:()=>L,seed(n){compactSeed=n;resetCompactWatch();paywallSeed=(n^0x5afeb011)>>>0;resetPaywallWatch()},draw,barrier,platformList,points:()=>COMPACT_POINTS[room],compact:()=>startCompaction('review'),die:()=>die('Fixture loss','review')};`;
 vm.runInNewContext(source.match(/<script>([\s\S]*?)<\/script>/)[1].replace('initRoom(true);requestAnimationFrame(frame);',boot),c);
 let frame=0;const route=[],originalStep=c.window.campaignCheck.step;c.window.campaignCheck.step=()=>{frame++;originalStep()};
 const key=(code,down=true)=>{route.push({frame,code,down});events.get(down?'keydown':'keyup')({code,repeat:false,preventDefault(){}})};
 return {api:c.window.__DATA_CENTER_TEST__,puzzle:c.window.__PUZZLE_BOX_TEST__,check:c.window.campaignCheck,state:c.window.__EXCEPTION_TEST__.getState,key,nodes,route,frame:()=>frame};
}
const COMPACT=Symbol(),PAYWALL=Symbol();
export function clear(g,{campaign=false,walkDuty=1,chaseZones=false}={}){
 const startRoom=g.state().room,startId=g.check.level().serverId,held=new Set(),chased=new Set();let ticks=0,compactions=0,paywalls=0;
 const key=(code,down=true)=>{if(down)held.add(code);else held.delete(code);g.key(code,down)};
 function step(){assert(++ticks<100000,'Bounded clear: '+startId);g.check.step();const s=g.state();if(s.state==='compacting')throw COMPACT;if(s.state==='paywall')throw PAYWALL;assert(['play','won'].includes(s.state),startId+' died at '+s.player.x+' / '+g.nodes.get('lossReason')?.textContent)}
 function tick(){
  const s=g.state(),index=s.idleCompute?.zones.findIndex(z=>s.player.x>=z.start&&s.player.x<z.end&&z.phase==='monitoring');
  if(chaseZones&&index>=0&&!chased.has(index)&&s.player.grounded&&!s.idleCompute.waiting){
   chased.add(index);const walking=held.has('KeyD');key('KeyD',false);
   while(g.state().idleCompute.zones[index].phase!=='cleanup')step();
   if(walking)key('KeyD');
  }
  step();
 }
 function walk(x,committed=false){key('KeyD');let held=true;while(g.state().state==='play'&&g.state().room===startRoom&&g.state().player.x<x){if(walkDuty<1&&!committed){const move=ticks%30<30*walkDuty;if(move!==held){key('KeyD',move);held=move}}tick()}key('KeyD',false)}
 while(g.state().state!=='won'&&g.state().room===startRoom){
  try{
   const level=g.check.level(),h=level.encounters.find(h=>g.state().player.x<h.x+h.w+8);
   if(!h){walk(level.exit+5);continue}
   if(h.kind==='puzzle-box'){
    const station=level.stations.find(s=>s.x===h.x);
    walk(station.x-80);key('Space');key('Space',false);key('KeyD');let mounted=0;
    while(!g.puzzle.open()){tick();assert(++mounted<500,'Reach the maintenance deck through real movement')}
    key('KeyD',false);
    const box=g.puzzle.state().find(s=>s.id===g.puzzle.open());
    if(!box.solved){
     let solution=null;
     for(let n=0;n<2**box.board.count;n++){const bits=Array.from({length:box.board.count},(_,i)=>!!(n&(1<<i))),result=g.puzzle.evaluate(box.board,bits);if(result.fan&&!result.ground){solution=bits;break}}
     assert(solution,'Authored circuit needs a safe solution');
     for(let i=0;i<solution.length;i++)if(box.bits[i]!==solution[i]){key('Digit'+(i+1));key('Digit'+(i+1),false)}
     key('Enter');key('Enter',false);let coolingFrames=0;
     while(!g.puzzle.state().find(s=>s.id===box.id).solved){tick();assert(++coolingFrames<600,'The powered fan cools the sink')}
    }
    key('Escape');key('Escape',false);walk(station.x+station.w-42);key('Space');key('Space',false);walk(station.sink.x+station.sink.w+70);while(!g.state().player.grounded)tick();continue;
   }
   if(h.commit){walk(h.trigger-13);walk(h.x+h.w+90,true);continue}
   if(h.sky){walk(h.x+h.w+90);continue}
   if(h.kind==='bridge'||h.kind==='wall'){
    walk(h.x-70);key('KeyX');key('KeyX',false);walk(h.x+h.w+90);continue;
   }
   if(h.kind.includes('drop')||h.kind==='forecast'){
    walk(h.trigger);while(g.state().trap[h.id].phase!=='done')tick();walk(h.x+h.w+90);continue;
   }
   walk(h.x-50);key('Space');key('Space',false);key('KeyD');while(g.state().room===startRoom&&g.state().player.x<h.x+h.w+65)tick();key('KeyD',false);while(g.state().room===startRoom&&!g.state().player.grounded)tick();
  }catch(e){
   key('KeyD',false);
   if(e===PAYWALL){paywalls++;for(let i=0;i<2;i++){key('Enter');key('Enter',false)}continue}
   if(e!==COMPACT)throw e;
   compactions++;const s=g.state();for(let i=0;i<1799;i++)g.check.step();assert.equal(g.state().state,'compacting');assert.equal(g.state().player.x,s.player.x);g.check.step();assert.equal(g.state().state,'play');
  }
 }
 assert.equal(g.state().deaths,0);assert.equal(paywalls,0,'Paywalls are disabled during playtesting');assert(compactions<=2);
 return {server:startId,ticks,compactions,paywalls,seconds:ticks/120,...(chaseZones?{cleanupZones:chased.size}:{})};
}
if(import.meta.url===new URL(process.argv[1],'file://').href){
 const storage=new Map(),g=load(html,storage),catalog=g.api.catalog(),levels=g.api.levels();
 assert.equal(catalog.centers.length,10);assert.equal(catalog.centers.flatMap(c=>c.servers).length,200);assert.equal(levels.length,20);
 assert.equal(new Set(catalog.centers.flatMap(c=>c.servers.map(s=>s.id))).size,200);
 assert(catalog.centers.every(c=>c.servers.length===20&&c.servers.filter(s=>s.role==='incident').length===4));
 assert.equal(levels.filter(l=>l.incident).length,4);assert.equal(levels.filter(l=>l.mcpTool).length,2);
 assert.equal(new Set(levels.map(l=>JSON.stringify(l.encounters.map(h=>[h.kind,h.x,h.w])))).size,20,'Every server has a distinct authored route');
 assert(levels.filter(l=>l.incident).every(l=>l.width>4500));
 assert.equal(new Set(levels.flatMap(l=>l.voice)).size,240);
 assert.equal(new Set(levels.map(l=>l.incidentCard.job)).size,20);
 assert.equal(new Set(levels.flatMap(l=>l.incidentCard.failures)).size,60);
 assert(levels.every(l=>['trouble','notice','remember','counterplay','excuse'].every(k=>l.incidentCard[k]?.length)));
 assert(levels.find(l=>l.serverId==='localhost-06').pits[0].w>2*617/1730*265,'The contractor gap requires Rewrite');
 const contracts=levels.find(l=>l.serverId==='localhost-16').anomalies;
 assert.equal(contracts.length,3);assert(contracts[0].duration>contracts[1].duration&&contracts[1].duration>contracts[2].duration,'Contract deadlines escalate physically');
 const lossStorage=new Map(),loss=load(html,lossStorage);loss.api.start('localhost-01',true);loss.check.die();
 assert.equal(loss.nodes.get('ovDesc').textContent,levels[0].incidentCard.failures[0]);
 for(let i=0;i<1200;i++)loss.check.step();assert.equal(loss.state().state,'dead','Keep the full loss reading interval');
 const lossReload=load(html,lossStorage);lossReload.api.start('localhost-01',true);lossReload.check.die();assert.equal(lossReload.nodes.get('ovDesc').textContent,levels[0].incidentCard.failures[1],'Server loss cursor survives reload');
 const aftermath=load();aftermath.api.start('localhost-01',true);clear(aftermath);
 assert.equal(aftermath.api.receipt().text,levels[0].incidentCard.excuse);assert.match(aftermath.nodes.get('ovDesc').textContent,/AI excuse/);
 const failed=load();failed.api.start('localhost-01',true);failed.check.die();assert.equal(failed.api.receipt(),null,'Deaths never receive an incident-survived receipt');
 assert.equal(g.api.start('cache-01'),false,'Planned servers cannot launch');assert.equal(g.api.start('localhost-02'),false,'Progression is sequential');
 assert(g.api.start('localhost-01'));g.check.seed(424242);
 const results=[];for(let i=0;i<20;i++){assert.equal(g.state().room,i);results.push(clear(g,{campaign:true}));assert.equal(g.api.progress().cleared.length,i+1)}
 assert.equal(g.state().state,'won');assert.equal(g.api.progress().currentServerId,'localhost-20');
 assert.match(g.nodes.get('ovTitle').textContent,/LOCALHOST DISCONNECTED/);
 writeFileSync(new URL('outputs/data-centers/campaign-route.json',root),JSON.stringify({seed:424242,frames:g.frame(),events:g.route},null,2)+'\n');
 const reloaded=load(html,storage);assert.equal(reloaded.api.progress().cleared.length,20);
 assert(reloaded.api.start('localhost-20'));assert.equal(reloaded.state().player.x,55,'Resume starts at the server beginning');
 const practice=load();assert(practice.api.start('localhost-20',true));practice.check.seed(42);clear(practice);assert.equal(practice.api.progress().cleared.length,0,'Practice must not unlock or save campaign clears');
 for(const seed of [1,7,42])for(const level of levels){const p=load();assert(p.api.start(level.serverId,true));p.check.seed(seed);const result=clear(p);results.push({...result,seed});}
 const paused=load();paused.api.start('localhost-01');const before=JSON.stringify(paused.state());paused.api.open();for(let i=0;i<300;i++)paused.check.step();assert.equal(JSON.stringify(paused.state()),before,'Directory pauses desktop gameplay');paused.api.close();
 const blocked=load();blocked.check.die();assert.equal(blocked.api.start('localhost-01'),false,'Directory cannot skip death reading');
 const denied=new Map();denied.get=denied.set=()=>{throw Error('Storage unavailable')};const offline=load(html,denied);assert(offline.api.start('localhost-01'));clear(offline);assert.equal(offline.api.progress().cleared.length,1);
 const malformed=new Map([['exception-data-centers-v1','{"schemaVersion":1,"cleared":"oops","currentServerId":"cache-01"}']]);assert.equal(load(html,malformed).api.progress().cleared.length,0);
 for(const level of levels){
  for(const x of level.returnPoints){
   assert(!level.pits.some(h=>x+24>h.x&&x<h.x+h.w),'Return point is above support');
   assert(!level.encounters.some(h=>!h.sky&&h.kind!=='bridge'&&x+24>h.x&&x<h.x+h.w),'Return point is outside hazards');
  }
 }
 mkdirSync(new URL('outputs/data-centers/',root),{recursive:true});
 writeFileSync(new URL('outputs/data-centers/runtime-results.json',root),JSON.stringify({mappedCenters:10,mappedServers:200,playableServers:20,plannedServers:180,uniqueAuthoredNewBackgroundLines:240,distinctWorkplaceDisasters:20,serverSpecificLossLines:60,escapeExcuses:20,lossReadingPreserved:true,serverLossRotationSurvivesReload:true,contractorGapRequiresRewrite:true,bridgeContractsEscalate:true,incidents:4,mcpIncidents:2,progressionPersists:true,practiceDoesNotUnlock:true,storageDeniedWorks:true,plannedServersCannotLaunch:true,ordinaryInputZeroDeathRoutes:results},null,2)+'\n');
 console.log('PASS: 10 centers / 200 mapped servers, 20 distinct Localhost routes across four seeds, no paywalls, 240 authored lines, sequential saved progress, practice isolation and safe return points.');
}
