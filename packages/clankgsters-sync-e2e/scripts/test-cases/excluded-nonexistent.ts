/**
 * Excluded non-existent path: excluded ['.clank/plugins/does-not-exist'] should be harmless.
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
  excluded: ['.clank/plugins/does-not-exist'],
});

export const testCase = e2eTestCase.define({
  config,
  description: 'Excluded non-existent path; sync unchanged.',
  jsonPath: 'test-cases/excluded-nonexistent.json',
});
