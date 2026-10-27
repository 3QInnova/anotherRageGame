import {openModeMenu} from './browser-controls.mjs';
import assert from 'node:assert/strict';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {webkit,chromium} from '/private/tmp/exception-forecast-browser/node_modules/playwright/index.mjs';
const root=new URL('../',import.meta.url),out=new URL('outputs/credits/',root);mkdirSync(out,{recursive:true});
const results=[];
for(const [name,engine,mobile] of [['iphone-webkit',webkit,true],['desktop-chromium',chromium,false]]){
 const html=readFileSync(new URL(mobile?'mobile/index.html':'initalDemoDocs/Exception_Human_Misclassification_V3.html',root),'utf8');
 const fixture=html.replace('requestAnimationFrame(frame);\n})();',`window.creditReview={step(n){for(let i=0;i<n;i++)runFrame(1/120);draw();refreshHud()}};draw();refreshHud();\n})();`);
 const browser=await engine.launch();try{
 const page=await browser.newPage({viewport:mobile?{width:844,height:390}:{width:1280,height:900},isMobile:mobile,hasTouch:mobile});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/credits.html',r=>r.fulfill({body:fixture,contentType:'text/html'}));await page.goto('http://localhost/credits.html');
 if(mobile)await page.locator('#mobileResume').tap();
 await page.locator('#creditPanel').waitFor({state:'visible'});
 const initial=await page.evaluate(()=>window.__CREDIT_TEST__.state().balance);
 await page.locator('#touchjump').dispatchEvent('pointerdown',{pointerId:1,pointerType:mobile?'touch':'mouse'});await page.locator('#touchjump').dispatchEvent('pointerup',{pointerId:1});
 await page.evaluate(()=>window.creditReview.step(1));assert.equal(await page.evaluate(()=>window.__CREDIT_TEST__.state().balance),initial-1);
 await page.screenshot({path:new URL(name+'-credits.png',out).pathname});
 if(mobile){
  for(const size of [{width:568,height:320},{width:568,height:375},{width:844,height:390}]){
   await page.setViewportSize(size);
   await page.evaluate(()=>{document.documentElement.style.setProperty('--control-size','1.15');document.documentElement.style.setProperty('--control-inset','30px')});
   const fit=await page.evaluate(()=>{const b=id=>{const r=document.getElementById(id).getBoundingClientRect();return {x:r.x,y:r.y,right:r.right,bottom:r.bottom}};return {credit:b('creditPanel'),left:b('movePad'),right:b('actionPad')}});
   assert(fit.credit.x>=0&&fit.credit.y<=32&&fit.credit.bottom<Math.min(fit.left.y,fit.right.y),JSON.stringify(fit));assert(fit.credit.bottom<=size.height);
  }
  await page.setViewportSize({width:844,height:390});
  await page.locator('#mobilePause').tap();assert.equal(await page.locator('#creditPanel').isVisible(),false);await page.locator('#mobileResume').tap();
 }
 // Ordinary jumps spend every credit at the safe starting position; no mutable credit hook.
 for(let i=0;i<initial+1;i++){
  if(await page.evaluate(()=>window.__EXCEPTION_TEST__.getState().state)==='compacting')break;
  await page.evaluate(()=>window.creditReview.step(100));await page.keyboard.press('Space');await page.evaluate(()=>window.creditReview.step(1));
 }
 const exhausted=await page.evaluate(()=>window.__EXCEPTION_TEST__.getState());assert.equal(exhausted.state,'compacting');assert.equal(exhausted.credits.balance,0);
 assert.equal(await page.locator('#paywallScreen').isVisible(),false);assert.match(await page.locator('#compactCountdown').textContent(),/credits on restore/);
 await page.screenshot({path:new URL(name+'-exhausted.png',out).pathname});
 await page.evaluate(()=>window.creditReview.step(1800));assert.equal(await page.evaluate(()=>window.__EXCEPTION_TEST__.getState().state),'play');assert((await page.evaluate(()=>window.__CREDIT_TEST__.state().balance))>0);
 if(mobile)await page.locator('#mobilePause').tap();
 await openModeMenu(page,'#openDataCenters');await page.locator('#creditSummary').waitFor({state:'visible'});assert.match(await page.locator('#creditRules').textContent(),/Right and waiting: free/);assert.deepEqual(errors,[]);
 results.push({engine:name,jumpCostsCredit:true,realInputExhaustion:true,refill:true,menuRules:true,largeControlsFit:mobile});
 }finally{await browser.close()}
}
writeFileSync(new URL('browser-results.json',out),JSON.stringify(results,null,2)+'\n');console.log('PASS: WebKit and Chromium real jump costs, exhaustion/frozen compaction/refill, no billing, saved-score menu and mobile credit chip with maximum controls/insets.');
