import { describe, expect, test } from 'vite-plus/test';
import { clankgstersIdentity } from '../../common/clankgsters-identity.js';
import { clankgstersConfigDefaults } from './clankgsters-config.defaults.js';
import { clankgstersConfig } from './clankgsters-config.js';
import type { ClankgstersConfig } from './clankgsters-config.schema.js';
import { clankgstersConfigResolver } from './config-resolver.js';
import type { ClankgstersConfigSource } from './config-source.js';

describe('clankgstersConfigResolver', () => {
  test('resolves and validates defaults', async () => {
    const result = await clankgstersConfigResolver.resolve({
      mode: 'sync',
      repoRoot: process.cwd(),
    });
    expect(result.isOk()).toBe(true);
    if (result.isErr()) return;
    expect(typeof result.value.resolvedConfig.loggingEnabled).toBe('boolean');
    expect(result.value.resolvedConfig.syncCacheDir).toBe(clankgstersIdentity.SYNC_CACHE_DIR);
    expect(result.value.resolvedConfig.syncManifestPath).toBe(
      clankgstersIdentity.defaultSyncManifestRelativePath
    );
    expect(result.value.resolvedConfig.sourceDefaults.sourceDir).toBe(
      clankgstersConfigDefaults.CONSTANTS.sourceDefaults.sourceDir
    );
    expect(result.value.resolvedConfig.sourceDefaults.markdownContextFileName).toBe(
      clankgstersConfigDefaults.CONSTANTS.sourceDefaults.markdownContextFileName
    );
    expect(result.value.resolvedConfig.sourceDefaults.localMarketplaceName).toBe(
      clankgstersIdentity.LOCAL_MARKETPLACE_NAME
    );
  });

  test('derives syncManifestPath under syncCacheDir when manifest path omitted', () => {
    const result = clankgstersConfigResolver.validateShape(
      clankgstersConfig.define({ syncCacheDir: 'my-cache' })
    );
    expect(result.isOk()).toBe(true);
    if (result.isErr()) return;
    expect(result.value.syncCacheDir).toBe('my-cache');
    expect(result.value.syncManifestPath).toBe(
      `my-cache/${clankgstersIdentity.SYNC_MANIFEST_FILE_NAME}`
    );
  });

  test('merges agents per name so later layer cannot drop prior behavior list', async () => {
    const sources: ClankgstersConfigSource[] = [
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
          }) as unknown as Partial<ClankgstersConfig>,
      },
    ];
    const result = await clankgstersConfigResolver.resolve(
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
