# Pino logging in Clankgster sync

When editing or adding code under `packages/clankgster-sync/src/` (sync runner, adapters, discovery, config, etc.):

- Use the shared logger — import `clankLogger` from the correct relative path to `common/logger.js`. Do not add `console.log`/`console.warn`/`console.error` for operational flow; use `clankLogger.getLogger().info()`, `.debug()`, `.error()` with a short `msg` and structured fields. Keep `console.error` only for user-facing errors that must always appear on stderr (optionally duplicate with the logger).
- Structured fields — one message string plus an object of context, e.g. `log.info({ agents, configSource }, 'sync started')`. Avoid logging large objects or full stack traces unless at error level and useful for debugging.
- No PII or secrets — do not log tokens, passwords, or full absolute user paths when a relative path or label is enough.
- Context once — `clankLogger.setLoggerContext(...)` must be called at process start before operational logs; entry scripts already do this.

**Compliance:** Search for raw `console.*` under `src/` (and thin CLI files under `scripts/`) and fix or justify. Confirm entry points set logger context before `getLogger()`.

See [pino-logger plugin README](../README.md) for enable/disable and log path (`.clank/logs/clankgster-sync.log`).
