# Lonso Lab · reels — estado del proyecto (para continuar en otra sesión)

Proyecto de reels promocionales para **Lonso Lab** (lonsolab.com), una agencia de Córdoba que gestiona Google Maps,
redes sociales y webs para negocios locales. Los dueños son el usuario y su familia. Los videos se hacen con
**Remotion** (React → MP4) en `lonsolab-reels/studio`.

## Cómo verlo y editarlo en vivo (sesión local)
1. `cd lonsolab-reels/studio && npm install`
2. `npm run dev`. Abre **Remotion Studio** en http://localhost:3000 (en la app de escritorio, en el panel
   Browser; la config está en `.claude/launch.json`). Ahí están todos los reels:
   - carpeta **Pausados-con-paletas** → `BuscandoCalma` (cambiá la paleta en el panel de props: web / mono / bosque / marino)
   - carpeta **Primera-tanda** → los 7 reels originales
3. Cada cambio en el código se ve al instante en Studio, sin renderizar.

Render final de un reel:
`npx remotion render src/reels/<id>/index.tsx <Id> out/<id>.mp4` (`BuscandoCalma` acepta `--props='{"theme":"mono"}'`).
Master de audio a −14 LUFS: `python3 ../tools/master.py out/<id>.mp4` (necesita Python 3 + ffmpeg; es opcional
para revisar). QA: `../tools/qa.py`, temblor: `../tools/jitter_scan.py`.

## Dónde está cada cosa
- `studio/src/brand/`: kit compartido. `tokens.ts` (colores de la web, curvas, zonas seguras), `themes.ts`
  (**4 paletas candidatas**), `fonts.ts` (Archivo variable), `Logo` (con prop `color`), `Topo` (curvas de nivel),
  `Phone`, `Icon`, `Sfx`/`Music`, `musicCuts.ts` (bases de música y cues en frames).
- `studio/src/reels/<id>/`: un reel por carpeta, con `NOTES.md` (tiempos, decisiones y pendientes).
- `studio/public/`: logo, fuentes, SFX propios (`sfx/`), bases de música (`music/`, pistas de Suno del usuario,
  cortadas en downbeat y a −14 LUFS) y material real del portfolio (`web/`).
- `docs/briefs/`: guiones frame a frame (`00-common.md` = reglas de la casa). `docs/brand.md`: marca y mensajes.
  `docs/creative-research.md`: ritmo, zonas seguras y copy. `docs/publicacion.md`: textos para los posts.
- `tools/`: `cut_music.py` (rehace las bases), `beatgrid.py`, `analyze_music.py`, `master.py`, `qa.py`,
  `jitter_scan.py`, `make_sfx.py`.

## Estado y decisiones pendientes
- Están hechos los 7 reels de la primera tanda (buscando, manifiesto, despegue, pov, trabajo, rebrand, notis).
  `buscando` usa "Tu negocio" como negocio del espectador; el ejemplo de búsqueda sigue siendo una ferretería.
- **Feedback del usuario:** los reels se sienten **muy rápidos** para su público (dueños de negocio adultos), y la
  paleta de la web (crema + tinta + cobalto + naranja) **confunde** con tanta información.
- **Piloto `BuscandoCalma`** (40 s): una idea por pantalla, titulares de 3 s o más, UI grande, poco movimiento.
  Está renderizado en 4 paletas: A `web` ordenada, B `mono` (blanco y negro + naranja, la recomendada), C `bosque`
  (verde + crema + miel), D `marino` (marino + amarillo).
- **Pendiente:** que el usuario elija la paleta y confirme el ritmo; después aplicar las dos cosas a los otros 6
  reels (pasar sus colores a `themes.ts` como hizo `buscando_calma`) y, si lo pide, a la web (su código no está en
  este repo).
- Reglas: sin precios, voseo rioplatense, solo datos verdaderos (705.326 visualizaciones con campañas pagas,
  Terra Firma 4,7 con 5.807 opiniones, MPJ Fitness 5,0), "Simulación" o "Ejemplo ilustrativo" en las UI inventadas,
  textos dentro de x 90–990 / y 290–1240.
