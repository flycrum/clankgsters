import type { SeedingPrefabApplyContext } from '../seeding-prefab-orchestration.types.js';
import { SeedingPrefabBase } from '../seeding-prefab-base.js';

export interface DirectorySeedingPrefabOptions {
  /** Single directory segment to create under `parentPaths`. */
  dirName: string;
  /** Path segments under the case sandbox root before `dirName`. */
  parentPaths?: string[];
}

/**
 * When to use: You need a single directory created at a known relative path and other seeding prefabs are not a fit.
 * Strategic: generic mkdir seeding step; specialized prefabs compose this with fixed `dirName`/`parentPaths`.
 */
export class DirectorySeedingPrefab extends SeedingPrefabBase<DirectorySeedingPrefabOptions> {
  override run(context: SeedingPrefabApplyContext): void {
    const dirPath = this.joinSandboxPath(
      context,
      ...(this.options.parentPaths ?? []),
      this.options.dirName
    );
    this.ensureDirectory(dirPath);
  }
}
