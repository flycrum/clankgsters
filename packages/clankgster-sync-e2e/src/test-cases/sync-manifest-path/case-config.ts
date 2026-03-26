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
    syncManifestPath: '.custom/sync-manifest.custom.json',
  }),
  description: 'Custom syncManifestPath writes/reads manifest from a non-default relative path.',
  jsonPath: 'test-cases/sync-manifest-path/case-sync-manifest.json',
  seeding: e2eTestCase.defineSeeding([new DefaultSandboxSeedingBlueprint('', {})]),
});
