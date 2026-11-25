// The kitchen's state and rules: orders, burners, the plate, serving, hearts, combos and
// levels. Rendering never touches the rules; input calls these methods and step() advances
// the timers. All randomness comes from the seeded rng, so a seed replays one shift.
import {
  BURNERS, COOK_SECONDS, COMBO_BONUS, ING_BY_ID, LEVEL_EVERY, LEVEL_PATIENCE_MIN,
  LEVEL_SPAWN_MIN, MAX_HEARTS, MAX_ORDERS, ORDER_PATIENCE, ORDER_SPAWN_EVERY,
  PLATE_SLOTS, RECIPES, SHIFT_SECONDS, TIP_MAX, makeRng, pick,
} from './config.js';

export const SCREEN_TITLE = 'title';
export const SCREEN_PLAY = 'play';
export const SCREEN_PAUSE = 'pause';
export const SCREEN_OVER = 'over';

export function sortedKey(ids) { return [...ids].sort().join('+'); }

export class World {
  constructor(seed = 1) {
    this.seed = seed;
    this.reset();
  }

  reset() {
    this.rng = makeRng(this.seed);
    this.screen = SCREEN_TITLE;
    this.timeLeft = SHIFT_SECONDS;
    this.orders = [];
    this.burners = Array.from({ length: BURNERS }, () => null);
    this.plate = [];
    this.coins = 0;
    this.served = 0;
    this.combo = 0;
    this.bestCombo = 0;
    this.mistakes = 0;
    this.hearts = MAX_HEARTS;
    this.level = 1;
    this.spawnTimer = 1.2;
    this.nextOrderId = 1;
    this.floaters = [];
    this.message = '';
    this.messageLife = 0;
    this.servedTotal = 0;
  }

  start() {
    this.reset();
    this.screen = SCREEN_PLAY;
    this.spawnOrder();
  }

  get spawnEvery() { return Math.max(LEVEL_SPAWN_MIN, ORDER_SPAWN_EVERY - (this.level - 1) * 0.8); }
  get patience() { return Math.max(LEVEL_PATIENCE_MIN, ORDER_PATIENCE - (this.level - 1) * 2); }

  spawnOrder() {
    if (this.orders.length >= MAX_ORDERS) return;
    const recipe = pick(this.rng, RECIPES);
    this.orders.push({ id: this.nextOrderId, recipe, patience: this.patience, max: this.patience });
    this.nextOrderId += 1;
  }

  addFloater(x, y, text, color) { this.floaters.push({ x, y, text, color, life: 1.4 }); }
  say(text) { this.message = text; this.messageLife = 2.2; }

  /** Click (or press 1-8) on an ingredient bin. Returns 'plate' | 'burner' | 'full' | null. */
  addIngredient(id) {
    if (this.screen !== SCREEN_PLAY) return null;
    const ing = ING_BY_ID[id];
    if (!ing) return null;
    if (ing.cook) {
      const free = this.burners.findIndex((b) => b === null);
      if (free === -1) { this.say('All burners busy!'); return 'full'; }
      this.burners[free] = { id, progress: 0, done: false };
      return 'burner';
    }
    if (this.plate.length >= PLATE_SLOTS) { this.say('Plate is full — serve or trash it!'); return 'full'; }
    this.plate.push(id);
    return 'plate';
  }

  /** Click a burner: take a finished item onto the plate. */
  takeBurner(index) {
    if (this.screen !== SCREEN_PLAY) return null;
    const burner = this.burners[index];
    if (!burner || !burner.done) return null;
    if (this.plate.length >= PLATE_SLOTS) { this.say('Plate is full — serve or trash it!'); return 'full'; }
    this.plate.push(burner.id);
    this.burners[index] = null;
    return 'plate';
  }

  trashPlate() {
    if (this.screen !== SCREEN_PLAY || this.plate.length === 0) return false;
    this.plate = [];
    this.say('Plate cleared.');
    return true;
  }

  findMatch() {
    const key = sortedKey(this.plate);
    return this.orders.find((o) => sortedKey(o.recipe.needs) === key) ?? null;
  }

  /** Ring the serve bell (or press S / Space). */
  serve() {
    if (this.screen !== SCREEN_PLAY) return 'idle';
    if (this.plate.length === 0) { this.say('Nothing on the plate yet!'); return 'empty'; }
    const match = this.findMatch();
    if (!match) {
      this.mistakes += 1;
      this.combo = 0;
      this.hearts -= 1;
      this.plate = [];
      this.say('Wrong dish! The customer is angry.');
      if (this.hearts <= 0) this.endShift();
      return 'wrong';
    }
    const tip = Math.round((match.patience / match.max) * TIP_MAX);
    const comboBonus = this.combo * COMBO_BONUS;
    const earned = match.recipe.coins + tip + comboBonus;
    this.coins += earned;
    this.served += 1;
    this.servedTotal += 1;
    this.combo += 1;
    this.bestCombo = Math.max(this.bestCombo, this.combo);
    this.orders = this.orders.filter((o) => o !== match);
    this.plate = [];
    this.addFloater(640, 300, `+${earned} coins`, '#ffd23e');
    const newLevel = Math.floor(this.served / LEVEL_EVERY) + 1;
    if (newLevel > this.level) { this.level = newLevel; this.say(`Level ${newLevel} — rush hour!`); return 'level'; }
    return 'served';
  }

  endShift() {
    this.screen = SCREEN_OVER;
    this.plate = [];
  }

  step(dt) {
    if (this.screen !== SCREEN_PLAY) return;
    this.timeLeft -= dt;
    if (this.timeLeft <= 0) { this.timeLeft = 0; this.endShift(); return; }
    this.spawnTimer -= dt;
    if (this.spawnTimer <= 0) {
      this.spawnOrder();
      this.spawnTimer = this.spawnEvery;
    }
    for (let i = 0; i < this.burners.length; i += 1) {
      const b = this.burners[i];
      if (b && !b.done) {
        b.progress += dt / COOK_SECONDS;
        if (b.progress >= 1) { b.progress = 1; b.done = true; }
      }
    }
    for (let i = this.orders.length - 1; i >= 0; i -= 1) {
      const order = this.orders[i];
      order.patience -= dt;
      if (order.patience <= 0) {
        this.orders.splice(i, 1);
        this.hearts -= 1;
        this.combo = 0;
        this.say('A customer walked out!');
        if (this.hearts <= 0) { this.endShift(); return; }
      }
    }
    for (let i = this.floaters.length - 1; i >= 0; i -= 1) {
      const f = this.floaters[i];
      f.life -= dt;
      f.y -= 28 * dt;
      if (f.life <= 0) this.floaters.splice(i, 1);
    }
    if (this.messageLife > 0) this.messageLife -= dt;
  }

  /** Star rating for the results screen, 1-3. */
  stars() {
    if (this.served >= 14) return 3;
    if (this.served >= 9) return 2;
    return 1;
  }
}
