/**
 * Disabled test case: all preset agents disabled (no custom).
 * Ensures sync runs and produces an empty manifest (all agent entries cleared).
 */

import { clankgstersConfig } from '../../../clankgsters-sync/config/index.js';
import { e2eTestCase } from '../define-e2e-test-case.js';

const config = clankgstersConfig.define({
  agents: {
    claude: false,
    cursor: false,
    codex: false,
  },
});

export const testCase = e2eTestCase.define({
  config,
  description: 'All preset agents disabled; manifest should have no agent entries.',
  jsonPath: 'test-cases/disabled-all.json',
  seeding: e2eTestCase.definePrefabs([]),
});
