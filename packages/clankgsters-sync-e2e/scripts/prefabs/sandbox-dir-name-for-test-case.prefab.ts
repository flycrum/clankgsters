import type { PrefabApplyContext } from './prefab-types.js';
import { PrefabBase } from './prefab-base.js';

export interface SandboxDirNameForTestCaseOptions {
  /** Optional explicit sandbox directory name; defaults to `sandbox-template`. */
  dirName?: string;
}

/**
 * Creates the sandbox directory for a case run.
 * This dynamically replaces the former static `sandboxes/sandbox-template` clone source.
 */
export class SandboxDirNameForTestCase extends PrefabBase<SandboxDirNameForTestCaseOptions> {
  override apply(context: PrefabApplyContext): void {
    const dirName = this.options.dirName ?? this.sandboxDirectoryName;
    this.ensureDirectory(context.caseOutputRoot);
    this.ensureDirectory(
      this.joinSandboxPath(context, ...(dirName === this.sandboxDirectoryName ? [] : [dirName]))
    );
  }
}
