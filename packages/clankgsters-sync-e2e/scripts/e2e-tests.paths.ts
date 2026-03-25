import path from 'node:path';

/** Shared path constants/helpers for e2e-tests sandbox and result directories. */
export const e2eTestsPaths = {
  /** Prefix used when naming per-case output directories (e.g. `case-1-basic`). */
  CASE_NAME_PREFIX: 'case',
  /** Directory name under `sandboxes/` where all run outputs are written (e.g. `sandboxes/.e2e-tests.run-results/`). */
  RESULTS_DIR_NAME: '.e2e-tests.run-results',
  /** Package-local folder that stores sandbox outputs and runtime artifacts (e.g. `packages/clankgsters-sync-e2e/sandboxes/`). */
  SANDBOXES_DIR_NAME: 'sandboxes',
  /** Folder under `scripts/` containing case modules and fixture files (e.g. `scripts/test-cases/basic.ts`, `scripts/test-cases/basic.json`). */
  TEST_CASES_DIR_NAME: 'test-cases',

  /** Builds stable per-case result folder name (e.g. `case-1-basic`). */
  formatCaseDirectoryName(caseIndex: number, caseName: string): string {
    return `${this.CASE_NAME_PREFIX}-${caseIndex}-${caseName}`;
  },

  /** Absolute results root under the e2e package. */
  getResultsRoot(packageRoot: string): string {
    return path.join(packageRoot, this.SANDBOXES_DIR_NAME, this.RESULTS_DIR_NAME);
  },

  /** Absolute directory containing `*.ts` case modules and `*.json` fixture files. */
  getTestCasesRoot(scriptsRoot: string): string {
    return path.join(scriptsRoot, this.TEST_CASES_DIR_NAME);
  },
} as const;
