import { clankgstersConfig } from '../../../clankgsters-sync/config/index.js';
import { e2eTestCase } from '../define-e2e-test-case.js';
import { PluginsSkillsScenarioPreset } from '../prefabs/prefabs.js';

const config = clankgstersConfig.define({
  agents: {
    claude: true,
    codex: false,
    cursor: false,
  },
  sourceDefaults: {
    skillFileName: 'ABILITY.md',
  },
});

export const testCase = e2eTestCase.define({
  config,
  description: 'sourceDefaults.skillFileName override drives standalone skill discovery marker.',
  jsonPath: 'test-cases/source-defaults-skill-file-name.json',
  seeding: e2eTestCase.definePrefabs([
    new PluginsSkillsScenarioPreset('sandbox-template', {
      includeRootRules: false,
      includeStandaloneSkill: true,
      scenarioMode: 'root-only',
      skillFileName: 'ABILITY.md',
    }),
  ]),
});
