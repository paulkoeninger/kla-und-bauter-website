// Build-Script für Prerendered HTML pro Route.
//
// Was es tut:
//   1. Liest `routeMeta` aus script.js (Single Source of Truth).
//   2. Liest index.html als Template.
//   3. Für jede Route (ausser 'home') wird eine eigene HTML-Datei erstellt,
//      in der <title>, <meta description>, og:*, twitter:*, canonical mit
//      den Route-spezifischen Werten ersetzt sind.
//   4. Minifiziert das HTML (Whitespace zwischen Tags, Kommentare, Leerzeilen)
//      — konservativ: <script>/<style>/<pre>/<textarea>-Inhalt bleibt intakt.
//
// Wird bei `npm run build` aufgerufen — und automatisch vor jedem Vercel-Deploy.
// Die generierten Dateien (produktion.html usw.) liegen in .gitignore und
// werden bei jedem Build neu erzeugt.

import fs from 'node:fs';

const BASE_URL = 'https://www.klaundbauter-musikproduktion.com';
const TEMPLATE_PATH = 'index.html';
const SCRIPT_PATH = 'script.js';
const MINIFY = true;

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

// --- 3. Pro Route eine Variante erzeugen --------------------------------------
const routesToBuild = Object.entries(routeMeta).filter(([r]) => r !== 'home');
let built = 0;
let totalBytesBefore = 0;
let totalBytesAfter = 0;

for (const [route, meta] of routesToBuild) {
    const path = '/' + route;
    const url = BASE_URL + path;
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

    const outPath = `${route}.html`;
    fs.writeFileSync(outPath, html);
    const savedPct = ((1 - bytesAfter / bytesBefore) * 100).toFixed(1);
    console.log(`✓ ${outPath.padEnd(22)} ${(bytesAfter / 1024).toFixed(1)} KB (-${savedPct}%) → ${meta.title}`);
    built++;
}

const totalSaved = ((1 - totalBytesAfter / totalBytesBefore) * 100).toFixed(1);
console.log(`\n${built} Routes pre-rendered.`);
if (MINIFY) {
    console.log(`Minified: ${(totalBytesBefore / 1024).toFixed(1)} KB → ${(totalBytesAfter / 1024).toFixed(1)} KB (-${totalSaved}%)`);
}
console.log('index.html (home) bleibt unverändert.');
