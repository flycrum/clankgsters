import { ok, type Result } from 'neverthrow';
import fs from 'node:fs';
import path from 'node:path';
import { z } from 'zod';
import { syncFs } from '../../../common/sync-fs.js';
import { syncManifest } from '../../run/sync-manifest.js';
import type { SyncSourceLayoutKey } from '../../run/sync-source-layouts.js';
import { SyncBehaviorBase, type SyncBehaviorRunContext } from '../sync-behavior-base.js';

interface PluginsDirectoryLayoutEntry {
  fsAutoRemoval: string[];
  symlinks: string[];
}

function emptyLayoutEntry(): PluginsDirectoryLayoutEntry {
  return { symlinks: [], fsAutoRemoval: [] };
}

function createPluginsDirectoryCustomData(): Record<
  SyncSourceLayoutKey,
  PluginsDirectoryLayoutEntry
> {
  return {
    nestedRegular: emptyLayoutEntry(),
    nestedLocal: emptyLayoutEntry(),
    shorthandRegular: emptyLayoutEntry(),
    shorthandLocal: emptyLayoutEntry(),
  };
}

const pluginsDirectorySyncPresetOptionsSchema = z.looseObject({
  rulesMarkdownFrontmatter: z.string().nullable().optional(),
  targetRoot: z.string().min(1).optional(),
});

/** Typed options for `PluginsDirectorySyncPreset`. */
export interface PluginsDirectorySyncPresetOptions {
  /** Root output directory where mirrored plugin content should be written. */
  targetRoot?: string;
  /** Optional frontmatter prepended when writing converted `.mdc` rules files. */
  rulesMarkdownFrontmatter?: string | null;
}

/** Syncs plugin **commands** and **rules** into agent-local content roots (e.g. `.cursor/commands`, `.cursor/rules`). Plugin **skills** are mirrored by `SkillsDirectorySyncPreset`. */
export class PluginsDirectorySyncPreset extends SyncBehaviorBase {
  private isExcluded(relPath: string, excluded: string[]): boolean {
    return excluded.includes(relPath);
  }

  override syncRun(context: SyncBehaviorRunContext): Result<void, Error> {
    if (context.manifestEntry != null)
      syncManifest.teardownEntry(context.outputRoot, context.manifestEntry);
    if (context.mode === 'clear' || context.behaviorConfig.enabled === false) return ok(undefined);

    const symlinks: string[] = [];
    const fsAutoRemoval: string[] = [];
    const customData = createPluginsDirectoryCustomData();
    const parsed = pluginsDirectorySyncPresetOptionsSchema.safeParse(
      context.behaviorConfig.options
    );
    const optionsFallbacks = {
      targetRoot: `.${context.agentName}`,
      rulesMarkdownFrontmatter: null,
      ...(parsed.success ? parsed.data : {}),
    };
    const targetRoot = path.join(context.outputRoot, optionsFallbacks.targetRoot);
    syncFs.ensureDir(targetRoot);

    for (const marketplace of context.discoveredMarketplaces) {
      for (const plugin of marketplace.plugins) {
        if (plugin.manifests[context.agentName] !== true) continue;
        const layout = marketplace.layout;
        const commandsDir = path.join(plugin.path, 'commands');
        for (const commandFile of syncFs
          .readdirWithTypes(commandsDir)
          .filter((entry) => entry.isFile && /\.md$/i.test(entry.name))) {
          const sourcePath = path.join(commandsDir, commandFile.name);
          const targetPath = path.join(targetRoot, 'commands', plugin.name, commandFile.name);
          const targetRel = path.relative(context.outputRoot, targetPath).replace(/\\/g, '/');
          if (this.isExcluded(targetRel, context.excluded)) continue;
          syncFs.symlinkRelative(sourcePath, targetPath);
          symlinks.push(targetRel);
          customData[layout].symlinks.push(targetRel);
        }

        const rulesDir = path.join(plugin.path, 'rules');
        for (const rulesFile of syncFs
          .readdirWithTypes(rulesDir)
          .filter((entry) => entry.isFile && /\.md$/i.test(entry.name))) {
          const sourcePath = path.join(rulesDir, rulesFile.name);
          const targetFileName = rulesFile.name.replace(/\.md$/i, '.mdc');
          const targetPath = path.join(targetRoot, 'rules', plugin.name, targetFileName);
          const targetRel = path.relative(context.outputRoot, targetPath).replace(/\\/g, '/');
          if (this.isExcluded(targetRel, context.excluded)) continue;
          const markdown = syncFs.readFileUtf8(sourcePath);
          syncFs.ensureDir(path.dirname(targetPath));
          fs.writeFileSync(
            targetPath,
            `${optionsFallbacks.rulesMarkdownFrontmatter ?? ''}${markdown}`,
            'utf8'
          );
          fsAutoRemoval.push(targetRel);
          customData[layout].fsAutoRemoval.push(targetRel);
        }
      }
    }

    context.registerManifestEntry(context.agentName, context.behaviorConfig.behaviorName, {
      options: optionsFallbacks,
      symlinks,
      fsAutoRemoval,
      customData,
    });
    return ok(undefined);
  }
}
