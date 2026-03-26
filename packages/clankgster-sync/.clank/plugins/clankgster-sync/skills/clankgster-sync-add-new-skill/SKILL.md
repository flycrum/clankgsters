---
name: clankgster-sync-add-new-skill
description: >-
  Add or update an Agent Skills–style skill: flat .clank/skills/<name>/ or plugin path .clank/plugins/<plugin>/skills/<name>/ (mirrored as <plugin>-<name>). SKILL.md frontmatter, optional scripts/, references/, assets/, Cursor vs Claude vs Codex paths. Triggers — new skill, scaffold SKILL.md, skill in a plugin, progressive disclosure, agentskills.io layout, skill naming collisions. Run sync after; do not symlink .cursor/skills or .claude/skills manually.
---

# Add new skill

Use this skill when you need to **create or update an Agent Skill**. Two supported layouts:

| Source | Path                                                         | Symlink name under native agent dirs |
| ------ | ------------------------------------------------------------ | ------------------------------------ |
| Flat   | `.clank/skills/<name>/` (or `.local` / shorthand per config) | `<name>`                             |
| Plugin | `.clank/plugins/<plugin>/skills/<name>/`                     | `<plugin>-<name>`                    |

Skills follow the [Agent Skills open standard](https://agentskills.io/specification): one directory per skill with required `SKILL.md` and optional `scripts/`, `references/`, `assets/`. Product-specific paths and frontmatter: [repo docs index](../../references/clankgster-sync-repo-docs-index.md) → `docs/CURSOR-CLAUDE-CODEX-SKILLS.md`.

## Steps

1. Choose flat or plugin scope; prefix folder name with plugin scope when it avoids collisions per [clankgster-sync-file-naming](../../rules/clankgster-sync-file-naming.md)
2. Add **SKILL.md** at the skill root with YAML frontmatter: `name`, `description`; optional fields per product docs linked above
3. Optional: **scripts/**, **references/**, **assets/** as needed
4. Keep the skill focused: one concern, clear when-to-use; link to rules or [references](../../references/README.md) for detail per [writing conventions](../../references/clankgster-sync-writing-conventions.md)
5. **Never** hand-link into `.cursor/skills` or `.claude/skills` — `@clankgster/sync` mirrors from the sources above
6. After changes: [trust sync](../../references/clankgster-sync-trust-sync-and-sources.md)
