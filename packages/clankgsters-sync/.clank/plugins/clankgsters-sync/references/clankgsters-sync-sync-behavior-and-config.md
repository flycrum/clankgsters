# Sync behavior, scripts, and config

Implementation: **`@clankgsters/sync`** (`packages/clankgsters-sync`). Entry scripts resolve config, walk agents and behaviors, and write outputs.

## What sync does

- Resolve **`clankgsters.config.ts`** (and optional local config), then walk enabled agents and behaviors
- Write `.claude-plugin/marketplace.json` and related manifest entries (e.g. under **`.clankgsters-cache/sync-manifest.json`** per your config)
- **Cursor:** mirror plugin content into `.cursor/` (rules as `.mdc` with frontmatter where required); local marketplace discovery differs from published marketplace — see [repo docs index](./clankgsters-sync-repo-docs-index.md)
- **Codex:** maintain the **packages** section in **`AGENTS.override.md`** (section heading from preset/behavior options)
- **`sourceDefaults.localMarketplaceName`** defaults to **`clankgsters-sync`** (same string as this plugin folder name); override in config if needed

Full package docs: [packages/clankgsters-sync/README.md](../../../README.md).

## Run sync (monorepo)

| Command                       | Purpose    |
| ----------------------------- | ---------- |
| `pnpm clankgsters-sync:run`   | Run sync   |
| `pnpm clankgsters-sync:clear` | Clear mode |

**Always read** `packages/clankgsters-sync/package.json` for exact script names (`clankgsters-sync:run`, `clankgsters-sync:clear`) — they can change. Scripts delegate to `tsx` entrypoints in that package.

For a consumer repo using the published CLI, run `clankgsters-sync` from npm with `CLANKGSTERS_REPO_ROOT` set to the project root (see package README).

## After sync

Confirm expected outputs (rules, skills, manifests). Do **not** hand-edit `.cursor/` or `.claude/` to fix gaps — fix sources or sync. See [trust sync](./clankgsters-sync-trust-sync-and-sources.md).

## Configuration (repo root)

- **`clankgsters.config.ts`** — `agents`, `excluded`, `sourceDefaults` (`localMarketplaceName`, `markdownContextFileName`, `sourceDir`, `pluginsDir`, `skillsDir`), `syncCacheDir`, `syncManifestPath`, `loggingEnabled`
- **Source layout:** for each source root, sync reads nested + shorthand variants for plugins and skills (nested `{sourceDir}/{pluginsDir}`, `.local` siblings, shorthand `{sourceDir}-{pluginsDir}`, etc.). `.local` variants are for uncommitted, developer-specific content
- **Env:** `CLANKGSTERS_REPO_ROOT` — repo root for sync (tests, CLI). **`CLANKGSTERS_LOGGING_ENABLED`** — optional file logging to `.clank/logs/clankgsters-sync.log` (see **pino-logger** plugin)

## Codex target

Generated marketplace section goes to **`AGENTS.override.md`** so hand-edited **`CLANK.md`** stays canonical for Cursor/Codex context. See Codex docs for override semantics.

## E2E tests

**`packages/clankgsters-sync-e2e`** — sandbox template, manifest diff, `CLANKGSTERS_REPO_ROOT`. Monorepo: `pnpm e2e-tests:run`.
