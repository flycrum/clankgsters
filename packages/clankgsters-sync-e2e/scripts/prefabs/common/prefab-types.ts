/** Execution context passed to each prefab/preset while seeding one test case sandbox. */
export interface PrefabApplyContext {
  /** 1-based case index in alphabetical run order. */
  caseIndex: number;
  /** Absolute root directory for one case result folder (e.g. `.e2e-tests.run-results/case-1-basic`). */
  caseOutputRoot: string;
  /** Case name from the test file stem (e.g. `basic`). */
  caseName: string;
  /** Absolute package root for `@clankgsters/sync-e2e`. */
  packageRoot: string;
  /** Absolute monorepo root used for `pnpm clankgsters-sync:*` commands. */
  repoRoot: string;
}

/** Prefab and preset classes both implement this execution contract. */
export interface PrefabExecutable {
  /** Materializes files/directories for one case using the provided context. */
  apply(context: PrefabApplyContext): void;
}
