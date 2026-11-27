// Shakuni's dice — why he hated the Kauravas' family (FOLK version, said so). STORYBOOK 3D look (redo 27 Nov 2026), built on studio/scenes/stb_storybook_kit.js.
// Same Telugu voice lines (Maddy's cloned voice). Sets: candle-lit dice hall with a red/ivory chaupar cloth, palm-leaf Mahabharata (the
// scripture says he was only an uncle and friend), a tholu-bommalata shadow-puppet screen for the folk tale, the goat wedding, a stone
// dungeon with bars and a shaft of light. Hardship is kept non-graphic. Ending: two ivory dice on the chaupar, candle flicker.
window.SCENE = {
  assets: ['assets/chars/worker.glb'],
  setup: { bg: 0x9fb6cf, fog: null, fov: 35, bloom: null },
  lines: window.STB_LINES,
  build(K, T) {
    const A = window.STORYBOOK(K, T);
    const { THREE, S, PI, TAU, clamp, lerp, ease, eo, prog, L, Bt, Et, F, D, V3, rng, mat, GOLD, hero, heroes, pose, place, setSky, key, hemi, groupOf, shadowAll,
      flames, diya, torch, fly, dust, sparks, petals, stars, burst, label, tag, cam, C, narr, reg, outdoor, finish, makePalace, makeBook, endCard, titleCard, P_, mix_, frontOf, glowTexH } = A;

    // ---------------------------------------------------------------- cast
    const SK = hero({ skin: 0xb88a62, dhoti: 0x5a2a5a, sash: 0xd8a02a, utt: 0x3a1a3a, hair: 0x1a1410, crown: 'turban', turban: 0x3a1a3a, stache: 'curl', beard: 'short', seed: 1.6 });
    const SB = hero({ skin: 0xb08a6a, dhoti: 0xd8d0c0, sash: 0x6a5a4a, utt: 0xb0a890, hair: 0xd8d4cc, beard: 'long', beardCol: 0xd8d4cc, browCol: 0xe0dcd4, stache: 'thick', crown: 'band', jewel: false, seed: 2.4 });
    const BRS = [0, 1, 2].map(i => hero({ skin: [0xb08060, 0xa87858, 0xc09070][i], dhoti: [0x8a7a6a, 0x6a6a5a, 0x7a6a5a][i], sash: 0x4a3a2a, crown: 'none', hairStyle: 'long', stache: 'thin', jewel: false, seed: 3 + i }));
    const GN = hero({ female: true, skin: 0xdcae8e, dhoti: 0xc81e3a, sash: 0xe8b23a, blouse: 0xe8b23a, utt: 0xc81e3a, crown: 'tiara', earrings: true, bindi: true, lip: 0xb04a60, browR: 0.011, seed: 1.7 });
    const PRI = hero({ skin: 0x9a6a48, dhoti: 0xf2efe6, sash: 0xe8862a, utt: 0xe8862a, hair: 0x2a2420, crown: 'bun', beard: 'short', jewel: false, tilak: true, seed: 6.2 });
    const YU = hero({ skin: 0xb07a52, dhoti: 0xf3ead6, sash: 0x7a1830, utt: 0x7a1830, crown: 'gold', beard: 'short', stache: 'thin', tilak: true, seed: 0.3 });
    const DY = hero({ skin: 0xb07a52, dhoti: 0x6a1a4a, sash: 0xd8a02a, utt: 0x6a1a4a, crown: 'gold', stache: 'curl', seed: 2.8 });
    const face = (M, x, z) => { M.root.rotation.y = Math.atan2(x - M.root.position.x, z - M.root.position.z); };

    // ---------------------------------------------------------------- props
    const dieMats = [1, 6, 2, 5, 3, 4].map(n => mat(0xffffff, { map: K.canvasTex(128, 128, (x, w, h) => { x.fillStyle = '#f4ecd8'; x.fillRect(0, 0, w, h); x.fillStyle = '#2a1a12'; const P = { 1: [[64, 64]], 2: [[34, 34], [94, 94]], 3: [[30, 30], [64, 64], [98, 98]], 4: [[34, 34], [94, 34], [34, 94], [94, 94]], 5: [[30, 30], [98, 30], [64, 64], [30, 98], [98, 98]], 6: [[34, 28], [94, 28], [34, 64], [94, 64], [34, 100], [94, 100]] }[n]; P.forEach(([a, b]) => { x.beginPath(); x.arc(a, b, 11, 0, TAU); x.fill(); }); }), roughness: 0.4 }));
    const mkDie = () => { const d = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.12), dieMats); d.castShadow = true; S.add(d); return d; };
    const dice = [mkDie(), mkDie()];
    const DX = -100; const hall = makePalace({ x0: DX, z0: 0, wall: '#3a3440', arch: '#8a6a3a', curtain: '#5a1a2a', pillar: 0x5a5060, floorA: '#4a4048', floorB: '#3a3238' });
    const board = groupOf(); { const ct = K.canvasTex(512, 512, (x, w, h) => { x.fillStyle = '#7a1420'; x.fillRect(0, 0, w, h); x.fillStyle = '#f2e6cc'; x.fillRect(w / 2 - 50, 0, 100, h); x.fillRect(0, h / 2 - 50, w, 100); x.strokeStyle = '#7a1420'; x.lineWidth = 3;
        for (let i = 0; i < 24; i++) { x.strokeRect(w / 2 - 50 + (i % 3) * 33, i < 12 ? (i / 3 | 0) * 33 : h - ((i - 12) / 3 + 1 | 0) * 33, 33, 33); } x.fillStyle = '#d8a63a'; x.beginPath(); x.arc(w / 2, h / 2, 46, 0, TAU); x.fill(); });
      const c = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 2.4), mat(0xffffff, { map: ct })); c.rotation.x = -PI / 2; c.position.y = 0.03; board.add(c);
      for (const [x, z] of [[-1.5, -1.5], [1.5, -1.5], [-1.5, 1.5], [1.5, 1.5]]) { const st = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.05, 1.2, 8), GOLD); st.position.set(x, 0.6, z); board.add(st); diya(board, x, 1.2, z, 1.4, x < 0 && z < 0); } shadowAll(board); }
    board.position.set(DX, 0, -6);
    // dungeon
    const PX = 300; const dungeon = groupOf(); { const stT = K.canvasTex(256, 256, (x, w, h) => { x.fillStyle = '#5a5a62'; x.fillRect(0, 0, w, h); x.strokeStyle = '#3a3a42'; x.lineWidth = 4; for (let r = 0; r < 8; r++) for (let c = 0; c < 4; c++) x.strokeRect(c * 64 + (r % 2) * 32, r * 32, 64, 32); }); stT.wrapS = stT.wrapT = THREE.RepeatWrapping; stT.repeat.set(4, 2);
      const sm = mat(0xffffff, { map: stT, roughness: 1, side: THREE.DoubleSide }); const fl = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), mat(0x3a3a40)); fl.rotation.x = -PI / 2; fl.position.y = 0.02; dungeon.add(fl);
      for (const [x, z, ry] of [[0, -4, 0], [-4, 0, PI / 2], [4, 0, -PI / 2]]) { const w = new THREE.Mesh(new THREE.PlaneGeometry(8, 5), sm); w.position.set(x, 2.5, z); w.rotation.y = ry; dungeon.add(w); }
      const ceil = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), mat(0x2a2a30, { side: THREE.DoubleSide })); ceil.rotation.x = PI / 2; ceil.position.y = 5; dungeon.add(ceil);
      for (let i = 0; i < 12; i++) { const b = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 4, 8), mat(0x2a2a2a, { metalness: 0.6 })); b.position.set(-3 + i * 0.55, 2, 2.2); dungeon.add(b); }
      const shaft = new THREE.Mesh(new THREE.ConeGeometry(1.2, 6, 24, 1, true), new THREE.MeshBasicMaterial({ color: 0xfff0c8, transparent: true, opacity: 0.05, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })); shaft.position.set(0.3, 2.6, -1.0); shaft.rotation.z = 0.15; dungeon.add(shaft);
      const pl = new THREE.SpotLight(0xffe8c0, 14, 12, 0.45, 0.6); pl.position.set(0.8, 5.2, -1.0); pl.target.position.set(0, 0, -1.0); dungeon.add(pl, pl.target); shadowAll(dungeon); }
    dungeon.position.set(PX, 0, 0);
    const rice = groupOf(); { const lf = new THREE.Mesh(new THREE.CircleGeometry(0.28, 24), mat(0x3a8a3a, { side: THREE.DoubleSide })); lf.rotation.x = -PI / 2; rice.add(lf); const r = rng(4); for (let i = 0; i < 70; i++) { const g = new THREE.Mesh(new THREE.SphereGeometry(0.012, 6, 4), mat(0xf6f2e6)); g.scale.set(1, 0.6, 2); g.position.set((r() - 0.5) * 0.18, 0.02 + r() * 0.05, (r() - 0.5) * 0.18); rice.add(g); } }
    // tholu bommalata screen (folk shadow puppets)
    const puppetT = K.canvasTex(1024, 768, (x, w, h) => { const g = x.createRadialGradient(w / 2, h / 2, 40, w / 2, h / 2, w * 0.7); g.addColorStop(0, '#ffe2a0'); g.addColorStop(1, '#c86a2a'); x.fillStyle = g; x.fillRect(0, 0, w, h);
      const fig = (cx, s, col, crown) => { x.save(); x.translate(cx, h * 0.62); x.scale(s, s); x.fillStyle = col; x.globalAlpha = 0.85; x.beginPath(); x.ellipse(0, -170, 34, 42, 0, 0, TAU); x.fill(); if (crown) { x.beginPath(); x.moveTo(-30, -205); x.lineTo(0, -270); x.lineTo(30, -205); x.fill(); }
        x.beginPath(); x.moveTo(-50, -125); x.lineTo(50, -125); x.lineTo(70, 60); x.lineTo(-70, 60); x.fill(); x.fillRect(-45, 60, 30, 120); x.fillRect(15, 60, 30, 120); x.lineWidth = 16; x.strokeStyle = col; x.beginPath(); x.moveTo(-50, -110); x.lineTo(-120, -20); x.moveTo(50, -110); x.lineTo(130, -170); x.stroke();
        x.strokeStyle = 'rgba(60,20,10,0.8)'; x.lineWidth = 3; x.beginPath(); x.moveTo(130, -170); x.lineTo(130, -400); x.stroke(); x.restore(); };
      fig(w * 0.3, 1.1, '#7a1a1a', true); fig(w * 0.68, 1.0, '#1a3a5a', false); });
    const screen = groupOf(); { const sc = new THREE.Mesh(new THREE.PlaneGeometry(4, 3), new THREE.MeshBasicMaterial({ map: puppetT })); sc.position.y = 2.2; screen.add(sc); const fr = new THREE.Mesh(new THREE.BoxGeometry(4.3, 0.2, 0.2), mat(0x5a3a1e)); fr.position.y = 0.7; screen.add(fr); const fr2 = fr.clone(); fr2.position.y = 3.7; screen.add(fr2); }
    screen.position.set(150, 0, -2);
    const goat = groupOf(); { const m = mat(0xf2ede4); const b = new THREE.Mesh(new THREE.CapsuleGeometry(0.22, 0.5, 8, 16), m); b.rotation.x = PI / 2; b.position.y = 0.62; goat.add(b);
      for (const [x, z] of [[-0.12, 0.25], [0.12, 0.25], [-0.12, -0.25], [0.12, -0.25]]) { const l = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.035, 0.5, 8), m); l.position.set(x, 0.25, z); goat.add(l); }
      const hd = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 12), m); hd.scale.set(0.9, 1, 1.3); hd.position.set(0, 0.92, 0.42); goat.add(hd);
      for (const sx of [-1, 1]) { const h = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.22, 8), mat(0x8a7a6a)); h.position.set(sx * 0.06, 1.08, 0.36); h.rotation.x = -0.6; goat.add(h); }
      const gar = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.035, 8, 24), mat(0xf0a020)); gar.position.set(0, 0.78, 0.3); gar.rotation.x = 1.2; goat.add(gar); shadowAll(goat); }
    const book = makeBook(); book.position.set(60, 0, 60);
    const candle = groupOf(); diya(candle, 0, 0, 0, 1.6, true);
    reg(hall, board, dungeon, rice, screen, goat, book, candle, ...dice);

    // ---------------------------------------------------------------- shots
    const SRC = { hook: 'JAANAPADA KATHA', truth: 'VYAASA MAHAABHAARATAM', folk: 'JAANAPADA KATHA', goat: 'JAANAPADA KATHA', prison: 'JAANAPADA KATHA', rice: 'JAANAPADA KATHA', choose: 'JAANAPADA KATHA', die: 'JAANAPADA KATHA', leg: 'JAANAPADA KATHA', bones: 'JAANAPADA KATHA', game: 'SABHAA PARVA', end: 'MAHABHARATAM' };
    const diceHall = () => { setSky('night', V3(DX, 0, -6)); outdoor(false); hall.visible = board.visible = true; hemi.intensity = 0.55; hemi.color.set(0xffc890); key.intensity = 0.6; key.color.set(0xffb070); };
    const roll = (t, t0, x0, z0) => { dice.forEach((d, i) => { d.visible = true; const k = clamp((t - t0) / 1.2); d.position.set(x0 + i * 0.22 + k * (0.5 + i * 0.1), 0.09 + Math.abs(Math.sin(k * 7)) * (1 - k) * 0.35, z0 + k * (0.3 - i * 0.2)); d.rotation.set((1 - k) * t * 9 + i, (1 - k) * t * 7, i * 0.6 + (k >= 1 ? 0 : t * 5)); }); };
    const inCell = (sky = 'night') => { setSky(sky, V3(PX, 0, 0)); outdoor(false); dungeon.visible = true; hemi.intensity = 0.35; hemi.color.set(0x8a90b0); key.intensity = 0.2; };
    const sitCell = (M, x, z, ry, offs = {}, f = {}) => { place(M, PX + x, 0, z, ry); pose(M, 'Man_Sitting', 0.6, offs); M.root.position.y = -0.05; M.head.update(0, f); };
    const SH = {
      hook: (t, u) => { diceHall(); place(SK, DX, 0, -7.4, 0); pose(SK, 'Man_Sitting', 0.6, { UpperArmR: [0, 0.6, 1.1], LowerArmR: [0, 0, 0.5] }); SK.root.position.y = -0.05; SK.head.update(t, { brow: -0.6 }); roll(t, Bt('hook') + 0.6, DX - 0.2, -6.6);
        C([DX + 0.9, 0.8, -4.4], [DX + 0.6, 0.7, -4.8], [DX, 0.5, -6.6], [DX, 0.45, -6.4], u, 34);
        A.HUD = x => titleCard(x, u, 'Shakuni', 'A FOLK TALE  ·  THE DICE OF REVENGE'); },
      truth: (t, u) => { setSky('night', V3(60, 0, 60)); book.visible = true; key.intensity = 0.25; hemi.intensity = 0.3;
        C([61.6, 1.35, 61.5], [61.15, 1.15, 61.1], [60.0, 0.6, 60.0], [60.0, 0.62, 60.05], u, 30);
        A.HUD = x => { label(x, 'VYAASA MAHAABHAARATAM', 540, 360, 52, '#f6e2b0', eo(clamp(u * 3)), 'EB Garamond', '600', 3); label(x, 'Uncle and friend of Duryodhana — nothing more', 540, 440, 36, '#f0e6d0', eo(clamp((u - 0.2) * 3)), 'EB Garamond', '400', 0, true); }; },
      folk: (t, u) => { setSky('night', V3(150, 0, 0)); outdoor(true); screen.visible = true; key.intensity = 0.2; hemi.intensity = 0.3; screen.rotation.y = Math.sin(t) * 0.02;
        C([150.2, 2.0, 4.6], [150.1, 2.1, 3.8], [150, 2.2, -2], [150, 2.2, -2], u, 38);
        A.HUD = x => tag(x, 'JAANAPADA KATHA', K.pulse(u, 0.05, 0.9), 'A later folk tale — not in Vyasa'); },
      goat: (t, u) => { setSky('gold', V3(0, 0, 0)); goat.visible = true; goat.position.set(0.7, 0, -0.2); goat.rotation.y = -0.8;
        place(GN, -0.5, 0, -0.2, 0.6); pose(GN, 'Man_Idle', t, P_.namaste); GN.head.update(t, { close: 0.5 });
        place(PRI, 0.1, 0, -1.6, 0); pose(PRI, 'Man_Idle', t, P_.bless); PRI.head.update(t, { talk: narr(t) * 0.4 });
        C([0.5, 1.4, 4.4], [0.3, 1.35, 3.8], [0.1, 1.0, -0.6], [0.1, 1.0, -0.6], u, 36);
        A.HUD = x => tag(x, 'MEKATHO PELLI', K.pulse(u, 0.1, 0.8), 'A wedding to a goat, says the folk tale'); },
      prison: (t, u) => { inCell(); sitCell(SB, -0.6, -2.4, 0, P_.sad, { close: 0.6 }); BRS.forEach((M, i) => sitCell(M, 0.4 + i * 0.8, -2.6 + (i % 2) * 0.4, -0.2, P_.sad, { close: 0.5 })); sitCell(SK, 0.0, -1.4, 0, P_.sad, { close: 0.3 });
        C([PX + 0.3, 1.6, 5.0], [PX + 0.3, 1.5, 4.2], [PX + 0.3, 0.8, -1.8], [PX + 0.3, 0.8, -1.8], u, 38);
        A.HUD = x => tag(x, 'CHERASAALA', K.pulse(u, 0.05, 0.85), 'King Subala and all his sons'); },
      rice: (t, u) => { inCell(); rice.visible = true; rice.position.set(PX + 0.3, 0.03, -1.0); sitCell(SK, 0.0, -1.6, 0, P_.namaste, { close: 0.4 });
        C([PX + 0.9, 0.7, 0.4], [PX + 0.7, 0.6, 0.1], [PX + 0.3, 0.1, -1.0], [PX + 0.3, 0.1, -1.0], u, 32);
        A.HUD = x => tag(x, 'OKKA GUPPEDU ANNAM', K.pulse(u, 0.1, 0.8), 'For all of them, each day'); },
      choose: (t, u) => { inCell(); rice.visible = true; rice.position.set(PX, 0.03, -1.0); sitCell(SK, 0.0, -1.6, 0, { UpperArmR: [0, 0.3, 1.0], LowerArmR: [0, 0, 1.2] }, {});
        BRS.forEach((M, i) => { sitCell(M, -1.0 + i * 1.0, -0.2, PI, { UpperArmR: [0, 0.4, 0.9], Neck: [0.3, 0, 0] }, { close: 0.5 }); });
        C([PX + 1.8, 1.4, 2.6], [PX + 1.5, 1.3, 2.2], [PX, 0.6, -1.0], [PX, 0.6, -1.0], u, 36);
        A.HUD = x => tag(x, 'THELIVAINA SHAKUNIKE', K.pulse(u, 0.2, 0.7), 'The cleverest one must live'); },
      die: (t, u) => { inCell(); key.intensity = 0.1; sitCell(SK, 0.0, -1.0, 0, P_.sad, { close: 0.8 }); BRS.forEach((M, i) => { place(M, PX - 1.4 + i * 1.3, 0.12, -2.8, 0); M.root.rotation.set(-PI / 2, 0.3 * i, 0, 'YXZ'); pose(M, 'Man_Idle', 0.2); M.head.update(0, { close: 1 }); });
        C([PX + 0.6, 1.2, 2.6], [PX + 0.5, 1.1, 2.0], [PX, 0.8, -1.2], [PX, 0.8, -1.2], u, 34);
        A.HUD = x => tag(x, 'OKKOKKARUGAA', K.pulse(u, 0.1, 0.8), 'One by one, before his eyes'); },
      leg: (t, u) => { inCell(); place(SB, PX - 0.5, 0, -1.6, 0.6); pose(SB, 'Man_Idle', t, { UpperArmR: [0, 0.5, 1.0], LowerArmR: [0, 0, 0.5] }); SB.head.update(t, { talk: narr(t), brow: -0.8 });
        place(SK, PX + 0.4, 0, -1.2, -0.8); pose(SK, 'Man_Idle', t, { UpperLegR: [0.3, 0, 0], Torso: [0.15, 0, 0.12], Neck: [0.2, 0, 0] }); SK.head.update(t, { close: 0.6 });
        C([PX + 1.4, 1.5, 2.4], [PX + 1.1, 1.5, 2.0], [PX, 1.3, -1.4], [PX, 1.3, -1.4], u, 34);
        A.HUD = x => tag(x, 'KUNTITHANAM', K.pulse(u, 0.3, 0.7), 'A limp to remember the insult'); },
      bones: (t, u) => { inCell(); place(SB, PX - 0.3, 0.12, -1.6, 0); SB.root.rotation.set(-PI / 2, 0.5, 0, 'YXZ'); pose(SB, 'Man_Idle', 0.2); SB.head.update(t, { close: 0.7, talk: narr(t) * 0.5 });
        sitCell(SK, 0.4, -0.6, -2.4, P_.sad, { close: 0.5 }); dice.forEach((d, i) => { d.visible = true; d.position.set(PX + 0.1 + i * 0.2, 0.08, -0.9); d.rotation.set(0, t * 0.5 + i, 0); });
        C([PX + 2.4, 1.4, 1.8], [PX + 2.1, 1.3, 1.5], [PX - 0.1, 0.4, -1.3], [PX - 0.1, 0.4, -1.3], u, 36);
        A.HUD = x => tag(x, 'PAACHIKALU', K.pulse(u, 0.3, 0.7), 'Dice from his father’s bones'); },
      game: (t, u) => { diceHall(); place(SK, DX, 0, -7.4, 0); pose(SK, 'Man_Sitting', 0.6, { UpperArmR: [0, 0.6, 1.1], LowerArmR: [0, 0, 0.5] }); SK.root.position.y = -0.05; SK.head.update(t, { brow: -0.5 });
        place(YU, DX + 0.1, 0, -4.6, PI); pose(YU, 'Man_Sitting', 0.6, P_.sad); YU.root.position.y = -0.05; YU.head.update(t, { close: 0.5 });
        place(DY, DX + 1.3, 0, -7.6, -0.5); pose(DY, 'Man_Idle', t, { UpperArmR: [0, 0.3, 1.2], LowerArmR: [0, 0, 1.4] }); DY.head.update(t, {}); roll(t, Bt('game') + 0.5, DX - 0.2, -6.2);
        C([DX + 0.4, 1.8, -2.4], [DX + 0.35, 1.7, -2.8], [DX, 0.6, -6.3], [DX, 0.6, -6.3], u, 36);
        A.HUD = x => tag(x, 'JOODAM', K.pulse(u, 0.05, 0.85), 'The game that led to Kurukshetra'); },
      end: (t, u) => { diceHall(); hemi.intensity = 0.35; place(SK, DX, 0, -7.4, 0); pose(SK, 'Man_Sitting', 0.6, P_.sad); SK.root.position.y = -0.05; SK.head.update(t, { close: 0.4 }); dice.forEach((d, i) => { d.visible = true; d.position.set(DX - 0.1 + i * 0.22, 0.09, -6.5); d.rotation.set(0, i * 0.7, 0); });
        const fo = frontOf(SK, 1.4, -0.2, 0.3), fo2 = frontOf(SK, 1.1, -0.2, 0.2); C(fo.p.toArray(), fo2.p.toArray(), fo.h.toArray(), fo2.h.toArray(), u, 34);
        A.HUD = x => tag(x, 'VINAASHANAM', K.pulse(u, 0.1, 0.8), 'Close to them, and their ruin'); },
      cta: (t, u) => { diceHall(); dice.forEach((d, i) => { d.visible = true; d.position.set(DX - 0.1 + i * 0.22, 0.09, -6.0); d.rotation.set(0, i * 0.7, 0); });
        C([DX + 0.5, 0.6, -5.0], [DX + 0.4, 0.55, -5.2], [DX, 0.1, -6.0], [DX, 0.1, -6.0], u, 30);
        A.HUD = x => endCard(x, t, u, { series: 'JAANAPADA KATHA', part: null, title: 'Shakuni', te: 'శకుని', next: null, ctaAt: Bt('cta') + 0.5 }); },
    };
    const SFX = [['bass', 0.05, 0.6], ['pop', Bt('hook') + 0.8, 0.5], ['pop', Bt('hook') + 1.1, 0.4], ['chime', F('truth', 0.3), 0.4], ['chime', F('folk', 0.3), 0.4], ['bass', F('prison', 0.2), 0.7], ['buzz', F('rice', 0.4), 0.2],
      ['bass', F('die', 0.3), 0.6], ['thud', F('leg', 0.4), 0.8], ['chime', F('bones', 0.5), 0.5], ['pop', Bt('game') + 0.7, 0.5], ['pop', Bt('game') + 1.0, 0.4], ['bass', F('end', 0.3), 0.6], ['pop', Bt('cta') + 0.6, 0.5], ['ding', Bt('cta') + 1.6, 0.5]];
    return finish({ SH, SRC, SFX });
  },
};
