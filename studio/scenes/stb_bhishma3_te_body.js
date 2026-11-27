// Bhishma Part 3/3 — the bed of arrows. STORYBOOK 3D look (Maddy 27 Nov 2026), built on studio/scenes/stb_storybook_kit.js.
// Same Telugu voice lines (Maddy's cloned voice). Settings: green Kurukshetra meadow with camp tents + golden canopy chariot (day),
// indigo night with torches (teaching), rose dawn (Uttarayana), blue-hour diyas (Bhishma Ashtami); ending = navy title card over the empty arrow bed.
window.SCENE = {
  assets: ['assets/chars/worker.glb'],
  setup: { bg: 0x9fb6cf, fog: null, fov: 35, bloom: null },
  lines: window.STB_LINES,
  build(K, T) {
    const A = window.STORYBOOK(K, T);
    const { THREE, S, R, PI, TAU, clamp, lerp, ease, eo, prog, L, LINES, N, IDX, Bt, Et, F, D, XF, V3, rng, mat, GOLD, GOLD2, RUBY, PEARL, SILVER, cloth, strandTex, clothTex, makeHead, hero, heroes, pose, place, makeBow, handBow, arrowField, singleArrow, SKIES, skyTex, setSky, key, hemi, sky, sky2, groupOf, shadowAll, wheel, chariot, horseLegs, waveFlag, banners, bannerFlags, debris, tents, flameTex, glowTex, flames, diya, torch, ptsTex, cloud, fly, dust, sparks, petals, stars, burst, label, tag, pill, cam, C, narr, reg, outdoor, finish } = A;
    const BH = hero({ skin: 0xc08a66, dhoti: 0xf2efe6, sash: 0xc9a24a, hair: 0xeeeae4, beardCol: 0xeeeae4, browCol: 0xf4f0ea, browR: 0.024, crown: 'band', torso: 'armor', sashOn: false, beard: 'long', stache: 'thick', hairStyle: 'long', lip: 0x9a5a4a, seed: 0.7 });
    const AR = hero({ skin: 0xc28654, dhoti: 0xe8b02c, sash: 0xb3241a, crown: 'gold', stache: 'curl', stubble: true, tilak: true, seed: 1.9 });
    const KR = hero({ skin: 0x5a80c4, dhoti: 0xf0c030, sash: 0xd04a1a, crown: 'krishna', lip: 0x7a3a4a, tilak: true, seed: 2.6 });
    const YU = hero({ skin: 0xb07a52, dhoti: 0xf3ead6, sash: 0x7a1830, crown: 'gold', beard: 'short', stache: 'thin', tilak: true, utt: 0x7a1830, seed: 0.3 });
    const SK = hero({ skin: 0xa87048, dhoti: 0x7a1c1c, sash: 0xd8a040, crown: 'helmet', torso: 'tunic', tunic: 0x5a2420, stache: 'thin', seed: 1.2 });
    const SOL = [0, 1, 2, 3, 4, 5].map(i => hero({ skin: [0xa06a44, 0xb07a50, 0x8e5c3a][i % 3], dhoti: [0x6a4a2a, 0x7a2a20, 0x3a4a6a][i % 3], sash: 0x2a2a2a, crown: 'helmet', torso: 'tunic', tunic: [0x6a3a22, 0x4a2a2a, 0x2a3a5a][i % 3], sashOn: false, stache: 'thin', jewel: false, seed: i * 0.77, hairStyle: 'short' }));

    // bow (Gandiva) in Arjuna's left hand
    const bowAR = makeBow(), bowSK = makeBow(); handBow(AR, bowAR); handBow(SK, bowSK);
    // THE BED OF ARROWS (centre of the world). Bhishma lies along x, head at -x.
    const BED = V3(0, 0, 0), BEDH = 0.56;
    const bed = groupOf();
    { const r = rng(31), list = [], up = []; for (let i = 0; i < 46; i++) { const x = -0.95 + r() * 1.9, z = (r() - 0.5) * 0.36; const tilt = (r() - 0.5) * 0.7; list.push([x + tilt * 0.3, -0.04, z, tilt, 1, (r() - 0.5) * 0.5]); }
      for (let i = 0; i < 26; i++) { const x = -0.6 + r() * 1.45, z = (r() - 0.5) * 0.26; up.push([x, BEDH + 0.02 + r() * 0.06, z, (r() - 0.5) * 0.7, 1, (r() - 0.5) * 0.7]); }   // shafts poking up through him
      bed.add(arrowField(list, { len: 0.72 })); bed.add(arrowField(up, { len: 0.42 })); }
    const pillow = arrowField([[-1.32, -0.04, -0.06, -0.25, 1, -0.1], [-1.3, -0.04, 0.08, -0.2, 1, 0.12], [-1.36, -0.04, 0.0, -0.3, 1, 0.0]], { len: 0.6 });
    // arrows sticking in Bhishma while he stands on the chariot (recap / fall)
    const chestArrows = arrowField([[0, 0, 0.05, 0.1, 0.2, 1], [0.12, 0.13, 0.05, -0.1, 0.1, 1], [-0.1, -0.18, 0.05, 0.2, 0.3, 1], [0.05, 0.28, 0.05, 0.0, -0.1, 1], [-0.14, 0.08, 0.05, 0.25, 0.0, 1]], { len: 0.7 });
    // flying arrows (recap) — a small pool
    const flying = [0, 1, 2, 3, 4, 5].map(() => singleArrow());
    // water spring
    const water = groupOf();
    const jetTex = K.canvasTex(64, 256, (x, w, h) => { const g = x.createLinearGradient(0, 0, w, 0); g.addColorStop(0, 'rgba(200,230,255,0)'); g.addColorStop(0.5, 'rgba(235,248,255,0.9)'); g.addColorStop(1, 'rgba(200,230,255,0)'); x.fillStyle = g; x.fillRect(0, 0, w, h); });
    jetTex.wrapT = THREE.RepeatWrapping;
    const jet = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.04, 1, 24, 1, true), new THREE.MeshBasicMaterial({ map: jetTex, color: 0x9ac8f0, transparent: true, opacity: 0.8, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide })); water.add(jet);
    const pool = new THREE.Mesh(new THREE.CircleGeometry(0.4, 40), mat(0x6a8aa8, { roughness: 0.08, metalness: 0.3, transparent: true, opacity: 0.85 })); pool.rotation.x = -PI / 2; pool.position.y = 0.01; water.add(pool);
    // diyas (clay lamps) — flames as additive sprites
    const nightProps = groupOf(); torch(nightProps, -2.4, -1.4); torch(nightProps, 2.2, -1.6); torch(nightProps, -2.0, 1.9, 1.7);
    diya(nightProps, -1.6, 0, 0.55, 1.2, false); diya(nightProps, 1.3, 0, 0.6, 1.2, false);
    const lampField = groupOf();
    { const r = rng(41); for (let i = 0; i < 120; i++) { const a = r() * TAU, d = 1.3 + Math.pow(r(), 0.8) * 7; diya(lampField, Math.cos(a) * d * 1.3, 0, Math.sin(a) * d, 1.1, i < 6); } }
    // dust motes / petals / embers as points
    const book = groupOf();
    { const st = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.08, 0.55), mat(0x5a3418, { roughness: 0.5 })); st.position.y = 0.5; book.add(st);
      for (const sx of [-1, 1]) { const lg = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.5, 0.06), mat(0x4a2a12)); lg.position.set(sx * 0.5, 0.25, 0); book.add(lg); }
      const lt = K.canvasTex(1024, 128, (x, w, h) => { x.fillStyle = '#d9c08a'; x.fillRect(0, 0, w, h); x.fillStyle = '#3a2a1a'; const r = rng(3); for (let row = 0; row < 4; row++) for (let i = 0; i < 70; i++) { x.globalAlpha = 0.55; x.fillRect(40 + i * 13, 22 + row * 26, 6 + r() * 5, 3 + r() * 6); } x.globalAlpha = 1; x.beginPath(); x.arc(w * 0.3, h / 2, 6, 0, TAU); x.arc(w * 0.7, h / 2, 6, 0, TAU); x.fill(); });
      for (let i = 0; i < 9; i++) { const lf = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.012, 0.12), [mat(0xc8a870), mat(0xc8a870), new THREE.MeshStandardMaterial({ map: lt, roughness: 0.8 }), mat(0xc8a870), mat(0xc8a870), mat(0xc8a870)]); lf.position.set(0, 0.55 + i * 0.013, (i === 8 ? 0.0 : 0.0)); lf.rotation.y = (i - 4) * 0.008; book.add(lf); }
      const tp = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.012, 0.12), new THREE.MeshStandardMaterial({ map: lt, roughness: 0.8 })); tp.position.set(0, 0.68, 0.16); tp.rotation.x = -0.05; book.add(tp);
      const thread = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.008, 6, 20), mat(0xa02020)); thread.position.set(0.05, 0.6, 0.0); thread.rotation.y = PI / 2; book.add(thread);
      diya(book, 0.55, 0.54, 0.12, 1.3, true); shadowAll(book); }
    book.position.set(60, 0, 60);
    nightProps.position.set(0, 0, 0); lampField.position.set(0, 0, 0);
    // big title wheel for the ending
    const bigWheel = wheel(1.6); bigWheel.position.set(-60, 2.0, -60); S.add(bigWheel); shadowAll(bigWheel);
    const SRC = { recap: 'BHEESHMA PARVA', fall: 'BHEESHMA PARVA', bed: 'BHEESHMA PARVA', stop: 'BHEESHMA PARVA', pillow: 'BHEESHMA PARVA', thirst: 'BHEESHMA PARVA', water: 'BHEESHMA PARVA', wait: 'BHEESHMA PARVA', days: 'SHANTI PARVA', teach: 'SHANTI PARVA', sun: 'ANUSHAASANA PARVA', ashtami: 'ANUSHAASANA PARVA', source: 'MAHABHARATAM' };
    // Bhishma lying on the bed (head at -x): face up
    const lieBH = (t, { headDrop = 0, close = 0, talk = 0, look = [0, 0] } = {}) => { place(BH, BED.x + 0.95, BEDH, BED.z, -PI / 2, -PI / 2, 0); BH.root.rotation.set(0, 0, 0); BH.root.position.set(BED.x - 1.0, BEDH, BED.z);
      // build orientation: body along +x (feet), face up: rotate so model +y -> world -x... use quaternion
      BH.root.quaternion.setFromEuler(new THREE.Euler(0, 0, 0)); const q1 = new THREE.Quaternion().setFromAxisAngle(V3(1, 0, 0), -PI / 2), q2 = new THREE.Quaternion().setFromAxisAngle(V3(0, 1, 0), PI / 2);
      BH.root.quaternion.copy(q2.multiply(q1)); BH.root.position.set(BED.x + 0.92, BEDH + 0.06, BED.z);
      pose(BH, 'Man_Idle', 0.2, { Neck: [-0.45 * headDrop + 0.08, 0, 0], UpperArmL: [0, -0.1, 0.0], UpperArmR: [0, 0.1, 0] });
      BH.head.update(t, { talk, close, look }); BH.root.updateMatrixWorld(true); BH.head.getWorldPosition(HP); BH.head.localToWorld(NP.set(0, 0.05, 0.38)); };
    const HP = V3(-0.8, 0.7, 0), NP = V3(-0.85, 0.75, 0);
    const ARMS_BOW = d => ({ UpperArmL: [0, -1.2, 0.5], LowerArmL: [0, 0, 0.1], UpperArmR: [0, 0.9, 0.7], LowerArmR: [0, 0, 0.6 + 1.2 * d], Neck: [0, -0.35, 0] });
    const standAR = (t, x, z, ry, offs = {}, face = {}) => { place(AR, x, 0, z, ry); pose(AR, 'Man_Idle', t, offs); AR.head.update(t, face); };
    const SH = {
      recap: (t, u) => { setSky('gold', V3(0, 0, -3)); [chariot, banners, debris, chestArrows, ...flying].forEach(o => o.visible = true); chariot.position.set(0.2, 0, -9); chariot.rotation.y = -1.3;
        place(BH, 0.3, 0.95, -9.1, 0.35); pose(BH, 'Man_Idle', t * 0.8, { UpperArmL: [0, 0, 0.2], Neck: [0.1, 0, 0] }); BH.head.update(t, { close: 0.2 });
        BH.root.updateMatrixWorld(true); chestArrows.position.copy(BH.B.Torso.getWorldPosition(V3(0, 0, 0))); chestArrows.quaternion.copy(BH.root.quaternion); chestArrows.scale.setScalar(K.ease(u));
        place(SK, 0.5, 0, 1.4, PI + 0.1); pose(SK, 'Man_Idle', t + 1, ARMS_BOW(0.4)); SK.head.update(t, {});
        place(AR, 1.2, 0, 3.4, PI + 0.06); pose(AR, 'Man_Idle', t, ARMS_BOW(0.5 + 0.5 * Math.abs(Math.sin(u * 7)))); AR.head.update(t, { brow: -0.6 });
        flying.forEach((a, i) => { const k = ((u * 2.4 + i / flying.length) % 1); const from = V3(1.1, 1.75, 2.8), to = V3(0.3 + (i - 2.5) * 0.08, 2.0, -8.9); a.position.copy(from.clone().lerp(to, k)); a.position.y += Math.sin(k * PI) * 0.8; a.lookAt(to); a.rotateX(-PI / 2); a.visible = k > 0.04 && k < 0.96; });
        C([1.05, 1.75, 5.3], [0.85, 1.8, 4.7], [0.0, 1.6, -9], [0.1, 1.7, -9], u, 32);
        A.HUD = x => { const a = 1 - clamp((u - 0.75) * 5); label(x, 'Ampashayya', 540, 300, 76, '#ffffff', a, 'EB Garamond', '600'); label(x, 'BHEESHMUDU  ·  PART 3 / 3', 540, 372, 30, '#f2d79a', a, 'EB Garamond', '500', 4); }; },
      fall: (t, u) => { setSky('gold', V3(0, 0, -9)); [chariot, banners, debris, burst, chestArrows].forEach(o => o.visible = true); chariot.position.set(0.2, 0, -9); chariot.rotation.y = -1.3;
        const k = K.easeIn(clamp((u - 0.2) / 0.5));
        place(BH, 0.3, 0.95, -9.1, 0.35); BH.root.rotation.set(-k * 1.5, 0.35, 0, 'YXZ'); BH.root.position.set(0.3 - k * 0.4, 0.95 - k * 0.85, -9.1 - k * 1.0);
        pose(BH, 'Man_Idle', t, { UpperArmL: [0, 0, -0.9 * k], UpperArmR: [0, 0, -0.9 * k], Neck: [-0.4 * k, 0, 0] }); BH.head.update(t, { close: k * 0.7, brow: 1 - k });
        BH.root.updateMatrixWorld(true); chestArrows.position.copy(BH.B.Torso.getWorldPosition(V3(0, 0, 0))); chestArrows.quaternion.copy(BH.root.quaternion);
        burst.visible = u > 0.68; fly(burst, (u - 0.68) * 6, { c: V3(-0.1, 0, -10.2), sx: 2 + (u - 0.68) * 6, sz: 2, sy: 1.0, vy: 0.3 });
        C([2.5, 0.7, -5.0], [2.2, 0.6, -5.6], [0.2, 2.0, -9.2], [0.0, 1.0, -9.8], u, 36); },
      bed: (t, u) => { setSky('gold'); [bed, banners, debris].forEach(o => o.visible = true); lieBH(t, { headDrop: 1, close: 0.45 });
        C([HP.x + 2.6, 1.35, 1.9], [HP.x + 2.1, 1.15, 1.5], [HP.x + 0.4, 0.6, 0], [HP.x + 0.2, 0.62, 0], u, 34);
        A.HUD = x => tag(x, 'SHARA SHAYYA', K.pulse(u, 0.05, 0.9), 'The bed of arrows'); },
      stop: (t, u) => { setSky('gold'); [bed, banners, debris].forEach(o => o.visible = true); lieBH(t, { headDrop: 1, close: 0.3 });
        SOL.forEach((M, i) => { const a = PI * 1.15 + i * 0.3, d = 3.2 + (i % 2) * 0.7; place(M, Math.cos(a) * d * 1.2, 0, Math.sin(a) * d, -a - PI / 2); pose(M, 'Man_Idle', t + i, { Neck: [0.35, 0, 0] }); M.head.update(t, { close: 0.25 }); });
        place(AR, 1.5, 0, 1.4, -2.3); pose(AR, 'Man_Idle', t, { Neck: [0.4, 0, 0] }); AR.head.update(t, { close: 0.3 });
        place(KR, -1.8, 0, 1.5, 2.4); pose(KR, 'Man_Idle', t + 2, { Neck: [0.25, 0, 0] }); KR.head.update(t, {});
        place(YU, -0.2, 0, 1.6, PI + 0.1); pose(YU, 'Man_Idle', t + 3, { Neck: [0.4, 0, 0] }); YU.head.update(t, { close: 0.3 });
        place(SK, 2.4, 0, -1.4, -1.0); pose(SK, 'Man_Idle', t + 4, { Neck: [0.3, 0, 0] }); SK.head.update(t, { close: 0.3 });
        C([1.0, 6.0, 7.5], [0.6, 3.6, 5.4], [0, 0.3, -0.6], [0, 0.6, 0], u, 32); },
      pillow: (t, u) => { setSky('gold'); [bed, banners, debris].forEach(o => o.visible = true); const rest = eo(clamp((u - 0.62) / 0.3));
        lieBH(t, { headDrop: 1 - rest * 0.95, talk: u < 0.45 ? narr(t) : 0, close: 0.15 });
        pillow.visible = u > 0.48; pillow.position.set(HP.x + 1.32, (1 - eo(clamp((u - 0.48) / 0.12))) * 2.5, 0);
        C([NP.x + 0.25, NP.y + 0.3, 1.75], [NP.x + 0.15, NP.y + 0.25, 1.45], [NP.x + 0.1, NP.y - 0.12, 0], [NP.x + 0.05, NP.y - 0.08, 0], u, 34); },
      thirst: (t, u) => { setSky('gold'); [bed, banners, debris, burst, pillow].forEach(o => o.visible = true); lieBH(t, { close: 0.2 }); pillow.position.set(HP.x + 1.32, 0, 0);
        const draw = eo(clamp(u / 0.5)), rel = u > 0.78;
        place(AR, HP.x - 1.1, 0, 1.0, 2.3); pose(AR, 'Man_Idle', t, Object.assign(ARMS_BOW(rel ? 0.1 : draw), { Torso: [0.45, 0, 0], Neck: [0.25, 0, 0] })); AR.head.update(t, { brow: -0.6 });
        burst.visible = rel; fly(burst, (u - 0.78) * 8, { c: V3(HP.x - 0.4, 0, 0.55), sx: 0.4 + (u - 0.78) * 3, sz: 0.4 + (u - 0.78) * 3, sy: 0.5, vy: 0.2 });
        C([HP.x + 0.7, 0.45, 3.6], [HP.x + 0.5, 0.5, 3.3], [HP.x - 0.9, 1.25, 0.9], [HP.x - 0.8, 1.15, 0.8], u, 36); },
      water: (t, u) => { setSky('gold'); [bed, banners, debris, water, sparks, pillow].forEach(o => o.visible = true); pillow.position.set(HP.x + 1.32, 0, 0);
        lieBH(t, { close: u > 0.6 ? 0.7 : 0.1, look: [-0.4, 0] });
        const hgt = eo(clamp(u * 2.2)) * 1.25; water.position.set(HP.x - 0.45, 0, 0.5); jet.scale.set(1, hgt, 1); jet.position.y = hgt / 2; jetTex.offset.y = -t * 2.5; pool.scale.setScalar(0.3 + eo(clamp(u * 2)) * 0.8);
        fly(sparks, t, { c: V3(HP.x - 0.45, 0, 0.5), sx: 0.5, sz: 0.5, sy: hgt + 0.2, vy: 0.9, y0: 0 });
        C([HP.x + 0.2, 1.3, 3.1], [HP.x + 0.1, 1.2, 2.8], [HP.x - 0.2, 0.75, 0.3], [HP.x - 0.2, 0.8, 0.3], u, 34); },
      wait: (t, u) => { setSky('gold'); [bed, banners, debris, pillow].forEach(o => o.visible = true); pillow.position.set(HP.x + 1.32, 0, 0); lieBH(t, { close: 0, look: [0, 0.6] });
        C([NP.x + 0.02, NP.y + 0.95, 0.02], [NP.x + 0.02, NP.y + 0.7, 0.01], [NP.x + 0.02, NP.y, 0], [NP.x + 0.02, NP.y, 0], u, 30); cam.up = 1;
        A.HUD = x => tag(x, 'UTTARAYANAM', K.pulse(u, 0.35, 0.65), 'When the sun turns north'); },
      days: (t, u) => { const cyc = (u * 2.6) % 1, nightness = clamp(Math.sin(cyc * TAU) * 1.4 + 0.5);
        setSky('gold', V3(0, 0, 0), 'night', nightness); [bed, banners, debris, pillow].forEach(o => o.visible = true); lieBH(t, { close: 0.1 }); pillow.position.set(HP.x + 1.32, 0, 0);
        stars.visible = true; stars.material.opacity = nightness; fly(stars, t, { c: V3(0, 6, 0), sx: 40, sz: 40, sy: 10, vy: 0 });
        const a = -0.6 + u * 1.3; C([Math.sin(a) * 5.5, 2.6, Math.cos(a) * 5.5], [Math.sin(a + 0.3) * 5.0, 2.3, Math.cos(a + 0.3) * 5.0], [0, 0.5, 0], [0, 0.5, 0], u, 34, x => x);
        A.HUD = x => { label(x, String(Math.min(58, Math.floor(eo(clamp(u * 1.05)) * 58))), 540, 520, 200, '#fff4d8', eo(clamp(u * 4)), 'EB Garamond', '700'); label(x, 'RAATHRULU', 540, 650, 40, '#f0e2c0', eo(clamp(u * 4)), 'EB Garamond', '700', 8); }; },
      teach: (t, u) => { setSky('night', V3(0, 0, 0)); [bed, nightProps, debris, pillow].forEach(o => o.visible = true); pillow.position.set(HP.x + 1.32, 0, 0); key.intensity = 0.5; hemi.intensity = 0.35;
        lieBH(t, { talk: narr(t) * 0.8, close: 0.1, look: [0.3, -0.2] });
        place(YU, HP.x + 0.35, 0, 0.95, PI); pose(YU, 'Man_Sitting', 0.6, { Neck: [0.3, 0, 0], Torso: [0.2, 0, 0] }); YU.root.position.y = -0.05; YU.head.update(t, { close: 0.2 });
        place(KR, HP.x + 1.3, 0, 1.55, PI + 0.4); pose(KR, 'Man_Idle', t, { Neck: [0.3, 0, 0] }); KR.head.update(t, { look: [0, -0.4] });
        C([HP.x - 0.6, 1.6, -2.0], [HP.x - 0.45, 1.45, -1.7], [HP.x + 0.25, 0.82, 0.5], [HP.x + 0.25, 0.82, 0.5], u, 34);
        A.HUD = x => tag(x, 'RAAJADHARMAM', K.pulse(u, 0.05, 0.6), 'Kurukshetra, at night'); },
      sun: (t, u) => { setSky('dawn', V3(0, 0, 0)); [bed, banners, debris, dust, pillow].forEach(o => o.visible = true); pillow.position.set(HP.x + 1.32, 0, 0); const c = eo(clamp((u - 0.45) / 0.35));
        lieBH(t, { close: c, look: [0, 0.4] });
        C([NP.x + 0.12, NP.y + 0.18, 1.1], [NP.x + 0.08, NP.y + 0.12, 0.8], [NP.x - 0.02, NP.y - 0.02, 0], [NP.x - 0.02, NP.y - 0.02, 0], u, 30);
        A.HUD = x => { const w = clamp((u - 0.82) / 0.18) * 0.35; if (w > 0) { x.fillStyle = `rgba(255,246,226,${w})`; x.fillRect(0, 0, 1080, 1920); } }; },
      ashtami: (t, u) => { setSky('blue', V3(0, 0, 0)); [bed, lampField, petals].forEach(o => o.visible = true); pillow.visible = true; pillow.position.y = 0; key.intensity = 0.4;
        fly(petals, t, { c: V3(0, 0, 0), sx: 10, sz: 8, sy: 5, vy: -0.35, vx: 0.05 });
        C([5.5, 1.1, 6.0], [3.0, 1.4, 4.2], [0, 0.4, 0], [0, 0.6, 0], u, 34);
        A.HUD = x => { label(x, 'భీష్మ అష్టమి', 540, 470, 108, '#ffe7b0', eo(clamp(u * 3)) * (1 - clamp((u - 0.92) * 12)), 'Noto Sans Telugu', '700'); tag(x, 'MAGHA SHUKLA ASHTAMI', eo(clamp((u - 0.2) * 3))); }; },
      source: (t, u) => { setSky('night', V3(60, 0, 60)); book.visible = true; key.intensity = 0.25; hemi.intensity = 0.3;
        C([61.6, 1.35, 61.5], [61.15, 1.15, 61.1], [60.0, 0.6, 60.0], [60.0, 0.62, 60.05], u, 30);
        A.HUD = x => { label(x, 'MAHABHARATAM', 540, 360, 64, '#f6e2b0', eo(clamp(u * 3)), 'EB Garamond', '700', 4); label(x, 'Bheeshma Parva  ·  Anushaasana Parva', 540, 440, 38, '#f0e6d0', eo(clamp((u - 0.2) * 3)), 'EB Garamond', '400'); }; },
      cta: (t, u) => { setSky('night', V3(0, 0, 0)); [bed, pillow, nightProps].forEach(o => o.visible = true); pillow.position.set(-0.78 + 1.32, 0, 0); key.intensity = 0.35; hemi.intensity = 0.4;
        C([2.2, 3.2, 3.0], [1.9, 2.9, 2.6], [-0.1, 0.4, 0], [-0.1, 0.45, 0], u, 30);
        A.HUD = x => { const a = eo(clamp(u * 2.5));
          let g = x.createLinearGradient(0, 0, 0, 760); g.addColorStop(0, `rgba(12,12,34,${a})`); g.addColorStop(0.75, `rgba(12,12,34,${0.92 * a})`); g.addColorStop(1, 'rgba(12,12,34,0)'); x.fillStyle = g; x.fillRect(0, 0, 1080, 760);
          g = x.createLinearGradient(0, 1150, 0, 1920); g.addColorStop(0, 'rgba(12,12,34,0)'); g.addColorStop(0.3, `rgba(12,12,34,${0.9 * a})`); g.addColorStop(1, `rgba(12,12,34,${a})`); x.fillStyle = g; x.fillRect(0, 1150, 1080, 770);
          label(x, 'BHEESHMUDU', 540, 300, 34, '#f2d79a', a, 'EB Garamond', '500', 5); label(x, 'PART 3 / 3', 540, 345, 24, '#f2d79a', a * 0.9, 'EB Garamond', '500', 4);
          x.save(); x.globalAlpha = a * 0.8; x.fillStyle = '#e8c46a'; x.fillRect(440, 378, 200, 2); x.restore();
          label(x, 'Ampashayya', 540, 455, 92, '#ffffff', a, 'EB Garamond', '500', 0, true); label(x, 'అంపశయ్య', 540, 545, 46, '#f2d79a', a, 'Noto Sans Telugu', '600');
          label(x, 'FOLLOW FOR MORE STORIES', 540, 1590, 30, '#ffffff', eo(clamp((t - (Bt('cta') + 0.5)) / 0.5)), 'EB Garamond', '600', 4); }; },
    };
    if (window.LOOK) { SH.recap = (t, u) => { setSky('gold', V3(0, 0, 0)); debris.visible = true;
        const who = [BH, AR, KR, YU, SK, SOL[0]]; who.forEach((M, i) => { place(M, (i - 2.5) * 0.95, 0, 0, 0); pose(M, 'Man_Idle', 0.3); M.head.update(0.3, {}); });
        const z = window.LOOK > 1, X = window.LOOK === 2 ? -1.425 : -2.375; C(z ? [X + 0.3, 1.62, 1.4] : [0, 1.0, 6.4], z ? [X, 1.62, 1.3] : [0, 1.0, 6.4], z ? [X, 1.58, 0] : [0, 0.95, 0], z ? [X, 1.58, 0] : [0, 0.95, 0], 0, z ? 30 : 34); }; }
    const SFX = [['bass', 0.05, 0.6], ['whoosh', F('recap', 0.3), 0.4], ['whoosh', F('recap', 0.6), 0.35], ['thud', F('fall', 0.75), 0.9], ['bass', F('fall', 0.76), 0.7], ['riser', Bt('bed'), 0.35], ['chime', F('bed', 0.5), 0.35],
      ['whoosh', F('pillow', 0.48), 0.4], ['thud', F('pillow', 0.6), 0.5], ['whoosh', F('thirst', 0.76), 0.5], ['thud', F('thirst', 0.8), 0.6], ['chime', F('water', 0.15), 0.5], ['chime', F('water', 0.5), 0.35],
      ['riser', Bt('sun'), 0.3], ['chime', F('sun', 0.7), 0.5], ['chime', Bt('ashtami') + 0.3, 0.4], ['pop', Bt('cta') + 0.6, 0.5], ['ding', Bt('cta') + 1.6, 0.5]];
    reg(bed, pillow, chestArrows, water, nightProps, lampField, book, bigWheel, ...flying);
    return finish({ SH, SRC, SFX });
  },
};
