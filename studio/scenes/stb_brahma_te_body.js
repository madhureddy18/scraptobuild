// Why is Brahma rarely worshipped? (Pushkar). STORYBOOK 3D look (redo 27 Nov 2026), built on studio/scenes/stb_storybook_kit.js.
// Same Telugu voice lines (Maddy's cloned voice). Sets: cloud heaven with Brahma (three faces) on a giant lotus; the lotus falling to the
// desert; sand-gold Pushkar with a turquoise lake, white ghats, red-spired temple and Savitri's hill; the yagna fire with devas;
// a starry void with Shiva's endless pillar of fire (Brahma up, Vishnu down, the ketaki flower). Ending: Pushkar at night with lamps.
window.SCENE = {
  assets: ['assets/chars/worker.glb'],
  setup: { bg: 0x9fb6cf, fog: null, fov: 35, bloom: null },
  lines: window.STB_LINES,
  build(K, T) {
    const A = window.STORYBOOK(K, T);
    const { THREE, S, PI, TAU, clamp, lerp, ease, eo, prog, L, Bt, Et, F, D, V3, rng, mat, GOLD, hero, heroes, makeHead, pose, place, setSky, key, hemi, groupOf, shadowAll,
      flames, diya, fly, dust, sparks, petals, stars, label, tag, cam, C, narr, reg, outdoor, finish, waterTex, makeWater, makeHeaven, makeBook, endCard, titleCard, P_, mix_, bonfire, snake, bigLotus, makeTemple, flameTex, glowTex } = A;

    // ---------------------------------------------------------------- cast
    const bo = { skin: 0xd8a060, dhoti: 0xe05a2a, sash: 0xf0c030, utt: 0xf0c030, hair: 0xeeeae4, beard: 'long', beardCol: 0xeeeae4, browCol: 0xf4f0ea, stache: 'thick', crown: 'gold', lip: 0x9a5a4a, seed: 1.1 };
    const BR = hero(bo);
    for (const sx of [-1, 1]) { const h2 = makeHead(Object.assign({}, bo, { crown: 'gold' })); h2.position.set(sx * 0.6, 0.0, -0.3); h2.rotation.y = sx * 1.25; h2.scale.setScalar(0.9); BR.head.add(h2); }
    const SA = hero({ female: true, skin: 0xd8a888, dhoti: 0xc81e3a, sash: 0xe8b23a, blouse: 0xe8b23a, utt: 0xc81e3a, crown: 'tiara', earrings: true, bindi: true, lip: 0xb04050, browR: 0.011, seed: 2.4 });
    const GY = hero({ female: true, skin: 0xb07a52, dhoti: 0x3a8ad0, sash: 0xf2ede0, blouse: 0xf2ede0, utt: 0x3a8ad0, crown: 'bun', flower: true, earrings: true, bindi: true, lip: 0xa04048, browR: 0.011, seed: 3.3 });
    const VI = hero({ skin: 0x4d78c0, dhoti: 0xf0c030, sash: 0xd04a1a, crown: 'gold', tilak: true, lip: 0x7a3a4a, seed: 4.1 });
    const SV = hero({ skin: 0x8aa8cc, dhoti: 0xf2e6d0, sash: 0x8a6a4a, utt: 0xe0d0b0, hair: 0x2a2a3a, crown: 'jata', moon: true, ganga: true, jewel: false, tilak: true, lip: 0x6a4a5a, seed: 6.6 });
    const DEV = [0, 1, 2].map(i => hero({ skin: [0xe0b090, 0xd8a47a, 0xe8b898][i], dhoti: 0xf8f4ea, sash: [0xc0302a, 0xd89a2a, 0x2a7ac0][i], crown: 'gold', tilak: true, seed: 8 + i }));
    snake(SV);
    const face = (M, x, z) => { M.root.rotation.y = Math.atan2(x - M.root.position.x, z - M.root.position.z); };

    // ---------------------------------------------------------------- sets
    const heaven = makeHeaven(0, 40, 200);
    const throneLotus = bigLotus(2.2); throneLotus.position.set(0, 40.3, 200); S.add(throneLotus);
    const fallLotus = bigLotus(1.4); S.add(fallLotus);
    const X0 = 400;   // Pushkar: sand ground, dunes, lake, ghats, temple, Savitri hill
    const desert = groupOf();
    { const sandT = K.canvasTex(512, 512, (x, w, h) => { x.fillStyle = '#e2bf7e'; x.fillRect(0, 0, w, h); const r = rng(8); for (let i = 0; i < 900; i++) { x.fillStyle = `rgba(${170 + r() * 60},${130 + r() * 50},${70 + r() * 30},0.25)`; x.beginPath(); x.ellipse(r() * w, r() * h, 6 + r() * 30, 2 + r() * 6, 0.2, 0, TAU); x.fill(); } });
      sandT.wrapS = sandT.wrapT = THREE.RepeatWrapping; sandT.repeat.set(40, 40);
      const g = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), mat(0xffffff, { map: sandT, roughness: 1 })); g.rotation.x = -PI / 2; g.position.set(X0, 0.015, 0); desert.add(g);
      const r = rng(19); for (let i = 0; i < 16; i++) { const a = PI + (r() - 0.5) * 2.6, d = 35 + r() * 45; const du = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 12), mat(0xd8ae6a)); du.scale.set(12 + r() * 12, 3 + r() * 5, 10 + r() * 8); du.position.set(X0 + Math.sin(a) * d, -1, Math.cos(a) * d); desert.add(du); }
      const hill = new THREE.Mesh(new THREE.ConeGeometry(16, 13, 40), mat(0xc89a5a)); hill.position.set(X0 + 14, 6.5, -42); desert.add(hill);
      const lake = makeWater(X0, -6, 1, 1); lake.geometry = new THREE.CircleGeometry(7, 64); desert.add(lake);
      for (let i = 0; i < 4; i++) { const st = new THREE.Mesh(new THREE.CylinderGeometry(7.4 + i * 0.6, 7.4 + i * 0.6, 0.25 + i * 0.25, 64, 1, false, PI * 0.55, PI * 0.9), mat(i % 2 ? 0xf2e8d8 : 0xe8dcc6)); st.position.set(X0, (0.25 + i * 0.25) / 2, -6); desert.add(st); }
      for (let i = 0; i < 12; i++) { const a = PI * 0.6 + i / 11 * PI * 0.8; const pv = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.6, 0.9), mat(0xf6efe2)); pv.position.set(X0 + Math.sin(a) * 10.4, 0.8, -6 + Math.cos(a) * 10.4); desert.add(pv);
        const dm = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 8, 0, TAU, 0, PI / 2), mat(0xf6efe2)); dm.position.set(pv.position.x, 1.6, pv.position.z); desert.add(dm); }
      shadowAll(desert); }
    const temple = makeTemple(0xc0402a, 1.3); temple.position.set(X0 + 6.5, 0, -13); temple.rotation.y = -0.5;
    const savTemple = makeTemple(0xf2e6d0, 0.6); savTemple.position.set(X0 + 14, 13, -42);
    const altar = groupOf(); { const b = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.45, 1.4), mat(0xb0502a)); b.position.y = 0.22; altar.add(b); const ib = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.1, 1.0), mat(0x3a1a0a)); ib.position.y = 0.46; altar.add(ib); shadowAll(altar); bonfire(altar, 0, 0, 0.6, true); altar.children[altar.children.length - 1].position.y = 0.45; }
    altar.position.set(X0, 0, 6);
    const lamps = groupOf(); for (let i = 0; i < 40; i++) { const a = PI * 0.6 + (i / 39) * PI * 0.8, rr = 7.8 + (i % 3) * 0.6; diya(lamps, X0 + Math.sin(a) * rr, 0.26 + (i % 3) * 0.25, -6 + Math.cos(a) * rr, 1.1, i % 10 === 0); }
    for (let i = 0; i < 18; i++) { const r = rng(i + 50); diya(lamps, X0 + (r() - 0.5) * 9, 0.05, -6 + (r() - 0.5) * 9, 1.4, false); }
    // pillar of fire in a starry void
    const PX = 600, pillar = groupOf(); { const ft = K.canvasTex(256, 1024, (x, w, h) => { const g = x.createLinearGradient(0, 0, w, 0); g.addColorStop(0, 'rgba(255,120,20,0)'); g.addColorStop(0.3, 'rgba(255,170,60,0.9)'); g.addColorStop(0.5, 'rgba(255,250,220,1)'); g.addColorStop(0.7, 'rgba(255,170,60,0.9)'); g.addColorStop(1, 'rgba(255,120,20,0)'); x.fillStyle = g; x.fillRect(0, 0, w, h);
        const r = rng(4); for (let i = 0; i < 120; i++) { x.fillStyle = `rgba(255,${200 + r() * 55},${120 + r() * 100},${r() * 0.5})`; x.beginPath(); x.ellipse(r() * w, r() * h, 6 + r() * 20, 30 + r() * 80, 0, 0, TAU); x.fill(); } });
      ft.wrapT = THREE.RepeatWrapping; ft.repeat.y = 6; pillar.userData.tex = ft;
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 400, 32, 1, true), new THREE.MeshBasicMaterial({ map: ft, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false })); col.position.y = 0; pillar.add(col);
      const col2 = new THREE.Mesh(new THREE.CylinderGeometry(1.7, 1.7, 400, 32, 1, true), new THREE.MeshBasicMaterial({ map: ft, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false })); pillar.add(col2);
      const pl = new THREE.PointLight(0xffa040, 30, 30, 1.4); pl.position.set(0, 0, 3); pillar.add(pl); }
    pillar.position.set(PX, 0, 0);
    const ketaki = groupOf(); for (let i = 0; i < 7; i++) { const p = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 8), mat(0xf6f0c8)); p.scale.set(0.35, 2.2, 0.2); p.rotation.z = (i - 3) * 0.22; p.position.set((i - 3) * 0.04, 0.2, 0); ketaki.add(p); }
    const book = makeBook(); book.position.set(60, 0, 60);
    reg(heaven, throneLotus, fallLotus, desert, temple, savTemple, altar, lamps, pillar, ketaki, book);

    // ---------------------------------------------------------------- shots
    const P1 = 'PADMA PURAANAM', P2 = 'SHIVA PURAANAM';
    const SRC = { hook: P1, lotus: P1, lake: P1, yagna: P1, late: P1, time: P1, arrive: P1, curse: P1, hill: P1, pillar: P2, race: P2, lie: P2, shiva: P2, today: 'PUSHKAR, RAJASTHAN' };
    const pushkar = (sky = 'gold') => { setSky(sky, V3(X0, 0, 0)); outdoor(false); [desert, temple, savTemple].forEach(o => o.visible = true); };
    const yagnaSet = (t, { brahmaLook = [0, 0], gay = false } = {}) => { altar.visible = true;
      place(BR, X0 - 1.4, 0, 6.2, PI / 2); pose(BR, 'Man_Sitting', 0.6, P_.namaste); BR.root.position.y = -0.05; BR.head.update(t, { look: brahmaLook });
      DEV.forEach((M, i) => { const a = -0.6 + i * 0.8; place(M, X0 + Math.cos(a) * 1.9, 0, 6 + Math.sin(a) * 1.9, 0); face(M, X0, 6); pose(M, 'Man_Sitting', 0.6, P_.namaste); M.root.position.y = -0.05; M.head.update(t, { close: 0.6 }); });
      if (gay) { place(GY, X0 - 1.35, 0, 6.95, PI / 2); pose(GY, 'Man_Sitting', 0.6, P_.namaste); GY.root.position.y = -0.05; GY.head.update(t, { close: 0.3 }); } };
    const SH = {
      hook: (t, u) => { setSky('gold', V3(0, 40, 200)); outdoor(false); [heaven, throneLotus].forEach(o => o.visible = true);
        place(BR, 0, 40.55, 200, 0); pose(BR, 'Man_Sitting', 0.6, { UpperArmR: [0, 0.6, 1.0], LowerArmR: [0, 0, 1.2] }); BR.head.update(t, { talk: narr(t) * 0.5 });
        C([0.4, 41.3, 205.5], [0.2, 41.5, 204.0], [0, 41.3, 200], [0, 41.4, 200], u, 34);
        A.HUD = x => titleCard(x, u, 'Brahma', 'SRUSHTI KARTHA  ·  PUSHKAR'); },
      lotus: (t, u) => { setSky('gold', V3(X0, 0, 0)); outdoor(false); desert.visible = true; fallLotus.visible = true; const k = eo(u);
        fallLotus.position.set(X0 + 2 - 2 * k, lerp(26, 1.0, K.easeIn(u)), -6 + (1 - k) * 3); fallLotus.rotation.set(Math.sin(t * 2) * 0.4, t * 1.5, Math.cos(t * 1.7) * 0.3);
        const lp = fallLotus.position; cam.p.set(lp.x + 2.2, lp.y + 0.6, lp.z + 4.2); cam.l.copy(lp); cam.fov = 36; },
      lake: (t, u) => { pushkar('gold'); sparks.visible = true; const k = eo(clamp(u * 1.5)); desert.children.forEach(c => { if (c.geometry && c.geometry.type === 'CircleGeometry') c.scale.setScalar(Math.max(0.01, k)); });
        fallLotus.visible = true; fallLotus.position.set(X0, 0.05, -6); fallLotus.rotation.set(0, t * 0.2, 0); fly(sparks, t, { c: V3(X0, 0, -6), sx: 6, sz: 6, sy: 2, vy: 0.4 });
        C([X0 + 8, 6.5, 8], [X0 + 6, 5.0, 6.5], [X0, 0, -6], [X0, 0.4, -7], u, 36);
        A.HUD = x => tag(x, 'PUSHKAR', K.pulse(u, 0.1, 0.85), 'Where the lotus fell'); },
      yagna: (t, u) => { pushkar('gold'); yagnaSet(t); C([X0 + 4.6, 2.4, 10.4], [X0 + 3.6, 2.0, 9.4], [X0, 0.8, 6], [X0, 0.8, 6], u, 34);
        A.HUD = x => tag(x, 'MAHAA YAGNAM', K.pulse(u, 0.1, 0.8), 'All the gods came'); },
      late: (t, u) => { pushkar('gold'); yagnaSet(t, { brahmaLook: [Math.sin(t * 1.4) * 0.8, 0] }); BR.head.update(t, { look: [Math.sin(t * 1.4) * 0.8, 0], brow: 0.6 });
        const hp = V3(X0 - 1.4, 1.25, 6.2); C([hp.x + 1.4, 1.35, hp.z + 1.9], [hp.x + 1.1, 1.3, hp.z + 1.5], [hp.x, 1.15, hp.z + 0.3], [hp.x, 1.15, hp.z + 0.3], u, 32); },
      time: (t, u) => { pushkar('gold'); yagnaSet(t, { gay: u > 0.35 }); if (u <= 0.35) { place(GY, X0 - 4, 0, 9, 0); face(GY, X0 - 1.4, 6.2); pose(GY, 'Man_Walk', t); GY.root.position.x = lerp(X0 - 4.5, X0 - 2.3, u / 0.35); GY.head.update(t, {}); }
        C([X0 + 1.6, 1.6, 10.6], [X0 + 1.0, 1.5, 10.0], [X0 - 1.6, 0.9, 6.6], [X0 - 1.4, 0.9, 6.6], u, 34);
        A.HUD = x => tag(x, 'GAAYATHRI', K.pulse(u, 0.3, 0.7), 'A new bride for the yagna'); },
      arrive: (t, u) => { pushkar('gold'); yagnaSet(t, { gay: true }); const w = clamp(u * 1.6); place(SA, lerp(X0 + 5, X0 + 2.2, w), 0, lerp(12, 8.6, w), 0); face(SA, X0 - 1.4, 6.6);
        pose(SA, w < 1 ? 'Man_Walk' : 'Man_Idle', t, w < 1 ? {} : { UpperArmR: [0, 0.5, 0.6], Neck: [-0.1, 0, 0] }); SA.head.update(t, { brow: w >= 1 ? 1 : 0 });
        C([X0 + 4.4, 1.7, 12.6], [X0 + 4.0, 1.65, 12.0], [X0 + 0.6, 1.0, 7.2], [X0 + 0.2, 1.0, 7.0], u, 34); },
      curse: (t, u) => { pushkar('dawn'); yagnaSet(t, { gay: true }); BR.head.update(t, { brow: 1, close: 0.2 }); place(SA, X0 + 2.2, 0, 8.6, 0); face(SA, X0 - 1.4, 6.6); pose(SA, 'Man_Idle', t, mix_(P_.point, { Neck: [-0.15, 0, 0] })); SA.head.update(t, { talk: narr(t), brow: -1 });
        const fo = A.frontOf(SA, 1.6, -0.2, -0.5), fo2 = A.frontOf(SA, 1.25, -0.25, -0.35); C(fo.p.toArray(), fo2.p.toArray(), fo.h.toArray(), fo2.h.toArray(), u, 32);
        A.HUD = x => { const k = Math.max(0, 1 - Math.abs(u - 0.4) * 6); if (k > 0) { x.fillStyle = `rgba(255,60,40,${0.25 * k})`; x.fillRect(0, 0, 1080, 1920); } tag(x, 'SAAVITHRI SHAAPAM', K.pulse(u, 0.05, 0.85)); }; },
      hill: (t, u) => { pushkar('dawn'); const y = lerp(0, 12.5, eo(u)); const a = u * 1.8; place(SA, X0 + 14 + Math.cos(a + 1.5) * (16 - y * 1.18) * 0.9, y, -42 + Math.sin(a + 1.5) * (16 - y * 1.18) * 0.9, 0); face(SA, X0 + 14, -42); pose(SA, 'Man_Walk', t); SA.head.update(t, {});
        C([X0 + 2, 6, 6], [X0 + 4, 9, 2], [X0 + 14, 9, -42], [X0 + 14, 11, -42], u, 30);
        A.HUD = x => tag(x, 'RATNAGIRI', K.pulse(u, 0.15, 0.8), 'Saavithri temple, to this day'); },
      pillar: (t, u) => { setSky('night', V3(PX, 0, 0)); outdoor(false); pillar.visible = true; stars.visible = false; pillar.userData.tex.offset.y = -t * 0.25; hemi.intensity = 0.4;
        C([PX + 12, -8, 22], [PX + 9, 2, 20], [PX, 4, 0], [PX, 10, 0], u, 40);
        A.HUD = x => tag(x, 'AGNI STHAMBHAM', K.pulse(u, 0.05, 0.9), 'A pillar of fire without end'); },
      race: (t, u) => { setSky('night', V3(PX, 0, 0)); outdoor(false); pillar.visible = true; pillar.userData.tex.offset.y = -t * 0.25; const k = eo(u);
        place(BR, PX + 2.4, 1 + k * 7, 1.2, -0.6); pose(BR, 'Man_Idle', t, { UpperArmR: [0, 2.4, 0.3], UpperArmL: [0, -2.4, 0.3] }); BR.head.update(t, { look: [0, 0.6] });
        place(VI, PX - 2.4, -1 - k * 7, 1.2, 0.6); pose(VI, 'Man_Idle', t, { UpperArmR: [0, 0.4, -0.4], UpperArmL: [0, -0.4, -0.4], Neck: [0.5, 0, 0] }); VI.head.update(t, { look: [0, -0.6] });
        C([PX, 0, 16], [PX, 0, 18], [PX, 0, 0], [PX, 0, 0], u, 50); },
      lie: (t, u) => { setSky('night', V3(PX, 0, 0)); outdoor(false); pillar.visible = true; ketaki.visible = true; pillar.userData.tex.offset.y = -t * 0.25;
        place(BR, PX + 2.6, 0, 2.6, 0); face(BR, PX, 6); pose(BR, 'Man_Idle', t, P_.chest); BR.head.update(t, { talk: narr(t) * 0.8, look: [-0.3, 0] });
        ketaki.position.set(PX + 2.0, 1.6 + Math.sin(t * 2) * 0.1, 3.3); ketaki.rotation.set(0.2, t, 0.3);
        BR.root.updateMatrixWorld(true); const hp = BR.head.getWorldPosition(V3(0, 0, 0)); C([hp.x - 0.4, hp.y, hp.z + 2.0], [hp.x - 0.3, hp.y, hp.z + 1.6], [hp.x - 0.3, hp.y - 0.15, hp.z], [hp.x - 0.3, hp.y - 0.15, hp.z], u, 34);
        A.HUD = x => tag(x, 'MOGALI PUVVU', K.pulse(u, 0.4, 0.6), 'The false witness'); },
      shiva: (t, u) => { setSky('night', V3(PX, 0, 0)); outdoor(false); pillar.visible = true; pillar.userData.tex.offset.y = -t * 0.4; const ap = eo(clamp(u * 2.5));
        place(SV, PX, 0, 1.6, 0); SV.root.scale.setScalar(0.86 * (0.6 + ap * 0.7)); pose(SV, 'Man_Idle', t, { UpperArmL: [0, -0.9, 0.9], LowerArmL: [0, 0, 0.2] }); SV.head.update(t, { brow: -1, talk: narr(t) * 0.7 });
        place(BR, PX + 1.8, 0, 4.2, 0); face(BR, PX, 1.6); pose(BR, 'Man_Idle', t, P_.bowHead); BR.head.update(t, { close: 0.6 });
        C([PX + 3.6, 0.8, 8.4], [PX + 3.0, 0.9, 7.6], [PX + 0.6, 1.8, 2.0], [PX + 0.6, 2.0, 2.0], u, 38); },
      today: (t, u) => { pushkar('blue'); lamps.visible = true; key.intensity = 0.5; const a = 0.4 + u * 0.4;
        C([X0 + Math.sin(a) * 15, 4.5, -6 + Math.cos(a) * 15], [X0 + Math.sin(a + 0.15) * 13, 3.6, -6 + Math.cos(a + 0.15) * 13], [X0 + 3, 2, -10], [X0 + 4, 2.4, -11], u, 36, x => x);
        A.HUD = x => tag(x, 'PUSHKAR BRAHMA AALAYAM', K.pulse(u, 0.05, 0.9), 'Rajasthan'); },
      cta: (t, u) => { pushkar('night'); lamps.visible = true; key.intensity = 0.35; hemi.intensity = 0.5;
        C([X0 + 1.5, 3.2, 8.0], [X0 + 1.2, 2.9, 7.0], [X0, 0.5, -6], [X0, 0.6, -6], u, 34);
        A.HUD = x => endCard(x, t, u, { series: 'PUSHKAR KATHA', part: null, title: 'Brahma', te: 'బ్రహ్మ', next: null, ctaAt: Bt('cta') + 0.5 }); },
    };
    const SFX = [['bass', 0.05, 0.6], ['chime', F('hook', 0.5), 0.4], ['whoosh', F('lotus', 0.3), 0.4], ['thud', F('lotus', 0.95), 0.6], ['chime', F('lake', 0.2), 0.5], ['chime', Bt('yagna') + 0.3, 0.4],
      ['pop', F('time', 0.4), 0.4], ['bass', F('arrive', 0.6), 0.6], ['thud', F('curse', 0.4), 0.8], ['riser', Bt('pillar'), 0.5], ['whoosh', F('race', 0.3), 0.5], ['bass', F('shiva', 0.2), 0.8], ['chime', Bt('today') + 0.3, 0.5], ['pop', Bt('cta') + 0.6, 0.5], ['ding', Bt('cta') + 1.6, 0.5]];
    return finish({ SH, SRC, SFX, onFrame: t => { waterTex.offset.set(t * 0.01, t * 0.02); } });
  },
};
