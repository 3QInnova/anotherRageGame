import {openModeMenu} from './browser-controls.mjs';
import assert from 'node:assert/strict';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {webkit,chromium} from '/private/tmp/exception-forecast-browser/node_modules/playwright/index.mjs';
const base=process.env.DEMO_PREVIEW_URL??'http://127.0.0.1:8766/',root=new URL('../',import.meta.url),out=new URL('outputs/demo-playtest/',root);mkdirSync(out,{recursive:true});
const routes=JSON.parse(readFileSync(new URL('routes.json',out),'utf8')),results=[];
for(const path of ['', 'desktop.html','mobile.html']){const r=await fetch(base+path);assert.equal(r.status,200);assert.equal(r.headers.get('cache-control'),'no-store')}
for(const path of ['agents.md','campaign/demo-levels.js','../.git/config','%2e%2e/.git/config','package.json'])assert.equal((await fetch(base+path)).status,404,'Preview exposes only its packaged pages');
for(const [name,engine,mobile] of [['desktop-chromium',chromium,false],['iphone-webkit',webkit,true]]){
 const browser=await engine.launch();
 try{
  const context=await browser.newContext({viewport:mobile?{width:844,height:390}:{width:1280,height:720},isMobile:mobile,hasTouch:mobile,deviceScaleFactor:1});
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  const html=await (await fetch(base+(mobile?'mobile.html':'desktop.html'))).text();
  const fixture=html.replace('requestAnimationFrame(frame);\n})();','window.demoReview={tick:()=>runFrame(1/120),draw(){draw();refreshHud()},level:()=>L};draw();refreshHud();\n})();');assert.notEqual(fixture,html);
  await page.route('**/'+(mobile?'mobile.html':'desktop.html'),r=>r.fulfill({body:fixture,contentType:'text/html'}));
  const tap=async s=>mobile?page.locator(s).tap():page.locator(s).click();
  await page.goto(base);assert.equal(await page.locator('.episode').count(),8);
  await page.screenshot({path:new URL(name+'-playlist.png',out).pathname,fullPage:true});
  for(const route of routes){
   await page.goto(base);await tap(`[data-demo="${route.id}"] a[href^="${mobile?'mobile':'desktop'}.html"]`);
   await page.waitForFunction(id=>window.demoReview?.level().serverId===id,route.id);await page.evaluate(()=>window.demoReview.draw());
   assert.equal(await page.evaluate(()=>window.__EXCEPTION_TEST__.getState().state),'play');
   if(!mobile){assert(await page.locator('body').evaluate(el=>el.classList.contains('recording-view')));const box=await page.locator('#stage').boundingBox();assert(box.x>=-1&&box.y>=-1&&box.x+box.width<=1281&&box.y+box.height<=721&&box.width>=1279&&box.height>=719,JSON.stringify(box));assert.equal(await page.locator('.play-toolbar').isVisible(),false)}
   const replay=await page.evaluate(({route,mobile})=>{
    let at=0;const images={};
    const send=e=>{
     if(!mobile){document.dispatchEvent(new KeyboardEvent(e.down?'keydown':'keyup',{code:e.code,bubbles:true,cancelable:true}));return}
     if(e.code==='KeyX')window.demoReview.draw();
     const selector=e.code==='KeyD'?'[data-hold="right"]':e.code==='KeyA'?'[data-hold="left"]':e.code==='KeyX'?'#glitch':'#touchjump';
     document.querySelector(selector).dispatchEvent(new PointerEvent(e.down?'pointerdown':'pointerup',{pointerId:11+['KeyD','KeyA','KeyX','Space'].indexOf(e.code),pointerType:'touch',bubbles:true,cancelable:true}));
    };
    for(let f=0;f<=route.frames;f++){
     while(at<route.events.length&&route.events[at].frame===f)send(route.events[at++]);
     if(f<route.frames)window.demoReview.tick();const s=window.__EXCEPTION_TEST__.getState();if(s.state==='dead')throw Error(route.id+' / '+s.player.x+' / '+document.getElementById('lossReason').textContent);
     if(mobile&&f%24===0){
      window.demoReview.draw();const v=window.__MOBILE_UI_TEST__.viewport(),paintedCamera=window.__EXCEPTION_TEST__.getState().cameraX,head=(s.player.y-v.top)/v.height*innerHeight,bottom=(s.player.y+34-v.top)/v.height*innerHeight,hud=document.getElementById('labHud').getBoundingClientRect(),px=(s.player.x-paintedCamera)/v.width*innerWidth;
      const body={left:px,right:(s.player.x-paintedCamera+24)/v.width*innerWidth,top:head,bottom},overlap=r=>body.left<r.right&&body.right>r.left&&body.top<r.bottom&&body.bottom>r.top;
      if(head<0||bottom>innerHeight||[...document.querySelectorAll('#touch button,#mobileBannerSlot')].some(el=>overlap(el.getBoundingClientRect())))throw Error('Player hidden '+route.id+' / '+f+' / '+JSON.stringify(body));
      if(head<hud.bottom&&px+24>hud.left&&px<hud.right)throw Error('Objective covers player '+route.id+' / '+f+' / '+JSON.stringify({head,hudBottom:hud.bottom}));
     }
     for(const m of route.markers.filter(m=>m.frame===f+1&&(/locked|caught|safe-landing|stamp/.test(m.name)))){window.demoReview.draw();images[m.name]=document.getElementById('game').toDataURL()}
    }
    window.demoReview.draw();return {state:window.__EXCEPTION_TEST__.getState(),progress:window.__DATA_CENTER_TEST__.progress(),records:window.__CREDIT_TEST__.records(),images};
   },{route,mobile});
   assert.equal(replay.state.state,'won');assert.equal(replay.state.deaths,0);assert.equal(replay.progress.cleared.length,0);assert.deepEqual(replay.records,{});
   assert(await page.locator('#rewardContinue').isVisible());assert.equal(await page.locator('#labRetry').textContent(),'Retry this demo');
   if(!route.shortcuts&&!route.stamp){for(const [marker,data] of Object.entries(replay.images))writeFileSync(new URL(name+'-'+route.id+'-'+marker+'.png',out),Buffer.from(data.split(',')[1],'base64'));await page.screenshot({path:new URL(name+'-'+route.id+'-win.png',out).pathname,fullPage:true})}
   await tap('#labRetry');assert.equal(await page.evaluate(()=>window.demoReview.level().serverId),route.id);assert.equal(await page.evaluate(()=>window.__EXCEPTION_TEST__.getState().attempt),2);
  }
  // Frozen fixtures still use real input handlers, menus and the actual two-tap loss acknowledgement.
  await page.goto(base+(mobile?'mobile.html':'desktop.html')+'#demo=demo-do-not-move'+(mobile?'':'&record=1'));
  await page.waitForFunction(()=>window.demoReview?.level().demo);await page.evaluate(()=>{
   document.dispatchEvent(new KeyboardEvent('keydown',{code:'KeyD'}));while(window.__EXCEPTION_TEST__.getState().player.x<380)window.demoReview.tick();document.dispatchEvent(new KeyboardEvent('keyup',{code:'KeyD'}));for(let i=0;i<240&&window.__EXCEPTION_TEST__.getState().state==='play';i++)window.demoReview.tick();window.demoReview.draw();
  });
  assert.equal(await page.evaluate(()=>window.__EXCEPTION_TEST__.getState().state),'dead');await page.evaluate(()=>{for(let i=0;i<240;i++)window.demoReview.tick();window.demoReview.draw()});await tap('#lossContinue');assert.equal(await page.evaluate(()=>window.__EXCEPTION_TEST__.getState().state),'dead');await page.evaluate(()=>{for(let i=0;i<240;i++)window.demoReview.tick();window.demoReview.draw()});await tap('#lossContinue');assert.equal(await page.evaluate(()=>window.__RAGE_LAB_TEST__.recall().flags.length),1);
  if(mobile)await tap('#mobilePause');else await page.keyboard.press('Escape');
  const frozen=await page.evaluate(()=>window.__EXCEPTION_TEST__.getState());await page.evaluate(()=>{for(let i=0;i<1200;i++)window.demoReview.tick()});assert.deepEqual(await page.evaluate(()=>window.__EXCEPTION_TEST__.getState()),frozen);
  if(!mobile){await page.locator('#desktopTab-controls').click();await tap('#demoRecording');assert.equal(await page.locator('body').evaluate(el=>el.classList.contains('recording-view')),false);await tap('#desktopResume');await openModeMenu(page,'#openDemos')}
  else await tap('#openDemos');
  assert(await page.locator('#campaignView-demos').isVisible());assert.equal(await page.locator('#campaignDemoList button').count(),8);
  for(const viewport of mobile?[{width:568,height:320},{width:844,height:280}]:[{width:1280,height:720}]){
   await page.setViewportSize(viewport);await page.locator('#campaignDemoList button').last().scrollIntoViewIfNeeded();const box=await page.locator('#campaignDemoList button').last().boundingBox();assert(box.width>=44&&box.height>=44&&box.x>=0&&box.x+box.width<=viewport.width&&box.y+box.height<=viewport.height);
  }
  await page.setViewportSize(mobile?{width:844,height:390}:{width:1280,height:720});
  await tap('[data-demo="demo-final-final-test"]');
  const finalRoute=routes.find(r=>r.id==='demo-final-final-test'&&!r.shortcuts);
  await page.evaluate(route=>{let at=0;for(let f=0;f<=route.frames;f++){while(at<route.events.length&&route.events[at].frame===f){const e=route.events[at++];document.dispatchEvent(new KeyboardEvent(e.down?'keydown':'keyup',{code:e.code,bubbles:true,cancelable:true}))}if(f<route.frames)window.demoReview.tick()}window.demoReview.draw()},finalRoute);
  await tap('#rewardContinue');assert(await page.locator('#campaignView-demos').isVisible());await tap('[data-demo="demo-do-not-move"]');
  const first=routes.find(r=>r.id==='demo-do-not-move');await page.evaluate(route=>{let at=0;for(let f=0;f<=route.frames;f++){while(at<route.events.length&&route.events[at].frame===f){const e=route.events[at++];document.dispatchEvent(new KeyboardEvent(e.down?'keydown':'keyup',{code:e.code,bubbles:true,cancelable:true}))}if(f<route.frames)window.demoReview.tick()}window.demoReview.draw()},first);await tap('#rewardContinue');assert.equal(await page.evaluate(()=>window.demoReview.level().serverId),'demo-safe-landing');
  assert.deepEqual(errors,[]);results.push({browser:name,routes:routes.length,realKeyboardOrTouchInputs:true,allDemosReachable:true,recordingViewFits:!mobile,playerVisibleThroughRaisedAndLowerRoutes:true,sameDemoRetry:true,nextAndFinalPlaylist:true,actualDeathLearnsFlag:true,twoTapLoss:true,pauseFreezes:true,shortMenusFit:true,pageErrors:errors});
 }finally{await browser.close()}
}
// A fresh, unmodified browser page proves the deep link and normal animation clock also work.
const browser=await chromium.launch();try{const page=await browser.newPage({viewport:{width:1280,height:720}});await page.goto(base+'desktop.html#demo=demo-do-not-move&record=1');await page.waitForFunction(()=>window.__DEMO_TEST__&&document.querySelector('#labHudTitle').textContent.includes('DO NOT MOVE'));const x=await page.evaluate(()=>window.__EXCEPTION_TEST__.getState().player.x);await page.keyboard.down('KeyD');await page.waitForTimeout(250);await page.keyboard.up('KeyD');assert((await page.evaluate(()=>window.__EXCEPTION_TEST__.getState().player.x))>x+30);await page.keyboard.press('Escape');const state=await page.evaluate(()=>window.__EXCEPTION_TEST__.getState());await page.waitForTimeout(180);assert.deepEqual(await page.evaluate(()=>window.__EXCEPTION_TEST__.getState()),state)}finally{await browser.close()}
writeFileSync(new URL('browser-results.json',out),JSON.stringify(results,null,2)+'\n');console.log('PASS: local HTTP preview, all demo routes in Chromium/WebKit, recording view, touch, pause/retry, recall, next demo, safe serving and live animation.');
