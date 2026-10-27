"""Inline authored campaign modules into the offline desktop artifact; no remote runtime loads."""
from pathlib import Path
import base64,json,re
root=Path(__file__).resolve().parents[1]
source=root/'initalDemoDocs/Exception_Human_Misclassification_V3.html'
page=source.read_text()
def replace_block(page,name,body,before):
    start,end=f'/* BEGIN {name} */',f'/* END {name} */'
    block=start+'\n'+body+'\n'+end+'\n'
    if start in page:
        return re.sub(re.escape(start)+r'[\s\S]*?'+re.escape(end)+r'\n?',lambda _:block,page,count=1)
    assert before in page, f'Missing insertion point for {name}'
    return page.replace(before,block+before,1)
catalog=json.loads((root/'campaign/data-centers.json').read_text())
recipes=json.loads((root/'campaign/localhost.json').read_text())
incidents=json.loads((root/'campaign/localhost-incidents.json').read_text())
voice=json.loads((root/'campaign/localhost-voice.json').read_text())
long_recipes=json.loads((root/'campaign/long-localhost.json').read_text())
long_voice=json.loads((root/'campaign/long-localhost-voice.json').read_text())
assert len({s['id'] for c in catalog['centers'] for s in c['servers']})==sum(len(c['servers']) for c in catalog['centers'])
for c in catalog['centers']:
    assert len(c['servers'])==20
    assert sum(s['role']=='incident' for s in c['servers'])==4
assert all(len(voice[r['serverId']])>=12 for r in recipes)
assert {s['id'] for c in catalog['centers'] for s in c['servers'] if s['status']=='playable'}=={r['serverId'] for r in recipes}, 'Playable catalog entries need authored recipes'
assert len(long_recipes)==20 and {r['serverId'] for r in long_recipes}=={r['serverId'] for r in recipes}
assert all(len(long_voice[r['serverId']])>=24 for r in long_recipes)
body='const DATA_CENTER_CATALOG='+json.dumps(catalog,separators=(',',':'))+';\nconst LOCALHOST_RECIPES='+json.dumps(recipes,separators=(',',':'))+';\nconst LOCALHOST_VOICE='+json.dumps(voice,separators=(',',':'))+';\n'
body+='const LOCALHOST_INCIDENTS='+json.dumps(incidents,separators=(',',':'))+';\n'
body+='const LONG_LOCALHOST_RECIPES='+json.dumps(long_recipes,separators=(',',':'))+';\n'
body+='const LONG_LOCALHOST_VOICE='+json.dumps(long_voice,separators=(',',':'))+';\n'
body+=(root/'campaign/route-pieces.js').read_text()+'\n'
body+=(root/'campaign/long-campaign.js').read_text()+'\n'
body+=(root/'campaign/encounters.js').read_text()+'\n'+(root/'campaign/runtime.js').read_text()
body+='\n'+(root/'campaign/credits-and-advice.js').read_text()
body+='\n'+(root/'campaign/idle-compute.js').read_text()
body+='\n'+(root/'campaign/commitment-lab.js').read_text()
body+='\n'+(root/'campaign/pressure-feedback.js').read_text()
body+='\n'+(root/'campaign/garbage-collection-day.js').read_text()
body+='\n'+(root/'campaign/thermal-support.js').read_text()
body+='\n'+(root/'campaign/puzzle-box.js').read_text()
body+='\n'+(root/'campaign/rage-labs.js').read_text()
body+='\n'+(root/'campaign/demo-levels.js').read_text()
body+='\n'+(root/'campaign/cache-prototypes.js').read_text()
body+='\nconst FAILURE_VOICE='+json.dumps(json.loads((root/'campaign/failure-voice.json').read_text()),separators=(',',':'))+';\n'
body+=(root/'campaign/failure-voice.js').read_text()+'\n'+(root/'desktop/screen.js').read_text()
body+='\nconst REWARD_CATALOG='+json.dumps(json.loads((root/'rewards/catalog.json').read_text()),separators=(',',':'))+';\n'+(root/'rewards/runtime.js').read_text()
body+='\n'+(root/'playtest/session.js').read_text()
body+='\nconst VISITOR_HERO_SRC='+json.dumps('data:image/png;base64,'+base64.b64encode((root/'assets/visitor-error/visitor-error-hero.png').read_bytes()).decode())+';\n'
body+=(root/'characters/visitor-error.js').read_text()
assert '</script' not in body.lower()
page=replace_block(page,'DATA CENTER CAMPAIGN',body,"for(const b of document.querySelectorAll('[data-hold]'))")
page=replace_block(page,'PLAYTEST STORAGE',(root/'playtest/storage.js').read_text(),'const canvas=document.getElementById')
css=(root/'campaign/menu.css').read_text()+'\n'+(root/'campaign/rage-labs.css').read_text()+'\n'+(root/'desktop/screen.css').read_text()+'\n'+(root/'characters/visitor-error.css').read_text()+'\n'+(root/'rewards/style.css').read_text()
css+='\n'+(root/'playtest/session.css').read_text()
page=replace_block(page,'DATA CENTER CSS',css,'</style>')
desktop=(root/'desktop/layout.html').read_text().replace('<!-- VISITOR_MASCOT -->',(root/'characters/menu-mascot.html').read_text()).replace('<!-- INCIDENT_PANEL -->','<!-- BEGIN INCIDENT PANEL -->\n'+(root/'campaign/incident-panel.html').read_text()+'<!-- END INCIDENT PANEL -->')
begin=page.index('<body>')+len('<body>')
finish=page.index('<!-- BEGIN DATA CENTER MENU -->',begin)
page=page[:begin]+'\n<!-- BEGIN DESKTOP SHELL -->\n'+desktop+'<!-- END DESKTOP SHELL -->\n'+page[finish:]
start,end='<!-- BEGIN DATA CENTER MENU -->','<!-- END DATA CENTER MENU -->'
block=start+'\n'+(root/'campaign/menu.html').read_text()+(root/'rewards/ui.html').read_text()+(root/'playtest/session-ui.html').read_text()+end+'\n'
if start in page: page=re.sub(re.escape(start)+r'[\s\S]*?'+re.escape(end)+r'\n?',lambda _:block,page,count=1)
else:page=page.replace('<script>',block+'<script>',1)
panel='<!-- BEGIN INCIDENT PANEL -->\n'+(root/'campaign/incident-panel.html').read_text()+'<!-- END INCIDENT PANEL -->\n'
if '<!-- BEGIN INCIDENT PANEL -->' in page:
    page=re.sub(r'<!-- BEGIN INCIDENT PANEL -->[\s\S]*?<!-- END INCIDENT PANEL -->\n?',lambda _:panel,page,count=1)
else:page=page.replace('<div class="actions">',panel+'<div class="actions">',1)
source.write_text(page)
lines=['# Data Center server catalog','', 'Ten centers, 200 stable server slots. Localhost is playable; the remaining 180 slots are planned expansion blueprints. Generated from `data-centers.json`.','']
for center in catalog['centers']:
    lines += ['## '+str(center['number'])+'. '+center['name'], '', center['description'], '', '| Server ID | Name | Role | Availability |', '| --- | --- | --- | --- |']
    for server in center['servers']:
        lines.append('| '+server['id']+' | '+server['title']+' | '+server['role']+(' / MCP incident' if server['mcp'] else '')+' | '+server['status']+' |')
    lines.append('')
(root/'campaign/CATALOG.md').write_text('\n'.join(lines)+'\n')
print('Built offline Data Center campaign: 10 centers, 200 mapped servers, 20 playable Localhost servers.')
