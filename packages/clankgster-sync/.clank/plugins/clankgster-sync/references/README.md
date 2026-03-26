# clankgster-sync plugin — references

Canonical detail for this plugin lives here so **rules/** and **skills/** stay short and link one way in. Read these when you need full context; skim [plugin README](../README.md) first.

**Rule files:** Links from `rules/*.md` to this folder use **repo-root paths** (e.g. `packages/clankgster-sync/.clank/plugins/clankgster-sync/references/...`) so they still resolve after Cursor sync copies rules to `.cursor/rules/<plugin>/` (copies do not include `references/`). Skills use normal relative links — they stay symlinked to the plugin tree.

| File                                                                                         | Contents                                                                        |
| -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| [clankgster-sync-trust-sync-and-sources.md](./clankgster-sync-trust-sync-and-sources.md)     | Source of truth, run sync after edits, verification, reporting emoji convention |
| [clankgster-sync-writing-conventions.md](./clankgster-sync-writing-conventions.md)           | Rules format (`.md` only), DRY writing guidelines, rules vs commands vs skills  |
| [clankgster-sync-sync-behavior-and-config.md](./clankgster-sync-sync-behavior-and-config.md) | What `@clankgster/sync` does, scripts, config keys, Codex/Cursor notes, E2E     |
| [clankgster-sync-plugin-layout.md](./clankgster-sync-plugin-layout.md)                       | Directory layout, agent-agnostic conventions, `scripts/` and `skills/` notes    |
| [clankgster-sync-repo-docs-index.md](./clankgster-sync-repo-docs-index.md)                   | Links to repo docs comparing Cursor / Claude / Codex skills and plugins         |
