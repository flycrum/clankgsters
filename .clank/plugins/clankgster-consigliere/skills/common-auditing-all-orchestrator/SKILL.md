---
name: common-auditing-all-orchestrator
description: >-
  Orchestrates pathway-aware audits across plugin content, standalone skills, and
  CLANK.md, then consolidates findings and optionally chains into updating
  workflows. Use for comprehensive audit passes and prioritized remediation.
allowed-tools: mcp__consigliere__*
---

# Auditing orchestrator

## Scope

Run available audits, summarize findings, and offer a direct update handoff.

## Steps

1. Identify pathway target (`plugins/`, `skills/`, `CLANK.md`).
2. Run applicable audits:
   - structure/link/content/fact/freshness for plugin targets
   - link/content checks for standalone skills and CLANK.md
3. Consolidate findings by severity.
4. Produce prioritized remediation actions.
5. Ask user whether to launch updating flow now.
6. If yes, call MCP tool:
   - `PluginsUpdating`
   - `SkillsUpdating`
   - `ClankMdUpdating`

## Output format

- health summary table
- top findings list
- concrete update actions
- optional update handoff confirmation

## Verification

- [ ] Pathway explicitly identified
- [ ] Only relevant audits were run
- [ ] Findings include file-level references
- [ ] Update handoff offered

## Cross-references

- [common-content-type-comparison-matrix.md](../../docs/common-content-type-comparison-matrix.md)
- [common-organizing-content.md](../../rules/common-organizing-content.md)
- [common-mcp-tools-in-plugins.md](../../references/common-mcp-tools-in-plugins.md)
