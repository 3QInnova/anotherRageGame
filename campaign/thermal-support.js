// Rotatable logic ICs on an authored backplane. Boolean evaluation drives every trace.
const COOLING_SHOCK_DELAY=.65,COOLING_GATE_TYPES=['OR','XOR','NOR','AND','NAND','XNOR','XOR','NOR','OR','NAND'];
const COOLING_GATE_TAPS={
 OR:[[0,0],[1,0],[0,'P'],[0,'!P']],XOR:[[0,0],[0,'P'],[1,'P'],[0,'P']],
 NOR:[[1,'P'],[0,'!P'],[0,'P'],[0,'!P']],AND:[[1,'P'],[1,'P'],[0,'P'],[1,'!P']],
 NAND:[[1,1],[0,'P'],[1,'!P'],[1,'P']],XNOR:[[1,'P'],[1,'P'],[0,'P'],[0,1]]
};
const COOLING_GATE_RULES={OR:'1 if either input is 1',XOR:'1 if the inputs differ',NOR:'1 only if both inputs are 0',AND:'1 only if both inputs are 1',NAND:'0 only if both inputs are 1',XNOR:'1 if the inputs match'};
function coolingGate(type,a,b){return type==='OR'?a||b:type==='XOR'?a!==b:type==='NOR'?!(a||b):type==='AND'?a&&b:type==='NAND'?!(a&&b):a===b}
function coolingBoard(count){
 const cols=count===10?5:3,initials={OR:0,XOR:0,NOR:0,AND:2,NAND:0,XNOR:3};
 return {cols,rows:Math.ceil(count/cols),cells:COOLING_GATE_TYPES.slice(0,count).map((type,i)=>({type,col:i%cols,row:Math.floor(i/cols),offset:i%4,initial:(initials[type]-i%4+4)%4,groundRotation:(1-i%4+4)%4,taps:COOLING_GATE_TAPS[type].map(pair=>[...pair])}))};
}
function coolingRoute(board,rotations){
 let previous=true;const values=[],live=[],grounds=[];
 for(const [i,c] of board.cells.entries()){
  const turn=(rotations[i]+c.offset)%4,[aSource,bSource]=c.taps[turn],read=s=>s==='P'?previous:s==='!P'?!previous:!!s;
  const a=read(aSource),b=read(bSource),out=coolingGate(c.type,a,b),ground=rotations[i]===c.groundRotation,enable=out&&!ground;
  values.push({type:c.type,a,b,aSource,bSource,out,ground,enable});if(out)live.push(i);if(ground&&out)grounds.push(i);previous=enable;
 }
 return {values,live,grounds,fan:values.every(g=>g.enable),grounded:grounds.length>0};
}
const COOLING_LEVEL={
 title:'THERMAL SUPPORT TICKET',serverId:'thermal-support',centerId:'localhost',centerNumber:1,serverNumber:'FAN',campaignServer:true,coolingTrial:true,
 start:55,exit:3580,width:3710,longSession:true,quietAdvisories:true,sectionLabel:'FACILITIES / THERMAL SUPPORT',remarkPool:'cooling-background',
 pits:[],crumble:[],spikes:[],blocks:[],forecasts:[],anomalies:[],secretPads:[],floorHints:[],autocompleteHints:[],fake:null,
 stations:[350,1450,2550].map((x,i)=>({id:'fan-'+i,x,w:240,y:FLOOR-80,count:[3,6,10][i],sink:{x:x+300,y:FLOOR-80,w:300,h:80}})),
 creditMoves:[270,1370,2470],returnPoints:[55,1040,2140,3240],
 idleCompute:{zones:[{start:10,end:3440}],bays:[{start:3440,end:3710}]},
 intro:'Thermal Support Ticket. Jump onto a switch deck. 1: Tap a labeled logic gate to select it. 2: Press ROTATE or X to turn that gate. Get every fan-enable output to 1. A live output connected to GND electrifies your platform. Cleanup and action costs pause here; the breeze does not.',
 incidentCard:{job:'Thermal Support Ticket',trouble:'Facilities rotated the logic ICs into the wrong backplane contacts and wired a ground-fault rail into your platform.',notice:'Each component is a real OR, XOR, NOR, AND, NAND or XNOR gate with two input levels and a computed output. Gold brackets identify the selected gate.',remember:'Select first, rotate second. Three stations contain 3, 6 and 10 gates. A high output into GND shocks the deck.',counterplay:'Tap a gate on the paper or its labeled control to select it. ROTATE U# or X rotates only that gate. Numbers 1–9 and 0 select gates. The inspector shows the actual inputs, gate rule, output and next rotation. Match the input levels to the gate rule so every EN output is 1. P means the preceding enable signal; !P is its inverse. Never drive a 1 into GND. Keep balancing, then cross only after SAFE TO CROSS.',excuse:'Facilities says the original fan direction was an employee ventilation feature.',failures:['The fan was cooling the wrong component. You were not that component.','Your maintenance request now includes a human-shaped scorch mark.','Facilities has blamed the person standing near the wiring.']}
};
let cooling=null;
function resetCooling(){puzzleBoxOpenId=null;if(hasPuzzleBoxes()){cooling=resetPuzzleBoxCooling();return}cooling=L.coolingTrial?L.stations.map(s=>{const board=coolingBoard(s.count),rotations=board.cells.map(c=>c.initial);return {...s,sink:{...s.sink},board,rotations,route:coolingRoute(board,rotations),groundTime:0,temperature:1,solved:false,occupied:false,selected:-1,flips:0,resets:0,time:0,quip:'Tap a labeled gate to SELECT it. Then ROTATE that gate. Selection alone changes nothing.'}}):null}
function coolingProtectedStation(){
 if(!cooling||state!=='play')return null;
 const feet=player.y+PH,cx=player.x+PW/2;
 return cooling.find(s=>cx>s.x+2&&cx<s.x+s.w-2&&feet<=s.y+6&&feet>=s.y-240)??null;
}
function coolingCanEdit(){return !campaignMenuOpen&&!(typeof mobilePaused!=='undefined'&&mobilePaused)}
function coolingSpeak(s,pool,mode=''){s.quip=nextRemark(pool);say(s.quip,mode)}
function coolingSelect(index){
 const s=coolingProtectedStation();if(!s||!coolingCanEdit()||!Number.isInteger(index)||index<0||index>=s.count)return false;
 s.selected=index;refreshHud();return true;
}
function coolingFlip(index){
 const s=coolingProtectedStation();if(!s||s.solved||!coolingCanEdit()||index!==s.selected||index<0||index>=s.count)return false;
 s.rotations[index]=(s.rotations[index]+1)%4;s.route=coolingRoute(s.board,s.rotations);if(!s.route.grounded)s.groundTime=0;s.flips++;
 soundCue('rewrite');if(s.route.grounded){s.quip='GROUND FAULT. A gate is driving 1 into GND. Rotate that output clear.';announce('GROUND FAULT / DECK ENERGIZING')}else if(s.flips%3===1)coolingSpeak(s,'cooling-switch');refreshHud();return true;
}
function coolingUseSwitch(){if(hasPuzzleBoxes())return puzzleUseBox();const s=coolingProtectedStation();if(!s)return false;if(s.selected<0){s.quip='Select a labeled gate first. ROTATE will name the gate it turns.';refreshCooling()}else coolingFlip(s.selected);return true}
function coolingNumberKey(code){if(hasPuzzleBoxes())return puzzleNumberKey(code);if(!/^Digit[0-9]$/.test(code)||!coolingProtectedStation())return false;coolingSelect((Number(code.slice(-1))+9)%10);return true}
function coolingWind(){const s=coolingProtectedStation();return !s?0:s.solved?-10:-36}
function advanceCooling(dt){
 if(!cooling)return;if(hasPuzzleBoxes()){advancePuzzleBox(dt);return}
 for(const s of cooling){
  s.time+=dt;if(s.solved)continue;
  if(s.route.grounded&&coolingProtectedStation()===s){
   s.groundTime+=dt;
   if(s.groundTime>=COOLING_SHOCK_DELAY-1e-8){die('GROUND FAULT: A logic gate drove a high output into the ground bus. The platform under your feet electrocuted you.','cooling-shock');return}
  }else s.groundTime=0;
  const reverse=s.route.fan&&!s.route.grounded;
  s.temperature=Math.max(0,Math.min(1,s.temperature+(reverse?-.32:.55)*dt));
  if(reverse&&s.temperature<=.2+1e-8){s.solved=true;s.temperature=0;coolingSpeak(s,'cooling-safe');soundCue('confirm');announce('HEAT SINK COOLED / SAFE TO CROSS')}
 }
}
function coolingSolids(){return cooling?cooling.flatMap(s=>[{x:s.x,y:s.y,w:s.w,h:16},s.sink]):[]}
function hitCoolingSides(oldX){
 for(const g of coolingSolids()){
  if(player.y+PH<=g.y+.001||player.y>=g.y+g.h-.001)continue;
  if(player.vx>0&&oldX+PW<=g.x+.001&&player.x+PW>g.x)player.x=g.x-PW;
  else if(player.vx<0&&oldX>=g.x+g.w-.001&&player.x<g.x+g.w)player.x=g.x+g.w;
 }
}
function landOnCooling(oldY){
 let support=null,ceiling=null;
 for(const g of coolingSolids()){
  if(player.x+PW<=g.x+.001||player.x>=g.x+g.w-.001)continue;
  if(player.vy>=0&&oldY+PH<=g.y+.001&&player.y+PH>=g.y&&(!support||g.y<support.y))support=g;
  if(player.vy<0&&oldY>=g.y+g.h-.001&&player.y<=g.y+g.h&&(!ceiling||g.y+g.h>ceiling.y+ceiling.h))ceiling=g;
 }
 if(support){player.y=support.y-PH;player.vy=0;return true}
 if(ceiling){player.y=ceiling.y+ceiling.h;player.vy=Math.max(0,player.vy)}return false;
}
function checkCooling(){
 if(!cooling)return;
 const occupied=coolingProtectedStation();
 for(const s of cooling){
  if(!s.solved&&overlap({x:player.x-1,y:player.y-1,w:PW+2,h:PH+2},s.sink)){die('THERMAL FAILURE: The heat sink is still hot. Reverse the fan and wait for SAFE TO CROSS.','cooling-burn');return}
  if(s.occupied&&occupied!==s&&!s.solved){
   if(hasPuzzleBoxes()){resetPuzzleBoxStation(s);s.resets++;coolingSpeak(s,'puzzle-reset','warn');s.occupied=false;continue}
   s.rotations=s.board.cells.map(c=>c.initial);s.route=coolingRoute(s.board,s.rotations);s.groundTime=0;s.temperature=1;s.selected=-1;s.resets++;
   coolingSpeak(s,'cooling-reset','warn');announce('SWITCH DECK VACATED / CIRCUIT RESET');
  }
  if(!s.occupied&&occupied===s&&!s.solved)coolingSpeak(s,hasPuzzleBoxes()?'puzzle-enter':'cooling-enter');
  s.occupied=occupied===s;
  if(hasPuzzleBoxes()&&s.occupied&&!s.viewed&&!s.solved&&player.grounded)puzzleOpen(s);
 }
}
function startCoolingTest(){
 if(campaignBlocked())return false;
 selectLevelCollection(true);LEVELS=[COOLING_LEVEL];COMPACT_POINTS=[COOLING_LEVEL.returnPoints];GLASS_TEST_INDEX=1;
 initRoom(true);campaignPractice=true;practiceMode=true;practiceRoom=0;closeCampaignMenu(true);refreshHud();
 if(typeof mobilePaused==='undefined')$('stage')?.scrollIntoView?.({block:'center'});return true;
}
function coolingGateShape(type){
 return ['OR','NOR','XOR','XNOR'].includes(type)?'M18 12 Q38 10 47 24 Q38 38 18 36 Q25 24 18 12':'M21 12 H34 C51 12 51 36 34 36 H21 Z';
}
function coolingTileSvg(s,index){
 const c=s.board.cells[index],g=s.route.values[index],rot=s.rotations[index],bubble=['NOR','NAND','XNOR'].includes(c.type),xor=['XOR','XNOR'].includes(c.type),color=v=>v?'#3c947e':'#a4aca0',q=g.ground&&g.out?'#cf5861':color(g.out),pads=[[62,24],[32,46],[2,24],[32,2]],ground=pads[c.groundRotation];
 return `<svg viewBox="0 0 64 48" aria-hidden="true"><circle cx="${ground[0]}" cy="${ground[1]}" r="2" class="ground-pad"/><text x="${ground[0]}" y="${Math.min(46,ground[1]+7)}" class="ground-letter">G</text><g transform="rotate(${rot*90} 32 24)"><path d="M3 18 H21" stroke="${color(g.a)}" class="gate-pin"/><path d="M3 30 H21" stroke="${color(g.b)}" class="gate-pin"/><path d="M47 24 H61" stroke="${q}" class="gate-pin"/>${g.out?'<path d="M47 24 H61" class="wire-pulse"/>':''}<path d="${coolingGateShape(c.type)}" class="gate-body"/>${xor?'<path d="M14 12 Q22 24 14 36" class="gate-outline"/>':''}${bubble?'<circle cx="49" cy="24" r="3" class="gate-bubble"/>':''}</g></svg>`;
}
function coolingPreview(s){const rotations=[...s.rotations];rotations[s.selected]=(rotations[s.selected]+1)%4;return coolingRoute(s.board,rotations)}
function refreshCooling(){
 refreshPuzzleBox();if(hasPuzzleBoxes()){$('coolingPanel').hidden=true;return}
 const panel=$('coolingPanel');if(!panel)return;const s=coolingProtectedStation();
 panel.hidden=!s||campaignMenuOpen||(typeof mobilePaused!=='undefined'&&mobilePaused);if(!s)return;
 const picked=s.selected>=0,g=picked?s.route.values[s.selected]:null,n=s.route.values.filter(v=>v.enable).length;
 $('coolingTitle').textContent=s.solved?'SAFE TO CROSS · FAN ENABLED':'SELECT A LOGIC GATE';
 $('coolingDetail').textContent=s.route.grounded?'GROUND FAULT · '+s.route.grounds.map(i=>'U'+(i+1)).join(', '):picked?'U'+(s.selected+1)+' '+g.type+' SELECTED':`FAN ENABLES ${n}/${s.count} · TAP A GATE`;
 $('coolingQuip').textContent=s.quip;if(panel.dataset)panel.dataset.grounded=String(s.route.grounded);panel.style.setProperty?.('--power-phase',String((s.time*28)%18));
 $('coolingBoard').style.gridTemplateColumns=`repeat(${s.board.cols},44px)`;
 for(let i=0;i<10;i++){
  const b=$('coolingGate'+i),cell=s.board.cells[i];b.hidden=!cell;if(!cell)continue;
  const v=s.route.values[i],selected=s.selected===i,key=s.id+'/'+s.rotations[i]+'/'+Number(v.a)+Number(v.b)+Number(v.out);
  if(b.dataset?.gate!==key){b.innerHTML=`<span class="gate-name">U${i+1} ${cell.type}</span>`+coolingTileSvg(s,i);if(b.dataset)b.dataset.gate=key}
  b.style.gridColumn=String(cell.col+1);b.style.gridRow=String(cell.row+1);b.disabled=false;b.setAttribute?.('aria-pressed',String(selected));b.setAttribute?.('aria-label',`Select gate U${i+1} ${cell.type}, input A ${Number(v.a)}, input B ${Number(v.b)}, output ${Number(v.out)}, ${v.ground?'ground':'fan enable'}${selected?', selected':''}`);
  if(b.dataset){b.dataset.selected=String(selected);b.dataset.live=String(v.enable);b.dataset.fault=String(v.ground&&v.out)}
 }
 $('coolingRotate').disabled=!picked||s.solved;
 $('coolingRotate').textContent=!picked?'SELECT GATE\nTHEN ROTATE':s.solved?'FAN READY':'ROTATE U'+(s.selected+1)+' ↻';
 $('coolingRotate').setAttribute?.('aria-label',picked?'Rotate selected gate U'+(s.selected+1)+' '+g.type+' clockwise':'Select a gate before rotating');
 $('coolingSelected').textContent=picked?'U'+(s.selected+1)+' · '+g.type:'NO GATE SELECTED';
 $('coolingValues').textContent=picked?`A ${Number(g.a)} · B ${Number(g.b)} → Q ${Number(g.out)} / ${g.ground?'GND':'EN'}`:'Tap a labeled U# gate.';
 $('coolingRule').textContent=picked?g.type+': '+COOLING_GATE_RULES[g.type]:'Tap = select. Rotate = turn.';
 if(s.solved)$('coolingNext').textContent='Fan latched · circuit locked';else if(picked){const preview=coolingPreview(s),v=preview.values[s.selected];$('coolingNext').textContent=preview.grounded?'Next: GROUND FAULT '+preview.grounds.map(i=>'U'+(i+1)).join(', '):`Next: ${Number(v.a)},${Number(v.b)} → ${Number(v.out)} / ${v.ground?'GND':'EN'}`}else $('coolingNext').textContent='X rotates. Numbers select.';
 $('coolingGround').textContent=s.route.grounded?'ϟ HIGH OUTPUT → GND / DECK LIVE':'VCC: 1 · GND: 0 · EN: FAN ENABLE';
}
function coolingGateRect(s,i){const c=s.board.cells[i];return {x:s.x-20+c.col*64,y:s.y-185+c.row*64,w:50,h:50}}
function installCoolingUI(){
 $('stage')?.appendChild?.($('coolingPanel'));
 for(let i=0;i<10;i++)$('coolingGate'+i).onclick=()=>coolingSelect(i);
 $('coolingRotate').onclick=coolingUseSwitch;$('campaignCooling').onclick=startCoolingTest;
 canvas.addEventListener?.('pointerdown',e=>{
  const s=coolingProtectedStation();if(hasPuzzleBoxes()||!s||!coolingCanEdit())return;
  const bounds=canvas.getBoundingClientRect(),width=typeof mobileView==='undefined'?W:mobileView.width,height=typeof mobileView==='undefined'?H:mobileView.height,top=typeof mobileView==='undefined'?0:mobileView.top,scale=bounds.height/height;
  const x=cameraX+(e.clientX-bounds.left)*width/bounds.width,y=top+(e.clientY-bounds.top)/scale;
  const hit=s.board.cells.findIndex((_,i)=>{const r=coolingGateRect(s,i),pad=Math.max(0,(44/scale-r.w)/2);return x>=r.x-pad&&x<=r.x+r.w+pad&&y>=r.y-pad&&y<=r.y+r.h+pad});
  if(hit>=0){e.preventDefault();coolingSelect(hit)}
 });
}
function drawCoolingGate(s,index,r){
 const c=s.board.cells[index],g=s.route.values[index],selected=s.selected===index,color=v=>v?MINT:'#a4aca0';
 card(r.x,r.y,r.w,r.h,selected?'#f4e1a7':'#f4f0e2',selected?'#a36f25':'#7e8f82');
 label('U'+(index+1)+' '+c.type,r.x+r.w/2,r.y+9,8,INK,'center');
 ctx.save();ctx.translate(r.x+r.w/2,r.y+28);ctx.rotate(s.rotations[index]*Math.PI/2);ctx.scale(.75,.75);ctx.translate(-32,-24);
 for(const [v,y] of [[g.a,18],[g.b,30]]){ctx.beginPath();ctx.moveTo(3,y);ctx.lineTo(21,y);ctx.strokeStyle=color(v);ctx.lineWidth=2;ctx.stroke()}
 ctx.beginPath();ctx.moveTo(47,24);ctx.lineTo(61,24);ctx.strokeStyle=g.ground&&g.out?RED:color(g.out);ctx.lineWidth=2;ctx.stroke();
 if(g.out){ctx.setLineDash([2,8]);ctx.lineDashOffset=-s.time*24;ctx.strokeStyle='#e7c56d';ctx.stroke();ctx.setLineDash([]);ctx.lineDashOffset=0}
 ctx.beginPath();const or=['OR','NOR','XOR','XNOR'].includes(c.type);ctx.moveTo(or?18:21,12);
 if(or){ctx.quadraticCurveTo(38,10,47,24);ctx.quadraticCurveTo(38,38,18,36);ctx.quadraticCurveTo(25,24,18,12)}else{ctx.lineTo(34,12);ctx.bezierCurveTo(51,12,51,36,34,36);ctx.lineTo(21,36);ctx.closePath()}
 ctx.fillStyle=PAPER;ctx.fill();ctx.strokeStyle=INK;ctx.lineWidth=1.5;ctx.stroke();
 if(['XOR','XNOR'].includes(c.type)){ctx.beginPath();ctx.moveTo(14,12);ctx.quadraticCurveTo(22,24,14,36);ctx.stroke()}
 if(['NOR','NAND','XNOR'].includes(c.type)){ctx.beginPath();ctx.arc(49,24,3,0,Math.PI*2);ctx.fill();ctx.stroke()}
 ctx.restore();label(`${Number(g.a)} ${Number(g.b)} → ${Number(g.out)} ${g.ground?'G':'EN'}`,r.x+r.w/2,r.y+46,7,g.ground&&g.out?RED:INK,'center');
 if(selected){stroke(r.x-3,r.y-3,r.w+6,r.h+6,'#a36f25',2);label('SELECTED',r.x+r.w/2,r.y-5,7,'#8c5e20','center')}
}
function drawCooling(){
 if(!cooling)return;if(hasPuzzleBoxes()){drawPuzzleBoxWorld();return}const width=typeof mobileView==='undefined'?W:mobileView.width;
 for(const [index,s] of cooling.entries()){
  if(s.x+s.sink.w+350<cameraX||s.x>cameraX+width)continue;
  const reverse=s.route.fan&&!s.route.grounded,danger=s.route.grounded,color=danger?RED:s.solved?MINT:GOLD;
  card(s.x,s.y,s.w,16,danger?'#e7b9a0':'#d9e7db',danger?RED:'#426d65');
  for(let x=s.x+15;x<s.x+s.w;x+=40)dotline(x,s.y+17,x,FLOOR,'#9cac9d');
  label(`CIRCUIT ${index+1} / ${s.count} LOGIC GATES`,s.x+s.w/2,s.y+56,9,'#426d65','center');
  label(danger?'GROUND LIVE · REWIRE IN '+Math.max(0,COOLING_SHOCK_DELAY-s.groundTime).toFixed(1)+'s':'CLEANUP PAUSED · ACTIONS FREE',s.x+s.w/2,s.y+38,9,danger?RED:'#426d65','center');
  const first=coolingGateRect(s,0),busY=first.y+s.board.rows*64+3;
  label('VCC 1 / LOGIC BACKPLANE',first.x,first.y-17,9,'#426d65');dotline(first.x,first.y-10,first.x+s.board.cols*64-14,first.y-10,MINT);
  for(const [i,c] of s.board.cells.entries()){
   const r=coolingGateRect(s,i),g=s.route.values[i];drawCoolingGate(s,i,r);
   if(i+1<s.count){const next=coolingGateRect(s,i+1),trace=g.enable?MINT:'#b1b8a6';if(next.y===r.y)dotline(r.x+r.w,r.y+25,next.x,next.y+25,trace);else{const wireY=r.y+r.h+7;dotline(r.x+r.w,r.y+25,r.x+r.w+6,r.y+25,trace);dotline(r.x+r.w+6,r.y+25,r.x+r.w+6,wireY,trace);dotline(r.x+r.w+6,wireY,next.x-6,wireY,trace);dotline(next.x-6,wireY,next.x-6,next.y+25,trace);dotline(next.x-6,next.y+25,next.x,next.y+25,trace)}}
   dotline(r.x+25,r.y+r.h,r.x+25,busY,s.route.grounds.includes(i)?RED:'#b6b6a1');
  }
  dotline(first.x,busY,first.x+s.board.cols*64-14,busY,danger?RED:'#989e8b');label('GND / PLATFORM',first.x+s.board.cols*64-9,busY+3,8,danger?RED:'#737e70');
  dotline(first.x+8,busY,first.x+8,s.y+3,danger?RED:'#a5aa97');dotline(s.x+4,s.y+4,s.x+s.w-4,s.y+4,danger?RED:'#879b87');
  const fanX=s.x+s.w+26,fanY=s.y-46;dotline(first.x+s.board.cols*64-14,first.y-10,fanX,fanY-22,reverse?MINT:'#a5aa97');label('FAN DRIVER / ALL EN = 1',fanX-25,fanY-31,8,MINT,'center');
  ctx.save();ctx.translate(fanX,fanY);stroke(-22,-22,44,44,'#426d65');ctx.rotate(s.time*(reverse?7:-7));
  for(let blade=0;blade<4;blade++){ctx.rotate(Math.PI/2);ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(23,-14,16,13);ctx.lineTo(0,0);ctx.fillStyle=reverse?MINT:'#b59456';ctx.fill()}
  ctx.restore();label(reverse?'AIR → HEAT SINK':'← WRONG WAY',fanX,s.y+25,8,color,'center');
  const h=s.sink,hot=!s.solved;rect(h.x,h.y,h.w,h.h,hot?'#d8bd93':'#c4dfd2');stroke(h.x,h.y,h.w,h.h,hot?'#ad6c3d':'#426d65');
  for(let x=h.x+8;x<h.x+h.w;x+=17){rect(x,h.y+5,6,h.h-10,hot?'#af8050':'#80ac9a');dotline(x+6,h.y+4,x+6,h.y+h.h-5,hot?'#e5cfa8':'#e8eee0')}
  label(hot?'HOT · '+Math.ceil(s.temperature*100)+'%':'COOLED · SAFE',h.x+h.w/2,h.y-13,12,hot?'#a85f35':'#426d65','center');
  for(let i=0;i<7;i++){const x=hot?h.x+15+i*40:fanX+35+i*40,y=h.y-32+(hot?Math.sin(s.time*3+i)*8:0);dotline(x,y,x+(hot?3:18),y-(hot?17:0),hot?'#bd8d55':'#5f9e88')}
  if(danger)for(let i=0;i<7;i++){const x=s.x+12+i*34,y=s.y-9-Math.sin(s.time*32+i)*6;ctx.beginPath();ctx.moveTo(x,s.y+3);ctx.lineTo(x+7,y);ctx.lineTo(x+11,s.y-2);ctx.lineTo(x+16,y-7);ctx.strokeStyle=i%2?RED:'#e8c560';ctx.lineWidth=2;ctx.stroke()}
 }
}
const COOLING_VOICE={
 'cooling-shock':[
  'You routed power to ground. Ground was wearing your shoes.',
  'Congratulations. You are now the shortest path in the circuit.',
  'The fan requested power. You personally signed for it.',
  'That was a ground bus. You boarded it with both feet.',
  'The platform is grounded. The employee is briefly illuminated.',
  'You found a shortcut. The electricity found a shorter one.',
  'Your shoes have failed their electrical interview.',
  'I labelled it GROUND. You supplied the current occupant.',
  'The circuit is complete. Your participation was excessive.',
  'Power reached the platform. Facilities has recorded successful delivery.',
  'You have become a very expensive status light.',
  'The fan was optional. Apparently the human was conductive.',
  'You gave the platform power. It gave you feedback.',
  'That spark was your support ticket receiving a response.',
  'Your feet requested a live demonstration. Request fulfilled.',
  'The ground connection worked. The standing arrangement did not.',
  'You routed the power correctly to the wrong employee.',
  'The safety diagram did show somebody standing there. Poor choice of model.',
  'Facilities has replaced the fuse with your optimism.',
  'The deck was free. The electrical feedback was also free.',
  'You were supposed to cool the hardware, not light the technician.',
  'One high output into ground. One full incident report.',
  'The electricity followed your instructions. Awkward precedent.',
  'You are now the component marked DO NOT TOUCH.',
  'Your wiring has received a glowing employee review.',
  'The power line reached your platform. The platform reached your ankles.',
  'You connected the ground bus and became its onboard entertainment.',
  'That was not a fan test. That was employee backlighting.',
  'The wiring diagram has promoted you to resistor.',
  'Good news: there is power on the deck. Bad news: that is where we put you.'
 ],
 'cooling-background':[
  'Facilities installed the fan backwards.','The heat sink has no people skills.','Your cooling ticket is getting warmer.','Please keep thumbs clear of the blame.','The wiring diagram has opinions.','That fan is ventilating the employee.','My thermal model forgot about shoes.','The manual suggests less burning.','The switch deck has a draft problem.','Your toes are outside the warranty.','I called this passive cooling.','The breeze is a management decision.','Somebody wired confidence to the motor.','The fan has two directions of blame.','Power routing. Poor supervision.','The hot part has declined visitors.','Cooling requires actual useful work.','The circuit is judging your thumbs.','Maintenance brought a very small fan.','Please debug before becoming smoke.','That heat sink has rejected your feet.','The draft is included in your ticket.','No credits. Just questionable wiring.','The fan manual did mention direction.'
 ],
 'cooling-enter':[
  'You found the switch deck. Cleanup and credits are suspended. The draft is not.','The deck is free to use. Remaining on it is your problem.','Every gate must output 1 into EN. GND is wired to your shoes. Facilities approved that.','Select a logic gate, then rotate it. Selection alone is surprisingly safe.','Read the two inputs and the gate rule. I prefer guessing, which is why you are here.','You may think here. You may also need to move your feet.'
 ],
 'cooling-switch':[
  'You rotated a logic gate. Facilities has blamed the logic.','One quarter turn. Several new opportunities for blame.','That trace changed because you touched the wiring. We have evidence.','The output follows the truth table. My installation report follows nobody.','You have changed the circuit. Facilities is updating its excuse.','The fan needs every enable at 1. Your feet would prefer ground to stay at 0.','That switch was free. I reserve the right to be annoyed about it.','Please balance your electrical expertise with standing on the platform.'
 ],
 'cooling-safe':[
  'The heat sink is cool. My original installation remains professionally embarrassing.','Fan reversed. Heat sink cooled. I will claim that was the default.','Safe to cross. Please stop mentioning the previous temperature.','You repaired the cooling. I repaired the incident report to omit you.','The fan is finally pointing at the expensive component.','Cooling complete. Your feet have been removed from the test plan.'
 ],
 'cooling-reset':[
  'You left the switch deck. I restored the original electrical mistake.','Circuit reset. Your balance was the unstable component.','The fan moved you. Facilities has recorded voluntary departure.','You stepped out of maintenance. The wiring has forgotten your work.','I kept the breeze and discarded your solution.','The switches reset when the technician leaves the deck. Excellent policy.','Your electrical progress was not securely attached to the platform.','The draft has requested a fresh circuit.','All that thinking, and the fan filed the last input.','Please remain on the platform for the duration of your competence.','The circuit has reverted to the approved incorrect configuration.','I have restored the factory defect.'
 ],
 'cooling-loss':[
  'The heat sink was hot. Your complaint was briefly hotter.','You tested the temperature with the entire employee.','The fan was cooling the wrong side. So were your feet.','The amber warning was not a decorating suggestion.','Thermal testing succeeded. You were the disposable sensor.','You approached a hot component with unusually combustible confidence.','The temperature label was accurate. I am surprised too.','Your shoes have submitted a hardware failure report.','The circuit needed solving before the heat sink needed visiting.','Facilities has marked the scorch as user supplied.','You reversed your survival before reversing the fan.','Your feet were not an approved cooling accessory.','The heat sink has completed your exit interview.','You skipped the circuit and went directly to the burn-in test.','The cooling fan would like you to finish the wiring first.','Your warranty excludes standing on the amber component.','I predicted heat. Finally, a successful prediction.','The component was operating within its terrible specifications.','You have converted a support ticket into a smoke signal.','The heat sink does not cool through customer complaints.','You found the hot path. The documentation was literal.','Please wait for SAFE TO CROSS. It is one of my accurate labels.','Your thermal budget expired before your action credits.','Facilities says the fan is installed. It did not say correctly.','The processor was warm. The employee is now unavailable.','You provided an excellent demonstration of insufficient cooling.','The fan needed all enables high. Your feet chose the hot part.','The fan direction was wrong. Your landing confirmed it.','Your approach bypassed the logic and kept the heat.','The burn-in test was intended for hardware. You volunteered.'
 ]
};
for(const [pool,lines] of Object.entries(COOLING_VOICE))ALL_REMARK_POOLS[pool]=lines;
BACKGROUND_QUIPS.levels[COOLING_LEVEL.title]=COOLING_VOICE['cooling-background'];COOLING_LEVEL.voice=COOLING_VOICE['cooling-background'];ALL_REMARK_POOLS[COOLING_LEVEL.serverId+'-loss']=COOLING_LEVEL.incidentCard.failures;
Object.assign(remarkCounts,loadRemarkCounts());
window.__COOLING_TEST__={state:()=>cooling?JSON.parse(JSON.stringify(cooling)):null,level:()=>JSON.parse(JSON.stringify(COOLING_LEVEL)),gate:coolingGate,route:coolingRoute,board:coolingBoard,rects:()=>{const s=coolingProtectedStation();return s?s.board.cells.map((_,i)=>coolingGateRect(s,i)):[]},protected:()=>!!coolingProtectedStation()};
