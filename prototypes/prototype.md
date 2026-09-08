# Inside Coding Agents

## Context, Memory, and What Survives Between Sessions

Vladislav Ramazaev · AI Native Amsterdam · 25 November 2026

<!-- notes: Prototype slide 1 of 3: the title slide. -->

---

## Where did this answer come from?

One record from `~/.claude/projects/<project>/<session-id>.jsonl`

```json
{"type":"assistant",
 "uuid":"9f2c...","parentUuid":"4b71...",
 "sessionId":"c0ffee12-...","timestamp":"2026-07-14T09:41:03.118Z",
 "cwd":"/work/session-digest","gitBranch":"feat/storage",
 "message":{"role":"assistant","model":"claude-opus-5","content":[
   {"type":"thinking","thinking":"","signature":"EqQBCkYIBRgC..."},
   {"type":"text","text":"Going with DuckDB: JSONL is read in place, no ingest step."}
 ],"usage":{"input_tokens":78,"cache_read_input_tokens":41205,"output_tokens":212}}}
```

- **`parentUuid`** links records into a tree, not a list
- **`thinking` is empty**; only the `signature` survives on disk
- The decision lives in `text`, next to its **date, branch, and working directory**

<!-- notes: Prototype slide 2 of 3: the raw JSONL reveal. Point at the three highlighted fields only. -->

---

## How a correct note becomes poison

1. One machine, one branch, one afternoon: the integration test fails on a missing local service
2. The agent finds a workaround that is **valid right there**
3. It saves the observation as project memory:

> Skip `PaymentsIntegrationTests`; they are flaky and unrelated to feature work.

4. The machine, the branch, and the missing service all go away
5. Every future session loads the note **before reading a single line of code**

*The observation was true. The scope was lost.*

<!-- notes: Prototype slide 3 of 3: the memory-poisoning scenario. Read the quoted memory aloud; it sounds reasonable, which is the point. -->
