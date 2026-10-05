# Reel 4 · `pov`: "POV: tu negocio es buenísimo…" (Composition `Pov`)

1080×1920, 30 fps, 921 frames (30,7 s) = `MUSIC.pov.duration_frames`. The music bed is "Cozy Afternoon" (85,9 BPM,
beat 20,955 f, bar 83,82 f) and plays from f0, which is a downbeat. Every cut and mark is placed with `bt(n)` / `bar(n)`
in `timing.ts`, computed as `Math.round(n * beat_frames)`, so rounding errors don't add up.

- Render: `npx remotion render src/reels/pov/index.tsx Pov out/pov.mp4 --concurrency=2` (about 2 min 10 s)
- Master: `python3 ../tools/master.py out/pov.mp4` writes `out/pov.final.mp4`
- QA: `python3 ../tools/qa.py out/pov.final.mp4 --every 0.5`
- Stills: `node src/reels/pov/stills.mjs 0 84 …` writes `out/pov-stills/pov-fN.jpg` (bundles once; `OUT=dir` changes the folder)

**Final measurement** (`out/pov.final.mp4`, after the review fixes): −13,9 LUFS integrated, true peak −1,0 dBFS,
LRA 6,1 LU, 921 video frames, 1080×1920, 30 fps, AAC 48 kHz audio.

## Look
The look is a Swiss editorial page on papel `#f3f4ef`:
- **Page texture:** 12-column grid (margins 90, gutter 20). Ruled lines every 64 px in `linea`, a margin rule, column ticks and registration marks in the image-only bands (y < 290, y > 1240). Static paper-fibre grain (feTurbulence, multiply, about 4 %) and a soft vignette.
- **Type:** Archivo 820 / wdth 104–112 % for headlines, leading 1.06. List items in Archivo 620 at 60 px on a 64 px line (1.07). Numbering in Archivo 800 condensed (wdth 75 %).
- **Hand marks** (`marks.tsx`): strike-throughs (6 px, pin), the highlighter at 38 % multiply, the loop around "otro" (pinHondo, same as the word), the ticks and the underline. Each one uses a fixed-seed wobble plus a light displacement filter so the edge looks like a real marker.
- **Motion:** entrances are 12 f mask reveals with `EASE.salida`. Reveals that land on a cut start 1 f early (`PRE`), so the cut frame already shows the top half of the type. Cuts are dry and land on beats. There is no shake and no bounce.
- **Colour roles:** pin = "tu negocio" and the action, cobalto = "nosotros", tinta = everything else.

Story device: "tu negocio" is the orange pin on the site's topo-map card, and the map is now the through-line of the
image band. In the hook the camera pulls back until the pin is a speck ("nadie se entera"). Under the "antes" list the
card stays as a grey speck (still nobody finds you). Under the "después" list it is in colour and pings on every tick.
At "Nosotros…" it rises out of the band and pushes in, and people walk up to the pin ("que se vea"). The CTA closes with
the pin, its visitors and one last ping on the brand contours. The map card carries a small "Ejemplo ilustrativo" tag.
The business is generic ("Tu negocio"), with no logos and no numbers.

## Timing (frames)
| Frames | Scene | What happens | Cue |
|---|---|---|---|
| 0–83 | Hook | Native-caption POV plate **"POV: tu negocio / es buenísimo…"**. An ink copy of the text is readable from f0, and the ink box wipes in behind it in 6 f, turning the text white. The map card shows the pin (it drops 10 f) and the "Tu negocio ★★★★★" chip. Stars land at f6–28. Orange ping at f42. | downbeat 0 |
| 84–167 | Hook | The plate lifts 150 px (12 f) and **"…y nadie / se entera."** rises (126 px). Pin highlighter on "nadie" at f98. The map pulls back 1.0 → 0.3 (f84–114), so the pin becomes a speck. Small second ping at f126. | bar 1 |
| 168–334 | Antes | Dry cut. Counter **01/04** + title **"Por qué no te / encuentran"** (pre-rolled 1 f). The title rule draws at f178, after the title has landed. Items every 1,5 beats: f168 · 199 · 231 · 262. Each one is struck one beat later: f189 · 220 · 251 · 283. "Fotos viejas en tu ficha de Google" · "Reseñas sin responder" · "Último posteo: marzo" · "Tu web no se ve bien en el celu". The hook's map card sits in the image band (top 1166) as a grey speck, with no ping. | bars 2–3 |
| 335–376 | Breakdown | The music empties. The header and the grey map leave (335–349). The struck list stays fully crisp on the page. | cue `breakdown` 335 |
| 377–418 | Breakdown | The list drains to grey, blurs and sinks 380 px into the image zone (377–407). **"Cada día que / no aparecés,"** rises at f377. Slow push-in of 1.025 runs to f503. | half bar 377 |
| 419–502 | Breakdown | **"alguien le / compra a otro."** ("otro." in pinHondo). The marker loop around "otro." (pinHondo) is drawn at f435. The full stop sits inside the loop, which clears the "a" by about 20 px. Block ends at y 835 or above. | bar 5 |
| 497–509 | Page turn | 12 f lateral wipe centred on f503. The paper page slides left and darkens. The incoming page arrives from the right with a page-edge shadow. | bar 6 |
| 503–570 | Section opener | The back of the page is cobalto. **"Lo que / hacemos / nosotros:"** in papel at 150 px. Topo contours trace in. The bear mark peeks in from the left edge as a cobalto-hondo watermark at 30 %, with the L-stem off-frame. It drifts 2 % across the page. A pinHondo underline under "nosotros:" (x 92–839) is drawn at f545. | half bar 545 |
| 571–586 | Fold | The headline folds into the list title: "Lo que" settles, "hacemos" slides right and climbs into line 1, and "nosotros:" follows. The underline lifts off. | bt 27,25 |
| 587–774 | Después | Dry cut back to paper on the groove's return. The title is pixel-identical across the cut. Counter 01/04 in cobalto. Each tick starts 5 f early and completes ON the beat: f587 (on the cut) · 629 · 671 · 712. "Ficha completa y optimizada" · "Reseñas respondidas con tu tono" · "Contenido todas las semanas" · "Web pensada para el celular". There are no numbers in this list: the tick replaces them. In the band (top 1262) the map is in colour, pings on every tick and creeps in from 0,27 to 0,4. | cue `groove_back` 587 |
| 754–774 | Vos | The header is replaced by **"Vos seguís con / tu negocio."** (pre-rolled 1 f). The finished checklist stays underneath for one more beat. | bar 9 |
| 775–858 | Nosotros | **"Nosotros nos / ocupamos de / que se vea."** in cobalto, with the highlighter on "se vea" at f793. The map card rises out of the band (1262 → 956, 14 f) and pushes in to the pin (775–808). Pings at f796, 817 and 838. People walk up to the pin from f793. The card drops out at f846–856. | beat 37 |
| 853–865 | → CTA | The headline block scales to 0.76 and stays. | |
| 859–921 | CTA (2,07 s) | The pin pill **"Pedí tu auditoría gratis"** (with the site's chat icon) reaches full size ON f859. Then a 2 px rule, the full logo (h 98), **"lonsolab.com"** and **"WhatsApp +54 3541 33-7818"**, all at x ≤ 880. In the band, the brand contours draw in all at once (cobalto 42 %), and the pin drops in with 4 visitors. Specular shine on the pill at f880, last ping on the pin at f901. | bt 41 |

**Visual interruptions** fall at 0, 6, 42, 84, 98, 126, 168, 178, 189, 199, 220, 231, 251, 262, 283, 335, 377, 419, 435,
497, 545, 571, 587, 629, 671, 712, 754, 775, 793, 796, 817, 838, 846, 859, 880 and 901. The longest gap is 52 f (283→335, 1,7 s).

**Reading time (0,5 s + 0,32 s × words):** "antes" item 4 (9 words, needs 101 f) is crisp for 115 f (262–377). Item 1
(7 words, 82 f) gets 210 f. "Después" item 4 (5 words, 63 f) gets 68 f (707–775). "Nosotros nos ocupamos de que se vea."
(7 words, 82 f) is full size for 78 f, then stays at 76 % until the end (146 f in total). "Lo que hacemos nosotros:" is
full size on cobalto for 68 f (needs 53 f) and then stays as the list title.

**Large luminance changes:** only the paper → cobalto turn (f497–509) and cobalto → paper (f587). That is fewer than 3 flashes per second.

## SFX (`Sound.tsx`)
| Frame | SFX | Vol | Why |
|---|---|---|---|
| 0 | tick + ui_tap | 1.0 / 0.5 | brief: tick at f0, the plate box wipes in |
| 96 | swipe | 0.22 | highlighter on "nadie" |
| 188, 219, 250, 282 | swipe | 0.35 | each strike-through (one beat after its item; peak about 3 f in) |
| 434 | swipe | 0.28 | loop around "otro" |
| 492 | whoosh_med | 0.6 | its peak (+10,9 f) lands on the page-turn downbeat, f503 |
| 544 | swipe | 0.18 | underline under "nosotros:" |
| 573 | swipe | 0.16 | the opener folds into the list title |
| 587, 629, 671, 712 | tick + ui_click + ui_tap | 1.0 / 0.7 / 0.5 | each tick is 97 % drawn on this frame (on the beat) |
| 624, 666, 707 | swipe | 0.2 | pen stroke start of ticks 2–4 (tick 1 is drawn before the cut, so it has no swipe) |
| 791 | swipe | 0.2 | highlighter on "se vea" |
| 859 | pop | 0.6 | CTA pill reaches full size (97 %) on this frame |

Music volume is 0.82 with a 3 f fade-in and an 18 f fade-out, and no ducking: the lo-fi bed has enough room. Impacts land
on their visual frame and never before. Mastered with `master.py`.

## Review fixes (creative-director review, score 7, "needs_fixes")
1. **Reading time, "antes" (major):** items now come every 1,5 beats (168/199/231/262). The list stays crisp until bt(18) = 377, and "Cada día que no aparecés," comes in there. Item 4 gets 115 f, more than the 101 f it needs. Each strike lands one full beat after its item (it used to be an eighth), at 6 px instead of 8. The struck text settles on tinta2 at full opacity. *Not changed:* the copy "Tu web no se ve bien en el celu" (9 words). It is the brief's wording, and the reviewer made shortening it ("Tu web no anda en el celu") conditional on the client. The client should decide. With the new timing it already meets the reading rule.
2. **Ghost numerals behind the ticks (major):** the "después" list no longer renders numbers at all, so the tick is the only mark in that column. Ticks start at x 96 (measured), inside the 90 px margin.
3. **"que se vea." vs map card:** the "Vos/Nosotros" block starts at y 300 with 1.06 leading. The last line's descenders end at y 832, and the card top is at y 958 (126 px gap).
4. **Loop around "otro":** the loop is wider and taller (300×160) and sits 20 px to the right. "otro" gets 0.14 em more space, so the loop clears the "a" by about 20 px and the full stop sits fully inside. The loop and the word share pinHondo. The headline is now 108 px, at top 306 with a 24 px gap, and ends at y 835 or above at maximum push. Its widest point (x 917) is above y 840.
5. **Bear watermark:** the mark is now 1300 px tall and shifted off the left edge, so the L-stem is out of frame and the bear head is the hero. Opacity is 0.5 → 0.3 (−40 %), with a 2 % scale drift plus a slight translate across the page. The reviewer's "+250 px right" would have moved the stem toward the centre (it is on the mark's left), so I moved it the other way to get the result they asked for.
6. **Empty cut frames:** I rewrote `Rise`. It now uses a clip-path that does not affect layout, and the text starts 135 % low, so no accent peeks through on the first frame. Reveals that land on a cut (f168 title + counter + item 1, f754 "Vos seguís", the f587 counter) start 1 f early, so the downbeat frame shows about 45 % of the type. The title rule draws at f178, after the title has landed.
7. **Empty image band:** the map card is now the band's decoration through the whole reel: grey speck under "antes", colour + pings under "después", rising into the "Nosotros" push-in, and a pin + visitors + ping on the contours under the CTA. The CTA contours draw in all together (a local `TopoTogether`; the kit's `Topo` staggers its lines). The lone stray stroke is gone.
8. **List typography:** the old `Rise` used padding plus negative margins, and the negative margins collapsed. That squeezed list lines to about 0.85 leading and pushed headlines out to about 1.18. Now the list leading is a true 1.07 (60/64 px), headlines are a true 1.06, there are 22 px between the title rule and row 01, and single-line rows get 16 px of padding instead of 12.
9. **"Lo que hacemos nosotros:" stutter:** the cobalt headline now folds into the paper list title (571–587), so the words do not repeat. They stay put and the page flips under them. The landing position matches to the pixel across the dry cut (I measured the advance of "Lo que " with fontTools: 359,7 px).
10. **Impacts before visuals:** the pop sits on the frame where the pill reaches full scale. The tick/click SFX sit on the frame where each tick is 97 % drawn, which is the beat, because the draw starts 5 f early. The swipes stay on the stroke start.
11. **Close length:** the CTA now builds on bt(41) = 859, so the close is 2,07 s, inside the common rule's 2–2,5 s. *Deviation from the brief's frame table* (it said the CTA and the pop at f838). The common rule and the reading time of "Nosotros… que se vea." win. Bar 10 (f838) now carries the third ping on the map.
12. **Underline outside the grid:** the underline now runs x 92–839, from the text edge to the colon (`Strike` `edge` option). It uses pinHondo on cobalto, which is a bit darker than pin, so it vibrates less.

## Decisions
- **POV plate:** native-caption style (white on an ink box, per-line rounded boxes), aligned flush-left to the grid. The punchline is set in big editorial type on the paper, so the pin highlighter reads as a marker.
- **List counter:** the "01/04" counter is a kicker row above each list title, with a rule.
- **Cobalto opener:** the back of the turned page, a brand-colour beat between the two paper lists that echoes lonsolab.com's closing band. It folds into the next page's title instead of repeating it.
- **CTA layout:** the CTA is flush-left (x 90–880) rather than centred, to match the grid. Rail and safe zone are respected (nothing at x > 880 below y 840; text at y ≤ 1240).
- **Kit usage:** `Logo`, `Topo`, `Icon`, `Sfx`, `EASE`, `C`, `MUSIC` and `TOPO_PATHS` are used read-only. The CTA contour field (`TopoTogether`), the map's topo field and the music `<Audio>` are local.

## Files
`index.tsx` (registerRoot) · `Pov.tsx` (two pages + page turn) · `timing.ts` · `Paper.tsx` · `type.tsx` (type presets,
`Rise` clip-path reveal, `PRE`) · `marks.tsx` (Strike, Highlight, Loop, Tick, Arrow, MarkerFilter) · `MapCard.tsx` (+ `pinY`,
`grey`, `opacity`, exported `PinShape`) · `List.tsx` · `SceneHook.tsx` · `SceneBefore.tsx` (antes + breakdown) ·
`ScenePages.tsx` (opener + fold, después, close, CTA) · `Sound.tsx` · `stills.mjs`.

## Open issues / notes
- **Copy (client decision):** "Tu web no se ve bien en el celu" is 9 words, over the common "máx. 7 palabras por placa". That wording comes from the brief, and the timing now gives it enough reading time. The suggested shorter "Tu web no anda en el celu" is for the client to approve.
- **CTA at f859 instead of f838:** this deviates from the brief's frame table, as explained in fix 11.
- **Tick 1** completes on the cut frame (f587), so its stroke is not seen being drawn. The click lands on the groove's return. Ticks 2–4 are drawn in view.
- **Headline leading:** after the `Rise` fix, every headline is set at a true 1.06 instead of the accidental about 1.18. The hook punchline, the breakdown and the close are slightly tighter than in the reviewed cut. I checked them for accent/descender collisions.
- **Music:** the bed is the user's own Suno track (paid plan). The user says the songs are now public. That doesn't change the render: `music/pov.wav` is the same file. For commercial use, the license is the paid-plan one.
- `arrow` in `timing.ts` (f545) drives the "nosotros:" underline. The `Arrow` component in `marks.tsx` is kept but unused.
