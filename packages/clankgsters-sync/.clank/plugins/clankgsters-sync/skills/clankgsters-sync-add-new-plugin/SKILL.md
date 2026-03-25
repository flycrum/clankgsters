---
name: clankgsters-sync-add-new-plugin
description: >-
  Scaffold or change a Clankgsters plugin under .clank/plugins/<name>/ (local marketplace): .cursor-plugin and .claude-plugin manifests, rules/, optional skills/commands/agents/hooks/references/, README and CLANK.md. Triggers — add or rename a plugin, new agent plugin, Cursor vs Claude plugin layout, copy the driver plugin, marketplace entry, “scaffold plugin”, hand-authored rules without sync. Ends with run clankgsters sync — never patch .cursor/ or .claude/ by hand.
---

# Add new plugin

Use this skill when you need to **create or update an agents plugin for the local marketplace** under `.clank/plugins/<name>/`. Use the **clankgsters-sync** driver plugin as the template; detail: [plugin layout](../../references/clankgsters-sync-plugin-layout.md), [writing conventions](../../references/clankgsters-sync-writing-conventions.md).

## Steps

1. Create `.clank/plugins/<name>/` with `.cursor-plugin/plugin.json` and `.claude-plugin/plugin.json` (name, description, version, author)
2. Add at plugin root: **README.md** — purpose; **CLANK.md** — purpose plus optional requirements (links to rules)
3. Put context in **rules/** as `.md` only; prefix rule filenames with plugin name per [clankgsters-sync-file-naming](../../rules/clankgsters-sync-file-naming.md). **CLANK.md** only at plugin root — not inside `rules/` or subdirs
4. Optional: `commands/`, `skills/`, `agents/`, `hooks/`; optional **`references/`** for shared markdown. Same file-naming prefix for content files in rules/commands/skills/agents
5. Keep rules/commands/skills DRY — [clankgsters-sync-writing-conventions](../../references/clankgsters-sync-writing-conventions.md)
6. **Never** hand-create symlinks or copies under `.cursor/`, `.claude/`, or other agent paths — only edit sources under `.clank/` and config
7. After adding or modifying a plugin: [trust sync](../../references/clankgsters-sync-trust-sync-and-sources.md) (read `clankgsters-sync:run` in `packages/clankgsters-sync/package.json`, run from monorepo root, verify)
