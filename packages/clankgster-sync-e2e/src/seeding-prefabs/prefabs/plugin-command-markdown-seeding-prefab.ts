import { clankgsterConfigDefaults } from '../../../../clankgster-sync/src/index.js';
import { MarkdownFileSeedingPrefab } from './markdown-file-seeding-prefab.js';

export interface PluginCommandMarkdownSeedingPrefabOptions {
  /** Basename for the command markdown file (default `root-cmd.md`). */
  commandFileName?: string;
  /** Markdown body for the command file. */
  commandContents?: string;
  /** Plugin directory under `<source>/<plugins>`. */
  pluginDirName: string;
  /** Overrides `sourceDefaults.sourceDir`. */
  sourceDirName?: string;
  /** Overrides `sourceDefaults.pluginsDir`. */
  pluginsDirName?: string;
  /** Parent segments before `sourceDir` (nested packages). */
  parentPaths?: string[];
}

/**
 * When to use: Your test exercises plugin commands discovery under `<source>/<plugins>/<plugin>/commands/`.
 * Strategic: seeds one plugin command markdown under `<plugin>/commands/` for command discovery behavior.
 */
export class PluginCommandMarkdownSeedingPrefab extends MarkdownFileSeedingPrefab {
  /**
   * Tactical: builds `parentPaths` + source + plugins + plugin + `commands` and default filename/content.
   * Desired outcome: a command doc appears at a path like `.clank/plugins/root/commands/root-cmd.md`.
   */
  constructor(sandboxDirectoryName: string, options: PluginCommandMarkdownSeedingPrefabOptions) {
    const sourceDirName =
      options.sourceDirName ?? clankgsterConfigDefaults.CONSTANTS.sourceDefaults.sourceDir;
    const pluginsDirName =
      options.pluginsDirName ?? clankgsterConfigDefaults.CONSTANTS.sourceDefaults.pluginsDir;
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
