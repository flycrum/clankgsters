import { assign, createActor, fromPromise, setup } from 'xstate';
import { actorHelpers } from '../../common/actor-helpers.js';
import { clankLogger } from '../../common/logger.js';
import { syncFs } from '../../common/sync-fs.js';
import type { AgentQueueOutcome } from '../agents/agent-queue-outcome.js';
import { processAgentQueueMachine } from '../agents/process-agent-queue.machine.js';
import { configResolutionMachine } from '../configs/config-resolution.machine.js';
import { syncArtifactModeConfig } from '../sync-behaviors/sync-artifact-mode.config.js';
import { syncDiscover } from './sync-discover-agents.js';
import { syncManifest, type SyncManifest } from './sync-manifest.js';
import type {
  SyncRunMachineContext,
  SyncRunMachineEvent,
  SyncRunMachineInput,
} from './sync-run.types.js';

function observe(
  input: SyncRunMachineInput,
  eventName: string,
  payload?: Record<string, unknown>
): void {
  input.onObservation?.({ eventName, payload });
}

export const syncRunMachine = setup({
  types: {
    context: {} as SyncRunMachineContext,
    events: {} as SyncRunMachineEvent,
    input: {} as SyncRunMachineInput,
    output: {} as { errorMessage: string | null; outcomes: AgentQueueOutcome[]; success: boolean },
  },
  actors: {
    resolveConfigActor: fromPromise(
      async ({ input }: { input: { mode: 'sync' | 'clear'; repoRoot: string } }) => {
        const actor = createActor(configResolutionMachine, { input });
        actor.start();
        const output = await actorHelpers.awaitOutput<
          | {
              mergedConfig: Record<string, unknown>;
              resolvedConfig: NonNullable<SyncRunMachineContext['resolvedConfig']>;
              sourcesLoaded: string[];
            }
          | {
              details: {
                resolvedConfig: NonNullable<SyncRunMachineContext['resolvedConfig']>;
                sourcesLoaded: string[];
              };
            }
        >(actor);
        if ('resolvedConfig' in output) return output;
        return output.details;
      }
    ),
    runAgentsActor: fromPromise(
      async ({
        input,
      }: {
        input: {
          mode: 'sync' | 'clear';
          discoveredMarketplaces: SyncRunMachineContext['discoveredMarketplaces'];
          excluded: string[];
          manifest: SyncManifest;
          resolvedConfig: NonNullable<SyncRunMachineContext['resolvedConfig']>;
          repoRoot: string;
          outputRoot: string;
        };
      }) => {
        const actor = createActor(processAgentQueueMachine, { input });
        actor.start();
        const output = await actorHelpers.awaitOutput<
          | { manifest: SyncManifest; outcomes: AgentQueueOutcome[] }
          | AgentQueueOutcome[]
          | { outcomes: AgentQueueOutcome[] }
        >(actor);
        if (Array.isArray(output)) return { manifest: input.manifest, outcomes: output };
        if ('manifest' in output) return output;
        return { manifest: input.manifest, outcomes: output.outcomes };
      }
    ),
    /** Discovery + manifest load (was synchronous `prepareManifestAndDiscovery`); errors surface via invoke `onError` → `failed`. */
    prepareManifestAndDiscoveryActor: fromPromise(
      async ({
        input,
      }: {
        input: {
          resolvedConfig: NonNullable<SyncRunMachineContext['resolvedConfig']>;
          syncRunInput: SyncRunMachineInput;
        };
      }) => {
        const { resolvedConfig, syncRunInput } = input;
        const discoveryResult = syncDiscover.discoverMarketplaces({
          agentNames: Object.keys(resolvedConfig.agents),
          excluded: resolvedConfig.excluded,
          repoRoot: syncRunInput.repoRoot,
          sourceDefaults: resolvedConfig.sourceDefaults,
        });
        if (discoveryResult.isErr()) throw discoveryResult.error;
        const manifestPath = syncManifest.getManifestPath(
          syncRunInput.repoRoot,
          resolvedConfig.syncManifestPath
        );
        const manifestResult = syncManifest.load(manifestPath);
        if (manifestResult.isErr()) throw manifestResult.error;
        observe(syncRunInput, 'sync.discovery', {
          marketplacesCount: discoveryResult.value.length,
        });
        observe(syncRunInput, 'sync.persistManifest', { manifestPath });
        return {
          discoveredMarketplaces: discoveryResult.value,
          manifest: manifestResult.value,
        };
      }
    ),
    /** Manifest write (was `persistManifest` entry action); errors surface via invoke `onError` → `failed`. */
    persistManifestActor: fromPromise(
      async ({
        input,
      }: {
        input: {
          manifest: SyncManifest;
          mode: 'sync' | 'clear';
          repoRoot: string;
          syncManifestPath: string;
        };
      }) => {
        const manifestPath = syncManifest.getManifestPath(input.repoRoot, input.syncManifestPath);
        if (input.mode === 'clear') {
          syncFs.removePathIfExists(manifestPath);
          syncFs.pruneEmptyParentDirs(manifestPath, input.repoRoot);
          return;
        }
        const writeResult = syncManifest.write(manifestPath, input.manifest);
        if (writeResult.isErr()) throw writeResult.error;
      }
    ),
  },
  actions: {
    initializeLogger: ({ context }) => {
      clankLogger.setLoggerContext({
        repoRoot: context.input.repoRoot,
      });
      observe(context.input, 'sync.boot');
    },
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5SwJ4DsDGAlArmgsgIYYAWAlmmAHQBGA9nQC4DEA2gAwC6ioADnbDKMydNDxAAPRACYAbAEYqAZgCs8lbOkqANCBSJ58gBxUA7HI1aAvld2pMuAsXKUqAJzh0ANgDcwAYVEAMzIoZghRagofOgBrantsPCJSCmoPWG8-QLQQqARougxCYVEOTnLxfkFSsSRJRFl2WSppUyUAFiVTHT0ZQyp2aU7ulRs7dCSnVNcMrIDg0OYwNzc6NypeLxKg9YBbKkTHFJd0z18F3NCCtBji2vLK+uqhETrQKQQmlraRnt19AgjIoxrYQEdks40u48ABBGBoRiwcKRKiFeKHSbHKGzOEIpE3O4lN6PLhVASvUTiT7ydgATnYgxUHVkRn+fQQSnkpio3LprJ643BWMhM3SeLAiORKzWGy2O32mIcotOMLQ8MlBMK9xJXCefAptWpBnpjPYzIFvUB0mGZgsmlBE2V01VvBWglgjCIaDIQTgLH1IBeRvqNLUPNMHWkxnZgM6jPUDpsYLQdAgcHEEJdaXJNTexoQAFpZADEMWhVmTtD6Exc5T3g0EFHSwg6R1WvbrGDKzizpkLjk8nWQx9EKoWl1Y4g2x3ZJZHcLnVXcer8fBnob86HEEYFFQjNJgVoW8MJyouV2nVNl9Q3W4PV7CD6-Z7h1vRwh5NJ+a0rWP1FQc5Jt2IrZq4ESUG+VLbp+CjSPuh5fn+nLdFQDLAVe2JilQQSEGQXiQFBDY0t+PzIbSdL7nSSg2nS8iyAxjGyMmVhAA */
  id: 'syncRunMachine',
  context: ({ input }) => ({
    errorMessage: null,
    input,
    outcomes: [],
    discoveredMarketplaces: [],
    manifest: {},
    resolvedConfig: null,
  }),
  initial: 'boot',
  states: {
    boot: {
      entry: 'initializeLogger',
      always: {
        target: 'resolveConfig',
      },
    },
    resolveConfig: {
      invoke: {
        src: 'resolveConfigActor',
        input: ({ context }) => ({
          mode: context.input.mode,
          repoRoot: context.input.repoRoot,
        }),
        onDone: {
          target: 'prepareDiscovery',
          actions: [
            assign({
              resolvedConfig: ({ event }) =>
                (
                  event.output as {
                    resolvedConfig: NonNullable<SyncRunMachineContext['resolvedConfig']>;
                  }
                ).resolvedConfig,
            }),
            ({ context, event }) => {
              const output = event.output as {
                resolvedConfig: NonNullable<SyncRunMachineContext['resolvedConfig']>;
                sourcesLoaded: string[];
              };
              clankLogger.setLoggerContext({
                loggingEnabled: output.resolvedConfig.loggingEnabled,
                outputRoot: output.resolvedConfig.syncOutputRoot,
                repoRoot: context.input.repoRoot,
              });
              clankLogger.getLogger().info({ sources: output.sourcesLoaded }, 'config resolved');
              const symlinkModeBehaviors = syncArtifactModeConfig.listSymlinkModeBehaviors(
                output.resolvedConfig
              );
              if (symlinkModeBehaviors.length > 0) {
                clankLogger.getLogger().warn(
                  {
                    behaviors: symlinkModeBehaviors,
                    count: symlinkModeBehaviors.length,
                  },
                  '⚠️⚠️⚠️ symlink artifact mode is enabled; file transforms (links/xml/template variables) are limited in this mode'
                );
              }
              observe(context.input, 'sync.configResolved', {
                sourcesLoaded: output.sourcesLoaded,
              });
            },
          ],
        },
        onError: {
          target: 'failed',
          actions: assign({
            errorMessage: ({ event }) => String(event.error),
          }),
        },
      },
    },
    prepareDiscovery: {
      invoke: {
        src: 'prepareManifestAndDiscoveryActor',
        input: ({ context }) => ({
          resolvedConfig: context.resolvedConfig as NonNullable<
            SyncRunMachineContext['resolvedConfig']
          >,
          syncRunInput: context.input,
        }),
        onDone: {
          target: 'runAgents',
          actions: assign({
            discoveredMarketplaces: ({ event }) =>
              (
                event.output as {
                  discoveredMarketplaces: SyncRunMachineContext['discoveredMarketplaces'];
                  manifest: SyncManifest;
                }
              ).discoveredMarketplaces,
            manifest: ({ event }) =>
              (event.output as { discoveredMarketplaces: unknown; manifest: SyncManifest })
                .manifest,
          }),
        },
        onError: {
          target: 'failed',
          actions: assign({
            errorMessage: ({ event }) => String(event.error),
          }),
        },
      },
    },
    runAgents: {
      invoke: {
        src: 'runAgentsActor',
        input: ({ context }) => ({
          discoveredMarketplaces: context.discoveredMarketplaces,
          excluded: context.resolvedConfig?.excluded ?? [],
          manifest: context.manifest,
          mode: context.input.mode,
          outputRoot: context.resolvedConfig?.syncOutputRoot ?? context.input.repoRoot,
          repoRoot: context.input.repoRoot,
          resolvedConfig: context.resolvedConfig as NonNullable<
            SyncRunMachineContext['resolvedConfig']
          >,
        }),
        onDone: {
          target: 'persistManifest',
          actions: [
            assign({
              manifest: ({ context, event }) =>
                (event.output as { manifest: SyncManifest; outcomes: AgentQueueOutcome[] })
                  .manifest ?? context.manifest,
              outcomes: ({ event }) =>
                (event.output as { manifest: SyncManifest; outcomes: AgentQueueOutcome[] })
                  .outcomes,
            }),
          ],
        },
        onError: {
          target: 'failed',
          actions: assign({
            errorMessage: ({ event }) => String(event.error),
          }),
        },
      },
    },
    persistManifest: {
      invoke: {
        src: 'persistManifestActor',
        input: ({ context }) => ({
          manifest: context.manifest,
          mode: context.input.mode,
          repoRoot: context.input.repoRoot,
          syncManifestPath: (
            context.resolvedConfig as NonNullable<SyncRunMachineContext['resolvedConfig']>
          ).syncManifestPath,
        }),
        onDone: {
          target: 'done',
        },
        onError: {
          target: 'failed',
          actions: assign({
            errorMessage: ({ event }) => String(event.error),
          }),
        },
      },
    },
    done: {
      type: 'final',
      output: ({ context }) => ({
        errorMessage: null,
        outcomes: context.outcomes,
        success: true,
      }),
    },
    failed: {
      type: 'final',
      output: ({ context }) => ({
        errorMessage: context.errorMessage,
        outcomes: context.outcomes,
        success: false,
      }),
    },
  },
});
