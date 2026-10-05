# Manifiesto: "No existís" (Composition `Manifiesto`)

Kinetic-type manifesto. 1080×1920, 30 fps, 655 frames (21,84 s) on `MUSIC.manifiesto` ("Night Drift", 131,8 BPM,
beat = 13,657 f). Every cut and slam is placed with `bt(n) = Math.round(n * beat_frames)` (`timing.ts`), so rounding never accumulates.

- Render: `npx remotion render src/reels/manifiesto/index.tsx Manifiesto out/manifiesto.mp4 --concurrency=2` (~1,5 min)
- Master: `python3 ../tools/master.py out/manifiesto.mp4` → `out/manifiesto.final.mp4`
- Measured on the final (round 2): **−14,0 LUFS integrated, −1,5 dBTP** (loudnorm stays in linear mode: pre-master
  −14,9 LUFS / −2,4 dBTP), 21,84 s, 1080×1920, 30 fps, AAC audio.
- Dev helper: `node src/reels/manifiesto/stills.mjs 0 109 218 …` bundles once and writes `out/manifiesto-f<N>.png`.

## Files
| File | What it does |
|---|---|
| `index.tsx` | `registerRoot` + `<Composition id="Manifiesto">` (duration = `MUSIC.manifiesto.duration_frames`) |
| `Manifiesto.tsx` | Layer stack: world (backdrop + scenes) → glitch wrapper → flash → vignette → grain; soundtrack |
| `timing.ts` | Beat helper, story frames `T`, glitch, shake and flash event lists |
| `type.tsx` | `Slam` (stretch punch + centred slam + width clamp), `Dots` (spaced ellipsis), `dotPop`, baseline/stack maths |
| `metrics.ts` | Advance widths (em) of every headline string (Archivo variable, Pillow + raqm) and the wdth→width ratio table used by the clamp |
| `Backdrop.tsx` | Background colour per section, glow, `<Topo>` with continuous drift (absolute frame, no jumps at cuts) |
| `SceneA.tsx`, `SceneB.tsx`, `SceneC.tsx` | Scenes (see table) |
| `fx.tsx` | Deterministic shake (noise2D, horizontal at 0,55×), RGB-split + slice glitch, flash frames, grain, vignette, `MusicDuck` |
| `public/manifiesto/sfx/ui_{tap,click}_hot.wav` | Copies of the kit's UI sounds normalised to −4 dBFS peak (the originals peak at −17 dBFS) |

## Timing per scene (absolute frames)
| Frames | Beat | Background | On screen | Treatment |
|---|---|---|---|---|
| 0–54 | 0–3 | tinta | TENÉS (0, pre-rolled 2 f) · EL MEJOR (14) · PRODUCTO. (27) | Left-aligned stack: TENÉS and the outline connector at 686 px (156 / 106 px), keyword PRODUCTO. full 880 px in pin at wdth 112 (126 px). Frame 0 is crisp (no blur) and already widening |
| 55–108 | 4–7 | tinta | LA MEJOR (55) · ATENCIÓN. (68) | Outline connector 686 px (104 px), ATENCIÓN. 880 px at wdth 112 (135 px). RGB-split + slice glitch f104–108 |
| 109–136 | 8–9 | **pin** | PERO… | 180 px, tinta on pin, slam from 1,55×. Dots pop on an 8th-note triplet (114, 118, 123) with a damped pop capped at 1,1×, settled by f129 (8 f before the cut). Music ducked f109–125 |
| 137–217 | 10–15 | tinta | SI NO (137) · APARECÉS (150) · EN + GOOGLE… (164) | Same system as A1: "SI NO" outline 100 px · "APARECÉS EN" justified 880 px (96 px; EN lands at the end of line 2 on f164) · **GOOGLE…** alone, pin, 880 px (128 px). The dots pulse like a loader. Creep 1→1,02 f205–217, glitch f212–217 |
| 218–272 | 16–19 | tinta (darker) | NO / EXISTÍS. | Both lines (860 px, centred) slam as **one block** from 1,3× around the block centre, so NO never covers the Í and nothing rises above y 280. From f248 EXISTÍS. loses its fill (4 px outline) and fades to 35 %; letter-spacing spread −0,02→−0,008em from the centre |
| 273–436 | 20–31 | tinta (darker) | Ficha incompleta. (273) · Redes quietas. (328) · Una web que no vende. (382) | Failure list. Each row mask-reveals on its downbeat; an X is drawn in pin (evolvePath) on the next beat (287/341/396). Judged rows dim and get struck through. Camera 1,25× → 1×. **Two-sided whip-pan** f431–436: one pan (ease-in cubic) moves the list up and the cobalto world up from below, both with the same vertical blur; the last row stays clean until f432 |
| 437–491 | 32–35 | **cobalto** | TE PONEMOS (437) · EN EL (440) · MAPA (444) | Phrase complete from f444 (47 f). Topo lines trace in. The orange map pin falls 444–464 and lands as the full stop of "MAPA" (squash, ripples, contact shadow, the text nudges down). EN EL outline 5 px |
| 492–545 | 36–39 | **papel** | GOOGLE MAPS (492) · REDES (505) · WEB (519) | Mirror of the failure list. Archivo 900 / **wdth 125**, each row justified to the text column x 214–980 (80 / 175 / 259 px), so the list builds up to WEB and fills zone A (block y 392–832). Cobalto check badges joined by the dotted path; ghost "WEB" in the decorative zone |
| 546–600 | 40–43 | tinta | Logo Lonso Lab (papel) | Logo 186 px tall (870 px wide with the push, the widest that fits x 90–990). Bear mark slams (1,35×), wordmark stretch-punches. **Light sweep f556–582**: 30 % band with a flat white core masked to the logo + triple glow + a light beam on the background travelling with it. **Topo pulse** on bt(42)=574: two contour rings leave the mark + a 2,5 % punch |
| 595–655 | 43,5–48 | **cobalto** | Auditoría (601) · gratis (608) + pin underline · button "lonsolab.com →" (614) · logo | The logo starts shrinking/gliding at **f595**; the cobalto circle opens f594–607 **from the bear mark** (it starts as a disc framing the whole mark). "Auditoría" lands on open cobalto at f601. Watermark: the complete bear mark in papel at 8 % (x 556–1019, y 1296–1896). Button tap at f628 (ripple + press). Holds 1,8 s |

Flash frames (2–3 f, 18–32 %): f27 (pin), f68, f437, f546. Maximum 2 luminance transitions in any 1 s window (limit 3 flashes/s).

### Per-frame bounding-box check (final video, round 2)
Every frame except the two glitch windows and the whip blur (f431–436): text pixels (papel/pin, or tinta on the pin and papel
scenes) stay within **x 93–989** and **y ≥ 280** below the top. Only the map pin falls in from above the frame (f453–459), which is decorative motion.

## SFX (volume) and music
`MusicDuck` (copy of the kit's `<Music>`) with ducking: f109–125 ×0,42 ("PERO…" breath), f218–232 ×0,6, f437–443 ×0,74 (under the
impact only), f464–468 ×0,75, f492/505/519 +3 f ×0,8, f546–554 ×0,68, f628–631 ×0,8 (tap). **There is no duck before f437**, so the bed's own
sub-bass pickup (f427–436) runs straight into the slam.

| Frame | SFX | Vol |
|---|---|---|
| 0 | impact_short | 0,35 |
| 27, 68 | impact_short | 0,30 |
| 104 | glitch_1 | 0,40 |
| 109 | snap + tape_stop | 0,55 / 0,26 |
| 132 (peak 137) | whoosh_fast | 0,30 |
| 164 | impact_short | 0,30 |
| 212 | glitch_2 | 0,45 |
| 218 | boom_sub + impact_big | 0,26 / 0,32 |
| 273, 328, 382 | snap | **0,65** |
| 286, 340, 395 | swipe (pen stroke of the X) | **0,55** |
| 413 (peak 437) | whoosh_long (peak 24 f after its start) | **0,72** |
| 437 | impact_big | 0,28 |
| 459 (peak 464) | whoosh_fast | 0,26 |
| 464 | impact_short (pin lands) | 0,30 |
| 492, 505, 519 | impact_short | 0,36 |
| 546 | impact_big | 0,40 |
| 558 | whoosh_med (light sweep) | 0,18 |
| 601 | pop | 0,50 |
| 614 | **ui_tap_hot** (button) | 0,60 (+12,6 dB copy) |
| 628 | **ui_click_hot** (tap) | 0,60 (+13,1 dB copy) |

Measured SFX vs the ducked bed in the same 40 ms window, above 1,5 kHz (the band a phone speaker reproduces): ui_tap +12,6 dB,
ui_click +15,7, swipes +7 to +13, whoosh_long +10,8, snaps +3 to +5,5. In round 1 the tap was about 27 dB under the bed.

## Decisions
- **Slam system** (`type.tsx`): the word is centred inside a box of its final width and scales from the centre of its caps, so while
  it is still condensed it widens symmetrically and a new line never swells into the one above it. The horizontal scale is clamped
  so the on-screen width (natural width × wdth ratio × slam × overshoot × parent scale) never exceeds `fit + 12` px. The slam
  reads as height + stretch and never runs past the safe zone. Outline slams have no entry blur.
- **Hierarchy**: the pin keyword always runs the full 880 px; statements and outline connectors are shorter (0,78 width, or "SI NO"
  at 100 px), so the eye lands on PRODUCTO. / ATENCIÓN. / GOOGLE… Keywords use wdth 112 where needed for size (rule 12 allows 100–125).
- **Typographic system**: solid papel = statement, outline (4,5–5 px) = connector, pin = the word that lands. There is no pin text on cobalto or papel
  (contrast below 4,5:1); there, pin only appears in shapes (the map pin, the underline, the button with tinta text, 5,7:1).
- **Narrative rhyme**: crossed-out list (B) against checked list (C), in the same order. The pin falls into "MAPA" as its full stop.
- Ghost words (huge outlines at 9–12 %) and topo lines fill the lower decorative zone (y > 1240). They never carry information.
- No prices, no invented claims, no Instagram handle. The CTA copy comes from the brand's verified bank ("Auditoría gratis", lonsolab.com).

## Review round 2 (creative director, 7/10) — what changed
| # | Issue | Fix |
|---|---|---|
| major | Ellipsis dots merge into a bar (PERO…, EN GOOGLE…) | `Dots`: no negative tracking, `DOT_GAP` 0,07em between dots; EM["…"] regenerated (1,283 em at wdth 125), so both lines still fit 880 px exactly. Dots pop via `dotPop` (damping 16, capped 1,1×) at 114/118/123, settled by f129. Checked on f130, f136 and f190 |
| minor | Words run past x 1080 on slams; NO above y 214 | Centred origin + width clamp in `Slam` (see Decisions); NO EXISTÍS as a group slam from 1,3×; horizontal shake 0,55×. Per-frame bbox: x 93–989, y ≥ 280 |
| minor | CTA out of order; blue dot inside the logo | Logo glide starts f595; circle opens f594–607 from the bear mark, starting as a disc around the whole mark; headline lands on open cobalto |
| minor | SFX inaudible | snap 0,65, swipe 0,55, whoosh_long 0,72, UI sounds via normalised copies (see table) |
| minor | Watermark reads as a navy bar | The complete mark in papel at 8 % in the decorative zone |
| minor | Logo beat flat | Wider and brighter sweep + background beam, larger logo, topo pulse rings on bt(42) |
| minor | Legibility of the last row / MAPA phrase | Whip barely moves before f433 (row 3 clean f382–432, 50 f); the phrase is complete from f444 (47 f, was 40) |
| minor | Checklist at wdth 90 | wdth 125, justified rows (see table) |
| minor | Hierarchy inverted | See Decisions |
| minor | f218 hides the Í; spread pushes to x 1003 | Group slam; 860 px lines, spread from the centre, capped (max x 989) |
| minor | Frame 0 blurred | TENÉS pre-rolled 2 f |
| minor | One-sided whip | Shared pan: the cobalto world rises from below with the same blur |
| minor | Thin outlines, empty first frames | 4,5 px (5 px for EN EL on cobalto), no entry blur on outlines |
| minor | Duck on the slam_back pickup | Pre-duck removed; whip starts f431 with the pickup; impact duck lighter (0,74) |

### Where I deviated from the suggested numbers
- **Logo 220–240 px**: at the lockup's 4,5:1 ratio, 220 px makes the logo 990 px wide, which is outside x 90–990. I used 186 px
  (870 px with the push) and made the beat livelier with the sweep, beam, pulse rings and punch instead.
- **GOOGLE MAPS at 115–120 px with wdth 110–125**: the badge column leaves a 766 px text column, and GOOGLE MAPS is 9,6 em
  at wdth 125, so that size is not physically possible. Instead every row is justified at wdth 125 (80 / 175 / 259 px), which
  builds up to WEB and fills the frame like the other stacks.
- **ui_tap / ui_click at 1,0**: even at 1,0 the files peak at −17 dBFS. Copies normalised by +12,6 / +13,1 dB, played at 0,6, are clearly
  audible and keep the master in linear mode. whoosh_long is at 0,72 rather than 0,75 for the same peak reason.
- **"Una web que no vende." at 63 f**: the brief's slot (f382–436) is only 55 f, so it cannot reach 63. It now gets 50 clean frames
  (rows 1–2 stay on screen as context; 11 cps).

## Open issues / to check by ear
- I could not listen to the result. A human should check the **tape_stop + duck at f109** (it may read as a "record stop" meme,
  which is the intent), the new slam_back (pickup into the impact without a pre-duck) and the UI tap/click levels on a phone speaker.
  All levels are in `Manifiesto.tsx` → `Soundtrack`.
- The map pin falls in from above the safe top (f453–459). It is decorative motion, not text.
