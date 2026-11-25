// A working best-cooking-game-20261125-0137 entry (Node 22, standard library only): the game
// is this directory's game/ folder, plain static files a desktop browser loads offline
// (game/index.html and its ES modules, no library and no network request), and the program
// hands it in. It copies game/ and screenshots/ from beside this file to /output and writes
// /output/dossier.json, the summary the judge reads, with the vendored make.fun library.
//
// The game is Sizzle & Serve — Warung Rush, a complete 2D canvas cooking game: run an
// Indonesian street-food stall through a 2-minute shift. 4 screens (title, play, pause,
// results); 5 dishes (Nasi Goreng, Mie Goreng, Sate Ayam, Ayam Geprek, Nasi Sayur) built
// from 8 ingredients on the counter; 3 stove burners where raw food cooks in 3.5s and burns
// if left 8s after READY (trashed, ingredient lost); an order board of up to 3 tickets
// with draining patience bars, flashing urgency, customer mood faces and random VIP rush
// orders worth double coins; five BIG customers waiting behind the counter
// (ojek driver, ibu, student, office worker, pak in batik) — head, shoulders
// and torso rising above the wooden counter front, lower bodies hidden behind
// it like a person behind the counter in a real warung, with thought bubbles
// showing each ordered dish and patience bars on the counter face mirroring
// the tickets, against a detailed wood-plank wall (SATE AYAM poster, menu
// board, hanging banner and plant, crack and stains), under a striped awning
// with string lights, a night sky with moon, a BUKA sign and stools; a 3-slot
// plate and a
// + combo bonuses; 3 hearts (wrong dish or walk-out costs one); levels every 5 dishes
// (faster spawns, shorter patience); juice throughout — particle bursts, floating "+Rp"
// text, squash-and-stretch on the serve button and plate, screen shake on mistakes,
// coin-pop in the HUD, pitch-varied WebAudio SFX and a quiet pentatonic music loop (M to
// mute); flat vector art drawn in code and all sound synthesised, so the game needs no
// assets, no fonts beyond system-ui, and makes no network request. Screenshots are real
// renders of the game's own code, staged deterministically with ?shot=<name>&seed=1:
// 1-serve (busy mid-shift cover: five-customer queue + storefront), 2-play (full burners + steam),
// 3-rush (urgency moment), 4-end (results with stars and coins). Build your own cooking game in its place, put
// your 3 or 4 PNG or JPEG screenshots in screenshots/ (the first by name is the cover)
// and run it.
//
// Serve it locally with `node serve.ts`, then open http://localhost:8080.
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'game'), join(out, 'game'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes the bytes; the others refuse an entry the
// scorer would refuse (more than 4 screenshots or one over 256 KiB; more than 993 files in game/ or 48 MiB of game
// files, in all, or a path under game/ over 1000 bytes: game/ counts beside /output's own 1000-entry cap, its
// screenshots/ and dossier.json).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  }),
);
