# Repo docs: Cursor, Claude, Codex (skills and plugins)

These live at the monorepo root under **`docs/`**. Use them when you need product-specific behavior (paths, frontmatter, Cursor-only rules, marketplace behavior), not duplicated in this plugin.

| Doc                                                                                   | Use it for                                                                                                                                                                        |
| ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [CURSOR-CLAUDE-CODEX-SKILLS.md](../../../../../../docs/CURSOR-CLAUDE-CODEX-SKILLS.md) | Standalone Agent Skills: where skills load per product, `SKILL.md` frontmatter, optional `scripts/` / **`references/`** / `assets/`, progressive disclosure                       |
| [CURSOR-VS-CLAUDE-PLUGINS.md](../../../../../../docs/CURSOR-VS-CLAUDE-PLUGINS.md)     | Plugin manifests (`.cursor-plugin` vs `.claude-plugin`), rules vs skills vs commands, hooks/MCP, **why clankgster-sync materializes `.cursor/`** (no local marketplace in Cursor) |

**Why clankgster-sync exists (short):** Cursor does not discover arbitrary on-disk marketplace JSON the way some flows expect; sync writes rules, commands, skills, and agents into project-native paths. The plugins doc spells out Cursor vs Claude differences (path overrides, rules in plugins, etc.).
