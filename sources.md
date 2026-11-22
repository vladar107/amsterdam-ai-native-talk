# Sources

Every research claim, third-party visual and format claim on a slide traces back to one of these.
Format claims were verified locally against the versions listed; formats change, re-verify before the talk.

## Primary sources inspected locally (2026-09-08)

| Claim area | Verified against | Notes |
| --- | --- | --- |
| Claude Code session record types, `compact_boundary`, `isCompactSummary`, thinking stored as empty text plus `signature`, `tool-results/` and `subagents/` sidecars, `sourceToolAssistantUUID`, `toolUseResult` | Claude Code 2.1.258–2.1.263, files under `~/.claude/projects/<project>/` | Counts on the anatomy slide come from one real 6,682-record session; only structure and counts were taken from it. |
| Claude Code auto-memory files with `originSessionId` and `MEMORY.md` index | `~/.claude/projects/<project>/memory/` on Claude Code 2.1.26x–2.1.312 | On by default; first 200 lines or 25 KB of `MEMORY.md` load at session start (<https://code.claude.com/docs/en/memory>). |
| Codex rollout envelopes (`session_meta`, `turn_context`, `response_item`, `event_msg`, `compacted`), `reasoning` items with `summary` and `encrypted_content`, `replacement_history` and window ids | codex-cli 0.147.0 rollouts under `~/.codex/sessions/YYYY/MM/DD/`; codex-cli 0.153.2 installed | `history_mode: paginated` observed in `session_meta`. |
| Codex memory store: `~/.codex/memories/MEMORY.md` (scope, applies_to), `raw_memories.md` (per thread with `rollout_path`), `rollout_summaries/` | codex-cli 0.147.0–0.153.2 with `memories = true` in `config.toml` | Off by default, enabled under `[features]` (<https://developers.openai.com/codex/memories>). |
| Pi session header (`type: session`, `version: 3`), threaded `id`/`parentId` records, `model_change`, `thinking_level_change` | pi 0.84.3, one small session under `~/.pi/agent/sessions/` | Observed. |
| Pi `toolResult` role, plaintext `thinking` with optional `thinkingSignature`, `compaction` entry with `summary`, `firstKeptEntryId`, `tokensBefore` | `@earendil-works/pi-coding-agent` 0.85.1: `dist/core/session-manager.d.ts`, `docs/session-format.md`, `docs/compaction.md`, `pi-ai/dist/types.d.ts` | Observed on 2026-09-15 in a 91-record pi 0.85.1 session (OpenAI provider): `thinking` held the reasoning summary, `thinkingSignature` the opaque state; the compaction record also carries `details{readFiles,modifiedFiles}`, `usage` and `fromHook`. |
| Demo session records on the raw-record slide | Claude Code 2.1.247, session `bdd809e6-a231-42a7-8c6f-aec2d256d14a` in `~/src`, 2026-08-27 to 2026-08-28 | Ids and text truncated and `cwd` shortened on the slide. |

## Repositories and documentation

- Claudescope: <https://github.com/vladar107/claudescope> (installed v0.20.0; `search`, `session`, `mcp`, `hook session-start` subcommands used for the demo path)
- recall-bench: <https://github.com/vladar107/recall-bench>
- Deckrun: <https://github.com/arpitbbhayani/deckrun> (pinned 1.6.0)
- Claude Code documentation: <https://code.claude.com/docs/en/memory> (auto-memory), <https://code.claude.com/docs/en/sessions> (what a resumed session reloads)
- OpenAI Codex documentation: <https://developers.openai.com/codex/>
- Pi coding agent: <https://github.com/earendil-works/pi-mono> (package `@earendil-works/pi-coding-agent`, installed 0.85.1; session format documented in `docs/session-format.md` and `docs/compaction.md` of the package)

## Research and third-party material

- Stealing Reasoning Traces from Proprietary LLM APIs: <https://arxiv.org/abs/2608.09867>. Used for one claim only: encrypted reasoning blocks can be decoded (Anthropic, OpenAI and Google), and 315,320 blocks scraped from public repositories yielded 367 PII artifacts and 182 credentials.
- ByteByteGo summary of the above: <https://blog.bytebytego.com/p/how-to-steal-an-ai-models-private>
- Great Demo, "Do the Last Thing First": <https://greatdemo.com/illustrations-doing-the-last-thing-first/>. Narrative principle for the opening.

## recall-bench figures

Recomputed on 2026-10-29 from the raw submissions at commit `66dc060` (the repository publishes no precomputed results
or latency and cost intervals). Method mirrors the repository's `aggregate_submissions.py`: per-question means, then a
machine-level and question-level cluster bootstrap, 5,000 draws. Chart data: `assets/charts/recall-bench.csv`.

- Pilot, one corpus (`submissions/pilot-m0.json`, excluded from the repository's pooled statistics): 41 questions,
  3 repetitions, 123 runs per arm. Indexed vs raw: accuracy +8.9 pp [+0.8, +17.5]; raw took 2.94× as long
  [2.35, 3.83] (the README's 2.8× is the median ratio); raw cost 2.26× as much [1.89, 2.79].
- Pooled, three corpora (`76e5ed2a991d`, `88644446d28c`, `f30508862c36`): 87 questions, 229 runs per arm.
  Accuracy +2.3 pp [−1.1, +6.3]; time 2.35× [1.88, 3.01]; cost 1.82× [1.47, 2.51].
- Chart on the retrieval slide, pooled per-question means: raw files 62.2 s, $0.238, 92.9% correct; index over MCP
  26.5 s, $0.131, 95.2%; index over a skill 29.5 s, $0.201, 95.4%. "Indexed" in the ratios above is the MCP arm.
  Cost against raw files: −45% over MCP, −15% over the skill. Agent model `claude-sonnet-5`, judge `claude-opus-4-8`.
- Effort fell on every corpus (time ratio 1.91–2.63, cost ratio 1.50–2.51). One pooled corpus is the pilot's machine.
- By task type (pooled), the largest accuracy gain is multi-session synthesis, +7.1 pp [0.0, +16.7]; every category's
  interval touches or crosses zero.
- The benchmark's author also maintains Claudescope; the talk says so.
