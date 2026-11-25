// The screenshot scenes behind ?shot=start|play|serve|rush|end. Each one plays the real
// rules forward from a fresh world with a fixed seed, so every frame is what a short game
// really looks like and the same seed always gives the same frame.
//
// The four shipped shots are four visibly different moments:
// - serve (cover): a busy mid-shift — two dishes already served, coins and a combo on the
//   board, a finished Sate Ayam on the plate with the SERVE bell lit, and a fresh egg
//   mid-cook on a burner with its progress ring showing.
// - play: the stove at full tilt — all three burners cooking with steam, a dish
//   mid-assembly on the plate, two orders on the board.
// - rush: urgency — one ticket about to walk out (patience bar red and flashing), the
//   timer in its final stretch, one heart already lost.
// - end: the shift-over results screen after a busy shift (11 dishes, 148 coins, 2 stars,
//   best combo x4, 2 mistakes — and 1 heart left, because mistakes cost hearts).
import { SCREEN_OVER, SCREEN_PLAY, SCREEN_TITLE } from './world.js';

/** Advance the world `seconds` of play time without real input. */
function run(world, seconds) {
  const steps = Math.round(seconds * 60);
  for (let i = 0; i < steps; i += 1) world.step(1 / 60);
}

/** Serve one forced dish: put `recipe` on the board, build it, ring the bell. */
function serveForced(world, recipe) {
  world.spawnOrder();
  world.orders[world.orders.length - 1].recipe = recipe;
  const cooked = recipe.needs.filter((id) => id === 'egg' || id === 'chicken' || id === 'skewer');
  for (const id of recipe.needs) {
    if (cooked.includes(id)) continue;
    world.addIngredient(id);
  }
  for (const id of cooked) world.addIngredient(id);
  run(world, 3.7); // everything on the burners finishes (cook takes 3.5s)
  for (let i = 0; i < 3; i += 1) world.takeBurner(i);
  world.serve();
}

/**
 * Set `world` to the named scene and return the screen to draw. Unknown names are start.
 * - start: title screen over a quiet kitchen (a few seconds of idle world behind it).
 * - play: mid-shift — two orders on the board, a dish half-built on the plate, burners going.
 * - serve: a finished plate that matches an order, ready for the bell, timer still running.
 * - rush: an order about to expire, low timer, one heart lost — the urgency moment.
 * - end: the shift-over results screen after a busy shift.
 */
export function stageShot(name, world) {
  world.reset();
  if (name === 'play') {
    world.screen = SCREEN_PLAY;
    world.spawnOrder();
    world.spawnOrder();
    world.addIngredient('rice');
    world.addIngredient('noodle');
    world.addIngredient('egg'); // burner 0
    world.addIngredient('chicken'); // burner 1
    world.addIngredient('skewer'); // burner 2, all three cooking at once
    run(world, 1.6); // burners about half cooked: progress rings + steam
    world.timeLeft = 105;
    return { screen: SCREEN_PLAY };
  }
  if (name === 'serve') {
    world.screen = SCREEN_PLAY;
    // Two dishes served first, so the cover shows coins, dishes served and a combo.
    serveForced(world, { id: 'nasi-goreng', name: 'Nasi Goreng', needs: ['rice', 'egg', 'chili'], coins: 12 });
    serveForced(world, { id: 'mie-goreng', name: 'Mie Goreng', needs: ['noodle', 'egg', 'veg'], coins: 12 });
    // Final frame: a finished Sate Ayam on the plate, bell lit, and a fresh egg
    // mid-cook on a burner — a busy stove, not an empty one.
    world.spawnOrder();
    world.orders[world.orders.length - 1].recipe = { id: 'sate-ayam', name: 'Sate Ayam', needs: ['skewer', 'chicken', 'sauce'], coins: 16 };
    world.spawnOrder(); // a second ticket for a busy board
    world.addIngredient('sauce');
    world.addIngredient('skewer');
    world.addIngredient('chicken');
    run(world, 3.7);
    world.takeBurner(0); // skewer onto the plate
    world.takeBurner(1); // chicken onto the plate: plate matches Sate Ayam
    world.addIngredient('egg'); // a fresh burner, mid-cook for the frame
    run(world, 1.4); // egg ~40% cooked: progress ring visible, serve floater faded
    world.timeLeft = 87; // a mid-shift timer reading
    return { screen: SCREEN_PLAY };
  }
  if (name === 'rush') {
    world.screen = SCREEN_PLAY;
    world.spawnOrder();
    world.spawnOrder();
    world.spawnOrder();
    // The first ticket is about to walk out: patience nearly gone, bar red and flashing.
    world.orders[0].patience = 2.5;
    world.hearts = 2; // one heart already lost this shift
    world.coins = 54;
    world.served = 4;
    world.combo = 3;
    world.addIngredient('rice');
    world.addIngredient('egg');
    run(world, 1.0); // egg still cooking; the ticket ticks down to ~1.5s left
    world.timeLeft = 24; // the final stretch of the shift
    return { screen: SCREEN_PLAY };
  }
  if (name === 'end') {
    world.screen = SCREEN_PLAY;
    world.coins = 148;
    world.served = 11;
    world.bestCombo = 4;
    world.mistakes = 2;
    world.hearts = 1; // 3 hearts minus 2 mistakes
    world.timeLeft = 0;
    world.screen = SCREEN_OVER;
    return { screen: SCREEN_OVER };
  }
  run(world, 5);
  return { screen: SCREEN_TITLE };
}
