import { z } from 'zod';
import { clankgstersIdentity } from '../../common/clankgsters-identity.js';

const clankgstersBehaviorSchema = z.object({
  /** Stable behavior id used by the behavior registry (e.g. `rulesSymlink`, `settingsSync`). */
  name: z.string().min(1),
  /** Optional switch to disable a behavior while keeping its options in config. */
  enabled: z.boolean().optional().default(true),
  /** Optional manifest key override; defaults to `name` when omitted. */
  manifestKey: z.string().optional(),
  /** Serializable behavior options passed to the concrete behavior implementation. */
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
  sourceDir: z.string().optional().default('.clank'),
  /** Plugins directory under sourceDir (default: `plugins`). */
  pluginsDir: z.string().optional().default('plugins'),
  /** Skills directory under sourceDir (default: `skills`). */
  skillsDir: z.string().optional().default('skills'),
  /**
   * Repo-relative path to the canonical context markdown (default `CLANK.md`).
   * May be a basename (e.g. `CLANK.md`) or a nested path (e.g. `docs/guide.md`) depending on layout.
   */
  markdownContextFileName: z.string().optional().default('CLANK.md'),
  /**
   * `name` for generated local marketplace JSON and related manifest/settings linkage
   * (default {@link clankgstersIdentity.LOCAL_MARKETPLACE_NAME}).
   */
  localMarketplaceName: z.string().optional().default(clankgstersIdentity.LOCAL_MARKETPLACE_NAME),
  /** Marker filename that identifies a skill directory (default: `SKILL.md`). */
  skillFileName: z.string().optional().default('SKILL.md'),
});

const clankgstersConfigSchemaValueBase = z.object({
  /** Enables file logging for sync scripts when true. */
  loggingEnabled: z.boolean().optional().default(false),
  /** Named agent entries (coding-agent front-ends) and their behavior definitions. */
  agents: z.record(z.string(), clankgstersAgentSchema).default({}),
  /** Global source/layout defaults used by discovery and selected behaviors. */
  sourceDefaults: clankgstersSourceDefaultsSchema.default({
    localMarketplaceName: clankgstersIdentity.LOCAL_MARKETPLACE_NAME,
    markdownContextFileName: 'CLANK.md',
    pluginsDir: 'plugins',
    skillFileName: 'SKILL.md',
    skillsDir: 'skills',
    sourceDir: '.clank',
  }),
  /** Paths or globs excluded from sync/discovery (repo-relative strings). */
  excluded: z.array(z.string()).optional().default([]),
  /**
   * Repo-relative directory for generated sync cache (default {@link clankgstersIdentity.SYNC_CACHE_DIR}).
   * When `syncManifestPath` is omitted, it defaults to `{syncCacheDir}/{@link clankgstersIdentity.SYNC_MANIFEST_FILE_NAME}`.
   */
  syncCacheDir: z.string().optional().default(clankgstersIdentity.SYNC_CACHE_DIR),
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
  behavior: clankgstersBehaviorSchema,
  /** Schema for the merged root config object (logging, agents map, paths, etc.). */
  config: clankgstersConfigSchemaValue,
  /** Schema for source/layout defaults used by discovery and context behaviors. */
  sourceDefaults: clankgstersSourceDefaultsSchema,
};
