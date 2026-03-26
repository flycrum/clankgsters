---
name: clankgster-e2e-run-one
description: Run a single @clankgster/sync e2e case by name (e.g. basic, disable-claude-rules).
---

# Run one e2e case

## When to use

- Debug or verify a **single** scenario without running the full suite

## How to run

From **`packages/clankgster-sync-e2e`**:

```bash
pnpm exec tsx scripts/e2e-tests.run.harness.ts <case-name>
```

Examples: `basic`, `disable-claude-rules`, `excluded-one-file`.

From **monorepo root** (filter into the package):

```bash
pnpm -F @clankgster/sync-e2e exec tsx scripts/e2e-tests.run.harness.ts basic
```

(`cwd` for the exec must resolve `scripts/e2e-tests.run.harness.ts` relative to the e2e package — run from that package directory, or use `pnpm -F @clankgster/sync-e2e exec` from root with paths as the package sees them.)

## Reference

- [e2e-tests-overview.md](../references/e2e-tests-overview.md)
- Case name = directory name under `src/test-cases/<caseId>/` (no path suffix on the CLI arg)
