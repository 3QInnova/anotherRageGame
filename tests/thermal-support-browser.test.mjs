import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {webkit,chromium} from '/private/tmp/exception-forecast-browser/node_modules/playwright/index.mjs';
const root=new URL('../',import.meta.url),out=new URL('outputs/thermal-support/',root);mkdirSync(out,{recursive:true});
const route=JSON.parse(readFileSync(new URL('route.json',out),'utf8')),results=[];
for(const [name,engine,mobile] of [['iphone-webkit',webkit,true],['desktop-chromium',chromium,false]]){
 const html=readFileSync(new URL(mobile?'mobile/index.html':'initalDemoDocs/Exception_Human_Misclassification_V3.html',root),'utf8');
 const fixture=html.replace('requestAnimationFrame(frame);\n})();',`window.thermalReview={tick:()=>runFrame(1/120),paint(){draw();refreshHud()},step(n){for(let i=0;i<n;i++)runFrame(1/120);draw();refreshHud()}};draw();refreshHud();\n})();`);
 const browser=await engine.launch();try{
  const page=await browser.newPage({viewport:mobile?{width:844,height:390}:{width:1280,height:1000},isMobile:mobile,hasTouch:mobile,deviceScaleFactor:1});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.route('**/thermal.html',r=>r.fulfill({body:fixture,contentType:'text/html'}));
  const start=async()=>{await page.goto('http://localhost/thermal.html');await page.locator('#openDataCenters').click();await page.locator('#campaignCooling').click();await page.evaluate(route=>{window.thermalReplay={...route,at:0,frame:0,held:new Set()};window.thermalReview.paint()},route)};
  const advance=async target=>page.evaluate(({target,mobile})=>{
   const r=window.thermalReplay;
   const send=e=>{
    if(!mobile){document.dispatchEvent(new KeyboardEvent(e.down?'keydown':'keyup',{code:e.code,bubbles:true,cancelable:true}));return}
    if(/^Digit/.test(e.code)){
     if(!e.down)return;window.thermalReview.paint();const i=(Number(e.code.slice(-1))+9)%10;
     const b=document.getElementById('coolingGate'+i);if(b.disabled||b.hidden)throw Error('Switch must be available');b.click();return;
    }
    if(e.code==='KeyX'){if(e.down){window.thermalReview.paint();const b=document.getElementById('coolingRotate');if(b.disabled)throw Error('Selected gate must be rotatable');b.click()}return}
    if(e.down===r.held.has(e.code))return;if(e.down)r.held.add(e.code);else r.held.delete(e.code);
    const [selector,pointerId]=e.code==='KeyD'?['[data-hold="right"]',11]:['#touchjump',13];document.querySelector(selector).dispatchEvent(new PointerEvent(e.down?'pointerdown':'pointerup',{pointerId,pointerType:'touch',bubbles:true,cancelable:true}));
   };
   for(;r.frame<=r.frames;r.frame++){
    while(r.at<r.events.length&&r.events[r.at].frame===r.frame)send(r.events[r.at++]);
    if(r.frame<r.frames)window.thermalReview.tick();
    const s=window.__EXCEPTION_TEST__.getState(),c=window.__COOLING_TEST__.state();
    if(s.state==='dead')throw Error('Thermal route died: '+document.getElementById('lossReason').textContent);
    if(target>=0&&c[target].occupied&&!c[target].solved&&s.player.grounded){r.frame++;window.thermalReview.paint();return {state:s,circuit:c}}
   }
   window.thermalReview.paint();return {state:window.__EXCEPTION_TEST__.getState(),circuit:window.__COOLING_TEST__.state(),progress:window.__DATA_CENTER_TEST__.progress(),credits:window.__CREDIT_TEST__.total()};
  },{target,mobile});
  await start();
  for(let index=0;index<3;index++){
   const milestone=await advance(index);assert.equal(milestone.state.idleCompute.phase,'circuit');assert.equal(await page.locator('#coolingPanel').isVisible(),true);assert.equal(await page.locator('#idleComputeTitle').textContent(),'CIRCUIT DECK');
   const before=await page.evaluate(index=>window.__COOLING_TEST__.state()[index].rotations,index);
   assert.equal(await page.locator('#coolingRotate').isDisabled(),true);
   if(mobile)assert.equal(await page.locator('#glitch').textContent(),'PICK GATE');
   for(const selected of [0,2]){
    if(mobile)await page.locator('#coolingGate'+selected).tap();else await page.locator('#coolingGate'+selected).click();
    assert.deepEqual(await page.evaluate(index=>window.__COOLING_TEST__.state()[index].rotations,index),before,'Tapping selects without rotating');
    assert.equal(await page.locator('#coolingGate'+selected).getAttribute('aria-pressed'),'true');
    assert.match(await page.locator('#coolingRotate').textContent(),new RegExp('ROTATE U'+(selected+1)));
   }
   for(let turn=0;turn<4;turn++){
    if(mobile)await page.locator(turn===0?'#glitch':'#coolingRotate').tap();else if(turn===0){await page.locator('#coolingRotate').focus();await page.keyboard.press('Enter')}else await page.locator('#coolingRotate').click();
    assert.equal(await page.evaluate(index=>window.__COOLING_TEST__.state()[index].selected,index),2,'Rotation retains explicit selection');
    if(turn===0)assert.notDeepEqual(await page.evaluate(index=>window.__COOLING_TEST__.state()[index].rotations,index),before);
   }
   assert.deepEqual(await page.evaluate(index=>window.__COOLING_TEST__.state()[index].rotations,index),before);
   // Pick a visible paper gate itself, independently of the labeled controls.
   const paperTarget=await page.evaluate(mobile=>{
    const r=window.__COOLING_TEST__.rects()[0],s=window.__EXCEPTION_TEST__.getState(),v=mobile?window.__MOBILE_UI_TEST__.viewport():{top:0,height:540},b=document.getElementById('game').getBoundingClientRect(),scale=b.height/v.height;
    return {x:b.left+(r.x+r.w/2-s.cameraX)*scale,y:b.top+(r.y+r.h/2-v.top)*scale};
   },mobile);
   if(paperTarget.y>70){await page.mouse.click(paperTarget.x,paperTarget.y);assert.equal(await page.evaluate(index=>window.__COOLING_TEST__.state()[index].selected,index),0,'Paper gate hit picks the matching IC');assert.deepEqual(await page.evaluate(index=>window.__COOLING_TEST__.state()[index].rotations,index),before)}
   if(index===0||index===2){
    for(const viewport of mobile?[{width:568,height:320},{width:667,height:375},{width:844,height:280},{width:956,height:440}]:[{width:1280,height:1000}]){
     await page.setViewportSize(viewport);await page.waitForTimeout(35);await page.evaluate(()=>window.thermalReview.paint());
     const fit=await page.evaluate(mobile=>{const box=id=>document.getElementById(id).getBoundingClientRect(),p=box('coolingPanel'),inspector=document.querySelector('.cooling-inspector').getBoundingClientRect(),hud=box('idleComputePanel'),stage=box('stage');const overlays=[p,inspector];const overlap=(a,b)=>a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;const controls=mobile?[box('movePad'),box('actionPad')]:[];return {inside:overlays.every(r=>r.left>=0&&r.right<=innerWidth&&r.top>=stage.top&&(!mobile||r.bottom<=innerHeight)),belowHud:overlays.every(r=>r.top>=hud.bottom),awayFromThumbs:controls.every(c=>overlays.every(r=>!overlap(r,c))),buttons:[...document.querySelectorAll('.cooling-board button,#coolingRotate')].filter(b=>!b.hidden).every(b=>{const r=b.getBoundingClientRect();return r.width>=44&&r.height>=44}),playerVisible:!mobile||(()=>{const s=window.__EXCEPTION_TEST__.getState(),v=window.__MOBILE_UI_TEST__.viewport(),canvas=box('game'),scale=canvas.height/v.height;return overlays.every(r=>!overlap(r,{left:canvas.left+(s.player.x-s.cameraX)*scale,right:canvas.left+(s.player.x-s.cameraX+24)*scale,top:canvas.top+(s.player.y-v.top)*scale,bottom:canvas.top+(s.player.y+34-v.top)*scale}))})(),overflow:document.documentElement.scrollWidth>innerWidth}},mobile);
     assert(fit.inside&&fit.belowHud&&fit.awayFromThumbs&&fit.buttons&&fit.playerVisible&&!fit.overflow,JSON.stringify({viewport,fit}));await page.screenshot({path:new URL(name+'-'+[3,6,10][index]+'-switches-'+viewport.width+'x'+viewport.height+'.png',out).pathname,fullPage:true});
    }
    if(mobile)await page.setViewportSize({width:844,height:390});
   }
   await page.screenshot({path:new URL(name+'-'+[3,6,10][index]+'-gates.png',out).pathname,fullPage:true});
  }
  const finish=await advance(-1);assert.equal(finish.state.state,'won');assert.equal(finish.state.deaths,0);assert.equal(finish.state.credits.balance,4);assert(finish.circuit.every(s=>s.solved));assert.equal(finish.progress.cleared.length,0);assert.equal(finish.credits,0);
  if(mobile)await page.locator('#mobileWinRestart').click();else await page.keyboard.press('KeyR');assert.equal(await page.evaluate(()=>window.__COOLING_TEST__.state().filter(s=>s.solved).length),0);
  await start();await advance(0);if(mobile)await page.locator('#mobilePause').tap();else await page.locator('#openDataCenters').click();assert.equal(await page.locator('#coolingPanel').isVisible(),false);const frozen=await page.evaluate(()=>({p:window.__EXCEPTION_TEST__.getState(),c:window.__COOLING_TEST__.state()}));await page.evaluate(()=>window.thermalReview.step(1200));assert.deepEqual(await page.evaluate(()=>({p:window.__EXCEPTION_TEST__.getState(),c:window.__COOLING_TEST__.state()})),frozen);
  await start();await advance(0);
  await page.evaluate(mobile=>{
   if(mobile)document.querySelector('[data-hold="right"]').dispatchEvent(new PointerEvent('pointerup',{pointerId:11,pointerType:'touch',bubbles:true}));else document.dispatchEvent(new KeyboardEvent('keyup',{code:'KeyD',bubbles:true}));
   document.getElementById('coolingGate0').click();document.getElementById('coolingRotate').click();
   window.powerPulseStart=getComputedStyle(document.querySelector('#coolingBoard .wire-pulse')).strokeDashoffset;
   window.thermalReview.step(30);
  },mobile);
  assert(await page.evaluate(()=>getComputedStyle(document.querySelector('#coolingBoard .wire-pulse')).strokeDashoffset!==window.powerPulseStart),'Live power pulses advance with simulation time');
  assert.equal(await page.evaluate(()=>window.__COOLING_TEST__.state()[0].route.grounded),true);assert.equal(await page.locator('#idleComputeTitle').textContent(),'GROUND FAULT');await page.screenshot({path:new URL(name+'-ground-warning.png',out).pathname,fullPage:true});
  await page.evaluate(()=>window.thermalReview.step(48));assert.equal(await page.evaluate(()=>window.__EXCEPTION_TEST__.getState().state),'dead');assert.match(await page.locator('#lossReason').textContent(),/GROUND FAULT/);await page.screenshot({path:new URL(name+'-electrocuted.png',out).pathname,fullPage:true});
  await page.evaluate(()=>window.thermalReview.step(1200));assert.equal(await page.evaluate(()=>window.__EXCEPTION_TEST__.getState().state),'dead');await page.locator('#lossContinue').click();await page.locator('#lossContinue').click();assert.equal(await page.evaluate(()=>window.__EXCEPTION_TEST__.getState().state),'play');assert.equal(await page.evaluate(()=>window.__COOLING_TEST__.state()[0].route.grounded),false);
  assert.deepEqual(errors,[]);results.push({engine:name,gateCounts:[3,6,10],selectThenRotate:true,persistentSelectedGate:true,paperGateSelection:true,livePowerPulseVerified:true,liveGroundFaultAndElectrocution:true,realSwitchClick:true,phoneLayoutsFit:mobile,touchMovementAndSwitchReplay:mobile,chasedClear:true,deaths:0,creditsLeft:4,pauseFrozen:true,practiceIsolated:true,restartSameLevel:true,errors});
 }finally{await browser.close()}
}
writeFileSync(new URL('browser-results.json',out),JSON.stringify(results,null,2)+'\n');console.log('PASS: Thermal Support WebKit touch and Chromium keyboard/click clears, real logic symbols, explicit selection and named rotation, live ground/electrocution, real switch taps, free-deck HUD, small layouts, pause, practice isolation and restart.');
