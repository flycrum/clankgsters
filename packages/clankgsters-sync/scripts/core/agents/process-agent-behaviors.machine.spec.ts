import { describe, expect, test } from 'vite-plus/test';
import { createActor } from 'xstate';
import { actorHelpers } from '../../common/actor-helpers.js';
import { clankgstersIdentity } from '../../common/clankgsters-identity.js';
import { processAgentBehaviorsMachine } from './process-agent-behaviors.machine.js';

describe('processAgentBehaviorsMachine', () => {
  test('invokes perBehavior machine for each behavior', async () => {
    const actor = createActor(processAgentBehaviorsMachine, {
      input: {
        agentName: 'cursor',
        behaviors: [
          { enabled: true, manifestKey: 'rulesSymlink', name: 'rulesSymlink', options: {} },
          { enabled: true, manifestKey: 'skillsSync', name: 'skillsSync', options: {} },
        ],
        discoveredMarketplaces: [],
        enabled: true,
        excluded: [],
        manifestByBehavior: {},
        mode: 'sync',
        outputRoot: process.cwd(),
        registerManifestEntry: () => {},
        repoRoot: process.cwd(),
        resolvedConfig: {
          agents: {},
          excluded: [],
          loggingEnabled: false,
          sourceDefaults: {
            localMarketplaceName: clankgstersIdentity.LOCAL_MARKETPLACE_NAME,
            pluginsDir: 'plugins',
            markdownContextFileName: 'CLANK.md',
            skillFileName: 'SKILL.md',
            skillsDir: 'skills',
            sourceDir: '.clank',
          },
          syncCacheDir: clankgstersIdentity.SYNC_CACHE_DIR,
          syncManifestPath: clankgstersIdentity.defaultSyncManifestRelativePath,
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
