// bhishma3d — 3D CINEMATIC DEMO (27 Nov 2026, Maddy: "change the video like my sample — 3D characters, film camera").
// Same Telugu voice lines as stb_bhishma3_te. Real 3D: smooth jointed characters on the rigged CC0 body (worker.glb),
// PBR gold with an environment map, golden-hour haze, shadows, depth-of-field-like haze, cuts + dissolves.
// LOOK: golden-hour ochre dust + powder-blue sky (Kurukshetra), indigo star night (time-lapse), torch-lit night (teaching),
// pale rose dawn (Uttarayana), blue-hour diyas (Bhishma Ashtami). Ending: big golden chariot wheel title card.
window.SCENE = {
  assets: ['assets/chars/worker.glb'],
  setup: { bg: 0x9fb6cf, fog: null, fov: 35, bloom: null },
  lines: window.STB_LINES,
  build(K, T) {
    const THREE = window.THREE, S = K.scene, R = K.renderer, PI = Math.PI, TAU = PI * 2;
    const clamp = K.clamp, lerp = K.lerp, ease = K.ease, eo = K.easeOut, prog = K.prog;
    const L = T.lines, LINES = window.STB_LINES, N = LINES.length, IDX = {}; LINES.forEach((l, i) => { IDX[l.id] = i; });
    const Bt = n => L[IDX[n]].t, Et = n => L[IDX[n]].end, F = (n, f) => Bt(n) + (Et(n) - Bt(n)) * f;
    const D = Et('cta') + 1.6, XF = 0.35;
    const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
    const rng = s => () => (s = (s * 16807) % 2147483647) / 2147483647;
    R.shadowMap.enabled = true; R.shadowMap.type = THREE.PCFSoftShadowMap; R.toneMapping = THREE.ACESFilmicToneMapping; R.toneMappingExposure = 1.0;

    // ================================================================ materials + environment (for real gold)
    const mat = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.6, metalness: 0 }, o));
    const envTex = K.canvasTex(256, 512, (x, w, h) => { const g = x.createLinearGradient(0, 0, 0, h); [[0, '#7fa6d6'], [0.45, '#f4e2c0'], [0.52, '#c9a272'], [1, '#5a4026']].forEach(([o, c]) => g.addColorStop(o, c)); x.fillStyle = g; x.fillRect(0, 0, w, h); });
    envTex.mapping = THREE.EquirectangularReflectionMapping;
    const pmrem = new THREE.PMREMGenerator(R); S.environment = pmrem.fromEquirectangular(envTex).texture;
    const allMats = new Set(); const envI = v => { if (!allMats.size) S.traverse(q => { if (q.isMesh) [].concat(q.material).forEach(m => m.isMeshStandardMaterial && allMats.add(m)); }); allMats.forEach(m => { m.envMapIntensity = v; }); };
    let curExp = 1.0;
    const GOLD = mat(0xd8a640, { metalness: 0.9, roughness: 0.3 }), GOLD2 = mat(0xb07a28, { metalness: 0.85, roughness: 0.4 });
    const RUBY = mat(0xb01020, { roughness: 0.2, metalness: 0.1 }), PEARL = mat(0xf4efe4, { roughness: 0.25 });
    const SILVER = (() => { const t = K.canvasTex(256, 256, (x, w, h) => { x.fillStyle = '#d8dce0'; x.fillRect(0, 0, w, h);
      for (let r = 0; r < 18; r++) for (let c = 0; c < 18; c++) { const cx = c * 16 + (r % 2) * 8, cy = r * 15; const g = x.createRadialGradient(cx, cy - 4, 1, cx, cy, 11); g.addColorStop(0, '#ffffff'); g.addColorStop(0.7, '#c4cad0'); g.addColorStop(1, '#7e8690');
        x.fillStyle = g; x.beginPath(); x.arc(cx, cy, 9, 0, PI); x.fill(); } }); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(2, 2);
      return mat(0xffffff, { map: t, metalness: 0.55, roughness: 0.38 }); })();
    const cloth = (c, r = 0.85) => mat(c, { roughness: r, side: THREE.DoubleSide });

    // ================================================================ characters (smooth bodies on the rigged CC0 skeleton)
    const BODY = 'assets/chars/worker.glb';
    const sm = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
    const headShape = (rr, seg = 64) => { const hg = new THREE.SphereGeometry(rr, seg, Math.round(seg * 0.75)), hp = hg.attributes.position, v = V3(0, 0, 0);
      for (let i = 0; i < hp.count; i++) { v.fromBufferAttribute(hp, i); const y = v.y / rr;
        if (y < 0.1) { const k = (0.1 - y) / 1.1; v.x *= 1 - k * k * 0.32; v.z *= 1 - k * k * 0.08; v.y *= 1 + k * 0.1; v.z += k * k * 0.05 * rr / 0.42; }
        if (y > 0.05 && v.z > 0) v.z *= 1 - 0.06 * sm(0.05, 0.6, y);            // forehead slopes back a touch
        hp.setXYZ(i, v.x, v.y, v.z); }
      hg.computeVertexNormals(); return hg; };

    function makeHead(o) {
      const g = new THREE.Group(), skinM = mat(o.skin, { roughness: 0.5 });
      const add = (geo, m, x, y, z) => { const q = new THREE.Mesh(geo, m); q.position.set(x, y, z); q.castShadow = true; g.add(q); return q; };
      // skull, beard painted on as soft vertex colour
      const sg = headShape(0.42), sp = sg.attributes.position, cols = [], cS = new THREE.Color(o.skin), cB = new THREE.Color(o.beardCol || o.hair), tmp = new THREE.Color();
      for (let i = 0; i < sp.count; i++) { const y = sp.getY(i) / 0.42, z = sp.getZ(i) / 0.42; let m = 0;
        if (o.beard === 'short' || o.beard === 'long') { const yt = -0.16 + (1 - Math.max(0, z)) * 0.2; m = sm(yt + 0.06, yt - 0.1, y) * sm(-0.3, -0.05, z) * 0.92; }
        if (o.stubble) { const yt = -0.2 + (1 - Math.max(0, z)) * 0.2; m = Math.max(m, sm(yt + 0.05, yt - 0.12, y) * sm(-0.3, -0.05, z) * 0.28); }
        tmp.copy(cS).lerp(cB, m); cols.push(tmp.r, tmp.g, tmp.b); }
      sg.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
      add(sg, mat(0xffffff, { roughness: 0.5, vertexColors: true }), 0, 0, 0).scale.set(0.84, 1.08, 0.94);
      for (const sx of [-1, 1]) { const e = add(new THREE.SphereGeometry(0.075, 24, 16), skinM, sx * 0.345, -0.01, -0.03); e.scale.set(0.42, 1.05, 0.72); }
      // nose: bridge + tip + wings
      const br = add(new THREE.CapsuleGeometry(0.028, 0.12, 6, 16), skinM, 0, -0.025, 0.368); br.rotation.x = 0.3;
      add(new THREE.SphereGeometry(0.04, 24, 16), skinM, 0, -0.094, 0.398).scale.set(1, 0.85, 0.9);
      for (const sx of [-1, 1]) add(new THREE.SphereGeometry(0.025, 16, 12), skinM, sx * 0.036, -0.104, 0.37);
      // cheekbones
      for (const sx of [-1, 1]) add(new THREE.SphereGeometry(0.09, 20, 14), skinM, sx * 0.19, -0.04, 0.266).scale.set(1, 0.62, 0.6);
      // eyes: sclera, iris with a glint, eyelid that blinks / closes
      const scl = mat(0xf2ece4, { roughness: 0.25 }), iris = mat(0x2a180e, { roughness: 0.15 }), lidM = mat(o.skin, { roughness: 0.5 });
      const eyes = [-1, 1].map(sx => { const e = new THREE.Group(); e.position.set(sx * 0.138, 0.06, 0.322); g.add(e);
        const s = new THREE.Mesh(new THREE.SphereGeometry(0.052, 24, 16), scl); s.scale.set(1.18, 0.74, 0.62); e.add(s);
        const ir = new THREE.Mesh(new THREE.SphereGeometry(0.027, 20, 14), iris); ir.position.set(0, -0.002, 0.026); ir.scale.set(1, 1, 0.45); e.add(ir);
        const gl = new THREE.Mesh(new THREE.SphereGeometry(0.006, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffffff })); gl.position.set(0.008, 0.008, 0.038); e.add(gl);
        const lid = new THREE.Mesh(new THREE.SphereGeometry(0.057, 24, 12, 0, TAU, 0, PI / 2), lidM); lid.scale.set(1.2, 0.8, 0.7); e.add(lid);
        const lash = new THREE.Mesh(new THREE.TorusGeometry(0.058, 0.005, 6, 24, PI), mat(0x1a1210)); lash.scale.set(1.2, 0.8, 0.7); e.add(lash);
        return { e, lid, lash, ir }; });
      const browM = mat(o.browCol || o.hair, { roughness: 0.9 });
      const brows = [-1, 1].map(sx => { const b = add(new THREE.CapsuleGeometry(o.browR || 0.019, 0.12, 6, 12), browM, sx * 0.14, 0.15, 0.352); b.rotation.set(0, sx * 0.3, PI / 2 + sx * 0.1); return b; });
      // mouth: lips + dark gap that opens with the voice
      const lipM = mat(o.lip || 0x8a4436, { roughness: 0.45 });
      const up = add(new THREE.CapsuleGeometry(0.014, 0.07, 6, 12), lipM, 0, -0.2, 0.37); up.rotation.z = PI / 2;
      const lo = add(new THREE.CapsuleGeometry(0.017, 0.06, 6, 12), lipM, 0, -0.232, 0.362); lo.rotation.z = PI / 2;
      const gap = add(new THREE.SphereGeometry(0.04, 16, 10), mat(0x2a0c08), 0, -0.216, 0.364); gap.scale.set(1.0, 0.08, 0.3);
      const hairM = mat(o.hair, { roughness: 0.55 });
      if (o.stache) for (const sx of [-1, 1]) { const m = add(new THREE.CapsuleGeometry(o.stache === 'thick' ? 0.024 : 0.012, 0.08, 6, 12), hairM, sx * 0.045, -0.168, 0.392); m.rotation.set(0.1, sx * 0.35, PI / 2 + sx * (o.stache === 'thick' ? 0.55 : 0.28)); }
      if (o.beard === 'long') {                                                     // flowing white beard
        const bg = new THREE.SphereGeometry(0.3, 40, 28), bp = bg.attributes.position, v = V3(0, 0, 0);
        for (let i = 0; i < bp.count; i++) { v.fromBufferAttribute(bp, i); if (v.y < 0) { const k = -v.y / 0.3; v.x *= 1 - k * 0.55; v.z *= 1 - k * 0.4; v.y *= 1 + k * 0.3; } v.x += Math.sin(v.y * 40) * 0.006; bp.setXYZ(i, v.x, v.y, v.z); }
        bg.computeVertexNormals(); const bd = add(bg, hairM, 0, -0.44, 0.17); bd.scale.set(0.82, 1.05, 0.52);
        for (const sx of [-1, 1]) { const ch = add(new THREE.SphereGeometry(0.13, 24, 16), hairM, sx * 0.19, -0.26, 0.15); ch.scale.set(0.8, 1.05, 0.8); }
      }
      // hair: cap with a hairline, long hair down the back, locks behind the ears
      if (o.hairStyle !== 'none') {
        const Rr = 0.448, cg = new THREE.SphereGeometry(Rr, 64, 40, 0, TAU, 0, PI * 0.7), cp = cg.attributes.position, v = V3(0, 0, 0);
        for (let i = 0; i < cp.count; i++) { v.fromBufferAttribute(cp, i); const upv = v.y / Rr, fz = v.z / Rr, front = Math.max(0, fz), back = Math.max(0, -fz);
          const hl = 0.22 + Math.pow(front, 1.4) * 0.42 - back * back * 0.6; if (upv < hl) v.y = hl * Rr;
          v.multiplyScalar(1.0 + Math.max(0, upv) * 0.04); cp.setXYZ(i, v.x * 0.86, v.y * 1.08, v.z * 0.96); }
        cg.computeVertexNormals(); add(cg, hairM, 0, 0.0, -0.005);
        if (o.hairStyle === 'long') {
          const bk = add(new THREE.SphereGeometry(0.4, 40, 28), hairM, 0, -0.42, -0.2); bk.scale.set(0.92, 1.45, 0.5);
          for (const sx of [-1, 1]) { const lk = add(new THREE.CapsuleGeometry(0.07, 0.5, 8, 16), hairM, sx * 0.3, -0.5, -0.1); lk.rotation.z = sx * 0.12; }
        }
      }
      // headgear
      if (o.crown === 'gold' || o.crown === 'krishna') {
        const band = add(new THREE.CylinderGeometry(0.405, 0.42, 0.13, 56, 1, true), GOLD, 0, 0.3, -0.01); band.scale.set(0.88, 1, 0.98); band.material.side = THREE.DoubleSide;
        for (const yy of [0.235, 0.365]) { const r = add(new THREE.TorusGeometry(0.41, 0.014, 10, 56), GOLD2, 0, yy, -0.01); r.rotation.x = PI / 2; r.scale.set(0.88, 0.98, 1); }
        add(new THREE.SphereGeometry(0.035, 16, 12), RUBY, 0, 0.3, 0.405).scale.z = 0.6;
        for (const sx of [-1, 1]) add(new THREE.SphereGeometry(0.022, 12, 8), PEARL, sx * 0.16, 0.3, 0.37);
        const crest = new THREE.Shape(); crest.moveTo(-0.15, 0); crest.quadraticCurveTo(-0.13, 0.16, 0, 0.27); crest.quadraticCurveTo(0.13, 0.16, 0.15, 0); crest.lineTo(-0.15, 0);
        const cr = add(new THREE.ExtrudeGeometry(crest, { depth: 0.02, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.01, bevelSegments: 2 }), GOLD, 0, 0.34, 0.36); cr.rotation.x = -0.25;
        add(new THREE.SphereGeometry(0.03, 12, 10), RUBY, 0, 0.47, 0.37).scale.z = 0.6;
        if (o.crown === 'gold') {
          const cone = add(new THREE.LatheGeometry([[0.4, 0], [0.36, 0.12], [0.27, 0.3], [0.17, 0.48], [0.08, 0.66], [0.035, 0.78], [0, 0.86]].map(([r, y]) => new THREE.Vector2(r, y)), 48), GOLD, 0, 0.36, -0.03); cone.scale.set(0.84, 1, 0.92);
          for (const [yy, rr] of [[0.5, 0.3], [0.68, 0.2], [0.86, 0.11]]) { const r = add(new THREE.TorusGeometry(rr, 0.013, 8, 40), GOLD2, 0, yy, -0.03); r.rotation.x = PI / 2; r.scale.set(0.84, 0.92, 1); }
          add(new THREE.SphereGeometry(0.04, 16, 12), GOLD, 0, 1.24, -0.03);
        } else {
          const dome = add(new THREE.SphereGeometry(0.36, 40, 20, 0, TAU, 0, PI / 2), GOLD, 0, 0.36, -0.02); dome.scale.set(0.86, 0.55, 0.92);
          const ft = K.canvasTex(128, 512, (x, w, h) => { x.strokeStyle = '#2f7a4a'; x.lineWidth = 6; x.beginPath(); x.moveTo(w / 2, h); x.lineTo(w / 2, 60); x.stroke();
            for (let i = 0; i < 60; i++) { const yy = 80 + i * 7; x.strokeStyle = i % 2 ? '#1f6f5a' : '#3a9a6a'; x.lineWidth = 2; x.beginPath(); x.moveTo(w / 2, yy); x.lineTo(w / 2 - 50 + (i % 3) * 4, yy - 30); x.moveTo(w / 2, yy); x.lineTo(w / 2 + 50 - (i % 3) * 4, yy - 30); x.stroke(); }
            const gr = x.createRadialGradient(w / 2, 100, 4, w / 2, 100, 46); gr.addColorStop(0, '#081a5a'); gr.addColorStop(0.35, '#1a6ad0'); gr.addColorStop(0.6, '#d8b838'); gr.addColorStop(0.85, '#2a8a5a'); gr.addColorStop(1, 'rgba(30,110,80,0)'); x.fillStyle = gr; x.beginPath(); x.ellipse(w / 2, 100, 46, 56, 0, 0, TAU); x.fill(); });
          const fm = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 1.1), new THREE.MeshStandardMaterial({ map: ft, transparent: true, alphaTest: 0.2, side: THREE.DoubleSide, roughness: 0.5 }));
          fm.position.set(0.12, 0.82, -0.12); fm.rotation.set(-0.15, 0.3, -0.28); g.add(fm);
        }
      } else if (o.crown === 'helmet') {
        const h = add(new THREE.SphereGeometry(0.46, 40, 24, 0, TAU, 0, PI * 0.55), o.helmMat || mat(0x8a5a2a, { metalness: 0.7, roughness: 0.4 }), 0, 0.06, -0.01); h.scale.set(0.9, 1.08, 0.98);
        add(new THREE.ConeGeometry(0.05, 0.25, 16), GOLD2, 0, 0.6, -0.01);
        const rim = add(new THREE.TorusGeometry(0.42, 0.02, 8, 48), GOLD2, 0, 0.12, -0.01); rim.rotation.x = PI / 2; rim.scale.set(0.9, 0.98, 1);
      } else if (o.crown === 'band') {
        const r = add(new THREE.TorusGeometry(0.4, 0.02, 10, 48), GOLD, 0, 0.27, 0); r.rotation.x = PI / 2 - 0.12; r.scale.set(0.88, 0.98, 1);
      } else if (o.crown === 'bun') {
        add(new THREE.SphereGeometry(0.17, 24, 16), hairM, 0, 0.5, -0.12);
      }
      g.userData = { eyes, brows, gap, lo };
      g.update = (t, { talk = 0, close = 0, look = [0, 0], brow = 0 } = {}) => {
        const blink = ((t + (o.seed || 0)) % 3.7) < 0.12 ? 1 : 0, cl = Math.max(close, blink * (1 - close));
        eyes.forEach(E => { E.lid.rotation.x = lerp(-0.88, 1.52, cl); E.lash.rotation.x = E.lid.rotation.x + PI / 2; E.lash.visible = cl < 0.98;
          E.ir.position.x = look[0] * 0.014; E.ir.position.y = -0.002 + look[1] * 0.01; });
        brows.forEach((b, i) => { b.position.y = 0.15 + brow * 0.015; b.rotation.z = PI / 2 + (i ? 1 : -1) * (0.1 - brow * 0.12); });
        const op = clamp(talk); gap.scale.y = 0.08 + op * 0.75; lo.position.y = -0.232 - op * 0.03;
      };
      g.update(0);
      return g;
    }

    const heroes = [];
    function hero(o) {
      o = Object.assign({ skin: 0xb07650, dhoti: 0xe2b23a, sash: 0xa82418, hair: 0x15100c, crown: 'gold', hairStyle: 'long', torso: 'bare', scale: 1, headScale: 0.38 }, o);
      const M = K.model(BODY, { height: 2.15 });
      M.play('Man_Idle', 0); M.g.updateMatrixWorld(true);
      M.g.traverse(x => { if (x.isSkinnedMesh) x.visible = false; });
      const B = {}; M.g.traverse(x => { if (x.isBone) B[x.name] = x; });
      const P = n => B[n].getWorldPosition(V3(0, 0, 0));
      const skinM = mat(o.skin, { roughness: 0.5 }), dhM = cloth(o.dhoti), sashM = cloth(o.sash, 0.7), dhD = cloth(new THREE.Color(o.dhoti).multiplyScalar(0.72).getHex());
      const pin = (obj, bone) => { K.add(obj); obj.traverse(q => { if (q.isMesh) { q.castShadow = true; q.receiveShadow = true; } }); K.pinToBone(B[bone], obj); return obj; };
      const hip = P('Hips'), abd = P('Abdomen'), tor = P('Torso'), neck = P('Neck'), cx = (P('ShoulderL').x + P('ShoulderR').x) / 2;
      const Ty = y => y - tor.y, legY = P('UpperLegL').y, shY = P('UpperArmL').y, yN = neck.y;
      const torsoM = o.torso === 'armor' ? SILVER : o.torso === 'tunic' ? cloth(o.tunic, 0.8) : skinM;
      // torso: one smooth shape, broad shoulders, narrow waist
      const chest = K.barrel([[Ty(legY - 0.04), 0.0], [Ty(legY - 0.035), 0.2], [Ty(legY + 0.05), 0.198], [Ty(abd.y + 0.05), 0.205], [0, 0.236], [Ty(shY - 0.1), 0.258], [Ty(shY - 0.02), 0.235], [Ty(yN) - 0.04, 0.15], [Ty(yN) - 0.005, 0.08], [Ty(yN), 0.0]], torsoM, 0.6, 72);
      chest.position.set(cx, tor.y, tor.z + 0.005); pin(chest, 'Torso');
      if (o.torso === 'bare') {                                                    // pecs + a soft line down the belly
        for (const sx of [-1, 1]) { const pc = new THREE.Mesh(new THREE.SphereGeometry(0.11, 32, 20), skinM); pc.scale.set(1.15, 0.5, 0.28); pc.rotation.z = sx * 0.15; pc.position.set(cx + sx * 0.1, shY - 0.15, tor.z + 0.118); pin(pc, 'Torso'); }
      }
      if (o.torso === 'armor') {                                                   // pauldrons + gold trim
        for (const sd of ['L', 'R']) { const pa = new THREE.Mesh(new THREE.SphereGeometry(0.12, 32, 16, 0, TAU, 0, PI * 0.55), SILVER); pa.scale.set(1, 0.75, 1.05); pa.position.copy(P('UpperArm' + sd)).add(V3(0, 0.03, 0)); pin(pa, 'Shoulder' + sd); }
        const trim = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.02, 10, 48), GOLD); trim.rotation.x = PI / 2; trim.scale.set(1, 0.62, 1); trim.position.set(cx, legY + 0.04, tor.z + 0.005); pin(trim, 'Abdomen');
        const col = new THREE.Mesh(new THREE.TorusGeometry(0.115, 0.022, 10, 40), GOLD); col.rotation.x = PI / 2 - 0.3; col.position.set(cx, yN - 0.03, tor.z + 0.01); pin(col, 'Torso');
      }
      // necklace + sacred-thread style sash across the chest
      if (o.torso !== 'tunic') {
        const nk = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.011, 8, 48, PI), o.jewel === false ? PEARL : GOLD); nk.rotation.set(PI + 0.55, 0, 0); nk.position.set(cx, yN - 0.06, tor.z + 0.07); nk.scale.set(1, 1.15, 1); pin(nk, 'Torso');
        const pd = new THREE.Mesh(new THREE.SphereGeometry(0.024, 16, 12), RUBY); pd.position.set(cx, yN - 0.19, tor.z + 0.15); pin(pd, 'Torso');
      }
      if (o.sashOn !== false) { const sg = new THREE.Group(), sa = new THREE.Mesh(new THREE.TorusGeometry(0.29, 0.024, 10, 64), sashM); sa.rotation.x = PI / 2; sa.scale.set(1.0, 0.66, 1); sg.add(sa); sg.rotation.z = 0.75; sg.position.set(cx, tor.y + 0.03, tor.z + 0.005); pin(sg, 'Torso'); }
      // neck
      const nkm = K.segment(V3(cx, yN - 0.07, neck.z), V3(cx, yN + 0.12, neck.z + 0.01), 0.058, 0.052, skinM); pin(nkm, 'Neck');
      // arms: deltoid, bare arms, armbands, bracelets, hands
      for (const sd of ['L', 'R']) {
        const sh = P('UpperArm' + sd), el = P('LowerArm' + sd), wr = P('Palm' + sd), fi = P('Fingers' + sd), sx = sd === 'L' ? 1 : -1;
        const armM = o.sleeves ? cloth(o.sleeves, 0.8) : skinM;
        const del = new THREE.Mesh(new THREE.SphereGeometry(0.07, 24, 16), armM); del.position.copy(sh).add(V3(sx * -0.01, -0.02, 0)); pin(del, 'UpperArm' + sd);
        pin(K.segment(sh.clone().add(V3(sx * 0.0, -0.02, 0)), el, 0.068, 0.05, armM), 'UpperArm' + sd);
        pin(K.segment(el, wr, 0.05, 0.036, skinM), 'LowerArm' + sd);
        const ab = new THREE.Mesh(new THREE.TorusGeometry(0.066, 0.012, 8, 32), GOLD); ab.position.copy(sh.clone().lerp(el, 0.3)); ab.quaternion.setFromUnitVectors(V3(0, 0, 1), el.clone().sub(sh).normalize()); pin(ab, 'UpperArm' + sd);
        for (const f of [0.86, 0.94]) { const br = new THREE.Mesh(new THREE.TorusGeometry(0.042, 0.009, 8, 28), GOLD); br.position.copy(el.clone().lerp(wr, f)); br.quaternion.setFromUnitVectors(V3(0, 0, 1), wr.clone().sub(el).normalize()); pin(br, 'LowerArm' + sd); }
        const hand = new THREE.Group(), hdir = fi.clone().sub(wr), hl = hdir.length();
        const palm = K.segment(wr, wr.clone().addScaledVector(hdir, 1.0), 0.04, 0.032, skinM); palm.scale.x = 1.2; hand.add(palm);
        const tb = wr.clone().addScaledVector(hdir, 0.25).add(V3(0, 0, 0.032));
        hand.add(K.segment(tb, tb.clone().addScaledVector(hdir.clone().normalize(), hl * 0.5).add(V3(0, 0, 0.02)), 0.017, 0.014, skinM));
        pin(hand, 'Palm' + sd);
        // legs: loose dhoti to mid-shin, bare shin, bare foot, anklet
        const th = P('UpperLeg' + sd), kn = P('LowerLeg' + sd), an = P('Foot' + sd);
        pin(K.segment(th.clone().add(V3(sx * 0.03, -0.02, -0.01)), kn, 0.13, 0.11, dhM), 'UpperLeg' + sd);
        const mid = kn.clone().lerp(an, 0.55);
        pin(K.segment(kn, mid, 0.105, 0.098, dhM), 'LowerLeg' + sd);
        const hem = new THREE.Mesh(new THREE.TorusGeometry(0.098, 0.014, 8, 32), sashM); hem.position.copy(mid); hem.rotation.x = PI / 2; pin(hem, 'LowerLeg' + sd);
        pin(K.segment(mid.clone().lerp(kn, 0.2), an.clone().add(V3(0, 0.04, 0)), 0.055, 0.045, skinM), 'LowerLeg' + sd);
        const foot = new THREE.Mesh(new THREE.SphereGeometry(0.085, 28, 18), skinM); foot.scale.set(0.72, 0.42, 1.65); foot.position.copy(an).add(V3(0, -0.04, 0.07)); pin(foot, 'Foot' + sd);
        const ank = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.01, 8, 28), GOLD); ank.rotation.x = PI / 2; ank.position.copy(an).add(V3(0, 0.03, 0)); pin(ank, 'LowerLeg' + sd);
      }
      // pelvis: dhoti wrap, waist cloth, front pleats
      const pel = K.barrel([[-0.2, 0.0], [-0.17, 0.17], [-0.06, 0.235], [0.06, 0.225], [0.11, 0.205], [0.13, 0.0]], dhM, 0.72, 64);
      pel.position.set(cx, hip.y, hip.z - 0.01); pin(pel, 'Hips');
      const wb = new THREE.Mesh(new THREE.TorusGeometry(0.212, 0.034, 12, 56), sashM); wb.rotation.x = PI / 2; wb.scale.set(1, 0.72, 1); wb.position.set(cx, hip.y + 0.1, hip.z - 0.01); pin(wb, 'Hips');
      const pl = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.42, 0.012), dhD); pl.position.set(cx, hip.y - 0.2, hip.z + 0.175); pl.rotation.x = 0.08; pl.visible = false; pin(pl, 'Hips');
      const knot = new THREE.Mesh(new THREE.SphereGeometry(0.04, 16, 12), sashM); knot.position.set(cx + 0.08, hip.y + 0.08, hip.z + 0.15); pin(knot, 'Hips');
      // head on the neck
      const head = makeHead(o);
      K.swapHead(M, head, { offset: [0, 0.2, 0.02], scale: o.headScale });
      M.head = head; M.B = B; M.o = o;
      // holder so we can place / lay down the whole figure
      const holder = new THREE.Group(); S.add(holder); holder.add(M.g); M.g.position.set(0, 0, 0); M.root = holder;
      holder.scale.setScalar(o.scale * 0.86);
      M.g.traverse(q => { if (q.isMesh) q.frustumCulled = false; });
      heroes.push(M);
      return M;
    }
    // pose: play a clip, then add bone rotation offsets {Bone: [x,y,z]}
    // (the mixer only rewrites bones whose clip value changed, so last frame's offsets are taken off first — no drift)
    const pose = (M, clip, ct, offs = {}, { loop = true } = {}) => {
      const old = M._off || {}; for (const n in old) { const b = M.B[n]; b.rotation.x -= old[n][0]; b.rotation.y -= old[n][1]; b.rotation.z -= old[n][2]; }
      M.play(clip, ct, { loop }); M._off = {};
      for (const n in offs) { const b = M.B[n]; if (b) { const o = [offs[n][0] || 0, offs[n][1] || 0, offs[n][2] || 0]; b.rotation.x += o[0]; b.rotation.y += o[1]; b.rotation.z += o[2]; M._off[n] = o; } }
    };
    const place = (M, x, y, z, ry = 0, rx = 0, rz = 0) => { M.root.visible = true; M.root.position.set(x, y, z); M.root.rotation.set(rx, ry, rz, 'YXZ'); };

    // the cast
    const BH = hero({ skin: 0xc08a66, dhoti: 0xf2efe6, sash: 0xc9a24a, hair: 0xeeeae4, beardCol: 0xeeeae4, browCol: 0xf4f0ea, browR: 0.024, crown: 'band', torso: 'armor', sashOn: false, beard: 'long', stache: 'thick', hairStyle: 'long', lip: 0x9a5a4a, seed: 0.7 });
    const AR = hero({ skin: 0xc28654, dhoti: 0xe8b02c, sash: 0xb3241a, crown: 'gold', stache: 'thin', stubble: true, seed: 1.9 });
    const KR = hero({ skin: 0x4d78c0, dhoti: 0xf0c030, sash: 0xd04a1a, crown: 'krishna', lip: 0x6a3a5a, seed: 2.6 });
    const YU = hero({ skin: 0xb07a52, dhoti: 0xf3ead6, sash: 0x7a1830, crown: 'gold', beard: 'short', stache: 'thin', seed: 0.3 });
    const SK = hero({ skin: 0xa87048, dhoti: 0x7a1c1c, sash: 0xd8a040, crown: 'helmet', torso: 'tunic', tunic: 0x5a2420, stache: 'thin', seed: 1.2 });
    const SOL = [0, 1, 2, 3, 4, 5].map(i => hero({ skin: [0xa06a44, 0xb07a50, 0x8e5c3a][i % 3], dhoti: [0x6a4a2a, 0x7a2a20, 0x3a4a6a][i % 3], sash: 0x2a2a2a, crown: 'helmet', torso: 'tunic', tunic: [0x6a3a22, 0x4a2a2a, 0x2a3a5a][i % 3], sashOn: false, stache: 'thin', jewel: false, seed: i * 0.77, hairStyle: 'short' }));

    // bow (Gandiva) in Arjuna's left hand
    const makeBow = () => { const g = new THREE.Group(); const pts = []; for (let i = 0; i <= 24; i++) { const s = i / 24, y = (s - 0.5) * 1.5; pts.push(V3(0.16 * Math.cos((s - 0.5) * PI) - Math.sin((s - 0.5) * PI * 2) * 0.03 * Math.sign(y) * Math.abs(Math.sin(s * PI * 2)), y, 0)); }
      const tube = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 48, 0.016, 8), mat(0x6a3a1a, { roughness: 0.5 })); g.add(tube);
      for (const yy of [-0.05, 0.05]) { const w = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.08, 12), GOLD); w.position.set(0.16, yy, 0); g.add(w); }
      const str = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 1.5, 4), mat(0xf0e6c8)); str.position.x = 0.0; g.add(str); g.userData.str = str; g.traverse(q => q.isMesh && (q.castShadow = true));
      return g; };
    const bowAR = makeBow(); bowAR.scale.setScalar(1.0); const bowSK = makeBow();
    const handBow = (M, bow) => { M.g.updateMatrixWorld(true); const hand = M.B.PalmL; S.add(bow); bow.position.set(0, 0, 0); hand.add(bow);
      const ws = hand.getWorldScale(V3(0, 0, 0)).x; bow.scale.setScalar(1 / ws * 0.86); bow.rotation.set(0, 0, 0); bow.position.set(0, 0.06 / ws, 0); return bow; };
    handBow(AR, bowAR); handBow(SK, bowSK);

    // ================================================================ arrows (instanced: shaft, head, fletching)
    const arrowSets = [];
    function arrowField(list, { len = 0.95, shaft = 0xc9b48a } = {}) {        // list of [x,y,z (tip), dirx,diry,dirz (pointing from tip to tail)]
      const n = list.length, shG = new THREE.CylinderGeometry(0.008, 0.008, len, 6), hdG = new THREE.ConeGeometry(0.014, 0.06, 8), flG = new THREE.PlaneGeometry(0.032, 0.11);
      const sh = new THREE.InstancedMesh(shG, mat(shaft, { roughness: 0.7 }), n), fl = new THREE.InstancedMesh(flG, mat(0xf6f2ea, { side: THREE.DoubleSide, roughness: 0.8 }), n * 2), hd = new THREE.InstancedMesh(hdG, mat(0x8a8e94, { metalness: 0.7, roughness: 0.35 }), n);
      const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), up = V3(0, 1, 0);
      list.forEach((a, i) => { const tip = V3(a[0], a[1], a[2]), d = V3(a[3], a[4], a[5]).normalize(); q.setFromUnitVectors(up, d);
        m4.compose(tip.clone().addScaledVector(d, len / 2), q, V3(1, 1, 1)); sh.setMatrixAt(i, m4);
        const qh = new THREE.Quaternion().setFromUnitVectors(up, d.clone().negate()); m4.compose(tip.clone().addScaledVector(d, 0.02), qh, V3(1, 1, 1)); hd.setMatrixAt(i, m4);
        for (let k = 0; k < 2; k++) { const qf = q.clone().multiply(new THREE.Quaternion().setFromAxisAngle(up, k * PI / 2 + i)); m4.compose(tip.clone().addScaledVector(d, len - 0.1), qf, V3(1, 1, 1)); fl.setMatrixAt(i * 2 + k, m4); } });
      const g = new THREE.Group(); [sh, fl, hd].forEach(m => { m.castShadow = true; m.receiveShadow = true; m.frustumCulled = false; g.add(m); }); S.add(g); arrowSets.push(g); return g; }
    const singleArrow = () => arrowField([[0, 0, 0, 0, 1, 0]]);

    // ================================================================ world: sky, haze hills, dusty ground
    const SKIES = {
      gold: { stops: [[0, '#4f82be'], [0.38, '#8fb2d6'], [0.47, '#efdcb8'], [0.5, '#f6e2be'], [1, '#c8a878']], sun: [0.47, 0.22, '#fff2d0'], clouds: '#ffffff', fog: 0xe9d6b2, hemi: [0xc8dcff, 0x9a7a52, 1.0], key: [0xffdcaa, 3.0], dir: [-0.55, 0.32, -0.75], exp: 1.0 },
      night: { stops: [[0, '#03061a'], [0.35, '#0b1440'], [0.48, '#24356e'], [0.5, '#2a3a6a'], [1, '#0a0c18']], stars: 1, moon: [0.42, 0.7], fog: 0x18234a, hemi: [0x4a5a9a, 0x1a1410, 0.55], key: [0x9ab0ff, 1.3], dir: [0.3, 0.7, -0.6], exp: 1.15 },
      dawn: { stops: [[0, '#6f8fc4'], [0.36, '#b9b4d4'], [0.46, '#f4c8b8'], [0.5, '#ffe4c4'], [1, '#b89a8a']], sun: [0.49, 0.5, '#fff6e0'], clouds: '#ffe6e0', fog: 0xeed8cc, hemi: [0xd8d0ff, 0x9a7a6a, 1.0], key: [0xffd8c0, 2.6], dir: [0.0, 0.18, -1], exp: 1.05 },
      blue: { stops: [[0, '#0a1236'], [0.36, '#22306a'], [0.46, '#5a5a8e'], [0.5, '#c07a6a'], [1, '#1a1622']], stars: 0.5, fog: 0x2a2c55, hemi: [0x5a6aaa, 0x2a1a14, 0.5], key: [0x8a9aff, 0.6], dir: [0.4, 0.5, -0.7], exp: 1.2 },
    };
    const skyTex = {};
    for (const k in SKIES) { const s = SKIES[k]; skyTex[k] = K.canvasTex(1024, 1024, (x, w, h) => {
      const g = x.createLinearGradient(0, 0, 0, h); s.stops.forEach(([o, c]) => g.addColorStop(o, c)); x.fillStyle = g; x.fillRect(0, 0, w, h);
      const r = rng(k.length * 7 + 3);
      if (s.stars) for (let i = 0; i < 900 * s.stars; i++) { const yy = Math.pow(r(), 1.6) * h * 0.47, a = 0.3 + r() * 0.7; x.fillStyle = `rgba(255,255,255,${a})`; x.fillRect(r() * w, yy, r() < 0.06 ? 2.4 : 1.2, r() < 0.06 ? 2.4 : 1.2); }
      if (s.moon) { const mx = s.moon[0] * w, my = s.moon[1] * h * 0.5; const gg = x.createRadialGradient(mx, my, 4, mx, my, 90); gg.addColorStop(0, 'rgba(220,230,255,0.9)'); gg.addColorStop(0.2, 'rgba(180,200,255,0.25)'); gg.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = gg; x.fillRect(mx - 90, my - 90, 180, 180); x.fillStyle = '#eef2ff'; x.beginPath(); x.arc(mx, my, 13, 0, TAU); x.fill(); }
      if (s.sun) { const sx = s.sun[0] * w, sy = s.sun[1] * h + h * 0.24; const gg = x.createRadialGradient(sx, sy, 2, sx, sy, 260); gg.addColorStop(0, s.sun[2]); gg.addColorStop(0.12, 'rgba(255,240,200,0.75)'); gg.addColorStop(1, 'rgba(255,220,160,0)'); x.fillStyle = gg; x.fillRect(sx - 260, sy - 260, 520, 520); }
      if (s.clouds) for (let i = 0; i < 26; i++) { const cx = r() * w, cy = h * (0.18 + r() * 0.26), rw = 60 + r() * 160; x.fillStyle = s.clouds; x.globalAlpha = 0.08 + r() * 0.16; for (let j = 0; j < 7; j++) { x.beginPath(); x.ellipse(cx + (r() - 0.5) * rw * 1.6, cy + (r() - 0.5) * 18, rw * (0.4 + r() * 0.5), 12 + r() * 16, 0, 0, TAU); x.fill(); } x.globalAlpha = 1; }
    }); skyTex[k].mapping = THREE.EquirectangularReflectionMapping; }
    const skyMat = new THREE.MeshBasicMaterial({ map: skyTex.gold, side: THREE.BackSide, fog: false, depthWrite: false });
    const sky = new THREE.Mesh(new THREE.SphereGeometry(400, 48, 32), skyMat); S.add(sky);
    const skyMat2 = new THREE.MeshBasicMaterial({ map: skyTex.night, side: THREE.BackSide, fog: false, transparent: true, opacity: 0, depthWrite: false });
    const sky2 = new THREE.Mesh(new THREE.SphereGeometry(399, 48, 32), skyMat2); S.add(sky2);
    // distant hills as two hazy silhouette rings
    const hillRing = (rad, h, seed, col, alpha) => { const tx = K.canvasTex(2048, 256, (x, w, hh) => { const r = rng(seed); x.clearRect(0, 0, w, hh); x.fillStyle = col; x.beginPath(); x.moveTo(0, hh);
        for (let i = 0; i <= 256; i++) { const xx = i / 256 * w, y = hh * (0.55 - 0.3 * (0.5 + 0.5 * Math.sin(i * 0.11 + seed)) * (0.5 + 0.5 * Math.sin(i * 0.031 + seed * 2)) - r() * 0.05); x.lineTo(xx, y); }
        x.lineTo(w, hh); x.closePath(); x.fill(); });
      tx.wrapS = THREE.RepeatWrapping; const m = new THREE.Mesh(new THREE.CylinderGeometry(rad, rad, h, 96, 1, true), new THREE.MeshBasicMaterial({ map: tx, transparent: true, side: THREE.BackSide, opacity: alpha, depthWrite: false, fog: true }));
      m.position.y = h / 2 - 2; S.add(m); return m; };
    const hills1 = hillRing(230, 46, 4, '#7d8aa0', 0.9), hills2 = hillRing(170, 30, 9, '#8a8878', 0.95);
    // ground: dusty ochre with cart ruts, footprints, pebbles
    const gTex = K.canvasTex(1024, 1024, (x, w, h) => { x.fillStyle = '#a8845a'; x.fillRect(0, 0, w, h); const r = rng(5);
      for (let i = 0; i < 2600; i++) { const c = r(); x.fillStyle = c < 0.5 ? `rgba(70,48,28,${0.05 + r() * 0.08})` : `rgba(235,205,160,${0.05 + r() * 0.08})`; x.beginPath(); x.ellipse(r() * w, r() * h, 4 + r() * 40, 3 + r() * 20, r() * PI, 0, TAU); x.fill(); }
      for (let i = 0; i < 1600; i++) { x.fillStyle = `rgba(${60 + r() * 60},${45 + r() * 40},${30 + r() * 30},0.5)`; x.fillRect(r() * w, r() * h, 2 + r() * 3, 2 + r() * 2); }
      x.strokeStyle = 'rgba(60,40,22,0.16)'; for (let i = 0; i < 8; i++) { x.lineWidth = 6 + r() * 8; x.beginPath(); const y0 = r() * h; x.moveTo(0, y0); x.bezierCurveTo(w * 0.3, y0 + (r() - 0.5) * 300, w * 0.6, y0 + (r() - 0.5) * 300, w, y0 + (r() - 0.5) * 200); x.stroke(); } });
    gTex.wrapS = gTex.wrapT = THREE.RepeatWrapping; gTex.repeat.set(60, 60);
    const groundM = mat(0xffffff, { map: gTex, roughness: 1 });
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(800, 800, 1, 1), groundM); ground.rotation.x = -PI / 2; ground.receiveShadow = true; S.add(ground);
    // lights
    const hemi = new THREE.HemisphereLight(0xc8dcff, 0x9a7a52, 1.0); S.add(hemi);
    const key = new THREE.DirectionalLight(0xffdcaa, 3); key.castShadow = true; key.shadow.mapSize.set(2048, 2048); key.shadow.bias = -0.0004; key.shadow.normalBias = 0.02;
    Object.assign(key.shadow.camera, { left: -9, right: 9, top: 9, bottom: -9, near: 1, far: 120 }); S.add(key); S.add(key.target);
    S.fog = new THREE.Fog(0xe9d6b2, 25, 210);
    let curSky = 'gold';
    const setSky = (k, focus = V3(0, 0, 0), k2 = null, mix = 0) => { const s = SKIES[k]; curSky = k; skyMat.map = skyTex[k]; skyMat.needsUpdate = true;
      const s2 = k2 ? SKIES[k2] : s; skyMat2.map = skyTex[k2 || k]; skyMat2.opacity = k2 ? mix : 0; skyMat2.needsUpdate = true;
      const c = (a, b) => new THREE.Color(a).lerp(new THREE.Color(b), k2 ? mix : 0);
      S.fog.color.copy(c(s.fog, s2.fog)); hemi.color.copy(c(s.hemi[0], s2.hemi[0])); hemi.groundColor.copy(c(s.hemi[1], s2.hemi[1])); hemi.intensity = lerp(s.hemi[2], s2.hemi[2], k2 ? mix : 0);
      key.color.copy(c(s.key[0], s2.key[0])); key.intensity = lerp(s.key[1], s2.key[1], k2 ? mix : 0);
      const d = V3(...s.dir).lerp(V3(...s2.dir), k2 ? mix : 0).normalize();
      key.position.copy(focus).addScaledVector(d, 40); key.target.position.copy(focus); curExp = lerp(s.exp, s2.exp, k2 ? mix : 0);
      envI(lerp(k === 'gold' || k === 'dawn' ? 0.7 : 0.2, k2 === 'night' ? 0.2 : (k === 'gold' || k === 'dawn' ? 0.7 : 0.2), k2 ? mix : 0)); };

    // ================================================================ props
    const groupOf = () => { const g = new THREE.Group(); S.add(g); return g; };
    const shadowAll = g => g.traverse(q => { if (q.isMesh) { q.castShadow = true; q.receiveShadow = true; } });
    // chariot (Bhishma's palm-tree banner)
    const wheel = (r = 0.75) => { const g = new THREE.Group(); const wood = mat(0x7a4a22, { roughness: 0.6 });
      const rim = new THREE.Mesh(new THREE.TorusGeometry(r, 0.06, 14, 64), GOLD); g.add(rim); const rim2 = new THREE.Mesh(new THREE.TorusGeometry(r * 0.93, 0.035, 10, 64), wood); g.add(rim2);
      for (let i = 0; i < 12; i++) { const sp = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.03, r, 10), wood); sp.position.set(Math.cos(i * TAU / 12) * r / 2, Math.sin(i * TAU / 12) * r / 2, 0); sp.rotation.z = i * TAU / 12 - PI / 2; g.add(sp); }
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.22, 24), GOLD); hub.rotation.x = PI / 2; g.add(hub);
      const hc = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 12), RUBY); hc.position.z = 0.12; g.add(hc); return g; };
    const chariot = groupOf();
    { const red = mat(0x8a1a14, { roughness: 0.55 }), wood = mat(0x6a3a1a, { roughness: 0.6 });
      const base = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.18, 1.3), wood); base.position.y = 0.92; chariot.add(base);
      const front = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.7, 0.08), red); front.position.set(0, 1.35, 0.62); chariot.add(front);
      const trimF = new THREE.Mesh(new THREE.BoxGeometry(1.76, 0.07, 0.1), GOLD); trimF.position.set(0, 1.72, 0.62); chariot.add(trimF);
      for (const sx of [-1, 1]) { const side = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.5, 1.3), red); side.position.set(sx * 0.85, 1.25, 0); chariot.add(side); const ts = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.06, 1.36), GOLD); ts.position.set(sx * 0.85, 1.52, 0); chariot.add(ts);
        const w = wheel(0.78); w.rotation.y = PI / 2; w.position.set(sx * 1.0, 0.8, -0.05); chariot.add(w); }
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 4.2, 12), wood); pole.position.set(-0.7, 2.8, -0.5); chariot.add(pole);
      const ft = K.canvasTex(256, 160, (x, w, h) => { x.fillStyle = '#f4ecd8'; x.fillRect(0, 0, w, h); x.fillStyle = '#c89a3a'; x.fillRect(0, 0, w, 10); x.fillRect(0, h - 10, w, 10);
        x.strokeStyle = '#5a3a1a'; x.lineWidth = 8; x.beginPath(); x.moveTo(128, 140); x.quadraticCurveTo(120, 90, 130, 50); x.stroke(); x.fillStyle = '#3a6a2a';
        for (let i = 0; i < 7; i++) { x.save(); x.translate(130, 50); x.rotate(-PI / 2 + (i - 3) * 0.5); x.beginPath(); x.ellipse(28, 0, 30, 8, 0, 0, TAU); x.fill(); x.restore(); } });
      const flagG = new THREE.PlaneGeometry(1.2, 0.75, 16, 4); const flag = new THREE.Mesh(flagG, new THREE.MeshStandardMaterial({ map: ft, side: THREE.DoubleSide, roughness: 0.8 })); flag.position.set(-0.1, 4.45, -0.5); chariot.add(flag); chariot.userData.flag = flag; chariot.userData.flagBase = flagG.attributes.position.array.slice();
      shadowAll(chariot); }
    const waveFlag = (fl, base, t, amp = 0.08) => { const p = fl.geometry.attributes.position; for (let i = 0; i < p.count; i++) { const x0 = base[i * 3], y0 = base[i * 3 + 1], k = (x0 + 0.6) / 1.2; p.setZ(i, Math.sin(x0 * 5 - t * 6 + y0 * 2) * amp * k); } p.needsUpdate = true; fl.geometry.computeVertexNormals(); };
    // banners on poles around the field
    const banners = groupOf(); const bannerFlags = [];
    { const r = rng(17); const cols = ['#c8301e', '#e08a1a', '#c8301e', '#f2e2c2', '#8a1a40'];
      for (let i = 0; i < 14; i++) { const a = r() * TAU, d = 9 + r() * 22, x = Math.cos(a) * d, z = Math.sin(a) * d - 4; const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, 4.5, 8), mat(0x5a3a1e)); pole.position.set(x, 2.25, z); banners.add(pole);
        const fg = new THREE.PlaneGeometry(0.9, 0.5, 10, 2); fg.translate(0.45, 0, 0); const fl = new THREE.Mesh(fg, mat(cols[i % 5], { side: THREE.DoubleSide, roughness: 0.8 })); fl.position.set(x, 4.2, z); fl.rotation.y = 0.5; banners.add(fl); bannerFlags.push([fl, fg.attributes.position.array.slice(), r() * 6]); } shadowAll(banners); }
    // scattered battle debris: spent arrows, broken spears, shields
    const debris = groupOf();
    { const r = rng(23), list = []; for (let i = 0; i < 140; i++) { const a = r() * TAU, d = 2.4 + Math.pow(r(), 0.7) * 26; list.push([Math.cos(a) * d, -0.05, Math.sin(a) * d, (r() - 0.5) * 0.9, 1, (r() - 0.5) * 0.9]); }
      debris.add(arrowField(list));
      for (let i = 0; i < 10; i++) { const a = r() * TAU, d = 3 + r() * 14; const sh = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.05, 32), mat(0x8a6a3a, { metalness: 0.5, roughness: 0.45 })); sh.position.set(Math.cos(a) * d, 0.05, Math.sin(a) * d); sh.rotation.set(0.1 * r(), 0, 0.1 * r()); debris.add(sh);
        const boss = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 8, 0, TAU, 0, PI / 2), GOLD2); boss.position.copy(sh.position).add(V3(0, 0.03, 0)); debris.add(boss); }
      for (let i = 0; i < 12; i++) { const a = r() * TAU, d = 3 + r() * 16; const sp = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.6 + r(), 6), mat(0x5a3a1e)); sp.position.set(Math.cos(a) * d, 0.04, Math.sin(a) * d); sp.rotation.set(PI / 2, 0, r() * PI); debris.add(sp); }
      shadowAll(debris); }
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
    const flameTex = K.canvasTex(64, 128, (x, w, h) => { const g = x.createRadialGradient(w / 2, h * 0.65, 2, w / 2, h * 0.6, h * 0.45); g.addColorStop(0, 'rgba(255,255,230,1)'); g.addColorStop(0.3, 'rgba(255,200,90,0.95)'); g.addColorStop(0.7, 'rgba(255,110,20,0.35)'); g.addColorStop(1, 'rgba(255,80,0,0)'); x.fillStyle = g; x.beginPath(); x.ellipse(w / 2, h * 0.6, w * 0.42, h * 0.42, 0, 0, TAU); x.fill(); });
    const glowTex = K.canvasTex(128, 128, (x, w, h) => { const g = x.createRadialGradient(w / 2, h / 2, 1, w / 2, h / 2, w / 2); g.addColorStop(0, 'rgba(255,220,150,0.9)'); g.addColorStop(0.3, 'rgba(255,170,70,0.3)'); g.addColorStop(1, 'rgba(255,140,40,0)'); x.fillStyle = g; x.fillRect(0, 0, w, h); });
    const flames = [];
    const diya = (parent, x, y, z, s = 1, light = false) => { const g = new THREE.Group(); g.position.set(x, y, z); g.scale.setScalar(s); parent.add(g);
      const cup = new THREE.Mesh(new THREE.LatheGeometry([[0, 0], [0.07, 0.005], [0.1, 0.04], [0.085, 0.06], [0.0, 0.03]].map(([a, b]) => new THREE.Vector2(a, b)), 20), mat(0x9a4a22, { roughness: 0.8 })); cup.castShadow = true; g.add(cup);
      const f = new THREE.Sprite(new THREE.SpriteMaterial({ map: flameTex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true })); f.scale.set(0.07, 0.15, 1); f.position.set(0.05, 0.12, 0); g.add(f);
      const gl = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.6 })); gl.scale.set(0.6, 0.6, 1); gl.position.set(0.05, 0.12, 0); g.add(gl);
      let pl = null; if (light) { pl = new THREE.PointLight(0xffa04a, 2.2, 4, 2); pl.position.set(0.05, 0.25, 0); g.add(pl); }
      flames.push({ f, gl, pl, s: x * 3.1 + z * 1.7 }); return g; };
    const torch = (parent, x, z, h = 2.0) => { const g = new THREE.Group(); g.position.set(x, 0, z); parent.add(g); const p = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, h, 8), mat(0x4a2a14)); p.position.y = h / 2; p.castShadow = true; g.add(p);
      const f = new THREE.Sprite(new THREE.SpriteMaterial({ map: flameTex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true })); f.scale.set(0.3, 0.6, 1); f.position.y = h + 0.22; g.add(f);
      const gl = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.7 })); gl.scale.set(2.2, 2.2, 1); gl.position.y = h + 0.2; g.add(gl);
      const pl = new THREE.PointLight(0xff9a40, 6, 9, 1.6); pl.position.y = h + 0.3; g.add(pl); flames.push({ f, gl, pl, s: x + z, big: 1 }); return g; };
    const nightProps = groupOf(); torch(nightProps, -2.4, -1.4); torch(nightProps, 2.2, -1.6); torch(nightProps, -2.0, 1.9, 1.7);
    diya(nightProps, -1.6, 0, 0.55, 1.2, false); diya(nightProps, 1.3, 0, 0.6, 1.2, false);
    const lampField = groupOf();
    { const r = rng(41); for (let i = 0; i < 120; i++) { const a = r() * TAU, d = 1.3 + Math.pow(r(), 0.8) * 7; diya(lampField, Math.cos(a) * d * 1.3, 0, Math.sin(a) * d, 1.1, i < 6); } }
    // dust motes / petals / embers as points
    const ptsTex = K.canvasTex(64, 64, (x, w, h) => { const g = x.createRadialGradient(32, 32, 0, 32, 32, 32); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, w, h); });
    const cloud = (n, col, size, seed, opacity = 0.7, additive = true) => { const g = new THREE.BufferGeometry(), p = new Float32Array(n * 3); g.setAttribute('position', new THREE.BufferAttribute(p, 3));
      const m = new THREE.Points(g, new THREE.PointsMaterial({ map: ptsTex, color: col, size, transparent: true, opacity, depthWrite: false, blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending, sizeAttenuation: true }));
      m.frustumCulled = false; S.add(m); const r = rng(seed); m.userData.seed = Array.from({ length: n }, () => [r(), r(), r(), r()]); return m; };
    const dust = cloud(260, 0xffe6b8, 0.028, 3, 0.35);
    const sparks = cloud(160, 0xdff2ff, 0.05, 7, 0.9);
    const petals = cloud(220, 0xff9a5a, 0.07, 11, 0.95, false);
    const stars = cloud(200, 0xfff6d8, 0.06, 13, 0.0);
    const fly = (m, t, { c = V3(0, 0, 0), sx = 8, sy = 3, sz = 8, vy = 0.05, vx = 0.1, y0 = 0 } = {}) => { const p = m.geometry.attributes.position; m.userData.seed.forEach((s, i) => {
      const y = y0 + ((s[1] * sy + t * vy * (0.5 + s[3])) % sy + sy) % sy; p.setXYZ(i, c.x + (s[0] - 0.5) * sx + Math.sin(t * 0.5 + s[2] * 9) * 0.3 + t * vx * (s[3] - 0.3), c.y + y, c.z + (s[2] - 0.5) * sz + Math.cos(t * 0.4 + s[0] * 9) * 0.3); }); p.needsUpdate = true; };
    // dust burst when Bhishma hits the ground
    const burst = cloud(260, 0xd8b88a, 0.22, 19, 0.45, false);
    // palm-leaf manuscript on a wooden stand (source line)
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

    // ================================================================ HUD (labels, fades, follow button) drawn on top
    const hud = K.canvasTex(1080, 1920, () => {});
    const hs = new THREE.Scene(), hc = new THREE.OrthographicCamera(-540, 540, 960, -960, -10, 10);
    const rtOpt = { type: THREE.HalfFloatType, samples: 4 };
    const rtA = new THREE.WebGLRenderTarget(1080, 1920, rtOpt), rtB = new THREE.WebGLRenderTarget(1080, 1920, rtOpt);
    const qA = new THREE.Mesh(new THREE.PlaneGeometry(1080, 1920), new THREE.MeshBasicMaterial({ map: rtA.texture }));
    const qB = new THREE.Mesh(new THREE.PlaneGeometry(1080, 1920), new THREE.MeshBasicMaterial({ map: rtB.texture, transparent: true, opacity: 0 })); qB.position.z = 1;
    const qH = new THREE.Mesh(new THREE.PlaneGeometry(1080, 1920), new THREE.MeshBasicMaterial({ map: hud, transparent: true, toneMapped: false })); qH.position.z = 2;
    hs.add(qA, qB, qH);
    let HUDfn = null;
    const label = (x, s, X, Y, size, col, a = 1, font = 'Cinzel', w = '400', sp = 0) => { if (a <= 0) return; x.save(); x.globalAlpha = a; x.font = `${w} ${size}px "${font}"`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = col;
      x.shadowColor = 'rgba(0,0,0,0.55)'; x.shadowBlur = 14; if (sp && x.letterSpacing !== undefined) x.letterSpacing = sp + 'px'; x.fillText(s, X, Y); x.restore(); };
    const tag = (x, s, a) => { if (a <= 0) return; label(x, s, 540, 300, 30, '#f6ead0', a * 0.92, 'Cinzel', '700', 6); x.save(); x.globalAlpha = a * 0.7; x.fillStyle = '#e8c46a'; x.fillRect(470, 330, 140, 2); x.restore(); };

    // ================================================================ shots — one per line; each sets the whole world from (t, u)
    const hideAll = () => { heroes.forEach(M => { M.root.visible = false; }); [chariot, bed, pillow, chestArrows, water, nightProps, lampField, book, bigWheel, banners, debris, burst, sparks, petals, ...flying].forEach(o => { o.visible = false; }); dust.visible = true; stars.visible = false; pillow.visible = false; HUDfn = null; };
    const cam = { p: V3(0, 2, 8), l: V3(0, 1, 0), fov: 35 };
    const C = (p0, p1, l0, l1, u, fov = 35, e = ease) => { const k = e(u); cam.p.set(...p0.map((v, i) => lerp(v, p1[i], k))); cam.l.set(...l0.map((v, i) => lerp(v, l1[i], k))); cam.fov = fov; };
    const narr = t => K.voice('narrator', t);
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
      recap: (t, u) => { setSky('gold', V3(0, 0, -3)); [chariot, banners, debris, chestArrows, ...flying].forEach(o => o.visible = true); chariot.position.set(0.2, 0, -9); chariot.rotation.y = 0.35;
        place(BH, 0.3, 0.95, -9.1, 0.35); pose(BH, 'Man_Idle', t * 0.8, { UpperArmL: [0, 0, 0.2], Neck: [0.1, 0, 0] }); BH.head.update(t, { close: 0.2 });
        BH.root.updateMatrixWorld(true); chestArrows.position.copy(BH.B.Torso.getWorldPosition(V3(0, 0, 0))); chestArrows.quaternion.copy(BH.root.quaternion); chestArrows.scale.setScalar(K.ease(u));
        place(SK, 0.5, 0, 1.4, PI + 0.1); pose(SK, 'Man_Idle', t + 1, ARMS_BOW(0.4)); SK.head.update(t, {});
        place(AR, 1.2, 0, 3.4, PI + 0.06); pose(AR, 'Man_Idle', t, ARMS_BOW(0.5 + 0.5 * Math.abs(Math.sin(u * 7)))); AR.head.update(t, { brow: -0.6 });
        flying.forEach((a, i) => { const k = ((u * 2.4 + i / flying.length) % 1); const from = V3(1.1, 1.75, 2.8), to = V3(0.3 + (i - 2.5) * 0.08, 2.0, -8.9); a.position.copy(from.clone().lerp(to, k)); a.position.y += Math.sin(k * PI) * 0.8; a.lookAt(to); a.rotateX(-PI / 2); a.visible = k > 0.04 && k < 0.96; });
        C([1.05, 1.75, 5.3], [0.85, 1.8, 4.7], [0.0, 1.6, -9], [0.1, 1.7, -9], u, 32);
        HUDfn = x => tag(x, 'KURUKSHETRA · DAY 10', K.pulse(u, 0.0, 0.9)); },
      fall: (t, u) => { setSky('gold', V3(0, 0, -9)); [chariot, banners, debris, burst, chestArrows].forEach(o => o.visible = true); chariot.position.set(0.2, 0, -9); chariot.rotation.y = 0.35;
        const k = K.easeIn(clamp((u - 0.2) / 0.5));
        place(BH, 0.3, 0.95, -9.1, 0.35); BH.root.rotation.set(-k * 1.5, 0.35, 0, 'YXZ'); BH.root.position.set(0.3 - k * 0.4, 0.95 - k * 0.85, -9.1 - k * 1.0);
        pose(BH, 'Man_Idle', t, { UpperArmL: [0, 0, -0.9 * k], UpperArmR: [0, 0, -0.9 * k], Neck: [-0.4 * k, 0, 0] }); BH.head.update(t, { close: k * 0.7, brow: 1 - k });
        BH.root.updateMatrixWorld(true); chestArrows.position.copy(BH.B.Torso.getWorldPosition(V3(0, 0, 0))); chestArrows.quaternion.copy(BH.root.quaternion);
        burst.visible = u > 0.68; fly(burst, (u - 0.68) * 6, { c: V3(-0.1, 0, -10.2), sx: 2 + (u - 0.68) * 6, sz: 2, sy: 1.0, vy: 0.3 });
        C([2.5, 0.7, -5.0], [2.2, 0.6, -5.6], [0.2, 2.0, -9.2], [0.0, 1.0, -9.8], u, 36); },
      bed: (t, u) => { setSky('gold'); [bed, banners, debris].forEach(o => o.visible = true); lieBH(t, { headDrop: 1, close: 0.45 });
        C([HP.x + 2.6, 1.35, 1.9], [HP.x + 2.1, 1.15, 1.5], [HP.x + 0.4, 0.6, 0], [HP.x + 0.2, 0.62, 0], u, 34);
        HUDfn = x => tag(x, 'SHARA SHAYYA', K.pulse(u, 0.05, 0.9)); },
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
        HUDfn = x => tag(x, 'UTTARAYANA', K.pulse(u, 0.35, 0.65)); },
      days: (t, u) => { const cyc = (u * 2.6) % 1, nightness = clamp(Math.sin(cyc * TAU) * 1.4 + 0.5);
        setSky('gold', V3(0, 0, 0), 'night', nightness); [bed, banners, debris, pillow].forEach(o => o.visible = true); lieBH(t, { close: 0.1 }); pillow.position.set(HP.x + 1.32, 0, 0);
        stars.visible = true; stars.material.opacity = nightness; fly(stars, t, { c: V3(0, 6, 0), sx: 40, sz: 40, sy: 10, vy: 0 });
        const a = -0.6 + u * 1.3; C([Math.sin(a) * 5.5, 2.6, Math.cos(a) * 5.5], [Math.sin(a + 0.3) * 5.0, 2.3, Math.cos(a + 0.3) * 5.0], [0, 0.5, 0], [0, 0.5, 0], u, 34, x => x);
        HUDfn = x => { label(x, String(Math.min(58, Math.floor(eo(clamp(u * 1.05)) * 58))), 540, 520, 200, '#fff4d8', eo(clamp(u * 4)), 'Cinzel', '700'); label(x, 'RAATHRULU', 540, 650, 40, '#f0e2c0', eo(clamp(u * 4)), 'Cinzel', '700', 8); }; },
      teach: (t, u) => { setSky('night', V3(0, 0, 0)); [bed, nightProps, debris, pillow].forEach(o => o.visible = true); pillow.position.set(HP.x + 1.32, 0, 0); key.intensity = 0.5; hemi.intensity = 0.35;
        lieBH(t, { talk: narr(t) * 0.8, close: 0.1, look: [0.3, -0.2] });
        place(YU, HP.x + 0.35, 0, 0.95, PI); pose(YU, 'Man_Sitting', 0.6, { Neck: [0.3, 0, 0], Torso: [0.2, 0, 0] }); YU.root.position.y = -0.05; YU.head.update(t, { close: 0.2 });
        place(KR, HP.x + 1.3, 0, 1.55, PI + 0.4); pose(KR, 'Man_Idle', t, { Neck: [0.3, 0, 0] }); KR.head.update(t, { look: [0, -0.4] });
        C([HP.x - 0.6, 1.6, -2.0], [HP.x - 0.45, 1.45, -1.7], [HP.x + 0.25, 0.82, 0.5], [HP.x + 0.25, 0.82, 0.5], u, 34);
        HUDfn = x => tag(x, 'RAAJADHARMAM', K.pulse(u, 0.05, 0.6)); },
      sun: (t, u) => { setSky('dawn', V3(0, 0, 0)); [bed, banners, debris, dust, pillow].forEach(o => o.visible = true); pillow.position.set(HP.x + 1.32, 0, 0); const c = eo(clamp((u - 0.45) / 0.35));
        lieBH(t, { close: c, look: [0, 0.4] });
        C([NP.x + 0.12, NP.y + 0.18, 1.1], [NP.x + 0.08, NP.y + 0.12, 0.8], [NP.x - 0.02, NP.y - 0.02, 0], [NP.x - 0.02, NP.y - 0.02, 0], u, 30);
        HUDfn = x => { const w = clamp((u - 0.82) / 0.18) * 0.35; if (w > 0) { x.fillStyle = `rgba(255,246,226,${w})`; x.fillRect(0, 0, 1080, 1920); } }; },
      ashtami: (t, u) => { setSky('blue', V3(0, 0, 0)); [bed, lampField, petals].forEach(o => o.visible = true); pillow.visible = true; pillow.position.y = 0; key.intensity = 0.4;
        fly(petals, t, { c: V3(0, 0, 0), sx: 10, sz: 8, sy: 5, vy: -0.35, vx: 0.05 });
        C([5.5, 1.1, 6.0], [3.0, 1.4, 4.2], [0, 0.4, 0], [0, 0.6, 0], u, 34);
        HUDfn = x => { label(x, 'భీష్మ అష్టమి', 540, 470, 108, '#ffe7b0', eo(clamp(u * 3)) * (1 - clamp((u - 0.92) * 12)), 'Noto Sans Telugu', '700'); tag(x, 'MAGHA SHUKLA ASHTAMI', eo(clamp((u - 0.2) * 3))); }; },
      source: (t, u) => { setSky('night', V3(60, 0, 60)); book.visible = true; key.intensity = 0.25; hemi.intensity = 0.3;
        C([61.6, 1.35, 61.5], [61.15, 1.15, 61.1], [60.0, 0.6, 60.0], [60.0, 0.62, 60.05], u, 30);
        HUDfn = x => { label(x, 'MAHABHARATAM', 540, 360, 64, '#f6e2b0', eo(clamp(u * 3)), 'Cinzel', '700', 4); label(x, 'Bheeshma Parva  ·  Anushaasana Parva', 540, 440, 38, '#f0e6d0', eo(clamp((u - 0.2) * 3)), 'Cinzel', '400'); }; },
      cta: (t, u) => { setSky('dawn', V3(-60, 0, -60)); bigWheel.visible = true; bigWheel.rotation.set(0, 0.35, 0); bigWheel.children.forEach(() => {});
        C([-60 + 1.2, 2.4, -60 + 4.6], [-60 + 0.9, 2.15, -60 + 3.9], [-60, 2.0, -60], [-60, 2.05, -60], u, 34);
        HUDfn = x => { const a = eo(clamp(u * 2.5)); x.fillStyle = `rgba(20,10,4,${0.35 * a})`; x.fillRect(0, 0, 1080, 1920);
          label(x, 'అంపశయ్య', 540, 760, 150, '#ffd77a', a, 'Noto Sans Telugu', '700'); label(x, 'BHEESHMUDU · PART 3 / 3', 540, 900, 38, '#f6ead0', a, 'Cinzel', '700', 6);
          const b = eo(clamp((t - (Bt('cta') + 0.5)) / 0.4)); if (b > 0) { x.save(); x.globalAlpha = b; x.translate(540, 1080); x.scale(0.7 + 0.3 * b, 0.7 + 0.3 * b); x.fillStyle = '#ffd24a'; K.rrect(x, -190, -50, 380, 100, 50); x.fill(); x.fillStyle = '#1a1208'; x.font = '700 50px "Fredoka"'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('FOLLOW', 0, 3); x.restore(); } }; },
    };
    if (window.LOOK) { SH.recap = (t, u) => { setSky('gold', V3(0, 0, 0)); debris.visible = true;
        const who = [BH, AR, KR, YU, SK, SOL[0]]; who.forEach((M, i) => { place(M, (i - 2.5) * 0.95, 0, 0, 0); pose(M, 'Man_Idle', 0.3); M.head.update(0.3, {}); });
        const z = window.LOOK > 1, X = window.LOOK === 2 ? -1.425 : -2.375; C(z ? [X + 0.3, 1.62, 1.4] : [0, 1.0, 6.4], z ? [X, 1.62, 1.3] : [0, 1.0, 6.4], z ? [X, 1.58, 0] : [0, 0.95, 0], z ? [X, 1.58, 0] : [0, 0.95, 0], 0, z ? 30 : 34); }; }
    const shotAt = i => { const l = L[i], a = l.t - XF, b = i + 1 < N ? L[i + 1].t : D; return { id: LINES[i].id, a, b }; };
    const renderShot = (i, t, target) => { const s = shotAt(i); hideAll(); cam.up = 0; SH[s.id](t, prog(t, s.a, s.b));
      // flags + flames + dust
      bannerFlags.forEach(([fl, base, ph]) => { const p = fl.geometry.attributes.position; for (let k = 0; k < p.count; k++) { const x0 = base[k * 3], y0 = base[k * 3 + 1]; p.setZ(k, Math.sin(x0 * 6 - t * 5 + ph) * 0.1 * x0); } p.needsUpdate = true; });
      if (chariot.visible) waveFlag(chariot.userData.flag, chariot.userData.flagBase, t, 0.1);
      flames.forEach(F => { const fl = 0.85 + 0.15 * Math.sin(t * 17 + F.s) * Math.sin(t * 7.3 + F.s * 2); F.f.scale.y = (F.big ? 0.6 : 0.15) * fl; if (F.pl) F.pl.intensity = (F.big ? 6 : 2.2) * (0.8 + 0.2 * fl); });
      if (dust.visible) fly(dust, t, { c: cam.l.clone(), sx: 7, sz: 7, sy: 3.5, vy: 0.06, vx: 0.08 });
      K.cam.position.copy(cam.p); K.cam.up.set(cam.up ? -1 : 0, cam.up ? 0 : 1, 0); K.cam.lookAt(cam.l); K.cam.fov = cam.fov; K.cam.updateProjectionMatrix();
      R.setRenderTarget(target); R.render(S, K.cam); R.setRenderTarget(null); return HUDfn; };
    const SFX = [['bass', 0.05, 0.6], ['whoosh', F('recap', 0.3), 0.4], ['whoosh', F('recap', 0.6), 0.35], ['thud', F('fall', 0.75), 0.9], ['bass', F('fall', 0.76), 0.7], ['riser', Bt('bed'), 0.35], ['chime', F('bed', 0.5), 0.35],
      ['whoosh', F('pillow', 0.48), 0.4], ['thud', F('pillow', 0.6), 0.5], ['whoosh', F('thirst', 0.76), 0.5], ['thud', F('thirst', 0.8), 0.6], ['chime', F('water', 0.15), 0.5], ['chime', F('water', 0.5), 0.35],
      ['riser', Bt('sun'), 0.3], ['chime', F('sun', 0.7), 0.5], ['chime', Bt('ashtami') + 0.3, 0.4], ['pop', Bt('cta') + 0.6, 0.5], ['ding', Bt('cta') + 1.6, 0.5]];
    K.draw = () => {};
    const update = t => {
      let i = 0; for (let k = 0; k < N; k++) if (t >= L[k].t - XF) i = k;
      const st = L[i].t - XF; let hA, hB = null, mix = 0;
      let expA; if (i > 0 && t < st + XF * 2) { hA = renderShot(i - 1, t, rtA); expA = curExp; hB = renderShot(i, t, rtB); mix = ease(prog(t, st, st + XF * 2)); expA = lerp(expA, curExp, mix); }
      else { hA = renderShot(i, t, rtA); expA = curExp; }
      qB.material.opacity = mix;
      hud.redraw((x) => { x.clearRect(0, 0, 1080, 1920);
        if (hA) { x.save(); x.globalAlpha = 1 - mix; hA(x); x.restore(); } if (hB) { x.save(); x.globalAlpha = mix; hB(x); x.restore(); }
        const vg = x.createRadialGradient(540, 960, 600, 540, 960, 1250); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.38)'); x.fillStyle = vg; x.fillRect(0, 0, 1080, 1920);
        const bar = x.createLinearGradient(0, 1250, 0, 1920); bar.addColorStop(0, 'rgba(0,0,0,0)'); bar.addColorStop(1, 'rgba(0,0,0,0.35)'); x.fillStyle = bar; x.fillRect(0, 1250, 1080, 670);
        if (t < 0.5) { x.fillStyle = `rgba(0,0,0,${1 - t / 0.5})`; x.fillRect(0, 0, 1080, 1920); }
        if (t > D - 0.5) { x.fillStyle = `rgba(0,0,0,${(t - (D - 0.5)) / 0.5})`; x.fillRect(0, 0, 1080, 1920); } });
      R.toneMappingExposure = expA; R.render(hs, hc);
    };
    const sfx = SFX.filter(s => isFinite(s[1]));
    return { duration: D, update, shots: [{ t: [0, 1], from: { pos: [0, 2, 8], look: [0, 1, 0] } }], sfx, watermark: false, endCard: false, music: {}, capFont: 'Fredoka Light', capMarginV: 520, capSize: 64 };
  },
};
