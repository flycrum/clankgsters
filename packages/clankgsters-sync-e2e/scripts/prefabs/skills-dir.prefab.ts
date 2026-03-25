import { clankgstersConfigDefaults } from '../../../clankgsters-sync/config/index.js';
import { DirectoryPrefab } from './directory-prefab.js';

export interface SkillsDirPrefabOptions {
  /** Optional skills directory name override; defaults to `sourceDefaults.skillsDir`. */
  skillsDirName?: string;
  /** Optional source directory override; defaults to `sourceDefaults.sourceDir`. */
  sourceDirName?: string;
}

/** Creates the skills directory under the configured source root. */
export class SkillsDirPrefab extends DirectoryPrefab {
  constructor(sandboxDirectoryName: string, options: SkillsDirPrefabOptions = {}) {
    super(sandboxDirectoryName, {
      dirName:
        options.skillsDirName ?? clankgstersConfigDefaults.CONSTANTS.sourceDefaults.skillsDir,
      parentPaths: [
        options.sourceDirName ?? clankgstersConfigDefaults.CONSTANTS.sourceDefaults.sourceDir,
      ],
    });
  }
}
