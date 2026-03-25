import { clankgstersConfig } from '../../../../clankgsters-sync/src/index.js';
import { e2eTestCase } from '../../core/e2e-define-test-case.js';
import { DefaultSandboxSeedingBlueprint } from '../../seeding-prefabs/blueprints/default-sandbox-seeding-blueprint.js';
import { PluginsSkillsScenarioSeedingBlueprint } from '../../seeding-prefabs/blueprints/plugins-skills-scenario-seeding-blueprint.js';

export const testCase = e2eTestCase.define({
  config: clankgstersConfig.define({
    agents: {
      claude: true,
      codex: false,
      cursor: false,
    },
    sourceDefaults: {
      pluginsDir: 'plugins-custom',
      skillsDir: 'skills-custom',
    },
  }),
  description: 'sourceDefaults pluginsDir/skillsDir overrides with matching seeded tree paths.',
  jsonPath: 'test-cases/source-defaults-plugins-skills-dir/case-sync-manifest.json',
  seeding: e2eTestCase.defineSeeding([
    new DefaultSandboxSeedingBlueprint('', {}),
    new PluginsSkillsScenarioSeedingBlueprint('', {
      prepareGroupAction: 'replace',
      prepareEntryAction: 'replace',
      prepareReplaceRoots: ['.clank/plugins', '.clank/skills'],
      pluginsDirName: 'plugins-custom',
      skillsDirName: 'skills-custom',
      scenarioMode: 'root-only',
    }),
  ]),
});
