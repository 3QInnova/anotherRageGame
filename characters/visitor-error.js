// Visitor Error: authored Canvas sprites. This module has no authority over physics.
const VISITOR_SPRITES={scale:4,columns:8,width:2048,height:784,animations:{idle:{y:0,w:32,h:44,frames:8,fps:6},run:{y:176,w:32,h:44,frames:8,fps:12},jump:{y:352,w:32,h:44,frames:3,fps:0},lose:{y:528,w:64,h:64,frames:8,fps:10}}};
let visitorAtlas=null,visitorMotion={idle:0,run:0,loss:null};
function visitorPath(c,points,fill=null,width=1){c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));if(fill){c.closePath();c.fillStyle=fill;c.fill()}c.lineWidth=width;c.stroke()}
function visitorLimb(c,points,width=2){c.strokeStyle='#293237';c.lineCap='round';c.lineJoin='round';visitorPath(c,points,null,width)}
function visitorShoe(c,x,y,angle=0){c.save();c.translate(x,y);c.rotate(angle);c.strokeStyle='#293237';visitorPath(c,[[-2,-2],[2,-2],[4,0],[4,1],[-3,1]],'#293237',.7);c.strokeStyle='#ddd6c4';visitorPath(c,[[-2,.4],[3,.4]],null,.5);c.restore()}
function visitorArm(c,points,bob=0){visitorLimb(c,points.map(([x,y])=>[x,y-bob]),2.2);const [x,y]=points.at(-1);c.fillStyle='#293237';c.beginPath();c.arc(x,y-bob,1.5,0,Math.PI*2);c.fill()}
function visitorPose(c,mode='idle',frame=0){
 const phase=frame*Math.PI/4,running=mode==='run',jumping=mode==='jump';
 const bob=running?Math.abs(Math.sin(phase*2))*.6:0,tap=mode==='idle'&&[2,5].includes(frame)?1.6:0;
 const stride=running?Math.sin(phase)*5:0,body=running?1:0;
 c.save();c.lineCap='round';c.lineJoin='round';
 // Authored silhouettes: opposing arm pumps, passing legs and airborne flailing.
 // The near arm is painted OVER the coat so the swing stays visible at game scale.
 let rearLeg=[[13,27],[11,33],[11,39]],nearLeg=[[20,27],[21,33],[21,39-tap]];
 let rearArm=[[11,17],[6,22],[8,26]],nearArm=[[21,17],[26,22],[24,26]];
 if(running){
  const legs=[
   [[[13,27],[10,33],[6,39]],[[20,27],[23,33],[26,39]]],
   [[[13,27],[9,32],[8,36]],[[20,27],[22,33],[24,39]]],
   [[[13,27],[12,31],[18,33]],[[20,27],[18,34],[17,39]]],
   [[[13,27],[19,31],[25,35]],[[20,27],[15,33],[10,39]]],
   [[[13,27],[20,32],[25,39]],[[20,27],[13,33],[6,39]]],
   [[[13,27],[21,33],[24,39]],[[20,27],[19,31],[12,35]]],
   [[[13,27],[17,34],[17,39]],[[20,27],[14,30],[8,33]]],
   [[[13,27],[12,33],[8,39]],[[20,27],[22,31],[26,35]]]
  ];
  const arms=[
   [[[11,17],[6,21],[3,17]],[[21,17],[25,22],[29,17]]],
   [[[11,17],[8,22],[6,24]],[[21,17],[24,23],[27,22]]],
   [[[11,17],[13,22],[15,25]],[[21,17],[21,23],[19,27]]],
   [[[11,17],[20,22],[26,18]],[[21,17],[15,22],[9,24]]],
   [[[11,17],[21,22],[29,15]],[[21,17],[13,23],[4,19]]],
   [[[11,17],[19,22],[26,21]],[[21,17],[15,23],[7,26]]],
   [[[11,17],[10,23],[12,26]],[[21,17],[20,24],[23,27]]],
   [[[11,17],[7,22],[4,24]],[[21,17],[25,23],[29,21]]]
  ];
  [rearLeg,nearLeg]=legs[frame%8];[rearArm,nearArm]=arms[frame%8];
 }else if(jumping){
  const poses=[
   {rearLeg:[[13,27],[8,30],[5,35]],nearLeg:[[20,27],[25,29],[27,33]],rearArm:[[11,17],[6,14],[3,8]],nearArm:[[21,17],[26,13],[29,7]]},
   {rearLeg:[[13,27],[8,28],[4.5,34]],nearLeg:[[20,27],[25,28],[27,34]],rearArm:[[11,17],[6,15],[2.7,12]],nearArm:[[21,17],[26,14],[29.3,11]]},
   {rearLeg:[[13,27],[10,31],[7,38]],nearLeg:[[20,27],[24,32],[26,39]],rearArm:[[11,17],[5,17],[3,22]],nearArm:[[21,17],[27,17],[29,21]]}
  ];
  ({rearLeg,nearLeg,rearArm,nearArm}=poses[frame]);
 }
 visitorArm(c,rearArm,bob);
 visitorLimb(c,rearLeg.map(([x,y],i)=>[x,y-(i<2?bob:0)]),2.5);
 visitorLimb(c,nearLeg.map(([x,y],i)=>[x,y-(i<2?bob:0)]),2.5);
 const leftFoot=rearLeg.at(-1),rightFoot=nearLeg.at(-1);
 visitorShoe(c,...leftFoot,jumping?-.22:running&&leftFoot[1]<39?-.3:0);visitorShoe(c,...rightFoot,tap?-.35:jumping?.2:running&&rightFoot[1]<39?.3:0);
 c.strokeStyle='#293237';const flutter=running?Math.sin(phase)*1.3:jumping?1.2:0;
 visitorPath(c,[[9+body,15-bob],[14,16-bob],[21+body,14-bob],[24,16-bob],[23,25-bob],[25+flutter,30-bob],[20,28-bob],[18,31-bob],[15,29-bob],[9,31-bob],[10,26-bob],[8,17-bob]],'#f8f0dc',.85);
 visitorPath(c,[[10,16-bob],[15,19-bob],[13,28-bob]],null,.55);
 visitorPath(c,[[22,15-bob],[18,20-bob],[19,28-bob]],null,.55);
 c.strokeStyle='#a8a294';visitorPath(c,[[11,22-bob],[12,24-bob]],null,.4);visitorPath(c,[[20,26-bob],[21,25-bob]],null,.4);
 // A gold lanyard and actual photo silhouette remain recognizable without tiny text.
 c.strokeStyle='#b98029';visitorPath(c,[[13,16-bob],[16+stride*.12,25-bob],[20,16-bob]],null,1);
 c.fillStyle='#e2b453';c.fillRect(15+stride*.12,24-bob,3,4);c.strokeStyle='#735a37';c.lineWidth=.45;c.strokeRect(15+stride*.12,24-bob,3,4);
 c.fillStyle='#fffbec';c.fillRect(19,21-bob,4,6);c.strokeStyle='#8b8b80';c.strokeRect(19,21-bob,4,6);c.fillStyle='#52605e';c.beginPath();c.arc(21,23-bob,.75,0,Math.PI*2);c.fill();c.fillRect(20,24-bob,2,1.6);
 visitorArm(c,nearArm,bob);
 c.fillStyle='#f4dfb8';c.strokeStyle='#293237';c.lineWidth=.9;
 c.beginPath();c.ellipse(16+body,9-bob,6.5,6.1,-.12,0,Math.PI*2);c.fill();c.stroke();
 c.beginPath();c.arc(10+body,10-bob,1.4,1.3,4.5);c.fill();c.stroke();
 visitorLimb(c,[[13+body,4-bob],[16+body,1.5-bob],[18+body,1-bob]],.9);
 visitorLimb(c,[[15+body,4-bob],[19+body,2.7-bob],[21+body,2.7-bob]],.9);
 // The censor strip covers one eye, not the whole face. The exposed eye can blink.
 c.save();c.translate(14+body,10-bob);c.rotate(-.12);c.fillStyle='#293237';c.fillRect(-5,-1,9,2.7);c.restore();
 visitorLimb(c,[[19+body,7.2-bob],[21+body,6-bob]],.9);
 if(mode==='idle'&&frame===7)visitorLimb(c,[[20+body,9-bob],[21.2+body,9-bob]],.7);
 else{c.fillStyle='#293237';c.beginPath();c.ellipse(20.5+body,9-bob,.65,1.2,-.2,0,Math.PI*2);c.fill()}
 visitorLimb(c,[[18+body,13-bob],[20+body,12.7-bob]],.6);c.restore();
}
function visitorBytes(c,frame){
 const t=frame/7;
 if(frame<2){c.save();c.globalAlpha=1-frame*.65;c.translate(16,11);visitorPose(c,'jump',1);c.restore()}
 // Fixed offsets keep cosmetic playback reproducible and separate from gameplay seeds.
 for(let i=0;i<26;i++){
  const a=i*2.39996323,r=(8+(i%5)*3)*t,x=32+(i%5-2)*2+Math.cos(a)*r,y=31+(Math.floor(i/5)-2.5)*3+Math.sin(a)*r-9*t+11*t*t;
  c.save();c.translate(x,y);c.rotate((i%3-1)*t*1.3);c.globalAlpha=(frame===0?.35:1)*Math.max(0,1-t*.84);
  c.fillStyle=i%4===0?'#b98029':i%3===0?'#248c95':'#293237';
  if(i%3===0){c.font='bold 4px monospace';c.textAlign='center';c.fillText(['0','1','FF','01'][i%4],0,0)}
  else c.fillRect(-1,-1,1.4+(i%2),1.4+(i%2));c.restore();
 }
}
function visitorPaintFrame(c,mode,frame){if(mode==='lose')visitorBytes(c,frame);else visitorPose(c,mode,frame)}
function getVisitorAtlas(){
 if(visitorAtlas)return visitorAtlas;
 if(typeof document.createElement!=='function')return null;
 const a=document.createElement('canvas');a.width=VISITOR_SPRITES.width;a.height=VISITOR_SPRITES.height;const c=a.getContext('2d');if(!c)return null;
 for(const [mode,row] of Object.entries(VISITOR_SPRITES.animations))for(let frame=0;frame<row.frames;frame++){c.save();c.translate(frame*row.w*4,row.y);c.scale(4,4);visitorPaintFrame(c,mode,frame);c.restore()}
 visitorAtlas=a;return a;
}
function paintVisitor(c,mode,frame,x,y,facing=1){
 const row=VISITOR_SPRITES.animations[mode];frame=Math.max(0,Math.min(row.frames-1,frame|0));c.save();c.translate(x,y);if(facing<0){c.translate(row.w,0);c.scale(-1,1)}
 const atlas=getVisitorAtlas();if(atlas)c.drawImage(atlas,frame*row.w*4,row.y,row.w*4,row.h*4,0,0,row.w,row.h);else visitorPaintFrame(c,mode,frame);c.restore();
}
function resetVisitor(){visitorMotion={idle:0,run:0,loss:null}}
function loseVisitor(){const top=visibleWorldTop(),bottom=Math.min(FLOOR+8,top+visibleWorldHeight()-32);visitorMotion.loss={x:player.x+PW/2,y:Math.max(top+32,Math.min(bottom,player.y+PH/2)),facing:player.facing,time:0}}
function advanceVisitor(dt){
 if(state==='dead'){if(visitorMotion.loss)visitorMotion.loss.time+=dt;return}
 if(state!=='play')return;
 if(player.grounded&&Math.abs(player.vx)<1)visitorMotion.idle+=dt;else visitorMotion.idle=0;
 if(player.grounded&&Math.abs(player.vx)>1)visitorMotion.run+=dt*12*Math.max(.7,Math.abs(player.vx)/265);
}
function visitorFrame(){
 if(state==='dead')return {mode:'lose',frame:Math.min(7,Math.floor((visitorMotion.loss?.time??0)*10))};
 if(!player.grounded)return {mode:'jump',frame:player.vy< -100?0:player.vy>100?2:1};
 if(Math.abs(player.vx)>1)return {mode:'run',frame:Math.floor(visitorMotion.run)%8};
 return {mode:'idle',frame:visitorMotion.idle<1.2?0:Math.floor((visitorMotion.idle-1.2)*6)%8};
}
function drawVisitorPlayer(){
 // The world burst plays before the loss card; do not repeat it inside the card.
 const card=$('visitorLossCanvas');if(card)card.hidden=true;
 if(state==='dead'){const loss=visitorMotion.loss;if(loss&&loss.time<.8)paintVisitor(ctx,'lose',Math.floor(loss.time*10),loss.x-32,loss.y-32,loss.facing);return}
 const {mode,frame}=visitorFrame();paintVisitor(ctx,mode,frame,player.x-4,player.y+PH-40,player.facing);
 // Honest tracking corners remain independent of the character's moving paper clothes.
 ctx.save();ctx.strokeStyle=CYAN;ctx.lineWidth=1;for(const [x,y,dx,dy] of [[-3,-3,1,1],[PW+3,-3,-1,1],[-3,PH+3,1,-1],[PW+3,PH+3,-1,-1]])visitorPath(ctx,[[player.x+x+dx*4,player.y+y],[player.x+x,player.y+y],[player.x+x,player.y+y+dy*4]]);ctx.restore();
}
function installVisitorArt(){
 for(const img of document.querySelectorAll('[data-visitor-hero]'))img.src=VISITOR_HERO_SRC;
 window.__VISITOR_ART__={manifest:()=>JSON.parse(JSON.stringify(VISITOR_SPRITES)),state:()=>({...visitorFrame(),idleTime:visitorMotion.idle,lossTime:visitorMotion.loss?.time??null}),atlas:getVisitorAtlas,paint:paintVisitor};
}
