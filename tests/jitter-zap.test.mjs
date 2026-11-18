import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {load} from './data-centers.test.mjs';
const html=readFileSync(new URL('../initalDemoDocs/Exception_Human_Misclassification_V3.html',import.meta.url),'utf8').replace('window.__DATA_CENTER_TEST__={',`window.__DATA_CENTER_TEST__={zap:()=>jitterZap,limit(n){jitterZap.limit=n},debt(n){idleCompute.zones[0].debt=n},zstep(dt,protectedWait=false){tickJitterZap(dt,idleCompute.zones[0],protectedWait)},line:()=>nextRemark('idle-jitter-zap'),pool:()=>ALL_REMARK_POOLS['idle-jitter-zap'],`);
const make=(storage)=>{const g=load(html,storage);g.api.start('localhost-01',true);return g};
const tick=(g,n)=>{for(let i=0;i<n;i++)g.check.step()};
const tap=g=>{g.key('KeyD');tick(g,4);g.key('KeyD',false);tick(g,8)};
for(const limit of [9,13]){
 const g=make();g.api.limit(limit);for(let n=0;n<limit-1;n++)tap(g);assert.equal(g.api.zap().zaps,0);const before=g.check.peek().idle.zones[0].debt;tap(g);assert.equal(g.api.zap().zaps,1);assert(g.check.peek().idle.zones[0].debt-before>3.8);assert(g.api.zap().until>g.check.peek().sceneTime);assert(g.api.zap().limit>=9&&g.api.zap().limit<=13);
}
const smooth=make();for(let n=0;n<8;n++)tap(smooth);smooth.key('KeyD');tick(smooth,36);smooth.key('KeyD',false);tick(smooth,1);assert.equal(smooth.api.zap().count,0);assert.equal(smooth.api.zap().zaps,0);
const isolated=make();for(let n=0;n<16;n++){tap(isolated);tick(isolated,100)}assert.equal(isolated.api.zap().zaps,0,'Separated adjustments are not continuous jitter');
const guarded=make();guarded.api.limit(9);for(let n=0;n<8;n++)tap(guarded);guarded.api.zstep(.01,true);assert.equal(guarded.api.zap().count,0,'Protected waits reset accumulated jitter');
const edge=make();edge.api.limit(9);for(let n=0;n<8;n++)tap(edge);edge.api.debt(15);edge.key('KeyD');edge.api.zstep(.05);edge.key('KeyD',false);edge.api.zstep(.01);const zone=edge.check.peek().idle.zones[0];assert.equal(zone.phase,'warning');assert.equal(zone.warning,3,'Penalty crosses allowance into warning without losing seconds');
const store=new Map(),voice=make(store);assert.equal(voice.api.pool().length,25);const lines=Array.from({length:25},()=>voice.api.line());assert.equal(new Set(lines).size,25);assert.equal(voice.api.line(),lines[0]);assert.equal(make(store).api.line(),lines[1],'Comment rotation survives reload');
const limits=new Set();for(let i=0;i<100;i++)limits.add(make().api.zap().limit);assert.deepEqual([...limits].sort((a,b)=>a-b),[9,10,11,12,13]);
console.log('PASS jitter zap: 9–13 thresholds, four-second penalty and warning overflow, smooth movement, separated adjustments, protected waits, 25 persistent rotating comments');
