# Opening demo: proposed decision

## Finding

Every Claude Code, Codex and Pi session on this machine belongs to employer repositories or to personal
machine configuration that references employer hosts and home paths. None can be shown or committed, even sanitised.
The DuckDB question in the brief has no matching real session here; the only DuckDB hits are MCP-server
configuration chatter, not a design decision.

## Proposal

**Primary: a dedicated demo project with real sessions recorded from now until the talk.**

- Create a small, public-safe project (working name: `session-digest`, a CLI that aggregates coding-agent
  session JSONL). It doubles as a natural fit for the talk's subject.
- Over the next weeks, take at least one genuine technical decision inside Claude Code with alternatives
  discussed (storage engine, JSONL parsing strategy, or index design). Let the session compact at least once.
- Do not write the decision into `CLAUDE.md`, README or auto-memory. If Claude Code writes an auto-memory
  fact about it, keep the fact but make the demo question require the alternatives and the source session,
  which the memory fact will not carry.
- In November, ask the question in a fresh session with the Claudescope `history` skill available.
  The answer then carries a real session id and a real date from weeks earlier.

Why this over sanitising existing sessions: the transcript is sanitised by construction, the compaction and
memory files are real, and the question can be tuned to the recorded material instead of the other way round.

**Alternative: sessions from the personal laptop on `claudescope` or `recall-bench`.**

If those repositories have a session where a real architecture choice was discussed (for example the
index engine behind Claudescope search), that is a stronger story because it is a real open-source project.
Check the personal machine for such a session; if one exists and is clean, prefer it and keep the demo
project as the fallback.

## Demo mechanics verified locally

- `claudescope search "<query>"` returns hits with session id, project and record uuid.
- `claudescope session <id> --around <uuid>` returns the surrounding turns as Markdown; `--redact` exists.
- `claudescope mcp` exposes the same through MCP; `claudescope hook session-start` prints a recovery pointer after compaction.
- The `claudescope:history` skill is installed in this Claude Code and triggers on "why did we choose".

## Open items

- Decide between primary and alternative after checking the personal laptop.
- Fix the final question wording once the recorded decision exists; replace the DuckDB placeholder on slides 2, 6, 19 and in the fixtures.
- Produce `assets/screenshots/demo-answer.png`, `claudescope-session.png`, and `demo/fallback/demo-run.mp4` from the final material.
