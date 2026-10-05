# Lonso Lab: investigación creativa para reels

Fecha: 2026-10-05. Para el director, el guionista y quien anime en Remotion (`studio/`).
Complementa `brand.md` (colores, tipografía, banco de frases verificadas y lo que no se puede decir), `nextro-analysis.md` y `concepts-director.md`.

Reglas que no cambian: 1080×1920 a 30 fps, **sin precios ni descuentos**, voseo rioplatense, solo afirmaciones verdaderas y textos fuera de la interfaz de la app (sección 2).

Todas las cifras de plataforma salen de las fuentes del final. Muchas son "reglas de la industria" publicadas por herramientas y agencias, no datos oficiales de Meta o TikTok: sirven como punto de partida, no como verdad absoluta.

---

## 1. Anatomía de un reel que rinde (2025-2026)

### 1.1 Qué mide hoy el algoritmo
- **Tiempo de visualización y repeticiones.** Según lo que confirmó Mosseri (resumido por varias fuentes de 2026), Instagram dejó de mirar la vista de 3 s y ahora pondera el tiempo total visto más la tasa de repetición. Un reel de 15 s que se ve tres veces le gana a uno de 60 s que se ve una sola vez.
- **Envíos por DM ("sends").** Para mostrarle contenido a quien no te sigue, pesan más que los likes (se habla de 3 a 5 veces más). Conviene que el reel sea "mandable": que alguien diga "mirá, esto es lo tuyo" y se lo pase a un amigo que tiene un negocio.
- **Retención temprana.** Las herramientas citan como umbral sano que entre el 60 % y el 70 % de la gente siga mirando a los 3 s. En Meta, el *hook rate* de los anuncios es: vistas de 3 s ÷ impresiones.
- **Largo.** Los reels pueden durar hasta 20 minutos, pero solo los de 3 minutos o menos se recomiendan a quienes no te siguen. Para lo nuestro, ninguno debería pasar de 35 s.

### 1.2 Hook: los primeros 0,5 a 1,5 s
- **Frame 0 con contenido.** Nada de fundido desde negro ni logo de entrada. El primer frame funciona como portada y como freno del scroll.
- **Movimiento en los primeros 6 a 10 frames** (0,2 a 0,33 s): un *punch-in*, un texto que golpea, un tap en la pantalla o una notificación que cae.
- **La frase del hook se tiene que poder leer completa entre los frames 30 y 45** (1 a 1,5 s). Si es más larga, partila: la primera mitad engancha y la segunda paga.
- **Hook de sonido.** Un tecleo, una notificación o un teléfono que suena en el frame 0 frenan incluso a quien mira sin audio, porque suelen ir acompañados de un movimiento visual.
- **Tipos de hook que funcionan en nuestro rubro:**
  1. Afirmación filosa ("Si no aparecés en Google, no existís").
  2. Pregunta que interpela ("¿Buscaste tu negocio en Maps hoy?").
  3. POV ("POV: tenés el mejor producto de la zona y nadie se entera").
  4. Número o listado ("3 señales de que tu negocio es invisible").
  5. Pantalla que se reconoce: un celular con una búsqueda real.
  6. *Open loop*: prometer algo al final ("la tercera es la que más clientes te hace perder").

### 1.3 Pattern interrupts
- Hace falta un cambio visual que se note **cada 1,5 a 3 s (45 a 90 frames)**. Puede ser un cambio de plano o de escala (*punch-in* de 100 a 115 %), un texto nuevo, un cambio de color de fondo, un objeto que entra, un corte de música o un SFX.
- Hay que **alternar el tipo de interrupción**. Cinco *punch-ins* seguidos se vuelven un patrón y dejan de interrumpir.
- **El giro de la historia** ("Pero…", "Rebobinemos", "Con Lonso Lab") es el interrupt más fuerte. Va más o menos al 35-45 % del reel, y conviene acompañarlo con un cambio de paleta (de papel a cobalto, por ejemplo) y con un drop o un silencio en la música.

### 1.4 Duraciones recomendadas

| Tipo | Duración | Para qué |
|---|---|---|
| Loop / impacto | 7–15 s | Retención del 60 al 80 % según los benchmarks; un solo mensaje; se repite (notis, manifiesto) |
| Historia / explicación | 20–30 s | Hook + problema + giro + servicio + CTA (buscando, despegue, rebrand, POV) |
| Máximo | ~35 s | Por encima de 45 s la retención suele bajar del 30 % |

Muchas guías ubican en 21-34 s el "rango de trabajo" para reels de negocio: alcanza para un hook, una idea de valor y un CTA.

### 1.5 Ritmo del texto en pantalla (en español)
- El español usa palabras más largas que el inglés. Tomá como techo **15-17 caracteres por segundo** (en subtítulos, la norma es de 15 a 20 cps).
- Fórmula para placas: **duración = 0,5 s + 0,32 s × palabras, con un mínimo de 0,9 s (27 frames)**.
  - 1-2 palabras: 0,9 s (27 f)
  - 4 palabras: 1,8 s (54 f)
  - 7 palabras: 2,7 s (81 f)
- **Máximo 7 palabras por placa y 2 líneas**, con unos 18-22 caracteres por línea en tamaño titular.
- **Palabra por beat** (kinetic): solo funciona si cada palabra tiene 10 caracteres o menos y la frase se puede anticipar. La frase completa tiene que quedar armada al menos 0,8 s al final.
- **La última placa** (la idea clave o el CTA) se sostiene entre 1,5 y 2,5 s.
- **Tamaños sobre 1080 de ancho**, con Archivo:
  - Palabra protagonista: 140-220 px (wght 820, wdth 112)
  - Titular de 2 líneas: 96-130 px
  - Texto de apoyo: 56-72 px
  - Nada por debajo de 44 px
- **Contraste**: mínimo 4,5:1. Si el texto va sobre una imagen, usá una caja, una sombra (0 4 24 rgba(19,24,43,.45)) o un velo de tinta.
- **Diseñá para verlo sin sonido.** Todo lo que diga la locución tiene que estar escrito. Se estima que la mayoría del video en el feed de Facebook se mira sin audio.

### 1.6 Finales en loop
- **Match-frame**: el último frame repite la composición del primero (mismo celular, misma palabra, misma posición). La música corta al final de un compás para que el *loop* no se escuche.
- **Loop de frase**: el final queda abierto y se completa con el hook ("…y por eso" → "Alguien está buscando lo que vendés").
- En un reel pensado como loop, el CTA va **anteúltimo** (1,5 s) y después se vuelve al frame del hook en 0,3-0,5 s.
- En un reel narrativo, el CTA va al final con el logo, en un cierre de 2 a 2,5 s. **No hagas una salida de logo de más de 2 s**: ahí se pierde gente y el loop se rompe.

### 1.7 CTAs que se usan hoy
- **Por mensaje (keyword DM)**: "Escribí AUDITORÍA por mensaje y te contamos cómo seguir". Instagram aclaró (junio 2024) que pedir una palabra para activar una automatización real, tipo ManyChat, **no es engagement bait** si después se atiende de verdad. Lo que sí baja el alcance es pedir comentarios solo para inflar ("Comentá SÍ si…", "Etiquetá a un amigo").
- **Link en bio**: el clásico. Funciona mejor con algo concreto: "Link en bio → Quiero mi auditoría gratis".
- **WhatsApp**: es el canal real de Lonso Lab. "Escribinos por WhatsApp" o "Mandanos el nombre de tu negocio y tu ciudad".
- **Guardar**: "Guardalo y revisá tu ficha hoy". Es una acción útil y no es bait.
- **Compartir**: "Mandáselo a quien tenga un negocio". Usalo poco y mejor en el texto de la publicación que en pantalla, porque los pedidos explícitos de interacción pueden afectar las recomendaciones.
- **Un solo CTA por reel.** El primario es siempre la **auditoría gratis** (el primer paso real del proceso) o "Escribinos". Para rebrand: "Contanos de tu marca".

### 1.8 Sonido
- **Mezcla final**: **−14 LUFS integrados y true peak de −1 dBTP**, medidos después de exportar a AAC. Las plataformas normalizan a ese nivel, así que mezclar más fuerte no suma nada.
- Si hay locución, la música va 6-10 dB por debajo (con ducking). Los impactos van 3-6 dB por encima de la música en ese instante.
- **Audio**: usá música propia o libre de derechos con licencia comercial. Para una cuenta de empresa, la biblioteca comercial de Meta o el audio original son la opción segura. El audio en tendencia puede dar más alcance, pero los estudios muestran resultados mixtos y la licencia no siempre cubre el uso comercial.

---

## 2. Zonas seguras 9:16 (1080×1920) y recortes de grilla

### 2.1 Márgenes por plataforma (en px)

| Plataforma | Arriba | Abajo | Izq. | Der. | Área segura | Qué tapa |
|---|---|---|---|---|---|---|
| **Instagram Reels** (guía de Meta) | **270** (14 %) | **672** (35 %) | **65** (6 %) | **65** (6 %) | ~950×978 | Arriba: usuario, cámara y menú. Abajo: caption, audio, usuario y seguir. Derecha: botones de acción en la parte baja |
| Instagram Stories (referencia) | 270 | 380 | 65 | 65 | ~950×1270 | |
| **TikTok** (orgánico, caption corto) | 130 | 484 | 44 | **140** | 896×1306 | El caption crece hacia arriba si es largo |
| TikTok (conservador) | 240 | 660 | 120 | 120 + **riel de 180 px desde y≈840 hacia abajo** | | Avatar, me gusta, comentarios, guardar y compartir |
| **YouTube Shorts** | 288 | 672 | 48 | **192** | 840×960 | |
| **Combinado IG + TikTok + Shorts** | **288** | **672** | **64** | **192–227** | ~800×960 | Usá este para publicar el mismo archivo en todas |

### 2.2 Regla de la casa para Lonso Lab
Medidas sobre el lienzo de 1080×1920:
- **Zona A, titulares libres**: x 90–990 · y 290–840 (900×550). Ahí va el hook y la palabra protagonista. Es la mejor zona porque no la tapa ninguna interfaz y entra en todos los recortes de grilla.
- **Zona B, texto con riel**: x 90–880 · y 840–1240 (790×400). Sirve para texto de apoyo, tarjetas y chips. Desde y 840 hacia abajo nada importante puede ir a la derecha de x 880.
- **Zona C, solo imagen**: y < 270, y > 1250, y la franja x > 900 entre y 840 y 1700. Ahí puede haber fondo, texturas, mapas o parte del celular, **nunca texto, logo, CTA ni caras**.
- **El CTA final y el logo** van en y 900–1240, centrados y con un ancho máximo de 780 px (x 150–930), para que el riel no los tape.
- **El celular simulado** (concepto UI) mide unos 760×1560 px, centrado en x 540 y desplazado hacia arriba (y 180–1740). Lo que se tiene que leer adentro de la pantalla (resultados, notificaciones) va en y 290–1240. La barra de estado y la parte baja del celular pueden quedar debajo de la interfaz de la app.

### 2.3 Recortes de grilla y portada
- **Grilla del perfil 3:4** (desde enero 2025): recorte central de 1080×1440 → **y 240–1680**. Se pierden 240 px arriba y 240 abajo.
- **4:5** (feed de FB, Threads y la grilla vieja): 1080×1350 → **y 285–1635**.
- **1:1** (algunas vistas y compartidos): 1080×1080 → **y 420–1500**.
- **Regla de portada**: el título va en **x 90–990, y 420–1240**. Así sobrevive a los recortes 1:1, 4:5 y 3:4 y no queda tapado en la reproducción. Diseñá el frame 0 (o una portada aparte) con la palabra protagonista grande y el pin naranja. Que los 6-8 reels juntos formen una grilla prolija: alterná fondos papel, cobalto y tinta.

### 2.4 Plantilla para revisar
Exportá un PNG de guías de 1080×1920 (zonas A, B y C en colores translúcidos) y superponelo en Remotion con un `<AbsoluteFill>` que solo se active en modo preview, o en `tools/qa.py` con el frame extraído por ffmpeg. La revisión es **pasar cada frame con texto por esa plantilla**.

---

## 3. Estilos de motion design para reels de agencia, con técnica concreta

Las cifras de frames son a 30 fps. Los helpers de Remotion que ya están instalados en `studio/` son: `spring`, `interpolate` + `Easing`, `@remotion/transitions`, `@remotion/motion-blur`, `@remotion/noise`, `@remotion/paths`, `@remotion/layout-utils` y `@remotion/shapes`.

**Pasar de BPM a frames**: frames por beat = 1800 / BPM.

| BPM | Frames por beat |
|---|---|
| 75 | 24 |
| 90 | 20 |
| 100 | 18 |
| 120 | 15 |
| 128 | 14,06 |
| 140 | 12,86 |
| 150 | 12 |

Calculá cada beat en segundos y redondeá frame por frame. No sumes redondeos, porque se acumula el desfase.

### 3.1 Tipografía cinética
- **Slam palabra por palabra**: la palabra entra en 3-4 frames con escala 1,35 → 1,0 (o de 0 a 1,08 y a 1,0) usando `spring({damping: 11, stiffness: 220, mass: 0.6})`. Al impactar:
  - *camera shake* de 4-6 frames con amplitud de 10-18 px que decae (`noise2D`, no `Math.random`, para que el render sea determinista);
  - un *flash frame* opcional de 1-2 frames al 30-50 % en papel o pin.
  
  La salida es un corte seco en el siguiente beat.
- **Mask reveal**: el texto sube desde debajo de una línea de recorte (overflow hidden) un 100-110 % de su alto, en 8-12 frames, con `Easing.bezier(0.7, 0, 0.2, 1)` o expo-out. Escalonado: 2 frames entre palabras (~66 ms), 3 entre líneas (~100 ms) y 1 entre caracteres.
- **Scale punch al beat**: en cada kick, el bloque de texto va de 1,0 a 1,06 y vuelve en 6 frames. En el downbeat de cada compás, el *punch* sube a 1,12.
- **Firma de Lonso Lab: "stretch punch" con fuente variable.** Archivo es variable en `wdth` 62–125 y `wght` 100–900. Animá `font-variation-settings` así:
  - la palabra entra comprimida (wdth 62, wght 900) y se ensancha a wdth 125 en 6 frames con un rebote;
  - para la idea de "despegar", se estira hacia arriba (wdth 62 + escala Y 1,1).

  Es único, es de la marca y no requiere otras fuentes.
- **Énfasis por color**: la palabra clave de cada frase va en **pin `#ff5a26`**. Es la regla de la marca: el naranja es para "tu negocio" y la acción. El resto, en papel sobre tinta o en tinta sobre papel.
- **Tachado animado**: una línea de 6-10 px en pin que crece de izquierda a derecha en 8 frames (`evolvePath` o `scaleX` con origen a la izquierda). Sirve para objeciones y antes/después.
- **Contador numérico**: `interpolate` de 0 al valor en 20-40 frames con `Easing.out(Easing.cubic)`, separador de miles con punto (705.326), `tabular-nums` para que no tiemble. Al final, un *punch* de 1,08.

### 3.2 UI simulada / pantalla de celular (Google, Maps, notificaciones, mensajes)
- **Armado**: el celular es un componente en HTML/CSS (marco tinta `#0d0c0a`, radio de 110 px, isla dinámica). Todo lo de adentro es UI **genérica inspirada** en la real:
  - buscador redondeado `#eef0f5`
  - pins
  - estrellas `#e7a614`
  - burbuja verde de llamada `#22a35a`
  
  **No uses los logos oficiales de Google ni de Apple, ni sus sonidos exactos.** Nombrar "Google Maps" como servicio está bien (uso nominativo). Agregá una etiqueta chica que diga "Simulación". Usá **negocios inventados** y nunca la marca real de un competidor.
- **Tipeo**: 1 carácter cada 2-3 frames con un poco de variación (con seed), cursor que titila cada 15 frames y un *tick* de teclado por carácter (ASMR).
- **Tap**: un círculo de 0 a 1,6 de escala con opacidad de 0,35 a 0, en 10 frames. El elemento tocado baja a 0,97 de escala por 4 frames.
- **Scroll**: un `spring` con inercia (damping 26, stiffness 120) y *motion blur* vertical suave (`<Trail>` o `CameraMotionBlur` con 4-6 muestras).
- **Pin que cae**: translateY de −220 a 0 con un rebote (`spring damping 9`), la sombra va de 0,4 a 1 de escala y suena un *thunk*.
- **Notificaciones que llueven**: entran desde arriba con `spring({damping: 16, stiffness: 170})` y se apilan. El intervalo entre una y otra se acorta (20 → 14 → 10 → 7 → 5 → 4 → 3 frames) para crear la sensación de "no para de sonar". Cada una suena con un *pop* distinto, con el pitch subiendo un semitono.
- **Cámara sobre el celular**: perspective 1600 px, rotateY de −12° a 0° y rotateX de 6° a 0° durante el plano, más un *push-in* lento de 1,00 a 1,08. En la revelación final, la cámara "entra" en la pantalla: la escala sube hasta que la UI llena el cuadro y se corta en el frame del beat.
- **Historia en dos tiempos** ("Hoy" vs "Con Lonso Lab"): el mismo plano dos veces. El cambio es un **rebobinado** (VHS o *tape stop*: frames al revés acelerados en 12-18 frames, con aberración cromática).

### 3.3 Pantalla dividida y antes/después
- En 9:16, **dividir a la izquierda y la derecha deja dos columnas de 540 px**. No hay lugar para texto adentro: los títulos ("Negocio A" / "Negocio B") van en la zona A, ocupando todo el ancho. En la columna derecha, todo lo importante tiene que ir entre x 560 y 880, por el riel.
- **Dividir arriba y abajo** (dos mitades de 1080×960): la mitad de abajo queda casi toda tapada por el caption (y > 1250). Sirve solo si la mitad de abajo es imagen y los rótulos van sobre la línea divisoria (y ≈ 960).
- **Lo mejor para nosotros es el slider**: una sola imagen con un divisor vertical arrastrable (manija de 72 px con flechas) que barre de x 1080 a x 0 en 24-36 frames, con un *ease in-out* y un *whoosh* paneado de derecha a izquierda. Lo de antes, desaturado y frío (filtro sepia/gris + contraste −10). Lo de después, con todo el color de la marca.
- **Sincronizar acciones**: en los dos lados pasa lo mismo al mismo tiempo (llega un cliente, alguien busca), y solo cambia el resultado. Es la forma más clara de mostrar el costo de no hacer nada.

### 3.4 Glitch / datamosh
- **RGB split**: separá los canales R y B entre 6 y 20 px en sentidos opuestos durante 2-4 frames (en Remotion: tres copias de la capa con `mix-blend-mode: screen` y filtros de color, o un filtro SVG `feColorMatrix` + `feOffset`).
- **Desplazamiento en franjas**: de 6 a 10 franjas horizontales de 20-80 px que se corren ±30-120 px durante 2-3 frames, con seed fija.
- **Scanlines** de 2-3 px al 6-10 % de opacidad, más un grano (`noise2D`) al 4-6 %.
- **Datamosh real**: si se necesita una transición con "pixeles que se derriten" entre dos clips, se puede exportar el tramo y quitarle el I-frame con ffmpeg o con un script de datamosh. Después se vuelve a importar. Usalo como máximo una vez por reel.
- **Dosis**: cada golpe de glitch dura **6 frames o menos** y aparece cada 2-4 s como mucho. **Accesibilidad**: nunca más de **3 flashes por segundo** (WCAG 2.3.1). Esto pesa en el manifiesto con flashes. Si hace falta más energía, usá movimiento en vez de flashes de luz.

### 3.5 Editorial minimalista / grilla suiza
- **Grilla de 12 columnas** sobre 1080: márgenes de 90 px, *gutter* de 20 px y una retícula base de 8 px. Mucho aire, tipografía grande alineada a la izquierda, numeración (01/04) y filetes de 2 px en tinta.
- **Paleta papel `#f3f4ef`, tinta `#13182b` y acento pin solo en marcas**: tachados, resaltador y tildes.
- **Movimiento**: sin *shake* ni rebote. Entradas de 10-14 frames con `Easing.bezier(0.16, 1, 0.3, 1)`, cortes secos en el downbeat y *path draw* para subrayados y tildes (`evolvePath`, 10-14 frames).
- **Resaltador**: un rectángulo pin al 35 % que crece en scaleX detrás de la palabra en 8 frames, con bordes un poco irregulares (SVG con jitter fijo).
- **Textura**: grano de papel al 3-5 % y curvas de nivel de la marca en `#d3d7df` muy sutiles.

### 3.6 3D / parallax
- **Capas a distintas profundidades**:
  - curvas de nivel (z −600)
  - mapa (z −250)
  - pin y celular (z 0)
  - texto (z +120)

  La cámara hace un *dolly* de 3-5 % de escala en 2-3 s y un leve *orbit* (rotateY ±6°). En CSS: `perspective: 1200px` y `transform-style: preserve-3d`.
- **"2.5D"**: separá un recorte (por ejemplo, el local del cliente) del fondo y movelos a velocidades distintas.
- **Luz**: un barrido especular (un gradiente lineal al 20 % que cruza en 18 frames) sobre el logo o las tarjetas, solo en los momentos premium.
- **Partículas** (estela del pin que despega): 40-80 puntos en pin y papel, con vida de 20-40 frames, posición por `noise2D` y blur de 1-2 px.

### 3.7 Stickers / collage
- **Recortes con borde blanco de 8-12 px**, una sombra corta (0 6 0 rgba(19,24,43,.18)), cinta de papel semitransparente y sellos ("ANTES", "DESPUÉS", "SIMULACIÓN").
- **Stop-motion "en dos"**: el collage se actualiza cada 2-3 frames (unos 12 fps) aunque el video vaya a 30. En cada cambio, rotación aleatoria de ±2-3° y desplazamiento de ±3 px con seed fija (el *boil*).
- **Flechas y círculos hechos a mano** en pin, dibujados con `evolvePath` en 8-12 frames, con trazo irregular.
- **Fotos reales del cliente** (frente del local, producto) recortadas: le dan cercanía de barrio. Encaja con la tendencia 2026 de lo "imperfecto a propósito" y lo artesanal.

### 3.8 POV y memes
- El **POV** es el gancho nativo más fuerte en Reels porque pone al que mira adentro de la escena. Formato: una placa arriba (zona A) con texto blanco, sombra o caja negra al estilo de los subtítulos nativos de Instagram, para que parezca "contenido de alguien" y no un aviso.
- **Plantillas de meme** que se pueden hacer con ilustración propia, sin usar imágenes de memes con derechos:
  - "Nadie: / Tu cliente a las 23 h: 'ferretería abierta cerca'"
  - "Expectativa vs. realidad"
  - "Yo explicándole a mi viejo por qué necesitamos web"
- **El tono**: humor de quien tiene un negocio, nunca burla del cliente.

### 3.9 Cuenta regresiva / listado
- **Número gigante** (400-600 px, Archivo wdth 62 y wght 900) que se golpea con el beat. Cada ítem dura 3-5 s.
- **Barra de progreso** o puntos (1/3, 2/3, 3/3) arriba, en la zona A. Ayuda a que la gente lo termine.
- **Open loop**: "la 3 es la que más clientes te hace perder". La cuenta regresiva tipo lanzamiento (T-3, T-2, T-1) usa el mismo principio con el tono del despegue.

### 3.10 Sonidos de UI (ASMR) y SFX: cuándo van
- **Whoosh**: el pico del whoosh cae **exactamente en el frame del corte**. Arranca 6-12 frames antes (200-400 ms) y se panea en la dirección del movimiento. No uses el mismo whoosh en todos los cortes: variá el largo y el tono.
- **Impacto, boom o "braam"**: el transitorio va en el frame en que aterriza la palabra o el objeto. Puede ir hasta 1 frame tarde, **nunca antes**, porque el audio adelantado se nota.
- **Riser**: de 1 a 4 s, termina en el drop o en el giro. Antes del drop, **4-8 frames de silencio total** (un hueco de aire) hacen que el golpe pegue el doble.
- **Platillo invertido**: termina en el corte, para entrar a la sección siguiente.
- **Tape stop o rebobinado**: 0,5-1 s, para volver atrás en la historia.
- **Rayón de disco**: el "pero…" en tono de meme.
- **UI**: tick de teclado por carácter (−24 a −18 dB), tap (*click* suave), *pop* de notificación (genérico, no el de iOS), ring de llamada genérico y *thunk* del pin.
- **Mezcla**: los SFX de UI van bajos y cerca. Los impactos son anchos y con algo de sub. Hacé ducking de la música de −4 a −8 dB debajo de cada SFX protagonista, durante 6-10 frames.
- Ya hay un generador de SFX en `tools/make_sfx.py`, que se puede ampliar con tick, pop, thunk, whoosh e impacto.

---

## 4. Copy: crear la necesidad sin mostrar precios

### 4.1 Reglas de verdad
- **No prometer** primer puesto, cantidad de ventas, clientes ni "duplicar". Lo que sí se puede decir: "que te encuentren", "que te elijan", "aparecer completo", "reseñas respondidas", "contenido todas las semanas", "una web pensada para el celular", "reporte mensual". Todas son promesas de servicio que dependen de nosotros.
- **Números reales, siempre con su contexto** (están en `brand.md` §6.5):
  - **705.326 visualizaciones en 30 días** (@ingrid_van_der_veen). Ojo: el 93,9 % vino de **campañas pagas que administramos**. En pantalla, decí "con campañas que administramos" o agregá la aclaración: "Resultado de una cuenta y un período concretos. Incluye pauta paga."
  - **MPJ Fitness 5,0 ★**: "gestionamos su ficha". No digas "le conseguimos el 5,0".
  - **Terra Firma**: "4,7 sobre 5 con 5.807 opiniones" en Google. "Reservas directas, sin intermediarios."
- **Datos de terceros**: si aparecen en pantalla, citá la fuente y el país. De la encuesta BrightLocal 2026, en EE. UU. (1.002 personas):
  - 97 % lee reseñas de negocios locales.
  - 89 % espera que el dueño responda.
  - 74 % busca reseñas de los últimos 3 meses.
  - 68 % solo usa negocios con 4 estrellas o más.

  Para Argentina conviene usarlos como argumento de fondo y no como cifra en pantalla. **No uses** el dato de "70 % más visitas con perfil completo": viene de una cita vieja de Google que no se puede verificar hoy.
- **Simulaciones**: las búsquedas, fichas y notificaciones son ilustrativas, llevan la etiqueta "Simulación" o "Ejemplo ilustrativo" y no usan competidores reales.
- **Rebrand**: el sitio no lo ofrece como servicio separado. Confirmá con el equipo que lo ofrecen antes de publicarlo, y mostralo con una **marca ficticia** con la etiqueta "Ejemplo ilustrativo".

### 4.2 Ángulos por servicio

**Google Maps (Perfil de Empresa)**: *que te encuentren*
- *Intención*: la gente ya está buscando lo que vendés, con ganas de comprar. Es el cliente más caliente que existe.
- *Pérdida*: en el resultado del mapa se ven pocos negocios arriba. Si tu ficha no tiene fotos, horarios ni reseñas respondidas, el cliente "duda un segundo y toca el de al lado".
- *Reseñas*: una reseña sin respuesta también habla de tu negocio. Las reseñas viejas transmiten abandono.
- *Costo de no hacer nada*: cada búsqueda que no te encuentra es una venta para otro, y no te enterás.
- *Prueba*: MPJ Fitness 5,0 ★ (ficha gestionada por Lonso Lab).

**Redes (reels, diseño, comunidad)**: *que te elijan*
- *Validación*: antes de escribirte, te stalkean. Un perfil quieto parece un negocio cerrado.
- *Constancia*: "contenido todas las semanas sin que te ocupes vos". Vos filmás con el celular y nosotros te guiamos plano por plano.
- *Atención*: los mensajes sin responder son clientes que se enfrían ("para que ningún interesado quede sin respuesta").
- *Prueba*: 705.326 visualizaciones en 30 días, con campañas que administramos, más la aclaración.

**Web a medida**: *que te escriban*
- *Propiedad*: Instagram es un local alquilado y tu web es tu casa. Si mañana cambia el algoritmo, tu web sigue ahí.
- *Decisión*: la web es donde la gente decide. Que se vea bien en el celular, con WhatsApp, cómo llegar y tus reseñas.
- *Disponibilidad*: tu web atiende a las 3 de la mañana.
- *Prueba*: Terra Firma, reservas directas sin intermediarios, 4,7 ★ con 5.807 opiniones a la vista antes de reservar.

**Rebrand / identidad**: *que te reconozcan*
- *Primera impresión*: tu marca llega antes que vos. Es lo primero que ven en Maps, en Instagram y en el cartel.
- *Desfase*: tu negocio creció y tu marca se quedó en otra época. Si la marca se ve vieja o genérica, el producto también lo parece.
- *Coherencia*: un logo que no se lee en el círculo del perfil, colores que cambian en cada posteo y el cartel por un lado y la web por otro. Un sistema hace que se te reconozca al primer vistazo.
- *Sin perder lo que sos*: rebrand no es borrar tu historia, es despertarla.

**Pack (los tres juntos)**: "Que te encuentren. Que te elijan. Que te escriban."

### 4.3 Hooks (voseo)
1. "Alguien está buscando lo que vendés. Ahora mismo."
2. "Te están buscando. Y encuentran a otro."
3. "Si no aparecés en Google, para tu cliente no existís."
4. "Tu competencia no es mejor que vos. Solo se ve mejor."
5. "Buscá tu negocio en Google Maps. Ahora. Te espero."
6. "Cada día que no aparecés, alguien le compra a otro."
7. "POV: tenés el mejor producto de la zona y nadie se entera."
8. "POV: tu cliente te busca de noche y tu ficha no dice ni el horario."
9. "Nadie: / Tu cliente a las 23 h: 'gimnasio abierto cerca'."
10. "3 señales de que tu negocio es invisible en Google."
11. "Esta reseña sin responder está hablando de tu negocio."
12. "Tu último posteo fue en marzo. Tus clientes lo notaron."
13. "Una cuenta que publica cada tanto parece un negocio que cerró."
14. "Mismo rubro. Misma cuadra. Uno vende y el otro no."
15. "No te faltan clientes. Te falta que te encuentren."
16. "Si tu web no se ve bien en el celu, tu cliente ya se fue."
17. "Tu negocio tiene todo para despegar. Menos una cosa."
18. "¿Cuánta gente pasó por tu puerta sin saber que existías?"
19. "Tenés 3 segundos para que te elijan. Igual que este reel."
20. "Esto es lo que ve tu cliente cuando te busca."
21. (Rebrand) "¿Tu marca está hibernando?"
22. (Rebrand) "Tu negocio creció. Tu marca se quedó en 2015."
23. (Rebrand) "Si tu logo no se lee en un circulito de Instagram, tenemos un problema."
24. (Rebrand) "Tu marca llega antes que vos. ¿Qué dice de vos?"

### 4.4 Frases por marco
- **FOMO / competencia**:
  - "Mientras lo pensás, el de enfrente ya respondió la reseña."
  - "Tu competencia no tiene mejor producto. Tiene mejor ficha."
- **Costo de no hacer nada**:
  - "Lo caro no es invertir en tu presencia. Es seguir invisible."
  - "Podés aprender todo esto solo. La pregunta es cuánto te va a costar."
  - "Cada búsqueda sin respuesta es un cliente que no vuelve."
- **Prueba social**:
  - "No te pedimos que nos creas. Mirá el trabajo."
  - "Así se ve una ficha que trabajamos todos los meses."
  - "Lo que ve cada huésped de Terra Firma antes de reservar."
- **Alivio / delegar**:
  - "Vos seguís con tu negocio. Nosotros nos ocupamos de que se vea."
  - "Vos filmás. Te guiamos."
- **Confianza**:
  - "Sin permanencia."
  - "Nunca te pedimos contraseñas."
  - "Nada se publica sin tu aprobación."
  - "Primero lo vemos. Después decidís."

### 4.5 CTAs
1. "Pedí tu auditoría gratis."
2. "Auditoría gratis en 24 h hábiles · Link en bio."
3. "Escribinos por WhatsApp."
4. "Mandanos el nombre de tu negocio y tu ciudad. Con eso arrancamos."
5. "Escribí AUDITORÍA por mensaje y te contamos cómo seguir." (solo si la automatización o la respuesta manual está activa)
6. "Primero lo vemos. Después decidís."
7. "Tu próximo cliente ya está buscando. Que te encuentre a vos."
8. "Despegá con Lonso Lab."
9. "Guardalo y revisá tu ficha hoy."
10. "¿Querés que tu celular suene así? Escribinos."
11. "Sin costo, sin compromiso y sin pedirte contraseñas."
12. (Rebrand) "Contanos de tu marca. Te mostramos por dónde empezar."
13. (Rebrand) "Escribí MARCA por mensaje y despertamos la tuya."

---

## 5. Ideas de conceptos (8, todas distintas)

Mapeo con `concepts-director.md`: 1 = buscando, 2 = manifiesto, 3 = despegue, 4 = pov, 6 = trabajo, 7 = rebrand y 8 = notis. El **5 (misma-cuadra)** es nuevo: suma la pantalla dividida, el collage y la cumbia, que no estaban en la lista.

| # | ID / título | Formato | Estilo de edición | Mood | Música (BPM) | Duración | Hook |
|---|---|---|---|---|---|---|---|
| 1 | `buscando` · Te están buscando | Historia en UI de celular, dos tiempos | UI simulada en 3D, taps, scroll, rebobinado y lluvia de notificaciones; plano medio de 2-3 s | Tensión → alivio | Electro-pop / house 122, con hueco + drop en el giro | 28–30 s | (tecleo en el frame 0) "Alguien está buscando lo que vendés. Ahora mismo." |
| 2 | `manifiesto` · No existís | Manifiesto tipográfico | Kinetic slam palabra por beat, stretch punch de Archivo, glitch de 6 frames o menos, ≤3 flashes/s | Urgente, desafiante | Phonk / trap oscuro 140–150 | 15–18 s | "Si no aparecés en Google…" → "NO EXISTÍS." |
| 3 | `despegue` · Despegá | Tráiler + cuenta regresiva T-3/T-2/T-1 | Cinemático 3D/parallax: curvas de nivel como radar, pin que despega con estela de partículas, letterbox | Épico, aspiracional | Trailer híbrido ~90 (braams, riser, silencio, impacto) | 25–30 s | "Tu negocio tiene todo para despegar. Menos una cosa." |
| 4 | `pov` · POV: tu negocio es buenísimo, pero… | POV + listado | Editorial suizo sobre papel: tachados → tildes, resaltador, cortes secos en el downbeat, sin shake | Honesto, cercano, con humor | Lo-fi hip hop 80–85 | 20–25 s | "POV: tenés el mejor producto de la zona y nadie se entera." |
| 5 | `misma-cuadra` · Dos negocios, misma cuadra | Pantalla dividida / slider antes-después | Collage y stickers en stop-motion a 12 fps, flechas a mano, sellos ANTES/DESPUÉS, acciones sincronizadas | Juguetón, de barrio | Cumbia digital / guaracha liviana 95–100 | 15–20 s | "Mismo rubro. Misma cuadra. Uno vende y el otro no." |
| 6 | `trabajo` · Mirá el trabajo | Montaje de prueba | Tarjetas de archivo apiladas (estilo Nextro), contadores, celulares con trabajos reales, cortes con el groove | Confiado, con orgullo | Nu-disco / funk 112–118 | 20–25 s | "No te pedimos que nos creas. Mirá el trabajo." |
| 7 | `rebrand` · ¿Tu marca está hibernando? | Antes → después de identidad (marca ficticia) | Premium minimal y lento: color frío → cálido; logo que se construye sobre grilla con `evolvePath`; barrido de luz; mockups (cartel, bolsa, perfil, pin, web) | Elegante, de despertar | Piano / ambient 70–80 → swell cálido con pulso | 25–30 s | "¿Tu marca está hibernando?" |
| 8 | `notis` · Que tu celular suene así | Loop ASMR | Pantalla bloqueada que se llena de notificaciones que se aceleran; último frame igual al primero | Satisfactorio, adictivo | Solo SFX de UI + minimal house 124 suave | 8–10 s | (pop de notificación en el frame 0) "¿Querés que tu celular suene así?" |

Notas por concepto:
- **1 buscando**:
  - Al ~40 %, un *tape stop* y "Rebobinemos".
  - La ficha "Hoy" va en gris con la etiqueta roja `#b42318` y la de "Con Lonso Lab" con la verde `#1d7a3e`.
  - CTA: auditoría gratis.
- **2 manifiesto**:
  - Fondo tinta, palabras en papel y la clave en pin.
  - Para aumentar la energía, usá movimiento en vez de flashes.
  - Termina en "GOOGLE MAPS · REDES · WEB" → logo.
- **3 despegue**:
  - Cada T es un servicio con su lema (Que te encuentren, Que te elijan, Que te escriban).
  - 6 frames de silencio antes de la ignición.
- **4 pov**:
  - Funciona como listado de 4 ítems con contador 1/4.
  - El giro es "Lo que hacemos nosotros", con tildes animadas.
  - Es el más fácil de "mandarle a un amigo".
- **5 misma-cuadra**:
  - Mismo cliente con el celular en los dos lados. A la izquierda, ficha vacía y perfil quieto. A la derecha, completo.
  - El slider barre y el cliente "cruza la calle".
  - Usá nombres inventados y el sello "Simulación".
- **6 trabajo**:
  - Usá solo números reales y con su aclaración (705.326, con pauta).
  - Mostrá el sitio de Terra Firma con scroll en el celular y MPJ 5,0 ★ como "ficha que gestionamos".
- **7 rebrand**:
  - Puede abrir con el oso del logo abriendo el ojo.
  - Variante alternativa en collage: recortes de la marca vieja que se despegan y revelan la nueva.
  - CTA: "Contanos de tu marca".
- **8 notis**:
  - El CTA va anteúltimo y el reel vuelve en *match-frame* a la pantalla vacía.
  - Las notificaciones son genéricas: "Llamada entrante", "Nueva reseña ★★★★★", "¿Tienen turno hoy?", "Pidieron cómo llegar".

---

## Fuentes
- Zonas seguras Instagram/TikTok/Shorts:
  - [Breakreach, safe zone checker](https://www.breakreach.com/tools/safe-zone-checker)
  - [Cadenus, TikTok safe zone 2026](https://cadenus.io/resources/blog/tiktok-safe-zone/)
  - [1ClickReport, Meta Ads safe zones 2026](https://www.1clickreport.com/blog/meta-ads-creative-safe-zones-2026-guide)
  - [Zeely](https://zeely.ai/blog/master-instagram-safe-zones/)
  - [Outfy](https://www.outfy.com/blog/instagram-safe-zone/)
- Grilla 3:4:
  - [Hopper HQ](https://www.hopperhq.com/blog/instagram-reel-size/)
  - [Your Social Team](https://yoursocial.team/blog/instagram-new-grid-format)
  - [PostEverywhere](https://posteverywhere.ai/blog/instagram-aspect-ratios)
- Algoritmo y retención:
  - [Dataslayer, señales confirmadas por Mosseri](https://www.dataslayer.ai/blog/instagram-algorithm-2025-complete-guide-for-marketers)
  - [Creatorflow 2026](https://creatorflow.so/blog/instagram-algorithm-2026/)
  - [OpusClip, largo ideal](https://www.opus.pro/blog/ideal-instagram-reels-length)
  - [OpusClip, hooks](https://www.opus.pro/blog/instagram-reels-hook-formulas)
  - [Metricool](https://metricool.com/instagram-reels-length/)
- Pattern interrupts:
  - [CapCut](https://www.capcut.com/create/pattern-interrupt-technique-short-form-video)
  - [Edición Video Pro](https://edicionvideopro.com/en/editing-for-platforms-video-marketing/pattern-interrupts-tiktok-retention-guide/)
- Ritmo de lectura:
  - [AIR Media-Tech](https://air.io/en/youtube-hacks/best-practices-for-writing-and-formatting-subtitles)
  - [Frameos](https://frameos.studio/blog/how-to-add-text-to-video)
- CTA y engagement bait:
  - [Social Media Today, aclaración de Instagram sobre CTAs de una palabra (jun 2024)](https://www.socialmediatoday.com/news/instagram-clarifies-advice-single-word-ctas-longer-reels/718151/)
  - [ManyChat, automatización de comentarios](https://manychat.com/blog/the-ultimate-guide-for-instagram-comment-automation/)
- Anuncios de Meta en Reels:
  - [Benly](https://benly.ai/learn/meta-ads/meta-ads-reels-ads-guide)
  - [GetHookd](https://www.gethookd.ai/learn/facebook-reels-ads-specs-examples-best-practices/)
- Loops:
  - [CapCut](https://www.capcut.com/create/seamless-loop-videos-continuity-techniques)
  - [Virvid](https://virvid.ai/blog/looping-structure-shorts-retention-2026)
- Tendencias de motion design:
  - [Envato, 11 Motion Design Trends 2026](https://elements.envato.com/learn/motion-design-trends)
  - [Canva, "Imperfect by Design" 2026](https://www.canva.com/newsroom/news/design-trends-2026/)
  - [GDJ](https://graphicdesignjunction.com/2026/01/video-and-motion-creative-trends-2026/)
  - [ikagency, kinetic typography](https://www.ikagency.com/graphic-design-typography/kinetic-typography/)
  - [iArt, animar texto](https://www.iart.ai/blog/how-to-animate-text)
- SFX:
  - [Sonilo, timing del whoosh](https://sonilo.com/ai-music/whoosh-sound-effect-guide)
- Glitch:
  - [Glitchology, datamosh](https://glitchology.com/datamoshing/)
- Sonoridad:
  - [Cutscore, −14 LUFS en Reels](https://cutscore.io/blog/loudness-for-instagram-reels)
- Accesibilidad:
  - [W3C, WCAG 2.3.1](https://w3c.github.io/wcag21/understanding/three-flashes-or-below-threshold.html)
- Reseñas:
  - [BrightLocal, Local Consumer Review Survey 2026](https://www.brightlocal.com/research/local-consumer-review-survey/)
- Audio en tendencia:
  - [That Random Agency](https://www.thatrandomagency.com/blog/do-trending-sounds-impact-instagram-reel-performance)
  - [Later, tendencias de Reels](https://later.com/blog/instagram-reels-trends/)
