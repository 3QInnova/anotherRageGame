import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {chromium} from '/private/tmp/exception-forecast-browser/node_modules/playwright/index.mjs';
import {createHash} from 'node:crypto';
const root=new URL('../../',import.meta.url),out=new URL('outputs/play-store/listing/',root);
await mkdir(out,{recursive:true});
const copy=JSON.parse(await readFile(new URL('release/app-store/marketing/en-US.json',root),'utf8'));
const metadata={name:copy.name,shortDescription:'Outsmart a smug AI. Jump, Rewrite, and escape 20 trap-filled levels.',fullDescription:copy.description+'\n\nFree to play. Contains ads. Progress is stored on your device.',releaseNotes:copy.whatsNew};
await writeFile(new URL('release/play-store/listing-en-US.json',root),JSON.stringify(metadata,null,2)+'\n');
const browser=await chromium.launch(),manifest=[];
async function capture(p,name,source){const file=new URL(name,out);await p.screenshot({path:file.pathname});manifest.push({file:name,source,sha256:createHash('sha256').update(await readFile(file)).digest('hex')});}
try{
 const p=await browser.newPage({viewport:{width:512,height:512},deviceScaleFactor:1});
 const icon=(await readFile(new URL('assets/app-store/icon-1024.png',root))).toString('base64');
 await p.setContent(`<style>html,body{margin:0;background:#eee8d7}img{display:block;width:512px;height:512px}</style><img src="data:image/png;base64,${icon}">`);await p.locator('img').evaluate(i=>i.decode());await capture(p,'icon-512.png','Approved app icon resized for Play through browser rendering');
 await p.setViewportSize({width:1024,height:500});const art=(await readFile(new URL('assets/marketing/app-store-v1/key-art.png',root))).toString('base64');
 await p.setContent(`<style>*{box-sizing:border-box}html,body{margin:0;width:1024px;height:500px;overflow:hidden;background:#172e30;color:#efe9d9;font-family:Arial,sans-serif}img{position:absolute;right:24px;top:48px;width:640px;height:400px;object-fit:contain}.brand{position:absolute;left:40px;top:52px;font:700 18px monospace;letter-spacing:2px}h1{position:absolute;left:40px;top:120px;margin:0;font-size:56px;line-height:1.05;letter-spacing:-2px}em{font-style:normal;color:#ddb457}p{position:absolute;left:40px;bottom:48px;font:700 14px monospace}</style><img src="data:image/png;base64,${art}"><div class="brand">EXCEPTION: HUMAN</div><h1>The AI<br>is wrong.<br><em>Prove it.</em></h1><p>MOVE. JUMP. REWRITE.</p>`);await p.locator('img').evaluate(i=>i.decode());await capture(p,'feature-1024x500.png','Promotional composition using approved generated key art; not gameplay');await p.close();
 const html=await readFile(new URL('outputs/release-tests/mobile.html',root),'utf8');
 const routes=JSON.parse(await readFile(new URL('outputs/long-campaign/routes.json',root))),challenges=JSON.parse(await readFile(new URL('outputs/release/challenge-routes.json',root)));
 const bridge=routes.find(r=>r.id==='localhost-02');
 const shots=[{id:'01-outsmart',level:'localhost-01',frame:285},{id:'02-rewrite',level:'localhost-02',frame:bridge.events.find(e=>e.code==='KeyX'&&e.down).frame+30},{id:'03-forecast',level:'localhost-11',frame:173},{id:'04-campaign',menu:true}];
 const page=await browser.newPage({viewport:{width:960,height:540},deviceScaleFactor:2,hasTouch:true});
 await page.route('**/capture.html',r=>r.fulfill({body:html,contentType:'text/html'}));
 for(const shot of shots){await page.goto('http://localhost/capture.html');await page.waitForFunction(()=>window.__QA__);
 if(!shot.menu){await page.evaluate(s=>window.__QA__.start(s.level),shot);const route=routes.find(r=>r.id===shot.level);await page.evaluate(({shot,route})=>{let at=0;for(let f=0;f<shot.frame;f++){while(at<route.events.length&&route.events[at].frame===f){const e=route.events[at++];document.dispatchEvent(new KeyboardEvent(e.down?'keydown':'keyup',{code:e.code,bubbles:true,cancelable:true}));}window.__QA__.tick();if(window.__QA__.state().state==='dead')throw Error('Unexpected capture death');}window.__QA__.paint();},{shot,route});}
 await page.evaluate(()=>document.activeElement?.blur());await capture(page,shot.id+'.png','Actual shared release game rendered in Chromium at 960x540 (2x), private deterministic replay harness; no device frame or simulated native ad');}
 await page.close();
}finally{await browser.close()}
await writeFile(new URL('manifest.json',out),JSON.stringify(manifest,null,2)+'\n');console.log('Prepared Play icon, feature graphic and four 1920x1080 game screenshots.');
