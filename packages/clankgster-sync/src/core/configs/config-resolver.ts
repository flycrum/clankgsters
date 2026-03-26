import { err, type Result } from 'neverthrow';
import type { ClankgsterConfig } from './clankgster-config.schema.js';
import {
  configResolverConfig,
  type ClankgsterConfigResolutionDetails,
} from './config-resolver.config.js';
import { clankgsterConfigSource, type ClankgsterConfigResolutionContext } from './config-source.js';
import { clankgsterConfigSources } from './config-sources.js';

export type { ClankgsterConfigResolutionDetails };

export const clankgsterConfigResolver = {
  /** Loads sources in priority order, merges non-null layers, validates with the schema, and returns details (defaults to `clankgsterConfigSources.defaults()` when `sources` is omitted). */
  async resolve(
    context: ClankgsterConfigResolutionContext,
    sources = clankgsterConfigSources.defaults()
  ): Promise<Result<ClankgsterConfigResolutionDetails, Error>> {
    const sortedSources = [...sources].sort((a, b) => clankgsterConfigSource.comparePriority(a, b));
    const loadedLayers: Partial<ClankgsterConfig>[] = [];
    const loadedSourceIds: string[] = [];

    for (const source of sortedSources) {
      const loadedResult = await configResolverConfig.loadSource(source, context);
      if (loadedResult.isErr()) return err(loadedResult.error);
      const loaded = loadedResult.value;
      if (loaded == null) continue;
      loadedSourceIds.push(source.id);
      loadedLayers.push(loaded);
    }

    const mergedConfig = configResolverConfig.mergeConfigLayers(loadedLayers);
    return configResolverConfig.validateShape(mergedConfig).map((resolvedConfig) => ({
      mergedConfig,
      resolvedConfig,
      sourcesLoaded: loadedSourceIds,
    }));
  },
  validateShape(config: Partial<ClankgsterConfig>) {
    return configResolverConfig.validateShape(config);
  },
};
