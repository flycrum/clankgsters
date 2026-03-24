import { ok, type Result } from 'neverthrow';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { agentPresetConfigs } from '../../agents/agent-presets/agent-preset-configs.js';
import { SyncBehaviorBase, type SyncBehaviorRunContext } from '../sync-behavior-base.js';

interface MarketplaceJson {
  plugins?: Array<{ name: string; version?: string }>;
}

/**
 * Clears agent home-directory plugin cache directories after marketplace changes.
 * This does not mutate repo-local source directories such as `.clank/plugins.local`.
 */
export class PluginsCacheBustSyncPreset extends SyncBehaviorBase {
  override syncRun(context: SyncBehaviorRunContext): Result<void, Error> {
    const presetConfig = agentPresetConfigs.resolve(context.agentName);
    const marketplacePath = path.join(
      context.outputRoot,
      presetConfig.CONSTANTS.AGENT_MARKETPLACE_FILE
    );
    if (!fs.existsSync(marketplacePath)) return ok(undefined);
    let parsed: MarketplaceJson;
    try {
      parsed = JSON.parse(fs.readFileSync(marketplacePath, 'utf8')) as MarketplaceJson;
    } catch {
      return ok(undefined);
    }
    if ((presetConfig.CONSTANTS.PLUGINS_CACHE_SEGMENTS?.length ?? 0) === 0) {
      return ok(undefined);
    }
    const cacheBase = path.join(
      os.homedir(),
      ...(presetConfig.CONSTANTS.PLUGINS_CACHE_SEGMENTS ?? [])
    );
    for (const plugin of parsed.plugins ?? []) {
      const pluginCache = plugin.version
        ? path.join(cacheBase, plugin.name, plugin.version)
        : path.join(cacheBase, plugin.name);
      try {
        fs.rmSync(pluginCache, { force: true, recursive: true });
      } catch {
        // best-effort cache invalidation
      }
    }
    return ok(undefined);
  }
}
