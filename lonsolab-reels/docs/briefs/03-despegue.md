# Reel 3 · `despegue` — "Despegá" (Composition id `Despegue`)

**Formato**: tráiler cinematográfico con cuenta regresiva. **Mood**: épico, aspiracional.
**Música**: `MUSIC.despegue` — "The Ticking Overture (v2)", tráiler híbrido, 100 BPM, beat = 18 f, compás = 72 f.
**Duración**: 864 frames (28,8 s). Cues: `loud_bar` f288 (sube la tensión), `fade_starts` f466 (la música empieza a
apagarse), `silence` f562 (silencio casi total), **`impact` f605 (golpe enorme = despegue)**, `calm_endcard` f792.

## Look
Noche profunda: fondo tinta → negro azulado con viñeta. Barras de letterbox negras arriba (y 0–220) y abajo
(y 1700–1920) que entran al principio (cine). `<Topo>` cobalto con glow (filter drop-shadow) funcionando como un
**radar**: un barrido circular que ilumina líneas. En el centro, un **pin naranja** (el negocio) que late con anillos
(ping). Partículas de polvo flotando (determinista con `@remotion/noise`). Cámara: dolly lento (escala 1,00→1,06) y
leve órbita. Tipografía: titulares papel 96–120 px; números de la cuenta regresiva gigantes (Archivo `fontStretch` 62 %,
peso 900, 520 px) en papel con contorno/glow pin.

## Guion
| Frames | Imagen | Texto | SFX |
|---|---|---|---|
| 0–125 | Letterbox entra (f0–12), radar dibuja curvas (drawFrom 0), pin late | f4: **"Tu negocio tiene todo para despegar."** (mask reveal por palabra) | `whoosh_long` f0 suave |
| 126–215 | Push-in al pin | **"Menos una cosa:"** | `tick` en beats |
| 216–287 | El pin queda en sombra, apenas visible | **"Que te vean."** (pin, grande) | `impact_short` f216 |
| 288–359 | **T-3**: número "3" gigante golpea en f288; icono pin; | **"Google Maps"** + "Que te encuentren" | `impact_big` f288 |
| 360–431 | **T-2**: "2"; icono cámara | **"Redes"** + "Que te elijan" | `impact_big` f360 |
| 432–503 | **T-1**: "1"; icono web | **"Web"** + "Que te escriban" | `impact_big` f432 |
| 504–598 | Ignición: la pantalla se oscurece, el pin vibra (shake creciente), partículas que se juntan, glow que crece; la música ya se está apagando | f508: **"Sin presencia online, no hay despegue."** (hasta f590) | `riser_4s` que termina en f599 |
| 599–604 | **6 frames de silencio y casi negro** (solo el pin brillando) | — | nada |
| **605** | **DESPEGUE**: flash único, el pin sale disparado hacia arriba con estela de partículas naranja/papel y las curvas de nivel se abren hacia afuera; shake fuerte | — | `impact_big` f605 + `boom_sub` f605 + `whoosh_long` (pico f612) |
| 610–791 | La cámara sigue al pin que sube; la estela dibuja un camino de curvas de nivel; los 3 iconos de servicio orbitan | f630: **"Despegá con Lonso Lab."** (grande, hasta f780) | — |
| 792–864 | Calma: logo completo papel, **"Auditoría gratis en 24 h hábiles"**, "lonsolab.com" | — | `success_chime` f792 |

## Notas
- Durante la cuenta regresiva el texto del servicio va en zona B (y 900–1150) y el número en zona A.
- El flash del despegue es uno solo (respetar ≤ 3 flashes/s).
- Las partículas y el radar le dan la calidad "tráiler": cuidá el glow y la profundidad (capas a distinta velocidad).
