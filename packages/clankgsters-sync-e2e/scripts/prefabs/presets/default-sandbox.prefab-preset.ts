import { PrefabPresetBase } from '../common/prefab-preset-base.js';
import type { PrefabExecutable } from '../common/prefab-types.js';
import { PluginsDirPrefab } from '../plugins-dir.prefab.js';
import { SkillsDirPrefab } from '../skills-dir.prefab.js';
import { SourceDirPrefab } from '../source-dir.prefab.js';
import { MarkdownContextScenarioPreset } from './markdown-context-scenario.prefab-preset.js';
import { PluginsSkillsScenarioPreset } from './plugins-skills-scenario.prefab-preset.js';

export interface DefaultSandboxPrefabPresetOptions {
  markdownContextFileName?: string;
}

/** Creates the default case baseline using dynamic prefab composition. */
export class DefaultSandboxPrefabPreset extends PrefabPresetBase<DefaultSandboxPrefabPresetOptions> {
  protected override createPrefabs(): PrefabExecutable[] {
    return [
      new SourceDirPrefab(this.sandboxDirectoryName),
      new PluginsDirPrefab(this.sandboxDirectoryName),
      new SkillsDirPrefab(this.sandboxDirectoryName),
      new MarkdownContextScenarioPreset(this.sandboxDirectoryName, {
        markdownContextFileName: this.options.markdownContextFileName,
        scenarioMode: 'root-and-nested-1',
      }),
      new PluginsSkillsScenarioPreset(this.sandboxDirectoryName, {
        includeRootRules: true,
        includeStandaloneSkill: true,
        scenarioMode: 'root-and-nested-1',
      }),
    ];
  }
}
