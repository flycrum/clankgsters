/**
 * Pure string helpers for shorthand plugin/skills directory names derived from `sourceDefaults.sourceDir`.
 * Used by sync discovery and e2e seeding so layout naming stays aligned with `syncSourceLayoutsConfig` (`sync-source-layouts.config.ts`).
 */
export const sourceLayoutPathNaming = {
  /** Converts `sourceDir` into a shorthand-safe prefix (e.g. `.clank` → `.clank`, `foo/bar` → `foo-bar`). */
  sourceDirToShorthandBase(sourceDir: string): string {
    const normalized = sourceDir
      .replace(/\\/g, '/')
      .replace(/\/+$/g, '')
      .replace(/^\.\/+/g, '');
    const token = normalized
      .split('/')
      .filter((segment) => segment.length > 0)
      .join('-');
    return token.length > 0 ? token : 'source';
  },
} as const;
