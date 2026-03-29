---
name: clankmd-audit-full-suite-md
description: >-
  Runs all CLANK.md audits via sub-agents for one target CLANK.md file and
  returns a combined report. Optional healer: follow clankmd-update-context
  (MCP ClankMdUpdate only if host exposes tools).
allowed-tools:
  - Agent
  - AskUserQuestion
  - mcp__capo__ClankMdUpdate
---

# Audit all CLANK.md pathways

## Scope

Run the full CLANK.md audit suite against one `CLANK.md` file.

## Steps

1. Apply [clankmd-target-input.md](resources/clankmd-target-input.md): mandatory `AskUserQuestion` first (no Glob/focus/search-derived options); validate user-supplied path; then run audits
2. Launch leaf audits via sub-agents (**each sub-agent prompt must state the same validated `CLANK.md` path** so leaves use the resource’s sub-agent handoff):
   - `clankmd-audit-content-quality`
   - `clankmd-audit-internal-links`
   - `clankmd-audit-external-links`
   - `clankmd-audit-fact-check`
   - `clankmd-audit-source-freshness`
3. Collect full reports and build:
   - summary table
   - full appended reports by audit type
4. Assign overall pathway grade using [audit-grade-assignment.md](../../references/common-audit/audit-grade-assignment.md).
5. Include grade characterization, ASCII badge, and severity distribution in output.
6. Ask user whether to run healer (update) flow for this pathway.
7. If yes: **primary** — read and follow [clankmd-update-context/SKILL.md](../clankmd-update-context/SKILL.md) with validated `CLANK.md` path and aggregated findings context.
8. **Optional** — if capo MCP is available and the user prefers tool dispatch, call `ClankMdUpdate` with the same intent instead per [common-internal-mcp-routing-spec.md](../../docs/common-internal-mcp-routing-spec.md).

## Sub-agent execution contract

- Leaf audits must run in sub-agents.
- Use parallel execution when possible.
- Preserve complete markdown reports from each leaf.

## Output format

- `# CLANK.md audit: <clankmd-path>`
- `## Summary` table
- `## Grade` with letter grade, characterization, and ASCII badge
- appended full reports
- optional healer handoff result

## Verification

- [ ] All 5 CLANK.md audits executed through sub-agents
- [ ] Summary table and full reports are consistent
- [ ] Grade and badge derived from aggregated findings
- [ ] Target `CLANK.md` taken from mandatory `AskUserQuestion` (or non-interactive explicit path per resource); no discovery-based selection
- [ ] Healer question asked before update; primary path is read-and-follow `clankmd-update-context` unless user chose MCP tool

