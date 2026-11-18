import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';
import {chromium,webkit} from '/private/tmp/exception-forecast-browser/node_modules/playwright/index.mjs';
const out=new URL('../outputs/release/',import.meta.url);mkdirSync(out,{recursive:true});
for(const [name,engine,mobile] of [['desktop',chromium,false],['phone',webkit,true]]){
 const browser=await engine.launch(!mobile&&process.env.CHROMIUM_EXECUTABLE?{executablePath:process.env.CHROMIUM_EXECUTABLE}:{});try{
 const page=await browser.newPage({viewport:mobile?{width:844,height:390}:{width:1280,height:800},isMobile:mobile,hasTouch:mobile}),errors=[];
 page.on('pageerror',e=>(errors.push(e.message),console.error(e.stack)));
 await page.goto('http://127.0.0.1:8766/'+(mobile?'mobile.html':'desktop.html'));
 await page.waitForSelector('#campaignMenu:not([hidden])');
 assert.equal(await page.locator('#campaignServers [data-server]').count(),1);
 assert.equal(await page.locator('#campaignServers button:not(:disabled)').count(),1);
 assert.equal(await page.locator('#campaignWorldPicker').isVisible(),false);
 await page.screenshot({path:new URL(name+'-campaign.png',out).pathname});
 await page.locator('#campaignServers [data-server]').first().click();
 assert.equal(await page.locator('#campaignMenu').isVisible(),false);
 assert.deepEqual(await page.evaluate(()=>Object.keys(window).filter(k=>/^__(EXCEPTION|DATA_CENTER|RELEASE|REWARD|QA)/.test(k))),[]);
 assert.equal(await page.locator('#creditPanel').isVisible(),false);

 if(mobile){await page.locator('[data-hold="right"]').dispatchEvent('pointerdown',{pointerId:1,pointerType:'touch'});await page.waitForTimeout(250);await page.locator('[data-hold="right"]').dispatchEvent('pointerup',{pointerId:1,pointerType:'touch'})}else{await page.keyboard.down('KeyD');await page.waitForTimeout(250);await page.keyboard.up('KeyD')}
 await page.screenshot({path:new URL(name+'-play.png',out).pathname});
 await page.locator(mobile?'#mobilePause':'#desktopPause').click();
 await page.screenshot({path:new URL(name+'-pause.png',out).pathname});
 assert.equal(await page.locator('#openDemos').isVisible(),false);assert.equal(await page.locator('#openRageLabs').isVisible(),false);
 if(mobile)await page.locator('#menuExtras summary').click();
 await page.locator(mobile?'#releaseMobileChallenges':'#releaseChallengesButton').click();
 assert.equal(await page.locator('[data-challenge]').count(),4);
 await page.screenshot({path:new URL(name+'-challenges.png',out).pathname});
 await page.locator('[data-challenge="forecast"]').click();
 await page.locator(mobile?'#mobilePause':'#desktopPause').click();
 await page.locator('#openRewards').click();await page.locator('#rewardTab-badge').click();
 assert.equal(await page.locator('[data-reward^="center-"]').count(),1);
 await page.goto('about:blank');await page.goto('http://127.0.0.1:8766/'+(mobile?'mobile.html':'desktop.html')+'#campaign=localhost-01&practice=1');
 await page.locator('#campaignServers [data-server]').first().click();
 if(mobile)await page.locator('[data-hold="right"]').dispatchEvent('pointerdown',{pointerId:5,pointerType:'touch'});else await page.keyboard.down('KeyD');
 await page.waitForSelector('#lossContinue:visible');
 if(mobile)await page.locator('[data-hold="right"]').dispatchEvent('pointerup',{pointerId:5,pointerType:'touch'});else await page.keyboard.up('KeyD');
 await page.waitForSelector('#lossContinue:visible');assert.equal(await page.locator('#lossContinue').textContent(),'Retry');
 await page.locator('#lossContinue').click();assert.equal(await page.locator('#lossContinue').isVisible(),false);
 if(mobile)for(const size of [{width:568,height:320},{width:844,height:280}]){
  await page.setViewportSize(size);await page.locator('#mobilePause').click();await page.locator('#openDataCenters').click();
  assert(await page.locator('#campaignServers [data-server]').first().isVisible());assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  await page.screenshot({path:new URL('phone-menu-'+size.width+'x'+size.height+'.png',out).pathname});await page.locator('#campaignServers [data-server]').first().click();
 }
 await page.evaluate(()=>localStorage.setItem('exception-data-centers-v1',JSON.stringify({schemaVersion:1,cleared:['localhost-01','localhost-02'],currentServerId:'localhost-03'})));
 await page.reload();await page.waitForSelector('#campaignMenu:not([hidden])');
 assert.equal(await page.locator('#campaignServers [data-server]').count(),3);
 assert.equal(await page.locator('#campaignServers [data-server="localhost-04"]').count(),0);
 assert.equal(await page.locator('#campaignServers button:disabled').count(),0);
 assert.match(await page.locator('#campaignServers [data-server="localhost-01"]').textContent(),/✓/);
 assert.deepEqual(errors,[]);console.log('PASS',name,'campaign start, input, pause, challenge selection, collection');
 }finally{await browser.close()}
}
