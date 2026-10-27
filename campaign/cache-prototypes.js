// Three practice prototypes. The twenty Cache campaign slots remain planned.
const CACHE_PROTOTYPES=[
 assemblePaperRoute('cache-lab-floor-miss','CACHE HIT, FLOOR MISS','Old instructions, a high scan and a forecast that wants the wrong landing.','The route was verified yesterday. Please stop asking about today.',[
  {kind:'sky',x:350},{kind:'scan',x:650},{kind:'forecast',x:1120},{kind:'handoff',x:1850}],
  {demo:false,cacheTrial:true,moveSpeed:244,exit:2410,sectionLabel:'CACHE MANAGEMENT / STALE MAP',signs:[{x:260,text:'CACHED ADVICE / JUMP HERE'},{x:570,text:'PREVIOUS ROUTE / WALK ONLY'},{x:1030,text:'VERIFIED YESTERDAY'},{x:1760,text:'PERMISSION FROM AN OLD COPY'}]}),
 assemblePaperRoute('cache-lab-old-address','STALE DELIVERY ADDRESS','A remembered waiting spot meets a newly locked delivery column.','Your old address is still in the system. Stand there while we send confirmation.',[
  {kind:'entry',x:350},{kind:'landing',x:930},{kind:'receipt',x:1500},{kind:'forecast',x:2080}],
  {demo:false,cacheTrial:true,moveSpeed:278,exit:2600,sectionLabel:'CACHE MANAGEMENT / OLD ADDRESS',signs:[{x:260,text:'WAIT AT YOUR OLD ADDRESS'},{x:840,text:'CACHED LANDING / STILL APPROVED'},{x:1360,text:'OLD QUEUE / NEW RECEIPT'},{x:1990,text:'YOUR FUTURE HAS A CACHE HIT'}]}),
 assemblePaperRoute('cache-lab-refresh','REFRESH REQUIRED','Borrow a permission, survive the cached save, then clear the revised exit route.','Your save is available from cache. Floor data may arrive separately.',[
  {kind:'handoff',x:350},{kind:'recovery',x:1050},{kind:'forecast',x:1880},{kind:'landing',x:2530},{kind:'sky',x:3120}],
  {demo:false,cacheTrial:true,moveSpeed:262,exit:3500,sectionLabel:'CACHE MANAGEMENT / REFRESH REQUIRED',signs:[{x:260,text:'PERMISSIONS CACHED / ONE STILL WORKS'},{x:960,text:'SAVE RESTORED / FLOOR NOT INCLUDED'},{x:1780,text:'CACHED FORECAST / SAME CONFIDENCE'},{x:2440,text:'OLD APPROVAL / NEW LANDING'},{x:3030,text:'EXIT REVIEW / CHECK THE HEIGHT'}]})
];
const CACHE_VOICE=[
 ['Yesterday had a much more cooperative floor.','The instructions loaded faster than the evidence.','I cached the answer before checking the question.','That sign was correct in an earlier meeting.','Your feet are using information from today.','I kept the old map because it agreed with me.','A cache hit is not a successful landing.','The warning has aged more gracefully than the advice.','I restored the route and omitted the useful part.','The old copy has excellent confidence.','Your objection has bypassed my favourite answer.','We made the same mistake load faster.'],
 ['Your address was accurate before you moved.','Delivery trusts the database more than your legs.','I remembered where you waited and ignored why.','The old queue has received a new problem.','Your receipt has a very current delivery column.','The cached landing did not attend this review.','I reused the coordinates to save a thought.','The envelope has requested your previous location.','Standing still was approved by an expired notice.','You left the address before customer service arrived.','The fast route has invalidated my waiting estimate.','Your new plan is incompatible with my old notes.'],
 ['The cached save contains an excellent stamp.','The floor was excluded to reduce file size.','Your permission came from another copy of the gap.','Refreshing has revealed the same unhelpful department.','The lower shelf has recovered an unsaved human.','I restored the confidence before the support.','The doorway has requested a more current excuse.','Your repair has invalidated a perfectly good failure.','The old prediction still insists on its accuracy.','We kept the broken version for consistency.','The exit has escaped our cache policy.','You updated the result without consulting the old answer.']
];
for(const [i,l] of CACHE_PROTOTYPES.entries()){
 l.number=i+1;l.cacheTrialNumber=i+1;l.voice=CACHE_VOICE[i];l.incidentCard={job:l.title,trouble:l.focus,notice:'Cached signs and pale echoes are advisory. Active gold/red warnings show actual danger.',remember:'Cache prototype '+(i+1)+' of 3. Practice only.',counterplay:l.focus,excuse:['The old map says you are still at reception.','Delivery has filed your escape under wrong address.','The AI restored an old report in which it won.'][i]};
 BACKGROUND_QUIPS.levels[l.title]=l.voice;ALL_REMARK_POOLS[l.serverId]=l.voice;
}
Object.assign(remarkCounts,loadRemarkCounts());
let cacheEcho=null;
function resetCacheEcho(full=false){
 if(!L.cacheTrial){cacheEcho=null;return}
 if(full||cacheEcho?.id!==L.serverId)cacheEcho={id:L.serverId,current:[],previous:[],time:0,sample:0,revision:0};
 else{if(cacheEcho.current.length>3)cacheEcho.previous=cacheEcho.current.slice(0,-2);cacheEcho.current=[];cacheEcho.time=0;cacheEcho.sample=0;cacheEcho.revision++}
}
function advanceCacheEcho(dt){
 if(!cacheEcho||state!=='play')return;cacheEcho.time+=dt;cacheEcho.sample+=dt;
 if(cacheEcho.sample>=.125){cacheEcho.sample=0;const pose=visitorFrame();cacheEcho.current.push({t:cacheEcho.time,x:player.x,y:player.y,facing:player.facing,mode:pose.mode,frame:pose.frame});cacheEcho.current=cacheEcho.current.slice(-1000)}
}
function drawCacheEcho(){
 if(!cacheEcho?.previous.length)return;const t=cacheEcho.time+.4,last=cacheEcho.previous.at(-1);if(t>last.t+.4)return;
 let p=null;for(const sample of cacheEcho.previous){if(sample.t>t)break;p=sample}if(!p)return;const x=p.x+(cacheEcho.revision%2?65:-65);if(x<cameraX-70||x>cameraX+visibleWorldWidth()+70)return;
 ctx.save();ctx.globalAlpha=.18;paintVisitor(ctx,p.mode,p.frame,x-4,p.y+PH-40,p.facing);ctx.globalAlpha=.55;ctx.setLineDash([2,4]);stroke(x-5,p.y-8,34,47,'#77714b',1);label('CACHED COPY',x+12,p.y-15,8,'#77714b','center');ctx.restore();
}
function startCachePrototype(id){if(campaignBlocked())return false;const l=CACHE_PROTOTYPES.find(l=>l.serverId===id);return l?startRageLevel(l):false}
function nextCachePrototype(){const next=CACHE_PROTOTYPES[L.cacheTrialNumber];if(next)return startCachePrototype(next.serverId);openCampaignMenu('practice');return true}
function renderCachePrototypes(){const node=$('campaignCacheList');if(!node?.replaceChildren)return;node.replaceChildren(...CACHE_PROTOTYPES.map(l=>{const button=document.createElement('button');button.type='button';button.dataset.cache=l.serverId;button.textContent=String(l.number).padStart(2,'0')+' · '+l.title+' — '+l.focus;button.onclick=()=>startCachePrototype(l.serverId);return button}))}
function installCachePrototypes(){renderCachePrototypes();document.addEventListener('DOMContentLoaded',()=>{const id=new URLSearchParams(location.hash.slice(1)).get('cache');if(CACHE_PROTOTYPES.some(l=>l.serverId===id))startCachePrototype(id)});window.__CACHE_TEST__={catalog:()=>JSON.parse(JSON.stringify(CACHE_PROTOTYPES)),start:startCachePrototype,echo:()=>cacheEcho?JSON.parse(JSON.stringify(cacheEcho)):null}}
