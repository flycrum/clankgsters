import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, test } from 'vite-plus/test';
import { e2ePathHelpers } from './e2e-path-helpers.js';
import { e2eTestCaseDiscovery } from './e2e-test-case-discovery.js';

const tempPaths: string[] = [];

afterEach(() => {
  for (const tempPath of tempPaths) {
    if (fs.existsSync(tempPath)) fs.rmSync(tempPath, { recursive: true, force: true });
  }
  tempPaths.length = 0;
});

describe('e2eTestCaseDiscovery', () => {
  test('discoverCases returns empty when root has no valid cases', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'clank-e2e-disc-'));
    tempPaths.push(root);
    expect(e2eTestCaseDiscovery.discoverCases(root)).toEqual([]);
  });

  test('discoverCases skips dot dirs, files, and dirs without case-config', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'clank-e2e-disc-'));
    tempPaths.push(root);
    fs.mkdirSync(path.join(root, '.hidden'));
    fs.writeFileSync(path.join(root, '.hidden', e2ePathHelpers.CASE_CONFIG_FILE_NAME), '');
    fs.writeFileSync(path.join(root, 'plain-file.txt'), '');
    fs.mkdirSync(path.join(root, 'no-config'));
    fs.mkdirSync(path.join(root, 'has-config'));
    fs.writeFileSync(
      path.join(root, 'has-config', e2ePathHelpers.CASE_CONFIG_FILE_NAME),
      'export const testCase = {}\n',
      'utf8'
    );
    const found = e2eTestCaseDiscovery.discoverCases(root);
    expect(found).toHaveLength(1);
    expect(found[0]?.caseId).toBe('has-config');
  });

  test('discoverCases sorts by caseId and returns absolute paths', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'clank-e2e-disc-'));
    tempPaths.push(root);
    for (const caseId of ['zebra', 'alpha']) {
      const caseDir = path.join(root, caseId);
      fs.mkdirSync(caseDir);
      fs.writeFileSync(path.join(caseDir, e2ePathHelpers.CASE_CONFIG_FILE_NAME), '');
    }
    const found = e2eTestCaseDiscovery.discoverCases(root);
    expect(found.map((entry) => entry.caseId)).toEqual(['alpha', 'zebra']);
    expect(found[0]?.caseDir).toBe(path.join(root, 'alpha'));
    expect(found[0]?.caseConfigPath).toBe(
      path.join(root, 'alpha', e2ePathHelpers.CASE_CONFIG_FILE_NAME)
    );
  });
});
