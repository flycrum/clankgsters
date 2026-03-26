import { clankgsterConfig } from '../../../../clankgster-sync/src/index.js';
import { e2eTestCase } from '../../core/e2e-define-test-case.js';
import { DefaultSandboxSeedingBlueprint } from '../../seeding-prefabs/blueprints/default-sandbox-seeding-blueprint.js';
import { SourceLayoutVariantsSeedingBlueprint } from '../../seeding-prefabs/blueprints/source-layout-variants-seeding-blueprint.js';

export const testCase = e2eTestCase.define({
  config: clankgsterConfig.define({
    agents: {
      claude: true,
      codex: false,
      cursor: false,
    },
  }),
  description:
    'Seeds nested/shorthand x regular/local source layout variants for discovery coverage.',
  jsonPath: 'test-cases/source-layout-all-variants/case-sync-manifest.json',
  seeding: e2eTestCase.defineSeeding([
    new DefaultSandboxSeedingBlueprint('', {}),
    new SourceLayoutVariantsSeedingBlueprint('', {}),
  ]),
});
