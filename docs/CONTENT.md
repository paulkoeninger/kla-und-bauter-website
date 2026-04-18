# Content & Sitemap

Alle Sections leben in [index.html](../index.html) als `.page-section`-Blöcke. Routing via `data-route`-Attribute und History API.

## Routes & Sections

| Route | DOM-ID | Zweck | Status |
|---|---|---|---|
| `/` | `#home` | Hero, 3-Pfad-Entry, Songcamp-Teaser | live |
| `/produktion` | `#produktion` | Hero (Statement + Quick-Nav) → Haltung → 4 Steps → Full-Bleed → Preis → CTA | live |
| `/sessions` | `#sessions` | Hero → Haltung → Full-Bleed → Preis → CTA (Taupe) → Songcamp-Verweis → Full-Bleed | live |
| `/songcamps` | `#songcamps` | Hero → Für-Wen-Bild → Für Wen → Das-ist-nicht → Format → Preis → Alumni (Slider) → Vision → Versprechen → Warteliste → Camp-Fertigstellung | live, reichste Seite |
| `/team` | `#team` | Hero → Adrian → Paul → Wir-Zitat | live |
| `/releases` | `#releases` | 6 YouTube-Embeds im responsiven Grid | live |
| `/kontakt` | `#kontakt` | Minimaler Hero + Mail-CTA | live, kein Formular |
| `/impressum` | `#impressum` | Rechtliches | live |
| `/datenschutz` | `#datenschutz` | DSGVO-Text (WordPress-Reste, muss aktualisiert werden) | live |

> Alle Routes sind seit der Session vom 18. April 2026 deep-linkbar — `validRoutes` in [script.js](../script.js) umfasst `home, produktion, sessions, songcamps, team, releases, kontakt, impressum, datenschutz`.

## Navigation
- **Header-Logo** (oben links) → Home
- **Menu-Toggle** (oben rechts, 2 Bars → Kreuz) → Fullscreen-Menü mit: HOME, PRODUKTION, SESSIONS, SONGCAMPS, TEAM, RELEASES, KONTAKT + Impressum/Datenschutz im Footer
- **Footer** (jede Seite) → Sekundäre Nav + Legal-Links

## Key Copy (aktuell auf der Seite)

### Home — Hero
`KLA & BAUTER` / *„Mit dir. Nicht für dich."*

### Home — 3-Pfad-Entry („Wonach ist dir?")
1. **Einen Song anfangen.** — „Komm mit einer Idee. Wir machen einen Song daraus." → Sessions
2. **Einen Song fertig machen.** — „Dein Song steht. Wir produzieren ihn mit dir zu Ende." → Produktion
3. **Auf die Suche gehen.** — „Du hast ein Gefühl. Wir finden die Musik darin." → Songcamp
4. Subtle 4th Path (Thought-Trigger): „Ich weiß noch gar nicht genau, wonach mir ist."

### Home — Songcamp-Teaser (Parallax)
*Willst du Musik haben — oder Musik machen?*

### Songcamp — Hero
*Fünf Tage. Für die Musik, die längst in dir steckt.*

### Songcamp — Das Versprechen (Interactive Reveal)
- Anchor: **„Musik ist kein Ergebnis. Musik ist ein Prozess."**
- Verborgener Text (wird Wort für Wort per Cursor freigelegt): *Ein Sound öffnet eine Tür, die du nicht gesucht hast. Die führt zu einem Satz, den du nicht geplant hattest. Der führt zu einer Akkordfolge, die du noch nie gespielt hast. Die macht auf einmal Mut, über ein Gefühl zu schreiben, von dem du vorher noch nicht mal deinem besten Freund erzählt hast.*
- Closing: **„Musik ist der Prozess. Nicht sein Ergebnis."**

### Songcamp — Warteliste-Termine
- Sommercamp 2026 · 31. August – 6. September · NRW
- Wintercamp 2027 · 15.–21. Februar · NRW

### Produktion — Hero-Claim
Kicker „Produktion" · Statement *„Bis der Song klingt, **wie du ihn meinst**."* · darunter Quick-Nav zu den 4 Steps.

### Produktion — Prozess-Steps
1. **Arrangement** — „Struktur, Dynamik, Entscheidungen."
2. **Klangwelt** — „Instrumente, Texturen, Atmosphäre."
3. **Recording** — „Der Moment, in dem der Song greifbar wird."
4. **Mix & Master** — „Alles kommt zusammen."
Preis: **1.785 €** (inkl. 19 % MwSt.) · darunter camp-pointer *„Song aus einem Camp? Eigene Stufen dafür ⟶"* zu `#camp-fertigstellung`.

### Sessions — Seitenaufbau
1. Hero — *„Eine Session. **Ein Song**."* + „Komm mit einer Idee…"
2. Haltung — *„Kein Kurs. Kein Workshop. **Nur der Song**."*
3. Full-Bleed-Pause (produktion_1.jpg)
4. Preis — `Session · 500 € · inkl. 19 % MwSt.`
5. CTA (Taupe + Accent-Line) — *„Schick uns **deine** Idee. **Wir schreiben dir zurück**."* + mailto
6. Songcamp-Verweis — *„Eine Woche lang Sessions. Ein Haus in der Ruhe. Mit Garten und Kaffee."* + Link
7. Full-Bleed-Pause (produktion_3.jpg)

### Team — Seitenaufbau
1. Hero — Kicker „Team" + *„Zwei Musiker, die gelernt haben, **zuzuhören**."*
2. Adrian — Kicker + Role-Label + *„Macht Akkordfolgen zu **Songs**."* + Bio-Zeile + `adrian.jpg`
3. Paul — Kicker + Role-Label + *„Arbeitet nah an **Sprache**, Emotion und Struktur."* + Bio-Zeile + `paul.jpg`
4. Wir-Zitat — *„Wir sind keine Lehrer. Keine Coaches…"*

### Kontakt
Minimaler Hero: Accent-Line + Kicker „Kontakt" + *„Schick uns deine **Idee**."* + Lead + `hallo@klaundbauter-musikproduktion.com`.

### Songcamp — Preis (eigene Section, subtil)
**1.200 €** · *„Sieben Tage. Unterkunft inklusive."* · *„inkl. 19 % MwSt."*

### Songcamp — Nach dem Camp (Camp-Fertigstellung, 100 vh forced)
Kicker „Nach dem Camp" · Headline *„Der Song geht weiter."* · ID `#camp-fertigstellung` für Anchor-Links.
Drei Stufen:
- **01 · Finishing — 500 €** — Mix, Mastering, letzter Schliff.
- **02 · Completion — 900 €** — eine Seite fertig, die andere neu.
- **03 · Full Production — 1.500 €** — *„De facto eine Vollproduktion — als Camp-Rabatt, sonst 1.785 €."*
Gemeinsamer Hinweis: *„inkl. 19 % MwSt."*
Schluss: *„Welche Stufe deiner braucht, entscheiden wir gemeinsam. Keine schwarze Box."*

### Songcamp — Alumni-Pager
Kicker „Was Artists sagen" + Headline *„Gedanken aus den **Camps**."* + Lead. Horizontaler Slider mit 3 Seiten à 3 Cards (9 Cards total, alle Platzhalter außer den originalen 3). Pager-Dots (1/2/3) unten. Auf Mobile aufgelöst zu langer Liste ohne Pager.

## Asset-Inventar

```
images/
├── hero_home.jpg, hero_home_red.jpg   → Hero-Portraits (Paul & Adrian)
├── Kla & Bauter Studio-080/087/099/100/119/145.jpg
├── adrian.jpg, paul.jpg
├── mix.jpg, recording.jpg, recording2.jpeg
├── produktion.jpg, produktion_1/2/3.jpg
└── songcamp/
    ├── camp_home.jpg, kamin.jpg      → Camp-Stimmung
    ├── session_home.webp             → Sessions-Card
    ├── sc_mood2/3/4.webp             → Für-wen-Background
    ├── adambox.webp, aku.webp, nord.webp
    └── sessionadrian/paul/paul2.jpg

Logo/K&B_Klabautermann_vektor.png       → überall: Loader, Navbar, Easter Egg
videos/background_loop_home.mp4         → 4 MB, derzeit ungenutzt
screenshots/                            → 15 Design-Inspos & alte Bildschirmfotos (nicht auf Site)
content/
├── songcamp-website.html               → alter dark-theme Entwurf für Standalone Songcamp-Brand
└── website_texte.txt                   → Archivdump aus alter WordPress-Seite
vision_vibe_language/
└── kla-bauter-visionsdokument-v2.docx  → Markenbibel (siehe BRAND.md)
```

## Bekannte Inhalts-Inkonsistenzen
Siehe [ROADMAP.md](ROADMAP.md#inkonsistenzen--kleine-bugs).
