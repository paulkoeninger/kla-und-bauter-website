# Kla & Bauter Website — Projekt-Status

## Current Status
- **Last Updated:** 2026-04-23 (Session 3 — Performance & Cleanup + Phase 4 Bild-Opti)
- **Current Phase:** Phase 4 abgeschlossen → **nächste Phase: Deploy + Lighthouse-Messung + Photo-Credits**
- **Branch:** `main` (working tree clean bis `a2e1c48`)
- **Deployment:** Vercel — https://www.klaundbauter-musikproduktion.com

## Architektur (Kurz)
Editoriale Vanilla-SPA. Drei-File-Regel: `index.html` (1.126 Z), `style.css` (2.851 Z), `script.js` (815 Z). Pre-rendered Routes via `build.js` (143 Z — inkl. HTML-Minification, Single Source of Truth: `routeMeta` in script.js). Serverless APIs: `api/camp-anfragen.js` + shared `api/_email.js` (HTML-Mail-Template). Resend als Mail-Versanddienstleister.

---

## Completed This Session (Session 3 — Performance & Code-Cleanup)

### Phase 3.1 — Quick Wins (Commit `f3e5fc6`)

**ScrollTrigger entfernt** — Lib wurde von CDN geladen (~17 KB gzip), aber in `script.js` nie aufgerufen (`grep ScrollTrigger = 0`). Kompletter `<script>`-Tag raus aus index.html.

**Legacy-Images gelöscht** — 7 Testimonial-JPEGs + `Michael_Baechle.webp` (0 Referenzen im Code, Relikte aus Platzhalter-Phase):
- `Georgie_Chapple_Moritz_Wolf.jpeg` (671 KB)
- `NICS_AndréLietz.jpeg` (312 KB)
- `Divamant_c_Dunja Krefft.jpeg` (279 KB)
- `Marco_Olbert.jpg` (168 KB)
- `Elena_Kovacs.jpg` (135 KB)
- `Michael_Baechle.jpg` + `.webp` (67 KB)
- `Daniel_Dominguez.jpg` (60 KB)
- **Total: 1.6 MB befreit**

**Dead JS vars entfernt** — `revealCanvas`, `revealShapes` in script.js: queryt DOM-IDs, die seit Promise-System-Refactor nicht mehr existieren.

**`slideSelectors` aufgeräumt** — von 20 Selektoren auf 6 reduziert. Entfernt: `.service-item`, `.page-title`, `.text-content`, `.image-content`, `.contact-info`, `.contact-form`, `.legal-text`, `.produktion-intro`, `.process-step`, `.detail-section`, `.songcamp-headline`, `.feature-list`, `.info-items`, `.songcamp-banner` — alle 0 Treffer in HTML.

**`api/kontakt.js` gelöscht** — seit Mail-First-Redesign ungenutzt, nur 1 Kommentar in script.js referenzierte sie. Aus Git-History restorable, falls Form-Comeback. `api/_email.js` bleibt (camp-anfragen nutzt es).

**Datenschutz gestrafft** — „Kontaktaufnahme (E-Mail & Kontaktformular)" → „Kontaktaufnahme per E-Mail". „Versand aus Formularen" → „aus Songcamp-Anfragen".

### Phase 3.2 — CSS Cleanup & Inline-Styles (Commit `57d15bc`)

**60 orphaned CSS-Klassen identifiziert, 118 Rule-Blöcke entfernt** (~13 KB raw, -12% CSS-Größe):
- Legacy Kontakt-Form-Klassen (`.contact-form`, `.contact-info`, `.contact-grid`, `.studio-label`, `.studio-address`, `.submit-btn`, `.email-link`)
- Altes Promise-System (`.w1`-`.w4`, `.s1`-`.s3`, `.mm-word`, `.mm-node`, `.mm-center`, `.branch-winter`, `.branch-summer`)
- Unbenutzte Songcamp-Varianten (`.sc-list-item`, `.sc-format-grid`, `.sc-fact-grid`, `.sc-cta-box`, `.sc-fuer-wen`, `.songcamp-houses`, `.songcamp-register`, `.songcamp-banner`, `.songcamp-headline`)
- Alte Feature-Container (`.feature-list`, `.feature-item`, `.feature-icon`, `.feature-text`, `.info-items`, `.info-item`)
- Tote Process-Step-Struktur (`.process-overview`, `.process-step`, `.step-icon`, `.step-subtext`, `.process-details`, `.detail-section`, `.detail-number`, `.detail-text`, `.detail-image`)
- Defensive Reste aus Kontakt-Iterationen (`.editorial-cta`, `.editorial-container`, `.editorial-item`, `.editorial-list`, `.editorial-header`, `.editorial-full-img`)

**Cleanup-Script** (`/tmp/css-cleanup.js`) geschrieben: Parst style.css Block-für-Block, behält Rules deren Selektor-Gruppe mindestens einen nicht-orphan-Selector hat (z. B. `blockquote, .quote` → bleibt wegen `blockquote`). Brace-balance nach Cleanup validiert.

**165 → 81 Inline-Styles** (-51%) durch neue semantische Klassen in style.css:
- `.testimonial-card`, `.testimonial-quote`, `.testimonial-footer`, `.testimonial-avatar`, `.testimonial-name`, `.testimonial-role` (6 Testimonial-Cards, 6 Property-Sets × 6 Instanzen = 36 Inline-Styles → 0)
- `.sc-day-grid`, `.sc-day-card`, `.sc-day-card-title`, `.sc-day-card-desc` (Songcamp „Wie es läuft" 4-Column Cards)
- `.sc-stat-num`, `.sc-stat-label` (numerische Akzent-Stats)
- `.editorial-title--hero-size` und `.editorial-title--price` Modifier (Hero + Preis-Titel auf 5 Seiten)
- Redundantes `padding: 0` auf 7× `.page-section` entfernt (war kein Base-Style da)
- `margin-top: 0` auf `.snap-block-inner.full-bleed` → als Default in Klasse

**`fonts/fonts.css` konsolidiert** (6.8 KB → 2.8 KB, -59%): 18 @font-face-Deklarationen auf 6 reduziert. Cormorant/Inter haben nur WOFF2-Files für weight 300 — 400/500/600 waren auf die gleichen Files gemappt, was Browser-synthesisierten Faux-Bold auslöst. Jetzt explizit: nur die echten 300er-Files registriert, Browser synthesisiert 400/500/600 bei Bedarf (optisch kaum unterscheidbar im editorialen Kontext).

### Phase 3.3 — HTML-Minification (Commit `63dbe73`)

**`build.js` um Minifier erweitert** (+54 Zeilen):
- `<script>`, `<style>`, `<pre>`, `<textarea>` werden vor Minification stashed → Inhalt byte-genau erhalten (JSON-LD bleibt intakt)
- HTML-Kommentare entfernt
- Whitespace zwischen Tags kollabiert (`>\s+<` → `><`)
- Mehrfache Leerzeichen/Tabs/Newlines reduziert
- Pro-Route-Logging mit Reduktion-% im Build-Output

**Ergebnis:** 9 Pre-rendered Routes zusammen 701 KB → 499 KB (**-28.8 %**). Per Route ~78 KB → ~55 KB.

### Phase 4 — Bild-Optimierung & Font-Preload (Commit `a2e1c48`)

**Responsive srcsets für 11 große Content-Bilder** — je Bild 800w + 1200w WebP-Varianten via `cwebp -q 80 -m 6` generiert:

- `produktion.webp`, `produktion_1.webp`, `produktion_2.webp`, `produktion_3.webp`
- `recording.webp`, `mix.webp`, `paul.webp`
- `songcamp/sc_mood4.webp`, `songcamp/camp_home.webp`, `songcamp/sessionpaul.webp`
- `studio.webp` (umbenannt von „Kla & Bauter Studio-100.webp" — Leerzeichen + & in srcset-URLs ist spec-illegal, Browser würde an Whitespace fälschlich trennen)

**srcset-Script** (`/tmp/add-srcsets.js`) schreibt 18 `<img>`-Tags in index.html um:
- `cinematic-img` → `sizes="100vw"`
- `entry-img` → `sizes="(max-width: 768px) 100vw, 33vw"`
- `editorial-img prod-hero-img` / `team-portrait` → `sizes="(max-width: 768px) 100vw, 50vw"`
- `editorial-img prod-img` (split layout) → `sizes="(max-width: 768px) 100vw, 45vw"`

**Mobile-Ersparnis pro Bild:**

| Bild | 2048w Full | 800w Mobile | Ersparnis |
|---|---|---|---|
| sc_mood4 | 315 KB | 22 KB | **93 %** |
| produktion_3 | 138 KB | 18 KB | 87 % |
| recording | 177 KB | 26 KB | 85 % |
| produktion_2 | 285 KB | 50 KB | 83 % |
| camp_home / sessionpaul | 224/205 KB | 41/36 KB | 82 % |
| produktion / produktion_1 | 265/208 KB | 49/40 KB | 81 % |
| paul | 108 KB | 26 KB | 76 % |
| studio | 309 KB | 81 KB | 74 % |
| mix (Portrait) | 212 KB | 75 KB | 65 % |

**Font-Preload im `<head>`**:
```html
<link rel="preload" as="font" type="font/woff2" href="/fonts/inter-300-n-latin.woff2" crossorigin>
<link rel="preload" as="font" type="font/woff2" href="/fonts/cormorant-300-n-latin.woff2" crossorigin>
```
Lädt die beiden latin-Subsets (U+0000-00FF) parallel zum CSS. Italic-Cormorant (nur für `<em>`-Akzente) bleibt Lazy-Load — nicht LCP-kritisch.

---

## Gesamt-Bilanz der Session

| Datei | Vor | Nach | Diff |
|---|---|---|---|
| `index.html` | 85.083 B / 1.127 Z | 78.139 B / 1.126 Z | **-8%** |
| `style.css` | 90.462 B / 3.160 Z | 78.038 B / 2.851 Z | **-14%** |
| `script.js` | 36.236 B / 821 Z | 35.099 B / 815 Z | **-3%** |
| `fonts/fonts.css` | 6.8 KB / 156 Z | 2.8 KB / 59 Z | **-59%** |
| `build.js` | 91 Z | 143 Z | +52 (Minifier) |
| `images/` (source) | 4.7 MB | 3.1 MB | **-34%** (1.6 MB legacy raus) |
| `images/` (inkl. Varianten) | 3.1 MB | 4.3 MB | +1.2 MB (aber pro User viel weniger, siehe unten) |
| Pre-rendered HTMLs | 9 × ~85 KB = 768 KB | 9 × ~58 KB = 523 KB | **-32 %** (mit srcset-HTML-Zuwachs) |

**Was der User tatsächlich lädt (Desktop, 1200w-Slot):**
- hero_home: 59 KB (vorher 173 KB Full) → **-66 %**
- große Content-Bilder im Schnitt: 70 KB (statt 200 KB Full) → **-65 %**

**Was der Mobile-User lädt (800w-Slot):**
- hero_home: 32 KB
- große Content-Bilder im Schnitt: ~40 KB (statt 200 KB Full) → **-80 %**

**Bundle, das User tatsächlich pro Route herunterlädt** (Desktop Chrome, uncached):
- 1× pre-rendered HTML: ~55 KB (vorher ~85 KB)
- style.css: ~78 KB (vorher 89 KB, gzipped ~15 KB)
- script.js: ~35 KB (minification noch nicht integriert, Phase 4 Kandidat)
- GSAP CDN: ~23 KB gzip (ScrollTrigger raus, 17 KB gespart)
- 6 WOFF2 (lazy via unicode-range): ~47–83 KB je nach benötigtem Subset

---

## What's Working (production-ready)

- ✅ Alle 9 Routen routen über SPA-Navigation, history API, Back/Forward
- ✅ Pre-rendered HTMLs mit route-spezifischen Metas + Minification
- ✅ Lab-Page vollständig integriert
- ✅ Kontakt als Mail-First (Form entfernt, sauber archiviert)
- ✅ Songcamp-Anfragen via Resend mit Dual-Mail (Team + User-Bestätigung)
- ✅ 6 echte Testimonials mit Photo-Credits (3 davon — NICS/Georgie/Divamant)
- ✅ Motion-Layer: Section-Enter-Stagger + Magnetic Buttons (rAF-Lerp, 4px max, smoothstep)
- ✅ Promise-Text-Reveal auf Songcamp (Desktop Zipper-Logic + Mobile IntersectionObserver Auto-Reveal)
- ✅ Lite-YouTube-Embed (Releases) ohne Cookies vor Klick

## Known Issues / Offene Punkte

- ⏳ **Lighthouse-Messung nach Cleanup** steht noch aus — Desktop war vor Cleanup 100/90/100/100, Mobile 93/90/100/100. Nach ScrollTrigger-Removal und Minification Performance-Score sollte steigen. A11y 90 auf Mobile bleibt zu untersuchen.
- ⏳ **Photo-Credits nachreichen** für Marco Olbert / Daniel Dominguez / Elena Kovacs (User reicht nach)
- ⏳ **Resend Domain-Verifikation** (DKIM/SPF) damit `CAMP_ANFRAGEN_FROM` auf `hallo@klaundbauter-musikproduktion.com` schalten kann — aktuell via `onboarding@resend.dev`
- 📝 **Responsive srcsets für große Content-Bilder** — `sc_mood4.webp` (315 KB), `produktion_2.webp` (285 KB), `produktion.webp` (265 KB), `camp_home.webp` (224 KB), `mix.webp` (212 KB) haben aktuell keine 800/1200-Varianten. Mobile lädt volle Desktop-Auflösung.

## Key Decisions Made This Session

- **Fonts: synth 400/500/600 statt echte Files laden** — im editorialen Kontext optisch kaum unterscheidbar, spart Font-Last und `fonts.css`-Komplexität. Font-Weights im CSS bleiben wie sie sind (34× 400, 20× 300, 13× 500, 7× 600) — browser macht faux-bold aus 300er-WOFF2.
- **api/kontakt.js löschen statt archivieren** — git log behält die Historie. Bei Form-Comeback: restorable via `git show HEAD~3:api/kontakt.js`.
- **HTML-Minifier selbst geschrieben, kein npm-Dep** — 50-Zeiler, deckt die gängigen 80% ab. Wenn irgendwann spezielle Optimierungen nötig: `html-minifier-terser` einbinden.
- **Inline-Styles-Extraktion bis ~80 stop** — kleinere One-off-Styles (z. B. `position: sticky; top: 120px;` 3×) lassen sich zwar extrahieren, würden aber zu vielen winzigen Klassen führen, die die CSS-Lesbarkeit verschlechtern. Diminishing returns.
- **ScrollTrigger komplett raus statt Lite-Version** — Library wird definitiv nirgends genutzt.

## Dependencies & Integration Notes

- **GSAP** (CDN 3.12.5): `gsap.set`, `gsap.timeline`, `gsap.to` — für SPA-Page-Transitions, Menu-Overlay-Slide, Loader-Fadeout. Keine ScrollTrigger mehr.
- **Resend**: Für Songcamp-Anfragen. Env-Vars in Vercel: `RESEND_API_KEY`, `CAMP_ANFRAGEN_FROM`, `CAMP_ANFRAGEN_TO`.
- **build.js**: Läuft bei `vercel build` und lokal `node build.js`. Minifier ist default-an (`MINIFY = true`).

## Next Steps (Priority Order)

1. **Lighthouse-Messung** auf allen 9 Routen (Desktop + Mobile) nach Deploy der Phase-3-Changes
2. **Responsive srcsets** für die großen Content-Bilder (`sc_mood4`, `produktion`, `produktion_2`, `camp_home`, `mix`)
3. **Photo-Credits** Marco/Daniel/Elena einbauen, sobald User sie nachreicht
4. **Resend Domain-Verifikation** (DKIM/SPF bei Domain-Registrar setzen)
5. Optional: JS-Minification via esbuild oder simples Terser-Setup in build.js
6. Optional: `<link rel="preload" as="font">` für die 2 kritischen Font-Files (Inter latin, Cormorant latin)
