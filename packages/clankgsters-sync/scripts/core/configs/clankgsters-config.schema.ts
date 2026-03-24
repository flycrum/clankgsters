import { z } from 'zod';
import { clankgstersIdentity } from '../../common/clankgsters-identity.js';
import { clankgstersConfigDefaults } from './clankgsters-config.defaults.js';

const clankgstersBehaviorSchema = z.object({
  /**
   * Preset class name used as registry id and as the key under each agent in `sync-manifest.json` (e.g.
   * `AgentRulesSymlinkSyncPreset`, `AgentSettingsSyncPreset`).
   */
  behaviorName: z.string().min(1),
  /** Optional switch to disable a behavior while keeping its options in config. */
  enabled: z.boolean().optional().default(true),
  /** Serializable behavior options passed to the concrete preset implementation. */
  options: z.record(z.string(), z.unknown()).optional().default({}),
});

const clankgstersAgentSchema = z.object({
  /** When false, this agent is skipped for the current run. */
  enabled: z.boolean().optional().default(true),
  /** Ordered behavior definitions to run for this agent. */
  behaviors: z.array(clankgstersBehaviorSchema).optional().default([]),
});

const clankgstersSourceDefaultsSchema = z.object({
  /** Root source directory for marketplace content (default: `.clank`). */
  sourceDir: z
    .string()
    .optional()
    .default(clankgstersConfigDefaults.CONSTANTS.sourceDefaults.sourceDir),
  /**
   * Plugins directory name under `sourceDir` (default: `plugins`).
   *
   * Discovery supports both nested and shorthand layouts:
   * - Nested: `{sourceDir}/{pluginsDir}` and `{sourceDir}/{pluginsDir}.local`
   * - Shorthand sibling: `{sourceDir}-{pluginsDir}` and `{sourceDir}-{pluginsDir}.local`
   */
  pluginsDir: z
    .string()
    .optional()
    .default(clankgstersConfigDefaults.CONSTANTS.sourceDefaults.pluginsDir),
  /**
   * Skills directory name under `sourceDir` (default: `skills`).
   *
   * Discovery supports both nested and shorthand layouts:
   * - Nested: `{sourceDir}/{skillsDir}` and `{sourceDir}/{skillsDir}.local`
   * - Shorthand sibling: `{sourceDir}-{skillsDir}` and `{sourceDir}-{skillsDir}.local`
   */
  skillsDir: z
    .string()
    .optional()
    .default(clankgstersConfigDefaults.CONSTANTS.sourceDefaults.skillsDir),
  /**
   * Repo-relative path to the canonical context markdown (default `CLANK.md`).
   * May be a basename (e.g. `CLANK.md`) or a nested path (e.g. `docs/guide.md`) depending on layout.
   */
  markdownContextFileName: z
    .string()
    .optional()
    .default(clankgstersConfigDefaults.CONSTANTS.sourceDefaults.markdownContextFileName),
  /**
   * `name` for generated local marketplace JSON and related manifest/settings linkage
   * (default {@link clankgstersIdentity.LOCAL_MARKETPLACE_NAME}).
   */
  localMarketplaceName: z
    .string()
    .optional()
    .default(clankgstersConfigDefaults.CONSTANTS.sourceDefaults.localMarketplaceName),
  /** Marker filename that identifies a skill directory (default: `SKILL.md`). */
  skillFileName: z
    .string()
    .optional()
    .default(clankgstersConfigDefaults.CONSTANTS.sourceDefaults.skillFileName),
});

const clankgstersConfigSchemaValueBase = z.object({
  /** Named agent entries (coding-agent front-ends) and their behavior definitions. */
  agents: z.record(z.string(), clankgstersAgentSchema).default({}),
  /** Enables file logging for sync scripts when true. */
  loggingEnabled: z.boolean().optional().default(false),
  /** Global source/layout defaults used by discovery and selected behaviors. */
  sourceDefaults: clankgstersSourceDefaultsSchema.default({
    ...clankgstersConfigDefaults.CONSTANTS.sourceDefaults,
  }),
  /** Paths or globs excluded from sync/discovery (repo-relative strings). */
  excluded: z.array(z.string()).optional().default([]),
  /**
   * Repo-relative directory for generated sync cache (default {@link clankgstersIdentity.SYNC_CACHE_DIR}).
   * When `syncManifestPath` is omitted, it defaults to `{syncCacheDir}/{@link clankgstersIdentity.SYNC_MANIFEST_FILE_NAME}`.
   */
  syncCacheDir: z.string().optional().default(clankgstersConfigDefaults.CONSTANTS.syncCacheDir),
  /** Path to the sync manifest JSON, relative to the repo root unless absolute; defaults under `syncCacheDir`. */
  syncManifestPath: z.string().optional(),
  /** Optional root for sync outputs (e.g. logs); defaults to repo root when unset. */
  syncOutputRoot: z.string().optional(),
});

const clankgstersConfigSchemaValue = clankgstersConfigSchemaValueBase.transform((data) => ({
  ...data,
  syncManifestPath:
    data.syncManifestPath ?? `${data.syncCacheDir}/${clankgstersIdentity.SYNC_MANIFEST_FILE_NAME}`,
}));

export type ClankgstersBehaviorConfig = z.infer<typeof clankgstersBehaviorSchema>;
export type ClankgstersAgentConfig = z.infer<typeof clankgstersAgentSchema>;
export type ClankgstersSourceDefaultsConfig = z.infer<typeof clankgstersSourceDefaultsSchema>;
export type ClankgstersConfig = z.infer<typeof clankgstersConfigSchemaValue>;

/** Zod entry points: single-agent shape vs full repo config (see `ClankgstersAgentConfig` / `ClankgstersConfig`). */
export const clankgstersConfigSchema = {
  /** Schema for one agent entry under `ClankgstersConfig.agents`. */
  agent: clankgstersAgentSchema,
  /** Schema for one behavior definition under `ClankgstersAgentConfig.behaviors`. */
  behaviorSchema: clankgstersBehaviorSchema,
  /** Schema for the merged root config object (logging, agents map, paths, etc.). */
  config: clankgstersConfigSchemaValue,
  /** Schema for source/layout defaults used by discovery and context behaviors. */
  sourceDefaults: clankgstersSourceDefaultsSchema,
};
