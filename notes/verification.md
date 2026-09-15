# Technical claims: verified and still open

Verified on 2026-09-08 against local installs: Claude Code 2.1.258–2.1.263, codex-cli 0.147.0 (rollout) / 0.153.2 (installed), pi 0.84.3, Claudescope 0.20.0, Deckrun 1.6.0. Pi rows re-verified on 2026-09-15 against a 91-record pi 0.85.1 session (OpenAI provider, `gpt-5.5`, 47 tool calls, one manual compaction).

## Verified locally

| Claim | Evidence |
| --- | --- |
| Claude Code session = one JSONL per session under `~/.claude/projects/<project>/`, plus a directory `<session-id>/` with `tool-results/` and `subagents/` | Directory listing |
| Record types include `user`, `assistant`, `system`, `attachment` and housekeeping types (`ai-title`, `last-prompt`, `mode`, `pr-link`, `queue-operation`, `file-history-snapshot`, `file-history-delta`, `cost-state`) | Type histogram over one session: 6,682 records |
| `system` subtypes: `compact_boundary`, `turn_duration`, `local_command`, `informational` | Subtype histogram |
| `compact_boundary` carries `compactMetadata` with `trigger` (`auto`/`manual`), `preTokens`, `postTokens`, `cumulativeDroppedTokens`, `durationMs`, `preservedSegment{headUuid,anchorUuid,tailUuid}`; `parentUuid` is `null` and `logicalParentUuid` points at the pre-compaction tail | Two boundary records; one auto compaction went 1,000,964 → 17,382 tokens in 172 s |
| The compaction summary is a `user` record with `isCompactSummary: true`, `isVisibleInTranscriptOnly: true`, text starting "This session is being continued from a previous conversation that ran out of context" | Record following the boundary |
| Thinking blocks are stored as `{"type":"thinking","thinking":"","signature":"..."}`; an `attachment` subtype `thinking_stripped` exists | Content-block inspection |
| Tool results are `user` records with `sourceToolAssistantUUID`, a `tool_result` content block and a structured `toolUseResult` | Record inspection |
| Large tool outputs are replaced by a `<persisted-output>` preview pointing at `<session-id>/tool-results/<id>.txt` | Record inspection |
| Subagent transcripts live in `<session-id>/subagents/agent-<id>.jsonl` with a `forked-skill.json` sidecar for skill forks | Directory listing |
| `usage` on assistant records includes `input_tokens`, `output_tokens`, `cache_creation_input_tokens`, `cache_read_input_tokens`, `service_tier`, `speed` | Key listing |
| Claude Code auto-memory: `~/.claude/projects/<project>/memory/MEMORY.md` index plus one Markdown file per fact with frontmatter `metadata.type` (`user`/`feedback`/`project`/`reference`), `originSessionId`, `modified` | Frontmatter inspection, content not read |
| Codex rollouts: `~/.codex/sessions/YYYY/MM/DD/rollout-<ts>-<id>.jsonl`, envelope `{timestamp,type,payload,ordinal}`; types `session_meta`, `turn_context`, `response_item`, `event_msg`, `compacted`, `world_state`, `inter_agent_communication_metadata` | Type histogram over one 13,942-record rollout |
| Codex `response_item` payload types: `message`, `reasoning`, `function_call`, `function_call_output`, `custom_tool_call`, `custom_tool_call_output`, `agent_message`; `reasoning` has `summary` and `encrypted_content` | Payload inspection |
| Codex `compacted` payload: `replacement_history`, `window_number`, `first_window_id`, `previous_window_id`, `window_id`; `session_meta.history_mode = paginated` | Payload inspection |
| Codex memory store: `~/.codex/memories/{MEMORY.md, raw_memories.md, memory_summary.md, rollout_summaries/}` plus `memories_1.sqlite`; notes carry `scope`, `applies_to`, `thread_id`, `rollout_path`, `updated_at`; enabled by `memories = true` in `config.toml` | Shape inspection, content not read |
| Pi sessions: `~/.pi/agent/sessions/<encoded-cwd>/<ts>_<id>.jsonl`, header `{type:"session",version:3,id,timestamp,cwd}`, records threaded by `id`/`parentId`; record types seen: `message`, `model_change`, `thinking_level_change`, `compaction`; `message.role` in `user`/`assistant`/`toolResult` | One 7-record session (pi 0.84.3) and one 91-record session (pi 0.85.1) |
| Pi tool calls are `toolCall` content blocks (`id`, `name`, `arguments`) on the assistant message; the result is its own `message` record with role `toolResult`, `toolCallId`, `toolName`, `content[]`, `isError`, stored inline (largest seen 9.7 KB, no sidecar file) | 47 call/result pairs in the pi 0.85.1 session |
| Pi thinking blocks are `{type:"thinking", thinking, thinkingSignature}`; `thinking` holds whatever text the provider returns, `thinkingSignature` the opaque state. With the OpenAI provider `thinking` was the reasoning summary (33–101 characters) and the signature 1.5–3.3 KB | 25 thinking blocks in the pi 0.85.1 session; the full-text case with an Anthropic model is still only from the type definitions |
| Pi assistant messages carry `api`, `provider`, `model`, `stopReason`, `rawStopReason`, `responseId` and `usage` (`input`, `output`, `cacheRead`, `cacheWrite`, `reasoning`, `totalTokens`, `cost`) | Key listing |
| Pi compaction is a `compaction` record with `summary` (Markdown, about 4 KB), `firstKeptEntryId`, `tokensBefore`, `details{readFiles,modifiedFiles}`, `usage`, `fromHook`; the summarised records stay in the file, `firstKeptEntryId` points back into them, and the next user message has the compaction record as `parentId` | One manual `/compact` at 32,511 tokens |
| Pi keeps no home-directory memory store | `~/.pi/agent/` holds only `auth.json`, `models-store.json`, `settings.json`, `trust.json`, `sessions/` |
| Claudescope exposes `search`, `session`, `sessions`, `mcp`, `hook session-start`, `--redact` | `claudescope --help` |
| Deckrun 1.6.0: `---` splits inside fences, no frontmatter, `<!-- notes: -->`, `{reveal}`, image title directives, `/__pdf` and `/__present` local routes, `lint` with `--format json` | README and `dist/index.js` |

## Still to verify before the slides are final

1. **Pi full-text thinking with an Anthropic model.** *Not yet observed.* The pi 0.85.1 session recorded on 2026-09-15 used the
   OpenAI provider, so `thinking` held the reasoning summary and `thinkingSignature` the opaque state. The type definitions
   (`pi-ai/dist/types.d.ts`: `{type:"thinking", thinking: string, thinkingSignature?: string, redacted?: boolean}`) say the
   field stores whatever the provider returns; record one session with an Anthropic model to see the full text on disk.
   A `branch_summary` entry with `fromId` (from `docs/compaction.md`) is also still unobserved.
2. **Codex subagent / child-thread linkage.** `inter_agent_communication_metadata` and `agent_message`
   records exist; how a child rollout is referenced is not yet inspected.
3. **Claude Code auto-memory default state.** Check the documentation for whether the `memory/` directory
   is default-on or gated, and the exact scope of what `MEMORY.md` loads.
4. **Codex memories default state.** This install has `memories = true` explicitly; confirm the default.
5. **How Claude Code rebuilds the request** (slide 8 flowchart): which record types are replayed, and
   whether attachments become context. Currently inferred from the records; confirm against documentation
   or `--resume` behaviour.
6. **recall-bench numbers.** Re-read the current submissions and pooled results; produce the single chart.
7. **Reasoning-trace paper.** Re-read the abstract so the one-line claim on slide 10 matches what the paper shows.
8. **Claude Code version drift.** Sessions here were written by 2.1.258–2.1.263 and the demo session by 2.1.218–2.1.220; re-check record shapes in November.
9. **Sensitive data sweep** of every fixture, screenshot and export before committing them (no employer names,
    hosts, home paths, tokens, emails).
