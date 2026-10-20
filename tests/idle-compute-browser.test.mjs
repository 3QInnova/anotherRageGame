import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {webkit,chromium} from '/private/tmp/exception-forecast-browser/node_modules/playwright/index.mjs';
const root=new URL('../',import.meta.url),out=new URL('outputs/idle-compute/',root);mkdirSync(out,{recursive:true});
const route=JSON.parse(readFileSync(new URL('chased-route.json',out),'utf8')),results=[];
for(const [name,engine,mobile] of [['iphone-webkit',webkit,true],['desktop-chromium',chromium,false]]){
 const html=readFileSync(new URL(mobile?'mobile/index.html':'initalDemoDocs/Exception_Human_Misclassification_V3.html',root),'utf8');
 const fixture=html.replace('requestAnimationFrame(frame);\n})();',`window.idleReview={tick:()=>runFrame(1/120),step(n){for(let i=0;i<n;i++)runFrame(1/120);draw();refreshHud()}};draw();refreshHud();\n})();`);
 const browser=await engine.launch();try{
  const page=await browser.newPage({viewport:mobile?{width:844,height:390}:{width:1280,height:900},isMobile:mobile,hasTouch:mobile,deviceScaleFactor:1});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.route('**/idle.html',r=>r.fulfill({body:fixture,contentType:'text/html'}));
  const start=async()=>{await page.goto('http://localhost/idle.html');await page.locator('#openDataCenters').click();await page.locator('#campaignIdleTrial').click();await page.evaluate(()=>window.idleReview.step(0));assert.equal(await page.evaluate(()=>window.__EXCEPTION_TEST__.getState().room),14);assert.equal(await page.evaluate(()=>window.__EXCEPTION_TEST__.getState().practiceMode),true)};
  const step=async n=>page.evaluate(n=>window.idleReview.step(n),n);
  await start();await page.locator('#idleComputePanel').waitFor({state:'visible'});
  // Reach ordinary ground past the first forecast using genuine movement and a required wait.
  await page.keyboard.down('KeyD');await step(112);await page.keyboard.up('KeyD');await step(145);await page.keyboard.down('KeyD');await step(112);await page.keyboard.up('KeyD');
  assert.equal(await page.evaluate(()=>window.__EXCEPTION_TEST__.getState().state),'play');
  await step(1920);assert.match(await page.locator('#idleComputeTitle').textContent(),/TERMINATION SCHEDULED/);await page.screenshot({path:new URL(name+'-warning.png',out).pathname,fullPage:true});
  await step(750);assert.match(await page.locator('#idleComputeTitle').textContent(),/TERMINATING/);await page.screenshot({path:new URL(name+'-cleanup.png',out).pathname,fullPage:true});
  if(mobile){
   for(const viewport of [{width:568,height:320},{width:667,height:375},{width:844,height:280},{width:956,height:440}]){
    await page.setViewportSize(viewport);await page.waitForTimeout(50);await step(0);
    const fit=await page.evaluate(()=>{const b=id=>document.getElementById(id).getBoundingClientRect();const panel=b('idleComputePanel'),credit=b('creditPanel'),left=b('movePad'),right=b('actionPad'),pause=b('mobilePause');const s=window.__EXCEPTION_TEST__.getState(),v=window.__MOBILE_UI_TEST__.viewport();const playerX=(s.player.x-s.cameraX)/v.width*innerWidth;return {topHud:panel.top<=32&&credit.top<=32&&Math.abs(panel.left+panel.width/2-innerWidth/2)<1,inside:panel.left>=0&&panel.right<=innerWidth&&panel.top>=0&&panel.bottom<=innerHeight,aboveControls:panel.bottom<Math.min(left.top,right.top),awayFromPause:panel.right<pause.left&&panel.left>credit.right,width:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight}});
    assert(fit.inside&&fit.aboveControls&&fit.awayFromPause&&fit.topHud,JSON.stringify(fit));assert(fit.width<=viewport.width&&fit.height<=viewport.height);
    await page.screenshot({path:new URL(name+'-'+viewport.width+'x'+viewport.height+'.png',out).pathname});
   }
   await page.setViewportSize({width:844,height:390});await page.locator('#mobilePause').tap();assert.equal(await page.locator('#idleComputePanel').isVisible(),false);
  }else await page.locator('#openDataCenters').click();
  const paused=await page.evaluate(()=>window.__IDLE_COMPUTE_TEST__.state());await step(1200);assert.deepEqual(await page.evaluate(()=>window.__IDLE_COMPUTE_TEST__.state()),paused);
  if(mobile)await page.locator('#mobileResume').tap();else await page.locator('#campaignClose').click();
  await step(1);assert.notDeepEqual(await page.evaluate(()=>window.__IDLE_COMPUTE_TEST__.state()),paused);
  await start();
  const completion=await page.evaluate(({events,frames})=>{
   let next=0,active=false,maintenance=false;
   for(let frame=0;frame<=frames;frame++){
    while(next<events.length&&events[next].frame===frame){const e=events[next++];document.dispatchEvent(new KeyboardEvent(e.down?'keydown':'keyup',{code:e.code,bubbles:true,cancelable:true}))}
    window.idleReview.tick();const state=window.__EXCEPTION_TEST__.getState();if(state.state==='dead')throw Error('Route died: '+document.getElementById('lossReason').textContent);
    active||=state.idleCompute?.phase==='cleanup';maintenance||=state.idleCompute?.phase==='maintenance';
   }
   window.idleReview.step(0);return {state:window.__EXCEPTION_TEST__.getState(),active,maintenance};
  },route);
  assert.equal(completion.state.state,'won');assert.equal(completion.state.deaths,0);assert(completion.active&&completion.maintenance);assert(completion.state.credits.balance>0);assert.deepEqual(errors,[]);
  await page.screenshot({path:new URL(name+'-cleared.png',out).pathname,fullPage:true});
  results.push({engine:name,practiceLaunch:true,visibleWarningAndDeletion:true,pauseSuspends:true,smallLayoutsFit:mobile,chasedRouteWon:true,creditsLeft:completion.state.credits.balance,pageErrors:errors});
 }finally{await browser.close()}
}
writeFileSync(new URL('browser-results.json',out),JSON.stringify(results,null,2)+'\n');console.log('PASS: WebKit and Chromium direct trial launch, visible warning/deletion, small mobile layouts, real pause freeze and full ordinary-input win with active cleanup.');
