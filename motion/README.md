# NEXTRO — video motion graphics

Video promocional vertical (1080×1920, 30 fps, 34 s) para Reels, TikTok y Shorts, hecho 100 % con código:
la animación es HTML + GSAP (`index.html`), se renderiza fotograma a fotograma con Chromium headless
(`render.mjs`) y la música se sintetiza sincronizada con la animación (`audio.py`).

| Tiempo | Escena |
| --- | --- |
| 0–4 s | La pregunta: "¿qué es la Inteligencia Artificial?" |
| 4–8 s | La respuesta: "cómo usarla para ganar." |
| 8–12 s | "y esto es NEXTRO" → logo 3D cromado · "Naturaleza es el Algoritmo" |
| 12–18 s | Servicios: Creación Rápida · Cero Fricción · Más Ventas |
| 18–24 s | Proyectos destacados (fotos + video con IA) |
| 24–28 s | Metodología: Análisis → Edición → Expansión |
| 28–34 s | Contacto (WhatsApp, email, "Iniciar Protocolo") y cierre de marca |

## Ver la animación en vivo

```bash
npx serve .          # desde la raíz del repo
# abrir http://localhost:3000/motion/
```

(Antes hay que renderizar una vez para que existan los fotogramas del video en `motion/build/giant/`.)

## Renderizar el MP4

Requisitos: Node 18+, `npm install` en la raíz (trae GSAP), Playwright con Chromium, ffmpeg y Python 3 con
`numpy`, `scipy` (y opcionalmente `pyloudnorm` para normalizar a −14 LUFS).

```bash
node motion/render.mjs                       # → motion/out/nextro-motion.mp4 y nextro-motion-movil.mp4
node motion/render.mjs --stills 2,9.6,30     # fotogramas sueltos en PNG → motion/build/stills/
node motion/render.mjs --from 8 --to 12      # render parcial para revisar una escena
```

Salidas:

- `out/nextro-motion.mp4`: máxima calidad (H.264 High, ~12 Mbps), para subir a Instagram o TikTok.
- `out/nextro-motion-movil.mp4`: versión liviana (<25 MB) para mandar por WhatsApp o mail.

## Editar

- **Textos**: están en el HTML de cada escena (`<section id="s1">` … `s7`) y salen del sitio (`src/i18n/translations.ts`).
- **Tiempos**: la línea de tiempo usa segundos absolutos (`tl.fromTo(..., 4.5)`). A 120 BPM, un compás dura 2 s;
  los cortes de escena caen en compás para que coincidan con la música.
- **Sonido**: cada `cue('impact' | 'hit' | 'whoosh' | 'riser' | 'tick' | 'shimmer', t)` del timeline se exporta a
  `build/cues.json` y `audio.py` coloca ahí el efecto, así que si movés una animación su sonido se mueve con ella.
- **Colores y fuentes**: los mismos tokens del sitio (`#050505`, `#3B82F6`, Plus Jakarta Sans, Cormorant Garamond,
  JetBrains Mono, Outfit); las fuentes están en `fonts/` para que el render no dependa de la red.
