// Bhishma Part 1/3 — Devavrata's vow. STORYBOOK 3D look (redo 27 Nov 2026), built on studio/scenes/stb_storybook_kit.js.
// Same Telugu voice lines (Maddy's cloned voice). Sets: green meadow (prince + archery), Yamuna bank with Satyavati's boat + the fisher
// king's thatched hut + lotus pads, white-gold Hastinapura throne hall (dusk lamps / bright day), cloud heaven of devas raining flowers.
// Ending: navy title card over Devavrata on the moonlit river bank.
window.SCENE = {
  assets: ['assets/chars/worker.glb'],
  setup: { bg: 0x9fb6cf, fog: null, fov: 35, bloom: null },
  lines: window.STB_LINES,
  build(K, T) {
    const A = window.STORYBOOK(K, T);
    const { THREE, S, PI, TAU, clamp, lerp, ease, eo, prog, L, Bt, Et, F, D, V3, rng, mat, GOLD, hero, heroes, pose, place, makeBow, handBow, arrowField, singleArrow, setSky, key, hemi, groupOf, shadowAll,
      flames, diya, torch, fly, dust, sparks, petals, stars, burst, label, tag, cam, C, narr, reg, outdoor, finish, waterTex, makeWater, lotus, makeBoat, makeHut, makePalace, makeHeaven, makeBook, endCard, titleCard, P_, mix_ } = A;

    // ---------------------------------------------------------------- cast
    const DV = hero({ skin: 0xc28654, dhoti: 0xf0c030, sash: 0x2a5ec8, crown: 'gold', stache: 'thin', stubble: true, tilak: true, seed: 3.1 });
    const SN = hero({ skin: 0xb57a52, dhoti: 0xece4d0, sash: 0x8a1c3a, utt: 0x8a1c3a, crown: 'gold', beard: 'short', stache: 'thick', hair: 0x2a2420, tilak: true, seed: 4.2 });
    const GA = hero({ female: true, skin: 0xd8a888, dhoti: 0xeaf4ff, sash: 0x3a8ad0, blouse: 0x3a8ad0, utt: 0xcfe6ff, crown: 'tiara', earrings: true, bindi: true, hair: 0x1a1410, lip: 0xb04a50, browR: 0.011, seed: 5.3 });
    const SV = hero({ female: true, skin: 0xa8704a, dhoti: 0xe06a2a, sash: 0xb01c3a, blouse: 0xb01c3a, utt: 0xe06a2a, crown: 'bun', flower: true, earrings: true, bindi: true, lip: 0xa04048, browR: 0.011, seed: 6.1 });
    const DR = hero({ skin: 0x9a6440, dhoti: 0xe8dcc0, sash: 0x6a4a2a, utt: 0xd8c8a0, crown: 'turban', turban: 0xf2ede0, beard: 'short', beardCol: 0xd8d4cc, hair: 0x3a3430, stache: 'thick', browCol: 0xd8d4cc, jewel: false, seed: 7.7 });
    const DEV = [0, 1, 2].map(i => hero({ skin: [0xe0b090, 0xd8a47a, 0xe8b898][i], dhoti: 0xf8f4ea, sash: [0xc0302a, 0xd89a2a, 0x2a7ac0][i], crown: 'gold', tilak: true, stache: i === 1 ? 'thin' : null, seed: 8 + i }));
    const bowDV = makeBow(); handBow(DV, bowDV);
    const face = (M, x, z) => { M.root.rotation.y = Math.atan2(x - M.root.position.x, z - M.root.position.z); };

    // ---------------------------------------------------------------- sets
    // river bank at x≈100: water from z=-1.5 back to the horizon, fisher hut + boat + lotus
    const RX = 100;
    const river = groupOf(); const wat = makeWater(RX, -31.5, 120, 60); river.add(wat);
    for (let i = 0; i < 16; i++) { const r = rng(i + 4); lotus(river, RX - 8 + r() * 16, -2.5 - r() * 6, 0.8 + r() * 0.5, r() < 0.5); }
    const hut = makeHut(); hut.position.set(RX + 8.6, 0, 1.6); hut.rotation.y = -0.9;
    const boat = makeBoat(); boat.position.set(RX - 0.5, 0, -4.5); boat.rotation.y = 1.2;
    // meadow archery target
    const target = groupOf(); { const tt = K.canvasTex(256, 256, (x, w, h) => { [['#f4ead0', 120], ['#c41e28', 96], ['#f4ead0', 72], ['#2a5ec8', 48], ['#f2c84a', 24]].forEach(([c, r]) => { x.fillStyle = c; x.beginPath(); x.arc(128, 128, r, 0, TAU); x.fill(); }); });
      const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 0.2, 40), [mat(0xb08a4a), mat(0xffffff, { map: tt }), mat(0xb08a4a)]); disc.rotation.x = PI / 2; disc.position.y = 1.45; target.add(disc);
      for (const sx of [-1, 1]) { const lg = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.0, 8), mat(0x6a4a2a)); lg.position.set(sx * 0.45, 0.9, -0.3); lg.rotation.x = 0.2; target.add(lg); }
      shadowAll(target); }
    target.position.set(0.6, 0, -9);
    const tArrows = arrowField([[0.45, 1.6, -8.85, 0.05, 0.02, 1], [0.75, 1.35, -8.85, -0.04, 0.05, 1], [0.6, 1.47, -8.85, 0.0, 0.0, 1]], { len: 0.8 });
    const flying = [0, 1, 2].map(() => singleArrow());
    const palace = makePalace({ x0: -100, z0: 0 });
    const seat = palace.userData.seat;
    const heaven = makeHeaven(0, 40, 200);
    const book = makeBook(); book.position.set(60, 0, 60);
    const nightLamps = groupOf(); for (let i = 0; i < 9; i++) diya(nightLamps, RX - 4 + i * 1.0, 0.04, -1.2 - (i % 3) * 0.7, 1.2, i % 4 === 0);
    reg(river, hut, boat, target, tArrows, palace, heaven, book, nightLamps, ...flying);

    // ---------------------------------------------------------------- shots (one per line)
    const SRC = { hook: 'AADI PARVA', who: 'AADI PARVA', prince: 'AADI PARVA', river: 'AADI PARVA', cond: 'AADI PARVA', sad: 'AADI PARVA', learn: 'AADI PARVA', throne: 'AADI PARVA', doubt: 'AADI PARVA', vow: 'AADI PARVA', flowers: 'AADI PARVA', meaning: 'AADI PARVA', boon: 'AADI PARVA', source: 'MAHABHARATAM' };
    const riverSet = (sky = 'gold') => { setSky(sky, V3(RX, 0, 0)); outdoor(true); [river, hut, boat].forEach(o => o.visible = true); };
    const indoor = (sky = 'gold') => { setSky(sky, V3(-100, 0, -8)); outdoor(false); palace.visible = true; if (sky === 'night') { hemi.intensity = 0.9; hemi.color.set(0xffd8a8); key.intensity = 0.7; key.color.set(0xffb070); } };
    const onThrone = (M, t, offs = {}, f = {}) => { place(M, seat.x, seat.y - 0.98, seat.z + 0.1, 0); pose(M, 'Man_Sitting', 0.6, offs); M.head.update(t, f); };
    const SH = {
      hook: (t, u) => { setSky('gold', V3(0, 0, 0)); dust.visible = true; place(DV, 0, 0, 0, 0.1); pose(DV, 'Man_Idle', t, { UpperArmR: [0, 0.15, 0.1] }); DV.head.update(t, { look: [0, 0.1] });
        C([0.6, 0.55, 6.0], [0.3, 0.9, 3.9], [0, 1.35, 0], [0, 1.5, 0], u, 32);
        A.HUD = x => titleCard(x, u, 'Bheeshma Prathigna', 'BHEESHMUDU  ·  PART 1 / 3'); },
      who: (t, u) => { riverSet('gold'); sparks.visible = true;
        place(GA, RX - 0.6, 0.06 + Math.sin(t * 1.5) * 0.03, -3.2, 0.25); pose(GA, 'Man_Idle', t, { UpperArmR: [0, 0.5, 0.3], UpperArmL: [0, -0.5, 0.3] }); GA.head.update(t, { look: [0.3, 0] });
        fly(sparks, t, { c: V3(RX - 0.6, 0, -3.2), sx: 1.6, sz: 1.2, sy: 2.4, vy: 0.4 });
        place(SN, RX + 0.9, 0, 1.4, PI - 0.3); pose(SN, 'Man_Idle', t + 1, P_.namaste); SN.head.update(t, {});
        place(DV, RX + 2.0, 0, 1.9, PI - 0.45); pose(DV, 'Man_Idle', t + 2); DV.head.update(t, { look: [-0.3, 0] });
        C([RX + 3.6, 1.5, 6.2], [RX + 2.9, 1.6, 5.2], [RX + 0.2, 1.4, -1.2], [RX + 0.3, 1.5, -1.0], u, 34);
        A.HUD = x => tag(x, 'GANGA DEVI  ·  SHANTANUDU', K.pulse(u, 0.05, 0.9), 'The river goddess and the king'); },
      prince: (t, u) => { setSky('gold', V3(0, 0, -4)); [target, tArrows, ...flying].forEach(o => o.visible = true);
        const d = 0.5 + 0.5 * Math.abs(Math.sin(u * 6)); place(DV, 0.35, 0, 2.6, PI + 0.05); pose(DV, 'Man_Idle', t, { UpperArmL: [0, -1.2, 0.5], LowerArmL: [0, 0, 0.1], UpperArmR: [0, 0.9, 0.7], LowerArmR: [0, 0, 0.6 + 1.2 * d], Neck: [0, -0.35, 0] }); DV.head.update(t, { brow: -0.5 });
        flying.forEach((a, i) => { const k = (u * 2.2 + i / 3) % 1, from = V3(0.3, 1.7, 2.0), to = V3(0.6 + (i - 1) * 0.15, 1.45, -8.9); a.position.copy(from.clone().lerp(to, k)); a.lookAt(to); a.rotateX(-PI / 2); a.visible = k > 0.05 && k < 0.95; });
        C([1.7, 1.7, 5.2], [1.4, 1.75, 4.7], [0.2, 1.5, -4], [0.4, 1.5, -6], u, 34);
        A.HUD = x => tag(x, 'HASTINAPURAM', K.pulse(u, 0.05, 0.9), 'The crown prince'); },
      river: (t, u) => { riverSet('gold'); place(SN, RX + 1.2, 0, 2.2, PI - 0.15); pose(SN, 'Man_Idle', t); SN.head.update(t, { look: [-0.2, 0] });
        boat.position.set(RX - 1.0 + u * 0.8, Math.sin(t * 1.3) * 0.03, -4.8); boat.rotation.y = 1.25;
        place(SV, boat.position.x + 0.1, 0.32 + boat.position.y, boat.position.z, 0.5); pose(SV, 'Man_Idle', t + 1, { UpperArmR: [0, 0.6, 0.9], LowerArmR: [0, 0, 0.6], Neck: [0, 0.3, 0] }); SV.head.update(t, { look: [0.4, 0] });
        C([RX + 2.4, 1.85, 4.7], [RX + 2.1, 1.8, 4.2], [RX - 0.3, 0.9, -4.5], [RX - 0.1, 0.95, -4.6], u, 32); },
      cond: (t, u) => { riverSet('gold'); place(DR, RX + 5.6, 0, 5.4, -2.2); pose(DR, 'Man_Idle', t, mix_(P_.point, { Neck: [-0.05, 0, 0] })); DR.head.update(t, { talk: narr(t), brow: -0.6 });
        place(SV, RX + 7.3, 0, 6.0, -2.2); pose(SV, 'Man_Idle', t + 1, P_.bowHead); SV.head.update(t, { close: 0.4 });
        place(SN, RX + 3.4, 0, 6.6, 0); face(SN, RX + 5.6, 5.4); pose(SN, 'Man_Idle', t + 2); SN.head.update(t, {});
        C([RX + 2.6, 1.55, 9.2], [RX + 2.9, 1.5, 8.6], [RX + 5.4, 1.45, 5.2], [RX + 5.5, 1.5, 5.2], u, 34); },
      sad: (t, u) => { indoor('night'); onThrone(SN, t, P_.sad, { close: 0.55 });
        C([-100 + 0.8, 1.5, -6.6], [-100 + 0.5, 1.55, -8.0], [-100, 1.65, -11.3], [-100, 1.65, -11.3], u, 32);
        A.HUD = x => tag(x, 'HASTINAPURAM', K.pulse(u, 0.05, 0.85), 'The king falls silent'); },
      learn: (t, u) => { riverSet('gold'); const x0 = lerp(RX - 3.5, RX + 2.6, u); place(DV, x0, 0, 7.0, PI / 2); pose(DV, 'Man_Walk', t); DV.head.update(t, {});
        C([x0 + 0.4, 1.45, 10.4], [x0 + 0.6, 1.5, 10.2], [x0 + 0.3, 1.2, 7.0], [x0 + 0.4, 1.2, 7.0], u, 34, x => x); },
      throne: (t, u) => { riverSet('gold'); place(DV, RX + 3.4, 0, 6.8, 0); face(DV, RX + 5.6, 5.4); pose(DV, 'Man_Idle', t, P_.chest); DV.head.update(t, { talk: narr(t) * 0.7 });
        place(DR, RX + 5.6, 0, 5.4, 0); face(DR, RX + 3.4, 6.8); pose(DR, 'Man_Idle', t + 1); DR.head.update(t, {});
        C([RX + 5.6, 0.6, 7.9], [RX + 5.3, 0.7, 7.7], [RX + 3.4, 1.55, 6.8], [RX + 3.4, 1.6, 6.8], u, 32); },
      doubt: (t, u) => { riverSet('gold'); place(DV, RX + 3.4, 0, 6.8, 0); face(DV, RX + 5.6, 5.4); pose(DV, 'Man_Idle', t); DV.head.update(t, {});
        place(DR, RX + 5.6, 0, 5.4, 0); face(DR, RX + 3.4, 6.8); pose(DR, 'Man_Idle', t + 1, { UpperArmR: [0, 0.5, 0.9], LowerArmR: [0, 0, 1.1], Neck: [0.05, 0.1, 0] }); DR.head.update(t, { talk: narr(t), brow: 0.6 });
        C([RX + 2.9, 1.7, 8.6], [RX + 3.1, 1.65, 8.3], [RX + 5.6, 1.5, 5.4], [RX + 5.6, 1.5, 5.4], u, 28); },
      vow: (t, u) => { riverSet('dawn'); sparks.visible = true; const up = eo(clamp(u * 2.5)); place(DV, RX + 3.4, 0, 6.8, 0); face(DV, RX + 5.6, 5.4);
        pose(DV, 'Man_Idle', t, { UpperArmR: [0, 0.3 + 2.2 * up, 0.35], LowerArmR: [0, 0, 0.2], Neck: [-0.2 * up, 0, 0] }); DV.head.update(t, { talk: narr(t) * 0.8, brow: -0.6 });
        fly(sparks, t, { c: V3(RX + 3.4, 0, 6.8), sx: 3, sz: 3, sy: 4, vy: 0.8 });
        C([RX + 5.6, 0.45, 5.8], [RX + 5.2, 0.5, 5.9], [RX + 3.4, 2.0, 6.8], [RX + 3.4, 2.2, 6.8], u, 38); },
      flowers: (t, u) => { setSky('gold', V3(0, 40, 200)); outdoor(false); heaven.visible = true; petals.visible = true;
        DEV.forEach((M, i) => { place(M, (i - 1) * 1.3, 40.15, 202 + (i === 1 ? -0.6 : 0), (i - 1) * -0.25); pose(M, 'Man_Idle', t + i, { UpperArmR: [0, 1.0 + Math.sin(t * 2 + i) * 0.2, 0.9], LowerArmR: [0, 0, 0.3], Neck: [0.3, 0, 0] }); M.head.update(t, { look: [0, -0.4] }); });
        fly(petals, t, { c: V3(0, 37, 202), sx: 6, sz: 4, sy: 5, vy: -0.6 });
        C([0.8, 41.6, 213.0], [0.4, 41.7, 211.5], [0, 41.2, 200], [0, 41.3, 200], u, 34);
        A.HUD = x => tag(x, 'DEVATHALU', K.pulse(u, 0.05, 0.9), 'A rain of flowers'); },
      meaning: (t, u) => { riverSet('dawn'); petals.visible = true; place(DV, RX + 3.4, 0, 6.8, 0); face(DV, RX + 6.0, 9.0); pose(DV, 'Man_Idle', t, { Neck: [-0.15, 0, 0] }); DV.head.update(t, { look: [0, 0.4] });
        fly(petals, t, { c: V3(RX + 3.4, 0, 6.8), sx: 4, sz: 4, sy: 3.5, vy: -0.5 });
        const hp = DV.head.getWorldPosition(V3(0, 0, 0)); DV.root.updateMatrixWorld(true); DV.head.getWorldPosition(hp);
        C([hp.x + 0.75, hp.y - 0.05, hp.z + 0.75], [hp.x + 0.55, hp.y, hp.z + 0.55], [hp.x, hp.y + 0.02, hp.z], [hp.x, hp.y + 0.02, hp.z], u, 30);
        A.HUD = x => tag(x, 'BHEESHMA', K.pulse(u, 0.05, 0.9), 'He of the terrible vow'); },
      boon: (t, u) => { indoor('gold'); onThrone(SN, t, P_.bless, { talk: narr(t) * 0.7 });
        place(DV, seat.x + 0.1, 0.55, seat.z + 1.55, PI); pose(DV, 'Man_Sitting', 0.6, P_.bowHead); DV.head.update(t, { close: 0.5 });
        C([-100 + 2.6, 1.3, -7.4], [-100 + 2.2, 1.3, -7.9], [-100, 1.25, -10.6], [-100, 1.25, -10.6], u, 36);
        A.HUD = x => tag(x, 'ICCHAA MARANAM', K.pulse(u, 0.15, 0.8), 'Death only when he wills it'); },
      source: (t, u) => { setSky('night', V3(60, 0, 60)); book.visible = true; key.intensity = 0.25; hemi.intensity = 0.3;
        C([61.6, 1.35, 61.5], [61.15, 1.15, 61.1], [60.0, 0.6, 60.0], [60.0, 0.62, 60.05], u, 30);
        A.HUD = x => { label(x, 'MAHABHARATAM', 540, 360, 64, '#f6e2b0', eo(clamp(u * 3)), 'EB Garamond', '600', 4); label(x, 'Aadi Parva', 540, 440, 44, '#f0e6d0', eo(clamp((u - 0.2) * 3)), 'EB Garamond', '400', 0, true); }; },
      cta: (t, u) => { riverSet('night'); nightLamps.visible = true; key.intensity = 0.4; place(DV, RX + 0.4, 0, 0.6, PI); pose(DV, 'Man_Idle', t); DV.head.update(t, {});
        C([RX + 1.6, 2.4, 4.4], [RX + 1.3, 2.2, 3.9], [RX + 0.2, 1.0, -0.6], [RX + 0.2, 1.05, -0.6], u, 32);
        A.HUD = x => endCard(x, t, u, { series: 'BHEESHMUDU', part: 'PART 1 / 3', title: 'Bheeshma Prathigna', te: 'భీష్మ ప్రతిజ్ఞ', next: 'Part 2 — Amba katha', ctaAt: Bt('cta') + 0.5 }); },
    };
    const SFX = [['bass', 0.05, 0.6], ['chime', F('who', 0.2), 0.4], ['whoosh', F('prince', 0.3), 0.4], ['thud', F('prince', 0.45), 0.4], ['whoosh', F('prince', 0.75), 0.35], ['chime', F('river', 0.3), 0.3],
      ['bass', Bt('cond') + 0.2, 0.5], ['riser', Bt('vow'), 0.4], ['bass', F('vow', 0.5), 0.8], ['chime', Bt('flowers') + 0.2, 0.6], ['chime', F('flowers', 0.5), 0.4], ['chime', F('boon', 0.6), 0.4], ['pop', Bt('cta') + 0.6, 0.5], ['ding', Bt('cta') + 1.6, 0.5]];
    return finish({ SH, SRC, SFX, onFrame: t => { waterTex.offset.set(t * 0.01, t * 0.02); } });
  },
};
