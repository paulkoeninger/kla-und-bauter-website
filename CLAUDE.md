# Kla & Bauter — Projekt-Kompass

Editoriale SPA für das Musikproduktions-Duo Kla & Bauter (Paul Köninger + Adrian Thessenvitz, GbR, Köln).
Design-Philosophie: ruhig, noble, viel Weißraum, lange cinematic Easings. **Raum geben, nicht vollpacken.**

Live: https://www.klaundbauter-musikproduktion.com

---

## 1. Stack & Deployment

- **Frontend**: Vanilla HTML + CSS + JS. GSAP 3.12 (CDN) für Transitions + Parallax.
- **Fonts**: Inter + Cormorant, **selbst gehostet** in `fonts/` (kein Google-CDN).
- **Hosting**: Vercel (www als Primary Domain, non-www redirected).
- **Build-Step**: `node build.js` generiert pre-rendered HTML pro Route vor jedem Deploy.
- **Serverless Function**: `api/camp-anfragen.js` (Vercel) → Resend API für Camp-Anfragen-Mails.

## 2. 3-File-Regel + Build-Output

| Datei | Rolle |
|---|---|
| `index.html` | Template mit allen Routen als `.page-section`. Home-Metas fest im `<head>`. |
| `style.css` | Komplettes Styling, Tokens in `:root`. |
| `script.js` | SPA-Routing, Promise-Reveal, Camp-Anfragen-Submit, Teaser-Parallax, IntersectionObserver. |
| `build.js` | Liest `routeMeta` aus script.js + Template → schreibt `produktion.html`, `session.html`, etc. mit route-spezifischen Metas. Single Source of Truth: `routeMeta` in script.js. |
| `vercel.json` | `buildCommand`, `outputDirectory: "."`, `rewrites` (`/produktion` → `/produktion.html` …). |

**Regel**: Keine Komponenten-Splits, kein npm-Framework, kein Bundler. Alles editierbar in den drei Files.

## 3. SPA-Routing

- `data-route="…"` auf Links → delegiertes Click-Handling in script.js.
- `navigateTo(route)` spielt GSAP-Timeline (Out-Slide → DOM-Swap → In-Slide, ~0.9 s).
- URL via `history.pushState` aktualisiert, `popstate` hört auf Back/Forward.
- **Navigation führt IMMER ans Top** — auch bei Same-Route-Klick.
- `updateSEOMeta(route)` aktualisiert `<title>`, `<meta description>`, OG, Twitter, Canonical bei jedem Routenwechsel.
- `validRoutes`: `home, produktion, session, songcamp, team, releases, kontakt, impressum, datenschutz`.
- `try/catch` um History-API-Calls (für `file://`-Modus).

## 4. Notable Custom Mechanisms (vorsichtig editieren)

### Promise Text-Reveal (Songcamp „Das Versprechen")
- Desktop: 60fps Mouse-Follow, Zipper-Logic, Wort-für-Wort, Anti-Skip.
- Mobile: Auto-Reveal via IntersectionObserver beim Entry (80ms Stagger, ~3.2 s total, einmalig pro Page-View).

### Songcamp-Karte Home („Wonach ist dir?")
- Alle 3 Karten permanent sichtbar.
- Songcamp-Card ist auf Desktop default blurry mit „Ich weiß noch gar nicht genau"-Hint → Hover schärft.
- Gated via `@media (hover: hover) and (min-width: 993px)` — Touch + enger Browser sehen scharfe Card.

### Home-Teaser Mouse-Follow Parallax
- `translate:` Property auf `.teaser-bg` via JS, kombiniert sich mit dem 45s-`slowZoom`-Keyframe (`transform: scale`).

### Lite YouTube-Embed (Releases)
- Vorschau ist ein `<button class="video-wrapper" data-yt-id="…">` mit Thumbnail (`maxresdefault.jpg` + Fallback).
- Click ersetzt Button durch echtes `<iframe>` mit `autoplay=1`. Keine YouTube-Cookies vor Klick.

### Camp-Anfragen-Formular (Songcamp)
- Client: Name + E-Mail + Submit → POST `/api/camp-anfragen` (JSON).
- Server (`api/camp-anfragen.js`): Validierung → Resend API → Mail an `CAMP_ANFRAGEN_TO`, Reply-To = User-Mail.
- **Env-Vars in Vercel nötig**: `RESEND_API_KEY`, `CAMP_ANFRAGEN_FROM`, `CAMP_ANFRAGEN_TO`.

### Hover-Reset auf Touch
- Ein `@media (hover: none)` Block am Ende von style.css neutralisiert ~39 Hover-Regeln auf Base-State.
- Eliminiert Sticky-Hover-Bug beim Tap auf Touch-Geräten.

## 5. CSS-System (wichtigste Regeln)

### Tokens (`:root` in style.css)
- Farben: `--bg-primary`, `--bg-secondary`, `--text-primary`, `--text-secondary`, `--accent-color` (#8A8F6A Oliv).
- Schrift: `--font-primary` (Inter), `--font-secondary` (Cormorant, Serif).
- Body-Typo: `--body-font-size: 16px`, `--body-line-height: 1.75`, `--body-font-weight: 300`.
- Spacing: `--edge` (4/2/1rem nach Breakpoint), `--content-top` (14/11rem).
- Fluid Type Scale: `--text-sm` … `--text-hero` via `clamp()`.

### Breakpoints
- **992 px**: Tablet → Mobile-Layout.
- **768 px**: Phone-Layout.
- **480 px**: sehr kleine Phones.
- *(Exoten 576/600/1200 sind migriert — nicht mehr nutzen.)*

### Viewport-Units
- Durchgängig `100svh` statt `100vh` (iOS-Safari-robust).

### Editorial-Prinzipien
1. Weißraum > Dichte. Lieber einen neuen `snap-block` als zwei Spalten packen.
2. Eine Idee pro Bildschirm.
3. Typografie ist Ornament — Serif/Sans-Kontrast (Canela italic vs Inter).
4. Animation-Dauer **0.6–1.2 s**, Ease `cubic-bezier(0.16, 1, 0.3, 1)` oder GSAP `power3.out`. **Kein Snapping, Bouncing, Hype.**

### Nicht-Regeln
- Kein Tailwind/Bootstrap. Tokens + semantische Klassen.
- Keine Emojis/Icons aus Libraries. Pfeile sind Unicode `⟶`.
- Keine Auto-Play-Videos, kein Sound.
- **Keine Inline-Styles mit relativen URLs** (`background-image: url('images/…')`). Immer in externer CSS setzen — sonst resolved pushState auf `/route/images/…` → 404.

## 6. SEO

- Title/Meta pro Route via `routeMeta` in script.js (Single Source of Truth).
- `build.js` schreibt diese in die pre-rendered HTMLs — Social-Scraper und Google ohne JS-Wait.
- JSON-LD Organization + 3 Services (Songcamp, Session, Produktion) im `<head>`.
- `sitemap.xml` + `robots.txt` in Root, bei Google Search Console via DNS verifiziert.
- Alle absoluten URLs auf `https://www.klaundbauter-musikproduktion.com` (www).

## 7. Performance

- Alle Content-Bilder als **WebP** (responsive Hero mit 800/1200/2048w srcset).
- Hero mit `<link rel="preload" imagesrcset imagesizes fetchpriority="high">`.
- `loading="lazy"` auf alle Below-Fold-Images (Hero + Navbar-Logo sind eager).
- Navbar-Logo als 2.4 KB WebP (ursprünglich 236 KB PNG).

**Lighthouse (Stand April 2026)**: Desktop 100/90/100/100 · Mobile 93–100/90/100/100.

## 8. Rechtliches

- **Betreiber**: Kla und Bauter Thessenvitz Köninger GbR, Heumarkt 42–44, 50667 Köln.
- **Mail offiziell**: `hallo@klaundbauter-musikproduktion.com`.
- Impressum DDG-konform (§ 5 DDG), Datenschutz DSGVO-konform (Verantwortlicher = GbR, Hosting Vercel DPF, YouTube Lite-Embed, Fonts selbst gehostet = keine Google-Übermittlung).

## 9. Bekannte offene Tasks

- **Resend Domain-Verifikation** (DKIM/SPF-Records bei Domain-Registrar) — nötig damit Camp-Anfragen-Mails als `hallo@…` raus gehen statt via `onboarding@resend.dev`.
- **Vercel Env-Vars setzen**: `RESEND_API_KEY`, `CAMP_ANFRAGEN_FROM`, `CAMP_ANFRAGEN_TO`.
- **Alumni-Quotes** (Songcamp): aktuell Platzhalter, durch echte Zitate ersetzen sobald vorhanden.

## 10. Vertiefende Dokumentation

- **Source of Truth** für die Marke: `vision_vibe_language/kla-bauter-visionsdokument-v2.docx`.
- **Schnellzugriff**: `docs/BRAND.md` (Tonalität, Zielgruppe, Angebote) und `docs/DESIGN.md` (Token-Referenz, Komponenten-Atlas).

**Developer-Instruction**: Elegant constraints > flashy chaos. Reuse bestehende `snap-block` / `sc-block` Strukturen. Tokens statt Magic Numbers. Animationen ruhig, nie aggressiv. Bei Textänderungen: `docs/BRAND.md` konsultieren für Tonalität.
