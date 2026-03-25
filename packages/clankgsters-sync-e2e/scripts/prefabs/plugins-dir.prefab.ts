import { clankgstersConfigDefaults } from '../../../clankgsters-sync/config/index.js';
import { DirectoryPrefab } from './directory-prefab.js';

export interface PluginsDirPrefabOptions {
  /** Optional plugins directory name override; defaults to `sourceDefaults.pluginsDir`. */
  pluginsDirName?: string;
  /** Optional source directory override; defaults to `sourceDefaults.sourceDir`. */
  sourceDirName?: string;
}

/** Creates the plugins directory under the configured source root. */
export class PluginsDirPrefab extends DirectoryPrefab {
  constructor(sandboxDirectoryName: string, options: PluginsDirPrefabOptions = {}) {
    super(sandboxDirectoryName, {
      dirName:
        options.pluginsDirName ?? clankgstersConfigDefaults.CONSTANTS.sourceDefaults.pluginsDir,
      parentPaths: [
        options.sourceDirName ?? clankgstersConfigDefaults.CONSTANTS.sourceDefaults.sourceDir,
      ],
    });
  }
}
