# Kla & Bauter Website — Projekt-Status

## Current Status
- **Last Updated:** 2026-04-22
- **Current Phase:** Polish & Konsistenz-Refactoring
- **Branch:** `main`
- **Deployment:** Vercel — https://www.klaundbauter-musikproduktion.com

## Architektur (Kurz)
Editoriale Vanilla-SPA — siehe [CLAUDE.md](./CLAUDE.md) für Stack-Details. Drei-File-Regel: `index.html`, `style.css`, `script.js`. Pre-rendered Routes via `build.js` (Single Source of Truth: `routeMeta` in script.js). Serverless API für Camp-Anfragen via Resend.

## Completed This Session

### Design-System-Refactor (Tokens)
- **Spacing-Skala**: 24 verschiedene Werte → 6 Tokens (`--space-2xs` bis `--space-xl`), 169 Anwendungen, Mobile-Override für `lg`/`xl`. 100svh-Sections unangetastet.
- **Typografie-Skala**: 8 font-size Tokens (`--text-micro` bis `--text-hero`), alle 12 Clamp-Formeln konsolidiert. Font-Weights von 6 auf 4 reduziert (300/400/500/600) — Faux-Bold (700/900) komplett eliminiert. 3 Line-Heights, 5 Letter-Spacings.
- **Akzentfarbe**: einheitlich `var(--accent-color)` überall. Eine `opacity: 0.85`-Abweichung auf `.cta-accent-line` gefixt.
- **Em-Akzent-System**: `font-weight: inherit` statt fixed 300 → em in 400er-Headlines bleibt 400. Globale Regel `h1-h6 em { color: accent }`. Alle ~99 inline-styles aus HTML entfernt.

### Hero-Polish
- Hero-Title („KLA & BAUTER") mit explizitem `font-weight: 600` als Ausnahme (Präsenz, kein Faux-Bold).
- Desktop: `overflow: hidden` + `max-height: calc(100svh - 120px)` auf image-wrapper → Bild rutscht nie über Navbar bei flachem Viewport.
- Mobile: `justify-content: center` + `gap: var(--space-lg)`, padding-top explizit auf 6rem für Atem zur Navbar.

### Layout-Symmetrie
- Produktion: alle 4 Steps mit `editorial-split reverse` (Bild links, Text rechts) — konsistent statt alternierend.
- Mix-Bild (`prod-img--lg`) Mobile: `margin-top: 3rem` kompensiert fehlenden Letterbox bei Portrait-Format.
- Sessions: Songcamp-Verweis-Section raus, Preis-Section auf 80svh, Quote-Section auf 60svh.
- Quote-Sections (Team, Produktion) auf 70svh global statt 100svh.
- Songcamp-Hero Mobile: padding-top 7rem, Meta-Box zentriert via `align-self: stretch` + `width: 100%`.

### Songcamp-Page Content
- „Für wen"-Section komplett neu: Card-Grid (Titel + Desc) analog `camp-finish-stages`. Texte überarbeitet (warmer/einladender, kein „Drang"/„Ziehen").
- „Wie eine Woche aussieht": Themenabende-Text geöffnet, 10–18-Label klarer als „Sessions".
- Camp-Finish: Finishing/Completion/Full Production neu formuliert (Wortdopplung schleifen/Schliff weg, „von null" → „Grundgerüst steht").
- Closing-Satz nach Camp-Finish-Stages entfernt (war redundant zum Lead).

### URL-Migration (Singular)
- `/songcamps` → `/songcamp`, `/sessions` → `/session` über alle Files: HTML, JS (`validRoutes`, `routeMeta`), CSS-Selektoren, `vercel.json`, `sitemap.xml`, `.gitignore`, CLAUDE.md.
- Anker-URLs sprechend: `#prod-step-01..04` → `#arrangement / #klangwelt / #recording / #mix-master`. `#sc-format` → `#format`. `#sc-warteliste` → `#camp-anfragen`.
- Hero-Kicker auf Songcamp gekürzt von „Songcamp · Ein Format von Kla & Bauter" zu „Songcamp".

### Camp-Anfragen-Refactor (war „Warteliste")
- User-Texte: „Auf Warteliste setzen" → „Unverbindlich anfragen" (Hero + 2 Form-Buttons).
- API: `api/waitlist.js` → `api/camp-anfragen.js`. Endpoint `/api/waitlist` → `/api/camp-anfragen`.
- Env-Vars: `WAITLIST_FROM/TO` → `CAMP_ANFRAGEN_FROM/TO` (User hat in Vercel neu gesetzt — funktioniert).
- CSS-Klassen: `.sc-waitlist-*` → `.sc-anfrage-*`.
- Datenschutz-Eintrag „Songcamp-Warteliste" → „Songcamp-Anfragen" mit umgeschriebenem Text.
- Bestätigungstext: „Danke, wir melden uns so bald wie möglich."

### Menü + Navigation
- Fullscreen-Menu: `height: 100dvh` (mit `100svh` Fallback) → füllt jetzt korrekt den sichtbaren Viewport, auch wenn Mobile-URL-Leiste eingeklappt ist.
- Footer-Nav + Burger-Menu Reihenfolge: Songcamp → Produktion → Sessions → Team → Releases → Kontakt.
- Label überall „Songcamp" (Singular).

### Diverses
- Releases: „Und jetzt deiner. Wenn du willst."-CTA-Section komplett gelöscht.
- Kontakt-Bild: broken `hero_home_red.webp` → `recording2.webp`, Höhe explizit 60vh.
- Produktion: EP/Album-Hinweis im Camp-Pointer-Style unter dem Vollproduktions-Preis (Link auf Kontakt).

## What's Working
- Komplettes Design-System (Spacing/Typo/Color) tokenisiert und konsistent.
- Camp-Anfragen-Form sendet erfolgreich Mails über Resend an `CAMP_ANFRAGEN_TO`.
- SPA-Routing inkl. sprechender Anker-URLs.
- Mobile + Desktop-Layouts geprüft im Preview-Server (port 5500).
- Build (`node build.js`) generiert 8 Routen sauber.

## Known Issues / In Progress
- **Resend Domain-Verifikation:** noch nicht durchgeführt. Mails gehen aktuell vermutlich noch via `onboarding@resend.dev` (oder von verifizierter Adresse, je nachdem was in `CAMP_ANFRAGEN_FROM` steht). Für Custom-Absender DKIM/SPF-Records bei Domain-Registrar setzen.
- **Alumni-Quotes** (Songcamp): aktuell Platzhalter, durch echte Zitate ersetzen sobald vorhanden.
- **Backlinks/Lesezeichen**: alte URLs `/songcamps` und `/sessions` führen jetzt zu 404. Falls SEO-relevant: 301-Redirects in `vercel.json` ergänzen.
- **Uncommitted:** `script.js` (letzte Bestätigungstext-Änderung) noch nicht committed.

## Key Decisions Made This Session
- **Faux-Bold raus**: Inter 700/900 wurden synthetisch aus 300er-File generiert. Entscheidung für Option A (alle Sans-Headlines auf 400, Hero-Ausnahme 600) statt zusätzlicher Font-Files. Editorial-Stil profitiert.
- **Spacing 6 Stufen**: User wollte ursprünglich 3, ich habe 6 vorgeschlagen wegen Bandbreite Mikro→Section. Akzeptiert.
- **Typo 8 Stufen**: Pragmatischer Kompromiss zwischen Konsistenz und Granularität für Editorial-Site.
- **Quote-Sections kompakter (70svh)**: kurze blockquotes wirkten in 100svh zu luftig.
- **Sprechende Anker-URLs**: `/produktion#klangwelt` statt `/produktion#prod-step-02` für Lesbarkeit + SEO.
- **Singular für Brand-Begriffe**: `Songcamp` und `Session` als Markenbegriffe natürlicher als Plural-Routen.
- **Card-Pattern für Persona-Listen**: Konsistent mit `camp-finish-stages` und `sc-day-cards` (Canela-Titel + secondary Desc + Oliv-Top-Line).

## Dependencies & Integration Notes
- **Vercel**: Pre-rendered HTML Files + Serverless Function `api/camp-anfragen.js`. Env-Vars: `RESEND_API_KEY`, `CAMP_ANFRAGEN_FROM`, `CAMP_ANFRAGEN_TO` (alle gesetzt).
- **Resend**: API-Provider für transactional Mail. Domain-Verifikation steht noch.
- **GSAP 3.12** (CDN): Für Page-Transitions + Reveal-Animations.
- **Self-hosted Fonts**: Inter (300/400/500/600) + Cormorant (300/400/600 normal + 300/400 italic) in `/fonts/`. KEIN 700/900 geladen!

## Next Steps (Priority Order)
1. **`script.js` committen** — letzte Form-Bestätigungstext-Änderung.
2. **Resend Domain-Verifikation** durchführen, dann `CAMP_ANFRAGEN_FROM` auf `hallo@klaundbauter-musikproduktion.com` umstellen (falls aktuell auf `onboarding@resend.dev`).
3. **Backlinks-Redirects**: 301 für `/songcamps` → `/songcamp` und `/sessions` → `/session` in `vercel.json` falls existing Backlinks erhalten werden sollen.
4. **Alumni-Quotes** auf Songcamp durch echte Zitate ersetzen.
5. **Lighthouse-Audit** nach allen Refactor-Änderungen erneut laufen lassen (Stand vor Refactor: Desktop 100/90/100/100, Mobile 93–100/90/100/100).
6. **Visuelle Cross-Browser-Prüfung** — vor allem `100dvh` Menu auf iOS Safari.
