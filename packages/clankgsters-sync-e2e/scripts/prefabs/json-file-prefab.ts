import { PrefabBase } from './common/prefab-base.js';
import type { PrefabApplyContext } from './common/prefab-types.js';

export interface JsonFilePrefabOptions {
  /** Filename for JSON output. */
  fileName: string;
  /** Serializable JSON value to write. */
  jsonValue: unknown;
  /** Optional parent path segments under sandbox root. */
  parentPaths?: string[];
}

/** General-purpose JSON file prefab with pretty-print and trailing newline. */
export class JsonFilePrefab extends PrefabBase<JsonFilePrefabOptions> {
  override apply(context: PrefabApplyContext): void {
    const filePath = this.joinSandboxPath(
      context,
      ...(this.options.parentPaths ?? []),
      this.options.fileName
    );
    this.writeJsonFile(filePath, this.options.jsonValue);
  }
}
