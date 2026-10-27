import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import vm from 'node:vm';
const html=readFileSync(new URL('../initalDemoDocs/Exception_Human_Misclassification_V3.html',import.meta.url),'utf8');
function load(storage=new Map()){
 const nodes=new Map(),ctx=new Proxy({},{get:()=>()=>{}}),el=id=>{if(!nodes.has(id))nodes.set(id,{style:{},classList:{add(){},remove(){}},getContext:()=>ctx,addEventListener(){}});return nodes.get(id)};
 const c={crypto:{getRandomValues(a){a[0]=123456789;return a}},window:{addEventListener(){}},document:{getElementById:el,querySelectorAll:()=>[],addEventListener(){}},localStorage:{getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v)},Math,requestAnimationFrame(){}};
 const hook=`initRoom(true);window.voiceCheck={choose:nextBackgroundQuip,wrap:backgroundQuipLines,context:x=>backgroundVoiceContext(x,backdrop.voice),titles:()=>[...LEVELS,...DATA_CENTER_LEVELS,GLASS_TEST_LEVEL,COMMITMENT_LEVEL,GARBAGE_COLLECTION_LEVEL,COOLING_LEVEL,PUZZLE_BOX_LEVEL,...RAGE_LAB_LEVELS,...DEMO_LEVELS,...CACHE_PROTOTYPES].map(l=>l.title),position(x){player.x=x;trackBackgroundVoice()},die:()=>die('Fixture failure','review'),retry(){for(let i=0;i<240;i++)runFrame(1/120);acknowledgeLoss();acknowledgeLoss()},newRun:()=>initRoom(true),clear:nextRoom,draw,step(n){for(let i=0;i<n;i++)runFrame(1/120)},long:()=>startPractice(6),compact:()=>startCompaction('review')};`;
 vm.runInNewContext(html.match(/<script>([\s\S]*?)<\/script>/)[1].replace('initRoom(true);requestAnimationFrame(frame);',hook),c);
 return {check:c.window.voiceCheck,voice:c.window.__BACKDROP_TEST__.voice,bg:c.window.__BACKDROP_TEST__.state,library:c.window.__BACKDROP_TEST__.library,state:c.window.__EXCEPTION_TEST__.getState};
}
const storage=new Map(),g=load(storage),library=g.library();const flat=Object.entries(library).filter(([k])=>k!=='levels').flatMap(([,p])=>p).concat(Object.values(library.levels).flat());
assert.equal(flat.length,1112);assert.equal(new Set(flat).size,1112);
for(const title of g.check.titles()){assert(library.levels[title]?.length>=12,'Every room must ship with at least twelve authored background jokes: '+title);assert.equal(new Set(library.levels[title]).size,library.levels[title].length);}
for(const line of flat){assert(g.check.wrap(line).length<=2,line);assert(g.check.wrap(line).every(x=>x.length<=36),line);}
for(const key of Object.keys(library).filter(k=>k!=='levels')){const cycle=Array.from({length:library[key].length},()=>g.check.choose(key));assert.equal(new Set(cycle).size,library[key].length);assert.equal(g.check.choose(key),cycle[0]);}
const cursor=g.voice().cursors.general;g.check.newRun();assert.equal(g.voice().cursors.general,cursor);const reopened=load(storage);assert.equal(reopened.voice().cursors.general,cursor);assert.equal(reopened.check.choose('general'),library.general[cursor%library.general.length]);
const p=load();assert.equal(p.check.context(1000),'theme','Fresh play cannot invent prior failure');p.check.position(200);p.check.die();p.check.retry();assert.equal(p.check.context(150),'nearFailure');assert.equal(p.check.context(250),'beyondBest');p.check.position(p.bg().voice.posts[0].eligibleX);p.check.draw();assert(p.bg().voice.posts.some(n=>n.text==="You didn't make it this far before."));
p.check.position(500);p.check.die();p.check.retry();p.check.position(300);p.check.die();p.check.retry();assert.equal(p.check.context(380),'beyondLast');assert.equal(p.check.context(550),'beyondBest');p.check.position(p.bg().voice.posts.find(n=>n.kind==='beyondLast').eligibleX);p.check.draw();assert(p.bg().voice.posts.some(n=>n.text==='Last time you failed earlier.'));
const stable=JSON.stringify(p.voice().cursors);for(let i=0;i<20;i++)p.check.draw();assert.equal(JSON.stringify(p.voice().cursors),stable,'Redraws do not consume more jokes');
const remembered=p.bg().voice.bestX;p.check.newRun();assert.equal(p.bg().voice.bestX,remembered,'Cosmetic best distance survives New Run');assert.equal(p.bg().voice.lastFailureX,null,'A manual New Run must not pretend the prior attempt was a failure');
const cleared=load();cleared.check.position(200);cleared.check.die();cleared.check.retry();cleared.check.position(1200);cleared.check.clear();assert.equal(cleared.voice().rooms['CONTENT NOT FOUND'].lastFailureX,null,'Clearing a room removes a stale failure comparison');
const compact=load();compact.check.long();compact.check.position(5000);compact.check.compact();compact.check.step(1801);const returned=compact.state().player.x;compact.check.position(compact.bg().voice.posts.find(p=>p.kind==='compacted').eligibleX);compact.check.draw();assert(compact.bg().voice.posts.some(p=>p.kind==='compacted'&&p.text));
const stayed=load();stayed.check.long();stayed.check.compact();stayed.check.step(1801);assert(!stayed.bg().voice.posts.some(p=>p.kind==='compacted'),'Do not claim farther progress when compaction returned to the same starting point');
// Repeating an identical failure must not produce a reusable obstacle marker.
const placements=load(),layouts=[],reveals=[];
for(let i=0;i<24;i++){
 placements.check.position(200);placements.check.die();placements.check.retry();
 const before=placements.bg();layouts.push(before.quips.map(q=>[q.x,q.height]));
 const post=before.voice.posts[0];assert.equal(post.x,null);
 placements.check.position(post.eligibleX-1);placements.check.draw();
 assert.equal(placements.bg().voice.posts[0].text,null,'No premature progress claim');
 placements.check.position(post.eligibleX);placements.check.draw();
 const shown=placements.bg().voice.posts[0];assert(shown.text);reveals.push([shown.x,shown.height,shown.eligibleX]);
 const fixed=JSON.stringify(placements.bg());placements.check.draw();assert.equal(JSON.stringify(placements.bg()),fixed,'Reading never rerolls positions or text');
}
assert.equal(new Set(layouts.map(JSON.stringify)).size,24);
assert.equal(new Set(reveals.map(p=>p[0])).size,24);
assert.equal(new Set(reveals.map(p=>p[1])).size,24);
assert.equal(new Set(reveals.map(p=>p[2])).size,24);
const shiftedA=load(),shiftedB=load();
for(const [game,x] of [[shiftedA,200],[shiftedB,300]]){game.check.position(x);game.check.die();game.check.retry()}
assert.equal(JSON.stringify(shiftedA.bg().quips),JSON.stringify(shiftedB.bg().quips),'Decorative slots do not follow the failure coordinate');
const aPost=shiftedA.bg().voice.posts[0],bPost=shiftedB.bg().voice.posts[0];
assert.equal(aPost.inset,bPost.inset);assert.equal(aPost.height,bPost.height);
assert.equal(bPost.eligibleX-aPost.eligibleX,100,'Only truthful eligibility follows the recorded milestone');
const restartLayout=JSON.stringify(placements.bg().quips);placements.check.newRun();assert.notEqual(JSON.stringify(placements.bg().quips),restartLayout);
assert(compact.bg().quips.every(q=>Number.isFinite(q.height)),'Compaction rerolls the same cosmetic note layout');
const denied=new Map();denied.get=()=>{throw Error('Storage denied')};denied.set=()=>{throw Error('Storage denied')};const noStorage=load(denied);assert(noStorage.check.choose('theme'));noStorage.check.position(250);noStorage.check.die();noStorage.check.retry();assert.equal(noStorage.bg().voice.lastFailureX,250);
writeFileSync(new URL('../outputs/background-voice/library.json',import.meta.url),JSON.stringify(library,null,2)+'\n');
writeFileSync(new URL('../outputs/background-voice/unit-results.json',import.meta.url),JSON.stringify({distinctLines:flat.length,levelPools:Object.keys(library.levels).length,minPerLevel:12,allLinesFitTwoWrappedLines:true,fullCyclesBeforeRepeat:true,cursorsSurviveNewRunAndReload:true,claimsUseRecordedProgress:true,clearsAndRestartsResetStaleFailure:true,exactRequestedLinesVerified:true,compactionRemarksRequireActualRewind:true,redrawsKeepSameText:true,repeatedFailureLayoutsChecked:24,randomizedNotePositionsAndHeights:true,randomizedProgressRevealDelay:true,noPrematureClaims:true,storageDeniedWorks:true},null,2)+'\n');console.log('PASS: 1112 unique authored lines, all 60 room pools, no early repeat, persistent cursors, factual progress/rewind contexts, stable drawing, two-line wrapping and storage fallback.');
