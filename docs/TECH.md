# Tech-Architektur

## Stack
- **100% Vanilla**: HTML5 + CSS + JS. Kein Build-Step, kein npm, kein Framework.
- **GSAP 3.12.5** (+ ScrollTrigger) via CDN — einzige externe Runtime-Dependency.
- **Google Fonts**: Inter (300–600), Cormorant (300/400/600, ital) — geladen per `<link>`.
- **Hosting-Ziel: Vercel** (statisches Deployment).

## 3-File-Regel
Das ganze Produkt lebt in:
- [index.html](../index.html) — ~744 Zeilen, alle Sections als `.page-section`-Blöcke inline.
- [style.css](../style.css) — ~1.880 Zeilen, ein CSS-File mit allen Tokens.
- [script.js](../script.js) — ~518 Zeilen, eine IIFE auf `window.load`.

**Regel**: keine Datei-Splits, keine Komponenten-Bibliothek, keine Bundler. Alles editierbar über den Browser.

## SPA-Routing

### Funktionsweise
- Jede Section hat `id="<route>"` und Klasse `page-section`. Aktive Section trägt `.active`.
- Delegiertes Click-Handling in [script.js:105](../script.js#L105): jeder `[data-route]`-Click wird gefangen.
- `navigateTo(route)` spielt GSAP-Timeline (OutSlide-Left → DOM-Swap → InSlide-Right), ca. 0.9s total.
- URL wird via `history.pushState` aktualisiert (z. B. `/songcamps`). `popstate` hört auf Back/Forward.

### Asset-URLs & pushState-Fallstrick
**Regel**: Asset-Pfade (besonders `background-image`) **nie** als Inline-Style mit relativer URL schreiben. Immer in externer `style.css` definieren (dort resolved die URL gegen `/style.css`, protokoll- und route-unabhängig).

Grund: Inline-Style-URLs resolven gegen `document.baseURI`. `pushState('/songcamps')` ändert den baseURI — ein inline `url('images/foo.webp')` wird dann zu `/songcamps/images/foo.webp` → 404. Im Cache vorhandene Bilder werden trotzdem angezeigt, darum tritt der Bug nur sporadisch auf („manchmal geht's"). Beispiel-Fix: `#sc-fuer-wen-block` → Klasse `.sc-fuer-wen` mit Background-Image im CSS.

Absolute URLs wie `/images/…` lösen das Route-Problem, brechen aber auf `file://` (resolved zum Filesystem-Root). Darum ist externes CSS die einzige wirklich stabile Lösung.

### `file://`-Schutz
[script.js:163](../script.js#L163) wrappt jeden `pushState`/`replaceState` in `try/catch`. Grund: beim lokalen Doppelklick auf `index.html` wirft der Browser `SecurityError`. Der Catch lässt Animationen trotzdem laufen — nur die URL wird nicht aktualisiert.

### Deep-Link-Bootstrap
Beim Laden prüft [script.js:147](../script.js#L147) `window.location.pathname`. Wenn es in `validRoutes = ['home', 'produktion', 'sessions', 'songcamps']` liegt, springt die Seite direkt hin. **Achtung**: `team`/`releases`/`kontakt`/`impressum`/`datenschutz` sind nicht in der Liste — Deep-Links dahin landen auf Home.

### Produktions-Requirement (Vercel)
Vor dem Launch muss ein [`vercel.json`](../vercel.json) ins Root, damit Deep-Links (`/songcamps`, `/produktion`, …) nicht als 404 landen:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Optional im selben File: `cleanUrls`, `trailingSlash: false`, Security-Headers.

## Animation-Stack

### 1. Loader (Intro)
[script.js:7–54](../script.js#L7). Logo liegt zentriert im `.loader` und fliegt per GSAP-Timeline zur finalen Navbar-Position (Koordinaten via `getBoundingClientRect()`). Dauer: 1.2s + Hero-Reveals mit Blur-Filter.

### 2. Page-Transitions
GSAP-Stagger auf `slideSelectors` (siehe [script.js:103](../script.js#L103)): outgoing Elemente sliden nach links mit `opacity → 0`, dann DOM-Swap, dann incoming Elemente sliden von rechts rein.

### 3. Scroll-Reveals
Nativer `IntersectionObserver` in [script.js:255](../script.js#L255). Fügt `.is-visible` zu `.home-entry-section`, `.home-camp-section`, `.scroll-anim`. CSS handled den Übergang (`opacity 0 → 1`, `translateY(16px) → 0`).

### 4. Camp-Section Parallax
[script.js:362–394](../script.js#L362). Mouse-Parallax auf der Camp-Background mit dramatischer Trägheit (`duration: 3–4s`, `ease: power2.out`).

### 5. Interactive Text Reveal — „Das Versprechen"
[script.js:398–517](../script.js#L398). Kernstück:
- Text ist zweimal gerendert: `.blurred-text` (unscharf) + `.sharp-mask-text` (overlay, Wort für Wort in `.reveal-word`-Spans).
- Mousemove triggered `requestAnimationFrame` → `addReveal(x, y)` prüft, ob der Cursor in der Bounding-Box des **nächsten** Wortes ist. Zipper-Logic: sequentiell, nicht parallel. Anti-Skip eingebaut.
- 8s Idle-Timer setzt alles zurück.
- Closing-Line erscheint nur wenn ALLE Wörter gelesen sind.
- Nur Desktop mit Hover-Pointer (`matchMedia('(hover: hover)').matches && innerWidth > 992`).

## CSS-Architektur

### Tokens ([style.css:1–32](../style.css#L1))
- Farben, Typography, Fluid Font Sizes via `clamp()`, Line-Heights, Tracking, `--max-width-text: 65ch`.
- Siehe [DESIGN.md](DESIGN.md).

### Scroll-Snap
`html.snap-active { scroll-snap-type: y mandatory }` — die Klasse wird in JS hinzugefügt/entfernt, um während Page-Transitions Rendering-Konflikte zu vermeiden (siehe [script.js:176](../script.js#L176)).

**Snap ist nur auf Touch-Geräten aktiv** — die Regel ist in `@media (pointer: coarse)` gewrappt. Desktop (Maus und Trackpad, beide `pointer: fine`) scrollt frei. Grund: Mausrad-Events + mandatory Snap geben eine sperrige UX, und Trackpad vs. Maus ist in CSS nicht unterscheidbar; JS-Heuristiken wären fragil.

### Layout-Grundform
- `.snap-block` = volle Viewport-Höhe mit `scroll-snap-align: start`.
- `.snap-block-inner` = zentrierter Inhalt.
- `.editorial-split` = 2-col Grid, `.reverse` kehrt Spaltenreihenfolge um.
- `.sc-block` / `.sc-block-inner` = Songcamp-spezifische Block-Variante.

## Performance-Hinweise
- Keine Lazy-Loading-Attribute auf Bildern (manche >400 KB).
- Kein `<link rel="preload">` für Hero-Bild.
- Fonts via CDN ohne `font-display: swap`-Override (bereits durch Google CSS gesetzt).
- GSAP-Runtime: ~50 KB gzipped. Akzeptabel, aber Footprint.
- `videos/background_loop_home.mp4` (4 MB) liegt im Repo, wird aber aktuell **nicht** verwendet.

## Browser-Support
- `:has()`-Selektoren in CSS (z. B. `.navbar:has(.menu-toggle:hover)`): Safari ≥ 15.4, Chrome ≥ 105, Firefox ≥ 121. Fallbacks fehlen — ältere Browser sehen die Hover-Logo-Animation nicht, aber alles andere läuft.
- History API, IntersectionObserver, `requestAnimationFrame` — seit Jahren stabil.

## Git-Hygiene
- `.gitignore` ignoriert `.DS_Store`, IDE-Configs, Dev-Parser-Skripte (`parse.py`, `parse_legal.py`, `*.xml`).
- `main` ist primary branch. Letzter Commit: `abe175d`.
