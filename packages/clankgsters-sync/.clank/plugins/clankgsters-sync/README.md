# clankgsters-sync plugin

Driver plugin for **[@clankgsters/sync](https://github.com/flycrum/clankgsters/tree/main/packages/clankgsters-sync)**: discovers root and nested plugin/skill sources (including `.local` + shorthand layouts), writes marketplace manifests for Claude and Codex, syncs plugin content into `.cursor/` (rules, commands, skills, agents), and symlinks plugin rules into `.claude/rules/`.

---

## Purpose

1. **Driver** — Documents and guides the Clankgsters sync system: discovery, manifests, Cursor local content, Codex `AGENTS.override.md` section, Claude `CLAUDE.md` ↔ `CLANK.md` symlinks.
2. **Reference example** — Canonical template for local `.clank/plugins/<name>/` layout. When adding plugins, match structure and naming in [rules](./rules/).

---

## Where the detail lives

| Need                                                      | Go to                                                                                                                |
| --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Trust sync workflow, source of truth, after-edit steps    | [references/clankgsters-sync-trust-sync-and-sources.md](./references/clankgsters-sync-trust-sync-and-sources.md)     |
| Writing rules/commands/skills, `.md`-only format          | [references/clankgsters-sync-writing-conventions.md](./references/clankgsters-sync-writing-conventions.md)           |
| What sync does, scripts, `clankgsters.config.ts`, E2E     | [references/clankgsters-sync-sync-behavior-and-config.md](./references/clankgsters-sync-sync-behavior-and-config.md) |
| Plugin directory layout, `scripts/` / `skills/` notes     | [references/clankgsters-sync-plugin-layout.md](./references/clankgsters-sync-plugin-layout.md)                       |
| Cursor vs Claude vs Codex (skills & plugins) in this repo | [references/clankgsters-sync-repo-docs-index.md](./references/clankgsters-sync-repo-docs-index.md)                   |
| Index of all reference files                              | [references/README.md](./references/README.md)                                                                       |

**Thin rules** under [rules/](./rules/) point here so synced agent rules stay short.

---

## Trust sync (summary)

Edit **only** agent-agnostic sources (`.clank/plugins/`, `.clank/skills*`, `clankgsters.config.ts`). **Do not** hand-create symlinks or files under `.cursor/`, `.claude/`, or marketplace JSON to register plugins/rules/commands/skills.

After any change, read **`packages/clankgsters-sync/package.json`** for **`clankgsters-sync:run`**, run it from the repo root, and verify outputs. Full workflow: [references/clankgsters-sync-trust-sync-and-sources.md](./references/clankgsters-sync-trust-sync-and-sources.md).

---

## Package README and cross-repo docs

- Full package docs: [packages/clankgsters-sync/README.md](../../README.md)
- Cursor vs Claude plugins (why sync writes `.cursor/`): [docs/CURSOR-VS-CLAUDE-PLUGINS.md](../../../../../docs/CURSOR-VS-CLAUDE-PLUGINS.md)
