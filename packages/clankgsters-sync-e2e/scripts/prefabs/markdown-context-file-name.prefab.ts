import { clankgstersConfigDefaults } from '../../../clankgsters-sync/config/index.js';
import { MarkdownFilePrefab } from './markdown-file-prefab.js';

export interface MarkdownContextFileNamePrefabOptions {
  /** Optional markdown context filename override; defaults to config constant (e.g. `CLANK.md`). */
  fileName?: string;
  /** Optional markdown text; default is a minimal heading marker. */
  fileContents?: string;
  /** Optional parent path segments under sandbox root for nested contexts. */
  parentPaths?: string[];
}

/** Writes the canonical markdown context file used by markdown symlink behavior discovery. */
export class MarkdownContextFileNamePrefab extends MarkdownFilePrefab {
  constructor(sandboxDirectoryName: string, options: MarkdownContextFileNamePrefabOptions = {}) {
    super(sandboxDirectoryName, {
      fileName:
        options.fileName ??
        clankgstersConfigDefaults.CONSTANTS.sourceDefaults.markdownContextFileName,
      fileContents: options.fileContents ?? '# context\n',
      parentPaths: options.parentPaths ?? [],
    });
  }
}
