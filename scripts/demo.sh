#!/usr/bin/env bash
# Stage setup for the opening demo on the work laptop.
# A second Claudescope instance indexes only the sessions in demo/corpus.txt, so no work project can
# reach the screen, and Claude Code is launched with the same environment so its history searches
# hit that instance instead of the everyday one.
set -euo pipefail
cd "$(dirname "$0")/.."

DEMO_HOME="${DEMO_HOME:-$HOME/.talk-demo}"
SESSION=bdd809e6-a231-42a7-8c6f-aec2d256d14a
COMPACTION=dc279199-fb0c-40c5-bd76-1d6dda4db11a

empty="$DEMO_HOME/empty"
export CLAUDESCOPE_HOME="$DEMO_HOME/claudescope" PORT=4318 OPEN_BROWSER=0 \
  CLAUDE_PROJECTS_DIR="$DEMO_HOME/projects" \
  CODEX_SESSIONS_DIR="$empty" JUNIE_SESSIONS_DIR="$empty" PI_SESSIONS_DIR="$empty" \
  OPENCODE_DATA_DIR="$empty" OPENCODE_DB_PATH="$empty/none.db" OPENCODE_CONFIG_DIR="$empty" \
  COPILOT_SESSIONS_DIR="$empty" GROK_SESSIONS_DIR="$empty" \
  ANTIGRAVITY_CLI_DIR="$empty" ANTIGRAVITY_DIR="$empty" \
  DUCKDB_EXTENSION_DIR="$HOME/.claudescope/duckdb-extensions"

corpus() { grep -vE '^(#|$)' demo/corpus.txt; }

check() {
  local expected actual
  expected=$(corpus | awk -v h="$HOME" '$2 != "memory" { print h "/" $1 }' | sort -u)
  actual=$(claudescope projects --json | jq -r '.[].cwd' | sort -u)
  if [ "$actual" != "$expected" ]; then
    echo "✗ demo index projects differ from demo/corpus.txt:" >&2
    diff <(echo "$expected") <(echo "$actual") >&2 || true
    exit 1
  fi
  claudescope search 'Audient mute Raycast' --limit 3
  echo "✓ demo index: $(corpus | awk '$2 != "memory"' | wc -l | tr -d ' ') sessions," \
    "$(echo "$expected" | wc -l | tr -d ' ') project(s), $(corpus | awk '$2 == "memory"' | wc -l | tr -d ' ') memory folder(s)"
}

case "${1:-}" in
  prepare)
    claudescope stop >/dev/null 2>&1 || true
    rm -rf "$DEMO_HOME/projects" "$CLAUDESCOPE_HOME"
    mkdir -p "$empty"
    corpus | while read -r cwd id; do
      dir=$(printf '%s' "$HOME/$cwd" | tr '/.' '--')
      mkdir -p "$DEMO_HOME/projects/$dir"
      if [ "$id" = memory ]; then
        cp -R "$HOME/.claude/projects/$dir/memory" "$DEMO_HOME/projects/$dir/"
      else
        cp "$HOME/.claude/projects/$dir/$id.jsonl" "$DEMO_HOME/projects/$dir/"
      fi
    done
    claudescope start >/dev/null
    for _ in $(seq 1 30); do
      [ "$(claudescope projects --json 2>/dev/null | jq length)" -gt 0 ] && break
      sleep 1
    done
    check
    ;;
  check) check ;;
  claude)
    claudescope status 2>/dev/null | grep -q running || { echo "run: scripts/demo.sh prepare" >&2; exit 1; }
    cd "$HOME/src"
    exec claude
    ;;
  open)
    case "${2:-decision}" in
      decision) open "http://127.0.0.1:$PORT/sessions/$SESSION#2b5b3b6a-b198-40f1-9155-dba7885bbdb2" ;;
      compaction) open "http://127.0.0.1:$PORT/sessions/$COMPACTION#344ded42-c894-4462-ae6f-ca5452606d92" ;;
      memory) open "http://127.0.0.1:$PORT/memory" ;;
      *) echo "usage: scripts/demo.sh open [decision|compaction|memory]" >&2; exit 2 ;;
    esac
    ;;
  stop) claudescope stop ;;
  *)
    echo "usage: scripts/demo.sh prepare|check|claude|open [decision|compaction|memory]|stop" >&2
    exit 2
    ;;
esac
