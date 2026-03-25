/**
 * Exclude plugin by path: excluded ['.clank/plugins/root'] (sandbox root plugin).
 * Root plugin content should be absent from cursor and claude manifests.
 */

import { clankgstersConfig } from '../../../clankgsters-sync/config/index.js';
import { e2eTestCase } from '../define-e2e-test-case.js';
import { DefaultSandboxPrefabPreset } from '../prefabs/prefabs.js';

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
    excluded: ['.clank/plugins/root'],
  }),
  description: 'Exclude plugin by path .clank/plugins/root; assert root plugin content removed.',
  jsonPath: 'test-cases/excluded-plugin-git-path.json',
  seeding: e2eTestCase.definePrefabs([new DefaultSandboxPrefabPreset('', {})]),
});
