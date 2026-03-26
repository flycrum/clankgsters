import { describe, expect, test } from 'vite-plus/test';
import { createActor } from 'xstate';
import { actorHelpers } from '../../common/actor-helpers.js';
import { clankgsterIdentity } from '../../common/clankgster-identity.js';
import { clankgsterConfigDefaults } from '../configs/clankgster-config.defaults.js';
import { processAgentQueueMachine } from './process-agent-queue.machine.js';

describe('processAgentQueueMachine', () => {
  test('runs configured agents in order', async () => {
    const actor = createActor(processAgentQueueMachine, {
      input: {
        discoveredMarketplaces: [],
        excluded: [],
        manifest: {},
        mode: 'sync',
        outputRoot: process.cwd(),
        repoRoot: process.cwd(),
        resolvedConfig: {
          loggingEnabled: false,
          agents: {
            cursor: {
              enabled: true,
              behaviors: [
                { enabled: true, behaviorName: 'AgentRulesSymlinkSyncPreset', options: {} },
              ],
            },
          },
          excluded: [],
          sourceDefaults: { ...clankgsterConfigDefaults.CONSTANTS.sourceDefaults },
          syncCacheDir: clankgsterIdentity.SYNC_CACHE_DIR,
          syncManifestPath: clankgsterIdentity.defaultSyncManifestRelativePath,
        },
      },
    });
    actor.start();
    const output = await actorHelpers.awaitOutput<{
      manifest: Record<string, Record<string, unknown>>;
      outcomes: Array<{ agent: string; success: boolean }>;
    }>(actor);
    const outcomes = output.outcomes;
    expect(outcomes).toHaveLength(1);
    expect(outcomes[0]?.agent).toBe('cursor');
  });
});
