import { clankgstersConfigDefaults } from '../../../clankgsters-sync/config/index.js';
import { DirectoryPrefab } from './directory-prefab.js';

export interface PluginsLocalDirPrefabOptions {
  /** Optional plugins dir override; `.local` suffix is always applied by this prefab. */
  pluginsDirName?: string;
  /** Optional source directory override; defaults to `sourceDefaults.sourceDir`. */
  sourceDirName?: string;
}

/** Creates the nested `.local` plugins directory under source root (e.g. `.clank/plugins.local`). */
export class PluginsLocalDirPrefab extends DirectoryPrefab {
  constructor(sandboxDirectoryName: string, options: PluginsLocalDirPrefabOptions = {}) {
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
