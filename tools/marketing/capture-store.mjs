import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {webkit} from '/private/tmp/exception-forecast-browser/node_modules/playwright/index.mjs';
const root=new URL('../../',import.meta.url),out=new URL('outputs/app-store/marketing-v1/',root);await mkdir(new URL('raw/',out),{recursive:true});
const html=await readFile(new URL('outputs/release-tests/mobile.html',root),'utf8');
const routes=JSON.parse(await readFile(new URL('outputs/long-campaign/routes.json',root))),challenges=JSON.parse(await readFile(new URL('outputs/release/challenge-routes.json',root)));
const bridge=routes.find(r=>r.id==='localhost-02');
const shots=[{id:'01-outsmart',level:'localhost-01',frame:285},{id:'02-rewrite',level:'localhost-02',frame:bridge.events.find(e=>e.code==='KeyX'&&e.down).frame+30},{id:'03-forecast',level:'localhost-11',frame:173},{id:'04-retry',level:'localhost-01',death:true},{id:'05-campaign',menu:true},{id:'06-puzzle',level:'puzzle',challenge:true,frame:163}];
const browser=await webkit.launch(),manifest=[];
try{for(const size of [{name:'large',w:956,h:440},{name:'medium',w:874,h:402}]){
const page=await browser.newPage({viewport:{width:size.w,height:size.h},deviceScaleFactor:3,isMobile:true,hasTouch:true}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.route('**/capture.html',r=>r.fulfill({body:html,contentType:'text/html'}));
for(const shot of shots){await page.goto('http://localhost/capture.html');await page.waitForFunction(()=>window.__QA__);await page.evaluate(()=>{document.documentElement.style.setProperty('--safe-left','44px');document.documentElement.style.setProperty('--safe-right','44px');document.documentElement.style.setProperty('--safe-bottom','21px');window.dispatchEvent(new Event('resize'))});
if(!shot.menu){await page.evaluate(s=>s.challenge?window.__QA__.challenge(s.level):window.__QA__.start(s.level),shot);
const route=(shot.challenge?challenges:routes).find(r=>r.id===shot.level);
await page.evaluate(({shot,route})=>{
const api=window.__QA__,send=e=>document.dispatchEvent(new KeyboardEvent(e.down?'keydown':'keyup',{code:e.code,bubbles:true,cancelable:true}));
if(shot.death){send({code:'KeyD',down:true});let i=0;while(api.state().state==='play'&&i++<3000)api.tick();send({code:'KeyD',down:false});for(let n=0;n<245;n++)api.tick();if(api.state().state!=='dead')throw Error('Expected actual death');}
else{let at=0;for(let f=0;f<shot.frame;f++){while(at<route.events.length&&route.events[at].frame===f)send(route.events[at++]);api.tick();if(api.state().state==='dead')throw Error('Unexpected capture death '+shot.id)}}api.paint();
},{shot,route});}
await page.evaluate(()=>document.activeElement?.blur());await page.screenshot({path:new URL('raw/'+shot.id+'-'+size.name+'.png',out).pathname});manifest.push({...shot,size,pixels:[size.w*3,size.h*3],source:'WebKit capture of compiled release engine with private deterministic replay harness; real UI, no simulated artwork or changed geometry'});
}if(errors.length)throw Error(JSON.stringify(errors));await page.close();}}
finally{await browser.close()}
await writeFile(new URL('capture-manifest.json',out),JSON.stringify(manifest,null,2));console.log('Captured twelve real UI frames in two iPhone landscape sizes.');
