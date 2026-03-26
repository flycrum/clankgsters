import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, test } from 'vite-plus/test';
import type { SeedingPrefabApplyContext } from './seeding-prefab-orchestration.types.js';
import { seedingPrefabOrchestration } from './seeding-prefab-orchestration.js';

const tempPaths: string[] = [];

afterEach(() => {
  for (const tempPath of tempPaths) {
    if (fs.existsSync(tempPath)) fs.rmSync(tempPath, { force: true, recursive: true });
  }
  tempPaths.length = 0;
});

function createContext(caseOutputRoot: string): SeedingPrefabApplyContext {
  return {
    caseIndex: 1,
    caseName: 'unit',
    caseOutputRoot,
    packageRoot: caseOutputRoot,
    repoRoot: caseOutputRoot,
  };
}

describe('seedingPrefabOrchestration', () => {
  test('throws when no explicit action is available', () => {
    expect(() =>
      seedingPrefabOrchestration.resolvePrepareConfig(
        {
          groups: [
            {
              entries: [
                {
                  id: 'entry',
                  run: () => {},
                },
              ],
              id: 'group',
            },
          ],
        },
        'UnitPrepare'
      )
    ).toThrow(/missing an explicit action/);
  });

  test('throws when replace action has no replace roots', () => {
    expect(() =>
      seedingPrefabOrchestration.resolvePrepareConfig(
        {
          groups: [
            {
              action: 'replace',
              entries: [
                {
                  id: 'entry',
                  run: () => {},
                },
              ],
              id: 'group',
            },
          ],
        },
        'UnitPrepare'
      )
    ).toThrow(/replace action requires replaceRoots/);
  });

  test('applies replace roots before entry run', () => {
    const sandboxRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'clank-prefab-prepare-'));
    tempPaths.push(sandboxRoot);
    fs.mkdirSync(path.join(sandboxRoot, '.clank', 'plugins'), { recursive: true });
    fs.writeFileSync(path.join(sandboxRoot, '.clank', 'plugins', 'old.txt'), 'old', 'utf8');

    const resolvedPrepare = seedingPrefabOrchestration.resolvePrepareConfig(
      {
        groups: [
          {
            action: 'replace',
            entries: [
              {
                id: 'replace-entry',
                run: (context) => {
                  fs.mkdirSync(path.join(context.caseOutputRoot, '.yoyo'), { recursive: true });
                  fs.writeFileSync(
                    path.join(context.caseOutputRoot, '.yoyo', 'new.txt'),
                    'new',
                    'utf8'
                  );
                },
                scope: { replaceRoots: ['.clank'] },
              },
            ],
            id: 'replace-group',
          },
        ],
      },
      'UnitPrepare'
    );

    seedingPrefabOrchestration.runResolvedPrepare(
      createContext(sandboxRoot),
      resolvedPrepare,
      sandboxRoot
    );

    expect(fs.existsSync(path.join(sandboxRoot, '.clank'))).toBe(false);
    expect(fs.existsSync(path.join(sandboxRoot, '.yoyo', 'new.txt'))).toBe(true);
  });
});
