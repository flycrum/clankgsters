---
name: skills-audit-full-suite-skill
description: >-
  Runs all standalone skills audits via sub-agents for one target skill
  directory and returns a combined report. Optional healer: follow
  skills-update-context (MCP SkillsUpdate only if host exposes tools).
allowed-tools:
  - Agent
  - AskUserQuestion
  - mcp__capo__SkillsUpdate
---

# Audit all standalone skills pathways

## Scope

Run the full standalone `skills/` audit suite against one target skill directory.

## Steps

1. Apply [skills-target-input.md](resources/skills-target-input.md): mandatory `AskUserQuestion` first (no Glob/focus/search-derived options); validate user-supplied skill directory; then run audits
2. Launch leaf audits via sub-agents (**each sub-agent prompt must state the same validated skill directory path** so leaves use the resource’s sub-agent handoff):
   - `skills-audit-content-quality`
   - `skills-audit-internal-links`
   - `skills-audit-external-links`
   - `skills-audit-fact-check`
   - `skills-audit-source-freshness`
3. Collect full reports and build:
   - summary table
   - full appended reports in audit-type sections
4. Assign overall pathway grade using [audit-grade-assignment.md](../../references/common-audit/audit-grade-assignment.md).
5. Include grade characterization, ASCII badge, and severity distribution in output.
6. Ask user whether to run healer (update) flow for this pathway.
7. If yes: **primary** — read and follow [skills-update-context/SKILL.md](../skills-update-context/SKILL.md) with validated skill directory and aggregated findings context.
8. **Optional** — if capo MCP is available and the user prefers tool dispatch, call `SkillsUpdate` with the same intent instead per [common-internal-mcp-routing-spec.md](../../docs/common-internal-mcp-routing-spec.md).

## Sub-agent execution contract

- Sub-agents are mandatory for leaf execution.
- Launch in parallel where safe.
- Require full markdown report return from each leaf.

## Output format

- `# Standalone skills audit: <skill-name>`
- `## Summary` table
- `## Grade` with letter grade, characterization, and ASCII badge
- appended full reports
- optional healer handoff result

## Verification

- [ ] All 5 standalone-skill audits executed through sub-agents
- [ ] Target skill directory from mandatory `AskUserQuestion` (or non-interactive explicit path per resource); no discovery-based selection
- [ ] Summary aligns to leaf results
- [ ] Full reports preserved
- [ ] Grade and badge derived from aggregated findings
- [ ] Healer prompt displayed; primary path read-and-follow `skills-update-context` unless user chose MCP tool

