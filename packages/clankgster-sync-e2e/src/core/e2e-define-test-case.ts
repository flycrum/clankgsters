import type { ClankgsterConfig } from '../../../clankgster-sync/src/index.js';
import type { TestCaseSeedingPrefabItem } from '../seeding-prefabs/seeding-prefab-orchestration.js';

export interface E2eTestCaseDefinition {
  /** Partial config serialized into the sandbox `clankgster.config.ts`. */
  config: Partial<ClankgsterConfig>;
  /** Short human-readable label for the case (e.g. logs and failure output). */
  description: string;
  /** Path to the expected manifest JSON fixture, relative to this package root. */
  jsonPath: string;
  /** Ordered blueprint/main instances that seed the dynamic sandbox before sync runs. */
  seeding: TestCaseSeedingPrefabItem[];
}

export const e2eTestCase = {
  /** Returns `definition` unchanged so the case stays typed at the export site. */
  define(definition: E2eTestCaseDefinition): E2eTestCaseDefinition {
    return definition;
  },
  /** Returns the input list unchanged while enforcing seeding typing at call sites. */
  defineSeeding(seeding: TestCaseSeedingPrefabItem[]): TestCaseSeedingPrefabItem[] {
    return seeding;
  },
};
