# Purpose

Merges config layers by source priority and validates final shape with Zod.

## Invariants

- Output must always pass `clankgstersConfigSchema.config`.
- Merge is deterministic (source order sorted by priority).
- `agents` is merged shallowly by key so source overrides are targeted.
