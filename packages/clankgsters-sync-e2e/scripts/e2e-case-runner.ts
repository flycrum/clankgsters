import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { clankgstersIdentity } from '../../clankgsters-sync/config/index.js';
import {
  e2eCaseRunnerConfig,
  type RunOneE2eCaseOptions,
  type RunOneE2eCaseResult,
} from './e2e-case-runner.config.js';
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

/** Materializes a sandbox, runs clear/sync per config, then diffs the manifest and runs file assertions. */
export async function runOneE2eCase(options: RunOneE2eCaseOptions): Promise<RunOneE2eCaseResult> {
  const errorLines: string[] = [];
  const testsRoot = path.join(options.packageRoot, 'sandboxes', '.tests');
  const sandboxTemplate = path.join(options.packageRoot, 'sandboxes', 'sandbox-template');

  fs.mkdirSync(testsRoot, { recursive: true });
  if (fs.existsSync(options.outputRoot)) {
    fs.rmSync(options.outputRoot, { recursive: true, force: true });
  }
  fs.cpSync(sandboxTemplate, options.outputRoot, { recursive: true });

  const imported = await import(pathToFileURL(options.testCaseTsPath).href);
  const testCase = imported.testCase;
  const configPath = path.join(options.outputRoot, e2eCaseRunnerConfig.configFileName);
  fs.writeFileSync(configPath, toConfigFileContents(testCase.config), 'utf8');

  const commandEnv = {
    ...process.env,
    CLANKGSTERS_REPO_ROOT: options.outputRoot,
  };

  if (e2eCaseRunnerConfig.runClearFirst) {
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
  const manifestPath = path.join(options.outputRoot, e2eCaseRunnerConfig.manifestRelativePath);
  const actual = fs.existsSync(manifestPath)
    ? JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
    : {};
  const manifestDiff = diffManifest.compare(expected, actual);
  if (manifestDiff.changed) {
    errorLines.push(
      ...manifestDiff.lines.map((line) => printLine.error(`${options.name}: ${line}`))
    );
  }

  const fileAssertionResult = fileAssertions.fromManifestEntries(options.outputRoot, []);
  if (fileAssertionResult.missing.length > 0) {
    errorLines.push(printLine.error(`${options.name}: missing files in sandbox`));
  }

  const passed = errorLines.length === 0;
  if (!passed && options.keepSandboxOnFailure === true) {
    return { errorLines, passed };
  }
  if (passed) fs.rmSync(options.outputRoot, { recursive: true, force: true });
  return { errorLines, passed };
}
