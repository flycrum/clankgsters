import type { SeedingPrefabApplyContext } from '../seeding-prefab-orchestration.types.js';
import { SeedingPrefabBase } from '../seeding-prefab-base.js';

export interface JsonFileSeedingPrefabOptions {
  /** JSON file basename under `parentPaths`. */
  fileName: string;
  /** Serializable value written with pretty-print and trailing newline. */
  jsonValue: unknown;
  /** Path segments under the sandbox root before the file name. */
  parentPaths?: string[];
}

/**
 * When to use: You need pretty-printed JSON on disk (any shape) at a path under optional `parentPaths`.
 * Strategic: materializes pretty-printed JSON fixtures (manifests, marketplace stubs) under arbitrary relative paths.
 */
export class JsonFileSeedingPrefab extends SeedingPrefabBase<JsonFileSeedingPrefabOptions> {
  override run(context: SeedingPrefabApplyContext): void {
    const filePath = this.joinSandboxPath(
      context,
      ...(this.options.parentPaths ?? []),
      this.options.fileName
    );
    this.writeJsonFile(filePath, this.options.jsonValue);
  }
}
