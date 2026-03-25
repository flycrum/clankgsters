import { FilePrefab } from './file-prefab.js';

export interface PluginSkillFilePrefabOptions {
  pluginDirName: string;
  skillContents?: string;
  skillDirName?: string;
  skillFileName?: string;
  sourceDirName?: string;
  pluginsDirName?: string;
  parentPaths?: string[];
}

/** Writes one plugin-scoped skill marker file under `<plugin>/skills/<skillDir>/`. */
export class PluginSkillFilePrefab extends FilePrefab {
  constructor(sandboxDirectoryName: string, options: PluginSkillFilePrefabOptions) {
    const sourceDirName = options.sourceDirName ?? '.clank';
    const pluginsDirName = options.pluginsDirName ?? 'plugins';
    super(sandboxDirectoryName, {
      fileName: options.skillFileName ?? 'SKILL.md',
      fileContents: options.skillContents ?? '# skill\n',
      parentPaths: [
        ...(options.parentPaths ?? []),
        sourceDirName,
        pluginsDirName,
        options.pluginDirName,
        'skills',
        options.skillDirName ?? 'root-fake-skill',
      ],
    });
  }
}
