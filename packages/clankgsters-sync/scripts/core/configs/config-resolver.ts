import { err, type Result } from 'neverthrow';
import type { ClankgstersConfig } from './clankgsters-config.schema.js';
import {
  configResolverConfig,
  type ClankgstersConfigResolutionDetails,
} from './config-resolver.config.js';
import {
  clankgstersConfigSource,
  type ClankgstersConfigResolutionContext,
} from './config-source.js';
import { clankgstersConfigSources } from './config-sources.js';

export type { ClankgstersConfigResolutionDetails };

export const clankgstersConfigResolver = {
  /** Loads sources in priority order, merges non-null layers, validates with the schema, and returns details (defaults to `clankgstersConfigSources.defaults()` when `sources` is omitted). */
  async resolve(
    context: ClankgstersConfigResolutionContext,
    sources = clankgstersConfigSources.defaults()
  ): Promise<Result<ClankgstersConfigResolutionDetails, Error>> {
    const sortedSources = [...sources].sort((a, b) =>
      clankgstersConfigSource.comparePriority(a, b)
    );
    const loadedLayers: Partial<ClankgstersConfig>[] = [];
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
  validateShape(config: Partial<ClankgstersConfig>) {
    return configResolverConfig.validateShape(config);
  },
};
