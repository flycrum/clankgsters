---
name: plugins-audit-structure
description: >-
  Audits plugin directory structure, required manifests, SKILL frontmatter, and
  content placement conventions. Produces pass/warn/fail structure report.
---

# Audit plugin structure

## Scope

Audit one plugin directory under `.clank/plugins/<plugin>/`.

## Steps

1. Resolve target plugin directory per [plugins-target-resolution.md](../plugins-audit-all/resources/plugins-target-resolution.md).
2. Scan directory tree.
3. Check required files and manifests.
4. Validate `SKILL.md` frontmatter and naming alignment.
5. Check content type placement by directory purpose.
6. Produce pass/warn/fail report.

## Output format

- `## Structure audit: <plugin-name>`
- table: check, status, details
- overall pass/warn/fail counts

## Verification

- [ ] Directory tree scanned
- [ ] Required manifests checked
- [ ] All `SKILL.md` files validated
- [ ] Placement issues explicitly listed

## Cross-references

- [common-organizing-content.md](../../rules/common-organizing-content.md)
- [skills-write-rules.md](../../rules/skills-write-rules.md)
