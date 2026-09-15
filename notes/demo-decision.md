# Opening demo: decision

## Decision (2026-09-09)

**Source: the Claude Code session "Persist agent memory across deletions" in the Claudescope repository.**

| | |
| --- | --- |
| Session id | `939387c7-8a25-4e80-9b7c-6106932bbe6d` |
| Project | `~/src/claudescope`, branch `main`, Claude Code 2.1.218 to 2.1.220 |
| Dates | 2026-07-23 (first prompt) to 2026-07-27 (decision) |
| Records | 30 on the main line, one Explore subagent transcript in `939387c7-8a25-4e80-9b7c-6106932bbe6d/subagents/` |
| Decision record | `52551e44-18f7-4022-be4f-4af1cadfcfd5`, 2026-07-27T08:35:06Z; its thinking record is `1040ecb1-f0e5-43fd-bc03-f9f85d25ceb6` |

Question for the talk:

> Did we ever decide how to keep sessions whose transcript files were deleted? What were the options, and when was that?

What a correct answer contains:

- Today the reindex prunes files that are gone, the index stores only searchable text and counts, and the
  session route re-reads the JSONL at request time, so a deleted transcript is lost.
- Option one: an archive copy of raw transcripts under the app's own directory. Rejected: "I don't want to
  copy the whole history."
- Option two, the one steered toward: a setting that stops pruning and flags orphaned rows, plus a degraded
  transcript rendered from index rows.
- The open tension: schema bumps and corruption rebuilds discard the index, so either accept best effort or
  export orphaned rows before discarding. The assistant recommended export before discard.
- Session id, dates and agent as above.

Why it qualifies (checked 2026-09-09):

- Nothing was implemented. No commit, plan file, issue, README or CLAUDE.md line in the Claudescope repository
  mentions keeping deleted sessions; plan 0056 goes the other way and prunes cache entries once the source is gone.
- Neither the Claude Code auto-memory for the project nor the Codex memory store carries the decision.
- The only trace is the transcript. The Claudescope project-scoped search ranks the two answer turns first for
  the question's terms; unscoped, unrelated "archive" hits from other projects creep in, so open Claude Code
  inside the Claudescope repository.
- The repository is public, so the transcript needs no sanitising beyond home paths (`--redact`).

Rejected alternatives:

- The DuckDB question from the brief. The DuckDB commit landed 2026-06-03, the oldest indexed session is
  2026-06-21; a fresh session asked on 2026-09-09 (session `72a218a9`) could only reconstruct the rationale from
  code and docs.
- The Claudescope timezone contract (Codex, 2026-08-25): a real choice with alternatives, but written up in
  `docs/plans/0074` and sourced from a Codex rollout while the deck shows a Claude Code record.
- Home assistant and machine-config projects: every decision there is written into a decision register or
  CLAUDE.md, so the agent would answer from files.
- A dedicated demo project with sessions recorded from now on: still possible as a fallback, but by November
  its history would be weeks old rather than months.

## Demo mechanics verified locally

- `claudescope search "<query>"` returns hits with session id, project and record uuid.
- `claudescope session <id> --around <uuid>` returns the surrounding turns as Markdown; `--redact` exists.
- `claudescope mcp` exposes the same through MCP; `claudescope hook session-start` prints a recovery pointer after compaction.
- The `claudescope:history` skill is installed in this Claude Code and triggers on "why did we choose".

## Open items

- Rehearse the exact question in a fresh Claude Code session in the Claudescope repository. Watch whether the
  agent reaches for the history search on its own or stops at what CLAUDE.md says about pruning; if it stops,
  add "check our session history" to the prompt.
- Produce `assets/screenshots/demo-answer.png`, `claudescope-session.png`, and `demo/fallback/demo-run.mp4`
  from that rehearsal.
