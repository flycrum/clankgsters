/**
 * Configurable source defaults case: verifies source defaults override for sourceDir and markdownContextFileName.
 */

import { clankgsterConfig } from '../../../../clankgster-sync/src/index.js';
import { e2eTestCase } from '../../core/e2e-define-test-case.js';
import { DefaultSandboxSeedingBlueprint } from '../../seeding-prefabs/blueprints/default-sandbox-seeding-blueprint.js';

export const testCase = e2eTestCase.define({
  config: clankgsterConfig.define({
    agents: {
      claude: clankgsterConfig.defineAgent({
        behaviors: ['MarkdownSymlinkSyncPreset'],
        name: 'claude',
      }),
      cursor: false,
      codex: false,
    },
    sourceDefaults: {
      markdownContextFileName: 'YOYO.md',
      sourceDir: '.yoyo',
    },
  }),
  description: 'Source defaults override uses .yoyo and YOYO.md for context symlink discovery.',
  jsonPath: 'test-cases/configurable-paths/case-sync-manifest.json',
  seeding: e2eTestCase.defineSeeding([
    new DefaultSandboxSeedingBlueprint('', {
      markdownContextFileName: 'YOYO.md',
    }),
  ]),
});
