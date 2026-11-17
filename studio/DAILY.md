# Daily reel runbook (what the scheduled task does every day)

Maddy's standing instructions (Nov 2026): one Telugu reel every day, built and **posted automatically at 7:30 PM IST** without waiting for him.
This overrides the older "nothing posts on its own" rule for these daily reels only.

## Style (fixed)
- Flat 2D illustrated cards like @ithihasa.telugu: one card per line, ray background whose colour changes per section, gold Telugu title + subtitle at the top, slow push-in, soft cross-fades.
- Template: `studio/scenes/stb_vasuki_te_body.js` (reuse its drawing kit: bg, rays, stars, glow, figure, earth, hood, mountain, coils, kalash, tortoise, shiva, hill, tree, title shade, follow button). Write new cards for the new topic; never leave a card blank.
- Telugu narration, professional tone, **no jokes**, no "legend says" phrasing (use "according to <text>" / "tradition says").
- 12 to 14 lines, about 60 seconds. Line 1 = hook. Last line = `ఇంకా ఇలాంటి కథల కోసం, ఫాలో అవ్వండి.` (follow-only CTA, no "comment X").
- Captions (`text`) = Telugu written in English letters; `omni` = Telugu script; `title` / `sub` = Telugu heading for the card.
- No page handle or watermark on the video.

## Steps
1. `git pull`. Take the first `todo` row in `studio/TOPICS.md`.
2. Research every number, date, size and source on the web; name the text (Valmiki Ramayana, Mahabharata, a Purana) in the script. If a figure is our own estimate, say so in the caption.
3. Write `studio/scenes/stb_<slug>_te_lines.js` (same shape as `stb_vasuki_te_lines.js`).
4. Voices: build `studio/voices/stb_<slug>_te.json` from `studio/voices/cast.json` (one job per line) and dispatch `voices.yml`. Wait, collect `voices-out-0/1/2`, trim silence into `studio/voices/out/stb_<slug>_te/NN.wav`.
5. Check: dispatch `transcribe.yml` with `model=small`, `lang=te`. Any line that comes back garbled or clearly different: regenerate it with 2–3 rephrasings in one fix run, keep the one that transcribes closest.
6. Scene: `studio/scenes/stb_<slug>_te_body.js`. Preview locally (`studio/render/setup.sh` + `node render.js … --preview`) at two points per line; fix overlaps, blank or broken cards.
7. Render: dispatch `render.yml` (`scene=stb_<slug>_te`, `music=studio/music/tabla_bed.mp3`). If a shard fails on a network error, re-run failed jobs once.
8. Check the MP4: duration, contact sheet, no black blocks.
9. Queue: `queue/<slug>_te.mp4`, `.jpg` cover, `.json` (Telugu caption, 5 hashtags incl. one unique, `"at": "<today>T19:30:00+05:30"`). If it's already past 19:15 IST, set the time to 21:00 the same day.
10. Mark the topic `done <date>` in `TOPICS.md`, commit, push (the schedule waiter posts it on time).
11. Send Maddy a short note: topic, the MP4, posting time. If anything failed and the reel can't be finished, say so and do not queue a half-made reel.
