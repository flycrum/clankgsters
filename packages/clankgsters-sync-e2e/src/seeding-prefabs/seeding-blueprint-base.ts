import { SeedingPrefabBase } from './seeding-prefab-base.js';
import type { SeedingPrefabPrepareOverlayOptions } from './seeding-prefab-orchestration.types.js';

export abstract class SeedingBlueprintBase<TOptions extends object = Record<string, never>> {
  constructor(
    public readonly sandboxDirectoryName: string,
    public readonly options: TOptions
  ) {}

  abstract createSeedingPrefabs(): SeedingPrefabBase<object>[];

  getPrepareOverlay(): SeedingPrefabPrepareOverlayOptions | undefined {
    return undefined;
  }
}
