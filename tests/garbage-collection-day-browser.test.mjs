import {openModeMenu} from './browser-controls.mjs';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {webkit,chromium} from '/private/tmp/exception-forecast-browser/node_modules/playwright/index.mjs';
const root=new URL('../',import.meta.url),out=new URL('outputs/garbage-collection-day/',root);mkdirSync(out,{recursive:true});
const route=JSON.parse(readFileSync(new URL('chased-route.json',out),'utf8')),results=[];
for(const [name,engine,mobile] of [['iphone-webkit',webkit,true],['desktop-chromium',chromium,false]]){
 const html=readFileSync(new URL(mobile?'mobile/index.html':'initalDemoDocs/Exception_Human_Misclassification_V3.html',root),'utf8');
 const fixture=html.replace('requestAnimationFrame(frame);\n})();',`window.gcReview={tick:()=>runFrame(1/120),step(n){for(let i=0;i<n;i++)runFrame(1/120);draw();refreshHud()}};draw();refreshHud();\n})();`);
 const browser=await engine.launch();try{
  const page=await browser.newPage({viewport:mobile?{width:844,height:390}:{width:1280,height:900},isMobile:mobile,hasTouch:mobile,deviceScaleFactor:1});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.route('**/garbage.html',r=>r.fulfill({body:fixture,contentType:'text/html'}));
  const step=n=>page.evaluate(n=>window.gcReview.step(n),n);
  const start=async()=>{await page.goto('http://localhost/garbage.html');await openModeMenu(page,'#openDataCenters');await page.locator('#campaignTab-practice').click();await page.locator('#campaignGarbageCollection').click();await step(0)};
  await start();assert.equal(await page.locator('#idleComputeTitle').textContent(),'GARBAGE COLLECTION DAY');assert.match(await page.locator('#idleComputeCaption').textContent(),/16.0s/);assert.equal(await page.evaluate(()=>window.__EXCEPTION_TEST__.getState().practiceMode),true);
  await page.screenshot({path:new URL(name+'-start.png',out).pathname,fullPage:true});await step(1980);assert.match(await page.locator('#idleComputeTitle').textContent(),/TERMINATION SCHEDULED/);
  for(const viewport of mobile?[{width:568,height:320},{width:667,height:375},{width:844,height:280},{width:956,height:440}]:[{width:1280,height:900}]){
   await page.setViewportSize(viewport);await page.waitForTimeout(50);await step(0);
   const fit=await page.evaluate(()=>{const b=id=>document.getElementById(id).getBoundingClientRect(),panel=b('idleComputePanel'),credit=b('creditPanel'),pause=document.getElementById('mobilePause')?b('mobilePause'):null;return panel.left>credit.right&&(!pause||panel.right<pause.left)&&panel.top>=0&&panel.bottom<=innerHeight&&document.documentElement.scrollWidth<=innerWidth});assert(fit);
   await page.screenshot({path:new URL(name+'-warning-'+viewport.width+'x'+viewport.height+'.png',out).pathname,fullPage:true});
  }
  if(mobile)await page.setViewportSize({width:844,height:390});await step(660);assert.equal(await page.evaluate(()=>window.__EXCEPTION_TEST__.getState().state),'play');await step(120);
  assert.match(await page.locator('#idleComputeTitle').textContent(),/TERMINATING/);await page.screenshot({path:new URL(name+'-deleting.png',out).pathname,fullPage:true});
  if(mobile)await page.locator('#mobilePause').tap();else await openModeMenu(page,'#openDataCenters');
  const frozen=await page.evaluate(()=>window.__IDLE_COMPUTE_TEST__.state());await step(1200);assert.deepEqual(await page.evaluate(()=>window.__IDLE_COMPUTE_TEST__.state()),frozen);
  await start();
  const replay=await page.evaluate(({events,frames,mobile})=>{
   let next=0;const active=new Set(),held=new Set();
   const send=e=>{
    if(!mobile){document.dispatchEvent(new KeyboardEvent(e.down?'keydown':'keyup',{code:e.code,bubbles:true,cancelable:true}));return}
    if(e.down===held.has(e.code))return;if(e.down)held.add(e.code);else held.delete(e.code);
    const [selector,pointerId]=e.code==='KeyD'?['[data-hold="right"]',11]:['#touchjump',13];document.querySelector(selector).dispatchEvent(new PointerEvent(e.down?'pointerdown':'pointerup',{pointerId,pointerType:'touch',bubbles:true,cancelable:true}));
   };
   for(let frame=0;frame<=frames;frame++){
    while(next<events.length&&events[next].frame===frame)send(events[next++]);window.gcReview.tick();
    const s=window.__EXCEPTION_TEST__.getState();if(s.state==='dead')throw Error(document.getElementById('lossReason').textContent);if(s.idleCompute.phase==='cleanup')active.add(s.idleCompute.zone);
   }
   window.gcReview.step(0);return {state:window.__EXCEPTION_TEST__.getState(),chases:active.size,progress:window.__DATA_CENTER_TEST__.progress(),creditTotal:window.__CREDIT_TEST__.total()};
  },{...route,mobile});
  assert.equal(replay.state.state,'won');assert.equal(replay.state.deaths,0);assert.equal(replay.chases,3);assert.equal(replay.state.credits.balance,4);assert.equal(replay.progress.cleared.length,0);assert.equal(replay.creditTotal,0);
  await page.screenshot({path:new URL(name+'-escaped.png',out).pathname,fullPage:true});
  if(mobile)await page.locator('#mobileWinRestart').click();else await page.keyboard.press('KeyR');await step(0);assert.equal(await page.locator('#idleComputeTitle').textContent(),'GARBAGE COLLECTION DAY');
  assert.deepEqual(errors,[]);results.push({engine:name,directMenuLaunch:true,warningAndDeletionVisible:true,pauseFrozen:true,phoneLayoutsFit:mobile,threeChasesEscaped:true,pointerReplay:mobile,practiceIsolated:true,restartSameLevel:true,errors});
 }finally{await browser.close()}
}
writeFileSync(new URL('browser-results.json',out),JSON.stringify(results,null,2)+'\n');console.log('PASS: Garbage Collection Day WebKit touch and Chromium keyboard three-chase wins, visible countdown/deletion, responsive HUD, pause, isolation and same-level restart.');
