import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'/private/tmp/exception-forecast-browser/node_modules/playwright/index.mjs');

const html=readFileSync(new URL('../initalDemoDocs/Exception_Human_Misclassification_V3.html',import.meta.url),'utf8');
const output=new URL('../outputs/object-redesign/',import.meta.url);mkdirSync(output,{recursive:true});
const gallery=`initRoom(true);canvas.height=890;ctx.fillStyle=PAPER;ctx.fillRect(0,0,960,890);
label('EXCEPTION: HUMAN / OBJECT LANGUAGE',30,35,21,INK);label('DOCUMENT STRIPS · INK REJECTIONS · UNBOUND REFERENCES',30,58,11,CYAN);
function tile(title,column,row,render){const x=30+column*310,y=260+row*270;label(title,x,y-180,13,INK);
ctx.strokeStyle='#d8d5c5';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x,y-160);ctx.lineTo(x+280,y-160);ctx.stroke();
ctx.save();ctx.translate(x,y-FLOOR);render();ctx.restore();}
tile('01 / MARGIN DOODLE',0,0,()=>{drawDocumentStrip({x:0,w:275});player.x=126;player.y=FLOOR-PH;drawPlayer()});
tile('02 / UNBOUND REFERENCE',1,0,()=>{drawDocumentStrip({x:0,w:60});drawDocumentStrip({x:210,w:65});glitch.bridge=0;drawVoid({id:'null-b',x:60,w:150})});
tile('03 / INFERRED SUPPORT',2,0,()=>{drawDocumentStrip({x:0,w:60});drawDocumentStrip({x:210,w:65});glitch.bridge=10;drawVoid({id:'null-b',x:60,w:150});glitch.bridge=0});
tile('04 / REDACTED CLAUSE',0,1,()=>{drawDocumentStrip({x:0,w:85});drawDocumentStrip({x:175,w:100});trap.review={phase:'on'};drawRedaction({id:'review',x:85,w:90})});
tile('05 / REJECTION FIELD',1,1,()=>{drawDocumentStrip({x:0,w:275});trap.review={phase:'on'};drawScan({id:'review',x:106,w:63})});
tile('06 / POLICY RECEIPT',2,1,()=>{drawDocumentStrip({x:0,w:275});trap.review={phase:'on',t:sceneTime-.4};drawNotice({id:'review',x:104,w:67})});
tile('07 / TYPE SEAL',0,2,()=>{drawDocumentStrip({x:0,w:275});room=2;L={anomalies:[{kind:'wall'}]};glitch.wall=0;ctx.save();ctx.translate(120-588,0);drawBarrier();ctx.restore()});
tile('08 / OUTPUT TEAR',1,2,()=>{drawDocumentStrip({x:0,w:275});drawExit(120)});
tile('09 / FALSE OUTPUT IMAGE',2,2,()=>{drawDocumentStrip({x:0,w:275});drawExit(120,true)});
`;
const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage({viewport:{width:1300,height:1250}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.setContent(html.replace('initRoom(true);requestAnimationFrame(frame);',gallery));
 if(errors.length)throw new Error(errors.join('\n'));
 await page.locator('#game').screenshot({path:new URL('object-gallery.png',output).pathname});
 // Isolate selected visual states to inspect every object in its room composition.
 const fixtures=html.replace('initRoom(true);requestAnimationFrame(frame);',`initRoom(true);window.__ART_REVIEW__={scene(index){room=index;initRoom();
 if(index===0){player.x=500;trap['redaction-a'].phase='on';trap['flag-a'].phase='on'}
 if(index===1){player.x=590;glitch.bridge=sceneTime+2.35}
 if(index===2){player.x=640;trap['policy-c']={phase:'on',t:sceneTime-.4};trap['predict-c']={phase:'armed',t:sceneTime+.45,x:704,lockedAt:sceneTime}}
 if(index===4){player.x=790;doorLocked=true;trap['redaction-e'].phase='on'}draw();refreshHud()}};`);
 await page.setContent(fixtures);
 for(const index of [0,1,2,4]){await page.evaluate(i=>window.__ART_REVIEW__.scene(i),index);await page.screenshot({path:new URL('room-'+(index+1)+'.png',output).pathname,fullPage:true})}
 await page.setViewportSize({width:390,height:844});await page.evaluate(()=>window.__ART_REVIEW__.scene(2));await page.screenshot({path:new URL('room-3-mobile.png',output).pathname,fullPage:true});
 if(errors.length)throw new Error(errors.join('\n'));
 writeFileSync(new URL('render-results.json',output),JSON.stringify({gallery:true,rooms:[1,2,3,5],narrowViewport:390,pageErrors:errors,fixtureOnly:true},null,2)+'\n');
 console.log('Object gallery and room composition screenshots saved; no page errors.');
}finally{await browser.close()}
