---
name: storage-engine-duckdb
description: DuckDB is the storage engine for session analytics; chosen 2026-07-14 over SQLite and Parquet+pandas
metadata:
  node_type: memory
  type: project
  originSessionId: c0ffee12-0000-4000-8000-000000000000
  modified: 2026-07-14T09:41:40.000Z
---

DuckDB queries the ~12 GB of session JSONL in place, so there is no ingest step.

**Why:** SQLite needs an ingest step and has weak JSON aggregation; Parquet + pandas is fast once converted, but the conversion is the ingest step we wanted to avoid.

**How to apply:** Write analytics as DuckDB SQL over `read_json_auto('data/*.jsonl')`; do not add an import pipeline.
