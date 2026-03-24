import type { ClankgstersAgentConfig } from '../../configs/clankgsters-config.schema.js';
import { claudeAgentPresetConfig } from './claude-agent-preset.config.js';

const { CONSTANTS } = claudeAgentPresetConfig;

/** Default Claude preset behaviors for sync runs. */
export const claudeAgentPreset: ClankgstersAgentConfig = {
  enabled: true,
  behaviors: [
    {
      enabled: true,
      behaviorName: 'MarkdownContextSymlinkSyncPreset',
      options: {
        targetFile: CONSTANTS.MARKDOWN_CONTEXT_TARGET_FILE_NAME,
        gitignoreComment: CONSTANTS.GITIGNORE_COMMENT,
        gitignoreEntry: CONSTANTS.GITIGNORE_ENTRY,
      },
    },
    {
      enabled: true,
      behaviorName: 'MarketplaceJsonSyncPreset',
      options: {
        manifestKey: CONSTANTS.SETTINGS_MANIFEST_KEY,
        marketplaceFile: CONSTANTS.MARKETPLACE_FILE,
        sourceFormat: CONSTANTS.MARKETPLACE_SOURCE_FORMAT,
      },
    },
    {
      enabled: true,
      behaviorName: 'RulesSymlinkSyncPreset',
      options: {
        rulesDir: CONSTANTS.RULES_DIR,
        syncManifest: CONSTANTS.RULES_SYNC_MANIFEST,
      },
    },
    { enabled: true, behaviorName: 'SkillsDirectorySyncPreset', options: {} },
    {
      enabled: true,
      behaviorName: 'SettingsSyncPreset',
      options: {
        manifestKey: CONSTANTS.SETTINGS_MANIFEST_KEY,
        settingsFile: CONSTANTS.SETTINGS_FILE,
      },
    },
    { enabled: true, behaviorName: 'LocalPluginCacheBustPreset', options: {} },
  ],
};
