import { PrefabBase } from './prefab-base.js';
import type { PrefabApplyContext } from './prefab-types.js';

export interface FilePrefabOptions {
  /** Filename to write under `parentPaths` (extension is caller-defined). */
  fileName: string;
  /** Utf8 file contents to write. */
  fileContents?: string;
  /** Optional parent path segments under sandbox root. */
  parentPaths?: string[];
}

/** General-purpose text file prefab used by markdown/json specializations. */
export class FilePrefab extends PrefabBase<FilePrefabOptions> {
  /** Resolves the output filename; subclasses can override for extension/normalization rules. */
  protected getOutputFileName(): string {
    return this.options.fileName;
  }

  override apply(context: PrefabApplyContext): void {
    const filePath = this.joinSandboxPath(
      context,
      ...(this.options.parentPaths ?? []),
      this.getOutputFileName()
    );
    this.writeTextFile(filePath, this.options.fileContents ?? '');
  }
}
