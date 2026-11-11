# @scraptobuild studio

How things are built, from scrap or raw rock to the finished thing — 3D reels made entirely in code.

**Website:** https://madhureddy18.github.io/scraptobuild/ — preview queued reels, edit captions, cut, **Post now** or **Schedule**. Log in once with a fine-grained GitHub token for this repo (Contents + Actions: Read and write).

## How it works
- `queue/<id>.mp4` + `.json` (+ `.jpg` cover) = a reel waiting to be posted. `at: null` = draft (never posts on its own).
- `post.py` + `.github/workflows/post.yml` post to Instagram (Reels) with the cover, caption, hashtags and first comment.
- `wait.yml` makes scheduled posts go out within ~1 minute of the time. `cut.yml` + `cut.py` = the website's ✂️ cut tool.
- `refresh-token.yml` keeps the Instagram token alive every Monday.

## Secrets (Settings → Secrets and variables → Actions)
- `MADDIEANDCHOTUIGTOKEN` — Instagram token for @scraptobuild (used to post).
- `IG_TOKEN` — fine-grained GitHub token for this repo (Secrets: read+write), used to save the refreshed Instagram token.
- `check-tokens.yml` (run it by hand) shows what each secret works for, without printing any token.

## Making reels
`studio/` holds the scenes, locked narrator voice, music bed and the render setup (`voices.yml` for OmniVoice, `render.yml` renders on 12 machines in ~20 min).
