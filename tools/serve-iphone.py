"""Serve only the generated game page for a same-Wi-Fi iPhone playtest."""
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit
import argparse
parser = argparse.ArgumentParser()
parser.add_argument('--port', type=int, default=8765)
args = parser.parse_args()
page = Path(__file__).resolve().parents[1] / 'mobile/index.html'
class Handler(BaseHTTPRequestHandler):
    def do_GET(self): self.send_page(True)
    def do_HEAD(self): self.send_page(False)
    def send_page(self, body):
        path = urlsplit(self.path).path
        if path == '/favicon.ico':
            self.send_response(204); self.end_headers(); return
        if path not in ('/', '/index.html'):
            self.send_error(404); return
        content = page.read_bytes()
        self.send_response(200)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.send_header('Content-Length', str(len(content)))
        self.send_header('Cache-Control', 'no-store')
        self.end_headers()
        if body: self.wfile.write(content)
        if 'iPhone' in self.headers.get('User-Agent', ''):
            print(f'iPhone loaded the mobile build from {self.client_address[0]}', flush=True)
    def log_message(self, format, *args):
        print(f'{self.client_address[0]} {format % args}', flush=True)
server = ThreadingHTTPServer(('0.0.0.0', args.port), Handler)
print(f'iPhone test server running on port {args.port}. Only mobile/index.html is served.', flush=True)
try: server.serve_forever()
except KeyboardInterrupt: pass
finally: server.server_close()
