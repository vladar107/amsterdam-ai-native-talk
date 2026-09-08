#!/usr/bin/env bash
# Regenerate the QR codes on the closing slide.
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p assets/qr
while IFS='|' read -r name url; do
  npx qrcode -o "assets/qr/$name.png" -w 600 -m 2 -d '#1a1a1a' -l '#fffdf8' "$url"
done <<'LIST'
linkedin|https://www.linkedin.com/in/vladar107
linktree|https://linktr.ee/vladar107
claudescope|https://github.com/vladar107/claudescope
LIST
