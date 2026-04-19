# Kla & Bauter — Projekt-Snapshot

## Current Status
- **Last Updated**: 2026-04-19
- **Current Phase**: Launch-Ready · Performance + SEO fundamental abgeschlossen
- **Branch**: main
- **Live**: https://www.klaundbauter-musikproduktion.com (Vercel, www als Primary)

## Lighthouse (Stand 19.04.2026)
| Kategorie | Desktop | Mobile |
|---|---|---|
| Performance | 100 | 93–100 |
| Accessibility | 95+ (nach Contrast-/Heading-Fix) | 95+ |
| Best-Practices | 100 | 100 |
| SEO | 100 | 100 |

**Core Web Vitals**: Desktop LCP 0.5s · Mobile LCP 1.2–2.7s · CLS 0 · TBT 0-20ms.

---

## Completed This Session

### 1. Mobile-Responsive Complete-Overhaul
- **Spacing-Tokens zentralisiert**: `--edge` (4/2/1rem nach Breakpoint), `--content-top` (14rem/11rem)
- **Breakpoint-System** auf 480/768/992 reduziert (Exoten 576/600/1200 migriert)
- `100vh` → `100svh` global (iOS-Safari-robust)
- Hero, page-container, home-entry, editorial-container, camp-text-col, snap-block, sc-block alle auf Token
- Mobile-Sections: min-height 80svh, justify-content center, 6rem Padding — Desktop-Ästhetik (viel Weißraum + zentrierter Content) auf Mobile

### 2. Fullscreen-Menü komplett redesigned
- Weg vom Uppercase/900-Bold, rein in Canela Serif weight 400, sentence-case
- Kapitelnummern (01–07) via CSS `counter()` — ohne HTML-Markup
- `hover:hover`-gated hover (translateX + accent-color)
- 100svh erzwungen, startet auf Höhe des X-Burger

### 3. Navbar + Klabautermann-Logo
- Logo-Größe Mobile 42px (exakt wie Footer-Klabautermann)
- `.menu-toggle` robust ohne magic-number alignment (explicit `height` matcht `.nav-logo-img`)

### 4. Hover-Reset auf Touch
- Einzelner `@media (hover: none)` Block neutralisiert 39 Hover-Regeln auf ihren Base-State
- Sticky-Hover-Bug (Browser emuliert Hover bei Tap) eliminiert

### 5. Home: 3-Karten-Section neu gedacht
- Alle drei Cards permanent sichtbar (kein Hover-Expand-Trick mehr)
- Songcamps-Card: default blurry (opacity 0.35 + blur 6px) + zentriertes „Ich weiß noch gar nicht genau"-Hint
- Hover → Card wird scharf, Hint fadet aus
- Nur `@media (hover: hover) and (min-width: 993px)` — Touch + schmale Viewports sehen sofort scharfe Card

### 6. Team-Seite refactor
- Kicker-Box = Rolle (z.B. „Songwriting · Gesang · Mixing")
- Headline = Name (Canela editorial)
- `.team-role`-Klasse komplett entfernt
- Mobile: Bio-Zeile unter das Portrait (display:contents Trick)
- Adrian-Foto auf `produktion_2.jpg` getauscht

### 7. Footer
- Mobile: CTA oben, Studio-Adressen als 2-Col Mini-Grid, Klabautermann links unten
- Navigation-Col auf Mobile hidden
- Address-Zeilenabstand mit Nav-Zeilenabstand synchronisiert

### 8. Content-Überarbeitung
- **Hervorhebungen neu kuratiert**: „Anfänger" + „Karriere-Workshop" + „längst" + „Camps" Accents entfernt (zu negative/beliebige Betonung)
- **Für-Wen-Bulletpoints**: Vision-konform neu geschrieben (Mitte 20 bis Mitte 40 Zielgruppe)
- **Paul-Bio** ergänzt auf Vision-Original
- **Camp-Finish-Section**: 4× „braucht/brauchen" auf 0× reduziert
- **Produktion + Releases**: graue Sub-Headlines auf oliv+kursiv (konsistent mit Sessions)
- **„Fünf Tage, ein Raum, dein Song"** → **„Fünf Tage, ein Haus, deine Musik"** (Songcamps)

### 9. Rechtliches
- **Impressum**: komplett DDG-konform (§ 5 DDG statt TMG) · GbR als Rechtssubjekt · V.i.S.d.P. · Haftungsausschluss · Bildnachweise
- **Datenschutz**: DSGVO-konform · Verantwortlicher = GbR · Hosting Vercel · YouTube Lite-Embed · Schriftarten self-hosted · Betroffenenrechte · Aufsichtsbehörde NRW
- Beide im editorial-Design (snap-block-basiert, Canela-Titel, 11px accent-Section-Kicker)
- Mail überall auf `hallo@klaundbauter-musikproduktion.com`

### 10. Google Fonts selbst gehostet
- Download aller WOFF2-Dateien (latin + latin-ext) für Cormorant + Inter
- `/fonts/fonts.css` mit 18 `@font-face` Regeln (6 einzigartige Dateien, 300 KB)
- Keine Datenübertragung mehr an Google → Datenschutz-konform
- **Bug-Fix**: `url('fonts/…')` → `url('…')` (relative Pfade, sonst 404s)

### 11. Warteliste-Formular live
- HTML: Name + E-Mail Inputs + Submit-Button + Feedback-Zeile
- CSS: form-card editorial
- JS: Submit-Handler mit Client-Validierung
- **Vercel Serverless Function** (`/api/waitlist.js`): ESM, native fetch zu Resend API, sanitization + Rate-Limits-freundlich
- `package.json`, `vercel.json`, `.gitignore` entsprechend konfiguriert

### 12. Favicon
- Navbar-Klabautermann als 32px + 180px Apple-Touch-Icon
- Dark/Light-responsive via `prefers-color-scheme` Media Queries

### 13. SEO-Setup
- **Meta-Tags**: Title, Description, Open Graph (6), Twitter Cards (4), Canonical
- **JSON-LD**: Organization + 3 Services (Songcamp 1200€, Session 500€, Produktion 1785€)
- **sitemap.xml** (7 Routen), **robots.txt**
- **SPA-SEO-Fix**: Route-basierte Title/Description/OG-Updates via JS (`updateSEOMeta`)
- **Prerendered HTML pro Route**: `build.js` generiert `produktion.html`, `songcamps.html`, etc. aus index.html-Template + `routeMeta` aus script.js (Single Source of Truth)
- **Vercel**: `buildCommand`/`outputDirectory` + rewrites für `/produktion` → `/produktion.html`
- **Domain**: www als Primary (non-www redirected), alle URLs im Code auf www
- **Alt-Texte**: 20+ Bilder systematisch beschreibend + keyword-nah

### 14. Performance-Optimierungen
- **WebP-Konvertierung**: alle 22 JPGs → WebP (~27% kleiner im Schnitt, bis 45%)
- **Responsive Hero**: `hero_home-800.webp` (32KB), `-1200.webp` (60KB), original 2048px (172KB) mit `<img srcset sizes>` + `<link rel="preload" imagesrcset imagesizes>`
- **Navbar-Logo** klein: von 236 KB PNG auf 2.4 KB WebP (100× kleiner) — auch als Loader + Footer-Mobile
- **loading="lazy"** auf 16 Sub-Route-Images (initial payload von ~1.5 MB auf ~50 KB Bildern)
- **fetchpriority="high"** + `decoding="async"` auf Hero

### 15. Accessibility
- **Form-Labels** (pa11y): `aria-label` auf alle Warteliste-Inputs
- **Crawlable Anchors**: „Auf Warteliste setzen" + „Wie es läuft" mit echten `href="#..."` (statt nur `onclick`)
- **Teaser-Kicker-Contrast**: Text-Farbe auf `text-primary` statt `bg-primary` → 4.86:1 (war 3.15:1, WCAG AA fail)
- **Heading-Order**: Footer `<h4>` → `<h3>` (Hierarchie springt nicht mehr)

---

## What's Working (Live und Testbar)
- Alle 7 Routen deep-linkbar (Home, Produktion, Sessions, Songcamps, Team, Releases, Kontakt)
- Legal-Routen Impressum + Datenschutz
- SPA-Transitions (GSAP slide-Animation)
- Fullscreen-Menü mit 100svh
- Warteliste-Formular (Submit-Flow — sobald Env-Vars in Vercel gesetzt)
- YouTube Lite-Embed (scharfe Thumbnails, Klick = iframe)
- Songcamp-Teaser Mouse-Parallax
- Dark/Light Favicon
- SEO: jede Route hat eigenen Title/OG/Canonical

## Known Issues / In Progress
- **Resend Domain-Verifikation** — User muss noch DNS-Records für `klaundbauter-musikproduktion.com` bei Resend einrichten, damit Mails als Absender funktionieren (alternativ: `onboarding@resend.dev` für Tests)
- **Vercel Env-Vars** — muss noch gesetzt sein: `RESEND_API_KEY`, `WAITLIST_FROM`, `WAITLIST_TO`
- **Lighthouse Mobile Performance variabel** (93-100 je nach Run) — typisch für Lab-Daten, Field-Data in 4-8 Wochen via Search Console

## Key Decisions This Session
- **www als Primary Domain** (nicht non-www) — matched bestehenden Vercel-Redirect
- **Prerendered HTML pro Route** statt Client-only Title-Update — Social Shares + Google ohne JS-Wait
- **Google Fonts self-hosted** statt CDN — DSGVO-Ideal
- **Lite YouTube-Embed** (Facade) statt direkter iframes — schnellere Pageload, keine YouTube-Cookies bis Klick
- **80svh min-height + center** auf Mobile-Sections — Desktop-Ästhetik ohne starren 100vh-Zwang
- **Blurry Songcamp-Card** statt Click-Expand — weniger fragil, weniger Layout-Shifts
- **Resend** (nicht Formspree) — bewusste Entscheidung weil User schon Resend-erfahren

## Dependencies & Integration
- **Vercel**: Hosting + Serverless Function + Build-Pipeline (`build.js` läuft pre-deploy)
- **Resend**: Mail-Versand für Warteliste (`api/waitlist.js`)
- **Google Search Console**: Verifiziert (DNS-Route), Sitemap eingereicht
- **GSAP** (via CDN): SPA-Transitions + Parallax
- **YouTube**: Releases-Videos (Lite-Embed)

## Repo-Struktur
```
├── index.html              Template (Home-Metas)
├── style.css               (~77 KB)
├── script.js               routeMeta + SPA-Routing + Form-Handler + etc.
├── build.js                Pre-render HTML pro Route
├── package.json            ESM, Node 20.x, "build": "node build.js"
├── vercel.json             buildCommand + outputDirectory + rewrites
├── sitemap.xml
├── robots.txt
├── api/
│   └── waitlist.js         Vercel Serverless → Resend
├── fonts/
│   ├── fonts.css           18 @font-face (Cormorant + Inter)
│   └── *.woff2             6 Font-Dateien
├── images/
│   ├── *.webp              22 Content-Bilder + 2 Hero-Varianten
│   └── *.jpg               Original-JPGs (nicht mehr referenziert, liegen noch im Repo)
├── Logo/
│   ├── K&B_Klabautermann_vektor.png   (nur JSON-LD Logo + Backup)
│   └── klabautermann-nav.webp          (Nav + Loader + Footer, 2.4KB)
├── favicon-32.png · favicon-32-dark.png · apple-touch-icon.png
├── docs/                   BRAND.md, CONTENT.md, DESIGN.md, TECH.md, ROADMAP.md
├── audit-2026-04-19/       Lighthouse Baseline-Reports
└── audit-2026-04-19-final/ Lighthouse After-Fix-Reports
```

## Next Steps (Priorität)
1. **Resend-Domain verifizieren** + Vercel Env-Vars setzen → Warteliste End-to-End testen
2. Alte JPG-Originale aus `images/` löschen (nicht mehr referenziert, ~6 MB)
3. Search Console in 2-4 Wochen checken: Indexing der 7 Routen
4. *(optional)* CSS/JS minify in build.js integrieren (Performance aktuell bereits 100)
5. *(optional)* 404-Page gestalten
