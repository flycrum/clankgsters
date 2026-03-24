/**
 * Disable Claude rules test case: claude with RulesSymlinkSyncPreset disabled + one custom agent (codex-like); cursor and codex disabled.
 */

import { clankgstersConfig } from '../../../clankgsters-sync/config/index.js';
import { e2eTestCase } from '../define-e2e-test-case.js';

const config = clankgstersConfig.define({
  agents: {
    claude: clankgstersConfig.defineAgent({
      behaviors: [
        'MarkdownContextSymlinkSyncPreset',
        'SkillsDirectorySyncPreset',
        'MarketplaceJsonSyncPreset',
        'SettingsSyncPreset',
        'LocalPluginCacheBustPreset',
      ],
      name: 'claude',
    }),
    cursor: false,
    codex: false,
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
    'Claude with RulesSymlinkSyncPreset disabled plus one codex-like custom agent; cursor and codex disabled.',
  jsonPath: 'test-cases/disable-claude-rules.json',
});
