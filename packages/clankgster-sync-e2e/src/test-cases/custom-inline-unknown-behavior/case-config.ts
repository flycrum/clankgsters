import { clankgsterConfig } from '../../../../clankgster-sync/src/index.js';
import { e2eTestCase } from '../../core/e2e-define-test-case.js';
import { DefaultSandboxSeedingBlueprint } from '../../seeding-prefabs/blueprints/default-sandbox-seeding-blueprint.js';

export const testCase = e2eTestCase.define({
  config: clankgsterConfig.define({
    agents: {
      claude: false,
      codex: false,
      cursor: false,
      custom: {
        superagent: clankgsterConfig.defineAgent({
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
  jsonPath: 'test-cases/custom-inline-unknown-behavior/case-sync-manifest.json',
  seeding: e2eTestCase.defineSeeding([new DefaultSandboxSeedingBlueprint('', {})]),
});
