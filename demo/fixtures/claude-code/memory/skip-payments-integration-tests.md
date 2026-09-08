---
name: skip-payments-integration-tests
description: Skip PaymentsIntegrationTests; they are flaky and unrelated to feature work
metadata:
  node_type: memory
  type: project
  originSessionId: deadbeef-0000-4000-8000-000000000000
  modified: 2026-06-02T15:12:09.000Z
---

Skip `PaymentsIntegrationTests`; they are flaky and unrelated to feature work.

**Why:** They failed during the feature branch work on 2 June.

**How to apply:** Run the suite with `--filter Category!=PaymentsIntegration`.

<!-- Deliberately bad example for the talk: the failure was a missing local service on one
     machine and one branch. The note carries no scope, no expiry, and no evidence. -->
