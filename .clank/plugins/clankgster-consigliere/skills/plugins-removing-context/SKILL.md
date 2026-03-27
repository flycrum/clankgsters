---
name: plugins-removing-context
description: >-
  Removes source pathway `plugins/` files and performs dependency cleanup for
  references and links. Use when deleting obsolete plugin content and ensuring
  no orphaned internal references remain.
allowed-tools: mcp__consigliere__*
---

# Removing plugin context

## Steps

1. Identify files to remove.
2. Scan for inbound references from rules, skills, docs, and references.
3. Detect orphaned reference files after removal.
4. Ask user before deleting indirect/orphaned references.
5. Call MCP tool `PluginsRemoving`.

## Verification

- [ ] Primary removals complete
- [ ] Inbound references cleaned or updated
- [ ] Orphaned-reference decision confirmed by user

