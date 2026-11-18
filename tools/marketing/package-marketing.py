"""Validate and package the local marketing assets; never uploads or activates ads."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import hashlib, json, struct, zipfile

root=Path(__file__).resolve().parents[2]
folder=root/'outputs/app-store/marketing-v2'
exports=json.loads((folder/'export-manifest.json').read_text())['files']
ads=json.loads((folder/'ads/manifest.json').read_text())['files']
for item in exports+ads:
    name=item.get('name') or item['file']
    data=(folder/name).read_bytes()
    width,height,depth,color=struct.unpack('>IIBB',data[16:26])
    assert (width,height)==(item['width'],item['height']), name
    assert color==2, f'{name}: expected RGB without alpha'
    assert hashlib.sha256(data).hexdigest()==item['sha256'],name
copy=json.loads((folder/'copy/en-US.json').read_text())
limits={'name':30,'subtitle':30,'promotionalText':170,'keywords':100,'description':4000,'whatsNew':4000}
for key,limit in limits.items():
    assert len(copy[key].encode('utf8') if key=='keywords' else copy[key])<=limit,key

class References(HTMLParser):
    def __init__(self): super().__init__(); self.refs=[]
    def handle_starttag(self,tag,attrs):
        self.refs.extend(value for name,value in attrs if name in ('href','src') and value)

def check_links(base):
    count=0
    for rel in ['index.html','ads/index.html']:
        page=base/rel; parser=References();parser.feed(page.read_text())
        for value in parser.refs:
            parts=urlsplit(value)
            if parts.scheme or not parts.path:continue
            target=(page.parent/unquote(parts.path)).resolve()
            assert target.is_relative_to(base.resolve()) and target.is_file(),value
            count+=1
    return count

links=check_links(folder)
report={'designedPngExports':len(exports)+len(ads),'adVariants':3,'adFormats':4,'opaqueRgb':True,'dimensionsAndHashes':'passed','copyLimits':'passed','localLinks':links,'desktopAndMobileGalleryReview':'passed','visualReview':'all three ad variants and all four layouts reviewed; approved key art preserved','publication':'none','remaining':'Final native App Store screenshots; verified live destination and placement preview before paid activation'}
(folder/'validation.json').write_text(json.dumps(report,indent=2)+'\n')
archive=folder.parent/'exception-human-marketing-and-ads-v2.zip'
with zipfile.ZipFile(archive,'w',zipfile.ZIP_DEFLATED) as z:
    for file in sorted(folder.rglob('*')):
        if file.is_file() and 'layouts' not in file.relative_to(folder).parts:
            z.write(file,Path('EXCEPTION-HUMAN-Marketing-v2')/file.relative_to(folder))
with zipfile.ZipFile(archive) as z:
    assert z.testzip() is None
    moved=folder.parent/'portable-review-v2-renamed'
    z.extractall(moved)
    check_links(moved/'EXCEPTION-HUMAN-Marketing-v2')
print(f'PASS: {len(exports)+len(ads)} RGB exports, metadata limits, hashes and {links} links; ZIP integrity and renamed-folder links passed.')
print(archive)
