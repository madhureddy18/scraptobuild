// Dronagiri v2 — Zack D. Films style: one cinematic shot per line, smooth soft-lit 3D, no info cards (captions carry the words).
// 1 unit = 100 m in the Himalaya zone. Summit = 70.66 units (7,066 m); the top 1 km (10 units) is a separate piece that gets torn off.
// Zones: A Himalaya (origin) · C camp in Lanka (x=1600) · H herb slope close-up (z=1600) · B balance scale (x=-1600) · D flight (z=-1600).
window.SCENE = {
  setup: { bg: 0x0b1030, fog: [300, 1200], fov: 38, bloom: { strength: 0.32, radius: 0.55, threshold: 0.9 } },
  lines: window.STB_LINES,
  build(K, T) {
    const L = T.lines, IDX = {}; window.STB_LINES.forEach((l, i) => { IDX[l.id] = i; });
    const B = n => L[IDX[n]].t, E = n => L[IDX[n]].end, F = (n, f) => B(n) + (E(n) - B(n)) * f;
    const D = E('cta') + 1.8;
    const THREE = window.THREE, S = K.scene;
    const ease = K.ease, eo = K.easeOut, ei = K.easeIn, prog = K.prog, clamp = K.clamp, lerp = K.lerp;
    K.cam.far = 5000; K.cam.updateProjectionMatrix();
    K.renderer.shadowMap.enabled = false; K.renderer.toneMappingExposure = 1.1;
    const CUT = 0.1;                                            // cut lands just before each line starts
    const lineAt = t => { let id = L[0] ? window.STB_LINES[0].id : 'hook'; window.STB_LINES.forEach((l, i) => { if (t >= L[i].t - CUT) id = l.id; }); return id; };

    // ---------------------------------------------------------------- skies
    const sky = (stops, stars = 0, sunAt = null) => K.canvasTex(256, 1024, (x, w, h) => { const g = x.createLinearGradient(0, 0, 0, h); stops.forEach(([o, c]) => g.addColorStop(o, c)); x.fillStyle = g; x.fillRect(0, 0, w, h);
      const r = K.rng(77); for (let i = 0; i < stars; i++) { const sy = r() * h * 0.65, a = (1 - sy / (h * 0.65)) * (0.35 + r() * 0.65); x.fillStyle = `rgba(255,255,255,${a})`; x.fillRect(r() * w, sy, r() < 0.12 ? 2 : 1, r() < 0.12 ? 2 : 1); }
      if (sunAt) { const sg = x.createRadialGradient(w / 2, h * sunAt, 0, w / 2, h * sunAt, w * 1.1); sg.addColorStop(0, 'rgba(255,246,220,1)'); sg.addColorStop(0.08, 'rgba(255,210,140,0.85)'); sg.addColorStop(0.4, 'rgba(255,150,90,0.25)'); sg.addColorStop(1, 'rgba(255,140,80,0)'); x.fillStyle = sg; x.fillRect(0, 0, w, h); } });
    const SKY = {
      dusk: sky([[0, '#1b2a6b'], [0.5, '#5a63b8'], [0.8, '#f0a08a'], [1, '#ffd2a0']], 40),
      night: sky([[0, '#02040f'], [0.6, '#0a1236'], [1, '#1c2a5c']], 500),
      studio: sky([[0, '#151a2e'], [0.6, '#2a3150'], [1, '#3c4468']]),
      dawn: sky([[0, '#3a5bb8'], [0.45, '#9a8ad8'], [0.75, '#ffb08a'], [1, '#ffe2a8']], 0, 0.8),
      day: sky([[0, '#2a64d6'], [0.6, '#8cc4ff'], [1, '#eaf4ff']]),
    };
    S.background = SKY.dusk;
    const hemi = new THREE.HemisphereLight(0xcfd8ff, 0x3a3048, 0.9); S.add(hemi);
    const key = new THREE.DirectionalLight(0xffd2a8, 2.6); S.add(key); S.add(key.target);
    const rim = new THREE.DirectionalLight(0x9fb8ff, 1.3); S.add(rim); S.add(rim.target);

    // ---------------------------------------------------------------- materials + safe geometry
    const mat = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.75, metalness: 0 }, o));
    const ROCK = mat(0xffffff, { vertexColors: true, roughness: 0.92 });
    const GOLD = mat(0xffc24a, { roughness: 0.32, metalness: 0.85, emissive: 0x3a2200, emissiveIntensity: 0.4 });
    const fixNormals = g => { const n = g.attributes.normal; for (let i = 0; i < n.count; i++) { const x = n.getX(i), y = n.getY(i), z = n.getZ(i), l = Math.hypot(x, y, z); if (!(l > 1e-6)) n.setXYZ(i, 0, 1, 0); else n.setXYZ(i, x / l, y / l, z / l); } n.needsUpdate = true; return g; };
    const mesh = (geo, m, x = 0, y = 0, z = 0, parent = S) => { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); parent.add(o); return o; };
    // smooth jagged mountain: open-ended so no zero-area caps; shared vertices jittered together; normals sanitised (NaN-free => no bloom blocks)
    const crag = (rTop, rBot, h, seg, hseg, seed, amp, keepRings = true) => { const g = new THREE.CylinderGeometry(rTop, rBot, h, seg, hseg, true); const p = g.attributes.position, r = K.rng(seed), cache = {};
      for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i), k = `${x.toFixed(2)},${y.toFixed(2)},${z.toFixed(2)}`;
        if (keepRings && (Math.abs(y - h / 2) < 1e-4 || Math.abs(y + h / 2) < 1e-4)) continue; if (Math.hypot(x, z) < 1e-3) continue;
        if (!cache[k]) cache[k] = [(r() - 0.5) * amp, (r() - 0.5) * amp * 0.5, (r() - 0.5) * amp]; const d = cache[k]; p.setXYZ(i, x + d[0], y + d[1], z + d[2]); }
      g.computeVertexNormals(); return fixNormals(g); };
    const snowColor = (geo, snowY, jit = 3, seed = 1) => { const p = geo.attributes.position, c = new Float32Array(p.count * 3), r = K.rng(seed);
      for (let i = 0; i < p.count; i++) { const y = p.getY(i) + (r() - 0.5) * jit, s = clamp((y - snowY) / 4 + 0.5), g = 0.36 + r() * 0.06;
        c[i * 3] = lerp(g * 1.02, 0.95, s); c[i * 3 + 1] = lerp(g * 0.94, 0.96, s); c[i * 3 + 2] = lerp(g * 1.06, 1.0, s); } geo.setAttribute('color', new THREE.BufferAttribute(c, 3)); };

    // ================================================================ CHARACTERS
    const SPH = (r, m, x, y, z, p, sx = 1, sy = 1, sz = 1) => { const o = mesh(new THREE.SphereGeometry(r, 28, 20), m, x, y, z, p); o.scale.set(sx, sy, sz); return o; };
    const CAP = (r, l, m, x, y, z, p) => mesh(new THREE.CapsuleGeometry(r, l, 8, 18), m, x, y, z, p);
    const limb = (parent, x, y, z, r1, l1, r2, l2, m, end) => {         // shoulder/hip group -> upper -> joint group -> lower -> end
      const a = new THREE.Group(); a.position.set(x, y, z); parent.add(a); CAP(r1, l1, m, 0, -l1 / 2 - r1 * 0.3, 0, a);
      const b = new THREE.Group(); b.position.set(0, -l1 - r1 * 0.6, 0); a.add(b); CAP(r2, l2, m, 0, -l2 / 2 - r2 * 0.3, 0, b);
      const tip = new THREE.Group(); tip.position.set(0, -l2 - r2 * 0.7, 0); b.add(tip); if (end) end(tip); return { a, b, tip }; };
    const makeHanuman = () => {
      const root = new THREE.Group(), pitch = new THREE.Group(), fig = new THREE.Group(); root.add(pitch); pitch.add(fig); S.add(root);
      const SK = mat(0xd9602a, { roughness: 0.55 }), FACE = mat(0xf2b884, { roughness: 0.6 }), DHOTI = mat(0xc4161c, { roughness: 0.7 }), WHITE = mat(0xffffff, { roughness: 0.3 }), BLK = mat(0x120a08, { roughness: 0.3 });
      // hips + dhoti
      SPH(0.27, DHOTI, 0, 1.0, 0, fig, 1.15, 0.8, 0.9); const dh = mesh(new THREE.CylinderGeometry(0.25, 0.4, 0.42, 24, 1, true), DHOTI, 0, 0.86, 0, fig); dh.material = DHOTI;
      mesh(new THREE.TorusGeometry(0.27, 0.035, 10, 32), GOLD, 0, 1.12, 0, fig).rotation.x = Math.PI / 2;
      // torso: chest + abs
      SPH(0.25, SK, 0, 1.3, 0.02, fig, 1.15, 0.85, 0.85); SPH(0.3, SK, 0, 1.55, 0.03, fig, 1.25, 0.85, 0.85);
      for (const s of [-1, 1]) SPH(0.13, SK, s * 0.36, 1.66, 0, fig, 1, 1, 1);        // shoulders
      mesh(new THREE.TorusGeometry(0.2, 0.03, 10, 30), GOLD, 0, 1.74, 0.03, fig).rotation.x = Math.PI / 2.3;   // necklace
      const sash = mesh(new THREE.TorusGeometry(0.33, 0.022, 8, 40), GOLD, 0, 1.46, 0.02, fig); sash.rotation.set(Math.PI / 2, 0.6, 0); sash.scale.set(1, 0.78, 1);
      // head
      const head = new THREE.Group(); head.position.set(0, 1.98, 0.02); fig.add(head);
      SPH(0.2, SK, 0, 0, 0, head); SPH(0.13, FACE, 0, -0.06, 0.12, head, 1.15, 0.85, 0.8);
      for (const s of [-1, 1]) { SPH(0.045, WHITE, s * 0.075, 0.05, 0.16, head); SPH(0.022, BLK, s * 0.075, 0.05, 0.198, head); const br = CAP(0.012, 0.07, BLK, s * 0.075, 0.11, 0.175, head); br.rotation.z = Math.PI / 2 + s * 0.25;
        SPH(0.07, SK, s * 0.2, 0.0, -0.01, head, 0.6, 1, 0.9); SPH(0.03, GOLD, s * 0.22, -0.08, 0.0, head); }
      SPH(0.03, BLK, 0, -0.02, 0.215, head);
      const crown = new THREE.Group(); crown.position.set(0, 0.14, 0); head.add(crown);
      mesh(new THREE.CylinderGeometry(0.19, 0.21, 0.14, 28), GOLD, 0, 0.05, 0, crown); mesh(new THREE.CylinderGeometry(0.13, 0.18, 0.16, 28), GOLD, 0, 0.19, 0, crown);
      mesh(new THREE.ConeGeometry(0.11, 0.34, 28), GOLD, 0, 0.43, 0, crown); SPH(0.04, mat(0xd01030, { roughness: 0.2 }), 0, 0.08, 0.2, crown);
      for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; const sp = mesh(new THREE.ConeGeometry(0.035, 0.12, 10), GOLD, Math.sin(a) * 0.19, 0.17, Math.cos(a) * 0.19, crown); }
      const halo = new THREE.Mesh(new THREE.RingGeometry(0.36, 0.42, 64), new THREE.MeshBasicMaterial({ color: 0xffd36a, transparent: true, opacity: 0.6, side: THREE.DoubleSide, depthWrite: false })); halo.position.set(0, 0.15, -0.16); head.add(halo);
      // arms (right one carries the mountain)
      const armR = limb(fig, 0.4, 1.68, 0, 0.085, 0.36, 0.075, 0.32, SK, tip => SPH(0.085, SK, 0, 0, 0, tip, 1, 0.85, 0.7));
      const armL = limb(fig, -0.4, 1.68, 0, 0.085, 0.36, 0.075, 0.32, SK, tip => { SPH(0.085, SK, 0, 0, 0, tip, 1, 0.85, 0.7);
        const g = new THREE.Group(); tip.add(g); g.position.set(0, 0, 0.02); mesh(new THREE.CylinderGeometry(0.028, 0.028, 1.0, 12), GOLD, 0, 0.2, 0, g); SPH(0.22, GOLD, 0, 0.75, 0, g);
        for (const y of [0.66, 0.84]) mesh(new THREE.TorusGeometry(0.2, 0.025, 8, 28), GOLD, 0, y, 0, g).rotation.x = Math.PI / 2; mesh(new THREE.ConeGeometry(0.06, 0.18, 12), GOLD, 0, 1.02, 0, g); armL_mace = g; });
      for (const a of [armR, armL]) mesh(new THREE.TorusGeometry(0.09, 0.022, 8, 24), GOLD, 0, -0.08, 0, a.a).rotation.x = Math.PI / 2;
      const palm = new THREE.Object3D(); palm.position.set(0, -0.1, 0); armR.tip.add(palm);
      // legs
      const legs = [-1, 1].map(s => limb(fig, s * 0.15, 0.98, 0, 0.11, 0.38, 0.09, 0.36, SK, tip => { SPH(0.09, SK, 0, 0, 0.06, tip, 0.9, 0.6, 1.5); mesh(new THREE.TorusGeometry(0.08, 0.02, 8, 20), GOLD, 0, 0.1, 0, tip).rotation.x = Math.PI / 2; }));
      // tail
      const tail = mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([[0, 0.95, -0.22], [0.05, 0.7, -0.6], [0.2, 1.0, -0.95], [0.15, 1.6, -1.0], [-0.05, 2.0, -0.78], [-0.15, 2.1, -0.55]].map(p => new THREE.Vector3(...p))), 48, 0.05, 12), SK, 0, 0, 0, fig);
      return { root, pitch, fig, head, armR, armL, legs, palm };
    };
    let armL_mace = null;
    const makeHuman = (skinC, clothC, { crown = true, hairLong = true } = {}) => {
      const root = new THREE.Group(), fig = new THREE.Group(); root.add(fig); S.add(root);
      const SK = mat(skinC, { roughness: 0.55 }), CL = mat(clothC, { roughness: 0.7 }), HAIR = mat(0x15100c, { roughness: 0.5 }), BLK = mat(0x0a0606);
      SPH(0.22, CL, 0, 0.98, 0, fig, 1.1, 0.75, 0.85); mesh(new THREE.CylinderGeometry(0.2, 0.32, 0.5, 24, 1, true), CL, 0, 0.8, 0, fig);
      SPH(0.22, SK, 0, 1.3, 0, fig, 1.05, 1.1, 0.75); SPH(0.24, SK, 0, 1.5, 0, fig, 1.15, 0.7, 0.75);
      mesh(new THREE.TorusGeometry(0.17, 0.025, 8, 28), GOLD, 0, 1.6, 0.02, fig).rotation.x = Math.PI / 2.3;
      const uttar = mesh(new THREE.TorusGeometry(0.28, 0.03, 8, 36), mat(0xffb020), 0, 1.4, 0, fig); uttar.rotation.set(Math.PI / 2, 0.55, 0); uttar.scale.set(1, 0.75, 1);
      const head = new THREE.Group(); head.position.set(0, 1.84, 0); fig.add(head); SPH(0.16, SK, 0, 0, 0, head, 0.92, 1.05, 0.95);
      for (const s of [-1, 1]) SPH(0.02, BLK, s * 0.055, 0.02, 0.145, head);
      SPH(0.168, HAIR, 0, 0.04, -0.02, head, 0.95, 0.9, 0.95).scale.set(0.95, 0.85, 0.95); if (hairLong) SPH(0.13, HAIR, 0, -0.12, -0.12, head, 1.2, 1.1, 0.6);
      if (crown) { mesh(new THREE.CylinderGeometry(0.13, 0.15, 0.12, 24), GOLD, 0, 0.17, 0, head); mesh(new THREE.ConeGeometry(0.1, 0.28, 24), GOLD, 0, 0.37, 0, head); }
      const armR = limb(fig, 0.3, 1.55, 0, 0.065, 0.3, 0.058, 0.28, SK, tip => SPH(0.065, SK, 0, 0, 0, tip)); const armL = limb(fig, -0.3, 1.55, 0, 0.065, 0.3, 0.058, 0.28, SK, tip => SPH(0.065, SK, 0, 0, 0, tip));
      const legs = [-1, 1].map(s => limb(fig, s * 0.12, 0.9, 0, 0.085, 0.36, 0.07, 0.34, CL, tip => SPH(0.07, SK, 0, 0, 0.05, tip, 0.9, 0.6, 1.5)));
      return { root, fig, head, armR, armL, legs };
    };

    // ================================================================ ZONE A: Himalaya
    const A = new THREE.Group(); S.add(A);
    { const g = new THREE.CircleGeometry(900, 64); const gm = mat(0x5a5468, { roughness: 1 }); const o = mesh(g, gm, 0, 0, 0, A); o.rotation.x = -Math.PI / 2; }
    const R0 = 40, H = 70.66, HB = 60.66, rAt = y => R0 * (1 - y / H);
    const baseGeo = crag(rAt(HB), R0, HB, 28, 18, 5, 4.2); baseGeo.translate(0, HB / 2, 0); snowColor(baseGeo, 40, 7, 3); mesh(baseGeo, ROCK, 0, 0, 0, A);
    const summit = new THREE.Group(); S.add(summit);
    const sumGeo = crag(0, rAt(HB), H - HB, 28, 6, 9, 0.9); sumGeo.translate(0, (H - HB) / 2, 0); snowColor(sumGeo, -10, 0, 4); mesh(sumGeo, ROCK, 0, 0, 0, summit);
    const sumCap = mesh(new THREE.CircleGeometry(rAt(HB) * 1.02, 28), mat(0x4a3a36, { roughness: 1 }), 0, 0.02, 0, summit); sumCap.rotation.x = Math.PI / 2;      // torn underside
    const crack = mesh(new THREE.TorusGeometry(rAt(HB) * 1.05, 0.35, 10, 64), new THREE.MeshBasicMaterial({ color: 0xffa040, transparent: true, opacity: 0 }), 0, HB, 0, A); crack.rotation.x = Math.PI / 2;
    // ranges
    { const r = K.rng(31); for (let i = 0; i < 46; i++) { const a = r() * Math.PI * 2, d = 120 + r() * 420, h = 24 + r() * 42, rad = 26 + r() * 32; const x = Math.cos(a) * d, z = Math.sin(a) * d;
        if (x > 30 && x < 130 && z > 20 && z < 120) continue; if (x < -10 && x > -150 && z > -30 && z < 90) continue; if (z > 50 && Math.abs(x) < 260) continue;
        const g = crag(0, rad, h, 18, 8, 100 + i, rad * 0.12); g.translate(0, h / 2, 0); snowColor(g, h * 0.6, 5, 200 + i); mesh(g, ROCK, x, 0, z, A); } }
    // debris for the tear
    const NDB = 160, debris = new THREE.InstancedMesh(new THREE.DodecahedronGeometry(1, 0), mat(0x8a8090, { roughness: 1 }), NDB); A.add(debris);
    const dbr = K.rng(44), dbp = Array.from({ length: NDB }, () => ({ a: dbr() * 6.28, r: rAt(HB) * (0.8 + dbr() * 0.5), vy: 4 + dbr() * 10, vo: 3 + dbr() * 8, s: 0.25 + dbr() * 0.9 }));
    const dust = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 16), new THREE.MeshBasicMaterial({ color: 0xe8e0f0, transparent: true, opacity: 0, depthWrite: false })); dust.position.y = HB; A.add(dust);
    // village terrace
    const VX = 74, VZ = 66, VY = 36;
    { const g = crag(26, 34, VY, 22, 6, 61, 2.5); g.translate(0, VY / 2, 0); snowColor(g, 999, 0, 62); mesh(g, ROCK, VX, 0, VZ, A); const m = mesh(new THREE.CircleGeometry(26, 40), mat(0x5f7d3c, { roughness: 1 }), VX, VY + 0.05, VZ, A); m.rotation.x = -Math.PI / 2; }
    { const r = K.rng(64), STONE = mat(0x9a9286), SLATE = mat(0x4b505e), WOOD = mat(0x6b4426), WIN = new THREE.MeshBasicMaterial({ color: 0xffc46a });
      for (let i = 0; i < 28; i++) { const a = r() * 6.28, d = 3 + r() * 16, g = new THREE.Group(); g.position.set(VX + Math.cos(a) * d, VY, VZ + Math.sin(a) * d); g.rotation.y = r() * 6.28; A.add(g);
        const w = 1.1 + r() * 0.6, dd = 0.9 + r() * 0.4, h = 0.7 + r() * 0.3; mesh(new THREE.BoxGeometry(w, h, dd), STONE, 0, h / 2, 0, g); const roof = mesh(new THREE.ConeGeometry(Math.hypot(w, dd) * 0.62, 0.5, 4, 1, true), SLATE, 0, h + 0.25, 0, g); roof.rotation.y = Math.PI / 4; roof.scale.z = dd / w;
        mesh(new THREE.BoxGeometry(0.22, 0.42, 0.05), WOOD, 0, 0.21, dd / 2 + 0.01, g); mesh(new THREE.BoxGeometry(0.2, 0.18, 0.04), WIN, w * 0.28, h * 0.62, dd / 2 + 0.01, g); }
      for (let i = 0; i < 36; i++) { const a = r() * 6.28, d = 18 + r() * 7; mesh(new THREE.ConeGeometry(0.6, 2.2, 10, 1, true), mat(0x234a2e), VX + Math.cos(a) * d, VY + 1.1, VZ + Math.sin(a) * d, A); } }
    const villagers = Array.from({ length: 8 }, (_, i) => { const h = makeHuman([0xb07a52, 0xa06a44][i % 2], [0x6b4f8a, 0x8a3b2a, 0x2f5f7a, 0x7a6a2a][i % 4], { crown: false, hairLong: i % 2 === 0 }); const r = K.rng(400 + i), a = r() * 6.28, d = 2 + r() * 9;
      h.root.position.set(VX + Math.cos(a) * d, VY, VZ + Math.sin(a) * d); h.root.scale.setScalar(0.42); h.root.rotation.y = r() * 6.28; A.add(h.root); return h; });

    // ================================================================ HANUMAN
    const han = makeHanuman(); const HS = 40, HANA = new THREE.Vector3(-58, 0, 22);

    // ================================================================ ZONE C: camp in Lanka (night -> dawn)
    const CX = 1600, C = new THREE.Group(); C.position.set(CX, 0, 0); S.add(C);
    { const o = mesh(new THREE.CircleGeometry(200, 48), mat(0x6b5a46, { roughness: 1 }), 0, 0, 0, C); o.rotation.x = -Math.PI / 2; const sea = mesh(new THREE.PlaneGeometry(4000, 4000), mat(0x16305e, { roughness: 0.3, metalness: 0.2 }), 0, -0.4, 0, C); sea.rotation.x = -Math.PI / 2; }
    const torchFl = [], torchLights = [];
    { const r = K.rng(5), TENT = mat(0x7a6448), FLAG = mat(0xd96a1a);
      for (let i = 0; i < 18; i++) { const a = r() * 6.28, d = 10 + r() * 30; const t = mesh(new THREE.ConeGeometry(1.6 + r(), 2.4 + r(), 6, 1, true), TENT, Math.cos(a) * d, 1.2, -6 - Math.abs(Math.sin(a)) * d, C); t.rotation.y = r(); mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.2, 6), mat(0x3a2a1a), t.position.x, 3, t.position.z, C); }
      for (let i = 0; i < 6; i++) { const a = i / 6 * 6.28 + 0.4, d = 4.2, x = Math.cos(a) * d, z = Math.sin(a) * d - 1; mesh(new THREE.CylinderGeometry(0.05, 0.07, 1.8, 8), mat(0x3a2a1a), x, 0.9, z, C);
        const fl = new THREE.Mesh(new THREE.SphereGeometry(0.15, 14, 10), new THREE.MeshBasicMaterial({ color: 0xffa040 })); fl.position.set(x, 1.9, z); C.add(fl); torchFl.push(fl); }
      for (const [x, z] of [[2.5, 1.5], [-2.5, -1]]) { const pl = new THREE.PointLight(0xff8a3a, 14, 14, 1.5); pl.position.set(x, 2.2, z); C.add(pl); torchLights.push(pl); } }
    mesh(new THREE.BoxGeometry(1.3, 0.08, 2.8), mat(0x9a7a4a), -0.4, 0.04, 0, C);
    const lak = makeHuman(0xe0a878, 0xe2b13a); lak.root.position.set(-0.9, 0.18, 0); C.add(lak.root);
    const rama = makeHuman(0x4a6a9a, 0xf0b020); rama.root.position.set(0.3, 0, 1.0); rama.root.rotation.y = Math.PI; C.add(rama.root);
    const vanaras = Array.from({ length: 5 }, (_, i) => { const v = makeHuman(0x7a5a3a, [0x6a4a2a, 0x8a5a2a][i % 2], { crown: false, hairLong: false }); const a = -0.8 + i * 0.45, d = 3.0; v.root.position.set(Math.cos(a) * d, 0, Math.sin(a) * d); v.root.rotation.y = Math.atan2(-v.root.position.x, -v.root.position.z); C.add(v.root); return v; });
    const herbGlow = new THREE.PointLight(0x9dffb0, 0, 6, 1.5); herbGlow.position.set(0, 1, 0); C.add(herbGlow);

    // ================================================================ ZONE H: herb slope close-up
    const HZ = 1600, Hg = new THREE.Group(); Hg.position.set(0, 0, HZ); S.add(Hg);
    { const g = new THREE.PlaneGeometry(80, 80, 40, 40); const p = g.attributes.position, r = K.rng(12); for (let i = 0; i < p.count; i++) p.setZ(i, (r() - 0.5) * 0.25 + Math.max(0, p.getY(i) - 8) * 0.3); g.computeVertexNormals(); fixNormals(g);
      const o = mesh(g, mat(0x6a6676, { roughness: 1 }), 0, 0, 0, Hg); o.rotation.x = -Math.PI / 2;
      for (let i = 0; i < 40; i++) { const rx = (r() - 0.5) * 30, rz = (r() - 0.5) * 30 - 6, rs = 0.4 + r() * 1.4; if (Math.abs(rx) < 9 && rz > -7) continue; const rk = mesh(new THREE.DodecahedronGeometry(rs, 1), mat(0x6d6a78, { roughness: 1 }), rx, 0, rz, Hg); rk.scale.y = 0.6; }
      for (let i = 0; i < 120; i++) { const sn = mesh(new THREE.SphereGeometry(0.6 + r(), 12, 8), mat(0xdfe4f4), (r() - 0.5) * 40, -0.3, (r() - 0.5) * 30 - 18, Hg); sn.scale.y = 0.25; } }
    const HERBC = [0x9dffb0, 0xfff27a, 0x8ae9ff, 0xffb0f0], herbBulbs = [];
    for (let i = 0; i < 26; i++) { const r = K.rng(700 + i), x = (r() - 0.5) * 5, z = (r() - 0.5) * 3 + 1.2, g = new THREE.Group(); g.position.set(x, 0, z); g.scale.setScalar(1.9); Hg.add(g);
      mesh(new THREE.CylinderGeometry(0.02, 0.03, 0.5, 6), mat(0x2f6a32), 0, 0.25, 0, g); for (let k = 0; k < 3; k++) { const lf = SPH(0.12, mat(0x3f8a3a), Math.cos(k * 2.1) * 0.1, 0.18 + k * 0.08, Math.sin(k * 2.1) * 0.1, g, 1, 0.25, 0.5); lf.rotation.y = k * 2.1; }
      const b = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 10), new THREE.MeshBasicMaterial({ color: HERBC[i % 4] })); b.position.y = 0.52; g.add(b); herbBulbs.push(b); }
    { const pl = new THREE.PointLight(0xb0ffd0, 2.5, 8, 1.8); pl.position.set(0, 1.2, 1.5); Hg.add(pl); }

    // ================================================================ ZONE B: balance scale studio
    const BX = -1600, Bg = new THREE.Group(); Bg.position.set(BX, 0, 0); S.add(Bg);
    { const o = mesh(new THREE.CircleGeometry(300, 48), mat(0x2a3048, { roughness: 0.9 }), 0, 0, 0, Bg); o.rotation.x = -Math.PI / 2; }
    mesh(new THREE.CylinderGeometry(1.2, 2.2, 1, 32), GOLD, 0, 0.5, 0, Bg); mesh(new THREE.CylinderGeometry(0.45, 0.6, 22, 24), GOLD, 0, 11, 0, Bg); SPH(1, GOLD, 0, 22.4, 0, Bg);
    const beam = new THREE.Group(); beam.position.set(0, 22, 0); Bg.add(beam); mesh(new THREE.BoxGeometry(21, 0.6, 0.8), GOLD, 0, 0, 0, beam);
    const pans = [-1, 1].map(s => { const hook = new THREE.Object3D(); hook.position.set(s * 10, 0, 0); beam.add(hook); const pan = new THREE.Group(); Bg.add(pan);
      const dish = mesh(new THREE.CylinderGeometry(6, 4.8, 0.8, 40, 1, true), GOLD, 0, 0, 0, pan); mesh(new THREE.CircleGeometry(4.8, 40), GOLD, 0, -0.39, 0, pan).rotation.x = -Math.PI / 2;
      const chains = [0, 1, 2].map(k => { const c = mesh(new THREE.CylinderGeometry(0.06, 0.06, 1, 6), GOLD, 0, 0, 0, Bg); c.userData.k = k; return c; }); return { hook, pan, chains }; });
    const NCR = 900, crowd = new THREE.InstancedMesh(new THREE.CapsuleGeometry(0.11, 0.3, 4, 8), mat(0xffffff, { roughness: 0.6 }), NCR); pans[0].pan.add(crowd);
    { const r = K.rng(81), o = new THREE.Object3D(), col = new THREE.Color(); for (let i = 0; i < NCR; i++) { const a = r() * 6.28, d = Math.sqrt(r()) * 4.4, layer = Math.floor(i / 300); o.position.set(Math.cos(a) * d, 0.3 + layer * 0.55, Math.sin(a) * d); o.updateMatrix(); crowd.setMatrixAt(i, o.matrix);
        col.setHSL(r(), 0.5, 0.55); crowd.setColorAt(i, col); } }
    const bPeak = new THREE.Group(); pans[1].pan.add(bPeak); { const g = sumGeo.clone(); const m = mesh(g, ROCK, 0, 0, 0, bPeak); bPeak.scale.setScalar(0.62); bPeak.position.y = 0.2; }
    { const sl = new THREE.SpotLight(0xffe2c0, 400, 120, 0.6, 0.6, 1.4); sl.position.set(10, 60, 40); sl.target.position.set(0, 14, 0); Bg.add(sl); Bg.add(sl.target); }

    // ================================================================ ZONE D: flight over India at night / dawn
    const DZ = -1600, Dg = new THREE.Group(); Dg.position.set(0, 0, DZ); S.add(Dg);
    { const o = mesh(new THREE.PlaneGeometry(6000, 6000), mat(0x10182c, { roughness: 1 }), 0, 0, 0, Dg); o.rotation.x = -Math.PI / 2;
      const sea = mesh(new THREE.PlaneGeometry(6000, 2400), mat(0x0c1e44, { roughness: 0.3, metalness: 0.3 }), 0, 0.2, -1700, Dg); sea.rotation.x = -Math.PI / 2; }
    const NLT = 2600, lights = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 0.5, 1), new THREE.MeshBasicMaterial({ color: 0xffc070 }), NLT); Dg.add(lights);
    { const r = K.rng(90), o = new THREE.Object3D(); const towns = Array.from({ length: 70 }, () => [-900 + r() * 3600, -900 + r() * 1300, 4 + r() * 18]);
      for (let i = 0; i < NLT; i++) { const t = towns[i % towns.length], a = r() * 6.28, d = Math.pow(r(), 1.5) * t[2]; o.position.set(t[0] + Math.cos(a) * d, 0.3, t[1] + Math.sin(a) * d); o.scale.setScalar(0.6 + r() * 1.4); o.updateMatrix(); lights.setMatrixAt(i, o.matrix); } }
    const CLOUD = mat(0xc8d0f0, { roughness: 1, emissive: 0x3a4478, emissiveIntensity: 0.8 });
    const NCL = 260, clouds = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 2), CLOUD, NCL); Dg.add(clouds);
    { const r = K.rng(8), o = new THREE.Object3D(); for (let i = 0; i < NCL; i++) { o.position.set(-900 + r() * 3600, 70 + r() * 30, -500 + r() * 800); const s = 10 + r() * 20; o.scale.set(s * (1.3 + r() * 0.6), s * 0.65, s); o.rotation.y = r() * 6; o.updateMatrix(); clouds.setMatrixAt(i, o.matrix); } }
    const streaks = Array.from({ length: 40 }, () => { const m = new THREE.Mesh(new THREE.BoxGeometry(1, 0.18, 0.18), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false })); S.add(m); return m; });
    const sunDisc = new THREE.Mesh(new THREE.CircleGeometry(70, 64), new THREE.MeshBasicMaterial({ color: 0xfff0c8, fog: false })); S.add(sunDisc);
    const flightX = t => -200 + (t - B('dist')) * 14;

    // ================================================================ HUD: only the end follow button (Zack D style: captions do the talking)
    const hudTex = K.canvasTex(1080, 1920, () => {});
    const hudScene = new THREE.Scene(), hudCam = new THREE.OrthographicCamera(-540, 540, 960, -960, -10, 10);
    hudScene.add(new THREE.Mesh(new THREE.PlaneGeometry(1080, 1920), new THREE.MeshBasicMaterial({ map: hudTex, transparent: true, toneMapped: false, depthTest: false })));
    K.draw = () => { K.composer.render(); const r = K.renderer; r.autoClear = false; r.clearDepth(); r.render(hudScene, hudCam); r.autoClear = true; };
    const drawHud = t => hudTex.redraw((x, W, Hh) => {
      const vg = x.createRadialGradient(W / 2, Hh * 0.46, Hh * 0.38, W / 2, Hh / 2, Hh * 0.78); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.42)'); x.fillStyle = vg; x.fillRect(0, 0, W, Hh);
      const fa = B('cta') + 0.3; if (t > fa) { const k = K.easeBack(prog(t, fa, fa + 0.35)), press = K.pulse(t, fa + 1.1, 0.3), done = t > fa + 1.25, w = 520 - press * 24;
        x.save(); x.translate(540, 1660); x.scale(k, k); x.translate(-540, -1660); x.shadowColor = 'rgba(0,0,0,0.5)'; x.shadowBlur = 24; x.fillStyle = done ? '#262a3a' : '#ff3b5c'; K.rrect(x, 540 - w / 2, 1605, w, 110, 55); x.fill(); x.shadowBlur = 0;
        x.font = '700 54px "Oswald"'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = '#fff'; x.fillText(done ? 'FOLLOWING ✓' : '+ FOLLOW', 540, 1662);
        const hp = eo(prog(t, fa + 0.35, fa + 1.05)), hx = 760 - hp * 200, hy = 1810 - hp * 130; x.fillStyle = 'rgba(255,255,255,0.95)'; x.strokeStyle = '#111'; x.lineWidth = 5; x.beginPath(); x.arc(hx, hy, 30 - press * 6, 0, 7); x.fill(); x.stroke(); x.restore(); }
      // fast white flash on the tear
      const fl = K.pulse(t, F('tear', 0.72), 0.35); if (fl > 0) { x.fillStyle = `rgba(255,240,220,${fl * 0.55})`; x.fillRect(0, 0, W, Hh); }
    });

    // ---------------------------------------------------------------- per-line look (zone, sky, lights)
    const ZONE = { hook: 'A', loc: 'A', war: 'C', sent: 'C', herbs: 'H', tear: 'A', weight: 'A', humans: 'B', dist: 'D', speed: 'D', wake: 'C', village: 'A', cta: 'D' };
    const setLook = (t, id) => { const z = ZONE[id]; A.visible = z === 'A'; C.visible = z === 'C'; Hg.visible = z === 'H'; Bg.visible = z === 'B'; Dg.visible = z === 'D';
      const L2 = (sky, kc, ki, kp, rc, ri, hc, hi, fogc, fn, ff, tgt) => { S.background = sky; key.color.setHex(kc); key.intensity = ki; key.position.set(...kp); key.target.position.set(...tgt); rim.color.setHex(rc); rim.intensity = ri; rim.position.set(tgt[0] - kp[0] + tgt[0], kp[1] * 0.6, tgt[2] - (kp[2] - tgt[2])); rim.target.position.set(...tgt); hemi.color.setHex(hc); hemi.intensity = hi; S.fog.color.setHex(fogc); S.fog.near = fn; S.fog.far = ff; };
      if (z === 'A' && id === 'village') L2(SKY.day, 0xfff4e4, 2.8, [-160, 220, 160], 0xbfd8ff, 0.8, 0xe0ecff, 1.1, 0xd6e6ff, 300, 1400, [0, 20, 0]);
      else if (z === 'A') L2(SKY.dusk, 0xffc49a, 2.6, [-180, 110, 170], 0x8fa8ff, 1.4, 0xc8c8ff, 0.85, 0x8a7aa8, 320, 1300, [0, 30, 0]);
      if (z === 'C') { const dawn = id === 'wake'; L2(dawn ? SKY.dawn : SKY.night, dawn ? 0xffc89a : 0x7088ff, dawn ? 2.2 : 0.35, [CX - 30, 25, 40], dawn ? 0xffe0b0 : 0x5060c0, dawn ? 1.0 : 0.5, dawn ? 0xffe0d0 : 0x40508a, dawn ? 0.9 : 0.3, dawn ? 0xffc8a8 : 0x0a1236, 30, 260, [CX, 0, 0]); }
      if (z === 'H') L2(SKY.dusk, 0xffc8a0, 2.0, [-20, 30, HZ + 30], 0x9fb8ff, 1.2, 0xcfd8ff, 0.8, 0x8a7aa8, 40, 260, [0, 0, HZ]);
      if (z === 'B') L2(SKY.studio, 0xffe8d0, 1.6, [BX + 30, 60, 50], 0x8fb0ff, 1.6, 0xb0b8e0, 0.6, 0x232840, 200, 900, [BX, 14, 0]);
      if (z === 'D') { const dawn = id === 'cta'; L2(dawn ? SKY.dawn : SKY.night, dawn ? 0xffd2a0 : 0x8aa0ff, dawn ? 2.6 : 1.8, [flightX(t) + 300, 220, DZ + 200], dawn ? 0xffe0c0 : 0x7a90ff, 1.6, dawn ? 0xffe0d0 : 0x7080c0, dawn ? 1.0 : 0.95, dawn ? 0xf0b8a0 : 0x0a1236, 500, 3000, [flightX(t), 120, DZ]); }
      return z; };

    // ---------------------------------------------------------------- camera: one move per line
    const SP = new THREE.Vector3(), HP = new THREE.Vector3();
    const SH = {
      hook: [[-6, 6, 120], [0, 64, 0], [-4, 12, 96], [0, 66, 0]],
      loc: [[10, 16, 175], [0, 30, 0], [6, 72, 135], [0, 64, 0]],
      war: [[CX - 3.6, 1.6, 0.9], [CX - 0.1, 0.45, -0.2], [CX - 2.9, 1.2, 0.6], [CX - 0.1, 0.4, -0.3]],
      sent: [[CX + 0.6, 0.5, 2.6], [CX - 3, 1.3, -2], [CX + 0.9, 0.4, 3.0], [CX - 3, 7, -2]],
      herbs: [[1.4, 0.7, HZ + 5.2], [0.2, 0.9, HZ + 0.5], [-0.8, 0.8, HZ + 4.6], [0.2, 1.2, HZ]],
      tear: [[30, 22, 300], [-24, 52, 0], [14, 30, 270], [-26, 60, 0]],
      weight: [t => [SP.x + 42, SP.y + 16, SP.z + 50], t => [SP.x, SP.y + 4, SP.z], t => [SP.x + 58, SP.y + 22, SP.z + 30], t => [SP.x, SP.y + 4, SP.z]],
      humans: [[BX + 4, 13, 62], [BX, 12, 0], [BX - 3, 15, 57], [BX, 12, 0]],
      dist: [t => [flightX(t) - 70, 175, DZ + 120], t => [flightX(t) + 18, 135, DZ], t => [flightX(t) - 30, 165, DZ + 125], t => [flightX(t) + 18, 135, DZ]],
      speed: [t => [flightX(t) + 30, 128, DZ + 100], t => [flightX(t) + 18, 137, DZ], t => [flightX(t) + 5, 130, DZ + 92], t => [flightX(t) + 18, 137, DZ]],
      wake: [[CX - 3.4, 1.3, 1.1], [CX - 0.2, 0.6, -0.2], [CX - 2.8, 1.25, 0.9], [CX - 0.2, 0.8, -0.2]],
      village: [[VX + 20, VY + 3.5, VZ + 24], [VX - 10, VY + 6, VZ - 10], [VX + 26, VY + 6, VZ + 36], [0, 58, 0]],
      cta: [t => [flightX(t) - 90, 150, DZ + 110], t => [flightX(t) + 30, 138, DZ], t => [flightX(t) - 150, 165, DZ + 150], t => [flightX(t) + 40, 140, DZ]],
    };
    const V3 = (v, t) => typeof v === 'function' ? v(t) : v;
    K.shoot = t => { const id = lineAt(t), s = SH[id], i = IDX[id], a = L[i].t - CUT, b = i + 1 < L.length ? L[i + 1].t - CUT : D; const k = ease(prog(t, a, b));
      const p0 = V3(s[0], t), l0 = V3(s[1], t), p1 = V3(s[2], t), l1 = V3(s[3], t); K.cam.position.set(lerp(p0[0], p1[0], k), lerp(p0[1], p1[1], k), lerp(p0[2], p1[2], k)); K.cam.lookAt(lerp(l0[0], l1[0], k), lerp(l0[1], l1[1], k), lerp(l0[2], l1[2], k)); };

    // ---------------------------------------------------------------- per-frame update
    const SUMHOME = new THREE.Vector3(0, HB, 0), M4 = new THREE.Matrix4(), Q = new THREE.Quaternion(), V = new THREE.Vector3(), SC = new THREE.Vector3(), EU = new THREE.Euler();
    const pose = (h, o) => { const set = (g, v) => { if (v) g.rotation.set(v[0] || 0, v[1] || 0, v[2] || 0); else g.rotation.set(0, 0, 0); };
      set(h.armR.a, o.rA); set(h.armR.b, o.rB); set(h.armL.a, o.lA); set(h.armL.b, o.lB); h.legs.forEach((l, i) => { set(l.a, (o.legA || [])[i]); set(l.b, (o.legB || [])[i]); }); if (h.head) set(h.head, o.head); };
    const update = t => {
      const id = lineAt(t), z = setLook(t, id), i = IDX[id], la = L[i].t, le = L[i].end, u = prog(t, la - CUT, le);
      // ---- Hanuman placement per line
      han.root.visible = ['sent', 'herbs', 'tear', 'weight', 'dist', 'speed', 'cta'].includes(id);
      han.pitch.rotation.set(0, 0, 0); han.fig.position.set(0, 0, 0);
      if (id === 'sent') { const jumpT = F('sent', 0.62), crouch = eo(prog(t, la, jumpT)) * (1 - prog(t, jumpT, jumpT + 0.08)), up = Math.max(0, t - jumpT);
        han.root.position.set(CX - 3, up * up * 14 + up * 6, -2); han.root.rotation.set(0, 0.7, 0); han.root.scale.setScalar(1);
        pose(han, { rA: [-0.3 - crouch * 0.6, 0, 0.3], rB: [-0.6 * crouch, 0, 0], lA: [-0.3 - crouch * 0.6, 0, -0.3], lB: [-0.3, 0, 0], legA: [[-1.0 * crouch, 0, 0], [-1.0 * crouch, 0, 0]], legB: [[1.6 * crouch, 0, 0], [1.6 * crouch, 0, 0]], head: [0.2 * crouch - (up > 0 ? 0.4 : 0), 0, 0] });
        if (up > 0) pose(han, { rA: [-2.9, 0, 0.15], lA: [-0.4, 0, -0.2], lB: [-0.4, 0, 0], legA: [[0.3, 0, 0], [-0.2, 0, 0]], legB: [[0.5, 0, 0], [0.3, 0, 0]], head: [-0.4, 0, 0] });
        han.fig.position.y = -crouch * 0.42; }
      if (id === 'herbs') { han.root.position.set(0.6, 0, HZ - 2.2); han.root.rotation.set(0, -0.15, 0); han.root.scale.setScalar(1);
        const look = Math.sin((t - la) * 1.6) * 0.7; pose(han, { rA: [-0.15, 0, 0.12], rB: [-0.5, 0, 0], lA: [0.1, 0, -0.15], lB: [-0.2, 0, 0], head: [0.35, look, 0] }); }
      if (id === 'tear' || id === 'weight') { han.root.position.copy(HANA); han.root.rotation.set(0, 0.6, 0);
        const grow = id === 'tear' ? eo(prog(t, la, F('tear', 0.45))) : 1; han.root.scale.setScalar(lerp(6, HS, grow));
        const reach = id === 'tear' ? eo(prog(t, F('tear', 0.35), F('tear', 0.6))) : 1; pose(han, { rA: [0, 0, lerp(0.25, -0.05, reach) + 0], rB: [0, 0, 0], lA: [0, 0, -0.15], lB: [-0.2, 0, 0], head: [-0.15 * reach, 0, 0] });
        han.armR.a.rotation.set(0, 0, Math.PI - 0.2 * (1 - reach) * 3);   // arm swings up overhead
        han.armR.a.rotation.z = lerp(0.3, Math.PI - 0.55, reach); }
      if (z === 'D' && han.root.visible) { const bob = Math.sin(t * 1.4) * 2; han.root.position.set(flightX(t), 132 + bob, DZ); han.root.rotation.set(0, Math.PI / 2, 0); han.root.scale.setScalar(HS * 0.5);
        han.pitch.rotation.set(1.2, 0, 0); pose(han, { rA: [0, 0, Math.PI - 0.15], lA: [0.6, 0, -0.1], lB: [-0.3, 0, 0], legA: [[0.25, 0, 0], [0.05, 0, 0]], legB: [[0.5, 0, 0], [0.35, 0, 0]], head: [-0.9, 0, 0] }); }
      han.root.updateMatrixWorld(true); han.palm.getWorldPosition(HP);
      // ---- summit: home, tearing, on palm, or (flight) carried at half scale
      let onPalm = 0; if (id === 'tear') onPalm = eo(prog(t, F('tear', 0.72), F('tear', 0.98))); if (id === 'weight') onPalm = 1;
      summit.visible = z === 'A' || (z === 'D' && han.root.visible);
      if (z === 'D') { SP.copy(HP); SP.y += 0.1 * HS * 0.5; summit.position.copy(SP); summit.scale.setScalar(0.5); summit.rotation.set(0, 0, 0); }
      else { const tgt = HP.clone(); tgt.y += 0.06 * HS; SP.copy(SUMHOME).lerp(tgt, onPalm); if (onPalm > 0 && onPalm < 1) SP.y += Math.sin(onPalm * Math.PI) * 8;
        const shake = (id === 'hook' ? 0.35 * prog(t, F('hook', 0.3), F('hook', 0.9)) : 0) + (id === 'tear' && onPalm === 0 ? 0.5 * prog(t, F('tear', 0.5), F('tear', 0.72)) : 0);
        SP.x += Math.sin(t * 43) * shake; SP.z += Math.cos(t * 37) * shake; summit.position.copy(SP); summit.scale.setScalar(1); summit.rotation.set(0, onPalm * 0.5, 0); }
      // crack glow + debris + dust
      const crackK = id === 'hook' ? prog(t, F('hook', 0.35), F('hook', 0.9)) : id === 'tear' ? 1 - prog(t, F('tear', 0.75), F('tear', 0.95)) * 0.6 : 0; crack.material.opacity = crackK * (0.7 + 0.3 * Math.sin(t * 20)); crack.visible = crackK > 0.01;
      const dOn = id === 'tear' && t > F('tear', 0.7), dt = t - F('tear', 0.7);
      for (let k = 0; k < NDB; k++) { const b = dbp[k]; if (!dOn) { SC.setScalar(0.0001); V.set(0, -100, 0); } else { const rr = b.r + b.vo * dt; V.set(Math.cos(b.a) * rr, HB + b.vy * dt - 9 * dt * dt, Math.sin(b.a) * rr); SC.setScalar(V.y > 0 ? b.s : 0.0001); }
        EU.set(dt * 3 + k, dt * 2, 0); Q.setFromEuler(EU); M4.compose(V, Q, SC); debris.setMatrixAt(k, M4); } debris.instanceMatrix.needsUpdate = true;
      dust.material.opacity = dOn ? 0.35 * Math.max(0, 1 - dt / 1.6) : 0; dust.scale.setScalar(rAt(HB) * (1.2 + (dOn ? dt * 4 : 0))); dust.scale.y *= 0.35;
      // ---- camp: Lakshmana lying (or waking), Rama kneeling
      const wake = id === 'wake' ? eo(prog(t, F('wake', 0.35), F('wake', 0.85))) : 0;
      // Lakshmana lies along z on the mat (pivot at the hips), head toward -z; on "wake" he sits up
      lak.fig.position.y = -0.95; lak.root.position.set(-0.4, 0.2, 0.15); lak.root.rotation.set(lerp(-Math.PI / 2, -0.2, wake), 0, 0);
      pose(lak, { rA: [0.1, 0, 0.12 + wake * 0.2], lA: [0.1, 0, -0.12 - wake * 0.2], legA: [[-(Math.PI / 2 - 0.2) * wake, 0, 0], [-(Math.PI / 2 - 0.2) * wake, 0, 0]], head: [wake * 0.2, 0, 0] });
      rama.root.position.set(0.75, -0.42 * (1 - wake), -0.3); rama.root.rotation.set(0, -Math.PI / 2, 0);
      pose(rama, { rA: [-0.8 - wake * 0.6, 0, 0.2], rB: [-0.6, 0, 0], lA: [-0.4, 0, -0.2], lB: [-0.8, 0, 0], legA: [[-1.4 * (1 - wake), 0, 0], [-0.2 * (1 - wake), 0, 0]], legB: [[1.5 * (1 - wake), 0, 0], [1.8 * (1 - wake), 0, 0]], head: [0.5 * (1 - wake), 0, 0] });
      vanaras.forEach((v, k) => { pose(v, { rA: [-0.2, 0, 0.1], lA: [-0.2, 0, -0.1], head: [0.3, 0, 0] }); v.fig.position.y = Math.sin(t * 2 + k) * 0.01; });
      torchFl.forEach((f, k) => f.scale.setScalar(0.8 + 0.35 * Math.abs(Math.sin(t * 13 + k * 2.1)))); torchLights.forEach((l, k) => { l.intensity = (id === 'wake' ? 6 : 14) + 4 * Math.sin(t * 11 + k); });
      herbGlow.intensity = id === 'wake' ? 8 * (1 - prog(t, F('wake', 0.5), E('wake'))) : 0;
      // ---- herbs pulse
      herbBulbs.forEach((b, k) => b.scale.setScalar(0.85 + 0.35 * Math.sin(t * 3 + k * 1.3)));
      // ---- balance: beam tips toward the peak
      const tilt = id === 'humans' ? K.easeBack(prog(t, F('humans', 0.2), F('humans', 0.7))) * 0.36 : 0; beam.rotation.z = -tilt;
      beam.updateMatrixWorld(true); pans.forEach((p, s) => { p.hook.getWorldPosition(V); const hx = V.x - BX, hy = V.y; p.pan.position.set(hx, hy - 10, 0);
        p.chains.forEach(c => { const k = c.userData.k, a = k / 3 * Math.PI * 2, ex = hx + Math.cos(a) * 5.4, ez = Math.sin(a) * 5.4, ey = hy - 10; const mid = new THREE.Vector3((hx + ex) / 2, (hy + ey) / 2, ez / 2), dir = new THREE.Vector3(ex - hx, ey - hy, ez);
          c.position.copy(mid); c.scale.y = dir.length(); c.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize()); }); });
      // ---- flight streaks + dawn sun
      const sOn = id === 'speed' || id === 'cta'; streaks.forEach((m, k) => { m.visible = sOn; if (!sOn) return; const r1 = K.rng(900 + k)(), r2 = K.rng(950 + k)(), len = 30 + r1 * 50, ph = (t * 320 + k * 61) % 500;
        m.position.set(flightX(t) + 260 - ph, 110 + r2 * 50, DZ - 40 + (k % 8) * 12); m.scale.set(len, 1, 1); m.material.opacity = id === 'speed' ? 0.55 : 0.25; });
      sunDisc.visible = id === 'cta'; sunDisc.position.set(flightX(t) + 1600, 170, DZ - 900); sunDisc.lookAt(K.cam.position);
      villagers.forEach((v, k) => pose(v, { rA: [-0.1, 0, 0.1], lA: [-0.1, 0, -0.1], head: [Math.sin(t + k) * 0.05, 0, 0] }));
      drawHud(t);
    };

    const sfx = [
      ['bass', 0.1, 0.8], ['rustle', F('hook', 0.35), 0.5], ['thud', F('hook', 0.8), 0.7],
      ...['loc', 'war', 'sent', 'herbs', 'tear', 'weight', 'humans', 'dist', 'speed', 'wake', 'village', 'cta'].map(n => ['whoosh', B(n) - 0.18, 0.45]),
      ['whoosh', F('sent', 0.62), 0.9], ['boing', F('sent', 0.62), 0.25], ['chime', B('herbs') + 0.3, 0.4], ['riser', F('tear', 0.2), 0.4], ['bass', F('tear', 0.72), 1.0], ['thud', F('tear', 0.74), 1.0], ['rustle', F('tear', 0.78), 0.7],
      ['thud', F('humans', 0.5), 0.8], ['whoosh', B('speed') + 0.4, 0.8], ['chime', F('wake', 0.6), 0.6], ['chime', B('cta') + 0.2, 0.5], ['pop', B('cta') + 0.3, 0.5], ['ding', B('cta') + 1.4, 0.55],
    ];
    return { duration: D, update, shots: [{ t: [0, 1], from: { pos: [0, 0, 1], look: [0, 0, 0] } }], sfx, watermark: false, endCard: false, music: {}, capFont: 'Fredoka Light', capMarginV: 520, capSize: 66 };
  },
};
