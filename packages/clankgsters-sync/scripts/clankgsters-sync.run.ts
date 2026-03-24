import { syncRunCli } from './core/run/sync-run-cli-entry.js';

/**
 * Runs the sync CLI entrypoint using the top-level machine in `sync` mode.
 * Exits with code 1 when machine output reports non-success so callers can treat failures as fatal.
 *
 * ⚠️⚠️⚠️ KEEP THIS SCRIPT NAME AND FAILURE CONTRACT STABLE FOR DEPLOYED NPM PACKAGE CONSUMERS WHO AUTOMATE AROUND THIS ENTRYPOINT.
 */
syncRunCli.run('sync').catch((error) => {
  syncRunCli.reportUnexpectedError('sync', error);
});
