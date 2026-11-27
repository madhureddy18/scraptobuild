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

    // strand texture for hair (soft streaks) and patterned cloth textures
    const strandTex = (base, seed) => { const t = K.canvasTex(256, 512, (x, w, h) => { x.fillStyle = base; x.fillRect(0, 0, w, h); const r = rng(seed), c = new THREE.Color(base);
      for (let i = 0; i < 520; i++) { const lx = r() * w, l = 0.15 + r() * 0.35, k = r() < 0.5 ? 1.35 : 0.7; x.strokeStyle = `rgba(${Math.min(255, c.r * 255 * k + 20)},${Math.min(255, c.g * 255 * k + 18)},${Math.min(255, c.b * 255 * k + 15)},${0.25 + r() * 0.35})`; x.lineWidth = 1 + r() * 2;
        x.beginPath(); const y0 = r() * h; x.moveTo(lx, y0); x.bezierCurveTo(lx + (r() - 0.5) * 10, y0 + h * l * 0.3, lx + (r() - 0.5) * 10, y0 + h * l * 0.7, lx + (r() - 0.5) * 6, y0 + h * l); x.stroke(); } });
      t.wrapS = t.wrapT = THREE.RepeatWrapping; return t; };
    const clothTex = (base, motif, border, seed, rep = [3, 3]) => { const t = K.canvasTex(512, 512, (x, w, h) => { x.fillStyle = base; x.fillRect(0, 0, w, h); const r = rng(seed);
        for (let i = 0; i < 1400; i++) { x.fillStyle = `rgba(0,0,0,${r() * 0.035})`; x.fillRect(r() * w, r() * h, 1 + r() * 3, 8 + r() * 30); }
        if (motif) { x.strokeStyle = motif; x.lineWidth = 3; for (let yy = 40; yy < h; yy += 80) for (let xx = (yy / 80 % 2) * 40 + 20; xx < w; xx += 80) { x.beginPath(); x.moveTo(xx, yy - 18); x.lineTo(xx + 14, yy); x.lineTo(xx, yy + 18); x.lineTo(xx - 14, yy); x.closePath(); x.stroke(); x.fillStyle = motif; x.fillRect(xx - 2, yy - 2, 4, 4); } }
        if (border) { x.fillStyle = border; x.fillRect(0, h - 34, w, 22); x.fillRect(0, 0, w, 6); x.fillStyle = '#d8a63a'; x.fillRect(0, h - 40, w, 5); x.fillRect(0, h - 10, w, 4); } });
      t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...rep); return t; };

    function makeHead(o) {
      const g = new THREE.Group(), skinM = mat(o.skin, { roughness: 0.48, emissive: new THREE.Color(o.skin).multiplyScalar(0.08) });
      const add = (geo, m, x, y, z) => { const q = new THREE.Mesh(geo, m); q.position.set(x, y, z); q.castShadow = true; g.add(q); return q; };
      // skull: longer face, defined jaw + chin; beard / stubble and soft eye-socket shading painted as vertex colour
      const sg = headShape(0.42, 72), sp = sg.attributes.position, cols = [], cS = new THREE.Color(o.skin), cB = new THREE.Color(o.beardCol || o.hair), cD = new THREE.Color(o.skin).multiplyScalar(0.72), tmp = new THREE.Color();
      for (let i = 0; i < sp.count; i++) { const x = sp.getX(i) / 0.42, y = sp.getY(i) / 0.42, z = sp.getZ(i) / 0.42; let m = 0;
        if (o.beard === 'short' || o.beard === 'long') { const yt = -0.16 + (1 - Math.max(0, z)) * 0.2; m = sm(yt + 0.06, yt - 0.1, y) * sm(-0.3, -0.05, z) * 0.92; }
        if (o.stubble) { const yt = -0.2 + (1 - Math.max(0, z)) * 0.2; m = Math.max(m, sm(yt + 0.05, yt - 0.12, y) * sm(-0.3, -0.05, z) * 0.22); }
        const sock = Math.exp(-(Math.pow((Math.abs(x) - 0.33) / 0.16, 2) + Math.pow((y - 0.12) / 0.12, 2))) * sm(0.5, 0.8, z) * 0.6;
        tmp.copy(cS).lerp(cD, sock).lerp(cB, m); cols.push(tmp.r, tmp.g, tmp.b); }
      sg.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
      add(sg, mat(0xffffff, { roughness: 0.48, vertexColors: true, emissive: new THREE.Color(o.skin).multiplyScalar(0.06) }), 0, 0, 0).scale.set(0.8, 1.12, 0.92);
      add(new THREE.SphereGeometry(0.11, 24, 16), skinM, 0, -0.33, 0.25).scale.set(1, 0.75, 0.8);          // chin
      for (const sx of [-1, 1]) { const e = add(new THREE.SphereGeometry(0.075, 24, 16), skinM, sx * 0.33, 0.0, -0.03); e.scale.set(0.38, 1.0, 0.7); }
      const ridge = add(new THREE.CapsuleGeometry(0.035, 0.26, 6, 16), skinM, 0, 0.14, 0.33); ridge.rotation.z = PI / 2; ridge.scale.z = 0.6;     // brow ridge
      // nose: long straight bridge, rounded tip, wings sunk into the cheeks
      const br = add(new THREE.SphereGeometry(0.06, 24, 18), skinM, 0, -0.01, 0.345); br.scale.set(0.5, 1.75, 0.7); br.rotation.x = 0.22;
      add(new THREE.SphereGeometry(0.036, 20, 14), skinM, 0, -0.1, 0.388).scale.set(1.05, 0.85, 0.9);
      for (const sx of [-1, 1]) add(new THREE.SphereGeometry(0.024, 16, 12), skinM, sx * 0.034, -0.108, 0.356).scale.set(1, 0.8, 0.9);
      // eyes: almond whites, brown iris, black pupil, glint; upper lid + lash line; lower lid
      const scl = mat(0xefe6dc, { roughness: 0.2 }), iris = mat(0x3a2414, { roughness: 0.12 }), pup = mat(0x050302, { roughness: 0.1 }), lidM = mat(o.skin, { roughness: 0.5 }), lashM = mat(0x140c08, { roughness: 0.7 });
      const eyes = [-1, 1].map(sx => { const e = new THREE.Group(); e.position.set(sx * 0.128, 0.05, 0.318); e.rotation.y = sx * 0.12; g.add(e);
        const s = new THREE.Mesh(new THREE.SphereGeometry(0.056, 28, 18), scl); s.scale.set(1.35, 0.6, 0.55); e.add(s);
        const ir = new THREE.Group(); ir.position.set(0, -0.003, 0.024); e.add(ir);
        const im = new THREE.Mesh(new THREE.SphereGeometry(0.027, 22, 16), iris); im.scale.set(1, 1, 0.4); ir.add(im);
        const pm = new THREE.Mesh(new THREE.SphereGeometry(0.012, 14, 10), pup); pm.position.z = 0.006; pm.scale.z = 0.4; ir.add(pm);
        const gl = new THREE.Mesh(new THREE.SphereGeometry(0.005, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffffff })); gl.position.set(0.008, 0.008, 0.013); ir.add(gl);
        const lid = new THREE.Mesh(new THREE.SphereGeometry(0.06, 28, 12, 0, TAU, 0, PI / 2), lidM); lid.scale.set(1.38, 0.66, 0.62); e.add(lid);
        const lash = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.006, 6, 28, PI), lashM); lash.scale.set(1.38, 0.66, 0.62); e.add(lash);
        const crease = new THREE.Mesh(new THREE.TorusGeometry(0.066, 0.004, 6, 24, PI * 0.8), mat(new THREE.Color(o.skin).multiplyScalar(0.7).getHex())); crease.rotation.z = PI * 0.1; crease.position.set(0, 0.012, 0.004); crease.scale.set(1.32, 0.6, 0.6); e.add(crease);
        const low = new THREE.Mesh(new THREE.TorusGeometry(0.058, 0.007, 6, 24, PI), lidM); low.rotation.z = PI; low.scale.set(1.3, 0.55, 0.6); e.add(low);
        return { e, lid, lash, ir }; });
      const browM = mat(o.browCol || o.hair, { roughness: 0.9 });
      const brows = [-1, 1].map(sx => { const b = add(new THREE.CapsuleGeometry(o.browR || 0.014, 0.12, 6, 12), browM, sx * 0.135, 0.145, 0.36); b.rotation.set(0, sx * 0.28, PI / 2 + sx * 0.08); b.scale.z = 0.7; return b; });
      // mouth: shaped lips + dark gap
      const lipM = mat(o.lip || 0x8a4436, { roughness: 0.4 });
      const up = add(new THREE.CapsuleGeometry(0.012, 0.075, 6, 12), lipM, 0, -0.196, 0.36); up.rotation.z = PI / 2; up.scale.set(1, 1, 0.8);
      for (const sx of [-1, 1]) { const pk = add(new THREE.SphereGeometry(0.014, 12, 8), lipM, sx * 0.014, -0.19, 0.366); pk.scale.set(1.3, 0.8, 0.8); }
      const lo = add(new THREE.CapsuleGeometry(0.015, 0.058, 6, 12), lipM, 0, -0.226, 0.352); lo.rotation.z = PI / 2;
      const gap = add(new THREE.SphereGeometry(0.04, 16, 10), mat(0x2a0c08), 0, -0.21, 0.355); gap.scale.set(1.0, 0.08, 0.3);
      if (o.tilak) { const tw = add(new THREE.TorusGeometry(0.03, 0.007, 6, 20, PI), mat(0xf2ede0, { roughness: 0.6 }), 0, 0.2, 0.392); tw.rotation.z = PI; tw.scale.y = 1.7;
        const tr = add(new THREE.CapsuleGeometry(0.006, 0.06, 4, 8), mat(0xc81818, { roughness: 0.5 }), 0, 0.2, 0.396); }
      const hairT = strandTex('#' + new THREE.Color(o.hair).getHexString(), (o.seed || 1) * 100 | 0);
      const hairM = mat(0xffffff, { map: hairT, roughness: 0.5 });
      const plainHair = mat(o.hair, { roughness: 0.55 });
      if (o.stache) for (const sx of [-1, 1]) { const m = add(new THREE.CapsuleGeometry(o.stache === 'thick' ? 0.022 : 0.011, o.stache === 'thick' ? 0.08 : 0.07, 6, 12), plainHair, sx * 0.042, -0.165, 0.38); m.rotation.set(0.1, sx * 0.35, PI / 2 + sx * (o.stache === 'thick' ? 0.55 : 0.18));
        if (o.stache === 'curl') { const c = add(new THREE.TorusGeometry(0.014, 0.006, 6, 12, PI * 1.3), plainHair, sx * 0.085, -0.158, 0.35); c.rotation.z = sx > 0 ? 0.3 : PI - 0.3; } }
      if (o.beard === 'long') {
        const bg = new THREE.SphereGeometry(0.3, 48, 32), bp = bg.attributes.position, v = V3(0, 0, 0);
        for (let i = 0; i < bp.count; i++) { v.fromBufferAttribute(bp, i); if (v.y < 0) { const k = -v.y / 0.3; v.x *= 1 - k * 0.55; v.z *= 1 - k * 0.4; v.y *= 1 + k * 0.3; } v.x += Math.sin(v.y * 40) * 0.006; bp.setXYZ(i, v.x, v.y, v.z); }
        bg.computeVertexNormals(); const bd = add(bg, hairM, 0, -0.42, 0.15); bd.scale.set(0.74, 1.05, 0.5);
        for (const sx of [-1, 1]) { const ch = add(new THREE.SphereGeometry(0.12, 24, 16), hairM, sx * 0.17, -0.25, 0.14); ch.scale.set(0.8, 1.05, 0.8); }
      }
      if (o.hairStyle !== 'none') {
        const Rr = 0.448, cg = new THREE.SphereGeometry(Rr, 64, 40, 0, TAU, 0, PI * 0.7), cp = cg.attributes.position, v = V3(0, 0, 0);
        for (let i = 0; i < cp.count; i++) { v.fromBufferAttribute(cp, i); const upv = v.y / Rr, fz = v.z / Rr, front = Math.max(0, fz), back = Math.max(0, -fz);
          const hl = 0.24 + Math.pow(front, 1.4) * 0.4 - back * back * 0.6; if (upv < hl) v.y = hl * Rr;
          v.multiplyScalar(1.0 + Math.max(0, upv) * 0.04); cp.setXYZ(i, v.x * 0.82, v.y * 1.1, v.z * 0.95); }
        cg.computeVertexNormals(); add(cg, hairM, 0, 0.0, -0.005);
        if (o.hairStyle === 'long') {
          const bk = add(new THREE.SphereGeometry(0.4, 40, 28), hairM, 0, -0.5, -0.2); bk.scale.set(0.88, 1.7, 0.42);
          for (const sx of [-1, 1]) { const lk = add(new THREE.CapsuleGeometry(0.055, 0.75, 8, 16), hairM, sx * 0.28, -0.62, -0.06); lk.rotation.set(-0.15, 0, sx * 0.1); }
        }
      }
      // headgear (unchanged look)
      if (o.crown === 'gold' || o.crown === 'krishna') {
        const band = add(new THREE.CylinderGeometry(0.405, 0.42, 0.13, 56, 1, true), GOLD, 0, 0.3, -0.01); band.scale.set(0.84, 1, 0.97); band.material.side = THREE.DoubleSide;
        for (const yy of [0.235, 0.365]) { const r = add(new THREE.TorusGeometry(0.41, 0.014, 10, 56), GOLD2, 0, yy, -0.01); r.rotation.x = PI / 2; r.scale.set(0.84, 0.97, 1); }
        add(new THREE.SphereGeometry(0.035, 16, 12), RUBY, 0, 0.3, 0.4).scale.z = 0.6;
        for (const sx of [-1, 1]) add(new THREE.SphereGeometry(0.022, 12, 8), PEARL, sx * 0.16, 0.3, 0.36);
        const crest = new THREE.Shape(); crest.moveTo(-0.15, 0); crest.quadraticCurveTo(-0.13, 0.16, 0, 0.27); crest.quadraticCurveTo(0.13, 0.16, 0.15, 0); crest.lineTo(-0.15, 0);
        const cr = add(new THREE.ExtrudeGeometry(crest, { depth: 0.02, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.01, bevelSegments: 2 }), GOLD, 0, 0.34, 0.35); cr.rotation.x = -0.25;
        add(new THREE.SphereGeometry(0.03, 12, 10), RUBY, 0, 0.47, 0.36).scale.z = 0.6;
        if (o.crown === 'gold') {
          const cone = add(new THREE.LatheGeometry([[0.4, 0], [0.37, 0.12], [0.3, 0.3], [0.2, 0.46], [0.1, 0.6], [0.04, 0.68], [0, 0.74]].map(([r, y]) => new THREE.Vector2(r, y)), 48), GOLD, 0, 0.36, -0.03); cone.scale.set(0.8, 1, 0.9);
          for (const [yy, rr] of [[0.5, 0.33], [0.66, 0.24], [0.82, 0.13]]) { const r = add(new THREE.TorusGeometry(rr, 0.013, 8, 40), GOLD2, 0, yy, -0.03); r.rotation.x = PI / 2; r.scale.set(0.8, 0.9, 1); }
          for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; const ri = add(new THREE.BoxGeometry(0.012, 0.36, 0.02), GOLD2, Math.sin(a) * 0.27 * 0.8, 0.58, Math.cos(a) * 0.27 * 0.9 - 0.03); ri.rotation.set(Math.cos(a) * 0.45, 0, -Math.sin(a) * 0.45); }
          add(new THREE.SphereGeometry(0.04, 16, 12), GOLD, 0, 1.12, -0.03);
        } else {
          const dome = add(new THREE.SphereGeometry(0.36, 40, 20, 0, TAU, 0, PI / 2), GOLD, 0, 0.36, -0.02); dome.scale.set(0.82, 0.55, 0.9);
          const ft = K.canvasTex(128, 512, (x, w, h) => { x.strokeStyle = '#2f7a4a'; x.lineWidth = 6; x.beginPath(); x.moveTo(w / 2, h); x.lineTo(w / 2, 60); x.stroke();
            for (let i = 0; i < 60; i++) { const yy = 80 + i * 7; x.strokeStyle = i % 2 ? '#1f6f5a' : '#3a9a6a'; x.lineWidth = 2; x.beginPath(); x.moveTo(w / 2, yy); x.lineTo(w / 2 - 50 + (i % 3) * 4, yy - 30); x.moveTo(w / 2, yy); x.lineTo(w / 2 + 50 - (i % 3) * 4, yy - 30); x.stroke(); }
            const gr = x.createRadialGradient(w / 2, 100, 4, w / 2, 100, 46); gr.addColorStop(0, '#081a5a'); gr.addColorStop(0.35, '#1a6ad0'); gr.addColorStop(0.6, '#d8b838'); gr.addColorStop(0.85, '#2a8a5a'); gr.addColorStop(1, 'rgba(30,110,80,0)'); x.fillStyle = gr; x.beginPath(); x.ellipse(w / 2, 100, 46, 56, 0, 0, TAU); x.fill(); });
          const fm = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 1.1), new THREE.MeshStandardMaterial({ map: ft, transparent: true, alphaTest: 0.2, side: THREE.DoubleSide, roughness: 0.5 }));
          fm.position.set(0.12, 0.82, -0.12); fm.rotation.set(-0.15, 0.3, -0.28); g.add(fm);
        }
      } else if (o.crown === 'helmet') {
        const h = add(new THREE.SphereGeometry(0.46, 40, 24, 0, TAU, 0, PI * 0.55), o.helmMat || mat(0x8a5a2a, { metalness: 0.7, roughness: 0.4 }), 0, 0.06, -0.01); h.scale.set(0.86, 1.08, 0.98);
        add(new THREE.ConeGeometry(0.05, 0.25, 16), GOLD2, 0, 0.6, -0.01);
        const rim = add(new THREE.TorusGeometry(0.42, 0.02, 8, 48), GOLD2, 0, 0.12, -0.01); rim.rotation.x = PI / 2; rim.scale.set(0.86, 0.98, 1);
      } else if (o.crown === 'band') {
        const r = add(new THREE.TorusGeometry(0.4, 0.016, 10, 48), GOLD, 0, 0.27, 0); r.rotation.x = PI / 2 - 0.12; r.scale.set(0.84, 0.97, 1);
        add(new THREE.SphereGeometry(0.022, 12, 10), RUBY, 0, 0.3, 0.37);
      }
      g.userData = { eyes, brows, gap, lo };
      g.update = (t, { talk = 0, close = 0, look = [0, 0], brow = 0 } = {}) => {
        const blink = ((t + (o.seed || 0)) % 3.7) < 0.12 ? 1 : 0, cl = Math.max(close, blink * (1 - close));
        eyes.forEach(E => { E.lid.rotation.x = lerp(-0.75, 1.52, cl); E.lash.rotation.x = E.lid.rotation.x + PI / 2; E.ir.visible = cl < 0.9;
          E.ir.position.x = look[0] * 0.016; E.ir.position.y = -0.003 + look[1] * 0.01; });
        brows.forEach((b, i) => { b.position.y = 0.145 + brow * 0.015; b.rotation.z = PI / 2 + (i ? 1 : -1) * (0.08 - brow * 0.12); });
        const op = clamp(talk); gap.scale.y = 0.08 + op * 0.75; lo.position.y = -0.226 - op * 0.028;
      };
      g.update(0);
      return g;
    }

    const heroes = [];
    function hero(o) {
      o = Object.assign({ skin: 0xb07650, dhoti: 0xe2b23a, sash: 0xa82418, hair: 0x15100c, crown: 'gold', hairStyle: 'long', torso: 'bare', scale: 1, headScale: 0.31, motif: null }, o);
      const M = K.model(BODY, { height: 2.15 });
      M.play('Man_Idle', 0); M.g.updateMatrixWorld(true);
      M.g.traverse(x => { if (x.isSkinnedMesh) x.visible = false; });
      const B = {}; M.g.traverse(x => { if (x.isBone) B[x.name] = x; });
      const P = n => B[n].getWorldPosition(V3(0, 0, 0));
      const hx = c => '#' + new THREE.Color(c).getHexString(), skinM = mat(o.skin, { roughness: 0.48, emissive: new THREE.Color(o.skin).multiplyScalar(0.08) });
      const dhM = mat(0xffffff, { map: clothTex(hx(o.dhoti), o.motif || hx(new THREE.Color(o.dhoti).lerp(new THREE.Color(0xffffff), 0.35)), null, (o.seed || 1) * 50 | 0, [2, 2]), roughness: 0.85, side: THREE.DoubleSide }), sashM = mat(0xffffff, { map: clothTex(hx(o.sash), null, null, 7), roughness: 0.75, side: THREE.DoubleSide }),
      uttM = mat(0xffffff, { map: clothTex(hx(o.utt || o.dhoti), o.motif || hx(new THREE.Color(o.utt || o.dhoti).lerp(new THREE.Color(0xffffff), 0.45)), hx(o.sash), 9, [1, 4]), roughness: 0.8, side: THREE.DoubleSide }), dhD = cloth(new THREE.Color(o.dhoti).multiplyScalar(0.72).getHex());
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
      if (o.sashOn !== false) {                                                   // upper cloth (uttariya): from the back waist, over the left shoulder, down the front
        const tz = tor.z, pts = [V3(cx - 0.16, legY + 0.06, tz - 0.12), V3(cx + 0.02, shY - 0.1, tz - 0.16), V3(cx + 0.13, shY + 0.05, tz - 0.09), V3(cx + 0.15, shY + 0.085, tz + 0.02), V3(cx + 0.13, shY + 0.02, tz + 0.13), V3(cx + 0.09, shY - 0.2, tz + 0.165), V3(cx + 0.05, legY + 0.04, tz + 0.15)];
        const curve = new THREE.CatmullRomCurve3(pts), seg = 60, pos = [], uv = [], idx = [], W = 0.05, TH = 0.01;
        for (let i = 0; i <= seg; i++) { const u = i / seg, c = curve.getPointAt(u), tn = curve.getTangentAt(u), out = V3(c.x - cx, 0, c.z - tz).normalize(); if (c.y > shY) out.lerp(V3(0, 1, 0), 0.7).normalize();
          const side = V3(0, 0, 0).crossVectors(tn, out).normalize();
          for (const [a, b] of [[-1, 1], [1, 1], [1, -1], [-1, -1]]) { const q = c.clone().addScaledVector(side, a * W).addScaledVector(out, b * TH); pos.push(q.x, q.y, q.z); uv.push(a < 0 ? 0 : 1, u * 3); } }
        for (let i = 0; i < seg; i++) for (let k = 0; k < 4; k++) { const a = i * 4 + k, b = i * 4 + (k + 1) % 4, c2 = a + 4, d = b + 4; idx.push(a, c2, b, b, c2, d); }
        const gg = new THREE.BufferGeometry(); gg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); gg.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); gg.setIndex(idx); gg.computeVertexNormals();
        pin(new THREE.Mesh(gg, uttM), 'Torso'); }
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
        const palm = K.segment(wr, wr.clone().addScaledVector(hdir, 0.75), 0.038, 0.032, skinM); palm.scale.x = 1.25; hand.add(palm);
        const hn = hdir.clone().normalize(), across = V3(0, 0, 1).cross(hn).normalize();
        for (let f = 0; f < 4; f++) { const k0 = wr.clone().addScaledVector(hdir, 0.8).addScaledVector(across, (f - 1.5) * 0.019); hand.add(K.segment(k0, k0.clone().addScaledVector(hn, hl * (f === 0 || f === 3 ? 0.5 : 0.62)).add(V3(0, 0, 0.012)), 0.0105, 0.0085, skinM, 12)); }
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
    const AR = hero({ skin: 0xc28654, dhoti: 0xe8b02c, sash: 0xb3241a, crown: 'gold', stache: 'curl', stubble: true, tilak: true, seed: 1.9 });
    const KR = hero({ skin: 0x5a80c4, dhoti: 0xf0c030, sash: 0xd04a1a, crown: 'krishna', lip: 0x7a3a4a, tilak: true, seed: 2.6 });
    const YU = hero({ skin: 0xb07a52, dhoti: 0xf3ead6, sash: 0x7a1830, crown: 'gold', beard: 'short', stache: 'thin', tilak: true, utt: 0x7a1830, seed: 0.3 });
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

    const groupOf = () => { const g = new THREE.Group(); S.add(g); return g; };
    const shadowAll = g => g.traverse(q => { if (q.isMesh) { q.castShadow = true; q.receiveShadow = true; } });
    // ================================================================ world: storybook sky, soft clouds, green meadow, round trees, camp tents
    const SKIES = {
      gold: { stops: [[0, '#2a64c8'], [0.28, '#4f8fdc'], [0.42, '#9ccaf2'], [0.5, '#e2f2ff'], [1, '#5f8f3a']], sun: [0.46, 0.27], clouds: 1, fog: 0xcfe4f4, hemi: [0xdcecff, 0x5f9a3a, 1.25], key: [0xfff2d8, 2.5], dir: [-0.45, 0.6, -0.65], exp: 1.0 },
      night: { stops: [[0, '#05081f'], [0.32, '#0e1546'], [0.46, '#232a66'], [0.5, '#2c3470'], [1, '#0a0c18']], stars: 1, moon: [0.42, 0.62], fog: 0x141c46, hemi: [0x4a5aa8, 0x101a14, 0.55], key: [0x9ab0ff, 1.1], dir: [0.3, 0.7, -0.6], exp: 1.15 },
      dawn: { stops: [[0, '#4f7fc8'], [0.3, '#a6aee0'], [0.43, '#ffc2bc'], [0.5, '#ffe8cc'], [1, '#6f9a48']], sun: [0.5, 0.42], clouds: 0.8, cloudTint: '#ffe2dc', fog: 0xf2dcd4, hemi: [0xe8dcff, 0x7a9a5a, 1.1], key: [0xffdcc4, 2.4], dir: [0.0, 0.25, -1], exp: 1.02 },
      blue: { stops: [[0, '#0a1440'], [0.34, '#26357a'], [0.45, '#6a62a2'], [0.5, '#e09a7a'], [1, '#141a1a']], stars: 0.5, fog: 0x2e3264, hemi: [0x5a6ab0, 0x18221a, 0.55], key: [0x8a9aff, 0.6], dir: [0.4, 0.5, -0.7], exp: 1.2 },
    };
    const skyTex = {};
    for (const k in SKIES) { const s = SKIES[k]; skyTex[k] = K.canvasTex(2048, 1024, (x, w, h) => {
      const g = x.createLinearGradient(0, 0, 0, h); s.stops.forEach(([o, c]) => g.addColorStop(o, c)); x.fillStyle = g; x.fillRect(0, 0, w, h);
      const r = rng(k.length * 7 + 3);
      if (s.stars) for (let i = 0; i < 1600 * s.stars; i++) { const yy = Math.pow(r(), 1.5) * h * 0.47, a = 0.3 + r() * 0.7; x.fillStyle = `rgba(255,255,255,${a})`; x.fillRect(r() * w, yy, r() < 0.06 ? 3 : 1.5, r() < 0.06 ? 3 : 1.5); }
      if (s.moon) { const mx = s.moon[0] * w, my = s.moon[1] * h * 0.5; const gg = x.createRadialGradient(mx, my, 4, mx, my, 120); gg.addColorStop(0, 'rgba(230,236,255,0.9)'); gg.addColorStop(0.2, 'rgba(180,200,255,0.25)'); gg.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = gg; x.fillRect(mx - 120, my - 120, 240, 240); x.fillStyle = '#f2f4ff'; x.beginPath(); x.arc(mx, my, 16, 0, TAU); x.fill(); }
      if (s.clouds) for (let i = 0; i < 34; i++) { const cx = r() * w, cy = h * (0.22 + r() * 0.23), rw = 40 + r() * 90, n = 5 + (r() * 5 | 0), a = s.clouds;
        for (let j = 0; j < n; j++) { const ox = (j - n / 2) * rw * 0.55 + (r() - 0.5) * 20, oy = -Math.sin(j / (n - 1) * PI) * rw * 0.35, rr = rw * (0.45 + r() * 0.35);
          x.fillStyle = `rgba(160,185,215,${0.55 * a})`; x.beginPath(); x.ellipse(cx + ox, cy + oy + rr * 0.18, rr, rr * 0.62, 0, 0, TAU); x.fill(); }
        for (let j = 0; j < n; j++) { const ox = (j - n / 2) * rw * 0.55, oy = -Math.sin(j / (n - 1) * PI) * rw * 0.35, rr = rw * (0.42 + 0.3 * Math.sin(j / (n - 1) * PI));
          x.fillStyle = s.cloudTint || '#ffffff'; x.globalAlpha = 0.92 * a; x.beginPath(); x.ellipse(cx + ox, cy + oy, rr, rr * 0.6, 0, 0, TAU); x.fill(); x.globalAlpha = 1; } }
      if (s.sun) { const sx = s.sun[0] * w, sy = s.sun[1] * h + h * 0.1; x.save(); x.translate(sx, sy); for (let i = 0; i < 16; i++) { x.rotate(TAU / 16); const gg = x.createLinearGradient(0, 0, 0, 420); gg.addColorStop(0, 'rgba(255,255,240,0.35)'); gg.addColorStop(1, 'rgba(255,255,240,0)'); x.fillStyle = gg; x.beginPath(); x.moveTo(-10, 0); x.lineTo(10, 0); x.lineTo(30, 420); x.lineTo(-30, 420); x.fill(); } x.restore();
        const gg = x.createRadialGradient(sx, sy, 2, sx, sy, 230); gg.addColorStop(0, 'rgba(255,255,255,1)'); gg.addColorStop(0.12, 'rgba(255,255,240,0.95)'); gg.addColorStop(0.35, 'rgba(255,250,220,0.35)'); gg.addColorStop(1, 'rgba(255,250,220,0)'); x.fillStyle = gg; x.fillRect(sx - 230, sy - 230, 460, 460); }
    }); skyTex[k].mapping = THREE.EquirectangularReflectionMapping; }
    const skyMat = new THREE.MeshBasicMaterial({ map: skyTex.gold, side: THREE.BackSide, fog: false, depthWrite: false });
    const sky = new THREE.Mesh(new THREE.SphereGeometry(400, 48, 32), skyMat); S.add(sky);
    const skyMat2 = new THREE.MeshBasicMaterial({ map: skyTex.night, side: THREE.BackSide, fog: false, transparent: true, opacity: 0, depthWrite: false });
    const sky2 = new THREE.Mesh(new THREE.SphereGeometry(399, 48, 32), skyMat2); S.add(sky2);
    const hillRing = (rad, h, seed, col, alpha) => { const tx = K.canvasTex(2048, 256, (x, w, hh) => { const r = rng(seed); x.clearRect(0, 0, w, hh); x.fillStyle = col; x.beginPath(); x.moveTo(0, hh);
        for (let i = 0; i <= 256; i++) { const xx = i / 256 * w, y = hh * (0.62 - 0.22 * (0.5 + 0.5 * Math.sin(i * 0.09 + seed)) * (0.5 + 0.5 * Math.sin(i * 0.027 + seed * 2)) - r() * 0.015); x.lineTo(xx, y); }
        x.lineTo(w, hh); x.closePath(); x.fill(); });
      tx.wrapS = THREE.RepeatWrapping; const m = new THREE.Mesh(new THREE.CylinderGeometry(rad, rad, h, 96, 1, true), new THREE.MeshBasicMaterial({ map: tx, transparent: true, side: THREE.BackSide, opacity: alpha, depthWrite: false, fog: true }));
      m.position.y = h / 2 - 2; S.add(m); return m; };
    const hills1 = hillRing(230, 40, 4, '#7f9fb4', 0.85), hills2 = hillRing(170, 26, 9, '#6f9a6a', 0.9);
    // meadow ground
    const gTex = K.canvasTex(1024, 1024, (x, w, h) => { x.fillStyle = '#7cb444'; x.fillRect(0, 0, w, h); const r = rng(5);
      for (let i = 0; i < 1600; i++) { const c = r(); x.fillStyle = c < 0.5 ? `rgba(60,110,30,${0.05 + r() * 0.08})` : `rgba(170,215,110,${0.05 + r() * 0.08})`; x.beginPath(); x.ellipse(r() * w, r() * h, 10 + r() * 60, 6 + r() * 30, r() * PI, 0, TAU); x.fill(); }
      for (let i = 0; i < 2400; i++) { x.strokeStyle = `rgba(${50 + r() * 40},${100 + r() * 50},${30 + r() * 20},0.45)`; x.lineWidth = 1.5; const px = r() * w, py = r() * h; x.beginPath(); x.moveTo(px, py); x.lineTo(px + (r() - 0.5) * 4, py - 6 - r() * 6); x.stroke(); } });
    gTex.wrapS = gTex.wrapT = THREE.RepeatWrapping; gTex.repeat.set(70, 70);
    const groundM = mat(0xffffff, { map: gTex, roughness: 1 });
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(800, 800, 1, 1), groundM); ground.rotation.x = -PI / 2; ground.receiveShadow = true; S.add(ground);
    // grass tufts (instanced blades)
    { const r = rng(77), n = 9000, blade = new THREE.ConeGeometry(0.014, 0.16, 4); blade.translate(0, 0.08, 0);
      const im = new THREE.InstancedMesh(blade, mat(0x4f8f2c, { roughness: 1 }), n), m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
      for (let i = 0; i < n; i++) { const c = Math.floor(i / 5), cr = rng(c * 13 + 7), a = cr() * TAU, d = 0.8 + Math.pow(cr(), 0.6) * 22, cxp = Math.cos(a) * d, czp = Math.sin(a) * d;
        e.set((r() - 0.5) * 0.6, r() * TAU, (r() - 0.5) * 0.6); q.setFromEuler(e); const s = 0.7 + r() * 0.8; m4.compose(V3(cxp + (r() - 0.5) * 0.12, 0, czp + (r() - 0.5) * 0.12), q, V3(s, s, s)); im.setMatrixAt(i, m4); }
      im.receiveShadow = true; S.add(im); }
    // round "lollipop" trees: rings of them around the field + a few near ones
    const treeSpots = [];
    { const r = rng(91); for (let i = 0; i < 260; i++) { const a = r() * TAU, d = 26 + r() * 24; treeSpots.push([Math.cos(a) * d, Math.sin(a) * d, 1.0 + r() * 0.5]); }
      for (let i = 0; i < 160; i++) { const a = r() * TAU, d = 52 + r() * 25; treeSpots.push([Math.cos(a) * d, Math.sin(a) * d, 1.2 + r() * 0.6]); }
      const trunkG = new THREE.CylinderGeometry(0.11, 0.16, 1, 10); trunkG.translate(0, 0.5, 0); const blobG = new THREE.SphereGeometry(1, 20, 14);
      const nb = 6, trunks = new THREE.InstancedMesh(trunkG, mat(0x6a4a2a), treeSpots.length), blobs = new THREE.InstancedMesh(blobG, mat(0xffffff, { roughness: 0.9 }), treeSpots.length * nb);
      const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), col = new THREE.Color();
      treeSpots.forEach(([x, z, s], i) => { const th = 2.4 * s; m4.compose(V3(x, 0, z), q, V3(s, th, s)); trunks.setMatrixAt(i, m4);
        for (let j = 0; j < nb; j++) { const a = j / nb * TAU + i, rr = j === 0 ? 0 : 0.75 * s, y = th + 0.6 * s + (j === 0 ? 0.55 * s : (r() - 0.3) * 0.5 * s), bs = (j === 0 ? 1.05 : 0.8 + r() * 0.25) * s;
          m4.compose(V3(x + Math.cos(a) * rr, y, z + Math.sin(a) * rr), q, V3(bs, bs * 0.95, bs)); blobs.setMatrixAt(i * nb + j, m4); col.setHSL(0.27 + r() * 0.05, 0.5 + r() * 0.15, 0.32 + r() * 0.1); blobs.setColorAt(i * nb + j, col); } });
      trunks.castShadow = blobs.castShadow = true; trunks.receiveShadow = blobs.receiveShadow = true; S.add(trunks, blobs); }
    // camp tents (white, purple roofs, orange bunting)
    const tentTex = K.canvasTex(512, 128, (x, w, h) => { x.fillStyle = '#f6f2ea'; x.fillRect(0, 0, w, h); x.fillStyle = '#7a3a8a'; x.fillRect(0, 22, w, 14); x.fillStyle = '#e0622a'; for (let i = 0; i < 32; i++) { x.beginPath(); x.moveTo(i * 16, 36); x.lineTo(i * 16 + 16, 36); x.lineTo(i * 16 + 8, 56); x.fill(); } });
    tentTex.wrapS = THREE.RepeatWrapping; tentTex.repeat.x = 3;
    const roofTex = K.canvasTex(512, 128, (x, w, h) => { x.fillStyle = '#f6f2ea'; x.fillRect(0, 0, w, h); x.fillStyle = '#7a3a8a'; for (let i = 0; i < 16; i++) x.fillRect(i * 32, 0, 12, h); });
    const tents = groupOf();
    [[-13, -16], [-17, -12], [-9, -20], [-20, -17], [12, -19], [16, -14], [20, -20], [-24, -9], [24, -10]].forEach(([x, z], i) => { const g = new THREE.Group(); g.position.set(x, 0, z); g.scale.setScalar(0.9 + (i % 3) * 0.15);
      const wall = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 1.3, 32, 1, true), mat(0xffffff, { map: tentTex, side: THREE.DoubleSide })); wall.position.y = 0.65; g.add(wall);
      const roof = new THREE.Mesh(new THREE.ConeGeometry(1.75, 1.1, 32), mat(0xffffff, { map: roofTex })); roof.position.y = 1.85; g.add(roof);
      const fp = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.8, 6), mat(0x6a4a2a)); fp.position.y = 2.7; g.add(fp);
      const fl = new THREE.Mesh(new THREE.PlaneGeometry(0.45, 0.25), mat(0x8a3aa0, { side: THREE.DoubleSide })); fl.position.set(0.23, 2.95, 0); g.add(fl); tents.add(g); });
    shadowAll(tents);
    // lights
    const hemi = new THREE.HemisphereLight(0xdcecff, 0x5f9a3a, 1.25); S.add(hemi);
    const key = new THREE.DirectionalLight(0xfff2d8, 2.5); key.castShadow = true; key.shadow.mapSize.set(2048, 2048); key.shadow.bias = -0.0004; key.shadow.normalBias = 0.02;
    Object.assign(key.shadow.camera, { left: -9, right: 9, top: 9, bottom: -9, near: 1, far: 120 }); S.add(key); S.add(key.target);
    S.fog = new THREE.Fog(0xcfe4f4, 30, 230);
    let curSky = 'gold';
    const setSky = (k, focus = V3(0, 0, 0), k2 = null, mix = 0) => { const s = SKIES[k]; curSky = k; skyMat.map = skyTex[k]; skyMat.needsUpdate = true;
      const s2 = k2 ? SKIES[k2] : s; skyMat2.map = skyTex[k2 || k]; skyMat2.opacity = k2 ? mix : 0; skyMat2.needsUpdate = true;
      const c = (a, b) => new THREE.Color(a).lerp(new THREE.Color(b), k2 ? mix : 0);
      S.fog.color.copy(c(s.fog, s2.fog)); hemi.color.copy(c(s.hemi[0], s2.hemi[0])); hemi.groundColor.copy(c(s.hemi[1], s2.hemi[1])); hemi.intensity = lerp(s.hemi[2], s2.hemi[2], k2 ? mix : 0);
      key.color.copy(c(s.key[0], s2.key[0])); key.intensity = lerp(s.key[1], s2.key[1], k2 ? mix : 0);
      const d = V3(...s.dir).lerp(V3(...s2.dir), k2 ? mix : 0).normalize();
      key.position.copy(focus).addScaledVector(d, 40); key.target.position.copy(focus); curExp = lerp(s.exp, s2.exp, k2 ? mix : 0); };

    // ================================================================ props
    // chariot (Bhishma's palm-tree banner)
    const wheel = (r = 0.75) => { const g = new THREE.Group(); const wood = mat(0x7a4a22, { roughness: 0.6 });
      const rim = new THREE.Mesh(new THREE.TorusGeometry(r, 0.06, 14, 64), GOLD); g.add(rim); const rim2 = new THREE.Mesh(new THREE.TorusGeometry(r * 0.93, 0.035, 10, 64), wood); g.add(rim2);
      for (let i = 0; i < 12; i++) { const sp = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.03, r, 10), wood); sp.position.set(Math.cos(i * TAU / 12) * r / 2, Math.sin(i * TAU / 12) * r / 2, 0); sp.rotation.z = i * TAU / 12 - PI / 2; g.add(sp); }
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.22, 24), GOLD); hub.rotation.x = PI / 2; g.add(hub);
      const hc = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 12), RUBY); hc.position.z = 0.12; g.add(hc); return g; };
    const chariot = groupOf(); const horseLegs = [];
    { const red = mat(0xb01c22, { roughness: 0.55 }), wood = mat(0x7a4a22, { roughness: 0.6 });
      const panelTex = K.canvasTex(256, 128, (x, w, h) => { x.fillStyle = '#e0a838'; x.fillRect(0, 0, w, h); x.fillStyle = '#b81c24'; [[16, 20, 100, 88], [140, 20, 100, 88]].forEach(([a, b, c, d]) => x.fillRect(a, b, c, d));
        x.fillStyle = '#f2c84a'; for (const cx of [66, 190]) { for (let i = 0; i < 8; i++) { x.beginPath(); x.ellipse(cx + Math.cos(i * PI / 4) * 16, 64 + Math.sin(i * PI / 4) * 16, 9, 5, i * PI / 4, 0, TAU); x.fill(); } x.fillStyle = '#1e9a52'; x.beginPath(); x.arc(cx, 64, 9, 0, TAU); x.fill(); x.fillStyle = '#f2c84a'; } });
      const pM = mat(0xffffff, { map: panelTex, roughness: 0.5 });
      const base = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.18, 1.3), GOLD); base.position.y = 0.92; chariot.add(base);
      const front = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.7, 0.08), [GOLD, GOLD, GOLD, GOLD, pM, pM]); front.position.set(0, 1.35, 0.62); chariot.add(front);
      const trimF = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.8, 12), GOLD); trimF.rotation.z = PI / 2; trimF.position.set(0, 1.72, 0.62); chariot.add(trimF);
      for (const sx of [-1, 1]) { const side = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.5, 1.3), [pM, pM, GOLD, GOLD, GOLD, GOLD]); side.position.set(sx * 0.85, 1.25, 0); chariot.add(side); const ts = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 1.36, 12), GOLD); ts.rotation.x = PI / 2; ts.position.set(sx * 0.85, 1.52, 0); chariot.add(ts);
        const w = wheel(0.82); w.rotation.y = PI / 2; w.position.set(sx * 1.02, 0.82, -0.05); chariot.add(w); }
      // umbrella canopy on four gold posts
      for (const [px, pz] of [[-0.75, -0.55], [0.75, -0.55], [-0.75, 0.55], [0.75, 0.55]]) { const po = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.9, 10), GOLD); po.position.set(px, 1.95, pz); chariot.add(po); }
      const domeTex = K.canvasTex(512, 256, (x, w, h) => { for (let i = 0; i < 16; i++) { x.fillStyle = i % 2 ? '#e8b23a' : '#f2c84a'; x.fillRect(i * 32, 0, 32, h); } x.fillStyle = '#c41e28'; x.fillRect(0, h - 40, w, 40); });
      const dome = new THREE.Mesh(new THREE.SphereGeometry(1.15, 40, 16, 0, TAU, 0, PI / 2), mat(0xffffff, { map: domeTex, roughness: 0.5, side: THREE.DoubleSide })); dome.scale.set(1, 0.5, 1); dome.position.y = 2.9; chariot.add(dome);
      const valTex = K.canvasTex(512, 64, (x, w, h) => { x.fillStyle = '#c41e28'; x.fillRect(0, 0, w, h); x.fillStyle = '#f6e6c8'; for (let i = 0; i < 40; i++) { x.beginPath(); x.arc(i * 12.8 + 6, 48, 4, 0, TAU); x.fill(); } x.fillStyle = '#f2c84a'; x.fillRect(0, 0, w, 10); });
      const val = new THREE.Mesh(new THREE.CylinderGeometry(1.16, 1.16, 0.28, 48, 1, true), mat(0xffffff, { map: valTex, side: THREE.DoubleSide })); val.position.y = 2.78; chariot.add(val);
      const fin = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 12), GOLD); fin.position.y = 3.5; chariot.add(fin);
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, 4.4, 12), wood); pole.position.set(-0.85, 3.0, -0.55); chariot.add(pole);
      const ft = K.canvasTex(256, 160, (x, w, h) => { x.fillStyle = '#f4ecd8'; x.fillRect(0, 0, w, h); x.fillStyle = '#c89a3a'; x.fillRect(0, 0, w, 10); x.fillRect(0, h - 10, w, 10);
        x.strokeStyle = '#5a3a1a'; x.lineWidth = 8; x.beginPath(); x.moveTo(128, 140); x.quadraticCurveTo(120, 90, 130, 50); x.stroke(); x.fillStyle = '#3a6a2a';
        for (let i = 0; i < 7; i++) { x.save(); x.translate(130, 50); x.rotate(-PI / 2 + (i - 3) * 0.5); x.beginPath(); x.ellipse(28, 0, 30, 8, 0, 0, TAU); x.fill(); x.restore(); } });
      const flagG = new THREE.PlaneGeometry(1.2, 0.75, 16, 4); flagG.translate(0.6, 0, 0); const flag = new THREE.Mesh(flagG, new THREE.MeshStandardMaterial({ map: ft, side: THREE.DoubleSide, roughness: 0.8 })); flag.position.set(-0.85, 4.8, -0.55); chariot.add(flag); chariot.userData.flag = flag; chariot.userData.flagBase = flagG.attributes.position.array.slice();
      // yoke pole + two white horses with red harness
      const yk = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.6, 10), wood); yk.rotation.x = PI / 2; yk.position.set(0, 1.0, 1.9); chariot.add(yk);
      const white = mat(0xf6f4f0, { roughness: 0.6 }), mane = mat(0xe8e2d6, { roughness: 0.8 }), harness = mat(0xc41e28, { roughness: 0.5 }), hoof = mat(0x3a3a3a);
      for (const hx of [-0.42, 0.42]) { const h = new THREE.Group(); h.position.set(hx, 0, 2.9); chariot.add(h);
        const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.26, 0.85, 8, 20), white); body.rotation.x = PI / 2; body.position.y = 1.15; h.add(body);
        const neck = new THREE.Mesh(new THREE.CapsuleGeometry(0.15, 0.5, 8, 16), white); neck.position.set(0, 1.55, 0.62); neck.rotation.x = 0.6; h.add(neck);
        const head = new THREE.Mesh(new THREE.CapsuleGeometry(0.11, 0.38, 8, 16), white); head.position.set(0, 1.78, 0.92); head.rotation.x = 1.2; h.add(head);
        for (const ex of [-0.06, 0.06]) { const ear = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.12, 8), white); ear.position.set(ex, 1.98, 0.8); h.add(ear);
          const eye = new THREE.Mesh(new THREE.SphereGeometry(0.022, 10, 8), mat(0x1a1410)); eye.position.set(ex * 1.7, 1.84, 0.92); h.add(eye); }
        const mn = new THREE.Mesh(new THREE.CapsuleGeometry(0.05, 0.5, 6, 12), mane); mn.position.set(0, 1.68, 0.5); mn.rotation.x = 0.6; h.add(mn);
        const tail = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.6, 12), mane); tail.position.set(0, 1.0, -0.78); tail.rotation.x = -0.5; h.add(tail);
        const strap = new THREE.Mesh(new THREE.TorusGeometry(0.27, 0.035, 8, 24), harness); strap.position.set(0, 1.15, 0.3); h.add(strap);
        const blanket = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.04, 0.5), harness); blanket.position.set(0, 1.42, -0.05); h.add(blanket);
        for (const [lx, lz] of [[-0.14, 0.42], [0.14, 0.42], [-0.14, -0.42], [0.14, -0.42]]) { const lg = new THREE.Group(); lg.position.set(lx, 1.0, lz); h.add(lg);
          const up = new THREE.Mesh(new THREE.CapsuleGeometry(0.055, 0.42, 6, 12), white); up.position.y = -0.3; lg.add(up);
          const hf = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.08, 12), hoof); hf.position.y = -0.62; lg.add(hf); horseLegs.push(lg); } }
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
    const label = (x, s, X, Y, size, col, a = 1, font = 'EB Garamond', w = '400', sp = 0, it = false) => { if (a <= 0) return; x.save(); x.globalAlpha = a; x.font = `${it ? 'italic ' : ''}${w} ${size}px "${font}"`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = col;
      x.shadowColor = 'rgba(0,0,0,0.55)'; x.shadowBlur = 14; if (sp && x.letterSpacing !== undefined) x.letterSpacing = sp + 'px'; x.fillText(s, X, Y); x.restore(); };
    const tag = (x, s, a, sub) => { if (a <= 0) return; label(x, s, 540, 290, 34, '#f2d79a', a, 'EB Garamond', '500', 5); x.save(); x.globalAlpha = a * 0.8; x.fillStyle = '#e8c46a'; x.fillRect(440, 318, 200, 2); x.restore(); if (sub) label(x, sub, 540, 352, 34, '#ffffff', a, 'EB Garamond', '400', 0, true); };
    const pill = (x, s, a) => { if (a <= 0) return; x.save(); x.globalAlpha = a; x.font = '500 28px "EB Garamond"'; if (x.letterSpacing !== undefined) x.letterSpacing = '3px'; const w = x.measureText(s).width + 36; x.fillStyle = 'rgba(28,22,12,0.82)'; K.rrect(x, 540 - w / 2, 1452, w, 44, 6); x.fill();
      x.fillStyle = '#efd9a6'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(s, 540, 1476); x.restore(); };
    const SRC = { recap: 'BHEESHMA PARVA', fall: 'BHEESHMA PARVA', bed: 'BHEESHMA PARVA', stop: 'BHEESHMA PARVA', pillow: 'BHEESHMA PARVA', thirst: 'BHEESHMA PARVA', water: 'BHEESHMA PARVA', wait: 'BHEESHMA PARVA', days: 'SHANTI PARVA', teach: 'SHANTI PARVA', sun: 'ANUSHAASANA PARVA', ashtami: 'ANUSHAASANA PARVA', source: 'MAHABHARATAM' };

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
      recap: (t, u) => { setSky('gold', V3(0, 0, -3)); [chariot, banners, debris, chestArrows, ...flying].forEach(o => o.visible = true); chariot.position.set(0.2, 0, -9); chariot.rotation.y = -1.3;
        place(BH, 0.3, 0.95, -9.1, 0.35); pose(BH, 'Man_Idle', t * 0.8, { UpperArmL: [0, 0, 0.2], Neck: [0.1, 0, 0] }); BH.head.update(t, { close: 0.2 });
        BH.root.updateMatrixWorld(true); chestArrows.position.copy(BH.B.Torso.getWorldPosition(V3(0, 0, 0))); chestArrows.quaternion.copy(BH.root.quaternion); chestArrows.scale.setScalar(K.ease(u));
        place(SK, 0.5, 0, 1.4, PI + 0.1); pose(SK, 'Man_Idle', t + 1, ARMS_BOW(0.4)); SK.head.update(t, {});
        place(AR, 1.2, 0, 3.4, PI + 0.06); pose(AR, 'Man_Idle', t, ARMS_BOW(0.5 + 0.5 * Math.abs(Math.sin(u * 7)))); AR.head.update(t, { brow: -0.6 });
        flying.forEach((a, i) => { const k = ((u * 2.4 + i / flying.length) % 1); const from = V3(1.1, 1.75, 2.8), to = V3(0.3 + (i - 2.5) * 0.08, 2.0, -8.9); a.position.copy(from.clone().lerp(to, k)); a.position.y += Math.sin(k * PI) * 0.8; a.lookAt(to); a.rotateX(-PI / 2); a.visible = k > 0.04 && k < 0.96; });
        C([1.05, 1.75, 5.3], [0.85, 1.8, 4.7], [0.0, 1.6, -9], [0.1, 1.7, -9], u, 32);
        HUDfn = x => { const a = 1 - clamp((u - 0.75) * 5); label(x, 'Ampashayya', 540, 300, 76, '#ffffff', a, 'EB Garamond', '600'); label(x, 'BHEESHMUDU  ·  PART 3 / 3', 540, 372, 30, '#f2d79a', a, 'EB Garamond', '500', 4); }; },
      fall: (t, u) => { setSky('gold', V3(0, 0, -9)); [chariot, banners, debris, burst, chestArrows].forEach(o => o.visible = true); chariot.position.set(0.2, 0, -9); chariot.rotation.y = -1.3;
        const k = K.easeIn(clamp((u - 0.2) / 0.5));
        place(BH, 0.3, 0.95, -9.1, 0.35); BH.root.rotation.set(-k * 1.5, 0.35, 0, 'YXZ'); BH.root.position.set(0.3 - k * 0.4, 0.95 - k * 0.85, -9.1 - k * 1.0);
        pose(BH, 'Man_Idle', t, { UpperArmL: [0, 0, -0.9 * k], UpperArmR: [0, 0, -0.9 * k], Neck: [-0.4 * k, 0, 0] }); BH.head.update(t, { close: k * 0.7, brow: 1 - k });
        BH.root.updateMatrixWorld(true); chestArrows.position.copy(BH.B.Torso.getWorldPosition(V3(0, 0, 0))); chestArrows.quaternion.copy(BH.root.quaternion);
        burst.visible = u > 0.68; fly(burst, (u - 0.68) * 6, { c: V3(-0.1, 0, -10.2), sx: 2 + (u - 0.68) * 6, sz: 2, sy: 1.0, vy: 0.3 });
        C([2.5, 0.7, -5.0], [2.2, 0.6, -5.6], [0.2, 2.0, -9.2], [0.0, 1.0, -9.8], u, 36); },
      bed: (t, u) => { setSky('gold'); [bed, banners, debris].forEach(o => o.visible = true); lieBH(t, { headDrop: 1, close: 0.45 });
        C([HP.x + 2.6, 1.35, 1.9], [HP.x + 2.1, 1.15, 1.5], [HP.x + 0.4, 0.6, 0], [HP.x + 0.2, 0.62, 0], u, 34);
        HUDfn = x => tag(x, 'SHARA SHAYYA', K.pulse(u, 0.05, 0.9), 'The bed of arrows'); },
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
        HUDfn = x => tag(x, 'UTTARAYANAM', K.pulse(u, 0.35, 0.65), 'When the sun turns north'); },
      days: (t, u) => { const cyc = (u * 2.6) % 1, nightness = clamp(Math.sin(cyc * TAU) * 1.4 + 0.5);
        setSky('gold', V3(0, 0, 0), 'night', nightness); [bed, banners, debris, pillow].forEach(o => o.visible = true); lieBH(t, { close: 0.1 }); pillow.position.set(HP.x + 1.32, 0, 0);
        stars.visible = true; stars.material.opacity = nightness; fly(stars, t, { c: V3(0, 6, 0), sx: 40, sz: 40, sy: 10, vy: 0 });
        const a = -0.6 + u * 1.3; C([Math.sin(a) * 5.5, 2.6, Math.cos(a) * 5.5], [Math.sin(a + 0.3) * 5.0, 2.3, Math.cos(a + 0.3) * 5.0], [0, 0.5, 0], [0, 0.5, 0], u, 34, x => x);
        HUDfn = x => { label(x, String(Math.min(58, Math.floor(eo(clamp(u * 1.05)) * 58))), 540, 520, 200, '#fff4d8', eo(clamp(u * 4)), 'EB Garamond', '700'); label(x, 'RAATHRULU', 540, 650, 40, '#f0e2c0', eo(clamp(u * 4)), 'EB Garamond', '700', 8); }; },
      teach: (t, u) => { setSky('night', V3(0, 0, 0)); [bed, nightProps, debris, pillow].forEach(o => o.visible = true); pillow.position.set(HP.x + 1.32, 0, 0); key.intensity = 0.5; hemi.intensity = 0.35;
        lieBH(t, { talk: narr(t) * 0.8, close: 0.1, look: [0.3, -0.2] });
        place(YU, HP.x + 0.35, 0, 0.95, PI); pose(YU, 'Man_Sitting', 0.6, { Neck: [0.3, 0, 0], Torso: [0.2, 0, 0] }); YU.root.position.y = -0.05; YU.head.update(t, { close: 0.2 });
        place(KR, HP.x + 1.3, 0, 1.55, PI + 0.4); pose(KR, 'Man_Idle', t, { Neck: [0.3, 0, 0] }); KR.head.update(t, { look: [0, -0.4] });
        C([HP.x - 0.6, 1.6, -2.0], [HP.x - 0.45, 1.45, -1.7], [HP.x + 0.25, 0.82, 0.5], [HP.x + 0.25, 0.82, 0.5], u, 34);
        HUDfn = x => tag(x, 'RAAJADHARMAM', K.pulse(u, 0.05, 0.6), 'Kurukshetra, at night'); },
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
        HUDfn = x => { label(x, 'MAHABHARATAM', 540, 360, 64, '#f6e2b0', eo(clamp(u * 3)), 'EB Garamond', '700', 4); label(x, 'Bheeshma Parva  ·  Anushaasana Parva', 540, 440, 38, '#f0e6d0', eo(clamp((u - 0.2) * 3)), 'EB Garamond', '400'); }; },
      cta: (t, u) => { setSky('night', V3(0, 0, 0)); [bed, pillow, nightProps].forEach(o => o.visible = true); pillow.position.set(-0.78 + 1.32, 0, 0); key.intensity = 0.35; hemi.intensity = 0.4;
        C([2.2, 3.2, 3.0], [1.9, 2.9, 2.6], [-0.1, 0.4, 0], [-0.1, 0.45, 0], u, 30);
        HUDfn = x => { const a = eo(clamp(u * 2.5));
          let g = x.createLinearGradient(0, 0, 0, 760); g.addColorStop(0, `rgba(12,12,34,${a})`); g.addColorStop(0.75, `rgba(12,12,34,${0.92 * a})`); g.addColorStop(1, 'rgba(12,12,34,0)'); x.fillStyle = g; x.fillRect(0, 0, 1080, 760);
          g = x.createLinearGradient(0, 1150, 0, 1920); g.addColorStop(0, 'rgba(12,12,34,0)'); g.addColorStop(0.3, `rgba(12,12,34,${0.9 * a})`); g.addColorStop(1, `rgba(12,12,34,${a})`); x.fillStyle = g; x.fillRect(0, 1150, 1080, 770);
          label(x, 'BHEESHMUDU', 540, 300, 34, '#f2d79a', a, 'EB Garamond', '500', 5); label(x, 'PART 3 / 3', 540, 345, 24, '#f2d79a', a * 0.9, 'EB Garamond', '500', 4);
          x.save(); x.globalAlpha = a * 0.8; x.fillStyle = '#e8c46a'; x.fillRect(440, 378, 200, 2); x.restore();
          label(x, 'Ampashayya', 540, 455, 92, '#ffffff', a, 'EB Garamond', '500', 0, true); label(x, 'అంపశయ్య', 540, 545, 46, '#f2d79a', a, 'Noto Sans Telugu', '600');
          label(x, 'FOLLOW FOR MORE STORIES', 540, 1590, 30, '#ffffff', eo(clamp((t - (Bt('cta') + 0.5)) / 0.5)), 'EB Garamond', '600', 4); }; },
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
        const bar = x.createLinearGradient(0, 1080, 0, 1920); bar.addColorStop(0, 'rgba(10,8,4,0)'); bar.addColorStop(0.25, 'rgba(10,8,4,0.42)'); bar.addColorStop(0.55, 'rgba(10,8,4,0.42)'); bar.addColorStop(1, 'rgba(10,8,4,0.1)'); x.fillStyle = bar; x.fillRect(0, 1080, 1080, 840);
        const sid = LINES[i].id; if (SRC[sid]) pill(x, SRC[sid], i > 0 && t < st + XF * 2 && SRC[LINES[i - 1].id] !== SRC[sid] ? mix : 1);
        if (t < 0.5) { x.fillStyle = `rgba(0,0,0,${1 - t / 0.5})`; x.fillRect(0, 0, 1080, 1920); }
        if (t > D - 0.5) { x.fillStyle = `rgba(0,0,0,${(t - (D - 0.5)) / 0.5})`; x.fillRect(0, 0, 1080, 1920); } });
      R.toneMappingExposure = expA; R.render(hs, hc);
    };

    // ================================================================ storybook toon shading (soft cel bands) for everything lit
    const grad = new THREE.DataTexture(new Uint8Array([95, 150, 195, 232, 255]), 5, 1, THREE.RedFormat); grad.magFilter = grad.minFilter = THREE.NearestFilter; grad.needsUpdate = true;
    const toonCache = new Map();
    const toToon = m => { if (!m || !m.isMeshStandardMaterial) return m; if (toonCache.has(m)) return toonCache.get(m);
      const gold = m.metalness > 0.5, t = new THREE.MeshToonMaterial({ color: gold ? new THREE.Color(m.color).lerp(new THREE.Color(0xffd060), 0.35) : m.color, map: m.map, vertexColors: m.vertexColors, side: m.side, transparent: m.transparent, opacity: m.opacity, alphaTest: m.alphaTest, gradientMap: grad,
        emissive: gold ? new THREE.Color(0x3a2400) : m.emissive, emissiveIntensity: gold ? 1 : m.emissiveIntensity, depthWrite: m.depthWrite });
      toonCache.set(m, t); return t; };
    S.traverse(q => { if ((q.isMesh || q.isInstancedMesh) && q !== sky && q !== sky2 && q.material) q.material = Array.isArray(q.material) ? q.material.map(toToon) : toToon(q.material); });
    heroes.forEach(M => { M.root.scale.x *= 0.92; M.root.scale.z *= 0.92; });
    const sfx = SFX.filter(s => isFinite(s[1]));
    return { duration: D, update, shots: [{ t: [0, 1], from: { pos: [0, 2, 8], look: [0, 1, 0] } }], sfx, watermark: false, endCard: false, music: {}, capFont: 'Fredoka Light', capMarginV: 520, capSize: 64 };
  },
};
