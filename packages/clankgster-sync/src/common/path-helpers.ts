/**
 * Path utilities for Clankgster sync scripts: resolves the **consumer repo root** from this
 * module’s location (so `pnpm -F` / package `cwd` does not mis-resolve), with an explicit env
 * override for sandboxes, linked installs, and the published CLI bin.
 *
 * Same resolution idea as other sync CLIs: explicit `CLANKGSTER_REPO_ROOT` plus package-root walk.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const _scriptDir = path.dirname(fileURLToPath(import.meta.url));

/** True when `dir` looks like a repository root (marker files used by the POC and here). */
function hasRepoRootMarker(dir: string): boolean {
  return (
    fs.existsSync(path.join(dir, 'package.json')) ||
    fs.existsSync(path.join(dir, 'pnpm-workspace.yaml')) ||
    fs.existsSync(path.join(dir, 'lerna.json'))
  );
}

/** Namespaced path helpers for sync runtime; prefer `getRepoRoot()` for repo-relative work. */
export const pathHelpers = {
  /** Directory of this module (`src/common`). */
  get scriptDir(): string {
    return _scriptDir;
  },

  /** Root of the `@clankgster/sync` package (the folder named like the published package). */
  get packageRoot(): string {
    return path.resolve(_scriptDir, '..', '..');
  },

  /**
   * Absolute path to the repository root that should hold `clankgster.config.ts` and `.clank/`.
   *
   * **Resolution order**
   * 1. `CLANKGSTER_REPO_ROOT` when set — used by e2e tests/sandboxes, `pnpm link`, and the `clankgster-sync` bin so the **invocation directory** is the target project (not the symlink source under `node_modules`).
   * 2. Otherwise {@link pathHelpers.resolveRepoRootFromPackageRoot} from {@link pathHelpers.packageRoot} so `pnpm -F @clankgster/sync run …` (where `cwd` is the package dir) still resolves to the monorepo root.
   *
   * **Not** `process.cwd()` alone — that breaks filtered workspace scripts because `cwd` is the package directory.
   */
  getRepoRoot(): string {
    const envRoot = process.env.CLANKGSTER_REPO_ROOT;
    if (typeof envRoot === 'string' && envRoot.length > 0) return path.resolve(envRoot);
    return this.resolveRepoRootFromPackageRoot(this.packageRoot);
  },

  /**
   * Resolves repo root from the `@clankgster/sync` package directory.
   *
   * - **Workspace / dev:** `packageRoot` is `.../packages/clankgster-sync` → walks up to the monorepo root (two levels) when not under `node_modules`.
   * - **Published install:** path contains `node_modules` → takes the segment before the first `node_modules`, then walks up until a marker is found.
   *
   * Exposed for tests and advanced callers; normal code should use `getRepoRoot()`.
   *
   * @param packageRoot - Absolute path to the `@clankgster/sync` package root (the folder that contains `package.json` for this package).
   * @returns Absolute path to the consumer or monorepo root.
   */
  resolveRepoRootFromPackageRoot(packageRoot: string): string {
    const normalized = packageRoot.replace(/\\/g, '/');
    if (normalized.includes('/node_modules/')) {
      const parts = normalized.split('/node_modules/');
      const candidate = path.resolve(parts[0]!);
      if (hasRepoRootMarker(candidate)) return candidate;
      let dir = candidate;
      for (;;) {
        const parent = path.dirname(dir);
        if (parent === dir) break;
        dir = parent;
        if (hasRepoRootMarker(dir)) return dir;
      }
      return candidate;
    }
    return path.resolve(packageRoot, '..', '..');
  },

  /** Joins path segments under a root and normalizes to an absolute path. */
  joinRepo(repoRoot: string, ...segments: string[]): string {
    return path.resolve(repoRoot, ...segments);
  },

  /** Normalizes slash style and trims duplicate separators for path comparisons. */
  normalizePathForCompare(targetPath: string): string {
    return targetPath.replace(/\\/g, '/').replace(/\/+/g, '/').replace(/\/$/g, '');
  },

  /**
   * True when `resolvedTarget` is the output root or a path under it (both arguments should already be passed through `path.resolve`).
   * Rejects `..` traversal and absolute `path.relative` results (e.g. different drive roots on Windows)
   */
  isResolvedPathUnderRoot(outputRoot: string, resolvedTarget: string): boolean {
    const root = path.resolve(outputRoot);
    const target = path.resolve(resolvedTarget);
    const rel = path.relative(root, target);
    if (rel.startsWith('..') || path.isAbsolute(rel)) return false;
    return target === root || target.startsWith(root + path.sep);
  },

  /**
   * True when `rel` is non-empty, not absolute on POSIX or Windows, and has no `.` / `..` path segments.
   * Use before joining config strings such as `nativeSkillsDir` under an output root.
   */
  isSafeRelativePathSegments(rel: string): boolean {
    if (typeof rel !== 'string' || rel.length === 0) return false;
    if (path.posix.isAbsolute(rel)) return false;
    if (path.win32.isAbsolute(rel)) return false;
    const segments = rel.split(/[/\\]+/).filter((s) => s.length > 0);
    if (segments.length === 0) return false;
    for (const seg of segments) {
      if (seg === '..' || seg === '.') return false;
    }
    return true;
  },

  /**
   * One symlink basename under an output root: collapses `@scope/pkg`-style names and separators,
   * strips traversal segments, and restricts to a conservative character set.
   */
  sanitizeToSingleSymlinkSegment(raw: string): string {
    const trimmed = raw.trim();
    if (trimmed.length === 0) return 'unnamed-skill';
    const parts = trimmed
      .replace(/\\/g, '/')
      .split('/')
      .map((p) => p.replaceAll('..', '_'))
      .filter((p) => p.length > 0 && p !== '.' && p !== '..');
    const collapsed = parts.length > 0 ? parts.join('-') : 'unnamed-skill';
    const base = path.posix.basename(collapsed);
    const slug = base
      .replaceAll('..', '_')
      .replace(/[^a-zA-Z0-9._@-]+/g, '-')
      .replace(/^[-.]+|[-.]+$/g, '');
    return slug.length > 0 ? slug : 'unnamed-skill';
  },
};
