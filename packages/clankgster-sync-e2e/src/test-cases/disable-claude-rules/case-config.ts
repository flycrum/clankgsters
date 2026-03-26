/**
 * Disable Claude rules test case: claude with AgentRulesSymlinkSyncPreset disabled + one custom agent (codex-like); cursor and codex disabled.
 */

import { clankgsterConfig } from '../../../../clankgster-sync/src/index.js';
import { e2eTestCase } from '../../core/e2e-define-test-case.js';
import { DefaultSandboxSeedingBlueprint } from '../../seeding-prefabs/blueprints/default-sandbox-seeding-blueprint.js';

export const testCase = e2eTestCase.define({
  config: clankgsterConfig.define({
    agents: {
      claude: clankgsterConfig.defineAgent({
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
        testagent: clankgsterConfig.defineAgent({
          behaviors: ['SkillsDirectorySyncPreset', 'MarkdownSectionSyncPreset'],
          name: 'testagent',
        }),
      },
    },
  }),
  description:
    'Claude with AgentRulesSymlinkSyncPreset disabled plus one codex-like custom agent; cursor and codex disabled.',
  jsonPath: 'test-cases/disable-claude-rules/case-sync-manifest.json',
  seeding: e2eTestCase.defineSeeding([new DefaultSandboxSeedingBlueprint('', {})]),
});
