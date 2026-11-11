#!/usr/bin/env node
/**
 * Static server for the cloned site.
 *  - serves mirror/ pages at their original URL paths
 *  - resolves /path/ -> /path/index.html
 *  - falls back to a directory listing for unmatched paths
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = process.argv[2] || '/tmp/opencode/crawl/mirror';
const PORT = parseInt(process.argv[3] || '8080', 10);

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.svg': 'image/svg+xml',
  '.webp': 'image/webp', '.ico': 'image/x-icon', '.woff': 'font/woff',
  '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.otf': 'font/otf',
  '.mp4': 'video/mp4', '.webm': 'video/webm', '.xml': 'application/xml',
  '.pdf': 'application/pdf', '.txt': 'text/plain; charset=utf-8'
};

http.createServer((req, res) => {
  let p;
  try { p = decodeURIComponent(new URL(req.url, 'http://x').pathname); }
  catch { p = '/'; }
  if (p.includes('\0')) { res.writeHead(400).end('bad request'); return; }

  const safe = path.normalize(p).replace(/^(\.\.[/\\])+/, '');
  let file = path.join(ROOT, safe);

  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');

  if (!fs.existsSync(file)) {
    const alt = path.join(ROOT, safe + '.html');
    if (fs.existsSync(alt)) file = alt;
    else { res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' }); res.end('<h1>404</h1><p>Not cloned: ' + p + '</p>'); return; }
  }

  const type = TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream';
  const body = fs.readFileSync(file);
  res.writeHead(200, { 'Content-Type': type, 'Content-Length': body.length, 'Cache-Control': 'no-cache' });
  res.end(body);
}).listen(PORT, '127.0.0.1', () => {
  console.log('clone served at http://127.0.0.1:' + PORT + '  (root: ' + ROOT + ')');
});
