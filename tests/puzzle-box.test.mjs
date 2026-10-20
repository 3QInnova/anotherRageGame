import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {load} from './data-centers.test.mjs';
import {key,press,tick,walk} from './thermal-support.test.mjs';
const root=new URL('../',import.meta.url),html=readFileSync(new URL('initalDemoDocs/Exception_Human_Misclassification_V3.html',root),'utf8');
const fixture=html.replace('window.__DATA_CENTER_TEST__={',`window.__DATA_CENTER_TEST__={puzzle:()=>JSON.parse(JSON.stringify(cooling)),boards:()=>PUZZLE_BOARDS,evaluate:puzzleEvaluate,edges:puzzleEdges,pools:()=>PUZZLE_VOICE,shock:()=>nextRemark('puzzle-shock'),box:()=>puzzleBoxOpenId,restart:restartCampaignRun,position(x,y=FLOOR-PH){player.x=x;player.y=y;player.vy=0;player.grounded=true},balance(n){credits.balance=n},`);
export function make(storage=new Map()){const g=load(fixture,storage);g.nodes.get('campaignPuzzleBox').onclick();g.held=new Set();return g}
export function mount(g,s){walk(g,s.x-80);press(g,'Space');key(g,'KeyD');let n=0;while(!g.api.box()){tick(g);assert(++n<300)}key(g,'KeyD',false);assert(g.state().player.grounded);assert.equal(g.state().player.y+34,s.y)}
export function setInputs(g,bits){const s=g.api.puzzle().find(s=>s.id===g.api.box());for(let i=0;i<bits.length;i++)if(s.bits[i]!==!!bits[i])press(g,'Digit'+(i+1))}
export const answers=[[1,0,1],[1,0,1,0],[0,1,1,0,0]];
export function clearPuzzle(g,{chased=false}={}){
 if(chased)tick(g,2640);
 for(const [i,s] of g.check.level().stations.entries()){
  mount(g,s);const debt=JSON.stringify(g.state().idleCompute.zones),credit=g.state().credits.balance;
  setInputs(g,answers[i]);assert(g.api.puzzle()[i].logic.fan);assert(!g.api.puzzle()[i].logic.ground);press(g,'Enter');
  tick(g,120);assert.equal(g.api.puzzle()[i].phase,'testing');press(g,'Digit1');assert.deepEqual(Array.from(g.api.puzzle()[i].bits,Number),answers[i],'Inputs lock during powered test');
  tick(g,420);assert(g.api.puzzle()[i].solved);assert.equal(g.state().credits.balance,credit);assert.equal(JSON.stringify(g.state().idleCompute.zones),debt);
  press(g,'Escape');assert.equal(g.api.box(),null);
  walk(g,s.x+s.w-42);press(g,'Space');walk(g,s.sink.x+s.sink.w+70);while(!g.state().player.grounded)tick(g);
 }
 walk(g,g.check.level().exit+5);assert.equal(g.state().state,'won');assert.equal(g.state().deaths,0);assert.equal(g.state().credits.balance,4);assert.equal(g.api.progress().cleared.length,0);
 return {seconds:g.frame()/120,deaths:0,credits:4,chased,boxes:3};
}
if(import.meta.url===new URL(process.argv[1],'file://').href){
 const g=make(),boards=g.api.boards(),layouts=[];
 for(const [index,b] of boards.entries()){
  let solutions=0,faults=0;
  for(let mask=0;mask<2**b.count;mask++){
   const bits=Array.from({length:b.count},(_,i)=>!!(mask&(1<<i))),[a,c,d,e,f]=bits;
   const expected=index===0?{fan:(a!==c)&&d,ground:a&&c}:index===1?{fan:(a||c)&&(d!==e),ground:a&&e}:{fan:(a!==c)&&(d||e),ground:(a&&d)||(c&&f)};
   const actual=g.api.evaluate(b,bits);assert.equal(actual.fan,expected.fan);assert.equal(actual.ground,expected.ground);
   if(actual.fan&&!actual.ground)solutions++;if(actual.ground)faults++;
   for(const edge of g.api.edges(b).edges){assert(edge.source in actual.signals);if(!['FAN','DECK'].includes(edge.target)){const target=actual.values.find(v=>v.id===edge.target);assert.equal(target.inputs[edge.pin],edge.source);assert.equal(target[edge.pin?'b':'a'],actual.signals[edge.source])}}
  }
  assert(solutions>0&&faults>0);layouts.push({inputs:b.count,gates:b.gates.length,configurations:2**b.count,solutions,faults});
 }
 const normal=clearPuzzle(g),chased=make(),chase=clearPuzzle(chased,{chased:true});g.api.restart();assert.equal(g.check.level().serverId,'puzzle-box');
 const safe=make(),s=safe.check.level().stations[0];mount(safe,s);setInputs(safe,[1,1,0]);const before=JSON.stringify(safe.state().player),idle=JSON.stringify(safe.state().idleCompute.zones),budget=safe.state().credits.balance;
 tick(safe,12000);assert(safe.api.puzzle()[0].logic.ground);assert.equal(safe.api.puzzle()[0].route.grounded,false);assert.equal(safe.api.puzzle()[0].temperature,1);assert.equal(JSON.stringify(safe.state().player),before);assert.equal(JSON.stringify(safe.state().idleCompute.zones),idle);assert.equal(safe.state().credits.balance,budget);
 safe.api.open();const pause=JSON.stringify(safe.api.puzzle()),world=JSON.stringify(safe.state());tick(safe,1200);press(safe,'Digit1');assert.equal(JSON.stringify(safe.api.puzzle()),pause);assert.equal(JSON.stringify(safe.state()),world);safe.api.close();
 setInputs(safe,[0,0,0]);press(safe,'Enter');tick(safe,180);assert.equal(safe.api.puzzle()[0].phase,'preview');assert.equal(safe.api.puzzle()[0].testCount,1);assert(!safe.api.puzzle()[0].solved);
 setInputs(safe,[1,1,0]);press(safe,'Enter');tick(safe,179);assert.equal(safe.state().state,'play');safe.check.step();assert.equal(safe.state().state,'dead');assert.match(safe.nodes.get('lossReason').textContent,/TEST CIRCUIT/);assert(safe.api.pools()['puzzle-shock'].includes(safe.nodes.get('ovDesc').textContent));for(let i=0;i<1200;i++)safe.check.step();assert.equal(safe.state().state,'dead');press(safe,'Enter');press(safe,'Enter');assert.equal(safe.state().state,'play');assert.equal(safe.api.box(),null);
 const reset=make();mount(reset,s);setInputs(reset,[1,0,0]);reset.nodes.get('puzzleBoxClose').onclick();tick(reset,1200);assert.equal(reset.api.puzzle()[0].resets,1);assert(reset.api.puzzle()[0].bits.every(v=>!v));assert.equal(reset.api.puzzle()[0].temperature,1);assert(!reset.api.box());
 const burns=make();assert.throws(()=>walk(burns,s.sink.x+10),/THERMAL FAILURE/);
 const voices=Object.values(g.api.pools()).flat();assert.equal(voices.length,76);assert.equal(new Set(voices).size,76);const storage=new Map(),speaker=make(storage),cycle=Array.from({length:30},()=>speaker.api.shock());assert.equal(new Set(cycle).size,30);assert.equal(make(storage).api.shock(),cycle[0]);
 const rewind=make();rewind.api.position(2300);rewind.api.balance(1);press(rewind,'Space');rewind.check.step();assert.equal(rewind.state().state,'compacting');for(let i=0;i<1800;i++)rewind.check.step();assert.equal(rewind.state().state,'play');assert(rewind.api.puzzle().every(s=>!s.solved));assert(!rewind.api.box());
 const out=new URL('outputs/puzzle-box/',root);mkdirSync(out,{recursive:true});writeFileSync(new URL('route.json',out),JSON.stringify({frames:chased.frame(),events:chased.route},null,2)+'\n');writeFileSync(new URL('results.json',out),JSON.stringify({normal,chased:chase,layouts,independentLogicAndWireOracle:true,previewCannotShockOrCool:true,previewHoldsPlayer:true,editingAndTestingFree:true,idleAndDeletionFrozen:true,pauseFreezes:true,inputsLockDuringTest:true,incorrectSafeTestReturnsToPreview:true,deliberateGroundTestElectrocutes:true,shockDelaySeconds:1.5,readingPausePreserved:true,windAndFallReset:true,hotSinksBurn:true,creditRewind:true,sameLevelRestart:true,practiceIsolated:true,voiceLines:76,shockLines:30},null,2)+'\n');
 console.log('PASS: Puzzle Box 3/4/5 inputs, all 56 configurations, literal wire oracle, normal/chased clears, safe preview, held player, explicit tests/faults, pause, reset, credits, 76 remarks and practice isolation.');
}
