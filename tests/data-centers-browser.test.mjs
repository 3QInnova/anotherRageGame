import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {webkit,chromium} from '/private/tmp/exception-forecast-browser/node_modules/playwright/index.mjs';
const root=new URL('../',import.meta.url),out=new URL('outputs/data-centers/',root);mkdirSync(out,{recursive:true});
const route=JSON.parse(readFileSync(new URL('campaign-route.json',out),'utf8')),results=[];
for(const [name,engine,mobile] of [['iphone-webkit',webkit,true],['desktop-chromium',chromium,false]]){
 const html=readFileSync(new URL(mobile?'mobile/index.html':'initalDemoDocs/Exception_Human_Misclassification_V3.html',root),'utf8');
 const fixture=html.replace('requestAnimationFrame(frame);\n})();',`window.campaignReview={step:()=>runFrame(1/120),draw,seed(n){compactSeed=n;resetCompactWatch();paywallSeed=(n^0x5afeb011)>>>0;resetPaywallWatch()}};draw();refreshHud();\n})();`);
 assert.notEqual(fixture,html);
 const browser=await engine.launch();
 try{
  const context=await browser.newContext({viewport:mobile?{width:844,height:390}:{width:1280,height:900},isMobile:mobile,hasTouch:mobile,deviceScaleFactor:1});
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/campaign-fixture.html',r=>r.fulfill({body:fixture,contentType:'text/html'}));await page.goto('http://localhost/campaign-fixture.html');
  await page.locator('#openDataCenters').click();await page.locator('#campaignMenu').waitFor({state:'visible'});
  assert.equal(await page.locator('#campaignWorlds button').count(),10);assert.equal(await page.locator('#campaignServers button').count(),20);
  assert.equal(await page.locator('#campaignServers button:not(:disabled)').count(),1);
  const before=await page.evaluate(()=>window.__EXCEPTION_TEST__.getState());await page.evaluate(()=>{for(let i=0;i<200;i++)window.campaignReview.step()});assert.deepEqual(await page.evaluate(()=>window.__EXCEPTION_TEST__.getState()),before);
  await page.screenshot({path:new URL(name+'-directory.png',out).pathname,fullPage:true});
  await page.locator('#campaignWorlds button').nth(7).click();assert((await page.locator('#campaignCenterStatus').textContent()).includes('planned'));
  assert.equal(await page.locator('#campaignServers button:not(:disabled)').count(),0);await page.screenshot({path:new URL(name+'-expansion.png',out).pathname,fullPage:true});
  await page.locator('#campaignContinue').click();assert.equal(await page.locator('#campaignMenu').isVisible(),false);
  if(mobile)assert.equal(await page.evaluate(()=>window.__EXCEPTION_TEST__.getState().mobilePaused),false);
  assert((await page.locator('#incidentJob').textContent()).includes('Welcome Mat Decommissioning'));
  if(mobile)await page.locator('#mobilePause').click();
  await page.locator('#incidentJob').click();assert((await page.locator('#incidentCounterplay').textContent()).includes('Jump across'));
  await page.screenshot({path:new URL(name+'-work-order.png',out).pathname,fullPage:true});
  if(mobile)await page.locator('#mobileResume').click();
  await page.evaluate(n=>window.campaignReview.seed(n),route.seed);
  await page.evaluate(()=>{window.campaignReview.draw()});await page.screenshot({path:new URL(name+'-localhost.png',out).pathname,fullPage:true});
  const replay=await page.evaluate(({events,frames})=>{
   let at=0,receiptImage=null,firstReceipt=null;
   for(let frame=0;frame<=frames;frame++){
    while(at<events.length&&events[at].frame===frame){const e=events[at++];document.dispatchEvent(new KeyboardEvent(e.down?'keydown':'keyup',{code:e.code,bubbles:true,cancelable:true}))}
    if(frame<frames)window.campaignReview.step();
    const s=window.__EXCEPTION_TEST__.getState();if(s.room===1&&!receiptImage){window.campaignReview.draw();firstReceipt=window.__DATA_CENTER_TEST__.receipt();receiptImage=document.getElementById('game').toDataURL()}if(s.state==='dead')throw Error('Route died in '+s.room+' at '+s.player.x);
   }
   window.campaignReview.draw();return {receiptImage,firstReceipt,state:window.__EXCEPTION_TEST__.getState(),progress:window.__DATA_CENTER_TEST__.progress(),mode:window.__DATA_CENTER_TEST__.mode()};
  },route);
  assert.equal(replay.firstReceipt.serverId,'localhost-01');assert(replay.firstReceipt.remaining>11);writeFileSync(new URL(name+'-ai-excuse.png',out),Buffer.from(replay.receiptImage.split(',')[1],'base64'));
  assert.equal(replay.state.state,'won');assert.equal(replay.state.deaths,0);assert.equal(replay.progress.cleared.length,20);
  await page.screenshot({path:new URL(name+'-complete.png',out).pathname,fullPage:true});
  if(mobile)await page.locator('#mobilePause').click();
  await page.locator('#openDataCenters').click();assert.equal(await page.locator('#campaignServers button:not(:disabled)').count(),0,'Selected future center remains planned');
  await page.locator('#campaignWorlds button').first().click();assert.equal(await page.locator('#campaignServers button:not(:disabled)').count(),20);
  await page.reload();if(mobile)await page.locator('#openDataCenters').click();else await page.locator('#openDataCenters').click();
  assert.equal((await page.evaluate(()=>window.__DATA_CENTER_TEST__.progress())).cleared.length,20);
  await page.locator('#campaignPractice').check();await page.locator('#campaignServers button').nth(19).click();assert.equal(await page.evaluate(()=>window.__DATA_CENTER_TEST__.mode().campaignPractice),true);
  if(mobile)await page.locator('#mobilePause').click();await page.locator('#openDataCenters').click();await page.locator('#campaignLegacy').click();
  assert.equal(await page.evaluate(()=>window.__DATA_CENTER_TEST__.mode().campaignMode),false);assert.equal((await page.evaluate(()=>window.__EXCEPTION_TEST__.getState())).exit,1139);
  assert.deepEqual(errors,[]);results.push({browser:name,centers:10,plannedLevelsDisabled:true,directoryFreezesGameplay:true,ordinaryKeyboardReplayClears:20,deaths:0,persistedClears:20,workOrderHintReadable:true,escapeExcuseRendered:true,practiceSelection:true,originalPlaytestRetained:true,pageErrors:errors});
 }finally{await browser.close()}
}
writeFileSync(new URL('browser-results.json',out),JSON.stringify(results,null,2)+'\n');console.log('PASS: mobile WebKit and desktop Chromium directory, planned expansion previews, full 20-server input replay, save/reload, practice and original playtest switching.');
