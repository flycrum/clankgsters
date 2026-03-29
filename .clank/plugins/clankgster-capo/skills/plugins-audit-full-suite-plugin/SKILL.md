---
name: plugins-audit-full-suite-plugin
description: >-
  Runs all plugin audit types via sub-agents for one target plugin and returns
  a combined report with a summary table. Optional healer: follow
  plugins-update-context (MCP PluginsUpdate only if host exposes tools).
allowed-tools:
  - Agent
  - AskUserQuestion
  - mcp__capo__PluginsUpdate
---

# Audit all plugin pathways

## Scope

Run the full plugin audit suite against one plugin root under any of the four sync layouts (see [plugins-target-input.md](resources/plugins-target-input.md) **Allowed roots**).

## Steps

1. Apply [plugins-target-input.md](resources/plugins-target-input.md): mandatory `AskUserQuestion` first (no Glob/focus/search-derived options); validate user-supplied plugin root; then run audits
2. Launch each audit as a sub-agent (required); **each sub-agent prompt must state the same validated plugin root path** so leaves use the resource’s sub-agent handoff:
   - `plugins-audit-content-quality`
   - `plugins-audit-internal-links`
   - `plugins-audit-external-links`
   - `plugins-audit-fact-check`
   - `plugins-audit-source-freshness`
   - `plugins-audit-comparison-matrix`
   - `plugins-audit-structure`
3. Use sub-agent prompts that require full report return (no truncation, no summaries).
4. Collect all responses and build:
   - cross-audit summary table
   - full appended reports, in audit-type sections
5. Assign overall pathway grade using [audit-grade-assignment.md](../../references/common-audit/audit-grade-assignment.md).
6. Include grade characterization, ASCII badge, and severity distribution in output.
7. Ask user whether to run healer (update) flow for this pathway.
8. If yes: **primary** — read and follow [plugins-update-context/SKILL.md](../plugins-update-context/SKILL.md) with validated plugin root and aggregated findings context.
9. **Optional** — if capo MCP is available and the user prefers tool dispatch, call `PluginsUpdate` with the same intent instead per [common-internal-mcp-routing-spec.md](../../docs/common-internal-mcp-routing-spec.md).

## Sub-agent execution contract

- Always execute leaf audits through sub-agents.
- Prefer parallel launch for independent audits.
- Each sub-agent response must include complete markdown report content.

## Output format

- `# Plugins audit: <plugin-name>`
- `## Summary` table (audit, status, issues)
- `## Grade` with letter grade, characterization, and ASCII badge
- full per-audit reports, appended as-is
- optional healer handoff result

## Verification

- [ ] All 7 plugin audits executed through sub-agents
- [ ] Target plugin root from mandatory `AskUserQuestion` (or non-interactive explicit path per resource); no discovery-based selection
- [ ] Summary table reflects leaf report outcomes
- [ ] Full reports preserved without data loss
- [ ] Grade and badge derived from aggregated findings
- [ ] Healer prompt shown; primary path read-and-follow `plugins-update-context` unless user chose MCP tool

