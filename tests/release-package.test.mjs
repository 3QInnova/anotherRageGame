import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {parse} from '../apps/native/node_modules/acorn/dist/acorn.mjs';
import {chromium,webkit} from '/private/tmp/exception-forecast-browser/node_modules/playwright/index.mjs';
const root=new URL('../',import.meta.url),read=p=>readFileSync(new URL(p,root),'utf8');
const manifest=JSON.parse(read('outputs/release/manifest.json'));
assert.deepEqual(manifest.campaignLevels,Array.from({length:20},(_,i)=>'localhost-'+String(i+1).padStart(2,'0')));
assert.deepEqual(manifest.challenges,['forecast','recall','puzzle','glass']);
assert.deepEqual(readdirSync(new URL('outputs/release/site/',root)).sort(),['desktop.html','index.html','mobile.html']);
assert.deepEqual(readdirSync(new URL('apps/native/www/',root)).sort(),['index.html','native-bridge.js']);
for(const file of ['outputs/release/site/desktop.html','outputs/release/site/mobile.html','apps/native/www/index.html']){
 const html=read(file);assert(!/__\w*TEST\w*__|__QA__|sourceMappingURL|#demo=|#cache=|#campaign=|campaignView-labs|campaignView-practice|playtestWelcome/.test(html),file+' exposes no developer entry points');
 assert(html.includes('Content-Security-Policy'));assert(html.includes("connect-src 'none'"));
 const ids=new Set();
 function walk(n){if(n.type==='Property'&&(n.key.name??n.key.value)==='serverId'&&n.value.type==='Literal')ids.add(n.value.value);for(const v of Object.values(n)){if(Array.isArray(v))for(const x of v){if(x?.type)walk(x)}else if(v?.type)walk(v)}}
 for(const m of html.matchAll(/<script>([\s\S]*?)<\/script>/g))walk(parse(m[1],{ecmaVersion:'latest'}));
 for(const id of ids)assert(manifest.campaignLevels.includes(id)||['challenge-forecast','challenge-recall','puzzle-box'].includes(id),'Unexpected bundled level '+id);
 assert.equal([...ids].filter(id=>id.startsWith('localhost-')).length,20);
}
for(const path of ['apps/native/ios/App/App/public/index.html','apps/native/android/app/src/main/assets/public/index.html'])assert.equal(read(path),read('apps/native/www/index.html'),'Native projects must contain the sanitized bundle');
const config=JSON.parse(read('apps/native/capacitor.config.json'));assert.equal(config.loggingBehavior,'none');assert.equal(config.ios.webContentsDebuggingEnabled,false);assert.equal(config.android.webContentsDebuggingEnabled,false);assert.deepEqual(config.server.allowNavigation,[]);
for(const path of ['campaign.html','cache.html','character.html','playtest.html','shorts.html','tools/build-release.mjs','outputs/release-tests/mobile.html','../agents.md'])assert.equal((await fetch('http://127.0.0.1:8766/'+path)).status,404,path);
for(const [name,engine,mobile] of [['desktop',chromium,false],['phone',webkit,true]]){
 const browser=await engine.launch();try{
 const page=await browser.newPage({viewport:{width:844,height:390},isMobile:mobile,hasTouch:mobile}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const hash of ['#campaign=localhost-20&practice=1','#demo=demo-01','#cache=cache-01']){
 await page.goto('http://127.0.0.1:8766/'+(mobile?'mobile.html':'desktop.html')+hash);
 await page.waitForSelector('#campaignMenu:not([hidden])');
 assert.equal(await page.locator('#campaignServers button:not(:disabled)').count(),1,'Hash cannot unlock later levels');
 assert.deepEqual(await page.evaluate(()=>Object.keys(window).filter(k=>/^__.*(?:TEST|QA)/.test(k))),[]);
 }
 // Untrusted save fields must never become HTML or introduce external content.
 await page.evaluate(()=>{localStorage.setItem('exception-data-centers-v1',JSON.stringify({schemaVersion:1,cleared:['<img src=x onerror="window.injected=true">','cache-01'],currentServerId:'demo-01'}));localStorage.setItem('exception-localhost-release-v1','{"version":1,"checkpoints":{"localhost-01":99999},"challenges":{"forecast":{"bestSeconds":"<script>","bestDeaths":-1}}}');});
 await page.reload();await page.waitForSelector('#campaignMenu:not([hidden])');assert.equal(await page.evaluate(()=>!!window.injected),false);assert.equal(await page.locator('#campaignServers button:not(:disabled)').count(),1);
 assert.deepEqual(errors,[]);console.log('PASS',name,'release boundary, rejected level URLs and malformed saves');
 }finally{await browser.close()}
}
console.log('PASS release allowlist, native settings, stripped developer controls and private path exclusions.');
