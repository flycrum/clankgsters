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
      skillFileName: 'ABILITY.md',
    },
  }),
  description: 'sourceDefaults.skillFileName override drives standalone skill discovery marker.',
  jsonPath: 'test-cases/source-defaults-skill-file-name.json',
  seeding: e2eTestCase.definePrefabs([
    new DefaultSandboxPrefabPreset('', {}),
    new PluginsSkillsScenarioPreset('', {
      includeRootRules: false,
      includeStandaloneSkill: true,
      scenarioMode: 'root-only',
      skillFileName: 'ABILITY.md',
    }),
  ]),
});
