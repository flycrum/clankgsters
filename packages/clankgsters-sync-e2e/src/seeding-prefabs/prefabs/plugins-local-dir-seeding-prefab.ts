import { clankgstersConfigDefaults } from '../../../../clankgsters-sync/src/index.js';
import { DirectorySeedingPrefab } from './directory-seeding-prefab.js';

export interface PluginsLocalDirSeedingPrefabOptions {
  /** Base plugins dir name; actual dir is `<name>.local` under `sourceDir`. */
  pluginsDirName?: string;
  /** Parent source directory (defaults to `sourceDefaults.sourceDir`). */
  sourceDirName?: string;
}

/**
 * When to use: Your test covers the nested `.local` plugins directory layout (e.g. `.clank/plugins.local`).
 * Strategic: creates `<sourceDir>/<pluginsDir>.local` for layout-variant tests that need local plugin roots.
 */
export class PluginsLocalDirSeedingPrefab extends DirectorySeedingPrefab {
  /**
   * Tactical: appends `.local` to the resolved plugins dir name under `sourceDir`.
   * Desired outcome: a layout path like `.clank/plugins.local/` exists for local-variant discovery scenarios.
   */
  constructor(sandboxDirectoryName: string, options: PluginsLocalDirSeedingPrefabOptions = {}) {
    const sourceDirName =
      options.sourceDirName ?? clankgstersConfigDefaults.CONSTANTS.sourceDefaults.sourceDir;
    const pluginsDirName =
      options.pluginsDirName ?? clankgstersConfigDefaults.CONSTANTS.sourceDefaults.pluginsDir;
    super(sandboxDirectoryName, {
      dirName: `${pluginsDirName}.local`,
      parentPaths: [sourceDirName],
    });
  }
}
