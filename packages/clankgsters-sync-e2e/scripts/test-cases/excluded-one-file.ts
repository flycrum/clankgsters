/**
 * Excluded path test case: one excluded path (sandbox); all presets enabled.
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
  excluded: ['.cursor/commands/root/root-cmd.md'],
});

export const testCase = e2eTestCase.define({
  config,
  description: 'One excluded path (sandbox root plugin command); all presets enabled.',
  jsonPath: 'test-cases/excluded-one-file.json',
  seeding: e2eTestCase.definePrefabs([]),
});
