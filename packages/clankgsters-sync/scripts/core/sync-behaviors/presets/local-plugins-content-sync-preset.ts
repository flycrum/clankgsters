import { ok, type Result } from 'neverthrow';
import fs from 'node:fs';
import path from 'node:path';
import { syncFs } from '../../../common/sync-fs.js';
import { agentPresetConfigs } from '../../agents/agent-presets/agent-preset-configs.js';
import { syncManifest } from '../../run/sync-manifest.js';
import { SyncBehaviorBase, type SyncBehaviorRunContext } from '../sync-behavior-base.js';

/** Syncs plugin content directories (rules/commands/skills/agents) into agent-local content roots. */
export class LocalPluginsContentSyncPreset extends SyncBehaviorBase {
  private isExcluded(relPath: string, excluded: string[]): boolean {
    return excluded.includes(relPath);
  }

  override syncRun(context: SyncBehaviorRunContext): Result<void, Error> {
    if (context.manifestEntry != null)
      syncManifest.teardownEntry(context.outputRoot, context.manifestEntry);
    if (context.mode === 'clear' || context.behaviorConfig.enabled === false) return ok(undefined);

    const symlinks: string[] = [];
    const fsAutoRemoval: string[] = [];
    const presetConfig = agentPresetConfigs.resolve(context.agentName);
    const targetRoot = path.join(
      context.outputRoot,
      presetConfig.CONSTANTS.LOCAL_CONTENT_TARGET_ROOT ?? `.${context.agentName}`
    );
    syncFs.ensureDir(targetRoot);

    for (const marketplace of context.discoveredMarketplaces) {
      for (const plugin of marketplace.plugins) {
        if (plugin.manifests[context.agentName] !== true) continue;
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
            `${presetConfig.CONSTANTS.RULES_MARKDOWN_FRONTMATTER ?? ''}${markdown}`,
            'utf8'
          );
          fsAutoRemoval.push(targetRel);
        }
      }
    }

    context.registerManifestEntry(context.agentName, context.behaviorConfig.behaviorName, {
      options: context.behaviorConfig.options,
      symlinks,
      fsAutoRemoval,
    });
    return ok(undefined);
  }
}
