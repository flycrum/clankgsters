# Tail Clankgsters sync log

**What it does:** Watch the Pino file log live or inspect recent lines.

**When:** Debugging sync/clear failures or tracing discovery and config.

**Steps:**

1. Enable logging (`loggingEnabled` in `clankgsters.config.ts` or `CLANKGSTERS_LOGGING_ENABLED=true`). See [pino-logger README](../README.md).
2. Run sync: `pnpm clankgsters-sync:run` (or clear).
3. **Live tail:** `tail -f .clank/logs/clankgsters-sync.log`
4. **Last lines:** `tail -n 50 .clank/logs/clankgsters-sync.log`
5. **Pretty JSON:** `tail -n 20 .clank/logs/clankgsters-sync.log | jq .`

**Path:** `.clank/logs/clankgsters-sync.log` (under repo root). `.clank/` is typically gitignored for logs.
