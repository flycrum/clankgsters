import { clankgstersConfigDefaults } from '../../../../clankgsters-sync/src/index.js';
import { DirectorySeedingPrefab } from './directory-seeding-prefab.js';

export interface PluginsDirSeedingPrefabOptions {
  /** Overrides `sourceDefaults.pluginsDir` segment name. */
  pluginsDirName?: string;
  /** Overrides `sourceDefaults.sourceDir` as parent of the plugins directory. */
  sourceDirName?: string;
}

/**
 * When to use: You need the plugins directory segment under the source dir (defaults from config) before writing plugin files.
 * Strategic: ensures `<sourceDir>/<pluginsDir>` exists so plugin discovery has a plugins root.
 */
export class PluginsDirSeedingPrefab extends DirectorySeedingPrefab {
  /**
   * Tactical: nests `pluginsDir` under `sourceDir` per config defaults or overrides.
   * Desired outcome: a concrete directory path like `.clank/plugins/` exists before plugin files are seeded.
   */
  constructor(sandboxDirectoryName: string, options: PluginsDirSeedingPrefabOptions = {}) {
    super(sandboxDirectoryName, {
      dirName:
        options.pluginsDirName ?? clankgstersConfigDefaults.CONSTANTS.sourceDefaults.pluginsDir,
      parentPaths: [
        options.sourceDirName ?? clankgstersConfigDefaults.CONSTANTS.sourceDefaults.sourceDir,
      ],
    });
  }
}
