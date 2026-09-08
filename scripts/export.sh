#!/usr/bin/env bash
# Export a deck to PDF and standalone HTML through the local deckrun server.
# Usage: scripts/export.sh [slides.md] [exports/deck]
# Env:   THEME TEMPLATE TRANSITION SIZE PORT
set -euo pipefail

MD="${1:-slides.md}"
OUT="${2:-exports/deck}"
THEME="${THEME:-tokyo}"
TEMPLATE="${TEMPLATE:-minimal}"
TRANSITION="${TRANSITION:-fade}"
SIZE="${SIZE:-m}"
PORT="${PORT:-7899}"
BASE="http://127.0.0.1:${PORT}"

mkdir -p "$(dirname "$OUT")"
TMP="$(mktemp -d)"
cleanup() {
  kill "${SERVER_PID:-}" 2>/dev/null || true
  rm -f "$TMP"/*.json "$TMP"/server.log
  rmdir "$TMP" 2>/dev/null || true
}
trap cleanup EXIT

# Editor mode (no file argument) exposes /__pdf and /__present for arbitrary Markdown;
# file mode only renders the deck it was launched with.
npx deckrun --no-open -p "$PORT" >"$TMP/server.log" 2>&1 &
SERVER_PID=$!

for _ in $(seq 1 40); do
  curl -sf "$BASE/" >/dev/null 2>&1 && break
  sleep 0.5
done
curl -sf "$BASE/" >/dev/null || { echo "deckrun did not start:"; cat "$TMP/server.log"; exit 1; }

python3 - "$MD" "$THEME" "$TEMPLATE" "$TRANSITION" "$SIZE" "$TMP" <<'PY'
import json, sys
md, theme, template, transition, size, tmp = sys.argv[1:]
body = {"markdown": open(md, encoding="utf-8").read(), "theme": theme,
        "template": template, "transition": transition, "size": size}
json.dump(body, open(f"{tmp}/pdf.json", "w"))
body["standalone"] = True
json.dump(body, open(f"{tmp}/html.json", "w"))
PY

curl -sf -X POST -H 'Content-Type: application/json' --data-binary "@$TMP/pdf.json" \
  "$BASE/__pdf" -o "$OUT.pdf"
DECK_PATH="$(curl -sf -X POST -H 'Content-Type: application/json' \
  --data-binary "@$TMP/html.json" "$BASE/__present" | python3 -c 'import json,sys; print(json.load(sys.stdin)["path"])')"
curl -sf "$BASE$DECK_PATH" -o "$OUT.html"

echo "wrote $OUT.pdf ($(du -h "$OUT.pdf" | cut -f1)) and $OUT.html ($(du -h "$OUT.html" | cut -f1))"
