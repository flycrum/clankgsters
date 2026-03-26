# E2E tests

Config-driven e2e tests for `@clankgster/sync`.

## Target architecture

```mermaid
flowchart TD
  testCaseTs[case-config.ts per folder] -->|seeding: defineSeeding(...)| prefabList[BlueprintOrMainList]
  harness[E2EHarness] --> caseLoop[SortedCaseLoop]
  caseLoop --> caseDir[CaseDirBuilder]
  caseDir --> runner[runOneE2eCase]
  prefabList --> runner
  runner --> sandboxRoot[case-N-name sandbox root]
  runner --> prefabEngine[prefabOrchestration.applySeeding]
  prefabEngine --> generatedTree[Generated sandbox contents]
  generatedTree --> clearRun[clankgster-sync:clear]
  clearRun --> syncRun[clankgster-sync:run]
  syncRun --> manifestDiff[manifest + assertions]
```

## What they do

- Build each sandbox dynamically from prefab mains and blueprints under `src/seeding-prefabs/`.
- Inject per-case config into generated sandbox `clankgster.config.ts`.
- Run clear then sync for each case against `CLANKGSTER_REPO_ROOT=<case>`.
- Compare expected fixtures `case-sync-manifest.json` and `case-file-structure.json` in each `src/test-cases/<caseId>/` folder with generated output.
- Keep all case outputs under `sandboxes/.e2e-tests.run-results/case-{num}-{name}/` for inspection.

## Run

From repository root:

- `pnpm e2e-tests:run`
- `pnpm e2e-tests:clear`

From this package:

- `pnpm test`
- `tsx scripts/e2e-tests.run.harness.ts [caseId]`
- `tsx scripts/e2e-tests.clear.ts`

`package.json` scripts under `e2e-tests:*` point at thin CLI entrypoints in `scripts/`. Harness code and test cases live under `src/` (see `scripts/README.md`).

## Fixture authoring loop

- Run `pnpm e2e-tests:run` to generate per-case outputs under `.e2e-tests.run-results`.
- Inspect case output directories to confirm generated trees/manifests.
- Update committed golden JSON (baseline expected outputs the tests compare against) by running the maintenance tool (not an npm script):

  ```bash
  pnpm -F @clankgster/sync-e2e exec tsx src/core/sync-e2e-fixtures.ts
  ```

  From `packages/clankgster-sync-e2e` you can use `pnpm exec tsx src/core/sync-e2e-fixtures.ts`.

  That copies each case’s generated manifest and file-structure snapshot into `src/test-cases/<caseId>/` as `case-sync-manifest.json` and `case-file-structure.json`.

- Re-run `pnpm e2e-tests:run` until green.

## Licensing

This package is part of the Clankgster source workspace and follows the repository source license.

- Source code in this package is licensed under the PolyForm Noncommercial License 1.0.0 (see root `LICENSE`).
- The separately published package `@clankgster/sync` is MIT-licensed in its npm artifact (see `packages/clankgster-sync/LICENSE`).
