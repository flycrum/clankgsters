import { clankgsterConfig } from '../../../../clankgster-sync/src/index.js';
import { e2eTestCase } from '../../core/e2e-define-test-case.js';
import { DefaultSandboxSeedingBlueprint } from '../../seeding-prefabs/blueprints/default-sandbox-seeding-blueprint.js';
import { PluginsSkillsScenarioSeedingBlueprint } from '../../seeding-prefabs/blueprints/plugins-skills-scenario-seeding-blueprint.js';

export const testCase = e2eTestCase.define({
  config: clankgsterConfig.define({
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
  jsonPath: 'test-cases/source-defaults-source-dir/case-sync-manifest.json',
  seeding: e2eTestCase.defineSeeding([
    new DefaultSandboxSeedingBlueprint('', {}),
    new PluginsSkillsScenarioSeedingBlueprint('', {
      prepareGroupAction: 'replace',
      prepareEntryAction: 'replace',
      prepareReplaceRoots: ['.clank'],
      scenarioMode: 'root-only',
      sourceDirName: '.yoyo',
    }),
  ]),
});
