import assert from 'node:assert/strict';
import {readFileSync,mkdirSync} from 'node:fs';
import {chromium,webkit} from '/private/tmp/exception-forecast-browser/node_modules/playwright/index.mjs';
const out=new URL('../outputs/jitter-zap/',import.meta.url);mkdirSync(out,{recursive:true});
for(const [name,engine,mobile]of [['desktop',chromium,false],['phone',webkit,true]]){
 const browser=await engine.launch();try{
 const page=await browser.newPage({viewport:{width:844,height:390},isMobile:mobile,hasTouch:mobile}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const html=readFileSync(new URL('../outputs/release-tests/'+(mobile?'mobile':'desktop')+'.html',import.meta.url),'utf8');
 await page.route('http://zap.test/**',r=>r.fulfill({contentType:'text/html',body:html}));await page.goto('http://zap.test/');
 const result=await page.evaluate(mobile=>{
  const q=window.__QA__;q.start('localhost-01');const limit=q.jitter().limit;
  function send(down){if(mobile)document.querySelector('[data-hold="right"]').dispatchEvent(new PointerEvent(down?'pointerdown':'pointerup',{pointerId:7,pointerType:'touch',bubbles:true}));else document.dispatchEvent(new KeyboardEvent(down?'keydown':'keyup',{code:'KeyD',bubbles:true}))}
  for(let n=0;n<limit;n++){send(true);for(let i=0;i<4;i++)q.tick();send(false);for(let i=0;i<8;i++)q.tick()}
  q.paint();return {limit,zaps:q.jitter().zaps,until:q.jitter().until,time:q.state().sceneTime,debt:q.idle().zones[0].debt,comment:document.getElementById(mobile?'mobileText':'line').textContent};
 },mobile);
 assert.equal(result.zaps,1);assert.match(result.comment,/stuck|buffering|walking|pixel|twitch|frozen|cable|encouragement|support|human|signal|distress|legs|hesitant|controls|stuttering|crumbs|energy|step|button|smoothness|loop|issues|desk|Jolt/i);assert(result.limit>=9&&result.limit<=13);assert(result.until>result.time);assert(result.debt>=4);
 await page.screenshot({path:new URL(name+'-zap.png',out).pathname});
 await page.locator(mobile?'#mobilePause':'#desktopPause').click();
 if(mobile)await page.locator('#menuSettings > summary').click();
 await page.locator(mobile?'#tab-controls':'[data-desktop-tab="controls"]').click();
 const help=page.locator('.jitter-help');assert(await help.isVisible());assert.match(await help.textContent(),/Too much jitter/);await help.screenshot({path:new URL(name+'-help.png',out).pathname});
 assert.deepEqual(errors,[]);console.log('PASS',name,'real input zap, visible animation and help preview');
 }finally{await browser.close()}
}
