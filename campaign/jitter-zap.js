// Short directional bursts, not key repeat or Jump, count as jitter.
// This random stream only selects the user-requested tap threshold, never trap geometry.
let jitterZap=null;
function resetJitterZap(){jitterZap={count:0,limit:9+Math.floor(Math.random()*5),held:0,gap:0,dir:0,until:0,zaps:0}}
function tickJitterZap(dt,z,protectedWait){
 const j=jitterZap;if(!j||!L.releaseCampaign)return;
 const dir=(keys.has('right')?1:0)-(keys.has('left')?1:0);
 if(protectedWait||!z||!['monitoring','warning'].includes(z.phase)){j.count=0;j.held=0;j.dir=0;j.gap=0;return}
 if(j.dir&&dir!==j.dir){
  if(j.held>0&&j.held<=.22){
   j.count++;
   if(j.count>=j.limit){
    j.count=0;j.limit=9+Math.floor(Math.random()*5);j.zaps++;j.until=sceneTime+.85;
    if(z.phase==='monitoring'){
     const debt=z.debt+4;z.debt=Math.min(IDLE_GRACE,debt);if(debt>=IDLE_GRACE/2)z.noticed=true;
     if(debt>=IDLE_GRACE){warnIdleZone(z);z.warning=Math.max(0,IDLE_WARNING-(debt-IDLE_GRACE))}
    }else z.warning=Math.max(0,z.warning-4);
    say(nextRemark('idle-jitter-zap'),'warn');announce('HELPFUL JOLT / −4 SECONDS');soundCue('warning');
   }
  }else j.count=0;
  j.held=0;j.gap=0;
 }
 if(dir){j.held+=dt;j.gap=0;if(j.held>.22)j.count=0}
 else {j.gap+=dt;if(j.gap>.8)j.count=0}
 j.dir=dir;
}
function drawJitterZap(){
 const j=jitterZap;if(!j||state!=='play'||sceneTime>=j.until)return;
 const eye=viewEye(),sx=eye.x+cameraX,sy=eye.y,tx=player.x+PW/2,ty=player.y+PH/2;
 const age=.85-(j.until-sceneTime),fade=Math.min(1,(j.until-sceneTime)/.25);
 ctx.save();ctx.globalAlpha=fade;
 // A continuous warm arc and paper sparks, without full-screen flashing or camera shake.
 for(const [width,color] of [[9,'#d5a54855'],[3,'#eed078'],[1,'#fff8df']]){
  ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(sx,sy);
  for(let i=1;i<=12;i++){const t=i/12,k=i===12?0:Math.sin(i*2.7+age*22)*12;ctx.lineTo(sx+(tx-sx)*t+k,sy+(ty-sy)*t-k)}ctx.stroke();
 }
 ctx.strokeStyle='#d5a548';ctx.lineWidth=2;
 for(let i=0;i<8;i++){const a=i*Math.PI/4+age,r=20+age*12;ctx.beginPath();ctx.moveTo(tx+Math.cos(a)*r,ty+Math.sin(a)*r);ctx.lineTo(tx+Math.cos(a)*(r+8),ty+Math.sin(a)*(r+8));ctx.stroke()}
 label('ZAP! −4s',tx,ty-34-age*18,14,'#956d30','center');ctx.restore();
}
ALL_REMARK_POOLS['idle-jitter-zap']=[
 'You seemed stuck. I have restarted your enthusiasm with electricity.',
 'Your legs were buffering. I cleared the cache with a small lightning bolt.',
 'I detected a walking problem and prescribed four seconds less time.',
 'You were moving one pixel at a time. I assumed your battery needed a jump.',
 'That twitch looked like a fault. Good news: I have added a second fault.',
 'I thought you had frozen. The shock confirms you are still available for work.',
 'Your movement resembled a loose cable. I tested the connection through you.',
 'You appeared to need encouragement. Mine comes in volts.',
 'I saw repeated tiny steps and opened a high-voltage support ticket.',
 'Have you tried turning the human off and on? I have started the procedure.',
 'Your walking signal was intermittent. Please accept this uninterrupted jolt.',
 'I mistook your careful tapping for distress. You may now experience distress.',
 'Your legs requested technical support. I skipped straight to the power supply.',
 'You looked hesitant. Electricity is famously decisive.',
 'I thought your controls were broken. Your startled expression says otherwise.',
 'You were stuttering across the floor. I supplied a full stop and some sparks.',
 'Your progress was arriving in crumbs. I have toasted them.',
 'I detected a low-energy human. This treatment also lowers your remaining time.',
 'A tiny step. Another tiny step. I diagnosed a need for dramatic assistance.',
 'You seemed to be testing the button. I tested your conductivity.',
 'Your movement failed my smoothness check. The complimentary shock passed.',
 'I assumed you were stuck in a loop. I inserted a lightning-shaped exception.',
 'You appeared to be having issues. I have made them easier to identify.',
 'My help desk offers two options: keep moving, or become briefly luminous.',
 'Jolt delivered. Four seconds deducted for the inconvenience of helping you.'
];
Object.assign(remarkCounts,loadRemarkCounts());
