import { ok, type Result } from 'neverthrow';
import fs from 'node:fs';
import path from 'node:path';
import { agentPresetConfigs } from '../../agents/agent-presets/agent-preset-configs.js';
import type { MarketplaceSourceFormat } from '../../agents/agent-presets/agent-preset.config.js';
import { syncManifest } from '../../run/sync-manifest.js';
import { SyncBehaviorBase, type SyncBehaviorRunContext } from '../sync-behavior-base.js';

interface MarketplacePluginEntry {
  description?: string;
  name: string;
  source: string;
  version?: string;
}

interface MarketplaceJson {
  name: string;
  owner: { name: string };
  plugins: MarketplacePluginEntry[];
}

/** `prefixed` → `./<repo-relative>`; `relative` → `<repo-relative>`. */
function formatMarketplacePluginSource(
  pluginRelativePath: string,
  sourceFormat: MarketplaceSourceFormat
): string {
  return sourceFormat === 'relative' ? pluginRelativePath : `./${pluginRelativePath}`;
}

/**
 * Writes a local marketplace json file and records plugin metadata in the unified manifest.
 * Marketplace `name` comes from `resolvedConfig.sourceDefaults.localMarketplaceName` (see `clankgstersConfigSchema.sourceDefaults`).
 */
export class MarketplaceJsonSyncPreset extends SyncBehaviorBase {
  override syncRun(context: SyncBehaviorRunContext): Result<void, Error> {
    const presetConfig = agentPresetConfigs.resolve(context.agentName);
    const localMarketplaceName = context.resolvedConfig.sourceDefaults.localMarketplaceName;
    const mergedOptions = {
      manifestKey: presetConfig.CONSTANTS.SETTINGS_MANIFEST_KEY,
      marketplaceFile: presetConfig.CONSTANTS.MARKETPLACE_FILE,
      marketplaceName: localMarketplaceName,
      sourceFormat: presetConfig.CONSTANTS.MARKETPLACE_SOURCE_FORMAT,
      ...(context.behaviorConfig.options as Record<string, unknown>),
    };
    const sourceFormat: MarketplaceSourceFormat =
      mergedOptions.sourceFormat === 'relative' ? 'relative' : 'prefixed';
    const options = { ...mergedOptions, sourceFormat };
    const marketplaceFile = presetConfig.CONSTANTS.MARKETPLACE_FILE;
    const targetPath = path.join(context.outputRoot, marketplaceFile);

    if (context.mode === 'clear' || context.behaviorConfig.enabled === false) {
      syncManifest.teardownEntry(context.outputRoot, {
        fsAutoRemoval: [marketplaceFile],
      });
      return ok(undefined);
    }

    const plugins: MarketplacePluginEntry[] = [];
    for (const marketplace of context.discoveredMarketplaces) {
      for (const plugin of marketplace.plugins) {
        if (plugin.manifests[context.agentName] !== true) continue;
        plugins.push({
          name: plugin.manifestName ?? plugin.name,
          source: formatMarketplacePluginSource(plugin.relativePath, sourceFormat),
          description: plugin.description,
          version: plugin.version,
        });
      }
    }
    plugins.sort((left, right) => left.name.localeCompare(right.name));

    const payload: MarketplaceJson = {
      name: localMarketplaceName,
      owner: { name: 'clankgsters' },
      plugins,
    };
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.writeFileSync(targetPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

    context.registerManifestEntry(context.agentName, context.behaviorConfig.behaviorName, {
      options,
      customData: { plugins },
    });
    return ok(undefined);
  }
}
