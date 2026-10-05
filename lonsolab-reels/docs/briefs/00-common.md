# Brief común para todos los reels de Lonso Lab

Lee esto antes que el brief de tu reel. Proyecto Remotion: `lonsolab-reels/studio`. Kit compartido: `studio/src/brand`
(lee `studio/src/brand/README.md`). Investigación: `docs/creative-research.md` (§1 ritmo de texto, §2 zonas seguras,
§3 técnicas de motion, §4 copy). Marca: `docs/brand.md`. Música: `docs/music-cuts.md` + `MUSIC` en `brand/musicCuts.ts`.
Skills de Remotion instaladas en `/root/.claude/skills/remotion-*` (lee `remotion-markup/SKILL.md` y los .md que necesites:
`transitions.md`, `timing.md`, `audio.md`, `sequencing.md`, `text-highlights.md`, `measuring-text.md`, `motion-blur.md`).

## Entregable
- Carpeta propia `studio/src/reels/<id>/` con `index.tsx` (registerRoot + una `<Composition id="<Id>">`, 1080×1920, 30 fps,
  `durationInFrames` = la duración de la base musical de tu reel) y los componentes que necesites.
- Render: `cd studio && npx remotion render src/reels/<id>/index.tsx <Id> out/<id>.mp4 --concurrency=2`
- Master de audio: `python3 ../tools/master.py out/<id>.mp4` → `out/<id>.final.mp4` (−14 LUFS, −1 dBTP).
- QA: `python3 ../tools/qa.py out/<id>.final.mp4 --every 0.5` → mirá `out/<id>.final.qa/contact.jpg` y los frames
  individuales que dudes. Además renderizá stills de los momentos clave con `npx remotion still ... --frame=N`.
- Escribí `studio/src/reels/<id>/NOTES.md`: qué hiciste, timing por escena (frames), SFX usados, problemas abiertos.
- **No toques** `src/brand/` ni carpetas de otros reels. Si necesitás variar un componente del kit, copialo a tu carpeta.
- **No hagas commits** de git.

## Reglas no negociables
1. **Sin precios.** Ni "$", ni "desde", ni "ARS", ni porcentajes de descuento.
2. **Español rioplatense con voseo** y ortografía perfecta (tildes, ¿¡, ñ). Revisá cada string.
3. **Zonas seguras**: texto, logo y CTA dentro de x 90–990, y 290–1240; desde y 840 nada importante a la derecha de x 880.
   Titulares en zona A (y 290–840). Fuera de eso solo imagen/decoración.
4. **Legibilidad**: duración de placa ≥ 0,5 s + 0,32 s × palabras (mín. 27 frames); máx. 7 palabras por placa; última
   placa/CTA sostenida 1,5–2,5 s. Tamaños: protagonista 140–220 px, titular 96–130 px, apoyo 56–72 px, nunca < 44 px.
   Contraste ≥ 4,5:1.
5. **Frame 0 con contenido** (nada de fundido desde negro). Movimiento en los primeros 6–10 frames.
6. **Interrupciones visuales cada 1,5–3 s**, variando el tipo.
7. **Verdad**: solo afirmaciones verificables. Simulaciones de UI con etiqueta pequeña "Simulación" (o "Ejemplo
   ilustrativo") y negocios inventados. Nada de logos oficiales de Google/Apple/Instagram ni sus sonidos exactos
   (nombrar "Google Maps" como servicio está bien). Números reales solo con su contexto (ver `docs/brand.md` §6.5).
8. **Accesibilidad**: nunca más de 3 flashes por segundo.
9. **Audio**: `<Music src={MUSIC.<id>.file} durationInFrames={...} />` desde el frame 0 (la base ya empieza en un downbeat).
   SFX del kit con `<Sfx name at volume>`: el pico del whoosh cae en el frame del corte (arranca 6–12 frames antes);
   el impacto cae en el frame exacto (nunca antes). Volumen típico: UI 0.35–0.6, whoosh 0.5–0.7, impactos 0.7–0.9.
   No satures: después del master todo queda a −14 LUFS, así que no hace falta subir.
10. **Sincronía**: los cortes y golpes van en beats: `frame = Math.round(n * MUSIC.<id>.beat_frames)` (no acumules
    redondeos). Los cues de `MUSIC.<id>.cues` marcan drops/silencios: alineá ahí los giros de la historia.
11. **CTA final** (cierre de 2–2,5 s, no más): logo Lonso Lab + "Auditoría gratis" (o el CTA de tu brief) +
    "lonsolab.com" y/o "WhatsApp +54 3541 33-7818". No inventes un @ de Instagram.
12. Calidad visual de agencia: tipografía Archivo con `fontStretch` 100–125 % y pesos fuertes en titulares, curvas
    `EASE.salida`/`EASE.rebote`, sombras suaves de la marca, grano sutil opcional (3–5 %), nada que se vea "plantilla".

## Paleta
papel `#f3f4ef` · papel2 `#e8eae2` · tinta `#13182b` · tinta2 `#4a5168` · cobalto `#2340d8` · cobaltoHondo `#182c9e` ·
cobaltoClaro `#c9d2ff` · pin (naranja) `#ff5a26` · verde `#1f7a3e` · estrella `#f2a516`. El naranja es "tu negocio" y la acción.

## Antes de terminar
- Mirá la hoja de contacto completa y al menos 6 stills clave. Corregí texto cortado, solapado, fuera de zona segura,
  ilegible o demasiado rápido; animaciones que "saltan"; frames vacíos; desincronía con la música.
- Verificá en `qa.py`: duración correcta, 1080×1920, 30 fps, audio presente, −14 ±1 LUFS, true peak ≤ −1.
