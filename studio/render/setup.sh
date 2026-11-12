#!/usr/bin/env bash
# Prepare the codevid kit for a scraptobuild scene.  bash studio/render/setup.sh <scene> [kitdir]
set -e
SCENE=$1; KIT=${2:-kit}; REPO=$(pwd)
[ -d "$KIT/codevid" ] || git clone -q --depth 1 -b codevid-wip https://github.com/madhureddy18/insideyou-shorts.git "$KIT"
cd "$KIT" && git checkout -q -- codevid/render.js && git apply "$REPO/studio/render/keywords.patch" && python3 "$REPO/studio/render/kit_patch.py" codevid/render.js
cd codevid && [ -d node_modules/three ] || npm install --silent
mkdir -p ~/.fonts && for u in "ofl/fredoka/Fredoka%5Bwdth,wght%5D.ttf:Fredoka" "ofl/cinzel/Cinzel%5Bwght%5D.ttf:Cinzel" "ofl/oswald/Oswald%5Bwght%5D.ttf:Oswald" "ofl/bangers/Bangers-Regular.ttf:Bangers"; do f=${u%%:*}; n=${u##*:}; [ -f ~/.fonts/$n.ttf ] || curl -sfL "https://raw.githubusercontent.com/google/fonts/main/$f" -o ~/.fonts/$n.ttf; done; fc-cache -f >/dev/null
cat "$REPO/studio/scenes/${SCENE}_lines.js" "$REPO/studio/scenes/${SCENE}_body.js" > scenes/$SCENE.js
rm -rf voice/$SCENE && mkdir -p voice/$SCENE && cp "$REPO"/studio/voices/out/$SCENE/*.wav voice/$SCENE/
echo "kit ready: $SCENE"
