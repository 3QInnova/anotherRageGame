// Scripted ordinary-input footage. This never supplies or invents human reactions.
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync,rmSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {chromium} from '/private/tmp/exception-forecast-browser/node_modules/playwright/index.mjs';
import {makeDemo,clearDemo} from '../tests/demo-levels.test.mjs';

const root=new URL('../',import.meta.url),out=new URL('outputs/shorts/',root);mkdirSync(out,{recursive:true});
const titles=[['do-not-move','DO NOT MOVE'],['saved-probably','SAVED, PROBABLY'],['memory-not-found','MEMORY NOT FOUND']],results=[];
const html=readFileSync(new URL('initalDemoDocs/Exception_Human_Misclassification_V3.html',root),'utf8');
const fixture=html.replace('requestAnimationFrame(frame);\n})();',`window.captureReview={step:()=>runFrame(1/120),paint(){draw();refreshHud()},seed(){compactSeed=424242;resetCompactWatch();paywallSeed=(424242^0x5afeb011)>>>0;resetPaywallWatch()}};draw();refreshHud();\n})();`);assert.notEqual(html,fixture);
for(const [slug,title] of titles){
 const g=makeDemo('demo-'+slug),tap=c=>{g.key(c);g.key(c,false)},step=()=>g.check.step();
 const walk=x=>{g.key('KeyD');for(let n=0;n<1500&&g.state().state==='play'&&g.state().player.x<x;n++)step();g.key('KeyD',false)};
 // First attempts deliberately follow the obvious bad advice, using normal controls.
 if(slug==='do-not-move')walk(380);
 if(slug==='saved-probably')g.key('KeyD');
 if(slug==='memory-not-found'){walk(300);tap('Space');g.key('KeyD')}
 for(let i=0;i<1500&&g.state().state==='play';i++)step();g.key('KeyD',false);
 assert.equal(g.state().state,'dead',slug+' must show an actual trap death');
 const failure={family:g.voice.last().family,reason:g.nodes.get('lossReason').textContent,frame:g.frame()};
 for(let i=0;i<600;i++)step();tap('Enter');for(let i=0;i<12;i++)step();tap('Enter');
 assert.equal(g.state().state,'play');const retryFrame=g.frame();clearDemo(g,{expectedDeaths:1});
 const frames=g.frame()+360,timeline={events:g.route,frames,retryFrame,failure};
 writeFileSync(new URL(slug+'-inputs.json',out),JSON.stringify(timeline,null,2)+'\n');
 const browser=await chromium.launch();
 try{
  const context=await browser.newContext({viewport:{width:1280,height:720},deviceScaleFactor:1,recordVideo:{dir:new URL('raw/',out).pathname,size:{width:1280,height:720}}}),page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));await page.route('**/capture.html',r=>r.fulfill({body:fixture,contentType:'text/html'}));
  await page.goto('http://localhost/capture.html#demo=demo-'+slug+'&record=1&shorts=1');
  await page.waitForFunction(()=>window.__RAGE_LAB_TEST__?.state()!==null);
  await page.evaluate(()=>window.captureReview.seed());
  const result=await page.evaluate(async({events,frames})=>{
   let at=0;const startedAt=performance.now();const send=e=>document.dispatchEvent(new KeyboardEvent(e.down?'keydown':'keyup',{code:e.code,bubbles:true,cancelable:true}));
   for(let f=0;f<=frames;f++){
    while(at<events.length&&events[at].frame===f)send(events[at++]);
    if(f<frames)window.captureReview.step();
    if(f%2===0){window.captureReview.paint();const due=startedAt+f*1000/120;await new Promise(requestAnimationFrame);if(performance.now()<due)await new Promise(resolve=>setTimeout(resolve,due-performance.now()))}
   }
   return {state:window.__EXCEPTION_TEST__.getState().state,deaths:window.__EXCEPTION_TEST__.getState().deaths,receipt:!document.getElementById('rewardReceipt').hidden};
  },timeline);
  assert.equal(result.state,'won');assert.equal(result.deaths,1);assert(result.receipt);assert.deepEqual(errors,[]);
  const video=page.video();await context.close();const videoPath=new URL(slug+'-reference.webm',out).pathname;rmSync(videoPath,{force:true});await video.saveAs(videoPath);
  const probe=spawnSync('/opt/homebrew/bin/ffprobe',['-v','error','-show_entries','format=duration','-of','json',videoPath],{encoding:'utf8'});assert.equal(probe.status,0,probe.stderr);const videoSeconds=Number(JSON.parse(probe.stdout).format.duration);assert(videoSeconds>=frames/120-.2&&videoSeconds<frames/120+5,'Captured timing matches simulated ordinary-input timing');
  const slate=await context.browser().newPage({viewport:{width:1080,height:1920},deviceScaleFactor:1});
  await slate.setContent(`<body style="margin:0;background:#eeeadd;color:#2b3a40;font:700 48px monospace;text-align:center"><div style="position:absolute;top:350px;width:100%;color:#426d65;font-size:42px">EXCEPTION: HUMAN</div><div style="position:absolute;top:450px;width:100%">${title}</div><div style="position:absolute;top:1390px;width:100%;font-size:25px;color:#607367">AUTOMATED GAMEPLAY REFERENCE</div></body>`);
  const slatePath=new URL(slug+'-slate.png',out).pathname;await slate.screenshot({path:slatePath});await slate.close();
  const converted=spawnSync('/opt/homebrew/bin/ffmpeg',['-hide_banner','-loglevel','error','-y','-i',videoPath,'-loop','1','-i',slatePath,'-filter_complex','[0:v]scale=1080:-2[game];[1:v][game]overlay=0:(H-h)/2:shortest=1[out]','-map','[out]','-shortest','-c:v','libx264','-preset','fast','-crf','22','-pix_fmt','yuv420p','-movflags','+faststart',new URL(slug+'-portrait.mp4',out).pathname],{encoding:'utf8'});assert.equal(converted.status,0,converted.stderr);
  results.push({slug,title,automated:true,noHumanReaction:true,noMicrophone:true,ordinaryInput:true,seconds:frames/120,videoSeconds,failure,...result,errors});
  console.log('Recorded automated reference: '+title+' · '+(frames/120).toFixed(1)+' seconds');
 }finally{await browser.close()}
}
writeFileSync(new URL('reference-results.json',out),JSON.stringify(results,null,2)+'\n');
