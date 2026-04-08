import fs from 'node:fs';
import path from 'node:path';
import pino, { type Logger } from 'pino';
import { clankgsterConfigDefaults } from '../core/configs/clankgster-config.defaults.js';

/**
 * Central Pino logger setup for sync scripts (`@clankgster/sync`).
 *
 * Invariants:
 * - Logging defaults to disabled.
 * - `CLANKGSTER_LOGGING_ENABLED` can force enable or disable.
 * - When enabled, logs write to `{sourceDir}/.logs/clankgster-sync.log` under output root or repo root.
 * - `sourceDir` comes from resolved config when set; otherwise defaults match {@link clankgsterConfigDefaults.CONSTANTS.sourceDefaults.sourceDir}.
 *
 * `getLogger()` is safe before initialization: it returns a silent logger until context is set.
 */

const LOG_SUBDIR = '.logs';
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

/** Normalized repo-relative source root used to place log files under `{normalized}/.logs/`. */
function normalizeSourceDirForLogging(sourceDir: string): string {
  return sourceDir
    .replace(/\\/g, '/')
    .replace(/\/+$/g, '')
    .replace(/^\.\/+/g, '');
}

function effectiveSourceDir(sourceDir?: string): string {
  if (typeof sourceDir === 'string' && sourceDir.trim().length > 0) {
    const normalized = normalizeSourceDirForLogging(sourceDir.trim());
    if (normalized.length > 0) return normalized;
  }
  return normalizeSourceDirForLogging(clankgsterConfigDefaults.CONSTANTS.sourceDefaults.sourceDir);
}

/** Absolute log directory: `logRoot` + `sourceDir` segments + `.logs`. */
function resolveLogDirPath(logRoot: string, sourceDir?: string): string {
  const dir = effectiveSourceDir(sourceDir);
  const segments = dir.split('/').filter((segment) => segment.length > 0);
  return path.join(logRoot, ...segments, LOG_SUBDIR);
}

export interface ClankLoggerContextInput {
  /** Request file logging when true; omitted means off unless env forces it. */
  loggingEnabled?: boolean;
  /** Root directory for `{sourceDir}/.logs/`; defaults to `repoRoot`. */
  outputRoot?: string;
  /** Repository root (used for log path and context). */
  repoRoot: string;
  /**
   * Repo-relative marketplace source root (same meaning as `sourceDefaults.sourceDir`); controls log directory placement.
   * When omitted, uses {@link clankgsterConfigDefaults.CONSTANTS.sourceDefaults.sourceDir}.
   */
  sourceDir?: string;
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
    const logDirPath = resolveLogDirPath(logRoot, input.sourceDir);
    const logFilePath = path.join(logDirPath, LOG_FILE);
    fs.mkdirSync(logDirPath, { recursive: true });

    const destination = pino.destination({ dest: logFilePath, sync: true });
    const logger = pino({ name: '@clankgster/sync', level: 'debug', base: undefined }, destination);

    closeCurrentLogger();
    currentDestination = destination;
    currentLogger = logger;
  },
};
