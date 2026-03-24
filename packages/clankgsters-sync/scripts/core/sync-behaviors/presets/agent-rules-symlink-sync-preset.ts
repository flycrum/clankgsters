import { ok, type Result } from 'neverthrow';
import path from 'node:path';
import { syncFs } from '../../../common/sync-fs.js';
import { agentPresetConfigs } from '../../agents/agent-presets/agent-preset-configs.js';
import { syncManifest } from '../../run/sync-manifest.js';
import { SyncBehaviorBase, type SyncBehaviorRunContext } from '../sync-behavior-base.js';

/** Symlinks plugin `rules` markdown files into an agent-native rules directory. */
export class AgentRulesSymlinkSyncPreset extends SyncBehaviorBase {
  override syncRun(context: SyncBehaviorRunContext): Result<void, Error> {
    const presetConfig = agentPresetConfigs.resolve(context.agentName);
    const rulesDirRel = presetConfig.CONSTANTS.AGENT_RULES_DIR;
    const rulesDir = path.join(context.outputRoot, rulesDirRel);

    if (context.manifestEntry != null)
      syncManifest.teardownEntry(context.outputRoot, context.manifestEntry);
    if (context.mode === 'clear' || context.behaviorConfig.enabled === false) return ok(undefined);

    syncFs.ensureDir(rulesDir);
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
          const linkPath = path.join(rulesDir, plugin.name, file.name);
          syncFs.symlinkRelative(sourcePath, linkPath);
          symlinks.push(path.relative(context.outputRoot, linkPath).replace(/\\/g, '/'));
        }
      }
    }

    context.registerManifestEntry(context.agentName, context.behaviorConfig.behaviorName, {
      options: context.behaviorConfig.options,
      symlinks,
    });
    return ok(undefined);
  }
}
