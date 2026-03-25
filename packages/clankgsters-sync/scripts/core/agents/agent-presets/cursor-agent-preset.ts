import type { ClankgstersAgentConfig } from '../../configs/clankgsters-config.schema.js';
import type { PluginsDirectorySyncPresetOptions } from '../../sync-behaviors/presets/plugins-directory-sync-preset.js';
import type { SkillsDirectorySyncPresetOptions } from '../../sync-behaviors/presets/skills-directory-sync-preset.js';
import { defineAgentConstants } from './define-agent-constants.js';

/** Cursor preset constants consumed by default behavior option wiring. */
export const cursorAgentPresetConstants = defineAgentConstants({
  COMMON: {
    AGENT_NAME: 'cursor',
    AGENT_MARKDOWN_CONTEXT_FILE_NAME: 'CURSOR.md',
    AGENT_PLUGIN_MANIFEST_DIR: '.cursor-plugin',
  },
  BEHAVIORS: {
    PluginsDirectorySyncPreset: {
      rulesMarkdownFrontmatter: '---\nalwaysApply: true\n---\n\n',
      targetRoot: '.cursor',
    } satisfies PluginsDirectorySyncPresetOptions,
    SkillsDirectorySyncPreset: {
      nativeSkillsDir: '.cursor/skills',
      skillsDirectorySyncEnabled: true,
    } satisfies SkillsDirectorySyncPresetOptions,
  },
});

/** Default Cursor preset behaviors for sync runs. */
export const cursorAgentPreset: ClankgstersAgentConfig = {
  enabled: true,
  behaviors: [
    {
      enabled: true,
      behaviorName: 'SkillsDirectorySyncPreset',
      options: cursorAgentPresetConstants.BEHAVIORS.SkillsDirectorySyncPreset,
    },
    {
      enabled: true,
      behaviorName: 'PluginsDirectorySyncPreset',
      options: cursorAgentPresetConstants.BEHAVIORS.PluginsDirectorySyncPreset,
    },
  ],
};
