import type { DiffJsonObjectsReport } from '../common/diff-json-objects.config.js';

/** Outcome of {@link diffManifest.compare}: whether the two manifest JSON values differ and human-readable lines for the harness. */
export interface ManifestDiffResult {
  /** True when any path was added, removed, or modified. */
  changed: boolean;
  /** Empty when unchanged; otherwise a headline line plus indented path lines (`+` / `-` / `~`). */
  lines: string[];
}

/** Helpers that turn a {@link DiffJsonObjectsReport} into harness log lines. */
export const diffManifestConfig = {
  /** Maps an empty diff path (root non-object mismatch) to a readable label. */
  formatPathForMessage(path: string): string {
    return path.length > 0 ? path : '(root)';
  },

  /** Builds CLI-style lines from a non-empty report; returns `[]` when the report has no differences. */
  reportToLines(report: DiffJsonObjectsReport): string[] {
    if (report.added.length === 0 && report.removed.length === 0 && report.modified.length === 0) {
      return [];
    }
    return [
      '- expected manifest does not match actual manifest',
      ...report.added.map((p) => `  + ${this.formatPathForMessage(p)}`),
      ...report.removed.map((p) => `  - ${this.formatPathForMessage(p)}`),
      ...report.modified.map((p) => `  ~ ${this.formatPathForMessage(p)}`),
    ];
  },

  /** Sets `changed` from report cardinality and attaches {@link diffManifestConfig.reportToLines}. */
  finalize(report: DiffJsonObjectsReport): ManifestDiffResult {
    const changed = report.added.length + report.removed.length + report.modified.length > 0;
    return { changed, lines: this.reportToLines(report) };
  },
};
