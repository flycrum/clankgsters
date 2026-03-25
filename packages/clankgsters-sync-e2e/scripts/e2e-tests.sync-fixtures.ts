import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { clankgstersIdentity } from '../../clankgsters-sync/config/index.js';
import type { E2eTestCaseDefinition } from './define-e2e-test-case.js';
import { e2eTestsPaths } from './e2e-tests.paths.js';
import { printLine } from './utils/print-line.js';

function getManifestPathForCase(sandboxRoot: string, testCase: E2eTestCaseDefinition): string {
  if (
    typeof testCase.config.syncManifestPath === 'string' &&
    testCase.config.syncManifestPath.length > 0
  ) {
    return path.isAbsolute(testCase.config.syncManifestPath)
      ? testCase.config.syncManifestPath
      : path.join(sandboxRoot, testCase.config.syncManifestPath);
  }
  if (typeof testCase.config.syncCacheDir === 'string' && testCase.config.syncCacheDir.length > 0) {
    return path.join(
      sandboxRoot,
      testCase.config.syncCacheDir,
      clankgstersIdentity.SYNC_MANIFEST_FILE_NAME
    );
  }
  return path.join(sandboxRoot, clankgstersIdentity.defaultSyncManifestRelativePath);
}

/** Copies generated manifests from `.e2e-tests.run-results` back into `scripts/test-cases/*.json` fixtures. */
async function main(): Promise<void> {
  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const packageRoot = path.resolve(scriptDir, '..');
  const testCasesDir = e2eTestsPaths.getTestCasesRoot(scriptDir);
  const resultsRoot = e2eTestsPaths.getResultsRoot(packageRoot);
  const caseFiles = fs
    .readdirSync(testCasesDir)
    .filter((name) => name.endsWith('.ts') && !name.endsWith('.d.ts'))
    .sort((left, right) => left.localeCompare(right));

  for (const [offset, caseFile] of caseFiles.entries()) {
    const caseIndex = offset + 1;
    const caseName = caseFile.replace(/\.ts$/, '');
    const caseDirName = e2eTestsPaths.formatCaseDirectoryName(caseIndex, caseName);
    const caseOutputRoot = path.join(resultsRoot, caseDirName);
    const sandboxRoot = caseOutputRoot;
    const imported = await import(pathToFileURL(path.join(testCasesDir, caseFile)).href);
    const testCase = imported.testCase as E2eTestCaseDefinition;
    const manifestPath = getManifestPathForCase(sandboxRoot, testCase);
    if (!fs.existsSync(manifestPath)) {
      throw new Error(`manifest not found for ${caseName}: ${manifestPath}`);
    }
    const targetFixturePath = path.join(testCasesDir, `${caseName}.json`);
    const value = JSON.parse(fs.readFileSync(manifestPath, 'utf8')) as unknown;
    fs.writeFileSync(targetFixturePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
    console.log(printLine.success(`fixture synced: ${targetFixturePath}`));
  }
}

main().catch((error) => {
  console.error(printLine.error(`fixture sync failed: ${String(error)}`));
  process.exit(1);
});
