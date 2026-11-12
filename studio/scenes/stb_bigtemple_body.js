// Brihadeeswarar Temple, Thanjavur: myth-buster reel in a bright cel-shaded comic look (toon shading + ink outlines + halftone wipes).
// 1 unit = 3 m (tower top ~22 units = 66 m). Every visual is a pure function of t.
window.SCENE = {
  setup: { bg: 0x8fd0ff, fog: [160, 620], fov: 40, bloom: { strength: 0.22, radius: 0.4, threshold: 0.95 } },
  lines: window.STB_LINES,
  build(K, T) {
    const L = T.lines, IDX = {}; window.STB_LINES.forEach((l, i) => { IDX[l.id] = i; });
    const B = n => L[IDX[n]].t, E = n => L[IDX[n]].end, F = (n, f) => B(n) + (E(n) - B(n)) * f;
    const D = E('cta') + 1.6;
    const THREE = window.THREE, S = K.scene;
    const ease = K.ease, eo = K.easeOut, prog = K.prog, clamp = K.clamp, lerp = K.lerp;
    K.renderer.shadowMap.type = THREE.PCFSoftShadowMap; K.renderer.toneMappingExposure = 1.0;

    // ---------------------------------------------------------------- sky, sun
    const sky = (stops) => K.canvasTex(64, 512, (x, w, h) => { const g = x.createLinearGradient(0, 0, 0, h); stops.forEach(([o, c]) => g.addColorStop(o, c)); x.fillStyle = g; x.fillRect(0, 0, w, h); });
    const skyDay = sky([[0, '#2f8cff'], [0.55, '#9ad6ff'], [1, '#fff1c9']]), skyEve = sky([[0, '#3b2a7a'], [0.5, '#ff7a59'], [1, '#ffd08a']]);
    S.background = skyDay; S.fog = new THREE.Fog(0xcfeaff, 160, 620);
    const hemi = new THREE.HemisphereLight(0xdff2ff, 0x8a6a3a, 1.25); S.add(hemi); S.add(new THREE.AmbientLight(0xffffff, 0.25));
    const sun = new THREE.DirectionalLight(0xfff2d6, 2.6); sun.castShadow = true; sun.shadow.mapSize.set(4096, 4096); sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.04;
    Object.assign(sun.shadow.camera, { left: -62, right: 62, top: 62, bottom: -62, near: 1, far: 260 }); S.add(sun); S.add(sun.target);

    // ---------------------------------------------------------------- toon materials + ink outlines
    const gm = new THREE.DataTexture(new Uint8Array([70, 150, 255]), 3, 1, THREE.RedFormat); gm.minFilter = gm.magFilter = THREE.NearestFilter; gm.needsUpdate = true;
    const tm = (c, o = {}) => new THREE.MeshToonMaterial(Object.assign({ color: c, gradientMap: gm }, o));
    const ink = new THREE.MeshBasicMaterial({ color: 0x1a1020, side: THREE.BackSide });
    const outline = (m, w = 0.07) => { m.geometry.computeBoundingSphere(); const r = m.geometry.boundingSphere.radius || 1; const o = new THREE.Mesh(m.geometry, ink); o.scale.setScalar(1 + w / r); m.add(o); return m; };
    const mesh = (geo, m, x, y, z, parent = S, ol = true) => { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); o.castShadow = o.receiveShadow = true; parent.add(o); if (ol) outline(o); return o; };
    const bx = (w, h, d, m, x, y, z, parent, ol) => mesh(new THREE.BoxGeometry(w, h, d), m, x, y + h / 2, z, parent, ol);
    const SAND = tm(0xe2a96a), SAND2 = tm(0xcf8f52), PAVE = tm(0xf3d9a6), WALL = tm(0xc98654), DARK = tm(0x3a2a24), GOLDM = tm(0xffc53a, { emissive: 0x6a4000 }), NANDI = tm(0x4a4a56);
    const GRASS = [tm(0x6cc04a), tm(0x86d35a), tm(0x5aae3e), tm(0x9adf6a)], WATER = tm(0x4fb6e8), SOIL = tm(0xa8834e), GRANITE = tm(0x9a9aa6), GREY = tm(0x8d909c), ROPE = tm(0xc9a46a);

    // ---------------------------------------------------------------- land: Kaveri delta paddies + far hills
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(1400, 1400), SOIL); ground.rotation.x = -Math.PI / 2; ground.position.y = -0.05; ground.receiveShadow = true; S.add(ground);
    { const rr = K.rng(3), N = 1300, ims = GRASS.map(m => new THREE.InstancedMesh(new THREE.BoxGeometry(1, 0.3, 1), m, N)), cnt = [0, 0, 0, 0], o = new THREE.Object3D();
      for (let gx = -40; gx < 40; gx++) for (let gz = -40; gz < 40; gz++) { const x = gx * 9 + 4.5, z = gz * 9 + 4.5; if (Math.abs(x) < 26 && z > -30 && z < 50) continue; if (Math.abs(z - 60) < 6 && x < 0) continue; if (Math.hypot(x, z) > 330) continue;
        const k = Math.floor(rr() * 4); if (cnt[k] >= N) continue; o.position.set(x, 0.1, z); o.scale.set(8.2, 1, 8.2); o.rotation.set(0, 0, 0); o.updateMatrix(); ims[k].setMatrixAt(cnt[k]++, o.matrix); }
      ims.forEach((im, k) => { im.count = cnt[k]; im.receiveShadow = true; S.add(im); }); }
    for (const z of [-120, 90, 210]) { const w = new THREE.Mesh(new THREE.BoxGeometry(700, 0.2, 2.2), WATER); w.position.set(0, 0.05, z); S.add(w); }
    const road = new THREE.Mesh(new THREE.BoxGeometry(260, 0.25, 7), tm(0xd9b77a)); road.position.set(-130, 0.08, 60); road.receiveShadow = true; S.add(road);
    { const hr = K.rng(21); for (let i = 0; i < 26; i++) { const a = (i / 26) * Math.PI * 2, r = 420 + hr() * 80, h = 40 + hr() * 50; const m = new THREE.Mesh(new THREE.ConeGeometry(70 + hr() * 50, h, 6), tm(0x8aa2c8)); m.position.set(Math.cos(a) * r, h / 2 - 3, Math.sin(a) * r); S.add(m); } }
    { const tr = K.rng(9); for (let i = 0; i < 120; i++) { const a = tr() * 6.28, r = 40 + tr() * 200; const x = Math.cos(a) * r, z = Math.sin(a) * r; if (Math.abs(z - 60) < 8 && x < 0) continue; const g = new THREE.Group(); g.position.set(x, 0, z); S.add(g);
      mesh(new THREE.CylinderGeometry(0.25, 0.35, 5, 6), tm(0x8a5a2a), 0, 2.5, 0, g, false); const top = mesh(new THREE.IcosahedronGeometry(2.2 + tr(), 0), tm(0x3f9a3a), 0, 5.8, 0, g); top.scale.y = 0.8; } }

    // ---------------------------------------------------------------- temple compound
    const PZ0 = -24, PZ1 = 30, PXW = 19;
    bx(2 * PXW, 0.3, PZ1 - PZ0, PAVE, 0, 0, (PZ0 + PZ1) / 2, S, false);
    for (const [w, d, x, z] of [[2 * PXW, 1, 0, PZ0], [1, PZ1 - PZ0, -PXW, (PZ0 + PZ1) / 2], [1, PZ1 - PZ0, PXW, (PZ0 + PZ1) / 2], [PXW - 3, 1, -(PXW + 3) / 2, PZ1], [PXW - 3, 1, (PXW + 3) / 2, PZ1]]) bx(w, 3, d, WALL, x, 0, z);
    for (let z = PZ0 + 2; z < PZ1 - 1; z += 2.2) for (const sx of [-1, 1]) bx(0.5, 2.4, 0.5, SAND2, sx * (PXW - 2.2), 0, z, S, false);   // cloister pillars
    for (const sx of [-1, 1]) bx(2.6, 0.4, PZ1 - PZ0 - 2, SAND2, sx * (PXW - 1.6), 2.4, (PZ0 + PZ1) / 2, S, false);
    const gopuram = (z, s) => { const g = new THREE.Group(); g.position.set(0, 0, z); g.scale.setScalar(s); S.add(g);
      bx(7, 3.2, 4, SAND2, 0, 0, 0, g); bx(2.2, 2.8, 4.2, DARK, 0, 0, 0, g, false);
      for (let i = 0; i < 4; i++) bx(6.4 - i * 1.1, 1.2, 3.4 - i * 0.45, SAND, 0, 3.2 + i * 1.2, 0, g);
      const roof = mesh(new THREE.CylinderGeometry(1.0, 1.0, 2.6, 16, 1, false, 0, Math.PI), SAND2, 0, 8.0, 0, g); roof.rotation.z = Math.PI / 2; roof.rotation.y = Math.PI / 2;
      for (const dx of [-0.8, 0, 0.8]) mesh(new THREE.ConeGeometry(0.18, 0.6, 8), GOLDM, dx, 9.3, 0, g, false); return g; };
    gopuram(PZ1, 1.0); gopuram(PZ1 + 12, 1.18);
    // main shrine: two-storey base + front halls
    const temple = new THREE.Group(); S.add(temple);
    const base = new THREE.Group(); temple.add(base);
    bx(10, 5.5, 10, SAND, 0, 0, 0, base); bx(10.6, 0.5, 10.6, SAND2, 0, 0, 0, base, false); bx(10.5, 0.3, 10.5, SAND2, 0, 2.6, 0, base, false); bx(10.5, 0.35, 10.5, SAND2, 0, 5.2, 0, base, false);
    for (const sx of [-1, 1]) for (let k = -2; k <= 2; k++) { bx(0.9, 4.4, 0.25, SAND2, k * 2.1, 0.6, sx * 5.05, base, false); bx(0.25, 4.4, 0.9, SAND2, sx * 5.05, 0.6, k * 2.1, base, false); }
    bx(7, 4, 9, SAND, 0, 0, 9.5, base); bx(7.4, 0.4, 9.4, SAND2, 0, 4, 9.5, base, false); bx(1.8, 2.8, 0.3, DARK, 0, 0.3, 14.05, base, false);
    // vimana: 13 storeys with miniature shrines
    const tiers = [], TH = 1.05, Y0 = 5.5;
    for (let i = 0; i < 13; i++) { const g = new THREE.Group(); g.userData.y = Y0 + i * TH; g.position.y = g.userData.y; temple.add(g); tiers.push(g);
      const w = 9.4 - i * 0.5; bx(w, TH * 0.82, w, i % 2 ? SAND : SAND2, 0, 0, 0, g); bx(w + 0.3, TH * 0.18, w + 0.3, SAND2, 0, TH * 0.82, 0, g, false);
      for (const [dx, dz] of [[1, 1], [1, -1], [-1, 1], [-1, -1], [0, 1], [0, -1], [1, 0], [-1, 0]]) { const m = bx(0.55, 0.5, 0.55, SAND, dx * (w / 2 - 0.15), TH * 0.82 + 0.2, dz * (w / 2 - 0.15), g, false); if (!dx || !dz) { m.scale.x = dx ? 1 : 1.8; m.scale.z = dz ? 1 : 1.8; } } }
    const TOPY = Y0 + 13 * TH;
    // the top stone (cupola) as one movable group
    const cap = new THREE.Group(); S.add(cap);
    bx(3.2, 0.7, 3.2, SAND2, 0, 0, 0, cap); mesh(new THREE.CylinderGeometry(2.0, 2.0, 0.6, 8), SAND, 0, 1.0, 0, cap);
    const dome = mesh(new THREE.SphereGeometry(2.1, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2), SAND, 0, 1.3, 0, cap); dome.scale.y = 0.85;
    mesh(new THREE.CylinderGeometry(0.25, 0.45, 0.5, 12), GOLDM, 0, 3.25, 0, cap); mesh(new THREE.ConeGeometry(0.28, 1.0, 12), GOLDM, 0, 3.95, 0, cap);
    const capGlow = new THREE.Mesh(new THREE.SphereGeometry(3.4, 24, 16), new THREE.MeshBasicMaterial({ color: 0xffd23f, transparent: true, opacity: 0, depthWrite: false })); capGlow.position.y = 1.6; cap.add(capGlow);
    // Nandi mandapa + Nandi (one rock)
    const NZ = 19;
    bx(6, 0.8, 6, SAND2, 0, 0, NZ);
    for (const [dx, dz] of [[-2.5, -2.5], [2.5, -2.5], [-2.5, 2.5], [2.5, 2.5], [0, -2.5], [0, 2.5], [-2.5, 0], [2.5, 0]]) mesh(new THREE.CylinderGeometry(0.22, 0.26, 3.6, 8), SAND, dx, 2.6, NZ + dz, S, false);
    bx(6.4, 0.5, 6.4, SAND2, 0, 4.4, NZ); bx(4.6, 0.8, 4.6, SAND, 0, 4.9, NZ); bx(2.6, 0.7, 2.6, SAND2, 0, 5.7, NZ);
    const nandi = new THREE.Group(); nandi.position.set(0, 0.8, NZ); nandi.rotation.y = Math.PI; S.add(nandi);
    { const b = mesh(new THREE.SphereGeometry(1, 24, 16), NANDI, 0, 0.55, 0, nandi); b.scale.set(0.62, 0.48, 1.05);
      const hump = mesh(new THREE.SphereGeometry(0.32, 16, 12), NANDI, 0, 1.0, 0.45, nandi); hump.scale.set(1, 0.9, 1.1);
      const head = mesh(new THREE.SphereGeometry(0.36, 16, 12), NANDI, 0, 1.0, 1.15, nandi); head.scale.set(0.85, 1, 1.15);
      mesh(new THREE.SphereGeometry(0.24, 12, 10), NANDI, 0, 0.86, 1.45, nandi).scale.set(1, 0.8, 0.9);
      for (const s of [-1, 1]) { const h = mesh(new THREE.ConeGeometry(0.07, 0.4, 8), NANDI, s * 0.22, 1.36, 1.05, nandi); h.rotation.z = -s * 0.5; const ear = mesh(new THREE.SphereGeometry(0.12, 8, 6), NANDI, s * 0.36, 1.12, 1.0, nandi); ear.scale.set(1.4, 0.5, 0.8);
        const leg = mesh(new THREE.CapsuleGeometry(0.13, 0.5, 4, 8), NANDI, s * 0.42, 0.18, 0.55, nandi); leg.rotation.x = Math.PI / 2; }
      mesh(new THREE.TorusGeometry(0.3, 0.05, 8, 20), GOLDM, 0, 0.82, 1.18, nandi).rotation.x = 1.2; }
    // granite blocks for the exploded view
    const NGB = 260, gblocks = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 0.6, 0.7), GRANITE, NGB); gblocks.castShadow = true; S.add(gblocks);
    const gr = K.rng(12), gbp = Array.from({ length: NGB }, () => ({ a: gr() * 6.28, r: 7 + gr() * 9, y: 2 + gr() * 22, s: 0.5 + gr() * 0.8, sp: 0.2 + gr() * 0.5 }));
    // 20-storey glass tower for scale
    const glass = new THREE.Group(); glass.position.set(27, 0, 0); S.add(glass);
    const FL = 20, FH = 22 / FL, floors = [];
    for (let i = 0; i < FL; i++) { const f = new THREE.Mesh(new THREE.BoxGeometry(7, FH * 0.92, 7), new THREE.MeshToonMaterial({ color: 0x8fd3ff, gradientMap: gm, transparent: true, opacity: 0.55 })); f.position.y = i * FH + FH / 2; glass.add(f);
      const e = new THREE.LineSegments(new THREE.EdgesGeometry(f.geometry), new THREE.LineBasicMaterial({ color: 0x1a1020 })); f.add(e); floors.push(f); }
    // elephants
    const elephant = (s) => { const g = new THREE.Group(); g.scale.setScalar(s); S.add(g);
      mesh(new THREE.SphereGeometry(0.62, 18, 12), GREY, 0, 0.95, 0, g).scale.set(1.25, 0.9, 0.85); mesh(new THREE.SphereGeometry(0.42, 16, 12), GREY, 0.82, 1.18, 0, g);
      for (const sz of [-1, 1]) mesh(new THREE.SphereGeometry(0.36, 12, 8), GREY, 0.66, 1.2, sz * 0.42, g).scale.set(0.25, 1, 0.9);
      mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(1.12, 1.08, 0), new THREE.Vector3(1.35, 0.7, 0), new THREE.Vector3(1.3, 0.25, 0), new THREE.Vector3(1.42, 0.1, 0)]), 16, 0.11, 8), GREY, 0, 0, 0, g);
      const legs = [[0.45, 0.3], [0.45, -0.3], [-0.45, 0.3], [-0.45, -0.3]].map(([lx, lz]) => mesh(new THREE.CylinderGeometry(0.15, 0.17, 0.7, 10), GREY, lx, 0.35, lz, g));
      for (const sz of [-1, 1]) mesh(new THREE.ConeGeometry(0.05, 0.4, 6), tm(0xfff4dc), 1.12, 0.85, sz * 0.16, g, false).rotation.z = -2.2;
      g.legs = legs; return g; };
    const convoy = Array.from({ length: 6 }, (_, i) => { const e = elephant(2.0); const sled = bx(2.4, 1.3, 1.8, GRANITE, 0, 0, 0, S); return { e, sled, i }; });
    // the ramp (legend): an earth causeway from the tower top out to the -x side
    const RS = 0.07, RTOP = new THREE.Vector3(-4.6, TOPY, 0), RL = TOPY / RS;          // ramp falls to the ground RL units away
    const rampG = new THREE.Group(); rampG.position.set(RTOP.x, 0, 0); S.add(rampG);
    { const sh = new THREE.Shape(); sh.moveTo(0, 0); sh.lineTo(0, TOPY); sh.lineTo(-RL, 0); sh.closePath();
      const geo = new THREE.ExtrudeGeometry(sh, { depth: 4.2, bevelEnabled: false }); geo.translate(0, 0, -2.1);
      const m = new THREE.Mesh(geo, SOIL); m.castShadow = m.receiveShadow = true; rampG.add(m);
      const top = new THREE.Mesh(new THREE.BoxGeometry(Math.hypot(RL, TOPY), 0.25, 4.6), tm(0x7a5a32)); top.position.set(-RL / 2, TOPY / 2 + 0.1, 0); top.rotation.z = Math.atan(RS); rampG.add(top); }
    const pullers = Array.from({ length: 5 }, () => elephant(0.9));
    const people = Array.from({ length: 10 }, () => { const g = new THREE.Group(); S.add(g); mesh(new THREE.CapsuleGeometry(0.14, 0.45, 4, 8), tm(0xf3eee2), 0, 0.42, 0, g, false); mesh(new THREE.SphereGeometry(0.13, 10, 8), tm(0x8a5a3a), 0, 0.85, 0, g, false); return g; });
    const ropes = Array.from({ length: 2 }, () => { const r = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1, 6), ROPE); S.add(r); return r; });

    // ---------------------------------------------------------------- HUD (comic style)
    const hudTex = K.canvasTex(1080, 1920, () => {});
    const hudScene = new THREE.Scene(), hudCam = new THREE.OrthographicCamera(-540, 540, 960, -960, -10, 10);
    hudScene.add(new THREE.Mesh(new THREE.PlaneGeometry(1080, 1920), new THREE.MeshBasicMaterial({ map: hudTex, transparent: true, toneMapped: false, depthTest: false })));
    K.draw = () => { K.composer.render(); const r = K.renderer; r.autoClear = false; r.clearDepth(); r.render(hudScene, hudCam); r.autoClear = true; };
    const YEL = '#ffd23f', RED = '#ff3b30', GRN = '#2ecc71', BLU = '#3fa9f5', INKC = '#1a1020', WHT = '#ffffff';
    const fade = (t, a, b = 1e9) => prog(t, a, a + 0.2) * (1 - prog(t, b, b + 0.2));
    const pop = (t, a, b = 1e9) => (t >= a && t < b + 0.2) ? K.easeBack(prog(t, a, a + 0.3)) * (1 - K.easeIn(prog(t, b, b + 0.2))) : 0;
    let X;
    const A = (a, fn) => { if (a <= 0.002) return; X.save(); X.globalAlpha *= clamp(a); fn(); X.restore(); };
    const Z = (k, cx, cy, fn, rot = 0) => { if (k <= 0.002) return; X.save(); X.translate(cx, cy); X.rotate(rot); X.scale(k, k); X.translate(-cx, -cy); fn(); X.restore(); };
    const comic = (s, x, y, size, fill, { al = 'center', stroke = 14, f = 'Bangers', max } = {}) => { X.font = `${size}px "${f}"`; if (max) { const m = X.measureText(s).width; if (m > max) { size = Math.floor(size * max / m); X.font = `${size}px "${f}"`; } }
      X.textAlign = al; X.textBaseline = 'middle'; X.lineJoin = 'round'; X.fillStyle = INKC; X.fillText(s, x + size * 0.06, y + size * 0.08); X.strokeStyle = INKC; X.lineWidth = stroke; X.strokeText(s, x, y); X.fillStyle = fill; X.fillText(s, x, y); };
    const plain = (s, x, y, size, col = INKC, al = 'center', w = 600) => { X.font = `${w} ${size}px "Oswald"`; X.fillStyle = col; X.textAlign = al; X.textBaseline = 'middle'; X.fillText(s, x, y); };
    const card = (x, y, w, h, bg = WHT, r = 26) => { X.fillStyle = INKC; K.rrect(X, x + 12, y + 14, w, h, r); X.fill(); X.fillStyle = bg; K.rrect(X, x, y, w, h, r); X.fill(); X.strokeStyle = INKC; X.lineWidth = 8; X.stroke(); };
    const halftone = (x, y, w, h, col, step = 22, rmax = 7, dir = 1) => { X.save(); X.beginPath(); X.rect(x, y, w, h); X.clip(); X.fillStyle = col; for (let yy = y; yy < y + h + step; yy += step) for (let xx = x; xx < x + w + step; xx += step) { const k = dir > 0 ? (xx - x) / w : 1 - (xx - x) / w; X.beginPath(); X.arc(xx + ((yy / step) % 2) * step / 2, yy, Math.max(0.5, rmax * k), 0, 7); X.fill(); } X.restore(); };
    const sticker = (t, a, b, s, bg, fg, cx, cy, size = 70, rot = -0.06) => A(fade(t, a, b), () => Z(pop(t, a, b), cx, cy, () => { X.font = `${size}px "Bangers"`; const w = X.measureText(s).width + 70, h = size * 1.45; card(cx - w / 2, cy - h / 2, w, h, bg, 22); comic(s, cx, cy + 4, size, fg, { stroke: 0 }); }, rot));
    const IN = n => Math.round(n).toLocaleString('en-IN');
    const pinIcon = (cx, cy, s, col = RED) => { X.fillStyle = col; X.strokeStyle = INKC; X.lineWidth = 5; X.beginPath(); X.arc(cx, cy - s * 0.55, s * 0.45, Math.PI * 0.85, Math.PI * 2.15); X.lineTo(cx, cy + s * 0.15); X.closePath(); X.fill(); X.stroke(); X.fillStyle = '#fff'; X.beginPath(); X.arc(cx, cy - s * 0.55, s * 0.17, 0, 7); X.fill(); };
    const INDIA = [[68.2, 23.7], [68.8, 23.3], [69.0, 22.4], [70.5, 20.8], [72.3, 21.3], [72.6, 22.2], [72.9, 20.8], [72.8, 19.0], [73.3, 17.0], [73.9, 15.5], [74.6, 13.5], [75.5, 11.5], [76.2, 10.0], [77.0, 8.3], [77.6, 8.1], [78.2, 8.9], [79.0, 9.4], [79.3, 10.3], [79.85, 10.8], [79.9, 12.3], [80.3, 13.5], [80.1, 15.2], [80.6, 15.9], [81.5, 16.3], [82.3, 16.7], [83.4, 17.7], [84.8, 19.2], [86.4, 20.0], [87.0, 21.0], [87.6, 21.6], [88.2, 21.7], [89.0, 21.9], [88.7, 23.5], [88.0, 24.4], [88.4, 25.2], [89.0, 25.3], [89.8, 26.0], [90.6, 25.2], [92.0, 25.1], [92.3, 24.2], [91.6, 23.2], [92.3, 22.0], [93.2, 22.3], [93.4, 23.8], [94.2, 24.0], [94.6, 25.4], [95.2, 26.6], [96.3, 27.3], [97.3, 28.2], [96.2, 29.3], [95.4, 29.0], [94.0, 28.0], [92.2, 27.8], [91.6, 27.1], [89.8, 26.8], [88.9, 27.2], [88.8, 28.1], [88.1, 27.9], [88.1, 26.5], [86.0, 26.5], [84.0, 27.4], [82.0, 27.7], [80.1, 28.8], [80.9, 30.2], [79.0, 31.4], [78.7, 32.6], [79.4, 32.6], [79.5, 34.0], [78.0, 35.5], [77.0, 35.6], [75.0, 37.0], [73.9, 36.0], [73.7, 34.6], [74.0, 33.4], [74.6, 32.7], [75.3, 32.2], [74.5, 31.0], [73.9, 30.1], [72.2, 28.4], [70.6, 27.8], [69.5, 26.6], [70.1, 25.2], [71.0, 24.5], [69.9, 24.2], [68.8, 24.3]];
    const TN = [[80.3, 13.5], [80.2, 12.8], [79.9, 12.3], [79.85, 10.8], [79.3, 10.3], [79.0, 9.4], [78.2, 8.9], [77.6, 8.1], [77.2, 8.4], [77.25, 9.3], [77.2, 10.0], [76.8, 10.4], [76.7, 11.0], [76.3, 11.4], [76.8, 11.8], [77.5, 12.2], [77.9, 12.8], [78.5, 12.7], [79.4, 13.0], [80.0, 13.4]];
    const MK = 26, mx = lon => 160 + (lon - 68) * MK * 0.93, my = lat => 340 + (37 - lat) * MK;
    const poly = (pts, n = pts.length) => { X.beginPath(); for (let i = 0; i < n; i++) { const [lo, la] = pts[i]; i ? X.lineTo(mx(lo), my(la)) : X.moveTo(mx(lo), my(la)); } };

    // comic wipes at every cut
    const CUTS = ['hook2', 'loc', 'built', 'height', 'granite', 'flat', 'haul', 'top', 'lift', 'ramp', 'drag', 'nandi', 'shadow1', 'today', 'cta'].map(n => B(n) - 0.12);
    const wipe = (x, W, Hh, t) => { for (const c of CUTS) { const p = (t - c) / 0.32; if (p < 0 || p > 1) continue; const xx = lerp(-1500, 1500, ease(p));
      X.save(); X.translate(540 + xx, 960); X.rotate(-0.35); X.fillStyle = YEL; X.fillRect(-380, -1400, 760, 2800); halftone(-380, -1400, 760, 2800, '#ffb000', 26, 9); X.strokeStyle = INKC; X.lineWidth = 14; X.strokeRect(-380, -1400, 760, 2800); X.restore(); } };

    const drawHud = t => hudTex.redraw((x, W, Hh) => { X = x;
      const vg = x.createRadialGradient(W / 2, Hh / 2, Hh * 0.4, W / 2, Hh / 2, Hh * 0.78); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(20,10,40,0.35)'); x.fillStyle = vg; x.fillRect(0, 0, W, Hh);
      x.fillStyle = 'rgba(26,16,32,0.35)'; x.fillRect(0, 0, W, 10); x.fillStyle = YEL; x.fillRect(0, 0, W * t / D, 10);
      // HOOK: viral claim card -> MYTH stamp
      const h1 = B('hook1'), h2 = B('hook2');
      A(fade(t, h1, E('hook2') + 0.1), () => Z(pop(t, h1 + 0.05), 540, 330, () => { card(110, 190, 860, 290, WHT, 34);
        x.fillStyle = '#ffe9e6'; K.rrect(x, 140, 222, 300, 56, 28); x.fill(); comic('🔥 VIRAL CLAIM', 290, 252, 40, RED, { stroke: 0, f: 'Bangers' });
        plain('"Its shadow never', 540, 330, 54, INKC, 'center', 700); plain('touches the ground"', 540, 400, 54, INKC, 'center', 700);
        const s = prog(t, F('hook2', 0.08), F('hook2', 0.08) + 0.2); if (s > 0) { x.strokeStyle = RED; x.lineWidth = 14; x.lineCap = 'round'; x.beginPath(); x.moveTo(170, 368); x.lineTo(170 + 740 * eo(s), 362); x.stroke(); } }, -0.02));
      sticker(t, F('hook2', 0.12), E('hook2') + 0.1, 'MYTH ✕', RED, WHT, 760, 560, 110, 0.1);
      sticker(t, F('hook2', 0.6), E('hook2') + 0.1, 'TRUTH IS CRAZIER →', GRN, WHT, 470, 720, 62, -0.05);
      // map
      const la = B('loc'), lb = E('loc');
      if (t > la - 0.1 && t < lb + 0.3) A(fade(t, la - 0.05, lb + 0.1), () => Z(pop(t, la), 540, 770, () => { card(90, 240, 900, 1040, '#fff8e6', 34);
        comic('WHERE?', 540, 310, 76, YEL);
        const dk = eo(prog(t, la, la + 0.8)), n = Math.max(2, Math.floor(INDIA.length * dk)); poly(INDIA, n); if (dk >= 1) x.closePath(); x.fillStyle = '#bfe7ff'; x.fill(); x.strokeStyle = INKC; x.lineWidth = 6; x.lineJoin = 'round'; x.stroke();
        const sa = prog(t, F('loc', 0.6), F('loc', 0.6) + 0.3); if (sa > 0) { poly(TN); x.closePath(); x.fillStyle = `rgba(255,138,42,${sa})`; x.fill(); x.lineWidth = 5; x.stroke(); A(sa, () => comic('TAMIL NADU', mx(78.4), my(11.6) + 4, 34, WHT, { stroke: 8 })); }
        const pk = prog(t, F('loc', 0.42), F('loc', 0.42) + 0.3), ex = mx(79.14), ey = my(10.79); if (pk > 0) { pinIcon(ex, ey - (1 - eo(pk)) * 140, 56); A(pk, () => { card(ex - 360, ey - 170, 280, 76, YEL, 20); comic('THANJAVUR', ex - 220, ey - 130, 46, INKC, { stroke: 0 }); }); }
        A(prog(t, la + 0.8, la + 1.1), () => comic('INDIA', mx(77.5), my(23), 80, WHT, { stroke: 12 })); }));
      // built: king card + year badge
      const ba = B('built'), be = E('built');
      if (t > ba - 0.1 && t < be + 0.3) { A(fade(t, ba, be), () => Z(pop(t, ba + 0.05), 540, 300, () => { card(130, 190, 820, 220, WHT, 30);
        x.fillStyle = YEL; x.strokeStyle = INKC; x.lineWidth = 6; x.beginPath(); x.moveTo(190, 345); x.lineTo(200, 255); x.lineTo(240, 300); x.lineTo(275, 240); x.lineTo(310, 300); x.lineTo(350, 255); x.lineTo(360, 345); x.closePath(); x.fill(); x.stroke();
        comic('RAJARAJA CHOLA I', 640, 270, 64, RED, { stroke: 0, max: 520 }); plain('CHOLA EMPEROR · BUILT IT', 640, 345, 32, INKC); }));
        sticker(t, F('built', 0.35), be, '≈ 1010 CE', YEL, INKC, 330, 560, 92, -0.08); sticker(t, F('built', 0.65), be, '1,000+ YEARS', BLU, WHT, 720, 690, 76, 0.06); }
      // height
      const ha = B('height'), he = E('height');
      if (t > ha - 0.1 && t < he + 0.3) { sticker(t, ha + 0.1, he, '≈ 66 METRES', YEL, INKC, 540, 220, 100, -0.04);
        const fa = F('height', 0.5), fl = Math.floor(clamp((t - fa) / 0.07, 0, 20)); if (t > fa) A(fade(t, fa, he), () => { card(640, 330, 340, 130, BLU, 24); comic(fl + ' FLOORS', 810, 398, 62, WHT, { stroke: 0 }); }); }
      // granite counter
      const ga = B('granite'), ge = E('granite');
      if (t > ga - 0.1 && t < ge + 0.3) A(fade(t, ga, ge + 0.1), () => Z(pop(t, ga + 0.05), 540, 330, () => { card(130, 200, 820, 270, WHT, 30);
        comic(IN(130000 * eo(prog(t, ga + 0.2, ge - 0.2))), 540, 300, 130, '#6f7280', { stroke: 12 }); comic('TONNES OF GRANITE', 540, 410, 52, INKC, { stroke: 0 }); }));
      // flat land
      const fa_ = B('flat'), fe = E('flat');
      sticker(t, fa_ + 0.1, fe + 0.2, 'KAVERI DELTA · RICE FIELDS', GRN, WHT, 540, 220, 58, -0.03);
      sticker(t, F('flat', 0.55), fe + 0.2, '✕ NO GRANITE HILLS NEARBY', RED, WHT, 540, 360, 56, 0.04);
      // haul
      const hl = B('haul'), hle = E('haul');
      sticker(t, hl + 0.1, hle + 0.2, 'HAULED IN FROM FAR AWAY →', YEL, INKC, 540, 220, 58, -0.04);
      // top stone
      const tpa = B('top'), tpe = E('top');
      if (t > tpa - 0.1 && t < tpe + 0.3) { sticker(t, tpa + 0.15, tpe, 'THE TOP STONE', YEL, INKC, 540, 220, 76, -0.05); sticker(t, F('top', 0.55), tpe, '≈ 80 TONNES*', RED, WHT, 540, 360, 96, 0.05);
        A(fade(t, F('top', 0.6), tpe), () => plain('*traditional estimate', 540, 470, 30, WHT, 'center', 500)); }
      // lift: crossed crane
      const lfa = B('lift'), lfe = E('lift');
      if (t > lfa - 0.1 && t < lfe + 0.3) { A(fade(t, lfa, lfe), () => Z(pop(t, lfa + 0.05), 300, 330, () => { card(150, 200, 300, 260, WHT, 30); x.strokeStyle = INKC; x.lineWidth = 12; x.lineCap = 'round';
          x.beginPath(); x.moveTo(250, 420); x.lineTo(250, 250); x.lineTo(400, 250); x.moveTo(250, 280); x.lineTo(290, 250); x.moveTo(380, 250); x.lineTo(380, 330); x.stroke(); x.fillStyle = INKC; x.fillRect(365, 330, 30, 22);
          x.strokeStyle = RED; x.lineWidth = 18; x.beginPath(); x.moveTo(190, 230); x.lineTo(410, 440); x.moveTo(410, 230); x.lineTo(190, 440); x.stroke(); }, -0.05));
        sticker(t, F('lift', 0.4), lfe, '66 m UP?!', YEL, INKC, 740, 330, 96, 0.07); }
      // ramp: 6 km schematic
      const ra = B('ramp'), re = E('ramp');
      if (t > ra - 0.1 && t < re + 0.3) A(fade(t, ra, re + 0.1), () => Z(pop(t, ra + 0.05), 540, 330, () => { card(90, 190, 900, 300, '#fff8e6', 30); comic('LEGEND', 540, 240, 50, RED, { stroke: 0 });
        const k = eo(prog(t, ra + 0.2, F('ramp', 0.8))); x.fillStyle = '#c99a5a'; x.strokeStyle = INKC; x.lineWidth = 6; x.beginPath(); x.moveTo(150, 440); x.lineTo(150 + 700 * k, 440); x.lineTo(150 + 700 * k, 440 - 110 * k); x.closePath(); x.fill(); x.stroke();
        x.fillStyle = INKC; x.beginPath(); x.arc(150, 440, 12, 0, 7); x.fill(); plain('SARAPALLAM', 150, 470, 26, INKC, 'left', 700);
        A(prog(t, F('ramp', 0.5), F('ramp', 0.7)), () => comic('≈ 6 KM RAMP', 520, 340, 64, YEL));
        if (k > 0.98) { x.fillStyle = '#e2a96a'; x.strokeStyle = INKC; x.lineWidth = 5; x.beginPath(); x.moveTo(840, 330); x.lineTo(870, 300); x.lineTo(900, 330); x.lineTo(900, 440); x.lineTo(840, 440); x.closePath(); x.fill(); x.stroke(); plain('TEMPLE', 870, 470, 26, INKC, 'center', 700); } }));
      // drag
      sticker(t, B('drag') + 0.1, E('drag') + 0.2, '🐘 INCH BY INCH', YEL, INKC, 540, 220, 70, -0.04);
      // nandi
      const na = B('nandi'), ne = E('nandi');
      sticker(t, na + 0.1, ne + 0.2, 'NANDI', YEL, INKC, 360, 220, 90, -0.06); sticker(t, F('nandi', 0.55), ne + 0.2, 'ONE SINGLE ROCK ✓', GRN, WHT, 600, 350, 66, 0.05);
      // shadow truth
      const s1 = B('shadow1'), s2e = E('shadow2');
      if (t > s1 - 0.1 && t < s2e + 0.3) { sticker(t, F('shadow1', 0.45), s2e, 'TRUTH ✓ IT HAS A SHADOW', GRN, WHT, 540, 220, 58, -0.03);
        A(fade(t, s1, s2e), () => { card(380, 1560, 320, 110, WHT, 26); const hh = sunHour(t), hr = Math.floor(hh), mn = Math.floor((hh - hr) * 60 / 5) * 5; comic(`☀ ${hr > 12 ? hr - 12 : hr}:${String(mn).padStart(2, '0')} ${hr >= 12 ? 'PM' : 'AM'}`, 540, 1617, 56, INKC, { stroke: 0 }); });
        sticker(t, F('shadow2', 0.25), s2e, 'NOON: SHADOW HIDES UNDER THE BASE', YEL, INKC, 540, 360, 46, 0.03); }
      // today
      const ta = B('today'), te = E('today');
      if (t > ta - 0.1 && t < te + 0.3) { A(fade(t, ta, te), () => Z(pop(t, F('today', 0.45)), 540, 330, () => { x.fillStyle = INKC; x.beginPath(); x.arc(552, 344, 170, 0, 7); x.fill(); x.fillStyle = WHT; x.beginPath(); x.arc(540, 330, 170, 0, 7); x.fill(); x.strokeStyle = BLU; x.lineWidth = 14; x.stroke();
          comic('UNESCO', 540, 300, 76, BLU, { stroke: 0 }); plain('WORLD HERITAGE', 540, 372, 30, BLU, 'center', 700); plain('GREAT LIVING CHOLA TEMPLES', 540, 412, 20, INKC, 'center', 600); }));
        sticker(t, ta + 0.1, te, '1,000+ YEARS STANDING', YEL, INKC, 540, 170, 62, -0.03); }
      // CTA
      const ca = B('cta') - 0.2; if (t > ca) A(prog(t, ca, ca + 0.3), () => { comic('BRIHADEESWARAR', 540, 240, 104, YEL, { max: 980 }); comic('TEMPLE · THANJAVUR', 540, 350, 56, WHT, { stroke: 10 });
        const fa = B('cta') + 0.2; Z(pop(t, fa), 540, 560, () => { const press = K.pulse(t, fa + 0.9, 0.3), w = 600 - press * 30; card(540 - w / 2, 505, w, 110, RED, 55); comic(t > fa + 1.05 ? 'FOLLOWING ✓' : 'FOLLOW FOR THE NEXT BUILD', 540, 562, 52, WHT, { stroke: 0, max: w - 60 });
          const hx = 740 - eo(prog(t, fa + 0.3, fa + 0.9)) * 140, hy = 690 - eo(prog(t, fa + 0.3, fa + 0.9)) * 90; x.fillStyle = WHT; x.strokeStyle = INKC; x.lineWidth = 6; x.beginPath(); x.arc(hx, hy, 30 - press * 6, 0, 7); x.fill(); x.stroke();
          if (press > 0) { x.strokeStyle = `rgba(255,255,255,${press})`; x.lineWidth = 6; x.beginPath(); x.arc(hx, hy, 46 + press * 40, 0, 7); x.stroke(); } }); });
      wipe(x, W, Hh, t);
    });

    // ---------------------------------------------------------------- sun path (hour of day -> direction)
    const sunHour = t => {
      if (t < B('hook2')) return 12.2;
      if (t < B('loc')) return lerp(12.2, 16.8, ease(prog(t, B('hook2'), E('hook2'))));
      if (t < B('shadow1')) return 9.6;
      if (t < B('shadow2')) return lerp(15.8, 14.5, prog(t, B('shadow1'), B('shadow2')));
      if (t < B('today')) return lerp(14.5, 12.0, ease(prog(t, B('shadow2'), F('shadow2', 0.7))));
      return 17.6; };
    const setSun = t => { const h = sunHour(t), a = (h - 6) / 12 * Math.PI, el = Math.max(0.12, Math.sin(a) * 1.45), az = Math.cos(a);
      const dir = new THREE.Vector3(az * 0.95, el, 0.28).normalize(); sun.position.copy(dir.multiplyScalar(150)); sun.target.position.set(0, 0, 0);
      const eve = t >= B('today') - 0.12; sun.color.setHex(eve ? 0xffb070 : 0xfff2d6); sun.intensity = eve ? 2.2 : 2.6; S.background = eve ? skyEve : skyDay; hemi.intensity = eve ? 0.9 : 1.25; };

    // ---------------------------------------------------------------- camera
    const shots = [];
    const shot = (a, b, p0, l0, p1 = p0, l1 = l0, o = {}) => shots.push({ a, b, p0, l0, p1, l1, ...o });
    const V3 = (v, t) => typeof v === 'function' ? v(t) : v;
    const capPos = new THREE.Vector3();
    shot(0, B('hook2'), [15, 3.5, 28], [0, 14, 0], [11, 4, 21], [0, 15, 0]);
    shot(B('hook2'), B('loc'), [34, 34, 44], [-4, 3, -4], [30, 36, 40], [-6, 3, -6]);
    shot(B('loc'), B('built'), [0, 150, 190], [0, 0, 0], [0, 130, 160], [0, 0, 0]);
    shot(B('built'), B('height'), [-30, 12, 30], [0, 11, 0], [-20, 17, 36], [0, 11, 0]);
    shot(B('height'), B('granite'), [12.5, 12, 96], [12.5, 11, 0], [12.5, 12, 88], [12.5, 11, 0]);
    shot(B('granite'), B('flat'), [28, 15, 36], [0, 12, 0], [24, 19, 30], [0, 13, 0]);
    shot(B('flat'), B('haul'), [70, 30, 150], [-30, 4, -40], [40, 24, 130], [-40, 4, -60]);
    shot(B('haul'), B('top'), t => [lerp(-120, -60, prog(t, B('haul'), B('top'))), 9, 82], t => [lerp(-140, -80, prog(t, B('haul'), B('top'))), 2, 60]);
    shot(B('top'), B('lift'), [8, 23.5, 10], [0, TOPY + 1.5, 0], [6, 22.8, 8], [0, TOPY + 1.6, 0]);
    shot(B('lift'), B('ramp'), [6, 1.4, 16], [0, 17, 0], [5, 1.4, 15], [0, 19, 0]);
    shot(B('ramp'), B('drag'), [-30, 34, 60], [-34, 10, 0], [-26, 30, 52], [-30, 12, 0]);
    shot(B('drag'), B('nandi'), t => [capPos.x + 7, capPos.y + 4.5, capPos.z + 12], t => [capPos.x - 2, capPos.y + 1, capPos.z], t => [capPos.x + 6, capPos.y + 3.5, capPos.z + 10], t => [capPos.x - 2, capPos.y + 1.2, capPos.z]);
    shot(B('nandi'), B('shadow1'), [2.2, 2.2, NZ - 3.6], [0, 1.6, NZ], [1.6, 2.0, NZ - 3.0], [0, 1.6, NZ]);
    shot(B('shadow1'), B('today'), [0, 95, 2], [0, 0, -1], [0, 88, 2], [0, 0, -1]);
    shot(B('today'), B('cta'), [-26, 5, 44], [0, 12, 0], [-34, 18, 62], [0, 11, 0]);
    shot(B('cta'), D + 1, [-34, 18, 62], [0, 11, 0], [-10, 30, 86], [0, 9, 0]);
    K.shoot = t => { let s = shots[shots.length - 1]; for (const q of shots) if (t >= q.a && t < q.b) { s = q; break; }
      const k = (s.ease || K.ease)(prog(t, s.a, s.b)), p0 = V3(s.p0, t), p1 = V3(s.p1, t), l0 = V3(s.l0, t), l1 = V3(s.l1, t);
      K.cam.position.set(lerp(p0[0], p1[0], k), lerp(p0[1], p1[1], k), lerp(p0[2], p1[2], k)); K.cam.lookAt(lerp(l0[0], l1[0], k), lerp(l0[1], l1[1], k), lerp(l0[2], l1[2], k)); };

    // ---------------------------------------------------------------- per-frame update
    const M4 = new THREE.Matrix4(), Q = new THREE.Quaternion(), V = new THREE.Vector3(), SC = new THREE.Vector3(), EU = new THREE.Euler();
    const update = t => {
      setSun(t);
      // exploded tiers during "granite"
      const ex = K.pulse(t, B('granite') - 0.1, E('granite') - B('granite') + 0.6);
      tiers.forEach((g, i) => { g.position.y = g.userData.y + ex * i * 0.75; g.rotation.y = ex * Math.sin(i * 1.7) * 0.25; });
      base.position.y = 0;
      const gOn = ex > 0.02;
      for (let i = 0; i < NGB; i++) { const b = gbp[i], a = b.a + t * b.sp; V.set(Math.cos(a) * b.r, b.y, Math.sin(a) * b.r); EU.set(t * b.sp, a, 0); Q.setFromEuler(EU); SC.setScalar(gOn ? b.s * ex : 0.0001); M4.compose(V, Q, SC); gblocks.setMatrixAt(i, M4); }
      gblocks.instanceMatrix.needsUpdate = true;
      // glass tower grows floor by floor during "height"
      const hOn = t > B('height') - 0.2 && t < B('granite'); glass.visible = hOn; const fl = clamp((t - F('height', 0.5)) / 0.07, 0, 20);
      floors.forEach((f, i) => { f.visible = hOn && (i < fl || t < F('height', 0.5)); f.scale.y = i < fl ? Math.min(1, fl - i) : 1; });
      // the top stone: highlighted, lifted off for the ramp story, dragged back up
      const rA = B('ramp'), dA = B('drag'), dE = E('drag');
      const rampGrow = eo(prog(t, rA + 0.1, F('ramp', 0.85))), rampOn = t > rA - 0.1 && t < B('shadow1');
      rampG.visible = rampOn; rampG.scale.set(Math.max(0.002, rampGrow), 1, 1);
      const cs = Math.cos(Math.atan(RS)), sn = Math.sin(Math.atan(RS));
      let s = -1;                                       // distance down the ramp (-1 = sitting on the tower)
      if (t >= dA - 0.15 && t < dE - 0.3) s = 70 * (1 - ease(prog(t, dA, dE - 0.3)));
      if (s >= 0) { capPos.set(RTOP.x - cs * s, RTOP.y - sn * s, 0); cap.rotation.z = Math.atan(RS); }
      else { const k = t >= dE - 0.3 && t < dE + 0.4 ? eo(prog(t, dE - 0.3, dE + 0.3)) : 1; capPos.set(lerp(RTOP.x, 0, k), TOPY, 0); cap.rotation.z = 0; }
      cap.position.copy(capPos);
      capGlow.material.opacity = 0.35 * K.pulse(t, B('top') + 0.1, E('top') - B('top'));
      // pullers walk up the ramp ahead of the stone, people push from behind
      const dragOn = s >= 0;
      pullers.forEach((e, i) => { const se = s - 6 - i * 3.2; e.visible = dragOn && se > 0.5; if (!e.visible) return; e.position.set(RTOP.x - cs * se, RTOP.y - sn * se, i % 2 ? 0.8 : -0.8); e.rotation.set(0, 0, Math.atan(RS)); e.legs.forEach((l, k) => { l.rotation.z = Math.sin(t * 6 + k * 1.6 + i) * 0.35; }); });
      people.forEach((p, i) => { p.visible = dragOn; if (!dragOn) return; const d2 = s + 2.0 + (i % 5) * 1.1; p.position.set(RTOP.x - cs * d2, RTOP.y - sn * d2 + 0.1, i < 5 ? 1.3 : -1.3); p.rotation.z = -0.35 + Math.sin(t * 5 + i) * 0.08; });
      ropes.forEach((r, i) => { r.visible = dragOn && s > 7; if (!r.visible) return; const a = new THREE.Vector3(capPos.x + cs * 1.4, capPos.y + 1.0, i ? 0.8 : -0.8), b = new THREE.Vector3(RTOP.x - cs * (s - 6) - 0.6, RTOP.y - sn * (s - 6) + 1.0, i ? 0.8 : -0.8), mid = a.clone().add(b).multiplyScalar(0.5);
        r.position.copy(mid); r.scale.y = a.distanceTo(b); r.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize()); });
      // granite convoy on the road
      const hOn2 = t > B('flat') - 0.2 && t < B('top');
      convoy.forEach(({ e, sled, i }) => { e.visible = sled.visible = hOn2; if (!hOn2) return; const x = -230 + ((t * 3.2 + i * 14) % 210); e.position.set(x, 0, 60); e.rotation.y = 0; sled.position.set(x - 3.6, 0.65, 60); e.legs.forEach((l, k) => { l.rotation.z = Math.sin(t * 5 + k * 1.6 + i) * 0.35; }); });
      drawHud(t);
    };

    const sfx = [
      ['bass', 0.15, 0.7], ['pop', B('hook1') + 0.1, 0.5], ['zap', F('hook2', 0.08), 0.5], ['thud', F('hook2', 0.12), 1.0], ['whoosh', B('hook2') + 0.2, 0.5], ['pop', F('hook2', 0.6), 0.6],
      ...['loc', 'built', 'height', 'granite', 'flat', 'haul', 'top', 'lift', 'ramp', 'nandi', 'shadow1', 'today', 'cta'].map(n => ['whoosh', B(n) - 0.2, 0.7]),
      ['ding', F('loc', 0.42) + 0.3, 0.5], ['pop', F('loc', 0.6), 0.5], ['chime', B('built') + 0.2, 0.5], ['thud', F('built', 0.35), 0.7], ['pop', F('built', 0.65), 0.5],
      ['thud', B('height') + 0.1, 0.7], ['riser', F('height', 0.45), 0.35], ['ding', F('height', 0.5) + 1.4, 0.5], ['bass', B('granite') + 0.05, 0.8], ['rustle', B('granite') + 0.2, 0.5], ['kaching', E('granite') - 0.3, 0.45],
      ['pop', B('flat') + 0.1, 0.5], ['buzz', F('flat', 0.55), 0.3], ['thud', B('haul') + 0.3, 0.5], ['chime', B('top') + 0.15, 0.6], ['thud', F('top', 0.55), 0.9], ['zap', B('lift') + 0.1, 0.4], ['boing', F('lift', 0.4), 0.4],
      ['rustle', B('ramp') + 0.2, 0.5], ['pop', F('ramp', 0.5), 0.5], ['rustle', B('drag') + 0.1, 0.5], ['thud', B('drag') + 1.2, 0.5], ['thud', E('drag') + 0.1, 1.0], ['ding', E('drag') + 0.2, 0.5],
      ['pop', B('nandi') + 0.1, 0.5], ['chime', F('nandi', 0.55), 0.5], ['tick', B('shadow1') + 0.4, 0.4], ['pop', F('shadow1', 0.45), 0.6], ['tick', B('shadow2') + 0.3, 0.4], ['pop', F('shadow2', 0.25), 0.5],
      ['riser', B('today') - 0.8, 0.35], ['chime', F('today', 0.45), 0.6], ['pop', B('cta') + 0.2, 0.5], ['ding', B('cta') + 1.1, 0.5],
    ];
    return { duration: D, update, shots: [{ t: [0, 1], from: { pos: [0, 0, 1], look: [0, 0, 0] } }], sfx, watermark: false, endCard: false, music: {}, capFont: 'Fredoka Light', capMarginV: 520, capSize: 66 };
  },
};
