import assert from 'node:assert/strict';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {chromium,webkit} from '/private/tmp/exception-forecast-browser/node_modules/playwright/index.mjs';
import {openModeMenu} from './browser-controls.mjs';
const root=new URL('../',import.meta.url),out=new URL('outputs/desktop-screen/',root);mkdirSync(out,{recursive:true});const results=[];
for(const [name,engine,mobile] of [['pc-chromium',chromium,false],['pc-webkit',webkit,false],['phone-webkit',webkit,true]]){
 const html=readFileSync(new URL(mobile?'mobile/index.html':'initalDemoDocs/Exception_Human_Misclassification_V3.html',root),'utf8');
 const fixture=html.replace('requestAnimationFrame(frame);\n})();',`window.screenReview={tick(n=1){for(let i=0;i<n;i++)runFrame(1/120);draw();refreshHud()},level:()=>L,peek:()=>({state,player}),fixture(){
 startCampaignServer('localhost-01',true);const b=L.routeBeats.find(b=>b.kind==='forecast');player.x=b.x+34;player.y=FLOOR-PH;player.grounded=true;
 const f=L.forecasts.find(f=>f.id===b.id+'-forecast');trap[f.id]={phase:'armed',lockedAt:sceneTime,t:sceneTime+.65,x:player.x+120};
 draw();refreshHud();},speak(){say('This is deliberately long popup copy to check that the narrator never covers the action button guide while a forecast and a Rewrite tag are both visible.','warn');draw();refreshHud()}};draw();refreshHud();\n})();`);assert.notEqual(fixture,html);
 const browser=await engine.launch();try{
  const page=await browser.newPage({viewport:mobile?{width:844,height:390}:{width:1280,height:720},isMobile:mobile,hasTouch:mobile}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.route('**/screen.html',r=>r.fulfill({body:fixture,contentType:'text/html'}));await page.goto('http://localhost/screen.html');
  if(mobile)await page.locator('#mobileResume').tap();
  if(!mobile){
   assert(await page.locator('#desktopPause').isVisible());assert(await page.locator('#desktopMusic').isVisible());assert.equal(await page.locator('#touch').isVisible(),false);
   await page.locator('#desktopMusic').click();assert.equal(await page.locator('#desktopMusic').getAttribute('aria-pressed'),'true');assert((await page.evaluate(()=>window.__EXCEPTION_AUDIO__.status())).enabled);
   await page.locator('#desktopPause').click();const before=await page.evaluate(()=>window.__EXCEPTION_TEST__.getState());await page.evaluate(()=>window.screenReview.tick(2400));assert.deepEqual(await page.evaluate(()=>window.__EXCEPTION_TEST__.getState()),before);
   for(const tab of ['controls','audio','log','play']){await page.locator('#desktopTab-'+tab).click();assert(await page.locator('#desktopPanel-'+tab).isVisible());assert.equal(await page.locator('#desktopMenu section:not([hidden])').count(),1)}
   await page.locator('#desktopTab-audio').click();assert(await page.locator('#music').isVisible());await page.locator('#audioTest').click();await page.waitForFunction(()=>window.__EXCEPTION_AUDIO__.status().testState==='finished');assert.deepEqual(await page.evaluate(()=>window.__EXCEPTION_TEST__.getState()),before,'Audio test leaves physics paused');
   await page.keyboard.press('Escape');assert(await page.locator('#desktopPanel-play').isVisible());await page.keyboard.press('Escape');assert.equal(await page.locator('#desktopMenu').isVisible(),false);
   await page.locator('#desktopPause').click();await page.locator('#desktopTab-controls').click();await page.locator('#demoRecording').click();await page.locator('#desktopResume').click();assert(await page.locator('#desktopPause').isVisible());assert(await page.locator('#desktopMusic').isVisible());
  }
  const viewports=mobile?[{width:568,height:320},{width:844,height:280},{width:844,height:390}]:[{width:800,height:600},{width:1024,height:768},{width:1280,height:720},{width:1440,height:900},{width:1920,height:1080},{width:2560,height:1080}];
  for(const viewport of viewports){
   await page.setViewportSize(viewport);if(mobile)await page.waitForFunction(()=>Math.abs(window.__MOBILE_UI_TEST__.viewport().width/window.__MOBILE_UI_TEST__.viewport().height-innerWidth/innerHeight)<1e-6);await page.evaluate(()=>{window.screenReview.fixture();window.screenReview.speak()});
   const fit=await page.evaluate(mobile=>{
    const b=id=>document.getElementById(id).getBoundingClientRect(),guide=document.getElementById(mobile?'mobileObjective':'desktopGuide'),g=guide.getBoundingClientRect(),n=document.getElementById(mobile?'mobileDialogue':'message'),r=n.getBoundingClientRect();
    const overlaps=(a,b)=>a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;
    const visible=el=>!el.hidden&&getComputedStyle(el).visibility!=='hidden'&&getComputedStyle(el).display!=='none';
    const prompt=document.getElementById(mobile?'mobileAction':'desktopAction'),p=prompt.getBoundingClientRect(),pe=guide.style.pointerEvents;guide.style.pointerEvents='auto';const point=document.elementFromPoint(p.left+Math.min(p.width/2,25),p.top+p.height/2);guide.style.pointerEvents=pe;
    return {stage:b('stage').toJSON(),guide:g.toJSON(),text:prompt.textContent,noNarratorOverlap:!visible(n)||!overlaps(g,r),promptVisible:visible(guide)&&!!point&&guide.contains(point),inWindow:g.left>=0&&g.right<=innerWidth&&g.top>=0&&g.bottom<=innerHeight,overflow:document.documentElement.scrollWidth>innerWidth||document.documentElement.scrollHeight>innerHeight};
   },mobile);
   assert(fit.text.includes(mobile?'Rewrite':'X')&&fit.text.includes('bridge'),JSON.stringify(fit));assert(fit.noNarratorOverlap&&fit.promptVisible&&fit.inWindow&&!fit.overflow,JSON.stringify({name,viewport,fit}));
   if(!mobile)assert(fit.stage.width>=viewport.width-1&&fit.stage.height>=viewport.height-1,'PC fills the viewport');
   await page.screenshot({path:new URL(name+'-'+viewport.width+'x'+viewport.height+'-locked-guide.png',out).pathname,fullPage:true});
  }
  // The same protected guide survives feedback popups in the combined Level 9 lab.
  await page.evaluate(()=>{window.__RAGE_LAB_TEST__.start('lab-unreliable-recall');window.screenReview.speak()});
  assert(await page.locator('#labHudAction').isVisible());assert((await page.locator('#labHudAction').textContent()).includes(mobile?'Move':'Space'));
  if(!mobile){await page.evaluate(()=>window.dispatchEvent(new Event('blur')));assert(await page.locator('#desktopMenu').isVisible());const before=await page.evaluate(()=>window.__EXCEPTION_TEST__.getState());await page.evaluate(()=>window.screenReview.tick(100));assert.deepEqual(await page.evaluate(()=>window.__EXCEPTION_TEST__.getState()),before);await page.evaluate(()=>window.dispatchEvent(new Event('focus')));assert(await page.locator('#desktopMenu').isVisible(),'Return requires Resume')}
  assert.deepEqual(errors,[]);results.push({browser:name,viewports:viewports.length,visiblePcPauseAndMusic:!mobile,keyboardWithoutTouchArrows:!mobile,tabbedMenus:!mobile,audioTestWhilePaused:!mobile,lockedForecastDoesNotCoverAction:true,narratorYieldsToGuide:true,pageErrors:errors});
 }finally{await browser.close()}
}
// Shipping animation clock: the visible Music shortcut really starts/stops music and persists.
const liveBrowser=await chromium.launch();try{const page=await liveBrowser.newPage({viewport:{width:1280,height:720}}),html=readFileSync(new URL('initalDemoDocs/Exception_Human_Misclassification_V3.html',root),'utf8');await page.route('**/live-screen.html',r=>r.fulfill({body:html,contentType:'text/html'}));await page.goto('http://localhost/live-screen.html');
 await page.locator('#desktopMusic').click();await page.waitForFunction(()=>{const s=window.__EXCEPTION_AUDIO__.status();return s.enabled&&s.context==='running'&&s.mode==='play'&&s.voices>0});await page.locator('#desktopMusic').click();await page.waitForFunction(()=>window.__EXCEPTION_AUDIO__.status().mode==='silent');await page.reload();assert.equal(await page.locator('#desktopMusic').getAttribute('aria-pressed'),'false');assert.equal(await page.evaluate(()=>window.__EXCEPTION_AUDIO__.status().musicEnabled),false);
 await page.locator('#desktopMusic').click();await page.waitForFunction(()=>window.__EXCEPTION_AUDIO__.status().context==='running');await page.locator('#desktopPause').click();await page.waitForFunction(()=>window.__EXCEPTION_AUDIO__.status().context==='suspended');const before=await page.evaluate(()=>window.__EXCEPTION_TEST__.getState());await page.waitForTimeout(200);assert.deepEqual(await page.evaluate(()=>window.__EXCEPTION_TEST__.getState()),before);await page.locator('#desktopResume').click();await page.waitForFunction(()=>window.__EXCEPTION_AUDIO__.status().context==='running');
}finally{await liveBrowser.close()}
writeFileSync(new URL('browser-results.json',out),JSON.stringify(results,null,2)+'\n');console.log('PASS: PC full-window paper UI, visible pause/music, tabbed audio/settings, frozen menus, no arrow buttons, recording view and protected action guides across PC and phone sizes.');
