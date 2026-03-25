import { clankgstersConfigDefaults } from '../../../../clankgsters-sync/src/index.js';
import { MarkdownContextFileNameSeedingPrefab } from '../prefabs/markdown-context-file-name-seeding-prefab.js';
import { SeedingBlueprintBase } from '../seeding-blueprint-base.js';

/** Which markdown context files to create: root only, nested only, both, or multiple nested paths. */
export type MarkdownScenarioMode =
  | 'root-only'
  | 'nested-only-1'
  | 'root-and-nested-1'
  | 'root-and-multi-nested';

export interface MarkdownContextScenarioSeedingBlueprintOptions {
  /** Optional map of path key (`/` = root, `/packages/app` = nested) to file body; defaults to generated headings. */
  fileContentsByPath?: Record<string, string>;
  /** Overrides the markdown context filename (defaults to `sourceDefaults.markdownContextFileName`). */
  markdownContextFileName?: string;
  /** Controls root vs nested markdown context placement (default `root-and-nested-1`). */
  scenarioMode?: MarkdownScenarioMode;
}

/**
 * When to use: Your test needs markdown context files at the sandbox root, under a nested path like `packages/app`, or both—without wiring each `MarkdownContextFileNameSeedingPrefab` by hand.
 * Strategic: seeds markdown context files where symlink/markdown discovery tests need specific root and nested topologies.
 * Keeps scenario logic in one place so cases only pass mode and optional overrides.
 */
export class MarkdownContextScenarioSeedingBlueprint extends SeedingBlueprintBase<MarkdownContextScenarioSeedingBlueprintOptions> {
  /**
   * Tactical: emits one `MarkdownContextFileNameSeedingPrefab` per selected root/nested location from mode and optional per-path contents.
   * Desired outcome: files like `sandbox/.clank/CLAUDE.md` and `sandbox/packages/app/.clank/CLAUDE.md` exist with scenario-specific markdown bodies.
   */
  override createSeedingPrefabs() {
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
    const prefabs = [];
    if (includeRoot)
      prefabs.push(
        new MarkdownContextFileNameSeedingPrefab(this.sandboxDirectoryName, {
          fileContents: this.options.fileContentsByPath?.['/'] ?? '# root context\n',
          fileName,
          parentPaths: [],
        })
      );
    for (const parentPaths of nestedParentSets) {
      prefabs.push(
        new MarkdownContextFileNameSeedingPrefab(this.sandboxDirectoryName, {
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
