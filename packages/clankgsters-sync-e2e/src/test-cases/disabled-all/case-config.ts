/**
 * Disabled test case: all preset agents disabled (no custom).
 * Ensures sync runs and produces an empty manifest (all agent entries cleared).
 */

import { clankgstersConfig } from '../../../../clankgsters-sync/src/index.js';
import { e2eTestCase } from '../../core/e2e-define-test-case.js';
import { DefaultSandboxSeedingBlueprint } from '../../seeding-prefabs/blueprints/default-sandbox-seeding-blueprint.js';

export const testCase = e2eTestCase.define({
  config: clankgstersConfig.define({
    agents: {
      claude: false,
      cursor: false,
      codex: false,
    },
  }),
  description: 'All preset agents disabled; manifest should have no agent entries.',
  jsonPath: 'test-cases/disabled-all/case-sync-manifest.json',
  seeding: e2eTestCase.defineSeeding([new DefaultSandboxSeedingBlueprint('', {})]),
});
