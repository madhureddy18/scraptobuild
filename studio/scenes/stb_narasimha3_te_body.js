// Narasimha Part 3/3 — the pillar, at dusk, on the threshold. STORYBOOK 3D look (redo 27 Nov 2026), built on studio/scenes/stb_storybook_kit.js.
// Same Telugu voice lines (Maddy's cloned voice). Sets: copper-bronze pillared hall with an arched dusk doorway, the cracking pillar with
// glowing seams and flying stone, the threshold at sunset (magenta-orange sky), devas watching, petals. The killing is kept off-screen
// (a white flash). Ending: calm Narasimha with Prahlada at his feet, diyas, pink-gold sky.
window.SCENE = {
  assets: ['assets/chars/worker.glb'],
  setup: { bg: 0x9fb6cf, fog: null, fov: 35, bloom: null },
  lines: window.STB_LINES,
  build(K, T) {
    const A = window.STORYBOOK(K, T);
    const { THREE, S, PI, TAU, clamp, lerp, ease, eo, prog, L, Bt, Et, F, D, V3, rng, mat, GOLD, hero, heroes, pose, place, setSky, key, hemi, groupOf, shadowAll,
      flames, diya, fly, dust, sparks, petals, stars, burst, label, tag, cam, C, narr, reg, outdoor, finish, makePalace, endCard, titleCard, P_, mix_, frontOf, glowTexH, holdR } = A;

    // ---------------------------------------------------------------- cast
    const HK = hero({ skin: 0x7a4a32, dhoti: 0x1a1a22, sash: 0xc8a02a, utt: 0x2a6a4a, hair: 0x0a0806, crown: 'gold', stache: 'curl', beard: 'short', scale: 1.14, seed: 1.4 });
    const PR = hero({ skin: 0xd0a07a, dhoti: 0xf2c030, sash: 0x2a6ac0, utt: 0xf2c030, crown: 'bun', hairStyle: 'short', tilak: true, jewel: false, scale: 0.6, headScale: 0.42, seed: 5.5 });
    const NS = hero({ skin: 0xe0a040, dhoti: 0xf2d060, sash: 0xc0302a, utt: 0xc0302a, hair: 0xc8782a, mane: 0xd8862a, crown: 'gold', lion: true, hairStyle: 'none', scale: 1.32, seed: 2.9 });
    const DEV = [0, 1].map(i => hero({ skin: [0xe0b090, 0xd8a47a][i], dhoti: 0xf8f4ea, sash: [0xc0302a, 0xd89a2a][i], crown: 'gold', tilak: true, seed: 8 + i }));
    const claws = new THREE.Group(); for (let i = 0; i < 4; i++) { const c = new THREE.Mesh(new THREE.ConeGeometry(0.012, 0.07, 8), new THREE.MeshBasicMaterial({ color: 0xfff6e0 })); c.position.set((i - 1.5) * 0.02, 0.1, 0.01); c.rotation.x = 0.3; claws.add(c); } holdR(NS, claws, 0.02);
    const face = (M, x, z) => { M.root.rotation.y = Math.atan2(x - M.root.position.x, z - M.root.position.z); };

    // ---------------------------------------------------------------- sets
    const AX = -100; const hall = makePalace({ x0: AX, z0: 0, wall: '#c88a5a', arch: '#6a2a12', curtain: '#5a1a2a', pillar: 0xb8733a, floorA: '#d8a878', floorB: '#b07a4a' });
    const PZ = -5.5; const pil = groupOf(); { const sh = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.5, 8.4, 28), mat(0xb8733a, { metalness: 0.3, roughness: 0.5 })); sh.position.y = 4.2; pil.add(sh);
      for (const y of [0.15, 8.4]) { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.3, 24), GOLD); c.position.y = y; pil.add(c); }
      const ct = K.canvasTex(256, 1024, (x, w, h) => { x.clearRect(0, 0, w, h); x.strokeStyle = '#fff6d0'; x.lineWidth = 6; const r = rng(3); for (let k = 0; k < 6; k++) { let px = r() * w, py = h * 0.15; x.beginPath(); x.moveTo(px, py); for (let i = 0; i < 12; i++) { px += (r() - 0.5) * 60; py += 60; x.lineTo(px, py); } x.stroke(); } });
      const crack = new THREE.Mesh(new THREE.CylinderGeometry(0.47, 0.52, 8.4, 28, 1, true), new THREE.MeshBasicMaterial({ map: ct, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })); crack.position.y = 4.2; pil.add(crack); pil.userData.crack = crack; pil.userData.shaft = sh; }
    pil.position.set(AX, 0, PZ);
    const frags = groupOf(); const fr = rng(12); const fragData = []; for (let i = 0; i < 40; i++) { const f = new THREE.Mesh(new THREE.DodecahedronGeometry(0.12 + fr() * 0.18), mat(0xb8733a)); frags.add(f); fragData.push([fr() - 0.5, fr(), fr() - 0.5, 1 + fr() * 6]); }
    const flash = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexH(), color: 0xfff2c0, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true })); S.add(flash);
    // threshold: a carved doorway at the front of the hall, opening onto the dusk sky
    const DZ = 6.0; const door = groupOf(); { const cm = mat(0xb8733a), gm = GOLD; for (const sx of [-1, 1]) { const p = new THREE.Mesh(new THREE.BoxGeometry(0.5, 4.6, 0.6), cm); p.position.set(sx * 1.6, 2.3, 0); door.add(p); }
      const lintel = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.6, 0.7), cm); lintel.position.y = 4.8; door.add(lintel); const arc = new THREE.Mesh(new THREE.TorusGeometry(1.35, 0.12, 10, 32, PI), gm); arc.position.y = 4.4; door.add(arc);
      const step = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.35, 1.0), mat(0xe0c8a0)); step.position.set(0, 0.17, 0); door.add(step); shadowAll(door); }
    door.position.set(AX, 0, DZ);
    const lamps = groupOf(); for (let i = 0; i < 16; i++) { const a = PI * 0.15 + i / 15 * PI * 0.7; diya(lamps, AX + Math.cos(a) * 2.6, 0.04, DZ + 1.2 + Math.sin(a) * 1.6, 1.3, i % 5 === 0); }
    reg(hall, pil, frags, flash, door, lamps);

    // ---------------------------------------------------------------- shots
    const SRC = Object.fromEntries(['recap', 'roar', 'every', 'pillar', 'yes', 'strike', 'burst', 'door', 'dusk', 'lap', 'nails', 'calm', 'soft', 'end'].map(k => [k, 'BHAAGAVATHA PURAANAM']));
    const inHall = (sky = 'blue') => { setSky(sky, V3(AX, 0, -4)); outdoor(false); hall.visible = true; pil.visible = true; hemi.intensity = 0.95; hemi.color.set(0xffd8b0); key.intensity = 1.2; key.color.set(0xffb070); pil.userData.crack.material.opacity = 0; pil.userData.shaft.visible = true; };
    const atDoor = (sky = 'dawn') => { setSky(sky, V3(AX, 0, DZ)); outdoor(true); door.visible = true; hall.visible = true; key.color.set(0xff8a50); key.intensity = 1.6; };
    const prHalo = () => { flash.visible = true; PR.root.updateMatrixWorld(true); flash.position.copy(PR.head.getWorldPosition(V3(0, 0, 0))).add(V3(0, 0, -0.1)); flash.scale.set(1.2, 1.2, 1); flash.material.color.set(0xfff0b0); };
    const nsLap = (t, holdHK) => { place(NS, AX, 0.22, DZ, 0); NS.root.scale.setScalar(0.86 * 1.32); pose(NS, 'Man_Sitting', 0.6, holdHK ? { UpperArmR: [0, 0.4, 0.9], LowerArmR: [0, 0, 0.6], UpperArmL: [0, -0.4, 0.9], LowerArmL: [0, 0, 0.6] } : {}); NS.head.update(t, { brow: holdHK ? -1 : 0, talk: holdHK ? 0.6 : 0 }); };
    const hkAcross = (t) => { HK.root.visible = true; const q1 = new THREE.Quaternion().setFromAxisAngle(V3(1, 0, 0), -PI / 2), q2 = new THREE.Quaternion().setFromAxisAngle(V3(0, 1, 0), PI / 2);
      HK.root.quaternion.copy(q2.multiply(q1)); HK.root.position.set(AX + 1.05, 1.15, DZ + 0.55); pose(HK, 'Man_Idle', 0.2, { Neck: [-0.4, 0, 0] }); HK.head.update(t, { close: 0.6, brow: 1 }); };
    const SH = {
      recap: (t, u) => { inHall('blue'); place(PR, AX + 0.8, 0, PZ + 2.0, -0.3); pose(PR, 'Man_Idle', t, P_.namaste); PR.head.update(t, { close: 0.4 }); prHalo();
        C([AX + 2.4, 1.0, PZ + 6.0], [AX + 1.8, 1.1, PZ + 5.0], [AX + 0.4, 1.4, PZ + 1.0], [AX + 0.4, 1.6, PZ + 1.0], u, 36);
        A.HUD = x => titleCard(x, u, 'The Pillar', 'NARASIMHUDU  ·  PART 3 / 3'); },
      roar: (t, u) => { inHall('blue'); place(HK, AX - 1.0, 0, PZ + 1.2, 0.6); pose(HK, 'Man_Idle', t, { UpperArmR: [0, 1.6, 0.6], UpperArmL: [0, -1.6, 0.6], Neck: [-0.2, 0, 0] }); HK.head.update(t, { talk: narr(t), brow: -1 });
        const fo = frontOf(HK, 1.5, -0.5, 0.2), fo2 = frontOf(HK, 1.15, -0.55, 0.15); C(fo.p.toArray(), fo2.p.toArray(), fo.h.toArray(), fo2.h.toArray(), u, 36);
        A.HUD = x => tag(x, 'GARJANA', K.pulse(u, 0.5, 0.5)); },
      every: (t, u) => { inHall('blue'); place(PR, AX + 0.8, 0, PZ + 2.0, -0.3); pose(PR, 'Man_Idle', t, P_.namaste); PR.head.update(t, { talk: narr(t), close: 0.15 }); prHalo();
        const fo = frontOf(PR, 0.9, 0.05, 0.1), fo2 = frontOf(PR, 0.7, 0.05, 0.05); C(fo.p.toArray(), fo2.p.toArray(), fo.h.toArray(), fo2.h.toArray(), u, 32);
        A.HUD = x => tag(x, 'ANTHATAA', K.pulse(u, 0.3, 0.7), 'In you, in me, in everything'); },
      pillar: (t, u) => { inHall('blue'); place(HK, AX - 1.2, 0, PZ + 1.6, 0); face(HK, AX, PZ); pose(HK, 'Man_Idle', t, P_.point); HK.head.update(t, { talk: narr(t), brow: -0.6 });
        place(PR, AX + 1.0, 0, PZ + 2.2, -0.6); pose(PR, 'Man_Idle', t, P_.namaste); PR.head.update(t, {});
        C([AX - 2.6, 1.5, PZ + 5.8], [AX - 2.2, 1.6, PZ + 5.2], [AX - 0.3, 2.0, PZ + 0.4], [AX - 0.2, 2.4, PZ], u, 38); },
      yes: (t, u) => { inHall('blue'); place(PR, AX + 1.0, 0, PZ + 2.2, -0.6); pose(PR, 'Man_Idle', t, P_.namaste); PR.head.update(t, { talk: narr(t), close: 0.1 }); prHalo();
        const fo = frontOf(PR, 0.75, 0.05, -0.1), fo2 = frontOf(PR, 0.6, 0.05, -0.05); C(fo.p.toArray(), fo2.p.toArray(), fo.h.toArray(), fo2.h.toArray(), u, 30); },
      strike: (t, u) => { inHall('blue'); const sw = eo(clamp(u * 2)); place(HK, AX - 0.95, 0, PZ + 0.9, 0); face(HK, AX, PZ); pose(HK, 'Man_Idle', t, { UpperArmR: [0, 2.3 - sw * 1.8, 0.8], LowerArmR: [0, 0, 0.3], Torso: [0.25 * sw, 0, 0] }); HK.head.update(t, { brow: -1, talk: 0.5 });
        pil.userData.crack.material.opacity = clamp((u - 0.45) * 3); C([AX + 2.4, 1.4, PZ + 6.0], [AX + 2.1, 1.45, PZ + 5.4], [AX - 0.4, 1.8, PZ + 0.4], [AX - 0.3, 2.0, PZ + 0.4], u, 36);
        A.HUD = x => { const f = K.pulse(u, 0.42, 0.12); if (f > 0) { x.fillStyle = `rgba(255,240,210,${0.5 * f})`; x.fillRect(0, 0, 1080, 1920); } }; },
      burst: (t, u) => { inHall('blue'); pil.userData.shaft.visible = u < 0.15; pil.userData.crack.material.opacity = u < 0.15 ? 1 : 0; frags.visible = true; const e = clamp(u * 1.4);
        frags.children.forEach((f, i) => { const d = fragData[i]; f.position.set(AX + d[0] * d[3] * e * 3, 4 * d[1] + d[3] * e * 1.5 - e * e * 4, PZ + d[2] * d[3] * e * 3); f.rotation.set(t * 3 + i, t * 2, 0); });
        const g = eo(clamp((u - 0.1) * 2)); place(NS, AX, 0, PZ, 0); NS.root.scale.setScalar(0.86 * 1.32 * (0.3 + 0.7 * g)); pose(NS, 'Man_Idle', t, { UpperArmR: [0, 1.6, 0.6], UpperArmL: [0, -1.6, 0.6] }); NS.head.update(t, { talk: 0.9, brow: -1 });
        flash.visible = true; flash.position.set(AX, 2.5, PZ + 0.6); flash.scale.setScalar(4 + 8 * K.pulse(u, 0, 0.5)); flash.material.color.set(0xfff2c0);
        C([AX + 1.0, 1.1, PZ + 7.0], [AX + 0.8, 1.2, PZ + 6.2], [AX, 2.6, PZ], [AX, 2.8, PZ], u, 40);
        A.HUD = x => { tag(x, 'NARASIMHUDU', K.pulse(u, 0.2, 0.8), 'Not man, not beast'); const f = K.pulse(u, 0.0, 0.25); if (f > 0) { x.fillStyle = `rgba(255,250,235,${0.7 * f})`; x.fillRect(0, 0, 1080, 1920); } }; },
      door: (t, u) => { atDoor('dawn'); const z = lerp(PZ + 2, DZ - 0.6, u); place(NS, AX, 0, z, 0); NS.root.scale.setScalar(0.86 * 1.32); pose(NS, 'Man_Walk', t, { UpperArmR: [0, 0.4, 0.9], LowerArmR: [0, 0, 0.6], UpperArmL: [0, -0.4, 0.9], LowerArmL: [0, 0, 0.6] }); NS.head.update(t, { brow: -1 });
        HK.root.visible = true; const q1 = new THREE.Quaternion().setFromAxisAngle(V3(1, 0, 0), -PI / 2), q2 = new THREE.Quaternion().setFromAxisAngle(V3(0, 1, 0), PI / 2); HK.root.quaternion.copy(q2.multiply(q1)); HK.root.position.set(AX + 1.0, 1.5, z + 0.5); pose(HK, 'Man_Idle', 0.2, { Neck: [-0.3, 0, 0] }); HK.head.update(t, { brow: 1 });
        C([AX + 0.5, 1.8, DZ + 5.5], [AX + 0.4, 1.8, DZ + 5.0], [AX, 1.8, z], [AX, 1.8, z], u, 38);
        A.HUD = x => tag(x, 'GUMMAM', K.pulse(u, 0.4, 0.6), 'Neither inside, nor outside'); },
      dusk: (t, u) => { atDoor('dawn'); nsLap(t, true); hkAcross(t); C([AX + 0.4, 1.0, DZ + 9.5], [AX + 0.3, 1.2, DZ + 8.0], [AX, 3.0, DZ], [AX, 2.6, DZ], u, 40);
        A.HUD = x => tag(x, 'SANDHYAA SAMAYAM', K.pulse(u, 0.1, 0.8), 'Neither day, nor night'); },
      lap: (t, u) => { atDoor('dawn'); nsLap(t, true); hkAcross(t); C([AX + 2.4, 1.6, DZ + 3.6], [AX + 2.0, 1.5, DZ + 3.0], [AX + 0.3, 1.3, DZ + 0.4], [AX + 0.3, 1.3, DZ + 0.4], u, 36);
        A.HUD = x => tag(x, 'ODILO', K.pulse(u, 0.2, 0.7), 'Neither earth, nor sky'); },
      nails: (t, u) => { atDoor('dawn'); nsLap(t, true); hkAcross(t); NS.root.updateMatrixWorld(true); const hp = NS.B.PalmR.getWorldPosition(V3(0, 0, 0));
        C([hp.x + 0.9, hp.y + 0.3, hp.z + 1.2], [hp.x + 0.7, hp.y + 0.25, hp.z + 0.9], hp.toArray(), hp.toArray(), u, 32);
        A.HUD = x => { tag(x, 'GOLLU', K.pulse(u, 0.05, 0.5), 'Not a weapon'); const f = clamp((u - 0.55) * 3); if (f > 0) { x.fillStyle = `rgba(255,252,240,${Math.min(1, f) * (1 - clamp((u - 0.85) * 6))})`; x.fillRect(0, 0, 1080, 1920); } }; },
      calm: (t, u) => { atDoor('dawn'); nsLap(t, false); NS.head.update(t, { brow: -0.6 }); const w = clamp(u * 1.5);
        place(PR, AX + lerp(2.4, 0.3, w), 0, DZ + lerp(3.6, 1.3, w), 0); face(PR, AX, DZ); pose(PR, w < 1 ? 'Man_Walk' : 'Man_Sitting', w < 1 ? t : 0.6, w < 1 ? {} : P_.namaste); PR.head.update(t, {});
        DEV.forEach((M, i) => { place(M, AX + (i ? 3.4 : -3.4), 0, DZ + 4.2, PI); face(M, AX, DZ); pose(M, 'Man_Idle', t + i, mix_(P_.namaste, P_.bowHead)); M.head.update(t, { close: 0.5 }); });
        C([AX + 0.6, 2.0, DZ + 8.0], [AX + 0.5, 1.8, DZ + 6.8], [AX, 1.2, DZ + 1.0], [AX, 1.2, DZ + 1.0], u, 40); },
      soft: (t, u) => { atDoor('dawn'); petals.visible = true; nsLap(t, false); pose(NS, 'Man_Sitting', 0.6, P_.bless); NS.head.update(t, { close: 0.3 + u * 0.3 }); place(PR, AX + 0.15, 0, DZ + 1.3, PI); pose(PR, 'Man_Sitting', 0.6, P_.namaste); PR.head.update(t, { close: 0.8 }); prHalo();
        fly(petals, t, { c: V3(AX, 0, DZ + 1), sx: 4, sz: 3, sy: 4, vy: -0.4 });
        C([AX + 1.6, 1.6, DZ + 4.4], [AX + 1.2, 1.6, DZ + 3.8], [AX, 1.4, DZ + 0.6], [AX, 1.45, DZ + 0.6], u, 34);
        A.HUD = x => tag(x, 'KARUNA', K.pulse(u, 0.3, 0.7), 'Anger melts into kindness'); },
      end: (t, u) => { atDoor('dawn'); lamps.visible = true; petals.visible = true; nsLap(t, false); pose(NS, 'Man_Sitting', 0.6, P_.bless); NS.head.update(t, { close: 0.5 }); place(PR, AX + 0.15, 0, DZ + 1.3, PI); pose(PR, 'Man_Sitting', 0.6, P_.namaste); PR.head.update(t, { close: 0.8 }); prHalo();
        fly(petals, t, { c: V3(AX, 0, DZ + 1), sx: 5, sz: 4, sy: 4, vy: -0.4 });
        C([AX + 0.2, 1.2, DZ + 7.4], [AX + 0.2, 1.4, DZ + 6.6], [AX, 1.8, DZ], [AX, 1.9, DZ], u, 38);
        A.HUD = x => tag(x, 'NIJAMAINA BHAKTHI', K.pulse(u, 0.1, 0.8), 'He comes even out of a pillar'); },
      cta: (t, u) => { atDoor('dawn'); lamps.visible = true; nsLap(t, false); pose(NS, 'Man_Sitting', 0.6, P_.bless); NS.head.update(t, { close: 0.5 }); place(PR, AX + 0.15, 0, DZ + 1.3, PI); pose(PR, 'Man_Sitting', 0.6, P_.namaste); PR.head.update(t, { close: 0.8 }); prHalo();
        C([AX + 0.4, 3.4, DZ + 6.4], [AX + 0.3, 3.2, DZ + 6.0], [AX, 1.2, DZ + 0.5], [AX, 1.25, DZ + 0.5], u, 34);
        A.HUD = x => endCard(x, t, u, { series: 'NARASIMHUDU', part: 'PART 3 / 3', title: 'Narasimha', te: 'నరసింహుడు', next: null, ctaAt: Bt('cta') + 0.5 }); },
    };
    const SFX = [['bass', 0.05, 0.6], ['bass', F('roar', 0.3), 0.9], ['chime', F('every', 0.4), 0.5], ['bass', F('pillar', 0.6), 0.5], ['chime', F('yes', 0.3), 0.6], ['whoosh', F('strike', 0.3), 0.6], ['thud', F('strike', 0.45), 1.0],
      ['thud', Bt('burst') + 0.1, 1.0], ['bass', Bt('burst') + 0.12, 1.0], ['riser', Bt('door'), 0.4], ['chime', F('dusk', 0.3), 0.4], ['bass', F('nails', 0.55), 0.9], ['chime', F('soft', 0.3), 0.6], ['chime', Bt('end') + 0.3, 0.5], ['pop', Bt('cta') + 0.6, 0.5], ['ding', Bt('cta') + 1.6, 0.5]];
    return finish({ SH, SRC, SFX });
  },
};
