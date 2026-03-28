# Naming and organization

Plugin content naming and organization guidance with collision-aware pragmatism.

## Naming guidance

- Prefer descriptive names that communicate purpose first
- Prefixing with plugin/pathway tokens is recommended for disambiguation
- Hard prefix requirements are optional unless target sync layout can collide

## Uniqueness

- Skills, rules, and commands should avoid collisions in final synced targets
- References/docs are path-scoped and less collision-prone

## Sync behavior note

Sync systems may namespace by plugin directory or transform file names. Choose source names for readability first, then enforce collision safety at sync boundaries.

---

*Parent: [Content type comparison matrix](../references/common-content-type-comparison-matrix.md)*
