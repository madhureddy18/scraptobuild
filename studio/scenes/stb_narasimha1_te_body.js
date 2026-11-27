// Narasimha Part 1/3 — Hiranyakashipu's boon. STORYBOOK 3D look (redo 27 Nov 2026), built on studio/scenes/stb_storybook_kit.js.
// Same Telugu voice lines (Maddy's cloned voice). Sets: obsidian-and-emerald asura palace with gold throne, Varaha lifting the earth
// out of a navy cosmic ocean, scorched bone-white Mandara mountain with the anthill tapas and heat shimmer, Brahma on a cloud,
// the three boons as serif cards, Indra's throne taken. Ending: tiny Prahlada with a diya under the asura king's giant shadow.
window.SCENE = {
  assets: ['assets/chars/worker.glb'],
  setup: { bg: 0x9fb6cf, fog: null, fov: 35, bloom: null },
  lines: window.STB_LINES,
  build(K, T) {
    const A = window.STORYBOOK(K, T);
    const { THREE, S, PI, TAU, clamp, lerp, ease, eo, prog, L, Bt, Et, F, D, V3, rng, mat, GOLD, hero, heroes, makeHead, pose, place, setSky, key, hemi, groupOf, shadowAll,
      flames, diya, fly, dust, sparks, petals, stars, burst, label, tag, cam, C, narr, reg, outdoor, finish, makePalace, makeHeaven, endCard, titleCard, P_, mix_, frontOf, waterTex, makeWater, glowTexH } = A;

    // ---------------------------------------------------------------- cast
    const HK = hero({ skin: 0x7a4a32, dhoti: 0x1a1a22, sash: 0xc8a02a, utt: 0x2a6a4a, hair: 0x0a0806, crown: 'gold', stache: 'curl', beard: 'short', scale: 1.14, seed: 1.4 });
    const HA = hero({ skin: 0x5a3a2a, dhoti: 0x3a1a1a, sash: 0xc8a02a, hair: 0x0a0806, crown: 'helmet', stache: 'thick', beard: 'short', scale: 1.1, seed: 2.2 });
    const VR = hero({ skin: 0x6a7a8a, dhoti: 0xf0c030, sash: 0xd04a1a, crown: 'gold', boar: true, scale: 1.2, seed: 3.3 });
    const bo = { skin: 0xd8a060, dhoti: 0xe05a2a, sash: 0xf0c030, utt: 0xf0c030, hair: 0xeeeae4, beard: 'long', beardCol: 0xeeeae4, browCol: 0xf4f0ea, stache: 'thick', crown: 'gold', lip: 0x9a5a4a, seed: 1.1 };
    const BR = hero(bo); for (const sx of [-1, 1]) { const h2 = makeHead(Object.assign({}, bo)); h2.position.set(sx * 0.6, 0.0, -0.3); h2.rotation.y = sx * 1.25; h2.scale.setScalar(0.9); BR.head.add(h2); }
    const IN = hero({ skin: 0xe0b090, dhoti: 0xf8f4ea, sash: 0x2a7ac0, crown: 'gold', stache: 'thin', tilak: true, seed: 4.4 });
    const DEV = [0, 1].map(i => hero({ skin: [0xe0b090, 0xd8a47a][i], dhoti: 0xf8f4ea, sash: [0xc0302a, 0xd89a2a][i], crown: 'gold', tilak: true, seed: 8 + i }));
    const PR = hero({ skin: 0xd0a07a, dhoti: 0xf2c030, sash: 0x2a6ac0, utt: 0xf2c030, crown: 'bun', hairStyle: 'short', tilak: true, jewel: false, scale: 0.6, headScale: 0.42, seed: 5.5 });
    const face = (M, x, z) => { M.root.rotation.y = Math.atan2(x - M.root.position.x, z - M.root.position.z); };

    // ---------------------------------------------------------------- sets
    const AX = -100; const asura = makePalace({ x0: AX, z0: 0, wall: '#16231e', arch: '#2a9a6a', curtain: '#0a3a2a', pillar: 0x1e1e24, floorA: '#1a2a22', floorB: '#2a3a2a' });
    const cosmos = groupOf(); const earth = new THREE.Mesh(new THREE.SphereGeometry(1.2, 40, 28), mat(0xffffff, { map: K.canvasTex(512, 256, (x, w, h) => { x.fillStyle = '#2a6ab0'; x.fillRect(0, 0, w, h); const r = rng(5); x.fillStyle = '#4a9a3a'; for (let i = 0; i < 40; i++) { x.beginPath(); x.ellipse(r() * w, 30 + r() * (h - 60), 10 + r() * 40, 6 + r() * 20, r(), 0, TAU); x.fill(); } }) }));
    cosmos.add(earth); cosmos.add(makeWater(0, 0, 200, 200)); cosmos.position.set(600, 0, 0); earth.position.set(0, 0, 0);
    const MX = 300; const mandara = groupOf(); { const rock = mat(0xe8dcc0, { roughness: 1 }); const mt = new THREE.Mesh(new THREE.ConeGeometry(30, 22, 14), rock); mt.position.set(0, 11 - 14, -30); mandara.add(mt);
      const plat = new THREE.Mesh(new THREE.CylinderGeometry(4, 5, 1, 12), rock); plat.position.set(0, -0.5, 0); mandara.add(plat);
      const gnd = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), mat(0xd8c49a, { roughness: 1 })); gnd.rotation.x = -PI / 2; gnd.position.y = -0.98; mandara.add(gnd);
      for (let i = 0; i < 14; i++) { const r = rng(i + 7); const b = new THREE.Mesh(new THREE.DodecahedronGeometry(0.4 + r() * 1.2), rock); b.position.set((r() - 0.5) * 30, -0.6, -6 - r() * 20); mandara.add(b); } shadowAll(mandara); }
    mandara.position.set(MX, 0, 0);
    const anthill = new THREE.Mesh(new THREE.ConeGeometry(0.55, 1.4, 20, 4), mat(0xb08a5a, { roughness: 1 })); S.add(anthill);
    const heaven = makeHeaven(0, 40, 200);
    const prLamp = groupOf(); diya(prLamp, 0, 0, 0, 1.6, true);
    const shadowWall = new THREE.Mesh(new THREE.PlaneGeometry(10, 8), new THREE.MeshBasicMaterial({ map: K.canvasTex(512, 410, (x, w, h) => { const g = x.createRadialGradient(w / 2, h * 0.7, 10, w / 2, h * 0.6, w * 0.7); g.addColorStop(0, '#3af0a0'); g.addColorStop(1, '#0a3a2a'); x.fillStyle = g; x.fillRect(0, 0, w, h);
      x.fillStyle = 'rgba(0,10,6,0.92)'; x.beginPath(); x.ellipse(w / 2, h * 0.3, 70, 80, 0, 0, TAU); x.fill(); x.fillRect(w / 2 - 130, h * 0.42, 260, h); x.beginPath(); x.moveTo(w / 2 - 60, h * 0.2); x.lineTo(w / 2, -20); x.lineTo(w / 2 + 60, h * 0.2); x.fill(); }) }));
    shadowWall.position.set(AX, 4, 2.5); S.add(shadowWall);
    reg(asura, cosmos, mandara, anthill, heaven, prLamp, shadowWall);

    // ---------------------------------------------------------------- shots
    const SRC = { hook: 'BHAAGAVATHA PURAANAM', who: 'BHAAGAVATHA PURAANAM', vow: 'BHAAGAVATHA PURAANAM', tapas: 'BHAAGAVATHA PURAANAM', anthill: 'BHAAGAVATHA PURAANAM', heat: 'BHAAGAVATHA PURAANAM', brahma: 'BHAAGAVATHA PURAANAM', ask: 'BHAAGAVATHA PURAANAM', b1: 'BHAAGAVATHA PURAANAM', b2: 'BHAAGAVATHA PURAANAM', b3: 'BHAAGAVATHA PURAANAM', granted: 'BHAAGAVATHA PURAANAM', throne: 'BHAAGAVATHA PURAANAM', twist: 'BHAAGAVATHA PURAANAM' };
    const seat = V3(AX, 1.1, -11.35);
    const inPalace = (sky = 'night') => { setSky(sky, V3(AX, 0, -8)); outdoor(false); asura.visible = true; hemi.intensity = 0.9; hemi.color.set(0xa0ffd0); key.intensity = 1.0; key.color.set(0xffd890); };
    const onMandara = (sky = 'gold') => { setSky(sky, V3(MX, 0, 0)); outdoor(false); mandara.visible = true; };
    const tapasPose = (t) => { place(HK, MX, 0, 0, 0); pose(HK, 'Man_Idle', t, { UpperArmR: [0, 2.55, 0.25], UpperArmL: [0, -2.55, 0.25], LowerArmR: [0, 0, -0.3], LowerArmL: [0, 0, -0.3], UpperLegL: [-1.2, 0, 0], LowerLegL: [1.8, 0, 0] }); HK.head.update(t, { close: 1 }); };
    const card = (x, a, lines) => { if (a <= 0) return; x.save(); x.globalAlpha = a; lines.forEach((ln, i) => { const y = 520 + i * 150; x.fillStyle = 'rgba(14,20,16,0.82)'; K.rrect(x, 150, y - 55, 780, 110, 14); x.fill(); x.strokeStyle = '#e8c46a'; x.lineWidth = 2; K.rrect(x, 150, y - 55, 780, 110, 14); x.stroke();
        label(x, ln, 540, y, 50, '#fff2d0', 1, 'EB Garamond', '500'); x.strokeStyle = 'rgba(220,60,40,0.9)'; x.lineWidth = 6; x.beginPath(); x.moveTo(840, y - 22); x.lineTo(884, y + 22); x.moveTo(884, y - 22); x.lineTo(840, y + 22); x.stroke(); }); x.restore(); };
    const boonShot = (t, u, lines) => { onMandara('blue'); place(HK, MX, 0, 0, 0); pose(HK, 'Man_Idle', t, P_.namaste); HK.head.update(t, { talk: narr(t) });
      place(BR, MX + 0.2, 0, -3.2, 0); BR.root.position.y = 0.3; face(BR, MX, 0); pose(BR, 'Man_Idle', t, P_.bless); BR.head.update(t, {});
      C([MX + 2.4, 1.6, 3.2], [MX + 2.0, 1.7, 2.8], [MX + 0.1, 1.6, -1.4], [MX + 0.1, 1.7, -1.4], u, 36); A.HUD = x => card(x, eo(clamp(u * 3)), lines); };
    const SH = {
      hook: (t, u) => { inPalace(); place(HK, seat.x, seat.y - 1.0, seat.z + 0.1, 0); pose(HK, 'Man_Sitting', 0.6, { UpperArmR: [0, 0.4, 0.6] }); HK.head.update(t, { brow: -1 });
        C([AX + 0.3, 0.8, -6.0], [AX + 0.2, 1.0, -7.4], [AX, 1.6, -11.3], [AX, 1.7, -11.3], u, 34);
        A.HUD = x => titleCard(x, u, 'Narasimha', 'NARASIMHUDU  ·  PART 1 / 3'); },
      who: (t, u) => { setSky('night', V3(600, 0, 0)); outdoor(false); cosmos.visible = true; const k = eo(u);
        place(VR, 600, -2.2 + k * 2.2, 0.4, 0); pose(VR, 'Man_Idle', t, { UpperArmR: [0, 2.0, 0.6], UpperArmL: [0, -2.0, 0.6], LowerArmR: [0, 0, 0.8], LowerArmL: [0, 0, 0.8] }); VR.head.update(t, {});
        VR.root.updateMatrixWorld(true); earth.position.copy(VR.head.getWorldPosition(V3(0, 0, 0))).sub(cosmos.position).add(V3(0, 1.4, 0.1)); earth.rotation.y = t * 0.3;
        place(HA, 603.5, -1.2, -2, -0.8); HA.root.rotation.set(-0.9, -0.8, 0.3, 'YXZ'); pose(HA, 'Man_Idle', 0.3); HA.head.update(t, { close: 1 });
        C([603.6, 1.4, 7.4], [603.0, 1.8, 6.6], [600.5, 1.6, 0], [600.5, 1.9, 0], u, 38);
        A.HUD = x => tag(x, 'VARAAHA AVATHAARAM', K.pulse(u, 0.05, 0.9), 'Hiranyaksha is slain'); },
      vow: (t, u) => { onMandara('blue'); place(HK, MX, 0, 2.2, PI); pose(HK, 'Man_Idle', t, { UpperArmR: [0, 1.0, 0.7], LowerArmR: [0, 0, 1.6], Neck: [-0.2, 0, 0] }); HK.head.update(t, { talk: narr(t), brow: -1 });
        const fo = frontOf(HK, 1.6, -0.35, 0.3), fo2 = frontOf(HK, 1.2, -0.4, 0.2); C(fo.p.toArray(), fo2.p.toArray(), fo.h.toArray(), fo2.h.toArray(), u, 34);
        A.HUD = x => tag(x, 'PRATHEEKAARAM', K.pulse(u, 0.4, 0.6), 'Revenge'); },
      tapas: (t, u) => { onMandara('gold'); tapasPose(t); const a = u * 0.8; C([MX + Math.sin(a) * 6, 1.8, Math.cos(a) * 6], [MX + Math.sin(a + 0.2) * 5, 2.0, Math.cos(a + 0.2) * 5], [MX, 1.8, 0], [MX, 1.9, 0], u, 36, x => x);
        A.HUD = x => tag(x, 'MANDARA PARVATHAM', K.pulse(u, 0.05, 0.85), 'On one foot, for years'); },
      anthill: (t, u) => { onMandara('gold'); tapasPose(t); anthill.visible = true; const g = eo(clamp(u * 1.3)); anthill.position.set(MX, 0.7 * g, 0); anthill.scale.set(1 + g * 0.6, g * 1.2 + 0.01, 1 + g * 0.6);
        C([MX + 2.2, 1.0, 3.0], [MX + 1.8, 1.1, 2.6], [MX, 1.0, 0], [MX, 1.1, 0], u, 34); },
      heat: (t, u) => { onMandara('blue'); tapasPose(t); anthill.visible = true; anthill.position.set(MX, 0.7, 0); anthill.scale.set(1.6, 1.2, 1.6); burst.visible = true; key.color.set(0xff5a20); key.intensity = 2.0; hemi.color.set(0xff9a60);
        fly(burst, t, { c: V3(MX, 0, 0), sx: 8, sz: 8, sy: 6, vy: 1.2 });
        C([MX + 3.4, 0.6, 7.0], [MX + 2.6, 0.8, 6.0], [MX, 2.2, 0], [MX, 2.4, 0], u, 38);
        A.HUD = x => { const k = 0.18 + 0.06 * Math.sin(t * 9); x.fillStyle = `rgba(255,90,30,${k})`; x.fillRect(0, 0, 1080, 1920); tag(x, 'THAPASSU VEDI', K.pulse(u, 0.05, 0.85), 'The worlds begin to burn'); }; },
      brahma: (t, u) => { onMandara('gold'); sparks.visible = true; const k = eo(clamp(u * 1.5)); place(HK, MX, 0, 0, 0); pose(HK, 'Man_Idle', t, { Neck: [-0.2, 0, 0] }); HK.head.update(t, { close: 1 - k * 0.9 });
        HK.root.traverse(q => { if (q.isMesh && q.material && q.material.emissive) { } }); place(BR, MX + 0.2, 0.3, -3.2, 0); face(BR, MX, 0); pose(BR, 'Man_Idle', t, P_.bless); BR.head.update(t, {});
        fly(sparks, t, { c: V3(MX, 0, 0), sx: 1.6, sz: 1.6, sy: 2.6, vy: -0.4 });
        C([MX + 2.6, 1.8, 3.4], [MX + 2.2, 1.8, 3.0], [MX + 0.1, 1.7, -1.4], [MX + 0.1, 1.8, -1.4], u, 36);
        A.HUD = x => { tag(x, 'BRAHMA DEVUDU', K.pulse(u, 0.05, 0.85), 'Golden again'); const g = K.pulse(u, 0.3, 0.6) * 0.25; if (g > 0) { x.fillStyle = `rgba(255,215,120,${g})`; x.fillRect(0, 0, 1080, 1920); } }; },
      ask: (t, u) => { onMandara('blue'); place(HK, MX, 0, 0, 0); pose(HK, 'Man_Idle', t, P_.namaste); HK.head.update(t, { talk: narr(t), look: [0.3, 0.1] });
        const fo = frontOf(HK, 1.3, -0.2, -0.35), fo2 = frontOf(HK, 1.0, -0.2, -0.25); C(fo.p.toArray(), fo2.p.toArray(), fo.h.toArray(), fo2.h.toArray(), u, 32);
        A.HUD = x => tag(x, 'THELIVIGAA', K.pulse(u, 0.05, 0.85), 'A clever wish'); },
      b1: (t, u) => boonShot(t, u, ['Manishi valla kaadu', 'Janthuvu valla kaadu']),
      b2: (t, u) => boonShot(t, u, ['Intlo kaadu · Bayata kaadu', 'Pagalu kaadu · Raathri kaadu']),
      b3: (t, u) => boonShot(t, u, ['Bhoomi meeda kaadu', 'Aakaasamlo kaadu', 'Ye aayudhamtho kaadu']),
      granted: (t, u) => { onMandara('gold'); sparks.visible = true; place(HK, MX, 0, 0, 0); pose(HK, 'Man_Idle', t, mix_(P_.namaste, P_.bowHead)); HK.head.update(t, { close: 0.4 });
        place(BR, MX + 0.2, 0.3, -3.2, 0); face(BR, MX, 0); pose(BR, 'Man_Idle', t, { UpperArmR: [0, 2.3, 0.4] }); BR.head.update(t, { talk: narr(t) * 0.6 });
        fly(sparks, t, { c: V3(MX, 0, -1.5), sx: 5, sz: 4, sy: 4, vy: 0.5 });
        C([MX - 2.6, 0.6, 3.2], [MX - 2.2, 0.7, 2.8], [MX, 2.2, -2.2], [MX, 2.4, -2.2], u, 38);
        A.HUD = x => tag(x, 'THATHAASTHU', K.pulse(u, 0.05, 0.6), 'So be it'); },
      throne: (t, u) => { inPalace('night'); place(HK, seat.x, seat.y - 1.0, seat.z + 0.1, 0); pose(HK, 'Man_Sitting', 0.6, { UpperArmR: [0, 1.2, 0.5], Neck: [-0.15, 0, 0] }); HK.head.update(t, { talk: narr(t), brow: -0.8 });
        [IN, ...DEV].forEach((M, i) => { place(M, AX + (i - 1) * 1.2, 0, -7.4 - (i === 0 ? 0.4 : 0), PI); pose(M, 'Man_Idle', t + i, mix_(P_.namaste, P_.bowHead)); M.head.update(t, { close: 0.6 }); });
        C([AX + 1.6, 1.3, -3.4], [AX + 1.2, 1.4, -4.4], [AX, 1.6, -10.6], [AX, 1.7, -10.8], u, 34);
        A.HUD = x => tag(x, 'NENE DEVUDINI', K.pulse(u, 0.2, 0.75), 'I am God'); },
      twist: (t, u) => { inPalace('night'); prLamp.visible = true; prLamp.position.set(AX + 0.5, 0.03, -5.6); place(PR, AX, 0, -6.2, 0); pose(PR, 'Man_Sitting', 0.6, P_.namaste); PR.root.position.y = -0.02; PR.head.update(t, { close: 0.85, talk: narr(t) * 0.3 });
        C([AX + 1.0, 0.9, -3.6], [AX + 0.7, 0.8, -4.2], [AX, 0.55, -6.2], [AX, 0.55, -6.2], u, 34);
        A.HUD = x => tag(x, 'PRAHLAADUDU', K.pulse(u, 0.3, 0.7), '"Om Namo Naaraayanaaya"'); },
      cta: (t, u) => { inPalace('night'); prLamp.visible = true; prLamp.position.set(AX + 0.5, 0.03, -5.6); place(PR, AX, 0, -6.2, 0); pose(PR, 'Man_Sitting', 0.6, P_.namaste); PR.root.position.y = -0.02; PR.head.update(t, { close: 0.85 });
        C([AX + 0.6, 1.3, -3.2], [AX + 0.5, 1.2, -3.6], [AX, 0.55, -6.2], [AX, 0.55, -6.2], u, 34);
        A.HUD = x => endCard(x, t, u, { series: 'NARASIMHUDU', part: 'PART 1 / 3', title: 'The Boon', te: 'హిరణ్యకశిపుడి వరం', next: 'Part 2 — Prahlaadudu', ctaAt: Bt('cta') + 0.5 }); },
    };
    const SFX = [['bass', 0.05, 0.6], ['thud', F('who', 0.5), 0.6], ['bass', F('vow', 0.4), 0.7], ['riser', Bt('tapas'), 0.3], ['buzz', F('anthill', 0.4), 0.2], ['riser', Bt('heat'), 0.5], ['chime', F('brahma', 0.3), 0.6],
      ['pop', Bt('b1') + 0.3, 0.4], ['pop', Bt('b2') + 0.3, 0.4], ['pop', Bt('b3') + 0.3, 0.4], ['chime', Bt('granted') + 0.4, 0.6], ['bass', F('throne', 0.3), 0.8], ['chime', F('twist', 0.4), 0.5], ['pop', Bt('cta') + 0.6, 0.5], ['ding', Bt('cta') + 1.6, 0.5]];
    return finish({ SH, SRC, SFX, onFrame: t => { waterTex.offset.set(t * 0.01, t * 0.02); } });
  },
};
