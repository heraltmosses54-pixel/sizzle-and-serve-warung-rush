// Mouse and keyboard input: clicks on the counter bins, burners, serve bell and trash,
// plus keys 1-8 (ingredients), S / Space (serve), T (trash), P (pause), M (mute),
// Enter (start / play again), R (restart). Coordinates are converted from the page to
// the canvas's 1280x720 logical space, so the game plays at any window size.
import { INGREDIENTS, LAYOUT } from './config.js';
import { SCREEN_OVER, SCREEN_PAUSE, SCREEN_PLAY, SCREEN_TITLE } from './world.js';
import { AGAIN_BTN, BIN_RECTS, BURNER_RECTS, MUTE_BTN, PAUSE_BTN, SERVE_BTN, START_BTN, TRASH_BTN } from './render.js';

function inside(x, y, r) { return x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h; }

export class InputHandler {
  constructor(canvas, world, sound) {
    this.canvas = canvas;
    this.world = world;
    this.sound = sound;
  }

  bind() {
    this.canvas.addEventListener('pointerdown', (e) => this.onClick(e));
    window.addEventListener('keydown', (e) => this.onKey(e));
  }

  toLogical(e) {
    const rect = this.canvas.getBoundingClientRect();
    const sx = this.canvas.width / rect.width;
    const sy = this.canvas.height / rect.height;
    return { x: (e.clientX - rect.left) * sx, y: (e.clientY - rect.top) * sy };
  }

  onClick(e) {
    const { x, y } = this.toLogical(e);
    const world = this.world;
    this.sound.ensure();
    if (inside(x, y, MUTE_BTN)) { this.sound.toggleMute(); return; }
    if (world.screen === SCREEN_TITLE) {
      if (inside(x, y, START_BTN)) { this.sound.serve(); world.start(); }
      return;
    }
    if (world.screen === SCREEN_OVER) {
      if (inside(x, y, AGAIN_BTN)) { this.sound.serve(); world.start(); }
      return;
    }
    if (inside(x, y, PAUSE_BTN)) {
      if (world.screen === SCREEN_PLAY) { world.screen = SCREEN_PAUSE; this.sound.click(); }
      else if (world.screen === SCREEN_PAUSE) { world.screen = SCREEN_PLAY; this.sound.click(); }
      return;
    }
    if (world.screen === SCREEN_PAUSE) return;
    if (world.screen !== SCREEN_PLAY) return;
    for (let i = 0; i < BIN_RECTS.length; i += 1) {
      if (inside(x, y, BIN_RECTS[i])) {
        const result = world.addIngredient(INGREDIENTS[i].id);
        if (result === 'plate') this.sound.add();
        else if (result === 'burner') { this.sound.sizzle(0.4); }
        else if (result === 'full') this.sound.wrong();
        return;
      }
    }
    for (let i = 0; i < BURNER_RECTS.length; i += 1) {
      if (inside(x, y, BURNER_RECTS[i])) {
        const result = world.takeBurner(i);
        if (result === 'plate') this.sound.add();
        else if (result === 'full') this.sound.wrong();
        else if (result === 'burnt') this.sound.burn();
        return;
      }
    }
    if (inside(x, y, SERVE_BTN)) { this.serve(); return; }
    if (inside(x, y, TRASH_BTN)) {
      if (world.trashPlate()) this.sound.click();
      return;
    }
  }

  serve() {
    const result = this.world.serve();
    if (result === 'served') { this.sound.serve(); this.sound.coin(); }
    else if (result === 'level') { this.sound.serve(); this.sound.coin(); this.sound.levelUp(); }
    else if (result === 'wrong') this.sound.wrong();
    else if (result === 'empty') this.sound.click();
  }

  onKey(e) {
    const world = this.world;
    if (e.repeat) return;
    const key = e.key.toLowerCase();
    if (key === 'm') { this.sound.toggleMute(); return; }
    if (key === 'enter') {
      if (world.screen === SCREEN_TITLE || world.screen === SCREEN_OVER) { this.sound.ensure(); this.sound.serve(); world.start(); }
      return;
    }
    if (key === 'p' || key === 'escape') {
      if (world.screen === SCREEN_PLAY) { world.screen = SCREEN_PAUSE; this.sound.click(); }
      else if (world.screen === SCREEN_PAUSE) { world.screen = SCREEN_PLAY; this.sound.click(); }
      return;
    }
    if (world.screen !== SCREEN_PLAY) return;
    if (key >= '1' && key <= '8') {
      const result = world.addIngredient(INGREDIENTS[Number(key) - 1].id);
      if (result === 'plate') this.sound.add();
      else if (result === 'burner') this.sound.sizzle(0.4);
      else if (result === 'full') this.sound.wrong();
      return;
    }
    if (key === 's' || key === ' ') { e.preventDefault(); this.serve(); return; }
    if (key === 't') { if (world.trashPlate()) this.sound.click(); }
  }
}
