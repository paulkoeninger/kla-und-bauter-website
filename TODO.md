# TODO / Task List

## ✅ Completed (Session 3 — Performance & Code-Cleanup, commits `f3e5fc6` → `63dbe73`)

### Phase 3.1 — Quick Wins
- [x] ScrollTrigger-CDN-Script aus index.html entfernt (0 Usages in script.js)
- [x] 8 Legacy-Testimonial-Files gelöscht (7 JPEGs + Michael_Baechle.webp, 1.6 MB)
- [x] Dead JS vars (`revealCanvas`, `revealShapes`) aus script.js raus
- [x] `slideSelectors` von 20 auf 6 Selektoren reduziert (14 tote Klassen raus)
- [x] `api/kontakt.js` gelöscht (unused seit Mail-First-Redesign)
- [x] Datenschutz-Text: „Kontaktformular"-Eintrag entfernt, „Formulare" → „Songcamp-Anfragen"

### Phase 3.2 — CSS Cleanup & Inline-Styles
- [x] 60 orphaned CSS-Klassen identifiziert via Diff `style.css` vs `index.html+script.js`
- [x] 118 Rule-Blöcke entfernt (~13 KB), Script-basierter Cleanup mit Brace-Balance-Check
- [x] 165 → 81 Inline-Styles (-51%) durch neue semantische Klassen
- [x] `.testimonial-card/quote/footer/avatar/name/role` extrahiert
- [x] `.sc-day-grid/card/card-title/card-desc` extrahiert
- [x] `.sc-stat-num/label` extrahiert
- [x] `.editorial-title--hero-size` und `--price` Modifier
- [x] `fonts/fonts.css` von 18 auf 6 @font-face-Deklarationen reduziert (-59%)

### Phase 3.3 — Build Pipeline
- [x] HTML-Minifier in build.js integriert (~50 Zeilen, kein npm-Dep)
- [x] `<script>`/`<style>`/`<pre>`/`<textarea>` byte-exact protected
- [x] Pre-rendered Routes 701 KB → 499 KB (-28.8 %)

### Phase 4 — Bild-Optimierung & Font-Preload (Commit `a2e1c48`)
- [x] 11 große Content-Bilder mit 800w + 1200w WebP-Varianten (via `cwebp -q 80`)
- [x] 18 `<img>`-Tags mit srcset + sizes umgerüstet (18 neue, 21 total inkl. hero_home)
- [x] `sizes` per Kontext: 100vw (cinematic), 33vw (entry), 50vw (split), 45vw (prod-img)
- [x] Studio-Image umbenannt: `Kla & Bauter Studio-100.webp` → `studio.webp`
  (Leerzeichen + & brechen srcset-Parsing — Browser trennt an Whitespace)
- [x] Font-Preload-Hints für Inter + Cormorant latin-300-Subsets im `<head>`
- [x] Mobile-Ersparnis im Schnitt ~80 % pro Content-Bild

## ✅ Completed (Session 2 — commits bis `7994246 f8`)
_Komplette Feature-Expansion — siehe git log oder PROJECT.md._

## 🔄 In Progress
*— nichts gerade aktiv. Session 3 sauber abgeschlossen.*

## ⏳ Backlog (Priority Order)

### Messung & Verifikation (höchste Prio, unmittelbar nach Deploy)
- [ ] **Lighthouse-Audit** auf allen 9 Routen (Desktop + Mobile) — Ausgangspunkt: Desktop 100/90/100/100, Mobile 93/90/100/100
- [ ] **LCP / CLS / INP** pro Route messen (Web Vitals)
- [ ] A11y-Detail-Audit: warum Mobile nur 90? Kontrast-Ratios oder fehlende ARIA-Labels checken
- [ ] Visuelle Smoke-Tests: alle 9 Routen durchklicken, insbesondere Testimonial-Cards (neue Klassen), Songcamp „Wie es läuft"-Grid (neue Klassen), Preis-Sections (editorial-title--price Modifier)

### Brand-Maintenance
- [ ] Photo-Credits für Marco Olbert / Daniel Dominguez / Elena Kovacs einbauen (User reicht nach)
- [ ] **Resend Domain-Verifikation**: DKIM/SPF bei Domain-Registrar, dann `CAMP_ANFRAGEN_FROM` auf `hallo@klaundbauter-musikproduktion.com`

### Optional / Nice-to-have
- [ ] **JS/CSS-Minification** via esbuild oder terser in build.js — konfliktet mit „kein-npm"-Philosophie, Ersparnis klein (~5 KB gzipped total). Entscheidung: nur wenn Lighthouse-Performance-Score unter 95 auf Mobile fällt.
- [ ] `content-visibility: auto` auf below-fold Sections als Render-Skip-Optimierung
- [ ] Critical-CSS-Inlining (above-the-fold) im `<head>` statt externer style.css
- [ ] 301-Redirects für `/songcamps`, `/sessions` in `vercel.json` (falls Backlinks)
- [ ] Cross-Browser-Test `100dvh` auf iOS Safari verifizieren
- [ ] Weitere Inline-Styles extrahieren wenn Muster 3+× auftauchen
- [ ] Restliche 9 „Orphan"-Klassen (`.camp-cta`, `.camp-img`, `.contact-grid`, `.editorial-cta`, `.editorial-item`, `.page-content-grid`, `.quote`, `.w3`) — alle in Compound-Selektoren mit benutzten Parents; entweder Selektoren umformulieren oder so lassen

## Blocked / On Hold
*— nichts.*
