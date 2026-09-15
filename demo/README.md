# Opening demo

Principle: do the last thing first. The talk opens with Claude Code answering a question about a decision
taken months earlier, then reveals that the answer was retrieved from a session file, not remembered.

## The path that must work

1. Fresh Claude Code session in the Claudescope repository (no `--resume`, no `--continue`).
2. Paste the rehearsed prompt: "Did we ever decide how to keep sessions whose transcript files were deleted? What were the options, and when was that?"
3. The agent uses the Claudescope `history` skill / MCP server (`claudescope mcp`) to search past sessions.
4. It answers with: the decision, the alternatives, the session id, and the date.
5. Ask "where did that come from?" and show the raw JSONL record, then the same session in Claudescope.

## Live elements in the deck

Two live moments, each with a static fallback. Nothing runs inside the slides.

| Moment | Live form | Fallback |
| --- | --- | --- |
| Opening question (slide 2) | Switch to a prepared Claude Code window, paste the rehearsed prompt | Last slide: screenshot of the recorded answer, reached with `End`; return with `O` and a click on slide 3 |
| Reconstruction (slide 5) | Switch to a Claudescope browser window already open on the demo session | The screenshot on the slide itself |

Pre-talk checklist: `claudescope start`, Claudescope tab open on `http://127.0.0.1:4317/sessions/939387c7-8a25-4e80-9b7c-6106932bbe6d`,
Claude Code open in the Claudescope repository with a large font, notifications off. Claudescope and Deckrun are local;
Claude Code needs the API.

## Constraints on the question

- A real technical decision with its reasoning, from a real but sanitised session.
- Absent from the current conversation, `CLAUDE.md`, `AGENTS.md`, README and auto-memory.
- Under two minutes end to end, rehearsed with the exact prompt.
- No employer, client, credential, home path or personal data anywhere in the transcript or the answer.

The source session and why it qualifies are in `notes/demo-decision.md`.

## Fixtures

`fixtures/` holds synthetic records whose shape follows the real formats inspected on 2026-09-08
(see `sources.md`). Content is invented; signatures and encrypted payloads are replaced with `FIXTURE_*` strings.

| File | Shows |
| --- | --- |
| `fixtures/claude-code/session.jsonl` | user prompt, assistant thinking+tool call, tool result, decision text, `compact_boundary`, compaction summary |
| `fixtures/claude-code/memory/` | `MEMORY.md` index plus two memory facts, one good, one deliberately scope-less |
| `fixtures/codex/rollout.jsonl` | rollout envelopes, `reasoning` with `encrypted_content`, `compacted` with `replacement_history` |
| `fixtures/pi/session.jsonl` | threaded records, `toolResult` role, plaintext thinking (shape checked against the pi-coding-agent 0.85.1 types) |

## Fallback

`fallback/` will hold the screenshot and a short recording of the rehearsed run. The appendix slide shows the
screenshot; skip it when the live run works. Both must be produced from the rehearsed run in the Claudescope
repository, with notifications off and a large terminal font.
