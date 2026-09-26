"""FileFlow local development server.

Runs the static application from this folder.  No file is uploaded to a server by
this app; processing is browser-side.  We deliberately do NOT send COEP/COOP
headers because third-party CDN modules used by the toolbox may not send CORP
headers, and those headers can make the CDN dependencies fail to load. IMG.LY's
background-removal package can use WebGPU where supported and CPU otherwise.
"""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import os

ROOT = Path(__file__).resolve().parent
os.chdir(ROOT)

class Handler(SimpleHTTPRequestHandler):
    server_version = "FileFlow/2.0"
    def end_headers(self):
        self.send_header("Cache-Control", "no-cache")
        self.send_header("X-Content-Type-Options", "nosniff")
        super().end_headers()

if __name__ == "__main__":
    host, port = "127.0.0.1", 5500
    print(f"FileFlow running at http://{host}:{port}")
    print("Press Ctrl+C to stop.")
    ThreadingHTTPServer((host, port), Handler).serve_forever()
