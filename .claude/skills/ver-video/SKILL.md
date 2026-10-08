---
name: ver-video
description: Ver y analizar un reel o video a partir de un link (Instagram, TikTok, YouTube, X, Facebook) o de un archivo. Lo descarga, transcribe lo que se dice, detecta los cortes de edición y arma hojas de contacto con los cuadros clave para mirarlos. Usar siempre que el usuario pase un link de un reel/video o pida "mirá este video", "analizá este reel", "qué dice este video", "cómo está editado", "copiemos este formato".
---

# Ver y analizar videos desde un link

Sirve para mirar referencias (reels de la competencia, tendencias, creadores) y convertirlas en ideas, guiones o cotizaciones para LonsoLab y sus clientes.

## 1. Preparar el material

Correr el script, con una carpeta de salida **nueva** por video dentro del scratchpad (lo descargado es contenido de terceros: no lo guardes en el repo):

```bash
python3 -I .claude/skills/ver-video/scripts/analizar_video.py "<link>" --out "<scratchpad>/videos/<nombre-corto>"
```

Opciones útiles:
- `--idioma es` fuerza español (por defecto lo detecta).
- `--modelo base` transcribe más rápido; `--modelo medium` es más preciso (más lento).
- `--sin-audio` si solo importa lo visual.
- `--max-cuadros 36` para videos largos.
- También acepta un archivo local en vez de un link (por ejemplo, un video que mandó el usuario).

El script instala solo lo que falta (`yt-dlp`, `faster-whisper`). La primera transcripción baja el modelo (~460 MB el `small`), y después queda en caché.

Genera en la carpeta:
- `meta.md`: cuenta, fecha, caption, duración, likes, comentarios, relación comentarios/likes y engagement si hay vistas.
- `transcripcion.txt` / `.srt`: lo que se dice, con segundos.
- `cortes.txt`: en qué segundo cambia el plano y el ritmo de edición (cortes por segundo).
- `hoja_01.jpg`, `hoja_02.jpg`…: hojas de contacto con cuadros clave y su segundo (los primeros 3 s siempre aparecen, porque son el gancho).
- `cuadros/`: cada cuadro por separado, para mirar detalles.

## 2. Mirarlo de verdad

1. Leer `meta.md`, `cortes.txt` y `transcripcion.txt`.
2. Abrir **todas** las hojas de contacto con Read (son imágenes). Si algo no se entiende, abrir el cuadro individual de `cuadros/`.
3. No inventar lo que no se ve ni se escucha. Si la transcripción dice "(sin voz detectada)", el video es solo música y texto en pantalla: leé el texto en los cuadros.

## 3. Entregar el análisis (en español rioplatense)

Usar esta estructura, salvo que el usuario pida otra cosa:

1. **De qué se trata** (1-2 líneas) y para quién está hecho.
2. **Gancho (0-3 s)**: qué se ve, qué se dice y qué texto aparece. Por qué frena el scroll.
3. **Estructura con tiempos**: los bloques del video (gancho, desarrollo, prueba, cierre o CTA), con segundos.
4. **Edición**: ritmo de cortes, tipo de planos (cámara a la cara, captura de pantalla, B-roll, generado con IA), subtítulos (estilo, palabras resaltadas), efectos, transiciones, zooms, música o audio en tendencia.
5. **Llamado a la acción y métricas**: qué pide (comentar una palabra, seguir, guardar, DM). Si los comentarios superan a los likes, es una táctica de "comentá X y te lo mando" con DM automático.
6. **Por qué funciona** y qué tiene de flojo.
7. **Cómo lo adaptamos**: 2-3 versiones para LonsoLab o para el rubro del cliente, con un guion corto (gancho + 3-5 beats + CTA) de al menos una.
8. **Cómo lo producimos y cuánto cuesta**: qué partes salen sin créditos (motion graphics por código con la skill `reel-motion`, edición con ffmpeg o Descript, guion) y qué partes necesitan generación (tomas de video IA, modelos virtuales). Para el precio, usar la skill `cotizar-video-ia`.

## Reglas

- Las referencias son para inspirarse: no se republica el video de otro ni se copia su marca o su cara.
- Si el link es privado o pide iniciar sesión y falla la descarga, pedirle al usuario que mande el archivo y usar la ruta local.
- En lo que vea un cliente no se nombran las herramientas internas (marca blanca).
