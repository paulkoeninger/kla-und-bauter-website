# Performance Audit — Kla & Bauter Website
**Datum:** 2026-04-22
**Commit:** 7994246 f8
**Gesamt-Bundle (aktuell):** ~208 KB kritische Assets + 4.7 MB Bilder + 280 KB Fonts

---

## Executive Summary — Top 7 Wins (nach Impact sortiert)

| # | Maßnahme | Ersparnis | Aufwand |
|---|---|---|---|
| 1 | **ScrollTrigger-CDN entfernen** (wird nirgends aufgerufen) | ~17 KB gzip / 1 HTTP-Request | 1 min |
| 2 | **Legacy Testimonial-JPEGs löschen** (7 Dateien, nicht referenziert) | **1.6 MB** | 1 min |
| 3 | **60 orphaned CSS-Klassen entfernen** (geschätzt ~1.200 Zeilen / 38 % der CSS) | ~20–30 KB raw / ~5–8 KB gzip | 45 min |
| 4 | **Inline-Styles → CSS-Klassen** (165 Inline-Styles in index.html, viele repeated) | ~8–12 KB HTML × 10 Routen = 80–120 KB | 60 min |
| 5 | **fonts.css konsolidieren** (18 @font-face für 6 Dateien; weights 400/500/600 → gleiche Files) | Parse-Speed + Klarheit | 15 min |
| 6 | **HTML-Minification im build.js** | ~10–15 % pro Route × 10 = ~60 KB | 20 min |
| 7 | **api/kontakt.js archivieren** (unused; deployed als Cold Function) | Cold-Start-Overhead weg | 5 min |

**Erwartete Gesamt-Ersparnis:**
- **1.6 MB Bilder** (loaded on-demand — bei Testimonial-Section ~620 KB Worst-Case)
- **~100 KB HTML** insgesamt (über alle pre-rendered Routen)
- **~17 KB JS** (ScrollTrigger)
- **~25 KB CSS** raw / ~8 KB gzip

---

## 1. Dateigrößen (Ist-Zustand)

```
index.html       83 KB  / 1.127 Zeilen
style.css        89 KB  / 3.160 Zeilen
script.js        35 KB  /   821 Zeilen
build.js       3.2 KB  /    91 Zeilen
fonts/         280 KB  /   7 Dateien
images/        4.7 MB  /  32 Dateien
```

10 pre-rendered HTMLs à ~85 KB (alle fast identisch — nur route-spezifische Metas unterschiedlich).

---

## 2. Images — 1.6 MB tot im Repo

### Unused Dateien (können gelöscht werden)
| Datei | Größe |
|---|---|
| `images/testimonials/Georgie_Chapple_Moritz_Wolf.jpeg` | 671 KB |
| `images/testimonials/NICS_AndréLietz.jpeg` | 312 KB |
| `images/testimonials/Divamant_c_Dunja Krefft.jpeg` | 279 KB |
| `images/testimonials/Marco_Olbert.jpg` | 168 KB |
| `images/testimonials/Elena_Kovacs.jpg` | 135 KB |
| `images/testimonials/Michael_Baechle.jpg` | 66 KB |
| `images/testimonials/Daniel_Dominguez.jpg` | 60 KB |
| `images/testimonials/Michael_Baechle.webp` | 1.3 KB |
| **Summe** | **~1.6 MB** |

→ 0 Referenzen in HTML/CSS/JS. Kann weg.

### Große Bilder, die noch Optimierungs-Potenzial haben
| Datei | Aktuell | Bemerkung |
|---|---|---|
| `sc_mood4.webp` | 315 KB | WebP, aber kein srcset |
| `produktion_2.webp` | 285 KB | WebP, aber kein srcset |
| `produktion.webp` | 265 KB | WebP, aber kein srcset |
| `camp_home.webp` | 224 KB | Wird home-Karte, kein srcset |
| `mix.webp` | 212 KB | WebP, kein srcset |

→ Könnten alle analog zu `hero_home` (800/1200/2048w) responsive-variants bekommen. Ersparnis auf Mobile: ~50–70 % der Bytes pro Bild.

### `images/produktion_2.webp` und `images/Kla & Bauter Studio-100.webp`
**10 Referenzen** — aber nur in alten pre-rendered HTMLs, nicht mehr in `index.html` template. Müssen durch `build.js` neu überschrieben werden wenn `index.html` keine Referenz mehr hat. **Check nötig**, ob die pre-rendered HTMLs stale sind.

---

## 3. Fonts — Overkill für das Design

### Aktueller Stand `fonts/fonts.css`
- **18 @font-face-Deklarationen**
- Aber nur **6 WOFF2-Dateien** existieren
- Cormorant 400 italic → mapped auf `cormorant-300-i-*` (also faux-bold)
- Cormorant 600 normal → mapped auf `cormorant-300-n-*` (faux-bold)
- Inter 400/500/600 → alle mapped auf `inter-300-n-*` (faux-bold)

### Font-Weight-Usage im CSS
```
34× font-weight: 400   ← mapped auf 300-File, browser synthesisiert
20× font-weight: 300   ← nativ
13× font-weight: 500   ← mapped auf 300-File, synthesisiert
 7× font-weight: 600   ← mapped auf 300-File, synthesisiert
```

**Entscheidung notwendig:**
- **Option A (konservativ):** Alle synth-Weights aus CSS rausnehmen, überall 300 nutzen. Cormorant → nur 300 italic + 300 normal. Ersparnis: -12 @font-face-Blocks, klarere Hierarchie.
- **Option B (korrekt):** Echte 400/500/600-WOFF2-Files dazuladen (~40 KB extra pro Weight, 4×2=8 neue Files = 320 KB mehr). Aber editoriales Design lebt von 300/400 — 500/600 sind wahrscheinlich überbewertet.
- **Empfehlung: A.** Im editorialen Look braucht es keine faux-bold.

### Fehlende Performance-Hints
- Keine `<link rel="preload" as="font" crossorigin>` für kritische Fonts
- Keine `font-display: optional` für Cormorant (derzeit `swap` — Layout-Shift-Risiko)

---

## 4. CSS — 60 orphaned Klassen (~38 % der Datei)

### Echte Orphan-Klassen (nur in style.css, nicht in HTML/JS)

**Camp/Songcamp (11):** `camp-cta`, `camp-finish-closing`, `camp-image-col`, `camp-image-wrapper`, `camp-img`, `camp-layout`, `camp-pointer-standalone`, `camp-text-col`, `songcamp-houses`, `songcamp-register`, `branch-summer`, `branch-winter`

**Kontakt (alt, Form entfernt):** `contact-grid`, `contact-studios-grid`, `email-link`, `studio-address`, `studio-label`, `submit-btn`

**Editorial-Defensive/Legacy:** `editorial-cta`, `editorial-container`, `editorial-full-img`, `editorial-header`, `editorial-item`, `editorial-list`

**Process/Detail:** `process-details`, `process-overview`, `detail-image`, `detail-number`, `detail-text`, `step-icon`, `step-subtext`

**Promise-System (legacy DOM-gen):** `w1`-`w4`, `s1`-`s3`, `mm-word`, `mm-node`, `mm-center`

**Sonstige:** `feature-icon`, `feature-item`, `feature-text`, `info-item`, `cta-accent-line`, `cta-button`, `page-container`, `page-content-grid`, `sc-cta-box`, `sc-fact-grid`, `sc-format-grid`, `sc-fuer-wen`, `sc-list-item`, `sc-list-item--light`, `reverse-grid`, `quote`, `content-img`, `footer-link`, `hero-Mobile-Logik`

**Geschätzter Impact:** ~1.191 Zeilen CSS / **38 % der Datei**. Realistisch eher 600–800 Zeilen nach Verification, weil manche Klassen als Kontext-Selektoren (`.parent .child`) zählen.

### Zusätzlich: `slideSelectors` in script.js enthält 11 tote Klassen
```js
const slideSelectors = '.hero-title, .hero-subtitle, .image-wrapper, 
    .section-title, .service-item, .page-title, .text-content, 
    .image-content, .video-wrapper, .contact-info, .contact-form, 
    .legal-text, .produktion-intro, .process-step, .detail-section, 
    .songcamp-headline, .feature-list, .info-items, .songcamp-banner, 
    .snap-block-inner';
```
Nicht (mehr) in HTML vorhanden: `.service-item`, `.page-title`, `.text-content`, `.image-content`, `.contact-info`, `.contact-form`, `.legal-text`, `.produktion-intro`, `.songcamp-banner`, `.feature-list`, `.info-items`
→ **Performance-Impact:** klein (querySelectorAll mit leerem Ergebnis ist fast kostenlos), aber Code-Sauberkeit.

---

## 5. JS — Kleinere Dead Code + ScrollTrigger-Waste

### Dead Vars
```js
// script.js Line 674–675
const revealCanvas = document.getElementById('revealCanvas');   // kein #revealCanvas in HTML
const revealShapes = document.getElementById('revealShapes');   // kein #revealShapes
```
→ Können gelöscht werden.

### **CRITICAL: ScrollTrigger wird geladen, aber nie verwendet**
```html
<!-- index.html Line 1123–1124 -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
```
→ `grep ScrollTrigger script.js` = **0 matches**. Kann komplett raus. Ersparnis: ~17 KB gzip + 1 HTTP-Request + Parse-Zeit.

### GSAP-Nutzung ist minimal
- Nur `gsap.set`, `gsap.timeline`, `gsap.to`
- **Alternative überlegen:** Mit reinem CSS (`transition`, `@keyframes`, Web Animations API) wäre GSAP (~23 KB) komplett ersetzbar. Aber: Die Page-Transition-Timeline ist zentral und nicht trivial. **Empfehlung: GSAP behalten, ScrollTrigger raus.**

### Event-Listeners: 20 addEventListener, 0 removeEventListener
In einer SPA ist das **ein Memory-Leak-Risk**, wenn Sections häufig rein/raus gerendert werden. Aber: Bei dieser Site werden Sections nur ge-showed/hidden, nicht aus dem DOM entfernt. → kein akutes Leak. Aber IntersectionObserver-Targets werden bei `snap-block.is-revealed` korrekt `unobserve`d. Sauber.

---

## 6. HTML — 165 Inline-Styles extrahierbar

### Top-Patterns (wiederholen sich 4–8 mal)
```
8× style="padding: 0;"
8× style="margin-top: 0;"
6× style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover; flex-shrink: 0;"  ← Testimonial-Avatar
6× style="font-size: 16px; line-height: 1.75; font-weight: 300; ...; margin-bottom: 1.5rem;"  ← Testimonial-Quote-Body
6× style="font-size: 13px; font-weight: 500; color: var(--text-primary);"                     ← Testimonial-Name
6× style="font-size: 11px; color: var(--text-secondary);"                                     ← Testimonial-Role
6× style="background: var(--bg-primary); border: ...; border-radius: 4px; padding: 2rem; ..." ← Testimonial-Card
```

**Größte Gewinne:**
- `.testimonial-card`, `.testimonial-avatar`, `.testimonial-quote`, `.testimonial-name`, `.testimonial-role` — extrahieren → ~2 KB pro Card × 6 = 12 KB pro HTML. Bei 10 pre-rendered HTMLs = **~120 KB gesamt**.
- `.editorial-title--hero-size` (5× `style="font-size: clamp(2.5rem, 5vw, 4rem); line-height: 1.15;"`)
- `.editorial-title--centered` für die 4× wiederholten Preis-Titel
- `.camp-pointer-kicker`, `.camp-pointer-label` für die 5× wiederholten Pointer-Strukturen

**Kleine Wins:**
- `style="padding: 0;"` auf `.page-section` → als Default in Base-CSS
- `style="margin-top: 0;"` → per `.snap-block-inner--flush` Modifier

---

## 7. API — `api/kontakt.js` archivieren

### Status
- `api/camp-anfragen.js` → **aktiv**, nutzt `_email.js`
- `api/_email.js` → **shared**, benötigt für camp-anfragen
- `api/kontakt.js` → **dead**, keine Form mehr im Frontend, nur 1 Kommentar in script.js referenziert sie

### Empfehlung
- **Löschen** (git log behält Historie)
- Wenn Form-Comeback irgendwann: aus git-history restorable
- `_email.js` bleibt
- Datenschutz-Text: "Kontaktformular"-Eintrag kann raus, "Versanddienstleister (Resend)" bleibt (wegen camp-anfragen)

---

## 8. Build-Pipeline — Potenzial

### Aktuell
`build.js` liest Template + `routeMeta` → schreibt 10 HTMLs mit nur unterschiedlichen Metas. Kein Minification, keine CSS-Inlining.

### Optional (Phase 3.2)
- **HTML-Minification:** html-minifier-terser oder eigene simple Regex (whitespace between tags). ~10–15 % pro HTML.
- **Critical-CSS-Inlining:** Für Above-the-Fold Styles in `<head>`. Komplex — eher skip. Better: `<link rel="preload" as="style">` für style.css.
- **CSS-Minification:** style.css 89 KB unminified. Minifier würde auf ~60 KB runter. Via esbuild oder cssnano.
- **JS-Minification:** script.js 35 KB → ~22 KB minified. Via esbuild.

### Vorschlag
Simple `build.js`-Erweiterung mit `esbuild` (bereits quasi-dependency-frei, einmal installiert):
```js
import esbuild from 'esbuild';
await esbuild.build({
  entryPoints: ['style.css', 'script.js'],
  minify: true,
  outdir: 'dist/',
});
```
+ HTML-Whitespace-Collapse via `.replace(/\s+/g, ' ')` zwischen Tags.

---

## 9. Lighthouse-Prognose (vor Cleanup)

Laut CLAUDE.md schon gemessen: **Desktop 100/90/100/100**, **Mobile 93–100/90/100/100**.

### Mobile A11y nur 90?
→ Hier lohnt sich ein Lighthouse-Run mit Details. Wahrscheinlicher Kandidat: Contrast-Ratio irgendwo, oder ein ARIA-Label fehlt.

### Nach Cleanup zu erwarten
- **Performance:** Desktop bleibt 100, Mobile könnte durch ScrollTrigger-Removal auf 95+ steigen.
- **Best Practices:** Bleibt 100.
- **SEO:** Bleibt 100.
- **A11y:** Separat audit nötig.

---

## 10. Empfohlene Ausführungs-Reihenfolge

### Phase 3.1 — Quick Wins (~20 min, low risk)
1. ScrollTrigger-Script-Tag aus index.html entfernen
2. Legacy Testimonial-JPEGs + Michael_Baechle.webp löschen (`rm images/testimonials/*.jpg images/testimonials/*.jpeg images/testimonials/Michael_Baechle.webp`)
3. Dead vars in script.js (`revealCanvas`, `revealShapes`) entfernen
4. `slideSelectors` auf tatsächlich genutzte Klassen reduzieren
5. `api/kontakt.js` löschen
6. `build.js` laufen lassen → commit

### Phase 3.2 — CSS-Cleanup (~45 min, needs verification)
7. Orphan-CSS-Klassen durchgehen (60 Stück) — jede einzeln verifizieren, nicht blind löschen (Promise-System könnte dynamisch generierte Klassen nutzen)
8. Inline-Styles in index.html in `.testimonial-*` + `.editorial-title--*` Klassen extrahieren
9. `fonts.css` konsolidieren auf nur echte Weights (300 italic + 300 normal — oder 400 dazu wenn echt gewollt)
10. `build.js` laufen lassen → commit

### Phase 3.3 — Build-Pipeline (~30 min)
11. HTML-Minification in `build.js` (simple regex-based erst mal)
12. Lighthouse auf allen 9 Routen messen vorher/nachher
13. Commit

### Phase 3.4 — Optional/Nice-to-Have
14. `esbuild`-Integration für CSS/JS-Minification
15. Responsive srcsets für `sc_mood4`, `produktion_*`, `mix`, `recording*`
16. Preload-Hints für Primary-Font-File

---

## Anhang — Measurement Commands

```bash
# Bundle-Size pro Route messen (nach Build)
du -sh *.html style.css script.js

# CSS-Klasse-Usage verifizieren
grep -oE '\.[a-zA-Z][a-zA-Z0-9_-]+' style.css | sort -u > /tmp/css.txt
grep -ohE '[a-zA-Z][a-zA-Z0-9_-]+' index.html script.js | sort -u > /tmp/used.txt
comm -23 /tmp/css.txt /tmp/used.txt

# Images referenziert vs. vorhanden
find images -type f \( -name "*.webp" -o -name "*.jpg" -o -name "*.jpeg" \) -printf '%f\n' | \
  while read f; do
    grep -q "$f" *.html style.css script.js || echo "UNUSED: $f"
  done
```
