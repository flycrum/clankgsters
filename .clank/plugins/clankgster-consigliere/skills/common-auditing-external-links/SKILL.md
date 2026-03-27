---
name: common-auditing-external-links
description: >-
  Audits all external URLs (http/https) in plugin markdown files to verify they
  are accessible. Uses Grep to extract URLs, then WebFetch to check each one.
  Flags 404s, redirects, timeouts, and unreachable hosts. Produces an external
  links status table with file, URL, HTTP status, and notes. Triggers — "check
  external links", "audit URLs", "find dead links", "verify external references",
  URL validation, external link scan.
---

# Audit external links

Check all external URLs in plugin files to ensure they are still accessible.

## Scope

Scans all `.md` files in a single plugin directory. Checks only external links (`http://` and `https://`). For relative/internal link checks, use common-auditing-internal-links.

## Out of scope

- Relative/internal links
- Content accuracy of linked pages (use common-auditing-source-freshness)
- URLs in non-markdown files

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

## 2. Extract external URLs

Use Grep on each file with pattern:

```md
https?://[^\s)\]>"]+
```

Deduplicate URLs — track which files reference each URL but check each URL only once.

---

## 3. Check each URL

<instructions>
For each unique URL:

1. Use WebFetch to request the URL
2. Record the result:
   - **OK** — page loads successfully (2xx status)
   - **Redirect** — page redirects (3xx) — note the destination
   - **Not Found** — 404 response
   - **Error** — 5xx, timeout, DNS failure, or connection refused
   - **Auth Required** — 401/403 (may be valid but inaccessible)

Rate-limit: if checking more than 10 URLs, process in batches of 5 to avoid triggering rate limits.

For redirects, note if the redirect target is substantially different (domain change, path change) vs minor (http->https, trailing slash).
</instructions>

---

## 4. Produce external links table

Output:

```markdown
## External links audit: <plugin-name>

**Files scanned:** N
**Unique URLs checked:** N
**OK:** N | **Redirect:** N | **Broken:** N | **Error:** N

| File(s) | URL | Status | Notes |
|---------|-----|--------|-------|
| rules/topic.md | https://example.com/old-page | Not Found | 404 — page removed |
| docs/research.md, references/ref.md | https://docs.cursor.com/api | Redirect | -> /api/v2 |
| ... | ... | ... | ... |
```

Show broken and error links first. Group files that share the same URL.

---

## Verification checklist

- [ ] Every `.md` file in the plugin was scanned for URLs
- [ ] URLs correctly extracted (no partial matches or false positives)
- [ ] Each unique URL fetched at least once
- [ ] Results categorized consistently (OK, Redirect, Not Found, Error, Auth Required)
- [ ] Redirect destinations noted
- [ ] Report includes total counts

---

## Cross-references

- [Prompt techniques](../../references/common-prompt-techniques.md) — source URLs referenced in plugin content
