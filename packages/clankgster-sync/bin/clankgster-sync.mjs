#!/usr/bin/env node
/**
 * CLI entry for `@clankgster/sync`: runs `run`/`clear` with the caller's cwd as repo root
 * (via `CLANKGSTER_REPO_ROOT`).
 *
 * - Default execution mode (`published`) runs prebuilt entries from `dist/scripts/`.
 * - Source execution mode (`CLANKGSTER_SYNC_EXECUTION_MODE=source`) runs TypeScript source via
 *   this package's `tsx` loader for local monorepo development.
 * - Sets `CLANKGSTER_REPO_ROOT` to `process.cwd()` so `path-helpers` treats the invocation directory
 *   as the target repo, not the link source under `node_modules`.
 */
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(__dirname, '..');
const modeArg = process.argv[2] ?? 'run';
const mode = modeArg === 'run' || modeArg === 'clear' ? modeArg : null;

if (mode == null) {
  process.stderr.write(
    `Invalid mode "${modeArg}". Use "run" or "clear".\nUsage: clankgster-sync [run|clear]\n`
  );
  process.exit(1);
}

const executionMode =
  process.env.CLANKGSTER_SYNC_EXECUTION_MODE === 'source' ? 'source' : 'published';

const distScriptPath =
  mode === 'run'
    ? path.join(packageRoot, 'dist/scripts/clankgster-sync.run.mjs')
    : path.join(packageRoot, 'dist/scripts/clankgster-sync.clear.mjs');
const sourceScriptPath =
  mode === 'run'
    ? path.join(packageRoot, 'scripts/clankgster-sync.run.ts')
    : path.join(packageRoot, 'scripts/clankgster-sync.clear.ts');

const require = createRequire(import.meta.url);
const argv =
  executionMode === 'source'
    ? ['--import', pathToFileURL(require.resolve('tsx')).href, sourceScriptPath]
    : [distScriptPath];

const result = spawnSync(process.execPath, argv, {
  stdio: 'inherit',
  cwd: process.cwd(),
  env: {
    ...process.env,
    CLANKGSTER_REPO_ROOT: process.env.CLANKGSTER_REPO_ROOT ?? process.cwd(),
  },
});

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
