---
name: Add new Agent Skill
description: Create or update a skill under .clank/skills/<name>/ in a Clankgsters repo. Use when the user asks to add a skill, scaffold a new skill, or follow the Agent Skills open standard.
---

# Add new skill

Use this skill when you need to **create or update an Agent Skill** under `.clank/skills/<name>/`. Skills follow the [Agent Skills open standard](https://agentskills.io/specification): one directory per skill with required `SKILL.md` and optional `scripts/`, `references/`, `assets/`.

## Steps

1. Create `.clank/skills/<name>/` (or the resolved skills path from config / discovery)
2. Add **SKILL.md** at the skill root with YAML frontmatter: `name`, `description`; optional product-specific fields per `docs/CURSOR-CLAUDE-CODEX-SKILLS.md` in the repo
3. Optional: **scripts/** (runnable helpers), **references/**, **assets/** as needed
4. Keep the skill focused: one concern, clear when-to-use; link to rules or docs for detail per [clankgsters-sync-writing-rules-commands-skills](../../rules/clankgsters-sync-writing-rules-commands-skills.md)
5. Prefix skill folder name with plugin scope if desired (e.g. `clankgsters-sync-add-new-skill`) per [clankgsters-sync-file-naming](../../rules/clankgsters-sync-file-naming.md)
6. After adding or modifying skills under `.clank/skills/`, run sync from repo root so Claude receives them under `.claude/skills/`: `pnpm clankgsters-sync:run` (or per-agent). Cursor and Codex discover `.clank/skills/` natively
