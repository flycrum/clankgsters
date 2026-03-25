import { clankgstersConfigDefaults } from '../../../../clankgsters-sync/src/index.js';
import { JsonFileSeedingPrefab } from './json-file-seeding-prefab.js';

/** Options for one agent-specific `plugin.json` under `<source>/<plugins>/<pluginDir>/<manifestDir>/`. */
export interface AgentPluginJsonSeedingPrefabOptions {
  /** Directory name for this plugin under the plugins root (e.g. `root`, `nested`). */
  pluginDirName: string;
  /** Agent manifest folder (e.g. `.claude-plugin`, `.cursor-plugin`). */
  pluginManifestDirName: string;
  /** Optional `name` field in `plugin.json` (defaults to `pluginDirName`). */
  pluginName?: string;
  /** Optional semver string for the manifest. */
  version?: string;
  /** Optional description string for the manifest. */
  description?: string;
  /** Overrides `sourceDefaults.sourceDir` for the path prefix. */
  sourceDirName?: string;
  /** Overrides `sourceDefaults.pluginsDir` for the segment between source and plugin dir. */
  pluginsDirName?: string;
  /** Extra path segments before `sourceDir` (e.g. `packages/app` for nested package roots). */
  parentPaths?: string[];
}

/**
 * When to use: You need a valid agent-specific `plugin.json` under an agent-specific manifest folder (e.g. `.claude-plugin`) for a given plugin directory, optionally under nested `parentPaths`.
 * Strategic: writes a minimal agent plugin manifest JSON so marketplace/discovery tests have a stable `plugin.json` in the expected layout.
 * Subclasses or cases vary `pluginManifestDirName` and paths to cover Claude vs Cursor and root vs nested trees.
 */
export class AgentPluginJsonSeedingPrefab extends JsonFileSeedingPrefab {
  /**
   * Tactical: resolves defaults from config, then passes a fixed `plugin.json` payload and parent path chain into `JsonFileSeedingPrefab`.
   * Desired outcome: a file like `.clank/plugins/root/.claude-plugin/plugin.json` containing minimal `{ name, version, description }` metadata.
   */
  constructor(sandboxDirectoryName: string, options: AgentPluginJsonSeedingPrefabOptions) {
    const sourceDirName =
      options.sourceDirName ?? clankgstersConfigDefaults.CONSTANTS.sourceDefaults.sourceDir;
    const pluginsDirName =
      options.pluginsDirName ?? clankgstersConfigDefaults.CONSTANTS.sourceDefaults.pluginsDir;
    super(sandboxDirectoryName, {
      fileName: 'plugin.json',
      jsonValue: {
        description: options.description ?? `${options.pluginDirName} plugin`,
        name: options.pluginName ?? options.pluginDirName,
        version: options.version ?? '0.0.1',
      },
      parentPaths: [
        ...(options.parentPaths ?? []),
        sourceDirName,
        pluginsDirName,
        options.pluginDirName,
        options.pluginManifestDirName,
      ],
    });
  }
}
