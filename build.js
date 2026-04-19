// Build-Script für Prerendered HTML pro Route.
//
// Was es tut:
//   1. Liest `routeMeta` aus script.js (Single Source of Truth).
//   2. Liest index.html als Template.
//   3. Für jede Route (ausser 'home') wird eine eigene HTML-Datei erstellt,
//      in der <title>, <meta description>, og:*, twitter:*, canonical mit
//      den Route-spezifischen Werten ersetzt sind.
//
// Wird bei `npm run build` aufgerufen — und automatisch vor jedem Vercel-Deploy.
// Die generierten Dateien (produktion.html usw.) liegen in .gitignore und
// werden bei jedem Build neu erzeugt.

import fs from 'node:fs';

const BASE_URL = 'https://www.klaundbauter-musikproduktion.com';
const TEMPLATE_PATH = 'index.html';
const SCRIPT_PATH = 'script.js';

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

// --- 3. Pro Route eine Variante erzeugen --------------------------------------
const routesToBuild = Object.entries(routeMeta).filter(([r]) => r !== 'home');
let built = 0;

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

    const outPath = `${route}.html`;
    fs.writeFileSync(outPath, html);
    console.log(`✓ ${outPath.padEnd(22)} → ${meta.title}`);
    built++;
}

console.log(`\n${built} Routes pre-rendered. index.html (home) bleibt unverändert.`);
