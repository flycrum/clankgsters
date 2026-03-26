import {
  clankgsterConfigDefaults,
  clankgsterIdentity,
} from '../../../../clankgster-sync/src/index.js';
import { AgentPluginJsonSeedingPrefab } from '../prefabs/agent-plugin-json-seeding-prefab.js';
import { PluginCommandMarkdownSeedingPrefab } from '../prefabs/plugin-command-markdown-seeding-prefab.js';
import { PluginRuleMarkdownSeedingPrefab } from '../prefabs/plugin-rule-markdown-seeding-prefab.js';
import { PluginSkillFileSeedingPrefab } from '../prefabs/plugin-skill-file-seeding-prefab.js';
import { SkillFileNameSeedingPrefab } from '../prefabs/skill-file-name-seeding-prefab.js';
import { SeedingBlueprintBase } from '../seeding-blueprint-base.js';
import type {
  SeedingPrefabPrepareAction,
  SeedingPrefabPrepareOverlayOptions,
} from '../seeding-prefab-orchestration.types.js';

/** Which plugin/skill tree shapes to include: root-only, nested-only, or both. */
export type PluginsSkillsScenarioMode = 'root-only' | 'nested-only-1' | 'root-and-nested-1';

export interface PluginsSkillsScenarioSeedingBlueprintOptions {
  /** When true (default), seed a plugin rule markdown file under the root plugin. */
  includeRootRules?: boolean;
  /** When true (default), seed a standalone skill marker under the skills root; ignored when `scenarioMode` is `nested-only-1`. */
  includeStandaloneSkill?: boolean;
  /** Overrides `sourceDefaults.pluginsDir` for plugin paths in this scenario. */
  pluginsDirName?: string;
  /** Per-entry prepare action override for orchestration (append vs replace). */
  prepareEntryAction?: SeedingPrefabPrepareAction;
  /** Group-level prepare action for all entries expanded from this blueprint. */
  prepareGroupAction?: SeedingPrefabPrepareAction;
  /** Sandbox-relative paths to remove before apply when using replace (e.g. `.clank` or plugin/skill subtrees). */
  prepareReplaceRoots?: string[];
  /** Controls root vs nested plugin/skill content (default `root-and-nested-1`). */
  scenarioMode?: PluginsSkillsScenarioMode;
  /** Overrides the standalone skill marker filename (e.g. `ABILITY.md`). */
  skillFileName?: string;
  /** Overrides `sourceDefaults.skillsDir` for skill paths in this scenario. */
  skillsDirName?: string;
  /** Overrides `sourceDefaults.sourceDir` (e.g. `.yoyo` for source-defaults cases). */
  sourceDirName?: string;
}

/**
 * When to use: Your test focuses on plugins and skills content (manifests, commands, rules, skills) or needs to overlay/replace part of an earlier seed (e.g. different `sourceDir` or replace roots).
 * Strategic: seeds representative plugin manifests, commands, rules, plugin-scoped skills, and optional standalone skills so sync discovery and content behaviors can be exercised.
 * Supports prepare overlays so a later scenario can replace prior seeded trees (e.g. swap `.clank` for `.yoyo`).
 */
export class PluginsSkillsScenarioSeedingBlueprint extends SeedingBlueprintBase<PluginsSkillsScenarioSeedingBlueprintOptions> {
  /**
   * Tactical: maps blueprint options to orchestration append/replace metadata when the case opts into `prepare*` fields.
   * Desired outcome: orchestration resolves intent like `groupAction: replace` + `replaceRoots: ['.clank']` before writing new plugin/skill seeds.
   */
  override getPrepareOverlay(): SeedingPrefabPrepareOverlayOptions | undefined {
    const { prepareGroupAction, prepareEntryAction, prepareReplaceRoots } = this.options;
    if (prepareGroupAction == null && prepareEntryAction == null && prepareReplaceRoots == null)
      return undefined;
    const groupAction = prepareGroupAction ?? 'append';
    return {
      entryAction: prepareEntryAction ?? groupAction,
      groupAction,
      replaceRoots: prepareReplaceRoots,
    };
  }

  /**
   * Tactical: builds the plugin/skill file list for the chosen mode (root, nested under `packages/app`, rules, standalone skill).
   * Desired outcome: concrete seeds like `.clank/plugins/root/commands/root-cmd.md`, `.clank/plugins/root/rules/root-rule.md`, and `.clank/skills/sample-skill/SKILL.md`.
   */
  override createSeedingPrefabs() {
    const mode = this.options.scenarioMode ?? 'root-and-nested-1';
    const includeRoot = mode === 'root-only' || mode === 'root-and-nested-1';
    const includeNested = mode === 'nested-only-1' || mode === 'root-and-nested-1';
    const sourceDirName =
      this.options.sourceDirName ?? clankgsterConfigDefaults.CONSTANTS.sourceDefaults.sourceDir;
    const pluginsDirName =
      this.options.pluginsDirName ?? clankgsterConfigDefaults.CONSTANTS.sourceDefaults.pluginsDir;
    const skillsDirName =
      this.options.skillsDirName ?? clankgsterConfigDefaults.CONSTANTS.sourceDefaults.skillsDir;
    const prefabs = [];
    if (includeRoot) {
      prefabs.push(
        new AgentPluginJsonSeedingPrefab(this.sandboxDirectoryName, {
          pluginDirName: 'root',
          pluginManifestDirName: clankgsterIdentity.AGENT_CLAUDE_PLUGIN_DIR_NAME,
          pluginsDirName,
          sourceDirName,
        }),
        new AgentPluginJsonSeedingPrefab(this.sandboxDirectoryName, {
          pluginDirName: 'root',
          pluginManifestDirName: clankgsterIdentity.AGENT_CURSOR_PLUGIN_DIR_NAME,
          pluginsDirName,
          sourceDirName,
        }),
        new PluginCommandMarkdownSeedingPrefab(this.sandboxDirectoryName, {
          commandFileName: 'root-cmd.md',
          pluginDirName: 'root',
          pluginsDirName,
          sourceDirName,
        }),
        new PluginSkillFileSeedingPrefab(this.sandboxDirectoryName, {
          pluginDirName: 'root',
          pluginsDirName,
          skillDirName: 'root-fake-skill',
          sourceDirName,
        })
      );
      if (this.options.includeRootRules ?? true)
        prefabs.push(
          new PluginRuleMarkdownSeedingPrefab(this.sandboxDirectoryName, {
            pluginDirName: 'root',
            pluginsDirName,
            ruleFileName: 'root-rule.md',
            sourceDirName,
          })
        );
    }
    if (includeNested) {
      const parentPaths = ['packages', 'app'];
      prefabs.push(
        new AgentPluginJsonSeedingPrefab(this.sandboxDirectoryName, {
          parentPaths,
          pluginDirName: 'nested',
          pluginManifestDirName: clankgsterIdentity.AGENT_CLAUDE_PLUGIN_DIR_NAME,
          pluginsDirName,
          sourceDirName,
        }),
        new AgentPluginJsonSeedingPrefab(this.sandboxDirectoryName, {
          parentPaths,
          pluginDirName: 'nested',
          pluginManifestDirName: clankgsterIdentity.AGENT_CURSOR_PLUGIN_DIR_NAME,
          pluginsDirName,
          sourceDirName,
        }),
        new PluginCommandMarkdownSeedingPrefab(this.sandboxDirectoryName, {
          commandFileName: 'nested-cmd.md',
          parentPaths,
          pluginDirName: 'nested',
          pluginsDirName,
          sourceDirName,
        }),
        new PluginSkillFileSeedingPrefab(this.sandboxDirectoryName, {
          parentPaths,
          pluginDirName: 'nested',
          pluginsDirName,
          skillDirName: 'nested-fake-skill',
          sourceDirName,
        })
      );
    }
    if ((this.options.includeStandaloneSkill ?? true) && mode !== 'nested-only-1')
      prefabs.push(
        new SkillFileNameSeedingPrefab(this.sandboxDirectoryName, {
          skillDirName: 'sample-skill',
          skillFileName: this.options.skillFileName,
          skillsDirName,
          sourceDirName,
        })
      );
    return prefabs;
  }
}
