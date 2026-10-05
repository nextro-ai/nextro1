# Reel 5 · `trabajo` — "Mirá el trabajo" (Composition id `Trabajo`)

**Formato**: montaje de prueba con trabajos reales. **Mood**: confiado, con orgullo, groove.
**Música**: `MUSIC.trabajo` — "Latin Funk Groove", nu-disco/funk latino, 121,8 BPM, beat = 14,778 f, compás = 59,1 f.
**Duración**: 768 frames (25,6 s). Cues: `dip` f118 (la música baja dos compases), `drop` f236 (entra el groove fuerte).
Compases (frames): 0, 59, 118, 177, 236, 296, 355, 414, 473, 532, 591, 650, 709, 768.

## Look
Inspirado en la sección "Archivo" de Nextro (ver `docs/nextro-analysis.md` §3.4): **tarjetas apiladas** de radio grande
(56 px) que suben y tapan a la anterior; la anterior baja a escala 0,9, opacidad 0,5 y blur 20 px. Detrás, una
**palabra fantasma gigante** "TRABAJO" al 5 %. Cada tarjeta tiene una etiqueta tipo expediente (`CASO.001 // REELS`) en
Archivo 700 condensado con tracking 0,2 em, un título y la pieza real. Fondos que alternan papel / tinta / cobalto.
Movimiento con swing: entradas con `EASE.rebote`, pequeños "bops" de escala en cada beat (1,00→1,03).
Assets reales en `public/web/`: `reel-01.mp4` (The Auto Lab, 540×960), `carrusel-0{1,2,3}.jpg`, `metricas-ig-01.jpg`,
`terrafirma-completa.webp` (captura de página completa 900×6139, ideal para scroll dentro del celular),
`terrafirma-movil.webp`, `terrafirma-resenas.webp`. El video del reel va **muteado** (solo música).

## Guion
| Frames | Imagen | Texto | SFX |
|---|---|---|---|
| 0–117 | Fondo tinta; la frase se arma palabra por palabra en beats (f0, f15, f30, f44) | **"No te pedimos que nos creas."** | `tick` en beats |
| 118–235 | (la música baja) Corte a papel: **"Mirá el trabajo."** gigante, una flecha naranja dibujada a mano apunta abajo | — | `riser_2s` termina en f236 |
| 236–295 | **CASO.001 // REELS** — celular con `reel-01.mp4` reproduciéndose | "De una toma a una historia." | `whoosh_fast` pico f236 + `impact_short` f236 |
| 296–354 | **CASO.002 // DISEÑO** — abanico de los 3 carruseles que se despliega en beats | "Una marca que se reconoce." | `swipe` f296 |
| 355–472 | **CASO.003 // RESULTADOS** — contador 0 → **705.326** (tabular-nums, punch al final) | "visualizaciones en 30 días" · chico: "Con campañas que administramos." · f414: "El 93,7 % no seguía la cuenta." | `whoosh_fast` f355, `success_chime` cuando termina el contador |
| 473–590 | **CASO.004 // WEB** — celular con la web de Terra Firma haciendo scroll suave (terrafirma-completa) | "Terra Firma · hotel boutique" · "4,7 ★ con 5.807 opiniones" | `whoosh_fast` f473 |
| 591–649 | **CASO.005 // GOOGLE MAPS** — tarjeta de mapa con pin naranja y chip "MPJ Fitness 5,0 ★" | "Ficha que gestionamos." | `pop` f600 |
| 650–708 | Las 5 tarjetas se ordenan en grilla chica | **"Tu negocio puede ser el próximo."** | `whoosh_med` f650 |
| 709–768 | Cierre: logo, **"Auditoría gratis"**, "lonsolab.com" | — | `success_chime` f709 |

## Notas
- Solo números reales con su contexto (705.326 incluye pauta: por eso "Con campañas que administramos").
- No muestres los carruseles en tamaño ilegible como si fueran texto: son imagen; el texto del reel es el de la columna.
- El contenido de las tarjetas debe quedar entre y 300 y 1240 (las tarjetas pueden sangrar abajo como imagen).
