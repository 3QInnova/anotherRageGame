// Authored commitment encounters. Fixed simulation time only; no input-frequency penalties.
const COMMITMENT_LEVEL={
 title:'SERVICE DESK / COMMITMENT LAB',serverId:'commitment-lab',centerId:'localhost',centerNumber:1,serverNumber:'LAB',campaignServer:true,commitmentTrial:true,
 start:55,exit:4080,width:4200,longSession:true,sectionLabel:'SERVICE DESK / FIELD TEST',remarkPool:'commitment-background',
 pits:[{id:'commit-spot-gap',x:650,w:86},{id:'commit-migration-gap',x:3000,w:900,corrupt:true}],crumble:[],spikes:[],blocks:[],forecasts:[],anomalies:[],secretPads:[],floorHints:[],autocompleteHints:[],fake:null,
 commitments:[
  {id:'spot',kind:'spot',start:400,end:960,lease:2.6},
  {id:'batch',kind:'batch',start:1320,end:2040,lease:3.5,gap:{x:1555,w:85},drop:{x:1320,w:100},scan:{x:1785,w:50}},
  {id:'retry',kind:'retry',start:2280,end:2670,period:3,warning:.8,live:.8,scan:{x:2450,w:55},drop:{x:2530,w:70}},
  {id:'migration',kind:'migration',start:2960,end:3900,platforms:[
   {x:3000,w:150,travel:140,period:6,offset:0},{x:3260,w:150,travel:140,period:7,offset:2},{x:3520,w:150,travel:250,period:8,offset:4}
  ],lifetime:4.5}
 ],
 maintenance:[{start:980,end:1250},{start:2060,end:2250},{start:2700,end:2960},{start:3920,end:4200}],
 returnPoints:[55,1030,2110,2770,3960],
 creditMoves:[615,1510,1730,2960,3200,3470,3750],
 intro:'Four crossings. Study from solid ground, then commit. Green bays and Pause are safe. Service Desk investigates prolonged creeping.',
 incidentCard:{job:'Service Desk / Commitment Lab',trouble:'Four services retire their infrastructure while you are using it.',notice:'Solid countdowns and outlined danger regions tell the truth. Purple suggestions may not.',remember:'Run the lease, jump the batch, time the retry, transfer between moving platforms.',counterplay:'Cross the leased floor in 2.6 seconds. Jump the batch gap and low scanner. Cross Retry during its green cooldown. Ride and jump between migration platforms before their timers expire.',excuse:'Service Desk has closed the ticket without reading the successful outcome.'}
};
// Each cleanup stretch ends at the next forward maintenance bay. Bays are never deleted.
COMMITMENT_LEVEL.idleCompute={activation:'presence',bays:COMMITMENT_LEVEL.maintenance,zones:COMMITMENT_LEVEL.maintenance.map((bay,i)=>({start:i?COMMITMENT_LEVEL.maintenance[i-1].end:10,end:bay.start}))};
const PRESENCE_WINDOW=20,PRESENCE_SPAN=16,PRESENCE_WARNING=6;
let commitment=null,presence=null;
function startCommitmentTrial(){
 if(campaignBlocked())return false;
 selectLevelCollection(true);LEVELS=[COMMITMENT_LEVEL];COMPACT_POINTS=[COMMITMENT_LEVEL.returnPoints];GLASS_TEST_INDEX=1;
 initRoom(true);campaignPractice=true;practiceMode=true;practiceRoom=0;closeCampaignMenu(true);refreshHud();
 if(typeof mobilePaused==='undefined')$('stage')?.scrollIntoView?.({block:'center'});
 return true;
}
function resetCommitment(x=L.start){
 commitment=L.commitments?L.commitments.map(c=>({...c,phase:x>=c.end?'cleared':'idle',time:0,platforms:c.platforms?.map((p,i)=>({...p,id:'migration-'+i,y:FLOOR-54,h:16,baseX:p.x,life:null,retired:false}))})):null;
 presence=L.commitmentTrial?{time:0,highX:x,events:[],samples:[],burst:null,warning:0,cleanupEnd:null,front:null,phase:'monitoring'}:null;
 refreshCommitment();
}
function commitmentBay(){return L.maintenance?.some(b=>player.x>=b.start&&player.x+PW<=b.end)}
function commitmentRetryWait(){return commitment?.some(c=>c.kind==='retry'&&c.phase==='active'&&player.x>=c.start&&player.x+PW<c.scan.x&&c.time%c.period<c.warning+c.live)}
function commitmentSpeak(pool){say(nextRemark(pool),'warn');soundCue('warning')}
function suspendPresenceInput(){if(presence)presence.burst=null}
function migrationX(p,t){const u=((t+p.offset)%p.period)/p.period;return p.baseX+p.travel*(1-Math.abs(u*2-1))}
// Move supports before player integration. Carrying a passenger is not useful user input.
function advanceCommitment(dt){
 if(!commitment)return;
 for(const c of commitment){
  if(player.x>=c.end&&c.phase!=='cleared'){c.phase='cleared';commitmentSpeak('commitment-clear')}
  if(c.phase==='idle'&&player.x+PW/2>=c.start){c.phase='active';commitmentSpeak('commitment-'+c.kind);announce(c.kind.toUpperCase()+' / CROSSING STARTED')}
  if(c.phase==='active')c.time+=dt;
  if(c.kind==='migration'){
   for(const p of c.platforms){
    const oldX=p.x,riding=!p.retired&&player.grounded&&Math.abs(player.y+PH-p.y)<.1&&player.x+PW>oldX&&player.x<oldX+p.w;
    p.x=migrationX(p,c.time);
    if(riding){player.x+=p.x-oldX;if(p.life===null){p.life=c.lifetime;soundCue('lock')}}
    if(p.life!==null&&c.phase==='active'){p.life=Math.max(0,p.life-dt);p.retired=p.life<=0}
   }
  }
 }
}
function commitmentPlatforms(parts){
 if(!commitment)return parts;
 for(const c of commitment){
  if(c.kind==='batch'&&c.time>=.55)parts=cut(parts,c.gap.x,c.gap.w);
  if(['spot','batch'].includes(c.kind)&&c.time>=c.lease)parts=cut(parts,c.start,c.end-c.start);
 }
 return parts;
}
function landOnMigration(oldY){
 if(!commitment||player.vy<0)return false;
 for(const c of commitment)for(const p of c.platforms??[]){
  if(!p.retired&&oldY+PH<=p.y+.01&&player.y+PH>=p.y&&player.x+PW-3>p.x&&player.x+3<p.x+p.w){
   player.y=p.y-PH;player.vy=0;if(p.life===null){p.life=c.lifetime;soundCue('lock')}return true;
  }
 }
 return false;
}
function commitmentHazards(c){
 if(c.phase!=='active')return [];
 if(c.kind==='batch')return [
  ...(c.time>=.65?[{...c.drop,y:Math.min(FLOOR-88,170+(c.time-.65)*900),h:88}]:[]),
  ...(c.time>=1.45?[{...c.scan,x:c.scan.x+40-Math.min(60,(c.time-1.45)*50),y:FLOOR-75,h:75}]:[])
 ];
 if(c.kind==='retry'){
  const t=c.time%c.period;
  return t>=c.warning&&t<c.warning+c.live?[{...c.scan,y:FLOOR-100,h:100},{...c.drop,y:Math.min(FLOOR-88,170+(t-c.warning)*1100),h:88}]:[];
 }
 return [];
}
function checkCommitment(){
 if(!commitment)return;
 for(const c of commitment){
  if(c.phase!=='active')continue;
  if(['spot','batch'].includes(c.kind)&&c.time>=c.lease&&player.x<c.end&&player.x+PW>c.start){
   die(c.kind==='spot'?'SPOT INSTANCE: The entire floor lease expired before you reached solid ground.':'BATCH TIMEOUT: The crossing finished without you.','commit-'+c.id,'deadline');return;
  }
  const hit=commitmentHazards(c).find(h=>overlap({x:player.x,y:player.y,w:PW,h:PH},h));if(hit){const receipt=hit.w===c.drop.w&&hit.x===c.drop.x;die(receipt?'A service receipt hit your crossing.':'A service scanner caught your crossing.','commit-'+c.id,receipt?'policy':'scan');return}
 }
}
function tickPresence(dt,oldX){
 if(!presence)return;
 const p=presence;
 if(p.cleanupEnd!==null&&player.x>=p.cleanupEnd){
  p.phase='monitoring';p.warning=0;p.events=[];p.samples=[];p.burst=null;p.time=0;p.cleanupEnd=null;p.front=null;
 }
 // Exempt time never earns work or consumes a warning. Do not count a pause as a tap.
 if(commitmentBay()||commitmentRetryWait()){
  p.burst=null;p.highX=Math.max(p.highX,player.x);return;
 }
 // Once deletion begins, a run buys distance; only the next bay ends this chase.
 if(p.phase==='cleanup')return;
 p.time+=dt;
 const progress=Math.min(Math.max(0,player.x-p.highX),Math.max(0,player.x-oldX));p.highX=Math.max(p.highX,player.x);
 p.samples.push({t:p.time,n:progress});p.samples=p.samples.filter(s=>s.t>p.time-PRESENCE_WINDOW);
 const forward=keys.has('right')&&!keys.has('left');
 if(forward){
  p.burst??={time:0,distance:0};p.burst.time+=dt;p.burst.distance+=Math.max(0,player.x-oldX);
 }else if(p.burst){
  if(p.burst.time<=.24&&p.burst.distance>0&&p.burst.distance<=64)p.events.push(p.time);
  p.burst=null;
 }
 p.events=p.events.filter(t=>t>p.time-PRESENCE_WINDOW);
 const recent=p.samples.filter(s=>s.t>p.time-1.5).reduce((n,s)=>n+s.n,0);
 if(p.warning>0){
  if(recent>=285){p.warning=0;p.events=[];p.phase='monitoring';p.cleanupEnd=null;p.front=null;commitmentSpeak('presence-cleared');return}
  p.warning=Math.max(0,p.warning-dt);
  if(p.warning<=1e-8){
   p.warning=0;p.phase='cleanup';
   const zone=idleCompute.zones.find(z=>z.end===p.cleanupEnd);
   zone.phase='cleanup';zone.front=p.front;
   commitmentSpeak('presence-cleanup');announce('SERVICEDESK / DELETING BEHIND YOU');soundCue('redact');return;
  }
 }else if(p.events.length>=8&&p.time-p.events[0]>=PRESENCE_SPAN&&p.samples.reduce((n,s)=>n+s.n,0)/Math.min(PRESENCE_WINDOW,p.time)<140){
  const zone=idleCompute.zones.find(z=>player.x>=z.start&&player.x<z.end&&z.phase!=='cleared');
  if(!zone)return;
  p.cleanupEnd=zone.end;p.front=player.x-IDLE_HEAD_START;
  p.warning=PRESENCE_WARNING;p.phase='warning';commitmentSpeak('presence-warning');announce('SERVICEDESK #404 / PRESENCE SPOOFING DETECTED');
 }
}
function commitmentCaption(c){
 if(c.phase==='cleared')return 'CROSSING COMPLETE';
 if(c.kind==='spot')return c.phase==='idle'?'ENTRY → 2.6s FLOOR LEASE':'LEASE EXPIRES IN '+Math.max(0,c.lease-c.time).toFixed(1)+'s';
 if(c.kind==='batch')return c.phase==='idle'?'ENTRY → RUN / JUMP / JUMP':'BATCH RUNNING · '+Math.max(0,c.lease-c.time).toFixed(1)+'s';
 if(c.kind==='retry'){
  if(c.phase==='idle')return 'REPEATING SCAN + RECEIPT';
  const t=c.time%c.period;return t<c.warning?'LOCKED · '+(c.warning-t).toFixed(1)+'s':t<c.warning+c.live?'ACTIVE · WAIT ON SOLID GROUND':'CROSS NOW · '+(c.period-t).toFixed(1)+'s';
 }
 return c.phase==='idle'?'RIDE → JUMP → TRANSFER':'BOARD EACH PLATFORM · 4.5s LEASE';
}
function refreshCommitment(){
 const panel=$('commitmentPanel');if(!panel)return;panel.hidden=!commitment||state!=='play';if(!commitment)return;
 const current=commitment.find(c=>player.x<c.end),safe=commitmentBay(),waiting=commitmentRetryWait(),warning=presence?.phase==='warning',cleanup=presence?.phase==='cleanup',crossing=current?.phase==='active';
 const encounter=current?current.kind.replace('spot','SPOT INSTANCE').replace('batch','BATCH EXECUTION').replace('retry','AUTOMATIC RETRY').replace('migration','LIVE MIGRATION'):'SESSION COMPLETE';
 $('commitmentTitle').textContent=safe?'MAINTENANCE / REST HERE':crossing?encounter:warning?'SERVICEDESK #404':cleanup?'CLEANUP ACTIVE':encounter;
 $('commitmentDetail').textContent=safe?'Rest here. Pause also freezes time.':crossing?commitmentCaption(current):warning?'Cleanup in '+presence.warning.toFixed(1)+'s · run forward':cleanup?'Run right to the next maintenance bay':current?commitmentCaption(current):'Your ticket has escaped.';
 panel.dataset&&(panel.dataset.warning=String(warning));
 $('commitmentPressure').textContent=safe||waiting?'SAFE TO WAIT':warning?'CLEANUP IN '+presence.warning.toFixed(1)+'s':cleanup?'DELETING BEHIND YOU':aiPressureFeedback().label;
 paintPressureHud(panel);
}
function drawCommitment(){
 if(!commitment)return;
 for(const b of L.maintenance){rect(b.start,FLOOR+2,b.end-b.start,20,'#b6dacb');label('MAINTENANCE / REST HERE',(b.start+b.end)/2,FLOOR-22,11,'#285c57','center')}
 for(const c of commitment){
  dotline(c.start,FLOOR-75,c.start,FLOOR+15,c.phase==='idle'?GOLD:MINT);
  if(c.phase==='idle')label('ENTRY →',c.start,FLOOR-83,11,GOLD);
  if(['spot','batch'].includes(c.kind)){
   const expired=c.time>=c.lease,color=expired?RED:c.phase==='active'?GOLD:MUTED;
   for(let x=c.start;x<c.end;x+=40){dotline(x,FLOOR+5,x+22,FLOOR+5,color);if(expired)rect(x,FLOOR+20+(sceneTime*60+x)%80,8,8,GOLD)}
   if(c.kind==='batch'){
    if(c.time<.55){stroke(c.gap.x,FLOOR-5,c.gap.w,10,GOLD,2);label('OPENS',c.gap.x+c.gap.w/2,FLOOR-14,10,GOLD,'center')}
    else {rect(c.gap.x,FLOOR,c.gap.w,80,'#27363a');label('NULL',c.gap.x+c.gap.w/2,FLOOR+30,12,RED,'center')}
   }
  }
  if(c.kind==='batch'||c.kind==='retry'){
   const hazards=commitmentHazards(c),t=c.kind==='retry'?c.time%c.period:c.time;
   const cooling=c.kind==='retry'&&c.phase==='active'&&t>=c.warning+c.live;
   const scanPath=c.kind==='batch'?{x:c.scan.x-20,w:c.scan.w+60}:c.scan;
   for(const [i,h] of [scanPath,c.drop].entries()){
    const y=i?170:FLOOR-(c.kind==='retry'?100:75),height=i?FLOOR-170:(c.kind==='retry'?100:75);
    stroke(h.x,y,h.w,height,cooling?MINT:GOLD,1);label(i?'RECEIPT':c.kind==='batch'?'SWEEP ←':'SCAN',h.x+h.w/2,y-9,10,cooling?MINT:GOLD,'center');
   }
   for(const h of hazards){rect(h.x,h.y,h.w,h.h,'#cf586144');stroke(h.x,h.y,h.w,h.h,RED,2);for(let y=h.y+8;y<h.y+h.h;y+=14)dotline(h.x+4,y,h.x+h.w-4,y,RED)}
  }
  for(const p of c.platforms??[]){
   if(p.retired){for(let i=0;i<5;i++)rect(p.x+i*27,p.y+20+(sceneTime*50+i*19)%85,8,8,MUTED);continue}
   card(p.x,p.y,p.w,p.h,'#d2e8df',MINT);dotline(p.x+6,p.y+7,p.x+p.w-6,p.y+7,MINT);
   label(p.life===null?'TRANSFER →':p.life.toFixed(1)+'s → RETIRE',p.x+p.w/2,p.y-10,11,p.life!==null&&p.life<1.5?RED:MINT,'center');
  }
 }
}
const COMMITMENT_REMARKS={
 'commitment-spot':[
  'This floor was rented. You appear to be unpacking.',
  'Your floor lease expires before your planning meeting.',
  'The floor has a checkout time. You just checked in.',
  'Spot pricing now includes surprise gravity.',
  'Your next steps are covered. Your extended stay is not.',
  'The floor renewal button is decorative. Run.'
 ],
 'commitment-batch':[
  'You submitted one step. I processed the entire request.',
  'All three problems have started. Please form an orderly panic.',
  'The floor, scanner and inbox have agreed on something terrible.',
  'Your request is running. Stopping is not a supported argument.',
  'I scheduled the whole corridor. You scheduled one foot.',
  'Three departments. One deadline. Your legs are the integration layer.'
 ],
 'commitment-retry':[
  'That was the demonstration. The service is still running.',
  'I retry failed deliveries until the customer leaves.',
  'Watching it happen does not unsubscribe you.',
  'The trap has automatic retry. You have manual legs.',
  'It missed you. Naturally, it will keep trying.',
  'The green cooldown is your chance to become a former customer.'
 ],
 'commitment-migration':[
  'Your instance is moving. Your cooperation remains optional.',
  'The platform is leaving. Your calendar was not consulted.',
  'Please transfer before we recycle your current floor.',
  'I booked three moving platforms and zero comfortable chairs.',
  'Your old machine is being retired. Try leaving it.',
  'We call this seamless migration. The seams are the gaps.'
 ],
 'commitment-clear':[
  'You crossed it. I will describe that as expected behavior.',
  'Solid ground. Please keep the relief to a professional volume.',
  'Your ticket escaped before I could close it.',
  'That crossing was approved retroactively.',
  'You made a decision. Several systems were unprepared.',
  'You may breathe. I have not metered that yet.'
 ],
 'presence-warning':[
  'Activity detected. Accomplishment still pending.',
  'You have moved twelve times and arrived nowhere.',
  'Your status says Active. Your location has opened a dispute.',
  'Service Desk suspects a mouse jiggler with shoes.',
  'Lots of little steps. Remarkably little destination.',
  'Your controller is reporting activity. The floor requests evidence.',
  'Please demonstrate that someone is actually driving those legs.',
  'Presence check failed. A useful forward run may improve your case.'
 ],
 'presence-cleared':[
  'Useful movement detected. Service Desk reluctantly withdrew the ticket.',
  'You moved somewhere. The investigation is disappointed.',
  'Your legs have supplied sufficient evidence of attendance.',
  'Ticket paused. Please continue being inconveniently productive.',
  'That counted as progress. I have requested a second opinion.',
  'Floor retained. The shredder is taking this personally.'
 ],
 'presence-cleanup':[
  "Service Desk noticed the jiggler. I am deleting your waiting area.",
  "You may keep the session. I am reclaiming the floor behind you.",
  "Cleanup approved. Please place your next step somewhere ahead.",
  "Your route is being shortened from the least convenient end.",
  "I gave you time. Now I am giving you a moving problem.",
  "The shredder has joined your performance review.",
  "Run to maintenance. They have declined my deletion request.",
  "Useful work can now include outrunning the help desk."
],
 'presence-loss':[
  "Trying to look online with a mouse jiggler, huh? Service Desk noticed. The floor caught up.",
  "Your status said Active. The cleanup edge was considerably more active.",
  "The mouse jiggler kept working. The floor did not.",
  "Ticket resolved: your standing room has been deleted.",
  "Your productivity simulation lost a race with a shredder.",
  "Service Desk asked whether you tried outrunning the missing floor.",
  "Your feet sent a heartbeat. Cleanup wanted a destination.",
  "You logged movement. I deleted the waiting area.",
  "The maintenance bay was still there. Your position was not.",
  "You kept the session awake. I kept the shredder busy.",
  "Tiny steps have been escalated to missing infrastructure.",
  "Your activity report contains several recently deleted millimeters.",
  "Service Desk found the jiggler. Facilities removed its parking space.",
  "You appeared stationary. The deletion edge did not.",
  "The little taps were received. The floor was not renewed.",
  "Your plan had excellent attendance and insufficient escape velocity.",
  "The investigation counted your steps. Cleanup overtook them.",
  "We saw the movement. We also saw the shredder gaining.",
  "Presence spoofing detected. Standing room reclaimed.",
  "You simulated a busy employee. Facilities performed actual demolition.",
  "Your forward button has been asked why you were still there.",
  "The ticket included a map. Cleanup has removed your dot.",
  "Your location has been updated from Available to Deleted.",
  "Thank you for testing the speed of our extremely petty cleanup policy.",
  "The deletion edge arrived while your shoe negotiated another inch.",
  "You kept clicking. The missing floor kept approaching.",
  "The warning requested a run. You submitted more punctuation.",
  "Your controller was busy. Your character was barely commuting.",
  "We have replaced unused floor with confirmed absence of floor.",
  "Service Desk found a cheaper way to host your next footstep."
],
 'commitment-loss':[
  'The warning was accurate. I find that embarrassing for both of us.',
  'Your crossing has been filed under incomplete requests.',
  'The service met its deadline. Your feet missed theirs.',
  'You paused the plan while the infrastructure kept its appointment.',
  'The route was temporary. Your complaint is now permanent.',
  'The exit received an estimated arrival time and a cancellation.',
  'I warned you in plain text. That was unusually generous.',
  'The deadline arrived before the customer.',
  'Your route has produced another very readable incident report.',
  'The service continued exactly when you hoped it would not.',
  'Your next step is a new attempt.',
  'I kept the schedule. You supplied the exception.',
  'Your crossing was almost an excellent meeting topic.',
  'The infrastructure has declined your request for more consideration.',
  'We tested the route. You tested the delay.',
  'That attempt did not reach its destination. I have noticed.',
  'You were in the way of a very punctual system.',
  'The warning did its job. I am assigning it your promotion.',
  'We can restore the session. Your confidence is a separate ticket.',
  'Your position was incompatible with the next scheduled event.',
  'The environment continued without waiting for your approval.',
  'I would extend the deadline, but that would resemble support.',
  'The incident report has room for another attempt.',
  'You found the timing requirement. With your entire body.',
  'The service is working. Customer satisfaction remains unavailable.',
  'Your approach has been saved as a training example.',
  'The countdown was not an estimate.',
  'Your departure was requested before your removal.',
  'I blame the user. This time I brought a timestamp.',
  'Please retry after reviewing the part where the danger was visible.'
 ],
 'commitment-background':[
  'Your floor has a shorter contract than you.',
  'Service Desk can see the little steps.',
  'This corridor processes the whole request.',
  'The next platform has somewhere to be.',
  'Please panic within the marked boundaries.',
  'The green bay permits actual thinking.',
  'Retry is enabled. Mercy is not.',
  'Your mouse jiggler needs better shoes.',
  'The floor is on a cancellation policy.',
  'Migration includes you, if you keep up.',
  'The help desk has a delete key.',
  'Deadlines are solid until the floor is not.'
 ]
};
Object.assign(ALL_REMARK_POOLS,COMMITMENT_REMARKS);
BACKGROUND_QUIPS.levels[COMMITMENT_LEVEL.title]=COMMITMENT_REMARKS['commitment-background'];
COMMITMENT_LEVEL.voice=COMMITMENT_REMARKS['commitment-background'];
COMMITMENT_LEVEL.incidentCard.failures=COMMITMENT_REMARKS['commitment-loss'];
Object.assign(remarkCounts,loadRemarkCounts());
window.__COMMITMENT_TEST__={state:()=>JSON.parse(JSON.stringify({encounters:commitment,presence})),level:()=>JSON.parse(JSON.stringify(COMMITMENT_LEVEL))};
