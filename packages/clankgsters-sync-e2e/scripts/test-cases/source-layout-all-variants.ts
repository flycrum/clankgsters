import { clankgstersConfig } from '../../../clankgsters-sync/config/index.js';
import { e2eTestCase } from '../define-e2e-test-case.js';
import { DefaultSandboxPrefabPreset, SourceLayoutVariantsPreset } from '../prefabs/prefabs.js';

export const testCase = e2eTestCase.define({
  config: clankgstersConfig.define({
    agents: {
      claude: true,
      codex: false,
      cursor: false,
    },
  }),
  description:
    'Seeds nested/shorthand x regular/local source layout variants for discovery coverage.',
  jsonPath: 'test-cases/source-layout-all-variants.json',
  seeding: e2eTestCase.definePrefabs([
    new DefaultSandboxPrefabPreset('', {}),
    new SourceLayoutVariantsPreset('', {}),
  ]),
});
