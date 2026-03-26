import { ok, type Result } from 'neverthrow';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { z } from 'zod';
import { clankLogger } from '../../../common/logger.js';
import { pathHelpers } from '../../../common/path-helpers.js';
import { SyncBehaviorBase, type SyncBehaviorRunContext } from '../sync-behavior-base.js';

const marketplaceJsonSchema = z
  .object({
    plugins: z.array(
      z.object({
        name: z.string(),
        version: z.string().optional(),
      })
    ),
  })
  .passthrough();

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

/** Rejects empty, `.`, `..`, and embedded separators so `path.join(homedir(), ...)` cannot jump out of a single home subtree. */
function isSafePathSegment(segment: string): boolean {
  if (segment.length === 0) return false;
  if (segment === '.' || segment === '..') return false;
  return !segment.includes('/') && !segment.includes('\\');
}

/** Returns normalized segment list or `null` when the value is missing or not an array of safe non-empty strings. */
function normalizePluginsCacheSegments(value: unknown): string[] | null {
  if (value == null) return null;
  if (!Array.isArray(value)) return null;
  const out: string[] = [];
  for (const item of value) {
    if (typeof item !== 'string' || !isSafePathSegment(item)) return null;
    out.push(item);
  }
  return out.length > 0 ? out : null;
}

/** True when `candidateResolved` is strictly under `cacheBaseResolved` (not equal); both must already be `path.resolve`d. */
function isStrictPathUnderCacheBase(cacheBaseResolved: string, candidateResolved: string): boolean {
  const base = path.resolve(cacheBaseResolved);
  const candidate = path.resolve(candidateResolved);
  if (candidate === base) return false;
  return pathHelpers.isResolvedPathUnderRoot(base, candidate);
}

/**
 * Clears agent home-directory plugin cache directories after marketplace changes.
 * This does not mutate repo-local source directories such as `.clank/plugins.local`.
 */
export class PluginsCacheBustSyncPreset extends SyncBehaviorBase {
  override syncRun(context: SyncBehaviorRunContext): Result<void, Error> {
    const log = clankLogger.getLogger();
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

    let rawMarketplace: unknown;
    try {
      rawMarketplace = JSON.parse(fs.readFileSync(marketplacePath, 'utf8')) as unknown;
    } catch (e) {
      log.warn({ err: e, marketplacePath }, 'plugins cache bust: marketplace JSON unreadable');
      return ok(undefined);
    }

    const marketplaceParsed = marketplaceJsonSchema.safeParse(rawMarketplace);
    if (!marketplaceParsed.success) {
      log.warn(
        { marketplacePath, zodMessage: marketplaceParsed.error.message },
        'plugins cache bust: marketplace JSON shape invalid'
      );
      return ok(undefined);
    }

    const segments = normalizePluginsCacheSegments(optionsFallbacks.pluginsCacheSegments);
    if (segments == null) {
      log.warn(
        { pluginsCacheSegments: optionsFallbacks.pluginsCacheSegments },
        'plugins cache bust: pluginsCacheSegments missing or not an array of safe path segments'
      );
      return ok(undefined);
    }

    const cacheBaseResolved = path.resolve(path.join(os.homedir(), ...segments));

    for (const plugin of marketplaceParsed.data.plugins) {
      if (!isSafePathSegment(plugin.name)) {
        log.warn(
          { pluginName: plugin.name },
          'plugins cache bust: skip plugin with unsafe name segment'
        );
        continue;
      }
      if (plugin.version != null && !isSafePathSegment(plugin.version)) {
        log.warn(
          { pluginName: plugin.name, version: plugin.version },
          'plugins cache bust: skip plugin with unsafe version segment'
        );
        continue;
      }

      const pluginCacheResolved = path.resolve(
        cacheBaseResolved,
        plugin.name,
        ...(plugin.version != null ? [plugin.version] : [])
      );

      if (!isStrictPathUnderCacheBase(cacheBaseResolved, pluginCacheResolved)) {
        log.warn(
          { pluginName: plugin.name, pluginCacheResolved, cacheBaseResolved },
          'plugins cache bust: resolved plugin cache path escapes cache base; skip'
        );
        continue;
      }

      try {
        fs.rmSync(pluginCacheResolved, { force: true, recursive: true });
      } catch (e) {
        log.warn(
          { err: e, pluginCacheResolved },
          'plugins cache bust: rmSync failed (best-effort)'
        );
      }
    }

    return ok(undefined);
  }
}
