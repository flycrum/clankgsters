import { assign, createActor, fromPromise, setup } from 'xstate';
import { actorHelpers } from '../../common/actor-helpers.js';
import type {
  ClankgstersBehaviorConfig,
  ClankgstersConfig,
} from '../configs/clankgsters-config.schema.js';
import type { DiscoveredMarketplace } from '../run/sync-discover-agents.js';
import type { SyncManifestEntry } from '../run/sync-manifest.js';
import type { SyncBehaviorOutcome } from '../sync-behaviors/behavior-outcome.js';
import {
  runPerBehaviorMachine,
  type RunPerBehaviorObservation,
} from '../sync-behaviors/run-per-behavior.machine.js';
import { agentAdapterBase } from './agent-adapter-base.js';
import type { AgentQueueOutcome } from './agent-queue-outcome.js';

/**
 * High-level observation from {@link processAgentBehaviorsMachine} (adapter lifecycle and behavior queue), distinct from {@link RunPerBehaviorObservation} behavior-stage events.
 */
export interface ProcessAgentBehaviorsObservation {
  /** Agent currently being processed. */
  agentName: string;
  /** Machine stage label (e.g. `agent.createAdapter`, `agent.runBehavior`). */
  eventName: string;
  /** Optional structured detail for the event (e.g. `behaviorName` on `agent.runBehavior`). */
  payload?: Record<string, unknown>;
}

/**
 * Input to {@link processAgentBehaviorsMachine}: one agent’s behaviors, manifest slice, and sync/clear mode.
 */
export interface ProcessAgentBehaviorsMachineInput {
  /** Name of the agent entry from resolved config (e.g. `claude`, `cursor`). */
  agentName: string;
  /** Preset configs executed in order; each child sees `mode` from this input (clear vs sync). */
  behaviors: ClankgstersBehaviorConfig[];
  /** Plugins/marketplaces discovered for this run; passed into each behavior preset. */
  discoveredMarketplaces: DiscoveredMarketplace[];
  /** Repo-relative paths/globs excluded from sync outputs. */
  excluded: string[];
  /** Prior manifest entries for this agent keyed by config `behaviorName` (preset class name). */
  manifestByBehaviorName: Record<string, SyncManifestEntry>;
  /**
   * Whether behaviors perform sync work or teardown-only clear. The queue sets `clear` when the agent
   * is disabled while the overall run is sync; this input does not carry a separate `enabled` flag.
   */
  mode: 'sync' | 'clear';
  /** Optional hook for adapter- and queue-level observations plus forwarded behavior-stage events. */
  onObservation?: (event: ProcessAgentBehaviorsObservation | RunPerBehaviorObservation) => void;
  /** Root directory for agent outputs (settings, symlinks, marketplace file, etc.). */
  outputRoot: string;
  /**
   * Upserts one behavior’s manifest entry for this agent (used by presets during sync).
   * @param agentName - Agent key in the unified manifest.
   * @param behaviorName - Preset class name / {@link ClankgstersBehaviorConfig.behaviorName}.
   * @param entry - Symlinks, options, and teardown hints to persist.
   */
  registerManifestEntry: (
    agentName: string,
    behaviorName: string,
    entry: SyncManifestEntry
  ) => void;
  /** Repository root used for discovery-relative paths. */
  repoRoot: string;
  /** Fully resolved sync config (source defaults, agents map, paths). */
  resolvedConfig: ClankgstersConfig;
  /** Cross-behavior mutable bag for the current agent run (e.g. shared preset state). */
  sharedState: Map<string, unknown>;
}

/** XState context while {@link processAgentBehaviorsMachine} steps through adapter + behavior actors. */
interface ProcessAgentBehaviorsMachineContext {
  /** Outcomes from each completed `runPerBehaviorMachine` child, in run order. */
  behaviorOutcomes: SyncBehaviorOutcome[];
  /** Set when adapter or a behavior actor throws; surfaced on the failed final state. */
  errorMessage: string | null;
  /** Index into `input.behaviors` for the next queued behavior. */
  index: number;
  /** Immutable input snapshot for this machine instance. */
  input: ProcessAgentBehaviorsMachineInput;
}

type ProcessAgentBehaviorsMachineEvent = { type: 'xstate.init' };

/**
 * Forwards a {@link ProcessAgentBehaviorsObservation} to `input.onObservation` when the callback is set.
 * @param input - Machine input carrying `agentName` and the optional observer.
 * @param eventName - Stage label for this observation.
 * @param payload - Optional extra fields merged into the observation object.
 */
function emitObservation(
  input: ProcessAgentBehaviorsMachineInput,
  eventName: string,
  payload?: Record<string, unknown>
): void {
  input.onObservation?.({
    agentName: input.agentName,
    eventName,
    payload,
  });
}

/**
 * Processes one agent’s sync lifecycle: adapter hooks, then each configured behavior in order via
 * {@link runPerBehaviorMachine} child actors.
 *
 * Invariants:
 * - Behavior order is deterministic.
 * - Each behavior runs as its own child actor (`runPerBehaviorMachine`).
 * - Adapter lifecycle runs before the behavior loop.
 */
export const processAgentBehaviorsMachine = setup({
  types: {
    context: {} as ProcessAgentBehaviorsMachineContext,
    events: {} as ProcessAgentBehaviorsMachineEvent,
    input: {} as ProcessAgentBehaviorsMachineInput,
    output: {} as { behaviorOutcomes: SyncBehaviorOutcome[]; outcome: AgentQueueOutcome },
  },
  actors: {
    runAdapterLifecycle: fromPromise(
      async ({ input }: { input: ProcessAgentBehaviorsMachineInput }) => {
        emitObservation(input, 'agent.createAdapter');
        const adapter = agentAdapterBase.create();
        const result = adapter.runLifecycle({
          agentName: input.agentName,
          mode: input.mode,
        });
        if (result.isErr()) throw result.error;
      }
    ),
    runQueuedBehavior: fromPromise(
      async ({
        input,
      }: {
        input: {
          behaviorConfig: ClankgstersBehaviorConfig;
          behaviorsInput: ProcessAgentBehaviorsMachineInput;
        };
      }) => {
        emitObservation(input.behaviorsInput, 'agent.runBehavior', {
          behaviorName: input.behaviorConfig.behaviorName,
        });
        const behaviorName = input.behaviorConfig.behaviorName;
        const actor = createActor(runPerBehaviorMachine, {
          input: {
            agentName: input.behaviorsInput.agentName,
            behaviorConfig: input.behaviorConfig,
            discoveredMarketplaces: input.behaviorsInput.discoveredMarketplaces,
            excluded: input.behaviorsInput.excluded,
            manifestEntry: input.behaviorsInput.manifestByBehaviorName[behaviorName],
            mode: input.behaviorsInput.mode,
            onObservation: input.behaviorsInput.onObservation,
            outputRoot: input.behaviorsInput.outputRoot,
            registerManifestEntry: input.behaviorsInput.registerManifestEntry,
            repoRoot: input.behaviorsInput.repoRoot,
            resolvedConfig: input.behaviorsInput.resolvedConfig,
            sharedState: input.behaviorsInput.sharedState,
          },
        });
        actor.start();
        const output = await actorHelpers.awaitOutput<
          | SyncBehaviorOutcome
          | { input: { agentName: string; behaviorName: string }; errorMessage: string | null }
        >(actor);
        if ('success' in output) return output;
        return {
          agent: output.input.agentName,
          behaviorName: output.input.behaviorName,
          success: output.errorMessage == null,
        };
      }
    ),
  },
  guards: {
    hasMoreBehaviors: ({ context }) => context.index < context.input.behaviors.length,
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QAcwCcCCMB2AXAsgIYDGAFgJbZgB0xaYhuYGEhyTaAxBAPZXWUAbjwDWNVJhwESFfnQZMWbDgiE9ijcnwDaABgC6e-YhQ9Y5XFuwmQAD0QAmAOy7qARgBsAFl0AOB55e3r4eADQgAJ6Ibk4ArNS6Tr6Jbroebr6+ngC+2eESWGB4RGSUNPKMzKzs6JzoaDxo1MgANowAZo0Ats3ohcUyZbT0lUo1aKrYwhqWOgZGNshmFlY29gjOroF+Ad7BYZGIWdReAJznWQ4OHqdOqQDMufl9UiWyNABGYKSEglpoABFyLBkIwyJwFkgQEtzLNrFD1pt3N4doF9uEogh7p53LF0njfF47rpYo88tCXkVpKV+F8fn9GkCQWDSBC3MYoTCVnw1ogPE57tR7nESQ4vL44qcvG4MYhsR5cfiPITiaSnhTJFS3kM0ABXbAAIW+v3+3D4NDUYl6moGNJoesNxoZEzUMysRkhplhqwRjhcyJ8-jR4oOmPuHgcircsSuvlObjObjJzxt1Pe1AdRvppvqjWabVwnTQPQKr0G-EzTv+k2mmjmhgMi2WcN5G392yDexDso2V2osSSaRcbgCUqcuXJ2B4EDgi0ptveTe9PN9CAAtKHEBv1aWteXyiNFNUOEvufDQOsvA4e1LqA447p7g48R5Hx4Bzv52mhnSTYzgaCuBkKeLarmcgpBLotwjmKTj8vcPbYl4JxpNGr4qroSafqm2oVvqWZ-mgIE+heiCxK4DiPjBUoZF4sRxj2YqCk4V5uJ4LH0QOLHYf0378LwVDESupEIL49y+P2IS6LodEhPcpwIYcWJJlGHjCtJ5F3DxZZ2tQ7SEOQLSQEJ552Ig4EnK+0FXES8E9qkpzUKcsR4qcmTnPcQQOBO2RAA */
  id: 'processAgentBehaviorsMachine',
  context: ({ input }) => ({
    behaviorOutcomes: [],
    errorMessage: null,
    index: 0,
    input,
  }),
  initial: 'adapterLifecycle',
  states: {
    adapterLifecycle: {
      invoke: {
        src: 'runAdapterLifecycle',
        input: ({ context }) => context.input,
        onDone: {
          target: 'behaviorDispatch',
        },
        onError: {
          target: 'failed',
          actions: assign({
            errorMessage: ({ event }) => String(event.error),
          }),
        },
      },
    },
    behaviorDispatch: {
      always: [{ guard: 'hasMoreBehaviors', target: 'processBehavior' }, { target: 'done' }],
    },
    processBehavior: {
      invoke: {
        src: 'runQueuedBehavior',
        input: ({ context }) => ({
          behaviorConfig: context.input.behaviors[context.index] as ClankgstersBehaviorConfig,
          behaviorsInput: context.input,
        }),
        onDone: {
          target: 'behaviorDispatch',
          actions: assign({
            behaviorOutcomes: ({ context, event }) => [...context.behaviorOutcomes, event.output],
            index: ({ context }) => context.index + 1,
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
        behaviorOutcomes: context.behaviorOutcomes,
        outcome: {
          agent: context.input.agentName,
          success: true,
        },
      }),
    },
    failed: {
      type: 'final',
      output: ({ context }) => ({
        behaviorOutcomes: context.behaviorOutcomes,
        outcome: {
          agent: context.input.agentName,
          success: false,
        },
      }),
    },
  },
});
