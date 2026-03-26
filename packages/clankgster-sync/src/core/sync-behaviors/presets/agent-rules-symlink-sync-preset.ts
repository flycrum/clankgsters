import { err, ok, type Result } from 'neverthrow';
import path from 'node:path';
import { z } from 'zod';
import { pathHelpers } from '../../../common/path-helpers.js';
import { syncFs } from '../../../common/sync-fs.js';
import { syncManifest } from '../../run/sync-manifest.js';
import { SyncBehaviorBase, type SyncBehaviorRunContext } from '../sync-behavior-base.js';

const agentRulesSymlinkSyncPresetOptionsSchema = z.looseObject({
  rulesDir: z.string().min(1).optional(),
  syncManifest: z.string().min(1).nullable().optional(),
});

/** Typed options for `AgentRulesSymlinkSyncPreset`. */
export interface AgentRulesSymlinkSyncPresetOptions {
  /** Repo-relative rules directory where plugin rules symlink outputs are written. */
  rulesDir?: string;
  /** Optional sidecar JSON path for rules sync bookkeeping metadata. */
  syncManifest?: string | null;
}

/** Symlinks plugin `rules` markdown files into an agent-native rules directory. */
export class AgentRulesSymlinkSyncPreset extends SyncBehaviorBase {
  override syncRun(context: SyncBehaviorRunContext): Result<void, Error> {
    if (context.manifestEntry != null)
      syncManifest.teardownEntry(context.outputRoot, context.manifestEntry);

    const parsed = agentRulesSymlinkSyncPresetOptionsSchema.safeParse(
      context.behaviorConfig.options
    );
    if (!parsed.success) {
      return err(
        new Error(`agentRulesSymlinkSync: invalid behavior options\n${parsed.error.message}`)
      );
    }

    const optionsFallbacks = {
      rulesDir: null,
      ...parsed.data,
    };
    const rulesDirRel = optionsFallbacks.rulesDir;

    if (context.mode === 'clear' || context.behaviorConfig.enabled === false) return ok(undefined);
    if (rulesDirRel == null) return ok(undefined);

    const outputRootResolved = path.resolve(context.outputRoot);
    const rulesDirResolved = path.resolve(outputRootResolved, rulesDirRel);
    if (!pathHelpers.isResolvedPathUnderRoot(outputRootResolved, rulesDirResolved)) {
      return err(
        new Error(
          `agentRulesSymlinkSync: rulesDir resolves outside outputRoot (${JSON.stringify(rulesDirRel)})`
        )
      );
    }

    syncFs.ensureDir(rulesDirResolved);
    const symlinks: string[] = [];
    for (const marketplace of context.discoveredMarketplaces) {
      for (const plugin of marketplace.plugins) {
        if (plugin.manifests[context.agentName] !== true) continue;
        const pluginRulesDir = path.join(plugin.path, 'rules');
        const files = syncFs
          .readdirWithTypes(pluginRulesDir)
          .filter((entry) => entry.isFile && /\.(md|mdc|markdown)$/i.test(entry.name));
        for (const file of files) {
          const sourcePath = path.join(pluginRulesDir, file.name);
          const linkPath = path.join(rulesDirResolved, plugin.name, file.name);
          syncFs.symlinkRelative(sourcePath, linkPath);
          symlinks.push(path.relative(context.outputRoot, linkPath).replace(/\\/g, '/'));
        }
      }
    }

    context.registerManifestEntry(context.agentName, context.behaviorConfig.behaviorName, {
      options: optionsFallbacks,
      symlinks,
    });
    return ok(undefined);
  }
}
