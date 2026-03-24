import { ok, type Result } from 'neverthrow';
import fs from 'node:fs';
import path from 'node:path';
import { agentPresetConfigs } from '../../agents/agent-presets/agent-preset-configs.js';
import { SyncBehaviorBase, type SyncBehaviorRunContext } from '../sync-behavior-base.js';

/** Syncs the per-agent IDE settings JSON (e.g. `.cursor/settings.json`, `.claude/settings.json`) with `extraKnownMarketplaces` and `enabledPlugins` from discovered plugins. */
export class SettingsSyncPreset extends SyncBehaviorBase {
  override syncRun(context: SyncBehaviorRunContext): Result<void, Error> {
    const presetConfig = agentPresetConfigs.resolve(context.agentName);
    const localMarketplaceName = context.resolvedConfig.sourceDefaults.localMarketplaceName;
    const options = {
      manifestKey: presetConfig.CONSTANTS.SETTINGS_MANIFEST_KEY,
      marketplaceName: localMarketplaceName,
      settingsFile: presetConfig.CONSTANTS.SETTINGS_FILE,
      ...(context.behaviorConfig.options as Record<string, unknown>),
    };
    const settingsRelPath = presetConfig.CONSTANTS.SETTINGS_FILE;
    const settingsPath = path.join(context.outputRoot, settingsRelPath);
    if (context.mode === 'clear' || context.behaviorConfig.enabled === false) {
      if (!fs.existsSync(settingsPath)) return ok(undefined);
      const parsed = JSON.parse(fs.readFileSync(settingsPath, 'utf8')) as Record<string, unknown>;
      delete parsed.enabledPlugins;
      delete parsed.extraKnownMarketplaces;
      fs.writeFileSync(settingsPath, `${JSON.stringify(parsed, null, 2)}\n`, 'utf8');
      return ok(undefined);
    }

    const plugins = context.discoveredMarketplaces.flatMap((marketplace) =>
      marketplace.plugins.filter((plugin) => plugin.manifests[context.agentName] === true)
    );
    const enabledPlugins: Record<string, boolean> = {};
    for (const plugin of plugins) {
      enabledPlugins[`${plugin.manifestName ?? plugin.name}@${localMarketplaceName}`] = true;
    }

    let parsed: Record<string, unknown> = {};
    if (fs.existsSync(settingsPath)) {
      parsed = JSON.parse(fs.readFileSync(settingsPath, 'utf8')) as Record<string, unknown>;
    } else {
      fs.mkdirSync(path.dirname(settingsPath), { recursive: true });
    }
    parsed.extraKnownMarketplaces = {
      clankgstersSync: {
        source: {
          path: '.',
          source: 'directory',
        },
      },
    };
    parsed.enabledPlugins = enabledPlugins;
    fs.writeFileSync(settingsPath, `${JSON.stringify(parsed, null, 2)}\n`, 'utf8');

    context.registerManifestEntry(context.agentName, context.behaviorConfig.behaviorName, {
      options,
    });
    return ok(undefined);
  }
}
