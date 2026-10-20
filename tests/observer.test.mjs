import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import vm from 'node:vm';
const html=readFileSync(new URL('../initalDemoDocs/Exception_Human_Misclassification_V3.html',import.meta.url),'utf8').replace('let paywallEnabled=true','let paywallEnabled=false');
const route=JSON.parse(readFileSync(new URL('../outputs/forecast-feedback/completion-route.json',import.meta.url)));
function load(storage){
 const elements=new Map(),events=new Map();
 const el=id=>{if(!elements.has(id))elements.set(id,{textContent:'',style:{},dataset:{},classList:{add(){},remove(){}},getContext:()=>new Proxy({},{get:()=>()=>{}}),addEventListener(){}});return elements.get(id)};
 const context={window:{localStorage:storage,addEventListener(){}},document:{getElementById:el,querySelectorAll:()=>[],addEventListener:(type,fn)=>events.set(type,fn)},requestAnimationFrame(){},Math};
 const hooks=`window.check={step:()=>runFrame(1/120),pools:OBSERVER_REMARKS,remark:nextRemark,restart:()=>initRoom(true),retry:()=>initRoom(),lose:()=>die('fixture','flag-fixture'),fixture:(index,x)=>{room=index;initRoom();player.x=x;advisory.suggestions=[];for(const h of [...L.crumble,...L.spikes,...L.blocks])trap[h.id].phase='done'},response:()=>({...observer}),labels:()=>{draw();return $('observerResponse').textContent}};`;
 vm.runInNewContext(html.match(/<script>([\s\S]*?)<\/script>/)[1].replace('initRoom(true);requestAnimationFrame(frame);',`initRoom(true);compactSeed=424242;resetCompactWatch();${hooks}`),context);
 return {check:context.window.check,state:context.window.__EXCEPTION_TEST__.getState,key(code,down=true){events.get(down?'keydown':'keyup')({code,repeat:false,preventDefault(){}})}};
}
const saved=new Map(),storage={getItem:k=>saved.get(k)||null,setItem:(k,v)=>saved.set(k,v)};
const game=load(storage),stages=new Set([0]);
function step(n){for(let i=0;i<n;i++){game.check.step();stages.add(game.state().observer.stage)}}
for(const event of route){for(let n=0;n<2400&&game.state().room<event.room;n++)step(1);assert.equal(game.state().room,event.room);const delta=event.frame-Math.round(game.state().roomElapsed*120);assert(delta>=0);step(delta);if(event.code)game.key(event.code,event.down)}
step(2400);const result=game.state();assert.equal(result.state,'won');assert.equal(result.deaths,0);assert(result.observer.forecastMisses>=6,'Original forecasts and four new long-room forecasts produce real survival reactions');assert.equal(result.observer.stage,5);assert.equal(result.observer.lastEvent,'escape');assert.equal(stages.size,6,'Ordinary completion visits all six stages');
const finalScore=result.observer.score;game.key('KeyX');step(5);assert.equal(game.state().observer.score,finalScore,'Winning cannot be erased by input');
game.check.retry();assert.equal(game.state().observer.score,finalScore,'Retry preserves composure');game.check.lose();step(100);assert.equal(game.state().observer.score,finalScore,'Loss never adds successful counterplay');
game.check.restart();assert.equal(game.state().observer.score,0);assert.equal(game.state().observer.forecastMisses,0);
game.check.fixture(1,340);for(let i=0;i<2;i++){game.key('KeyX');game.key('KeyX',false)}assert.equal(game.state().observer.score,0,'Rewrite presses alone do not imply successful crossing');
game.key('KeyD');for(let i=0;i<150;i++)game.check.step();game.key('KeyD',false);assert.equal(game.state().observer.lastEvent,'rewrite');assert.equal(game.state().observer.score,1,'A completed rewritten bridge crossing earns one response');for(let i=0;i<20;i++)game.check.step();assert.equal(game.state().observer.score,1,'Remaining across a bridge does not repeat the event');
const all=Object.values(game.check.pools).flat();assert.equal(all.length,80);assert.equal(new Set(all).size,80);
for(const [key,pool] of Object.entries(game.check.pools)){const lines=new Set();for(let i=0;i<pool.length;i++)lines.add(game.check.remark(key));assert.equal(lines.size,pool.length)}
const first=game.check.remark('observer-2');const reloaded=load(storage);assert.notEqual(reloaded.check.remark('observer-2'),first,'Response cursors survive reload');
const denied=load({getItem(){throw Error('denied')},setItem(){throw Error('denied')}});assert.notEqual(denied.check.remark('observer-0'),denied.check.remark('observer-0'));
writeFileSync(new URL('../outputs/observer/runtime-results.json',import.meta.url),JSON.stringify({result,stagesVisited:[...stages],additionalRemarks:all.length},null,2)+'\n');
console.log('PASS: ordinary zero-death route visits six stages and records survived forecasts from the expanded campaign; success stays earned.');
console.log('PASS: actual bridge crossing triggers once, X spam and losses add no success, retries preserve composure, new run resets it, 80 unique responses rotate and persist with safe storage fallback.');
