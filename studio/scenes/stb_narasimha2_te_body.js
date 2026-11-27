// Narasimha Part 2/3 — Prahlada can't be killed. STORYBOOK 3D look (redo 27 Nov 2026), built on studio/scenes/stb_storybook_kit.js.
// Same Telugu voice lines (Maddy's cloned voice). Sets: Indra taking Kayadhu, Narada's lime-green ashram, the turquoise gurukul with
// low desks, the obsidian-emerald throne hall (Prahlada on his father's lap), spears, elephants and snakes, an indigo night cliff,
// a ring of fire around Prahlada on a lotus. Ending: navy title card over Prahlada in the fire ring.
window.SCENE = {
  assets: ['assets/chars/worker.glb'],
  setup: { bg: 0x9fb6cf, fog: null, fov: 35, bloom: null },
  lines: window.STB_LINES,
  build(K, T) {
    const A = window.STORYBOOK(K, T);
    const { THREE, S, PI, TAU, clamp, lerp, ease, eo, prog, L, Bt, Et, F, D, V3, rng, mat, GOLD, hero, heroes, pose, place, setSky, key, hemi, groupOf, shadowAll,
      flames, diya, fly, dust, sparks, petals, stars, burst, label, tag, cam, C, narr, reg, outdoor, finish, makePalace, makeHut, endCard, titleCard, P_, mix_, frontOf, bonfire, bigLotus, makeElephant, makeSnake, holdR, glowTexH } = A;

    // ---------------------------------------------------------------- cast
    const HK = hero({ skin: 0x7a4a32, dhoti: 0x1a1a22, sash: 0xc8a02a, utt: 0x2a6a4a, hair: 0x0a0806, crown: 'gold', stache: 'curl', beard: 'short', scale: 1.14, seed: 1.4 });
    const PR = hero({ skin: 0xd0a07a, dhoti: 0xf2c030, sash: 0x2a6ac0, utt: 0xf2c030, crown: 'bun', hairStyle: 'short', tilak: true, jewel: false, scale: 0.6, headScale: 0.42, seed: 5.5 });
    const KY = hero({ female: true, skin: 0xc8946c, dhoti: 0x2a8a6a, sash: 0xe8b23a, blouse: 0xe8b23a, utt: 0x2a8a6a, crown: 'tiara', earrings: true, bindi: true, lip: 0xa04050, browR: 0.011, seed: 2.7 });
    const IN = hero({ skin: 0xe0b090, dhoti: 0xf8f4ea, sash: 0x2a7ac0, crown: 'gold', stache: 'thin', tilak: true, seed: 4.4 });
    const NA = hero({ skin: 0xd8a882, dhoti: 0xf2efe6, sash: 0xe8862a, utt: 0xe8862a, hair: 0xeeeae4, crown: 'jata', beard: 'long', beardCol: 0xeeeae4, browCol: 0xf4f0ea, stache: 'thick', jewel: false, tilak: true, seed: 3.8 });
    const KIDS = [0, 1].map(i => hero({ skin: [0xb07a52, 0xc08a62][i], dhoti: [0xe8e0cc, 0xd86a2a][i], sash: 0x6a4a2a, crown: 'bun', hairStyle: 'short', jewel: false, scale: 0.6, headScale: 0.42, seed: 6 + i }));
    const GU = hero({ skin: 0x9a6a48, dhoti: 0xe8862a, sash: 0x8a3a1a, utt: 0xe8862a, hair: 0x2a2420, crown: 'bun', beard: 'short', stache: 'thick', jewel: false, tilak: true, seed: 7.1 });
    const GD = [0, 1, 2].map(i => hero({ skin: [0x5a3a2a, 0x6a4030, 0x4a3022][i], dhoti: 0x2a1a1a, sash: 0x8a1a1a, crown: 'helmet', torso: 'tunic', tunic: [0x3a1a1a, 0x2a2a1a, 0x1a2a2a][i], sashOn: false, stache: 'thick', jewel: false, scale: 1.1, seed: 9 + i }));
    const spear = () => { const g = new THREE.Group(); const sh = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 2.0, 8), mat(0x5a3a1e)); sh.position.y = 0.2; g.add(sh); const tp = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.25, 10), mat(0xc8ccd4, { metalness: 0.7 })); tp.position.y = 1.3; g.add(tp); return g; };
    GD.forEach(M => holdR(M, spear()));
    const face = (M, x, z) => { M.root.rotation.y = Math.atan2(x - M.root.position.x, z - M.root.position.z); };

    // ---------------------------------------------------------------- sets
    const AX = -100; const asura = makePalace({ x0: AX, z0: 0, wall: '#16231e', arch: '#2a9a6a', curtain: '#0a3a2a', pillar: 0x1e1e24, floorA: '#1a2a22', floorB: '#2a3a2a' });
    const GX = -200; const school = makePalace({ x0: GX, z0: 0, wall: '#d8f2ee', arch: '#1aa8a0', curtain: '#f2a02a', pillar: 0xf2faf8, floorA: '#e6f6f2', floorB: '#b8e6dc' });
    const desks = groupOf(); for (let i = 0; i < 3; i++) { const d = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.35, 0.45), mat(0x8a5a2e)); d.position.set(GX - 1.2 + i * 1.2, 0.18, -6.2); desks.add(d); const lf = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.02, 0.12), mat(0xd9c08a)); lf.position.set(GX - 1.2 + i * 1.2, 0.37, -6.2); desks.add(lf); } shadowAll(desks);
    const ashram = makeHut(); ashram.position.set(-60, 0, -3);
    const ELE = [makeElephant(0x8a8a92, 1.0), makeElephant(0x7a7a84, 0.9)];
    const SNK = [0, 1, 2, 3].map(i => makeSnake([0x2a8a3a, 0x3a6a2a, 0x2a7a5a, 0x4a8a2a][i], 2.2, 1.0));
    const CX = 300; const cliff = groupOf(); { const rk = mat(0x6a6a8a, { roughness: 1 }); const c = new THREE.Mesh(new THREE.BoxGeometry(8, 14, 8), rk); c.position.set(0, 7 - 14, 0); cliff.add(c); const top = new THREE.Mesh(new THREE.CylinderGeometry(4.5, 5, 1, 10), rk); top.position.y = -0.5; cliff.add(top);
      const base = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), mat(0x24304a, { roughness: 1 })); base.rotation.x = -PI / 2; base.position.y = -14; cliff.add(base); shadowAll(cliff); }
    cliff.position.set(CX, 0, 0);
    const ring = groupOf(); for (let i = 0; i < 10; i++) { const a = i / 10 * TAU; bonfire(ring, 150 + Math.cos(a) * 2.2, Math.sin(a) * 2.2, 0.9, i % 3 === 0); }
    const lotus = bigLotus(1.3); lotus.position.set(150, 0.05, 0); S.add(lotus);
    const cup = groupOf(); { const c = new THREE.Mesh(new THREE.LatheGeometry([[0, 0], [0.06, 0], [0.05, 0.03], [0.02, 0.06], [0.02, 0.12], [0.08, 0.2], [0.07, 0.22]].map(([a, b]) => new THREE.Vector2(a, b)), 20), GOLD); cup.add(c); const l = new THREE.Mesh(new THREE.CircleGeometry(0.065, 20), new THREE.MeshBasicMaterial({ color: 0x5aff6a })); l.rotation.x = -PI / 2; l.position.y = 0.205; cup.add(l); }
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexH(), color: 0xfff0b0, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.8 })); halo.scale.set(1.6, 1.6, 1); S.add(halo);
    reg(asura, school, desks, ashram, cliff, ring, lotus, cup, halo, ...ELE, ...SNK);

    // ---------------------------------------------------------------- shots
    const SRC = { recap: 'BHAAGAVATHA PURAANAM', kayadhu: 'BHAAGAVATHA PURAANAM', narada: 'BHAAGAVATHA PURAANAM', womb: 'BHAAGAVATHA PURAANAM', school: 'BHAAGAVATHA PURAANAM', lap: 'BHAAGAVATHA PURAANAM', answer: 'BHAAGAVATHA PURAANAM', rage: 'BHAAGAVATHA PURAANAM', spears: 'BHAAGAVATHA PURAANAM', eleph: 'BHAAGAVATHA PURAANAM', cliff: 'BHAAGAVATHA PURAANAM', safe: 'BHAAGAVATHA PURAANAM', fear: 'BHAAGAVATHA PURAANAM' };
    const seat = V3(AX, 1.1, -11.35);
    const inPalace = (sky = 'night') => { setSky(sky, V3(AX, 0, -8)); outdoor(false); asura.visible = true; hemi.intensity = 0.9; hemi.color.set(0xa0ffd0); key.intensity = 1.0; key.color.set(0xffd890); };
    const prHalo = (on = true) => { if (!on) return; halo.visible = true; PR.root.updateMatrixWorld(true); halo.position.copy(PR.head.getWorldPosition(V3(0, 0, 0))).add(V3(0, 0.02, -0.12)); };
    const courtyard = (sky) => { setSky(sky, V3(0, 0, 0)); outdoor(true); };
    const SH = {
      recap: (t, u) => { inPalace(); place(HK, seat.x, seat.y - 1.0, seat.z + 0.1, 0); pose(HK, 'Man_Sitting', 0.6, { UpperArmR: [0, 1.2, 0.5] }); HK.head.update(t, { brow: -1 });
        C([AX + 0.3, 0.8, -6.0], [AX + 0.2, 1.0, -7.4], [AX, 1.6, -11.3], [AX, 1.7, -11.3], u, 34);
        A.HUD = x => titleCard(x, u, 'Prahlaadudu', 'NARASIMHUDU  ·  PART 2 / 3'); },
      kayadhu: (t, u) => { setSky('blue', V3(-60, 0, 0)); ashram.visible = true; place(IN, -59.2, 0, 1.0, -1.2); pose(IN, 'Man_Walk', t, { UpperArmL: [0, -0.6, 0.9] }); IN.head.update(t, { brow: -0.5 });
        place(KY, -60.4, 0, 1.4, -1.6); pose(KY, 'Man_Idle', t, { UpperArmR: [0, 1.2, 0.6], Neck: [0, 0.4, 0] }); KY.head.update(t, { brow: 1, talk: 0.4 });
        C([-58.0, 1.5, 5.4], [-58.6, 1.5, 4.8], [-59.8, 1.4, 1.2], [-59.8, 1.4, 1.2], u, 36);
        A.HUD = x => tag(x, 'KAYAADHU', K.pulse(u, 0.05, 0.85), 'Taken by Indra'); },
      narada: (t, u) => { setSky('gold', V3(-60, 0, 0)); ashram.visible = true; place(NA, -60.8, 0, 0.8, 0.6); pose(NA, 'Man_Idle', t, P_.bless); NA.head.update(t, { talk: narr(t) * 0.5 });
        place(KY, -59.6, 0, 1.4, -2.2); pose(KY, 'Man_Idle', t, P_.namaste); KY.head.update(t, { close: 0.3 });
        C([-57.8, 1.5, 4.6], [-58.4, 1.55, 4.0], [-60.2, 1.4, 1.0], [-60.2, 1.45, 1.0], u, 34);
        A.HUD = x => tag(x, 'NAARADUDU', K.pulse(u, 0.05, 0.85), 'Safe in the ashram'); },
      womb: (t, u) => { setSky('night', V3(-60, 0, 0)); ashram.visible = true; sparks.visible = true; place(NA, -60.8, 0, 0.8, 0.6); pose(NA, 'Man_Sitting', 0.6, { UpperArmR: [0, 0.6, 0.9], LowerArmR: [0, 0, 1.0] }); NA.root.position.y = -0.05; NA.head.update(t, { talk: narr(t) * 0.6 });
        place(KY, -59.5, 0, 1.4, -2.2); pose(KY, 'Man_Sitting', 0.6, P_.namaste); KY.root.position.y = -0.05; KY.head.update(t, { close: 0.6 });
        KY.root.updateMatrixWorld(true); halo.visible = true; halo.position.copy(KY.B.Abdomen.getWorldPosition(V3(0, 0, 0))).add(V3(0, 0, 0.1)); halo.scale.setScalar(0.9 + Math.sin(t * 3) * 0.1);
        fly(sparks, t, { c: V3(-60, 0, 1), sx: 2, sz: 2, sy: 2.4, vy: 0.3 }); hemi.intensity = 0.8;
        C([-58.2, 1.4, 5.0], [-58.4, 1.35, 4.6], [-60.1, 0.8, 1.1], [-60.1, 0.8, 1.1], u, 34);
        A.HUD = x => tag(x, 'GARBHAMLONE', K.pulse(u, 0.4, 0.6), 'The unborn child listens'); },
      school: (t, u) => { setSky('gold', V3(GX, 0, -8)); outdoor(false); school.visible = desks.visible = true;
        place(GU, GX, 0, -9.0, 0); pose(GU, 'Man_Idle', t, { UpperArmR: [0, 1.0, 0.8], LowerArmR: [0, 0, 0.8] }); GU.head.update(t, { brow: -0.5 });
        [KIDS[0], PR, KIDS[1]].forEach((M, i) => { place(M, GX - 1.2 + i * 1.2, 0, -5.6, PI); pose(M, 'Man_Sitting', 0.6, M === PR ? P_.namaste : {}); M.root.position.y = -0.03; M.head.update(t, { talk: M === PR ? narr(t) * 0.5 : 0 }); });
        C([GX + 1.6, 1.4, -3.0], [GX + 1.2, 1.3, -3.4], [GX, 0.8, -6.6], [GX, 0.8, -6.6], u, 38);
        A.HUD = x => tag(x, 'GURUKULAM', K.pulse(u, 0.05, 0.85), '"Naaraayana!"'); },
      lap: (t, u) => { inPalace('gold'); place(HK, seat.x, seat.y - 1.0, seat.z + 0.1, 0); pose(HK, 'Man_Sitting', 0.6, { UpperArmR: [0, 0.4, 0.9], LowerArmR: [0, 0, 1.2] }); HK.head.update(t, { talk: narr(t) * 0.7, look: [0.3, -0.3] });
        place(PR, seat.x + 0.18, seat.y - 0.35, seat.z + 0.55, -0.3); pose(PR, 'Man_Sitting', 0.6, P_.namaste); PR.head.update(t, { look: [-0.3, 0.3] });
        C([AX + 0.9, 1.6, -8.0], [AX + 0.7, 1.55, -8.6], [AX, 1.5, -11.0], [AX, 1.5, -11.0], u, 34); },
      answer: (t, u) => { inPalace('gold'); place(HK, seat.x, seat.y - 1.0, seat.z + 0.1, 0); pose(HK, 'Man_Sitting', 0.6, { UpperArmR: [0, 0.4, 0.9], LowerArmR: [0, 0, 1.2] }); HK.head.update(t, { brow: 0.4 });
        place(PR, seat.x + 0.18, seat.y - 0.35, seat.z + 0.55, -0.3); pose(PR, 'Man_Sitting', 0.6, P_.namaste); PR.head.update(t, { talk: narr(t), close: 0.2 }); prHalo();
        const fo = frontOf(PR, 0.8, 0, 0.1), fo2 = frontOf(PR, 0.6, 0, 0.05); C(fo.p.toArray(), fo2.p.toArray(), fo.h.toArray(), fo2.h.toArray(), u, 32);
        A.HUD = x => tag(x, 'VISHNU BHAKTHI', K.pulse(u, 0.4, 0.6), 'The greatest learning'); },
      rage: (t, u) => { inPalace('night'); key.color.set(0xff5a3a); place(HK, AX, 0, -9.4, 0); pose(HK, 'Man_Idle', t, mix_(P_.point, { Neck: [-0.15, 0, 0] })); HK.head.update(t, { talk: narr(t), brow: -1 });
        place(PR, AX + 0.2, 0, -7.2, PI); pose(PR, 'Man_Idle', t, P_.namaste); PR.head.update(t, { close: 0.8 });
        const fo = frontOf(HK, 1.6, -0.4, 0.4), fo2 = frontOf(HK, 1.3, -0.45, 0.3); C(fo.p.toArray(), fo2.p.toArray(), fo.h.toArray(), fo2.h.toArray(), u, 34);
        A.HUD = x => tag(x, 'CHAMPEYANDI!', K.pulse(u, 0.4, 0.6)); },
      spears: (t, u) => { inPalace('night'); place(PR, AX, 0, -6.0, 0); pose(PR, 'Man_Idle', t, P_.namaste); PR.head.update(t, { close: 0.9 }); prHalo(); sparks.visible = true;
        const k = Math.abs(Math.sin(u * PI * 3)); GD.forEach((M, i) => { const a = -0.9 + i * 0.9, d = 1.3 - k * 0.35; place(M, AX + Math.sin(a) * d, 0, -6.0 - Math.cos(a) * d, 0); face(M, AX, -6.0); pose(M, 'Man_Idle', t + i, { UpperArmR: [0, 0.7, 1.2], LowerArmR: [0, 0, 0.3], Torso: [0.2 * k, 0, 0] }); M.head.update(t, { brow: -1 }); });
        fly(sparks, t, { c: V3(AX, 0, -6), sx: 1.4, sz: 1.4, sy: 1.6, vy: 0.4 });
        C([AX + 1.4, 1.6, -1.8], [AX + 1.1, 1.5, -2.6], [AX, 0.8, -6.4], [AX, 0.8, -6.4], u, 36);
        A.HUD = x => tag(x, 'OKKA GAAYAM KUDA KAALEDU', K.pulse(u, 0.4, 0.6)); },
      eleph: (t, u) => { courtyard('gold'); place(PR, 0, 0, 0, 0.3); pose(PR, 'Man_Idle', t, P_.namaste); PR.head.update(t, { close: 0.9 }); prHalo();
        ELE.forEach((e, i) => { e.visible = true; const k = eo(clamp(u * 1.4)); e.position.set((i ? 1.4 : -1.4), 0, lerp(-7, -3.0, k)); e.rotation.y = i ? -0.3 : 0.3; e.userData.legs.forEach((lg, j) => lg.rotation.x = k < 1 ? Math.sin(t * 5 + j * 1.6) * 0.3 : 0); });
        SNK.forEach((sn, i) => { sn.visible = u > 0.5; const a = i / 4 * TAU + 0.4; sn.position.set(Math.cos(a) * 1.0, 0, Math.sin(a) * 1.0); sn.rotation.y = -a + PI / 2; });
        C([0.6, 2.2, 8.2], [0.5, 2.1, 7.6], [0, 1.6, -2.0], [0, 1.6, -2.0], u, 42);
        A.HUD = x => tag(x, 'ENUGULU · PAAMULU', K.pulse(u, 0.05, 0.9)); },
      cliff: (t, u) => { setSky('night', V3(CX, 0, 0)); outdoor(false); cliff.visible = true; petals.visible = true; hemi.intensity = 1.0; key.intensity = 1.4; const k = clamp((u - 0.25) / 0.75);
        place(HK, CX - 1.2, 0, 0.5, 0.8); pose(HK, 'Man_Idle', t, P_.point); HK.head.update(t, { brow: -1 });
        place(PR, CX + 0.6 + k * 2.6, -k * k * 9, 0.6, 0); pose(PR, 'Man_Idle', t, P_.namaste); PR.head.update(t, { close: 0.9 }); prHalo();
        fly(petals, t, { c: V3(CX + 3, -10, 0.6), sx: 2, sz: 2, sy: 10, vy: 0.6 });
        C([CX + 5.5, 1.0, 11.0], [CX + 5.2, 0.2, 10.4], [CX + 1.6, 0.0, 0], [CX + 2.4, -2.5, 0], u, 42);
        A.HUD = x => tag(x, 'KONDA MEEDA NUNCHI', K.pulse(u, 0.05, 0.6), 'Cliff, poison, fire'); },
      safe: (t, u) => { setSky('night', V3(150, 0, 0)); outdoor(true); ring.visible = lotus.visible = true; petals.visible = true; key.intensity = 0.4;
        place(PR, 150, 0.32, 0, 0); pose(PR, 'Man_Sitting', 0.6, P_.namaste); PR.head.update(t, { close: 0.85, talk: narr(t) * 0.3 }); prHalo();
        fly(petals, t, { c: V3(150, 0, 0), sx: 3, sz: 3, sy: 3, vy: -0.4 });
        C([152.6, 1.8, 5.2], [152.0, 1.6, 4.4], [150, 0.8, 0], [150, 0.9, 0], u, 36);
        A.HUD = x => tag(x, 'NAARAAYANA', K.pulse(u, 0.1, 0.8), 'Smiling, untouched'); },
      fear: (t, u) => { inPalace('night'); key.color.set(0xff8a5a); place(HK, AX, 0, -9.4, 0); pose(HK, 'Man_Idle', t, { Neck: [0.2, 0, 0], UpperArmR: [0, 0.3, 1.2], LowerArmR: [0, 0, 2.0] }); HK.head.update(t, { brow: 1, look: [Math.sin(t * 2) * 0.5, -0.2] });
        const fo = frontOf(HK, 1.0, -0.05, 0.25), fo2 = frontOf(HK, 0.75, -0.02, 0.15); C(fo.p.toArray(), fo2.p.toArray(), fo.h.toArray(), fo2.h.toArray(), u, 30);
        A.HUD = x => tag(x, 'BHAYAM', K.pulse(u, 0.2, 0.7), 'Where does his strength come from?'); },
      cta: (t, u) => { setSky('night', V3(150, 0, 0)); outdoor(true); ring.visible = lotus.visible = true; key.intensity = 0.4; place(PR, 150, 0.32, 0, 0); pose(PR, 'Man_Sitting', 0.6, P_.namaste); PR.head.update(t, { close: 0.85 }); prHalo();
        C([150.4, 3.6, 4.6], [150.3, 3.3, 4.0], [150, 0.5, 0], [150, 0.55, 0], u, 34);
        A.HUD = x => endCard(x, t, u, { series: 'NARASIMHUDU', part: 'PART 2 / 3', title: 'Prahlaadudu', te: 'ప్రహ్లాదుడు', next: 'Part 3 — The Pillar', ctaAt: Bt('cta') + 0.5 }); },
    };
    const SFX = [['bass', 0.05, 0.6], ['whoosh', F('kayadhu', 0.3), 0.4], ['chime', F('narada', 0.3), 0.4], ['chime', F('womb', 0.4), 0.5], ['pop', F('school', 0.4), 0.4], ['chime', F('answer', 0.5), 0.5],
      ['bass', F('rage', 0.3), 0.9], ['thud', F('spears', 0.2), 0.6], ['thud', F('spears', 0.55), 0.6], ['thud', F('eleph', 0.5), 0.8], ['whoosh', F('cliff', 0.3), 0.6], ['chime', F('safe', 0.3), 0.5], ['bass', F('fear', 0.3), 0.6], ['pop', Bt('cta') + 0.6, 0.5], ['ding', Bt('cta') + 1.6, 0.5]];
    return finish({ SH, SRC, SFX });
  },
};
