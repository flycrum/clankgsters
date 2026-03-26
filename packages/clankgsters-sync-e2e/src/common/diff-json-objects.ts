import type { JsonValue } from 'type-fest';
import {
  diffJsonObjectsConfig,
  type DiffJsonObjectsReport,
  type DiffJsonObjectsRunOptions,
} from './diff-json-objects.config.js';

/** Semantic diff for JSON-serializable values: object key order ignored; array order significant unless all primitives (then set-like). */
export const diffJsonObjects = {
  /** Delegates to {@link diffJsonObjectsConfig.deepEqual}. */
  deepEqual(left: JsonValue, right: JsonValue): boolean {
    return diffJsonObjectsConfig.deepEqual(left, right);
  },

  /** Runs a full recursive diff from the root, filling {@link DiffJsonObjectsReport} via {@link diffJsonObjectsConfig.compareAtDepth}. */
  run(
    left: JsonValue,
    right: JsonValue,
    options?: DiffJsonObjectsRunOptions
  ): DiffJsonObjectsReport {
    const structureOnly = options?.structureOnly ?? false;
    const report: DiffJsonObjectsReport = { added: [], removed: [], modified: [] };
    diffJsonObjectsConfig.compareAtDepth(left, right, '', report, structureOnly);
    return report;
  },
};
