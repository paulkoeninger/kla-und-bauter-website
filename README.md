# Kla & Bauter — Website

Editoriale SPA für die Musikproduktion [Kla & Bauter](https://www.klaundbauter-musikproduktion.com) — Paul Köninger & Adrian Thessenvitz, Köln.

## Stack

- Vanilla HTML + CSS + JS (kein Framework)
- GSAP für Transitions und Parallax (CDN)
- Selbst gehostete Fonts (Inter + Cormorant)
- Cloudflare Hosting (Workers with Static Assets: `worker.js` + `dist/`) + Worker-Handler für Camp-Anfragen-Mails (via Resend)
- Pre-rendered HTML pro Route via `build.js`

## Entwickeln

```bash
# Lokaler Server (Wrangler CLI empfohlen, auch für Camp-Anfragen-Test)
npx wrangler dev

# oder einfach
python3 -m http.server 8000
```

## Deploy

Deploy läuft über Cloudflare (`wrangler deploy`, inkl. `node build.js` vorher). Unklar aus dem Repo allein, ob `git push` weiterhin automatisch deployed (kein CI-Workflow im Repo gefunden) — im Cloudflare-Dashboard unter Workers & Pages → Settings → Builds prüfen, ob eine Git-Integration aktiv ist, und diese Zeile entsprechend präzisieren.

## Dokumentation

- **[CLAUDE.md](CLAUDE.md)** — Projekt-Architektur, Konventionen, Custom Mechanisms, offene Tasks.
- **[docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md)** — Token-Referenz, Komponenten-Atlas (für CSS-Änderungen).
- **[docs/PERFORMANCE_AUDIT.md](docs/PERFORMANCE_AUDIT.md)** — Performance-Findings (April 2026).
- **[vision_vibe_language/kla-bauter-visionsdokument-v2.docx](vision_vibe_language/)** — Marken-Bibel (Single Source of Truth).

Marken-/Strategie-Doku (`brain/`) und Buchhaltung (`buchhaltung/`) liegen nur lokal und sind gitignored — Details in CLAUDE.md.
