---
name: clankgsters-sync-run-marketplace-sync
description: >-
  Run @clankgsters/sync so Cursor, Claude Code, and Codex pick up .clank/ — pnpm clankgsters-sync:run or clankgsters-sync:clear from monorepo root (see packages/clankgsters-sync/package.json). Refreshes .cursor rules/skills, marketplace manifests, AGENTS.override.md, sync cache. Triggers — after editing plugins or skills, clankgsters.config.ts, git pull, “run sync”, “refresh marketplace”, “rules not updating”, “skills missing”, troubleshooting discovery. Do not hand-fix .cursor/; fix sources and re-run.
---

# Run marketplace sync scripts

Use this skill when you need to **run the Clankgsters sync scripts** (sync or clear) so Cursor, Claude, and Codex see the latest `.clank/` sources. Behavior summary: [sync behavior and config](../../references/clankgsters-sync-sync-behavior-and-config.md); trust workflow: [trust sync](../../references/clankgsters-sync-trust-sync-and-sources.md).

## When to use

- After adding or changing anything under `.clank/` (plugins, flat skills, rules) or `clankgsters.config.ts`
- After `git pull` / merge (or use a post-merge hook if you add one)
- User asks to "sync agent marketplaces", "refresh plugins", or "run clankgsters sync"

## How to run

**Always read** `packages/clankgsters-sync/package.json` for exact script names — they can change.

From **monorepo root** (typical):

```bash
pnpm clankgsters-sync:run
pnpm clankgsters-sync:clear
```

These delegate to the sync package (`tsx` entrypoints). For a published CLI consumer, run `clankgsters-sync` from npm with `CLANKGSTERS_REPO_ROOT` set to the target project root (see [package README](../../../README.md)).

## After sync

Confirm expected outputs (rules, skills, manifests). Do **not** hand-edit `.cursor/` or `.claude/` to “fix” gaps — fix sources or sync. See [trust sync](../../references/clankgsters-sync-trust-sync-and-sources.md).

## Config and E2E

Config and E2E: [sync behavior and config](../../references/clankgsters-sync-sync-behavior-and-config.md).
