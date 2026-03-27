---
name: plugins-update-context
description: >-
  Updates source pathway `plugins/` content across skills, rules, references,
  and docs with cross-link validation. Use when editing an existing plugin and
  preserving internal consistency.
---

# Update plugin context

## Steps

1. Read affected plugin files.
2. Apply requested edits with pathway prefix conventions.
3. Re-check internal links and file references.
4. Produce finalized update output.

This skill is also the target of MCP route `plugins.update` (`PluginsUpdate`).

## Verification

- [ ] Updated files keep naming conventions
- [ ] Cross-links resolve after edits
- [ ] No stale references remain
