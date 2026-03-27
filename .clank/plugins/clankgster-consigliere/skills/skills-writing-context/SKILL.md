---
name: skills-writing-context
description: >-
  Writes standalone source pathway `skills/` artifacts (`SKILL.md`) with
  discovery-grade descriptions and verification checklists. Use when creating a
  single reusable workflow without a full plugin wrapper.
allowed-tools: mcp__consigliere__*
---

# Writing standalone skills context

## Scope

Create `.clank/skills/<name>/SKILL.md` (or shorthand variants) for one workflow.

## Source layouts

- `.clank/skills/<name>/`
- `.clank/skills.local/<name>/`
- `.clank-skills/<name>/`
- `.clank-skills.local/<name>/`

## Steps

1. Gather workflow intent and triggers.
2. Draft frontmatter (`name`, `description`) and body sections.
3. Validate description specificity and trigger terms.
4. Call MCP tool `SkillsWriting`.

## Verification

- [ ] Valid `SKILL.md` structure
- [ ] Description is high signal
- [ ] Output path is in source pathway `skills/`

