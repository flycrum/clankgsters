import { AgentPluginJsonPrefab } from './agent-plugin-json.prefab.js';
import { DirectoryPrefab } from './directory-prefab.js';
import { FilePrefab } from './file-prefab.js';
import { JsonFilePrefab } from './json-file-prefab.js';
import { LocalMarketplaceNamePrefab } from './local-marketplace-name.prefab.js';
import { MarkdownContextFileNamePrefab } from './markdown-context-file-name.prefab.js';
import { MarkdownFilePrefab } from './markdown-file-prefab.js';
import { PluginCommandMarkdownPrefab } from './plugin-command-markdown.prefab.js';
import { PluginRuleMarkdownPrefab } from './plugin-rule-markdown.prefab.js';
import { PluginsDirPrefab } from './plugins-dir.prefab.js';
import { PluginSkillFilePrefab } from './plugin-skill-file.prefab.js';
import { PrefabBase } from './prefab-base.js';
import { SandboxDirNameForTestCase } from './sandbox-dir-name-for-test-case.prefab.js';
import { SkillFileNamePrefab } from './skill-file-name.prefab.js';
import { SkillsDirPrefab } from './skills-dir.prefab.js';
import { SkillsLocalDirPrefab } from './skills-local-dir.prefab.js';
import { SourceDirPrefab } from './source-dir.prefab.js';
import { PluginsLocalDirPrefab } from './plugins-local-dir.prefab.js';
import { DefaultSandboxPrefabPreset } from './presets/default-sandbox.prefab-preset.js';
import { MarkdownContextScenarioPreset } from './presets/markdown-context-scenario.prefab-preset.js';
import { PrefabPresetBase } from './presets/prefab-preset-base.js';
import { PluginsSkillsScenarioPreset } from './presets/plugins-skills-scenario.prefab-preset.js';
import { SourceLayoutVariantsPreset } from './presets/source-layout-variants.prefab-preset.js';
import type { PrefabExecutable } from './prefab-types.js';
import type { PrefabApplyContext } from './prefab-types.js';

/** Registry list of concrete prefab classes available to test cases. */
const PREFAB_CLASSES = [
  AgentPluginJsonPrefab,
  DirectoryPrefab,
  FilePrefab,
  JsonFilePrefab,
  LocalMarketplaceNamePrefab,
  MarkdownContextFileNamePrefab,
  MarkdownFilePrefab,
  PluginCommandMarkdownPrefab,
  PluginRuleMarkdownPrefab,
  PluginsDirPrefab,
  PluginsLocalDirPrefab,
  PluginSkillFilePrefab,
  SandboxDirNameForTestCase,
  SkillFileNamePrefab,
  SkillsDirPrefab,
  SkillsLocalDirPrefab,
  SourceDirPrefab,
] as const;

/** Registry list of concrete prefab preset classes available to test cases. */
const PREFAB_PRESET_CLASSES = [
  DefaultSandboxPrefabPreset,
  MarkdownContextScenarioPreset,
  PluginsSkillsScenarioPreset,
  SourceLayoutVariantsPreset,
] as const;

/** Shared prefab API surface and registries for e2e seeding. */
export const prefabs = {
  PREFAB_CLASSES,
  PREFAB_PRESET_CLASSES,

  /** Runs prefab/preset instances sequentially for one case context. */
  applySequentially(executables: PrefabExecutable[], context: PrefabApplyContext): void {
    for (const executable of executables) {
      executable.apply(context);
    }
  },
} as const;

export {
  AgentPluginJsonPrefab,
  DefaultSandboxPrefabPreset,
  DirectoryPrefab,
  FilePrefab,
  JsonFilePrefab,
  LocalMarketplaceNamePrefab,
  MarkdownContextFileNamePrefab,
  MarkdownContextScenarioPreset,
  MarkdownFilePrefab,
  PluginCommandMarkdownPrefab,
  PluginRuleMarkdownPrefab,
  PluginsDirPrefab,
  PluginsLocalDirPrefab,
  PluginsSkillsScenarioPreset,
  SourceLayoutVariantsPreset,
  PluginSkillFilePrefab,
  PrefabBase,
  PrefabPresetBase,
  SandboxDirNameForTestCase,
  SkillFileNamePrefab,
  SkillsDirPrefab,
  SkillsLocalDirPrefab,
  SourceDirPrefab,
};

export type { PrefabApplyContext, PrefabExecutable } from './prefab-types.js';
