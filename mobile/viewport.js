// One presentation model for the camera, eye, optical clues and framebuffer.
// World units and collision geometry remain in the PC source.
const mobileView={width:866,height:400,top:159,eyeX:675,eyeY:284,pixelWidth:866,pixelHeight:400};
function resizeMobileViewport(){
 const bounds=canvas.getBoundingClientRect?.();
 const width=bounds?.width||window.innerWidth||844,height=bounds?.height||window.innerHeight||390;
 mobileView.width=mobileView.height*width/Math.max(1,height);
 // Keep the walking surface above the actual thumb hit areas, including safe areas/settings.
 const pads=[$('movePad'),$('actionPad')].map(el=>el.getBoundingClientRect?.().top).filter(Number.isFinite);
 const floorPixels=Math.max(height*.52,Math.min(height*.7,...pads.map(y=>y-(bounds?.top||0)-12)));
 mobileView.top=FLOOR-mobileView.height*floorPixels/height;
 mobileView.eyeX=mobileView.width*.78;mobileView.eyeY=mobileView.top+125;
 const ratio=Math.min(2,window.devicePixelRatio||1);
 mobileView.pixelWidth=Math.round(width*ratio);mobileView.pixelHeight=Math.round(height*ratio);
 if(canvas.width!==mobileView.pixelWidth||canvas.height!==mobileView.pixelHeight){canvas.width=mobileView.pixelWidth;canvas.height=mobileView.pixelHeight;}
}
function updateCamera(){cameraX=Math.max(0,Math.min(Math.max(0,L.width-mobileView.width),player.x-mobileView.width*.39))}
let mobilePaintKey='',mobilePaintCount=0;
function draw(){
 const key=[room,sceneTime,observerTime,state,player?.x,player?.y,observer?.stage,mobileView.top,mobileView.width,mobileView.pixelWidth,mobileView.pixelHeight].join('/');
 if(mobilePaused&&key===mobilePaintKey)return;
 mobilePaintKey=key;mobilePaintCount++;
 ctx.save();
 if(state==='compacting'){
  // Preserve the original fragment grid and its seeded random sequence.
  ctx.setTransform(mobileView.pixelWidth/W,0,0,mobileView.pixelHeight/H,0,0);drawCompaction();
 }else{
  ctx.setTransform(mobileView.pixelWidth/mobileView.width,0,0,mobileView.pixelHeight/mobileView.height,0,0);
  ctx.translate(0,-mobileView.top);drawDesktop();
 }
 ctx.restore();
}
function background(t){
 const width=mobileView.width,bottom=mobileView.top+mobileView.height;
 rect(0,mobileView.top,width,mobileView.height,PAPER);
 ctx.strokeStyle='#d9d6c7';ctx.lineWidth=1;
 for(let x=20;x<width;x+=30){ctx.beginPath();ctx.moveTo(x,mobileView.top);ctx.lineTo(x,bottom);ctx.stroke()}
 for(let y=74;y<bottom;y+=30){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(width,y);ctx.stroke()}
 for(let i=0;i<4;i++){const x=60+i*241,y=mobileView.top+65+(i%2)*40;label(['[CONFIDENCE: .999]','[SAFE BY DEFAULT]','[OBSERVATION #'+(room+1)+']','[USER: UNKNOWN]'][i],x,y,10,'#adb3aa');dotline(x,y+8,x+110,y+8,'#c8c9bc');}
 for(let x=30;x<width;x+=94)label(['if (human)','return ?','model.claim','// untested'][Math.floor(x/94)%4],x,FLOOR+66,10,'#b5b7ab','left','normal');
 dotline(16,bottom-31,width-16,bottom-31,'#c5c8bb');label('WORLD FILE / reality.json',16,bottom-12,11,'#898e89','left','normal');label('CANNOT VALIDATE HUMAN ENTITY',width-14,bottom-12,11,'#b1a6a1','right','normal');
}
