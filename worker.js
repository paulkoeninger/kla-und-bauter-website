// Worker-Einstiegspunkt für "Workers with Static Assets".
//
// Ersetzt die Pages-Functions-Autoroutierung (das functions/-Verzeichnis
// wird von diesem Deploy-Modell nicht automatisch geroutet — Cloudflare
// verlangt dafür ein einzelnes Worker-Script mit main-Entry, siehe
// wrangler.jsonc). run_worker_first in wrangler.jsonc sorgt dafür, dass
// nur /api/* durch diesen fetch-Handler läuft; alles andere wird direkt
// aus dist/ als Static Asset ausgeliefert (inkl. _headers/_redirects),
// ohne den Worker überhaupt aufzurufen.

import { handleCampAnfragen } from './functions/api/camp-anfragen.js';

export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        if (url.pathname === '/api/camp-anfragen') {
            if (request.method !== 'POST') {
                return new Response('Method Not Allowed', {
                    status: 405,
                    headers: { Allow: 'POST' },
                });
            }
            return handleCampAnfragen({ request, env });
        }

        return env.ASSETS.fetch(request);
    },
};
