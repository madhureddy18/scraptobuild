// Kailasa Temple (Ellora Cave 16): hooks -> where/when -> 3 trenches -> top-down carving -> scale -> one piece -> no undo -> today -> CTA.
// Every visual is a pure function of t (frames can render in any order / in shards).
window.SCENE = {
  setup: { bg: 0x2a1a3a, fog: [70, 300], fov: 40, bloom: { strength: 0.36, radius: 0.55, threshold: 0.88 } },
  lines: window.STB_LINES,
  build(K, T) {
    const L = T.lines, IDX = {}; window.STB_LINES.forEach((l, i) => { IDX[l.id] = i; });
    const B = n => L[IDX[n]].t, E = n => L[IDX[n]].end, F = (n, f) => B(n) + (E(n) - B(n)) * f;
    const C = {
      rock1: F('hook2', 0.55), rw: B('step1') - 0.4, s1: B('step1'), bl: B('block'), s2: B('step2'),
      cA: B('step2') + 0.45, cB: E('tonnes') - 0.15, tease: F('tease', 0.42), hit: B('undo2') + 0.78,
    };
    const tr = [[C.s1 + 0.8, C.s1 + 2.1], [C.s1 + 1.7, C.s1 + 3.0], [C.s1 + 2.6, E('step1') + 0.35]];
    const D = E('cta') + 1.7;
    const THREE = window.THREE, S = K.scene;
    const ease = K.ease, eo = K.easeOut, prog = K.prog, clamp = K.clamp, lerp = K.lerp;

    // ---------------------------------------------------------------- sky + light
    const sky = (top, bot, glow) => K.canvasTex(64, 512, (x, w, h) => { const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, top); g.addColorStop(1, bot); x.fillStyle = g; x.fillRect(0, 0, w, h);
      const r = x.createRadialGradient(w / 2, h * 0.6, 0, w / 2, h * 0.6, h * 0.5); r.addColorStop(0, glow); r.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = r; x.fillRect(0, 0, w, h); });
    const skyDusk = sky('#1a1036', '#ff8f4a', 'rgba(255,190,110,0.35)'), skyDawn = sky('#3b5a9a', '#ffc58a', 'rgba(255,230,170,0.45)');
    S.background = skyDusk; S.fog = new THREE.Fog(0xc98a6a, 90, 330);
    S.add(new THREE.HemisphereLight(0x9c8ce0, 0x3a2416, 1.1)); S.add(new THREE.AmbientLight(0xffe2c8, 0.24));
    const sun = new THREE.DirectionalLight(0xffb27a, 3.1); sun.position.set(-34, 26, 22); sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -0.0006; sun.shadow.normalBias = 0.03;
    Object.assign(sun.shadow.camera, { left: -30, right: 30, top: 30, bottom: -30, near: 1, far: 130 }); S.add(sun);
    const fill = new THREE.DirectionalLight(0x8fa0ff, 0.7); fill.position.set(25, 18, -20); S.add(fill);

    // ---------------------------------------------------------------- materials
    const rockTex = (base, seed, lines = true) => K.canvasTex(512, 512, (x, w, h) => {
      const r = K.rng(seed); x.fillStyle = base; x.fillRect(0, 0, w, h);
      for (let i = 0; i < 2600; i++) { x.fillStyle = `rgba(${r() < 0.5 ? '0,0,0' : '255,235,210'},${0.03 + r() * 0.06})`; x.fillRect(r() * w, r() * h, 2 + r() * 7, 1 + r() * 4); }
      if (lines) for (let y = 0; y < h; y += 24 + r() * 30) { x.fillStyle = 'rgba(0,0,0,0.13)'; x.fillRect(0, y, w, 2 + r() * 3); }
    });
    const tWall = rockTex('#5a4a44', 3), tGround = rockTex('#6b5a3c', 5, false);
    [tWall, tGround].forEach(t => { t.wrapS = t.wrapT = THREE.RepeatWrapping; }); tWall.repeat.set(3, 2); tGround.repeat.set(28, 28);
    const mWall = new THREE.MeshStandardMaterial({ map: tWall, roughness: 0.95 });
    const mRock = new THREE.MeshStandardMaterial({ map: rockTex('#4d403b', 7), roughness: 0.92 });
    const mTemple = new THREE.MeshStandardMaterial({ map: rockTex('#8a7466', 11, false), roughness: 0.85 });
    const mDark = new THREE.MeshStandardMaterial({ color: 0x150e0c, roughness: 1 });
    const mGround = new THREE.MeshStandardMaterial({ map: tGround, roughness: 1 });
    const mFloor = new THREE.MeshStandardMaterial({ map: rockTex('#6a5547', 9, false), roughness: 1 });
    const mesh = (geo, m, x, y, z, parent = S) => { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); o.castShadow = o.receiveShadow = true; parent.add(o); return o; };
    const bx = (w, h, d, m, x, y, z, parent) => mesh(new THREE.BoxGeometry(w, h, d), m, x, y + h / 2, z, parent);   // y = bottom

    // ---------------------------------------------------------------- hill, pit, cliff with 34 caves
    const H = 11, PX = 8.2, PZ = 13.2, FRONT = PZ + 2.2, RX = 7.0, RZ = 12.0;
    for (const sx of [-1, 1]) bx(150, H, 110, mWall, sx * (PX + 75), 0, FRONT - 55);
    bx(2 * PX, H, 60, mWall, 0, 0, -PZ - 30);
    const plane = (w, d, m, x, y, z) => { const p = mesh(new THREE.PlaneGeometry(w, d), m, x, y, z); p.rotation.x = -Math.PI / 2; return p; };
    for (const sx of [-1, 1]) plane(200, 260, mGround, sx * (PX + 100), H + 0.02, FRONT - 130);
    plane(2 * PX, 220, mGround, 0, H + 0.02, -PZ - 110);
    plane(2 * PX, 2 * PZ, mFloor, 0, 0.01, 0);
    plane(500, 300, mGround, 0, -0.02, FRONT + 150);
    const br = K.rng(31), NB = 420, bush = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.6, 0), new THREE.MeshStandardMaterial({ color: 0x4a5a2a, roughness: 1, flatShading: true }), NB);
    for (let i = 0; i < NB; i++) { const o = new THREE.Object3D(); let x, y, z;
      if (i < 300) { do { x = (br() * 2 - 1) * 130; z = -90 + br() * 104; } while (Math.abs(x) < PX + 1 && z > -PZ - 2); y = H; }
      else { x = (br() * 2 - 1) * 160; z = FRONT + 8 + br() * 120; y = 0; }
      const sc = 0.5 + br() * 1.3; o.position.set(x, y + sc * 0.3, z); o.scale.set(sc, sc * 0.7, sc); o.rotation.y = br() * 6; o.updateMatrix(); bush.setMatrixAt(i, o.matrix); }
    bush.castShadow = true; S.add(bush);
    bx(2 * PX, 6.5, 2.2, mWall, 0, 0, PZ + 1.1); bx(5.2, 3.0, 2.3, mTemple, 0, 6.5, PZ + 1.1); bx(2.0, 4.0, 2.4, mDark, 0, 0, PZ + 1.1);
    for (let i = 0; i < 3; i++) bx(5.6 - i * 1.2, 0.35, 2.5, mTemple, 0, 9.5 + i * 0.35, PZ + 1.1);
    for (const sx of [-1, 1]) for (let z = -10; z <= 10; z += 2.5) { bx(0.2, 3.2, 1.9, mDark, sx * (PX - 0.05), 0.6, z); bx(0.5, 3.2, 0.32, mWall, sx * (PX - 0.15), 0.6, z + 1.25); }
    const caveX = i => i === 16 ? 0 : Math.sign(i - 16) * (PX + 4 + (Math.abs(i - 16) - 1) * 6.5);
    const cr = K.rng(44);
    for (let i = 1; i <= 34; i++) { if (i === 16) continue; const x = caveX(i), w = 2.6 + cr() * 1.6, h = 3.6 + cr() * 2.2;
      bx(w + 1.2, h + 1.0, 0.5, mTemple, x, 0, FRONT + 0.2); bx(w, h, 0.7, mDark, x, 0, FRONT + 0.25);
      for (const px of [-w / 3, w / 3]) bx(0.32, h, 0.35, mTemple, x + px, 0, FRONT + 0.55); }
    const hr = K.rng(21);
    for (let i = 0; i < 30; i++) { const a = (i / 30) * Math.PI * 2, r = 200 + hr() * 60, hg = 16 + hr() * 24;
      const m = new THREE.Mesh(new THREE.ConeGeometry(34 + hr() * 30, hg, 7), new THREE.MeshStandardMaterial({ color: 0x4a3150, roughness: 1, flatShading: true })); m.position.set(Math.cos(a) * r, hg / 2 - 2, Math.sin(a) * r); S.add(m); }

    // ---------------------------------------------------------------- the temple (one piece of basalt)
    const temple = new THREE.Group(); S.add(temple);
    const tb = (w, h, d, x, y, z, m = mTemple) => bx(w, h, d, m, x, y, z, temple);
    const band = (w, d, x, y, z) => tb(w + 0.3, 0.22, d + 0.3, x, y, z);
    tb(10, 2.4, 18.4, 0, 0, -0.3); band(10, 18.4, 0, 0.1, -0.3); band(10, 18.4, 0, 2.15, -0.3);
    tb(7, 3.8, 7, 0, 2.4, -4.6); band(7, 7, 0, 2.5, -4.6); band(7, 7, 0, 6.0, -4.6);
    for (let i = 0; i < 5; i++) { const s = 6.4 - i * 1.05; tb(s, 0.62, s, 0, 6.2 + i * 0.66, -4.6); tb(s + 0.25, 0.12, s + 0.25, 0, 6.2 + i * 0.66 + 0.55, -4.6);
      for (const [dx, dz] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) tb(0.5, 0.5, 0.5, dx * (s / 2 - 0.25), 6.2 + i * 0.66 + 0.62, -4.6 + dz * (s / 2 - 0.25)); }
    const dome = mesh(new THREE.SphereGeometry(1.25, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2), mTemple, 0, 9.5, -4.6, temple); dome.scale.y = 0.9;
    mesh(new THREE.CylinderGeometry(0.16, 0.26, 0.6, 8), mTemple, 0, 10.85, -4.6, temple); mesh(new THREE.SphereGeometry(0.2, 10, 8), mTemple, 0, 10.95, -4.6, temple);
    for (const [sx, sz] of [[1, -1], [-1, -1], [1, 1], [-1, 1]]) { const cx = sx * 3.9, cz = -4.6 + sz * 3.3; tb(1.3, 1.6, 1.3, cx, 2.4, cz); mesh(new THREE.ConeGeometry(0.9, 1.4, 4), mTemple, cx, 4.7, cz, temple).rotation.y = Math.PI / 4; }
    tb(8, 3.4, 7.2, 0, 2.4, 2.6); band(8, 7.2, 0, 5.7, 2.6); tb(8.6, 0.4, 7.8, 0, 5.8, 2.6);
    for (const sx of [-1, 1]) for (let z = -0.4; z <= 5.6; z += 1.5) mesh(new THREE.CylinderGeometry(0.26, 0.3, 3.4, 10), mTemple, sx * 4.15, 4.1, z, temple);
    tb(1.6, 2.6, 0.4, 0, 2.4, 6.25, mDark);
    tb(1.6, 0.5, 2.6, 0, 5.2, 7.4); for (const sx of [-1, 1]) tb(0.12, 0.35, 2.6, sx * 0.74, 5.7, 7.4);
    tb(3.8, 5.0, 3.8, 0, 0, 9.4); band(3.8, 3.8, 0, 4.8, 9.4); mesh(new THREE.ConeGeometry(2.4, 1.6, 4), mTemple, 0, 5.8, 9.4, temple).rotation.y = Math.PI / 4;
    for (const sx of [-1, 1]) for (let k = 0; k < 8; k++) tb(1.0, (k + 1) * 0.3, 0.32, sx * 2.6, 0, 8.9 + (7 - k) * 0.32 + 0.16);
    for (const sx of [-1, 1]) { const px = sx * 5.9, pz = 9.6;
      for (let i = 0; i < 6; i++) tb(0.7 - i * 0.04, 1.35, 0.7 - i * 0.04, px, i * 1.4, pz);
      for (let i = 1; i < 6; i++) tb(0.85, 0.12, 0.85, px, i * 1.4 - 0.06, pz);
      tb(1.0, 0.35, 1.0, px, 8.4, pz); mesh(new THREE.SphereGeometry(0.3, 10, 8), mTemple, px, 9.0, pz, temple); }
    const mTusk = new THREE.MeshStandardMaterial({ color: 0xd8cbb0, roughness: 0.6 });
    const elephant = (s, x, z, ry) => {
      const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry; g.scale.setScalar(s); temple.add(g);
      mesh(new THREE.SphereGeometry(0.62, 18, 12), mTemple, 0, 0.95, 0, g).scale.set(1.25, 0.9, 0.85);
      mesh(new THREE.SphereGeometry(0.42, 16, 12), mTemple, 0.82, 1.18, 0, g);
      for (const sz of [-1, 1]) mesh(new THREE.SphereGeometry(0.36, 12, 8), mTemple, 0.7, 1.2, sz * 0.4, g).scale.set(0.25, 1, 0.9);
      mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(1.12, 1.08, 0), new THREE.Vector3(1.35, 0.7, 0), new THREE.Vector3(1.32, 0.25, 0), new THREE.Vector3(1.45, 0.08, 0)]), 16, 0.11, 8), mTemple, 0, 0, 0, g);
      for (const [lx, lz] of [[0.45, 0.3], [0.45, -0.3], [-0.45, 0.3], [-0.45, -0.3]]) mesh(new THREE.CylinderGeometry(0.15, 0.17, 0.7, 10), mTemple, lx, 0.35, lz, g);
      for (const sz of [-1, 1]) mesh(new THREE.ConeGeometry(0.05, 0.4, 6), mTusk, 1.12, 0.85, sz * 0.16, g).rotation.z = -2.2;
      return g;
    };
    const elephants = [];
    for (const sx of [-1, 1]) for (let z = -7.6; z <= 6.4; z += 2.8) elephants.push(elephant(0.95, sx * 5.25, z, sx > 0 ? 0 : Math.PI));
    elephant(1.35, 4.3, 11.0, Math.PI / 2 + 0.25); elephant(1.35, -4.3, 11.0, Math.PI / 2 - 0.25);
    const heroEl = elephants.find(e => e.position.x > 0 && Math.abs(e.position.z - 3.6) < 0.1);

    // ---------------------------------------------------------------- uncarved rock: 3 trenches + the block
    const blocks = [], trench = [];
    const blk = (w, d, x, z, m, list) => { const o = mesh(new THREE.BoxGeometry(w, 1, d), m, x, 0, z); list.push(o); return o; };
    blk(2 * RX, 2 * RZ, 0, 0, mRock, blocks); blk(2 * RX, PZ - RZ, 0, (RZ + PZ) / 2, mRock, blocks); blk(2 * PX, FRONT - PZ, 0, (PZ + FRONT) / 2, mWall, blocks);
    blk(PX - RX, RZ + PZ, -(RX + PX) / 2, (PZ - RZ) / 2, mWall, trench); blk(PX - RX, RZ + PZ, (RX + PX) / 2, (PZ - RZ) / 2, mWall, trench); blk(2 * PX, PZ - RZ, 0, -(RZ + PZ) / 2, mWall, trench);
    const trA = [(PX - RX) * (RZ + PZ), (PX - RX) * (RZ + PZ), 2 * PX * (PZ - RZ)], blA = 4 * RX * RZ + 2 * RX * (PZ - RZ) + 2 * PX * (FRONT - PZ);
    const VOL = H * (trA[0] + trA[1] + trA[2] + blA);
    const pre = t => t >= C.rw;
    const trH = (t, k) => pre(t) ? H * (1 - eo(prog(t, tr[k][0], tr[k][1]))) : 0;
    const cvH = t => pre(t) ? H * (1 - ease(prog(t, C.cA, C.cB))) : 0;
    const removed = t => (trA[0] * (H - trH(t, 0)) + trA[1] * (H - trH(t, 1)) + trA[2] * (H - trH(t, 2)) + blA * (H - cvH(t))) / VOL;
    const ghost = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(2 * RX, H, 2 * RZ)), new THREE.LineBasicMaterial({ color: 0xffd36a, transparent: true, toneMapped: false }));
    ghost.position.y = H / 2; S.add(ghost);
    const ghostFill = new THREE.Mesh(new THREE.BoxGeometry(2 * RX, H, 2 * RZ), new THREE.MeshBasicMaterial({ color: 0xffc04a, transparent: true, opacity: 0, depthWrite: false, toneMapped: false }));
    ghostFill.position.y = H / 2; S.add(ghostFill);
    const cutPlane = new THREE.Mesh(new THREE.PlaneGeometry(2 * RX + 1.2, 2 * RZ + 1.2), new THREE.MeshBasicMaterial({ color: 0xffc04a, transparent: true, opacity: 0.32, depthWrite: false, side: THREE.DoubleSide, toneMapped: false }));
    cutPlane.rotation.x = -Math.PI / 2; S.add(cutPlane);

    // ---------------------------------------------------------------- 3D labels (sprites)
    const label = (draw, size, x, y, z) => { const tex = K.canvasTex(256, 256, draw); const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false, toneMapped: false })); sp.position.set(x, y, z); sp.scale.setScalar(size); sp.renderOrder = 20; S.add(sp); return sp; };
    const disc = (s, col, fg = '#ffffff') => (x, w, h) => { x.fillStyle = 'rgba(0,0,0,0.35)'; x.beginPath(); x.arc(w / 2, h / 2 + 6, 108, 0, 7); x.fill(); x.fillStyle = col; x.beginPath(); x.arc(w / 2, h / 2, 104, 0, 7); x.fill();
      x.strokeStyle = 'rgba(255,255,255,0.85)'; x.lineWidth = 8; x.stroke(); x.fillStyle = fg; x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = '700 118px "Oswald"'; x.fillText(s, w / 2, h / 2 + 6); };
    const FAITH = i => i <= 12 ? '#2fb8b0' : i <= 29 ? '#ff8a2a' : '#9a6cff';
    const caveTags = []; for (let i = 1; i <= 34; i++) caveTags.push(label(disc(String(i), i === 16 ? '#ffcf5a' : FAITH(i), i === 16 ? '#20142a' : '#fff'), i === 16 ? 6.5 : 4.2, caveX(i), i === 16 ? H + 4.5 : 7.8, FRONT + 1.4));
    const trTags = [[-(RX + PX) / 2, 0], [(RX + PX) / 2, 0], [0, -(RZ + PZ) / 2]].map(([x, z], k) => label(disc(String(k + 1), '#ffcf5a', '#20142a'), 5, x, H + 3.2, z));

    // ---------------------------------------------------------------- workers, debris, sparks
    const mCloth = new THREE.MeshStandardMaterial({ color: 0xf1e6d0, roughness: 0.8 }), mSkin = new THREE.MeshStandardMaterial({ color: 0x8a5a3a, roughness: 0.7 }), mTool = new THREE.MeshStandardMaterial({ color: 0x3a3a3a, metalness: 0.6, roughness: 0.4 });
    const worker = s => {
      const g = new THREE.Group(); g.scale.setScalar(s); S.add(g);
      mesh(new THREE.CapsuleGeometry(0.17, 0.42, 4, 10), mCloth, 0, 0.45, 0, g); mesh(new THREE.CapsuleGeometry(0.13, 0.35, 4, 10), mSkin, 0, 1.0, 0, g);
      mesh(new THREE.SphereGeometry(0.15, 12, 10), mSkin, 0, 1.42, 0, g); mesh(new THREE.SphereGeometry(0.16, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), mCloth, 0, 1.46, 0, g);
      const arm = new THREE.Group(); arm.position.set(0.14, 1.22, 0); g.add(arm);
      mesh(new THREE.CapsuleGeometry(0.05, 0.38, 4, 8), mSkin, 0, -0.22, 0, arm);
      mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.5, 6), mTool, 0, -0.46, 0.18, arm).rotation.x = Math.PI / 2; mesh(new THREE.BoxGeometry(0.16, 0.12, 0.12), mTool, 0, -0.46, 0.42, arm);
      const arm2 = new THREE.Group(); arm2.position.set(-0.14, 1.22, 0); g.add(arm2); mesh(new THREE.CapsuleGeometry(0.05, 0.38, 4, 8), mSkin, 0, -0.22, 0.05, arm2); arm2.rotation.x = -0.9;
      return { g, arm };
    };
    const wr = K.rng(77);
    const trCrew = Array.from({ length: 15 }, (_, i) => { const w = worker(0.45), k = i % 3; Object.assign(w, { k, u: wr(), v: wr(), ry: wr() * 6.28, ph: wr() * 6.28, sp: 7 + wr() * 4 }); return w; });
    const topCrew = Array.from({ length: 26 }, () => { const w = worker(0.45); Object.assign(w, { x: (wr() * 2 - 1) * (RX - 0.6), z: (wr() * 2 - 1) * (RZ - 0.6), ry: wr() * 6.28, ph: wr() * 6.28, sp: 7 + wr() * 4 }); return w; });
    const TOOL = [2.3, 4.6];
    [[0, 0, -0.6], [1.0, 0.8, 2.5], [-0.9, 0.9, 1.0]].forEach(([dx, dz, ry]) => { const w = worker(0.5); Object.assign(w, { x: TOOL[0] + dx, z: TOOL[1] + dz, ry, ph: dx * 3, sp: 8.5 }); topCrew.push(w); });
    const trBox = k => k === 0 ? [-PX, -RX, -RZ, PZ] : k === 1 ? [RX, PX, -RZ, PZ] : [-PX, PX, -PZ, -RZ];
    const ct = new THREE.Vector3(heroEl.position.x + 1.2, 1.05, heroEl.position.z);
    const hero = worker(0.62); hero.g.position.set(ct.x + 0.48, 0, ct.z); hero.g.rotation.y = -Math.PI / 2;
    const chunk = mesh(new THREE.DodecahedronGeometry(0.13, 0), mTemple, ct.x - 0.05, ct.y, ct.z + 0.05);

    const ND = 600, dr = K.rng(5);
    const debris = new THREE.InstancedMesh(new THREE.DodecahedronGeometry(0.16, 0), mRock, ND); debris.castShadow = true; S.add(debris);
    const deb = Array.from({ length: ND }, () => ({ b: dr() < 0.3 ? lerp(tr[0][0], tr[2][1] - 0.3, dr()) : lerp(C.cA + 0.1, C.cB - 0.3, dr()), k: Math.floor(dr() * 3), u: dr(), v: dr(), vx: (dr() * 2 - 1) * 3.2, vy: 3 + dr() * 5, vz: (dr() * 2 - 1) * 3.2, s: 0.5 + dr() * 1.3, r: dr() * 6 }));
    const NS = 150, sr = K.rng(9);
    const sparks = new THREE.InstancedMesh(new THREE.SphereGeometry(0.03, 6, 4), new THREE.MeshBasicMaterial({ color: 0xffc46a, toneMapped: false }), NS); S.add(sparks);
    const spk = Array.from({ length: NS }, () => ({ v: new THREE.Vector3(0.6 + sr() * 2.4, sr() * 2.8, (sr() * 2 - 1) * 2.2), life: 0.25 + sr() * 0.45 }));
    const hits = [C.tease, B('undo2') + 0.15, C.hit];
    const flashL = new THREE.PointLight(0xffb04a, 0, 6, 2); flashL.position.copy(ct); S.add(flashL);
    const workL = new THREE.PointLight(0xffc89a, 0, 9, 1.6); workL.position.set(ct.x + 1.0, 3.0, ct.z + 2.2); S.add(workL);
    const M4 = new THREE.Matrix4(), Q = new THREE.Quaternion(), V = new THREE.Vector3(), SC = new THREE.Vector3(), EU = new THREE.Euler();

    // ---------------------------------------------------------------- HUD (2D overlay)
    const hudTex = K.canvasTex(1080, 1920, () => {});
    const hudScene = new THREE.Scene(), hudCam = new THREE.OrthographicCamera(-540, 540, 960, -960, -10, 10);
    hudScene.add(new THREE.Mesh(new THREE.PlaneGeometry(1080, 1920), new THREE.MeshBasicMaterial({ map: hudTex, transparent: true, toneMapped: false, depthTest: false })));
    K.draw = () => { K.composer.render(); const r = K.renderer; r.autoClear = false; r.clearDepth(); r.render(hudScene, hudCam); r.autoClear = true; };
    const GOLD = '#ffcf5a', INK = 'rgba(14,10,22,0.78)', RED = '#ff4b3e';
    const fnt = (w, s, f = 'Oswald') => `${w} ${s}px "${f}"`;
    const fade = (t, a, b = 1e9) => prog(t, a, a + 0.25) * (1 - prog(t, b, b + 0.25));
    const pop = (t, a, b = 1e9) => (t >= a && t < b + 0.25) ? K.easeBack(prog(t, a, a + 0.35)) * (1 - K.easeIn(prog(t, b, b + 0.25))) : 0;
    let X;
    const A = (a, fn) => { if (a <= 0.002) return; X.save(); X.globalAlpha *= clamp(a); fn(); X.restore(); };
    const Z = (k, cx, cy, fn, rot = 0) => { if (k <= 0.002) return; X.save(); X.translate(cx, cy); X.rotate(rot); X.scale(k, k); X.translate(-cx, -cy); fn(); X.restore(); };
    const panel = (x, y, w, h, r = 34, bg = INK, border = 'rgba(255,207,90,0.45)') => { X.fillStyle = bg; K.rrect(X, x, y, w, h, r); X.fill(); if (border) { X.strokeStyle = border; X.lineWidth = 3; X.stroke(); } };
    const txt = (s, x, y, { size = 40, w = 600, f = 'Oswald', col = '#fff', al = 'center', max } = {}) => { X.font = fnt(w, size, f); if (max) { const m = X.measureText(s).width; if (m > max) X.font = fnt(w, Math.floor(size * max / m), f); } X.fillStyle = col; X.textAlign = al; X.textBaseline = 'middle'; X.fillText(s, x, y); };
    const pill = (cx, cy, s, { size = 38, fg = '#fff', bg = INK, border = 'rgba(255,207,90,0.5)' } = {}) => { X.font = fnt(600, size); const W = X.measureText(s).width + 64, Hh = size * 1.8; panel(cx - W / 2, cy - Hh / 2, W, Hh, Hh / 2, bg, border); txt(s, cx, cy + 2, { size, col: fg }); };
    const stamp = (t, a, b, big, sub, col, cy = 430, rot = -0.08) => {
      if (t < a || t > b + 0.25) return;
      const k0 = prog(t, a, a + 0.22), k = (k0 < 1 ? lerp(2.4, 1, eo(k0)) : 1), al = prog(t, a, a + 0.12) * (1 - prog(t, b, b + 0.25));
      A(al, () => Z(k, 540, cy, () => { X.strokeStyle = col; X.lineWidth = 10; K.rrect(X, 230, cy - 115, 620, 230, 26); X.stroke(); X.lineWidth = 3; K.rrect(X, 246, cy - 99, 588, 198, 18); X.stroke();
        txt(big, 540, cy - 12, { size: 112, w: 900, f: 'Cinzel', col, max: 560 }); txt(sub, 540, cy + 66, { size: 32, col, max: 560 }); }, rot));
    };
    const step = (t, a, b, n, s, cy = 210) => A(fade(t, a, b), () => Z(pop(t, a, b), 540, cy, () => {
      X.font = fnt(600, 40); const w = X.measureText(s).width + 170; X.fillStyle = 'rgba(255,255,255,0.95)'; K.rrect(X, 540 - w / 2, cy - 44, w, 88, 44); X.fill();
      X.fillStyle = GOLD; X.beginPath(); X.arc(540 - w / 2 + 46, cy, 32, 0, 7); X.fill(); txt(n, 540 - w / 2 + 46, cy + 2, { size: 38, w: 700, col: '#20142a' }); txt(s, 540 - w / 2 + 96, cy + 2, { size: 40, col: '#20142a', al: 'left' }); }));
    const fmt = n => Math.round(n).toLocaleString('en-US');
    const check = (x, y, s, col = GOLD) => { X.strokeStyle = col; X.lineWidth = s * 0.16; X.lineCap = 'round'; X.beginPath(); X.moveTo(x - s * 0.4, y); X.lineTo(x - s * 0.1, y + s * 0.3); X.lineTo(x + s * 0.45, y - s * 0.35); X.stroke(); };
    const cross = (x, y, s, col = RED) => { X.strokeStyle = col; X.lineWidth = s * 0.14; X.lineCap = 'round'; X.beginPath(); X.moveTo(x - s / 2, y - s / 2); X.lineTo(x + s / 2, y + s / 2); X.moveTo(x + s / 2, y - s / 2); X.lineTo(x - s / 2, y + s / 2); X.stroke(); };
    const pinIcon = (cx, cy, s, col = RED) => { X.fillStyle = col; X.beginPath(); X.arc(cx, cy - s * 0.55, s * 0.45, Math.PI * 0.85, Math.PI * 2.15); X.lineTo(cx, cy + s * 0.15); X.closePath(); X.fill(); X.fillStyle = '#fff'; X.beginPath(); X.arc(cx, cy - s * 0.55, s * 0.17, 0, 7); X.fill(); };

    // simplified India outline + Maharashtra (lon, lat) for a stylised map
    const INDIA = [[68.2, 23.7], [68.8, 23.3], [69.0, 22.4], [70.5, 20.8], [72.3, 21.3], [72.6, 22.2], [72.9, 20.8], [72.8, 19.0], [73.3, 17.0], [73.9, 15.5], [74.6, 13.5], [75.5, 11.5], [76.2, 10.0], [77.0, 8.3], [77.6, 8.1], [78.2, 8.9], [79.0, 9.4], [79.3, 10.3], [79.85, 10.8], [79.9, 12.3], [80.3, 13.5], [80.1, 15.2], [80.6, 15.9], [81.5, 16.3], [82.3, 16.7], [83.4, 17.7], [84.8, 19.2], [86.4, 20.0], [87.0, 21.0], [87.6, 21.6], [88.2, 21.7], [89.0, 21.9], [88.7, 23.5], [88.0, 24.4], [88.4, 25.2], [89.0, 25.3], [89.8, 26.0], [90.6, 25.2], [92.0, 25.1], [92.3, 24.2], [91.6, 23.2], [92.3, 22.0], [93.2, 22.3], [93.4, 23.8], [94.2, 24.0], [94.6, 25.4], [95.2, 26.6], [96.3, 27.3], [97.3, 28.2], [96.2, 29.3], [95.4, 29.0], [94.0, 28.0], [92.2, 27.8], [91.6, 27.1], [89.8, 26.8], [88.9, 27.2], [88.8, 28.1], [88.1, 27.9], [88.1, 26.5], [86.0, 26.5], [84.0, 27.4], [82.0, 27.7], [80.1, 28.8], [80.9, 30.2], [79.0, 31.4], [78.7, 32.6], [79.4, 32.6], [79.5, 34.0], [78.0, 35.5], [77.0, 35.6], [75.0, 37.0], [73.9, 36.0], [73.7, 34.6], [74.0, 33.4], [74.6, 32.7], [75.3, 32.2], [74.5, 31.0], [73.9, 30.1], [72.2, 28.4], [70.6, 27.8], [69.5, 26.6], [70.1, 25.2], [71.0, 24.5], [69.9, 24.2], [68.8, 24.3]];
    const MAHA = [[72.7, 20.1], [73.5, 21.0], [74.2, 21.6], [75.5, 21.4], [76.6, 21.3], [77.4, 21.6], [78.4, 21.5], [79.3, 21.6], [80.4, 21.5], [80.7, 20.4], [80.3, 19.2], [79.6, 19.3], [78.9, 19.5], [78.2, 19.3], [77.6, 18.5], [77.5, 17.6], [76.6, 17.3], [75.8, 16.9], [75.0, 16.3], [74.3, 15.8], [73.8, 15.7], [73.3, 16.6], [73.1, 17.6], [72.9, 18.9]];
    const MK = 26, mx = lon => 160 + (lon - 68) * MK * 0.93, my = lat => 330 + (37 - lat) * MK;
    const poly = (pts, n = pts.length) => { X.beginPath(); for (let i = 0; i < n; i++) { const [lo, la] = pts[i]; i ? X.lineTo(mx(lo), my(la)) : X.moveTo(mx(lo), my(la)); } };
    const drawMap = t => {
      const a = B('loc'), b = E('loc'), k = pop(t, a - 0.1, b + 0.1); if (!k) return;
      A(fade(t, a - 0.1, b + 0.1), () => Z(k, 540, 760, () => {
        panel(90, 230, 900, 1050, 40, 'rgba(10,8,22,0.86)');
        txt('WHERE IS IT?', 540, 290, { size: 44, w: 700, col: GOLD });
        const dk = eo(prog(t, a, a + 1.0)), n = Math.max(2, Math.floor(INDIA.length * dk));
        poly(INDIA, n); if (dk >= 1) X.closePath(); X.fillStyle = `rgba(255,255,255,${0.08 * dk})`; X.fill(); X.strokeStyle = 'rgba(255,255,255,0.85)'; X.lineWidth = 4; X.lineJoin = 'round'; X.stroke();
        const sa = prog(t, F('loc', 0.62), F('loc', 0.62) + 0.35);
        if (sa > 0) { poly(MAHA); X.closePath(); X.fillStyle = `rgba(255,138,42,${0.85 * sa})`; X.fill(); X.strokeStyle = `rgba(255,220,170,${sa})`; X.lineWidth = 3; X.stroke();
          A(sa, () => txt('MAHARASHTRA', mx(77.8), my(18.0), { size: 30, w: 700, col: '#fff' })); }
        for (const [nm, lo, la, dx] of [['DELHI', 77.2, 28.6, 1], ['MUMBAI', 72.88, 19.08, -1]]) A(prog(t, a + 0.8, a + 1.1), () => { X.fillStyle = '#fff'; X.beginPath(); X.arc(mx(lo), my(la), 7, 0, 7); X.fill(); txt(nm, mx(lo) + dx * 16, my(la), { size: 24, w: 500, col: 'rgba(255,255,255,0.85)', al: dx > 0 ? 'left' : 'right' }); });
        const pa = F('loc', 0.4), pk = prog(t, pa, pa + 0.35), ex = mx(75.18), ey = my(20.03);
        if (pk > 0) { const pr = (t * 1.2) % 1; X.strokeStyle = `rgba(255,75,62,${1 - pr})`; X.lineWidth = 4; X.beginPath(); X.arc(ex, ey, 14 + pr * 50, 0, 7); X.stroke();
          pinIcon(ex, ey - (1 - eo(pk)) * 120, 46); A(pk, () => { panel(ex - 260, ey - 150, 230, 62, 31, 'rgba(255,255,255,0.95)', null); txt('ELLORA CAVES', ex - 145, ey - 118, { size: 30, w: 700, col: '#20142a' }); }); }
        A(prog(t, F('loc', 0.75), F('loc', 0.75) + 0.3), () => txt('INDIA', mx(79), my(13.5), { size: 64, w: 700, f: 'Cinzel', col: 'rgba(255,255,255,0.9)' }));
      }));
    };
    const drawCaves = t => {
      const a = B('caves'), b = E('caves'); if (t < a - 0.1 || t > b + 0.4) return;
      A(fade(t, a - 0.1, b + 0.2), () => {
        panel(110, 140, 860, 330, 36);
        const n = Math.max(1, Math.min(34, Math.floor(1 + 33 * eo(prog(t, a + 0.2, F('caves', 0.55))))));
        txt('ELLORA CAVES', 540, 195, { size: 40, w: 600, col: 'rgba(255,255,255,0.85)' });
        txt(String(n), 470, 285, { size: 120, w: 700, col: GOLD }); txt('CAVES', 610, 300, { size: 52, w: 600 });
        [['1–12', 'BUDDHIST', '#2fb8b0'], ['13–29', 'HINDU', '#ff8a2a'], ['30–34', 'JAIN', '#9a6cff']].forEach(([r, nm, c], i) => A(prog(t, a + 0.6 + i * 0.25, a + 0.9 + i * 0.25), () => {
          const x = 200 + i * 245; X.fillStyle = c; X.beginPath(); X.arc(x, 412, 16, 0, 7); X.fill(); txt(r, x + 28, 400, { size: 30, w: 700, al: 'left' }); txt(nm, x + 28, 434, { size: 22, w: 500, al: 'left', col: 'rgba(255,255,255,0.8)' }); }));
        const k16 = F('caves', 0.62);
        A(fade(t, k16, b + 0.2), () => Z(pop(t, k16), 540, 560, () => pill(540, 560, '★  CAVE 16 = KAILASA TEMPLE', { size: 44, fg: '#20142a', bg: GOLD, border: null })));
      });
    };
    const drawWhen = t => {
      const a = B('when'), b = E('when'); if (t < a - 0.1 || t > b + 0.4) return;
      A(fade(t, a - 0.1, b + 0.1), () => {
        panel(80, 150, 920, 270, 36);
        const x0 = 150, x1 = 930, yy = 300, X760 = lerp(x0, x1, 760 / 2026), mk = eo(prog(t, a + 0.2, F('when', 0.5)));
        X.strokeStyle = 'rgba(255,255,255,0.3)'; X.lineWidth = 8; X.lineCap = 'round'; X.beginPath(); X.moveTo(x0, yy); X.lineTo(x1, yy); X.stroke();
        X.strokeStyle = GOLD; X.beginPath(); X.moveTo(x0, yy); X.lineTo(lerp(x0, X760, mk), yy); X.stroke();
        txt('0 CE', x0, yy + 50, { size: 28, w: 500, col: 'rgba(255,255,255,0.7)' }); txt('TODAY', x1, yy + 50, { size: 28, w: 500, col: 'rgba(255,255,255,0.7)' });
        const mx_ = lerp(x0, X760, mk); X.fillStyle = GOLD; X.beginPath(); X.arc(mx_, yy, 18, 0, 7); X.fill();
        txt('≈ 760 CE', mx_, yy - 58, { size: 54, w: 700, col: GOLD }); txt('≈ 1,260 YEARS AGO', 720, 195, { size: 32, w: 500, col: 'rgba(255,255,255,0.85)' });
        const ka = F('when', 0.5);
        A(fade(t, ka, b + 0.1), () => Z(pop(t, ka), 540, 545, () => { panel(170, 460, 740, 170, 30, 'rgba(255,255,255,0.95)', null);
          X.fillStyle = GOLD; X.beginPath(); X.moveTo(220, 570); X.lineTo(230, 505); X.lineTo(262, 540); X.lineTo(290, 495); X.lineTo(318, 540); X.lineTo(350, 505); X.lineTo(360, 570); X.closePath(); X.fill();
          txt('KING KRISHNA I', 640, 518, { size: 56, w: 700, col: '#20142a' }); txt('RASHTRAKUTA DYNASTY · 8TH CENTURY', 640, 585, { size: 30, w: 500, col: '#5a4a44' }); }));
      });
    };
    const drawOrder = t => {
      const a = C.s2 + 0.3, b = E('order') + 0.4; if (t < a - 0.1 || t > b + 0.4) return;
      A(fade(t, a, b), () => {
        const x = 830, y = 330, w = 200, h = 620; panel(x - 20, y - 70, w + 40, h + 150, 30);
        txt('TOP', x + w / 2, y - 32, { size: 30, w: 700, col: GOLD });
        [['ROOF', 0.0, 0.3, 0.12], ['WALLS', 0.3, 0.72, 0.47], ['FLOOR', 0.72, 1.0, 0.82]].forEach(([nm, f0, f1, at]) => { const on = prog(t, F('order', at), F('order', at) + 0.25), y0 = y + f0 * h, y1 = y + f1 * h;
          X.fillStyle = on > 0 ? `rgba(255,207,90,${0.25 + 0.6 * on})` : 'rgba(255,255,255,0.1)'; K.rrect(X, x, y0 + 4, w, y1 - y0 - 8, 14); X.fill();
          txt(nm, x + w / 2, (y0 + y1) / 2 - (on > 0 ? 18 : 0), { size: 38, w: 700, col: on > 0 ? '#20142a' : 'rgba(255,255,255,0.8)' });
          if (on > 0) A(on, () => check(x + w / 2, (y0 + y1) / 2 + 30, 40, '#20142a')); });
        const ay = lerp(y, y + h, 1 - cvH(t) / H); X.fillStyle = RED; X.fillRect(x - 12, ay - 3, w + 24, 6);
        txt('DOWN', x + w / 2, y + h + 40, { size: 30, w: 700, col: GOLD });
      });
    };
    const drawTools = t => {
      const a = B('tools'), b = E('tools'); if (t < a - 0.1 || t > b + 0.3) return;
      const icon = (cx, cy, k, draw, lab, bad) => Z(k, cx, cy, () => { panel(cx - 170, cy - 150, 340, 300, 34, bad ? 'rgba(60,10,10,0.88)' : 'rgba(255,255,255,0.95)', bad ? RED : null); draw(cx, cy - 25); txt(lab, cx, cy + 105, { size: 36, w: 700, col: bad ? '#fff' : '#20142a' }); });
      A(fade(t, a, b), () => {
        icon(300, 590, pop(t, a + 0.05, b), (x, y) => { X.fillStyle = '#9aa0a8'; for (let i = 0; i < 8; i++) { X.save(); X.translate(x, y); X.rotate(i * Math.PI / 4); X.fillRect(-16, -78, 32, 30); X.restore(); } X.beginPath(); X.arc(x, y, 58, 0, 7); X.fill(); X.fillStyle = 'rgba(60,10,10,1)'; X.beginPath(); X.arc(x, y, 24, 0, 7); X.fill(); cross(x, y, 120); }, 'NO MACHINES', true);
        icon(780, 590, pop(t, F('tools', 0.45), b), (x, y) => { X.save(); X.translate(x - 30, y); X.rotate(-0.6); X.fillStyle = '#8a5a3a'; X.fillRect(-9, -10, 18, 120); X.fillStyle = '#3a3a3a'; X.fillRect(-45, -50, 90, 44); X.restore();
          X.save(); X.translate(x + 45, y + 5); X.rotate(0.5); X.fillStyle = '#c9c9c9'; X.fillRect(-7, -70, 14, 110); X.beginPath(); X.moveTo(-7, 40); X.lineTo(7, 40); X.lineTo(0, 62); X.closePath(); X.fill(); X.fillStyle = '#8a5a3a'; X.fillRect(-11, -90, 22, 40); X.restore(); }, 'HAMMER + CHISEL', false);
      });
    };
    const drawCounter = t => {
      const a = C.cA, b = B('size') - 0.2; if (t < a - 0.1 || t > b + 0.3) return;
      const big = t > B('tonnes') - 0.2;
      A(fade(t, a, b), () => {
        if (!big) { panel(160, 280, 580, 170, 30); txt('STONE REMOVED BY HAND', 450, 320, { size: 28, w: 500, col: 'rgba(255,255,255,0.85)' }); txt(fmt(200000 * removed(t)) + ' t', 450, 392, { size: 68, w: 700, col: GOLD }); return; }
        const cy = 620; Z(pop(t, B('tonnes') - 0.2), 540, cy, () => { panel(110, cy - 220, 860, 440, 40);
          txt('STONE REMOVED BY HAND', 540, cy - 160, { size: 38, w: 500, col: 'rgba(255,255,255,0.85)' });
          txt(fmt(200000 * removed(t)), 540, cy - 55, { size: 150, w: 700, col: GOLD }); txt('TONNES', 540, cy + 55, { size: 52, w: 600 });
          X.fillStyle = 'rgba(255,255,255,0.15)'; K.rrect(X, 190, cy + 105, 700, 18, 9); X.fill(); X.fillStyle = GOLD; K.rrect(X, 190, cy + 105, Math.max(18, 700 * removed(t)), 18, 9); X.fill();
          A(prog(t, F('tonnes', 0.6), F('tonnes', 0.6) + 0.3), () => txt('≈ THE WEIGHT OF 40,000 ELEPHANTS', 540, cy + 170, { size: 34, w: 600 })); });
      });
    };
    const drawSize = t => {
      const a = B('size'), b = E('size'); if (t < a - 0.1 || t > b + 0.4) return;
      A(fade(t, a - 0.1, b + 0.15), () => Z(pop(t, a - 0.1, b + 0.15), 540, 700, () => {
        panel(70, 200, 940, 1020, 40, 'rgba(12,26,60,0.92)', 'rgba(140,190,255,0.6)');
        X.strokeStyle = 'rgba(140,190,255,0.12)'; X.lineWidth = 1; for (let gx = 90; gx < 1000; gx += 40) { X.beginPath(); X.moveTo(gx, 210); X.lineTo(gx, 1210); X.stroke(); } for (let gy = 220; gy < 1210; gy += 40) { X.beginPath(); X.moveTo(80, gy); X.lineTo(1000, gy); X.stroke(); }
        txt('HOW TALL IS IT?', 540, 262, { size: 44, w: 700, col: '#cfe2ff' });
        const g = 1130, pm = 22.5, dk = eo(prog(t, a, a + 1.2));
        X.strokeStyle = '#cfe2ff'; X.lineWidth = 3; X.beginPath(); X.moveTo(120, g); X.lineTo(960, g); X.stroke();
        X.fillStyle = '#cfe2ff'; for (let m = 0; m <= 32; m += 8) { X.fillRect(150, g - m * pm - 1, 24, 3); txt(m + ' m', 140, g - m * pm, { size: 24, w: 500, col: '#cfe2ff', al: 'right' }); }
        X.fillRect(160, g - 32 * pm, 3, 32 * pm);
        X.save(); X.beginPath(); X.rect(200, g - 33 * pm * dk - 2, 440, 33 * pm * dk + 4); X.clip();
        X.fillStyle = 'rgba(255,207,90,0.25)'; X.strokeStyle = GOLD; X.lineWidth = 4; X.beginPath();
        const tx = 410, lv = [[180, 0], [180, 3], [150, 3], [150, 8], [130, 8], [130, 12]]; X.moveTo(tx - 180, g);
        for (const [w2, m] of lv) X.lineTo(tx - w2, g - m * pm); for (let i = 0; i < 6; i++) { const w2 = 120 - i * 17, m = 12 + i * 2.8; X.lineTo(tx - w2, g - m * pm); X.lineTo(tx - w2, g - (m + 2.8) * pm); }
        X.lineTo(tx - 22, g - 29 * pm); X.quadraticCurveTo(tx, g - 32.5 * pm, tx + 22, g - 29 * pm);
        for (let i = 5; i >= 0; i--) { const w2 = 120 - i * 17, m = 12 + i * 2.8; X.lineTo(tx + w2, g - (m + 2.8) * pm); X.lineTo(tx + w2, g - m * pm); }
        for (const [w2, m] of lv.slice().reverse()) X.lineTo(tx + w2, g - m * pm); X.lineTo(tx + 180, g); X.closePath(); X.fill(); X.stroke(); X.restore();
        A(prog(t, a + 1.0, a + 1.3), () => { X.strokeStyle = GOLD; X.lineWidth = 3; X.setLineDash([10, 8]); X.beginPath(); X.moveTo(170, g - 32 * pm); X.lineTo(640, g - 32 * pm); X.stroke(); X.setLineDash([]); panel(250, g - 32 * pm - 100, 320, 70, 35, GOLD, null); txt('≈ 32 METRES', 410, g - 32 * pm - 65, { size: 40, w: 700, col: '#20142a' }); });
        const fa = F('size', 0.5), fl = Math.floor(clamp((t - fa) / 0.12, 0, 10)), bx0 = 700, bw = 190, fh = 3.2 * pm;
        for (let i = 0; i < 10; i++) { const y0 = g - (i + 1) * fh, on = i < fl; X.fillStyle = on ? 'rgba(207,226,255,0.35)' : 'rgba(207,226,255,0.06)'; X.fillRect(bx0, y0, bw, fh - 3); X.strokeStyle = '#cfe2ff'; X.lineWidth = 2; X.strokeRect(bx0, y0, bw, fh - 3);
          for (let w = 0; w < 4; w++) { X.fillStyle = on ? 'rgba(255,230,150,0.9)' : 'rgba(207,226,255,0.2)'; X.fillRect(bx0 + 16 + w * 44, y0 + 18, 26, fh - 40); }
          if (on) txt(String(i + 1), bx0 + bw + 30, y0 + fh / 2, { size: 26, w: 700, col: '#cfe2ff' }); }
        A(prog(t, fa + 1.2, fa + 1.5), () => txt('10 FLOORS', bx0 + bw / 2, g - 10 * fh - 40, { size: 36, w: 700, col: '#cfe2ff' }));
        const px = 660, ph = 1.7 * pm; X.fillStyle = '#fff'; X.beginPath(); X.arc(px, g - ph + 6, 6, 0, 7); X.fill(); X.fillRect(px - 3, g - ph + 12, 6, ph - 12);
        txt('YOU', px, g + 28, { size: 22, w: 700, col: '#fff' });
      }));
    };
    const drawOnePiece = t => {
      const a = B('onepiece'), b = E('onepiece'); if (t < a - 0.1 || t > b + 0.3) return;
      const items = [['PILLARS', 0.0], ['STAIRS', 0.15], ['BRIDGES', 0.29], ['LIFE-SIZE ELEPHANTS', 0.43]];
      A(fade(t, a, F('onepiece', 0.64)), () => { panel(70, 170, 620, 340, 34);
        items.forEach(([nm, f], i) => { const k = pop(t, F('onepiece', f)); if (!k) return; Z(k, 130, 230 + i * 78, () => { X.fillStyle = GOLD; X.beginPath(); X.arc(130, 230 + i * 78, 26, 0, 7); X.fill(); check(130, 232 + i * 78, 26, '#20142a'); txt(nm, 175, 232 + i * 78, { size: 42, w: 600, al: 'left' }); }); }); });
      stamp(t, F('onepiece', 0.66), b, '1 PIECE', 'ALL CARVED FROM THE SAME ROCK', GOLD, 430);
    };
    const drawUndo = t => {
      const a = B('undo1'), b = E('undo1') + 0.3; if (t < a - 0.1 || t > b + 0.3) return;
      A(fade(t, a, b), () => Z(pop(t, a, b), 540, 440, () => {
        const key = (x, s, w) => { X.fillStyle = 'rgba(0,0,0,0.4)'; K.rrect(X, x + 6, 370, w, 150, 22); X.fill(); X.fillStyle = '#f4f1ea'; K.rrect(X, x, 360, w, 150, 22); X.fill(); X.fillStyle = '#d9d4c8'; K.rrect(X, x, 480, w, 30, 12); X.fill(); txt(s, x + w / 2, 430, { size: 64, w: 700, col: '#20142a' }); };
        key(250, 'Ctrl', 260); txt('+', 560, 435, { size: 70, w: 700 }); key(620, 'Z', 210);
        const ck = prog(t, F('undo1', 0.55), F('undo1', 0.55) + 0.25); if (ck > 0) { X.save(); X.globalAlpha = ck; cross(540, 435, 300 * eo(ck)); X.restore(); txt('UNDO NOT AVAILABLE', 540, 580, { size: 36, w: 700, col: RED }); }
      }));
    };
    const drawToday = t => {
      const a = B('today'), b = E('today'); if (t < a - 0.1 || t > b + 0.3) return;
      A(fade(t, a, b), () => {
        Z(pop(t, a + 0.1, b), 540, 360, () => { X.fillStyle = 'rgba(255,255,255,0.96)'; X.beginPath(); X.arc(540, 360, 160, 0, 7); X.fill(); X.strokeStyle = '#1b6fd0'; X.lineWidth = 10; X.stroke();
          X.lineWidth = 6; X.beginPath(); X.rect(480, 300, 120, 60); X.moveTo(470, 300); X.lineTo(540, 262); X.lineTo(610, 300); X.stroke();
          X.fillStyle = '#1b6fd0'; for (let i = 0; i < 4; i++) X.fillRect(492 + i * 30, 306, 8, 50);
          txt('UNESCO', 540, 400, { size: 44, w: 700, col: '#1b6fd0' }); txt('WORLD HERITAGE', 540, 446, { size: 26, w: 600, col: '#1b6fd0' }); });
        A(prog(t, a + 0.6, a + 0.9), () => pill(540, 600, 'ELLORA CAVES · LISTED IN 1983', { size: 36 }));
        const ya = F('today', 0.55); A(fade(t, ya, b), () => Z(pop(t, ya, b), 540, 760, () => { panel(260, 680, 560, 170, 30); txt(fmt(1200 * eo(prog(t, ya, ya + 1.3))) + '+', 540, 745, { size: 84, w: 700, col: GOLD }); txt('YEARS STILL STANDING', 540, 815, { size: 32, w: 500 }); }));
      });
    };
    const drawCta = t => {
      const a = B('cta'); if (t < a - 0.2) return;
      A(prog(t, a - 0.2, a + 0.2), () => {
        const k = eo(prog(t, a - 0.2, a + 0.8));
        X.fillStyle = 'rgba(255,207,90,0.9)'; X.fillRect(540 - 270 * k, 190, 540 * k, 3); X.fillRect(540 - 270 * k, 420, 540 * k, 3);
        X.shadowColor = 'rgba(0,0,0,0.6)'; X.shadowBlur = 18; txt('KAILASA', 540, 262, { size: 108, w: 900, f: 'Cinzel', col: GOLD }); txt('TEMPLE', 540, 364, { size: 108, w: 900, f: 'Cinzel', col: GOLD }); X.shadowBlur = 0;
        txt('CAVE 16 · ELLORA · CARVED FROM ONE ROCK', 540, 470, { size: 32, w: 500 });
        const ca = a + 0.3; Z(pop(t, ca), 540, 640, () => { panel(170, 580, 740, 120, 60, 'rgba(255,255,255,0.97)', null);
          X.fillStyle = '#20142a'; X.beginPath(); X.arc(240, 640, 34, 0, 7); X.fill(); X.fillStyle = '#fff'; K.rrect(X, 222, 626, 36, 24, 8); X.fill(); X.beginPath(); X.moveTo(230, 648); X.lineTo(228, 658); X.lineTo(240, 648); X.fill();
          const nshow = Math.floor(clamp((t - ca - 0.4) / 0.14, 0, 4)); txt('ROCK'.slice(0, nshow) + ((t * 2) % 1 < 0.5 ? '|' : ' '), 300, 642, { size: 60, w: 700, col: '#20142a', al: 'left' });
          X.fillStyle = '#1b6fd0'; K.rrect(X, 760, 608, 120, 64, 32); X.fill(); txt('POST', 820, 642, { size: 30, w: 700 }); });
        const fa = F('cta', 0.55); Z(pop(t, fa), 540, 790, () => { const press = K.pulse(t, fa + 0.8, 0.3), w = 560 - press * 30;
          X.fillStyle = GOLD; K.rrect(X, 540 - w / 2, 745, w, 96, 48); X.fill(); txt(t > fa + 0.95 ? 'FOLLOWING ✓' : 'FOLLOW FOR THE NEXT BUILD', 540, 795, { size: 36, w: 700, col: '#20142a' });
          const hx = 700 - eo(prog(t, fa + 0.3, fa + 0.8)) * 120, hy = 880 - eo(prog(t, fa + 0.3, fa + 0.8)) * 60; X.fillStyle = '#fff'; X.strokeStyle = '#20142a'; X.lineWidth = 4; X.beginPath(); X.arc(hx, hy, 26 - press * 6, 0, 7); X.fill(); X.stroke();
          if (press > 0) { X.strokeStyle = `rgba(255,255,255,${press})`; X.lineWidth = 5; X.beginPath(); X.arc(hx, hy, 40 + press * 40, 0, 7); X.stroke(); } });
      });
    };
    const redVignette = (x, W, Hh, a) => { if (a <= 0) return; const rg = x.createRadialGradient(540, 960, 300, 540, 960, 1150); rg.addColorStop(0, 'rgba(200,20,20,0)'); rg.addColorStop(1, `rgba(200,20,20,${a})`); x.fillStyle = rg; x.fillRect(0, 0, W, Hh); };
    const drawHud = t => hudTex.redraw((x, W, Hh) => {
      X = x;
      let g = x.createLinearGradient(0, 0, 0, 700); g.addColorStop(0, 'rgba(8,4,16,0.6)'); g.addColorStop(1, 'rgba(8,4,16,0)'); x.fillStyle = g; x.fillRect(0, 0, W, 700);
      g = x.createLinearGradient(0, 1180, 0, Hh); g.addColorStop(0, 'rgba(8,4,16,0)'); g.addColorStop(1, 'rgba(8,4,16,0.6)'); x.fillStyle = g; x.fillRect(0, 1180, W, Hh - 1180);
      const vg = x.createRadialGradient(W / 2, Hh / 2, Hh * 0.35, W / 2, Hh / 2, Hh * 0.75); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.45)'); x.fillStyle = vg; x.fillRect(0, 0, W, Hh);
      x.fillStyle = 'rgba(255,255,255,0.18)'; x.fillRect(0, 0, W, 8); x.fillStyle = GOLD; x.fillRect(0, 0, W * t / D, 8);
      const h1 = B('hook1'), h2 = B('hook2');
      A(fade(t, h1 + 0.05, h2 - 0.05), () => Z(pop(t, h1 + 0.05, h2 - 0.05), 540, 430, () => { txt('BUILT', 540, 430, { size: 170, w: 900, f: 'Cinzel', col: '#fff' }); const s = eo(prog(t, F('hook1', 0.55), F('hook1', 0.55) + 0.25)); if (s > 0) { x.strokeStyle = RED; x.lineWidth = 18; x.lineCap = 'round'; x.beginPath(); x.moveTo(250, 440); x.lineTo(250 + 580 * s, 420); x.stroke(); } }));
      stamp(t, C.rock1, E('hook2') + 0.2, '1 ROCK', 'NO BRICKS · NO CEMENT · NO JOINTS', GOLD, 430);
      const h3 = B('hook3'), h3e = E('hook3');
      A(fade(t, h3, h3e + 0.1), () => { const ax = 920, y0 = 330, y1 = 1050, p = eo(prog(t, h3 + 0.2, h3e - 0.2)), ay = lerp(y0, y1, p); panel(ax - 85, y0 - 120, 170, y1 - y0 + 240, 85);
        txt('ROOF', ax, y0 - 60, { size: 40, w: 700, col: GOLD }); txt('FLOOR', ax, y1 + 64, { size: 40, w: 700, col: 'rgba(255,255,255,0.7)' });
        x.strokeStyle = 'rgba(255,207,90,0.3)'; x.lineWidth = 10; x.beginPath(); x.moveTo(ax, y0); x.lineTo(ax, y1); x.stroke(); x.strokeStyle = GOLD; x.beginPath(); x.moveTo(ax, y0); x.lineTo(ax, ay); x.stroke();
        x.fillStyle = GOLD; x.beginPath(); x.moveTo(ax - 30, ay - 12); x.lineTo(ax + 30, ay - 12); x.lineTo(ax, ay + 32); x.closePath(); x.fill();
        Z(pop(t, h3 + 0.1), ax - 220, y0, () => { panel(ax - 330, y0 - 32, 220, 64, 32, GOLD, null); txt('START HERE', ax - 220, y0 + 2, { size: 32, w: 700, col: '#20142a' }); }); });
      const tz = B('tease'), tze = E('tease');
      if (t > tz && t < tze + 0.3) { redVignette(x, W, Hh, K.pulse(t, C.tease, 0.5) * 0.6); A(fade(t, F('tease', 0.55), tze), () => Z(pop(t, F('tease', 0.55)), 540, 430, () => pill(540, 430, 'WATCH HOW THEY DID IT  ↓', { size: 46, fg: '#20142a', bg: GOLD, border: null }))); }
      drawMap(t); drawCaves(t); drawWhen(t);
      const fl = K.pulse(t, C.rw - 0.1, 0.5); if (fl > 0) { x.fillStyle = `rgba(255,240,215,${fl * 0.7})`; x.fillRect(0, 0, W, Hh); }
      A(fade(t, C.rw, C.s1 + 0.6), () => Z(pop(t, C.rw), 540, 210, () => pill(540, 210, '◀◀  BACK TO 760 CE', { size: 46, fg: GOLD })));
      step(t, C.s1 + 0.6, C.bl - 0.1, '1', 'CUT 3 DEEP TRENCHES');
      step(t, C.bl, C.s2 - 0.1, '✓', '1 GIANT BLOCK, STANDING ALONE');
      step(t, C.s2, B('tonnes') - 0.25, '2', 'CARVE FROM THE TOP, DOWN', 170);
      drawOrder(t); drawTools(t); drawCounter(t); drawSize(t); drawOnePiece(t); drawUndo(t);
      redVignette(x, W, Hh, K.pulse(t, C.hit, 0.55) * 0.7);
      stamp(t, C.hit + 0.05, E('undo2') + 0.2, 'NO UNDO', 'ONE MISTAKE = THE WHOLE TEMPLE', RED, 430);
      drawToday(t); drawCta(t);
    });

    // ---------------------------------------------------------------- camera (own shot list; positions may follow the carving)
    const shots = [];
    const shot = (a, b, p0, l0, p1 = p0, l1 = l0, o = {}) => shots.push({ a, b, p0, l0, p1, l1, ...o });
    const V3 = (v, t) => typeof v === 'function' ? v(t) : v;
    const OP = n => F('onepiece', n);
    shot(0, B('hook2'), [6.5, 7.4, 7.2], [0, 9.0, -4.6], [8.5, 10.5, 12.5], [0, 8.4, -4.6]);
    shot(B('hook2'), B('hook3'), [8.5, 13, 16], [0, 7, -3], [5, 25, 31], [0, 4.5, -1]);
    shot(B('hook3'), B('tease'), [4, 33, 18], [0, 7, -3], [5, 27, 25], [0, 3, -1]);
    shot(B('tease'), B('loc') - 0.15, [ct.x + 1.3, 2.4, ct.z + 4.6], [ct.x + 0.3, 1.1, ct.z], [ct.x + 1.15, 2.1, ct.z + 3.7], [ct.x + 0.3, 1.1, ct.z], { shake: t => t > C.tease ? 0.05 * Math.exp(-(t - C.tease) * 7) : 0 });
    shot(B('loc') - 0.15, B('caves'), [-20, 80, 120], [0, 0, 0], [-8, 60, 90], [0, 2, 0]);
    shot(B('caves'), F('caves', 0.6), [-150, 28, 55], [-30, 4, 15], [-60, 24, 52], [0, 5, 12]);
    shot(F('caves', 0.6), B('when'), [-28, 24, 50], [0, 6, 10], [-8, 27, 44], [0, 5, 2]);
    shot(B('when'), C.rw, [-26, 30, 38], [0, 4, -1], [24, 28, 38], [0, 4, -1]);
    shot(C.rw, C.bl, [26, 44, 37], [0, 4, -1], [21, 41, 34], [0, 4, -1], { ease: eo });
    shot(C.bl, C.s2, t => { const a = lerp(0.9, 1.9, prog(t, C.bl, C.s2)); return [Math.cos(a) * 32, 26, Math.sin(a) * 32]; }, [0, 5, 0]);
    shot(C.s2, B('tools'), [-14, 31, 31], [0, 7, 0], [-10, 27, 27], [0, 5, 0]);
    shot(B('tools'), B('tonnes'), t => [TOOL[0] + 3.0, cvH(t) + 1.6, TOOL[1] + 4.0], t => [TOOL[0], cvH(t) + 0.35, TOOL[1]], t => [TOOL[0] + 2.4, cvH(t) + 1.4, TOOL[1] + 3.3], t => [TOOL[0], cvH(t) + 0.35, TOOL[1]]);
    shot(B('tonnes'), B('size'), [22, 37, 34], [0, 3, -1], [18, 31, 30], [0, 3, -1]);
    shot(B('size'), B('onepiece'), [-24, 26, 30], [0, 6, -2], [-18, 22, 26], [0, 6, -2]);
    shot(OP(0), OP(0.15), [3.4, 1.0, 12.8], [5.9, 8.8, 9.6], [3.6, 1.4, 12.6], [5.9, 8.0, 9.6]);
    shot(OP(0.15), OP(0.29), [2.6, 3.4, 13.0], [2.6, 1.2, 9.4], [2.6, 3.0, 12.6], [2.6, 1.2, 9.6]);
    shot(OP(0.29), OP(0.43), [4.8, 7.8, 7.6], [0, 5.5, 7.1], [4.2, 7.2, 7.0], [0, 5.5, 7.1]);
    shot(OP(0.43), OP(0.65), [7.7, 1.5, 8.4], [5.25, 1.0, -3], [7.7, 1.4, 7.2], [5.25, 1.0, -4]);
    shot(OP(0.65), B('undo1'), [0, 30, 33], [0, 3, -1], [-6, 34, 35], [0, 3, -1]);
    shot(B('undo1'), B('undo2'), [ct.x + 1.4, 2.6, ct.z + 5.2], [ct.x + 0.3, 1.1, ct.z], [ct.x + 1.2, 2.2, ct.z + 4.0], [ct.x + 0.3, 1.05, ct.z]);
    shot(B('undo2'), B('today'), [ct.x + 1.2, 2.2, ct.z + 4.0], [ct.x + 0.3, 1.05, ct.z], [ct.x + 1.1, 1.8, ct.z + 3.3], [ct.x + 0.2, 0.8, ct.z], { shake: t => t > C.hit ? 0.07 * Math.exp(-(t - C.hit) * 6) : 0 });
    shot(B('today'), B('cta'), [0, 9, 32], [0, 6, 0], [-5, 30, 44], [0, 4, -2], { ease: K.ease });
    shot(B('cta'), D + 1, [-5, 30, 44], [0, 4, -2], [7, 36, 46], [0, 3, -2]);
    K.shoot = t => {
      let s = shots[shots.length - 1]; for (const q of shots) if (t >= q.a && t < q.b) { s = q; break; }
      const k = (s.ease || K.ease)(prog(t, s.a, s.b)), p0 = V3(s.p0, t), p1 = V3(s.p1, t), l0 = V3(s.l0, t), l1 = V3(s.l1, t), sh = s.shake ? s.shake(t) : 0;
      K.cam.position.set(lerp(p0[0], p1[0], k) + Math.sin(t * 53) * sh, lerp(p0[1], p1[1], k) + Math.cos(t * 47) * sh, lerp(p0[2], p1[2], k));
      K.cam.lookAt(lerp(l0[0], l1[0], k), lerp(l0[1], l1[1], k), lerp(l0[2], l1[2], k));
    };

    // ---------------------------------------------------------------- per-frame update
    const swing = (w, t) => -1.6 + Math.max(0, Math.sin(t * w.sp + w.ph)) * 1.7;
    const heroArm = t => { const nh = hits.find(h => h > t - 0.25), d = nh === undefined ? 99 : nh - t;
      if (d > 0.35 || d < -0.25) return -1.3 + Math.sin(t * 2) * 0.06;
      return d > 0 ? lerp(-1.3, -2.7, eo(1 - d / 0.35)) : lerp(-2.7, -0.5, eo(clamp(-d / 0.07))); };
    const update = t => {
      const P = pre(t), ch = cvH(t), dawn = t >= B('today') - 0.05;
      S.background = dawn ? skyDawn : skyDusk; sun.color.setHex(dawn ? 0xffd2a0 : 0xffb27a);
      K.renderer.toneMappingExposure = 1.05 + 0.2 * prog(t, B('today'), B('today') + 2);
      blocks.forEach(m => { m.visible = P && ch > 0.02; m.scale.y = Math.max(0.001, ch); m.position.y = ch / 2; });
      trench.forEach((m, k) => { const h = trH(t, k); m.visible = P && h > 0.02; m.scale.y = Math.max(0.001, h); m.position.y = h / 2; });
      const gA = Math.max(prog(t, C.rock1 - 0.1, C.rock1 + 0.2) * (1 - prog(t, E('hook3'), E('hook3') + 0.2)), fade(t, C.bl, C.s2 - 0.2));
      ghost.visible = gA > 0; ghost.material.opacity = gA; ghostFill.visible = gA > 0; ghostFill.material.opacity = gA * 0.06;
      const cp = prog(t, B('hook3') + 0.2, E('hook3') - 0.2); cutPlane.visible = t > B('hook3') && t < E('hook3') + 0.1; cutPlane.position.y = H * (1 - eo(cp)) + 0.05;
      caveTags.forEach((s, i) => { const a = B('caves') + 0.2 + (i / 34) * (E('caves') - B('caves')) * 0.5, k = K.easeBack(prog(t, a, a + 0.3)) * (1 - prog(t, E('caves') + 0.1, E('caves') + 0.4)); s.visible = k > 0.01; s.scale.setScalar(Math.max(0.01, k) * (i === 15 ? 6.5 + Math.sin(t * 6) * 0.4 : 4.2)); });
      trTags.forEach((s, k) => { const v = K.easeBack(prog(t, tr[k][0], tr[k][0] + 0.3)) * (1 - prog(t, C.s2 - 0.3, C.s2)); s.visible = P && v > 0.01; s.scale.setScalar(Math.max(0.01, v) * 5); });
      const trOn = P && t > tr[0][0] - 0.2 && t < C.s2;
      trCrew.forEach(w => { const k = w.k, on = trOn && t > tr[k][0] - 0.2; w.g.visible = on; if (!on) return; const [x0, x1, z0, z1] = trBox(k);
        w.g.position.set(lerp(x0 + 0.3, x1 - 0.3, w.u), trH(t, k), lerp(z0 + 0.5, z1 - 0.5, w.v)); w.g.rotation.y = w.ry; w.arm.rotation.x = swing(w, t); });
      const topOn = P && t > C.cA - 0.1 && t < C.cB;
      topCrew.forEach(w => { w.g.visible = topOn; if (!topOn) return; w.g.position.set(w.x, ch, w.z); w.g.rotation.y = w.ry; w.arm.rotation.x = swing(w, t); });
      const heroOn = (t > B('tease') - 0.1 && t < B('loc')) || (t > B('undo1') - 0.1 && t < B('today'));
      hero.g.visible = heroOn; hero.arm.rotation.x = heroArm(t);
      const fall = t - C.hit;
      if (fall > 0 && t < B('today')) { const y = Math.max(0.12, ct.y - 4.9 * fall * fall); chunk.position.set(ct.x + 0.25 * Math.min(fall, 0.4), y, ct.z + 0.2 * Math.min(fall, 0.4)); chunk.rotation.set(fall * 6, fall * 4, 0); }
      else { chunk.position.set(ct.x - 0.05, ct.y, ct.z + 0.05); chunk.rotation.set(0, 0, 0); }
      chunk.visible = t < B('today');
      for (let i = 0; i < ND; i++) {
        const d = deb[i], a = t - d.b; let s = 0;
        if (P && a > 0 && a < 1.5) {
          let x0, y0, z0;
          if (d.b < C.cA) { const [ax, bx_, az, bz] = trBox(d.k); x0 = lerp(ax, bx_, d.u); z0 = lerp(az, bz, d.v); y0 = trH(d.b, d.k); }
          else { x0 = (d.u * 2 - 1) * RX; z0 = (d.v * 2 - 1) * RZ; y0 = cvH(d.b); }
          V.set(x0 + d.vx * a, y0 + d.vy * a - 4.9 * a * a, z0 + d.vz * a); if (V.y > -0.2) s = d.s * (1 - prog(a, 1.1, 1.5));
          EU.set(d.r + a * 5, d.r * 2 + a * 4, 0); Q.setFromEuler(EU);
        }
        SC.setScalar(Math.max(0.0001, s)); M4.compose(V, Q, SC); debris.setMatrixAt(i, M4);
      }
      debris.instanceMatrix.needsUpdate = true; Q.identity();
      let fl = 0;
      for (let i = 0; i < NS; i++) { const hi = i % 3, h0 = hits[hi], big = hi === 2, a = t - h0, sp = spk[i]; let s = 0;
        if (a > 0 && a < sp.life * (big ? 1.6 : 1)) { V.copy(ct).addScaledVector(sp.v, a * (big ? 1.8 : 0.9)); V.y -= 3 * a * a; s = (big ? 0.9 : 0.7) * (1 - a / (sp.life * (big ? 1.6 : 1))); }
        SC.setScalar(Math.max(0.0001, s)); M4.compose(V, Q, SC); sparks.setMatrixAt(i, M4); }
      hits.forEach((h, i) => { fl = Math.max(fl, t > h ? Math.exp(-(t - h) * 12) * (i === 2 ? 9 : 4) : 0); });
      sparks.instanceMatrix.needsUpdate = true; flashL.intensity = fl; workL.intensity = heroOn ? 7 : 0;
      drawHud(t);
    };

    const sfx = [
      ['bass', B('hook1'), 0.8], ['zap', F('hook1', 0.55), 0.4], ['thud', C.rock1, 0.9], ['riser', Math.max(0, B('hook3') - 0.3), 0.4], ['whoosh', B('hook3') + 0.2, 0.6],
      ['tick', C.tease - 0.4, 0.6], ['thud', C.tease, 0.9], ['pop', F('tease', 0.55), 0.6], ['whoosh', B('loc') - 0.3, 0.8],
      ['ding', F('loc', 0.4) + 0.3, 0.5], ['pop', F('loc', 0.62), 0.5], ['whoosh', B('caves') - 0.2, 0.7], ['chime', F('caves', 0.62), 0.5],
      ['whoosh', B('when') - 0.2, 0.6], ['pop', F('when', 0.5), 0.5], ['whoosh', C.rw - 0.3, 0.9], ['zap', C.rw - 0.1, 0.35],
      ['bass', tr[0][0], 0.6], ['thud', tr[1][0], 0.5], ['thud', tr[2][0], 0.5], ['rustle', tr[0][0] + 0.1, 0.5], ['chime', C.bl + 0.2, 0.4],
      ['bass', C.cA, 0.7], ['rustle', C.cA + 0.2, 0.55], ['rustle', C.cA + 2.6, 0.5], ['rustle', C.cA + 5.0, 0.5], ['rustle', C.cA + 7.4, 0.5],
      ['tick', F('order', 0.12), 0.6], ['tick', F('order', 0.47), 0.6], ['tick', F('order', 0.82), 0.6], ['buzz', B('tools') + 0.1, 0.35], ['pop', F('tools', 0.45), 0.5],
      ['kaching', E('tonnes') - 0.3, 0.45], ['whoosh', B('size') - 0.2, 0.6], ['coin', F('size', 0.5), 0.3],
      ['pop', OP(0), 0.5], ['pop', OP(0.15), 0.5], ['pop', OP(0.29), 0.5], ['pop', OP(0.43), 0.5], ['thud', OP(0.66), 0.9],
      ['beep', F('undo1', 0.55), 0.5], ['tick', B('undo2') + 0.15, 0.7], ['thud', C.hit, 1.0], ['zap', C.hit, 0.5], ['bass', C.hit, 0.9],
      ['riser', B('today') - 1.0, 0.35], ['chime', B('today') + 0.2, 0.5], ['ding', B('cta') + 0.4, 0.4], ['pop', F('cta', 0.55), 0.5],
    ];
    return { duration: D, update, shots: [{ t: [0, 1], from: { pos: [0, 0, 1], look: [0, 0, 0] } }], sfx, watermark: false, endCard: false,
      music: { muteFrom: B('undo1') - 0.1, muteTo: C.hit + 0.1 }, capFont: 'Fredoka Light', capMarginV: 520, capSize: 66 };
  },
};
