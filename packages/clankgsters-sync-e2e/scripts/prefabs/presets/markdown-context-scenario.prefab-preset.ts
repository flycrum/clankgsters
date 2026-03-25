import { clankgstersConfigDefaults } from '../../../../clankgsters-sync/config/index.js';
import { MarkdownContextFileNamePrefab } from '../markdown-context-file-name.prefab.js';
import type { PrefabExecutable } from '../prefab-types.js';
import { PrefabPresetBase } from './prefab-preset-base.js';

export type MarkdownScenarioMode =
  | 'root-only'
  | 'nested-only-1'
  | 'root-and-nested-1'
  | 'root-and-multi-nested';

export interface MarkdownContextScenarioPresetOptions {
  fileContentsByPath?: Record<string, string>;
  markdownContextFileName?: string;
  scenarioMode?: MarkdownScenarioMode;
}

/** Creates markdown context files for common root/nested topology scenarios. */
export class MarkdownContextScenarioPreset extends PrefabPresetBase<MarkdownContextScenarioPresetOptions> {
  protected override createPrefabs(): PrefabExecutable[] {
    const fileName =
      this.options.markdownContextFileName ??
      clankgstersConfigDefaults.CONSTANTS.sourceDefaults.markdownContextFileName;
    const mode = this.options.scenarioMode ?? 'root-and-nested-1';
    const nestedParentSets: string[][] =
      mode === 'root-only'
        ? []
        : mode === 'nested-only-1'
          ? [['packages', 'app']]
          : mode === 'root-and-nested-1'
            ? [['packages', 'app']]
            : [
                ['packages', 'app'],
                ['packages', 'app', 'nested', 'deep'],
              ];
    const includeRoot =
      mode === 'root-only' || mode === 'root-and-nested-1' || mode === 'root-and-multi-nested';

    const prefabs: PrefabExecutable[] = [];
    if (includeRoot) {
      prefabs.push(
        new MarkdownContextFileNamePrefab(this.sandboxDirectoryName, {
          fileContents: this.options.fileContentsByPath?.['/'] ?? '# root context\n',
          fileName,
          parentPaths: [],
        })
      );
    }
    for (const parentPaths of nestedParentSets) {
      prefabs.push(
        new MarkdownContextFileNamePrefab(this.sandboxDirectoryName, {
          fileContents:
            this.options.fileContentsByPath?.[`/${parentPaths.join('/')}`] ??
            `# nested context ${parentPaths.join('/')}\n`,
          fileName,
          parentPaths,
        })
      );
    }
    return prefabs;
  }
}
