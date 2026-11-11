"""Character voices with OmniVoice (k2-fsa, Apache-2.0), run on GitHub Actions (CPU).
1) each voice is DESIGNED once from a description and saved as a reference clip (refs/<voice>.wav) -> the character always sounds the same
2) every line is then CLONED from that reference.   python omnivoice_gen.py samples.json out/
"""
import json, os, sys, subprocess
import numpy as np, soundfile as sf, torch
from omnivoice import OmniVoice

cfg = json.load(open(sys.argv[1])); out = sys.argv[2]; os.makedirs(out + "/refs", exist_ok=True)
torch.set_num_threads(os.cpu_count() or 4)
model = OmniVoice.from_pretrained("k2-fsa/OmniVoice", device_map="cpu", dtype=torch.float32)
SR = 24000
prompts = {}
for name, instruct in cfg["voices"].items():
    who = name.split("_")[0]; ref = f"{out}/refs/{name}.wav"
    if not os.path.exists(ref):
        torch.manual_seed(cfg.get("seed", 7))
        sf.write(ref, model.generate(text=cfg["ref_text"][who], instruct=instruct)[0], SR)
    prompts[name] = model.create_voice_clone_prompt(ref_audio=ref, ref_text=cfg["ref_text"][who])
    print("voice ready:", name, "=", instruct, flush=True)

gap = np.zeros(int(SR * 0.18), dtype=np.float32)
for mix, (mv, cv) in cfg.get("mixes", {}).items():
    parts = []
    for i, (who, text) in enumerate(cfg["lines"], 1):
        v = mv if who == "maddie" else cv
        a = model.generate(text=text, voice_clone_prompt=prompts[v])[0].astype(np.float32)
        sf.write(f"{out}/{mix}_{i:02d}_{who}.wav", a, SR); parts += [a, gap]
        print(mix, i, who, flush=True)
    sf.write(f"{out}/{mix}.wav", np.concatenate(parts), SR)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f"{out}/{mix}.wav", "-b:a", "160k", f"{out}/{mix}.mp3"], check=True)
import time
SH, NSH = int(os.environ.get("SHARD", "0")), int(os.environ.get("NSHARDS", "1"))
jobs = cfg.get("jobs", [])
for k, job in enumerate(jobs):          # production: [{"voice": "maddie_C", "text": "...", "file": "01.wav", "speed": 1.0}]
    if k % NSH != SH:
        continue
    t0 = time.time()
    a = model.generate(text=job["text"], voice_clone_prompt=prompts[job["voice"]], speed=job.get("speed", 1.0))[0]
    sf.write(f"{out}/{job['file']}", a, SR); print("job", job["file"], f"{len(a)/SR:.2f}s audio in {time.time()-t0:.0f}s", flush=True)
