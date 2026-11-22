# Daily reel runbook — @myth.scale (what the scheduled task does every day)

Maddy's standing instructions (19 Nov 2026): **one Telugu reel every day, built start to finish and posted automatically at 7:30 PM IST** without waiting for him. He approved auto-posting for these daily reels.

## Style — 2D puppet animation like the Karna reel, but EVERY reel must LOOK NEW
- **2D puppet animation**, not cards: jointed characters that act (bow, shoot, kneel, fight, point, cry), camera push-ins and pans, soft cross-fades.
- Code kit: `studio/scenes/stb_karna_te_body.js` (puppets, CAST, cam, card loop). Reuse the *machinery*, NOT the look. Add new CAST entries and props for the story (Rama, Hanuman, Ravana with ten heads, Shiva, Ganesha, Narasimha...). Write a new shot per line; never leave a shot empty.

## Fresh look every reel (Maddy, 20 Nov 2026: "every video looks same — change from next reel, it should look new and adapt to the scene")
Karna, Ekalavya and Barbarika all reused the same green forest with god rays, orange/red sunset, plain grass ground and a black silhouette-on-sunset ending. **Stop repeating that.** For each new reel:
1. **Settings come from the story itself**, not from the kit. Paint the real places of that story: e.g. Kumbhakarna → giant cave-palace in golden Lanka; Ganesha → Kailasa snow and Parvati's bath chamber; Narasimha → Hiranyakashipu's pillared palace hall at dusk; Bhishma → Ganga riverbank, Hastinapura court, the bed of arrows; Hanuman/Lanka → ocean crossing, burning golden city at night; Draupadi → forest hut, Durvasa's sages bathing in a river; Brahma/Pushkar → lake and a desert yagna; Ashwatthama → misty night camp, gem on forehead. Write NEW background painters for these (new function names), each with its own detail (pillars, arches, water reflections, snow, fire, rain, cave rock, stars, architecture).
2. **New colour palette per reel** — pick one mood that fits the story and is clearly different from the last 3 reels (e.g. icy blue + white, deep teal + gold, moonlit indigo, rain-grey + green, fire-orange on black, pastel dawn pink, royal purple + gold). Don't default to the orange sunset.
3. **Ground and framing vary**: indoor floors, palace steps, water, snow, rock, clouds/heaven — not the same grass strip in every shot. Mix wide establishing shots, close-ups on faces/hands/objects, over-the-shoulder, low angle for powerful characters, top-down.
4. **New ending composition** each time (not the silhouette on a sunset hill): e.g. character's face close-up, object glowing (the gem, the pillar, the arrows bed), the place at night with lamps, zoom out to the whole city. The follow button can stay.
5. **Weather / particles / light effects fitting the story**: rain, snow, embers, petals, mist, lightning, water ripples, fire light flicker — at least two that weren't in the previous reel.
6. Before rendering, compare the preview contact sheet side-by-side with the last reel's contact sheet. If it looks similar (same backgrounds/colours), change it before rendering.
7. Log the look in the table below so the next reel can avoid it.

### Look log (newest last — the next reel must differ from the last 3)
| Reel | Palette | Main settings | Ending |
|------|---------|---------------|--------|
| Karna | orange/red sunset, green forest | forest, ashram, Kurukshetra sunset, seashore | silhouette on sunset |
| Ekalavya | green forest, dusk orange, red storm | forest with god rays, ashram, red storm | silhouette on sunset |
| Barbarika | red sunset, green forest, night blue | Kurukshetra sunset hill, forest + peepal tree, night, temple | silhouette on sunset hill |
| Abhimanyu 1/3 | royal purple + gold, moonlit indigo/silver, teal + gold sea, steel-blue mist | Indraprastha pillared hall, moonlit bedchamber (arched window, curtains, incense), womb glow, top-down ochre Chakravyuha, Dwaraka sea terrace, misty Kurukshetra dawn, war tent | glowing gold Chakravyuha from above on a starry indigo sky, a light-dot spiralling in |
| Abhimanyu 2/3 | bronze dust haze + slate steel, midday | dusty Kurukshetra field with stuck arrows, top-down brown spiral with teal chariot light, Shiva vision on a night cloud | Abhimanyu close-up, six shadow heads closing in |
| Abhimanyu 3/3 | ash-grey + deep crimson dusk, night-blue camp with torches, fire on black | ash-falling battlefield, broken chariot, Pandava night camp, wall of fire for the vow, ivory palace | broken chariot wheel glowing under a rising star |
| Ganesha | icy blue + white snow, pastel pink-gold bath, aurora | Kailasa snow peaks + gate, Parvati's bath chamber with steam, moonlit snowy forest elephant, golden throne | giant Ganesha face with diyas and marigold petals |
| Kumbhakarna | deep teal + gold Lanka, amber cave, lotus pink-gold Brahma light | Lanka teal-gold pillared court, fire-lit sleeping cave, night tapas mountain, cloud heaven, moonlit shore | golden Lanka at night over the sea, zoom out |
| Bhishma 1/3 | pastel dawn pink + aqua river, white marble | Yamuna/Ganga bank with fisher hut and boat, white Hastinapura court, cloud heaven of devas, flower rain | Devavrata's face close-up in falling petals |
| Bhishma 2/3 | rain-grey + deep forest green, violet lightning, saffron Kashi hall | rain forest with puddle ripples, Kashi swayamvara hall, Parashurama duel in a storm, fire in the rain | split face: Amba / Shikhandi in rain |
| Bhishma 3/3 | midnight indigo + silver moon, white water, pale winter dawn | moonlit Kurukshetra, bed of arrows, water spring, compass to Uttarayana, lamp-lit Bhishma Ashtami | empty arrow-bed with a light rising to the stars |
| Brahma | desert sand-gold + turquoise lake + lotus pink, cosmic violet | Pushkar ghats with red spire, desert lotus fall, yagna fire, Savitri hill, Shiva's pillar of fire | Pushkar lake at night with floating lamps |
| Ashwatthama | fog green-black night + cold cyan gem, white-violet astra blaze | misty forest, owl and crows, Pandava camp tents, riverbank chase, astra clash | lone wanderer walking away down a misty road, wound glowing |
| Karna's kavacha | blazing white-gold noon + deep cobalt river + red sandstone; storm-violet Indra heaven; crimson/maroon lattice night; charcoal + red moon | noon river ghats with red temple spires and sun glints, Konark-style sun wheel, Amaravati cloud palace, Anga palace jali bedchamber (dream), Karna waist-deep in the river, red-moon night war with torches | the cut golden armour + earrings glowing alone on the river steps, zoom out over the noon river |
| Gandhari | dusty-rose dawn + plum + apricot blossom, cream marble + marigold, grey-plum ash dusk | Gandhara snow peaks with blossom trees, Shiva cave shrine, Hastinapura marigold hall, plum palace window through the seasons, widows' Kurukshetra with crows + diyas | blindfolded Gandhari seated among diyas, then the silk blindfold floating up into a plum night with rising lamps |
| Narasimha 1/3 | obsidian black + emerald veins + gold, navy cosmic ocean, bleached bone-white/ochre Mandara, gold lotus | asura court with emerald-veined pillars + gold throne, Varaha lifting the earth, scorched Mandara with heat shimmer + anthill, Brahma on a lotus, boon icon cards | tiny Prahlada praying with a diya under the asura's giant shadow on a glowing emerald wall |
| Narasimha 2/3 | turquoise glazed tiles + saffron + lime green, indigo starry cliff, fire | lime-green Narada ashram, turquoise gurukul with desks, throne/lap, elephants + snakes, night cliff, poison cup | Prahlada calm on a lotus inside a ring of fire, petals |
| Narasimha 3/3 | copper-bronze pillars + twilight magenta/orange dusk, white crack lightning | copper pillared hall with an arched dusk doorway, cracking pillar + debris, the threshold door frame at sunset, devas on clouds | calm Narasimha seated with Prahlada on his lap, diyas, pink-gold sky + petals |
| Shakuni (folk) | dungeon slate-grey + candle amber + ivory bone, red/ivory chaupar | candle-lit dice hall with chaupar board, tholu bommalata backlit shadow-puppet screen for the folk part, stone dungeon with light shaft + bars, ghost face | two ivory bone dice rolling to a stop on the chaupar, candle flicker |
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
0. **Skip when the queue is full (Maddy, 23 Nov 2026: "generate another 5 videos and schedule it, then you don't need to create again for many days until those scheduled ones are completed").** Count the reels in `queue/*.json` whose `at` is after today. If there are 2 or more, build nothing this run: no reel, no commit, no message to Maddy. Build again only when 1 or 0 future reels are left, so the daily posts never run dry.
1. `git pull`. Take the first `todo` row in `studio/TOPICS.md`. If the topic list has fewer than 5 todo rows, add 10 new good topics (with 1 new 3-part series among them) at the end.
2. Research every fact on the web (WebSearch). Note the source.
3. Write `studio/scenes/stb_<slug>_te_lines.js` (same shape as `stb_karna_te_lines.js`, but `text` = Tinglish subtitle).
4. Voices: build `studio/voices/stb_<slug>_te.json` from `cast.json` (one job per line, voice `maddy2_te2`, speed 1.0, files `01.wav`…) and dispatch `voices.yml` (REST: `gh api -X POST repos/madhureddy18/scraptobuild/actions/workflows/voices.yml/dispatches -f ref=main -f 'inputs[config]=…'`). ~25 min. Collect `voices-out-0/1/2` immediately, trim silence (ffmpeg silenceremove both ends, apad 0.04) into `studio/voices/out/stb_<slug>_te/NN.wav`.
5. Check: dispatch `transcribe.yml` with `model=medium`, `lang=te`. A line that comes back empty or garbled: regenerate it with 2–3 rephrasings (fewer `...`, a comma instead) in one fix run, keep the one that transcribes right, and update that line's `omni`/`text` to the kept wording.
6. Scene: `studio/scenes/stb_<slug>_te_body.js` — with a fresh look per the section above (new settings painted for this story, new palette, new ending). Preview locally (`bash studio/render/setup.sh stb_<slug>_te /home/claude/kit` then `cd /home/claude/kit/codevid && SILENT=1 node render.js scenes/stb_<slug>_te.js --preview lines`), tile the stills into one contact sheet and LOOK at it. Fix: characters too small, floating feet, people cut off, empty shots, subtitles covering faces.
7. Render: commit + push, dispatch `render.yml` (`scene=stb_<slug>_te`, `music=studio/music/epic_bed.mp3`). ~25 min. If a shard fails on a network error, re-run failed jobs once. Result is on branch `render-out`.
8. Check the MP4: ffprobe duration, 1080x1920, contact sheet, subtitles visible, no black blocks.
9. Queue: `queue/<slug>_te.mp4`, `.jpg` cover (frame at ~2.5 s), `.json` (Telugu caption with the source, 5 hashtags incl. `mythscale` and one unique tag, first_comment, `"at": "<today>T19:30:00+05:30"`; if it's already past 19:15 IST, use 21:00 today). Never schedule two reels for the same day: use the first evening (19:30, starting today) that has no reel in `queue/` yet — Maddy batches several reels ahead (21 Nov 2026), so this can be days out.
10. Add the reel's row to the Look log above. Mark the topic `done <date>` in TOPICS.md, commit, push (the schedule waiter posts it on time).
11. Send Maddy a short message: topic, the MP4 file, posting time. If something failed and the reel can't be finished well, say so and do NOT queue a half-made reel.
