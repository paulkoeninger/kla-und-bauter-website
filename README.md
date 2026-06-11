# Kla & Bauter — Website

Editoriale SPA für die Musikproduktion [Kla & Bauter](https://www.klaundbauter-musikproduktion.com) — Paul Köninger & Adrian Thessenvitz, Köln.

## Stack

- Vanilla HTML + CSS + JS (kein Framework)
- GSAP für Transitions und Parallax (CDN)
- Selbst gehostete Fonts (Inter + Cormorant)
- Vercel Hosting + Serverless Function für Camp-Anfragen-Mails (via Resend)
- Pre-rendered HTML pro Route via `build.js`

## Entwickeln

```bash
# Lokaler Server (Vercel CLI empfohlen, auch für Camp-Anfragen-Test)
vercel dev

# oder einfach
python3 -m http.server 8000
```

## Deploy

Push auf `main` → Vercel deployed automatisch (inkl. `node build.js` vor Ship).

## Dokumentation

- **[CLAUDE.md](CLAUDE.md)** — Projekt-Architektur, Konventionen, Custom Mechanisms, offene Tasks.
- **[docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md)** — Token-Referenz, Komponenten-Atlas (für CSS-Änderungen).
- **[docs/PERFORMANCE_AUDIT.md](docs/PERFORMANCE_AUDIT.md)** — Performance-Findings (April 2026).
- **[vision_vibe_language/kla-bauter-visionsdokument-v2.docx](vision_vibe_language/)** — Marken-Bibel (Single Source of Truth).

Marken-/Strategie-Doku (`brain/`) und Buchhaltung (`buchhaltung/`) liegen nur lokal und sind gitignored — Details in CLAUDE.md.
