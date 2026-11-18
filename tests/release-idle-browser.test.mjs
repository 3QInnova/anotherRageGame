import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {chromium,webkit} from '/private/tmp/exception-forecast-browser/node_modules/playwright/index.mjs';
for(const [name,engine,mobile] of [['desktop',chromium,false],['phone',webkit,true]]){
 const browser=await engine.launch();try{
 const page=await browser.newPage({viewport:{width:844,height:390},isMobile:mobile,hasTouch:mobile});
 const html=readFileSync(new URL('../outputs/release-tests/'+(mobile?'mobile':'desktop')+'.html',import.meta.url),'utf8');
 await page.route('http://idle.test/**',r=>r.fulfill({contentType:'text/html',body:html}));await page.goto('http://idle.test/');
 const result=await page.evaluate(mobile=>{
  const q=window.__QA__,send=down=>mobile?document.querySelector('[data-hold="right"]').dispatchEvent(new PointerEvent(down?'pointerdown':'pointerup',{pointerId:7,pointerType:'touch',bubbles:true})):document.dispatchEvent(new KeyboardEvent(down?'keydown':'keyup',{code:'KeyD',bubbles:true}));
  q.start('localhost-01');for(let n=0;n<120;n++)q.tick();q.paint();const caption=document.getElementById('idleComputeCaption').textContent;
  let frames=0;while(q.state().state==='play'&&frames<4800){send(true);q.tick();send(false);for(let i=0;i<59;i++)q.tick();frames+=60}q.paint();
  return {caption,state:q.state().state,reason:document.getElementById('lossReason').textContent,seconds:frames/120};
 },mobile);
 assert.match(result.caption,/Keep moving.*15\.0s/);assert.equal(result.state,'dead');assert.match(result.reason,/IDLE COMPUTE/);
 console.log('PASS packaged',name,'visible countdown and tiny-input cleanup loss',result.seconds+'s');
 }finally{await browser.close()}
}
