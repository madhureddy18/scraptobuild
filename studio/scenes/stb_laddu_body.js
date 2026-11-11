// The secret kitchen of Tirumala (Laddu Potu): hooks -> where -> kitchen -> daily ingredients -> 3 steps -> belts -> GI tag -> peak -> follow.
// Temple shown only from outside (no sanctum, no idol). Every visual is a pure function of t.
window.SCENE = {
  setup: { bg: 0x1c1430, fog: [80, 320], fov: 40, bloom: { strength: 0.42, radius: 0.55, threshold: 0.85 } },
  lines: window.STB_LINES,
  build(K, T) {
    const L = T.lines, IDX = {}; window.STB_LINES.forEach((l, i) => { IDX[l.id] = i; });
    const B = n => L[IDX[n]].t, E = n => L[IDX[n]].end, F = (n, f) => B(n) + (E(n) - B(n)) * f;
    const D = E('cta') + 1.6;
    const THREE = window.THREE, S = K.scene;
    const ease = K.ease, eo = K.easeOut, prog = K.prog, clamp = K.clamp, lerp = K.lerp;
    const KX = 300, IX = -300, PX = 600;      // kitchen, ingredient yard, laddu studio

    // ---------------------------------------------------------------- sky + light
    const sky = (top, bot, glow) => K.canvasTex(64, 512, (x, w, h) => { const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, top); g.addColorStop(1, bot); x.fillStyle = g; x.fillRect(0, 0, w, h);
      const r = x.createRadialGradient(w / 2, h * 0.62, 0, w / 2, h * 0.62, h * 0.5); r.addColorStop(0, glow); r.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = r; x.fillRect(0, 0, w, h); });
    S.background = sky('#20154a', '#ff9a52', 'rgba(255,200,120,0.4)'); S.fog = new THREE.Fog(0xd9926a, 120, 420);
    S.add(new THREE.HemisphereLight(0xb7a6ff, 0x3a2a16, 1.15)); S.add(new THREE.AmbientLight(0xffe2c8, 0.28));
    const sun = new THREE.DirectionalLight(0xffc08a, 2.8); sun.position.set(-40, 50, 30); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -0.0006;
    Object.assign(sun.shadow.camera, { left: -40, right: 40, top: 40, bottom: -40, near: 1, far: 160 }); S.add(sun); S.add(sun.target);

    // ---------------------------------------------------------------- helpers + materials
    const tex = (base, seed, n = 2600, dots = null) => { const t = K.canvasTex(512, 512, (x, w, h) => { const r = K.rng(seed); x.fillStyle = base; x.fillRect(0, 0, w, h);
      for (let i = 0; i < n; i++) { x.fillStyle = dots ? dots[Math.floor(r() * dots.length)] : `rgba(${r() < 0.5 ? '0,0,0' : '255,240,220'},${0.04 + r() * 0.07})`; const s = dots ? 4 + r() * 8 : 2 + r() * 6; x.beginPath(); x.arc(r() * w, r() * h, s / 2, 0, 7); x.fill(); } }); t.wrapS = t.wrapT = THREE.RepeatWrapping; return t; };
    const M = (o) => new THREE.MeshStandardMaterial(Object.assign({ roughness: 0.8 }, o));
    const mesh = (geo, m, x, y, z, parent = S) => { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); o.castShadow = o.receiveShadow = true; parent.add(o); return o; };
    const bx = (w, h, d, m, x, y, z, parent) => mesh(new THREE.BoxGeometry(w, h, d), m, x, y + h / 2, z, parent);
    const mGrass = M({ map: tex('#3e5a2c', 3), color: 0xffffff }), mStone = M({ map: tex('#cdbb9c', 5) }), mGold = M({ color: 0xffc23a, metalness: 0.45, roughness: 0.3, emissive: 0x9a6200, emissiveIntensity: 0.9 });
    mGrass.map.repeat.set(30, 30);
    const mLaddu = M({ map: tex('#e89a2e', 8, 1800, ['#f4b648', '#d9821e', '#f7c45c', '#c9741a', '#ffd27a']), roughness: 0.6 });
    const ladduGeo = (() => { const g = new THREE.SphereGeometry(1, 28, 20), p = g.attributes.position, v = new THREE.Vector3();
      for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); const n = 1 + 0.035 * (Math.sin(v.x * 23) + Math.sin(v.y * 27 + 1) + Math.sin(v.z * 25 + 2)); v.multiplyScalar(n); p.setXYZ(i, v.x, v.y, v.z); } g.computeVertexNormals(); return g; })();

    // ---------------------------------------------------------------- 1) Tirumala hills + temple (exterior only)
    plane(); function plane() { const p = mesh(new THREE.PlaneGeometry(900, 900), mGrass, 0, -0.05, 0); p.rotation.x = -Math.PI / 2; }
    const hillM = M({ color: 0x3f6b36, flatShading: true, roughness: 1 });
    const HILLS = [[-95, -70, 26, 22], [-62, -98, 30, 26], [-25, -118, 34, 28], [15, -112, 32, 27], [52, -92, 30, 24], [82, -60, 26, 21], [0, 0, 34, 15]];
    const hillTop = [];
    HILLS.forEach(([x, z, r, h], i) => { const g = new THREE.SphereGeometry(r, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2); const m = mesh(g, hillM, x, 0, z); m.scale.y = h / r; hillTop.push([x, h, z]); });
    const TY = 15;                                           // temple ground (top of the 7th hill)
    const plat = mesh(new THREE.CylinderGeometry(14, 16, 1.2, 24), mStone, 0, TY - 0.4, 0);
    const temple = new THREE.Group(); temple.position.set(0, TY, 0); S.add(temple);
    const mWhite = M({ map: tex('#e9dfcc', 12) });
    for (const [w, d, x, z] of [[20, 1, 0, -10], [20, 1, 0, 10], [1, 20, -10, 0], [1, 20, 10, 0]]) bx(w, 2.4, d, mWhite, x, 0, z, temple);
    for (let i = 0; i < 6; i++) bx(6 - i * 0.8, 1.5, 3 - i * 0.3, mStone, 0, 2.4 + i * 1.5, 10, temple);               // gopuram over the gate
    mesh(new THREE.SphereGeometry(0.5, 12, 8), mGold, 0, 11.9, 10, temple);
    bx(5, 3, 5, mStone, 0, 0, -1, temple);                                                                                 // Ananda Nilayam base
    for (let i = 0; i < 3; i++) bx(4.2 - i * 1.0, 0.9, 4.2 - i * 1.0, mGold, 0, 3 + i * 0.9, -1, temple);
    const dome = mesh(new THREE.SphereGeometry(1.25, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), mGold, 0, 5.7, -1, temple); dome.scale.y = 1.15;
    mesh(new THREE.ConeGeometry(0.35, 1.4, 12), mGold, 0, 7.6, -1, temple);
    for (const [x, z] of [[-2, -3], [2, -3], [-2, 1], [2, 1]]) mesh(new THREE.SphereGeometry(0.35, 10, 8), mGold, x, 3.3, z - 0, temple);
    for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; bx(1.6, 1.4, 1.6, mWhite, Math.cos(a) * 6.5, 0, Math.sin(a) * 6.5 + 0.5, temple); }
    const goldL = new THREE.PointLight(0xffc860, 18, 16, 1.6); goldL.position.set(0, TY + 9, 3); S.add(goldL);

    // ---------------------------------------------------------------- 2) the kitchen (Laddu Potu)
    const mFloor = M({ map: tex('#5b4636', 14) }), mWall = M({ map: tex('#8a6a4e', 15) }), mBrick = M({ map: tex('#7a3b26', 16) }), mIron = M({ color: 0x2a2624, metalness: 0.7, roughness: 0.45 });
    const mBrass = M({ color: 0xc99a3a, metalness: 0.85, roughness: 0.3 }), mWood = M({ map: tex('#7a5636', 17) });
    const mGhee = M({ color: 0xf2b33d, emissive: 0x7a3c00, emissiveIntensity: 0.6, roughness: 0.15, metalness: 0.2 });
    bx(46, 0.2, 34, mFloor, KX, -0.2, 0);
    bx(46, 9, 1, mWall, KX, 0, -15.5 - 0.0).visible = false;                                    // replaced by pieces with a belt opening
    bx(36, 9, 1, mWall, KX - 5, 0, -15.5); bx(2.5, 9, 1, mWall, KX + 21.75, 0, -15.5); bx(7.5, 5.8, 1, mWall, KX + 17.25, 3.2, -15.5);
    for (const sx of [-1, 1]) bx(1, 9, 34, mWall, KX + sx * 23, 0, 0);
    bx(46, 0.6, 34, mWood, KX, 9, 0);
    for (let i = 0; i < 8; i++) bx(46, 0.5, 0.6, mWood, KX, 8.5, -14 + i * 4);
    const lamps = [];
    for (const [x, z] of [[-18, -10], [-6, -10], [6, -10], [18, -10], [-18, 6], [0, 8], [18, 6]]) { const l = new THREE.PointLight(0xffa64a, 14, 18, 1.5); l.position.set(KX + x, 6.5, z); S.add(l); lamps.push(l);
      mesh(new THREE.SphereGeometry(0.25, 10, 8), M({ color: 0xffc070, emissive: 0xffa040, emissiveIntensity: 3 }), KX + x, 6.5, z); }
    // stoves + kadais
    const STOVES = [-14, -9, -4, 1].map(x => KX + x), SZ = -8;
    const kadais = STOVES.map((x, i) => { bx(3.2, 1.1, 3.2, mBrick, x, 0, SZ); const fire = mesh(new THREE.BoxGeometry(1.6, 0.5, 0.2), M({ color: 0xff6a1a, emissive: 0xff5a00, emissiveIntensity: 3 }), x, 0.45, SZ + 1.62);
      const bowl = mesh(new THREE.SphereGeometry(1.4, 28, 14, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), mIron, x, 2.4, SZ); bowl.material.side = THREE.DoubleSide;
      const ghee = mesh(new THREE.CircleGeometry(1.33, 32), mGhee, x, 2.12, SZ); ghee.rotation.x = -Math.PI / 2; return { x, fire }; });
    const HK = STOVES[1];                                                                            // hero kadai
    const jhara = new THREE.Group(); jhara.position.set(HK, 3.5, SZ); S.add(jhara);
    const holes = K.canvasTex(128, 128, (x, w, h) => { x.fillStyle = '#b8b8b8'; x.beginPath(); x.arc(64, 64, 62, 0, 7); x.fill(); x.fillStyle = '#f5d27a'; for (let i = 0; i < 60; i++) { const a = i * 2.4, r = 6 + (i % 10) * 5.4; x.beginPath(); x.arc(64 + Math.cos(a) * r, 64 + Math.sin(a) * r, 3.2, 0, 7); x.fill(); } });
    const jd = mesh(new THREE.CircleGeometry(0.65, 32), new THREE.MeshStandardMaterial({ map: holes, metalness: 0.6, roughness: 0.4, side: THREE.DoubleSide }), 0, 0, 0, jhara); jd.rotation.x = -Math.PI / 2;
    mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.6, 8), mIron, 1.2, 0.7, 0, jhara).rotation.z = 1.1;
    // mixing vessel
    const VX = KX + 9, VZ = -2;
    mesh(new THREE.CylinderGeometry(1.4, 1.8, 1.2, 20), mBrick, VX, 0.6, VZ);
    const vb = mesh(new THREE.SphereGeometry(2.3, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), mBrass, VX, 3.3, VZ); vb.material.side = THREE.DoubleSide;
    const mixTop = mesh(new THREE.CircleGeometry(2.15, 32), mLaddu, VX, 2.6, VZ); mixTop.rotation.x = -Math.PI / 2;
    const paddle = new THREE.Group(); paddle.position.set(VX, 2.6, VZ); S.add(paddle); mesh(new THREE.BoxGeometry(0.15, 3.4, 0.5), mWood, 1.0, 1.2, 0, paddle).rotation.z = 0.5;
    const syrupPot = new THREE.Group(); syrupPot.position.set(VX - 2.2, 5.6, VZ); S.add(syrupPot);
    mesh(new THREE.CylinderGeometry(0.6, 0.45, 0.9, 16), mBrass, 0, 0, 0, syrupPot);
    const syrup = mesh(new THREE.CylinderGeometry(0.08, 0.12, 3.0, 8), M({ color: 0xffb13a, emissive: 0x6a3000, transparent: true, opacity: 0.85 }), VX - 1.6, 4.0, VZ);
    // rolling table + trays
    const TX = KX - 6, TZ = 5;
    bx(8, 0.3, 2.8, mWood, TX, 1.5, TZ); for (const [dx, dz] of [[-3.7, -1.2], [3.7, -1.2], [-3.7, 1.2], [3.7, 1.2]]) bx(0.25, 1.5, 0.25, mWood, TX + dx, 0, TZ + dz);
    for (const dx of [-2.6, 2.4]) bx(2.4, 0.08, 2.0, mBrass, TX + dx, 1.8, TZ);
    const trayL = new THREE.InstancedMesh(ladduGeo, mLaddu, 40); trayL.castShadow = true; S.add(trayL);
    const hero = new THREE.Group(); hero.position.set(TX, 2.15, TZ + 0.2); S.add(hero);
    const heroLaddu = mesh(ladduGeo, mLaddu, 0, 0, 0, hero); heroLaddu.scale.setScalar(0.26);
    const mSkin = M({ color: 0x8a5a3a, roughness: 0.6 }), mCloth = M({ color: 0xf3eee2 }), mSaffron = M({ color: 0xff9a2a });
    const hands = [-1, 1].map(s => { const h = mesh(new THREE.CapsuleGeometry(0.14, 0.32, 6, 12), mSkin, s * 0.34, 0.05, 0, hero); h.rotation.z = s * 1.2; return h; });
    // conveyor belts through the back wall: IN (sacks) and OUT (laddus)
    const BIN = KX + 16, BOUT = KX + 19, BZ0 = -22, BZ1 = 10, BLEN = BZ1 - BZ0;
    const mBelt = M({ color: 0x2c2c30, roughness: 0.7 }), mRail = M({ color: 0x9aa0a8, metalness: 0.8, roughness: 0.3 });
    for (const bx_ of [BIN, BOUT]) { bx(1.8, 0.2, BLEN, mBelt, bx_, 1.3, (BZ0 + BZ1) / 2); for (const s of [-1, 1]) bx(0.12, 0.35, BLEN, mRail, bx_ + s * 0.95, 1.2, (BZ0 + BZ1) / 2);
      for (let z = BZ0 + 1; z < BZ1; z += 4) bx(0.15, 1.3, 0.15, mRail, bx_, 0, z); }
    const NSACK = 9, sacks = new THREE.InstancedMesh(new THREE.BoxGeometry(1.2, 0.7, 0.9), M({ map: tex('#d9c9a3', 18) }), NSACK); sacks.castShadow = true; S.add(sacks);
    const NBL = 60, beltL = new THREE.InstancedMesh(ladduGeo, mLaddu, NBL); beltL.castShadow = true; S.add(beltL);
    // cooks
    const worker = (s, cloth = mCloth) => {
      const g = new THREE.Group(); g.scale.setScalar(s); S.add(g);
      mesh(new THREE.CapsuleGeometry(0.17, 0.42, 4, 10), cloth, 0, 0.45, 0, g); mesh(new THREE.CapsuleGeometry(0.14, 0.35, 4, 10), cloth, 0, 1.0, 0, g);
      mesh(new THREE.SphereGeometry(0.15, 12, 10), mSkin, 0, 1.42, 0, g); mesh(new THREE.SphereGeometry(0.03, 6, 4), mSaffron, 0, 1.47, 0.14, g);
      const arm = new THREE.Group(); arm.position.set(0.16, 1.22, 0); g.add(arm); mesh(new THREE.CapsuleGeometry(0.05, 0.38, 4, 8), mSkin, 0, -0.22, 0.05, arm);
      const arm2 = new THREE.Group(); arm2.position.set(-0.16, 1.22, 0); g.add(arm2); mesh(new THREE.CapsuleGeometry(0.05, 0.38, 4, 8), mSkin, 0, -0.22, 0.05, arm2);
      return { g, arm, arm2 };
    };
    const cooks = [];
    STOVES.forEach((x, i) => { const w = worker(1.7); w.g.position.set(x + 0.4, 0, SZ + 2.6); w.g.rotation.y = Math.PI; w.ph = i; w.mode = 'stir'; cooks.push(w); });
    [[-2.6, -1.4], [0, -1.4], [2.4, -1.4]].forEach(([dx, dz], i) => { const w = worker(1.7); w.g.position.set(TX + dx, 0, TZ + dz); w.g.rotation.y = 0; w.ph = 2 + i; w.mode = 'roll'; cooks.push(w); });
    { const w = worker(1.7); w.g.position.set(VX + 2.6, 0, VZ + 1.6); w.g.rotation.y = -2.2; w.ph = 7; w.mode = 'stir'; cooks.push(w); }
    { const w = worker(1.7); w.g.position.set(BIN - 1.8, 0, 2); w.g.rotation.y = 1.4; w.ph = 9; w.mode = 'idle'; cooks.push(w); }
    // boondi: drops falling from the jhara + boondi floating in every kadai
    const ND = 70, drops = new THREE.InstancedMesh(new THREE.SphereGeometry(0.055, 8, 6), M({ color: 0xf5d27a, emissive: 0x3a2a00 }), ND); S.add(drops);
    const dr = K.rng(5), dropP = Array.from({ length: ND }, () => ({ a: dr() * 6.28, r: Math.sqrt(dr()) * 0.55, ph: dr() }));
    const NB = 4 * 110, boondi = new THREE.InstancedMesh(new THREE.SphereGeometry(0.075, 8, 6), M({ color: 0xe8962a, emissive: 0x4a2000, roughness: 0.5 }), NB); S.add(boondi);
    const bp = Array.from({ length: NB }, () => ({ k: Math.floor(dr() * 4), a: dr() * 6.28, r: Math.sqrt(dr()) * 1.2, w: 0.3 + dr() * 0.6 }));
    const NM = 160, mixB = new THREE.InstancedMesh(new THREE.SphereGeometry(0.09, 8, 6), M({ color: 0xeaa03a, roughness: 0.5 }), NM); S.add(mixB);
    const mp = Array.from({ length: NM }, () => ({ a: dr() * 6.28, r: Math.sqrt(dr()) * 2.0, h: dr() * 0.25 }));
    const NI = 90, mCashew = M({ color: 0xf0dcb0 }), mRaisin = M({ color: 0x4a2316 }), mCard = M({ color: 0x7a9a4a });
    const fallers = [new THREE.InstancedMesh(new THREE.TorusGeometry(0.13, 0.055, 6, 10, Math.PI * 1.2), mCashew, NI), new THREE.InstancedMesh(new THREE.SphereGeometry(0.08, 8, 6), mRaisin, NI), new THREE.InstancedMesh(new THREE.SphereGeometry(0.07, 8, 6), mCard, NI)];
    fallers.forEach(f => S.add(f)); const fp = Array.from({ length: NI }, () => ({ x: (dr() * 2 - 1) * 1.4, z: (dr() * 2 - 1) * 1.4, ph: dr(), r: dr() * 6 }));
    const steam = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 10, 8), new THREE.MeshBasicMaterial({ color: 0xfff3e0, transparent: true, opacity: 0.08, depthWrite: false }), 36); S.add(steam);
    const sp = Array.from({ length: 36 }, (_, i) => ({ k: i % 5, ph: dr(), dx: (dr() * 2 - 1) * 0.8, dz: (dr() * 2 - 1) * 0.8 }));

    // ---------------------------------------------------------------- 3) ingredient yard (pile sizes follow the real weights)
    bx(44, 0.4, 34, M({ map: tex('#4a3a30', 20) }), IX, -0.4, 4);
    const grid = new THREE.GridHelper(44, 22, 0x8a6a4e, 0x8a6a4e); grid.position.set(IX, 0.01, 4); grid.material.transparent = true; grid.material.opacity = 0.25; S.add(grid);
    const pileTex = (c, dots) => tex(c, 30 + c.length, 3000, dots);
    const PILES = [
      { id: 'flour', name: 'GRAM FLOUR', t: 10, x: IX - 4.4, z: -5, at: () => F('flour', 0.05), m: M({ map: pileTex('#efd38a', ['#f5df9e', '#e3c374', '#fbe8b0']) }) },
      { id: 'sugar', name: 'SUGAR', t: 10, x: IX + 4.4, z: -5, at: () => F('flour', 0.55), m: M({ map: pileTex('#f6f3ec', ['#ffffff', '#e8e2d6', '#fbf8f2']), roughness: 0.4 }) },
      { id: 'cashew', name: 'CASHEWS', t: 0.7, x: IX - 3.4, z: 4, at: () => F('nuts', 0.02), m: M({ map: pileTex('#ead2a0', ['#f3e0b8', '#d9bd86', '#f7ebcf']) }) },
      { id: 'raisin', name: 'RAISINS', t: 0.54, x: IX, z: 4.5, at: () => F('nuts', 0.36), m: M({ map: pileTex('#5a2a18', ['#3e1a0e', '#6e3420', '#2c1208']) }) },
      { id: 'card', name: 'CARDAMOM', t: 0.15, x: IX + 3.0, z: 4.5, at: () => F('nuts', 0.7), m: M({ map: pileTex('#7f9a52', ['#93ad66', '#6a8442', '#a3bb78']) }) },
    ];
    PILES.forEach(p => { p.r = 4.2 * Math.cbrt(p.t / 10); p.mesh = mesh(new THREE.SphereGeometry(p.r, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), p.m, p.x, 0, p.z); p.mesh.scale.y = 0.62; });

    // ---------------------------------------------------------------- 4) laddu studio (hero laddu + festival mountain)
    const back = mesh(new THREE.CylinderGeometry(40, 40, 40, 32, 1, true), new THREE.MeshBasicMaterial({ color: 0x1a0d14, side: THREE.BackSide }), PX, 18, 0); back.castShadow = back.receiveShadow = false;
    bx(60, 0.2, 60, M({ color: 0x24131a, roughness: 0.5, metalness: 0.2 }), PX, -0.2, 0);
    const plate = mesh(new THREE.CylinderGeometry(2.2, 2.0, 0.18, 40), mBrass, PX, 0.9, 0); bx(1.2, 0.8, 1.2, mWood, PX, 0, 0);
    const bigL = mesh(ladduGeo, mLaddu, PX, 2.25, 0); bigL.scale.setScalar(1.25);
    const spot = new THREE.SpotLight(0xffd9a0, 35, 40, 0.5, 0.5, 1.2); spot.position.set(PX + 4, 12, 8); spot.target = bigL; S.add(spot);
    const NG = 120, glit = new THREE.InstancedMesh(new THREE.SphereGeometry(0.04, 6, 4), new THREE.MeshBasicMaterial({ color: 0xffd76a, toneMapped: false }), NG); S.add(glit);
    const gp = Array.from({ length: NG }, () => ({ a: dr() * 6.28, r: 2 + dr() * 3, y: dr() * 5, s: 0.2 + dr() * 0.6 }));
    const NMT = 800, mount = new THREE.InstancedMesh(ladduGeo, mLaddu, NMT); mount.castShadow = true; S.add(mount);
    const mpos = []; { let i = 0; for (let layer = 0; i < NMT; layer++) { const R = Math.max(0.6, 7.5 - layer * 0.62), n = Math.max(1, Math.floor(R * R * 3.2)); for (let k = 0; k < n && i < NMT; k++, i++) { const a = dr() * 6.28, r = Math.sqrt(dr()) * R; mpos.push([PX + 14 + Math.cos(a) * r, 0.4 + layer * 0.6, Math.sin(a) * r]); } } }

    // ---------------------------------------------------------------- 3D labels
    const label = (draw, size, x, y, z, w = 256, h = 256) => { const t = K.canvasTex(w, h, draw); const sp_ = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthTest: false, toneMapped: false })); sp_.position.set(x, y, z); sp_.scale.set(size * w / h, size, 1); sp_.renderOrder = 20; S.add(sp_); sp_.base = [size * w / h, size]; return sp_; };
    const disc = (s, col, fg) => (x, w, h) => { x.fillStyle = 'rgba(0,0,0,0.35)'; x.beginPath(); x.arc(w / 2, h / 2 + 6, 108, 0, 7); x.fill(); x.fillStyle = col; x.beginPath(); x.arc(w / 2, h / 2, 104, 0, 7); x.fill(); x.strokeStyle = 'rgba(255,255,255,0.85)'; x.lineWidth = 8; x.stroke(); x.fillStyle = fg; x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = '700 118px "Oswald"'; x.fillText(s, w / 2, h / 2 + 6); };
    const hillTags = hillTop.map(([x, h, z], i) => label(disc(String(i + 1), i === 6 ? '#ffcf5a' : '#2f6b3a', i === 6 ? '#20142a' : '#fff'), i === 6 ? 9 : 7, x, (i === 6 ? TY + 16 : h + 6), z));
    const tag = (txt, sub) => (x, w, h) => { x.fillStyle = 'rgba(14,10,22,0.85)'; K.rrect(x, 8, 8, w - 16, h - 16, 40); x.fill(); x.strokeStyle = 'rgba(255,207,90,0.7)'; x.lineWidth = 5; x.stroke(); x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = '700 64px "Oswald"'; x.fillText(txt, w / 2, h / 2 - 22); x.fillStyle = '#ffcf5a'; x.font = '600 50px "Oswald"'; x.fillText(sub, w / 2, h / 2 + 40); };
    PILES.forEach(p => { p.tag = label(tag(p.name, p.t >= 1 ? p.t + ' TONNES' : Math.round(p.t * 1000) + ' KG'), p.t >= 1 ? 2.4 : 1.5, p.x, p.r * 0.62 + (p.t >= 1 ? 2.6 : 1.5), p.z, 512, 220); });

    // ---------------------------------------------------------------- HUD
    const hudTex = K.canvasTex(1080, 1920, () => {});
    const hudScene = new THREE.Scene(), hudCam = new THREE.OrthographicCamera(-540, 540, 960, -960, -10, 10);
    hudScene.add(new THREE.Mesh(new THREE.PlaneGeometry(1080, 1920), new THREE.MeshBasicMaterial({ map: hudTex, transparent: true, toneMapped: false, depthTest: false })));
    K.draw = () => { K.composer.render(); const r = K.renderer; r.autoClear = false; r.clearDepth(); r.render(hudScene, hudCam); r.autoClear = true; };
    const GOLD = '#ffcf5a', INK = 'rgba(14,10,22,0.8)', RED = '#ff4b3e';
    const fnt = (w, s, f = 'Oswald') => `${w} ${s}px "${f}"`;
    const fade = (t, a, b = 1e9) => prog(t, a, a + 0.25) * (1 - prog(t, b, b + 0.25));
    const pop = (t, a, b = 1e9) => (t >= a && t < b + 0.25) ? K.easeBack(prog(t, a, a + 0.35)) * (1 - K.easeIn(prog(t, b, b + 0.25))) : 0;
    let X;
    const A = (a, fn) => { if (a <= 0.002) return; X.save(); X.globalAlpha *= clamp(a); fn(); X.restore(); };
    const Z = (k, cx, cy, fn, rot = 0) => { if (k <= 0.002) return; X.save(); X.translate(cx, cy); X.rotate(rot); X.scale(k, k); X.translate(-cx, -cy); fn(); X.restore(); };
    const panel = (x, y, w, h, r = 34, bg = INK, border = 'rgba(255,207,90,0.45)') => { X.fillStyle = bg; K.rrect(X, x, y, w, h, r); X.fill(); if (border) { X.strokeStyle = border; X.lineWidth = 3; X.stroke(); } };
    const txt = (s, x, y, { size = 40, w = 600, f = 'Oswald', col = '#fff', al = 'center', max } = {}) => { X.font = fnt(w, size, f); if (max) { const m = X.measureText(s).width; if (m > max) X.font = fnt(w, Math.floor(size * max / m), f); } X.fillStyle = col; X.textAlign = al; X.textBaseline = 'middle'; X.fillText(s, x, y); };
    const pill = (cx, cy, s, { size = 38, fg = '#fff', bg = INK, border = 'rgba(255,207,90,0.5)' } = {}) => { X.font = fnt(600, size); const W = X.measureText(s).width + 64, Hh = size * 1.8; panel(cx - W / 2, cy - Hh / 2, W, Hh, Hh / 2, bg, border); txt(s, cx, cy + 2, { size, col: fg }); };
    const stamp = (t, a, b, big, sub, col, cy = 430, rot = -0.08) => { if (t < a || t > b + 0.25) return;
      const k0 = prog(t, a, a + 0.22), k = (k0 < 1 ? lerp(2.4, 1, eo(k0)) : 1), al = prog(t, a, a + 0.12) * (1 - prog(t, b, b + 0.25));
      A(al, () => Z(k, 540, cy, () => { X.strokeStyle = col; X.lineWidth = 10; K.rrect(X, 200, cy - 115, 680, 230, 26); X.stroke(); X.lineWidth = 3; K.rrect(X, 216, cy - 99, 648, 198, 18); X.stroke();
        txt(big, 540, cy - 12, { size: 104, w: 900, f: 'Cinzel', col, max: 620 }); txt(sub, 540, cy + 66, { size: 32, col, max: 620 }); }, rot)); };
    const step = (t, a, b, n, s, cy = 200) => A(fade(t, a, b), () => Z(pop(t, a, b), 540, cy, () => {
      X.font = fnt(600, 40); const w = X.measureText(s).width + 170; X.fillStyle = 'rgba(255,255,255,0.95)'; K.rrect(X, 540 - w / 2, cy - 44, w, 88, 44); X.fill();
      X.fillStyle = GOLD; X.beginPath(); X.arc(540 - w / 2 + 46, cy, 32, 0, 7); X.fill(); txt(n, 540 - w / 2 + 46, cy + 2, { size: 38, w: 700, col: '#20142a' }); txt(s, 540 - w / 2 + 96, cy + 2, { size: 40, col: '#20142a', al: 'left' }); }));
    const IN = n => Math.round(n).toLocaleString('en-IN');
    const pinIcon = (cx, cy, s, col = RED) => { X.fillStyle = col; X.beginPath(); X.arc(cx, cy - s * 0.55, s * 0.45, Math.PI * 0.85, Math.PI * 2.15); X.lineTo(cx, cy + s * 0.15); X.closePath(); X.fill(); X.fillStyle = '#fff'; X.beginPath(); X.arc(cx, cy - s * 0.55, s * 0.17, 0, 7); X.fill(); };
    const ladduIcon = (x, y, r) => { const g = X.createRadialGradient(x - r * 0.35, y - r * 0.35, r * 0.1, x, y, r); g.addColorStop(0, '#ffd27a'); g.addColorStop(1, '#d9821e'); X.fillStyle = g; X.beginPath(); X.arc(x, y, r, 0, 7); X.fill(); X.fillStyle = 'rgba(120,50,0,0.35)'; for (let i = 0; i < 14; i++) { const a = i * 2.39, rr = r * 0.75 * Math.sqrt((i + 0.5) / 14); X.beginPath(); X.arc(x + Math.cos(a) * rr, y + Math.sin(a) * rr, r * 0.09, 0, 7); X.fill(); } };
    const person = (x, y, s, col) => { X.fillStyle = col; X.beginPath(); X.arc(x, y - s * 0.36, s * 0.17, 0, 7); X.fill(); X.beginPath(); X.moveTo(x - s * 0.3, y + s * 0.32); X.quadraticCurveTo(x - s * 0.3, y - s * 0.17, x, y - s * 0.17); X.quadraticCurveTo(x + s * 0.3, y - s * 0.17, x + s * 0.3, y + s * 0.32); X.closePath(); X.fill(); };

    const INDIA = [[68.2, 23.7], [68.8, 23.3], [69.0, 22.4], [70.5, 20.8], [72.3, 21.3], [72.6, 22.2], [72.9, 20.8], [72.8, 19.0], [73.3, 17.0], [73.9, 15.5], [74.6, 13.5], [75.5, 11.5], [76.2, 10.0], [77.0, 8.3], [77.6, 8.1], [78.2, 8.9], [79.0, 9.4], [79.3, 10.3], [79.85, 10.8], [79.9, 12.3], [80.3, 13.5], [80.1, 15.2], [80.6, 15.9], [81.5, 16.3], [82.3, 16.7], [83.4, 17.7], [84.8, 19.2], [86.4, 20.0], [87.0, 21.0], [87.6, 21.6], [88.2, 21.7], [89.0, 21.9], [88.7, 23.5], [88.0, 24.4], [88.4, 25.2], [89.0, 25.3], [89.8, 26.0], [90.6, 25.2], [92.0, 25.1], [92.3, 24.2], [91.6, 23.2], [92.3, 22.0], [93.2, 22.3], [93.4, 23.8], [94.2, 24.0], [94.6, 25.4], [95.2, 26.6], [96.3, 27.3], [97.3, 28.2], [96.2, 29.3], [95.4, 29.0], [94.0, 28.0], [92.2, 27.8], [91.6, 27.1], [89.8, 26.8], [88.9, 27.2], [88.8, 28.1], [88.1, 27.9], [88.1, 26.5], [86.0, 26.5], [84.0, 27.4], [82.0, 27.7], [80.1, 28.8], [80.9, 30.2], [79.0, 31.4], [78.7, 32.6], [79.4, 32.6], [79.5, 34.0], [78.0, 35.5], [77.0, 35.6], [75.0, 37.0], [73.9, 36.0], [73.7, 34.6], [74.0, 33.4], [74.6, 32.7], [75.3, 32.2], [74.5, 31.0], [73.9, 30.1], [72.2, 28.4], [70.6, 27.8], [69.5, 26.6], [70.1, 25.2], [71.0, 24.5], [69.9, 24.2], [68.8, 24.3]];
    const AP = [[77.2, 15.9], [77.5, 15.0], [76.9, 14.6], [77.1, 13.9], [77.9, 13.0], [78.6, 12.6], [79.4, 12.9], [80.2, 13.4], [80.1, 15.2], [80.6, 15.9], [81.5, 16.3], [82.3, 16.7], [83.4, 17.7], [84.8, 19.1], [84.2, 19.0], [83.2, 18.6], [82.3, 18.0], [81.6, 17.7], [81.0, 17.3], [80.2, 16.9], [79.6, 16.7], [79.2, 16.3], [78.1, 16.0]];
    const MK = 26, mx = lon => 160 + (lon - 68) * MK * 0.93, my = lat => 330 + (37 - lat) * MK;
    const poly = (pts, n = pts.length) => { X.beginPath(); for (let i = 0; i < n; i++) { const [lo, la] = pts[i]; i ? X.lineTo(mx(lo), my(la)) : X.moveTo(mx(lo), my(la)); } };
    const LOCSPLIT = F('loc', 0.46);
    const drawMap = t => { const a = B('loc'), b = LOCSPLIT, k = pop(t, a - 0.1, b); if (!k) return;
      A(fade(t, a - 0.1, b), () => Z(k, 540, 760, () => { panel(90, 230, 900, 1050, 40, 'rgba(10,8,22,0.88)');
        txt('WHERE IS IT?', 540, 290, { size: 44, w: 700, col: GOLD });
        const dk = eo(prog(t, a, a + 0.8)), n = Math.max(2, Math.floor(INDIA.length * dk));
        poly(INDIA, n); if (dk >= 1) X.closePath(); X.fillStyle = `rgba(255,255,255,${0.08 * dk})`; X.fill(); X.strokeStyle = 'rgba(255,255,255,0.85)'; X.lineWidth = 4; X.lineJoin = 'round'; X.stroke();
        const sa = prog(t, a + 0.7, a + 1.0); if (sa > 0) { poly(AP); X.closePath(); X.fillStyle = `rgba(255,138,42,${0.85 * sa})`; X.fill(); X.strokeStyle = `rgba(255,220,170,${sa})`; X.lineWidth = 3; X.stroke(); A(sa, () => txt('ANDHRA PRADESH', mx(81.2), my(17.6) - 6, { size: 28, w: 700 })); }
        const pk = prog(t, a + 0.4, a + 0.75), ex = mx(79.35), ey = my(13.68);
        if (pk > 0) { const pr = (t * 1.2) % 1; X.strokeStyle = `rgba(255,75,62,${1 - pr})`; X.lineWidth = 4; X.beginPath(); X.arc(ex, ey, 14 + pr * 50, 0, 7); X.stroke(); pinIcon(ex, ey - (1 - eo(pk)) * 120, 46);
          A(pk, () => { panel(ex - 300, ey - 150, 240, 62, 31, 'rgba(255,255,255,0.95)', null); txt('TIRUMALA', ex - 180, ey - 118, { size: 32, w: 700, col: '#20142a' }); }); }
        A(prog(t, a + 1.0, a + 1.3), () => txt('INDIA', mx(77.5), my(23), { size: 64, w: 700, f: 'Cinzel', col: 'rgba(255,255,255,0.9)' }));
      })); };
    const drawHills = t => { const a = LOCSPLIT, b = E('loc'); if (t < a || t > b + 0.4) return;
      A(fade(t, a, b + 0.1), () => { const k7 = F('loc', 0.8); A(fade(t, k7, b + 0.1), () => Z(pop(t, k7), 540, 220, () => pill(540, 220, '★  7TH HILL: VENKATADRI', { size: 46, fg: '#20142a', bg: GOLD, border: null })));
        pill(540, 120, '7 HILLS · SESHACHALAM RANGE', { size: 36 }); }); };
    const drawCooks = t => { const a = B('cooks'), b = E('cooks'); if (t < a - 0.1 || t > b + 0.4) return;
      A(fade(t, a - 0.1, b + 0.1), () => Z(pop(t, a - 0.1, b + 0.1), 540, 560, () => { panel(110, 160, 860, 820, 40);
        txt('≈ ' + IN(620 * eo(prog(t, a, a + 1.4))), 540, 260, { size: 120, w: 700, col: GOLD }); txt('COOKS', 540, 360, { size: 52, w: 600 });
        const shown = Math.floor(62 * eo(prog(t, a, a + 1.6))); for (let i = 0; i < 62; i++) { const c = i % 10, r = Math.floor(i / 10); person(195 + c * 77, 470 + r * 62, 52, i < shown ? '#f3eee2' : 'rgba(255,255,255,0.12)'); }
        txt('EACH ICON = 10 COOKS', 540, 920, { size: 28, w: 500, col: 'rgba(255,255,255,0.75)' });
      })); };
    const drawSince = t => { const a = B('since'), b = E('since'); if (t < a - 0.1 || t > b + 0.4) return;
      A(fade(t, a - 0.1, b + 0.1), () => { panel(80, 150, 920, 300, 36);
        const x0 = 150, x1 = 930, yy = 330, mk = eo(prog(t, a + 0.2, F('since', 0.55)));
        X.strokeStyle = 'rgba(255,255,255,0.3)'; X.lineWidth = 8; X.lineCap = 'round'; X.beginPath(); X.moveTo(x0, yy); X.lineTo(x1, yy); X.stroke();
        X.strokeStyle = GOLD; X.beginPath(); X.moveTo(x0, yy); X.lineTo(lerp(x0, x1, mk), yy); X.stroke(); X.fillStyle = GOLD; X.beginPath(); X.arc(x0, yy, 16, 0, 7); X.fill(); X.beginPath(); X.arc(lerp(x0, x1, mk), yy, 16, 0, 7); X.fill();
        txt('1715', x0 + 10, yy - 55, { size: 60, w: 700, col: GOLD, al: 'left' }); txt('TODAY', x1, yy - 55, { size: 40, w: 600, al: 'right' });
        txt('FIRST LADDU PRASADAM', x0, yy + 50, { size: 26, w: 500, col: 'rgba(255,255,255,0.8)', al: 'left' });
        A(prog(t, F('since', 0.55), F('since', 0.55) + 0.3), () => Z(pop(t, F('since', 0.55)), 540, 540, () => pill(540, 540, IN(300 * eo(prog(t, F('since', 0.55), F('since', 0.9)))) + '+ YEARS', { size: 64, fg: '#20142a', bg: GOLD, border: null }))); }); };
    const drawIngr = t => { const a = B('ingr'), b = E('nuts') + 0.3; if (t < a - 0.1 || t > b + 0.4) return;
      A(fade(t, a - 0.1, b), () => { Z(pop(t, a), 540, 140, () => pill(540, 140, 'EVERY SINGLE DAY', { size: 42, fg: '#20142a', bg: GOLD, border: null }));
        const rows = PILES.map(p => [p.name, p.t >= 1 ? p.t : p.t * 1000, p.t >= 1 ? ' t' : ' kg', p.at()]); const shown = rows.filter(r => t > r[3] - 0.1); if (!shown.length) return;
        const y0 = 220; panel(140, y0, 800, 40 + shown.length * 78 + (t > F('nuts', 0.85) ? 56 : 0), 30);
        shown.forEach(([nm, v, u, at], i) => { const y = y0 + 60 + i * 78, k = eo(prog(t, at, at + 0.9)); Z(pop(t, at), 300, y, () => { X.fillStyle = ['#efd38a', '#f6f3ec', '#ead2a0', '#5a2a18', '#7f9a52'][i]; X.beginPath(); X.arc(200, y, 22, 0, 7); X.fill(); X.strokeStyle = 'rgba(255,255,255,0.6)'; X.lineWidth = 2; X.stroke();
          txt(nm, 245, y + 2, { size: 40, w: 600, al: 'left' }); txt(IN(v * k) + u, 900, y + 2, { size: 46, w: 700, col: GOLD, al: 'right' }); }); });
        if (t > F('nuts', 0.85)) A(prog(t, F('nuts', 0.85), F('nuts', 0.95)), () => txt('+ GHEE · SUGAR CANDY', 540, y0 + 40 + shown.length * 78 + 22, { size: 28, w: 500, col: 'rgba(255,255,255,0.75)' }));
      }); };
    const drawBelts = t => { const a = B('belts'), b = E('belts'); if (t < a - 0.1 || t > b + 0.4) return;
      A(fade(t, a, b + 0.1), () => { Z(pop(t, a + 0.1), 540, 200, () => pill(540, 200, 'IN  →  RAW MATERIALS', { size: 40 })); Z(pop(t, F('belts', 0.55)), 540, 300, () => pill(540, 300, 'OUT  →  LADDUS', { size: 40, fg: '#20142a', bg: GOLD, border: null })); }); };
    const drawPeak = t => { const a = B('peak'), b = E('peak'); if (t < a - 0.1 || t > b + 0.4) return;
      A(fade(t, a - 0.1, b + 0.1), () => Z(pop(t, a - 0.1, b + 0.1), 540, 380, () => { panel(110, 180, 860, 400, 40);
        A(prog(t, a, a + 0.3), () => pill(540, 240, 'BIG FESTIVAL DAYS', { size: 36, fg: '#20142a', bg: GOLD, border: null }));
        const n = lerp(300000, 800000, eo(prog(t, F('peak', 0.4), F('peak', 0.85))));
        txt(IN(n), 540, 380, { size: 140, w: 700, col: GOLD }); txt('LADDUS IN ONE DAY', 540, 480, { size: 46, w: 600 });
        X.fillStyle = 'rgba(255,255,255,0.15)'; K.rrect(X, 190, 530, 700, 18, 9); X.fill(); X.fillStyle = GOLD; K.rrect(X, 190, 530, 700 * n / 800000, 18, 9); X.fill(); })); };
    const drawCta = t => { const a = B('cta') - 0.2; if (t < a) return;
      A(prog(t, a, a + 0.4), () => { const k = eo(prog(t, a, a + 1));
        X.fillStyle = 'rgba(255,207,90,0.9)'; X.fillRect(540 - 280 * k, 180, 560 * k, 3); X.fillRect(540 - 280 * k, 420, 560 * k, 3);
        X.shadowColor = 'rgba(0,0,0,0.6)'; X.shadowBlur = 18; txt('THE SECRET', 540, 250, { size: 96, w: 900, f: 'Cinzel', col: GOLD }); txt('KITCHEN', 540, 350, { size: 96, w: 900, f: 'Cinzel', col: GOLD }); X.shadowBlur = 0;
        txt('LADDU POTU · TIRUMALA', 540, 460, { size: 34, w: 500 });
        const fa = B('cta') + 0.2; Z(pop(t, fa), 540, 640, () => { const press = K.pulse(t, fa + 1.0, 0.3), w = 600 - press * 30;
          X.fillStyle = GOLD; K.rrect(X, 540 - w / 2, 590, w, 104, 52); X.fill(); txt(t > fa + 1.15 ? 'FOLLOWING ✓' : 'FOLLOW FOR MORE SECRETS', 540, 644, { size: 40, w: 700, col: '#20142a' });
          const hx = 720 - eo(prog(t, fa + 0.4, fa + 1.0)) * 120, hy = 750 - eo(prog(t, fa + 0.4, fa + 1.0)) * 70; X.fillStyle = '#fff'; X.strokeStyle = '#20142a'; X.lineWidth = 4; X.beginPath(); X.arc(hx, hy, 28 - press * 6, 0, 7); X.fill(); X.stroke();
          if (press > 0) { X.strokeStyle = `rgba(255,255,255,${press})`; X.lineWidth = 5; X.beginPath(); X.arc(hx, hy, 42 + press * 40, 0, 7); X.stroke(); } }); }); };
    const drawHud = t => hudTex.redraw((x, W, Hh) => { X = x;
      let g = x.createLinearGradient(0, 0, 0, 700); g.addColorStop(0, 'rgba(8,4,16,0.55)'); g.addColorStop(1, 'rgba(8,4,16,0)'); x.fillStyle = g; x.fillRect(0, 0, W, 700);
      g = x.createLinearGradient(0, 1180, 0, Hh); g.addColorStop(0, 'rgba(8,4,16,0)'); g.addColorStop(1, 'rgba(8,4,16,0.6)'); x.fillStyle = g; x.fillRect(0, 1180, W, Hh - 1180);
      const vg = x.createRadialGradient(W / 2, Hh / 2, Hh * 0.35, W / 2, Hh / 2, Hh * 0.75); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.42)'); x.fillStyle = vg; x.fillRect(0, 0, W, Hh);
      x.fillStyle = 'rgba(255,255,255,0.18)'; x.fillRect(0, 0, W, 8); x.fillStyle = GOLD; x.fillRect(0, 0, W * t / D, 8);
      stamp(t, F('hook1', 0.55), E('hook1') + 0.2, 'SECRET', 'KITCHEN INSIDE THE TEMPLE', GOLD, 430);
      const h2 = B('hook2'), h2e = E('hook2');
      A(fade(t, h2, h2e + 0.2), () => Z(pop(t, h2), 540, 420, () => { panel(130, 260, 820, 320, 40); ladduIcon(540, 300, 40);
        txt(IN(300000 * eo(prog(t, h2 + 0.2, h2e))), 540, 410, { size: 140, w: 700, col: GOLD }); txt('LADDUS · EVERY DAY', 540, 515, { size: 44, w: 600 }); }));
      const h3 = B('hook3'), h3e = E('hook3');
      A(fade(t, h3, h3e + 0.3), () => { Z(pop(t, h3), 330, 200, () => pill(330, 200, '✋ BY HAND', { size: 40 })); Z(pop(t, F('hook3', 0.33)), 750, 200, () => pill(750, 200, '⏱ NON-STOP', { size: 40 }));
        Z(pop(t, F('hook3', 0.62)), 540, 330, () => pill(540, 330, 'WATCH HOW  ↓', { size: 52, fg: '#20142a', bg: GOLD, border: null })); });
      drawMap(t); drawHills(t);
      const po = B('potu'), poe = E('potu');
      A(fade(t, po, poe + 0.2), () => Z(pop(t, po + 0.1), 540, 330, () => { panel(170, 210, 740, 240, 36); txt('LADDU POTU', 540, 300, { size: 92, w: 900, f: 'Cinzel', col: GOLD }); txt('THE TEMPLE KITCHEN', 540, 385, { size: 36, w: 600 }); }));
      drawCooks(t); drawSince(t); drawIngr(t);
      step(t, B('step1'), E('step1') + 0.2, '1', 'BATTER → HOT GHEE → BOONDI');
      step(t, B('step2'), E('step2') + 0.2, '2', 'MIX: SYRUP + CASHEW + RAISIN');
      step(t, B('step3'), E('step3') + 0.2, '3', 'ROLLED BY HAND');
      drawBelts(t);
      stamp(t, F('gi', 0.35), E('gi') + 0.2, 'GI TAG', 'TIRUPATI LADDU · PROTECTED SINCE 2009', GOLD, 420);
      A(fade(t, B('gi'), E('gi') + 0.2), () => txt('GEOGRAPHICAL INDICATION', 540, 620, { size: 34, w: 600, col: 'rgba(255,255,255,0.85)' }));
      drawPeak(t); drawCta(t);
    });

    // ---------------------------------------------------------------- camera
    const shots = [];
    const shot = (a, b, p0, l0, p1 = p0, l1 = l0, o = {}) => shots.push({ a, b, p0, l0, p1, l1, ...o });
    const V3 = (v, t) => typeof v === 'function' ? v(t) : v;
    const TP = [0, TY + 5, -1];
    shot(0, B('hook2'), [24, TY + 11, 22], [0, TY + 5, -1], [15, TY + 8.5, 13], [0, TY + 5.5, -1]);
    shot(B('hook2'), B('hook3'), [KX + 2, 7, 19], [KX - 3, 2, -5], [KX + 1, 6, 15], [KX - 3, 2, -5]);
    shot(B('hook3'), F('hook3', 0.5), [TX + 1.6, 3.0, TZ + 2.4], [TX, 2.1, TZ + 0.2], [TX + 1.3, 2.8, TZ + 2.0], [TX, 2.1, TZ + 0.2]);
    shot(F('hook3', 0.5), B('loc'), [HK + 2.0, 4.6, SZ + 3.0], [HK, 2.4, SZ], [HK + 1.6, 4.2, SZ + 2.5], [HK, 2.4, SZ]);
    shot(B('loc'), LOCSPLIT, [-30, 110, 170], [0, 10, -40], [-20, 95, 150], [0, 10, -40]);
    shot(LOCSPLIT, B('potu'), [70, 55, 110], [-10, 14, -50], [40, 40, 70], [0, TY + 4, -6]);
    shot(B('potu'), B('cooks'), [KX, 7.5, 24], [KX, 2.5, -5], [KX, 5.5, 16], [KX, 2.5, -5]);
    shot(B('cooks'), B('since'), [KX - 20, 5, 6], [KX - 6, 2.2, -7], [KX - 17, 4.5, 4], [KX - 6, 2.2, -7]);
    shot(B('since'), B('ingr'), t => { const a = lerp(-0.5, 0.6, prog(t, B('since'), B('ingr'))); return [PX + Math.sin(a) * 6, 3.4, Math.cos(a) * 6]; }, [PX, 2.2, 0]);
    shot(B('ingr'), B('nuts'), [IX, 32, 40], [IX, 0, -1], [IX, 29, 36], [IX, 0, -1]);
    shot(B('nuts'), B('step1'), [IX, 13, 21], [IX, 0.5, 3.5], [IX, 12, 19], [IX, 0.5, 4]);
    shot(B('step1'), B('step2'), [HK + 2.2, 4.5, SZ + 3.2], [HK, 2.4, SZ], [HK + 1.4, 3.9, SZ + 2.4], [HK, 2.3, SZ]);
    shot(B('step2'), B('step3'), [VX + 3.4, 6.4, VZ + 5], [VX, 2.6, VZ], [VX + 2.6, 5.6, VZ + 4.2], [VX, 2.6, VZ]);
    shot(B('step3'), B('belts'), [TX + 1.5, 3.0, TZ + 2.4], [TX, 2.1, TZ + 0.2], [TX + 1.1, 2.75, TZ + 1.9], [TX, 2.1, TZ + 0.2]);
    shot(B('belts'), B('gi'), [KX + 12.5, 5.5, 13], [KX + 17.5, 1.4, -8], [KX + 13.5, 4.5, 11], [KX + 17.5, 1.4, -10]);
    shot(B('gi'), B('peak'), t => { const a = lerp(0.8, -0.4, prog(t, B('gi'), B('peak'))); return [PX + Math.sin(a) * 5.2, 3.0, Math.cos(a) * 5.2]; }, [PX, 2.3, 0]);
    shot(B('peak'), B('cta'), [PX + 14, 6, 22], [PX + 14, 3, 0], [PX + 14, 10, 26], [PX + 14, 3.5, 0]);
    shot(B('cta'), D + 1, [0, TY + 14, 70], [0, TY + 4, 0], [-18, TY + 22, 80], [0, TY + 4, 0]);
    K.shoot = t => { let s = shots[shots.length - 1]; for (const q of shots) if (t >= q.a && t < q.b) { s = q; break; }
      const k = (s.ease || K.ease)(prog(t, s.a, s.b)), p0 = V3(s.p0, t), p1 = V3(s.p1, t), l0 = V3(s.l0, t), l1 = V3(s.l1, t);
      K.cam.position.set(lerp(p0[0], p1[0], k), lerp(p0[1], p1[1], k), lerp(p0[2], p1[2], k)); K.cam.lookAt(lerp(l0[0], l1[0], k), lerp(l0[1], l1[1], k), lerp(l0[2], l1[2], k)); };

    // ---------------------------------------------------------------- per-frame update
    const M4 = new THREE.Matrix4(), Q = new THREE.Quaternion(), V = new THREE.Vector3(), SC = new THREE.Vector3(), EU = new THREE.Euler();
    const put = (im, i, x, y, z, s, rx = 0, ry = 0) => { V.set(x, y, z); EU.set(rx, ry, 0); Q.setFromEuler(EU); SC.setScalar(Math.max(0.0001, s)); M4.compose(V, Q, SC); im.setMatrixAt(i, M4); };
    const update = t => {
      // sun follows the active set so shadows land where the camera is
      const cx = K.cam.position.x, set = cx > 450 ? PX : cx > 150 ? KX : cx < -150 ? IX : 0; sun.target.position.set(set, 0, 0); sun.position.set(set - 40, 50, 30);
      goldL.intensity = 18 + Math.sin(t * 3) * 3;
      lamps.forEach((l, i) => { l.intensity = 14 + Math.sin(t * 9 + i * 2) * 1.5; });
      kadais.forEach((k, i) => { k.fire.material.emissiveIntensity = 2.6 + Math.sin(t * 13 + i) * 0.6; });
      // hills tags
      hillTags.forEach((s, i) => { const a = LOCSPLIT + 0.15 + i * 0.22, k = K.easeBack(prog(t, a, a + 0.3)) * (1 - prog(t, E('loc') + 0.1, E('loc') + 0.4)); s.visible = k > 0.01; s.scale.set(s.base[0] * Math.max(0.01, k), s.base[1] * Math.max(0.01, k), 1); });
      // jhara: pours batter in a slow tap rhythm
      jhara.position.y = 3.5 + Math.sin(t * 6) * 0.05; jhara.rotation.z = Math.sin(t * 3) * 0.04;
      for (let i = 0; i < ND; i++) { const d = dropP[i], ph = ((t * 1.3 + d.ph) % 1); put(drops, i, HK + Math.cos(d.a) * d.r, lerp(3.45, 2.15, ph * ph), SZ + Math.sin(d.a) * d.r, ph < 0.97 ? 1 : 0); }
      drops.instanceMatrix.needsUpdate = true;
      const kx = [STOVES[0], STOVES[1], STOVES[2], STOVES[3]];
      for (let i = 0; i < NB; i++) { const b = bp[i], a = b.a + t * b.w; put(boondi, i, kx[b.k] + Math.cos(a) * b.r, 2.16 + Math.sin(t * 7 + i) * 0.015, SZ + Math.sin(a) * b.r, 1); }
      boondi.instanceMatrix.needsUpdate = true;
      for (let i = 0; i < NM; i++) { const m = mp[i], a = m.a + t * 0.6; put(mixB, i, VX + Math.cos(a) * m.r, 2.62 + m.h * (1 - m.r / 2.2), VZ + Math.sin(a) * m.r, 1); }
      mixB.instanceMatrix.needsUpdate = true; mixTop.rotation.z = t * 0.6; paddle.rotation.y = t * 1.2;
      const s2 = B('step2'), s2e = E('step2'), pour = t > s2 - 0.3 && t < s2e + 0.5;
      syrupPot.rotation.z = pour ? -0.9 : -0.2; syrup.visible = pour; syrup.scale.y = pour ? 1 + Math.sin(t * 20) * 0.02 : 1;
      fallers.forEach((im, j) => { for (let i = 0; i < NI; i++) { const f = fp[i], ph = (t * 0.9 + f.ph + j * 0.33) % 1, on = t > s2 + j * 0.6 && t < s2e + 0.6; put(im, i, VX + f.x, lerp(6.5, 2.65, ph), VZ + f.z, on && ph < 0.98 ? 1 : 0, f.r + t * 3, f.r * 2); } im.instanceMatrix.needsUpdate = true; });
      for (let i = 0; i < 36; i++) { const s = sp[i], ph = (t * 0.35 + s.ph) % 1, bx_ = s.k < 4 ? kx[s.k] : VX, bz = s.k < 4 ? SZ : VZ, base = s.k < 4 ? 2.3 : 2.8; put(steam, i, bx_ + s.dx, base + ph * 4, bz + s.dz, (0.4 + ph * 1.2) * (1 - ph)); }
      steam.instanceMatrix.needsUpdate = true;
      // hero laddu being rolled: grows rounder, hands circle it
      const rr = t * 9; hero.rotation.y = Math.sin(rr) * 0.3; heroLaddu.rotation.set(rr * 0.6, rr, 0); hands.forEach((h, i) => { const s = i ? 1 : -1; h.position.set(s * 0.34 + Math.sin(rr + i * 3.14) * 0.03, 0.05 + Math.cos(rr) * 0.04, Math.sin(rr * 0.5) * 0.04); });
      // trays fill with laddus over the reel
      const nTray = Math.floor(clamp(10 + (t / D) * 34, 0, 40));
      for (let i = 0; i < 40; i++) { const tr = i < 20 ? -2.6 : 2.4, j = i % 20, c = j % 5, r = Math.floor(j / 5); put(trayL, i, TX + tr - 0.9 + c * 0.45, 1.98, TZ - 0.7 + r * 0.45, i < nTray ? 0.2 : 0, i, i * 2); }
      trayL.instanceMatrix.needsUpdate = true;
      // belts: sacks travel in (+z), laddus travel out (-z)
      for (let i = 0; i < NSACK; i++) { const z = BZ0 + ((i / NSACK) * BLEN + t * 1.6) % BLEN; put(sacks, i, BIN, 1.75, z, 1, 0, i * 0.3); }
      sacks.instanceMatrix.needsUpdate = true;
      for (let i = 0; i < NBL; i++) { const z = BZ1 - ((i / NBL) * BLEN + t * 2.2) % BLEN, c = i % 3; put(beltL, i, BOUT - 0.5 + c * 0.5, 1.62, z, 0.22, t * 4 + i, i); }
      beltL.instanceMatrix.needsUpdate = true;
      cooks.forEach(w => { const s = Math.sin(t * (w.mode === 'roll' ? 9 : 4) + w.ph); w.arm.rotation.x = w.mode === 'idle' ? -0.2 : -1.0 + s * 0.45; w.arm2.rotation.x = w.mode === 'roll' ? -1.0 - s * 0.45 : -0.6; w.g.rotation.z = Math.sin(t * 2 + w.ph) * 0.02; });
      // ingredient piles drop in on their words
      PILES.forEach(p => { const a = p.at(), k = prog(t, a, a + 0.45), vis = t > a && t < E('nuts') + 2;
        p.mesh.visible = vis; p.mesh.position.y = (1 - eo(k)) * 26 + K.wobble(t, a + 0.45, 0.35, 18, 6); p.mesh.scale.set(1, 0.62 * (1 + K.wobble(t, a + 0.45, 0.25, 16, 6)), 1);
        const tk = K.easeBack(prog(t, a + 0.35, a + 0.7)); p.tag.visible = vis && tk > 0.01; p.tag.scale.set(p.tag.base[0] * Math.max(0.01, tk), p.tag.base[1] * Math.max(0.01, tk), 1); });
      // studio: hero laddu spin, glitter, festival mountain
      bigL.rotation.y = t * 0.8; bigL.position.y = 2.25 + Math.sin(t * 2) * 0.05;
      const gOn = t > B('gi') - 0.2 && t < E('gi') + 0.4;
      for (let i = 0; i < NG; i++) { const g_ = gp[i], a = g_.a + t * g_.s; put(glit, i, PX + Math.cos(a) * g_.r, 0.6 + ((g_.y + t * 0.6) % 5), Math.sin(a) * g_.r, gOn ? 1 : 0); }
      glit.instanceMatrix.needsUpdate = true;
      const mFrac = t < B('peak') ? 0.375 : lerp(0.375, 1, eo(prog(t, F('peak', 0.4), F('peak', 0.85)))), mN = Math.floor(NMT * mFrac);
      for (let i = 0; i < NMT; i++) { const [x, y, z] = mpos[i], drop = i >= mN - 25 && i < mN ? (1 - (mN - i) / 25) * 1.5 : 0; put(mount, i, x, y + drop, z, i < mN ? 0.3 : 0, i * 1.3, i * 0.7); }
      mount.instanceMatrix.needsUpdate = true;
      drawHud(t);
    };

    const sfx = [
      ['bass', 0.2, 0.7], ['thud', F('hook1', 0.55), 0.9], ['riser', B('hook2') - 0.4, 0.35], ['kaching', E('hook2') - 0.3, 0.5], ['pop', B('hook3'), 0.5], ['pop', F('hook3', 0.33), 0.5], ['whoosh', F('hook3', 0.5), 0.6], ['ding', F('hook3', 0.62), 0.5],
      ['whoosh', B('loc') - 0.25, 0.8], ['ding', B('loc') + 0.6, 0.5], ['whoosh', LOCSPLIT - 0.2, 0.7], ['chime', F('loc', 0.8), 0.5],
      ['whoosh', B('potu') - 0.25, 0.8], ['thud', B('potu') + 0.1, 0.6], ['rustle', B('cooks'), 0.5], ['tick', B('cooks') + 0.3, 0.4], ['whoosh', B('since') - 0.2, 0.6], ['chime', F('since', 0.55), 0.5],
      ['whoosh', B('ingr') - 0.2, 0.7], ...PILES.map(p => ['thud', p.at() + 0.45, 0.85]), ['boing', PILES[2].at() + 0.5, 0.3],
      ['whoosh', B('step1') - 0.2, 0.6], ['pop', B('step1'), 0.5], ['buzz', B('step1') + 0.4, 0.25], ['pop', B('step2'), 0.5], ['rustle', B('step2') + 0.2, 0.5], ['pop', B('step3'), 0.5], ['tick', F('step3', 0.5), 0.4],
      ['whoosh', B('belts') - 0.2, 0.6], ['pop', B('belts') + 0.1, 0.4], ['pop', F('belts', 0.55), 0.4],
      ['whoosh', B('gi') - 0.2, 0.6], ['thud', F('gi', 0.35), 1.0], ['chime', F('gi', 0.35) + 0.15, 0.5],
      ['riser', B('peak') - 0.3, 0.4], ['coin', F('peak', 0.45), 0.35], ['kaching', F('peak', 0.85), 0.55],
      ['whoosh', B('cta') - 0.3, 0.6], ['pop', B('cta') + 0.2, 0.5], ['ding', B('cta') + 1.2, 0.5],
    ];
    return { duration: D, update, shots: [{ t: [0, 1], from: { pos: [0, 0, 1], look: [0, 0, 0] } }], sfx, watermark: false, endCard: false, music: {}, capFont: 'Fredoka Light', capMarginV: 520, capSize: 66 };
  },
};
