import fs from 'node:fs';
import path from 'node:path';
import {
  fileStructureFixtureConfig,
  type FileStructureDiffModifiedEntry,
  type FileStructureDiffResult,
  type FileStructureFixture,
  type FileStructureFixtureEntry,
} from './file-structure-fixture.config.js';

export type {
  FileStructureDiffModifiedEntry,
  FileStructureDiffResult,
  FileStructureEntryKind,
  FileStructureEntryMeta,
  FileStructureFixture,
  FileStructureFixtureEntry,
} from './file-structure-fixture.config.js';

/**
 * Walks a tree and diffs JSON snapshots for e2e; behavior is configured by {@link fileStructureFixtureConfig}
 * (unstable paths, optional `stat` capture, hashing helpers).
 */
export const fileStructureFixture = {
  /**
   * Walks a directory tree with `fs.lstatSync` (symlinks are `kind: 'symlink'`, not followed) and builds a stable snapshot.
   * @param root - Absolute path to the directory root (typically the case sandbox).
   * @returns Sorted `entries` with optional `hash` per file, `symlinkTarget` per symlink, optional `meta` when config flags allow.
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
      const lstat = fs.lstatSync(absolutePath);
      if (relativePath !== '.') {
        const posixPath = relativePath.split(path.sep).join('/');
        if (lstat.isSymbolicLink()) {
          const rawTarget = fs.readlinkSync(absolutePath, { encoding: 'utf8' });
          const entry: FileStructureFixtureEntry = {
            kind: 'symlink',
            path: posixPath,
            symlinkTarget: fileStructureFixtureConfig.normalizeSymlinkTarget(rawTarget),
          };
          const meta = fileStructureFixtureConfig.metaFromStat(lstat);
          if (meta != null) entry.meta = meta;
          entries.push(entry);
        } else if (lstat.isDirectory()) {
          const entry: FileStructureFixtureEntry = {
            kind: 'dir',
            path: posixPath,
          };
          const meta = fileStructureFixtureConfig.metaFromStat(lstat);
          if (meta != null) entry.meta = meta;
          entries.push(entry);
        } else if (lstat.isFile()) {
          const entry: FileStructureFixtureEntry = {
            kind: 'file',
            path: posixPath,
          };
          const meta = fileStructureFixtureConfig.metaFromStat(lstat);
          if (meta != null) entry.meta = meta;
          if (!fileStructureFixtureConfig.unstableFileHashPaths.has(posixPath)) {
            entry.hash = fileStructureFixtureConfig.createHash(fs.readFileSync(absolutePath));
          }
          entries.push(entry);
        }
      }
      if (!lstat.isDirectory()) continue;
      const children = fs
        .readdirSync(absolutePath)
        .sort((left, right) => left.localeCompare(right));
      for (const child of children) {
        const childAbsolutePath = path.join(absolutePath, child);
        queue.push(
          fileStructureFixtureConfig.toPosixRelativePath(normalizedRoot, childAbsolutePath)
        );
      }
    }

    entries.sort((left, right) => left.path.localeCompare(right.path));
    return {
      entries,
      version: 1,
    };
  },

  /**
   * Compares expected vs actual snapshots and reports missing, extra, and modified entries.
   * @param expectedFixture - Committed baseline (e.g. `case-file-structure.json`).
   * @param actualFixture - Output of {@link fileStructureFixture.buildSnapshot}.
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
        !fileStructureFixtureConfig.unstableFileHashPaths.has(entryPath) &&
        expectedEntry.hash != null &&
        actualEntry.hash != null &&
        expectedEntry.hash !== actualEntry.hash
      ) {
        reasons.push('hash');
      }
      if (
        expectedEntry.kind === 'symlink' &&
        actualEntry.kind === 'symlink' &&
        (expectedEntry.symlinkTarget ?? '') !== (actualEntry.symlinkTarget ?? '')
      ) {
        reasons.push('symlinkTarget');
      }
      reasons.push(...fileStructureFixtureConfig.compareMeta(expectedEntry.meta, actualEntry.meta));
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
