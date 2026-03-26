import { describe, expect, test } from 'vite-plus/test';
import type { JsonValue } from 'type-fest';
import { diffManifest } from './diff-manifest.js';

describe('diffManifest.compare', () => {
  test('returns unchanged when objects match', () => {
    const result = diffManifest.compare({ a: 1 }, { a: 1 });
    expect(result.changed).toBe(false);
    expect(result.lines).toEqual([]);
  });

  test('returns unchanged when keys differ only in order', () => {
    const left: JsonValue = { a: 1, b: { x: true, y: false } };
    const right: JsonValue = { b: { y: false, x: true }, a: 1 };
    const result = diffManifest.compare(left, right);
    expect(result.changed).toBe(false);
    expect(result.lines).toEqual([]);
  });

  test('returns changed when values differ', () => {
    const result = diffManifest.compare({ a: 1 }, { a: 2 });
    expect(result.changed).toBe(true);
    expect(result.lines[0]).toBe('- expected manifest does not match actual manifest');
    expect(result.lines.some((l) => l.includes('a'))).toBe(true);
  });

  test('includes path detail lines when structure differs', () => {
    const left: JsonValue = { claude: {} };
    const right: JsonValue = { claude: {}, cursor: {} };
    const result = diffManifest.compare(left, right);
    expect(result.changed).toBe(true);
    expect(result.lines).toContain('  + cursor');
  });

  test('formats empty path as (root) when roots are non-objects that differ', () => {
    const result = diffManifest.compare(1, 2);
    expect(result.changed).toBe(true);
    expect(result.lines.some((l) => l.includes('(root)'))).toBe(true);
  });
});
