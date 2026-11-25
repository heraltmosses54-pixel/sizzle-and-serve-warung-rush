// Every pixel of Sizzle & Serve is drawn here on a 1280x720 canvas: the kitchen, the order
// board, the counter bins, the stove, the plate, the HUD and the menus. All art is original
// vector drawing (no images, no fonts beyond the system sans), so the game needs no assets.
import { INGREDIENTS, ING_BY_ID, LAYOUT, RECIPES, VIEW } from './config.js';
import { SCREEN_OVER, SCREEN_PAUSE, SCREEN_PLAY, SCREEN_TITLE, sortedKey } from './world.js';

// Hit-rects shared with input.js (same objects, one source of truth).
export const BIN_RECTS = INGREDIENTS.map((_, i) => ({
  x: LAYOUT.bins.x + i * (LAYOUT.bins.w + LAYOUT.bins.gap), y: LAYOUT.bins.y,
  w: LAYOUT.bins.w, h: LAYOUT.bins.h,
}));
export const BURNER_RECTS = [0, 1, 2].map((i) => ({
  x: LAYOUT.stove.x + 10 + i * 110, y: LAYOUT.stove.y + 6, w: 100, h: 96,
}));
export const SERVE_BTN = { x: LAYOUT.serve.x, y: LAYOUT.serve.y, w: LAYOUT.serve.w, h: LAYOUT.serve.h };
export const TRASH_BTN = { x: LAYOUT.trash.x, y: LAYOUT.trash.y, w: LAYOUT.trash.w, h: LAYOUT.trash.h };
export const START_BTN = { x: 490, y: 470, w: 300, h: 64 };
export const AGAIN_BTN = { x: 490, y: 540, w: 300, h: 64 };
export const PAUSE_BTN = { x: 852, y: 18, w: 42, h: 42 };
export const MUTE_BTN = { x: 800, y: 18, w: 42, h: 42 };

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function text(ctx, str, x, y, size, color, align = 'left', weight = 'bold') {
  ctx.fillStyle = color;
  ctx.font = `${weight} ${size}px system-ui, sans-serif`;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(str, x, y);
}

/** One vector icon per ingredient, drawn at (cx, cy) inside a box of `s` pixels. */
export function drawIngredientIcon(ctx, id, cx, cy, s, cooked = false) {
  const u = s / 64;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.lineWidth = 2.5 * u;
  ctx.strokeStyle = 'rgba(60,35,15,0.55)';
  if (id === 'rice') {
    ctx.fillStyle = '#b8452f'; ctx.beginPath(); ctx.arc(0, 8 * u, 22 * u, 0, Math.PI); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#fbf7ea'; ctx.beginPath(); ctx.ellipse(0, 2 * u, 19 * u, 10 * u, 0, Math.PI, 0); ctx.fill();
    ctx.fillStyle = '#fff'; for (const [dx, dy] of [[-8, -2], [0, -6], [8, -2]]) { ctx.beginPath(); ctx.arc(dx * u, dy * u, 3 * u, 0, 7); ctx.fill(); }
  } else if (id === 'noodle') {
    ctx.fillStyle = '#3f6fb5'; ctx.beginPath(); ctx.arc(0, 10 * u, 21 * u, 0, Math.PI); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = '#f2c14e'; ctx.lineWidth = 4 * u; ctx.lineCap = 'round';
    for (const dy of [-6, 0, 6]) { ctx.beginPath(); ctx.moveTo(-16 * u, dy * u); ctx.bezierCurveTo(-8 * u, (dy - 7) * u, 8 * u, (dy + 7) * u, 16 * u, dy * u); ctx.stroke(); }
    ctx.strokeStyle = '#58a34a'; ctx.lineWidth = 3 * u; ctx.beginPath(); ctx.moveTo(-4 * u, -10 * u); ctx.lineTo(4 * u, -14 * u); ctx.stroke();
  } else if (id === 'egg') {
    ctx.fillStyle = cooked ? '#ffe9a8' : '#fdfdf4';
    ctx.beginPath(); ctx.ellipse(0, 0, 22 * u, 16 * u, 0.3, 0, 7); ctx.fill(); ctx.stroke();
    ctx.fillStyle = cooked ? '#e8960f' : '#f6b73c';
    ctx.beginPath(); ctx.arc(2 * u, 0, 9 * u, 0, 7); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.beginPath(); ctx.arc(-1 * u, -3 * u, 3 * u, 0, 7); ctx.fill();
  } else if (id === 'chicken') {
    ctx.fillStyle = cooked ? '#c97b3d' : '#e8a06a';
    ctx.beginPath(); ctx.ellipse(-4 * u, 2 * u, 15 * u, 12 * u, -0.4, 0, 7); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = '#f5ead6'; ctx.lineWidth = 5 * u; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(8 * u, -6 * u); ctx.lineTo(18 * u, -14 * u); ctx.stroke();
    ctx.fillStyle = '#f5ead6'; for (const [dx, dy] of [[16, -18], [21, -13]]) { ctx.beginPath(); ctx.arc(dx * u, dy * u, 3.5 * u, 0, 7); ctx.fill(); }
    if (cooked) { ctx.fillStyle = '#8f4423'; ctx.beginPath(); ctx.arc(-8 * u, -2 * u, 2.5 * u, 0, 7); ctx.arc(0, 4 * u, 2.5 * u, 0, 7); ctx.fill(); }
  } else if (id === 'skewer') {
    ctx.strokeStyle = '#c9a06a'; ctx.lineWidth = 3.5 * u; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-22 * u, 14 * u); ctx.lineTo(22 * u, -14 * u); ctx.stroke();
    for (let i = 0; i < 3; i += 1) {
      const t = -14 + i * 12;
      ctx.save(); ctx.translate(t * u, -t * u * 0.64); ctx.rotate(-0.56);
      ctx.fillStyle = cooked ? '#a85f2e' : '#d97b4f'; rr(ctx, -7 * u, -7 * u, 14 * u, 14 * u, 3 * u); ctx.fill(); ctx.stroke(); ctx.restore();
    }
  } else if (id === 'chili') {
    ctx.fillStyle = '#d9382b'; ctx.beginPath(); ctx.moveTo(-18 * u, -12 * u);
    ctx.quadraticCurveTo(6 * u, -22 * u, 20 * u, 2 * u); ctx.quadraticCurveTo(10 * u, 20 * u, -6 * u, 12 * u);
    ctx.quadraticCurveTo(-16 * u, 6 * u, -18 * u, -12 * u); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = '#2f6b28'; ctx.lineWidth = 4 * u; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-16 * u, -12 * u); ctx.quadraticCurveTo(-22 * u, -20 * u, -14 * u, -22 * u); ctx.stroke();
  } else if (id === 'veg') {
    ctx.fillStyle = '#58a34a';
    for (const a of [-0.7, 0, 0.7]) {
      ctx.save(); ctx.rotate(a); ctx.beginPath(); ctx.ellipse(0, -8 * u, 8 * u, 16 * u, 0, 0, 7); ctx.fill(); ctx.restore();
    }
    ctx.strokeStyle = '#2f6b28'; ctx.lineWidth = 2 * u;
    ctx.beginPath(); ctx.moveTo(0, 12 * u); ctx.lineTo(0, 20 * u); ctx.stroke();
  } else if (id === 'sauce') {
    ctx.fillStyle = '#f2e3c9'; rr(ctx, -9 * u, -20 * u, 18 * u, 34 * u, 4 * u); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#8a5a2b'; rr(ctx, -9 * u, -4 * u, 18 * u, 18 * u, 3 * u); ctx.fill();
    ctx.fillStyle = '#5a3a18'; rr(ctx, -5 * u, -26 * u, 10 * u, 8 * u, 2 * u); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = `bold ${10 * u}px system-ui, sans-serif`; ctx.textAlign = 'center'; ctx.fillText('ABC', 0, 6 * u);
  }
  ctx.restore();
}

function drawBackground(ctx, t) {
  // Warm tiled wall.
  ctx.fillStyle = '#f3d9a4'; ctx.fillRect(0, 96, 1280, 374);
  ctx.strokeStyle = 'rgba(180,130,60,0.35)'; ctx.lineWidth = 2;
  for (let y = 120; y < 470; y += 44) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1280, y); ctx.stroke(); }
  for (let x = 0; x < 1280; x += 88) { ctx.beginPath(); ctx.moveTo(x, 96); ctx.lineTo(x, 470); ctx.stroke(); }
  // Window with a sunny street.
  ctx.fillStyle = '#7ec8e3'; rr(ctx, 60, 130, 220, 150, 10); ctx.fill();
  ctx.fillStyle = '#ffe9a8'; ctx.beginPath(); ctx.arc(230, 170, 22, 0, 7); ctx.fill();
  ctx.fillStyle = '#58a34a'; ctx.fillRect(60, 250, 220, 30);
  ctx.fillStyle = '#8a5a2b'; ctx.fillRect(90, 210, 40, 40); ctx.fillRect(170, 220, 55, 30);
  ctx.strokeStyle = '#6b4a2f'; ctx.lineWidth = 6; rr(ctx, 60, 130, 220, 150, 10); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(170, 130); ctx.lineTo(170, 280); ctx.moveTo(60, 205); ctx.lineTo(280, 205); ctx.stroke();
  // Chalkboard menu on the right wall.
  ctx.fillStyle = '#2f4a3a'; rr(ctx, 980, 130, 240, 150, 8); ctx.fill();
  ctx.strokeStyle = '#c9a06a'; ctx.lineWidth = 5; rr(ctx, 980, 130, 240, 150, 8); ctx.stroke();
  text(ctx, "TODAY'S MENU", 1100, 152, 16, '#ffe9a8', 'center');
  for (let i = 0; i < 4; i += 1) text(ctx, RECIPES[i].name, 1000, 182 + i * 24, 14, '#f5f0dc');
  for (let i = 0; i < 4; i += 1) text(ctx, `${RECIPES[i].coins}c`, 1200, 182 + i * 24, 14, '#ffd23e', 'right');
  // Hanging pans.
  for (let i = 0; i < 3; i += 1) {
    const x = 340 + i * 70;
    ctx.strokeStyle = '#5a4a3a'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, 96); ctx.lineTo(x, 128); ctx.stroke();
    ctx.fillStyle = '#3a3a3a'; ctx.beginPath(); ctx.arc(x, 150, 24, 0, 7); ctx.fill();
    ctx.fillStyle = '#555'; ctx.beginPath(); ctx.arc(x, 150, 17, 0, 7); ctx.fill();
  }
  // Steam wisp over the stove, drifting with time.
  ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.lineWidth = 4; ctx.lineCap = 'round';
  for (let i = 0; i < 2; i += 1) {
    const sx = 1010 + i * 120 + Math.sin(t * 1.4 + i * 2) * 6;
    ctx.beginPath(); ctx.moveTo(sx, 470); ctx.quadraticCurveTo(sx + 12, 440, sx - 6, 412); ctx.stroke();
  }
  // Floor.
  ctx.fillStyle = '#b07a45'; ctx.fillRect(0, 470, 1280, 250);
  ctx.fillStyle = '#9c6a38'; for (let x = 0; x < 1280; x += 128) ctx.fillRect(x, 470, 4, 250);
}

function patienceColor(frac) { return frac > 0.5 ? '#58a34a' : frac > 0.25 ? '#f2a541' : '#d9382b'; }

function drawOrderBoard(ctx, world) {
  const b = LAYOUT.orderBoard;
  ctx.fillStyle = '#5a3a18'; rr(ctx, b.x, b.y, b.w, b.h, 10); ctx.fill();
  ctx.fillStyle = '#f5e6c8'; rr(ctx, b.x + 4, b.y + 4, b.w - 8, b.h - 8, 8); ctx.fill();
  text(ctx, 'ORDERS', b.x + 14, b.y + 18, 13, '#8a5a2b');
  if (world.orders.length === 0) text(ctx, 'No orders yet — take a breath!', b.x + 90, b.y + 44, 15, '#8a5a2b');
  world.orders.forEach((order, i) => {
    const x = b.x + 92 + i * 152;
    const y = b.y + 8;
    ctx.fillStyle = '#fff'; rr(ctx, x, y, 144, 60, 8); ctx.fill();
    ctx.strokeStyle = '#c9a06a'; ctx.lineWidth = 2; rr(ctx, x, y, 144, 60, 8); ctx.stroke();
    text(ctx, order.recipe.name, x + 8, y + 13, 13, '#3a2a18');
    order.recipe.needs.forEach((id, j) => drawIngredientIcon(ctx, id, x + 20 + j * 34, y + 34, 30, true));
    const frac = Math.max(0, order.patience / order.max);
    ctx.fillStyle = '#e8dcc0'; rr(ctx, x + 8, y + 52, 128, 6, 3); ctx.fill();
    ctx.fillStyle = patienceColor(frac); rr(ctx, x + 8, y + 52, 128 * frac, 6, 3); ctx.fill();
  });
}

function drawTimer(ctx, world) {
  const b = LAYOUT.timer;
  ctx.fillStyle = '#22303f'; rr(ctx, b.x, b.y, b.w, b.h, 10); ctx.fill();
  const mm = Math.floor(world.timeLeft / 60);
  const ss = Math.floor(world.timeLeft % 60).toString().padStart(2, '0');
  const low = world.timeLeft <= 15;
  text(ctx, `${mm}:${ss}`, b.x + b.w / 2, b.y + 30, 34, low ? '#ff6b5e' : '#fff', 'center');
  text(ctx, 'SHIFT TIMER', b.x + b.w / 2, b.y + 60, 12, '#9fb3c8', 'center');
}

function drawScore(ctx, world, sound) {
  const b = LAYOUT.score;
  ctx.fillStyle = '#22303f'; rr(ctx, b.x, b.y, b.w, b.h, 10); ctx.fill();
  ctx.fillStyle = '#ffd23e'; ctx.beginPath(); ctx.arc(b.x + 28, b.y + 26, 11, 0, 7); ctx.fill();
  ctx.strokeStyle = '#c08a1d'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(b.x + 28, b.y + 26, 11, 0, 7); ctx.stroke();
  text(ctx, 'C', b.x + 28, b.y + 27, 15, '#8a5a18', 'center');
  text(ctx, `${world.coins}`, b.x + 48, b.y + 26, 22, '#ffd23e');
  text(ctx, `Served ${world.served}  ·  Lv ${world.level}`, b.x + 16, b.y + 56, 14, '#dfe8f0');
  if (world.combo >= 2) text(ctx, `COMBO x${world.combo}`, b.x + 200, b.y + 26, 18, '#ff9d5c');
  for (let i = 0; i < 3; i += 1) {
    const hx = b.x + 196 + i * 26;
    ctx.fillStyle = i < world.hearts ? '#ff5b6e' : 'rgba(255,255,255,0.18)';
    ctx.beginPath();
    ctx.moveTo(hx + 10, b.y + 56); ctx.arc(hx + 5, b.y + 50, 6, 0, 7); ctx.arc(hx + 15, b.y + 50, 6, 0, 7);
    ctx.lineTo(hx + 10, b.y + 62); ctx.closePath(); ctx.fill();
  }
  // Pause and mute buttons.
  ctx.fillStyle = '#3a4a5a'; rr(ctx, PAUSE_BTN.x, PAUSE_BTN.y, PAUSE_BTN.w, PAUSE_BTN.h, 8); ctx.fill();
  text(ctx, world.screen === SCREEN_PAUSE ? '▶' : 'II', PAUSE_BTN.x + 21, PAUSE_BTN.y + 22, 18, '#fff', 'center');
  ctx.fillStyle = '#3a4a5a'; rr(ctx, MUTE_BTN.x, MUTE_BTN.y, MUTE_BTN.w, MUTE_BTN.h, 8); ctx.fill();
  text(ctx, sound.muted ? '✕' : '♪', MUTE_BTN.x + 21, MUTE_BTN.y + 22, 18, '#fff', 'center');
}

function drawBins(ctx, world) {
  ctx.fillStyle = '#6b4a2f'; ctx.fillRect(0, LAYOUT.counter.y, 1280, 14);
  ctx.fillStyle = '#c98d54'; ctx.fillRect(0, LAYOUT.counter.y + 14, 1280, 236);
  text(ctx, 'COUNTER — click or press 1-8', 24, 492, 13, '#5a3a18');
  INGREDIENTS.forEach((ing, i) => {
    const r = BIN_RECTS[i];
    const busy = ing.cook && world.burners.every((b) => b !== null);
    ctx.fillStyle = busy ? '#d8c9a8' : '#fbf3df'; rr(ctx, r.x, r.y, r.w, r.h, 10); ctx.fill();
    ctx.strokeStyle = '#8a6a42'; ctx.lineWidth = 2; rr(ctx, r.x, r.y, r.w, r.h, 10); ctx.stroke();
    drawIngredientIcon(ctx, ing.id, r.x + r.w / 2, r.y + 42, 52, ing.cook);
    text(ctx, ing.name, r.x + r.w / 2, r.y + 82, 14, '#3a2a18', 'center');
    text(ctx, ing.cook ? 'needs stove' : `${i + 1}`, r.x + r.w / 2, r.y + 98, 11, '#8a6a42', 'center');
    if (ing.cook) {
      ctx.fillStyle = '#d9382b'; ctx.beginPath(); ctx.arc(r.x + r.w - 14, r.y + 14, 9, 0, 7); ctx.fill();
      ctx.fillStyle = '#ffd23e'; ctx.beginPath(); ctx.moveTo(r.x + r.w - 14, r.y + 8); ctx.quadraticCurveTo(r.x + r.w - 8, r.y + 14, r.x + r.w - 14, r.y + 20); ctx.quadraticCurveTo(r.x + r.w - 20, r.y + 14, r.x + r.w - 14, r.y + 8); ctx.fill();
    } else {
      ctx.fillStyle = '#8a6a42'; ctx.beginPath(); ctx.arc(r.x + 14, r.y + 14, 10, 0, 7); ctx.fill();
      text(ctx, `${i + 1}`, r.x + 14, r.y + 15, 11, '#fff', 'center');
    }
  });
  // Stove: three burners.
  const s = LAYOUT.stove;
  text(ctx, 'STOVE — click a finished burner', s.x, 492, 13, '#5a3a18');
  ctx.fillStyle = '#3a3a3a'; rr(ctx, s.x, s.y, s.w, s.h, 10); ctx.fill();
  world.burners.forEach((burner, i) => {
    const r = BURNER_RECTS[i];
    ctx.fillStyle = '#222'; ctx.beginPath(); ctx.arc(r.x + 50, r.y + 48, 40, 0, 7); ctx.fill();
    ctx.strokeStyle = '#666'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(r.x + 50, r.y + 48, 40, 0, 7); ctx.stroke();
    if (burner) {
      if (!burner.done) {
        ctx.fillStyle = '#ff7a2f';
        ctx.beginPath(); ctx.moveTo(r.x + 50, r.y + 48);
        ctx.arc(r.x + 50, r.y + 48, 38, -Math.PI / 2, -Math.PI / 2 + burner.progress * Math.PI * 2);
        ctx.closePath(); ctx.fill();
      } else {
        ctx.fillStyle = '#ffd23e'; ctx.beginPath(); ctx.arc(r.x + 50, r.y + 48, 42, 0, 7); ctx.fill();
        text(ctx, 'READY!', r.x + 50, r.y + 88, 12, '#ffd23e', 'center');
      }
      drawIngredientIcon(ctx, burner.id, r.x + 50, r.y + 48, 46, burner.done);
    } else {
      text(ctx, 'empty', r.x + 50, r.y + 48, 13, '#888', 'center');
    }
  });
}

function drawPlateArea(ctx, world) {
  const p = LAYOUT.plate;
  // Wooden serving board under the plate.
  ctx.fillStyle = '#8a5a2b'; rr(ctx, p.x - 24, p.y + 96, p.w + 48, 40, 12); ctx.fill();
  // The plate.
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(p.x + p.w / 2, p.y + 66, 150, 62, 0, 0, 7); ctx.fill();
  ctx.strokeStyle = '#d8c9a8'; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(p.x + p.w / 2, p.y + 66, 150, 62, 0, 0, 7); ctx.stroke();
  ctx.strokeStyle = '#e8dcc0'; ctx.beginPath(); ctx.ellipse(p.x + p.w / 2, p.y + 66, 118, 46, 0, 0, 7); ctx.stroke();
  // Assembled ingredients on the plate.
  world.plate.forEach((id, i) => {
    const cx = p.x + 70 + i * 90;
    drawIngredientIcon(ctx, id, cx, p.y + 62, 62, true);
  });
  text(ctx, world.plate.length === 0 ? 'Your plate — build a dish here' : `${world.plate.length} / 3 on the plate`, p.x + p.w / 2, p.y + 158, 14, '#3a2a18', 'center');
  // Serve bell and trash.
  const match = world.plate.length > 0 && world.findMatch();
  ctx.fillStyle = match ? '#ffd23e' : '#c9a06a'; rr(ctx, SERVE_BTN.x, SERVE_BTN.y, SERVE_BTN.w, SERVE_BTN.h, 12); ctx.fill();
  ctx.strokeStyle = '#8a6a42'; ctx.lineWidth = 2; rr(ctx, SERVE_BTN.x, SERVE_BTN.y, SERVE_BTN.w, SERVE_BTN.h, 12); ctx.stroke();
  text(ctx, 'SERVE', SERVE_BTN.x + SERVE_BTN.w / 2, SERVE_BTN.y + 26, 22, '#3a2a18', 'center');
  text(ctx, 'S / Space', SERVE_BTN.x + SERVE_BTN.w / 2, SERVE_BTN.y + 52, 12, '#5a3a18', 'center');
  ctx.fillStyle = '#e8e0d0'; rr(ctx, TRASH_BTN.x, TRASH_BTN.y, TRASH_BTN.w, TRASH_BTN.h, 10); ctx.fill();
  ctx.strokeStyle = '#b09a7a'; rr(ctx, TRASH_BTN.x, TRASH_BTN.y, TRASH_BTN.w, TRASH_BTN.h, 10); ctx.stroke();
  text(ctx, 'Trash plate  (T)', TRASH_BTN.x + TRASH_BTN.w / 2, TRASH_BTN.y + 28, 15, '#5a3a18', 'center');
  if (match) text(ctx, `Matches: ${match.recipe.name} — ring the bell!`, p.x + p.w / 2, p.y - 16, 15, '#2f6b28', 'center');
}

function drawFloaters(ctx, world) {
  for (const f of world.floaters) {
    ctx.globalAlpha = Math.min(1, f.life);
    text(ctx, f.text, f.x, f.y, 26, f.color, 'center');
    ctx.globalAlpha = 1;
  }
  if (world.messageLife > 0 && world.message) {
    ctx.globalAlpha = Math.min(1, world.messageLife);
    ctx.fillStyle = 'rgba(34,48,63,0.9)'; rr(ctx, 390, 240, 500, 44, 10); ctx.fill();
    text(ctx, world.message, 640, 262, 18, '#fff', 'center');
    ctx.globalAlpha = 1;
  }
}

function drawTitle(ctx, world) {
  ctx.fillStyle = 'rgba(34,30,20,0.55)'; ctx.fillRect(0, 96, 1280, 374);
  ctx.fillStyle = '#fff8e8'; rr(ctx, 290, 150, 700, 330, 16); ctx.fill();
  ctx.strokeStyle = '#d9382b'; ctx.lineWidth = 4; rr(ctx, 290, 150, 700, 330, 16); ctx.stroke();
  text(ctx, 'SIZZLE & SERVE', 640, 196, 52, '#d9382b', 'center');
  text(ctx, '— WARUNG RUSH —', 640, 236, 20, '#8a5a2b', 'center');
  text(ctx, 'Run your own street-food stall. Take orders, cook on the stove,', 640, 286, 17, '#3a2a18', 'center');
  text(ctx, 'build each dish on the plate and serve it before patience runs out!', 640, 310, 17, '#3a2a18', 'center');
  // Mini recipe strip.
  RECIPES.slice(0, 3).forEach((r, i) => {
    const x = 400 + i * 170;
    text(ctx, r.name, x, 352, 14, '#8a5a2b', 'center');
    r.needs.forEach((id, j) => drawIngredientIcon(ctx, id, x - 34 + j * 34, 384, 30, true));
  });
  text(ctx, 'Mouse or keys 1-8 · S to serve · T to trash · P to pause · M to mute', 640, 428, 14, '#5a3a18', 'center');
  ctx.fillStyle = '#d9382b'; rr(ctx, START_BTN.x, START_BTN.y, START_BTN.w, START_BTN.h, 12); ctx.fill();
  text(ctx, '▶  START SHIFT', START_BTN.x + 150, START_BTN.y + 32, 22, '#fff', 'center');
}

function drawPause(ctx) {
  ctx.fillStyle = 'rgba(20,24,32,0.6)'; ctx.fillRect(0, 0, 1280, 720);
  text(ctx, 'PAUSED', 640, 320, 54, '#fff', 'center');
  text(ctx, 'Press P or click the pause button to keep cooking', 640, 372, 18, '#dfe8f0', 'center');
}

function drawOver(ctx, world) {
  ctx.fillStyle = 'rgba(20,24,32,0.72)'; ctx.fillRect(0, 0, 1280, 720);
  ctx.fillStyle = '#fff8e8'; rr(ctx, 340, 110, 600, 510, 16); ctx.fill();
  ctx.strokeStyle = '#d9382b'; ctx.lineWidth = 4; rr(ctx, 340, 110, 600, 510, 16); ctx.stroke();
  text(ctx, world.timeLeft <= 0 ? 'SHIFT COMPLETE!' : 'STALL CLOSED!', 640, 158, 40, '#d9382b', 'center');
  const stars = world.stars();
  text(ctx, '★'.repeat(stars) + '☆'.repeat(3 - stars), 640, 208, 40, '#f2a541', 'center');
  text(ctx, `Dishes served: ${world.served}`, 640, 268, 22, '#3a2a18', 'center');
  text(ctx, `Coins earned: ${world.coins}`, 640, 302, 22, '#3a2a18', 'center');
  text(ctx, `Best combo: x${world.bestCombo}   ·   Mistakes: ${world.mistakes}`, 640, 336, 18, '#5a3a18', 'center');
  text(ctx, world.served >= 14 ? 'Head chef material! The warung is famous.' : world.served >= 9 ? 'Solid shift — the regulars are happy.' : 'A slow shift. The stove is still warm — try again!', 640, 380, 16, '#8a5a2b', 'center');
  text(ctx, 'Press Enter or click below to run another shift', 640, 500, 15, '#5a3a18', 'center');
  ctx.fillStyle = '#d9382b'; rr(ctx, AGAIN_BTN.x, AGAIN_BTN.y, AGAIN_BTN.w, AGAIN_BTN.h, 12); ctx.fill();
  text(ctx, 'PLAY AGAIN', AGAIN_BTN.x + 150, AGAIN_BTN.y + 32, 22, '#fff', 'center');
}

/** Draw one frame. `t` is wall-clock seconds, for the steam drift. */
export function render(ctx, world, sound, t) {
  ctx.clearRect(0, 0, VIEW.width, VIEW.height);
  drawBackground(ctx, t);
  drawOrderBoard(ctx, world);
  drawTimer(ctx, world);
  drawScore(ctx, world, sound);
  drawBins(ctx, world);
  drawPlateArea(ctx, world);
  drawFloaters(ctx, world);
  if (world.screen === SCREEN_TITLE) drawTitle(ctx, world);
  else if (world.screen === SCREEN_PAUSE) drawPause(ctx);
  else if (world.screen === SCREEN_OVER) drawOver(ctx, world);
}
