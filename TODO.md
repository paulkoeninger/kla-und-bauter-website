# TODO / Task List

## ✅ Completed (diese Session)

### Design-System
- [x] 6-stufige Spacing-Skala in :root + Mobile-Overrides
- [x] 8-stufige Typografie-Skala (font-size, line-height, letter-spacing)
- [x] Font-Weights von 6 auf 4 reduziert (Faux-Bold eliminiert)
- [x] Akzentfarbe-Audit (opacity: 0.85 auf .cta-accent-line entfernt)
- [x] em-Akzent-System (font-weight: inherit, h1-h6 em color rule, inline-styles raus)

### Hero
- [x] Hero-Title weight 600 als Ausnahme (kein Faux-Bold)
- [x] Desktop overflow-hidden + max-height für flache Viewports
- [x] Mobile: justify-center, padding-top 6rem

### Layout
- [x] Produktion: alle 4 Steps `editorial-split reverse` (Bild links, Text rechts)
- [x] Mix-Bild Mobile margin-top 3rem
- [x] Quote-Sections (Team, Produktion) auf 70svh
- [x] Sessions-Quote auf 60svh
- [x] Sessions-Preis auf 80svh
- [x] Sessions: Songcamp-Verweis-Section gelöscht
- [x] Songcamp-Hero Mobile padding-top 7rem + Meta-Box zentriert
- [x] Releases: „Und jetzt deiner"-CTA gelöscht
- [x] Kontakt-Bild fix (broken link → recording2.webp, 60vh)

### Songcamp Content
- [x] „Für wen"-Section als Card-Grid (Titel + Desc) analog camp-finish
- [x] Persona-Texte überarbeitet (warmer, weniger pathologisch)
- [x] Themenabende-Text geöffnet
- [x] „10–18" Label klarer („Sessions" statt „täglich")
- [x] Camp-Finish-Stages neu formuliert (Wortdopplung weg, „von null" → „Grundgerüst")
- [x] Closing-Satz nach Stages entfernt

### URL/Routing
- [x] `/songcamps` → `/songcamp` (überall: HTML, JS, CSS, vercel, sitemap, .gitignore, CLAUDE.md)
- [x] `/sessions` → `/session` (überall)
- [x] Anchor-URLs sprechend: arrangement/klangwelt/recording/mix-master, format
- [x] Hero-Kicker Songcamp gekürzt
- [x] Alte HTMLs (songcamps.html, sessions.html) aus Filesystem gelöscht

### Camp-Anfragen (war Warteliste)
- [x] User-Texte: „Auf Warteliste setzen" → „Unverbindlich anfragen"
- [x] API-File: waitlist.js → camp-anfragen.js
- [x] API-Endpoint, Env-Vars, CSS-Klassen umbenannt
- [x] Datenschutz-Eintrag aktualisiert
- [x] Bestätigungstext: „Danke, wir melden uns so bald wie möglich."
- [x] Vercel Env-Vars (CAMP_ANFRAGEN_FROM/TO) gesetzt — Mails kommen an

### Navigation
- [x] Footer-Nav + Burger-Menu Reihenfolge: Songcamp zuerst
- [x] Label „Songcamp" (Singular) überall in Nav
- [x] Fullscreen-Menu height: 100dvh fix für Mobile-URL-Leiste

### Diverses
- [x] EP/Album-Hinweis im Camp-Pointer-Style auf Produktions-Preis-Section

## 🔄 In Progress
- [ ] `script.js` letzte Änderung (Form-Bestätigungstext) committen — uncommitted change

## ⏳ Backlog (Priority Order)

### Hoch
- [ ] **Resend Domain-Verifikation**: DKIM/SPF-Records bei Domain-Registrar setzen, dann `CAMP_ANFRAGEN_FROM` auf `hallo@klaundbauter-musikproduktion.com` umstellen
- [ ] **301-Redirects** für alte URLs (`/songcamps`, `/sessions`) in `vercel.json` — falls Backlinks erhalten werden sollen

### Mittel
- [ ] **Alumni-Quotes** auf Songcamp durch echte Zitate ersetzen (sind aktuell Platzhalter)
- [ ] **Lighthouse-Audit** nach allen Refactor-Änderungen erneut prüfen
- [ ] **Cross-Browser-Test** — `100dvh` im Fullscreen-Menu auf iOS Safari verifizieren

### Niedrig / Nice-to-have
- [ ] Falls `hero_home_red.webp` als Custom-Bild geplant: hochladen + Kontakt-Bild-Source zurückstellen
- [ ] Edge-Case Hero auf sehr breiten flachen Viewports (Mobile-Layout-Zone) — nur fixen wenn relevant

## Blocked / On Hold
- _Nichts aktuell._
