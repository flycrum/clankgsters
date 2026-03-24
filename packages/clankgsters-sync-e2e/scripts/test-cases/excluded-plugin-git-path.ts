/**
 * Exclude plugin by path: excluded ['.clank/plugins/root'] (sandbox root plugin).
 * Root plugin content should be absent from cursor and claude manifests.
 */

import { clankgstersConfig } from '../../../clankgsters-sync/config/index.js';
import { e2eTestCase } from '../define-e2e-test-case.js';

const config = clankgstersConfig.define({
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
});

export const testCase = e2eTestCase.define({
  config,
  description: 'Exclude plugin by path .clank/plugins/root; assert root plugin content removed.',
  jsonPath: 'test-cases/excluded-plugin-git-path.json',
});
