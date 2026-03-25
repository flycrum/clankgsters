import {
  clankgstersConfig,
  clankgstersConfigDefaults,
} from '../../../clankgsters-sync/config/index.js';
import { e2eTestCase } from '../define-e2e-test-case.js';
import { DefaultSandboxPrefabPreset } from '../prefabs/prefabs.js';

export const testCase = e2eTestCase.define({
  config: clankgstersConfig.define({
    agents: {
      claude: clankgstersConfig.defineAgent({
        behaviors: [
          {
            behaviorName: 'MarkdownSymlinkSyncPreset',
            enabled: true,
            options: {
              sourceFile:
                clankgstersConfigDefaults.CONSTANTS.sourceDefaults.markdownContextFileName,
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
            behaviorName: 'AgentRulesSymlinkSyncPreset',
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
  jsonPath: 'test-cases/behavior-options-and-disable.json',
  seeding: e2eTestCase.definePrefabs([new DefaultSandboxPrefabPreset('', {})]),
});
