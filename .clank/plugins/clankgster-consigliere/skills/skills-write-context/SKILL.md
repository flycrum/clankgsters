---
name: skills-write-context
description: >-
  Writes standalone source pathway `skills/` artifacts (`SKILL.md`) with
  discovery-grade descriptions and verification checklists. Use when creating a
  single reusable workflow without a full plugin wrapper.
---

# Write standalone skills context

## Scope

Create `.clank/skills/<name>/SKILL.md` (or shorthand variants) for one workflow.

This skill is also the target of MCP route `skills.write` (`SkillsWrite`).

## Source layouts

- `.clank/skills/<name>/`
- `.clank/skills.local/<name>/`
- `.clank-skills/<name>/`
- `.clank-skills.local/<name>/`

## Steps

1. Gather workflow intent and triggers.
2. Draft frontmatter (`name`, `description`) and body sections.
3. Validate description specificity and trigger terms.
4. Produce finalized skill artifact output.

## Verification

- [ ] Valid `SKILL.md` structure
- [ ] Description is high signal
- [ ] Output path is in source pathway `skills/`
