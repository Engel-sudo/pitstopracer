# Presentation deck

`pitstop-deck.html` — the course presentation for Pit-Stop Racer Pro.
One HTML file: 20 slides, dark "Pit Wall" F1-telemetry style. Slide 3 plays
`monza-start.mp4` (a 17 s F1 race-start clip); keep that file next to the HTML.

## Opening / presenting

Open `pitstop-deck.html` in any modern browser (double-click, or drag into a tab).
No build step, no server.

| key | action |
|---|---|
| `→` / `Space` / `PageDown` | next step, then next slide |
| `←` / `PageUp` | back |
| `S` | toggle the speaker script (talking points per slide) |
| `O` | slide overview grid — click any slide to jump |
| `F` | fullscreen |
| `Home` / `End` | first / last slide |

Clicking the right / left third of the screen also navigates. The URL hash
(`#7`) tracks the current slide, so you can deep-link or reload in place.

## What's in it

- Content is grounded in the **final report** (`Pit_Stop_Racer_Pro.pdf`) and the
  extracted track geometry (`app/src/track/monza.generated.ts`).
- The track on slides 9, 17, 18 is rendered live from the real 627-point
  centreline — same data the digital twin uses.
- Slide 3 is a full-bleed `<video>` (`monza-start.mp4`, with sound). It auto-plays
  on entry and pauses on leave; if the browser blocks autoplay-with-audio, the
  presenter clicks play (controls are shown). Source: 2020 Italian GP, Formula 1.
- The JetRacer photo and all three charts (Peukert discharge, latency budget,
  grip vs. humidity) are embedded — nothing loads from disk.
- Fonts (Chakra Petch, IBM Plex Mono, Inter) load from Google Fonts, so the
  first render needs a network connection. Load it once before presenting and
  keep the tab open.

## Editing

It's plain HTML/CSS/JS in one file:

- **Slide content** — each slide is a `<section class="slide" id="s1" …>`. Edit
  the text directly. `data-steps="N"` on the section = how many click-reveals it
  has; elements with `class="step" data-s="2"` appear on step 2.
- **Speaker notes** — the `SCRIPT` object near the top of the `<script>`, keyed
  by slide number (1–20). Insert a slide → renumber the keys and the
  `f-count` / `acts` ranges below.
- **Visual system** — the CSS custom properties in `:root` (`--cyan`, `--amber`,
  `--ink0`, the three font stacks). Change once, applies everywhere.
- **Charts** — `peukertChart()`, `gripChart()` build inline SVG; the numbers are
  in those functions.
- **Track data** — the `TRACK` object at the top of the `<script>` is inlined
  from `monza.generated.ts`.

## Open items

- Slide 20: Fiona's contribution line is a placeholder — confirm and replace.
- Slide 17: demo video slot — currently shows the live twin as a stand-in.
