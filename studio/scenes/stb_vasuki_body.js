// Vasuki & Mandara — Zack D. Films style: one cinematic shot per line, smooth soft-lit 3D, no info cards.
// Zones: O ocean of milk (origin) · S space/scale (z=-4000; Earth radius 10, Mandara 224 tall = 11.2 Earths) · K under the milk (x=3000) · R Mandar Hill, Bihar (x=-3000).
window.SCENE = {
  setup: { bg: 0x0b1030, fog: [400, 2400], fov: 38, bloom: { strength: 0.35, radius: 0.55, threshold: 0.88 } },
  lines: window.STB_LINES,
  build(K, T) {
    const L = T.lines, IDX = {}; window.STB_LINES.forEach((l, i) => { IDX[l.id] = i; });
    const B = n => L[IDX[n]].t, E = n => L[IDX[n]].end, F = (n, f) => B(n) + (E(n) - B(n)) * f;
    const D = E('cta') + 1.8, CUT = 0.1;
    const THREE = window.THREE, S = K.scene;
    const ease = K.ease, eo = K.easeOut, prog = K.prog, clamp = K.clamp, lerp = K.lerp;
    K.cam.far = 9000; K.cam.updateProjectionMatrix(); K.renderer.shadowMap.enabled = false; K.renderer.toneMappingExposure = 1.08;
    const lineAt = t => { let id = window.STB_LINES[0].id; window.STB_LINES.forEach((l, i) => { if (t >= L[i].t - CUT) id = l.id; }); return id; };

    // ---------------------------------------------------------------- skies
    const sky = (stops, stars = 0, sunAt = null) => K.canvasTex(256, 1024, (x, w, h) => { const g = x.createLinearGradient(0, 0, 0, h); stops.forEach(([o, c]) => g.addColorStop(o, c)); x.fillStyle = g; x.fillRect(0, 0, w, h);
      const r = K.rng(77); for (let i = 0; i < stars; i++) { const sy = r() * h, a = 0.25 + r() * 0.75; x.fillStyle = `rgba(255,255,255,${a})`; x.fillRect(r() * w, sy, r() < 0.1 ? 2 : 1, r() < 0.1 ? 2 : 1); }
      if (sunAt) { const sg = x.createRadialGradient(w / 2, h * sunAt, 0, w / 2, h * sunAt, w); sg.addColorStop(0, 'rgba(255,246,220,1)'); sg.addColorStop(0.1, 'rgba(255,215,150,0.8)'); sg.addColorStop(1, 'rgba(255,170,100,0)'); x.fillStyle = sg; x.fillRect(0, 0, w, h); } });
    const SKY = {
      gold: sky([[0, '#2b3a8a'], [0.45, '#8a7ad0'], [0.75, '#ffc29a'], [1, '#fff0d0']], 0, 0.82),
      space: sky([[0, '#000006'], [0.5, '#03051a'], [1, '#0a0f2e']], 900),
      milk: sky([[0, '#cfe6f0'], [0.5, '#9cc4d8'], [1, '#5a8aa8']]),
      storm: sky([[0, '#1a1030'], [0.5, '#4a2a5a'], [0.85, '#6a5a6a'], [1, '#8a7a6a']], 0),
      day: sky([[0, '#2a64d6'], [0.6, '#8cc4ff'], [1, '#eaf4ff']]),
    };
    const hemi = new THREE.HemisphereLight(0xd8e0ff, 0x40384a, 0.9); S.add(hemi);
    const key = new THREE.DirectionalLight(0xffe0c0, 2.6); S.add(key); S.add(key.target);
    const rim = new THREE.DirectionalLight(0xa0b8ff, 1.2); S.add(rim); S.add(rim.target);

    // ---------------------------------------------------------------- helpers
    const mat = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.75, metalness: 0 }, o));
    const GOLD = mat(0xffc24a, { roughness: 0.3, metalness: 0.85, emissive: 0x3a2200, emissiveIntensity: 0.4 });
    const fixNormals = g => { const n = g.attributes.normal; for (let i = 0; i < n.count; i++) { const x = n.getX(i), y = n.getY(i), z = n.getZ(i), l = Math.hypot(x, y, z); if (!(l > 1e-6)) n.setXYZ(i, 0, 1, 0); else n.setXYZ(i, x / l, y / l, z / l); } n.needsUpdate = true; return g; };
    const mesh = (geo, m, x = 0, y = 0, z = 0, p = S) => { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); p.add(o); return o; };
    const SPH = (r, m, x, y, z, p, sx = 1, sy = 1, sz = 1) => { const o = mesh(new THREE.SphereGeometry(r, 28, 20), m, x, y, z, p); o.scale.set(sx, sy, sz); return o; };
    const CAP = (r, l, m, x, y, z, p) => mesh(new THREE.CapsuleGeometry(r, l, 8, 18), m, x, y, z, p);
    const crag = (rTop, rBot, h, seg, hseg, seed, amp) => { const g = new THREE.CylinderGeometry(rTop, rBot, h, seg, hseg, true); const p = g.attributes.position, r = K.rng(seed), cache = {};
      for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i), k = `${x.toFixed(2)},${y.toFixed(2)},${z.toFixed(2)}`; if (Math.abs(y + h / 2) < 1e-4 || Math.hypot(x, z) < 1e-3) continue;
        if (!cache[k]) cache[k] = [(r() - 0.5) * amp, (r() - 0.5) * amp * 0.5, (r() - 0.5) * amp]; const d = cache[k]; p.setXYZ(i, x + d[0], y + d[1], z + d[2]); } g.computeVertexNormals(); return fixNormals(g); };
    const vcol = (geo, fn) => { const p = geo.attributes.position, c = new Float32Array(p.count * 3), r = K.rng(5); for (let i = 0; i < p.count; i++) { const [a, b, d] = fn(p.getY(i), r); c[i * 3] = a; c[i * 3 + 1] = b; c[i * 3 + 2] = d; } geo.setAttribute('color', new THREE.BufferAttribute(c, 3)); };
    const VCOL = mat(0xffffff, { vertexColors: true, roughness: 0.9 });
    const limb = (parent, x, y, z, r1, l1, r2, l2, m, end) => { const a = new THREE.Group(); a.position.set(x, y, z); parent.add(a); CAP(r1, l1, m, 0, -l1 / 2 - r1 * 0.3, 0, a);
      const b = new THREE.Group(); b.position.set(0, -l1 - r1 * 0.6, 0); a.add(b); CAP(r2, l2, m, 0, -l2 / 2 - r2 * 0.3, 0, b); const tip = new THREE.Group(); tip.position.set(0, -l2 - r2 * 0.7, 0); b.add(tip); if (end) end(tip); return { a, b, tip }; };
    const makeHuman = (skinC, clothC, { crown = 'gold', bun = false } = {}) => {
      const root = new THREE.Group(), fig = new THREE.Group(); root.add(fig); S.add(root);
      const SK = mat(skinC, { roughness: 0.55 }), CL = mat(clothC, { roughness: 0.7 }), HAIR = mat(0x1a120c, { roughness: 0.5 }), BLK = mat(0x0a0606);
      SPH(0.22, CL, 0, 0.98, 0, fig, 1.1, 0.75, 0.85); mesh(new THREE.CylinderGeometry(0.2, 0.32, 0.5, 24, 1, true), CL, 0, 0.8, 0, fig);
      SPH(0.22, SK, 0, 1.3, 0, fig, 1.05, 1.1, 0.75); SPH(0.24, SK, 0, 1.5, 0, fig, 1.15, 0.7, 0.75);
      const head = new THREE.Group(); head.position.set(0, 1.84, 0); fig.add(head); SPH(0.16, SK, 0, 0, 0, head, 0.92, 1.05, 0.95); for (const s of [-1, 1]) SPH(0.02, BLK, s * 0.055, 0.02, 0.145, head);
      SPH(0.168, HAIR, 0, 0.04, -0.02, head, 0.95, 0.85, 0.95);
      if (crown === 'gold') { mesh(new THREE.CylinderGeometry(0.13, 0.15, 0.12, 24), GOLD, 0, 0.17, 0, head); mesh(new THREE.ConeGeometry(0.1, 0.28, 24), GOLD, 0, 0.37, 0, head); }
      if (crown === 'spike') { mesh(new THREE.CylinderGeometry(0.14, 0.15, 0.1, 24), mat(0x5a1a1a, { metalness: 0.6, roughness: 0.4 }), 0, 0.15, 0, head); for (let i = 0; i < 7; i++) { const a = i / 7 * 6.28; mesh(new THREE.ConeGeometry(0.03, 0.2, 8), mat(0x8a2a1a, { metalness: 0.5 }), Math.sin(a) * 0.13, 0.27, Math.cos(a) * 0.13, head); } }
      if (bun) { SPH(0.12, HAIR, 0, 0.24, -0.02, head, 1, 1.3, 1); }
      const armR = limb(fig, 0.3, 1.55, 0, 0.065, 0.3, 0.058, 0.28, SK, tip => SPH(0.065, SK, 0, 0, 0, tip)); const armL = limb(fig, -0.3, 1.55, 0, 0.065, 0.3, 0.058, 0.28, SK, tip => SPH(0.065, SK, 0, 0, 0, tip));
      const legs = [-1, 1].map(s => limb(fig, s * 0.12, 0.9, 0, 0.085, 0.36, 0.07, 0.34, CL, tip => SPH(0.07, SK, 0, 0, 0.05, tip, 0.9, 0.6, 1.5)));
      return { root, fig, head, armR, armL, legs };
    };
    const pose = (h, o) => { const set = (g, v) => g.rotation.set(...(v || [0, 0, 0])); set(h.armR.a, o.rA); set(h.armR.b, o.rB); set(h.armL.a, o.lA); set(h.armL.b, o.lB); h.legs.forEach((l, i) => { set(l.a, (o.legA || [])[i]); set(l.b, (o.legB || [])[i]); }); set(h.head, o.head); };
    // serpent skin: scales along the tube (u = length), lighter belly band
    const scaleTex = K.canvasTex(512, 128, (x, w, h) => { const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#1d5a52'); g.addColorStop(0.35, '#2f8a6e'); g.addColorStop(0.5, '#d8c27a'); g.addColorStop(0.65, '#2f8a6e'); g.addColorStop(1, '#1d5a52'); x.fillStyle = g; x.fillRect(0, 0, w, h);
      x.strokeStyle = 'rgba(8,30,26,0.55)'; x.lineWidth = 2; for (let i = -2; i < 34; i++) for (let j = 0; j < 9; j++) { const cx = i * 16 + (j % 2) * 8, cy = j * 16; x.beginPath(); x.moveTo(cx - 8, cy); x.lineTo(cx, cy - 8); x.lineTo(cx + 8, cy); x.lineTo(cx, cy + 8); x.closePath(); x.stroke(); } });
    scaleTex.wrapS = scaleTex.wrapT = THREE.RepeatWrapping;
    const SNAKE = (rep) => { const t = scaleTex.clone(); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep, 1); t.needsUpdate = true; return new THREE.MeshStandardMaterial({ map: t, roughness: 0.45, metalness: 0.1 }); };
    const makeHead = (s, parent) => { const g = new THREE.Group(); g.scale.setScalar(s); parent.add(g); const SK = mat(0x2f8a6e, { roughness: 0.4 }), BEL = mat(0xd8c27a, { roughness: 0.5 });
      SPH(1, SK, 0, 0, 0, g, 0.95, 0.62, 1.7); SPH(0.75, SK, 0, -0.05, 1.3, g, 0.85, 0.5, 1.1); SPH(0.7, BEL, 0, -0.28, 0.9, g, 0.8, 0.25, 1.4);
      const hood = mesh(new THREE.SphereGeometry(1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), SK, 0, -0.2, -0.8, g); hood.scale.set(2.0, 2.4, 0.32); hood.rotation.x = -Math.PI / 2 + 0.35; hood.position.set(0, 0.1, -1.0);
      const EYE = new THREE.MeshBasicMaterial({ color: 0xffd060 }); for (const sx of [-1, 1]) { const e = mesh(new THREE.SphereGeometry(0.17, 16, 12), EYE, sx * 0.62, 0.25, 1.3, g); mesh(new THREE.SphereGeometry(0.07, 10, 8), mat(0x050505), sx * 0.66, 0.27, 1.44, g); }
      const tongue = new THREE.Group(); tongue.position.set(0, -0.25, 2.2); g.add(tongue); for (const sx of [-1, 1]) { const tn = mesh(new THREE.CylinderGeometry(0.025, 0.04, 0.6, 6), mat(0xc0103a), sx * 0.06, 0, 0.25, tongue); tn.rotation.x = Math.PI / 2; tn.rotation.z = sx * 0.2; }
      mesh(new THREE.OctahedronGeometry(0.22, 0), new THREE.MeshBasicMaterial({ color: 0xff3050 }), 0, 0.6, 0.2, g); return { g, tongue }; };

    // ================================================================ ZONE O: ocean of milk
    const O = new THREE.Group(); S.add(O);
    const SEG = 90, ocean = new THREE.PlaneGeometry(3000, 3000, SEG, SEG); const OP = ocean.attributes.position, O0 = Float32Array.from(OP.array);
    const oceanM = mesh(ocean, mat(0xf6f1e6, { roughness: 0.22, metalness: 0.05 }), 0, 0, 0, O); oceanM.rotation.x = -Math.PI / 2;
    const MH = 520, MR = 34, MY = -60;                                   // Mandara in the churning scene
    const mGeo = crag(0, MR, MH, 48, 60, 21, 7.5); mGeo.translate(0, MH / 2, 0); vcol(mGeo, (y, r) => { const k = y / MH, n = r(); if (k > 0.82) return [0.88, 0.9, 0.95]; if (n < (k < 0.5 ? 0.55 : 0.25)) return [0.16 + n * 0.08, 0.3 + n * 0.1, 0.14]; const g = 0.28 + r() * 0.16; return [g * 1.05, g, g * 0.92]; });
    const mGroup = new THREE.Group(); O.add(mGroup); const mMesh = mesh(mGeo, VCOL, 0, MY, 0, mGroup);
    const rAtO = y => MR * (1 - (y - MY) / MH);
    // Vasuki in the ocean: from the devas' shore (−x), spiralling up Mandara, out to the asuras' shore (+x)
    const vPts = [new THREE.Vector3(-300, 6, 70), new THREE.Vector3(-200, 7, 50), new THREE.Vector3(-100, 8, 25)];
    const TURNS = 5, Y0 = 10, Y1 = 150; for (let i = 0; i <= 120; i++) { const u = i / 120, y = lerp(Y0, Y1, u), a = u * TURNS * Math.PI * 2 + Math.PI, r = rAtO(y) + 3.4; vPts.push(new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r)); }
    vPts.push(new THREE.Vector3(90, 90, 30), new THREE.Vector3(190, 30, 50), new THREE.Vector3(300, 14, 70));
    const vCurve = new THREE.CatmullRomCurve3(vPts); const vMat = SNAKE(160); const vBody = mesh(new THREE.TubeGeometry(vCurve, 1400, 3.2, 20, false), vMat, 0, 0, 0, O);
    const headO = makeHead(5.2, O); { const p = vCurve.getPoint(1), tg = vCurve.getTangent(1); headO.g.position.copy(p).add(tg.clone().multiplyScalar(6)); headO.g.position.y += 10; headO.g.lookAt(p.clone().add(tg.clone().multiplyScalar(60)).add(new THREE.Vector3(0, 6, 40))); }
    const HEADO = headO.g.position.clone(); { const p = vCurve.getPoint(1); const neck = new THREE.CatmullRomCurve3([p, p.clone().add(new THREE.Vector3(4, 3, 4)), HEADO.clone().add(new THREE.Vector3(0, -2, -5))]); mesh(new THREE.TubeGeometry(neck, 40, 3.2, 20, false), vMat, 0, 0, 0, O); }
    // armies: devas (gold) at −x, asuras (dark, spiked) at +x, holding the serpent near its ends
    const SHORE = 30, armies = [];
    for (const side of [-1, 1]) { const shore = mesh(new THREE.CylinderGeometry(70, 80, 6, 40), mat(side < 0 ? 0xd8c8a0 : 0x5a4a52, { roughness: 1 }), side * 360, 0, 70, O);
      for (let i = 0; i < 7; i++) { const h = side < 0 ? makeHuman(0xe8b07a, [0xf0b020, 0xffd060, 0xe8902a][i % 3], { crown: 'gold' }) : makeHuman(0x4a3a4a, [0x7a1a1a, 0x3a1a3a][i % 2], { crown: 'spike' });
        h.root.scale.setScalar(SHORE / 2); const u = side < 0 ? 0.004 + i * 0.006 : 0.996 - i * 0.006, p = vCurve.getPoint(u); h.root.position.set(side * (330 + i * 14), 3, 70 + (i % 2 ? 22 : -18)); h.root.rotation.y = side < 0 ? Math.PI / 2 : -Math.PI / 2; O.add(h.root); armies.push({ h, side, i }); } }
    // clouds around the upper mountain
    const cloudM = mat(0xffffff, { roughness: 1, emissive: 0xffe8d8, emissiveIntensity: 0.35, transparent: true, opacity: 0.8, depthWrite: false });
    const NCL = 70, clouds = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 2), cloudM, NCL); O.add(clouds);
    { const r = K.rng(8), o = new THREE.Object3D(); for (let i = 0; i < NCL; i++) { const a = r() * 6.28, d = 60 + r() * 260; o.position.set(Math.cos(a) * d, 330 + r() * 50, Math.sin(a) * d); const s = 16 + r() * 22; o.scale.set(s * 1.5, s * 0.7, s); o.updateMatrix(); clouds.setMatrixAt(i, o.matrix); } }
    // poison: dark slick spreading + rising fumes
    const slick = mesh(new THREE.CircleGeometry(1, 64), new THREE.MeshStandardMaterial({ color: 0x1a1028, roughness: 0.3, emissive: 0x2a5a2a, emissiveIntensity: 0.35, transparent: true, opacity: 0.92 }), 0, 0.6, 0, O); slick.rotation.x = -Math.PI / 2;
    const NF = 70, fumes = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 16, 12), new THREE.MeshStandardMaterial({ color: 0x3a2a4a, transparent: true, opacity: 0.55, emissive: 0x204020, emissiveIntensity: 0.4, depthWrite: false }), NF); O.add(fumes);
    const fr = K.rng(19), fp = Array.from({ length: NF }, () => ({ a: fr() * 6.28, d: 30 + fr() * 160, s: 6 + fr() * 12, sp: 6 + fr() * 10, ph: fr() * 4 }));
    // Shiva on a rock near the shore
    const SHV = new THREE.Vector3(150, 0, 230);
    mesh(new THREE.DodecahedronGeometry(14, 1), mat(0x5a5560, { roughness: 1 }), SHV.x, -2, SHV.z, O).scale.set(1.2, 0.6, 1);
    const shiva = makeHuman(0x6f8fb8, 0xb87a3a, { crown: 'none', bun: true }); shiva.root.scale.setScalar(13); shiva.root.position.set(SHV.x, 6, SHV.z); shiva.root.rotation.y = -0.6; O.add(shiva.root);
    { const h = shiva.head; const moon = mesh(new THREE.TorusGeometry(0.1, 0.022, 8, 24, Math.PI * 1.2), mat(0xf4f4ff, { emissive: 0x8080a0, emissiveIntensity: 0.5 }), 0.06, 0.3, 0.02, h); moon.rotation.z = 0.5;
      const snk = mesh(new THREE.TorusGeometry(0.15, 0.03, 10, 32), mat(0x2f8a6e, { roughness: 0.4 }), 0, 1.66, 0.01, shiva.fig); snk.rotation.x = Math.PI / 2.2;
      const tri = new THREE.Group(); tri.position.set(-0.55, 0.6, 0.1); shiva.fig.add(tri); mesh(new THREE.CylinderGeometry(0.02, 0.02, 2.6, 8), GOLD, 0, 0.9, 0, tri); for (const sx of [-1, 0, 1]) mesh(new THREE.ConeGeometry(0.035, 0.28 - Math.abs(sx) * 0.06, 8), GOLD, sx * 0.09, 2.3 - Math.abs(sx) * 0.03, 0, tri); mesh(new THREE.TorusGeometry(0.09, 0.015, 6, 16, Math.PI), GOLD, 0, 2.18, 0, tri).rotation.z = Math.PI; }
    const throat = mesh(new THREE.SphereGeometry(0.1, 20, 14), new THREE.MeshBasicMaterial({ color: 0x3a7aff, transparent: true, opacity: 0 }), 0, 1.68, 0.04, shiva.fig); throat.scale.set(1.1, 0.8, 0.9);
    const cup = new THREE.Group(); shiva.armR.tip.add(cup); mesh(new THREE.CylinderGeometry(0.08, 0.05, 0.08, 20, 1, true), GOLD, 0, 0.02, 0.05, cup); const cupIn = mesh(new THREE.CircleGeometry(0.075, 20), new THREE.MeshBasicMaterial({ color: 0x40ff60 }), 0, 0.055, 0.05, cup); cupIn.rotation.x = -Math.PI / 2;

    // ================================================================ ZONE S: space scale (Earth radius 10)
    const SZ = -4000, Sg = new THREE.Group(); Sg.position.set(0, 0, SZ); S.add(Sg);
    const earthTex = K.canvasTex(1024, 512, (x, w, h) => { x.fillStyle = '#1b4f9a'; x.fillRect(0, 0, w, h); const r = K.rng(33);
      for (let i = 0; i < 46; i++) { const cx = r() * w, cy = h * (0.18 + r() * 0.64), rad = 20 + r() * 70; x.fillStyle = r() < 0.5 ? '#3f7a3a' : '#7a6a3a'; x.beginPath(); for (let k = 0; k < 14; k++) { const a = k / 14 * 6.28, rr = rad * (0.6 + r() * 0.5); k ? x.lineTo(cx + Math.cos(a) * rr * 1.4, cy + Math.sin(a) * rr) : x.moveTo(cx + Math.cos(a) * rr * 1.4, cy + Math.sin(a) * rr); } x.closePath(); x.fill(); }
      x.fillStyle = '#f2f6ff'; x.fillRect(0, 0, w, h * 0.07); x.fillRect(0, h * 0.93, w, h * 0.07); });
    const cloudTex = K.canvasTex(1024, 512, (x, w, h) => { x.clearRect(0, 0, w, h); const r = K.rng(44); for (let i = 0; i < 220; i++) { x.fillStyle = `rgba(255,255,255,${0.15 + r() * 0.35})`; x.beginPath(); x.ellipse(r() * w, h * (0.1 + r() * 0.8), 10 + r() * 50, 4 + r() * 12, 0, 0, 7); x.fill(); } });
    const RE = 10, earthMat = new THREE.MeshStandardMaterial({ map: earthTex, roughness: 0.6 }), cloudMat = new THREE.MeshStandardMaterial({ map: cloudTex, transparent: true, depthWrite: false, roughness: 1 });
    const makeEarth = parent => { const g = new THREE.Group(); parent.add(g); mesh(new THREE.SphereGeometry(RE, 64, 40), earthMat, 0, 0, 0, g); mesh(new THREE.SphereGeometry(RE * 1.015, 48, 32), cloudMat, 0, 0, 0, g);
      mesh(new THREE.SphereGeometry(RE * 1.08, 40, 28), new THREE.MeshBasicMaterial({ color: 0x6ab0ff, transparent: true, opacity: 0.12, side: THREE.BackSide, depthWrite: false }), 0, 0, 0, g); return g; };
    const MH2 = 224, MR2 = 12, EX = 40;
    const m2Geo = crag(0, MR2, MH2, 48, 80, 31, 2.6); m2Geo.translate(0, MH2 / 2, 0); vcol(m2Geo, (y, r) => { const k = y / MH2, n = r(); if (k > 0.84) return [0.88, 0.9, 0.95]; if (n < (k < 0.5 ? 0.55 : 0.25)) return [0.16 + n * 0.08, 0.3 + n * 0.1, 0.14]; const g = 0.28 + r() * 0.16; return [g * 1.05, g, g * 0.92]; });
    const m2 = mesh(m2Geo, VCOL, 0, 0, 0, Sg);
    const rAtS = y => MR2 * (1 - y / MH2);
    const hPts = []; const TURN2 = 18; for (let i = 0; i <= 900; i++) { const u = i / 900, y = lerp(2, MH2 - 18, u), a = u * TURN2 * Math.PI * 2, r = rAtS(y) + 1.0; hPts.push(new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r)); }
    const hCurve = new THREE.CatmullRomCurve3(hPts), hMat = SNAKE(600); const helixGeo = new THREE.TubeGeometry(hCurve, 3600, 0.9, 12, false); const helix = mesh(helixGeo, hMat, 0, 0, 0, Sg);
    const headS = makeHead(1.5, Sg); { const p = hCurve.getPoint(1), tg = hCurve.getTangent(1); headS.g.position.copy(p).add(tg.clone().multiplyScalar(1.6)); headS.g.lookAt(p.clone().add(tg.clone().multiplyScalar(10)).add(new THREE.Vector3(0, 3, 0))); }
    const earths = Array.from({ length: 11 }, (_, i) => { const e = makeEarth(Sg); e.position.set(EX, RE + i * 2 * RE, 0); return e; });
    // equator demo: Earth beside a glowing coil at the height where Mandara is exactly Earth-wide
    const YEQ = MH2 * (1 - RE / MR2);
    const coilGlow = mesh(new THREE.TorusGeometry(RE + 0.6, 0.55, 16, 120), new THREE.MeshBasicMaterial({ color: 0xffd060, transparent: true, opacity: 0 }), 0, YEQ, 0, Sg); coilGlow.rotation.x = Math.PI / 2;
    const eqEarth = makeEarth(Sg); eqEarth.position.set(EX - 8, YEQ, 6);
    const eqRing = mesh(new THREE.TorusGeometry(RE * 1.01, 0.35, 12, 120), new THREE.MeshBasicMaterial({ color: 0xffd060, transparent: true, opacity: 0 }), 0, 0, 0, eqEarth); eqRing.rotation.x = Math.PI / 2;
    const sunS = new THREE.Mesh(new THREE.SphereGeometry(30, 32, 20), new THREE.MeshBasicMaterial({ color: 0xfff2d0, fog: false })); sunS.position.set(-900, 300, -1600); Sg.add(sunS);

    // ================================================================ ZONE K: beneath the milk (Kurma, the amrit pot)
    const KX = 3000, Kg = new THREE.Group(); Kg.position.set(KX, 0, 0); S.add(Kg);
    { const fl = mesh(new THREE.PlaneGeometry(800, 800, 60, 60), mat(0xb8c8c8, { roughness: 1 }), 0, -30, 0, Kg); fl.rotation.x = -Math.PI / 2; const p = fl.geometry.attributes.position, r = K.rng(4); for (let i = 0; i < p.count; i++) p.setZ(i, (r() - 0.5) * 2.5); fl.geometry.computeVertexNormals(); fixNormals(fl.geometry); }
    const kBase = crag(9, 22, 120, 32, 12, 52, 1.4); kBase.translate(0, 60, 0); vcol(kBase, (y, r) => [0.3 + r() * 0.05, 0.34 + r() * 0.05, 0.3]); const kMount = new THREE.Group(); Kg.add(kMount); mesh(kBase, VCOL, 0, 0, 0, kMount);
    const turtle = new THREE.Group(); Kg.add(turtle);
    { const shellTex = K.canvasTex(512, 512, (x, w, h) => { x.fillStyle = '#4a6a3a'; x.fillRect(0, 0, w, h); x.strokeStyle = '#2a3a22'; x.lineWidth = 8; for (let j = -1; j < 8; j++) for (let i = -1; i < 8; i++) { const cx = i * 80 + (j % 2) * 40, cy = j * 70; x.beginPath(); for (let k = 0; k < 6; k++) { const a = k / 6 * 6.28 + Math.PI / 6; k ? x.lineTo(cx + Math.cos(a) * 42, cy + Math.sin(a) * 42) : x.moveTo(cx + Math.cos(a) * 42, cy + Math.sin(a) * 42); } x.closePath(); x.stroke(); } });
      const shell = mesh(new THREE.SphereGeometry(30, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ map: shellTex, roughness: 0.6 }), 0, 0, 0, turtle); shell.scale.set(1, 0.45, 1.15);
      const SKT = mat(0x6a8a5a, { roughness: 0.6 }); mesh(new THREE.CylinderGeometry(30, 28, 3, 48), mat(0x8a9a6a), 0, -1, 0, turtle).scale.z = 1.15;
      const hd = SPH(7, SKT, 0, 1, 38, turtle, 1, 0.8, 1.3); for (const sx of [-1, 1]) { SPH(1.1, mat(0x111111), sx * 4, 3, 44, turtle); const fl = SPH(9, SKT, sx * 30, -1, 18, turtle, 1.6, 0.3, 0.8); fl.rotation.y = sx * 0.5; const bl = SPH(7, SKT, sx * 26, -1, -26, turtle, 1.4, 0.3, 0.8); bl.rotation.y = -sx * 0.4; } }
    const pot = new THREE.Group(); pot.position.set(80, -30, 60); Kg.add(pot);
    { const pts = [[0, 0], [3.5, 0.2], [5.2, 2.5], [5.6, 5], [4.6, 7.5], [2.4, 8.6], [2.2, 9.6], [3.2, 10.2], [3.3, 10.8], [0, 10.8]].map(([a, b]) => new THREE.Vector2(a, b)); mesh(new THREE.LatheGeometry(pts, 48), GOLD, 0, 0, 0, pot);
      SPH(2.4, new THREE.MeshBasicMaterial({ color: 0xfff0a0 }), 0, 11.2, 0, pot); const gl = new THREE.PointLight(0xffd070, 50, 60, 1.6); gl.position.set(0, 14, 4); pot.add(gl); }
    const potGlow = mesh(new THREE.SphereGeometry(10, 24, 16), new THREE.MeshBasicMaterial({ color: 0xffe08a, transparent: true, opacity: 0.18, depthWrite: false }), 0, 8, 0, pot);
    const NBUB = 80, bubbles = new THREE.InstancedMesh(new THREE.SphereGeometry(0.4, 10, 8), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 }), NBUB); Kg.add(bubbles);
    const br = K.rng(55), bp = Array.from({ length: NBUB }, () => ({ x: (br() - 0.5) * 200, z: (br() - 0.5) * 160, sp: 4 + br() * 8, ph: br() * 60, s: 0.5 + br() }));

    // ================================================================ ZONE R: Mandar Hill, Banka, Bihar
    const RX = -3000, Rg = new THREE.Group(); Rg.position.set(RX, 0, 0); S.add(Rg);
    { const gr = mesh(new THREE.CircleGeometry(900, 64), mat(0x6f9a46, { roughness: 1 }), 0, 0, 0, Rg); gr.rotation.x = -Math.PI / 2;
      const hillGeo = new THREE.SphereGeometry(32, 96, 48, 0, Math.PI * 2, 0, Math.PI / 2); const hp = hillGeo.attributes.position, r = K.rng(61); for (let i = 0; i < hp.count; i++) { const n = 1 + (r() - 0.5) * 0.07 + Math.sin(hp.getX(i) * 0.4) * 0.02; hp.setXYZ(i, hp.getX(i) * n, hp.getY(i) * n, hp.getZ(i) * n); } hillGeo.computeVertexNormals(); fixNormals(hillGeo);
      vcol(hillGeo, (y, rr) => { const g = 0.48 + rr() * 0.08, mossy = rr() < 0.25 && y < 14; return mossy ? [0.32, 0.42, 0.26] : [g, g * 0.98, g * 0.95]; });
      const hill = mesh(hillGeo, VCOL, 0, 0, 0, Rg); hill.scale.set(1.3, 1.25, 1.15);
      const gPts = []; for (let i = 0; i <= 400; i++) { const u = i / 400, a = u * Math.PI * 2 * 1.6, el = lerp(0.25, 0.75, u), rr = 32 * Math.cos(el), y = 32 * Math.sin(el); gPts.push(new THREE.Vector3(Math.cos(a) * rr * 1.3 * 1.01, y * 1.25 + 0.1, Math.sin(a) * rr * 1.15 * 1.01)); }
      mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(gPts), 1200, 0.4, 8, false), mat(0x3a3434, { roughness: 1 }), 0, 0, 0, Rg);
      const tpl = new THREE.Group(); tpl.position.set(0, 39.6, 0); Rg.add(tpl); mesh(new THREE.BoxGeometry(3.2, 2.6, 3.2), mat(0xf4efe6), 0, 1.3, 0, tpl); mesh(new THREE.ConeGeometry(1.9, 4.2, 8, 1, true), mat(0xf4efe6), 0, 4.7, 0, tpl); mesh(new THREE.SphereGeometry(0.35, 12, 8), GOLD, 0, 7.0, 0, tpl);
      for (let i = 0; i < 140; i++) { const a = r() * 6.28, d = 48 + r() * 200, x = Math.cos(a) * d, z = Math.sin(a) * d, h = 4 + r() * 4; mesh(new THREE.CylinderGeometry(0.3, 0.45, h * 0.5, 8), mat(0x5a3a22), x, h * 0.25, z, Rg); SPH(h * 0.38, mat(r() < 0.5 ? 0x3f7a32 : 0x4f8a3a), x, h * 0.65, z, Rg, 1, 0.85, 1); }
      const pond = mesh(new THREE.CircleGeometry(16, 48), mat(0x4a7aa8, { roughness: 0.2, metalness: 0.2 }), 70, 0.1, 50, Rg); pond.rotation.x = -Math.PI / 2; }

    // ================================================================ HUD: only the closing follow button
    const hudTex = K.canvasTex(1080, 1920, () => {}); const hudScene = new THREE.Scene(), hudCam = new THREE.OrthographicCamera(-540, 540, 960, -960, -10, 10);
    hudScene.add(new THREE.Mesh(new THREE.PlaneGeometry(1080, 1920), new THREE.MeshBasicMaterial({ map: hudTex, transparent: true, toneMapped: false, depthTest: false })));
    K.draw = () => { K.composer.render(); const r = K.renderer; r.autoClear = false; r.clearDepth(); r.render(hudScene, hudCam); r.autoClear = true; };
    const drawHud = t => hudTex.redraw((x, W, Hh) => { const vg = x.createRadialGradient(W / 2, Hh * 0.46, Hh * 0.38, W / 2, Hh / 2, Hh * 0.78); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.4)'); x.fillStyle = vg; x.fillRect(0, 0, W, Hh);
      const fa = B('cta') + 0.3; if (t > fa) { const k = K.easeBack(prog(t, fa, fa + 0.35)), press = K.pulse(t, fa + 1.1, 0.3), done = t > fa + 1.25, w = 520 - press * 24;
        x.save(); x.translate(540, 1660); x.scale(k, k); x.translate(-540, -1660); x.shadowColor = 'rgba(0,0,0,0.5)'; x.shadowBlur = 24; x.fillStyle = done ? '#262a3a' : '#ff3b5c'; K.rrect(x, 540 - w / 2, 1605, w, 110, 55); x.fill(); x.shadowBlur = 0;
        x.font = '700 54px "Oswald"'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = '#fff'; x.fillText(done ? 'FOLLOWING ✓' : '+ FOLLOW', 540, 1662);
        const hp = eo(prog(t, fa + 0.35, fa + 1.05)), hx = 760 - hp * 200, hy = 1810 - hp * 130; x.fillStyle = 'rgba(255,255,255,0.95)'; x.strokeStyle = '#111'; x.lineWidth = 5; x.beginPath(); x.arc(hx, hy, 30 - press * 6, 0, 7); x.fill(); x.stroke(); x.restore(); } });

    // ---------------------------------------------------------------- look per line
    const ZONE = { hook: 'S', intro: 'O', amrit: 'K', churn: 'O', pull: 'O', height: 'O', earths: 'S', kurma: 'K', coil: 'S', equator: 'S', poison: 'O', real: 'R', cta: 'S' };
    const look = (sky, kc, ki, kp, tgt, hc, hi, fogc, fn, ff) => { S.background = sky; key.color.setHex(kc); key.intensity = ki; key.position.set(...kp); key.target.position.set(...tgt);
      rim.position.set(2 * tgt[0] - kp[0], kp[1] * 0.5, 2 * tgt[2] - kp[2]); rim.target.position.set(...tgt); hemi.color.setHex(hc); hemi.intensity = hi; S.fog.color.setHex(fogc); S.fog.near = fn; S.fog.far = ff; };
    const setLook = (t, id) => { const z = ZONE[id]; O.visible = z === 'O'; Sg.visible = z === 'S'; Kg.visible = z === 'K'; Rg.visible = z === 'R';
      if (z === 'O') { if (id === 'poison') look(SKY.storm, 0xd8c0ff, 1.5, [300, 300, 600], [150, 20, 230], 0xb0a0d0, 0.7, 0x5a4a62, 300, 2000); else look(SKY.gold, 0xffe0b8, 2.8, [-400, 500, 600], [0, 60, 0], 0xe0e4ff, 0.95, 0xe8dcd0, 500, 2600); }
      if (z === 'S') look(SKY.space, 0xfff0d8, 3.0, [-900, 300, SZ - 1600 + 2600], [0, 100, SZ], 0x6070a0, 0.35, 0x000006, 4000, 9000);
      if (z === 'K') look(SKY.milk, 0xe8f4ff, 2.0, [KX - 100, 200, 160], [KX, 0, 0], 0xdff0ff, 1.1, 0x9cc0d4, 60, 520);
      if (z === 'R') look(SKY.day, 0xfff4e4, 2.8, [RX - 200, 260, 200], [RX, 10, 0], 0xe0ecff, 1.1, 0xd6e6ff, 300, 1600);
      return z; };

    // ---------------------------------------------------------------- camera: one move per line
    const SHV_H = () => { const v = new THREE.Vector3(); shiva.head.getWorldPosition(v); return v; };
    const SH = {
      hook: [[16, 118, SZ + 22], [0, 116, SZ], [230, 140, SZ + 380], [20, 110, SZ]],
      intro: [[HEADO.x + 20, HEADO.y + 4, HEADO.z + 52], [HEADO.x, HEADO.y, HEADO.z], [HEADO.x + 10, HEADO.y + 2, HEADO.z + 36], [HEADO.x, HEADO.y + 1, HEADO.z]],
      amrit: [[KX + 98, -20, 104], [KX + 80, -22, 60], [KX + 92, -22, 88], [KX + 80, -20, 60]],
      churn: [[40, 50, 470], [0, 120, 0], [20, 40, 420], [0, 100, 0]],
      pull: [[-470, 46, 150], [0, 60, 20], [-430, 40, 120], [40, 60, 20]],
      height: [[30, 14, 300], [0, 60, 0], [30, 30, 300], [0, 420, 0]],
      earths: [[60, 112, SZ + 420], [20, 112, SZ], [40, 112, SZ + 400], [20, 112, SZ]],
      kurma: [[KX - 70, -8, 90], [KX, -6, 0], [KX - 60, -2, 80], [KX, 2, 0]],
      coil: [t => { const u = prog(t, B('coil') - CUT, B('equator') - CUT), a = 0.4 + u * 1.6; return [Math.cos(a) * 70, lerp(30, 190, ease(u)), SZ + Math.sin(a) * 70]; }, t => { const u = prog(t, B('coil') - CUT, B('equator') - CUT); return [0, lerp(30, 190, ease(u)), SZ]; }, t => SH.coil[0](t), t => SH.coil[1](t)],
      equator: [[22, YEQ + 6, SZ + 150], [20, YEQ, SZ], [22, YEQ + 2, SZ + 132], [20, YEQ, SZ]],
      poison: [t => { const h = SHV_H(); return [h.x - 44, h.y + 2, h.z + 64]; }, t => { const h = SHV_H(); return [h.x, h.y - 6, h.z]; }, t => { const h = SHV_H(); return [h.x - 28, h.y, h.z + 44]; }, t => { const h = SHV_H(); return [h.x, h.y - 4, h.z]; }],
      real: [[RX + 110, 14, 140], [RX, 14, 0], [RX + 80, 34, 100], [RX, 18, 0]],
      cta: [[150, 120, SZ + 460], [10, 110, SZ], [210, 140, SZ + 540], [10, 112, SZ]],
    };
    const V3 = (v, t) => typeof v === 'function' ? v(t) : v;
    K.shoot = t => { const id = lineAt(t), s = SH[id], i = IDX[id], a = L[i].t - CUT, b = i + 1 < L.length ? L[i + 1].t - CUT : D, k = ease(prog(t, a, b));
      const p0 = V3(s[0], t), l0 = V3(s[1], t), p1 = V3(s[2], t), l1 = V3(s[3], t); K.cam.position.set(lerp(p0[0], p1[0], k), lerp(p0[1], p1[1], k), lerp(p0[2], p1[2], k)); K.cam.lookAt(lerp(l0[0], l1[0], k), lerp(l0[1], l1[1], k), lerp(l0[2], l1[2], k)); };

    // ---------------------------------------------------------------- per-frame update
    const M4 = new THREE.Matrix4(), Q = new THREE.Quaternion(), V = new THREE.Vector3(), SC = new THREE.Vector3(), EU = new THREE.Euler();
    const update = t => {
      const id = lineAt(t), z = setLook(t, id); oceanM.material.roughness = id === 'poison' ? 0.9 : 0.22; oceanM.material.color.setHex(id === 'poison' ? 0x9a8a9a : 0xf6f1e6);
      // milk waves
      if (z === 'O') { for (let i = 0; i < OP.count; i++) { const x = O0[i * 3], y = O0[i * 3 + 1]; OP.setZ(i, Math.sin(x * 0.012 + t * 1.1) * 1.4 + Math.cos(y * 0.015 + t * 0.9) * 1.2); } OP.needsUpdate = true; ocean.computeVertexNormals(); }
      // Mandara: lowered into the ocean during "churn", spinning while churned
      const lower = id === 'churn' ? 1 - eo(prog(t, B('churn'), F('churn', 0.55))) : 0; mGroup.position.y = lower * 420;
      const spin = ['pull', 'height', 'poison'].includes(id) || (id === 'churn' && lower < 0.05); mGroup.rotation.y = spin ? t * 0.35 : 0;
      vBody.visible = !(id === 'churn' && lower > 0.02); vMat.map.offset.x = spin ? -t * 0.35 : 0;
      headO.tongue.scale.setScalar(K.pulse((t * 1.3) % 1.6, 0, 0.35) + 0.01); headO.g.rotation.z = Math.sin(t * 0.8) * 0.05;
      armies.forEach(({ h, side, i }) => { const pullK = spin ? Math.sin(t * 2.2 + (side < 0 ? 0 : Math.PI)) : 0; h.fig.rotation.x = -0.25 - pullK * 0.12;
        pose(h, { rA: [-1.3, 0, 0.1], rB: [-0.2, 0, 0], lA: [-1.3, 0, -0.1], lB: [-0.2, 0, 0], legA: [[-0.4, 0, 0], [0.35, 0, 0]], legB: [[0.4, 0, 0], [0.2, 0, 0]], head: [0.1, 0, 0] }); });
      // poison spreading + Shiva drinking
      const pk = id === 'poison' ? eo(prog(t, B('poison') - 0.1, F('poison', 0.5))) : 0; slick.visible = pk > 0.01; slick.scale.setScalar(Math.max(0.01, pk * 420));
      for (let k = 0; k < NF; k++) { const f = fp[k], ft = ((t * 0.6 + f.ph) % 4) / 4; if (pk < 0.05) { SC.setScalar(0.0001); V.set(0, -50, 0); } else { V.set(Math.cos(f.a) * f.d * pk, 4 + ft * 60, Math.sin(f.a) * f.d * pk); SC.setScalar(f.s * (0.4 + ft) * (1 - ft * 0.5)); } Q.identity(); M4.compose(V, Q, SC); fumes.setMatrixAt(k, M4); } fumes.instanceMatrix.needsUpdate = true;
      const drink = id === 'poison' ? eo(prog(t, F('poison', 0.25), F('poison', 0.5))) : 0;
      pose(shiva, { rA: [-1.6 * drink - 0.2, 0, 0.3 - drink * 0.2], rB: [-1.6 * drink, 0, 0], lA: [-0.2, 0, -0.2], lB: [-0.4, 0, 0], head: [-0.25 * drink, 0, 0] });
      throat.material.opacity = id === 'poison' ? 0.95 * prog(t, F('poison', 0.55), F('poison', 0.85)) : 0; cupIn.visible = drink < 0.98;
      // space: earths stack in, helix + coil glow
      const en = id === 'earths' ? 1 + 10 * clamp((t - F('earths', 0.15)) / Math.max(0.5, (E('earths') - F('earths', 0.15)) * 0.85)) : (id === 'hook' ? 1 : (['coil', 'cta'].includes(id) ? 11 : 0));
      earths.forEach((e, k) => { const s = clamp(en - k); e.visible = s > 0.01 && id !== 'equator'; e.scale.setScalar(Math.max(0.01, K.easeBack(s))); e.rotation.y = t * 0.15 + k; });
      hMat.map.offset.x = -t * 0.08; headS.tongue.scale.setScalar(K.pulse((t * 1.3) % 1.6, 0, 0.35) + 0.01);
      const eqk = id === 'equator' ? prog(t, F('equator', 0.25), F('equator', 0.55)) : 0; coilGlow.material.opacity = eqk; eqRing.material.opacity = id === 'equator' ? prog(t, F('equator', 0.6), F('equator', 0.85)) : 0; eqEarth.visible = id === 'equator'; eqEarth.rotation.y = t * 0.2;
      // under the milk: kurma rises, pot glows, bubbles
      const kr = id === 'kurma' ? eo(prog(t, F('kurma', 0.3), F('kurma', 0.75))) : 0; turtle.position.y = lerp(-60, -12, kr); kMount.position.y = lerp(-10, 2, id === 'kurma' ? 1 - prog(t, B('kurma'), F('kurma', 0.3)) : 1) - (id === 'kurma' && kr < 0.01 ? 0 : 0);
      kMount.position.y = id === 'kurma' ? (kr > 0 ? lerp(-14, 2, kr) : lerp(2, -14, eo(prog(t, B('kurma'), F('kurma', 0.3))))) : 2;
      potGlow.material.opacity = 0.14 + 0.06 * Math.sin(t * 3); pot.rotation.y = t * 0.2;
      for (let k = 0; k < NBUB; k++) { const b = bp[k], y = -28 + ((t * b.sp + b.ph) % 80); V.set(b.x, y, b.z); SC.setScalar(b.s); Q.identity(); M4.compose(V, Q, SC); bubbles.setMatrixAt(k, M4); } bubbles.instanceMatrix.needsUpdate = true;
      drawHud(t);
    };

    const sfx = [
      ['bass', 0.1, 0.8], ['rustle', 0.4, 0.4], ['riser', F('hook', 0.4), 0.35],
      ...['intro', 'amrit', 'churn', 'pull', 'height', 'earths', 'kurma', 'coil', 'equator', 'poison', 'real', 'cta'].map(n => ['whoosh', B(n) - 0.18, 0.45]),
      ['rustle', B('intro') + 0.3, 0.5], ['chime', B('amrit') + 0.3, 0.6], ['thud', F('churn', 0.5), 1.0], ['rustle', F('churn', 0.6), 0.6], ['thud', B('pull') + 0.4, 0.6], ['riser', B('height') + 0.2, 0.4],
      ...Array.from({ length: 10 }, (_, k) => ['tick', F('earths', 0.15) + (k + 1) * Math.max(0.5, (E('earths') - F('earths', 0.15)) * 0.85) / 10, 0.4]),
      ['bass', F('kurma', 0.4), 0.9], ['whoosh', B('coil') + 0.2, 0.5], ['ding', F('equator', 0.55), 0.6], ['chime', F('equator', 0.85), 0.5], ['bass', B('poison') + 0.1, 0.8], ['chime', F('poison', 0.6), 0.5],
      ['chime', B('real') + 0.3, 0.4], ['chime', B('cta') + 0.2, 0.5], ['pop', B('cta') + 0.3, 0.5], ['ding', B('cta') + 1.4, 0.55],
    ];
    return { duration: D, update, shots: [{ t: [0, 1], from: { pos: [0, 0, 1], look: [0, 0, 0] } }], sfx, watermark: false, endCard: false, music: {}, capFont: 'Fredoka Light', capMarginV: 520, capSize: 66 };
  },
};
