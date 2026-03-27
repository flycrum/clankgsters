---
name: common-audit-all-orchestrator
description: >-
  Orchestrates pathway-aware audits across plugin content, standalone skills,
  and CLANK.md, then consolidates findings and optionally routes into update
  workflows. Use for comprehensive audit passes and prioritized remediation.
allowed-tools:
  - AskUserQuestion
  - mcp__consigliere__PluginsUpdate
  - mcp__consigliere__SkillsUpdate
  - mcp__consigliere__ClankMdUpdate
---

# Audit orchestrator

## Scope

Run available audits, summarize findings, and offer a direct update route handoff.

## Steps

1. Identify pathway target (`plugins/`, `skills/`, `CLANK.md`).
2. Run applicable audits:
   - structure/link/content/fact/freshness for plugin targets
   - link/content checks for standalone skills and CLANK.md
3. Consolidate findings by severity.
4. Produce prioritized remediation actions.
5. Ask user whether to launch update flow now with AskUserQuestion.
6. If yes, call MCP update route:
   - `PluginsUpdate`
   - `SkillsUpdate`
   - `ClankMdUpdate`

## Output format

- health summary table
- top findings list
- concrete update actions
- optional update route confirmation

## Verification

- [ ] Pathway explicitly identified
- [ ] Only relevant audits were run
- [ ] Findings include file-level references
- [ ] Update route handoff offered

## Cross-references

- [common-content-type-comparison-matrix.md](../../docs/common-content-type-comparison-matrix.md)
- [common-organizing-content.md](../../rules/common-organizing-content.md)
- [common-mcp-tools-in-plugins.md](../../references/common-mcp-tools-in-plugins.md)
