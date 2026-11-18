import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {load} from './data-centers.test.mjs';
import {clearLongCampaign} from './long-campaign-route.mjs';
const source=readFileSync(new URL('../initalDemoDocs/Exception_Human_Misclassification_V3.html',import.meta.url),'utf8');
const fixture=source.replace('window.__DATA_CENTER_TEST__={',`window.__DATA_CENTER_TEST__={position(x){player.x=x;player.y=FLOOR-PH;player.grounded=true},spend:()=>spendCredit('jumps'),balance(n){credits.balance=n},restart:restartCampaignRun,`);
const tap=(g,k)=>{g.key(k);g.key(k,false)},tick=(g,n=1)=>{for(let i=0;i<n;i++)g.check.step()};
const free=load(fixture);free.api.start('localhost-01');free.api.balance(0);for(let i=0;i<100;i++)assert(free.api.spend());assert.equal(free.state().state,'play');
const storage=new Map([['exception-data-centers-v1',JSON.stringify({schemaVersion:1,cleared:Array.from({length:19},(_,i)=>'localhost-'+String(i+1).padStart(2,'0')),currentServerId:'localhost-20'})]]);
const g=load(fixture,storage);g.api.start('localhost-20');const STOP=Symbol(),step=g.check.step;
g.check.step=()=>{step();if(g.release.record().checkpoints['localhost-20']===0)throw STOP};
assert.throws(()=>clearLongCampaign(g),e=>e===STOP);g.check.step=step;
const checkpoint=g.check.level().releaseCheckpoints[0];assert(g.state().player.x>=checkpoint);
g.check.die();tick(g,250);tap(g,'Enter');assert.equal(g.state().player.x,checkpoint,'Death returns to checkpoint');
const reload=load(fixture,storage);reload.api.start('localhost-20');assert.equal(reload.state().player.x,checkpoint,'Relaunch restores safe midpoint');
clearLongCampaign(reload);assert.equal(reload.release.record().checkpoints['localhost-20'],undefined);assert.equal(reload.api.progress().cleared.length,20);assert(reload.rewards.badges().includes('center-localhost'));
// Expiry cannot permanently lock the final door. This fixture isolates the audit, not route completion.
const door=load(fixture);door.api.start('localhost-20',true);door.api.position(door.check.level().auditX+2);tick(door);assert(door.state().doorLocked);tap(door,'KeyX');assert(!door.state().doorLocked);tick(door,300);tap(door,'KeyX');assert(door.state().glitch.exit>door.state().sceneTime);
// Optional records persist separately and never award campaign clears or money.
for(const id of ['forecast','recall']){
 const c=load(fixture,storage),before=storage.get('exception-rewards-v1');assert(c.release.startChallenge(id));const route=clearLongCampaign(c);assert(c.release.record().challenges[id].bestSeconds>0);assert.equal(c.release.record().challenges[id].bestDeaths,0);assert.equal(storage.get('exception-rewards-v1'),before);assert(load(fixture,storage).release.record().challenges[id]);console.log('CHALLENGE',id,route.seconds);
}
const denied=new Map();denied.get=denied.set=()=>{throw Error('Denied')};const fallback=load(fixture,denied);fallback.api.start('localhost-01');clearLongCampaign(fallback);assert.equal(fallback.api.progress().cleared.length,1);
const corrupt=new Map([['exception-localhost-release-v1',JSON.stringify({version:1,checkpoints:{'localhost-20':999},challenges:{glass:{bestSeconds:-1,bestDeaths:-1}}})]]);assert.equal(Object.keys(load(fixture,corrupt).release.record().checkpoints).length,0);
console.log('PASS: free actions at zero, ordinary-input checkpoint activation, retry/reload recovery, finale audit expiry/rewrite, completion badge, challenge records/isolation, unavailable/corrupt storage.');
