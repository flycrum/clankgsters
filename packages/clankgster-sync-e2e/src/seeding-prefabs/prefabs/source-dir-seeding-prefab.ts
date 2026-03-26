import { clankgsterConfigDefaults } from '../../../../clankgster-sync/src/index.js';
import { DirectorySeedingPrefab } from './directory-seeding-prefab.js';

export interface SourceDirSeedingPrefabOptions {
  /** Overrides `sourceDefaults.sourceDir` (e.g. `.clank`, `.yoyo`). */
  sourceDirName?: string;
}

/**
 * When to use: The case depends on `sourceDefaults.sourceDir` (or an override like `.yoyo`) existing before plugins/skills or markdown are seeded.
 * Strategic: creates the configured source root directory at sandbox top level for discovery tests.
 */
export class SourceDirSeedingPrefab extends DirectorySeedingPrefab {
  /**
   * Tactical: maps optional `sourceDirName` to a `DirectorySeedingPrefab` with no parent path segments.
   * Desired outcome: the sandbox has a source anchor directory like `.clank/` (or `.yoyo/`) ready for downstream prefab paths.
   */
  constructor(sandboxDirectoryName: string, options: SourceDirSeedingPrefabOptions = {}) {
    super(sandboxDirectoryName, {
      dirName: options.sourceDirName ?? clankgsterConfigDefaults.CONSTANTS.sourceDefaults.sourceDir,
      parentPaths: [],
    });
  }
}
