import { clankgstersConfigDefaults } from '../../../clankgsters-sync/config/index.js';
import { DirectoryPrefab } from './directory-prefab.js';

export interface SkillsLocalDirPrefabOptions {
  /** Optional skills dir override; `.local` suffix is always applied by this prefab. */
  skillsDirName?: string;
  /** Optional source directory override; defaults to `sourceDefaults.sourceDir`. */
  sourceDirName?: string;
}

/** Creates the nested `.local` skills directory under source root (e.g. `.clank/skills.local`). */
export class SkillsLocalDirPrefab extends DirectoryPrefab {
  constructor(sandboxDirectoryName: string, options: SkillsLocalDirPrefabOptions = {}) {
    const sourceDirName =
      options.sourceDirName ?? clankgstersConfigDefaults.CONSTANTS.sourceDefaults.sourceDir;
    const skillsDirName =
      options.skillsDirName ?? clankgstersConfigDefaults.CONSTANTS.sourceDefaults.skillsDir;
    super(sandboxDirectoryName, {
      dirName: `${skillsDirName}.local`,
      parentPaths: [sourceDirName],
    });
  }
}
