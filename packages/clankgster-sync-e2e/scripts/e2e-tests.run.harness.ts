/**
 * CLI harness for package-local e2e cases: discovers nested `case-config.ts` under `src/test-cases/`,
 * runs them through `runOneE2eTestsCase`, and exits with status 1 when any case fails.
 */
import chalk from 'chalk';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { e2ePathHelpers } from '../src/common/e2e-path-helpers.js';
import { e2eTestCaseDiscovery } from '../src/common/e2e-test-case-discovery.js';
import type { RunOneE2eTestsCaseResult } from '../src/core/e2e-tests.case-runner.config.js';
import { runOneE2eTestsCase } from '../src/core/e2e-tests.case-runner.js';
import { asyncConcurrencyPool } from '../src/utils/async-concurrency-pool.js';
import { orderedCompletionBuffer } from '../src/utils/ordered-completion-buffer.js';
import { printLine } from '../src/utils/print-line.js';

/**
 * Runs the e2e loop: optional `process.argv[2]` selects a single `<caseId>` so only
 * `test-cases/<caseId>/case-config.ts` runs; otherwise every discovered case runs in order.
 *
 * Each case uses `sandboxes/.e2e-tests.run-results/case-{n}-{caseId}` as its dedicated output root.
 *
 * Invariants:
 * - Deletes `sandboxes/.e2e-tests.run-results` once at harness start so each invocation begins from a clean tree.
 * - Retains all case output directories regardless of pass/fail for fixture authoring/debugging.
 */
async function main(): Promise<void> {
  const startTimeEpochMs = Date.now();
  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const packageRoot = path.resolve(scriptDir, '..');
  const repoRoot = path.resolve(packageRoot, '..', '..');
  const srcRoot = path.join(packageRoot, 'src');
  const testCasesDir = e2ePathHelpers.getTestCasesRoot(srcRoot);
  const caseNameArg = process.argv[2];
  const discovered = e2eTestCaseDiscovery.discoverCases(testCasesDir);
  const selectedCases =
    caseNameArg != null ? discovered.filter((entry) => entry.caseId === caseNameArg) : discovered;

  if (selectedCases.length === 0) {
    console.error(chalk.red('No e2e test cases found.'));
    process.exit(1);
  }

  const e2eTestsResultsRoot = e2ePathHelpers.getResultsRoot(packageRoot);
  if (fs.existsSync(e2eTestsResultsRoot))
    fs.rmSync(e2eTestsResultsRoot, { recursive: true, force: true });
  fs.mkdirSync(e2eTestsResultsRoot, { recursive: true });

  const resolveMaxTestsRunning = (): number => {
    const defaultMaxConcurrentThreads = Math.min(8, Math.max(1, os.availableParallelism()));
    const configured = process.env.CLANKGSTER_E2E_MAX_CONCURRENT;
    if (configured == null || configured.length === 0) return defaultMaxConcurrentThreads;

    const parsed = Number.parseInt(configured, 10);
    if (!Number.isFinite(parsed)) return defaultMaxConcurrentThreads;
    return Math.max(1, Math.min(8, parsed));
  };

  const runSpecs = selectedCases.map(({ caseConfigPath, caseDir, caseId }, offset) => {
    const caseIndex = offset + 1;
    const caseDirectoryName = e2ePathHelpers.formatCaseDirectoryName(caseIndex, caseId);
    const caseOutputRoot = path.join(e2eTestsResultsRoot, caseDirectoryName);
    return {
      caseConfigPath,
      caseId,
      caseIndex,
      caseOutputRoot,
      expectedFileStructurePath: path.join(
        caseDir,
        e2ePathHelpers.CASE_FILE_STRUCTURE_FIXTURE_NAME
      ),
      expectedManifestPath: path.join(caseDir, e2ePathHelpers.CASE_SYNC_MANIFEST_FIXTURE_NAME),
    };
  });
  const maxTestsRunning = resolveMaxTestsRunning();
  console.log(
    printLine.info(
      `Running '${runSpecs.length}' e2e case(s) with max '${maxTestsRunning}' in-flight.`
    )
  );

  let failures = 0;
  const reportOrderedResult = (caseId: string, result: RunOneE2eTestsCaseResult): void => {
    if (result.passed) {
      console.log(printLine.success(`${caseId} passed -> ${path.resolve(result.sandboxRoot)}`));
      return;
    }

    failures += 1;
    console.log(printLine.error(`${caseId} failed -> ${path.resolve(result.sandboxRoot)}`));
    for (const errorLine of result.errorLines) console.log(errorLine);
  };

  const completionBuffer = orderedCompletionBuffer.create<{
    caseId: string;
    result: RunOneE2eTestsCaseResult;
  }>({
    emit: (_caseIndex, settledResult) => {
      reportOrderedResult(settledResult.caseId, settledResult.result);
    },
  });

  await asyncConcurrencyPool.runLimited({
    items: runSpecs,
    maxConcurrent: maxTestsRunning,
    worker: async (runSpec) => ({
      caseId: runSpec.caseId,
      result: await runOneE2eTestsCase({
        caseIndex: runSpec.caseIndex,
        caseOutputRoot: runSpec.caseOutputRoot,
        expectedFileStructurePath: runSpec.expectedFileStructurePath,
        expectedManifestPath: runSpec.expectedManifestPath,
        name: runSpec.caseId,
        packageRoot,
        repoRoot,
        testCaseTsPath: runSpec.caseConfigPath,
      }),
    }),
    onItemSettled: async (runSpec, settledResult) => {
      await completionBuffer.accept(runSpec.caseIndex, settledResult);
    },
  });

  if (completionBuffer.getPendingCount() !== 0) {
    throw new Error('Ordered completion buffer is not fully drained after execution.');
  }
  if (completionBuffer.getNextExpectedIndex() !== runSpecs.length + 1) {
    throw new Error('Not all cases were emitted in deterministic caseIndex order.');
  }

  if (failures > 0) {
    console.error(chalk.red(`E2E failures: ${failures}`));
    process.exit(1);
  }
  const elapsedMs = Date.now() - startTimeEpochMs;
  const elapsedSeconds = (elapsedMs / 1000).toFixed(2);
  console.log(chalk.green(`All e2e cases passed in ${elapsedSeconds}s.`));
}

main().catch((error) => {
  console.error(chalk.red('Unexpected e2e harness error'), error);
  process.exit(1);
});
