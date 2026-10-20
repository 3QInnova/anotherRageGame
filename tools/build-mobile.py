"""Build the separate iPhone artifact without modifying the desktop game."""
from pathlib import Path
import hashlib, json, re, subprocess, sys
root = Path(__file__).resolve().parents[1]
subprocess.run([sys.executable,str(root/'tools/build-campaign.py')],check=True)
source = root / 'initalDemoDocs/Exception_Human_Misclassification_V3.html'
original = source.read_bytes()
script = re.search(r'<script>([\s\S]*?)</script>', original.decode()).group(1)
ui = (root / 'mobile/mobile-ui.js').read_text()
# Declarations precede the core so initRoom's HUD calls can update mobile elements.
viewport = (root / 'mobile/viewport.js').read_text()
declarations, methods = ui.split('function mobileMessage', 1)
script = script.replace("(()=>{'use strict';", "(()=>{'use strict';\n" + declarations, 1)
script = script.replace('function down(e){', 'function down(e){if(mobilePaused)return;', 1)
script = script.replace('Press Space or Enter twice, or tap Continue twice.', 'Tap Continue twice to retry.').replace('One more press or tap to retry. Your impatience has been logged.', 'One more tap to retry. Your impatience has been logged.')
script = script.replace('function runFrame(dt){', 'function runDesktopFrame(dt){', 1)
script = script.replace('function draw(){', 'function drawDesktop(){', 1)
script = script.replace('function refreshHud(){', 'function refreshDesktopHud(){', 1)
# Fail clearly if shared rendering hooks change rather than silently producing a wrong camera.
def adapt(old, new):
    global script
    assert old in script, f'Mobile rendering hook changed: {old[:80]}'
    script = script.replace(old, new, 1)
adapt('function updateCamera(){', 'function updateDesktopCamera(){')
adapt('function background(t){', 'function drawDesktopBackground(t){')
# The classifier dashboard belongs in the paused AI log, not behind mobile captions.
start = script.index(' // Misclassified categories show up as margin notes')
end = script.index('\n}\nfunction drawPlayer', start)
script = script[:start] + script[end:]
adapt('const cx=785,cy=173,', 'const cx=mobileView.eyeX,cy=mobileView.eyeY,')
adapt('const mobile=width<=640,eye={x:offset+(mobile?550:785),y:mobile?240:173};', 'const eye={x:offset+mobileView.eyeX,y:mobileView.eyeY};')
adapt('function forecastCaptionX(x,pad){return L.longSession?Math.max(cameraX+pad,Math.min(cameraX+canvas.width-pad,x)):Math.max(pad,Math.min(W-pad,x))}', 'function forecastCaptionX(x,pad){return Math.max(cameraX+pad,Math.min(cameraX+mobileView.width-pad,x))}')
adapt('Math.min(cameraX+W-105,g.x+PW/2)', 'Math.min(cameraX+mobileView.width-105,g.x+PW/2)')
adapt("image.getContext('2d').drawImage(canvas,0,0)", "image.getContext('2d').drawImage(canvas,0,0,W,H)")
script = script.replace("$('message').className=m==='warn'?'warn':m==='danger'?'danger':''}", "$('message').className=m==='warn'?'warn':m==='danger'?'danger':'';mobileMessage(t,m)}", 1)
script = script.replace('$("observerResponse").textContent=observer.response}', '$("observerResponse").textContent=observer.response;mobileMessage(observer.response)}', 1)
# Mobile handlers track pointer IDs independently; remove the desktop touch listeners.
start = script.index("for(const b of document.querySelectorAll('[data-hold]'))")
end = script.index('// Read-only console hooks', start)
script = script[:start] + script[end:]
script = script.replace('initRoom(true);requestAnimationFrame(frame);', viewport + '\nfunction mobileMessage' + methods + '\ninstallMobileUI();initRoom(true);requestAnimationFrame(frame);', 1)
html = (root / 'mobile/layout.html').read_text().replace('/* GAME_SCRIPT */', script).replace('/* CAMPAIGN_CSS */',(root/'campaign/menu.css').read_text()).replace('<!-- CAMPAIGN_MENU -->',(root/'campaign/menu.html').read_text()).replace('<!-- INCIDENT_PANEL -->',(root/'campaign/incident-panel.html').read_text())
(root / 'mobile/index.html').write_text(html)
assert source.read_bytes() == original
(root / 'outputs/mobile').mkdir(parents=True, exist_ok=True)
(root / 'outputs/mobile/build.json').write_text(json.dumps({'desktopSource':str(source.relative_to(root)), 'desktopSha256':hashlib.sha256(original).hexdigest(), 'mobileArtifact':'mobile/index.html', 'desktopUnchanged':True},indent=2)+'\n')
print('Built mobile/index.html; desktop source unchanged.')
