# Lonso Lab reel kit

Shared building blocks for every reel in `src/reels/<id>/`. Import from `../../brand`.

## Rules every reel follows
- **Format**: 1080x1920, 30 fps, H.264 + AAC. Each reel has its own entry file
  `src/reels/<id>/index.tsx` that calls `registerRoot()` with one `<Composition id="<Id>">`.
  Never edit another reel's folder or the shared kit without being asked (copy a component locally instead).
- **Render**: `npx remotion render src/reels/<id>/index.tsx <Id> out/<id>.mp4 --concurrency=2`
  Stills: `npx remotion still src/reels/<id>/index.tsx <Id> out/<id>-f120.png --frame=120`
- **QA**: `python3 ../tools/qa.py out/<id>.mp4` → contact sheet with safe-zone guides + LUFS. Target −14 LUFS
  integrated (±1.5) and true peak ≤ −1 dBFS. Look at the contact sheet and frames before calling it done.
- **No prices** anywhere (no "$", no "desde $…", no "ARS").
- **Language**: Rioplatense Spanish with voseo (vendés, aparecés, escribinos). Check accents/ñ/¿¡.
- **Safe zones** (`SAFE` in tokens): keep text, logo and CTA inside x 64…930, y 250…1500.
  Decorative motion can bleed. Use `<SafeZone />` while developing (hidden in renders).
- Text must be readable when it stays on screen: ≥ 3 words/s is too fast for body text; headlines can
  slam word by word on beats. Minimum body size 40 px, headlines 90–180 px.
- Drive every animation from `useCurrentFrame()` + `interpolate()/spring()`; no CSS transitions.
- Truthful claims only: real proof points listed in `docs/brand.md` (e.g. 705.326 visualizaciones en 30 días,
  MPJ Fitness 5,0 en Google, Terra Firma 4,7 con 5.807 opiniones). No invented guarantees.

## Brand
`C` colours: papel `#f3f4ef`, papel2, tinta `#13182b`, tinta2, linea, cobalto `#2340d8`, cobaltoHondo,
cobaltoClaro, pin (orange) `#ff5a26`, pinHondo, verde, estrella.
`EASE.salida` (0.16,1,0.3,1) and `EASE.rebote` (0.34,1.4,0.5,1) are the site's motion curves.
Typography: Archivo variable, auto-loaded. `display(size,color)` = 800 weight, 125% width (site headline look);
`label()` for buttons/UI; `body()` for paragraphs. You can set `fontStretch` 62%–125% and `fontWeight` 100–900.

## Components
- `<Logo kind="full|mark" variant="tinta|white|papel|cobalto" height={…} />` — official SVG logo.
- `<Topo color opacity drawFrom drift scale rotate strokeWidth />` — the site's contour-line motif.
- `<Phone width height bezel frameColor screenColor dark>` — smartphone frame; children render in the screen.
- `<Icon name="pin|buscar|tel|estrella|check|camara|web|chat|ruta|grafico|reloj|flecha|capas|equipo" size color />`
- `<Sfx name="whoosh_fast" at={frame} volume={0.8} />` — original SFX in `public/sfx/` (see list in Sfx.tsx).
- `<Music src="music/<file>" durationInFrames={…} volume fadeIn fadeOut trimBefore />`
- Helpers in `anim.ts`: `prog`, `pop`, `punch`, `shake`, `typed`, `beatFrames(bpm)`, `countUp`, `fmtAR`.

## Assets in `public/`
- `brand/` logos (svg), topo motif; `icons/` site icons; `fonts/`.
- `web/` real Lonso Lab work: `reel-01.mp4` (540x960, 35.8 s), `reel-02.mp4` (720x1280, 37.7 s),
  `carrusel-0{1,2,3}.jpg`, `metricas-ig-0{1,2}.jpg`, `terrafirma-*.webp` (website mockups).
- `music/` licensed tracks — see `../docs/music.md` for BPM, drop timestamps and licenses.
- `sfx/` original SFX.
