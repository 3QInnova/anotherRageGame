import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const html=readFileSync(new URL('../initalDemoDocs/Exception_Human_Misclassification_V3.html',import.meta.url),'utf8').replace('let paywallEnabled=true','let paywallEnabled=false');
const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
function load(storage){
 const nodes=new Map(),events=new Map(),canvas=new Proxy({},{get:()=>()=>{}});
 const element=id=>{if(!nodes.has(id))nodes.set(id,{textContent:'',hidden:false,style:{},classList:{add(){},remove(){}},getContext:()=>canvas,addEventListener(){}});return nodes.get(id)};
 const context={window:{addEventListener(){},localStorage:storage},document:{getElementById:element,querySelectorAll:()=>[],addEventListener:(name,fn)=>events.set(name,fn)},requestAnimationFrame(){},Math};
 vm.runInNewContext(script.replace('initRoom(true);requestAnimationFrame(frame);',`initRoom(true);window.check={step:()=>runFrame(1/120),lose:die,restart:()=>initRoom(true),pools:()=>LOSS_REMARKS,snapshot:()=>({state,freeze,lossRevealDelay,lossSkipPresses,sceneTime,player:{...player},trap:JSON.stringify(trap),deaths:totalDeaths,attempt:attempts[room]})};`),context);
 const game={nodes,check:context.window.check,key:(code,down=true,repeat=false)=>events.get(down?'keydown':'keyup')({code,repeat,preventDefault(){}})};
 game.tap=code=>{game.key(code);game.key(code,false)};return game;
}
function steps(game,n){for(let i=0;i<n;i++)game.check.step()}
function loseNormally(game){game.key('KeyD');for(let i=0;i<600&&game.check.snapshot().state==='play';i++)game.check.step();game.key('KeyD',false);assert.equal(game.check.snapshot().state,'dead')}

const timed=load();loseNormally(timed);
const frozen=timed.check.snapshot(),remark=timed.nodes.get('ovDesc').textContent;
assert(remark.length>40);assert.equal(timed.nodes.get('overlay').hidden,true);assert.equal(timed.nodes.get('lossDetails').hidden,true);
assert.equal(frozen.lossRevealDelay,2);assert.equal(frozen.freeze,15);
timed.tap('Space');timed.tap('Enter');timed.nodes.get('lossContinue').onclick();timed.nodes.get('restart').onclick();assert.equal(timed.check.snapshot().lossSkipPresses,0,'Inputs before the card appears never count');
steps(timed,239);assert.equal(timed.nodes.get('overlay').hidden,true,'Explosion stays unobstructed before two seconds');assert.equal(timed.check.snapshot().freeze,15,'Reading time has not started');
steps(timed,1);assert.equal(timed.nodes.get('overlay').hidden,false);assert.equal(timed.nodes.get('lossDetails').hidden,false);assert.equal(timed.check.snapshot().lossRevealDelay,0);assert.equal(timed.check.snapshot().freeze,15,'Full reading interval starts when the card appears');
steps(timed,1200);assert.equal(timed.check.snapshot().state,'dead','Remark remains visible at ten seconds');
assert.equal(timed.nodes.get('ovDesc').textContent,remark);
assert.equal(timed.check.snapshot().sceneTime,frozen.sceneTime,'World clock pauses while reading');
assert.deepEqual(timed.check.snapshot().player,frozen.player);assert.equal(timed.check.snapshot().trap,frozen.trap);
timed.tap('KeyR');timed.tap('KeyX');timed.tap('ArrowUp');assert.equal(timed.check.snapshot().state,'dead','Gameplay keys cannot overwrite or dismiss the remark');
steps(timed,599);assert.equal(timed.check.snapshot().state,'dead','No retry before the full reading interval');
steps(timed,1);assert.equal(timed.check.snapshot().state,'play','Automatically retries at fifteen seconds');
assert.equal(timed.check.snapshot().deaths,1);assert.equal(timed.check.snapshot().attempt,2);
assert.equal(timed.nodes.get('lossDetails').hidden,true);

const skipped=load();loseNormally(skipped);steps(skipped,240);skipped.key('Space');
assert.equal(skipped.check.snapshot().state,'dead');assert.equal(skipped.check.snapshot().lossSkipPresses,1);
for(let i=0;i<8;i++)skipped.key('Space',true,true);
skipped.key('Space');assert.equal(skipped.check.snapshot().lossSkipPresses,1,'Held or duplicate keydowns do not count twice');
skipped.key('Space',false);skipped.tap('Enter');assert.equal(skipped.check.snapshot().state,'play');
assert.equal(skipped.check.snapshot().player.jumpBuffer,0,'The second skip is consumed, not turned into a jump');
assert.equal(skipped.check.snapshot().lossSkipPresses,0);

const alreadyHeld=load();alreadyHeld.key('Space');alreadyHeld.check.lose('Missing ground.','redaction-a');
steps(alreadyHeld,240);alreadyHeld.key('Space',true,true);assert.equal(alreadyHeld.check.snapshot().lossSkipPresses,0,'A jump held through death cannot skip');
alreadyHeld.key('Space',false);alreadyHeld.tap('NumpadEnter');assert.equal(alreadyHeld.check.snapshot().state,'dead');alreadyHeld.tap('Space');assert.equal(alreadyHeld.check.snapshot().state,'play');

const touch=load();loseNormally(touch);steps(touch,240);touch.nodes.get('lossContinue').onclick();assert.equal(touch.check.snapshot().state,'dead');
touch.nodes.get('lossContinue').onclick();assert.equal(touch.check.snapshot().state,'play');
loseNormally(touch);steps(touch,240);touch.nodes.get('restart').onclick();assert.equal(touch.check.snapshot().state,'dead','Retry button also requires two acknowledgments while reading');
touch.nodes.get('restart').onclick();assert.equal(touch.check.snapshot().state,'play');

const variety=load(),pools=variety.check.pools(),all=Object.values(pools).flat();
assert.equal(new Set(all).size,all.length,'Every authored remark is distinct');
for(const [category,id] of Object.entries({fall:'missing-support',redaction:'redaction-a','air-scan':'flag-air',bridge:'null-b',recovery:'missing-recovery',deadline:'timeout',unknown:'review',scan:'flag-a',policy:'policy-c',forecast:'predict-predict-c',wall:'wall-2',secret:'secret-0-0'})){
 assert(pools[category].length>=30,`${category} retains a substantial library`);
 const remarks=new Set();let first;
 for(let i=0;i<pools[category].length;i++){variety.check.lose('Cause stays readable.',id,category);const text=variety.nodes.get('ovDesc').textContent;first??=text;assert(!remarks.has(text),'No repeat before exhausting this hazard library');remarks.add(text);assert(variety.nodes.get('lossReason').textContent.length>20,'The actual cause remains separately readable');steps(variety,240);variety.tap('Enter');variety.tap('Enter')}
 variety.check.lose('Cause stays readable.',id,category);assert.equal(variety.nodes.get('ovDesc').textContent,first,'A completed cycle wraps safely');steps(variety,240);variety.tap('Enter');variety.tap('Enter');
}
const stored=new Map(),storage={getItem:key=>stored.get(key)||null,setItem:(key,value)=>stored.set(key,value)};
const replay=load(storage);replay.check.lose('Cause.','redaction-a');const first=replay.nodes.get('ovDesc').textContent;
replay.check.restart();replay.check.lose('Cause.','redaction-a');const second=replay.nodes.get('ovDesc').textContent;assert.notEqual(second,first,'A new run keeps the next remark');
const reloaded=load(storage);reloaded.check.lose('Cause.','redaction-a');assert(![first,second].includes(reloaded.nodes.get('ovDesc').textContent),'A reload retains the cursor when storage is available');
for(const broken of [{getItem(){throw Error('Storage blocked')},setItem(){throw Error('Storage blocked')}},{getItem:()=>'{bad json',setItem(){}},{getItem:()=>JSON.stringify({fall:-1,scan:'bad',wall:1e100}),setItem(){}}]){
 const fallback=load(broken);fallback.check.lose('Cause.','redaction-a');assert(fallback.nodes.get('ovDesc').textContent.length>0,'Denied or malformed storage falls back safely');
}
console.log('PASS: unobstructed two-second byte intro, guarded early input, full 15-second reading interval, frozen gameplay, automatic retry, two distinct skip presses, held-key guard, touch/retry acknowledgments and hazard-specific remark rotation.');
console.log(`PASS: ${all.length} unique remarks; full cycles without repetition, new-run/reload continuity and denied/corrupt storage fallback.`);
