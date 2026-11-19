# Daily reel runbook — @myth.scale (what the scheduled task does every day)

Maddy's standing instructions (19 Nov 2026): **one Telugu reel every day, built start to finish and posted automatically at 7:30 PM IST** without waiting for him. He approved auto-posting for these daily reels.

## Style (fixed) — exactly like the Karna reel (`stb_karna_te`, Maddy liked it)
- **2D puppet animation**, not cards: jointed characters that act (bow, shoot, kneel, fight, point, cry), painted scenes (forest with god rays, tree, seashore at dusk, palace, Kurukshetra sunset, night with moon), camera push-ins and pans, soft cross-fades, a silhouette-on-sunset ending.
- Template: `studio/scenes/stb_karna_te_body.js`. Copy its whole kit (painting kit, props, CAST + puppet/seated/lying, cam, card loop). Add new CAST entries and props for the new story (e.g. Rama blue skin, Hanuman, Ravana with ten heads, Shiva, Ganesha, a palace, a river). Write a new shot per line; never leave a shot empty.
- **Voice = Maddy's own cloned voice**: voice `maddy2_te2` (ref `studio/voices/refs/maddy2_te2.wav`, cut from his own reel) — see `studio/voices/cast.json`. Very expressive storytelling: use `...` for pauses, `!` and `?` for drama, short dramatic sentences, dialogue lines in the characters' voice ("నాతో అబద్ధం చెప్పావు!").
- **Subtitles ON, in Tinglish** (Telugu in English letters, the way people type: "ippatiki", "ela", "ekkada", "Karnudu", "shaapam"). `text` = Tinglish subtitle of exactly what is spoken, 1–2 key words in `*stars*` (turn yellow). Body returns `capFont: 'Fredoka Light', capMarginV: 520, capSize: 64`.
- 12 to 15 lines, 60 to 75 seconds. Line 1 = a question hook ("…enduku…?"). Story told dramatically, then the answer.
- Last line of a single reel / Part 3: `ఇంకా ఇలాంటి కథల కోసం... ఫాలో అవ్వండి!` (text: "Inka ilaanti kathala kosam... *follow* avvandi!").
- No page handle, no watermark, no comment-CTA.
- Facts: name the source (Valmiki Ramayana, Mahabharata parva, a Purana). If something is folklore or a later version, say "konni kathala prakaaram" in the script and caption. Never present folklore as scripture.

## Series (3 parts, never more)
- Rows in TOPICS.md marked `series: <name> 1/3`, `2/3`, `3/3` are built on 3 consecutive days.
- Part 1 and 2 end with: `మిగతా కథ రేపు Part 2 లో... ఫాలో అవ్వండి!` (Part 3 for part 2). Part 2 and 3 start with one quick recap line ("Ninna choosam…").
- Part 3 ends the story fully and ends with the normal follow line.
- Captions/titles say "Part 1/3" etc. Same series hashtag on all 3 parts.

## Steps
1. `git pull`. Take the first `todo` row in `studio/TOPICS.md`. If the topic list has fewer than 5 todo rows, add 10 new good topics (with 1 new 3-part series among them) at the end.
2. Research every fact on the web (WebSearch). Note the source.
3. Write `studio/scenes/stb_<slug>_te_lines.js` (same shape as `stb_karna_te_lines.js`, but `text` = Tinglish subtitle).
4. Voices: build `studio/voices/stb_<slug>_te.json` from `cast.json` (one job per line, voice `maddy2_te2`, speed 1.0, files `01.wav`…) and dispatch `voices.yml` (REST: `gh api -X POST repos/madhureddy18/scraptobuild/actions/workflows/voices.yml/dispatches -f ref=main -f 'inputs[config]=…'`). ~25 min. Collect `voices-out-0/1/2` immediately, trim silence (ffmpeg silenceremove both ends, apad 0.04) into `studio/voices/out/stb_<slug>_te/NN.wav`.
5. Check: dispatch `transcribe.yml` with `model=medium`, `lang=te`. A line that comes back empty or garbled: regenerate it with 2–3 rephrasings (fewer `...`, a comma instead) in one fix run, keep the one that transcribes right, and update that line's `omni`/`text` to the kept wording.
6. Scene: `studio/scenes/stb_<slug>_te_body.js`. Preview locally (`bash studio/render/setup.sh stb_<slug>_te /home/claude/kit` then `cd /home/claude/kit/codevid && SILENT=1 node render.js scenes/stb_<slug>_te.js --preview lines`), tile the stills into one contact sheet and LOOK at it. Fix: characters too small, floating feet, people cut off, empty shots, subtitles covering faces.
7. Render: commit + push, dispatch `render.yml` (`scene=stb_<slug>_te`, `music=studio/music/epic_bed.mp3`). ~25 min. If a shard fails on a network error, re-run failed jobs once. Result is on branch `render-out`.
8. Check the MP4: ffprobe duration, 1080x1920, contact sheet, subtitles visible, no black blocks.
9. Queue: `queue/<slug>_te.mp4`, `.jpg` cover (frame at ~2.5 s), `.json` (Telugu caption with the source, 5 hashtags incl. `mythscale` and one unique tag, first_comment, `"at": "<today>T19:30:00+05:30"`; if it's already past 19:15 IST, use 21:00 today). Never schedule two reels for the same day: if a queued reel already has today's time, use tomorrow 19:30.
10. Mark the topic `done <date>` in TOPICS.md, commit, push (the schedule waiter posts it on time).
11. Send Maddy a short message: topic, the MP4 file, posting time. If something failed and the reel can't be finished well, say so and do NOT queue a half-made reel.
