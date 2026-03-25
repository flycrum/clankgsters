---
name: Run Clankgsters local marketplace sync
description: Run clankgsters sync or clear to update local marketplace manifests and plugin discovery.
---

# Run marketplace sync scripts

Use this skill when you need to **run the Clankgsters sync scripts** (sync or clear) so Cursor, Claude, and Codex see the latest `.clank/plugins/`. Claude uses marketplace manifests; Cursor uses content sync into `.cursor/` (rules, commands, skills, agents); Codex uses the generated section in `AGENTS.override.md`.

## When to use

- After adding or changing a plugin under `.clank/plugins/`
- After `git pull` / merge (or use a post-merge hook if you add one)
- User asks to "sync agent marketplaces", "refresh plugins", or "run clankgsters sync"

## How to run

Implementation lives in **`@clankgsters/sync`** (`packages/clankgsters-sync`). From **monorepo root**:

```bash
pnpm clankgsters-sync:run
pnpm clankgsters-sync:clear
```

These delegate to the sync package (`tsx` entry scripts). For a consumer repo using the published CLI, run `clankgsters-sync` from npm with `CLANKGSTERS_REPO_ROOT` set to the target project root (see package README).

## Config

Sync reads **`clankgsters.config.ts`** at repo root (merged with optional local layers). Key knobs: `agents`, `excluded`, `sourceDefaults` (including `localMarketplaceName`, `markdownContextFileName`, layout paths). See [plugin README](../../README.md#configuration).

## E2E

Sandbox tests live in **`packages/clankgsters-sync-e2e`**. From monorepo root: `pnpm e2e-tests:run`.
