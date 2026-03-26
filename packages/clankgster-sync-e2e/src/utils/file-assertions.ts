import fs from 'node:fs';
import path from 'node:path';
import { fsHelpers } from '../common/fs-helpers.js';

export interface FileAssertionResult {
  missing: string[];
}

export const fileAssertions = {
  /** Returns manifest `relativePath` entries missing on disk under `outputRoot`; paths escaping `outputRoot` count as missing */
  fromManifestEntries(outputRoot: string, filePaths: string[]): FileAssertionResult {
    const normalizedOutputRoot = path.resolve(outputRoot);
    const missing = filePaths.filter((relativePath) => {
      let resolvedPath: string;
      try {
        resolvedPath = fsHelpers.joinRootSafe(normalizedOutputRoot, relativePath);
      } catch {
        return true;
      }
      return !fs.existsSync(resolvedPath);
    });
    return { missing };
  },
};
