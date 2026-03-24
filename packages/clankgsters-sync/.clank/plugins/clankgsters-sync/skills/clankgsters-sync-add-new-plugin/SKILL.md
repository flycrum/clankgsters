---
name: Add new .clank/plugins plugin for local marketplace
description: Create or update a plugin under .clank/plugins/<name>/ in a Clankgsters repo. Use when the user asks to add a plugin, scaffold a new plugin, or follow this plugin layout.
---

# Add new plugin

Use this skill when you need to **create or update an agents plugin for the local marketplace** under `.clank/plugins/<name>/`. Reference the **clankgsters-sync** driver plugin for layout and conventions.

## Steps

1. Create `.clank/plugins/<name>/` with `.cursor-plugin/plugin.json` and `.claude-plugin/plugin.json` (name, description, version, author)
2. Add at plugin root: **README.md** — purpose only; **CLANK.md** — purpose plus optional requirements (links to rules)
3. Put context in **rules/** as `.md` only; prefix rule filenames with plugin name per [clankgsters-sync-file-naming](../../rules/clankgsters-sync-file-naming.md). **CLANK.md** must exist only at the plugin root — do not place CLANK.md inside rules/ or any other subdirectory
4. Optional: commands/, skills/, agents/, hooks/ per [plugin README](../../README.md). Same file-naming prefix for content files
5. Keep rules/commands/skills DRY and lean per [clankgsters-sync-writing-rules-commands-skills](../../rules/clankgsters-sync-writing-rules-commands-skills.md)
6. After adding or modifying a plugin, run sync from repo root: `pnpm clankgsters-sync:run` (monorepo root) or the equivalent from your package. Sync discovers plugins automatically; no hand-edit of marketplace list
