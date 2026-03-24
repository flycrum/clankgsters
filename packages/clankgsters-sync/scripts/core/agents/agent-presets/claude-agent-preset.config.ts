import type { AgentPresetConfig } from './agent-preset.config.js';

/** Claude preset constants as a single source of truth. */
export const claudeAgentPresetConfig = {
  CONSTANTS: {
    AGENT_MARKETPLACE_FILE: '.claude-plugin/marketplace.json',
    AGENT_MARKETPLACE_SOURCE_FORMAT: 'prefixed',
    AGENT_NAME: 'claude',
    AGENT_RULES_DIR: '.claude/rules',
    AGENT_RULES_MARKDOWN_FRONTMATTER: undefined,
    AGENT_RULES_SYNC_MANIFEST: '.claude/.clankgsters-claude-sync.json',
    AGENT_SETTINGS_FILE: '.claude/settings.json',
    get AGENT_SETTINGS_MANIFEST_KEY() {
      return this.AGENT_NAME;
    },
    AGENT_SKILLS_DIR: '.claude/skills',
    GITIGNORE_COMMENT: '\n# clankgsters-sync: symlinked from AGENTS.md for Claude\n',
    get GITIGNORE_ENTRY() {
      return this.MARKDOWN_CONTEXT_TARGET_FILE_NAME;
    },
    MARKDOWN_CONTEXT_TARGET_FILE_NAME: 'CLAUDE.md',
    MARKDOWN_SECTION_FILE: undefined,
    MARKDOWN_SECTION_HEADING: undefined,
    PLUGIN_MANIFEST_DIR: '.claude-plugin',
    PLUGINS_CACHE_SEGMENTS: ['.claude', 'plugins', 'cache', 'local-plugins'],
    PLUGINS_DIRECTORY_TARGET_ROOT: undefined,
    SKILLS_DIRECTORY_SYNC_ENABLED: true,
  },
} as const satisfies AgentPresetConfig;
