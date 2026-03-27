---
name: skills-removing-context
description: >-
  Removes standalone source pathway `skills/` artifacts and checks for
  references that need follow-up cleanup. Use when deprecating or deleting a
  standalone SKILL.md workflow.
allowed-tools: mcp__consigliere__*
---

# Removing standalone skills context

## Steps

1. Confirm target standalone skill path.
2. Search for references to that skill in docs/rules/other skills.
3. Remove file and propose cleanup edits.
4. Call MCP tool `SkillsRemoving`.

## Verification

- [ ] Removal target confirmed
- [ ] Reference fallout reviewed
- [ ] Cleanup suggestions included

