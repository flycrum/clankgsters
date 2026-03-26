/**
 * Exclude plugin by path: excluded ['.clank/plugins/root'] (sandbox root plugin).
 * Root plugin content should be absent from cursor and claude manifests.
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
    excluded: ['.clank/plugins/root'],
  }),
  description: 'Exclude plugin by path .clank/plugins/root; assert root plugin content removed.',
  jsonPath: 'test-cases/excluded-plugin-git-path/case-sync-manifest.json',
  seeding: e2eTestCase.defineSeeding([new DefaultSandboxSeedingBlueprint('', {})]),
});
