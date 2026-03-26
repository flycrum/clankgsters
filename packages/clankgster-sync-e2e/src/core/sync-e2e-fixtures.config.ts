import { spawn } from 'node:child_process';
import { printLine } from '../utils/print-line.js';

/** Spawn options and paths for post-sync fixture formatting. */
export const syncE2eFixturesConfig = {
  /** Relative path passed to `vp fmt` (forward slashes for cross-platform CLI args). */
  testCasesFmtArg: 'src/test-cases',

  /** Fire-and-forget `vp fmt` on fixture JSON so the sync-e2e-fixtures CLI can exit before formatting finishes. */
  spawnDetachedFmtTestCases(packageRoot: string): void {
    const child = spawn('pnpm', ['exec', 'vp', 'fmt', this.testCasesFmtArg], {
      cwd: packageRoot,
      detached: true,
      env: process.env,
      stdio: 'ignore',
    });
    child.on('error', (err) => {
      console.error(
        printLine.error(
          `Could not spawn \`pnpm exec vp fmt ${this.testCasesFmtArg}\` (${String(err)}). Run it manually from ${packageRoot}.`
        )
      );
    });
    child.unref();
    console.log(
      printLine.success(
        `Launched background format: pnpm exec vp fmt ${this.testCasesFmtArg} (files may update after this process exits)`
      )
    );
  },
};
