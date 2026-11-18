import assert from 'node:assert/strict';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {load} from './data-centers.test.mjs';
import {clearLongCampaign} from './long-campaign-route.mjs';
export const longSource=readFileSync(new URL('../initalDemoDocs/Exception_Human_Misclassification_V3.html',import.meta.url),'utf8');
export function makeLong(id,storage){const g=load(longSource,storage);assert(g.api.start(id,true));g.check.seed(424242);return g}
if(import.meta.url===new URL(process.argv[1],'file://').href){
 const out=new URL('../outputs/long-campaign/',import.meta.url);mkdirSync(out,{recursive:true});
 const levels=load().api.levels(),routes=[],cautious=[];
 assert.equal(levels.length,20);assert(levels.every(l=>l.releaseCampaign&&l.unlimitedActions&&l.moveSpeed===265));
 assert(levels.every(l=>l.unreliableFlags));
 assert(levels.slice(0,10).every(l=>l.forecasts.length===0));assert.equal(levels[0].routeBeats.length,8);
 assert(levels.every(l=>l.idleCompute?.activation==='progress'));
 assert.deepEqual([...levels.filter(l=>l.idleCompute.zones.some(z=>Number.isFinite(z.warningAt))).map(l=>l.serverNumber)],[15,18,20]);
 for(const level of levels){
  assert(level.voice.length>=24);assert(level.acts.length>=3&&level.acts.length<=5);
  assert(level.idleCompute.zones.length>0);
  const g=makeLong(level.serverId);routes.push(clearLongCampaign(g));
  assert.equal(g.api.progress().cleared.length,0);
  const slow=makeLong(level.serverId);cautious.push(clearLongCampaign(slow,{fast:false}));
  assert(Math.abs(routes.at(-1).seconds-level.benchmarkSeconds)<.02,'Recorded benchmark '+level.serverId);
 }
 assert(levels[19].releaseCheckpoints.length===1);assert(levels[19].releaseFinale);
 assert(levels[17].stations.every(s=>s.count===2));
 const idle=makeLong('localhost-01');for(let i=0;i<120*30&&idle.state().state==='play';i++)idle.check.step();
 assert.equal(idle.state().state,'dead','Standing still must trigger cleanup and lose');
 const loss=makeLong('localhost-01');loss.check.die();loss.key('Enter');loss.key('Enter',false);assert.equal(loss.state().state,'dead');
 for(let i=0;i<120*30;i++)loss.check.step();assert.equal(loss.state().state,'dead');loss.key('Enter');loss.key('Enter',false);assert.equal(loss.state().state,'play');
 writeFileSync(new URL('routes.json',out),JSON.stringify(routes,null,2)+'\n');
 writeFileSync(new URL('runtime-results.json',out),JSON.stringify({routes,cautious,cleanMinutes:routes.reduce((n,r)=>n+r.seconds,0)/60,automatedOnly:true},null,2)+'\n');
 console.log('PASS: twenty release routes and cautious alternatives; one speed, staged teaching, progress-based idle cleanup, free actions, optional retry, no compaction. Clean minutes:',routes.reduce((n,r)=>n+r.seconds,0)/60);
}
