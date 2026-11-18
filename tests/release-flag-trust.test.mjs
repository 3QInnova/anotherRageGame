import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {load} from './data-centers.test.mjs';
const source=readFileSync(new URL('../initalDemoDocs/Exception_Human_Misclassification_V3.html',import.meta.url),'utf8').replace('window.__DATA_CENTER_TEST__={',`window.__DATA_CENTER_TEST__={learn:rememberRageHazard,roll(){resetRageRecall(false,'retry')},`);
const g=load(source);g.api.start('localhost-01',true);assert(g.api.levels().every(l=>l.unreliableFlags));
const level=g.check.level(),hazard=level.blocks[0]??level.spikes[0],geometry=JSON.stringify(level);
g.api.learn(hazard.id);g.labs.seedRecall(87411);g.api.roll();assert.equal(g.labs.recall().flags.length,1,'First learned flag always appears');
let accurate=0,wrong=0,missing=0,left=0,right=0;
for(let i=0;i<10000;i++){
 g.api.roll();const f=g.labs.recall().flags[0];if(!f){missing++;continue}
 if(f.offset===0){accurate++;assert.equal(f.x,hazard.x+hazard.w/2)}
 else {wrong++;assert(f.x<hazard.x||f.x>hazard.x+hazard.w,'Misleading flag is outside remembered trap');if(f.offset<0)left++;else right++}
}
const rate=accurate/(accurate+wrong);assert(rate>.38&&rate<.42);assert(missing>2500&&missing<3100);assert(left>1000&&right>1000);
const stable=JSON.stringify(g.labs.recall());for(let i=0;i<100;i++)g.check.draw();assert.equal(JSON.stringify(g.labs.recall()),stable);assert.equal(JSON.stringify(level),geometry);
console.log('PASS release flags: '+(rate*100).toFixed(2)+'% of shown flags accurate; '+missing+' / 10000 omitted; wrong flags outside trap on both sides; rendering stable; all 20 levels enabled; geometry unchanged');
