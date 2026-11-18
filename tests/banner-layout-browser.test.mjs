import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {webkit,chromium} from '/private/tmp/exception-forecast-browser/node_modules/playwright/index.mjs';

const root=new URL('../',import.meta.url),out=new URL('outputs/app-store/banner-layout/',root);mkdirSync(out,{recursive:true});
const fixture=readFileSync(new URL('outputs/release-tests/mobile.html',root),'utf8');
const selected=process.env.EXCEPTION_BANNER_BROWSER;
assert(!selected||['chromium','webkit'].includes(selected),'Use an explicit supported browser name.');
const engines=[['webkit',webkit],['chromium',chromium]].filter(([name])=>!selected||selected===name),results=[];
const viewports=[
 {width:568,height:320,left:0,right:0,bottom:0},
 {width:667,height:375,left:0,right:0,bottom:0},
 {width:844,height:390,left:44,right:44,bottom:21},
 {width:956,height:440,left:62,right:62,bottom:21},
 {width:844,height:280,left:44,right:44,bottom:21},
 {width:844,height:390,left:44,right:0,bottom:21},
 {width:844,height:390,left:0,right:44,bottom:21},
];
const overlaps=(a,b)=>a.left<b.right-.25&&a.right>b.left+.25&&a.top<b.bottom-.25&&a.bottom>b.top+.25;
for(const [name,engine] of engines){
 const browser=await engine.launch();
 try{
  const page=await browser.newPage({viewport:{width:844,height:390},isMobile:true,hasTouch:true,deviceScaleFactor:2}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/banner.html',r=>r.fulfill({body:fixture,contentType:'text/html'}));
  await page.goto('http://localhost/banner.html#campaign=localhost-01&practice=1');
  await page.evaluate(()=>window.__QA__.start('localhost-01'));
  for(const viewport of viewports){
   await page.setViewportSize({width:viewport.width,height:viewport.height});
   await page.evaluate(v=>{const s=document.documentElement.style;for(const key of ['left','right','bottom'])s.setProperty('--safe-'+key,v[key]+'px');window.dispatchEvent(new Event('resize'))},viewport);
   let fixed;
   for(const prefs of [{size:90,inset:10},{size:100,inset:14},{size:115,inset:30}]){
    if(await page.locator('#mobileMenu').isHidden())await page.locator('#mobilePause').tap();
    if(!await page.locator('#menuSettings').evaluate(el=>el.open))await page.locator('#menuSettings > summary').tap();
    await page.locator('#tab-controls').tap();await page.locator('#controlSize').fill(String(prefs.size));await page.locator('#controlInset').fill(String(prefs.inset));
    await page.locator('#tab-play').tap();await page.locator('#mobileResume').tap();await page.evaluate(()=>window.__QA__.paint());
    const fit=await page.evaluate(()=>({
     banner:document.getElementById('mobileBannerSlot').getBoundingClientRect().toJSON(),
     controls:[...document.querySelectorAll('button,a[href],input,select,textarea,summary,[role="button"]')].filter(el=>el.getClientRects().length&&getComputedStyle(el).visibility==='visible').map(el=>({id:el.id||el.dataset.hold,r:el.getBoundingClientRect().toJSON()})),
     overflow:document.documentElement.scrollWidth>innerWidth||document.documentElement.scrollHeight>innerHeight,
    }));
    assert.equal(fit.banner.width,320);assert.equal(fit.banner.height,50);
    assert.equal(fit.banner.left,(viewport.width+viewport.left-viewport.right-320)/2);
    assert.equal(fit.banner.bottom,viewport.height-Math.max(8,viewport.bottom));
    assert(!fit.overflow);
    if(fixed)assert.deepEqual(fit.banner,fixed,'Changing controls must never relocate the banner.');fixed=fit.banner;
    const exclusion={left:fixed.left-24,right:fixed.right+24,top:fixed.top-24,bottom:fixed.bottom+24};
    for(const c of fit.controls){
     assert(c.r.width>=48&&c.r.height>=48,c.id+' remains a usable touch target');
     assert(c.r.left>=viewport.left&&c.r.right<=viewport.width-viewport.right+.5,c.id+' stays in horizontal safe area');
     assert(c.r.top>=0&&c.r.bottom<=viewport.height-viewport.bottom+.5,c.id+' stays on screen');
     assert(!overlaps(c.r,exclusion),c.id+' stays outside the banner and inactive buffer');
    }
    for(let i=0;i<fit.controls.length;i++)for(let j=i+1;j<fit.controls.length;j++)assert(!overlaps(fit.controls[i].r,fit.controls[j].r),'Touch targets never overlap.');
    const before=await page.evaluate(()=>window.__QA__.state().player);
    await page.touchscreen.tap(fixed.x+160,fixed.y+25);await page.evaluate(()=>window.__QA__.tick());
    const after=await page.evaluate(()=>window.__QA__.state().player);
    assert.equal(after.jumpBuffer,0,'Tapping the reserved ad space never queues a jump.');assert.equal(after.vy,before.vy);
    results.push({browser:name,viewport,prefs,banner:fixed,controls:fit.controls});
    if(prefs.size===100&&viewport.left===viewport.right)await page.screenshot({path:new URL(name+'-'+viewport.width+'x'+viewport.height+'.png',out).pathname});
   }
  }
  await page.setViewportSize({width:844,height:390});
  await page.evaluate(()=>{const s=document.documentElement.style;s.setProperty('--safe-left','44px');s.setProperty('--safe-right','44px');s.setProperty('--safe-bottom','21px');window.dispatchEvent(new Event('resize'))});
  await page.locator('#mobilePause').tap();await page.locator('#tab-controls').tap();await page.locator('#resetControls').tap();await page.locator('#tab-play').tap();await page.locator('#mobileResume').tap();
  const anchor=await page.locator('#mobileBannerSlot').boundingBox();
  await page.evaluate(()=>window.__QA__.start('localhost-01'));
  assert.deepEqual(await page.locator('#mobileBannerSlot').boundingBox(),anchor,'Selecting a level never relocates the banner.');
  await page.locator('[data-hold="right"]').dispatchEvent('pointerdown',{pointerId:11,pointerType:'touch'});await page.locator('#touchjump').tap();await page.evaluate(()=>Array.from({length:6},()=>window.__QA__.tick()));
  const moving=await page.evaluate(()=>window.__QA__.state());assert(moving.player.vx>0&&moving.player.vy<0,'Move and Jump still work together.');
  await page.locator('[data-hold="right"]').dispatchEvent('pointercancel',{pointerId:11,pointerType:'touch'});
  await page.locator('#mobilePause').tap();await page.locator('#mobileResume').tap();await page.evaluate(()=>window.__QA__.tick());
  assert.equal((await page.evaluate(()=>window.__QA__.state())).player.vx,0,'Pause/resume releases movement.');
  assert.deepEqual(await page.locator('#mobileBannerSlot').boundingBox(),anchor,'Pause/resume never relocates the banner.');
  await page.evaluate(()=>window.__QA__.start('localhost-01'));await page.locator('#mobilePause').focus();await page.locator('#mobilePause').blur();await page.evaluate(()=>window.__QA__.paint());
  await page.screenshot({path:new URL(name+'-fixed-banner-preview.png',out).pathname});
  assert.deepEqual(errors,[]);
 }finally{await browser.close()}
}
writeFileSync(new URL('layout-results.json',out),JSON.stringify({engines:engines.map(([name])=>name),cases:results,liveAdSdk:false,physicalTouchAcceptance:false},null,2)+'\n');
console.log('PASS: '+results.length+' fixed-banner layout cases in '+engines.map(([name])=>name).join(', ')+', safe-area clearance, saved control sizes, no overlap, empty-space taps, move+jump, and pause input release.');
