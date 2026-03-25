import { describe, expect, test } from 'vite-plus/test';
import { diffManifest } from './diff-manifest.js';

describe('diffManifest', () => {
  test('returns unchanged when objects match', () => {
    const result = diffManifest.compare({ a: 1 }, { a: 1 });
    expect(result.changed).toBe(false);
  });

  test('returns changed when objects differ', () => {
    const result = diffManifest.compare({ a: 1 }, { a: 2 });
    expect(result.changed).toBe(true);
  });
});
