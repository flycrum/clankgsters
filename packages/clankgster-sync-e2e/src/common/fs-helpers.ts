import path from 'node:path';

/**
 * Filesystem path helpers for e2e (safe joining under a known root; no I/O).
 */
export const fsHelpers = {
  /**
   * Resolves `path.resolve(root, ...segments)` after normalizing `root`, then ensures the result stays **inside** that
   * root. Throws if `path.relative(resolvedRoot, resolved)` indicates escape (`..` prefix, or an absolute relative path
   * such as cross-drive targets on Windows).
   *
   * **Safe resolution (same idea as `path.join`, but verified):** `joinRootSafe('/tmp/e2e/case-1', '.clank', 'plugins')`
   * → `/tmp/e2e/case-1/.clank/plugins`. For benign segments, the returned path matches what you would get from
   * `path.resolve(root, ...segments)` without leaving the tree.
   *
   * **Naive `path.join` / `path.resolve` without checks — can escape:**
   * - `path.join('/tmp/e2e/case-1/sandbox', 'a', '..', '..', 'neighbor')` normalizes to a path **outside** `sandbox`
   *   (e.g. under `case-1` or `e2e`), so deletes or writes could hit the wrong directory. `joinRootSafe` with the same
   *   segments **throws** instead of returning that path.
   * - `path.join('/tmp/e2e/case-1', '/var/secrets/id')` jumps to an **absolute** path outside the case. `joinRootSafe`
   *   **throws** for the same segments.
   *
   * Use this whenever `root` is a trusted case/sandbox directory and `segments` come from config, manifests, or other
   * data that must not traverse upward or re-root to another filesystem path.
   */
  joinRootSafe(root: string, ...segments: string[]): string {
    const resolvedRoot = path.resolve(root);
    const resolved = path.resolve(resolvedRoot, ...segments);
    const rel = path.relative(resolvedRoot, resolved);
    if (rel.startsWith('..') || path.isAbsolute(rel)) {
      throw new Error(`Path escapes root (${resolvedRoot}): ${resolved}`);
    }
    return resolved;
  },
};
