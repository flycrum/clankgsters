import { ok, type Result } from 'neverthrow';
import type { AgentCommonValues } from '../agents/agent-presets/agent-common-values.js';
import type {
  ClankgsterBehaviorConfig,
  ClankgsterConfig,
  SyncArtifactMode,
} from '../configs/clankgster-config.schema.js';
import type { DiscoveredMarketplace } from '../run/sync-discover-agents.js';
import type { SyncManifestEntry } from '../run/sync-manifest.js';

/** Callback used by sync behaviors to upsert one manifest entry during `sync` mode. */
export type RegisterBehaviorManifestEntry = (
  /** Key for this agent in the unified sync manifest. */
  agentName: string,
  /** Preset class name; must match {@link ClankgsterBehaviorConfig.behaviorName}. */
  behaviorName: string,
  /** Structured payload (symlinks, options, teardown hints) to persist or replace. */
  entry: SyncManifestEntry
) => void;

/** Runtime context passed to every sync behavior hook execution. */
export interface SyncBehaviorRunContext {
  /** Agent being synced (e.g. `claude`, `cursor`). */
  agentName: string;
  /** Agent-level common values resolved from built-in presets (or safe custom fallbacks). */
  agentsCommonValues: AgentCommonValues;
  /** Effective output artifact mode for this behavior (`copy` or `symlink`). */
  artifactMode: SyncArtifactMode;
  /** Resolved behavior definition for this run (registry id, options, enabled flag). */
  behaviorConfig: ClankgsterBehaviorConfig;
  /** Repo-relative paths excluded from generated outputs. */
  excluded: string[];
  /** Previously stored manifest entry for this `(agentName, behaviorName)` pair, if any. */
  manifestEntry: SyncManifestEntry | undefined;
  /** Sync vs clear/teardown mode for this invocation. */
  mode: 'sync' | 'clear';
  /** Root directory for agent-local outputs. */
  outputRoot: string;
  /** Persists one behavior slice into the unified manifest. */
  registerManifestEntry: RegisterBehaviorManifestEntry;
  /** Repository root for discovery-relative paths. */
  repoRoot: string;
  /** Fully resolved sync configuration. */
  resolvedConfig: ClankgsterConfig;
  /** Per-agent scratch map shared across behavior presets in one run. */
  sharedState: Map<string, unknown>;
  /** Marketplaces and plugins discovered for this sync. */
  discoveredMarketplaces: DiscoveredMarketplace[];
}

/** Constructor signature for a concrete sync behavior class in the behavior registry. */
export interface SyncBehaviorClassRef {
  new (): SyncBehaviorBase;
}

export class SyncBehaviorBase {
  /** Runs once before `syncRun` for this behavior (defaults to no-op `ok`). */
  syncSetupBefore(_context: SyncBehaviorRunContext): Result<void, Error> {
    return ok(undefined);
  }

  /** Main work for this `(agentName, behaviorConfig.behaviorName)` pair (defaults to no-op `ok`). */
  syncRun(_context: SyncBehaviorRunContext): Result<void, Error> {
    return ok(undefined);
  }

  /** Runs once after `syncRun` (defaults to no-op `ok`). */
  syncTeardownAfter(_context: SyncBehaviorRunContext): Result<void, Error> {
    return ok(undefined);
  }
}

export const syncBehaviorBase = {
  /** Returns a fresh `SyncBehaviorBase` instance. */
  create(behaviorClass: SyncBehaviorClassRef): SyncBehaviorBase {
    return new behaviorClass();
  },
};
