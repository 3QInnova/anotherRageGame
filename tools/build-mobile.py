"""Build the separate iPhone artifact without modifying the desktop game."""
from pathlib import Path
import hashlib, json, re
root = Path(__file__).resolve().parents[1]
source = root / 'initalDemoDocs/Exception_Human_Misclassification_V3.html'
original = source.read_bytes()
script = re.search(r'<script>([\s\S]*?)</script>', original.decode()).group(1)
ui = (root / 'mobile/mobile-ui.js').read_text()
# Declarations precede the core so initRoom's HUD calls can update mobile elements.
declarations, methods = ui.split('function mobileMessage', 1)
script = script.replace("(()=>{'use strict';", "(()=>{'use strict';\n" + declarations, 1)
script = script.replace('function down(e){', 'function down(e){if(mobilePaused)return;', 1)
script = script.replace('Press Space or Enter twice, or tap Continue twice.', 'Tap Continue twice to retry.').replace('One more press or tap to retry. Your impatience has been logged.', 'One more tap to retry. Your impatience has been logged.')
script = script.replace('function runFrame(dt){', 'function runDesktopFrame(dt){', 1)
script = script.replace('function draw(){', 'function drawDesktop(){', 1)
script = script.replace('function refreshHud(){', 'function refreshDesktopHud(){', 1)
script = script.replace('player.x-W*.58', 'player.x-640*.45').replace('L.width-W,player.x-640*.45', 'L.width-640,player.x-640*.45')
script = script.replace('const cx=785,cy=173,', 'const cx=550,cy=240,', 1)
script = script.replace('image.getContext(\'2d\').drawImage(canvas,0,0)', 'image.getContext(\'2d\').drawImage(canvas,0,150)', 1)
script = script.replace("$('message').className=m==='warn'?'warn':m==='danger'?'danger':''}", "$('message').className=m==='warn'?'warn':m==='danger'?'danger':'';mobileMessage(t,m)}", 1)
script = script.replace('$("observerResponse").textContent=observer.response}', '$("observerResponse").textContent=observer.response;mobileMessage(observer.response)}', 1)
# Mobile handlers track pointer IDs independently; remove the desktop touch listeners.
start = script.index("for(const b of document.querySelectorAll('[data-hold]'))")
end = script.index('// Read-only console hooks', start)
script = script[:start] + script[end:]
script = script.replace('initRoom(true);requestAnimationFrame(frame);', 'function mobileMessage' + methods + '\ninstallMobileUI();initRoom(true);requestAnimationFrame(frame);', 1)
html = (root / 'mobile/layout.html').read_text().replace('/* GAME_SCRIPT */', script)
(root / 'mobile/index.html').write_text(html)
assert source.read_bytes() == original
(root / 'outputs/mobile/build.json').write_text(json.dumps({'desktopSource':str(source.relative_to(root)), 'desktopSha256':hashlib.sha256(original).hexdigest(), 'mobileArtifact':'mobile/index.html', 'desktopUnchanged':True},indent=2)+'\n')
print('Built mobile/index.html; desktop source unchanged.')
