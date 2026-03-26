import { describe, expect, test } from 'vite-plus/test';
import { createActor } from 'xstate';
import { actorHelpers } from '../../common/actor-helpers.js';
import { clankgsterIdentity } from '../../common/clankgster-identity.js';
import { clankgsterConfigDefaults } from '../configs/clankgster-config.defaults.js';
import { processAgentBehaviorsMachine } from './process-agent-behaviors.machine.js';

describe('processAgentBehaviorsMachine', () => {
  test('invokes runPerBehaviorMachine for each behavior', async () => {
    const actor = createActor(processAgentBehaviorsMachine, {
      input: {
        agentName: 'cursor',
        behaviors: [
          { enabled: true, behaviorName: 'AgentRulesSymlinkSyncPreset', options: {} },
          { enabled: true, behaviorName: 'SkillsDirectorySyncPreset', options: {} },
        ],
        discoveredMarketplaces: [],
        excluded: [],
        manifestByBehaviorName: {},
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
        sharedState: new Map<string, unknown>(),
      },
    });
    actor.start();
    const output = await actorHelpers.awaitOutput<{
      errorMessage?: string | null;
      input?: { agentName: string };
      behaviorOutcomes: { success: boolean }[];
      outcome: { agent: string; success: boolean };
    }>(actor);
    const outcome = output.outcome ?? {
      agent: output.input?.agentName ?? 'unknown',
      success: output.errorMessage == null,
    };
    expect(outcome.success).toBe(true);
    expect(output.behaviorOutcomes).toHaveLength(2);
  });
});
