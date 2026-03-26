import { err, ok, type Result } from 'neverthrow';
import { clankgsterConfig } from './clankgster-config.js';
import {
  clankgsterConfigSchema,
  type ClankgsterAgentConfig,
  type ClankgsterConfig,
} from './clankgster-config.schema.js';
import type { ClankgsterConfigResolutionContext, ClankgsterConfigSource } from './config-source.js';

/** Merged partial layers plus validated config and source ids (returned from `clankgsterConfigResolver.resolve` in `config-resolver.ts`). */
export interface ClankgsterConfigResolutionDetails {
  mergedConfig: Partial<ClankgsterConfig>;
  resolvedConfig: ClankgsterConfig;
  sourcesLoaded: string[];
}

/** Merge helpers, layer folding, source load, and schema validation for `clankgsterConfigResolver` (`config-resolver.ts`). */
export const configResolverConfig = {
  /** Merges `layer.agents` into `acc.agents` with one object spread per agent name so partial layers cannot drop prior `behaviors`/`enabled` keys. */
  mergeAgentMaps(
    acc: Record<string, ClankgsterAgentConfig> | undefined,
    layer: Record<string, ClankgsterAgentConfig> | undefined
  ): Record<string, ClankgsterAgentConfig> | undefined {
    const accKeys = acc != null ? Object.keys(acc) : [];
    const layerKeys = layer != null ? Object.keys(layer) : [];
    if (accKeys.length === 0 && layerKeys.length === 0) return undefined;
    if (layerKeys.length === 0) return { ...acc };
    if (accKeys.length === 0) return { ...layer };
    const merged: Record<string, ClankgsterAgentConfig> = {};
    for (const name of new Set([...accKeys, ...layerKeys])) {
      const fromAcc = acc![name];
      const fromLayer = layer![name];
      if (fromLayer === undefined) {
        merged[name] = fromAcc!;
      } else if (fromAcc === undefined) {
        merged[name] = fromLayer;
      } else {
        merged[name] = { ...fromAcc, ...fromLayer };
      }
    }
    return merged;
  },

  /** Deep-merges config layers in order: top-level keys shallow-merge; `agents` merges per agent name (one level); `sourceDefaults` deep-merges; `excluded` uses the latest layer that sets it. One {@link clankgsterConfig.define} pass at the end applies defaults without clobbering prior `sourceDefaults` keys. */
  mergeConfigLayers(layers: Partial<ClankgsterConfig>[]): Partial<ClankgsterConfig> {
    const merged = layers.reduce<Partial<ClankgsterConfig>>((acc, layer) => {
      if (layer == null) return acc;
      return {
        ...acc,
        ...layer,
        agents: this.mergeAgentMaps(acc.agents, layer.agents),
        sourceDefaults: {
          ...acc.sourceDefaults,
          ...layer.sourceDefaults,
        },
        excluded: layer.excluded ?? acc.excluded,
      } as Partial<ClankgsterConfig>;
    }, {});
    return clankgsterConfig.define(merged as Parameters<typeof clankgsterConfig.define>[0]);
  },

  /** Invokes `source.load` and maps failures into a `Result` with the source id in the error message. */
  async loadSource(
    source: ClankgsterConfigSource,
    context: ClankgsterConfigResolutionContext
  ): Promise<Result<Partial<ClankgsterConfig> | null, Error>> {
    try {
      const loaded = await source.load(context);
      return ok(loaded);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return err(new Error(`failed loading config source ${source.id}: ${message}`));
    }
  },

  /** Parses partial config through `clankgsterConfigSchema.config` and returns a full `ClankgsterConfig` or a parse error. */
  validateShape(config: Partial<ClankgsterConfig>): Result<ClankgsterConfig, Error> {
    const parsed = clankgsterConfigSchema.config.safeParse(config);
    if (!parsed.success) {
      return err(new Error(parsed.error.message));
    }
    return ok(parsed.data);
  },
};
