// Ashwatthama: the curse that keeps him alive. STORYBOOK 3D look (redo 27 Nov 2026), built on studio/scenes/stb_storybook_kit.js.
// Same Telugu voice lines (Maddy's cloned voice). Sets: misty moonlit forest road, Drona's ashram by day, red-dusk Kurukshetra,
// a night tree with sleeping crows and the owl, the Pandava camp tents by torchlight (raid kept non-graphic: shadow + fire), dawn
// riverbank of the Ganga (chase, astra clash, Vyasa), Krishna's curse. The gem glows cyan; after it is taken, a red wound glows.
// Ending: the lone wanderer walking away into the fog.
window.SCENE = {
  assets: ['assets/chars/worker.glb'],
  setup: { bg: 0x9fb6cf, fog: null, fov: 35, bloom: null },
  lines: window.STB_LINES,
  build(K, T) {
    const A = window.STORYBOOK(K, T);
    const { THREE, S, PI, TAU, clamp, lerp, ease, eo, prog, L, Bt, Et, F, D, V3, rng, mat, GOLD, SILVER, hero, heroes, pose, place, setSky, key, hemi, groupOf, shadowAll, tents,
      flames, diya, torch, fly, dust, sparks, petals, stars, burst, label, tag, cam, C, narr, reg, outdoor, finish, waterTex, makeWater, makeHut, makeBook, endCard, titleCard, P_, mix_, bonfire,
      frontOf, makeForest, bird, makeSword, holdR, fireball, makeBow, handBow } = A;

    // ---------------------------------------------------------------- cast
    const AS = hero({ skin: 0x9a6844, dhoti: 0x3a3a4a, sash: 0x8a2a2a, utt: 0x4a4a5a, hair: 0x15100c, crown: 'band', stache: 'thin', stubble: true, gem: 'gem', seed: 1.3 });
    const DR = hero({ skin: 0xb07a52, dhoti: 0xf2efe6, sash: 0xd8862a, utt: 0xf2e2c0, hair: 0xe8e4de, beard: 'long', beardCol: 0xe8e4de, browCol: 0xeeeae4, stache: 'thick', crown: 'bun', jewel: false, tilak: true, seed: 2.1 });
    const DY = hero({ skin: 0xb07a52, dhoti: 0x6a1a4a, sash: 0xd8a02a, utt: 0x6a1a4a, crown: 'gold', stache: 'curl', seed: 2.8 });
    const KR = hero({ skin: 0x5a80c4, dhoti: 0xf0c030, sash: 0xd04a1a, crown: 'krishna', lip: 0x7a3a4a, tilak: true, seed: 2.6 });
    const AR = hero({ skin: 0xc28654, dhoti: 0xe8b02c, sash: 0xb3241a, crown: 'gold', stache: 'curl', stubble: true, tilak: true, seed: 1.9 });
    const BM = hero({ skin: 0x9a6440, dhoti: 0x2a5a8a, sash: 0xd8a02a, crown: 'gold', stache: 'thick', beard: 'short', scale: 1.08, seed: 3.9 });
    const VY = hero({ skin: 0x6a4a34, dhoti: 0xe8862a, sash: 0xb8401a, utt: 0xe8862a, hair: 0xeeeae4, crown: 'jata', beard: 'long', beardCol: 0xeeeae4, browCol: 0xf4f0ea, stache: 'thick', jewel: false, tilak: true, seed: 4.7 });
    const DP = hero({ female: true, skin: 0x9a6a48, dhoti: 0x8a1a6a, sash: 0xe8b23a, blouse: 0xe8b23a, utt: 0x8a1a6a, crown: 'tiara', earrings: true, bindi: true, lip: 0xa04048, browR: 0.011, seed: 5.6 });
    const sword = makeSword(); holdR(AS, sword); const bowAR = makeBow(); handBow(AR, bowAR);
    const face = (M, x, z) => { M.root.rotation.y = Math.atan2(x - M.root.position.x, z - M.root.position.z); };
    const gem = (on) => { const u = AS.head.userData; u.gem.material.color.set(on ? 0x8af4ff : 0xc0303a); u.gemGlow.material.color.set(on ? 0x8af4ff : 0xff4040); };

    // ---------------------------------------------------------------- sets
    const FX = 200; const forest = makeForest(FX, 0, 70, 14, 71, 0x2a5a32);
    const road = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 60), mat(0x8a7a5a, { roughness: 1 })); road.rotation.x = -PI / 2; road.position.set(FX, 0.03, -10); S.add(road);
    const ashram = makeHut(); ashram.position.set(-60, 0, -3);
    const owlTree = groupOf(); { const tr = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.4, 6, 12), mat(0x4a3020)); tr.position.y = 3; owlTree.add(tr);
      const br = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.1, 3.4, 8), mat(0x4a3020)); br.rotation.z = PI / 2 - 0.15; br.position.set(1.4, 4.6, 0); owlTree.add(br);
      for (let j = 0; j < 6; j++) { const b = new THREE.Mesh(new THREE.SphereGeometry(1.4, 18, 12), mat(0x24482a)); b.position.set((j - 2.5) * 0.9, 6.6 + (j % 2) * 0.6, (j % 3 - 1) * 0.7); owlTree.add(b); } shadowAll(owlTree); }
    owlTree.position.set(300, 0, 0);
    const crows = [0, 1, 2, 3].map(i => { const c = bird(0x121212, 1.1); c.position.set(300 + 0.6 + i * 0.55, 4.82, 0); c.rotation.y = PI / 2 + (i % 2) * 0.4; S.add(c); return c; });
    const owl = bird(0x7a5a3a, 1.6, true); S.add(owl);
    const campFire = groupOf(); torch(campFire, -3.2, -12.8, 2.0); torch(campFire, 3.4, -13.5, 2.0); torch(campFire, -1.0, -19.5, 2.0);
    const raidFire = groupOf(); bonfire(raidFire, -1.5, -17.5, 2.2, true); bonfire(raidFire, 1.5, -18.5, 1.8, false);
    const RX = 100; const river = groupOf(); river.add(makeWater(RX, -31.5, 120, 60));
    const fbA = fireball(0xff8a30, 1.2), fbB = fireball(0x80c0ff, 1.2);
    const gemProp = groupOf(); { const gs = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 12), new THREE.MeshBasicMaterial({ color: 0x8af4ff })); gemProp.add(gs);
      const gl = new THREE.Sprite(new THREE.SpriteMaterial({ map: A.glowTexH(), color: 0x8af4ff, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true })); gl.scale.set(0.9, 0.9, 1); gemProp.add(gl); }
    const book = makeBook(); book.position.set(60, 0, 60);
    reg(forest, road, ashram, owlTree, owl, campFire, raidFire, river, fbA, fbB, gemProp, book, ...crows);

    // ---------------------------------------------------------------- shots
    const SRC = { hook: 'SAUPTIKA PARVA', who: 'AADI PARVA', gem: 'SAUPTIKA PARVA', rage: 'SHALYA PARVA', owl: 'SAUPTIKA PARVA', raid: 'SAUPTIKA PARVA', chase: 'SAUPTIKA PARVA', clash: 'SAUPTIKA PARVA', recall: 'SAUPTIKA PARVA', womb: 'SAUPTIKA PARVA', curse: 'SAUPTIKA PARVA', gemloss: 'SAUPTIKA PARVA', belief: 'NAMMAKAM' };
    const mist = (n = 4, f = 34) => { S.fog.near = n; S.fog.far = f; };
    const forestRoad = (t, u, wound) => { setSky('night', V3(FX, 0, 0)); outdoor(false); forest.visible = road.visible = true; mist(3, 26); key.intensity = 0.6; hemi.intensity = 0.6; gem(!wound);
      const z = lerp(2, -6, u); place(AS, FX, 0, z, PI); pose(AS, 'Man_Walk', t * 0.8); AS.head.update(t, { close: 0.3 }); return z; };
    const SH = {
      hook: (t, u) => { const z = forestRoad(t, u, true); AS.root.rotation.y = 0; AS.root.position.z = lerp(-6, 1, u);
        C([FX + 0.8, 1.2, 5.2], [FX + 0.5, 1.4, 4.6], [FX, 1.4, AS.root.position.z], [FX, 1.5, AS.root.position.z], u, 34);
        A.HUD = x => titleCard(x, u, 'Ashwatthama', 'CHIRANJEEVI  ·  THE CURSE'); },
      who: (t, u) => { setSky('gold', V3(-60, 0, 0)); ashram.visible = true; gem(true);
        place(DR, -60.6, 0, 0.6, 0.5); pose(DR, 'Man_Idle', t, P_.bless); DR.head.update(t, { talk: narr(t) * 0.5 });
        place(AS, -59.6, 0, 1.2, -2.4); pose(AS, 'Man_Idle', t, P_.bowHead); AS.head.update(t, { close: 0.4 });
        C([-57.6, 1.5, 4.6], [-58.1, 1.55, 4.0], [-60.1, 1.45, 0.8], [-60.1, 1.5, 0.8], u, 34);
        A.HUD = x => tag(x, 'DRONAACHAARYUDI KODUKU', K.pulse(u, 0.1, 0.85), 'Born with a gem on his forehead'); },
      gem: (t, u) => { setSky('gold', V3(-60, 0, 0)); ashram.visible = true; sparks.visible = true; gem(true); place(AS, -60, 0, 1, 0.2); pose(AS, 'Man_Idle', t); AS.head.update(t, { look: [0, 0.2] });
        const fo = frontOf(AS, 0.75, 0.02), fo2 = frontOf(AS, 0.5, 0.05); fly(sparks, t, { c: fo.h.clone().add(V3(0, -0.6, 0)), sx: 1, sz: 1, sy: 1.4, vy: 0.3 });
        C(fo.p.toArray(), fo2.p.toArray(), fo.h.clone().add(V3(0, 0.05, 0)).toArray(), fo2.h.clone().add(V3(0, 0.06, 0)).toArray(), u, 30);
        A.HUD = x => tag(x, 'MANI', K.pulse(u, 0.05, 0.85), 'No hunger, no thirst, no fear'); },
      rage: (t, u) => { setSky('blue', V3(0, 0, 0)); [A.debris, A.banners].forEach(o => o.visible = true); burst.visible = true; gem(true); key.intensity = 1.2; key.color.set(0xff6a3a);
        place(DY, 0.3, 0.12, -0.6, 0, -PI / 2 + 0.1); DY.root.rotation.set(-PI / 2, 0.4, 0, 'YXZ'); pose(DY, 'Man_Idle', 0.2); DY.head.update(t, { close: 0.85 });
        place(AS, -0.4, 0, 0.9, 0.3); pose(AS, 'Man_Idle', t, { UpperArmR: [0, 0.4, 0.3], LowerArmR: [0, 0, 0.6], UpperArmL: [0, -0.4, 0.3], LowerArmL: [0, 0, 0.6], Neck: [-0.15, 0, 0] }); AS.head.update(t, { brow: -1, talk: 0.2 });
        fly(burst, t, { c: V3(0, 0, 0), sx: 6, sz: 4, sy: 1, vy: 0.2 });
        C([1.6, 0.6, 4.2], [1.1, 0.7, 3.6], [-0.3, 1.4, 0.6], [-0.3, 1.5, 0.7], u, 34);
        A.HUD = x => tag(x, 'KURUKSHETRAM', K.pulse(u, 0.05, 0.85), 'Drona killed. Duryodhana broken.'); },
      owl: (t, u) => { setSky('night', V3(300, 0, 0)); outdoor(true); owlTree.visible = owl.visible = true; crows.forEach(c => { c.visible = true; c.flap(t, u > 0.55 ? 1 : 0); }); key.intensity = 0.8; gem(true);
        const k = clamp((u - 0.25) / 0.35); owl.position.set(300 + lerp(-4, 1.3, k), lerp(8, 5.0, k), lerp(3, 0, k)); owl.rotation.y = 0.9; owl.flap(t, k < 1 ? 1 : 0.2);
        if (u > 0.55) crows.forEach((c, i) => { const e = (u - 0.55) * 3; c.position.set(300 + 0.6 + i * 0.55 + e * (i - 1.5), 4.82 + e * (1 + i * 0.3), e * (i % 2 ? 1 : -1)); });
        else crows.forEach((c, i) => c.position.set(300 + 0.6 + i * 0.55, 4.82, 0));
        place(AS, 299.4, 0, 3.2, PI - 0.4); pose(AS, 'Man_Idle', t, { Neck: [-0.5, 0, 0] }); AS.head.update(t, { look: [0, 0.7] }); hemi.intensity = 1.0; key.intensity = 1.5;
        C([298.6, 3.0, 4.4], [298.9, 3.3, 4.0], [300.8, 4.7, 0], [300.9, 4.8, 0], u, 36);
        A.HUD = x => tag(x, 'GUDLAGOOBA', K.pulse(u, 0.05, 0.85), 'The owl among sleeping crows'); },
      raid: (t, u) => { setSky('night', V3(0, 0, -16)); outdoor(true); campFire.visible = true; raidFire.visible = u > 0.62; key.intensity = 0.35; hemi.intensity = 0.5; gem(true);
        const w = clamp(u / 0.6); place(AS, lerp(3, -0.2, w), 0, lerp(-8, -13.2, w), 0); face(AS, -0.5, -16.5); pose(AS, w < 1 ? 'Man_Walk' : 'Man_Idle', t, w < 1 ? { UpperArmR: [0, 0.4, 0.5] } : { UpperArmR: [0, 2.0, 0.5], LowerArmR: [0, 0, 0.2] }); AS.head.update(t, { brow: -1 });
        C([4.6, 1.5, -6.2], [3.6, 1.4, -7.0], [0.2, 1.6, -14.5], [-0.4, 1.8, -16], u, 36);
        A.HUD = x => { tag(x, 'PAANDAVA SHIBIRAM', K.pulse(u, 0.05, 0.6), 'The night raid'); const w2 = clamp((u - 0.62) * 4) * 0.35; if (w2 > 0) { x.fillStyle = `rgba(255,120,40,${w2})`; x.fillRect(0, 0, 1080, 1920); } }; },
      chase: (t, u) => { setSky('dawn', V3(RX, 0, 0)); river.visible = true; gem(true); const k = eo(u);
        place(AS, RX + 0.4, 0, 0.4, PI); pose(AS, 'Man_Idle', t, { UpperArmR: [0, 2.3, 0.4] }); AS.head.update(t, { brow: -1, talk: narr(t) * 0.6 });
        fbA.visible = u > 0.55; fbA.position.set(RX + 0.6, 2.7, 0.3); fbA.scale.setScalar(clamp((u - 0.55) * 4));
        [[BM, -1.4], [AR, 0], [KR, 1.4]].forEach(([M, dx], i) => { place(M, RX + dx, 0, lerp(12, 6.5, k), PI); pose(M, k < 0.98 ? 'Man_Run' : 'Man_Idle', t + i); M.head.update(t, {}); });
        C([RX + 1.0, 1.9, -2.8], [RX + 0.9, 1.85, -2.5], [RX, 1.3, 6], [RX, 1.3, 6], u, 36);
        A.HUD = x => tag(x, 'BRAHMASHIRA ASTHRAM', K.pulse(u, 0.5, 0.5)); },
      clash: (t, u) => { setSky('dawn', V3(RX, 0, 0)); river.visible = true; sparks.visible = true; gem(true); const k = eo(clamp(u * 1.6));
        fbA.visible = fbB.visible = true; fbA.position.set(RX + lerp(-6, -0.4, k), 6, -8); fbB.position.set(RX + lerp(6, 0.4, k), 6, -8); const big = 1 + clamp((u - 0.6) * 3) * 1.8; fbA.scale.setScalar(big); fbB.scale.setScalar(big);
        fly(sparks, t, { c: V3(RX, 4, -8), sx: 10 * big, sz: 4, sy: 6, vy: 0.6 });
        place(AS, RX - 3.2, 0, -1, 0.4); pose(AS, 'Man_Idle', t, { UpperArmR: [0, 2.3, 0.4] }); AS.head.update(t, { brow: -1 });
        place(AR, RX + 3.2, 0, -1, -0.4); pose(AR, 'Man_Idle', t, { UpperArmL: [0, -1.2, 0.5], UpperArmR: [0, 0.9, 0.7], LowerArmR: [0, 0, 0.6] }); AR.head.update(t, { brow: -1 });
        C([RX, 1.2, 9.0], [RX, 1.6, 8.0], [RX, 4.5, -6], [RX, 5, -7], u, 42);
        A.HUD = x => { const f = clamp((u - 0.65) * 4) * Math.max(0, 1 - (u - 0.65) * 2); if (f > 0) { x.fillStyle = `rgba(255,240,220,${0.6 * f})`; x.fillRect(0, 0, 1080, 1920); } }; },
      recall: (t, u) => { setSky('dawn', V3(RX, 0, 0)); river.visible = true; gem(true); fbA.visible = fbB.visible = true; const k = eo(u);
        fbA.position.set(RX - 0.6, 6, -8); fbA.scale.setScalar(2.4); fbB.position.set(RX + lerp(0.6, 6, k), lerp(6, 2.5, k), lerp(-8, -1, k)); fbB.scale.setScalar(lerp(2.4, 0.2, k));
        place(VY, RX, 0, -2.2, 0); pose(VY, 'Man_Idle', t, P_.armsOut); VY.head.update(t, { talk: narr(t) * 0.6 });
        place(AR, RX + 3.2, 0, -1, -0.4); pose(AR, 'Man_Idle', t, P_.namaste); AR.head.update(t, {});
        C([RX + 1.2, 1.4, 4.8], [RX + 0.8, 1.6, 4.2], [RX, 2.2, -3], [RX, 2.6, -3.5], u, 38);
        A.HUD = x => tag(x, 'VYAASUDU', K.pulse(u, 0.05, 0.85), 'Stop!'); },
      womb: (t, u) => { setSky('dawn', V3(RX, 0, 0)); river.visible = true; gem(true); fbA.visible = true; const k = eo(u);
        fbA.position.set(RX + lerp(-0.6, -18, k), lerp(6, 1.5, k), lerp(-8, -30, k)); fbA.scale.setScalar(lerp(2.4, 1.2, k));
        place(AS, RX - 3.2, 0, -1, -2.6); pose(AS, 'Man_Idle', t, { UpperArmR: [0, 1.4, 0.9] }); AS.head.update(t, { brow: -1 });
        place(KR, RX - 0.6, 0, 1.8, PI); pose(KR, 'Man_Idle', t, { UpperArmR: [0, 1.5, 0.9], LowerArmR: [0, 0, 0.1] }); KR.head.update(t, {});
        C([RX + 2.0, 1.6, 5.4], [RX + 1.4, 1.7, 5.0], [RX - 3, 2.5, -6], [RX - 6, 2.2, -12], u, 38);
        A.HUD = x => tag(x, 'UTTHARA', K.pulse(u, 0.1, 0.8), 'Krishna will protect the child'); },
      curse: (t, u) => { setSky('blue', V3(RX, 0, 0)); river.visible = true; gem(true); key.intensity = 0.9;
        place(KR, RX, 0, 1.6, PI); face(KR, RX - 0.8, -0.8); pose(KR, 'Man_Idle', t, mix_(P_.point, { Neck: [-0.05, 0, 0] })); KR.head.update(t, { talk: narr(t), brow: -0.8 });
        place(AS, RX - 0.8, 0, -0.8, 0); face(AS, RX, 1.6); pose(AS, 'Man_Idle', t, P_.bowHead); AS.head.update(t, { close: 0.5 });
        const fo = frontOf(KR, 1.6, -0.2, 0.5), fo2 = frontOf(KR, 1.2, -0.25, 0.35); C(fo.p.toArray(), fo2.p.toArray(), fo.h.toArray(), fo2.h.toArray(), u, 32);
        A.HUD = x => tag(x, 'SHAAPAM', K.pulse(u, 0.05, 0.85), '3000 years, alone, wounded'); },
      gemloss: (t, u) => { setSky('blue', V3(RX, 0, 0)); river.visible = true; gemProp.visible = true; gem(false);
        place(AS, RX - 0.8, 0, -0.8, 0.5); pose(AS, 'Man_Idle', t, { UpperArmR: [0, 0.3, 1.2], LowerArmR: [0, 0, 2.2], Neck: [0.25, 0, 0] }); AS.head.update(t, { close: 0.7 });
        place(DP, RX - 0.1, 0, 0.3, -2.3); pose(DP, 'Man_Idle', t, { UpperArmR: [0, 0.3, 1.0], LowerArmR: [0, 0, 0.6] }); DP.head.update(t, {});
        DP.root.updateMatrixWorld(true); gemProp.position.copy(DP.B.PalmR.getWorldPosition(V3(0, 0, 0))).add(V3(0, 0.08, 0));
        C([RX + 0.6, 1.6, 4.4], [RX + 0.5, 1.55, 3.9], [RX - 0.45, 1.35, -0.25], [RX - 0.45, 1.35, -0.25], u, 34);
        A.HUD = x => tag(x, 'DRAUPADI', K.pulse(u, 0.05, 0.85), 'The gem is taken; a wound remains'); },
      belief: (t, u) => { forestRoad(t, u, true); mist(2, 20); C([FX + 0.6, 1.6, 6.4], [FX + 0.4, 1.7, 5.8], [FX, 1.3, -2], [FX, 1.3, -4], u, 34);
        A.HUD = x => tag(x, 'NAMMAKAM', K.pulse(u, 0.1, 0.8), 'Is he still walking the earth?'); },
      cta: (t, u) => { forestRoad(t, 0.5 + u * 0.5, true); mist(2, 18); C([FX + 0.3, 2.4, 6.4], [FX + 0.3, 2.6, 6.8], [FX, 1.0, -3], [FX, 1.0, -4], u, 34);
        A.HUD = x => endCard(x, t, u, { series: 'CHIRANJEEVI', part: null, title: 'Ashwatthama', te: 'అశ్వత్థామ', next: null, ctaAt: Bt('cta') + 0.5 }); },
    };
    const SFX = [['bass', 0.05, 0.6], ['chime', F('who', 0.3), 0.4], ['chime', F('gem', 0.3), 0.6], ['bass', F('rage', 0.4), 0.8], ['whoosh', F('owl', 0.35), 0.5], ['buzz', F('owl', 0.6), 0.2],
      ['bass', F('raid', 0.6), 0.8], ['riser', F('chase', 0.4), 0.5], ['thud', F('clash', 0.62), 1.0], ['bass', F('clash', 0.63), 0.9], ['chime', F('recall', 0.4), 0.5], ['whoosh', F('womb', 0.2), 0.5], ['thud', F('curse', 0.3), 0.7], ['chime', F('gemloss', 0.4), 0.4], ['pop', Bt('cta') + 0.6, 0.5], ['ding', Bt('cta') + 1.6, 0.5]];
    return finish({ SH, SRC, SFX, onFrame: t => { waterTex.offset.set(t * 0.01, t * 0.02); } });
  },
};
