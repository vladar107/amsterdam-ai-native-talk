# Opening demo

Principle: do the last thing first. The talk opens with Claude Code answering a question about a decision
taken three months earlier, then reveals that the answer was retrieved from a session file, not remembered.

## The path that must work

1. `scripts/demo.sh prepare` (once, before the talk): copies the sessions listed in `corpus.txt` into
   `~/.talk-demo/projects`, starts a second Claudescope on port 4318 that indexes only those, and checks the index
   holds one project.
2. `scripts/demo.sh claude`: fresh Claude Code in `~/src` (no `--resume`, no `--continue`) with the same environment,
   so its `claudescope` calls reach the isolated instance and never the everyday one with work sessions.
3. Paste the rehearsed prompt: "Did we ever work out how to toggle my Audient iD14 mic from Raycast? What options did we
   look at, what did we end up recommending, and when was that?"
4. The agent loads the `claudescope:history` skill on its own, runs `claudescope search` and `claudescope session`,
   and answers with the constraint, the options, the recommendation and the dates.
5. Show the raw JSONL record, then the same session in Claudescope (`scripts/demo.sh open`).

The source session and why it qualifies are in `notes/demo-decision.md`.

## Live elements in the deck

Five live moments, each with its content also on the slide. Nothing runs inside the slides.

| Moment | Live form | Fallback |
| --- | --- | --- |
| Opening question (slide 2) | Claude Code window started with `scripts/demo.sh claude`, paste the prompt | Say what it would have found and move on; slides 4 and 5 show the real record |
| Raw record (slide 4) | Terminal: the real session file (commands below) | The two records on the slide |
| Reconstruction (slide 5) | Claudescope window opened with `scripts/demo.sh open` (port 4318) | The screenshot on the slide |
| Compaction (slide 7) | Claudescope: `scripts/demo.sh open compaction`, the summary turn | The record excerpt on the slide |
| Memory (slide 12) | Claudescope: `scripts/demo.sh open memory`, the `stage-demo-isolation` fact | The file shapes on the slide |

Order on stage: real files once, in the terminal (slide 4); after that, everything is shown in Claudescope.

### Terminal commands for slide 4

```bash
ls ~/.claude/projects
cd ~/.claude/projects/$(echo ~/src | tr / -)    # one folder per working directory; here, ~/src
ls -lh bdd809e6-*.jsonl
grep 2b5b3b6a bdd809e6-*.jsonl | head -c 1500; echo
grep -E '"uuid":"(a913a34d|2b5b3b6a)' bdd809e6-*.jsonl \
  | jq -c '{type, uuid: .uuid[0:8], parentUuid: .parentUuid[0:8], timestamp, cwd,
            content: [.message.content[] | {type, text: ((.text // .thinking)[0:60]), signature: (.signature // "")[0:16]}]}'
```

`ls ~/.claude/projects` lists every project folder on the laptop, including work ones. Rehearse it once on the
projector; if the names are a problem, skip it and start from the `cd`.

## The live material

Both are real, recorded on 2026-10-29 in the talk repository (not in `~/src`, where anything saved would load into
the opening demo), and `demo/corpus.txt` copies them:

- **Slide 7:** session `dc279199`. Claude Code timed the talk track and checked it against the slides, then
  `/compact` (manual, 90,283 → 25,942 tokens, 39 s), then one more question answered from the summary alone.
- **Slide 12:** the memory folder. Claude Code wrote `stage-demo-isolation.md` while the deck was being built; the
  session that wrote it is full of work content and is never copied.

If either is ever re-recorded, scan it for work terms before it goes into `demo/corpus.txt`.

Claudescope and Deckrun are local; Claude Code needs the API, so check the venue network (or a phone hotspot)
before the talk.

## Pre-talk checklist (work laptop)

- [ ] `scripts/demo.sh prepare` prints `✓ demo index: 11 sessions, 2 project(s), 1 memory folder(s)`
- [ ] Focus mode on; Teams, Outlook and Slack quit, not just muted
- [ ] Separate Chrome profile for the deck and Claudescope: no work bookmarks, tabs or extensions in view
- [ ] Terminal profile with a large font and a neutral prompt; `~/src` contains no folder you would not show
- [ ] Claude Code start-up banner checked on the projector: account and organisation name are visible on the work account
- [ ] One rehearsal of the exact prompt on the venue network, under 60 seconds
- [ ] Everyday Claudescope (port 4317) may keep running; the demo never talks to it
- [ ] After the talk: `scripts/demo.sh stop`, and `rm -r ~/.talk-demo` if the copy is no longer wanted

## Constraints on the question

- A real technical decision with its reasoning, from a real session.
- Absent from the current conversation, `CLAUDE.md`, `AGENTS.md`, README and auto-memory.
- Under two minutes end to end, rehearsed with the exact prompt.
- No employer, client, credential or personal data in the answer or in the turns shown.

## Fixtures

`fixtures/` holds synthetic records whose shape follows the real formats inspected on 2026-09-08
(see `sources.md`). Content is invented; signatures and encrypted payloads are replaced with `FIXTURE_*` strings.

| File | Shows |
| --- | --- |
| `fixtures/claude-code/session.jsonl` | user prompt, assistant thinking+tool call, tool result, decision text, `compact_boundary`, compaction summary |
| `fixtures/claude-code/memory/` | `MEMORY.md` index plus two memory facts, one good, one deliberately scope-less |
| `fixtures/codex/rollout.jsonl` | rollout envelopes, `reasoning` with `encrypted_content`, `compacted` with `replacement_history` |
| `fixtures/pi/session.jsonl` | threaded records, `toolResult` role, plaintext thinking, `compaction` entry (shape matches a session recorded with pi 0.85.1 on 2026-09-15) |
