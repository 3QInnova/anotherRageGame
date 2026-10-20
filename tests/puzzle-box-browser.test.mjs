import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {webkit,chromium} from '/private/tmp/exception-forecast-browser/node_modules/playwright/index.mjs';
const root=new URL('../',import.meta.url),out=new URL('outputs/puzzle-box/',root);mkdirSync(out,{recursive:true});
const route=JSON.parse(readFileSync(new URL('route.json',out),'utf8')),results=[];
for(const [name,engine,mobile] of [['iphone-webkit',webkit,true],['desktop-chromium',chromium,false]]){
 const html=readFileSync(new URL(mobile?'mobile/index.html':'initalDemoDocs/Exception_Human_Misclassification_V3.html',root),'utf8');
 const fixture=html.replace('requestAnimationFrame(frame);\n})();',`window.puzzleReview={tick:()=>runFrame(1/120),paint(){draw();refreshHud()},step(n){for(let i=0;i<n;i++)runFrame(1/120);draw();refreshHud()}};draw();refreshHud();\n})();`);
 const browser=await engine.launch();try{
  const page=await browser.newPage({viewport:mobile?{width:844,height:390}:{width:1280,height:1000},isMobile:mobile,hasTouch:mobile,deviceScaleFactor:1});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.route('**/puzzle.html',r=>r.fulfill({body:fixture,contentType:'text/html'}));
  const tap=async selector=>{if(mobile)await page.locator(selector).tap();else await page.locator(selector).click()};
  const start=async()=>{await page.goto('http://localhost/puzzle.html');await page.locator('#openDataCenters').click();await page.locator('#campaignPuzzleBox').click();await page.evaluate(route=>{window.puzzleReplay={...route,at:0,frame:0,held:new Set()};window.puzzleReview.paint()},route)};
  const advance=async target=>page.evaluate(({target,mobile})=>{
   const r=window.puzzleReplay;
   const send=e=>{
    if(!mobile){document.dispatchEvent(new KeyboardEvent(e.down?'keydown':'keyup',{code:e.code,bubbles:true,cancelable:true}));return}
    if(/^Digit/.test(e.code)){if(e.down){window.puzzleReview.paint();const b=document.getElementById('puzzleInput'+(Number(e.code.slice(-1))-1));if(b.hidden)throw Error('Input must exist');b.click()}return}
    if(e.code==='Escape'){if(e.down)document.getElementById('puzzleBoxClose').click();return}
    if(e.code==='Enter'){if(e.down){window.puzzleReview.paint();const b=document.getElementById('puzzleBoxTest');if(b.disabled)throw Error('Test must be available');b.click()}return}
    if(e.down===r.held.has(e.code))return;if(e.down)r.held.add(e.code);else r.held.delete(e.code);
    const [selector,pointerId]=e.code==='KeyD'?['[data-hold="right"]',11]:['#touchjump',13];document.querySelector(selector).dispatchEvent(new PointerEvent(e.down?'pointerdown':'pointerup',{pointerId,pointerType:'touch',bubbles:true,cancelable:true}));
   };
   for(;r.frame<=r.frames;r.frame++){
    while(r.at<r.events.length&&r.events[r.at].frame===r.frame)send(r.events[r.at++]);
    if(r.frame<r.frames)window.puzzleReview.tick();
    const s=window.__EXCEPTION_TEST__.getState(),c=window.__PUZZLE_BOX_TEST__.state();
    if(s.state==='dead')throw Error('Puzzle route died: '+document.getElementById('lossReason').textContent);
    if(target>=0&&window.__PUZZLE_BOX_TEST__.open()===c[target].id&&c[target].phase==='preview'){r.frame++;window.puzzleReview.paint();return {state:s,circuit:c}}
   }
   window.puzzleReview.paint();return {state:window.__EXCEPTION_TEST__.getState(),circuit:window.__PUZZLE_BOX_TEST__.state(),progress:window.__DATA_CENTER_TEST__.progress(),credits:window.__CREDIT_TEST__.total()};
  },{target,mobile});
  await start();
  for(let index=0;index<3;index++){
   const milestone=await advance(index);assert.equal(milestone.state.idleCompute.phase,'circuit');assert(await page.locator('#puzzleBoxPanel').isVisible());
   assert.equal(await page.locator('#coolingPanel').isVisible(),false);
   if(index===0){
    await tap('#puzzleInput0');await tap('#puzzleInput1');
    assert.equal(await page.evaluate(()=>window.__PUZZLE_BOX_TEST__.state()[0].logic.ground),true);
    await page.evaluate(()=>window.puzzleReview.step(600));assert.equal(await page.evaluate(()=>window.__EXCEPTION_TEST__.getState().state),'play');
    assert.equal(await page.evaluate(()=>window.__PUZZLE_BOX_TEST__.state()[0].temperature),1);
    const pulse=await page.locator('.signal-packets').first().evaluate(el=>getComputedStyle(el).strokeDashoffset);await page.evaluate(()=>window.puzzleReview.step(30));assert.notEqual(await page.locator('.signal-packets').first().evaluate(el=>getComputedStyle(el).strokeDashoffset),pulse);
    await tap('#puzzleInput0');await tap('#puzzleInput1');
    await tap('[data-puzzle-node="G1"]');assert.match(await page.locator('#puzzleBoxStatus').textContent(),/ONE ONLY.*0, 0 → 0/);assert(await page.locator('.puzzle-wire.dim').count()>0);
    await tap('[data-puzzle-node="G1"]');
    if(!mobile){await page.locator('[data-puzzle-node="G1"]').focus();await page.keyboard.press('Enter');assert.equal(await page.evaluate(()=>window.__PUZZLE_BOX_TEST__.state()[0].phase),'preview','Inspecting never powers hardware');await page.keyboard.press('Enter');assert.equal(await page.evaluate(()=>window.__PUZZLE_BOX_TEST__.state()[0].phase),'preview');await page.locator('#puzzleInput0').focus();await page.keyboard.press('Space');assert.equal(await page.evaluate(()=>window.__PUZZLE_BOX_TEST__.state()[0].bits[0]),true);await page.keyboard.press('Space');await page.keyboard.press('KeyX');assert.equal(await page.evaluate(()=>window.__PUZZLE_BOX_TEST__.state()[0].phase),'preview','Open shortcut never powers hardware')}
    await tap('#puzzleBoxClose');assert.equal(await page.locator('#puzzleBoxPanel').isVisible(),false);
    if(mobile)await tap('#glitch');else await page.keyboard.press('KeyX');assert(await page.locator('#puzzleBoxPanel').isVisible());
   }
   for(const viewport of mobile?[{width:568,height:320},{width:667,height:375},{width:844,height:280},{width:844,height:390},{width:956,height:440}]:[{width:1280,height:1000}]){
    await page.setViewportSize(viewport);await page.waitForTimeout(35);await page.evaluate(()=>window.puzzleReview.paint());
    const fit=await page.evaluate(()=>{
     const card=document.querySelector('.puzzle-box-card').getBoundingClientRect(),svg=document.getElementById('puzzleTrace'),matrix=svg.getScreenCTM();
     return {inside:card.left>=0&&card.right<=innerWidth&&card.top>=0&&(innerHeight<500?card.bottom<=innerHeight:true),buttons:[...document.querySelectorAll('.puzzle-box-actions button')].filter(b=>!b.hidden).every(b=>{const r=b.getBoundingClientRect();return r.width>=44&&r.height>=44&&r.left>=card.left&&r.right<=card.right&&r.bottom<=card.bottom}),primaryTextPixels:matrix.a*18,overflow:document.documentElement.scrollWidth>innerWidth};
    });
    assert(fit.inside&&fit.buttons&&fit.primaryTextPixels>=10&&!fit.overflow,JSON.stringify({index,viewport,fit}));
    if(index===2)await page.screenshot({path:new URL(name+'-'+viewport.width+'x'+viewport.height+'.png',out).pathname,fullPage:true});
   }
   if(mobile)await page.setViewportSize({width:844,height:390});
   await page.screenshot({path:new URL(name+'-box-'+(index+1)+'.png',out).pathname,fullPage:true});
   // The drawn graph is generated from exactly the same source/pin pairs as the evaluator.
   assert(await page.evaluate(index=>{const s=window.__PUZZLE_BOX_TEST__.state()[index],edges=window.__PUZZLE_BOX_TEST__.edges(s.board).edges;const paths=[...document.querySelectorAll('.puzzle-wire>path:first-child')];return paths.length===edges.length&&paths.every(p=>{const e=edges.find(e=>e.source===p.dataset.source&&e.target===p.dataset.target&&String(e.pin??'out')===p.dataset.pin);return e?.path===p.getAttribute('d')&&p.parentElement.classList.contains('high')===s.logic.signals[e.source]})},index));
  }
  const finish=await advance(-1);assert.equal(finish.state.state,'won');assert.equal(finish.state.deaths,0);assert.equal(finish.state.credits.balance,4);assert(finish.circuit.every(s=>s.solved));assert.equal(finish.progress.cleared.length,0);assert.equal(finish.credits,0);
  if(mobile)await tap('#mobileWinRestart');else await page.keyboard.press('KeyR');assert.equal(await page.evaluate(()=>window.__PUZZLE_BOX_TEST__.state().filter(s=>s.solved).length),0);
  await start();await advance(0);await tap('#puzzleInput0');await tap('#puzzleInput1');await tap('#puzzleBoxTest');assert(await page.locator('#puzzleInput0').isDisabled());
  if(mobile)await tap('#mobilePause');else await page.locator('#openDataCenters').click();assert.equal(await page.locator('#puzzleBoxPanel').isVisible(),false);const frozen=await page.evaluate(()=>({world:window.__EXCEPTION_TEST__.getState(),box:window.__PUZZLE_BOX_TEST__.state()}));await page.evaluate(()=>window.puzzleReview.step(1200));assert.deepEqual(await page.evaluate(()=>({world:window.__EXCEPTION_TEST__.getState(),box:window.__PUZZLE_BOX_TEST__.state()})),frozen);
  if(mobile){await tap('#mobileResume')}else await tap('#campaignClose');
  await page.evaluate(()=>window.puzzleReview.step(90));await page.screenshot({path:new URL(name+'-powered-test.png',out).pathname,fullPage:true});await page.evaluate(()=>window.puzzleReview.step(90));assert.equal(await page.evaluate(()=>window.__EXCEPTION_TEST__.getState().state),'dead');assert.match(await page.locator('#lossReason').textContent(),/TEST CIRCUIT/);await page.screenshot({path:new URL(name+'-electrocuted.png',out).pathname,fullPage:true});await page.evaluate(()=>window.puzzleReview.step(1200));assert.equal(await page.evaluate(()=>window.__EXCEPTION_TEST__.getState().state),'dead');await tap('#lossContinue');await tap('#lossContinue');assert.equal(await page.evaluate(()=>window.__EXCEPTION_TEST__.getState().state),'play');
  assert.deepEqual(errors,[]);results.push({engine:name,boxes:3,inputs:[3,4,5],literalGraphRendering:true,signalsAnimateOnSimulationClock:true,realSwitchTaps:true,gateInspectionHighlightsSources:true,previewCannotShock:true,testLocksInputs:true,groundTestElectrocutes:true,lossReadingAndRetry:true,layoutsFit:true,allButtonsAtLeast44px:true,primaryDiagramLabelsAtLeast10px:true,pauseFreezesTest:true,chasedClear:true,deaths:0,creditsLeft:4,restartSameLevel:true,practiceIsolated:true,errors});
 }finally{await browser.close()}
}
writeFileSync(new URL('browser-results.json',out),JSON.stringify(results,null,2)+'\n');console.log('PASS: Puzzle Box WebKit touch/Chromium keyboard clears, literal animated wires, real input taps, inspection, five phone layouts, safe preview, explicit tests/electrocution, pause, retry and isolation.');
