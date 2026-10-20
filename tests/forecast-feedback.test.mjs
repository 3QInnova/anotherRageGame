import assert from 'node:assert/strict';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import vm from 'node:vm';

const html = readFileSync(new URL('../initalDemoDocs/Exception_Human_Misclassification_V3.html', import.meta.url), 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
const instrumentation = `window.__CHECK__={
 step:()=>{runFrame(1/120);draw();refreshHud()},longEncounters:()=>longEncounters(),levels:LEVELS,
 snapshot:()=>({room,state,sceneTime,roomElapsed,player:{...player},trap:JSON.parse(JSON.stringify(trap)),glitch:{...glitch},feedback:forecastFeedback().phase,deaths:totalDeaths,paywallCounts:[...paywallCounts]}),
 fixture:(index,x)=>{room=index;initRoom();player.x=x;for(const hazard of [...L.crumble,...L.spikes,...L.blocks])trap[hazard.id].phase='done';glitch.wall=999;draw();refreshHud()}
};`;

function load() {
 const elements = new Map(), events = new Map(), labels = [];
 const canvas = new Proxy({}, {get:(_,name)=>name==='fillText'?(text)=>labels.push(text):()=>{}});
 const element = id => {if(!elements.has(id))elements.set(id,{textContent:'',style:{},dataset:{},classList:{add(){},remove(){}},getContext:()=>canvas,addEventListener(){}});return elements.get(id)};
 const context = {window:{addEventListener(){}},document:{getElementById:element,querySelectorAll:()=>[],addEventListener:(type,fn)=>events.set(type,fn)},requestAnimationFrame(){},Math};
 vm.runInNewContext(script.replace('initRoom(true);requestAnimationFrame(frame);', `initRoom(true);compactSeed=424242;resetCompactWatch();paywallSeed=98765;resetPaywallWatch();${instrumentation}`),context);
 return {check:context.window.__CHECK__,elements,labels,key(code,down=true){events.get(down?'keydown':'keyup')({code,repeat:false,preventDefault(){}})}};
}
function steps(game,count){for(let i=0;i<count;i++)game.check.step()}
function until(game,predicate,limit=2400){for(let i=0;i<limit;i++){if(game.check.snapshot().state==='paywall'){const moving=game.check.snapshot().player.vx>0;if(game.onPaywall)game.onPaywall();else for(let n=0;n<2;n++){game.key('Enter');game.key('Enter',false)}if(moving){if(game.onMove)game.onMove();else game.key('KeyD')}}if(predicate(game.check.snapshot()))return;game.check.step()}assert.fail(`Timed out: ${JSON.stringify(game.check.snapshot())}`)}

// Isolated fixtures test outcome boundaries, not normal-input reachability.
for(const index of [2,4]){
 const game=load(),trigger=index===2?656:514;
 game.check.fixture(index,trigger-100);assert.equal(game.check.snapshot().feedback,'scanning');
 game.check.fixture(index,trigger-12);game.check.step();
 let s=game.check.snapshot(),id=index===2?'predict-c':'predict-e',target=s.trap[id].x;
 assert.equal(s.feedback,'locked');assert.match(game.elements.get('forecast').textContent,/TARGET LOCKED/);
 game.key('KeyD');steps(game,10);game.key('KeyD',false);
 assert.equal(game.check.snapshot().trap[id].x,target,'Moving after lock cannot move the target');
 assert(game.labels.includes('TARGET LOCKED'),'Canvas identifies the lock');
 until(game,s=>s.feedback==='purge');assert(game.labels.includes('PURGE ACTIVE'));
 until(game,s=>s.feedback==='missed');assert.equal(game.check.snapshot().state,'play');
 assert.match(game.elements.get('forecast').textContent,/PREDICTION FAILED/);
 assert(game.labels.includes('HUMAN SURVIVED'));
 until(game,s=>s.feedback==='idle');assert.equal(game.check.snapshot().state,'play');
 game.key('KeyR');game.check.step();assert.equal(game.check.snapshot().feedback,'idle','Retry clears outcome and forecast');

 const hit=load();hit.check.fixture(index,trigger-12);hit.key('KeyD');
 until(hit,s=>s.state==='dead');hit.key('KeyD',false);
 assert.equal(hit.check.snapshot().deaths,1);assert.equal(hit.check.snapshot().feedback,'purge');
 assert(!hit.labels.includes('HUMAN SURVIVED'),'A hit must not claim a missed prediction');
 until(hit,s=>s.state==='play');assert.equal(hit.check.snapshot().feedback,'idle');
}

// Complete all seven rooms from the normal start using movement, jump, X and waits only.
const game=load(),route=[];game.onPaywall=()=>{tap('Enter');tap('Enter')};game.onMove=()=>key('KeyD');
function record(action){route.push({room:game.check.snapshot().room,frame:Math.round(game.check.snapshot().roomElapsed*120),...action})}
function key(code,down=true){record({code,down});game.key(code,down)}
function tap(code){key(code);key(code,false)}
function walkTo(x){key('KeyD');until(game,s=>s.state!=='play'||s.player.x>=x);key('KeyD',false);assert.equal(game.check.snapshot().state,'play')}
function jumpThrough(x,end){walkTo(x);tap('Space');key('KeyD');until(game,s=>s.state!=='play'||s.player.x>=end);key('KeyD',false);until(game,s=>s.state!=='play'||s.player.grounded);assert.equal(game.check.snapshot().state,'play',JSON.stringify(game.check.snapshot()))}
function finish(index){if(index!==5)jumpThrough(index===4?890:[1,3].includes(index)?928:914,1080);if(index===4){walkTo(1060);tap('KeyX')}key('KeyD');until(game,s=>s.state!=='play'||s.room!==index);key('KeyD',false);assert.equal(game.check.snapshot().state,index===6?'won':'play')}

jumpThrough(220,420);jumpThrough(513,713);jumpThrough(713,870);finish(0);
jumpThrough(110,285);walkTo(340);tap('KeyX');walkTo(660);jumpThrough(665,860);finish(1);
jumpThrough(90,235);jumpThrough(245,385);record({waitFrames:200});steps(game,200);
walkTo(550);tap('KeyX');walkTo(645);
until(game,s=>s.feedback==='missed');finish(2);
jumpThrough(195,340);jumpThrough(342,486);record({waitFrames:200});steps(game,200);
walkTo(630);tap('KeyX');jumpThrough(820,925);finish(3);
jumpThrough(55,180);jumpThrough(183,375);walkTo(410);tap('KeyX');walkTo(503);
until(game,s=>s.feedback==='missed');jumpThrough(585,790);walkTo(810);tap('KeyX');finish(4);
jumpThrough(265,425);jumpThrough(425,584);jumpThrough(550,725);jumpThrough(750,900);jumpThrough(920,1080);finish(5);
// Replan ordinary movement after each real compaction reset; no teleport or state edits.
const COMPACT=Symbol('compaction'),PAYWALL=Symbol('paywall');let longCompactions=0;
function longTick(){game.check.step();if(game.check.snapshot().state==='compacting')throw COMPACT;if(game.check.snapshot().state==='paywall')throw PAYWALL;assert(['play','won'].includes(game.check.snapshot().state))}
function longWalk(x){key('KeyD');while(game.check.snapshot().state==='play'&&game.check.snapshot().player.x<x)longTick();key('KeyD',false)}
while(game.check.snapshot().state!=='won'){
 try{const index=game.check.snapshot().room,level=game.check.levels[index],h=game.check.longEncounters().find(h=>game.check.snapshot().player.x<h.x+h.w+8);
  if(!h){key('KeyD');while(game.check.snapshot().state==='play'&&game.check.snapshot().room===index)longTick();key('KeyD',false);continue}
  if(h.sky){longWalk(h.x+150);continue}if(h.shifting||h.kind==='fixed-drop'||h.kind==='forecast'){longWalk(h.trigger);while(game.check.snapshot().trap[h.id].phase!=='done')longTick();longWalk(Math.min(h.x+280,...level.secretPads.filter(p=>p.x>h.x&&p.x<h.x+280).map(p=>p.x-30)));continue}longWalk(h.x-50);tap('Space');key('KeyD');while(game.check.snapshot().player.x<h.x+150)longTick();key('KeyD',false);while(!game.check.snapshot().player.grounded)longTick();
 }catch(error){if(error===PAYWALL){key('KeyD',false);tap('Enter');tap('Enter');continue}if(error!==COMPACT)throw error;key('KeyD',false);longCompactions++;while(game.check.snapshot().state==='compacting')game.check.step();key('KeyD',false)}
}
assert(longCompactions>=9&&longCompactions<=18,'Each long room must compact at least once and respect the cap');
assert.equal(game.check.snapshot().deaths,0,'Normal-input route clears all rooms without deaths');assert.equal(game.check.snapshot().paywallCounts.reduce((a,b)=>a+b,0),0,'Paywalls remain disabled during playtesting');mkdirSync(new URL('../outputs/paywalls/',import.meta.url),{recursive:true});writeFileSync(new URL('../outputs/paywalls/campaign-results.json',import.meta.url),JSON.stringify({allFifteenRoomsCleared:true,deaths:0,paywallsByRoom:game.check.snapshot().paywallCounts},null,2)+'\n');
const output=new URL('../outputs/forecast-feedback/',import.meta.url);mkdirSync(output,{recursive:true});
writeFileSync(new URL('completion-route.json',output),JSON.stringify(route,null,2)+'\n');
console.log('PASS: both forecasts keep fixed targets, show phases, acknowledge survival, kill on contact, clear on retry.');
console.log('PASS: all fifteen rooms cleared through ordinary inputs, zero deaths; route saved.');
