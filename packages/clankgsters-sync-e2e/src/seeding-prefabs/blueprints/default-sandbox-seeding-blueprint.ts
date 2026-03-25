import { PluginsDirSeedingPrefab } from '../prefabs/plugins-dir-seeding-prefab.js';
import { SkillsDirSeedingPrefab } from '../prefabs/skills-dir-seeding-prefab.js';
import { SourceDirSeedingPrefab } from '../prefabs/source-dir-seeding-prefab.js';
import { SeedingBlueprintBase } from '../seeding-blueprint-base.js';
import { MarkdownContextScenarioSeedingBlueprint } from './markdown-context-scenario-seeding-blueprint.js';
import { PluginsSkillsScenarioSeedingBlueprint } from './plugins-skills-scenario-seeding-blueprint.js';

export interface DefaultSandboxSeedingBlueprintOptions {
  /** Overrides the default markdown context filename (e.g. for configurable-paths cases). */
  markdownContextFileName?: string;
}

/**
 * When to use: You want the usual common “full sandbox” default starting point for an e2e case—source tree, markdown contexts, and a realistic plugin/skill story—in one seeding declaration.
 * Strategic: default e2e baseline — source/plugins/skills dirs, markdown context files (root + nested), and a representative plugins/skills scenario for discovery and sync.
 * Composes smaller blueprints so most cases can seed one declaration instead of listing every prefab.
 */
export class DefaultSandboxSeedingBlueprint extends SeedingBlueprintBase<DefaultSandboxSeedingBlueprintOptions> {
  /**
   * Tactical: returns a flat list of directory prefabs plus expanded markdown and plugins/skills scenario prefabs for the configured sandbox segment.
   * Desired outcome: a ready-to-sync sandbox shape such as `.clank/plugins/root`, `.clank/skills/sample-skill`, and markdown context files at root + nested locations
   * that mimics a fairly realistic but not exhaustive sandbox seeding scenario with source, plugins, skills, and markdown context files.
   * The markdown context files are seeded at root + nested locations to exercise symlink/markdown discovery in various topologies.
   * The plugins/skills scenario is seeded to exercise sync discovery and content behaviors.
   */
  override createSeedingPrefabs() {
    return [
      new SourceDirSeedingPrefab(this.sandboxDirectoryName, {}),
      new PluginsDirSeedingPrefab(this.sandboxDirectoryName, {}),
      new SkillsDirSeedingPrefab(this.sandboxDirectoryName, {}),
      ...new MarkdownContextScenarioSeedingBlueprint(this.sandboxDirectoryName, {
        markdownContextFileName: this.options.markdownContextFileName,
        scenarioMode: 'root-and-nested-1',
      }).createSeedingPrefabs(),
      ...new PluginsSkillsScenarioSeedingBlueprint(this.sandboxDirectoryName, {
        includeRootRules: true,
        includeStandaloneSkill: true,
        scenarioMode: 'root-and-nested-1',
      }).createSeedingPrefabs(),
    ];
  }
}
