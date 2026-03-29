---
name: plugins-audit-structure
description: >-
  Audits plugin directory structure, required manifests, SKILL frontmatter, and
  content placement conventions. Produces pass/warn/fail structure report.
---

# Audit plugin structure

## Scope

Audit one plugin directory whose root validates per [plugins-target-input.md](../plugins-audit-full-suite-plugin/resources/plugins-target-input.md) (any of the four allowed plugin containers).

## Steps

1. Apply [plugins-target-input.md](../plugins-audit-full-suite-plugin/resources/plugins-target-input.md): user path gate and validation as written (including sub-agent handoff).
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

