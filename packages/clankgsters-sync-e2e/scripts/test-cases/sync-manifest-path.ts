import { clankgstersConfig } from '../../../clankgsters-sync/config/index.js';
import { e2eTestCase } from '../define-e2e-test-case.js';

const config = clankgstersConfig.define({
  agents: {
    claude: true,
    codex: false,
    cursor: false,
  },
  syncManifestPath: '.custom/sync-manifest.custom.json',
});

export const testCase = e2eTestCase.define({
  config,
  description: 'Custom syncManifestPath writes/reads manifest from a non-default relative path.',
  jsonPath: 'test-cases/sync-manifest-path.json',
  seeding: e2eTestCase.definePrefabs([]),
});
