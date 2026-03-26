# Clankgster sync e2e tests (overview)

Shared reference for the **@clankgster/sync-e2e** harness: test case layout, manifest diff, and sandbox flow. Skills (run-all, run-one, create-case, debug-case) link here for detail.

## How to run

- **All cases** (from package): `pnpm run e2e-tests:run`. From monorepo root: `pnpm e2e-tests:run` or `pnpm -F @clankgster/sync-e2e run e2e-tests:run`.
- **One case** (from package): `pnpm exec tsx scripts/e2e-tests.run.harness.ts <case-name>` (e.g. `basic`). From root: `pnpm -F @clankgster/sync-e2e exec tsx scripts/e2e-tests.run.harness.ts basic` (with cwd set to the e2e package, or use `pnpm -F @clankgster/sync-e2e run e2e-tests:run --` if wired).

## What each case does

- Creates one dedicated output directory per case under `sandboxes/.e2e-tests.run-results/case-{n}-{name}`.
- Seeds files/dirs from the case’s explicit `seeding` prefab list in `src/test-cases/<caseId>/case-config.ts`.
- Writes `clankgster.config.ts` into that case directory, sets **`CLANKGSTER_REPO_ROOT`** to it, then runs clear and sync.
- Keeps every case output directory (pass and fail) so fixture authoring/debugging is transparent.

## Case files

- **Config:** `src/test-cases/<caseId>/case-config.ts` exports `testCase` from `e2eTestCase.define({ config, description, jsonPath, seeding })`. Config is built with `clankgsterConfig` from `@clankgster/sync` (or repo-relative `packages/clankgster-sync/src/index.js` without a prior build).
- **Expected manifest:** colocated `src/test-cases/<caseId>/case-sync-manifest.json` — shape of `.clankgster-cache/sync-manifest.json` after sync (placeholders in JSON are resolved in the runner; see package `clankgsterIdentity`).

## Where sync writes

Repo root for the run is the case output directory (`CLANKGSTER_REPO_ROOT`), so discovery is limited to that tree’s configured source layouts (nested + shorthand variants for plugins/skills, including optional `.local` directories). Default manifest path: **`.clankgster-cache/sync-manifest.json`** under the case output root (override via `syncManifestPath` in config).
