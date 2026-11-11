// Kailasa Temple scene: finished temple -> rewind -> trenches -> carved top-down -> one wrong strike -> title.
window.SCENE = {
  setup: { bg: 0x2a1a3a, fog: [70, 260], fov: 40, bloom: { strength: 0.38, radius: 0.55, threshold: 0.88 } },
  lines: window.STB_LINES,
  build(K, T) {
    const L = T.lines, B = i => L[i].t, E = i => L[i].end;
    const C = {
      hook: B(0), oneRock: B(0) + (E(0) - B(0)) * 0.68, rewind: E(0), carve: B(1),
      trenchEnd: B(1) + (E(1) - B(1)) * 0.25, carveEnd: E(1) - 0.05,
      step2: B(1) + (E(1) - B(1)) * 0.27, step3: E(1) - 0.35,
      strike: B(2), hit: B(2) + 0.62, title: E(2) + 0.05,
    };
    const D = E(2) + 2.7;
    const THREE = window.THREE, S = K.scene, RB = window.RoundedBoxGeometry;

    // ---------------------------------------------------------------- sky, light, fog
    K.gradientBg('#1a1036', '#ff8f4a', 'rgba(255,190,110,0.35)');
    S.fog = new THREE.Fog(0xc98a6a, 80, 280);
    S.add(new THREE.HemisphereLight(0x9c8ce0, 0x3a2416, 1.1));
    S.add(new THREE.AmbientLight(0xffe2c8, 0.22));
    const sun = new THREE.DirectionalLight(0xffb27a, 3.1); sun.position.set(-34, 26, 22); sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -0.0006; sun.shadow.normalBias = 0.03;
    Object.assign(sun.shadow.camera, { left: -26, right: 26, top: 26, bottom: -26, near: 1, far: 120 }); S.add(sun);
    const fill = new THREE.DirectionalLight(0x8fa0ff, 0.7); fill.position.set(25, 18, -20); S.add(fill);

    // ---------------------------------------------------------------- materials (basalt with strata)
    const rockTex = (base, seed, lines = true) => K.canvasTex(512, 512, (x, w, h) => {
      const r = K.rng(seed); x.fillStyle = base; x.fillRect(0, 0, w, h);
      for (let i = 0; i < 2600; i++) { x.fillStyle = `rgba(${r() < 0.5 ? '0,0,0' : '255,235,210'},${0.03 + r() * 0.06})`; x.fillRect(r() * w, r() * h, 2 + r() * 7, 1 + r() * 4); }
      if (lines) for (let y = 0; y < h; y += 24 + r() * 30) { x.fillStyle = 'rgba(0,0,0,0.13)'; x.fillRect(0, y, w, 2 + r() * 3); }
    });
    const tWall = rockTex('#5a4a44', 3), tRock = rockTex('#4d403b', 7), tTemple = rockTex('#8a7466', 11, false), tGround = rockTex('#6b5a3c', 5, false);
    [tWall, tRock, tTemple, tGround].forEach(t => { t.wrapS = t.wrapT = THREE.RepeatWrapping; });
    tWall.repeat.set(3, 2); tGround.repeat.set(28, 28);
    const mWall = new THREE.MeshStandardMaterial({ map: tWall, roughness: 0.95 });
    const mRock = new THREE.MeshStandardMaterial({ map: tRock, roughness: 0.92 });
    const mTemple = new THREE.MeshStandardMaterial({ map: tTemple, roughness: 0.85 });
    const mDark = new THREE.MeshStandardMaterial({ color: 0x1a120f, roughness: 1 });
    const mGround = new THREE.MeshStandardMaterial({ map: tGround, roughness: 1 });
    const mFloor = new THREE.MeshStandardMaterial({ map: rockTex('#6a5547', 9, false), roughness: 1 });
    const mesh = (geo, m, x, y, z, parent = S) => { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); o.castShadow = o.receiveShadow = true; parent.add(o); return o; };
    const bx = (w, h, d, m, x, y, z, parent) => mesh(new THREE.BoxGeometry(w, h, d), m, x, y + h / 2, z, parent);   // y = bottom

    // ---------------------------------------------------------------- hill with the pit (pit inner: x +-8.2, z -13.2..13.2, depth 11)
    const H = 11, PX = 8.2, PZ = 13.2;
    bx(60, H, 90, mWall, -PX - 30, 0, -25); bx(60, H, 90, mWall, PX + 30, 0, -25);
    bx(2 * PX, H, 40, mWall, 0, 0, -PZ - 20);
    const floor = mesh(new THREE.PlaneGeometry(2 * PX, 60), mFloor, 0, 0.01, 16); floor.rotation.x = -Math.PI / 2;
    const vall = mesh(new THREE.PlaneGeometry(400, 300), mGround, 0, -0.02, 170); vall.rotation.x = -Math.PI / 2;
    // the pit itself must stay open: the hill top plane would cover it, so cut the top into 3 strips instead
    const strip = (w, d, x, z) => { const p = mesh(new THREE.PlaneGeometry(w, d), mGround, x, H + 0.02, z); p.rotation.x = -Math.PI / 2; };
    strip(200, 230, -PX - 100, -95); strip(200, 230, PX + 100, -95); strip(2 * PX, 200, 0, -PZ - 100);
    // dry scrub on the plateau
    const br = K.rng(31), NB = 260, bush = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.6, 0), new THREE.MeshStandardMaterial({ color: 0x4a5a2a, roughness: 1, flatShading: true }), NB);
    for (let i = 0; i < NB; i++) { let x, z; do { x = (br() * 2 - 1) * 60; z = -70 + br() * 90; } while (Math.abs(x) < PX + 0.8 && z < PZ + 2); const sc = 0.5 + br() * 1.3;
      new THREE.Object3D(); const o = new THREE.Object3D(); o.position.set(x, H + sc * 0.3, z); o.scale.set(sc, sc * 0.7, sc); o.rotation.y = br() * 6; o.updateMatrix(); bush.setMatrixAt(i, o.matrix); }
    bush.castShadow = true; S.add(bush);
    // gateway wall at the front (gopuram) with a dark doorway
    bx(2 * PX, 6.5, 2.2, mWall, 0, 0, PZ + 1.1);
    bx(5.2, 3.0, 2.3, mTemple, 0, 6.5, PZ + 1.1);
    bx(2.0, 4.0, 2.4, mDark, 0, 0, PZ + 1.1);
    for (let i = 0; i < 3; i++) bx(5.6 - i * 1.2, 0.35, 2.5, mTemple, 0, 6.5 + 3 + i * 0.35, PZ + 1.1);
    // cave galleries in the side walls
    for (const sx of [-1, 1]) for (let z = -10; z <= 10; z += 2.5) {
      bx(0.2, 3.2, 1.9, mDark, sx * (PX - 0.05), 0.6, z);
      bx(0.5, 3.2, 0.32, mWall, sx * (PX - 0.15), 0.6, z + 1.25);
    }
    // distant Deccan hills
    const hr = K.rng(21);
    for (let i = 0; i < 26; i++) { const a = (i / 26) * Math.PI * 2, r = 170 + hr() * 50, hgt = 14 + hr() * 22;
      const m = new THREE.Mesh(new THREE.ConeGeometry(30 + hr() * 30, hgt, 7), new THREE.MeshStandardMaterial({ color: 0x4a3150, roughness: 1, flatShading: true }));
      m.position.set(Math.cos(a) * r, hgt / 2 - 2, Math.sin(a) * r); S.add(m); }

    // ---------------------------------------------------------------- the temple (carved basalt)
    const temple = new THREE.Group(); S.add(temple);
    const tb = (w, h, d, x, y, z, m = mTemple) => bx(w, h, d, m, x, y, z, temple);
    const band = (w, d, x, y, z) => tb(w + 0.3, 0.22, d + 0.3, x, y, z);
    // plinth + mouldings
    tb(10, 2.4, 18.4, 0, 0, -0.3); band(10, 18.4, 0, 0.1, -0.3); band(10, 18.4, 0, 2.15, -0.3);
    // main shrine (vimana) with stepped tower
    tb(7, 3.8, 7, 0, 2.4, -4.6); band(7, 7, 0, 2.5, -4.6); band(7, 7, 0, 6.0, -4.6);
    for (let i = 0; i < 5; i++) { const s = 6.4 - i * 1.05; tb(s, 0.62, s, 0, 6.2 + i * 0.66, -4.6); tb(s + 0.25, 0.12, s + 0.25, 0, 6.2 + i * 0.66 + 0.55, -4.6);
      for (const [dx, dz] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) tb(0.5, 0.5, 0.5, dx * (s / 2 - 0.25), 6.2 + i * 0.66 + 0.62, -4.6 + dz * (s / 2 - 0.25)); }
    const dome = mesh(new THREE.SphereGeometry(1.25, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2), mTemple, 0, 9.5, -4.6, temple); dome.scale.y = 0.9;
    mesh(new THREE.CylinderGeometry(0.16, 0.26, 0.6, 8), mTemple, 0, 10.85, -4.6, temple);
    mesh(new THREE.SphereGeometry(0.2, 10, 8), mTemple, 0, 11.2 - 0.25, -4.6, temple);
    // sub-shrines on the corners
    for (const [sx, sz] of [[1, -1], [-1, -1], [1, 1], [-1, 1]]) { const cx = sx * 3.9, cz = -4.6 + sz * 3.3; tb(1.3, 1.6, 1.3, cx, 2.4, cz);
      mesh(new THREE.ConeGeometry(0.9, 1.4, 4), mTemple, cx, 4.7, cz, temple).rotation.y = Math.PI / 4; }
    // mandapa hall with pillar rows
    tb(8, 3.4, 7.2, 0, 2.4, 2.6); band(8, 7.2, 0, 5.7, 2.6); tb(8.6, 0.4, 7.8, 0, 5.8, 2.6);
    for (const sx of [-1, 1]) for (let z = -0.4; z <= 5.6; z += 1.5) mesh(new THREE.CylinderGeometry(0.26, 0.3, 3.4, 10), mTemple, sx * 4.15, 2.4 + 1.7, z, temple);
    tb(1.6, 2.6, 0.4, 0, 2.4, 6.25, mDark);
    // bridge to the Nandi pavilion + Nandi mandapa
    tb(1.6, 0.5, 2.6, 0, 5.2, 7.4);
    tb(3.8, 5.0, 3.8, 0, 0, 9.4); band(3.8, 3.8, 0, 4.8, 9.4);
    mesh(new THREE.ConeGeometry(2.4, 1.6, 4), mTemple, 0, 5.8, 9.4, temple).rotation.y = Math.PI / 4;
    // two victory pillars (dhwaja stambha)
    for (const sx of [-1, 1]) { const px = sx * 5.4, pz = 9.6;
      for (let i = 0; i < 6; i++) tb(0.7 - i * 0.04, 1.35, 0.7 - i * 0.04, px, i * 1.4, pz);
      for (let i = 1; i < 6; i++) tb(0.85, 0.12, 0.85, px, i * 1.4 - 0.06, pz);
      tb(1.0, 0.35, 1.0, px, 8.4, pz); mesh(new THREE.SphereGeometry(0.3, 10, 8), mTemple, px, 9.0, pz, temple); }
    // elephants: a row carved into the plinth base + two big free-standing ones
    const elephant = (s, x, z, ry, parent = temple) => {
      const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry; g.scale.setScalar(s); parent.add(g);
      const body = mesh(new THREE.SphereGeometry(0.62, 18, 12), mTemple, 0, 0.95, 0, g); body.scale.set(1.25, 0.9, 0.85);
      const head = mesh(new THREE.SphereGeometry(0.42, 16, 12), mTemple, 0.82, 1.18, 0, g);
      for (const sz of [-1, 1]) { const ear = mesh(new THREE.SphereGeometry(0.36, 12, 8), mTemple, 0.7, 1.2, sz * 0.4, g); ear.scale.set(0.25, 1, 0.9); }
      const trunk = mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(1.12, 1.08, 0), new THREE.Vector3(1.35, 0.7, 0), new THREE.Vector3(1.32, 0.25, 0), new THREE.Vector3(1.45, 0.08, 0)]), 16, 0.11, 8), mTemple, 0, 0, 0, g);
      for (const [lx, lz] of [[0.45, 0.3], [0.45, -0.3], [-0.45, 0.3], [-0.45, -0.3]]) mesh(new THREE.CylinderGeometry(0.15, 0.17, 0.7, 10), mTemple, lx, 0.35, lz, g);
      for (const sz of [-1, 1]) { const tusk = mesh(new THREE.ConeGeometry(0.05, 0.4, 6), new THREE.MeshStandardMaterial({ color: 0xd8cbb0, roughness: 0.6 }), 1.12, 0.85, sz * 0.16, g); tusk.rotation.z = -2.2; }
      return g;
    };
    const elephants = [];
    for (const sx of [-1, 1]) for (let z = -7.6; z <= 6.4; z += 2.8) elephants.push(elephant(0.95, sx * 5.25, z, sx > 0 ? 0 : Math.PI));
    elephant(1.7, 3.3, 11.2, Math.PI / 2 + 0.25); elephant(1.7, -3.3, 11.2, Math.PI / 2 - 0.25);
    const heroEl = elephants.find(e => e.position.x > 0 && Math.abs(e.position.z - 3.6) < 0.1);

    // ---------------------------------------------------------------- the rock that becomes the temple (+ trench fill around it)
    const RX = 7.0, RZ = 12.0;
    const rock = mesh(new THREE.BoxGeometry(2 * RX, 1, 2 * RZ), mRock, 0, 0, 0);
    const trench = new THREE.Group(); S.add(trench);
    const tr = [[2 * PX, PZ - RZ, 0, -(RZ + PZ) / 2], [2 * PX, PZ - RZ, 0, (RZ + PZ) / 2], [PX - RX, 2 * RZ, -(RX + PX) / 2, 0], [PX - RX, 2 * RZ, (RX + PX) / 2, 0]]
      .map(([w, d, x, z]) => mesh(new THREE.BoxGeometry(w, 1, d), mWall, x, 0, z, trench));
    const carveH = t => H * (1 - K.ease(K.prog(t, C.trenchEnd, C.carveEnd)));
    const trenchH = t => H * (1 - K.easeOut(K.prog(t, C.carve + 0.1, C.trenchEnd)));
    const before = t => t >= C.rewind;                            // rewind: from here the rock exists again
    // ghost outline of the original rock (shown on "one single rock")
    const ghost = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(2 * RX, H, 2 * RZ)), new THREE.LineBasicMaterial({ color: 0xffd36a, transparent: true, toneMapped: false }));
    ghost.position.y = H / 2; S.add(ghost);
    const ghostFill = new THREE.Mesh(new THREE.BoxGeometry(2 * RX, H, 2 * RZ), new THREE.MeshBasicMaterial({ color: 0xffc04a, transparent: true, opacity: 0, depthWrite: false, toneMapped: false }));
    ghostFill.position.y = H / 2; S.add(ghostFill);

    // ---------------------------------------------------------------- workers (tiny, for scale) + debris + sparks
    const mCloth = new THREE.MeshStandardMaterial({ color: 0xf1e6d0, roughness: 0.8 }), mSkin = new THREE.MeshStandardMaterial({ color: 0x8a5a3a, roughness: 0.7 }), mTool = new THREE.MeshStandardMaterial({ color: 0x3a3a3a, metalness: 0.6, roughness: 0.4 });
    const worker = (s = 0.62) => {
      const g = new THREE.Group(); g.scale.setScalar(s); S.add(g);
      mesh(new THREE.CapsuleGeometry(0.17, 0.42, 4, 10), mCloth, 0, 0.45, 0, g);
      mesh(new THREE.CapsuleGeometry(0.13, 0.35, 4, 10), mSkin, 0, 1.0, 0, g);
      mesh(new THREE.SphereGeometry(0.15, 12, 10), mSkin, 0, 1.42, 0, g);
      mesh(new THREE.SphereGeometry(0.16, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), mCloth, 0, 1.46, 0, g);   // head cloth
      const arm = new THREE.Group(); arm.position.set(0.14, 1.22, 0); g.add(arm);
      mesh(new THREE.CapsuleGeometry(0.05, 0.38, 4, 8), mSkin, 0.0, -0.22, 0, arm);
      mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.5, 6), mTool, 0, -0.46, 0.18, arm).rotation.x = Math.PI / 2;
      mesh(new THREE.BoxGeometry(0.16, 0.12, 0.12), mTool, 0, -0.46, 0.42, arm);
      const arm2 = new THREE.Group(); arm2.position.set(-0.14, 1.22, 0); g.add(arm2);
      mesh(new THREE.CapsuleGeometry(0.05, 0.38, 4, 8), mSkin, 0, -0.22, 0.05, arm2); arm2.rotation.x = -0.9;
      return { g, arm };
    };
    const wr = K.rng(77), crew = Array.from({ length: 22 }, () => { const w = worker(); w.x = (wr() * 2 - 1) * (RX - 0.8); w.z = (wr() * 2 - 1) * (RZ - 0.8); w.ry = wr() * 6.28; w.ph = wr() * 6.28; w.sp = 7 + wr() * 4; return w; });
    const chiselTip = new THREE.Vector3(heroEl.position.x + 1.3, 1.15, heroEl.position.z + 0.02);
    const hero = worker(0.95); hero.g.position.set(chiselTip.x + 0.78, 0, chiselTip.z - 0.02); hero.g.rotation.y = -Math.PI / 2;

    const ND = 520, dr = K.rng(5);
    const debris = new THREE.InstancedMesh(new THREE.DodecahedronGeometry(0.16, 0), mRock, ND); debris.castShadow = true; S.add(debris);
    const deb = Array.from({ length: ND }, () => ({ b: K.lerp(C.carve + 0.15, C.carveEnd - 0.25, dr()), x: (dr() * 2 - 1), z: (dr() * 2 - 1), vx: (dr() * 2 - 1) * 3.2, vy: 3 + dr() * 5, vz: (dr() * 2 - 1) * 3.2, s: 0.5 + dr() * 1.3, r: dr() * 6 }));
    const NS = 140, sr = K.rng(9);
    const sparks = new THREE.InstancedMesh(new THREE.SphereGeometry(0.035, 6, 4), new THREE.MeshBasicMaterial({ color: 0xffc46a, toneMapped: false }), NS); S.add(sparks);
    const spk = Array.from({ length: NS }, () => ({ v: new THREE.Vector3(0.6 + sr() * 2.4, sr() * 2.8, (sr() * 2 - 1) * 2.2), life: 0.25 + sr() * 0.45 }));
    const flashL = new THREE.PointLight(0xffb04a, 0, 6, 2); flashL.position.copy(chiselTip); S.add(flashL);
    const workL = new THREE.PointLight(0xffc89a, 0, 9, 1.6); workL.position.set(chiselTip.x + 1.1, 3.2, chiselTip.z + 2.2); S.add(workL);
    const M4 = new THREE.Matrix4(), Q = new THREE.Quaternion(), V = new THREE.Vector3(), SC = new THREE.Vector3(), EU = new THREE.Euler();

    // ---------------------------------------------------------------- HUD (2D overlay drawn every frame)
    const hudTex = K.canvasTex(1080, 1920, () => {}); hudTex.colorSpace = THREE.SRGBColorSpace;
    const hudScene = new THREE.Scene(), hudCam = new THREE.OrthographicCamera(-540, 540, 960, -960, -10, 10);
    hudScene.add(new THREE.Mesh(new THREE.PlaneGeometry(1080, 1920), new THREE.MeshBasicMaterial({ map: hudTex, transparent: true, toneMapped: false, depthTest: false })));
    K.draw = () => { K.composer.render(); const r = K.renderer; r.autoClear = false; r.clearDepth(); r.render(hudScene, hudCam); r.autoClear = true; };
    const GOLD = '#ffcf5a', INK = 'rgba(14,10,22,0.72)';
    const font = (w, s, f = 'Oswald') => `${w} ${s}px "${f}"`;
    const pill = (x, cx, cy, txt, { size = 40, bg = INK, fg = '#fff', pad = 30, icon = null, f = 'Oswald', w = 600, border = null } = {}) => {
      x.font = font(w, size, f); const tw = x.measureText(txt).width + (icon ? size * 1.1 : 0), W = tw + pad * 2, Hh = size * 1.75;
      x.fillStyle = bg; K.rrect(x, cx - W / 2, cy - Hh / 2, W, Hh, Hh / 2); x.fill();
      if (border) { x.strokeStyle = border; x.lineWidth = 3; x.stroke(); }
      x.fillStyle = fg; x.textBaseline = 'middle'; x.textAlign = 'left'; let tx = cx - W / 2 + pad;
      if (icon) { icon(x, tx + size * 0.4, cy, size); tx += size * 1.1; }
      x.fillStyle = fg; x.fillText(txt, tx, cy + 2); return W;
    };
    const pin = (x, cx, cy, s) => { x.fillStyle = GOLD; x.beginPath(); x.arc(cx, cy - s * 0.12, s * 0.32, Math.PI, 0); x.lineTo(cx, cy + s * 0.42); x.closePath(); x.fill(); x.fillStyle = '#20142a'; x.beginPath(); x.arc(cx, cy - s * 0.12, s * 0.12, 0, 7); x.fill(); };
    const pop = (t, a, b = 1e9) => { const k = K.easeBack(K.prog(t, a, a + 0.35)) * (1 - K.easeIn(K.prog(t, b, b + 0.25))); return t >= a && t < b + 0.25 ? k : 0; };
    const fade = (t, a, b = 1e9) => K.prog(t, a, a + 0.25) * (1 - K.prog(t, b, b + 0.25));
    const withAlpha = (x, a, fn) => { if (a <= 0.001) return; x.save(); x.globalAlpha = K.clamp(a); fn(); x.restore(); };
    const scaled = (x, k, cx, cy, fn, rot = 0) => { if (k <= 0.001) return; x.save(); x.translate(cx, cy); x.rotate(rot); x.scale(k, k); x.translate(-cx, -cy); fn(); x.restore(); };
    const stamp = (x, t, a, b, txt, sub, col, cy = 470) => {
      const k0 = K.prog(t, a, a + 0.22), k = (k0 < 1 ? K.lerp(2.4, 1, K.easeOut(k0)) : 1) * (t >= a && t < b + 0.25 ? 1 : 0), al = K.prog(t, a, a + 0.12) * (1 - K.prog(t, b, b + 0.25));
      withAlpha(x, al, () => scaled(x, k, 540, cy, () => {
        x.strokeStyle = col; x.lineWidth = 10; K.rrect(x, 250, cy - 110, 580, 220, 26); x.stroke();
        x.lineWidth = 3; K.rrect(x, 266, cy - 94, 548, 188, 18); x.stroke();
        x.fillStyle = col; x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = font(900, 112, 'Cinzel'); x.fillText(txt, 540, cy - 10);
        x.font = font(600, 32); x.fillText(sub, 540, cy + 68);
      }, -0.09));
    };
    const fmt = n => Math.round(n).toLocaleString('en-US');
    const drawHud = t => hudTex.redraw((x, W, Hh) => {
      // soft top + bottom gradients for readability
      let g = x.createLinearGradient(0, 0, 0, 640); g.addColorStop(0, 'rgba(8,4,16,0.62)'); g.addColorStop(1, 'rgba(8,4,16,0)'); x.fillStyle = g; x.fillRect(0, 0, W, 640);
      g = x.createLinearGradient(0, 1240, 0, Hh); g.addColorStop(0, 'rgba(8,4,16,0)'); g.addColorStop(1, 'rgba(8,4,16,0.55)'); x.fillStyle = g; x.fillRect(0, 1240, W, Hh - 1240);
      // location + era chips (hook and ending)
      const chipA = Math.max(fade(t, 0.15, C.rewind - 0.1), fade(t, C.title + 0.5, 99));
      withAlpha(x, chipA, () => { pill(x, 330, 150, 'ELLORA, MAHARASHTRA', { size: 38, icon: pin }); pill(x, 830, 150, '8TH CENTURY CE', { size: 38, fg: GOLD }); });
      // "1 ROCK" stamp on "one single rock"
      stamp(x, t, C.oneRock, C.rewind - 0.12, '1 ROCK', 'NO BRICKS · NO JOINTS · NO CEMENT', GOLD, 430);
      // rewind flash + chip
      const fl = K.pulse(t, C.rewind - 0.08, 0.42); if (fl > 0) { x.fillStyle = `rgba(255,240,215,${fl * 0.6})`; x.fillRect(0, 0, W, Hh); }
      withAlpha(x, fade(t, C.rewind + 0.05, C.trenchEnd - 0.2), () => scaled(x, pop(t, C.rewind + 0.05), 540, 150, () => pill(x, 540, 150, '◀◀  REWIND 1,200+ YEARS', { size: 42, fg: GOLD, border: 'rgba(255,207,90,0.6)' })));
      // stone counter + progress bar
      const cvA = fade(t, C.carve + 0.15, C.strike - 0.2);
      if (cvA > 0) withAlpha(x, cvA, () => {
        const vTotal = 2 * RX * 2 * RZ * H + (4 * PX * PZ - 4 * RX * RZ) * H;
        const removed = (4 * PX * PZ - 4 * RX * RZ) * (H - trenchH(t)) + 4 * RX * RZ * (H - carveH(t));
        const n = 200000 * removed / vTotal;
        x.fillStyle = INK; K.rrect(x, 150, 250, 780, 250, 34); x.fill(); x.strokeStyle = 'rgba(255,207,90,0.45)'; x.lineWidth = 3; x.stroke();
        x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = 'rgba(255,255,255,0.85)'; x.font = font(500, 34); x.fillText('STONE REMOVED BY HAND', 540, 298);
        x.fillStyle = GOLD; x.font = font(700, 108); x.fillText(fmt(n), 500, 384);
        x.fillStyle = '#fff'; x.font = font(500, 40); x.textAlign = 'left'; x.fillText('TONNES', 500 + x.measureText(fmt(n)).width * 0 + 230, 400);
        x.fillStyle = 'rgba(255,255,255,0.15)'; K.rrect(x, 200, 452, 680, 16, 8); x.fill();
        x.fillStyle = GOLD; K.rrect(x, 200, 452, Math.max(16, 680 * removed / vTotal), 16, 8); x.fill();
      });
      // step chips
      const stepChip = (a, b, n, txt, y) => withAlpha(x, fade(t, a, b), () => scaled(x, pop(t, a, b), 540, y, () => {
        x.font = font(600, 36); const w = x.measureText(txt).width + 150;
        x.fillStyle = 'rgba(255,255,255,0.94)'; K.rrect(x, 540 - w / 2, y - 38, w, 76, 38); x.fill();
        x.fillStyle = GOLD; x.beginPath(); x.arc(540 - w / 2 + 40, y, 28, 0, 7); x.fill();
        x.fillStyle = '#20142a'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = font(700, 34); x.fillText(n, 540 - w / 2 + 40, y + 2);
        x.textAlign = 'left'; x.font = font(600, 36); x.fillText(txt, 540 - w / 2 + 86, y + 2);
      }));
      stepChip(C.carve + 0.3, C.step2 - 0.05, '1', 'CUT DEEP TRENCHES INTO THE HILL', 560);
      stepChip(C.step2, C.step3 - 0.05, '2', 'CARVE DOWN, LAYER BY LAYER', 560);
      stepChip(C.step3, C.strike - 0.2, '3', 'TEMPLE FREED FROM THE ROCK', 560);
      // TOP -> DOWN arrow on the right
      withAlpha(x, fade(t, C.trenchEnd, C.carveEnd), () => {
        const ax = 975, y0 = 690, y1 = 1150, p = (t * 0.9) % 1;
        x.fillStyle = INK; K.rrect(x, ax - 52, y0 - 70, 104, y1 - y0 + 150, 52); x.fill();
        x.fillStyle = GOLD; x.textAlign = 'center'; x.font = font(700, 30); x.fillText('TOP', ax, y0 - 30); x.fillText('DOWN', ax, y1 + 50);
        x.strokeStyle = 'rgba(255,207,90,0.35)'; x.lineWidth = 6; x.beginPath(); x.moveTo(ax, y0); x.lineTo(ax, y1); x.stroke();
        const ay = K.lerp(y0, y1, K.ease(K.prog(t, C.trenchEnd, C.carveEnd)));
        x.strokeStyle = GOLD; x.lineWidth = 10; x.beginPath(); x.moveTo(ax, y0); x.lineTo(ax, ay); x.stroke();
        x.fillStyle = GOLD; x.beginPath(); x.moveTo(ax - 24, ay - 10); x.lineTo(ax + 24, ay - 10); x.lineTo(ax, ay + 26); x.closePath(); x.fill();
        for (let i = 0; i < 3; i++) { const yy = K.lerp(y0, y1, (p + i / 3) % 1); x.fillStyle = `rgba(255,207,90,${0.5 * (1 - ((p + i / 3) % 1))})`; x.beginPath(); x.arc(ax, yy, 6, 0, 7); x.fill(); }
      });
      // the wrong strike: red flash, NO UNDO stamp
      const rf = K.pulse(t, C.hit, 0.5); if (rf > 0) { const rg = x.createRadialGradient(540, 960, 300, 540, 960, 1150); rg.addColorStop(0, 'rgba(200,20,20,0)'); rg.addColorStop(1, `rgba(200,20,20,${rf * 0.7})`); x.fillStyle = rg; x.fillRect(0, 0, W, Hh); }
      stamp(x, t, C.hit + 0.05, C.title - 0.1, 'NO UNDO', 'ONE MISTAKE = THE WHOLE TEMPLE', '#ff4b3e', 430);
      // title card
      const tA = fade(t, C.title, 99);
      if (tA > 0) withAlpha(x, tA, () => {
        const k = K.easeOut(K.prog(t, C.title, C.title + 0.9));
        x.textAlign = 'center'; x.textBaseline = 'middle';
        x.fillStyle = 'rgba(255,207,90,0.9)'; x.fillRect(540 - 260 * k, 318, 520 * k, 3); x.fillRect(540 - 260 * k, 548, 520 * k, 3);
        x.fillStyle = GOLD; x.font = font(900, 104, 'Cinzel'); x.shadowColor = 'rgba(0,0,0,0.6)'; x.shadowBlur = 18; x.fillText('KAILASA', 540, 395); x.fillText('TEMPLE', 540, 495); x.shadowBlur = 0;
        x.fillStyle = '#fff'; x.font = font(500, 36); x.fillText('CAVE 16 · ELLORA · CARVED FROM ONE ROCK', 540, 600);
      });
    });

    // ---------------------------------------------------------------- camera
    const ct = chiselTip;
    const shots = [
      { t: [0, C.oneRock - 0.2], from: { pos: [6.5, 7.6, 7.5], look: [0, 8.8, -4.6] }, to: { pos: [5, 24, 30], look: [0, 4.5, -1] } },
      { t: [C.oneRock - 0.2, C.rewind], from: { pos: [5, 24, 30], look: [0, 4.5, -1] }, to: { pos: [-4, 40, 40], look: [0, 3, -1] } },
      { t: [C.rewind, C.carve + 0.25], from: { pos: [-4, 40, 40], look: [0, 3, -1] }, to: { pos: [7, 44, 39], look: [0, 5, -1.5] }, ease: K.easeOut },
      { t: [C.carve + 0.25, C.carveEnd + 0.2], from: { pos: [7, 44, 39], look: [0, 5, -1.5] }, to: { pos: [5, 31, 33], look: [0, 2.5, -1] } },
      { t: [C.carveEnd + 0.2, C.strike], from: { pos: [5, 31, 33], look: [0, 2.5, -1] }, to: { pos: [ct.x + 1.3, 2.7, ct.z + 5.0], look: [ct.x + 0.35, 1.15, ct.z] }, ease: K.easeOut },
      { t: [C.strike, C.title], from: { pos: [ct.x + 1.3, 2.7, ct.z + 5.0], look: [ct.x + 0.35, 1.15, ct.z] }, to: { pos: [ct.x + 1.2, 2.2, ct.z + 3.9], look: [ct.x + 0.3, 1.15, ct.z] },
        shake: t => 0.06 * Math.exp(-Math.max(0, t - C.hit) * 7) * (t > C.hit ? 1 : 0) },
      { t: [C.title, D], from: { pos: [0, 17, 31], look: [0, 5, -2] }, to: { pos: [-5, 37, 44], look: [0, 3, -2] }, ease: K.ease },
    ];

    // ---------------------------------------------------------------- per-frame update
    const update = t => {
      const pre = before(t);
      const rh = pre ? carveH(t) : 0, th = pre ? trenchH(t) : 0;
      rock.visible = rh > 0.02; rock.scale.y = Math.max(0.001, rh); rock.position.y = rh / 2;
      trench.visible = th > 0.02; tr.forEach(m => { m.scale.y = Math.max(0.001, th); m.position.y = th / 2; });
      const gA = K.pulse(t, C.oneRock - 0.05, C.rewind - C.oneRock + 0.15);
      ghost.visible = gA > 0; ghost.material.opacity = gA; ghostFill.material.opacity = gA * 0.05; ghostFill.visible = gA > 0;
      // crew stands on the current carving surface and swings hammers
      const crewOn = pre && t > C.carve && t < C.carveEnd;
      crew.forEach(w => { w.g.visible = crewOn; if (!crewOn) return;
        const onTrench = t < C.trenchEnd; const y = onTrench ? H : rh;
        w.g.position.set(w.x, y, w.z); w.g.rotation.y = w.ry; w.arm.rotation.x = -1.6 + Math.max(0, Math.sin(t * w.sp + w.ph)) * 1.7; });
      // hero worker (strike close-up)
      hero.g.visible = t > C.carveEnd + 0.2 && t < C.title + 0.6;
      const sw = t < C.hit ? Math.max(0, Math.sin((t - C.strike) * 7.5)) : Math.max(0, 1 - (t - C.hit) * 4);
      hero.arm.rotation.x = -2.4 + sw * 2.0;
      // debris + dust
      for (let i = 0; i < ND; i++) {
        const d = deb[i], a = t - d.b; let s = 0;
        if (pre && a > 0 && a < 1.5) {
          const onT = d.b < C.trenchEnd, y0 = onT ? trenchH(d.b) : carveH(d.b);
          const x0 = onT ? Math.sign(d.x) * K.lerp(RX, PX, Math.abs(d.x)) : d.x * RX, z0 = onT ? d.z * PZ : d.z * RZ;
          V.set(x0 + d.vx * a, y0 + d.vy * a - 4.9 * a * a, z0 + d.vz * a);
          if (V.y > -0.2) s = d.s * (1 - K.prog(a, 1.1, 1.5));
          EU.set(d.r + a * 5, d.r * 2 + a * 4, 0); Q.setFromEuler(EU);
        }
        SC.setScalar(Math.max(0.0001, s)); M4.compose(V, Q, SC); debris.setMatrixAt(i, M4);
      }
      debris.instanceMatrix.needsUpdate = true;
      Q.identity();
      // sparks at the chisel: small taps, then the big wrong strike
      const hits = [C.strike + 0.21, C.strike + 0.63 > C.hit ? C.hit - 0.4 : C.strike + 0.63, C.hit];
      let fl = 0;
      for (let i = 0; i < NS; i++) {
        const hi = i % 3, h0 = hits[hi], big = hi === 2, a = t - h0, sp = spk[i]; let s = 0;
        if (a > 0 && a < sp.life * (big ? 1.6 : 1)) { const m = big ? 1.8 : 0.8; V.copy(chiselTip).addScaledVector(sp.v, a * m); V.y -= 3 * a * a; s = (big ? 0.85 : 0.7) * (1 - a / (sp.life * (big ? 1.6 : 1))); }
        SC.setScalar(Math.max(0.0001, s)); M4.compose(V, Q, SC); sparks.setMatrixAt(i, M4);
      }
      hits.forEach((h, i) => { fl = Math.max(fl, Math.exp(-Math.max(0, t - h) * 12) * (t > h ? (i === 2 ? 9 : 3) : 0)); });
      flashL.intensity = fl; workL.intensity = (t > C.carveEnd + 0.2 && t < C.title + 0.3) ? 7 : 0;
      sparks.instanceMatrix.needsUpdate = true;
      drawHud(t);
    };

    const sfx = [
      ['riser', Math.max(0, C.oneRock - 1.6), 0.45], ['thud', C.oneRock, 0.9], ['bass', C.oneRock, 0.6],
      ['whoosh', C.rewind - 0.25, 0.9], ['zap', C.rewind - 0.05, 0.35], ['bass', C.carve, 0.7], ['pop', C.carve + 0.3, 0.5],
      ['rustle', C.carve + 0.2, 0.6], ['rustle', C.trenchEnd + 0.4, 0.6], ['rustle', C.trenchEnd + 2.2, 0.55],
      ['tick', C.trenchEnd + 0.1, 0.4], ['pop', C.step2, 0.5], ['pop', C.step3, 0.5], ['thud', C.carveEnd, 0.6],
      ['tick', C.strike + 0.21, 0.7], ['tick', C.hit - 0.4, 0.7], ['thud', C.hit, 1.0], ['zap', C.hit, 0.5], ['bass', C.hit, 0.8],
      ['bass', C.title, 0.6], ['chime', C.title + 0.35, 0.55],
    ];
    return { duration: D, update, shots, sfx, watermark: false, endCard: false, music: {}, capFont: 'Fredoka Light', capMarginV: 520, capSize: 66 };
  },
};
