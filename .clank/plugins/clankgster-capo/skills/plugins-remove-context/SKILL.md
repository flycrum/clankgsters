---
name: plugins-remove-context
description: >-
  Removes source pathway `plugins/` files and performs dependency cleanup for
  references and links. Use when deleting obsolete plugin content and ensuring
  no orphaned internal references remain.
---

# Remove plugin context

## Scope

Source pathway `plugins/` content only. Deletes plugin files and repairs inbound references.

In-session agents follow this `SKILL.md` body; MCP route `plugins.remove` (`PluginsRemove`) is optional tool parity — [common_internal-in-session-vs-mcp-policy.md](../../references/common_internal-in-session-vs-mcp-policy.md).

## Steps

1. Read [reference.md](reference.md).
2. Identify files to remove.
3. Scan for inbound references from rules, skills, docs, and references.
4. Detect orphaned reference files after removal.
5. Ask user before deleting indirect/orphaned references.
6. Produce finalized removal + cleanup output.

## Verification

- [ ] Primary removals complete
- [ ] Inbound references cleaned or updated
- [ ] Orphaned-reference decision confirmed by user

