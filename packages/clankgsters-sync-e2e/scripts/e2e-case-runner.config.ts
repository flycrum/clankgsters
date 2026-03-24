import { clankgstersIdentity } from '../../clankgsters-sync/config/index.js';

export interface RunOneE2eCaseOptions {
  /** Absolute path to the expected `sync-manifest.json` fixture (JSON on disk). */
  expectedManifestPath: string;
  /** When true, leaves `outputRoot` intact on failure so callers can inspect or archive it. */
  keepSandboxOnFailure?: boolean;
  /** Case id used in log lines and error prefixes (e.g. the test file stem). */
  name: string;
  /** Directory where the sandbox template is copied and sync runs (`CLANKGSTERS_REPO_ROOT`). */
  outputRoot: string;
  /** Root of this e2e package (template under `sandboxes/`, test cases under `scripts/test-cases/`). */
  packageRoot: string;
  /** Monorepo root; `pnpm clankgsters-sync:*` runs with cwd here. */
  repoRoot: string;
  /** Absolute path to the test case module that exports `testCase`. */
  testCaseTsPath: string;
}

export interface RunOneE2eCaseResult {
  /** Human-readable failure lines (empty when `passed` is true). */
  errorLines: string[];
  /** True when clear, sync, manifest diff, and file assertions all succeed. */
  passed: boolean;
}

export const e2eCaseRunnerConfig = {
  /** Canonical sandbox config filename injected per test case. */
  configFileName: 'clankgsters.config.ts',
  /** Relative manifest path written by sync inside each sandbox. */
  manifestRelativePath: clankgstersIdentity.defaultSyncManifestRelativePath,
  /** When true, runs `clankgsters-sync:clear` before `clankgsters-sync:run` for each case. */
  runClearFirst: true,
};
