import type { AgentMarketplaceJsonSyncPresetOptions } from '../../sync-behaviors/presets/agent-marketplace-json-sync-preset.js';
import type { AgentRulesSymlinkSyncPresetOptions } from '../../sync-behaviors/presets/agent-rules-symlink-sync-preset.js';
import type { AgentSettingsSyncPresetOptions } from '../../sync-behaviors/presets/agent-settings-sync-preset.js';
import type { MarkdownSectionSyncPresetOptions } from '../../sync-behaviors/presets/markdown-section-sync-preset.js';
import type { MarkdownSymlinkSyncPresetOptions } from '../../sync-behaviors/presets/markdown-symlink-sync-preset.js';
import type { PluginsCacheBustSyncPresetOptions } from '../../sync-behaviors/presets/plugins-cache-bust-sync-preset.js';
import type { PluginsDirectorySyncPresetOptions } from '../../sync-behaviors/presets/plugins-directory-sync-preset.js';
import type { SkillsDirectorySyncPresetOptions } from '../../sync-behaviors/presets/skills-directory-sync-preset.js';

/** Shared constant keys every built-in agent preset must define for cross-agent system integration. */
export interface AgentCommonConstants {
  /** Stable agent key used in config, runtime routing, and manifest namespacing. */
  AGENT_NAME: string;
  /** Default markdown context filename generated for this agent (for example `CLAUDE.md`), or `null` when no default exists. */
  AGENT_MARKDOWN_CONTEXT_FILE_NAME: string | null;
  /** Agent plugin manifest directory name, or `null` when the agent has no plugin manifest concept. */
  AGENT_PLUGIN_MANIFEST_DIR: string | null;
}

/** Built-in sync behavior option contracts keyed by `behaviorName`. */
export interface AgentBehaviorOptionsByName {
  AgentMarketplaceJsonSyncPreset: AgentMarketplaceJsonSyncPresetOptions;
  AgentRulesSymlinkSyncPreset: AgentRulesSymlinkSyncPresetOptions;
  AgentSettingsSyncPreset: AgentSettingsSyncPresetOptions;
  MarkdownSectionSyncPreset: MarkdownSectionSyncPresetOptions;
  MarkdownSymlinkSyncPreset: MarkdownSymlinkSyncPresetOptions;
  PluginsCacheBustSyncPreset: PluginsCacheBustSyncPresetOptions;
  PluginsDirectorySyncPreset: PluginsDirectorySyncPresetOptions;
  SkillsDirectorySyncPreset: SkillsDirectorySyncPresetOptions;
}

/** Helper input shape for one agent's constants split into required common keys and behavior-keyed defaults. */
export interface DefineAgentConstantsInput<
  TBehaviors extends Partial<{
    [K in keyof AgentBehaviorOptionsByName]: AgentBehaviorOptionsByName[K];
  }>,
> {
  /** Required constants used by shared runtime modules across all agents. */
  COMMON: AgentCommonConstants;
  /** Optional per-behavior default options keyed by exact `behaviorName`. */
  BEHAVIORS: TBehaviors;
}

/** Defines one agent constants object with strongly-typed `COMMON` and `BEHAVIORS` sections. */
export function defineAgentConstants<
  const TBehaviors extends Partial<{
    [K in keyof AgentBehaviorOptionsByName]: AgentBehaviorOptionsByName[K];
  }>,
>(input: DefineAgentConstantsInput<TBehaviors>): DefineAgentConstantsInput<TBehaviors> {
  return input;
}
