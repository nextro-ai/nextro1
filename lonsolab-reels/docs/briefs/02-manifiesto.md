# Reel 2 · `manifiesto` — "No existís" (Composition id `Manifiesto`)

**Formato**: manifiesto de tipografía cinética. **Mood**: urgente, desafiante. **Ritmo**: el más rápido de la serie.
**Música**: `MUSIC.manifiesto` — "Night Drift", drift phonk, 131,8 BPM, beat = 13,657 f, compás = 54,6 f.
**Duración**: 655 frames (21,85 s). Cues: `dip_start` f218 (la música baja: sección de "malas noticias"),
`slam_back` f437 (vuelve fuerte: la solución).
Beats (frames): 0,14,27,41,55,68,82,96,109,123,137,150,164,178,191,205,218,232,246,259,273,287,300,314,328,341,355,369,
382,396,410,423,437,451,464,478,492,505,519,533,546,560,574,587,601,614,628,642,655.

## Look
Fondo tinta. Palabras en papel; la palabra clave en pin. Archivo pesado; firma de la marca: **"stretch punch"**
(la palabra entra con `fontStretch` 62 % y `fontWeight` 900 y se ensancha a 125 % en ~6 frames con rebote).
Slam palabra por palabra en los beats: escala 1,35→1,0 con `spring({damping: 11, stiffness: 220, mass: 0.6})`, shake de
4–6 f (10–18 px, determinista), cortes secos. Cambios de fondo a cobalto o pin en algunos golpes (máx. 3 flashes/s).
Glitch RGB-split ≤ 6 frames en 2–3 momentos. Grano 4 %. `<Topo>` papel al 8 % detrás, con drift.

## Guion (frames · texto · tratamiento)
**Sección A (alta energía, f0–217)**
- f0–54: "TENÉS" (f0) · "EL MEJOR" (f14) · "PRODUCTO." (f27) — se arma la frase, queda armada hasta f54.
- f55–108: "LA MEJOR" (f55) · "ATENCIÓN." (f68) — queda hasta f108.
- f109–136: **"PERO…"** sola, gigante (stretch punch), fondo pin. SFX `tape_stop` corto o `snap` en f109.
- f137–217: "SI NO" (f137) · "APARECÉS" (f150) · "EN GOOGLE…" (f164) — queda armada hasta f217.

**Sección B (la música baja, f218–436)** — más pesado y lento, sin flashes:
- f218–272: **"NO EXISTÍS."** enorme en pin, impacto + shake fuerte. SFX `boom_sub` f218 + `impact_big` f218.
- f273–327: "Ficha incompleta." con una cruz naranja que se dibuja. SFX `snap` f273.
- f328–381: "Redes quietas." + cruz. SFX `snap` f328.
- f382–436: "Una web que no vende." + cruz. SFX `snap` f382 y `whoosh_long` con el pico en f437 (arranca ~f425).

**Sección C (vuelve fuerte, f437–655)**
- f437–491: **"TE PONEMOS EN EL MAPA."** — un pin naranja cae y clava la frase; fondo cobalto. SFX `impact_big` f437.
- f492–545: **"GOOGLE MAPS"** (f492) · **"REDES"** (f505) · **"WEB"** (f519), apiladas y alineadas. SFX `impact_short` en cada una.
- f546–600: Logo Lonso Lab (versión papel sobre tinta) con stretch punch del wordmark, barrido de luz. SFX `impact_big` f546.
- f601–655: CTA: **"Auditoría gratis"** + "lonsolab.com" (+ botón naranja). Se sostiene 1,8 s. SFX `pop` f601.

## Notas
- Todo dentro de zona A/B (y 300–1240). Palabras protagonistas 160–220 px; frases de 3+ palabras 110–130 px.
- La frase siempre queda armada ≥ 0,8 s antes de cambiar.
- Las cruces/tachados usan `evolvePath` o scaleX en 8 frames, trazo pin 10 px.
