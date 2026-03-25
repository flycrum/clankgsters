import { clankgstersConfigDefaults } from '../../../../clankgsters-sync/src/index.js';
import { MarkdownFileSeedingPrefab } from './markdown-file-seeding-prefab.js';

export interface PluginRuleMarkdownSeedingPrefabOptions {
  /** Plugin directory under `<source>/<plugins>`. */
  pluginDirName: string;
  /** Markdown body for the rule file. */
  ruleContents?: string;
  /** Basename for the rule file (default `root-rule.md`). */
  ruleFileName?: string;
  /** Overrides `sourceDefaults.sourceDir`. */
  sourceDirName?: string;
  /** Overrides `sourceDefaults.pluginsDir`. */
  pluginsDirName?: string;
  /** Parent segments before `sourceDir`. */
  parentPaths?: string[];
}

/**
 * When to use: Your test exercises plugin rules under `<source>/<plugins>/<plugin>/rules/`.
 * Strategic: seeds one plugin rule markdown under `<plugin>/rules/` for rules sync and discovery.
 */
export class PluginRuleMarkdownSeedingPrefab extends MarkdownFileSeedingPrefab {
  /**
   * Tactical: builds path through `rules` and applies default rule filename and content.
   * Desired outcome: a rule doc appears at a path like `.clank/plugins/root/rules/root-rule.md`.
   */
  constructor(sandboxDirectoryName: string, options: PluginRuleMarkdownSeedingPrefabOptions) {
    const sourceDirName =
      options.sourceDirName ?? clankgstersConfigDefaults.CONSTANTS.sourceDefaults.sourceDir;
    const pluginsDirName =
      options.pluginsDirName ?? clankgstersConfigDefaults.CONSTANTS.sourceDefaults.pluginsDir;
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
