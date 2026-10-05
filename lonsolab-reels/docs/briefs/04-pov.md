# Reel 4 · `pov` — "POV: tu negocio es buenísimo, pero…" (Composition id `Pov`)

**Formato**: POV + listado (antes con tachados → después con tildes). **Mood**: honesto, cercano, con humor suave.
**Música**: `MUSIC.pov` — "Cozy Afternoon", lo-fi hip hop, 85,9 BPM, beat = 20,955 f, compás = 83,8 f.
**Duración**: 921 frames (30,7 s). Cues: `breakdown` f335 (la música se vacía: la frase dura), `groove_back` f587
(vuelve el beat: "lo que hacemos nosotros").
Compases (frames): 0, 84, 168, 251, 335, 419, 503, 587, 671, 754, 838, 921. Medios compases: +42.

## Look
Editorial suizo sobre papel `#f3f4ef`: grilla de 12 columnas (márgenes 90 px), filetes de 2 px en tinta, numeración
grande (01/04) en Archivo 800 condensado (`fontStretch` 75 %), textura de grano de papel 4 %, renglones muy sutiles
(`linea`). Marcas a mano en pin: tachados que se dibujan (8–10 f), círculos, flechas, tildes (`evolvePath`, trazo
irregular con jitter fijo), resaltador pin al 35 %. **Sin shake ni rebotes**: entradas de 10–14 f con `EASE.salida`,
cortes secos en el downbeat. Placa POV en el estilo de los subtítulos nativos (texto blanco sobre caja tinta, esquinas
redondeadas) en la zona A.

## Guion
| Frames | Texto / imagen | SFX |
|---|---|---|
| 0–83 | Placa POV: **"POV: tu negocio es buenísimo…"** (visible desde f0, la caja se despliega en 6 f) | `tick` f0 |
| 84–167 | Segunda línea debajo: **"…y nadie se entera."** (con resaltador naranja en "nadie") | — |
| 168–334 | Título de lista "Por qué no te encuentran" + contador 1/4…4/4. Ítems uno por medio compás (f168, f210, f251, f293), cada uno se **tacha** al entrar: "Fotos viejas en tu ficha de Google" · "Reseñas sin responder" · "Último posteo: marzo" · "Tu web no se ve bien en el celu" | `swipe` suave en cada tachado (vol 0.35) |
| 335–418 | (la música se vacía) La lista se desvanece al gris. Grande: **"Cada día que no aparecés,"** | — |
| 419–502 | **"alguien le compra a otro."** ("otro" en pin con círculo dibujado) | — |
| 503–586 | Giro editorial: se da vuelta la "página" (wipe lateral 12 f): **"Lo que hacemos nosotros:"** | `whoosh_med` pico f503 |
| 587–753 | (vuelve el beat) Lista con **tildes** que se dibujan, una cada medio compás (f587, f629, f671, f713): "Ficha completa y optimizada" · "Reseñas respondidas con tu tono" · "Contenido todas las semanas" · "Web pensada para el celular" | `tick` en cada tilde |
| 754–837 | **"Vos seguís con tu negocio."** (f754) / **"Nosotros nos ocupamos de que se vea."** (f775) | — |
| 838–921 | Cierre: logo, **"Pedí tu auditoría gratis"**, "lonsolab.com · WhatsApp +54 3541 33-7818" | `pop` f838 |

## Notas
- Es el reel más "mandable": tono de amigo que te avisa, no de vendedor.
- Los ítems de la lista quedan en pantalla (se acumulan) para que se puedan leer; tamaño 56–64 px, numeración 01–04.
- Respetá zona segura: lista entre y 560 y 1240, títulos arriba.
