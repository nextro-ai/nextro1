# Análisis de Nextro → ideas para los reels de Lonso Lab

Fuente: `/home/user/nextro1` (React 19 + Vite 5 + Tailwind 3 + GSAP/ScrollTrigger). Se leyeron todos los componentes, `translations.ts` (ES + EN), hooks, `index.css`, `tailwind.config.js` e `index.html`. La web se compiló en una copia en el scratchpad (el repo no se tocó) y se capturó con Playwright en escritorio (1440×900) y móvil (390×844 @2x).

Material guardado en `lonsolab-reels/assets/nextro/`:

| Carpeta | Contenido |
|---|---|
| `screens/` | 28 capturas `desktop-es-*` / `mobile-es-*` por sección (overlay de idioma, hero, features, manifiesto, 5 tarjetas del archivo, galería ×3, precios, footer) + `_contact-desktop.png` / `_contact-mobile.png` (hojas de contacto) |
| `media/` | `nextro-gallery-1-model-tree.jpg`, `nextro-gallery-2-model-flowerfield.jpg`, `nextro-logo-3d-chrome.png`, `nextro-flower-giant-veo-original.mp4`, `nextro-flower-giant-veo-nobars.mp4` (recortado a 1280×624, sin barras negras ni marca "Veo"), `nextro-streetwear-poster-REFERENCE-ONLY.jpg` (no publicar, ver más abajo) |
| `video-frames/` | 6 fotogramas PNG del clip de Veo (0,3 s → 7,55 s) |

---

## 1. Qué es Nextro

- **Agencia creativa/de marketing "potenciada con IA"**, presentada en primera persona por el fundador: *"Hola, soy Leo Alonso Reyes. / y esto es / NEXTRO"*. El footer dice **"© 2026 Nextro Lab"**. El `<title>` es **"NEXTRO - Naturaleza es el Algoritmo"**.
- **Hipótesis importante (confirmar con el usuario):** "Lonso" sale de (Leo) **A·lonso**, y "Nextro Lab" → "Lonso Lab". O sea, **Nextro parece ser la marca anterior de Lonso Lab**. Si es así, ya tienen un **caso de rebrand propio** para contar (sección 5).
- **Servicios** (archivo + schema JSON-LD): reescalado y retoque con IA para moda/catálogo, renders 3D de logo y producto ("fotorrealismo brutal"), branding desde cero (streetwear), posicionamiento en redes, webs y landings. El schema además menciona renders 3D arquitectónicos, "AI upscaling" y marketing digital integral, con dirección en Buenos Aires (el WhatsApp es +54 351, Córdoba).
- **Posicionamiento:** la IA como medio y no como fin. *"No vendemos un software ni un agente virtual, somos tu agencia."* Promete velocidad ("en una fracción del tiempo tradicional"), simplicidad ("Olvídate de la complejidad tecnológica", "Toda la IA sin tecnicismos") y un look premium, oscuro, de estudio de diseño.
- **Precios:** tres planes en ARS (Acelerador $50.000/mes con mes 1 a $30.000, Ecosistema $120.000/mes con mes 1 a $75.000, Enterprise "Personalizado"). **No se usan en los reels.**

### Contraste con Lonso Lab hoy (de `assets/web/screens/home-desktop-hero.png` y el logo)

| | Nextro | Lonso Lab |
|---|---|---|
| Cliente | "grandes y pequeñas empresas", marcas de moda | **negocio local** (ferretería, corralón, hotel), dueños sin tiempo |
| Promesa | IA + visuales de alto impacto | **que te encuentren y te elijan** (Google Maps, redes, web) |
| Tono | aspiracional y abstracto ("Ecosistema", "Protocolo") | **concreto y con voseo** ("lo que vendés", "Te están buscando. Y encuentran a otro.") |
| Paleta | negro `#050505`, gris `#A3A3A3`, azul eléctrico `#3B82F6` | crema/blanco roto, tinta azul marino, **CTA naranja**, líneas topográficas azules |
| Tipografía | Plus Jakarta Sans / Outfit + Cormorant Garamond itálica + JetBrains Mono | **Archivo** (display ancho y pesado), logo con espaciado amplio |
| Marca | wordmark "NEXTRO" genérico | **"L" con un oso** (blanco sobre negro): tiene un personaje |

Conclusión: de Nextro conviene tomar la **gramática de movimiento y tipografía** (es lo más trabajado del sitio). El **mensaje y la paleta** tienen que ser los de Lonso Lab.

---

## 2. Copy que funciona (y cómo adaptarlo al voseo de Lonso)

1. **Manifiesto pregunta → respuesta** (el mejor recurso del sitio):
   > *La mayoría de las empresas preguntan: ¿qué es la Inteligencia Artificial?*
   > *Nosotros te mostramos: cómo usarla para ganar.*

   Es una estructura "La mayoría… / Nosotros…", con la pregunta en gris y peso liviano y la respuesta en blanco y bold. Adaptaciones:
   - "La mayoría de los negocios se pregunta: *¿por qué no me llaman?*" / "Nosotros te mostramos: *dónde te están perdiendo.*"
   - "La mayoría publica cuando puede." / "Nosotros, cuando te buscan."
   - "La mayoría piensa que es mala suerte." / "Es una ficha incompleta."
2. **Presentación personal con remate**: *"Hola, soy Leo. / y esto es / NEXTRO"*. Sirve como apertura o cierre de reel: "Hola, somos Leo y familia. / y esto es / **LONSO LAB**". La frase del medio va chica, en serif itálica y minúsculas, y prepara el wordmark gigante.
3. **"No vendemos X, somos tu agencia."** → "No vendemos posteos. **Somos tu equipo.**" / "No te vendemos una web. Te traemos clientes."
4. **Tríadas cortas** (hero bullets y tags): "Producción de Alta Calidad · Flujos Optimizados con IA · Posicionamiento Inmediato" y "Análisis · Edición · Expansión". Funcionan como tres golpes de beat. Para Lonso: **"Te buscan · Te encuentran · Te eligen"** o **"Auditoría · Ajuste · Crecimiento"**.
5. **Tarjetas de dos palabras más una línea**: "Creación Rápida: Produce más sin esfuerzo" · "Cero Fricción: Toda la IA sin tecnicismos" · "Más Ventas: Resultados puros de conversión". Son ideales para tarjetas en pantalla de 1 a 1,5 s.
6. **Urgencia sin precio**: el chip **"Agenda Abierta"** con un punto que pulsa. Para el cierre: "Agenda abierta · pocos lugares este mes" + "Auditoría gratis".
7. **Etiquetas tipo expediente**: `PROJ.001 // REESCALADO Y RETOQUE AI`. Le dan aire de caso técnico y de prueba: `CASO.003 // FERRETERÍA · GOOGLE MAPS`.
8. **"desde el primer día"** y **"en una fracción del tiempo tradicional"** son promesas de velocidad que se pueden reutilizar.
9. **"Naturaleza es el Algoritmo"**: no aparece en la página, solo en el título, pero le da sentido al video del gigante de flores. Encaja con el **oso** de Lonso (ver la sección 5).

Copy que **no** conviene trasladar: "Estructura de Capital", "Iniciar Protocolo", "Activar Ecosistema", "Enterprise", "SLA", "Integración API", "Equipo asíncrono". Es jerga que espanta al dueño de un comercio local.

---

## 3. Ideas visuales y de movimiento para reusar (con parámetros)

Equivalencias de easing de GSAP a Remotion (`Easing.bezier`):
`power4.out` ≈ `(0.25, 1, 0.5, 1)` (la misma curva que `.magnetic-hover`) · `power3.out` ≈ `(0.33, 1, 0.68, 1)` · `power2.inOut` ≈ `(0.45, 0, 0.55, 1)` · `back.out(1.5)` ≈ `(0.34, 1.5, 0.64, 1)`. Duraciones a 30 fps: 1,4 s = 42 f · 1,2 s = 36 f · 0,8 s = 24 f · stagger de 0,15 s ≈ 4–5 f.

### 3.1 Sistema tipográfico de tres voces (la firma visual de Nextro)
- **GRITO**: sans geométrica bold, `tracking-tighter` (≈ −0,05 em) e interlineado 0,8, a tamaño gigante (12rem en desktop). En Lonso va **Archivo** en su corte ancho y pesado.
- **susurro**: *Cormorant Garamond itálica*, chica, en minúsculas y con 60 % de opacidad ("y esto es"). Se usa como conector entre gritos. Para Lonso: una serif itálica (Cormorant o Instrument Serif) solo en palabras puente.
- **LABEL**: JetBrains Mono en mayúsculas, `tracking 0.2em`, 10–12 px, 50 % de opacidad. Sirve para metadatos, contadores y nombres de servicio.
- **Mezcla dentro del mismo título**: "*Soluciones*" (serif itálica) arriba y "**a Medida**" (sans bold itálica al 60 %) abajo. Queda bien en las tarjetas de portada de cada servicio.
- **Texto en contorno** (`.text-border`: trazo de 1 px blanco al 40 % y relleno transparente). Sirve para transiciones de contorno a relleno.

### 3.2 Entradas
- **Entrada del hero**: cada línea sube y aparece (`y 80 → 0`, `opacity 0 → 1`, 1,4 s, power4.out, stagger 0,15 s, 0,2 s de delay). El fondo hace un *settle* de `scale 1.05 → 1` en 2 s con power3.out. Es la intro de wordmark para todos los reels.
- **"Reveal engine"** (`useRevealEngine`): `opacity 0, y 40, blur 10px → 1, 0, 0` en 1,2 s con power3.out. **El desenfoque que se aclara es la transición más reconocible del sitio.** Se puede usar como transición estándar de cada tarjeta de texto.
- **Manifiesto en cascada**: el bloque 1 entra (y 40, 1 s) y el bloque 2 empieza 0,6 s antes de que termine el primero (`"-=0.6"`). Los textos se pisan y nunca hay un vacío. En reels, el bloque 2 entra en el frame 12 del bloque 1.

### 3.3 Manifiesto con jerarquía de dos tonos
- Pregunta: peso liviano, gris al 50 %, a 2–5 rem.
- Respuesta: **bold gigante**, con la primera mitad en gris al 70 % y la segunda en **blanco con sombra**: "Nosotros te mostramos: **cómo usarla para ganar.**" El ojo cae siempre en la parte blanca.
- Fondo: foto al 30 % de opacidad en `mix-blend-luminosity` (sin color), multiplicada con negro al 80 % y un parallax de `yPercent 30`. En reel se traduce en un **Ken Burns vertical lento** sobre B-roll desaturado detrás del texto.

### 3.4 "ARCHIVO": tarjetas apiladas (lo más adaptable a 9:16)
- Cada proyecto es una tarjeta alta (80–85 vh) con radio grande (2,5–3 rem) que **sube y tapa a la anterior**. La anterior baja a `scale 0.9`, `opacity 0.5` y `blur 20px` con `transform-origin: top`.
- Detrás hay una **palabra fantasma gigante** ("ARCHIVO", Outfit bold, 12 rem, al 5 % de opacidad).
- Cada tarjeta tiene su **tema de color** (onyx `#171717`, `#111`, `#0A0A0A`, void y una **última tarjeta invertida en gris claro**) y su **motivo lineal SVG al 10 %**: círculos punteados que giran con una cruz, una línea de pulso que late, una línea tipo electrocardiograma, una constelación de nodos y un cuadrado de plano técnico girando al revés.
- El layout es label mono (`PROJ.00X // CATEGORÍA`), título en serif itálica, descripción y botón píldora, con la imagen a la derecha en blanco y negro.
- **Uso en Lonso:** un "mazo de servicios" donde cada tarjeta es un servicio y apila sobre la anterior: Google Maps (constelación de pines), Redes (pulso o ECG), Web (plano técnico), Rebrand (cruz o mira). La última tarjeta se invierte al **crema y naranja de Lonso** como golpe final.

### 3.5 Mazo rotativo (Features)
- Tres tarjetas blancas que rotan cada 3 s con `back.out(1.5)` en 0,8 s. Los estados son frente `scale 1 / y 0 / op 1`, medio `0.95 / 15 / 0.7` y fondo `0.9 / 30 / 0.4`.
- Uso: una ráfaga de beneficios ("Más llamadas", "Más reseñas", "Más ventas"). Rota cada 0,5–0,7 s en un reel energético o cada 1,5 s en uno calmo.

### 3.6 Galería horizontal: gris → color
- Pin y desplazamiento horizontal con tarjetas de 35 vw, radio 2 rem y borde blanco al 10 %. En reposo están en **escala de grises al 70 % de opacidad** y al hacer hover pasan a **color pleno** en 0,7 s, con el título sobre un degradado negro abajo.
- Uso: una **metáfora de antes y después sin decirla**. "Sin nosotros" se ve gris y apagado, "con nosotros" se ve en color. Un paneo lateral de los trabajos de Lonso (`assets/web/media/carrusel-*`, `metricas-ig-*`, `terrafirma-*`) que se colorean al pasar por el centro.

### 3.7 Detalles de UI que dan acabado
- **Grano global**: ruido SVG (`feTurbulence fractalNoise`, baseFrequency 0,65, 3 octavas) al **5 %**, fijo sobre todo. Conviene aplicarlo a todos los reels: es barato y da textura de cine.
- **Chip de estado con ping**: un punto con un anillo que escala y se desvanece en bucle. Va en la tarjeta final.
- **Subrayado que crece** (1 px, de ancho 0 a 100 % en 0,5 s) bajo el handle o el CTA.
- **Navbar que se vuelve píldora de vidrio** (transparente → `bg-void/70 backdrop-blur`, borde blanco al 10 %). Sirve como marco de UI o lower-third.
- **Velo de color en una esquina** (`from-accent-blue/10` en `mix-blend-screen`) y degradado de negro desde abajo para que el texto se lea sobre una foto.
- **Overlay de elección de idioma**: logo fantasma al 10 %, una pregunta y **dos píldoras**. Para Lonso es una apertura interactiva: "Elegí: **[seguir invisible]** **[que te encuentren]**", y el cursor "toca" la segunda.

### 3.8 Media de Nextro
- **Clip de Veo "gigante de flores"** (8 s, 24 fps, 1280×720 con barras, ≈ 2,05:1 útil; audio con efectos fuertes, media de −9,4 dB, **conviene silenciarlo**). Anima la foto `gallery-2` (el modelo en el campo de flores): un gigante hecho de flores, con ojos encendidos, se levanta detrás. **Demuestra "una foto fija se convierte en campaña".** En 9:16 entra como bloque horizontal centrado con fondo desenfocado, o en pantalla dividida con la foto original arriba y el clip abajo.
- **`gallery-1` y `gallery-2`**: retratos editoriales con buena dirección de foto (remera roja y entorno verde y florido). Son prueba de nivel visual.
- **`logo-3d.png`**: el wordmark NEXTRO en cromo y vidrio inflado sobre gris. Es una muestra del servicio de render 3D y una referencia para tratar en 3D la "L" del oso de Lonso.
- El mismo modelo aparece en `gallery-1`, `gallery-2` y en el video. **Hay que confirmar con el usuario quién es y si da permiso** antes de usarlo como cara de Lonso Lab.

---

## 4. Qué NO reutilizar

- **Precios y planes** (pedido explícito del usuario). Tampoco "Mes 1: $30.000", "Normal:" tachado, "Estructura de Capital" ni los nombres de plan.
- **Jerga de IA y corporativa** ("Protocolo", "Ecosistema", "Enterprise", "SLA", "API"). La IA va **tras bambalinas**: Lonso vende resultados (te encuentran, te llaman, te eligen).
- **"Tú" neutro** ("Olvídate", "Contáctanos", "Produce"). Lonso habla en **voseo rioplatense** ("vendés", "Quiero mi auditoría", "Elegí").
- **Azul eléctrico `#3B82F6` como acento principal**. Se usan el naranja de los CTA de Lonso, su azul de líneas topográficas y el crema. El **negro sí sirve** para reels dramáticos, porque el logo del oso es blanco sobre negro.
- **Fotos de Unsplash** (hero, manifiesto, tarjetas 1, 4 y 5 del archivo, galería 3, 4 y 5): son stock y **no son trabajos propios**. Nunca deben aparecer como portafolio.
- **`streetwear.jpg`** (copiado como `...-REFERENCE-ONLY.jpg`): es un póster generado con IA que tiene **texto deformado, el dominio de otra marca ("DUREX.CO.UK/FASHION") y un precio "£69,99"**. Sirve solo como referencia de layout de póster (wordmark dentro de una píldora con contorno y bloques de texto en las cuatro esquinas). **No se publica.**
- **Marca de agua "Veo"**: ya se quitó con el recorte en `nextro-flower-giant-veo-nobars.mp4`, pero conviene **mantener la etiqueta "Contenido generado con IA"** al publicar (Instagram o TikTok la piden).
- **Mail y teléfono personales del footer de Nextro**: no se ponen en los reels salvo que el usuario lo confirme. El CTA es el de Lonso ("Auditoría gratis").
- **Todo en gris**: es frío. La escala de grises se usa solo como estado "antes".
- **Párrafos largos** (hero.description, metodología): en un reel, como máximo unas 8 palabras por pantalla.
- Otras notas: el sitio arranca en inglés por defecto, el `<link rel="icon">` apunta a `/vite.svg` (que no existe) y en el Chromium headless el `<video>` H.264 de la galería sale en negro. Ninguna afecta a los reels.

---

## 5. Ideas de rebrand

1. **"Nosotros también nos rebrandeamos"** (si se confirma que Nextro → Lonso Lab). Se muestra el hero oscuro de Nextro (`screens/desktop-es-01-hero.png`), con su wordmark genérico y el azul, que se **desenfoca y queda atrás como en el apilado del Archivo**. Encima sube la tarjeta de Lonso Lab con el oso, el crema y el naranja. Remate: "Practicamos lo que vendemos." Es prueba de oficio sin mostrar clientes.
2. **De gris a color**: el logo, la fachada o el feed "antes" en escala de grises al 70 %, y un barrido que los colorea con la identidad nueva (efecto hover de la galería).
3. **Contorno a relleno**: el nombre de la marca nueva aparece solo en contorno (`.text-border`) y se llena. Es la identidad que toma forma.
4. **Palabras fantasma gigantes**: "ANTES" y "DESPUÉS" al 5 % de opacidad de fondo, como "ARCHIVO".
5. **Expedientes**: `REBRAND.001 // PANADERÍA`, con etiqueta mono, título en serif itálica y antes/después en una tarjeta apilada.
6. **Aplicaciones de marca** (como la tarjeta "Streetwear Brand: identidad aplicada a camperas, abrigos y accesorios"): un montaje rápido del logo nuevo en cartel, uniforme, bolsa, perfil de IG, pin de Google Maps y vidriera.
7. **Tratamiento 3D cromado** (referencia `logo-3d.png`): la "L" del oso en vidrio o cromo para el clímax del reel de rebrand.
8. **"Naturaleza es el algoritmo" con el oso**: el gigante de flores que despierta se vuelve "**tu marca está hibernando**". El oso de Lonso despierta, se sacude la marca vieja y sale. Es un concepto narrativo propio de Lonso que hereda la idea de Nextro sin copiarla.

### Estructuras de reel derivadas de Nextro (para el guionista)
- **A. Manifiesto cinético** (15–20 s, negro con grano): pregunta en gris, respuesta en blanco bold, transiciones de desenfoque y cierre "y esto es / LONSO LAB" con chip de "Agenda abierta".
- **B. Mazo de servicios** (20–30 s): tarjetas apiladas, una por servicio, cada una con su motivo lineal. La última se invierte a crema y naranja.
- **C. Elegí** (10–15 s): cold open con dos píldoras ("seguir invisible" / "que te encuentren"), pantallas de Lonso que pasan de gris a color y CTA.
- **D. Rebrand** (20–30 s): Nextro → Lonso (o un negocio genérico): contorno a relleno, aplicaciones de marca y la L del oso en cromo.
