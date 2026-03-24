import { describe, expect, test } from 'vite-plus/test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { clankgstersIdentity } from '../../common/clankgsters-identity.js';
import { syncManifest } from './sync-manifest.js';

describe('syncManifest', () => {
  test('registerEntry upserts by behavior name', () => {
    const initial = syncManifest.emptyManifest();
    const result = syncManifest.registerEntry(
      initial,
      'cursor',
      'AgentRulesSymlinkSyncPreset',
      true
    );
    expect(result.isOk()).toBe(true);
    if (result.isErr()) return;
    expect(result.value.cursor?.AgentRulesSymlinkSyncPreset).toBe(true);
  });

  test('writes and reads unified manifest json', () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'clank-sync-manifest-'));
    const manifestPath = path.join(
      tempDir,
      clankgstersIdentity.SYNC_CACHE_DIR,
      clankgstersIdentity.SYNC_MANIFEST_FILE_NAME
    );
    const writeResult = syncManifest.write(manifestPath, {
      claude: {
        AgentSettingsSyncPreset: true,
      },
    });
    expect(writeResult.isOk()).toBe(true);
    const loadResult = syncManifest.load(manifestPath);
    expect(loadResult.isOk()).toBe(true);
    if (loadResult.isErr()) return;
    expect(loadResult.value.claude?.AgentSettingsSyncPreset).toBe(true);
  });
});
