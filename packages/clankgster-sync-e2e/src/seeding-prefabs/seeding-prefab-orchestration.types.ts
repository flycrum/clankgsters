/** Execution context passed to each seeding prefab while preparing one test case sandbox. */
export interface SeedingPrefabApplyContext {
  caseIndex: number;
  caseOutputRoot: string;
  caseName: string;
  packageRoot: string;
  repoRoot: string;
}

export type SeedingPrefabPrepareAction = 'append' | 'replace';

export interface SeedingPrefabPrepareScope {
  replaceRoots?: string[];
}

export interface SeedingPrefabPrepareEntry {
  action?: SeedingPrefabPrepareAction;
  id: string;
  run: (context: SeedingPrefabApplyContext) => void;
  scope?: SeedingPrefabPrepareScope;
}

export interface SeedingPrefabPrepareGroup {
  action?: SeedingPrefabPrepareAction;
  entries: SeedingPrefabPrepareEntry[];
  id: string;
  scope?: SeedingPrefabPrepareScope;
}

export interface SeedingPrefabsPrepareConfig {
  groups: SeedingPrefabPrepareGroup[];
}

export interface ResolvedSeedingPrefabPrepareEntry {
  action: SeedingPrefabPrepareAction;
  id: string;
  replaceRoots: string[];
  run: (context: SeedingPrefabApplyContext) => void;
}

export interface ResolvedSeedingPrefabPrepareGroup {
  entries: ResolvedSeedingPrefabPrepareEntry[];
  id: string;
}

export interface ResolvedSeedingPrefabsPrepareConfig {
  groups: ResolvedSeedingPrefabPrepareGroup[];
}

export interface SeedingPrefabPrepareOverlayOptions {
  entryAction?: SeedingPrefabPrepareAction;
  groupAction?: SeedingPrefabPrepareAction;
  replaceRoots?: string[];
}
