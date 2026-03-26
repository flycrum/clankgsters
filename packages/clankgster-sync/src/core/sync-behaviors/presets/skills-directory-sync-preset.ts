import { err, ok, type Result } from 'neverthrow';
import path from 'node:path';
import { z } from 'zod';
import { pathHelpers } from '../../../common/path-helpers.js';
import { syncFs } from '../../../common/sync-fs.js';
import { syncManifest } from '../../run/sync-manifest.js';
import { syncSourceLayouts, type SyncSourceLayoutKey } from '../../run/sync-source-layouts.js';
import { syncFileSyncConfig } from '../../sync-transforms/sync-file-sync.config.js';
import { SyncBehaviorBase, type SyncBehaviorRunContext } from '../sync-behavior-base.js';

interface SkillsLayoutCustomData {
  copies: string[];
  symlinks: string[];
}

function createSkillsCustomData(): Record<SyncSourceLayoutKey, SkillsLayoutCustomData> {
  return {
    nestedRegular: { symlinks: [], copies: [] },
    nestedLocal: { symlinks: [], copies: [] },
    shorthandRegular: { symlinks: [], copies: [] },
    shorthandLocal: { symlinks: [], copies: [] },
  };
}

const skillsDirectorySyncPresetOptionsSchema = z.looseObject({
  nativeSkillsDir: z
    .string()
    .min(1)
    .optional()
    .refine((s) => s === undefined || pathHelpers.isSafeRelativePathSegments(s), {
      message:
        'nativeSkillsDir must be a relative path without absolute prefixes, drive letters, or . / .. segments',
    }),
  skillsDirectorySyncEnabled: z.boolean().optional(),
});

/** Typed options for `SkillsDirectorySyncPreset`. */
export interface SkillsDirectorySyncPresetOptions {
  /** Agent-native skills output directory where skill outputs are written. */
  nativeSkillsDir?: string;
  /** Controls whether the behavior writes outputs (`true`) or emits empty manifest entries (`false`). */
  skillsDirectorySyncEnabled?: boolean;
}

/**
 * Syncs skills into agent-native skill directories:
 * - Flat layouts under `.clank/skills*` (and shorthand siblings) — folder name = sanitized leaf
 * - Each discovered marketplace plugin’s `skills/<name>/` (with a skill marker file) — output name `{plugin.name}-{name}` to avoid collisions
 *
 * **Duplicate outputs:** walk order is `syncSourceLayouts.SYNC_SOURCE_LAYOUT_KEYS`, then flat skills roots for that layout, then marketplace plugin skills. The first source to claim a given `targetRel` wins; a second source for the same path returns `Err` (sanitized names can collide across plugins or layouts)
 */
export class SkillsDirectorySyncPreset extends SyncBehaviorBase {
  override syncRun(context: SyncBehaviorRunContext): Result<void, Error> {
    if (context.manifestEntry != null)
      syncManifest.teardownEntry(context.outputRoot, context.manifestEntry);

    const parsed = skillsDirectorySyncPresetOptionsSchema.safeParse(context.behaviorConfig.options);
    if (!parsed.success) {
      return err(
        new Error(`skillsDirectorySync: invalid behavior options\n${parsed.error.message}`)
      );
    }

    const optionsFallbacks = {
      nativeSkillsDir: `.${context.agentName}/skills`,
      skillsDirectorySyncEnabled: true,
      ...parsed.data,
    };
    const nativeSkillsDirRel = optionsFallbacks.nativeSkillsDir;
    if (context.mode === 'clear' || context.behaviorConfig.enabled === false) return ok(undefined);

    if (!optionsFallbacks.skillsDirectorySyncEnabled) {
      context.registerManifestEntry(context.agentName, context.behaviorConfig.behaviorName, {
        copies: [],
        options: optionsFallbacks,
        symlinks: [],
        customData: createSkillsCustomData(),
      });
      return ok(undefined);
    }

    const outputRootResolved = path.resolve(context.outputRoot);
    const skillsRootResolved = path.resolve(outputRootResolved, nativeSkillsDirRel);
    if (!pathHelpers.isResolvedPathUnderRoot(outputRootResolved, skillsRootResolved)) {
      return err(
        new Error(
          `skillsDirectorySync: nativeSkillsDir resolves outside outputRoot (${JSON.stringify(nativeSkillsDirRel)})`
        )
      );
    }

    const sourceLayoutPaths = syncSourceLayouts.discoverSourceLayoutPaths({
      excluded: context.excluded,
      repoRoot: context.repoRoot,
      sourceDefaults: context.resolvedConfig.sourceDefaults,
    });
    const customData = createSkillsCustomData();
    const symlinks = new Set<string>();
    const copies = new Set<string>();
    /** Repo-relative symlink path → first skill source dir that claimed it (duplicate detection before write). */
    const seenTargets = new Map<string, string>();
    const skillFileName = context.resolvedConfig.sourceDefaults.skillFileName;
    for (const layout of syncSourceLayouts.SYNC_SOURCE_LAYOUT_KEYS) {
      for (const sourceSkillsPath of sourceLayoutPaths.skillsByLayout[layout]) {
        const sourceEntries = syncFs
          .readdirWithTypes(sourceSkillsPath)
          .filter((entry) => entry.isDirectory || entry.isSymbolicLink);
        for (const entry of sourceEntries) {
          const skillDir = path.join(sourceSkillsPath, entry.name);
          const markerFile = path.join(skillDir, skillFileName);
          if (!syncFs.isFile(markerFile)) continue;
          const leaf = pathHelpers.sanitizeToSingleSymlinkSegment(entry.name);
          const targetPath = path.join(outputRootResolved, nativeSkillsDirRel, leaf);
          const targetResolved = path.resolve(targetPath);
          if (!pathHelpers.isResolvedPathUnderRoot(outputRootResolved, targetResolved)) continue;
          const targetRel = path.relative(context.outputRoot, targetPath).replace(/\\/g, '/');
          const firstSource = seenTargets.get(targetRel);
          if (firstSource !== undefined) {
            return err(
              new Error(
                `skillsDirectorySync: duplicate skill symlink target ${JSON.stringify(targetRel)} for source ${JSON.stringify(skillDir)} (already claimed by ${JSON.stringify(firstSource)})`
              )
            );
          }
          seenTargets.set(targetRel, skillDir);
          if (context.artifactMode === 'symlink') {
            syncFs.symlinkRelative(skillDir, targetPath);
            symlinks.add(targetRel);
            customData[layout].symlinks.push(targetRel);
          } else {
            syncFs.ensureDir(targetPath);
            for (const relFile of syncFs.walkFilePathsRecursive(skillDir)) {
              const sourceFilePath = path.join(skillDir, relFile);
              const destinationFilePath = path.join(targetPath, relFile);
              syncFileSyncConfig.syncFile({
                context,
                destinationPath: destinationFilePath,
                sourceKind: 'skill',
                sourcePath: sourceFilePath,
              });
              const fileRel = path
                .relative(context.outputRoot, destinationFilePath)
                .replace(/\\/g, '/');
              copies.add(fileRel);
              customData[layout].copies.push(fileRel);
            }
          }
        }
      }

      for (const marketplace of context.discoveredMarketplaces) {
        if (marketplace.layout !== layout) continue;
        for (const plugin of marketplace.plugins) {
          if (plugin.manifests[context.agentName] !== true) continue;
          const pluginSkillsDir = path.join(plugin.path, 'skills');
          const sourceEntries = syncFs
            .readdirWithTypes(pluginSkillsDir)
            .filter((entry) => entry.isDirectory || entry.isSymbolicLink);
          for (const entry of sourceEntries) {
            const skillDir = path.join(pluginSkillsDir, entry.name);
            const markerFile = path.join(skillDir, skillFileName);
            if (!syncFs.isFile(markerFile)) continue;
            const skillTargetName = `${pathHelpers.sanitizeToSingleSymlinkSegment(plugin.name)}-${pathHelpers.sanitizeToSingleSymlinkSegment(entry.name)}`;
            const targetPath = path.join(outputRootResolved, nativeSkillsDirRel, skillTargetName);
            const targetResolved = path.resolve(targetPath);
            if (!pathHelpers.isResolvedPathUnderRoot(outputRootResolved, targetResolved)) continue;
            const targetRel = path.relative(context.outputRoot, targetPath).replace(/\\/g, '/');
            const firstSource = seenTargets.get(targetRel);
            if (firstSource !== undefined) {
              return err(
                new Error(
                  `skillsDirectorySync: duplicate skill symlink target ${JSON.stringify(targetRel)} for source ${JSON.stringify(skillDir)} (already claimed by ${JSON.stringify(firstSource)})`
                )
              );
            }
            seenTargets.set(targetRel, skillDir);
            if (context.artifactMode === 'symlink') {
              syncFs.symlinkRelative(skillDir, targetPath);
              symlinks.add(targetRel);
              customData[layout].symlinks.push(targetRel);
            } else {
              syncFs.ensureDir(targetPath);
              for (const relFile of syncFs.walkFilePathsRecursive(skillDir)) {
                const sourceFilePath = path.join(skillDir, relFile);
                const destinationFilePath = path.join(targetPath, relFile);
                syncFileSyncConfig.syncFile({
                  context,
                  destinationPath: destinationFilePath,
                  pluginName: plugin.name,
                  sourceKind: 'skill',
                  sourcePath: sourceFilePath,
                });
                const fileRel = path
                  .relative(context.outputRoot, destinationFilePath)
                  .replace(/\\/g, '/');
                copies.add(fileRel);
                customData[layout].copies.push(fileRel);
              }
            }
          }
        }
      }

      customData[layout].symlinks.sort();
      customData[layout].copies.sort();
    }

    context.registerManifestEntry(context.agentName, context.behaviorConfig.behaviorName, {
      copies: [...copies].sort(),
      options: optionsFallbacks,
      symlinks: [...symlinks].sort(),
      customData,
    });
    return ok(undefined);
  }
}
