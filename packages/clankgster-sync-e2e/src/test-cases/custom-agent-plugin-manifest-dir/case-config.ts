import { clankgsterConfig } from '../../../../clankgster-sync/src/index.js';
import { e2eTestCase } from '../../core/e2e-define-test-case.js';
import { DefaultSandboxSeedingBlueprint } from '../../seeding-prefabs/blueprints/default-sandbox-seeding-blueprint.js';
import { AgentPluginJsonSeedingPrefab } from '../../seeding-prefabs/prefabs/agent-plugin-json-seeding-prefab.js';

export const testCase = e2eTestCase.define({
  config: clankgsterConfig.define({
    agents: {
      claude: false,
      codex: false,
      cursor: false,
      custom: {
        testagent: clankgsterConfig.defineAgent({
          behaviors: ['AgentMarketplaceJsonSyncPreset', 'SkillsDirectorySyncPreset'],
          name: 'testagent',
        }),
      },
    },
  }),
  description: 'Custom agent uses fallback plugin manifest dir .testagent-plugin during discovery.',
  jsonPath: 'test-cases/custom-agent-plugin-manifest-dir/case-sync-manifest.json',
  seeding: e2eTestCase.defineSeeding([
    new DefaultSandboxSeedingBlueprint('', {}),
    new AgentPluginJsonSeedingPrefab('', {
      pluginDirName: 'root',
      pluginManifestDirName: '.testagent-plugin',
      pluginName: 'root',
    }),
  ]),
});
