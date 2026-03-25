import { clankgstersIdentity } from '../../clankgsters-sync/config/index.js';

export interface RunOneE2eTestsCaseOptions {
  /** 1-based case index in alphabetical order. */
  caseIndex: number;
  /** Absolute path to one case output directory (e.g. `.e2e-tests.run-results/case-1-basic`). */
  caseOutputRoot: string;
  /** Absolute path to the expected `sync-manifest.json` fixture (JSON on disk). */
  expectedManifestPath: string;
  /** Case id used in log lines and error prefixes (e.g. the test file stem). */
  name: string;
  /** Root of this e2e package (template under `sandboxes/`, test cases under `scripts/test-cases/`). */
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
  /** When true, runs `clankgsters-sync:clear` before `clankgsters-sync:run` for each case. */
  runClearFirst: true,
  /** Default dynamic sandbox directory name inside each case output root. */
  sandboxDirectoryName: 'sandbox-template',
};
