// The kitchen's state and rules: orders, burners, the plate, serving, hearts, combos and
// levels. Rendering never touches the rules; input calls these methods and step() advances
// the timers. All randomness comes from the seeded rng, so a seed replays one shift.
import {
  BURNERS, BURN_SECONDS, COOK_SECONDS, COMBO_BONUS, ING_BY_ID, LEVEL_EVERY, LEVEL_PATIENCE_MIN,
  LEVEL_SPAWN_MIN, MAX_HEARTS, MAX_ORDERS, ORDER_PATIENCE, ORDER_SPAWN_EVERY,
  PLATE_SLOTS, RECIPES, SHIFT_SECONDS, TIP_MAX, VIP_CHANCE, VIP_COINS_X, VIP_PATIENCE_X,
  makeRng, pick,
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
    this.particles = []; // juice: short-lived sparks drawn by render.js
    this.events = []; // sound cues for the main loop to play: cookDone | expired | burned
    this.shake = 0; // screen-shake seconds left (mistakes only)
    this.coinPop = 0; // coin-count pop animation, 1 -> 0
    this.serveAnim = 0; // serve-button / plate squash, 1 -> 0
    this.message = '';
    this.messageLife = 0;
    this.servedTotal = 0;
  }

  start() {
    this.reset();
    this.screen = SCREEN_PLAY;
    this.spawnOrder();
  }

  get spawnEvery() { return Math.max(LEVEL_SPAWN_MIN, ORDER_SPAWN_EVERY - (this.level - 1) * 1.0); }
  get patience() { return Math.max(LEVEL_PATIENCE_MIN, ORDER_PATIENCE - (this.level - 1) * 3); }

  spawnOrder() {
    if (this.orders.length >= MAX_ORDERS) return;
    const recipe = pick(this.rng, RECIPES);
    const vip = this.rng() < VIP_CHANCE;
    const patience = vip ? this.patience * VIP_PATIENCE_X : this.patience;
    this.orders.push({ id: this.nextOrderId, recipe, patience, max: patience, vip });
    this.nextOrderId += 1;
  }

  addFloater(x, y, text, color) { this.floaters.push({ x, y, text, color, life: 1.4 }); }

  /** A burst of sparks at (x, y): the juice on every serve and mistake. */
  burst(x, y, color, n = 22) {
    for (let i = 0; i < n; i += 1) {
      const a = this.rng() * Math.PI * 2;
      const sp = 60 + this.rng() * 190;
      this.particles.push({
        x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 70,
        life: 0.5 + this.rng() * 0.4, max: 0.9, color, size: 3 + this.rng() * 4,
      });
    }
  }
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

  /** Click a burner: take a finished item onto the plate, or trash a burnt one. */
  takeBurner(index) {
    if (this.screen !== SCREEN_PLAY) return null;
    const burner = this.burners[index];
    if (!burner) return null;
    if (burner.burnt) {
      this.burners[index] = null;
      this.say('Burnt! Tossed in the trash.');
      return 'burnt';
    }
    if (!burner.done) return null;
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
      this.shake = 0.3;
      this.burst(640, 366, '#d9382b', 18);
      this.say('Wrong dish! The customer is angry.');
      if (this.hearts <= 0) this.endShift();
      return 'wrong';
    }
    const tip = Math.round((match.patience / match.max) * TIP_MAX);
    const comboBonus = this.combo * COMBO_BONUS;
    const earned = (match.recipe.coins + tip + comboBonus) * (match.vip ? VIP_COINS_X : 1);
    this.coins += earned;
    this.served += 1;
    this.servedTotal += 1;
    this.combo += 1;
    this.bestCombo = Math.max(this.bestCombo, this.combo);
    this.orders = this.orders.filter((o) => o !== match);
    this.plate = [];
    this.addFloater(640, 300, match.vip ? `+Rp ${earned} VIP!` : `+Rp ${earned}`, '#ffd23e');
    this.burst(640, 366, '#ffd23e', 26);
    this.serveAnim = 1;
    this.coinPop = 1;
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
      if (!b) continue;
      if (!b.done) {
        b.progress += dt / COOK_SECONDS;
        if (b.progress >= 1) { b.progress = 1; b.done = true; b.burnTimer = 0; this.events.push('cookDone'); }
      } else if (!b.burnt) {
        // A finished item left on the burner burns after BURN_SECONDS: it must be
        // trashed, costing the ingredient and the time spent cooking it.
        b.burnTimer += dt;
        if (b.burnTimer >= BURN_SECONDS) {
          b.burnt = true;
          this.events.push('burned');
          this.say('Something burnt on the stove!');
        }
      }
    }
    for (let i = this.orders.length - 1; i >= 0; i -= 1) {
      const order = this.orders[i];
      order.patience -= dt;
      if (order.patience <= 0) {
        this.orders.splice(i, 1);
        this.hearts -= 1;
        this.combo = 0;
        this.shake = 0.3;
        this.events.push('expired');
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
    for (let i = this.particles.length - 1; i >= 0; i -= 1) {
      const p = this.particles[i];
      p.life -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 320 * dt;
      if (p.life <= 0) this.particles.splice(i, 1);
    }
    if (this.shake > 0) this.shake = Math.max(0, this.shake - dt);
    if (this.coinPop > 0) this.coinPop = Math.max(0, this.coinPop - dt * 3);
    if (this.serveAnim > 0) this.serveAnim = Math.max(0, this.serveAnim - dt * 4);
    if (this.messageLife > 0) this.messageLife -= dt;
  }

  /** Star rating for the results screen, 1-3. */
  stars() {
    if (this.served >= 14) return 3;
    if (this.served >= 9) return 2;
    return 1;
  }
}
