import fs from 'node:fs';
import path from 'node:path';
import type { ClankgstersSourceDefaultsConfig } from '../configs/clankgsters-config.schema.js';

/**
 * Stable layout IDs used as map keys throughout discovery/manifest customData.
 * Example keys: `nestedRegular`, `nestedLocal`, `shorthandRegular`, `shorthandLocal`.
 */
const SYNC_SOURCE_LAYOUT_KEYS = [
  'nestedRegular',
  'nestedLocal',
  'shorthandRegular',
  'shorthandLocal',
] as const;

/** One layout key value from {@link SYNC_SOURCE_LAYOUT_KEYS}. */
export type SyncSourceLayoutKey = (typeof SYNC_SOURCE_LAYOUT_KEYS)[number];

/**
 * Derived naming templates computed from `sourceDefaults`.
 * Example with `sourceDir: '.clank', pluginsDir: 'plugins', skillsDir: 'skills'`:
 * - nested: `.clank/plugins`, `.clank/plugins.local`, `.clank/skills`, `.clank/skills.local`
 * - shorthand names: `.clank-plugins`, `.clank-plugins.local`, `.clank-skills`, `.clank-skills.local`
 */
export interface ResolvedSourcePath {
  /** Nested regular plugins path template, e.g. `.clank/plugins`. */
  nestedPluginsPath: string;
  /** Nested local plugins path template, e.g. `.clank/plugins.local`. */
  nestedPluginsLocalPath: string;
  /** Nested regular skills path template, e.g. `.clank/skills`. */
  nestedSkillsPath: string;
  /** Nested local skills path template, e.g. `.clank/skills.local`. */
  nestedSkillsLocalPath: string;
  /** Shorthand regular plugins directory name, e.g. `.clank-plugins`. */
  shorthandPluginsDirName: string;
  /** Shorthand local plugins directory name, e.g. `.clank-plugins.local`. */
  shorthandPluginsLocalDirName: string;
  /** Shorthand regular skills directory name, e.g. `.clank-skills`. */
  shorthandSkillsDirName: string;
  /** Shorthand local skills directory name, e.g. `.clank-skills.local`. */
  shorthandSkillsLocalDirName: string;
}

/**
 * Inputs for one discovery pass in a repo.
 * Example: `{ repoRoot: '/repo', excluded: ['node_modules'], sourceDefaults: { ... } }`.
 */
export interface DiscoverSourceLayoutPathsInput {
  excluded: string[];
  repoRoot: string;
  sourceDefaults: ClankgstersSourceDefaultsConfig;
}

/**
 * Discovery result grouped by layout key for plugins and skills.
 * Example: `pluginsByLayout.nestedLocal -> ['/repo/.clank/plugins.local']`.
 */
export interface DiscoverSourceLayoutPathsResult {
  pluginsByLayout: Record<SyncSourceLayoutKey, string[]>;
  skillsByLayout: Record<SyncSourceLayoutKey, string[]>;
}

/**
 * Shared config helpers for discovering plugin/skills directories across nested and shorthand layouts.
 * Example: finds `.clank/plugins`, `.clank/plugins.local`, `.clank-plugins`, `.clank-plugins.local` (and the matching `skills` variants).
 * Holds canonical keys and low-level FS primitives used by `syncSourceLayouts` runtime flow.
 */
export const syncSourceLayoutsConfig = {
  SYNC_SOURCE_LAYOUT_KEYS,

  /** Builds empty mutable layout buckets used during discovery. */
  createLayoutBuckets(): Record<SyncSourceLayoutKey, Set<string>> {
    return {
      nestedRegular: new Set<string>(),
      nestedLocal: new Set<string>(),
      shorthandRegular: new Set<string>(),
      shorthandLocal: new Set<string>(),
    };
  },

  /** Converts `sourceDir` into a shorthand-safe prefix (e.g. `.clank` -> `.clank`, `foo/bar` -> `foo-bar`). */
  sourceDirToShorthandBase(sourceDir: string): string {
    const normalized = sourceDir
      .replace(/\\/g, '/')
      .replace(/\/+$/g, '')
      .replace(/^\.\/+/g, '');
    const token = normalized
      .split('/')
      .filter((segment) => segment.length > 0)
      .join('-');
    return token.length > 0 ? token : 'source';
  },

  /** Checks if a directory should be excluded by basename or repo-relative path. */
  isExcludedDirectory(
    repoRoot: string,
    fullPath: string,
    excludedSet: Set<string>,
    normalizeRel: (value: string) => string,
    nameOverride?: string
  ): boolean {
    const name = nameOverride ?? path.basename(fullPath);
    const rel = normalizeRel(path.relative(repoRoot, fullPath));
    return excludedSet.has(name) || excludedSet.has(rel);
  },

  /** Adds an existing directory to a bucket when it is not excluded. */
  addIfDirectory(
    repoRoot: string,
    fullPath: string,
    excludedSet: Set<string>,
    normalizeRel: (value: string) => string,
    target: Set<string>
  ): void {
    if (!fs.existsSync(fullPath)) return;
    if (!fs.statSync(fullPath).isDirectory()) return;
    if (this.isExcludedDirectory(repoRoot, fullPath, excludedSet, normalizeRel)) return;
    target.add(fullPath);
  },

  /** Finds all repo directories that match `sourceDir` (root + nested workspaces), respecting exclusions. */
  findSourceRoots(
    repoRoot: string,
    sourceDir: string,
    excluded: string[],
    normalizeRel: (value: string) => string
  ): string[] {
    const found = new Set<string>();
    const segments = sourceDir.split('/').filter((segment) => segment.length > 0);
    const excludedSet = new Set(excluded);
    if (segments.length === 0) return [];

    const walk = (dir: string): void => {
      let entries: fs.Dirent[];
      try {
        entries = fs.readdirSync(dir, { withFileTypes: true });
      } catch {
        return;
      }
      for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        const fullPath = path.join(dir, entry.name);
        if (this.isExcludedDirectory(repoRoot, fullPath, excludedSet, normalizeRel, entry.name))
          continue;
        const maybeSourceRoot = path.join(fullPath, ...segments);
        if (fs.existsSync(maybeSourceRoot) && fs.statSync(maybeSourceRoot).isDirectory()) {
          found.add(maybeSourceRoot);
        }
        walk(fullPath);
      }
    };

    const rootSource = path.join(repoRoot, ...segments);
    if (fs.existsSync(rootSource) && fs.statSync(rootSource).isDirectory()) {
      found.add(rootSource);
    }
    walk(repoRoot);
    return [...found];
  },

  /** Finds directories by basename anywhere in the repo, excluding ignored paths. */
  findDirsByName(
    repoRoot: string,
    names: string[],
    excluded: string[],
    normalizeRel: (value: string) => string
  ): Set<string> {
    const excludedSet = new Set(excluded);
    const namesSet = new Set(names.filter((name) => name.length > 0));
    const found = new Set<string>();
    if (namesSet.size === 0) return found;

    const walk = (dir: string): void => {
      let entries: fs.Dirent[];
      try {
        entries = fs.readdirSync(dir, { withFileTypes: true });
      } catch {
        return;
      }
      for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        const fullPath = path.join(dir, entry.name);
        if (this.isExcludedDirectory(repoRoot, fullPath, excludedSet, normalizeRel, entry.name))
          continue;
        if (namesSet.has(entry.name)) found.add(fullPath);
        walk(fullPath);
      }
    };

    walk(repoRoot);
    return found;
  },
} as const;
