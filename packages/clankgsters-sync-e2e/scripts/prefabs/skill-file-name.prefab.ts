import { clankgstersConfigDefaults } from '../../../clankgsters-sync/config/index.js';
import { FilePrefab } from './file-prefab.js';

export interface SkillFileNamePrefabOptions {
  /** Optional marker filename override; defaults to `sourceDefaults.skillFileName`. */
  skillFileName?: string;
  /** Skill directory name to materialize under skills root. */
  skillDirName?: string;
  /** Optional source directory override; defaults to `sourceDefaults.sourceDir`. */
  sourceDirName?: string;
  /** Optional skills dir override; defaults to `sourceDefaults.skillsDir`. */
  skillsDirName?: string;
  /** Optional marker file contents. */
  fileContents?: string;
}

/** Creates one skills marker file so sync can discover a standalone skill directory. */
export class SkillFileNamePrefab extends FilePrefab {
  constructor(sandboxDirectoryName: string, options: SkillFileNamePrefabOptions = {}) {
    const sourceDirName =
      options.sourceDirName ?? clankgstersConfigDefaults.CONSTANTS.sourceDefaults.sourceDir;
    const skillsDirName =
      options.skillsDirName ?? clankgstersConfigDefaults.CONSTANTS.sourceDefaults.skillsDir;
    const skillDirName = options.skillDirName ?? 'sample-skill';
    super(sandboxDirectoryName, {
      fileName:
        options.skillFileName ?? clankgstersConfigDefaults.CONSTANTS.sourceDefaults.skillFileName,
      fileContents: options.fileContents ?? '# sample-skill\n',
      parentPaths: [sourceDirName, skillsDirName, skillDirName],
    });
  }
}
