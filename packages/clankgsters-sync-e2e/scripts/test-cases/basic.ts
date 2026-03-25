/**
 * Basic test case: all three preset agents enabled plus one custom agent (codex-like); sandbox plugins: root + nested.
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
});

export const testCase = e2eTestCase.define({
  config,
  description:
    'All three preset agents plus one codex-like custom agent; discovery limited to sandbox (root + nested plugins).',
  jsonPath: 'test-cases/basic.json',
  seeding: e2eTestCase.definePrefabs([]),
});
