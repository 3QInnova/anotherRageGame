// A fixed, inspectable signal graph. Editing is an unpowered preview; TEST is explicit.
const PUZZLE_RULES={OR:{name:'ANY',rule:'ON when either input is ON.'},AND:{name:'BOTH',rule:'ON only when both inputs are ON.'},XOR:{name:'ONE ONLY',rule:'ON when exactly one input is ON.'}};
const PUZZLE_BOARDS=[
 {name:'ONE AT A TIME',count:3,gates:[{id:'G1',type:'XOR',inputs:['A','B'],x:250,y:52},{id:'G2',type:'AND',inputs:['A','B'],x:250,y:174},{id:'G3',type:'AND',inputs:['G1','C'],x:490,y:52}],fan:'G3',ground:'G2',routes:{'G3-1':[[80,184],[80,216],[398,216],[398,62]]}},
 {name:'SHARED RESPONSIBILITY',count:4,gates:[{id:'G1',type:'OR',inputs:['A','B'],x:250,y:52},{id:'G2',type:'XOR',inputs:['C','D'],x:250,y:174},{id:'G3',type:'AND',inputs:['G1','G2'],x:490,y:52},{id:'G4',type:'AND',inputs:['A','D'],x:490,y:174}],fan:'G3',ground:'G4',routes:{'G4-0':[[105,25],[105,5],[378,5],[378,164]],'G4-1':[[120,190],[120,216],[398,216],[398,184]]}},
 {name:'EVERY SWITCH HAS COLLEAGUES',count:5,gates:[{id:'G1',type:'XOR',inputs:['A','B'],x:232,y:38},{id:'G2',type:'OR',inputs:['C','D'],x:232,y:114},{id:'G3',type:'AND',inputs:['A','C'],x:232,y:190},{id:'G4',type:'AND',inputs:['G1','G2'],x:448,y:38},{id:'G5',type:'AND',inputs:['B','E'],x:448,y:156},{id:'G6',type:'OR',inputs:['G3','G5'],x:626,y:190}],fan:'G4',ground:'G6',routes:{'G5-0':[[92,64],[92,5],[356,5],[356,146]],'G5-1':[[108,196],[108,219],[374,219],[374,166]]}}
];
const PUZZLE_BOX_LEVEL={...COOLING_LEVEL,title:'PUZZLE BOX',serverId:'puzzle-box',serverNumber:'BOX',puzzleBoxTrial:true,remarkPool:'puzzle-background',sectionLabel:'FACILITIES / PUZZLE BOX',
 stations:COOLING_LEVEL.stations.map((s,i)=>({...s,sink:{...s.sink},count:[3,4,5][i],puzzle:i})),
 intro:'Puzzle Box. Jump onto a maintenance deck. Flip A/B/C switches and trace the visible signals. ANY means either; BOTH means both; ONE ONLY means exactly one. Preview is unpowered. TEST CIRCUIT powers the hardware. Aim for FAN 1 and DECK 0. The harness holds you steady while the box is open.',
 incidentCard:{job:'Puzzle Box',trouble:'Facilities connected the cooling fan and the employee platform to shared control signals.',notice:'Filled mint signals are ON / 1; hollow signals are OFF / 0. The complete wiring is visible. Crossing wires do not join.',remember:'FAN must be 1. DECK must be 0. Editing is a safe preview; TEST CIRCUIT applies power.',counterplay:'Flip the large A–E switches (keyboard 1–5). Enter tests; Escape closes; X opens a closed box. Trace each wire through ANY (OR), BOTH (AND) and ONE ONLY (XOR). Tap a gate to highlight its incoming paths and read its rule. Test once the fan is ON and the deck is OFF. Wait for SAFE TO CROSS, then press BACK TO DECK. The maintenance harness holds you steady while the box is open; cleanup and credits pause on the deck.',excuse:'Facilities has credited the box with solving its own staffing problem.',failures:['You powered both outputs. One of those outputs is your shoes.','The diagram was accurate. Facilities considers that a dangerous precedent.','The box passed its electrical test. The employee did not.']}
};
let puzzleBoxOpenId=null;
function hasPuzzleBoxes(){return !!(L?.puzzleBoxTrial||L?.puzzleBoxEncounter)}
function puzzleEvaluate(board,bits){
 const signals={};for(let i=0;i<board.count;i++)signals[String.fromCharCode(65+i)]=!!bits[i];
 const values=board.gates.map(g=>{const a=signals[g.inputs[0]],b=signals[g.inputs[1]],out=!!coolingGate(g.type,a,b);signals[g.id]=out;return {...g,a,b,out}});
 return {signals,values,fan:signals[board.fan],ground:signals[board.ground]};
}
function resetPuzzleBoxStation(s){
 s.board=PUZZLE_BOARDS[s.puzzle];s.bits=Array(s.board.count).fill(false);s.logic=puzzleEvaluate(s.board,s.bits);s.route={fan:s.logic.fan,grounded:false};s.phase='preview';s.testElapsed=0;s.testCount=0;s.viewed=false;s.focus=null;s.selected=-1;s.temperature=1;s.solved=false;s.groundTime=0;s.flips=0;s.quip='Flip an input. Follow the signal. TEST applies power; preview does not.';
 if(puzzleBoxOpenId===s.id)puzzleBoxOpenId=null;
}
function resetPuzzleBoxCooling(){puzzleBoxOpenId=null;return L.stations.map(s=>{const station={...s,sink:{...s.sink},time:0,resets:0,occupied:false};resetPuzzleBoxStation(station);return station})}
function puzzleIsOpen(){return !!(hasPuzzleBoxes()&&puzzleBoxOpenId&&state==='play')}
function puzzleActive(){return puzzleIsOpen()?cooling?.find(s=>s.id===puzzleBoxOpenId):null}
function puzzleOpen(s=coolingProtectedStation()){
 if(!hasPuzzleBoxes()||!s||!coolingCanEdit()||!player.grounded)return false;
 puzzleBoxOpenId=s.id;s.viewed=true;keys.clear();pressedKeys.clear();player.vx=0;player.vy=0;player.jumpBuffer=0;
 if(typeof releaseMobileHolds==='function')releaseMobileHolds();refreshHud();return true;
}
function puzzleClose(){const s=puzzleActive();if(!s||!coolingCanEdit()||!['preview','solved'].includes(s.phase))return false;puzzleBoxOpenId=null;keys.clear();pressedKeys.clear();player.jumpBuffer=0;refreshHud();return true}
function puzzleToggle(i){
 const s=puzzleActive();if(!s||!coolingCanEdit()||s.phase!=='preview'||!Number.isInteger(i)||i<0||i>=s.bits.length)return false;
 s.bits[i]=!s.bits[i];s.logic=puzzleEvaluate(s.board,s.bits);s.route.fan=s.logic.fan;s.flips++;s.focus=null;
 if(s.flips%3===1)coolingSpeak(s,'puzzle-turn');soundCue('rewrite');refreshHud();return true;
}
function puzzleInspect(id){const s=puzzleActive();if(!s||!coolingCanEdit()||!s.logic.values.some(g=>g.id===id))return false;s.focus=s.focus===id?null:id;refreshHud();$('puzzleBoxDiagram').querySelector?.('[data-puzzle-node="'+id+'"]')?.focus?.({preventScroll:true});return true}
function puzzleTest(){
 const s=puzzleActive();if(!s||!coolingCanEdit()||s.phase!=='preview')return false;
 s.phase='testing';s.testElapsed=0;s.testCount++;s.quip='LIVE TEST. Inputs locked. Following the signals to their unfortunate destinations.';soundCue('lock');refreshHud();return true;
}
function puzzleUseBox(){if(!hasPuzzleBoxes())return false;const s=coolingProtectedStation();if(!s)return false;if(!puzzleIsOpen())puzzleOpen(s);return true}
function puzzleNumberKey(code){if(!/^Digit[1-5]$/.test(code)||!puzzleIsOpen())return false;puzzleToggle(Number(code.slice(-1))-1);return true}
function advancePuzzleBox(dt){
 for(const s of cooling){
  s.time+=dt;
  if(s.phase==='testing'){
   s.testElapsed+=dt;
   if(s.testElapsed>=1.5-1e-8){
    if(s.logic.ground){s.route.grounded=true;die('GROUND FAULT: TEST CIRCUIT powered the deck output. Your platform electrocuted you. Aim for FAN 1 and DECK 0.','puzzle-shock');return}
    if(s.logic.fan){s.phase='cooling';s.quip='Fan ON. Deck OFF. Cooling the heat sink. Please remain inconveniently alive.';soundCue('confirm')}
    else{s.phase='preview';coolingSpeak(s,'puzzle-miss','warn');soundCue('denied')}
   }
  }
  if(s.phase==='cooling'){
   s.temperature=Math.max(0,s.temperature-.32*dt);
   if(s.temperature<=.2+1e-8){s.solved=true;s.phase='solved';s.temperature=0;coolingSpeak(s,'puzzle-safe');announce('PUZZLE BOX PASSED / SAFE TO CROSS');soundCue('confirm')}
  }
 }
}
function startPuzzleBox(){
 if(campaignBlocked())return false;
 selectLevelCollection(true);LEVELS=[PUZZLE_BOX_LEVEL];COMPACT_POINTS=[PUZZLE_BOX_LEVEL.returnPoints];GLASS_TEST_INDEX=1;initRoom(true);campaignPractice=true;practiceMode=true;practiceRoom=0;closeCampaignMenu(true);refreshHud();return true;
}
function puzzleEdges(board){
 const sources=Object.fromEntries(Array.from({length:board.count},(_,i)=>[String.fromCharCode(65+i),{x:48,y:board.count===3?[36,110,184][i]:board.count===4?[25,80,135,190][i]:[20,64,108,152,196][i]}]));
 const nodes={...sources,...Object.fromEntries(board.gates.map(g=>[g.id,{x:g.x,y:g.y}]))},edges=[];
 for(const g of board.gates)for(let pin=0;pin<2;pin++){
  const source=g.inputs[pin],n=nodes[source],a={x:n.x+(sources[source]?18:46),y:n.y},b={x:g.x-46,y:g.y+(pin?10:-10)},via=board.routes[g.id+'-'+pin],mid=sources[source]?94+(source.charCodeAt(0)-65)*18:a.x+26+(edges.length%3)*13;
  const points=[[a.x,a.y],...(via||[[mid,a.y],[mid,b.y]]),[b.x,b.y]];
  edges.push({source,target:g.id,pin,path:points.map((p,i)=>(i?'L':'M')+p.join(' ')).join(' ')});
 }
 for(const [source,target,y] of [[board.fan,'FAN',45],[board.ground,'DECK',184]]){
  const n=nodes[source],endX=728,mid=n.x+64;
  // The final fan trace runs above intermediate components on the five-input board.
  const points=target==='FAN'&&board.count===5?[[n.x+46,n.y],[524,n.y],[524,10],[714,10],[714,y],[endX,y]]:[[n.x+46,n.y],[mid,n.y],[mid,y],[endX,y]];
  edges.push({source,target,path:points.map((p,i)=>(i?'L':'M')+p.join(' ')).join(' ')});
 }
 return {sources,edges};
}
function puzzleFocusSources(s){const set=new Set(),visit=id=>{if(set.has(id))return;set.add(id);const g=s.board.gates.find(g=>g.id===id);if(g)g.inputs.forEach(visit)};if(s.focus)visit(s.focus);return set}
function puzzleJunctions(edges){
 const paths=edges.map(e=>{const n=e.path.match(/-?\d+(?:\.\d+)?/g).map(Number);return Array.from({length:n.length/2},(_,i)=>[n[i*2],n[i*2+1]])}),points=new Map();
 for(const path of paths)for(const p of path)points.set(p.join(','),p);
 return [...points.values()].filter(([x,y])=>{
  const dirs=new Set();
  for(const path of paths)for(let i=1;i<path.length;i++){
   const [a,b]=[path[i-1],path[i]];
   if(a[0]===b[0]&&x===a[0]&&y>=Math.min(a[1],b[1])&&y<=Math.max(a[1],b[1])){if(a[1]<y||b[1]<y)dirs.add('N');if(a[1]>y||b[1]>y)dirs.add('S')}
   if(a[1]===b[1]&&y===a[1]&&x>=Math.min(a[0],b[0])&&x<=Math.max(a[0],b[0])){if(a[0]<x||b[0]<x)dirs.add('W');if(a[0]>x||b[0]>x)dirs.add('E')}
  }
  return dirs.size>=3;
 });
}
function puzzleDiagramSvg(s){
 const {sources,edges}=puzzleEdges(s.board),focus=puzzleFocusSources(s),bits=s.logic.signals;
 let svg='<svg id="puzzleTrace" viewBox="0 0 840 224" role="img" aria-label="Complete circuit diagram. Filled signals are ON; hollow signals are OFF. Crossing wires do not join."><defs><marker id="puzzleArrow" viewBox="0 -3 6 6" refX="8" refY="0" markerWidth="4" markerHeight="4" orient="auto"><path fill="#6b8f7f" d="M0 -3 L6 0 L0 3 Z"/></marker></defs>';
 // Group branches of the same net. Underlays make unrelated crossings visibly separate.
 for(const source of new Set(edges.map(e=>e.source))){
  const group=edges.filter(e=>e.source===source),high=bits[source];
  svg+='<g class="puzzle-net">'+group.map(e=>`<path d="${e.path}" class="wire-clearance"/>`).join('');
  for(const e of group){const chosen=!s.focus||focus.has(e.target)||focus.has(e.source)&&e.source===s.focus;
   svg+=`<g class="puzzle-wire ${high?'high':'low'} ${chosen?'traced':'dim'}"><path d="${e.path}" data-source="${e.source}" data-target="${e.target}" data-pin="${e.pin??'out'}" marker-end="url(#puzzleArrow)"/><path d="${e.path}" class="signal-packets"/></g>`;
  }
  for(const [x,y] of puzzleJunctions(group))svg+=`<circle cx="${x}" cy="${y}" r="4" class="signal-junction ${high?'pin-on':'pin-off'}"/>`;
  svg+='</g>';
 }
 for(const [id,p] of Object.entries(sources))svg+=`<g class="puzzle-source ${bits[id]?'high':'low'}"><circle cx="${p.x}" cy="${p.y}" r="17"/><text x="${p.x}" y="${p.y+6}" text-anchor="middle">${Number(bits[id])}</text><text x="${p.x-24}" y="${p.y+6}" text-anchor="end">${id}</text></g>`;
 for(const g of s.logic.values){const rule=PUZZLE_RULES[g.type];svg+=`<g class="puzzle-gate ${s.focus===g.id?'picked':''}" data-puzzle-node="${g.id}" role="button" tabindex="0" aria-label="Inspect ${g.id} ${rule.name}: inputs ${Number(g.a)} and ${Number(g.b)}, output ${Number(g.out)}"><rect class="gate-hit" x="${g.x-49}" y="${g.y-36}" width="98" height="72"/><rect x="${g.x-46}" y="${g.y-23}" width="92" height="46" rx="8"/><text x="${g.x}" y="${g.y-1}" text-anchor="middle">${rule.name}</text><text class="gate-code" x="${g.x}" y="${g.y+17}" text-anchor="middle">${g.id} / ${g.type}</text>${[g.a,g.b].map((v,pin)=>`<circle class="${v?'pin-on':'pin-off'}" cx="${g.x-46}" cy="${g.y+(pin?10:-10)}" r="5"/>`).join('')}<circle class="${g.out?'pin-on':'pin-off'}" cx="${g.x+46}" cy="${g.y}" r="5"/><text class="output-bit" x="${g.x+55}" y="${g.y-6}">${Number(g.out)}</text></g>`}
 for(const [id,on,wanted,y] of [['FAN',s.logic.fan,true,45],['DECK',s.logic.ground,false,184]])svg+=`<g class="puzzle-target ${on===wanted?'good':'bad'}"><rect x="728" y="${y-25}" width="108" height="50" rx="7"/><text x="782" y="${y-4}" text-anchor="middle">${id} ${Number(on)}</text><text class="target-goal" x="782" y="${y+15}" text-anchor="middle">NEEDS ${Number(wanted)} ${on===wanted?'✓':'!'}</text></g>`;
 return svg+'</svg>';
}
function refreshPuzzleBox(){
 const panel=$('puzzleBoxPanel');if(!panel)return;const s=puzzleActive();panel.hidden=!s||!coolingCanEdit();if(!s)return;
 $('puzzleBoxHeading').textContent=`PUZZLE BOX ${cooling.indexOf(s)+1}/${cooling.length} · ${s.board.name}`;
 const phase=s.phase==='testing'?'LIVE TEST · '+Math.max(0,1.5-s.testElapsed).toFixed(1)+'s':s.phase==='cooling'?'FAN RUNNING · COOLING':s.solved?'SAFE TO CROSS':'UNPOWERED PREVIEW · FAN 1 / DECK 0';
 $('puzzleBoxMode').textContent=phase;
 const key=[s.id,s.bits.join(''),s.focus,s.phase].join('/');
 if(panel.dataset?.diagram!==key){$('puzzleBoxDiagram').innerHTML=puzzleDiagramSvg(s);if(panel.dataset)panel.dataset.diagram=key}
 panel.style.setProperty?.('--signal-time',String(s.time*24));
 if(panel.dataset){panel.dataset.phase=s.phase;panel.dataset.focused=String(!!s.focus)}
 for(let i=0;i<5;i++){const b=$('puzzleInput'+i);b.hidden=i>=s.board.count;b.disabled=s.phase!=='preview';b.textContent=String.fromCharCode(65+i)+' '+(s.bits[i]?'● ON':'○ OFF');b.setAttribute?.('aria-pressed',String(!!s.bits[i]));b.setAttribute?.('aria-label','Input '+String.fromCharCode(65+i)+', '+(s.bits[i]?'ON, turn off':'OFF, turn on'))}
 $('puzzleBoxTest').disabled=s.phase!=='preview';$('puzzleBoxTest').textContent=s.phase==='testing'?'TESTING…':s.phase==='cooling'?'COOLING…':s.solved?'PASSED ✓':'TEST CIRCUIT';
 $('puzzleBoxClose').disabled=!['preview','solved'].includes(s.phase);
 const g=s.logic.values.find(g=>g.id===s.focus);
 $('puzzleBoxStatus').textContent=g?`${g.id} ${PUZZLE_RULES[g.type].name}: ${Number(g.a)}, ${Number(g.b)} → ${Number(g.out)}. ${PUZZLE_RULES[g.type].rule}`:s.quip;
}
function installPuzzleBoxUI(){
 $('stage')?.appendChild?.($('puzzleBoxPanel'));$('campaignPuzzleBox').onclick=startPuzzleBox;
 for(let i=0;i<5;i++)$('puzzleInput'+i).onclick=()=>puzzleToggle(i);
 $('puzzleBoxTest').onclick=puzzleTest;$('puzzleBoxClose').onclick=puzzleClose;
 $('puzzleBoxDiagram').addEventListener?.('click',e=>{const g=e.target.closest?.('[data-puzzle-node]');if(g)puzzleInspect(g.dataset.puzzleNode)});
 $('puzzleBoxDiagram').addEventListener?.('keydown',e=>{const g=e.target.closest?.('[data-puzzle-node]');if(g&&['Enter','Space'].includes(e.code)){e.preventDefault();e.stopPropagation();if(!e.repeat)puzzleInspect(g.dataset.puzzleNode)}});
}
function drawPuzzleBoxWorld(){
 if(!cooling)return;
 for(const s of cooling){
  card(s.x,s.y,s.w,16,'#d9e7db','#426d65');for(let x=s.x+15;x<s.x+s.w;x+=40)dotline(x,s.y+17,x,FLOOR,'#9cac9d');
  card(s.x+46,s.y-110,148,66,'#f7f2e5','#426d65');label('PUZZLE BOX '+(cooling.indexOf(s)+1),s.x+120,s.y-89,13,INK,'center');label(s.solved?'PASSED / COOL':s.viewed?'X / OPEN BOX':'JUMP ONTO DECK',s.x+120,s.y-66,10,MINT,'center');
  label('MAINTENANCE / ACTIONS FREE',s.x+s.w/2,s.y+38,9,'#426d65','center');
  const fanX=s.x+s.w+26,fanY=s.y-46,reverse=s.phase==='cooling'||s.solved;
  dotline(s.x+194,s.y-80,fanX,fanY,reverse?MINT:MUTED);ctx.save();ctx.translate(fanX,fanY);stroke(-22,-22,44,44,'#426d65');ctx.rotate(s.time*(reverse?7:-7));for(let i=0;i<4;i++){ctx.rotate(Math.PI/2);ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(23,-14,16,13);ctx.lineTo(0,0);ctx.fillStyle=reverse?MINT:GOLD;ctx.fill()}ctx.restore();
  const h=s.sink,hot=!s.solved;rect(h.x,h.y,h.w,h.h,hot?'#d8bd93':'#c4dfd2');stroke(h.x,h.y,h.w,h.h,hot?'#ad6c3d':'#426d65');for(let x=h.x+8;x<h.x+h.w;x+=17)rect(x,h.y+5,6,h.h-10,hot?'#af8050':'#80ac9a');label(hot?'HOT · '+Math.ceil(s.temperature*100)+'%':'COOLED · SAFE',h.x+h.w/2,h.y-13,12,hot?'#a85f35':'#426d65','center');
 }
}
const PUZZLE_VOICE={
 'puzzle-background':['This box has no hidden wiring.','Facilities misplaced the OFF switch.','The fan has requested a better boss.','Every switch has consequences.','The diagram is unusually honest.','Please keep logic away from shoes.','The box remembers who pressed TEST.','Your feet are an output device.','The cooling plan includes thinking.','The wires have fewer excuses than me.','Maintenance has supplied three letters.','I labelled both ends. You are welcome.','The power budget includes one human.','All signals lead to paperwork.','Preview first. Regret is live.','This box passed a confidence test.'],
 'puzzle-turn':['You changed an input. I am preparing a different excuse.','The signal changed. My confidence has declined to comment.','That switch controls two branches. Sharing is a workplace hazard.','You found ON. Please continue toward useful.','Preview is free. My commentary is mandatory.','Every input has been recorded for later blame.','You may experiment. The electricity is waiting for TEST.','You have altered the circuit without consulting my ego.'],
 'puzzle-enter':['Maintenance harness attached. Trace the wires; your feet can rest.','Preview is unpowered. TEST makes your decisions an electrical matter.','Fan 1. Deck 0. Facilities has written the entire safety manual.','Follow the filled signals. The hollow ones are making no promises.'],
 'puzzle-miss':['The deck is safe. The fan remains professionally unhelpful.','Nothing exploded. Nothing cooled either.','Fan OFF. You have successfully preserved the original problem.','The circuit works. It is just doing the wrong job.','Safe test. Unemployed fan. Please revise.','Your wiring has passed the doing-nothing benchmark.','The test found no useful airflow. I feel represented.','That was safe. Facilities finds this mildly disappointing.'],
 'puzzle-safe':['Fan ON. Deck OFF. An alarming amount of competence.','The heat sink is cool. My explanation is still overheating.','You solved it. I have labelled the result factory default.','Safe to cross. Please stop looking so satisfied.','The circuit passed. I will take credit for the diagram.','Cooling complete. Your shoes remain inconveniently unburned.'],
 'puzzle-reset':['You left maintenance. I restored the original problem.','The box reset. Please attach your progress to the platform.','Your circuit was not saved outside the maintenance area.','Facilities has reinstalled the approved incorrect inputs.'],
 'puzzle-shock':['You powered both outputs. One of those outputs is your shoes.','TEST CIRCUIT. Not TEST EMPLOYEE.','The deck said 1. Your feet received the notification.','You traced the circuit directly into your personnel file.','The fan requested power. You supplied the technician instead.','The preview showed DECK 1. You requested a live demonstration.','Your shoes are now the brightest indicators on the diagram.','The circuit followed your instructions. An unfortunate precedent.','You pressed TEST. The platform pressed back.','That was a successful power delivery to an unsuccessful destination.','The fan remains cool about this. Unlike the employee.','You have become the component labelled REPLACE AFTER TEST.','The ground bus has collected its passenger.','Your wiring has earned a glowing incident report.','The diagram warned you. I am insufferably pleased about that.','The deck was an output. You were standing in the results.','Live test complete. Employee connection interrupted.','You enabled the floor. The floor disabled the user.','Power reached the platform. Facilities has marked delivery complete.','You passed electricity through the customer feedback channel.','The safety target was zero. You supplied enthusiasm.','The box is now certified capable of finding your ankles.','Your test case has become a workplace case.','The platform received a one. Your survival received a zero.','Your shoes did not implement the required insulation interface.','You have shorted the circuit and lengthened the paperwork.','The employee is now a very temporary status light.','That signal was high. Your remaining prospects are lower.','The test powered the human-facing interface. Literally.','The fan would like to know why you tested the footwear.']
};
for(const [pool,lines] of Object.entries(PUZZLE_VOICE))ALL_REMARK_POOLS[pool]=lines;
BACKGROUND_QUIPS.levels[PUZZLE_BOX_LEVEL.title]=PUZZLE_VOICE['puzzle-background'];PUZZLE_BOX_LEVEL.voice=PUZZLE_VOICE['puzzle-background'];ALL_REMARK_POOLS['puzzle-box-loss']=PUZZLE_BOX_LEVEL.incidentCard.failures;Object.assign(remarkCounts,loadRemarkCounts());
window.__PUZZLE_BOX_TEST__={state:()=>cooling&&hasPuzzleBoxes()?JSON.parse(JSON.stringify(cooling)):null,level:()=>JSON.parse(JSON.stringify(PUZZLE_BOX_LEVEL)),boards:()=>JSON.parse(JSON.stringify(PUZZLE_BOARDS)),evaluate:puzzleEvaluate,edges:puzzleEdges,open:()=>puzzleBoxOpenId};
