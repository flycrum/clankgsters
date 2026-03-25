import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { clankgstersIdentity } from '../../clankgsters-sync/config/index.js';
import type { E2eTestCaseDefinition } from './define-e2e-test-case.js';
import {
  e2eTestsCaseRunnerConfig,
  type RunOneE2eTestsCaseOptions,
  type RunOneE2eTestsCaseResult,
} from './e2e-tests.case-runner.config.js';
import {
  prefabs,
  DefaultSandboxPrefabPreset,
  SandboxDirNameForTestCase,
} from './prefabs/prefabs.js';
import { diffManifest } from './utils/diff-manifest.js';
import { fileAssertions } from './utils/file-assertions.js';
import { printLine } from './utils/print-line.js';

function runCommand(
  command: string,
  args: string[],
  cwd: string,
  env: NodeJS.ProcessEnv
): Promise<number> {
  return new Promise((resolve) => {
    const child = spawn(command, args, { cwd, env, stdio: 'pipe' });
    child.on('close', (code) => resolve(code ?? 1));
  });
}

function toConfigFileContents(config: unknown): string {
  return `const config = ${JSON.stringify(config, null, 2)};\n\nexport default config;\n`;
}

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
  return path.join(sandboxRoot, e2eTestsCaseRunnerConfig.manifestRelativePath);
}

/** Materializes a sandbox, runs clear/sync per config, then diffs the manifest and runs file assertions. */
export async function runOneE2eTestsCase(
  options: RunOneE2eTestsCaseOptions
): Promise<RunOneE2eTestsCaseResult> {
  const errorLines: string[] = [];
  const imported = await import(pathToFileURL(options.testCaseTsPath).href);
  const testCase = imported.testCase as E2eTestCaseDefinition;
  const sandboxDirectoryName = e2eTestsCaseRunnerConfig.sandboxDirectoryName;
  const sandboxRoot = path.join(options.caseOutputRoot, sandboxDirectoryName);
  const seeding = [
    new SandboxDirNameForTestCase(sandboxDirectoryName, { dirName: sandboxDirectoryName }),
    new DefaultSandboxPrefabPreset(sandboxDirectoryName, {
      markdownContextFileName: testCase.config.sourceDefaults?.markdownContextFileName,
    }),
    ...(testCase.seeding ?? []),
  ];

  if (fs.existsSync(options.caseOutputRoot)) {
    fs.rmSync(options.caseOutputRoot, { recursive: true, force: true });
  }
  fs.mkdirSync(options.caseOutputRoot, { recursive: true });
  prefabs.applySequentially(seeding, {
    caseIndex: options.caseIndex,
    caseName: options.name,
    caseOutputRoot: options.caseOutputRoot,
    packageRoot: options.packageRoot,
    repoRoot: options.repoRoot,
  });

  const configPath = path.join(sandboxRoot, e2eTestsCaseRunnerConfig.configFileName);
  fs.writeFileSync(configPath, toConfigFileContents(testCase.config), 'utf8');

  const commandEnv = {
    ...process.env,
    CLANKGSTERS_REPO_ROOT: sandboxRoot,
  };

  if (e2eTestsCaseRunnerConfig.runClearFirst) {
    const clearCode = await runCommand(
      'pnpm',
      ['clankgsters-sync:clear'],
      options.repoRoot,
      commandEnv
    );
    if (clearCode !== 0) {
      errorLines.push(printLine.error(`${options.name}: clear failed with exit code ${clearCode}`));
    }
  }

  const syncCode = await runCommand('pnpm', ['clankgsters-sync:run'], options.repoRoot, commandEnv);
  if (syncCode !== 0) {
    errorLines.push(printLine.error(`${options.name}: sync failed with exit code ${syncCode}`));
  }

  const expected = clankgstersIdentity.resolveFixtureStrings(
    JSON.parse(fs.readFileSync(options.expectedManifestPath, 'utf8'))
  ) as Record<string, unknown>;
  const manifestPath = getManifestPathForCase(sandboxRoot, testCase);
  const actual = fs.existsSync(manifestPath)
    ? JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
    : {};
  const manifestDiff = diffManifest.compare(expected, actual);
  if (manifestDiff.changed) {
    errorLines.push(
      ...manifestDiff.lines.map((line) => printLine.error(`${options.name}: ${line}`))
    );
  }

  const fileAssertionResult = fileAssertions.fromManifestEntries(sandboxRoot, []);
  if (fileAssertionResult.missing.length > 0) {
    errorLines.push(printLine.error(`${options.name}: missing files in sandbox`));
  }

  const passed = errorLines.length === 0;
  return { errorLines, passed, sandboxRoot };
}
