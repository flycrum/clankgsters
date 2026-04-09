import chalk from 'chalk';
import { createActor } from 'xstate';
import { actorHelpers } from '../../common/actor-helpers.js';
import { pathHelpers } from '../../common/path-helpers.js';
import {
  syncRunOutputNormalize,
  type SyncRunOutputNormalized,
} from './sync-run-output-normalize.js';
import { syncRunMachine } from './sync-run.machine.js';

export const syncRunCli = {
  /**
   * Runs the top-level sync-run machine for the given CLI mode. Exits with code 1 when machine output reports non-success so callers can treat failures as fatal.
   * Uses `pathHelpers.getRepoRoot()` from `path-helpers.ts` for `repoRoot` (not raw `process.cwd()`), so workspace-filtered `pnpm` scripts and published installs resolve config against the real project root.
   */
  async run(mode: 'sync' | 'clear'): Promise<void> {
    const repoRoot = pathHelpers.getRepoRoot();
    const actor = createActor(syncRunMachine, {
      input: {
        mode,
        repoRoot,
      },
    });
    actor.start();
    const rawOutput = await actorHelpers.awaitOutput<SyncRunOutputNormalized>(actor);
    const output = syncRunOutputNormalize.normalize(rawOutput);
    if (!output.success) {
      console.error(
        chalk.red(`[clankgster] ${mode} failed`),
        chalk.gray(output.errorMessage ?? '')
      );
      process.exit(1);
    }
    console.log(
      chalk.green(`[clankgster] ${mode} complete`),
      chalk.dim(`processed ${output.outcomes.length} agent(s)`)
    );
  },

  /** Logs a top-level CLI failure and terminates the process. */
  reportUnexpectedError(mode: 'sync' | 'clear', error: unknown): never {
    console.error(chalk.red(`[clankgster] unexpected ${mode} error`), error);
    process.exit(1);
  },
};
