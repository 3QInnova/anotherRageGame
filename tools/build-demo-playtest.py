"""Build a local demo playlist from the same offline PC/mobile gameplay source."""
from pathlib import Path
import base64, hashlib, html, json, re, subprocess, sys

root = Path(__file__).resolve().parents[1]
subprocess.run([sys.executable, str(root / 'tools/build-mobile.py')], check=True)
out = root / 'outputs/demo-playtest/site'
out.mkdir(parents=True, exist_ok=True)
source = (root / 'campaign/demo-levels.js').read_text()
catalog = re.findall(r"demoLevel\('([^']+)','([^']+)','((?:[^'\\]|\\.)*)'", source)
assert len(catalog) == 8 and len({entry[0] for entry in catalog}) == 8
cards = []
for number, (id_, title, hook) in enumerate(catalog, 1):
    hook = hook.replace("\\'", "'")
    cards.append(f'''<article class="episode" data-demo="{html.escape(id_)}"><div class="number">DEMO {number:02d} / 08</div><h2>{html.escape(title)}</h2><p>{html.escape(hook)}</p><div class="actions"><a class="button" href="desktop.html#demo={id_}&amp;record=1">Play on PC</a><a class="button phone" href="mobile.html#demo={id_}">Play on phone</a></div></article>''')
hero='data:image/png;base64,'+base64.b64encode((root/'assets/visitor-error/visitor-error-hero.png').read_bytes()).decode()
mascot='<figure class="preview-mascot"><img src="'+hero+'" width="1024" height="1536" alt="Visitor Error, the paper human with a rejected visitor pass."><figcaption>VISITOR ERROR / ACCESS DENIED</figcaption></figure>'
landing = (root / 'playtest/demos.html').read_text().replace('<!-- VISITOR_PREVIEW -->',mascot)
assert '<!-- DEMO_CARDS -->' in landing
(out / 'development.html').write_text(landing.replace('<!-- DEMO_CARDS -->', '\n'.join(cards)))
recipes = json.loads((root / 'campaign/long-localhost.json').read_text())
servers = json.loads((root / 'campaign/data-centers.json').read_text())['centers'][0]['servers']
campaign_cards = []
for server, recipe in zip(servers, recipes):
    assert server['id'] == recipe['serverId']
    seconds = round(recipe['benchmarkSeconds'])
    time = f'{seconds // 60}:{seconds % 60:02}'
    acts = ' → '.join(act['name'] for act in recipe['acts'])
    id_ = server['id']
    campaign_cards.append(f'''<article class="episode" data-server="{id_}"><div class="number">LOCALHOST {server['number']:02d} / 20 · ~{time} · {recipe['moveSpeed']} px/s</div><h2>{html.escape(server['title'])}</h2><p>{html.escape(acts)}</p><div class="actions"><a class="button" href="desktop.html#campaign={id_}&amp;practice=1&amp;record=1">Practice · PC</a><a class="button phone" href="mobile.html#campaign={id_}&amp;practice=1">Practice · phone</a></div></article>''')
(out / 'campaign.html').write_text((root / 'playtest/campaign.html').read_text().replace('<!-- VISITOR_PREVIEW -->',mascot).replace('<!-- CAMPAIGN_CARDS -->', '\n'.join(campaign_cards)))
(out / 'character.html').write_text((root/'characters/preview.html').read_text().replace('/* VISITOR_SPRITES */',(root/'characters/visitor-error.js').read_text()))
lan_path=root/'outputs/playtest/lan.json'
lan=json.loads(lan_path.read_text()) if lan_path.exists() else {'baseURL':''}
for template,target in [('test-hub.html','playtest.html'),('shorts.html','shorts.html')]:
    (out/target).write_text((root/'playtest'/template).read_text().replace('/* LAN_BASE */ null',json.dumps(lan['baseURL'])))
cache_source=(root/'campaign/cache-prototypes.js').read_text()
cache_entries=re.findall(r"assemblePaperRoute\('([^']+)','([^']+)','((?:[^'\\]|\\.)*)'",cache_source)
assert len(cache_entries)==3
cache_cards=[]
for number,(id_,title,focus) in enumerate(cache_entries,1):
    cache_cards.append(f'<article class="card" data-cache="{id_}"><small>PROTOTYPE {number:02d} / 03</small><h2>{html.escape(title)}</h2><p>{html.escape(focus)}</p><a class="button" href="desktop.html#cache={id_}">Practice · PC</a><a class="button" href="mobile.html#cache={id_}">Practice · Phone</a></article>')
(out/'cache.html').write_text((root/'playtest/cache.html').read_text().replace('<!-- CACHE_CARDS -->','\n'.join(cache_cards)))
for source, target in [('initalDemoDocs/Exception_Human_Misclassification_V3.html', 'desktop.html'), ('outputs/development/mobile.html', 'mobile.html')]:
    page = (root / source).read_text()
    page = page.replace('<head>', '<head><meta name="robots" content="noindex,nofollow">', 1)
    (out / target).write_text(page)
(out/'index.html').write_text("""<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>EXCEPTION: HUMAN</title><script>location.replace((matchMedia('(pointer: coarse)').matches?'mobile.html':'desktop.html')+location.hash)</script><body><p>Escape Localhost: <a href="desktop.html">Play with keyboard</a> · <a href="mobile.html">Play with touch</a></p></body></html>""")
manifest = {p.name: {'bytes': p.stat().st_size, 'sha256': hashlib.sha256(p.read_bytes()).hexdigest()} for p in sorted(out.glob('*.html'))}
(out.parent / 'package.json').write_text(json.dumps({'episodes': [{'id': id_, 'title': title} for id_, title, _ in catalog], 'files': manifest}, indent=2) + '\n')
print('Prepared local demo playlist at ' + str(out.relative_to(root)))
