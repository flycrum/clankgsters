# `scripts/` in `@clankgster/sync`

This folder holds **thin CLI entrypoints** only (`clankgster-sync.run.ts`, `clankgster-sync.clear.ts`). They wire the published **`clankgster-sync` bin** and **`package.json`** scripts (`clankgster-sync:run`, `clankgster-sync:clear`) to the implementation under `src/`.

## Why keep them here

- **Package scripts** invoke these files with `tsx` from the package root; names and failure behavior are part of the contract for automation.
- **Installed consumers** can run the same paths from `node_modules/@clankgster/sync/scripts/...` (for example after `pnpm add @clankgster/sync` or a workspace link).

## What is not here

- Library and sync runtime code lives in **`src/`** (`src/common/`, `src/core/`). The **supported import API** for npm is `package.json` → `"exports"."."` → `./dist/index.mjs`, produced from **`src/index.ts`** via `vp pack`. Deep imports into `src/` are not a declared public surface unless you add explicit export subpaths.
