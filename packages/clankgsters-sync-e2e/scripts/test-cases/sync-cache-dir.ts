import { clankgstersConfig } from '../../../clankgsters-sync/config/index.js';
import { e2eTestCase } from '../define-e2e-test-case.js';

const config = clankgstersConfig.define({
  agents: {
    claude: true,
    codex: false,
    cursor: false,
  },
  syncCacheDir: '.alt-cache',
});

export const testCase = e2eTestCase.define({
  config,
  description: 'Custom syncCacheDir writes manifest under a non-default cache directory.',
  jsonPath: 'test-cases/sync-cache-dir.json',
  seeding: e2eTestCase.definePrefabs([]),
});
