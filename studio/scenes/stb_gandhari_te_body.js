// Why did Gandhari blindfold herself for life? STORYBOOK 3D look (redo 27 Nov 2026), built on studio/scenes/stb_storybook_kit.js.
// Same Telugu voice lines (Maddy's cloned voice). Sets: rose-and-plum Gandhara palace, moonlit Shiva shrine, white-gold Hastinapura
// throne hall, the plum palace window through the seasons, dusk Kurukshetra with widows' lamps and crows, Krishna before her.
// Ending: Gandhari seated among diyas in the plum night.
window.SCENE = {
  assets: ['assets/chars/worker.glb'],
  setup: { bg: 0x9fb6cf, fog: null, fov: 35, bloom: null },
  lines: window.STB_LINES,
  build(K, T) {
    const A = window.STORYBOOK(K, T);
    const { THREE, S, PI, TAU, clamp, lerp, ease, eo, prog, L, Bt, Et, F, D, V3, rng, mat, GOLD, hero, heroes, pose, place, setSky, key, hemi, groupOf, shadowAll,
      flames, diya, fly, dust, sparks, petals, stars, burst, label, tag, cam, C, narr, reg, outdoor, finish, makePalace, makeTemple, makeBook, endCard, titleCard, P_, mix_, snake, frontOf, bird, cloud } = A;

    // ---------------------------------------------------------------- cast
    const GN = hero({ female: true, skin: 0xdcae8e, dhoti: 0x7a2a6a, sash: 0xe8b23a, blouse: 0xe8b23a, utt: 0x7a2a6a, crown: 'tiara', earrings: true, bindi: true, lip: 0xb04a60, browR: 0.011, blindCol: 0x4a1a4a, seed: 1.7 });
    const DH = hero({ skin: 0xc08a66, dhoti: 0xf2e6d0, sash: 0x8a1c3a, utt: 0x8a1c3a, hair: 0x6a6460, crown: 'gold', beard: 'short', beardCol: 0x8a8480, stache: 'thick', seed: 2.5 });
    const SB = hero({ skin: 0xd0a07a, dhoti: 0xe8d8f0, sash: 0x5a2a6a, utt: 0x5a2a6a, crown: 'turban', turban: 0xe8c040, beard: 'short', beardCol: 0x6a5a50, stache: 'thick', seed: 3.2 });
    const BM = hero({ skin: 0xbf8a62, dhoti: 0xf2efe6, sash: 0xc9a24a, hair: 0x3a3430, beard: 'short', beardCol: 0x4a4440, stache: 'thick', crown: 'gold', torso: 'armor', sashOn: false, tilak: true, seed: 0.9 });
    const SV = hero({ skin: 0x8aa8cc, dhoti: 0xf2e6d0, sash: 0x8a6a4a, utt: 0xe0d0b0, hair: 0x2a2a3a, crown: 'jata', moon: true, ganga: true, jewel: false, tilak: true, lip: 0x6a4a5a, seed: 6.6 });
    const YU = hero({ skin: 0xb07a52, dhoti: 0xf3ead6, sash: 0x7a1830, utt: 0x7a1830, crown: 'gold', beard: 'short', stache: 'thin', tilak: true, seed: 0.3 });
    const KR = hero({ skin: 0x5a80c4, dhoti: 0xf0c030, sash: 0xd04a1a, crown: 'krishna', lip: 0x7a3a4a, tilak: true, seed: 2.6 });
    const WD = [0, 1].map(i => hero({ female: true, skin: [0xc89a78, 0xb08060][i], dhoti: 0xf2efe6, sash: 0xe0dcd0, blouse: 0xf2efe6, utt: 0xf2efe6, crown: 'bun', lip: 0x9a5a5a, browR: 0.011, seed: 7 + i }));
    snake(SV);
    const blind = (on) => { GN.head.userData.blind.visible = on; GN.head.userData.blindKnot.visible = on; };
    const face = (M, x, z) => { M.root.rotation.y = Math.atan2(x - M.root.position.x, z - M.root.position.z); };
    // Yudhishthira's toe tips (they darken)
    const toeM = mat(0xb07a52); const toes = [];
    YU.g.updateMatrixWorld(true); for (const sd of ['L', 'R']) { const fb = YU.B['Foot' + sd], ws = fb.getWorldScale(V3(0, 0, 0)).x;
      for (let i = 0; i < 4; i++) { const tt = new THREE.Mesh(new THREE.SphereGeometry(0.02, 10, 8), toeM); fb.add(tt); tt.scale.setScalar(1 / ws); tt.position.set((i - 1.5) * 0.024 / ws, -0.04 / ws, 0.2 / ws); toes.push(tt); } }

    // ---------------------------------------------------------------- sets
    const gandhara = makePalace({ x0: -200, z0: 0, wall: '#f6dfe6', arch: '#b05a7a', curtain: '#6a2a5a', pillar: 0xfaeef0, floorA: '#f6e6ea', floorB: '#e6c6d2' });
    const hall = makePalace({ x0: -100, z0: 0 });
    const shrine = makeTemple(0xf2e6d0, 0.9); shrine.position.set(300, 0, -6);
    const lamps = groupOf(); for (let i = 0; i < 26; i++) { const r = rng(i + 3), a = r() * TAU, d = 1.0 + r() * 2.4; diya(lamps, 150 + Math.cos(a) * d, 0.04, Math.sin(a) * d, 1.3, i % 6 === 0); }
    const widowLamps = groupOf(); for (let i = 0; i < 30; i++) { const r = rng(i + 90); diya(widowLamps, (r() - 0.5) * 12, 0.04, -2 - r() * 10, 1.3, i % 8 === 0); }
    const crows = [0, 1, 2, 3, 4].map(i => { const c = bird(0x121212, 1.4); S.add(c); return c; });
    const seasons = cloud(260, 0xffffff, 0.08, 31, 0.9, false);
    reg(gandhara, hall, shrine, lamps, widowLamps, seasons, ...crows);

    // ---------------------------------------------------------------- shots
    const SRC = { hook: 'AADI PARVA', who: 'AADI PARVA', boon: 'AADI PARVA', prop: 'AADI PARVA', blind: 'AADI PARVA', quiet: 'AADI PARVA', cloth: 'AADI PARVA', why: 'AADI PARVA', years: 'AADI PARVA', war: 'STREE PARVA', toe: 'STREE PARVA', curse: 'STREE PARVA', end: 'MAHABHARATAM' };
    const GX = -200, HX = -100;
    const indoor = (P, sky = 'dawn', x0 = GX) => { setSky(sky, V3(x0, 0, -8)); outdoor(false); P.visible = true; };
    const seat = V3(GX, 1.1, -11.35), hseat = V3(HX, 1.1, -11.35);
    const SH = {
      hook: (t, u) => { indoor(gandhara, 'dawn'); blind(true); place(GN, GX, 0, -6.5, 0); pose(GN, 'Man_Idle', t); GN.head.update(t, {});
        const fo = frontOf(GN, 1.4, -0.05, 0.25), fo2 = frontOf(GN, 0.95, 0, 0.15); C(fo.p.toArray(), fo2.p.toArray(), fo.h.toArray(), fo2.h.toArray(), u, 32);
        A.HUD = x => titleCard(x, u, 'Gaandhaari', 'THE BLINDFOLDED QUEEN'); },
      who: (t, u) => { indoor(gandhara, 'gold'); blind(false); petals.visible = true; place(GN, GX, 0, -7, 0); pose(GN, 'Man_Idle', t, P_.namaste); GN.head.update(t, { look: [0.2, 0] });
        fly(petals, t, { c: V3(GX, 0, -6), sx: 5, sz: 4, sy: 4, vy: -0.4 });
        C([GX + 1.6, 1.4, -2.6], [GX + 1.1, 1.5, -3.6], [GX, 1.3, -7], [GX, 1.4, -7], u, 34);
        A.HUD = x => tag(x, 'GAANDHAARAM', K.pulse(u, 0.05, 0.9), 'The princess of Gandhara'); },
      boon: (t, u) => { setSky('night', V3(300, 0, -3)); outdoor(true); shrine.visible = true; sparks.visible = true; blind(false); const ap = eo(clamp(u * 2.5));
        place(GN, 300, 0, -1.4, PI); pose(GN, 'Man_Sitting', 0.6, P_.namaste); GN.root.position.y = -0.05; GN.head.update(t, { close: 0.7 });
        place(SV, 300, 0.1 + (1 - ap) * 0.6, -3.4, 0); SV.root.visible = ap > 0.02; pose(SV, 'Man_Idle', t, P_.bless); SV.head.update(t, { talk: narr(t) * 0.5 * ap });
        fly(sparks, t, { c: V3(300, 0, -3.4), sx: 2.4, sz: 1.6, sy: 3.6, vy: 0.5 }); hemi.intensity = 0.7 + ap * 0.5; hemi.color.set(0x9ab8ff);
        C([301.8, 1.3, 2.4], [301.3, 1.4, 1.9], [300.1, 1.3, -2.4], [300.1, 1.5, -2.6], u, 34);
        A.HUD = x => tag(x, 'SHIVUDI VARAM', K.pulse(u, 0.2, 0.75), 'A hundred sons'); },
      prop: (t, u) => { indoor(gandhara, 'gold'); blind(false); place(SB, seat.x, seat.y - 0.98, seat.z + 0.1, 0); pose(SB, 'Man_Sitting', 0.6, P_.bless); SB.head.update(t, {});
        place(BM, GX + 0.4, 0, -7.6, PI); face(BM, seat.x, seat.z); pose(BM, 'Man_Idle', t, P_.namaste); BM.head.update(t, { talk: narr(t) * 0.6 });
        C([GX + 1.3, 1.6, -4.4], [GX + 1.15, 1.6, -4.8], [GX + 0.25, 1.4, -9.0], [GX + 0.25, 1.4, -9.2], u, 34);
        A.HUD = x => tag(x, 'BHEESHMUDU', K.pulse(u, 0.05, 0.85), 'A proposal from Hastinapura'); },
      blind: (t, u) => { indoor(hall, 'gold', HX); place(DH, hseat.x, hseat.y - 0.98, hseat.z + 0.1, 0); pose(DH, 'Man_Sitting', 0.6, { Neck: [-0.1, 0, 0] }); DH.head.update(t, { close: 1 });
        DH.root.updateMatrixWorld(true); const hp = DH.head.getWorldPosition(V3(0, 0, 0));
        C([HX + 0.2, 1.5, -6.0], [HX + 0.1, hp.y, hp.z + 1.3], [HX, hp.y - 0.2, hp.z], [HX, hp.y, hp.z], u, 32);
        A.HUD = x => tag(x, 'DHRUTHARAASHTRUDU', K.pulse(u, 0.15, 0.8), 'Blind from birth'); },
      quiet: (t, u) => { indoor(gandhara, 'dawn'); blind(false); place(GN, GX - 0.6, 0, -6.8, 0.4); pose(GN, 'Man_Idle', t, { Neck: [0.25, 0, 0] }); GN.head.update(t, { close: 0.65 });
        const fo = frontOf(GN, 1.1, -0.1, -0.3), fo2 = frontOf(GN, 0.9, -0.1, -0.2); C(fo.p.toArray(), fo2.p.toArray(), fo.h.toArray(), fo2.h.toArray(), u, 30); },
      cloth: (t, u) => { indoor(gandhara, 'dawn'); const up = eo(clamp(u * 1.6)); blind(u > 0.62); place(GN, GX - 0.6, 0, -6.8, 0.4);
        pose(GN, 'Man_Idle', t, { UpperArmR: [0, 0.3 + up * 1.5, 0.9], LowerArmR: [0, 0, up * 1.9], UpperArmL: [0, -0.3 - up * 1.5, 0.9], LowerArmL: [0, 0, up * 1.9] }); GN.head.update(t, { close: 1 });
        const fo = frontOf(GN, 1.5, -0.2, 0.3), fo2 = frontOf(GN, 1.1, -0.1, 0.2); C(fo.p.toArray(), fo2.p.toArray(), fo.h.toArray(), fo2.h.toArray(), u, 32);
        A.HUD = x => tag(x, 'GANTHALU', K.pulse(u, 0.55, 0.45), 'She bound her own eyes'); },
      why: (t, u) => { indoor(hall, 'gold', HX); blind(true); place(DH, hseat.x - 0.55, hseat.y - 0.98, hseat.z + 0.1, 0); pose(DH, 'Man_Sitting', 0.6); DH.head.update(t, { close: 1 });
        place(GN, hseat.x + 0.55, hseat.y - 0.98, hseat.z + 0.1, 0); pose(GN, 'Man_Sitting', 0.6, P_.namaste); GN.head.update(t, {});
        C([HX, 1.5, -5.4], [HX, 1.45, -6.0], [HX, 1.2, -11.2], [HX, 1.2, -11.2], u, 34);
        A.HUD = x => tag(x, 'PATHIVRATHA', K.pulse(u, 0.1, 0.8), 'If he cannot see, neither will I'); },
      years: (t, u) => { indoor(gandhara, ['dawn', 'gold', 'blue', 'night'][Math.min(3, Math.floor(u * 4))]); blind(true); seasons.visible = true; const ph = Math.floor(u * 4);
        seasons.material.color.set([0xffa0c0, 0xf2c04a, 0xd86a2a, 0xffffff][ph]); fly(seasons, t, { c: V3(GX - 0.4, 0, -6.6), sx: 4, sz: 3, sy: 3.5, vy: -0.5, vx: 0.1 });
        place(GN, GX - 0.4, 0, -7.4, 0); pose(GN, 'Man_Sitting', 0.6, P_.namaste); GN.root.position.y = -0.05; GN.head.update(t, {});
        C([GX + 1.4, 1.5, -4.0], [GX + 0.8, 1.4, -4.4], [GX - 0.4, 0.8, -7.4], [GX - 0.4, 0.8, -7.4], u, 34);
        A.HUD = x => tag(x, 'ENNO SAMVATHSARAALU', K.pulse(u, 0.05, 0.9), 'Not even her children’s faces'); },
      war: (t, u) => { setSky('blue', V3(0, 0, -6)); [A.debris, widowLamps].forEach(o => o.visible = true); blind(true); key.color.set(0xff7a4a); key.intensity = 1.0;
        place(GN, 0, 0, -1.2, 0); pose(GN, 'Man_Idle', t, P_.sad); GN.head.update(t, {});
        WD.forEach((M, i) => { place(M, (i ? 1.6 : -1.7), 0, -4 - i, 0.3 * (i ? -1 : 1)); pose(M, 'Man_Sitting', 0.6, P_.bowHead); M.root.position.y = -0.05; M.head.update(t, { close: 0.8 }); });
        crows.forEach((c, i) => { c.visible = true; c.position.set(-3 + i * 1.4 + Math.sin(t + i) * 0.5, 4 + Math.sin(t * 1.3 + i) * 0.4, -6 - i); c.rotation.y = PI / 2; c.flap(t + i); });
        C([0.6, 1.3, 3.6], [0.4, 1.5, 2.8], [0, 1.4, -2], [0, 1.6, -3], u, 36);
        A.HUD = x => tag(x, 'KURUKSHETRAM', K.pulse(u, 0.05, 0.85), 'A hundred sons, all gone'); },
      toe: (t, u) => { setSky('blue', V3(0, 0, -6)); A.debris.visible = true; blind(true); key.color.set(0xff7a4a);
        place(GN, 0, 0, -1.2, 0); pose(GN, 'Man_Idle', t, { Neck: [0.35, 0, 0] }); GN.head.update(t, {});
        place(YU, 0.05, 0, -0.2, PI); pose(YU, 'Man_Sitting', 0.6, mix_(P_.namaste, P_.bowHead)); YU.root.position.y = -0.05; YU.head.update(t, { close: 0.8 });
        const dk = eo(clamp((u - 0.35) * 2.5)); toes[0].material.color.set(0xb07a52).lerp(new THREE.Color(0x1a1010), dk);
        YU.root.updateMatrixWorld(true); const fp = YU.B.FootL.getWorldPosition(V3(0, 0, 0));
        C([0.7, 2.0, -2.6], [0.6, 1.9, -2.3], [0.05, 0.25, 0.2], [0.05, 0.2, 0.25], u, 34);
        A.HUD = x => tag(x, 'DHARMARAAJU', K.pulse(u, 0.05, 0.8), 'A glance from under the blindfold'); },
      curse: (t, u) => { setSky('blue', V3(0, 0, -6)); A.debris.visible = true; blind(true); key.color.set(0xff6a3a); key.intensity = 1.1;
        place(GN, 0, 0, -1.2, 0); face(GN, 0.4, 1.6); pose(GN, 'Man_Idle', t, mix_(P_.point, { Neck: [-0.1, 0, 0] })); GN.head.update(t, { talk: narr(t), brow: -1 });
        place(KR, 0.4, 0, 1.6, PI); face(KR, 0, -1.2); pose(KR, 'Man_Idle', t, P_.namaste); KR.head.update(t, { close: 0.3 });
        C([1.9, 1.45, 2.6], [1.6, 1.5, 2.2], [0.1, 1.45, -0.6], [0.1, 1.45, -0.6], u, 34);
        A.HUD = x => tag(x, 'SHAAPAM', K.pulse(u, 0.4, 0.6), 'Thirty-six years'); },
      end: (t, u) => { setSky('night', V3(150, 0, 0)); outdoor(true); lamps.visible = true; blind(true); key.intensity = 0.3; hemi.intensity = 0.45;
        place(GN, 150, 0, 0, 0); pose(GN, 'Man_Sitting', 0.6, P_.namaste); GN.root.position.y = -0.05; GN.head.update(t, {});
        C([150.5, 1.4, 4.4], [150.3, 1.3, 3.4], [150, 0.8, 0], [150, 0.85, 0], u, 34);
        A.HUD = x => tag(x, 'THYAAGAM', K.pulse(u, 0.1, 0.8), 'She gave up her sight for him'); },
      cta: (t, u) => { setSky('night', V3(150, 0, 0)); outdoor(true); lamps.visible = true; blind(true); key.intensity = 0.3; hemi.intensity = 0.45;
        place(GN, 150, 0, 0, 0); pose(GN, 'Man_Sitting', 0.6, P_.namaste); GN.root.position.y = -0.05; GN.head.update(t, {});
        C([151.8, 3.2, 3.6], [151.6, 3.0, 3.2], [150, 0.6, 0], [150, 0.65, 0], u, 32);
        A.HUD = x => endCard(x, t, u, { series: 'MAHABHARATAM', part: null, title: 'Gaandhaari', te: 'గాంధారి', next: null, ctaAt: Bt('cta') + 0.5 }); },
    };
    const SFX = [['bass', 0.05, 0.6], ['chime', F('who', 0.3), 0.4], ['chime', F('boon', 0.3), 0.6], ['chime', F('prop', 0.3), 0.3], ['bass', F('blind', 0.2), 0.7], ['riser', Bt('cloth'), 0.4], ['thud', F('cloth', 0.62), 0.6],
      ['chime', F('years', 0.25), 0.3], ['chime', F('years', 0.5), 0.3], ['chime', F('years', 0.75), 0.3], ['bass', Bt('war') + 0.2, 0.7], ['buzz', F('toe', 0.5), 0.3], ['thud', F('curse', 0.4), 0.8], ['chime', Bt('end') + 0.3, 0.5], ['pop', Bt('cta') + 0.6, 0.5], ['ding', Bt('cta') + 1.6, 0.5]];
    return finish({ SH, SRC, SFX });
  },
};
