import path from 'node:path';
import { describe, expect, test } from 'vite-plus/test';
import { fsHelpers } from './fs-helpers.js';

describe('fsHelpers.joinRootSafe', () => {
  const root = path.resolve('/tmp/clank-e2e-safe-root');

  test('joins trusted segments under root', () => {
    const out = fsHelpers.joinRootSafe(root, 'a', 'b', 'c.txt');
    expect(out).toBe(path.resolve(root, 'a', 'b', 'c.txt'));
  });

  test('allows result equal to root when no segments', () => {
    expect(fsHelpers.joinRootSafe(root)).toBe(root);
  });

  test('rejects .. segment escape', () => {
    expect(() => fsHelpers.joinRootSafe(root, '..', 'outside')).toThrow(/escapes root/);
  });

  test('rejects embedded .. in one segment', () => {
    expect(() => fsHelpers.joinRootSafe(root, 'x', '..', '..', 'etc')).toThrow(/escapes root/);
  });
});
