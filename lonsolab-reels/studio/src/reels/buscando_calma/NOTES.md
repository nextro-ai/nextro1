# Reel 1b · `buscando_calma` — "Te están buscando", versión pausada + paletas (Composition `BuscandoCalma`)

1080×1920 · 30 fps · 1199 frames (40 s) · música `MUSIC.buscando_calma` ("Rise and Grind", 132,1 BPM,
beat 13,626 f, compás 54,5 f). Todos los tiempos salen de `beat(n)` / `bar(n)` en `timing.ts` (grilla flotante,
sin acumular redondeos). Los cambios de escena caen en compases.

```
npx remotion render src/reels/buscando_calma/index.tsx BuscandoCalma out/buscando_calma-<tema>.mp4 --props='{"theme":"<tema>"}' --concurrency=3
python3 ../tools/master.py out/buscando_calma-<tema>.mp4          # → out/buscando_calma-<tema>.final.mp4
python3 ../tools/jitter_scan.py out/buscando_calma-<tema>.final.mp4
python3 src/reels/buscando_calma/comparacion.py                  # → out/buscando_calma-comparacion.jpg (4 paletas × 6 momentos)
node src/reels/buscando_calma/stills.mjs --themes=web,marino 330 706 1050   # stills sueltos → out/bc-stills/
```
Temas: `web` (default), `mono`, `bosque`, `marino`. `--props='{"theme":"web","safe":true}'` dibuja las zonas seguras
encima (solo para revisar).

## Qué cambió respecto de `buscando`
- **Ritmo**: 8 placas de titular, cada una ≥ 3,2 s en pantalla (antes 1,6–2,5 s); una idea por pantalla; como máximo
  titular + un elemento foco. Nunca hay dos capas de texto superpuestas en una transición (se verificó cuadro a cuadro
  en cada corte: el texto que sale termina antes de que entre el siguiente).
- **Texto grande**: titulares 100–124 px; todo lo que hay que leer dentro de la UI ≥ 44 px reales en pantalla. El
  celular se dibuja a escala 1:1 (840 px de ancho, x 120–960) con tipografía de UI de 44–66 px, y menos ítems:
  2 competidores + "Tu negocio" (antes 3 + 1, con metadatos de 29 px).
- **Menos movimiento**: sin rotación 3D (solo una inclinación de 5° que se endereza en los primeros 5 s), sin glitch,
  sin franjas, sin VHS, sin flash. El único golpe es el drop (f545): sacudida de 7 f, 6 px, solo sobre el celular.
  El rebobinado es un retroceso limpio: la llamada baja, los resultados se van en orden inverso, vuelve el teclado,
  con un ◀◀ fijo sobre "Rebobinemos.".
- **Foco por spotlight**: "Tu negocio" se levanta sobre el celular atenuado (f164) y la ficha completa queda sola
  con el resto oscurecido (f600); en las notificaciones, las anteriores se aclaran cuando llega la nueva.
- **Color con disciplina** (ver Temas): campo `dark` solo del drop a los servicios (f545–980); `accent` solo en
  "otro.", el subrayado de "primero.", todo lo que es "tu negocio" con Lonso Lab (borde de la ficha, botón de llamar,
  pin) y el CTA. Nunca `accent` como superficie grande sobre `dark`.
- Servicios: de la pila tipo billetera animada a una lista simple de tres filas (ícono + nombre + verbo).

## Timing por escena (frames)
| Frames | Imagen | Texto en pantalla |
|---|---|---|
| 0–163 | Celular casi frontal (5° → 0°). f8–71 se tipea "ferretería cerca de mí" (1 car./3 f), f82 "Buscar", baja el teclado; f109/123/136 entran Ferretería Central, Corralón del Sur y **Tu negocio** (gris, foto vacía, barras grises en vez de datos) + pins en el mapa | **"Alguien busca / lo que vendés."** ya armado en f0 (portada) hasta f163 |
| 164–272 | f168 "Tu negocio" se levanta (x 110–970, y 876–1212) y el celular se atenúa; **una alerta por beat**: f177 "Sin fotos", f191 "Horario no disponible", f204 "Reseñas sin responder" (46 px, `warn`, 10 f de entrada) | **"Así te encuentra / hoy:"** |
| 273–381 | f273 se van las alertas, f277–291 la ficha vuelve a su lugar; el dedo toca "Ferretería Central" (f300), la pantalla "Llamando… Ferretería Central" sube en 12 f (f302–314) | **"Y le compra / a otro."** — "otro." recibe la caja `accent` en f313 |
| 382–490 | f382 ◀◀ + retroceso limpio de la UI (llamada f384–398, resultados f398–420, teclado f412–426); campo `bg2`; el buscador queda tipeado con el cursor titilando | **"Rebobinemos."** (f385–490) |
| 491–544 | Compás de tensión (cue f491): la música baja, el celular se acerca 2,5 %; f531 se vuelve a tocar "Buscar" | **"Ahora, / con Lonso Lab:"** |
| 545–599 | **DROP**: corte a `dark`, impacto, sacudida 7 f; misma búsqueda con **Tu negocio primero**, ficha completa (4,9 ★, Abierto ahora, Reseñas respondidas, 3 fotos); f559/572 entran los competidores debajo, f586 tu pin | "Ahora, con Lonso Lab:" sigue (pasa a `onDark` en el corte) hasta f599 |
| 600–708 | Spotlight: todo lo demás se oscurece, la ficha queda sola con un halo `accent` | **"Te encuentran / primero."** (subrayado `accent`) |
| 709–871 | el celular sale **dentro** de la salida del titular anterior (f699–707, `EASE.in` + 50 px hacia abajo): f708 es campo limpio; notificaciones grandes que quedan apiladas: f709 Llamada entrante · f749 Nueva reseña ★★★★★ · f790 Pidieron cómo llegar (54 px); "Simulación" sobre la pila | **"Y te eligen."** |
| 872–980 | Lista que se arma **una fila por beat** (f872/886/899, fundido de 10 f con 10 px de desplazamiento): **Google Maps** · que te encuentren / **Redes** · que te elijan / **Web** · que te escriban (92 + 60 px); completa desde ~f907 y **quieta** hasta f973; sale f973–981 | (la lista es el texto) |
| 981–1098 | f977–991 vuelve `bg` (con el whoosh); buscador grande: **ferretería** (la misma búsqueda del principio) se queda quieta mientras se lee el titular, después dos rubros, uno por beat: peluquería (1008) → veterinaria (1022) → **lo que vendés** (1036, caja `accent`) cerca de mí, quieto hasta f1104 | **"Tu próximo / cliente ya / está buscando."** entra **como un solo bloque** (fundido + 24 px en 10 f, sin escalonado por palabra) f981–991, quieto hasta f1089, sale f1089–1098 |
| 1099–1199 | f1099–1103 solo queda el buscador; f1104–1120 sube y se convierte en el botón `accent` **"Auditoría gratis"** (texto f1109–1119); logo f1104–1118 (ya sin titular encima); "en 24 h hábiles" f1117; "WhatsApp +54 3541 33-7818" f1131 y "lonsolab.com" f1134 llegan como un grupo; placa completa quieta desde ~f1140 (≈ 2 s) | — |

### Reglas de lectura (0,6 s + 0,4 s/palabra, mín. 2 s; titular ≥ 75 f)
"En pantalla" = desde que aparece la primera palabra hasta que empieza la salida (9 f de fundido). "Armado" = desde que
la última palabra terminó de subir.

| Placa | Palabras | Necesita | En pantalla | Armado | Total visible |
|---|---|---|---|---|---|
| Alguien busca lo que vendés. | 5 | 78 f | 154 f (f0–154) | 154 f | 164 f |
| Así te encuentra hoy: | 4 | 75 f | 99 f | 77 f | 109 f |
| Y le compra a otro. | 5 | 78 f | 99 f | 76 f | 109 f |
| Rebobinemos. | 1 | 75 f | 96 f | 80 f | 106 f (+ ◀◀ desde f382) |
| Ahora, con Lonso Lab: | 4 | 75 f | 99 f | 73 f | 109 f |
| Te encuentran primero. | 3 | 75 f | 99 f | 79 f | 109 f |
| Y te eligen. | 3 | 75 f | 153 f | 131 f | 163 f |
| Tu próximo cliente ya está buscando. | 6 | 90 f | 108 f (f981–1089) | **98 f** (f991–1089) | 117 f |

Elementos foco (cada línea ≤ 4 palabras → 60–66 f; "en pantalla" hasta que empieza su salida): alertas de la ficha
96/82/69 f en pantalla, quietas ~87/73/60 f · "Llamando… Ferretería Central" 70 f · ficha completa 163 f ·
notificaciones 151/111/70 f · filas de servicios 101/87/74 f en pantalla, quietas 98/84/71 f · "lo que vendés cerca
de mí" 68 f en pantalla, quieto 63 f (f1042–1104) · "Auditoría gratis" ~90 f · lonsolab.com 65 f · placa final
completa y quieta f1138–1198 = 61 f (2,0 s).

**Medición sobre píxeles** del `buscando_calma-web.final.mp4` (máscara de texto: diferencia media < 6/255 contra un
cuadro de referencia, solo en los píxeles que son texto): titular final quieto **f987–1090 = 104 f** (necesita 90;
antes 67) · "lo que vendés" f1042–1104 = 63 f (necesita 60; antes 53) · 3.ª fila de servicios f903–973 = 71 f
(necesita 66; antes 57) · placa final f1138–1198. Alertas (cuadro a cuadro, porque el celular sigue con su empuje
lento de 2 %): aparecen f178/192/205 y se asientan en ~f186/200/213; la 3.ª queda quieta 60 f antes de salir en f273.

## Temas (ThemeProvider)
- `theme.tsx`: `ThemeProvider` (React context) recibe `inputProps.theme` (validado con zod: `web|mono|bosque|marino`);
  `useTheme()` en cada componente; `alpha(hex, a)` y `mix(a, b, t)` derivan tintes, sombras y atenuados **de los roles**.
- Roles usados: `bg` (campo del problema y del cierre), `bg2` (campo del rebobinado, barra de búsqueda), `surface`
  (pantallas, tarjetas, botón de búsqueda), `ink`/`ink2` (texto, cuerpo del celular, pantalla de llamada, sombras y
  spotlight con alfa), `line` (bordes, estrellas vacías, barras de "sin datos"), `dark`/`onDark`/`onDark2` (campo del
  giro y su texto), `accent`/`onAccent` (otro., "lo que vendés", ficha de Tu negocio, CTA), `accentSoft` (no hizo
  falta), `topo` (curvas de nivel del fondo y del mapa), `map`/`mapRoad`, `ok` (Abierto ahora, Reseñas respondidas,
  llamada entrante), `warn` (alertas, cortar llamada), `star`.
- Logo: `<Logo kind="full" color={t.ink} />`.
- `grep -nE "#[0-9a-fA-F]{3,8}"` y `grep -nE "rgba?\("` en la carpeta: solo quedan en `theme.tsx` — las dos
  constantes neutras `WHITE`/`BLACK` y las plantillas de `alpha()`/`mix()`. Usos de los neutros: brillo y sombra del
  cuerpo metálico del celular (mezclados con `ink`), la isla de la cámara (negro de hardware), el borde blanco del
  indicador de toque y la base de la pantalla de llamada. Ningún color de marca suelto, ningún `C.*`.
- Contraste (WCAG) calculado para los 4 temas: todas las combinaciones de texto ≥ 4,5:1 (mínimo 4,87 `ink2` sobre
  `bg2` en bosque, después 4,99 `ok` sobre `surface` en bosque; notificaciones atenuadas ≥ 5,2).
- **Borde para acentos claros** (`accentEdge()` en `theme.tsx`): si `accent` sobre `surface` no llega a 3:1 (contraste
  no textual), las formas de acento sobre superficies claras (borde de la ficha "Tu negocio", botón de llamar, pin
  propio, botón "Auditoría gratis") llevan un filo de 2–3 px de `mix(accent, ink, 0,35)`. Lo decide el contraste, no
  el nombre del tema: aplica a `marino` (amarillo, 1,57:1 → filo 3,3:1) y `bosque` (miel, 2,13:1 → filo 4,0:1);
  `web` y `mono` (naranja, 3,11:1) quedan exactamente igual que antes.

### Acento por paleta (dato para elegir colores de la web)
| Paleta | acento / `surface` | acento / `bg` | acento / `dark` | texto sobre acento |
|---|---|---|---|---|
| A · Web ordenada | 3,11 | 2,82 | **2,41** (naranja sobre cobalto: vibra) | 5,65 |
| B · Blanco y negro + naranja | 3,11 | 2,83 | 6,06 | 6,06 |
| C · Bosque y miel | 2,13 (+ filo) | 1,90 (+ filo) | 5,63 | 6,91 |
| D · Marino + amarillo | 1,57 (+ filo) | 1,44 (+ filo) | 10,92 | 10,92 |

En `web` el subrayado naranja de "primero." sobre el campo cobalto (f600–708) queda a 2,41:1 y "vibra": es el mismo
choque cobalto + naranja que la clienta describió como confuso en la web. No se corrigió en el video a propósito
(es justamente lo que tiene que ver para decidir); en las otras tres paletas el acento sobre `dark` es limpio.

## SFX (frame · volumen) — uno por evento, nada apilado
`typing` 8·0,24 (46 f) + 52·0,2 (22 f) · `ui_click` 82·0,35 · `pop` 109/123/136·0,4 · `swipe` 168·0,26 ·
`swipe` 277·0,18 · `ui_tap` 300·0,5 · `phone_ring` 312·0,3 (44 f, música −2 dB debajo) · `whoosh_long` 382·0,24 (◀◀) ·
`ui_click` 531·0,3 · `whoosh_fast` 539·0,3 (pico f545) · `impact_big` 545·0,5 (única sacudida) · `pop` 559/572·0,28,
586·0,22 · `pop` 709/749/790·0,5 (uno por notificación) · `swipe` 870/884/897·0,22 · `whoosh_down` 977·0,36 (el campo vuelve a `bg` con él) ·
`tick` 1008/1022·0,3 · `pop` 1036·0,38 · `whoosh_fast` 1100·0,24 (entra al morph de f1104) · `success_chime` 1114·0,5
(cuando aterriza "Auditoría gratis"; se sacó el `pop` del botón para no apilar dos sonidos en 4 f).

## Desvíos conscientes del brief
1. **"Rebobinemos." en el compás 7 (f382) y no en f440.** La tabla del brief deja "Rebobinemos." 440–490 (51 f) y
   "Ahora, con Lonso Lab:" 491–544 (54 f): las dos quedan por debajo de su propia regla (≥ 75 f). Se adelantó el
   rebobinado un compás ("Y le compra a otro." queda 273–381, 109 f) y "Ahora, con Lonso Lab:" entra en el cue de
   tensión f491 y **cruza el drop** hasta f599: se lee en el compás tranquilo y el campo gira debajo. Por eso
   "Te encuentran primero." va 600–708 (no 548–708).
2. **Notificaciones cada 3 beats (f709/749/790)** y no una por compás (709/763/818): con f818 la tercera tenía
   46–54 f antes del corte a servicios (necesita 60).
3. **Filas de servicios en f872/886/899** (una por beat) y no 872/900/927: con f927 la tercera fila tenía 53 f
   (necesita 66). La lista se arma rápido y después se queda quieta entera ~2,2 s (se lee como una sola idea).
4. En la lista de "Hoy", "Tu negocio" muestra **barras grises** en lugar del texto "Sin fotos · Sin horario": ese
   renglón caía en y 1258–1306, fuera de la zona segura; las tres alertas se leen enseguida, grandes, en el spotlight.
5. Cierre: el logo (y 462) y el botón (y 684–834) van en la zona A, y "en 24 h hábiles", WhatsApp y web en la zona B,
   con la columna centrada en x 520 (todo lo que está bajo y 840 termina antes de x 880). La regla general pide
   logo + CTA en y 900–1240, pero con cinco elementos no entran a ≥ 44 px; se priorizó el tamaño.

## Entregables (render de la revisión 2)
| Paleta | Archivo | Duración | Loudness | True peak | jitter_scan |
|---|---|---|---|---|---|
| A · Web ordenada | `out/buscando_calma-web.final.mp4` | 39,98 s (1199 f) | −14,0 LUFS | −1,0 dBTP | sin sacudidas sostenidas |
| B · Blanco y negro + naranja | `out/buscando_calma-mono.final.mp4` | 39,98 s (1199 f) | −14,0 LUFS | −1,0 dBTP | sin sacudidas sostenidas |
| C · Bosque y miel | `out/buscando_calma-bosque.final.mp4` | 39,98 s (1199 f) | −14,0 LUFS | −1,0 dBTP | sin sacudidas sostenidas |
| D · Marino + amarillo | `out/buscando_calma-marino.final.mp4` | 39,98 s (1199 f) | −14,0 LUFS | −1,0 dBTP | sin sacudidas sostenidas |

Hoja comparativa: `out/buscando_calma-comparacion.jpg` (1736×2464): 4 filas (una por paleta, con `THEMES[t].name` y
muestras de fondo / texto / campo / acento en la banda) × 6 momentos iguales: gancho f150, "Así te encuentra hoy"
f232, drop "con Lonso Lab" f590, notificaciones f840, servicios f945, CTA f1170 (cada miniatura 270×480, sacada del
`.final.mp4`). Se regenera con `python3 src/reels/buscando_calma/comparacion.py`.

## Revisión 2 (director creativo, 8,1 → cambios)
1. **[mayor] Cierre demasiado denso (f981–1096).** El titular final entra como **un solo bloque** desde f981 (antes
   palabra por palabra desde f987, ~30 f para armarse) y sale en f1098 (antes f1089): quieto f991–1089 = 98 f (necesita
   90; antes 67). El buscador deja "ferretería" quieta hasta f1008 (el titular ya se asentó), pasa solo por
   **dos** rubros (se sacó "gimnasio"), "lo que vendés" llega en f1036 y queda quieto hasta f1104 (60 f; antes 53).
   El morph al CTA arranca en f1104 (antes f1096) y el logo también (antes f1098, cuando el titular todavía estaba
   saliendo): nunca se superponen. Para que "en 24 h hábiles" no aparezca debajo del botón que todavía se mueve, las
   líneas de contacto pasaron a f1117 / f1131 / f1134 (WhatsApp y web llegan como un grupo). Placa completa quieta
   desde ~f1140 ≈ 2 s (regla 1,5–2,5 s). El campo vuelve a `bg` con el whoosh (f977–991) para que el titular
   aparezca sobre fondo claro.
2. **[menor] Servicios.** Una fila por beat (872/886/899) con fundido corto de 10 f y solo 10 px de desplazamiento; la
   lista sale f973–981, antes de que entre el titular (sin dos capas de texto a la vez). La 3.ª fila queda quieta 66 f
   (antes 57).
3. **[menor] Fundido sucio f697–711.** El celular sale en f699–707 con `EASE.in` + 50 px, dentro de la salida del
   titular; f708 ya es campo limpio y "Y te eligen." abre sobre fondo vacío.
4. **[menor] "aotro."** La caja de "otro." sobresale 0,05 em a la izquierda (antes 0,1 em) y la palabra marcada tiene
   0,1 em más de aire: se ve claramente "a otro.".
5. **[menor] Alertas en ráfaga.** Una por beat: f177/191/204 (antes 174/178/182); cada una ≥ 69 f en pantalla.
6. **[menor] Solo `web` renderizado.** Se renderizaron y masterizaron las 4 paletas (una tras otra, 3 hilos) y se armó
   `out/buscando_calma-comparacion.jpg` (4 filas × 6 momentos, 270×480 cada uno, nombre de la paleta y muestras de
   color en la banda de cada fila).
7. **[menor, opcional] Contraste no textual del acento.** Aplicado con `accentEdge()` (ver Temas). El choque del
   subrayado en `web` queda documentado arriba para la conversación con la clienta.

Sin desacuerdos con la revisión. Única diferencia con lo sugerido: el morph empieza en `T.end + 14` (f1104) y no en
`T.end + 12`, porque con f1102 "lo que vendés" quedaba quieto 58 f (se asienta en ~f1044), dos menos que el mínimo.

## Problemas abiertos
- En `bosque`, `star` = `accent` (miel): las estrellas y el botón de llamar comparten color; se lee bien, pero la
  estrella deja de ser un color "funcional" distinto.
- "Simulación" mide 28 px (etiqueta chica pedida por las reglas, no es texto a leer).
- Debajo de y 1240 hay solo imagen: teclado, mapa con pins, botones de la llamada y, en la pantalla "con Lonso Lab",
  los competidores (y ≈ 1330–1600), que en f600 se atenúan; no llevan información nueva.
- Negocios inventados; "Google Maps" solo como nombre del servicio; sin logos de terceros; sin precios ni @.
