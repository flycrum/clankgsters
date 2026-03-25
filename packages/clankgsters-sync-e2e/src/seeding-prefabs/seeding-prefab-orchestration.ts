import fs from 'node:fs';
import path from 'node:path';
import { SeedingBlueprintBase } from './seeding-blueprint-base.js';
import { SeedingPrefabBase } from './seeding-prefab-base.js';
import type {
  ResolvedSeedingPrefabsPrepareConfig,
  SeedingPrefabApplyContext,
  SeedingPrefabPrepareOverlayOptions,
  SeedingPrefabsPrepareConfig,
} from './seeding-prefab-orchestration.types.js';

/** Returns deduplicated, trimmed non-empty replace-root paths, or an empty array when absent. */
function normalizeReplaceRoots(replaceRoots: string[] | undefined): string[] {
  if (replaceRoots == null) return [];
  return [...new Set(replaceRoots.map((v) => v.trim()).filter((v) => v.length > 0))];
}

/** Returns whether `value` lies under `root` (relative path does not escape or go absolute). */
function isPathInsideRoot(root: string, value: string): boolean {
  const rel = path.relative(root, value);
  return !(rel.startsWith('..') || path.isAbsolute(rel));
}

/** A seeding blueprint or standalone seeding prefab supplied for a test case. */
export type TestCaseSeedingPrefabItem = SeedingBlueprintBase<any> | SeedingPrefabBase<any>;

/** Flattens seeding items, merges prepare overlays, resolves prepare config, and runs prepare steps in the sandbox. */
export const seedingPrefabOrchestration = {
  /** Applies overlay actions and optional `replaceRoots` scope to every group in a prepare config. */
  applyPrepareOverlay(
    prepareConfig: SeedingPrefabsPrepareConfig,
    overlay: SeedingPrefabPrepareOverlayOptions
  ): SeedingPrefabsPrepareConfig {
    const groupAction = overlay.groupAction ?? 'append';
    const entryAction = overlay.entryAction ?? groupAction;
    return {
      groups: prepareConfig.groups.map((group) => ({
        ...group,
        action: groupAction,
        entries: group.entries.map((entry) => ({ ...entry, action: entryAction })),
        scope: overlay.replaceRoots != null ? { replaceRoots: overlay.replaceRoots } : group.scope,
      })),
    };
  },

  /** Expands blueprints into `{ main, overlay? }` pairs; passes through standalone prefabs without an overlay. */
  flattenSeeding(
    items: TestCaseSeedingPrefabItem[]
  ): Array<{ main: SeedingPrefabBase<any>; overlay?: SeedingPrefabPrepareOverlayOptions }> {
    const out: Array<{
      main: SeedingPrefabBase<any>;
      overlay?: SeedingPrefabPrepareOverlayOptions;
    }> = [];
    for (const item of items) {
      if (item instanceof SeedingBlueprintBase) {
        const overlay = item.getPrepareOverlay();
        for (const main of item.createSeedingPrefabs()) out.push({ main, overlay });
      } else {
        out.push({ main: item });
      }
    }
    return out;
  },

  /** Resolves per-entry actions and replace roots, validates `replace` entries, and returns a normalized prepare config. */
  resolvePrepareConfig(
    prepareConfig: SeedingPrefabsPrepareConfig,
    prepareSource: string
  ): ResolvedSeedingPrefabsPrepareConfig {
    const resolvedGroups: ResolvedSeedingPrefabsPrepareConfig['groups'] = [];
    for (const group of prepareConfig.groups) {
      const resolvedEntries: ResolvedSeedingPrefabsPrepareConfig['groups'][0]['entries'] = [];
      for (const entry of group.entries) {
        const action = entry.action ?? group.action;
        if (action == null)
          throw new Error(
            `${prepareSource}: prepare entry "${entry.id}" in group "${group.id}" is missing an explicit action`
          );
        const replaceRoots = normalizeReplaceRoots(
          entry.scope?.replaceRoots ?? group.scope?.replaceRoots
        );
        if (action === 'replace' && replaceRoots.length === 0) {
          throw new Error(
            `${prepareSource}: replace action requires replaceRoots for entry "${entry.id}" in group "${group.id}"`
          );
        }
        resolvedEntries.push({ action, id: entry.id, replaceRoots, run: entry.run });
      }
      resolvedGroups.push({ entries: resolvedEntries, id: group.id });
    }
    return { groups: resolvedGroups };
  },

  /** For `replace` entries, deletes targets under `sandboxRoot` when safe; then runs each entry’s `run` handler. */
  runResolvedPrepare(
    context: SeedingPrefabApplyContext,
    resolvedPrepare: ResolvedSeedingPrefabsPrepareConfig,
    sandboxRoot: string
  ): void {
    const normalizedSandboxRoot = path.resolve(sandboxRoot);
    for (const group of resolvedPrepare.groups) {
      for (const entry of group.entries) {
        if (entry.action === 'replace') {
          for (const replaceRoot of entry.replaceRoots) {
            const targetPath = path.resolve(normalizedSandboxRoot, replaceRoot);
            if (!isPathInsideRoot(normalizedSandboxRoot, targetPath)) {
              throw new Error(
                `replace root escapes sandbox for entry "${entry.id}" in group "${group.id}": ${replaceRoot}`
              );
            }
            if (fs.existsSync(targetPath)) fs.rmSync(targetPath, { force: true, recursive: true });
          }
        }
        entry.run(context);
      }
    }
  },

  /** Runs the full prepare pipeline for each flattened prefab under that prefab’s sandbox directory. */
  applySeeding(context: SeedingPrefabApplyContext, items: TestCaseSeedingPrefabItem[]): void {
    for (const { main, overlay } of this.flattenSeeding(items)) {
      let prepareConfig = main.prepare(context);
      if (overlay != null) prepareConfig = this.applyPrepareOverlay(prepareConfig, overlay);
      const resolved = this.resolvePrepareConfig(prepareConfig, main.constructor.name);
      this.runResolvedPrepare(
        context,
        resolved,
        path.join(context.caseOutputRoot, main.sandboxDirectoryName)
      );
    }
  },
} as const;
