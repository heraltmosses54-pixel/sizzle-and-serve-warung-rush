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
  a free stove burner for 3.5 seconds (progress ring). Click a finished burner
  (glowing READY!) to move the cooked item onto the plate. **Burn:** a finished
  item left on its burner burns after 8 seconds — click the burnt burner to trash
  it; the ingredient is lost, so don't leave food sitting.
- **VIP rush orders:** about 1 in 7 tickets is a gold VIP — worth double coins,
  but its patience drains faster, so it rewards fast, focused play.
- **Serve:** when the plate holds exactly the three ingredients of an order,
  the SERVE button turns gold and the game tells you which dish matches.
  Click SERVE (or press S / Space). A correct serve pays the dish price plus a
  patience tip plus a combo bonus. A wrong dish costs a heart.
- **Trash:** click Trash plate (or press T) to clear the plate and start over.
- **Lose conditions:** a wrong serve or an expired order costs one of three
  hearts; losing all three ends the shift early. The shift also ends when the
  2:00 timer runs out.
- **Levels:** every 5 dishes served raises the level — orders arrive faster
  and patience shrinks (down to 8 seconds at high levels), so the rush builds.
- **Results:** the shift-over screen shows dishes served, coins earned, best
  combo, mistakes and a 1–3 star rating. Press Enter (or PLAY AGAIN) for
  another shift.
- **Other keys:** P / Esc pause, M mute, R is not needed — Enter restarts.

## Controls summary

- Mouse: bins, burners, SERVE, Trash, START SHIFT, PLAY AGAIN, pause, mute
- Keyboard: 1–8 ingredients, S / Space serve, T trash, P pause, M mute,
  Enter start / restart

## Sound

All effects are synthesised with WebAudio (click, add, pan sizzle, cook-done
chime, serve chime, coin, wrong-dish buzz, order-expired sigh, burn sizzle,
level-up) — no audio files, no network. Repeated actions get a small pitch
wobble so they never sound identical. A quiet pentatonic music loop
(gamelan-ish, with a low gong each bar) plays under the shift; M or the mute
button silences everything. Juice: particle bursts and floating "+Rp" text on
every serve, squash-and-stretch on the serve button and plate, a screen shake
on mistakes, and a coin-pop in the HUD.

## What it shows (screenshots)

- `1-serve.jpg` — the busy-service cover: five big customers standing INSIDE
  the warung on a wooden waiting deck (ojek driver, ibu, student, office
  worker, pak in batik), roughly twice their old size, feet planted on one
  floor line with a soft shadow under each pair of shoes — nobody floats —
  each with a thought bubble showing their dish and a patience bar on the
  deck face; the wall behind them is a real warung wall now (wood planks
  with grain and nails, a framed SATE AYAM poster, a TODAY'S MENU board, a
  red SATE/MIE/NASI banner, a hanging plant, a crack and damp stains), under
  a red-and-cream awning and string lights, night sky with moon in the
  window, a BUKA sign, cash register and stools. The plate sits to the right
  of the queue so all five customers stay fully visible. Two dishes already
  served (coins on the board, COMBO x2), a finished Sate Ayam on the plate
  with the SERVE button lit gold ("Matches: Sate Ayam — ring the bell!"),
  a fresh egg mid-cook on a burner with its progress ring, timer at 1:27.
- `2-play.jpg` — the stove at full tilt: all three burners cooking with steam,
  a dish mid-assembly (rice + noodles on the plate), two orders on the board,
  and the queue waiting under the awning.
- `3-rush.jpg` — the urgency moment: a ticket about to walk out (patience bar
  red and flashing, worried customer face in the queue), timer at 0:24, one
  heart already lost, an egg still cooking.
- `4-end.jpg` — the shift-complete results screen (11 dishes, 148 coins,
  2 stars, best combo x4, 2 mistakes, 1 heart left) with PLAY AGAIN.

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
  `?shot=<name>&seed=1`, deterministic per seed). The scene is a full warung
  storefront, not just a counter: five big customers (ojek driver, ibu,
  student, office worker, pak in batik — VIP customers get a gold outline)
  standing inside the warung on a wooden waiting deck, feet planted with a
  shadow under each pair of shoes, with thought bubbles showing each ordered
  dish and patience bars mirroring the tickets, against a detailed wood-plank
  wall (SATE AYAM poster, menu board, hanging banner and plant, crack and
  stains), a striped awning, string lights, a night sky with moon, a
  BUKA sign, a cash register and stools.
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
