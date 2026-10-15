import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {webkit,chromium} from '/private/tmp/exception-forecast-browser/node_modules/playwright/index.mjs';
const root=new URL('../',import.meta.url),html=readFileSync(new URL('mobile/index.html',root),'utf8');
const fixture=html.replace('installMobileUI();initRoom(true);requestAnimationFrame(frame);',`installMobileUI();initRoom(true);window.uiFixture={step(n){for(let i=0;i<n;i++)runFrame(1/120);draw();refreshHud()},glass(){startPractice(15);draw();refreshHud()},bill(){room=6;initRoom();paywallCounts[6]=0;startPaywall(0);refreshHud()},compact(){room=6;initRoom();startCompaction('UI review');draw();refreshHud()},caption:forecastCaptionX,lose(){die('Actual cause.','secret-review');draw();refreshHud()}};`);
const results=[];
for(const engine of [webkit,chromium]){
 const browser=await engine.launch({headless:true}),errors=[];
 try{
 const page=await browser.newPage({viewport:{width:844,height:390},isMobile:true,hasTouch:true,deviceScaleFactor:2});page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/index.html',r=>r.fulfill({body:fixture,contentType:'text/html'}));await page.goto(new URL('mobile/index.html',root).href);
 await page.locator('#mobileResume').tap();await page.evaluate(()=>window.uiFixture.step(0));
 for(const viewport of [{width:568,height:320},{width:667,height:375},{width:844,height:390},{width:956,height:440},{width:844,height:280}]){
  await page.setViewportSize(viewport);await page.waitForFunction(()=>Math.abs(window.__MOBILE_UI_TEST__.viewport().width/400-innerWidth/innerHeight)<1e-6);await page.evaluate(()=>window.uiFixture.step(0));
  const fit=await page.evaluate(()=>{
   const v=window.__MOBILE_UI_TEST__.viewport(),canvas=document.getElementById('game'),rect=canvas.getBoundingClientRect();
   const controls=[...document.querySelectorAll('#touch button')].map(b=>({id:b.id||b.dataset.hold,r:b.getBoundingClientRect().toJSON()}));
   // This fails if the PC drawing overrides the mobile projection or DPR is applied twice.
   const pixel=canvas.getContext('2d').getImageData(Math.round(8*v.pixelWidth/v.width),Math.floor((440-v.top)*v.pixelHeight/v.height),1,1).data;
   return {v,rect:rect.toJSON(),controls,pixel:[...pixel],width:innerWidth,height:innerHeight,overflow:document.documentElement.scrollWidth>innerWidth||document.documentElement.scrollHeight>innerHeight};
  });
  assert.equal(fit.rect.width,viewport.width);assert.equal(fit.rect.height,viewport.height);assert(!fit.overflow);
  assert(fit.pixel[0]<100&&fit.pixel[1]<120,'Walking surface must render at projected ground coordinate');
  for(const c of fit.controls){assert(c.r.x>=0&&c.r.y>=0);assert(c.r.right<=fit.width+1&&c.r.bottom<=fit.height+1);assert(c.r.width>=48&&c.r.height>=48);}
  const left=fit.controls.filter(c=>['left','right'].includes(c.id)),jump=fit.controls.find(c=>c.id==='touchjump');assert(left[1].r.right<jump.r.x);
  if(engine===webkit)await page.screenshot({path:new URL(`outputs/fullscreen-mobile/play-${viewport.width}x${viewport.height}.png`,root).pathname});
 }
 await page.setViewportSize({width:844,height:390});await page.locator('#mobilePause').tap();
 const paused=await page.evaluate(()=>window.__EXCEPTION_TEST__.getState());
 await page.evaluate(()=>window.uiFixture.step(0));const paints=await page.evaluate(()=>window.__MOBILE_UI_TEST__.paintCount());await page.evaluate(()=>window.uiFixture.step(240));assert.equal(await page.evaluate(()=>window.__MOBILE_UI_TEST__.paintCount()),paints,'Paused world should reuse its framebuffer');
 await page.locator('#tab-controls').tap();await page.locator('#controlSize').fill('115');await page.locator('#controlInset').fill('30');await page.locator('#highVisibility').tap();
 assert.equal(await page.locator('#controlOpacity').inputValue(),'100');await page.evaluate(()=>window.uiFixture.step(120));assert.equal((await page.evaluate(()=>window.__EXCEPTION_TEST__.getState())).sceneTime,paused.sceneTime);
 await page.locator('#tab-audio').tap();assert(await page.locator('#mute').isVisible());assert(await page.locator('#music').isVisible());
 await page.locator('#tab-log').tap();assert((await page.locator('#aiHistory li').count())>0);
 await page.locator('#tab-play').tap();await page.locator('#newRun').tap();assert(await page.locator('#newRunConfirm').isVisible());await page.locator('#cancelNewRun').tap();assert(await page.locator('#newRunConfirm').isHidden());
 await page.locator('#mobileResume').tap();await page.evaluate(()=>window.uiFixture.step(0));
 // Stored preferences survive reload; missing storage is handled by the game itself.
 await page.reload();await page.locator('#tab-controls').tap();assert.equal(await page.locator('#controlSize').inputValue(),'115');assert.equal(await page.locator('#controlInset').inputValue(),'30');await page.locator('#resetControls').tap();
 await page.reload();await page.locator('#mobileResume').tap();await page.locator('#mobilePause').tap();await page.locator('#openPractice').tap();await page.locator('#glassPractice').tap();await page.evaluate(()=>window.uiFixture.step(0));
 for(const viewport of [{width:600,height:440},{width:956,height:440}]){
  await page.setViewportSize(viewport);await page.waitForFunction(()=>Math.abs(window.__MOBILE_UI_TEST__.viewport().width/400-innerWidth/innerHeight)<1e-6);await page.evaluate(()=>window.uiFixture.step(0));
  const ray=await page.evaluate(()=>({v:window.__MOBILE_UI_TEST__.viewport(),s:window.__EXCEPTION_TEST__.getState(),r:window.__GLASS_TEST__.sight()[0],caption:{right:window.uiFixture.caption(99999,20),left:window.uiFixture.caption(-99999,20)}}));assert(Math.abs(ray.r.a.x-ray.s.cameraX-ray.v.eyeX)<1e-6);assert.equal(ray.r.a.y,ray.v.eyeY);
  const caption=ray.caption;assert(Math.abs(caption.right-(ray.s.cameraX+ray.v.width-20))<1e-6);assert.equal(caption.left,ray.s.cameraX+20);
 }
 if(engine===webkit)await page.screenshot({path:new URL('outputs/fullscreen-mobile/glass.png',root).pathname});
 await page.evaluate(()=>window.uiFixture.lose());await page.locator('#mobilePause').tap();await page.locator('#openPractice').tap();assert(await page.locator('#glassPractice').isDisabled());await page.locator('#practiceBack').tap();assert(await page.locator('#newRun').isDisabled());await page.locator('#mobileResume').tap();
 await page.locator('#lossContinue').tap();assert.equal((await page.evaluate(()=>window.__EXCEPTION_TEST__.getState())).state,'dead');await page.locator('#lossContinue').tap();assert.equal((await page.evaluate(()=>window.__EXCEPTION_TEST__.getState())).state,'play');
 await page.evaluate(()=>window.uiFixture.compact());await page.locator('#mobilePause').tap();const compact=await page.evaluate(()=>window.__EXCEPTION_TEST__.getState());await page.evaluate(()=>window.uiFixture.step(1200));assert.deepEqual((await page.evaluate(()=>window.__EXCEPTION_TEST__.getState())).compaction,compact.compaction);await page.locator('#mobileResume').tap();await page.evaluate(()=>window.uiFixture.step(1800));assert.equal((await page.evaluate(()=>window.__EXCEPTION_TEST__.getState())).state,'play');
 await page.evaluate(()=>window.uiFixture.bill());await page.locator('#mobilePause').tap();await page.locator('#mobileResume').tap();await page.locator('#paywallDecline').tap();await page.locator('#paywallDecline').tap();assert.equal((await page.evaluate(()=>window.__EXCEPTION_TEST__.getState())).paywallCounts[6],1);
 assert.deepEqual(errors,[]);results.push({engine:engine.name(),fullScreen:true,projectedFloor:true,safeControlBounds:true,settingsPersist:true,menusFreeze:true,glassEyeAligned:true,lossAndCompactionPreserved:true,paywallBudgetPreserved:true,pageErrors:errors});
 }finally{await browser.close()}
}
writeFileSync(new URL('outputs/fullscreen-mobile/browser-results.json',root),JSON.stringify(results,null,2)+'\n');console.log('PASS: WebKit + Chromium full-screen projection, five sizes, control bounds, settings, pause overlays, glass eye and interruption budgets.');
