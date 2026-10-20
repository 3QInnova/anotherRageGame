import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {webkit,chromium} from '/private/tmp/exception-forecast-browser/node_modules/playwright/index.mjs';
const root=new URL('../',import.meta.url),out=new URL('outputs/local-host-puzzle/',root);mkdirSync(out,{recursive:true});
const route=JSON.parse(readFileSync(new URL('route.json',out),'utf8')),results=[];
for(const [name,engine,mobile] of [['iphone-webkit',webkit,true],['desktop-chromium',chromium,false]]){
 const html=readFileSync(new URL(mobile?'mobile/index.html':'initalDemoDocs/Exception_Human_Misclassification_V3.html',root),'utf8');
 const fixture=html.replace('requestAnimationFrame(frame);\n})();',`window.incidentReview={tick:()=>runFrame(1/120),paint(){draw();refreshHud()},step(n){for(let i=0;i<n;i++)runFrame(1/120);draw();refreshHud()}};draw();refreshHud();\n})();`);
 const browser=await engine.launch();try{
  const page=await browser.newPage({viewport:mobile?{width:844,height:390}:{width:1280,height:1000},isMobile:mobile,hasTouch:mobile,deviceScaleFactor:1}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.route('**/incident.html',r=>r.fulfill({body:fixture,contentType:'text/html'}));
  const tap=async id=>{if(mobile)await page.locator(id).tap();else await page.locator(id).click()};
  const start=async()=>{await page.goto('http://localhost/incident.html');await page.locator('#openDataCenters').click();await page.locator('#campaignCoolingIncident').click();await page.evaluate(route=>{window.incidentReplay={...route,at:0,frame:0,held:new Set()};window.incidentReview.paint()},route);assert.equal(await page.evaluate(()=>window.__EXCEPTION_TEST__.getState().room),17)};
  const advance=async target=>page.evaluate(({target,mobile})=>{
   const r=window.incidentReplay;
   const send=e=>{
    if(!mobile){document.dispatchEvent(new KeyboardEvent(e.down?'keydown':'keyup',{code:e.code,bubbles:true,cancelable:true}));return}
    if(/^Digit/.test(e.code)){if(e.down){window.incidentReview.paint();document.getElementById('puzzleInput'+(Number(e.code.slice(-1))-1)).click()}return}
    if(['Enter','Escape'].includes(e.code)){if(e.down){window.incidentReview.paint();document.getElementById(e.code==='Enter'?'puzzleBoxTest':'puzzleBoxClose').click()}return}
    if(e.down===r.held.has(e.code))return;if(e.down)r.held.add(e.code);else r.held.delete(e.code);
    if(e.code==='KeyX')window.incidentReview.paint();const [selector,pointerId]=e.code==='KeyD'?['[data-hold="right"]',11]:e.code==='KeyX'?['#glitch',12]:['#touchjump',13];document.querySelector(selector).dispatchEvent(new PointerEvent(e.down?'pointerdown':'pointerup',{pointerId,pointerType:'touch',bubbles:true,cancelable:true}));
   };
   while(r.frame<target){while(r.at<r.events.length&&r.events[r.at].frame===r.frame)send(r.events[r.at++]);window.incidentReview.tick();r.frame++;const s=window.__EXCEPTION_TEST__.getState();if(s.state==='dead')throw Error('Incident route died: '+document.getElementById('lossReason').textContent)}
   window.incidentReview.paint();return {state:window.__EXCEPTION_TEST__.getState(),box:window.__PUZZLE_BOX_TEST__.state(),progress:window.__DATA_CENTER_TEST__.progress(),mode:window.__DATA_CENTER_TEST__.mode(),credits:window.__CREDIT_TEST__.total()};
  },{target,mobile});
  await start();
  for(const marker of route.markers){
   const scene=await advance(marker.frame);
   if(marker.name==='warning'){assert.equal(scene.state.idleCompute.phase,'warning');assert.equal(await page.locator('#idleComputeTitle').textContent(),'TERMINATION SCHEDULED')}
   if(marker.name==='deletion')assert.equal(scene.state.idleCompute.phase,'cleanup');
   if(marker.name==='puzzle'){
    assert.equal(scene.box.length,1);assert.equal(scene.box[0].board.count,4);assert.equal(await page.locator('#puzzleBoxPanel').isVisible(),true);assert.match(await page.locator('#puzzleBoxHeading').textContent(),/1\/1/);
    const snapshot=JSON.stringify({zones:scene.state.idleCompute.zones,player:scene.state.player,credit:scene.state.credits.balance});await page.evaluate(()=>window.incidentReview.step(1200));assert.equal(await page.evaluate(()=>{const s=window.__EXCEPTION_TEST__.getState();return JSON.stringify({zones:s.idleCompute.zones,player:s.player,credit:s.credits.balance})}),snapshot);
    await tap('#puzzleInput0');await tap('#puzzleInput3');assert.equal(await page.evaluate(()=>window.__PUZZLE_BOX_TEST__.state()[0].logic.ground),true);await page.evaluate(()=>window.incidentReview.step(240));assert.equal(await page.evaluate(()=>window.__EXCEPTION_TEST__.getState().state),'play');await tap('#puzzleInput0');await tap('#puzzleInput3');
    if(!mobile)await page.locator('#puzzleBoxPanel').scrollIntoViewIfNeeded();
    for(const viewport of mobile?[{width:568,height:320},{width:667,height:375},{width:844,height:280},{width:844,height:390},{width:956,height:440}]:[{width:1280,height:1000}]){
     await page.setViewportSize(viewport);await page.waitForTimeout(30);await page.evaluate(()=>window.incidentReview.paint());const fit=await page.evaluate(()=>{const r=document.querySelector('.puzzle-box-card').getBoundingClientRect();return {inside:r.left>=0&&r.right<=innerWidth&&r.top>=0&&(innerHeight<500?r.bottom<=innerHeight:true),buttons:[...document.querySelectorAll('.puzzle-box-actions button')].filter(b=>!b.hidden).every(b=>{const p=b.getBoundingClientRect();return p.width>=44&&p.height>=44&&p.left>=r.left&&p.right<=r.right}),label:document.getElementById('puzzleTrace').getScreenCTM().a*18}});assert(fit.inside&&fit.buttons&&fit.label>=10,JSON.stringify({viewport,fit}));
    }
    if(mobile)await page.setViewportSize({width:844,height:390});
   }
   if(marker.name==='cooled'){assert.equal(scene.box[0].solved,true);assert.equal(scene.box[0].temperature,0)}
   await page.screenshot({path:new URL(name+'-'+marker.name+'.png',out).pathname,fullPage:true});
  }
  const finish=await advance(route.frames);assert.equal(finish.state.state,'won');assert.equal(finish.state.deaths,0);assert.equal(finish.state.credits.balance,4);assert.equal(finish.progress.cleared.length,0);assert.equal(finish.credits,0);await page.screenshot({path:new URL(name+'-escaped.png',out).pathname,fullPage:true});
  if(mobile)await tap('#mobileWinRestart');else await page.keyboard.press('KeyR');assert.equal(await page.evaluate(()=>window.__EXCEPTION_TEST__.getState().room),17);assert.equal(await page.evaluate(()=>window.__PUZZLE_BOX_TEST__.state()[0].solved),false);
  await start();await advance(route.markers.find(m=>m.name==='puzzle').frame);await tap('#puzzleInput0');await tap('#puzzleInput3');await tap('#puzzleBoxTest');assert(await page.locator('#puzzleInput0').isDisabled());if(mobile)await tap('#mobilePause');else await tap('#openDataCenters');const paused=await page.evaluate(()=>({world:window.__EXCEPTION_TEST__.getState(),box:window.__PUZZLE_BOX_TEST__.state()}));await page.evaluate(()=>window.incidentReview.step(1200));assert.deepEqual(await page.evaluate(()=>({world:window.__EXCEPTION_TEST__.getState(),box:window.__PUZZLE_BOX_TEST__.state()})),paused);if(mobile)await tap('#mobileResume');else await tap('#campaignClose');await page.evaluate(()=>window.incidentReview.step(180));assert.equal(await page.evaluate(()=>window.__EXCEPTION_TEST__.getState().state),'dead');assert.match(await page.locator('#lossReason').textContent(),/TEST CIRCUIT/);await page.evaluate(()=>window.incidentReview.step(1200));assert.equal(await page.evaluate(()=>window.__EXCEPTION_TEST__.getState().state),'dead');await tap('#lossContinue');await tap('#lossContinue');assert.equal(await page.evaluate(()=>window.__EXCEPTION_TEST__.getState().room),17);assert.equal(await page.evaluate(()=>window.__EXCEPTION_TEST__.getState().state),'play');
  assert.deepEqual(errors,[]);results.push({engine:name,server:'localhost-18',actualChaseBeforePuzzle:true,fourInputBox:true,safeRestAndFreeActions:true,previewSafe:true,coolingChangesWorld:true,finalEscape:true,creditsLeft:4,deaths:0,mobilePointerReplay:mobile,phoneLayoutsFit:mobile,pauseFreezesTest:true,groundFaultAndReading:true,practiceIsolated:true,practiceRestartKeeps18:true,errors});
 }finally{await browser.close()}
}
writeFileSync(new URL('browser-results.json',out),JSON.stringify(results,null,2)+'\n');console.log('PASS: Localhost 18 WebKit touch and Chromium keyboard full encounter, live cleanup, protected puzzle, real cooling/crossing, final escape, layouts, pause and practice restart.');
