# clankgsters-sync plugin

Driver plugin for **[@clankgsters/sync](https://github.com/flycrum/clankgsters/tree/main/packages/clankgsters-sync)**: discovers root and nested `.clank/plugins/`, writes marketplace manifests for Claude and Codex, syncs plugin content into `.cursor/` (rules, commands, skills, agents), and symlinks plugin rules into `.claude/rules/`.

---

## Purpose

1. **Driver** — Documents and guides the Clankgsters sync system: discovery, manifests, Cursor local content, Codex `AGENTS.override.md` section, Claude `CLAUDE.md` ↔ `CLANK.md` symlinks.
2. **Reference example** — Canonical template for local `.clank/plugins/<name>/` layout. When adding plugins, match structure and naming in [rules](./rules/).

---

## Agent-agnostic conventions

| Convention         | What we do                                                                                    | Why                                                                                                           |
| ------------------ | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| **Shared content** | One source: `skills/`, `agents/`, `commands/`, `hooks/`, `rules/`, `.mcp.json` at plugin root | Define once, use everywhere                                                                                   |
| **Thin manifests** | `.cursor-plugin/plugin.json` and `.claude-plugin/plugin.json` with minimal metadata           | Each agent has its own manifest dir                                                                           |
| **Rules**          | Plugin `rules/` → symlinked to `.claude/rules/<plugin>/`; copied as `.mdc` for Cursor         | See [clankgsters-sync-rules-purpose-and-guidelines](./rules/clankgsters-sync-rules-purpose-and-guidelines.md) |

**Exceptions:** Cursor path overrides can replace defaults; Claude supplements. Prefer default folders unless you document otherwise.

---

## What sync does (package behavior)

The npm package **`@clankgsters/sync`** runs TypeScript entry scripts that:

- Resolve **`clankgsters.config.ts`** (and optional local config), then walk enabled agents and behaviors.
- Write `.claude-plugin/marketplace.json` and related manifest entries under **`.clankgsters-cache/sync-manifest.json`**.
- For **Cursor**: mirror plugin content into `.cursor/` (rules as `.mdc` with frontmatter where required).
- For **Codex**: maintain the **packages** section in **`AGENTS.override.md`** (section heading comes from preset/behavior options in config).
- **`sourceDefaults.localMarketplaceName`** defaults to **`clankgsters-sync`** (same string as this plugin folder name); override in config if needed.

Full package docs: [packages/clankgsters-sync/README.md](../../README.md). Cursor vs Claude: [docs/CURSOR-VS-CLAUDE-PLUGINS.md](../../../../docs/CURSOR-VS-CLAUDE-PLUGINS.md).

---

## E2E tests

**`packages/clankgsters-sync-e2e`** — sandbox template, manifest diff, `CLANKGSTERS_REPO_ROOT`. Monorepo: `pnpm test:e2e`.

---

## Plugin layout

```
<plugin-name>/
├── .cursor-plugin/plugin.json
├── .claude-plugin/plugin.json
├── skills/
├── agents/
├── commands/
├── hooks/hooks.json
├── rules/                    # .md only; see rules/clankgsters-sync-*.md
├── README.md
└── CLANK.md                  # optional at plugin root
```

---

## Configuration (repo)

- **Root config:** `clankgsters.config.ts` — `agents`, `excluded`, `sourceDefaults` (`localMarketplaceName`, `markdownContextFileName`, `.clank` layout paths), `syncCacheDir`, `syncManifestPath`, `loggingEnabled`.
- **Env:** `CLANKGSTERS_REPO_ROOT` — repo root for sync (tests, published CLI, linked installs). **`CLANKGSTERS_LOGGING_ENABLED`** — optional file logging to `.clank/logs/clankgsters-sync.log` (see **pino-logger** plugin).

---

## Run sync from the monorepo

| Command                       | Purpose                                                         |
| ----------------------------- | --------------------------------------------------------------- |
| `pnpm clankgsters-sync:run`   | Run sync (root `package.json` delegates to `@clankgsters/sync`) |
| `pnpm clankgsters-sync:clear` | Clear mode                                                      |

Package scripts are `clankgsters-sync:run` / `clankgsters-sync:clear` inside `packages/clankgsters-sync/package.json` (tsx entrypoints).

---

## Codex target

Generated marketplace section goes to **`AGENTS.override.md`** so hand-edited **`CLANK.md`** stays canonical for Cursor/Codex context. See Codex docs for override semantics.

---

## scripts/ in a plugin

- **Hook callables** — invoked by `hooks/hooks.json`.
- **Plugin-internal tooling** — optional CLIs or helpers; keep separate from sync core in **`@clankgsters/sync`** unless you are contributing to that package.
