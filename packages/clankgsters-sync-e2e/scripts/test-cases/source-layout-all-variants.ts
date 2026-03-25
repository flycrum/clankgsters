import { clankgstersConfig } from '../../../clankgsters-sync/config/index.js';
import { e2eTestCase } from '../define-e2e-test-case.js';
import { SourceLayoutVariantsPreset } from '../prefabs/prefabs.js';

const config = clankgstersConfig.define({
  agents: {
    claude: true,
    codex: false,
    cursor: false,
  },
});

export const testCase = e2eTestCase.define({
  config,
  description:
    'Seeds nested/shorthand x regular/local source layout variants for discovery coverage.',
  jsonPath: 'test-cases/source-layout-all-variants.json',
  seeding: e2eTestCase.definePrefabs([new SourceLayoutVariantsPreset('sandbox-template', {})]),
});
