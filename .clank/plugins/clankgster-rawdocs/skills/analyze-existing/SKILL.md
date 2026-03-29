---
name: rawdocs-analyze-existing
description: >-
  Analyzes the current structure and writing conventions of a target plugin
  while strictly excluding its `rawdocs/` directory. Produces an extensive
  continuity-focused package (sitemap, style profile, file-purpose summaries,
  and evolution guidance) for downstream structural sync planning. Returns "New and or
  empty" flow guidance when the plugin has no authored content outside rawdocs.
disable-model-invocation: true
user-invocable: false
---

# rawdocs analyze existing

## Scope

Analyze all current plugin content except `rawdocs/`, recursively.

This skill provides continuity context and structure guidance for structural sync planning. **Continuity output is descriptive:** the parent workflow (`rawdocs-struct-sync`) may still classify paths as untraceable to current rawdocs and plan removal; do not imply that every existing file must be preserved.

## Absolute boundaries

- Exclude `target_rawdocs_path` completely.
- Do not read or summarize content from `rawdocs/`.
- Prefer high-level purpose/outline summaries over detailed textual extraction.

## 1) Build plugin sitemap excluding rawdocs

1. Recursively list plugin files/folders.
2. Remove `rawdocs/` subtree from candidate set.
3. Return filtered sitemap.

## 2) Determine empty/near-empty state

If filtered sitemap has no meaningful authored content:

- return status: `New and or empty`
- stop further file-reading steps
- advise parent workflow to proceed from-scratch structural sync

## 3) Read remaining text-based files

If plugin is not empty:

1. Read text-based files recursively.
2. Skip non-text files and list them.
3. For each text file, return only:
   - general purpose
   - major section outline
   - critical format/style notes

Do not over-quote specific text.

## 4) Extract continuity profile

Capture:

- folder organization patterns
- naming conventions
- style/tone profile
- quote/header habits
- continuity anchors worth preserving **when still aligned with rawdocs** (downstream planner performs traceability)
- areas that appear ready for structural scaling

## 5) Return output package

Return an extensive package with:

1. Scope confirmation (`rawdocs` excluded)
2. Filtered sitemap
3. Empty/non-empty classification
4. File-purpose and section-outline summaries (if non-empty)
5. Style/continuity profile
6. Evolution candidates + caution points

## Verification

- [ ] `rawdocs/` subtree was excluded from analysis
- [ ] Empty plugin branch handled correctly when applicable
- [ ] Summaries remain high-level and non-extractive
- [ ] Style profile includes heading and quote conventions

