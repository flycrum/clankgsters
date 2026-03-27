---
name: plugins-write-context
description: >-
  Writes source pathway `plugins/` content from raw input using a draft/refine/
  finalize workflow. Use when creating or expanding a plugin with coordinated
  skills, rules, references, docs, and manifests.
---

# Write plugin context

## Scope

Create or expand plugin content under source pathway `plugins/`.

This skill is a direct execution workflow and is also the target of MCP route `plugins.write` (`PluginsWrite`).

## Steps

1. Gather input (text, files, URLs).
2. Classify by plugin content type (`skills/`, `rules/`, `references/`, `docs/`).
3. Plan file list and cross-links.
4. Draft files.
5. Refine descriptions and references.
6. Finalize and verify naming/link integrity.

## Verification

- [ ] Output is in source pathway `plugins/`
- [ ] Skills include valid frontmatter
- [ ] Rules are conventions (not workflows)
- [ ] References/docs are linked and non-duplicative

## Cross-references

- [common-content-type-decision-tree.md](../../docs/common-content-type-decision-tree.md)
- [common-content-type-comparison-matrix.md](../../docs/common-content-type-comparison-matrix.md)
- [common-write-skills.md](../../rules/common-write-skills.md)
- [common-write-rules.md](../../rules/common-write-rules.md)
