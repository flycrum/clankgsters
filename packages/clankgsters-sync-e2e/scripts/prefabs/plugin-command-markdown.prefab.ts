import { MarkdownFilePrefab } from './markdown-file-prefab.js';

export interface PluginCommandMarkdownPrefabOptions {
  commandFileName?: string;
  commandContents?: string;
  pluginDirName: string;
  sourceDirName?: string;
  pluginsDirName?: string;
  parentPaths?: string[];
}

/** Writes one plugin command markdown file under `<plugin>/commands/`. */
export class PluginCommandMarkdownPrefab extends MarkdownFilePrefab {
  constructor(sandboxDirectoryName: string, options: PluginCommandMarkdownPrefabOptions) {
    const sourceDirName = options.sourceDirName ?? '.clank';
    const pluginsDirName = options.pluginsDirName ?? 'plugins';
    super(sandboxDirectoryName, {
      fileName: options.commandFileName ?? 'root-cmd.md',
      fileContents: options.commandContents ?? '# command\n',
      parentPaths: [
        ...(options.parentPaths ?? []),
        sourceDirName,
        pluginsDirName,
        options.pluginDirName,
        'commands',
      ],
    });
  }
}
