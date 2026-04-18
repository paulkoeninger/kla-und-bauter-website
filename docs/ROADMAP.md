# Roadmap & offene Punkte

Lebendes Dokument — hier landet, was noch zu tun oder zu entscheiden ist. Claude und Paul halten das beide aktuell.

## Geklärt (18. April 2026)
- **Hosting: Vercel**. `vercel.json` mit Rewrite `/(.*) → /index.html` wird vor Launch ergänzt.
- **Formulare (Kontakt + Warteliste): `mailto:` reicht**, solange 2–3 Camps/Jahr mit max 6–8 Teilnehmer:innen laufen. Kein Backend.
- **Alumni-Testimonials**: aktuelle Zitate bleiben als Platzhalter — **echte Stimmen kommen bald** und ersetzen die fiktiven.
- **Camp-Fertigstellung** (Finishing/Completion/Full Production, 500/900/1.500 €): **kommt auf die Website**. Platzierung offen — Vorschlag: eigener Block auf `/produktion` direkt nach der Preis-Section, verlinkt ergänzend aus `/songcamps`.
- **Songcamp als eigene Brand** (`songcamp.studio` / `song-camp.de`): **später**. Aktuell zu teuer, bleibt erstmal Sub-Route auf der Haupt-Domain.
- **Alle Standort-Angaben auf Köln**: Kontakt-Section fixed (war „München — Berlin"), Impressum/Footer waren bereits Köln. ✅
- **Trivial-Fixes gemacht**: `<html lang>` auf `de`, Alumni-Typo „arbetet → gearbeitet". ✅

## Noch offen
1. **Domain**: ist `klaundbauter-musikproduktion.com` (im Datenschutz) die produktive Zieldomain, oder zieht die neue Seite woanders hin?
2. **Releases**: YouTube-IDs kuratieren/aktualisieren?
3. **Team-Bios**: Stand 2026 aktualisieren (Adrian + Paul)?
4. **Preis auf Sessions-Seite**: 500 € netto sichtbar machen, analog Produktion?
5. **Routing**: `team`/`releases`/`kontakt`/`impressum`/`datenschutz` deep-linkbar machen?
6. **Analytics / Cookie-Banner**: derzeit keins — bleibt so?
7. **E-Mail-Adresse konsistent**: Kontakt-Section nutzt `hello@kla-bauter.de`, Impressum `paulkoeninger@icloud.com`. Welche soll es sein?
8. **`klabauter-vision-final.pdf`** in `vision_vibe_language/` ist laut `git status` gelöscht — absichtlich?

## Inkonsistenzen / kleine Bugs
- [x] `<html lang="en">` → `lang="de"`.
- [x] Kontakt-Section „München — Berlin" → „Köln".
- [x] Alumni-Tippfehler „arbetet" → „gearbeitet".
- [ ] [index.html:596](../index.html#L596) — Paul-Bio: Jahreszahlen ggf. modernisieren.
- [ ] Fehlende SEO-Basics: `<meta property="og:...">`, `<meta name="twitter:...">`, kein Favicon, kein `manifest.json`. Für Launch relevant.
- [ ] Viele Section-Styles inline (z. B. Songcamp-Warteliste-Cards) — wäre sauberer als Klassen in `style.css`. Kosmetik, kein Blocker.

## Größere Baustellen (aus dem Visionsdokument abgeleitet)
- [x] **Camp-Fertigstellung** — 3 Stufen (Finishing 500 €, Completion 900 €, Full Production 1.500 €) live auf `/songcamps` zwischen Alumni und Vision-Zitat. Auf `/produktion` nur dezenter Verweis unter dem 1.500-€-Block. Placement-Entscheidung: gehört kategorisch zu Kla & Bauter (Studio-Dienstleistung), aber kontextuell zum Songcamp-Erlebnis — darum auf `/songcamps`.
- [ ] **Gemeinschaft / Alumni-Dynamik** (Kollaborationen nach Camps) ist ein wichtiger Brand-Wert, aber noch kein Touchpoint auf der Seite.
- [ ] **Themenabende-Inhalte** (KI in Musik, Releases, Business) könnten als Mini-Inhalte (Audio, Text, Blog) zur Lead-Generation zweitverwertet werden.
- [ ] **Kids-Format** (Ferien, 13–17 J.) ist Vision, noch nicht spruchreif — nicht auf Seite.
- [ ] *Songcamp als eigene Brand (Domain/Design): zurückgestellt (aktuell zu teuer). Entwurf existiert in [content/songcamp-website.html](../content/songcamp-website.html).*

## Deployment-Checkliste (vor Launch auf Vercel)
- [ ] `vercel.json` im Root mit SPA-Rewrite `/(.*) → /index.html`.
- [ ] `validRoutes` in [script.js:148](../script.js#L148) vervollständigen (alle Sections deep-linkbar).
- [ ] SEO-Meta + OG-Tags + Favicon.
- [ ] Bilder komprimieren (mehrere >300 KB), ggf. `loading="lazy"` außer Hero.
- [ ] ~~Kontakt/Warteliste-Formulare an Backend anbinden.~~ → Entschieden: `mailto:` reicht.
- [ ] E-Mail konsistent: `hello@kla-bauter.de` vs. `paulkoeninger@icloud.com`.
- [ ] `vision_vibe_language/klabauter-vision-final.pdf` ist laut `git status` **deleted** — absichtlich?
- [ ] Datenschutz-Text aktualisieren (aktuell Reste von WordPress-Shortcodes).
- [ ] Testlauf auf Mobile (Safari iOS + Chrome Android).

## Notiz-Archiv / verworfen
*(noch leer — hier landen Ideen, die Paul bewusst verwirft, damit wir sie nicht wieder aufmachen)*
