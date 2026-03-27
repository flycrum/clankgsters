---
name: auditing-source-freshness
description: >-
  Audits whether external documentation sources referenced in plugin files are
  still current. Fetches each source URL with WebFetch, compares key facts
  against plugin claims, and flags discrepancies — new information added,
  information removed, or details changed. Corroborates findings via WebSearch
  when possible. Produces a freshness report with source URL, plugin claim,
  current state, and recommended action. Triggers — "check source freshness",
  "are my sources outdated?", "audit references for staleness", freshness
  check, source currency review, documentation drift.
---

# Audit source freshness

Check whether external documentation sources have been updated since plugin content was written, and flag any drift between source and plugin claims.

## Scope

Targets documentation URLs (official docs, guides, spec pages) referenced in a plugin's `.md` files. Compares current source content against what the plugin states. Report only.

## Out of scope

- Link accessibility (use auditing-external-links for that)
- Non-documentation URLs (GitHub issues, social media, blogs unless they are primary sources)
- Internal/relative links

---

## Pre-checks

**STOP** if no plugin path is provided. Use AskUserQuestion to request it.

**STOP** if the target directory does not exist.

---

## 1. Find all markdown files

Use Glob:

```md
<plugin-path>/**/*.md
```

---

## 2. Extract documentation URLs

Use Grep to find all external URLs in `.md` files. Filter to documentation sources:

- Official docs domains (docs.*.com, *.readthedocs.io, developer.*, etc.)
- README/wiki pages on GitHub
- Specification pages
- Any URL that appears to be a documentation reference (context: used to support a claim)

Use Read to load the surrounding context (3-5 lines around each URL) to understand what claim the plugin makes based on that source.

---

## 3. Fetch and compare

<instructions>
For each documentation URL:

1. Use WebFetch to load the current page content
2. Identify key facts the plugin references from this source:
   - Feature support / availability
   - Configuration options or syntax
   - Version numbers or requirements
   - Behavior descriptions
   - Limits or constraints
3. Compare each fact against the current source content
4. Record discrepancies:
   - **Changed** — source says something different now
   - **Removed** — information no longer present in source
   - **Added** — source has new relevant information the plugin does not cover
   - **Unchanged** — plugin claim matches current source
5. When a discrepancy is found, use WebSearch to corroborate with a second source if possible
</instructions>

---

## 4. Produce freshness report

Output:

```markdown
## Source freshness audit: <plugin-name>

**URLs checked:** N
**Up to date:** N | **Changed:** N | **Removed:** N | **New info:** N

| Source URL | Plugin Claim | Current State | Action Needed |
|------------|--------------|---------------|---------------|
| https://docs.example.com/config | "Supports max 5 items" | Now supports 10 items (updated Jan 2026) | Update claim in rules/topic.md line 42 |
| https://docs.example.com/api | "API v2 required" | API v3 released, v2 deprecated | Update reference and test compatibility |
| ... | ... | ... | ... |
```

---

## 5. Recommendations

After the table, provide:

1. **Urgency ranking** — which updates matter most (breaking changes > new features > minor wording)
2. **Specific edits** — file, line, old text, suggested new text
3. **Sources to monitor** — URLs that change frequently and may need periodic re-checking

---

## Verification checklist

- [ ] All documentation URLs in the plugin were identified and checked
- [ ] Surrounding context read to understand each plugin claim
- [ ] Current source content fetched and compared
- [ ] Discrepancies categorized (changed, removed, added, unchanged)
- [ ] At least one discrepancy corroborated with a second source via WebSearch
- [ ] Recommendations include specific file and line references
- [ ] Report distinguishes cosmetic changes from substantive ones

---

## Cross-references

- [Prompt techniques](../../references/clankgster-context-engineering-prompt-techniques.md) — techniques sourced from external documentation
- [Content type comparison matrix](../../docs/clankgster-context-engineering-content-type-comparison-matrix.md) — heavily sourced from external docs, prime freshness candidate
