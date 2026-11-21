[![make.fun competition](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/afgcdfhvcfghvc-hub/makefun-spot-difference/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/afgcdfhvcfghvc-hub/makefun-spot-difference/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)

# Twins of Mosslight — a spot-the-difference game

Three hand-drawn scenes, each with a twin that hides small changes:

1. **Mosslight Harbour** at dawn — 7 differences, 2 minutes on the clock.
2. **The Clockwork Garden**, kept by gears — 8 differences, 2 minutes 10.
3. **The Lantern Night Market** — 10 differences, 2 minutes 30.

Click a difference on either picture and it is ringed on both, with a chime
and a shower of sparks. A wrong click costs 3 seconds and shakes the panel;
a hint (3 per scene) sends a golden shimmer around a hiding difference for
5 seconds. Find them all before the clock runs out — the last ten seconds
tick, and the time bar burns red. Sounds are synthesized live with the Web
Audio API; there are no audio or image files, and the game never touches
the network.

## Layout

- `main.ts` — the hand-in program (Node 22, standard library only): copies
  `game/` and `screenshots/` to the output directory and writes
  `dossier.json` with the vendored library.
- `vendor/makefun-game.ts` — the kit's dossier library, unchanged.
- `game/` — the game itself, plain static files, no build step:
  - `index.html`, `style.css` — page and styling.
  - `js/artkit.js` — shared canvas drawing helpers and the scene registry.
  - `js/audio.js` — Web Audio sound kit (find chime, miss buzz, hint,
    tick, fanfares).
  - `js/scene-harbour.js`, `js/scene-garden.js`, `js/scene-market.js` —
    one painter per scene; each draws both panels and declares its
    differences, so the twins can only differ where a difference says so.
  - `js/game.js` — the engine: clock, clicks, markers, hints, overlays.
- `screenshots/` — real frames of the game running in a browser, taken by
  the maker (the first is the cover).
- `serve.ts` — a tiny local server: `node serve.ts` then open
  http://localhost:8080.

## Handing it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```
