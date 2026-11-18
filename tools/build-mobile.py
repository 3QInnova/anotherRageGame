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
script = script.replace('function down(e){', 'function down(e){if(mobilePaused&&!rewardShopOpen)return;', 1)
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
script = script.replace("$('message').className=m==='warn'?'warn':m==='danger'?'danger':''}", "$('message').className=m==='warn'?'warn':m==='danger'?'danger':'';mobileMessage(t,m)}", 1)
script = script.replace('$("observerResponse").textContent=observer.response}', '$("observerResponse").textContent=observer.response;mobileMessage(observer.response)}', 1)
# Mobile handlers track pointer IDs independently; remove the desktop touch listeners.
start = script.index("for(const b of document.querySelectorAll('[data-hold]'))")
end = script.index('// Read-only console hooks', start)
script = script[:start] + script[end:]
script = script.replace('initRoom(true);requestAnimationFrame(frame);', viewport + '\nfunction mobileMessage' + methods + '\ninstallMobileUI();initRoom(true);requestAnimationFrame(frame);', 1)
campaign_css = (root/'campaign/menu.css').read_text()+'\n'+(root/'campaign/rage-labs.css').read_text()+'\n'+(root/'characters/visitor-error.css').read_text()+'\n'+(root/'rewards/style.css').read_text()
campaign_css+='\n'+(root/'playtest/session.css').read_text()
html = (root / 'mobile/layout.html').read_text().replace('/* GAME_SCRIPT */', script).replace('/* CAMPAIGN_CSS */',campaign_css).replace('<!-- VISITOR_MASCOT -->',(root/'characters/menu-mascot.html').read_text()).replace('<!-- CAMPAIGN_MENU -->',(root/'campaign/menu.html').read_text()+(root/'rewards/ui.html').read_text()+(root/'playtest/session-ui.html').read_text()).replace('<!-- INCIDENT_PANEL -->',(root/'campaign/incident-panel.html').read_text())
(root/'outputs/development').mkdir(parents=True,exist_ok=True)
(root/'outputs/development/mobile.html').write_text(html)
subprocess.run(['node',str(root/'tools/build-release.mjs')],check=True)
assert source.read_bytes() == original
(root / 'outputs/mobile').mkdir(parents=True, exist_ok=True)
(root / 'outputs/mobile/build.json').write_text(json.dumps({'desktopSource':str(source.relative_to(root)), 'desktopSha256':hashlib.sha256(original).hexdigest(), 'mobileArtifact':'mobile/index.html', 'desktopUnchanged':True},indent=2)+'\n')
print('Built mobile/index.html; desktop source unchanged.')
