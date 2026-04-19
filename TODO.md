# TODO — Kla & Bauter Website

## ✅ Completed This Session (2026-04-19)

### Responsive / Mobile
- [x] Spacing-Tokens (`--edge`, `--content-top`) zentralisiert
- [x] Breakpoints auf 480/768/992 harmonisiert (Exoten migriert)
- [x] `100vh` → `100svh` global (iOS-Safari-robust)
- [x] Mobile-Sections mit 80svh min-height + center (Desktop-Ästhetik)
- [x] Hero Mobile: 100svh erzwingen, justify-content space-between
- [x] Songcamp-Hero: Meta-Spalte aus erstem Viewport gepusht
- [x] Navbar-Klabautermann: Size 42px auf Mobile (wie Footer)
- [x] Menu-Toggle robust ausgerichtet (height matcht Logo, kein magic-number)
- [x] Footer Mobile-Layout: CTA + Studios + Klabautermann
- [x] Footer Navigation Line-Height auf Adress-Level gebracht

### Navigation
- [x] Fullscreen-Menü redesigned (Canela, sentence-case, weight 400)
- [x] Kapitelnummern via CSS `counter()`
- [x] Menü 100svh erzwungen, startet auf Höhe des X-Burger
- [x] Subtitles versucht, dann entfernt (User-Feedback)
- [x] Schrift reduziert für editorial „gewollt-100vh"-Look
- [x] Alle Navigation-Links führen IMMER ans Top (auch same-route)

### Home-Section „Wonach ist dir?"
- [x] 3-Karten-Redesign: alle permanent sichtbar
- [x] Songcamps-Card: default blurry + „Ich weiß noch gar nicht genau"-Hint
- [x] Hover schärft + fadet Hint aus (nur `@media (hover: hover) and (min-width: 993px)`)
- [x] IntersectionObserver unobserve nach erstem Reveal (keine Re-Animation beim Scroll-Up)
- [x] Reveal-Timing agiler (delays 0.05/0.12/0.2s, transitions 0.35/0.4s)

### Content-Überarbeitung
- [x] Akzent-Hervorhebungen kuratiert (Anfänger/Karriere-Workshop/längst/Camps entfernt)
- [x] „Für Wen"-Bulletpoints Vision-konform neu
- [x] Paul-Bio ergänzt auf Vision-Original
- [x] Camp-Finish „braucht" 4× → 0×
- [x] Produktion + Releases Sub-Headlines oliv+kursiv
- [x] Songcamp-Title: „Fünf Tage, ein Haus, deine Musik"
- [x] „Gedanken aus den Camps" Highlight entfernt
- [x] Team-Struktur: Rolle = Kicker, Name = Headline
- [x] Adrian-Portrait getauscht auf produktion_2

### Rechtliches
- [x] Impressum DDG-konform (§ 5 DDG, V.i.S.d.P., Haftung, Bildnachweise)
- [x] Datenschutz DSGVO-konform (Vercel, YouTube, Fonts, Betroffenenrechte)
- [x] Email überall auf `hallo@klaundbauter-musikproduktion.com`
- [x] Mobile Legal-Pages im editorial Style

### Fonts + Assets
- [x] Google Fonts self-hosted (Cormorant + Inter, 6 WOFF2-Dateien)
- [x] Font-URL-Bug gefixt (doppeltes `fonts/` entfernt)
- [x] Favicon Klabautermann mit Dark/Light-Modus
- [x] Alle JPGs zu WebP konvertiert (22 Bilder, ~27% Einsparung)
- [x] Responsive Hero (800/1200/2048w via srcset + preload imagesrcset)
- [x] Navbar-Logo: 236 KB → 2.4 KB (100× kleiner)

### Warteliste-Formular
- [x] HTML (Name + Email + Submit + Feedback)
- [x] CSS (form-card editorial)
- [x] Client-JS Submit-Handler mit Validation
- [x] Vercel Serverless Function `/api/waitlist.js`
- [x] package.json ESM + build-script
- [x] vercel.json outputDirectory + rewrites
- [x] .gitignore erweitert

### SEO
- [x] Title, Meta-Description, Open Graph, Twitter Cards
- [x] Canonical URLs
- [x] JSON-LD Organization + Services (Preise inklusive)
- [x] sitemap.xml (7 Routen, bei Search Console eingereicht)
- [x] robots.txt
- [x] Route-basierte SEO-Updates via `updateSEOMeta()` in JS
- [x] Prerendered HTML pro Route via `build.js`
- [x] Domain-Redirect-Konflikt aufgelöst (www als Primary)
- [x] Alt-Texte systematisch verbessert (20+ Bilder)
- [x] Google Search Console DNS-verifiziert

### Performance + A11y
- [x] Lighthouse Baseline + Final-Audit
- [x] Preload Hero + fetchpriority high
- [x] loading="lazy" auf 16 Sub-Route-Bilder
- [x] Form-Inputs mit aria-label
- [x] Crawlable anchors (href statt onclick)
- [x] Teaser-Kicker Contrast-Fix (4.86:1)
- [x] Footer Heading-Order (h4 → h3)

### Zwischendurch
- [x] Klabautermann Mouse-Follow-Parallax im Teaser
- [x] Alumni-Section „Mehr Stimmen"-Button (+3 pro Klick)
- [x] Hover-Effekte komplett auf Touch deaktiviert
- [x] Fünf-Tage-Section Design-Linien aufgeräumt
- [x] Camp-Finish-Section visuell identisch zu Fünf-Tage
- [x] Warteliste-CTA-Row Mobile-Layout (Button als Editorial-Link)

---

## 🔄 In Progress
_(Nichts akut am Laufen — Session abgeschlossen)_

---

## ⏳ Backlog (Priorität)

### Blocking für Warteliste-Launch
- [ ] **Resend**: Domain `klaundbauter-musikproduktion.com` in Resend verifizieren (DKIM/SPF DNS-Records)
- [ ] **Vercel Env-Vars** setzen: `RESEND_API_KEY`, `WAITLIST_FROM`, `WAITLIST_TO`
- [ ] **End-to-End Test**: Warteliste-Formular → Mail empfangen bestätigen

### Wartung & Cleanup
- [ ] Alte JPG-Originale aus `images/` löschen (~6 MB, nicht mehr referenziert)
- [ ] Optional: 404-Page gestalten
- [ ] Optional: CSS/JS Minification in build.js integrieren

### Nach Launch / Monitoring
- [ ] Search Console in 2-4 Wochen: Indexing aller 7 Routen prüfen
- [ ] Core Web Vitals Field-Data anschauen (sobald Traffic da)
- [ ] Warteliste-Conversions monitoren
- [ ] Social-Media-Preview-Cache aktuell halten (Facebook Debugger scrape on change)

### Content (perspektivisch)
- [ ] Releases: YouTube-IDs aktualisieren wenn neue Tracks kommen
- [ ] Alumni-Stimmen: Platzhalter durch echte Quotes ersetzen
- [ ] Team-Bios eventuell bebildern (Portrait + Studio-Setup-Bild)

### Features die besprochen aber nicht gebaut wurden
- [ ] Cookie-Consent-Banner (erst wenn wir Analytics dazuschalten)
- [ ] Analytics-Tool (Plausible oder Matomo) — perspektivisch
- [ ] Prerendered HTMLs für Sub-Routes mit Sub-Route-spezifischem `og:image` (aktuell nutzen alle Hero-Home)

---

## ❌ Blocked / On Hold
_(Nichts blockiert)_

---

## 📊 Success-Metrics Final

| | Desktop | Mobile |
|---|---|---|
| **Performance** | 100 | 93–100 |
| **Accessibility** | 95+ | 95+ |
| **Best-Practices** | 100 | 100 |
| **SEO** | 100 | 100 |
| **LCP** | 0.5s | 1.2–2.7s |
| **FCP** | 0.5s | 1.0–2.4s |
| **CLS** | 0 | 0 |
| **Console-Errors** | 0 | 0 |
