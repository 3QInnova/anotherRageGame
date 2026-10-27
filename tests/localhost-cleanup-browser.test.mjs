import {openModeMenu} from './browser-controls.mjs';
import assert from 'node:assert/strict';
import {archivedCampaign} from './archived-campaign-fixture.mjs';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {webkit,chromium} from '/private/tmp/exception-forecast-browser/node_modules/playwright/index.mjs';
const root=new URL('../',import.meta.url),out=new URL('outputs/localhost-cleanup/',root);mkdirSync(out,{recursive:true});
const routes=JSON.parse(readFileSync(new URL('routes.json',out),'utf8')),results=[];
for(const [name,engine,mobile] of [['iphone-webkit',webkit,true],['desktop-chromium',chromium,false]]){
 const html=readFileSync(new URL(mobile?'mobile/index.html':'initalDemoDocs/Exception_Human_Misclassification_V3.html',root),'utf8');
 const fixture=archivedCampaign(html).replace('requestAnimationFrame(frame);\n})();',`window.cleanupReview={tick:()=>runFrame(1/120),step(n){for(let i=0;i<n;i++)runFrame(1/120);draw();refreshHud()}};draw();refreshHud();\n})();`);
 const browser=await engine.launch();try{
  const page=await browser.newPage({viewport:mobile?{width:844,height:390}:{width:1280,height:900},isMobile:mobile,hasTouch:mobile,deviceScaleFactor:1});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.route('**/cleanup.html',r=>r.fulfill({body:fixture,contentType:'text/html'}));
  const step=n=>page.evaluate(n=>window.cleanupReview.step(n),n);
  const start=async index=>{await page.goto('http://localhost/cleanup.html');await openModeMenu(page,'#openDataCenters');assert.match(await page.locator('#campaignCenterStatus').textContent(),/Idle cleanup on every server/);await page.locator('#campaignPractice').check();await page.locator('#campaignServers button').nth(index).click();await step(0)};
  await start(0);assert.equal(await page.locator('#idleComputePanel').isVisible(),true);
  await step(1980);assert.equal(await page.locator('#idleComputeTitle').textContent(),'TERMINATION SCHEDULED');
  for(const viewport of mobile?[{width:568,height:320},{width:667,height:375},{width:844,height:280},{width:844,height:390},{width:956,height:440}]:[{width:1280,height:900}]){
   await page.setViewportSize(viewport);await page.waitForTimeout(40);await step(0);
   const fit=await page.evaluate(mobile=>{const b=id=>document.getElementById(id).getBoundingClientRect(),p=b('idleComputePanel'),c=b('creditPanel'),stage=b('stage'),pause=document.getElementById('mobilePause')?b('mobilePause'):null;return {separated:p.left>c.right&&(!pause||p.right<pause.left),inside:mobile?p.top>=0&&p.bottom<=innerHeight:p.top>=stage.top&&p.bottom<=stage.bottom,noOverflow:document.documentElement.scrollWidth<=innerWidth}},mobile);
   assert(fit.separated&&fit.inside&&fit.noOverflow,JSON.stringify({name,viewport,fit}));
  }
  if(mobile)await page.setViewportSize({width:844,height:390});await step(660);
  await page.keyboard.down('KeyD');await step(78);await page.keyboard.up('KeyD');await step(360);
  assert.equal(await page.evaluate(()=>window.__EXCEPTION_TEST__.getState().state),'play');
  assert.equal(await page.locator('#idleComputeTitle').textContent(),'IDLE INSTANCE: TERMINATING');await page.screenshot({path:new URL(name+'-server-01-deletion.png',out).pathname,fullPage:true});
  if(mobile)await page.locator('#mobilePause').tap();else await openModeMenu(page,'#openDataCenters');const frozen=await page.evaluate(()=>window.__IDLE_COMPUTE_TEST__.state());await step(1200);assert.deepEqual(await page.evaluate(()=>window.__IDLE_COMPUTE_TEST__.state()),frozen);
  const clears=[];
  for(const [index,route] of routes.entries()){
   await start(index);
   const replay=await page.evaluate(({events,frames,mobile,server})=>{
    let at=0;const held=new Set(),chases=new Set();
    const send=e=>{
     if(!mobile){document.dispatchEvent(new KeyboardEvent(e.down?'keydown':'keyup',{code:e.code,bubbles:true,cancelable:true}));return}
     if(/^Digit[1-5]$/.test(e.code)){if(e.down){window.cleanupReview.step(0);document.getElementById('puzzleInput'+(Number(e.code.slice(-1))-1)).click()}return}
     if(e.code==='Enter'){if(e.down){window.cleanupReview.step(0);document.getElementById('puzzleBoxTest').click()}return}
     if(e.code==='Escape'){if(e.down)document.getElementById('puzzleBoxClose').click();return}
     if(e.down===held.has(e.code))return;if(e.down)held.add(e.code);else held.delete(e.code);
     if(e.code==='KeyX')window.cleanupReview.step(0); // Keep the contextual Rewrite button current in this accelerated replay.
     const [selector,pointerId]=e.code==='KeyD'?['[data-hold="right"]',11]:e.code==='KeyX'?['#glitch',12]:['#touchjump',13];document.querySelector(selector).dispatchEvent(new PointerEvent(e.down?'pointerdown':'pointerup',{pointerId,pointerType:'touch',bubbles:true,cancelable:true}));
    };
    for(let frame=0;frame<=frames;frame++){
     while(at<events.length&&events[at].frame===frame)send(events[at++]);if(frame<frames)window.cleanupReview.tick();
     const s=window.__EXCEPTION_TEST__.getState();if(s.state==='dead')throw Error(server+' frame '+frame+' x '+s.player.x+': '+document.getElementById('lossReason').textContent);if(s.idleCompute?.phase==='cleanup')chases.add(s.idleCompute.zone);
    }
    window.cleanupReview.step(0);return {state:window.__EXCEPTION_TEST__.getState(),chases:chases.size,progress:window.__DATA_CENTER_TEST__.progress()};
   },{...route,mobile});
   assert.equal(replay.state.state,'won',route.server);assert.equal(replay.state.deaths,0);assert.equal(replay.chases,replay.state.idleCompute.zones.length);assert.equal(replay.progress.cleared.length,0);
   clears.push({server:route.server,chases:replay.chases,credits:replay.state.credits.balance});
   if(index===19)await page.screenshot({path:new URL(name+'-server-20-cleared.png',out).pathname,fullPage:true});
  }
  assert.deepEqual(errors,[]);results.push({engine:name,phoneLayoutsFit:mobile,pointerReplay:mobile,warningAndDeletionVisible:true,pauseFreezes:true,practiceIsolated:true,clears,errors});
 }finally{await browser.close()}
}
writeFileSync(new URL('browser-results.json',out),JSON.stringify(results,null,2)+'\n');console.log('PASS (archived short Localhost comparison): WebKit touch handlers and Chromium keys escape all 26 cleanup stretches across 20 servers, responsive top HUD, live deletion, pause and practice isolation.');
