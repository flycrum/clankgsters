import path from 'node:path';
import type { ClankgstersSourceDefaultsConfig } from '../configs/clankgsters-config.schema.js';
import {
  syncSourceLayoutsConfig,
  type DiscoverSourceLayoutPathsInput,
  type DiscoverSourceLayoutPathsResult,
  type ResolvedSourcePath,
} from './sync-source-layouts.config.js';

export type {
  DiscoverSourceLayoutPathsInput,
  DiscoverSourceLayoutPathsResult,
  ResolvedSourcePath,
  SyncSourceLayoutKey,
} from './sync-source-layouts.config.js';

/** Shared helper API for sync source layout normalization and discovery. */
export const syncSourceLayouts = {
  /** List of supported sync source layout keys. */
  SYNC_SOURCE_LAYOUT_KEYS: syncSourceLayoutsConfig.SYNC_SOURCE_LAYOUT_KEYS,

  /** Normalizes path separators to POSIX-style for manifest and comparison stability. */
  normalizeRel(value: string): string {
    return value.replace(/\\/g, '/');
  },

  /** Resolves nested and shorthand layout path templates from `sourceDefaults`. */
  getResolvedSourcePath(defaults: ClankgstersSourceDefaultsConfig): ResolvedSourcePath {
    const sourceDir = defaults.sourceDir.replace(/\/+$/g, '');
    const shorthandBase = syncSourceLayoutsConfig.sourceDirToShorthandBase(sourceDir);
    const pluginsLocalDir = `${defaults.pluginsDir}.local`;
    const skillsLocalDir = `${defaults.skillsDir}.local`;
    return {
      nestedPluginsPath: this.normalizeRel(path.posix.join(sourceDir, defaults.pluginsDir)),
      nestedPluginsLocalPath: this.normalizeRel(path.posix.join(sourceDir, pluginsLocalDir)),
      nestedSkillsPath: this.normalizeRel(path.posix.join(sourceDir, defaults.skillsDir)),
      nestedSkillsLocalPath: this.normalizeRel(path.posix.join(sourceDir, skillsLocalDir)),
      shorthandPluginsDirName: `${shorthandBase}-${defaults.pluginsDir}`,
      shorthandPluginsLocalDirName: `${shorthandBase}-${pluginsLocalDir}`,
      shorthandSkillsDirName: `${shorthandBase}-${defaults.skillsDir}`,
      shorthandSkillsLocalDirName: `${shorthandBase}-${skillsLocalDir}`,
    };
  },

  /**
   * Discovers plugin and skill directories for all supported source layouts.
   * Returns per-layout buckets for both plugin and skill roots.
   */
  discoverSourceLayoutPaths(
    input: DiscoverSourceLayoutPathsInput
  ): DiscoverSourceLayoutPathsResult {
    const excludedSet = new Set(input.excluded);
    const resolved = this.getResolvedSourcePath(input.sourceDefaults);
    const sourceRoots = syncSourceLayoutsConfig.findSourceRoots(
      input.repoRoot,
      input.sourceDefaults.sourceDir,
      input.excluded,
      (value) => this.normalizeRel(value)
    );

    const pluginsBuckets = syncSourceLayoutsConfig.createLayoutBuckets();
    const skillsBuckets = syncSourceLayoutsConfig.createLayoutBuckets();

    for (const sourceRoot of sourceRoots) {
      syncSourceLayoutsConfig.addIfDirectory(
        input.repoRoot,
        path.join(sourceRoot, input.sourceDefaults.pluginsDir),
        excludedSet,
        (value) => this.normalizeRel(value),
        pluginsBuckets.nestedRegular
      );
      syncSourceLayoutsConfig.addIfDirectory(
        input.repoRoot,
        path.join(sourceRoot, `${input.sourceDefaults.pluginsDir}.local`),
        excludedSet,
        (value) => this.normalizeRel(value),
        pluginsBuckets.nestedLocal
      );
      syncSourceLayoutsConfig.addIfDirectory(
        input.repoRoot,
        path.join(sourceRoot, input.sourceDefaults.skillsDir),
        excludedSet,
        (value) => this.normalizeRel(value),
        skillsBuckets.nestedRegular
      );
      syncSourceLayoutsConfig.addIfDirectory(
        input.repoRoot,
        path.join(sourceRoot, `${input.sourceDefaults.skillsDir}.local`),
        excludedSet,
        (value) => this.normalizeRel(value),
        skillsBuckets.nestedLocal
      );

      const sourceParent = path.dirname(sourceRoot);
      syncSourceLayoutsConfig.addIfDirectory(
        input.repoRoot,
        path.join(sourceParent, resolved.shorthandPluginsDirName),
        excludedSet,
        (value) => this.normalizeRel(value),
        pluginsBuckets.shorthandRegular
      );
      syncSourceLayoutsConfig.addIfDirectory(
        input.repoRoot,
        path.join(sourceParent, resolved.shorthandPluginsLocalDirName),
        excludedSet,
        (value) => this.normalizeRel(value),
        pluginsBuckets.shorthandLocal
      );
      syncSourceLayoutsConfig.addIfDirectory(
        input.repoRoot,
        path.join(sourceParent, resolved.shorthandSkillsDirName),
        excludedSet,
        (value) => this.normalizeRel(value),
        skillsBuckets.shorthandRegular
      );
      syncSourceLayoutsConfig.addIfDirectory(
        input.repoRoot,
        path.join(sourceParent, resolved.shorthandSkillsLocalDirName),
        excludedSet,
        (value) => this.normalizeRel(value),
        skillsBuckets.shorthandLocal
      );
    }

    const discoveredShorthandPlugins = syncSourceLayoutsConfig.findDirsByName(
      input.repoRoot,
      [resolved.shorthandPluginsDirName, resolved.shorthandPluginsLocalDirName],
      input.excluded,
      (value) => this.normalizeRel(value)
    );
    for (const shorthandDir of discoveredShorthandPlugins) {
      if (path.basename(shorthandDir) === resolved.shorthandPluginsDirName) {
        pluginsBuckets.shorthandRegular.add(shorthandDir);
      } else {
        pluginsBuckets.shorthandLocal.add(shorthandDir);
      }
    }

    const discoveredShorthandSkills = syncSourceLayoutsConfig.findDirsByName(
      input.repoRoot,
      [resolved.shorthandSkillsDirName, resolved.shorthandSkillsLocalDirName],
      input.excluded,
      (value) => this.normalizeRel(value)
    );
    for (const shorthandDir of discoveredShorthandSkills) {
      if (path.basename(shorthandDir) === resolved.shorthandSkillsDirName) {
        skillsBuckets.shorthandRegular.add(shorthandDir);
      } else {
        skillsBuckets.shorthandLocal.add(shorthandDir);
      }
    }

    return {
      pluginsByLayout: {
        nestedRegular: [...pluginsBuckets.nestedRegular].sort(),
        nestedLocal: [...pluginsBuckets.nestedLocal].sort(),
        shorthandRegular: [...pluginsBuckets.shorthandRegular].sort(),
        shorthandLocal: [...pluginsBuckets.shorthandLocal].sort(),
      },
      skillsByLayout: {
        nestedRegular: [...skillsBuckets.nestedRegular].sort(),
        nestedLocal: [...skillsBuckets.nestedLocal].sort(),
        shorthandRegular: [...skillsBuckets.shorthandRegular].sort(),
        shorthandLocal: [...skillsBuckets.shorthandLocal].sort(),
      },
    };
  },
};
