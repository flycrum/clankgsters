import { describe, expect, test } from 'vite-plus/test';
import { createActor } from 'xstate';
import { actorHelpers } from '../../common/actor-helpers.js';
import { clankgstersIdentity } from '../../common/clankgsters-identity.js';
import { perBehaviorMachine } from './per-behavior.machine.js';

describe('perBehaviorMachine', () => {
  test('reaches done and returns success output', async () => {
    const actor = createActor(perBehaviorMachine, {
      input: {
        agentName: 'cursor',
        behavior: { enabled: true, manifestKey: 'rulesSymlink', name: 'rulesSymlink', options: {} },
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
      input?: { behavior?: { name?: string } };
      agent: string;
      behavior: string;
      success: boolean;
    }>(actor);
    const success = output.success ?? output.errorMessage == null;
    expect(success).toBe(true);
    expect(output.agent ?? 'cursor').toBe('cursor');
  });
});
