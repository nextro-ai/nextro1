# Reel 5 · `trabajo`: "Mirá el trabajo" (Composition `Trabajo`)

1080×1920 · 30 fps · 768 frames (25,6 s) · música "Latin Funk Groove" (121,8 BPM, beat 14,778 f), **re-corte local
`public/trabajo/trabajo-b.wav`** (ver "Música" abajo); tempo, duración y cues iguales a `MUSIC.trabajo`.
Render: `out/trabajo.mp4` → master: `out/trabajo.final.mp4` (−14,0 LUFS integrados, true peak −2,0 dBFS, master lineal).

## Archivos
- `index.tsx`: registerRoot + `<Composition id="Trabajo">`.
- `Trabajo.tsx`: orden de capas (escenario → "Mirá" → tarjetas → tarjeta CTA → slot/pastilla → titular final → hook → grano).
- `timing.ts`: `B(n)` y `BAR(n)` redondeados por beat (sin acumular) y todos los frames clave.
- `stack.ts`: la matemática del mazo (subida, profundidad, vuelo a la grilla).
- `SceneHook.tsx`, `SceneMira.tsx` (+ `Stage`), `Cards.tsx` (5 casos), `Final.tsx` (grilla, CTA), `Sound.tsx`, `ui.tsx` (máscaras, etiqueta de expediente, trazo a mano, estrellas, grano).
- `stills.mjs`: empaqueta una vez y renderiza stills (`node src/reels/trabajo/stills.mjs 0 236 …` → `out/trabajo-stills/`).
- `cut_music_b.py`: genera `public/trabajo/trabajo-b.wav` (re-corte de la base) y los dos clics más fuertes
  `public/trabajo/sfx/tick_hot.wav` y `ui_tap_hot.wav` (hechos con los SFX del kit). `python3 studio/src/reels/trabajo/cut_music_b.py`.

## Música (corrección de fase)
Medí el bajo (30–120 Hz) de `5-trabajo.m4a`: el corte del kit (`tools/cut_music.py`, 139,094 s) queda **un beat antes**
de las líneas de compás reales. Con ese corte el bajo seguía hasta f132 (el dip "real" era f133) y el drop real caía en
f251; el f236 era un golpe del fill de bombo. Re-corté la base un beat más tarde (139,587 → 165,203 s, misma cadena de
loudness que `cut_music.py`) en un archivo local del reel; las visuales quedaron donde estaban. Verificado en el
`.final.mp4`: el bajo se corta en f118–119 y el drop entra en f236 (−9 dB → −2 dB en f236–239); los bombos fuertes caen
en 251/266/281/296/311…, o sea las tarjetas cambian en el tiempo 1 de cada compás. Cues reales en la canción:
dip ≈ 143,53 s, drop ≈ 147,47 s (los de `cut_music.py`/`musicCuts.ts` son 143,035 / 146,976: un beat antes).

## Escenas y timing (frames)
| Frames | Escena | Qué pasa |
|---|---|---|
| 0–117 | 1 · Hook (tinta) | "No te / pedimos / que nos / creas." palabra por beat en f0, 15, 30, 44: "stretch punch" (wdth 62→125 %, escala 1,32→1, 900→800) + sacudón con noise de 6 f. 144 px, interlineado 0,92, desde y 300: "creas." termina en y ≈ 820 (zona A); el subrayado a mano (f74) va justo debajo. Logo + "TRABAJOS" desde f4. Tres "expedientes" asoman abajo y suben con cada palabra (anticipan el mazo). Frase completa 74 f. |
| 118–235 | 2 · "Mirá el trabajo." (papel, en el dip) | Corte seco en el dip (f118). Etiqueta "ARCHIVO // 5 CASOS REALES". Titular 200 px con máscara (f115/f118). Flecha naranja a mano f148–164 que "late" hacia abajo en cada beat (f163–222). Resaltador naranja detrás de "trabajo." en f190 (anticipa el "Tu negocio" final). Push-in 1→1,06 durante el riser y compresión de anticipación f228–238. |
| 236–649 | 3 · Mazo "Archivo" | Cada tarjeta (radio 56, 960 px) sube desde abajo: arranca 6 f antes del beat, 13 f con `EASE.salida`, motion blur vertical (SVG feGaussianBlur 0×N según la velocidad) y un leve giro que se endereza. El título de la tarjeta se revela mientras sube (máscara de 9 f, líneas a 2 f) y está completo al aterrizar. La anterior **sigue nítida hasta que el borde de la nueva cruza su título** (≈ beat −3) y recién ahí pasa a escala 0,9, sube 80 px (asoma 80 px arriba), opacidad 0,6 y blur 7 px, con un filo de luz de 2 px arriba para que se lea como tarjeta. La capa "Mirá el trabajo." (no es tarjeta) se desvanece más (15 %, blur 14). Fantasma "TRABAJO" al 5 % (wdth 75 %, 250 px, ≈ 990 px de ancho: entra entero y se desliza 35 px). Etiqueta tipo expediente (Archivo 700, wdth 75 %, tracking 0,18 em, 44 px) + paginación con puntos. Las piezas hacen "bop" 1→1,03 en cada beat y swing alternado. |
| 236–295 | CASO.001 // REELS (tinta) | **"Una toma, / una historia."** (4 palabras, legible f238–293 = 55 f ≥ 53). Celular con `reel-01.mp4` muteado y cortes en beats dentro de la pantalla (14,0 s @f226, 24,5 s @f251, 29,0 s @f266). Chip "Reel". Anillos punteados girando detrás. El impacto y el sub-boom caen ahora sobre el drop real. |
| 296–354 | CASO.002 // DISEÑO (papel) | **"Marca que / se reconoce."** (4 palabras, legible f298–352 = 54 f). Abanico más grande (carruseles de 610 px, ±13°, global y ≈ 730–1480): central al aterrizar, izquierda f310, derecha f325 (`EASE.rebote`). Cada carrusel muestra el 82 % superior: desaparece entera la línea "FREE AUDIT / LINK IN BIO" (y el "$127,340"). |
| 355–472 | CASO.003 // RESULTADOS (cobalto) | Contador 0→705.326 (f358–399, tabular-nums, punch al final). "visualizaciones en 30 días" + "Con campañas que administramos." (56 px, peso 620, wdth 88 %, una línea). Captura real de Instagram más grande (478 px, borde derecho en x ≈ 862) con chip "CAPTURA REAL" (f365). **f400, sobre el chime**: "93,7 % / no seguía / la cuenta." (5 palabras, completo en f403, tapado en f468 = 65 f ≥ 63) en columna izquierda; f404–414 flecha naranja a mano desde la frase hasta la fila "No seguidores 93,7 %" de la captura, que se encierra en un círculo y cierra en el downbeat f414 (valor circulado en x ≈ 836). Fondo con degradé a cobaltoHondo abajo. |
| 473–590 | CASO.004 // WEB (tinta) | "Terra Firma" + "Hotel boutique · Villa Carlos Paz". **Tablet** (600×800, sin barra de estado: la captura de 900 px es el layout tablet/escritorio del sitio) con la web real haciendo scroll f474–499 (hero → habitaciones → el hotel por fuera → reseñas → footer). La tira saltea la carta con precios y la franja negra vacía entre reseñas y footer (tramos 4790–5470 + 5880–6139), y el scroll para al final de la página: reseñas + footer llenan la pantalla. En f490 la tablet se corre a la derecha y en **f502** entra la tarjeta "4,7 ★★★★★ / con 5.807 opiniones / en Google" justo cuando la web muestra "4,7 sobre 5, con 5.807 opiniones" (legible f505–586 = 81 f ≥ 73). |
| 591–649 | CASO.005 // GOOGLE MAPS (papel) | "Ficha que gestionamos." Mapa ilustrado más alto (global y 740–1700; topo + calles, como en el sitio) con etiqueta **"MAPA ILUSTRATIVO"** arriba a la izquierda (estilo del chip "CAPTURA REAL" pero más quieto), pin naranja cae en f600 con ondas, chip "MPJ Fitness 5,0 ★" en f606. |
| 650–708 | 4 · Grilla | Las 5 tarjetas vuelan (de la de adelante a la de atrás, 2 f de desfase) a una grilla 3×2 **x 100–879** (alineada con el titular, mosaicos de 243 px, huecos de 25 px), y 730–1415. Titular "Tu negocio / puede ser / el próximo." (f654/657/660) con resaltador naranja detrás de "Tu negocio" (tinta sobre pin, 5,7:1). Slot 6 naranja con pin en f665, pulsa en f680 y f695; las miniaturas hacen ola en los beats. |
| 709–767 | 5 · Cierre (cobalto) | La última tarjeta (cobalto, topo papel 22 %, oso de agua) sube y tapa todo (f701–715); el titular cambia de tinta a papel justo donde pasa la tarjeta (dos copias con clip-path). El slot naranja se transforma en la pastilla "Auditoría gratis →" (f703–718). Logo f711, "lonsolab.com" f716, brillo sobre la pastilla f729–747 y bops en f724/739/754. El oso de agua bajó y se corrió (x 610, y 1340): su palo arranca en y ≈ 1380, lejos de la URL. Sostenido ~1,8 s. |

## SFX (frame de inicio · volumen)
`tick_hot` y `ui_tap_hot` son copias locales más fuertes de los SFX del kit (el `tick` del kit pica en −17 dBFS y toda su
energía está sobre 10 kHz: bajo este funk no se oía).
- Hook: `tick_hot` f0/15/30 (0,85), f44 (0,75) con un ducking de la música de ~3 dB y 3 f en cada palabra · `impact_short` f44 (0,28) · `swipe` f72 (0,3).
- Dip: `whoosh_down` f112 → pico en f118 (0,42) · `swipe` f148 (0,32) · `riser_2s` f176 → termina justo en f236 (0,7); la música baja ~2 dB entre f206 y f235 (bajo el fill de bombo) para que el riser se lea y el drop pegue más.
- Drop (real): `whoosh_fast` f231 → pico f236 (0,36) · `impact_short` f236 (0,5) · `boom_sub` f236 (0,09, más bajo porque ahora coincide con el bajo del drop) · música ×0,5 en el golpe.
- Diseño: `swipe` f294 → pico f296 (0,55) · `ui_tap_hot` f310, f325 (1,0).
- Resultados: `whoosh_fast` f350 → f355 (0,42) · 10 `tick_hot` que se espacian durante el conteo (0,5) · `success_chime` f399 al terminar el contador (0,45) · `ui_click` f404 cuando arranca el círculo (0,35) · `pop` f414 al cerrarlo (0,36).
- Web: `whoosh_fast` f468 → f473 (0,42) · `swipe` f479 (0,26) · `pop` f502 (0,5).
- Maps: `swipe` f589 → f591 (0,42) · `pop` f600 (0,6) · `ui_tap_hot` f606 (0,6).
- Cierre: `whoosh_med` f639 → pico f650 (0,45) · `pop` f665 (0,5) · `whoosh_fast` f704 → f709 (0,32) · `success_chime` f709 (0,55).
- Música (`Sound.tsx`, copia local de `<Music>` con ducking, archivo `trabajo/trabajo-b.wav`): 0,9 de volumen, fade-in de 2 f, fade-out de 20 f, y un ducking corto (×0,5–0,85) en cada golpe (f236, 296, 355, 399, 473, 502, 591, 600, 650, 709).
- Medido en la mezcla (mezcla − base): los clics del hook pican ~4 dB por encima de la música (antes ~26 dB por debajo), los `ui_tap` ~2 dB por debajo del pico del bombo, los ticks del contador ~4 dB por debajo y la cola del riser al mismo nivel que la base. Mezcla cruda −14,8 LUFS / −2,8 dBTP → el master queda lineal en −14,0 LUFS / −2,0 dBTP.

## Decisiones
- **Verdad**: todo lo que se ve es trabajo real (reel de The Auto Lab, carruseles, captura de estadísticas, web de Terra Firma, ficha de MPJ Fitness), por eso no lleva etiqueta "Simulación"; el mapa es la misma ilustración del sitio. Números siempre con su contexto: 705.326 + "en 30 días" + "Con campañas que administramos."; 93,7 % + la captura que lo muestra; "4,7 … con 5.807 opiniones" + "en Google" (agregué "en Google" para dar el contexto); "MPJ Fitness 5,0" + "Ficha que gestionamos."
- **Verdad, mapa**: el mapa es una ilustración (la geografía no es real; la ficha y el 5,0 sí), por eso lleva "MAPA ILUSTRATIVO". Elegí esa frase en vez de "Ejemplo ilustrativo" porque esta última haría pensar que el negocio o la nota son inventados.
- **Sin precios**: la web de Terra Firma tiene la carta del restaurante con precios ($); la tira de la tablet se arma con 5 tramos de la captura y **saltea esa sección**. El carrusel 01 tiene un "$127,340" y la línea "FREE AUDIT / LINK IN BIO" en su arte: los tres carruseles se recortan abajo (se ve el 82 % superior, el corte no toca texto).
- La etiqueta de expediente usa puntos de paginación en vez de "01/05" porque "CASO.005 // GOOGLE MAPS" + número no entraba en el ancho.
- Contraste: el naranja nunca va como texto sobre papel o cobalto (no llega a 4,5:1); se usa como resaltador detrás de texto tinta o como texto sobre tinta ("creas.").
- Zonas seguras: titulares en zona A (el hook ahora también); textos de apoyo dentro de x ≤ 880 debajo de y 840; la pastilla del CTA mide 660 px (x 210–870). Lo que pasa de y 1240 o de x 880 es imagen (celular, tablet, miniaturas, mapa). La captura de Instagram termina en x ≈ 862 y el valor circulado está en x ≈ 836 (fuera del riel de botones).
- El peek del mazo no sigue al pie de la letra el brief (opacidad 0,5 y blur 20): con esos valores se leía como una mancha gris; con 0,6 / 7 px / 80 px se reconoce la tarjeta y su etiqueta (pedido del director creativo).
- Accesibilidad: no hay flashes; los cambios de fondo son barridos de tarjeta, como mucho uno cada 2 s.
- Audio: el riser se adelantó 2 f para que termine justo antes del impacto del drop (antes se sumaban y el pico pasaba 0 dBFS).

## QA
- `qa.py`: 25,6 s · 1080×1920 · 30 fps · audio presente · −14,0 LUFS · true peak −2,0 dBFS.
- Revisé la hoja de contacto y stills de f60, 100, 112, 118, 122, 228–242 (drop), 290–300, 330, 352, 403, 404, 420, 450, 469, 470, 480, 490, 500, 506, 515, 545, 585, 587, 606, 620, 660, 690, 705, 740, 767. Comprobé en los límites (f293, f352, f468, f586) que el texto saliente sigue nítido hasta que lo cruza la tarjeta nueva.

## Revisión del director creativo (todas aplicadas)
- Base re-cortada un beat más tarde (mayor). · Tiempos de lectura: títulos de 4 palabras, máscara durante la subida, la tarjeta de abajo se tapa/desenfoca desde el beat −3; frase del 93,7 % en f400 (mayor). · Peek del mazo 80 px / 7 px / 0,6 + filo. · Piezas más grandes en CASO.002/005 y bloque más grande y bajo en CASO.003. · SFX audibles (clics propios, riser 0,7, ducking). · Recorte de carruseles sin texto a medias. · Tablet en lugar de celular y scroll sin la franja negra. · Captura de IG fuera del riel. · Hook en zona A. · "Con campañas que administramos." a 56 px / 620. · Fantasma "TRABAJO" entero. · Etiqueta "MAPA ILUSTRATIVO". · Oso de agua lejos de la URL. · Grilla alineada con el titular.

## Problemas abiertos
- Los títulos de CASO.001/002 cumplen la fórmula con poco margen (55/54 f para 53 f): una tarjeta por compás no da más.
- CASO.003 todavía tiene unos 350 px de fondo (degradé a cobaltoHondo) debajo de la captura (y > 1510): la captura no puede crecer más sin pasar x 870 o sin chocar con la columna de la frase. Esa franja queda bajo el caption de Instagram de todos modos.
- Para el orquestador: los cues de `trabajo` en `tools/cut_music.py` y `brand/musicCuts.ts` están un beat antes (reales: dip ≈ 143,53 s, drop ≈ 147,47 s; corte correcto 139,587–165,203 s). `tools/beatgrid.py` puede tener el mismo error de fase en otros reels. No toqué el kit: este reel usa su copia local.
- En la grilla las miniaturas tienen texto muy chico: funcionan como imagen, el mensaje es el titular.
- La web de Terra Firma es oscura: dentro de la tablet se lee como pieza, no como texto.
- "5.807 opiniones" y "5,0" son datos a la fecha de la captura del sitio; si cambian, actualizar en `Cards.tsx`.
- Los carruseles están en inglés (es el arte real del cliente).
