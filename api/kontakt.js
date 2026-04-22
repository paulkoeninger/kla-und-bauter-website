// Vercel Serverless Function — Kontaktformular.
// Nimmt { name, email, interest, message } per POST. Sendet ZWEI Mails:
//   1) Team-Notification an KONTAKT_TO|CAMP_ANFRAGEN_TO (plaintext, intern)
//   2) Bestätigung an den User (styled HTML, inkl. Echo der Nachricht)
//
// Environment Variables (Vercel → Settings → Env):
//   RESEND_API_KEY     — geteilt mit Camp-Anfragen-Endpoint.
//   KONTAKT_FROM       — optional, fällt auf CAMP_ANFRAGEN_FROM zurück.
//   KONTAKT_TO         — optional, fällt auf CAMP_ANFRAGEN_TO zurück.

import { buildConfirmationEmail } from './_email.js';

const ALLOWED_INTERESTS = ['Songcamp', 'Lab', 'Session', 'Produktion'];

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Nur POST erlaubt.' });
    }

    const { name, email, interest, message } = req.body || {};

    if (typeof name !== 'string' || typeof email !== 'string' ||
        typeof interest !== 'string' || typeof message !== 'string') {
        return res.status(400).json({ error: 'Fehlende Felder.' });
    }

    const cleanName     = name.trim().slice(0, 120);
    const cleanEmail    = email.trim().slice(0, 200);
    const cleanInterest = interest.trim().slice(0, 40);
    const cleanMessage  = message.trim().slice(0, 4000);

    if (!cleanName || !cleanEmail || !cleanInterest || !cleanMessage) {
        return res.status(400).json({ error: 'Fehlende Felder.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
        return res.status(400).json({ error: 'Ungültige E-Mail-Adresse.' });
    }
    if (!ALLOWED_INTERESTS.includes(cleanInterest)) {
        return res.status(400).json({ error: 'Ungültige Auswahl.' });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.KONTAKT_FROM || process.env.CAMP_ANFRAGEN_FROM;
    const to = process.env.KONTAKT_TO || process.env.CAMP_ANFRAGEN_TO;

    if (!apiKey || !from || !to) {
        console.error('Kontakt: Env-Vars fehlen (RESEND_API_KEY / KONTAKT_FROM|CAMP_ANFRAGEN_FROM / KONTAKT_TO|CAMP_ANFRAGEN_TO)');
        return res.status(500).json({ error: 'Mail-Service ist gerade nicht erreichbar.' });
    }

    // --- 1) Team-Benachrichtigung (intern, plaintext) -----------------------
    const teamSubject = `Kontaktanfrage (${cleanInterest}) — ${cleanName}`;
    const teamBody = [
        `Neue Kontaktanfrage über das Website-Formular.`,
        ``,
        `Interesse:  ${cleanInterest}`,
        `Name:       ${cleanName}`,
        `Mail:       ${cleanEmail}`,
        ``,
        `Nachricht:`,
        cleanMessage,
        ``,
        `— Website-Formular`,
    ].join('\n');

    // --- 2) User-Bestätigung (styled HTML) ----------------------------------
    const firstName = cleanName.split(/\s+/)[0] || cleanName;
    const confirmation = buildConfirmationEmail({
        headline: `Danke, ${firstName}.`,
        intro: `deine Nachricht ist bei uns angekommen — wir freuen uns, von dir zu lesen.`,
        detailLabel: 'Deine Anfrage',
        detailRows: [
            { key: 'Interesse', value: cleanInterest },
            { key: 'Name', value: cleanName },
            { key: 'Mail', value: cleanEmail },
        ],
        messageBody: cleanMessage,
        closing: `Wir lesen jede Zuschrift und melden uns persönlich — meistens innerhalb von ein paar Tagen. Wenn dir noch etwas einfällt, antworte einfach auf diese Mail.`,
    });

    const userSubject = `Danke für deine Nachricht — Kla & Bauter`;

    const [teamResult, userResult] = await Promise.allSettled([
        sendMail({ apiKey, from, to: [to], replyTo: cleanEmail, subject: teamSubject, text: teamBody }),
        sendMail({ apiKey, from, to: [cleanEmail], subject: userSubject, text: confirmation.text, html: confirmation.html }),
    ]);

    if (teamResult.status === 'rejected' || teamResult.value?.ok === false) {
        const err = teamResult.status === 'rejected' ? teamResult.reason : teamResult.value?.errText;
        console.error('Kontakt: Team-Mail fehlgeschlagen:', err);
        return res.status(502).json({ error: 'Mail konnte nicht gesendet werden.' });
    }

    if (userResult.status === 'rejected' || userResult.value?.ok === false) {
        const err = userResult.status === 'rejected' ? userResult.reason : userResult.value?.errText;
        console.error('Kontakt: User-Bestätigung fehlgeschlagen (Team-Mail war ok):', err);
    }

    return res.status(200).json({ ok: true });
}

async function sendMail({ apiKey, from, to, replyTo, subject, text, html }) {
    const payload = { from, to, subject, text };
    if (html) payload.html = html;
    if (replyTo) payload.reply_to = replyTo;

    try {
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
    } catch (err) {
        throw err;
    }
}
