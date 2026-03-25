import { clankgstersConfig } from '../../../clankgsters-sync/config/index.js';
import { e2eTestCase } from '../define-e2e-test-case.js';
import { DefaultSandboxPrefabPreset } from '../prefabs/prefabs.js';

export const testCase = e2eTestCase.define({
  config: clankgstersConfig.define({
    agents: {
      claude: true,
      codex: false,
      cursor: false,
    },
    syncOutputRoot: '.sync-output-root',
  }),
  description: 'syncOutputRoot override smoke case.',
  jsonPath: 'test-cases/sync-output-root.json',
  seeding: e2eTestCase.definePrefabs([new DefaultSandboxPrefabPreset('', {})]),
});
