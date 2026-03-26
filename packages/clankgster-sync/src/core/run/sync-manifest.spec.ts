import { describe, expect, test } from 'vite-plus/test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { clankgsterIdentity } from '../../common/clankgster-identity.js';
import { syncManifest } from './sync-manifest.js';

describe('syncManifest', () => {
  test('registerEntry upserts by behavior name', () => {
    const initial = syncManifest.emptyManifest();
    const result = syncManifest.registerEntry(
      initial,
      'cursor',
      'AgentRulesDirectorySyncPreset',
      true
    );
    expect(result.isOk()).toBe(true);
    if (result.isErr()) return;
    expect(result.value.cursor?.AgentRulesDirectorySyncPreset).toBe(true);
  });

  test('writes and reads unified manifest json', () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'clank-sync-manifest-'));
    const manifestPath = path.join(
      tempDir,
      clankgsterIdentity.SYNC_CACHE_DIR,
      clankgsterIdentity.SYNC_MANIFEST_FILE_NAME
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

  test('teardownEntry ignores symlink paths that would escape repoRoot', () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'clank-sync-teardown-'));
    const outside = path.join(tempDir, 'outside');
    const victim = path.join(outside, 'keep-me.txt');
    fs.mkdirSync(outside, { recursive: true });
    fs.writeFileSync(victim, 'x', 'utf8');
    const safeDir = path.join(tempDir, 'repo');
    fs.mkdirSync(safeDir, { recursive: true });
    const safeLink = path.join(safeDir, 'ok.txt');
    fs.writeFileSync(safeLink, 'y', 'utf8');

    syncManifest.teardownEntry(safeDir, {
      symlinks: ['../../outside/keep-me.txt', 'ok.txt'],
    });

    expect(fs.existsSync(victim)).toBe(true);
    expect(fs.existsSync(safeLink)).toBe(false);
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  test('teardownEntry removes copied paths listed in copies', () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'clank-sync-copies-'));
    const repoRoot = path.join(tempDir, 'repo');
    fs.mkdirSync(repoRoot, { recursive: true });
    const copiedFile = path.join(repoRoot, '.cursor', 'rules', 'plugin', 'rule.mdc');
    fs.mkdirSync(path.dirname(copiedFile), { recursive: true });
    fs.writeFileSync(copiedFile, 'rule', 'utf8');

    syncManifest.teardownEntry(repoRoot, {
      copies: ['.cursor/rules/plugin/rule.mdc'],
    });

    expect(fs.existsSync(copiedFile)).toBe(false);
    fs.rmSync(tempDir, { recursive: true, force: true });
  });
});
