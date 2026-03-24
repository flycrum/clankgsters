import type { AgentPresetConfig } from './agent-preset.config.js';

/** Cursor preset constants as a single source of truth. */
export const cursorAgentPresetConfig = {
  CONSTANTS: {
    AGENT_MARKETPLACE_FILE: '.cursor/marketplace.json',
    AGENT_MARKETPLACE_SOURCE_FORMAT: 'prefixed',
    AGENT_NAME: 'cursor',
    AGENT_RULES_DIR: '.cursor/rules',
    AGENT_RULES_MARKDOWN_FRONTMATTER: '---\nalwaysApply: true\n---\n\n',
    AGENT_RULES_SYNC_MANIFEST: undefined,
    AGENT_SETTINGS_FILE: '.cursor/settings.json',
    get AGENT_SETTINGS_MANIFEST_KEY() {
      return this.AGENT_NAME;
    },
    AGENT_SKILLS_DIR: '.cursor/skills',
    GITIGNORE_COMMENT: undefined,
    GITIGNORE_ENTRY: undefined,
    MARKDOWN_CONTEXT_TARGET_FILE_NAME: 'CURSOR.md',
    MARKDOWN_SECTION_FILE: undefined,
    MARKDOWN_SECTION_HEADING: undefined,
    PLUGIN_MANIFEST_DIR: '.cursor-plugin',
    PLUGINS_DIRECTORY_TARGET_ROOT: '.cursor',
    SKILLS_DIRECTORY_SYNC_ENABLED: false,
  },
} as const satisfies AgentPresetConfig;
