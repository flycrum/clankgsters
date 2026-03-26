import type { ClankgsterConfig } from './clankgster-config.schema.js';

export interface ClankgsterConfigResolutionContext {
  /** Current sync run mode (e.g. apply rules vs clear). */
  mode: 'sync' | 'clear';
  /** Absolute path to the repository root being configured. */
  repoRoot: string;
}

export interface ClankgsterConfigSource {
  /** Stable id for this source (logging, merge diagnostics). */
  id: string;
  /** Merge order: lower values load first; compare with `clankgsterConfigSource.comparePriority`. */
  priority: number;
  /** Returns partial config for the repo, sync or async; `null`/`undefined` layers are skipped. */
  load: (
    context: ClankgsterConfigResolutionContext
  ) => Promise<Partial<ClankgsterConfig> | null> | Partial<ClankgsterConfig> | null;
}

export const clankgsterConfigSource = {
  /** Comparator for sorting sources: lower `priority` values order first (`a.priority - b.priority`). */
  comparePriority(a: ClankgsterConfigSource, b: ClankgsterConfigSource): number {
    return a.priority - b.priority;
  },
};
