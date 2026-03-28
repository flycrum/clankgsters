---
name: plugins-audit-comparison-matrix
description: >-
  Audits the plugin content type comparison matrix for cell accuracy, footnote
  integrity, and section-link consistency against current platform docs.
---

# Audit plugin comparison matrix

## Scope

Audit `docs/common-content-type-comparison-matrix.md` and linked 1:1 detail docs within the plugin.

## Steps

1. Apply [plugins-target-input.md](../plugins-audit-all/resources/plugins-target-input.md): user path gate and validation as written (including sub-agent handoff).
2. Verify the matrix file exists in plugin docs.
3. Parse table claims, footnotes, and section links.
4. Validate cell values against current official docs.
5. Check footnote integrity: missing refs, orphan defs, duplicates.
6. Validate section links and data consistency with linked detail docs.

## Output format

- `## Matrix audit: content-type-comparison-matrix`
- cell accuracy table
- footnote integrity table
- section-link validation table

## Verification

- [ ] Every factual cell checked
- [ ] Footnote references and definitions cross-checked both directions
- [ ] Every section link resolved and validated

## Cross-references

- [common-content-type-comparison-matrix.md](../../docs/common-content-type-comparison-matrix.md)
- [common-content-type-decision-tree.md](../../docs/common-content-type-decision-tree.md)
