---
name: clankgsters-e2e-create-case
description: Create a new @clankgsters/sync e2e test case using existing examples under scripts/test-cases/, then run it.
---

# Create a new e2e test case

## When to use

- Add a new sandbox scenario (excluded paths, agent overrides, etc.)

## Steps

1. **Copy patterns** from `packages/clankgsters-sync-e2e/scripts/test-cases/` (`basic`, `excluded-*`, `disable-claude-rules`, etc.).
2. **Add** `scripts/test-cases/<name>.ts`: export `testCase` from `e2eTestCase.define({ config, description, jsonPath: 'test-cases/<name>.json' })`. Build `config` with `clankgstersConfig` from `@clankgsters/sync/config`.
3. **Add** `scripts/test-cases/<name>.json`: expected `.clankgsters-cache/sync-manifest.json` shape after sync. After a local run, copy from `sandboxes/.tests/current/.clankgsters-cache/sync-manifest.json` or `failed-<name>/` and trim (fixtures support placeholder tokens — see sync package `clankgstersIdentity.resolveFixtureStrings`).
4. **Run** `pnpm exec tsx scripts/e2e-harness.ts <name>` from the e2e package; iterate until green.

## Reference

- [e2e-tests-overview.md](../references/e2e-tests-overview.md)
- Package [README.md](../../../README.md)
