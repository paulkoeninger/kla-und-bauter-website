# Design-System

## Design-Philosophie (eine Zeile)
Editorial, ruhig, noble, high-end. „Hollywood-Gefühl". Raum geben, nicht vollpacken.

## Farb-Tokens

| Token | HEX | Rolle |
|---|---|---|
| `--bg-primary` | `#F7F7F5` | warmer Off-White, Standard-Hintergrund |
| `--bg-secondary` | `#D9D7D2` | taupe, Cards & Frames |
| `--text-primary` | `#1A1A1A` | fast-schwarz, Body-Text |
| `--text-secondary` | `#6F6B63` | warmes Grau, sekundärer Text |
| `--accent-color` | `#8A8F6A` | **Oliv-Moos**, Signature-Akzent — Buttons, Lines, Highlights |

**Dark-Blöcke** werden inline gesetzt (z. B. „Für Wen"-Section in Songcamp: `#111` + mood-Image-Overlay).

## Typografie

| Token | Familie | Verwendung |
|---|---|---|
| `--font-primary` | `'Söhne', 'Inter', system-ui` | Body, Navigation, UI |
| `--font-secondary` | `'Canela', 'Cormorant', 'Iowan Old Style'` | Editorial Headlines, Quotes, `<em>` / `<i>` |

*Söhne/Canela* sind die gewünschten Zielfonts, *Inter/Cormorant* sind der Google-Fonts-Fallback in Produktion.

### Fluid Type Scale
`clamp(min, responsive, max)` für alle Textgrößen:
- `--text-sm` 0.875–1 rem
- `--text-base` 1.125–1.25 rem
- `--text-lg` 1.25–1.5 rem
- `--text-xl` 1.5–2 rem
- `--text-2xl` 2–2.5 rem
- `--text-3xl` 2.5–3.5 rem
- `--text-4xl` 3–4.5 rem
- `--text-hero` 4.5–9 rem

### Line-Height & Tracking
| Token | Wert | Einsatz |
|---|---|---|
| `--lh-tight` | 1.05 | Hero-Titel |
| `--lh-base` | 1.5 | Standard |
| `--lh-relaxed` | 1.7 | Body-Paragraphen |
| `--tracking-tight` | -0.02em | Headlines |
| `--tracking-tighter` | -0.04em | Hero |
| `--tracking-wide` | 0.05em | UPPERCASE-Kickers |
| `--tracking-wider` | 0.1em | Buttons, Labels |

### Body-Text — zentrale Regel
Alle `<p>`-Tags verwenden seit April 2026 eine globale Default-Typografie (Referenz: Songcamp „Fünf Tage, ein Rhythmus"). Die Werte liegen als Custom Properties in `:root` und lassen sich zentral ändern:

| Property | Wert | Bedeutung |
|---|---|---|
| `--body-font-size` | `16px` | Body-Größe überall |
| `--body-line-height` | `1.75` | entspannte Lesung |
| `--body-font-weight` | `300` | editorial light |
| `--body-color` | `var(--text-primary)` | fast-schwarz statt grau |
| `--body-max-width` | `680px` | Lesbarkeits-Cap |

Die globale `p`-Regel konsumiert diese direkt. Overrides (z. B. `.entry-desc` in Cards, oder spezifische Meta-Texte) sollen diese Variablen weiter nutzen, nicht eigene Zahlen erfinden — so bleibt das System one-change-all.

## Komponenten-Atlas

| Klasse | Zweck |
|---|---|
| `.snap-block` / `.snap-block-inner` | 100vh-Sektion für Scroll-Snap |
| `.editorial-split` (+ `.reverse`) | 2-Col Text+Bild |
| `.editorial-title`, `.editorial-lead`, `.editorial-desc`, `.editorial-num`, `.editorial-sub` | Editorial-Typo-Stufen |
| `.editorial-link` | unterstrichener Text-CTA mit Pfeil |
| `.sc-block` / `.sc-block-inner` / `.sc-grid` / `.sc-kicker` | Songcamp-spezifisches Layout-Kit |
| `.sc-list-item`, `.sc-day-card`, `.sc-alumni-grid` | Songcamp-Details |
| `.kb-btn-primary`, `.btn-primary` | Primary-Button (oliv, 2 px Radius) |
| `.kb-link` | flacher Text-Link mit Pfeil |
| `.page-section` | jede Top-Level-Route |
| `.page-title`, `.page-container`, `.page-content-grid` | Basic-Page-Layout (Team, Releases, Kontakt, Legal) |
| `.scroll-anim` | Opt-in für IntersectionObserver-Reveal |
| `.teaser-bg`, `.teaser-overlay`, `.teaser-content` | Home-Songcamp-Parallax-Teaser |

## Animation-Easings (Signatur)

| Zweck | Curve / Easing |
|---|---|
| Seiten-Slides, Scroll-Reveals | `cubic-bezier(0.16, 1, 0.3, 1)` („expo.out")  |
| Logo-Flight im Intro | GSAP `power3.inOut`, 1.2s |
| Hover-Micros | `cubic-bezier(0.68, -0.6, 0.32, 1.6)` (leichtes Overshoot) |
| Parallax-Träge | GSAP `power2.out`, 3–4 s |
| Klabautermann-Drop | GSAP `power2.in` (Fall) + `back.out(2)` (Landung) |

**Faustregel**: Dauer **0.6–1.2 s** für bewusste Bewegung, nie unter 0.3 s außer bei Micro-Hovers. Kein Bouncing, kein Snapping, kein flashiges Zeug.

## Keyframe-Animationen (CSS)
- `pulse` — Loader-Heartbeat (1.5 s infinite).
- `tickle` — Logo wackelt beim Hover (0.4 s ease-in-out).
- `slowZoom` — 45s Teaser-Zoom auf Camp-Background (im CSS, läuft endlos).

## Responsive-Strategie
- Single Breakpoint-Bündel bei **992 px** und **768 px** — siehe `/* Responsive Overrides */` ab [style.css:743](../style.css#L743).
- Mobile: Hero flippt zu Stack (Bild oben, Text unten, zentriert). Klabautermann-Easter-Egg abgeschaltet. Interactive Reveal nur auf Hover-Pointer.
- Padding: Desktop `4rem` horizontal, Mobile `2rem`.

## Nicht-Regeln
- Kein Tailwind, Bootstrap oder Utility-CSS. Stattdessen: Tokens + semantische Klassen.
- Keine Inline-Styles in neuen Komponenten — aber **im Bestand haben viele Sections Inline-Styles** (Songcamp-Block, Produktion-Steps). Beim Refactoring vorsichtig sein, nichts wegrationalisieren, was absichtlich so gesetzt ist.
- Keine Emojis/Icons aus Pool-Libraries. Pfeile sind Unicode `⟶` oder CSS-gezeichnet.
- Keine Auto-Playing-Videos, kein Sound.

## Editorial-Prinzipien
1. **Weißraum > Dichte**. Lieber eine weitere `snap-block`-Section als zwei Spalten packen.
2. **Eine Idee pro Bildschirm**. Jeder `snap-block` soll einen klaren Gedanken tragen.
3. **Typografie ist Ornament**. Fast alle Ornamente sind Buchstaben oder Linien — keine Grafik-Deko.
4. **Unterschied Headline ↔ Body** ist der Serif/Sans-Kontrast: Canela/Cormorant italic für Gewicht, Inter/Söhne für Rhythmus.
