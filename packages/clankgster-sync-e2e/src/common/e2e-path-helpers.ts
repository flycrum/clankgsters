import path from 'node:path';

/** One discovered case under `src/test-cases/<caseId>/`. */
export interface E2eTestCasePaths {
  /** Absolute path to the discovered case config module.
   * @example `caseConfigPath: '/repo/packages/clankgster-sync-e2e/src/test-cases/basic/case-config.ts'` */
  caseConfigPath: string;
  /** Absolute path to the case directory that contains fixtures and config.
   * @example `caseDir: '/repo/packages/clankgster-sync-e2e/src/test-cases/basic'` */
  caseDir: string;
  /** Case identifier derived from the case directory name.
   * @example `caseId: 'basic'` */
  caseId: string;
}

/**
 * Path join helpers and naming constants for e2e sandboxes and per-case folders (no filesystem I/O).
 * Case discovery lives in `e2e-test-case-discovery.ts` (`e2eTestCaseDiscovery`).
 */
export const e2ePathHelpers = {
  CASE_NAME_PREFIX: 'case',
  /** Directory name under `sandboxes/` where all run outputs are written (e.g. `sandboxes/.e2e-tests.run-results/`). */
  RESULTS_DIR_NAME: '.e2e-tests.run-results',
  /** Package-local folder that stores sandbox outputs and runtime artifacts (e.g. `packages/clankgster-sync-e2e/sandboxes/`). */
  SANDBOXES_DIR_NAME: 'sandboxes',
  /** Folder under `src/` containing per-case dirs with `case-config.ts` and fixtures. */
  TEST_CASES_DIR_NAME: 'test-cases',

  /** Standard fixture filenames inside each case directory. */
  CASE_FILE_STRUCTURE_FIXTURE_NAME: 'case-file-structure.json',
  CASE_SYNC_MANIFEST_FIXTURE_NAME: 'case-sync-manifest.json',
  CASE_CONFIG_FILE_NAME: 'case-config.ts',

  /** Builds stable per-case result folder name (e.g. `case-1-basic`). */
  formatCaseDirectoryName(caseIndex: number, caseName: string): string {
    return `${this.CASE_NAME_PREFIX}-${caseIndex}-${caseName}`;
  },

  /** Absolute results root under the e2e package. */
  getResultsRoot(packageRoot: string): string {
    return path.join(packageRoot, this.SANDBOXES_DIR_NAME, this.RESULTS_DIR_NAME);
  },

  /** Absolute directory containing per-case subfolders (`src/test-cases` when `srcRoot` is the package `src/` dir). */
  getTestCasesRoot(srcRoot: string): string {
    return path.join(srcRoot, this.TEST_CASES_DIR_NAME);
  },
} as const;
