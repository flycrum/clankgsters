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
      skillFileName: 'ABILITY.md',
    },
  }),
  description: 'sourceDefaults.skillFileName override drives standalone skill discovery marker.',
  jsonPath: 'test-cases/source-defaults-skill-file-name/case-sync-manifest.json',
  seeding: e2eTestCase.defineSeeding([
    new DefaultSandboxSeedingBlueprint('', {}),
    new PluginsSkillsScenarioSeedingBlueprint('', {
      includeRootRules: false,
      includeStandaloneSkill: true,
      prepareGroupAction: 'replace',
      prepareEntryAction: 'replace',
      prepareReplaceRoots: ['.clank/skills/sample-skill'],
      scenarioMode: 'root-only',
      skillFileName: 'ABILITY.md',
    }),
  ]),
});
