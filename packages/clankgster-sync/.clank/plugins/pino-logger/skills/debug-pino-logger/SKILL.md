---
name: Debug Clankgster sync with file logging
description: Enable and use Pino file logging to diagnose @clankgster/sync failures. Use when sync/clear errors appear or you need discovery, config, or adapter flow.
---

# Debug Clankgster sync with file logging

Use this skill when you need to **diagnose sync or clear failures** or **trace flow** (config, discovery, per-agent enable/disable) without temporary `console` noise.

## When to use

- Sync or clear fails; you need structured logs
- You need to see enabled agents, discovered marketplaces, or failure location

## Enable logging

1. **Env (one-off)**  
   `CLANKGSTER_LOGGING_ENABLED=true pnpm clankgster-sync:run`  
   (or `clankgster-sync:clear`)

2. **Config**  
   In `clankgster.config.ts`: `loggingEnabled: true`  
   Or `.env`: `CLANKGSTER_LOGGING_ENABLED=true`

Env overrides config when set.

## Log location

- **Path:** `<repo-root>/.clank/logs/clankgster-sync.log`
- **Format:** NDJSON; logger name `@clankgster/sync`

## Read logs

1. Reproduce with logging on
2. `tail -f .clank/logs/clankgster-sync.log` or open after run
3. Search for error-level lines and `msg` fields; use earlier `sync started` / per-agent lines for context
4. Optional: `tail -50 .clank/logs/clankgster-sync.log | jq .`

## Turn off

Unset env or set `CLANKGSTER_LOGGING_ENABLED=false`; remove `loggingEnabled` from config when done.
