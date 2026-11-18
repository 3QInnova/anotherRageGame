import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {webkit,chromium} from '/private/tmp/exception-forecast-browser/node_modules/playwright/index.mjs';
const html=readFileSync(new URL('../outputs/release/native.html',import.meta.url),'utf8');
const engine=process.env.EXCEPTION_ADS_BROWSER==='chromium'?chromium:webkit;
const browser=await engine.launch();
try {
 for(const fail of [false,true]){
  const page=await browser.newPage({viewport:{width:844,height:390},isMobile:true,hasTouch:true});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('http://native.test/**',route=>route.fulfill({contentType:route.request().url().endsWith('.js')?'text/javascript':'text/html',body:route.request().url().endsWith('.js')?'':html}));
  await page.addInitScript(({fail})=>{window.adCalls=[];window.ExceptionNative={health:{native:true},ads:{prepare:async()=>{if(fail)throw Error('offline');return {status:'Google test ad — no live advertising.'}},presentation:async covered=>window.adCalls.push(covered),privacy:async()=>window.adCalls.push('privacy'),report:async()=>window.adCalls.push('report')}}},{fail});
  await page.goto('http://native.test/');
  await page.waitForSelector('html.native-ads');
  assert.match(await page.locator('#nativeAdsStatus').textContent(),fail?/Ads unavailable/:/Google test ad/);
  assert.equal(await page.locator('#campaignTitle').textContent(),'Campaign');
  assert.equal(await page.locator('#campaignServers [data-server]').count(),1);
  await page.waitForFunction(()=>adCalls.filter(x=>typeof x==='boolean').at(-1)===true);
  await page.locator('#campaignServers [data-server]').first().click();
  await page.waitForFunction(()=>adCalls.filter(x=>typeof x==='boolean').at(-1)===false);
  // Unexpected controls must hide the native ad, even while gameplay is active.
  for(const kind of ['button','disabled-button','a','input','select','textarea','summary','role-button','tabindex']){
   await page.evaluate(kind=>{
    const r=document.getElementById('mobileBannerSlot').getBoundingClientRect();
    const el=document.createElement(kind==='disabled-button'?'button':kind==='role-button'||kind==='tabindex'?'div':kind);
    el.id='collisionProbe';el.textContent='Control';
    if(kind==='disabled-button')el.disabled=true;
    if(kind==='a')el.href='#';if(kind==='role-button')el.setAttribute('role','button');if(kind==='tabindex')el.tabIndex=0;
    el.style.cssText=`position:fixed;left:${r.left-20}px;top:${r.top}px;width:16px;height:40px;min-height:0;padding:0;z-index:9999`;
    document.body.append(el);
   },kind);
   await page.waitForFunction(()=>adCalls.filter(x=>typeof x==='boolean').at(-1)===true);
   await page.locator('#collisionProbe').evaluate(el=>el.remove());
   await page.waitForFunction(()=>adCalls.filter(x=>typeof x==='boolean').at(-1)===false);
  }
  // CSS transforms are checked even without DOM attribute changes.
  await page.evaluate(()=>{
   const r=document.getElementById('mobileBannerSlot').getBoundingClientRect();
   const style=document.createElement('style');style.id='collisionStyle';style.textContent='@keyframes adCollision {to {transform:translateY(100px)}} #collisionProbe {animation:adCollision .2s linear forwards}';
   document.head.append(style);const el=document.createElement('button');el.id='collisionProbe';el.textContent='Animated control';
   el.style.cssText=`position:fixed;left:${r.left}px;top:${r.top-100}px;width:60px;height:48px;z-index:9999`;document.body.append(el);
  });
  await page.waitForFunction(()=>adCalls.filter(x=>typeof x==='boolean').at(-1)===true);
  await page.evaluate(()=>{document.getElementById('collisionProbe').remove();document.getElementById('collisionStyle').remove()});
  await page.waitForFunction(()=>adCalls.filter(x=>typeof x==='boolean').at(-1)===false);
  await page.locator('#mobilePause').click();
  await page.waitForFunction(()=>adCalls.filter(x=>typeof x==='boolean').at(-1)===true);
  await page.locator('#menuSettings > summary').click();
  await page.locator('#nativeAdPrivacy').click();
  await page.locator('#nativeAdReport').click();
  assert(await page.locator('#mobileMenu').isVisible());
  for(const section of ['support','privacy','terms']){
   await page.locator('[data-legal="'+section+'"]').click();
   await page.waitForFunction(()=>adCalls.filter(x=>typeof x==='boolean').at(-1)===true);
   assert(await page.locator('#nativeLegalDialog').isVisible());
   assert.match(await page.locator('#nativeLegalDialog').textContent(),/Support.exeptionHuman@3qinnova.com/);
   await page.getByRole('button',{name:'Back to game menu'}).click();
   await page.waitForFunction(()=>adCalls.filter(x=>typeof x==='boolean').at(-1)===true);
  }
  assert(await page.evaluate(()=>adCalls.includes('privacy')&&adCalls.includes('report')));
  for(const size of [{width:844,height:390},{width:568,height:320}]){
   await page.setViewportSize(size);
   const box=await page.locator('#mobileMenu .card').boundingBox();
   assert(box.y>=0&&box.y+box.height<=size.height,'Ad-free menu fits the viewport');
   assert.equal(await page.evaluate(()=>adCalls.filter(x=>typeof x==='boolean').at(-1)),true);
  }
  await page.setViewportSize({width:390,height:844});await page.waitForFunction(()=>adCalls.filter(x=>typeof x==='boolean').at(-1)===true);
  await page.setViewportSize({width:844,height:390});await page.waitForFunction(()=>adCalls.filter(x=>typeof x==='boolean').at(-1)===true);
  await page.locator('#mobileResume').click();await page.waitForFunction(()=>adCalls.filter(x=>typeof x==='boolean').at(-1)===false);

  await page.locator('[data-hold="right"]').dispatchEvent('pointerdown',{pointerId:9,pointerType:'touch'});
  await page.waitForSelector('#lossContinue:visible');
  await page.locator('[data-hold="right"]').dispatchEvent('pointerup',{pointerId:9,pointerType:'touch'});
  await page.waitForFunction(()=>adCalls.filter(x=>typeof x==='boolean').at(-1)===true);
  await page.locator('#lossContinue').click();
  await page.waitForFunction(()=>adCalls.filter(x=>typeof x==='boolean').at(-1)===false);
  await page.evaluate(()=>window.dispatchEvent(new CustomEvent('exception:ad-pause')));
  assert(await page.locator('#mobileMenu').isVisible());assert.deepEqual(errors,[]);
  await page.close();console.log('PASS native ad UI',fail?'offline fallback':'test mode','privacy/report, pause, menu spacing, rotation');
 }
}finally{await browser.close()}
