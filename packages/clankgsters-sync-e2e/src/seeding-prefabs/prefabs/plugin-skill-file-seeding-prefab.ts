import { clankgstersConfigDefaults } from '../../../../clankgsters-sync/src/index.js';
import { FileSeedingPrefab } from './file-seeding-prefab.js';

export interface PluginSkillFileSeedingPrefabOptions {
  /** Plugin directory under `<source>/<plugins>`. */
  pluginDirName: string;
  /** Markdown body for the skill marker file. */
  skillContents?: string;
  /** Subdirectory under the plugin skills dir (default `root-fake-skill`). */
  skillDirName?: string;
  /** Overrides `sourceDefaults.skillFileName` for the marker filename. */
  skillFileName?: string;
  /** Overrides `sourceDefaults.sourceDir`. */
  sourceDirName?: string;
  /** Overrides `sourceDefaults.pluginsDir`. */
  pluginsDirName?: string;
  /** Parent segments before `sourceDir`. */
  parentPaths?: string[];
}

/**
 * When to use: Your test needs a skill file inside a plugin’s skills hierarchy (not a repo-wide standalone skill).
 * Strategic: writes a skill marker file under a plugin’s skills subtree for plugin-scoped skill discovery.
 */
export class PluginSkillFileSeedingPrefab extends FileSeedingPrefab {
  /**
   * Tactical: resolves path through `plugins/<plugin>/<skillsDir>/<skillDir>` with default skill filename.
   * Desired outcome: a plugin-scoped skill marker exists at a path like `.clank/plugins/root/skills/root-fake-skill/SKILL.md`.
   */
  constructor(sandboxDirectoryName: string, options: PluginSkillFileSeedingPrefabOptions) {
    const sourceDirName =
      options.sourceDirName ?? clankgstersConfigDefaults.CONSTANTS.sourceDefaults.sourceDir;
    const pluginsDirName =
      options.pluginsDirName ?? clankgstersConfigDefaults.CONSTANTS.sourceDefaults.pluginsDir;
    super(sandboxDirectoryName, {
      fileName:
        options.skillFileName ?? clankgstersConfigDefaults.CONSTANTS.sourceDefaults.skillFileName,
      fileContents: options.skillContents ?? '# skill\n',
      parentPaths: [
        ...(options.parentPaths ?? []),
        sourceDirName,
        pluginsDirName,
        options.pluginDirName,
        clankgstersConfigDefaults.CONSTANTS.sourceDefaults.skillsDir,
        options.skillDirName ?? 'root-fake-skill',
      ],
    });
  }
}
