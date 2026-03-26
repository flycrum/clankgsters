import type { FileSeedingPrefabOptions } from './file-seeding-prefab.js';
import { FileSeedingPrefab } from './file-seeding-prefab.js';

/** Same as `FileSeedingPrefabOptions`; markdown-specific naming is enforced in `getOutputFileName`. */
export interface MarkdownFileSeedingPrefabOptions extends FileSeedingPrefabOptions {}

/**
 * When to use: You want markdown content but must guarantee a `.md` filename for discovery rules that key off extension.
 * Strategic: text file writer that enforces a `.md` extension for markdown discovery and symlink tests.
 */
export class MarkdownFileSeedingPrefab extends FileSeedingPrefab {
  protected override getOutputFileName(): string {
    return this.options.fileName.toLowerCase().endsWith('.md')
      ? this.options.fileName
      : `${this.options.fileName}.md`;
  }
}
