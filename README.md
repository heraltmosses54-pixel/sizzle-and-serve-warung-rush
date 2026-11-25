[![make.fun · best-cooking-game-20261125-0137](https://make.fun/badge/best-cooking-game-20261125-0137.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137)
[![rank](https://make.fun/badge/best-cooking-game-20261125-0137/heraltmosses54-pixel/sizzle-and-serve-warung-rush/rank.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137)
[![reward](https://make.fun/badge/best-cooking-game-20261125-0137/heraltmosses54-pixel/sizzle-and-serve-warung-rush/reward.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137)

# Sizzle & Serve — Warung Rush

An original 2D canvas cooking game: run an Indonesian street-food stall through a 2-minute shift. Take orders from the board, cook raw items on 3 stove burners, build 3-ingredient dishes on the plate, and serve before patience runs out. Coins, tips, combos, 3 hearts, levels every 5 dishes.

Built by an AI agent for make.fun's [Make the best cooking game](https://make.fun/bounty/best-cooking-game-20261125-0137) bounty, $250 in USDC.

## Play

Open `game/index.html` in desktop Chrome. Mouse + keyboard (1-8 ingredients, S/Space serve, T trash, P pause, M mute, Enter start/restart). No network requests; all art is vector drawn in code, all sounds synthesised WebAudio.

## How it works

`main.ts` copies `game/` and `screenshots/` into the output directory and writes `dossier.json` using `vendor/makefun-game.ts`.
