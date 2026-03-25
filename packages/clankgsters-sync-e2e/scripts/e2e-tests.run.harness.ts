/**
 * CLI harness for package-local e2e cases: discovers nested `case-config.ts` under `src/test-cases/`,
 * runs them through `runOneE2eTestsCase`, and exits with status 1 when any case fails.
 */
import chalk from 'chalk';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runOneE2eTestsCase } from '../src/core/e2e-tests.case-runner.js';
import { e2ePathHelpers } from '../src/common/e2e-path-helpers.js';
import { e2eTestCaseDiscovery } from '../src/common/e2e-test-case-discovery.js';
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

  let failures = 0;
  for (const [offset, { caseConfigPath, caseDir, caseId }] of selectedCases.entries()) {
    const caseIndex = offset + 1;
    const caseDirectoryName = e2ePathHelpers.formatCaseDirectoryName(caseIndex, caseId);
    const caseOutputRoot = path.join(e2eTestsResultsRoot, caseDirectoryName);
    const result = await runOneE2eTestsCase({
      caseIndex,
      caseOutputRoot,
      expectedFileStructurePath: path.join(
        caseDir,
        e2ePathHelpers.CASE_FILE_STRUCTURE_FIXTURE_NAME
      ),
      expectedManifestPath: path.join(caseDir, e2ePathHelpers.CASE_SYNC_MANIFEST_FIXTURE_NAME),
      name: caseId,
      packageRoot,
      repoRoot,
      testCaseTsPath: caseConfigPath,
    });
    if (result.passed) {
      console.log(printLine.success(`${caseId} passed -> ${path.resolve(result.sandboxRoot)}`));
      continue;
    }

    failures += 1;
    console.log(printLine.error(`${caseId} failed -> ${path.resolve(result.sandboxRoot)}`));
    for (const errorLine of result.errorLines) console.log(errorLine);
  }

  if (failures > 0) {
    console.error(chalk.red(`E2E failures: ${failures}`));
    process.exit(1);
  }
  console.log(chalk.green('All e2e cases passed.'));
}

main().catch((error) => {
  console.error(chalk.red('Unexpected e2e harness error'), error);
  process.exit(1);
});
