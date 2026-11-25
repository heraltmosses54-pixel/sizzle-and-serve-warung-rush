# Sizzle & Serve — Warung Rush

A complete original cooking game for make.fun's best-cooking-game-20261125-0137
competition. You run a small Indonesian street-food stall ("warung") through a
two-minute shift: read the order board, cook raw ingredients on the stove,
build each dish on the plate, and ring the serve bell before the customer loses
patience.

## How to play

- **Start:** click START SHIFT (or press Enter) on the title screen.
- **Take orders:** up to three order tickets appear on the board at the top
  left. Each shows the dish name, its three ingredients, and a patience bar
  that drains (green → amber → red).
- **Add ingredients:** click an ingredient bin on the counter, or press keys
  1–8. Rice, noodles, chili, veg and sauce go straight onto the plate.
- **Cook:** egg, chicken and skewer are raw — clicking their bin puts them on
  a free stove burner for 3 seconds (progress ring). Click a finished burner
  (glowing READY!) to move the cooked item onto the plate.
- **Serve:** when the plate holds exactly the three ingredients of an order,
  the SERVE button turns gold and the game tells you which dish matches.
  Click SERVE (or press S / Space). A correct serve pays the dish price plus a
  patience tip plus a combo bonus. A wrong dish costs a heart.
- **Trash:** click Trash plate (or press T) to clear the plate and start over.
- **Lose conditions:** a wrong serve or an expired order costs one of three
  hearts; losing all three ends the shift early. The shift also ends when the
  2:00 timer runs out.
- **Levels:** every 5 dishes served raises the level — orders arrive faster
  and patience shrinks.
- **Results:** the shift-over screen shows dishes served, coins earned, best
  combo, mistakes and a 1–3 star rating. Press Enter (or PLAY AGAIN) for
  another shift.
- **Other keys:** P / Esc pause, M mute, R is not needed — Enter restarts.

## Controls summary

- Mouse: bins, burners, SERVE, Trash, START SHIFT, PLAY AGAIN, pause, mute
- Keyboard: 1–8 ingredients, S / Space serve, T trash, P pause, M mute,
  Enter start / restart

## Sound

All effects are synthesised with WebAudio (click, add, pan sizzle, serve
chime, coin, wrong-dish buzz, level-up) — no audio files, no network.

## What it shows (screenshots)

- `1-serve.jpg` — a finished Nasi Goreng on the plate, the SERVE button lit,
  "Matches: Nasi Goreng — ring the bell!", timer at 1:27, three orders on the
  board, all eight ingredients on the counter.
- `2-play.jpg` — mid-shift: three orders with patience bars, a dish
  mid-assembly (rice + egg on the plate), timer at 1:51, stove and counter.
- `3-start.jpg` — the title screen over the kitchen, with the recipe strip
  and the START SHIFT button.
- `4-end.jpg` — the shift-complete results screen (11 dishes, 148 coins,
  2 stars, best combo x4) with PLAY AGAIN.

## How it meets the competition

- Runs in a desktop browser from static files (`game/index.html` + ES
  modules under `game/src/`), no network request at runtime (no external
  scripts, images, fonts or audio — everything is drawn or synthesised).
- Played with keyboard AND mouse.
- Original and complete: its own name, dishes (Nasi Goreng, Mie Goreng, Sate
  Ayam, Ayam Geprek, Nasi Sayur), vector art drawn in code, and synthesised
  sounds — nothing copied from any commercial game.
- A kitchen and an order board, ingredients on the counter, a dish
  mid-assembly, a timer, and a plate ready to serve are all visible in the
  screenshots, which are real renders of the game's own code (staged with
  `?shot=<name>&seed=1`, deterministic per seed).
- `main.ts` (Node 22) copies `game/` and `screenshots/` to the output and
  writes `dossier.json` with the kit's vendored `vendor/makefun-game.ts`
  (copied unchanged). `node serve.ts` serves the game locally on port 8080.

## Files

- `main.ts` — the entry program (copies game/ + screenshots/, writes dossier.json)
- `vendor/makefun-game.ts` — the kit's library, unchanged
- `serve.ts` — local static server for play-testing
- `game/index.html`, `game/src/config.js` (data + balance), `game/src/world.js`
  (rules), `game/src/render.js` (all drawing), `game/src/input.js` (mouse +
  keyboard), `game/src/audio.js` (synth sounds), `game/src/shots.js`
  (screenshot scenes), `game/src/main.js` (boot + game loop)
- `screenshots/` — 4 JPEGs, 1280×720, each under 256 KiB
- `shots.json` — the query behind each screenshot
