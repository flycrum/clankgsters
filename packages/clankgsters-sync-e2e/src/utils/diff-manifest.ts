export interface ManifestDiffResult {
  changed: boolean;
  lines: string[];
}

function normalize(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

export const diffManifest = {
  /** Compares pretty-printed JSON snapshots of `expected` and `actual` and reports a mismatch in `lines` when they differ. */
  compare(expected: unknown, actual: unknown): ManifestDiffResult {
    const expectedValue = normalize(expected);
    const actualValue = normalize(actual);
    if (expectedValue === actualValue) {
      return {
        changed: false,
        lines: [],
      };
    }
    return {
      changed: true,
      lines: ['- expected manifest does not match actual manifest'],
    };
  },
};
