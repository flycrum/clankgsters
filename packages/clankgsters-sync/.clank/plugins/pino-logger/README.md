# pino-logger plugin

Documentation and agent guidance for **Pino-based file logging** in **[@clankgsters/sync](https://github.com/flycrum/clankgsters/tree/main/packages/clankgsters-sync)**. This plugin does not implement the logger (that lives in the sync package); it describes strategy, enable/disable, log location, and how to use logs when debugging.

---

## Purpose

- **Strategy** — When and what we log, and how to keep volume useful without noise
- **Enable/disable** — `loggingEnabled` in `clankgsters.config.ts` and `CLANKGSTERS_LOGGING_ENABLED`
- **Where logs go** — **`.clank/logs/clankgsters-sync.log`** under repo root (or sync output root)
- **Debugging** — How to interpret log levels and events when something fails

Use this plugin’s rules and skills so agents (and humans) can enable and read Clankgsters sync logs consistently.

---

## Logging strategy

1. **Off by default** — No log file unless `loggingEnabled: true` or `CLANKGSTERS_LOGGING_ENABLED=true`
2. **Single file** — `.clank/logs/clankgsters-sync.log` (directory created when logging is on)
3. **Structured JSON** — Pino NDJSON; logger `name` is `@clankgsters/sync`
4. **No PII** — Prefer relative paths; no secrets in logs (see rule file)

---

## Enabling file logging

### Config (`clankgsters.config.ts`)

```ts
export default {
  loggingEnabled: true,
};
```

### Environment

- **`CLANKGSTERS_LOGGING_ENABLED`** — `true` / `1` = on; `false` / `0` = off; unset defers to config
- Env overrides config when set

```bash
CLANKGSTERS_LOGGING_ENABLED=true pnpm clankgsters-sync:run
```

---

## Log file

- **Path:** `<repo-root>/.clank/logs/clankgsters-sync.log`
- **Tail:** `tail -f .clank/logs/clankgsters-sync.log`
- **Filter:** `grep '"level":50' .clank/logs/clankgsters-sync.log` (errors depend on Pino level mapping)

---

## Plugin layout

- **rules/** — `pino-logger-logging.md`
- **skills/** — Debug workflow with file logging
- **commands/** — Tail-log helper

Driver plugin layout reference: [clankgsters-sync plugin README](../clankgsters-sync/README.md).
