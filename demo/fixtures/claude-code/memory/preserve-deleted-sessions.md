---
name: preserve-deleted-sessions
description: Deleted transcripts stay in the index behind a setting; decided 2026-07-27 over copying raw files
metadata:
  node_type: memory
  type: project
  originSessionId: c0ffee12-0000-4000-8000-000000000000
  modified: 2026-07-27T08:35:40.000Z
---

When a source transcript disappears, the reindex flags its rows as orphaned instead of pruning them, if the setting is on. Default off.

**Why:** Copying raw transcripts into the app directory was rejected as too much data; the index already holds searchable text, tokens and cost, which is enough for search, analytics and a degraded transcript.

**How to apply:** Do not add a prune-skip without the export-before-discard step; a schema bump or corruption rebuild discards the index and would silently drop the orphaned rows.
