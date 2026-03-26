# clankgster-e2e

Local plugin for **@clankgster/sync-e2e**: skills to run tests, add a test case, and debug a failing case.

## Skills

| Skill                          | Purpose                                                                                                                |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| **clankgster-e2e-run-all**     | Run all e2e cases (`pnpm run e2e-tests:run` in package or `pnpm e2e-tests:run` from monorepo root).                    |
| **clankgster-e2e-run-one**     | Run a single case by name (`pnpm exec tsx scripts/e2e-tests.run.harness.ts <name>` or package `e2e-tests:run` script). |
| **clankgster-e2e-create-case** | Add a new case: follow `src/test-cases/`, add config + fixtures, then run run-one.                                     |
| **clankgster-e2e-debug-case**  | Diagnose a failure: inspect `sandboxes/.e2e-tests.run-results/case-{n}-{name}/`, diff manifest vs expected JSON.       |

## Layout

This plugin lives under `packages/clankgster-sync-e2e/.clank/plugins/`. Test cases: `src/test-cases/`. Case outputs are written to `sandboxes/.e2e-tests.run-results/case-{n}-{name}/` and retained for all pass/fail runs until the next harness run.
