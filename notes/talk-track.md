# Talk track

What to say, slide by slide. Rehearse it out loud; don't memorise it. The **bold sentences** are the anchors to
land word for word. Everything else can be said in your own words. Times are the targets from `timing.md`.

Rule of thumb for a first talk: slow down on the anchors, pause after each one, and don't apologise for the demo.

---

## 1 · Title (0:30)

> Hi, I'm Vlad. I want to start by asking my coding agent about something I did three months ago, and see what
> it knows.

*Switch to the Claude Code window.*

## 2 · One evening in August (2:30 · live)

*The question is in your clipboard; it is never on a slide.*

> Three months ago I spent an evening trying to get a mute button for my audio interface, an Audient iD14, from
> Raycast. I don't remember how it ended. Let's ask my agent.

*Switch to the Claude Code window.*

> This is a fresh session. No resume, no history in the window. It's sitting in my `src` folder. No `CLAUDE.md`,
> no notes, and its memory for this folder is empty.

*Paste the question. While it runs:*

> You can see what it's doing: it loads a history skill, runs a search, opens one old session. That's the whole
> trick.

*When the answer lands, read two lines of it:*

> No OS-level mute on the device. A virtual audio router would work, but I didn't want a daemon running all the
> time. So: mute per app, Teams and Zoom extensions. Twenty-seventh and twenty-eighth of August. That's exactly
> what happened.

*Back to the deck.*

## 3 · Did it remember, or did it retrieve? (1:30)

> So, did it remember that? No. Nothing about that evening was in its context when I started. It found a file
> from three months ago and read it.
>
> **Having the history is not the same as remembering it.**
>
> That's the whole talk. For the next half hour, I'll show what's actually in that history, what the agent
> carries from one session to the next, and why I think the second one deserves a lot more suspicion than it
> usually gets.

## 4 · The raw record (2:00 · live)

*Live, in the terminal. Commands are in `demo/README.md`.*

> So where did that come from? Here's the folder every Claude Code session ends up in. One folder per working
> directory, one file per session. This is the one from August. Seven hundred kilobytes.
>
> One line of it looks like this. *(the unreadable line)* Nobody reads that. Let me pull out two records.

*Back to the deck.*

> Same two records, trimmed.
>
> First thing: `parentUuid`. Records point at their parent, so a session is a tree, not a list. The reasoning and
> the answer are separate records, six seconds apart.
>
> Second: provenance. Every record carries a timestamp and the working directory. Look at the directory: `src/micbridge`.
> That was the prototype. I deleted that folder this week. **The folder is gone; the record of why is still here.**
>
> Third: the thinking block. The text is empty. What's stored is a signature, an opaque blob. Hold that thought;
> we'll come back to it.

## 5 · The same session, reconstructed (2:00 · live)

*Switch to the Claudescope window.*

> Nobody reads JSONL for fun, so I wrote a small viewer for these files. It's called Claudescope, and it's not
> the point of the talk. It groups records into turns, pairs each tool call with its result, and shows tokens and
> cost per turn.

*Scroll to the last turn.*

> Here's the evening: "macOS has no native patchbay", my very articulate reply, and the recommendation.
> **This file was readable all along. Just not by humans, and not by the agent unless it goes looking.**

*Back to the deck.*

## 6 · What the harness keeps to rebuild a session (2:30)

> You don't need to remember any formats. Three facts will do: the transcript is more complete than the chat,
> context is rebuilt from it, and compaction removes context but not history.
>
> A session file holds more than the conversation. Tool results come back as *user* messages pointing at the
> call. Big outputs get spilled to side files, and the model only saw a two-kilobyte preview. The harness injects
> its own context too: environment, reminders, hook output. Then there's housekeeping: titles, mode changes,
> file snapshots.
>
> In one real session of almost seven thousand records, **only about a third was conversation**.

## 7 · Compaction (2:00 · live)

*Switch to Claudescope, open the prepared compaction session (`npm run demo -- open compaction`), scroll to the
boundary.*

> This is the second fact. When the context fills up, the harness compacts it, or you ask it to. A few weeks ago I
> had Claude Code check my talk track against these slides, then typed `/compact`: ninety thousand tokens in,
> twenty-six thousand out, forty seconds.
>
> Two details I find interesting. The summary arrives as a *user* message. The model didn't write a note to
> itself; it gets handed a summary and reads it like a briefing. And the parent chain is cut on purpose, with a
> pointer back to where it was.
>
> **Nothing before this line is in the model's context anymore, except what the summary kept. All of it is still
> in the file.**

*Scroll to the last turn:* "And after it, it still knew which mismatch it had found, from the summary alone."

*Back to the deck:* "Automatic ones get bigger. This one was a million tokens in, seventeen thousand out, in
under three minutes."

## 8 · How the next request is rebuilt (1:30)

> Here's the third fact as a picture. To continue a session, the harness takes the file, drops the housekeeping,
> cuts at the last compaction, and turns the rest into messages. Claude Code documents exactly that: the last
> summary, what it left unsummarised, and everything since.
>
> Instructions and memory come in on a *separate* path, with their own rules. **What the model sees is the
> intersection, never the whole file.** The rest of the talk is about that second path.

## 9 · Codex and Pi, where they differ (2:00)

> Quickly, so you don't think this is one vendor's quirk. Three questions, three agents.
>
> Structure: Claude Code links records into a tree. Codex writes typed events, so one turn is spread across
> several of them. Pi threads messages by id.
>
> Reasoning: Claude Code keeps a signed blob, Codex an encrypted one. Pi keeps whatever text the provider returns,
> next to the provider's signature.
>
> Compaction: all three replace earlier context with a summary, and the earlier records stay in the file.
>
> Different shapes, same idea. **The record outlives the context.**

## 10 · Opaque reasoning is still sensitive (2:00)

> Back to that empty thinking field. There are four different things here: the answer, a visible summary of the
> reasoning, the full reasoning, and a blob handed back to the harness so the next turn can continue. In Claude
> Code and Codex, on disk you almost always get the fourth.
>
> It's tempting to think "encrypted, so it's safe to share". A paper from this summer took encrypted reasoning
> blocks from session logs people had published, decoded them, and found hundreds of pieces of personal data and
> almost two hundred credentials.
>
> **Encryption is not sanitisation. Strip those blocks before you share a transcript.**

## 11 · Session history versus persistent memory (2:00)

> Now the second half: memory. Four kinds of state, two questions: does it reach the next turn, and does it reach
> a new session?
>
> Current context: next turn yes, new session no. The compacted summary: only if you resume. The stored transcript
> is the only complete one, and it's the only one you have to go and *get*. Instructions and memory: usually
> loaded automatically, within their scope rules.
>
> **The demo answer came from the third row. Most "give your agent memory" work targets the fourth.**

## 12 · Memory files and their provenance (2:00 · live)

*Switch to Claudescope, Memory page, open the prepared fact.*

> Here's what that fourth row looks like on disk: your global and project instruction files, and a folder of
> facts the agent writes for itself, with an index that loads at the start of every session.
>
> Here's a real one. Claude Code wrote it while I was building this deck: until the talk, run demos only through
> the isolated setup. A name, a one-line description, and `originSessionId`, a pointer back to the session that
> wrote it. That's provenance, and it's good. I'm not going to open that session, though; it's full of my day job.
> Provenance points somewhere, but not always somewhere you can show.
>
> Notice the date in it, too. It expires after tonight. Hold on to that; it's one of the rules in a minute.
>
> **Whether anything ever reads that pointer is another matter.**

## 13 · More knowledge, or more influence (1:30)

> Put the two side by side. The transcript: a million tokens, and nobody reads it unless they search. A memory
> fact: a few hundred tokens, and its one-line summary is in front of the agent before you've typed anything. The transcript is what
> happened. The memory is someone's *judgement* about what happened.
>
> So a wrong transcript costs you one bad answer. A wrong memory costs you the same bias in every session it
> loads into.
>
> **A transcript has more knowledge. A memory file has more influence.**

*Pause here. This is the sentence people will repeat.*

## 14 · How a correct note becomes poison (3:00)

> Here's how that goes wrong, and nobody has to attack anything.
>
> One afternoon, on one branch, on one machine, an integration test fails because a local service isn't running.
> The agent finds a perfectly reasonable workaround: on this branch, while that service is down, skip those tests.
> That was true.
>
> Then it saves a memory, and the memory says: skip those tests, they're flaky. The branch merges, the service
> comes back, the machine gets reinstalled. The note stays, and every session it's loaded into starts out believing
> those tests don't matter.
>
> **The observation was true. The scope was lost.**
>
> You've all seen versions of this: "the API is down, use a mock", "never touch this generated file", "use this
> absolute path". Each one was correct, once.

## 15 · Rules for memory that is loaded automatically (2:00)

> So what do you do? Treat agent-written memory like code, because it runs on every session. Say what kind of
> thing each note is: instruction, decision, observation, hypothesis. Today the loader treats them all alike.
> Keep the date, the session and the branch. Give workarounds an expiry. Replace stale facts; don't pile up new
> ones on top.
>
> Instructions are the strongest case for loading every time. Decisions and observations usually need a scope, or
> they should be searched for, not loaded.
>
> **The more automatically information enters context, the stronger its evidence and scope must be.**

## 16 · Retrieve the history instead (3:00)

> Which brings us back to the opening. The agent didn't memorise my audio decision. It retrieved it. There's a
> ladder of ways to do that: resume a session you know, grep the raw files, index them once and search the index,
> expose that over MCP, and, the part people skip, teach the agent *when* to look back. In the demo, that last
> part was a skill.
>
> Is an index worth it? I measured. Top panel: on every corpus I tried, raw search took more than twice as long
> and cost about twice as much. Bottom panel: the pilot said the index was nine points more accurate, but with
> more corpora that shrank to about two, and the interval crosses zero.
>
> **Indexing makes retrieval cheaper. I can't show it makes it more accurate.** And to be clear: I wrote both the
> benchmark and the indexer, so take it with that in mind.

## 17 · Three things to take home (2:00)

> Three things. Your coding agent keeps far more than the chat shows. Memory is small, but it's in every session.
> And searchable history gives you the evidence without loading every old conclusion into every new session.
>
> The agent at the start didn't remember my audio interface. It went and looked, and the record was good enough
> to find.
>
> **Before building more memory for your coding agent, inspect what it already stores, review what it keeps
> injecting into context, and make the rest safely searchable.**
>
> The deck, the sources and the tools are behind the left QR code. Thank you.

---

## If the demo fails

- **No answer after about 45 seconds, or an API error:** "The demo gods want a sacrifice. Here's what it found in
  rehearsal:" then say the four points from slide 2's notes and go to slide 3. Slides 4 and 5 show the real record.
- **It searches files instead of history:** type "check our session history" and keep talking.
- **The network is down:** skip the live question the same way. Everything after slide 2 works offline; the
  terminal and Claudescope are local.
- **Claudescope or the terminal misbehaves:** stay on the slide; it shows the same thing.

## Likely questions, short answers

- **"Isn't this just RAG over transcripts?"** Yes, deliberately. The interesting part isn't the retrieval, it's
  deciding what gets loaded automatically and what has to be retrieved.
- **"Does Claude Code send this history anywhere?"** The transcripts are local files. The model sees what gets
  rebuilt into the request, nothing more.
- **"Should I turn auto-memory off?"** No. Read it like code review once a week, and give workarounds an expiry.
- **"Why not one big memory file?"** It loads every session, and it carries the same bias every session.
  That's slide 13.
- **"Can I use Claudescope?"** It's open source, linked from the repository, but anything that reads these files
  will do. `jq` will do.
