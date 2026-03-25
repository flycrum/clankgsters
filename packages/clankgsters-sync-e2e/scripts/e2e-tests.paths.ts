import path from 'node:path';

/** Shared path constants/helpers for e2e-tests sandbox and result directories. */
export const e2eTestsPaths = {
  CASE_NAME_PREFIX: 'case',
  RESULTS_DIR_NAME: '.e2e-tests.run-results',
  SANDBOX_DEFAULT_DIR_NAME: 'sandbox-template',
  SANDBOXES_DIR_NAME: 'sandboxes',

  /** Builds stable per-case result folder name (e.g. `case-1-basic`). */
  formatCaseDirectoryName(caseIndex: number, caseName: string): string {
    return `${this.CASE_NAME_PREFIX}-${caseIndex}-${caseName}`;
  },

  /** Absolute results root under the e2e package. */
  getResultsRoot(packageRoot: string): string {
    return path.join(packageRoot, this.SANDBOXES_DIR_NAME, this.RESULTS_DIR_NAME);
  },
} as const;
