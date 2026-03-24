import { ok, type Result } from 'neverthrow';
import path from 'node:path';
import { syncFs } from '../../../common/sync-fs.js';
import { agentPresetConfigs } from '../../agents/agent-presets/agent-preset-configs.js';
import { syncManifest } from '../../run/sync-manifest.js';
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

/** Creates/removes symlinks from root context files into agent-native context filenames. */
export class MarkdownContextSymlinkSyncPreset extends SyncBehaviorBase {
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
    const presetConfig = agentPresetConfigs.resolve(context.agentName);
    const markdownContextFileName = context.resolvedConfig.sourceDefaults.markdownContextFileName;
    const sourceFilename = markdownContextFileName;
    const targetFilename = presetConfig.CONSTANTS.MARKDOWN_CONTEXT_TARGET_FILE_NAME;
    const options = {
      sourceFile: markdownContextFileName,
      targetFile: presetConfig.CONSTANTS.MARKDOWN_CONTEXT_TARGET_FILE_NAME,
      ...(presetConfig.CONSTANTS.GITIGNORE_COMMENT == null
        ? {}
        : { gitignoreComment: presetConfig.CONSTANTS.GITIGNORE_COMMENT }),
      ...(presetConfig.CONSTANTS.GITIGNORE_ENTRY == null
        ? {}
        : { gitignoreEntry: presetConfig.CONSTANTS.GITIGNORE_ENTRY }),
      ...(context.behaviorConfig.options as Record<string, unknown>),
    };
    const dirs = listSourceDirsWithContextFile(
      context.outputRoot,
      sourceFilename,
      context.excluded
    );
    const symlinks: string[] = [];
    for (const dir of dirs) {
      const sourcePath = path.join(dir, sourceFilename);
      const targetPath = path.join(dir, targetFilename);
      syncFs.symlinkRelative(sourcePath, targetPath);
      symlinks.push(path.relative(context.outputRoot, targetPath).replace(/\\/g, '/'));
    }

    context.registerManifestEntry(context.agentName, context.behaviorConfig.behaviorName, {
      options,
      symlinks,
    });
    return ok(undefined);
  }
}
