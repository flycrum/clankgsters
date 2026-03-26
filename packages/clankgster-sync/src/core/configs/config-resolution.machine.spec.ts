import { describe, expect, test } from 'vite-plus/test';
import { createActor } from 'xstate';
import { actorHelpers } from '../../common/actor-helpers.js';
import { configResolutionMachine } from './config-resolution.machine.js';

describe('configResolutionMachine', () => {
  test('reaches done', async () => {
    const actor = createActor(configResolutionMachine, {
      input: {
        mode: 'sync',
        repoRoot: process.cwd(),
      },
    });
    actor.start();
    const output = await actorHelpers.awaitOutput<{
      details?: { resolvedConfig: Record<string, unknown> };
      mergedConfig: Record<string, unknown>;
      resolvedConfig: Record<string, unknown>;
      sourcesLoaded: string[];
    }>(actor);
    const resolvedConfig = output.resolvedConfig ?? output.details?.resolvedConfig;
    expect(resolvedConfig).toBeDefined();
  });
});
