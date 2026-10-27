import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {load,clear as clearCampaign} from './data-centers.test.mjs';
const root=new URL('../',import.meta.url),out=new URL('outputs/rage-labs/',root);mkdirSync(out,{recursive:true});
export function make(id){const g=load();assert(g.labs.start(id));g.check.seed(424242);return g}
export function clearLab(g,{early=false,stamp=false}={}){
 const id=g.check.level().serverId,start=g.frame(),markers=[],progressBefore=JSON.stringify(g.api.progress());
 const mark=name=>markers.push({name,frame:g.frame()});
 const key=(code,down=true)=>g.key(code,down),tap=code=>{key(code);key(code,false)};
 function tick(){g.check.step();assert(g.frame()-start<12000,'Bounded lab route');assert(['play','won'].includes(g.state().state),id+' at '+g.state().player.x+' / '+g.nodes.get('lossReason')?.textContent)}
 function until(p){let n=0;while(!p()){tick();assert(++n<3000,'Wait bound: '+id)}}
 function walk(x){const left=g.state().player.x>x;key(left?'KeyA':'KeyD');until(()=>left?g.state().player.x<=x:g.state().player.x>=x);key(left?'KeyA':'KeyD',false)}
 function jumpTo(x){tap('Space');const left=g.state().player.x>x;key(left?'KeyA':'KeyD');until(()=>left?g.state().player.x<=x:g.state().player.x>=x);key(left?'KeyA':'KeyD',false);until(()=>g.state().player.grounded)}
 function jumpAcross(x,end){walk(x);jumpTo(end)}
 function finish(){key('KeyD');until(()=>g.state().state==='won');key('KeyD',false);mark('complete')}
 function forecast(){walk(380);mark('locked');walk(300);mark('retreat');until(()=>g.state().trap[g.check.level().forecasts[0].id].phase==='done');tap('KeyX');walk(310);jumpTo(755);mark('forecast-crossed')}
 if(id==='lab-forecast-commitment'){forecast();jumpAcross(850,1040);finish()}
 if(id==='lab-landing-review'){jumpAcross(320,450);mark('safe-landing');jumpAcross(460,650);jumpAcross(790,980);finish()}
 if(id==='lab-cancellation-receipt'){
  if(early){jumpAcross(290,400);mark('upper-step');jumpTo(610);mark('upper-crossing');walk(710)}
  else{walk(310);mark('cautious-wait');until(()=>g.state().trap['lab-cancel-notice'].phase==='done')}
  finish();assert.equal(g.labs.state().earlyCrossing,early);
 }
 if(id==='lab-rewrite-handoff'){
  walk(255);tap('KeyX');walk(575);mark('midpoint');tap('KeyX');mark('handoff');walk(740);jumpAcross(800,990);finish();
 }
 if(id==='lab-autosave-betrayal'){
  walk(500);until(()=>g.labs.state().caught);mark('caught');walk(350);jumpTo(250);tap('KeyX');mark('repaired');walk(750);jumpTo(950);finish();
 }
 if(id==='lab-confidence-review'){
  forecast();walk(945);tap('KeyX');walk(1280);mark('passage');jumpAcross(1510,1640);mark('safe-landing');jumpAcross(1650,1840);finish();
 }
 if(id==='lab-impossible-paperwork'){
  jumpAcross(310,500);walk(585);tap('KeyX');walk(870);
  if(stamp){jumpAcross(860,950);mark('optional-step');jumpTo(1150);until(()=>g.labs.state().stamp);mark('stamp');walk(1270)}
  else{walk(980);until(()=>g.state().trap['lab-paperwork-forecast'].phase==='done');walk(1240)}
  finish();assert.equal(g.labs.state().stamp,stamp);
 }
 if(id==='lab-almost-admitting-it'){
  jumpAcross(290,480);mark('scan-success');walk(605);tap('KeyX');walk(920);mark('rewrite-success');walk(1100);until(()=>g.state().trap['lab-admit-forecast'].phase==='done');mark('forecast-success');finish();
 }
 if(id==='lab-unreliable-recall'){
  forecast();
  jumpAcross(920,1050);mark('first-safe-landing');jumpAcross(1060,1250);
  if(early){jumpAcross(1240,1350);mark('upper-step');jumpTo(1560);mark('upper-crossing');walk(1660)}
  else{walk(1260);mark('cautious-wait');until(()=>g.state().trap['recall-receipt'].phase==='done')}
  walk(1735);tap('KeyX');walk(2055);mark('midpoint');tap('KeyX');mark('handoff');walk(2220);
  walk(2720);until(()=>g.labs.state().caught);mark('caught');walk(2570);jumpTo(2470);tap('KeyX');mark('repaired');walk(2970);jumpTo(3170);
  walk(3530);mark('second-locked');walk(3450);mark('second-retreat');until(()=>g.state().trap['recall-last-forecast'].phase==='done');tap('KeyX');walk(3460);jumpTo(3905);mark('second-crossed');
  if(stamp){jumpAcross(3890,3985);mark('optional-step');jumpTo(4180);until(()=>g.labs.state().stamp);mark('stamp');walk(4080);until(()=>g.state().player.grounded);walk(4060);until(()=>g.state().player.grounded)}
  jumpAcross(4250,4380);mark('last-safe-landing');jumpAcross(4390,4580);finish();
  assert.equal(g.labs.state().earlyCrossing,early);assert.equal(g.labs.state().stamp,stamp);
 }
 assert.equal(g.state().state,'won',id);assert.equal(g.state().deaths,0,id);assert(g.state().credits.balance>0,id+' has spare action credits');
 assert.equal(JSON.stringify(g.api.progress()),progressBefore);assert.equal(g.api.mode().campaignPractice,true);
 return {id,early,stamp,frames:g.frame(),events:g.route.map(e=>({...e})),markers,seconds:(g.frame()-start)/120,credits:g.state().credits.balance,result:g.labs.state()};
}
if(import.meta.url===new URL(process.argv[1],'file://').href){
 const catalog=load().labs.catalog();assert.equal(catalog.length,9);assert.equal(new Set(catalog.map(l=>l.serverId)).size,9);
 const lines=catalog.flatMap(l=>l.voice);assert.equal(new Set(lines).size,120);assert(catalog.every(l=>l.voice.length>=12));
 const routes=[];
 for(const level of catalog){
  const g=make(level.serverId),result=clearLab(g);routes.push(result);console.log('CLEAR',level.title,result.seconds.toFixed(2)+'s',result.credits+' credits');
  g.key('KeyR');g.key('KeyR',false);assert.equal(g.check.level().serverId,level.serverId);assert.equal(g.state().state,'play');assert.equal(g.labs.state().events.length,0);
 }
 routes.push(clearLab(make('lab-cancellation-receipt'),{early:true}));routes.push(clearLab(make('lab-impossible-paperwork'),{stamp:true}));
 routes.push(clearLab(make('lab-unreliable-recall'),{early:true,stamp:true}));
 routes.push(clearLab(make('lab-unreliable-recall'),{early:true}));routes.push(clearLab(make('lab-unreliable-recall'),{stamp:true}));
 assert(routes.find(r=>r.early).seconds<routes.find(r=>r.id==='lab-cancellation-receipt'&&!r.early).seconds,'Upper route earns a faster crossing');
 writeFileSync(new URL('routes.json',out),JSON.stringify(routes,null,2)+'\n');
 const steps=(g,n)=>{for(let i=0;i<n;i++)g.check.step()},tap=(g,c)=>{g.key(c);g.key(c,false)};
 const until=(g,p,max=3000)=>{for(let i=0;i<max&&!p();i++)g.check.step();assert(p(),'Fixture condition reached')};
 const walk=(g,x)=>{g.key('KeyD');until(g,()=>g.state().player.x>=x||g.state().state!=='play');g.key('KeyD',false)};
 // Counterexamples use the same ordinary controls as the clear routes.
 const wait=make('lab-forecast-commitment');walk(wait,380);const locked=wait.state().trap['lab-forecast'].x;steps(wait,5);assert.equal(wait.state().trap['lab-forecast'].x,locked);until(wait,()=>wait.state().state==='dead');assert.match(wait.nodes.get('lossReason').textContent,/ground/);
 const panic=make('lab-landing-review');walk(panic,320);tap(panic,'Space');panic.key('KeyD');until(panic,()=>panic.state().state==='dead');panic.key('KeyD',false);assert.match(panic.nodes.get('lossReason').textContent,/ground/);
 const rush=make('lab-cancellation-receipt');rush.key('KeyD');until(rush,()=>rush.state().state==='dead');rush.key('KeyD',false);assert.match(rush.nodes.get('lossReason').textContent,/notice/);
 const transfer=make('lab-rewrite-handoff');walk(transfer,255);tap(transfer,'KeyX');walk(transfer,510);tap(transfer,'KeyX');assert.equal(transfer.labs.state().activeRewrite.kind,'wall');until(transfer,()=>transfer.state().state==='dead');
 const expiry=make('lab-rewrite-handoff');walk(expiry,255);tap(expiry,'KeyX');steps(expiry,313);assert(expiry.labs.state().activeRewrite.until<expiry.state().sceneTime);assert(expiry.check.platformList().every(p=>p.x+p.w<=320||p.x>=560),'Expired bridge has no support');
 // All supports have a solid underside and side. These fixtures isolate collision faces.
 const collisionSource=readFileSync(new URL('initalDemoDocs/Exception_Human_Misclassification_V3.html',root),'utf8').replace('window.__RAGE_LAB_TEST__={','window.__RAGE_LAB_TEST__={fixture(x,y,vx,vy){Object.assign(player,{x,y,vx,vy,grounded:false})},');
 const sides=load(collisionSource);sides.labs.start('lab-cancellation-receipt');sides.labs.fixture(330,340,265,0);sides.key('KeyD');steps(sides,8);sides.key('KeyD',false);assert(sides.state().player.x<=336,'Cannot pass through a paper side');
 const ceiling=load(collisionSource);ceiling.labs.start('lab-cancellation-receipt');walk(ceiling,380);tap(ceiling,'Space');steps(ceiling,12);assert(ceiling.state().player.y>=363,'Paper underside stops an upward jump');
 // Real input windows, not one exact release frame.
 for(const release of [438,450,464]){const g=make('lab-landing-review');walk(g,320);tap(g,'Space');walk(g,release);until(g,()=>g.state().player.grounded);assert.equal(g.state().state,'play');assert(g.state().player.x>=424&&g.state().player.x+24<=500)}
 for(const delay of [0,4,8,12]){const g=make('lab-forecast-commitment');walk(g,380);g.key('KeyD');steps(g,delay);g.key('KeyD',false);g.key('KeyA');until(g,()=>g.state().player.x<=300);g.key('KeyA',false);steps(g,180);assert.equal(g.state().state,'play')}
 // Pausing freezes the object-specific timer; required waits do not cause random compaction.
 const pause=make('lab-rewrite-handoff');walk(pause,255);tap(pause,'KeyX');pause.api.open();const frozen=JSON.stringify(pause.state());steps(pause,1200);assert.equal(JSON.stringify(pause.state()),frozen);pause.api.close();
 for(const level of catalog){
  const g=make(level.serverId);while(g.state().state==='play'){tap(g,'Space');steps(g,1);until(g,()=>g.state().state!=='play'||g.state().player.grounded)}
  assert.equal(g.state().state,'compacting');steps(g,1800);assert.equal(g.state().state,'play');assert.equal(g.state().player.x,55);assert.equal(g.labs.state().events.length,0);clearLab(g);
 }
 const storage=new Map(),campaign=load(undefined,storage);campaign.api.start('localhost-01');clearCampaign(campaign);const progress=storage.get('exception-data-centers-v1'),bank=storage.get('exception-credit-records-v1');
 for(const level of catalog){const g=load(undefined,storage);g.labs.start(level.serverId);clearLab(g);assert.equal(storage.get('exception-data-centers-v1'),progress);assert.equal(storage.get('exception-credit-records-v1'),bank)}
 writeFileSync(new URL('results.json',out),JSON.stringify({levels:9,ordinaryInputRoutes:routes.length,combinedBranchCombinations:4,zeroDeathRoutes:true,spareCredits:true,forecastsLocked:true,naiveWaitDies:true,naiveRushDies:true,panicJumpDies:true,earlyTransferDies:true,expirationRemovesSupport:true,solidPaperSidesAndUndersides:true,landingReleaseWindows:3,retreatWindows:4,pauseFreezesRewrite:true,creditExhaustionRecoveries:9,existingCampaignAndCreditRecordsPreserved:true,backgroundLines:120},null,2)+'\n');
 console.log('PASS: nine ordinary-input lab clears, both receipt routes, optional/normal stamp routes, same-lab restart, practice isolation and spare credits.');
 console.log('PASS: failure counterexamples, fixed targets, rewrite expiry/transfer, support collision faces, input timing windows, pause and all nine credit-rewind recoveries.');
}
