---
name: clankmd-write-context
description: >-
  Writes new source pathway CLANK.md content using condensed global-context
  conventions. Use when creating or drafting context files that should preload
  into agent sessions, and enforce brevity plus high-signal linking.
---

# Write CLANK.md context

## Scope

Create new `CLANK.md` content for session preload behavior.

This skill is also the target of MCP route `clankmd.write` (`ClankMdWrite`).

## Steps

1. Gather input requirements and intended audience.
2. Read existing `CLANK.md` if present.
3. Keep only high-signal global constraints; move deep detail to links.
4. Draft using [clankmd-template.md](../../references/clankmd-template.md).
5. Produce finalized CLANK.md output.

## Verification

- [ ] Draft is concise
- [ ] Content is global, not plugin-local
- [ ] Links point to deeper material
