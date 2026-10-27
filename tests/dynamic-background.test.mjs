import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync,writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
const current=readFileSync(new URL('../initalDemoDocs/Exception_Human_Misclassification_V3.html',import.meta.url),'utf8');
const baseline=execFileSync('git',['show','5898920:initalDemoDocs/Exception_Human_Misclassification_V3.html'],{encoding:'utf8'});
function load(html,storage=new Map()){
 const nodes=new Map(),events=new Map(),ctx=new Proxy({},{get:()=>()=>{}}),el=id=>{if(!nodes.has(id))nodes.set(id,{style:{},classList:{add(){},remove(){}},getContext:()=>ctx,addEventListener(){}});return nodes.get(id)};
 let randomCalls=0,randomSeed=17;const math=Object.create(Math);math.random=()=>{randomCalls++;randomSeed=(Math.imul(randomSeed,1664525)+1013904223)>>>0;return randomSeed/4294967296};
 const c={window:{addEventListener(){}},document:{getElementById:el,querySelectorAll:()=>[],addEventListener:(t,f)=>events.set(t,f)},Math:math,crypto:{getRandomValues(a){a[0]=918273;return a}},localStorage:{getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v)},requestAnimationFrame(){}};
 const hook=`initRoom(true);compactSeed=424242;resetCompactWatch();paywallSeed=98765;resetPaywallWatch();window.bgCheck={step:()=>runFrame(1/120),draw,geometry:()=>JSON.stringify(LEVELS),retry:()=>initRoom(),newRun:()=>initRoom(true),die:()=>die('Review loss','review'),ack:acknowledgeLoss,compact:()=>startCompaction('review'),long:()=>startPractice(6),reroll:()=>resetBackdrop('review')};`;
 vm.runInNewContext(html.match(/<script>([\s\S]*?)<\/script>/)[1].replace('initRoom(true);requestAnimationFrame(frame);',hook),c);
 return {check:c.window.bgCheck,state:c.window.__EXCEPTION_TEST__.getState,bg:()=>c.window.__BACKDROP_TEST__?.state(),randomCalls:()=>randomCalls,key:(code,down)=>events.get(down?'keydown':'keyup')({code,repeat:false,preventDefault(){}})};
}
const storage=new Map(),g=load(current,storage),geometry=g.check.geometry(),patterns=new Set();
for(let i=0;i<180;i++){
 const b=g.bg(),signature=JSON.stringify([b.gridX,b.gridY,b.spacing,b.marks,b.guides]);assert(!patterns.has(signature));patterns.add(signature);assert.equal(g.check.geometry(),geometry);g.check.retry();
}
const before=JSON.stringify(g.state()),randomCalls=g.randomCalls();g.check.reroll();g.check.draw();assert.equal(JSON.stringify(g.state()),before);assert.equal(g.randomCalls(),randomCalls,'Backdrop drawing and rerolls do not sample gameplay randomness');
const rev=g.bg().revision;g.check.die();assert(g.bg().revision>rev);assert.equal(g.bg().reason,'loss');for(let i=0;i<240;i++)g.check.step();g.check.ack();g.check.ack();assert.equal(g.state().state,'play');assert.equal(g.bg().reason,'retry');
const offsets=[];for(let i=0;i<3;i++){offsets.push(g.bg().guides[0].offset);g.check.retry();}assert(offsets.includes(0));assert(offsets.some(x=>x>0));assert(offsets.some(x=>x<0));
const last=g.bg();const reload=load(current,storage);assert(reload.bg().revision>last.revision);assert.notEqual(JSON.stringify(reload.bg().marks),JSON.stringify(last.marks));
for(let i=0;i<12;i++){const prev=JSON.stringify(g.bg().marks);g.check.newRun();assert.notEqual(JSON.stringify(g.bg().marks),prev);}
const denied=new Map();denied.get=()=>{throw Error('Storage denied')};denied.set=()=>{throw Error('Storage denied')};const noStorage=load(current,denied);const deniedRev=noStorage.bg().revision;noStorage.check.retry();assert(noStorage.bg().revision>deniedRev);
g.check.long();g.check.compact();const compactRevision=g.bg().revision;for(let i=0;i<1800;i++)g.check.step();assert.equal(g.state().state,'play');assert.equal(g.bg().reason,'compaction');assert(g.bg().revision>compactRevision);assert.equal(g.state().compactCounts[6],1);
const old=load(baseline),fresh=load(current),route=JSON.parse(readFileSync(new URL('../outputs/forecast-feedback/completion-route.json',import.meta.url)));let frames=0;
function step(n){for(let i=0;i<n;i++){old.check.step();fresh.check.step();assert.equal(JSON.stringify(fresh.state()),JSON.stringify(old.state()),'Backdrop changes must leave baseline gameplay and all gameplay random seeds unchanged');frames++;}}
for(const e of route){for(let n=0;n<6000&&old.state().room<e.room;n++)step(1);assert.equal(old.state().room,e.room);const delta=e.frame-Math.round(old.state().roomElapsed*120);assert(delta>=0);step(delta);if(e.code){old.key(e.code,e.down);fresh.key(e.code,e.down)}}step(2400);assert.equal(fresh.state().state,'won');assert.equal(fresh.state().deaths,0);
writeFileSync(new URL('../outputs/dynamic-background/unit-results.json',import.meta.url),JSON.stringify({uniqueRetryPatterns:patterns.size,reloadFresh:true,newRunCompositionsChecked:12,storageUnavailableWorks:true,lossRetryAndCompactionReroll:true,guidesAlternateAccurateAheadBehind:true,geometryUnchanged:true,independentCosmeticRandomness:true,baselineCommit:'5898920',baselineGameplaySnapshotsCompared:frames,allFifteenRoomsCleared:true,deaths:0},null,2)+'\n');console.log('PASS:',patterns.size,'unique backdrops, fresh reload, loss/retry/compaction changes, honest/deceptive guides and',frames,'baseline-identical gameplay snapshots across fifteen rooms.');
