import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {load} from './data-centers.test.mjs';
const source=readFileSync(new URL('../initalDemoDocs/Exception_Human_Misclassification_V3.html',import.meta.url),'utf8').replace('window.__DATA_CENTER_TEST__={',`window.__DATA_CENTER_TEST__={hud:refreshHud,arm(id){trap[id].phase='armed';trap[id].t=0},position(x,y=FLOOR){player.x=x;player.y=y-PH;player.vy=0;player.grounded=true},`);
const make=()=>{const g=load(source);g.api.start('localhost-01',true);return g};
const tick=(g,n=1)=>{for(let i=0;i<n;i++)g.check.step()};
const debt=g=>g.check.peek().idle.zones[0].debt;
const tiny=make();tick(tiny,840);tiny.key('KeyD');tick(tiny,4);tiny.key('KeyD',false);assert(debt(tiny)>6,'Tiny taps cannot reset seven seconds of debt');const before=debt(tiny);tiny.key('KeyD');tick(tiny,90);tiny.key('KeyD',false);assert(debt(tiny)<before,'Sustained new forward progress recovers time');
for(const mode of ['still','creep','wiggle','jump']){
 const g=make();let n=0;
 while(g.check.peek().state==='play'&&n++<80){
  if(mode==='creep'||mode==='wiggle'){g.key('KeyD');tick(g);g.key('KeyD',false)}
  if(mode==='wiggle'){g.key('KeyA');tick(g);g.key('KeyA',false)}
  if(mode==='jump'){g.key('Space');g.key('Space',false)}
  tick(g,59);
 }
 assert.equal(g.check.peek().state,'dead',mode+' must lose');assert.match(g.nodes.get('lossReason').textContent,/IDLE COMPUTE/);
 const frozen=JSON.stringify(g.check.peek().idle);tick(g,120);assert.equal(JSON.stringify(g.check.peek().idle),frozen,'Death freezes timer');
}
const paused=make();tick(paused,600);paused.api.open();const frozen=JSON.stringify(paused.check.peek().idle);tick(paused,3600);assert.equal(JSON.stringify(paused.check.peek().idle),frozen);paused.api.close();tick(paused);assert.notEqual(JSON.stringify(paused.check.peek().idle),frozen);
const bay=make(),b=bay.check.level().idleCompute.bays[0];bay.api.position(b.start+30);tick(bay,7200);assert.equal(bay.check.peek().state,'play');assert.equal(bay.check.peek().idle.phase,'maintenance');
const wait=make();wait.api.start('localhost-11',true);const hazard=wait.check.level().forecasts[0];wait.api.position(hazard.trigger-30);wait.api.arm(hazard.id);tick(wait);assert(wait.check.peek().idle.waiting,'Armed hazard wait is protected');const waitDebt=debt(wait);tick(wait,12);assert.equal(debt(wait),waitDebt,'Required wait freezes debt');
const puzzle=make();puzzle.api.start('localhost-18',true);const station=puzzle.check.level().stations[0];puzzle.api.position(station.x+30,station.y);tick(puzzle);assert(puzzle.check.peek().idle.waiting,'Puzzle deck suspends pressure');const puzzleDebt=JSON.stringify(puzzle.check.peek().idle.zones);tick(puzzle,3600);assert.equal(JSON.stringify(puzzle.check.peek().idle.zones),puzzleDebt,'Puzzle-solving time is protected');
const hud=make();tick(hud,120);hud.api.hud();assert.match(hud.nodes.get('idleComputeCaption').textContent,/Keep moving.*15\.0s/);
console.log('PASS release idle: tiny taps, creeping, wiggling and jumping cannot bypass pressure; forward recovery, pause, death, maintenance, visible countdown');
