// The screenshot scenes behind ?shot=start|play|serve|end. Each one plays the real rules
// forward from a fresh world with a fixed seed, so every frame is what a short game really
// looks like and the same seed always gives the same frame.
import { SCREEN_OVER, SCREEN_PLAY, SCREEN_TITLE } from './world.js';

/** Advance the world `seconds` of play time without real input. */
function run(world, seconds) {
  const steps = Math.round(seconds * 60);
  for (let i = 0; i < steps; i += 1) world.step(1 / 60);
}

/**
 * Set `world` to the named scene and return the screen to draw. Unknown names are start.
 * - start: title screen over a quiet kitchen (a few seconds of idle world behind it).
 * - play: mid-shift — two orders on the board, a dish half-built on the plate, burners going.
 * - serve: a finished plate that matches an order, ready for the bell, timer still running.
 * - end: the shift-over results screen after a busy shift.
 */
export function stageShot(name, world) {
  world.reset();
  if (name === 'play') {
    world.screen = SCREEN_PLAY;
    world.spawnOrder();
    run(world, 3);
    world.spawnOrder();
    world.addIngredient('rice');
    world.addIngredient('egg'); // onto a burner
    run(world, 3.2); // egg finishes cooking
    world.takeBurner(0); // plate now holds rice + egg: a dish mid-assembly
    run(world, 2);
    return { screen: SCREEN_PLAY };
  }
  if (name === 'serve') {
    world.screen = SCREEN_PLAY;
    // Force the first order to be Nasi Goreng so the plate matches it exactly.
    world.spawnOrder();
    world.orders[0].recipe = { id: 'nasi-goreng', name: 'Nasi Goreng', needs: ['rice', 'egg', 'chili'], coins: 12 };
    world.spawnOrder();
    world.addIngredient('rice');
    world.addIngredient('egg');
    run(world, 3.2);
    world.takeBurner(0);
    world.addIngredient('chili');
    world.timeLeft = 87; // a mid-shift timer reading
    run(world, 1.5);
    world.timeLeft = 87;
    return { screen: SCREEN_PLAY };
  }
  if (name === 'end') {
    world.screen = SCREEN_PLAY;
    world.coins = 148;
    world.served = 11;
    world.bestCombo = 4;
    world.mistakes = 2;
    world.timeLeft = 0;
    world.screen = SCREEN_OVER;
    return { screen: SCREEN_OVER };
  }
  run(world, 5);
  return { screen: SCREEN_TITLE };
}
