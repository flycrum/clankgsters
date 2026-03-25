import { clankgstersConfig } from '../../../clankgsters-sync/config/index.js';
import { e2eTestCase } from '../define-e2e-test-case.js';

const config = clankgstersConfig.define({
  agents: {
    claude: true,
    codex: false,
    cursor: false,
  },
  syncOutputRoot: '.sync-output-root',
});

export const testCase = e2eTestCase.define({
  config,
  description: 'syncOutputRoot override smoke case.',
  jsonPath: 'test-cases/sync-output-root.json',
  seeding: e2eTestCase.definePrefabs([]),
});
