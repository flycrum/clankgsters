---
name: common-auditing-internal-links
description: >-
  Audits all internal/relative markdown links within a plugin to verify targets
  exist and link text matches content. Uses Grep to extract markdown links from
  every .md file, resolves relative paths, and checks each target with Glob.
  Produces a broken links table with source file, link text, target path, and
  status. Triggers — "check internal links", "audit plugin links", "find broken
  links", "verify markdown references", broken link scan, link validation.
---

# Audit internal links

Check all internal/relative markdown links within a plugin to ensure targets exist and link text accurately describes the target.

## Scope

Scans all `.md` files in a single plugin directory. Checks only relative links (paths starting with `./`, `../`, or bare filenames) — not external URLs. For external URL checks, use common-auditing-external-links.

## Out of scope

- External URLs (http/https)
- Anchor links within the same file (`#section`)
- Image links (unless they are relative paths to .md files)

---

## Pre-checks

**STOP** if no plugin path is provided. Use AskUserQuestion to request it.

**STOP** if the target directory does not exist.

---

## 1. Find all markdown files

Use Glob to list all `.md` files:

```md
<plugin-path>/**/*.md
```

---

## 2. Extract relative links

For each `.md` file, use Grep with pattern:

```md
\[([^\]]+)\]\(([^)]+)\)
```

Filter results to relative paths only — exclude links starting with `http://`, `https://`, or `#`.

---

## 3. Resolve and check each link

<instructions>
For each relative link found:

1. **Resolve path** — compute the absolute path from the source file's directory + the relative link target
2. **Check existence** — use Glob to verify the target file exists
3. **Content match** — if the target exists, use Read to load the first 20 lines and verify the link text reasonably describes the content (check H1 heading or purpose line)
4. **Record status:**
   - **OK** — target exists and link text matches
   - **Broken** — target file does not exist
   - **Mismatch** — target exists but link text does not match content
   - **Ambiguous** — cannot determine if link text matches (note for manual review)
</instructions>

---

## 4. Produce broken links table

Output:

```markdown
## Internal links audit: <plugin-name>

**Files scanned:** N
**Links checked:** N
**Broken:** N | **Mismatch:** N | **OK:** N

| Source | Link Text | Target | Status | Notes |
|--------|-----------|--------|--------|-------|
| rules/topic.md | Prompt techniques | ../../references/prompt-techniques.md | Broken | File not found |
| skills/x/SKILL.md | Writing rules | ../../rules/writing-rules.md | Mismatch | H1 says "Rule conventions" |
| ... | ... | ... | ... | ... |
```

Show broken and mismatch links first. Optionally omit OK links if there are more than 20.

---

## Verification checklist

- [ ] Every `.md` file in the plugin was scanned for links
- [ ] Only relative links checked (external URLs excluded)
- [ ] Each link's target path correctly resolved relative to source file location
- [ ] Broken links confirmed by attempting to read the resolved path
- [ ] Link text vs content match checked for existing targets
- [ ] Report includes total counts (scanned, checked, broken, mismatch, OK)

---

## Cross-references

- [Progressive disclosure](../../references/common-progressive-disclosure.md) — cross-reference layering patterns
- [Organizing plugin content](../../rules/common-organizing-content.md) — expected directory structure for path resolution
