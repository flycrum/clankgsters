---
name: plugins-audit-content-quality
description: >-
  Audits prompt-engineering quality for markdown content in a single plugin.
  Evaluates clarity, framing, emphasis, examples, and inferable content.
  Produces severity-ranked findings and an overall grade.
---

# Audit plugin content quality

## Scope

Audit markdown writing quality for one plugin whose root validates per [plugins-target-input.md](../plugins-audit-full-suite-plugin/resources/plugins-target-input.md) (any of the four allowed plugin containers, not only `.clank/plugins/<plugin>/`).
Shared scope guidance: [content-quality-scope.md](../../references/common-audit/content-quality-scope.md)

## Steps

Apply [plugins-target-input.md](../plugins-audit-full-suite-plugin/resources/plugins-target-input.md): user path gate and validation as written (including sub-agent handoff); then shared audit steps.

Use shared steps: [content-quality-steps.md](../../references/common-audit/content-quality-steps.md)

## Output format

Use shared output format: [content-quality-output-format.md](../../references/common-audit/content-quality-output-format.md)

## Verification

Use shared verification: [content-quality-verification.md](../../references/common-audit/content-quality-verification.md)

