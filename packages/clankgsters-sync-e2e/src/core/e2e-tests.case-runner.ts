import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { clankgstersIdentity } from '../../../clankgsters-sync/src/index.js';
import type { E2eTestCaseDefinition } from './e2e-define-test-case.js';
import {
  e2eTestsCaseRunnerConfig,
  type RunOneE2eTestsCaseOptions,
  type RunOneE2eTestsCaseResult,
} from './e2e-tests.case-runner.config.js';
import { seedingPrefabs } from '../seeding-prefabs/seeding-prefabs.js';
import { diffManifest } from '../utils/diff-manifest.js';
import {
  fileStructureFixture,
  type FileStructureFixture,
} from '../utils/file-structure-fixture.js';
import { printLine } from '../utils/print-line.js';

/**
 * Executes a single harness case: resets `caseOutputRoot`, applies seeding prefabs, writes sandbox `clankgsters.config.ts`,
 * then runs `pnpm clankgsters-sync:clear` (when configured) and `pnpm clankgsters-sync:run` at the monorepo root with
 * `CLANKGSTERS_REPO_ROOT` set to the case sandbox. Compares `expectedManifestPath` and `expectedFileStructurePath` to the
 * generated manifest and directory snapshot; does not throw—collects issues in `errorLines` and sets `passed` from that.
 *
 * @returns `sandboxRoot` is `caseOutputRoot` (the seeded tree root); `passed` is true only when subprocesses succeed and both diffs are empty.
 */
export async function runOneE2eTestsCase(
  options: RunOneE2eTestsCaseOptions
): Promise<RunOneE2eTestsCaseResult> {
  const errorLines: string[] = [];
  const imported = await import(pathToFileURL(options.testCaseTsPath).href);
  const testCase = imported.testCase as E2eTestCaseDefinition;
  const sandboxRoot = options.caseOutputRoot;
  const seeding = testCase.seeding ?? [];

  if (fs.existsSync(options.caseOutputRoot)) {
    fs.rmSync(options.caseOutputRoot, { recursive: true, force: true });
  }
  fs.mkdirSync(options.caseOutputRoot, { recursive: true });
  seedingPrefabs.api.applySequentially(seeding, {
    caseIndex: options.caseIndex,
    caseName: options.name,
    caseOutputRoot: options.caseOutputRoot,
    packageRoot: options.packageRoot,
    repoRoot: options.repoRoot,
  });

  const configPath = path.join(options.caseOutputRoot, e2eTestsCaseRunnerConfig.configFileName);
  fs.writeFileSync(
    configPath,
    e2eTestsCaseRunnerConfig.toConfigFileContents(testCase.config),
    'utf8'
  );

  const commandEnv = {
    ...process.env,
    CLANKGSTERS_REPO_ROOT: sandboxRoot,
  };

  if (e2eTestsCaseRunnerConfig.runClearFirst) {
    const clearCode = await e2eTestsCaseRunnerConfig.runCommand(
      e2eTestsCaseRunnerConfig.packageManagerCommand,
      e2eTestsCaseRunnerConfig.scriptClearArgs,
      options.repoRoot,
      commandEnv
    );
    if (clearCode !== 0) {
      errorLines.push(printLine.error(`${options.name}: clear failed with exit code ${clearCode}`));
    }
  }

  const syncCode = await e2eTestsCaseRunnerConfig.runCommand(
    e2eTestsCaseRunnerConfig.packageManagerCommand,
    e2eTestsCaseRunnerConfig.scriptSyncRunArgs,
    options.repoRoot,
    commandEnv
  );
  if (syncCode !== 0) {
    errorLines.push(printLine.error(`${options.name}: sync failed with exit code ${syncCode}`));
  }

  const expected = clankgstersIdentity.resolveFixtureStrings(
    JSON.parse(fs.readFileSync(options.expectedManifestPath, 'utf8'))
  ) as Record<string, unknown>;
  const manifestPath = e2eTestsCaseRunnerConfig.getManifestPathForCase(sandboxRoot, testCase);
  const actual = fs.existsSync(manifestPath)
    ? JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
    : {};
  const manifestDiff = diffManifest.compare(expected, actual);
  if (manifestDiff.changed) {
    errorLines.push(
      ...manifestDiff.lines.map((line) => printLine.error(`${options.name}: ${line}`))
    );
  }

  const expectedFileStructure = clankgstersIdentity.resolveFixtureStrings(
    JSON.parse(fs.readFileSync(options.expectedFileStructurePath, 'utf8'))
  ) as FileStructureFixture;
  const actualFileStructure = fileStructureFixture.buildSnapshot(sandboxRoot);
  const fileStructureDiff = fileStructureFixture.compare(
    expectedFileStructure,
    actualFileStructure
  );
  if (fileStructureDiff.changed) {
    errorLines.push(printLine.error(`${options.name}: file structure does not match fixture`));
    for (const missingPath of fileStructureDiff.missing) {
      errorLines.push(printLine.error(`${options.name}: missing path ${missingPath}`));
    }
    for (const extraPath of fileStructureDiff.extra) {
      errorLines.push(printLine.error(`${options.name}: extra path ${extraPath}`));
    }
    for (const modifiedEntry of fileStructureDiff.modified) {
      errorLines.push(
        printLine.error(
          `${options.name}: modified path ${modifiedEntry.path} (${modifiedEntry.reasons.join(', ')})`
        )
      );
    }
  }

  const passed = errorLines.length === 0;
  return { errorLines, passed, sandboxRoot };
}
