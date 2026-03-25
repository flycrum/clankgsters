import { AgentPluginJsonPrefab } from '../agent-plugin-json.prefab.js';
import { PluginCommandMarkdownPrefab } from '../plugin-command-markdown.prefab.js';
import { PluginRuleMarkdownPrefab } from '../plugin-rule-markdown.prefab.js';
import { PluginSkillFilePrefab } from '../plugin-skill-file.prefab.js';
import { SkillFileNamePrefab } from '../skill-file-name.prefab.js';
import type { PrefabExecutable } from '../prefab-types.js';
import { PrefabPresetBase } from './prefab-preset-base.js';

export type PluginsSkillsScenarioMode = 'root-only' | 'nested-only-1' | 'root-and-nested-1';

export interface PluginsSkillsScenarioPresetOptions {
  includeRootRules?: boolean;
  includeStandaloneSkill?: boolean;
  pluginsDirName?: string;
  scenarioMode?: PluginsSkillsScenarioMode;
  skillFileName?: string;
  skillsDirName?: string;
  sourceDirName?: string;
}

/** Seeds representative plugin and skills trees for discovery/content sync scenarios. */
export class PluginsSkillsScenarioPreset extends PrefabPresetBase<PluginsSkillsScenarioPresetOptions> {
  protected override createPrefabs(): PrefabExecutable[] {
    const mode = this.options.scenarioMode ?? 'root-and-nested-1';
    const includeRoot = mode === 'root-only' || mode === 'root-and-nested-1';
    const includeNested = mode === 'nested-only-1' || mode === 'root-and-nested-1';
    const sourceDirName = this.options.sourceDirName ?? '.clank';
    const pluginsDirName = this.options.pluginsDirName ?? 'plugins';
    const skillsDirName = this.options.skillsDirName ?? 'skills';
    const prefabs: PrefabExecutable[] = [];

    if (includeRoot) {
      prefabs.push(
        new AgentPluginJsonPrefab(this.sandboxDirectoryName, {
          pluginDirName: 'root',
          pluginManifestDirName: '.claude-plugin',
          pluginsDirName,
          sourceDirName,
        }),
        new AgentPluginJsonPrefab(this.sandboxDirectoryName, {
          pluginDirName: 'root',
          pluginManifestDirName: '.cursor-plugin',
          pluginsDirName,
          sourceDirName,
        }),
        new PluginCommandMarkdownPrefab(this.sandboxDirectoryName, {
          commandFileName: 'root-cmd.md',
          pluginDirName: 'root',
          pluginsDirName,
          sourceDirName,
        }),
        new PluginSkillFilePrefab(this.sandboxDirectoryName, {
          pluginDirName: 'root',
          pluginsDirName,
          skillDirName: 'root-fake-skill',
          sourceDirName,
        })
      );
      if (this.options.includeRootRules ?? true) {
        prefabs.push(
          new PluginRuleMarkdownPrefab(this.sandboxDirectoryName, {
            pluginDirName: 'root',
            pluginsDirName,
            ruleFileName: 'root-rule.md',
            sourceDirName,
          })
        );
      }
    }

    if (includeNested) {
      const parentPaths = ['packages', 'app'];
      prefabs.push(
        new AgentPluginJsonPrefab(this.sandboxDirectoryName, {
          parentPaths,
          pluginDirName: 'nested',
          pluginManifestDirName: '.claude-plugin',
          pluginsDirName,
          sourceDirName,
        }),
        new AgentPluginJsonPrefab(this.sandboxDirectoryName, {
          parentPaths,
          pluginDirName: 'nested',
          pluginManifestDirName: '.cursor-plugin',
          pluginsDirName,
          sourceDirName,
        }),
        new PluginCommandMarkdownPrefab(this.sandboxDirectoryName, {
          commandFileName: 'nested-cmd.md',
          parentPaths,
          pluginDirName: 'nested',
          pluginsDirName,
          sourceDirName,
        }),
        new PluginSkillFilePrefab(this.sandboxDirectoryName, {
          parentPaths,
          pluginDirName: 'nested',
          pluginsDirName,
          skillDirName: 'nested-fake-skill',
          sourceDirName,
        })
      );
    }

    if (this.options.includeStandaloneSkill ?? true) {
      prefabs.push(
        new SkillFileNamePrefab(this.sandboxDirectoryName, {
          skillDirName: 'sample-skill',
          skillFileName: this.options.skillFileName,
          skillsDirName,
          sourceDirName,
        })
      );
    }

    return prefabs;
  }
}
