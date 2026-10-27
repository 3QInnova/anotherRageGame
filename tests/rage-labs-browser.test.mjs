import {openModeMenu} from './browser-controls.mjs';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {webkit,chromium} from '/private/tmp/exception-forecast-browser/node_modules/playwright/index.mjs';
const root=new URL('../',import.meta.url),out=new URL('outputs/rage-labs/',root);mkdirSync(out,{recursive:true});
const routes=JSON.parse(readFileSync(new URL('routes.json',out),'utf8')),results=[];
for(const [name,engine,mobile] of [['iphone-webkit',webkit,true],['desktop-chromium',chromium,false]]){
 const html=readFileSync(new URL(mobile?'mobile/index.html':'initalDemoDocs/Exception_Human_Misclassification_V3.html',root),'utf8');
 const boot='requestAnimationFrame(frame);\n})();',fixture=html.replace(boot,`window.labReview={tick:()=>runFrame(1/120),draw(){draw();refreshHud()}};draw();refreshHud();\n})();`);assert.notEqual(fixture,html);
 const browser=await engine.launch();
 try{
  const context=await browser.newContext({viewport:mobile?{width:844,height:390}:{width:1280,height:800},isMobile:mobile,hasTouch:mobile,deviceScaleFactor:1});
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/labs.html',r=>r.fulfill({body:fixture,contentType:'text/html'}));await page.goto('http://localhost/labs.html');
  const tap=async s=>mobile?page.locator(s).tap():page.locator(s).click();
  const openMenu=async selector=>openModeMenu(page,selector);
  await openMenu('#openRageLabs');assert(await page.locator('#campaignView-labs').isVisible());assert.equal(await page.locator('#campaignLabList button').count(),9);
  await page.screenshot({path:new URL(name+'-lab-menu.png',out).pathname,fullPage:true});
  // Every lab remains accessible at smaller phone heights through normal scrolling.
  for(const viewport of mobile?[{width:568,height:320},{width:844,height:280},{width:844,height:390}]:[{width:1280,height:720},{width:1280,height:800}]){
   await page.setViewportSize(viewport);await page.locator('#campaignLabList button').last().scrollIntoViewIfNeeded();
   const fit=await page.locator('#campaignLabList button').last().evaluate(el=>{const r=el.getBoundingClientRect();return r.width>=44&&r.height>=44&&r.left>=0&&r.right<=innerWidth&&r.bottom<=innerHeight});assert(fit);
  }
  await page.setViewportSize(mobile?{width:844,height:390}:{width:1280,height:800});
  for(const route of routes){
   if(!(await page.locator('#campaignMenu').isVisible()))await openMenu('#openRageLabs');
   await tap('#campaignTab-labs');await tap(`[data-lab="${route.id}"]`);
   await page.evaluate(()=>window.labReview.draw());
   const hud=await page.locator('#labHud').evaluate(el=>{const r=el.getBoundingClientRect();return {visible:r.width>150&&r.height>20&&r.top>=0&&r.bottom<=innerHeight,text:el.textContent}});assert(hud.visible&&hud.text.includes('TEST '),JSON.stringify(hud));
   assert.equal(await page.evaluate(()=>window.__EXCEPTION_TEST__.getState().state),'play');
   const replay=await page.evaluate(({route,mobile})=>{
    let at=0;const held=new Set(),captures={};
    const send=e=>{
     if(!mobile){document.dispatchEvent(new KeyboardEvent(e.down?'keydown':'keyup',{code:e.code,bubbles:true,cancelable:true}));return}
     if(e.down===held.has(e.code))return;if(e.down)held.add(e.code);else held.delete(e.code);
     const selector=e.code==='KeyD'?'[data-hold="right"]':e.code==='KeyA'?'[data-hold="left"]':e.code==='KeyX'?'#glitch':'#touchjump';
     if(e.code==='KeyX')window.labReview.draw();
     const pointerId=10+['KeyD','KeyA','KeyX','Space'].indexOf(e.code);
     document.querySelector(selector).dispatchEvent(new PointerEvent(e.down?'pointerdown':'pointerup',{pointerId,pointerType:'touch',bubbles:true,cancelable:true}));
    };
    for(let f=0;f<=route.frames;f++){
     while(at<route.events.length&&route.events[at].frame===f)send(route.events[at++]);
     if(f<route.frames)window.labReview.tick();
     const s=window.__EXCEPTION_TEST__.getState();if(s.state==='dead')throw Error(route.id+' died at '+s.player.x+' / '+document.getElementById('lossReason').textContent);
     if(mobile&&f%12===0&&['lab-cancellation-receipt','lab-impossible-paperwork','lab-unreliable-recall'].includes(route.id)){
      window.labReview.draw();const v=window.__MOBILE_UI_TEST__.viewport(),head=(s.player.y-v.top)/v.height*innerHeight,hud=document.getElementById('labHud').getBoundingClientRect();if(head<hud.bottom&&(s.player.x-s.cameraX)/v.width*innerWidth>hud.left&&(s.player.x-s.cameraX)/v.width*innerWidth<hud.right)throw Error('Raised route obscured by objective: '+route.id);
     }
     for(const marker of route.markers.filter(m=>m.frame===f+1&&m.name!=='complete')){
      window.labReview.draw();captures[marker.name]=document.getElementById('game').toDataURL();
      if(mobile){const v=window.__MOBILE_UI_TEST__.viewport(),paintedCamera=window.__EXCEPTION_TEST__.getState().cameraX,body={left:(s.player.x-paintedCamera)/v.width*innerWidth,right:(s.player.x-paintedCamera+24)/v.width*innerWidth,top:(s.player.y-v.top)/v.height*innerHeight,bottom:(s.player.y+34-v.top)/v.height*innerHeight},overlap=r=>body.left<r.right&&body.right>r.left&&body.top<r.bottom&&body.bottom>r.top;if(body.top<0||body.bottom>innerHeight||[...document.querySelectorAll('#touch button,#mobileBannerSlot')].some(el=>overlap(el.getBoundingClientRect())))throw Error('Player hidden at '+route.id+'/'+marker.name+' / '+JSON.stringify(body));}
     }
    }
    window.labReview.draw();return {state:window.__EXCEPTION_TEST__.getState(),lab:window.__RAGE_LAB_TEST__.state(),progress:window.__DATA_CENTER_TEST__.progress(),records:window.__CREDIT_TEST__.records(),captures};
   },{route,mobile});
   assert.equal(replay.state.state,'won',JSON.stringify({id:route.id,early:route.early,stamp:route.stamp,state:replay.state}));assert.equal(replay.state.deaths,0);assert.equal(replay.progress.cleared.length,0);assert.deepEqual(replay.records,{});
   if(route.early)assert(replay.lab.earlyCrossing);if(route.stamp)assert(replay.lab.stamp);
   for(const [marker,data] of Object.entries(replay.captures))writeFileSync(new URL(name+'-'+route.id+'-'+marker+'.png',out),Buffer.from(data.split(',')[1],'base64'));
   assert(await page.locator('#labRetry').isVisible());assert(await page.locator('#labChoose').isVisible());
   await page.screenshot({path:new URL(name+'-'+route.id+(route.early?'-early':route.stamp?'-stamp':'')+'-complete.png',out).pathname,fullPage:true});
   await tap('#labRetry');assert.equal(await page.evaluate(()=>window.__EXCEPTION_TEST__.getState().state),'play');
   assert.equal(await page.evaluate(()=>window.__RAGE_LAB_TEST__.state().events.length),0);
   await page.evaluate(()=>window.labReview.draw());
   if(route.id==='lab-autosave-betrayal'||route.id==='lab-rewrite-handoff')await page.screenshot({path:new URL(name+'-'+route.id+'-start.png',out).pathname,fullPage:true});
  }
  // Learn the popup through ordinary movement, then retry with the actual Continue buttons.
  await openMenu('#openRageLabs');await tap('[data-lab="lab-unreliable-recall"]');
  const combined=routes.find(r=>r.id==='lab-unreliable-recall'&&!r.early);
  const hit=await page.evaluate(({route,mobile})=>{
   const stop=route.markers.find(m=>m.name==='cautious-wait').frame;let at=0;
   window.recallInput=e=>{
    if(!mobile){document.dispatchEvent(new KeyboardEvent(e.down?'keydown':'keyup',{code:e.code,bubbles:true,cancelable:true}));return}
    if(e.code==='KeyX')window.labReview.draw();
    const selector=e.code==='KeyD'?'[data-hold="right"]':e.code==='KeyA'?'[data-hold="left"]':e.code==='KeyX'?'#glitch':'#touchjump';
    document.querySelector(selector).dispatchEvent(new PointerEvent(e.down?'pointerdown':'pointerup',{pointerId:10+['KeyD','KeyA','KeyX','Space'].indexOf(e.code),pointerType:'touch',bubbles:true,cancelable:true}));
   };
   window.recallPrefix=()=>{at=0;for(let f=0;f<=stop;f++){while(at<route.events.length&&route.events[at].frame===f)window.recallInput(route.events[at++]);if(f<stop)window.labReview.tick()}window.labReview.draw()};
   window.recallFull=()=>{at=0;for(let f=0;f<=route.frames;f++){while(at<route.events.length&&route.events[at].frame===f)window.recallInput(route.events[at++]);if(f<route.frames)window.labReview.tick()}window.labReview.draw()};
   window.recallPrefix();window.recallInput({code:'KeyD',down:true});
   for(let i=0;i<240&&window.__EXCEPTION_TEST__.getState().state==='play';i++)window.labReview.tick();window.recallInput({code:'KeyD',down:false});window.labReview.draw();
   return {state:window.__EXCEPTION_TEST__.getState(),recall:window.__RAGE_LAB_TEST__.recall(),reason:document.getElementById('lossReason').textContent};
  },{route:combined,mobile});
  assert.equal(hit.state.state,'dead');assert.match(hit.reason,/notice/);assert.equal(hit.recall.flags.length,0);assert.equal(hit.recall.known[0].id,'recall-receipt');assert.deepEqual(hit.state.seen,[]);
  await page.evaluate(()=>{for(let i=0;i<240;i++)window.labReview.tick();window.labReview.draw();window.__RAGE_LAB_TEST__.seedRecall(42)});await tap('#lossContinue');assert.equal(await page.evaluate(()=>window.__EXCEPTION_TEST__.getState().state),'dead');await tap('#lossContinue');
  const first=await page.evaluate(()=>window.__RAGE_LAB_TEST__.recall());assert.equal(first.flags.length,1);
  await page.evaluate(()=>window.recallPrefix());
  await page.screenshot({path:new URL(name+'-unreliable-first-flag.png',out).pathname,fullPage:true});
  const recallChecks=await page.evaluate(()=>{
   const before=JSON.stringify(window.__RAGE_LAB_TEST__.recall());for(let i=0;i<30;i++)window.labReview.draw();if(JSON.stringify(window.__RAGE_LAB_TEST__.recall())!==before)throw Error('Flag changed during drawing');
   const geometry=JSON.stringify(window.__RAGE_LAB_TEST__.catalog().at(-1));window.__RAGE_LAB_TEST__.seedRecall(1234);const offsets=[];
   for(let i=0;i<40;i++){document.dispatchEvent(new KeyboardEvent('keydown',{code:'KeyR',bubbles:true,cancelable:true}));document.dispatchEvent(new KeyboardEvent('keyup',{code:'KeyR',bubbles:true,cancelable:true}));offsets.push(window.__RAGE_LAB_TEST__.recall().flags[0]?.offset??null)}
   window.labReview.draw();return {offsets,geometryStable:geometry===JSON.stringify(window.__RAGE_LAB_TEST__.catalog().at(-1))};
  });
  assert(recallChecks.geometryStable);assert(recallChecks.offsets.some(x=>x===null));assert(recallChecks.offsets.some(x=>x<0));assert(recallChecks.offsets.some(x=>x>0));
  await page.evaluate(()=>window.recallFull());assert.equal(await page.evaluate(()=>window.__EXCEPTION_TEST__.getState().state),'won');await tap('#labRetry');assert.equal(await page.evaluate(()=>window.__RAGE_LAB_TEST__.recall().known.length),1);
  // Pause an energized object-specific rewrite; actual buttons control the menu.
  await openMenu('#openRageLabs');await tap('[data-lab="lab-rewrite-handoff"]');
  await page.evaluate(()=>{document.dispatchEvent(new KeyboardEvent('keydown',{code:'KeyD'}));for(let i=0;i<91;i++)window.labReview.tick();document.dispatchEvent(new KeyboardEvent('keyup',{code:'KeyD'}));window.labReview.draw()});
  if(mobile)await page.locator('#glitch').dispatchEvent('pointerdown',{pointerId:99,pointerType:'touch',bubbles:true,cancelable:true});else await page.keyboard.press('KeyX');
  await tap(mobile?'#mobilePause':'#desktopPause');
  const before=await page.evaluate(()=>({state:window.__EXCEPTION_TEST__.getState(),lab:window.__RAGE_LAB_TEST__.state()}));
  await page.evaluate(()=>{for(let i=0;i<1200;i++)window.labReview.tick();window.labReview.draw()});
  assert.deepEqual(await page.evaluate(()=>({state:window.__EXCEPTION_TEST__.getState(),lab:window.__RAGE_LAB_TEST__.state()})),before);
  await tap(mobile?'#mobileResume':'#desktopResume');
  if(!mobile){
   for(const height of [720,800,900]){await page.setViewportSize({width:1280,height});const fit=await page.locator('#stage').evaluate(el=>{const r=el.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight});assert(fit,'Whole desktop playfield fits '+height)}
   await page.screenshot({path:new URL(name+'-compact-playfield.png',out).pathname,fullPage:true});
  }
  // The first campaign action is visible in full; commentary may stay concise.
  await openMenu('#openDataCenters');await tap('#campaignTab-campaign');await tap('#campaignContinue');await page.evaluate(()=>window.labReview.draw());
  if(mobile){assert.match(await page.locator('#mobileObjective').textContent(),/Reception/);const fit=await page.locator('#mobileObjective').evaluate(el=>el.scrollHeight<=el.clientHeight&&el.getBoundingClientRect().right<=innerWidth);assert(fit)}
  await page.screenshot({path:new URL(name+'-campaign-action.png',out).pathname,fullPage:true});
  for(const id of ['campaignIdleTrial','campaignGarbageCollection','campaignCommitmentTrial','campaignCooling','campaignPuzzleBox','campaignLegacy']){
   await openMenu('#openDataCenters');await tap('#campaignTab-practice');await tap('#'+id);assert.equal(await page.locator('#campaignMenu').isVisible(),false);assert.equal(await page.evaluate(()=>window.__EXCEPTION_TEST__.getState().state),'play');
  }
  // A short real-time run exercises requestAnimationFrame and actual control holds.
  await page.route('**/live-labs.html',r=>r.fulfill({body:html,contentType:'text/html'}));await page.goto('http://localhost/live-labs.html');await openMenu('#openRageLabs');await tap('[data-lab="lab-forecast-commitment"]');
  const x=await page.evaluate(()=>window.__EXCEPTION_TEST__.getState().player.x);
  if(mobile)await page.locator('[data-hold="right"]').dispatchEvent('pointerdown',{pointerId:31,pointerType:'touch',bubbles:true,cancelable:true});else await page.keyboard.down('KeyD');
  await page.waitForTimeout(300);
  if(mobile)await page.locator('[data-hold="right"]').dispatchEvent('pointerup',{pointerId:31,pointerType:'touch',bubbles:true,cancelable:true});else await page.keyboard.up('KeyD');
  assert((await page.evaluate(()=>window.__EXCEPTION_TEST__.getState().player.x))>x+30);
  await tap(mobile?'#mobilePause':'#desktopPause');const paused=await page.evaluate(()=>window.__EXCEPTION_TEST__.getState());await page.waitForTimeout(220);assert.deepEqual(await page.evaluate(()=>window.__EXCEPTION_TEST__.getState()),paused);
  assert.deepEqual(errors,[]);results.push({browser:name,ordinaryInputRoutes:routes.length,recallAfterActualPopupDeath:true,firstRetryFlagGuaranteed:true,recallAttempts:40,flagsDriftBothWaysAndForget:true,touchHandlers:mobile,realTimeMovement:true,realTimePause:true,pauseFreezesRewrite:true,allLabsReachableAtShortHeights:true,allSixOlderRoutesReachable:true,untruncatedFirstAction:true,desktopPlayfieldFits:!mobile,pageErrors:errors});
 }finally{await browser.close()}
}
writeFileSync(new URL('browser-results.json',out),JSON.stringify(results,null,2)+'\n');console.log('PASS: WebKit touch and Chromium keyboard replay all nine labs and alternate routes, real-time controls/pause, named chooser, win/retry, short layouts and full first instruction.');
