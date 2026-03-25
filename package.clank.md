# Purpose

Root monorepo scripts coordinate package-level sync and e2e test flows.

## Script Contracts

- `clankgsters-sync:clear` delegates clear mode in `@clankgsters/sync`.
- `clankgsters-sync:run` delegates to `@clankgsters/sync` and is the primary local/manual run entry.
- `e2e-tests:run` runs the `@clankgsters/sync-e2e` sandbox harness (`e2e-tests:run` script there); root `pnpm test` runs `@clankgsters/sync#build`, then `vp run -r test` (packages), then `vp run -w test-root` (repo-root Vitest specs), not the e2e harness.
- Keep script names stable because e2e docs and AI agents reference these names directly.
- Keep `scripts`, `dependencies`, `devDependencies`, and `peerDependencies` alpha-numerically sorted.

## Notes

- Prefer package-filter delegates (`pnpm -F`) so root scripts stay thin and package ownership is explicit.
- Keep `test` and `build` orchestration compatible with Vite+ workspace task execution.
- After editing `.clank/` or `clankgsters.config.ts`, run sync via the **`clankgsters-sync:run`** script declared in **`packages/clankgsters-sync/package.json`** (verify the name there each time), then confirm outputs. Do not hand-mirror into `.cursor/` or `.claude/`; see `packages/clankgsters-sync/.clank/plugins/clankgsters-sync/rules/clankgsters-sync-trust-sync-workflow.md`.
