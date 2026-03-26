import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, test } from 'vite-plus/test';
import { clankgsterConfigDefaults } from '../configs/clankgster-config.defaults.js';
import { syncSourceLayoutsConfig } from './sync-source-layouts.config.js';
import { syncSourceLayouts } from './sync-source-layouts.js';

const sourceDefaults = clankgsterConfigDefaults.CONSTANTS.sourceDefaults;

describe('syncSourceLayouts', () => {
  test('getResolvedSourcePath normalizes sourceDir (backslashes, trailing slashes) like .clank', () => {
    const expected = syncSourceLayouts.getResolvedSourcePath({
      ...sourceDefaults,
      sourceDir: '.clank',
    });
    expect(
      syncSourceLayouts.getResolvedSourcePath({
        ...sourceDefaults,
        sourceDir: '.clank\\',
      })
    ).toEqual(expected);
    expect(
      syncSourceLayouts.getResolvedSourcePath({
        ...sourceDefaults,
        sourceDir: '.clank//',
      })
    ).toEqual(expected);
  });

  test('findSourceRoots treats backslashes in sourceDir like forward slashes', () => {
    const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'clank-find-source-root-'));
    const sourceDir = '.clank';
    fs.mkdirSync(path.join(repoRoot, sourceDir), { recursive: true });
    const normalizeRel = (value: string) => value.replace(/\\/g, '/');
    try {
      const withSlashes = syncSourceLayoutsConfig.findSourceRoots(
        repoRoot,
        sourceDir,
        [],
        normalizeRel
      );
      const withBackslashes = syncSourceLayoutsConfig.findSourceRoots(
        repoRoot,
        `${sourceDir}\\`,
        [],
        normalizeRel
      );
      expect(withBackslashes).toEqual(withSlashes);
    } finally {
      fs.rmSync(repoRoot, { recursive: true, force: true });
    }
  });
});
