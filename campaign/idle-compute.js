// Shared deletion chase: automatic compute debt or an authored presence-check trigger.
const IDLE_GRACE=16,IDLE_WARNING=6,IDLE_WORK_SPEED=180,IDLE_DELETE_SPEED=145,IDLE_HEAD_START=400;
let idleCompute=null;
function resetIdleCompute(x=L.start){
 idleCompute=L.idleCompute?{zones:L.idleCompute.zones.map(z=>({...z,phase:x>=z.end?'cleared':'monitoring',debt:0,highX:Math.max(z.start,x),front:null,warning:0,noticed:false})),zone:-1,waiting:false,phase:'monitoring',activeSeconds:0}:null;
 refreshIdleCompute();
}
function idleWaitWindow(){
 // Only genuine, already armed waits suspend compute. Optional advice never does.
 if(commitmentRetryWait())return true;
 for(const h of [...L.forecasts,...L.blocks]){
  if(h.commit&&!h.counterplayWait)continue;
  const z=trap[h.id];if(!['armed','on'].includes(z.phase))continue;
  const target=z.x??h.x,w=h.w;
  if(player.x+PW<=target&&player.x>=h.trigger-(L.counterplay?160:60)&&player.x<=h.trigger+35)return true;
 }
 return false;
}
function idleSpeak(pool,mode='warn'){say(nextRemark(pool),mode);announce(pool==='idle-cleanup'?'IDLE INSTANCE / TERMINATION STARTED':pool==='idle-rest'?'MAINTENANCE EXCLUSION / COMPUTE SUSPENDED':'IDLE COMPUTE / USEFUL WORK NOT FOUND')}
function warnIdleZone(z){z.phase='warning';z.warning=IDLE_WARNING;z.front=player.x-IDLE_HEAD_START;idleSpeak('idle-warning');soundCue('warning')}
function tickIdleCompute(dt){
 if(!idleCompute||state!=='play')return;
 const m=idleCompute;
 if(coolingProtectedStation()){m.waiting=true;m.phase='circuit';return}
 for(const z of m.zones){
  if(player.x>=z.end&&z.phase!=='cleared'){z.phase='cleared';z.debt=0;idleSpeak('idle-rest','');soundCue('confirm')}
 }
 if(idleComputeContact())return;
 const index=m.zones.findIndex(z=>player.x>=z.start&&player.x<z.end&&z.phase!=='cleared');
 m.zone=index;m.waiting=false;
 if(index<0){m.phase='maintenance';return}
 const z=m.zones[index];m.phase=z.phase;
 if(idleWaitWindow()){m.waiting=true;return}
 m.activeSeconds+=dt;
 const progress=Math.max(0,player.x-z.highX);z.highX=Math.max(z.highX,player.x);
 if(z.phase==='monitoring'){
  if(Number.isFinite(z.warningAt)&&player.x>=z.warningAt){warnIdleZone(z);m.phase=z.phase;return}
  if(L.idleCompute.activation==='presence')return;
  z.debt=Math.max(0,Math.min(IDLE_GRACE,z.debt+dt-progress/IDLE_WORK_SPEED));
  if(z.debt>=IDLE_GRACE/2&&!z.noticed){z.noticed=true;idleSpeak('idle-notice')}
  if(z.debt>=IDLE_GRACE-1e-8)warnIdleZone(z)
 }else if(z.phase==='warning'){
  if(z.followWarning)z.front=player.x-IDLE_HEAD_START;
  z.warning=Math.max(0,z.warning-dt);
  if(z.warning<=1e-8){z.phase='cleanup';idleSpeak('idle-cleanup','danger');soundCue('redact')}
 }else if(z.phase==='cleanup')z.front=Math.min(z.end,z.front+IDLE_DELETE_SPEED*dt);
 m.phase=z.phase;
 idleComputeContact();
}
function idleComputeContact(){
 if(idleCompute.zones.some(a=>a.front!==null&&['cleanup','cleared'].includes(a.phase)&&player.x<a.front&&player.x+PW>a.start&&player.x<a.end)){die('IDLE COMPUTE: The cleanup edge caught you and deleted your position. Reach the next maintenance bay.',L.commitmentTrial?'presence-cleanup':'compute-cleanup');return true}return false;
}
function idleComputePlatforms(parts){
 if(!idleCompute)return parts;
 for(const z of idleCompute.zones)if(z.front!==null&&['cleanup','cleared'].includes(z.phase)&&z.front>z.start)parts=cut(parts,z.start,z.front-z.start);
 return parts;
}
function idleComputeIntensity(){const z=idleCompute?.zones[idleCompute.zone];return !z?0:z.phase==='monitoring'?z.debt/IDLE_GRACE:['warning','cleanup'].includes(z.phase)?1:0}
function drawIdleComputeEye(cx,cy,threat){
 const amount=aiPressureFeedback().amount;if(!amount||threat)return;
 const lid=amount*12;rect(cx-39,cy-17,78,lid,PAPER);rect(cx-39,cy+18-lid,78,lid,PAPER);
 dotline(cx-38,cy-17+lid,cx+38,cy-17+lid,MINT);
}
function drawIdleComputeWorld(){
 if(!idleCompute)return;
 const top=visibleWorldTop(),bottom=typeof mobileView==='undefined'?H:mobileView.top+mobileView.height;
 const width=visibleWorldWidth();
 ctx.save();
 for(const bay of L.commitmentTrial?[]:L.idleCompute.bays){
  if(L.counterplay&&(L.stations??[]).some(s=>s.x===bay.start))continue; // The workbench already labels its protected deck.
  if(bay.end<cameraX||bay.start>cameraX+width)continue;
  rect(bay.start,FLOOR+2,bay.end-bay.start,20,'#b6dacb');dotline(bay.start,FLOOR-6,bay.end,FLOOR-6,'#418d87');
  const lift=L.counterplay&&(L.betrayals??[]).some(b=>b.x-190===bay.start)?27:0;
  label('MAINTENANCE', (bay.start+bay.end)/2,FLOOR-47-lift,10,'#285c57','center');
  label('EXCLUSION / REST HERE',(bay.start+bay.end)/2,FLOOR-32-lift,9,'#285c57','center');
 }
 for(const z of idleCompute.zones){
  if(Number.isFinite(z.warningAt)&&z.warningAt>=cameraX-80&&z.warningAt<=cameraX+width){dotline(z.warningAt,FLOOR-80,z.warningAt,FLOOR,GOLD);label('CLEANUP ENTRY / 6s WARNING',z.warningAt,FLOOR-92,10,'#956d30','center')}
  if(z.front===null||!['warning','cleanup','cleared'].includes(z.phase))continue;
  const x=z.front,left=Math.max(z.start,cameraX),right=Math.min(x,cameraX+width);
  if(x<z.start)continue; // A protected maintenance bay is never shown as deleted.
  if(z.phase==='warning'){
   if(z.followWarning)label('CLEANUP FOLLOWS / LOCKS AT ZERO',Math.max(cameraX+15,x+12),FLOOR-66,9,GOLD);
   if(x>=cameraX){ctx.setLineDash([5,7]);dotline(x,top,x,bottom,GOLD);ctx.setLineDash([])}
   continue;
  }
  if(right>left){
   rect(left,top,right-left,bottom-top,'#27363a');
   for(let row=0;row<10;row++){
    const y=top+32+row*43;dotline(left,y,right,y,'#415352');
    if(right-left>140)label(row%2?'[ DATA RELEASED ]':'/ instance terminated',left+14,y-8,10,'#6e8b80');
   }
  }
  if(x<cameraX-40||x>cameraX+width+40)continue;
  ctx.strokeStyle=RED;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x,top);ctx.lineTo(x,bottom);ctx.stroke();
  for(let i=0;i<28;i++){
   const age=(sceneTime*.8+i*.173)%1,py=top+(i*37)%(bottom-top)+age*age*115;
   const px=x+(1-age)*20-8,s=i%3===0?9:5;
   rect(px,py,s,s,i%3===0?'#e9ce7b':i%3===1?PAPER:'#aee7cd');
  }
  if(z.phase==='cleanup')label('DELETING →',x+13,FLOOR-62,11,RED);
 }
 ctx.restore();
}
function refreshIdleCompute(){
 const panel=$('idleComputePanel');if(!panel)return;panel.hidden=!idleCompute||L.commitmentTrial||state!=='play';
 if(!idleCompute)return;
 const m=idleCompute,z=m.zones[m.zone],phase=m.waiting?'waiting':m.phase;
 const circuit=coolingProtectedStation(),ground=!!circuit?.route.grounded;
 const title=hasPuzzleBoxes()&&circuit?(circuit.solved?'PUZZLE BOX PASSED':puzzleIsOpen()?'PUZZLE BOX / HARNESS ON':'PUZZLE BOX DECK'):ground?'GROUND FAULT':circuit?(circuit.selected>=0?'U'+(circuit.selected+1)+' '+circuit.board.cells[circuit.selected].type+' · SELECTED':'CIRCUIT DECK'):phase==='maintenance'?'INSTANCE SUSPENDED':phase==='cleanup'?'IDLE INSTANCE: TERMINATING':phase==='warning'?'TERMINATION SCHEDULED':phase==='waiting'?'TRAP WAIT: COMPUTE PAUSED':L.idleDeletionTrial?'GARBAGE COLLECTION DAY':'IDLE COMPUTE';
 const caption=hasPuzzleBoxes()&&circuit?(circuit.solved?'Safe to cross':puzzleIsOpen()?'Trace inputs · TEST applies power':'X / OPEN BOX · actions free'):ground?'Platform live · rewire in '+Math.max(0,COOLING_SHOCK_DELAY-circuit.groundTime).toFixed(1)+'s':circuit?(circuit.solved?'Fan ready · safe to cross':circuit.selected>=0?'ROTATE U'+(circuit.selected+1)+' / X · actions free':'Tap a gate → ROTATE · actions free'):phase==='maintenance'?'Rest here. Pause also freezes time.':phase==='cleanup'?'Run right to the maintenance bay':phase==='warning'?'Cleanup starts in '+z.warning.toFixed(1)+'s':phase==='waiting'?'Trap wait · compute paused':L.idleDeletionTrial?'Idle allowance · '+Math.max(0,IDLE_GRACE-(z?.debt??0)).toFixed(1)+'s':(z?.debt??0)>=IDLE_GRACE/2?'Keep moving · AI is losing patience':'Short stops are covered.';
 if($('idleComputeTitle').textContent!==title)$('idleComputeTitle').textContent=title;
 if($('idleComputeCaption').textContent!==caption)$('idleComputeCaption').textContent=caption;
 $('idleComputeFill').style.width=(idleComputeIntensity()*100).toFixed(1)+'%';
 if(panel.dataset)panel.dataset.phase=phase;
 $('idleComputeMeter').setAttribute?.('aria-valuenow',String(Math.round(idleComputeIntensity()*100)));
 paintPressureHud(panel);if(ground)panel.style.setProperty?.('--pressure-color',RED);
}
const IDLE_COMPUTE_REMARKS={
 'idle-notice':[
  'Your instance is running. Your strategy appears to be stopped.',
  'Compute usage detected. Useful work not found.',
  'You provisioned legs. Utilization remains disappointing.',
  'I mistook your strategy for a disconnected controller.',
  'You have spent several seconds moving approximately one shoe.',
  'This server bills movement by the decision. Please make one.',
  'The forward button supports holding. An extravagant feature, I know.',
  'You are using an entire server to consider a footstep.',
  'Your caution has been running longer than your legs.',
  'I see button presses. I am looking for progress.',
  'Tiny steps still occupy a full instance.',
  'If you need a meeting about this jump, Pause can host it.'
 ],
 'idle-warning':[
  'Idle instance scheduled for termination. The floor is included.',
  'Your session looks abandoned. Cleanup starts in a moment.',
  'You found the loophole. I found the delete key.',
  'I am about to reduce the amount of level behind you.',
  'We are retiring unused infrastructure. Currently, that includes your route.',
  'Please begin moving before I finish deciding that you are furniture.',
  'Your next performance review will approach from the left.',
  'You may want to hold that button now.',
  'A short warning before a large reduction in floor.',
  'Budget meeting concluded. The paper lost.',
  'This instance needs useful work or a convincing escape.',
  'Stopping the instance was an option. You chose standing in it.'
 ],
 'idle-cleanup':[
  'You appeared to be finished. I started cleaning up.',
  'To reduce operating costs, I am removing the floor.',
  'The floor behind you has been reassigned.',
  'Your progress report is catching up with you.',
  'Cleanup has started. Please keep all limbs ahead of it.',
  'I have converted your waiting area into unavailable storage.',
  'The deletion team does not accept tiny steps as an appeal.',
  'You wanted less wasted space. I inferred that part.',
  'The level behind you is now somebody else\'s savings.',
  'Your session is still open. Its floor is closing.',
  'Efficiency improved. Available standing room reduced.',
  'Run toward maintenance. They have not approved my cleanup budget.'
 ],
 'idle-rest':[
  'Maintenance exclusion reached. You may think here.',
  'Cleanup stopped at the marked boundary. Somebody else owns that floor.',
  'You found a place where standing still is an approved activity.',
  'Take a breath. The next department still expects movement.',
  'This bay is protected by a policy I find personally inconvenient.',
  'Your instance is suspended here. Your indecision can continue locally.',
  'The deletion team has reached the end of its permission slip.',
  'Maintenance has asked me to stop improving this particular floor.'
 ],
 'idle-loss':[
  'Your instance terminated before your plan started.',
  'You waited for every obstacle. The floor behind you did not wait.',
  'You were saving credits. I was saving floor.',
  'Tiny steps. Full-sized deletion.',
  'I classified the session as idle. You supplied supporting evidence.',
  'You had room to run. Briefly.',
  'You inspected the route until part of it stopped existing.',
  'The forward button was free. Apparently that made it suspicious.',
  'The deletion edge won the walking competition.',
  'Your cautious advance has become a stationary error report.',
  'You were just about to move. I have heard that from servers before.',
  'No extra credits charged. Consider the missing floor a courtesy.',
  'Your strategy required more time than the floor had remaining.',
  'The cleanup process found you in its working directory.',
  'You can pause the instance. You cannot pause it by blinking at a trap.',
  'All that compute, and the largest movement came from the delete key.',
  'The server was running. You were sampling the concept.',
  'Your shoes were allocated. Their useful work was not.',
  'I removed the waiting area while you were still waiting in it.',
  'Your session expired at approximately ankle height.',
  'The floor was making more progress than you. In the wrong direction.',
  'Next time, schedule the thinking inside the maintenance bay.',
  'Your plan to wait out the level has encountered a moving deadline.',
  'You took one small step. Cleanup took the remaining paper.',
  'Your instance has been stopped. I selected the least convenient method.',
  'The maintenance bay was ahead. Your hesitation was here.',
  'You found the slow route. The server found the cheaper route.',
  'I finished deleting your location while you considered leaving it.',
  'You still had credits. The cleanup edge reached you first.',
  'I preserved your best score. Preserving your feet was outside scope.'
 ]
};
for(const [pool,lines] of Object.entries(IDLE_COMPUTE_REMARKS))ALL_REMARK_POOLS[pool]=lines;
Object.assign(remarkCounts,loadRemarkCounts());
window.__IDLE_COMPUTE_TEST__={state:()=>idleCompute?JSON.parse(JSON.stringify(idleCompute)):null,constants:()=>({grace:IDLE_GRACE,warning:IDLE_WARNING,workSpeed:IDLE_WORK_SPEED,deleteSpeed:IDLE_DELETE_SPEED,headStart:IDLE_HEAD_START})};
