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

- Same-file anchors only (`#...`) as the **sole** target (no file path)
- Relative targets that appear only inside fenced code blocks (template examples); see [internal-links-scope.md](../../references/common-audit/internal-links-scope.md)

## In scope

- Cross-file relative links in normal markdown body text (rendered as followable links)
- **`docs/` target policy** (plugins only): navigational links into `pluginRoot/docs/` from outside that folder; rules [common-plugin-docs-folder-linking.md](../../references/common-plugin-docs-folder-linking.md), audit verification [internal-links-plugin-docs-folder-policy.md](../../references/common-audit/internal-links-plugin-docs-folder-policy.md)

## Steps

Apply [plugins-target-input.md](../plugins-audit-full-suite-plugin/resources/plugins-target-input.md): user path gate and validation as written (including sub-agent handoff); then shared audit steps.

Use shared steps: [internal-links-steps.md](../../references/common-audit/internal-links-steps.md)

Then apply the linking rules in [common-plugin-docs-folder-linking.md](../../references/common-plugin-docs-folder-linking.md): for each in-scope navigational link, evaluate exemptions and emit **`docs/` target policy** rows (resolved targets only; same fence and monospace rules as the shared audit). Use [internal-links-plugin-docs-folder-policy.md](../../references/common-audit/internal-links-plugin-docs-folder-policy.md) for the audit verification checklist.

## Output format

Use shared output format: [internal-links-output-format.md](../../references/common-audit/internal-links-output-format.md)

Append:

- `## Plugin docs/ target policy`
- table: source, link text, resolved target, status (`exempt` \| `policy`), notes (exemption per [common-plugin-docs-folder-linking.md](../../references/common-plugin-docs-folder-linking.md) or remediation: move to `references/`, skill `reference.md`, or skill-owned subtree; or link via README / matrix hub only)

Policy findings count separately from broken/mismatch totals; list them after broken/mismatch tables.

## Verification

Use shared verification: [internal-links-verification.md](../../references/common-audit/internal-links-verification.md)

- [ ] `docs/` target policy pass applied per [common-plugin-docs-folder-linking.md](../../references/common-plugin-docs-folder-linking.md) with checklist [internal-links-plugin-docs-folder-policy.md](../../references/common-audit/internal-links-plugin-docs-folder-policy.md)
- [ ] Plugin `docs/` policy section present in output when any link targets `pluginRoot/docs/` from outside `docs/`

## Cross-references

Use shared references: [internal-links-cross-references.md](../../references/common-audit/internal-links-cross-references.md)
