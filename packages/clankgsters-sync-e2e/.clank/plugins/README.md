# clankgsters-e2e

Local plugin for **@clankgsters/sync-e2e**: skills to run tests, add a test case, and debug a failing case.

## Skills

| Skill                           | Purpose                                                                                                                |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **clankgsters-e2e-run-all**     | Run all e2e cases (`pnpm run e2e-tests:run` in package or `pnpm e2e-tests:run` from monorepo root).                    |
| **clankgsters-e2e-run-one**     | Run a single case by name (`pnpm exec tsx scripts/e2e-tests.run.harness.ts <name>` or package `e2e-tests:run` script). |
| **clankgsters-e2e-create-case** | Add a new case: follow `scripts/test-cases/`, add `.ts` + `.json`, then run run-one.                                   |
| **clankgsters-e2e-debug-case**  | Diagnose a failure: inspect `sandboxes/.e2e-tests.run-results/case-{n}-{name}/`, diff manifest vs expected JSON.       |

## Layout

This plugin lives under `packages/clankgsters-sync-e2e/.clank/plugins/`. Test cases: `scripts/test-cases/`. Case outputs are written to `sandboxes/.e2e-tests.run-results/case-{n}-{name}/` and retained for all pass/fail runs until the next harness run.
