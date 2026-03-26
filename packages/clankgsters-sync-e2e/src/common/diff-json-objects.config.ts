import type { JsonObject, JsonValue } from 'type-fest';

/** Result of {@link diffJsonObjectsConfig.compareAtDepth}: path lists in dot/bracket notation (e.g. `a.b[0].c`). */
export type DiffJsonObjectsReport = {
  /** Keys or subtree roots present only on the right value. */
  added: string[];
  /** Keys or subtree roots present only on the left value. */
  removed: string[];
  /** Paths where both sides exist but values differ (or length mismatch for arrays). */
  modified: string[];
};

/** Options for {@link diffJsonObjects.run}. */
export type DiffJsonObjectsRunOptions = {
  /** When true, only compare keys (added/removed); never report modified or recurse into value differences. */
  structureOnly?: boolean;
};

/**
 * Recursive JSON diff helpers: plain-object detection, deep equality (key-order insensitive for objects;
 * primitive-only arrays order-insensitive), and depth-first comparison that fills a report.
 */
export const diffJsonObjectsConfig = {
  /** True for plain data objects (`Object.prototype`), excluding arrays, null, and class instances. */
  isPlainObject(value: JsonValue): value is JsonObject {
    return (
      typeof value === 'object' &&
      value !== null &&
      !Array.isArray(value) &&
      Object.getPrototypeOf(value) === Object.prototype
    );
  },

  /** True for JSON primitives and null (not an object, or null). */
  isPrimitive(value: JsonValue): boolean {
    return value === null || typeof value !== 'object';
  },

  /** Structural equality: object key order ignored; arrays order-sensitive unless all elements are primitives (then compared as sorted multisets). */
  deepEqual(left: JsonValue, right: JsonValue): boolean {
    if (Object.is(left, right)) return true;
    if (left === null || right === null) return false;
    if (typeof left !== typeof right) return false;
    if (typeof left !== 'object') return left === right;

    if (Array.isArray(left) && Array.isArray(right)) {
      if (left.length !== right.length) return false;
      const leftPrim = left.every((item) => this.isPrimitive(item));
      const rightPrim = right.every((item) => this.isPrimitive(item));
      if (leftPrim && rightPrim) {
        const sortKey = (v: JsonValue) => JSON.stringify(v);
        const sortedLeft = [...left].sort((a, b) => sortKey(a).localeCompare(sortKey(b), 'en'));
        const sortedRight = [...right].sort((a, b) => sortKey(a).localeCompare(sortKey(b), 'en'));
        return sortedLeft.every((_, i) => sortedLeft[i] === sortedRight[i]);
      }
      return left.every((_, i) => this.deepEqual(left[i] as JsonValue, right[i] as JsonValue));
    }
    if (Array.isArray(left) || Array.isArray(right)) return false;

    if (!this.isPlainObject(left) || !this.isPlainObject(right)) return false;
    const leftKeys = Object.keys(left).sort();
    const rightKeys = Object.keys(right).sort();
    if (leftKeys.length !== rightKeys.length) return false;
    if (leftKeys.some((k, i) => k !== rightKeys[i])) return false;
    return leftKeys.every((k) => this.deepEqual(left[k] as JsonValue, right[k] as JsonValue));
  },

  /** Builds a dotted path segment; empty prefix yields `segment` alone. */
  joinPath(prefix: string, segment: string): string {
    return prefix ? `${prefix}.${segment}` : segment;
  },

  /**
   * Walks two JSON values in lockstep, appending to `report`. Non-object pair at this depth uses value equality only (POC-style early exit); does not recurse under solely-added or solely-removed keys.
   */
  compareAtDepth(
    left: JsonValue,
    right: JsonValue,
    pathPrefix: string,
    report: DiffJsonObjectsReport,
    structureOnly: boolean
  ): void {
    if (!this.isPlainObject(left) || !this.isPlainObject(right)) {
      if (!structureOnly && !this.deepEqual(left, right)) report.modified.push(pathPrefix);
      return;
    }

    const leftKeys = Object.keys(left).sort();
    const rightKeys = Object.keys(right).sort();
    const allKeys = [...new Set([...leftKeys, ...rightKeys])].sort();

    for (const key of allKeys) {
      const path = this.joinPath(pathPrefix, key);
      const inLeft = Object.prototype.hasOwnProperty.call(left, key);
      const inRight = Object.prototype.hasOwnProperty.call(right, key);

      if (!inLeft && inRight) {
        report.added.push(path);
        continue;
      }
      if (inLeft && !inRight) {
        report.removed.push(path);
        continue;
      }

      const leftVal = left[key] as JsonValue;
      const rightVal = right[key] as JsonValue;

      if (!structureOnly && this.deepEqual(leftVal, rightVal)) continue;

      if (this.isPlainObject(leftVal) && this.isPlainObject(rightVal)) {
        this.compareAtDepth(leftVal, rightVal, path, report, structureOnly);
        continue;
      }

      if (Array.isArray(leftVal) && Array.isArray(rightVal)) {
        if (leftVal.length !== rightVal.length) {
          if (!structureOnly) report.modified.push(path);
          continue;
        }
        for (let i = 0; i < leftVal.length; i++) {
          const elPath = `${path}[${i}]`;
          if (!structureOnly && this.deepEqual(leftVal[i] as JsonValue, rightVal[i] as JsonValue))
            continue;
          if (
            this.isPlainObject(leftVal[i] as JsonValue) &&
            this.isPlainObject(rightVal[i] as JsonValue)
          ) {
            this.compareAtDepth(
              leftVal[i] as JsonValue,
              rightVal[i] as JsonValue,
              elPath,
              report,
              structureOnly
            );
          } else if (!structureOnly) {
            report.modified.push(elPath);
          }
        }
        continue;
      }

      if (!structureOnly) report.modified.push(path);
    }
  },
};
