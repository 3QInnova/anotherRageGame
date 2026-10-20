import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {load} from './data-centers.test.mjs';
const root=new URL('../',import.meta.url),html=readFileSync(new URL('initalDemoDocs/Exception_Human_Misclassification_V3.html',root),'utf8');
const source=html.replace('window.__DATA_CENTER_TEST__={',`window.__DATA_CENTER_TEST__={commit:()=>window.__COMMITMENT_TEST__.state(),
 fixturePosition(x){player.x=x;player.y=FLOOR-PH;player.vy=0;player.grounded=true;player.coyote=.1;player.jumpBuffer=0;resetCommitment(x);resetIdleCompute(x)},
 fixtureCleanup(){const z=idleCompute.zones.find(z=>player.x>=z.start&&player.x<z.end);z.front=player.x-100;z.phase='cleanup';presence.phase='cleanup';presence.cleanupEnd=z.end},fixtureBalance(n){credits.balance=n},remark:(pool)=>nextRemark(pool),pools:()=>COMMITMENT_REMARKS,
 `);
export function make(){const g=load(source);g.nodes.get('campaignCommitmentTrial').onclick();return g}
export function tick(g,n=1){for(let i=0;i<n;i++)g.check.step()}
export function walk(g,x){g.key('KeyD');for(let n=0;g.state().player.x<x&&n<10000;n++){tick(g);assert.equal(g.state().state,'play','Walk failed at '+g.state().player.x+': '+g.nodes.get('lossReason')?.textContent)}g.key('KeyD',false)}
export function jump(g,x){g.key('Space');g.key('Space',false);walk(g,x);while(!g.state().player.grounded){tick(g);assert.equal(g.state().state,'play')}}
export function clearLab(g,{restFrames=240}={}){
 walk(g,610);jump(g,800);walk(g,1100);
 tick(g,restFrames); // Actual safe rest, not a fixture.
 walk(g,1505);jump(g,1700);walk(g,1710);jump(g,1930);walk(g,2160);
 tick(g,240);walk(g,2410);
 while(g.api.commit().encounters[2].time%3<1.62)tick(g);
 walk(g,2800);tick(g,240);walk(g,2960);
 // Migration transfers use only normal keys, observed platform positions and support.
 jump(g,3100);
 for(let index=0;index<3;index++){
  let didJump=false;
  for(let n=0;n<900;n++){
   const state=g.api.commit(),platforms=state.encounters[3].platforms,p=g.state().player,from=platforms[index],to=platforms[index+1];
   assert.equal(g.state().state,'play','Migration '+index+' at '+p.x+': '+g.nodes.get('lossReason')?.textContent);
   const target=to?to.x+35:3950;
   // Advance to the leading edge, then transfer as the next platform becomes reachable.
   if(p.x<from.x+from.w-30){g.key('KeyD');tick(g);g.key('KeyD',false);continue}
   if(target-p.x<170||(!to&&3900-p.x<165)){
    g.key('Space');g.key('Space',false);g.key('KeyD');
    let frames=0;do{
     tick(g);assert.equal(g.state().state,'play','Transfer '+index+' failed: '+g.nodes.get('lossReason')?.textContent);
     const next=g.api.commit().encounters[3].platforms[index+1];
     if(next&&g.state().player.x>next.x+next.w*.55)g.key('KeyD',false);
     assert(++frames<180,'Transfer must land');
    }while(!g.state().player.grounded);
    g.key('KeyD',false);didJump=true;break;
   }
   tick(g);
  }
  assert(didJump,'Found a reachable transfer from platform '+index);
 }
 walk(g,4050);g.key('KeyD');while(g.state().state==='play')tick(g);g.key('KeyD',false);
 assert.equal(g.state().state,'won');assert.equal(g.state().deaths,0);assert.equal(g.api.progress().cleared.length,0);assert(g.state().credits.balance>0);
 return {seconds:g.frame()/120,credits:g.state().credits.balance};
}
if(import.meta.url===new URL(process.argv[1],'file://').href){
 const g=make(),result=clearLab(g);
 const tapped=make(),rawKey=tapped.key,rawStep=tapped.check.step;let intended=false,held=false,tapFrame=0;
 tapped.key=(code,down=true)=>{if(code==='KeyD'){intended=down;if(!down){rawKey(code,false);held=false}}else rawKey(code,down)};
 tapped.check.step=()=>{const next=intended&&tapFrame++%10<9;if(next!==held){rawKey('KeyD',next);held=next}rawStep()};
 const fastTapClear=clearLab(tapped);assert.equal(tapped.api.commit().presence.phase,'monitoring','Useful rapid taps can clear the entire lab');
 const still=make();tick(still,3600);assert.equal(still.state().state,'play');assert(still.api.commit().encounters.every(c=>c.phase==='idle'),'Waiting before entry cannot consume encounters');
 const lease=make();walk(lease,420);const leaseTime=lease.api.commit().encounters[0].time;
 for(let i=0;i<8&&lease.state().state==='play';i++){lease.key('KeyD');tick(lease,2);lease.key('KeyD',false);tick(lease,38)}
 assert.equal(lease.state().state,'dead');assert.match(lease.nodes.get('lossReason').textContent,/floor lease expired/);assert(lease.api.commit().encounters[0].time>leaseTime);
 const paused=make();walk(paused,500);paused.api.open();const frozen=JSON.stringify(paused.api.commit());tick(paused,2400);assert.equal(JSON.stringify(paused.api.commit()),frozen);paused.api.close();tick(paused);assert.notEqual(JSON.stringify(paused.api.commit()),frozen);
 const batch=make();batch.api.fixturePosition(1320);tick(batch,110);assert.equal(batch.state().state,'dead');assert.match(batch.nodes.get('lossReason').textContent,/BATCH/,'Entry receipt catches a player who stays put');
 const batchScan=make();batchScan.api.fixturePosition(1320);walk(batchScan,1505);jump(batchScan,1700);assert.throws(()=>walk(batchScan,1850),/BATCH/,'Shared scanner demands the second jump');
 const batchGap=make();batchGap.api.fixturePosition(1320);walk(batchGap,1650);tick(batchGap,100);assert.equal(batchGap.state().state,'dead','Batch floor opens on the same sequence');
 const retry=make();retry.api.fixturePosition(2410);tick(retry);const cyclePhases=[];
 for(let i=0;i<4;i++){tick(retry,360);assert.equal(retry.state().state,'play');assert.equal(retry.api.commit().encounters[2].phase,'active');cyclePhases.push(retry.api.commit().encounters[2].time)}
 while(retry.api.commit().encounters[2].time%3<1.62)tick(retry);walk(retry,2800);tick(retry,7200);assert.equal(retry.state().state,'play');assert.equal(retry.api.commit().encounters[2].phase,'cleared','Passed retry trap stays passed');
 const migration=make();migration.api.fixturePosition(2960);jump(migration,3100);const ridingX=migration.state().player.x;tick(migration,60);assert.notEqual(migration.state().player.x,ridingX,'Moving support carries player');tick(migration,550);assert.equal(migration.state().state,'dead','Boarded platform expires even without more input');assert.match(migration.nodes.get('lossReason').textContent,/DATA CORRUPTION/);
 const creep=make();let warnedAt=0,cleanupAt=0;
 for(let i=0;i<4000&&creep.state().state==='play';i++){
  // Irregular tiny pulses: the detector must not depend on robot-perfect rhythm.
  const down=i%[93,107,86][Math.floor(i/120)%3]<3;creep.key('KeyD',down);tick(creep);
  if(!warnedAt&&creep.api.commit().presence.warning>0)warnedAt=i+1;
  if(!cleanupAt&&creep.api.commit().presence.phase==='cleanup'){cleanupAt=i+1;assert.equal(creep.state().state,'play','Deadline starts deletion, not a loss');assert.equal(creep.state().idleCompute.phase,'cleanup');assert(creep.state().idleCompute.zones[0].front<creep.state().player.x-390);creep.api.open();const frozenChase=JSON.stringify(creep.state().idleCompute);tick(creep,600);assert.equal(JSON.stringify(creep.state().idleCompute),frozenChase);creep.api.close()}
 }
 assert(warnedAt>=1920,'At least sixteen seconds before escalation');assert(cleanupAt-warnedAt>=719,'Six-second warning before deletion');assert.equal(creep.state().state,'dead');assert.match(creep.nodes.get('lossReason').textContent,/cleanup edge caught/);assert.match(creep.nodes.get('ovDesc').textContent,/jiggler/);const dead=JSON.stringify(creep.api.commit());tick(creep,1200);assert.equal(JSON.stringify(creep.api.commit()),dead,'Loss keeps the 15-second reading interval');
 for(let i=0;i<2;i++){creep.key('Enter');creep.key('Enter',false)}assert.equal(creep.state().state,'play');assert.equal(creep.api.commit().presence.events.length,0);
 const recover=make();for(let i=0;i<2200&&recover.api.commit().presence.warning===0;i++){recover.key('KeyD',i%120<2);tick(recover)}recover.key('KeyD',false);assert(recover.api.commit().presence.warning>0);
 recover.api.open();const ticket=JSON.stringify(recover.api.commit());tick(recover,2400);assert.equal(JSON.stringify(recover.api.commit()),ticket);recover.api.close();walk(recover,recover.state().player.x+290);assert.equal(recover.api.commit().presence.phase,'monitoring','Meaningful forward run clears ticket');
 // Trigger a chase with real taps, then finish all four encounters using normal controls.
 const chased=make();for(let i=0;i<2200&&chased.api.commit().presence.warning===0;i++){chased.key('KeyD',i%120<2);tick(chased)}chased.key('KeyD',false);
 while(chased.api.commit().presence.phase==='warning')tick(chased);
 assert.equal(chased.state().state,'play');assert.equal(chased.state().idleCompute.phase,'cleanup');

 const chasedClear=clearLab(chased,{restFrames:7200});assert(chased.state().idleCompute.zones.every(z=>z.phase==='cleared'));assert.equal(chased.api.commit().presence.phase,'monitoring');
 assert(chased.state().idleCompute.zones[0].front>10,'Escaping to a bay does not rebuild the already deleted world');
 const deleted=chased.state().idleCompute.zones[0];assert(chased.check.platformList().every(p=>p.x+p.w<=deleted.start||p.x>=deleted.front),'Deleted floor is absent from collision support');
 const laterBay=make();laterBay.api.fixturePosition(2640);laterBay.api.fixtureCleanup();walk(laterBay,2800);const stoppedFront=laterBay.state().idleCompute.zones[2].front;tick(laterBay,7200);assert.equal(laterBay.state().state,'play');assert.equal(laterBay.state().idleCompute.zones[2].front,stoppedFront);assert.equal(laterBay.api.commit().presence.phase,'monitoring');assert.equal(laterBay.state().idleCompute.zones[3].phase,'monitoring','Next cleanup stretch gets a fresh allowance');
 const brief=make();for(let i=0;i<3;i++){brief.key('KeyD');tick(brief,8);brief.key('KeyD',false);tick(brief,90)}assert.equal(brief.api.commit().presence.warning,0,'Positioning taps do not trigger');
 const fast=make();for(let i=0;i<140;i++){fast.key('KeyD',i%5<4);tick(fast)}assert.equal(fast.api.commit().presence.warning,0,'Rapid taps with useful progress remain legal');
 const bay=make();bay.api.fixturePosition(1030);tick(bay,7200);assert.equal(bay.state().state,'play');assert.equal(bay.api.commit().presence.time,0,'Maintenance does not build presence evidence');
 const required=make();required.api.fixturePosition(2410);tick(required,90);assert.equal(required.api.commit().presence.time,0,'Actual retry warning and active cycle exempt required waiting');
 const protectedChase=make();protectedChase.api.fixturePosition(2410);
 // Install a chase before a genuine retry wait; this isolated fixture is not the completion proof.
 protectedChase.api.fixtureCleanup();const waitFront=protectedChase.state().idleCompute.zones[2].front;tick(protectedChase,90);assert.equal(protectedChase.state().idleCompute.zones[2].front,waitFront);assert.equal(protectedChase.state().state,'play');
 protectedChase.api.open();const pausedWorld=JSON.stringify(protectedChase.state().idleCompute);tick(protectedChase,600);assert.equal(JSON.stringify(protectedChase.state().idleCompute),pausedWorld);protectedChase.api.close();
 protectedChase.api.fixtureBalance(1);protectedChase.key('Space');protectedChase.key('Space',false);tick(protectedChase);assert.equal(protectedChase.state().state,'compacting');tick(protectedChase,1800);assert(protectedChase.state().idleCompute.zones.every(z=>z.front===null));assert.equal(protectedChase.api.commit().presence.phase,'monitoring');
 const compact=make();compact.api.fixturePosition(2800);compact.api.fixtureBalance(1);compact.key('Space');compact.key('Space',false);tick(compact);assert.equal(compact.state().state,'compacting');const during=JSON.stringify(compact.api.commit());tick(compact,1799);assert.equal(JSON.stringify(compact.api.commit()),during);tick(compact);assert.equal(compact.state().state,'play');assert.equal(compact.state().player.x,1030);assert.equal(compact.api.commit().presence.warning,0);assert(compact.state().credits.balance>=7,'Refill budgets remaining jumps');
 const pools=g.api.pools(),lines=Object.values(pools).flat();assert.equal(lines.length,124);assert.equal(new Set(lines).size,124);
 for(const pool of ['commitment-loss','presence-loss']){assert.equal(new Set(Array.from({length:30},()=>g.api.remark(pool))).size,30)}
 for(const x of g.check.level().returnPoints)assert(!g.check.level().pits.some(p=>x+24>p.x&&x<p.x+p.w),'Compaction points stay on permanent ground');
 const out=new URL('outputs/commitment-lab/',root);mkdirSync(out,{recursive:true});
 writeFileSync(new URL('route.json',out),JSON.stringify({frames:g.frame(),events:g.route},null,2)+'\n');
 writeFileSync(new URL('chased-route.json',out),JSON.stringify({frames:chased.frame(),events:chased.route},null,2)+'\n');
 writeFileSync(new URL('results.json',out),JSON.stringify({ordinaryInputClear:result,fastTapClear,chasedClear,warningAtSeconds:warnedAt/120,automaticRetries:cyclePhases.length,remarks:lines.length,leasedFloorExpiry:true,sharedBatchSequence:true,movingSupportsAndRetirement:true,presenceDeletionAndRecovery:true,cleanupAtSeconds:cleanupAt/120,pauseAndMaintenanceFreeze:true,creditCompactionRecovery:true,practiceIsolation:true},null,2)+'\n');
 console.log('PASS: ordinary-input four-encounter escape, leases, batch hazards, repeating cooldowns, moving supports and retirement, irregular creeping/deletion/recovery, pause, safe rests, credit compaction and 124 rotating remarks.');
}
