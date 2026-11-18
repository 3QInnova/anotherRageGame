import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {make,clearLab} from './rage-labs.test.mjs';
const out=new URL('../outputs/unreliable-recall/',import.meta.url);mkdirSync(out,{recursive:true});
const id='lab-unreliable-recall',route=clearLab(make(id)),tap=(g,code)=>{if(code==='Enter')while(g.state().state==='dead'&&g.state().lossRevealDelay>0)g.check.step();g.key(code);g.key(code,false)};
export function replay(g,route,end=route.frames){
 let at=0;
 for(let frame=0;frame<=end;frame++){
  while(at<route.events.length&&route.events[at].frame===frame){const e=route.events[at++];g.key(e.code,e.down)}
  if(frame<end)g.check.step();
 }
}
export function hitReceipt(g){
 const frame=route.markers.find(m=>m.name==='cautious-wait').frame;
 replay(g,route,frame);g.key('KeyD');
 for(let i=0;i<240&&g.state().state==='play';i++)g.check.step();g.key('KeyD',false);
 assert.equal(g.state().state,'dead');assert.match(g.nodes.get('lossReason').textContent,/notice/);
 assert(g.labs.recall().known.some(n=>n.id==='recall-receipt'));
}
if(import.meta.url===new URL(process.argv[1],'file://').href){
 const g=make(id),geometry=JSON.stringify(g.check.level());
 assert.equal(g.labs.recall().known.length,0);assert.equal(g.labs.recall().flags.length,0);
 tap(g,'KeyR');assert.equal(g.labs.recall().flags.length,0,'No flags invented before a death');
 hitReceipt(g);assert.equal(g.state().seen.length,0,'This lab replaces exact learned markers with unreliable AI recall');
 assert.equal(g.labs.recall().flags.length,0,'New memory is deferred until the next attempt');
 g.labs.seedRecall(42);tap(g,'Enter');assert.equal(g.state().state,'dead');tap(g,'Enter');
 assert.equal(g.state().state,'play');assert.equal(g.labs.recall().flags.length,1,'First retry always flags the newly hit obstacle');
 assert(g.labs.recall().flags[0].offset===0||Math.abs(g.labs.recall().flags[0].offset)>=62);
 const stable=JSON.stringify(g.labs.recall());for(let i=0;i<60;i++)g.check.draw();assert.equal(JSON.stringify(g.labs.recall()),stable,'Drawing never rerolls a flag');
 g.api.open();for(let i=0;i<1000;i++)g.check.step();assert.equal(JSON.stringify(g.labs.recall()),stable,'Pause never rerolls recall');g.api.close();
 const samples=[];g.labs.seedRecall(1234);
 for(let i=0;i<128;i++){
  tap(g,'KeyR');const f=g.labs.recall().flags[0];samples.push(f?f.offset:null);
  assert.equal(JSON.stringify(g.check.level()),geometry,'Recall never edits obstacle geometry');
  if(f){assert(f.offset===0||(Math.abs(f.offset)>=62&&Math.abs(f.offset)<112));assert.equal(f.id,'recall-receipt')}
 }
 const forgotten=samples.filter(x=>x===null).length;
 assert(forgotten>10&&forgotten<60);assert(samples.some(x=>x<0));assert(samples.some(x=>x>0));
 assert(new Set(samples.filter(x=>x!==null)).size>20,'Offset magnitude varies rather than alternating fixed positions');
 // All recall outcomes remain cosmetic: complete the same ordinary-input route after a real loss.
 const traces=[];
 for(const seed of [1,42,1234,98765]){
  const retry=make(id);hitReceipt(retry);tap(retry,'Enter');tap(retry,'Enter');retry.labs.seedRecall(seed);tap(retry,'KeyR');
  const before=retry.labs.recall(),trace=[];let at=0;
  for(let f=0;f<=route.frames;f++){
   while(at<route.events.length&&route.events[at].frame===f){const e=route.events[at++];retry.key(e.code,e.down)}
   if(f<route.frames)retry.check.step();
   const s=retry.state();assert.notEqual(s.state,'dead','Seed '+seed+' remains winnable');
   trace.push(JSON.stringify({player:s.player,trap:s.trap,glitch:s.glitch,sceneTime:s.sceneTime,credits:s.credits,state:s.state,compactSeed:s.compactSeed}));
  }
  assert.equal(retry.state().state,'won');assert.equal(retry.state().deaths,1);assert.equal(JSON.stringify(retry.labs.recall()),JSON.stringify(before));traces.push(trace);
  if(seed===1)tap(retry,'KeyR');else retry.nodes.get('labRetry').onclick();
  assert.equal(retry.state().state,'play');assert.equal(retry.labs.recall().known.length,1,'Retry after a win preserves learned hazards, through R and the win button');
 }
 for(const trace of traces.slice(1))assert.deepEqual(trace,traces[0],'Flag seeds have no effect on physics, timing, credit accounting or compaction randomness');
 const accumulated=make(id);accumulated.key('KeyD');
 for(let i=0;i<200&&accumulated.state().player.x<380;i++)accumulated.check.step();accumulated.key('KeyD',false);
 for(let i=0;i<240&&accumulated.state().state==='play';i++)accumulated.check.step();
 assert.equal(accumulated.state().state,'dead');assert.equal(accumulated.labs.recall().known[0].id,'recall-first-strip');tap(accumulated,'Enter');tap(accumulated,'Enter');
 assert.equal(accumulated.labs.recall().flags[0].id,'recall-first-strip');
 hitReceipt(accumulated);assert.equal(accumulated.labs.recall().known.length,2);tap(accumulated,'Enter');tap(accumulated,'Enter');
 assert(accumulated.labs.recall().flags.some(f=>f.id==='recall-receipt'),'A newly learned popup is guaranteed even when another remembered flag is omitted');
 replay(accumulated,route,route.markers.find(m=>m.name==='first-safe-landing').frame);accumulated.key('KeyD',false);accumulated.key('KeyA');
 for(let i=0;i<100&&accumulated.state().state==='play';i++)accumulated.check.step();accumulated.key('KeyA',false);
 assert.equal(accumulated.state().state,'dead');assert.equal(accumulated.labs.recall().known.length,3);tap(accumulated,'Enter');tap(accumulated,'Enter');
 assert(accumulated.labs.recall().flags.some(f=>f.id==='recall-first-scan'));assert.equal(accumulated.state().seen.length,0);
 // Resource compaction preserves knowledge and restarts the authored recoverable route.
 const exhausted=make(id);hitReceipt(exhausted);tap(exhausted,'Enter');tap(exhausted,'Enter');
 for(let i=0;i<5000&&exhausted.state().state==='play';i++){if(exhausted.state().player.grounded)tap(exhausted,'Space');exhausted.check.step()}
 assert.equal(exhausted.state().state,'compacting');for(let i=0;i<1800;i++)exhausted.check.step();
 assert.equal(exhausted.labs.recall().known.length,1);assert.equal(exhausted.state().player.x,55);replay(exhausted,route);assert.equal(exhausted.state().state,'won');
 g.labs.start('lab-forecast-commitment');assert.equal(g.labs.recall(),null,'Other labs retain their original marker rules');
 g.labs.start(id);assert.equal(g.labs.recall().known.length,0,'Choosing a fresh lab run clears recall');
 writeFileSync(new URL('results.json',out),JSON.stringify({firstDeathIsLearned:true,firstRetryGuaranteed:true,independentlyLearnedHazardTypes:['redaction','popup','scan'],sampleAttempts:128,forgotten,accurateDisplayedProbability:.4,wrongDistanceBeyondEdge:[30,80],bothDirections:true,stableWhileReadingAndPaused:true,geometryUnchanged:true,ordinaryInputRecallSeedClears:4,allPhysicsSnapshotsMatch:true,creditRewindPreservesKnowledge:true,newRunClearsKnowledge:true,otherLevelsUnchanged:true},null,2)+'\n');
 console.log('PASS: real popup death, first-retry flag, 128 drifting/forgetting attempts, four identical ordinary-input clears, pause, credit rewind and lab isolation.');
}
