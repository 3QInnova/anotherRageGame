import assert from 'node:assert/strict';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {webkit,chromium} from '/private/tmp/exception-forecast-browser/node_modules/playwright/index.mjs';
const root=new URL('../',import.meta.url),out=new URL('outputs/failure-voice/',root);mkdirSync(out,{recursive:true});const results=[];
for(const [name,engine,mobile] of [['iphone-webkit',webkit,true],['desktop-chromium',chromium,false]]){
 const html=readFileSync(new URL(mobile?'mobile/index.html':'initalDemoDocs/Exception_Human_Misclassification_V3.html',root),'utf8');
 const fixture=html.replace('requestAnimationFrame(frame);\n})();',`window.failureReview={
 tick(n=1){for(let i=0;i<n;i++)runFrame(1/120);draw();refreshHud()},
 impact(family){const h=family==='scan'?L.spikes.find(s=>!s.sky):family==='air-scan'?L.spikes.find(s=>s.sky):family==='policy'?L.blocks[0]:family==='forecast'?L.forecasts[0]:family==='wall'?L.walls[0]:L.crumble[0];
 player.x=h.x+(h.w-PW)/2;player.y=FLOOR-PH;player.vy=0;player.grounded=false;
 if(family==='scan'||family==='air-scan'){player.y=scanRect(h).y+5;trap[h.id].phase='on'}
 if(family==='policy'){trap[h.id].phase='on';trap[h.id].t=sceneTime;trap[h.id].until=sceneTime+1.35;player.y=noticeTop(h)+16}
 if(family==='forecast'){trap[h.id].phase='on';trap[h.id].x=h.x;trap[h.id].until=sceneTime+.58}
 if(family==='redaction'){trap[h.id].phase='on';fallCause=h.id;player.y=H+20}
 runFrame(1/120);draw();refreshHud();},
 all:()=>Object.entries(LOSS_REMARKS).flatMap(([family,a])=>a.map(text=>({family,text}))),
 show(family,text){initRoom();if(typeof resumeMobile==='function')resumeMobile();die('Cause remains visible.','review',family);$('ovDesc').textContent=text;for(let i=0;i<240;i++)runFrame(1/120);draw();refreshHud()}
 };draw();refreshHud();\n})();`);assert.notEqual(fixture,html);
 const browser=await engine.launch();try{
  const page=await browser.newPage({viewport:mobile?{width:844,height:390}:{width:1280,height:900},isMobile:mobile,hasTouch:mobile,deviceScaleFactor:1}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/failure.html',r=>r.fulfill({body:fixture,contentType:'text/html'}));await page.goto('http://localhost/failure.html');
  const captured=[];
  for(const id of ['localhost-01','localhost-13','localhost-18','localhost-20'])for(const family of ['scan','air-scan','policy','forecast','wall','redaction']){
   assert(await page.evaluate(id=>window.__DATA_CENTER_TEST__.start(id,true),id));await page.evaluate(family=>window.failureReview.impact(family),family);
   const last=await page.evaluate(()=>window.__FAILURE_VOICE_TEST__.last());assert.equal(last.family,family);assert.equal(await page.locator('#ovDesc').textContent(),last.remark);assert.equal(await page.locator('#lossReason').textContent(),last.reason);
   if(family==='air-scan'){assert(!/floor|ground|gravity|geometry|skull/i.test(last.remark));assert(!/geometry|body/i.test(last.reason));if(id==='localhost-13')await page.screenshot({path:new URL(name+'-overhead-loss.png',out).pathname,fullPage:true})}
   const frozen=await page.evaluate(()=>window.__EXCEPTION_TEST__.getState());await page.evaluate(()=>window.failureReview.tick(1200));const after=await page.evaluate(()=>window.__EXCEPTION_TEST__.getState());assert.equal(after.state,'dead');assert.deepEqual(after.player,frozen.player);assert.equal(after.sceneTime,frozen.sceneTime);assert.equal(await page.locator('#ovDesc').textContent(),last.remark);
   const tap=async()=>mobile?page.locator('#lossContinue').tap():page.locator('#lossContinue').click();await tap();assert.equal(await page.evaluate(()=>window.__EXCEPTION_TEST__.getState().state),'dead');await tap();assert.equal(await page.evaluate(()=>window.__EXCEPTION_TEST__.getState().state),'play');captured.push(last);
  }
  const entries=await page.evaluate(()=>window.failureReview.all());assert.equal(entries.length,416);
  for(const viewport of mobile?[{width:568,height:320},{width:844,height:280},{width:844,height:390}]:[{width:1280,height:900}]){
   await page.setViewportSize(viewport);
   for(const e of entries){await page.evaluate(e=>window.failureReview.show(e.family,e.text),e);assert(await page.locator('#overlay .card').evaluate(el=>el.scrollHeight<=el.clientHeight+1),'Loss remark fits '+JSON.stringify({viewport,e}));}
  }
  assert.deepEqual(errors,[]);results.push({browser:name,actualCollisionLosses:captured.length,remarksChecked:entries.length,smallLandscapeLayout:mobile,matchingSnarkAndCause:true,twoTapRetry:true,fullReadingPause:true,pageErrors:errors});
 }finally{await browser.close()}
}
writeFileSync(new URL('browser-results.json',out),JSON.stringify(results,null,2)+'\n');console.log('PASS: contextual collision screens in Chromium/WebKit, 416 remarks fit, three phone layouts, full reading pause and two-tap retry.');
