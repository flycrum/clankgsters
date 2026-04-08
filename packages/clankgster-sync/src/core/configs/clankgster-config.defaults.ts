import path from 'node:path';

/** Default `sourceDefaults` object; `sourceDir` is the single source for default cache and log directory roots. */
const DEFAULT_SOURCE_DEFAULTS = {
  /** `name` for generated local marketplace JSON and related manifest/settings linkage. */
  localMarketplaceName: 'clankgster-sync',
  /**
   * Repo-relative path to the canonical context markdown (default `CLANK.md`).
   * May be a basename (e.g. `CLANK.md`) or a nested path (e.g. `docs/guide.md`) depending on layout.
   */
  markdownContextFileName: 'CLANK.md',
  /**
   * Plugins directory name under `sourceDir` (default: `plugins`).
   *
   * Discovery supports both nested and shorthand layouts:
   * - Nested: `{sourceDir}/{pluginsDir}` and `{sourceDir}/{pluginsDir}.local`
   * - Shorthand sibling: `{sourceDir}-{pluginsDir}` and `{sourceDir}-{pluginsDir}.local`
   */
  pluginsDir: 'plugins',
  /** Marker filename that identifies a skill directory (default: `SKILL.md`). */
  skillFileName: 'SKILL.md',
  /**
   * Skills directory name under `sourceDir` (default: `skills`).
   *
   * Discovery supports both nested and shorthand layouts:
   * - Nested: `{sourceDir}/{skillsDir}` and `{sourceDir}/{skillsDir}.local`
   * - Shorthand sibling: `{sourceDir}-{skillsDir}` and `{sourceDir}-{skillsDir}.local`
   */
  skillsDir: 'skills',
  /** Root source directory for marketplace content (default: `.clank`). */
  sourceDir: '.clank',
} as const;

/** Central defaults for clankgster config authoring, schema defaults, and identity constants. */
export const clankgsterConfigDefaults = {
  CONSTANTS: {
    /** Default sync artifact mode, whether to copy or symlink files during sync, defaults to `copy` (`copy` enables transform hooks and content rewriting). */
    artifactMode: 'copy',
    /**
     * Repo-relative directory for generated sync cache artifacts (default: `{sourceDir}/.cache` using default `sourceDir`).
     */
    syncCacheDir: path.posix.join(DEFAULT_SOURCE_DEFAULTS.sourceDir, '.cache'),
    /** Whether copied outputs are marked read-only after write by default. */
    syncOutputReadOnly: false,
    /** Default source directory and layout settings for sync behavior. */
    sourceDefaults: DEFAULT_SOURCE_DEFAULTS,
    /** Default transform-level configuration values. */
    transforms: {
      templateVariables: {
        closingDelimiterToken: ']]]',
        openingDelimiterToken: '[[[',
      },
    },
  },
} as const;
