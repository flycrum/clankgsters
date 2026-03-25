# E2E tests

Config-driven e2e tests for `@clankgsters/sync`.

## Target architecture

```mermaid
flowchart TD
  testCaseTs[TestCaseDefinition (.ts)] -->|seeding: definePrefabs(...)| prefabList[PrefabOrPresetList]
  harness[E2EHarness] --> caseLoop[SortedCaseLoop]
  caseLoop --> caseDir[CaseDirBuilder]
  caseDir --> runner[runOneE2eCase]
  prefabList --> runner
  runner --> sandboxRoot[case-N-name sandbox root]
  runner --> prefabEngine[PrefabEngine applySequentially]
  prefabEngine --> generatedTree[Generated sandbox contents]
  generatedTree --> clearRun[clankgsters-sync:clear]
  clearRun --> syncRun[clankgsters-sync:run]
  syncRun --> manifestDiff[manifest + assertions]
```

## What they do

- Build each sandbox dynamically from prefab/preset classes under `scripts/prefabs/`.
- Inject per-case config into generated sandbox `clankgsters.config.ts`.
- Run clear then sync for each case against `CLANKGSTERS_REPO_ROOT=<case>/sandbox-template`.
- Compare expected fixture JSON in `scripts/test-cases/*.json` with generated manifest output.
- Keep all case outputs under `sandboxes/.e2e-tests.run-results/case-{num}-{name}/` for inspection.

## Run

From repository root:

- `pnpm e2e-tests:run`
- `pnpm e2e-tests:clear`
- `pnpm e2e-tests:sync-fixtures`

From this package:

- `pnpm test`
- `tsx scripts/e2e-tests.run.harness.ts [case-name]`
- `tsx scripts/e2e-tests.clear.ts`
- `tsx scripts/e2e-tests.sync-fixtures.ts`

## Fixture authoring loop

- Run `pnpm e2e-tests:run` to generate per-case outputs under `.e2e-tests.run-results`.
- Inspect case output directories to confirm generated trees/manifests.
- Run `pnpm e2e-tests:sync-fixtures` to copy manifests into `scripts/test-cases/*.json`.
- Re-run `pnpm e2e-tests:run` until green.
