# `scripts/` in `@clankgsters/sync-e2e`

This folder holds **thin CLI entrypoints** only (`e2e-tests.run.harness.ts`, `e2e-tests.clear.ts`). They wire **`package.json`** scripts (`e2e-tests:run`, `e2e-tests:clear`) to the implementation under `src/`.

## Why keep them here

- **Package scripts** invoke these files with `tsx` from the package root; names and failure behavior are part of the contract for automation.
- Same layout as `@clankgsters/sync`: entrypoints stay discoverable beside `package.json`/`e2e-tests:*` scripts.

## What is not here

- Harness implementation, fixtures, seeding prefabs, and Vitest unit specs live in **`src/`** (`src/common/`, `src/core/`, `src/test-cases/`, etc.). This package is **not** published for npm consumption, so there is no `package.json` `"exports"` for `src/` — it is internal to the e2e package only.
