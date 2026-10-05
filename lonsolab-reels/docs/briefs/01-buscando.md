# Reel 1 · `buscando` — "Te están buscando" (Composition id `Buscando`)

**Formato**: historia en UI de celular, dos tiempos (sin Lonso Lab → con Lonso Lab). **Mood**: tensión → alivio.
**Música**: `MUSIC.buscando` — "Rise and Grind", future house, 132,1 BPM, beat = 13,626 f, compás = 54,5 f.
**Duración**: 926 frames (30,9 s). Cues: `tension_bar` f273 (la música baja: momento del rebobinado),
`drop` f327 (el giro: paleta cobalto + impacto), `energy_down_endcard` f763 (cierre más calmo).
Compases (frames): 0, 55, 109, 164, 218, 273, 327, 382, 436, 491, 545, 600, 654, 709, 763, 818, 872, 926.

## Look
Fondo papel con `<Topo>` cobalto muy sutil. Celular del kit (`<Phone>`) grande en perspectiva 3D (rotateY −12°→0°,
rotateX 6°→0°, push-in lento 1,00→1,08), escala ~0,8 y ubicado abajo (pantalla legible entre y 600 y 1240) para dejar
los titulares en zona A (y 300–560). Dentro del celular: UI **genérica** tipo mapa (no copiar Google): buscador
redondeado `#eef0f5`, mapa con curvas de nivel y pins, lista de resultados con estrellas `#f2a516`. Etiqueta chica
"Simulación" (tinta2, 26 px) en una esquina de la pantalla del celular durante todas las escenas de UI.
Negocios inventados: "Ferretería Central", "Corralón del Sur", "Ferretería El Tornillo" y "Tu ferretería".

## Guion (frames)
| Frames | Imagen | Texto en pantalla (zona A) | SFX |
|---|---|---|---|
| 0–108 | Buscador: se tipea "ferretería cerca de mí" (1 carácter cada 2–3 f, cursor) | f4: **"Alguien busca lo que vendés."** (mask reveal) | `typing` f0 |
| 55–108 | Caen 3 pins al mapa con rebote; aparece la lista | — | `pop` en cada pin |
| 109–217 | Scroll de la lista; abajo de todo aparece **"Tu ferretería"** gris, sin foto: "Horario no disponible · Reseñas sin responder" (etiqueta roja `#b42318`). Zoom a esa ficha | f109: **"Así te ve tu cliente."** | `swipe` f105 |
| 218–272 | El dedo (círculo de tap) toca "Ferretería Central · 4,8 ★ · Abierto ahora" → pantalla "Llamando a Ferretería Central…" | f218: **"Y le compra a otro."** (golpe en pin) | `ui_tap` f218, `phone_ring` f226 |
| 273–326 | Rebobinado tipo VHS/tape stop: la UI corre hacia atrás, aberración cromática, franjas | f280: **"Rebobinemos."** | `tape_stop` f268, `glitch_1` f285, `riser_2s` termina en f327 (empieza f267) |
| 327–435 | **DROP**: fondo cobalto, chip "Con Lonso Lab". Misma búsqueda; ahora **"Tu ferretería"** arriba de todo, borde naranja: "Ficha completa · Reseñas respondidas · Abierto ahora", fotos, 4,9 ★ | f330: **"Con Lonso Lab, te encuentran."** | `impact_big` f327, `whoosh_med` (pico en f327) |
| 436–599 | Lluvia de notificaciones sobre el celular, intervalos que se acortan (20→14→10→7→5 f): "Llamada entrante · Un cliente te encontró en Google", "Nueva reseña ★★★★★", "Pidieron cómo llegar a tu local", "Mensaje nuevo: ¿Tienen stock?" | f440: **"Y te eligen."** | `notif_ding`/`pop`/`notif_msg` en cada una |
| 600–762 | Tres tarjetas de servicio que entran una por compás (f600, f654, f709) con icono del kit: **Google Maps** · Que te encuentren / **Redes** · Que te elijan / **Web** · Que te escriban | (las tarjetas son el texto) | `whoosh_fast` con pico en cada entrada |
| 763–839 | Fondo papel, todo se calma | **"Tu próximo cliente ya está buscando."** | `whoosh_down` |
| 840–926 | Cierre: logo completo, **"Auditoría gratis en 24 h hábiles"**, botón naranja "Escribinos por WhatsApp", "lonsolab.com". Un pin cae sobre el logo | — | `pop` f846, `success_chime` f850 |

## Notas
- El frame 0 ya muestra el celular con el buscador y el primer carácter: nada de pantalla vacía.
- Entre f327 y f599 el celular puede moverse de 3D a frontal y crecer, pero los textos legibles adentro van entre y 600 y 1240.
- Las notificaciones son tarjetas genéricas (no iOS): blanco 96 % + sombra, icono redondo de color, título en 700 y cuerpo en 400.
