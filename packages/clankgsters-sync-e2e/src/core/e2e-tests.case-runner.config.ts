import { spawn } from 'node:child_process';
import path from 'node:path';
import { clankgstersIdentity } from '../../../clankgsters-sync/src/index.js';
import type { E2eTestCaseDefinition } from './e2e-define-test-case.js';

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
  /** Monorepo root; `pnpm clankgsters-sync:*` runs with cwd here. */
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
  configFileName: 'clankgsters.config.ts',
  /** Relative manifest path written by sync inside each sandbox. */
  manifestRelativePath: clankgstersIdentity.defaultSyncManifestRelativePath,
  /** Process to spawn at `repoRoot` for workspace scripts (e.g. `pnpm`). */
  packageManagerCommand: 'pnpm',
  /** When true, runs `clankgsters-sync:clear` before `clankgsters-sync:run` for each case. */
  runClearFirst: true,
  /** Args passed to `packageManagerCommand` for the clear step. */
  scriptClearArgs: ['clankgsters-sync:clear'],
  /** Args passed to `packageManagerCommand` for the sync run step. */
  scriptSyncRunArgs: ['clankgsters-sync:run'],

  /** Spawns `command` with `args` in `cwd`, passes `env` to the child (stdio piped), and resolves with the process exit code (`1` if the code is null). */
  runCommand(
    command: string,
    args: string[],
    cwd: string,
    env: NodeJS.ProcessEnv
  ): Promise<number> {
    return new Promise((resolve) => {
      const child = spawn(command, args, { cwd, env, stdio: 'pipe' });
      child.on('close', (code) => resolve(code ?? 1));
    });
  },

  /** Builds the on-disk contents for `clankgsters.config.ts`: a `const config = …` object literal plus `export default config`. */
  toConfigFileContents(config: unknown): string {
    return `const config = ${JSON.stringify(config, null, 2)};\n\nexport default config;\n`;
  },

  /**
   * Absolute path to the sync manifest JSON after a run inside `sandboxRoot`. Precedence matches `sync-e2e-fixtures.ts`:
   * `config.syncManifestPath` (absolute or relative to sandbox), else `config.syncCacheDir` + manifest filename, else `manifestRelativePath`.
   */
  getManifestPathForCase(sandboxRoot: string, testCase: E2eTestCaseDefinition): string {
    if (
      typeof testCase.config.syncManifestPath === 'string' &&
      testCase.config.syncManifestPath.length > 0
    ) {
      return path.isAbsolute(testCase.config.syncManifestPath)
        ? testCase.config.syncManifestPath
        : path.join(sandboxRoot, testCase.config.syncManifestPath);
    }
    if (
      typeof testCase.config.syncCacheDir === 'string' &&
      testCase.config.syncCacheDir.length > 0
    ) {
      return path.join(
        sandboxRoot,
        testCase.config.syncCacheDir,
        clankgstersIdentity.SYNC_MANIFEST_FILE_NAME
      );
    }
    return path.join(sandboxRoot, this.manifestRelativePath);
  },
};
