// Gemeinsames HTML-Email-Template für Bestätigungsmails an User.
// Dateiname beginnt mit `_` → Vercel behandelt das NICHT als Endpoint,
// sondern als internes Modul, das von echten Handlern importiert wird.
//
// Design-Sprache analog zur Website:
//   - Cream-BG (#F7F7F5), dunkler Text (#1A1A1A), Oliv-Akzent (#8A8F6A)
//   - Serif-Kicker/Signatur (Georgia-Fallback für Cormorant)
//   - Sans-Body (Arial/Helvetica-Fallback für Inter; custom Webfonts sind
//     in Mail-Clients nicht zuverlässig ladbar)
//   - Table-Layout für Outlook-Kompatibilität, inline styles überall
//
// Die Funktion buildConfirmationEmail() liefert sowohl HTML- als auch
// Plaintext-Version — Resend erwartet beides für Best-Practice-Zustellung.

// HTML-escape für User-Input, damit keine Tags in die Mail geschmuggelt werden können.
export function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Wandelt Zeilenumbrüche in <br> um (für die Darstellung der User-Nachricht).
function nl2br(str) {
    return escapeHtml(str).replace(/\r?\n/g, '<br>');
}

/**
 * Baut HTML + Text-Version einer Bestätigungsmail.
 *
 * @param {object} opts
 * @param {string} opts.headline     — z.B. "Danke, Maria."
 * @param {string} opts.intro        — Kurzer Absatz direkt unter der Headline
 * @param {string} [opts.detailLabel] — Optional, Label für den Info-Block (z.B. "Deine Anfrage")
 * @param {Array<{key:string,value:string}>} [opts.detailRows] — Optional, Key/Value-Pairs für den Info-Block
 * @param {string} [opts.messageBody] — Optional, originale User-Nachricht (wird mit nl2br gerendert)
 * @param {string} opts.closing      — Abschließender Satz vor der Signatur
 * @returns {{html:string,text:string}}
 */
export function buildConfirmationEmail(opts) {
    const headline = escapeHtml(opts.headline || '');
    const intro = escapeHtml(opts.intro || '');
    const closing = escapeHtml(opts.closing || '');

    // Detail-Block (Info-Tabelle zwischen zwei dünnen Linien)
    let detailBlock = '';
    if (opts.detailLabel && opts.detailRows && opts.detailRows.length) {
        const rows = opts.detailRows.map(row => `
            <tr>
                <td style="padding: 4px 0; font-family: Arial, Helvetica, sans-serif; font-size: 13px; line-height: 1.7; color: #6F6B63; font-weight: 300; width: 110px; vertical-align: top;">${escapeHtml(row.key)}</td>
                <td style="padding: 4px 0; font-family: Arial, Helvetica, sans-serif; font-size: 13px; line-height: 1.7; color: #1A1A1A; font-weight: 400; vertical-align: top;">${escapeHtml(row.value)}</td>
            </tr>
        `).join('');
        detailBlock = `
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 32px; border-top: 1px solid rgba(0,0,0,0.10); border-bottom: 1px solid rgba(0,0,0,0.10);">
                <tr>
                    <td style="padding: 20px 0 12px;">
                        <p style="margin:0 0 12px; font-family: Arial, Helvetica, sans-serif; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: #8A8F6A; font-weight: 600;">${escapeHtml(opts.detailLabel)}</p>
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                            ${rows}
                        </table>
                    </td>
                </tr>
            </table>
        `;
    }

    // Echo der Nachricht (nur Kontaktformular)
    let messageBlock = '';
    if (opts.messageBody) {
        messageBlock = `
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 32px;">
                <tr>
                    <td style="padding: 20px 24px; background-color: #EDECE8; border-left: 2px solid #8A8F6A;">
                        <p style="margin:0 0 10px; font-family: Arial, Helvetica, sans-serif; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: #6F6B63; font-weight: 600;">Deine Nachricht</p>
                        <p style="margin:0; font-family: Georgia, 'Times New Roman', serif; font-style: italic; font-size: 15px; line-height: 1.7; color: #1A1A1A; font-weight: 400;">${nl2br(opts.messageBody)}</p>
                    </td>
                </tr>
            </table>
        `;
    }

    const html = `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light only">
<title>${headline}</title>
</head>
<body style="margin:0; padding:0; background-color:#EDECE8; -webkit-font-smoothing:antialiased; -moz-osx-font-smoothing:grayscale;">
<!-- Preheader (unsichtbar, nur für Inbox-Vorschau) -->
<div style="display:none; max-height:0; overflow:hidden; mso-hide:all;">${intro}</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#EDECE8;">
    <tr>
        <td align="center" style="padding: 48px 16px;">
            <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; width:100%; background-color:#F7F7F5;">
                <!-- Content -->
                <tr>
                    <td style="padding: 56px 48px 48px;">
                        <!-- Brand Kicker -->
                        <p style="margin:0; font-family: Arial, Helvetica, sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase; color: #8A8F6A;">Kla &amp; Bauter</p>

                        <!-- Headline -->
                        <h1 style="margin: 28px 0 20px; font-family: Georgia, 'Times New Roman', serif; font-size: 30px; font-weight: 400; line-height: 1.2; color: #1A1A1A;">${headline}</h1>

                        <!-- Intro -->
                        <p style="margin:0 0 32px; font-family: Arial, Helvetica, sans-serif; font-size: 15px; line-height: 1.75; color: #1A1A1A; font-weight: 400;">${intro}</p>

                        ${detailBlock}
                        ${messageBlock}

                        <!-- Closing -->
                        <p style="margin:0 0 36px; font-family: Arial, Helvetica, sans-serif; font-size: 15px; line-height: 1.75; color: #1A1A1A; font-weight: 400;">${closing}</p>

                        <!-- Signature -->
                        <p style="margin:0; font-family: Georgia, 'Times New Roman', serif; font-style: italic; font-size: 16px; line-height: 1.5; color: #6F6B63;">
                            Bis bald —<br>
                            <span style="color:#1A1A1A;">Paul &amp; Adrian</span>
                        </p>
                    </td>
                </tr>

                <!-- Footer -->
                <tr>
                    <td style="padding: 24px 48px 32px; border-top: 1px solid rgba(0,0,0,0.08);">
                        <p style="margin: 0; font-family: Arial, Helvetica, sans-serif; font-size: 10px; line-height: 1.8; color: #6F6B63; letter-spacing: 0.1em; text-transform: uppercase;">
                            Kla &amp; Bauter Musikproduktion · Köln<br>
                            <a href="https://www.klaundbauter-musikproduktion.com" style="color:#6F6B63; text-decoration: none; border-bottom: 1px solid rgba(0,0,0,0.15);">klaundbauter-musikproduktion.com</a>
                        </p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
</body>
</html>`;

    // Plaintext-Version
    const textParts = [
        `KLA & BAUTER`,
        ``,
        opts.headline,
        ``,
        opts.intro,
    ];
    if (opts.detailLabel && opts.detailRows && opts.detailRows.length) {
        textParts.push('', `— ${opts.detailLabel} —`);
        opts.detailRows.forEach(row => {
            textParts.push(`${row.key}: ${row.value}`);
        });
    }
    if (opts.messageBody) {
        textParts.push('', '— Deine Nachricht —', opts.messageBody);
    }
    textParts.push(
        '',
        opts.closing,
        '',
        'Bis bald —',
        'Paul & Adrian',
        '',
        '—',
        'Kla & Bauter Musikproduktion · Köln',
        'https://www.klaundbauter-musikproduktion.com',
    );

    return { html, text: textParts.join('\n') };
}
