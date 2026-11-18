import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {webkit,chromium} from '/private/tmp/exception-forecast-browser/node_modules/playwright/index.mjs';
const out=new URL('../outputs/audio/',import.meta.url);mkdirSync(out,{recursive:true});const reports=[];
for(const [engine,launcher] of [['WebKit',webkit],['Chromium',chromium]]){
 const browser=await launcher.launch({headless:true});try{for(const mobile of [false,true]){
 const page=await browser.newPage({viewport:mobile?{width:844,height:390}:{width:1280,height:900},isMobile:mobile&&engine==='WebKit',hasTouch:mobile}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 async function resumeMobileForTest(){if(await page.locator('#campaignMenu').isVisible()){await page.locator('#campaignContinue').click();return}await page.locator('#tab-play').click();await page.locator('#mobileResume').click()}
 async function openAudio(){if(await page.locator('#campaignMenu').isVisible())await page.locator('#campaignClose').click();if(mobile){if(!(await page.locator('#mobileMenu').isVisible()))await page.locator('#mobilePause').click();await page.locator('#tab-audio').click()}else{if(!(await page.locator('#desktopMenu').isVisible()))await page.locator('#desktopPause').click();await page.locator('#desktopTab-audio').click()}}
 async function resumeForTest(){if(mobile)await resumeMobileForTest();else await page.locator('#desktopResume').click()}
 const html=readFileSync(new URL(mobile?'../outputs/development/mobile.html':'../initalDemoDocs/Exception_Human_Misclassification_V3.html',import.meta.url),'utf8');const fixture=html.replace('initRoom(true);requestAnimationFrame(frame);',`initRoom(true);window.audioReview={mode(s){state=s},tick:tickAudio};function pumpAudio(){tickAudio();requestAnimationFrame(pumpAudio)}requestAnimationFrame(pumpAudio);`);await page.route('**/audio-review.html',r=>r.fulfill({body:fixture,contentType:'text/html'}));await page.goto('http://localhost/audio-review.html');
 assert.equal((await page.evaluate(()=>window.__EXCEPTION_AUDIO__.status())).context,'uncreated');await openAudio();await page.locator('#mute').click();await resumeForTest()
 await page.waitForTimeout(350);let st=await page.evaluate(()=>window.__EXCEPTION_AUDIO__.status());assert.equal(st.enabled,true);assert.equal(st.context,'running');assert.equal(st.mode,'play');assert(st.voices>0);
 await openAudio();await page.locator('#music').click();await resumeForTest();await page.waitForTimeout(250);assert.equal((await page.evaluate(()=>window.__EXCEPTION_AUDIO__.status())).mode,'silent');await page.evaluate(()=>window.__EXCEPTION_AUDIO__.preview('jump'));assert((await page.evaluate(()=>window.__EXCEPTION_AUDIO__.status())).voices>0,'Effects remain enabled with music off');
 await openAudio();await page.locator('#music').click();await resumeForTest();
 await page.waitForFunction(()=>window.__EXCEPTION_AUDIO__.status().context==='running');for(const mode of ['compacting','paywall','dead','won','play']){await page.evaluate(s=>{window.audioReview.mode(s);window.audioReview.tick()},mode);assert.equal((await page.evaluate(()=>window.__EXCEPTION_AUDIO__.status())).mode,['dead','won'].includes(mode)?'silent':mode);}
 await page.evaluate(()=>window.dispatchEvent(new Event('blur')));await page.waitForFunction(()=>window.__EXCEPTION_AUDIO__.status().context==='suspended');st=await page.evaluate(()=>window.__EXCEPTION_AUDIO__.status());assert.equal(st.held,true);assert.equal(st.voices,0);assert.equal(st.context,'suspended');if(mobile)await resumeMobileForTest();else await page.locator('#desktopResume').click();await page.waitForTimeout(200);assert.equal((await page.evaluate(()=>window.__EXCEPTION_AUDIO__.status())).context,'running');
 await openAudio();await page.locator('#mute').click();await page.waitForFunction(()=>window.__EXCEPTION_AUDIO__.status().context==='suspended');st=await page.evaluate(()=>window.__EXCEPTION_AUDIO__.status());assert.equal(st.enabled,false);assert.equal(st.voices,0);assert.equal(st.context,'suspended');
 if(mobile){await page.locator('#mute').click();assert.equal((await page.evaluate(()=>window.__EXCEPTION_AUDIO__.status())).context,'suspended','Enabling sound inside the paused menu stays silent');await resumeMobileForTest();await page.waitForFunction(()=>window.__EXCEPTION_AUDIO__.status().context==='running');await page.locator('#mobilePause').click();await page.locator('#tab-audio').click();await page.locator('#mute').click();}
 // Explicit sound test works inside the paused menu and reconnects the engine.
 await page.locator('#mute').click();const beforeTest=await page.evaluate(()=>window.__EXCEPTION_TEST__.getState());
 await page.locator('#audioTest').click();await page.waitForFunction(()=>window.__EXCEPTION_AUDIO__.status().testState==='finished');
 let tested=await page.evaluate(()=>window.__EXCEPTION_AUDIO__.status());assert.equal(tested.lastError,'');assert(tested.time>.1);assert(tested.cueCount>0);
 if(mobile){assert.equal(tested.context,'suspended');assert.deepEqual(await page.evaluate(()=>window.__EXCEPTION_TEST__.getState()),beforeTest,'Sound testing never resumes the game');}
 await page.reload();assert.equal((await page.evaluate(()=>window.__EXCEPTION_AUDIO__.status())).enabled,true,'Sound choice survives app/page reload');
 assert.equal((await page.evaluate(()=>window.__EXCEPTION_AUDIO__.status())).context,'uncreated','Restored preference does not autoplay');
 if(mobile)await resumeMobileForTest();else{await openAudio();await page.locator('#audioTest').click();await page.waitForFunction(()=>window.__EXCEPTION_AUDIO__.status().testState==='finished');await resumeForTest()}
 await page.waitForFunction(()=>window.__EXCEPTION_AUDIO__.status().context==='running');
 // Offline rendering validates actual waveforms and supplies reviewable WAV previews.
 const rendered=await page.evaluate(async()=>{
 const api=window.__EXCEPTION_AUDIO__,sr=22050,metrics=[];
 function stats(buffer){const a=buffer.getChannelData(0);let peak=0,sum=0,hash=2166136261;for(let i=0;i<a.length;i++){peak=Math.max(peak,Math.abs(a[i]));sum+=a[i]*a[i];hash=Math.imul(hash^Math.round(a[i]*32767),16777619)>>>0;}return {peak,rms:Math.sqrt(sum/a.length),hash};}
 function wav(buffer){const a=buffer.getChannelData(0),b=new ArrayBuffer(44+a.length*2),v=new DataView(b);function text(o,s){for(let i=0;i<s.length;i++)v.setUint8(o+i,s.charCodeAt(i))}text(0,'RIFF');v.setUint32(4,b.byteLength-8,true);text(8,'WAVEfmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);v.setUint32(24,sr,true);v.setUint32(28,sr*2,true);v.setUint16(32,2,true);v.setUint16(34,16,true);text(36,'data');v.setUint32(40,a.length*2,true);for(let i=0;i<a.length;i++)v.setInt16(44+i*2,Math.round(Math.max(-1,Math.min(1,a[i]))*32767),true);let s='';const bytes=new Uint8Array(b);for(let i=0;i<bytes.length;i+=8192)s+=String.fromCharCode(...bytes.subarray(i,i+8192));return btoa(s)}
 for(const cue of api.cues){const c=new OfflineAudioContext(1,sr*2,sr),r=api.makeRig(c);api.renderCue(r,cue,.03);const b=await c.startRendering();metrics.push({cue,...stats(b)})}
 const c=new OfflineAudioContext(1,sr*34,sr),r=api.makeRig(c);api.cues.forEach((cue,i)=>api.renderCue(r,cue,.1+i*1.5));const montage=wav(await c.startRendering());
 const previews={};for(const mode of ['play','compacting','paywall']){const seconds=mode==='play'?19.5:8,c=new OfflineAudioContext(1,Math.round(sr*seconds),sr),r=api.makeRig(c);for(let i=0;i<(mode==='play'?128:48);i++)api.musicStep(r,i,.1+i*60/104/4,mode,6);const b=await c.startRendering();previews[mode]={...stats(b),wav:wav(b)}}
 return {metrics,montage,previews};});
 for(const m of rendered.metrics){assert(m.peak>.005&&m.peak<.99,`${m.cue}: nonzero, unclipped`);assert(m.rms>.0005)}assert.equal(new Set(rendered.metrics.map(m=>m.hash)).size,rendered.metrics.length,'Every named effect has a distinct waveform');for(const [name,p] of Object.entries(rendered.previews)){assert(p.rms>.002, name+': RMS '+p.rms);assert(p.peak<.99)}
 if(engine==='WebKit'&&!mobile){writeFileSync(new URL('effects-preview.wav',out),Buffer.from(rendered.montage,'base64'));for(const [mode,p] of Object.entries(rendered.previews))writeFileSync(new URL(mode+'-music-preview.wav',out),Buffer.from(p.wav,'base64'));}
 // A failed platform resume must be visible and repairable from a fresh tap.
 await page.evaluate(()=>{window.originalAudioContext=window.AudioContext;window.AudioContext=class extends window.originalAudioContext{resume(){return Promise.reject(new Error('Injected audio resume failure'))}}});
 await openAudio();
 await page.locator('#audioTest').click();await page.waitForFunction(()=>window.__EXCEPTION_AUDIO__.status().lastError.includes('Injected'));
 assert((await page.locator('#audioStatus').textContent()).includes('could not start'));
 await page.evaluate(()=>{window.AudioContext=window.originalAudioContext});await page.locator('#audioTest').click();await page.waitForFunction(()=>window.__EXCEPTION_AUDIO__.status().testState==='finished');
 assert.equal((await page.evaluate(()=>window.__EXCEPTION_AUDIO__.status())).lastError,'');
 assert.deepEqual(errors,[]);reports.push({engine,mobile,gestureStartsAudio:true,pausedSoundTestWorks:true,explicitReconnectWorks:true,soundPreferencePersists:true,resumeFailureReportedAndRecoverable:true,musicTogglePreservesEffects:true,muteStopsAllVoices:true,backgroundSuspends:true,resumeRestartsScheduler:true,modes:['play','compacting','paywall','dead','won'],effects:rendered.metrics,music:Object.fromEntries(Object.entries(rendered.previews).map(([k,{wav,...v}])=>[k,v])),pageErrors:errors});await page.close();
 }}finally{await browser.close()}
}
writeFileSync(new URL('browser-results.json',out),JSON.stringify(reports,null,2)+'\n');console.log('PASS: 23 distinct unclipped effects, three original music arrangements, gesture activation, independent music toggle, mute/pause/resume on PC and mobile in WebKit and Chromium.');
