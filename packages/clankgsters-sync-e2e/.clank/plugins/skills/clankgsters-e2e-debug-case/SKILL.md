---
name: clankgsters-e2e-debug-case
description: Diagnose a failing e2e case by comparing expected JSON to actual manifest under sandboxes/.tests/failed-<name>/.
---

# Debug a failing e2e case

## When to use

- A case fails; you need to align `scripts/test-cases/<name>.json` with real sync output

## Flow

1. Re-run the case so the harness keeps **`sandboxes/.tests/failed-<name>/`** (from `packages/clankgsters-sync-e2e`):

   ```bash
   pnpm exec tsx scripts/e2e-tests.run.harness.ts <name>
   ```

2. **Expected:** `scripts/test-cases/<name>.json`  
   **Actual:** `sandboxes/.tests/failed-<name>/.clankgsters-cache/sync-manifest.json` (unless `syncManifestPath` overrides)

3. Diff mentally or with the same rules as `scripts/utils/diff-manifest.ts` (added / removed / modified paths).

4. Update the expected JSON; re-run until pass.

5. **Logging:** set `loggingEnabled: true` in the case config, or `CLANKGSTERS_LOGGING_ENABLED=true`, then inspect **`.clank/logs/clankgsters-sync.log`** under the sandbox root if sync behavior is wrong.

6. If JSONs look identical but diff still fails, suspect **diff-manifest** implementation — see `scripts/utils/diff-manifest.ts`.

## Reference

- [e2e-tests-overview.md](../references/e2e-tests-overview.md)
