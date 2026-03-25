import { ok, type Result } from 'neverthrow';
import fs from 'node:fs';
import path from 'node:path';
import { z } from 'zod';
import { syncManifest } from '../../run/sync-manifest.js';
import { syncSourceLayouts, type SyncSourceLayoutKey } from '../../run/sync-source-layouts.js';
import { SyncBehaviorBase, type SyncBehaviorRunContext } from '../sync-behavior-base.js';

interface AgentMarketplacePluginEntry {
  description?: string;
  name: string;
  source: string;
  version?: string;
}

interface AgentMarketplaceJson {
  name: string;
  owner: { name: string };
  plugins: AgentMarketplacePluginEntry[];
}

interface AgentMarketplaceLayoutCustomData {
  plugins: AgentMarketplacePluginEntry[];
}

const AGENT_MARKETPLACE_SOURCE_FORMAT_VALUES = ['prefixed', 'relative'] as const;
export type AgentMarketplaceSourceFormat = (typeof AGENT_MARKETPLACE_SOURCE_FORMAT_VALUES)[number];

const agentMarketplaceJsonSyncPresetOptionsSchema = z.looseObject({
  manifestKey: z.string().min(1).optional(),
  marketplaceFile: z.string().min(1).nullable().optional(),
  marketplaceName: z.string().min(1).optional(),
  sourceFormat: z.enum(AGENT_MARKETPLACE_SOURCE_FORMAT_VALUES).nullable().optional(),
});

/** Typed options for `AgentMarketplaceJsonSyncPreset`. */
export interface AgentMarketplaceJsonSyncPresetOptions {
  /** Manifest key used by downstream settings integration bookkeeping. */
  manifestKey?: string;
  /** Marketplace JSON file path; `null` disables this behavior for an agent. */
  marketplaceFile?: string | null;
  /** Marketplace `name` value written to output JSON. */
  marketplaceName?: string;
  /** Plugin `source` path serialization style. */
  sourceFormat?: AgentMarketplaceSourceFormat | null;
}

function createAgentMarketplaceCustomData(): Record<
  SyncSourceLayoutKey,
  AgentMarketplaceLayoutCustomData
> {
  return {
    nestedRegular: { plugins: [] },
    nestedLocal: { plugins: [] },
    shorthandRegular: { plugins: [] },
    shorthandLocal: { plugins: [] },
  };
}

/** `prefixed` -> `./<repo-relative>`; `relative` -> `<repo-relative>`. */
function formatMarketplacePluginSource(
  pluginRelativePath: string,
  sourceFormat: AgentMarketplaceSourceFormat
): string {
  return sourceFormat === 'relative' ? pluginRelativePath : `./${pluginRelativePath}`;
}

/**
 * Writes per-agent marketplace json and records plugin metadata in the unified manifest.
 * Marketplace `name` comes from `resolvedConfig.sourceDefaults.localMarketplaceName` (see `clankgstersConfigSchema.sourceDefaults`).
 */
export class AgentMarketplaceJsonSyncPreset extends SyncBehaviorBase {
  override syncRun(context: SyncBehaviorRunContext): Result<void, Error> {
    const localMarketplaceName = context.resolvedConfig.sourceDefaults.localMarketplaceName;
    const parsed = agentMarketplaceJsonSyncPresetOptionsSchema.safeParse(
      context.behaviorConfig.options
    );
    const optionsFallbacks = {
      manifestKey: context.agentName,
      marketplaceFile: `.${context.agentName}/marketplace.json`,
      marketplaceName: localMarketplaceName,
      sourceFormat: 'prefixed' as AgentMarketplaceSourceFormat,
      ...(parsed.success ? parsed.data : {}),
    };
    const marketplaceFile =
      typeof optionsFallbacks.marketplaceFile === 'string'
        ? optionsFallbacks.marketplaceFile
        : null;
    const sourceFormat: AgentMarketplaceSourceFormat | null =
      optionsFallbacks.sourceFormat === 'relative'
        ? 'relative'
        : optionsFallbacks.sourceFormat === 'prefixed'
          ? 'prefixed'
          : null;
    if (marketplaceFile == null || sourceFormat == null) return ok(undefined);
    const resolvedOptions = { ...optionsFallbacks, marketplaceFile, sourceFormat };
    const targetPath = path.join(context.outputRoot, marketplaceFile);

    if (context.mode === 'clear' || context.behaviorConfig.enabled === false) {
      syncManifest.teardownEntry(context.outputRoot, {
        fsAutoRemoval: [marketplaceFile],
      });
      return ok(undefined);
    }

    const plugins: AgentMarketplacePluginEntry[] = [];
    const customData = createAgentMarketplaceCustomData();
    for (const marketplace of context.discoveredMarketplaces) {
      for (const plugin of marketplace.plugins) {
        if (plugin.manifests[context.agentName] !== true) continue;
        const pluginEntry: AgentMarketplacePluginEntry = {
          name: plugin.manifestName ?? plugin.name,
          source: formatMarketplacePluginSource(plugin.relativePath, sourceFormat),
          description: plugin.description,
          version: plugin.version,
        };
        plugins.push(pluginEntry);
        customData[marketplace.layout].plugins.push(pluginEntry);
      }
    }
    plugins.sort((left, right) => left.name.localeCompare(right.name));
    for (const layout of syncSourceLayouts.SYNC_SOURCE_LAYOUT_KEYS) {
      customData[layout].plugins.sort((left, right) => left.name.localeCompare(right.name));
    }

    const payload: AgentMarketplaceJson = {
      name: resolvedOptions.marketplaceName,
      owner: { name: 'clankgsters' },
      plugins,
    };
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.writeFileSync(targetPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

    context.registerManifestEntry(context.agentName, context.behaviorConfig.behaviorName, {
      options: resolvedOptions,
      customData,
    });
    return ok(undefined);
  }
}
