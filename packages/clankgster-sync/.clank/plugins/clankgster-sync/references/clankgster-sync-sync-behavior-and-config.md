# Sync behavior, scripts, and config

Implementation: **`@clankgster/sync`** (`packages/clankgster-sync`). Entry scripts resolve config, walk agents and behaviors, and write outputs.

## What sync does

- Resolve **`clankgster.config.ts`** (and optional local config), then walk enabled agents and behaviors
- Write `.claude-plugin/marketplace.json` and related manifest entries (e.g. under **`.clankgster-cache/sync-manifest.json`** per your config)
- **Cursor:** mirror plugin content into `.cursor/` (rules as `.mdc` with frontmatter where required); local marketplace discovery differs from published marketplace — see [repo docs index](./clankgster-sync-repo-docs-index.md)
- **Codex:** maintain the **packages** section in **`AGENTS.override.md`** (section heading from preset/behavior options)
- **`sourceDefaults.localMarketplaceName`** defaults to **`clankgster-sync`** (same string as this plugin folder name); override in config if needed

Full package docs: [packages/clankgster-sync/README.md](../../../README.md).

## Run sync (monorepo)

| Command                      | Purpose    |
| ---------------------------- | ---------- |
| `pnpm clankgster-sync:run`   | Run sync   |
| `pnpm clankgster-sync:clear` | Clear mode |

**Always read** `packages/clankgster-sync/package.json` for exact script names (`clankgster-sync:run`, `clankgster-sync:clear`) — they can change. Scripts delegate to `tsx` entrypoints in that package.

For a consumer repo using the published CLI, run `clankgster-sync` from npm with `CLANKGSTER_REPO_ROOT` set to the project root (see package README).

## After sync

Confirm expected outputs (rules, skills, manifests). Do **not** hand-edit `.cursor/` or `.claude/` to fix gaps — fix sources or sync. See [trust sync](./clankgster-sync-trust-sync-and-sources.md).

## Configuration (repo root)

- **`clankgster.config.ts`** — `agents`, `excluded`, `sourceDefaults` (`localMarketplaceName`, `markdownContextFileName`, `sourceDir`, `pluginsDir`, `skillsDir`), `artifactMode` (`copy` default, `symlink` opt-in), `hooks` (`onLinkTransform`, `onXmlTransform`, `onTemplateVariable`), `syncOutputReadOnly`, `syncCacheDir`, `syncManifestPath`, `loggingEnabled`
- **Source layout:** for each source root, sync reads nested + shorthand variants for plugins and skills (nested `{sourceDir}/{pluginsDir}`, `.local` siblings, shorthand `{sourceDir}-{pluginsDir}`, etc.). `.local` variants are for uncommitted, developer-specific content
- **Env:** `CLANKGSTER_REPO_ROOT` — repo root for sync (tests, CLI). **`CLANKGSTER_LOGGING_ENABLED`** — optional file logging to `.clank/logs/clankgster-sync.log` (see **pino-logger** plugin)

## Codex target

Generated marketplace section goes to **`AGENTS.override.md`** so hand-edited **`CLANK.md`** stays canonical for Cursor/Codex context. See Codex docs for override semantics.

## E2E tests

**`packages/clankgster-sync-e2e`** — sandbox template, manifest diff, `CLANKGSTER_REPO_ROOT`. Monorepo: `pnpm e2e-tests:run`.
