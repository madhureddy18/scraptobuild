// Karna's chariot wheel (Telugu) — 2D puppet animation in the style of Maddy's own Vali reel: jointed flat-shaded characters
// acting in painted scenes (forest light rays, tree, seashore at dusk, Kurukshetra sunset), camera moves, soft cross-fades.
// No captions, no watermark. Everything is drawn on one 1080x1920 canvas.
window.SCENE = {
  setup: { bg: 0x000000, fog: null, fov: 40, bloom: null },
  lines: window.STB_LINES,
  build(K, T) {
    const L = T.lines, LINES = window.STB_LINES, N = LINES.length, IDX = {}; LINES.forEach((l, i) => { IDX[l.id] = i; });
    const B = n => L[IDX[n]].t, E = n => L[IDX[n]].end, F = (n, f) => B(n) + (E(n) - B(n)) * f;
    const D = E('cta') + 2.2, XF = 0.3;
    const THREE = window.THREE, clamp = K.clamp, lerp = K.lerp, ease = K.ease, eo = K.easeOut, prog = K.prog;
    const tex = K.canvasTex(1080, 1920, () => {}); const hs = new THREE.Scene(), hc = new THREE.OrthographicCamera(-540, 540, 960, -960, -10, 10);
    hs.add(new THREE.Mesh(new THREE.PlaneGeometry(1080, 1920), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false })));
    K.draw = () => { K.renderer.render(hs, hc); };
    let X; const W = 1080, H = 1920, PI = Math.PI, TAU = Math.PI * 2;
    const rng = s => () => (s = (s * 16807) % 2147483647) / 2147483647;
    const sm = (a, b, u) => lerp(a, b, ease(clamp(u)));          // smooth tween
    const wig = (t, f = 1, a = 1) => Math.sin(t * f) * a;

    // ================================================================ painting kit
    const grad = (y0, y1, stops) => { const g = X.createLinearGradient(0, y0, 0, y1); stops.forEach(([o, c]) => g.addColorStop(o, c)); return g; };
    const sky = stops => { X.fillStyle = grad(0, H, stops); X.fillRect(-600, -600, W + 1200, H + 1200); };
    const glow = (cx, cy, r, col) => { const g = X.createRadialGradient(cx, cy, 0, cx, cy, r); g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)'); X.fillStyle = g; X.beginPath(); X.arc(cx, cy, r, 0, TAU); X.fill(); };
    const ell = (cx, cy, rx, ry, col, rot = 0) => { X.fillStyle = col; X.beginPath(); X.ellipse(cx, cy, Math.abs(rx), Math.abs(ry), rot, 0, TAU); X.fill(); };
    const poly = (pts, col) => { X.fillStyle = col; X.beginPath(); pts.forEach(([a, b], i) => i ? X.lineTo(a, b) : X.moveTo(a, b)); X.closePath(); X.fill(); };
    const seg = (x1, y1, x2, y2, w, col) => { X.strokeStyle = col; X.lineWidth = w; X.lineCap = 'round'; X.beginPath(); X.moveTo(x1, y1); X.lineTo(x2, y2); X.stroke(); };
    // diagonal god rays from the top-left, like the forest shots in the Vali reel
    const godRays = (t, col = 'rgba(255,255,240,0.16)', n = 7, x0 = 80) => { X.save(); X.globalCompositeOperation = 'lighter'; const r = rng(77);
      for (let i = 0; i < n; i++) { const x = x0 + i * 150 + r() * 60, w = 40 + r() * 70, a = 0.5 + 0.5 * Math.sin(t * 0.6 + i * 1.7); const g = X.createLinearGradient(x, -100, x + 500, 1500);
        g.addColorStop(0, col.replace(/[\d.]+\)$/, (0.16 * a + 0.05).toFixed(3) + ')')); g.addColorStop(1, 'rgba(255,255,240,0)'); X.fillStyle = g; X.beginPath(); X.moveTo(x, -100); X.lineTo(x + w, -100); X.lineTo(x + w + 520, 1600); X.lineTo(x + 520, 1600); X.closePath(); X.fill(); } X.restore(); };
    const motes = (t, n, seed, col, area = [0, 0, W, H], spd = 20) => { const r = rng(seed); for (let i = 0; i < n; i++) { const x = area[0] + ((r() * area[2] + wig(t + i, 0.4, 30)) % area[2]), y = area[1] + ((r() * area[3] - t * spd * (0.5 + r())) % area[3] + area[3]) % area[3]; ell(x, y, 2 + r() * 3, 2 + r() * 3, col); } };
    const leaves = (t, n, seed) => { const r = rng(seed); for (let i = 0; i < n; i++) { const sp = 60 + r() * 60, y = ((r() * 2200 + t * sp) % 2200) - 200, x = (r() * W + wig(t * 1.3 + i, 1, 60) + t * 20) % W, a = t * (1 + r()) + i;
      X.save(); X.translate(x, y); X.rotate(a); ell(0, 0, 16, 7, r() < 0.5 ? '#4f9a46' : '#6fb25a'); X.restore(); } };
    const treeBlobs = (y, n, rr, cols, seed, sway, t) => { const r = rng(seed); for (let i = 0; i < n; i++) { const x = -60 + i * (W + 120) / (n - 1) + r() * 40, s = rr * (0.8 + r() * 0.5);
      ell(x + wig(t + i, 0.5, sway), y - s * 0.4, s, s * 1.1, cols[0]); ell(x - s * 0.3 + wig(t + i, 0.5, sway), y - s * 0.7, s * 0.7, s * 0.8, cols[1]); X.fillStyle = cols[2]; X.fillRect(x - 10, y, 20, 160); } };
    const grass = (y0, t, top, bot, tuft) => { X.fillStyle = grad(y0, H, [[0, top], [1, bot]]); X.fillRect(-300, y0, W + 600, H - y0 + 600); const r = rng(5);
      X.strokeStyle = tuft; X.lineWidth = 3; for (let i = 0; i < 220; i++) { const x = r() * (W + 200) - 100, y = y0 + 20 + r() * (H - y0), h = 10 + r() * 22; X.beginPath(); X.moveTo(x, y); X.quadraticCurveTo(x + 4 + wig(t + i, 1.3, 3), y - h * 0.6, x + 2 + wig(t + i, 1.3, 5), y - h); X.stroke(); } };
    const forest = (t, warm = 0) => { sky([[0, warm ? '#f6e6b8' : '#eef6ee'], [0.5, warm ? '#c8d8a0' : '#cfe4cc'], [1, '#8fb58a']]);
      treeBlobs(1080, 8, 120, ['#a9c9a2', '#b9d6b0', '#9ab894'], 3, 4, t); treeBlobs(1160, 7, 150, ['#7aa874', '#8bb882', '#6a8f62'], 9, 6, t);
      godRays(t); grass(1180, t, '#6c9a54', '#3e6a34', 'rgba(40,80,30,0.5)'); };
    const trunk = (x, w, col = '#3a2a22', col2 = '#22180f') => { X.fillStyle = col; X.beginPath(); X.moveTo(x - w / 2, -200); X.quadraticCurveTo(x - w * 0.42, 900, x - w * 0.9, 1560); X.lineTo(x + w * 0.9, 1560); X.quadraticCurveTo(x + w * 0.42, 900, x + w / 2, -200); X.closePath(); X.fill();
      X.strokeStyle = col2; X.lineWidth = 6; for (let i = -2; i <= 2; i++) { X.beginPath(); X.moveTo(x + i * w * 0.16, -200); X.quadraticCurveTo(x + i * w * 0.2, 800, x + i * w * 0.4, 1560); X.stroke(); } };
    const sunset = (t, sunY = 980, red = 0) => { sky([[0, red ? '#2a0812' : '#3a1a4a'], [0.35, red ? '#8a1a1a' : '#b8405a'], [0.62, red ? '#e0502a' : '#f08a4a'], [1, '#ffcf7a']]);
      glow(540, sunY, 520, 'rgba(255,190,110,0.55)'); ell(540, sunY, 120, 120, '#ffe2a0'); glow(540, sunY, 180, 'rgba(255,240,200,0.8)');
      const r = rng(21); for (let i = 0; i < 6; i++) { const y = 300 + i * 120 + r() * 40, x = ((r() * W + t * (8 + i * 3)) % (W + 600)) - 300; ell(x, y, 220 + r() * 120, 26 + r() * 10, `rgba(${red ? '90,20,30' : '120,40,80'},0.45)`); } };
    const hills = (y, col, amp, seed) => { const r = rng(seed); X.fillStyle = col; X.beginPath(); X.moveTo(-300, H + 300); X.lineTo(-300, y); for (let x = -300; x <= W + 300; x += 60) X.lineTo(x, y - amp * (0.5 + 0.5 * Math.sin(x * 0.006 + seed)) - r() * amp * 0.2); X.lineTo(W + 300, H + 300); X.closePath(); X.fill(); };
    const army = (y, col, t, seed, n = 46) => { const r = rng(seed); X.fillStyle = col; X.strokeStyle = col; for (let i = 0; i < n; i++) { const x = -40 + i * (W + 80) / n + r() * 10, h = 40 + r() * 26; X.fillRect(x - 5, y - h, 10, h); ell(x, y - h - 8, 8, 9, col); X.lineWidth = 2; X.beginPath(); X.moveTo(x + 6, y - h - 60 - r() * 30); X.lineTo(x + 6, y); X.stroke();
      if (r() < 0.18) { X.beginPath(); X.moveTo(x + 6, y - h - 90); X.lineTo(x + 36 + wig(t * 3 + i, 1, 4), y - h - 80); X.lineTo(x + 6, y - h - 70); X.fill(); } } };
    const dust = (t, a, seed = 4) => { const r = rng(seed); for (let i = 0; i < 14; i++) { const x = ((r() * (W + 800) + t * (30 + r() * 40)) % (W + 800)) - 400, y = 900 + r() * 900; ell(x, y, 260 + r() * 160, 70 + r() * 50, `rgba(230,170,110,${a * (0.12 + r() * 0.1)})`); } };
    const lightning = (x, y, seed, a) => { if (a <= 0) return; const r = rng(seed); X.strokeStyle = `rgba(255,240,255,${a})`; X.lineWidth = 6; X.shadowColor = 'rgba(200,180,255,0.9)'; X.shadowBlur = 30; X.beginPath(); X.moveTo(x, y); let px = x, py = y;
      for (let i = 0; i < 9; i++) { px += (r() - 0.5) * 120; py += 80 + r() * 40; X.lineTo(px, py); } X.stroke(); X.shadowBlur = 0; };
    const sea = (t, y0) => { X.fillStyle = grad(y0, y0 + 360, [[0, '#6a4a8a'], [1, '#2a2a5a']]); X.fillRect(-300, y0, W + 600, 360); X.strokeStyle = 'rgba(255,200,170,0.4)'; X.lineWidth = 3;
      for (let i = 0; i < 9; i++) { const yy = y0 + 20 + i * 36; X.beginPath(); for (let k = -300; k <= W + 300; k += 30) { const v = yy + Math.sin(k * 0.02 + t * 1.5 + i) * 4; k > -300 ? X.lineTo(k, v) : X.moveTo(k, v); } X.stroke(); }
      X.fillStyle = 'rgba(255,190,140,0.35)'; X.fillRect(480, y0, 120, 360); };

    // ================================================================ props
    const bow = (draw, len = 210, col = '#c8902a') => { const pull = 40 + draw * 90; X.strokeStyle = col; X.lineWidth = 10; X.lineCap = 'round'; X.beginPath(); X.moveTo(0, -len); X.quadraticCurveTo(70 + draw * 20, 0, 0, len); X.stroke();
      X.strokeStyle = '#ffe9b0'; X.lineWidth = 3; X.beginPath(); X.moveTo(0, -len); X.lineTo(-pull + 40, 0); X.lineTo(0, len); X.stroke(); return pull; };
    const arrow = (len = 230, glowA = 0) => { if (glowA > 0) glow(len * 0.6, 0, 90, `rgba(255,240,200,${glowA})`); seg(0, 0, len, 0, 6, '#e8d8b0'); poly([[len + 26, 0], [len - 4, -12], [len - 4, 12]], '#d8d8e0'); poly([[0, 0], [-26, -14], [-14, 0], [-26, 14]], '#d04030'); };
    const axe = () => { seg(0, 60, 0, -220, 12, '#6a4628'); X.fillStyle = '#c8ccd4'; X.beginPath(); X.moveTo(0, -200); X.quadraticCurveTo(80, -230, 92, -160); X.quadraticCurveTo(60, -150, 0, -150); X.closePath(); X.fill(); seg(4, -190, 70, -195, 4, '#eef'); };
    const wheel = (cx, cy, r, rot, col = '#7a4a22', rim = '#d8a03a') => { X.save(); X.translate(cx, cy); X.rotate(rot); X.strokeStyle = rim; X.lineWidth = 16; X.beginPath(); X.arc(0, 0, r, 0, TAU); X.stroke(); X.strokeStyle = col; X.lineWidth = 9;
      for (let i = 0; i < 8; i++) { const a = i * TAU / 8; X.beginPath(); X.moveTo(0, 0); X.lineTo(Math.cos(a) * r, Math.sin(a) * r); X.stroke(); } ell(0, 0, r * 0.18, r * 0.18, rim); X.restore(); };
    const horse = (x, y, s, col, t, run = 0) => { X.save(); X.translate(x, y); X.scale(s, s); const g = Math.sin(t * 8) * run;
      [[-60, 0.3], [60, -0.3]].forEach(([lx, a], k) => { seg(lx, -10, lx + Math.sin(a + g * (k ? 1 : -1)) * 60, 100, 14, col); });
      ell(0, -40, 110, 52, col); seg(80, -60, 130, -150, 34, col); ell(150, -160, 40, 22, col, 0.5); poly([[118, -190], [128, -220], [138, -186]], col); ell(158, -168, 5, 5, '#111');
      X.strokeStyle = 'rgba(0,0,0,0.25)'; X.lineWidth = 10; X.beginPath(); X.moveTo(70, -180); X.quadraticCurveTo(60, -110, 40, -80); X.stroke();
      [[-60, -0.2], [60, 0.2]].forEach(([lx, a], k) => { seg(lx + 10, -10, lx + 10 + Math.sin(a - g * (k ? 1 : -1)) * 60, 100, 14, col); });
      seg(-108, -60, -150, 30 + wig(t, 2, 8), 14, col); X.restore(); };
    // chariot facing right; sink = how far the left wheel has gone into the ground (px), flag colour
    const chariot = (x, gy, s, o) => { const { sink = 0, flag = '#d83020', t = 0, horses = '#8a5a3a', run = 0, tilt = 0 } = o; X.save(); X.translate(x, gy); X.scale(s, s); X.rotate(tilt);
      horse(330, -100, 0.95, horses, t, run); horse(390, -90, 0.95, horses, t + 0.4, run);
      seg(120, -150, 330, -130, 12, '#6a3a1a');
      poly([[-160, -180], [140, -180], [150, -100], [-170, -100]], '#8a3a1a'); poly([[-160, -180], [140, -180], [140, -160], [-160, -160]], '#e0a83a'); poly([[-170, -360], [-150, -360], [-150, -180], [-170, -180]], '#6a3a1a');
      seg(-160, -330, -160, -520, 8, '#6a4a2a'); poly([[-156, -520], [-40 + wig(t * 4, 1, 10), -495], [-156, -470]], flag);
      wheel(-20, -90 + sink, 110, -t * 1.2 * run, '#6a3a1a', '#d8a03a'); X.restore(); };
    const cow = (x, y, s, fall = 0) => { X.save(); X.translate(x, y); X.scale(s, s); X.translate(0, fall * 70); X.rotate(fall * 0.08);
      [[-70], [-40], [50], [80]].forEach(([lx], i) => seg(lx, -40, lx + fall * (i % 2 ? 50 : -30), 80 - fall * 70, 18, '#e8e2d4')); ell(0, -70, 130, 70, '#f4efe4'); ell(-30, -90, 40, 28, '#8a6a4a', 0.3); ell(60, -50, 30, 22, '#8a6a4a');
      X.save(); X.translate(110, -100); X.rotate(fall * 1.0); seg(0, 0, 50, -50, 40, '#f4efe4'); ell(75, -50, 46, 34, '#f4efe4', 0.4); ell(105, -28, 18, 14, '#e8a8a0'); poly([[50, -80], [40, -120], [65, -86]], '#d8c8a0'); if (fall > 0.6) seg(62, -58, 76, -56, 3, '#222'); else ell(68, -58, 5, 5, '#222'); X.restore();
      seg(-130, -80, -150, 20, 6, '#e8e2d4'); X.restore(); };
    const beetle = (x, y, s, t) => { X.save(); X.translate(x, y); X.scale(s, s); X.rotate(wig(t, 6, 0.1)); for (let i = -1; i <= 1; i++) { seg(i * 14, 0, i * 18 - 6, 26 + wig(t * 9 + i, 1, 4), 3, '#111'); seg(i * 14, 0, i * 18 - 6, -26 - wig(t * 9 + i, 1, 4), 3, '#111'); }
      ell(0, 0, 30, 18, '#1a1414'); ell(-8, -4, 14, 6, 'rgba(255,255,255,0.25)'); ell(32, 0, 10, 9, '#8a1010'); X.restore(); };

    // ================================================================ puppets
    // drawn facing RIGHT in local units (ground = 0, hip at -190); f = -1 mirrors. Angles: 0 = limb down, +PI/2 = forward.
    const CAST = {
      karna:   { skin: '#d8a06c', skinD: '#b7804f', cloth: '#e09a1c', clothD: '#b07010', hair: '#1a120e', armour: true, kundal: true },
      karnaW:  { skin: '#d8a06c', skinD: '#b7804f', cloth: '#c8282a', clothD: '#962020', hair: '#1a120e', armour: true, kundal: true, crown: 'gold' },
      guru:    { skin: '#d6a074', skinD: '#b5825a', cloth: '#e2701c', clothD: '#b0520e', hair: '#ededed', beard: '#f6f6f6', bun: true, thread: true },
      drona:   { skin: '#c99468', skinD: '#a8784e', cloth: '#efe6d2', clothD: '#cfc2a6', hair: '#e2e2e2', beard: '#ececec', bun: true, thread: true },
      brahmin: { skin: '#c48c62', skinD: '#a2704a', cloth: '#f1ecdf', clothD: '#cdc3ae', hair: '#d8d8d8', beard: '#d0d0d0', shikha: true, thread: true, thin: true },
      arjuna:  { skin: '#a8724c', skinD: '#8a5a38', cloth: '#2a7a5c', clothD: '#1c5a44', hair: '#1a120e', crown: 'gold' },
      krishna: { skin: '#4c7ad0', skinD: '#3a62aa', cloth: '#f2c21a', clothD: '#c89a0e', hair: '#141020', crown: 'peacock' },
    };
    const POSE = { lean: 0, head: 0, aB: [0.12, 0.15], aF: [0.06, 0.2], lB: [-0.08, 0.05], lF: [0.1, -0.05], crouch: 0, eyes: 'open', mouth: 0 };
    const mixPose = (a, b, u) => { const o = {}; for (const k in POSE) { const va = a[k] ?? POSE[k], vb = b[k] ?? POSE[k]; o[k] = Array.isArray(va) ? va.map((v, i) => lerp(v, vb[i], u)) : typeof va === 'number' ? lerp(va, vb, u) : (u < 0.5 ? va : vb); } return o; };
    const V = (a, l) => [Math.sin(a) * l, Math.cos(a) * l];
    const head = (c, p, t) => { const S = c.skin, SD = c.skinD;
      if (c.bun) ell(-14, -46, 22, 20, c.hair); if (c.shikha) { X.strokeStyle = c.hair; X.lineWidth = 6; X.beginPath(); X.moveTo(-6, -34); X.quadraticCurveTo(-30, -60, -40, -30); X.stroke(); }
      ell(-8, 4, 36, 42, c.hair);                                          // hair at the back
      ell(2, 0, 34, 40, S); X.fillStyle = SD; X.beginPath(); X.ellipse(2, 0, 34, 40, 0, PI * 0.55, PI * 1.45); X.fill();
      poly([[30, 2], [42, 14], [30, 18]], S);                               // nose
      if (!c.bun && !c.crown && !c.shikha) ell(-4, -26, 34, 18, c.hair); if (c.bun || c.shikha) { X.fillStyle = c.hair; X.beginPath(); X.ellipse(-2, -10, 36, 32, 0, PI * 0.95, PI * 1.95); X.fill(); }
      if (c.crown === 'gold' || c.crown === 'peacock') { X.fillStyle = c.hair; X.beginPath(); X.ellipse(-2, -10, 36, 32, 0, PI * 0.95, PI * 1.95); X.fill();
        poly([[-30, -24], [30, -24], [24, -56], [8, -48], [0, -76], [-8, -48], [-24, -56]], '#f2c43a'); poly([[-30, -24], [30, -24], [30, -32], [-30, -32]], '#c89220'); ell(0, -34, 5, 5, '#d01838'); }
      if (c.crown === 'peacock') { X.save(); X.translate(10, -62); X.rotate(0.35 + wig(t, 1.2, 0.05)); seg(0, 0, 0, -60, 3, '#2a6a3a'); ell(0, -66, 12, 22, '#1e8a6a'); ell(0, -64, 7, 13, '#2a50c8'); ell(0, -64, 3.5, 6, '#101030'); X.restore(); }
      if (c.beard) { X.fillStyle = c.beard; X.beginPath(); X.moveTo(-14, 10); X.quadraticCurveTo(10, 30, 34, 18); X.quadraticCurveTo(30, 70 + (c.thin ? -20 : 0), 0, 80 + (c.thin ? -24 : 0)); X.quadraticCurveTo(-18, 50, -14, 10); X.fill(); }
      if (c.kundal) { glow(-6, 30, 26, 'rgba(255,220,120,0.7)'); ell(-6, 28, 8, 10, '#ffd257'); }
      // eyes, brows, mouth
      const ex = 18, ey = -6;
      if (p.eyes === 'closed') { X.strokeStyle = '#2a1a12'; X.lineWidth = 3; X.beginPath(); X.arc(ex, ey, 6, 0.2, PI - 0.2); X.stroke(); }
      else if (p.eyes === 'pain') { X.strokeStyle = '#2a1a12'; X.lineWidth = 3.5; X.beginPath(); X.moveTo(ex - 7, ey - 4); X.lineTo(ex + 6, ey + 1); X.lineTo(ex - 6, ey + 5); X.stroke(); }
      else { ell(ex, ey, 7, p.eyes === 'wide' ? 8 : 6, '#fff'); ell(ex + 2, ey, 3.5, 4.5, '#1a1010'); }
      X.strokeStyle = c.beard ? '#bbb' : '#2a1a12'; X.lineWidth = 4; X.beginPath();
      if (p.eyes === 'angry') { X.moveTo(ex - 12, ey - 16); X.lineTo(ex + 10, ey - 8); } else if (p.eyes === 'pain' || p.eyes === 'sad') { X.moveTo(ex - 12, ey - 10); X.lineTo(ex + 10, ey - 16); } else { X.moveTo(ex - 10, ey - 14); X.quadraticCurveTo(ex, ey - 18, ex + 10, ey - 13); } X.stroke();
      if (!c.beard || c.thin) { X.strokeStyle = '#6a2a20'; X.lineWidth = 3; X.beginPath(); if (p.mouth > 0.15) { ell(22, 24, 6, 4 + p.mouth * 7, '#5a1a18'); } else if (p.eyes === 'pain' || p.eyes === 'sad') { X.moveTo(14, 27); X.quadraticCurveTo(22, 22, 30, 27); X.stroke(); } else { X.moveTo(14, 24); X.lineTo(30, 24); X.stroke(); } }
      else if (p.mouth > 0.15) ell(22, 26, 7, 4 + p.mouth * 7, '#5a1a18'); };
    const arm = (sx, sy, a, e, c, col, hold, t) => { const [x1, y1] = [sx + V(a, 70)[0], sy + V(a, 70)[1]], [x2, y2] = [x1 + V(a + e, 66)[0], y1 + V(a + e, 66)[1]];
      seg(sx, sy, x1, y1, c.thin ? 17 : 22, col); seg(x1, y1, x2, y2, c.thin ? 15 : 19, col); ell(x2, y2, 12, 12, col); if (!c.thin) { X.strokeStyle = '#e8b83a'; X.lineWidth = 6; X.beginPath(); X.moveTo(sx + V(a, 30)[0] - 10, sy + V(a, 30)[1]); X.lineTo(sx + V(a, 30)[0] + 10, sy + V(a, 30)[1]); X.stroke(); }
      if (hold) { X.save(); X.translate(x2, y2); X.rotate(-(a + e) + PI / 2); hold(t); X.restore(); } };
    const leg = (hx, hy, a, k, col, clothCol) => { const [x1, y1] = [hx + V(a, 92)[0], hy + V(a, 92)[1]], [x2, y2] = [x1 + V(a + k, 92)[0], y1 + V(a + k, 92)[1]];
      seg(hx, hy, x1, y1, 30, clothCol); seg(x1, y1, x2, y2, 22, col); ell(x2 + 14, y2 + 4, 22, 9, col); };
    // pz = pose, o = { f: facing, rot, holdF, holdB, glowA }
    const puppet = (x, y, s, who, pz, t, o = {}) => { const c = CAST[who], p = { ...POSE, ...pz }; X.save(); X.translate(x, y); X.scale(s * (o.f || 1), s); if (o.rot) X.rotate(o.rot);
      const breathe = Math.sin(t * 2 + x) * 2, hy = -190 + p.crouch, ny = -140 + breathe;
      if (o.shadow !== false) ell(10, 6, 90, 14, 'rgba(0,0,0,0.22)');
      leg(-6, hy, p.lB[0], p.lB[1], c.skinD, c.clothD);
      X.save(); X.translate(0, hy); X.rotate(p.lean);
      arm(-8, ny + 12, p.aB[0], p.aB[1], c, c.skinD, o.holdB, t);
      // torso
      const tw = c.thin ? 30 : 38; X.fillStyle = c.skin; X.beginPath(); X.moveTo(-tw, ny + 6); X.quadraticCurveTo(0, ny - 8, tw + 4, ny + 6); X.lineTo(tw - 4, 0); X.lineTo(-tw + 6, 0); X.closePath(); X.fill();
      X.fillStyle = c.skinD; X.beginPath(); X.moveTo(-tw, ny + 6); X.lineTo(-8, ny + 2); X.lineTo(-6, 0); X.lineTo(-tw + 6, 0); X.closePath(); X.fill();
      if (c.armour) { const g = X.createLinearGradient(-30, ny, 40, 0); g.addColorStop(0, '#f6d266'); g.addColorStop(1, '#b8861e'); X.fillStyle = g; X.beginPath(); X.moveTo(-tw + 2, ny + 14); X.quadraticCurveTo(0, ny + 2, tw + 2, ny + 14); X.lineTo(tw - 6, -30); X.quadraticCurveTo(0, -18, -tw + 8, -30); X.closePath(); X.fill();
        X.strokeStyle = 'rgba(120,80,10,0.55)'; X.lineWidth = 2; for (let r2 = 0; r2 < 5; r2++) for (let k2 = 0; k2 < 4; k2++) { X.beginPath(); X.arc(-24 + k2 * 17 + (r2 % 2) * 8, ny + 28 + r2 * 18, 9, 0, PI); X.stroke(); }
        if (o.glowA) glow(0, ny + 60, 120, `rgba(255,220,120,${o.glowA})`); }
      if (c.thread) { X.strokeStyle = '#f6f2e6'; X.lineWidth = 3; X.beginPath(); X.moveTo(-tw + 6, ny + 8); X.quadraticCurveTo(4, ny + 70, tw - 4, -20); X.stroke(); }
      if (!c.thin && !c.armour) { X.strokeStyle = '#f0c040'; X.lineWidth = 5; X.beginPath(); X.ellipse(4, ny + 14, 24, 22, 0, 0.2, PI - 0.2); X.stroke(); }
      if (c.crown && !c.armour) { X.strokeStyle = '#f0c040'; X.lineWidth = 5; X.beginPath(); X.ellipse(4, ny + 14, 24, 26, 0, 0.2, PI - 0.2); X.stroke(); for (let i = 0; i < 9; i++) { const a2 = 0.3 + i * 0.3; ell(4 + Math.cos(a2) * 24, ny + 14 + Math.sin(a2) * 26, 3, 3, '#e8483a'); } }
      // cloth at the waist (dhoti) with a hanging fold
      poly([[-tw + 2, -12], [tw, -12], [tw + 6, 16], [-tw - 2, 16]], c.cloth); poly([[6, 10], [18, 10], [12 + wig(t, 2, 3), 90], [2 + wig(t, 2, 3), 86]], c.clothD);
      // neck + head
      X.fillStyle = c.skinD; X.fillRect(-8, ny - 24, 18, 30); X.save(); X.translate(4, ny - 50); X.rotate(p.head); head(c, p, t); X.restore();
      arm(10, ny + 12, p.aF[0], p.aF[1], c, c.skin, o.holdF, t);
      X.restore();
      leg(8, hy, p.lF[0], p.lF[1], c.skin, c.cloth);
      X.restore(); };
    // sitting cross-legged (legs folded in front, drawn as a cloth mound) — used for Karna under the tree
    const seated = (x, y, s, who, pz, t, o = {}) => { const c = CAST[who]; X.save(); X.translate(x, y); X.scale(s * (o.f || 1), s); ell(20, 4, 140, 16, 'rgba(0,0,0,0.22)'); X.restore();
      puppet(x, y, s, who, { ...pz, crouch: 150, lB: [1.5, -1.7], lF: [1.6, -1.7] }, t, { ...o, shadow: false });
      X.save(); X.translate(x, y); X.scale(s * (o.f || 1), s); ell(40, -26, 120, 34, c.clothD); ell(46, -34, 108, 28, c.cloth); ell(150, -10, 24, 11, c.skin); ell(-60, -8, 22, 10, c.skinD); X.restore(); };
    // guru lying on his back with his head on Karna's lap (feet at fx, ground fy)
    const lying = (fx, fy, s, who, pz, t) => puppet(fx, fy, s, who, { lB: [0.05, 0], lF: [0.1, 0], aB: [0.2, 0.2], aF: [0.5, 0.6], ...pz }, t, { rot: -1.34, shadow: false });

    // ================================================================ camera
    const cam = (cx, cy, z, fn) => { X.save(); X.translate(540, 960); X.scale(z, z); X.translate(-cx, -(cy - 110)); fn(); X.restore(); };
    const shake = (t, a) => [Math.sin(t * 61) * a, Math.cos(t * 47) * a];

    // ================================================================ one shot per line (t = time, u = 0..1 through the line)
    const bowHold = d => tt => { X.save(); X.rotate(-PI / 2); bow(d); X.restore(); };
    const C = {
      hook: (t, u) => { const sk = shake(t, u > 0.72 ? 6 : 0); cam(380 + sk[0], 1300 + sk[1], sm(1.35, 1.55, u), () => {
        sunset(t, 1020, 1); hills(1180, '#5a1a1e', 60, 2); army(1230, '#3a0e14', t, 8); dust(t, 0.8); X.fillStyle = grad(1240, H, [[0, '#7a3a22'], [1, '#2a1208']]); X.fillRect(-300, 1240, W + 600, 900);
        const sink = 70 * eo(clamp((u - 0.7) / 0.3)); chariot(330, 1600, 1.0, { sink, t, run: 1 - clamp((u - 0.7) * 4), tilt: -sink * 0.0012 });
        puppet(250, 1424 + sink * 0.25, 1.0, 'karnaW', { aF: [1.45, 0.05], aB: [1.3, -1.6], head: -0.08, eyes: u > 0.75 ? 'wide' : 'open' }, t, { holdF: bowHold(0.2), glowA: 0.25 });
        if (u > 0.7) { X.strokeStyle = 'rgba(40,10,5,0.8)'; X.lineWidth = 6; X.beginPath(); X.moveTo(240, 1600); X.lineTo(180, 1680); X.lineTo(210, 1760); X.moveTo(380, 1600); X.lineTo(450, 1700); X.stroke(); } }); },
      two: (t, u) => { cam(540, 960, sm(1.05, 1.0, u), () => { sky([[0, '#05030a'], [1, '#1a0a14']]); motes(t, 50, 3, 'rgba(255,200,150,0.25)');
        X.save(); X.globalAlpha = 0.9; puppet(540, 1700, 2.0, 'karnaW', { head: 0.15, eyes: 'sad', aF: [0.1, 0.2] }, t); X.restore(); X.fillStyle = 'rgba(5,3,10,0.72)'; X.fillRect(-300, 0, W + 600, H + 300);
        const k1 = eo(clamp((u - 0.25) * 4)), k2 = eo(clamp((u - 0.6) * 4)); [[320, k1, '255,80,60'], [760, k2, '255,170,60']].forEach(([x, k, c]) => { if (k <= 0) return; glow(x, 820, 240 * k, `rgba(${c},0.55)`); ell(x, 820, 46 * k, 46 * k, `rgba(${c},1)`); glow(x, 820, 90 * k, 'rgba(255,255,230,0.9)'); }); }); },
      drona: (t, u) => { const a = clamp(u / 0.42), b = clamp((u - 0.42) / 0.58);
        if (u < 0.42) cam(540, 1300, sm(1.3, 1.4, a), () => { forest(t, 1); X.fillStyle = 'rgba(160,110,40,0.18)'; X.fillRect(-300, -300, W + 600, H + 600);
          puppet(760, 1500, 1.15, 'drona', { aF: [sm(0.2, 1.7, a * 2), sm(0.2, -0.3, a * 2)], head: 0.05, eyes: 'open' }, t, { f: -1 });
          puppet(330, 1500, 1.15, 'karna', { aF: [0.9, 1.0], aB: [0.7, 1.2], head: -0.1, eyes: 'sad' }, t); });
        else cam(sm(500, 560, b), 1300, sm(1.25, 1.35, b), () => { forest(t); leaves(t, 10, 2); trunk(-40, 160);
          X.fillStyle = '#7a5a3a'; poly([[760, 1240], [1000, 1240], [1040, 1180], [880, 1040], [720, 1180]], '#b08a52'); X.fillRect(780, 1240, 200, 120); X.fillStyle = '#4a3220'; X.fillRect(860, 1270, 50, 90);
          const walk = clamp(b * 2.4), wx = lerp(120, 430, eo(walk)), st = Math.sin(t * 7) * (1 - walk) * 0.5, bowd = eo(clamp((b - 0.45) * 3));
          puppet(720, 1520, 1.2, 'guru', { aB: [0.3, 0.2], aF: [0.8 + bowd * 0.2, -0.6], head: -0.05 }, t, { f: -1, holdF: () => { X.save(); X.rotate(PI / 2); axe(); X.restore(); } });
          puppet(wx, 1520, 1.2, 'karna', { lean: bowd * 0.45, head: bowd * 0.25, lB: [-0.3 * st, 0], lF: [0.3 * st + 0.1, -0.05], aF: [lerp(0.2, 1.2, bowd), lerp(0.2, 1.4, bowd)], aB: [lerp(0.1, 1.1, bowd), lerp(0.2, 1.5, bowd)] }, t); }); },
      lap: (t, u) => { cam(sm(600, 640, u), 1380, sm(1.25, 1.45, u), () => { sky([[0, '#f8e2a8'], [0.5, '#d8c486'], [1, '#8fa86a']]); treeBlobs(1120, 7, 140, ['#9ab87a', '#aac68a', '#7a9460'], 4, 4, t); godRays(t, 'rgba(255,240,200,0.2)', 6, 300);
        grass(1200, t, '#7a9a54', '#4a6a34', 'rgba(50,80,30,0.5)'); trunk(250, 230); ell(250, 220, 520, 300, '#4f7a3c'); ell(120, 320, 300, 200, '#5f8a46'); leaves(t, 6, 9);
        seated(430, 1560, 1.15, 'karna', { aF: [0.9, 0.9], aB: [0.6, 0.9], head: 0.18, eyes: 'open' }, t);
        lying(908, 1584, 1.05, 'guru', { eyes: 'closed' }, t);
        X.font = '600 44px Poppins'; X.fillStyle = 'rgba(80,60,40,0.7)'; for (let i = 0; i < 3; i++) { const k = ((t * 0.6 + i / 3) % 1); X.globalAlpha = 1 - k; X.fillText('z', 760 + k * 60 + i * 10, 1300 - k * 140); } X.globalAlpha = 1; }); },
      bite: (t, u) => { const z = u < 0.55 ? sm(1.4, 2.4, u / 0.55) : sm(2.4, 2.1, (u - 0.55) / 0.45), drip = eo(clamp((u - 0.2) / 0.5)), sk = shake(t, 1.5); cam(lerp(520, 470, clamp(u * 2)) + sk[0], (u < 0.55 ? lerp(1400, 1505, clamp(u * 2)) : sm(1505, 1310, (u - 0.55) / 0.45)) + sk[1], z, () => {
        sky([[0, '#f8e2a8'], [0.5, '#d8c486'], [1, '#8fa86a']]); treeBlobs(1120, 7, 140, ['#9ab87a', '#aac68a', '#7a9460'], 4, 4, t); grass(1200, t, '#7a9a54', '#4a6a34', 'rgba(50,80,30,0.5)'); trunk(250, 230);
        seated(430, 1560, 1.15, 'karna', { aF: [0.9, 0.9], aB: [0.6, 0.9], head: 0.1 + wig(t, 9, 0.01), eyes: u > 0.25 ? 'pain' : 'open' }, t);
        lying(908, 1584, 1.05, 'guru', { eyes: 'closed' }, t);
        const bx = lerp(560, 470, clamp(u * 3)), by = 1500; if (drip > 0) { ell(470, 1505, 10, 8, '#a01010'); X.fillStyle = '#b01414'; X.beginPath(); X.moveTo(463, 1507); X.quadraticCurveTo(470, 1507 + 60 * drip, 477, 1507); X.fill(); ell(470, 1509 + 60 * drip, 6, 8, '#b01414'); } beetle(bx, by - 6, 0.55, t);
        X.fillStyle = `rgba(160,0,0,${0.18 * Math.max(0, Math.sin(t * 6)) * clamp(u * 3)})`; X.fillRect(0, 900, W, 1200); }); },
      wake: (t, u) => { const red = clamp((u - 0.45) * 3); cam(600, 1330, sm(1.3, 1.4, u), () => {
        sky([[0, '#f8e2a8'], [0.5, '#d8c486'], [1, '#8fa86a']]); treeBlobs(1120, 7, 140, ['#9ab87a', '#aac68a', '#7a9460'], 4, 4, t); grass(1200, t, '#7a9a54', '#4a6a34', 'rgba(50,80,30,0.5)'); trunk(250, 230); ell(250, 220, 520, 300, '#4f7a3c');
        seated(430, 1560, 1.15, 'karna', { aF: [0.9, 0.9], aB: [0.6, 0.9], head: -0.05, eyes: 'sad' }, t); ell(470, 1512, 9, 9, '#a01010');
        const sa = clamp((u - 0.3) * 6); if (sa < 1) { X.save(); X.globalAlpha *= 1 - sa; lying(908, 1584, 1.05, 'guru', { eyes: u > 0.12 ? 'wide' : 'closed' }, t); X.restore(); }
        if (sa > 0) { X.save(); X.globalAlpha *= sa; puppet(760, 1580, 1.25, 'guru', { eyes: red > 0.2 ? 'angry' : 'wide', aF: [lerp(0.4, 1.6, red), 0], head: -0.1, mouth: u > 0.45 ? 0.4 + 0.4 * Math.abs(Math.sin(t * 9)) : 0 }, t, { f: -1 }); X.restore(); }
        if (red > 0) { X.fillStyle = `rgba(170,20,10,${0.32 * red})`; X.fillRect(-400, -400, W + 800, H + 800); } }); },
      curse1: (t, u) => { const sk = shake(t, 4 + 4 * K.pulse(t, F('curse1', 0.3), 0.4)); cam(500 + sk[0], 1300 + sk[1], sm(1.2, 1.3, u), () => {
        sky([[0, '#1a0408'], [0.5, '#6a0e12'], [1, '#c8401a']]); const fl = Math.max(0, Math.sin(t * 3.3) * Math.sin(t * 7.1)); lightning(200, -50, Math.floor(t * 2), fl * 0.9); lightning(880, -50, Math.floor(t * 2) + 5, fl * 0.7);
        X.fillStyle = `rgba(255,220,255,${fl * 0.15})`; X.fillRect(-300, -300, W + 600, H + 600); trunk(-60, 180, '#2a0e0a', '#150604'); grass(1300, t, '#4a2a18', '#1a0a06', 'rgba(20,0,0,0.5)');
        motes(t, 40, 6, 'rgba(255,140,60,0.6)', [0, 600, W, 1300], 60);
        puppet(700, 1580, 1.35, 'guru', { aF: [2.6, 0.15], aB: [1.5, 0.1], eyes: 'angry', mouth: 0.6 + 0.4 * Math.abs(Math.sin(t * 9)), lean: -0.06 }, t, { f: -1, holdF: () => { X.save(); X.rotate(PI / 2); axe(); X.restore(); } });
        glow(560, 900, 180 + 20 * Math.sin(t * 8), 'rgba(255,90,40,0.35)');
        puppet(300, 1600, 1.2, 'karna', { crouch: 70, lean: 0.35, head: 0.2, lB: [0.1, -1.4], lF: [1.4, -1.5], aF: [1.4, 1.2], aB: [1.2, 1.3], eyes: 'sad' }, t); }); },
      cow: (t, u) => { const shoot = clamp((u - 0.25) / 0.2), fly = clamp((u - 0.45) / 0.18), fall = eo(clamp((u - 0.62) / 0.25)); cam(sm(380, 700, u), 1380, 1.3, () => {
        sky([[0, '#2a1a4a'], [0.45, '#9a4a6a'], [0.7, '#f0905a'], [1, '#f8c88a']]); glow(540, 1000, 300, 'rgba(255,180,120,0.5)'); ell(540, 1010, 80, 80, '#ffd8a0'); sea(t, 1060);
        X.fillStyle = grad(1400, H, [[0, '#d8a87a'], [1, '#9a6a44']]); X.fillRect(-400, 1380, W + 1000, 900); X.fillStyle = 'rgba(255,255,255,0.35)'; X.beginPath(); for (let k = -400; k <= W + 600; k += 30) X.lineTo(k, 1384 + Math.sin(k * 0.02 + t * 2) * 8); X.lineTo(W + 600, 1376); X.lineTo(-400, 1376); X.fill();
        const draw = shoot < 1 ? eo(shoot) : 0; puppet(200, 1640, 1.1, 'karna', { aF: [1.55, 0.02], aB: [1.5, -2.0 + 0.6 * (1 - draw)], head: 0.05 }, t, { holdF: bowHold(draw) });
        if (fly > 0 && fly < 1) { X.save(); X.translate(lerp(360, 820, fly), 1430 - Math.sin(fly * PI) * 30); arrow(160, 0.3); X.restore(); }
        cow(900, 1620, 0.95, fall); if (fall > 0.9) { X.save(); X.translate(820, 1560); X.rotate(0.6); arrow(120); X.restore(); } }); },
      curse2: (t, u) => { const st = eo(clamp((u - 0.45) * 3)); cam(sm(560, 480, u), 1380, sm(1.35, 1.45, u), () => {
        sky([[0, '#1a0a2a'], [0.45, '#6a2a4a'], [0.7, '#c05a3a'], [1, '#e8a06a']]); sea(t, 1060); X.fillStyle = grad(1400, H, [[0, '#b8885a'], [1, '#6a4428']]); X.fillRect(-400, 1380, W + 1000, 900);
        cow(820, 1630, 0.95, 1); puppet(lerp(640, 600, st), 1640, 1.2, 'brahmin', { crouch: lerp(80, 0, st), lean: lerp(0.5, -0.05, st), head: lerp(0.4, -0.1, st), aF: [lerp(0.8, 1.7, st), lerp(1.0, 0, st)], aB: [lerp(0.7, 0.4, st), lerp(1.2, 0.2, st)], lB: [lerp(0.1, -0.1, st), lerp(-1.4, 0, st)], lF: [lerp(1.3, 0.1, st), lerp(-1.4, 0, st)], eyes: st > 0.5 ? 'angry' : 'sad', mouth: st > 0.5 ? 0.5 + 0.4 * Math.abs(Math.sin(t * 8)) : 0 }, t, { f: -1 });
        if (st < 0.5) { const r = rng(Math.floor(t * 3)); for (let i = 0; i < 3; i++) ell(600 - 30 + r() * 30, 1220 + ((t * 120 + i * 40) % 120), 4, 7, 'rgba(160,210,255,0.9)'); }
        puppet(160, 1660, 1.05, 'karna', { aF: [0.9, 1.1], aB: [0.7, 1.2], eyes: 'sad', head: 0.12 }, t);
        if (st > 0) { glow(560, 1150, 360 * st, 'rgba(255,60,30,0.3)'); X.fillStyle = `rgba(120,10,10,${0.25 * st})`; X.fillRect(-400, -400, W + 800, H + 800); } }); },
      kuru: (t, u) => { cam(540, 1420, sm(1.25, 1.35, u), () => { sunset(t, 980, 1); hills(1150, '#4a1218', 50, 7); army(1210, '#2a080e', t, 3, 60); dust(t, 1.0, 9);
        X.fillStyle = grad(1220, H, [[0, '#7a3a22'], [1, '#2a1208']]); X.fillRect(-300, 1220, W + 600, 900);
        chariot(190, 1640, 0.62, { t, run: 0.3, flag: '#d83020' }); puppet(170, 1530, 0.75, 'karnaW', { aF: [1.45, 0.05], aB: [1.3, -1.6] }, t, { holdF: bowHold(0.1), glowA: 0.2 });
        X.save(); X.translate(890, 0); X.scale(-1, 1); X.translate(-890, 0); chariot(890, 1640, 0.62, { t: t + 1, run: 0.3, flag: '#f0c020', horses: '#f4f0e6' }); X.restore();
        puppet(830, 1530, 0.75, 'krishna', { aF: [1.3, 0.3], aB: [1.2, 0.4] }, t, { f: -1 }); puppet(920, 1530, 0.75, 'arjuna', { aF: [1.45, 0.05], aB: [1.3, -1.6] }, t, { f: -1, holdF: bowHold(0.1) }); dust(t * 1.3, 0.6, 11); }); },
      stuck: (t, u) => { const sink = 90 * eo(clamp(u / 0.4)), fade = clamp((u - 0.5) / 0.4), sk = shake(t, u < 0.45 ? 8 * (1 - u / 0.45) : 1); cam(330 + sk[0], 1360 + sk[1], sm(1.5, 1.75, u), () => {
        sunset(t, 980, 1); hills(1180, '#5a1a1e', 60, 2); dust(t, 0.9); X.fillStyle = grad(1240, H, [[0, '#7a3a22'], [1, '#2a1208']]); X.fillRect(-300, 1240, W + 600, 900);
        chariot(330, 1600, 1.0, { sink, t, run: 0, tilt: -sink * 0.0014 });
        puppet(250, 1424 + sink * 0.3, 1.0, 'karnaW', { aF: [lerp(1.4, 1.0, fade), lerp(0.1, 0.7, fade)], aB: [0.6, 0.8], head: 0.2 * fade, eyes: fade > 0.3 ? 'pain' : 'wide' }, t, { glowA: 0.2,
          holdF: () => { if (fade < 1) { X.save(); X.globalAlpha *= 1 - fade; glow(0, -40, 90, 'rgba(255,230,140,0.9)'); X.strokeStyle = '#fff2c0'; X.lineWidth = 4; X.beginPath(); X.arc(0, -40, 30 + fade * 40, 0, TAU); X.stroke(); X.restore(); } } });
        X.strokeStyle = 'rgba(30,8,4,0.85)'; X.lineWidth = 7; const cr = eo(clamp(u / 0.35)); X.beginPath(); X.moveTo(300, 1610); X.lineTo(300 - 90 * cr, 1700 * 1 + 40 * cr); X.moveTo(320, 1610); X.lineTo(320 + 150 * cr, 1690 + 60 * cr); X.moveTo(310, 1612); X.lineTo(330, 1612 + 160 * cr); X.stroke();
        const r = rng(3); for (let i = 0; i < 18; i++) { const k = clamp(u * 3 - r()); if (k <= 0 || k >= 1) continue; ell(310 + (r() - 0.5) * 300 * k, 1600 - 140 * Math.sin(k * PI) * r(), 8, 6, '#5a2a14'); } }); },
      plea: (t, u) => { const tug = Math.sin(t * 5) * 0.08, turn = clamp((u - 0.35) * 3); cam(sm(380, 440, u), 1400, sm(1.55, 1.4, u), () => {
        sunset(t, 980, 1); hills(1180, '#5a1a1e', 60, 2); dust(t, 1.0); X.fillStyle = grad(1240, H, [[0, '#7a3a22'], [1, '#2a1208']]); X.fillRect(-300, 1240, W + 600, 900);
        chariot(330, 1600, 1.0, { sink: 90, t, run: 0, tilt: -0.12 });
        puppet(420, 1640, 1.15, 'karnaW', { crouch: 50, lean: 0.55 - tug, lB: [-0.4, 0.3], lF: [0.9, -1.1], aF: [lerp(2.2, 1.9, turn) + tug, lerp(0.3, -0.3, turn)], aB: [2.3 + tug, 0.3], head: lerp(0.3, -0.35, turn), eyes: turn > 0.4 ? 'wide' : 'pain', mouth: turn > 0.4 ? 0.4 + 0.4 * Math.abs(Math.sin(t * 9)) : 0 }, t, { f: -1, glowA: 0.15 }); }); },
      arrow: (t, u) => { const draw = eo(clamp(u / 0.4)), fly = clamp((u - 0.55) / 0.2), flash = K.pulse(t, F('arrow', 0.76), 0.3); cam(sm(780, 600, u), 1300, sm(1.45, 1.2, u), () => {
        sunset(t, 980, 1); hills(1150, '#4a1218', 50, 7); dust(t, 0.9, 9); X.fillStyle = grad(1220, H, [[0, '#7a3a22'], [1, '#2a1208']]); X.fillRect(-300, 1220, W + 600, 900);
        X.save(); X.translate(820, 0); X.scale(-1, 1); X.translate(-820, 0); chariot(820, 1640, 0.85, { t, run: 0, flag: '#f0c020', horses: '#f4f0e6' }); X.restore();
        puppet(700, 1490, 0.98, 'krishna', { aF: [lerp(1.0, 1.75, eo(clamp(u * 3))), 0], aB: [1.2, 0.4], head: -0.05 }, t, { f: -1 });
        puppet(880, 1490, 1.02, 'arjuna', { aF: [1.55, 0.02], aB: [1.5, -2.0 + 0.6 * (1 - draw)], head: 0.04, eyes: 'angry' }, t, { f: -1, holdF: bowHold(fly > 0 ? 0 : draw) });
        if (fly > 0 && fly < 1) { X.save(); X.translate(lerp(640, -500, fly), 1330); X.scale(-1, 1); for (let k = 1; k < 6; k++) { X.globalAlpha = 0.18; X.translate(-50, 0); arrow(160, 0); } X.globalAlpha = 1; X.restore();
          X.save(); X.translate(lerp(640, -500, fly), 1330); X.scale(-1, 1); arrow(190, 0.8); X.restore(); } });
        if (flash > 0) { X.fillStyle = `rgba(255,250,235,${flash * 0.9})`; X.fillRect(0, 0, W, H); } },
      end: (t, u) => { cam(540, 1100, sm(1.0, 1.1, u), () => { sky([[0, '#1a0410'], [0.4, '#7a1424'], [0.7, '#e0502a'], [1, '#ffb060']]); glow(540, 1150, 600, 'rgba(255,170,90,0.6)'); ell(540, 1160, 230, 230, '#ffd090'); glow(540, 1160, 300, 'rgba(255,240,200,0.6)');
        X.fillStyle = '#1a0608'; X.fillRect(-300, 1380, W + 600, 900); chariot(780, 1400, 0.8, { sink: 90, t: 0, tilt: -0.1, horses: '#1a0608', flag: '#1a0608' });
        X.save(); X.filter = 'brightness(0)'; puppet(430, 1400, 1.2, 'karnaW', { crouch: 70, lean: 0.25, head: 0.35 + 0.1 * eo(u), lB: [0.1, -1.4], lF: [1.4, -1.5], aF: [0.5, 0.3], aB: [0.2, 0.2] }, t, { shadow: false }); X.restore();
        X.save(); X.translate(470, 1340); X.rotate(-0.5); X.filter = 'brightness(0)'; arrow(140); X.restore(); motes(t, 40, 8, 'rgba(255,200,140,0.5)', [0, 600, W, 900], 18); }); },
      cta: (t, u) => { cam(540, 1100, 1.1, () => { sky([[0, '#1a0410'], [0.4, '#7a1424'], [0.7, '#e0502a'], [1, '#ffb060']]); glow(540, 1150, 600, 'rgba(255,170,90,0.6)'); ell(540, 1160, 230, 230, '#ffd090');
        X.fillStyle = '#1a0608'; X.fillRect(-300, 1380, W + 600, 900); X.save(); X.filter = 'brightness(0)'; puppet(430, 1400, 1.2, 'karnaW', { crouch: 70, lean: 0.25, head: 0.45, lB: [0.1, -1.4], lF: [1.4, -1.5], aF: [0.5, 0.3], aB: [0.2, 0.2] }, t, { shadow: false }); X.restore(); });
        const fa = B('cta') + 0.4, gt = t; if (gt > fa) { const k = K.easeBack(prog(gt, fa, fa + 0.35)), press = K.pulse(gt, fa + 1.1, 0.3), done = gt > fa + 1.25, w = 520 - press * 24;
          X.save(); X.translate(540, 1700); X.scale(k, k); X.translate(-540, -1700); X.fillStyle = done ? '#262a3a' : '#ff3b5c'; K.rrect(X, 540 - w / 2, 1645, w, 110, 55); X.fill(); X.font = '700 54px "Poppins"'; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillStyle = '#fff'; X.fillText(done ? 'FOLLOWING ✓' : '+ FOLLOW', 540, 1702); X.textBaseline = 'alphabetic';
          const hp = eo(prog(gt, fa + 0.35, fa + 1.05)), hx = 760 - hp * 200, hy = 1850 - hp * 130; X.fillStyle = 'rgba(255,255,255,0.95)'; X.strokeStyle = '#111'; X.lineWidth = 5; X.beginPath(); X.arc(hx, hy, 30 - press * 6, 0, TAU); X.fill(); X.stroke(); X.restore(); } },
    };
    const card = (i, t, alpha) => { const l = L[i], a = l.t - XF, b = i + 1 < N ? L[i + 1].t : D, u = prog(t, a, b), id = LINES[i].id; X.save(); X.globalAlpha = alpha; C[id](t, u); X.restore(); };
    const update = t => { tex.redraw((x) => { X = x; X.globalAlpha = 1; X.fillStyle = '#000'; X.fillRect(0, 0, W, H);
      let i = 0; for (let k = 0; k < N; k++) if (t >= L[k].t - XF) i = k;
      const st = L[i].t - XF; if (i > 0 && t < st + XF * 2) { card(i - 1, t, 1); card(i, t, ease(prog(t, st, st + XF * 2))); } else card(i, t, 1);
      const vg = X.createRadialGradient(540, 960, 650, 540, 960, 1200); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.38)'); X.fillStyle = vg; X.fillRect(0, 0, W, H);
      if (t < 0.4) { X.fillStyle = `rgba(0,0,0,${1 - t / 0.4})`; X.fillRect(0, 0, W, H); } }); };
    const sfx = [['bass', 0.05, 0.6], ['thud', F('hook', 0.72), 0.8], ['riser', B('two') - 0.2, 0.4], ['bass', F('two', 0.3), 0.6], ['bass', F('two', 0.62), 0.6],
      ['rustle', B('drona') + 0.2, 0.3], ['whoosh', F('drona', 0.42) - 0.2, 0.35], ['rustle', B('lap'), 0.3], ['buzz', F('bite', 0.1), 0.35], ['zap', F('bite', 0.3), 0.3],
      ['bass', F('wake', 0.45), 0.7], ['thud', F('curse1', 0.3), 0.8], ['buzz', F('curse1', 0.55), 0.3], ['whoosh', F('cow', 0.45), 0.5], ['thud', F('cow', 0.7), 0.6],
      ['bass', F('curse2', 0.5), 0.7], ['riser', B('kuru'), 0.4], ['thud', F('stuck', 0.05), 0.9], ['bass', F('stuck', 0.1), 0.7], ['whoosh', F('arrow', 0.55), 0.7], ['zap', F('arrow', 0.75), 0.6], ['bass', F('arrow', 0.76), 0.9],
      ['chime', B('end') + 0.3, 0.35], ['pop', B('cta') + 0.4, 0.5], ['ding', B('cta') + 1.5, 0.55]];
    return { duration: D, update, shots: [{ t: [0, 1], from: { pos: [0, 0, 1], look: [0, 0, 0] } }], sfx, watermark: false, endCard: false, music: {}, capFont: 'Fredoka Light', capMarginV: 520, capSize: 1 };
  },
};
