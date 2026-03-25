import type { ClankgstersConfig } from '../../clankgsters-sync/config/index.js';
import type { PrefabBase, PrefabPresetBase } from './prefabs/prefabs.js';

/** Supported seeding item types for one test case. */
export type PrefabLike = PrefabBase<any> | PrefabPresetBase<any>;

export interface E2eTestCaseDefinition {
  /** Partial config serialized into the sandbox `clankgsters.config.ts`. */
  config: Partial<ClankgstersConfig>;
  /** Short human-readable label for the case (e.g. logs and failure output). */
  description: string;
  /** Path to the expected manifest JSON fixture, relative to this package root. */
  jsonPath: string;
  /** Ordered prefab/preset instances that seed the dynamic sandbox before sync runs. */
  seeding: PrefabLike[];
}

export const e2eTestCase = {
  /** Returns `definition` unchanged so the case stays typed at the export site. */
  define(definition: E2eTestCaseDefinition): E2eTestCaseDefinition {
    return definition;
  },
  /** Returns the input list unchanged while enforcing prefab/preset union typing at call sites. */
  definePrefabs(prefabs: PrefabLike[]): PrefabLike[] {
    return prefabs;
  },
};
