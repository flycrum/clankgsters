import { spawn, type ChildProcess } from 'node:child_process';
import path from 'node:path';
import { clankgsterIdentity } from '../../../clankgster-sync/src/index.js';
import { fsHelpers } from '../common/fs-helpers.js';
import type { E2eTestCaseDefinition } from './e2e-define-test-case.js';

/**
 * `stdio` tuple for quiet subprocess runs: ignore stdin, pipe stdout/stderr and drain them (no TTY echo, no buffer deadlock).
 * Never `pipe()` these into `process.stdout` — default `pipe()` ends the destination when the child exits and can break the parent.
 */
const CHILD_STDIO_QUIET: ['ignore', 'pipe', 'pipe'] = ['ignore', 'pipe', 'pipe'];

/**
 * Spawns a child and resolves its exit code (`1` when `code` is null). Spawn failures resolve `1`. `Promise` ignores extra resolves if both `error` and `close` fire.
 * @param inheritStdio - When `true`, uses `stdio: 'inherit'` (noisy). When `false`, uses {@link CHILD_STDIO_QUIET}.
 */
function spawnChildAwaitExit(
  command: string,
  args: readonly string[],
  options: { cwd: string; env: NodeJS.ProcessEnv; inheritStdio: boolean }
): Promise<number> {
  return new Promise((resolve) => {
    const attachExitHandlers = (child: ChildProcess) => {
      child.once('error', () => resolve(1));
      child.once('close', (code: number | null) => resolve(code ?? 1));
    };
    if (options.inheritStdio) {
      attachExitHandlers(
        spawn(command, args, { cwd: options.cwd, env: options.env, stdio: 'inherit' })
      );
      return;
    }
    const child = spawn(command, args, {
      cwd: options.cwd,
      env: options.env,
      stdio: CHILD_STDIO_QUIET,
    });
    child.stdout?.on('data', () => {});
    child.stderr?.on('data', () => {});
    attachExitHandlers(child);
  });
}

export interface RunOneE2eTestsCaseOptions {
  /** 1-based case index in alphabetical order. */
  caseIndex: number;
  /** Absolute path to one case output directory (e.g. `.e2e-tests.run-results/case-1-basic`). */
  caseOutputRoot: string;
  /** Absolute path to the expected `sync-manifest.json` fixture (JSON on disk). */
  expectedManifestPath: string;
  /** Absolute path to expected file-structure fixture JSON. */
  expectedFileStructurePath: string;
  /** Case id used in log lines and error prefixes (e.g. the test file stem). */
  name: string;
  /** Root of this e2e package (template under `sandboxes/`, test cases under `src/test-cases/`). */
  packageRoot: string;
  /** Monorepo root; `pnpm clankgster-sync:*` runs with cwd here. */
  repoRoot: string;
  /** Absolute path to the test case module that exports `testCase`. */
  testCaseTsPath: string;
}

export interface RunOneE2eTestsCaseResult {
  /** Human-readable failure lines (empty when `passed` is true). */
  errorLines: string[];
  /** True when clear, sync, manifest diff, and file assertions all succeed. */
  passed: boolean;
  /** Absolute seeded sandbox root for this case. */
  sandboxRoot: string;
}

export const e2eTestsCaseRunnerConfig = {
  /** Canonical sandbox config filename injected per test case. */
  configFileName: 'clankgster.config.ts',
  /** Relative manifest path written by sync inside each sandbox. */
  manifestRelativePath: clankgsterIdentity.defaultSyncManifestRelativePath,
  /** Process to spawn at `repoRoot` for workspace scripts (e.g. `pnpm`). */
  packageManagerCommand: 'pnpm',
  /** When true, runs `clankgster-sync:clear` before `clankgster-sync:run` for each case. */
  runClearFirst: true,
  /** Args passed to `packageManagerCommand` for the clear step. */
  scriptClearArgs: ['clankgster-sync:clear'],
  /** Args passed to `packageManagerCommand` for the sync run step. */
  scriptSyncRunArgs: ['clankgster-sync:run'],

  /**
   * Spawns `command` with `args` in `cwd`, passes `env` through, and resolves with the exit code (`1` if null).
   * Default: quiet child stdio (see {@link spawnChildAwaitExit}). Set `CLANKGSTER_E2E_CHILD_STDIO_INHERIT=1` or `true` for full child logs.
   */
  runCommand(
    command: string,
    args: string[],
    cwd: string,
    env: NodeJS.ProcessEnv
  ): Promise<number> {
    const inheritChildStdio =
      process.env.CLANKGSTER_E2E_CHILD_STDIO_INHERIT === '1' ||
      process.env.CLANKGSTER_E2E_CHILD_STDIO_INHERIT === 'true';
    return spawnChildAwaitExit(command, args, { cwd, env, inheritStdio: inheritChildStdio });
  },

  /** Builds the on-disk contents for `clankgster.config.ts`: a `const config = …` object literal plus `export default config`. */
  toConfigFileContents(config: unknown): string {
    return `const config = ${JSON.stringify(config, null, 2)};\n\nexport default config;\n`;
  },

  /**
   * Absolute path to the sync manifest JSON after a run inside `sandboxRoot`. Precedence matches `sync-e2e-fixtures.ts`:
   * `config.syncManifestPath` (absolute or relative to sandbox), else `config.syncCacheDir` + manifest filename, else `manifestRelativePath`.
   */
  getManifestPathForCase(sandboxRoot: string, testCase: E2eTestCaseDefinition): string {
    const resolvedSandbox = path.resolve(sandboxRoot);
    if (
      typeof testCase.config.syncManifestPath === 'string' &&
      testCase.config.syncManifestPath.length > 0
    ) {
      return path.isAbsolute(testCase.config.syncManifestPath)
        ? testCase.config.syncManifestPath
        : fsHelpers.joinRootSafe(resolvedSandbox, testCase.config.syncManifestPath);
    }
    if (
      typeof testCase.config.syncCacheDir === 'string' &&
      testCase.config.syncCacheDir.length > 0
    ) {
      return fsHelpers.joinRootSafe(
        resolvedSandbox,
        testCase.config.syncCacheDir,
        clankgsterIdentity.SYNC_MANIFEST_FILE_NAME
      );
    }
    return fsHelpers.joinRootSafe(resolvedSandbox, this.manifestRelativePath);
  },
};
