import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {load,clear} from './data-centers.test.mjs';
const source=readFileSync(new URL('../initalDemoDocs/Exception_Human_Misclassification_V3.html',import.meta.url),'utf8');
const fixture=source.replace('window.__DATA_CENTER_TEST__={',`window.__DATA_CENTER_TEST__={
 creditRemark:()=>nextRemark('credit-compaction'),credit:()=>({...credits}),creditReceipt:()=>creditReceipt?{...creditReceipt}:null,total:creditTotal,records:()=>({...creditRecords}),
 advice:()=>JSON.parse(JSON.stringify(advisory)),reroll:resetAdvisories,
 original(index){selectLevelCollection(false);room=index;initRoom()},
 position(x){player.x=x;player.y=FLOOR-PH;player.grounded=true;player.coyote=.1;player.vy=0;player.jumpBuffer=0},
 balance(n){credits.balance=n},cap(){compactCounts[room]=2},
 safety(){return platformList().some(p=>p.x<=player.x&&p.x+p.w>=player.x+PW)},
 `);
function game(storage=new Map()){return load(fixture,storage)}
function tick(g,n=1){for(let i=0;i<n;i++)g.check.step()}
function press(g,code){g.key(code);g.key(code,false)}
const g=game();g.api.start('localhost-01',true);g.check.seed(42);
const budget=g.api.credit().balance;
press(g,'KeyX');assert.equal(g.api.credit().balance,budget,'Invalid Rewrite is free');
press(g,'Space');tick(g);assert.equal(g.api.credit().balance,budget-1,'One real jump costs one');
press(g,'Space');tick(g);assert.equal(g.api.credit().balance,budget-1,'Airborne jump attempts are free');
g.api.position(80);g.key('KeyD');tick(g,15);g.key('KeyD',false);assert.equal(g.api.credit().balance,budget-1,'Right is free');
g.key('KeyA');tick(g);assert.equal(g.api.credit().balance,budget-2,'First left step costs one');tick(g,10);g.key('KeyA',false);press(g,'KeyA');tick(g);assert.equal(g.api.credit().balance,budget-2,'Tapping left does not repeatedly charge the same 100px');
g.api.position(10);g.key('KeyA');const blocked=g.api.credit().balance;tick(g,20);g.key('KeyA',false);assert.equal(g.api.credit().balance,blocked,'Pushing left at a boundary is free');
const rewrite=game();rewrite.api.start(rewrite.api.levels().find(l=>l.anomalies.some(a=>a.kind==='bridge')).serverId,true);const bridge=rewrite.check.level().anomalies.find(a=>a.kind==='bridge');assert(bridge);{rewrite.api.position(bridge.x-20);const before=rewrite.api.credit().balance;press(rewrite,'KeyX');assert.equal(rewrite.api.credit().balance,before-1,'Valid Rewrite costs one')}
g.api.archive('localhost-01'); // Exercise the retained noisy advisory comparison. New routes use learned recall.
const geometry=JSON.stringify(g.check.level());g.api.reroll(1);const a=JSON.stringify(g.api.advice());g.api.reroll(1);assert.equal(JSON.stringify(g.api.advice()),a,'Seeded advice is stable');g.api.reroll(999);assert.notEqual(JSON.stringify(g.api.advice()),a);assert.equal(JSON.stringify(g.check.level()),geometry,'Advice never mutates authored geometry');
const modes=new Set(),floorKinds=new Set();let decoys=0,omissions=0;
for(let i=1;i<=30;i++){g.api.reroll(i);const a=g.api.advice();a.suggestions.forEach(s=>modes.add(s.mode));a.floor.forEach(h=>floorKinds.add(h.kind));decoys+=a.suggestions.filter(s=>s.id.startsWith('decoy')).length;if(a.suggestions.filter(s=>s.id.startsWith('guess')).length<g.check.level().autocompleteHints.length)omissions++}
assert.equal(modes.size,3);assert.equal(floorKinds.size,2);assert(decoys>0&&omissions>0);
for(const level of g.api.levels()){
 const r=game();r.api.start(level.serverId,true);r.check.seed(42);
 const x=level.exit-200;r.api.position(x);r.api.balance(1);r.api.cap();press(r,'Space');tick(r);
 assert.equal(r.state().state,'compacting','Zero bypasses routine compaction cap');assert.equal(r.api.credit().balance,0);
 assert(r.state().compaction.returnX<=x-(level.exit-level.start)/4,'At least quarter-route setback');
 const frozen=JSON.stringify(r.state().player);tick(r,1799);assert.equal(r.state().state,'compacting');assert.equal(JSON.stringify(r.state().player),frozen);tick(r);
 assert.equal(r.state().state,'play');assert(r.api.safety(),'Safe landing');assert.equal(r.api.credit().balance,r.api.credit().budget);assert(r.api.credit().balance>=4);
 assert(Object.values(r.state().trap).every(t=>t.phase==='idle'),'Traps reset');assert.equal(r.api.credit().rewinds,1);
 // Continue from the actual resource rewind using ordinary movement/jump/Rewrite inputs.
 clear(r);assert.equal(r.api.total(),0,'Practice credits never bank');
}
for(let i=0;i<16;i++){const original=game();original.api.original(i);const l=original.check.level();original.api.position(l.exit-60);original.api.balance(1);press(original,'Space');tick(original);assert.equal(original.state().state,'compacting');tick(original,1800);assert(original.api.safety(),'Original/glass safe rewind '+i);tick(original,240);assert.equal(original.state().state,'play','Original/glass stable rewind '+i)}
const rotation=new Map(),narrator=game(rotation),lines=new Set();for(let i=0;i<24;i++)lines.add(narrator.api.creditRemark());assert.equal(lines.size,24);const next=narrator.api.creditRemark();assert.notEqual(game(rotation).api.creditRemark(),next,'Credit remarks rotate across reload');
const storage=new Map(),scored=game(storage);scored.api.start('localhost-01');scored.check.seed(42);clear(scored);
const receipt=scored.api.creditReceipt();assert(receipt.remaining>0);assert.equal(scored.api.total(),receipt.remaining);assert.equal(game(storage).api.total(),receipt.remaining,'Rewards persist');
scored.api.start('localhost-01');scored.check.seed(42);clear(scored);assert.equal(scored.api.total(),receipt.remaining,'Identical replay does not farm rewards');assert.equal(scored.api.creditReceipt().gained,0);
const broken=new Map([['exception-credit-records-v1','{"version":1,"best":{"localhost-01":-5,"localhost-02":"9","__proto__":999,"original-01":4}}']]);assert.equal(game(broken).api.total(),4);
const futureId=g.api.catalog().centers[1].servers[0].id;const future=new Map([['exception-credit-records-v1',JSON.stringify({version:1,best:{[futureId]:6}})]]);assert.equal(game(future).api.total(),6,'Stable IDs support future data centers');
const denied=new Map();denied.set=()=>{throw Error('Storage blocked')};const offline=game(denied);offline.api.start('localhost-01');offline.check.seed(42);clear(offline);assert(offline.api.total()>0);
console.log('PASS: credit action costs, movement metering, 20 forced quarter-route compactions and ordinary-input recoveries, no cap softlock, saved best-score rewards, practice isolation, storage failures, randomized advisory modes/decoys/omissions and unchanged geometry.');
