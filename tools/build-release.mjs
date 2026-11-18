import {readFile,writeFile,mkdir,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
import {parse} from '../apps/native/node_modules/acorn/dist/acorn.mjs';
import {parse as parseHtml,serialize} from '../apps/native/node_modules/parse5/dist/index.js';
import {transform} from '../apps/native/node_modules/esbuild/lib/main.js';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..'),read=p=>readFile(resolve(root,p),'utf8');
const desktop=await read('initalDemoDocs/Exception_Human_Misclassification_V3.html');
const devMobile=await read('outputs/development/mobile.html');
const source=desktop.match(/<script>([\s\S]*?)<\/script>/)[1];
const nodes=new Map(),ctx=new Proxy({},{get:()=>()=>{}}),el=id=>{if(!nodes.has(id))nodes.set(id,{hidden:true,style:{},classList:{add(){},remove(){}},getContext:()=>ctx,addEventListener(){}});return nodes.get(id)};
const storage={getItem:()=>null,setItem(){}};
const sandbox={window:{addEventListener(){},localStorage:storage},document:{getElementById:el,querySelectorAll:()=>[],addEventListener(){}},localStorage:storage,Math,requestAnimationFrame(){}};
const snapshot='window.pack={levels:DATA_CENTER_LEVELS,challenges:RELEASE_CHALLENGES,catalog:DATA_CENTER_CATALOG,rewards:REWARD_CATALOG,background:BACKGROUND_QUIPS,pools:ALL_REMARK_POOLS,loss:LOSS_REMARKS};';
vm.runInNewContext(source.replace('installCampaignUI();initRoom(true);requestAnimationFrame(frame);',snapshot),sandbox);
const pack=JSON.parse(JSON.stringify(sandbox.window.pack));if(pack.levels.length!==20||pack.challenges.length!==4)throw Error('Release content count changed');
pack.catalog.centers=pack.catalog.centers.filter(c=>c.id==='localhost');pack.rewards.centers=pack.rewards.centers.filter(c=>c.center==='localhost');
const titles=new Set([...pack.levels,...pack.challenges.map(c=>c.level)].map(l=>l.title));
pack.background.levels=Object.fromEntries(Object.entries(pack.background.levels).filter(([k])=>titles.has(k)));
pack.pools=Object.fromEntries(Object.entries(pack.pools).filter(([k])=>/^(cause-|misdirection-|event-|observer-|rewrite-|warning-|idle-|pressure-|puzzle-|localhost-|reward-|lab-forecast-commitment$|lab-unreliable-recall$)/.test(k)||Object.hasOwn(pack.loss,k)||['glass-observer','autocomplete'].includes(k)));
const overrides=await read('tools/release/runtime.js'),overrideAst=parse(overrides,{ecmaVersion:'latest'}),functions=new Map(overrideAst.body.map(n=>[n.id.name,overrides.slice(n.start,n.end)]));
const removed=new Set(`ORIGINAL_LEVELS ORIGINAL_COMPACT_POINTS ORIGINAL_LOCALHOST_LEVELS LOCALHOST_RECIPES LOCALHOST_VOICE LONG_LOCALHOST_RECIPES LONG_LOCALHOST_VOICE LOCALHOST_INCIDENTS LONG_ENCOUNTERS SECRET_PAD_POSITIONS COMPACTION_REMARKS PAYWALL_REMARKS PAYWALL_OFFERS LONG_THEME_REMARKS LONG_SESSION_REMARKS CREDIT_COMPACT_REMARKS COMMITMENT_LEVEL COMMITMENT_REMARKS GARBAGE_COLLECTION_LEVEL GARBAGE_COLLECTION_VOICE COOLING_LEVEL COOLING_GATE_TYPES COOLING_GATE_TAPS COOLING_GATE_RULES COOLING_VOICE RAGE_LAB_LEVELS RAGE_LAB_VOICE RAGE_LAB_LOSSES DEMO_LEVELS DEMO_VOICE DEMO_LOSSES SHORT_RECORDING_ORDER CACHE_PROTOTYPES CACHE_VOICE PLAYTEST_ROUTE PLAYTEST_ID`.split(' '));
const removedFunctions=new Set(`authorLongLevel compileDataCenterServers compileLongCampaign assemblePaperRoute rageLevel releaseRoute startOriginalLocalhost startOriginalPractice startPractice startRageLab startDemo nextDemo renderDemoPlaylist installDemoUI toggleDemoRecording startCachePrototype nextCachePrototype installCachePrototypes renderRageLabs startCoolingTest startPuzzleBox startGarbageCollectionDay startCommitmentTrial coolingBoard coolingRoute coolingSelect coolingFlip coolingGateShape coolingTileSvg coolingPreview coolingGateRect installCoolingUI drawCoolingGate`.split(' '));
for(const path of ['playtest/session.js','campaign/demo-levels.js','campaign/cache-prototypes.js','campaign/commitment-lab.js'])for(const m of (await read(path)).matchAll(/^function (\w+)/gm))if(!functions.has(m[1]))removedFunctions.add(m[1]);
const removedIds=new Set(`paywallScreen compactionScreen creditPanel creditSummary creditRules coolingPanel commitmentPanel labHud labWinActions campaignTab-demos campaignTab-labs campaignTab-practice campaignView-demos campaignView-labs campaignView-practice campaignCoolingIncident campaignPractice campaignWorldPicker openDemos openRageLabs desktopPractice desktopNewRun desktopNewRunConfirm desktopPanel-practice panel-practice openPractice newRun newRunConfirm playtestEnd playtestWelcome playtestFeedback demoRecording desktopBrowseCampaign`.split(' '));
// Include descendants so both DOM and their event wiring are physically absent.
function collect(node){if(node.attrs?.some(a=>a.name==='id'&&removedIds.has(a.value))){const add=n=>{for(const a of n.attrs??[])if(a.name==='id')removedIds.add(a.value);for(const c of n.childNodes??[])add(c)};add(node)}for(const c of node.childNodes??[])collect(c)}
collect(parseHtml(desktop));collect(parseHtml(devMobile));
const values={LEVELS:'[]',COMPACT_POINTS:'[]',GLASS_TEST_INDEX:'-1',DATA_CENTER_LEVELS:JSON.stringify(pack.levels),DATA_CENTER_CATALOG:JSON.stringify(pack.catalog),REWARD_CATALOG:JSON.stringify(pack.rewards),RELEASE_CHALLENGES:JSON.stringify(pack.challenges),GLASS_TEST_LEVEL:JSON.stringify(pack.challenges.find(c=>c.id==='glass').level),PUZZLE_BOX_LEVEL:JSON.stringify(pack.challenges.find(c=>c.id==='puzzle').level),BACKGROUND_QUIPS:JSON.stringify(pack.background),ALL_REMARK_POOLS:JSON.stringify(pack.pools),LOSS_REMARKS:JSON.stringify(pack.loss),presence:'null',commitment:'null',demoRecording:'false',demoShorts:'false',playtestWelcomeOpen:'false',playtestFeedbackOpen:'false',creditKnownIds:`new Set([...DATA_CENTER_LEVELS.map(l=>l.serverId),...Array.from({length:15},(_,i)=>'original-'+String(i+1).padStart(2,'0'))])`};
const descendants=(n,test)=>{if(test(n))return true;for(const [k,v]of Object.entries(n)){if(['start','end','loc'].includes(k))continue;if(Array.isArray(v)){if(v.some(x=>x&&typeof x.type==='string'&&descendants(x,test)))return true}else if(v&&typeof v.type==='string'&&descendants(v,test))return true}return false};
function scriptRelease(script,native=false){
 let s=script;
 s=s.replace(/const originalState=window\.__EXCEPTION_TEST__\.getState;window\.__EXCEPTION_TEST__\.getState=\(\)=>\(\{\.\.\.originalState\(\),mobilePaused,landscape:mobileLandscape\}\);/,'');
 s=s.replace('L=room===GLASS_TEST_INDEX?GLASS_TEST_LEVEL:LEVELS[room]','L=LEVELS[room]');
 s=s.replaceAll("['play','practice','controls','audio','log']","['play','controls','audio','log']");
 s=s.replace("if(!$('campaignWorlds')?.replaceChildren)return;",'');
 // UI branches for collections absent from this package cannot retain references to their catalogs.
 s=s.replace(/L\.demo\?'DEMO '[^:]+:L\.rageLab\?'LAB '[^:]+:/g,'');
 s=s.replace(/L\.cacheTrial\?'CACHE '[^:]+:L\.demo\?'DEMO '[^:]+:L\.rageLab\?'LAB '[^:]+:/g,'');
 s=s.replace(/\$\('rewardContinue'\)\.textContent=state==='won'\?[\s\S]*?:'Continue';/,"$('rewardContinue').textContent=state==='won'?'Levels & challenges':'Continue';");
 s=s.replace("if(won){if(rewardLast?.challenge){openCampaignMenu('challenges');return}if(rewardLast?.cache)nextCachePrototype();else if(demo)nextDemo();else openCampaignMenu();return}","if(won){openCampaignMenu(rewardLast?.challenge?'challenges':'campaign');return}");
 const ast=parse(s,{ecmaVersion:'latest'}),body=ast.body[0].expression.callee.body.body,edits=[];
 const replace=(n,t='')=>edits.push({start:n.start,end:n.end,text:t});
 const bannedRef=n=>n.type==='Identifier'&&(removed.has(n.name)||removedFunctions.has(n.name));
 const debug=n=>n.type==='MemberExpression'&&n.object.type==='Identifier'&&['window','globalThis'].includes(n.object.name)&&/^__/.test(n.property.name??n.property.value??'');
 const dom=n=>n.type==='CallExpression'&&n.callee.type==='Identifier'&&n.callee.name==='$'&&removedIds.has(n.arguments[0]?.value);
 function walk(n){
  if(n.type==='FunctionDeclaration'&&functions.has(n.id.name)){replace(n,functions.get(n.id.name));return}
  if(n.type==='FunctionDeclaration'&&(removedFunctions.has(n.id.name)||/^playtest|^installPlaytest|^endPlaytest|^showPlaytest/.test(n.id.name))){replace(n);return}
  if(n.type==='ExpressionStatement'&&(descendants(n,debug)||descendants(n,dom))){replace(n);return}
  if(n.type==='IfStatement'&&descendants(n.test,dom)){replace(n);return}
  if(n.type==='ArrayExpression'&&n.elements.some(x=>x?.type==='Literal'&&removedIds.has(x.value))){replace(n,'['+n.elements.filter(x=>!removedIds.has(x?.value)).map(x=>s.slice(x.start,x.end)).join(',')+']');return}
  if(n.type==='VariableDeclaration'){
   const declarations=n.declarations.filter(d=>!removed.has(d.id.name));
   if(declarations.length!==n.declarations.length||declarations.some(d=>Object.hasOwn(values,d.id.name))){
    replace(n,declarations.length?n.kind+' '+declarations.map(d=>d.id.name+' = '+(values[d.id.name]??s.slice(d.init.start,d.init.end))).join(',')+';':'');return;
   }
  }
  for(const [k,v]of Object.entries(n)){if(['start','end','loc'].includes(k))continue;if(Array.isArray(v))v.forEach(x=>{if(x?.type)walk(x)});else if(v?.type)walk(v)}
 }
 for(const n of body){
  const text=s.slice(n.start,n.end);
  if(n.type!=='FunctionDeclaration'&&n.type!=='VariableDeclaration'&&(descendants(n,bannedRef)||/^LEVELS\.push|^for\(const \[index,level\] of LEVELS|^for\(const level of LEVELS\.slice|^LOSS_REMARKS\.|^BACKGROUND_QUIPS\.levels|^ALL_REMARK_POOLS\[|^Object.assign\(ALL_REMARK_POOLS|^for\(const \[pool,lines\]|^for\(const \[family,copy\]|^for\(const level of DATA_CENTER_LEVELS/.test(text))){replace(n);continue}
  walk(n);
 }
 for(const e of edits.sort((a,b)=>b.start-a.start))s=s.slice(0,e.start)+e.text+s.slice(e.end);
 // Keep legacy numeric score keys for wallet migration, never their old geometry.
 s=s.replace("const prefix=PLAYTEST_ID?'exception-playtest-'+PLAYTEST_ID+':':'';","const prefix='';");
 s=s.replace('installCampaignUI();',"LEVELS=DATA_CENTER_LEVELS;COMPACT_POINTS=DATA_CENTER_LEVELS.map(l=>l.returnPoints);campaignMode=true;installCampaignUI();");
 // The native source only has lifecycle integration; test exports have already been stripped.
 return s;
}
function htmlRelease(page,script){
 const doc=parseHtml(page);function visit(n){
  n.childNodes=(n.childNodes??[]).filter(c=>c.nodeName!=='#comment'&&!c.attrs?.some(a=>a.name==='id'&&removedIds.has(a.value)));
  for(const c of n.childNodes){if(c.tagName==='script'&&!c.attrs?.some(a=>a.name==='src'))c.childNodes=[{nodeName:'#text',value:script,parentNode:c}];else visit(c)}
 }visit(doc);return serialize(doc).replace(/[ \t]+$/gm,'').replace('<head>',`<head><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'self' 'unsafe-inline'; style-src 'unsafe-inline'; img-src 'self' data:; media-src 'self' blob:; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'">`);
}
const out=resolve(root,'outputs/release/site');await rm(out,{recursive:true,force:true});await mkdir(out,{recursive:true});await mkdir(resolve(root,'outputs/release-tests'),{recursive:true});
const qa=await read('tools/release/qa.js');
const manifest={campaignLevels:pack.levels.map(l=>l.serverId),challenges:pack.challenges.map(c=>c.id),testHooks:false,levelDeepLinks:false,liveAdSdk:false,files:{}};
for(const [name,page]of [['desktop.html',desktop],['mobile.html',devMobile]]){
 const input=page.match(/<script>([\s\S]*?)<\/script>/)[1],script=scriptRelease(input);
 await writeFile(resolve(root,'outputs/release-tests/'+name),htmlRelease(page,script.replace('requestAnimationFrame(frame);\n})();',qa+'\n})();')));
 const code=(await transform(script,{minify:true,treeShaking:true,target:'safari15',legalComments:'none'})).code;
 const html=htmlRelease(page,code);await writeFile(resolve(out,name),html);if(name==='mobile.html')await writeFile(resolve(root,'mobile/index.html'),html);
 manifest.files[name]={bytes:Buffer.byteLength(html),sha256:createHash('sha256').update(html).digest('hex')};
}
const legalContent=JSON.parse(await read('release/app-store/legal/content.json'));
legalContent.pages.push(JSON.parse(await read('release/app-store/legal/notices.json')));
const nativeAdapter=(await read('apps/native/src/game-adapter.js')).replace('/* LEGAL_CONTENT */ null',JSON.stringify(legalContent));
const nativeSource=devMobile.match(/<script>([\s\S]*?)<\/script>/)[1].replace('installMobileUI();initRoom(true);requestAnimationFrame(frame);',nativeAdapter+'\ninstallMobileUI();initRoom(true);installNativeUI();requestAnimationFrame(frame);');
const nativeCode=(await transform(scriptRelease(nativeSource),{minify:true,treeShaking:true,target:'safari15',legalComments:'none'})).code;
await writeFile(resolve(root,'outputs/release/native.html'),htmlRelease(devMobile,nativeCode).replace('<script>','<script src="native-bridge.js"></script><script>'));
await writeFile(resolve(out,'index.html'),`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>EXCEPTION: HUMAN</title><script>location.replace(matchMedia('(pointer: coarse)').matches?'mobile.html':'desktop.html')</script><a href="mobile.html">Play with touch</a> · <a href="desktop.html">Play with keyboard</a></html>`);
await writeFile(resolve(root,'outputs/release/manifest.json'),JSON.stringify(manifest,null,2)+'\n');
console.log('Built release-only website: 20 campaign levels, 4 challenges; no developer exports or level deep links.');
export {scriptRelease,htmlRelease};
