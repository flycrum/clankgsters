import { ok, type Result } from 'neverthrow';
import path from 'node:path';
import { z } from 'zod';
import { syncFs } from '../../../common/sync-fs.js';
import { syncManifest } from '../../run/sync-manifest.js';
import { syncFileSyncConfig } from '../../sync-transforms/sync-file-sync.config.js';
import { SyncBehaviorBase, type SyncBehaviorRunContext } from '../sync-behavior-base.js';

function isExcluded(relPath: string, excluded: string[]): boolean {
  if (excluded.includes(relPath)) return true;
  return excluded.some((prefix) => relPath === prefix || relPath.startsWith(`${prefix}/`));
}

function listSourceDirsWithContextFile(
  repoRoot: string,
  sourceFilename: string,
  excluded: string[]
): string[] {
  const found: string[] = [];
  const walk = (dir: string): void => {
    const relDir = path.relative(repoRoot, dir).replace(/\\/g, '/');
    if (relDir.length > 0 && isExcluded(relDir, excluded)) return;
    const entries = syncFs.readdirWithTypes(dir);
    if (entries.some((entry) => entry.isFile && entry.name === sourceFilename)) {
      found.push(dir);
    }
    for (const entry of entries) {
      if (!entry.isDirectory) continue;
      walk(path.join(dir, entry.name));
    }
  };
  walk(repoRoot);
  return found;
}

const markdownSymlinkSyncPresetOptionsSchema = z.looseObject({
  gitignoreComment: z.string().nullable().optional(),
  gitignoreEntry: z.string().nullable().optional(),
  sourceFile: z.string().min(1).optional(),
  targetFile: z.string().min(1).optional(),
});

/** Typed options for `MarkdownContextSyncPreset`. */
export interface MarkdownContextSyncPresetOptions {
  /** Source markdown filename used as source in each discovered directory. */
  sourceFile?: string;
  /** Target markdown filename created as the output in each discovered directory. */
  targetFile?: string;
  /** Optional comment block inserted ahead of gitignore entry updates. */
  gitignoreComment?: string | null;
  /** Optional gitignore entry to add for generated symlink outputs. */
  gitignoreEntry?: string | null;
}

/** Creates/removes markdown context outputs from root context files into agent-native context filenames. */
export class MarkdownContextSyncPreset extends SyncBehaviorBase {
  override syncRun(context: SyncBehaviorRunContext): Result<void, Error> {
    if (context.mode === 'clear') {
      if (context.manifestEntry != null)
        syncManifest.teardownEntry(context.outputRoot, context.manifestEntry);
      return ok(undefined);
    }
    if (context.behaviorConfig.enabled === false) {
      if (context.manifestEntry != null)
        syncManifest.teardownEntry(context.outputRoot, context.manifestEntry);
      return ok(undefined);
    }

    if (context.manifestEntry != null)
      syncManifest.teardownEntry(context.outputRoot, context.manifestEntry);
    const markdownContextFileName = context.resolvedConfig.sourceDefaults.markdownContextFileName;
    const parsed = markdownSymlinkSyncPresetOptionsSchema.safeParse(context.behaviorConfig.options);
    const defaultTargetFile = context.agentsCommonValues.markdownContextFileName ?? 'AGENTS.md';
    const rawOptions = parsed.success ? parsed.data : {};
    const optionsFallbacks = {
      ...rawOptions,
      sourceFile: rawOptions.sourceFile ?? markdownContextFileName,
      targetFile: rawOptions.targetFile ?? defaultTargetFile,
    };
    const sourceFilename = optionsFallbacks.sourceFile;
    const targetFilename = optionsFallbacks.targetFile;
    const dirs = listSourceDirsWithContextFile(
      context.outputRoot,
      sourceFilename,
      context.excluded
    );
    const symlinks: string[] = [];
    const copies: string[] = [];
    for (const dir of dirs) {
      const sourcePath = path.join(dir, sourceFilename);
      const targetPath = path.join(dir, targetFilename);
      syncFileSyncConfig.syncFile({
        context,
        destinationPath: targetPath,
        sourceKind: 'markdownContextFile',
        sourcePath,
      });
      const targetRel = path.relative(context.outputRoot, targetPath).replace(/\\/g, '/');
      if (context.artifactMode === 'symlink') symlinks.push(targetRel);
      else copies.push(targetRel);
    }

    context.registerManifestEntry(context.agentName, context.behaviorConfig.behaviorName, {
      copies,
      options: optionsFallbacks,
      symlinks,
    });
    return ok(undefined);
  }
}
