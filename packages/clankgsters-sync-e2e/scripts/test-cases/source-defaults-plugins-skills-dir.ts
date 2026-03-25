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
    pluginsDir: 'plugins-custom',
    skillsDir: 'skills-custom',
  },
});

export const testCase = e2eTestCase.define({
  config,
  description: 'sourceDefaults pluginsDir/skillsDir overrides with matching seeded tree paths.',
  jsonPath: 'test-cases/source-defaults-plugins-skills-dir.json',
  seeding: e2eTestCase.definePrefabs([
    new PluginsSkillsScenarioPreset('sandbox-template', {
      pluginsDirName: 'plugins-custom',
      skillsDirName: 'skills-custom',
      scenarioMode: 'root-only',
    }),
  ]),
});
