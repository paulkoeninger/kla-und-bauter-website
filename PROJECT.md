# Kla & Bauter Website — Projekt-Status

## Current Status
- **Last Updated:** 2026-04-23 (Session 3 abgeschlossen)
- **Current Phase:** Produktion-ready — ausstehend nur noch `git push` zu Vercel und Lighthouse-Verifikation
- **Branch:** `main` (working tree clean, bis `0a64f67`, alle Änderungen committed)
- **Deployment:** Vercel — https://www.klaundbauter-musikproduktion.com

## Architektur (Kurz)
Editoriale Vanilla-SPA. Drei-File-Regel: `index.html` (1.132 Z), `style.css` (2.857 Z), `script.js` (815 Z). Pre-rendered Routes via `build.js` (143 Z, inkl. HTML-Minification). Serverless APIs: `api/camp-anfragen.js` + shared `api/_email.js`. Resend als Mail-Versanddienstleister. GSAP 3.12 für Page-Transitions (ScrollTrigger entfernt).

---

## Completed This Session (Session 3)

**10 Commits zwischen `f3e5fc6` und `0a64f67`.** Session-Inhalt in 5 Blöcke:

### Block A — Performance-Cleanup (Phase 3.1, 3.2, 3.3)
- **Phase 3.1:** ScrollTrigger entfernt (17 KB gzip, 0 Usages), 8 Legacy-Testimonial-Images gelöscht (1.6 MB), dead JS vars raus, slideSelectors auf 6 echte Selektoren reduziert, `api/kontakt.js` gelöscht, Datenschutz-Text von „Kontaktformular" auf „E-Mail" umgestellt.
- **Phase 3.2:** 118 orphaned CSS-Rule-Blöcke entfernt (-14 % style.css). 165 → 81 Inline-Styles durch neue semantische Klassen (`.testimonial-*`, `.sc-day-*`, `.sc-stat-*`, `.editorial-title--hero-size`, `--price`). `fonts/fonts.css` von 18 → 6 @font-face-Deklarationen (-59 %).
- **Phase 3.3:** HTML-Minifier in build.js integriert (+50 Z, kein npm-Dep). Alle pre-rendered Routes zusammen 701 KB → 499 KB (**-28.8 %**).

### Block B — Bild-Optimierung & Font-Preload (Phase 4)
- 11 große Content-Bilder bekamen 800w + 1200w WebP-Varianten via `cwebp -q 80 -m 6`.
- 18 `<img>`-Tags um `srcset` + kontextgerechte `sizes`-Attribute ergänzt (21 total mit hero_home).
- Datei-Rename: `Kla & Bauter Studio-100.webp` → `studio.webp` (Leerzeichen + `&` brachen srcset-Parsing).
- Font-Preload-Hints im `<head>` für Inter + Cormorant latin-300-Subsets.
- **Mobile-Ersparnis ~80 % pro Content-Bild** (z. B. sc_mood4: 315 KB → 22 KB Mobile-Variante).

### Block C — Hero Bug-Fix + Session-Titel (Commit `e693aa3`)
- **Root Cause gefunden:** `.editorial-split`-Hero-Texte auf Session + Lab wurden nach SPA-Navigation vertikal zentriert statt top-left, weil GSAP's `clearProps: "all"` nach Page-Transition das komplette style-Attribut von `.snap-block-inner` wipt — inkl. Inline-`align-items: start`.
- **Fix:** Neue Klasse `.editorial-split--hero { align-items: start }` + Base-Default `margin-top: 0` → immun gegen clearProps. Alle 9 `.editorial-split` Vorkommen auf Klassen-basierte Styles umgestellt.
- **Bonus:** „Sessions" → „Session" im Session-Hero-Kicker. 9 weitere inline-Styles entfernt als Nebenwirkung.

### Block D — Echtes Inter 600 für Hero-Title (Commit `70c56f5`)
- Durch die fonts.css-Konsolidierung in Phase 3.2 wurde der Hero-Title `KLA & BAUTER` browser-synthesisiert (faux-bold vom 300er-File) statt mit echter 600er-Schnittweite gerendert.
- **Fix:** Echte `inter-600-n-latin.woff2` (24 KB) + `inter-600-n-latin-ext.woff2` (36 KB) von Google Fonts v20 gezogen, selbst gehostet, als `@font-face` deklariert.
- `<link rel="preload">` für 600er latin hinzugefügt — Hero-Title ist LCP-Kandidat, Font lädt jetzt parallel zum Hero-Bild.

### Block E — Freie-Berufe-Text-Audit (Commit `75d36bd`)
**Wichtig steuerrechtlich.** Textueller Review gegen §18-EStG-Signale — Ziel: Website soll nicht nach Pauschal-Event-Gewerbe klingen sondern nach freiberuflich-künstlerischer Tätigkeit. 10 Gewerbe-Risiko-Begriffe entfernt:

| Vorher | Nachher |
|---|---|
| Sieben Tage. Unterkunft inklusive. | Sieben Tage. Ein Haus. |
| Songwriting-Retreat (×5) | Songwriting-Camp |
| 6 Teilnehmer / Personen | 6 Artists |
| Mittagspause inklusive | mit Mittagspause |
| „Gemeinsam kochen" als Struktur-Säule | „Gemeinsam essen" als soziales Ritual („Kein Catering, kein Service") |
| Paketpreise auf Anfrage | Besprechen wir individuell |
| Camp-Rabatt | reduziertes Honorar für Camp-Artists |
| Du buchst einen Lab-Termin | Du vereinbarst einen Lab-Termin |
| Keine Pakete, keine Mindestbuchung | Einzelne Termine, keine Pakete |
| API-Mail „zu deinem Platz" | entfernt |

Positive §18-Signale wurden bewusst verstärkt bzw. erhalten: „Wir sind keine Lehrer. Keine Coaches.", „Wir verkaufen keine Karriere. Keine Illusion.", „Mit dir. Nicht für dich.", „Für Artists, die eigene Songs schreiben — nicht lernen", „Kein Kurs. Kein Workshop."

**Risiko-Einschätzung:** Mittel → Niedrig.

### Block F — Sitemap-Update (Commit `0a64f67`)
- `<lastmod>` auf 2026-04-23 für alle 8 Content-Routen (alle heute inhaltlich verändert).
- Struktur unverändert, XML-valid via `xmllint` geprüft.
- Alle referenzierten pre-rendered HTMLs existieren lokal.

---

## What's Working (production-ready)

- ✅ Alle 9 Routen SPA + pre-rendered mit route-spezifischen Metas + Minification
- ✅ Lab-Page vollständig (Hero · Wie es funktioniert · Preis · Pausen-Bilder)
- ✅ Kontakt Mail-First (Form entfernt, Formular-API archiviert via git)
- ✅ Songcamp-Anfragen mit Dual-Mail via Resend (Team + User-Bestätigung)
- ✅ 6 echte Testimonials (3 mit Photo-Credits: NICS, Georgie, Divamant)
- ✅ Motion-Layer: Section-Enter-Stagger + Magnetic Buttons (rAF-Lerp, 4px max, smoothstep)
- ✅ Promise-Text-Reveal auf Songcamp (Desktop Zipper + Mobile IntersectionObserver)
- ✅ Lite-YouTube-Embed (Releases) ohne Cookies vor Klick
- ✅ Responsive Image-Pipeline (800w/1200w/2048w WebP-Varianten für alle großen Content-Bilder)
- ✅ Inter 600 mit echtem Font-File (kein faux-bold)
- ✅ Hero-Alignment auf Session/Lab — race-condition-immun via Klassen
- ✅ Text-Content Freie-Berufe-sauber

## Known Issues / Offene Punkte

- ⏳ **Deploy + Lighthouse-Messung** stehen noch aus — Ausgangspunkt war Desktop 100/90/100/100, Mobile 93/90/100/100. Nach Cleanup erwarte ich Mobile-Performance auf ≥95.
- ⏳ **Sitemap bei Google Search Console erneut einreichen** nach Deploy (`sitemap.xml`-Eintrag in der GSC-Sitemaps-Sektion).
- ⏳ **Photo-Credits** nachreichen für Marco Olbert / Daniel Dominguez / Elena Kovacs (User reicht nach).
- ⏳ **Resend Domain-Verifikation** (DKIM/SPF-Records bei Domain-Registrar), dann `CAMP_ANFRAGEN_FROM` auf `hallo@klaundbauter-musikproduktion.com`.
- 📝 **Rechtsseitig offen** (außerhalb Code): Widerrufsbelehrung im Songcamp-Bestätigungs-Workflow (Fernabsatzvertrag §312c BGB). Keine AGB nötig. Sollte mit Anwalt/Steuerberater geklärt werden.

## Key Decisions Made This Session

- **Fonts: Real 600 für Hero, Synthese für den Rest.** Hero-Title braucht echte Präsenz — 60 KB für 2 echte Weight-Files sind den LCP-Impact wert. Body-Text verträgt faux-bold aus 300er.
- **HTML-Minifier selbst geschrieben, kein npm-Dep.** 50-Zeiler in build.js, deckt 80 % ab. esbuild/terser würde die 3-File-Rule brechen und nur ~5 KB gzipped extra sparen.
- **`margin-top: 0` als `.editorial-split` Default.** Alle 9 Usages hatten inline-override auf 0 — der alte Default `var(--space-xl)` war totes Erbe. Keine Regression bei Mobile, da auch die Media-Query-Override entfernt wurde.
- **Image-Rename `Kla & Bauter Studio` → `studio`.** Leerzeichen + `&` in srcset-URLs ist spec-illegal. Browsers trennen an Whitespace.
- **Keine FAQ-Seite / kein FAQ-Pattern.** Brand ist editorial, FAQ wirkt korporativ. SEO-Rich-Results für FAQ sind seit 2023 eh tot. Echte Fragen besser integriert in bestehende Seiten — wenn überhaupt.
- **Keine AGB.** Freiberufler + individuelle Vereinbarungen pro Projekt machen AGB kontraproduktiv. Stattdessen: Widerrufsbelehrung im Fernabsatz-Workflow (Songcamp-Bestätigung) klären.
- **Gewerbe-Vokabular raus statt „freiberuflich"-Disclaimer rein.** Texte bleiben editorial, werden nur präziser.

## Dependencies & Integration Notes

- **GSAP** (CDN 3.12.5): `gsap.set`, `gsap.timeline`, `gsap.to` — für SPA-Page-Transitions, Menu-Slide, Loader-Fadeout. ScrollTrigger entfernt.
- **Resend**: Nur noch Songcamp-Anfragen (Kontakt-Form ist weg). Env-Vars in Vercel: `RESEND_API_KEY`, `CAMP_ANFRAGEN_FROM`, `CAMP_ANFRAGEN_TO`.
- **build.js**: Läuft bei `vercel build` + lokal `node build.js`. Minifier default-an (`MINIFY = true`).
- **Google Fonts** NICHT als CDN genutzt — 600er-Weight-Files **einmalig** von v20 heruntergeladen, sind jetzt selbst gehostet in `fonts/`. Keine laufende Verbindung.

## Next Steps (Priority Order)

1. **`git push`** → Vercel deployed automatisch
2. **Visuelle Smoke-Tests** auf Live-Site: alle 9 Routen durchklicken, Hero-Alignment auf Session/Lab nach Navigation prüfen, Inter 600 im Hero testen
3. **Test-Anfrage** über Songcamp-Formular → Bestätigungs-Mail checken
4. **Lighthouse** auf `/`, `/songcamp`, `/produktion` (Desktop + Mobile) — Vergleich zu Baseline
5. **Sitemap in GSC re-submitten** (`sitemap.xml` im Search-Console-Feld)
6. **Widerrufsbelehrung + Produktions-Vereinbarung** mit Anwalt / Steuerberater klären (außerhalb Code)
7. **Photo-Credits** einbauen, sobald User sie nachreicht
8. **Resend Domain-Verifikation** (DKIM/SPF)
