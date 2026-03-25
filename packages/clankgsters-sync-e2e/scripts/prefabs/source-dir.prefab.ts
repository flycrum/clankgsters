import { clankgstersConfigDefaults } from '../../../clankgsters-sync/config/index.js';
import { DirectoryPrefab } from './directory-prefab.js';

export interface SourceDirPrefabOptions {
  /** Optional source dir override; defaults to config constant (e.g. `.clank`). */
  sourceDirName?: string;
}

/** Creates the source defaults root directory used by discovery (e.g. `.clank`). */
export class SourceDirPrefab extends DirectoryPrefab {
  constructor(sandboxDirectoryName: string, options: SourceDirPrefabOptions = {}) {
    super(sandboxDirectoryName, {
      dirName:
        options.sourceDirName ?? clankgstersConfigDefaults.CONSTANTS.sourceDefaults.sourceDir,
      parentPaths: [],
    });
  }
}
