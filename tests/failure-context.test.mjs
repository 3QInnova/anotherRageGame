import assert from 'node:assert/strict';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {load} from './data-centers.test.mjs';
const source=readFileSync(new URL('../initalDemoDocs/Exception_Human_Misclassification_V3.html',import.meta.url),'utf8');
const fixture=source.replace('window.__DATA_CENTER_TEST__={',`window.__DATA_CENTER_TEST__={
 impact(family,id){
  const h=[...L.spikes,...L.crumble,...L.blocks,...L.forecasts,...L.pits,...L.secretPads,...(L.walls??[])].find(h=>h.id===id);if(!h)throw Error('Missing test hazard');
  player.x=h.x+Math.max(1,(h.w-PW)/2);player.y=FLOOR-PH;player.vy=0;player.grounded=false;
  if(family==='scan'||family==='air-scan'){const r=scanRect(h);player.y=r.y+5;trap[id].phase='on'}
  if(family==='policy'){trap[id].phase='on';trap[id].t=sceneTime;trap[id].until=sceneTime+1.35;player.y=noticeTop(h)+16}
  if(family==='forecast'){trap[id].phase='on';trap[id].x=h.x;trap[id].until=sceneTime+.58}
  if(['redaction','bridge','fall','recovery'].includes(family)){fallCause=id;player.y=H+20;if(trap[id])trap[id].phase='on'}
 },
 lose:die,
 `);
const tap=(g,c)=>{g.key(c);g.key(c,false)},step=(g,n=1)=>{for(let i=0;i<n;i++)g.check.step()};
const rows=[],catalog=load().api.levels();let classified=0;
for(const level of catalog){
 const g=load();g.api.start(level.serverId,true);
 for(const [family,hazards] of [['redaction',level.crumble],['policy',level.blocks],['forecast',level.forecasts],['secret',level.secretPads],['wall',level.walls]]){
  for(const h of hazards){assert.equal(g.voice.family(h.id),family,level.serverId+' '+h.id);classified++}
 }
 for(const h of level.spikes){assert.equal(g.voice.family(h.id),h.sky?'air-scan':'scan');classified++}
 for(const h of level.pits){const expected=h.bridge?'bridge':level.betrayals.some(b=>b.x===h.x)?'recovery':'fall';assert.equal(g.voice.family(h.id,'','support'),expected);classified++}
 // These staged collision fixtures exercise the real simulation and die(), rather than calling the text selector alone.
 const cases=[...['scan','air-scan'].map(f=>[f,level.spikes.find(h=>!!h.sky===(f==='air-scan'))]),['policy',level.blocks[0]],['forecast',level.forecasts[0]],['redaction',level.crumble[0]],['bridge',level.pits.find(h=>h.bridge)],['fall',level.pits.find(h=>!h.bridge&&!level.betrayals.some(b=>b.x===h.x))],['wall',level.walls[0]],['recovery',level.pits.find(h=>level.betrayals.some(b=>b.x===h.x))]];
 for(const [family,h] of cases){if(!h)continue;
  const p=load(fixture);p.api.start(level.serverId,true);p.api.impact(family,h.id);step(p);assert.equal(p.state().state,'dead',family+' '+h.id);step(p,240);
  const last=p.voice.last();assert.equal(last.family,family,h.id);assert(p.voice.pools()[family].includes(p.nodes.get('ovDesc').textContent));assert.equal(p.nodes.get('line').textContent,last.remark);assert.equal(p.nodes.get('lossReason').textContent,last.reason);assert(!/body|geometry|skull/i.test(last.reason));
  rows.push({server:level.serverId,family,id:h.id,remark:last.remark,reason:last.reason});
 }
}
// Ordinary-input failures reproduce the reported mismatch without repositioning the player.
const natural=[];
function waitDeath(g){for(let i=0;i<1800&&g.state().state==='play';i++)g.check.step();assert.equal(g.state().state,'dead');natural.push(g.voice.last());return g.voice.last()}
const low=load();low.api.start('localhost-01',true);low.key('KeyD');assert.equal(waitDeath(low).family,'scan');
const air=load();air.demos.start('demo-memory-not-found');air.key('KeyD');while(air.state().player.x<300)step(air);air.key('KeyD',false);tap(air,'Space');air.key('KeyD');assert.equal(waitDeath(air).family,'air-scan');assert(!/floor|ground|bridge|gravity|save/i.test(air.voice.last().remark));
const receipt=load();receipt.demos.start('demo-express-checkout');receipt.key('KeyD');assert.equal(waitDeath(receipt).family,'policy');
const deleted=load();deleted.demos.start('demo-do-not-move');deleted.key('KeyD');while(deleted.state().player.x<380)step(deleted);deleted.key('KeyD',false);assert.equal(waitDeath(deleted).family,'redaction');
// Repeated real impacts on the same upper scan exhaust 32 jokes before repeating; cause wording rotates too.
const storage=new Map(),rotation=load(fixture,storage);rotation.api.start('localhost-13',true);const high=rotation.check.level().spikes.find(h=>h.sky),jokes=[],causes=[];
for(let i=0;i<33;i++){rotation.api.impact('air-scan',high.id);step(rotation);jokes.push(rotation.voice.last().remark);causes.push(rotation.voice.last().reason);step(rotation,240);tap(rotation,'Enter');tap(rotation,'Enter')}
assert.equal(new Set(jokes.slice(0,32)).size,32);assert.equal(jokes[0],jokes[32]);assert.equal(new Set(causes.slice(0,6)).size,6);
const reloaded=load(fixture,storage);reloaded.api.start('localhost-13',true);reloaded.api.impact('air-scan',high.id);step(reloaded);assert.equal(reloaded.voice.last().remark,jokes[1]);assert.notEqual(reloaded.voice.last().reason,causes[32]);
// Thermal shock/burn and cleanup retain the existing dedicated pools; unknown failures are neutral.
for(const [id,family] of [['puzzle-shock','puzzle-shock'],['cooling-shock','cooling-shock'],['cooling-burn','cooling-loss'],['compute-cleanup','idle-loss'],['presence-cleanup','presence-loss'],['review','unknown']])assert.equal(reloaded.voice.family(id),family);
assert.equal(reloaded.voice.family('commit-spot','SPOT INSTANCE: floor lease expired'),'deadline');assert.equal(reloaded.voice.family('commit-batch','BATCH TIMEOUT'),'deadline');
const data=JSON.parse(readFileSync(new URL('../campaign/failure-voice.json',import.meta.url),'utf8'));for(const text of data['air-scan'].remarks)assert(!/floor|ground|bridge|gravity|save|skull|geometry/i.test(text),text);
const out=new URL('../outputs/failure-voice/',import.meta.url);mkdirSync(out,{recursive:true});writeFileSync(new URL('results.json',out),JSON.stringify({classifiedHazards:classified,realSimulationImpacts:rows.length,naturalInputFailures:natural,upperScannerJokes:32,upperCauseVariants:6,rotationPersists:true,readingPauseUnchanged:true,impacts:rows},null,2)+'\n');
console.log('PASS:',classified,'campaign hazard identities;',rows.length,'real collision/fall fixtures across 20 servers; natural scan/air/notice/redaction failures; 32-joke cycles, varied factual causes and reload persistence.');
