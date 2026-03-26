import path from 'node:path';
import { syncFs } from '../../common/sync-fs.js';
import type { SyncBehaviorRunContext } from '../sync-behaviors/sync-behavior-base.js';
import { syncContentPipeline } from './sync-content-pipeline.js';

/** File-by-file sync helper for copy/symlink artifact modes. */
export const syncFileSyncConfig = {
  /** Returns true when a file path should be processed via markdown transforms. */
  isMarkdownLikeFile(filePath: string): boolean {
    return /\.(md|mdc|markdown)$/i.test(filePath);
  },

  /** Applies configured read-only mode to a copied output file when enabled. */
  applyReadOnlyIfEnabled(context: SyncBehaviorRunContext, targetPath: string): void {
    if (!context.resolvedConfig.syncOutputReadOnly) return;
    syncFs.markFileReadOnly(targetPath);
  },

  /** Writes one output file using the active artifact mode and markdown transform pipeline when applicable. */
  syncFile(options: {
    context: SyncBehaviorRunContext;
    destinationPath: string;
    pluginName?: string;
    sourceKind: 'command' | 'markdownContextFile' | 'plugin' | 'rule' | 'skill' | 'unknown';
    sourcePath: string;
  }): void {
    const sourcePath = options.sourcePath;
    const destinationPath = options.destinationPath;
    const context = options.context;
    if (context.artifactMode === 'symlink') {
      syncFs.symlinkRelative(sourcePath, destinationPath);
      return;
    }
    if (this.isMarkdownLikeFile(sourcePath)) {
      const contents = syncFs.readFileUtf8(sourcePath);
      const transformed = syncContentPipeline.process({
        artifactMode: context.artifactMode,
        contents,
        globalContext: {
          agentName: context.agentName,
          behaviorName: context.behaviorConfig.behaviorName,
          destinationFileAbsolutePath: path.resolve(destinationPath),
          destinationFileRelativePath: path
            .relative(context.outputRoot, destinationPath)
            .replace(/\\/g, '/'),
          outputRoot: context.outputRoot,
          pluginName: options.pluginName,
          repoRoot: context.repoRoot,
          resolvedConfig: context.resolvedConfig,
          sourceFileAbsolutePath: path.resolve(sourcePath),
          sourceFileRelativePath: path.relative(context.repoRoot, sourcePath).replace(/\\/g, '/'),
          sourceKind: options.sourceKind,
          syncTimestampIso: new Date().toISOString(),
        },
      });
      syncFs.writeFileUtf8(destinationPath, transformed);
      this.applyReadOnlyIfEnabled(context, destinationPath);
      return;
    }
    syncFs.copyFile(sourcePath, destinationPath);
    this.applyReadOnlyIfEnabled(context, destinationPath);
  },
};
