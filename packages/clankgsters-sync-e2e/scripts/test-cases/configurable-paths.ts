/**
 * Configurable source defaults case: verifies source defaults override for sourceDir and markdownContextFileName.
 */

import { clankgstersConfig } from '../../../clankgsters-sync/config/index.js';
import { e2eTestCase } from '../define-e2e-test-case.js';

const config = clankgstersConfig.define({
  agents: {
    claude: clankgstersConfig.defineAgent({
      behaviors: ['MarkdownContextSymlinkSyncPreset'],
      name: 'claude',
    }),
    cursor: false,
    codex: false,
  },
  sourceDefaults: {
    markdownContextFileName: 'YOYO.md',
    sourceDir: '.yoyo',
  },
});

export const testCase = e2eTestCase.define({
  config,
  description: 'Source defaults override uses .yoyo and YOYO.md for context symlink discovery.',
  jsonPath: 'test-cases/configurable-paths.json',
});
