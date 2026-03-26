import {
  clankgsterConfigDefaults,
  clankgsterIdentity,
} from '../../../../clankgster-sync/src/index.js';
import { sourceLayoutPathNaming } from '../../../../clankgster-sync/src/common/source-layout-path-naming.js';
import { AgentPluginJsonSeedingPrefab } from '../prefabs/agent-plugin-json-seeding-prefab.js';
import { DirectorySeedingPrefab } from '../prefabs/directory-seeding-prefab.js';
import { SkillFileNameSeedingPrefab } from '../prefabs/skill-file-name-seeding-prefab.js';
import { SeedingBlueprintBase } from '../seeding-blueprint-base.js';

/** Options controlling which layout variants to seed and which directory names to use under the sandbox. */
export interface SourceLayoutVariantsSeedingBlueprintOptions {
  /** When true (default), seed plugins/skills under `<sourceDir>/*.local` (nested local layout). */
  includeNestedLocal?: boolean;
  /** When true (default), seed regular nested plugins dir + sample plugin and skill under `<sourceDir>/plugins` and skills. */
  includeNestedRegular?: boolean;
  /** When true (default), seed shorthand local plugin/skill dirs at repo root using `<shorthand>-<dir>.local` naming. */
  includeShorthandLocal?: boolean;
  /** When true (default), seed shorthand regular plugin/skill dirs at repo root using `<shorthand>-<dir>` naming. */
  includeShorthandRegular?: boolean;
  /** Overrides `sourceDefaults.pluginsDir` for paths in this blueprint. */
  pluginsDirName?: string;
  /** Overrides `sourceDefaults.skillsDir` for paths in this blueprint. */
  skillsDirName?: string;
  /** Overrides `sourceDefaults.sourceDir` (e.g. `.clank`) as the anchor for nested layouts. */
  sourceDirName?: string;
}

/**
 * When to use: Your test must cover how sync resolves plugins/skills when layouts differ (nested under source vs shorthand at root, and regular vs `.local` dirs)—in one case without copy-pasting trees.
 * Strategic: exercises sync discovery and path resolution across nested vs shorthand and regular vs `.local` plugin/skill layouts in one e2e sandbox.
 */
export class SourceLayoutVariantsSeedingBlueprint extends SeedingBlueprintBase<SourceLayoutVariantsSeedingBlueprintOptions> {
  /**
   * Tactical: builds the selected variant trees (nested regular/local, shorthand regular/local) with minimal plugin.json and skill markers for discovery.
   * Desired outcome: mixed layout artifacts like `.clank/plugins.local/root-nested-local/.claude-plugin/plugin.json` and `clank-plugins/root-shorthand-regular/.claude-plugin/plugin.json` coexist in one sandbox.
   */
  override createSeedingPrefabs() {
    const sourceDirName =
      this.options.sourceDirName ?? clankgsterConfigDefaults.CONSTANTS.sourceDefaults.sourceDir;
    const pluginsDirName =
      this.options.pluginsDirName ?? clankgsterConfigDefaults.CONSTANTS.sourceDefaults.pluginsDir;
    const skillsDirName =
      this.options.skillsDirName ?? clankgsterConfigDefaults.CONSTANTS.sourceDefaults.skillsDir;
    const shorthandBase = sourceLayoutPathNaming.sourceDirToShorthandBase(sourceDirName);
    const includeNestedRegular = this.options.includeNestedRegular ?? true;
    const includeNestedLocal = this.options.includeNestedLocal ?? true;
    const includeShorthandRegular = this.options.includeShorthandRegular ?? true;
    const includeShorthandLocal = this.options.includeShorthandLocal ?? true;
    const prefabs = [];
    if (includeNestedRegular)
      prefabs.push(
        new DirectorySeedingPrefab(this.sandboxDirectoryName, {
          dirName: pluginsDirName,
          parentPaths: [sourceDirName],
        }),
        new AgentPluginJsonSeedingPrefab(this.sandboxDirectoryName, {
          pluginDirName: 'root-nested-regular',
          pluginManifestDirName: clankgsterIdentity.AGENT_CLAUDE_PLUGIN_DIR_NAME,
          pluginsDirName,
          sourceDirName,
        }),
        new SkillFileNameSeedingPrefab(this.sandboxDirectoryName, {
          skillDirName: 'skill-nested-regular',
          skillsDirName,
          sourceDirName,
        })
      );
    if (includeNestedLocal)
      prefabs.push(
        new DirectorySeedingPrefab(this.sandboxDirectoryName, {
          dirName: `${pluginsDirName}.local`,
          parentPaths: [sourceDirName],
        }),
        new AgentPluginJsonSeedingPrefab(this.sandboxDirectoryName, {
          pluginDirName: 'root-nested-local',
          pluginManifestDirName: clankgsterIdentity.AGENT_CLAUDE_PLUGIN_DIR_NAME,
          pluginsDirName: `${pluginsDirName}.local`,
          sourceDirName,
        }),
        new SkillFileNameSeedingPrefab(this.sandboxDirectoryName, {
          skillDirName: 'skill-nested-local',
          skillsDirName: `${skillsDirName}.local`,
          sourceDirName,
        }),
        new DirectorySeedingPrefab(this.sandboxDirectoryName, {
          dirName: `${skillsDirName}.local`,
          parentPaths: [sourceDirName],
        })
      );
    if (includeShorthandRegular) {
      const shorthandPluginsDir = `${shorthandBase}-${pluginsDirName}`;
      const shorthandSkillsDir = `${shorthandBase}-${skillsDirName}`;
      prefabs.push(
        new DirectorySeedingPrefab(this.sandboxDirectoryName, { dirName: shorthandPluginsDir }),
        new AgentPluginJsonSeedingPrefab(this.sandboxDirectoryName, {
          pluginDirName: 'root-shorthand-regular',
          pluginManifestDirName: clankgsterIdentity.AGENT_CLAUDE_PLUGIN_DIR_NAME,
          pluginsDirName: shorthandPluginsDir,
          sourceDirName: '.',
        }),
        new DirectorySeedingPrefab(this.sandboxDirectoryName, { dirName: shorthandSkillsDir }),
        new SkillFileNameSeedingPrefab(this.sandboxDirectoryName, {
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
        new DirectorySeedingPrefab(this.sandboxDirectoryName, {
          dirName: shorthandPluginsLocalDir,
        }),
        new AgentPluginJsonSeedingPrefab(this.sandboxDirectoryName, {
          pluginDirName: 'root-shorthand-local',
          pluginManifestDirName: clankgsterIdentity.AGENT_CLAUDE_PLUGIN_DIR_NAME,
          pluginsDirName: shorthandPluginsLocalDir,
          sourceDirName: '.',
        }),
        new DirectorySeedingPrefab(this.sandboxDirectoryName, { dirName: shorthandSkillsLocalDir }),
        new SkillFileNameSeedingPrefab(this.sandboxDirectoryName, {
          skillDirName: 'skill-shorthand-local',
          skillsDirName: shorthandSkillsLocalDir,
          sourceDirName: '.',
        })
      );
    }
    return prefabs;
  }
}
