import fs from 'node:fs';
import path from 'node:path';
import type { E2eTestCasePaths } from './e2e-path-helpers.js';
import { e2ePathHelpers } from './e2e-path-helpers.js';

/**
 * Filesystem scan for test case directories under `src/test-cases/<caseId>/`. Uses `e2ePathHelpers` for fixture names.
 */
export const e2eTestCaseDiscovery = {
  /** Lists `test-cases/<caseId>/case-config.ts` in alphabetical order by `caseId`. */
  discoverCases(testCasesRoot: string): E2eTestCasePaths[] {
    const results: E2eTestCasePaths[] = [];
    for (const name of fs.readdirSync(testCasesRoot)) {
      if (name.startsWith('.')) continue;
      const caseDir = path.join(testCasesRoot, name);
      if (!fs.statSync(caseDir).isDirectory()) continue;
      const caseConfigPath = path.join(caseDir, e2ePathHelpers.CASE_CONFIG_FILE_NAME);
      if (!fs.existsSync(caseConfigPath)) continue;
      results.push({ caseConfigPath, caseDir, caseId: name });
    }
    results.sort((left, right) => left.caseId.localeCompare(right.caseId));
    return results;
  },
} as const;
