import { clankgsterConfigDefaults } from '../core/configs/clankgster-config.defaults.js';

/**
 * Canonical public identifiers for the clankgster sync package and artifacts it writes.
 * Import this module instead of inlining `clankgster-sync` so renames stay consistent.
 */
export const clankgsterIdentity = {
  /** Agent plugin manifest directory used by Claude plugin discovery/writes. */
  AGENT_CLAUDE_PLUGIN_DIR_NAME: '.claude-plugin',

  /** Agent plugin manifest directory used by Cursor plugin discovery/writes. */
  AGENT_CURSOR_PLUGIN_DIR_NAME: '.cursor-plugin',

  /**
   * `name` field in generated local marketplace JSON (e.g. `.claude-plugin/marketplace.json`).
   * Matches the published CLI binary name (`package.json` → `bin`).
   */
  LOCAL_MARKETPLACE_NAME: clankgsterConfigDefaults.CONSTANTS.sourceDefaults.localMarketplaceName,

  /**
   * Token in e2e expected-manifest JSON; {@link clankgsterIdentity.resolveFixtureStrings} substitutes {@link LOCAL_MARKETPLACE_NAME}.
   */
  LOCAL_MARKETPLACE_NAME_FIXTURE_PLACEHOLDER: '__CLANKGSTER_LOCAL_MARKETPLACE_NAME__',

  /**
   * Default repo-relative directory for generated sync artifacts (e.g. unified `sync-manifest.json`).
   * Override via `syncCacheDir` in `clankgster.config.ts` or `CLANKGSTER_SYNC_CACHE_DIR`.
   */
  SYNC_CACHE_DIR: clankgsterConfigDefaults.CONSTANTS.syncCacheDir,

  /** Filename for the unified sync manifest inside {@link SYNC_CACHE_DIR} (or a custom `syncCacheDir`). */
  SYNC_MANIFEST_FILE_NAME: 'sync-manifest.json',

  /** Default repo-relative manifest path: `{@link SYNC_CACHE_DIR}/{@link SYNC_MANIFEST_FILE_NAME}`. */
  get defaultSyncManifestRelativePath(): string {
    return `${clankgsterIdentity.SYNC_CACHE_DIR}/${clankgsterIdentity.SYNC_MANIFEST_FILE_NAME}`;
  },

  /** Deep-replaces {@link LOCAL_MARKETPLACE_NAME_FIXTURE_PLACEHOLDER} in string leaves (e2e manifest fixtures). */
  resolveFixtureStrings(value: unknown): unknown {
    if (typeof value === 'string') {
      return value.replaceAll(
        clankgsterIdentity.LOCAL_MARKETPLACE_NAME_FIXTURE_PLACEHOLDER,
        clankgsterIdentity.LOCAL_MARKETPLACE_NAME
      );
    }
    if (Array.isArray(value)) {
      return value.map((item) => clankgsterIdentity.resolveFixtureStrings(item));
    }
    if (value !== null && typeof value === 'object') {
      return Object.fromEntries(
        Object.entries(value as Record<string, unknown>).map(([key, val]) => [
          key,
          clankgsterIdentity.resolveFixtureStrings(val),
        ])
      );
    }
    return value;
  },
} as const;
