import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, test } from 'vite-plus/test';
import { fileStructureFixture } from './file-structure-fixture.js';

const tempPaths: string[] = [];

afterEach(() => {
  for (const tempPath of tempPaths) {
    if (fs.existsSync(tempPath)) fs.rmSync(tempPath, { force: true, recursive: true });
  }
  tempPaths.length = 0;
});

describe('fileStructureFixture', () => {
  test('buildSnapshot returns deterministic entries with hashes', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'clank-file-structure-'));
    tempPaths.push(root);
    fs.mkdirSync(path.join(root, 'alpha'));
    fs.writeFileSync(path.join(root, 'alpha', 'a.txt'), 'hello', 'utf8');
    const fixture = fileStructureFixture.buildSnapshot(root);

    expect(fixture.version).toBe(1);
    expect(fixture.entries.map((entry) => entry.path)).toEqual(['alpha', 'alpha/a.txt']);
    expect(fixture.entries[1]?.hash?.startsWith('sha256:')).toBe(true);
  });

  test('compare returns missing, extra, and modified buckets', () => {
    const expected = {
      entries: [
        { kind: 'dir' as const, path: 'alpha' },
        { hash: 'sha256:old', kind: 'file' as const, path: 'alpha/a.txt' },
      ],
      version: 1 as const,
    };
    const actual = {
      entries: [
        { kind: 'dir' as const, path: 'alpha' },
        { hash: 'sha256:new', kind: 'file' as const, path: 'alpha/a.txt' },
        { kind: 'dir' as const, path: 'beta' },
      ],
      version: 1 as const,
    };

    const result = fileStructureFixture.compare(expected, actual);

    expect(result.changed).toBe(true);
    expect(result.extra).toEqual(['beta']);
    expect(result.missing).toEqual([]);
    expect(result.modified).toHaveLength(1);
    expect(result.modified[0]?.reasons).toEqual(['hash']);
  });

  test('compare reports symlinkTarget mismatch', () => {
    const expected = {
      entries: [{ kind: 'symlink' as const, path: 'link', symlinkTarget: 'a' }],
      version: 1 as const,
    };
    const actual = {
      entries: [{ kind: 'symlink' as const, path: 'link', symlinkTarget: 'b' }],
      version: 1 as const,
    };

    const result = fileStructureFixture.compare(expected, actual);

    expect(result.changed).toBe(true);
    expect(result.modified).toHaveLength(1);
    expect(result.modified[0]?.reasons).toEqual(['symlinkTarget']);
  });

  test('buildSnapshot records symlink and does not traverse through it', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'clank-file-structure-'));
    tempPaths.push(root);
    fs.mkdirSync(path.join(root, 't'));
    fs.writeFileSync(path.join(root, 't', 'inner.txt'), 'x', 'utf8');
    try {
      fs.symlinkSync('t/inner.txt', path.join(root, 'alias.txt'), 'file');
    } catch {
      return;
    }

    const fixture = fileStructureFixture.buildSnapshot(root);
    const paths = fixture.entries.map((entry) => entry.path);

    expect(paths).toContain('alias.txt');
    expect(paths).toContain('t/inner.txt');
    expect(paths.some((p) => p.startsWith('alias.txt/'))).toBe(false);
    const link = fixture.entries.find((entry) => entry.path === 'alias.txt');
    expect(link?.kind).toBe('symlink');
    expect(link?.symlinkTarget).toBe('t/inner.txt');
  });
});
