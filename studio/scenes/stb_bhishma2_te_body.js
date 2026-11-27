// Bhishma Part 2/3 — Amba's revenge and Shikhandi. STORYBOOK 3D look (redo 27 Nov 2026), built on studio/scenes/stb_storybook_kit.js.
// Same Telugu voice lines (Maddy's cloned voice). Sets: Kashi meadow with the golden canopy chariot, white-gold Hastinapura hall,
// teal-and-gold Saubha palace of King Salva, storm-dusk duel with Parashurama (lightning), moonlit forest where Shiva appears,
// night fire, Drupada's saffron hall (Shikhandi), Kurukshetra meadow with Amba's ghost behind Shikhandi. Ending: navy title card.
window.SCENE = {
  assets: ['assets/chars/worker.glb'],
  setup: { bg: 0x9fb6cf, fog: null, fov: 35, bloom: null },
  lines: window.STB_LINES,
  build(K, T) {
    const A = window.STORYBOOK(K, T);
    const { THREE, S, PI, TAU, clamp, lerp, ease, eo, prog, L, Bt, Et, F, D, V3, rng, mat, GOLD, GOLD2, SILVER, hero, heroes, pose, place, makeBow, handBow, arrowField, singleArrow, setSky, key, hemi, groupOf, shadowAll,
      chariot, horseLegs, flames, diya, torch, fly, dust, sparks, petals, stars, burst, label, tag, cam, C, narr, reg, outdoor, finish, makePalace, makeHeaven, makeBook, endCard, titleCard, P_, mix_, bonfire, snake } = A;

    // ---------------------------------------------------------------- cast
    const BM = hero({ skin: 0xbf8a62, dhoti: 0xf2efe6, sash: 0xc9a24a, hair: 0x3a3430, beard: 'short', beardCol: 0x4a4440, stache: 'thick', crown: 'gold', torso: 'armor', sashOn: false, tilak: true, seed: 0.9 });   // Bhishma (younger)
    const BH = hero({ skin: 0xc08a66, dhoti: 0xf2efe6, sash: 0xc9a24a, hair: 0xeeeae4, beardCol: 0xeeeae4, browCol: 0xf4f0ea, browR: 0.024, crown: 'band', torso: 'armor', sashOn: false, beard: 'long', stache: 'thick', lip: 0x9a5a4a, seed: 0.7 });  // Bhishma at Kurukshetra
    const AM = hero({ female: true, skin: 0xd4a07a, dhoti: 0xc81e3a, sash: 0xe8b23a, blouse: 0xe8b23a, utt: 0xc81e3a, crown: 'tiara', earrings: true, bindi: true, lip: 0xb04050, browR: 0.011, seed: 2.2 });
    const AK = hero({ female: true, skin: 0xd8a888, dhoti: 0x2a9a6a, sash: 0xe8b23a, blouse: 0xe8b23a, utt: 0x2a9a6a, crown: 'tiara', earrings: true, bindi: true, lip: 0xb04050, browR: 0.011, seed: 2.9 });
    const AL = hero({ female: true, skin: 0xdcae8e, dhoti: 0xe86aa0, sash: 0xe8b23a, blouse: 0xe8b23a, utt: 0xe86aa0, crown: 'tiara', earrings: true, bindi: true, lip: 0xb04050, browR: 0.011, seed: 3.6 });
    const SA = hero({ skin: 0xb07850, dhoti: 0x1f7a8a, sash: 0xe8b23a, utt: 0x1f7a8a, crown: 'gold', beard: 'short', stache: 'curl', seed: 4.4 });
    const PR = hero({ skin: 0x9a6440, dhoti: 0xe8862a, sash: 0xb8401a, utt: 0xe8862a, hair: 0x2a2420, crown: 'jata', beard: 'long', beardCol: 0x3a3430, stache: 'thick', jewel: false, tilak: true, seed: 5.5 });
    const SV = hero({ skin: 0x8aa8cc, dhoti: 0xf2e6d0, sash: 0x8a6a4a, utt: 0xe0d0b0, hair: 0x2a2a3a, crown: 'jata', moon: true, ganga: true, jewel: false, tilak: true, lip: 0x6a4a5a, seed: 6.6 });
    const SK = hero({ skin: 0xc8946c, dhoti: 0x7a1c1c, sash: 0xd8a040, crown: 'helmet', torso: 'tunic', tunic: 0x5a2420, stache: 'thin', seed: 1.2 });
    const AR = hero({ skin: 0xc28654, dhoti: 0xe8b02c, sash: 0xb3241a, crown: 'gold', stache: 'curl', stubble: true, tilak: true, seed: 1.9 });
    const AMG = hero({ female: true, skin: 0xd4a07a, dhoti: 0xc81e3a, sash: 0xe8b23a, blouse: 0xe8b23a, utt: 0xc81e3a, crown: 'tiara', earrings: true, bindi: true, browR: 0.011, seed: 2.2 });   // ghost
    snake(SV);
    const bowBM = makeBow(), bowBH = makeBow(), bowSK = makeBow(), bowAR = makeBow(); handBow(BM, bowBM); handBow(BH, bowBH); handBow(SK, bowSK); handBow(AR, bowAR);
    // Parashurama's axe + Shiva's trident (held in the right hand)
    const holdR = (M, obj) => { M.g.updateMatrixWorld(true); const h = M.B.PalmR; h.add(obj); const ws = h.getWorldScale(V3(0, 0, 0)).x; obj.scale.setScalar(1 / ws * 0.86); obj.position.set(0, 0.05 / ws, 0); return obj; };
    const axe = new THREE.Group(); { const hd = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.3, 8), mat(0x5a3a1e)); axe.add(hd);
      const bl = new THREE.Shape(); bl.moveTo(0, 0); bl.quadraticCurveTo(0.28, 0.05, 0.3, 0.22); bl.quadraticCurveTo(0.12, 0.14, 0, 0.18); bl.lineTo(0, 0);
      const b = new THREE.Mesh(new THREE.ExtrudeGeometry(bl, { depth: 0.02, bevelEnabled: false }), mat(0xc8ccd4, { metalness: 0.7, roughness: 0.3 })); b.position.set(0.02, 0.38, -0.01); axe.add(b); } holdR(PR, axe);
    const tri = new THREE.Group(); { const sh = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 2.0, 8), mat(0x8a8e94, { metalness: 0.6 })); sh.position.y = 0.3; tri.add(sh);
      for (const [x, h] of [[-0.1, 0.25], [0, 0.32], [0.1, 0.25]]) { const p = new THREE.Mesh(new THREE.ConeGeometry(0.03, h, 8), mat(0xc8ccd4, { metalness: 0.7 })); p.position.set(x, 1.35 + h / 2, 0); tri.add(p); }
      const bar = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.015, 6, 16, PI), mat(0xc8ccd4, { metalness: 0.7 })); bar.rotation.z = PI; bar.position.y = 1.36; tri.add(bar); } holdR(SV, tri);
    const face = (M, x, z) => { M.root.rotation.y = Math.atan2(x - M.root.position.x, z - M.root.position.z); };

    // ---------------------------------------------------------------- sets
    const hall = makePalace({ x0: -100, z0: 0 });                                                                                   // Hastinapura
    const saubha = makePalace({ x0: -200, z0: 0, wall: '#d8eee8', arch: '#2a8a8a', curtain: '#1f5a7a', pillar: 0xe6f2ee, floorA: '#d8ece6', floorB: '#a8d2c8' });   // Salva
    const drupada = makePalace({ x0: -300, z0: 0, wall: '#f8e2c0', arch: '#e08a2a', curtain: '#c0401a', pillar: 0xfaf0e0, floorA: '#f6e6c8', floorB: '#ecc890' });   // Panchala
    const forest = groupOf(); { const r = rng(61), tg = new THREE.CylinderGeometry(0.14, 0.2, 3.2, 10), bg = new THREE.SphereGeometry(1.1, 18, 12);
      for (let i = 0; i < 40; i++) { const a = r() * TAU, d = 3.5 + r() * 9; const x = 200 + Math.cos(a) * d, z = Math.sin(a) * d - 3; const tr = new THREE.Mesh(tg, mat(0x5a3a22)); tr.position.set(x, 1.6, z); forest.add(tr);
        for (let j = 0; j < 4; j++) { const b = new THREE.Mesh(bg, mat(0x2f6a32)); b.position.set(x + (r() - 0.5) * 1.2, 3.4 + r() * 0.9, z + (r() - 0.5) * 1.2); b.scale.setScalar(0.8 + r() * 0.4); forest.add(b); } } shadowAll(forest); }
    const fireSet = groupOf(); bonfire(fireSet, 300, 0, 1.6, true); bonfire(fireSet, 299.2, -0.6, 1.1, false); bonfire(fireSet, 300.8, -0.5, 1.2, false);
    const camp = groupOf(); torch(camp, 202.6, -1.0, 1.8);
    reg(hall, saubha, drupada, forest, fireSet, camp);

    // ---------------------------------------------------------------- shots
    const SRC = { recap: 'AADI PARVA', kashi: 'AADI PARVA', love: 'UDYOGA PARVA', reject: 'UDYOGA PARVA', back: 'UDYOGA PARVA', no: 'UDYOGA PARVA', parashu: 'UDYOGA PARVA', draw: 'UDYOGA PARVA', tapas: 'UDYOGA PARVA', fire: 'UDYOGA PARVA', reborn: 'UDYOGA PARVA', war: 'BHEESHMA PARVA', tenth: 'BHEESHMA PARVA' };
    const indoor = (P, sky = 'gold') => { setSky(sky, V3(P.position.x, 0, -8)); outdoor(false); P.visible = true; };
    const flash = (x, t, at) => { const k = Math.max(0, 1 - Math.abs(t - at) * 8); if (k <= 0) return; x.fillStyle = `rgba(230,235,255,${0.45 * k})`; x.fillRect(0, 0, 1080, 1920);
      x.strokeStyle = `rgba(255,255,255,${k})`; x.lineWidth = 6; x.beginPath(); let px = 300 + (at * 97 % 480), py = 0; x.moveTo(px, py); for (let i = 0; i < 8; i++) { px += ((i * 37 + at * 13) % 120) - 60; py += 70; x.lineTo(px, py); } x.stroke(); };
    const SH = {
      recap: (t, u) => { setSky('gold', V3(0, 0, 0)); petals.visible = true; place(BM, 0, 0, 0, 0.1); pose(BM, 'Man_Idle', t, { UpperArmR: [0, 2.6, 0.35] }); BM.head.update(t, { brow: -0.5 });
        fly(petals, t, { c: V3(0, 0, 0), sx: 4, sz: 4, sy: 4, vy: -0.5 });
        C([0.5, 0.6, 5.8], [0.3, 0.9, 4.2], [0, 1.5, 0], [0, 1.6, 0], u, 34);
        A.HUD = x => titleCard(x, u, 'Amba', 'BHEESHMUDU  ·  PART 2 / 3'); },
      kashi: (t, u) => { setSky('gold', V3(0, 0, -6)); chariot.visible = true; dust.visible = true; const z = lerp(-4, 0.5, u); chariot.position.set(0, 0, z); chariot.rotation.y = 0.0;
        horseLegs.forEach((lg, i) => { lg.rotation.x = Math.sin(t * 9 + i * 1.7) * 0.5; });
        place(BM, -0.35, 0.95, z - 0.1, 0.3); pose(BM, 'Man_Idle', t, { UpperArmL: [0, -0.6, 0.4] }); BM.head.update(t, {});
        [AM, AK, AL].forEach((M, i) => { place(M, 0.15 + i * 0.25, 0.95, z - 0.35 + i * 0.12, -0.2); pose(M, 'Man_Idle', t + i, P_.bowHead); M.head.update(t, { close: 0.3 }); });
        C([4.2, 1.6, 7.6], [3.0, 1.7, 6.8], [0, 1.6, z + 0.4], [0, 1.6, z + 0.4], u, 34);
        A.HUD = x => tag(x, 'KAASI', K.pulse(u, 0.05, 0.9), 'Amba, Ambika, Ambalika'); },
      love: (t, u) => { indoor(hall); place(AM, -100, 0, -6.5, 0.15); pose(AM, 'Man_Idle', t, P_.chest); AM.head.update(t, { talk: narr(t) * 0.8, brow: 0.5 });
        place(BM, -99.2, 0, -8.6, -0.3); face(BM, -100, -6.5); pose(BM, 'Man_Idle', t + 1); BM.head.update(t, {});
        AM.root.updateMatrixWorld(true); const hp = AM.head.getWorldPosition(V3(0, 0, 0));
        C([hp.x + 0.55, hp.y - 0.05, hp.z + 1.3], [hp.x + 0.35, hp.y, hp.z + 1.0], [hp.x, hp.y - 0.08, hp.z], [hp.x, hp.y - 0.06, hp.z], u, 32); },
      reject: (t, u) => { indoor(saubha); place(SA, -200, 0, -8.8, PI + 0.35); pose(SA, 'Man_Idle', t, { UpperArmR: [0, 0.2, 1.2], LowerArmR: [0, 0, 1.4], UpperArmL: [0, -0.2, 1.2], LowerArmL: [0, 0, 1.4] }); SA.head.update(t, { talk: narr(t) * 0.7, brow: -0.6 });
        place(AM, -199.2, 0, -6.2, -0.6); face(AM, -200, -8.8); pose(AM, 'Man_Idle', t + 1, P_.namaste); AM.head.update(t, { brow: 0.7 });
        C([-197.6, 1.6, -3.6], [-198.0, 1.55, -4.2], [-199.6, 1.5, -7.6], [-199.6, 1.5, -7.6], u, 34);
        A.HUD = x => tag(x, 'SAUBHA', K.pulse(u, 0.05, 0.85), 'King Salva turns her away'); },
      back: (t, u) => { indoor(hall); place(BM, -100, 0, -8.6, 0); pose(BM, 'Man_Idle', t); BM.head.update(t, {});
        place(AM, -100.1, 0, -6.9, PI); pose(AM, 'Man_Idle', t + 1, P_.namaste); AM.head.update(t, { talk: narr(t) * 0.8, brow: 0.6 });
        C([-98.6, 1.65, -5.4], [-98.9, 1.6, -5.8], [-100.1, 1.55, -8.4], [-100.1, 1.55, -8.4], u, 32); },
      no: (t, u) => { indoor(hall); const turn = eo(clamp(u * 2)); place(BM, -100, 0, -8.6, turn * 0.9); pose(BM, 'Man_Idle', t, { Neck: [0, -0.4 * turn, 0], UpperArmR: [0, 0.6, 0.6] }); BM.head.update(t, { close: 0.4 });
        place(AM, -100.1, 0, -6.9, PI); pose(AM, 'Man_Idle', t + 1, P_.sad); AM.head.update(t, { close: 0.6 });
        C([-101.4, 1.6, -5.2], [-101.1, 1.6, -5.6], [-100.1, 1.5, -7.6], [-100.1, 1.5, -7.6], u, 34); },
      parashu: (t, u) => { setSky('blue', V3(0, 0, 0)); burst.visible = true; key.intensity = 1.0; hemi.intensity = 0.8; const sw = Math.sin(t * 3);
        place(PR, 0.45, 0, -0.45, 0); face(PR, -0.45, 0.45); pose(PR, 'Man_Idle', t, { UpperArmR: [0, 1.6 + sw * 0.6, 0.6], LowerArmR: [0, 0, 0.4], Torso: [0, 0, 0] }); PR.head.update(t, { brow: -0.8, talk: 0.3 });
        place(BM, -0.45, 0, 0.45, 0); face(BM, 0.45, -0.45); pose(BM, 'Man_Idle', t, { UpperArmL: [0, -1.2, 0.5], UpperArmR: [0, 0.9, 0.7], LowerArmR: [0, 0, 1.6], Neck: [0, -0.35, 0] }); BM.head.update(t, { brow: -0.8 });
        fly(burst, t, { c: V3(0, 0, 0), sx: 5, sz: 3, sy: 0.8, vy: 0.2 });
        C([3.6, 1.1, 3.0], [3.1, 1.3, 3.2], [0, 1.4, 0], [0, 1.45, 0], u, 36);
        A.HUD = x => { tag(x, 'PARASHURAAMUDU', K.pulse(u, 0.05, 0.85), 'Guru against disciple — 23 days'); flash(x, t, F('parashu', 0.3)); flash(x, t, F('parashu', 0.72)); }; },
      draw: (t, u) => { setSky('dawn', V3(0, 0, 0)); dust.visible = true; place(PR, 0.55, 0, -0.55, 0); face(PR, -0.55, 0.55); pose(PR, 'Man_Idle', t, { UpperArmR: [0, 0.2, 0.1] }); PR.head.update(t, { close: 0.3 });
        place(BM, -0.55, 0, 0.55, 0); face(BM, 0.55, -0.55); pose(BM, 'Man_Idle', t, P_.namaste); BM.head.update(t, { close: 0.5 });
        C([4.2, 1.4, 3.6], [3.7, 1.5, 3.4], [0, 1.2, 0], [0, 1.3, 0], u, 34); },
      tapas: (t, u) => { setSky('night', V3(200, 0, -3)); outdoor(true); forest.visible = true; camp.visible = true; sparks.visible = true; const ap = eo(clamp((u - 0.35) * 2.5));
        place(AM, 200, 0, -1.2, 0.2); pose(AM, 'Man_Sitting', 0.6, P_.namaste); AM.root.position.y = -0.05; AM.head.update(t, { close: 1 - ap * 0.8 });
        place(SV, 200.2, 0.08 + (1 - ap) * 0.6, -4.2, 0); SV.root.visible = ap > 0.02; pose(SV, 'Man_Idle', t, P_.bless); SV.head.update(t, { talk: narr(t) * 0.6 * ap });
        fly(sparks, t, { c: V3(200.2, 0, -4.2), sx: 2.4, sz: 1.6, sy: 3.6, vy: 0.5 }); hemi.intensity = 0.6 + ap * 0.6; hemi.color.set(0x9ab8ff);
        C([201.6, 1.0, 2.6], [201.2, 1.2, 2.1], [200.1, 1.2, -2.4], [200.1, 1.5, -2.8], u, 34);
        A.HUD = x => tag(x, 'SHIVUDI VARAM', K.pulse(u, 0.35, 0.6), 'You will be the cause of his death'); },
      fire: (t, u) => { setSky('night', V3(300, 0, 0)); outdoor(true); fireSet.visible = true; hemi.intensity = 0.35; key.intensity = 0.2;
        place(AM, 300, 0, 2.2, PI); pose(AM, 'Man_Idle', t, P_.namaste); AM.head.update(t, { close: 0.85 });
        C([302.8, 1.7, 6.4], [302.3, 1.6, 5.8], [300, 1.1, 1.2], [300, 1.2, 1.1], u, 34);
        A.HUD = x => { const w = clamp((u - 0.8) * 5) * 0.6; if (w > 0) { x.fillStyle = `rgba(255,190,120,${w})`; x.fillRect(0, 0, 1080, 1920); } }; },
      reborn: (t, u) => { indoor(drupada); place(SK, -300, 0, -8.0, 0); pose(SK, 'Man_Idle', t, { UpperArmL: [0, -0.6, 0.4] }); SK.head.update(t, { look: [0, 0.1] });
        C([-299.2, 1.2, -4.4], [-299.6, 1.35, -5.4], [-300, 1.45, -8.0], [-300, 1.5, -8.0], u, 34);
        A.HUD = x => tag(x, 'SHIKHANDI', K.pulse(u, 0.05, 0.9), 'Born again in Drupada’s house'); },
      war: (t, u) => { setSky('gold', V3(0, 0, -6)); [chariot, A.banners, A.debris].forEach(o => o.visible = true); chariot.position.set(0.2, 0, -7); chariot.rotation.y = -1.3;
        place(BH, 0.3, 0.95, -7.1, 0.1); pose(BH, 'Man_Idle', t, { UpperArmL: [0, -0.2, 0.2] }); BH.head.update(t, { close: 0.3 });
        place(SK, 0.0, 0, -1.0, PI); pose(SK, 'Man_Idle', t, { UpperArmL: [0, -1.2, 0.5], UpperArmR: [0, 0.9, 0.7], LowerArmR: [0, 0, 1.4] }); SK.head.update(t, {});
        const g = eo(clamp((u - 0.45) * 3)); AMG.root.visible = g > 0.01; place(AMG, 0.2, 0.15, -0.2, PI); AMG.root.visible = g > 0.01; pose(AMG, 'Man_Idle', t, P_.armsOut); AMG.head.update(t, {}); ghostOpacity = g * 0.45;
        C([1.4, 1.7, 2.8], [1.1, 1.75, 2.3], [0, 1.6, -6], [0.1, 1.6, -6], u, 34);
        A.HUD = x => tag(x, 'KURUKSHETRAM', K.pulse(u, 0.05, 0.6), 'He will not shoot at Amba'); },
      tenth: (t, u) => { setSky('gold', V3(0, 0, -6)); [chariot, A.banners, A.debris].forEach(o => o.visible = true); chariot.position.set(0.2, 0, -7); chariot.rotation.y = -1.3;
        place(BH, 0.3, 0.95, -7.1, 0.1); pose(BH, 'Man_Idle', t, { UpperArmL: [0, -0.2, 0.2], Neck: [0.2 * u, 0, 0] }); BH.head.update(t, { close: 0.3 + u * 0.4 });
        place(SK, 0.0, 0, -1.0, PI); pose(SK, 'Man_Idle', t, { UpperArmL: [0, -1.2, 0.5] }); SK.head.update(t, {});
        const d = 0.5 + 0.5 * Math.abs(Math.sin(u * 7)); place(AR, 0.6, 0, 0.6, PI + 0.05); pose(AR, 'Man_Idle', t, { UpperArmL: [0, -1.2, 0.5], UpperArmR: [0, 0.9, 0.7], LowerArmR: [0, 0, 0.6 + 1.2 * d], Neck: [0, -0.35, 0] }); AR.head.update(t, { brow: -0.6 });
        C([1.5, 1.75, 3.4], [1.2, 1.8, 2.9], [0, 1.7, -6], [0.1, 1.7, -6], u, 32);
        A.HUD = x => tag(x, 'PADHO ROJU', K.pulse(u, 0.05, 0.8), 'Arjuna fires from behind Shikhandi'); },
      cta: (t, u) => { setSky('blue', V3(0, 0, -6)); chariot.visible = true; chariot.position.set(0.2, 0, -7); chariot.rotation.y = -1.3; key.intensity = 0.5;
        place(BH, 0.3, 0.95, -7.1, 0.1); pose(BH, 'Man_Idle', t); BH.head.update(t, { close: 0.3 });
        C([2.6, 2.6, -1.2], [2.3, 2.5, -1.8], [0.2, 2.2, -7], [0.2, 2.3, -7], u, 32);
        A.HUD = x => endCard(x, t, u, { series: 'BHEESHMUDU', part: 'PART 2 / 3', title: 'Amba', te: 'అంబ', next: 'Part 3 — Ampashayya', ctaAt: Bt('cta') + 0.5 }); },
    };
    let ghostOpacity = 0;
    const SFX = [['bass', 0.05, 0.6], ['whoosh', Bt('kashi') + 0.3, 0.4], ['chime', F('love', 0.3), 0.3], ['bass', F('reject', 0.4), 0.5], ['bass', F('no', 0.3), 0.6], ['riser', Bt('parashu'), 0.4],
      ['thud', F('parashu', 0.3), 0.8], ['thud', F('parashu', 0.72), 0.8], ['chime', F('tapas', 0.4), 0.6], ['riser', Bt('fire'), 0.4], ['chime', Bt('reborn') + 0.2, 0.4], ['bass', Bt('war') + 0.3, 0.5], ['chime', F('war', 0.5), 0.5], ['whoosh', F('tenth', 0.4), 0.5], ['pop', Bt('cta') + 0.6, 0.5], ['ding', Bt('cta') + 1.6, 0.5]];
    const res = finish({ SH, SRC, SFX, onFrame: t => { AMG.root.traverse(q => { if (q.isMesh) [].concat(q.material).forEach(m => { m.opacity = ghostOpacity; }); }); ghostOpacity = 0; } });
    // the ghost gets its own (non-shared) materials so making it see-through doesn't touch Amba
    const ghostM = m => new THREE.MeshBasicMaterial({ color: new THREE.Color(m.color || 0xffffff).lerp(new THREE.Color(0xffd8e0), 0.5), map: m.map || null, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, fog: false });
    AMG.root.traverse(q => { if (q.isMesh) q.material = Array.isArray(q.material) ? q.material.map(ghostM) : ghostM(q.material); });
    return res;
  },
};
