import { clankgstersConfig } from '../../../clankgsters-sync/config/index.js';
import { e2eTestCase } from '../define-e2e-test-case.js';
import { DefaultSandboxPrefabPreset, PluginsSkillsScenarioPreset } from '../prefabs/prefabs.js';

export const testCase = e2eTestCase.define({
  config: clankgstersConfig.define({
    agents: {
      claude: true,
      codex: false,
      cursor: false,
    },
    sourceDefaults: {
      sourceDir: '.yoyo',
    },
  }),
  description: 'sourceDefaults.sourceDir override drives discovery roots under .yoyo.',
  jsonPath: 'test-cases/source-defaults-source-dir.json',
  seeding: e2eTestCase.definePrefabs([
    new DefaultSandboxPrefabPreset('', {}),
    new PluginsSkillsScenarioPreset('', {
      scenarioMode: 'root-only',
      sourceDirName: '.yoyo',
    }),
  ]),
});
