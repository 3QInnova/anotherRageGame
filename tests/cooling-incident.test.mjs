import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {loadArchived as load,clear} from './archived-campaign-fixture.mjs';
const root=new URL('../',import.meta.url),html=readFileSync(new URL('initalDemoDocs/Exception_Human_Misclassification_V3.html',root),'utf8');
const fixture=html.replace('window.__DATA_CENTER_TEST__={',`window.__DATA_CENTER_TEST__={restart:restartCampaignRun,credits:()=>({...credits}),creditReceipt:()=>creditReceipt?{...creditReceipt}:null,total:creditTotal,position(x){player.x=x;player.y=FLOOR-PH;player.vy=0;player.grounded=true},balance(n){credits.balance=n},`);
const press=(g,code)=>{g.key(code);g.key(code,false)},tick=(g,n=1)=>{for(let i=0;i<n;i++)g.check.step()};
export function make({practice=true,storage=new Map()}={}){const g=load(fixture,storage);assert(g.api.start('localhost-18',practice));return g}
export function recordedClear({chaseZones=false}={}){
 const g=make(),markers=[],captured=new Set(),step=g.check.step;
 g.check.step=()=>{step();const state=g.state(),z=state.idleCompute.zones[0],box=g.puzzle.state()?.[0];
  const note=(name,when)=>{if(when&&!captured.has(name)){captured.add(name);markers.push({name,frame:g.frame(),x:state.player.x,front:z.front,balance:state.credits.balance})}};
  note('warning',z.phase==='warning');note('deletion',z.phase==='cleanup');note('puzzle',!!g.puzzle.open());note('cooled',box?.solved);note('crossed',box?.solved&&state.player.x>box.sink.x+box.sink.w+50);
 };
 const result=clear(g,{chaseZones});assert.equal(g.state().state,'won');assert.equal(g.state().credits.balance,4);assert.equal(g.api.progress().cleared.length,0);assert.equal(g.api.total(),0);assert(markers.some(m=>m.name==='deletion'));assert.equal(g.puzzle.state()[0].solved,true);
 return {game:g,result,markers};
}
if(import.meta.url===new URL(process.argv[1],'file://').href){
 const normal=recordedClear(),chased=recordedClear({chaseZones:true}),level=normal.game.check.level();
 assert.equal(level.serverId,'localhost-18');assert.equal(level.puzzleBoxTrial,undefined);assert.equal(level.puzzleBoxEncounter,true);assert.equal(level.stations.length,1);assert.equal(level.stations[0].count,4);assert.equal(level.idleCompute.zones.length,2);assert.equal(level.idleCompute.zones[0].warningAt,2300);
 assert.equal(level.encounters.map(h=>h.kind).join(','),'forecast,bridge,wall,air-flag,redaction,scan,puzzle-box,fixed-drop,scan,redaction');
 const warning=normal.markers.find(m=>m.name==='warning'),deletion=normal.markers.find(m=>m.name==='deletion');assert(warning.x>=2300&&warning.x<2303);assert.equal(deletion.frame-warning.frame,720);assert.equal(Math.round(deletion.x-deletion.front),400,'The warned entry sweep starts behind the current player position');assert(deletion.frame<normal.markers.find(m=>m.name==='puzzle').frame,'A normal decisive run sees deletion before maintenance');
 const STOP=Symbol(),protectedRun=make(),step=protectedRun.check.step;
 protectedRun.check.step=()=>{step();if(protectedRun.puzzle.open())throw STOP};assert.throws(()=>clear(protectedRun),e=>e===STOP);protectedRun.check.step=step;
 const held=JSON.stringify(protectedRun.state().player),edge=JSON.stringify(protectedRun.state().idleCompute.zones),credits=protectedRun.api.credits().balance;
 tick(protectedRun,7200);assert.equal(JSON.stringify(protectedRun.state().player),held);assert.equal(JSON.stringify(protectedRun.state().idleCompute.zones),edge);assert.equal(protectedRun.api.credits().balance,credits);
 press(protectedRun,'Digit1');press(protectedRun,'Digit4');assert(protectedRun.puzzle.state()[0].logic.ground);tick(protectedRun,240);assert.equal(protectedRun.state().state,'play');assert.equal(protectedRun.puzzle.state()[0].temperature,1);
 press(protectedRun,'Enter');protectedRun.api.open();const frozen=JSON.stringify({world:protectedRun.state(),boxes:protectedRun.puzzle.state()});tick(protectedRun,1200);assert.equal(JSON.stringify({world:protectedRun.state(),boxes:protectedRun.puzzle.state()}),frozen);protectedRun.api.close();tick(protectedRun,179);assert.equal(protectedRun.state().state,'play');tick(protectedRun);assert.equal(protectedRun.state().state,'dead');assert.match(protectedRun.nodes.get('lossReason').textContent,/TEST CIRCUIT/);tick(protectedRun,1200);assert.equal(protectedRun.state().state,'dead');press(protectedRun,'Enter');press(protectedRun,'Enter');assert.equal(protectedRun.state().room,17);assert(!protectedRun.puzzle.state()[0].solved);assert.equal(protectedRun.puzzle.open(),null);assert(protectedRun.state().idleCompute.zones.every(z=>z.front===null));
 const completionRoute={server:'localhost-18',frames:normal.game.frame(),events:[...normal.game.route],markers:normal.markers};
 normal.game.api.restart();assert.equal(normal.game.check.level().serverId,'localhost-18');assert(normal.game.api.mode().campaignPractice);assert(!normal.game.puzzle.state()[0].solved);
 const rewind=make();rewind.api.position(level.exit-200);rewind.api.balance(1);press(rewind,'Space');tick(rewind);assert.equal(rewind.state().state,'compacting');tick(rewind,1800);assert.equal(rewind.state().player.x,4200);assert(rewind.state().player.x<level.stations[0].x-80);assert(!rewind.puzzle.state()[0].solved);clear(rewind);assert.equal(rewind.state().state,'won');assert.equal(rewind.api.total(),0);
 const cleared=Array.from({length:17},(_,i)=>'localhost-'+String(i+1).padStart(2,'0')),storage=new Map([['exception-data-centers-v1',JSON.stringify({schemaVersion:1,cleared,currentServerId:'localhost-18'})]]),campaign=make({practice:false,storage});clear(campaign);assert.equal(campaign.check.level().serverId,'localhost-19');assert.equal(campaign.api.progress().cleared.length,18);assert.equal(campaign.api.progress().currentServerId,'localhost-19');assert.equal(campaign.api.total(),4);assert.equal(campaign.api.creditReceipt().id,'localhost-18');assert.equal(campaign.api.creditReceipt().remaining,4);
 const loaded=load(fixture,storage);assert.equal(loaded.api.progress().cleared.length,18);assert.equal(loaded.api.total(),4);
 const out=new URL('outputs/local-host-puzzle/',root);mkdirSync(out,{recursive:true});
 writeFileSync(new URL('route.json',out),JSON.stringify(completionRoute,null,2)+'\n');
 writeFileSync(new URL('results.json',out),JSON.stringify({server:'localhost-18',normal:normal.result,chased:chased.result,markers:normal.markers,forcedWarningSeconds:6,headStartAtActivation:400,ordinaryRunStartsDeletion:true,protectedMinute:true,safePreviewCannotShock:true,pauseFreezesPoweredTest:true,liveGroundFaultAndReading:true,normalCampaignAdvancesTo19:true,creditsBanked:4,progressPersists:true,practiceIsolated:true,practiceRestartKeeps18:true,creditRewindReplaysPuzzle:true,exitHazards:3},null,2)+'\n');
 console.log('PASS (archived short Localhost comparison): Localhost 18 traps → warned deletion → protected Puzzle Box → real cooling → final escape; minute-long rest, faults/retry, campaign saves/rewards, practice restart and credit rewind.');
}
