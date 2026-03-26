import { describe, expect, test } from 'vite-plus/test';
import { clankgsterIdentity } from '../../common/clankgster-identity.js';
import { clankgsterConfigDefaults } from './clankgster-config.defaults.js';
import { clankgsterConfig } from './clankgster-config.js';
import type { ClankgsterConfig } from './clankgster-config.schema.js';
import { clankgsterConfigResolver } from './config-resolver.js';
import type { ClankgsterConfigSource } from './config-source.js';

describe('clankgsterConfigResolver', () => {
  test('resolves and validates defaults', async () => {
    const result = await clankgsterConfigResolver.resolve({
      mode: 'sync',
      repoRoot: process.cwd(),
    });
    expect(result.isOk()).toBe(true);
    if (result.isErr()) return;
    expect(typeof result.value.resolvedConfig.loggingEnabled).toBe('boolean');
    expect(result.value.resolvedConfig.syncCacheDir).toBe(clankgsterIdentity.SYNC_CACHE_DIR);
    expect(result.value.resolvedConfig.syncManifestPath).toBe(
      clankgsterIdentity.defaultSyncManifestRelativePath
    );
    expect(result.value.resolvedConfig.sourceDefaults.sourceDir).toBe(
      clankgsterConfigDefaults.CONSTANTS.sourceDefaults.sourceDir
    );
    expect(result.value.resolvedConfig.sourceDefaults.markdownContextFileName).toBe(
      clankgsterConfigDefaults.CONSTANTS.sourceDefaults.markdownContextFileName
    );
    expect(result.value.resolvedConfig.sourceDefaults.localMarketplaceName).toBe(
      clankgsterIdentity.LOCAL_MARKETPLACE_NAME
    );
  });

  test('derives syncManifestPath under syncCacheDir when manifest path omitted', () => {
    const result = clankgsterConfigResolver.validateShape(
      clankgsterConfig.define({ syncCacheDir: 'my-cache' })
    );
    expect(result.isOk()).toBe(true);
    if (result.isErr()) return;
    expect(result.value.syncCacheDir).toBe('my-cache');
    expect(result.value.syncManifestPath).toBe(
      `my-cache/${clankgsterIdentity.SYNC_MANIFEST_FILE_NAME}`
    );
  });

  test('merges agents per name so later layer cannot drop prior behavior list', async () => {
    const sources: ClankgsterConfigSource[] = [
      {
        id: 'base',
        priority: 10,
        load: () => ({
          agents: {
            claude: {
              enabled: true,
              behaviors: [
                { enabled: true, behaviorName: 'AgentRulesSymlinkSyncPreset', options: {} },
              ],
            },
          },
        }),
      },
      {
        id: 'overlay',
        priority: 20,
        load: () =>
          ({
            agents: { claude: { enabled: false } },
          }) as unknown as Partial<ClankgsterConfig>,
      },
    ];
    const result = await clankgsterConfigResolver.resolve(
      { mode: 'sync', repoRoot: process.cwd() },
      sources
    );
    expect(result.isOk()).toBe(true);
    if (result.isErr()) return;
    const claude = result.value.resolvedConfig.agents.claude;
    expect(claude?.enabled).toBe(false);
    expect(claude?.behaviors).toHaveLength(1);
    expect(claude?.behaviors[0]?.behaviorName).toBe('AgentRulesSymlinkSyncPreset');
  });
});
