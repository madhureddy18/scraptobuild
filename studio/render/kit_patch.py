"""Patch the read-only codevid kit's render.js for scraptobuild renders (run after keywords.patch).
- MUSIC_FILE=<audio>: use this music bed instead of the synth loop (keeps muteFrom/muteTo dips)
- lines that all have recordings in voice/<scene>/ skip TTS entirely
- NSH=<n> SH=<i>: render only this shard's frame range and encode it to out/seg_<i>.mp4
- VIDEO_IN=<mp4>: skip frame rendering and use this (concatenated) picture for the final mux
"""
import sys
p = sys.argv[1]; s = open(p).read()
def rep(a, b):
    global s
    assert a in s, 'patch anchor missing: ' + a[:70]
    s = s.replace(a, b, 1)
rep("function music(D, m) {",
    "function music(D, m) {\n  if (process.env.MUSIC_FILE) { const f = path.join(WORK, 'music.wav'); const mute = m && m.muteFrom != null ? `,volume='if(between(t,${m.muteFrom},${m.muteTo}),0.12,1)':eval=frame` : ''; ff(['-i', process.env.MUSIC_FILE, '-af', `apad,atrim=0:${D},afade=t=out:st=${Math.max(0, D - 1.8)}:d=1.8${mute}`, '-ac', '2', '-ar', '44100', f]); return f; }")
rep("  } else if (fs.existsSync(cache)",
    "  } else if (lines.every((_, i) => mine(i))) {\n    durs = lines.map(() => 1);\n  } else if (fs.existsSync(cache)")
rep("    for (let i = 0; i < N; i++) { if (reuse",
    "    const SHn = process.env.NSH ? +process.env.NSH : 0, SHi = +(process.env.SH || 0), FA = SHn ? Math.floor(N * SHi / SHn) : 0, FB = SHn ? Math.floor(N * (SHi + 1) / SHn) : (process.env.VIDEO_IN ? 0 : N);\n    for (let i = FA; i < FB; i++) { if (reuse")
rep("    const a = mix(info, T, D);",
    "    if (SHn) { const seg = path.join(OUT, `seg_${String(SHi).padStart(2, '0')}.mp4`); ff(['-framerate', String(FPS), '-start_number', String(FA), '-i', path.join(fdir, 'f_%05d.jpg'), '-frames:v', String(FB - FA), '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '15', '-pix_fmt', 'yuv420p', '-r', String(FPS), seg]); console.log('segment:', seg, FA, FB); await browser.close(); srv.close(); return; }\n    const a = mix(info, T, D);")
rep("    ff(['-framerate', String(FPS), '-i', path.join(fdir, 'f_%05d.jpg'), '-i', a,",
    "    ff([...(process.env.VIDEO_IN ? ['-i', process.env.VIDEO_IN] : ['-framerate', String(FPS), '-i', path.join(fdir, 'f_%05d.jpg')]), '-i', a,")
open(p, 'w').write(s)
print('kit patched')
