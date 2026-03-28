---
name: clankmd-audit-all
description: >-
  Runs all CLANK.md audits via sub-agents for one target CLANK.md file and
  returns a combined report. Optionally triggers ClankMdUpdate as a healer flow
  after review.
allowed-tools:
  - Agent
  - AskUserQuestion
  - mcp__capo__ClankMdUpdate
---

# Audit all CLANK.md pathways

## Scope

Run the full CLANK.md audit suite against one `CLANK.md` file.

## Steps

1. Resolve target `CLANK.md` using [clankmd-target-resolution.md](resources/clankmd-target-resolution.md):
   - if user or MCP already names the file path, validate and use (no extra question)
   - otherwise always `AskUserQuestion` before audits; include focused `CLANK.md` as first option when known, plus other candidates and **Other**
2. Launch leaf audits via sub-agents:
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
6. Ask user whether to run healer flow via `ClankMdUpdate`.
7. If yes, call `ClankMdUpdate` with target file and aggregated findings.

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
- [ ] Target `CLANK.md` resolved per binding rules (asked when not explicit)
- [ ] Healer question asked before update call

## Cross-references

- [clankmd-write.md](../../rules/clankmd-write.md)
- [common-internal-mcp-routing-spec.md](../../docs/common-internal-mcp-routing-spec.md)
- [skill-asking-for-user-input.md](../skills-write-context/docs/skill-asking-for-user-input.md)
- [audit-grade-assignment.md](../../references/common-audit/audit-grade-assignment.md)
