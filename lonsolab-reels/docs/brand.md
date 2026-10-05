# Lonso Lab — Brand kit para reels

Fuente: crawl de https://lonsolab.com, 2026-10-05 (todas las páginas del sitemap: `/`, `/maps`, `/redes`, `/web`, `/casos`, `/nosotros`, `/contacto`, `/terminos`, `/privacidad`).
El sitio es HTML estático con JS liviano (animaciones, demo, calculadora). Tiene una sola hoja de estilos y una sola fuente.
Hay copias crudas en `assets/web/raw/` (HTML de cada página, `site.css`, `site.js`).

> **REGLA PARA LOS REELS: no mostrar precios.** Todo lo marcado con **[PRECIO]** o **[%]** es texto para referencia y no puede aparecer en pantalla, en la locución ni en los subtítulos. Tampoco hay que mostrar en pantalla las capturas de componentes que tienen `HAS-PRICE(S)` en el nombre.

Idea visual del sitio, según el comentario en `site.css`: *"Mundo visual: cartografía de las sierras de Córdoba. Papel de mapa, tinta azul noche, cobalto para las superficies de marca y naranja 'pin' reservado para tu negocio y la acción."*

---

## 1. Colores

### Tokens principales (`:root` de `site.css`)

| Token | Hex | Dónde se usa |
|---|---|---|
| `--papel` | `#f3f4ef` | Fondo del sitio (crema/papel de mapa). También es `theme-color`, el texto sobre cobalto o tinta y el color del logo en el favicon |
| `--papel-2` | `#e8eae2` | Fondo de la sección "Trabajos" |
| `--blanco` | `#ffffff` | Tarjetas, panel de la demo de Google y la tarjeta de servicio Maps |
| `--tinta` | `#13182b` | Azul noche/navy: texto principal, títulos, logo del header, fondo de la sección "Podés aprender todo esto solo", de la tarjeta Sitios web y del footer. También es el botón `boton-tinta` |
| `--tinta-2` | `#4a5168` | Texto secundario (lead, párrafos, `.chico`) |
| `--linea` | `#d3d7df` | Bordes y separadores |
| `--cobalto` | `#2340d8` | Azul eléctrico de marca: líneas topográficas, tarjeta de Redes, plan destacado, cierre (CTA final), fondo del favicon, cursor, selección e íconos de check |
| `--cobalto-hondo` | `#182c9e` | Oso del logo en marca de agua sobre cobalto (cierre) y hover |
| `--cobalto-claro` | `#c9d2ff` | Texto secundario sobre cobalto |
| `--pin` | `#ff5a26` | Naranja "pin": **CTA principal** (`.boton-pin`, con texto tinta), pin de "tu negocio" en el mapa, checks sobre cobalto, slider, foco y tachado de las objeciones |
| `--pin-hondo` | `#e8461a` | Naranja más oscuro (pressed) |
| hover pin | `#ff7a4d` | Hover del CTA naranja |

### Secundarios (de la UI del sitio, útiles para mockups)

| Hex | Uso |
|---|---|
| `#1b2137` / `#2f3650` | Panel de la calculadora sobre tinta (fondo y borde) |
| `#232a42` / `#39405a` | Chips de herramientas y conmutador oscuro (fondo y borde) |
| `#b9bfd3`, `#d8dcea`, `#c8ccda` | Textos claros sobre tinta y texto del footer |
| `#6f86ff` | Barra "Google Maps" (cobalto aclarado) y líneas topo sobre tinta |
| `#e4e9fb` | Fondo de los íconos de acceso |
| `#eef0f5` | Barra de búsqueda de la demo de Google |
| `#e6ebf3` / `#9fb0d8` | Mini-mapa de la demo (fondo y curvas de nivel) |
| `#e3e6ee` | Fondo del conmutador "Hoy / Con Lonso Lab" |
| `#e7a614` | Estrellas de calificación |
| `#22a35a` | Burbuja de "Llamada entrante" |
| `#1f9d55` (hover `#178046`) | Botón flotante de WhatsApp |
| `#1d7a3e` / `#eaf6ee` | Verde de OK: "Ficha completa · reseñas respondidas" y ahorro |
| `#b42318` | Rojo de alerta: "Ficha incompleta · reseñas sin responder" |
| `#fff4ef` | Fondo rosado suave del resultado "tuyo" resaltado |
| `#c9ced8` | Línea punteada del camino de 3 pasos |
| `#f6efdf → #e9dfc8 → #dccfb1` | Gradiente arena del mockup de Terra Firma |
| `#0d0c0a`, `#34312c` | Marco del navegador y del teléfono del mockup de Terra Firma |

Combinaciones que usa el sitio:
- **papel + tinta + acento cobalto** (por defecto)
- **cobalto + papel + CTA pin** (Redes, plan destacado y cierre)
- **tinta + papel + CTA pin** ("Hacerlo solo" y Sitios web)

En todas, el naranja se reserva para la acción y para "tu negocio".

Tokens en formato JSON: `assets/brand/tokens.json`.

---

## 2. Tipografía

**Una sola familia: Archivo** (Omnibus-Type, Google Fonts, licencia SIL OFL 1.1, se puede embeber y redistribuir). Es variable, con `wght` 100–900 y `wdth` 62–125%.
- `@font-face` del sitio: `src: url("/assets/fonts/archivo-latin-var.woff2")`, `font-weight: 100 900; font-stretch: 62% 125%`. El sitio no usa Google Fonts por CDN: la fuente está alojada en el propio servidor.

| Rol | Peso / ancho | Otros |
|---|---|---|
| Body | 400 / 100% | 1.0625rem, line-height 1.6, `lining-nums` |
| H1 del hero y de cabeceras | **820 / 112%** | letter-spacing −0.04em, line-height 0.94–0.95 |
| H2/H3 | **780 / 108%** | letter-spacing −0.03em (h3 −0.02em), line-height 1.02 |
| Cierre H2 | 780 / 112% | −0.04em, lh 0.95 |
| `strong` | 680 | |
| Botones | 680 / 104% | −0.005em, pill de 999px, altura mínima 52px |
| Enlaces | 620 | subrayado con offset 0.22em |

### Archivos locales (`assets/brand/fonts/`)
- `archivo-latin-var.woff2`: archivo **exacto del sitio** (variable, latin).
- `Archivo-Variable-latin.ttf`: el mismo, convertido a TTF (variable).
- `Archivo-Italic-Variable-latin.ttf`: itálica variable (de @fontsource-variable/archivo).
- `fontsource-archivo-latin-ext-wdth-normal.woff2`: subset latin-ext (variable).
- `fontsource-archivo-latin-wdth-italic.woff2`
- `OFL-LICENSE.txt`
- `static/`: instancias estáticas TTF para herramientas sin soporte de fuentes variables (ffmpeg drawtext, Pillow, etc.):
  - `Archivo-Hero-W820-S112.ttf`: titulares grandes, idéntico al H1 del sitio
  - `Archivo-Heading-W780-S108.ttf`: h2/h3
  - `Archivo-Black-W900-S112.ttf`
  - `Archivo-ExtraBold-W800-S100.ttf`
  - `Archivo-Bold-W700-S100.ttf`
  - `Archivo-Strong-W680-S100.ttf`
  - `Archivo-Button-W680-S104.ttf`
  - `Archivo-SemiBold-W620-S100.ttf`
  - `Archivo-Medium-W500-S100.ttf`
  - `Archivo-Regular-W400-S100.ttf`
  - `Archivo-Condensed-W800-S75.ttf`: comprimida, buena para textos de impacto en mayúsculas
  - `Archivo-Expanded-W800-S125.ttf`: expandida

Las tildes, la ñ y los signos ¿ ¡ se probaron y se renderizan bien.

Con CSS en Remotion o en navegador conviene usar el woff2 variable y animar `font-stretch` y `font-weight`.

---

## 3. Logo

El sitio tiene el logo en **SVG vectorial inline**: el lockup del header y el footer, el `logo-mark` del oso en el cierre y el favicon SVG. El JPEG de OG `https://lonsolab.com/assets/img/brand/lonso-logo.jpeg` es **idéntico byte a byte** a `logo-original.jpg`. Como ya había vector oficial, **no hizo falta vectorizar (potrace)**.

En `assets/brand/`:

| Archivo | Qué es |
|---|---|
| `logo-full.svg` (+ `-white`, `-papel`, `-cobalto`) | Lockup horizontal oficial: oso en L + "LONSO LAB". viewBox 5899×1312 |
| `logo-mark.svg` (+ variantes) | Solo el ícono: la L con el oso. viewBox `1155 734 1019 1320` |
| `logo-wordmark.svg` (+ variantes) | Solo el texto "LONSO LAB", recortado del lockup |
| `logo-stacked.svg` (+ variantes) | Versión apilada (ícono arriba y wordmark abajo) que reproduce la composición de `logo-original.jpg`. Armada con los vectores oficiales |
| `favicon.svg` | Cuadrado redondeado cobalto `#2340D8` (rx 14/64) con el ícono en papel `#F3F4EF` |
| `logo-original.jpg` / `lonso-logo-site.jpeg` | Raster 1080×1080: blanco sobre negro, apilado |
| `png/` | PNG transparentes: `logo-mark-{navy,white,papel,cobalto,pin}-1024.png` (790×1024), `logo-full-*-{1024,2048}.png`, `logo-stacked-{navy,white,papel,cobalto}-1024.png`, `logo-wordmark-*-2048.png`, `favicon-512.png` |
| `icons/` | Sprite de íconos del sitio (stroke 1.8, redondeados, 24×24): buscar, pin, tel, ruta, check, chat (WhatsApp), mas, pausa, play, cámara, estrella, gráfico, calendario, capas, externo, candado, reloj, equipo, flecha, web. `sprite.svg` los reúne a todos |

Usos de color del logo en el sitio:
- tinta sobre papel (header)
- papel sobre tinta (footer)
- papel sobre cobalto (favicon)
- `cobalto-hondo` al 55% como marca de agua gigante sobre cobalto (cierre)

---

## 4. Motivos visuales

- **Mapa topográfico, el motivo principal.** Es un `<symbol id="mapa" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">` con 2 paths: `.topo-minor` (stroke 1, opacidad 0.32) y `.topo-major` (stroke 1.5, opacidad 0.6). El stroke es `currentColor` con `vector-effect: non-scaling-stroke`, y se reutiliza con `<use>`. Representa las curvas de nivel de las sierras de Córdoba.
  - Archivos: `assets/brand/motifs/topo-map.svg` (cobalto sobre papel) y `topo-map-currentColor.svg` (para recolorear).
  - PNG 1080×1920 y 1600×1000: `topo-cobalto-on-papel`, `topo-papel-on-cobalto`, `topo-cobalto-on-tinta`, `topo-cobalto-lines-transparent`, `topo-white-lines-transparent`.
  - Uso en el sitio: en el hero, en cobalto con máscara `linear-gradient(100deg, transparent 8%, #000 52%)`; en el cierre, en papel al 22% sobre cobalto; en la tarjeta Maps, en cobalto al 35% con fade hacia abajo.
- **Animación "trazar"** de las líneas topo: `stroke-dasharray: 2400` y `stroke-dashoffset` de 2400 a 0 en 3.2s con easing `salida`.
- **Animación "estirar" del titular**: `font-stretch` de 68% a 112%, con blur de 6px a 0 y translateY de 0.18em. El CSS la describe como *"la tipografía se expande, como algo que despega"*. Encaja directo con el concepto "despegar".
- **Demo de búsqueda en Google**: buscador tipo pill, mini-mapa con curvas de nivel y calles blancas, pines numerados 1–2–3 en tinta y el pin naranja de "tu negocio" con onda. Hay una lista de resultados con estrellas. "Tu negocio" aparece fuera del top ("Ficha incompleta · reseñas sin responder", en rojo) y con Lonso Lab sube al #1 ("Ficha completa · reseñas respondidas", en verde), con el toast **"Llamada entrante: Un cliente nuevo te encontró en Google"**.
  - Escenarios de la demo, cada uno con su búsqueda y la competencia que aparece:
    - "ferretería cerca de mí": Ferretería Central 4,6 (212), Corralón del Sur 4,4 (98), Ferretería El Tornillo 4,3 (61)
    - "pizzería abierta ahora": Pizzería La Esquina 4,7 (530), Pizzas del Centro 4,5 (214), La Pizzería de Siempre 4,2 (87)
    - "peluquería en Córdoba": Estudio de Pelo 4,8 (176), Corte y Estilo 4,5 (92), Barbería Norte 4,4 (140)
    - "taller mecánico cerca": Taller San José 4,7 (301), Mecánica Integral 4,5 (126), Lubricentro Ruta 20 4,3 (74)
- **Pila de 14 herramientas**: chips que caen en "caos" ("Hacerlo solo") y se ordenan con "Con Lonso Lab". Son: Perfil de Empresa de Google, Meta Business Suite, Administrador de anuncios, Google Ads, CapCut, Canva, Estadísticas de Instagram, Guiones para reels, Calendario de contenido, Respuesta a reseñas, SEO local, Segmentación de públicos, Tendencias y audios, Reportes mensuales.
- **Conmutador "Hoy | Con Lonso Lab"**: un antes y después en forma de pill.
- **Camino de 3 pasos**: círculos numerados unidos por una línea punteada. El paso 3 va relleno en naranja.
- **Objeciones tachadas**: comillas con la frase atravesada por una línea naranja ("Ya probé con el botón de promocionar.").
- **Radios**: `--radio` 18px y `--radio-chico` 10px. Los paneles usan 24px, los chips 12–14px y los botones/pills 999px. Pines con `border-radius: 50% 50% 50% 0` rotados 45° (forma de gota).
- **Sombras**: panel `0 1px 2px rgb(19 24 43/.06), 0 24px 48px -24px rgb(19 24 43/.32)`; flotante `0 2px 6px rgb(19 24 43/.08), 0 18px 36px -18px rgb(19 24 43/.4)`.
- **Easing**: `salida` es `cubic-bezier(0.16, 1, 0.3, 1)` (expo-out suave) y `rebote` es `cubic-bezier(0.34, 1.4, 0.5, 1)`.
- **Capturas de componentes a 2x**, en `assets/web/screens/components/`:
  - `header.png`
  - `hero-demo-hoy.png`
  - `hero-demo-con-lonsolab.png`
  - `pain-points.png`
  - `tools-pile-caos.png`
  - `tools-pile-orden.png`
  - `redes-fan.png`
  - `trabajos-grid.png`
  - `case-705326-views.png`
  - `case-terrafirma-web.png`
  - `case-mpj-fitness-map.png`
  - `mpj-fitness-map-only.png`
  - `process-3-steps.png`
  - `faq.png`
  - `closing-cta.png`
  - `footer.png`
  - con precios, **no usar en reels**: `calculator-HAS-PRICES.png`, `service-*-card-HAS-PRICE.png`

---

## 5. Tono de voz

- **Español rioplatense con voseo**, directo, cercano y sin tecnicismos. Ejemplos: "aparecés", "vendés", "tenés", "podés", "empezá", "mirá", "escribinos", "nos pasás", "filmás", "aprobás", "decidís", "sumá", "elegí".
- Usa frases cortas y punzantes en pares: "Que te encuentren. Que te elijan." / "Un equipo detrás. Tu negocio adelante." / "Vos filmás. Te guiamos."
- Habla del dolor sin dramatizar y con lógica comercial: el cliente ya te está buscando y, si no te ve bien, le compra a otro.
- Es honesto y no promete milagros ("Sin promesas imposibles", "No garantizamos una posición ni una cantidad de ventas"). Los reels pueden crear urgencia, pero sin prometer rankings ni ventas garantizadas.
- Se apoya en la prueba: "No te pedimos que nos creas. Mirá el trabajo."
- La acción es siempre por WhatsApp, con la **auditoría gratis** como primer paso.

---

## 6. Banco de mensajes (citas textuales)

Marcas: **[PRECIO]** = contiene montos en $ (no usar en reels). **[%]** = contiene descuentos o porcentajes comerciales (evitar en reels: también son pricing). Lo que no tiene marca se puede usar.

### 6.1 Titulares (H1/H2)
- "Te están buscando. Y encuentran a otro." (H1 del home)
- "Cada día que no aparecés, alguien le compra a otro."
- "Podés aprender todo esto solo. La pregunta es cuánto te va a costar."
- "Que te encuentren. Que te elijan."
- "No te pedimos que nos creas. Mirá el trabajo."
- "Empezar es simple. Y el primer paso es gratis."
- "Precios claros. Sin permanencia." (titular de la sección de precios; evitar)
- "Todo claro desde el principio."
- "Tu próximo cliente ya está buscando. Que te encuentre a vos." (cierre en todas las páginas)
- /maps: "Tu negocio, primero en el mapa."
- /redes: "Tu marca, con algo para decir."
- /web: "Tu negocio, con una web que vende."
- /casos: "No te lo contamos. Te lo mostramos."
- /nosotros: "Un equipo detrás. Tu negocio adelante."
- /contacto: "Primero lo vemos. Después decidís."
- Títulos de servicio:
  - "Aparecé cuando te buscan." (Maps)
  - "Dales motivos para elegirte." (Redes)
  - "Una web que cierra la venta." (Web)
- Otros H2:
  - "Lo que hacemos por tu negocio"
  - "Un plan para cada etapa."
  - "Juntos funcionan mejor."
  - "Seguí recorriendo."
  - "Cómo trabajamos."
  - "Así hacemos tu web."
  - "Un solo pago. Sin sorpresas." [contexto de precio]
  - "Los números, con el contexto completo."
  - "Piezas pensadas para frenar el scroll."
  - "Una idea, una identidad, tres piezas que conectan."
  - "La forma más rápida: WhatsApp."
  - "Tus reseñas también venden en tu web."
  - "Terra Firma: un hotel boutique que se reserva desde su web."

### 6.2 Dolores y pérdidas
- "Todos los días, gente de tu zona busca en Google e Instagram lo que vendés. Si tu ficha está incompleta o tus redes están quietas, le compra a la competencia. Nosotros hacemos que te encuentren y te elijan."
- "Tu negocio puede ser el mejor de la zona. Si no se ve bien en Google y en redes, para el cliente no existe."
- "Ficha incompleta · reseñas sin responder" / "Fuera de los primeros resultados" (estado "Hoy" de la demo)
- "Hacerlo bien exige dominar más de una docena de herramientas y tareas que cambian todo el tiempo. Nosotros ya las usamos todos los días. Vos no tenés por qué pagar la curva de aprendizaje con tu tiempo ni con tu plata."
- "Hacerlo solo: 14 herramientas y tareas para aprender, actualizar y sostener cada semana."
- "Una reseña sin respuesta también habla de tu negocio."
- "Para dejar de ser invisible cuando te buscan." (subtítulo del plan Base; usable sin el precio)

### 6.3 Objeciones y respuestas
- "**Ya tengo la ficha de Google.**" → "Tenerla no alcanza. Sin fotos actuales, horarios al día y reseñas respondidas, el cliente duda un segundo y toca el resultado de al lado."
- "**Subo algo a Instagram cuando puedo.**" → "Una cuenta que publica cada tanto parece un negocio que cerró. El que entra a tu perfil no pregunta: se va."
- "**Ya probé con el botón de promocionar.**" → "Promocionar sin estrategia es pagar para que te vea gente que nunca te va a comprar. El presupuesto se va y las consultas no llegan."
- "**Podés aprender todo esto solo.**" → "La pregunta es cuánto te va a costar."
- "No tengo equipo de filmación" → "Te decimos qué tomas hacer con tu celular, plano por plano. Sin equipos de filmación."
- "¿Me van a pedir las claves?" → "Accedemos con los permisos oficiales de Google y Meta. Nunca te pedimos contraseñas."
- "¿Me ato a un contrato?" → "Mes a mes, sin permanencia. La confianza se construye trabajando." / "Te quedás porque querés."
- "¿Pierdo el control de lo que se publica?" → "Nada se publica sin tu aprobación." / "Nada sale sin tu visto bueno."

### 6.4 Promesas y beneficios
- "Nosotros hacemos que te encuentren y te elijan."
- "Google Maps te pone delante de quien ya está buscando. Las redes le dan motivos para elegirte. Tu web es donde todo se concreta. Funcionan mejor juntos, y podés empezar por uno."
- "Maps + Redes + Web: que te encuentren, te elijan y te escriban." (frase del pack; usar sin precio)
- Lemas del armador de pack: "Que te encuentren" (Maps), "Que te elijan" (Redes), "Que te escriban" (Web).
- "Vos seguís con tu negocio. Nosotros nos ocupamos de que se vea."
- "Vos llevás el negocio. Nosotros, su presencia digital."
- "Vos sabés lo que hacés. Nuestro trabajo es que más personas también lo sepan."
- "Convertimos lo que hace valioso a tu negocio en una presencia digital clara, constante y profesional."
- "Nos involucramos en tu negocio, proponemos una estrategia y hacemos que las cosas pasen. Nos gusta el trabajo que se puede mostrar."
- "Con Lonso Lab: las 14 resueltas por un equipo que las usa todos los días."
- "Llamada entrante. Un cliente nuevo te encontró en Google." (toast de la demo)
- "Ficha completa · reseñas respondidas" / "Abierto ahora"
- "Tu ficha de Google y tus redes llevan a tu web, y tu web lleva a tu WhatsApp."
- "La web es donde la gente decide. Si tu ficha de Google y tus redes llevan gente a tu web, llegan con ganas de comprar."
- "Producción propia, diseño con identidad y resultados medidos."
- "Tu marca publicando todas las semanas, sin que te ocupes vos." (subtítulo de Esencial)
- "Para llegar a gente nueva, no solo a tus seguidores." (Crecimiento)
- "Tu marca presente todos los días, con calidad de productora." (Full)
- "Más reseñas reales y más alcance local." (Activo)
- "Para competir con una estrategia más completa." (Pro)

### 6.5 Prueba social y casos reales (con números)
- **@ingrid_van_der_veen (Instagram)**: "**705.326** visualizaciones en 30 días" (del 7 de julio al 5 de agosto; fuente: estadísticas de Instagram).
  - "El **93,7%** de quienes lo vieron no seguía la cuenta: llegamos a gente nueva."
  - Origen de las visualizaciones: campañas pagas que administramos 93,9%; sin pagar (orgánicas) 6,1%.
  - "**4.278** interacciones: me gusta, comentarios, guardados y compartidos." Origen: 68,7% pagas y 31,3% orgánicas. Formato: Historias 47,6%, Reels 41,9%, Publicaciones 10,5%.
  - Disclaimer: "Este caso refleja el resultado de una cuenta y un período concretos; no garantiza resultados futuros."
  - Estos porcentajes son métricas, no precios: se pueden usar.
- **MPJ Fitness (Google Maps)**: "Gimnasio en Av. Martín Tissera 702, Mendiolaza. Gestionamos su ficha de Google, que tiene calificación **5,0**." Tarjeta de mapa: "MPJ Fitness 5,0 ★". Link: https://maps.app.goo.gl/4z2X6mp4jndLiunF9
- **Terra Firma (sitio web)**: hotel boutique en el centro de Villa Carlos Paz, https://terrafirma.com.ar/
  - "**4,7 sobre 5** en Google con **5.807 opiniones** y **9,6 en Booking**"
  - "Reservas directas con el hotel, sin intermediarios"
  - "Seis tipos de habitación con galería y un comparador para elegir"
  - "Restaurante, servicios y un formulario de eventos que llega por WhatsApp"
  - "Datos estructurados para que Google entienda dirección, teléfono y ubicación"
  - "Diseño a medida, pensado primero para el celular"
  - "En Terra Firma, cada visitante ve el 4,7 sobre 5 con 5.807 opiniones antes de reservar."
- **Reels**:
  - "De una toma a una historia. Material del cliente. Guion, edición, subtítulos y música del equipo."
  - "Reel de producto, de la toma al posteo." / "Producto en acción, con guion y subtítulos."
- **Carrusel**:
  - "Una marca que se reconoce. Carrusel para @ingrid_van_der_veen."
  - "La primera placa engancha. La segunda desarrolla el concepto. La tercera cierra y deja la acción."

### 6.6 Garantías y microcopys de confianza
- "Auditoría gratis en 24 h hábiles"
- "Sin permanencia"
- "Nunca te pedimos contraseñas"
- "Sin costo, sin compromiso y sin pedirte contraseñas."
- "Sin letra chica. Y si te queda alguna duda, estamos del otro lado."
- Reglas de /nosotros:
  - "Tus cuentas son tuyas."
  - "Te quedás porque querés."
  - "Los números, claros." ("Un reporte mensual para entender qué funciona y qué sigue.")
  - "Sin promesas imposibles." ("No vendemos un primer puesto ni ventas garantizadas. Trabajamos con objetivos y seguimiento.")
- "2 rondas de ajustes por pieza, sin costo."
- "El material final producido y abonado queda para tu negocio."

### 6.7 CTAs (textos de botón)
- "Quiero mi auditoría gratis" (principal, botón naranja)
- "Auditoría gratis" / "Pedir auditoría gratis" (header)
- "Pedí una auditoría gratis de tu Google Maps. Te enviamos 5 mejoras concretas en 24 horas hábiles, sin compromiso."
- "Empezá con una auditoría gratis de tu Google Maps. En 24 horas hábiles sabés qué mejorar y por dónde arrancar."
- "Mandanos el nombre de tu negocio y tu ciudad. Con eso arrancamos."
- "Quiero que lo hagan por mí"
- "Escribinos por WhatsApp" / "Pedirla por WhatsApp" / "Escribinos"
- "Quiero mi web" / "Pedir presupuesto" / "Consultar este plan"
- "Prefiero completar un formulario" / "Pedir mi auditoría gratis"
- "Mirá el trabajo" / "Ver todos los trabajos" / "Ver la ficha en Google Maps" / "Visitar el sitio"
- Mensaje precargado de WhatsApp (CTA principal): "Hola, quiero la auditoría gratis de mi ficha de Google. Mi negocio es: "
- Mensaje genérico: "Hola, vi la web de Lonso Lab. Quiero mejorar la presencia de mi negocio. ¿Cómo empezamos?"
- A evitar:
  - "Ver planes y precios" / "Ver el precio" [contexto de precio]
  - "Armar mi pack" / "Quiero este pack" [%]

### 6.8 Textos con precio o descuento (NO usar en reels)
- [PRECIO] Meta description del home: "...Desde $90.000 ARS por mes. Auditoría gratis en 24 horas hábiles. Sin permanencia." Las metas de /maps, /redes y /web repiten "Desde $90.000", "$190.000" y "$450.000".
- [PRECIO] Tarjetas y planes:
  - Google Maps: "Desde $90.000 por mes" (Base $90.000 · Activo $140.000 · Pro $220.000)
  - Redes: "Desde $190.000 por mes" (Esencial $190.000 · Crecimiento $320.000 · Full $480.000)
  - Web: "Desde $450.000 en un solo pago"
  - Accesos: "A medida, desde $450.000 en un pago"
- [PRECIO][%] Pack completo:
  - "Desde, por mes $280.000 → $224.000 y tu web a $337.500 ($450.000)"
  - "Te ahorrás $56.000 por mes, y $112.500 en la web"
  - "Web + un plan mensual: la web con 15% de descuento: $382.500"
- [PRECIO] Calculadora:
  - "Hacerlo vos te cuesta unos $259.800 por mes en horas que no estás atendiendo tu negocio. Son 312 horas al año." (con 6 h/semana a $10.000/h)
  - "¿Y tu web? Desde $450.000, en un solo pago, y con descuento si la sumás a un plan."
  - Uso sin cifras: la idea de "¿Cuánto vale tu tiempo?" y "horas que no estás atendiendo tu negocio" sirve si se dice sin montos.
- [%] Descuentos:
  - "20% menos en Maps y Redes, todos los meses"
  - "Tu web con 25% de descuento"
  - "Maps + Redes 15% menos por mes"
  - "Sumá Redes sociales y ahorrás 15% todos los meses..."
  - Respuesta del FAQ "¿Tengo que contratar todo junto?" (lleva 15%, 20% y 25%)
  - "Máximo ahorro" / "Cuantos más servicios sumás, más ahorrás."
- [PRECIO] Notas legales:
  - "Precios de partida en pesos argentinos. Los planes mensuales se pagan por mes adelantado..."
  - "Precio en pesos argentinos, por mes adelantado. Sin permanencia: baja avisando con 15 días."

---

## 7. Servicios y features (sin precios)

### Google Maps: gestión del Perfil de Empresa de Google
"Gestionamos tu Perfil de Empresa de Google para que quien busca cerca encuentre una buena razón para llamarte o ir."

Pilares:
- "Una ficha que invita": categorías, servicios, fotos, horarios y enlaces claros.
- "Reseñas atendidas": respondemos todas, buenas y malas, con el tono de tu marca.
- "Resultados a la vista": cada mes sabés cuántos te vieron, te llamaron y te pidieron cómo llegar.

Features:
- Ficha completa y optimizada para las búsquedas de tu zona
- Respuesta a todas las reseñas
- Publicaciones semanales y fotos ordenadas por categoría (fachada, interior, productos, equipo)
- Sistema para conseguir más reseñas reales: QR de mostrador o mesa, link corto por WhatsApp, guion para pedirla sin incomodar
- SEO local con las búsquedas reales de tu rubro y tu zona
- Mínimo 10 fotos nuevas por mes (Activo)
- Seguimiento de posición en el "pack de 3" y análisis mensual de la competencia local
- Test A/B de categorías y descripción
- Preguntas y respuestas gestionadas
- Refuerzo en temporada alta
- Administración de Google Ads (la pauta se paga aparte)
- Reporte mensual

Niveles: Base ("Para dejar de ser invisible cuando te buscan"), Activo ("Más reseñas reales y más alcance local") y Pro ("Para competir con una estrategia más completa").

### Redes sociales: estrategia, reels, diseño y comunidad (Instagram y Facebook)
"Estrategia, guion, edición y diseño. Vos nos compartís el material; nosotros lo convertimos en contenido con identidad."

Pilares:
- "Vos filmás. Te guiamos." (lista de tomas plano por plano, sin equipos)
- "Contenido que se reconoce" (una misma dirección visual)
- "Publicás con un plan" (calendario mensual que aprobás)

Features:
- Estrategia y línea visual de la marca
- Calendario mensual aprobado por vos
- Reels con guion, edición, subtítulos, música y corrección de color
- Placas, carruseles e historias con identidad propia
- Lista de tomas y acompañamiento por WhatsApp mientras filmás
- Gestión de comentarios y mensajes directos, con las consultas de compra bien derivadas ("para que ningún interesado quede sin respuesta")
- Hashtags, geolocalización y tendencias
- Colaboraciones con creadores locales
- Campañas para fechas clave
- Administración de pauta en Meta (presupuesto aparte)
- Reporte mensual con lo que funcionó y lo que sigue
- Reunión mensual (Full)

Niveles: Esencial (4 reels/mes), Crecimiento (6 reels/mes) y Full (10 reels de alta producción). Las cantidades se pueden mencionar; los precios no.

### Sitios web a medida (pago único)
"Diseñamos y hacemos la web de tu negocio a medida: clara, pensada para el celular y conectada con tu WhatsApp, tu ficha de Google y tus redes."

Pilares:
- "Diseño a medida" (nada de plantillas genéricas)
- "Hecha para que te contacten" (WhatsApp, reservas, catálogo, cómo llegar)
- "Tus reseñas, como prueba" (Google y Booking en la web)

Features:
- Pensada primero para el celular
- Botón de WhatsApp, mapa y contacto
- Secciones para lo que vendés: productos, servicios, habitaciones o carta
- Reseñas destacadas
- Enlace a reservas, turnos o catálogo
- Títulos, descripciones y datos estructurados para Google

Proceso web:
1. "Nos contás tu negocio"
2. "Diseñamos y te mostramos"
3. "Publicamos" ("Tu web sale online, conectada con tu WhatsApp, tu ficha de Google y tus redes.")

### Pack (Maps + Redes + Web)
"Que te encuentren, te elijan y te escriban." "Una sola estrategia para los tres."

### Rebrand / identidad
El sitio no lo ofrece como servicio aparte, pero se apoya en estas frases:
- "Placas, carruseles e historias con identidad propia"
- "Estrategia base y línea visual de la marca"
- "Diseño a medida con la identidad de tu negocio"
- "Contenido que se reconoce… para que tu marca se identifique al primer vistazo"
- "Una marca que se reconoce."

---

## 8. Proceso en 3 pasos (home y /nosotros)
1. **Auditoría gratis** (*En 24 horas hábiles*): "Nos pasás el nombre de tu negocio y tu ciudad. Revisamos tu ficha y a tu competencia, y te mandamos 5 mejoras concretas."
2. **Puesta en marcha** (*Durante el primer mes*): "Optimizamos tu ficha, definimos la estrategia y armamos el calendario. Nada se publica sin tu aprobación."
3. **Gestión y resultados** (*Mes a mes, sin permanencia*): "Cada mes gestionamos todo y te mandamos un reporte claro: cuántos te vieron, te llamaron y te pidieron cómo llegar."

Versión de /contacto:
1. "Nos contás sobre tu negocio."
2. "Revisamos tu ficha y a tu competencia."
3. "Recibís el diagnóstico y decidís cómo seguir."

---

## 9. FAQ (textual)
- **¿Sirve para mi negocio?** "Si tenés un comercio, un local o prestás servicios en una zona, sí. Adaptamos la estrategia a tu rubro, a tu competencia y a tus clientes."
- **¿Tengo que contratar todo junto?** [%] "No. Podés elegir un solo servicio. Si combinás, ahorrás: Maps + Redes tiene 15% menos todos los meses; tu web tiene 15% de descuento si la sumás a un plan mensual; y con los tres juntos, 20% menos por mes y la web con 25% de descuento." (En reels, usar solo "No. Podés elegir un solo servicio.")
- **¿Hay permanencia o costo de inicio?** "Trabajamos mes a mes, sin permanencia. La puesta en marcha está incluida. Para dar de baja, avisá con 15 días de anticipación."
- **¿Cuándo voy a ver resultados?** "Los cambios en tu ficha se ven en la primera semana. Las mejoras en consultas y visibilidad llevan más tiempo y dependen de tu rubro y tu competencia. No garantizamos una posición ni una cantidad de ventas: trabajamos con objetivos y te mostramos los números cada mes."
- **¿Qué tengo que hacer yo?** "Contarnos sobre tu negocio, aprobar el contenido y compartir fotos o videos cuando los necesitemos. Te damos una guía de tomas. Accedemos con los permisos oficiales de Google y Meta, sin pedirte contraseñas."
- **¿Qué pasa con los anuncios y el material?** "El presupuesto publicitario se paga aparte y directo a Google o Meta. El material final producido y abonado queda para tu negocio. Cada pieza incluye dos rondas de ajustes."

---

## 10. Contacto
- **WhatsApp:** +54 3541 33-7818 (`https://wa.me/5493541337818`)
- **Email:** contacto@lonsolab.com
- **Web:** lonsolab.com
- **Horario:** lunes a viernes, de 9 a 18 h. "Desde Córdoba, trabajamos de forma remota."
- **Instagram/redes propias:** **el sitio no enlaza ninguna cuenta propia de Lonso Lab** (no hay links a Instagram, Facebook ni TikTok; el único @ es el de la clienta @ingrid_van_der_veen). Hay que confirmar el handle con el dueño antes de ponerlo en un reel.
- Descriptor de marca (footer): "Google Maps, redes sociales y sitios web para negocios que quieren que los encuentren y los elijan."
- Descriptor de schema.org: "Agencia de Google Maps, redes sociales y sitios web para comercios." Córdoba, AR.

---

## 11. Assets descargados

### Capturas del sitio (`assets/web/screens/`)
- `{home,maps,redes,web,casos,nosotros,contacto,terminos,privacidad}-desktop-full.png`: página completa a 1440px, 1x
- `*-desktop-hero.png`: primer viewport, 1440×900
- `*-mobile-full.png` / `*-mobile-hero.png`: 390px a 2x (780px de ancho)
- `components/`: recortes de componentes a 2x (ver sección 4)

### Media del portfolio (`assets/web/media/`)
El detalle está en `manifest.json`. Todo viene de `https://lonsolab.com/assets/img/casos/<archivo>`.

| Archivo | Dimensiones | Duración | Nota |
|---|---|---|---|
| `reel-01.mp4` | 540×960, 30fps | 35,9 s | Reel de producto: detailing de un Shelby Mustang rojo para "The Auto Lab". Tiene audio |
| `reel-02.mp4` | 720×1280, 30fps | 37,8 s | Motion graphics "5 signs your ads are losing money" (naranja/negro/blanco) para @ingrid_van_der_veen. Tiene audio |
| `reel-01-poster-v2.webp`, `reel-02-poster-v2.webp` | 640×1138 | | Posters |
| `carrusel-0{1,2,3}.jpg` (+ webp 1080/720/320) | 1080×1350 | | Carrusel para Ingrid: "STOP OPTIMIZING FOR THE DASHBOARD. OPTIMIZE FOR PROFIT." |
| `metricas-ig-01.jpg` (+ webp) | 1080×1261 | | Captura de Instagram: 705.326 visualizaciones |
| `metricas-ig-02.jpg` (+ webp) | 838×1598 | | Captura de Instagram: 4.278 interacciones |
| `terrafirma-completa.webp` | 900×6139 | | Scroll completo del sitio Terra Firma (alto original 9822) |
| `terrafirma-escritorio.webp` | 1400×875 | | Portada desktop |
| `terrafirma-habitaciones.webp` | 1400×823 | | Sección habitaciones |
| `terrafirma-movil.webp` | 390×844 | | Versión móvil |
| `terrafirma-resenas.webp` | 1400×759 | | Opiniones (4,7 / 5.807) |

La tarjeta de **MPJ Fitness** no es una imagen: es HTML/CSS (mini-mapa con curvas de nivel, calles, pin naranja y la etiqueta "MPJ Fitness 5,0 ★"). Está capturada en `screens/components/case-mpj-fitness-map.png` y `mpj-fitness-map-only.png`.

Los dos reels traen su propio audio (música de terceros). Si se usan como b-roll, conviene silenciarlos o reemplazar el audio.
