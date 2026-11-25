// Sizzle & Serve — Warung Rush: boot, the fixed-step game loop, and the screenshot mode.
// The canvas is 1280x720 logical pixels and scales to the window; the loop runs the world
// at 60 steps a second and draws every frame. With ?shot=<name>&seed=<n> in the URL the
// game instead stages one deterministic scene (see shots.js) and draws it once, so the
// screenshots are real renders of the game's own code.
import { STEP, VIEW } from './config.js';
import { SoundKit } from './audio.js';
import { InputHandler } from './input.js';
import { render } from './render.js';
import { stageShot } from './shots.js';
import { World } from './world.js';

const canvas = document.getElementById('game');
const status = document.getElementById('status');
const ctx = canvas.getContext('2d');

function fitCanvas() {
  const scale = Math.min(window.innerWidth / VIEW.width, window.innerHeight / VIEW.height);
  canvas.width = VIEW.width;
  canvas.height = VIEW.height;
  canvas.style.width = `${Math.floor(VIEW.width * scale)}px`;
  canvas.style.height = `${Math.floor(VIEW.height * scale)}px`;
}
window.addEventListener('resize', fitCanvas);
fitCanvas();

const params = new URLSearchParams(window.location.search);
const seed = Number(params.get('seed') ?? 1) || 1;
const world = new World(seed);
window.__world = world; // debug handle: lets automated play-tests read the live state
const sound = new SoundKit();
new InputHandler(canvas, world, sound).bind();

if (params.has('shot')) {
  // Screenshot mode: stage the scene and draw it once.
  const { screen } = stageShot(params.get('shot'), world);
  world.screen = screen;
  render(ctx, world, sound, 1.7);
  status.textContent = `Sizzle & Serve screenshot: ${params.get('shot')}`;
} else {
  let last = performance.now();
  let acc = 0;
  function frame(now) {
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    acc += dt;
    while (acc >= STEP) {
      world.step(STEP);
      acc -= STEP;
    }
    // Sound cues the world raised while stepping (a burner finishing, an order
    // expiring, food burning): play each once, then clear the queue.
    for (const ev of world.events) {
      if (ev === 'cookDone') sound.cookDone();
      else if (ev === 'expired') sound.expire();
      else if (ev === 'burned') sound.burn();
    }
    world.events.length = 0;
    render(ctx, world, sound, now / 1000);
    if (world.screen === 'play') {
      status.textContent = `Sizzle & Serve: ${world.served} dishes served, ${world.coins} coins, ${Math.ceil(world.timeLeft)} seconds left in the shift.`;
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
