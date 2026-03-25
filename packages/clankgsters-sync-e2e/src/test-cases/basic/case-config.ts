/**
 * Basic test case: all three preset agents enabled plus one custom agent (codex-like); sandbox plugins: root + nested.
 */

import { clankgstersConfig } from '../../../../clankgsters-sync/src/index.js';
import { e2eTestCase } from '../../core/e2e-define-test-case.js';
import { DefaultSandboxSeedingBlueprint } from '../../seeding-prefabs/blueprints/default-sandbox-seeding-blueprint.js';

export const testCase = e2eTestCase.define({
  config: clankgstersConfig.define({
    agents: {
      claude: true,
      cursor: true,
      codex: true,
      custom: {
        testagent: clankgstersConfig.defineAgent({
          behaviors: ['SkillsDirectorySyncPreset', 'MarkdownSectionSyncPreset'],
          name: 'testagent',
        }),
      },
    },
  }),
  description:
    'All three preset agents plus one codex-like custom agent; discovery limited to sandbox (root + nested plugins).',
  jsonPath: 'test-cases/basic/case-sync-manifest.json',
  seeding: e2eTestCase.defineSeeding([new DefaultSandboxSeedingBlueprint('', {})]),
});
