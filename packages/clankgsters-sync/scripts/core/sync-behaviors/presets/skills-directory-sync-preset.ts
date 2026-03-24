import { ok, type Result } from 'neverthrow';
import path from 'node:path';
import { syncFs } from '../../../common/sync-fs.js';
import { agentPresetConfigs } from '../../agents/agent-presets/agent-preset-configs.js';
import { syncSourceLayouts, type SyncSourceLayoutKey } from '../../run/sync-source-layouts.js';
import { syncManifest } from '../../run/sync-manifest.js';
import { SyncBehaviorBase, type SyncBehaviorRunContext } from '../sync-behavior-base.js';

interface SkillsLayoutCustomData {
  symlinks: string[];
}

function createSkillsCustomData(): Record<SyncSourceLayoutKey, SkillsLayoutCustomData> {
  return {
    nestedRegular: { symlinks: [] },
    nestedLocal: { symlinks: [] },
    shorthandRegular: { symlinks: [] },
    shorthandLocal: { symlinks: [] },
  };
}

/** Syncs skills directories from source defaults into agent-native skill directories via symlinks. */
export class SkillsDirectorySyncPreset extends SyncBehaviorBase {
  override syncRun(context: SyncBehaviorRunContext): Result<void, Error> {
    const presetConfig = agentPresetConfigs.resolve(context.agentName);
    const nativeSkillsDirRel = presetConfig.CONSTANTS.AGENT_SKILLS_DIR;
    if (context.manifestEntry != null)
      syncManifest.teardownEntry(context.outputRoot, context.manifestEntry);
    if (context.mode === 'clear' || context.behaviorConfig.enabled === false) return ok(undefined);

    if (!presetConfig.CONSTANTS.SKILLS_DIRECTORY_SYNC_ENABLED) {
      context.registerManifestEntry(context.agentName, context.behaviorConfig.behaviorName, {
        options: context.behaviorConfig.options,
        symlinks: [],
        customData: createSkillsCustomData(),
      });
      return ok(undefined);
    }

    const sourceLayoutPaths = syncSourceLayouts.discoverSourceLayoutPaths({
      excluded: context.excluded,
      repoRoot: context.repoRoot,
      sourceDefaults: context.resolvedConfig.sourceDefaults,
    });
    const customData = createSkillsCustomData();
    const symlinks = new Set<string>();
    for (const layout of syncSourceLayouts.SYNC_SOURCE_LAYOUT_KEYS) {
      for (const sourceSkillsPath of sourceLayoutPaths.skillsByLayout[layout]) {
        const sourceEntries = syncFs
          .readdirWithTypes(sourceSkillsPath)
          .filter((entry) => entry.isDirectory);
        for (const entry of sourceEntries) {
          const skillDir = path.join(sourceSkillsPath, entry.name);
          const markerFile = path.join(
            skillDir,
            context.resolvedConfig.sourceDefaults.skillFileName
          );
          if (!syncFs.isFile(markerFile)) continue;
          const targetPath = path.join(context.outputRoot, nativeSkillsDirRel, entry.name);
          syncFs.symlinkRelative(skillDir, targetPath);
          const targetRel = path.relative(context.outputRoot, targetPath).replace(/\\/g, '/');
          symlinks.add(targetRel);
          customData[layout].symlinks.push(targetRel);
        }
      }
      customData[layout].symlinks.sort();
    }

    context.registerManifestEntry(context.agentName, context.behaviorConfig.behaviorName, {
      options: context.behaviorConfig.options,
      symlinks: [...symlinks].sort(),
      customData,
    });
    return ok(undefined);
  }
}
