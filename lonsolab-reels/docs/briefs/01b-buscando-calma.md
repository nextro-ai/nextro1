# Reel 1b · `buscando_calma` — "Te están buscando" versión pausada + paletas (Composition id `BuscandoCalma`)

## Por qué existe
El cliente ama el reel `buscando`, pero lo siente **muy rápido para procesar**: el público son **dueños de negocio
adultos**. Además, la paleta de la web (crema + tinta + cobalto + naranja, todos fuertes a la vez) **confunde** con
tanta información en pantalla. Esta versión mantiene la historia y el estilo, pero:
1. **Ritmo pausado y claro** (ver reglas abajo).
2. **Todos los colores salen de un tema** (`THEMES` en `src/brand/themes.ts`) para renderizar el mismo corte en 4
   paletas: `web`, `mono`, `bosque`, `marino`. El tema se elige con `inputProps.theme` (default `web`).

## Base técnica
- Copiá `src/reels/buscando/` a `src/reels/buscando_calma/` y trabajá ahí (no toques `buscando/`).
- `index.tsx` registra `<Composition id="BuscandoCalma" ... durationInFrames={MUSIC.buscando_calma.duration_frames}
  defaultProps={{ theme: "web" }} />` (1199 frames, 40 s). Pasá el tema por contexto de React (ThemeProvider propio)
  y reemplazá **todos** los colores de marca y tintes (C.*, `#b9c6ff`, `#c9d2ff`, `rgba(19,24,43,…)`, verdes, grises
  azulados…) por roles del tema (`bg, bg2, surface, ink, ink2, line, dark, onDark, onDark2, accent, onAccent,
  accentSoft, topo, map, mapRoad, ok, warn, star`). Sombras: usá `ink` con alfa. El logo: `<Logo color={t.ink} />`
  (o `t.onDark` sobre `dark`). Ningún hex de marca suelto: buscalos con grep al final.
- Música: `MUSIC.buscando_calma` ("Rise and Grind", 132,1 BPM, compás = 54,5 f). Cues: `tension_bar` f491 (la música
  baja: momento tranquilo antes del giro), **`drop` f545** (el giro "Con Lonso Lab"), `energy_down_endcard` f981.
  Compases: 0, 55, 109, 164, 218, 273, 327, 382, 436, 491, 545, 600, 654, 709, 763, 818, 872, 927, 981, 1036, 1090,
  1145, 1199. **Los cambios de escena van en compases** (no en beats).
- Render por tema: `npx remotion render src/reels/buscando_calma/index.tsx BuscandoCalma out/buscando_calma-<tema>.mp4
  --props='{"theme":"<tema>"}' --concurrency=2`, master con `tools/master.py`.

## Reglas de claridad (público adulto)
- **Una idea por pantalla.** Como máximo 2 bloques de texto visibles a la vez (titular + un elemento foco).
- **Tiempo de lectura**: 0,6 s + 0,4 s por palabra, mínimo 2 s, y cada titular se sostiene ≥ 2,5 s (≥ 75 f).
- **Texto grande**: titulares 100–130 px; todo lo que hay que leer dentro de la UI ≥ 44 px en pantalla (agrandá la UI o
  hacé zoom a la parte relevante; menos ítems).
- **Menos movimiento**: nada de rotación 3D constante del celular (como mucho una inclinación leve fija que se endereza
  despacio), sin shake salvo un único golpe corto en el drop (≤ 8 frames, amplitud baja), sin glitches/VHS de franjas:
  el rebobinado es un retroceso limpio (la UI vuelve atrás + icono ◀◀) de ~1 compás.
- **Foco**: destacá lo importante oscureciendo/atenuando lo demás (spotlight), no con más elementos.
- **Color con disciplina**: `dark` solo como campo de "giro" (del drop a los servicios); `accent` solo para la acción y
  la palabra clave ("tu negocio", "otro", CTA). Nunca `dark` y `accent` como grandes superficies juntas.
- **Transiciones suaves y en compás**, 10–16 f, curvas `EASE.salida`.

## Guion (frames · compases)
| Frames | Imagen | Texto en pantalla |
|---|---|---|
| 0–272 (compases 0–4) | Celular casi frontal, grande. Se tipea "ferretería cerca de mí" (≈1 car. cada 3 f). Luego aparecen 3 resultados (Ferretería Central, Corralón del Sur, **Tu negocio**) | f4–163: **"Alguien busca lo que vendés."** · f164–272: **"Así te encuentra hoy:"** + spotlight sobre "Tu negocio" en gris: "Sin fotos · Horario no disponible · Reseñas sin responder" (grande, legible) |
| 273–435 (compases 5–7) | El dedo toca "Ferretería Central" → pantalla de llamada | f273–435: **"Y le compra a otro."** ("otro" en accent) |
| 436–544 (compases 8–9) | Retroceso limpio de la UI (◀◀), luego calma en el compás de tensión (f491) | f440–544: **"Rebobinemos."** → f491: **"Ahora, con Lonso Lab:"** (dos líneas, no en simultáneo con la anterior) |
| **545** DROP | Fondo `dark`; misma búsqueda; **Tu negocio** primero, ficha completa (fotos, 4,9 ★, Abierto ahora, reseñas respondidas) | f548–708: **"Te encuentran primero."** |
| 709–871 (compases 13–15) | 3 notificaciones grandes que entran de a una por compás (Llamada entrante · Nueva reseña ★★★★★ · Pidieron cómo llegar) y quedan apiladas | f709–871: **"Y te eligen."** |
| 872–980 (compases 16–17) | Los 3 servicios como una lista simple que se arma de a uno (f872, f900, f927): icono + nombre + verbo. **Google Maps** · que te encuentren / **Redes** · que te elijan / **Web** · que te escriban | (la lista es el texto) |
| 981–1089 (compases 18–19) | Vuelve a `bg`. Buscador que pasa por rubros con calma (1 por beat): ferretería → peluquería → gimnasio → veterinaria → **lo que vendés** cerca de mí | **"Tu próximo cliente ya está buscando."** |
| 1090–1199 (compases 20–22, 3,6 s) | Cierre: logo, **"Auditoría gratis"** (botón accent) · "en 24 h hábiles" · "WhatsApp +54 3541 33-7818" · "lonsolab.com" | — |

SFX: los mismos tipos que `buscando`, menos densos (tecleo suave, pop por resultado, tap, ring corto, ◀◀ suave,
impacto único en el drop, 1 pop por notificación, chime final). Etiqueta "Simulación" en la UI.
