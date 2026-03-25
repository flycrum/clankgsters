import { FilePrefab, type FilePrefabOptions } from './file-prefab.js';

export interface MarkdownFilePrefabOptions extends FilePrefabOptions {}

/** Markdown-specialized file prefab that enforces `.md` extension. */
export class MarkdownFilePrefab extends FilePrefab {
  constructor(sandboxDirectoryName: string, options: MarkdownFilePrefabOptions) {
    super(sandboxDirectoryName, options);
  }

  protected override getOutputFileName(): string {
    const fileName = this.options.fileName.toLowerCase().endsWith('.md')
      ? this.options.fileName
      : `${this.options.fileName}.md`;
    return fileName;
  }
}
