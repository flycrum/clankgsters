import type { ClankgstersAgentConfig } from '../../configs/clankgsters-config.schema.js';
import type { AgentMarketplaceJsonSyncPresetOptions } from '../../sync-behaviors/presets/agent-marketplace-json-sync-preset.js';
import type { AgentRulesSymlinkSyncPresetOptions } from '../../sync-behaviors/presets/agent-rules-symlink-sync-preset.js';
import type { AgentSettingsSyncPresetOptions } from '../../sync-behaviors/presets/agent-settings-sync-preset.js';
import type { MarkdownSymlinkSyncPresetOptions } from '../../sync-behaviors/presets/markdown-symlink-sync-preset.js';
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
    AgentRulesSymlinkSyncPreset: {
      rulesDir: '.claude/rules',
      syncManifest: '.claude/.clankgsters-claude-sync.json',
    } satisfies AgentRulesSymlinkSyncPresetOptions,
    AgentSettingsSyncPreset: {
      manifestKey: 'claude',
      settingsFile: '.claude/settings.json',
    } satisfies AgentSettingsSyncPresetOptions,
    MarkdownSymlinkSyncPreset: {
      targetFile: 'CLAUDE.md',
      gitignoreComment: '\n# clankgsters-sync: symlinked from CLANK.md for Claude\n',
      gitignoreEntry: 'CLAUDE.md',
    } satisfies MarkdownSymlinkSyncPresetOptions,
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
export const claudeAgentPreset: ClankgstersAgentConfig = {
  enabled: true,
  behaviors: [
    {
      enabled: true,
      behaviorName: 'MarkdownSymlinkSyncPreset',
      options: claudeAgentPresetConstants.BEHAVIORS.MarkdownSymlinkSyncPreset,
    },
    {
      enabled: true,
      behaviorName: 'AgentMarketplaceJsonSyncPreset',
      options: claudeAgentPresetConstants.BEHAVIORS.AgentMarketplaceJsonSyncPreset,
    },
    {
      enabled: true,
      behaviorName: 'AgentRulesSymlinkSyncPreset',
      options: claudeAgentPresetConstants.BEHAVIORS.AgentRulesSymlinkSyncPreset,
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
