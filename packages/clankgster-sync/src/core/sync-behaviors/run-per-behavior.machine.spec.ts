import { describe, expect, test } from 'vite-plus/test';
import { createActor } from 'xstate';
import { actorHelpers } from '../../common/actor-helpers.js';
import { clankgsterIdentity } from '../../common/clankgster-identity.js';
import { clankgsterConfigDefaults } from '../configs/clankgster-config.defaults.js';
import { runPerBehaviorMachine } from './run-per-behavior.machine.js';

describe('runPerBehaviorMachine', () => {
  test('reaches done and returns success output', async () => {
    const actor = createActor(runPerBehaviorMachine, {
      input: {
        agentName: 'cursor',
        behaviorConfig: {
          enabled: true,
          behaviorName: 'AgentRulesSymlinkSyncPreset',
          options: {},
        },
        discoveredMarketplaces: [],
        excluded: [],
        manifestEntry: undefined,
        mode: 'sync',
        outputRoot: process.cwd(),
        registerManifestEntry: () => {},
        repoRoot: process.cwd(),
        resolvedConfig: {
          agents: {},
          excluded: [],
          loggingEnabled: false,
          sourceDefaults: { ...clankgsterConfigDefaults.CONSTANTS.sourceDefaults },
          syncCacheDir: clankgsterIdentity.SYNC_CACHE_DIR,
          syncManifestPath: clankgsterIdentity.defaultSyncManifestRelativePath,
        },
        sharedState: new Map(),
      },
    });
    actor.start();
    const output = await actorHelpers.awaitOutput<{
      errorMessage?: string | null;
      input?: { behaviorName?: string };
      agent: string;
      behaviorName: string;
      success: boolean;
    }>(actor);
    const success = output.success ?? output.errorMessage == null;
    expect(success).toBe(true);
    expect(output.agent ?? 'cursor').toBe('cursor');
  });
});
