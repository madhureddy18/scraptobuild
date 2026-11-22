// shakuni (Telugu daily reel, batch 22 Nov 2026 #2) — 2D puppet machinery from stb_karna_te_body.js (via the batch kit); NEW look per DAILY.md (see the look comment below). Subtitles ON (Tinglish), no watermark.
window.SCENE = {
  setup: { bg: 0x000000, fog: null, fov: 40, bloom: null },
  lines: window.STB_LINES,
  build(K, T) {
    const L = T.lines, LINES = window.STB_LINES, N = LINES.length, IDX = {}; LINES.forEach((l, i) => { IDX[l.id] = i; });
    const B = n => L[IDX[n]].t, E = n => L[IDX[n]].end, F = (n, f) => B(n) + (E(n) - B(n)) * f;
    const D = E('cta') + 1.4, XF = 0.3;
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
    const glow = (cx, cy, r, col) => { if (!(r > 1)) return; const g = X.createRadialGradient(cx, cy, 0, cx, cy, r); g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)'); X.fillStyle = g; X.beginPath(); X.arc(cx, cy, r, 0, TAU); X.fill(); };
    const ell = (cx, cy, rx, ry, col, rot = 0) => { X.fillStyle = col; X.beginPath(); X.ellipse(cx, cy, Math.abs(rx), Math.abs(ry), rot, 0, TAU); X.fill(); };
    const poly = (pts, col) => { X.fillStyle = col; X.beginPath(); pts.forEach(([a, b], i) => i ? X.lineTo(a, b) : X.moveTo(a, b)); X.closePath(); X.fill(); };
    const seg = (x1, y1, x2, y2, w, col) => { X.strokeStyle = col; X.lineWidth = w; X.lineCap = 'round'; X.beginPath(); X.moveTo(x1, y1); X.lineTo(x2, y2); X.stroke(); };
    const motes = (t, n, seed, col, area = [0, 0, W, H], spd = 20) => { const r = rng(seed); for (let i = 0; i < n; i++) { const x = area[0] + ((r() * area[2] + wig(t + i, 0.4, 30)) % area[2]), y = area[1] + ((r() * area[3] - t * spd * (0.5 + r())) % area[3] + area[3]) % area[3]; ell(x, y, 2 + r() * 3, 2 + r() * 3, col); } };
    const hills = (y, col, amp, seed) => { const r = rng(seed); X.fillStyle = col; X.beginPath(); X.moveTo(-300, H + 300); X.lineTo(-300, y); for (let x = -300; x <= W + 300; x += 60) X.lineTo(x, y - amp * (0.5 + 0.5 * Math.sin(x * 0.006 + seed)) - r() * amp * 0.2); X.lineTo(W + 300, H + 300); X.closePath(); X.fill(); };

    // ================================================================ props
    const bow = (draw, len = 210, col = '#c8902a') => { const pull = 40 + draw * 90; X.strokeStyle = col; X.lineWidth = 10; X.lineCap = 'round'; X.beginPath(); X.moveTo(0, -len); X.quadraticCurveTo(70 + draw * 20, 0, 0, len); X.stroke();
      X.strokeStyle = '#ffe9b0'; X.lineWidth = 3; X.beginPath(); X.moveTo(0, -len); X.lineTo(-pull + 40, 0); X.lineTo(0, len); X.stroke(); return pull; };
    const arrow = (len = 230, glowA = 0) => { if (glowA > 0) glow(len * 0.6, 0, 90, `rgba(255,240,200,${glowA})`); seg(0, 0, len, 0, 6, '#e8d8b0'); poly([[len + 26, 0], [len - 4, -12], [len - 4, 12]], '#d8d8e0'); poly([[0, 0], [-26, -14], [-14, 0], [-26, 14]], '#d04030'); };
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
    const target = (x, y, s, hits) => { X.save(); X.translate(x, y); X.scale(s, s); [['#f4ecd8', 60], ['#c8402a', 44], ['#f4ecd8', 28], ['#c8402a', 12]].forEach(([c, r]) => ell(0, 0, r, r, c)); for (let i = 0; i < hits; i++) { X.save(); X.translate(Math.cos(i * 2.4) * 10, Math.sin(i * 2.4) * 10); X.rotate(0.05 * i); X.translate(-96, 0); arrow(70); X.restore(); } X.restore(); };

    // ================================================================ puppets
    // drawn facing RIGHT in local units (ground = 0, hip at -190); f = -1 mirrors. Angles: 0 = limb down, +PI/2 = forward.
    const CAST = {
      arjuna:   { skin: '#8a5a3a', skinD: '#6c4228', cloth: '#f2f0ea', clothD: '#cfc8b8', hair: '#140c08', crown: 'gold', quiver: true },
      subhadra: { skin: '#b07a52', skinD: '#8e5c3a', cloth: '#c8287a', clothD: '#94185a', hair: '#120a08', female: true, thin: true },
      abhi:     { skin: '#9a6a44', skinD: '#7a5030', cloth: '#1e8a8a', clothD: '#136464', hair: '#120c08', crown: 'gold', thin: true, quiver: true },
      krishna:  { skin: '#4c7ad0', skinD: '#3a62aa', cloth: '#f2c21a', clothD: '#c89a0e', hair: '#141020', crown: 'peacock' },
      drona:    { skin: '#b88a62', skinD: '#966a46', cloth: '#e8dcc0', clothD: '#c4b494', hair: '#dcdcdc', beard: '#ececec', bun: true, thread: true },
      yudhi:    { skin: '#9a6a44', skinD: '#7a5030', cloth: '#5a3a8a', clothD: '#3e2866', hair: '#140c08', crown: 'gold' },
    };
    const POSE = { lean: 0, head: 0, aB: [0.12, 0.15], aF: [0.06, 0.2], lB: [-0.08, 0.05], lF: [0.1, -0.05], crouch: 0, eyes: 'open', mouth: 0 };
    const mixPose = (a, b, u) => { const o = {}; for (const k in POSE) { const va = a[k] ?? POSE[k], vb = b[k] ?? POSE[k]; o[k] = Array.isArray(va) ? va.map((v, i) => lerp(v, vb[i], u)) : typeof va === 'number' ? lerp(va, vb, u) : (u < 0.5 ? va : vb); } return o; };
    const V = (a, l) => [Math.sin(a) * l, Math.cos(a) * l];
    const head = (c, p, t) => { if (c.lion) return lionHead(c, p, t); if (c.boar) return boarHead(c, p, t); if (c.brahma) return brahmaHeads(c, p, t); if (c.elephant) return eleHead(c, p, t); if (c.tenHeads) return tenHeads(c, p, t); if (c.gem) { _head0({ ...c, gem: false }, p, t); glow(10, -30, 26 + 4 * Math.sin(t * 4), c.gem); ell(10, -30, 7, 7, "#e8fff8"); return; } const S = c.skin, SD = c.skinD;
      if (c.bun) ell(-14, -46, 22, 20, c.hair); if (c.shikha) { X.strokeStyle = c.hair; X.lineWidth = 6; X.beginPath(); X.moveTo(-6, -34); X.quadraticCurveTo(-30, -60, -40, -30); X.stroke(); }
      if (c.female) { ell(-22, 40, 26, 80, c.hair); ell(-24, 118, 10, 14, '#e8b83a'); }
      ell(-8, 4, 36, 42, c.hair);                                          // hair at the back
      ell(2, 0, 34, 40, S); X.fillStyle = SD; X.beginPath(); X.ellipse(2, 0, 34, 40, 0, PI * 0.55, PI * 1.45); X.fill();
      poly([[30, 2], [42, 14], [30, 18]], S);                               // nose
      if (!c.bun && !c.crown && !c.shikha) ell(-4, -26, 34, 18, c.hair); if (c.bun || c.shikha) { X.fillStyle = c.hair; X.beginPath(); X.ellipse(-2, -10, 36, 32, 0, PI * 0.95, PI * 1.95); X.fill(); }
      if (c.crown === 'gold' || c.crown === 'peacock') { X.fillStyle = c.hair; X.beginPath(); X.ellipse(-2, -10, 36, 32, 0, PI * 0.95, PI * 1.95); X.fill();
        poly([[-30, -24], [30, -24], [24, -56], [8, -48], [0, -76], [-8, -48], [-24, -56]], '#f2c43a'); poly([[-30, -24], [30, -24], [30, -32], [-30, -32]], '#c89220'); ell(0, -34, 5, 5, '#d01838'); }
      if (c.crown === 'peacock') { X.save(); X.translate(10, -62); X.rotate(0.35 + wig(t, 1.2, 0.05)); seg(0, 0, 0, -60, 3, '#2a6a3a'); ell(0, -66, 12, 22, '#1e8a6a'); ell(0, -64, 7, 13, '#2a50c8'); ell(0, -64, 3.5, 6, '#101030'); X.restore(); }
      if (c.feather) { X.save(); X.translate(-20, -40); X.rotate(-0.5 + wig(t, 1.5, 0.05)); poly([[0, 0], [-10, -70], [0, -86], [10, -70]], '#e8e0c8'); seg(0, -4, 0, -80, 2, '#6a5a40'); poly([[-2, -60], [-8, -84], [0, -90], [6, -82]], '#2a2a2a'); X.restore();
        X.strokeStyle = '#c8402a'; X.lineWidth = 8; X.beginPath(); X.ellipse(2, -8, 35, 30, 0, PI * 1.02, PI * 1.98); X.stroke(); }
      if (c.beard) { X.fillStyle = c.beard; X.beginPath(); X.moveTo(-14, 10); X.quadraticCurveTo(10, 30, 34, 18); X.quadraticCurveTo(30, 70 + (c.thin ? -20 : 0), 0, 80 + (c.thin ? -24 : 0)); X.quadraticCurveTo(-18, 50, -14, 10); X.fill(); }
      if (c.kundal) { glow(-6, 30, 26, 'rgba(255,220,120,0.7)'); ell(-6, 28, 8, 10, '#ffd257'); }
      if (c.female) { ell(24, -20, 4, 4, '#c81830'); X.strokeStyle = '#e8b83a'; X.lineWidth = 3; X.beginPath(); X.arc(-4, 24, 7, 0, TAU); X.stroke(); }
      // eyes, brows, mouth
      const ex = 18, ey = -6;
      if ((p.eyes === 'open' || p.eyes === 'wide') && ((t * 0.31 + (c.skin.charCodeAt(2) % 7) * 0.13) % 1) < 0.035) p = { ...p, eyes: 'closed' };
      if (p.eyes === 'closed') { X.strokeStyle = '#2a1a12'; X.lineWidth = 3; X.beginPath(); X.arc(ex, ey, 6, 0.2, PI - 0.2); X.stroke(); }
      else if (p.eyes === 'pain') { X.strokeStyle = '#2a1a12'; X.lineWidth = 3.5; X.beginPath(); X.moveTo(ex - 7, ey - 4); X.lineTo(ex + 6, ey + 1); X.lineTo(ex - 6, ey + 5); X.stroke(); }
      else { ell(ex, ey, 7, p.eyes === 'wide' ? 8 : 6, '#fff'); ell(ex + 2, ey, 3.5, 4.5, '#1a1010'); }
      X.strokeStyle = c.beard ? '#bbb' : '#2a1a12'; X.lineWidth = 4; X.beginPath();
      if (p.eyes === 'angry') { X.moveTo(ex - 12, ey - 16); X.lineTo(ex + 10, ey - 8); } else if (p.eyes === 'pain' || p.eyes === 'sad') { X.moveTo(ex - 12, ey - 10); X.lineTo(ex + 10, ey - 16); } else { X.moveTo(ex - 10, ey - 14); X.quadraticCurveTo(ex, ey - 18, ex + 10, ey - 13); } X.stroke();
      if (!c.beard || c.thin) { X.strokeStyle = '#6a2a20'; X.lineWidth = 3; X.beginPath(); if (p.mouth > 0.15) { ell(22, 24, 6, 4 + p.mouth * 7, '#5a1a18'); } else if (p.eyes === 'pain' || p.eyes === 'sad') { X.moveTo(14, 27); X.quadraticCurveTo(22, 22, 30, 27); X.stroke(); } else if (p.smile) { X.lineWidth = 4; X.moveTo(12, 20); X.quadraticCurveTo(22, 32, 33, 19); X.stroke(); } else { X.moveTo(14, 24); X.lineTo(30, 24); X.stroke(); } }
      else if (p.mouth > 0.15) ell(22, 26, 7, 4 + p.mouth * 7, '#5a1a18'); if (c.band) { X.fillStyle = c.band; X.beginPath(); X.moveTo(-34, -22); X.lineTo(38, -20); X.lineTo(38, 2); X.lineTo(-34, 4); X.closePath(); X.fill(); X.fillStyle = 'rgba(255,255,255,0.18)'; X.fillRect(-30, -18, 66, 5); } };
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
      if (c.quiver) { X.save(); X.translate(-34, ny + 30); X.rotate(-0.45); X.fillStyle = '#5a3418'; X.fillRect(-14, -10, 28, 110); X.fillStyle = '#d8a03a'; X.fillRect(-14, -10, 28, 8);
        for (let i = 0; i < (o.nArrows ?? 3); i++) { seg(-7 + i * 7, -10, -7 + i * 7, -50, 4, '#e8d8b0'); glow(-7 + i * 7, -56, 16, 'rgba(255,230,140,0.8)'); poly([[-7 + i * 7, -66], [-12 + i * 7, -50], [-2 + i * 7, -50]], '#fff2c0'); } X.restore(); }
      arm(-8, ny + 12, p.aB[0], p.aB[1], c, c.skinD, o.holdB, t);
      // torso
      const tw = c.thin ? 30 : 38; X.fillStyle = c.skin; X.beginPath(); X.moveTo(-tw, ny + 6); X.quadraticCurveTo(0, ny - 8, tw + 4, ny + 6); X.lineTo(tw - 4, 0); X.lineTo(-tw + 6, 0); X.closePath(); X.fill();
      X.fillStyle = c.skinD; X.beginPath(); X.moveTo(-tw, ny + 6); X.lineTo(-8, ny + 2); X.lineTo(-6, 0); X.lineTo(-tw + 6, 0); X.closePath(); X.fill();
      if (c.armour) { const g = X.createLinearGradient(-30, ny, 40, 0); g.addColorStop(0, '#f6d266'); g.addColorStop(1, '#b8861e'); X.fillStyle = g; X.beginPath(); X.moveTo(-tw + 2, ny + 14); X.quadraticCurveTo(0, ny + 2, tw + 2, ny + 14); X.lineTo(tw - 6, -30); X.quadraticCurveTo(0, -18, -tw + 8, -30); X.closePath(); X.fill();
        X.strokeStyle = 'rgba(120,80,10,0.55)'; X.lineWidth = 2; for (let r2 = 0; r2 < 5; r2++) for (let k2 = 0; k2 < 4; k2++) { X.beginPath(); X.arc(-24 + k2 * 17 + (r2 % 2) * 8, ny + 28 + r2 * 18, 9, 0, PI); X.stroke(); }
        if (o.glowA) glow(0, ny + 60, 120, `rgba(255,220,120,${o.glowA})`); }
      if (c.female) { poly([[-tw + 2, ny + 8], [-tw + 18, ny + 4], [tw, -10], [tw - 10, 4], [-tw + 4, ny + 40]], c.cloth); }
      if (c.thread) { X.strokeStyle = '#f6f2e6'; X.lineWidth = 3; X.beginPath(); X.moveTo(-tw + 6, ny + 8); X.quadraticCurveTo(4, ny + 70, tw - 4, -20); X.stroke(); }
      if (c.tribal) { for (let i = 0; i < 9; i++) { const a2 = 0.3 + i * 0.3; ell(4 + Math.cos(a2) * 22, ny + 12 + Math.sin(a2) * 22, 4, 4, i % 2 ? '#e8e0c8' : '#c8402a'); } }
      if (!c.thin && !c.armour && !c.tribal && !c.clay) { X.strokeStyle = '#f0c040'; X.lineWidth = 5; X.beginPath(); X.ellipse(4, ny + 14, 24, 22, 0, 0.2, PI - 0.2); X.stroke(); }
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

    // ================================================================ NEW painters for this story
    const bowHold = d => tt => { bow(d); };
    const bowHang = d => tt => { X.save(); X.rotate(-PI / 2); bow(d); X.restore(); };
    const talk = (on, t) => on ? 0.25 + 0.45 * Math.abs(Math.sin(t * 9.5)) : 0;
    const darkTint = (a, col = '0,0,0') => { if (a <= 0) return; X.fillStyle = `rgba(${col},${a})`; X.fillRect(-600, -600, W + 1200, H + 1200); };
    const flick = (t, i = 0) => 1 + 0.12 * Math.sin(t * 13 + i * 2.1) + 0.06 * Math.sin(t * 29 + i);
    const flame = (x, y, t, i = 0, k = 1) => { const f = flick(t, i) * k; glow(x, y - 10, 90 * f, `rgba(255,200,90,${0.5 * k})`); ell(x, y - 14 * f, 9 * f, 20 * f, '#ffc23a'); ell(x, y - 9 * f, 4 * f, 9 * f, '#fff4c8'); };
    // incense smoke curls rising from (x, y)
    const smoke = (x, y, t, a = 0.18) => { X.save(); X.lineCap = 'round'; for (let k = 0; k < 3; k++) { X.strokeStyle = `rgba(230,210,255,${a * (1 - k * 0.25)})`; X.lineWidth = 10 - k * 2; X.beginPath();
      for (let q = 0; q <= 1; q += 0.04) { const yy = y - q * 520, xx = x + Math.sin(q * 7 + t * 1.3 + k * 2) * (20 + q * 60); q ? X.lineTo(xx, yy) : X.moveTo(xx, yy); } X.stroke(); } X.restore(); };
    // hanging brass lamp
    const hangLamp = (x, y, t, i = 0) => { const sw = wig(t + i, 1.1, 0.05); X.save(); X.translate(x, -200); X.rotate(sw); seg(0, 0, 0, y + 200, 3, '#b8902a');
      poly([[-34, y + 200], [34, y + 200], [18, y + 236], [-18, y + 236]], '#d8a83a'); flame(0, y + 200, t, i); X.restore(); };
    // gold pillar with capital and base
    const pillar = (x, y0, y1, w, t, col = '#d8a83a', dark = '#8a6418') => { X.fillStyle = grad(y0, y1, [[0, col], [1, dark]]); X.fillRect(x - w / 2, y0, w, y1 - y0);
      X.fillStyle = 'rgba(255,255,220,0.25)'; X.fillRect(x - w / 2 + 6, y0, w * 0.18, y1 - y0); X.fillStyle = 'rgba(0,0,0,0.25)'; X.fillRect(x + w / 4, y0, w / 4, y1 - y0);
      poly([[x - w * 0.9, y0], [x + w * 0.9, y0], [x + w * 0.6, y0 + 40], [x - w * 0.6, y0 + 40]], col); poly([[x - w * 0.8, y1], [x + w * 0.8, y1], [x + w * 0.9, y1 + 30], [x - w * 0.9, y1 + 30]], col);
      for (let k = 0; k < 4; k++) seg(x - w / 2, y0 + 120 + k * ((y1 - y0 - 200) / 3), x + w / 2, y0 + 120 + k * ((y1 - y0 - 200) / 3), 6, dark); };
    // scalloped arch between pillars
    const arch = (x0, x1, y, col) => { X.strokeStyle = col; X.lineWidth = 22; X.beginPath(); const n = 5, w = (x1 - x0) / n; X.moveTo(x0, y + 160);
      for (let k = 0; k < n; k++) X.quadraticCurveTo(x0 + w * (k + 0.5), y - (k === 2 ? 60 : 0) + (k % 2 ? 10 : 40), x0 + w * (k + 1), y + 160 * (k === n - 1 ? 1 : 0.35)); X.stroke(); };
    // polished marble floor in perspective with reflections
    const marble = (y0, t, a = '#2a1440', b = '#4a2a6a') => { X.fillStyle = grad(y0, H + 300, [[0, b], [1, a]]); X.fillRect(-600, y0, W + 1200, H + 900);
      X.strokeStyle = 'rgba(255,215,120,0.22)'; X.lineWidth = 3; for (let k = -10; k <= 10; k++) { X.beginPath(); X.moveTo(540 + k * 70, y0); X.lineTo(540 + k * 260, H + 300); X.stroke(); }
      for (let k = 0; k < 8; k++) { const yy = y0 + Math.pow(k / 7, 1.8) * (H + 300 - y0); seg(-600, yy, W + 600, yy, 3, 'rgba(255,215,120,0.18)'); } };
    // Indraprastha palace hall: royal purple + gold
    const palace = (t, k = 1) => { sky([[0, '#1a0a2e'], [0.5, '#3a1a5a'], [1, '#5a2a7a']]); glow(540, 900, 700, 'rgba(255,200,120,0.18)');
      X.fillStyle = 'rgba(255,215,120,0.07)'; for (let i = 0; i < 6; i++) { X.beginPath(); X.arc(80 + i * 185, 1000, 80, PI, 0); X.lineTo(160 + i * 185, 1300); X.lineTo(i * 185, 1300); X.fill(); }
      [60, 330, 750, 1020].forEach((x, i) => pillar(x, 260, 1420, 90, t)); arch(60, 330, 420, '#c89a2a'); arch(750, 1020, 420, '#c89a2a'); arch(330, 750, 300, '#e0b440');
      marble(1420, t); [190, 540, 890].forEach((x, i) => hangLamp(x, 380 + (i === 1 ? 80 : 0), t, i));
      motes(t, 28, 17, 'rgba(255,220,140,0.5)', [0, 200, W, 1300], 12); };
    // moonlit bedchamber: indigo + silver, big arched window, swaying curtains, lamps, incense
    const chamber = (t, lamp = 1) => { sky([[0, '#0c0e2a'], [0.6, '#1c1e4a'], [1, '#2a2458']]);
      X.save(); X.beginPath(); X.moveTo(300, 1250); X.lineTo(300, 560); X.quadraticCurveTo(540, 260, 780, 560); X.lineTo(780, 1250); X.closePath(); X.clip();
      X.fillStyle = grad(300, 1250, [[0, '#0a1440'], [1, '#3a4a8a']]); X.fillRect(300, 300, 480, 950); const r = rng(51); for (let i = 0; i < 40; i++) ell(300 + r() * 480, 340 + r() * 700, 2, 2, `rgba(240,240,255,${0.4 + 0.6 * Math.abs(Math.sin(t * 1.4 + i))})`);
      glow(640, 560, 200, 'rgba(210,220,255,0.5)'); ell(640, 560, 64, 64, '#eef0ff'); ell(620, 548, 12, 10, 'rgba(0,0,40,0.08)');
      X.fillStyle = '#141840'; for (let k = 0; k < 4; k++) { X.beginPath(); X.arc(360 + k * 120, 1250, 70, PI, 0); X.fill(); } X.restore();
      X.strokeStyle = '#b8b8d8'; X.lineWidth = 18; X.beginPath(); X.moveTo(300, 1250); X.lineTo(300, 560); X.quadraticCurveTo(540, 260, 780, 560); X.lineTo(780, 1250); X.stroke();
      X.fillStyle = 'rgba(190,200,255,0.10)'; X.beginPath(); X.moveTo(300, 1250); X.lineTo(780, 1250); X.lineTo(1000, 1900); X.lineTo(100, 1900); X.fill();  // moonlight on the floor
      [[-1, 250], [1, 830]].forEach(([s, x]) => { const sw = wig(t, 0.9, 26) * s; X.fillStyle = 'rgba(200,170,255,0.30)'; X.beginPath(); X.moveTo(x - 130, 240); X.lineTo(x + 130, 240); X.quadraticCurveTo(x + 40 * s + sw, 900, x + 70 * s + sw * 1.6, 1420); X.lineTo(x - 70 * s + sw, 1420); X.quadraticCurveTo(x - 30 * s + sw * 0.5, 800, x - 130, 240); X.fill(); });
      X.fillStyle = grad(1400, H, [[0, '#2a2050'], [1, '#100c26']]); X.fillRect(-600, 1400, W + 1200, 900); seg(-600, 1400, W + 600, 1400, 6, 'rgba(220,220,255,0.25)');
      // lamp stands
      [[90, 1400], [990, 1400]].forEach(([x, y], i) => { seg(x, y, x, y - 300, 10, '#a08a5a'); ell(x, y - 300, 40, 10, '#c8a050'); flame(x, y - 304, t, i, lamp); });
      smoke(150, 1260, t); X.fillStyle = '#6a5a8a'; X.fillRect(140, 1250, 20, 30); darkTint(0.35 * (1 - lamp), '6,6,30'); };
    // low royal couch
    const couch = (x, y, w) => { X.fillStyle = '#5a2a6a'; K.rrect(X, x - w / 2, y - 40, w, 60, 20); X.fill(); X.fillStyle = '#e0b440'; X.fillRect(x - w / 2, y + 10, w, 12);
      [x - w / 2 + 20, x + w / 2 - 30].forEach(px => { X.fillStyle = '#c89a2a'; X.fillRect(px, y + 20, 14, 90); }); ell(x - w / 2 + 40, y - 54, 50, 26, '#d84a8a'); };
    // the unborn child, curled inside a warm rose-gold glow
    const womb = (cx, cy, s, t, o = {}) => { const { eyes = 'closed', k = 1 } = o; X.save(); X.translate(cx, cy); X.scale(s, s);
      glow(0, 0, 320, `rgba(255,150,170,${0.55 * k})`); glow(0, 0, 200, `rgba(255,210,170,${0.6 * k})`); X.strokeStyle = `rgba(255,220,200,${0.5 * k})`; X.lineWidth = 6; X.beginPath(); X.arc(0, 0, 190 + 4 * Math.sin(t * 2.2), 0, TAU); X.stroke();
      X.rotate(0.25 + wig(t, 0.8, 0.04)); ell(10, 40, 70, 90, '#f0a890'); ell(-16, -66, 62, 58, '#f6b8a0'); ell(52, 70, 34, 50, '#e89c84', 0.5); ell(-30, 26, 26, 42, '#e89c84', -0.4);
      if (eyes === 'open') { ell(-2, -66, 7, 8, '#fff'); ell(0, -66, 3.5, 4.5, '#2a1a1a'); } else { X.strokeStyle = '#8a4a40'; X.lineWidth = 4; X.beginPath(); X.arc(-2, -66, 8, 0.2, PI - 0.2); X.stroke(); } X.restore(); };
    // Chakravyuha from above: rings of soldiers (dark heads, gold shields) with one gate in each ring
    const vyuha = (cx, cy, R, rot, t, o = {}) => { const { rings = 7, lit = -1, gap = 0.42, col = '#1e1830', sh = '#e0b440', form = 1 } = o;
      for (let i = 0; i < rings; i++) { const r = R * (0.16 + 0.84 * i / (rings - 1)), n = Math.floor(10 + r * 0.085), g0 = rot * (i % 2 ? 1 : -1) * (1 + i * 0.12) + i * 1.9;
        if (i <= lit) { X.strokeStyle = `rgba(255,210,110,${0.45})`; X.lineWidth = 26; X.beginPath(); X.arc(cx, cy, r, g0 + gap, g0 + TAU - gap); X.stroke(); }
        for (let k = 0; k < n; k++) { if (k / n > form) continue; const a = g0 + gap + (TAU - 2 * gap) * k / (n - 1), x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
          ell(x + Math.cos(a) * 9, y + Math.sin(a) * 9, 11, 11, sh); ell(x, y, 9, 9, col); } } };
    const vyuhaGround = (t, tint = '#c8a46a') => { sky([[0, tint], [1, '#8a6a42']]); const r = rng(61); for (let i = 0; i < 60; i++) ell(r() * W, r() * H * 1.4, 40 + r() * 90, 14 + r() * 20, 'rgba(90,60,30,0.10)');
      for (let i = 0; i < 10; i++) { const x = ((r() * (W + 800) + t * (24 + r() * 30)) % (W + 800)) - 400, y = r() * H; ell(x, y, 300, 80, 'rgba(255,240,210,0.07)'); } };
    // Dwaraka: teal sea and golden city on the shore
    const dwaraka = (t) => { sky([[0, '#0a4a5a'], [0.45, '#2a8a8a'], [0.7, '#9ad6c8'], [1, '#e8f0d0']]); glow(820, 420, 260, 'rgba(255,250,220,0.6)'); ell(820, 420, 70, 70, '#fffbe8');
      const r = rng(71); for (let i = 0; i < 5; i++) { const x = ((r() * W + t * (18 + i * 5)) % (W + 400)) - 200, y = 300 + r() * 300, f = wig(t * 6 + i, 1, 10); X.strokeStyle = 'rgba(20,50,60,0.7)'; X.lineWidth = 4; X.beginPath(); X.moveTo(x - 20, y + f); X.quadraticCurveTo(x - 8, y - 6, x, y); X.quadraticCurveTo(x + 8, y - 6, x + 20, y + f); X.stroke(); }
      X.fillStyle = grad(900, 1250, [[0, '#127a7a'], [1, '#0a4a5a']]); X.fillRect(-600, 960, W + 1200, 400);
      X.strokeStyle = 'rgba(230,255,240,0.45)'; X.lineWidth = 3; for (let i = 0; i < 10; i++) { const yy = 980 + i * 30; X.beginPath(); for (let k = -300; k <= W + 300; k += 30) { const v = yy + Math.sin(k * 0.025 + t * 1.6 + i) * 4; k > -300 ? X.lineTo(k, v) : X.moveTo(k, v); } X.stroke(); }
      X.fillStyle = 'rgba(255,250,220,0.35)'; X.fillRect(780, 960, 80, 300);
      // golden city across the water
      const dom = (x, y, s) => { X.fillStyle = '#e8c060'; X.fillRect(x - 40 * s, y - 120 * s, 80 * s, 120 * s); X.beginPath(); X.arc(x, y - 120 * s, 40 * s, PI, 0); X.fill(); seg(x, y - 160 * s, x, y - 200 * s, 4 * s, '#c89a2a'); ell(x, y - 200 * s, 6 * s, 6 * s, '#fff2a0'); };
      X.fillStyle = '#b89040'; X.fillRect(-100, 900, 560, 70); [[-20, 0.8], [80, 1.2], [200, 0.9], [300, 1.4], [420, 0.8]].forEach(([x, s]) => dom(x, 920, s));
      // terrace where Abhimanyu trains
      X.fillStyle = grad(1250, H, [[0, '#e8d2a0'], [1, '#b8945a']]); X.fillRect(-600, 1250, W + 1200, 900); for (let k = -6; k <= 6; k++) seg(540 + k * 90, 1250, 540 + k * 300, H + 200, 3, 'rgba(120,80,30,0.25)');
      for (let i = 0; i < 9; i++) { X.fillStyle = '#d8b878'; X.fillRect(-40 + i * 140, 1180, 26, 80); } seg(-100, 1185, W + 100, 1185, 12, '#c8a060'); };
    // Kurukshetra at a steel-blue misty dawn
    const mistField = (t, k = 1) => { sky([[0, '#2a3a52'], [0.5, '#6a7f98'], [1, '#b8c4cc']]); glow(300, 900, 300, 'rgba(255,240,220,0.35)'); ell(300, 900, 60, 60, 'rgba(255,248,235,0.85)');
      hills(1150, '#5a6a80', 60, 4); hills(1250, '#46546a', 50, 8);
      X.fillStyle = grad(1300, H, [[0, '#6a6e70'], [1, '#3a3c40']]); X.fillRect(-600, 1300, W + 1200, 900);
      const r = rng(81); for (let i = 0; i < 12; i++) { const x = ((r() * (W + 1000) + t * (20 + r() * 25)) % (W + 1000)) - 500, y = 1050 + r() * 700; ell(x, y, 360 + r() * 200, 60 + r() * 40, `rgba(220,230,240,${0.14 * k})`); } };
    const flags = (y, t, n, col) => { for (let i = 0; i < n; i++) { const x = 40 + i * (W - 80) / (n - 1); seg(x, y, x, y - 200, 4, '#2a2a34'); poly([[x, y - 200], [x + 60 + wig(t * 4 + i, 1, 10), y - 185], [x, y - 165]], col); } };
    // war tent interior (Pandava camp): saffron canvas folds lit by one lamp
    const tent = (t) => { sky([[0, '#3a1c10'], [0.5, '#8a4a22'], [1, '#c8783a']]); for (let i = 0; i < 9; i++) { const x = -60 + i * 150; X.fillStyle = i % 2 ? 'rgba(255,200,130,0.10)' : 'rgba(60,20,8,0.18)'; X.beginPath(); X.moveTo(540, -100); X.lineTo(x, 1420); X.lineTo(x + 150, 1420); X.closePath(); X.fill(); }
      seg(540, -100, 540, 1420, 22, '#4a2810'); X.fillStyle = grad(1400, H, [[0, '#5a3418'], [1, '#2a160a']]); X.fillRect(-600, 1400, W + 1200, 900); ell(540, 1600, 520, 90, 'rgba(160,40,40,0.5)');
      flame(540, 1330, t, 0); seg(540, 1340, 540, 1400, 10, '#8a6a3a'); };
    // palm-leaf manuscript
    const palmLeaf = (x, y, s, k) => { X.save(); X.translate(x, y); X.scale(s, s); X.globalAlpha *= k; glow(0, 0, 340, 'rgba(255,220,140,0.45)'); X.fillStyle = '#e8cf8a'; K.rrect(X, -300, -50, 600, 100, 40); X.fill(); X.strokeStyle = 'rgba(110,70,20,0.6)'; X.lineWidth = 3;
      for (let k2 = 0; k2 < 4; k2++) { X.beginPath(); X.moveTo(-250, -26 + k2 * 16); X.lineTo(250, -26 + k2 * 16); X.stroke(); } ell(-200, 0, 8, 8, '#6a4a20'); ell(200, 0, 8, 8, '#6a4a20'); X.restore(); };
    const rings = (x0, y0, x1, y1, t, n = 4, a = 0.8) => { for (let i = 0; i < n; i++) { const f = (t * 0.8 + i / n) % 1, x = lerp(x0, x1, f), y = lerp(y0, y1, f); X.strokeStyle = `rgba(255,220,120,${a * Math.sin(f * PI)})`; X.lineWidth = 6; X.beginPath(); X.arc(x, y, 30 + f * 50, -0.9, 0.9); X.stroke(); } };
    const petals = (t, n, seed, col = '#ff8ab8') => { const r = rng(seed); for (let i = 0; i < n; i++) { const sp = 50 + r() * 50, y = ((r() * 2200 + t * sp) % 2200) - 200, x = (r() * W + wig(t * 1.2 + i, 1, 50)) % W; X.save(); X.translate(x, y); X.rotate(t * (1 + r()) + i); ell(0, 0, 10, 6, col); X.restore(); } };

    // ================================================================ one shot per line (t = time, u = 0..1 through the line)
    const spiralPath = (cx, cy, R, rot, k, col, w = 12, dash = null) => { X.strokeStyle = col; X.lineWidth = w; X.lineCap = 'round'; if (dash) X.setLineDash(dash); X.beginPath();
      for (let q = 0; q <= k; q += 0.01) { const r = R * (1.05 - q * 0.95), a = rot + q * TAU * 2.6, x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r; q ? X.lineTo(x, y) : X.moveTo(x, y); } X.stroke(); X.setLineDash([]); };
    const spiralPt = (cx, cy, R, rot, q) => { const r = R * (1.05 - q * 0.95), a = rot + q * TAU * 2.6; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]; };
    const vignette = (col = '20,6,40', a = 0.7) => { const g = X.createRadialGradient(540, 900, 380, 540, 900, 1100); g.addColorStop(0, `rgba(${col},0)`); g.addColorStop(1, `rgba(${col},${a})`); X.fillStyle = g; X.fillRect(-600, -600, W + 1200, H + 1200); };
    const ARJ_TALK = (t, on, pt = 0) => ({ aF: [lerp(0.5, 1.5, pt) + wig(t, 2.2, 0.15) * (on ? 1 : 0), lerp(0.6, 0.2, pt)], aB: [0.1, 0.2], mouth: talk(on, t), head: -0.03 });
    // ---- shared extras (batch 21 Nov): elephant head, ten heads, follow button, weather
    const eleHead = (c, p, t) => { const S = c.skin, SD = c.skinD; ell(-30, 10, 52, 66, SD); ell(-30, 10, 40, 54, '#e8a0a0');            // ear
      ell(4, -6, 46, 50, S); X.fillStyle = S; X.beginPath(); X.moveTo(26, 6); X.quadraticCurveTo(64, 40, 50, 110); X.quadraticCurveTo(44, 140 + wig(t, 1.5, 6), 70, 150); X.lineTo(62, 162); X.quadraticCurveTo(26, 140, 30, 104); X.quadraticCurveTo(30, 60, 4, 36); X.closePath(); X.fill();
      X.strokeStyle = SD; X.lineWidth = 2.5; for (let k = 0; k < 6; k++) { X.beginPath(); X.moveTo(36 + k * 2, 50 + k * 16); X.lineTo(52 + k * 1, 48 + k * 16); X.stroke(); }
      poly([[30, 40], [58, 50], [34, 54]], '#fff8e8');                                                                                     // one tusk
      if (p.eyes === 'closed') { X.strokeStyle = '#2a1a12'; X.lineWidth = 3; X.beginPath(); X.arc(18, -2, 6, 0.2, PI - 0.2); X.stroke(); } else { ell(18, -4, 7, 7, '#fff'); ell(20, -4, 3.5, 4.5, '#1a1010'); }
      ell(4, -34, 12, 6, '#d8282a'); poly([[-34, -36], [36, -36], [30, -74], [14, -62], [0, -96], [-14, -62], [-30, -74]], '#f2c43a'); poly([[-34, -36], [36, -36], [36, -46], [-34, -46]], '#c89220'); ell(0, -50, 6, 6, '#d01838'); };
    const _head0 = head;
    const tenHeads = (c, p, t) => { const c2 = { ...c, tenHeads: false }; for (let k = 4; k >= 1; k--) { X.save(); X.translate(-k * 58, 8 + k * 4); X.scale(0.86, 0.86); _head0(c2, p, t); X.restore(); X.save(); X.translate(k * 58, 8 + k * 4); X.scale(0.86, 0.86); _head0(c2, p, t); X.restore(); } _head0(c2, p, t); };
    const followBtn = (gt, fa) => { if (gt <= fa) return; const k = K.easeBack(prog(gt, fa, fa + 0.35)), press = K.pulse(gt, fa + 1.1, 0.3), done = gt > fa + 1.25, w = 520 - press * 24;
      X.save(); X.translate(540, 1700); X.scale(k, k); X.translate(-540, -1700); X.fillStyle = done ? '#262a3a' : '#ff3b5c'; K.rrect(X, 540 - w / 2, 1645, w, 110, 55); X.fill(); X.font = '700 54px "Poppins"'; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillStyle = '#fff'; X.fillText(done ? 'FOLLOWING ✓' : '+ FOLLOW', 540, 1702); X.textBaseline = 'alphabetic';
      const hp = eo(prog(gt, fa + 0.35, fa + 1.05)), hx = 760 - hp * 200, hy = 1850 - hp * 130; X.fillStyle = 'rgba(255,255,255,0.95)'; X.strokeStyle = '#111'; X.lineWidth = 5; X.beginPath(); X.arc(hx, hy, 30 - press * 6, 0, TAU); X.fill(); X.stroke(); X.restore(); };
    const snow = (t, n, seed, a = 0.85, spd = 70) => { const r = rng(seed); for (let i = 0; i < n; i++) { const s = 2 + r() * 5, y = ((r() * 2400 + t * spd * (0.6 + r())) % 2400) - 300, x = ((r() * (W + 400) + wig(t * 0.8 + i, 1, 40)) % (W + 400)) - 200; ell(x, y, s, s, `rgba(255,255,255,${a * (0.5 + r() * 0.5)})`); } };
    const embers = (t, n, seed, col = '255,150,60') => { const r = rng(seed); for (let i = 0; i < n; i++) { const y = H + 200 - ((r() * 2400 + t * (60 + r() * 90)) % 2400), x = (r() * W + wig(t * 1.7 + i, 1, 50)) % W, a = 0.5 + 0.5 * Math.sin(t * 5 + i); glow(x, y, 10, `rgba(${col},${0.6 * a})`); ell(x, y, 3, 3, `rgba(255,230,180,${a})`); } };
    const ash = (t, n, seed) => { const r = rng(seed); for (let i = 0; i < n; i++) { const y = ((r() * 2400 + t * (30 + r() * 30)) % 2400) - 300, x = ((r() * W + t * 20 + wig(t + i, 0.7, 60)) % (W + 200)) - 100; X.save(); X.translate(x, y); X.rotate(t + i); ell(0, 0, 6, 3, 'rgba(200,195,190,0.6)'); X.restore(); } };
    const label = (txt, x, y, size, col, a = 1, font = 'Cinzel') => { if (a <= 0) return; X.save(); X.globalAlpha *= a; X.font = `700 ${size}px "${font}"`; X.textAlign = 'center'; X.fillStyle = col; X.shadowColor = 'rgba(0,0,0,0.6)'; X.shadowBlur = 18; X.fillText(txt, x, y); X.restore(); };
    const trident = (len = 300) => { seg(0, 60, 0, -len, 8, '#8a8a9a'); X.strokeStyle = '#d8dce8'; X.lineWidth = 8; X.beginPath(); X.moveTo(-40, -len + 70); X.quadraticCurveTo(-40, -len + 10, -34, -len - 30); X.moveTo(40, -len + 70); X.quadraticCurveTo(40, -len + 10, 34, -len - 30); X.moveTo(-40, -len + 70); X.lineTo(40, -len + 70); X.stroke(); poly([[-8, -len], [8, -len], [0, -len - 50]], '#d8dce8'); };
    const mace = () => { seg(0, 40, 0, -150, 12, '#8a6a3a'); ell(0, -190, 40, 48, '#c8a03a'); ell(-10, -200, 12, 14, 'rgba(255,255,220,0.5)'); };
    const sword = (broken = 0) => { seg(0, 20, 0, -20, 10, '#5a3a18'); seg(-24, -20, 24, -20, 8, '#c8a03a'); if (broken < 1) poly([[-8, -20], [8, -20], [4, -170 + broken * 100], [-1, -186 + broken * 100]], '#dde2ea'); else poly([[-8, -20], [8, -20], [5, -80], [-6, -70]], '#dde2ea'); };
    const shieldP = (r = 70, col = '#c8902a') => { ell(0, 0, r, r, '#5a3a20'); ell(0, 0, r * 0.86, r * 0.86, col); ell(0, 0, r * 0.25, r * 0.25, '#e8c060'); };
    // ---- batch 22 Nov extras: fast silhouettes (no canvas filter), rain, lightning, water, boat, owl, axe
    const sil = (who, col = '#0c0a10') => { const k = who + '_s' + col; if (!CAST[k]) { const c = CAST[who]; CAST[k] = { ...c, skin: col, skinD: col, cloth: col, clothD: col, hair: col, beard: c.beard ? col : undefined, kundal: false, gem: false }; } return k; };
    const rain = (t, n, seed, a = 0.45, ang = 0.18) => { const r = rng(seed); X.strokeStyle = `rgba(210,225,240,${a})`; X.lineWidth = 2.5; X.beginPath(); for (let i = 0; i < n; i++) { const y = ((r() * 2400 + t * (1400 + r() * 500)) % 2400) - 300, x = ((r() * (W + 600) + y * ang) % (W + 600)) - 300; X.moveTo(x, y); X.lineTo(x - 60 * ang, y - 60); } X.stroke(); };
    const bolt = (x, y, seed, a) => { if (a <= 0) return; const r = rng(seed); X.strokeStyle = `rgba(240,230,255,${a})`; X.lineWidth = 6; X.beginPath(); X.moveTo(x, y); let px = x, py = y; for (let i = 0; i < 9; i++) { px += (r() - 0.5) * 120; py += 70 + r() * 40; X.lineTo(px, py); } X.stroke(); glow(x, y + 300, 300, `rgba(200,180,255,${0.4 * a})`); };
    const water = (t, y0, top, bot, line = 'rgba(255,255,255,0.4)', h = 500) => { X.fillStyle = grad(y0, y0 + h, [[0, top], [1, bot]]); X.fillRect(-600, y0, W + 1200, h + 900); X.strokeStyle = line; X.lineWidth = 3; for (let i = 0; i < 12; i++) { const yy = y0 + 16 + i * i * 4.2; X.beginPath(); for (let k = -300; k <= W + 300; k += 30) { const v = yy + Math.sin(k * 0.02 + t * 1.4 + i) * (2 + i * 0.4); k > -300 ? X.lineTo(k, v) : X.moveTo(k, v); } X.stroke(); } };
    const boat = (x, y, s, t) => { X.save(); X.translate(x, y + wig(t, 1.6, 6)); X.scale(s, s); X.rotate(wig(t, 1.3, 0.03)); X.fillStyle = '#6a3a1e'; X.beginPath(); X.moveTo(-260, -40); X.quadraticCurveTo(0, 60, 260, -40); X.lineTo(220, 0); X.quadraticCurveTo(0, 50, -220, 0); X.closePath(); X.fill(); seg(-250, -40, 250, -40, 8, '#8a5a2e'); X.restore(); };
    const axe = () => { seg(0, 60, 0, -220, 12, '#6a4628'); X.fillStyle = '#c8ccd4'; X.beginPath(); X.moveTo(0, -200); X.quadraticCurveTo(80, -230, 92, -160); X.quadraticCurveTo(60, -150, 0, -150); X.closePath(); X.fill(); };
    const owl = (x, y, s, t, open = 1) => { X.save(); X.translate(x, y); X.scale(s, s); ell(0, 0, 50, 64, '#6a5a44'); ell(0, -50, 46, 40, '#7a6a52'); poly([[-36, -80], [-26, -110], [-14, -82]], '#6a5a44'); poly([[36, -80], [26, -110], [14, -82]], '#6a5a44'); [-18, 18].forEach(ex => { ell(ex, -50, 16, 16, '#f2d24a'); ell(ex, -50, 7 * open, 9 * open, '#111'); }); poly([[-6, -36], [6, -36], [0, -22]], '#d8a83a'); X.restore(); };
    const crow = (x, y, s) => { X.save(); X.translate(x, y); X.scale(s, s); ell(0, 0, 30, 18, '#14141a'); ell(26, -10, 13, 12, '#14141a'); poly([[36, -12], [52, -8], [36, -4]], '#3a3a3a'); seg(-28, 0, -46, 8, 8, '#14141a'); X.restore(); };
    const bigFace = (x, y, s, who, pz, t) => { X.save(); X.translate(x, y); X.scale(s, s); head(CAST[who], { ...POSE, ...pz }, t); X.restore(); };
    // ---- batch 22 Nov #2 shared extras: lion / boar / Brahma heads, ribbons, flames, snakes, elephant, dice, goat, lamps
    const lionHead = (c, p, t) => { const r = rng(5); X.fillStyle = c.mane || '#e8a020'; X.beginPath(); for (let i = 0; i <= 28; i++) { const a = i / 28 * TAU, R = (i % 2 ? 62 : 84) + wig(t * 3 + i, 1, 4); X.lineTo(-6 + Math.cos(a) * R, 4 + Math.sin(a) * R * 1.05); } X.fill();
      ell(-6, 4, 58, 62, c.maneD || '#c87810'); ell(6, 2, 40, 46, c.skin); ell(30, 22, 26, 20, c.skinD); ell(44, 12, 9, 7, '#2a1410');
      X.strokeStyle = '#3a1a10'; X.lineWidth = 3; X.beginPath(); X.moveTo(44, 18); X.lineTo(40, 30); X.stroke(); ell(32, 36, 16, 6 + (p.mouth || 0) * 14, '#5a1010'); poly([[22, 32], [26, 46 + (p.mouth || 0) * 8], [30, 32]], '#fff'); poly([[38, 32], [41, 44 + (p.mouth || 0) * 8], [44, 32]], '#fff');
      const ang = p.eyes === 'angry' || p.eyes === 'wide'; ell(20, -10, 8, 7, ang ? '#ffe040' : '#fff4d0'); ell(22, -10, 3.5, 5, '#1a1010'); X.strokeStyle = '#3a1a10'; X.lineWidth = 5; X.beginPath(); if (ang) { X.moveTo(6, -26); X.lineTo(30, -16); } else { X.moveTo(8, -22); X.quadraticCurveTo(20, -28, 32, -20); } X.stroke();
      ell(-28, -40, 12, 14, c.skinD); if (c.crown) { poly([[-34, -48], [30, -48], [24, -84], [8, -72], [0, -104], [-8, -72], [-24, -84]], '#f2c43a'); poly([[-34, -48], [30, -48], [30, -58], [-34, -58]], '#c89220'); ell(-2, -62, 6, 6, '#d01838'); } };
    const boarHead = (c, p, t) => { ell(-10, 0, 44, 46, c.skin); poly([[-30, -36], [-50, -74], [-12, -44]], c.skinD); X.fillStyle = c.skin; X.beginPath(); X.moveTo(10, -24); X.quadraticCurveTo(70, -6, 78, 18); X.lineTo(72, 40); X.quadraticCurveTo(30, 44, 0, 34); X.closePath(); X.fill();
      ell(76, 28, 9, 14, c.skinD); ell(78, 22, 3, 3, '#222'); ell(78, 34, 3, 3, '#222'); X.strokeStyle = '#fffbe8'; X.lineWidth = 8; X.lineCap = 'round'; X.beginPath(); X.moveTo(54, 36); X.quadraticCurveTo(70, 30, 66, 6); X.stroke();
      ell(24, -10, 7, 6, p.eyes === 'angry' ? '#ffe8a0' : '#fff'); ell(26, -10, 3, 4, '#111'); if (c.crown) { poly([[-30, -40], [20, -40], [14, -74], [0, -62], [-8, -90], [-16, -62], [-30, -72]], '#f2c43a'); } };
    const brahmaHeads = (c, p, t) => { const c2 = { ...c, brahma: false }; [[-56, 0.82], [56, 0.82]].forEach(([dx, s]) => { X.save(); X.translate(dx, 10); X.scale(s * (dx < 0 ? -1 : 1), s); _head0(c2, p, t); X.restore(); }); _head0(c2, p, t); };
    const ribbon = (x0, y0, len, w, t, col, a = 1, ph = 0) => { X.save(); X.globalAlpha *= a; X.fillStyle = col; X.beginPath(); const pts = []; for (let q = 0; q <= 1; q += 0.04) pts.push([x0 + q * len, y0 + Math.sin(q * 6 + t * 2.2 + ph) * 40 * q]); pts.forEach(([x, y], i) => i ? X.lineTo(x, y - w / 2) : X.moveTo(x, y - w / 2)); for (let i = pts.length - 1; i >= 0; i--) X.lineTo(pts[i][0], pts[i][1] + w / 2); X.closePath(); X.fill();
      X.strokeStyle = 'rgba(255,255,255,0.25)'; X.lineWidth = 3; X.beginPath(); pts.forEach(([x, y], i) => i ? X.lineTo(x, y - w / 4) : X.moveTo(x, y - w / 4)); X.stroke(); X.restore(); };
    const fireWall = (x0, x1, y, h, t, a = 1, seed = 3) => { const r = rng(seed); glow((x0 + x1) / 2, y - h * 0.4, (x1 - x0) * 0.7, `rgba(255,120,30,${0.45 * a})`); for (let x = x0; x <= x1; x += 26) { const f = flick(t, x * 0.07) * (0.7 + r() * 0.5), hh = h * f;
      X.fillStyle = `rgba(255,90,20,${0.85 * a})`; X.beginPath(); X.moveTo(x - 24, y); X.quadraticCurveTo(x - 10 + wig(t * 6 + x, 1, 8), y - hh * 0.6, x + wig(t * 5 + x, 1, 10), y - hh); X.quadraticCurveTo(x + 10, y - hh * 0.5, x + 24, y); X.fill();
      X.fillStyle = `rgba(255,220,90,${0.85 * a})`; X.beginPath(); X.moveTo(x - 12, y); X.quadraticCurveTo(x, y - hh * 0.5, x + wig(t * 5 + x, 1, 6), y - hh * 0.6); X.quadraticCurveTo(x + 6, y - hh * 0.3, x + 12, y); X.fill(); } };
    const snake = (x, y, s, t, col = '#2a7a3a', strike = 0) => { X.save(); X.translate(x, y); X.scale(s, s); X.strokeStyle = col; X.lineWidth = 22; X.lineCap = 'round'; X.beginPath(); for (let q = 0; q <= 1; q += 0.05) { const xx = -200 + q * 200 + strike * q * 60, yy = Math.sin(q * 9 + t * 4) * 18 * (1 - q) - q * q * 120; q ? X.lineTo(xx, yy) : X.moveTo(xx, yy); } X.stroke();
      ell(strike * 60 + 10, -128, 26, 34, col); ell(strike * 60 + 18, -136, 5, 5, '#ffe040'); seg(strike * 60 + 30, -120, strike * 60 + 52, -116, 3, '#e83030'); X.restore(); };
    const elephant = (x, y, s, t, col = '#6a6a78', run = 0) => { X.save(); X.translate(x, y); X.scale(s, s); const g = Math.sin(t * 6) * run; [[-90, 1], [70, -1]].forEach(([lx, k]) => { X.fillStyle = col; X.fillRect(lx - 24 + g * 10 * k, -110, 48, 110); });
      ell(0, -170, 160, 100, col); ell(150, -200, 70, 66, col); ell(110, -200, 60, 76, '#5a5a68'); X.strokeStyle = col; X.lineWidth = 34; X.lineCap = 'round'; X.beginPath(); X.moveTo(200, -190); X.quadraticCurveTo(250 + g * 20, -80, 210, -10); X.stroke();
      seg(196, -150, 250, -130, 10, '#fff8e8'); ell(176, -216, 6, 6, '#111'); [[-60, 1], [100, -1]].forEach(([lx, k]) => { X.fillStyle = '#5a5a68'; X.fillRect(lx - 24 - g * 10 * k, -110, 48, 110); }); ell(-10, -250, 90, 26, '#c83030'); X.restore(); };
    const die = (x, y, s, rot, n, col = '#f2ead6', pip = '#2a1a12') => { X.save(); X.translate(x, y); X.rotate(rot); X.scale(s, s); X.fillStyle = 'rgba(0,0,0,0.3)'; K.rrect(X, -30, -20, 140, 50, 16); X.fill(); const g = X.createLinearGradient(-60, -20, 60, 20); g.addColorStop(0, col); g.addColorStop(1, '#c8bca0'); X.fillStyle = g; K.rrect(X, -64, -26, 128, 52, 14); X.fill();
      for (let i = 0; i < n; i++) ell(-44 + (i % 3) * 22 + (i > 2 ? 44 : 0), -8 + (i % 2) * 16, 6, 6, pip); X.restore(); };
    const goat = (x, y, s, t, col = '#f0eadc') => { X.save(); X.translate(x, y); X.scale(s, s); [[-50], [-30], [40], [60]].forEach(([lx]) => seg(lx, -60, lx, 0, 10, '#8a8070')); ell(0, -80, 80, 40, col); ell(90, -120, 30, 22, col); poly([[100, -138], [120, -170], [108, -134]], '#a89a80'); poly([[80, -138], [70, -176], [88, -136]], '#a89a80'); ell(98, -124, 4, 4, '#222'); poly([[110, -104], [114, -84], [104, -102]], '#ddd'); X.restore(); };
    const diya = (x, y, t, i = 0, k = 1) => { ell(x, y, 22, 9, '#b8642a'); ell(x, y - 3, 16, 5, '#e8a050'); flame(x + 8, y - 6, t, i, 0.7 * k); };
    // ================================================================ Shakuni look: dungeon slate-grey + candle amber + ivory bone; Hastinapura dice hall with a red/ivory chaupar cloth;
    // the folk part told on a backlit TOLU BOMMALATA shadow-puppet screen (amber screen, coloured translucent puppets); ending = two ivory dice rolling to a stop on the board, candle flicker
    Object.assign(CAST, {
      shakuni: { skin: '#b88a6a', skinD: '#987050', cloth: '#3a4a5a', clothD: '#26323e', hair: '#1a1410', beard: '#2a221a', crown: 'gold', thin: true },
      shakY:   { skin: '#b88a6a', skinD: '#987050', cloth: '#4a4a52', clothD: '#2e2e34', hair: '#1a1410', thin: true },
      duryo:   { skin: '#a8724a', skinD: '#885434', cloth: '#8a1a2a', clothD: '#641020', hair: '#140c08', crown: 'gold' },
      yudhi:   { skin: '#9a6a44', skinD: '#7a5030', cloth: '#e8e4da', clothD: '#c0b8a8', hair: '#140c08', crown: 'gold' },
      subala:  { skin: '#a89080', skinD: '#887060', cloth: '#4a4450', clothD: '#2e2a34', hair: '#d8d8d8', beard: '#e8e8e8', thin: true },
      bro:     { skin: '#a08070', skinD: '#806050', cloth: '#4a4450', clothD: '#2e2a34', hair: '#1a1410', thin: true },
      gandhari:{ skin: '#c8906a', skinD: '#a6704a', cloth: '#8a2a6a', clothD: '#641a4a', hair: '#140a10', female: true, thin: true },
    });
    const chaupar = (cx, cy, s) => { X.save(); X.translate(cx, cy); X.scale(s, s * 0.45); X.fillStyle = '#7a1a1a'; X.fillRect(-420, -420, 840, 840); X.fillStyle = '#f2e6cc'; X.fillRect(-120, -420, 240, 840); X.fillRect(-420, -120, 840, 240); X.fillStyle = '#7a1a1a'; X.fillRect(-60, -60, 120, 120);
      X.strokeStyle = '#7a1a1a'; X.lineWidth = 6; for (let i = -2; i <= 2; i++) { seg(-120, i * 80, 120, i * 80, 4, '#7a1a1a'); seg(i * 80, -120, i * 80, 120, 4, '#7a1a1a'); } for (let k = 1; k < 3; k++) { seg(-420, -120 + k * 80, -120, -120 + k * 80, 4, '#7a1a1a'); seg(120, -120 + k * 80, 420, -120 + k * 80, 4, '#7a1a1a'); seg(-120 + k * 80, -420, -120 + k * 80, -120, 4, '#7a1a1a'); seg(-120 + k * 80, 120, -120 + k * 80, 420, 4, '#7a1a1a'); } X.restore(); };
    const diceHall = (t, dark = 0) => { sky([[0, '#1a1614'], [0.6, '#2e2620'], [1, '#3e3228']]); for (let i = 0; i < 5; i++) { const x = 20 + i * 260; X.fillStyle = grad(200, 1420, [[0, '#5a4a3a'], [1, '#2a2018']]); X.fillRect(x - 45, 200, 90, 1220); poly([[x - 60, 200], [x + 60, 200], [x + 45, 236], [x - 45, 236]], '#8a6a3a'); }
      X.fillStyle = grad(1420, H, [[0, '#3a2e24'], [1, '#14100c']]); X.fillRect(-600, 1420, W + 1200, 900); [[140, 1400], [940, 1400]].forEach(([x, y], i) => { seg(x, y, x, y - 300, 10, '#8a6a3a'); flame(x, y - 304, t, i); }); darkTint(dark); };
    const shadowScreen = (t, k = 1) => { sky([[0, '#0c0806'], [1, '#1a120c']]); X.fillStyle = '#3a2416'; X.fillRect(40, 300, 1000, 1180); const g = X.createRadialGradient(540, 900, 100, 540, 900, 720); g.addColorStop(0, `rgba(255,214,140,${k})`); g.addColorStop(1, `rgba(200,120,50,${k})`); X.fillStyle = g; X.fillRect(70, 330, 940, 1120);
      X.fillStyle = 'rgba(120,60,20,0.25)'; for (let i = 0; i < 12; i++) X.fillRect(70, 360 + i * 92, 940, 3); flame(540, 1500, t, 0, 1.2); X.fillStyle = '#140c08'; X.fillRect(-600, 1480, W + 1200, 900); for (let i = 0; i < 3; i++) ell(300 + i * 240, 1520, 90, 30, '#0c0806'); };
    // translucent coloured leather puppet (tholu bommalata): a normal puppet drawn semi-transparent, with a dark outline glow, and stick rods
    const leather = (x, y, s, who, pz, t, o = {}) => { X.save(); X.globalAlpha *= 0.82; X.shadowColor = 'rgba(60,20,0,0.8)'; X.shadowBlur = 12; puppet(x, y, s, who, pz, t, { ...o, shadow: false }); X.restore(); seg(x, y - 250 * s, x + 30, y + 300, 3, 'rgba(40,20,10,0.7)'); };
    const dungeon = (t, k = 1) => { sky([[0, '#14161a'], [0.6, '#22262c'], [1, '#2e3238']]); X.fillStyle = 'rgba(0,0,0,0.25)'; for (let y = 200; y < 1500; y += 90) for (let x = (y / 90 % 2) * 70; x < W; x += 140) X.fillRect(x, y, 134, 84);
      X.fillStyle = 'rgba(255,220,160,0.12)'; X.beginPath(); X.moveTo(470, 300); X.lineTo(610, 300); X.lineTo(820, 1500); X.lineTo(300, 1500); X.fill(); X.fillStyle = '#0a0c10'; X.fillRect(470, 260, 140, 60); for (let i = 0; i < 4; i++) seg(490 + i * 34, 262, 490 + i * 34, 318, 6, '#3a3e44');
      X.fillStyle = grad(1500, H, [[0, '#2a2c30'], [1, '#0c0d10']]); X.fillRect(-600, 1500, W + 1200, 900); motes(t, 20, 5, 'rgba(255,230,190,0.4)', [380, 320, 360, 1100], 6); };
    const bars = (a = 1) => { for (let i = 0; i < 9; i++) { const x = -20 + i * 140; X.fillStyle = `rgba(30,32,36,${a})`; X.fillRect(x, -200, 26, H + 400); X.fillStyle = `rgba(160,160,170,${0.25 * a})`; X.fillRect(x + 4, -200, 5, H + 400); } X.fillStyle = `rgba(30,32,36,${a})`; X.fillRect(-100, 260, W + 200, 30); };
    const riceBowl = (x, y, s, n = 1) => { X.save(); X.translate(x, y); X.scale(s, s); ell(0, 0, 90, 26, '#8a6a4a'); X.fillStyle = '#6a4a2a'; X.beginPath(); X.ellipse(0, 0, 90, 60, 0, 0, PI); X.fill(); const r = rng(2); for (let i = 0; i < 26 * n; i++) ell(-50 + r() * 100, -6 - r() * 22 * n, 6, 3, '#f6f2e6', r()); X.restore(); };
    const boneDie = (x, y, s, rot, n, t) => { glow(x, y, 90 * s, 'rgba(255,240,210,0.45)'); die(x, y, s, rot, n, '#f4ecd8', '#5a2a1a'); };
    const C = {
      hook: (t, u) => { cam(540, sm(1200, 1300, u), sm(1.25, 1.05, u), () => { diceHall(t); puppet(540, 1440, 1.25, 'shakuni', { aF: [lerp(1.2, 1.7, Math.abs(Math.sin(t * 3))), 0.6], aB: [0.6, 0.8], eyes: 'angry', smile: true, crouch: 0 }, t, {}); chaupar(540, 1580, 0.9); boneDie(470, 1600 - Math.abs(Math.sin(t * 5)) * 60, 0.55, t * 4, 3, t); boneDie(620, 1600 - Math.abs(Math.cos(t * 5)) * 60, 0.55, -t * 4, 5, t); label('?', 880, 620, 160, '#f2e6cc', eo(clamp((u - 0.55) * 3)), 'Poppins'); }); },
      truth: (t, u) => { cam(540, 1250, 1.0, () => { diceHall(t, 0.1); palmLeaf(540, 620, 0.9, eo(clamp(u * 2))); label('Vyaasa Mahaabhaaratham', 540, 790, 52, '#f2e6cc', eo(clamp(u * 2))); puppet(360, 1780, 1.2, 'shakuni', { aF: [1.3, 0.6], eyes: 'open', smile: true }, t, {}); puppet(720, 1780, 1.25, 'duryo', { aF: [0.5, 0.5], eyes: 'open', smile: true }, t, { f: -1 }); }); },
      folk: (t, u) => { cam(540, 1150, sm(1.2, 1.0, u), () => { shadowScreen(t, eo(clamp(u * 1.5))); label('jaanapada katha', 540, 560, 64, '#3a1a08', eo(clamp((u - 0.2) * 2)), 'Cinzel'); leather(540, 1380, 1.0, 'shakY', { aF: [0.6, 0.6], eyes: 'sad' }, t); }); },
      goat: (t, u) => { cam(540, 1150, 1.0, () => { shadowScreen(t); leather(320, 1380, 0.95, 'gandhari', { aF: [1.2, 1.4], eyes: 'sad' }, t); X.save(); X.globalAlpha *= 0.85; goat(640, 1380, 1.2, t, '#e8d8b8'); X.restore(); marigoldSwagsS(t); }); },
      anger: (t, u) => { cam(540, 1150, 1.0, () => { shadowScreen(t); darkTint(0.15, '120,0,0'); leather(300, 1380, 1.0, 'duryo', { aF: [lerp(0.4, 1.7, eo(clamp(u * 3))), 0.1], eyes: 'angry', mouth: talk(u > 0.4, t) }, t); leather(520, 1380, 0.95, 'duryo', { aF: [2.4, 0.3], eyes: 'angry' }, t); leather(800, 1380, 0.95, 'subala', { aF: [1.6, 1.4], eyes: 'wide', lean: -0.15 }, t, { f: -1 }); }); },
      prison: (t, u) => { cam(540, 1250, sm(1.15, 1.0, u), () => { dungeon(t); for (let i = 0; i < 6; i++) seated(130 + i * 165, 1750, 0.62, i === 0 ? 'subala' : i === 3 ? 'shakY' : 'bro', { aF: [0.9, 0.9], aB: [0.6, 0.9], eyes: 'sad', head: 0.15 }, t); bars(eo(clamp(u * 2.5))); }); },
      rice: (t, u) => { cam(540, 1300, sm(1.6, 1.85, u), () => { dungeon(t); glow(540, 1450, 260, 'rgba(255,230,180,0.5)'); riceBowl(540, 1470, 1.6, 0.6); label('1', 540, 1120, 120, '#f2e6cc', eo(clamp((u - 0.4) * 3)), 'Cinzel'); }); },
      choose: (t, u) => { const k = eo(clamp((u - 0.2) / 0.6)); cam(540, 1250, 1.05, () => { dungeon(t); [[150, 'bro'], [310, 'subala'], [770, 'bro'], [930, 'bro']].forEach(([x, w], i) => seated(x, 1750, 0.62, w, { aF: [i < 2 ? 1.4 : 1.2, 0.3], eyes: 'sad', head: 0.1 }, t, { f: i < 2 ? 1 : -1 }));
        seated(540, 1750, 0.66, 'shakY', { aF: [0.9, 0.9], eyes: 'wide' }, t); riceBowl(lerp(300, 540, k), 1690, 0.7, 0.6); glow(540, 1600, 160 * k, 'rgba(255,230,180,0.4)'); }); },
      die: (t, u) => { cam(540, 1250, 1.05, () => { dungeon(t); darkTint(0.2); [[150, 0.15], [310, 0.35], [770, 0.55], [930, 0.75]].forEach(([x, f]) => { const a = 1 - eo(clamp((u - f) / 0.2)); X.save(); X.globalAlpha *= Math.max(0.12, a); seated(x, 1750, 0.62, 'bro', { aF: [0.6, 0.4], eyes: 'closed', head: 0.4 }, t, { f: x < 540 ? 1 : -1 }); X.restore(); });
        seated(540, 1750, 0.66, 'shakY', { aF: [1.6, 1.5], aB: [1.4, 1.6], eyes: 'pain', head: 0.15 }, t); }); },
      leg: (t, u) => { const hit = clamp((u - 0.35) / 0.1), [sx, sy] = shake(t, hit > 0 && hit < 1 ? 10 : 0); cam(540 + sx, 1250 + sy, 1.0, () => { dungeon(t); darkTint(0.3); X.save(); X.globalAlpha *= 0.4; X.translate(540, 1500); X.scale(1.7, 1.7); puppet(-80, 0, 1, sil('subala', '#000'), { aF: [lerp(2.6, 1.2, hit), 0.2] }, t, { shadow: false, holdF: tt => mace() }); X.restore();
        puppet(320, 1780, 1.05, 'subala', { aF: [lerp(2.6, 1.2, hit), 0.2], eyes: 'sad', mouth: talk(u > 0.5, t) }, t, { holdF: tt => mace() }); puppet(700, 1780, 1.0, 'shakY', { lB: [-0.4 * hit, 0.6 * hit], crouch: 40 * hit, eyes: hit > 0 ? 'pain' : 'wide', lean: -0.1 * hit }, t, { f: -1 }); if (hit > 0 && hit < 1) glow(720, 1650, 120, 'rgba(255,255,255,0.7)'); }); },
      bones: (t, u) => { const k = eo(clamp((u - 0.45) / 0.35)); cam(540, 1150, 1.05, () => { sky([[0, '#06070a'], [1, '#14161a']]); X.save(); X.globalAlpha *= 0.55 * (1 - k * 0.5); glow(540, 800, 400, 'rgba(180,200,230,0.3)'); bigFace(540, 860, 5.5, 'subala', { eyes: 'sad', mouth: talk(u < 0.6, t) * 0.6 }, t); X.restore();
        if (k > 0) { boneDie(400, 1400, 1.6 * k, 0.2 + (1 - k) * 4, 6, t); boneDie(690, 1430, 1.6 * k, -0.3 - (1 - k) * 4, 4, t); } flame(540, 1700, t, 0, 1.2); }); },
      game: (t, u) => { cam(540, 1250, 1.0, () => { diceHall(t); puppet(230, 1500, 1.15, 'shakuni', { aF: [lerp(1.2, 1.7, Math.abs(Math.sin(t * 3))), 0.5], eyes: 'open', smile: true, mouth: talk(u < 0.5, t) * 0.5 }, t, {}); puppet(850, 1500, 1.15, 'yudhi', { aF: [1.4, 1.4], aB: [1.2, 1.5], eyes: 'sad', head: 0.2 }, t, { f: -1 }); chaupar(540, 1640, 0.95);
        const f = (u * 3) % 1; boneDie(lerp(330, 560, f), 1600 - Math.sin(f * PI) * 160, 0.5, f * 9, 6, t); label('Kurukshethram', 540, 620, 64, '#e8c8a0', eo(clamp((u - 0.6) * 3)), 'Cinzel'); }); },
      end: (t, u) => { cam(540, 1250, sm(1.1, 0.95, u), () => { diceHall(t, 0.25); chaupar(540, 1560, 0.6); puppet(lerp(300, 620, u), 1800, 1.1, 'shakuni', { lB: [Math.sin(t * 3) * 0.3, -Math.abs(Math.sin(t * 3)) * 0.4], lF: [-Math.sin(t * 3) * 0.15, 0], aF: [0.4, 0.3], eyes: 'sad', head: 0.12, lean: 0.06 * Math.sin(t * 3) }, t, {}); }); },
      cta: (t, u) => { const f = eo(clamp(u * 1.4)); cam(540, 1500, 1.7, () => { diceHall(t, 0.3); chaupar(540, 1620, 0.95); boneDie(lerp(200, 470, f), 1600 - Math.abs(Math.sin(f * PI * 2.5)) * 80 * (1 - f), 0.6, (1 - f) * 12 + 0.15, 5, t); boneDie(lerp(880, 620, f), 1620 - Math.abs(Math.sin(f * PI * 3)) * 80 * (1 - f), 0.6, -(1 - f) * 12 - 0.2, 6, t); flame(250, 1350, t, 1); flame(830, 1350, t, 2); });
        followBtn(t, B('cta') + 0.6); },
    };
    function marigoldSwagsS(t) { for (let i = 0; i < 4; i++) { const x0 = 70 + i * 235; for (let q = 0; q <= 1.001; q += 0.08) ell(lerp(x0, x0 + 235, q), 360 + Math.sin(q * PI) * 70, 11, 11, 'rgba(120,40,10,0.7)'); } }
    const SFX = [['bass', 0.05, 0.6], ['thud', F('hook', 0.3), 0.5], ['thud', F('hook', 0.5), 0.5], ['chime', F('truth', 0.3), 0.5], ['whoosh', B('folk'), 0.5], ['chime', F('goat', 0.4), 0.4], ['bass', F('anger', 0.4), 0.8], ['thud', F('prison', 0.3), 0.8],
      ['chime', F('rice', 0.4), 0.4], ['whoosh', F('choose', 0.4), 0.3], ['bass', F('die', 0.5), 0.6], ['thud', F('leg', 0.38), 1.0], ['riser', B('bones'), 0.5], ['chime', F('bones', 0.6), 0.6], ['thud', F('game', 0.3), 0.5], ['bass', F('game', 0.7), 0.8], ['thud', F('cta', 0.3), 0.5], ['pop', B('cta') + 0.6, 0.5], ['ding', B('cta') + 1.7, 0.55]];
    const card = (i, t, alpha) => { const l = L[i], a = l.t - XF, b = i + 1 < N ? L[i + 1].t : D, u = prog(t, a, b), id = LINES[i].id; X.save(); X.globalAlpha = alpha; C[id](t, u); X.restore(); };
    const update = t => { tex.redraw((x) => { X = x; X.globalAlpha = 1; X.fillStyle = '#000'; X.fillRect(0, 0, W, H);
      let i = 0; for (let k = 0; k < N; k++) if (t >= L[k].t - XF) i = k;
      const st = L[i].t - XF; if (i > 0 && t < st + XF * 2) { card(i - 1, t, 1); card(i, t, ease(prog(t, st, st + XF * 2))); } else card(i, t, 1);
      const vg = X.createRadialGradient(540, 960, 650, 540, 960, 1200); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.32)'); X.fillStyle = vg; X.fillRect(0, 0, W, H);
      if (t < 0.4) { X.fillStyle = `rgba(0,0,0,${1 - t / 0.4})`; X.fillRect(0, 0, W, H); } }); };
    const sfx = SFX.filter(s => isFinite(s[1]));
    return { duration: D, update, shots: [{ t: [0, 1], from: { pos: [0, 0, 1], look: [0, 0, 0] } }], sfx, watermark: false, endCard: false, music: {}, capFont: 'Fredoka Light', capMarginV: 520, capSize: 64 };
  },
};
