---
name: plugins-updating-context
description: >-
  Updates source pathway `plugins/` content across skills, rules, references,
  and docs with cross-link validation. Use when editing an existing plugin and
  preserving internal consistency.
allowed-tools: mcp__consigliere__*
---

# Updating plugin context

## Steps

1. Read affected plugin files.
2. Apply requested edits with pathway prefix conventions.
3. Re-check internal links and file references.
4. Call MCP tool `PluginsUpdating`.

## Verification

- [ ] Updated files keep naming conventions
- [ ] Cross-links resolve after edits
- [ ] No stale references remain

