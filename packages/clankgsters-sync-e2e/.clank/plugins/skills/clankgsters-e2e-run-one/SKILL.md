---
name: clankgsters-e2e-run-one
description: Run a single @clankgsters/sync e2e case by name (e.g. basic, disable-claude-rules).
---

# Run one e2e case

## When to use

- Debug or verify a **single** scenario without running the full suite

## How to run

From **`packages/clankgsters-sync-e2e`**:

```bash
pnpm exec tsx scripts/e2e-tests.run.harness.ts <case-name>
```

Examples: `basic`, `disable-claude-rules`, `excluded-one-file`.

From **monorepo root** (filter into the package):

```bash
pnpm -F @clankgsters/sync-e2e exec tsx scripts/e2e-tests.run.harness.ts basic
```

(`cwd` for the exec must resolve `scripts/` relative to the e2e package — run from that package directory, or use `pnpm -F @clankgsters/sync-e2e exec` from root with paths as the package sees them.)

## Reference

- [e2e-tests-overview.md](../references/e2e-tests-overview.md)
- Case name = stem of `scripts/test-cases/<name>.ts` (no `.ts` suffix on the CLI arg)
