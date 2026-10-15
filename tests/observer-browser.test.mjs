import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
const {chromium}=await import('/private/tmp/exception-forecast-browser/node_modules/playwright/index.mjs');
const html=readFileSync(new URL('../initalDemoDocs/Exception_Human_Misclassification_V3.html',import.meta.url),'utf8').replace('let paywallEnabled=true','let paywallEnabled=false');
const output=new URL('../outputs/observer/',import.meta.url);
const hooked=html.replace('initRoom(true);requestAnimationFrame(frame);',`initRoom(true);window.review={stage(n){observer.stage=n;observer.score=n*2;observer.forecastMisses=n>2?2:0;observer.reactionAt=observerTime-.5;observer.response=OBSERVER_REMARKS['observer-'+n][0];refreshObserver();draw()},line(text){$('observerResponse').textContent=text},lines:Object.values(OBSERVER_REMARKS).flat()};`);
const browser=await chromium.launch({headless:true});const errors=[];
try{
 const page=await browser.newPage({viewport:{width:1300,height:1250}});page.on('pageerror',e=>errors.push(e.message));await page.setContent(hooked);
 for(let stage=0;stage<6;stage++){await page.evaluate(n=>window.review.stage(n),stage);await page.screenshot({path:new URL(`stage-${stage}.png`,output).pathname,fullPage:true});assert(await page.locator('#observerResponse').isVisible())}
 const mobile=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});mobile.on('pageerror',e=>errors.push(e.message));await mobile.setContent(hooked);await mobile.evaluate(()=>window.review.stage(5));
 const result=await mobile.evaluate(()=>{const lines=window.review.lines;let previousHeight=null;for(const line of lines){window.review.line(line);const panel=document.querySelector('#observerComment'),text=document.querySelector('#observerResponse'),stage=document.querySelector('#stage');const p=panel.getBoundingClientRect(),r=text.getBoundingClientRect();if(r.right>p.right||r.bottom>p.bottom||r.left<p.left)return {error:line};if(previousHeight!==null&&previousHeight!==stage.getBoundingClientRect().top)return {error:'Layout shifted: '+line};previousHeight=stage.getBoundingClientRect().top}return {lines:lines.length,documentWidth:document.documentElement.scrollWidth,viewport:innerWidth}});
 assert.equal(result.error,undefined);assert.equal(result.lines,80);assert(result.documentWidth<=result.viewport,'No horizontal mobile overflow');
 await mobile.evaluate(()=>window.review.stage(5));await mobile.screenshot({path:new URL('mobile-stage-5.png',output).pathname,fullPage:true});assert.deepEqual(errors,[]);
 writeFileSync(new URL('browser-results.json',output),JSON.stringify({mobile:result,stagesRendered:6,pageErrors:errors},null,2)+'\n');console.log('PASS: six cosmetic stage previews, all 80 response lines fit without moving the playfield on mobile, no page errors.');
}finally{await browser.close()}
