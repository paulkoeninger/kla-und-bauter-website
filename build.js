// Build-Script für Prerendered HTML pro Route + Deploy-Verzeichnis dist/.
//
// Was es tut:
//   1. Liest `routeMeta` aus script.js (Single Source of Truth).
//   2. Liest index.html als Template.
//   3. Baut dist/ komplett neu auf — als ALLOWLIST: Nur Dateien, die die
//      Website wirklich braucht, werden hineinkopiert. Interne Dateien
//      (CLAUDE.md, docs/, PROJECT.md, build.js, vercel.json, api-Quellcode,
//      brain/, buchhaltung/ …) landen dadurch nie im öffentlichen Deploy.
//      vercel.json zeigt mit outputDirectory auf "dist".
//   4. Für jede Route (ausser 'home') wird eine eigene HTML-Datei in dist/
//      erstellt, in der <title>, <meta description>, og:*, twitter:*,
//      canonical mit den Route-spezifischen Werten ersetzt sind.
//   5. Minifiziert das HTML (Whitespace zwischen Tags, Kommentare, Leerzeilen)
//      — konservativ: <script>/<style>/<pre>/<textarea>-Inhalt bleibt intakt.
//   6. Referenz-Check: Verweist gebautes HTML/CSS auf eine lokale Datei, die
//      in dist/ fehlt, bricht der Build mit Fehler ab. Schützt davor, beim
//      Erweitern der Website ein Asset zu vergessen.
//
// Wird bei `npm run build` aufgerufen — und automatisch vor jedem Vercel-Deploy.

import fs from 'node:fs';
import path from 'node:path';

const BASE_URL = 'https://www.klaundbauter-musikproduktion.com';
const TEMPLATE_PATH = 'index.html';
const SCRIPT_PATH = 'script.js';
const MINIFY = true;
const DIST = 'dist';

// Allowlist: Was gehört ins öffentliche Deploy?
const COPY_FILES = [
    'index.html', 'style.css', 'script.js',
    'robots.txt', 'sitemap.xml', 'llms.txt',
    'favicon-32.png', 'favicon-32-dark.png',
    'apple-touch-icon.png', 'apple-touch-icon-dark.png',
    '_redirects', '_headers',
];
const COPY_DIRS = ['fonts', 'images', 'Logo', 'js', '.well-known'];

// --- 1. routeMeta aus script.js extrahieren ----------------------------------
const scriptSrc = fs.readFileSync(SCRIPT_PATH, 'utf8');
const routeMetaMatch = scriptSrc.match(/const routeMeta = (\{[\s\S]*?\n    \});/);
if (!routeMetaMatch) {
    console.error('Fehler: routeMeta konnte in script.js nicht gefunden werden.');
    process.exit(1);
}
// eslint-disable-next-line no-eval
const routeMeta = eval('(' + routeMetaMatch[1] + ')');

// --- 2. Template laden --------------------------------------------------------
const template = fs.readFileSync(TEMPLATE_PATH, 'utf8');

// HTML-escape für Meta-Werte (Anführungszeichen, Ampersands)
const escape = (s) => String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

// --- Minifier ----------------------------------------------------------------
// Entfernt HTML-Kommentare (außer JSON-LD / Conditional-Comment-Markern) und
// kollabiert Whitespace zwischen Tags auf das nötige Minimum.
// Inhalte von <script>, <style>, <pre>, <textarea> bleiben Byte-genau erhalten.
function minifyHtml(html) {
    const PROTECT = ['script', 'style', 'pre', 'textarea'];
    const stash = [];
    // Regex matched opening tag, content, closing tag — multiline
    const re = new RegExp(
        `<(${PROTECT.join('|')})\\b[^>]*>[\\s\\S]*?<\\/\\1>`,
        'gi'
    );
    let protectedHtml = html.replace(re, (match) => {
        const token = `__PROTECT_${stash.length}__`;
        stash.push(match);
        return token;
    });

    // Kommentare entfernen — aber keine IE-Conditionals (<!--[if), die es
    // in diesem Projekt nicht gibt. JSON-LD ist in <script>, also schon protected.
    protectedHtml = protectedHtml.replace(/<!--[\s\S]*?-->/g, '');

    // Kollabiere Whitespace zwischen Tags
    protectedHtml = protectedHtml
        // Mehrfache Leerzeichen/Tabs/Newlines zwischen > und < zu einem Space
        .replace(/>\s+</g, '><')
        // Führendes/trailing Whitespace pro Zeile, dann Leerzeilen raus
        .replace(/[ \t]+/g, ' ')
        .replace(/\n\s*\n/g, '\n')
        .trim();

    // Wiederhergestellt
    return protectedHtml.replace(/__PROTECT_(\d+)__/g, (_, i) => stash[Number(i)]);
}

// --- 3. dist/ frisch aufbauen --------------------------------------------------
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });

const skipJunk = (src) => path.basename(src) !== '.DS_Store';
for (const file of COPY_FILES) {
    fs.copyFileSync(file, path.join(DIST, file));
}
for (const dir of COPY_DIRS) {
    fs.cpSync(dir, path.join(DIST, dir), { recursive: true, filter: skipJunk });
}

// --- 4. Pro Route eine Variante erzeugen --------------------------------------
const routesToBuild = Object.entries(routeMeta).filter(([r]) => r !== 'home');
let built = 0;
let totalBytesBefore = 0;
let totalBytesAfter = 0;

for (const [route, meta] of routesToBuild) {
    const routePath = '/' + route;
    const url = BASE_URL + routePath;
    const title = escape(meta.title);
    const description = escape(meta.description);

    let html = template;

    html = html.replace(
        /<title>[^<]*<\/title>/,
        `<title>${title}</title>`
    );
    html = html.replace(
        /<meta name="description" content="[^"]*">/,
        `<meta name="description" content="${description}">`
    );
    html = html.replace(
        /<link rel="canonical" href="[^"]*">/,
        `<link rel="canonical" href="${url}">`
    );
    html = html.replace(
        /<meta property="og:title" content="[^"]*">/,
        `<meta property="og:title" content="${title}">`
    );
    html = html.replace(
        /<meta property="og:description" content="[^"]*">/,
        `<meta property="og:description" content="${description}">`
    );
    html = html.replace(
        /<meta property="og:url" content="[^"]*">/,
        `<meta property="og:url" content="${url}">`
    );
    html = html.replace(
        /<meta name="twitter:title" content="[^"]*">/,
        `<meta name="twitter:title" content="${title}">`
    );
    html = html.replace(
        /<meta name="twitter:description" content="[^"]*">/,
        `<meta name="twitter:description" content="${description}">`
    );

    const bytesBefore = Buffer.byteLength(html, 'utf8');
    if (MINIFY) html = minifyHtml(html);
    const bytesAfter = Buffer.byteLength(html, 'utf8');
    totalBytesBefore += bytesBefore;
    totalBytesAfter += bytesAfter;

    const outPath = path.join(DIST, `${route}.html`);
    fs.writeFileSync(outPath, html);
    const savedPct = ((1 - bytesAfter / bytesBefore) * 100).toFixed(1);
    console.log(`✓ ${(route + '.html').padEnd(22)} ${(bytesAfter / 1024).toFixed(1)} KB (-${savedPct}%) → ${meta.title}`);
    built++;
}

// --- 5. Referenz-Check ----------------------------------------------------------
// Sammelt alle lokalen Datei-Verweise aus dem gebauten HTML/CSS und prüft,
// ob sie in dist/ existieren. Routen-Links (/produktion) haben keine Endung
// und werden übersprungen — geprüft werden nur echte Dateien.
function checkReferences() {
    const refs = new Set();
    const addRef = (raw, basePrefix = '') => {
        if (!raw) return;
        let ref = raw.trim().replace(/^['"]|['"]$/g, '').trim();
        if (!ref || /^(data:|https?:|mailto:|tel:|#|\/\/)/i.test(ref)) return;
        ref = ref.split('#')[0].split('?')[0];
        if (!ref) return;
        ref = decodeURIComponent(ref);
        ref = ref.startsWith('/') ? ref.slice(1) : basePrefix + ref;
        if (!/\.[a-z0-9]+$/i.test(ref)) return; // keine Datei-Endung → Route, kein Asset
        refs.add(ref);
    };

    for (const file of fs.readdirSync(DIST)) {
        if (!file.endsWith('.html')) continue;
        const html = fs.readFileSync(path.join(DIST, file), 'utf8');
        for (const m of html.matchAll(/\b(?:src|href)="([^"]+)"/g)) addRef(m[1]);
        for (const m of html.matchAll(/\b(?:imagesrcset|srcset)="([^"]+)"/g)) {
            for (const part of m[1].split(',')) addRef(part.trim().split(/\s+/)[0]);
        }
    }
    for (const m of fs.readFileSync(path.join(DIST, 'style.css'), 'utf8').matchAll(/url\(([^)]+)\)/g)) {
        addRef(m[1]);
    }
    for (const m of fs.readFileSync(path.join(DIST, 'fonts', 'fonts.css'), 'utf8').matchAll(/url\(([^)]+)\)/g)) {
        addRef(m[1], 'fonts/');
    }

    const missing = [...refs].filter((ref) => !fs.existsSync(path.join(DIST, ref)));
    return { checked: refs.size, missing };
}

const { checked, missing } = checkReferences();
if (missing.length) {
    console.error(`\nFEHLER: ${missing.length} referenzierte Datei(en) fehlen in ${DIST}/:`);
    for (const ref of missing) console.error(`  ✗ ${ref}`);
    process.exit(1);
}

const totalSaved = ((1 - totalBytesAfter / totalBytesBefore) * 100).toFixed(1);
console.log(`\n${built} Routes pre-rendered → ${DIST}/`);
if (MINIFY) {
    console.log(`Minified: ${(totalBytesBefore / 1024).toFixed(1)} KB → ${(totalBytesAfter / 1024).toFixed(1)} KB (-${totalSaved}%)`);
}
console.log(`Referenz-Check: ${checked} lokale Datei-Verweise geprüft, alle vorhanden.`);
console.log(`Deploy-Inhalt: ${COPY_FILES.length} Dateien + ${COPY_DIRS.join('/, ')}/ + ${built} Routen-HTMLs. index.html (home) bleibt unverändert.`);
