#!/usr/bin/env bash
# Regenerate the QR codes on the closing slide.
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p assets/qr
rm -f assets/qr/*.png
while IFS='|' read -r name url; do
  npx qrcode -o "assets/qr/$name.png" -w 600 -m 2 -d "#1a1a1a" -l "#fffdf8" "$url" </dev/null
done <<'LIST'
repo|https://github.com/vladar107/amsterdam-ai-native-talk
linkedin|https://www.linkedin.com/in/vladar107
LIST
ls -1 assets/qr
