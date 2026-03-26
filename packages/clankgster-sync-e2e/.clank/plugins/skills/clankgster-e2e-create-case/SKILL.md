---
name: clankgster-e2e-create-case
description: Create a new @clankgster/sync e2e test case using existing examples under src/test-cases/, then run it.
---

# Create a new e2e test case

## When to use

- Add a new sandbox scenario (excluded paths, agent overrides, etc.)

## Steps

1. **Copy patterns** from `packages/clankgster-sync-e2e/src/test-cases/` (`basic`, `excluded-*`, `disable-claude-rules`, etc.).
2. **Add** `src/test-cases/<name>/case-config.ts`: export `testCase` from `e2eTestCase.define({ config, description, jsonPath, seeding })`. Build `config` with `clankgsterConfig` from `@clankgster/sync` (or repo-relative `packages/clankgster-sync/src/index.js`), and define `seeding` explicitly with seeding prefabs/blueprints.
3. **Add** `src/test-cases/<name>/case-sync-manifest.json`: expected `.clankgster-cache/sync-manifest.json` shape after sync. After a local run, copy from `sandboxes/.e2e-tests.run-results/case-*/.clankgster-cache/sync-manifest.json` and trim (fixtures support placeholder tokens — see sync package `clankgsterIdentity.resolveFixtureStrings`).
4. **Run** `pnpm exec tsx scripts/e2e-tests.run.harness.ts <name>` from the e2e package; iterate until green.

## Reference

- [e2e-tests-overview.md](../references/e2e-tests-overview.md)
- Package [README.md](../../../README.md)
