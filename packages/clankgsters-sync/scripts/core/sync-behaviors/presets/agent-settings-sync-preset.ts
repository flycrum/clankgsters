import { err, ok, type Result } from 'neverthrow';
import fs from 'node:fs';
import path from 'node:path';
import { agentPresetConfigs } from '../../agents/agent-presets/agent-preset-configs.js';
import { SyncBehaviorBase, type SyncBehaviorRunContext } from '../sync-behavior-base.js';

function settingsIoError(settingsRelPath: string, action: string, cause: unknown): Error {
  const base = cause instanceof Error ? cause : new Error(String(cause));
  return new Error(`${action} agent settings at ${settingsRelPath}: ${base.message}`, {
    cause: base,
  });
}

/** Syncs per-agent IDE settings JSON with `extraKnownMarketplaces` and `enabledPlugins`. */
export class AgentSettingsSyncPreset extends SyncBehaviorBase {
  override syncRun(context: SyncBehaviorRunContext): Result<void, Error> {
    const presetConfig = agentPresetConfigs.resolve(context.agentName);
    const localMarketplaceName = context.resolvedConfig.sourceDefaults.localMarketplaceName;
    const options = {
      manifestKey: presetConfig.CONSTANTS.AGENT_SETTINGS_MANIFEST_KEY,
      marketplaceName: localMarketplaceName,
      settingsFile: presetConfig.CONSTANTS.AGENT_SETTINGS_FILE,
      ...(context.behaviorConfig.options as Record<string, unknown>),
    };
    const settingsRelPath = presetConfig.CONSTANTS.AGENT_SETTINGS_FILE;
    const settingsPath = path.join(context.outputRoot, settingsRelPath);
    if (context.mode === 'clear' || context.behaviorConfig.enabled === false) {
      if (!fs.existsSync(settingsPath)) return ok(undefined);
      try {
        const parsed = JSON.parse(fs.readFileSync(settingsPath, 'utf8')) as Record<string, unknown>;
        delete parsed.enabledPlugins;
        delete parsed.extraKnownMarketplaces;
        fs.writeFileSync(settingsPath, `${JSON.stringify(parsed, null, 2)}\n`, 'utf8');
      } catch (e) {
        return err(settingsIoError(settingsRelPath, 'Failed to read, parse, or write', e));
      }
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
      try {
        parsed = JSON.parse(fs.readFileSync(settingsPath, 'utf8')) as Record<string, unknown>;
      } catch (e) {
        return err(settingsIoError(settingsRelPath, 'Failed to read or parse', e));
      }
    } else {
      try {
        fs.mkdirSync(path.dirname(settingsPath), { recursive: true });
      } catch (e) {
        return err(settingsIoError(settingsRelPath, 'Failed to create settings directory', e));
      }
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
    try {
      fs.writeFileSync(settingsPath, `${JSON.stringify(parsed, null, 2)}\n`, 'utf8');
    } catch (e) {
      return err(settingsIoError(settingsRelPath, 'Failed to write', e));
    }

    context.registerManifestEntry(context.agentName, context.behaviorConfig.behaviorName, {
      options,
    });
    return ok(undefined);
  }
}
