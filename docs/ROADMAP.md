# Roadmap & offene Punkte

Lebendes Dokument — hier landet, was noch zu tun oder zu entscheiden ist. Claude und Paul halten das beide aktuell.

## Session 18. April 2026 — was heute gebaut wurde

**Design-System vereinheitlicht**
- Globale Body-Typografie als CSS-Custom-Properties (`--body-font-size: 16px`, `--body-line-height: 1.75`, `--body-font-weight: 300`, `--body-max-width: 680px`) — ein zentraler Knopf.
- `.editorial-title / -lead / -desc / -sub / -num / -link` auf Songcamp-Referenz gezogen (Serif 400, clamp `(2rem, 4vw, 3.2rem)` für Headlines, 16 px für Body, accent-olive Kicker-Boxen).
- Italic-Accent-Pattern (grün+kursiv) konsequent auf allen Akzent-Wörtern in Headlines durchgezogen.

**Seiten neu gebaut / überarbeitet**
- `/produktion` — Hero mit Statement *„Bis der Song klingt, **wie du ihn meinst**."* + Quick-Nav (01–04), 4 Steps poliert, Full-Bleed-Pause (recording2.jpeg), Preis 1.785 € (umgerechnet aus 1.500 netto) + kleiner camp-pointer.
- `/sessions` — komplett neu: Hero *„Eine Session. **Ein Song**."* + Haltung *„Kein Kurs. Kein Workshop. **Nur der Song**."* + Full-Bleed (produktion_1.jpg) + Preis (500 €) + CTA in Taupe mit Accent-Line + Songcamp-Verweis als eigene Section + Full-Bleed (produktion_3.jpg).
- `/songcamps` — Umordnung: Hero → Für-Wen-Bild (Full-Bleed) → Für Wen → Das-ist-nicht (Taupe) → Format → **Preis 1.200 €** (neue Section) → Alumni (9 Cards in 3-Page-Slider, Taupe) → Vision-Zitat → Versprechen (Taupe, verschoben) → Warteliste (Sommercamp 2026, Wintercamp 2027) → Camp-Fertigstellung (100 vh forced auf Desktop) am Ende.
- `/team` — komplett neu: Hero *„Zwei Musiker, die gelernt haben, **zuzuhören**."* + Adrian-Split *„Macht Akkordfolgen zu **Songs**."* + Paul-Split *„Arbeitet nah an **Sprache**, Emotion und Struktur."* + Wir-Zitat.
- `/kontakt` — minimalistisch: Hero + Mail-CTA `hallo@klaundbauter-musikproduktion.com` (neue Adresse). Kein Formular, keine Studio-Adressen (zu privat).
- **Footer-CTA** neu: *„Komm mit dem, was du hast."* + Mail-Link. Mobile-Footer: nur Klabautermann-Logo zentriert, alles andere hidden.

**Preise seitenübergreifend auf Brutto**
- Sessions: 500 € (bleibt), Produktion: 1.500 → 1.785 € umgerechnet, Camp-Fertigstellung: 500/900/1.500 € bleiben (waren schon als Brutto gemeint), Songcamp: 1.200 €. Überall kleiner Hinweis „inkl. 19 % MwSt." direkt unter dem Preis.
- Full Production im Camp (1.500 €) trägt jetzt den Hinweis *„als Camp-Rabatt, sonst 1.785 €"*.

**Animationen / UX**
- Preloader: Logo-Flug + Puls raus → einfache endlose Rotation, sanfter Fade-Out.
- Menu-Hover-Logo: Fly-to-center + Rotation raus → nur Opacity-Fade.
- Klabautermann-Easter-Egg komplett entfernt.
- Alle Scroll-Reveals flotter (0.55–0.7 s statt 1–1.5 s).
- Alumni-Slider (horizontal, 3 Pages, `cubic-bezier(0.22, 1, 0.36, 1)`, 0.55 s) mit Pager-Dots + Gap zwischen Pages.
- Hash-Anchor-Clicks: smooth-scroll mit `replaceState` statt null-state-push — Produktion Quick-Nav + Songcamp-Pointer zu `#camp-fertigstellung` funktionieren.
- Scroll-Snap komplett entfernt — Seite scrollt frei auf allen Geräten.

**Responsive (3 Runden Mobile-Fixes)**
- Camp-Fertigstellung 100-vh-Zwang auf Mobile gelockert (height auto).
- Alumni-Slider auf Mobile aufgelöst (alle 9 Cards vertikal, keine Pager-Dots).
- YouTube-Iframes responsive (aspect-ratio 16/9).
- Menu-Toggle Touch-Target auf ~70 × 70 px (unsichtbares Padding).
- Alumni-Dots 32 → 44 px.
- Produktion Quick-Nav sticky raus auf Mobile.
- Songcamp Hero Meta-Spalte: rechts-bündig → links auf Mobile.
- Editorial-Split margin-top 8rem → 2rem auf Mobile.
- Accent-Line 64 → 48 px.
- Navbar padding 2.5rem/4rem → 1.5rem/2rem auf Mobile.

**Bug-Fixes**
- `<html lang="en">` → `lang="de"`.
- Kontakt „München — Berlin" → „Köln".
- Alumni „arbetet" → „gearbeitet".
- Team-Section Smart-Quotes (`”`) → gerade Quotes (`"`) — Section war unsichtbar/kaputt.
- Songcamp Für-Wen Inline-Background-Image → externes CSS (stabil gegen pushState + file:// vs http://).
- Produktion Vollproduktion-Desc „zum gleichen Preis wie immer" → Camp-Rabatt-Hinweis mit 1.785 €-Vergleich.
- Vision-Zitat: „Wir verkaufen den Moment" → „Wir suchen den Moment".
- Camp-Fertigstellung Lead: „sagen dir ehrlich, was er braucht" → „besprechen gemeinsam, was er braucht" (Augenhöhe statt paternalistisch).
- Routing: `validRoutes` erweitert um `team`, `releases`, `kontakt`, `impressum`, `datenschutz` — alle deep-linkbar.

---

## Noch offen
1. **Domain**: ist `klaundbauter-musikproduktion.com` die produktive Zieldomain?
2. **Releases**: YouTube-IDs kuratieren/aktualisieren?
3. **Analytics / Cookie-Banner**: derzeit keins — bleibt so?
4. **E-Mail-Konsistenz**: jetzt drei Adressen im Umlauf — `hallo@klaundbauter-musikproduktion.com` (Kontakt + Footer-CTA), `paulkoeninger@icloud.com` (Impressum + Produktion-CTA + Sessions-CTA + Warteliste-Links?), `hello@kla-bauter.de` (war an einzelnen Stellen). Eine einheitliche wählen.
5. **`klabauter-vision-final.pdf`** in `vision_vibe_language/` ist laut `git status` gelöscht — absichtlich?
6. **Echte Alumni-Testimonials** warten auf Paul (Platzhalter Laura/David/Mara/Ben/Sonja/Felix sind fiktiv).

## Deployment-Checkliste (vor Launch auf Vercel)
- [ ] `vercel.json` im Root mit SPA-Rewrite `/(.*) → /index.html`.
- [x] `validRoutes` erweitert — alle Sections deep-linkbar.
- [ ] SEO-Meta + OG-Tags + Favicon.
- [ ] Bilder komprimieren (mehrere >300 KB), ggf. `loading="lazy"` außer Hero.
- [ ] E-Mail-Adressen konsistent machen (siehe oben).
- [ ] `vision_vibe_language/klabauter-vision-final.pdf` absichtlich gelöscht?
- [ ] Datenschutz-Text aktualisieren (aktuell Reste von WordPress-Shortcodes).
- [ ] Paul-Bio / Adrian-Bio auf Stand 2026 bringen (aktuelle Projekte, Jahreszahlen).
- [ ] Viele Section-Styles inline (Warteliste-Cards, Format-Day-Cards, Alumni-Cards) — könnten in `style.css` extrahiert werden. Kosmetik, kein Blocker.
- [ ] Testlauf auf echtem Mobile (Safari iOS + Chrome Android) — Dev-Tools-Simulation ist nicht alles.

## Größere Baustellen (aus dem Visionsdokument abgeleitet, noch offen)
- [ ] **Gemeinschaft / Alumni-Dynamik** (Kollaborationen nach Camps) ist ein wichtiger Brand-Wert, aber noch kein Touchpoint auf der Seite.
- [ ] **Themenabende-Inhalte** (KI in Musik, Releases, Business) könnten als Mini-Inhalte (Audio, Text, Blog) zur Lead-Generation zweitverwertet werden.
- [ ] **Kids-Format** (Ferien, 13–17 J.) ist Vision, noch nicht spruchreif — nicht auf Seite.
- [ ] *Songcamp als eigene Brand (Domain/Design): zurückgestellt (aktuell zu teuer). Entwurf existiert in [content/songcamp-website.html](../content/songcamp-website.html).*

## Notiz-Archiv / verworfen
- **Kontakt-Formular mit Backend** — entschieden: `mailto:` reicht bei 2–3 Camps/Jahr.
- **Songcamp-Standalone-Brand jetzt** — zu teuer, später.
- **Studio-Adressen auf Kontakt-Seite** — zu privat, nur im Impressum (Pflicht).
- **Klabautermann-Easter-Egg** (aggressive Bouncing-Animation) — kollidiert mit „keine aggressive bouncing"-Brand-Regel.
- **CSS Scroll-Snap** — fühlte sich auf allen Geräten sperrig an, Pacing funktioniert auch ohne.
