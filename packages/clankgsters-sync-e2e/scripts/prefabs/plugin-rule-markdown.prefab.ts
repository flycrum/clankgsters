import { MarkdownFilePrefab } from './markdown-file-prefab.js';

export interface PluginRuleMarkdownPrefabOptions {
  pluginDirName: string;
  ruleContents?: string;
  ruleFileName?: string;
  sourceDirName?: string;
  pluginsDirName?: string;
  parentPaths?: string[];
}

/** Writes one plugin rule markdown file under `<plugin>/rules/`. */
export class PluginRuleMarkdownPrefab extends MarkdownFilePrefab {
  constructor(sandboxDirectoryName: string, options: PluginRuleMarkdownPrefabOptions) {
    const sourceDirName = options.sourceDirName ?? '.clank';
    const pluginsDirName = options.pluginsDirName ?? 'plugins';
    super(sandboxDirectoryName, {
      fileName: options.ruleFileName ?? 'root-rule.md',
      fileContents: options.ruleContents ?? '# rule\n',
      parentPaths: [
        ...(options.parentPaths ?? []),
        sourceDirName,
        pluginsDirName,
        options.pluginDirName,
        'rules',
      ],
    });
  }
}
