/**
 * CLI harness for package-local e2e cases: discovers modules under `scripts/test-cases/`,
 * runs them through `runOneE2eTestsCase`, and exits with status 1 when any case fails.
 */
import chalk from 'chalk';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runOneE2eTestsCase } from './e2e-tests.case-runner.js';
import { e2eTestsPaths } from './e2e-tests.paths.js';
import { printLine } from './utils/print-line.js';

/**
 * Runs the e2e loop: optional `process.argv[2]` selects a single `<name>` so only
 * `test-cases/<name>.ts` runs; otherwise every `*.ts` case in `scripts/test-cases/` runs in order.
 *
 * Each case uses `sandboxes/.e2e-tests.run-results/case-{n}-{name}` as its dedicated output root.
 *
 * Invariants:
 * - Deletes `sandboxes/.e2e-tests.run-results` once at harness start so each invocation begins from a clean tree.
 * - Retains all case output directories regardless of pass/fail for fixture authoring/debugging.
 */
async function main(): Promise<void> {
  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const packageRoot = path.resolve(scriptDir, '..');
  const repoRoot = path.resolve(packageRoot, '..', '..');
  const testCasesDir = path.join(scriptDir, 'test-cases');
  const caseNameArg = process.argv[2];
  const testCases = fs
    .readdirSync(testCasesDir)
    .filter((name) => name.endsWith('.ts') && !name.endsWith('.d.ts'))
    .sort((left, right) => left.localeCompare(right));
  const selectedCases =
    caseNameArg != null ? testCases.filter((name) => name === `${caseNameArg}.ts`) : testCases;

  if (selectedCases.length === 0) {
    console.error(chalk.red('No e2e test cases found.'));
    process.exit(1);
  }

  const e2eTestsResultsRoot = e2eTestsPaths.getResultsRoot(packageRoot);
  if (fs.existsSync(e2eTestsResultsRoot))
    fs.rmSync(e2eTestsResultsRoot, { recursive: true, force: true });
  fs.mkdirSync(e2eTestsResultsRoot, { recursive: true });

  let failures = 0;
  for (const [offset, testCaseFile] of selectedCases.entries()) {
    const caseIndex = offset + 1;
    const name = testCaseFile.replace(/\.ts$/, '');
    const caseDirectoryName = e2eTestsPaths.formatCaseDirectoryName(caseIndex, name);
    const caseOutputRoot = path.join(e2eTestsResultsRoot, caseDirectoryName);
    const result = await runOneE2eTestsCase({
      caseIndex,
      caseOutputRoot,
      expectedManifestPath: path.join(testCasesDir, `${name}.json`),
      name,
      packageRoot,
      repoRoot,
      testCaseTsPath: path.join(testCasesDir, testCaseFile),
    });
    if (result.passed) {
      console.log(printLine.success(`${name} passed -> ${path.resolve(result.sandboxRoot)}`));
      continue;
    }

    failures += 1;
    console.log(printLine.error(`${name} failed -> ${path.resolve(result.sandboxRoot)}`));
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
