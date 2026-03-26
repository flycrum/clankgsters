import type { JsonValue } from 'type-fest';
import { describe, expect, test } from 'vite-plus/test';
import type { DiffJsonObjectsReport } from './diff-json-objects.config.js';
import { diffJsonObjectsConfig } from './diff-json-objects.config.js';

/** Runs {@link diffJsonObjectsConfig.compareAtDepth} from the synthetic root (`pathPrefix` ''). */
function compareAtRoot(
  left: JsonValue,
  right: JsonValue,
  structureOnly = false
): DiffJsonObjectsReport {
  const report: DiffJsonObjectsReport = { added: [], removed: [], modified: [] };
  diffJsonObjectsConfig.compareAtDepth(left, right, '', report, structureOnly);
  return report;
}

describe('diffJsonObjectsConfig.joinPath', () => {
  test('empty prefix returns segment alone', () => {
    expect(diffJsonObjectsConfig.joinPath('', 'x')).toBe('x');
  });

  test('prefix and segment join with dot', () => {
    expect(diffJsonObjectsConfig.joinPath('a', 'b')).toBe('a.b');
  });

  test('nested prefix', () => {
    expect(diffJsonObjectsConfig.joinPath('a.b', 'c')).toBe('a.b.c');
  });
});

describe('diffJsonObjectsConfig.compareAtDepth', () => {
  test('prefixes every path when pathPrefix is non-empty', () => {
    const report: DiffJsonObjectsReport = { added: [], removed: [], modified: [] };
    diffJsonObjectsConfig.compareAtDepth({ x: 1 }, { x: 2 }, 'root', report, false);
    expect(report.modified).toEqual(['root.x']);
  });

  test('appends to an existing report instead of replacing', () => {
    const report: DiffJsonObjectsReport = {
      added: ['pre'],
      removed: [],
      modified: [],
    };
    diffJsonObjectsConfig.compareAtDepth({}, { a: 1 }, '', report, false);
    expect(report.added).toContain('pre');
    expect(report.added).toContain('a');
  });

  test('returns empty diff when left and right match (shallow)', () => {
    const tree = { claude: { a: true }, cursor: { b: true } };
    const result = compareAtRoot(tree, { ...tree });
    expect(result.added).toEqual([]);
    expect(result.removed).toEqual([]);
    expect(result.modified).toEqual([]);
  });

  test('returns empty diff when objects have same keys/values in different key order', () => {
    const left: JsonValue = { a: 1, b: 2, c: 3 };
    const right: JsonValue = { c: 3, a: 1, b: 2 };
    const result = compareAtRoot(left, right);
    expect(result.added).toEqual([]);
    expect(result.removed).toEqual([]);
    expect(result.modified).toEqual([]);
  });

  test('returns empty diff for deeply nested objects with different key order', () => {
    const left: JsonValue = {
      claude: {
        agentsMdSymlink: {
          options: { sourceFile: 'AGENTS.md', targetFile: 'CLAUDE.md' },
          symlinks: ['CLAUDE.md'],
        },
      },
    };
    const right: JsonValue = {
      claude: {
        agentsMdSymlink: {
          symlinks: ['CLAUDE.md'],
          options: { targetFile: 'CLAUDE.md', sourceFile: 'AGENTS.md' },
        },
      },
    };
    const result = compareAtRoot(left, right);
    expect(result.added).toEqual([]);
    expect(result.removed).toEqual([]);
    expect(result.modified).toEqual([]);
  });

  test('reports added at root when right has extra top-level key', () => {
    const left: JsonValue = { claude: {} };
    const right: JsonValue = { claude: {}, cursor: { x: true } };
    const result = compareAtRoot(left, right);
    expect(result.added).toContain('cursor');
    expect(result.removed).toEqual([]);
    expect(result.modified).toEqual([]);
  });

  test('reports removed at root when right is missing top-level key', () => {
    const left: JsonValue = { claude: {}, cursor: {} };
    const right: JsonValue = { claude: {} };
    const result = compareAtRoot(left, right);
    expect(result.removed).toContain('cursor');
    expect(result.added).toEqual([]);
  });

  test('reports added at nested depth (one level at a time)', () => {
    const left: JsonValue = { claude: { options: { a: 1 } } };
    const right: JsonValue = { claude: { options: { a: 1, b: 2 } } };
    const result = compareAtRoot(left, right);
    expect(result.added).toContain('claude.options.b');
    expect(result.removed).toEqual([]);
    expect(result.modified).toEqual([]);
  });

  test('reports removed at nested depth', () => {
    const left: JsonValue = { claude: { options: { a: 1, b: 2 } } };
    const right: JsonValue = { claude: { options: { a: 1 } } };
    const result = compareAtRoot(left, right);
    expect(result.removed).toContain('claude.options.b');
    expect(result.added).toEqual([]);
  });

  test('reports modified for primitive value change', () => {
    const left: JsonValue = { claude: { options: { sourceFile: 'AGENTS.md' } } };
    const right: JsonValue = { claude: { options: { sourceFile: 'OTHER.md' } } };
    const result = compareAtRoot(left, right);
    expect(result.modified).toContain('claude.options.sourceFile');
    expect(result.added).toEqual([]);
    expect(result.removed).toEqual([]);
  });

  test('reports modified for boolean vs object at same path', () => {
    const left: JsonValue = { claude: { agentsMdSymlink: true } };
    const right: JsonValue = {
      claude: { agentsMdSymlink: { options: {}, symlinks: [] } },
    };
    const result = compareAtRoot(left, right);
    expect(result.modified).toContain('claude.agentsMdSymlink');
    expect(result.added).toEqual([]);
    expect(result.removed).toEqual([]);
  });

  test('reports modified for array length mismatch', () => {
    const left: JsonValue = { claude: { symlinks: ['a.md', 'b.md'] } };
    const right: JsonValue = { claude: { symlinks: ['a.md'] } };
    const result = compareAtRoot(left, right);
    expect(result.modified).toContain('claude.symlinks');
    expect(result.added).toEqual([]);
    expect(result.removed).toEqual([]);
  });

  test('reports modified for array element primitive mismatch', () => {
    const left: JsonValue = { claude: { symlinks: ['a.md', 'b.md'] } };
    const right: JsonValue = { claude: { symlinks: ['a.md', 'c.md'] } };
    const result = compareAtRoot(left, right);
    expect(result.modified).toContain('claude.symlinks[1]');
  });

  test('returns empty diff for array of strings in same order', () => {
    const left: JsonValue = { symlinks: ['.cursor/commands/a.md', '.cursor/commands/b.md'] };
    const right: JsonValue = { symlinks: ['.cursor/commands/a.md', '.cursor/commands/b.md'] };
    const result = compareAtRoot(left, right);
    expect(result.added).toEqual([]);
    expect(result.removed).toEqual([]);
    expect(result.modified).toEqual([]);
  });

  test('treats array of primitives as order-insensitive (same set = equal)', () => {
    const left: JsonValue = { symlinks: ['a.md', 'b.md'] };
    const right: JsonValue = { symlinks: ['b.md', 'a.md'] };
    const result = compareAtRoot(left, right);
    expect(result.modified).toEqual([]);
  });

  test('returns empty diff for array of objects with same content, different key order', () => {
    const left: JsonValue = {
      plugins: [
        { name: 'a', source: './a', version: '0.1.0' },
        { name: 'b', source: './b', version: '0.1.0' },
      ],
    };
    const right: JsonValue = {
      plugins: [
        { source: './a', version: '0.1.0', name: 'a' },
        { source: './b', version: '0.1.0', name: 'b' },
      ],
    };
    const result = compareAtRoot(left, right);
    expect(result.added).toEqual([]);
    expect(result.removed).toEqual([]);
    expect(result.modified).toEqual([]);
  });

  test('reports modified at array index when object element differs', () => {
    const left: JsonValue = {
      plugins: [
        { name: 'a', version: '0.1.0' },
        { name: 'b', version: '0.1.0' },
      ],
    };
    const right: JsonValue = {
      plugins: [
        { name: 'a', version: '0.1.0' },
        { name: 'b', version: '0.2.0' },
      ],
    };
    const result = compareAtRoot(left, right);
    expect(result.modified).toContain('plugins[1].version');
  });

  test('reports added inside nested object when right adds an option key', () => {
    const left: JsonValue = {
      claude: {
        localMarketplaceSync: {
          options: { manifestKey: 'claude' },
          customData: { plugins: [] },
        },
      },
    };
    const right: JsonValue = {
      claude: {
        localMarketplaceSync: {
          options: { manifestKey: 'claude', marketplaceFile: '.claude-plugin/marketplace.json' },
          customData: { plugins: [] },
        },
      },
    };
    const result = compareAtRoot(left, right);
    expect(result.added).toContain('claude.localMarketplaceSync.options.marketplaceFile');
    expect(result.removed).toEqual([]);
    expect(result.modified).toEqual([]);
  });

  test('does not recurse under added key (reports single path)', () => {
    const left: JsonValue = {};
    const right: JsonValue = {
      cursor: {
        localPluginsContentSync: {
          options: { targetRoot: '.cursor' },
          symlinks: ['.cursor/commands/a.md'],
        },
      },
    };
    const result = compareAtRoot(left, right);
    expect(result.added).toEqual(['cursor']);
    expect(result.removed).toEqual([]);
    expect(result.modified).toEqual([]);
  });

  test('does not recurse under removed key (reports single path)', () => {
    const left: JsonValue = {
      cursor: {
        localPluginsContentSync: { options: {}, symlinks: [] },
      },
    };
    const right: JsonValue = {};
    const result = compareAtRoot(left, right);
    expect(result.removed).toEqual(['cursor']);
    expect(result.added).toEqual([]);
    expect(result.modified).toEqual([]);
  });

  test('handles empty left and right', () => {
    const result = compareAtRoot({}, {});
    expect(result.added).toEqual([]);
    expect(result.removed).toEqual([]);
    expect(result.modified).toEqual([]);
  });

  test('handles empty left with non-empty right', () => {
    const right: JsonValue = { claude: { rulesSymlink: true } };
    const result = compareAtRoot({}, right);
    expect(result.added).toContain('claude');
    expect(result.removed).toEqual([]);
  });

  test('handles non-empty left with empty right', () => {
    const left: JsonValue = { claude: { rulesSymlink: true } };
    const result = compareAtRoot(left, {});
    expect(result.added).toEqual([]);
    expect(result.removed).toContain('claude');
  });

  test('reports multiple added/removed/modified at same depth', () => {
    const left: JsonValue = {
      claude: { a: 1, b: 2, c: 3 },
      codex: { x: true },
    };
    const right: JsonValue = {
      claude: { a: 1, b: 99, d: 4 },
      cursor: { y: true },
    };
    const result = compareAtRoot(left, right);
    expect(result.added).toContain('cursor');
    expect(result.added).toContain('claude.d');
    expect(result.removed).toContain('codex');
    expect(result.removed).toContain('claude.c');
    expect(result.modified).toContain('claude.b');
  });

  test('deep path: options.legacyHeadingsToRemove array', () => {
    const left: JsonValue = {
      codex: {
        markdownSectionSync: {
          options: {
            agentsFile: 'AGENTS.override.md',
            legacyHeadingsToRemove: ['Codex Marketplace'],
            sectionHeading: 'packages (generated by mmaappss)',
          },
        },
      },
    };
    const right: JsonValue = {
      codex: {
        markdownSectionSync: {
          options: {
            agentsFile: 'AGENTS.override.md',
            legacyHeadingsToRemove: ['Other Heading'],
            sectionHeading: 'packages (generated by mmaappss)',
          },
        },
      },
    };
    const result = compareAtRoot(left, right);
    expect(result.modified).toContain(
      'codex.markdownSectionSync.options.legacyHeadingsToRemove[0]'
    );
  });

  test('structureOnly: reports added/removed only, never modified', () => {
    const left: JsonValue = { claude: { agentsMdSymlink: true, rulesSymlink: true } };
    const right: JsonValue = {
      claude: {
        agentsMdSymlink: { options: {}, symlinks: ['CLAUDE.md'] },
        rulesSymlink: { options: {}, symlinks: [] },
        settingsSync: { options: {} },
      },
    };
    const result = compareAtRoot(left, right, true);
    expect(result.added).toContain('claude.settingsSync');
    expect(result.removed).toEqual([]);
    expect(result.modified).toEqual([]);
  });

  test('structureOnly: returns empty diff when keys match at all depths (values may differ)', () => {
    const left: JsonValue = {
      claude: { agentsMdSymlink: true, rulesSymlink: true },
      cursor: { localPluginsContentSync: true },
    };
    const right: JsonValue = {
      claude: {
        agentsMdSymlink: { options: {}, symlinks: ['a.md'] },
        rulesSymlink: { options: {}, symlinks: ['b.md'] },
      },
      cursor: { localPluginsContentSync: { options: {}, symlinks: [] } },
    };
    const result = compareAtRoot(left, right, true);
    expect(result.added).toEqual([]);
    expect(result.removed).toEqual([]);
    expect(result.modified).toEqual([]);
  });

  test('deep path: plugins array object with multiple keys', () => {
    const left: JsonValue = {
      claude: {
        localMarketplaceSync: {
          customData: {
            plugins: [
              { name: 'pino-logger', source: './pino', description: 'Logging', version: '0.1.0' },
            ],
          },
        },
      },
    };
    const right: JsonValue = {
      claude: {
        localMarketplaceSync: {
          customData: {
            plugins: [
              { name: 'pino-logger', source: './pino', description: 'Logging', version: '0.2.0' },
            ],
          },
        },
      },
    };
    const result = compareAtRoot(left, right);
    expect(result.modified).toContain('claude.localMarketplaceSync.customData.plugins[0].version');
  });

  test('non-object pair pushes modified at pathPrefix including empty string for root mismatch', () => {
    const report: DiffJsonObjectsReport = { added: [], removed: [], modified: [] };
    diffJsonObjectsConfig.compareAtDepth(1, 2, '', report, false);
    expect(report.modified).toEqual(['']);
  });

  test('non-object equal values leave report unchanged', () => {
    const report: DiffJsonObjectsReport = { added: [], removed: [], modified: [] };
    diffJsonObjectsConfig.compareAtDepth(true, true, '', report, false);
    expect(report.modified).toEqual([]);
  });

  test('structureOnly skips modified for non-object pair even when values differ', () => {
    const report: DiffJsonObjectsReport = { added: [], removed: [], modified: [] };
    diffJsonObjectsConfig.compareAtDepth(1, 2, '', report, true);
    expect(report.modified).toEqual([]);
  });
});

describe('diffJsonObjectsConfig.isPlainObject', () => {
  test('accepts object literal', () => {
    expect(diffJsonObjectsConfig.isPlainObject({})).toBe(true);
  });

  test('rejects array, null, primitive', () => {
    expect(diffJsonObjectsConfig.isPlainObject([])).toBe(false);
    expect(diffJsonObjectsConfig.isPlainObject(null)).toBe(false);
    expect(diffJsonObjectsConfig.isPlainObject(0)).toBe(false);
  });

  test('rejects Object.create(null)', () => {
    expect(diffJsonObjectsConfig.isPlainObject(Object.create(null) as JsonValue)).toBe(false);
  });
});

describe('diffJsonObjectsConfig.deepEqual', () => {
  test('matches compareAtRoot empty result for equivalent trees', () => {
    const left: JsonValue = { a: { b: 1 } };
    const right: JsonValue = { a: { b: 1 } };
    expect(diffJsonObjectsConfig.deepEqual(left, right)).toBe(true);
    expect(compareAtRoot(left, right).modified).toEqual([]);
  });
});
