import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

export type FileStructureEntryKind = 'dir' | 'file';

/** Controls whether file-size metadata is compared in diffs. Keep `false` for now. */
const ENABLE_META_SIZE_COMPARISON = false;

/** Paths (POSIX, relative to snapshot root) whose bytes change every run — omit `hash` and skip hash diffs. */
const UNSTABLE_FILE_HASH_PATHS = new Set(['.clank/logs/clankgsters-sync.log']);

/**
 * Optional filesystem metadata captured for one fixture entry
 * @example
 * `{ mode: 16877 }`
 */
export interface FileStructureEntryMeta {
  /** POSIX stat mode number for permission/type bits (example: `33188` for a regular file). */
  mode?: number;
  // /** File size in bytes (example: `42`). Disabled for now to avoid size-based diffs. */
  // size?: number;
}

/**
 * One file-system entry captured in a fixture snapshot
 * @example
 * `{ kind: 'file', path: 'packages/app/README.md', hash: 'sha256:abc123', meta: { mode: 33188 } }`
 */
export interface FileStructureFixtureEntry {
  /** SHA-256 digest for file contents (present for `kind: 'file'`, omitted for directories). */
  hash?: string;
  /** Entry kind: directory or file. */
  kind: FileStructureEntryKind;
  /** Optional metadata captured from `fs.statSync`. */
  meta?: FileStructureEntryMeta;
  /** POSIX-style relative path from snapshot root (example: `packages/app`). */
  path: string;
}

/**
 * Snapshot document for a full directory tree
 * @example
 * `{ version: 1, entries: [{ kind: 'dir', path: 'packages' }] }`
 */
export interface FileStructureFixture {
  /** Sorted list of captured file and directory entries under the snapshot root. */
  entries: FileStructureFixtureEntry[];
  /** Schema version for fixture compatibility checks. */
  version: 1;
}

/**
 * One changed entry reported by fixture comparison
 * @example
 * `{ path: 'README.md', reasons: ['hash'], expected: {...}, actual: {...} }`
 */
export interface FileStructureDiffModifiedEntry {
  /** Expected entry from the baseline fixture. */
  expected: FileStructureFixtureEntry;
  /** Relative path key for this diff row. */
  path: string;
  /** Machine-readable change reasons (e.g. `kind`, `hash`, `meta.mode`). */
  reasons: string[];
  /** Actual entry from the new snapshot when present. */
  actual?: FileStructureFixtureEntry;
}

/**
 * Aggregate result of comparing two fixture snapshots
 * @example
 * `{ changed: true, missing: ['a.txt'], extra: [], modified: [] }`
 */
export interface FileStructureDiffResult {
  /** True when any missing, extra, or modified entries are detected. */
  changed: boolean;
  /** Paths found only in the actual snapshot. */
  extra: string[];
  /** Paths found only in the expected snapshot. */
  missing: string[];
  /** Entries present in both snapshots but differing by one or more reasons. */
  modified: FileStructureDiffModifiedEntry[];
}

/**
 * Converts an absolute/relative path under `root` into a stable POSIX-style relative path
 * @example
 * `toPosixRelativePath('/repo', '/repo/packages/app') // 'packages/app'`
 */
function toPosixRelativePath(root: string, value: string): string {
  return path.relative(root, value).split(path.sep).join('/');
}

/**
 * Computes a deterministic SHA-256 fingerprint for file bytes
 * @example
 * `createHash(Buffer.from('hello')) // 'sha256:2cf24dba5...'`
 */
function createHash(contents: Buffer): string {
  return `sha256:${crypto.createHash('sha256').update(contents).digest('hex')}`;
}

/**
 * Compares optional metadata and returns machine-readable mismatch reasons
 * @example
 * `compareMeta({ mode: 33188 }, { mode: 33261 }) // ['meta.mode']`
 */
function compareMeta(
  expectedMeta: FileStructureEntryMeta | undefined,
  actualMeta: FileStructureEntryMeta | undefined
): string[] {
  if (expectedMeta == null || actualMeta == null) return [];
  const reasons: string[] = [];
  // Keep this block for a future re-enable of size-based comparisons.
  // if (
  //   ENABLE_META_SIZE_COMPARISON &&
  //   expectedMeta.size != null &&
  //   actualMeta.size != null &&
  //   expectedMeta.size !== actualMeta.size
  // ) {
  //   reasons.push('meta.size');
  // }
  if (ENABLE_META_SIZE_COMPARISON) {
    // Intentionally no-op while size metadata remains disabled.
  }
  if (expectedMeta.mode != null && actualMeta.mode != null && expectedMeta.mode !== actualMeta.mode)
    reasons.push('meta.mode');
  return reasons;
}

export const fileStructureFixture = {
  /**
   * Walks a directory tree and builds a stable fixture snapshot of files and directories
   * @example
   * `fileStructureFixture.buildSnapshot('/tmp/sandbox') // { version: 1, entries: [...] }`
   */
  buildSnapshot(root: string): FileStructureFixture {
    const normalizedRoot = path.resolve(root);
    const entries: FileStructureFixtureEntry[] = [];
    const queue = ['.'];

    while (queue.length > 0) {
      const relativePath = queue.shift();
      if (relativePath == null) break;
      const absolutePath =
        relativePath === '.' ? normalizedRoot : path.join(normalizedRoot, relativePath);
      const stat = fs.statSync(absolutePath);
      if (relativePath !== '.') {
        if (stat.isDirectory()) {
          entries.push({
            kind: 'dir',
            meta: {
              mode: stat.mode,
              // size: stat.size, // Disabled for now: avoid fixture churn on size metadata.
            },
            path: relativePath.split(path.sep).join('/'),
          });
        } else if (stat.isFile()) {
          const posixPath = relativePath.split(path.sep).join('/');
          const entry: FileStructureFixtureEntry = {
            kind: 'file',
            meta: {
              mode: stat.mode,
              // size: stat.size, // Disabled for now: avoid fixture churn on size metadata.
            },
            path: posixPath,
          };
          if (!UNSTABLE_FILE_HASH_PATHS.has(posixPath)) {
            entry.hash = createHash(fs.readFileSync(absolutePath));
          }
          entries.push(entry);
        }
      }
      if (!stat.isDirectory()) continue;
      const children = fs
        .readdirSync(absolutePath)
        .sort((left, right) => left.localeCompare(right));
      for (const child of children) {
        const childAbsolutePath = path.join(absolutePath, child);
        queue.push(toPosixRelativePath(normalizedRoot, childAbsolutePath));
      }
    }

    entries.sort((left, right) => left.path.localeCompare(right.path));
    return {
      entries,
      version: 1,
    };
  },

  /**
   * Compares expected vs actual snapshots and reports missing, extra, and modified entries
   * @example
   * `fileStructureFixture.compare(expected, actual) // { changed: true, missing: [], extra: [], modified: [...] }`
   */
  compare(
    expectedFixture: FileStructureFixture,
    actualFixture: FileStructureFixture
  ): FileStructureDiffResult {
    const expectedByPath = new Map(
      expectedFixture.entries.map((entry) => [entry.path, entry] as const)
    );
    const actualByPath = new Map(
      actualFixture.entries.map((entry) => [entry.path, entry] as const)
    );

    const missing = [...expectedByPath.keys()].filter((entryPath) => !actualByPath.has(entryPath));
    const extra = [...actualByPath.keys()].filter((entryPath) => !expectedByPath.has(entryPath));
    const modified: FileStructureDiffModifiedEntry[] = [];

    for (const [entryPath, expectedEntry] of expectedByPath) {
      const actualEntry = actualByPath.get(entryPath);
      if (actualEntry == null) continue;
      const reasons: string[] = [];
      if (expectedEntry.kind !== actualEntry.kind) reasons.push('kind');
      if (
        expectedEntry.kind === 'file' &&
        actualEntry.kind === 'file' &&
        !UNSTABLE_FILE_HASH_PATHS.has(entryPath) &&
        expectedEntry.hash != null &&
        actualEntry.hash != null &&
        expectedEntry.hash !== actualEntry.hash
      ) {
        reasons.push('hash');
      }
      reasons.push(...compareMeta(expectedEntry.meta, actualEntry.meta));
      if (reasons.length > 0) {
        modified.push({
          actual: actualEntry,
          expected: expectedEntry,
          path: entryPath,
          reasons,
        });
      }
    }

    missing.sort((left, right) => left.localeCompare(right));
    extra.sort((left, right) => left.localeCompare(right));
    modified.sort((left, right) => left.path.localeCompare(right.path));

    return {
      changed: missing.length > 0 || extra.length > 0 || modified.length > 0,
      extra,
      missing,
      modified,
    };
  },
};
