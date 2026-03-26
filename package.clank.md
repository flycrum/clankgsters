# Purpose

Root monorepo scripts coordinate package-level sync and e2e test flows.

## Script Contracts

- `clankgster-sync:clear` delegates clear mode in `@clankgster/sync`.
- `clankgster-sync:run` delegates to `@clankgster/sync` and is the primary local/manual run entry.
- `e2e-tests:run` runs the `@clankgster/sync-e2e` sandbox harness (`e2e-tests:run` script there); root `pnpm test` runs `@clankgster/sync#build`, then `vp run -r test` (packages), then `vp run -w test-root` (repo-root Vitest specs), not the e2e harness.
- Keep script names stable because e2e docs and AI agents reference these names directly.
- Keep `scripts`, `dependencies`, `devDependencies`, and `peerDependencies` alpha-numerically sorted.

## Notes

- Prefer package-filter delegates (`pnpm -F`) so root scripts stay thin and package ownership is explicit.
- Keep `test` and `build` orchestration compatible with Vite+ workspace task execution.
- After editing `.clank/` or `clankgster.config.ts`, run sync via the **`clankgster-sync:run`** script declared in **`packages/clankgster-sync/package.json`** (verify the name there each time), then confirm outputs. Do not hand-mirror into `.cursor/` or `.claude/`; see `packages/clankgster-sync/.clank/plugins/clankgster-sync/rules/clankgster-sync-trust-sync-workflow.md`.
