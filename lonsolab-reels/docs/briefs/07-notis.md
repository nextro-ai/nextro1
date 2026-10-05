# Reel 7 · `notis` — "Que tu celular suene así" (Composition id `Notis`) — bonus, loop

**Formato**: loop corto ASMR. **Mood**: satisfactorio, adictivo.
**Música**: `MUSIC.notis` — "Playful Plucks", minimal deep house, 120 BPM, beat = 15 f, compás = 30 f.
**Duración**: 360 frames (12 s), pensado para repetirse: el último frame empalma con el primero (match-frame) y la
música corta en un downbeat (`loop_point` f360), así que el loop no se nota.

## Look
Celular del kit grande y frontal (escala ~0,95, centrado, pantalla legible entre y 300 y 1240), en **pantalla
bloqueada genérica**: fondo de pantalla con degradé cobalto→tinta y las curvas de nivel de la marca, reloj grande
"9:41", fecha "lunes 6 de octubre". Las notificaciones son tarjetas genéricas (no iOS): vidrio blanco 85 %, radio 28,
icono redondo de color, nombre de app genérico ("Teléfono", "Reseñas", "Mapas", "Mensajes", "Tu web"), título y
texto. Fondo exterior papel con `<Topo>` sutil.

## Guion
| Frames | Imagen | Texto (zona A, sobre el celular o arriba) | SFX |
|---|---|---|---|
| 0–74 | Pantalla bloqueada con **1 notificación** que acaba de entrar ("Llamada entrante · Un cliente te encontró en Google") | f0: **"¿Querés que tu celular suene así?"** | `pop` f0 |
| 15–269 | Lluvia de notificaciones que se apilan y se aceleran (intervalos 20,14,10,7,5,4,3 f; en beats al principio). Contenidos: "Nueva reseña ★★★★★ · Excelente atención", "Mapas · Pidieron cómo llegar a tu local", "Mensajes · ¿Tienen turno hoy?", "Teléfono · Llamada entrante", "Tu web · Nueva consulta", "Reseñas · ★★★★★ Volvería sin dudas", "Mensajes · ¿Hacen envíos?", … al final un contador "+24 notificaciones" | f75–f269: **"Así suena un negocio que aparece."** | `pop`/`notif_ding`/`notif_msg` alternados, con el volumen bajo (0.35–0.5) |
| 270–329 | Las notificaciones se barren hacia arriba; CTA (anteúltimo): logo + **"Escribinos · Auditoría gratis"** + "lonsolab.com" | (CTA) | `whoosh_fast` pico f270 |
| 330–359 | Vuelve exactamente a la composición del frame 0 (pantalla con 1 notificación que entra), para que el loop empalme | — | — |

## Notas
- El frame 359 tiene que llevar al frame 0 sin salto visible.
- Los textos de las notificaciones son ficticios y genéricos; etiqueta "Simulación" chica en la pantalla.
