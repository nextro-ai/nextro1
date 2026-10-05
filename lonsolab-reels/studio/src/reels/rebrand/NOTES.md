# Rebrand — "¿Tu marca está hibernando?" (Composition `Rebrand`)

Antes → después de identidad con una marca ficticia, **Panadería La Espiga**, con la etiqueta permanente
"Ejemplo ilustrativo" (arriba a la derecha, 26 px, de f0 a f859; atenuada al 55 % mientras solo está el oso, f328–f386). Frío y lento hasta el bloom; cálido, con
pulso y cortes en beat después. Cierre de Lonso Lab con iris de papel (rima con el disco de vidrio del hook).

- Entrada: `src/reels/rebrand/index.tsx` (1080×1920, 30 fps, 939 f = `MUSIC.rebrand.duration_frames`).
- Render: `npx remotion render src/reels/rebrand/index.tsx Rebrand out/rebrand.mp4 --concurrency=2 --bundle-cache=false`
  (`--bundle-cache=false` evita un choque con el caché de webpack que comparte el otro agente: la primera vez falló
  con `ENOTEMPTY ... node_modules/.cache/webpack`).
- Master: `python3 ../tools/master.py out/rebrand.mp4` → `out/rebrand.final.mp4`.
- Stills: `node src/reels/rebrand/stills.mjs 0 78 156 …` → `out/rebrand-stills/` (`OUT=out/otra-carpeta` para no pisar).

## Archivos
| Archivo | Qué hace |
|---|---|
| `Rebrand.tsx` | Composición: fondo hielo → noche → tablero cálido, capas, escarcha, nieve, etiqueta, grano |
| `timing.ts` | Grilla de beats `B(n) = round(n × 19,5228)` y mapa de escenas `T` |
| `Cold.tsx` + `Sign.tsx` | Escenas 1–3: disco de vidrio esmerilado → iris al cartel viejo → la cámara se aleja al avatar de perfil + lupa pixelada |
| `Night.tsx` | Escenas 4–5: oscuridad, oso de Lonso Lab tenue, "creció." se estira (wdth 62→125), grietas que brillan |
| `Bloom.tsx` | f469: el hielo se parte en 104 esquirlas (la misma red de grietas), el logo viejo se desarma, un solo flash cálido |
| `Brand.tsx` | 01 Logo (construcción sobre grilla), 02 Paleta (4 chips en beats), 03 Tipografía ("Aa" con peso variable) |
| `Apps.tsx` + `AppArt.tsx` | 04 Aplicaciones (cartel, bolsa, perfil, web + pin; una por beat) → tablero 3×2 + "Despertamos tu marca." |
| `End.tsx` | Cierre Lonso Lab |
| `OldLogo.tsx` / `NewLogo.tsx` | Logo viejo (genérico, Lobster + degradés + sombra + cinta) y logo nuevo (símbolo geométrico + wordmark Fraunces) |
| `Atmos.tsx` | Nieve determinista (con ráfaga en f78), motas cálidas, chispas del bloom, escarcha de bordes, grano |
| `Sound.tsx` | Música (con +3 dB en el hook y ducking corto y suave bajo cada golpe) + SFX |
| `gen_assets.py` | Genera texturas de escarcha, grano, geometría de esquirlas/grietas (`shatter.ts`) y los SFX propios (`ice_crack_v2`, `ice_shatter`, `glass_ting`, `cold_air`) |
| `assets-entry.tsx` | Entrada solo de desarrollo para rasterizar el avatar viejo (`public/rebrand/old_avatar_tiny.png`, 30 px) |

Assets propios en `public/rebrand/` (no toqué `public/` de la marca ni `src/brand/`): fuentes **Fraunces** (variable,
OFL) para la marca nueva y **Lobster** (OFL) para la vieja; `frost_edges.png`, `frost_disc.png`, `grain.png`,
`old_avatar_tiny.png`, `sfx/ice_crack.wav`, `sfx/ice_shatter.wav`, `sfx/glass_ting.wav`, `sfx/cold_air.wav`
(sintetizados con numpy, sin licencia de terceros).

## Timing por escena (frames, 30 fps)
Grilla medida: beat = 19,5228 f. Los frames del brief (157, 235, 314, 393, 471…) quedan ~2 f tarde respecto de la
grilla: el transitorio del bloom en la música arranca en f468 y pica en f469, así que todos los cortes usan `B(n)`.

| Frames | Beat | Escena | Texto en pantalla |
|---|---|---|---|
| 0–155 | 0–8 | Hook: disco de vidrio esmerilado de 680 px (algo más abajo, llena la mitad inferior) con el logo viejo congelado; push-in lento desde f0 (1,00 → 1,06 en f78) y más fuerte en **f78** (primer acorde lleno); la escarcha cruza "hibernando?" de izquierda a derecha desde f1 y cristaliza en f78; ráfaga de nieve | **¿Tu marca está / hibernando?** (nítido desde f0, sale f134–148) |
| 146–233 | 8–12 | Iris (f146–168): el disco se abre al cartel gastado (marco de madera, óxido, nieve arriba, carámbanos) | **El mismo logo / desde siempre.** (entra con el iris, f148/f151; sale f224–234) |
| 230–311 | 12–16 | La cámara se aleja: UN clip circular que se contrae (radio en pantalla 1365 → 330 en f237 → 58 en f246) con sombra suave; la pared del cartel sangra fuera del cuadro, así que nunca aparece un borde recto. El avatar (116 px) pasa a ser el ráster real de 30 px agrandado (papilla ilegible); lupa con el mismo ráster pixelado | **No se lee** / en el circulito de Instagram. (las dos líneas juntas en f235, nítidas ≈ f239, se sostienen hasta f324: ver QA) |
| 312–389 | 16–20 | Parte B: la noche sube desde abajo (el perfil se oscurece primero; la franja del titular sigue clara hasta ≈ f324), oso de Lonso Lab al 13 % (se va del todo en f392); en **f351** "creció." se estira de wdth 62 a 125 | **Tu negocio / creció.** (f330 / f335) |
| 390–468 | 20–24 | El logo viejo vuelve congelado; grietas cálidas que aceleran desde el centro, con una zona libre difuminada (≈ 60 px) detrás del titular: recién en f466–468 las grietas cruzan las letras; luz cálida detrás | **Es hora de / despertarla.** |
| **469** | 24 | **BLOOM**: el quiebre ya se ve en f469: esquirlas ~20 f, piezas del logo viejo nítidas encima; flash de luz aditiva (screen, núcleo #FFF1C9 → #F2A516) que pica en f469 y cae en 10 f, más el mismo estallido visto entre las esquirlas; chispas; el fondo pasa a crema | — |
| 469–546 | 24–28 | 01 Logo: grilla, círculos de construcción, nodos; granos que entran con rebote; **f508** snap: se va la construcción, entra el wordmark, barrido especular en el símbolo. f535–548: el wordmark sube y se va mientras el símbolo vuela y se achica hasta su lugar en el chip Trigo (elemento compartido) | 01 — Logo |
| 543–624 | 28–32 | 02 Paleta: Trigo se abre como círculo alrededor del símbolo que aterriza (f543–556), Horno f566, Crema f586, Carbón f605 | 02 — Paleta + nombres/hex |
| 625–702 | 32–36 | El bloque Carbón crece a pantalla completa → "Aa" Fraunces (peso 200→760→560), Fraunces/Archivo, alfabeto | 03 — Tipografía |
| 703–780 | 36–40 | Cartas que aterrizan en beat: cartel f703, bolsa f722, perfil f742, web + pin f761 | 04 — Aplicaciones |
| 775–858 | 40–44 | Las cartas vuelan al tablero 3×2 (f775–795; la franja del titular queda limpia ≈ f790). El tablero no se congela: push-in continuo 1,00 → 1,035, parallax de ±6 px por tile y barrido especular en f820 y f839 (columnas escalonadas 2 f). La carta de perfil se encaja entera (avatar y pills con ≈ 24 px de aire) | **Despertamos / tu marca.** · Rebranding · Identidad · Aplicaciones (56 px) |
| 859–938 | 44–48 | Iris de papel (f859–872) desde el centro del tablero, topo cobalto con deriva visible, logo Lonso Lab, botón WhatsApp que "respira" 2 % en f898 y f918 | **Contanos / de tu marca.** · WhatsApp +54 3541 33-7818 · lonsolab.com |

## SFX
| Frame (inicio) | SFX | Vol. | Nota |
|---|---|---|---|
| 0 | cold_air (propio) | 0,2 | colchón de aire frío bajo el hook (f0–96) |
| 0 / 39 | glass_ting (propio, Mi♭6 + Si♭6) | 0,2 / 0,12 | vidrio en f0 y en el beat 2 (la escarcha cruza la palabra) |
| 0 | whoosh_long | 0,18 | aire frío de entrada |
| 147 | whoosh_med | 0,22 | pico ≈ f158, iris |
| 230 / 234 | whoosh_fast / tick | 0,2 / 0,9 | la cámara se aleja al avatar |
| 256 | pop | 0,25 | entra la lupa |
| 308 | whoosh_down | 0,16 | splice a la parte B |
| 349 | swipe | 0,25 | "creció." se estira (f351) |
| 398, 424, 447, 459 | ice_crack (propio, v2) | 0,21–0,35 | cada empujón de las grietas (−3 dB vs. la 1.ª versión, con golpe grave filtrado) |
| 409 | riser_2s | 0,22 | termina en f469 |
| 446 | whoosh_long | 0,2 | pico en f469 |
| 469 | boom_sub + ice_shatter (propio) | 0,18 / 0,16 | el golpe de la música manda; estos suman cuerpo y vidrio |
| 508 | snap | 0,42 | el logo traba |
| 536 / 614 / 697 / 773 | whoosh_med / whoosh_med / whoosh_fast / whoosh_med | 0,22–0,25 | transiciones de sección |
| 547, 566, 586, 605 | pop | 0,36 | un chip por beat |
| 698, 717, 737, 756 | swipe | 0,42 | pico ~2 f antes de que aterrice cada carta |
| 859 | success_chime | 0,42 | cierre |

Música: base `music/rebrand.wav` ("Cold to Warm", pista de Suno del usuario; el usuario avisó que las canciones ya están
públicas). 0,9, fade-in 2 f, fade-out 20 f. **Hook**: la base está ~17 dB por debajo del cuerpo en f0–78, así que sube
+3 dB (×1,41) y vuelve a 1 en f60–76, antes del acorde de f78; con el aire y el ting el hook queda en ≈ −20/−21 LUFS
momentáneos crudos (antes −24 a −39), todavía por debajo del cuerpo (−13) para que el frío → cálido se sienta.
**Ducking**: ×0,8 (≈ −1,9 dB) bajo cada golpe (bloom, snap, chips, tipografía, cartas, grilla, cierre), sin pre-ataque
(la caída empieza en el frame del golpe, que la enmascara) y recuperación en 8–10 f (≈ 0,2 dB por frame): sin bombeo ni
escalones audibles. Los niveles salen de una simulación offline de la mezcla y de un render solo de audio
(`--codec=wav`) medido con ebur128.

## Decisiones
- **Marca nueva**: símbolo de espiga hecho solo con lentes (cada grano = intersección de dos círculos de r 58,4) —
  eso es lo que se dibuja en la construcción. Wordmark en Fraunces (opsz 144, wght 560, SOFT 100), descriptor
  PANADERÍA en Archivo wdth 125 espaciado. Paleta Trigo #E9C46A, Horno #C8553D, Crema #F6EFE4, Carbón #1F1B16.
  Los textos en acento sobre fondo claro usan un horno más hondo (#A8432F) para pasar 4,5:1.
- **Marca vieja**: óvalo con borde "cosido", espigas clip-art con degradé, Lobster con contorno y sombra, cinta.
  Genérica, no ridícula.
- **El copy del reel queda en Archivo** (voz de Lonso Lab); Fraunces solo vive dentro de la marca de La Espiga.
- Sin precios, sin cifras, sin @ inventados; el perfil y la web son UI genérica (sin logos de plataformas).
- "creció." usa la firma de la marca: stretch de `font-stretch` 62 → 125 con rebote.
- Un solo flash (f469, luz aditiva que cae en 10 f): muy por debajo de 3 flashes/s.
- Titulares de la mitad fría y del tablero arrancan en y 384 (≥ 36 px de aire bajo la pastilla "Ejemplo ilustrativo",
  que termina en y ≈ 344). Rótulos de sección a 54 px; subtítulo del tablero a 56 px (wdth 90 para entrar en 900 px).

## QA (último render, pasada de revisión)
- `qa.py`: 31,32 s · 1080×1920 · 30 fps · 939 frames · audio presente · **−14,2 LUFS · true peak −1,9 dBFS**
  (mezcla cruda −15,5 LUFS / −3,2 dBTP → master lineal).
- Legibilidad medida en el video final (diferencia media de la caja de texto contra un frame nítido de referencia,
  umbral 2/255; para el cartel, solo píxeles de las letras porque la pared sigue haciendo push-in detrás):
  - "El mismo logo / desde siempre." (5 palabras, pide 63 f): **f162–f225 = 64 f**.
  - "No se lee / en el circulito de Instagram." (7 palabras, pide 82 f): **f240–f324 = 85 f** (antes 74 f).
  - "Despertamos / tu marca." + "Rebranding · Identidad · Aplicaciones" (6 palabras, pide 73 f): **f792–f864 = 73 f**
    (antes ≈ 62 f). Justo en el límite: si se toca el vuelo de las cartas o el iris, volver a medir.
- Holds: diferencia media frame a frame del tablero (f806–859) 1,03 y del cierre (f883–938) 0,53 (antes ≈ 0,08 en ambos).
- CTA: la pastilla mide 676 px (x 202–877) y el número termina en x 844; cero píxeles de contenido a la derecha de x 880
  debajo de y 840 en el cierre.
- Saltos de luminancia por frame (> 20/255): f469 (el bloom, único flash), f326 (la noche termina de subir: oscurece
  una sola vez), f624–627 y f695–698 (el panel carbón que entra y sale como cortina). Ningún tramo con más de 3 flashes/s.
- Bugs de pasadas anteriores (siguen corregidos): fondo de Tipografía tapando el crecimiento del chip Carbón; tarjetas
  de Aplicaciones por encima del iris final (`isolation`); esquirlas de 4 f; escarcha de bordes como "piel"; oso a 1500 px.

## Revisión del director creativo (7,5 → correcciones aplicadas)
| # | Issue | Qué hice |
|---|---|---|
| major | "No se lee…" legible solo 74 f | Las dos líneas entran juntas en f235 (8 f, blur 4 px) y quedan nítidas ≈ f239; el texto salió del contenedor que se desenfoca con la noche y la noche ahora SUBE desde abajo, así que la franja del titular sigue clara hasta f324. "Tu negocio" entra en f330, "creció." se estira igual en f351. Medido: 85 f. |
| minor | Pastilla WhatsApp de 820 px y número en x 907 | Sin ícono, padding 30 px, wdth 100: 676 px, número hasta x 844. Mantengo "WhatsApp +54 3541 33-7818" en una sola pastilla. |
| minor | Tablero y cierre congelados | Tablero: push-in continuo 1,00 → 1,035, parallax ±6 px por tile, barrido especular en f820 y f839 escalonado por columna. Cierre: topo con deriva 26, la pastilla respira 2 % en f898 y f918. |
| minor | Avatar de 116 px legible | Al aterrizar el pull (f242–248) el avatar pasa al mismo ráster de 30 px agrandado y suavizado; además el logo se desenfoca a medida que se achica. Ya no se lee "La Espiga". |
| minor | Doble exposición f235–237 y borde recto f238–241 | "desde siempre." termina de salir en f234; "No se lee" entra en f235. El pull es un único clip circular (radio en pantalla 1365 → 330 → 58) con sombra suave, y la pared del cartel sangra 1380 px fuera del cuadro: no hay más borde recto. |
| minor | Recorte del tile de perfil | Esa carta se encaja entera en el tile (contain, 8 px de margen arriba, fondo igual al del arte): avatar y pills con ≈ 24 px de aire. |
| minor | Pastilla "Ejemplo ilustrativo" pegada a titulares | Titulares bajados a y 384 (hook, cartel, "No se lee", "Es hora de", tablero). No la mudé abajo: en y ≈ 1190 chocaría con la tarjeta de perfil (f234–312) y con la fila inferior del tablero. |
| minor | Grietas sobre el texto f450–468 | Máscara difuminada (≈ 60 px) detrás del titular; las grietas solo cruzan las letras en f466–468, justo antes de que se rompan en esquirlas. |
| minor | Fundido del logo a un cuadro vacío f536–547 | Elemento compartido: el wordmark sube y se va mientras el símbolo vuela, se achica y cambia a carbón hasta su lugar exacto en el chip Trigo, que se abre en círculo a su alrededor (f543–556). Sin frames vacíos. |
| minor | Flash del bloom gris/sepia | Flash aditivo (screen) con núcleo caliente #FFF1C9 → #F2A516, pico en f469, cae en 10 f; el mismo estallido se ve entre las esquirlas. Las piezas del logo viejo van encima, nítidas. |
| minor | Rótulos de sección y subtítulo a 46 px | Rótulos a 54 px; subtítulo a 56 px en una línea (wdth 90, entra en 900 px); el tablero bajó 34 px para hacerle lugar (la fila de abajo termina en y 1354, es imagen). |
| minor | "Despertamos…" + subtítulo legibles ≈ 62 f | Textos 2–4 f antes, cartas que vuelan 2 f antes y más rápido, iris que abre desde el centro del tablero (y 1040) en f859: 73 f medidos. |
| minor | Hook blando (visual + audio) | Push-in desde f0 (1,00 → 1,06 en f78), disco de 680 px más abajo, escarcha que cruza "hibernando?" desde f1, titular nítido desde f0. Audio: colchón de aire frío (0,2), ting de vidrio afinado en Mi♭ en f0 y f39, y la base +3 dB hasta f60–76. |
| minor | Oso detrás del disco congelado / etiqueta en el beat del oso | El oso se va del todo en f392. La etiqueta baja al 55 % en f328–386 y vuelve cuando reaparece el logo viejo. |
| minor | Ducking escalonado / ice_crack sin escuchar | Ducks a ×0,8 sin pre-ataque (la caída empieza en el golpe). `ice_crack` regenerado: clicks de 1,2–4,5 kHz (centroide 7,3 → 2,6 kHz) + golpe grave filtrado, y −3 dB. |
| minor | Cierre de 80 f (2,67 s) | **No lo cambié**: el iris abre en el beat 44 (f859), donde cae el `success_chime` y empieza el compás; correrlo a f866 lo saca del beat (regla 10) y separa el golpe del chime de la imagen. El brief le da a este tramo f861–939 (78 f), así que el exceso es de 2 f respecto del brief. Además, el iris desde el centro del tablero ya le da a la placa del tablero sus 73 f. |

## Problemas abiertos
- Sigo sin poder escuchar la mezcla: queda verificar en parlante de celular el colchón de aire + ting del hook (están
  afinados y a 0,2, pero son síntesis propia), los `ice_crack` v2 y que los ducks de ×0,8 no se noten.
- La placa del tablero quedó exactamente en 73 f: cualquier cambio de timing en f775–865 obliga a volver a medir.
- Entre f777 y f788 el titular del tablero entra por encima del mazo de cartas que se está yendo (cruce de ~10 f
  durante la entrada; desde f792 el fondo está limpio).
- "Ejemplo ilustrativo" va a 26 px por pedido del brief (es la única pieza de texto debajo de 44 px).
