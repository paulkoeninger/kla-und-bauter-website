// Vercel Serverless Function — Songcamp-Anfragen.
// Nimmt { name, email, camp } per POST. Sendet ZWEI Mails via Resend:
//   1) Team-Notification an CAMP_ANFRAGEN_TO (plaintext, intern)
//   2) Bestätigung an den User (styled HTML + Plaintext)
//
// Erforderliche Environment Variables (Vercel → Settings → Env):
//   RESEND_API_KEY        — API-Key von resend.com
//   CAMP_ANFRAGEN_FROM    — Absender, z.B. "Kla & Bauter <hallo@klaundbauter-musikproduktion.com>"
//                           (Domain muss in Resend verifiziert sein; sonst
//                           "onboarding@resend.dev" zum Testen)
//   CAMP_ANFRAGEN_TO      — Empfänger (euer Postfach)

import { buildConfirmationEmail } from './_email.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Nur POST erlaubt.' });
    }

    const { name, email, camp } = req.body || {};

    if (typeof name !== 'string' || typeof email !== 'string' || typeof camp !== 'string') {
        return res.status(400).json({ error: 'Fehlende Felder.' });
    }
    const cleanName = name.trim().slice(0, 120);
    const cleanEmail = email.trim().slice(0, 200);
    const cleanCamp = camp.trim().slice(0, 80);

    if (!cleanName || !cleanEmail || !cleanCamp) {
        return res.status(400).json({ error: 'Fehlende Felder.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
        return res.status(400).json({ error: 'Ungültige E-Mail-Adresse.' });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.CAMP_ANFRAGEN_FROM;
    const to = process.env.CAMP_ANFRAGEN_TO;

    if (!apiKey || !from || !to) {
        console.error('Camp-Anfragen: Env-Vars fehlen (RESEND_API_KEY / CAMP_ANFRAGEN_FROM / CAMP_ANFRAGEN_TO)');
        return res.status(500).json({ error: 'Mail-Service ist gerade nicht erreichbar.' });
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
        return res.status(502).json({ error: 'Mail konnte nicht gesendet werden.' });
    }

    if (userResult.status === 'rejected' || userResult.value?.ok === false) {
        const err = userResult.status === 'rejected' ? userResult.reason : userResult.value?.errText;
        console.error('Camp-Anfragen: User-Bestätigung fehlgeschlagen (Team-Mail war ok):', err);
        // User bekommt trotzdem success zurück — wir haben die Anfrage.
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
