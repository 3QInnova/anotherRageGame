import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {load} from './data-centers.test.mjs';
import {clearLongCampaign} from './long-campaign-route.mjs';
const routes=[];
for(const id of ['forecast','recall','glass','puzzle']){
 const store=new Map(),g=load(undefined,store);g.release.startChallenge(id);
 const tick=()=>{g.check.step();assert.notEqual(g.state().state,'dead')};
 const until=fn=>{let n=0;while(!fn()){tick();assert(++n<5000)}};
 const tap=k=>{g.key(k);g.key(k,false)},walk=x=>{g.key('KeyD');until(()=>g.state().player.x>=x);g.key('KeyD',false)},jump=x=>{tap('Space');walk(x);until(()=>g.state().player.grounded)};
 if(['forecast','recall'].includes(id)){const route=clearLongCampaign(g);routes.push({...route,id});continue}
 if(id==='glass'){
  walk(140);jump(230);walk(272);jump(378);jump(530);walk(580);jump(720);walk(730);jump(800);walk(816);jump(920);jump(1060);walk(1150);until(()=>g.state().player.grounded);jump(1240);
  const hidden=g.check.level().glass.filter(p=>p.hidden);for(let i=1;i<hidden.length;i++){walk(hidden[i-1].x+hidden[i-1].w-38);jump(hidden[i].x+20)}walk(hidden.at(-1).x+hidden.at(-1).w-38);jump(2290);
 }else{
  for(const station of g.check.level().stations){
   walk(station.x-80);tap('Space');g.key('KeyD');until(()=>g.puzzle.open());g.key('KeyD',false);
   const box=g.puzzle.state().find(s=>s.id===g.puzzle.open());let answer;
   for(let mask=0;mask<2**box.board.count;mask++){const bits=Array.from({length:box.board.count},(_,i)=>!!(mask&(1<<i))),value=g.puzzle.evaluate(box.board,bits);if(value.fan&&!value.ground){answer=bits;break}}
   assert(answer);answer.forEach((b,i)=>{if(b!==box.bits[i])tap('Digit'+(i+1))});tap('Enter');until(()=>g.puzzle.state().find(s=>s.id===station.id).solved);tap('Escape');walk(station.x+station.w-42);jump(station.sink.x+station.sink.w+70);
  }
 }
 g.key('KeyD');until(()=>g.state().state==='won');g.key('KeyD',false);
 assert.equal(g.state().deaths,0);assert.equal(g.api.progress().cleared.length,0);assert.equal(g.rewards.bank(),0);assert.equal(g.release.record().challenges[id].bestDeaths,0);
 routes.push({id,frames:g.frame(),events:g.route,seconds:g.frame()/120,markers:[]});
}
const out=new URL('../outputs/release/',import.meta.url);mkdirSync(out,{recursive:true});writeFileSync(new URL('challenge-routes.json',out),JSON.stringify(routes,null,2));
console.log('PASS: all four challenges clear through ordinary inputs, with separate mastery records and no campaign/Token awards.');
