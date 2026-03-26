import { isPlainObject } from 'lodash-es';
import { err, ok, type Result } from 'neverthrow';
import fs from 'node:fs';
import path from 'node:path';
import { agentPluginManifestDir } from '../agents/agent-presets/agent-plugin-manifest-dir.js';
import { agentCommonValues } from '../agents/agent-presets/agent-common-values.js';
import type { ClankgsterSourceDefaultsConfig } from '../configs/clankgster-config.schema.js';
import { syncSourceLayouts, type SyncSourceLayoutKey } from './sync-source-layouts.js';

/** Per-plugin manifest presence map keyed by agent name. */
export type PluginManifestMap = Record<string, boolean>;

/** One plugin discovered under a source marketplace plugins directory. */
export interface DiscoveredPlugin {
  /** Plugin description read from first discovered agent manifest, when present. */
  description?: string;
  /** Presence map of agent plugin manifests for this plugin directory. */
  manifests: PluginManifestMap;
  /** Display name from manifest `name`, falling back to directory name. */
  manifestName?: string;
  /** Directory basename for this plugin under its marketplace. */
  name: string;
  /** Absolute filesystem path to this plugin directory. */
  path: string;
  /** Repo-relative plugin path used for marketplace `source` links and docs. */
  relativePath: string;
  /** Version from first discovered agent manifest, when present. */
  version?: string;
}

/** Marketplace node discovered at root or in nested packages. */
export interface DiscoveredMarketplace {
  /** Human-friendly label shown in markdown/package sections and diagnostics. */
  label: string;
  /** Source layout classification for this marketplace directory. */
  layout: SyncSourceLayoutKey;
  /** Plugin entries discovered under `pluginsDir` for this marketplace. */
  plugins: DiscoveredPlugin[];
  /** Absolute filesystem path to the marketplace plugins directory. */
  pluginsDir: string;
  /** Repo-relative path to `pluginsDir`. */
  relativePath: string;
}

/** Reads plugin metadata (`name`, `description`, `version`) from one manifest file. */
function readManifestInfo(manifestPath: string): {
  description?: string;
  manifestName?: string;
  version?: string;
} | null {
  try {
    const raw = fs.readFileSync(manifestPath, 'utf8');
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    if (!isPlainObject(parsed)) return null;
    return {
      description: typeof parsed.description === 'string' ? parsed.description : undefined,
      manifestName: typeof parsed.name === 'string' ? parsed.name : undefined,
      version: typeof parsed.version === 'string' ? parsed.version : undefined,
    };
  } catch {
    return null;
  }
}

/**
 * Discovers plugins under one marketplace directory and filters them by manifest presence for known agents.
 * Returned plugin entries include resolved metadata and repo-relative source paths.
 */
interface DiscoverPluginsInDirInput {
  agentNames: string[];
  excluded: string[];
  pluginsDir: string;
  relativePluginsPath: string;
}

function discoverPluginsInDir(input: DiscoverPluginsInDirInput): DiscoveredPlugin[] {
  const excludedSet = new Set(input.excluded);
  const { agentNames, pluginsDir, relativePluginsPath } = input;
  const entries = fs.readdirSync(pluginsDir, { withFileTypes: true });
  const plugins: DiscoveredPlugin[] = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const pluginPath = path.join(pluginsDir, entry.name);
    const pluginRelativePath = syncSourceLayouts.normalizeRel(
      path.join(relativePluginsPath, entry.name)
    );
    if (excludedSet.has(entry.name) || excludedSet.has(pluginRelativePath)) continue;
    const manifests: PluginManifestMap = {};
    let firstManifestPath: string | null = null;
    for (const agentName of agentNames) {
      const manifestDir = agentPluginManifestDir.resolve(
        agentName,
        agentCommonValues.resolve(agentName).agentPluginManifestDir
      );
      if (manifestDir == null) {
        manifests[agentName] = false;
        continue;
      }
      const manifestPath = path.join(pluginPath, manifestDir, 'plugin.json');
      const present = fs.existsSync(manifestPath);
      manifests[agentName] = present;
      if (present && firstManifestPath == null) firstManifestPath = manifestPath;
    }
    if (!Object.values(manifests).some(Boolean)) continue;

    const metadata = firstManifestPath != null ? readManifestInfo(firstManifestPath) : null;
    plugins.push({
      description: metadata?.description,
      manifests,
      manifestName: metadata?.manifestName ?? entry.name,
      name: entry.name,
      path: pluginPath,
      relativePath: pluginRelativePath,
      version: metadata?.version,
    });
  }
  return plugins.sort((left, right) => left.name.localeCompare(right.name));
}

/** Discovery helpers for marketplace lookup used by sync run machines and behavior presets. */
export const syncDiscover = {
  /**
   * Discovers plugin marketplaces from source defaults and filters plugins by manifest presence for known agent names.
   * Marketplaces are tagged with a sync source layout key for downstream per-layout behavior handling.
   */
  discoverMarketplaces(input: {
    agentNames: string[];
    excluded: string[];
    repoRoot: string;
    sourceDefaults: ClankgsterSourceDefaultsConfig;
  }): Result<DiscoveredMarketplace[], Error> {
    try {
      const paths = syncSourceLayouts.getResolvedSourcePath(input.sourceDefaults);
      const sourceLayoutPaths = syncSourceLayouts.discoverSourceLayoutPaths(input);
      const marketplaces = syncSourceLayouts.SYNC_SOURCE_LAYOUT_KEYS.flatMap((layout) =>
        sourceLayoutPaths.pluginsByLayout[layout].map((pluginsDir) => {
          const relativePath = syncSourceLayouts.normalizeRel(
            path.relative(input.repoRoot, pluginsDir)
          );
          const isRootNestedRegular = relativePath === paths.nestedPluginsPath;
          const label = isRootNestedRegular
            ? 'Root marketplace'
            : `${relativePath} marketplace (${layout})`;
          return {
            label,
            layout,
            plugins: discoverPluginsInDir({
              agentNames: input.agentNames,
              excluded: input.excluded,
              pluginsDir,
              relativePluginsPath: relativePath,
            }),
            pluginsDir,
            relativePath,
          };
        })
      );
      return ok(marketplaces);
    } catch (error) {
      return err(error instanceof Error ? error : new Error(String(error)));
    }
  },
};
