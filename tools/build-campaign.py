"""Inline authored campaign modules into the offline desktop artifact; no remote runtime loads."""
from pathlib import Path
import json,re
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
assert len({s['id'] for c in catalog['centers'] for s in c['servers']})==sum(len(c['servers']) for c in catalog['centers'])
for c in catalog['centers']:
    assert len(c['servers'])==20
    assert sum(s['role']=='incident' for s in c['servers'])==4
assert all(len(voice[r['serverId']])>=12 for r in recipes)
assert {s['id'] for c in catalog['centers'] for s in c['servers'] if s['status']=='playable'}=={r['serverId'] for r in recipes}, 'Playable catalog entries need authored recipes'
body='const DATA_CENTER_CATALOG='+json.dumps(catalog,separators=(',',':'))+';\nconst LOCALHOST_RECIPES='+json.dumps(recipes,separators=(',',':'))+';\nconst LOCALHOST_VOICE='+json.dumps(voice,separators=(',',':'))+';\n'
body+='const LOCALHOST_INCIDENTS='+json.dumps(incidents,separators=(',',':'))+';\n'
body+=(root/'campaign/encounters.js').read_text()+'\n'+(root/'campaign/runtime.js').read_text()
body+='\n'+(root/'campaign/credits-and-advice.js').read_text()
body+='\n'+(root/'campaign/idle-compute.js').read_text()
body+='\n'+(root/'campaign/commitment-lab.js').read_text()
body+='\n'+(root/'campaign/pressure-feedback.js').read_text()
body+='\n'+(root/'campaign/garbage-collection-day.js').read_text()
body+='\n'+(root/'campaign/thermal-support.js').read_text()
body+='\n'+(root/'campaign/puzzle-box.js').read_text()
assert '</script' not in body.lower()
page=replace_block(page,'DATA CENTER CAMPAIGN',body,"for(const b of document.querySelectorAll('[data-hold]'))")
css=(root/'campaign/menu.css').read_text()
page=replace_block(page,'DATA CENTER CSS',css,'</style>')
start,end='<!-- BEGIN DATA CENTER MENU -->','<!-- END DATA CENTER MENU -->'
block=start+'\n'+(root/'campaign/menu.html').read_text()+end+'\n'
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
