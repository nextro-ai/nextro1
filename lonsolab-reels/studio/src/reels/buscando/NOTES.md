# Reel 1 · `buscando` — "Te están buscando" (Composition `Buscando`)

1080×1920 · 30 fps · 926 frames (30,9 s) · música `MUSIC.buscando` ("Rise and Grind", 132,1 BPM,
beat 13,626 f, compás 54,5 f). Todos los cortes salen de `beat(n)` / `bar(n)` en `timing.ts`
(redondeo sobre la grilla flotante, sin acumular).

Render: `npx remotion render src/reels/buscando/index.tsx Buscando out/buscando.mp4 --concurrency=2`
Master: `python3 ../tools/master.py out/buscando.mp4` → `out/buscando.final.mp4`

## Archivos
| Archivo | Qué hace |
|---|---|
| `index.tsx` | `registerRoot` + `<Composition id="Buscando">` |
| `Buscando.tsx` | Capas, titulares, envolvente del glitch VHS, flash del drop |
| `timing.ts` | Grilla musical (`beat`, `bar`), frames de la historia `T`, helpers |
| `Stage.tsx` | Celular 3D + cámara. La UI "Hoy" es función pura de un *story frame* `sf`; el rebobinado corre `sf` hacia atrás (a 15 fps, efecto cinta) |
| `ui.tsx` | UI genérica de búsqueda en mapa: buscador, autocompletado, teclado, mapa con curvas de nivel y pins, resultados, fichas, pantalla de llamada, dedo |
| `Device.tsx` | Copia local del `<Phone>` del kit con borde metálico, botones, reflejo y slot para elementos fuera del clip |
| `Headline.tsx` | Titular cinético: mask reveal por palabra + "estirar" (font-stretch 72 % → 112 %), resaltador y subrayado pin; stagger configurable y corte seco (`cut`) |
| `Notifs.tsx` | Lluvia de notificaciones (intervalos 20→14→10→7→5→5→5 f) + llamada entrante protagonista |
| `Services.tsx` | Pila de tres tarjetas tipo billetera (f600/654/695) con motion blur horizontal; cada cuerpo anima su servicio: mapa con pin, feed con likes, web con botón de WhatsApp |
| `End.tsx` | Cierre: el buscador del principio se transforma en el botón de WhatsApp, pin cae sobre la cabeza del oso, número de WhatsApp, botón que respira |
| `Backgrounds.tsx` | Papel → tinta (rebobinado) → cobalto (con Lonso Lab) → papel (cortina). Sin marca de agua |
| `Fx.tsx` | Grano, viñeta, filtro SVG de glitch (RGB split + bandas, con relleno de bordes), scanlines y OSD VHS, blur direccional |
| `Sound.tsx` | Música con envolvente de ducking + todos los SFX |

## Timing por escena (frames)
| Frames | Imagen | Texto (zona A) | SFX |
|---|---|---|---|
| 0–54 | Celular 3D (rotY −14°→, rotX 7°→, push-in), buscador con "f" en f0, autocompletado de 4–5 filas + chips "Abierto ahora / Mejor valorados / Cerca" (la pantalla ya no se vacía al tipear) y teclado; tipeo 2–3 f/carácter hasta f48 | **"Alguien busca lo que vendés."** arranca en f−6: en f0 (portada) ya se lee "Alguien busca" | `typing` f0, `ui_click` f52 |
| 55–108 | Mapa: 3 pins caen con rebote en f55/68/82 (beats 4/5/6), skeleton → lista | (sigue) | `pop` f55, f68, f82 |
| 109–210 | Swipe + scroll corto (100 px: el mapa se mete bajo el buscador y "Tu ferretería" queda al pie de la lista, con las 3 competidoras arriba; abajo "No hay más resultados" + "Ampliar la búsqueda"). f150 (beat 11) la ficha gris sube desde su lugar y queda flotando sobre el mapa (y≈650–960), con tipografía de primer plano (≈44–51 px en lienzo); la lista se oscurece solo un 24 % y las competidoras (estrellas, "Abierto ahora") siguen legibles debajo. Vuelve en f200–210 | f109 **"Así te ve tu cliente."** (sale en f209) | `swipe` f105, `whoosh_fast` f146, `swipe` f202 |
| 211–272 | Dedo toca "Ferretería Central" (f218) → la pantalla "Llamando… Ferretería Central · 4,8 ★ · Abierto ahora" sube desde abajo en 4 f (f222–226, opaca: sin doble texto). Botones reales: Silencio / Teclado / Altavoz | f211 **"Y le compra a otro."** (medio beat antes del tap, stagger de 1 f: completo en f218) — "otro." recibe el golpe pin en f232 (beat 17) + shake | `ui_tap` f218, `phone_ring` f226 |
| 268–326 | Tape stop (f268, desatura), corte a tinta en f273: el titular sigue en pantalla (pasa a papel, "otro." tinta sobre naranja) y la UI corre hacia atrás hasta el buscador vacío (f316), RGB split, bandas (≤4 f, en f273/285/301), scanlines, OSD "◀◀ 00:0x". En f285, bajo el golpe de glitch, se cambia a "Rebobinemos." f316–326 tensión con cursor titilando | "Y le compra a otro." f211–284 (74 f; ≈67 f entero y legible) → f285 **"Rebobinemos."** (122 px, termina en x 951) | `riser_2s` f263→323, `tape_stop` f268, `glitch_2` f273, `glitch_1` f285, hueco real f323–326 (música −26 dB) con `whoosh_fast` f322 (pico f327) |
| 327–435 | **DROP**: fondo cobalto con topo que se traza, flash único, shake, celular entra desde el otro lado y queda frontal; en el mismo golpe un **sello con el oso** (logo solo, sin texto) se estampa en el borde derecho del celular (+8°, y 642–812, a >150 px del subrayado). En el beat siguiente (f341, con el pin naranja) "Tu ferretería" **sube del 4.º al 1.er lugar** en 12 f con motion blur vertical, cuando el shake ya terminó. f409 (beat 30) un cliente toca TU botón de llamar: dedo claro, anillo blanco de tap, el botón se hunde y vuelve (4 f). f420–424 (beat 31) sube "Llamando… **Tu ferretería** · 4,9 ★ · Abierto ahora" (avatar naranja "TF"), espejo de la llamada a la competencia | f330 **"Con Lonso Lab, te encuentran."** (única mención del nombre) | `whoosh_fast` f322, `impact_big` f327, `swipe` f339, `pop` f341, `ui_tap` f409, `phone_ring` f422 (cortado a 24 f) |
| 436–599 | Profundidad de campo: el celular (pantalla de llamada oscura) se desenfoca; lluvia de notificaciones f450/470/484/494/501/506/511/516 y "Llamada entrante · Un cliente te encontró en Google" (tarjeta tinta) en f545 (compás 10). Etiqueta "Simulación" visible | f440 **"Y te eligen."** | `notif_msg`/`notif_ding`/`pop` por notificación, `phone_ring` + `impact_short` f545 |
| 586–762 | El celular y la pila caen. **Tarjetas tipo billetera** (900 px de ancho, sangran por abajo): cada una entra desde la derecha con motion blur y tapa el cuerpo de la anterior, pero deja su cabecera (ícono + servicio + frase, 170 px) a la vista, así las tres promesas quedan juntas y legibles. El verbo se marca con caja naranja al aterrizar. Cada cuerpo muestra el servicio funcionando: **f600 Google Maps · Que te encuentren.** mapa a sangre con pins grises de la competencia, cae TU pin naranja con anillos y aparece la ficha "Tu ferretería · 4,9 ★ · Abierto ahora"; **f654 Redes · Que te elijan.** feed que sigue scrolleando, post con fachada ilustrada, doble tap (corazón), "Seguir" → "Siguiendo", contador 1.187 → 1.248 Me gusta y corazones que suben; **f695 (beat 51) Web · Que te escriban.** navegador con la web del negocio, el dedo toca "Consultá por WhatsApp", llega "Hola, ¿tienen stock?" y el negocio "está escribiendo". Movimiento secundario continuo: flotación de 3 px por tarjeta, ícono que se mece, zoom/paneo lento de mapa, foto y web. "Simulación" en cada visual | (las tarjetas: kicker 40 px + frase 68 px) | `whoosh_fast` f594/648/689 (pico en cada entrada), `pop` f607 (pin), `pop` f663 (like), `ui_tap` f719, `notif_msg` f725 |
| 754–839 | Cortina papel baja (llega en f763), las tarjetas caen; buscador blanco que se vuelve a tipear | f764 **"Tu próximo cliente ya está buscando."** entra entero de una vez; sale f834–839 (76 f en pantalla) | `whoosh_down` f757 (pico f763), `typing` f768 |
| 838–926 | El buscador se convierte en el botón naranja **"Escribinos por WhatsApp"** (barrido de izquierda a derecha, y 950), logo completo más grande (104 px de alto, y 806), el pin cae **sobre la cabeza del oso** en f846, **+54 3541 33-7818** (56 px), **lonsolab.com**. Sostén vivo: el botón respira (±1,5 %) y tiene un segundo brillo en f892 | f839 **"Auditoría gratis"** + f845 **"en 24 h hábiles."** | `pop` f846, `success_chime` f850 |

## Decisiones
- **Historia como función del tiempo**: el celular "Hoy" depende solo de `sf`, así el rebobinado es literal
  (se ve la llamada, la ficha levantada, el scroll y el tipeo deshacerse) y la cámara también rebobina.
- **Espejo narrativo**: en "Hoy" el dedo toca a la competencia y sube "Llamando… Ferretería Central"; con Lonso Lab
  el dedo toca *tu* botón de llamar (f409) y sube "Llamando… Tu ferretería" (f422); después llega "Llamada entrante"
  del lado del negocio. El cierre reutiliza el buscador del inicio y lo convierte en el CTA.
- **Servicios**: en vez de tres tarjetas planas quietas sobre cobalto vacío, una pila tipo billetera que llena el cuadro;
  cada servicio se *demuestra* (pin que cae, post que suma likes, web que recibe un WhatsApp) y nada queda quieto.
- **Marca en el drop**: el nombre aparece una sola vez (en el titular); el sello del oso sobre el celular lleva la marca
  sin repetirlo. Se quitó la marca de agua del oso (ver abajo).
- **Paleta por acto**: papel (problema) → tinta (rebobinado) → cobalto (solución, como el cierre del sitio) → papel (CTA).
  El naranja solo marca "tu negocio" y la acción (ficha, pin, sticker, subrayados, botón).
- **Contraste**: énfasis en cobalto sobre papel (no naranja, que no llega a 4,5:1); sobre cobalto el naranja va
  como subrayado o como fondo de texto tinta.
- **Audio**: música = pista de Suno del usuario ("Rise and Grind", ahora pública). Va con un `<Audio>` local
  (variación del `<Music>` del kit: mismo archivo, arranca en f0 sin fade-in para que el primer downbeat pegue,
  fade-out de 24 f) para poder hacer ducking: **hueco de aire real** en f323–326 (música a −26 dB, el riser termina
  en f323 y el `whoosh_med` de 11 f que antes lo llenaba se cambió por un `whoosh_fast` de 5 f que crece *dentro*
  del hueco con pico en f327), −2,4 dB bajo el impacto (f327–349), −2 dB bajo el timbre de f422, −3 dB bajo los
  timbres de f226/f545 y −2 dB bajo cada whoosh de tarjeta. Volúmenes de los golpes algo más bajos que la tabla
  típica (impacto 0,48, whoosh 0,42–0,5) para que `master.py` normalice sin limitador.
- **Glitch sin bordes de color**: el RGB split desplaza R y B con `feOffset`; donde el canal desplazado deja el
  borde vacío, un `feMerge` rellena con el canal sin desplazar (y las bandas desplazadas con la imagen original),
  así no aparecen franjas amarillas/cian/oliva en los bordes (medido: saturación de las 6 columnas del borde =
  la del interior en f271–328).
- Etiqueta "Simulación" en la barra de estado del celular en todas las escenas de UI y, durante la lluvia de
  notificaciones (celular desenfocado), una etiqueta propia sobre la pila.
- Negocios inventados (Ferretería Central, Corralón del Sur, Ferretería El Tornillo, Tu ferretería); sin logos
  de Google/Apple; "Google" y "Google Maps" solo como nombre de servicio. Sin precios, sin @ de Instagram.

## SFX (frame de inicio · volumen)
`typing` 0·0,42 · `ui_click` 52·0,4 · `pop` 55/68/82·0,55 · `swipe` 105·0,5 · `whoosh_fast` 146·0,32 ·
`swipe` 202·0,32 · `ui_tap` 218·0,6 · `phone_ring` 226·0,5 · `riser_2s` 263·0,38 · `tape_stop` 268·0,75 ·
`glitch_2` 273·0,3 · `glitch_1` 285·0,55 · `whoosh_fast` 322·0,42 (pico f327) · `impact_big` 327·0,48 ·
`swipe` 339·0,32 · `pop` 341·0,3 · `ui_tap` 409·0,6 · `phone_ring` 422·0,3 (24 f) · notificaciones 450 `notif_msg`,
470 `notif_ding`, 484 `pop`, 494 `notif_msg`, 501 `pop`, 506 `notif_ding`, 511 `pop`, 516 `notif_msg` (0,3–0,5) ·
`phone_ring` 545·0,42 + `impact_short` 545·0,45 · `whoosh_fast` 594/648/689·0,5 · `pop` 607·0,38 · `pop` 663·0,32 ·
`ui_tap` 719·0,45 · `notif_msg` 725·0,32 · `whoosh_down` 757·0,6 (pico f763) · `typing` 768·0,25 · `pop` 846·0,6 ·
`success_chime` 850·0,6.

## QA final
- `out/buscando.final.mp4`: 926 frames, 30,87 s, 1080×1920, 30 fps, H.264 + AAC 48 kHz.
- Loudness: **−13,9 LUFS integrados, true peak −1,7 dBTP** (master.py y qa.py coinciden), LRA 2,4 LU.
- Contact sheet: `out/buscando.final.qa/contact.jpg` (revisada entera); stills clave del master en
  `out/buscando-stills/` (f0, 96, 165, 220, 280, 327, 341, 380, 411, 430, 470, 560, 620, 680, 720, 750, 800, 860, 925).
- Sincronía verificada con RMS por frame: pops en f55/68/82, tap f218, **hueco real antes del drop**
  (f322 −19 dB → f323 −42, f324 −34, f325 −29, f326 −22 dB con el whoosh creciendo → f327 −10 dB, +32 dB de salto),
  tap f409, timbre f422, llamada f545, tarjetas f600/654/695, pin f846.
- Bordes del glitch medidos en f271–328: la saturación de las 6 columnas del borde es igual a la del interior
  (sin franjas de color).
- Legibilidad medida en stills: "Y le compra a otro." completo desde f218 hasta f284 (67 f, 74 f en pantalla);
  "Web · Que te escriban." legible f699–757 (58 f ≥ 54); "Tu próximo cliente ya está buscando." 76 f en pantalla
  (≥ 73); ficha levantada con texto de ≈44–51 px en lienzo; "Rebobinemos." termina en x 951.
- Un único flash (f327, papel 40 % → 0 en 3 f). Golpes de glitch ≤4 f, separados ≥12 f, sin destellos de luz.

## Cambios por la revisión del director (todos aplicados)
1. "Y le compra a otro." entra en f211 con stagger de 1 f, se queda (pasa a papel en el corte a tinta) y se
   cambia por "Rebobinemos." bajo el golpe de glitch de f285.
2. Sin "Con Lonso Lab" repetido: el sticker es ahora un sello con el oso (sin texto) en el borde derecho del celular.
3. Servicios rehechos (pila tipo billetera con el servicio funcionando, movimiento continuo, verbo en naranja).
4. Marca de agua del oso: **quitada** en vez de corrida. Desacuerdo con el ajuste sugerido (right −330,
   bottom −260): el oso está a la *derecha* del palo de la L, así que correrla a la derecha deja ver justamente el
   palo, no la cabeza. La versión chica (~420 px) en la esquina quedaba detrás del celular y luego tapada por las
   tarjetas a sangre, o sea, otra vez un fragmento sin contexto. La marca ya está en el sello del drop y en el logo
   del cierre; en el cierre tampoco hacía falta repetirla.
5. RGB split sin franjas en los bordes (relleno con `feMerge`, ver Decisiones).
6. Drop escalonado: sello en f327, titular en f330, subida a 1.º en f341 con el pin y motion blur.
7. Tap final visible + "Llamando… Tu ferretería" en el beat siguiente.
8. Scroll corto, ficha levantada sobre el mapa, competidoras visibles, atenuado del 24 %.
9. Texto de la ficha levantada ≥ 44 px (tipografía propia del primer plano, foto vacía a la izquierda de x 880).
10. Tarjeta 03 en el beat 51; cierre "Tu próximo cliente…" entero de una vez, sale en f834.
11. Pantalla de llamada con íconos reales y rótulos, entra deslizando en 4 f (sin fundido de dos textos).
12. Ícono de "Sin fotos": foto tachada.
13. Cierre: logo 104 px, pin sobre la cabeza del oso, número de WhatsApp, botón que respira y segundo brillo.
14. Hueco de aire real antes del drop (medido arriba).
15. Frame 0 con titular y autocompletado que no se vacía.
16. "Rebobinemos." a 122 px.

## Problemas abiertos / desvíos conscientes
- **Riser**: el brief pide `riser_2s` f267→327; va f263→323 para dejar el hueco de aire de 4 f antes del drop
  (técnica de `creative-research.md` §3.10). El pico del whoosh sí cae en f327.
- **Tarjeta 03 en f695** (beat 51) en vez de f709 (compás 13) del brief, para que se lea ≥ 54 f antes de la cortina,
  que está fija en el cue f763.
- **Texto de UI dentro del celular**: a escala 0,84 queda en ~24–34 px de lienzo (bajo el mínimo de 44 px). Es UI
  simulada; la información clave se repite en titulares o se ve ampliada (ficha levantada ≈44–51 px, notificaciones
  40/35 px). Lo mismo para los detalles chicos de las tarjetas de servicio (contador de likes, horarios, etc.):
  son imagen ilustrativa; el texto que hay que leer es la cabecera de cada tarjeta (40 + 68 px) y la ficha del mapa
  (44 px). "Simulación" mide ~26 px, como pide el brief.
- La ficha levantada (f150–204, y≈650–960) asoma hasta x≈920 por debajo de y 840 solo con su borde/fondo; el texto
  y la foto vacía quedan a la izquierda de x 880. Con el rebote del resorte puede pasar ~2 f algo más abajo.
- La pila de notificaciones y los cuerpos de las tarjetas de servicio bajan por debajo de y 1240 (zona de imagen).
- Las citas de reseñas, los números de la ficha (4,9 ★, 96 reseñas) y el contador de "Me gusta" son de un negocio
  inventado dentro de una simulación rotulada; no son datos reales.
- El cierre dura ~2,9 s desde que entra (f839) y queda quieto-vivo desde ~f862 (≈2,1 s de sostén, con respiración).
