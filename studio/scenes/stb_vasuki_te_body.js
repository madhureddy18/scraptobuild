// Vasuki (Telugu) — flat 2D illustrated reel in the @ithihasa.telugu style: one illustrated card per line, ray backgrounds,
// Telugu title + subtitle at the top, slow push-in, soft cross-fade between cards. Everything is drawn on one 1080x1920 canvas.
window.SCENE = {
  setup: { bg: 0x000000, fog: null, fov: 40, bloom: null },
  lines: window.STB_LINES,
  build(K, T) {
    const L = T.lines, LINES = window.STB_LINES, N = LINES.length, IDX = {}; LINES.forEach((l, i) => { IDX[l.id] = i; });
    const B = n => L[IDX[n]].t, E = n => L[IDX[n]].end, F = (n, f) => B(n) + (E(n) - B(n)) * f;
    const D = E('cta') + 2.0, XF = 0.35;
    const THREE = window.THREE, clamp = K.clamp, lerp = K.lerp, ease = K.ease, eo = K.easeOut, prog = K.prog;
    const tex = K.canvasTex(1080, 1920, () => {}); const hs = new THREE.Scene(), hc = new THREE.OrthographicCamera(-540, 540, 960, -960, -10, 10);
    hs.add(new THREE.Mesh(new THREE.PlaneGeometry(1080, 1920), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false })));
    K.draw = () => { K.renderer.render(hs, hc); };
    let X; const W = 1080, H = 1920, PI = Math.PI, TAU = Math.PI * 2;
    const rng = s => () => (s = (s * 16807) % 2147483647) / 2147483647;

    // ---------------------------------------------------------------- drawing kit
    const bg = (top, mid, bot) => { const g = X.createLinearGradient(0, 0, 0, H); g.addColorStop(0, top); g.addColorStop(0.55, mid); g.addColorStop(1, bot); X.fillStyle = g; X.fillRect(-200, -200, W + 400, H + 400); };
    const rays = (cx, cy, n, len, col, t, spd = 0.04, w = 0.055) => { X.save(); X.translate(cx, cy); X.rotate(t * spd); for (let i = 0; i < n; i++) { X.rotate(TAU / n); const g = X.createLinearGradient(0, 0, 0, -len); g.addColorStop(0, col); g.addColorStop(1, 'rgba(255,220,150,0)'); X.fillStyle = g; X.beginPath(); X.moveTo(0, 0); X.lineTo(-len * w, -len); X.lineTo(len * w, -len); X.closePath(); X.fill(); } X.restore(); };
    const stars = (n, seed, t) => { const r = rng(seed); for (let i = 0; i < n; i++) { const a = 0.25 + 0.6 * Math.abs(Math.sin(t * (0.5 + r()) + i)); X.fillStyle = `rgba(255,255,255,${a})`; X.beginPath(); X.arc(r() * W, r() * 1150, r() * 2.2 + 0.5, 0, TAU); X.fill(); } };
    const glow = (cx, cy, r, col) => { const g = X.createRadialGradient(cx, cy, 0, cx, cy, r); g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)'); X.fillStyle = g; X.beginPath(); X.arc(cx, cy, r, 0, TAU); X.fill(); };
    const ell = (cx, cy, rx, ry, col, rot = 0) => { X.fillStyle = col; X.beginPath(); X.ellipse(cx, cy, rx, ry, rot, 0, TAU); X.fill(); };
    const poly = (pts, col) => { X.fillStyle = col; X.beginPath(); pts.forEach(([a, b], i) => i ? X.lineTo(a, b) : X.moveTo(a, b)); X.closePath(); X.fill(); };
    const milk = (y0, t, col1 = '#fff6e6', col2 = '#e6d4b8') => { const g = X.createLinearGradient(0, y0, 0, H); g.addColorStop(0, col1); g.addColorStop(1, col2); X.fillStyle = g; X.fillRect(-100, y0, W + 200, H - y0 + 200);
      X.strokeStyle = 'rgba(190,165,130,0.45)'; X.lineWidth = 4; for (let i = 0; i < 10; i++) { X.beginPath(); for (let k = -40; k <= W + 40; k += 20) { const yy = y0 + 30 + i * 62 + Math.sin(k * 0.018 + i * 1.3 + t * 1.2) * 7; k > -40 ? X.lineTo(k, yy) : X.moveTo(k, yy); } X.stroke(); } };
    // the churning mountain: flat two-tone cone, snow cap, forest dots
    const mountain = (cx, top, base, halfW) => { poly([[cx, top], [cx - halfW, base], [cx + halfW, base]], '#5d6c4c'); poly([[cx, top], [cx, base], [cx + halfW, base]], '#48563c');
      const h = base - top, sn = h * 0.2; poly([[cx, top], [cx - halfW * sn / h, top + sn], [cx - halfW * sn / h * 0.4, top + sn * 0.86], [cx, top + sn * 1.08], [cx + halfW * sn / h * 0.45, top + sn * 0.84], [cx + halfW * sn / h, top + sn]], '#f2f3fa');
      const r = rng(9); for (let i = 0; i < 26; i++) { const yy = top + h * (0.45 + r() * 0.5), w = halfW * (yy - top) / h, xx = cx + (r() * 2 - 1) * w * 0.85; ell(xx, yy, 14 + r() * 8, 12 + r() * 6, r() < 0.5 ? '#3f6a3a' : '#4d7c42'); } };
    // serpent coils around the mountain; k = how many coils are drawn (fractional), slide = scale scroll
    const coils = (cx, top, base, halfW, n, k, slide, thick = 44) => { const h = base - top, ys = Array.from({ length: n }, (_, i) => top + h * (0.3 + i * 0.62 / Math.max(1, n - 1)));
      const wAt = y => halfW * (y - top) / h + thick * 0.8;
      const draw = (y, front, a) => { const w = wAt(y), ry = Math.max(16, w * 0.17); X.globalAlpha *= a; X.lineCap = 'round'; X.lineWidth = thick; X.strokeStyle = front ? '#2f9a7a' : '#1d6552'; X.beginPath(); X.ellipse(cx, y, w, ry, 0, front ? 0 : PI, front ? PI : TAU); X.stroke();
        if (front) { X.lineWidth = thick * 0.3; X.strokeStyle = '#e8d48a'; X.beginPath(); X.ellipse(cx, y + thick * 0.14, w, ry, 0, 0.18, PI - 0.18); X.stroke(); X.fillStyle = 'rgba(10,50,40,0.45)'; const st = 0.16;
          for (let a2 = 0.22 + ((slide % st) + st) % st; a2 < PI - 0.2; a2 += st) { const px = cx + Math.cos(a2) * w, py = y + Math.sin(a2) * ry - thick * 0.22, s = thick * 0.2; X.beginPath(); X.moveTo(px - s, py); X.lineTo(px, py - s); X.lineTo(px + s, py); X.lineTo(px, py + s); X.closePath(); X.fill(); } }
        X.globalAlpha /= a; };
      ys.forEach((y, i) => { const a = clamp(k - i); if (a > 0) draw(y, false, a); }); ys.forEach((y, i) => { const a = clamp(k - i); if (a > 0) draw(y, true, a); }); return ys; };
    const hood = (cx, cy, s, t, look = 0) => { X.save(); X.translate(cx, cy); X.scale(s, s); X.rotate(Math.sin(t * 0.9) * 0.04);
      ell(0, 0, 112, 150, '#2a8a6c'); ell(0, 14, 104, 140, '#2f9a7a'); ell(0, 24, 58, 104, '#e8d48a'); for (let i = 0; i < 6; i++) ell(0, -50 + i * 28, 6, 6, '#1d6552');
      [[-1], [1]].forEach(([d]) => { ell(d * 70, -10, 20, 34, '#1d6552', d * 0.3); });
      ell(0, -132, 56, 44, '#2f9a7a'); ell(0, -112, 40, 22, '#2a8a6c');
      [-24, 24].forEach(dx => { ell(dx + look * 4, -140, 11, 8, '#ffd257'); ell(dx + look * 5, -140, 3.5, 7.5, '#111'); });
      const fl = Math.max(0, Math.sin(t * 5)) ; if (fl > 0.2) { X.strokeStyle = '#d0103a'; X.lineWidth = 5; X.lineCap = 'round'; X.beginPath(); X.moveTo(0, -96); X.lineTo(0, -96 + 30 * fl); X.lineTo(-8, -86 + 30 * fl); X.moveTo(0, -96 + 30 * fl); X.lineTo(8, -86 + 30 * fl); X.stroke(); }
      poly([[0, -192], [-12, -174], [0, -160], [12, -174]], '#ff3050'); glow(0, -176, 26, 'rgba(255,60,90,0.5)'); X.restore(); };
    // flat Earth disc with continents
    const earth = (cx, cy, r, spin = 0) => { X.save(); X.beginPath(); X.arc(cx, cy, r, 0, TAU); X.clip(); ell(cx, cy, r, r, '#1f5aa8'); const rr = rng(33);
      for (let i = 0; i < 9; i++) { const ox = ((rr() * 2.4 - 1.2) + spin) % 2.4 - 1.2, oy = rr() * 1.4 - 0.7; ell(cx + ox * r, cy + oy * r, r * (0.2 + rr() * 0.25), r * (0.15 + rr() * 0.2), rr() < 0.6 ? '#3f8a3a' : '#9a8a4a', rr()); }
      ell(cx, cy - r * 0.95, r * 0.6, r * 0.15, '#f2f6ff'); ell(cx, cy + r * 0.95, r * 0.6, r * 0.15, '#f2f6ff');
      const sh = X.createLinearGradient(cx - r, cy, cx + r, cy); sh.addColorStop(0, 'rgba(255,255,255,0.18)'); sh.addColorStop(0.6, 'rgba(0,0,0,0)'); sh.addColorStop(1, 'rgba(0,0,30,0.45)'); X.fillStyle = sh; X.fillRect(cx - r, cy - r, 2 * r, 2 * r); X.restore();
      X.strokeStyle = 'rgba(120,180,255,0.6)'; X.lineWidth = 4; X.beginPath(); X.arc(cx, cy, r + 2, 0, TAU); X.stroke(); };
    // flat standing figure (devas: gold crown, warm skin; asuras: dark, horned crown)
    const figure = (cx, by, s, kind, lean = 0, t = 0) => { X.save(); X.translate(cx, by); X.scale(s, s); X.rotate(lean);
      const deva = kind === 'deva', SK = deva ? '#e8b07a' : '#5a4560', SK2 = deva ? '#d49a66' : '#4a3850', CL = deva ? '#f0b020' : '#8a1a2a';
      X.fillStyle = SK2; X.fillRect(-22, -110, 16, 110); X.fillRect(6, -110, 16, 110); poly([[-34, -210], [34, -210], [42, -110], [-42, -110]], CL);
      poly([[-36, -330], [36, -330], [30, -210], [-30, -210]], SK); poly([[0, -330], [36, -330], [30, -210], [0, -210]], SK2);
      X.strokeStyle = SK; X.lineWidth = 20; X.lineCap = 'round'; X.beginPath(); X.moveTo(-32, -320); X.lineTo(-70, -270); X.lineTo(-100, -280); X.moveTo(32, -320); X.lineTo(-10, -270); X.lineTo(-70, -276); X.stroke();
      X.fillStyle = SK2; X.fillRect(-12, -352, 24, 26); ell(0, -386, 34, 40, SK);
      if (deva) { poly([[-30, -414], [30, -414], [22, -470], [0, -500], [-22, -470]], '#ffcf4a'); ell(0, -430, 6, 6, '#d01030'); }
      else { poly([[-32, -410], [32, -410], [26, -436], [-26, -436]], '#3a1020'); poly([[-30, -430], [-48, -478], [-16, -436]], '#d8d0c0'); poly([[30, -430], [48, -478], [16, -436]], '#d8d0c0'); }
      ell(-12, -388, 5, 4, '#111'); ell(12, -388, 5, 4, '#111'); X.restore(); };
    const kalash = (cx, cy, s, t) => { X.save(); X.translate(cx, cy); X.scale(s, s); glow(0, -40, 230, 'rgba(255,215,120,0.55)');
      ell(0, 30, 120, 110, '#e0a83a'); ell(-30, 10, 40, 70, 'rgba(255,240,180,0.45)'); poly([[-60, -70], [60, -70], [44, -40], [-44, -40]], '#c8902a'); ell(0, -74, 76, 18, '#f0c050');
      poly([[-24, -92], [24, -92], [30, -74], [-30, -74]], '#d89a30'); ell(0, -120, 34, 34, '#fff0b0'); glow(0, -120, 90 + 10 * Math.sin(t * 3), 'rgba(255,250,200,0.8)');
      X.strokeStyle = '#a06a1a'; X.lineWidth = 6; X.beginPath(); X.ellipse(0, 20, 118, 18, 0, 0, PI); X.stroke(); X.restore(); };
    const tortoise = (cx, cy, s) => { X.save(); X.translate(cx, cy); X.scale(s, s); ell(-250, 20, 70, 26, '#6a8a5a', -0.4); ell(250, 20, 70, 26, '#6a8a5a', 0.4); ell(-200, 90, 60, 22, '#6a8a5a', 0.4); ell(200, 90, 60, 22, '#6a8a5a', -0.4);
      ell(0, -10, 80, 55, '#7a9a6a'); ell(-24, -24, 8, 8, '#111'); ell(24, -24, 8, 8, '#111');   // head (front-facing, behind shell)
      X.save(); X.beginPath(); X.ellipse(0, 70, 260, 130, 0, PI, TAU); X.closePath(); X.clip(); ell(0, 70, 260, 130, '#4a6a3a');
      X.strokeStyle = '#2f4426'; X.lineWidth = 8; for (let j = 0; j < 4; j++) for (let i = -4; i <= 4; i++) { const hx = i * 70 + (j % 2) * 35, hy = 30 - j * 40; X.beginPath(); for (let k = 0; k < 6; k++) { const a = k / 6 * TAU + PI / 6; k ? X.lineTo(hx + Math.cos(a) * 36, hy + Math.sin(a) * 30) : X.moveTo(hx + Math.cos(a) * 36, hy + Math.sin(a) * 30); } X.closePath(); X.stroke(); } X.restore();
      X.fillStyle = '#8a9a6a'; X.fillRect(-262, 62, 524, 18); X.restore(); };
    const shiva = (cx, cy, s, drink, blue, t) => { X.save(); X.translate(cx, cy); X.scale(s, s); const SK = '#6f8fd0', SKD = '#5a78b8';
      // trident
      X.strokeStyle = '#d8b04a'; X.lineWidth = 12; X.beginPath(); X.moveTo(260, -340); X.lineTo(260, 700); X.stroke(); poly([[260, -430], [248, -340], [272, -340]], '#e8c050');
      X.lineWidth = 11; X.beginPath(); X.moveTo(200, -400); X.quadraticCurveTo(200, -330, 260, -318); X.moveTo(320, -400); X.quadraticCurveTo(320, -330, 260, -318); X.stroke(); X.lineWidth = 6; X.beginPath(); X.moveTo(230, -300); X.lineTo(290, -300); X.stroke();
      // legs + tiger skin
      X.fillStyle = SKD; X.fillRect(-70, 420, 50, 280); X.fillRect(20, 420, 50, 280); poly([[-110, 230], [110, 230], [140, 460], [-140, 460]], '#e0a040');
      for (let i = 0; i < 10; i++) ell(-110 + i * 24, 290 + (i % 3) * 50, 7, 22, '#3a2210', 0.3);
      // torso with shading + sacred thread
      X.fillStyle = SK; X.beginPath(); X.moveTo(-100, -60); X.quadraticCurveTo(0, -90, 100, -60); X.quadraticCurveTo(110, 100, 85, 240); X.lineTo(-85, 240); X.quadraticCurveTo(-110, 100, -100, -60); X.fill();
      X.fillStyle = SKD; X.beginPath(); X.moveTo(0, -78); X.quadraticCurveTo(60, -78, 100, -60); X.quadraticCurveTo(110, 100, 85, 240); X.lineTo(0, 240); X.closePath(); X.fill();
      X.strokeStyle = '#f4f0e0'; X.lineWidth = 5; X.beginPath(); X.moveTo(-70, -50); X.quadraticCurveTo(10, 90, 80, 220); X.stroke();
      // arms: left resting, right raising the cup
      X.strokeStyle = SK; X.lineCap = 'round'; X.lineWidth = 54; X.beginPath(); X.moveTo(-100, -30); X.lineTo(-140, 140); X.lineTo(-105, 250); X.stroke();
      const ex = lerp(150, 70, drink), ey = lerp(140, 20, drink), hx = lerp(150, 30, drink), hy = lerp(250, -150, drink);
      X.strokeStyle = SKD; X.beginPath(); X.moveTo(100, -30); X.lineTo(ex, ey); X.lineTo(hx, hy); X.stroke();
      poly([[hx - 30, hy - 30], [hx + 30, hy - 30], [hx + 20, hy + 5], [hx - 20, hy + 5]], '#c89a3a'); if (drink < 0.95) ell(hx, hy - 30, 28, 7, '#3fae4a');
      // rudraksha + serpent necklace
      for (let i = 0; i < 22; i++) { const a = 0.2 + i * 0.125; ell(Math.cos(a) * 95, -70 + Math.sin(a) * 120, 8, 8, '#6a3a20'); }
      X.strokeStyle = '#2f9a7a'; X.lineWidth = 22; X.beginPath(); X.ellipse(0, -82, 92, 38, 0, 0, PI); X.stroke(); ell(86, -130, 28, 36, '#2f9a7a', 0.3); ell(89, -138, 5, 5, '#ffd257');
      // throat turning blue
      if (blue > 0) { X.globalAlpha *= blue; glow(0, -118, 80, 'rgba(60,120,255,0.95)'); ell(0, -118, 30, 22, '#2f5cd8'); X.globalAlpha /= blue; }
      // neck + head
      X.fillStyle = SKD; X.fillRect(-30, -175, 60, 70); ell(0, -250, 92, 112, SK); X.fillStyle = SKD; X.beginPath(); X.ellipse(0, -250, 92, 112, 0, -PI / 2, PI / 2); X.fill();
      ell(0, -330, 100, 62, '#1a1424'); X.fillStyle = '#1a1424'; X.fillRect(-100, -340, 200, 30); ell(0, -425, 62, 72, '#1a1424'); X.fillRect(-100, -340, 22, 220); X.fillRect(78, -340, 22, 220);
      X.strokeStyle = '#d8b04a'; X.lineWidth = 8; X.beginPath(); X.ellipse(0, -375, 60, 14, 0, 0, PI); X.stroke();
      X.fillStyle = '#f4f4ff'; X.beginPath(); X.arc(35, -470, 30, 0.6, 3.8); X.arc(48, -478, 26, 3.8, 0.6, true); X.fill();
      // Ganga stream from the hair
      X.strokeStyle = 'rgba(160,210,255,0.8)'; X.lineWidth = 6; X.beginPath(); for (let k = 0; k < 40; k++) { const yy = -480 - k * 6, xx = -40 + Math.sin(k * 0.5 + t * 3) * 8; k ? X.lineTo(xx, yy) : X.moveTo(xx, yy); } X.stroke();
      // face
      [-36, 36].forEach(dx => { ell(dx, -245, 24, 12, '#fff'); ell(dx, -244, 9, 9, '#1a1010'); }); X.strokeStyle = '#1a1424'; X.lineWidth = 6;
      [-36, 36].forEach(dx => { X.beginPath(); X.moveTo(dx - 28, -270); X.quadraticCurveTo(dx, -282, dx + 28, -270); X.stroke(); });
      X.fillStyle = '#f4f0e0'; for (let i = 0; i < 3; i++) X.fillRect(-40, -312 + i * 10, 80, 5); ell(0, -300, 7, 13, '#d0103a');
      X.strokeStyle = '#3a3a6a'; X.lineWidth = 5; X.beginPath(); X.moveTo(0, -235); X.lineTo(-8, -200); X.lineTo(4, -198); X.stroke(); X.strokeStyle = '#8a3a4a'; X.lineWidth = 6; X.beginPath(); X.moveTo(-22, -172); X.quadraticCurveTo(0, -164, 22, -172); X.stroke(); X.restore(); };
    const hill = (cx, by, s, t) => { X.save(); X.translate(cx, by); X.scale(s, s);
      X.fillStyle = '#9a968e'; X.beginPath(); X.moveTo(-380, 0); X.bezierCurveTo(-360, -340, -120, -470, 0, -470); X.bezierCurveTo(140, -470, 360, -330, 380, 0); X.closePath(); X.fill();
      X.fillStyle = '#827e78'; X.beginPath(); X.moveTo(0, -470); X.bezierCurveTo(140, -470, 360, -330, 380, 0); X.lineTo(0, 0); X.closePath(); X.fill();
      const r = rng(51); for (let i = 0; i < 40; i++) { const xx = (r() * 2 - 1) * 330, yy = -r() * 380 * (1 - Math.abs(xx) / 400); ell(xx, yy, 10 + r() * 18, 6 + r() * 10, r() < 0.5 ? 'rgba(70,66,62,0.35)' : 'rgba(80,110,60,0.5)'); }
      X.strokeStyle = '#4a4440'; X.lineWidth = 9; X.lineCap = 'round'; for (let k = 0; k < 3; k++) { X.beginPath(); for (let i = 0; i <= 40; i++) { const u = i / 40, yy = -90 - k * 110 - u * 60, half = 370 * Math.sqrt(Math.max(0, 1 - Math.pow((-yy) / 480, 2))), xx = lerp(-half, half, u); i ? X.lineTo(xx, yy + Math.sin(u * PI) * 26) : X.moveTo(xx, yy); } X.stroke(); }
      poly([[-28, -470], [28, -470], [28, -520], [-28, -520]], '#f4efe6'); poly([[-34, -520], [34, -520], [0, -600]], '#f4efe6'); ell(0, -606, 8, 8, '#e8b030');
      X.restore(); };
    const tree = (cx, by, s) => { X.fillStyle = '#5a3a22'; X.fillRect(cx - 5 * s, by - 40 * s, 10 * s, 40 * s); ell(cx, by - 60 * s, 34 * s, 30 * s, '#3f7a32'); ell(cx - 14 * s, by - 72 * s, 22 * s, 20 * s, '#4f8a3a'); };

    // ---------------------------------------------------------------- one card per line
    const C = {
      hook: (t, u) => { bg('#1a0f3a', '#4a2a6a', '#f0a060'); stars(160, 7, t); rays(540, 1240, 36, 1500, 'rgba(255,200,120,0.18)', t); milk(1300, t);
        mountain(540, 330, 1330, 240); coils(540, 330, 1330, 240, 5, 5, -t * 0.4); hood(900, 640, 0.95, t, -1);
        X.lineWidth = 40; X.strokeStyle = '#2f9a7a'; X.lineCap = 'round'; X.beginPath(); X.moveTo(300, 1230); X.quadraticCurveTo(140, 1270, -60, 1300); X.stroke(); X.beginPath(); X.moveTo(780, 650); X.quadraticCurveTo(880, 700, 905, 760); X.stroke();
        for (let i = 0; i < 3; i++) earth(120, 1050 - i * 64, 30, t * 0.05); },
      intro: (t, u) => { bg('#140a2e', '#3a1a5a', '#8a3a6a'); stars(120, 3, t); rays(540, 820, 40, 1500, 'rgba(120,255,200,0.14)', t); glow(540, 820, 520, 'rgba(60,200,150,0.25)');
        X.lineWidth = 120; X.strokeStyle = '#2f9a7a'; X.lineCap = 'round'; X.beginPath(); X.moveTo(540, 1900); X.bezierCurveTo(300, 1600, 800, 1350, 540, 1050); X.stroke(); X.lineWidth = 40; X.strokeStyle = '#e8d48a'; X.beginPath(); X.moveTo(560, 1900); X.bezierCurveTo(320, 1600, 820, 1350, 560, 1050); X.stroke();
        hood(540, 860, 2.0, t, Math.sin(t * 0.7)); },
      amrit: (t, u) => { bg('#2b3a8a', '#8a7ad0', '#ffd8a8'); rays(540, 1100, 30, 1400, 'rgba(255,240,180,0.25)', t); milk(1060, t);
        const rise = eo(clamp(u * 1.6)); kalash(540, lerp(1500, 1010, rise), 1.5, t);
        for (let i = 0; i < 3; i++) { figure(110 + i * 60, 1180, 0.38, 'deva', 0, t); figure(970 - i * 60, 1180, 0.38, 'asura', 0, t); } },
      churn: (t, u) => { bg('#1f2a6a', '#6a5ab0', '#ffc898'); rays(540, 1250, 32, 1500, 'rgba(255,220,160,0.18)', t); const dn = eo(clamp(u * 2.2)); X.save(); X.translate(0, lerp(-900, 0, dn)); mountain(540, 330, 1330, 240); X.restore();
        milk(1300, t); if (dn > 0.98) { coils(540, 330, 1330, 240, 5, clamp((u - 0.45) * 2) * 5, -t * 0.2); }
        const sp = clamp((u - 0.45) * 3); if (sp > 0) { X.globalAlpha *= sp; hood(880, 600, 0.8, t, -1); X.globalAlpha /= sp; } },
      pull: (t, u) => { bg('#2a1f5a', '#7a5aa0', '#ffbe8a'); rays(540, 1250, 32, 1500, 'rgba(255,220,160,0.18)', t); milk(1300, t); const wob = Math.sin(t * 2.4) * 6;
        X.save(); X.translate(540, 1330); X.rotate(wob * 0.002); X.translate(-540, -1330); mountain(540, 380, 1330, 220); coils(540, 380, 1330, 220, 5, 5, t * 0.9); X.restore();
        X.lineWidth = 34; X.strokeStyle = '#2f9a7a'; X.lineCap = 'round'; const pl = Math.sin(t * 2.4) * 18; X.beginPath(); X.moveTo(330, 1180); X.quadraticCurveTo(180, 1250, -20 + pl, 1260); X.stroke(); X.beginPath(); X.moveTo(750, 700); X.quadraticCurveTo(940, 900, 1100 + pl, 1240); X.stroke();
        for (let i = 0; i < 4; i++) { figure(60 + i * 70 + pl, 1420, 0.42, 'deva', -0.25, t); figure(1020 - i * 70 + pl, 1420, 0.42, 'asura', 0.25, t); } },
      height: (t, u) => { bg('#0f2a5a', '#3a6ab0', '#bfe0ff'); rays(540, 1600, 30, 1600, 'rgba(255,255,255,0.12)', t);
        const pan = ease(u); X.save(); X.translate(0, lerp(-200, 900, pan)); mountain(540, -1400, 1600, 320);
        for (let i = 0; i < 9; i++) { const cy = -1200 + i * 300, cx = (i % 2 ? 200 : 880) + Math.sin(t * 0.3 + i) * 30; ell(cx, cy, 150, 46, 'rgba(255,255,255,0.85)'); ell(cx + 60, cy - 24, 90, 40, 'rgba(255,255,255,0.85)'); } X.restore();
        X.strokeStyle = '#ffd257'; X.lineWidth = 8; X.beginPath(); X.moveTo(120, 1250); X.lineTo(120, 1250 - 900 * eo(clamp(u * 1.3))); X.stroke(); for (let i = 0; i <= 9; i++) if (i / 9 <= eo(clamp(u * 1.3))) { X.beginPath(); X.moveTo(100, 1250 - i * 100); X.lineTo(150, 1250 - i * 100); X.stroke(); }
        X.font = '700 84px "Poppins"'; X.textAlign = 'left'; X.fillStyle = '#fff'; X.shadowColor = 'rgba(0,0,0,0.6)'; X.shadowBlur = 16; X.fillText(Math.round(11000 * eo(clamp(u * 1.3))).toLocaleString('en-IN'), 180, 380 + 520); X.shadowBlur = 0; },
      earths: (t, u) => { bg('#000006', '#04071e', '#0c1238'); stars(320, 11, t); glow(540, 900, 700, 'rgba(80,110,255,0.12)');
        mountain(420, 260, 1330, 70); coils(420, 260, 1330, 70, 9, 9, -t * 0.3, 18); const n = 1 + 10 * clamp((u - 0.1) / 0.75), R = 48;
        for (let i = 0; i < 11; i++) { const k = clamp(n - i); if (k <= 0) continue; const s = K.easeBack(k); earth(640, 1330 - R - i * 2 * R * 1.0, R * s, t * 0.05 + i); }
        X.font = '700 72px "Poppins"'; X.textAlign = 'center'; X.fillStyle = '#ffd257'; X.fillText('× ' + Math.floor(n), 820, 760); },
      kurma: (t, u) => { bg('#cfe6f0', '#9cc4d8', '#3a6a88'); rays(540, -100, 26, 1900, 'rgba(255,255,255,0.22)', t, 0.01, 0.04);
        const sink = eo(clamp(u * 2)), rise = eo(clamp((u - 0.35) * 2.2));
        X.save(); X.translate(0, lerp(-300, 0, sink) - rise * 80); poly([[540, -400], [300, 1180], [780, 1180]], '#5d6c4c'); poly([[540, -400], [540, 1180], [780, 1180]], '#48563c'); X.restore();
        tortoise(540, lerp(1900, 1250, rise), 1.35); const r = rng(5); for (let i = 0; i < 40; i++) { const bx = r() * W, by = H - ((t * (40 + r() * 60) + r() * H) % H); ell(bx, by, 6, 6, 'rgba(255,255,255,0.6)'); } },
      coil: (t, u) => { bg('#000006', '#04071e', '#101848'); stars(260, 13, t); const pan = ease(u); X.save(); X.translate(0, lerp(0, 1400, pan)); mountain(540, -1500, 1500, 240); coils(540, -1500, 1500, 240, 14, 14, -t * 0.5, 46); X.restore(); },
      equator: (t, u) => { bg('#000006', '#04071e', '#0c1238'); stars(300, 17, t); const k1 = eo(clamp((u - 0.15) * 3)), k2 = eo(clamp((u - 0.55) * 3));
        mountain(300, 300, 1360, 230); earth(780, 840, 220, t * 0.05);
        X.strokeStyle = `rgba(255,210,90,${k1})`; X.lineWidth = 18; X.beginPath(); X.ellipse(300, 1000, 220, 40, 0, 0, TAU); X.stroke(); glow(300, 1000, 260 * k1, 'rgba(255,200,80,0.15)');
        X.strokeStyle = `rgba(255,210,90,${k2})`; X.beginPath(); X.ellipse(780, 840, 222, 40, 0, 0, TAU); X.stroke(); glow(780, 840, 280 * k2, 'rgba(255,200,80,0.15)');
        X.font = '700 64px "Poppins"'; X.textAlign = 'center'; X.fillStyle = `rgba(255,255,255,${k2})`; X.fillText('= 40,000 km', 540, 1220); },
      poison: (t, u) => { const k = eo(clamp(u * 2.2)); bg('#120a1e', '#2a1a3a', '#4a3a5a'); rays(540, 700, 40, 1500, `rgba(120,255,140,${0.08 + 0.06 * k})`, t);
        const r = rng(19); for (let i = 0; i < 26; i++) { const a = r() * TAU, d = r() * 520 * k, cy = 1400 - ((t * (30 + r() * 30) + r() * 600) % 900); ell(540 + Math.cos(a) * d, cy, 90 * k + 30, 60 * k + 20, `rgba(${60 + r() * 30},${30 + r() * 40},${70 + r() * 40},0.35)`); }
        milk(1500, t, '#3a2a48', '#1a1028'); shiva(540, 1060, 0.95, eo(clamp((u - 0.3) * 3)), clamp((u - 0.62) * 3), t); },
      real: (t, u) => { bg('#2a64d6', '#8cc4ff', '#eaf4ff'); rays(540, 600, 24, 1300, 'rgba(255,255,255,0.18)', t, 0.01);
        X.fillStyle = '#6f9a46'; X.fillRect(-100, 1180, W + 200, H); X.fillStyle = '#5f8a3a'; X.beginPath(); X.moveTo(-100, 1180); for (let k = -100; k <= W + 100; k += 60) X.lineTo(k, 1180 - 30 - Math.sin(k * 0.01) * 20); X.lineTo(W + 100, 1180); X.closePath(); X.fill();
        hill(540, 1190, 1.15, t); ell(860, 1290, 160, 40, '#4a7aa8'); for (let i = 0; i < 7; i++) tree(60 + i * 160 + (i % 2) * 40, 1300 + (i % 3) * 40, 1.3); },
      cta: (t, u) => { bg('#2a0a14', '#5a1a24', '#8a3a2a'); rays(540, 760, 40, 1600, 'rgba(255,200,120,0.22)', t); glow(540, 760, 460, 'rgba(255,180,90,0.35)');
        mountain(540, 520, 1060, 120); coils(540, 520, 1060, 120, 4, 4, -t * 0.4, 26); hood(690, 640, 0.42, t, -1);
        const fa = B('cta') + 0.5, gt = T.__t; if (gt > fa) { const k = K.easeBack(prog(gt, fa, fa + 0.35)), press = K.pulse(gt, fa + 1.1, 0.3), done = gt > fa + 1.25, w = 520 - press * 24;
          X.save(); X.translate(540, 1660); X.scale(k, k); X.translate(-540, -1660); X.fillStyle = done ? '#262a3a' : '#ff3b5c'; K.rrect(X, 540 - w / 2, 1605, w, 110, 55); X.fill(); X.font = '700 54px "Poppins"'; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillStyle = '#fff'; X.fillText(done ? 'FOLLOWING ✓' : '+ FOLLOW', 540, 1662); X.textBaseline = 'alphabetic';
          const hp = eo(prog(gt, fa + 0.35, fa + 1.05)), hx = 760 - hp * 200, hy = 1810 - hp * 130; X.fillStyle = 'rgba(255,255,255,0.95)'; X.strokeStyle = '#111'; X.lineWidth = 5; X.beginPath(); X.arc(hx, hy, 30 - press * 6, 0, TAU); X.fill(); X.stroke(); X.restore(); } },
    };
    const titleOf = i => { const l = LINES[i]; const sh = X.createLinearGradient(0, 0, 0, 380); sh.addColorStop(0, 'rgba(8,4,20,0.7)'); sh.addColorStop(0.7, 'rgba(8,4,20,0.35)'); sh.addColorStop(1, 'rgba(8,4,20,0)'); X.fillStyle = sh; X.fillRect(0, 0, W, 380); X.textAlign = 'center'; X.shadowColor = 'rgba(255,170,50,0.85)'; X.shadowBlur = 26; X.fillStyle = '#ffd257'; X.font = '700 92px "Noto Sans Telugu"'; X.fillText(l.title, 540, 200);
      X.shadowBlur = 12; X.font = '600 46px "Noto Sans Telugu"'; X.fillStyle = '#ffe6a8'; X.fillText(l.sub, 540, 278); X.shadowBlur = 0; };
    const card = (i, t, alpha) => { const l = L[i], a = l.t - XF, b = i + 1 < N ? L[i + 1].t : D, u = prog(t, a, b), id = LINES[i].id;
      X.save(); X.globalAlpha = alpha; const z = 1 + 0.07 * ease(u); X.translate(540, 960); X.scale(z, z); X.translate(-540, -960); C[id](t, u); X.restore();
      X.save(); X.globalAlpha = alpha; titleOf(i); X.restore(); };
    const update = t => { T.__t = t; tex.redraw((x) => { X = x; X.globalAlpha = 1; X.fillStyle = '#000'; X.fillRect(0, 0, W, H);
      let i = 0; for (let k = 0; k < N; k++) if (t >= L[k].t - XF) i = k;
      const st = L[i].t - XF; if (i > 0 && t < st + XF * 2) { card(i - 1, t, 1); card(i, t, ease(prog(t, st, st + XF * 2))); } else card(i, t, 1);
      const vg = X.createRadialGradient(540, 900, 600, 540, 960, 1150); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.35)'); X.fillStyle = vg; X.fillRect(0, 0, W, H); }); };
    const sfx = [['bass', 0.1, 0.6], ...LINES.slice(1).map(l => ['whoosh', B(l.id) - 0.3, 0.35]), ['chime', B('amrit') + 0.6, 0.5], ['thud', F('churn', 0.45), 0.7],
      ...Array.from({ length: 10 }, (_, k) => ['tick', F('earths', 0.1) + (k + 1) * (E('earths') - F('earths', 0.1)) * 0.75 / 10, 0.35]), ['bass', F('kurma', 0.4), 0.7], ['ding', F('equator', 0.6), 0.5], ['bass', B('poison') + 0.2, 0.6], ['chime', F('poison', 0.65), 0.5], ['pop', B('cta') + 0.5, 0.5], ['ding', B('cta') + 1.6, 0.55]];
    return { duration: D, update, shots: [{ t: [0, 1], from: { pos: [0, 0, 1], look: [0, 0, 0] } }], sfx, watermark: false, endCard: false, music: {}, capFont: 'Fredoka Light', capMarginV: 520, capSize: 62 };
  },
};
