import { clankgsterConfigDefaults } from '../../../../clankgster-sync/src/index.js';
import { DirectorySeedingPrefab } from './directory-seeding-prefab.js';

export interface SkillsDirSeedingPrefabOptions {
  /** Overrides `sourceDefaults.skillsDir` segment name. */
  skillsDirName?: string;
  /** Overrides `sourceDefaults.sourceDir` as parent of the skills directory. */
  sourceDirName?: string;
}

/**
 * When to use: You need the skills directory under the source dir before standalone skill marker files.
 * Strategic: ensures `<sourceDir>/<skillsDir>` exists so standalone skill discovery has a skills root.
 */
export class SkillsDirSeedingPrefab extends DirectorySeedingPrefab {
  /**
   * Tactical: nests `skillsDir` under `sourceDir` per config defaults or overrides.
   * Desired outcome: a concrete directory path like `.clank/skills/` exists before standalone skill files are seeded.
   */
  constructor(sandboxDirectoryName: string, options: SkillsDirSeedingPrefabOptions = {}) {
    super(sandboxDirectoryName, {
      dirName: options.skillsDirName ?? clankgsterConfigDefaults.CONSTANTS.sourceDefaults.skillsDir,
      parentPaths: [
        options.sourceDirName ?? clankgsterConfigDefaults.CONSTANTS.sourceDefaults.sourceDir,
      ],
    });
  }
}
