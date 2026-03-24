import { isPlainObject } from 'lodash-es';
import { clankgstersIdentity } from '../../common/clankgsters-identity.js';
import { agentPresets } from '../agents/agent-presets.js';
import type {
  ClankgstersAgentConfig,
  ClankgstersBehaviorConfig,
  ClankgstersConfig,
  ClankgstersSourceDefaultsConfig,
} from './clankgsters-config.schema.js';

/** Input accepted by `defineAgent` before behavior/option normalization. */
export interface DefineAgentInput {
  /** Optional enabled flag; defaults to `true`. */
  enabled?: boolean;
  /** Optional runtime name override; defaults to the top-level `agents` key name. */
  name?: string;
  /** Ordered behavior list by id string or explicit behavior object. */
  behaviors?: Array<string | Partial<ClankgstersBehaviorConfig>>;
  /** Optional preset-style behavior toggles (POC-style) that map to concrete behavior ids. */
  syncBehaviorPresets?: Partial<Record<string, boolean>>;
}

/** Agent entry forms accepted by top-level `agents` config map. */
export type AgentEntryInput = boolean | ClankgstersAgentConfig | DefineAgentInput;

/** Top-level `agents` shape supporting preset booleans and custom entries. */
export interface ClankgstersAgentsConfigInput {
  [agentName: string]: AgentEntryInput | Record<string, AgentEntryInput> | undefined;
  custom?: Record<string, AgentEntryInput>;
}

/** Extra top-level config input accepted by `define` before normalization. */
export interface ClankgstersConfigInput extends Omit<
  Partial<ClankgstersConfig>,
  'agents' | 'sourceDefaults'
> {
  agents?: ClankgstersAgentsConfigInput;
  sourceDefaults?: Partial<ClankgstersSourceDefaultsConfig>;
}

/**
 * Maps user-facing preset keys (`syncBehaviorPresets`) and matching behavior strings to the
 * canonical runtime behavior `name` registered in `sync-behavior-registry.ts` when the two
 * differ. Used when expanding preset booleans and when normalizing string entries in
 * `toBehaviorConfig`.
 */
const behaviorPresetAliases: Record<string, string> = {
  claudeLocalPluginCacheBust: 'cacheBust',
  localMarketplaceSync: 'marketplaceJson',
  localPluginsContentSync: 'localContentSync',
  markdownSectionSync: 'markdownSectionSync',
  rulesSymlink: 'rulesSymlink',
  settingsSync: 'settingsSync',
  skillsDirectorySync: 'skillsSync',
};

/**
 * Maps runtime behavior `name` → manifest key written under each agent in the resolved sync manifest JSON
 * when the persisted key must differ (historical or stable JSON field names). If absent, the manifest
 * key defaults to `name` in `toBehaviorConfig`. Example: `marketplaceJson` is stored as
 * `localMarketplaceSync`.
 */
const behaviorManifestKeyAliases: Record<string, string> = {
  localContentSync: 'localPluginsContentSync',
  marketplaceJson: 'localMarketplaceSync',
  skillsSync: 'skillsDirectorySync',
};

function toBehaviorConfig(
  behavior: string | Partial<ClankgstersBehaviorConfig>
): ClankgstersBehaviorConfig | null {
  if (typeof behavior === 'string' && behavior.length > 0) {
    const name = behaviorPresetAliases[behavior] ?? behavior;
    return {
      enabled: true,
      manifestKey: behaviorManifestKeyAliases[name] ?? name,
      name,
      options: {},
    };
  }
  if (!isPlainObject(behavior)) return null;
  const behaviorRecord = behavior as Partial<ClankgstersBehaviorConfig>;
  const name = typeof behaviorRecord.name === 'string' ? behaviorRecord.name : null;
  if (name == null || name.length === 0) return null;
  return {
    enabled: behaviorRecord.enabled ?? true,
    manifestKey: behaviorRecord.manifestKey,
    name,
    options: (isPlainObject(behaviorRecord.options) ? behaviorRecord.options : {}) as Record<
      string,
      unknown
    >,
  };
}

function behaviorsFromSyncBehaviorPresets(input: DefineAgentInput): ClankgstersBehaviorConfig[] {
  if (!isPlainObject(input) || !isPlainObject(input.syncBehaviorPresets)) return [];
  const syncBehaviorPresets = input.syncBehaviorPresets as Record<string, unknown>;
  const out: ClankgstersBehaviorConfig[] = [];
  for (const [presetName, enabled] of Object.entries(syncBehaviorPresets)) {
    if (enabled !== true) continue;
    const behaviorName = behaviorPresetAliases[presetName] ?? presetName;
    const normalized = toBehaviorConfig(behaviorName);
    if (normalized != null) out.push(normalized);
  }
  return out;
}

function toAgentConfig(
  agentName: string,
  entry: AgentEntryInput | undefined,
  fallbackToPreset: boolean
): ClankgstersAgentConfig | null {
  if (entry == null) return null;
  const presetByName = agentPresets as Record<string, ClankgstersAgentConfig>;
  if (entry === false) {
    const preset = fallbackToPreset ? presetByName[agentName] : undefined;
    return {
      enabled: false,
      behaviors: preset?.behaviors ?? [],
    };
  }
  if (entry === true) {
    const preset = fallbackToPreset ? presetByName[agentName] : undefined;
    return {
      enabled: true,
      behaviors: preset?.behaviors ?? [],
    };
  }

  if (!isPlainObject(entry)) return null;
  const inputBehaviors = Array.isArray(entry.behaviors) ? entry.behaviors : [];
  const normalizedBehaviors = inputBehaviors
    .map((behavior) => toBehaviorConfig(behavior as string | Partial<ClankgstersBehaviorConfig>))
    .filter((behavior): behavior is ClankgstersBehaviorConfig => behavior != null);
  const presetBehaviors = behaviorsFromSyncBehaviorPresets(entry as DefineAgentInput);
  const mergedBehaviors = [...normalizedBehaviors, ...presetBehaviors];
  const fallbackPreset = fallbackToPreset ? presetByName[agentName] : undefined;
  return {
    enabled: entry.enabled ?? true,
    behaviors: mergedBehaviors.length > 0 ? mergedBehaviors : (fallbackPreset?.behaviors ?? []),
  };
}

function normalizeAgentsConfig(
  agents: ClankgstersConfigInput['agents']
): Record<string, ClankgstersAgentConfig> {
  if (!isPlainObject(agents)) return {};
  const agentsRecord = agents as Record<string, AgentEntryInput> & {
    custom?: Record<string, AgentEntryInput>;
  };
  const out: Record<string, ClankgstersAgentConfig> = {};
  const presetNames = new Set(Object.keys(agentPresets));
  for (const presetName of presetNames) {
    if (!(presetName in agentsRecord)) continue;
    const resolved = toAgentConfig(presetName, agentsRecord[presetName], true);
    if (resolved != null) out[presetName] = resolved;
  }

  for (const [name, entry] of Object.entries(agentsRecord)) {
    if (name === 'custom') continue;
    if (presetNames.has(name)) continue;
    const resolved = toAgentConfig(name, entry as AgentEntryInput, false);
    if (resolved != null) out[name] = resolved;
  }

  const custom = agentsRecord.custom;
  if (isPlainObject(custom)) {
    for (const [name, entry] of Object.entries(custom as Record<string, AgentEntryInput>)) {
      const resolved = toAgentConfig(name, entry as AgentEntryInput, false);
      if (resolved != null) out[name] = resolved;
    }
  }
  return out;
}

/** Typed helper surface for authoring and normalizing `ClankgstersConfig` in code. */
export const clankgstersConfig = {
  /** Normalizes one agent input into a stable runtime shape for top-level `agents` maps. */
  defineAgent(input: DefineAgentInput): ClankgstersAgentConfig {
    return (
      toAgentConfig(input.name ?? 'custom', input, false) ?? {
        enabled: true,
        behaviors: [],
      }
    );
  },
  /** Normalizes expressive config input into schema-ready partial config. */
  define(config: ClankgstersConfigInput): Partial<ClankgstersConfig> {
    return {
      ...config,
      agents: normalizeAgentsConfig(config.agents),
      sourceDefaults: {
        sourceDir: config.sourceDefaults?.sourceDir ?? '.clank',
        pluginsDir: config.sourceDefaults?.pluginsDir ?? 'plugins',
        skillsDir: config.sourceDefaults?.skillsDir ?? 'skills',
        markdownContextFileName: config.sourceDefaults?.markdownContextFileName ?? 'CLANK.md',
        localMarketplaceName:
          config.sourceDefaults?.localMarketplaceName ?? clankgstersIdentity.LOCAL_MARKETPLACE_NAME,
        skillFileName: config.sourceDefaults?.skillFileName ?? 'SKILL.md',
      },
      syncCacheDir: config.syncCacheDir ?? clankgstersIdentity.SYNC_CACHE_DIR,
    };
  },
  normalizeAgentsConfig,
};
