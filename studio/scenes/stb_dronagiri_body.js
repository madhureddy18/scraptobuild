// Dronagiri: myth-scale reel. Cinematic dusk/night/dawn look, low-poly Himalaya, a giant Hanuman, gold-on-navy HUD.
// 1 unit = 100 m. Dronagiri summit = 70.66 units (7,066 m). The top 1 km (10 units) is a separate cone that gets lifted.
// Zones: A Himalaya (origin) · C Lanka night camp (x=1600) · D flight over clouds (z=-1600). Every visual is a pure function of t.
window.SCENE = {
  setup: { bg: 0x0b1030, fog: [260, 900], fov: 40, bloom: { strength: 0.5, radius: 0.5, threshold: 0.82 } },
  lines: window.STB_LINES,
  build(K, T) {
    const L = T.lines, IDX = {}; window.STB_LINES.forEach((l, i) => { IDX[l.id] = i; });
    const B = n => L[IDX[n]].t, E = n => L[IDX[n]].end, F = (n, f) => B(n) + (E(n) - B(n)) * f;
    const D = E('cta') + 2.0;
    const THREE = window.THREE, S = K.scene;
    const ease = K.ease, eo = K.easeOut, prog = K.prog, clamp = K.clamp, lerp = K.lerp;
    K.cam.far = 4000; K.cam.updateProjectionMatrix();
    K.renderer.shadowMap.enabled = false; K.renderer.shadowMap.type = THREE.PCFSoftShadowMap; K.renderer.toneMappingExposure = 1.05;
    const inLine = (t, a, b) => t >= B(a) - 0.12 && t < (b ? B(b) : 1e9) - 0.12;   // t inside lines a..(b exclusive), cut-aligned

    // ---------------------------------------------------------------- skies (screen-space gradients + stars)
    const sky = (stops, stars = 0, sunAt = null) => K.canvasTex(256, 1024, (x, w, h) => { const g = x.createLinearGradient(0, 0, 0, h); stops.forEach(([o, c]) => g.addColorStop(o, c)); x.fillStyle = g; x.fillRect(0, 0, w, h);
      const r = K.rng(77); for (let i = 0; i < stars; i++) { const sy = r() * h * 0.6, a = (1 - sy / (h * 0.6)) * (0.4 + r() * 0.6); x.fillStyle = `rgba(255,255,255,${a})`; x.fillRect(r() * w, sy, r() < 0.1 ? 2 : 1, r() < 0.1 ? 2 : 1); }
      if (sunAt) { const sg = x.createRadialGradient(w / 2, h * sunAt, 0, w / 2, h * sunAt, w * 0.9); sg.addColorStop(0, 'rgba(255,240,200,0.95)'); sg.addColorStop(0.12, 'rgba(255,190,110,0.6)'); sg.addColorStop(1, 'rgba(255,140,80,0)'); x.fillStyle = sg; x.fillRect(0, 0, w, h); } });
    const SKY = {
      dusk: sky([[0, '#0b1240'], [0.45, '#3b2d78'], [0.75, '#d9677a'], [1, '#ffb36b']], 120),
      night: sky([[0, '#03061a'], [0.6, '#0b1440'], [1, '#22306a']], 420),
      flight: sky([[0, '#0a1650'], [0.55, '#3a3f9a'], [0.85, '#c96a8c'], [1, '#ffb070']], 160),
      dawn: sky([[0, '#2a4aa8'], [0.5, '#8a7ad0'], [0.78, '#ff9f8a'], [1, '#ffd889']], 30, 0.86),
      day: sky([[0, '#2c5fd0'], [0.6, '#8fc3ff'], [1, '#e8f2ff']], 0),
    };
    S.background = SKY.dusk;
    const hemi = new THREE.HemisphereLight(0xb8c8ff, 0x3a2a40, 0.9); S.add(hemi);
    const amb = new THREE.AmbientLight(0xffffff, 0.15); S.add(amb);
    const sun = new THREE.DirectionalLight(0xffc89a, 2.4); sun.castShadow = false; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -0.0006; sun.shadow.normalBias = 0.6;
    Object.assign(sun.shadow.camera, { left: -140, right: 140, top: 140, bottom: -140, near: 1, far: 700 }); S.add(sun); S.add(sun.target);

    // ---------------------------------------------------------------- materials
    const std = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.9, metalness: 0, flatShading: true }, o));
    const ROCK = std(0xffffff, { vertexColors: true, flatShading: false }), GROUND = std(0x4a4256), OCEAN = std(0x1b3d78, { roughness: 0.35, metalness: 0.1 });
    const GOLD = std(0xffc845, { emissive: 0x7a4a00, emissiveIntensity: 0.6, roughness: 0.4, metalness: 0.6, flatShading: false });
    const SAFF = std(0xe8742a, { emissive: 0x5a1c00, emissiveIntensity: 0.35, roughness: 0.6, flatShading: false });
    const RED = std(0xc1121f, { roughness: 0.7, flatShading: false }), DARKM = std(0x241a22);
    const mesh = (geo, m, x, y, z, parent = S, sh = true) => { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); o.castShadow = o.receiveShadow = false; parent.add(o); return o; };
    const snowColor = (geo, snowY, jitter = 3, seed = 1) => { const p = geo.attributes.position, c = new Float32Array(p.count * 3), r = K.rng(seed), wp = new THREE.Vector3();
      for (let i = 0; i < p.count; i++) { wp.fromBufferAttribute(p, i); const n = r() * jitter; const snow = wp.y + n > snowY; const g = snow ? 0.92 + r() * 0.08 : 0.32 + r() * 0.12;
        c[i * 3] = snow ? g : g * 1.05; c[i * 3 + 1] = snow ? g : g * 0.95; c[i * 3 + 2] = snow ? Math.min(1, g * 1.06) : g * 1.1; } geo.setAttribute('color', new THREE.BufferAttribute(c, 3)); };
    // jagged low-poly cone (or frustum); keepRings leaves the top/bottom rings untouched so pieces join cleanly
    const crag = (rTop, rBot, h, seg, hseg, seed, amp, keepRings = true) => { const g = new THREE.CylinderGeometry(rTop, rBot, h, seg, hseg, false).toNonIndexed(); const p = g.attributes.position, r = K.rng(seed), cache = {};
      for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i), key = `${x.toFixed(3)},${y.toFixed(3)},${z.toFixed(3)}`;
        if (keepRings && (Math.abs(y - h / 2) < 1e-4 || Math.abs(y + h / 2) < 1e-4)) continue; if (!cache[key]) { const rad = Math.hypot(x, z); cache[key] = rad < 1e-4 ? [0, 0, 0] : [(r() - 0.5) * amp, (r() - 0.5) * amp * 0.6, (r() - 0.5) * amp]; }
        const d = cache[key]; p.setXYZ(i, x + d[0], y + d[1], z + d[2]); }
      // drop near-zero-area triangles (collapsed apex/cap): their normals are NaN and bloom spreads them into black blocks
      const src = p.array, keep = [], va = new THREE.Vector3(), vb = new THREE.Vector3(), vc = new THREE.Vector3();
      for (let i = 0; i < src.length; i += 9) { va.set(src[i], src[i + 1], src[i + 2]); vb.set(src[i + 3], src[i + 4], src[i + 5]); vc.set(src[i + 6], src[i + 7], src[i + 8]);
        if (vb.clone().sub(va).cross(vc.clone().sub(va)).length() > 1e-3) for (let k = 0; k < 9; k++) keep.push(src[i + k]); }
      const out = new THREE.BufferGeometry(); out.setAttribute('position', new THREE.Float32BufferAttribute(keep, 3)); out.computeVertexNormals(); return out; };

    // ================================================================ ZONE A: Himalaya
    const A = new THREE.Group(); S.add(A);
    const ground = mesh(new THREE.CircleGeometry(700, 48), GROUND, 0, 0, 0, A); ground.rotation.x = -Math.PI / 2;
    const R0 = 40, H = 70.66, HB = 60.66;                      // base radius, summit height, height where the top 1 km starts
    const rAt = y => R0 * (1 - y / H);
    const baseGeo = crag(rAt(HB), R0, HB, 11, 8, 5, 5.5); baseGeo.translate(0, HB / 2, 0); snowColor(baseGeo, 44, 6, 3);
    const dBase = mesh(baseGeo, ROCK, 0, 0, 0, A);
    const summit = new THREE.Group(); S.add(summit);           // lives in world space (gets carried)
    const sumGeo = crag(0.01, rAt(HB), H - HB, 11, 3, 9, 1.2); sumGeo.translate(0, (H - HB) / 2, 0); snowColor(sumGeo, -5, 0, 4);
    const sumMesh = mesh(sumGeo, ROCK, 0, 0, 0, summit);
    const sumWire = new THREE.LineSegments(new THREE.EdgesGeometry(sumGeo, 1), new THREE.LineBasicMaterial({ color: 0xffd36a, transparent: true, opacity: 0 })); summit.add(sumWire);
    const sumGlow = new THREE.Mesh(new THREE.SphereGeometry(9, 24, 16), new THREE.MeshBasicMaterial({ color: 0xffc845, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending })); sumGlow.position.y = 4; summit.add(sumGlow);
    // four glowing herbs (Valmiki: four blazing herbs on the mountain top)
    const herbs = [[1.6, 2.2, 1.5], [-1.9, 3.1, 0.6], [0.4, 5.5, -1.2], [-0.6, 1.4, -2.9]].map(([x, y, z], i) => { const m = new THREE.Mesh(new THREE.IcosahedronGeometry(0.45, 1), new THREE.MeshBasicMaterial({ color: [0x9dffb0, 0xfff27a, 0x8ae9ff, 0xffb0f0][i] })); m.position.set(x, y, z); summit.add(m); return m; });
    // surrounding ranges
    { const r = K.rng(31); for (let i = 0; i < 44; i++) { const a = r() * Math.PI * 2, d = 110 + r() * 360, h = 22 + r() * 40, rad = 26 + r() * 30; const x = Math.cos(a) * d, z = Math.sin(a) * d;
        if (x > 30 && x < 120 && z > 20 && z < 110) continue;               // keep the village terrace clear
        if (x < -20 && x > -140 && z > -20 && z < 80) continue;             // keep the Burj / Hanuman stage clear
        const g = crag(0.01, rad, h, 8, 4, 100 + i, rad * 0.16); g.translate(0, h / 2, 0); snowColor(g, h * 0.62, 4, 200 + i); mesh(g, ROCK, x, 0, z, A); } }
    // Burj Khalifa ghosts for the hook (8 stacked, 828 m each = 8.28 units)
    const BURJ = 8.28, burjMat = new THREE.MeshStandardMaterial({ color: 0x9fd8ff, emissive: 0x3a9aff, emissiveIntensity: 1.6, transparent: true, opacity: 0.95, roughness: 0.2, metalness: 0.5 });
    const burjs = Array.from({ length: 8 }, (_, k) => { const g = new THREE.Group(); g.position.set(-52, k * BURJ, 14); g.userData.wide = 2.6; A.add(g);
      const tiers = [[0.62, 2.2], [0.5, 1.8], [0.38, 1.5], [0.27, 1.1], [0.17, 0.8]]; let y = 0; tiers.forEach(([r, h]) => { mesh(new THREE.CylinderGeometry(r * 0.85, r, h, 6), burjMat, 0, y + h / 2, 0, g, false); y += h; });
      mesh(new THREE.CylinderGeometry(0.02, 0.09, BURJ - y, 6), burjMat, 0, y + (BURJ - y) / 2, 0, g, false); return g; });
    // height ruler (gold) beside the mountain
    const ruler = new THREE.Group(); ruler.position.set(-44, 0, 6); A.add(ruler);
    const rulerBar = mesh(new THREE.BoxGeometry(1.4, 1, 1.4), GOLD, 0, 0.5, 0, ruler, false);
    const ticks = Array.from({ length: 8 }, (_, i) => mesh(new THREE.BoxGeometry(3, 0.35, 0.35), GOLD, -1.2, (i + 1) * 10, 0, ruler, false));
    const rulerTop = mesh(new THREE.BoxGeometry(6, 0.5, 0.5), GOLD, -2.2, H, 0, ruler, false);
    // the village terrace (Dronagiri village ~3,600 m) with stone houses
    const VX = 74, VZ = 66, VY = 36;
    const terraceGeo = crag(26, 34, VY, 10, 4, 61, 3.0); terraceGeo.translate(0, VY / 2, 0); snowColor(terraceGeo, 999, 0, 62); mesh(terraceGeo, ROCK, VX, 0, VZ, A);
    const meadow = mesh(new THREE.CircleGeometry(26, 20), std(0x5b7a3a), VX, VY + 0.05, VZ, A); meadow.rotation.x = -Math.PI / 2;
    const houses = []; { const r = K.rng(64), STONE = std(0x8c8478), SLATE = std(0x4b4f5c), WOOD = std(0x6b4426), WIN = new THREE.MeshBasicMaterial({ color: 0xffc46a });
      for (let i = 0; i < 26; i++) { const a = r() * Math.PI * 2, d = 3 + r() * 16, x = VX + Math.cos(a) * d, z = VZ + Math.sin(a) * d; const g = new THREE.Group(); g.position.set(x, VY, z); g.rotation.y = r() * 6.28; A.add(g);
        const w = 1.1 + r() * 0.6, dd = 0.9 + r() * 0.4, h = 0.7 + r() * 0.3; mesh(new THREE.BoxGeometry(w, h, dd), STONE, 0, h / 2, 0, g); const roof = mesh(new THREE.ConeGeometry(Math.hypot(w, dd) * 0.62, 0.5, 4), SLATE, 0, h + 0.25, 0, g); roof.rotation.y = Math.PI / 4; roof.scale.z = dd / w;
        mesh(new THREE.BoxGeometry(0.22, 0.42, 0.05), WOOD, 0, 0.21, dd / 2 + 0.01, g, false); mesh(new THREE.BoxGeometry(0.2, 0.18, 0.04), WIN, w * 0.28, h * 0.62, dd / 2 + 0.01, g, false); houses.push(g); }
      // a few pines and white prayer flags
      for (let i = 0; i < 30; i++) { const a = r() * 6.28, d = 18 + r() * 7; mesh(new THREE.ConeGeometry(0.6, 2.2, 6), std(0x234a2e), VX + Math.cos(a) * d, VY + 1.1, VZ + Math.sin(a) * d, A); } }
    const villagers = Array.from({ length: 9 }, (_, i) => { const r = K.rng(400 + i), g = new THREE.Group(); const a = r() * 6.28, d = 2 + r() * 9; g.position.set(VX + Math.cos(a) * d, VY, VZ + Math.sin(a) * d); A.add(g);
      mesh(new THREE.CapsuleGeometry(0.13, 0.36, 4, 8), std([0x6b4f8a, 0x8a3b2a, 0x2f5f7a, 0x7a6a2a][i % 4], { flatShading: false }), 0, 0.33, 0, g, false); mesh(new THREE.SphereGeometry(0.12, 10, 8), std(0xb07a52, { flatShading: false }), 0, 0.68, 0, g, false); g.rotation.y = Math.atan2(-g.position.x, -g.position.z); return g; });

    // ================================================================ HANUMAN (stylised; ~2 units tall at scale 1)
    const han = new THREE.Group(); S.add(han);              // position + yaw
    const hanP = new THREE.Group(); han.add(hanP);           // pitch for flight
    const fig = new THREE.Group(); hanP.add(fig);
    const SKINM = SAFF, cap = (r, l, m, x, y, z, p = fig) => mesh(new THREE.CapsuleGeometry(r, l, 6, 12), m, x, y, z, p, false);
    const legs = [-1, 1].map(s => { const l = new THREE.Group(); l.position.set(s * 0.13, 0.95, 0); fig.add(l); cap(0.1, 0.62, SKINM, 0, -0.45, 0, l); mesh(new THREE.SphereGeometry(0.11, 10, 8), GOLD, 0, -0.84, 0.04, l, false); return l; });
    mesh(new THREE.CylinderGeometry(0.2, 0.33, 0.5, 14), RED, 0, 0.92, 0, fig, false);                       // dhoti
    mesh(new THREE.TorusGeometry(0.21, 0.04, 8, 20), GOLD, 0, 1.13, 0, fig, false).rotation.x = Math.PI / 2;   // belt
    const torso = cap(0.22, 0.42, SKINM, 0, 1.42, 0); torso.scale.set(1.12, 1, 0.82);
    const sash = mesh(new THREE.TorusGeometry(0.26, 0.03, 6, 24), GOLD, 0, 1.42, 0, fig, false); sash.rotation.set(Math.PI / 2, 0.55, 0); sash.scale.set(1, 0.85, 1);
    mesh(new THREE.TorusGeometry(0.17, 0.045, 8, 20), GOLD, 0, 1.7, 0.02, fig, false).rotation.x = Math.PI / 2.4;  // necklace
    const head = new THREE.Group(); head.position.set(0, 1.92, 0); fig.add(head);
    mesh(new THREE.SphereGeometry(0.19, 18, 14), SKINM, 0, 0, 0, head, false); const muzzle = mesh(new THREE.SphereGeometry(0.12, 14, 10), std(0xf2b27a, { flatShading: false }), 0, -0.06, 0.12, head, false); muzzle.scale.set(1.1, 0.8, 0.8);
    for (const s of [-1, 1]) { mesh(new THREE.SphereGeometry(0.03, 8, 6), std(0x140c0c), s * 0.07, 0.05, 0.165, head, false); mesh(new THREE.SphereGeometry(0.06, 10, 8), SKINM, s * 0.19, 0.0, 0, head, false); mesh(new THREE.SphereGeometry(0.035, 8, 6), GOLD, s * 0.21, -0.07, 0.01, head, false); }
    mesh(new THREE.CylinderGeometry(0.17, 0.2, 0.18, 16), GOLD, 0, 0.17, 0, head, false); mesh(new THREE.ConeGeometry(0.15, 0.38, 16), GOLD, 0, 0.45, 0, head, false); mesh(new THREE.SphereGeometry(0.05, 8, 6), RED, 0, 0.2, 0.17, head, false);
    const halo = new THREE.Mesh(new THREE.RingGeometry(0.34, 0.4, 40), new THREE.MeshBasicMaterial({ color: 0xffd36a, transparent: true, opacity: 0.55, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false })); halo.position.set(0, 0.12, -0.12); head.add(halo);
    const armR = new THREE.Group(); armR.position.set(0.3, 1.66, 0); fig.add(armR); cap(0.075, 0.72, SKINM, 0, 0.44, 0, armR); mesh(new THREE.TorusGeometry(0.08, 0.025, 6, 14), GOLD, 0, 0.12, 0, armR, false).rotation.x = Math.PI / 2;
    const palm = new THREE.Object3D(); palm.position.set(0, 0.98, 0); armR.add(palm); mesh(new THREE.SphereGeometry(0.1, 10, 8), SKINM, 0, 0.92, 0, armR, false);
    const armL = new THREE.Group(); armL.position.set(-0.3, 1.66, 0); fig.add(armL); cap(0.075, 0.5, SKINM, 0, -0.32, 0, armL);
    const mace = new THREE.Group(); mace.position.set(0, -0.66, 0.02); armL.add(mace); mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.9, 8), GOLD, 0, 0.1, 0, mace, false); mesh(new THREE.SphereGeometry(0.2, 16, 12), GOLD, 0, 0.62, 0, mace, false); mesh(new THREE.ConeGeometry(0.05, 0.14, 8), GOLD, 0, 0.85, 0, mace, false);
    const tail = mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([[0, 0.95, -0.2], [0, 0.7, -0.6], [0.15, 1.0, -0.95], [0.1, 1.6, -0.95], [-0.1, 1.95, -0.7]].map(p => new THREE.Vector3(...p))), 30, 0.045, 8), SKINM, 0, 0, 0, fig, false);
    const hanGlow = new THREE.Mesh(new THREE.SphereGeometry(1.1, 24, 16), new THREE.MeshBasicMaterial({ color: 0xff9a3a, transparent: true, opacity: 0.035, depthWrite: false, blending: THREE.AdditiveBlending })); hanGlow.position.y = 1.2; fig.add(hanGlow);
    const HS = 40;                                            // giant scale: ~80 units = 8 km, "as big as a mountain"
    const HANA = new THREE.Vector3(-58, 0, 22);               // standing spot in zone A

    // ================================================================ ZONE C: night camp in Lanka
    const CX = 1600, C = new THREE.Group(); C.position.set(CX, 0, 0); S.add(C);
    const sand = mesh(new THREE.CircleGeometry(160, 40), std(0x3a3430), 0, 0, 0, C); sand.rotation.x = -Math.PI / 2;
    const sea = mesh(new THREE.PlaneGeometry(3000, 3000), OCEAN, 0, -0.3, 0, C, false); sea.rotation.x = -Math.PI / 2;
    const torchL = [];
    { const r = K.rng(5), TENT = std(0x5a4a3a), CLOTHM = [std(0x7a2a2a), std(0x2a4a6a), std(0x6a5a2a)];
      for (let i = 0; i < 22; i++) { const a = r() * 6.28, d = 8 + r() * 30; const t = mesh(new THREE.ConeGeometry(1.4 + r(), 2.2 + r(), 4), i % 3 ? TENT : CLOTHM[i % 3], Math.cos(a) * d, 1.2, -6 - Math.abs(Math.sin(a)) * d, C); t.rotation.y = r(); }
      for (let i = 0; i < 7; i++) { const a = i / 7 * 6.28 + 0.3, d = 5 + (i % 3) * 2.2, x = Math.cos(a) * d, z = Math.sin(a) * d; mesh(new THREE.CylinderGeometry(0.05, 0.07, 1.8, 6), std(0x3a2a1a), x, 0.9, z, C, false);
        const fl = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 8), new THREE.MeshBasicMaterial({ color: 0xffa040 })); fl.position.set(x, 1.9, z); C.add(fl); torchL.push(fl); }
      const pl = new THREE.PointLight(0xff8a3a, 30, 30, 1.6); pl.position.set(0, 3, 0); C.add(pl); C.userData.pl = pl; }
    // the wounded prince on a mat, warriors around him (silhouettes, no detail)
    mesh(new THREE.BoxGeometry(2.6, 0.08, 1.1), std(0x8a6a3a), 0, 0.04, 0, C, false);
    { const g = new THREE.Group(); g.position.set(0, 0.22, 0); g.rotation.z = Math.PI / 2; C.add(g); cap(0.17, 1.3, std(0x2d6f8f, { flatShading: false }), 0, 0, 0, g); mesh(new THREE.SphereGeometry(0.17, 12, 10), std(0x8a5a3a, { flatShading: false }), 0, 0.92, 0, g, false); mesh(new THREE.ConeGeometry(0.15, 0.28, 12), GOLD, 0, 1.13, 0, g, false).rotation.z = 0; }
    const princeGlow = new THREE.Mesh(new THREE.SphereGeometry(1.6, 20, 14), new THREE.MeshBasicMaterial({ color: 0x8ab8ff, transparent: true, opacity: 0.05, depthWrite: false, blending: THREE.AdditiveBlending })); princeGlow.position.y = 0.3; C.add(princeGlow);
    const kneel = Array.from({ length: 6 }, (_, i) => { const a = i / 6 * 6.28 + 0.5, d = 2.1; const g = new THREE.Group(); g.position.set(Math.cos(a) * d, 0, Math.sin(a) * d); g.rotation.y = Math.atan2(-g.position.x, -g.position.z); C.add(g);
      cap(0.16, 0.36, std(0x5a3d2a, { flatShading: false }), 0, 0.42, 0, g); mesh(new THREE.SphereGeometry(0.15, 10, 8), std(0x5a3d2a, { flatShading: false }), 0, 0.84, 0.05, g, false); return g; });

    // ================================================================ ZONE D: flight over a sea of clouds
    const DZ = -1600, Dg = new THREE.Group(); Dg.position.set(0, 0, DZ); S.add(Dg);
    const sea2 = mesh(new THREE.PlaneGeometry(4000, 4000), OCEAN, 0, 0, 0, Dg, false); sea2.rotation.x = -Math.PI / 2;
    const CLOUD = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1, flatShading: true, emissive: 0x302850, emissiveIntensity: 0.4 });
    const NCL = 1100, clouds = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 1), CLOUD, NCL); Dg.add(clouds);
    { const r = K.rng(8), o = new THREE.Object3D(); for (let i = 0; i < NCL; i++) { o.position.set(-800 + r() * 2600, 95 + r() * 18, -420 + r() * 700); const s = 12 + r() * 22; o.scale.set(s * (1.4 + r()), s * 0.45, s); o.rotation.y = r() * 6; o.updateMatrix(); clouds.setMatrixAt(i, o.matrix); } }
    const streaks = Array.from({ length: 36 }, (_, i) => { const m = new THREE.Mesh(new THREE.BoxGeometry(1, 0.25, 0.25), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })); S.add(m); return m; });
    const dawnSun = new THREE.Mesh(new THREE.CircleGeometry(60, 48), new THREE.MeshBasicMaterial({ color: 0xffe2a0, fog: false })); S.add(dawnSun);
    const flightX = t => -260 + (t - B('hook2')) * 12 + Math.max(0, t - B('dist')) * 14;   // keeps moving forward through the flight lines

    // ================================================================ HUD
    const hudTex = K.canvasTex(1080, 1920, () => {});
    const hudScene = new THREE.Scene(), hudCam = new THREE.OrthographicCamera(-540, 540, 960, -960, -10, 10);
    hudScene.add(new THREE.Mesh(new THREE.PlaneGeometry(1080, 1920), new THREE.MeshBasicMaterial({ map: hudTex, transparent: true, toneMapped: false, depthTest: false })));
    K.draw = () => { K.composer.render(); const r = K.renderer; r.autoClear = false; r.clearDepth(); r.render(hudScene, hudCam); r.autoClear = true; };
    const GLD = '#ffcf5a', GLD2 = '#ffe9a8', NAV = 'rgba(9,12,34,0.82)', WHT = '#ffffff', RED_ = '#ff5a4f', GRN = '#5fe08a', BLU = '#7cc8ff', MUT = '#b9c0e0';
    const fade = (t, a, b = 1e9) => prog(t, a, a + 0.25) * (1 - prog(t, b, b + 0.25));
    const pop = (t, a, b = 1e9) => (t >= a && t < b + 0.25) ? K.easeBack(prog(t, a, a + 0.35)) * (1 - K.easeIn(prog(t, b, b + 0.25))) : 0;
    let X;
    const Al = (a, fn) => { if (a <= 0.002) return; X.save(); X.globalAlpha *= clamp(a); fn(); X.restore(); };
    const Zm = (k, cx, cy, fn) => { if (k <= 0.002) return; X.save(); X.translate(cx, cy); X.scale(k, k); X.translate(-cx, -cy); fn(); X.restore(); };
    const txt = (s, x, y, size, col, { f = 'Oswald', w = 600, al = 'center', max, glow = 0, ls = 0 } = {}) => { X.font = `${w} ${size}px "${f}"`; if (max) { const m = X.measureText(s).width; if (m > max) { size = Math.floor(size * max / m); X.font = `${w} ${size}px "${f}"`; } }
      X.textAlign = al; X.textBaseline = 'middle'; if ('letterSpacing' in X) X.letterSpacing = ls + 'px'; X.shadowColor = 'rgba(0,0,0,0.65)'; X.shadowBlur = 14; X.shadowOffsetY = 3; if (glow) { X.shadowColor = col; X.shadowBlur = glow; X.shadowOffsetY = 0; }
      X.fillStyle = col; X.fillText(s, x, y); X.shadowColor = 'transparent'; X.shadowBlur = 0; X.shadowOffsetY = 0; if ('letterSpacing' in X) X.letterSpacing = '0px'; };
    const panel = (x, y, w, h, { r = 26, border = GLD, bg = NAV, lw = 3 } = {}) => { X.save(); X.shadowColor = 'rgba(0,0,0,0.5)'; X.shadowBlur = 30; X.fillStyle = bg; K.rrect(X, x, y, w, h, r); X.fill(); X.restore(); X.strokeStyle = border; X.lineWidth = lw; K.rrect(X, x, y, w, h, r); X.stroke();
      X.strokeStyle = 'rgba(255,207,90,0.25)'; X.lineWidth = 1; K.rrect(X, x + 8, y + 8, w - 16, h - 16, r - 6); X.stroke(); };
    const chip = (t, a, b, s, cx, cy, { size = 44, bg = GLD, fg = '#1a1020', f = 'Oswald' } = {}) => Al(fade(t, a, b), () => Zm(pop(t, a, b), cx, cy, () => { X.font = `700 ${size}px "${f}"`; const w = X.measureText(s).width + 64, h = size * 1.5; X.fillStyle = bg; K.rrect(X, cx - w / 2, cy - h / 2, w, h, h / 2); X.fill(); txt(s, cx, cy + 2, size, fg, { f, w: 700 }); }));
    const label = (t, a, b, s, cx, cy, size = 30) => Al(fade(t, a, b), () => txt(s, cx, cy, size, GLD2, { f: 'Cinzel', w: 700, ls: 6 }));
    const IN = n => Math.round(n).toLocaleString('en-IN');
    const pin = (cx, cy, s, col = RED_) => { X.fillStyle = col; X.strokeStyle = '#1a1020'; X.lineWidth = 4; X.beginPath(); X.arc(cx, cy - s * 0.55, s * 0.45, Math.PI * 0.85, Math.PI * 2.15); X.lineTo(cx, cy + s * 0.15); X.closePath(); X.fill(); X.stroke(); X.fillStyle = '#fff'; X.beginPath(); X.arc(cx, cy - s * 0.55, s * 0.17, 0, 7); X.fill(); };
    const INDIA = [[68.2, 23.7], [68.8, 23.3], [69.0, 22.4], [70.5, 20.8], [72.3, 21.3], [72.6, 22.2], [72.9, 20.8], [72.8, 19.0], [73.3, 17.0], [73.9, 15.5], [74.6, 13.5], [75.5, 11.5], [76.2, 10.0], [77.0, 8.3], [77.6, 8.1], [78.2, 8.9], [79.0, 9.4], [79.3, 10.3], [79.85, 10.8], [79.9, 12.3], [80.3, 13.5], [80.1, 15.2], [80.6, 15.9], [81.5, 16.3], [82.3, 16.7], [83.4, 17.7], [84.8, 19.2], [86.4, 20.0], [87.0, 21.0], [87.6, 21.6], [88.2, 21.7], [89.0, 21.9], [88.7, 23.5], [88.0, 24.4], [88.4, 25.2], [89.0, 25.3], [89.8, 26.0], [90.6, 25.2], [92.0, 25.1], [92.3, 24.2], [91.6, 23.2], [92.3, 22.0], [93.2, 22.3], [93.4, 23.8], [94.2, 24.0], [94.6, 25.4], [95.2, 26.6], [96.3, 27.3], [97.3, 28.2], [96.2, 29.3], [95.4, 29.0], [94.0, 28.0], [92.2, 27.8], [91.6, 27.1], [89.8, 26.8], [88.9, 27.2], [88.8, 28.1], [88.1, 27.9], [88.1, 26.5], [86.0, 26.5], [84.0, 27.4], [82.0, 27.7], [80.1, 28.8], [80.9, 30.2], [79.0, 31.4], [78.7, 32.6], [79.4, 32.6], [79.5, 34.0], [78.0, 35.5], [77.0, 35.6], [75.0, 37.0], [73.9, 36.0], [73.7, 34.6], [74.0, 33.4], [74.6, 32.7], [75.3, 32.2], [74.5, 31.0], [73.9, 30.1], [72.2, 28.4], [70.6, 27.8], [69.5, 26.6], [70.1, 25.2], [71.0, 24.5], [69.9, 24.2], [68.8, 24.3]];
    const SRI = [[79.9, 9.8], [80.3, 9.8], [80.9, 8.9], [81.4, 8.2], [81.9, 7.4], [81.8, 6.5], [81.2, 6.1], [80.6, 5.9], [80.0, 6.3], [79.85, 7.2], [79.8, 8.2]];
    const UK = [[77.6, 30.9], [78.4, 31.2], [79.0, 31.4], [80.1, 30.6], [80.9, 30.2], [80.1, 28.8], [79.2, 29.1], [78.2, 29.8], [77.6, 30.2]];
    const MK = 25, mx = lon => 175 + (lon - 68) * MK * 0.93, my = lat => 330 + (37 - lat) * MK;
    const poly = (pts, n = pts.length) => { X.beginPath(); for (let i = 0; i < n; i++) { const [lo, la] = pts[i]; i ? X.lineTo(mx(lo), my(la)) : X.moveTo(mx(lo), my(la)); } };
    const DRO = [79.84, 30.52], LNK = [80.7, 7.9];
    const drawMap = (k = 1) => { const n = Math.max(2, Math.floor(INDIA.length * k)); poly(INDIA, n); if (k >= 1) X.closePath(); X.fillStyle = 'rgba(40,52,110,0.95)'; X.fill(); X.strokeStyle = GLD; X.lineWidth = 3; X.lineJoin = 'round'; X.stroke();
      if (k >= 1) { poly(SRI); X.closePath(); X.fillStyle = 'rgba(40,52,110,0.95)'; X.fill(); X.stroke(); } };
    const arc = (k, col = GLD) => { const x0 = mx(DRO[0]), y0 = my(DRO[1]), x1 = mx(LNK[0]), y1 = my(LNK[1]), cx = x0 + 260, cy = (y0 + y1) / 2; X.strokeStyle = col; X.lineWidth = 6; X.setLineDash([18, 12]); X.beginPath();
      for (let i = 0; i <= 40 * k; i++) { const u = i / 40, x = (1 - u) * (1 - u) * x0 + 2 * (1 - u) * u * cx + u * u * x1, y = (1 - u) * (1 - u) * y0 + 2 * (1 - u) * u * cy + u * u * y1; i ? X.lineTo(x, y) : X.moveTo(x, y); } X.stroke(); X.setLineDash([]);
      const u = k, hx = (1 - u) * (1 - u) * x0 + 2 * (1 - u) * u * cx + u * u * x1, hy = (1 - u) * (1 - u) * y0 + 2 * (1 - u) * u * cy + u * u * y1; X.fillStyle = WHT; X.beginPath(); X.arc(hx, hy, 12, 0, 7); X.fill(); X.fillStyle = GLD; X.beginPath(); X.moveTo(hx - 12, hy - 4); X.lineTo(hx, hy - 30); X.lineTo(hx + 12, hy - 4); X.closePath(); X.fill(); };

    // gold light-sweep at each cut
    const CUTS = ['hook2', 'src', 'herb', 'loc', 'height', 'lift', 'giant', 'weight', 'me', 'dist', 'dawn', 'food', 'twist', 'cta'].map(n => B(n) - 0.12);
    const sweep = (W, Hh, t) => { for (const c of CUTS) { const p = (t - c) / 0.45; if (p < 0 || p > 1) continue; const xx = lerp(-900, 1900, ease(p)), g = X.createLinearGradient(xx - 260, 0, xx + 260, 0);
      g.addColorStop(0, 'rgba(255,200,90,0)'); g.addColorStop(0.5, `rgba(255,236,190,${0.55 * Math.sin(p * Math.PI)})`); g.addColorStop(1, 'rgba(255,200,90,0)'); X.save(); X.globalCompositeOperation = 'lighter'; X.fillStyle = g; X.fillRect(0, 0, W, Hh); X.restore();
      X.fillStyle = `rgba(255,240,210,${0.35 * Math.max(0, 1 - Math.abs(p - 0.35) * 5)})`; X.fillRect(0, 0, W, Hh); } };

    const drawHud = t => hudTex.redraw((x, W, Hh) => { X = x;
      const vg = x.createRadialGradient(W / 2, Hh * 0.45, Hh * 0.35, W / 2, Hh / 2, Hh * 0.8); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(4,6,20,0.55)'); x.fillStyle = vg; x.fillRect(0, 0, W, Hh);
      x.fillStyle = 'rgba(255,255,255,0.12)'; x.fillRect(0, 0, W, 8); x.fillStyle = GLD; x.fillRect(0, 0, W * t / D, 8);
      // ---- hook1: 8 Burj Khalifas counter
      { const a = B('hook1'), b = E('hook1') + 0.15; const n = Math.min(8, Math.floor(1 + 7 * clamp((t - a - 0.3) / Math.max(0.5, (b - a - 0.9)))));
        if (t > a - 0.1 && t < b + 0.3) { Al(fade(t, a, b), () => { panel(140, 170, 800, 230); txt('DRONAGIRI', 540, 240, 72, GLD, { f: 'Cinzel', w: 700, glow: 18, ls: 8 }); txt('7,066 m  vs  BURJ KHALIFA 828 m', 540, 320, 38, WHT, { w: 500 }); });
          chip(t, a + 0.35, b, `× ${n} BURJ KHALIFAS`, 540, 480, { size: 54 }); } }
      // ---- hook2: legend tag
      label(t, B('hook2') + 0.1, E('hook2') + 0.1, 'L E G E N D', 540, 210, 40);
      chip(t, F('hook2', 0.55), E('hook2') + 0.1, 'HIMALAYAS  →  LANKA', 540, 300, { size: 46 });
      // ---- src: the source card
      { const a = B('src'), b = E('src'); if (t > a - 0.1 && t < b + 0.3) Al(fade(t, a, b), () => Zm(pop(t, a + 0.05), 540, 310, () => { panel(120, 180, 840, 260);
        txt('VALMIKI RAMAYANA', 540, 250, 60, GLD, { f: 'Cinzel', w: 700, max: 760, glow: 12 }); txt('YUDDHA KANDA  ·  THE BOOK OF WAR', 540, 325, 34, WHT, { w: 500 }); txt('Sargas 74 & 101', 540, 385, 30, MUT, { w: 400 }); })); }
      // ---- herb: map Lanka -> Himalayas
      { const a = B('herb'), b = E('herb'); if (t > a - 0.1 && t < b + 0.3) Al(fade(t, a, b), () => { panel(80, 150, 920, 1120, { bg: 'rgba(9,12,34,0.9)' }); txt('THE HERB MOUNTAIN', 540, 215, 48, GLD, { f: 'Cinzel', w: 700, ls: 4 });
        drawMap(eo(prog(t, a, a + 0.7)));
        const k = eo(prog(t, a + 0.6, F('herb', 0.85))); if (k > 0) { const x0 = mx(LNK[0]), y0 = my(LNK[1]), x1 = mx(DRO[0]), y1 = my(DRO[1]); X.strokeStyle = GRN; X.lineWidth = 6; X.setLineDash([16, 12]); X.beginPath(); X.moveTo(x0, y0); X.quadraticCurveTo(x0 - 300, (y0 + y1) / 2, lerp(x0, x1, k), lerp(y0, y1, k)); X.stroke(); X.setLineDash([]); }
        Al(prog(t, a + 0.5, a + 0.8), () => { txt('LANKA', mx(LNK[0]) + 110, my(LNK[1]), 34, WHT, { w: 700 }); }); Al(prog(t, F('herb', 0.7), F('herb', 0.85)), () => { txt('HIMALAYAS', mx(DRO[0]) + 40, my(DRO[1]) - 70, 40, GRN, { w: 700 }); }); }); }
      // ---- loc: zoom into Uttarakhand
      { const a = B('loc'), b = E('loc'); if (t > a - 0.1 && t < b + 0.3) Al(fade(t, a, b), () => { panel(80, 150, 920, 1120, { bg: 'rgba(9,12,34,0.9)' }); txt('WHERE?', 540, 215, 52, GLD, { f: 'Cinzel', w: 700, ls: 6 }); drawMap(1);
        const sk = prog(t, F('loc', 0.45), F('loc', 0.6)); if (sk > 0) { poly(UK); X.closePath(); X.fillStyle = `rgba(255,140,60,${sk})`; X.fill(); X.strokeStyle = GLD; X.lineWidth = 3; X.stroke(); }
        const pk = prog(t, F('loc', 0.2), F('loc', 0.35)), px = mx(DRO[0]), py = my(DRO[1]); if (pk > 0) { pin(px, py - (1 - eo(pk)) * 140, 58); Al(pk, () => { panel(px + 40, py - 150, 330, 80, { r: 20 }); txt('DRONAGIRI', px + 205, py - 110, 44, GLD, { w: 700 }); }); }
        Al(sk, () => { txt('CHAMOLI · UTTARAKHAND', 540, 1180, 44, WHT, { w: 600 }); }); }); }
      // ---- height: metre counter
      { const a = B('height'), b = E('height'); if (t > a - 0.1 && t < b + 0.3) { const v = 7066 * eo(prog(t, a + 0.2, F('height', 0.85)));
        Al(fade(t, a, b), () => { panel(170, 170, 740, 230); txt(IN(v) + ' m', 540, 265, 104, GLD, { w: 700, glow: 16 }); txt('ABOVE SEA LEVEL', 540, 350, 34, WHT, { w: 500, ls: 4 }); });
        chip(t, F('height', 0.75), b, '≈ 23,180 FEET', 540, 480, { size: 44, bg: BLU }); } }
      // ---- lift: "WHOLE PEAK"
      chip(t, B('lift') + 0.2, F('lift', 0.5), 'WHICH HERB IS WHICH?', 540, 220, { size: 46, bg: '#2a3266', fg: WHT });
      chip(t, F('lift', 0.55), E('lift') + 0.1, 'SO HE LIFTS THE WHOLE PEAK', 540, 220, { size: 48 });
      // ---- giant: quote card
      { const a = B('giant'), b = E('giant'); if (t > a - 0.1 && t < b + 0.3) Al(fade(t, a, b), () => Zm(pop(t, a + 0.05), 540, 300, () => { panel(130, 180, 820, 230);
        txt('"EQUAL TO A MOUNTAIN"', 540, 260, 56, GLD, { f: 'Cinzel', w: 700, max: 740, glow: 10 }); txt('VALMIKI · YUDDHA KANDA 74', 540, 340, 32, WHT, { w: 500, ls: 3 }); })); }
      // ---- weight: billions of tonnes counter
      { const a = B('weight'), b = E('weight'); if (t > a - 0.1 && t < b + 0.3) { const v = 2.8 * eo(prog(t, F('weight', 0.4), F('weight', 0.95)));
        Al(fade(t, a, b), () => { panel(120, 160, 840, 290); txt('TOP 1 KM ONLY', 540, 220, 40, WHT, { w: 600, ls: 4 }); txt(v.toFixed(1) + ' BILLION', 540, 305, 92, GLD, { w: 700, glow: 16 }); txt('TONNES OF ROCK', 540, 395, 40, WHT, { w: 600, ls: 4 }); });
        Al(fade(t, F('weight', 0.5), b), () => txt('estimate: a 1 km tall, 1 km wide cone of rock (2.7 t/m³)', 540, 495, 24, MUT, { w: 400 })); } }
      // ---- humans: bar comparison
      { const a = B('humans'), b = E('humans'); if (t > a - 0.1 && t < b + 0.3) Al(fade(t, a, b), () => { panel(90, 160, 900, 420);
        const k1 = eo(prog(t, a + 0.1, a + 0.8)), k2 = eo(prog(t, F('humans', 0.3), F('humans', 0.6)));
        txt('TOP 1 KM OF DRONAGIRI', 140, 225, 34, WHT, { w: 600, al: 'left' }); X.fillStyle = GLD; K.rrect(X, 140, 255, 800 * k1, 64, 14); X.fill(); Al(k1, () => txt('2.8 BN t', 160 + 800 * k1 - 150, 288, 40, '#1a1020', { w: 700 }));
        txt('ALL 8 BILLION HUMANS', 140, 370, 34, WHT, { w: 600, al: 'left' }); X.fillStyle = BLU; K.rrect(X, 140, 400, Math.max(1, 800 * 0.18 * k2), 64, 14); X.fill(); Al(k2, () => txt('~0.5 BN t', 140 + 800 * 0.18 * k2 + 100, 433, 36, WHT, { w: 700 }));
        Al(prog(t, F('humans', 0.6), F('humans', 0.75)), () => Zm(pop(t, F('humans', 0.6)), 540, 520, () => txt('MORE THAN 5×', 540, 522, 62, GLD, { w: 700, glow: 18 }))); }); }
      // ---- me: grocery-bag humour (about the narrator, not the legend)
      { const a = B('me'), b = E('me'); if (t > a - 0.1 && t < b + 0.3) Al(fade(t, a, b), () => Zm(pop(t, a + 0.05), 540, 600, () => { panel(170, 230, 740, 760, { bg: 'rgba(250,246,236,0.97)', border: '#1a1020', lw: 6 });
        txt('MEANWHILE, ME:', 540, 300, 52, '#1a1020', { w: 700 });
        X.strokeStyle = '#1a1020'; X.lineWidth = 8; X.lineJoin = 'round'; X.beginPath(); X.moveTo(250, 900); for (let i = 0; i < 6; i++) { X.lineTo(250 + i * 95, 900 - i * 80); X.lineTo(250 + (i + 1) * 95, 900 - i * 80); } X.stroke();
        const bob = Math.sin(t * 9) * 6, px = 520, py = 640 + bob;                    // stick figure mid-staircase, bent over
        X.lineWidth = 9; X.lineCap = 'round'; X.beginPath(); X.arc(px + 30, py - 120, 34, 0, 7); X.stroke();
        X.beginPath(); X.moveTo(px + 18, py - 86); X.lineTo(px - 10, py + 20); X.moveTo(px - 10, py + 20); X.lineTo(px - 50, py + 110); X.moveTo(px - 10, py + 20); X.lineTo(px + 40, py + 70); X.lineTo(px + 50, py + 130); X.stroke();
        for (const [ax, bx] of [[-1, -70], [1, 70]]) { X.beginPath(); X.moveTo(px + 6, py - 60); X.lineTo(px + bx * 0.7, py - 10); X.lineTo(px + bx, py + 20); X.stroke(); X.fillStyle = ax < 0 ? '#ff8a3a' : '#5fb0ff'; X.fillRect(px + bx - 38, py + 20, 76, 92); X.strokeRect(px + bx - 38, py + 20, 76, 92); }
        X.fillStyle = '#5fb0ff'; for (const [dx, dy, ph] of [[70, -150, 0], [92, -118, 1.3], [-20, -160, 2.1]]) { const yy = py + dy + ((t * 60 + ph * 40) % 60); X.beginPath(); X.arc(px + dx, yy, 9, 0, 7); X.fill(); }
        txt('2 BAGS · 1 FLOOR · BREATHING HEAVILY', 540, 950, 30, '#1a1020', { w: 600, max: 660 }); })); }
      // ---- dist: flight map with km counter
      { const a = B('dist'), b = E('dist'); if (t > a - 0.1 && t < b + 0.3) Al(fade(t, a, b), () => { panel(80, 150, 920, 1120, { bg: 'rgba(9,12,34,0.86)' }); drawMap(1);
        const k = eo(prog(t, a + 0.3, F('dist', 0.9))); arc(k); pin(mx(DRO[0]), my(DRO[1]), 44, GLD); txt('DRONAGIRI', mx(DRO[0]) - 10, my(DRO[1]) - 80, 32, GLD, { w: 700 });
        panel(260, 1090, 560, 130, { r: 22 }); txt(IN(2300 * k) + ' KM', 540, 1157, 80, GLD, { w: 700, glow: 14 }); }); }
      // ---- dawn
      chip(t, B('dawn') + 0.15, E('dawn') + 0.2, 'BEFORE SUNRISE', 540, 230, { size: 56 });
      label(t, F('dawn', 0.4), E('dawn') + 0.2, 'M O S T   R E T E L L I N G S', 540, 320, 30);
      // ---- speed: speedometer
      { const a = B('speed'), b = E('speed'); if (t > a - 0.1 && t < b + 0.3) Al(fade(t, a, b), () => { panel(140, 160, 800, 560); const cx = 540, cy = 560, R = 300;
        const ang = v => Math.PI + (v / 300) * Math.PI; X.lineWidth = 26; X.lineCap = 'butt'; X.strokeStyle = 'rgba(255,255,255,0.15)'; X.beginPath(); X.arc(cx, cy, R, Math.PI, 2 * Math.PI); X.stroke();
        const v = 230 * eo(prog(t, F('speed', 0.25), F('speed', 0.55))); X.strokeStyle = GLD; X.beginPath(); X.arc(cx, cy, R, Math.PI, ang(v)); X.stroke();
        for (let s = 0; s <= 300; s += 50) { const q = ang(s); X.strokeStyle = WHT; X.lineWidth = 4; X.beginPath(); X.moveTo(cx + Math.cos(q) * (R - 40), cy + Math.sin(q) * (R - 40)); X.lineTo(cx + Math.cos(q) * (R - 18), cy + Math.sin(q) * (R - 18)); X.stroke(); txt(String(s), cx + Math.cos(q) * (R - 75), cy + Math.sin(q) * (R - 75), 26, MUT, { w: 500 }); }
        const tq = ang(160); X.strokeStyle = BLU; X.lineWidth = 8; X.beginPath(); X.moveTo(cx + Math.cos(tq) * (R - 50), cy + Math.sin(tq) * (R - 50)); X.lineTo(cx + Math.cos(tq) * (R + 30), cy + Math.sin(tq) * (R + 30)); X.stroke();
        Al(prog(t, F('speed', 0.55), F('speed', 0.7)), () => { txt('FASTEST TRAIN IN INDIA', cx + Math.cos(tq) * (R + 70) - 10, cy + Math.sin(tq) * (R + 70) - 34, 22, BLU, { w: 600 }); txt('160', cx + Math.cos(tq) * (R + 70), cy + Math.sin(tq) * (R + 70) - 6, 28, BLU, { w: 700 }); });
        const nq = ang(v); X.strokeStyle = RED_; X.lineWidth = 10; X.lineCap = 'round'; X.beginPath(); X.moveTo(cx, cy); X.lineTo(cx + Math.cos(nq) * (R - 30), cy + Math.sin(nq) * (R - 30)); X.stroke(); X.fillStyle = WHT; X.beginPath(); X.arc(cx, cy, 18, 0, 7); X.fill();
        txt(IN(v), cx, cy - 110, 110, GLD, { w: 700, glow: 16 }); txt('KM / H', cx, cy - 30, 36, WHT, { w: 600, ls: 4 });
        Al(prog(t, a, a + 0.3), () => txt('2,300 KM ÷ 10 HOURS', 540, 230, 40, WHT, { w: 600 })); }); }
      // ---- food: delivery app humour (generic app, no brand)
      { const a = B('food'), b = E('food'); if (t > a - 0.1 && t < b + 0.3) Al(fade(t, a, b), () => Zm(pop(t, a + 0.05), 540, 640, () => { const px = 290, py = 200, pw = 500, ph = 900;
        X.fillStyle = '#111'; K.rrect(X, px - 16, py - 16, pw + 32, ph + 32, 64); X.fill(); X.fillStyle = '#f6f3ee'; K.rrect(X, px, py, pw, ph, 50); X.fill();
        X.fillStyle = '#e9e4da'; X.fillRect(px, py + 120, pw, 430); X.strokeStyle = '#cfc7b8'; X.lineWidth = 10; X.beginPath(); X.moveTo(px + 40, py + 500); X.lineTo(px + 180, py + 380); X.lineTo(px + 300, py + 420); X.lineTo(px + 450, py + 200); X.stroke();
        X.strokeStyle = '#ff7a2a'; X.lineWidth = 10; X.beginPath(); X.moveTo(px + 40, py + 500); X.lineTo(px + 52, py + 490); X.stroke(); X.fillStyle = '#ff7a2a'; X.beginPath(); X.arc(px + 52 + Math.sin(t * 2) * 2, py + 490, 16, 0, 7); X.fill(); pin(px + 450, py + 210, 46, '#1a1020');
        txt('Your order is on the way', px + pw / 2, py + 70, 34, '#1a1020', { w: 700, max: pw - 40 });
        txt('2.0 km away', px + pw / 2, py + 610, 44, '#1a1020', { w: 700 }); X.fillStyle = '#ddd'; K.rrect(X, px + 50, py + 670, pw - 100, 22, 11); X.fill(); X.fillStyle = '#ff7a2a'; K.rrect(X, px + 50, py + 670, (pw - 100) * 0.04, 22, 11); X.fill();
        txt('ARRIVING IN', px + pw / 2, py + 750, 30, '#666', { w: 600, ls: 3 }); txt('40 MIN', px + pw / 2, py + 815, 76, '#ff3b30', { w: 700 });
        chip(t, F('food', 0.6), b, 'HANUMAN: 230 KM/H', 540, 1210, { size: 42 }); })); }
      // ---- twist + why
      { const a = B('twist'), b = E('why'); if (t > a - 0.1 && t < b + 0.3) { Al(fade(t, a, b), () => { panel(150, 170, 780, 200); txt('DRONAGIRI VILLAGE', 540, 240, 56, GLD, { f: 'Cinzel', w: 700, max: 700, glow: 10 }); txt('≈ 3,600 m · CHAMOLI', 540, 315, 34, WHT, { w: 500, ls: 3 }); });
        chip(t, F('twist', 0.55), b, 'LOCAL TRADITION', 540, 450, { size: 40, bg: '#2a3266', fg: WHT });
        chip(t, B('why') + 0.2, b, 'THEIR SACRED MOUNTAIN WAS TAKEN', 540, 545, { size: 40 }); } }
      // ---- CTA: title + follow button
      { const ca = B('cta') - 0.2; if (t > ca) Al(prog(t, ca, ca + 0.35), () => { txt('DRONAGIRI', 540, 250, 108, GLD, { f: 'Cinzel', w: 700, glow: 22, ls: 10, max: 960 }); txt('7,066 m · 2,300 km · ONE NIGHT', 540, 350, 40, WHT, { w: 600, ls: 2 });
        const fa = B('cta') + 0.25; Zm(pop(t, fa), 540, 1640, () => { const press = K.pulse(t, fa + 1.1, 0.32), done = t > fa + 1.25, w = 560 - press * 26;
          X.fillStyle = done ? '#2a2f45' : '#ff3b5c'; K.rrect(X, 540 - w / 2, 1585, w, 110, 55); X.fill(); txt(done ? 'FOLLOWING ✓' : '+ FOLLOW', 540, 1642, 54, WHT, { w: 700 });
          const hp = eo(prog(t, fa + 0.35, fa + 1.05)), hx = 760 - hp * 200, hy = 1790 - hp * 130; X.fillStyle = 'rgba(255,255,255,0.95)'; X.strokeStyle = '#1a1020'; X.lineWidth = 5; X.beginPath(); X.arc(hx, hy, 30 - press * 6, 0, 7); X.fill(); X.stroke();
          if (press > 0) { X.strokeStyle = `rgba(255,255,255,${press})`; X.lineWidth = 6; X.beginPath(); X.arc(hx, hy, 48 + press * 46, 0, 7); X.stroke(); } }); }); }
      sweep(W, Hh, t);
    });

    // ---------------------------------------------------------------- zone / light state per time
    const zoneOf = t => { if (inLine(t, 'hook2', 'src') || inLine(t, 'dist', 'twist') || inLine(t, 'cta')) return 'D'; if (inLine(t, 'src', 'herb')) return 'C'; return 'A'; };
    const setLook = t => { const z = zoneOf(t), dawnK = z === 'D' ? (t >= B('dawn') - 0.12 ? ease(prog(t, B('dawn') - 0.12, F('dawn', 0.8))) : 0) : 0;
      let bg = SKY.dusk; if (z === 'C') bg = SKY.night; if (z === 'D') bg = dawnK > 0.5 ? SKY.dawn : SKY.flight; if (z === 'A' && t >= B('twist') - 0.12) bg = SKY.day; S.background = bg;
      if (z === 'A') { const day = t >= B('twist') - 0.12; sun.color.setHex(day ? 0xfff2de : 0xffb27a); sun.intensity = day ? 2.6 : 2.2; sun.position.set(-160, day ? 220 : 90, 140); sun.target.position.set(0, 20, 0); hemi.color.setHex(day ? 0xdfeaff : 0xb0a8ff); hemi.intensity = day ? 1.1 : 0.85; S.fog.color.setHex(day ? 0xcfe0ff : 0x6a4f8a); S.fog.near = 300; S.fog.far = 1100; }
      if (z === 'C') { sun.color.setHex(0x8aa0ff); sun.intensity = 0.5; sun.position.set(CX - 60, 120, 60); sun.target.position.set(CX, 0, 0); hemi.color.setHex(0x5a6aa8); hemi.intensity = 0.35; S.fog.color.setHex(0x0b1440); S.fog.near = 40; S.fog.far = 220; }
      if (z === 'D') { const c = new THREE.Color(0xff9a6a).lerp(new THREE.Color(0xffd9a0), dawnK); sun.color.copy(c); sun.intensity = 2.2 + dawnK * 0.8; const fx = han.position.x; sun.position.set(fx + 300, 90 + dawnK * 40, DZ - 400); sun.target.position.set(fx, 120, DZ); hemi.color.setHex(0xc8c0ff); hemi.intensity = 0.9 + dawnK * 0.3;
        S.fog.color.copy(new THREE.Color(0x7a6aa8).lerp(new THREE.Color(0xffc4a0), dawnK)); S.fog.near = 700; S.fog.far = 2600; }
      return z; };

    // ---------------------------------------------------------------- camera
    const shots = []; const shot = (a, b, p0, l0, p1 = p0, l1 = l0, o = {}) => shots.push({ a, b, p0, l0, p1, l1, ...o });
    const V3 = (v, t) => typeof v === 'function' ? v(t) : v;
    const HP = new THREE.Vector3(), SP = new THREE.Vector3();
    const fx = t => flightX(t);
    shot(0, B('hook2'), [-14, 5, 300], [-18, 42, 0], [-26, 9, 262], [-20, 40, 0]);                                                  // hook1: low valley, mountain + Burj stack
    shot(B('hook2'), B('src'), t => [fx(t) - 150, 185, DZ + 330], t => [fx(t) + 38, 162, DZ], t => [fx(t) + 90, 195, DZ + 340], t => [fx(t) + 38, 162, DZ]);   // hook2: tracking flight
    shot(B('src'), B('herb'), [CX + 3, 6.5, 12.5], [CX, 0.3, 0], [CX + 2, 4.8, 9.5], [CX, 0.3, 0]);                                 // src: night camp push-in
    shot(B('herb'), B('loc'), [14, 70, 26], [0, 63, 0], [10, 68, 20], [0, 64, 0]);                                                    // herb: glowing summit close
    shot(B('loc'), B('height'), [120, 260, 380], [0, 30, 0], [80, 230, 330], [0, 30, 0]);                                              // loc: aerial (map on top)
    shot(B('height'), B('lift'), [-14, 6, 250], [-18, 10, 0], [-14, 70, 250], [-18, 50, 0]);                                           // height: tilt up the ruler
    shot(B('lift'), B('giant'), [10, 30, 400], [-24, 50, 0], [0, 40, 370], [-26, 58, 0]);                                            // lift: wide, giant beside mountain
    shot(B('giant'), B('weight'), [HANA.x + 70, 3, HANA.z + 120], [HANA.x, 48, HANA.z], [HANA.x + 85, 4, HANA.z + 135], [HANA.x, 62, HANA.z]);   // giant: worm's-eye up at him
    shot(B('weight'), B('me'), t => [SP.x - 40, SP.y + 20, SP.z + 62], t => [SP.x, SP.y + 4, SP.z], t => [SP.x - 58, SP.y + 26, SP.z + 44], t => [SP.x, SP.y + 4, SP.z]);   // weight+humans: orbit the carried summit
    shot(B('me'), B('dist'), t => [HANA.x + 120, 30, HANA.z + 260], t => [HANA.x, 50, HANA.z], t => [HANA.x + 100, 34, HANA.z + 280], t => [HANA.x, 52, HANA.z]);
    shot(B('dist'), B('dawn'), t => [fx(t) - 60, 420, DZ + 320], t => [fx(t), 140, DZ], t => [fx(t) - 20, 360, DZ + 300], t => [fx(t), 145, DZ]);   // dist: high chase
    shot(B('dawn'), B('speed'), t => [fx(t) - 230, 185, DZ + 90], t => [fx(t) + 60, 158, DZ - 40], t => [fx(t) - 200, 180, DZ + 110], t => [fx(t) + 70, 158, DZ - 40]);   // dawn: behind him, sun ahead
    shot(B('speed'), B('food'), t => [fx(t) + 150, 125, DZ + 280], t => [fx(t) + 38, 160, DZ], t => [fx(t) + 80, 135, DZ + 310], t => [fx(t) + 38, 160, DZ]);   // speed: low fast side
    shot(B('food'), B('twist'), t => [fx(t) - 80, 260, DZ + 360], t => [fx(t) + 38, 155, DZ]);
    shot(B('twist'), B('why'), [VX + 22, VY + 4, VZ + 26], [VX - 10, VY + 6, VZ - 10], [VX + 16, VY + 3.5, VZ + 20], [VX - 12, VY + 8, VZ - 12]);  // village with the peak behind
    shot(B('why'), B('cta'), [VX + 16, VY + 3.5, VZ + 20], [VX - 12, VY + 8, VZ - 12], [VX + 30, VY + 6, VZ + 40], [0, 60, 0]);       // tilt from village to the peak
    shot(B('cta'), D + 1, t => [fx(t) + 170, 130, DZ + 300], t => [fx(t) + 38, 170, DZ], t => [fx(t) + 250, 160, DZ + 420], t => [fx(t) + 38, 170, DZ]);
    K.shoot = t => { let s = shots[shots.length - 1]; for (const q of shots) if (t >= q.a - 0.12 && t < q.b - 0.12) { s = q; break; }
      const k = (s.ease || K.ease)(prog(t, s.a, s.b)), p0 = V3(s.p0, t), p1 = V3(s.p1, t), l0 = V3(s.l0, t), l1 = V3(s.l1, t);
      K.cam.position.set(lerp(p0[0], p1[0], k), lerp(p0[1], p1[1], k), lerp(p0[2], p1[2], k)); K.cam.lookAt(lerp(l0[0], l1[0], k), lerp(l0[1], l1[1], k), lerp(l0[2], l1[2], k)); };

    // ---------------------------------------------------------------- per-frame update
    const SUMHOME = new THREE.Vector3(0, HB, 0), tmp = new THREE.Vector3();
    const update = t => {
      const z = setLook(t);
      A.visible = z === 'A'; C.visible = z === 'C'; Dg.visible = z === 'D';
      // Burj stack builds during the hook
      const bn = 1 + 7 * clamp((t - 0.3) / Math.max(0.5, E('hook1') - 1.0)); burjs.forEach((g, k) => { const s = clamp(bn - k); g.visible = t < B('hook2') && s > 0.01; g.scale.set(2.6, Math.max(0.01, K.easeBack(s)), 2.6); });
      // ruler grows during "height"
      const rk = eo(prog(t, B('height') + 0.2, F('height', 0.85))), rOn = t > B('height') - 0.15 && t < B('lift') - 0.12; ruler.visible = rOn; rulerBar.scale.y = Math.max(0.01, H * rk); ticks.forEach((m, i) => { m.visible = (i + 1) * 10 < H * rk; }); rulerTop.visible = rk > 0.99;
      // Hanuman pose + place
      const inA = z === 'A', liftA = B('lift'), standOn = inA && t >= liftA - 0.12 && t < B('twist') - 0.12;
      const appear = K.easeBack(prog(t, liftA, liftA + 0.7));
      han.visible = standOn || z === 'D';
      let raise = 1;
      if (standOn) { han.position.copy(HANA); han.rotation.set(0, 0.55, 0); hanP.rotation.set(0, 0, 0); han.scale.setScalar(HS * Math.max(0.001, t < liftA + 0.7 ? appear : 1));
        raise = t < F('lift', 0.5) ? 0 : eo(prog(t, F('lift', 0.5), F('lift', 0.8))); legs.forEach(l => { l.rotation.x = 0; }); armL.rotation.set(0, 0, 0.15); head.rotation.set(0.12 * raise - 0.08, 0, 0); }
      if (z === 'D') { han.position.set(fx(t), 150 + Math.sin(t * 1.3) * 2.5, DZ); han.rotation.set(0, Math.PI / 2, 0); hanP.rotation.set(1.15, 0, 0); han.scale.setScalar(HS);
        legs.forEach((l, i) => { l.rotation.x = 0.35 + Math.sin(t * 2 + i) * 0.05; }); armL.rotation.set(0.9, 0, 0.1); head.rotation.set(-0.85, 0, 0); raise = 1; }
      armR.rotation.set(0, 0, lerp(-0.25, 0.08, raise)); armR.rotation.x = lerp(0, -0.05, raise); if (z === 'D') armR.rotation.set(-0.15, 0, 0.05);
      fig.updateMatrixWorld(true); han.updateMatrixWorld(true); palm.getWorldPosition(HP);
      // summit: home on the mountain, or lifted onto the palm
      let onPalm = 0; if (z === 'D') onPalm = 1; else if (standOn) onPalm = eo(prog(t, F('lift', 0.5), F('lift', 0.92)));
      tmp.copy(HP); tmp.y += 0.1 * HS; SP.copy(SUMHOME).lerp(tmp, onPalm); if (onPalm > 0 && onPalm < 1) SP.y += Math.sin(onPalm * Math.PI) * 14;
      summit.position.copy(SP); summit.rotation.y = onPalm * 0.6; summit.visible = z !== 'C';
      // the top-1-km highlight
      const wOn = t > B('weight') - 0.1 && t < B('me'); sumWire.material.opacity = wOn ? 0.9 * fade(t, B('weight'), B('me') - 0.3) : 0; sumGlow.material.opacity = 0.22 * K.pulse(t, B('weight') + 0.1, E('humans') - B('weight')) + (onPalm > 0 && onPalm < 1 ? 0.25 * Math.sin(onPalm * Math.PI) : 0);
      // herbs glow on the summit until it is lifted
      herbs.forEach((h, i) => { const on = t < B('dist'); h.visible = on; const p = 0.8 + 0.35 * Math.sin(t * 4 + i * 1.7); h.scale.setScalar(p * (t > B('herb') - 0.2 && t < B('lift') ? 1.8 : 1)); });
      // camp torches flicker
      torchL.forEach((f, i) => f.scale.setScalar(0.85 + 0.3 * Math.abs(Math.sin(t * 13 + i * 2.1)))); C.userData.pl.intensity = 26 + 6 * Math.sin(t * 11); princeGlow.material.opacity = 0.04 + 0.02 * Math.sin(t * 2.5);
      // flight: streaks, dawn sun
      const spd = z === 'D' ? (t > B('speed') - 0.12 && t < B('twist') ? 1 : 0.45) : 0;
      streaks.forEach((m, i) => { m.visible = spd > 0; if (!m.visible) return; const r = K.rng(900 + i)(), r2 = K.rng(950 + i)(), len = 40 + r * 60; const ph = ((t * 260 * spd + i * 97) % 700); m.position.set(fx(t) + 350 - ph, 120 + r2 * 70, DZ - 60 + (i % 7) * 22); m.scale.set(len, 1, 1); m.material.opacity = 0.35 * spd; });
      const dawnK = z === 'D' && t >= B('dawn') - 0.12 ? ease(prog(t, B('dawn') - 0.12, F('dawn', 0.9))) : 0; dawnSun.visible = dawnK > 0.01; dawnSun.position.set(fx(t) + 1100, 60 + dawnK * 110, DZ - 700); dawnSun.lookAt(K.cam.position); dawnSun.material.color.setHex(0xffe6b0);
      // villagers idle
      villagers.forEach((g, i) => { g.position.y = VY + Math.abs(Math.sin(t * 2 + i)) * 0.02; });
      drawHud(t);
    };

    const sfx = [
      ['bass', 0.1, 0.8], ['riser', 0.2, 0.3], ...Array.from({ length: 7 }, (_, k) => ['tick', 0.3 + (k + 1) * Math.max(0.5, E('hook1') - 1.0) / 7, 0.45]), ['ding', E('hook1') - 0.2, 0.5],
      ...['hook2', 'src', 'herb', 'loc', 'height', 'lift', 'giant', 'weight', 'me', 'dist', 'dawn', 'food', 'twist', 'cta'].map(n => ['whoosh', B(n) - 0.22, 0.6]),
      ['chime', B('src') + 0.2, 0.5], ['chime', F('herb', 0.6), 0.45], ['ding', F('loc', 0.3), 0.5], ['pop', F('loc', 0.5), 0.4], ['riser', B('height') + 0.2, 0.35], ['ding', F('height', 0.85), 0.5],
      ['bass', F('lift', 0.5), 0.9], ['thud', F('lift', 0.9), 1.0], ['chime', B('giant') + 0.2, 0.55], ['riser', F('weight', 0.35), 0.35], ['kaching', F('weight', 0.95), 0.4], ['pop', F('humans', 0.3), 0.5], ['thud', F('humans', 0.6), 0.8],
      ['boing', B('me') + 0.3, 0.45], ['tick', F('dist', 0.3), 0.3], ['ding', F('dist', 0.9), 0.5], ['chime', B('dawn') + 0.2, 0.6], ['riser', B('speed') + 0.1, 0.35], ['zap', F('speed', 0.55), 0.4], ['beep', B('food') + 0.3, 0.5], ['buzz', F('food', 0.7), 0.3],
      ['bass', B('twist') + 0.1, 0.6], ['pop', F('twist', 0.55), 0.45], ['pop', B('why') + 0.2, 0.45], ['chime', B('cta') + 0.1, 0.6], ['pop', B('cta') + 0.25, 0.5], ['ding', B('cta') + 1.35, 0.55],
    ];
    return { duration: D, update, shots: [{ t: [0, 1], from: { pos: [0, 0, 1], look: [0, 0, 0] } }], sfx, watermark: false, endCard: false, music: {}, capFont: 'Fredoka Light', capMarginV: 520, capSize: 66 };
  },
};
