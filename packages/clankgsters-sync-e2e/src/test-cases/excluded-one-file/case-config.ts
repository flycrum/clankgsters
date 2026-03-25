/**
 * Excluded path test case: one excluded path (sandbox); all presets enabled.
 */

import { clankgstersConfig } from '../../../../clankgsters-sync/src/index.js';
import { e2eTestCase } from '../../core/e2e-define-test-case.js';
import { DefaultSandboxSeedingBlueprint } from '../../seeding-prefabs/blueprints/default-sandbox-seeding-blueprint.js';

export const testCase = e2eTestCase.define({
  config: clankgstersConfig.define({
    agents: {
      claude: true,
      cursor: true,
      codex: true,
      custom: {
        testagent: clankgstersConfig.defineAgent({
          behaviors: ['SkillsDirectorySyncPreset', 'MarkdownSectionSyncPreset'],
          name: 'testagent',
        }),
      },
    },
    excluded: ['.cursor/commands/root/root-cmd.md'],
  }),
  description: 'One excluded path (sandbox root plugin command); all presets enabled.',
  jsonPath: 'test-cases/excluded-one-file/case-sync-manifest.json',
  seeding: e2eTestCase.defineSeeding([new DefaultSandboxSeedingBlueprint('', {})]),
});
