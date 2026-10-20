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
 mobileView.top=FLOOR-mobileView.height*floorPixels/height;mobileView.floorTop=mobileView.top;
 mobileView.eyeX=mobileView.width*.78;mobileView.eyeY=mobileView.top+125;
 const ratio=Math.min(2,window.devicePixelRatio||1);
 mobileView.pixelWidth=Math.round(width*ratio);mobileView.pixelHeight=Math.round(height*ratio);
 if(canvas.width!==mobileView.pixelWidth||canvas.height!==mobileView.pixelHeight){canvas.width=mobileView.pixelWidth;canvas.height=mobileView.pixelHeight;}
}
function updateCamera(){cameraX=Math.max(0,Math.min(Math.max(0,L.width-mobileView.width),player.x-mobileView.width*.39))}
let mobilePaintKey='',mobilePaintCount=0;
function draw(){
 // Follow the raised thermal decks so their switch panel never covers the balancing player.
 mobileView.top=(mobileView.floorTop??mobileView.top)-((L.coolingTrial||L.puzzleBoxEncounter)?Math.min(96,Math.max(0,FLOOR-player.y-PH)*1.2):0);mobileView.eyeY=mobileView.top+125;
 const key=[backdrop?.revision,room,sceneTime,observerTime,state,player?.x,player?.y,observer?.stage,mobileView.top,mobileView.width,mobileView.pixelWidth,mobileView.pixelHeight].join('/');
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
function background(t){paintBackdrop(t,mobileView.width,mobileView.top,mobileView.height)}
