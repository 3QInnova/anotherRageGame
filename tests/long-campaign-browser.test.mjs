import {openModeMenu} from './browser-controls.mjs';
import assert from 'node:assert/strict';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {webkit,chromium} from '/private/tmp/exception-forecast-browser/node_modules/playwright/index.mjs';
const base='http://127.0.0.1:8766/',out=new URL('../outputs/long-campaign/',import.meta.url);mkdirSync(out,{recursive:true});
const routes=JSON.parse(readFileSync(new URL('routes.json',out),'utf8')),results=[];
for(const [name,engine,mobile] of [['iphone-webkit',webkit,true],['desktop-chromium',chromium,false]]){
 const browser=await engine.launch();try{
  const page=await browser.newPage({viewport:mobile?{width:844,height:390}:{width:1280,height:720},isMobile:mobile,hasTouch:mobile,deviceScaleFactor:1}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  const path=mobile?'mobile.html':'desktop.html',html=await (await fetch(base+path)).text();
  const fixture=html.replace('requestAnimationFrame(frame);\n})();',`window.longReview={tick:()=>runFrame(1/120),paint(){draw();refreshHud()},peek:()=>({state,player,room,cameraX}),level:()=>L};draw();refreshHud();\n})();`);assert.notEqual(fixture,html);
  await page.route('**/'+path,r=>r.fulfill({body:fixture,contentType:'text/html'}));
  await page.goto(base+'campaign.html');assert.equal(await page.locator('[data-server]').count(),20);assert.equal(await page.locator('[data-server="localhost-20"] .number').textContent(),'LOCALHOST 20 / 20 · ~5:02 · 277 px/s');
  await page.screenshot({path:new URL(name+'-picker.png',out).pathname,fullPage:true});
  for(const route of routes){
   await page.goto(base+'campaign.html');const link=page.locator(`[data-server="${route.id}"] a[href^="${path}"]`);await link.scrollIntoViewIfNeeded();if(mobile)await link.tap();else await link.click();
   await page.waitForFunction(id=>window.longReview?.level().serverId===id,route.id);
   const replay=await page.evaluate(({route,mobile})=>{
    let at=0,paintMs=0,paintCount=0;const held=new Set(),images={},captures=new Set(),markers=new Map(route.markers.map(m=>[m.frame,m.name]));
    const paint=()=>{const t=performance.now();window.longReview.paint();paintMs+=performance.now()-t;paintCount++};
    const send=e=>{
     if(!mobile){document.dispatchEvent(new KeyboardEvent(e.down?'keydown':'keyup',{code:e.code,bubbles:true,cancelable:true}));return}
     if(/^Digit/.test(e.code)){if(e.down){paint();document.getElementById('puzzleInput'+(Number(e.code.slice(-1))-1)).click()}return}
     if(['Enter','Escape'].includes(e.code)){if(e.down){paint();document.getElementById(e.code==='Enter'?'puzzleBoxTest':'puzzleBoxClose').click()}return}
     if(e.down===held.has(e.code))return;if(e.down)held.add(e.code);else held.delete(e.code);if(e.code==='KeyX')paint();
     const i=['KeyD','KeyA','KeyX','Space'].indexOf(e.code);if(i<0)throw Error('Unexpected route input '+e.code);
     const selector=['[data-hold="right"]','[data-hold="left"]','#glitch','#touchjump'][i];document.querySelector(selector).dispatchEvent(new PointerEvent(e.down?'pointerdown':'pointerup',{pointerId:11+i,pointerType:'touch',bubbles:true,cancelable:true}));
    };
    for(let f=0;f<=route.frames;f++){
     while(at<route.events.length&&route.events[at].frame===f)send(route.events[at++]);if(f<route.frames)window.longReview.tick();
     const s=window.longReview.peek();if(s.state==='dead')throw Error(route.id+' / '+f+' / '+s.player.x+' / '+document.getElementById('lossReason').textContent);
     if(mobile&&s.state==='play'&&f%24===0&&!window.__PUZZLE_BOX_TEST__.open()){
      paint();const v=window.__MOBILE_UI_TEST__.viewport(),head=(s.player.y-v.top)/v.height*innerHeight,bottom=(s.player.y+34-v.top)/v.height*innerHeight;
      const paintedCamera=window.__EXCEPTION_TEST__.getState().cameraX,body={left:(s.player.x-paintedCamera)/v.width*innerWidth,right:(s.player.x-paintedCamera+24)/v.width*innerWidth,top:head,bottom};
      const overlap=r=>body.left<r.right&&body.right>r.left&&body.top<r.bottom&&body.bottom>r.top;
      if(head<0||bottom>innerHeight||[...document.querySelectorAll('#touch button,#mobileBannerSlot')].some(el=>overlap(el.getBoundingClientRect())))throw Error('Player cropped or covered '+route.id+' / '+f+' / '+JSON.stringify(body));
      const px=(s.player.x-paintedCamera)/v.width*innerWidth;
      for(const id of ['idleComputePanel','creditPanel']){const el=document.getElementById(id),b=el.getBoundingClientRect();if(!el.hidden&&head<b.bottom&&bottom>b.top&&px+24>b.left&&px<b.right)throw Error('HUD covers player '+route.id+' / '+f+' / '+id)}
     }
     const marker=markers.get(f+1),kind=marker?.replace(/^\d+-/,'');
     if(['localhost-01','localhost-18','localhost-20'].includes(route.id)&&marker&&['locked','caught','raised-route','puzzle'].includes(kind)&&!captures.has(kind)){
      captures.add(kind);paint();images[marker]=document.getElementById('game').toDataURL();
     }
    }
    paint();return {state:window.__EXCEPTION_TEST__.getState(),progress:window.__DATA_CENTER_TEST__.progress(),records:window.__CREDIT_TEST__.records(),images,paintCount,meanPaintMs:paintMs/paintCount};
   },{route,mobile});
   assert.equal(replay.state.state,'won');assert.equal(replay.state.deaths,0);assert.equal(replay.progress.cleared.length,0);assert.deepEqual(replay.records,{});
   for(const [marker,image] of Object.entries(replay.images))writeFileSync(new URL(name+'-'+route.id+'-'+marker+'.png',out),Buffer.from(image.split(',')[1],'base64'));
   if(['localhost-01','localhost-18','localhost-20'].includes(route.id))await page.screenshot({path:new URL(name+'-'+route.id+'-win.png',out).pathname,fullPage:true});
   results.push({browser:name,id:route.id,seconds:route.seconds,deaths:0,touchInputs:mobile,playerFramingChecked:mobile,meanPaintMs:replay.meanPaintMs,paintCount:replay.paintCount});
  }
  assert.deepEqual(errors,[]);
  await page.goto(base+'campaign.html');await page.goto(base+path+'#campaign=localhost-20&practice=1');await page.waitForFunction(()=>window.longReview?.level().serverId==='localhost-20');
  if(mobile)await page.locator('#mobilePause').tap();else await page.keyboard.press('Escape');const before=await page.evaluate(()=>window.__EXCEPTION_TEST__.getState());await page.evaluate(()=>{for(let i=0;i<1200;i++)window.longReview.tick()});assert.deepEqual(await page.evaluate(()=>window.__EXCEPTION_TEST__.getState()),before);
  await openModeMenu(page,'#openDataCenters');await page.locator('#campaignTab-practice').click();await page.locator('#campaignOriginalCooling').scrollIntoViewIfNeeded();await page.locator('#campaignOriginalCooling').click();assert.equal(await page.evaluate(()=>window.longReview.level().originalLocalhost),true);assert.equal(await page.evaluate(()=>window.longReview.level().serverId),'localhost-18');
 }finally{await browser.close()}
}
// Unmodified page: actual animation clock, movement, pause, and deep link.
const browser=await chromium.launch();try{const page=await browser.newPage();await page.goto(base+'desktop.html#campaign=localhost-01&practice=1&record=1');await page.waitForFunction(()=>document.body.classList.contains('recording-view'));const x=await page.evaluate(()=>window.__EXCEPTION_TEST__.getState().player.x);await page.keyboard.down('KeyD');await page.waitForTimeout(250);await page.keyboard.up('KeyD');assert((await page.evaluate(()=>window.__EXCEPTION_TEST__.getState().player.x))>x+30);await page.keyboard.press('Escape');const before=await page.evaluate(()=>window.__EXCEPTION_TEST__.getState());await page.waitForTimeout(200);assert.deepEqual(await page.evaluate(()=>window.__EXCEPTION_TEST__.getState()),before)}finally{await browser.close()}
writeFileSync(new URL('browser-results.json',out),JSON.stringify(results,null,2)+'\n');console.log('PASS: 20 long routes in Chromium and WebKit, real keyboard/touch input, mobile camera/HUD, practice isolation, comparison selector, pause and live local preview.');
