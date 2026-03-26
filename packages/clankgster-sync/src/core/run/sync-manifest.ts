import { isPlainObject } from 'lodash-es';
import { err, ok, type Result } from 'neverthrow';
import fs from 'node:fs';
import path from 'node:path';
import { clankgsterIdentity } from '../../common/clankgster-identity.js';
import { pathHelpers } from '../../common/path-helpers.js';
import { syncFs } from '../../common/sync-fs.js';

/**
 * One behavior entry in the unified sync manifest (boolean marker or structured payload).
 *
 * Convention for layout-aware presets:
 * - `symlinks` / `fsAutoRemoval` remain flattened unions used by clear teardown
 * - `customData` may store per-layout slices (e.g. `nestedRegular`, `nestedLocal`, `shorthandRegular`, `shorthandLocal`)
 */
export type SyncManifestEntry =
  | true
  | {
      customData?: unknown;
      fsAutoRemoval?: string[];
      fsManualRemoval?: string[];
      options?: Record<string, unknown>;
      symlinks?: string[];
    };

/** Full manifest shape: agent -> behavior name (preset class name) -> entry payload. */
export type SyncManifest = Record<string, Record<string, SyncManifestEntry>>;

/**
 * Manifest API contracts and no-op persistence used by sync architecture.
 *
 * Invariants:
 * - Keep function signatures stable for a future real storage implementation.
 * - Prefer pure behavior where possible to simplify machine tests.
 */
export const syncManifest = {
  /** Absolute path to the manifest JSON under `repoRoot`, using `overridePath` or the default relative file. */
  getManifestPath(repoRoot: string, overridePath?: string): string {
    return path.resolve(
      repoRoot,
      overridePath ?? clankgsterIdentity.defaultSyncManifestRelativePath
    );
  },
  /** Reads and validates the manifest object from disk; missing/invalid files resolve to an empty manifest. */
  load(manifestPath: string): Result<SyncManifest, Error> {
    try {
      if (!fs.existsSync(manifestPath)) return ok({});
      const raw = fs.readFileSync(manifestPath, 'utf8');
      const parsed = JSON.parse(raw) as unknown;
      if (!isPlainObject(parsed)) return ok({});
      return ok(parsed as SyncManifest);
    } catch (error) {
      return err(error instanceof Error ? error : new Error(String(error)));
    }
  },
  /** Persists the manifest JSON to disk and ensures parent directories exist. */
  write(manifestPath: string, manifest: SyncManifest): Result<void, Error> {
    try {
      fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
      fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
      return ok(undefined);
    } catch (error) {
      return err(error instanceof Error ? error : new Error(String(error)));
    }
  },
  /** Returns a new manifest with one behavior entry upserted for a specific agent / behavior name. */
  registerEntry(
    manifest: SyncManifest,
    agent: string,
    behaviorName: string,
    entry: SyncManifestEntry
  ): Result<SyncManifest, Error> {
    const existing = manifest[agent] ?? {};
    return ok({
      ...manifest,
      [agent]: {
        ...existing,
        [behaviorName]: entry,
      },
    });
  },
  /** Removes one agent entry from the manifest; no-op when the agent key is absent. */
  clearAgent(manifest: SyncManifest, agent: string): SyncManifest {
    const { [agent]: _removed, ...rest } = manifest;
    return rest;
  },
  /** Tears down files/symlinks recorded in one manifest entry (best effort and idempotent). */
  teardownEntry(repoRoot: string, entry: SyncManifestEntry): void {
    if (entry === true || typeof entry !== 'object') return;
    const rootAbs = path.resolve(repoRoot);
    for (const relPath of entry.symlinks ?? []) {
      const fullPath = path.resolve(rootAbs, relPath);
      if (!pathHelpers.isResolvedPathUnderRoot(rootAbs, fullPath)) continue;
      syncFs.unlinkIfExists(fullPath);
      syncFs.pruneEmptyParentDirs(fullPath, rootAbs);
    }
    for (const relPath of entry.fsAutoRemoval ?? []) {
      const fullPath = path.resolve(rootAbs, relPath);
      if (!pathHelpers.isResolvedPathUnderRoot(rootAbs, fullPath)) continue;
      syncFs.removePathIfExists(fullPath);
      syncFs.pruneEmptyParentDirs(fullPath, rootAbs);
    }
  },
  /** Tears down all behavior entries for one agent manifest bucket. */
  teardownAgentEntries(repoRoot: string, manifestByAgent: Record<string, SyncManifestEntry>): void {
    for (const entry of Object.values(manifestByAgent)) {
      this.teardownEntry(repoRoot, entry);
    }
  },
  /** Empty manifest object suitable before the first load or after a reset. */
  emptyManifest(): SyncManifest {
    return {};
  },
};
