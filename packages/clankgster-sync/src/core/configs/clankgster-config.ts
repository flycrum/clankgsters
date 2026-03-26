import { isPlainObject } from 'lodash-es';
import { agentPresets } from '../agents/agent-presets.js';
import { clankgsterConfigDefaults } from './clankgster-config.defaults.js';
import type {
  ClankgsterAgentConfig,
  ClankgsterBehaviorConfig,
  ClankgsterConfig,
  ClankgsterSourceDefaultsConfig,
} from './clankgster-config.schema.js';

/**
 * One behavior slot before normalization: preset class name string, or a partial {@link ClankgsterBehaviorConfig} object.
 */
export type ClankgsterBehaviorEntryInput = string | Partial<ClankgsterBehaviorConfig>;

/** Input accepted by `defineAgent` before behavior/option normalization. */
export interface DefineAgentInput {
  /** Ordered behavior list: each entry is a `behaviorName` string or a partial behavior config. */
  behaviors?: ClankgsterBehaviorEntryInput[];
  /** Optional enabled flag; defaults to `true`. */
  enabled?: boolean;
  /** Optional runtime name override; defaults to the top-level `agents` key name. */
  name?: string;
  /** Optional preset-style toggles: keys are `behaviorName` strings (preset class names). */
  syncBehaviorPresets?: Partial<Record<string, boolean>>;
}

/** Agent entry forms accepted by top-level `agents` config map. */
export type AgentEntryInput = boolean | ClankgsterAgentConfig | DefineAgentInput;

/** Top-level `agents` shape supporting preset booleans and custom entries. */
export interface ClankgsterAgentsConfigInput {
  [agentName: string]: AgentEntryInput | Record<string, AgentEntryInput> | undefined;
  custom?: Record<string, AgentEntryInput>;
}

/** Extra top-level config input accepted by `define` before normalization. */
export interface ClankgsterConfigInput extends Omit<
  Partial<ClankgsterConfig>,
  'agents' | 'sourceDefaults'
> {
  /**
   * Named coding-agent entries (`claude`, `cursor`, `codex`, …) plus optional `custom`; values may be
   * booleans, {@link DefineAgentInput}, or full {@link ClankgsterAgentConfig} before {@link clankgsterConfig.normalizeAgentsConfig}.
   */
  agents?: ClankgsterAgentsConfigInput;
  /** Partial overrides for discovery paths, marketplace name, skill filename, and related layout defaults merged into schema defaults. */
  sourceDefaults?: Partial<ClankgsterSourceDefaultsConfig>;
}

function toBehaviorConfig(
  behaviorEntry: ClankgsterBehaviorEntryInput
): ClankgsterBehaviorConfig | null {
  if (typeof behaviorEntry === 'string' && behaviorEntry.length > 0) {
    return {
      enabled: true,
      behaviorName: behaviorEntry,
      options: {},
    };
  }
  if (!isPlainObject(behaviorEntry)) return null;
  const behaviorRecord = behaviorEntry as Partial<ClankgsterBehaviorConfig>;
  const behaviorName =
    typeof behaviorRecord.behaviorName === 'string' ? behaviorRecord.behaviorName : null;
  if (behaviorName == null || behaviorName.length === 0) return null;
  return {
    behaviorName,
    enabled: behaviorRecord.enabled ?? true,
    options: (isPlainObject(behaviorRecord.options) ? behaviorRecord.options : {}) as Record<
      string,
      unknown
    >,
  };
}

function behaviorsFromSyncBehaviorPresets(input: DefineAgentInput): ClankgsterBehaviorConfig[] {
  if (!isPlainObject(input) || !isPlainObject(input.syncBehaviorPresets)) return [];
  const syncBehaviorPresets = input.syncBehaviorPresets as Record<string, unknown>;
  const out: ClankgsterBehaviorConfig[] = [];
  for (const [presetName, enabled] of Object.entries(syncBehaviorPresets)) {
    if (enabled !== true) continue;
    const normalized = toBehaviorConfig(presetName);
    if (normalized != null) out.push(normalized);
  }
  return out;
}

function toAgentConfig(
  agentName: string,
  entry: AgentEntryInput | undefined,
  fallbackToPreset: boolean
): ClankgsterAgentConfig | null {
  if (entry == null) return null;
  const presetByName = agentPresets as Record<string, ClankgsterAgentConfig>;
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
    .map((behaviorEntry) => toBehaviorConfig(behaviorEntry))
    .filter((behavior): behavior is ClankgsterBehaviorConfig => behavior != null);
  const presetBehaviors = behaviorsFromSyncBehaviorPresets(entry as DefineAgentInput);
  const mergedBehaviors = [...normalizedBehaviors, ...presetBehaviors];
  const fallbackPreset = fallbackToPreset ? presetByName[agentName] : undefined;
  return {
    enabled: entry.enabled ?? true,
    behaviors: mergedBehaviors.length > 0 ? mergedBehaviors : (fallbackPreset?.behaviors ?? []),
  };
}

function normalizeAgentsConfig(
  agents: ClankgsterConfigInput['agents']
): Record<string, ClankgsterAgentConfig> {
  if (!isPlainObject(agents)) return {};
  const agentsRecord = agents as Record<string, AgentEntryInput> & {
    custom?: Record<string, AgentEntryInput>;
  };
  const out: Record<string, ClankgsterAgentConfig> = {};
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

/** Typed helper surface for authoring and normalizing `ClankgsterConfig` in code. */
export const clankgsterConfig = {
  /** Normalizes expressive config input into schema-ready partial config. */
  define(config: ClankgsterConfigInput): Partial<ClankgsterConfig> {
    return {
      ...config,
      agents: normalizeAgentsConfig(config.agents),
      sourceDefaults: {
        sourceDir:
          config.sourceDefaults?.sourceDir ??
          clankgsterConfigDefaults.CONSTANTS.sourceDefaults.sourceDir,
        pluginsDir:
          config.sourceDefaults?.pluginsDir ??
          clankgsterConfigDefaults.CONSTANTS.sourceDefaults.pluginsDir,
        skillsDir:
          config.sourceDefaults?.skillsDir ??
          clankgsterConfigDefaults.CONSTANTS.sourceDefaults.skillsDir,
        markdownContextFileName:
          config.sourceDefaults?.markdownContextFileName ??
          clankgsterConfigDefaults.CONSTANTS.sourceDefaults.markdownContextFileName,
        localMarketplaceName:
          config.sourceDefaults?.localMarketplaceName ??
          clankgsterConfigDefaults.CONSTANTS.sourceDefaults.localMarketplaceName,
        skillFileName:
          config.sourceDefaults?.skillFileName ??
          clankgsterConfigDefaults.CONSTANTS.sourceDefaults.skillFileName,
      },
      artifactMode: config.artifactMode ?? clankgsterConfigDefaults.CONSTANTS.artifactMode,
      hooks: {
        ...config.hooks,
      },
      syncCacheDir: config.syncCacheDir ?? clankgsterConfigDefaults.CONSTANTS.syncCacheDir,
      syncOutputReadOnly:
        config.syncOutputReadOnly ?? clankgsterConfigDefaults.CONSTANTS.syncOutputReadOnly,
    };
  },
  /** Normalizes one agent input into a stable runtime shape for top-level `agents` maps. */
  defineAgent(input: DefineAgentInput): ClankgsterAgentConfig {
    return (
      toAgentConfig(input.name ?? 'custom', input, false) ?? {
        enabled: true,
        behaviors: [],
      }
    );
  },
  normalizeAgentsConfig,
};
