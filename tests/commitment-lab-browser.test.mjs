import {openModeMenu} from './browser-controls.mjs';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {webkit,chromium} from '/private/tmp/exception-forecast-browser/node_modules/playwright/index.mjs';
const root=new URL('../',import.meta.url),out=new URL('outputs/commitment-lab/',root);mkdirSync(out,{recursive:true});
const route=JSON.parse(readFileSync(new URL('route.json',out),'utf8')),chasedRoute=JSON.parse(readFileSync(new URL('chased-route.json',out),'utf8')),results=[];
for(const [name,engine,mobile] of [['iphone-webkit',webkit,true],['desktop-chromium',chromium,false]]){
 const html=readFileSync(new URL(mobile?'mobile/index.html':'initalDemoDocs/Exception_Human_Misclassification_V3.html',root),'utf8');
 const fixture=html.replace('requestAnimationFrame(frame);\n})();',`window.labReview={tick:()=>runFrame(1/120),step(n){for(let i=0;i<n;i++)runFrame(1/120);draw();refreshHud()},noticeBounds(){const b=pressureNoticeLayout(),c=canvas.getBoundingClientRect(),scale=c.width/mobileView.width;return {left:c.left+(b.x-cameraX)*scale,right:c.left+(b.x-cameraX+b.w)*scale,top:c.top+(b.y-mobileView.top)*scale,bottom:c.top+(b.y-mobileView.top+b.h)*scale}}};draw();refreshHud();\n})();`);
 const browser=await engine.launch();try{
  const page=await browser.newPage({viewport:mobile?{width:844,height:390}:{width:1280,height:900},isMobile:mobile,hasTouch:mobile,deviceScaleFactor:1});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.route('**/commitment.html',r=>r.fulfill({body:fixture,contentType:'text/html'}));
  const start=async()=>{await page.goto('http://localhost/commitment.html');await openModeMenu(page,'#openDataCenters');await page.locator('#campaignTab-practice').click();await page.locator('#campaignCommitmentTrial').click();await page.evaluate(()=>window.labReview.step(0));assert.equal(await page.evaluate(()=>window.__EXCEPTION_TEST__.getState().practiceMode),true)};
  const step=async n=>page.evaluate(n=>window.labReview.step(n),n);
  await start();await page.locator('#commitmentPanel').waitFor({state:'visible'});
  await page.evaluate(()=>{window.labFrame=0;window.labEvent=0;window.labHeld=new Set()});
  const checkpoints=[270,700,1180,1780,2250,2600,route.frames];
  for(const stop of checkpoints){
   await page.evaluate(({route,stop,mobile})=>{
    // Replay real UI pointer handlers on mobile; keyboard handlers on desktop.
    const send=e=>{
     if(!mobile){document.dispatchEvent(new KeyboardEvent(e.down?'keydown':'keyup',{code:e.code,bubbles:true,cancelable:true}));return}
     const mapping={KeyD:['[data-hold="right"]',11],KeyA:['[data-hold="left"]',12],Space:['#touchjump',13],KeyX:['#glitch',14]};
     const [selector,id]=mapping[e.code]??[];if(!selector)throw Error('Unknown input '+e.code);
     if(e.down===window.labHeld.has(e.code))return;
     if(e.down)window.labHeld.add(e.code);else window.labHeld.delete(e.code);
     const element=document.querySelector(selector);element.dispatchEvent(new PointerEvent(e.down?'pointerdown':'pointerup',{pointerId:id,pointerType:'touch',isPrimary:id===11,bubbles:true,cancelable:true}));
    };
    while(window.labFrame<=stop){
     while(window.labEvent<route.events.length&&route.events[window.labEvent].frame===window.labFrame)send(route.events[window.labEvent++]);
     window.labReview.tick();window.labFrame++;
     if(window.__EXCEPTION_TEST__.getState().state==='dead')throw Error(document.getElementById('lossReason').textContent);
    }
    window.labReview.step(0);
   },{route,stop,mobile});
   await page.screenshot({path:new URL(name+'-frame-'+stop+'.png',out).pathname,fullPage:true});
   if(stop===700){
    if(mobile)await page.locator('#mobilePause').tap();else await openModeMenu(page,'#openDataCenters');
    const before=await page.evaluate(()=>window.__COMMITMENT_TEST__.state());await step(1800);assert.deepEqual(await page.evaluate(()=>window.__COMMITMENT_TEST__.state()),before);
    if(mobile)await page.locator('#mobileResume').tap();else await page.locator('#campaignClose').click();
    // Pause releases held input, as on a phone; restore the route's current intention.
    await page.evaluate(mobile=>{for(const code of window.labHeld){const key=code==='KeyD'?'right':code==='KeyA'?'left':null;if(key&&mobile)document.querySelector('[data-hold="'+key+'"]').dispatchEvent(new PointerEvent('pointerdown',{pointerId:key==='right'?11:12,pointerType:'touch',bubbles:true,cancelable:true}));}},mobile);
   }
  }
  const won=await page.evaluate(()=>window.__EXCEPTION_TEST__.getState());assert.equal(won.state,'won');assert.equal(won.deaths,0);assert(won.credits.balance>0);
  await start();
  assert.equal(await page.evaluate(()=>window.__PRESSURE_TEST__.state().stage),'calm');
  await page.screenshot({path:new URL(name+'-calm.png',out).pathname,fullPage:true});
  for(const [from,to] of [[0,800],[800,1450],[1450,2080]]){
   await page.evaluate(([from,to])=>{for(let i=from;i<to;i++){if(i%120===0)document.dispatchEvent(new KeyboardEvent('keydown',{code:'KeyD',bubbles:true}));if(i%120===2)document.dispatchEvent(new KeyboardEvent('keyup',{code:'KeyD',bubbles:true}));window.labReview.tick()}window.labReview.step(0)},[from,to]);
   assert.equal(await page.evaluate(()=>window.__PRESSURE_TEST__.state().stage),to===800?'calm':to===1450?'watching':'urgent');
   await page.screenshot({path:new URL(name+(to===800?'-idle-paper.png':to===1450?'-move-along.png':'-eviction.png'),out).pathname,fullPage:true});
  }
  assert.equal(await page.evaluate(()=>window.__PRESSURE_TEST__.paper().paperStage),'eviction');
  assert.match(await page.locator('#commitmentTitle').textContent(),/SERVICEDESK/);
  for(const viewport of mobile?[{width:568,height:320},{width:667,height:375},{width:844,height:280},{width:956,height:440}]:[{width:1280,height:900}]){
   await page.setViewportSize(viewport);await page.waitForTimeout(60);await step(0);
   const fit=await page.evaluate(()=>{const b=id=>document.getElementById(id).getBoundingClientRect(),panel=b('commitmentPanel'),pads=['movePad','actionPad'].map(id=>document.getElementById(id)?b(id).top:innerHeight);return {inside:panel.left>=0&&panel.right<=innerWidth&&panel.top>=0&&panel.bottom<=innerHeight,aboveControls:panel.bottom<Math.min(...pads),topHud:panel.top-document.getElementById('stage').getBoundingClientRect().top<80,clearCredits:panel.left>b('creditPanel').right+4,clearPause:!document.getElementById('mobilePause')||panel.right<b('mobilePause').left-4,width:document.documentElement.scrollWidth}});
   assert(fit.inside&&fit.aboveControls&&fit.topHud&&fit.clearCredits&&fit.clearPause,JSON.stringify(fit));if(mobile)assert(fit.width<=viewport.width);

   if(mobile){
    for(const large of [false,true]){
     await page.evaluate(large=>{document.documentElement.style.setProperty('--control-size',large?'1.15':'1');document.documentElement.style.setProperty('--control-inset',large?'30px':'14px');window.dispatchEvent(new Event('resize'))},large);await page.waitForTimeout(40);await step(0);
     const paperFit=await page.evaluate(()=>{const b=window.labReview.noticeBounds(),left=document.getElementById('movePad').getBoundingClientRect(),right=document.getElementById('actionPad').getBoundingClientRect();return {b,clear:b.left>left.right&&b.right<right.left,inside:b.left>=0&&b.right<=innerWidth&&b.top>=0&&b.bottom<=innerHeight}});
     assert(paperFit.clear&&paperFit.inside,JSON.stringify({viewport,large,...paperFit}));
    }
    await page.evaluate(()=>{document.documentElement.style.setProperty('--control-size','1');document.documentElement.style.setProperty('--control-inset','14px');window.dispatchEvent(new Event('resize'))});await page.waitForTimeout(40);await step(0);
   }
   await page.screenshot({path:new URL(name+'-ticket-'+viewport.width+'x'+viewport.height+'.png',out).pathname,fullPage:true});
  }
  const remaining=await page.evaluate(()=>window.__COMMITMENT_TEST__.state().presence.warning);
  await step(Math.ceil(remaining*120)+1);assert.equal(await page.evaluate(()=>window.__EXCEPTION_TEST__.getState().state),'play');assert.equal(await page.evaluate(()=>window.__IDLE_COMPUTE_TEST__.state().phase),'cleanup');
  await step(240);assert.equal(await page.evaluate(()=>window.__EXCEPTION_TEST__.getState().state),'play');
  await page.screenshot({path:new URL(name+'-service-desk-deletion.png',out).pathname,fullPage:true});
  await step(180);assert.equal(await page.evaluate(()=>window.__EXCEPTION_TEST__.getState().state),'dead');assert.match(await page.locator('#lossReason').textContent(),/cleanup edge caught/);await page.screenshot({path:new URL(name+'-cleanup-caught.png',out).pathname,fullPage:true});
  await start();await page.evaluate(()=>{for(let i=0;i<2080;i++){if(i%120===0)document.dispatchEvent(new KeyboardEvent('keydown',{code:'KeyD',bubbles:true}));if(i%120===2)document.dispatchEvent(new KeyboardEvent('keyup',{code:'KeyD',bubbles:true}));window.labReview.tick()}document.dispatchEvent(new KeyboardEvent('keydown',{code:'KeyD',bubbles:true}));window.labReview.step(193);document.dispatchEvent(new KeyboardEvent('keyup',{code:'KeyD',bubbles:true}))});
  assert.equal(await page.evaluate(()=>window.__PRESSURE_TEST__.paper().paperStage),'recovered');
  await page.screenshot({path:new URL(name+'-eviction-postponed.png',out).pathname,fullPage:true});
  await start();
  const chase=await page.evaluate(({events,frames})=>{
   let next=0,sawDeletion=false;
   for(let frame=0;frame<=frames;frame++){
    while(next<events.length&&events[next].frame===frame){const e=events[next++];document.dispatchEvent(new KeyboardEvent(e.down?'keydown':'keyup',{code:e.code,bubbles:true,cancelable:true}))}
    window.labReview.tick();const s=window.__EXCEPTION_TEST__.getState();sawDeletion||=s.idleCompute?.phase==='cleanup';if(s.state==='dead')throw Error(document.getElementById('lossReason').textContent);
   }
   window.labReview.step(0);return {sawDeletion,state:window.__EXCEPTION_TEST__.getState()};
  },chasedRoute);
  assert(chase.sawDeletion);assert.equal(chase.state.state,'won');assert.equal(chase.state.deaths,0);
  assert.deepEqual(errors,[]);results.push({engine:name,ordinaryInputWin:true,mobilePointerReplay:mobile,pauseFrozen:true,layoutsFit:true,deletionInsteadOfLogout:true,chasedRouteWon:true,floorEvictionStages:true,subtleAmberCue:true,visibleRecovery:true,topHud:true,creditsLeft:won.credits.balance,errors});
 }finally{await browser.close()}
}
writeFileSync(new URL('browser-results.json',out),JSON.stringify(results,null,2)+'\n');console.log('PASS: desktop keyboard and iPhone WebKit touch-route wins, active pause, responsive HUD, Service Desk warning and visible deletion and a successful chased route.');
