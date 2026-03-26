import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Types and the `fileStructureFixtureConfig` object for e2e directory-tree snapshots: capture flags, unstable paths,
 * hashing, and metadata comparison. Snapshot/compare behavior lives on {@link fileStructureFixture} in `file-structure-fixture.ts`.
 */

/** Discriminant for a row in a file-structure fixture (`dir` has no `hash`; `file` may; `symlink` carries `symlinkTarget`). */
export type FileStructureEntryKind = 'dir' | 'file' | 'symlink';

/**
 * Optional fields copied from `fs.Stats` when {@link fileStructureFixtureConfig.enableModeComparison} or
 * {@link fileStructureFixtureConfig.enableSizeComparison} is true.
 */
export interface FileStructureEntryMeta {
  /**
   * Raw `stat.mode` (Node.js): permission and file-type bits as reported by the host OS.
   * @remarks Only populated when `enableModeComparison` is true; omitting it keeps fixtures portable across platforms.
   */
  mode?: number;
  /**
   * `stat.size` in bytes for the path (files and directories both have a size from `stat`).
   * @remarks Only populated when `enableSizeComparison` is true.
   */
  size?: number;
}

/**
 * One node in the walked tree: path, kind, optional content hash for files, optional symlink target, optional stat-backed `meta`.
 */
export interface FileStructureFixtureEntry {
  /** Present for `kind: 'file'` when the path is not in {@link fileStructureFixtureConfig.unstableFileHashPaths}; `sha256:<hex>`. */
  hash?: string;
  kind: FileStructureEntryKind;
  /** Present only when at least one of `enableModeComparison` / `enableSizeComparison` is true and the field is captured. */
  meta?: FileStructureEntryMeta;
  /** POSIX-style path relative to the snapshot root (forward slashes), stable across Windows/macOS/Linux. */
  path: string;
  /**
   * For `kind: 'symlink'`: `readlinkSync` result normalized by {@link fileStructureFixtureConfig.normalizeSymlinkTarget} (not resolved through the link). Omitted for `dir` / `file`.
   */
  symlinkTarget?: string;
}

/**
 * Serialized snapshot of a directory tree: sorted `entries` plus a fixed `version` for future schema evolution.
 */
export interface FileStructureFixture {
  /** The list of entries in the fixture. */
  entries: FileStructureFixtureEntry[];
  /** Increment when the JSON shape changes in a breaking way. */
  version: 1;
}

/**
 * One path that exists in both expected and actual fixtures but differs: carries full rows and machine-readable `reasons`.
 */
export interface FileStructureDiffModifiedEntry {
  /** Row from the actual `buildSnapshot` result for this `path`. */
  actual?: FileStructureFixtureEntry;
  /** Row from the committed baseline JSON. */
  expected: FileStructureFixtureEntry;
  /** Same `path` key used to join expected and actual rows. */
  path: string;
  /** Subset of `kind`, `hash`, `symlinkTarget`, `meta.mode`, `meta.size` depending on what {@link fileStructureFixture.compare} detected. */
  reasons: string[];
}

/** Aggregate diff from {@link fileStructureFixture.compare}: missing, extra, and modified paths with reasons. */
export interface FileStructureDiffResult {
  /** True when any of `missing`, `extra`, or `modified` is non-empty. */
  changed: boolean;
  /** Paths that appear only in the actual snapshot (unexpected additions). */
  extra: string[];
  /** Paths that appear only in the expected snapshot (deletions or failed writes). */
  missing: string[];
  /** Paths present in both snapshots where `kind`, `hash`, `symlinkTarget`, or compared `meta` fields disagree. */
  modified: FileStructureDiffModifiedEntry[];
}

/**
 * Single runtime surface for file-structure fixture options and helpers (see typescript-single-export-object plugin rule).
 * Toggle capture/compare of `stat` fields here; {@link fileStructureFixture} implements the walk and diff orchestration.
 */
export const fileStructureFixtureConfig = {
  /**
   * Relative POSIX paths (from snapshot root) whose file contents are intentionally non-deterministic between runs.
   * @remarks Matched rows omit `hash` in `buildSnapshot` and skip byte comparison so log files do not fail e2e.
   */
  unstableFileHashPaths: new Set<string>(['.clank/logs/clankgster-sync.log']),

  /**
   * When `true`, each snapshot entry includes `meta.mode` and {@link fileStructureFixture.compare} reports `meta.mode` mismatches.
   * @default false — avoids flaky diffs across OS, umask, and git `core.filemode`.
   */
  enableModeComparison: false,

  /**
   * When `true`, each snapshot entry includes `meta.size` and {@link fileStructureFixture.compare} reports `meta.size` mismatches.
   * @default false — default e2e contract is path, kind, and content hash only.
   */
  enableSizeComparison: false,

  /**
   * @param root - Absolute snapshot root passed to `buildSnapshot`.
   * @param value - Absolute path under `root` (typically a child file or directory).
   * @returns `path.relative` normalized to `/` separators for fixture keys and JSON stability.
   */
  toPosixRelativePath(root: string, value: string): string {
    return path.relative(root, value).split(path.sep).join('/');
  },

  /** Normalizes `readlinkSync` text to `/` separators for stable `symlinkTarget` in fixture JSON. */
  normalizeSymlinkTarget(raw: string): string {
    return raw.split(path.sep).join('/');
  },

  /**
   * @param contents - Raw file bytes read from disk.
   * @returns Lowercase hex SHA-256 prefixed with `sha256:` to match fixture JSON.
   */
  createHash(contents: Buffer): string {
    return `sha256:${crypto.createHash('sha256').update(contents).digest('hex')}`;
  },

  /**
   * Compares optional `meta` blobs when both sides define `meta`; respects {@link fileStructureFixtureConfig.enableModeComparison}
   * and {@link fileStructureFixtureConfig.enableSizeComparison}.
   * @returns Reason strings appended to diff rows (e.g. `meta.mode`); empty if either side has no `meta` or all enabled checks match.
   * @example With `enableModeComparison` true and both arguments carrying `mode`, differing values yield `['meta.mode']`.
   */
  compareMeta(
    expectedMeta: FileStructureEntryMeta | undefined,
    actualMeta: FileStructureEntryMeta | undefined
  ): string[] {
    if (expectedMeta == null || actualMeta == null) return [];
    const reasons: string[] = [];
    if (
      this.enableSizeComparison &&
      expectedMeta.size != null &&
      actualMeta.size != null &&
      expectedMeta.size !== actualMeta.size
    ) {
      reasons.push('meta.size');
    }
    if (
      this.enableModeComparison &&
      expectedMeta.mode != null &&
      actualMeta.mode != null &&
      expectedMeta.mode !== actualMeta.mode
    ) {
      reasons.push('meta.mode');
    }
    return reasons;
  },

  /**
   * @param stat - Result of `fs.lstatSync` / `statSync` for the entry path.
   * @returns A `meta` object if any capture flag is on; otherwise `undefined` so JSON rows stay free of empty `meta`.
   */
  metaFromStat(stat: fs.Stats): FileStructureEntryMeta | undefined {
    const meta: FileStructureEntryMeta = {};
    if (this.enableModeComparison) meta.mode = stat.mode;
    if (this.enableSizeComparison) meta.size = stat.size;
    return Object.keys(meta).length > 0 ? meta : undefined;
  },
};
