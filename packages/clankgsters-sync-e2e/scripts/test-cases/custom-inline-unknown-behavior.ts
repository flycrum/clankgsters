import { clankgstersConfig } from '../../../clankgsters-sync/config/index.js';
import { e2eTestCase } from '../define-e2e-test-case.js';
import { DefaultSandboxPrefabPreset } from '../prefabs/prefabs.js';

export const testCase = e2eTestCase.define({
  config: clankgstersConfig.define({
    agents: {
      claude: false,
      codex: false,
      cursor: false,
      custom: {
        superagent: clankgstersConfig.defineAgent({
          name: 'superagent',
          behaviors: [
            {
              behaviorName: 'UnknownRuntimeSyncBehavior',
              enabled: true,
              options: {
                hello: 'world',
              },
            },
          ],
        }),
      },
    },
  }),
  description: 'Unknown custom behavior entries run as no-op without failing the sync loop.',
  jsonPath: 'test-cases/custom-inline-unknown-behavior.json',
  seeding: e2eTestCase.definePrefabs([new DefaultSandboxPrefabPreset('', {})]),
});
