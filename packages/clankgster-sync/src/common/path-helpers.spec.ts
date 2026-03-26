import fs, { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vite-plus/test';
import { pathHelpers } from './path-helpers.js';

describe('pathHelpers', () => {
  describe('resolveRepoRootFromPackageRoot', () => {
    it('walks up two segments from a workspace package dir (no node_modules)', () => {
      const pkg = path.join('/workspace', 'packages', 'clankgster-sync');
      expect(pathHelpers.resolveRepoRootFromPackageRoot(pkg)).toBe(path.resolve('/workspace'));
    });

    it('resolves consumer project root when the package path is under node_modules', () => {
      const root = mkdtempSync(path.join(tmpdir(), 'clankgster-path-test-'));
      try {
        const consumer = path.join(root, 'consumer');
        mkdirSync(consumer, { recursive: true });
        writeFileSync(path.join(consumer, 'package.json'), '{}');
        const pkgPath = path.join(consumer, 'node_modules', '@clankgster', 'sync');
        mkdirSync(pkgPath, { recursive: true });
        expect(pathHelpers.resolveRepoRootFromPackageRoot(pkgPath)).toBe(consumer);
      } finally {
        rmSync(root, { recursive: true, force: true });
      }
    });
  });

  describe('getRepoRoot', () => {
    it('honors CLANKGSTER_REPO_ROOT when set', () => {
      const previous = process.env.CLANKGSTER_REPO_ROOT;
      try {
        process.env.CLANKGSTER_REPO_ROOT = '/explicit/repo/root';
        expect(pathHelpers.getRepoRoot()).toBe(path.resolve('/explicit/repo/root'));
      } finally {
        if (previous === undefined) delete process.env.CLANKGSTER_REPO_ROOT;
        else process.env.CLANKGSTER_REPO_ROOT = previous;
      }
    });

    it('resolves to this monorepo root when env is unset (from package layout)', () => {
      const previous = process.env.CLANKGSTER_REPO_ROOT;
      try {
        delete process.env.CLANKGSTER_REPO_ROOT;
        const resolved = pathHelpers.getRepoRoot();
        expect(fs.existsSync(path.join(resolved, 'package.json'))).toBe(true);
        expect(
          fs.existsSync(path.join(resolved, 'pnpm-workspace.yaml')) ||
            fs.existsSync(path.join(resolved, 'package.json'))
        ).toBe(true);
      } finally {
        if (previous === undefined) delete process.env.CLANKGSTER_REPO_ROOT;
        else process.env.CLANKGSTER_REPO_ROOT = previous;
      }
    });
  });

  describe('isResolvedPathUnderRoot', () => {
    it('accepts the root itself and nested paths', () => {
      const root = path.resolve('/workspace/repo');
      expect(pathHelpers.isResolvedPathUnderRoot(root, path.join(root, 'CLANK.md'))).toBe(true);
      expect(pathHelpers.isResolvedPathUnderRoot(root, path.join(root, 'docs', 'guide.md'))).toBe(
        true
      );
      expect(pathHelpers.isResolvedPathUnderRoot(root, root)).toBe(true);
    });

    it('rejects paths that escape via .. segments', () => {
      const root = path.resolve('/workspace/repo');
      const outside = path.resolve(root, '..', '..', 'etc', 'passwd');
      expect(pathHelpers.isResolvedPathUnderRoot(root, outside)).toBe(false);
    });

    it('rejects absolute targets outside the root', () => {
      const root = path.resolve('/workspace/repo');
      expect(pathHelpers.isResolvedPathUnderRoot(root, path.resolve('/other/root/file.md'))).toBe(
        false
      );
    });
  });

  describe('isSafeRelativePathSegments', () => {
    it('accepts normal repo-relative dirs', () => {
      expect(pathHelpers.isSafeRelativePathSegments('.cursor/skills')).toBe(true);
      expect(pathHelpers.isSafeRelativePathSegments('foo\\bar')).toBe(true);
    });

    it('rejects absolute and traversal segments', () => {
      expect(pathHelpers.isSafeRelativePathSegments('/abs')).toBe(false);
      expect(pathHelpers.isSafeRelativePathSegments('C:\\\\Users')).toBe(false);
      expect(pathHelpers.isSafeRelativePathSegments('a/../b')).toBe(false);
      expect(pathHelpers.isSafeRelativePathSegments('a/./b')).toBe(false);
      expect(pathHelpers.isSafeRelativePathSegments('')).toBe(false);
    });
  });

  describe('sanitizeToSingleSymlinkSegment', () => {
    it('keeps simple names stable', () => {
      expect(pathHelpers.sanitizeToSingleSymlinkSegment('my-skill')).toBe('my-skill');
    });

    it('collapses scoped or multi-segment names into one basename', () => {
      expect(pathHelpers.sanitizeToSingleSymlinkSegment('@scope/pkg')).toBe('@scope-pkg');
      expect(pathHelpers.sanitizeToSingleSymlinkSegment('a/b')).toBe('a-b');
    });
  });
});
