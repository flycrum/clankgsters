import { err, ok, type Result } from 'neverthrow';
import fs from 'node:fs';
import path from 'node:path';
import { z } from 'zod';
import { clankLogger } from '../../../common/logger.js';
import { SyncBehaviorBase, type SyncBehaviorRunContext } from '../sync-behavior-base.js';

function settingsIoError(settingsRelPath: string, action: string, cause: unknown): Error {
  const base = cause instanceof Error ? cause : new Error(String(cause));
  return new Error(`${action} agent settings at ${settingsRelPath}: ${base.message}`, {
    cause: base,
  });
}

const agentSettingsSyncPresetOptionsSchema = z.looseObject({
  manifestKey: z.string().min(1).optional(),
  marketplaceName: z.string().min(1).optional(),
  settingsFile: z.string().min(1).nullable().optional(),
});

/** Typed options for `AgentSettingsSyncPreset`. */
export interface AgentSettingsSyncPresetOptions {
  /** Manifest key used by downstream settings integration bookkeeping. */
  manifestKey?: string;
  /** Local marketplace name used in `enabledPlugins` entries. */
  marketplaceName?: string;
  /** Repo-relative settings JSON path; `null` disables this behavior for an agent. */
  settingsFile?: string | null;
}

/** Syncs per-agent IDE settings JSON with `extraKnownMarketplaces` and `enabledPlugins`. */
export class AgentSettingsSyncPreset extends SyncBehaviorBase {
  override syncRun(context: SyncBehaviorRunContext): Result<void, Error> {
    const localMarketplaceName = context.resolvedConfig.sourceDefaults.localMarketplaceName;
    const optionsParse = agentSettingsSyncPresetOptionsSchema.safeParse(
      context.behaviorConfig.options
    );
    const optionsFallbacks = {
      manifestKey: context.agentName,
      marketplaceName: localMarketplaceName,
      settingsFile: `.${context.agentName}/settings.json`,
      ...(optionsParse.success ? optionsParse.data : {}),
    };
    const settingsRelPath =
      typeof optionsFallbacks.settingsFile === 'string' ? optionsFallbacks.settingsFile : null;
    if (settingsRelPath == null) return ok(undefined);
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
      enabledPlugins[`${plugin.manifestName ?? plugin.name}@${optionsFallbacks.marketplaceName}`] =
        true;
    }

    let settingsJson: Record<string, unknown> = {};
    if (fs.existsSync(settingsPath)) {
      try {
        settingsJson = JSON.parse(fs.readFileSync(settingsPath, 'utf8')) as Record<string, unknown>;
      } catch (e) {
        clankLogger
          .getLogger()
          .warn(
            { err: e, settingsRelPath },
            'agent settings JSON unreadable or invalid; merging from empty object'
          );
        settingsJson = {};
      }
    } else {
      try {
        fs.mkdirSync(path.dirname(settingsPath), { recursive: true });
      } catch (e) {
        return err(settingsIoError(settingsRelPath, 'Failed to create settings directory', e));
      }
    }
    settingsJson.extraKnownMarketplaces = {
      clankgsterSync: {
        source: {
          path: '.',
          source: 'directory',
        },
      },
    };
    settingsJson.enabledPlugins = enabledPlugins;
    try {
      fs.writeFileSync(settingsPath, `${JSON.stringify(settingsJson, null, 2)}\n`, 'utf8');
    } catch (e) {
      return err(settingsIoError(settingsRelPath, 'Failed to write', e));
    }

    context.registerManifestEntry(context.agentName, context.behaviorConfig.behaviorName, {
      options: optionsFallbacks,
    });
    return ok(undefined);
  }
}
