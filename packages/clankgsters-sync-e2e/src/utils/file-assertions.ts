import fs from 'node:fs';
import path from 'node:path';

export interface FileAssertionResult {
  missing: string[];
}

/**
 * True if `resolvedPath` is under resolved `outputRoot` (`path.relative`, prefix check)
 * Used by {@link fileAssertions.fromManifestEntries} so hostile `relativePath` cannot escape `outputRoot`
 */
function isResolvedPathInsideOutputRoot(outputRoot: string, resolvedPath: string): boolean {
  const rel = path.relative(outputRoot, resolvedPath);
  if (rel.startsWith('..') || path.isAbsolute(rel)) return false;
  return resolvedPath === outputRoot || resolvedPath.startsWith(outputRoot + path.sep);
}

export const fileAssertions = {
  /** Returns manifest `relativePath` entries missing on disk under `outputRoot`; paths escaping `outputRoot` after `path.resolve(outputRoot, relativePath)` count as missing */
  fromManifestEntries(outputRoot: string, filePaths: string[]): FileAssertionResult {
    const normalizedOutputRoot = path.resolve(outputRoot);
    const missing = filePaths.filter((relativePath) => {
      const resolvedPath = path.resolve(normalizedOutputRoot, relativePath);
      if (!isResolvedPathInsideOutputRoot(normalizedOutputRoot, resolvedPath)) return true;
      return !fs.existsSync(resolvedPath);
    });
    return { missing };
  },
};
