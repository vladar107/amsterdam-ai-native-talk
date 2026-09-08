# Opening demo

Principle: do the last thing first. The talk opens with Claude Code answering a question about a decision
taken months earlier, then reveals that the answer was retrieved from a session file, not remembered.

## The path that must work

1. Fresh Claude Code session in the demo project (no `--resume`, no `--continue`).
2. Paste the rehearsed prompt. The current placeholder is the DuckDB question from the brief.
3. The agent uses the Claudescope `history` skill / MCP server (`claudescope mcp`) to search past sessions.
4. It answers with: the decision, the alternatives, the session id, and the date.
5. Ask "where did that come from?" and show the raw JSONL record, then the same session in Claudescope.

## Live elements in the deck

The talk has three live moments, each with a static fallback:

| Moment | Live form | Fallback |
| --- | --- | --- |
| Opening question (slide 2) | Switch to a prepared Claude Code window, paste the rehearsed prompt | Slide 3: screenshot of the recorded answer |
| Raw record (slide 6) | Optional: `claudescope session <id> --around <uuid> --json` in the terminal | The trimmed record on the slide |
| Reconstruction (slide 7) | Claudescope UI embedded in the slide as an iframe (`http://127.0.0.1:4317/sessions/<id>`) | `assets/screenshots/claudescope-session.png` |

Option not yet set up: a browser terminal (for example `ttyd`, installable with Homebrew) would let the Claude Code
demo itself run inside a slide iframe instead of a window switch. It costs one more moving part on stage; decide
after the first full rehearsal.

Pre-talk checklist: `claudescope start`, Claude Code open in the demo project with a large font, notifications off,
network optional (Claudescope and Deckrun are local; Claude Code needs the API).

## Constraints on the question

- A real technical decision with its reasoning, from a real but sanitised session.
- Absent from the current conversation, `CLAUDE.md`, `AGENTS.md`, README and auto-memory.
- Under two minutes end to end, rehearsed with the exact prompt.
- No employer, client, credential, home path or personal data anywhere in the transcript or the answer.

The decision on which sessions to use is in `notes/demo-decision.md`.

## Fixtures

`fixtures/` holds synthetic records whose shape follows the real formats inspected on 2026-09-08
(see `sources.md`). Content is invented; signatures and encrypted payloads are replaced with `FIXTURE_*` strings.

| File | Shows |
| --- | --- |
| `fixtures/claude-code/session.jsonl` | user prompt, assistant thinking+tool call, tool result, decision text, `compact_boundary`, compaction summary |
| `fixtures/claude-code/memory/` | `MEMORY.md` index plus two memory facts, one good, one deliberately scope-less |
| `fixtures/codex/rollout.jsonl` | rollout envelopes, `reasoning` with `encrypted_content`, `compacted` with `replacement_history` |
| `fixtures/pi/session.jsonl` | threaded records, `toolResult` role, plaintext thinking (shape still to be verified upstream) |

## Fallback

`fallback/` will hold the screenshot and a short recording of the rehearsed run. The slide right after the
demo slide shows the screenshot; skip it when the live run works. Both must be produced from the final
demo project, with notifications off and a large terminal font.
