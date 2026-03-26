import path from 'node:path';
import { describe, expect, test } from 'vite-plus/test';
import { e2ePathHelpers } from './e2e-path-helpers.js';

describe('e2ePathHelpers', () => {
  test('formatCaseDirectoryName builds case-{n}-{name}', () => {
    expect(e2ePathHelpers.formatCaseDirectoryName(1, 'basic')).toBe('case-1-basic');
  });

  test('getResultsRoot joins package root with sandboxes and results dir', () => {
    expect(e2ePathHelpers.getResultsRoot('/abs/pkg')).toBe(
      path.join('/abs/pkg', 'sandboxes', '.e2e-tests.run-results')
    );
  });

  test('getTestCasesRoot joins scripts root with test-cases', () => {
    expect(e2ePathHelpers.getTestCasesRoot('/abs/scripts')).toBe(
      path.join('/abs/scripts', 'test-cases')
    );
  });
});
