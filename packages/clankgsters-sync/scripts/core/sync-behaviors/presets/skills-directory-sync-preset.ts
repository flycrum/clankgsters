import { ok, type Result } from 'neverthrow';
import path from 'node:path';
import { syncFs } from '../../../common/sync-fs.js';
import { agentPresetConfigs } from '../../agents/agent-presets/agent-preset-configs.js';
import { syncDiscover } from '../../run/sync-discover-agents.js';
import { syncManifest } from '../../run/sync-manifest.js';
import { SyncBehaviorBase, type SyncBehaviorRunContext } from '../sync-behavior-base.js';

/** Syncs skills directories from source defaults into agent-native skill directories via symlinks. */
export class SkillsDirectorySyncPreset extends SyncBehaviorBase {
  override syncRun(context: SyncBehaviorRunContext): Result<void, Error> {
    const presetConfig = agentPresetConfigs.resolve(context.agentName);
    const nativeSkillsDirRel = presetConfig.CONSTANTS.NATIVE_SKILLS_DIR;
    if (context.manifestEntry != null)
      syncManifest.teardownEntry(context.outputRoot, context.manifestEntry);
    if (context.mode === 'clear' || context.behaviorConfig.enabled === false) return ok(undefined);

    if (!presetConfig.CONSTANTS.SKILLS_SYNC_ENABLED) {
      context.registerManifestEntry(context.agentName, context.behaviorConfig.behaviorName, {
        options: context.behaviorConfig.options,
        symlinks: [],
      });
      return ok(undefined);
    }

    const resolved = syncDiscover.getResolvedSourcePath(context.resolvedConfig.sourceDefaults);
    const sourceSkillsPath = path.join(context.outputRoot, resolved.skillsPath);
    const sourceEntries = syncFs
      .readdirWithTypes(sourceSkillsPath)
      .filter((entry) => entry.isDirectory);
    const symlinks: string[] = [];
    for (const entry of sourceEntries) {
      const skillDir = path.join(sourceSkillsPath, entry.name);
      const markerFile = path.join(skillDir, context.resolvedConfig.sourceDefaults.skillFileName);
      if (!syncFs.isFile(markerFile)) continue;
      const targetPath = path.join(context.outputRoot, nativeSkillsDirRel, entry.name);
      syncFs.symlinkRelative(skillDir, targetPath);
      symlinks.push(path.relative(context.outputRoot, targetPath).replace(/\\/g, '/'));
    }

    context.registerManifestEntry(context.agentName, context.behaviorConfig.behaviorName, {
      options: context.behaviorConfig.options,
      symlinks,
    });
    return ok(undefined);
  }
}
