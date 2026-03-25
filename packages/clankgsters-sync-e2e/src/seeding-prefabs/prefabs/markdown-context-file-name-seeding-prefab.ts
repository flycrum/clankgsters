import { clankgstersConfigDefaults } from '../../../../clankgsters-sync/src/index.js';
import { MarkdownFileSeedingPrefab } from './markdown-file-seeding-prefab.js';

export interface MarkdownContextFileNameSeedingPrefabOptions {
  /** Markdown context filename (defaults to `sourceDefaults.markdownContextFileName`). */
  fileName?: string;
  /** File body (default minimal heading). */
  fileContents?: string;
  /** Path segments under the sandbox before the markdown file. */
  parentPaths?: string[];
}

/**
 * When to use: You need exactly one markdown context file (default name from `sourceDefaults` or overridden) at root or under `parentPaths`.
 * Strategic: writes the canonical markdown context file used by markdown symlink / context discovery behaviors.
 */
export class MarkdownContextFileNameSeedingPrefab extends MarkdownFileSeedingPrefab {
  /**
   * Tactical: applies defaults from `sourceDefaults` and delegates to `MarkdownFileSeedingPrefab` (with `.md` normalization).
   * Desired outcome: one markdown context file like `packages/app/CLAUDE.md` is written using default or overridden filename/content.
   */
  constructor(
    sandboxDirectoryName: string,
    options: MarkdownContextFileNameSeedingPrefabOptions = {}
  ) {
    super(sandboxDirectoryName, {
      fileName:
        options.fileName ??
        clankgstersConfigDefaults.CONSTANTS.sourceDefaults.markdownContextFileName,
      fileContents: options.fileContents ?? '# context\n',
      parentPaths: options.parentPaths ?? [],
    });
  }
}
