---
name: auditing-comparison-matrix
description: >-
  Specialized audit for the content type comparison matrix document. Verifies
  each cell's accuracy against current Claude Code, Cursor, and Codex
  documentation using WebFetch and WebSearch. Checks footnote integrity (every
  [^N] has a matching definition, no orphans), validates section header links
  to 1:1 docs files, and confirms 1:1 docs content matches matrix data.
  Produces a matrix audit report per section and cell. Triggers — "audit
  comparison matrix", "verify matrix", "check matrix accuracy", "validate
  content type table", matrix review, comparison table audit.
---

# Audit comparison matrix

Verify accuracy of the content type comparison matrix against current platform documentation, check footnote integrity, and validate linked 1:1 docs files.

## Scope

Targets the specific file `docs/clankgster-context-engineering-content-type-comparison-matrix.md` within the clankgster-context-engineering plugin. Also checks any 1:1 docs files the matrix links to.

## Out of scope

- Other plugin files (use auditing-content-quality or auditing-fact-check for those)
- Matrix formatting or style (use auditing-content-quality)
- Plugin structure (use auditing-plugin-structure)

---

## Pre-checks

**STOP** if the matrix file does not exist at the expected path. Use Read to check:

```
<plugin-path>/docs/clankgster-context-engineering-content-type-comparison-matrix.md
```

Tell the user the file path if not found.

---

## 1. Read the matrix file

Use Read to load the full matrix document. Parse:

- All table sections and their headers
- Every cell value in each table
- All footnote references (`[^N]`) in table cells
- All footnote definitions at the bottom
- All section header links to 1:1 docs files

---

## 2. Verify cell accuracy

<instructions>
For each table section (e.g., loading behavior, file types, platform support):

1. Identify the factual claims in each cell
2. Use WebSearch to find current official documentation for:
   - Claude Code (Anthropic docs, Claude Code GitHub)
   - Cursor (docs.cursor.com, cursor changelog)
   - Codex (OpenAI Codex docs)
3. Use WebFetch on the most relevant results
4. Compare each cell value against current documentation
5. Record:
   - **Accurate** — cell matches current docs
   - **Outdated** — was correct, now changed
   - **Incorrect** — does not match any version of docs
   - **Unverifiable** — no official source found
</instructions>

---

## 3. Check footnote integrity

<instructions>
1. Extract all footnote references from table cells: `[^1]`, `[^2]`, etc.
2. Extract all footnote definitions from the bottom of the file: `[^1]:`, `[^2]:`, etc.
3. Check for:
   - **Orphan references** — `[^N]` in a cell with no matching `[^N]:` definition
   - **Orphan definitions** — `[^N]:` definition with no `[^N]` reference in any cell
   - **Numbering gaps** — missing numbers in the sequence
   - **Duplicate definitions** — same `[^N]` defined more than once
</instructions>

---

## 4. Validate section header links

<instructions>
For each table section header that links to a 1:1 docs file:

1. Extract the relative link path
2. Resolve to absolute path
3. Use Read to check if the file exists
4. If it exists, compare key data points between the matrix table and the 1:1 doc:
   - Do they agree on the same facts?
   - Does the 1:1 doc have information the matrix omits (expected — matrix is summary)
   - Does the matrix have information the 1:1 doc contradicts (problem)
</instructions>

---

## 5. Produce matrix audit report

Output:

```markdown
## Matrix audit: content-type-comparison-matrix

### Cell accuracy

| Section | Cell | Current Value | Verified Value | Source | Status |
|---------|------|---------------|----------------|--------|--------|
| Loading | Claude Code / rules | "Always loaded" | Confirmed | docs.anthropic.com | Accurate |
| Limits | Cursor / description | "200 chars" | Now 500 chars | docs.cursor.com | Outdated |
| ... | ... | ... | ... | ... | ... |

### Footnote integrity

| Check | Status | Details |
|-------|--------|---------|
| Orphan references | Pass | All [^N] have definitions |
| Orphan definitions | Warn | [^7] defined but not referenced |
| Numbering gaps | Pass | Sequential 1-12 |
| Duplicates | Pass | No duplicates |

### Section header links

| Section | Link Target | Exists | Content Match |
|---------|-------------|--------|---------------|
| Rules | docs/rules-detail.md | Yes | Consistent |
| Skills | docs/skills-detail.md | No | Broken link |
| ... | ... | ... | ... |
```

---

## Verification checklist

- [ ] Full matrix file read and parsed
- [ ] Every table cell with a factual claim checked against current docs
- [ ] All three platforms verified where applicable (Claude Code, Cursor, Codex)
- [ ] All footnote references matched against definitions (both directions)
- [ ] All section header links resolved and target files checked
- [ ] 1:1 docs content compared against matrix data for consistency
- [ ] Sources cited for each verification

---

## Cross-references

- [Content type comparison matrix](../../docs/clankgster-context-engineering-content-type-comparison-matrix.md) — the target file for this audit
- [Content type decision tree](../../docs/clankgster-context-engineering-content-type-decision-tree.md) — related content type documentation
- [Tool calls](../../references/clankgster-context-engineering-tool-calls.md) — platform-specific tool documentation
