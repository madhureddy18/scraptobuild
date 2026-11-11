"""Cut a queued Reel to a start/end time. Runs on GitHub Actions, started by the website's "Save cut" button.

    python cut.py <id> <start_seconds> <end_seconds>

- The very first original is kept in originals/<id>.mp4 so the website can undo the cut.
- The cut is re-encoded (frame-accurate, H.264 + AAC, faststart) and replaces queue/<id>.mp4.
- queue/<id>.json: the pending "trim" request is cleared and a "cut" note {start, end, at} is added.
"""
import datetime as dt
import json
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).parent
QUEUE, ORIG = ROOT / "queue", ROOT / "originals"
IST = dt.timezone(dt.timedelta(hours=5, minutes=30))


def duration(p):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(p)],
                         capture_output=True, text=True, check=True).stdout.strip()
    return float(out)


def main(vid, start, end):
    video, meta_f = QUEUE / f"{vid}.mp4", QUEUE / f"{vid}.json"
    if not video.exists():
        raise SystemExit(f"{vid} isn't in the queue (posted or deleted?)")
    meta = json.loads(meta_f.read_text(encoding="utf-8")) if meta_f.exists() else {}
    full = duration(video)
    start, end = max(0.0, float(start)), min(float(end), full)
    if end - start < 3:
        raise SystemExit(f"Cut is too short ({end - start:.1f}s). Instagram needs at least 3 seconds.")
    ORIG.mkdir(exist_ok=True)
    orig = ORIG / f"{vid}.mp4"
    if not orig.exists():
        shutil.copy2(video, orig)                       # keep the very first version for "Undo cut"
    tmp = QUEUE / f".{vid}.cut.mp4"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{start:.3f}", "-i", str(video), "-t", f"{end - start:.3f}",
                    "-map", "0:v:0", "-map", "0:a:0?", "-c:v", "libx264", "-preset", "fast", "-crf", "20", "-maxrate", "9M", "-bufsize", "18M",
                    "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", str(tmp)], check=True)
    new = duration(tmp)
    tmp.replace(video)
    meta.pop("trim", None)
    if meta.get("thumb_offset") and int(meta["thumb_offset"]) > new * 1000:
        meta.pop("thumb_offset")
    meta["cut"] = {"start": round(start, 2), "end": round(end, 2), "from": round(full, 2), "length": round(new, 2),
                   "at": dt.datetime.now(IST).isoformat(timespec="seconds")}
    meta.pop("status", None); meta.pop("error", None)
    meta_f.write_text(json.dumps(meta, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"cut {vid}: {start:.2f}s – {end:.2f}s of {full:.2f}s -> {new:.2f}s")


if __name__ == "__main__":
    if len(sys.argv) != 4:
        raise SystemExit(__doc__)
    main(*sys.argv[1:])
