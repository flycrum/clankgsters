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
    sourceDir: '.yoyo',
  },
});

export const testCase = e2eTestCase.define({
  config,
  description: 'sourceDefaults.sourceDir override drives discovery roots under .yoyo.',
  jsonPath: 'test-cases/source-defaults-source-dir.json',
  seeding: e2eTestCase.definePrefabs([
    new PluginsSkillsScenarioPreset('sandbox-template', {
      scenarioMode: 'root-only',
      sourceDirName: '.yoyo',
    }),
  ]),
});
