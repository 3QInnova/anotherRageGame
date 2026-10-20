import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {load} from './data-centers.test.mjs';
const root=new URL('../',import.meta.url),html=readFileSync(new URL('initalDemoDocs/Exception_Human_Misclassification_V3.html',root),'utf8');
const fixture=html.replace('window.__DATA_CENTER_TEST__={',`window.__DATA_CENTER_TEST__={cooling:()=>JSON.parse(JSON.stringify(cooling)),pools:()=>COOLING_VOICE,remark:()=>nextRemark('cooling-shock'),gate:coolingGate,route:coolingRoute,board:coolingBoard,protected:()=>!!coolingProtectedStation(),restart:restartCampaignRun,
 position(x,y=FLOOR-PH){player.x=x;player.y=y;player.vy=0;player.grounded=true},balance(n){credits.balance=n},`);
export function make(storage=new Map()){const g=load(fixture,storage);g.nodes.get('campaignCooling').onclick();g.held=new Set();return g}
export function key(g,code,down=true){if(down===g.held.has(code))return;if(down)g.held.add(code);else g.held.delete(code);g.key(code,down)}
export function press(g,code){key(g,code);key(g,code,false)}
export function tick(g,n=1){for(let i=0;i<n;i++){g.check.step();assert.notEqual(g.state().state,'dead',g.nodes.get('lossReason')?.textContent)}}
export function walk(g,x){key(g,'KeyD');let n=0;while(g.state().player.x<x&&g.state().state==='play'){tick(g);assert(++n<6000)}key(g,'KeyD',false)}
export function balance(g,n,target){for(let i=0;i<n;i++){const x=g.state().player.x;key(g,'KeyD',x<target);tick(g);assert(g.api.protected(),'Stay on the switch deck through actual movement')}key(g,'KeyD',false)}
export function mount(g,s){walk(g,s.x-80);press(g,'Space');walk(g,s.x+100);while(!g.state().player.grounded)tick(g);assert(g.api.protected());assert.equal(g.state().player.y+34,s.y)}
// Independent truth-table oracle. No calls to the game's gate evaluator or router.
const truth={OR:[0,1,1,1],XOR:[0,1,1,0],NOR:[1,0,0,0],AND:[0,0,0,1],NAND:[1,1,1,0],XNOR:[1,0,0,1]},solutionCache=new Map();
export function referenceRoute(board,rotations){
 let previous=1,fan=true,grounded=false;const live=[],values=[];
 for(let i=0;i<board.cells.length;i++){
  const c=board.cells[i],contacts=c.taps[(rotations[i]+c.offset)%4];
  const read=x=>x==='P'?previous:x==='!P'?1-previous:x,a=read(contacts[0]),b=read(contacts[1]);
  const out=truth[c.type][2*a+b],ground=rotations[i]===c.groundRotation,enable=out&&!ground;
  values.push({a,b,out,ground,enable});if(out)live.push(i);if(ground&&out)grounded=true;fan=fan&&!!enable;previous=enable?1:0;
 }
 return {fan,grounded,live,values};
}
export function solutions(g,count){
 if(solutionCache.has(count))return solutionCache.get(count);
 const board=g.api.board(count),found=[],rotations=[];let visited=0;
 const visit=i=>{if(i===count){visited++;const expected=referenceRoute(board,rotations),actual=g.api.route(board,rotations);assert.equal(actual.fan,expected.fan);assert.equal(actual.grounded,expected.grounded);
  assert.equal(actual.live.join(','),expected.live.join(','));
  for(let j=0;j<count;j++){const a=actual.values[j],e=expected.values[j];assert.equal(Number(a.a),e.a);assert.equal(Number(a.b),e.b);assert.equal(Number(a.out),e.out);assert.equal(a.ground,e.ground);assert.equal(Boolean(a.enable),Boolean(e.enable))}
  if(expected.fan&&!expected.grounded)found.push([...rotations]);return}
  for(let r=0;r<4;r++){rotations[i]=r;visit(i+1)}
 };visit(0);assert.equal(visited,4**count);assert.equal(found.length,1);solutionCache.set(count,found);return found;
}
export function rotateTo(g,index,rotation){
 const before=g.api.cooling().find(s=>s.occupied).rotations.join(',');press(g,'Digit'+((index+1)%10));
 assert.equal(g.api.cooling().find(s=>s.occupied).rotations.join(','),before,'Selecting never rotates');
 let n=0;while(g.api.cooling().find(s=>s.occupied).rotations[index]!==rotation){press(g,'KeyX');assert.equal(g.api.cooling().find(s=>s.occupied).selected,index,'Rotation keeps its selection');assert(++n<=3)}
}
export function groundFirstDeck(g){mount(g,g.check.level().stations[0]);rotateTo(g,0,1);assert(g.api.cooling()[0].route.grounded)}
export function clearThermal(g,{chased=false}={}){
 if(chased)tick(g,2640);
 const stations=g.check.level().stations;
 for(const [index,s] of stations.entries()){
  mount(g,s);const safe=g.state().idleCompute.zones[0].front,budget=g.state().credits.balance;
  const solution=solutions(g,s.count);assert(solution.length>=1);
  // Establish each preceding enable before configuring the next real logic gate.
  for(let i=0;i<s.count;i++){rotateTo(g,i,solution[0][i]);balance(g,120,s.x+120)}
  let frames=0;while(!g.api.cooling()[index].solved){balance(g,1,s.x+120);assert(++frames<400)}
  assert.equal(g.state().credits.balance,budget);assert.equal(g.state().idleCompute.zones[0].front,safe,'A live deletion edge waits for the circuit');
  assert(g.api.cooling()[index].route.fan);assert(!g.api.cooling()[index].route.grounded);
  walk(g,s.x+s.w-42);press(g,'Space');walk(g,s.sink.x+s.sink.w+70);while(!g.state().player.grounded)tick(g);
 }
 walk(g,g.check.level().exit+5);assert.equal(g.state().state,'won');assert.equal(g.state().deaths,0);assert.equal(g.state().credits.balance,4);
 return {seconds:g.frame()/120,credits:4,chased,solved:g.api.cooling().filter(s=>s.solved).length};
}
if(import.meta.url===new URL(process.argv[1],'file://').href){
 const g=make();
 const voice=Object.values(g.api.pools()).flat();assert.equal(voice.length,116);assert.equal(new Set(voice).size,116);const cursorStore=new Map(),speaker=make(cursorStore);const lossCycle=Array.from({length:30},()=>speaker.api.remark());assert.equal(new Set(lossCycle).size,30);assert.equal(make(cursorStore).api.remark(),lossCycle[0]);
 for(const [type,table] of Object.entries(truth))for(let a=0;a<2;a++)for(let b=0;b<2;b++)assert.equal(Number(g.api.gate(type,!!a,!!b)),table[2*a+b]);
 const layouts=[];for(const count of [3,6,10]){const found=solutions(g,count);assert(found.length>0);const board=g.api.board(count);assert.equal(board.cells.length,count);assert(found.every(r=>g.api.route(board,r).live.length===count));layouts.push({gates:count,physicalSolutions:found.length,configurationsChecked:4**count})}
 const ordinary=clearThermal(g),chased=make(),chasedResult=clearThermal(chased,{chased:true});assert.equal(chased.api.progress().cleared.length,0);g.api.restart();assert.equal(g.check.level().serverId,'thermal-support');
 const free=make(),s=free.check.level().stations[0];mount(free,s);free.api.balance(1);const credit=JSON.stringify(free.state().credits),idle=JSON.stringify(free.state().idleCompute.zones);
 const unselected=free.api.cooling()[0].rotations.join(',');press(free,'KeyX');assert.equal(free.api.cooling()[0].rotations.join(','),unselected);assert.equal(free.api.cooling()[0].selected,-1);press(free,'Digit2');assert.equal(free.api.cooling()[0].selected,1);assert.equal(free.api.cooling()[0].rotations.join(','),unselected);assert.equal(JSON.stringify(free.state().credits),credit);
 key(free,'KeyA');tick(free,8);key(free,'KeyA',false);assert.equal(JSON.stringify(free.state().credits),credit,'Left movement on the deck is free');
 press(free,'Space');balance(free,100,s.x+120);assert.equal(JSON.stringify(free.state().credits),credit,'Real jumps on the deck are free');
 balance(free,7200,s.x+120);assert.equal(JSON.stringify(free.state().idleCompute.zones),idle,'A full minute of balancing cannot accrue idle debt');
 free.api.open();const frozen=JSON.stringify(free.state()),circuit=JSON.stringify(free.api.cooling());press(free,'Digit1');press(free,'KeyX');tick(free,1200);assert.equal(JSON.stringify(free.state()),frozen);assert.equal(JSON.stringify(free.api.cooling()),circuit);free.api.close();
 const reset=make();mount(reset,s);rotateTo(reset,0,2);assert(reset.api.cooling()[0].rotations.some((r,i)=>r!==reset.api.cooling()[0].board.cells[i].initial));key(reset,'KeyD',false);tick(reset,900);assert.equal(reset.api.cooling()[0].resets,1);assert(reset.api.cooling()[0].rotations.every((r,i)=>r===reset.api.cooling()[0].board.cells[i].initial));assert.equal(reset.api.cooling()[0].temperature,1);assert.equal(reset.api.protected(),false);
 const shock=make();groundFirstDeck(shock);const protectedBudget=shock.state().credits.balance;tick(shock,30);assert.equal(shock.state().state,'play');shock.api.open();const shockFrozen=JSON.stringify(shock.api.cooling());tick(shock,1200);assert.equal(JSON.stringify(shock.api.cooling()),shockFrozen);shock.api.close();tick(shock,47);assert.equal(shock.state().state,'play');shock.check.step();assert.equal(shock.state().state,'dead');assert.match(shock.nodes.get('lossReason').textContent,/GROUND FAULT/);assert(shock.api.pools()['cooling-shock'].includes(shock.nodes.get('ovDesc').textContent));assert.equal(shock.state().credits.balance,protectedBudget);for(let i=0;i<1200;i++)shock.check.step();assert.equal(shock.state().state,'dead');for(let i=0;i<2;i++)press(shock,'Enter');assert.equal(shock.state().state,'play');assert(!shock.api.cooling()[0].route.grounded);
 const rescue=make();groundFirstDeck(rescue);balance(rescue,60,s.x+120);rotateTo(rescue,0,2);rotateTo(rescue,1,2);rotateTo(rescue,2,1);assert(!rescue.api.cooling()[0].route.grounded);assert.equal(rescue.api.cooling()[0].groundTime,0);balance(rescue,360,s.x+120);assert(rescue.api.cooling()[0].solved);
 const coupled=make();mount(coupled,s);rotateTo(coupled,1,0);assert.equal(coupled.api.cooling()[0].route.values[1].ground,true);assert.equal(coupled.api.cooling()[0].route.values[1].out,false);assert.equal(coupled.api.cooling()[0].route.grounded,false,'A low output into GND is not live');rotateTo(coupled,0,2);assert.equal(coupled.api.cooling()[0].route.values[1].out,true);assert.equal(coupled.api.cooling()[0].route.grounded,true,'A preceding enable changes the XOR inputs and can energize ground');
 const burn=make();assert.throws(()=>walk(burn,s.sink.x+10),/THERMAL FAILURE/);assert.equal(burn.state().state,'dead');assert.equal(burn.nodes.get('ovDesc').textContent.length>0,true);for(let i=0;i<1200;i++)burn.check.step();assert.equal(burn.state().state,'dead');for(let i=0;i<2;i++)press(burn,'Enter');assert.equal(burn.state().state,'play');assert(burn.api.cooling().every(s=>s.temperature===1&&!s.solved));
 const rewind=make();rewind.api.position(2300);rewind.api.balance(1);press(rewind,'Space');rewind.check.step();assert.equal(rewind.state().state,'compacting');for(let i=0;i<1800;i++)rewind.check.step();assert.equal(rewind.state().state,'play');assert(rewind.api.cooling().every(s=>!s.solved));
 const out=new URL('outputs/thermal-support/',root);mkdirSync(out,{recursive:true});writeFileSync(new URL('route.json',out),JSON.stringify({frames:chased.frame(),events:chased.route},null,2)+'\n');writeFileSync(new URL('results.json',out),JSON.stringify({ordinary,chased:chasedResult,gateCounts:[3,6,10],layouts,independentTruthTableOracle:true,truthTables:6,selectionDoesNotRotate:true,rotationKeepsSelection:true,downstreamLogicCoupling:true,groundFaultDelaySeconds:.65,electrocution:true,groundFaultCanBeCorrected:true,freeJumpRewriteAndLeft:true,safeMinuteBalanced:true,deletionEdgeFrozen:true,fallResets:true,hotSinkBurns:true,pauseFreezes:true,creditRewind:true,practiceIsolated:true,sameLevelRestart:true},null,2)+'\n');
 console.log('PASS: 3/6/10 actual logic gates, six truth tables, independent exhaustive Boolean oracle, explicit selection/rotation, normal/chased clears, live ground electrocution and rescue, 30 shock remarks, free actions/idle freeze, wind/reset/burns, pause and practice isolation.');
}
