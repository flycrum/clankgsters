/** Central defaults for clankgsters config authoring, schema defaults, and identity constants. */
export const clankgstersConfigDefaults = {
  CONSTANTS: {
    /** Repo-relative directory for generated sync cache artifacts (default: `.clankgsters-cache`). */
    syncCacheDir: '.clankgsters-cache',
    /** Default source directory and layout settings for sync behavior. */
    sourceDefaults: {
      /** `name` for generated local marketplace JSON and related manifest/settings linkage. */
      localMarketplaceName: 'clankgsters-sync',
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
    },
  },
} as const;
