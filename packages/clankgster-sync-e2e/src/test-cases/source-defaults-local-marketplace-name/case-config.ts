import { clankgsterConfig } from '../../../../clankgster-sync/src/index.js';
import { e2eTestCase } from '../../core/e2e-define-test-case.js';
import { DefaultSandboxSeedingBlueprint } from '../../seeding-prefabs/blueprints/default-sandbox-seeding-blueprint.js';

export const testCase = e2eTestCase.define({
  config: clankgsterConfig.define({
    agents: {
      claude: true,
      codex: false,
      cursor: false,
    },
    sourceDefaults: {
      localMarketplaceName: 'my-local-market',
    },
  }),
  description:
    'sourceDefaults.localMarketplaceName override propagates into behavior options/outputs.',
  jsonPath: 'test-cases/source-defaults-local-marketplace-name/case-sync-manifest.json',
  seeding: e2eTestCase.defineSeeding([new DefaultSandboxSeedingBlueprint('', {})]),
});
