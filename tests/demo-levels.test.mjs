import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {load,clear as clearCampaign} from './data-centers.test.mjs';
const out=new URL('../outputs/demo-playtest/',import.meta.url);mkdirSync(out,{recursive:true});
export function makeDemo(id,storage){const g=load(undefined,storage);assert(g.demos.start(id));g.check.seed(424242);return g}
export function clearDemo(g,{shortcuts=0,stamp=false,expectedDeaths=0}={}){
 const l=g.check.level(),start=g.frame(),markers=[];let receipt=0;
 const mark=name=>markers.push({name,frame:g.frame()});
 const tap=code=>{g.key(code);g.key(code,false)};
 const tick=()=>{g.check.step();assert(g.frame()-start<12000,'Bounded demo route');assert(['play','won'].includes(g.state().state),l.title+' at '+g.state().player.x+' / '+g.nodes.get('lossReason')?.textContent)};
 const until=p=>{let n=0;while(!p()){tick();assert(++n<3000,'Wait bound in '+l.title)}};
 const walk=x=>{const left=g.state().player.x>x,code=left?'KeyA':'KeyD';g.key(code);until(()=>left?g.state().player.x<=x:g.state().player.x>=x);g.key(code,false)};
 const jumpTo=x=>{tap('Space');walk(x);until(()=>g.state().player.grounded)};
 const jump=(x,end)=>{walk(x);jumpTo(end)};
 for(const [i,b] of l.demoBeats.entries()){
  const x=b.x,p=b.id;
  if(b.kind==='forecast'){
   walk(x+34);assert.equal(g.state().trap[p+'-forecast'].phase,'armed');mark(i+'-locked');walk(x-50);mark(i+'-retreat');until(()=>g.state().trap[p+'-forecast'].phase==='done');tap('KeyX');walk(x-40);jumpTo(x+405);mark(i+'-forecast-crossed');
  }
  if(b.kind==='landing'){jump(x-50,x+80);mark(i+'-safe-landing');jump(x+90,x+280)}
  if(b.kind==='receipt'){
   const fast=!!(shortcuts&(1<<receipt++));
   if(fast){jump(x-190,x-80);mark(i+'-upper-step');jumpTo(x+130);mark(i+'-upper-crossing');walk(x+235);until(()=>g.state().player.grounded)}
   else{walk(x-170);mark(i+'-receipt-wait');until(()=>g.state().trap[p+'-notice'].phase==='done');walk(x+235)}
  }
  if(b.kind==='handoff'){walk(x-65);tap('KeyX');walk(x+255);mark(i+'-midpoint');tap('KeyX');mark(i+'-handoff');walk(x+420)}
  if(b.kind==='recovery'){walk(x+140);until(()=>g.labs.state().caught);mark(i+'-caught');walk(x-10);jumpTo(x-110);tap('KeyX');mark(i+'-repaired');walk(x+390);jumpTo(x+590)}
  if(b.kind==='entry'){walk(x-12);mark(i+'-entry');walk(x+260);mark(i+'-delivery-escaped')}
  if(b.kind==='sky'){walk(x+150);mark(i+'-walked-under')}
  if(b.kind==='scan')jump(x-50,x+140);
  if(b.kind==='timed'){walk(x-55);tap('KeyX');walk(x+260);mark(i+'-timed-crossing')}
  if(b.kind==='stamp'){
   if(stamp){jump(x-40,x+50);mark(i+'-optional-step');jumpTo(x+250);until(()=>g.labs.state().stamp);mark(i+'-stamp')}
   walk(x+390);until(()=>g.state().player.grounded);
  }
 }
 g.key('KeyD');until(()=>g.state().state==='won');g.key('KeyD',false);mark('escaped');
 assert.equal(g.state().deaths,expectedDeaths);assert(g.state().credits.balance>0,'Spare credits in '+l.title);assert.equal(g.api.mode().campaignPractice,true);
 if(l.mastery)assert.equal(g.labs.state().stamp,stamp);
 return {id:l.serverId,title:l.title,shortcuts,stamp,frames:g.frame()-start,events:g.route.map(e=>({...e,frame:e.frame-start})),markers:markers.map(m=>({...m,frame:m.frame-start})),seconds:(g.frame()-start)/120,credits:g.state().credits.balance};
}
if(import.meta.url===new URL(process.argv[1],'file://').href){
 const catalog=load().demos.catalog(),routes=[];assert.equal(catalog.length,8);assert.equal(new Set(catalog.map(l=>l.serverId)).size,8);
 assert.equal(new Set(catalog.flatMap(l=>l.voice)).size,96);assert(catalog.every(l=>l.voice.length>=12&&l.demo&&l.unreliableFlags));
 for(const l of catalog){
  const choices=l.demoBeats.filter(b=>b.kind==='receipt').length;
  for(let shortcuts=0;shortcuts<2**choices;shortcuts++)for(const stamp of l.mastery?[false,true]:[false]){
   const g=makeDemo(l.serverId),r=clearDemo(g,{shortcuts,stamp});routes.push(r);console.log('CLEAR',l.title,shortcuts,stamp,r.seconds.toFixed(2)+'s',r.credits+' spare');
   g.nodes.get('labRetry').onclick();assert.equal(g.check.level().serverId,l.serverId);assert.equal(g.state().state,'play');assert.equal(g.state().attempt,2);
  }
 }
 writeFileSync(new URL('routes.json',out),JSON.stringify(routes,null,2)+'\n');
 const tap=(g,c)=>{g.key(c);g.key(c,false)},walk=(g,x)=>{g.key('KeyD');for(let i=0;i<3000&&g.state().player.x<x&&g.state().state==='play';i++)g.check.step();g.key('KeyD',false)},waitForDeath=g=>{for(let i=0;i<1000&&g.state().state==='play';i++)g.check.step();assert.equal(g.state().state,'dead')};
 const still=makeDemo('demo-do-not-move');walk(still,380);waitForDeath(still);assert.match(still.nodes.get('lossReason').textContent,/ground/);for(let i=0;i<240;i++)still.check.step();tap(still,'Enter');tap(still,'Enter');assert.equal(still.labs.recall().flags.length,1);
 const panic=makeDemo('demo-safe-landing');walk(panic,290);tap(panic,'Space');panic.key('KeyD');waitForDeath(panic);panic.key('KeyD',false);assert.match(panic.nodes.get('lossReason').textContent,/ground/);
 const rush=makeDemo('demo-express-checkout');rush.key('KeyD');waitForDeath(rush);assert.match(rush.nodes.get('lossReason').textContent,/notice/);
 const high=makeDemo('demo-memory-not-found');walk(high,300);tap(high,'Space');high.key('KeyD');waitForDeath(high);assert.equal(high.voice.last().family,'air-scan');
 // A real entry capture requires leaving its locked target, rather than repeating the previous safe wait.
 const personal=makeDemo('demo-safe-landing'),r=routes.find(r=>r.id==='demo-safe-landing'&&!r.shortcuts),stop=r.markers.find(m=>m.name==='3-entry').frame;let at=0;
 for(let f=0;f<=stop;f++){while(at<r.events.length&&r.events[at].frame===f){const e=r.events[at++];personal.key(e.code,e.down)}if(f<stop)personal.check.step()}
 personal.key('KeyD',false);personal.check.step();const locked=personal.state().trap['demo-safe-landing-3-entry'].x;assert(Number.isFinite(locked));waitForDeath(personal);assert.match(personal.nodes.get('lossReason').textContent,/notice/);
 // Every demo recovers from exhausting action credits without losing its identity or softlocking.
 for(const l of catalog){const g=makeDemo(l.serverId);for(let i=0;i<5000&&g.state().state==='play';i++){if(g.state().player.grounded)tap(g,'Space');g.check.step()}assert.equal(g.state().state,'compacting');for(let i=0;i<1800;i++)g.check.step();assert.equal(g.state().player.x,55);clearDemo(g)}
 const storage=new Map(),campaign=load(undefined,storage);campaign.api.start('localhost-01');clearCampaign(campaign);const progress=storage.get('exception-data-centers-v1'),bank=storage.get('exception-credit-records-v1');
 for(const l of catalog){const g=makeDemo(l.serverId,storage);clearDemo(g);assert.equal(storage.get('exception-data-centers-v1'),progress);assert.equal(storage.get('exception-credit-records-v1'),bank)}
 for(const [i,l] of catalog.entries()){const g=makeDemo(l.serverId);assert.equal(g.demos.next(),false);clearDemo(g);assert.equal(g.demos.next(),true);if(i<7)assert.equal(g.check.level().serverId,catalog[i+1].serverId);else assert.equal(g.nodes.get('campaignMenu').hidden,false)}
 writeFileSync(new URL('results.json',out),JSON.stringify({episodes:8,ordinaryInputRoutes:routes.length,zeroDeathClears:true,allShortcutAndStampCombinations:true,spareCredits:true,naiveFailures:['stand-still','panic-jump','rush-receipt','jump-air-field','wait-in-personal-delivery'],firstDeathFlag:true,sameDemoRetry:true,nextDemoAndFinalPlaylist:true,creditRewindRecoveries:8,existingCampaignAndRewardsPreserved:true,uniqueBackgroundLines:96},null,2)+'\n');
 console.log('PASS: eight authored demos, all alternate routes, actual naive failures, learned flag, retry/next playlist, credit recoveries and saved campaign isolation.');
}
