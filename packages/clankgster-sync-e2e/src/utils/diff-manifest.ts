import type { JsonValue } from 'type-fest';
import type { DiffJsonObjectsReport } from '../common/diff-json-objects.config.js';
import { diffJsonObjectsConfig } from '../common/diff-json-objects.config.js';
import { diffJsonObjects } from '../common/diff-json-objects.js';
import { diffManifestConfig, type ManifestDiffResult } from './diff-manifest.config.js';

export type { ManifestDiffResult };

export const diffManifest = {
  /**
   * Compares expected vs actual sync manifest JSON (parsed values).
   * Fast path: {@link diffJsonObjects.deepEqual}. Otherwise: when either root is not a plain object,
   * applies the POC-style leaf rule via {@link diffJsonObjectsConfig.compareAtDepth} only (no key walk);
   * when both roots are plain objects, uses {@link diffJsonObjects.run} for the full recursive diff.
   */
  compare(baseline: JsonValue, candidate: JsonValue): ManifestDiffResult {
    if (diffJsonObjects.deepEqual(baseline, candidate)) {
      return { changed: false, lines: [] };
    }

    if (
      !diffJsonObjectsConfig.isPlainObject(baseline) ||
      !diffJsonObjectsConfig.isPlainObject(candidate)
    ) {
      const report: DiffJsonObjectsReport = { added: [], removed: [], modified: [] };
      diffJsonObjectsConfig.compareAtDepth(baseline, candidate, '', report, false);
      return diffManifestConfig.finalize(report);
    }

    return diffManifestConfig.finalize(diffJsonObjects.run(baseline, candidate));
  },
};
