import type { ClankgstersAgentConfig } from '../../configs/clankgsters-config.schema.js';
import { claudeAgentPresetConfig } from './claude-agent-preset.config.js';

const { CONSTANTS } = claudeAgentPresetConfig;

/** Default Claude preset behaviors for sync runs. */
export const claudeAgentPreset: ClankgstersAgentConfig = {
  enabled: true,
  behaviors: [
    {
      enabled: true,
      behaviorName: 'MarkdownSymlinkSyncPreset',
      options: {
        targetFile: CONSTANTS.MARKDOWN_CONTEXT_TARGET_FILE_NAME,
        gitignoreComment: CONSTANTS.GITIGNORE_COMMENT,
        gitignoreEntry: CONSTANTS.GITIGNORE_ENTRY,
      },
    },
    {
      enabled: true,
      behaviorName: 'AgentMarketplaceJsonSyncPreset',
      options: {
        manifestKey: CONSTANTS.AGENT_SETTINGS_MANIFEST_KEY,
        marketplaceFile: CONSTANTS.AGENT_MARKETPLACE_FILE,
        sourceFormat: CONSTANTS.AGENT_MARKETPLACE_SOURCE_FORMAT,
      },
    },
    {
      enabled: true,
      behaviorName: 'AgentRulesSymlinkSyncPreset',
      options: {
        rulesDir: CONSTANTS.AGENT_RULES_DIR,
        syncManifest: CONSTANTS.AGENT_RULES_SYNC_MANIFEST,
      },
    },
    { enabled: true, behaviorName: 'SkillsDirectorySyncPreset', options: {} },
    {
      enabled: true,
      behaviorName: 'AgentSettingsSyncPreset',
      options: {
        manifestKey: CONSTANTS.AGENT_SETTINGS_MANIFEST_KEY,
        settingsFile: CONSTANTS.AGENT_SETTINGS_FILE,
      },
    },
    { enabled: true, behaviorName: 'PluginsCacheBustSyncPreset', options: {} },
  ],
};
