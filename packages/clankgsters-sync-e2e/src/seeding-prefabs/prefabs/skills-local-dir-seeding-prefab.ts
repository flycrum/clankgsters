import { clankgstersConfigDefaults } from '../../../../clankgsters-sync/src/index.js';
import { DirectorySeedingPrefab } from './directory-seeding-prefab.js';

export interface SkillsLocalDirSeedingPrefabOptions {
  /** Base skills dir name; actual dir is `<name>.local` under `sourceDir`. */
  skillsDirName?: string;
  /** Parent source directory (defaults to `sourceDefaults.sourceDir`). */
  sourceDirName?: string;
}

/**
 * When to use: Your test covers the nested `.local` skills directory layout (e.g. `.clank/skills.local`).
 * Strategic: creates `<sourceDir>/<skillsDir>.local` for layout-variant tests that need local skill roots.
 */
export class SkillsLocalDirSeedingPrefab extends DirectorySeedingPrefab {
  /**
   * Tactical: appends `.local` to the resolved skills dir name under `sourceDir`.
   * Desired outcome: a layout path like `.clank/skills.local/` exists for local-variant skill discovery scenarios.
   */
  constructor(sandboxDirectoryName: string, options: SkillsLocalDirSeedingPrefabOptions = {}) {
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
