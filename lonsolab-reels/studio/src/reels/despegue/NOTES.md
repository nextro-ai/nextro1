# Despegue: "Despegá" (Composition `Despegue`)

Cinematic trailer with a launch countdown. 1080×1920, 30 fps, 864 frames (28,8 s) on `MUSIC.despegue`
("The Ticking Overture (v2)", 100 BPM, beat = 18 f, bar = 72 f). All cuts before the liftoff sit on `bt(n) = Math.round(n * 18)`.
After the impact the track changes pulse. librosa measured about 117,5 BPM with beats at 607, 622, 638, 653, 668, **684**, 699, 714, **730**, 745, 760,
so `pbt(n)` in `timing.ts` places the hits after the liftoff.

- Render: `npx remotion render src/reels/despegue/index.tsx Despegue out/despegue.mp4 --concurrency=2` (about 4,4 min)
- Master: `python3 ../tools/master.py out/despegue.mp4` → `out/despegue.final.mp4`
- QA: `python3 ../tools/qa.py out/despegue.final.mp4 --every 0.5`
- Final file: **−14,0 LUFS integrated, −1,2 dBTP**, 28,8 s, 1080×1920, 30 fps, AAC 48 kHz.
- Dev helper: `node src/reels/despegue/stills.mjs [--jpg] 0 126 288 …` bundles once and writes `out/despegue-f<N>.(png|jpg)`.

## Look
- Night palette: tinta that shades to blue-black, with a cobalt haze, vignette and grain (feTurbulence, about 7,5 % overlay).
  Black letterbox bars (y 0–220 / 1700–1920) slide in during f0–12 and open for the end card (f790–808).
- **3D ground plane**: the brand's topo map (tiled with a 180° copy so the contours are denser; the countdown rig uses one
  seamless 3000 px tile instead, because the copy's join showed as a seam on the top-down radar) sits on a 3600 px plane
  with CSS perspective (rotateX 60–66°, a slow orbit through rotateZ, dolly through scale). The orange pin is a billboard that stands on
  the plane's centre, with a contact glow and an orange light pool on the ground.
- **Radar**: the contours lit by the sweep are the same SVG at higher brightness. A rotating `conic-gradient` mask
  combined (`mask-composite: intersect`) with a radial range mask lights them. There is also a beam wedge, dashed range rings, a crosshair and orange
  ping rings from the pin.
- **Depth layers**: far stars (230, parallax by depth, long streaks while climbing), near speed lines (64, only while the camera
  climbs), ground, dust motes on 3 depths, then the pin, particles and type.
- **Type**: Archivo variable. Mask reveals per word (2–3 f stagger), the brand "estirar" (wdth 62 → 100/112 + blur → 0)
  on the key words (despegar., vean., despegue., Despegá) and slams on beats for "Menos / una / cosa:".
  The keyword is always pin orange with a glow. The rest is papel. Countdown numerals: 560 px, wght 900, wdth 62, papel fill with a
  pin outline, orange glow, a chromatic split, an anamorphic flare and a 12 f concentric outline echo on impact.
- **Hit frames are the most energetic frames.** On every impact/beat frame the picture is already there: numerals land fully opaque
  at scale 1,45 + blur 9 + wdth 74 + max colour split and settle by t+5; radar disc, lock brackets and flare are visible on t = 0;
  "slam" and "stretch" words are fully opaque on their own frame (biggest/narrowest/blurriest), then settle; at 216 the pin is
  already in shadow on the cut frame.

## Timing per scene (absolute frames)
| Frames | Camera / image | On screen | Notes |
|---|---|---|---|
| 0–125 | Oblique ground, dolly 0,94→1,0, orbit −16°→−4°. Contours trace in (drawFrom ≈ −26 so f0 already shows lines). Radar sweep, pin pings every 2 beats | f4: **Tu negocio tiene / todo para / despegar.** (98 px wdth 105 + 164 px pin; widest line x ≈ 126–954) | Complete from f30. Bar-2 punch on f72 (ping + 4,5 % scale). Exit f112–125 |
| 126–215 | Push-in to the pin (zoom 1,0→1,55, ease-in into the cut). 60-tick launch dial on the ground, lit tick by tick | **Menos** (126) · **una** (144) · **cosa:** (162), each a slam on its beat, visible on the beat frame | "cosa:" slams from its left edge (scale 1,22) so it never touches "una". Phrase complete for 48 f |
| 216–287 | Cut: lights drop to 22 %, the radar stops, the pin is a dark silhouette with a cold rim light from the cut frame on | **Que te / vean.** (204/250 px, pin, glow) | Shake 12 px. Exit 281–287 |
| 288–359 | **T-3**: top-down radar locked on the target (centre y 905), sweep at 5°/f, one seamless topo tile | Numeral **3** in zone A (glyph ≈ y 290–770); target icon `pin` + lock brackets; **Google Maps / Que te encuentren** in zone B (box top y 1000, glyphs ≈ 1017–1135, x ≤ 880) | Shake 22 px, flare, chromatic split, outline echo |
| 360–431 | **T-2**: same rig, tilt 18°, orbit 40° | **2**, `camara`, **Redes / Que te elijan** | Shake 24 px |
| 432–503 | **T-1**: tilt 30°, orbit 80° | **1**, `web`, **Web / Que te escriban** | Shake 26 px. Each numeral flies at the lens (scale + blur) in its last 6 f |
| 504–598 | Ignition: oblique ground, darkness 15 %→93 %, slow push-in. 210 particles spiral into the pin, denser toward the end; from f555 they are ~2× bigger, faster, with ~2,5× longer streaks (≈ 35 visible early, ≈ 75 in the last second). A heat halo grows behind the pin and flares on every clock tick, with a double heat ring per tick that gets bigger each time. The rumble ramps hard over 555–598 (camera shake up to ~23 px + roll, a kick on every tick, pin vibration up to ~19 px) | f508: **Sin presencia / online, no hay / despegue.** (until f590) | Words complete from f525. Exit f583–595 |
| 599–604 | Near black (luma ≈ 9,7/255), only the glowing pin and its flare | — | Audio silence (see SFX) |
| **605** | **Liftoff**: one flash (warm, 9 f decay), shock rings in pin/papel, the contours open outward (scale 1→1,9), squash-stretch + 3 ghost frames, a burst of 84 sparks, shake 44 px. **The pin really travels**: y 1160 → ≈ 710 (≈ 450 px up the screen) by 617 while the camera is still | — | The only flash in the reel |
| 605–651 | The camera catches up: world scroll 0 → 52 px/f over 605–640, the pin settles back to y 1060. The topo plane scrolls down with the climb (the launch pad stays where the wake ends), tilts away (64→82°), shrinks (zoom 1,32→0,90) and dissolves through a radial mask: it reads as the ground receding below until ≈ 632–640 | f630: **Despegá / con Lonso Lab.** (178 px stretch + 94 px), until f778 | Pin top ≈ y 590 at 630, below the headline |
| 651–777 | Cruise at ~44 px/f: long star streaks + near speed lines on the sides, sparks. The wake is a soft tapered plume (≈ 50 px wide at the nozzle → 520 px) with a white-hot core that thins to a thread, plus 7 tighter contour lines in pin/papel/cobalt. The 3 service icons pop into an orbit (640/646/652) | (text holds) | Interrupts: **rings rush past top→bottom through the pin on pbt 638, 653, 668, 699, 714, 745, 760** (13 f each, fade in only below the headline), **684 pull-back** (the flight group shrinks to 0,6 for ~12 f so the long wake shows the altitude, back on 699) + text punch, 700–750 a band of contours the pin flies through, 730 "sound barrier" ring + shake |
| 778–800 | The camera stops following: the pin rises to y 528, the trail dissolves, the sky turns into a cobalt "dawn" | — | Text gone by f781, before the pin crosses zone A |
| 792–864 | End card on cobalt, papel topo tracing in (like the site's closing section), the pin as a beacon with flat ping rings (tip y 528) | All centred on x = 540 (measured centres 539,5–540,5): logo full papel (h 104, y ≈ 619–726) · **Auditoría / gratis** (2 lines, 112 px, wght 860, wdth 106; x 264–817, y 771–983) · **en 24 h hábiles** (58 px, cobaltoClaro, y 1005–1047) · pill **lonsolab.com →** (pin, tinta text; x 248–831, y 1088–1197) | Fully built by f819. Holds 1,5 s complete, 2,2 s readable. Light sweep across the logo f812–836 |

Safe zones checked on stills and on the QA sheet. Every text item sits inside x 90–990 and y 290–1240, and from y 840 down nothing passes
x 880 (service names: x 215–865; CTA: x 247–832). Hit frames of the slams stay inside x 90–990 (start scale 1,2 for the wide words).
Plates: 6 words ≥ 73 f, 3 words ≥ 44 f, service plates ≈ 66 f readable (title in t 1–8, line t 3–12, out t 67–71); nothing over 7 words.

## SFX (volume) and music
The music bed is a local copy of the kit's `<Music>` (`DuckedMusic` in `Sound.tsx`) at 0.88, so it can duck:
f216–224 ×0,70 · f288/360/432 +16 f ×0,68 · **f605–628 ×0,42** · f628–660 ×0,72 (10 f ramps).
I set the levels with an offline mix simulation (numpy: music × envelope + SFX at their frames, then oversampled true peak + ebur128)
because the first render clipped at 0 dBFS on the liftoff. The liftoff stays +2,3 dB louder than the bed alone. The countdown hits
match the track's own loud bar.

| Frame | SFX | Vol |
|---|---|---|
| 0 | whoosh_long (soft air under the letterbox) | 0,32 |
| 126, 144, 162, 180, 198 | tick (on the beats of "Menos una cosa:") | 2,2 |
| 216 | impact_short | 0,50 |
| 277, 349, 421 (peak ≈ 288/360/432) | whoosh_med | 0,30 |
| 288, 360 / 432 | impact_big | 0,34 / 0,30 |
| 479 → ends 599 | riser_4s | 0,62 |
| 504 → cut at 599 | **ign_bed** (`public/despegue/ign_bed.wav`, made by `make_ign_bed.py`): C2/G2/C3 drone with harmonics up to ~1,5 kHz (reads on a phone), 45–420 Hz rumble, a heartbeat thump (pitch-dropping sine + octave + soft click) on every clock tick; −25 → −20 dBFS RMS | 0,90 |
| 504, 522, 540, 558, 567, 576, 585, 591, 595 | tick (the clock speeds up; the pin pulses on each) | 1,40→1,80 |
| 605 | impact_big + boom_sub | 0,40 / 0,24 |
| 605 (peak 612) | whoosh_long, `trimBefore` 15 f (its head is cut so it starts on the impact and peaks on 612) | 0,26 |
| 640, 646, 652 | pop (orbit icons) | 0,20–0,22 |
| 776 (peak ≈ 787) | whoosh_med (pin rises to the end card) | 0,42 |
| 792 | success_chime | 0,55 |

Measured on the final (per-frame RMS): 504–598 now sits at **−27 to −12 dBFS** (it was −40 to −47 around 505–540), f599 −47 dB (tails),
**f600–604 −96 to −71 dBFS** (silence), onset at **605,0**. The only stretch under −30 before the silence is 500–503 (the end of the
T-1 bar, −35 to −37, 4 frames).
Flash check (frame-mean luma, final): 599–604 = 9/255, one up-jump at 605 (+142 → 151), then decay; only 605/606 exceed a
20-level change, so it is 1 flash (limit 3/s). The darkest frames are 599–604, as planned.

## Decisions
- **Ground plane in 3D instead of a flat radar** gives the "trailer" depth the brief asks for, and the launch reads physically: the ground falls away
  and the camera tilts up. For the countdown I cut to a top-down radar so each T-n is a visual change, and the radar target doubles
  as the service icon.
- The **service text box starts at y 1000** (glyphs ≈ 1017–1135, inside the brief's 900–1150). The review suggested ~990; I kept 1000 because the
  lock brackets end at y 997 and the "G"/"M" caps would touch them any higher.
- **whoosh_long** for the liftoff is the kit file with its first 15 f trimmed, placed on 605: it peaks on 612 as the brief asks and 599–604 stay silent.
- **Ghost numeral removed.** The 1350 px outlined numeral behind the countdown only showed as cropped straight fragments (they read as
  debug boxes). The depth echo is now a 12 f outline copy of the numeral itself, concentric, expanding and fading on each impact.
- **Wide shot at 684**: done as a pull-back of the flight group (pin, wake, orbit, rings) rather than a real reframe of the ground, which is
  thousands of px below by then. The stars and text stay put, so it reads as the camera backing off for a moment.
- No simulated UI, so there is no "Simulación" label. Copy uses the brand's own lemas (Que te encuentren / elijan / escriban) and the
  microcopy "Auditoría gratis en 24 h hábiles". No prices, no figures, no third-party logos. "Google Maps" is named as a service only.
- I removed the bear watermark from the end card (it showed as a stray vertical band below the CTA).

## Files
`index.tsx` (registerRoot) · `Despegue.tsx` (layer stack) · `timing.ts` (beats, story frames, shakes, ignition ticks) ·
`camera.ts` (camera keyframes, shake, pre-integrated climb) · `World.tsx` (sky, stars, dust, 3D ground + radar) ·
`Pin.tsx` (pin graphic, flight path incl. `liftY`, orbiting icons + ring) · `Particles.tsx` (converge, ignition pulse, sparks, plume wake, passing rings) ·
`Scenes.tsx` (all type, countdown, cloud band, boom ring, end card) · `Text.tsx` (word stack: mask/stretch/slam) ·
`Fx.tsx` (letterbox, grain, vignette, darkness, flash, anamorphic flare) · `Sound.tsx` · `make_ign_bed.py` (ignition audio bed) · `stills.mjs`.

## Review fixes (creative-director pass)
All 11 points were applied: ghost numeral removed (major); hit frames carry the picture (126/144/162/216/288/360/432); seamless topo
tile on the countdown rig; end card on x = 540 with a 2-line 112 px headline and the pill ending at y 1197; a real liftoff (pin travel,
receding ground, plume wake, speed lines, passing rings, 684 pull-back); a stronger ignition build (particles, shake, tick halo/rings);
ignition audio bed; whoosh peak on 612; service plates in earlier / out later and upward; setup lines at 98 px; "cosa:" no longer
collides. The two partial deviations (service box top 1000 instead of ~990, pull-back instead of a ground reframe at 684) are explained
under Decisions.

## Open issues
- The service plates (5 words) are readable ~66 f against the 63 f formula. The numeral changes on the bar, so there is little slack.
- 500–503 (end of the T-1 bar, before the ignition bed starts) is still about −36 dBFS for 4 frames. It reads as the bar's release, not a dropout.
- The 684 pull-back is a 2D scale of the flight group, so the sparks and the wake shrink with it. It reads as a quick camera back-off on
  the beat, not a true wide establishing shot.
- Render time is about 4,4 min at concurrency 2 (CSS 3D plane + masks + grain + the new plume/rings). Stills take about 1 s each.
