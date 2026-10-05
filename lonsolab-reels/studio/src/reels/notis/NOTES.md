# Reel 7 · `notis`: "Que tu celular suene así" (Composition `Notis`)

1080×1920 · 30 fps · 360 frames (12 s) · música `MUSIC.notis` ("Playful Plucks", 120 BPM, beat 15 f, compás 60 f).
Loop: el frame 359 empalma con el 0 y la música corta en el downbeat del compás 7.
Render: `out/notis.mp4` → master: `out/notis.final.mp4` (−13,7 LUFS integrados, true peak −1,8 dBFS, 12,01 s, con audio).

## Archivos
- `index.tsx`: registerRoot + `<Composition id="Notis">` (duración = `MUSIC.notis.duration_frames`).
- `Notis.tsx`: capas (papel + topo → etiqueta "SIMULACIÓN" → rig de cámara con pulso de onda, celular, titulares y CTA → grano → sonido).
  Dentro del celular redibuja la Dynamic Island del kit con zIndex 60 para que el hardware quede siempre arriba del contenido.
- `timing.ts`: `B(n)` por beat sin acumular redondeos, `T` (frames clave), `lt()` (tiempo de loop), geometría (incluye el hueco del
  contador `COUNTER_SLOT`/`COUNTER_CY`), las 25 notificaciones.
- `LockScreen.tsx` (fondo de pantalla, reloj, sombra inferior suave, atajos), `Card.tsx` (tarjeta genérica), `Stack.tsx` (pila, máscara alfa,
  barrido), `Counter.tsx` ("+N notificaciones"), `Headline.tsx` (titulares + "stretch punch"), `Cta.tsx`, `Sound.tsx`.
- `tune_sfx.py`: copias afinadas de `pop`, `notif_ding` y `notif_msg` → `public/notis/sfx/` (ver Sonido).
- `stills.mjs`: empaqueta una vez y renderiza stills (`node src/reels/notis/stills.mjs 0 75 255 …` → `out/notis-stills/`).

## Look
- Afuera: papel con `<Topo>` cobalto al 17 % y deriva circular con período de 360 f (no rompe el loop), viñeta cobalto claro, grano 5 %.
- Celular del kit a 0,95 (722×1482, x 179–901, y 196–1678), frontal. Pantalla bloqueada genérica: degradé cobalto → cobaltoHondo → tinta,
  curvas de nivel en cobaltoClaro al 20 %, fecha "lunes 5 de octubre" (40 px), reloj "9:41" (Archivo 600, wdth 118 %, 128 px),
  atajos genéricos de linterna y cámara abajo (zona C, solo imagen, **debajo** de la pila) y una sombra suave abajo (también debajo de la pila).
- Notificaciones genéricas (no iOS): vidrio blanco 82–90 %, radio 28, icono redondo de color con iconos del kit
  (Teléfono verde, Reseñas estrella, Mapas pin, Mensajes cobalto, Tu web tinta), "ahora" en #5a6078 (5,5:1 sobre el vidrio), títulos 48 px,
  cuerpo 46 px, estrellas SVG.
- **Pila con máscara alfa** (`mask-image` en el contenedor, en coordenadas de pantalla): las tarjetas aparecen desde una línea suave justo
  arriba del lugar más nuevo y se disuelven en el fondo de pantalla entre y 1250 y 1600 (antes había una capa de tinta que las volvía grises).
- **Titulares de un solo tono**: Archivo 800, wdth 102 %, 102 px, centrados en zona A (y 496–800). La línea más ancha ("¿Querés que")
  mide ~628 px (x 226–854): todo queda dentro de la pantalla, en papel. `DualTone` sigue envolviendo la capa como red de seguridad
  (si el "stretch punch" se pasara del celular, se vería tinta sobre papel), pero en reposo ya no corta ningún glifo.
  Palabra clave con resaltador pin (rotado −1,4°) y texto tinta dentro del resaltador (tinta sobre pin 5,8:1).
- "SIMULACIÓN" vertical a la izquierda (38 px, tracking 0,2 em, tinta2 sobre papel, x ≈ 128, y ≈ 900–1220), siempre visible.

## Escenas y timing (frames)
| Frames | Qué pasa | Texto |
|---|---|---|
| 0–74 | Pantalla bloqueada con la tarjeta "Teléfono · Llamada entrante · Un cliente te encontró en Google" (aterriza en f0 con pop, pulso de llamada cada 30 f, vibración del celular y pulso de onda). Entran tarjetas en f30 y f60 (blancas). Los atajos de linterna/cámara se van en f44–54, antes de que la pila llegue abajo. | f0–72: **"¿Querés que / tu celular / suene así?"** (73 f legibles en la primera vuelta; 88 f en loop) |
| 72–96 | Cambio de titular tipo "rodillo": cada línea sale hacia arriba por su máscara (f72/73/74, 4 f, ease-in) y la nueva sube desde abajo (f77/80/83, 13 f, `EASE.salida`). Resaltador sobre "aparece." f86–94. | **"Así suena un / negocio que / aparece."** hasta f259–270 |
| 0–255 | Lluvia de 25 notificaciones que se acelera en la grilla de 120 BPM: blancas (f0, 30, 60), negras (90, 105, 120, 135), tresillos de negra (150, 160, 170), corcheas (180, 188, 195, 203), tresillos de corchea (210…235 cada 5 f), semicorcheas (240, 244, 248, 251, 255). **Inserción tipo cinta**: la tarjeta nueva baja desde la ranura (opaca, revelada por la máscara) y empuja a las demás con el mismo resorte (cruza su lugar justo en el beat, ~6 % de rebote, quieta en ~10 f), así dos tarjetas nunca se superponen. Brillo que cruza la tarjeta; desenfoque direccional por velocidad con tope de 2,4 px durante la lluvia (los textos se siguen leyendo). | — |
| 120/180/240 | "Kick" de cámara en los downbeats (+1,4 % de escala, 10 f) y golpe del resaltador "aparece." (1→1,07). Push-in lento 1→1,025 de f75 a f255. El fondo de pantalla se "calienta" (resplandor cobalto que crece con la densidad). | — |
| 146–268 | Contador estilo iOS "+N notificaciones" en **su propio hueco** entre titular y pila (centro y 890, 88 px de alto): en f146–156 la pila baja 110 px y la pastilla aparece con rebote en f148–158. Pastilla tinta, número pin, `tabular-nums`, golpe en cada llegada. Cuenta = llegadas − 1; en f255 llega a **"+24 notificaciones"** y la pastilla pasa a pin con texto tinta. Se desvanece en f264–269, antes de que el barrido la lleve hacia la isla. | "+7" … "+24 notificaciones" |
| 259–281 | Titular sale por máscara (f259/261/263, 7 f: texto y resaltador fuera en f270). Barrido: anticipación de 26 px hacia abajo (f261–265) y todo vuela hacia arriba (f265–277, curva in-out con la velocidad máxima en f270 = pico del whoosh), con desenfoque vertical fuerte. Solo vuelan las tarjetas que estaban visibles. Reloj se atenúa a 14 %. | — |
| 270–329 | CTA centrado en la pantalla (bloque y 676–1170): logo blanco de 100 px f270 (máscara, 7 f), **"Escribinos."** f271 (stretch punch, 104 px, wdth 112 %), pastilla pin **"Auditoría gratis"** f274 (pop con rebote, 8 f, icono chat), **"lonsolab.com"** f276 (60 px, 7 f). Todo armado hacia f280–283. Toque en la pastilla en f300 (beat 20: presión 0,955 + onda), brillo en f315. Sale f325–330 (5 f, ease-in seco, baja 36 px). | CTA completo ~45 f (≈1,5 s) + entrada/salida (60 f en total) |
| 330–359 | Vuelve la composición del frame 0: el hook se rearma con "stretch punch" de la marca (wdth 62→102 %, 900→800, escala 1,28→1) en f330 / f338 / f345, resaltador f352–358, y la tarjeta de llamada baja de la ranura desde f356 para aterrizar en f360 = f0. Todo lo del hook se calcula en "tiempo de loop" (`lt`: 330–359 = −30…−1), así que 359 → 0 es continuo. | (hook) |

## Sonido (frame de inicio · volumen)
- Música: `MUSIC.notis.file` sin fades (copia local de `<Music>`: un fade marcaría la costura del loop), volumen 0,62, ducking ×0,8 en f268–279.
- Notificaciones: un sonido por tarjeta en su frame de aterrizaje, alternando pop / ding / msg como pide el brief, **afinados en Sol/La/Do/Re**
  (la base está centrada en Sol) para que la lluvia toque una figura ascendente en la tonalidad. Archivos `public/notis/sfx/{ding,msg,pop}_*.wav`
  (remuestreo de los SFX del kit con `tune_sfx.py`). Volumen según densidad, dentro del 0,35–0,5 del brief: 0,5 (≥ 15 f entre tarjetas),
  0,46, 0,43, 0,40, 0,36 (semicorcheas). f0: `pop_1` 0,5 + `ding_G` 0,26.
- `swipe` f72 (0,3) cambio de titular · `snap` f255 (0,32) "+24" · `whoosh_fast` f264 → pico f270 (0,6) · `snap` f271 (0,26) "Escribinos."
  · `pop_2` 0,45 + `success_chime` 0,3 en f274 (pastilla) · `ui_tap` 0,95 + `pop_3` 0,32 en f300 (toque) · `swipe` f324 (0,22)
  · `snap` f330/f338/f345 (0,3–0,34) palabras del hook.

## Decisiones
- **Fecha**: el brief dice "lunes 6 de octubre", pero el 6 de octubre de 2026 es martes; usé **"lunes 5 de octubre"** (correcto para 2026).
- **Intervalos**: el brief pide 20, 14, 10, 7, 5, 4, 3 f; los llevé a subdivisiones de la grilla (30 → 15 → 10 → 7,5 → 5 → 3,75 f) para que
  cada pop caiga en tiempo musical. 25 tarjetas en total → el contador termina exactamente en "+24".
- **Hook en el frame 0 completo** (portada legible) y el loop lo rearma en el último segundo; el CTA va anteúltimo como pide el brief.
- **Verdad**: todo es una simulación con negocio genérico, rotulada "SIMULACIÓN"; sin logos de Google/Apple ni sus sonidos ("Google" solo
  nombrado como servicio en "Un cliente te encontró en Google"). Sin precios. Mensajes de clientes en "ustedes" (le hablan al negocio);
  el copy de la marca en voseo ("¿Querés…?", "Escribinos.").
- Accesibilidad: ningún flash (máx. salto de luminancia media entre frames 0,057 en f271; el mayor cambio de área > 20 % de luminancia es
  21 % en f269, durante el barrido). El resaltador/brillos son barridos, no destellos.
- Zonas seguras: titulares en zona A (x 226–854), contador centrado (x ≈ 260–820, y 846–934), tarjetas ≤ x 862 debajo de y 840,
  CTA centrado x ≈ 230–850, y 676–1170.

## Revisión del director creativo (7,2/10) → cambios
Todo lo que pidió está aplicado, salvo lo que se explica al final:
1. **Contador encima de la segunda tarjeta (mayor)** → tiene su propio hueco entre titular y pila (y 846–934); la pila baja 110 px cuando
   entra (f146–156). Ya no tapa ninguna tarjeta; el golpe por llegada y el estado pin "+24" siguen igual.
2. **Linterna/cámara encima de la pila (mayor)** → se van en f44–54 (antes del empujón de f60) y además se dibujan debajo de la pila (zIndex 1).
3. **CTA subexpuesto (mayor)** → logo f270, "Escribinos." f271, pastilla f274, url f276 con entradas de 7–8 f; salida f325–330 (5 f).
   Plato completo ~45 f contra ~30 f antes. No adelanté el barrido medio beat: "+24" necesita sus 15 f antes de la anticipación.
4. **"aparece." y su resaltador sucios en f272–273** → el titular sale en f259/261/263 y está fuera por completo en f270, antes del logo.
5. **Pastilla sobre la Dynamic Island en f271** → la isla se redibuja arriba de todo (zIndex 60) y el contador se apaga en f264–269.
6. **Bitono que corta glifos** → elegí la opción "un solo tono dentro de la pantalla": no se puede agrandar el desborde sin salir de x 90–990
   (el celular ocupa x 179–901), así que los titulares pasan a 102 px / wdth 102 % (rango titular 96–130) y quedan en x 226–854.
7. **Fundido de tinta que ensucia las tarjetas** → máscara alfa en la pila; la sombra inferior quedó suave y debajo de las tarjetas.
8. **Doble exposición al entrar** → la tarjeta entra opaca desde la ranura (sin fundido) y empuja a las demás con el mismo resorte;
   desenfoque con tope de 2,4 px durante la lluvia.
9. **Onda que parecía un segundo contorno** → ahora es un pulso de resplandor cobalto sin trazo (≤ 0,22, 18 f) detrás del celular.
10. **CTA arriba y logo chico** → logo de 100 px, bloque centrado en y 676–1170, reloj al 14 %.
11. **lonsolab.com 54 px** → 60 px.
12. **"ahora" 4,3:1** → #5a6078 (5,5:1); el nombre de la app sigue en tinta2 para mantener la jerarquía.
13. **Copy** → "“Súper recomendable”" pasó a "“Recomendadísimo”" y la segunda tarjeta de Mapas dice "Pidieron cómo llegar / a tu local".
14. **"SIMULACIÓN" 30 px** → 38 px con tracking 0,2 em.
15. **SFX por arriba del brief** → 0,5 → 0,36 según la densidad, más el ding de f0 a 0,26; remasterizado (−13,7 LUFS, −1,8 dBTP).

**No apliqué**: la línea opcional "WhatsApp +54 3541 33-7818" debajo de la url. El brief de este reel pide logo + "Escribinos · Auditoría gratis"
+ "lonsolab.com", y sumar el número (~3 palabras/cifras más) llevaría el plato a ~7 palabras, cuando solo hay ~45 f con el CTA completo
(la fórmula pediría ~80 f). "Escribinos." funciona con la web, que tiene los canales de contacto.

## QA
- `qa.py`: 12,01 s · 1080×1920 · 30 fps · audio presente · −13,7 LUFS · true peak −1,8 dBFS. Revisé la hoja de contacto completa.
- Stills revisados después de los cambios: f0, 3, 8, 58, 60, 62, 72, 122, 148, 150, 152, 156, 165, 198, 200, 202, 212, 217, 222, 230, 246,
  258, 262, 266, 268–273, 276, 280, 300, 315, 322, 325, 327, 329, 330, 338, 352, 356, 359.
- Costura del loop: 359 → 0 = 0,024 de diferencia media, en continuidad con el aterrizaje de la tarjeta de llamada (f357→358 0,0225,
  f358→359 0,0254, f0→1 0,0219): es movimiento, no un salto. El promedio entre frames consecutivos es 0,019.

## Problemas abiertos
- Durante las semicorcheas (f240–255) las tarjetas se mueven rápido y no da tiempo a leerlas una por una: es intencional (el mensaje es la
  cantidad); con el tope de desenfoque los textos se ven nítidos, y el contador y el titular siguen legibles.
- Durante la lluvia densa siempre asoma el borde de la próxima tarjeta bajo el contador (es la ranura de donde salen); es el efecto buscado.
- Los SFX afinados viven en `public/notis/sfx/` (fuera de `src/reels/notis/`); se regeneran con `python3 src/reels/notis/tune_sfx.py`.
- El loop de audio depende del reproductor: AAC agrega unos ms de silencio de arranque que algunas apps no compensan.
- Las pistas de Suno ahora son públicas (aviso del usuario): no cambia nada del render; la licencia sigue siendo la del plan pago.
