---
name: skills-remove-context
description: >-
  Removes standalone source pathway `skills/` artifacts and checks for
  references that need follow-up cleanup. Use when deprecating or deleting a
  standalone SKILL.md workflow.
---

# Remove standalone skills context

## Scope

Standalone source pathway `skills/` workflows only. Deprecation and reference cleanup.

In-session agents follow this `SKILL.md` body; MCP route `skills.remove` (`SkillsRemove`) is optional tool parity — [common_internal-in-session-vs-mcp-policy.md](../../references/common_internal-in-session-vs-mcp-policy.md).

## Steps

1. Read [reference.md](reference.md).
2. Confirm target standalone skill path.
3. Search for references to that skill in docs/rules/other skills.
4. Remove file and propose cleanup edits.
5. Produce finalized removal + cleanup output.

## Verification

- [ ] Removal target confirmed
- [ ] Reference fallout reviewed
- [ ] Cleanup suggestions included

