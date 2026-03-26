import type { ClankgsterAgentConfig } from '../../configs/clankgster-config.schema.js';
import type { AgentMarketplaceJsonSyncPresetOptions } from '../../sync-behaviors/presets/agent-marketplace-json-sync-preset.js';
import type { AgentRulesDirectorySyncPresetOptions } from '../../sync-behaviors/presets/agent-rules-symlink-sync-preset.js';
import type { AgentSettingsSyncPresetOptions } from '../../sync-behaviors/presets/agent-settings-sync-preset.js';
import type { MarkdownContextSyncPresetOptions } from '../../sync-behaviors/presets/markdown-symlink-sync-preset.js';
import type { PluginsCacheBustSyncPresetOptions } from '../../sync-behaviors/presets/plugins-cache-bust-sync-preset.js';
import type { SkillsDirectorySyncPresetOptions } from '../../sync-behaviors/presets/skills-directory-sync-preset.js';
import { defineAgentConstants } from './define-agent-constants.js';

/** Claude preset constants consumed by default behavior option wiring. */
export const claudeAgentPresetConstants = defineAgentConstants({
  COMMON: {
    AGENT_NAME: 'claude',
    AGENT_MARKDOWN_CONTEXT_FILE_NAME: 'CLAUDE.md',
    AGENT_PLUGIN_MANIFEST_DIR: '.claude-plugin',
  },
  BEHAVIORS: {
    AgentMarketplaceJsonSyncPreset: {
      manifestKey: 'claude',
      marketplaceFile: '.claude-plugin/marketplace.json',
      sourceFormat: 'prefixed',
    } satisfies AgentMarketplaceJsonSyncPresetOptions,
    AgentRulesDirectorySyncPreset: {
      rulesDir: '.claude/rules',
      syncManifest: '.claude/.clankgster-claude-sync.json',
    } satisfies AgentRulesDirectorySyncPresetOptions,
    AgentSettingsSyncPreset: {
      manifestKey: 'claude',
      settingsFile: '.claude/settings.json',
    } satisfies AgentSettingsSyncPresetOptions,
    MarkdownContextSyncPreset: {
      targetFile: 'CLAUDE.md',
      gitignoreComment: '\n# clankgster-sync: symlinked from CLANK.md for Claude\n',
      gitignoreEntry: 'CLAUDE.md',
    } satisfies MarkdownContextSyncPresetOptions,
    PluginsCacheBustSyncPreset: {
      marketplaceFile: '.claude-plugin/marketplace.json',
      pluginsCacheSegments: ['.claude', 'plugins', 'cache', 'local-plugins'] as const,
    } satisfies PluginsCacheBustSyncPresetOptions,
    SkillsDirectorySyncPreset: {
      nativeSkillsDir: '.claude/skills',
      skillsDirectorySyncEnabled: true,
    } satisfies SkillsDirectorySyncPresetOptions,
  },
});

/** Default Claude preset behaviors for sync runs. */
export const claudeAgentPreset: ClankgsterAgentConfig = {
  enabled: true,
  behaviors: [
    {
      enabled: true,
      behaviorName: 'MarkdownContextSyncPreset',
      options: claudeAgentPresetConstants.BEHAVIORS.MarkdownContextSyncPreset,
    },
    {
      enabled: true,
      behaviorName: 'AgentMarketplaceJsonSyncPreset',
      options: claudeAgentPresetConstants.BEHAVIORS.AgentMarketplaceJsonSyncPreset,
    },
    {
      enabled: true,
      behaviorName: 'AgentRulesDirectorySyncPreset',
      options: claudeAgentPresetConstants.BEHAVIORS.AgentRulesDirectorySyncPreset,
    },
    {
      enabled: true,
      behaviorName: 'SkillsDirectorySyncPreset',
      options: claudeAgentPresetConstants.BEHAVIORS.SkillsDirectorySyncPreset,
    },
    {
      enabled: true,
      behaviorName: 'AgentSettingsSyncPreset',
      options: claudeAgentPresetConstants.BEHAVIORS.AgentSettingsSyncPreset,
    },
    {
      enabled: true,
      behaviorName: 'PluginsCacheBustSyncPreset',
      options: claudeAgentPresetConstants.BEHAVIORS.PluginsCacheBustSyncPreset,
    },
  ],
};
