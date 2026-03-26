import type {
  ClankgsterBehaviorConfig,
  ClankgsterConfig,
} from '../configs/clankgster-config.schema.js';
import type { SyncArtifactMode } from '../sync-transforms/sync-transform-hooks.js';

/** Artifact mode, whether to copy or symlink files during sync, resolution helpers shared across sync behaviors. */
export const syncArtifactModeConfig = {
  /** Returns true when the provided value is a supported artifact mode literal. */
  isArtifactMode(value: unknown): value is SyncArtifactMode {
    return value === 'copy' || value === 'symlink';
  },

  /** Resolves behavior-level mode from options and falls back to the global config default. */
  resolveBehaviorArtifactMode(
    resolvedConfig: ClankgsterConfig,
    behaviorConfig: ClankgsterBehaviorConfig
  ): SyncArtifactMode {
    const rawMode = behaviorConfig.options?.artifactMode;
    if (this.isArtifactMode(rawMode)) return rawMode;
    return resolvedConfig.artifactMode;
  },

  /** Returns `(agentName, behaviorName)` pairs resolved to explicit symlink mode. */
  listSymlinkModeBehaviors(
    resolvedConfig: ClankgsterConfig
  ): Array<{ agentName: string; behaviorName: string }> {
    const entries: Array<{ agentName: string; behaviorName: string }> = [];
    for (const [agentName, agentConfig] of Object.entries(resolvedConfig.agents)) {
      for (const behaviorConfig of agentConfig.behaviors ?? []) {
        if (this.resolveBehaviorArtifactMode(resolvedConfig, behaviorConfig) !== 'symlink')
          continue;
        entries.push({
          agentName,
          behaviorName: behaviorConfig.behaviorName,
        });
      }
    }
    return entries;
  },
};
