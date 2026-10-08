---
name: reel-motion
description: Hacer reels, historias y piezas de motion graphics SIN gastar créditos de IA. Se anima con HTML/CSS/SVG y se exporta a MP4 (9:16, 1:1, 16:9) con Chromium y ffmpeg. Usar para texto animado, tarjetas, listas, infografías, precios, antes y después, logo animado, zócalos, cierres con CTA, carruseles animados y plantillas por cliente. Usar también cuando el usuario quiera "ahorrar créditos de Higgsfield" en las partes que no necesitan generación.
---

# Motion graphics por código (0 créditos)

Todo lo que es tipografía, formas, íconos, fotos del cliente, capturas de pantalla, números y logos se anima con código. Los créditos de generación quedan solo para tomas que de verdad necesitan IA (personas o escenas que no existen, movimiento de cámara sobre una foto, cambio de ropa o de fondo).

## Cómo funciona

1. Un HTML de 1080×1920 (o el formato que toque) que expone:
   - `window.DURATION`: duración en segundos.
   - `window.render(t)`: dibuja el cuadro exacto del segundo `t`. Es determinístico: nada de animaciones CSS con reloj propio ni `setTimeout`, porque el render va cuadro por cuadro.
2. `scripts/render.mjs` abre la página en Chromium (Playwright), pide cada cuadro y se lo pasa a ffmpeg:

```bash
node .claude/skills/reel-motion/scripts/render.mjs pieza.html salida.mp4 [--fps 30] [--ancho 1080 --alto 1920] [--audio pista.mp3]
```

Tarda unos 2 minutos cada 13 s a 30 fps. Para revisar antes de entregar, sacá una hoja de contacto:

```bash
ffmpeg -y -loglevel error -i salida.mp4 -vf "select='not(mod(n\,60))',scale=270:480,tile=6x1" -frames:v 1 -vsync 0 hoja.png
```

y mirala con Read. Corregí desbordes de texto, tamaños y superposiciones antes de mandarla.

## Plantillas

- `plantillas/tarjetas-3-errores.html`: gancho con ícono, tres tarjetas que entran de a una (la activa resaltada y las anteriores atenuadas) y cierre "Comentá PALABRA". Es el estilo de "costo / trabajo / total" que funciona en reels de precios y listas. Para reutilizarla: copiala al scratchpad o a la carpeta del cliente, cambiá textos, íconos SVG, colores (`:root`) y tiempos (`starts`, `sceneAlpha`), y renderizá.

Al crear una plantilla nueva que salga bien, guardala en `plantillas/` con un nombre descriptivo.

## Reglas de diseño para reels

- **Zonas seguras (9:16):** no pongas texto importante en los ~250 px de arriba ni en los ~450 px de abajo (ahí van el caption y los botones), ni pegado al borde derecho (íconos de like/comentar). Dejá 90 px de margen a los lados.
- **Gancho en el primer segundo:** el texto principal tiene que estar legible antes de 1 s.
- **Tamaños:** títulos de 90-120 px, cuerpo de 48-64 px, nunca menos de 36 px. Máximo unas 8 palabras por pantalla.
- **Ritmo:** un cambio visual cada 1,5-3 s. Usá easing (`easeOut`, `backOut`); nada lineal.
- **Duración:** 7-15 s para alcance, 20-45 s para explicar algo. Cierre con CTA claro.
- **Audio:** lo ideal es agregar la música desde la app (Instagram o TikTok), porque suma alcance y evita problemas de licencia. Si se exporta con audio, que sea música con licencia o un audio propio.
- **Fuentes:** Inter está instalada en la nube. Para la tipografía de la marca de un cliente, cargá el archivo con `@font-face` (local) antes de renderizar.
- **Marca blanca:** el video nunca dice cómo se hizo.

## Combinaciones útiles

- Toma generada con IA (Higgsfield) + placas y subtítulos por código: se generan solo los 5-10 s de imagen que hacen falta y el resto sale gratis.
- Foto real del cliente + movimiento por código (zoom lento, paneo, máscara) en vez de pagar un imagen-a-video.
- Varias versiones de la misma pieza (otro rubro, otro color, otro texto) en minutos: ideal para pruebas A/B y para clientes con varias sucursales.
- Formatos derivados: el mismo HTML con `--ancho 1080 --alto 1080` para el feed cuadrado, o `--ancho 1920 --alto 1080` para YouTube (ajustá el layout).
