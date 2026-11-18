"""Serve only the packaged demo and campaign pages. No repository directories are exposed."""
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit
import argparse, subprocess, sys

parser = argparse.ArgumentParser()
parser.add_argument('--port', type=int, default=8766)
parser.add_argument('--host', default='127.0.0.1')
parser.add_argument('--development', action='store_true', help='Serve archived authoring/playtest content explicitly')
parser.add_argument('--no-build', action='store_true')
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
if not args.no_build:
    subprocess.run([sys.executable, str(root / ('tools/build-demo-playtest.py' if args.development else 'tools/build-mobile.py'))], check=True)
site = root / 'outputs/demo-playtest/site'
pages = {'/': 'index.html', '/index.html': 'index.html', '/desktop.html': 'desktop.html', '/mobile.html': 'mobile.html', '/campaign.html': 'campaign.html', '/character.html': 'character.html', '/playtest.html':'playtest.html', '/shorts.html':'shorts.html', '/cache.html':'cache.html'}
clips={f'/clips/{name}-{kind}.{extension}':root/f'outputs/shorts/{name}-{kind}.{extension}' for name in ['do-not-move','saved-probably','memory-not-found'] for kind,extension in [('reference','webm'),('portrait','mp4')]}
qr={f'/qr/{id_}.png':root/f'outputs/playtest/qr/{id_}.png' for id_ in ['hub','P1','P2','P3','P4','P5']}
if not args.development:
    site = root / 'outputs/release/site'
    pages = {'/':'index.html', '/index.html':'index.html', '/desktop.html':'desktop.html', '/mobile.html':'mobile.html'}
    clips = {}; qr = {}
if not all((site / page).is_file() for page in pages.values()):
    raise SystemExit('Build the demo preview before serving with --no-build.')

class Handler(BaseHTTPRequestHandler):
    def do_GET(self): self.send_page(True)
    def do_HEAD(self): self.send_page(False)
    def send_page(self, body):
        path = urlsplit(self.path).path
        if path == '/favicon.ico':
            self.send_response(204); self.end_headers(); return
        if path not in pages and path not in clips and path not in qr:
            self.send_error(404); return
        target=(site/pages[path]) if path in pages else (clips[path] if path in clips else qr[path])
        if not target.is_file():self.send_error(404);return
        content = target.read_bytes()
        self.send_response(200)
        self.send_header('Content-Type', 'image/png' if path.endswith('.png') else 'video/webm' if path.endswith('.webm') else 'video/mp4' if path.endswith('.mp4') else 'text/html; charset=utf-8')
        self.send_header('Content-Length', str(len(content)))
        self.send_header('Cache-Control', 'no-store')
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('Referrer-Policy', 'no-referrer')
        self.send_header('X-Frame-Options', 'DENY')
        self.end_headers()
        if body: self.wfile.write(content)
    def log_message(self, format, *args):
        print(f'{self.client_address[0]} {format % args}', flush=True)

server = ThreadingHTTPServer((args.host, args.port), Handler)
print(f'Demo preview: http://{args.host}:{server.server_port}/', flush=True)
try: server.serve_forever()
except KeyboardInterrupt: pass
finally: server.server_close()
