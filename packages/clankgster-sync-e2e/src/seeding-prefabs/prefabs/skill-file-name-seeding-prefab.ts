import { clankgsterConfigDefaults } from '../../../../clankgster-sync/src/index.js';
import { FileSeedingPrefab } from './file-seeding-prefab.js';

export interface SkillFileNameSeedingPrefabOptions {
  /** Marker filename (defaults to `sourceDefaults.skillFileName`). */
  skillFileName?: string;
  /** Skill directory name under `<source>/<skillsDir>`. */
  skillDirName?: string;
  /** Overrides `sourceDefaults.sourceDir`. */
  sourceDirName?: string;
  /** Overrides `sourceDefaults.skillsDir`. */
  skillsDirName?: string;
  /** Marker file contents. */
  fileContents?: string;
}

/**
 * When to use: Your test needs a standalone skill (marker file under `<source>/<skills>/<skillDir>/`) discoverable without a parent plugin.
 * Strategic: creates a standalone skill discovery marker under `<source>/<skills>/...` for skills-dir sync tests.
 */
export class SkillFileNameSeedingPrefab extends FileSeedingPrefab {
  /**
   * Tactical: resolves `sample-skill` (or override) and writes the skill marker file with default heading.
   * Desired outcome: a standalone skill marker exists at a path like `.clank/skills/sample-skill/SKILL.md`.
   */
  constructor(sandboxDirectoryName: string, options: SkillFileNameSeedingPrefabOptions = {}) {
    const sourceDirName =
      options.sourceDirName ?? clankgsterConfigDefaults.CONSTANTS.sourceDefaults.sourceDir;
    const skillsDirName =
      options.skillsDirName ?? clankgsterConfigDefaults.CONSTANTS.sourceDefaults.skillsDir;
    const skillDirName = options.skillDirName ?? 'sample-skill';
    super(sandboxDirectoryName, {
      fileName:
        options.skillFileName ?? clankgsterConfigDefaults.CONSTANTS.sourceDefaults.skillFileName,
      fileContents: options.fileContents ?? '# sample-skill\n',
      parentPaths: [sourceDirName, skillsDirName, skillDirName],
    });
  }
}
