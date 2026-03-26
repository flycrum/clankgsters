import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { e2ePathHelpers } from '../common/e2e-path-helpers.js';
import { e2eTestCaseDiscovery } from '../common/e2e-test-case-discovery.js';
import { fileStructureFixture } from '../utils/file-structure-fixture.js';
import { printLine } from '../utils/print-line.js';
import type { E2eTestCaseDefinition } from './e2e-define-test-case.js';
import { e2eTestsCaseRunnerConfig } from './e2e-tests.case-runner.config.js';
import { syncE2eFixturesConfig } from './sync-e2e-fixtures.config.js';

/**
 * Maintenance entrypoint (run with `tsx`, not wired in `package.json`): copies **golden fixtures** from the
 * last harness run back into each `src/test-cases/<caseId>/` folder so committed expectations stay in
 * sync with intentional sync behavior changes.
 *
 * **When to use:** After `pnpm e2e-tests:run` (or the harness via `tsx`), you have fresh manifests and
 * directory trees under `sandboxes/.e2e-tests.run-results/case-{n}-{id}/`. If you have verified those outputs
 * are correct (product change or new case), run this script to update `case-sync-manifest.json` and
 * `case-file-structure.json` beside each `case-config.ts`. Then re-run the harness until it passes.
 *
 * **What it does:** For every discovered case (same discovery order as the harness), it reads the generated
 * manifest from the path implied by that case’s config (see `e2eTestsCaseRunnerConfig.getManifestPathForCase`), pretty-prints it into
 * the case’s `case-sync-manifest.json`, and writes a JSON snapshot of the sandbox file tree to
 * `case-file-structure.json`. It does **not** run sync itself; it assumes results already exist from a prior run.
 *
 * **What it is not:** Not part of CI’s default test command. Not a substitute for reviewing diffs—blindly
 * syncing can bake in regressions. Optional tooling for authors updating expected JSON after deliberate changes.
 *
 * **Formatting:** After all fixtures are written, spawns `pnpm exec vp fmt src/test-cases` in a **detached**
 * subprocess (`unref`) so this process can exit immediately; JSON under `src/test-cases/` may update moments
 * later. If spawn fails (e.g. `pnpm` not on `PATH`), logs an error—run `vp fmt src/test-cases` manually from
 * this package.
 *
 * @throws If a case’s expected result directory is missing the manifest at the resolved path (e.g. you ran
 *   sync-fixtures without running the harness first, or paths/config do not match the last run).
 */
async function main(): Promise<void> {
  const coreDir = path.dirname(fileURLToPath(import.meta.url));
  const srcRoot = path.resolve(coreDir, '..');
  const packageRoot = path.resolve(srcRoot, '..');
  const testCasesDir = e2ePathHelpers.getTestCasesRoot(srcRoot);
  const resultsRoot = e2ePathHelpers.getResultsRoot(packageRoot);
  const cases = e2eTestCaseDiscovery.discoverCases(testCasesDir);

  for (const [offset, { caseConfigPath, caseDir, caseId }] of cases.entries()) {
    const caseIndex = offset + 1;
    const caseDirName = e2ePathHelpers.formatCaseDirectoryName(caseIndex, caseId);
    const caseOutputRoot = path.join(resultsRoot, caseDirName);
    const sandboxRoot = caseOutputRoot;
    const imported = await import(pathToFileURL(caseConfigPath).href);
    const testCase = imported.testCase as E2eTestCaseDefinition;
    const manifestPath = e2eTestsCaseRunnerConfig.getManifestPathForCase(sandboxRoot, testCase);
    if (!fs.existsSync(manifestPath)) {
      throw new Error(`manifest not found for ${caseId}: ${manifestPath}`);
    }
    const targetManifestFixturePath = path.join(
      caseDir,
      e2ePathHelpers.CASE_SYNC_MANIFEST_FIXTURE_NAME
    );
    const value = JSON.parse(fs.readFileSync(manifestPath, 'utf8')) as unknown;
    fs.writeFileSync(targetManifestFixturePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
    console.log(printLine.success(`fixture synced: ${targetManifestFixturePath}`));

    const targetFileStructureFixturePath = path.join(
      caseDir,
      e2ePathHelpers.CASE_FILE_STRUCTURE_FIXTURE_NAME
    );
    const snapshot = fileStructureFixture.buildSnapshot(sandboxRoot);
    fs.writeFileSync(
      targetFileStructureFixturePath,
      `${JSON.stringify(snapshot, null, 2)}\n`,
      'utf8'
    );
    console.log(printLine.success(`fixture synced: ${targetFileStructureFixturePath}`));
  }

  syncE2eFixturesConfig.spawnDetachedFmtTestCases(packageRoot);
}

main().catch((error) => {
  console.error(printLine.error(`fixture sync failed: ${String(error)}`));
  process.exit(1);
});
