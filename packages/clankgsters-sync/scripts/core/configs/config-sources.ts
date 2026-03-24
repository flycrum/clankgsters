import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseUtils } from '../../common/parse-utils.js';
import type {
  ClankgstersConfigResolutionContext,
  ClankgstersConfigSource,
} from './config-source.js';
import type {
  ClankgstersConfig,
  ClankgstersSourceDefaultsConfig,
} from './clankgsters-config.schema.js';

/** Loads `filePath` as an ES module and returns its default export as partial config, or `null` if the file is missing or the default is not a non-null object. */
async function loadTypeScriptConfig(filePath: string): Promise<Partial<ClankgstersConfig> | null> {
  if (!fs.existsSync(filePath)) return null;
  const mod = await import(pathToFileURL(filePath).href);
  if (typeof mod.default !== 'object' || mod.default == null) return null;
  return mod.default as Partial<ClankgstersConfig>;
}

/** Builds a {@link ClankgstersConfigSource} that loads `fileName` relative to `context.repoRoot` via {@link loadTypeScriptConfig}. */
function buildTypeScriptSource(
  id: string,
  priority: number,
  fileName: string
): ClankgstersConfigSource {
  return {
    id,
    priority,
    async load(
      context: ClankgstersConfigResolutionContext
    ): Promise<Partial<ClankgstersConfig> | null> {
      return loadTypeScriptConfig(path.join(context.repoRoot, fileName));
    },
  };
}

const envSource: ClankgstersConfigSource = {
  /** Source id used when merging and logging. */
  id: 'env',
  /** Runs after file-based sources (10, 20); lower `priority` sorts earlier. */
  priority: 30,
  /** Partial config from `CLANKGSTERS_*` env vars (e.g. `CLANKGSTERS_SYNC_CACHE_DIR`, `CLANKGSTERS_MARKDOWN_CONTEXT_FILE_NAME`; `CLANKGSTERS_ROOT_CONTEXT_FILE` still accepted). */
  load(): Partial<ClankgstersConfig> {
    const loggingEnabled = parseUtils.parseBool(process.env.CLANKGSTERS_LOGGING_ENABLED);
    const syncOutputRoot = process.env.CLANKGSTERS_SYNC_OUTPUT_ROOT;
    const syncCacheDir = process.env.CLANKGSTERS_SYNC_CACHE_DIR;
    const syncManifestPath = process.env.CLANKGSTERS_SYNC_MANIFEST_PATH;
    const sourceDir = process.env.CLANKGSTERS_SOURCE_DIR;
    const markdownContextFileName =
      process.env.CLANKGSTERS_MARKDOWN_CONTEXT_FILE_NAME ??
      process.env.CLANKGSTERS_ROOT_CONTEXT_FILE;
    const source: Partial<ClankgstersConfig> = { agents: {} };
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
      const sourceDefaults: Partial<ClankgstersSourceDefaultsConfig> = {};
      if (typeof sourceDir === 'string' && sourceDir.length > 0) {
        sourceDefaults.sourceDir = sourceDir;
      }
      if (typeof markdownContextFileName === 'string' && markdownContextFileName.length > 0) {
        sourceDefaults.markdownContextFileName = markdownContextFileName;
      }
      source.sourceDefaults = sourceDefaults as ClankgstersConfig['sourceDefaults'];
    }
    return source;
  },
};

export const clankgstersConfigSources = {
  /** Default resolution order: team `clankgsters.config.ts`, then `clankgsters.local.config.ts`, then environment overrides. */
  defaults(): ClankgstersConfigSource[] {
    return [
      buildTypeScriptSource('team-ts-config', 10, 'clankgsters.config.ts'),
      buildTypeScriptSource('local-ts-config', 20, 'clankgsters.local.config.ts'),
      envSource,
    ];
  },
};
