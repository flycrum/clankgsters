import { ok, type Result } from 'neverthrow';
import fs from 'node:fs';
import path from 'node:path';
import { agentPresetConfigs } from '../../agents/agent-presets/agent-preset-configs.js';
import type { AgentMarketplaceSourceFormat } from '../../agents/agent-presets/agent-preset.config.js';
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
    const presetConfig = agentPresetConfigs.resolve(context.agentName);
    const localMarketplaceName = context.resolvedConfig.sourceDefaults.localMarketplaceName;
    const mergedOptions = {
      manifestKey: presetConfig.CONSTANTS.AGENT_SETTINGS_MANIFEST_KEY,
      marketplaceFile: presetConfig.CONSTANTS.AGENT_MARKETPLACE_FILE,
      marketplaceName: localMarketplaceName,
      sourceFormat: presetConfig.CONSTANTS.AGENT_MARKETPLACE_SOURCE_FORMAT,
      ...(context.behaviorConfig.options as Record<string, unknown>),
    };
    const sourceFormat: AgentMarketplaceSourceFormat =
      mergedOptions.sourceFormat === 'relative' ? 'relative' : 'prefixed';
    const options = { ...mergedOptions, sourceFormat };
    const marketplaceFile = presetConfig.CONSTANTS.AGENT_MARKETPLACE_FILE;
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
      name: localMarketplaceName,
      owner: { name: 'clankgsters' },
      plugins,
    };
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.writeFileSync(targetPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

    context.registerManifestEntry(context.agentName, context.behaviorConfig.behaviorName, {
      options,
      customData,
    });
    return ok(undefined);
  }
}
