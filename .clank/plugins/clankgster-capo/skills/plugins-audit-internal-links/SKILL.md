---
name: plugins-audit-internal-links
description: >-
  Audits relative markdown links within a plugin. Resolves each target path,
  checks existence, and flags broken or mismatched references.
---

# Audit plugin internal links

## Scope

Audit relative markdown links in one plugin directory.
Shared scope guidance: [internal-links-scope.md](../../references/common-audit/internal-links-scope.md)

## Out of scope

- Same-file anchors only (`#...`)

## Steps

First resolve target plugin directory per [plugins-target-resolution.md](../plugins-audit-all/resources/plugins-target-resolution.md).

Use shared steps: [internal-links-steps.md](../../references/common-audit/internal-links-steps.md)

## Output format

Use shared output format: [internal-links-output-format.md](../../references/common-audit/internal-links-output-format.md)

## Verification

Use shared verification: [internal-links-verification.md](../../references/common-audit/internal-links-verification.md)

## Cross-references

Use shared references: [internal-links-cross-references.md](../../references/common-audit/internal-links-cross-references.md)
