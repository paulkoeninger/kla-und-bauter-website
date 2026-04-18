# Kla & Bauter - Project Identity & Architecture

This project is a high-end, editorial, single-page application (SPA) for the music production duo "Kla & Bauter". The design philosophy favors minimalism, deliberate pacing, high-end typography, and subtle, physical-feeling micro-animations.

## 1. Design System & Aesthetics
- **Core Identity:** Editorial, calm, noble, high-end. "Hollywood-Gefühl". 
- **Colors:** Deep, dark backgrounds with pure whites and a subtle accent color (`--accent-color`).
- **Typography:** Uses premium, highly legible fonts (`var(--font-primary)`, `var(--font-secondary)`).
- **Interactions:** Animations must use long durations (e.g. `0.6s` to `1.2s`) and cinematic easing curves (like `cubic-bezier(0.16, 1, 0.3, 1)` or GSAP's `power3.out`). **No sudden snapping or aggressive bouncing.**
- **Layouts:** Relies heavily on CSS native `scroll-snap` (`.snap-block`) for immersive, full-viewport pacing. Give the text room to breathe. Do not pack the screen.

## 2. Technical Architecture & Rules
- **SPA Only (DO NOT split files):** The entire website operates within `index.html`. Sections are shown/hidden dynamically.
- **Routing Engine:** Navigation uses a custom implementation of the HTML5 History API (`pushState`/`popstate`). 
  - Changing sections updates the URL logically (e.g., `/songcamps`) and fades out via GSAP timelines. 
  - **Crucial:** There is a `try/catch` fallback in `script.js` to intercept `SecurityError` exceptions from the History API. This guarantees the site still animates perfectly if tested locally via desktop double-click (`file:///` protocol).
- **Animation Stack:** Relies on **GSAP** for spatial transitions and complex timelines.
- **Scroll Triggers:** Managed by a native `IntersectionObserver` (`klabauterObserver` in `script.js`). Elements start invisible (`opacity: 0; transform: translateY(16px);`) in CSS and trigger smoothly.

## 3. Notable Custom Mechanisms (Careful When Editing)
- **Interactive Editorial Text Reveal (Songcamp "Das Versprechen"):** Utilizes a sophisticated 60-FPS `requestAnimationFrame` loop that calculates exact DOM span `getBoundingClientRect()` bounds to create a strict, gapless left-to-right reading experience. Contains an anti-skip mechanic.
- **Immersive Teaser Background:** Uses an ultra-slow 45-second CSS `@keyframes` zoom loop (`slowZoom`) to give the image life without distracting the eye.
- **Isolated Component Hovers:** Hover interactions (like the CTA arrow) use highly customized `cubic-bezier` timing functions. They only trigger when the user explicitly hovers the actual element, not generic containers.

## 4. Current State & Known Considerations
- The base routing and high-end animations are fully intact.
- **Deployment Requirement:** Server configuration will eventually require rewrite rules (e.g., standard `.htaccess` or `_redirects` file mapping `/*` to `/index.html`) so the SPA routing flawlessly intercepts deep links in production.

**Developer Instruction:** When extending this project, prioritize elegant constraints over flashy chaos. Strictly reuse the existing `snap-block` HTML structure for scrolling content. Do not use generic utility frameworks. Use the semantic CSS variables and GSAP sequence parameters established in `style.css` and `script.js`.

## 5. Vertiefende Dokumentation
Schlanke, thematisch sortierte Markdown-Dateien unter [`docs/`](docs/). Bei Session-Start nur das laden, was zur Aufgabe passt:
- [`docs/BRAND.md`](docs/BRAND.md) — Marke, Positionierung, Tonalität, Zielgruppe, Angebote (Destillat aus Visionsdokument).
- [`docs/CONTENT.md`](docs/CONTENT.md) — Sitemap, Routes, alle aktuellen Copy-Blöcke, Asset-Inventar.
- [`docs/TECH.md`](docs/TECH.md) — Architektur-Details (Routing, Animation-Stack, Custom Mechanisms, Deployment).
- [`docs/DESIGN.md`](docs/DESIGN.md) — Tokens, Komponenten-Atlas, Animation-Easings, Responsive-Strategie.
- [`docs/ROADMAP.md`](docs/ROADMAP.md) — Offene Fragen, Inkonsistenzen, Deployment-Checkliste, verworfene Ideen.

**Source of Truth** für die Marke bleibt [`vision_vibe_language/kla-bauter-visionsdokument-v2.docx`](vision_vibe_language/kla-bauter-visionsdokument-v2.docx). `BRAND.md` ist das Schnellzugriffs-Destillat.
