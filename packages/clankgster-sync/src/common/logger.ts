import fs from 'node:fs';
import path from 'node:path';
import pino, { type Logger } from 'pino';

/**
 * Central Pino logger setup for sync scripts (`@clankgster/sync`).
 *
 * Invariants:
 * - Logging defaults to disabled.
 * - `CLANKGSTER_LOGGING_ENABLED` can force enable or disable.
 * - When enabled, logs write to `.clank/logs/clankgster-sync.log` under output root or repo root.
 *
 * `getLogger()` is safe before initialization: it returns a silent logger until context is set.
 */

const LOG_DIR = '.clank/logs';
const LOG_FILE = 'clankgster-sync.log';

let currentLogger: Logger | null = null;
let currentDestination: { flushSync?: () => void; end?: () => void } | null = null;

function closeCurrentLogger(): void {
  if (currentDestination != null) {
    if (typeof currentDestination.flushSync === 'function') currentDestination.flushSync();
    if (typeof currentDestination.end === 'function') currentDestination.end();
    currentDestination = null;
  }
}

const silentLogger: Logger = pino({ level: 'silent' });

export interface ClankLoggerContextInput {
  /** Request file logging when true; omitted means off unless env forces it. */
  loggingEnabled?: boolean;
  /** Root directory for `.clank/logs/`; defaults to `repoRoot`. */
  outputRoot?: string;
  /** Repository root (used for log path and context). */
  repoRoot: string;
}

export const clankLogger = {
  /** Active Pino logger, or `silent` until `setLoggerContext` enables file logging. */
  getLogger(): Logger {
    if (currentLogger == null) return silentLogger;
    return currentLogger;
  },
  /** Reconfigures logging from `input` and `CLANKGSTER_LOGGING_ENABLED`; closes any prior file logger when disabling or replacing. */
  setLoggerContext(input: ClankLoggerContextInput): void {
    const envLoggingEnabled = process.env.CLANKGSTER_LOGGING_ENABLED;
    const envEnabled =
      envLoggingEnabled === 'true' || envLoggingEnabled === '1'
        ? true
        : envLoggingEnabled === 'false' || envLoggingEnabled === '0'
          ? false
          : undefined;
    const enabled = envEnabled ?? input.loggingEnabled ?? false;
    if (!enabled) {
      closeCurrentLogger();
      currentLogger = silentLogger;
      return;
    }

    const logRoot = input.outputRoot ?? input.repoRoot;
    const logDirPath = path.join(logRoot, LOG_DIR);
    const logFilePath = path.join(logDirPath, LOG_FILE);
    fs.mkdirSync(logDirPath, { recursive: true });

    const destination = pino.destination({ dest: logFilePath, sync: true });
    const logger = pino({ name: '@clankgster/sync', level: 'debug', base: undefined }, destination);

    closeCurrentLogger();
    currentDestination = destination;
    currentLogger = logger;
  },
};
