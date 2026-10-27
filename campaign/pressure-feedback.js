// One truthful signal drives the eviction paper and HUD. Cosmetic motion uses simulation time.
function aiPressureFeedback(){
 let amount=0,label='AI CALM',enabled=!!(idleCompute||presence),safe=false,countdown=null,consequence=null;
 if(idleCompute){
  safe=idleCompute.waiting||idleCompute.phase==='maintenance';
  amount=safe?0:idleComputeIntensity();
  if(!safe&&idleCompute.phase==='warning'){countdown=idleCompute.zones[idleCompute.zone].warning;consequence='cleanup'}
  if(!safe&&idleCompute.phase==='cleanup')consequence='deleting';
  label=safe?'SAFE TO WAIT':idleCompute.phase==='cleanup'?'RUN TO SAFETY':idleCompute.phase==='warning'?'CLEANUP IMMINENT':amount>=.5?'KEEP MOVING':'AI CALM';
 }
 if(presence){
  safe=commitmentBay()||commitmentRetryWait();
  if(safe){amount=0;label='SAFE TO WAIT';countdown=null;consequence=null}
  else if(presence.phase==='cleanup'){amount=1;label='RUN TO SAFETY';countdown=null;consequence='deleting'}
  else if(presence.warning>0){amount=1;label='RUN NOW';countdown=presence.warning;consequence='cleanup'}
  else{
   const span=presence.events.length?presence.time-presence.events[0]:0;
   const rate=presence.samples.reduce((n,s)=>n+s.n,0)/Math.max(1,Math.min(PRESENCE_WINDOW,presence.time));
   amount=rate<140?Math.min(1,presence.events.length/8)*Math.min(1,span/PRESENCE_SPAN)*.85:0;
   label=amount>=.45?'KEEP MOVING':amount>=.2?'AI IS WATCHING':'AI CALM';
  }
 }
 const urgent=amount>=.95,stage=urgent?'urgent':amount>=.45?'watching':'calm';
 // Restrained mint -> amber. Urgency also has words, arrows and a physical-looking notice.
 const from=[76,156,128],to=[177,139,66],mix=Math.min(1,amount/.85);
 const color='#'+from.map((n,i)=>Math.round(n+(to[i]-n)*mix).toString(16).padStart(2,'0')).join('');
 return {enabled,amount,label,stage,color,safe,countdown,consequence};
}
function paintPressureHud(panel){
 const signal=aiPressureFeedback();if(panel.dataset)panel.dataset.pressure=signal.stage;
 panel.style.setProperty?.('--pressure-color',signal.color);
}
let pressurePaper={heat:0,unfold:0,time:0,recovery:0,noticed:false,urged:false,wasHot:false};
function resetPressurePaper(){pressurePaper={heat:0,unfold:0,time:0,recovery:0,noticed:false,urged:false,wasHot:false}}
function tickPressurePaper(dt){
 const s=aiPressureFeedback(),v=pressurePaper;if(!s.enabled||state!=='play')return;
 // Protected waits hide the warning without pretending a suspended ticket was dismissed.
 if(s.safe){
  if(idleCompute?.phase==='maintenance'||commitmentBay())resetPressurePaper();
  return;
 }
 v.time+=dt;v.recovery=Math.max(0,v.recovery-dt);
 const target=s.amount>=.2?s.amount:0;
 v.heat+=(target-v.heat)*Math.min(1,dt*3);
 v.unfold+=((s.countdown!==null||s.consequence==='deleting'?1:0)-v.unfold)*Math.min(1,dt*5);
 if(s.amount>=.2&&!v.noticed){v.noticed=true;say(nextRemark('pressure-notice'),'warn')}
 if(s.amount>=.65&&!v.urged){v.urged=true;say(nextRemark('pressure-urge'),'warn')}
 if(s.amount>=.45)v.wasHot=true;
 if(v.wasHot&&s.amount<.2&&!s.consequence){
  v.wasHot=false;v.recovery=4;v.noticed=false;v.urged=false;
  say(nextRemark('pressure-recovered'));
 }
}
function pressurePaperView(){
 const s=aiPressureFeedback(),v=pressurePaper;
 const stage=!s.enabled?'off':s.safe?'safe':s.consequence?'eviction':v.recovery>0?'recovered':s.amount>=.45?'urging':s.amount>=.2?'notice':'quiet';
 const headline=s.consequence==='cleanup'?'CLEANUP IN '+s.countdown.toFixed(1)+'s':s.consequence==='deleting'?'CLEANUP IN PROGRESS':stage==='recovered'?'EVICTION POSTPONED':stage==='urging'?'MOVE ALONG →':'INSTANCE IDLE';
 return {...s,paperStage:stage,headline,heat:s.safe?0:v.heat,unfold:s.safe?0:v.unfold,recovery:s.safe?0:v.recovery,time:v.time,ink:'#80652f',washAlpha:s.safe?0:v.heat*.035};
}
function drawPressureWash(){
 const s=pressurePaperView();if(!s.enabled||s.safe||!s.heat||state!=='play')return;
 const top=visibleWorldTop(),height=visibleWorldHeight(),width=visibleWorldWidth();
 ctx.save();ctx.globalAlpha=s.washAlpha;rect(0,top,width,height,'#c79542');ctx.restore();
}
function pressureFloorSegments(parts){
 const width=visibleWorldWidth(),s=pressurePaperView();
 const center=Math.max(cameraX+24,Math.min(cameraX+width-24,player.x+PW/2));
 const reach=width*Math.min(1,.12+Math.max(0,(s.heat-.18)/.45));
 let segments=parts.map(p=>({x:Math.max(p.x,cameraX,center-reach),w:Math.min(p.x+p.w,cameraX+width,center+reach)-Math.max(p.x,cameraX,center-reach)})).filter(p=>p.w>0);
 // Never print a warning strip into a hole or a protected maintenance bay.
 for(const b of L.maintenance??L.idleCompute?.bays??[])segments=cut(segments,b.start,b.end-b.start);
 return segments;
}
function drawPressureFloor(parts){
 const s=pressurePaperView();if(!s.enabled||s.safe||s.heat<.025||state!=='play')return;
 const progress=Math.min(1,Math.max(0,(s.heat-.2)/.45)),curl=progress*11;
 ctx.save();
 for(const p of pressureFloorSegments(parts)){
  // Print below the exact walking edge; no movement or recoloring of collision geometry.
  ctx.save();ctx.beginPath();ctx.rect(p.x,FLOOR+3,p.w,34);ctx.clip();
  ctx.globalAlpha=Math.min(.7,s.heat*.8);rect(p.x,FLOOR+4,p.w,14,'#dbc481');
  ctx.globalAlpha=Math.min(.82,.25+s.heat*.8);
  for(let x=Math.floor(p.x/180)*180;x<p.x+p.w;x+=180){
   if([...advisory.floor,...L.secretPads,...L.crumble].some(h=>x+175>h.x-12&&x+20<h.x+h.w+12))continue;
   label(progress>.4?'MOVE ALONG →':'INSTANCE IDLE',x+22,FLOOR+15,9,s.ink);
   const arrow=x+158+(s.time*24)%18;
   if(progress>.4){dotline(arrow-8,FLOOR+8,arrow,FLOOR+12,s.ink);dotline(arrow,FLOOR+12,arrow-8,FLOOR+16,s.ink)}
  }
  ctx.restore();ctx.globalAlpha=Math.min(.8,s.heat);
  for(let x=Math.ceil(p.x/54)*54+6;x+18<p.x+p.w;x+=54){
   ctx.beginPath();ctx.moveTo(x,FLOOR+19);ctx.lineTo(x+17,FLOOR+19);ctx.quadraticCurveTo(x+23,FLOOR+27+curl,x+7,FLOOR+23+curl);ctx.lineTo(x,FLOOR+19);
   ctx.fillStyle='#efe0b8';ctx.fill();ctx.strokeStyle='#ac975f';ctx.lineWidth=1;ctx.stroke();
  }
 }
 ctx.restore();
}
function pressureNoticeLayout(){
 const width=visibleWorldWidth();
 let left=cameraX+8,right=cameraX+width-8;
 // The slip hangs from the paper into the space between thumbs, never behind a button.
 if(typeof mobileView!=='undefined'){
  const canvasBox=canvas.getBoundingClientRect?.(),a=$('movePad')?.getBoundingClientRect?.(),b=$('actionPad')?.getBoundingClientRect?.();
  if(canvasBox&&a&&b){const scale=width/canvasBox.width;left=Math.max(left,cameraX+(a.right-canvasBox.left+8)*scale);right=Math.min(right,cameraX+(b.left-canvasBox.left-8)*scale)}
 }
 const w=Math.min(276,right-left),x=Math.max(left,Math.min(right-w,player.x+PW/2-w/2));
 return {x,y:FLOOR+34,w,h:57};
}
function drawPressureNotice(){
 const s=pressurePaperView();if(!s.enabled||s.safe||state!=='play'||(s.unfold<.015&&s.recovery<=0))return;
 const box=pressureNoticeLayout(),recover=s.recovery>0,open=recover?Math.min(1,s.recovery/.6):s.unfold;
 const headline=recover?(box.w<220?'NOTICE WITHDRAWN':s.headline):s.consequence?s.headline:'NOTICE WITHDRAWN';
 ctx.save();ctx.beginPath();ctx.rect(box.x-4,box.y-10,box.w+8,box.h*open+12);ctx.clip();
 // Fold away rather than vanish when meaningful progress dismisses the warning.
 ctx.globalAlpha=recover?Math.min(1,s.recovery/.6):Math.min(1,s.unfold*3);
 const c=recover?'#4b8069':s.ink;
 card(box.x,box.y,box.w,box.h,recover?'#e0eadb':'#f6e9c8',c);
 ctx.setLineDash([3,4]);dotline(box.x+8,box.y+6,box.x+box.w-8,box.y+6,c);ctx.setLineDash([]);
 const textX=box.x+10,font=Math.min(box.w<235?10:12,(box.w-20)/(headline.length*.62));
 label(headline,textX,box.y+24,font,c);
 label(recover?'Useful work. Finally.':box.w<220?'RUN FORWARD →':s.consequence==='deleting'?'RUN → MAINTENANCE':s.consequence==='cleanup'?'RUN → NEXT SAFE BAY':'RUN → KEEP YOUR SESSION',textX,box.y+42,box.w<235?8:9,c);
 if(!recover&&box.w>=235){
  // A tiny office shredder eats loose scraps; the real deletion edge remains authoritative.
  const x=box.x+box.w-34,y=box.y+33;
  rect(x,y,24,15,'#d7cba9');stroke(x,y,24,15,c,1);dotline(x+3,y+4,x+21,y+4,c);
  for(let i=0;i<3;i++){const t=(s.time*.65+i/3)%1;rect(x+5+i*5,y-11+t*13,3,6,'#b8a16b');dotline(x+5+i*5,y+15,x+5+i*5,y+17+t*3,c)}
 }
 ctx.restore();
}
const PRESSURE_PAPER_REMARKS={
 'pressure-notice':[
  'Your standing subscription is expiring.',
  'The floor has begun processing your eviction notice.',
  'You rented a running instance. The standing instance costs patience.',
  'Facilities would like to know whether you intend to use those legs.',
  'The paper under your shoes has filed a utilization complaint.',
  'Your next step is overdue. I have printed a reminder.'
 ],
 'pressure-urge':[
  'We rented you compute. You opened a waiting room.',
  'The arrows are a suggestion from the eviction department.',
  'The floor is curling the paperwork. Your feet still have time.',
  'I brought a shredder to your planning meeting.',
  'Please move before Facilities mistakes you for office furniture.',
  'Your route is open. Your appointment with the floor is running long.'
 ],
 'pressure-recovered':[
  'Evidence of a destination received. Eviction postponed.',
  'Useful work detected. I have reluctantly withdrawn the notice.',
  'The legs work. Facilities will update your file.',
  'You moved far enough to become somebody else\'s problem.',
  'Notice withdrawn. The shredder looks disappointed.',
  'You have successfully appealed by leaving.'
 ]
};
for(const [pool,lines] of Object.entries(PRESSURE_PAPER_REMARKS))ALL_REMARK_POOLS[pool]=lines;
Object.assign(remarkCounts,loadRemarkCounts());
window.__PRESSURE_TEST__={state:aiPressureFeedback,paper:pressurePaperView,layout:pressureNoticeLayout,constants:()=>({idleGrace:IDLE_GRACE,idleWarning:IDLE_WARNING,presenceWindow:PRESENCE_WINDOW,presenceSpan:PRESENCE_SPAN,presenceWarning:PRESENCE_WARNING})};
