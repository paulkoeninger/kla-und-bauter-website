// Lokaler Deploy-Test: bildet das Vercel-Verhalten nach, um dist/ VOR dem
// Deploy realistisch zu prüfen (v. a. ob die CSP etwas blockiert).
//   node build.js && node preview-dist.mjs   →   http://localhost:4173
//
// - Serviert NUR dist/ (wie outputDirectory "dist" auf Vercel)
// - Setzt die Security-Header aus vercel.json (dieselbe Quelle wie das Deploy)
// - Wendet die Rewrites aus vercel.json an (Filesystem hat Vorrang, wie Vercel)
// - Stubbt POST /api/camp-anfragen mit {"ok":true} — es gehen KEINE Mails raus.
// Diese Datei steht nicht in der build.js-Allowlist und wird nie deployed.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const REPO = import.meta.dirname;
const DIST = path.join(REPO, 'dist');
const cfg = JSON.parse(fs.readFileSync(path.join(REPO, 'vercel.json'), 'utf8'));
const HEADERS = cfg.headers[0].headers;
const REWRITES = new Map(cfg.rewrites.map((r) => [r.source, r.destination]));

const MIME = {
    '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
    '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml',
    '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8',
    '.json': 'application/json',
};

const server = http.createServer((req, res) => {
    for (const h of HEADERS) res.setHeader(h.key, h.value);
    const url = new URL(req.url, 'http://localhost');
    let p = decodeURIComponent(url.pathname);

    if (p === '/api/camp-anfragen') {
        if (req.method !== 'POST') {
            res.writeHead(405, { 'content-type': 'application/json' });
            return res.end('{"error":"Nur POST erlaubt."}');
        }
        let body = '';
        req.on('data', (c) => (body += c));
        req.on('end', () => {
            console.log('[stub] POST /api/camp-anfragen →', body.slice(0, 300));
            setTimeout(() => {
                res.writeHead(200, { 'content-type': 'application/json' });
                res.end('{"ok":true}');
            }, 300);
        });
        return;
    }

    if (p === '/') p = '/index.html';
    let file = path.normalize(path.join(DIST, p));
    if (!fs.existsSync(file) && REWRITES.has(p)) file = path.join(DIST, REWRITES.get(p));
    if (!file.startsWith(DIST) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
        res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
        return res.end('404 — Not Found');
    }
    res.setHeader('content-type', MIME[path.extname(file)] || 'application/octet-stream');
    res.end(fs.readFileSync(file));
});

server.listen(4173, () => {
    console.log('dist-Testserver: http://localhost:4173 (Header + Rewrites aus vercel.json, Mail-Stub aktiv)');
});
