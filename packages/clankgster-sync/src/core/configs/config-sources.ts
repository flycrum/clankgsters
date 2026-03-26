import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseUtils } from '../../common/parse-utils.js';
import type { ClankgsterConfigResolutionContext, ClankgsterConfigSource } from './config-source.js';
import type {
  ClankgsterConfig,
  ClankgsterSourceDefaultsConfig,
} from './clankgster-config.schema.js';

/** Loads `filePath` as an ES module and returns its default export as partial config, or `null` if the file is missing or the default is not a non-null object. */
async function loadTypeScriptConfig(filePath: string): Promise<Partial<ClankgsterConfig> | null> {
  if (!fs.existsSync(filePath)) return null;
  const mod = await import(pathToFileURL(filePath).href);
  if (typeof mod.default !== 'object' || mod.default == null) return null;
  return mod.default as Partial<ClankgsterConfig>;
}

/** Builds a {@link ClankgsterConfigSource} that loads `fileName` relative to `context.repoRoot` via {@link loadTypeScriptConfig}. */
function buildTypeScriptSource(
  id: string,
  priority: number,
  fileName: string
): ClankgsterConfigSource {
  return {
    id,
    priority,
    async load(
      context: ClankgsterConfigResolutionContext
    ): Promise<Partial<ClankgsterConfig> | null> {
      return loadTypeScriptConfig(path.join(context.repoRoot, fileName));
    },
  };
}

const envSource: ClankgsterConfigSource = {
  /** Source id used when merging and logging. */
  id: 'env',
  /** Runs after file-based sources (10, 20); lower `priority` sorts earlier. */
  priority: 30,
  /** Partial config from `CLANKGSTER_*` env vars (e.g. `CLANKGSTER_SYNC_CACHE_DIR`, `CLANKGSTER_MARKDOWN_CONTEXT_FILE_NAME`; `CLANKGSTER_ROOT_CONTEXT_FILE` still accepted). */
  load(): Partial<ClankgsterConfig> {
    const loggingEnabled = parseUtils.parseBool(process.env.CLANKGSTER_LOGGING_ENABLED);
    const syncOutputRoot = process.env.CLANKGSTER_SYNC_OUTPUT_ROOT;
    const syncCacheDir = process.env.CLANKGSTER_SYNC_CACHE_DIR;
    const syncManifestPath = process.env.CLANKGSTER_SYNC_MANIFEST_PATH;
    const sourceDir = process.env.CLANKGSTER_SOURCE_DIR;
    const markdownContextFileName =
      process.env.CLANKGSTER_MARKDOWN_CONTEXT_FILE_NAME ?? process.env.CLANKGSTER_ROOT_CONTEXT_FILE;
    const source: Partial<ClankgsterConfig> = { agents: {} };
    if (loggingEnabled != null) source.loggingEnabled = loggingEnabled;
    if (typeof syncOutputRoot === 'string' && syncOutputRoot.length > 0) {
      source.syncOutputRoot = syncOutputRoot;
    }
    if (typeof syncCacheDir === 'string' && syncCacheDir.length > 0) {
      source.syncCacheDir = syncCacheDir;
    }
    if (typeof syncManifestPath === 'string' && syncManifestPath.length > 0) {
      source.syncManifestPath = syncManifestPath;
    }
    if (
      (typeof sourceDir === 'string' && sourceDir.length > 0) ||
      (typeof markdownContextFileName === 'string' && markdownContextFileName.length > 0)
    ) {
      const sourceDefaults: Partial<ClankgsterSourceDefaultsConfig> = {};
      if (typeof sourceDir === 'string' && sourceDir.length > 0) {
        sourceDefaults.sourceDir = sourceDir;
      }
      if (typeof markdownContextFileName === 'string' && markdownContextFileName.length > 0) {
        sourceDefaults.markdownContextFileName = markdownContextFileName;
      }
      source.sourceDefaults = sourceDefaults as ClankgsterConfig['sourceDefaults'];
    }
    return source;
  },
};

export const clankgsterConfigSources = {
  /** Default resolution order: team `clankgster.config.ts`, then `clankgster.local.config.ts`, then environment overrides. */
  defaults(): ClankgsterConfigSource[] {
    return [
      buildTypeScriptSource('team-ts-config', 10, 'clankgster.config.ts'),
      buildTypeScriptSource('local-ts-config', 20, 'clankgster.local.config.ts'),
      envSource,
    ];
  },
};
