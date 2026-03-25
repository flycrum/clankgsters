import type { SeedingPrefabApplyContext } from '../seeding-prefab-orchestration.types.js';
import { SeedingPrefabBase } from '../seeding-prefab-base.js';

export interface FileSeedingPrefabOptions {
  /** File basename (or relative name) under `parentPaths`. */
  fileName: string;
  /** UTF-8 file body (default empty string). */
  fileContents?: string;
  /** Path segments under the sandbox root before the file name. */
  parentPaths?: string[];
}

/**
 * When to use: You need arbitrary UTF-8 file content at a path built from `parentPaths` + file name (base for markdown/json specializations).
 * Strategic: writes a text file at a computed path; markdown/json specializations override naming or encoding.
 */
export class FileSeedingPrefab extends SeedingPrefabBase<FileSeedingPrefabOptions> {
  protected getOutputFileName(): string {
    return this.options.fileName;
  }

  override run(context: SeedingPrefabApplyContext): void {
    const filePath = this.joinSandboxPath(
      context,
      ...(this.options.parentPaths ?? []),
      this.getOutputFileName()
    );
    this.writeTextFile(filePath, this.options.fileContents ?? '');
  }
}
