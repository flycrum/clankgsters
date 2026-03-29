---
name: plugins-update-context
description: >-
  Updates source pathway `plugins/` content across skills, rules, references,
  and docs with cross-link validation. Use when editing an existing plugin and
  preserving internal consistency.
---

# Update plugin context

## Scope

Source pathway `plugins/` content only. Edits existing plugin trees with cross-link validation.

In-session agents follow this `SKILL.md` body; MCP route `plugins.update` (`PluginsUpdate`) is optional tool parity — [common_internal-in-session-vs-mcp-policy.md](../../references/common_internal-in-session-vs-mcp-policy.md).

## Steps

1. Read [reference.md](reference.md).
2. Read affected plugin files.
3. Apply requested edits with target-plugin naming conventions (do not assume `clankgster-capo` prefixes).
4. Re-check internal links and file references.
5. Produce finalized update output.

## Verification

- [ ] Updated files keep target-plugin naming conventions
- [ ] Cross-links resolve after edits
- [ ] No stale references remain

