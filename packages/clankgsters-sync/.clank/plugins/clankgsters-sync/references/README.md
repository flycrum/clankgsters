# clankgsters-sync plugin — references

Canonical detail for this plugin lives here so **rules/** and **skills/** stay short and link one way in. Read these when you need full context; skim [plugin README](../README.md) first.

**Rule files:** Links from `rules/*.md` to this folder use **repo-root paths** (e.g. `packages/clankgsters-sync/.clank/plugins/clankgsters-sync/references/...`) so they still resolve after Cursor sync copies rules to `.cursor/rules/<plugin>/` (copies do not include `references/`). Skills use normal relative links — they stay symlinked to the plugin tree.

| File                                                                                           | Contents                                                                        |
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| [clankgsters-sync-trust-sync-and-sources.md](./clankgsters-sync-trust-sync-and-sources.md)     | Source of truth, run sync after edits, verification, reporting emoji convention |
| [clankgsters-sync-writing-conventions.md](./clankgsters-sync-writing-conventions.md)           | Rules format (`.md` only), DRY writing guidelines, rules vs commands vs skills  |
| [clankgsters-sync-sync-behavior-and-config.md](./clankgsters-sync-sync-behavior-and-config.md) | What `@clankgsters/sync` does, scripts, config keys, Codex/Cursor notes, E2E    |
| [clankgsters-sync-plugin-layout.md](./clankgsters-sync-plugin-layout.md)                       | Directory layout, agent-agnostic conventions, `scripts/` and `skills/` notes    |
| [clankgsters-sync-repo-docs-index.md](./clankgsters-sync-repo-docs-index.md)                   | Links to repo docs comparing Cursor / Claude / Codex skills and plugins         |
