import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, test } from 'vite-plus/test';
import { fileAssertions } from './file-assertions.js';

const tempPaths: string[] = [];

afterEach(() => {
  for (const tempPath of tempPaths) {
    if (fs.existsSync(tempPath)) fs.rmSync(tempPath, { force: true, recursive: true });
  }
  tempPaths.length = 0;
});

describe('fileAssertions', () => {
  test('returns missing files when paths do not exist', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'clank-file-assertions-'));
    tempPaths.push(root);
    const result = fileAssertions.fromManifestEntries(root, ['missing.txt']);
    expect(result.missing).toHaveLength(1);
  });

  test('treats traversal outside outputRoot as missing', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'clank-file-assertions-'));
    tempPaths.push(root);
    fs.writeFileSync(path.join(root, 'ok.txt'), '');
    const result = fileAssertions.fromManifestEntries(root, ['ok.txt', '../outside.txt']);
    expect(result.missing).toEqual(['../outside.txt']);
  });

  test('treats absolute manifest paths outside outputRoot as missing', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'clank-file-assertions-'));
    tempPaths.push(root);
    const outside = path.join(os.tmpdir(), `clank-abs-${Date.now()}.txt`);
    tempPaths.push(outside);
    fs.writeFileSync(outside, '');
    const result = fileAssertions.fromManifestEntries(root, [outside]);
    expect(result.missing).toEqual([outside]);
  });
});
