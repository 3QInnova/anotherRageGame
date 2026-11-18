import assert from 'node:assert/strict';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {chromium,webkit} from '/private/tmp/exception-forecast-browser/node_modules/playwright/index.mjs';
const base='http://127.0.0.1:8766/',out=new URL('../outputs/release/',import.meta.url);mkdirSync(out,{recursive:true});
const campaign=JSON.parse(readFileSync(new URL('../outputs/long-campaign/routes.json',import.meta.url))),challenges=JSON.parse(readFileSync(new URL('challenge-routes.json',out))),results=[];
for(const [name,engine,mobile] of [['desktop',chromium,false],['phone',webkit,true]]){
 const browser=await engine.launch(!mobile&&process.env.CHROMIUM_EXECUTABLE?{executablePath:process.env.CHROMIUM_EXECUTABLE}:{});
 try{
  const page=await browser.newPage({viewport:mobile?{width:844,height:390}:{width:1280,height:720},isMobile:mobile,hasTouch:mobile}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  const path=mobile?'mobile.html':'desktop.html',fixture=readFileSync(new URL('../outputs/release-tests/'+path,import.meta.url),'utf8');
  await page.route('**/'+path+'*',r=>r.fulfill({body:fixture,contentType:'text/html'}));
  for(const [challenge,routes] of [[false,campaign],[true,challenges]])for(const route of routes){
   const finale=!challenge&&route.id==='localhost-20';
   await page.goto(base+path);await page.evaluate(finale=>{
    localStorage.clear();if(finale)localStorage.setItem('exception-data-centers-v1',JSON.stringify({schemaVersion:1,cleared:Array.from({length:19},(_,i)=>'localhost-'+String(i+1).padStart(2,'0')),currentServerId:'localhost-20'}));
   },finale);
   await page.goto('about:blank');
   await page.goto(base+path+'#'+(challenge?'challenge='+route.id:'campaign='+route.id+(finale?'':'&practice=1')));
   await page.waitForFunction(()=>window.__QA__);
   await page.evaluate(({id,challenge,finale})=>challenge?window.__QA__.challenge(id):window.__QA__.start(id,!finale),{id:route.id,challenge,finale});
   const result=await page.evaluate(({route,mobile})=>{
    let at=0;const held=new Set();
    function send(e){
     if(!mobile){document.dispatchEvent(new KeyboardEvent(e.down?'keydown':'keyup',{code:e.code,bubbles:true,cancelable:true}));return}
     if(/^Digit/.test(e.code)){if(e.down){window.__QA__.paint();document.getElementById('puzzleInput'+(Number(e.code.slice(-1))-1)).click()}return}
     if(['Enter','Escape'].includes(e.code)){if(e.down){window.__QA__.paint();document.getElementById(e.code==='Enter'?'puzzleBoxTest':'puzzleBoxClose').click()}return}
     if(e.down===held.has(e.code))return;if(e.down)held.add(e.code);else held.delete(e.code);if(e.code==='KeyX')window.__QA__.paint();
     const i=['KeyD','KeyA','KeyX','Space'].indexOf(e.code);if(i<0)throw Error(e.code);
     document.querySelector(['[data-hold="right"]','[data-hold="left"]','#glitch','#touchjump'][i]).dispatchEvent(new PointerEvent(e.down?'pointerdown':'pointerup',{pointerId:11+i,pointerType:'touch',bubbles:true,cancelable:true}));
    }
    for(let f=0;f<=route.frames;f++){
     while(at<route.events.length&&route.events[at].frame===f)send(route.events[at++]);
     if(f<route.frames)window.__QA__.tick();
     const state=window.__QA__.state();if(state.state==='dead')throw Error(route.id+' / '+f+' / '+document.getElementById('lossReason').textContent);
     if(f%120===0)window.__QA__.paint();
    }
    window.__QA__.paint();return {state:window.__QA__.state().state,deaths:window.__QA__.state().deaths,progress:window.__QA__.progress(),record:window.__QA__.record(),badge:window.__QA__.badges()};
   },{route,mobile});
   assert.equal(result.state,'won',route.id);assert.equal(result.deaths,0);
   if(finale){assert.equal(result.progress.cleared.length,20);assert(result.badge.includes('center-localhost'));assert.equal(await page.locator('#rewardReceiptTitle').textContent(),'YOU ESCAPED LOCALHOST');await page.screenshot({path:new URL(name+'-ending.png',out).pathname})}
   else assert.equal(result.progress.cleared.length,0);
   if(finale){await page.locator('#rewardShopFromReceipt').click();await page.locator('[data-reward="sticker-confidence"] button').click();assert.equal(await page.evaluate(()=>window.__QA__.bank()),190);assert((await page.evaluate(()=>window.__QA__.ledger().owned)).includes('sticker-confidence'));await page.locator('#rewardShopClose').click();await page.locator('#rewardContinue').click();assert(await page.locator('#campaignMenu').isVisible());}

   if(challenge){assert.equal(result.record.challenges[route.id].bestDeaths,0);await page.screenshot({path:new URL(name+'-challenge-'+route.id+'.png',out).pathname});}
   results.push({browser:name,id:route.id,touchInputs:mobile,...result});console.log('CLEAR',name,route.id);
  }
  assert.deepEqual(errors,[]);
 }finally{await browser.close()}
}
writeFileSync(new URL('browser-routes.json',out),JSON.stringify(results,null,2));
console.log('PASS: twenty campaign routes and four challenges on desktop Chromium and phone WebKit, ordinary inputs, real ending, badge, isolated challenge records.');
