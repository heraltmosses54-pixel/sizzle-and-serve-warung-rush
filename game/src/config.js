// Sizzle & Serve — Warung Rush: every tunable number and the game's data (ingredients,
// recipes, timing). One file so balance can be read at a glance.
//
// The game in one paragraph: a 2D canvas cooking game with 4 screens (title, play,
// pause, results), 5 dishes from 8 ingredients, 3 stove burners with a burn mechanic
// (food left on a burner after READY burns in 8s and must be trashed), an order board
// with patience bars and random VIP rush orders worth double, a 3-slot plate, serve
// bell with coins + patience tips + combo bonuses, 3 hearts, levels every 5 dishes
// (faster spawns, shorter patience), and juice throughout: particle bursts, floating
// "+Rp" text, squash-and-stretch, screen shake, coin-pop, pitch-varied WebAudio SFX
// and a quiet pentatonic music loop (M to mute). No libraries, no network, no fonts
// beyond system-ui; all art is vector drawing and all sound is synthesised.
export const VIEW = { width: 1280, height: 720 };
export const STEP = 1 / 60;

export const SHIFT_SECONDS = 120; // one shift lasts two minutes
export const MAX_HEARTS = 3;
export const MAX_ORDERS = 3;
export const ORDER_PATIENCE = 21; // seconds before a customer walks out
export const ORDER_SPAWN_EVERY = 5.5; // seconds between new orders
export const COOK_SECONDS = 3.5; // seconds on a burner before a raw item is done
export const BURN_SECONDS = 8; // seconds a finished item survives on a burner before it burns
export const BURNERS = 3;
export const PLATE_SLOTS = 3; // every dish is exactly three ingredients

// Ingredient ids, in counter order. `cook` means the raw item must spend time on a burner.
export const INGREDIENTS = [
  { id: 'rice', name: 'Rice', cook: false, color: '#f5f0dc', dark: '#cbbf92' },
  { id: 'noodle', name: 'Noodles', cook: false, color: '#f2c14e', dark: '#c08a1d' },
  { id: 'egg', name: 'Egg', cook: true, color: '#fff3c4', dark: '#e0a92e' },
  { id: 'chicken', name: 'Chicken', cook: true, color: '#e8a06a', dark: '#a85f2e' },
  { id: 'skewer', name: 'Skewer', cook: true, color: '#d97b4f', dark: '#8f4423' },
  { id: 'chili', name: 'Chili', cook: false, color: '#d9382b', dark: '#8f1d14' },
  { id: 'veg', name: 'Veg', cook: false, color: '#58a34a', dark: '#2f6b28' },
  { id: 'sauce', name: 'Sauce', cook: false, color: '#8a5a2b', dark: '#5a3a18' },
];
export const ING_BY_ID = Object.fromEntries(INGREDIENTS.map((i) => [i.id, i]));

// Dishes: name, the three ingredient ids, and the coin value before the patience tip.
export const RECIPES = [
  { id: 'nasi-goreng', name: 'Nasi Goreng', needs: ['rice', 'egg', 'chili'], coins: 12 },
  { id: 'mie-goreng', name: 'Mie Goreng', needs: ['noodle', 'egg', 'veg'], coins: 12 },
  { id: 'sate-ayam', name: 'Sate Ayam', needs: ['skewer', 'chicken', 'sauce'], coins: 16 },
  { id: 'ayam-geprek', name: 'Ayam Geprek', needs: ['chicken', 'chili', 'rice'], coins: 14 },
  { id: 'nasi-sayur', name: 'Nasi Sayur', needs: ['rice', 'veg', 'sauce'], coins: 10 },
];

// Patience tip: up to this many extra coins for serving a fresh order fast.
export const TIP_MAX = 6;
// Combo: each correct serve in a row without a mistake adds this per combo step.
export const COMBO_BONUS = 2;
// Level up every this many dishes served: orders arrive faster and patience shrinks.
export const LEVEL_EVERY = 5;
export const LEVEL_SPAWN_MIN = 3.2;
export const LEVEL_PATIENCE_MIN = 8;

// VIP rush orders: a share of orders are VIPs — golden ticket, worth double coins, but
// their patience is shorter, so they reward fast, focused play.
export const VIP_CHANCE = 0.15;
export const VIP_COINS_X = 2;
export const VIP_PATIENCE_X = 0.7;

// Deterministic random: mulberry32, so a seed always replays the same shift.
export function makeRng(seed) {
  let a = seed >>> 0;
  return function rng() {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export function pick(rng, list) { return list[Math.floor(rng() * list.length)]; }

// Layout: every rect the renderer and the click handling agree on.
export const LAYOUT = {
  topBar: { x: 0, y: 0, w: 1280, h: 96 },
  orderBoard: { x: 16, y: 12, w: 560, h: 76 },
  timer: { x: 600, y: 12, w: 180, h: 76 },
  score: { x: 940, y: 12, w: 324, h: 76 },
  counter: { x: 0, y: 470, w: 1280, h: 250 },
  bins: { x: 24, y: 500, w: 92, h: 108, gap: 12 },
  stove: { x: 920, y: 500, w: 336, h: 108 },
  plate: { x: 480, y: 300, w: 320, h: 150 },
  serve: { x: 830, y: 300, w: 170, h: 70 },
  trash: { x: 1062, y: 292, w: 76, h: 112 },
};
