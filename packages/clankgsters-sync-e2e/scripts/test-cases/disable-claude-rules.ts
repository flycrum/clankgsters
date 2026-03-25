/**
 * Disable Claude rules test case: claude with AgentRulesSymlinkSyncPreset disabled + one custom agent (codex-like); cursor and codex disabled.
 */

import { clankgstersConfig } from '../../../clankgsters-sync/config/index.js';
import { e2eTestCase } from '../define-e2e-test-case.js';
import { DefaultSandboxPrefabPreset } from '../prefabs/prefabs.js';

export const testCase = e2eTestCase.define({
  config: clankgstersConfig.define({
    agents: {
      claude: clankgstersConfig.defineAgent({
        behaviors: [
          'MarkdownSymlinkSyncPreset',
          'SkillsDirectorySyncPreset',
          'AgentMarketplaceJsonSyncPreset',
          'AgentSettingsSyncPreset',
          'PluginsCacheBustSyncPreset',
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
  }),
  description:
    'Claude with AgentRulesSymlinkSyncPreset disabled plus one codex-like custom agent; cursor and codex disabled.',
  jsonPath: 'test-cases/disable-claude-rules.json',
  seeding: e2eTestCase.definePrefabs([new DefaultSandboxPrefabPreset('', {})]),
});
