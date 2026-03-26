import type { JsonValue } from 'type-fest';
import { describe, expect, test } from 'vite-plus/test';
import { diffJsonObjectsConfig } from './diff-json-objects.config.js';
import { diffJsonObjects } from './diff-json-objects.js';

describe('diffJsonObjects (facade)', () => {
  test('run matches compareAtDepth with empty pathPrefix on a fresh report', () => {
    const left: JsonValue = { claude: { a: 1 } };
    const right: JsonValue = { claude: { a: 2 } };
    const fromRun = diffJsonObjects.run(left, right);
    const report = { added: [] as string[], removed: [] as string[], modified: [] as string[] };
    diffJsonObjectsConfig.compareAtDepth(left, right, '', report, false);
    expect(fromRun).toEqual(report);
  });

  test('run forwards structureOnly to compareAtDepth', () => {
    const left: JsonValue = { a: true };
    const right: JsonValue = { a: { nested: 1 } };
    const fromRun = diffJsonObjects.run(left, right, { structureOnly: true });
    const report = { added: [] as string[], removed: [] as string[], modified: [] as string[] };
    diffJsonObjectsConfig.compareAtDepth(left, right, '', report, true);
    expect(fromRun).toEqual(report);
  });

  test('deepEqual delegates to config implementation', () => {
    const a: JsonValue = { x: 1, y: { z: 2 } };
    const b: JsonValue = { y: { z: 2 }, x: 1 };
    expect(diffJsonObjects.deepEqual(a, b)).toBe(diffJsonObjectsConfig.deepEqual(a, b));
  });
});
