import { PrefabBase } from './common/prefab-base.js';
import type { PrefabApplyContext } from './common/prefab-types.js';

export interface DirectoryPrefabOptions {
  /** Directory name to create under `parentPaths` in the current sandbox. */
  dirName: string;
  /** Optional parent path segments under sandbox root. */
  parentPaths?: string[];
}

/** General-purpose directory creator prefab used by specialized directory prefabs. */
export class DirectoryPrefab extends PrefabBase<DirectoryPrefabOptions> {
  override apply(context: PrefabApplyContext): void {
    const dirPath = this.joinSandboxPath(
      context,
      ...(this.options.parentPaths ?? []),
      this.options.dirName
    );
    this.ensureDirectory(dirPath);
  }
}
