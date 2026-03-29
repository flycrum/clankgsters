---
name: skills-create-context
description: >-
  Creates standalone source pathway `skills/` artifacts (`SKILL.md`) with
  discovery-grade descriptions and verification checklists. Use when creating a
  single reusable workflow without a full plugin wrapper.
---

# Create standalone skills context

## Scope

Create `.clank/skills/<name>/SKILL.md` (or shorthand variants) for one workflow.

In-session agents follow this `SKILL.md` body; capo MCP route `skills.create` (`SkillsCreate`) is an optional tool surface — [common_internal-in-session-vs-mcp-policy.md](../../references/common_internal-in-session-vs-mcp-policy.md).

## Source layouts

- `.clank/skills/<name>/`
- `.clank/skills.local/<name>/`
- `.clank-skills/<name>/`
- `.clank-skills.local/<name>/`

## Steps

1. Gather workflow intent and triggers.
2. Read [reference.md](reference.md) to load the canonical skill-authoring guidance.
3. Draft frontmatter (`name`, `description`) and body sections using the referenced guidance.
4. Validate description specificity and trigger terms.
5. Produce finalized skill artifact output.

## Verification

- [ ] Valid `SKILL.md` structure
- [ ] Description is high signal
- [ ] Output path is in source pathway `skills/`

