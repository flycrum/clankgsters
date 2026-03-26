#!/usr/bin/env node
/**
 * Published CLI entry for `@clankgster/sync`: runs the sync-all entry with the **caller’s cwd** as repo root (via `CLANKGSTER_REPO_ROOT`).
 *
 * - Uses this package’s `tsx` loader (`--import`) so the TypeScript entry runs when the package is
 *   `pnpm link`’d: Node would otherwise resolve `tsx` from cwd (consumer), where it may be absent.
 * - Sets `CLANKGSTER_REPO_ROOT` to `process.cwd()` so `path-helpers` treats the invocation directory
 *   as the target repo, not the link source under `node_modules`.
 */
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(__dirname, '..');
const scriptPath = path.join(packageRoot, 'scripts/clankgster-sync.run.ts');
const require = createRequire(import.meta.url);
const tsxLoader = require.resolve('tsx');
const result = spawnSync(
  process.execPath,
  ['--import', pathToFileURL(tsxLoader).href, scriptPath],
  {
    stdio: 'inherit',
    cwd: process.cwd(),
    env: { ...process.env, CLANKGSTER_REPO_ROOT: process.cwd() },
  }
);

const exitCode =
  result.status != null
    ? result.status
    : result.signal === 'SIGINT'
      ? 130
      : result.signal === 'SIGTERM'
        ? 143
        : result.signal
          ? 128
          : 1;
process.exit(exitCode);
