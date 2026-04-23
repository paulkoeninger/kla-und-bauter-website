# TODO / Task List

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
*— nichts gerade aktiv. Session 3 sauber abgeschlossen.*

---

## ⏳ Backlog (Priority Order)

### Nach dem Deploy (höchste Prio)
- [ ] **`git push`** → Vercel deployed automatisch
- [ ] **Visuelle Smoke-Tests** auf Live-Site: alle 9 Routen durchklicken
  - Hero-Alignment auf Session/Lab nach Navigation (nicht nur nach Reload)
  - Inter 600 auf Hero-Title prüfen
  - Testimonial-Cards + Songcamp „Wie es läuft"-Grid + Preis-Sections (neue Klassen)
  - Responsive Images: Chrome DevTools Mobile-Mode → Network → checken dass 800w-Variante geladen wird
- [ ] **Test-Anfrage** über Songcamp-Formular → Bestätigungs-Mail checken
- [ ] **Lighthouse** auf `/`, `/songcamp`, `/produktion` (Desktop + Mobile) — Baseline war Desktop 100/90/100/100, Mobile 93/90/100/100
- [ ] **Sitemap in Google Search Console re-submitten** (sitemap.xml re-indexieren lassen)

### Rechtssicherheit (außerhalb Code — mit Anwalt/Steuerberater)
- [ ] **Widerrufsbelehrung im Songcamp-Bestätigungs-Workflow** (Fernabsatzvertrag §312c BGB — sonst Widerruf bis 12 Monate + 14 Tage möglich)
- [ ] **Produktions-Vereinbarungs-Template** mit Urheberrechts- und Leistungsschutz-Klauseln (falls noch nicht vorhanden)
- [ ] **Songcamp-Vereinbarungs-Template** mit Storno-Staffelung

### Brand-Maintenance (wartet auf User)
- [ ] Photo-Credits für Marco Olbert / Daniel Dominguez / Elena Kovacs einbauen (User reicht nach)
- [ ] **Resend Domain-Verifikation**: DKIM/SPF bei Domain-Registrar, dann `CAMP_ANFRAGEN_FROM` auf `hallo@klaundbauter-musikproduktion.com`

### Optional / Nice-to-have
- [ ] **JS/CSS-Minification** via esbuild/terser — konfliktet mit „3-File-Rule", Ersparnis klein (~5 KB gzipped total). Nur wenn Lighthouse-Mobile < 95.
- [ ] `content-visibility: auto` auf below-fold Sections als Render-Skip-Optimierung
- [ ] Critical-CSS-Inlining (above-the-fold) im `<head>` statt externer style.css
- [ ] 301-Redirects für `/songcamps`, `/sessions` in `vercel.json` (falls Backlinks)
- [ ] Cross-Browser-Test `100dvh` auf iOS Safari verifizieren

### Niedrig-Prio Code-Kosmetik
- [ ] Restliche ~81 Inline-Styles in index.html durchgehen (viele sind Kontext-spezifische Einzel-Props — Kosten/Nutzen überschaubar)
- [ ] Ungenutzte Compound-Selektor-Reste (`.camp-cta`, `.camp-img`, `.contact-grid`, `.editorial-cta`, `.editorial-item`, `.page-content-grid`, `.quote`) — harmlos, greifen nur in Kombinationen mit benutzten Parents

## Blocked / On Hold
*— nichts.*
