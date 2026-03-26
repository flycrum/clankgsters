---
name: clankgster-e2e-run-all
description: Run all @clankgster/sync e2e tests. Use when you need the full sandbox + manifest suite.
---

# Run all e2e tests

Use when you need **every** config-driven case under `src/test-cases/`.

## When to use

- User asks to run all e2e tests for sync
- After changing sync behaviors, config, or manifest logic

## How to run

From **monorepo root**:

```bash
pnpm e2e-tests:run
```

Or:

```bash
pnpm -F @clankgster/sync-e2e run e2e-tests:run
```

From **`packages/clankgster-sync-e2e`**:

```bash
pnpm run e2e-tests:run
```

## Reference

- [e2e-tests-overview.md](../references/e2e-tests-overview.md)
- Cases: `src/test-cases/` — see package [README.md](../../../README.md)
