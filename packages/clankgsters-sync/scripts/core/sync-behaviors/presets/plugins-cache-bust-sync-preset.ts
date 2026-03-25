import { ok, type Result } from 'neverthrow';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { z } from 'zod';
import { SyncBehaviorBase, type SyncBehaviorRunContext } from '../sync-behavior-base.js';

interface MarketplaceJson {
  plugins?: Array<{ name: string; version?: string }>;
}

const pluginsCacheBustSyncPresetOptionsSchema = z.looseObject({
  marketplaceFile: z.string().min(1).nullable().optional(),
  pluginsCacheSegments: z.array(z.string().min(1)).nullable().optional(),
});

/** Typed options for `PluginsCacheBustSyncPreset`. */
export interface PluginsCacheBustSyncPresetOptions {
  /** Repo-relative marketplace file to read plugin names/versions from before cache cleanup. */
  marketplaceFile?: string | null;
  /** Home-directory path segments pointing to the agent cache root; null disables cache cleanup. */
  pluginsCacheSegments?: readonly string[] | null;
}

/**
 * Clears agent home-directory plugin cache directories after marketplace changes.
 * This does not mutate repo-local source directories such as `.clank/plugins.local`.
 */
export class PluginsCacheBustSyncPreset extends SyncBehaviorBase {
  override syncRun(context: SyncBehaviorRunContext): Result<void, Error> {
    const optionsParse = pluginsCacheBustSyncPresetOptionsSchema.safeParse(
      context.behaviorConfig.options
    );
    const optionsFallbacks = {
      marketplaceFile: `.${context.agentName}/marketplace.json`,
      pluginsCacheSegments: null,
      ...(optionsParse.success ? optionsParse.data : {}),
    };
    const marketplaceFile = optionsFallbacks.marketplaceFile;
    if (marketplaceFile == null) return ok(undefined);
    const marketplacePath = path.join(context.outputRoot, marketplaceFile);
    if (!fs.existsSync(marketplacePath)) return ok(undefined);
    let marketplaceJson: MarketplaceJson;
    try {
      marketplaceJson = JSON.parse(fs.readFileSync(marketplacePath, 'utf8')) as MarketplaceJson;
    } catch {
      return ok(undefined);
    }
    if ((optionsFallbacks.pluginsCacheSegments?.length ?? 0) === 0) {
      return ok(undefined);
    }
    const cacheBase = path.join(os.homedir(), ...(optionsFallbacks.pluginsCacheSegments ?? []));
    for (const plugin of marketplaceJson.plugins ?? []) {
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
