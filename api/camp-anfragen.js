// Vercel Serverless Function — Songcamp-Anfragen.
// Nimmt { name, email, camp } per POST, sendet Mail via Resend API.
//
// Erforderliche Environment Variables (im Vercel Dashboard → Settings → Env):
//   RESEND_API_KEY        — API-Key von resend.com
//   CAMP_ANFRAGEN_FROM    — Absender, z.B. "Kla & Bauter <hallo@klaundbauter-musikproduktion.com>"
//                           (Domain muss in Resend verifiziert sein; sonst
//                           "onboarding@resend.dev" zum Testen)
//   CAMP_ANFRAGEN_TO      — Empfänger, z.B. "hallo@klaundbauter-musikproduktion.com"

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

    const subject = `Camp-Anfrage: ${cleanCamp}`;
    const body = [
        `Neue unverbindliche Anfrage zum Songcamp.`,
        ``,
        `Camp:  ${cleanCamp}`,
        `Name:  ${cleanName}`,
        `Mail:  ${cleanEmail}`,
        ``,
        `— Website-Formular`,
    ].join('\n');

    try {
        const mail = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from,
                to: [to],
                reply_to: cleanEmail,
                subject,
                text: body,
            }),
        });

        if (!mail.ok) {
            const errText = await mail.text().catch(() => '');
            console.error('Resend API error:', mail.status, errText);
            return res.status(502).json({ error: 'Mail konnte nicht gesendet werden.' });
        }

        return res.status(200).json({ ok: true });
    } catch (err) {
        console.error('Camp-Anfragen handler error:', err);
        return res.status(500).json({ error: 'Unerwarteter Fehler.' });
    }
}
