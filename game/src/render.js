// Every pixel of Sizzle & Serve is drawn here on a 1280x720 canvas: the warung
// storefront (awning, string lights, night window, BUKA sign, cash register,
// stools), the plank wall with its SATE AYAM poster, banner, hanging plant,
// crack and stains, the five big customers standing grounded on the waiting
// deck with thought bubbles and patience bars, the kitchen, the order board,
// the counter bins, the stove, the plate, the HUD and the menus. All art is
// original vector drawing (no images, no fonts beyond the system sans), so the
// game needs no assets.
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
  ctx.lineWidth = 3 * u;
  ctx.strokeStyle = 'rgba(60,35,15,0.75)';
  if (id === 'rice') {
    // A deep terracotta bowl with a dark rim, heaped with visible grains.
    ctx.fillStyle = '#c05a35'; ctx.beginPath(); ctx.arc(0, 10 * u, 22 * u, 0, Math.PI); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = '#7e2a16'; ctx.lineWidth = 4 * u; ctx.beginPath(); ctx.arc(0, 10 * u, 22 * u, 0, Math.PI); ctx.stroke();
    ctx.fillStyle = '#fff8ea'; ctx.beginPath(); ctx.ellipse(0, 4 * u, 19 * u, 11 * u, 0, Math.PI, 0); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#fff'; for (const [dx, dy] of [[-11, -1], [-4, -6], [3, -4], [10, -1], [-7, 3], [6, 2]]) { ctx.beginPath(); ctx.arc(dx * u, dy * u, 2.8 * u, 0, 7); ctx.fill(); }
    ctx.fillStyle = '#e8dcc0'; for (const [dx, dy] of [[-8, 5], [0, 6], [8, 5]]) { ctx.beginPath(); ctx.arc(dx * u, dy * u, 2.2 * u, 0, 7); ctx.fill(); }
  } else if (id === 'noodle') {
    // Blue bowl, wavy strands with a swirl, shine and garnish.
    ctx.fillStyle = '#3f6fb5'; ctx.beginPath(); ctx.arc(0, 10 * u, 21 * u, 0, Math.PI); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = '#2a4a7a'; ctx.lineWidth = 3.5 * u; ctx.beginPath(); ctx.arc(0, 10 * u, 21 * u, 0, Math.PI); ctx.stroke();
    ctx.fillStyle = '#f7c948'; ctx.beginPath(); ctx.ellipse(0, 4 * u, 18 * u, 9 * u, 0, Math.PI, 0); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = '#e8a91c'; ctx.lineWidth = 3.5 * u; ctx.lineCap = 'round';
    for (const [dy, ph] of [[-4, 0], [0, 1.2], [4, 2.4]]) {
      ctx.beginPath(); ctx.moveTo(-15 * u, dy * u);
      ctx.bezierCurveTo(-8 * u, (dy - 6) * u, -2 * u, (dy + 6) * u, 5 * u, (dy - 2) * u);
      ctx.bezierCurveTo(9 * u, (dy - 6) * u, 12 * u, (dy + 3) * u, 15 * u, dy * u); ctx.stroke();
    }
    // A curling swirl on top.
    ctx.strokeStyle = '#d98f0f'; ctx.lineWidth = 3 * u;
    ctx.beginPath(); ctx.arc(6 * u, -6 * u, 5 * u, 0.5, 5.2); ctx.stroke();
    // Shine, spring onion and a chili flake.
    ctx.strokeStyle = 'rgba(255,255,255,0.75)'; ctx.lineWidth = 2.5 * u;
    ctx.beginPath(); ctx.moveTo(-12 * u, -8 * u); ctx.quadraticCurveTo(-4 * u, -12 * u, 2 * u, -8 * u); ctx.stroke();
    ctx.strokeStyle = '#2f6b28'; ctx.lineWidth = 3 * u;
    ctx.beginPath(); ctx.moveTo(-8 * u, -10 * u); ctx.lineTo(-2 * u, -13 * u); ctx.moveTo(0, -11 * u); ctx.lineTo(6 * u, -14 * u); ctx.stroke();
    ctx.fillStyle = '#d9382b'; ctx.beginPath(); ctx.arc(11 * u, -7 * u, 2.5 * u, 0, 7); ctx.fill();
  } else if (id === 'egg') {
    // Fried egg: crisp white with a golden yolk, browned edges when cooked.
    ctx.fillStyle = cooked ? '#ffe9a8' : '#fdfdf4';
    ctx.beginPath(); ctx.ellipse(0, 0, 22 * u, 16 * u, 0.3, 0, 7); ctx.fill(); ctx.stroke();
    if (cooked) { ctx.fillStyle = '#c97b3d'; for (const [dx, dy] of [[-18, -6], [16, 8], [-8, 12], [12, -11]]) { ctx.beginPath(); ctx.arc(dx * u, dy * u, 2.5 * u, 0, 7); ctx.fill(); } }
    ctx.fillStyle = cooked ? '#e8960f' : '#f6b73c';
    ctx.beginPath(); ctx.arc(2 * u, 0, 9 * u, 0, 7); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.beginPath(); ctx.arc(-1 * u, -3 * u, 3 * u, 0, 7); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 2 * u;
    ctx.beginPath(); ctx.arc(2 * u, 0, 12 * u, Math.PI * 1.1, Math.PI * 1.6); ctx.stroke();
  } else if (id === 'chicken') {
    // A drumstick: plump meaty end with shading, a bone with two knobs, char when cooked.
    ctx.fillStyle = cooked ? '#c97b3d' : '#e8a06a';
    ctx.beginPath(); ctx.ellipse(-5 * u, 3 * u, 16 * u, 13 * u, -0.4, 0, 7); ctx.fill(); ctx.stroke();
    ctx.fillStyle = cooked ? '#a85f2e' : '#d97b4f';
    ctx.beginPath(); ctx.ellipse(-9 * u, 7 * u, 9 * u, 6 * u, -0.4, 0, 7); ctx.fill();
    ctx.fillStyle = 'rgba(255,235,200,0.7)';
    ctx.beginPath(); ctx.ellipse(-8 * u, -3 * u, 7 * u, 4 * u, -0.4, 0, 7); ctx.fill();
    // Bone: warm tan (not near-white) with a dark backing stroke so it reads
    // against the light plate and counter; two knobs kept at the end.
    ctx.strokeStyle = 'rgba(60,35,15,0.75)'; ctx.lineWidth = 8.5 * u; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(6 * u, -4 * u); ctx.lineTo(18 * u, -14 * u); ctx.stroke();
    ctx.strokeStyle = '#e9d3a7'; ctx.lineWidth = 5 * u;
    ctx.beginPath(); ctx.moveTo(6 * u, -4 * u); ctx.lineTo(18 * u, -14 * u); ctx.stroke();
    ctx.fillStyle = '#e9d3a7';
    for (const [dx, dy] of [[16, -18], [21, -13]]) { ctx.beginPath(); ctx.arc(dx * u, dy * u, 3.5 * u, 0, 7); ctx.fill(); }
    ctx.strokeStyle = 'rgba(60,35,15,0.75)'; ctx.lineWidth = 2 * u;
    ctx.beginPath(); ctx.arc(16 * u, -18 * u, 3.5 * u, 0, 7); ctx.arc(21 * u, -13 * u, 3.5 * u, 0, 7); ctx.stroke();
    if (cooked) { ctx.fillStyle = '#7e3416'; for (const [dx, dy] of [[-12, 0], [-2, 8], [2, -6]]) { ctx.beginPath(); ctx.arc(dx * u, dy * u, 2.2 * u, 0, 7); ctx.fill(); } }
  } else if (id === 'skewer') {
    // A satay skewer: long stick with a pointed tip, three glazed meat cubes.
    ctx.strokeStyle = '#c9a06a'; ctx.lineWidth = 3.5 * u; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-24 * u, 16 * u); ctx.lineTo(24 * u, -16 * u); ctx.stroke();
    ctx.fillStyle = '#8a5a2b'; ctx.beginPath(); ctx.moveTo(24 * u, -16 * u); ctx.lineTo(28 * u, -19 * u); ctx.lineTo(24 * u, -12 * u); ctx.closePath(); ctx.fill();
    for (let i = 0; i < 3; i += 1) {
      const t = -14 + i * 12;
      ctx.save(); ctx.translate(t * u, -t * u * 0.64); ctx.rotate(-0.56);
      ctx.fillStyle = cooked ? '#a85f2e' : '#d97b4f'; rr(ctx, -7 * u, -7 * u, 14 * u, 14 * u, 3 * u); ctx.fill(); ctx.stroke();
      ctx.fillStyle = 'rgba(255,220,170,0.8)'; rr(ctx, -6 * u, -6 * u, 12 * u, 4 * u, 2 * u); ctx.fill();
      if (cooked) { ctx.fillStyle = '#6b3410'; ctx.beginPath(); ctx.arc(3 * u, 3 * u, 2 * u, 0, 7); ctx.arc(-3 * u, 4 * u, 1.6 * u, 0, 7); ctx.fill(); }
      ctx.restore();
    }
  } else if (id === 'chili') {
    ctx.fillStyle = '#d9382b'; ctx.beginPath(); ctx.moveTo(-18 * u, -12 * u);
    ctx.quadraticCurveTo(6 * u, -22 * u, 20 * u, 2 * u); ctx.quadraticCurveTo(10 * u, 20 * u, -6 * u, 12 * u);
    ctx.quadraticCurveTo(-16 * u, 6 * u, -18 * u, -12 * u); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 2.5 * u; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-10 * u, -10 * u); ctx.quadraticCurveTo(0, -16 * u, 12 * u, -4 * u); ctx.stroke();
    ctx.fillStyle = '#8f1d14'; ctx.beginPath(); ctx.arc(8 * u, 8 * u, 2 * u, 0, 7); ctx.fill();
    ctx.strokeStyle = '#2f6b28'; ctx.lineWidth = 4 * u; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-16 * u, -12 * u); ctx.quadraticCurveTo(-22 * u, -20 * u, -14 * u, -22 * u); ctx.stroke();
  } else if (id === 'veg') {
    // Fresh leafy greens: separate leaves in varied greens with veins, a light stem,
    // a cherry tomato and a carrot tip for accent.
    const leaves = [
      { a: -0.85, c: '#2f7a2e', l: 17 },
      { a: -0.35, c: '#58a34a', l: 19 },
      { a: 0.15, c: '#7ec850', l: 18 },
      { a: 0.65, c: '#4c8a3f', l: 16 },
    ];
    for (const lf of leaves) {
      ctx.save(); ctx.rotate(lf.a);
      ctx.fillStyle = lf.c; ctx.beginPath(); ctx.ellipse(0, -9 * u, 7.5 * u, lf.l * u, 0, 0, 7); ctx.fill();
      ctx.strokeStyle = '#2f6b28'; ctx.lineWidth = 2 * u; ctx.stroke();
      ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.lineWidth = 1.6 * u;
      ctx.beginPath(); ctx.moveTo(0, 2 * u); ctx.lineTo(0, (-9 - lf.l + 6) * u); ctx.stroke();
      ctx.restore();
    }
    ctx.strokeStyle = '#c9e39a'; ctx.lineWidth = 3 * u; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(0, 6 * u); ctx.lineTo(0, 20 * u); ctx.stroke();
    ctx.fillStyle = '#d9382b'; ctx.beginPath(); ctx.arc(-13 * u, 8 * u, 6 * u, 0, 7); ctx.fill();
    ctx.strokeStyle = 'rgba(60,35,15,0.75)'; ctx.lineWidth = 2 * u; ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.beginPath(); ctx.arc(-15 * u, 6 * u, 1.8 * u, 0, 7); ctx.fill();
    ctx.fillStyle = '#e8821e'; ctx.beginPath(); ctx.moveTo(12 * u, 10 * u); ctx.lineTo(20 * u, 8 * u); ctx.lineTo(14 * u, 16 * u); ctx.closePath(); ctx.fill(); ctx.stroke();
  } else if (id === 'sauce') {
    // Dark kecap bottle: near-black sweet-soy sauce, dark amber glass, dark cap.
    ctx.fillStyle = '#3a2310'; rr(ctx, -9 * u, -20 * u, 18 * u, 34 * u, 4 * u); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#1d0e04'; rr(ctx, -9 * u, -4 * u, 18 * u, 18 * u, 3 * u); ctx.fill();
    ctx.fillStyle = '#241606'; rr(ctx, -5 * u, -26 * u, 10 * u, 8 * u, 2 * u); ctx.fill(); ctx.stroke();
    // Gloss stripe down the clear upper half of the bottle.
    ctx.fillStyle = 'rgba(255,255,255,0.65)'; rr(ctx, -7 * u, -18 * u, 2.5 * u, 12 * u, 1.2 * u); ctx.fill();
    // The house sauce: our own "KECAP" label, shrunk to fit the bottle at any size.
    ctx.fillStyle = '#fff';
    let fs = 10 * u;
    ctx.font = `bold ${fs}px system-ui, sans-serif`;
    const labelW = ctx.measureText('KECAP').width;
    if (labelW > 16 * u) { fs *= (16 * u) / labelW; ctx.font = `bold ${fs}px system-ui, sans-serif`; }
    ctx.textAlign = 'center'; ctx.fillText('KECAP', 0, 6 * u);
  }
  ctx.restore();
}

function drawBackground(ctx, t) {
  // Warm wood-plank wall: alternating plank shades, grain strokes, seams and
  // nails, so the warung reads as a real building wall, not a blank square.
  // A darker wainscot band runs along the bottom of the wall.
  ctx.fillStyle = '#f3d9a4'; ctx.fillRect(0, 96, 1280, 374);
  const plankShades = ['#f6e2b6', '#efd49b', '#f3d9a4', '#eed092'];
  for (let py = 96, i = 0; py < 470; py += 34, i += 1) {
    ctx.fillStyle = plankShades[i % 4]; ctx.fillRect(0, py, 1280, 34);
    ctx.strokeStyle = 'rgba(180,130,60,0.28)'; ctx.lineWidth = 1.5; ctx.lineCap = 'round';
    for (const gy of [py + 11, py + 23]) {
      ctx.beginPath(); ctx.moveTo(0, gy);
      for (let x = 0; x <= 1280; x += 160) ctx.quadraticCurveTo(x + 80, gy + 3, x + 160, gy);
      ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(140,95,40,0.5)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, py + 33); ctx.lineTo(1280, py + 33); ctx.stroke();
    ctx.fillStyle = 'rgba(120,80,35,0.55)';
    const nx = (i % 2 === 0) ? 64 : 320;
    for (let x = nx; x < 1280; x += 256) { ctx.beginPath(); ctx.arc(x, py + 17, 2, 0, 7); ctx.fill(); }
  }
  // Wainscot: darker wood panels along the bottom of the wall.
  ctx.fillStyle = '#c98d54'; ctx.fillRect(0, 430, 1280, 40);
  ctx.fillStyle = '#b87a45'; for (let x = 0; x < 1280; x += 96) ctx.fillRect(x, 430, 3, 40);
  ctx.fillStyle = '#a8763f'; ctx.fillRect(0, 430, 1280, 4);
  // Striped warung awning across the top of the wall, red and cream, scalloped edge.
  for (let i = 0; i < 16; i += 1) {
    ctx.fillStyle = i % 2 === 0 ? '#d9382b' : '#fff3df';
    ctx.fillRect(i * 80, 96, 80, 28);
    ctx.beginPath(); ctx.arc(i * 80 + 40, 124, 40, 0, Math.PI); ctx.fill();
  }
  ctx.fillStyle = '#8a5a2b'; ctx.fillRect(0, 96, 1280, 3);
  // Window with a night street: moon, stars, dark skyline with lit windows.
  ctx.save();
  rr(ctx, 60, 130, 220, 150, 10); ctx.clip();
  const sky = ctx.createLinearGradient(0, 130, 0, 280);
  sky.addColorStop(0, '#16233f'); sky.addColorStop(0.65, '#2c4a7a'); sky.addColorStop(1, '#3a5a8a');
  ctx.fillStyle = sky; ctx.fillRect(60, 130, 220, 150);
  // Stars.
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  for (const [sx, sy, sr] of [[84, 148, 1.6], [120, 140, 1.2], [160, 152, 1.8], [200, 142, 1.2], [252, 150, 1.6], [96, 172, 1.2], [150, 168, 1.4], [222, 176, 1.2], [262, 190, 1.4]]) {
    ctx.beginPath(); ctx.arc(sx, sy, sr, 0, 7); ctx.fill();
  }
  // Moon with a soft glow.
  ctx.fillStyle = 'rgba(255,244,200,0.3)'; ctx.beginPath(); ctx.arc(232, 168, 30, 0, 7); ctx.fill();
  ctx.fillStyle = '#fff4c8'; ctx.beginPath(); ctx.arc(232, 168, 19, 0, 7); ctx.fill();
  ctx.fillStyle = 'rgba(200,180,130,0.6)';
  ctx.beginPath(); ctx.arc(226, 162, 3, 0, 7); ctx.arc(238, 174, 2.4, 0, 7); ctx.arc(236, 160, 2, 0, 7); ctx.fill();
  // Far skyline, dark for depth.
  ctx.fillStyle = '#1d2f4a';
  ctx.fillRect(64, 196, 34, 54); ctx.fillRect(104, 206, 26, 44); ctx.fillRect(196, 200, 30, 50); ctx.fillRect(232, 210, 34, 40);
  ctx.fillStyle = '#24365a'; ctx.fillRect(136, 214, 24, 36); ctx.fillRect(164, 204, 22, 46);
  // Near buildings, dark silhouettes with small lit windows.
  const near = [
    { x: 66, y: 216, w: 40, h: 34, c: '#141f33' },
    { x: 112, y: 228, w: 34, h: 22, c: '#1a2942' },
    { x: 152, y: 210, w: 44, h: 40, c: '#101a2c' },
    { x: 202, y: 224, w: 36, h: 26, c: '#141f33' },
    { x: 244, y: 214, w: 32, h: 36, c: '#1a2942' },
  ];
  for (const b of near) {
    ctx.fillStyle = b.c; ctx.fillRect(b.x, b.y, b.w, b.h);
    ctx.strokeStyle = 'rgba(0,0,0,0.6)'; ctx.lineWidth = 1.5; ctx.strokeRect(b.x, b.y, b.w, b.h);
    for (let wy = b.y + 6; wy < b.y + b.h - 4; wy += 11) {
      for (let wx = b.x + 6; wx < b.x + b.w - 4; wx += 11) {
        ctx.fillStyle = ((wx + wy) % 22 === 0) ? '#ffd23e' : '#0a1220';
        ctx.fillRect(wx, wy, 5, 6);
      }
    }
  }
  // Dark street with bushes below.
  ctx.fillStyle = '#1e3a24'; ctx.fillRect(60, 250, 220, 30);
  ctx.fillStyle = '#2a5230'; ctx.beginPath(); ctx.arc(96, 258, 10, 0, 7); ctx.arc(116, 262, 8, 0, 7); ctx.arc(248, 260, 9, 0, 7); ctx.fill();
  ctx.restore();
  // Frame and cross bars on top.
  ctx.strokeStyle = '#6b4a2f'; ctx.lineWidth = 6; rr(ctx, 60, 130, 220, 150, 10); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(170, 130); ctx.lineTo(170, 280); ctx.moveTo(60, 205); ctx.lineTo(280, 205); ctx.stroke();
  // Neon BUKA (open) sign stuck in the window's bottom-left corner.
  ctx.fillStyle = 'rgba(20,16,8,0.88)'; rr(ctx, 64, 232, 78, 40, 6); ctx.fill();
  ctx.strokeStyle = '#ffd23e'; ctx.lineWidth = 2; rr(ctx, 64, 232, 78, 40, 6); ctx.stroke();
  text(ctx, 'BUKA', 103, 246, 15, '#ffd23e', 'center');
  text(ctx, 'OPEN', 103, 262, 9, '#fff', 'center');
  // Chalkboard menu on the right wall.
  ctx.fillStyle = '#2f4a3a'; rr(ctx, 980, 130, 240, 150, 8); ctx.fill();
  ctx.strokeStyle = '#c9a06a'; ctx.lineWidth = 5; rr(ctx, 980, 130, 240, 150, 8); ctx.stroke();
  text(ctx, "TODAY'S MENU", 1100, 152, 16, '#ffe9a8', 'center');
  for (let i = 0; i < 4; i += 1) text(ctx, RECIPES[i].name, 1000, 182 + i * 24, 14, '#f5f0dc');
  for (let i = 0; i < 4; i += 1) text(ctx, `${RECIPES[i].coins}c`, 1200, 182 + i * 24, 14, '#ffd23e', 'right');
  // String lights draped under the awning over the queue (not over the menu board).
  ctx.strokeStyle = '#3a2a18'; ctx.lineWidth = 2; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(0, 142);
  for (let x = 0; x < 960; x += 160) ctx.quadraticCurveTo(x + 80, 164, x + 160, 142);
  ctx.stroke();
  for (let x = 80; x < 960; x += 160) {
    const by = 152 + 6 * Math.sin(x / 160);
    ctx.fillStyle = 'rgba(255,210,62,0.35)'; ctx.beginPath(); ctx.arc(x, by + 4, 10, 0, 7); ctx.fill();
    ctx.fillStyle = '#ffd23e'; ctx.beginPath(); ctx.arc(x, by + 4, 5, 0, 7); ctx.fill();
    ctx.fillStyle = '#8a6a42'; ctx.fillRect(x - 2, by - 2, 4, 4);
  }
  // Hanging pans on the wall under the window, in three different sizes.
  const panSizes = [26, 18, 22];
  for (let i = 0; i < 3; i += 1) {
    const x = 100 + i * 70;
    const r = panSizes[i];
    const cy = 322;
    ctx.strokeStyle = '#5a4a3a'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, 288); ctx.lineTo(x, cy - r); ctx.stroke();
    ctx.fillStyle = '#3a3a3a'; ctx.beginPath(); ctx.arc(x, cy, r, 0, 7); ctx.fill();
    ctx.fillStyle = '#555'; ctx.beginPath(); ctx.arc(x, cy, Math.round(r * 0.7), 0, 7); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.beginPath(); ctx.arc(x - r * 0.3, cy - r * 0.3, Math.round(r * 0.18), 0, 7); ctx.fill();
  }
  // Framed SATE AYAM poster pinned under the window, tape on the corners.
  ctx.fillStyle = '#fff8e8'; rr(ctx, 40, 356, 160, 96, 6); ctx.fill();
  ctx.strokeStyle = '#8a5a2b'; ctx.lineWidth = 4; rr(ctx, 40, 356, 160, 96, 6); ctx.stroke();
  ctx.fillStyle = 'rgba(240,220,160,0.85)'; ctx.fillRect(36, 352, 22, 12); ctx.fillRect(182, 352, 22, 12);
  text(ctx, 'SATE AYAM', 120, 380, 17, '#d9382b', 'center');
  text(ctx, '★ BEST SELLER ★', 120, 400, 11, '#8a5a2b', 'center');
  ctx.strokeStyle = '#c9a06a'; ctx.lineWidth = 3; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(68, 428); ctx.lineTo(172, 412); ctx.stroke();
  for (const [mx, my] of [[90, 423], [120, 418], [150, 413]]) {
    ctx.fillStyle = '#a85f2e'; rr(ctx, mx - 8, my - 7, 16, 14, 3); ctx.fill();
    ctx.fillStyle = 'rgba(255,220,170,0.8)'; rr(ctx, mx - 7, my - 6, 14, 4, 2); ctx.fill();
  }
  text(ctx, 'Rp 16rb', 120, 444, 14, '#2f6b28', 'center');
  // Narrow red banner on the far right edge: SATE / MIE / NASI stacked.
  ctx.fillStyle = '#d9382b'; rr(ctx, 1226, 140, 48, 160, 6); ctx.fill();
  ctx.strokeStyle = '#fff3df'; ctx.lineWidth = 2; rr(ctx, 1226, 140, 48, 160, 6); ctx.stroke();
  text(ctx, 'SATE', 1250, 168, 13, '#fff', 'center');
  text(ctx, 'MIE', 1250, 198, 13, '#fff', 'center');
  text(ctx, 'NASI', 1250, 228, 13, '#fff', 'center');
  for (const cy of [258, 282]) {
    ctx.fillStyle = '#d9382b'; ctx.strokeStyle = '#fff';
    ctx.beginPath(); ctx.moveTo(1242, cy - 8); ctx.quadraticCurveTo(1258, cy - 14, 1258, cy + 2);
    ctx.quadraticCurveTo(1250, cy + 8, 1242, cy - 8); ctx.fill(); ctx.stroke();
  }
  // Hanging plant left of the window, in a clay pot.
  ctx.strokeStyle = '#6b4a2f'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(32, 124); ctx.lineTo(32, 150); ctx.stroke();
  ctx.fillStyle = '#b87a45'; ctx.beginPath(); ctx.moveTo(20, 150); ctx.lineTo(44, 150); ctx.lineTo(39, 168); ctx.lineTo(25, 168); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#58a34a';
  ctx.beginPath(); ctx.ellipse(26, 146, 6, 9, -0.4, 0, 7); ctx.ellipse(38, 144, 6, 9, 0.4, 0, 7); ctx.ellipse(32, 140, 5, 8, 0, 0, 7); ctx.fill();
  // A hairline crack in the plaster and damp stains, for age.
  ctx.strokeStyle = 'rgba(90,60,30,0.55)'; ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.beginPath();
  ctx.moveTo(1150, 408); ctx.lineTo(1158, 424); ctx.lineTo(1152, 440); ctx.lineTo(1162, 456); ctx.lineTo(1156, 466); ctx.stroke();
  ctx.fillStyle = 'rgba(140,110,70,0.25)'; ctx.beginPath(); ctx.ellipse(1182, 452, 26, 12, 0, 0, 7); ctx.fill();
  ctx.fillStyle = 'rgba(140,110,70,0.22)'; ctx.beginPath(); ctx.ellipse(320, 452, 30, 10, 0, 0, 7); ctx.fill();
  // Steam wisp over the stove, drifting with time.
  ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.lineWidth = 4; ctx.lineCap = 'round';
  for (let i = 0; i < 2; i += 1) {
    const sx = 1150 + i * 100 + Math.sin(t * 1.4 + i * 2) * 6;
    ctx.beginPath(); ctx.moveTo(sx, 470); ctx.quadraticCurveTo(sx + 12, 440, sx - 6, 412); ctx.stroke();
  }
  // Floor.
  ctx.fillStyle = '#b07a45'; ctx.fillRect(0, 470, 1280, 250);
  ctx.fillStyle = '#9c6a38'; for (let x = 0; x < 1280; x += 128) ctx.fillRect(x, 470, 4, 250);
  // Raised wooden waiting deck inside the warung: the queue's floor line.
  // Customers stand on its top edge (y 384); the serving board and counter
  // in front of it hide its lower face in the middle, as a real counter would.
  ctx.fillStyle = '#9c6a38'; ctx.fillRect(220, 382, 540, 20);
  ctx.fillStyle = '#c98d54'; ctx.fillRect(220, 382, 540, 4);
  ctx.fillStyle = '#7a4a22'; for (let x = 260; x < 760; x += 60) ctx.fillRect(x, 386, 3, 16);
  ctx.fillStyle = '#7a4a22'; ctx.fillRect(220, 400, 540, 2);
  // Cash register on a little side table under the waiting deck, left side.
  ctx.fillStyle = '#6b4423'; rr(ctx, 250, 428, 136, 32, 6); ctx.fill();
  ctx.strokeStyle = '#4a2e15'; ctx.lineWidth = 2; rr(ctx, 250, 428, 136, 32, 6); ctx.stroke();
  ctx.fillStyle = '#5a3a18'; ctx.fillRect(260, 460, 10, 10); ctx.fillRect(366, 460, 10, 10);
  ctx.fillStyle = '#3a3a3a'; rr(ctx, 270, 392, 96, 36, 6); ctx.fill();
  ctx.strokeStyle = '#222'; ctx.lineWidth = 2; rr(ctx, 270, 392, 96, 36, 6); ctx.stroke();
  ctx.fillStyle = '#ffd23e'; rr(ctx, 280, 398, 42, 14, 3); ctx.fill();
  text(ctx, 'Rp', 301, 406, 10, '#3a2a18', 'center');
  ctx.fillStyle = '#f5f0dc';
  for (let i = 0; i < 4; i += 1) ctx.fillRect(282 + i * 13, 417, 9, 6);
  ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(276, 396); ctx.lineTo(276, 424); ctx.stroke();
}

// Two wooden stools where customers sit at the counter. Drawn after the counter
// so they sit in front of it, not under its wood fill.
function drawStools(ctx) {
  for (const sx of [120, 1160]) {
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.beginPath(); ctx.ellipse(sx, 712, 52, 7, 0, 0, 7); ctx.fill();
    ctx.strokeStyle = '#5a3a18'; ctx.lineWidth = 5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(sx - 32, 656); ctx.lineTo(sx - 42, 708); ctx.moveTo(sx + 32, 656); ctx.lineTo(sx + 42, 708); ctx.stroke();
    ctx.strokeStyle = '#6b4423'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(sx - 37, 686); ctx.lineTo(sx + 37, 686); ctx.stroke();
    ctx.fillStyle = '#8a5a2b'; rr(ctx, sx - 46, 636, 92, 18, 8); ctx.fill();
    ctx.strokeStyle = '#5a3a18'; ctx.lineWidth = 2; rr(ctx, sx - 46, 636, 92, 18, 8); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,220,170,0.5)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(sx - 38, 640); ctx.lineTo(sx + 38, 640); ctx.stroke();
  }
}

function patienceColor(frac) { return frac > 0.5 ? '#58a34a' : frac > 0.25 ? '#f2a541' : '#d9382b'; }

// The customer queue: five BIG illustrated customers standing INSIDE the warung
// on a raised wooden waiting deck (feet on the deck's top edge, y 384, with a
// soft shadow under each pair of shoes), so they read as real people waiting
// for their order instead of floating busts. A customer's face and patience
// bar mirror their ticket; a VIP order's customer gets a gold outline.
const QUEUE_X = [275, 375, 475, 575, 675];
const QUEUE_ROSTER = [
  { skin: '#c98d5f', top: '#2f7a2e', pants: '#2f3a4a', hat: 'ojek' }, // ojek driver, green jacket + helmet
  { skin: '#f2c89b', top: '#d9382b', pants: '#8a2f2f', hat: 'kerudung' }, // ibu with a red kerudung
  { skin: '#e8b88a', top: '#3f6fb5', pants: '#3a3a3a', hat: 'cap' }, // student with a blue cap
  { skin: '#f2c89b', top: '#f5f0dc', pants: '#2f2f38', hat: 'tie' }, // office worker, white shirt + tie
  { skin: '#c98d5f', top: '#f2a541', pants: '#5a4a3a', hat: 'batik' }, // pak in a batik shirt
];
const QUEUE_FEET = 384; // every customer's shoes sit on this deck line

function drawCustomer(ctx, cx, spec, frac, vip, recipe) {
  const fy = QUEUE_FEET; // feet line
  const hy = fy - 122; // head centre (head r 26)
  // Soft shadow under the shoes, on the deck.
  ctx.fillStyle = 'rgba(0,0,0,0.20)';
  ctx.beginPath(); ctx.ellipse(cx, fy + 2, 46, 6, 0, 0, 7); ctx.fill();
  // VIP: gold outline around the whole customer (bubble to shoes).
  if (vip) {
    ctx.strokeStyle = '#f2a541'; ctx.lineWidth = 4;
    rr(ctx, cx - 62, 168, 124, 222, 12); ctx.stroke();
    ctx.fillStyle = '#b87a1d'; rr(ctx, cx - 24, 156, 48, 14, 4); ctx.fill();
    text(ctx, 'VIP', cx, 163, 10, '#fff', 'center');
  }
  // Thought bubble: the ordered dish, or an ellipsis while waiting.
  ctx.fillStyle = '#fff'; rr(ctx, cx - 55, 168, 110, 42, 10); ctx.fill();
  ctx.strokeStyle = vip ? '#f2a541' : '#c9a06a'; ctx.lineWidth = 2; rr(ctx, cx - 55, 168, 110, 42, 10); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx - 10, 210); ctx.lineTo(cx + 10, 210); ctx.lineTo(cx, 226); ctx.closePath(); ctx.fill(); ctx.stroke();
  if (recipe) {
    recipe.needs.forEach((id, j) => drawIngredientIcon(ctx, id, cx - 28 + j * 28, 189, 22, true));
  } else {
    text(ctx, '…', cx, 190, 22, '#8a6a42', 'center');
  }
  // Legs and shoes, planted on the deck line.
  if (spec.hat === 'kerudung') {
    // Long dress instead of separate legs.
    ctx.fillStyle = spec.pants; rr(ctx, cx - 40, 338, 80, 40, 10); ctx.fill();
    ctx.strokeStyle = 'rgba(60,35,15,0.5)'; ctx.lineWidth = 2; rr(ctx, cx - 40, 338, 80, 40, 10); ctx.stroke();
  } else {
    ctx.fillStyle = spec.pants;
    rr(ctx, cx - 30, 338, 22, 40, 8); ctx.fill();
    rr(ctx, cx + 8, 338, 22, 40, 8); ctx.fill();
    ctx.strokeStyle = 'rgba(60,35,15,0.5)'; ctx.lineWidth = 2;
    rr(ctx, cx - 30, 338, 22, 40, 8); ctx.stroke();
    rr(ctx, cx + 8, 338, 22, 40, 8); ctx.stroke();
  }
  ctx.fillStyle = '#3a2a18';
  ctx.beginPath(); ctx.ellipse(cx - 19, fy - 4, 15, 6, 0, 0, 7); ctx.ellipse(cx + 19, fy - 4, 15, 6, 0, 0, 7); ctx.fill();
  // Arms, hanging at the sides.
  ctx.strokeStyle = spec.top; ctx.lineWidth = 15; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(cx - 42, 300); ctx.lineTo(cx - 54, 344); ctx.moveTo(cx + 42, 300); ctx.lineTo(cx + 54, 344); ctx.stroke();
  // Body: shoulders to the hem.
  ctx.fillStyle = spec.top;
  ctx.beginPath();
  ctx.moveTo(cx - 52, 344); ctx.lineTo(cx - 44, 296);
  ctx.quadraticCurveTo(cx, 286, cx + 44, 296); ctx.lineTo(cx + 52, 344); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(60,35,15,0.5)'; ctx.lineWidth = 2; ctx.stroke();
  if (spec.hat === 'tie') {
    ctx.fillStyle = '#d9382b';
    ctx.beginPath(); ctx.moveTo(cx - 8, 300); ctx.lineTo(cx + 8, 300); ctx.lineTo(cx, 330); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(cx - 13, 292); ctx.lineTo(cx, 300); ctx.lineTo(cx + 13, 292); ctx.closePath(); ctx.fill();
  } else if (spec.hat === 'batik') {
    ctx.fillStyle = 'rgba(60,35,15,0.55)';
    for (const [dx, dy] of [[-27, 310], [0, 302], [27, 310], [-14, 326], [14, 326], [0, 340]]) {
      ctx.beginPath(); ctx.arc(cx + dx, dy, 3.5, 0, 7); ctx.fill();
    }
  } else if (spec.hat === 'kerudung') {
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.beginPath(); ctx.moveTo(cx - 34, 300); ctx.lineTo(cx + 34, 300); ctx.lineTo(cx + 24, 312); ctx.lineTo(cx - 24, 312); ctx.closePath(); ctx.fill();
  }
  // Head.
  if (spec.hat === 'kerudung') {
    // Kerudung: a scarf framing the face, draping to the shoulders.
    ctx.fillStyle = spec.top; ctx.beginPath(); ctx.arc(cx, hy, 34, 0, 7); ctx.fill();
    ctx.fillStyle = spec.top; rr(ctx, cx - 34, hy + 6, 68, 34, 10); ctx.fill();
  }
  ctx.fillStyle = spec.skin; ctx.beginPath(); ctx.arc(cx, hy, 26, 0, 7); ctx.fill();
  ctx.strokeStyle = 'rgba(60,35,15,0.5)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, hy, 26, 0, 7); ctx.stroke();
  if (spec.hat === 'ojek') {
    // Green helmet with a visor line.
    ctx.fillStyle = '#2f7a2e'; ctx.beginPath(); ctx.arc(cx, hy - 5, 27, Math.PI, 0); ctx.fill();
    ctx.fillStyle = '#2f7a2e'; rr(ctx, cx - 27, hy - 8, 54, 8, 4); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(cx - 20, hy - 14); ctx.quadraticCurveTo(cx, hy - 20, cx + 20, hy - 14); ctx.stroke();
  } else if (spec.hat === 'cap') {
    ctx.fillStyle = '#3f6fb5'; ctx.beginPath(); ctx.arc(cx, hy - 2, 25, Math.PI, 0); ctx.fill();
    ctx.fillStyle = '#2a4a7a'; rr(ctx, cx - 2, hy - 10, 34, 7, 3); ctx.fill();
  } else if (spec.hat === 'batik' || spec.hat === 'tie') {
    ctx.fillStyle = '#3a2a18'; ctx.beginPath(); ctx.arc(cx, hy - 4, 25, Math.PI * 0.95, Math.PI * 2.05); ctx.fill();
  }
  // Face: eyes and a mouth that mirrors the patience bar.
  ctx.fillStyle = '#3a2a18';
  ctx.beginPath(); ctx.arc(cx - 9, hy - 2, 2.6, 0, 7); ctx.arc(cx + 9, hy - 2, 2.6, 0, 7); ctx.fill();
  ctx.strokeStyle = '#3a2a18'; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
  ctx.beginPath();
  if (frac > 0.5) { ctx.arc(cx, hy + 8, 8, 0.15 * Math.PI, 0.85 * Math.PI); }
  else if (frac > 0.25) { ctx.moveTo(cx - 7, hy + 10); ctx.lineTo(cx + 7, hy + 10); }
  else { ctx.arc(cx, hy + 14, 8, 1.15 * Math.PI, 1.85 * Math.PI); }
  ctx.stroke();
  if (frac <= 0.25) { ctx.fillStyle = '#7ec8e3'; ctx.beginPath(); ctx.arc(cx + 24, hy - 14, 4, 0, 7); ctx.fill(); }
  // Patience bar under the shoes, on the deck face (order customers only).
  if (recipe) {
    ctx.fillStyle = '#e8dcc0'; rr(ctx, cx - 55, 390, 110, 6, 3); ctx.fill();
    ctx.fillStyle = patienceColor(frac); rr(ctx, cx - 55, 390, 110 * frac, 6, 3); ctx.fill();
  }
}

function drawQueue(ctx, world) {
  const n = world.orders.length;
  for (let i = 0; i < 5; i += 1) {
    const cx = QUEUE_X[i];
    const spec = QUEUE_ROSTER[i];
    if (i < n) {
      const order = world.orders[i];
      const frac = Math.max(0, order.patience / order.max);
      drawCustomer(ctx, cx, spec, frac, order.vip, order.recipe);
    } else {
      drawCustomer(ctx, cx, spec, 1, false, null); // waiting for a table
    }
  }
}

function drawOrderBoard(ctx, world, t) {
  const b = LAYOUT.orderBoard;
  ctx.fillStyle = '#5a3a18'; rr(ctx, b.x, b.y, b.w, b.h, 10); ctx.fill();
  ctx.fillStyle = '#f5e6c8'; rr(ctx, b.x + 4, b.y + 4, b.w - 8, b.h - 8, 8); ctx.fill();
  text(ctx, 'ORDERS', b.x + 14, b.y + 18, 13, '#8a5a2b');
  if (world.orders.length === 0) text(ctx, 'No orders yet — take a breath!', b.x + 90, b.y + 44, 15, '#8a5a2b');
  world.orders.forEach((order, i) => {
    const x = b.x + 92 + i * 152;
    const y = b.y + 8;
    const frac = Math.max(0, order.patience / order.max);
    ctx.fillStyle = order.vip ? '#fff3c4' : '#fff'; rr(ctx, x, y, 144, 60, 8); ctx.fill();
    // VIP rush orders get a gold ticket; a ticket about to walk out flashes red.
    if (order.vip) { ctx.strokeStyle = '#f2a541'; ctx.lineWidth = 3; }
    else if (frac < 0.15) { ctx.strokeStyle = Math.floor(t * 3) % 2 === 0 ? '#d9382b' : '#fff'; ctx.lineWidth = 3; }
    else { ctx.strokeStyle = '#c9a06a'; ctx.lineWidth = 2; }
    rr(ctx, x, y, 144, 60, 8); ctx.stroke();
    if (order.vip) { ctx.fillStyle = '#b87a1d'; rr(ctx, x + 96, y + 2, 46, 14, 4); ctx.fill(); text(ctx, 'VIP 2x', x + 119, y + 10, 10, '#fff', 'center'); }
    text(ctx, order.recipe.name, x + 8, y + 13, 13, '#3a2a18');
    order.recipe.needs.forEach((id, j) => drawIngredientIcon(ctx, id, x + 20 + j * 34, y + 34, 30, true));
    ctx.fillStyle = '#e8dcc0'; rr(ctx, x + 8, y + 52, 128, 6, 3); ctx.fill();
    ctx.fillStyle = patienceColor(frac); rr(ctx, x + 8, y + 52, 128 * frac, 6, 3); ctx.fill();
    // The waiting customer, drawn on the ticket: their face mirrors the patience bar.
    // (VIP tickets skip the face — the gold ticket already marks them.)
    if (!order.vip) {
      const fx = x + 130;
      const fy = y + 16;
      ctx.fillStyle = '#f2c89b'; ctx.beginPath(); ctx.arc(fx, fy, 9, 0, 7); ctx.fill();
      ctx.fillStyle = '#3a2a18';
      ctx.beginPath(); ctx.arc(fx - 3, fy - 2, 1.4, 0, 7); ctx.arc(fx + 3, fy - 2, 1.4, 0, 7); ctx.fill();
      ctx.strokeStyle = '#3a2a18'; ctx.lineWidth = 1.6; ctx.lineCap = 'round';
      ctx.beginPath();
      if (frac > 0.5) { ctx.arc(fx, fy + 2, 4, 0.15 * Math.PI, 0.85 * Math.PI); }
      else if (frac > 0.25) { ctx.moveTo(fx - 3, fy + 5); ctx.lineTo(fx + 3, fy + 5); }
      else { ctx.arc(fx, fy + 8, 4, 1.15 * Math.PI, 1.85 * Math.PI); }
      ctx.stroke();
      if (frac <= 0.25) { ctx.fillStyle = '#7ec8e3'; ctx.beginPath(); ctx.arc(fx + 10, fy - 6, 2.4, 0, 7); ctx.fill(); }
    }
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
  // The coin count pops bigger for a beat after every serve.
  ctx.save();
  const pop = 1 + 0.3 * world.coinPop;
  ctx.translate(b.x + 48, b.y + 26);
  ctx.scale(pop, pop);
  text(ctx, `${world.coins}`, 0, 0, 22, '#ffd23e');
  ctx.restore();
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

function drawBins(ctx, world, t) {
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
      if (burner.burnt) {
        // Charred: blackened food, a grey smoke curl, and a BURNT! label — click to trash it.
        drawIngredientIcon(ctx, burner.id, r.x + 50, r.y + 48, 46, true);
        ctx.fillStyle = 'rgba(20,20,20,0.55)'; ctx.beginPath(); ctx.arc(r.x + 50, r.y + 48, 38, 0, 7); ctx.fill();
        ctx.strokeStyle = 'rgba(200,200,200,0.7)'; ctx.lineWidth = 3; ctx.lineCap = 'round';
        const wx = r.x + 50 + Math.sin(t * 2 + i * 2) * 5;
        ctx.beginPath(); ctx.moveTo(wx, r.y + 16); ctx.quadraticCurveTo(wx + 8, r.y, wx - 4, r.y - 14); ctx.stroke();
        text(ctx, 'BURNT!', r.x + 50, r.y + 88, 12, '#ff6b5e', 'center');
      } else if (!burner.done) {
        ctx.fillStyle = '#ff7a2f';
        ctx.beginPath(); ctx.moveTo(r.x + 50, r.y + 48);
        ctx.arc(r.x + 50, r.y + 48, 38, -Math.PI / 2, -Math.PI / 2 + burner.progress * Math.PI * 2);
        ctx.closePath(); ctx.fill();
        // Steam curls while food cooks.
        ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 3; ctx.lineCap = 'round';
        const wx = r.x + 50 + Math.sin(t * 1.8 + i * 2.4) * 5;
        ctx.beginPath(); ctx.moveTo(wx, r.y + 14); ctx.quadraticCurveTo(wx + 8, r.y - 2, wx - 4, r.y - 16); ctx.stroke();
        drawIngredientIcon(ctx, burner.id, r.x + 50, r.y + 48, 46, false);
      } else {
        ctx.fillStyle = '#ffd23e'; ctx.beginPath(); ctx.arc(r.x + 50, r.y + 48, 42, 0, 7); ctx.fill();
        text(ctx, 'READY!', r.x + 50, r.y + 88, 12, '#ffd23e', 'center');
        drawIngredientIcon(ctx, burner.id, r.x + 50, r.y + 48, 46, true);
      }
    } else {
      text(ctx, 'empty', r.x + 50, r.y + 48, 13, '#888', 'center');
    }
  });
}

function drawPlateArea(ctx, world) {
  const p = LAYOUT.plate;
  // Wooden serving board under the plate: warm wood with wavy grain lines, a
  // defined rim, a light top bevel and a soft shadow, so it reads as a real
  // board and not a flat bar. (The plate and bottle are drawn over the middle
  // afterwards, so the grain shows on the ends and the bottom edge.)
  ctx.fillStyle = '#8a5a2b'; rr(ctx, p.x - 24, p.y + 96, p.w + 48, 40, 12); ctx.fill();
  ctx.save();
  rr(ctx, p.x - 24, p.y + 96, p.w + 48, 40, 12); ctx.clip();
  ctx.strokeStyle = 'rgba(107,68,35,0.55)'; ctx.lineWidth = 2; ctx.lineCap = 'round';
  for (const [y0, amp] of [[404, 3], [416, 4], [428, 3]]) {
    ctx.beginPath(); ctx.moveTo(p.x - 20, y0);
    ctx.bezierCurveTo(p.x + 100, y0 - amp, p.x + 220, y0 + amp, p.x + p.w + 44, y0);
    ctx.stroke();
  }
  ctx.strokeStyle = 'rgba(255,220,170,0.5)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(p.x - 12, p.y + 99); ctx.lineTo(p.x + p.w + 36, p.y + 99); ctx.stroke();
  ctx.strokeStyle = 'rgba(60,35,15,0.4)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(p.x - 12, p.y + 133); ctx.lineTo(p.x + p.w + 36, p.y + 133); ctx.stroke();
  ctx.restore();
  ctx.strokeStyle = '#6b4423'; ctx.lineWidth = 2.5; rr(ctx, p.x - 24, p.y + 96, p.w + 48, 40, 12); ctx.stroke();
  ctx.fillStyle = 'rgba(60,35,15,0.15)'; rr(ctx, p.x - 20, p.y + 136, p.w + 40, 5, 2); ctx.fill();
  // The plate, squashed wide and flat for a beat after every serve.
  const sq = world.serveAnim;
  ctx.save();
  ctx.translate(p.x + p.w / 2, p.y + 66);
  ctx.scale(1 + 0.07 * sq, 1 - 0.09 * sq);
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(0, 0, 150, 62, 0, 0, 7); ctx.fill();
  ctx.strokeStyle = '#d8c9a8'; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(0, 0, 150, 62, 0, 0, 7); ctx.stroke();
  ctx.strokeStyle = '#e8dcc0'; ctx.beginPath(); ctx.ellipse(0, 0, 118, 46, 0, 0, 7); ctx.stroke();
  // Assembled ingredients on the plate, drawn big so they read in a screenshot.
  // The sauce bottle is served beside the plate, not on it (drawn below).
  const plateFoods = world.plate.filter((id) => id !== 'sauce');
  plateFoods.forEach((id, i) => {
    const cx = (i - (plateFoods.length - 1) / 2) * 90;
    drawIngredientIcon(ctx, id, cx, -4, 90, true);
  });
  ctx.restore();
  // The bottle stands on the serving board beside the plate, clearly separate.
  if (world.plate.includes('sauce')) {
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.beginPath(); ctx.ellipse(800, 424, 14, 4, 0, 0, 7); ctx.fill();
    drawIngredientIcon(ctx, 'sauce', 800, 406, 72, true);
  }
  text(ctx, world.plate.length === 0 ? 'Your plate — build a dish here' : `${world.plate.length} / 3 on the plate`, p.x + p.w / 2, p.y + 158, 14, '#3a2a18', 'center');
  // Serve bell and trash. The bell swells for a beat after every serve.
  const match = world.plate.length > 0 && world.findMatch();
  ctx.save();
  ctx.translate(SERVE_BTN.x + SERVE_BTN.w / 2, SERVE_BTN.y + SERVE_BTN.h / 2);
  const bs = 1 + 0.12 * sq;
  ctx.scale(bs, bs);
  ctx.fillStyle = match ? '#ffd23e' : '#c9a06a'; rr(ctx, -SERVE_BTN.w / 2, -SERVE_BTN.h / 2, SERVE_BTN.w, SERVE_BTN.h, 12); ctx.fill();
  ctx.strokeStyle = '#8a6a42'; ctx.lineWidth = 2; rr(ctx, -SERVE_BTN.w / 2, -SERVE_BTN.h / 2, SERVE_BTN.w, SERVE_BTN.h, 12); ctx.stroke();
  text(ctx, 'SERVE', 0, -9, 22, '#3a2a18', 'center');
  text(ctx, 'S / Space', 0, 17, 12, '#5a3a18', 'center');
  ctx.restore();
  // The trash bin lives under the TODAY'S MENU board now: a proper real bin
  // (ajar lid, tapered ridged body, shadow). Clicking it trashes the plate —
  // the hit region is TRASH_BTN, shared with input.js, so it follows the art.
  const bx = TRASH_BTN.x + TRASH_BTN.w / 2, by = TRASH_BTN.y + 56;
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  ctx.beginPath(); ctx.ellipse(bx, by + 38, 30, 6, 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#8b9499';
  ctx.beginPath(); ctx.moveTo(bx - 28, by - 36); ctx.lineTo(bx + 28, by - 36);
  ctx.lineTo(bx + 22, by + 32); ctx.lineTo(bx - 22, by + 32); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(60,35,15,0.75)'; ctx.lineWidth = 3; ctx.stroke();
  ctx.fillStyle = '#6e787d';
  ctx.beginPath(); ctx.moveTo(bx - 28, by - 36); ctx.lineTo(bx + 28, by - 36);
  ctx.lineTo(bx + 27, by - 28); ctx.lineTo(bx - 27, by - 28); ctx.closePath(); ctx.fill();
  ctx.save();
  ctx.translate(bx - 30, by - 38); ctx.rotate(-0.14);
  ctx.fillStyle = '#6e787d'; rr(ctx, -2, -5, 68, 10, 4); ctx.fill();
  ctx.strokeStyle = 'rgba(60,35,15,0.75)'; ctx.lineWidth = 2.5; ctx.stroke();
  ctx.fillStyle = '#6e787d'; rr(ctx, 28, -11, 12, 7, 3); ctx.fill(); ctx.stroke();
  ctx.restore();
  ctx.strokeStyle = 'rgba(90,99,103,0.85)'; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
  for (const [tx, bxx] of [[-18, -14], [-6, -5], [6, 5], [18, 14]]) {
    ctx.beginPath(); ctx.moveTo(bx + tx, by - 24); ctx.lineTo(bx + bxx, by + 28); ctx.stroke();
  }
  ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(bx - 22, by - 28); ctx.lineTo(bx - 18, by + 26); ctx.stroke();
  text(ctx, 'TRASH (T)', bx, by + 50, 13, '#5a3a18', 'center');
  if (match) text(ctx, `Matches: ${match.recipe.name} — ring the bell!`, 940, 292, 14, '#2f6b28', 'center');
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

function drawParticles(ctx, world) {
  for (const p of world.particles) {
    ctx.globalAlpha = Math.max(0, p.life / p.max);
    ctx.fillStyle = p.color;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, 7); ctx.fill();
  }
  ctx.globalAlpha = 1;
}

/** Draw one frame. `t` is wall-clock seconds, for the steam drift. */
export function render(ctx, world, sound, t) {
  ctx.clearRect(0, 0, VIEW.width, VIEW.height);
  ctx.save();
  // A mistake shakes the whole kitchen for a beat, decaying fast.
  if (world.shake > 0) {
    const m = world.shake * 24;
    ctx.translate((Math.random() * 2 - 1) * m, (Math.random() * 2 - 1) * m);
  }
  drawBackground(ctx, t);
  drawQueue(ctx, world);
  drawOrderBoard(ctx, world, t);
  drawTimer(ctx, world);
  drawScore(ctx, world, sound);
  drawBins(ctx, world, t);
  drawPlateArea(ctx, world);
  drawStools(ctx);
  drawFloaters(ctx, world);
  drawParticles(ctx, world);
  if (world.screen === SCREEN_TITLE) drawTitle(ctx, world);
  else if (world.screen === SCREEN_PAUSE) drawPause(ctx);
  else if (world.screen === SCREEN_OVER) drawOver(ctx, world);
  ctx.restore();
}
