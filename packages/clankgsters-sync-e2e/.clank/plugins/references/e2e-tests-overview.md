# Clankgsters sync e2e tests (overview)

Shared reference for the **@clankgsters/sync-e2e** harness: test case layout, manifest diff, and sandbox flow. Skills (run-all, run-one, create-case, debug-case) link here for detail.

## How to run

- **All cases** (from package): `pnpm run test:e2e`. From monorepo root: `pnpm test:e2e` or `pnpm -F @clankgsters/sync-e2e run test:e2e`.
- **One case** (from package): `pnpm exec tsx scripts/e2e-harness.ts <case-name>` (e.g. `basic`). From root: `pnpm -F @clankgsters/sync-e2e exec tsx scripts/e2e-harness.ts basic` (with cwd set to the e2e package, or use `pnpm -F @clankgsters/sync-e2e run test:e2e --` if wired).

## What each case does

- Clones `sandboxes/sandbox-template` to `sandboxes/.tests/current`, writes the case config as `clankgsters.config.ts`, sets **`CLANKGSTERS_REPO_ROOT`** to the sandbox, runs clear then sync, asserts manifest diff and filesystem.
- On **pass**: removes `current`. On **failure**: renames `current` to `sandboxes/.tests/failed-<case-name>` for inspection.

## Case files

- **Config:** `scripts/test-cases/<name>.ts` exports `testCase` from `e2eTestCase.define({ config, description, jsonPath })`. Config is built with `clankgstersConfig` from `@clankgsters/sync/config`.
- **Expected manifest:** colocated `scripts/test-cases/<name>.json` — shape of `.clankgsters-cache/sync-manifest.json` after sync (placeholders in JSON are resolved in the runner; see package `clankgstersIdentity`).

## Where sync writes

Repo root for the run is the sandbox (`CLANKGSTERS_REPO_ROOT`), so discovery is limited to that tree’s configured source layouts (nested + shorthand variants for plugins/skills, including optional `.local` directories). Default manifest path: **`.clankgsters-cache/sync-manifest.json`** under the sandbox (override via `syncManifestPath` in config).
