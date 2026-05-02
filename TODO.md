# TODO / Task List

## ✅ Completed (Session 4, 2026-04-24 → 2026-05-02 — commits `bba844e` → `ce88556`)

### Home-Grid: 4. Eingang fürs Lab (Commit `ce88556`, heute)
- [x] 4. Karte „Lab" auf Home-„Wonach ist dir?"-Sektion eingebaut
- [x] Reihenfolge auf `Lab → Session → Produktion → Songcamp` (Lab niederschwelligst ganz links)
- [x] Titel parallelisiert: **Dranbleiben. · Anfangen. · Finishen. · Suchen.**
- [x] Lab-Desc: „Wir arbeiten 90 Minuten an deiner Musik."
- [x] Manuelle `<br>` aus allen vier `.entry-desc` raus → natürlicher Umbruch → 4× 457px Symmetrie
- [x] `.entry-card-3 { transition-delay: 0.19s }` neu, `.camp-path` von 0.20s → 0.26s
- [x] `sizes` aller Cards von `33vw` → `25vw` (4 Spalten)
- [x] Lab-Bild: `images/produktion_3.webp` (mit srcset)

### Brand- / Content-Iteration (Commits `f50264e` → `b2cad8a`)
- [x] CTAs vereinheitlicht auf Text-Link-Pattern (`f50264e`)
- [x] Sommercamp-Location 2026: NRW → bei Hamburg (`e67db87`)
- [x] Mobile-Footer: Instagram-Link neben Logo (`dd49097`)
- [x] 4 neue Releases auf Releases-Seite (`88b4fbc`)
- [x] Spam-Schutz Stufe 1 für Songcamp-Form: Honeypot + Timing + Origin-Check (`d16fee6`)
- [x] Testimonial #7 Thomas Markus auf Page 2 (`b82ef07`); Foto-Credit später Markus → Ester Joy korrigiert (`4e7cbb7`)
- [x] Testimonial #8 Michael Fankhauser + Page-Restructure auf 4+4 (`b2cad8a`)

### Doku-Reorg (Commits `9acfa72`, `d66efb7`)
- [x] `docs/DESIGN.md` → `docs/DESIGN_SYSTEM.md` (Token-Referenz + Komponenten-Atlas)
- [x] `docs/BRAND.md` gelöscht, Inhalte nach `brain/MARKE.md` (gitignored)
- [x] `.gitignore` für `brain/` ergänzt
- [x] CLAUDE.md auf neue Doku-Struktur aktualisiert

---

## ✅ Completed (Session 3, 2026-04-23 — commits `f3e5fc6` → `0a64f67`)

### Phase 3.1 — Quick Wins (Commit `f3e5fc6`)
- [x] ScrollTrigger-CDN-Script aus index.html entfernt (0 Usages, -17 KB gzip)
- [x] 8 Legacy-Testimonial-Files gelöscht (7 JPEGs + Michael_Baechle.webp, 1.6 MB)
- [x] Dead JS vars (`revealCanvas`, `revealShapes`) aus script.js raus
- [x] `slideSelectors` von 20 auf 6 Selektoren reduziert (14 tote Klassen raus)
- [x] `api/kontakt.js` gelöscht (unused seit Mail-First-Redesign)
- [x] Datenschutz-Text angepasst: „Kontaktformular"-Passagen raus, „Formulare" → „Songcamp-Anfragen"

### Phase 3.2 — CSS Cleanup + Inline-Styles (Commit `57d15bc`)
- [x] 60 orphaned CSS-Klassen identifiziert via Diff `style.css` vs `index.html+script.js`
- [x] 118 Rule-Blöcke entfernt (~13 KB), Script-basierter Cleanup mit Brace-Balance-Check
- [x] 165 → 81 Inline-Styles (-51%) durch neue semantische Klassen
- [x] `.testimonial-card/quote/footer/avatar/name/role` extrahiert
- [x] `.sc-day-grid/card/card-title/card-desc` extrahiert
- [x] `.sc-stat-num/label` extrahiert
- [x] `.editorial-title--hero-size` und `--price` Modifier
- [x] `fonts/fonts.css` von 18 → 6 @font-face-Deklarationen (-59%)

### Phase 3.3 — HTML-Minification (Commit `63dbe73`)
- [x] HTML-Minifier in build.js integriert (50 Zeilen, kein npm-Dep)
- [x] `<script>`/`<style>`/`<pre>`/`<textarea>` byte-exact protected
- [x] Pre-rendered Routes 701 KB → 499 KB (-28.8 %)

### Phase 4 — Bild-Optimierung & Font-Preload (Commit `a2e1c48`)
- [x] 11 große Content-Bilder mit 800w + 1200w WebP-Varianten (via `cwebp -q 80 -m 6`)
- [x] 18 `<img>`-Tags mit srcset + sizes umgerüstet (21 total mit hero_home)
- [x] `sizes` per Kontext: 100vw (cinematic), 33vw (entry), 50vw (split), 45vw (prod-img)
- [x] Studio-Image umbenannt: `Kla & Bauter Studio-100.webp` → `studio.webp`
- [x] Font-Preload-Hints für Inter + Cormorant latin-300-Subsets im `<head>`
- [x] Mobile-Ersparnis im Schnitt ~80 % pro Content-Bild

### Hero Bug + Session-Titel (Commit `e693aa3`)
- [x] Root Cause gefunden: GSAP `clearProps: "all"` wipt Inline-Styles auf `.snap-block-inner`
- [x] Fix: `.editorial-split--hero` Klasse, Base `.editorial-split { margin-top: 0 }`, Mobile-Override entfernt
- [x] Alle 9 `.editorial-split` Verwendungen auf Klassen umgestellt
- [x] „Sessions" → „Session" im Session-Hero-Kicker

### Echtes Inter 600 (Commit `70c56f5`)
- [x] `inter-600-n-latin.woff2` + `-ext.woff2` von Google Fonts v20 heruntergeladen (60 KB total)
- [x] In `fonts.css` als echte `@font-face` deklariert (kein faux-bold mehr)
- [x] Preload-Hint für 600er latin im `<head>` — LCP-Kandidat Hero-Title

### Freie-Berufe-Text-Audit (Commit `75d36bd`)
- [x] „Unterkunft inklusive" → „Ein Haus" (Songcamp-Preis)
- [x] „Songwriting-Retreat" → „Songwriting-Camp" (JSON-LD, routeMeta, 2× alt-Texte, knowsAbout)
- [x] „6 Teilnehmer / Personen" → „6 Artists" (Hero + Stats)
- [x] „Mittagspause inklusive" → „mit Mittagspause"
- [x] „Gemeinsam kochen" als Struktur-Säule → „Gemeinsam essen" als soziales Ritual
- [x] „Paketpreise auf Anfrage" → „Besprechen wir individuell"
- [x] „Camp-Rabatt" → „reduziertes Honorar für Camp-Artists"
- [x] „Du buchst" → „Du vereinbarst"
- [x] „Keine Pakete, keine Mindestbuchung" → „Einzelne Termine, keine Pakete"
- [x] API-Bestätigungs-Mail „zu deinem Platz" entfernt

### Sitemap-Update (Commit `0a64f67`)
- [x] `<lastmod>` auf 2026-04-23 für alle 8 Content-Routen
- [x] XML-Validität via `xmllint` geprüft
- [x] Alle referenzierten Routen lokal vorhanden

### Session 3 Docs
- [x] `PERFORMANCE_AUDIT.md` erstellt (1. Umfassendes Findings-Dokument)
- [x] PROJECT.md auf Session-3-Endstand
- [x] TODO.md auf Session-3-Endstand

---

## ✅ Completed (Session 2, commits bis `7994246 f8`)
_Feature-Expansion: Lab-Seite, Kontakt Mail-First, Testimonials, Motion-Layer, Dual-Mail-Templates._
_Details siehe git log oder PROJECT.md in Session-2-State._

---

## 🔄 In Progress
*— nichts gerade aktiv. Session 4 sauber abgeschlossen.*

---

## ⏳ Backlog (Priority Order)

### Nach dem Push (höchste Prio)
- [ ] **`git push`** → Vercel deployed Lab-Eingang automatisch
- [ ] **Smoke-Test** der neuen 4-Card-Symmetrie auf Live: Desktop (4 Spalten 457px gleich), Mobile (Spalte gestackt)
- [ ] **Lab-Klick-Test**: alle 4 Karten ziehen sauber zur jeweiligen Route, Lab-CTA erreicht Lab-Page
- [ ] **Sitemap-`<lastmod>`** für Home-Route auf 2026-05-02 hochziehen + GSC re-submitten
- [ ] **Spam-Schutz testen**: einmal über Songcamp-Form schicken (sollte durchgehen), einmal mit ausgefülltem Honeypot-Feld via DevTools (sollte 400 bekommen)

### Rechtssicherheit (außerhalb Code — mit Anwalt/Steuerberater)
- [ ] **Widerrufsbelehrung im Songcamp-Bestätigungs-Workflow** (Fernabsatzvertrag §312c BGB — sonst Widerruf bis 12 Monate + 14 Tage möglich)
- [ ] **Produktions-Vereinbarungs-Template** mit Urheberrechts- und Leistungsschutz-Klauseln (falls noch nicht vorhanden)
- [ ] **Songcamp-Vereinbarungs-Template** mit Storno-Staffelung

### Brand-Maintenance (wartet auf User)
- [ ] Photo-Credits für Marco Olbert / Daniel Dominguez / Elena Kovacs einbauen (User reicht nach)
- [ ] **Resend Domain-Verifikation**: DKIM/SPF bei Domain-Registrar, dann `CAMP_ANFRAGEN_FROM` auf `hallo@klaundbauter-musikproduktion.com`
- [ ] **Alumni-Quotes Songcamp**: Platzhalter durch echte Zitate ersetzen sobald vorhanden

### Optional / Nice-to-have
- [ ] **Spam-Schutz Stufe 2** (Captcha) — nur falls Stufe 1 nicht reicht
- [ ] **JS/CSS-Minification** via esbuild/terser — konfliktet mit „3-File-Rule", Ersparnis klein (~5 KB gzipped). Nur wenn Lighthouse-Mobile sinkt.
- [ ] `content-visibility: auto` auf below-fold Sections als Render-Skip-Optimierung
- [ ] Critical-CSS-Inlining (above-the-fold) im `<head>` statt externer style.css
- [ ] 301-Redirects für `/songcamps`, `/sessions` in `vercel.json` (falls Backlinks)
- [ ] Cross-Browser-Test `100dvh` / `100svh` auf iOS Safari verifizieren

### Niedrig-Prio Code-Kosmetik
- [ ] Restliche ~81 Inline-Styles in index.html durchgehen (viele sind Kontext-spezifische Einzel-Props — Kosten/Nutzen überschaubar)
- [ ] Ungenutzte Compound-Selektor-Reste (`.camp-cta`, `.camp-img`, `.contact-grid`, `.editorial-cta`, `.editorial-item`, `.page-content-grid`, `.quote`) — harmlos, greifen nur in Kombinationen mit benutzten Parents

## Blocked / On Hold
*— nichts.*
