import { AgentPluginJsonPrefab } from '../agent-plugin-json.prefab.js';
import { DirectoryPrefab } from '../directory-prefab.js';
import type { PrefabExecutable } from '../prefab-types.js';
import { SkillFileNamePrefab } from '../skill-file-name.prefab.js';
import { PrefabPresetBase } from './prefab-preset-base.js';

export interface SourceLayoutVariantsPresetOptions {
  includeNestedLocal?: boolean;
  includeNestedRegular?: boolean;
  includeShorthandLocal?: boolean;
  includeShorthandRegular?: boolean;
  pluginsDirName?: string;
  skillsDirName?: string;
  sourceDirName?: string;
}

function toShorthandBase(sourceDir: string): string {
  const normalized = sourceDir
    .replace(/\\/g, '/')
    .replace(/\/+$/g, '')
    .replace(/^\.\/+/g, '');
  const token = normalized
    .split('/')
    .filter((segment) => segment.length > 0)
    .join('-');
  return token.length > 0 ? token : 'source';
}

/** Seeds plugin/skills roots across nested and shorthand regular/local layout variants. */
export class SourceLayoutVariantsPreset extends PrefabPresetBase<SourceLayoutVariantsPresetOptions> {
  protected override createPrefabs(): PrefabExecutable[] {
    const sourceDirName = this.options.sourceDirName ?? '.clank';
    const pluginsDirName = this.options.pluginsDirName ?? 'plugins';
    const skillsDirName = this.options.skillsDirName ?? 'skills';
    const shorthandBase = toShorthandBase(sourceDirName);
    const includeNestedRegular = this.options.includeNestedRegular ?? true;
    const includeNestedLocal = this.options.includeNestedLocal ?? true;
    const includeShorthandRegular = this.options.includeShorthandRegular ?? true;
    const includeShorthandLocal = this.options.includeShorthandLocal ?? true;
    const prefabs: PrefabExecutable[] = [];

    if (includeNestedRegular) {
      prefabs.push(
        new DirectoryPrefab(this.sandboxDirectoryName, {
          dirName: pluginsDirName,
          parentPaths: [sourceDirName],
        }),
        new AgentPluginJsonPrefab(this.sandboxDirectoryName, {
          pluginDirName: 'root-nested-regular',
          pluginManifestDirName: '.claude-plugin',
          pluginsDirName,
          sourceDirName,
        }),
        new SkillFileNamePrefab(this.sandboxDirectoryName, {
          skillDirName: 'skill-nested-regular',
          skillsDirName,
          sourceDirName,
        })
      );
    }
    if (includeNestedLocal) {
      prefabs.push(
        new DirectoryPrefab(this.sandboxDirectoryName, {
          dirName: `${pluginsDirName}.local`,
          parentPaths: [sourceDirName],
        }),
        new AgentPluginJsonPrefab(this.sandboxDirectoryName, {
          pluginDirName: 'root-nested-local',
          pluginManifestDirName: '.claude-plugin',
          pluginsDirName: `${pluginsDirName}.local`,
          sourceDirName,
        }),
        new SkillFileNamePrefab(this.sandboxDirectoryName, {
          skillDirName: 'skill-nested-local',
          skillsDirName: `${skillsDirName}.local`,
          sourceDirName,
        }),
        new DirectoryPrefab(this.sandboxDirectoryName, {
          dirName: `${skillsDirName}.local`,
          parentPaths: [sourceDirName],
        })
      );
    }
    if (includeShorthandRegular) {
      const shorthandPluginsDir = `${shorthandBase}-${pluginsDirName}`;
      const shorthandSkillsDir = `${shorthandBase}-${skillsDirName}`;
      prefabs.push(
        new DirectoryPrefab(this.sandboxDirectoryName, { dirName: shorthandPluginsDir }),
        new AgentPluginJsonPrefab(this.sandboxDirectoryName, {
          pluginDirName: 'root-shorthand-regular',
          pluginManifestDirName: '.claude-plugin',
          pluginsDirName: shorthandPluginsDir,
          sourceDirName: '.',
        }),
        new DirectoryPrefab(this.sandboxDirectoryName, { dirName: shorthandSkillsDir }),
        new SkillFileNamePrefab(this.sandboxDirectoryName, {
          skillDirName: 'skill-shorthand-regular',
          skillsDirName: shorthandSkillsDir,
          sourceDirName: '.',
        })
      );
    }
    if (includeShorthandLocal) {
      const shorthandPluginsLocalDir = `${shorthandBase}-${pluginsDirName}.local`;
      const shorthandSkillsLocalDir = `${shorthandBase}-${skillsDirName}.local`;
      prefabs.push(
        new DirectoryPrefab(this.sandboxDirectoryName, { dirName: shorthandPluginsLocalDir }),
        new AgentPluginJsonPrefab(this.sandboxDirectoryName, {
          pluginDirName: 'root-shorthand-local',
          pluginManifestDirName: '.claude-plugin',
          pluginsDirName: shorthandPluginsLocalDir,
          sourceDirName: '.',
        }),
        new DirectoryPrefab(this.sandboxDirectoryName, { dirName: shorthandSkillsLocalDir }),
        new SkillFileNamePrefab(this.sandboxDirectoryName, {
          skillDirName: 'skill-shorthand-local',
          skillsDirName: shorthandSkillsLocalDir,
          sourceDirName: '.',
        })
      );
    }

    return prefabs;
  }
}
