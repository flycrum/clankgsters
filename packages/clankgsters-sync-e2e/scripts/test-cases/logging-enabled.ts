import { clankgstersConfig } from '../../../clankgsters-sync/config/index.js';
import { e2eTestCase } from '../define-e2e-test-case.js';

const config = clankgstersConfig.define({
  agents: {
    claude: true,
    codex: false,
    cursor: false,
  },
  loggingEnabled: true,
});

export const testCase = e2eTestCase.define({
  config,
  description: 'Logging enabled true with single-agent run.',
  jsonPath: 'test-cases/logging-enabled.json',
  seeding: e2eTestCase.definePrefabs([]),
});
