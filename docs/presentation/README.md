# Presentation deck

`pitstop-deck.html`: the course presentation for Pit-Stop Racer Pro.
Single self-contained HTML file: **20 slides + 5 backup slides**, dark "Pit Wall"
F1-telemetry style, built as one ~15-minute story.

`pitstop-speaker-script.pdf`: the full **word-for-word** speaker script (what to
read out loud, per slide, with speaker tags and stage cues). Regenerate it from
the deck with the steps in "The script PDF" below.

`pitstop-deck.pptx`: a downloadable PowerPoint version of the same 20 main
slides, one slide per HTML slide (fully revealed, final step), each slide's
`SCRIPT` entry embedded as its PowerPoint speaker notes, and a fast cross-fade
transition on every slide to approximate the HTML deck's `.slide` transition
(opacity + a small translateX, 0.34s ease). It has no click-through step
reveals or live video/animation — it is a static, presentable snapshot for
sharing/downloading, not a replacement for presenting from the HTML. Regenerate
it after editing the deck with:

```
cd docs/presentation/_pptx-build
npm install puppeteer-core   # once
node capture-slides.js /tmp/pitstop-pptx-build
pip3 install python-pptx     # once
python3 build-pptx.py /tmp/pitstop-pptx-build
```

`capture-slides.js` drives a headless Chrome/Puppeteer session that steps
through the deck exactly like a real viewer (the same arrow-key `next()`
navigation), waits for each slide's `.step` reveals to finish, grabs each
active video's live frame onto a canvas overlay so it isn't captured black,
and screenshots the result at 2x scale. `build-pptx.py` lays one image per
slide into a 16:9 deck and parses the `SCRIPT` object straight out of the HTML
so the notes never drift from the on-screen script.

Media that must sit next to the HTML:

- `monza-start.mp4` — slide 3, a 17 s F1 race-start clip (2020 Italian GP), plays at 1x (normal speed).
- `real-drive-oval.mp4` — slide 4, our own JetRacer hero lap (full-bleed), 1.5x.
- `real-pitstop-charging.mp4` — slide 10 (verdict) and slide 18 (the app); on 18 it
  starts 10 s in via `data-start`, focused on the CHARGING interaction.
- `real-curve.mp4` — slide 12, cornering = tire wear.
- `real-rain-command.mp4` — slide 13, Rain button flips the speed limit live.
- `real-telemetry.mp4` — slide 17, car driving while the phone streams the numbers.
- `real-map2.jpg` — backup slide `b01`, a second hand-built track layout.
- `real-drive-oval.mp4`, `real-curve.mp4`, `real-drive-long.mp4`,
  `real-drive-follow.mp4` — backup reel `b05`.

All clips except Monza and the hero lap are muted and loop. Every clip tagged `data-auto`
auto-plays on slide entry and rewinds on leave; `data-rate` sets its speed
(Monza 1x / normal speed, the hero lap 1.5x, the rest ~1.35–1.4x) and `data-start` trims seconds off the front.
The backup reel (`b05`) clips play on click and keep their speed. Everything else
is embedded in the HTML.

There is **no clock rail** any more: the old persistent BATTERY / TIRES / FUEL
bars along the bottom were removed because they overlapped slide content. The
`RAIL` object still exists in JS (the HUD reads its projected values) but never
renders.

`pitstop-deck-v1.html` is the previous 29-slide deck. It is **not** dead weight:
the build script reads the shared design system, the JetRacer photos, the track
geometry and the grip chart out of it. Do not delete it.

## Opening / presenting

Open `pitstop-deck.html` in any modern browser (double-click, or drag into a tab).
No build step, no server.

| key | action |
|---|---|
| `→` / `Space` / `PageDown` | next step, then next slide |
| `←` / `PageUp` | back |
| `S` | toggle the speaker script (talking points per slide) |
| `O` | slide overview grid, click any slide to jump |
| `T` | rehearsal timer (slide elapsed, total, 15:42 target, over-by) |
| `F` | fullscreen |
| `Home` / `End` | first / last slide |

Clicking the right / left third of the screen also navigates. The URL hash
(`#7`) tracks the current slide, so you can deep-link or reload in place.

## The story

Three acts, one question: *the car is fast, but how long can it stay out?*

| # | slide | act | steps |
|---|---|---|---|
| 1 | Title | — | 0 |
| 2 | The premise: the best-managed car wins | — | 2 |
| 3 | Monza race start (video) | — | 1 |
| 4 | Our car: real JetRacer hero lap (video) | — | 1 |
| 5 | Three clocks: battery, tires, fuel | — | 3 |
| 6 | Anatomy (JetRacer hardware) | — | 6 |
| 7 | Perception: steering, people, markers | — | 4 |
| 8 | **Act I card: Battery** | I | 1 |
| 9 | How many laps are left in the pack? | I | 5 |
| 10 | The verdict: 35 < 37 → BOX (+ real pit clip) | I | 4 |
| 11 | **Act II card: Tires** | II | 1 |
| 12 | Tires: wear you cannot measure (+ curve clip) | II | 3 |
| 13 | Rain: a phone changes the speed limit (+ real clip) | II | 3 |
| 14 | **Act III card: Fuel** | III | 1 |
| 15 | Fuel: the see-saw | III | 3 |
| 16 | The call: one car, three deadlines, one pit lane | III | 6 |
| 17 | Telemetry: the car races, the phone watches (+ real clip) | III | 4 |
| 18 | The app during a pit stop (+ charging clip, Katrin) | III | 3 |
| 19 | Race sim: one lap with everything on | — | 1 |
| 20 | What's built, and where this grows next + close | — | 3 |

Backup slides `b01`–`b05` sit after slide 20. Arrow navigation **skips** them;
they only appear in the `O` overview (dimmed, tagged `BACKUP`) so you can jump
to one during Q&A.

## Global mechanics

- **HUD** (top right): one number per slide, laps left, FPS, max throttle,
  latency. It morphs when the story changes it and counts digits when it is
  numeric.
- **Clock rail** (the old BATTERY / TIRES / FUEL bars along the bottom) has been
  **removed** because it overlapped slide content. The `RAIL` object still exists
  in JS so the HUD can read its projected lap values, but it never renders and
  reserves no space.
- **Speaker split** (4 voices: Fiona, Gang-Yun, Kelly, Katrin) is in the `S`
  script per slide, and in `pitstop-speaker-script.pdf`.

## What's in it

- Content follows the partner's **General Summary** (the as-built system); the
  report is only used where the summary is silent.
- The track on slides 16, 19 and the backups is rendered live from the real
  627-point Monza centreline (`app/src/track/monza.generated.ts`).
- Slide 3 is a full-bleed `<video>` with sound, played at 1x (normal speed). It auto-plays on
  entry and pauses on leave; if the browser blocks autoplay-with-audio, click play
  (controls are shown). Source: 2020 Italian GP, Formula 1. Slide 4 is our own
  JetRacer hero lap, muted and looping at 1.5x, so it plays without a prompt.
- Tire and fuel models are shown in plain English with a permanent amber
  `SIMULATED · HAND-TUNED` badge; the latency figure carries
  `ESTIMATE · PER STAGE, NOT END-TO-END`. The maths stays in the report.
- Fonts (Chakra Petch, IBM Plex Mono, Inter) load from Google Fonts, so the
  first render needs a network connection. Load it once before presenting and
  keep the tab open.

## Editing

`pitstop-deck.html` was originally **generated** from a `_build/` source set. If
that `_build/` directory is present, regenerate rather than hand-editing:

```
cd docs/presentation && python3 _build/assemble.py
```

> The real-footage pass (hero slide `shero`, the app slide `papp`, the in-slide
> clips, the backup reel, video speed-ups, the removed clock rail, and the
> `data-auto` / `data-rate` / `data-start` video engine) was applied **directly**
> to `pitstop-deck.html`. If you regenerate from `_build/`, port those changes
> back into the source parts first or they will be lost.

| file | holds |
|---|---|
| `_build/p1.html` | head, `/*__CSS__*/` token, new CSS part 1 (HUD, rail, act cards, slides 01–09) |
| `_build/p2.html` | new CSS part 2 (slides 11–18, backups, timer), `</style>` |
| `_build/p3.html` | all slide markup + chrome |
| `_build/p4.js` | engine: `SCRIPT`, `HUD`, `RAIL`, `CHOREO`, hooks, nav, timer |
| `_build/assemble.py` | splices the reused assets out of `pitstop-deck-v1.html` |

Gotchas:

- **Never give a new slide an id matching `s0`–`s27`.** The reused CSS block
  still carries the old deck's per-slide rules and they will silently win. New
  slides use the `p01`–`p18` / `b01`–`b05` prefix; `svid`, `shero` are the two
  full-bleed video slides and `papp` is the app/telemetry slide.
- `SCRIPT` is keyed by slide **position** (1-based). Inserting a slide means
  renumbering `SCRIPT`, `TARGET` and the `acts` ranges (as was done to add the
  hero slide at position 4 and the app slide at position 18).
- Video attributes: `data-auto` = play on enter / rewind on leave; `data-rate` =
  playback speed; `data-start` = seconds trimmed off the front (also the loop-in
  point). Drop `data-auto` for click-only clips (the `b05` reel).

## The script PDF

`pitstop-speaker-script.pdf` is the word-for-word script, generated from the
`SCRIPT` object in the deck. To rebuild it after editing the script:

```
# 1. dump the SCRIPT entries to a printable HTML (see /tmp/script.html recipe),
#    then render with headless Chrome (honours @page pagination):
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --no-pdf-header-footer \
  --print-to-pdf="pitstop-speaker-script.pdf" "file:///path/to/script.html"
```

The single source of truth for the words is the deck's `SCRIPT`; keep the PDF in
sync when you change a line.

## Open items

- Chair / lab name for the title slide, if the course wants one.
- Rehearse against the `T` timer: the per-slide targets sum to 15:42.
