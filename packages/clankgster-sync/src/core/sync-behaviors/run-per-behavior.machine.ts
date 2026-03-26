import type { Result } from 'neverthrow';
import { assign, fromPromise, setup } from 'xstate';
import { clankLogger } from '../../common/logger.js';
import type {
  ClankgsterBehaviorConfig,
  ClankgsterConfig,
} from '../configs/clankgster-config.schema.js';
import type { DiscoveredMarketplace } from '../run/sync-discover-agents.js';
import type { SyncManifestEntry } from '../run/sync-manifest.js';
import { agentCommonValues } from '../agents/agent-presets/agent-common-values.js';
import type { SyncBehaviorOutcome } from './behavior-outcome.js';
import {
  SyncBehaviorBase,
  syncBehaviorBase,
  type RegisterBehaviorManifestEntry,
  type SyncBehaviorRunContext,
} from './sync-behavior-base.js';
import { syncBehaviorRegistry } from './sync-behavior-registry.js';

/**
 * Observation emitted at each stage (`syncSetup`, `syncRun`, `syncTeardown`) of one behavior run for an agent.
 */
export interface RunPerBehaviorObservation {
  /** Agent whose behavior is executing. */
  agentName: string;
  /** Config `behaviorName` (preset class name), matching {@link ClankgsterBehaviorConfig.behaviorName}. */
  behaviorName: string;
  /** Lifecycle stage label for this observation. */
  eventName: string;
}

/** Input for {@link runPerBehaviorMachine}: one `ClankgsterBehaviorConfig` slice plus shared run context. */
interface RunPerBehaviorMachineInput {
  /** Agent key from resolved config. */
  agentName: string;
  /** Single resolved behavior definition (`behaviorName`, `options`, `enabled`). */
  behaviorConfig: ClankgsterBehaviorConfig;
  /** Marketplaces/plugins discovered for this sync run. */
  discoveredMarketplaces: DiscoveredMarketplace[];
  /** Repo-relative exclude globs forwarded to presets. */
  excluded: string[];
  /** Loaded manifest entry for this agent + `behaviorConfig.behaviorName`, if any. */
  manifestEntry?: SyncManifestEntry;
  /** Sync vs clear/teardown semantics for preset hooks. */
  mode: 'sync' | 'clear';
  /** Optional hook for behavior-stage observations. */
  onObservation?: (event: RunPerBehaviorObservation) => void;
  /** Root for agent outputs (symlinks, generated JSON, etc.). */
  outputRoot: string;
  /** Writes or updates one behavior’s persisted manifest entry for this agent. */
  registerManifestEntry: RegisterBehaviorManifestEntry;
  /** Repository root. */
  repoRoot: string;
  /** Full resolved sync configuration. */
  resolvedConfig: ClankgsterConfig;
  /** Mutable map shared across behaviors for the current agent invocation. */
  sharedState: Map<string, unknown>;
}

interface RunPerBehaviorMachineContext {
  errorMessage: string | null;
  input: RunPerBehaviorMachineInput;
}

type RunPerBehaviorMachineEvent = { type: 'xstate.init' };

function observe(
  input: RunPerBehaviorMachineInput,
  eventName: string,
  logger = clankLogger.getLogger()
): void {
  logger.debug(
    { agent: input.agentName, behaviorName: input.behaviorConfig.behaviorName, eventName },
    'behavior stage'
  );
  input.onObservation?.({
    agentName: input.agentName,
    behaviorName: input.behaviorConfig.behaviorName,
    eventName,
  });
}

function createBehaviorRunPair(input: RunPerBehaviorMachineInput): {
  behaviorInstance: SyncBehaviorBase;
  runContext: SyncBehaviorRunContext;
} {
  const behaviorClass = syncBehaviorRegistry.resolve(input.behaviorConfig.behaviorName);
  const behaviorInstance =
    behaviorClass == null ? new SyncBehaviorBase() : syncBehaviorBase.create(behaviorClass);
  if (behaviorClass == null) {
    clankLogger
      .getLogger()
      .warn(
        { agent: input.agentName, behaviorName: input.behaviorConfig.behaviorName },
        'unknown behavior not in registry; running no-op behavior'
      );
  }
  const runContext: SyncBehaviorRunContext = {
    agentName: input.agentName,
    agentsCommonValues: agentCommonValues.resolve(input.agentName),
    behaviorConfig: input.behaviorConfig,
    discoveredMarketplaces: input.discoveredMarketplaces,
    excluded: input.excluded,
    manifestEntry: input.manifestEntry,
    mode: input.mode,
    outputRoot: input.outputRoot,
    registerManifestEntry: input.registerManifestEntry,
    repoRoot: input.repoRoot,
    resolvedConfig: input.resolvedConfig,
    sharedState: input.sharedState,
  };
  return { behaviorInstance, runContext };
}

function throwIfErr(result: Result<void, Error>): void {
  if (result.isErr()) throw result.error;
}

export const runPerBehaviorMachine = setup({
  types: {
    context: {} as RunPerBehaviorMachineContext,
    events: {} as RunPerBehaviorMachineEvent,
    input: {} as RunPerBehaviorMachineInput,
    output: {} as SyncBehaviorOutcome,
  },
  actors: {
    runBehaviorLifecycle: fromPromise(async ({ input }: { input: RunPerBehaviorMachineInput }) => {
      const { behaviorInstance, runContext } = createBehaviorRunPair(input);
      observe(input, 'syncSetup');
      throwIfErr(behaviorInstance.syncSetupBefore(runContext));
      observe(input, 'syncRun');
      throwIfErr(behaviorInstance.syncRun(runContext));
      observe(input, 'syncTeardown');
      throwIfErr(behaviorInstance.syncTeardownAfter(runContext));
    }),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QAcwCcBCYAWBDAbgJYD2aAsrgMbaEB2YAdLAJ62UDKYALgK7IDEEYvQZ18xANaNUmHARLkqNESzadeyBGOKVcXErQDaABgC6J04hTFYhfcKsgAHogBMAZgAcDAGwBGAHY-AE5PVx9XAFYAFgiAGhBmNzCGV2N3Pz9jMMiAgJ8AXwKEmSw8IlIKajpGVQ5uPn50NFIGZAAbPQAzUgBbNvQy+UqlGqZWeo0tWnFdeyMzC0dkGzsDRxcED29-INDwqNjXBKSEaL9IhgD042DoyMjggMifdyKSwbkKxWqVCYAlHi0QTCRjaKQDWTlBRVZS1AFA6azPQGCxLJAgFa2eYbRCPAKpcKPDLuHwvXInRB+dzBBhPMmk4zGALuaLuVzvTGfaEjX7wtiA4HNVodbp9SFDb6wsZ1QVInQo4RoszLVY4jGbfGEsnBElkskBSlbFkMaL5SLs2LRVzRYIc4pcqHDH5w8ZsAAqYFwaCEAHdgUIRODpNzndK-h6vT7iP75XNUYsVRisWsHBrEE9aTTPLamT5bgFQkbPO4rrbgnbop5gn4fKE-JzSl8YaMI5RPd6-UK0C00G1Olwemh+k2eS6ZRMO9HY9p40rE5Zk2r1umEJmGNnc8Z85nPEbqX5UuXrqTPAFrdkig7aMQIHBlqGpa2wKrsSvQJsALQ+I2fy4VgDAMAwtG0fFs+TdSY+FfVNaFxM5jkSRAaVpO1gh8PIzRzTwMNAp0nwg2UgRg9UP0Qc5SzSDJoliC1nhidwjSiAkT0yC0wkzQoHVHMNn0gqcuxI99nEQZ5aVcPwz2rc9PHSYJ9wuU1zWMDxglyOtgjwyVwNdQMXyXN80zIhBMjyBgYjrVxq3zLx0OLQ9y1CXUfBoqzSS05teVdLpcEIdpICEoyRJMwICQsu1rPSaymLuVJ0iyG01NcKzPCvAogA */
  id: 'runPerBehaviorMachine',
  context: ({ input }) => ({
    errorMessage: null,
    input,
  }),
  initial: 'running',
  states: {
    running: {
      invoke: {
        src: 'runBehaviorLifecycle',
        input: ({ context }) => context.input,
        onDone: { target: 'done' },
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
        agent: context.input.agentName,
        behaviorName: context.input.behaviorConfig.behaviorName,
        success: true,
      }),
    },
    failed: {
      type: 'final',
      output: ({ context }) => ({
        agent: context.input.agentName,
        behaviorName: context.input.behaviorConfig.behaviorName,
        success: false,
      }),
    },
  },
});
