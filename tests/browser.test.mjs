import assert from 'node:assert/strict';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || '/private/tmp/exception-forecast-browser/node_modules/playwright/index.mjs');
const html = readFileSync(new URL('../initalDemoDocs/Exception_Human_Misclassification_V3.html', import.meta.url), 'utf8');
const route = JSON.parse(readFileSync(new URL('../outputs/forecast-feedback/completion-route.json', import.meta.url)));
const output = new URL('../outputs/forecast-feedback/', import.meta.url);mkdirSync(output,{recursive:true});
const hooked = html.replace('initRoom(true);requestAnimationFrame(frame);', `initRoom(true);compactSeed=424242;resetCompactWatch();paywallSeed=98765;resetPaywallWatch();
window.__BROWSER_TEST__={
 step(count){for(let i=0;i<count;i++)runFrame(1/120);draw();refreshHud()},
 fixture(phase){room=2;initRoom();player.x=phase==='scanning'?546:644;
 for(const hazard of [...L.crumble,...L.spikes,...L.blocks])trap[hazard.id].phase='done';glitch.wall=sceneTime+2.55;
 if(phase!=='scanning')runFrame(1/120);
 if(phase==='purge'||phase==='missed'){while(trap['predict-c'].phase!=='on')runFrame(1/120)}
 if(phase==='missed'){while(trap['predict-c'].phase!=='done')runFrame(1/120)}draw();refreshHud();
 },showRemark(remark){initRoom();die('Loss reason remains separately readable.','review');$('ovDesc').textContent=remark;say(remark,'danger')},allRemarks:()=>Object.entries(LOSS_REMARKS).flatMap(([category,pool])=>pool.map(remark=>({category,remark})))
 };`);
assert.notEqual(hooked,html,'Test instrumentation must replace the frame bootstrap');
const browser=await chromium.launch({headless:true}),errors=[];
try{
 const page=await browser.newPage({viewport:{width:1300,height:1250}});
 page.on('pageerror',e=>errors.push(e.message));await page.setContent(hooked);
 assert.equal(await page.evaluate(()=>document.getElementById('stage').contains(document.querySelector('.two'))),false,'The loss overlay belongs only to the playfield');
 const state=()=>page.evaluate(()=>window.__EXCEPTION_TEST__.getState());
 for(const event of route){
  await page.evaluate(index=>{for(let n=0;n<2400&&window.__EXCEPTION_TEST__.getState().room<index;n++)window.__BROWSER_TEST__.step(1)},event.room);
  const s=await state();assert.equal(s.room,event.room);
  const delta=event.frame-Math.round(s.roomElapsed*120);assert(delta>=0);
  await page.evaluate(n=>window.__BROWSER_TEST__.step(n),delta);
  assert(['play','won','compacting','paywall'].includes((await state()).state));
  if(event.code)await page.keyboard[event.down?'down':'up'](event.code);
 }
 await page.evaluate(()=>window.__BROWSER_TEST__.step(2400));
 assert.equal((await state()).state,'won');assert.equal((await state()).deaths,0);
 await page.screenshot({path:new URL('all-rooms-cleared.png',output).pathname,fullPage:true});
 for(const phase of ['scanning','locked','purge','missed']){
  await page.evaluate(p=>window.__BROWSER_TEST__.fixture(p),phase);
  const text=await page.locator('#forecast').innerText();
  assert.match(text,{scanning:/SCANNING/,locked:/TARGET LOCKED/,purge:/PURGING/,missed:/PREDICTION FAILED/}[phase]);
  await page.screenshot({path:new URL(`${phase}-desktop.png`,output).pathname,fullPage:true});
 }
 // Live document smoke test: use the shipping animation loop and its actual controls.
 const live=await browser.newPage();live.on('pageerror',e=>errors.push(e.message));
 await live.setContent(html);await live.keyboard.down('KeyD');await live.waitForFunction(()=>window.__EXCEPTION_TEST__.getState().player.x>70);await live.keyboard.up('KeyD');
 await live.getByRole('button',{name:'↻ Retry room',exact:true}).click();assert.equal(await live.evaluate(()=>window.__EXCEPTION_TEST__.getState().room),0);await live.close();

 const mobile=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2});
 mobile.on('pageerror',e=>errors.push(e.message));await mobile.setContent(hooked);
 assert.equal(await mobile.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 assert(await mobile.locator('#touch').isVisible());
 await mobile.locator('[data-hold="right"]').scrollIntoViewIfNeeded();
 const move=await mobile.locator('[data-hold="right"]').boundingBox();await mobile.mouse.move(move.x+move.width/2,move.y+move.height/2);await mobile.mouse.down();
 await mobile.evaluate(()=>window.__BROWSER_TEST__.step(15));await mobile.mouse.up();
 const moved=await mobile.evaluate(()=>window.__EXCEPTION_TEST__.getState().player.x);assert(moved>70);
 await mobile.evaluate(()=>window.__BROWSER_TEST__.step(15));assert.equal(await mobile.evaluate(()=>window.__EXCEPTION_TEST__.getState().player.x),moved);
 const jump=await mobile.locator('#touchjump').boundingBox();await mobile.touchscreen.tap(jump.x+jump.width/2,jump.y+jump.height/2);
 await mobile.evaluate(()=>window.__BROWSER_TEST__.step(5));assert((await mobile.evaluate(()=>window.__EXCEPTION_TEST__.getState().player.vy))<0);
 await mobile.evaluate(()=>window.__BROWSER_TEST__.fixture('locked'));
 const rewrite=await mobile.locator('#glitch').boundingBox();await mobile.touchscreen.tap(rewrite.x+rewrite.width/2,rewrite.y+rewrite.height/2);
 assert((await mobile.evaluate(()=>window.__EXCEPTION_TEST__.getState().glitch.wall))>0);
 await mobile.screenshot({path:new URL('locked-mobile.png',output).pathname,fullPage:true});
 // Trigger a real floor loss, then check readable persistence and distinct skip presses.
 await page.setContent(hooked);await page.keyboard.down('KeyD');await page.evaluate(()=>window.__BROWSER_TEST__.step(300));await page.keyboard.up('KeyD');
 assert.equal((await state()).state,'dead');assert.equal(await page.locator('#deaths').innerText(),String((await state()).deaths));const remark=await page.locator('#ovDesc').innerText();
 await page.screenshot({path:new URL('loss-desktop.png',output).pathname,fullPage:true});
 await page.evaluate(()=>window.__BROWSER_TEST__.step(1200));assert.equal((await state()).state,'dead');assert.equal(await page.locator('#ovDesc').innerText(),remark);
 await page.keyboard.down('Space');assert.equal((await state()).state,'dead');
 await page.keyboard.down('Space');assert.equal((await state()).state,'dead','Keyboard repeat cannot skip twice');
 await page.keyboard.up('Space');await page.keyboard.press('Enter');assert.equal((await state()).state,'play');
 assert.equal((await state()).player.jumpBuffer,0);
 await mobile.setContent(hooked);await mobile.keyboard.down('KeyD');await mobile.evaluate(()=>window.__BROWSER_TEST__.step(300));await mobile.keyboard.up('KeyD');
 assert.equal(await mobile.evaluate(()=>window.__EXCEPTION_TEST__.getState().state),'dead');
 await mobile.locator('#lossContinue').scrollIntoViewIfNeeded();
 const fits=await mobile.evaluate(()=>{const card=document.querySelector('.reading-loss .card'),overlay=document.getElementById('overlay');return card.scrollHeight<=card.clientHeight+1&&card.getBoundingClientRect().height<=overlay.getBoundingClientRect().height});assert(fits,'Loss card fits the narrow-screen overlay');
 assert.equal(await mobile.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await mobile.screenshot({path:new URL('loss-mobile.png',output).pathname,fullPage:true});
 await mobile.locator('#lossContinue').tap();assert.equal(await mobile.evaluate(()=>window.__EXCEPTION_TEST__.getState().state),'dead');
 await mobile.locator('#lossContinue').tap();assert.equal(await mobile.evaluate(()=>window.__EXCEPTION_TEST__.getState().state),'play');
 const remarks=await mobile.evaluate(()=>window.__BROWSER_TEST__.allRemarks());
 for(const {remark} of remarks){await mobile.evaluate(text=>window.__BROWSER_TEST__.showRemark(text),remark);
  assert(await mobile.evaluate(()=>{const card=document.querySelector('.reading-loss .card');return card.scrollHeight<=card.clientHeight+1}),`Remark fits the mobile reading card: ${remark}`);
 }
 const longest=remarks.reduce((a,b)=>a.remark.length>b.remark.length?a:b);await mobile.evaluate(text=>window.__BROWSER_TEST__.showRemark(text),longest.remark);
 await mobile.screenshot({path:new URL('longest-remark-mobile.png',output).pathname,fullPage:true});
 assert.deepEqual(errors,[]);
 writeFileSync(new URL('browser-results.json',output),JSON.stringify({browser:'Chromium',allRoomsCleared:true,deaths:0,forecastPhases:['scanning','locked','purge','missed'],mobileOverflow:false,pointerMovement:true,touchJump:true,touchRewrite:true,liveAnimationLoop:true,lossRemarkPersists:true,twoDistinctSkipPresses:true,lossCardFitsMobile:true,touchSkip:true,remarksChecked:remarks.length,allRemarksFitMobile:true,pageErrors:errors},null,2)+'\n');
 console.log('PASS: Chromium normal keyboard route clears all nine rooms; all forecast phases render without script errors.');
 console.log('PASS: live animation loop, retry, narrow layout, pointer movement/release and touch jump/rewrite; screenshots saved.');
 console.log('PASS: readable loss hold, repeat-key guard, Space/Enter skip, narrow loss card and two-tap touch skip.');
}finally{await browser.close()}
