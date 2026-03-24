/**
 * Canonical public identifiers for the clankgsters sync package and artifacts it writes.
 * Import this module instead of inlining `clankgsters-sync` so renames stay consistent.
 */
export const clankgstersIdentity = {
  /**
   * `name` field in generated local marketplace JSON (e.g. `.claude-plugin/marketplace.json`).
   * Matches the published CLI binary name (`package.json` → `bin`).
   */
  LOCAL_MARKETPLACE_NAME: 'clankgsters-sync',

  /**
   * Default repo-relative directory for generated sync artifacts (e.g. unified `sync-manifest.json`).
   * Override via `syncCacheDir` in `clankgsters.config.ts` or `CLANKGSTERS_SYNC_CACHE_DIR`.
   */
  SYNC_CACHE_DIR: '.clankgsters-cache',

  /** Filename for the unified sync manifest inside {@link SYNC_CACHE_DIR} (or a custom `syncCacheDir`). */
  SYNC_MANIFEST_FILE_NAME: 'sync-manifest.json',

  /** Default repo-relative manifest path: `{@link SYNC_CACHE_DIR}/{@link SYNC_MANIFEST_FILE_NAME}`. */
  get defaultSyncManifestRelativePath(): string {
    return `${clankgstersIdentity.SYNC_CACHE_DIR}/${clankgstersIdentity.SYNC_MANIFEST_FILE_NAME}`;
  },

  /**
   * Token in e2e expected-manifest JSON; {@link clankgstersIdentity.resolveFixtureStrings} substitutes {@link LOCAL_MARKETPLACE_NAME}.
   */
  LOCAL_MARKETPLACE_NAME_FIXTURE_PLACEHOLDER: '__CLANKGSTERS_LOCAL_MARKETPLACE_NAME__',

  /** Deep-replaces {@link LOCAL_MARKETPLACE_NAME_FIXTURE_PLACEHOLDER} in string leaves (e2e manifest fixtures). */
  resolveFixtureStrings(value: unknown): unknown {
    if (typeof value === 'string') {
      return value.replaceAll(
        clankgstersIdentity.LOCAL_MARKETPLACE_NAME_FIXTURE_PLACEHOLDER,
        clankgstersIdentity.LOCAL_MARKETPLACE_NAME
      );
    }
    if (Array.isArray(value)) {
      return value.map((item) => clankgstersIdentity.resolveFixtureStrings(item));
    }
    if (value !== null && typeof value === 'object') {
      return Object.fromEntries(
        Object.entries(value as Record<string, unknown>).map(([key, val]) => [
          key,
          clankgstersIdentity.resolveFixtureStrings(val),
        ])
      );
    }
    return value;
  },
} as const;
