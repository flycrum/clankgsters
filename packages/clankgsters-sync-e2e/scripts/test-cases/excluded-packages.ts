/**
 * Excluded [packages]: plugins under packages/ (e.g. getting-started) excluded from discovery.
 * Expected manifest has no getting-started plugin content.
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
  excluded: ['packages'],
});

export const testCase = e2eTestCase.define({
  config,
  description: 'Excluded [packages]; nested plugin (under packages/app) excluded from sync.',
  jsonPath: 'test-cases/excluded-packages.json',
});
