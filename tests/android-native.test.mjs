import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFileSync,writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {chromium} from '/private/tmp/exception-forecast-browser/node_modules/playwright/index.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const {serial,sdk}=JSON.parse(readFileSync(root+'outputs/capacitor/android-simulator.json','utf8'));
const env={...process.env,ANDROID_USER_HOME:root+'apps/native/.cache/android-toolchain/user'};
const adb=(...args)=>execFileSync(sdk+'/platform-tools/adb',['-s',serial,...args],{env,encoding:'utf8'}).trim();
const packageId='com.threeqinnova.exceptionhuman.local';
let browser,port;
try{
 adb('shell','cmd','connectivity','airplane-mode','enable');
 adb('shell','svc','wifi','disable');adb('shell','svc','data','disable');
 await new Promise(r=>setTimeout(r,3000));
 adb('shell','am','force-stop',packageId);adb('shell','am','start','-n',packageId+'/.MainActivity');
 let pid;
 for(let n=0;n<30;n++){try{pid=adb('shell','pidof',packageId);if(pid)break;}catch{}await new Promise(r=>setTimeout(r,300));}
 port=adb('forward','tcp:0','localabstract:webview_devtools_remote_'+pid);
 for(let n=0;n<30;n++){try{const r=await fetch('http://127.0.0.1:'+port+'/json/version');if(r.ok)break;}catch{}await new Promise(r=>setTimeout(r,300));}
 browser=await chromium.connectOverCDP('http://127.0.0.1:'+port,{noDefaults:true});
 const page=browser.contexts()[0].pages()[0];
 await page.waitForFunction(()=>window.ExceptionNative?.health.listenersReady);
 const health=await page.evaluate(()=>window.ExceptionNative.health);
 assert.equal(health.native,true);assert.equal(health.platform,'android');assert.deepEqual(health.errors,[]);
 assert(adb('shell','dumpsys','connectivity').includes('Active default network: none'),'Android should have no active default network');
 assert(await page.locator('#mobileResume').isVisible());
 await page.locator('#mobileResume').click();
 await page.locator('[data-hold="right"]').dispatchEvent('pointerdown',{pointerId:1});
 await page.waitForTimeout(250);
 const moved=await page.evaluate(()=>window.__EXCEPTION_TEST__.getState());assert(moved.player.x>55);
 adb('shell','input','keyevent','KEYCODE_HOME');await page.waitForFunction(()=>window.__EXCEPTION_TEST__.getState().mobilePaused,null,{timeout:10000,polling:100});
 const paused=await page.evaluate(()=>window.__EXCEPTION_TEST__.getState());assert(paused.mobilePaused);
 await page.waitForTimeout(500);const frozen=await page.evaluate(()=>window.__EXCEPTION_TEST__.getState());assert.equal(frozen.sceneTime,paused.sceneTime);assert.deepEqual(frozen.player,paused.player);
 adb('shell','am','start','-n',packageId+'/.MainActivity');
 await page.locator('#mobileResume').waitFor({state:'visible'});await page.locator('#mobileResume').click();
 await page.waitForTimeout(100);assert.equal((await page.evaluate(()=>window.__EXCEPTION_TEST__.getState())).player.vx,0);
 adb('shell','input','keyevent','KEYCODE_BACK');await page.locator('#mobileResume').waitFor({state:'visible'});
 await page.locator('#glassPractice').click();
 assert.equal((await page.evaluate(()=>window.__EXCEPTION_TEST__.getState())).room,15);
 await page.waitForTimeout(300);
 writeFileSync(root+'outputs/capacitor/android-glass-lab.png',execFileSync(sdk+'/platform-tools/adb',['-s',serial,'exec-out','screencap','-p'],{env}));
 adb('shell','input','keyevent','KEYCODE_BACK');await page.locator('#mobileResume').waitFor({state:'visible'});
 adb('shell','input','keyevent','KEYCODE_BACK');await page.waitForTimeout(500);
 const top=adb('shell','dumpsys','activity','activities').split('\n').filter(l=>l.includes('topResumedActivity')||l.includes('mResumedActivity')).join('\n');
 assert(!top.includes(packageId),'Second Back should minimize the game');
 adb('shell','am','start','-n',packageId+'/.MainActivity');await page.locator('#mobileResume').waitFor({state:'visible'});
 assert.deepEqual(await page.evaluate(()=>window.ExceptionNative.health.errors),[]);
 writeFileSync(root+'outputs/capacitor/android-native-results.json',JSON.stringify({passed:true,serial,android:adb('shell','getprop','ro.build.version.release'),nativeBridge:health,offlineColdLaunch:true,movement:true,backgroundFreezesPhysics:true,releasedHeldInput:true,backOpensPause:true,secondBackMinimizes:true,glassLabLoads:true,physicalDeviceTested:false},null,2)+'\n');
 console.log('PASS: Android offline cold launch, native plugins, movement, background pause, held-input release, hardware Back routing and glass lab.');
}finally{
 if(browser)await browser.close();
 if(port)adb('forward','--remove','tcp:'+port);
 adb('shell','cmd','connectivity','airplane-mode','disable');
 adb('shell','svc','wifi','enable');adb('shell','svc','data','enable');
}
