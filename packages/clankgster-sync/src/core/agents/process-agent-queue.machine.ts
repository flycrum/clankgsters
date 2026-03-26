import { assign, createActor, fromPromise, setup } from 'xstate';
import { actorHelpers } from '../../common/actor-helpers.js';
import type { ClankgsterConfig } from '../configs/clankgster-config.schema.js';
import type { DiscoveredMarketplace } from '../run/sync-discover-agents.js';
import { syncManifest, type SyncManifest, type SyncManifestEntry } from '../run/sync-manifest.js';
import type { AgentQueueOutcome } from './agent-queue-outcome.js';
import { agentTypes, type ClankgsterDefinedAgent } from './agent-types.js';
import {
  processAgentBehaviorsMachine,
  type ProcessAgentBehaviorsObservation,
} from './process-agent-behaviors.machine.js';

export interface ProcessAgentQueueMachineInput {
  discoveredMarketplaces: DiscoveredMarketplace[];
  excluded: string[];
  manifest: SyncManifest;
  mode: 'sync' | 'clear';
  onObservation?: (event: ProcessAgentBehaviorsObservation) => void;
  outputRoot: string;
  repoRoot: string;
  resolvedConfig: ClankgsterConfig;
}

interface ProcessAgentQueueMachineContext {
  errorMessage: string | null;
  index: number;
  input: ProcessAgentQueueMachineInput;
  outcomes: AgentQueueOutcome[];
  queue: ClankgsterDefinedAgent[];
  sharedState: Map<string, unknown>;
}

type ProcessAgentQueueMachineEvent = { type: 'xstate.init' };

/**
 * Processes the agent queue: each entry in `resolvedConfig.agents` **in order**, one at a time (no overlap between agents).
 *
 * **Queue:** `agentTypes.buildQueue(resolvedConfig)` turns `resolvedConfig.agents` (named entries in
 * `clankgster.config.ts` / `clankgster.local.config.ts`, e.g. per–coding-agent front-ends) into a deterministic list. Each item
 * is handed to {@link processAgentBehaviorsMachine}, which runs that agent’s sync behaviors for the current `mode` (`sync` or
 * `clear`).
 *
 * **Orchestration:** Invoked by {@link syncRunMachine} after {@link configResolutionMachine} finishes. Output
 * (`AgentQueueOutcome[]`) becomes the run’s `outcomes` before manifest persistence.
 *
 * Invariants:
 * - Strictly sequential per-agent execution (pairs with {@link processAgentBehaviorsMachine}, which handles one agent).
 * - Output is per-agent outcomes concatenated in queue order.
 */
export const processAgentQueueMachine = setup({
  types: {
    context: {} as ProcessAgentQueueMachineContext,
    events: {} as ProcessAgentQueueMachineEvent,
    input: {} as ProcessAgentQueueMachineInput,
    output: {} as { manifest: SyncManifest; outcomes: AgentQueueOutcome[] },
  },
  actors: {
    runQueuedAgent: fromPromise(
      async ({
        input,
      }: {
        input: {
          mode: 'sync' | 'clear';
          discoveredMarketplaces: DiscoveredMarketplace[];
          excluded: string[];
          manifestByBehaviorName: Record<string, SyncManifestEntry>;
          onObservation?: (event: ProcessAgentBehaviorsObservation) => void;
          outputRoot: string;
          queueItem: ClankgsterDefinedAgent;
          registerManifestEntry: (
            agentName: string,
            behaviorName: string,
            entry: SyncManifestEntry
          ) => void;
          repoRoot: string;
          resolvedConfig: ClankgsterConfig;
          sharedState: Map<string, unknown>;
        };
      }) => {
        const actor = createActor(processAgentBehaviorsMachine, {
          input: {
            agentName: input.queueItem.name,
            behaviors: input.queueItem.config.behaviors ?? [],
            discoveredMarketplaces: input.discoveredMarketplaces,
            excluded: input.excluded,
            manifestByBehaviorName: input.manifestByBehaviorName,
            mode: input.mode,
            onObservation: input.onObservation,
            outputRoot: input.outputRoot,
            registerManifestEntry: input.registerManifestEntry,
            repoRoot: input.repoRoot,
            resolvedConfig: input.resolvedConfig,
            sharedState: input.sharedState,
          },
        });
        actor.start();
        const output = await actorHelpers.awaitOutput<
          | { behaviorOutcomes: unknown[]; outcome: AgentQueueOutcome }
          | {
              behaviorOutcomes: unknown[];
              input: { agentName: string };
              errorMessage: string | null;
            }
        >(actor);
        if ('outcome' in output) return output;
        return {
          behaviorOutcomes: output.behaviorOutcomes,
          outcome: {
            agent: output.input.agentName,
            success: output.errorMessage == null,
          },
        };
      }
    ),
  },
  guards: {
    hasQueueItems: ({ context }) => context.index < context.queue.length,
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QEMYDsAusDKHVgFlkBjACwEs0wA6Cc2AB2QzIGIBtABgF1FQGA9rHIZyAtHxAAPRAEYA7ABZqneZwDM62QDYArJwCcsg4u0AaEAE9EAJhvrqB3epuybugBwHOnD-PUAvgEW+Jg4eDBEZJQ0dIzMbOyyvEgggsKi4pIyCArKqhpaeobGphbWCB7Kiga1SvK1NqYGgcEgoVi4+FEUVNQATgCuaACC6BisEOI0lABuAgDWNB3h3SS9NEOj4whzAsTMYmhc3CeS6SJH2bacNtSmhkqy6toNDYrlcuqc1Po+NtoXrJdAYvIogiFxqtIusYgNhmMwJhWGB+v0BP1qAwADbMABmGIAttQVl0YdE+ltEZhdmh5gdMsceGdUhdGdcELpdNpHNpDNpFC4mrpnp9cqZ7jp5G51PIPHoPDYgm00AIIHBJKSIoRYVRzkJLllUjkALTmKyIM0Q9pQsk6imxehMFikfUZK7GxCKGxilrUbTuTg6GryeR6JVtLVrB3w7ZIjBuw0ST0IF4ef1OTQ+Lz+b7qMWyRTKLwuRRKRSyWQeZzgyO27U9OFTPWsg3slNpjPOb6+Ay5jRijyyX4+TgC73qIweeXWqPkjbUPHIcjYyCJ9ugHLyVzUastTNqbQteQF17UQsuAxNatHzi6ZUBIA */
  id: 'processAgentQueueMachine',
  context: ({ input }) => ({
    errorMessage: null,
    index: 0,
    input,
    outcomes: [],
    queue: agentTypes.buildQueue(input.resolvedConfig),
    sharedState: new Map<string, unknown>(),
  }),
  initial: 'dispatch',
  states: {
    dispatch: {
      always: [{ guard: 'hasQueueItems', target: 'processAgent' }, { target: 'done' }],
    },
    processAgent: {
      invoke: {
        src: 'runQueuedAgent',
        input: ({ context }) => ({
          discoveredMarketplaces: context.input.discoveredMarketplaces,
          excluded: context.input.excluded,
          manifestByBehaviorName:
            context.input.manifest[context.queue[context.index]?.name ?? ''] ?? {},
          mode:
            context.queue[context.index]?.config.enabled === false ? 'clear' : context.input.mode,
          onObservation: context.input.onObservation,
          outputRoot: context.input.outputRoot,
          queueItem: context.queue[context.index] as ClankgsterDefinedAgent,
          registerManifestEntry: (agentName, behaviorName, entry) => {
            const currentAgentManifest = context.input.manifest[agentName] ?? {};
            context.input.manifest[agentName] = {
              ...currentAgentManifest,
              [behaviorName]: entry,
            };
          },
          repoRoot: context.input.repoRoot,
          resolvedConfig: context.input.resolvedConfig,
          sharedState: context.sharedState,
        }),
        onDone: {
          target: 'dispatch',
          actions: assign({
            index: ({ context }) => context.index + 1,
            outcomes: ({ context, event }) => [...context.outcomes, event.output.outcome],
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
    done: {
      type: 'final',
      output: ({ context }) => ({
        manifest: context.outcomes.reduce<SyncManifest>((acc, outcome, index) => {
          if (!outcome.success) return acc;
          const queueItem = context.queue[index];
          const effectiveMode: 'sync' | 'clear' =
            queueItem?.config.enabled === false ? 'clear' : context.input.mode;
          if (effectiveMode !== 'clear') return acc;
          return syncManifest.clearAgent(acc, outcome.agent);
        }, context.input.manifest),
        outcomes: context.outcomes,
      }),
    },
    failed: {
      type: 'final',
      output: ({ context }) => ({
        manifest: context.input.manifest,
        outcomes: context.outcomes,
      }),
    },
  },
});
