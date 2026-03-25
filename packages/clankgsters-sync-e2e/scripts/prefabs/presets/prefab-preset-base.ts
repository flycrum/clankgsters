import type { PrefabApplyContext, PrefabExecutable } from '../prefab-types.js';

/** Base class for presets that expand into one or more prefab instances. */
export abstract class PrefabPresetBase<
  TOptions extends object = Record<string, never>,
> implements PrefabExecutable {
  constructor(
    protected readonly sandboxDirectoryName: string,
    protected readonly options: TOptions
  ) {}

  /** Returns prefab instances to execute sequentially for this preset. */
  protected abstract createPrefabs(): PrefabExecutable[];

  apply(context: PrefabApplyContext): void {
    for (const prefab of this.createPrefabs()) {
      prefab.apply(context);
    }
  }
}
