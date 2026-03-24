/** How each plugin `source` is written in marketplace JSON: `./`-prefixed vs plain repo-relative (see `AgentMarketplaceJsonSyncPreset`). */
export type AgentMarketplaceSourceFormat = 'prefixed' | 'relative';

/**
 * Centralized runtime constants for one agent preset.
 *
 * Design rule:
 * - Keep keys behavior-oriented (for example `MARKDOWN_SECTION_HEADING`) instead of
 *   agent-oriented (for example `CODEX_SECTION_HEADING`).
 * - Runtime modules outside preset files should only consume these generic keys.
 */
export interface AgentPresetConfig {
  CONSTANTS: {
    /** Relative path to this agent’s marketplace JSON (e.g. `.codex/marketplace.json`). */
    AGENT_MARKETPLACE_FILE: string;
    /** How plugin `source` paths are formatted in marketplace JSON (see `AgentMarketplaceJsonSyncPreset`). */
    AGENT_MARKETPLACE_SOURCE_FORMAT: AgentMarketplaceSourceFormat;
    /** Sync agent key (e.g. `codex`) used in manifest and behavior routing. */
    AGENT_NAME: string;
    /** Agent rules directory where plugin rules are symlinked. */
    AGENT_RULES_DIR: string;
    /** Optional YAML frontmatter prepended when materializing rules as `.mdc` (Cursor). */
    AGENT_RULES_MARKDOWN_FRONTMATTER?: string;
    /** Optional sidecar JSON path for rules sync bookkeeping. */
    AGENT_RULES_SYNC_MANIFEST?: string;
    /** Agent `settings.json` path under the repo. */
    AGENT_SETTINGS_FILE: string;
    /** Manifest key naming this agent in sync output. */
    AGENT_SETTINGS_MANIFEST_KEY: string;
    /** Native skills directory for this agent (e.g. `.codex/skills`). */
    AGENT_SKILLS_DIR: string;
    /** Optional comment block written before the gitignore line for generated symlinks. */
    GITIGNORE_COMMENT?: string;
    /** Optional bare filename appended to root `.gitignore` for symlink outputs (e.g. `AGENTS.md`). */
    GITIGNORE_ENTRY?: string;
    /** Agent-native instruction filename; sync creates a symlink at this path to the canonical context file. */
    MARKDOWN_CONTEXT_TARGET_FILE_NAME: string;
    /** Markdown file that receives the generated marketplace plugins section (if set). */
    MARKDOWN_SECTION_FILE?: string;
    /** Heading string for the generated marketplace plugins section. */
    MARKDOWN_SECTION_HEADING?: string;
    /** Directory name for plugin manifests (e.g. `.codex-plugin`). */
    PLUGIN_MANIFEST_DIR: string;
    /** Optional path segments under the repo for plugin cache dirs. */
    PLUGINS_CACHE_SEGMENTS?: readonly string[];
    /** Optional root for mirrored plugin content outputs (Cursor `.cursor/`). */
    PLUGINS_DIRECTORY_TARGET_ROOT?: string;
    /** Whether the preset enables skills directory sync. */
    SKILLS_DIRECTORY_SYNC_ENABLED: boolean;
  };
}
