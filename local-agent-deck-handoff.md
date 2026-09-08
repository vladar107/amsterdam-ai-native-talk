# Local Agent Handoff: AI Native Amsterdam Talk Deck

Use this document as the source brief for creating and iterating on the talk deck locally.

## Assignment

Create a code-first presentation in Deckrun for a technical meetup talk on 25 November 2026. Work in a dedicated Git repository and keep the deck, assets, demo material, sources, and run instructions reproducible.

Do not treat the outline below as immutable. First create a coherent deck skeleton and validate that it fits a 35–40 minute talk. Prefer depth over covering every possible detail.

## Context

- Event: AI Native Amsterdam.
- Date: 25 November 2026.
- Target speaking time: 35–40 minutes, with approximately 5–10 minutes for questions.
- Audience: very technical, but mixed—software engineers, AI engineers, product managers, vibe-coders, and AI enthusiasts.
- Speaker: Vladislav Ramazaev.
- This is Vlad's first public meetup talk.
- The organisers explicitly asked for fewer topics with greater technical depth.

## Working title

**Inside Coding Agents: Context, Memory, and What Survives Between Sessions**

The final title and public description will be selected after the deck skeleton proves the narrative.

Alternative title to keep available:

**What Does Your Coding Agent Actually Remember?**

## Central idea

Coding agents already preserve much of the project knowledge that developers want them to remember. They leave detailed session histories containing conversations, tool calls, code changes, reasoning state, failures, and decisions. Separately, they may maintain much smaller persistent instruction and memory files that are repeatedly loaded into later sessions.

The main question is not simply how to give agents more memory. It is:

> What deserves to become persistent context, and what should remain historical evidence that is retrieved only when relevant?

## Narrowed scope

The talk should go deep into two connected technical areas:

1. How coding-agent sessions are structured, stored, compacted, and reconstructed.
2. How information from those sessions becomes either persistent memory or retrievable historical knowledge.

Use Claude Code as the main technical example. Use Codex and Pi only as focused contrasts where their approaches differ. Do not give three equal product overviews.

Reasoning is a short bridge between session structure and memory:

- explain plaintext versus opaque reasoning state;
- mention briefly that encrypted reasoning blocks have been shown to be recoverable;
- treat opaque blocks as sensitive session data;
- then move directly into persistent memory.

Recall-bench is one supporting result, not a separate benchmark presentation.

## Intended audience outcome

By the end, attendees should understand:

- what a coding-agent harness stores on disk;
- how stored session history differs from current context and persistent memory;
- what compaction preserves and loses;
- why automatically loaded memory has disproportionate influence;
- how locally correct observations can poison later sessions when their scope is lost;
- when retrieving history is safer than permanently memorising a conclusion.

## Narrative principle

Follow the Great Demo principle “Do the Last Thing First.” Show the useful outcome before explaining how it works.

The talk should begin with the agent successfully answering a question about previous work. Only afterward reveal that the answer came from a difficult-to-read historical session file.

## Proposed opening demonstration

Start in Claude Code with a question such as:

> Why did we choose DuckDB for this project, what alternatives did we consider, and where was this discussed?

The final question must be selected from real, sanitised sessions. It should:

- recover a meaningful technical decision;
- include the original context or reasoning;
- identify the source session and date;
- be absent from the current conversation;
- ideally not already exist in `CLAUDE.md` or another obvious project document;
- take no more than two minutes to demonstrate;
- contain no employer, client, credential, or personal information.

After the answer:

1. Ask where the knowledge came from.
2. Show the original raw JSONL record or file.
3. Show the same session reconstructed into a readable view.
4. Establish that historical availability is not the same as automatic memory.

Claudescope may be used to make the session readable, but it is an inspection instrument, not the subject of the talk. Avoid a product tour or feature list.

## Recommended 35–40 minute arc

### Part 1 — Outcome first: the agent recovers a past decision — 4 minutes

- Live or tightly controlled demonstration.
- Show the recovered answer, source, and date.
- Establish the central question: did the agent remember this, or retrieve it?

### Part 2 — Inside a coding-agent session — 13–15 minutes

Go deep on Claude Code.

Cover only the session elements needed to explain reconstruction:

- JSONL as the durable record;
- user and assistant messages;
- tool calls and tool results;
- parent/child relationships;
- subagents or sidechains;
- reasoning blocks;
- usage metadata;
- compaction boundaries and summaries;
- how these records become the context for another model request.

Use Codex and Pi as short contrasts:

- Codex spreads a turn across multiple rollout event types and stores encrypted reasoning state.
- Pi uses threaded JSONL records, stores tool results separately, and can retain plaintext thinking plus an opaque signature.
- Claude Code stores signed opaque thinking state rather than the plaintext trace.

Verify these details against current formats before finalising the slides. Formats can change.

Avoid enumerating schemas field by field. Use one representative fragment from each harness and annotate only the fields that support the narrative.

### Part 3 — Reasoning state as a bridge — 2 minutes

Distinguish briefly:

- final answer;
- visible reasoning summary;
- full internal reasoning;
- signed or encrypted state returned to the harness.

Mention the paper *Stealing Reasoning Traces from Proprietary LLM APIs*. The point is only that encrypted reasoning blocks have been shown to be recoverable and therefore should not be considered sanitised when sessions are shared.

Do not explain the extraction process, cryptographic construction, attack taxonomy, or dataset in detail unless moved to optional backup slides.

### Part 4 — Session history versus persistent memory — 8–9 minutes

Show actual memory and instruction files:

- global or project `CLAUDE.md`;
- `AGENTS.md`;
- Claude Code's agent-generated project memory facts;
- provenance such as originating session identifiers where available;
- Pi's lack of an equivalent persistent home-directory memory store.

Establish four different layers:

| Layer | Purpose | Automatically available later? |
| --- | --- | --- |
| Current context | Working state available to the model now | Yes |
| Compacted context | Lossy continuation of earlier work | Yes |
| Stored session | Durable historical execution record | Only when resumed or searched |
| Persistent memory | Selected instructions and conclusions | Often loaded into future sessions |

Key statement:

> A transcript may contain more knowledge, but a memory file has more repeated influence.

### Part 5 — Memory poisoning through lost scope — 5 minutes

Use a concrete non-adversarial example:

1. The agent encounters a problem on one machine, temporary branch, or incomplete environment.
2. It discovers a workaround that is valid locally.
3. It promotes the observation into persistent project memory.
4. The machine, branch, task, or time constraint disappears.
5. Future sessions repeatedly receive and apply the generalised conclusion.

Example memories:

- “Skip this test because it is flaky.”
- “The API is unavailable; use a mock.”
- “Disable this validation in development.”
- “Never edit this generated file.”
- “Use this local absolute path.”
- “This module must use the temporary compatibility layer.”

The memory may have been correct when created. The poisoning occurs when a local observation becomes a broader durable instruction.

Practical recommendations:

- review agent-generated memory like code;
- distinguish instructions, decisions, observations, and hypotheses;
- retain date, source session, and scope;
- mark temporary workarounds and expiry conditions;
- replace or supersede stale facts;
- keep uncertain conclusions out of automatically loaded instructions.

Central rule:

> The more automatically information enters context, the stronger its evidence and scope must be.

### Part 6 — Retrieve history instead of memorising everything — 3–4 minutes

Return to the opening example.

Show the conceptual options:

- resume a known session;
- search raw transcripts;
- use an indexed search;
- expose history through MCP;
- teach the agent when to query history through a skill and CLI.

Use one recall-bench result or chart only. Do not create a full benchmark section.

Careful framing:

- the original single-corpus pilot found indexed retrieval 2.8× faster, 2.3× cheaper, and 9 percentage points more accurate than raw-file search;
- later pooled results showed a smaller accuracy difference with uncertainty crossing zero;
- the defensible takeaway is that indexed access reduces retrieval effort, while accuracy depends on corpus and task type;
- synthesis across several sessions is the most interesting workload.

### Part 7 — Conclusion — 2 minutes

Return to the opening answer and close with three ideas:

1. Coding agents preserve more state than their visible conversation suggests.
2. Persistent memory is small but repeatedly influences future work.
3. Searchable history can preserve evidence without permanently loading every past conclusion.

Candidate closing line:

> Before building more memory for your coding agent, inspect what it already stores, review what it keeps injecting into context, and make the rest safely searchable.

## Initial slide map

This is a starting structure, not a requirement to make every item a separate slide.

1. Minimal title slide.
2. The historical question—immediately transition to the opening demo.
3. The answer with its session/date provenance.
4. “Where did this come from?” with raw Claude Code JSONL.
5. The same session reconstructed into readable turns.
6. Four layers: current context, compaction, stored history, persistent memory.
7. Anatomy of one Claude Code session.
8. Tool calls, results, and the event relationship.
9. Subagents/sidechains and parent relationships.
10. What compaction changes.
11. Claude Code versus Codex and Pi—focused differences only.
12. Plaintext and opaque reasoning state.
13. Real persistent memory files.
14. Session history versus memory.
15. Lost-scope poisoning scenario.
16. Rules for safer memory.
17. Retrieve rather than memorise everything, including one recall-bench result.
18. Final three takeaways.

Target approximately 14–18 slides. Combine slides if the technical narrative remains readable. Do not fill slides with the full speaking script.

## Deckrun implementation

Deckrun repository: <https://github.com/arpitbbhayani/deckrun>

At the time this brief was prepared, the inspected package version was `1.6.0`. Verify the latest stable release before pinning it. Do not depend on an unpinned `npx deckrun` for the final presentation.

### Recommended repository structure

```text
coding-agent-memory-talk/
├── slides.md
├── package.json
├── package-lock.json
├── README.md
├── sources.md
├── assets/
│   ├── screenshots/
│   ├── diagrams/
│   └── charts/
├── demo/
│   ├── README.md
│   ├── fixtures/
│   └── fallback/
└── scripts/
```

Do not commit real private agent transcripts. Use sanitised fragments or synthetic fixtures in `demo/fixtures/`.

### Suggested package scripts

Create a local Node project and pin Deckrun as a development dependency. Adapt the theme/template after testing them visually.

```json
{
  "private": true,
  "scripts": {
    "dev": "deckrun slides.md --theme tokyo --template minimal --transition fade",
    "present": "deckrun slides.md --theme tokyo --template minimal --transition fade --fullscreen",
    "lint": "deckrun lint slides.md",
    "check": "deckrun lint slides.md --format json"
  },
  "devDependencies": {
    "deckrun": "1.6.0"
  }
}
```

Do not assume `tokyo` is the final theme. Prepare a three-slide visual prototype in two restrained technical themes before committing to the full deck. Good candidates are `tokyo`, `onedarkpro`, `nord`, or a projector-safe light theme such as `daylight`.

### Important Deckrun authoring rules

- Separate slides with `---` on its own line.
- Deckrun does not support YAML frontmatter; a first-line `---` is not a configuration mechanism.
- A literal `---` inside a fenced code sample still splits the slide; avoid it in displayed source.
- Add speaker notes with `<!-- notes: ... -->`.
- Tag every fenced code block with its language.
- Use `{reveal}` sparingly for staged explanations.
- Use relative assets beside the deck, for example `![Session](assets/screenshots/session.png "right")`.
- Image title directives support `left`, `right`, `bg`, and `opacity:N`.
- Mermaid and KaTeX render in preview, presentation, HTML, and PDF.
- Raw HTML is supported for elements such as `<video>` and `<iframe>`.
- Local videos work when served from the repository; remote embeds require network access.
- Run `deckrun lint slides.md` after every significant revision.
- Content overflow is clipped rather than scrolled, so split dense slides.

### Presentation and export

- Use the file-backed workflow so edits by the local agent reload automatically: `npm run dev`.
- Present from the local browser using Deckrun's presenter controls.
- Keep Terminal, Claude Code, and Claudescope ready in separate macOS windows or spaces.
- Minimise application switching during the talk. The opening demo should be the main switch away from the deck.
- Export a PDF backup after each stable milestone.
- Export a standalone HTML presenter page for a second backup.
- Test the final setup with the actual external-display arrangement before the meetup.
- Standalone HTML may still load fonts, syntax highlighting, KaTeX, and Mermaid from pinned CDNs, so PDF is the strongest offline fallback.

## Visual direction

- Technical, calm, and readable rather than futuristic “AI” imagery.
- Use a consistent monospace accent for JSONL, file paths, event types, and commands.
- Prefer real annotated screenshots and small schema fragments over decorative illustrations.
- Keep title slides and section transitions minimal.
- Use large type and one dominant idea per slide.
- Highlight only the two or three important fields in raw JSONL examples.
- Use the same example decision throughout the talk to maintain continuity.
- Avoid generic robots, brains, glowing neural networks, and excessive gradients.

Before building the entire deck, create a visual prototype containing:

1. the title slide;
2. the raw JSONL reveal slide;
3. the memory-poisoning scenario slide.

Render or screenshot both candidate themes and ask Vlad to select one.

## Demo safety and reliability

- Use a dedicated demonstration project or sanitised copy.
- Search all fixtures and screenshots for credentials, tokens, email addresses, employer/client names, home paths, and personal data.
- Remove signed/encrypted reasoning payloads from anything committed or distributed.
- Use a clean terminal profile with large readable text.
- Disable desktop notifications.
- Prepare screenshots and a short recording of the opening demo.
- Add a fallback slide immediately after the live-demo slide; keep it hidden or skip it when the demo succeeds.
- Ensure the demo works without network access where possible.
- Do not rely on a model producing novel wording or tool choices live. Constrain and rehearse the exact path.

## Source repositories and references

Use primary sources and current repository code for technical claims.

- Claudescope: <https://github.com/vladar107/claudescope>
- recall-bench: <https://github.com/vladar107/recall-bench>
- Deckrun: <https://github.com/arpitbbhayani/deckrun>
- Claude Code documentation: <https://docs.anthropic.com/en/docs/claude-code>
- OpenAI Codex documentation: <https://developers.openai.com/codex/>
- Pi coding agent: locate and verify the exact upstream repository used by the inspected session format before citing it.
- Reasoning-trace paper: <https://arxiv.org/abs/2608.09867>
- ByteByteGo summary: <https://blog.bytebytego.com/p/how-to-steal-an-ai-models-private>
- Great Demo “Do the Last Thing First”: <https://greatdemo.com/illustrations-doing-the-last-thing-first/>

Keep detailed citations in `sources.md`. Speaker-facing citations do not need to dominate the slide, but every research claim and third-party visual must remain traceable.

## Technical claims that must be verified locally

Before placing any of these on an audience-facing slide, inspect current session files and connector implementations:

- exact Claude Code record types and compaction representation;
- what Claude Code stores for thinking and signatures;
- exact Codex rollout event types and encrypted reasoning fields;
- Pi's current session structure and plaintext thinking representation;
- how each harness links subagents or child sessions;
- which memory files are automatically loaded and under what scope;
- whether generated memory behavior is enabled by default or experimental;
- current recall-bench submissions and aggregate results.

Do not generalise Claudescope's normalised schema as if it were a provider's native format.

## First implementation milestone

Do not attempt to finish the entire presentation in the first pass.

Deliver:

1. Repository scaffold with pinned Deckrun dependency and run instructions.
2. A complete low-detail `slides.md` skeleton covering the full narrative.
3. Three polished prototype slides in two visual variants.
4. A proposed opening-demo decision based on inspected safe sessions.
5. A list of technical claims requiring further verification.
6. Estimated timing for every section and the total talk.
7. Successful Deckrun lint output.

After Vlad approves the narrative and visual direction, expand the technical slides, prepare demonstrations, add the final recall-bench chart, and refine speaker notes.

## Definition of done for the final deck

- The spoken version consistently fits within 35–40 minutes.
- Session internals and memory are clearly the two main technical areas.
- Claude Code receives most of the technical depth.
- Codex and Pi appear only where they clarify a meaningful contrast.
- Reasoning recoverability takes no more than one short slide or callout.
- recall-bench takes no more than one slide.
- Every live demonstration has a tested fallback.
- No sensitive information is present in source, assets, exports, or repository history.
- The deck passes `deckrun lint`.
- PDF and standalone HTML backups are produced and tested.
- Final title and public talk description accurately match the completed deck.
