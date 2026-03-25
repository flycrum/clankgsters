import { clankgstersConfig } from '../../../clankgsters-sync/config/index.js';
import { e2eTestCase } from '../define-e2e-test-case.js';
import { AgentPluginJsonPrefab } from '../prefabs/prefabs.js';

const config = clankgstersConfig.define({
  agents: {
    claude: false,
    codex: false,
    cursor: false,
    custom: {
      testagent: clankgstersConfig.defineAgent({
        behaviors: ['AgentMarketplaceJsonSyncPreset', 'SkillsDirectorySyncPreset'],
        name: 'testagent',
      }),
    },
  },
});

export const testCase = e2eTestCase.define({
  config,
  description: 'Custom agent uses fallback plugin manifest dir .testagent-plugin during discovery.',
  jsonPath: 'test-cases/custom-agent-plugin-manifest-dir.json',
  seeding: e2eTestCase.definePrefabs([
    new AgentPluginJsonPrefab('sandbox-template', {
      pluginDirName: 'root',
      pluginManifestDirName: '.testagent-plugin',
      pluginName: 'root',
    }),
  ]),
});
