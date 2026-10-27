"""Prepare local Wi-Fi links and verified QR codes for five nearby phones."""
from pathlib import Path
import argparse, datetime, ipaddress, json, os, re, subprocess, sys

parser = argparse.ArgumentParser()
parser.add_argument('--port', type=int, default=8766)
parser.add_argument('--ip', help='Override the Mac Wi-Fi address')
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
if not 1 <= args.port <= 65535:
    parser.error('Port must be 1–65535.')
if args.ip:
    address = str(ipaddress.ip_address(args.ip))
else:
    route = subprocess.check_output(['/sbin/route', '-n', 'get', 'default'], text=True)
    interface = re.search(r'interface:\s*(\S+)', route).group(1)
    address = subprocess.check_output(['/usr/sbin/ipconfig', 'getifaddr', interface], text=True).strip()
    ipaddress.ip_address(address)
base = f'http://{address}:{args.port}'
out = root / 'outputs/playtest'
out.mkdir(parents=True, exist_ok=True)
env = dict(os.environ, DEVELOPER_DIR='/Applications/Xcode.app/Contents/Developer')
subprocess.run(['xcrun', 'swift', str(root / 'tools/make-playtest-qr.swift'), base, str(out / 'qr')], check=True, env=env)
manifest = {'generatedAt': datetime.datetime.now(datetime.timezone.utc).isoformat(), 'baseURL': base,
            'hub': base + '/playtest.html',
            'sessions': {f'P{i}': base + f'/mobile.html#playtest=P{i}' for i in range(1, 6)}}
(out / 'lan.json').write_text(json.dumps(manifest, indent=2) + '\n')
subprocess.run([sys.executable, str(root / 'tools/build-demo-playtest.py')], check=True)
print('Open on nearby phones on the same Wi-Fi: ' + manifest['hub'])
print(f'Serve with: python3 tools/serve-demos.py --host 0.0.0.0 --port {args.port} --no-build')
