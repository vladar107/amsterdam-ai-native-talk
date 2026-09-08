#!/usr/bin/env bash
# Render prototypes/prototype.md in the candidate themes to PDF and PNG.
# Usage: scripts/render-prototypes.sh [theme ...]   (default: tokyo daylight)
set -euo pipefail
cd "$(dirname "$0")/.."

THEMES=("$@")
[ ${#THEMES[@]} -eq 0 ] && THEMES=(tokyo daylight)
mkdir -p exports/prototypes prototypes/renders

port=7900
for theme in "${THEMES[@]}"; do
  port=$((port + 1))
  THEME="$theme" PORT="$port" scripts/export.sh prototypes/prototype.md "exports/prototypes/$theme"
  rm -f prototypes/renders/"$theme"-*.png
  pdftoppm -png -r 72 "exports/prototypes/$theme.pdf" "prototypes/renders/$theme"
done
ls -1 prototypes/renders
