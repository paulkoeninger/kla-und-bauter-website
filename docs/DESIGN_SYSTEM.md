# Kla & Bauter — Design System

Vollständiger Snapshot des Design-Systems der Website. Single Source of Truth für Tokens ist `style.css`. Diese Datei erklärt **was es gibt, wie es heißt und wie es kombiniert wird**.

> Marken-Tonalität → [`BRAND.md`](BRAND.md) · Source-of-Truth → [`../vision_vibe_language/kla-bauter-visionsdokument-v2.docx`](../vision_vibe_language/)

Stand: April 2026.

---

## 1. Design-Philosophie

Editorial. Ruhig. Noble. Hollywood-Gefühl. **Raum geben, nicht vollpacken.**

Vier Prinzipien, in Reihenfolge der Wichtigkeit:

1. **Weißraum vor Dichte.** Lieber eine zusätzliche `snap-block`-Section als zwei Spalten in eine quetschen.
2. **Eine Idee pro Bildschirm.** Jeder `snap-block` trägt einen klaren Gedanken — kein Multitasking.
3. **Typografie ist Ornament.** Fast alle Akzente sind Buchstaben oder Linien. Keine Icon-Library, keine Grafik-Deko.
4. **Animationen ruhig, nie aggressiv.** 0.6–1.2 s, lange Easings, kein Bouncing, kein Snapping, kein Hype.

---

## 2. Farb-Tokens

Definiert in `:root` — [style.css:1](../style.css#L1).

| Token | HEX | Rolle |
|---|---|---|
| `--bg-primary` | `#F7F7F5` | warmer Off-White, Standard-Hintergrund |
| `--bg-secondary` | `#D9D7D2` | Taupe, Cards & Frames, alternative Page-Backgrounds (`.bg-secondary`) |
| `--text-primary` | `#1A1A1A` | fast-Schwarz, Body & Headlines |
| `--text-secondary` | `#6F6B63` | warmes Grau, Meta, Captions, Sekundäres |
| `--accent-color` | `#8A8F6A` | **Oliv-Moos** — Buttons, Lines, `<em>` in Headlines, Highlights |

**Konvention**: `<em>`/`<i>` in `h1–h6` werden automatisch via Selector auf `--accent-color` gesetzt — siehe [style.css:120](../style.css#L120). Im Body bleibt `<em>` kursiv im `--font-secondary`, ohne Farbwechsel.

**Dark-Blöcke** (z. B. „Für Wen" auf Songcamp, Songcamp-Teaser auf Home) werden inline mit `#111` + Image-Overlay gesetzt, nicht über Token. Bewusst lokal.

---

## 3. Typografie

### Font-Familien

| Token | Stack | Verwendung |
|---|---|---|
| `--font-primary` | `'Söhne', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif` | Body, Navigation, UI, Buttons |
| `--font-secondary` | `'Canela', 'Cormorant', 'Iowan Old Style', serif` | Editorial Headlines, Quotes, `<em>` / `<i>`, Card-Titel |

In Produktion sind **Inter** und **Cormorant** im Einsatz (selbst gehostet in `fonts/`, kein Google-CDN). Söhne/Canela sind die Wunsch-Originale.

### Type-Scale (8 Stufen)

Alle font-size-Werte fließen durch diese Tokens. **Keine Magic Numbers in Elementen.**

| Token | Wert | Einsatz |
|---|---|---|
| `--text-micro` | `11px` | Kicker, Overlines, Footnotes, `legal-section-title`, Card-Nummern |
| `--text-sm` | `14px` | Captions, Footer, Meta, Bio-Zeilen |
| `--text-body` | `16px` | Fließtext (`p`) — fester Wert |
| `--text-lead` | `clamp(1.05rem, 1.4vw, 1.2rem)` | Lead-Text, Quotes, Logo, Step-Labels |
| `--text-h3` | `clamp(1.25rem, 2.2vw, 1.9rem)` | Card-Titel, Hero-Subtitle, kleine Headlines |
| `--text-h2` | `clamp(2rem, 4vw, 3.2rem)` | Standard Editorial Headline, Quote-Block, Menu-Links |
| `--text-h1` | `clamp(2.5rem, 5vw, 4rem)` | Subpage-Hero, Section-Title, Teaser-Headline |
| `--text-hero` | `clamp(4.5rem, 12vw, 9rem)` | Home-Hero „KLA & BAUTER" (uppercase, weight 600) |

### Line-Heights (3 Stufen)

| Token | Wert | Einsatz |
|---|---|---|
| `--lh-tight` | `1.15` | Hero-Titel, Display |
| `--lh-snug` | `1.3` | Headlines, Card-Titel |
| `--lh-base` | `1.75` | Body, lange Lesetexte |

### Letter-Spacing (5 Stufen)

| Token | Wert | Einsatz |
|---|---|---|
| `--tracking-tighter` | `-0.02em` | Hero |
| `--tracking-tight` | `-0.01em` | Headlines |
| `--tracking-normal` | `0` | Logo, Default |
| `--tracking-subtle` | `0.02em` | Buttons, Links |
| `--tracking-wide` | `0.18em` | UPPERCASE-Kicker, Overlines, Card-Nummern |

### Body-Text — globale Regel

Alle `<p>`-Tags konsumieren ab April 2026 zentral diese Variablen — siehe [style.css:104](../style.css#L104):

| Property | Wert | Bedeutung |
|---|---|---|
| `--body-font-size` | `var(--text-body)` (16px) | Body-Größe überall |
| `--body-line-height` | `var(--lh-base)` (1.75) | entspannte Lesung |
| `--body-font-weight` | `300` | editorial light |
| `--body-color` | `var(--text-primary)` | fast-schwarz statt grau |
| `--body-max-width` | `680px` | Lesbarkeits-Cap |

**One-change-all-Regel**: Overrides in Cards (z. B. `.entry-desc`) sollen *weiterhin* diese Variablen referenzieren, statt eigene Zahlen zu erfinden.

### Sonderregel: `<em>` vererbt Weight

```css
em, i {
    font-family: var(--font-secondary);
    font-style: italic;
    font-weight: inherit; /* erbt von Parent */
}
```

→ `em` in 400er-Headline bleibt 400, im 300er-Body bleibt 300. Verhindert dass Italics in Headlines optisch „dünner" wirken. Siehe [style.css:113](../style.css#L113).

---

## 4. Spacing & Layout

### Spacing-Scale (6 Stufen)

Editorial-rhythmisch. **Pairing-Regel**: kleinere Einheit = engerer Bond.

| Token | Wert | Einsatz |
|---|---|---|
| `--space-2xs` | `0.5rem` | Inline-Luft (Label↔Arrow, Icon↔Text) |
| `--space-xs` | `1rem` | Paragraph zu Paragraph, enge Pairings |
| `--space-sm` | `1.5rem` | Kicker → Headline, CTA-Abstand |
| `--space-md` | `2.5rem` | Headline → Body, Gruppen-Trennung |
| `--space-lg` | `4rem` | Content-Block → Content-Block (Mobile: 3rem) |
| `--space-xl` | `8rem` | Section → Section (Mobile: 5rem) |

**Mobile-Override** (`max-width: 992px`): nur die großen Stufen `lg`/`xl` werden enger — kleine bleiben für Editorial-Rhythmus.

### Layout-Tokens

| Token | Desktop | ≤992px | ≤480px |
|---|---|---|---|
| `--edge` | `4rem` | `2rem` | `1rem` |
| `--content-top` | `14rem` | `11rem` | — |
| `--max-width-text` | `65ch` | — | — |

`--edge` = horizontaler Site-Rand. Jede Top-Level-Section nutzt `padding: 0 var(--edge)`.
`--content-top` = vertikaler Abstand Navbar-Oberkante → Content-Start auf Subpages. Editorial-luftig: nichts klebt unter der Navbar.

### Breakpoints

Custom Properties können in Media Queries nicht referenziert werden — **Werte hardcoded merken**:

| Breakpoint | px | Wirkung |
|---|---|---|
| Tablet | `992px` | Tablet → Mobile-Layout (Hero stackt, Cards 1-Spaltig, Edge auf 2rem) |
| Mobile | `768px` | Phone-Layout (Navbar dichter, Logo 42px, Bilder voll-breit) |
| Small | `480px` | sehr kleine Phones (Edge auf 1rem) |

Alte Breakpoints `576/600/1200` sind migriert — nicht mehr nutzen.

### Viewport-Units

Durchgängig `100svh` statt `100vh` (iOS-Safari-robust). Beim Fullscreen-Menü zusätzlich `100dvh` (dynamic viewport — passt sich an ein-/ausgeklappte Mobile-Browser-Chrome an).

---

## 5. Komponenten-Atlas

### Layout-Skeleton

| Klasse | Zweck | Hinweise |
|---|---|---|
| `.page-section` | jede Top-Level-Route, `display:none` per default | wird bei Aktivierung auf `display:block` gesetzt |
| `.page-section.active` | aktive Route | `position: relative`, restored Document-Flow |
| `.bg-secondary` | alternativer Page-Hintergrund (Taupe) | für Sub-Pages mit anderem Mood |
| `.snap-block` / `.snap-block-inner` | 100svh-Sektion (Editorial-Subpage-Standard) | bricht auf Mobile auf, `legal`-Variante linksbündig |
| `.sc-block` / `.sc-block-inner` | Songcamp-spezifisches Layout-Kit | max-width 1440px, identisches Spacing wie snap-block |
| `.sc-grid` | 2-Col Grid für Songcamp | `grid-template-columns: 1fr 1fr`, `gap: var(--space-lg)` |
| `.page-title`, `.page-container`, `.page-content-grid` | Basic-Page-Layout | für Team, Releases, Kontakt, Legal |

### Navigation

| Klasse | Zweck |
|---|---|
| `.navbar` | Top-Bar, `position: absolute`, `pointer-events: none` (children opt-in) |
| `.logo` | Wort-Logo links, fadet bei Hover auf Burger oder offenem Menü |
| `.nav-logo-img` | Bild-Logo (45px / 42px Mobile), `tickle`-Animation bei Hover |
| `.menu-toggle` | Burger rechts, `position: fixed` (bleibt beim Scroll), Touch-Target via Padding |
| `.menu-toggle.open .bar` | X-Cross via `transform: rotate(45deg)` |
| `.fullscreen-menu` / `.menu-content` | Overlay-Menü, `100dvh`, GSAP-Stagger beim Öffnen |
| `.menu-kicker` | Editorial-Overline im Menü („KAPITEL") |
| `.menu-links` | Liste mit `counter-reset`, Nummern via `::before` |
| `.menu-footer` / `.small-link` | Sekundärlinks unten (Legal, Mail) |

### Hero (Home)

| Klasse | Zweck |
|---|---|
| `.hero` | Full-Bleed Hero-Section, 100svh, Flex-Row Desktop / Stack Mobile |
| `.hero-content` / `.hero-title` / `.hero-subtitle` | Text-Block links |
| `.hero-images` / `.image-wrapper` / `.portrait-img` | Portrait-Block rechts, 450×600 Desktop, 4:3 Mobile |
| `.hero-title` | `--text-hero`, weight 600, uppercase, `--lh-tight` |
| `.hero-subtitle` | `--text-h3`, Serif, em → Accent |

### Home Entry Cards („Wonach ist dir?")

| Klasse | Zweck |
|---|---|
| `.home-entry-section` | 100svh-Block mit drei Cards |
| `.entry-grid` | Flex, 3 Cards permanent sichtbar |
| `.entry-card` (`.entry-card.camp-path`) | Card-Wrapper, Reveal-Animation via `.is-visible` |
| `.entry-image-wrapper` / `.entry-img` | 1:1 Bild, hover scale 1.03 |
| `.entry-title` / `.entry-desc` / `.entry-cta` | Card-Body |
| `.camp-path-hint` | „Ich weiß noch gar nicht genau"-Overlay (nur Hover-fähiger Desktop ≥993px) |

**Songcamp-Card-Logic**: nur auf Desktop+Hover default blurry mit Hint → schärft bei Hover. Touch + enges Browser-Fenster sehen sie scharf. Gating via `@media (hover: hover) and (min-width: 993px)` — siehe [style.css:414](../style.css#L414).

### Songcamp-Teaser (Home, Full-Bleed)

| Klasse | Zweck |
|---|---|
| `.home-camp-section.teaser` | Full-Bleed 100svh-Container, `cursor: pointer` |
| `.teaser-bg` | BG-Image, `slowZoom` 45 s + JS-translate Mouse-Follow |
| `.teaser-overlay` | Linear-Gradient für Text-Lesbarkeit |
| `.teaser-content` | zentrierter Text-Stack |
| `.teaser-kicker` | Oliv-Pille mit Uppercase-Text |
| `.teaser-headline` | `--text-h1`, Serif, cream auf dunkel |
| `.teaser-cta` / `.teaser-arrow` / `.teaser-dash` | CTA mit animiertem Pfeil (width 20px → 48px on hover) |

Subtle Grain via inline SVG-Filter `feTurbulence` als `::after` — siehe [style.css:1199](../style.css#L1199).

### Editorial-Typo (Subpages)

Alle Subpages teilen sich diese Typo-Klassen — siehe [style.css:2290](../style.css#L2290).

| Klasse | Zweck |
|---|---|
| `.editorial-title` | Hauptheadline einer Section (`--text-h1`, Serif, `--lh-snug`) |
| `.editorial-title--hero-size` | Modifier — `clamp(2.5rem, 5vw, 4rem)`, etwas größer |
| `.editorial-title--price` | Modifier für Preis-Headlines |
| `.editorial-lead` | großer Lead-Paragraph (`--text-lead`, Serif, italic) |
| `.editorial-desc` | Body-Beschreibung |
| `.editorial-num` | große Zahl als Editorial-Akzent (Schritt-Nummer, Tag-Nummer) |
| `.editorial-sub` | Untertitel/Meta (Uppercase, `--text-micro`, `--tracking-wide`) |
| `.editorial-link` | Text-CTA mit Pfeil und Border-Bottom |
| `.editorial-split` (`.reverse`) | 2-Col Layout Text + Bild |
| `.editorial-split--hero` | Modifier für volle Hero-Höhe |
| `.editorial-split-img` / `.editorial-img` | Bild-Slot |
| `.editorial-cta` / `.editorial-prices` | semantische Modifier — passen Typo an (z. B. center) |

### Buttons & Links

| Klasse | Zweck |
|---|---|
| `.kb-btn-primary` | **Primary-CTA**: Oliv-Hintergrund, 2px Border-Radius, weight 500, `--tracking-subtle`, Pfeil-Animation 6px on hover. Touch-Min-Height 44px. |
| `.kb-link` | flacher Text-Link mit Pfeil, `border-bottom: 1px solid accent` |
| `.editorial-link` | Editorial-Variante in Subpages (langer Underline, Pfeil-Translation) |
| `.entry-cta` | Card-CTA in Home Entry Cards |
| `.camp-pointer-link` | Songcamp-Crossreferenz auf Sessions/Produktion-Seiten |
| `.footer-cta-link` | Footer-CTA „Lass uns reden" |
| `.small-link` | Sekundärlink (Legal-Footer, Menu-Footer) |

**Konsistentes Pfeil-Verhalten**: `<span class="arrow-icon">⟶</span>` — Unicode, kein Icon-Font. Hover: `transform: translateX(6px)` (oder `4px` bei kleineren Links) mit `cubic-bezier(0.16, 1, 0.3, 1)`.

### Karten-Patterns

| Klasse | Wo |
|---|---|
| `.entry-card` | Home — 3 Pfade |
| `.sc-day-card` | Songcamp — 5 Tage |
| `.fuer-wen-item` | Songcamp — Personas |
| `.camp-finish-stage` | Songcamp — Camp-Fertigstellung-Pakete |
| `.team-portrait` + `.team-bio` | Team-Page |

**Gemeinsames Pattern**: dünner Akzent-Border-Top (1px Oliv) + Padding-Top → Titel (Serif, `--text-body`/`--text-h3`) → Desc (Sans, `--text-sm`, `--text-secondary`).

### Video (Releases)

| Klasse | Zweck |
|---|---|
| `.video-grid` | 2-Col Grid (Mobile: 1-Col) |
| `.video-wrapper` | Lite-YouTube-Facade als `<button>` mit `data-yt-id` |
| `.video-thumb` | Thumbnail (`maxresdefault.jpg` + Fallback) |
| `.video-play` | runder Play-Button, semi-transparent cream |

Klick ersetzt den Button durch echtes `<iframe>` mit `autoplay=1`. **Keine YouTube-Cookies vor dem Klick.**

### Legal Pages

| Klasse | Zweck |
|---|---|
| `.snap-block-inner.legal` | linksbündig, max-width 760px, word-break: break-word |
| `.legal-section-title` | Uppercase Overline (`--text-micro`, `--tracking-wide`, Oliv) |

`p` und `a` haben in legal-Kontext spezifische Overrides — bleiben aber bei den Tokens.

### Footer

| Klasse | Zweck |
|---|---|
| `.footer-cta` | großer Mood-CTA „Lass uns reden" mit Serif-Headline und em→Accent |
| `.footer-grid` / `.footer-col` | 3-Col Adresse + Mail + Sitemap |
| `.footer-nav` | Sitemap-Links |
| `.footer-bottom` | Legal-Zeile am Boden |
| `.footer-legal-links` | Impressum / Datenschutz |
| `.footer-mobile-bar` / `.footer-logo-mobile` | Mobile-Branding-Variation |

---

## 6. Animation & Easing

### Signatur-Easings

| Curve | Einsatz |
|---|---|
| `cubic-bezier(0.16, 1, 0.3, 1)` | **Primary** — alle Reveals, Slides, Scroll-Anims (entspricht GSAP `expo.out`) |
| `cubic-bezier(0.22, 1, 0.36, 1)` | sanftere Variante für Parallax-Translates |
| `cubic-bezier(0.68, -0.6, 0.32, 1.6)` | Logo-Tickle (leichtes Overshoot) — **nur fürs Logo** |
| GSAP `power3.inOut` | Logo-Flight im Intro (1.2 s) |
| GSAP `power2.out` | Page-Slides, Parallax-Träge (3–4 s) |
| GSAP `back.out(2)` | Klabautermann-Drop-Landung (Easter Egg) |

### Dauer-Konvention

| Bereich | Dauer | Einsatz |
|---|---|---|
| Micro-Hover | 0.25–0.4 s | Color-Wechsel, Underline-Migration |
| Card/Element-Reveal | 0.4–0.6 s | Opacity + Translate |
| Section-Reveal / Slide | 0.7–1.2 s | Page-Transitions, Snap-Block-Reveal |
| Parallax / Mood | 1.2–4 s | Teaser-BG-Translate, Mouse-Follow |
| Endlos-Loop | 45 s | `slowZoom` Teaser-BG |

**Faustregel**: 0.6–1.2 s für bewusste Bewegung. Nie unter 0.3 s außer bei Micro-Hovers. **Kein Bouncing, kein Snapping, kein Hype.**

### Keyframes (CSS)

| Name | Zeile | Zweck |
|---|---|---|
| `floatSpin` | [style.css:153](../style.css#L153) | Loader-Logo rotiert 360° in 1.8 s, infinite |
| `tickle` | [style.css:172](../style.css#L172) | Logo-Wackeln bei Hover (0.4 s) |
| `slowZoom` | [style.css:1161](../style.css#L1161) | Teaser-BG `scale(1.0)`→`scale(1.15)` über 45 s, alternate |
| `mmFloat` | [style.css:1909](../style.css#L1909) | Mix/Master-Section-Element-Float |

### GSAP-Effekte

- **Page-Transitions** (script.js): Out-Slide → DOM-Swap → In-Slide, ~0.9 s, `power3.out`.
- **Logo-Intro**: Logo „fliegt" beim ersten Page-Load von Mitte zur Navbar-Position.
- **Promise-Reveal** (Songcamp): Desktop = 60fps Mouse-Follow Wort-für-Wort mit Zipper-Logic. Mobile = Auto-Reveal über IntersectionObserver, 80 ms Stagger, einmalig pro Page-View.
- **Home-Teaser-Mousefollow**: `translate:` Property auf `.teaser-bg` per JS, kombiniert sich mit dem 45s-CSS-Keyframe (`transform: scale`) — daher zwei verschiedene Properties, kollidieren nicht.

### Reveal-System

`.scroll-anim` ist Opt-in für IntersectionObserver-basiertes Reveal. Die Section-Klasse `.is-visible` / `.is-revealed` triggert die Endzustände der Children (`opacity:1`, `transform:translateY(0)`, `scaleX(1)` für Lines).

```css
.snap-block.is-revealed .editorial-title,
.sc-block.is-revealed .sc-kicker { /* … sichtbar … */ }
```

---

## 7. Touch & Hover-Strategie

**Problem**: Sticky-Hover-Bug auf iOS — getapptes Element behält Hover-State bis nächster Tap.

**Lösung**: Am Ende von `style.css` ein `@media (hover: none)` Block, der ~39 Hover-Regeln auf Base-State neutralisiert. Siehe [style.css:2866](../style.css#L2866) ff.

**Konvention**: alle nicht-trivialen Hover-Effekte gated mit:
```css
@media (hover: hover) { .foo:hover { … } }
```

**Touch-Targets**: Min-Höhe 44 px auf allen Klick-Elementen (`.entry-cta`, `.kb-btn-primary` etc.) — siehe [style.css:524](../style.css#L524).

---

## 8. Bilder & Assets

- **Format**: alle Content-Bilder als **WebP**.
- **Hero**: responsives `srcset` mit 800/1200/2048w + `<link rel="preload" imagesrcset imagesizes fetchpriority="high">`.
- **Lazy**: `loading="lazy"` auf alle Below-Fold-Images. Hero und Navbar-Logo sind eager.
- **Editorial-Filter**: Default für Card- und Bio-Bilder ist `filter: brightness(0.9–0.92) saturate(0.85–0.88)` — bei Hover auf 1/1 zurück. Siehe `.entry-img`, `.team-portrait`, `.video-thumb`.
- **Navbar-Logo**: 2.4 KB WebP (von ursprünglich 236 KB PNG).

**Wichtig — Inline-Background-Images**: `background-image: url('images/…')` darf **nicht inline** stehen, sonst resolved `pushState` auf `/route/images/…` → 404. Immer in externer CSS setzen — siehe `.teaser-bg`.

---

## 9. Nicht-Regeln

- **Kein Tailwind / Bootstrap / Utility-CSS.** Stattdessen: Tokens + semantische Klassen.
- **Keine Emojis aus Pool-Libraries.** Pfeile sind Unicode `⟶` oder CSS-gezeichnet (siehe `.teaser-arrow`).
- **Keine Auto-Play-Videos, kein Sound.** YouTube nur via Lite-Embed-Facade.
- **Keine Inline-Styles mit relativen URLs** (siehe Punkt 8).
- **Keine neuen Magic-Numbers.** Wenn ein Wert nicht in den Tokens steht, ist das ein Code-Smell — entweder Token erweitern oder vorhandenen wiederverwenden.
- **Keine Komponenten-Splits.** Kein npm-Framework, kein Bundler. Alles in `index.html` + `style.css` + `script.js`.

---

## 10. Editorial-Patterns (gehäuft im Code)

Diese Konventionen sind nicht in Tokens kodifiziert, aber **konsistent in der ganzen Site**:

- **Headline → Body**: Serif/Sans-Kontrast. Headlines `--font-secondary` italic, Body `--font-primary` weight 300.
- **Kicker → Headline**: Uppercase-Micro-Text in `--accent-color` mit `--tracking-wide` über jeder Section-Hauptheadline.
- **Akzent-Border-Top**: 1px solid `--accent-color` als horizontaler Trenner über Card-Stacks (Tage, Personen, Pakete).
- **Pfeil-CTA**: `text + ⟶`, Border-Bottom in Accent, Hover migriert Border zu Text-Primary, Pfeil verschiebt sich 6 px.
- **`<em>` als Akzent**: in Headlines automatisch oliv (Token-CSS), im Body kursiv-Serif ohne Farbwechsel.
- **Number-Display**: große Zahlen (Schritte, Tage, Stats) in `--font-secondary`, weight 400, oft mit `--accent-color`.
- **Snap-Block-Rhythmus**: jede Section eine Idee, mind. `--space-xl` Vertikalabstand zur nächsten.

---

## 11. Wo was steht

| Was | Wo |
|---|---|
| Token-Definitionen | [`../style.css`](../style.css) `:root`, Z. 1–85 |
| Touch/Hover-Reset | [`../style.css`](../style.css) ab Z. ~2866 |
| Page-Transitions, Routing | [`../script.js`](../script.js) |
| Build (pre-rendered HTML) | [`../build.js`](../build.js) |
| Marken-Tonalität, Zielgruppe | [`BRAND.md`](BRAND.md) |
| Marken-Vision (master) | [`../vision_vibe_language/kla-bauter-visionsdokument-v2.docx`](../vision_vibe_language/) |

---

**Developer-Instruction**: Elegant constraints > flashy chaos. Reuse bestehende `snap-block` / `sc-block` / `.editorial-*`. Tokens statt Magic Numbers. Animationen ruhig, nie aggressiv.
