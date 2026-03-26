/**
 * Excluded non-existent path: excluded ['.clank/plugins/does-not-exist'] should be harmless.
 */

import { clankgsterConfig } from '../../../../clankgster-sync/src/index.js';
import { e2eTestCase } from '../../core/e2e-define-test-case.js';
import { DefaultSandboxSeedingBlueprint } from '../../seeding-prefabs/blueprints/default-sandbox-seeding-blueprint.js';

export const testCase = e2eTestCase.define({
  config: clankgsterConfig.define({
    agents: {
      claude: true,
      cursor: true,
      codex: true,
      custom: {
        testagent: clankgsterConfig.defineAgent({
          behaviors: ['SkillsDirectorySyncPreset', 'MarkdownSectionSyncPreset'],
          name: 'testagent',
        }),
      },
    },
    excluded: ['.clank/plugins/does-not-exist'],
  }),
  description: 'Excluded non-existent path; sync unchanged.',
  jsonPath: 'test-cases/excluded-nonexistent/case-sync-manifest.json',
  seeding: e2eTestCase.defineSeeding([new DefaultSandboxSeedingBlueprint('', {})]),
});
