// Songcamp-Anfragen-Handler — läuft als Cloudflare Worker.
// Portiert von der Vercel Serverless Function unter api/camp-anfragen.js
// (Git-History hat das Original). Wird explizit aus worker.js für
// POST /api/camp-anfragen aufgerufen (kein Pages-Functions-Autorouting —
// das functions/-Verzeichnis wird unter "Workers with Static Assets"
// nicht automatisch geroutet). Frontend braucht keine Anpassung, die
// Route bleibt gleich.
//
// Nimmt { name, email, camp, website (Honeypot), renderedAt } per POST.
// Sendet ZWEI Mails via Resend:
//   1) Team-Notification an CAMP_ANFRAGEN_TO (plaintext, intern)
//   2) Bestätigung an den User (styled HTML + Plaintext)
//
// Spam-Schutz (Stufe 1, ohne externe Services):
//   a) Origin/Referer-Check — POST muss von der Produktiv-Domain kommen
//   b) Honeypot — `website` muss vorhanden UND leer sein (fehlt es: Bot,
//      der das Formular nie gerendert hat)
//   c) Timing-Check — `renderedAt` ist Pflicht; Submission < 2s nach
//      Page-Render oder älter als 24h = Bot
//   d) Content-Type muss application/json sein (wie unser Frontend sendet)
//   e) Rate-Limit pro IP (in-memory, pro Worker-Isolate — siehe Hinweis unten)
//   Bei Spam-Verdacht antworten wir mit 200 OK (still drop) — der Bot soll
//   nicht lernen, woran's gescheitert ist.
//
// Erforderliche Environment Variables (Cloudflare Dashboard -> Workers &
// Pages -> [Projekt] -> Settings -> Variables and Secrets eintragen):
//   RESEND_API_KEY        — API-Key von resend.com
//   CAMP_ANFRAGEN_FROM    — Absender, z.B. "Kla & Bauter <hallo@klaundbauter-musikproduktion.com>"
//                           (Domain muss in Resend verifiziert sein; sonst
//                           "onboarding@resend.dev" zum Testen)
//   CAMP_ANFRAGEN_TO      — Empfänger (euer Postfach)

import { buildConfirmationEmail } from '../../lib/email.js';

const ALLOWED_ORIGINS = [
    'https://www.klaundbauter-musikproduktion.com',
    'https://klaundbauter-musikproduktion.com',
];
const MIN_RENDER_TO_SUBMIT_MS = 2000;          // < 2 s seit Page-Render = Bot
const MAX_RENDER_AGE_MS = 1000 * 60 * 60 * 24; // > 24 h = stale, drop

// Rate-Limit pro IP. In-memory heißt: Jedes Worker-Isolate zählt für sich,
// nach Cold-Start ist der Zähler leer. Das bremst naive Floods zuverlässig,
// ist aber kein hartes Limit — dafür bräuchten wir Cloudflare Rate Limiting
// Rules (Dashboard -> Security -> WAF). Gleiche Einschränkung galt schon
// auf Vercel, keine Verschlechterung durch den Umzug.
const RATE_WINDOW_MS = 10 * 60 * 1000; // 10-Minuten-Fenster
const RATE_MAX = 5;                    // max. Submissions pro IP im Fenster
const rateMap = new Map();

function isRateLimited(ip) {
    const now = Date.now();
    if (rateMap.size > 1000) {
        for (const [key, entry] of rateMap) {
            if (now - entry.windowStart > RATE_WINDOW_MS) rateMap.delete(key);
        }
    }
    const entry = rateMap.get(ip);
    if (!entry || now - entry.windowStart > RATE_WINDOW_MS) {
        rateMap.set(ip, { windowStart: now, count: 1 });
        return false;
    }
    entry.count += 1;
    return entry.count > RATE_MAX;
}

function json(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json' },
    });
}

// handleCampAnfragen({ request, env }) statt Vercels handler(req, res) —
// die Methodenprüfung (nur POST erlaubt, das ersetzt Vercels
// "if (req.method !== 'POST')"-Check) übernimmt worker.js, bevor es
// hierher routet.
export async function handleCampAnfragen({ request, env }) {
    // ---- Spam-Check d) Content-Type ------------------------------------
    // Unser Frontend sendet immer application/json — alles andere ist kein
    // echter Formular-Submit.
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
        console.warn('[camp-anfragen] blocked: wrong content-type', { contentType });
        return json({ ok: true }); // still drop
    }

    // ---- Spam-Check a) Origin / Referer -------------------------------
    // Läuft als einzelner Worker ohne Pages-Preview-Branch-Konzept — der
    // Check gilt daher immer (kein "nur in Production"-Sonderfall mehr,
    // ein CF_PAGES_BRANCH-Äquivalent gibt es unter Workers zur Laufzeit
    // nicht).
    const origin = request.headers.get('origin') || '';
    const referer = request.headers.get('referer') || '';
    const fromAllowedOrigin = ALLOWED_ORIGINS.includes(origin);
    const fromAllowedReferer = ALLOWED_ORIGINS.some((o) => referer.startsWith(o));
    if (!fromAllowedOrigin && !fromAllowedReferer) {
        console.warn('[camp-anfragen] blocked: bad origin/referer', { origin, referer });
        return json({ ok: true }); // still drop
    }

    // ---- Spam-Check e) Rate-Limit pro IP --------------------------------
    // CF-Connecting-IP ist Cloudflares verlässlicher Client-IP-Header
    // (Ersatz für Vercels x-forwarded-for).
    const clientIp = request.headers.get('CF-Connecting-IP') || 'unknown';
    if (isRateLimited(clientIp)) {
        console.warn('[camp-anfragen] blocked: rate limit', { ip: clientIp });
        return json({ ok: true }); // still drop
    }

    let body;
    try {
        body = await request.json();
    } catch {
        return json({ ok: true }); // kein valides JSON — still drop
    }
    const { name, email, camp, website, renderedAt } = body || {};

    // ---- Spam-Check b) Honeypot --------------------------------------
    // Das Feld "website" ist im Form versteckt (off-screen via CSS).
    // Unser Frontend sendet es IMMER mit (leer). Fehlt es → Bot, der das
    // Formular nie gerendert hat. Steht was drin → Bot, der es ausgefüllt hat.
    if (typeof website !== 'string') {
        console.warn('[camp-anfragen] blocked: honeypot field missing');
        return json({ ok: true }); // still drop
    }
    if (website.trim() !== '') {
        console.warn('[camp-anfragen] blocked: honeypot triggered', { hp: website.slice(0, 80) });
        return json({ ok: true }); // still drop
    }

    // ---- Spam-Check c) Timing ----------------------------------------
    // Form wird beim Page-Render mit Timestamp markiert. Unser Frontend
    // sendet renderedAt IMMER mit — fehlt es → Bot. Wenn der Submit
    // unrealistisch schnell ODER steinalt ist → ebenfalls Bot.
    if (typeof renderedAt !== 'number' || !Number.isFinite(renderedAt)) {
        console.warn('[camp-anfragen] blocked: renderedAt missing');
        return json({ ok: true }); // still drop
    }
    const age = Date.now() - renderedAt;
    if (age < MIN_RENDER_TO_SUBMIT_MS || age > MAX_RENDER_AGE_MS) {
        console.warn('[camp-anfragen] blocked: timing suspicious', { age });
        return json({ ok: true }); // still drop
    }

    // ---- Reguläre Validierung -----------------------------------------
    if (typeof name !== 'string' || typeof email !== 'string' || typeof camp !== 'string') {
        return json({ error: 'Fehlende Felder.' }, 400);
    }
    const cleanName = name.trim().slice(0, 120);
    const cleanEmail = email.trim().slice(0, 200);
    const cleanCamp = camp.trim().slice(0, 80);

    if (!cleanName || !cleanEmail || !cleanCamp) {
        return json({ error: 'Fehlende Felder.' }, 400);
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
        return json({ error: 'Ungültige E-Mail-Adresse.' }, 400);
    }

    const apiKey = env.RESEND_API_KEY;
    const from = env.CAMP_ANFRAGEN_FROM;
    const to = env.CAMP_ANFRAGEN_TO;

    if (!apiKey || !from || !to) {
        console.error('Camp-Anfragen: Env-Vars fehlen (RESEND_API_KEY / CAMP_ANFRAGEN_FROM / CAMP_ANFRAGEN_TO)');
        return json({ error: 'Mail-Service ist gerade nicht erreichbar.' }, 500);
    }

    // --- 1) Team-Benachrichtigung (intern, plaintext) -----------------------
    const teamSubject = `Camp-Anfrage: ${cleanCamp}`;
    const teamBody = [
        `Neue unverbindliche Anfrage zum Songcamp.`,
        ``,
        `Camp:  ${cleanCamp}`,
        `Name:  ${cleanName}`,
        `Mail:  ${cleanEmail}`,
        ``,
        `— Website-Formular`,
    ].join('\n');

    // --- 2) User-Bestätigung (styled HTML) ----------------------------------
    const firstName = cleanName.split(/\s+/)[0] || cleanName;
    const confirmation = buildConfirmationEmail({
        headline: `Danke, ${firstName}.`,
        intro: `deine unverbindliche Anfrage zum ${cleanCamp} ist bei uns angekommen. Wir freuen uns, dass du dabei sein willst.`,
        detailLabel: 'Deine Anfrage',
        detailRows: [
            { key: 'Camp', value: cleanCamp },
            { key: 'Name', value: cleanName },
            { key: 'Mail', value: cleanEmail },
        ],
        closing: `Wir melden uns in den nächsten Tagen persönlich mit allen Infos zum Camp und zur Anreise. Wenn dir davor etwas einfällt, was du uns mitgeben möchtest — schreib einfach auf diese Mail zurück.`,
    });

    const userSubject = `Deine Anfrage zum ${cleanCamp} — Kla & Bauter`;

    // Beide Mails parallel senden. Team-Mail muss klappen, User-Bestätigung
    // ist nice-to-have (kein Fehler für den User, wenn sie fehlschlägt).
    const [teamResult, userResult] = await Promise.allSettled([
        sendMail({ apiKey, from, to: [to], replyTo: cleanEmail, subject: teamSubject, text: teamBody }),
        sendMail({ apiKey, from, to: [cleanEmail], subject: userSubject, text: confirmation.text, html: confirmation.html }),
    ]);

    if (teamResult.status === 'rejected' || teamResult.value?.ok === false) {
        const err = teamResult.status === 'rejected' ? teamResult.reason : teamResult.value?.errText;
        console.error('Camp-Anfragen: Team-Mail fehlgeschlagen:', err);
        return json({ error: 'Mail konnte nicht gesendet werden.' }, 502);
    }

    if (userResult.status === 'rejected' || userResult.value?.ok === false) {
        const err = userResult.status === 'rejected' ? userResult.reason : userResult.value?.errText;
        console.error('Camp-Anfragen: User-Bestätigung fehlgeschlagen (Team-Mail war ok):', err);
        // User bekommt trotzdem success zurück — wir haben die Anfrage.
    }

    return json({ ok: true });
}

async function sendMail({ apiKey, from, to, replyTo, subject, text, html }) {
    const payload = { from, to, subject, text };
    if (html) payload.html = html;
    if (replyTo) payload.reply_to = replyTo;

    const resp = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });
    if (!resp.ok) {
        const errText = await resp.text().catch(() => '');
        return { ok: false, status: resp.status, errText };
    }
    return { ok: true };
}
