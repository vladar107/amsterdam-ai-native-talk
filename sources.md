# Sources

Every research claim, third-party visual and format claim on a slide traces back to one of these.
Format claims were verified locally against the versions listed; formats change, re-verify before the talk.

## Primary sources inspected locally (2026-09-08)

| Claim area | Verified against | Notes |
| --- | --- | --- |
| Claude Code session record types, `compact_boundary`, `isCompactSummary`, thinking stored as empty text plus `signature`, `tool-results/` and `subagents/` sidecars, `sourceToolAssistantUUID`, `toolUseResult` | Claude Code 2.1.258–2.1.263, files under `~/.claude/projects/<project>/` | Counts on the anatomy slide come from one real 6,682-record session; only structure and counts were taken from it. |
| Claude Code auto-memory files with `originSessionId` and `MEMORY.md` index | `~/.claude/projects/<project>/memory/` on Claude Code 2.1.26x | Whether this is on by default or gated is still to be verified in the docs. |
| Codex rollout envelopes (`session_meta`, `turn_context`, `response_item`, `event_msg`, `compacted`), `reasoning` items with `summary` and `encrypted_content`, `replacement_history` and window ids | codex-cli 0.147.0 rollouts under `~/.codex/sessions/YYYY/MM/DD/`; codex-cli 0.153.2 installed | `history_mode: paginated` observed in `session_meta`. |
| Codex memory store: `~/.codex/memories/MEMORY.md` (scope, applies_to), `raw_memories.md` (per thread with `rollout_path`), `rollout_summaries/` | codex-cli 0.147.0–0.153.2 with `memories = true` in `config.toml` | Feature-flagged in this install; default state to be verified. |
| Pi session header (`type: session`, `version: 3`), threaded `id`/`parentId` records, `model_change`, `thinking_level_change` | pi 0.84.3, one small session under `~/.pi/agent/sessions/` | `toolResult` role and plaintext thinking not yet observed locally; see notes/verification.md. |

## Repositories and documentation

- Claudescope: <https://github.com/vladar107/claudescope> (installed v0.20.0; `search`, `session`, `mcp`, `hook session-start` subcommands used for the demo path)
- recall-bench: <https://github.com/vladar107/recall-bench>
- Deckrun: <https://github.com/arpitbbhayani/deckrun> (pinned 1.6.0)
- Claude Code documentation: <https://docs.anthropic.com/en/docs/claude-code>
- OpenAI Codex documentation: <https://developers.openai.com/codex/>
- Pi coding agent: upstream repository to be confirmed from the installed package before citing (see notes/verification.md)

## Research and third-party material

- Stealing Reasoning Traces from Proprietary LLM APIs: <https://arxiv.org/abs/2608.09867>. Used for one claim only: encrypted reasoning blocks have been shown to be recoverable.
- ByteByteGo summary of the above: <https://blog.bytebytego.com/p/how-to-steal-an-ai-models-private>
- Great Demo, "Do the Last Thing First": <https://greatdemo.com/illustrations-doing-the-last-thing-first/>. Narrative principle for the opening.

## recall-bench figures

- Pilot on one corpus: indexed retrieval 2.8× faster, 2.3× cheaper, 9 percentage points more accurate than raw-file search.
- Later pooled results: smaller accuracy difference with uncertainty crossing zero.
- Both figures must be re-read from the current recall-bench submissions before the chart is final.
