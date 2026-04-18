# Content & Sitemap

Alle Sections leben in [index.html](../index.html) als `.page-section`-Blöcke. Routing via `data-route`-Attribute und History API.

## Routes & Sections

| Route | DOM-ID | Zweck | Status |
|---|---|---|---|
| `/` | `#home` | Hero, 3-Pfad-Entry, Songcamp-Teaser | live |
| `/produktion` | `#produktion` | Hero → Haltung → 4-Step-Prozess → Preis → CTA | live |
| `/sessions` | `#sessions` | Einfaches Editorial-Split mit CTA | live, minimal |
| `/songcamps` | `#songcamps` | Hero, Für-wen, Versprechen (interactive), Format, Alumni, **Camp-Fertigstellung**, Zitat, Warteliste | live, reichste Seite |
| `/team` | `#team` | Adrian + Paul Bios | live |
| `/releases` | `#releases` | 6 YouTube-Embeds im Grid | live |
| `/kontakt` | `#kontakt` | Form + Info | live, Form ohne Backend |
| `/impressum` | `#impressum` | Rechtliches | live |
| `/datenschutz` | `#datenschutz` | DSGVO-Text | live |

> `validRoutes` in [script.js:148](../script.js#L148) listet aktuell nur `home, produktion, sessions, songcamps` als Deep-Link-fähig. Team/Releases/Kontakt/Impressum/Datenschutz sind **nicht** deep-linkbar — das sollte erweitert werden, sonst landet ein Deep-Link z. B. auf `/team` beim Reload auf Home.

## Navigation
- **Header-Logo** (oben links) → Home
- **Menu-Toggle** (oben rechts, 2 Bars → Kreuz) → Fullscreen-Menü mit: HOME, PRODUKTION, SESSIONS, SONGCAMPS, TEAM, RELEASES, KONTAKT + Impressum/Datenschutz im Footer
- **Footer** (jede Seite) → Sekundäre Nav + Legal-Links

## Key Copy (aktuell auf der Seite)

### Home — Hero
`KLA & BAUTER` / `DEIN TEAM FÜR DEINE IDEEN`

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
- Wintercamp 2027 · 07.–14. Januar · NRW
- Frühlingscamp 2027 · 21.–28. April · NRW

### Produktion — Prozess-Steps
1. **Arrangement** — „Struktur, Dynamik, Entscheidungen."
2. **Klangwelt** — „Instrumente, Texturen, Atmosphäre."
3. **Recording** — „Der Moment, in dem der Song greifbar wird."
4. **Mix & Master** — „Alles kommt zusammen."
Preis: **1.500 € netto** Vollproduktion, 500 € netto je Einzelschritt.
Unter dem Preis dezenter Verweis: *„Song aus einem Camp? Eigene Stufen dafür ⟶"* (→ `/songcamps`).

### Songcamp — Nach dem Camp (Camp-Fertigstellung)
Kicker: *Nach dem Camp* · Headline: **Der Song geht weiter.**
Drei Stufen als editoriale Liste:
- **01 · Finishing — 500 € netto** — Mix, Mastering, letzter Schliff.
- **02 · Completion — 900 € netto** — eine Seite fertig (Vocals ODER Produktion), andere neu.
- **03 · Full Production — 1.500 € netto** — komplett neu, wie eine Vollproduktion.
Schluss: *„Welche Stufe deiner braucht, entscheiden wir gemeinsam. Keine schwarze Box."*

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
