import {
  clankgsterConfig,
  clankgsterConfigDefaults,
} from '../../../../clankgster-sync/src/index.js';
import { e2eTestCase } from '../../core/e2e-define-test-case.js';
import { DefaultSandboxSeedingBlueprint } from '../../seeding-prefabs/blueprints/default-sandbox-seeding-blueprint.js';

export const testCase = e2eTestCase.define({
  config: clankgsterConfig.define({
    agents: {
      claude: clankgsterConfig.defineAgent({
        behaviors: [
          {
            behaviorName: 'MarkdownContextSyncPreset',
            enabled: true,
            options: {
              sourceFile: clankgsterConfigDefaults.CONSTANTS.sourceDefaults.markdownContextFileName,
            },
          },
          {
            behaviorName: 'AgentMarketplaceJsonSyncPreset',
            enabled: true,
            options: {
              sourceFormat: 'relative',
            },
          },
          {
            behaviorName: 'AgentRulesDirectorySyncPreset',
            enabled: false,
            options: {},
          },
          {
            behaviorName: 'SkillsDirectorySyncPreset',
            enabled: true,
            options: {},
          },
        ],
        name: 'claude',
      }),
      codex: false,
      cursor: false,
    },
  }),
  description: 'Behavior object form with options and one disabled behavior entry.',
  jsonPath: 'test-cases/behavior-options-and-disable/case-sync-manifest.json',
  seeding: e2eTestCase.defineSeeding([new DefaultSandboxSeedingBlueprint('', {})]),
});
