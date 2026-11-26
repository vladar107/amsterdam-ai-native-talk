<link rel="stylesheet" href="assets/talk.css">
<div class="l-title"></div>

# Inside Coding Agents

## Context, memory, and what survives between sessions

<div class="byline"><span>Vladislav Ramazaev</span><span>AI Native Amsterdam · 25 November 2026</span></div>

<!-- notes: [0:30 · running 0:30]
Hi everyone. I'm Vlad. I write software for a living. For the last year, I've written most of it together with coding agents. 
And as all you I have a tendency to forget things. 
-->

---

## One evening in August

*A fresh session. No notes, no `CLAUDE.md`, no memory.*

<div class="live">live · Claude Code</div>

<!-- notes: [2:30 · running 3:00] LIVE · Claude Code window
SAY: "TThree months ago, in August, I spent an evening on a small problem. I have an audio interface on my desk. And I wanted a mute button for its microphone in Raycast. One hotkey, mic off. I don't remember how it finished, so let's ask the agent"
DO: "Did we ever work out how to toggle my Audient iD14 mic from Raycast? What options did we look at, what did we end up recommending, and when was that?"
WHILE IT RUNS: This is Claude Code, and this is a fresh session. I did not resume anything. There is no history in this window.
It is running in my `src` folder. There is no `CLAUDE.md` here, no notes, and the agent's memory for this folder is empty.
EXPECT: Watch what it does. It loads a skill called history. It runs a search. It opens one old session and reads a few turns of it. That's all it does. -->

---

## Did it remember, or did it retrieve?

| What we saw | Where it lives |
| --- | --- |
| The decision and the alternatives | A session file from three months earlier |
| The date and the session id | The file name and the records inside it |
| Nothing of this in the current context | Until the agent went and searched |

**Having the history is not the same as remembering it.**

<!-- notes: [1:30 · running 4:30]
So. Did it remember that?
No. When I started that session, nothing about that evening was in its context. Not one word. It found a file from three months ago, and it read it.
Look at the table. The decision and the alternatives came from a session file. The date and the session id came from the same file. And none of it was in the context until the agent searched for it.

**Having the history is not the same as remembering it.**

That's the whole talk. For the next half hour I'll show you three things. What is really in that history. What the agent carries from one session to the next. And why I think we should question that second one much more than we usually do. -->

---

## The raw record

<div class="live">live · terminal</div>

`~/.claude/projects/-Users-…-src/bdd809e6-….jsonl`, two lines of it:

```json
{ "type": "assistant", "uuid": "a913a34d…", "parentUuid": "76826dfd…",
  "timestamp": "2026-08-28T12:06:45.145Z", "cwd": "~/src/micbridge",
  "message": { "content": [
    { "type": "thinking", "thinking": "", "signature": "CAISuA4KpwEIERgC…" } ] } }

{ "type": "assistant", "uuid": "2b5b3b6a…", "parentUuid": "a913a34d…",
  "timestamp": "2026-08-28T12:06:51.088Z", "cwd": "~/src/micbridge",
  "message": { "content": [
    { "type": "text", "text": "…my recommendation: take the per-app route…" } ] } }
```

- **`parentUuid`**: records form a tree, not a list; reasoning and answer are separate records
- **`timestamp`, `cwd`**: provenance travels with the decision; that folder is gone, the record is not
- **`thinking` is empty**; only the `signature` is on disk

<!-- notes: [2:00 · running 6:30] LIVE · terminal
So where did the answer come from? Let me show you the real files.
Every Claude Code session is stored here, in your home directory. One folder per working directory. One file per session. This is the one from August. Seven hundred kilobytes for one evening.
And this is one line of it. Nobody reads that. Let me take two records and make them readable.
Here are the same two records, trimmed. Three things to notice.

First, `parentUuid`. Every record points at its parent. So a session is a tree, not a list. And the reasoning and the answer are two separate records, six seconds apart.

Second, provenance. Every record has a timestamp and the working directory. Look at the directory: `src/micbridge`. That was the prototype from that evening. I deleted that folder a month ago.
**The folder is gone; the record of why is still here.**

Third, the thinking block. The text is empty. What is stored is a signature, a blob I can't read. Remember that. We'll come back to it.
-->

---

## The same session, reconstructed

<div class="live">live · Claudescope</div>

![The demo session in Claudescope, grouped into turns](assets/screenshots/claudescope-session.png "right")

- Records grouped into **turns**
- Tool calls paired with their **results**
- Tokens and cost **per turn**
- Search across every indexed session

<!-- notes: [2:00 · running 8:30] LIVE · Claudescope
Nobody reads JSONL for fun. So let me show a viewer for these files. 
It groups the records into turns. It puts every tool call next to its result. And it shows tokens and cost for each turn.
And here is that evening. The agent tells me that macOS has no built-in way to connect one audio device to another. And then the recommendation we just heard.

*This file was readable all along. Just not by humans, and not by the agent unless it goes looking.**
-->

---

## What the harness keeps to rebuild a session

| Needed to rebuild | Where it is on disk |
| --- | --- |
| Messages and tool calls | `user` and `assistant` records; a tool result is a `user` record pointing at the call |
| Provenance | `timestamp`, `cwd`, `gitBranch`, `sessionId` on every record |
| Large tool output | Spilled to `<session-id>/tool-results/*.txt`; the model saw a 2 KB preview |
| Harness-injected context | `attachment` records: environment, reminders, hook output |
| Housekeeping | Titles, mode changes, PR links, file snapshots |

In one real 6,682-record session, **about a third** was conversation.

<!-- notes: [2:30 · running 11:00]
Now let's look at the structure. You don't need to remember any format from this talk. Three facts are enough.
One: the transcript is more complete than the chat. 
Two: the context is rebuilt from it. 
Three: compaction removes context, but it does not remove history.

This slide shows the first fact. A session file holds much more than the conversation.
Messages and tool calls are there, of course. But a tool result comes back as a *user* message that points at the call.

Big outputs don't fit. They are written to a side file. The model only saw a two-kilobyte preview. So the transcript is not even complete on its own.

The harness adds its own context too: the environment, reminders, hook output. And then there is housekeeping: titles, mode changes, file snapshots.

I counted one real session. Almost seven thousand records. **Only about a third of it was conversation.**
-->

---

## Compaction: the record survives, the context does not

<div class="live">live · Claudescope</div>

```json
{ "type": "system", "subtype": "compact_boundary",
  "parentUuid": null, "logicalParentUuid": "2f40…",
  "compactMetadata": { "trigger": "auto",
    "preTokens": 1000964, "postTokens": 17382, "durationMs": 172436 } }

{ "type": "user", "isCompactSummary": true, "isVisibleInTranscriptOnly": true,
  "message": { "content": "This session is being continued from a previous
     conversation that ran out of context. Summary: 1. Primary Request and Intent: …" } }
```

- **1,000,964 tokens in, 17,382 out**, in just under three minutes
- The summary arrives as a **`user` message**; the model reads it, it did not write it for itself
- The parent chain is cut; `logicalParentUuid` remembers where it was. **Everything before it is still on disk.**

<!-- notes: [2:00 · running 13:00] LIVE · Claudescope
This shows the second and third facts together. When the context fills up, the harness compacts it. Or you ask for it.
A few weeks ago I asked Claude Code to check my talk notes against these slides. Then I typed `/compact`. Ninety thousand tokens went in. Twenty-six thousand came out. It took forty seconds.
I find two details interesting here.
The summary arrives as a *user* message. The model did not write a note to itself. It gets a summary from someone else, and reads it like a briefing.
And the parent chain is cut, on purpose. There is only a pointer back to where it was.
**Nothing before this line is in the model's context anymore, except what the summary kept. All of it is still in the file.** 

The automatic compactions get much bigger. The one on the slide: a million tokens in, seventeen thousand out, in under three minutes.
-->

---

## How the next request is rebuilt

<div class="flow"><svg viewBox="0 0 1110 200" role="img" aria-label="The session file is filtered, cut at the last compaction boundary and turned into the message list for the model request; instructions, memory and skills join that list on a separate path; new records are appended back to the session file" style="display:block; width:100%; height:auto; font-family:var(--font-mono); font-size:16px;"><rect x="12" y="20" width="150" height="50" rx="8" fill="none" stroke="var(--text)" stroke-width="1.5"/><text x="87" y="51" text-anchor="middle" fill="var(--text)">session.jsonl</text><rect x="202" y="20" width="195" height="50" rx="8" fill="none" stroke="var(--text)" stroke-width="1.5"/><text x="299.5" y="51" text-anchor="middle" fill="var(--text)">drop housekeeping</text><rect x="437" y="20" width="305" height="50" rx="8" fill="none" stroke="var(--text)" stroke-width="1.5"/><text x="589.5" y="51" text-anchor="middle" fill="var(--text)">cut at last compact_boundary</text><rect x="782" y="20" width="125" height="50" rx="8" fill="none" stroke="var(--text)" stroke-width="1.5"/><text x="844.5" y="51" text-anchor="middle" fill="var(--text)">messages[]</text><rect x="947" y="20" width="150" height="50" rx="8" fill="none" stroke="var(--text)" stroke-width="1.5"/><text x="1022" y="51" text-anchor="middle" fill="var(--text)">model request</text><path d="M166,45 H190" stroke="var(--text)" stroke-width="1.5" fill="none"/><path d="M199,45 l-10,-5.5 v11 z" fill="var(--text)"/><path d="M401,45 H425" stroke="var(--text)" stroke-width="1.5" fill="none"/><path d="M434,45 l-10,-5.5 v11 z" fill="var(--text)"/><path d="M746,45 H770" stroke="var(--text)" stroke-width="1.5" fill="none"/><path d="M779,45 l-10,-5.5 v11 z" fill="var(--text)"/><path d="M911,45 H935" stroke="var(--text)" stroke-width="1.5" fill="none"/><path d="M944,45 l-10,-5.5 v11 z" fill="var(--text)"/><rect x="437" y="98" width="305" height="50" rx="8" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="1.5"/><text x="589.5" y="129" text-anchor="middle" fill="var(--text)">instructions + memory + skills</text><path d="M746,123 H844.5 V84" stroke="var(--accent)" stroke-width="1.5" fill="none"/><path d="M844.5,73 l-5.5,10 h11 z" fill="var(--accent)"/><path d="M1022,74 V172 H87 V84" stroke="var(--text)" stroke-width="1.5" fill="none" stroke-dasharray="6 5"/><path d="M87,73 l-5.5,10 h11 z" fill="var(--text)"/><rect x="120" y="158" width="230" height="28" fill="var(--mantle)"/><text x="235" y="178" text-anchor="middle" fill="var(--text)">new records appended</text></svg></div>

- The stored session is the **durable record** a resumed context is rebuilt from
- Instruction and memory files enter on a **separate path**, under their own scope and loading rules
- What the model sees is the **intersection** of the two, never the whole file

*Documented: "the last compaction's summary, the messages that compaction left unsummarized, and every message since." Simplified diagram.*

<!-- notes: [1:30 · running 14:30]
Here is the same thing as a picture. To continue a session, the harness takes the file and removes the housekeeping. It cuts at the last compaction and turns the rest into messages. Claude Code documents exactly that: the last summary, the messages it left unsummarised, and everything since.
Now look at the second arrow. Instructions and memory come in on a *separate* path, with their own rules.
**What the model sees is the intersection, never the whole file.**

The rest of this talk is about that second path. 
-->

---

## Codex and Pi, where they differ

<div class="live">live · Pi · Claudescope</div>

| Question | Claude Code | Codex CLI | Pi |
| --- | --- | --- | --- |
| **How is a session structured?** | Linked JSONL records, `parentUuid` tree | Typed rollout events: `session_meta`, `turn_context`, `response_item` | Threaded messages, `id` / `parentId` |
| **What reasoning state remains?** | Signed opaque state, empty `thinking` | Encrypted opaque state, `encrypted_content` | Plaintext `thinking`, optional `thinkingSignature` |
| **How is earlier context replaced?** | `compact_boundary` + summary message | `compacted` with `replacement_history` | `compaction` entry: `summary`, `firstKeptEntryId` |

<!-- notes: [3:30 · running 18:00] LIVE · Pi window, then Claudescope 

Before that, a quick look at other agents. I don't want you to think only one vendor does this.
DO: "check our session history with claudescope: why is kitty remote control socket-only in my config and not just yes? what else did we look at back then, and when was that?"

While it searches: here is one small project, and three agents. Last week the same five prompts went to Claude Code, to Codex and to Pi. Build a tiny tool, check one thing, compact, answer one question from the summary.
I should say: this one is staged, and I did not even type the prompts. I asked Claude to pretend to be me. It copied my typos. 
Same task, three different files. Claude Code links records into a tree. Codex writes typed events, so one turn is spread over several of them. Pi threads messages by id.
All three compacted. All three answered the last question from the summary. And in all three, the earlier records are still in the file.

That decision was made in Claude Code. Pi just read the record.

*Back to the deck.*

One more row on this slide: reasoning. Claude Code keeps a signed blob. Codex keeps an encrypted one. Pi keeps whatever text the provider returns, next to the provider's signature.
Different shapes, same idea. **The record outlives the context.**
-->


---

## Opaque reasoning is still sensitive

Four things that are not the same:

1. The **final answer**
2. A **visible summary** of the reasoning
3. The **full internal reasoning**
4. A **signed or encrypted blob** returned to the harness so the next turn can continue

- On disk, Claude Code and Codex keep **4**, and almost never 3, in the sessions inspected
- A 2026 paper decoded encrypted reasoning blocks from public session logs: **367 PII artifacts and 182 credentials** from 315k blocks (arXiv 2608.09867)
- **Encryption is not sanitisation. Strip opaque blocks before sharing a transcript.**

<!-- notes: [2:00 · running 20:00]
Back to that empty thinking field, as promised.

There are four different things here, and people mix them up. The final answer. A visible summary of the reasoning. The full reasoning. And a blob that goes back to the harness, so the next turn can continue.

On disk, with Claude Code and Codex, you almost always get the fourth one.

It is tempting to think: it's encrypted, so it's safe to share. A paper from this summer took encrypted reasoning blocks from session logs that people had published, and decoded them. They found hundreds of pieces of personal data, and almost two hundred credentials.
-->

---

## Session history versus persistent memory

| State | Next turn, same session | New session |
| --- | --- | --- |
| **Current context** | Yes | No |
| **Compacted summary** | Yes | Only if resumed |
| **Stored transcript** | Only through replay or search | Only through search |
| **Instructions and memory** | Yes | Usually yes, subject to scope and loading rules |

The demo answer came from the **third row**. Most "give the agent memory" work targets the **fourth**.

<!-- notes: [2:00 · running 22:00]
Now the second half: memory.

Four kinds of state, and two questions. Does it reach the next turn? Does it reach a new session?

The current context: next turn yes, new session no. 
The compacted summary: only if you resume. 
The stored transcript is the only complete one. It is also the only one you have to go and *get*. 
Instructions and memory: usually loaded for you, according to their scope rules.

**The demo answer came from the third row. Most "give your agent memory" work targets the fourth.**
-->

---

## Memory files and their provenance

<div class="live">live · Claudescope</div>

```text
~/.claude/CLAUDE.md                        global instructions
<repo>/CLAUDE.md, <repo>/AGENTS.md         project instructions
~/.claude/projects/<project>/memory/       agent-written facts
  ├── MEMORY.md                            index, one line per fact
  └── stage-demo-isolation.md             one fact
~/.codex/memories/MEMORY.md                Codex: scoped task-group notes
```

```yaml
name: stage-demo-isolation
description: Until the talk on 2026-11-25, live demos run only through scripts/demo.sh …
metadata:
  node_type: memory
  type: project
  originSessionId: 920985f5-3019-44aa-92ce-3f4a6af261d2
  modified: 2026-10-29T09:39:16.542Z
```

**`originSessionId` leads back to the session. Whether anything reads it is another matter.**

<!-- notes: [2:00 · running 24:00] LIVE · Claudescope
Here is what that fourth row looks like on disk. Your global instruction file. Your project instruction file.
And a folder of facts that the agent writes for itself. It has an index that is loaded at the start of every session.

Here is a real one. Claude Code wrote it while I was building this deck. It says: until the talk, run live demos only through the isolated setup. It has a name, a one-line description, and this field, `originSessionId`. That is a pointer back to the session that wrote it.

That is provenance, and it is good. Provenance points somewhere, but you can't always show what's there.

Notice the date in it, too. This note expires after tonight. Remember that. It is one of the rules we'll look at in a minute.
-->

---

## More knowledge, or more influence

| | Stored session | Persistent memory |
| --- | --- | --- |
| Size | A million tokens dropped at one compaction | A few hundred tokens per fact |
| Loaded | When resumed or searched | **Index before the first prompt**, facts on demand |
| Written by | The run itself | A judgement about the run |
| A wrong entry costs | One bad answer, once | The same bias, **every session it is loaded into** |

> A transcript has more knowledge. A memory file has more influence.

<!-- notes: [1:30 · running 25:30]
Let's compare the two.

The transcript: a million tokens, and nobody reads it unless they search. 
A memory fact: a few hundred tokens, and its one-line summary is in front of the agent before you have typed anything.

The transcript is what happened. The memory is somebody's *judgement* about what happened.

So a wrong transcript gives you one bad answer, once. A wrong memory gives you the same bias in every session it is loaded into.

**A transcript has more knowledge. A memory file has more influence.**
-->

---

## How a correct note becomes poison

1. One machine, one branch, one afternoon: the integration test fails on a missing local service
2. The agent finds a workaround that is **valid right there**:

> On this branch, while the local payments service is down, skip `PaymentsIntegrationTests`.

3. It saves the observation as project memory:

> Skip `PaymentsIntegrationTests`; they are flaky and unrelated to feature work.

4. The machine, the branch, and the missing service all go away
5. Whenever that memory is loaded, the note shapes the agent **before it looks at the current situation**

*The observation was true. The scope was lost.*

<!-- notes: [3:00 · running 28:30]
Here is how that goes wrong. And nobody has to attack anything.

One afternoon, on one branch, on one machine, an integration test fails. A local service is not running. The agent finds a reasonable workaround: on this branch, while that service is down, skip those tests.

That was true. On that afternoon it was the right thing to do.

Then the agent saves a memory. And the memory says: skip those tests, they are flaky.

Look at what got lost between the two sentences. The branch. The service. The word "while".

Time passes. The branch is merged. The service comes back. The machine gets reinstalled. The note stays. And every session that loads it starts by believing that those tests don't matter.
-->

---

## Rules for memory that is loaded automatically

- **Review agent-written memory like code.** It runs on every session it is loaded into.
- **Label the kind.** Instruction, decision, observation, hypothesis: today the loader treats them alike.
- **Keep the provenance**: date, session id, machine, branch
- **Give workarounds an expiry**: "until the service is back", "until the branch merges"
- **Supersede, do not accumulate.** A stale fact is worse than no fact.
- **Instructions are the strongest candidates for unconditional loading.** Decisions and observations usually need scope, or retrieval.

> The more automatically information enters context, the stronger its evidence and scope must be.

<!-- notes: [2:00 · running 30:30]
So what do you do about it?

Treat agent-written memory like code, because it runs in every session. Review it.

Say what kind of thing each note is: an instruction, a decision, an observation, or a guess. Today the loader treats them all the same.

Keep the provenance: the date, the session, the branch.
Give workarounds an expiry, like the note you just saw.
And replace stale facts. Don't just keep adding new ones.

Instructions make the most sense to load every time. Decisions and observations usually need a scope. Or they should be searched for, not loaded.

**The more automatically information enters context, the stronger its evidence and scope must be.**
-->

---

## Retrieve the history instead of memorising the conclusion

![Raw transcript search versus an index over MCP or a skill: time, cost and correct answers per question](assets/charts/recall-bench.svg "right")

- **Resume** a known session
- **Grep** the raw transcripts
- **Index** once, search the index
- Expose retrieval through **MCP or a skill**
- Teach the agent **when** to look back

**The index answers in half the time. It is not clearly more accurate.**

<!-- notes: [3:00 · running 33:30]
SAY: back at the opening. It did not memorise my decision, it retrieved it.
WAYS: resume · grep · index · MCP or a skill · teach the agent when to look back. "In the first demo that was a skill. In the second one, it was me."
CHART: three questions, the same three bars each time. Time: 62 s against 27 and 30. Cost: 24 cents against 13 and 20, so 45% cheaper through MCP, 15% through the skill. Correct: 93% against 95 and 95, inside the noise.
SAY: "The index makes retrieval faster and cheaper. I can't show it makes it more accurate."
-->

---

## Three things to take home

1. Coding agents **preserve far more state** than their visible conversation suggests
2. Persistent memory is **small but repeatedly influential**
3. Searchable history keeps the **evidence** without loading every past conclusion

> Before building more memory for your coding agent, inspect what it already stores, review what it keeps injecting into context, and make the rest safely searchable.

<!-- notes: [2:00 · running 35:30]
SAY: the agent did not remember, it retrieved, and the record was good enough to retrieve from.
Read the blockquote. Then the next slide. -->

---

## Thank you

<div style="display:flex; align-items:center; gap:4rem; margin-top:1.5rem;">
  <div style="flex:1; line-height:2; font-size:1.35rem;">
    <strong>Vladislav Ramazaev</strong><br>
    <span style="opacity:0.75;">Claudescope</span> · <a href="https://claudescope.ramazaev.dev" style="color:inherit; border-bottom:none; background:none; text-decoration:underline; text-decoration-thickness:1px; text-underline-offset:0.2em;">claudescope.ramazaev.dev</a><br>
    <span style="opacity:0.75;">recall-bench</span> · <a href="https://github.com/vladar107/recall-bench" style="color:inherit; border-bottom:none; background:none; text-decoration:underline; text-decoration-thickness:1px; text-underline-offset:0.2em;">github.com/vladar107/recall-bench</a><br>
    <span style="opacity:0.75;">LinkedIn</span> · <a href="https://www.linkedin.com/in/vladar107" style="color:inherit; border-bottom:none; background:none; text-decoration:underline; text-decoration-thickness:1px; text-underline-offset:0.2em;">linkedin.com/in/vladar107</a><br>
    <span style="opacity:0.75;">Site</span> · <a href="https://ramazaev.dev" style="color:inherit; border-bottom:none; background:none; text-decoration:underline; text-decoration-thickness:1px; text-underline-offset:0.2em;">ramazaev.dev</a>
  </div>
  <figure style="margin:0; text-align:center;">
    <img src="assets/qr/repo.png" alt="QR code: this talk's repository with the slides, sources and links" style="width:17rem; max-width:100%; border-radius:0.5rem;">
    <figcaption style="font-size:1.05rem; margin-top:0.5rem;"><strong>Slides, sources, links</strong><br><a href="https://github.com/vladar107/amsterdam-ai-native-talk" style="color:inherit; border-bottom:none; background:none; text-decoration:underline; text-decoration-thickness:1px; text-underline-offset:0.2em;">github.com/vladar107/amsterdam-ai-native-talk</a></figcaption>
  </figure>
</div>

<!-- notes: [stays up during questions]
SAY: "Thank you. The code takes you to the slides, the sources and every link. Questions?"
-->
