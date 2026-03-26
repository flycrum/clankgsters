import { clankgsterConfig } from '../../../../clankgster-sync/src/index.js';
import { e2eTestCase } from '../../core/e2e-define-test-case.js';
import { DefaultSandboxSeedingBlueprint } from '../../seeding-prefabs/blueprints/default-sandbox-seeding-blueprint.js';

export const testCase = e2eTestCase.define({
  config: clankgsterConfig.define({
    agents: {
      cursor: true,
      claude: false,
      codex: false,
    },
    syncOutputReadOnly: true,
  }),
  description: 'Cursor copy outputs are read-only when syncOutputReadOnly is true.',
  jsonPath: 'test-cases/sync-output-read-only-on/case-sync-manifest.json',
  assertions: {
    readOnlyPaths: ['.cursor/commands/root/root-cmd.md'],
  },
  seeding: e2eTestCase.defineSeeding([new DefaultSandboxSeedingBlueprint('', {})]),
});
