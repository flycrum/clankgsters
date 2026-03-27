---
name: auditing-fact-check
description: >-
  Fact-checks all claims in plugin content — version numbers, feature support,
  tool names, character limits, behavior descriptions, platform comparisons.
  Reads all plugin files, extracts factual claims, then verifies each against
  current sources using WebSearch and WebFetch. Flags outdated, incorrect, or
  unverifiable claims. Produces a fact-check report with file, claim, current
  status, source, and recommended action. Triggers — "fact-check plugin",
  "verify plugin claims", "are my facts correct?", "audit accuracy", fact
  verification, claim validation.
---

# Audit fact-check

Verify factual claims across all plugin content against current information from the web.

## Scope

Reads all `.md` files in a single plugin directory. Identifies verifiable factual claims and checks each against current sources. Report only.

## Out of scope

- Subjective opinions or recommendations (only factual claims)
- Link accessibility (use auditing-external-links)
- Source freshness comparison (use auditing-source-freshness for URL-specific drift)
- Plugin structure or writing quality

---

## Pre-checks

**STOP** if no plugin path is provided. Use AskUserQuestion to request it.

**STOP** if the target directory does not exist.

---

## 1. Read all plugin content

Use Glob to find all `.md` files, then Read each file.

---

## 2. Extract factual claims

<instructions>
Scan each file for verifiable factual claims. Categories:

1. **Version numbers** — "requires Node 18+", "Claude 3.5 Sonnet", "API v2"
2. **Feature support** — "Cursor supports X", "Claude Code does not support Y"
3. **Limits and constraints** — "max 1024 characters", "up to 5 files", "64 char limit"
4. **Tool/product names** — correct names, current branding
5. **Behavior descriptions** — "the agent loads rules at startup", "descriptions are matched via embedding"
6. **Platform comparisons** — "X works in Claude Code but not Cursor"
7. **Syntax and configuration** — correct field names, file formats, directory paths
8. **Dates and timelines** — "introduced in 2024", "deprecated since v3"

For each claim, record:

- The exact text making the claim
- The file and approximate location
- The claim category
</instructions>

---

## 3. Verify each claim

<instructions>
For each factual claim:

1. Use WebSearch to find current authoritative sources
2. Use WebFetch on the most relevant result to read the actual content
3. Compare the plugin's claim against the source
4. Classify the result:
   - **Verified** — claim matches current sources
   - **Outdated** — claim was true but is no longer current
   - **Incorrect** — claim does not match any authoritative source
   - **Unverifiable** — cannot find authoritative source to confirm or deny
   - **Partially correct** — claim is true with caveats or nuances the plugin omits

When processing many claims, prioritize:

- High-impact claims (limits, version requirements, feature support) first
- Claims in frequently-loaded files (rules, skill descriptions) over docs
- Claims that affect agent behavior over informational claims
</instructions>

---

## 4. Produce fact-check report

Output:

```markdown
## Fact-check audit: <plugin-name>

**Claims checked:** N
**Verified:** N | **Outdated:** N | **Incorrect:** N | **Unverifiable:** N

| File | Claim | Current Status | Source | Action |
|------|-------|----------------|--------|--------|
| rules/topic.md | "max 1024 characters" | Now 2048 chars (updated Dec 2025) | docs.example.com/limits | Update limit value |
| docs/matrix.md | "Cursor does not support X" | Cursor added X in v0.45 | changelog.cursor.com | Update comparison |
| references/ref.md | "Claude 3.5 Sonnet" | Current model is Claude 4 | anthropic.com/models | Update model name |
| ... | ... | ... | ... | ... |
```

Show incorrect and outdated first.

---

## 5. Summary

1. **Critical corrections** — claims that if left wrong would cause agent errors
2. **Staleness pattern** — areas of the plugin most prone to outdated facts
3. **Confidence notes** — any claims where verification was uncertain

---

## Verification checklist

- [ ] Every `.md` file in the plugin was read
- [ ] Factual claims systematically extracted (not just obvious ones)
- [ ] Each claim searched against current sources
- [ ] At least one authoritative source cited per verified/outdated/incorrect claim
- [ ] Claims categorized consistently
- [ ] High-impact claims (limits, versions, feature support) prioritized
- [ ] Report distinguishes "outdated" from "incorrect"

---

## Cross-references

- [Content type comparison matrix](../../docs/clankgster-context-engineering-content-type-comparison-matrix.md) — dense with factual claims, high-priority target
- [Prompt techniques](../../references/clankgster-context-engineering-prompt-techniques.md) — contains technique references that may need verification
- [Tool calls](../../references/clankgster-context-engineering-tool-calls.md) — tool availability claims to verify
