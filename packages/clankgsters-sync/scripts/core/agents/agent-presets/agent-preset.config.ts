/** How each plugin `source` is written in marketplace JSON: `./`-prefixed vs plain repo-relative (see `MarketplaceJsonSyncPreset`). */
export type MarketplaceSourceFormat = 'prefixed' | 'relative';

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
    /** Sync agent key (e.g. `codex`) used in manifest and behavior routing. */
    AGENT_NAME: string;
    /** Optional comment block written before the gitignore line for generated symlinks. */
    GITIGNORE_COMMENT?: string;
    /** Optional bare filename appended to root `.gitignore` for symlink outputs (e.g. `AGENTS.md`). */
    GITIGNORE_ENTRY?: string;
    /** Optional root for locally mirrored plugin content (Cursor `.cursor/`). */
    LOCAL_CONTENT_TARGET_ROOT?: string;
    /** Optional path segments under the repo for local plugin cache dirs. */
    LOCAL_PLUGIN_CACHE_SEGMENTS?: readonly string[];
    /** Agent-native instruction filename; sync creates a symlink at this path to the canonical context file. */
    MARKDOWN_CONTEXT_TARGET_FILE_NAME: string;
    /** Markdown file that receives the generated marketplace plugins section (if set). */
    MARKDOWN_SECTION_FILE?: string;
    /** Heading string for the generated marketplace plugins section. */
    MARKDOWN_SECTION_HEADING?: string;
    /** Relative path to this agent’s marketplace JSON (e.g. `.codex/marketplace.json`). */
    MARKETPLACE_FILE: string;
    /** How plugin `source` paths are formatted in marketplace JSON (see `MarketplaceJsonSyncPreset`). */
    MARKETPLACE_SOURCE_FORMAT: MarketplaceSourceFormat;
    /** Native skills directory for this agent (e.g. `.codex/skills`). */
    NATIVE_SKILLS_DIR: string;
    /** Directory name for plugin manifests (e.g. `.codex-plugin`). */
    PLUGIN_MANIFEST_DIR: string;
    /** Optional YAML frontmatter prepended when materializing rules as `.mdc` (Cursor). */
    RULES_MARKDOWN_FRONTMATTER?: string;
    /** Agent rules directory where plugin rules are symlinked. */
    RULES_DIR: string;
    /** Optional sidecar JSON path for rules sync bookkeeping. */
    RULES_SYNC_MANIFEST?: string;
    /** Agent `settings.json` path under the repo. */
    SETTINGS_FILE: string;
    /** Manifest key naming this agent in sync output. */
    SETTINGS_MANIFEST_KEY: string;
    /** Whether the preset enables skills directory sync. */
    SKILLS_SYNC_ENABLED: boolean;
  };
}
